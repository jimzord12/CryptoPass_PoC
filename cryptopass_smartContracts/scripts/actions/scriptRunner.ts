import * as readline from "readline";

import { getTokenData, getTokenId } from "./accesstoken/readOnly";
import { mintToken, useToken } from "./accesstoken/stateAltering";

import {
  _authPersonal,
  balanceOf,
  hasSBT_caller,
  hasSBT_user,
  showMsgSender,
} from "./cryptopass/readOnly";
import { authorizeAddress, createSBT } from "./cryptopass/stateAltering";

import { main } from "../myDeploys";

import { SignerValue } from "../../constants/signers";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

type ScriptType = {
  description: string;
  action: (args: ArgsType[]) => Promise<void>;
  argsDescription: string;
};

type ArgsType = string | number;
// List of available scripts
const scripts: { [key: string]: ScriptType } = {
  "1": {
    description: "Create SBT Token (Cryptopass)",
    argsDescription:
      "Address, Role (0-4), Signer: deployer/manager/simplerUser",
    action: async (args: ArgsType[]) => {
      console.log("Creating an SBT for: ", args[0]);
      console.log("The Role is: ", args[1]);
      try {
        await createSBT(
          args[0].toString(),
          Number(args[1]),
          args[2].toString() as SignerValue
        );
        console.log("SBT was created successfully");
      } catch (error) {
        console.log("⛔ Error while creating SBT: ", error);
      }
    },
  },
  "2": {
    description: "Authorize Address (Cryptopass)",
    argsDescription: "Address, Signer: deployer/manager/simplerUser",
    action: async (args: ArgsType[]) => {
      try {
        await authorizeAddress(
          args[0].toString(),
          args[1].toString() as SignerValue
        );
        console.log("Account got Authed successfully");
      } catch (error) {
        console.log("⛔ Error while making an Account Authed: ", error);
      }
    },
  },
  "3": {
    description: "Get Balance (Cryptopass)",
    argsDescription: "Address, Signer: deployer/manager/simplerUser",
    action: async (args: ArgsType[]) => {
      await balanceOf(args[0].toString(), args[1].toString() as SignerValue);
    },
  },
  "4": {
    description: "Show Message Sender (CryptoPass)",
    argsDescription: "Signer: deployer/manager/simplerUser",
    action: async (args: ArgsType[]) => {
      await showMsgSender(args[0].toString() as SignerValue);
    },
  },
  "5": {
    description: "Check if Address has SBT (User) (CryptoPass)",
    argsDescription: "Address, Signer: deployer/manager/simplerUser",
    action: async (args: ArgsType[]) => {
      await hasSBT_user(args[0].toString(), args[1].toString() as SignerValue);
    },
  },
  "6": {
    description: "Check if Address has SBT (Caller) (CryptoPass)",
    argsDescription: "Address, Signer: deployer/manager/simplerUser",
    action: async (args: ArgsType[]) => {
      await hasSBT_caller(
        args[0].toString(),
        args[1].toString() as SignerValue
      );
    },
  },
  "7": {
    description: "Check if Address has Auth (CryptoPass)",
    argsDescription: "Address, Signer: deployer/manager/simplerUser",
    action: async (args: ArgsType[]) => {
      await _authPersonal(
        args[0].toString(),
        args[1].toString() as SignerValue
      );
    },
  },
  "8": {
    description: "Use Access Token (AccessToken)",
    argsDescription: "Token ID (number), Signer: deployer/manager/simplerUser",
    action: async (args: ArgsType[]) => {
      await useToken(Number(args[0]), args[1].toString() as SignerValue);
    },
  },
  "9": {
    description: "Mint Access Token (AccessToken)",
    argsDescription: "Address, Signer: deployer/manager/simplerUser",
    action: async (args: ArgsType[]) => {
      await mintToken(args[0].toString(), args[1].toString() as SignerValue);
    },
  },
  "10": {
    description: "Get Token ID (AccessToken)",
    argsDescription: "Address (owner), Signer: deployer/manager/simplerUser",
    action: async (args: ArgsType[]) => {
      await getTokenId(args[0].toString(), args[1].toString() as SignerValue);
    },
  },
  "11": {
    description: "Get Token Data (AccessToken)",
    argsDescription: "Token ID (number), Signer: deployer/manager/simplerUser",
    action: async (args: ArgsType[]) => {
      await getTokenData(Number(args[0]), args[1].toString() as SignerValue);
    },
  },
  "12": {
    description: "Get Balance (AccessToken)",
    argsDescription: "Address (owner), Signer: deployer/manager/simplerUser",
    action: async (args: ArgsType[]) => {
      await balanceOf(args[0].toString(), args[1].toString() as SignerValue);
    },
  },
  "13": {
    description: "Deploy Contracts",
    argsDescription: "No Args are needed",
    action: async (args: ArgsType[]) => {
      main().catch((error) => {
        console.error(error);
        process.exitCode = 1;
      });
    },
  },
};

console.log("Select a script to run:");
for (const key in scripts) {
  console.log(`${key}. ${scripts[key].description}`);
}

rl.question(
  "Enter the number of the script you want to run: ",
  (scriptNumber) => {
    const selectedScript = scripts[scriptNumber];

    if (!selectedScript) {
      console.error("Invalid selection.");
      rl.close();
      return;
    }
    console.log();
    console.log("---------------------------------------------------------");
    console.log("1. deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    console.log("2. manager: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    console.log(`3. web server: ${process.env.WS_ADDRESS}`);
    console.log("4. simplerUser: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");
    console.log("---------------------------------------------------------");
    console.log();
    console.log(`Arguments required: ${selectedScript.argsDescription}`);
    console.log();

    if (selectedScript.description !== "Deploy Contracts") {
      rl.question(
        "Enter arguments for the script (space separated): ",
        (argsInput) => {
          // const args = argsInput.split(",").map((arg) => arg.trim());
          const args = argsInput.split(" ");

          selectedScript
            .action(args)
            .then(() => {
              rl.close();
            })
            .catch((err) => {
              console.error("Error executing the script:", err);
              rl.close();
            });
        }
      );
    } else {
      const args = [] as ArgsType[];
      selectedScript
        .action(args)
        .then(() => {
          rl.close();
        })
        .catch((err) => {
          console.error("Error executing the script:", err);
          rl.close();
        });
    }
  }
);
