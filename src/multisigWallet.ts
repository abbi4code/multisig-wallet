import { client, testRpcConnection } from "./client";
import { createMultisigWallet, createWallet } from "./wallet";
import {broadcastTransaction, createTransaction, fundWallet, logWalletHistory, signTransaction } from "./transaction";

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


  const { psbt, recipentAddress } = await createTransaction(
    walletData,
    fundingTxid
  );
  console.log(
    "Transaction created, ready to sign. Destination address:",
    recipentAddress
  );

  const signedPSBT = await signTransaction(walletData, psbt);
  console.log("signed PSBT", signedPSBT.toBase64());

  const broadcastedTxid = await broadcastTransaction(signedPSBT);
  console.log("Broadcasted transaction ID", broadcastedTxid);

  // Log the wallet history
  await logWalletHistory(walletData, fundingTxid, broadcastedTxid);
  console.log("\nCompetency Test 1 Complete!");


}

main().catch((err) => {
  console.error("Error in main:", err);

  process.exit(1);
});
