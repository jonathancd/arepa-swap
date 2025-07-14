import { walletRegistry } from "./registry/walletRegistry";
import { MetaMaskAdapter } from "./adapters/MetaMaskAdapter";
// import { WalletConnectAdapter } from "./adapters/WalletConnectAdapter";

let initialized = false;

/**
 * Initializes all available wallet adapters and registers them.
 * Should be called once on app load (e.g., in RootLayout).
 */
export function initWallets() {
  if (initialized) return;
  initialized = true;

  walletRegistry.register(new MetaMaskAdapter());
  // walletRegistry.register(new WalletConnectAdapter());
}
