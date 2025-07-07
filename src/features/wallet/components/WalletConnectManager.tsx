"use client";

import { useWalletStore } from "../stores/walletStore";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { WalletOverview } from "./WalletOverview";

export function WalletConnectManager() {
  const { account } = useWalletStore();

  return account ? <WalletOverview /> : <ConnectWalletButton />;
}
