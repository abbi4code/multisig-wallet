# Summer of Bitcoin Compentency Test 1 - Multisig Wallet Script

Hey there! I'm Abhishek, and this is my submission for the Summer of Bitcoin Compentency Test 1 for the "Improve Testing of Caravan" project. I'm super excited to be applying for this program, and I've poured a lot of efforts into making this script clear, functional and easy to run. This README will walk you through what the script does, how to set it up, and how it prepared me for contributing to Caravan. Let's get started!

## What This Script Does

This script completes Competency Test 1 by doing the following in Bitcoin’s regtest environment:
- Bootstraps a 2-of-2 multisig wallet using `bitcoinjs-lib`.
- Funds the wallet with BTC by mining blocks and sending coins.
- Creates a transaction to spend from the multisig wallet to a new address.
- Signs the transaction with both private keys (since it’s a 2-of-2 multisig).
- Broadcasts the transaction to the regtest network and confirms it by mining a block.
- Logs the wallet’s transaction history, showing both the funding and spending transactions.

I’ve written the script in TypeScript to align with Caravan’s tech stack, and I’ve modularized the code into separate files for better readability and maintainability. I also added a Docker Compose setup to make running a Bitcoin Core node as easy as `docker compose up` hope that makes things smoother for you to test!

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
- **bitcoin-core**: To interact with Bitcoin Core via RPC—super useful for mining blocks and broadcasting transactions in regtest.
- **ecpair** and **tiny-secp256k1**: For securely generating and managing key pairs, which are required for the multisig wallet.
- **TypeScript**: To write clean, type-safe code that aligns with Caravan’s stack.

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


## Why This Matters for Caravan

This script isn’t just about completing the test—it’s a stepping stone for the Caravan project! Here’s how it prepares me:
- **TypeScript and Bitcoin RPC**: I used TypeScript and `bitcoin-core` to interact with the regtest network, which matches Caravan’s tech stack and the skills needed for the project.
- **Modular Code**: I split the code into separate files (`wallet.ts`, `transaction.ts`, etc.) to keep it organized, just like Caravan’s structure (e.g., `apps/coordinator` and `packages`).
- **Testing Mindset**: The script includes balance checks and error handling, showing I’m thinking about reliability—crucial for migrating Caravan’s tests to Vitest and adding Playwright E2E tests.

I’m ready to jump into the project goals: migrating at least 50% of Caravan’s tests to Vitest, setting up Playwright for E2E testing (like creating a wallet or signing transactions), and running these tests in GitHub CI to prevent regressions.

## Challenges and Learnings

Building this script taught me a lot:
- I learned how to sign a 2-of-2 multisig transaction using PSBTs, which was tricky but rewarding.
- Using `importaddress` to track the multisig wallet in Bitcoin Core was a new concept for me.
- Setting up Docker Compose to run Bitcoin Core made the setup process much smoother—I hope it helps you too!

## Next Steps

I’m excited to contribute to Caravan! My next steps would be:
- Exploring Caravan’s test suite (likely in `apps/coordinator/tests`) to start the Jest-to-Vitest migration.
- Writing Playwright tests for key flows like wallet creation and transaction signing.
- Setting up GitHub Actions to run Vitest and Playwright tests on every PR.

Thanks for taking the time to review my submission! I’d love to chat more about how I can help improve Caravan’s testing. You can reach me at [abhishek4code@example.com]. 
Thanks for taking the time to review my submission!

— [Abhishek Raj]

