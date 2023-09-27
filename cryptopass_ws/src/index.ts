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
import { abi } from "../web3/cryptopass/index.js";

const cryptopass = new Hono();

const provider = new ethers.JsonRpcProvider(
  "https://sepolia.infura.io/v3/" + process.env.INFURA_SEPOLIA_API_KEY
);

const privateKey = process.env.PRIVATE_KEY;

const cryptoPassContractAddr = process.env.CONTRACT_ADDRESS; // Oracle's address

const cryptoPassAbi = abi.abi; // Replace with your contract's ABI

const wallet = new ethers.Wallet(privateKey, provider);
const walletAddr = wallet.address;
const signer = wallet.connect(provider);
export const cryptoPass = new ethers.Contract(
  cryptoPassContractAddr,
  cryptoPassAbi,
  signer
);

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
