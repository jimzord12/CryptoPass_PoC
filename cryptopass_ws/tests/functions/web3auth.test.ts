import { ethers, Wallet } from "ethers";
import { web3AuthType } from "../../types/web3.js";
import { HTTPException } from "hono/http-exception";

export async function generateAndSign(): Promise<web3AuthType> {
  // Create a new random wallet
  const wallet = Wallet.createRandom();

  // Let's sign a message
  const message = "Some nonce value"; // Replace with your desired nonce or random string
  const signedMessage = await wallet.signMessage(message);
  console.log("WQ: ", wallet);
  console.log("PrivateKey: ", wallet.privateKey);

  const testData: web3AuthType = {
    userAddress: wallet.address,
    nonce: message,
    signedMessage: signedMessage,
  };

  console.log("Test Data:", testData);

  return {
    userAddress: wallet.address,
    nonce: message,
    signedMessage: signedMessage,
  };
}

export const web3authTest = async (ctx, failOnPurpuse = false) => {
  console.log();
  console.log("*****************************");
  console.log("Web3 Authentication - Testing");
  console.log("*****************************");
  console.log();

  const testBodyData: web3AuthType = await generateAndSign();

  try {
    console.log("-------------------------------------");
    console.log();
    console.log("1. Retrieving the Auth Data...");
    console.log(" - i) The Message Content");
    console.log(" - ii) The Sender's Public Address");
    console.log(" - iii) The Signed Message signed using Sender's Private key");
    console.log();
    console.log("-------------------------------------");
    console.log("The Retrieved Data: ", testBodyData);

    const message = testBodyData.nonce;
    const signedMessage = testBodyData.signedMessage;
    const userAddress = failOnPurpuse
      ? testBodyData.userAddress + "--ERROR--"
      : testBodyData.userAddress;

    console.log("-------------------------------------");
    console.log(">> Altering User's Address to produce Error:");
    console.log(">> New Address: ", userAddress);
    console.log("-------------------------------------");

    console.log("-------------------------------------");
    console.log("2. Hashing the Message...");
    console.log("-------------------------------------");

    const messageHash = ethers.hashMessage(message);

    console.log(
      "3. Recovering the sender's address from the Hashed Message and the provided Signed Message"
    );
    console.log("-------------------------------------");
    const recoveredAddress = ethers.recoverAddress(messageHash, signedMessage);

    if (recoveredAddress.toLowerCase() === userAddress.toLowerCase()) {
      console.log(
        "4.1 The Derived address is the same, therefore the sender is the true holder of the Private Key!"
      );
      console.log("-------------------------------------");
      console.log("All Good!");
      console.log("-------------------------------------");

      ctx.status(201);

      return ctx.text("Auth was Successful");
    } else {
      console.log(
        "4.2 The Derived address is NOT the same, therefore the sender is NOT the holder of the Private Key!"
      );
      console.log("-------------------------------------");
      console.log("Auth failed!");
      console.log("-------------------------------------");

      ctx.status(400);

      return ctx.text("Auth Failed!");
    }
  } catch (error) {
    console.error("Error verifying signed message:", error);

    return ctx.json({
      message: "Failed to verify signed message",
      error: error.message,
    });
  }
};
