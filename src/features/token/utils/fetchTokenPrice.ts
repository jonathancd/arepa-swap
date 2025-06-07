import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

export async function fetchTokenPrice(address: string, chain: EvmChain) {
  try {
    const res = await Moralis.EvmApi.token.getTokenPrice({ address, chain });
    return res.toJSON().usdPrice || 0;
  } catch {
    return 0;
  }
}
