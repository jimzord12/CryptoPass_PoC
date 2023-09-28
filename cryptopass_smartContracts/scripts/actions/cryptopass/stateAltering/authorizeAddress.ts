import { ethers } from "hardhat";

import { createInstance } from "../../../../helpers/createInstance";
import { signers } from "../../../../constants/signers";


export async function authorizeAddress(toAddress: string, selectedSigner: "deployer" | "manager" | "simplerUser") {
  const _signers = await ethers.getSigners();
  const whichSigner = signers.indexOf(selectedSigner);
  const signer = _signers[whichSigner];

  const contract = await createInstance("cryptopass", signer);
  console.log("Running Test!");
  contract.authorizeAccount(toAddress);
}

// authorizeAddress("0xA833D22FeFB0DE9f2B4847c5e5Fe0Cc4542871B3");
