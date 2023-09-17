export interface web3AuthType {
  userAddress: `0x${string & { length: 40 }}` | string;
  nonce: string | Uint8Array;
  signedMessage: string;
}

export interface accessTokenType {
  atId: Number;
  role: string;
  expDate: Number; // UNIX Timestamp
}
