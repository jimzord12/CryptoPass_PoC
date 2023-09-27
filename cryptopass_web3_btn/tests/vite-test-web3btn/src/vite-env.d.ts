/// <reference types="vite/client" />

interface ImportMeta {
  env: {
    [key: string]: string;
    // You can specify some known env variables if you prefer
    VITE_WS_URL?: string;
    VITE_SBT_CONTRACT_ADDRESS?: string;
    VITE_CHAIN_ID?: string;
  };
}
