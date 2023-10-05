import { getNumber } from "ethers";
import { cryptoPass, providerInitSuccessful } from "../src/contracts.js";

export const getRole = async (ctx) => {
  if (providerInitSuccessful === false) {
    ctx.status(500);
    return ctx.json({
      success: false,
      error: "⛔ Error: The Provider's Server is Down for the count",
    });
  }
  // const body = await ctx.req.json();

  const { address } = await ctx.req.json();

  if (address.length < 20)
    throw new Error(`⛔ Request has invalid Data: [${address}]`);
  try {
    const howIsMsgSender = await cryptoPass.showMsgSender();
    console.log("The Msg.Sender: ", howIsMsgSender);
    console.log();
    console.log("=== GET ROLE ===");
    console.log();

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
