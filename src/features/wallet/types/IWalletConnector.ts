import { ethers } from "ethers";

export interface IWalletConnector {
  name: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: () => boolean;
  isPreviouslyConnected: () => boolean;
  getAccount: () => string | null;
  getChainId: () => number | null;
  getProvider: () => ethers.Provider | null;
  getSigner: () => ethers.Signer | null;
}
