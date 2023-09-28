import { ethers } from "hardhat";

import { createInstance } from "../../../../helpers/createInstance";
import { signers } from "../../../../constants/signers";

export async function getTokenId(
  owner: string,
  selectedSigner: "deployer" | "manager" | "simplerUser"
) {
  const _signers = await ethers.getSigners();
  const whichSigner = signers.indexOf(selectedSigner);
  const signer = _signers[whichSigner];

  const contract = await createInstance("AccessToken", signer);
  console.log("Running Test!");
  const result = await contract.getTokenId(owner);
  console.log(`For the Address: [${owner}], the Token ID is: [${result}]`);
  return result;
}

// balanceOf("0xA833D22FeFB0DE9f2B4847c5e5Fe0Cc4542871B3");
