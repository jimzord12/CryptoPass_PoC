import { accessTokenType } from "../types/web3.js";
import { accessToken as accessTokenContract } from "../src/contracts.js";
import QRCode from "qrcode";

export const qrCodeValidator = async (ctx) => {
  const tokenData: accessTokenType = ctx.req.body;

  try {
    console.log("-------------------------------------");
    console.log();
    console.log("== QR Code Validator ==");
    console.log();
    console.log("The Retrieved Data (TokenData): ", tokenData);

    // This gets the Data
    try {
      const accessTokenData = await accessTokenContract.getTokenData(
        tokenData.atId
      );
      console.log("The Obtained TokenData: ", accessTokenData);

      const tx = await accessTokenContract.useToken(tokenData.atId);
      await tx.wait();
    } catch (error) {
      //TODO:
      // 1. Check the Error if it is: "CPATK: Token does not exist"
      // 2. Check the Error if it is: "CPATK: Insufficient Access Level"
      // 3. Check the Error if it is: "CPATK: Token has expired"
    }

    ctx.status(200);
    return ctx.json({ success: true });
  } catch (error) {
    console.error("Error Validating QR Code:", error);

    ctx.status(500);
    return ctx.json({ message: "Failed to Validate QR Code", success: false });
  }
};
