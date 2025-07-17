import { Protocol } from "@/features/protocols/constants/Protocol";
import { ISwapAdapter } from "../types/ISwapAdapter";
import { UniswapV2SwapAdapter } from "./UniswapV2SwapAdapter";
import { IEvmNetwork } from "@/features/protocols/evm/types/IEvmNetwork";

// Nota: Si crecen mucho los protocolos, se puede hacer un mapa de creadores

export async function SwapAdapterFactory(params: {
  network: IEvmNetwork;
  signer?: any;
}): Promise<ISwapAdapter | null> {
  const { network, signer } = params;
  let providerOrSigner = signer;
  if (!providerOrSigner) {
    // Import dinámico para optimizar el bundle (opcional)
    const { JsonRpcProvider } = await import("ethers");
    providerOrSigner = new JsonRpcProvider(network.rpcUrl);
  }
  if (network.protocol === Protocol.EVM) {
    return new UniswapV2SwapAdapter(network.routerAddress, providerOrSigner);
  }
  // Aquí puedes agregar más protocolos en el futuro
  return null;
}
