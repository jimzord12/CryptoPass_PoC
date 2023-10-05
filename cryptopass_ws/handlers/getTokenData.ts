import { accessToken, providerInitSuccessful } from "../src/contracts.js";
import { getNumber, BigNumberish } from "ethers";

export const getTokenData = async (atId: number) => {
  if (providerInitSuccessful === false) {
    return {
      success: false,
      error: "⛔ Error: The Provider's Server is Down for the count",
    };
  }
  type Role = "None" | "Student" | "Professor" | "Staff" | "Admin";

  type TokenData = {
    id: BigNumberish;
    role: Role;
    exp: BigNumberish;
  };

  try {
    const responce: TokenData = await accessToken.getTokenData(atId);
    console.log(`The Token Data for [${atId}] is: `, responce);
    return responce;
  } catch (error) {
    console.error("⛔ Error while creating the SBT", error);
  }
};
