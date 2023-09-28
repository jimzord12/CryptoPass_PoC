import { ethers } from "hardhat";

import { createInstance } from "../../../../helpers/createInstance";
import { signers } from "../../../../constants/signers";

export async function getUserRole(
  toAddress: string,
  selectedSigner: "deployer" | "manager" | "simplerUser"
) {
  const _signers = await ethers.getSigners();
  const whichSigner = signers.indexOf(selectedSigner);
  const signer = _signers[whichSigner];

  const roles = ["None", "Student", "Professor", "Staff", "Admin"];

  const contract = await createInstance("cryptopass", signer);
  console.log("Running Test!");
  const result = await contract.getUserRole(toAddress);
  console.log(`The [${toAddress} role is: ]`, roles[result]);
  return result;
}
