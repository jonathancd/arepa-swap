"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWalletStore } from "../stores/walletStore";
import { useState } from "react";
import { ClipboardCopy, LogOut } from "lucide-react";
import Image from "next/image";

export function WalletOverviewContent({ onClose }: { onClose: () => void }) {
  const {
    account,
    connectedWallet,
    overviewTokenBalances,
    overviewTotalUSD,
    disconnectWallet,
  } = useWalletStore();

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!account) return;

    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const disconnect = () => {
    disconnectWallet();
    onClose();
  };

  if (!account) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {connectedWallet?.icon && (
            <Image
              src={connectedWallet.icon}
              alt="Wallet"
              height={24}
              width={24}
            />
          )}
          <span className="font-mono text-sm">
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </span>
          <Button size="icon" variant="ghost" onClick={copyToClipboard}>
            <ClipboardCopy className="w-4 h-4" />
          </Button>
        </div>
        <Button onClick={disconnect} size="sm" variant="destructive">
          <LogOut className="w-4 h-4 mr-1" /> Disconnect
        </Button>
      </div>

      <div className="text-2xl font-bold">${overviewTotalUSD.toFixed(2)}</div>

      <Tabs defaultValue="wallet" className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="wallet">
          {overviewTokenBalances.map((token) => (
            <li
              key={token.contract_address}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <img
                  src={token.logo_url}
                  alt={token.contract_ticker_symbol}
                  className="w-4 h-4"
                />
                {token.contract_ticker_symbol}: {token.balance.toFixed(4)}
              </div>
              {token.quote && <span>${token.quote.toFixed(2)}</span>}
            </li>
          ))}
        </TabsContent>

        <TabsContent value="transactions">
          <div className="text-muted-foreground text-sm">
            No recent activity
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="secondary">Buy</Button>
        <Button variant="outline">Receive</Button>
      </div>
    </div>
  );
}
