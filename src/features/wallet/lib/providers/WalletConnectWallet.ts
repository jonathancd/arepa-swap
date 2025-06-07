import { BaseWalletProvider } from "./BaseWalletProvider";
import EthereumProvider from "@walletconnect/ethereum-provider";

let provider: EthereumProvider | null = null;

// En una arquitectura feature-based, la carpeta lib/ generalmente se usa para:

// Clases o servicios que no son componentes React

// Lógica de negocio o de integración externa (como SDKs o APIs)

// Clases reutilizables, como adaptadores o managers

export class WalletConnectWallet extends BaseWalletProvider {
  id = "walletconnect";
  name = "WalletConnect";
  icon = "/icons/walletconnect.svg";
  group = "top" as const;

  isAvailable(): boolean {
    return true; // WalletConnect can always be initialized
  }

  async connect(): Promise<void> {
    provider = await EthereumProvider.init({
      projectId: "YOUR_PROJECT_ID", // Replace with your WalletConnect project ID
      chains: [1], // Ethereum Mainnet
      showQrModal: true,
    });
    await provider.connect();
    (window as any).ethereum = provider;
  }

  async getAccount(): Promise<string | null> {
    if (!provider) return null;
    return provider.accounts[0] || null;
  }

  async getNetwork(): Promise<string | null> {
    if (!provider) return null;
    return provider.chainId?.toString() || null;
  }

  async switchNetwork(chainIdHex: string): Promise<void> {}
}
