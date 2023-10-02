import { accessTokenType } from "../types/web3.js";
import { accessToken as accessTokenContract } from "../src/contracts.js";
import QRCode from "qrcode";

export const qrCodeCreator = async (ctx) => {
  try {
    console.log("-------------------------------------");
    console.log();
    console.log("== QR Code Creator ==");
    console.log();
    console.log("The Retrieved Data (Address): ", ctx.req.body);

    const userAddress = ctx.req.body.userAddress;

    // TODO:
    // 1. Call Access Token Smart Contract ...
    // This creates an Access Token inside the Contract
    const accessTokenId = await accessTokenContract.mintToken(userAddress);
    console.log("The Minted Token ID: ", accessTokenId);

    // This get the Data
    const accessTokenData = await accessTokenContract.getTokenData(
      accessTokenId
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
