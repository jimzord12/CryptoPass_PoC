import { ethers } from "ethers";
import { providerInitSuccessful } from "../src/contracts.js";
// import { generateAndSign } from "../tests/functions/web3auth.test";

export const web3auth = async (ctx) => {
  if (providerInitSuccessful === false) {
    ctx.status(500);
    return ctx.json({
      success: false,
      error: "⛔ Error: The Provider's Server is Down for the count",
    });
  }
  const body = await ctx.req.json();
  try {
    console.log("-------------------------------------");
    console.log();
    console.log("Retrieving the Auth Data...");
    console.log();
    console.log("The Retrieved Data: ", body);

    const message = body.nonce;
    const userAddress = body.userAddress;
    const signedMessage = body.signedMessage;

    console.log();
    console.log("Hashing the Message...");
    console.log();
    console.log("-------------------------------------");

    const messageHash = ethers.hashMessage(message);
    const recoveredAddress = ethers.recoverAddress(messageHash, signedMessage);

    if (recoveredAddress.toLowerCase() === userAddress.toLowerCase()) {
      console.log();
      console.log("All Good!");
      console.log();
      console.log("-------------------------------------");
      ctx.status(200);
      return ctx.json({ verified: true });
    } else {
      console.log();
      console.log("Auth failed!");
      console.log();
      console.log("-------------------------------------");
      ctx.status(400);

      return ctx.json({ verified: false });
    }
  } catch (error) {
    console.error("Error verifying signed message:", error);
    ctx.status(500);

    return ctx.json({ message: "Failed to verify signed message" });
  }
};
