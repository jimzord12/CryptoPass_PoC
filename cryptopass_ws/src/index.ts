import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import "dotenv/config";

// Production
import { web3auth, getRole } from "../handlers/web3Auth.js";
import { qrCodeCreator } from "../handlers/QRGenerator.js";

// Testing
import { web3authTest } from "../tests/functions/web3auth.test.js";
import { qrCodeCreator as QR_Tester } from "../tests/functions/QRGenerator.test.js";
import { ethers } from "ethers";
import { cryptoPassAbi, accessTokenAbi } from "../web3/cryptopass/index.js";

const cryptopass = new Hono();

// *** Intinializing Web3 Staff...***

// Getting a provider, a entity (usually a WS) which will given us access to the
// blockchain network. In this case, Infura
const provider = new ethers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/" + process.env.INFURA_SEPOLIA_API_KEY
);

// Creating a Wallet for our WS
const privateKey = process.env.PRIVATE_KEY; // We need a Private key
const wallet = new ethers.Wallet(privateKey, provider); // BY combining a Priv key & the provider we get wallet.
const walletAddr = wallet.address; // Here we extract the Public Address of that Wallet
const signer = wallet.connect(provider); // Here (even though it not be needed) we infused the wallet with the provider
// Which effectively allows us to perform transaction to the network
// NOTE: If you do NOT do this, when performing read-only (calling a Solidity view function)
// call, the msg.sender address will be the zero-address (0x0000...0000) which depending on
// your WS logic, might not be what you want.

const cryptoPassContractAddr = process.env.CRYPTOPASS_CONTRACT_ADDRESS;
const accessTokenContractAddr = process.env.ACCESSTOKEN_CONTRACT_ADDRESS;

const cryptoPassABI = cryptoPassAbi.abi;
const accessTokenABI = accessTokenAbi.abi;

// Creating Contracts
export const cryptoPass = new ethers.Contract(
  cryptoPassContractAddr,
  cryptoPassABI,
  signer
);

export const accessToken = new ethers.Contract(
  accessTokenContractAddr,
  accessTokenABI,
  signer
);

// ### Ultra Important! ###
// 1. Do not forget to make the AccessToken a authorized Personel
// 2. Mint an SBT for AccessToken Contract
// ### Ultra Important! ###

console.log("The WS Wallet Public Addr: ", walletAddr);
// Fetch the balance
provider.getBalance(walletAddr).then((balnaceInWei) => {
  const _balanceEther = ethers.formatEther(balnaceInWei);
  console.log(`Balance of The WS Wallet is: ${_balanceEther} ETH`);
  if (parseFloat(_balanceEther) < 2) {
    console.log("::: YOU MUST SENT ETH -> SERVER :::");
  }
});

cryptoPass._authPersonal(walletAddr).then((hasAuth) => {
  if (!hasAuth) console.log("[BAD]: WS is NOT Authorized by the Contract! ");
  if (hasAuth) console.log("[GOOD]: WS is Authorized by the Contract! ");
});

cryptopass.use("*", cors());
cryptopass.get("/", (ctx) =>
  ctx.text(
    `Welcome to my Hono's Project Home Page, \nIs Production Mode: ${
      process.env.IS_PRODUCTION == "yes"
    }`
  )
);

if (process.env.IS_PRODUCTION == "yes") {
  console.log("You are in [PRODUCTION MODE]");

  cryptopass.post("/web3auth", web3auth);
  cryptopass.post("/retrieve-role", getRole);

  cryptopass.post("/qrCodeCreator", qrCodeCreator);

  console.log();
  console.log("For Web3 Auth Testing: http://localhost:8787/web3auth");
  console.log("For QR Code Testing: http://localhost:8787/qrCodeCreator");
  console.log();
} else {
  // 🧪 TEST MODE
  console.log("You are in [TEST MODE]");

  cryptopass.get("/testing/web3auth", (ctx) => web3authTest(ctx));
  // cryptopass.get("/bagdes/:address", (ctx) => web3authTest(ctx));
  cryptopass.get("/testing/qrCodeCreator", (ctx) => QR_Tester(ctx));

  console.log();
  console.log("For Web3 Auth Testing: http://localhost:8787/testing/web3auth");
  console.log(
    "For QR Code Testing: http://localhost:8787/testing/qrCodeCreator"
  );
  console.log();
}

serve({
  fetch: cryptopass.fetch,
  port: 8787,
});

console.log("Running on: http://localhost:8787/");
