import hre, { ethers } from "hardhat";

// import { promises as fs } from "fs";
// import path from "path";

import { deployContract } from "../helpers/deployContract";
import { storeContractData } from "../helpers/storeContractData";
import {
  authorizeAddress,
  createSBT,
} from "./actions/cryptopass/stateAltering";

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

  // Giving AccessToken Contract Auth + SBT
  await authorizeAddress(accessTokenAddr, "deployer");
  await createSBT(accessTokenAddr, 4, "deployer");

  if (!ethers.isAddress(ws_address)) {
    console.error(
      "The WS_ADDRESS environment variable is not a valid Ethereum address!"
    );
  } else {
    // Giving Hono Web Server Auth + SBT
    await authorizeAddress(ws_address, "deployer");
    await createSBT(ws_address, 4, "deployer");

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
  console.log(`5. The Network's name: ${hre.network.name}`);
  console.log(`6. The Network's provider: ${hre.network.provider}`);
}
