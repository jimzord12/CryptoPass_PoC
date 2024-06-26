"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Button = void 0;
const styles_module_css_1 = __importDefault(require("./css/styles.module.css"));
class Web3Button {
    // private static defaultStyles: Properties = {
    //   backgroundColor: "#4CAF50", // Example: Green background
    //   color: "white", // White text
    //   padding: "10px 20px", // Some padding
    //   border: "none", // No border
    //   cursor: "pointer", // Hand cursor on hover
    //   // ... any other default styles you want
    // };
    constructor(options) {
        var _a, _b, _c, _d;
        this.disableDefaultStyles = false;
        this.onSuccess =
            (_a = options.onSuccess) !== null && _a !== void 0 ? _a : (() => this._notImplementedError("onSuccess"));
        this.onFailure =
            (_b = options.onFailure) !== null && _b !== void 0 ? _b : (() => this._notImplementedError("onFailure"));
        this.web3AuthAPI =
            (_c = options.web3AuthAPI) !== null && _c !== void 0 ? _c : this._notImplementedError("web3AuthAPI");
        this.contractAddr =
            (_d = options.contractAddr) !== null && _d !== void 0 ? _d : this._notImplementedError("contractAddr");
        this.styles = options.styles;
        this.disableDefaultStyles = options.disableDefaultStyles;
        this.customClass = options.customClass;
        this.button = this._createButton();
    }
    _createButton() {
        const btn = document.createElement("button");
        // If not Disabled, apply default class from the CSS module
        if (!this.disableDefaultStyles)
            btn.classList.add(styles_module_css_1.default.buttonWeb3);
        // Apply styles from the styles object & override predefined
        if (this.styles) {
            for (const [key, value] of Object.entries(this.styles)) {
                btn.style[key] = value;
            }
        }
        // Add custom class if provided (this allows users to use their own CSS to override or extend styles)
        if (this.customClass) {
            btn.classList.add(this.customClass);
        }
        btn.addEventListener("click", this._handleClick.bind(this));
        return btn;
    }
    _handleClick() {
        //TODO:
        // Here you can add the logic for:
        // 1. Checking for crypto wallet injection.
        // 2. Checking wallet connectivity.
        // 3. Checking the network chain ID.
        // 4. Making the user sign a message.
        // 5. Checking for a specific NFT.
        // Depending on the results, call this.onSuccess or this.onFailure.
    }
    _notImplementedError(methodName) {
        throw new Error(`CryptoPass: Web3 Button: Method: [${methodName}] is NOT implemented`);
    }
    help() {
        console.log("Here are the properties of the Options Object you must pass into the Constructor:");
        console.log();
        console.table({
            onSuccess: "Insert a Function that should be executed if the Auth is successful. For instance: () => redirect('/authPages/home')",
            onFailure: "Insert a Function that should be executed if the Auth Fails. For instance: () => showErrorAlert('You do not have Access for this Service')",
            web3AuthAPI: "To check if the request sender is the true owner of the crypto-wallet, a WS must perform some asymmetric cryptography. Provide the WS endpoint here. The HTTP request must GET. For example: 'http://my-awesome-web-server/web3auth' ",
            contractAddr: "The address of the Contract containing the SoulBound Tokens (SBTs). Should be something like this: 0xb794f5ea0ba39494ce839613fffba74279579268",
            styles: "The Button comes with some predefined styles. However, you can provide additional or override the existing ones. To do so, insert something like this: { backgroundColor: 'red', padding: '32px 16px', ...}.",
            disableDefaultStyles: "If you wish to change the styles entirely, assign 'true' this property and add a custom CSS Class",
            customClass: "The name of your custom CSS Class. This provides you with the complete control over the buttons styles.",
        });
        console.log("Here is an example of a Options Object that you must pass into the Constructor:");
        console.log({
            onSuccess: "A function with this signature: () => void, ",
        });
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
