import { ethers } from "hardhat";

export async function deployContract(contractName: string, args?: any[]) {
  const contract = await ethers.deployContract(contractName, [...(args || [])]);

  console.log(`[${contractName}] Deploy...`);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  return contractAddress;
}

