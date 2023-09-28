import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";

import {
  mintToken,
  useToken,
} from "../../../../scripts/actions/accesstoken/stateAltering/index";

import {
  balanceOf as accessTokenBalanceOf,
  getTokenId,
  getTokenData,
} from "../../../../scripts/actions/accesstoken/readOnly/index";

import {
  balanceOf,
  _authPersonal,
  getUserRole,
  hasSBT_user,
  hasSBT_caller,
  showMsgSender,
} from "../../../../scripts/actions/cryptopass/readOnly/index";

import {
  authorizeAddress,
  createSBT,
} from "../../../../scripts/actions/cryptopass/stateAltering/index";

// import { setupCounter } from "./counter.ts";

// Global Scope
const signers = ["deployer", "manager", "simpleUser"];
const accounts = [
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
  "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
];
const WS_ADDRESS = "0xA833D22FeFB0DE9f2B4847c5e5Fe0Cc4542871B3";

let selectedSigner: "deployer" | "manager" | "simplerUser" = "deployer";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <div id="signers"></div>
      <p id="currentSinger">Select An Account</p>
      <div class="btn-container">
        <div class="btn-container bordered">
        <h3>CryptoPass</h3>
          <button class="button-42" role="button">Authorize Address</button>
          <button class="button-42" role="button">Create SBT</button>
          <button class="button-34" role="button">Balance Of SBT</button>
          <button class="button-34" role="button">Check If Authorized</button>
          <button class="button-34" role="button">Get User Role</button>
          <button class="button-34" role="button">Has SBT User</button>
          <button class="button-34" role="button">Has SBT Caller</button>
          <button class="button-34" role="button">Show Msg Sender</button>
        </div>
        <div class="btn-container bordered">
        <h3>AccessToken</h3>
        <button class="button-42" role="button">Mint Token</button>
        <button class="button-42" role="button">Use Token</button>
          <button class="button-34" role="button">Balance Of</button>
          <button class="button-34" role="button">Get Token Data</button>
          <button class="button-34" role="button">Get Token ID</button>
        </div>
      </div>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

// setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

const selectSigner = document.createElement("select");
// const currentSigner = document.createElement("p");

signers.forEach((signer, index) => {
  const optionElement = document.createElement("option");
  optionElement.value = accounts[index];
  optionElement.textContent = signer;
  selectSigner.appendChild(optionElement);
});

const singersContainer = document.querySelector("#signers");
const currentSignerContainer = document.querySelector("#currentSinger");

// function setSigner(singer: string) {
//   currentSignerContainer?.append(currentSigner);
// }

if (singersContainer !== null) {
  singersContainer.appendChild(selectSigner);
} else {
  console.log("⛔ Error!!!");
}

function checkName(name: string): "deployer" | "manager" | "simplerUser" {
  if (name.match("deployer")) return "deployer";
  if (name.match("manager")) return "manager";
  if (name.match("simplerUser")) return "simplerUser";
  return "deployer";
}

selectSigner.addEventListener("change", async (event: Event) => {
  const select = event.target as HTMLSelectElement;
  const selectedSignerType = select.options[select.selectedIndex].textContent!;
  selectedSigner = checkName(selectedSignerType);

  console.log("--------------------------------------------------------");
  console.log(`The Selected Account Type is: ${selectedSignerType}`);
  console.log(`The Selected Account Address is: ${selectedSigner}`);
  if (currentSignerContainer) {
    currentSignerContainer.textContent = selectedSigner;
  }
});

document
  .querySelector('button[role="button"]:contains("Authorize Address")')
  ?.addEventListener("click", async () =>
    authorizeAddress(WS_ADDRESS, selectedSigner)
  );

document
  .querySelector('button[role="button"]:contains("Mint Token")')
  ?.addEventListener("click", async () =>
    mintToken(WS_ADDRESS, selectedSigner)
  );
