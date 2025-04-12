import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import ECPairFactory from "ecpair";
import BitcoinCore from "bitcoin-core";
import { regtest } from "bitcoinjs-lib/src/networks";

const network = regtest;
const ECPair = ECPairFactory(ecc);

const client = new BitcoinCore({
  username: "abhishek",
  password: "abhishek",
  host: "http://127.0.0.1:18443/",
  port: 18443,
  network: "regtest",
} as any);

async function testRpcConnection(): Promise<void> {
  try {
    const blockchainInfo = await client.command("getblockchaininfo");
    console.log("Connected to Bitcoin Core:", blockchainInfo);
  } catch (err) {
    console.error("Failed to connect to Bitcoin Core:", err);
    process.exit(1);
  }
}

async function createWallet(): Promise<void> {
  try {
    const walletList = await client.command("listwallets");
    console.log("walletlist", walletList);
    if (walletList.length > 0) {
      console.log("Wallet already loaded:", walletList);
      return;
    }

    await client.command("createwallet","regtest_wallet",false,false,"",false,false);
    console.log("Created wallet: regtest_wallet");
  
  } catch (error) {
    console.error("Error creating wallet:",error);
    throw error;
  }
}

async function createMultisigWallet() {
  try {
    const keyPair1 = ECPair.makeRandom({ network: bitcoin.networks.regtest });
    const keyPair2 = ECPair.makeRandom({ network: bitcoin.networks.regtest });

    const pubkeys = [
      Buffer.from(keyPair1.publicKey),
      Buffer.from(keyPair2.publicKey),
    ];

    const p2msScript = bitcoin.payments.p2ms({
      m: 2,
      pubkeys,
      network,
    });

    const p2wsh = bitcoin.payments.p2wsh({ redeem: p2msScript, network });
    console.log("multisig address:", p2wsh.address);

    return { keyPair1, keyPair2, pubkeys, p2msScript, address: p2wsh.address };
  } catch (error) {
    console.error("Error in createMultisigWallet:", error);
    throw error;
  }
}

async function fundWallet(walletData: any): Promise<string> {
  try {
    //1. Generate Coins by mining blocks
    console.log("Generating coins by mining blocks...");
    const newAddress = await client.command("getnewaddress");
    console.log("new_address", newAddress);
    await client.command("generatetoaddress", 101, newAddress);

    //2. Checking the wallet balance
    const balance = await client.command("getbalance");
    console.log("Wallet balance after mining:", balance, "BTC");

    //3. Send coins to multisig address
    const amountTosend = 1;
    console.log(
      `Sending ${amountTosend} BTC to multisig address: ${walletData.address}`
    );
    const txid = await client.command(
      "sendtoaddress",
      walletData.address,
      amountTosend
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

async function main(): Promise<void> {
  await testRpcConnection();
  await createWallet();
  const walletData = await createMultisigWallet();
  console.log("Wallet data created ", {
    address: walletData.address,
    pubkeys: walletData.pubkeys.map((pk) => pk.toString("hex")),
  });

  const fundingTxid = await fundWallet(walletData);
  console.log("Funding transaction ID:", fundingTxid);
}

main().catch((err) => {
  console.error("Error in main:", err);

  process.exit(1);
});
