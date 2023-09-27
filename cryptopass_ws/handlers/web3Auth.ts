import { ethers, getNumber } from "ethers";
import { cryptoPass } from "../src/index.js";
// import { generateAndSign } from "../tests/functions/web3auth.test";

export const web3auth = async (ctx) => {
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

export const getRole = async (ctx) => {
  // const body = await ctx.req.json();

  const { address } = await ctx.req.json();

  if (address.length < 20)
    throw new Error(`⛔ Request has invalid Data: [${address}]`);
  try {
    const howIsMsgSender = await cryptoPass.showMsgSender();
    console.log("The Msg.Sender: ", howIsMsgSender);

    const _userRole = await cryptoPass.getUserRole(address);
    const serialisedBigNum = getNumber(_userRole);
    console.log("The Role from CryptoPass: ", serialisedBigNum);
    ctx.status(200);

    return ctx.json({ userRole: serialisedBigNum });
  } catch (error) {
    console.error("⛔ Error while getting the SBT from CryptoPass:", error);
    ctx.status(500);

    return ctx.json({ error: "⛔ Failed to get the SBT from CryptoPass" });
  }
};
