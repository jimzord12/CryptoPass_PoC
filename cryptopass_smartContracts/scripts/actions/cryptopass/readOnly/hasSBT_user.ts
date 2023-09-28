import { ethers } from "hardhat";

import { createInstance } from "../../../../helpers/createInstance";
import { signers } from "../../../../constants/signers";

export async function hasSBT_user(
  toAddress: string,
  selectedSigner: "deployer" | "manager" | "simplerUser"
) {
  const _signers = await ethers.getSigners();
  const whichSigner = signers.indexOf(selectedSigner);
  const signer = _signers[whichSigner];

  const contract = await createInstance("cryptopass", signer);
  console.log("Running Test!");

  const result = await contract.hasSBTuser(toAddress);
  console.log("This Address: ", toAddress);
  console.log("Has an SBT: ", result);
}

// hasSBT_user("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"); // True  (Deployer)
// hasSBT_user("0xA833D22FeFB0DE9f2B4847c5e5Fe0Cc4542871B3"); // False (WS)
