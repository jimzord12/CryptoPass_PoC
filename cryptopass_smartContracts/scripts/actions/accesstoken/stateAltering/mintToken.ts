import { ethers } from "hardhat";

import { createInstance } from "../../../../helpers/createInstance";
import { signers } from "../../../../constants/signers";

export async function mintToken(
  toAddress: string,
  selectedSigner: "deployer" | "manager" | "simplerUser"
) {
  const _signers = await ethers.getSigners();
  const whichSigner = signers.indexOf(selectedSigner);
  const signer = _signers[whichSigner];

  const contract = await createInstance("AccessToken", signer);
  console.log("Running Test!");
  //   const result = await contract.mintToken(toAddress);
  console.log(`A token was minted for: [${toAddress}]`);
}

// balanceOf("0xA833D22FeFB0DE9f2B4847c5e5Fe0Cc4542871B3");
