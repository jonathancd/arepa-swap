import { Protocol } from "../constants/Protocol";
import { findEvmNetworkById } from "../evm/utils/evmNetworkUtils";

export const getDefaultNetworkByProtocol = (protocol: Protocol) => {
  switch (protocol) {
    case Protocol.EVM:
      return findEvmNetworkById(1); // Ethereum por defecto
    // case Protocol.SOLANA:
    //   return findSolanaNetworkById("mainnet-beta");
    default:
      return null;
  }
};
