"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useWalletStore } from "../../stores/walletStore";
import { useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { formatNumber } from "@/lib/formatters/formatNumber";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

export function WalletOverviewContent() {
  const {
    account,
    connectedWallet,
    isOverviewLoading,
    overviewTokenBalances,
    overviewTotalUSD,
  } = useWalletStore();

  const overviewTotal = formatNumber(overviewTotalUSD, {
    splitParts: true,
  });

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!account) return;

    navigator.clipboard.writeText(account);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast.success("Address copied to clipboard!");
  };

  if (!account) return null;

  return (
    <div className="flex flex-col flex-1 min-h-0 space-y-4">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {connectedWallet?.icon && (
            <Image
              src={connectedWallet.icon}
              alt="Wallet"
              height={40}
              width={40}
            />
          )}
          <span className="text-base font-semibold text-primary">
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="center"
                className="border border-primary text-xs font-normal bg-muted bg-surface text-white p-2 rounded"
              >
                Copy address
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="text-4xl font-bold text-center min-h-[48px] px-4">
        {isOverviewLoading ? (
          <Skeleton className="h-10 w-40 mx-auto" />
        ) : (
          <>
            <span>${overviewTotal.integer}</span>
            <span className="text-[var(--drawer-subtitle)]">
              .{overviewTotal.decimal}
            </span>
          </>
        )}
      </div>

      <div className="text-xl font-bold mb-0 px-4">My Wallet</div>

      <Tabs
        defaultValue="wallet"
        className="flex flex-col flex-1 min-h-0 w-full"
      >
        <TabsList className="grid grid-cols-2 px-4">
          <TabsTrigger value="wallet" className="p-0">
            Assets
          </TabsTrigger>
          {/* <TabsTrigger value="transactions">Transactions</TabsTrigger> */}
        </TabsList>
        <div className="relative flex-1 min-h-0">
          <TabsContent
            value="wallet"
            className="flex flex-col gap-2 absolute inset-0 pr-1 overflow-auto custom-scrollbar"
          >
            {isOverviewLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-0 py-1"
                  >
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex flex-col gap-1">
                        <Skeleton className="w-20 h-4" />
                        <Skeleton className="w-12 h-3" />
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Skeleton className="w-16 h-4" />
                      <Skeleton className="w-12 h-3" />
                    </div>
                  </div>
                ))
              : overviewTokenBalances
                  .sort((a, b) => (b.quote ?? 0) - (a.quote ?? 0))
                  .map((token) => (
                    <div
                      key={token.contract_address}
                      className="flex items-center justify-between px-0 py-1 px-4"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 relative">
                          <img
                            src={token.logo_url}
                            alt={token.contract_ticker_symbol}
                            className="w-full h-full rounded-full"
                          />
                        </div>
                        <div className="flex flex-col text-left">
                          <div className="flex gap-1 items-center">
                            <div className="max-w-[80px] font-semibold text-sm text-[var(--drawer-title)] truncate">
                              {token.contract_ticker_symbol}
                            </div>
                            <div className="max-w-[55px] text-xs text-[var(--drawer-subtitle)] truncate">
                              {token.contract_name}
                            </div>
                          </div>
                          <div className="font-semibold text-xs text-[var(--drawer-subtitle)]">
                            {token.network}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-sm text-[var(--drawer-title)] truncate">
                          {formatNumber(token.balance, { decimals: 4 })}
                        </div>
                        <div className="text-xs text-[var(--drawer-subtitle)]">
                          {token.quote && (
                            <span>${token.quote.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
          </TabsContent>

          <TabsContent
            value="transactions"
            className="absolute inset-0 overflow-auto pr-1"
          >
            <div className="text-muted-foreground text-sm">
              No recent activity
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
