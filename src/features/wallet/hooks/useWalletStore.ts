import { create } from "zustand";
import { IWalletConnector } from "../types/IWalletConnector";
import { MetaMaskConnector } from "../services/MetaMaskConnector";

type WalletState = {
  connector: IWalletConnector;
  account: string | null;
  chainId: number | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
};

export const useWalletStore = create<WalletState>((set, get) => {
  const connector = new MetaMaskConnector();

  return {
    connector,
    account: null,
    chainId: null,
    isConnected: false,

    connectWallet: async () => {
      await connector.connect();

      set({
        account: connector.getAccount(),
        chainId: connector.getChainId(),
        isConnected: connector.isConnected(),
      });
    },

    disconnectWallet: () => {
      connector.disconnect();

      set({
        account: null,
        chainId: null,
        isConnected: false,
      });
    },
  };
});
