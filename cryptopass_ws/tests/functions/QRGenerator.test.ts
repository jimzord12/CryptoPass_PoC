import { accessTokenType } from "../../types/web3.js";
import QRCode from "qrcode";
import { getObjectSize } from "./getMemorySize.js";

export const qrCodeCreator = async (ctx, failOnPurpuse = false) => {
  try {
    console.log("*************************************");
    console.log("======= Testing QR Generator ========");
    console.log("*************************************");
    console.log();
    console.log("-------------------------------------");

    const accessToken: accessTokenType = {
      atId: 1234,
      role: "student",
      expDate: 1694978910, // UNIX Timestamp
    };

    const qrEncoded = await generateQRFromObj(accessToken);

    console.log("Using the following Test Data");
    console.log();
    console.log("The Data from SmartQR: ", accessToken);
    console.log("-------------------------------------");
    console.log(
      "Comparing Memory Sizes, to see if the endoded obj is greater\n it should be encoded in the frontend"
    );
    console.log("-------------------------------------");
    const aT_Size = getObjectSize<accessTokenType>(accessToken);
    const qr_Size = getObjectSize<string>(qrEncoded);
    console.log("JS Object Size: ", aT_Size);
    console.log("-------------------------------------");
    console.log("QR Code Size: ", qr_Size);
    console.log("-------------------------------------");
    console.log("The QR Code is heavier?: ", qr_Size > aT_Size);
    console.log("-------------------------------------");
    console.log("And also by: ", qr_Size - aT_Size, " bytes!");
    console.log("-------------------------------------");

    // TODO:
    // 1. Call QR CODE Smart Contract ...
    // This creates an Access Token inside the Contract
    // 2. Store the Result, which is of type: (accessTokenType) see ../types/web3

    ctx.status(200);
    return ctx.text("QR Code was Created!");
  } catch (error) {
    console.error("Error when trying to generate QR Code:", error);
    return ctx.res.status(500).json({ message: "Failed to generate QR Code" });
  }
};

// With async/await
const generateQRFromObj = async (obj: accessTokenType) => {
  try {
    console.log("Enconding Access Token...", obj);
    const qrEncode = await QRCode.toDataURL(JSON.stringify(obj));
    console.log("Successfully Encoded Access Token!");
    console.log(qrEncode);
    // console.log("The Access Token Obj: ", obj);
    // console.log("Type of (QR Encoded): ", typeof qrEncode);
    // console.log("The QR Encoded: ", qrEncode);
    return qrEncode;
  } catch (err) {
    console.error(err);
  }
};
