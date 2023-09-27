import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
// import { setupCounter } from "./counter.ts";
import { Web3Button } from "../../../web3Btn.ts";

import { abi } from "../web3/constants/index.ts";

// Sequence of code matters, this block must be 1st
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <h2>Testing Web3 Button Module</h1>
    
    <p> For the Button to Work it needs: </p>
    <ul style="text-align: left;">
      <li> A Web Server which can perform the following:</li>
      <ul>
        <li> Web3 Authentication (Wallet Ownership Challenge) </li>
        <li> Call Smart Contract View Functions</li>
        <li> For the Button to Work it needs: </li>
      </ul>
      <br />
      <li> A Smart Contract which can perform the following:</li>
      <ul>
        <li> Access Control based on Roles </li>
        <li> Create SBTs (SoulBound Tokens) </li>
      </ul>
    </ul>
    
    <div class="card">
      <p> Press for the magic to begin... </p>
      <p> 👇 </p>
      <div id="web3btn"></div>
    </div>
            
    <p class="read-the-docs">
    This Module is created for an Undergraduate Student's Thesis.
    </p>
    <p class="read-the-docs">
    University of West Attika (UNIWA)
    </p>
      
  </div>
`;

// setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

const appDiv = document.querySelector<HTMLBodyElement>("body");

const colors = {
  failColor: "#701b15",
  successColor: "#53ba41",
};

const web3Button = new Web3Button({
  onSuccess: (role) => {
    if (appDiv) {
      console.log("The [onSuccess] was Executed");
      appDiv.style.backgroundColor = colors.successColor;
      console.log("✅ 1. The User is Authenticated!");
      console.log("✅ 2. The User's Role is: ", role);
      console.log(
        "⚖ The Depending the System, you make the call on what to do from here, Mr. or Ms. Web Dev 😋"
      );
      console.log("👉 Example: Navigate user to an Authorized Page...");
    }
  },
  onFailure: () => {
    if (appDiv) {
      console.log("The [onFailure] was Executed");
      appDiv.style.backgroundColor = colors.failColor;
    }
  },
  web3AuthAPI: import.meta.env.VITE_WS_URL + "/verify-signature",
  roleAPI: import.meta.env.VITE_WS_URL + "/retrieve-role",
  rolesEnum: ["None", "Student", "Professor", "Staff", "Admin"],
  chainId: Number(import.meta.env.VITE_CHAIN_ID) ?? 11155111,
  contractAddr: import.meta.env.VITE_SBT_CONTRACT_ADDRESS!,
  abi: abi,
});

const web3container = document.querySelector<HTMLDivElement>("#web3btn")!;
web3Button.render(web3container);

// const web3ButtonFail = new Web3Button({
//   onSuccess: (role) => {
//     if (appDiv) {
//       console.log("The [onSuccess] was Executed");
//       appDiv.style.backgroundColor = colors.successColor;
//       console.log("✅ 1. The User is Authenticated!");
//       console.log("✅ 2. The User's Role is: ", role);
//       console.log(
//         "⚖ The Depending the System, you make the call on what to do from here, Mr. or Ms. Web Dev 😋"
//       );
//       console.log("👉 Example: Navigate user to an Authorized Page...");
//     }
//   },
//   onFailure: () => {
//     if (appDiv) {
//       console.log("The [onFailure] was Executed");
//       appDiv.style.backgroundColor = colors.failColor;
//       console.log(
//         "⚖ The Depending the System, you make the call on what to do from here, Mr. or Ms. Web Dev 😋"
//       );
//       console.log(
//         "👉 Example: Do Nothing! I have already added Toast Notification for you 💖"
//       );
//     }
//   },
//   web3AuthAPI: import.meta.env.VITE_WS_URL + "/verify-signature",
//   roleAPI: import.meta.env.VITE_WS_URL + "/retrieve-role",
//   rolesEnum: ["None", "Student", "Professor", "Staff", "Admin"],
//   contractAddr: import.meta.env.VITE_SBT_CONTRACT_ADDRESS!,
//   chainId: Number(import.meta.env.VITE_CHAIN_ID) ?? 11155111,
//   abi: abi,
//   styles: {
//     backgroundImage:
//       "radial-gradient( 100% 100% at 100% 0, #e62517 0, #70231d 100%)",
//   },
// });

// const web3container = document.querySelector<HTMLDivElement>("#web3btn")!;
// // const web3containerFail =
// //   document.querySelector<HTMLDivElement>("#web3btn_fail")!;

// web3Button.render(web3container);
// web3ButtonFail.render(web3containerFail);