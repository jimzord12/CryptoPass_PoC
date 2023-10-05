import { accessToken, providerInitSuccessful } from "../src/contracts.js";

export const useAccessToken = async (ctx) => {
  if (providerInitSuccessful === false) {
    ctx.status(500);
    return ctx.json({
      success: false,
      error: "⛔ Error: The Provider's Server is Down for the count",
    });
  }
  // const body = await ctx.req.json();
  type resType = {
    atId: number;
  };

  const { atId }: resType = await ctx.req.json();

  try {
    // const howIsMsgSender = await accessToken.showMsgSender();
    // console.log("The Msg.Sender: ", howIsMsgSender);

    const tx = await accessToken.useToken(atId);
    await tx.wait();
    console.log(`The Access Token [${atId}] has been used!`);
    ctx.status(200);

    return ctx.json({ success: true });
  } catch (error) {
    console.error("⛔ Error while trying to use Access Token", error);
    ctx.status(500);

    return ctx.json({
      success: false,
      error: "⛔  Error while trying to use Access Toke",
    });
  }
};
