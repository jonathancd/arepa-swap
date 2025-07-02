import { useWalletStore } from "./stores/walletStore";
import { MetaMaskAdapter } from "./lib/wallets/MetaMaskAdapter";
import { WalletConnectAdapter } from "./lib/wallets/WalletConnectAdapter";

let initialized = false;

export function initWallets() {
  if (initialized) return;
  initialized = true;

  const { registerWallet } = useWalletStore.getState();
  registerWallet(new MetaMaskAdapter());
  registerWallet(new WalletConnectAdapter());
}
