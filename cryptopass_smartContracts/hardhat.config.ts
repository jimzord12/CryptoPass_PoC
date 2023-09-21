import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  // networks: {
  //   goerli: {
  //     url: process.env.RPC_URL as string,
  //     accounts: [process.env.PRIVATE_KEY as string],
  //   },
  // },
};

export default config;
