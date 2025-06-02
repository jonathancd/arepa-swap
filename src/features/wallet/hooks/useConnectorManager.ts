import { create } from "zustand";
import { IWalletConnector } from "../types/IWalletConnector";
import { IChainAdapter } from "@/features/chains/types/IChainAdapter";

type ConnectorManagerState = {
  walletConnector: IWalletConnector | null;
  chainAdapter: IChainAdapter | null;
  account: string | null;
  isConnected: boolean;
  selectedChainId: number;
  setSelectedChainId: (id: number) => void;
  setWalletConnector: (connector: IWalletConnector) => void;
  setChainAdapter: (adapter: IChainAdapter) => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
};

export const useConnectorManager = create<ConnectorManagerState>(
  (set, get) => ({
    account: null,
    chainAdapter: null,
    isConnected: false,
    walletConnector: null,
    selectedChainId: 1, // default Ethereum

    setSelectedChainId: (id) => set({ selectedChainId: id }),

    connectWallet: async () => {
      const connector = get().walletConnector;
      if (!connector) return;

      await connector.connect();

      set({
        account: connector.getAccount(),
        isConnected: connector.isConnected(),
      });
    },

    disconnectWallet: () => {
      const connector = get().walletConnector;
      if (!connector) return;

      connector.disconnect();

      set({
        account: null,
        chainAdapter: null,
        isConnected: false,
      });
    },

    setWalletConnector: (connector) => set({ walletConnector: connector }),
    setChainAdapter: (adapter) => set({ chainAdapter: adapter }),
  })
);
