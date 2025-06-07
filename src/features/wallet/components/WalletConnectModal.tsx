"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { BrowserProvider, formatEther } from "ethers";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import Image from "next/image";

interface WalletConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletConnectModal({
  open,
  onOpenChange,
}: WalletConnectModalProps) {
  const { wallets, setAccount, setBalance, setConnectedWallet } =
    useWalletStore();

  const handleConnect = async (walletId: string) => {
    const wallet = wallets.find((w) => w.id === walletId);
    if (!wallet) return;
    await wallet.connect();
    const acc = await wallet.getAccount();
    const provider = new BrowserProvider(window.ethereum);
    const bal = acc ? await provider.getBalance(acc) : null;
    setAccount(acc);
    setBalance(bal ? parseFloat(formatEther(bal)).toFixed(4) : null);
    setConnectedWallet(wallet);
    onOpenChange(false);

    // const dialog = document.getElementById(
    //   "wallet-dialog-close"
    // ) as HTMLButtonElement;
    // dialog?.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Connect Wallet
        </Button>
      </DialogTrigger> */}
      <DialogContent className="max-w-md">
        <DialogTitle>Connect your wallet</DialogTitle>
        <div className="space-y-4">
          <div className="text-xl font-semibold">Connect your wallet</div>
          <div className="grid grid-cols-2 gap-4">
            {wallets.map((wallet) => (
              <Button
                key={wallet.id}
                variant="ghost"
                onClick={() => handleConnect(wallet.id)}
                className="flex flex-col items-center gap-2"
              >
                <Image
                  src={wallet.icon}
                  alt={wallet.name}
                  width={40}
                  height={40}
                />
                <span className="text-sm">{wallet.name}</span>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
