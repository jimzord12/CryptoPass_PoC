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
    <div style="display: flex; justify-content: center; align-items: center;">
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
    </div>

    <h2>Before Clicking...</h1>
    <p> Do not forget to: </p>

    <ol style="text-align: left;">
      <li> Start the Local Hardhat Blockchain Node: <code>npx hardhat node</code></li>
      <li> Use ScriptRunner (Hardhat > scripts > actions) to Deploy SC 
        <code>npx hardhat run --network localhost scripts/actions/scriptRunner.ts
        </code>
      </li>
      <li> Deploy Contracts using Hardhat's Deploy Script (No.13, No args needed)         
        <code>
          Enter the number of the script you want to run: 13
        </code>
      </li>
      <li> Start the WS Hono Local Server <code>npm start
      </code></li>
      <li> Make sure the WS's Wallet has ETH & has Auth (see WS's console logs) 
        <br/>
        <div style="margin-top: 24px;">
          <code>
            Balance of The WS Wallet is: 250.0 ETH
            [GOOD]: WS is Authorized by the Contract!
          </code>
        </div>
      </li>
      <li> Use ScriptRunner to Run Tests & Simulations. Located at Hardhat > scripts > actions > scriptRunner.ts </li>
    </ol>
    
    <div class="card">
      <p> Press for the magic to begin... </p>
      <p> 👇 </p>
      <div id="web3btn"></div>
    </div>
            
    <p class="read-the-docs">
    🔷 This Module is created for an Undergraduate Student's Thesis. 🔷
    </p>
    <p class="read-the-docs">
    🔷 Elena (Surname) 🔷
    </p>
    <p class="read-the-docs">
    🔷 University of West Attika (UNIWA) 🔷
    </p>
      
  </div>
`;

// setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);

const appDiv = document.querySelector<HTMLBodyElement>("body");

const colors = {
  failColor: "#701b15",
  successColor: "#226317",
};

const web3Button = new Web3Button({
  onSuccess: (role) => {
    if (appDiv) {
      console.log("The [onSuccess] was Executed");
      appDiv.style.backgroundColor = colors.successColor;
      console.log("✅ 1. The User is Authenticated!");
      console.log("✅ 2. The User's Role is: ", role);
      console.log(
        "⚖ Depending on the System, you must decide on what to do from here, Mr. or Ms. Web Dev 😋"
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
  web3AuthAPI: import.meta.env.VITE_WS_URL + "/web3auth",
  roleAPI: import.meta.env.VITE_WS_URL + "/retrieve-role",
  rolesEnum: ["None", "Student", "Professor", "Staff", "Admin"],
  chainId: Number(import.meta.env.VITE_CHAIN_ID) ?? 31337,
  contractAddr: import.meta.env.VITE_SBT_CONTRACT_ADDRESS!,
  abi: abi,
});

const web3container = document.querySelector<HTMLDivElement>("#web3btn")!;
web3Button.render(web3container);
