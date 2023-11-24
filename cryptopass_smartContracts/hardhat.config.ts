import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 1337,
      initialBaseFeePerGas: 0,
    },
  },
  // networks: {
  //   goerli: {
  //     url: process.env.RPC_URL as string,
  //     accounts: [process.env.PRIVATE_KEY as string],
  //   },
  // },
};

export default config;


