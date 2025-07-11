import { useEffect } from "react";
import { useWalletStore } from "../stores/walletStore";
import { fetchWalletOverview } from "../utils/fetchWalletOverview";

export function useWalletOverview() {
  const {
    account,
    protocol,
    setIsOverviewLoading,
    setOverviewTokenBalances,
    setOverviewTotalUSD,
  } = useWalletStore();

  useEffect(() => {
    if (account && protocol) {
      fetchWalletOverview(
        account,
        protocol,
        setOverviewTokenBalances,
        setOverviewTotalUSD,
        setIsOverviewLoading
      );
    }
  }, [account, protocol]);
}
