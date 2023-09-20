"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Button = void 0;
const buttonStyles_module_css_1 = __importDefault(require("./css/buttonStyles.module.css"));
class Web3Button {
    // private static DEFAULT_STYLES: Properties = {
    //   backgroundColor: "#4CAF50", // Example: Green background
    //   color: "white", // White text
    //   padding: "10px 20px", // Some padding
    //   border: "none", // No border
    //   cursor: "pointer", // Hand cursor on hover
    //   // ... any other default styles you want
    // };
    constructor(options) {
        this.onSuccess =
            options.onSuccess || (() => this._notImplementedError("onSuccess"));
        this.onFailure =
            options.onFailure || (() => this._notImplementedError("onFailure"));
        this.styles = options.styles || buttonStyles_module_css_1.default;
        this.button = this._createButton();
    }
    _createButton() {
        const btn = document.createElement("button");
        // Adds Predefined Styles
        btn.classList.add("button-web3");
        // Apply styles from the styles object & override predefined
        for (const [key, value] of Object.entries(this.styles)) {
            btn.style[key] = value;
        }
        btn.addEventListener("click", this._handleClick.bind(this));
        return btn;
    }
    _handleClick() {
        // Here you can add the logic for:
        // 1. Checking for crypto wallet injection.
        // 2. Checking wallet connectivity.
        // 3. Checking the network chain ID.
        // 4. Making the user sign a message.
        // 5. Checking for a specific NFT.
        // Depending on the results, call this.onSuccess or this.onFailure.
    }
    _notImplementedError(methodName) {
        throw new Error("CryptoPass: Web3 Button: Not implemented");
    }
    render(parentElement) {
        parentElement.appendChild(this.button);
    }
}
exports.Web3Button = Web3Button;
// ✨ Usage Example:
/*
const btn = new Web3Button({
  onSuccess: () => console.log("Success!"),
  onFailure: () => console.log("Failure."),
  styles: {
    backgroundColor: "blue",
    color: "white",
    padding: "10px 15px",
  },
});

btn.render(document.body); // This would append the button to the body.
*/
