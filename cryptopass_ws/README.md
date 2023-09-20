```
npm install
npm run start
```

```
open http://localhost:3000
```

# CryptoPass_PoC
 A Series of Tools & Services used to Link a Student ID (Or any other) to a crypto-wallet and afterwards authenticate a user based on their wallet address.
 
 This project is split into 3 main components.
  - Frontend (UI)
  - Web Server (WS)
  - Smart Contracts (SC)

## Frontend
Built using Next.js 13 (the most popular and production-ready React framework in 2023), the frontend is responsible for the following actions:

### Linking Student ID with Crypto Wallet Account Address
 - Creating & Sending a Request created by a Student to his/her University Department.
 - The Department will evaluate the Request's data and create an SoulBound Token (SBT) if the data is valid.
 - Once the SBT is created the Link between Student ID and Crypto Wallet Account is completed.

### Creating a temporary QR Code for Authentication.
 - User logs in the Frontend by using his/her Wallet.
 - The Fronted checks if a SBT is available for the Wallet's Address and if there is...
 - Renders a UI where the Students Details are present and there is an option for creating a QR Code
 - To create this QR Code, a request is sent to the WS.
 - When received, WS will call CryptoPass SC to get the user's SBT and also double check its existance. The SBT will
   be accompanied by its metadata. In this case, the user's Role, which is 'student'.
 - Afterwards, if there is an SBT, the WS calls the AccessToken SC.
 - This SC will create a token that will expire after "X" minutes and can only be used once.
 - This token is sent back to the WS.
 - The WS bundles all necessary information together in a Serialized JS Object and forwards it to the Frontend.
 - Finally, the Frontend employs a QR Code Library to encode the received Object and render it as a QR Code.
