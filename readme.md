# Multisig Wallet Script


## Quick Demo
https://github.com/user-attachments/assets/cc186068-7a59-48ca-85e8-2ee2ae43265a

## What This Script Does

This script completes Competency Test 1 by doing the following in Bitcoin’s regtest environment:
- Bootstraps a 2-of-2 multisig wallet using `bitcoinjs-lib` and `bip32` with a fixed seed, ensuring the same wallet address is generated every time.
- Funds the wallet with BTC by mining blocks and sending coins.
- Creates a transaction to spend from the multisig wallet to a new address.
- Signs the transaction with both private keys (since it’s a 2-of-2 multisig).
- Broadcasts the transaction to the regtest network and confirms it by mining a block.
- Logs the wallet’s transaction history, showing both the funding and spending transactions.

## Prerequisites

To run this script, you’ll need a few things set up:
- **Docker and Docker Compose**: I’ve included a `docker-compose.yml` file to run Bitcoin Core in regtest mode. Install Docker from [docker.com](https://www.docker.com/get-started/) if you don’t have it.
- **Node.js and npm**: I used Node.js v18 and npm v9. You can grab them from [nodejs.org](https://nodejs.org/).
- **TypeScript**: Since the script is written in TypeScript, you’ll need it installed globally:

## Project Structure

Here's how I've organized the project:
- The `src/` folder keeps the code organized into separate files: `client.ts` for the Bitcoin Core connection, `wallet.ts` for wallet-related logic, `transaction.ts` for transaction handling, and `multisigWallet.ts` to tie it all together.
- The `docker-compose.yml` file sets up a Bitcoin Core node in regtest mode, so you don’t have to configure it manually.
- The `dist/` folder is created when you compile the TypeScript code with `tsc`.


## Key Dependencies

I used a few key packages to make this script work smoothly:
- **bitcoinjs-lib**: For creating the multisig wallet, generating key pairs, and handling transactions (like PSBTs). It’s a go-to library for Bitcoin scripting.
- **bip32**: For deterministic key generation using a fixed seed, aligning with bip32 standard for reproducible wallet creation.
- **bitcoin-core**: To interact with Bitcoin Core via RPC—super useful for mining blocks and broadcasting transactions in regtest.
- **ecpair** and **tiny-secp256k1**: For securely generating and managing key pairs, which are required for the multisig wallet.

You can see the full list and versions in `package.json`. I also added type definitions (`@types/bitcoinjs-lib`, `@types/node`) as dev dependencies for better TypeScript support.

## Setup and Running the Script

Let’s get this script running! I’ve made the setup as simple as possible with Docker Compose. Follow these steps:

1. **Clone the Repo** (or copy the files to your machine):
2. **Install Dependencies**: `npm install`
3. **Start Bitcoin Core with Docker Compose**: `docker compose up -d`

This will:
- Pull the `ruimarinho/bitcoin-core:alpine` image.
- Start a Bitcoin Core node in regtest mode on port `18443`.
- Mount a volume (`bitcoin-data`) to persist the blockchain data.
- Use the credentials `rpcuser=abhishek` and `rpcpassword=abhishek` (these match the script’s config in `client.ts`).

You can check the logs with: `docker logs bitcoind-regtest

- If you need to reset the regtest environment, stop the container and remove the volume: `docker compose down -v`

4. **Compile the TypeScript Code**: `npm run build`
5. **Run the Script**: `npm start`
6. **Check the Output**:
   
The script will log each step as it:
- Creates the multisig wallet.
- Funds it with 0.01 BTC.
- Creates, signs, and broadcasts a transaction.
- Logs the wallet history.


## Challenges and Learnings

Building this script taught me a lot:
- I learned how to sign a 2-of-2 multisig transaction using PSBTs, which was tricky but rewarding.
- I faced a signing issue where `bip32` returned signatures as Uint8Array, but `bitcoinjs-lib` expected Buffer.
- Using `importaddress` to track the multisig wallet in Bitcoin Core was a new concept for me.
- Setting up Docker Compose to run Bitcoin Core made the setup process much smoother I hope it helps you too!

Thanks for taking the time to review my submission!

Abhishek Raj

