import { getNumber } from "ethers";
import { cryptoPass } from "../src/contracts.js";

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
