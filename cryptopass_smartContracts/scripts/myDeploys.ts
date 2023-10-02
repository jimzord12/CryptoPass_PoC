import { ethers } from "hardhat";
import hre from "hardhat";

// import { promises as fs } from "fs";
// import path from "path";

import { deployContract } from "../helpers/deployContract";
import { storeContractData } from "../helpers/storeContractData";

// Command to Run:
// npx hardhat run --network localhost scripts/myDeploys.ts
export async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const ws_address = process.env.WS_ADDRESS;

  const cryptoPassAddr = await deployContract("CryptoPass");
  console.log("Cryptopass Deployed! | Address: ", cryptoPassAddr);

  const accessTokenAddr = await deployContract("AccessToken", [cryptoPassAddr]);
  console.log("AccessToken Deployed! | Address: ", accessTokenAddr);

  const jsonGeneratedFile = await storeContractData(
    cryptoPassAddr,
    accessTokenAddr,
    deployerAddress
  );

  if (!ethers.isAddress(ws_address)) {
    console.error(
      "The WS_ADDRESS environment variable is not a valid Ethereum address!"
    );
  } else {
    // / Send 250 ETH to the ws_address
    const amountToSend = ethers.parseEther("250"); // Convert 250 ETH to Wei
    const tx = await deployer.sendTransaction({
      to: ws_address,
      value: amountToSend,
    });
    // Wait for the transaction to be mined
    await tx.wait();
    console.log(`Sent 250 ETH to ${ws_address}`);
  }

  console.log();
  console.log("--------------------------------------------------------------");
  console.log(
    "|==> This is the JSON file created, containing the Contract Data: ",
    jsonGeneratedFile
  );
  console.log(`1. The Network's ChainID: ${hre.network.config.chainId}`);
  console.log(`2. The Network's accounts: ${hre.network.config.accounts}`);
  console.log(`3. The Network's from: ${hre.network.config.from}`);
  console.log(`4. The Network's gas: ${hre.network.config.gas}`);
  console.log(`4. The Network's name: ${hre.network.name}`);
  console.log(`4. The Network's provider: ${hre.network.provider}`);
}

// async function storeContractData(
//   cryptoPassAddr: string,
//   accessTokenAddr: string
// ): Promise<any> {
//   const CryptoPassArtifact = await hre.artifacts.readArtifact("CryptoPass");
//   const AccessTokenArtifact = await hre.artifacts.readArtifact("AccessToken");

//   const data = {
//     cryptopass: {
//       abi: CryptoPassArtifact.abi,
//       source: CryptoPassArtifact.sourceName,
//       address: cryptoPassAddr,
//     },
//     accesstoken: {
//       abi: AccessTokenArtifact.abi,
//       source: AccessTokenArtifact.sourceName,
//       address: accessTokenAddr,
//     },
//   };

//   // Using the asynchronous writeFile method from fs.promises
//   try {
//     await fs.writeFile(
//       path.join(__dirname, "..", "contractData.json"),
//       JSON.stringify(data, null, 2)
//     );

//     // Import the JSON file. Using dynamic imports with await
//     const jsonFile = await import(
//       path.join(__dirname, "..", "contractData.json")
//     );
//     return jsonFile.default;
//   } catch (error) {
//     throw new Error("Failed to write and read the contract data.");
//   }
// }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
