import { cryptoPass, providerInitSuccessful } from "../src/contracts.js";

export const createSBT = async (ctx) => {
  if (providerInitSuccessful === false) {
    ctx.status(500);
    return ctx.json({
      success: false,
      error: "⛔ Error: The Provider's Server is Down for the count",
    });
  }
  // const body = await ctx.req.json();
  type resType = {
    userAddress: string;
    enumifiedRole: number;
  };

  const request: resType = await ctx.req.json();
  const { userAddress: address, enumifiedRole: role }: resType =
    await ctx.req.json();
  console.log("1. The Received Data (Address): ", address);
  console.log("2. The Received Data: (Role)", role);

  if (address.length < 20)
    throw new Error(`⛔ Request has invalid Data: [${address}]`);
  try {
    // const howIsMsgSender = await cryptoPass.showMsgSender();
    // console.log("The Msg.Sender: ", howIsMsgSender);

    const tx = await cryptoPass.createSBT(address, role);
    await tx.wait();
    console.log(`An SBT was created for: [${address}]`);
    ctx.status(200);

    return ctx.json({ success: true });
  } catch (error) {
    console.error("⛔ Error while creating the SBT", error);
    ctx.status(500);

    return ctx.json({
      success: false,
      error,
      message: "⛔ Error while creating the SBT",
    });
  }
};
