import { accessTokenType } from "../types/web3.js";
import {
  accessToken as accessTokenContract,
  providerInitSuccessful,
} from "../src/contracts.js";
// import QRCode from "qrcode";
import { getNumber } from "ethers";

export const qrCodeCreator = async (ctx) => {
  if (providerInitSuccessful === false) {
    ctx.status(500);
    return ctx.json({
      success: false,
      error: "⛔ Error: The Provider's Server is Down for the count",
    });
  }
  try {
    const request = await ctx.req.json();
    const { userAddress } = request;
    console.log("-------------------------------------");
    console.log();
    console.log("== QR Code Creator ==");
    console.log();
    console.log("The Retrieved Data (Address): ", request);

    await accessTokenContract.mintToken(userAddress);

    const accessTokenId = await accessTokenContract.getTokenId(userAddress);
    console.log("The Minted Token ID: ", accessTokenId);

    // This get the Data
    const accessTokenData = await accessTokenContract.getTokenData(
      getNumber(accessTokenId)
    );
    console.log("The Obtained TokenData: ", accessTokenData);

    // 2. Convert to JS Obj
    // This is sent to the Frontend to be encoded into a QR Code
    const accessToken: accessTokenType = {
      atId: accessTokenData.id.toString(),
      role: accessTokenData.role.toString(),
      expDate: accessTokenData.exp.toString(), // UNIX Timestamp
    };
    console.log("The Converted TokenData: ", accessToken);

    ctx.status(200);
    return ctx.json({ At: accessToken, success: true });
  } catch (error) {
    console.error("Error Generating QR Code:", error);
    ctx.status(500);

    return ctx.json({ message: "Failed to Generate QR Code" });
  }
};

// const generateQRFromObj = async (obj: accessTokenType) => {
//   try {
//     const qrEncode = await QRCode.toDataURL(JSON.stringify(obj));
//     console.log("The Access ObJ: ", obj);
//     console.log("The QR Encoded: ", qrEncode);
//     return qrEncode;
//   } catch (err) {
//     console.error(err);
//   }
// };
