import { useState, useEffect, useRef } from "react";
import { ethers } from "ethers";
import axios from "axios";
import QRCode from "react-qr-code";
import { saveAs } from "file-saver";
import jsQR from "jsqr";
// import htmlToImage from "html-to-image";

// Images
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

// CSS
import "./App.css";

// My Files
import Web3Button from "../../../cryptopass_web3_btn/index";
import contractData from "../../../cryptopass_smartContracts/contractData.json";

// Components
import StatusDot from "./StatusDot";
import MyButton from "./MyButton";

const WS_URL = "http://localhost:8787/";

interface accessTokenType {
  atId: number;
  role: string;
  expDate: number; // UNIX Timestamp
}

// const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
const provider = new ethers.BrowserProvider(window.ethereum);
// const signer = provider.getSigner();

// const signer = await provider.getSigner();

const cryptoPassContractAddr = contractData.cryptopass.address;
const accessTokenContractAddr = contractData.accesstoken.address;
const cryptoPassABI = contractData.cryptopass.abi;
const accessTokenABI = contractData.accesstoken.abi;
// Creating Contracts

const cryptoPass = new ethers.Contract(
  cryptoPassContractAddr,
  cryptoPassABI,
  provider
);

const accessToken = new ethers.Contract(
  accessTokenContractAddr,
  accessTokenABI,
  provider
);
// ##
function App() {
  const web3ButtonContainerRef = useRef<HTMLDivElement | null>(null);
  const qrRef = useRef<HTMLDivElement | null>(null);

  const [decodedData, setDecodedData] = useState(null);
  const canvasRef = useRef(null);

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
  const [roleType, setRoleType] = useState<string[]>([
    "None",
    "Student",
    "Professor",
    "Staff",
    "Admin",
  ]);

  // type btnState = {
  //   reqSBT: boolean | null;
  //   checkSBT: boolean | null;
  //   reqQR: boolean | null;
  //   getTokenData: boolean | null;
  //   useToken: boolean | null;
  // };

  const [hardhatStatus, setHardhatStatus] = useState<boolean>(false);
  // const [walletConnection, setWalletConnection] = useState<boolean>(false);
  const [cryptoPassContractStatus, setCryptoPassContractStatus] =
    useState<boolean>(false);
  const [accessTokenContractStatus, setAccessTokenContractStatus] =
    useState<boolean>(false);
  const [webServerStatus, setWebServerStatus] = useState<boolean>(false);
  const [webServerAuthStatus, setWebServerAuthStatus] =
    useState<boolean>(false);

  const [btnIsActive, setBtnIsActive] = useState<boolean | null>(null);

  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string>("Student");
  const [userQRtokeId, setUserQRtokeId] = useState<number | null>(null);

  const [currentQRToken, setCurrentQRToken] = useState<accessTokenType | null>(
    null
  );
  const [output, setOutput] = useState<string | null>(null);

  const getUserAddress = async () => {
    const signer = await provider.getSigner();
    console.log("👨‍💻 User Account:", await signer.getAddress());
    setUserAddress(await signer.getAddress());
  };

  useEffect(() => {
    // console.log("1. 🍰 Use Effect has run");
    // console.log("2. 🍰 ", web3ButtonContainerRef.current);
    checkHardhatStatus();
    checkCryptoPassContractDeployment();
    checkAccessTokenContractDeployment();
    checkWebServerStatus();
    checkWebServerAuthStatus();

    getUserAddress();

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setUserAddress(accounts[0]);
      });
    }

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
          setBtnIsActive(true);
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
  }, [web3AuthAPI, roleAPI, chainId, roleType, userAddress]);

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

  // const checkContractDeployment = async (address: string): Promise<boolean> => {
  //   try {
  //     // const code = await provider.getCode(address);
  //     // console.log("Contract Code: ", code);
  //     // return code !== "0x";
  //     const success = await cryptoPass.owner();
  //   } catch (error) {
  //     console.error(`Error checking contract at address ${address}:`, error);
  //     return false;
  //   }
  // };

  const checkCryptoPassContractDeployment = async (): Promise<void> => {
    // const success = await checkContractDeployment(cryptoPassContractAddr);
    const success = await cryptoPass.owner();
    if (success) setCryptoPassContractStatus(true);
  };

  const checkAccessTokenContractDeployment = async (): Promise<void> => {
    // const success = await checkContractDeployment(accessTokenContractAddr);
    const success = await accessToken.owner();

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
        console.log(success);
        setWebServerAuthStatus(true);
      } else {
        setWebServerAuthStatus(false);
      }
    } catch (error) {
      setWebServerAuthStatus(false);
      console.log("⛔ Error while checking if WS has Auth: ", error);
    }
  };

  // Btn Handlers
  const handleRequestSBT = async () => {
    console.log("Requesting SBT...");
    console.log("Provind Address: ", userAddress);
    console.log("Providing Role", userRole);
    try {
      const enumifiedRole = roleType.indexOf(userRole);
      const response = await axios.post(WS_URL + "createSBT", {
        userAddress,
        enumifiedRole,
      });
      setOutput("SoulBound Token Successfully Created!");
      if (!response.data.success) throw new Error("handleRequestSBT");
    } catch (error: any) {
      console.log("Error [Handler]: ", error);
      if (
        error.response.data.error.reason.includes(
          "CryptoPass: You already possess a SBT and you may only have one"
        )
      )
        setOutput(error.response.data.error.reason);
    }
  };

  const handleCheckForSBT = async () => {
    try {
      const response = await axios.post(WS_URL + "retrieve-role", {
        address: userAddress,
      });
      console.log(`The User's Role is: [${roleType[response.data.userRole]}]`);

      if (response.data.userRole < 0 || response.data.userRole > 4)
        throw new Error("handleCheckForSBT");
      setOutput(`The User's Role is: [${roleType[response.data.userRole]}]`);
    } catch (error) {
      console.log("Error [Handler]: ", error);
    }
  };

  const handleRequestQR = async () => {
    try {
      const response = await axios.post<accessTokenType>(
        WS_URL + "qrCodeCreator",
        {
          userAddress,
        }
      );

      setCurrentQRToken(response.data);
      console.log("🍰 The Access Token Data: ", response.data);
      setOutput(
        `The QR Access Code was created Successfully!: ${JSON.stringify(
          response.data
        )}`
      );
      // if (!response.data.success) throw new Error("handleRequestSBT");
    } catch (error) {
      console.log("Error [Handler]: ", error);
      // setOutput("The QR Access Code was created Successfully!");
    }
  };

  // const handleGetQRdata = async () => {
  //   try {
  //     const response = await axios.post(WS_URL + "/qrCodeValidator", {
  //       userAddress,
  //       userRole,
  //     });
  //     if (!response.data.success) throw new Error("handleRequestSBT");
  //   } catch (error) {
  //     console.log("Error [Handler]: ", error);
  //   }
  // };

  const handleUseQR = async () => {
    try {
      setOutput("Waiting for Transaction...");

      await axios.post(WS_URL + "qrCodeValidator", {
        decodedData,
      });
      // if (!response.data.success) throw new Error("handleRequestSBT");
      setOutput("The QR Access Code was USED Successfully!");
    } catch (error) {
      console.log("Error [Handler]: ", error);
      setOutput("Something went wrong 😬");
    }
  };

  const saveQRCode = () => {
    if (qrRef.current) {
      const svg = qrRef.current.querySelector("svg");
      if (svg) {
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svg);
        const img = new Image();
        img.src = "data:image/svg+xml;base64," + btoa(source);
        img.onload = function () {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            saveAs(blob, "qrcode.png");
          });
        };
      } else {
        throw new Error("SVG is null");
      }
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
            Web3 Button <br />
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
        <div className="spacerY"></div>
        <div className="options-container">
          <div className="options-title-btns">Buttons Options</div>
          <div className="spacerY"></div>
          <div className="card-options">
            <div className="options-item">
              <label>Address:</label>
              <input
                value={userAddress ?? "soon your address..."}
                readOnly
                onChange={() => getUserAddress()}
              />
            </div>
            <div className="options-item">
              <label>Role:</label>
              <input
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
              />
            </div>
            <div className="options-item">
              <label>QR Token ID:</label>
              <input
                type="number"
                value={userQRtokeId ?? -1}
                onChange={(e) => setUserQRtokeId(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        <div className="spacerY-24"></div>
        <div style={{ display: "flex", gap: 16 }}>
          <MyButton
            clickHandler={handleRequestSBT}
            label="Request SBT"
            isDisabled={btnIsActive}
          />
          <MyButton
            clickHandler={handleCheckForSBT}
            label="Check SBT"
            isDisabled={btnIsActive}
          />
          <MyButton
            clickHandler={handleRequestQR}
            label="Request QR Code"
            isDisabled={btnIsActive}
          />
          {/* <MyButton
            clickHandler={handleGetQRdata}
            label="Get Access Token Data"
            isDisabled={btnIsActive}
          /> */}
          <MyButton
            clickHandler={handleUseQR}
            label="Use Access Token"
            isDisabled={btnIsActive}
          />
        </div>
        <div className="spacerY-24" />
        <>
          {output !== null && (
            <>
              <div
                style={{
                  border: "#dbe6e9aa solid 2px",
                  backgroundColor: "#61229dba",
                  borderRadius: 16,
                  padding: "8px 24px ",
                }}
              >
                <h3>{output}</h3>
              </div>
              <div className="spacerY" />
            </>
          )}
        </>
        <>
          {currentQRToken !== null && (
            <div
              style={{
                backgroundColor: "gray",
                padding: 24,
                border: "white solid 2px",
                borderRadius: 12,
              }}
            >
              <div id="qr-code-container" ref={qrRef}>
                <QRCode size={384} value={JSON.stringify(currentQRToken)} />
              </div>
            </div>
          )}
        </>

        <div className="spacerY-24" />
        <>
          {currentQRToken !== null && <p>{JSON.stringify(currentQRToken)}</p>}
        </>
        <div className="spacerY-24" />
        <>
          {currentQRToken !== null && (
            <>
              <MyButton
                clickHandler={saveQRCode}
                label="Save QR Code Image"
                isDisabled={currentQRToken === null ? true : false}
              />
              <div className="spacerY-24" />
              <QRDecoder
                canvasRef={canvasRef}
                setDecodedData={setDecodedData}
                decodedData={decodedData}
              />
            </>
          )}
        </>

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

function QRDecoder({ canvasRef, setDecodedData, decodedData }: any) {
  const videoRef = useRef(null);

  useEffect(() => {
    // Get the user's webcam
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        // Start checking for QR codes every second
        const interval = setInterval(checkForQRCode, 2000);
        return () => clearInterval(interval);
      } catch (err) {
        console.error("Error accessing the webcam", err);
      }
    };

    startVideo();
  }, []);

  const checkForQRCode = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      //
      setDecodedData(JSON.parse(code.data));
      console.log("QR Code detected:", code.data);
      document
        .querySelector("#qr-code-container")
        ?.classList.add("wobble-hor-bottom");

      setTimeout(() => {
        document
          .querySelector("#qr-code-container")
          ?.classList.remove("wobble-hor-bottom");
      }, 2500);
    }
  };

  // const handleFileChange = async (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const img = new Image();
  //     img.onload = () => {
  //       const canvas = canvasRef.current;
  //       const ctx = canvas.getContext("2d");
  //       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  //       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //       const code = jsQR(imageData.data, imageData.width, imageData.height);

  //       if (code) {
  //         setDecodedData(JSON.parse(code.data));
  //       } else {
  //         console.error("QR code not found in the image.");
  //       }
  //     };
  //     img.src = e.target.result;
  //   };
  //   reader.readAsDataURL(file);
  // };

  return (
    // <div>
    //   <input type="file" onChange={handleFileChange} />
    //   <canvas
    //     ref={canvasRef}
    //     width={400}
    //     height={400}
    //     style={{ display: "none" }}
    //   ></canvas>
    //   {decodedData && (
    //     <>
    //       <div className="spacerY-24" />
    //       <div
    //         style={{
    //           border: "#dbe6e9aa solid 2px",
    //           backgroundColor: "#61229dba",
    //           borderRadius: 16,
    //           padding: "8px 24px ",
    //         }}
    //       >
    //         <h3>{JSON.stringify(decodedData)}</h3>
    //       </div>
    //     </>
    //   )}
    // </div>
    <div>
      <video ref={videoRef} width={400} height={400}></video>
      {decodedData && <div>{JSON.stringify(decodedData)}</div>}
    </div>
  );
}
export default App;
