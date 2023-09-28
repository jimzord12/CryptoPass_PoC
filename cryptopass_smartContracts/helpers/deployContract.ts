import { ethers } from "hardhat";

export async function deployContract(contractName: string, args?: any[]) {
  // Below is the Old Way:
  //   const ContractFactory = await ethers.getContractFactory(contractName);
  //   const contract = await ContractFactory.deploy(...(args || []));
  const contract = await ethers.deployContract(contractName, [...(args || [])]);

  console.log(`[${contractName}] Deploy...`);
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  return contractAddress;
}
