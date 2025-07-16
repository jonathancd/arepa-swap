import { Protocol } from "@/features/protocols/constants/Protocol";
import { SwapRouters } from "../constants/SwapRouters";
import { UniswapV2SwapAdapter } from "../adapters/UniswapV2SwapAdapter";
import { ISwapAdapter } from "../types/ISwapAdapter";
import { BaseWalletAdapter } from "@/features/wallet/adapters/BaseWalletAdapter";

/**
 * Factory to instantiate the correct swap adapter for a given wallet connection.
 */
export async function SwapAdapterFactory(
  wallet: BaseWalletAdapter
): Promise<ISwapAdapter | null> {
  console.log("SwapAdapterFactory");
  console.log({ wallet });
  const protocol = wallet.protocol;
  const network = await wallet.getNetwork();
  const signer = await wallet.getSigner();

  if (!network || !signer) return null;

  const router = SwapRouters[protocol]?.[network.id];

  if (protocol === Protocol.EVM) {
    return new UniswapV2SwapAdapter(router, signer);
  }

  // Future: handle Solana, etc.
  return null;
}
