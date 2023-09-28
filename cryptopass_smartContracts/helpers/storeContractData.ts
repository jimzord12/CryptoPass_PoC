import hre from "hardhat";
import { promises as fs } from "fs";
import path from "path";

export async function storeContractData(
  cryptoPassAddr: string,
  accessTokenAddr: string,
  deployer: string
): Promise<any> {
  const CryptoPassArtifact = await hre.artifacts.readArtifact("CryptoPass");
  const AccessTokenArtifact = await hre.artifacts.readArtifact("AccessToken");

  const data = {
    cryptopass: {
      abi: CryptoPassArtifact.abi,
      source: CryptoPassArtifact.sourceName,
      address: cryptoPassAddr,
      owner: deployer,
    },
    accesstoken: {
      abi: AccessTokenArtifact.abi,
      source: AccessTokenArtifact.sourceName,
      address: accessTokenAddr,
      owner: deployer,
    },
  };

  // Using the asynchronous writeFile method from fs.promises
  try {
    await fs.writeFile(
      path.join(__dirname, "..", "contractData.json"),
      JSON.stringify(data, null, 2)
    );

    // Import the JSON file. Using dynamic imports with await
    const jsonFile = await import(
      path.join(__dirname, "..", "contractData.json")
    );
    return jsonFile.default;
  } catch (error) {
    throw new Error("Failed to write and read the contract data.");
  }
}
