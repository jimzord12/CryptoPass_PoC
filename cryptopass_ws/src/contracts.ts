import { ethers } from "ethers";

let provider: ethers.Provider;
// *** Intinializing Web3 Staff...***
// Getting a provider, a entity (usually a WS) which will given us access to the
// blockchain network. In this case, Infura
if (process.env.IS_HARDHAT === "yes") {
  provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
} else {
  provider = new ethers.JsonRpcProvider(
    "https://sepolia.infura.io/v3/" + process.env.INFURA_SEPOLIA_API_KEY
  );
}
// Creating a Wallet for our WS
const privateKey = process.env.PRIVATE_KEY; // We need a Private key

const wallet = new ethers.Wallet(privateKey, provider); // BY combining a Priv key & the provider we get wallet.

const walletAddr = wallet.address; // Here we extract the Public Address of that Wallet

const signer = wallet.connect(provider); // Here (even though it not be needed) we infused the wallet with the provider

// Which effectively allows us to perform transaction to the network
// NOTE: If you do NOT do this, when performing read-only (calling a Solidity view function)
// call, the msg.sender address will be the zero-address (0x0000...0000) which depending on
// your WS logic, might not be what you want.
// const cryptoPassContractAddr = process.env.CRYPTOPASS_CONTRACT_ADDRESS;
// const accessTokenContractAddr = process.env.ACCESSTOKEN_CONTRACT_ADDRESS;
// This Automates the Contract Data Transfer when Testing
const contractDataFromJSON = await import(
  "../../cryptopass_smartContracts/contractData.json"
);
const cryptoPassContractAddr = contractDataFromJSON.default.cryptopass.address;
const accessTokenContractAddr =
  contractDataFromJSON.default.accesstoken.address;
const cryptoPassABI = contractDataFromJSON.default.cryptopass.abi;
const accessTokenABI = contractDataFromJSON.default.accesstoken.abi;
// Creating Contracts

export const cryptoPass = new ethers.Contract(
  cryptoPassContractAddr,
  cryptoPassABI,
  signer
);

export const accessToken = new ethers.Contract(
  accessTokenContractAddr,
  accessTokenABI,
  signer
);
// ### Ultra Important! ###
// 1. Do not forget to make the AccessToken a authorized Personel
// 2. Mint an SBT for AccessToken Contract
// ### Ultra Important! ###
console.log("The WS Wallet Public Addr: ", walletAddr);
// Fetch the balance
provider.getBalance(walletAddr).then((balnaceInWei: ethers.BigNumberish) => {
  const _balanceEther = ethers.formatEther(balnaceInWei);
  console.log(`Balance of The WS Wallet is: ${_balanceEther} ETH`);
  if (parseFloat(_balanceEther) < 2) {
    console.log("::: YOU MUST SENT ETH -> SERVER :::");
  }
});
cryptoPass
  ._authPersonal(walletAddr)
  .then((hasAuth) => {
    if (!hasAuth) console.log("[BAD]: WS is NOT Authorized by the Contract! ");
    if (hasAuth) console.log("[GOOD]: WS is Authorized by the Contract! ");
  })
  .catch((error) => {
    if (error.code === "BAD_DATA") {
      console.log(
        "----- AN ERROR WAS THROUGH WHILE TRYING TO SEE IF WS HAS AUTH -----"
      );
      console.error(error);
    } else {
      throw error;
    }
  });
