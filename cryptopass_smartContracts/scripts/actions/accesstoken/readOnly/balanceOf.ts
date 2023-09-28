import { ethers } from "hardhat";

import { createInstance } from "../../../../helpers/createInstance";

export async function balanceOf(owner: string) {
  const [signer] = await ethers.getSigners();

  const contract = await createInstance("AccessToken", signer);
  console.log("Running Test!");
  const result = await contract.balanceOf(owner);
  console.log(`This Address's [${owner}] balance of AccessTokens: [${result}]`);
  return result;
}

// balanceOf("0xA833D22FeFB0DE9f2B4847c5e5Fe0Cc4542871B3");
