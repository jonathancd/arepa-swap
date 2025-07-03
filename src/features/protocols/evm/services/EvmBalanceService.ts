import { IBalanceService } from "@/features/protocols/types/IBalanceService";
import {
  normalizeToken,
  isSuspiciousToken,
  enrichWithQuote,
} from "@/features/token/adapters/tokenAdapter";
import { initMoralis } from "@/lib/initMoralis";
import { EvmNetworkRegistry } from "../constants/evmNetworkRegistry";
import Moralis from "moralis";
import { fetchTokenPrice } from "@/features/token/utils/fetchTokenPrice";
import { NormalizedToken } from "@/features/token/types/Token";

export class EvmBalanceService implements IBalanceService {
  async getTokens(address: string): Promise<NormalizedToken[]> {
    await initMoralis();

    const results = await Promise.allSettled(
      EvmNetworkRegistry.map(async (network) => {
        const res = await Moralis.EvmApi.token.getWalletTokenBalances({
          address,
          chain: network.chainIdHex,
        });

        return res
          .toJSON()
          .map((raw) => normalizeToken(raw, network.name))
          .filter((t) => t.balance > 0 && !isSuspiciousToken(t));
      })
    );

    return results
      .filter((r) => r.status === "fulfilled")
      .flatMap((r: any) => r.value);
  }

  async getOverview(address: string) {
    const tokens = await this.getTokens(address);

    const priceResults = await Promise.allSettled(
      // tokens.map((token) =>
      //   fetchTokenPrice(token.contract_address, token.network)
      // )

      tokens.map((token) => {
        const network = EvmNetworkRegistry.find(
          (n) => n.name === token.network
        );
        return network
          ? fetchTokenPrice(token.contract_address, network.evmChain)
          : Promise.resolve(0);
      })
    );

    const priceMap = Object.fromEntries(
      tokens.map((token, index) => [
        token.contract_address.toLowerCase(),
        priceResults[index].status === "fulfilled"
          ? priceResults[index].value
          : 0,
      ])
    );

    const enriched = tokens
      .map((token) =>
        enrichWithQuote(token, priceMap[token.contract_address.toLowerCase()])
      )
      .filter((t) => t.quote !== null && t.quote > 0);

    const totalUSD = enriched.reduce(
      (sum, token) => sum + (token.quote ?? 0),
      0
    );

    return { tokens: enriched, totalUSD };
  }
}
