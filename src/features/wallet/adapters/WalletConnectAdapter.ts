import { BaseWalletAdapter } from "./BaseWalletAdapter";
import EthereumProvider from "@walletconnect/ethereum-provider";
import { EvmNetworkRegistry } from "@/features/protocols/evm/constants/evmNetworkRegistry";
import { Protocol } from "@/features/protocols/constants/Protocol";
import { IBaseNetwork } from "@/features/protocols/types/IBaseNetwork";
import { INetwork } from "@/features/protocols/types/INetwork";
import { Signer } from "ethers";

let provider: EthereumProvider | null = null;

export class WalletConnectAdapter extends BaseWalletAdapter {
  id = "walletconnect";
  name = "WalletConnect";
  icon = "/icons/wallets/walletconnect.svg";
  group = "more" as const;
  protocol = Protocol.EVM;

  isAvailable(): boolean {
    return true; // Siempre disponible, no depende de extensión
  }

  async connect(): Promise<void> {
    if (provider) return;

    const chainIds = EvmNetworkRegistry.map((net) => net.id);

    // provider = await EthereumProvider.init({
    //   projectId: "YOUR_PROJECT_ID", // TODO: Reemplazar con tu verdadero Project ID
    //   chains: chainIds,
    //   showQrModal: true,
    // });

    // await provider.connect();

    // Guardar en window sin sobrescribir otros providers
    (window as any).walletconnectProvider = provider;
  }

  async disconnect(): Promise<void> {
    if (!provider) return;

    await provider.disconnect();
    provider = null;

    delete (window as any).walletconnectProvider;
  }

  async getAccount(): Promise<string | null> {
    if (!provider || provider.accounts.length === 0) return null;
    return provider.accounts[0];
  }

  async getBalance(aaccount: string): Promise<string | null> {
    return null;
  }

  // Change imlementation
  async getNetwork(): Promise<INetwork | null> {
    return null;
    // if (!provider) return null;
    // return `0x${provider.chainId?.toString(16)}`; // hex string
  }

  async getSigner(): Promise<Signer | null> {
    return null;
  }

  async switchNetwork(chainIdHex: string): Promise<void> {
    if (!provider) return;

    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }],
      });
    } catch (error: any) {
      console.error("Error switching network (WalletConnect):", error);
      // TODO: Puedes manejar el error 4902 para intentar agregar la red
    }
  }

  async isConnected(): Promise<boolean> {
    return !!(provider && provider.accounts.length > 0);
  }

  getProtocol(): Protocol {
    return Protocol.EVM;
  }
}
