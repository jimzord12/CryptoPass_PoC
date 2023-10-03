import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import Web3Button from "../../../cryptopass_web3_btn/index";
import contractData from "../../../cryptopass_smartContracts/contractData.json";

import StatusDot from "./StatusDot";

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
// const provider = new ethers.BrowserProvider(window.ethereum);

// const signer = await provider.getSigner();

const cryptoPassContractAddr = contractData.cryptopass.address;
const accessTokenContractAddr = contractData.accesstoken.address;
const cryptoPassABI = contractData.cryptopass.abi;
// const accessTokenABI = contractData.accesstoken.abi;
// Creating Contracts

const cryptoPass = new ethers.Contract(
  cryptoPassContractAddr,
  cryptoPassABI,
  provider
);

// const accessToken = new ethers.Contract(
//   accessTokenContractAddr,
//   accessTokenABI,
//   provider
// );
// ##
function App() {
  const web3ButtonContainerRef = useRef<HTMLDivElement | null>(null);
  // const [hasRun, setHasRun] = useState(false); // Step 1: Introduce the hasRun state variable
  // const [web3ButtonInstance, setWeb3ButtonInstance] =
  //   useState<Web3Button | null>(null);
  const [web3AuthAPI, setWeb3AuthAPI] = useState(
    import.meta.env.VITE_WS_URL + "/web3auth"
  );
  const [roleAPI, setRoleAPI] = useState(
    import.meta.env.VITE_WS_URL + "/retrieve-role"
  );
  const [chainId, setChainId] = useState(
    Number(import.meta.env.VITE_CHAIN_ID) ?? 31337
  );
  const [roleType, setRoleType] = useState([
    "None",
    "Student",
    "Professor",
    "Staff",
    "Admin",
  ]);

  const [hardhatStatus, setHardhatStatus] = useState<boolean>(false);
  // const [walletConnection, setWalletConnection] = useState<boolean>(false);
  const [cryptoPassContractStatus, setCryptoPassContractStatus] =
    useState<boolean>(false);
  const [accessTokenContractStatus, setAccessTokenContractStatus] =
    useState<boolean>(false);
  const [webServerStatus, setWebServerStatus] = useState<boolean>(false);
  const [webServerAuthStatus, setWebServerAuthStatus] =
    useState<boolean>(false);

  useEffect(() => {
    // console.log("1. 🍰 Use Effect has run");
    // console.log("2. 🍰 ", web3ButtonContainerRef.current);
    checkHardhatStatus();
    checkCryptoPassContractDeployment();
    checkAccessTokenContractDeployment();
    checkWebServerStatus();
    checkWebServerAuthStatus();

    if (
      // !web3ButtonContainerRef.current &&
      web3ButtonContainerRef.current !== null
    ) {
      // console.log("3. 🍰 ", "AAAAAAAAAAAAAAAA");

      const container = web3ButtonContainerRef.current as HTMLDivElement;
      container.replaceChildren();
      // Checking if the div is empty

      // Ensure we only initialize once
      const web3Button = new Web3Button({
        // your options here...
        onSuccess: (role) => {
          console.log(`Logged in as: ${role}`);
          const title = document.querySelector("h1");
          const container = document.querySelector(".options-container");
          if (title == null) return;
          if (container == null) return;
          title.style.color = "green";
          container.classList.add("wobble-hor-bottom");
        },
        onFailure: () => {
          console.log("Login failed.");
          const title = document.querySelector("h1");
          if (title == null) return;
          title.style.color = "red";
        },
        web3AuthAPI: web3AuthAPI,
        roleAPI: roleAPI,
        rolesEnum: roleType,
        chainId: chainId,
        // contractAddr: import.meta.env.VITE_SBT_CONTRACT_ADDRESS!,
        // abi: abi,
      });
      web3Button.render(web3ButtonContainerRef.current);
      console.log("👉 A New Web3 Btn was Created!");
    }
  }, [web3AuthAPI, roleAPI, chainId, roleType]);

  const checkHardhatStatus = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8545/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "net_version",
          params: [],
          id: 42,
        }),
      });

      const data = await response.json();

      if (data.result) {
        setHardhatStatus(true);
      } else {
        setHardhatStatus(false);
      }
    } catch (error) {
      setHardhatStatus(false);
    }
  };

  const checkContractDeployment = async (address: string): Promise<boolean> => {
    try {
      const code = await provider.getCode(address);
      return code !== "0x";
    } catch (error) {
      console.error(`Error checking contract at address ${address}:`, error);
      return false;
    }
  };

  const checkCryptoPassContractDeployment = async (): Promise<void> => {
    const success = await checkContractDeployment(cryptoPassContractAddr);
    if (success) setCryptoPassContractStatus(true);
  };

  const checkAccessTokenContractDeployment = async (): Promise<void> => {
    const success = await checkContractDeployment(accessTokenContractAddr);
    if (success) setAccessTokenContractStatus(true);
  };

  const checkWebServerStatus = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_WS_URL as string);
      if (response.ok) {
        setWebServerStatus(true);
      } else {
        setWebServerStatus(false);
      }
    } catch (error) {
      setWebServerStatus(false);
    }
  };

  const checkWebServerAuthStatus = async () => {
    try {
      // This is just a hypothetical endpoint. Replace with an actual auth check endpoint if different.
      const success = await cryptoPass._authPersonal(
        import.meta.env.VITE_WS_ADDRESS
      );
      if (success) {
        setWebServerAuthStatus(true);
      } else {
        setWebServerAuthStatus(false);
      }
    } catch (error) {
      setWebServerAuthStatus(false);
      console.log("⛔ Error while checking if WS has Auth: ", error);
    }
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="status-container">
        {/* <StatusDot status={walletConnection} label="Wallet Connection" /> */}
        <StatusDot status={hardhatStatus} label="Hardhat Local Blockchain" />
        <StatusDot
          status={cryptoPassContractStatus}
          label="CryptoPass Contract"
        />
        <StatusDot
          status={accessTokenContractStatus}
          label="AccessToken Contract"
        />
        <StatusDot status={webServerStatus} label="Web Server" />
        <StatusDot status={webServerAuthStatus} label="Web Server has Auth" />
      </div>
      <div className="card">
        <div className="options-container">
          <div className="options-title">
            Web3 Buttons <br />
            Options
          </div>
          <div className="spacerY"></div>
          <div className="card-options">
            <div className="options-item">
              <label>Web3 Auth API:</label>
              <input
                value={web3AuthAPI}
                onChange={(e) => setWeb3AuthAPI(e.target.value)}
              />
            </div>
            <div className="options-item">
              <label>Role API:</label>
              <input
                value={roleAPI}
                onChange={(e) => setRoleAPI(e.target.value)}
              />
            </div>
            <div className="options-item">
              <label>Chain ID:</label>
              <input
                type="number"
                value={chainId}
                onChange={(e) => setChainId(Number(e.target.value))}
              />
            </div>
            <div className="options-item">
              <label>Role Types:</label>
              <input
                type="text"
                value={roleType}
                onChange={(e) => setRoleType(Array.from(e.target.value))}
              />
            </div>
          </div>
        </div>
        <div ref={web3ButtonContainerRef}></div>

        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
