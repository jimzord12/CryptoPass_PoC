import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import "dotenv/config";

// Production
import { web3auth } from "../handlers/web3Auth.js";
import { getRole } from "../handlers/getRole.js";
import { qrCodeCreator } from "../handlers/QRGenerator.js";
import { createSBT } from "../handlers/createSBT.js";
import { useAccessToken } from "../handlers/useAccessToken.js";
import { qrCodeValidator } from "../handlers/QRValidator.js";

// Testing
import { web3authTest } from "../tests/functions/web3auth.test.js";
import { qrCodeCreator as QR_Tester } from "../tests/functions/QRGenerator.test.js";

import { providerInitSuccessful } from "./contracts.js";
// import { cryptoPassAbi, accessTokenAbi } from "../web3/cryptopass/index.js";

const cryptopass = new Hono();
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

  cryptopass.post("/createSBT", createSBT);

  cryptopass.post("/qrCodeCreator", qrCodeCreator);
  cryptopass.post("/qrCodeValidator", qrCodeValidator);

  cryptopass.post("/useAccessToken", useAccessToken);

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
