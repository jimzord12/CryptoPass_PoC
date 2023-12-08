import axios from "axios";
import { ethers } from "ethers";
import Toastify from "toastify-js";
import IWeb3Button, {
  IWeb3ButtonOptions,
  SafeStyleProperties,
} from "./types/web3BtnInterface";

import "toastify-js/src/toastify.css";

// This function detects most providers injected at window.ethereum.
import detectEthereumProvider from "@metamask/detect-provider";

import defaultStyles from "./css/styles.module.css";

export class Web3Button implements IWeb3Button {
  private static roles = ["None", "Student", "Professor", "Staff", "Admin"];
  private onSuccess: (arg0: string) => void;
  private onFailure: () => void;
  private web3AuthAPI: string;
  private roleAPI: string;
  private rolesEnum: string[];
  private accessLevel?: 0 | 1 | 2 | 3 | 4;
  // private contractAddr: string;
  private chainId: number;
  private account: string | null = null;
  // private contract?: any = null;
  // private abi?: any;
  private styles?: SafeStyleProperties;
  private disableDefaultStyles?: boolean = false;
  private customClass?: string;
  private role?: string;

  private button: HTMLButtonElement;
  // private provider: EthereumProvider | null;
  private provider: any | null; // TODO: Find EthereumProvider Type

  constructor(options: IWeb3ButtonOptions) {
    this.onSuccess =
      options.onSuccess ??
      (() => this._notImplementedError("onSuccess", "Method"));
    this.onFailure =
      options.onFailure ??
      (() => this._notImplementedError("onFailure", "Method"));

    this.web3AuthAPI =
      options.web3AuthAPI ??
      this._notImplementedError("web3AuthAPI", "Property");

    this.roleAPI =
      options.roleAPI ?? this._notImplementedError("roleAPI", "Property");
    this.rolesEnum =
      options.rolesEnum ?? this._notImplementedError("rolesEnum", "Property");

    // this.contractAddr =
    //   options.contractAddr ??
    //   this._notImplementedError("contractAddr", "Property");
    this.chainId =
      options.chainId ?? this._notImplementedError("ChainId", "Property");
    this.accessLevel = options.accessLevel;
    // this.abi =
    //   options.abi ??
    //   this._notImplementedError("Contrct ABI Required!", "Property");

    this.styles = options.styles;
    this.disableDefaultStyles = options.disableDefaultStyles;
    this.customClass = options.customClass;

    // Not in Options Object, just gets created what constructor runs
    this.button = this._createButton();
  }

  render(parentElement: HTMLElement) {
    parentElement.appendChild(this.button);
    console.log(
      "From Web3 Button: The Access is: ",
      this.rolesEnum[this.accessLevel!]
    );
  }

  getButtonElement(): HTMLButtonElement {
    console.log("From Web3 Button CLass: ", this.button);
    return this.button;
  }

  // *** PRIVATE METHODS ***
  private _createButton(): HTMLButtonElement {
    const btn = document.createElement("button");

    // If not Disabled, apply default class from the CSS module
    if (!this.disableDefaultStyles) {
      btn.classList.add(defaultStyles.buttonWeb3);
      btn.textContent = "Web3 Auth";
    }

    // Apply styles from the styles object & override predefined
    if (this.styles) {
      for (const [key, value] of Object.entries(this.styles)) {
        (btn.style as any)[key] = value;
      }
    }

    // Add custom class if provided (this allows users to use their own CSS to override or extend styles)
    if (this.customClass) {
      btn.classList.add(this.customClass);
    }

    btn.addEventListener("click", this._handleClick.bind(this));
    return btn;
  }

  private async _handleClick() {
    console.clear();
    //TODO:
    // Check for Wallet Provider (metamask)
    const hasWallet: true | null = await this._checkForWallet();

    if (hasWallet) {
      console.log("🧪 1. Wallet Installed: ", hasWallet);
      window.ethereum.on("chainChanged", this._handleChainChanged.bind(this));
      // ✅ Wallet is Installed
      const hasConnectedAccount = await this.getAccount(); // Asks User to connect wallet to site
      console.log("🧪 2. Has Connected Account: ", hasConnectedAccount);

      const _chainId = await this._getChainId(); // Get chain ID

      console.log("🧪 3.1 Wallet Chain ID: ", _chainId);
      console.log("🧪 3.2 Desired Chain ID: ", this.chainId);

      if (hasConnectedAccount && _chainId === Number(this.chainId)) {
        console.log("🧪 4. Wallet Connected & on Correct Network");
        // ✅ On Correct Network
        // Time for Wallet Ownership Challenge:
        // 1. Get random Number from Browser's Engine
        let result: Boolean = false;
        try {
          result = await this._signatureVerification();
        } catch (error) {
          console.log("⛔ Server Error. Server is probably down.");
          this._showErrorNotification("Server Error. Server is probably down.");
        }
        if (result) {
          // ✅ Wallet Ownership Passed!
          // Creating the Contract Instance
          // const finisedInit: boolean = await this._createContractConnection();
          console.log("🧪 5. Wallet Ownership Authentication was a Success");
          // Calling SBT contract

          try {
            const { parsedRole, roleNumber } = await this._getRoleFromWS();
            this.role = parsedRole;
            if (roleNumber >= this.accessLevel!) {
              console.log(
                "🧪 6.1 Your Role is passes the Access Requirements!: ",
                roleNumber,
                " | ",
                this.accessLevel
              );
            } else {
              if (roleNumber === 0) {
                console.log("⛔ You do NOT possess a SBT Token!");
                this._showErrorNotification("You do NOT possess a SBT Token!");
              }
              console.log(
                "⛔ Your Access Level is does NOT meet the Requirements!"
              );
              this._showErrorNotification(
                `Your Access Level is does NOT meet the Requirements! \nYou need at least a Role of: [${
                  this.rolesEnum[this.accessLevel!]
                }]\n Your Access level is: [${parsedRole}]`
              );
              return;
            }
          } catch (error) {
            console.log("ERRRRROR: ", error);
            this._showErrorNotification("Server Error, please try again later");
            return;
          }
          if (this.rolesEnum.includes(this.role ?? "None")) {
            if (this.role !== "None") {
              console.log(
                "✅🧪 7.1 You Possess an SBT, and have a Role! Nice 😋"
              );
              console.log("✅ 7.2 The onSuccess Function shall be executed:");
              this.onSuccess(this.role!);
            } else {
              // ⛔ You do NOT possess a SBT Token
              this._showErrorNotification(
                "😅 You probaly do NOT possess a SBT Token! Boomer..."
              );
              console.log("⛔ 7.3 The onFailure Function shall be executed:");
              this.onFailure();
              return;
            }
          } else {
            this._showErrorNotification(
              "⛔ Something went wrong, please try again later #1"
            );
          }
        } else {
          // ⛔ Wallet points to Wrong Network
          this._showErrorNotification(
            "Wallet Ownership Authentication Failed!"
          );
          return;
        }
      } else {
        // ⛔ Wallet points to Wrong Network
        this._showErrorNotification("Wrong Network, Swith to Hardhat Local");
        return;
      }
    } else {
      // ⛔ Does NOT have Wallet Installed
      this._showErrorNotification("MetaMask Wallet Extention is Required!");
      return;
    }
  }

  private async _getRoleFromWS() {
    const response: { data: { userRole: number } } = await axios.post(
      this.roleAPI,
      {
        address: this.account,
      }
    );
    // If you want to map it to a string representation:
    console.log("💩 6.0.1 | Trying to Retrieve the User's Role...");
    console.log("💩 6.0.2 | If the User has a Role, he/she surely has an SBT");
    console.log("💩 6.1   | Retrieved Data: ", response);
    console.log("💩 6.2   | Your Role is (as Enum): ", response.data.userRole);
    const parsedRole: string = Web3Button.roles[response.data.userRole];
    console.log("💩 6.3 Your Role is (as String): ", parsedRole);
    // this.role = parsedRole;
    return { roleNumber: response.data.userRole, parsedRole };
  }

  private _showErrorNotification(message: string) {
    Toastify({
      text: message,
      duration: -1,
      close: true,
      gravity: "top",
      position: "center",
      style: {
        background: "linear-gradient(to right, #913a79, #d41717)",
      },
    }).showToast();
  }

  // private async _createContractConnection() {
  //   const _contract = new ethers.Contract(
  //     this.contractAddr,
  //     this.abi,
  //     this.provider
  //   );
  //   this.contract = _contract;
  //   return true;
  // }

  private async _signatureVerification() {
    const randomValues = new Uint32Array(1);
    window.crypto.getRandomValues(randomValues);
    const nonce: string = randomValues[0].toString();

    // 2. Create an ethers.js provider
    const ethersProvider = new ethers.BrowserProvider(this.provider);
    this.provider = ethersProvider;

    // 3. Create a signer
    const singer = await ethersProvider.getSigner();

    // 4. Make User sign a message
    const signedMessage = await singer.signMessage(nonce);

    // 3. Construct the data for the Web3 Auth
    const authData = {
      nonce,
      userAddress: this.account,
      signedMessage: signedMessage,
    };

    const response: { data: { verified: Boolean } } = await axios.post(
      this.web3AuthAPI,
      authData
    );
    console.log("👉 Hono WS (localhost) Response: ", response);
    return response.data.verified;
  }

  private async _getChainId() {
    const _chainId = await window.ethereum?.request({ method: "eth_chainId" });
    return parseInt(_chainId, 16);
  }

  private async _checkForWallet(): Promise<null | true> {
    // This returns the provider, or null if it wasn't detected.
    const _provider = await detectEthereumProvider();

    if (_provider) {
      this.provider = _provider;
      return true;
    } else {
      console.log("Please install MetaMask!");
      return null;
    }
  }

  private async getAccount() {
    let success;
    const accounts = await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .catch((err: { code: number }) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log("Please connect to MetaMask.");
          this._showErrorNotification("Please connect to MetaMask");
          success = false;
        } else {
          console.error(err);
          success = false;
        }
      });
    this.account = accounts[0];
    success = true;
    return success;
    // showAccount.innerHTML = account;
  }

  private _handleChainChanged() {
    // We recommend reloading the page, unless you must do otherwise.
    window.location.reload();
  }

  private _notImplementedError(name: string, type: string) {
    throw new Error(
      `CryptoPass: Web3 Button: [${type}]: [${name}] is NOT implemented`
    );
  }
}
