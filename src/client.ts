import BitcoinCore from 'bitcoin-core'

const config = {
  username: process.env.BITCOIN_RPC_USER || "abhishek",
  password: process.env.BITCOIN_RPC_PASSWORD || "abhishek",
  host: process.env.BITCOIN_RPC_HOST || "127.0.0.1",
  port: process.env.BITCOIN_RPC_PORT || 18443,
  network: "regtest"
} as any

const fullhost = `http://${config.host}:${config.port}/`

export const client = new BitcoinCore({
    username: config.username,
    password: config.password,
    host: fullhost,
    port: config.port,
    network: config.network,
  } as any);
  
export async function testRpcConnection(): Promise<void> {
  const maxRetries = 10;
  const retryDelay = 2000;

  for(let attempt = 1; attempt<=maxRetries; attempt++){
    try {
      console.log(`attemp: ${attempt}:${maxRetries}`)

      const response = await client.command("getblockchaininfo");

      console.log("Lfgg connected to bitcoin core")
      console.log(`network: ${response.chain}`)
      console.log(`blocks: ${response.blocks}`)
      console.log(`blockhash: ${response.bestblockhash}`)

      return
      
    } catch (error: any) {
      console.log(`attemp: ${attempt} failed: ${error.message}`)

      if(attempt === maxRetries){
        console.error("failed to connect to bitcoin core")

        process.exit(1)
      }

      console.log(`waiting ${retryDelay/1000}s before retry`)

      await new Promise(resolve => setTimeout(resolve,retryDelay))
      
    }
  }
}