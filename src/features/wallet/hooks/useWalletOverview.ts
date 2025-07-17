import { useEffect } from "react";
import { useWalletStore } from "../stores/walletStore";
import { loadWalletOverviewIntoStore } from "../services/loadWalletOverviewIntoStore";

export function useWalletOverview() {
  const { account, protocol } = useWalletStore();

  useEffect(() => {
    console.log("useWalletOverview");
    if (account && protocol) {
      loadWalletOverviewIntoStore(account, protocol);
    }
  }, [account, protocol]);
}
