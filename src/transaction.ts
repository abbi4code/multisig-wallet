import * as bitcoin from "bitcoinjs-lib";
import { client } from "./client";
import { regtest } from "bitcoinjs-lib/src/networks";

const network = regtest;

export async function fundWallet(walletData: any): Promise<string> {
  try {
    //1. Generate Coins by mining blocks
    console.log("Generating coins by mining blocks...");
    const newAddress = await client.command("getnewaddress");
    console.log("new_address", newAddress);
    await client.command("generatetoaddress", 101, newAddress);

    //2. Checking the wallet balance
    const spendableBalance = await client.command("getbalance");
    const walletInfo = await client.command("getwalletinfo");
    console.log("Wallet balance details:", {
      spendable: spendableBalance,
      immature: walletInfo.immature_balance,
      total: walletInfo.balance + walletInfo.immature_balance,
    });

    const utxos = await client.command("listunspent");
    if (utxos.length === 0) {
      throw new Error("No UTXOs available to spend");
    }

    const firstUTXO = utxos[0];
    const amountTosend = 0.01;
    const change = parseFloat(firstUTXO.amount) - amountTosend - 0.0001;

    // create raw transaction
    const rawTx = await client.command(
      "createrawtransaction",
      [
        {
          txid: firstUTXO.txid,
          vout: firstUTXO.vout,
        },
      ],
      { [walletData.address]: amountTosend, [newAddress]: change }
    );

    const signedTx = await client.command(
      "signrawtransactionwithwallet",
      rawTx
    );

    const txid = await client.command("sendrawtransaction", signedTx.hex);

    //3. Send coins to multisig address
    console.log(
      `Sending ${amountTosend} BTC to multisig address: ${walletData.address}`
    );

    //! here
    // import multisig address to ensure it's tracked
    await client.command("importaddress", walletData.address, ",false");

    //4. So, to confirm this transaction, we need to mine a block
    await client.command("generatetoaddress", 1, newAddress);
    console.log("Transaction confirmed");

    //5. Time to verify the transaction
    const txDetails = await client.command("gettransaction", txid);
    console.log("Funding tx details:", txDetails);

    //6. checking multisig balance
    const multisigUtxos = await client.command("listunspent", 0, 9999999, [
      walletData.address,
    ]);
    const multisigBalance = multisigUtxos.reduce(
      (sum: Number, utxo: any) => sum + utxo.amount,
      0
    );
    console.log(
      `Multisig address balance (${walletData.address}): ${multisigBalance} BTC`
    );

    return txid;
  } catch (error) {
    console.error("Error in fundWallet:", error);
    throw error;
  }
}

export async function createTransaction(
  walletData: any,
  fundingTxid: string
): Promise<any> {
  try {
    //1. Fetching the UTXO details from the multisig address
    const utxos = await client.command("listunspent", 0, 9999999, [
      walletData.address,
    ]);

    if (utxos.length === 0) {
      throw new Error("No UTXOs found for multisig address");
    }

    // ^ does i am using the last utxo that made while sending btc to this multisig wallet address
    const utxo = utxos.find((u: any) => u.txid === fundingTxid);
    if (!utxo) {
      throw new Error("Funding tx UTXO not found");
    }

    console.log("UTXO to spend:", utxo);

    //^ Creating new address to send the funds to
    const recipentAddress = await client.command("getnewaddress");
    console.log("Recipent Address:", recipentAddress);

    //deducting a small fee
    const amountTosend = utxo.amount - 0.0001;
    if (amountTosend <= 0) {
      throw new Error("UTXO amount too small to cover the fee");
    }

    //4. creating a PSBT(Partially Signed Bitcoin Tx)
    const psbt = new bitcoin.Psbt({ network });

    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        script: Buffer.from(utxo.scriptPubKey, "hex"),
        value: Math.round(utxo.amount * 1e8), // convert BTC to satoshis
      },
  
      witnessScript: walletData.p2msScript.output,
    });
    psbt.addOutput({
      address: recipentAddress,
      value: Math.round(amountTosend * 1e8),
    });

    console.log("PSBT created: ", psbt.toBase64());

    return { psbt, recipentAddress };
  } catch (error) {
    console.error("Error in createTransaction:", error);
    throw error;
  }
}
