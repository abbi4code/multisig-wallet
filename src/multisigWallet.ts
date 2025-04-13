import { client, testRpcConnection } from "./client";
import { createMultisigWallet, createWallet } from "./wallet";
import {fundWallet } from "./transaction";

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
