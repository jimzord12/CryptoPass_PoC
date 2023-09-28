import { ethers } from "hardhat";
import hre from "hardhat";

// import { promises as fs } from "fs";
// import path from "path";

import { deployContract } from "../helpers/deployContract";
import { storeContractData } from "../helpers/storeContractData";

// Command to Run:
// npx hardhat run --network localhost scripts/myDeploys.ts
async function main() {
  const [deployer] = await ethers.getSigners();
  const deployerAddress = await deployer.getAddress();

  const cryptoPassAddr = await deployContract("CryptoPass");
  console.log("Cryptopass Deployed! | Address: ", cryptoPassAddr);

  const accessTokenAddr = await deployContract("AccessToken", [cryptoPassAddr]);
  console.log("AccessToken Deployed! | Address: ", accessTokenAddr);

  const jsonGeneratedFile = await storeContractData(
    cryptoPassAddr,
    accessTokenAddr,
    deployerAddress
  );

  console.log();
  console.log("--------------------------------------------------------------");
  console.log(
    "|==> This is the JSON file created, containing the Contract Data: ",
    jsonGeneratedFile
  );
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
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
