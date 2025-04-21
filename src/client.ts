import BitcoinCore from 'bitcoin-core'

export const client = new BitcoinCore({
    username: "abhishek",
    password: "abhishek",
    host: "http://127.0.0.1:18443/",
    port: 18443,
    network: "regtest",
  } as any);
  
export async function testRpcConnection(): Promise<void> {
    try {
      const blockchainInfo = await client.command("getblockchaininfo");
    } catch (err) {
      console.error("Failed to connect to Bitcoin Core:", err);
      process.exit(1);
    }
  }