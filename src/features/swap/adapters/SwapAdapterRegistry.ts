import { EthersSwapAdapter } from "./EthersSwapAdapter";
import { OneInchSwapAdapter } from "./OneInchSwapAdapter";
import { LiFiSwapAdapter } from "./LiFiSwapAdapter";
// import { SolanaSwapAdapter } from "./SolanaSwapAdapter"; // Ejemplo futuro

export const SwapAdapterRegistry = {
  evm: {
    ethers: EthersSwapAdapter,
    "1inch": OneInchSwapAdapter,
    lifi: LiFiSwapAdapter,
    default: EthersSwapAdapter,
  },
  // solana: {
  //   default: SolanaSwapAdapter,
  // },
  // ...otros protocolos
};
