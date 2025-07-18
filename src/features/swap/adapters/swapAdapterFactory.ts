import { Protocol } from "@/features/protocols/constants/Protocol";
import { ISwapAdapter } from "../types/ISwapAdapter";
import { EthersSwapAdapter } from "./EthersSwapAdapter";
import { OneInchSwapAdapter } from "./OneInchSwapAdapter";
import { LiFiSwapAdapter } from "./LiFiSwapAdapter";
import { IEvmNetwork } from "@/features/protocols/evm/types/IEvmNetwork";
import { SwapAdapterRegistry } from "./SwapAdapterRegistry";

// Nota: Si crecen mucho los protocolos, se puede hacer un mapa de creadores

export async function SwapAdapterFactory(params: {
  network: IEvmNetwork;
  signer?: any;
  swapMode?: string;
  protocol?: string;
}): Promise<ISwapAdapter | null> {
  const { network, signer, swapMode = "ethers", protocol = "evm" } = params;
  let providerOrSigner = signer;
  if (!providerOrSigner) {
    const { JsonRpcProvider } = await import("ethers");
    providerOrSigner = new JsonRpcProvider(network.rpcUrl);
  }
  // Usamos el registry para obtener el adapter correcto
  const protocolRegistry = (SwapAdapterRegistry as any)[protocol];
  if (!protocolRegistry) return null;
  const AdapterClass = protocolRegistry[swapMode] || protocolRegistry.default;
  // EVM: pasa routerAddress y providerOrSigner si es necesario
  if (protocol === Protocol.EVM) {
    if (swapMode === "ethers") {
      return new AdapterClass(network.routerAddress, providerOrSigner);
    }
    if (swapMode === "1inch") {
      return new AdapterClass(network.id);
    }
    if (swapMode === "lifi") {
      return new AdapterClass();
    }
  }
  // Otros protocolos: lógica futura
  return null;
}
