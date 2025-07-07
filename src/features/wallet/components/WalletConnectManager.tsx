"use client";

import { useWalletStore } from "../stores/walletStore";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { WalletAddressButton } from "./WalletAddressButton";

export function WalletConnectManager() {
  const { account } = useWalletStore();

  return account ? <WalletAddressButton /> : <ConnectWalletButton />;
}
