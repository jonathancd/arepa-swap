import { fetchWalletOverview } from "./fetchWalletOverview";
import { useWalletStore } from "../stores/walletStore";
import { Protocol } from "@/features/protocols/constants/Protocol";

export async function loadWalletOverviewIntoStore(
  account: string,
  protocol: Protocol
) {
  const {
    setOverviewTokenBalances,
    setOverviewTotalUSD,
    setIsOverviewLoading,
  } = useWalletStore.getState();

  try {
    setIsOverviewLoading(true);
    const { tokens, totalUSD } = await fetchWalletOverview(account, protocol);
    setOverviewTokenBalances(tokens);
    setOverviewTotalUSD(totalUSD);
  } catch (err) {
    console.error("Failed to load wallet overview:", err);
  } finally {
    setIsOverviewLoading(false);
  }
}
