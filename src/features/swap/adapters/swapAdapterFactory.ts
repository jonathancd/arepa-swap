import { Protocol } from "@/features/protocols/constants/Protocol";
import { ISwapAdapter } from "../types/ISwapAdapter";
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

  const protocolRegistry = (SwapAdapterRegistry as any)[protocol];
  if (!protocolRegistry) {
    return null;
  }

  const AdapterClass = protocolRegistry[swapMode] || protocolRegistry.default;
  if (!AdapterClass) {
    return null;
  }

  // EVM: pasa routerAddress y providerOrSigner si es necesario
  if (protocol === Protocol.EVM) {
    if (swapMode === "ethers") {
      if (!network.routerAddress) {
        return null;
      }

      return new AdapterClass(network.routerAddress, providerOrSigner);
    }
    if (swapMode === "1inch") {
      return new AdapterClass(network.id);
    }
    if (swapMode === "lifi") {
      return new AdapterClass();
    }
  }

  return null;
}

// Notas
// si la network no tiene router address debemos bloquear la app.. manejo de errores
// la manera en la que se retorna el adapter con IFs no estoy seguro.. debe haber una mejor manera..
