"use client";

import { Button } from "@/components/ui/button";
import { useWalletStore } from "../stores/walletStore";
import { ChevronDown } from "lucide-react";

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
      className="h-[32px] pl-[36px] pr-[12px] relative border-0 rounded cursor-pointer text-base font-semibold hover:opacity-[0.6] font-mono "
      {...props}
    >
      {connectedWallet?.icon && (
        <div className="absolute left-0 w-[32px]">
          <img
            src={connectedWallet.icon}
            alt="Wallet"
            className="h-[32px] w-100 rounded"
          />
        </div>
      )}
      <div className="hidden sm:inline-flex truncate">
        {account.slice(0, 2)}...{account.slice(-4)}
      </div>
      <div className="ml-auto">
        <ChevronDown />
      </div>
    </Button>
  );
}
