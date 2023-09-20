import { accessTokenType } from "../types/web3";
import QRCode from "qrcode";

export const qrCodeCreator = (ctx) => {
  try {
    console.log("-------------------------------------");
    console.log();
    console.log("Retrieving the Auth Data...");
    console.log();
    console.log("The Retrieved Data: ", ctx.req.body);

    const userAddress = ctx.req.body.userAddress;

    // TODO:
    // 1. Call QR CODE Smart Contract ...
    // This creates an Access Token inside the Contract
    // 2. Store the Result, which is of type: (accessTokenType) see ../types/web3
    const accessToken: accessTokenType = null;

    ctx.status(200);
    ctx.json({ At: accessToken, success: true });
  } catch (error) {
    console.error("Error verifying signed message:", error);
    return ctx.res
      .status(500)
      .json({ message: "Failed to verify signed message", success: false });
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
