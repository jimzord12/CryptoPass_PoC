import { ethers } from "hardhat";

import { getContractData } from "./getContractData";

export async function createInstance(contractName: string, signer: any) {
  console.log("Running createInstance!");
  const { abi, address } = await getContractData(contractName);

  return new ethers.Contract(address, abi, signer);
}


