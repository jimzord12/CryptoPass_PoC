import { ethers } from "ethers";

let provider: ethers.Provider;
let providerInitSuccessful = false;

const hardhat = "http://127.0.0.1:8545/";
const sepolia =
  "https://sepolia.infura.io/v3/" + process.env.INFURA_SEPOLIA_API_KEY;

async function main() {
  // Creating a Wallet for our WS
  const privateKey = process.env.PRIVATE_KEY; // We need a Private key

  const wallet = new ethers.Wallet(privateKey, provider); // BY combining a Priv key & the provider we get wallet.

  const walletAddr = wallet.address; // Here we extract the Public Address of that Wallet

  const signer = wallet.connect(provider); // Here (even though it not be needed) we infused the wallet with the provider

  const contractDataFromJSON = await import(
    "../../cryptopass_smartContracts/contractData.json"
  );
  const cryptoPassContractAddr =
    contractDataFromJSON.default.cryptopass.address;
  const accessTokenContractAddr =
    contractDataFromJSON.default.accesstoken.address;
  const cryptoPassABI = contractDataFromJSON.default.cryptopass.abi;
  const accessTokenABI = contractDataFromJSON.default.accesstoken.abi;
  // Creating Contracts

  cryptoPass = new ethers.Contract(
    cryptoPassContractAddr,
    cryptoPassABI,
    signer
  );

  accessToken = new ethers.Contract(
    accessTokenContractAddr,
    accessTokenABI,
    signer
  );

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
      if (!hasAuth)
        console.log("[BAD]: WS is NOT Authorized by the Contract! ");
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
  providerInitSuccessful = true; // Set this to true at the end of the function
}

const initProvider = async () => {
  if (process.env.IS_HARDHAT === "yes") {
    provider = new ethers.JsonRpcProvider(hardhat);
  } else {
    provider = new ethers.JsonRpcProvider(sepolia);
  }
};

const retryInitProvider = async () => {
  try {
    await initProvider();
    await main(); // Ensure that everything reliant on the provider is set up again.
  } catch (error) {
    console.log("Failed to Init Provider... Trying again in 5s");
    providerInitSuccessful = false; // Set this to false if there's an error
    setTimeout(retryInitProvider, 5000);
  }
};

retryInitProvider();

// initProvider()
//   .then(main)
//   .catch((error) => {
//     console.log("Failed to Init Provder... Trying again in 5s");
//     if (process.env.IS_HARDHAT === "yes")
//       setTimeout(() => (provider = new ethers.JsonRpcProvider(hardhat)), 5000);
//     if (process.env.IS_HARDHAT === "no")
//       setTimeout(() => (provider = new ethers.JsonRpcProvider(sepolia)), 5000);
//   });

export let cryptoPass;
export let accessToken;
export { providerInitSuccessful };
