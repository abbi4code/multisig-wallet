import {client} from "./client"


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
      if(utxos.length === 0){
        throw new Error("No UTXOs available to spend");
      }
  
      const firstUTXO = utxos[0];
      const amountTosend = 0.01;
      const change = parseFloat(firstUTXO.amount) - amountTosend - 0.0001;
  
      // create raw transaction
      const rawTx = await client.command("createrawtransaction",[{
        txid: firstUTXO.txid, vout: firstUTXO.vout
      }],
    {[walletData.address]: amountTosend, [newAddress]:change})
  
      const signedTx = await client.command('signrawtransactionwithwallet',rawTx);
  
      const txid = await client.command("sendrawtransaction",signedTx.hex);
  
  
  
  
      //3. Send coins to multisig address
      console.log(
        `Sending ${amountTosend} BTC to multisig address: ${walletData.address}`
      );
  
      //4. So, to confirm this transaction, we need to mine a block
      await client.command("generatetoaddress", 1, newAddress);
      console.log("Transaction confirmed");
  
      //5. Time to verify the transaction
      const txDetails = await client.command("gettransaction", txid);
      console.log("Funding tx details:", txDetails);
  
      return txid;
    } catch (error) {
      console.error("Error in fundWallet:", error);
      throw error;
    }
  }