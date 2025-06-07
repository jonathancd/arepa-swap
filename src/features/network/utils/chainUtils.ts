import { SupportedChains } from "../constants/evmChains";

export function getChainById(chainId: string) {
  return Object.values(SupportedChains).find((c) => c.id === chainId) || null;
}

export function getChainNameById(chainId: string): string {
  return getChainById(chainId)?.name ?? "unknown";
}

export function getEvmChainById(chainId: string) {
  return getChainById(chainId)?.chain ?? null;
}
