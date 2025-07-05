"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import Image from "next/image";
import { useEffect, useState } from "react";

interface WalletConnectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletConnectModal({
  open,
  onOpenChange,
}: WalletConnectModalProps) {
  const { wallets, connectWallet } = useWalletStore();
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const selectedWallet = wallets.find((w) => w.id === selectedWalletId) || null;

  // Attempt connection immediately if wallet is available
  useEffect(() => {
    const tryConnect = async () => {
      if (selectedWallet && selectedWallet.isAvailable()) {
        await connectWallet(selectedWallet.id);
        onOpenChange(false);
      }
    };
    tryConnect();
  }, [selectedWallet]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row w-full h-full">
          {/* Wallet list section */}
          <div className="w-full md:w-1/2 p-6 border-r border-gray-700 max-h-[400px] overflow-y-auto">
            <DialogTitle className="mb-4 text-lg">
              Connect your wallet
            </DialogTitle>
            <div className="grid grid-cols-3 gap-4">
              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => setSelectedWalletId(wallet.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl transition border ${
                    selectedWalletId === wallet.id
                      ? "border-yellow-400 bg-gray-800"
                      : "border-transparent hover:bg-gray-800"
                  }`}
                >
                  <Image
                    src={wallet.icon}
                    alt={wallet.name}
                    width={40}
                    height={40}
                  />
                  <span className="text-sm text-gray-200">{wallet.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Wallet info section */}
          <div className="w-full md:w-1/2 p-6">
            {!selectedWallet && (
              <div className="flex flex-col justify-center h-full text-center text-gray-400">
                <p className="mb-2 text-sm">Haven’t got a wallet yet?</p>
                <a
                  href="https://ethereum.org/en/wallets/"
                  target="_blank"
                  className="text-sky-400 hover:underline"
                >
                  Learn How to Connect
                </a>
              </div>
            )}

            {selectedWallet && !selectedWallet.isAvailable() && (
              <div className="flex flex-col justify-center h-full text-center text-gray-400">
                <p className="mb-2 text-sm font-semibold">
                  {selectedWallet.name} is not installed
                </p>
                <p className="mb-4 text-xs">
                  Please install the {selectedWallet.name} browser extension to
                  connect.
                </p>
                <a
                  href={
                    selectedWallet.installUrl ||
                    "https://ethereum.org/en/wallets/"
                  }
                  target="_blank"
                  className="bg-yellow-400 text-black px-4 py-2 rounded-md text-sm hover:bg-yellow-300"
                >
                  Install
                </a>
              </div>
            )}

            {selectedWallet && selectedWallet.isAvailable() && (
              <div className="flex flex-col justify-center h-full text-center text-gray-100">
                <div className="flex justify-center mb-4">
                  <Image
                    src={selectedWallet.icon}
                    alt={selectedWallet.name}
                    width={48}
                    height={48}
                  />
                </div>
                <p className="mb-2 text-sm font-semibold">
                  Opening {selectedWallet.name}
                </p>
                <p className="text-xs mb-4">
                  Please confirm in {selectedWallet.name}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
