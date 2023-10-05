import { accessTokenType2 } from "../types/web3.js";
import {
  accessToken as accessTokenContract,
  providerInitSuccessful,
} from "../src/contracts.js";
import QRCode from "qrcode";

export const qrCodeValidator = async (ctx) => {
  if (providerInitSuccessful === false) {
    ctx.status(500);
    return ctx.json({
      success: false,
      error: "⛔ Error: The Provider's Server is Down for the count",
    });
  }
  const tokenData: accessTokenType2 = await ctx.req.json();

  try {
    console.log("-------------------------------------");
    console.log();
    console.log("== QR Code Validator ==");
    console.log();
    console.log("The Retrieved Data (TokenData): ", tokenData);

    // This gets the Data
    // try {
    const accessTokenData = await accessTokenContract.getTokenData(
      tokenData.decodedData.At.atId
    );
    console.log("The Obtained TokenData: ", accessTokenData);

    const tx = await accessTokenContract.useToken(
      tokenData.decodedData.At.atId
    );
    await tx.wait();
    console.log(
      `The Access Token [${tokenData.decodedData.At.atId}] has been used!`
    );

    // } catch (error) {
    //   //TODO:
    //   // 1. Check the Error if it is: "CPATK: Token does not exist"
    //   // 2. Check the Error if it is: "CPATK: Insufficient Access Level"
    //   // 3. Check the Error if it is: "CPATK: Token has expired"
    // }

    ctx.status(200);
    return ctx.json({ success: true });
  } catch (error) {
    console.error("Error Validating QR Code:", error);

    ctx.status(500);
    return ctx.json({ message: "Failed to Validate QR Code", success: false });
  }
};
