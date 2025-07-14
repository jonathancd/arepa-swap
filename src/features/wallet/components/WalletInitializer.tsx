import { useSyncNetworkWithWallet } from "@/features/network/hooks/useSyncNetworkWithWallet";
import { useRestoreWallet } from "../hooks/useRestoreWallet";
import { useWalletBalanceSync } from "../hooks/useWalletBalanceSync";
import { useWalletOverview } from "../hooks/useWalletOverview";

export function WalletInitializer() {
  useRestoreWallet();
  useWalletOverview();
  useWalletBalanceSync();
  useSyncNetworkWithWallet();

  return null;
}
