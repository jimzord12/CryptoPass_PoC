import { ethers } from "ethers";
// import { generateAndSign } from "../tests/functions/web3auth.test";

export const web3auth = (ctx) => {
  try {
    console.log("-------------------------------------");
    console.log();
    console.log("Retrieving the Auth Data...");
    console.log();
    console.log("The Retrieved Data: ", ctx.req.body);

    const message = ctx.req.body.nonce;
    const userAddress = ctx.req.body.userAddress;
    const signedMessage = ctx.req.body.signedMessage;

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

      return ctx.res.status(200);
    } else {
      console.log();
      console.log("Auth failed!");
      console.log();
      console.log("-------------------------------------");

      return ctx.res.status(400);
    }
  } catch (error) {
    console.error("Error verifying signed message:", error);
    return ctx.res
      .status(500)
      .json({ message: "Failed to verify signed message" });
  }
};
