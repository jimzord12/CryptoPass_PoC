import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";

import { web3auth } from "../handlers/web3Auth";
import { qrCodeCreator } from "../handlers/QRGenerator";

// Testing
import { web3authTest } from "../tests/functions/web3auth.test";
import { qrCodeCreator as QR_Tester } from "../tests/functions/QRGenerator.test";

const cryptopass = new Hono();

// function a(ctx) {
//     return ctx.text("Hello Hono!")
// }

cryptopass.get("/", (ctx) =>
  ctx.text(
    `Welcome to my Hono's Project Home Page, \nIs Production Mode: ${
      process.env.IS_PRODUCTION == "yes"
    }`
  )
);

if (process.env.IS_PRODUCTION == "yes") {
  console.log("You are in [PRODUCTION MODE]");

  cryptopass.get("/web3auth", web3auth);
  cryptopass.get("/qrCodeCreator", qrCodeCreator);
 
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
