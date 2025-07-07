"use client";

import { Button } from "@/components/ui/button";
import { useWalletStore } from "../stores/walletStore";

type Props = {
  ref?: React.Ref<HTMLButtonElement>;
} & React.ComponentPropsWithoutRef<"button">;

export function WalletAddressButton({ ref, ...props }: Props) {
  const { account } = useWalletStore();

  if (!account) return null;

  return (
    <Button
      ref={ref}
      variant="outline"
      size="sm"
      className="font-mono"
      {...props}
    >
      {account.slice(0, 2)}...{account.slice(-4)}
    </Button>
  );
}
