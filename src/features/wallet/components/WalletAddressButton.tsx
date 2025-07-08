"use client";

import { Button } from "@/components/ui/button";
import { useWalletStore } from "../stores/walletStore";

// type Props = {
//   ref?: React.Ref<HTMLButtonElement>;
// } & React.ComponentPropsWithoutRef<"button">;
// ref

export function WalletAddressButton({ ...props }) {
  const { account, connectedWallet, openOverviewModal } = useWalletStore();

  if (!account) return null;

  return (
    <Button
      onClick={openOverviewModal}
      variant="outline"
      size="sm"
      className="font-mono"
      {...props}
    >
      {connectedWallet?.icon && (
        <img src={connectedWallet.icon} alt="Wallet" className="w-5 h-5" />
      )}
      {account.slice(0, 2)}...{account.slice(-4)}
    </Button>
  );
}
