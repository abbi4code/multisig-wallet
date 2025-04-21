import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import ECPairFactory from "ecpair";
import { regtest } from "bitcoinjs-lib/src/networks";
import {client} from "./client"
import {BIP32Factory} from "bip32"



const network = regtest;
const ECPair = ECPairFactory(ecc);
const bip32 = BIP32Factory(ecc)
const seed = Buffer.from("taking-abhishek-as-seed")
const root = bip32.fromSeed(seed,network);

export async function createWallet(): Promise<void> {
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

export async function createMultisigWallet() {
  try {
    const child1 = root.derivePath("m/0/0");
    const child2= root.derivePath("m/0/1");

    const keyPair1 = ECPair.fromPrivateKey(Buffer.from(child1.privateKey!), {network});
    const keyPair2 = ECPair.fromPrivateKey(Buffer.from(child2.privateKey!), {network});


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
    console.log("++++++++++++++",p2wsh.output)

    return { keyPair1, keyPair2, pubkeys, p2msScript, address: p2wsh.address };
  } catch (error) {
    console.error("Error in createMultisigWallet:", error);
    throw error;
  }
}
