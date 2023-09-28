import { ethers } from "hardhat";

import { createInstance } from "../../../../helpers/createInstance";
import { signers } from "../../../../constants/signers";

export async function _authPersonal(
  toAddress: string,
  selectedSigner: "deployer" | "manager" | "simplerUser"
) {
  const _signers = await ethers.getSigners();
  const whichSigner = signers.indexOf(selectedSigner);
  const signer = _signers[whichSigner];

  const contract = await createInstance("cryptopass", signer);
  console.log("Running Test!");
  const result = await contract._authPersonal(toAddress);
  console.log(`The [${toAddress} was Auth?: ]`, result);
  return result;
}

// createSBT("0xA833D22FeFB0DE9f2B4847c5e5Fe0Cc4542871B3", 3);
