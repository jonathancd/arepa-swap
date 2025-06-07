import { useWalletStore } from "./stores/walletStore";
import { MetaMaskWallet } from "./lib/providers/MetaMaskWallet";
import { WalletConnectWallet } from "./lib/providers/WalletConnectWallet";

let initialized = false;

export function initWallets() {
  if (initialized) return;
  initialized = true;

  const { registerWallet } = useWalletStore.getState();
  registerWallet(new MetaMaskWallet());
  registerWallet(new WalletConnectWallet());
}
