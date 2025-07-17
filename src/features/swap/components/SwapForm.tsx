"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useSwapStore } from "@/features/swap/stores/swapStore";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSwapDefaults } from "../hooks/useSwapDefaults";
import { useTokenPrice } from "@/features/token/hooks/useTokenPrice";
import { ChevronDown, ArrowDownUp } from "lucide-react";
import { TokenSelectorModal } from "@/features/token/components/TokenSelectorModal";
import { useTokenBalanceFromStore } from "@/features/token/hooks/useTokenBalanceFromStore";
import { useAvailableNetworks } from "@/features/network/hooks/useAvailableNetworks";
import { IToken } from "@/features/token/types/IToken";

export function SwapForm() {
  const availableNetworks = useAvailableNetworks();
  const { account, setIsConnectModalOpen } = useWalletStore();
  const { config, setFromToken, setToToken, swapTokens } = useSwapStore();
  const { selectedNetwork, setSelectedNetwork } = useNetworkStore();

  const [amountIn, setAmountIn] = useState("");
  const [estimatedOut, setEstimatedOut] = useState<string | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [editingField, setEditingField] = useState<"in" | "out" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debouncedAmountIn] = useDebounce(amountIn, 400);

  const tokenIn = config.fromToken;
  const tokenOut = config.toToken;

  const priceIn = useTokenPrice(tokenIn);
  const priceOut = useTokenPrice(tokenOut);

  const tokenInBalance = Number(useTokenBalanceFromStore(tokenIn));

  const insufficientBalance = useMemo(() => {
    if (!tokenIn || !amountIn || !tokenInBalance) return false;
    return parseFloat(amountIn) > tokenInBalance;
  }, [amountIn, tokenIn, tokenInBalance]);

  const tokenInUsd =
    priceIn && amountIn ? (parseFloat(amountIn) * priceIn).toFixed(2) : null;

  const tokenOutUsd =
    priceOut && estimatedOut
      ? (parseFloat(estimatedOut) * priceOut).toFixed(2)
      : null;

  useEffect(() => {
    const estimate = async () => {
      if (
        !config.swapAdapter ||
        !tokenIn?.address ||
        !tokenOut?.address ||
        !debouncedAmountIn
      ) {
        console.log(config);
        console.log(tokenIn?.address);
        console.log(tokenOut?.address);
        console.log(debouncedAmountIn);
        return;
      }

      try {
        setEstimating(true);
        setError(null);
        const result = await config.swapAdapter.estimateSwap({
          account: account ?? "",
          tokenIn: tokenIn.address,
          tokenOut: tokenOut.address,
          amountIn: debouncedAmountIn,
          slippage: 0.005,
        });
        setEstimatedOut(result.amountOutFormatted);
      } catch (err) {
        console.error("Estimate error", err);
        setError("Failed to estimate swap");
        setEstimatedOut(null);
      } finally {
        setEstimating(false);
      }
    };

    estimate();
  }, [config.swapAdapter, tokenIn, tokenOut, debouncedAmountIn, account]);

  const handleSwap = async () => {
    if (!config.swapAdapter || !account || !tokenIn || !tokenOut || !amountIn)
      return;

    try {
      const tx = await config.swapAdapter.executeSwap({
        account,
        tokenIn: tokenIn.address,
        tokenOut: tokenOut.address,
        amountIn,
        slippage: 0.005,
      });
      alert(`Swap executed! TX: ${tx}`);
    } catch (err) {
      console.error("Swap error", err);
      alert("Swap failed.");
    }
  };

  // Limpia la estimación y el input al intercambiar tokens
  const handleSwapTokens = () => {
    swapTokens();
    setAmountIn("");
    setEstimatedOut(null);
  };

  const handleTokenClick = (field: "in" | "out") => setEditingField(field);

  const handleSelectToken = (token: IToken) => {
    if (!editingField) return;

    if (editingField === "in") {
      if (token.chainId !== selectedNetwork?.id) {
        const newNetwork = availableNetworks.find(
          (n) => n.id === token.chainId
        );
        if (newNetwork) {
          setSelectedNetwork(newNetwork);
        }
      }
      setFromToken(token);
    }

    if (editingField === "out") {
      setToToken(token);
    }

    setEditingField(null);
  };

  const swapDisabled =
    !account || estimating || !estimatedOut || insufficientBalance;

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 bg-muted rounded-xl shadow">
      {/* From */}
      <div>
        <label className="block text-sm font-medium">
          From - {selectedNetwork?.name}/{selectedNetwork?.protocol}
        </label>
        <div className="flex items-center w-full h-[80px] bg-surface p-2 rounded">
          <div className="flex-1 px-2">
            <Button
              onClick={() => handleTokenClick("in")}
              variant="outline"
              className="h-[32px] pl-[36px] pr-[12px] relative border-0 rounded text-base font-semibold hover:opacity-[0.6]"
            >
              <div className="absolute left-0 w-[32px]">
                {tokenIn?.icon && (
                  <Image
                    src={tokenIn.icon}
                    alt={tokenIn.symbol}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
              </div>
              <div className="hidden sm:inline-flex truncate">
                {tokenIn?.displaySymbol ?? "-"}
              </div>
              <div className="ml-auto text-white">
                <ChevronDown />
              </div>
            </Button>

            <Input
              type="number"
              placeholder="Amount"
              className="text-right text-sm mt-2"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
            />
          </div>

          <div className="text-sm text-muted-foreground ml-2 mt-4">
            {tokenInUsd ? `~$${tokenInUsd} USD` : "-"}
            <div className="text-xs mt-1">
              {tokenIn && tokenInBalance != null
                ? `Balance: ${tokenInBalance} ${tokenIn?.symbol}`
                : "Balance: -"}
            </div>
          </div>
        </div>
      </div>

      {/* Switch */}
      <div className="text-center">
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full"
          onClick={handleSwapTokens}
        >
          <ArrowDownUp />
        </Button>
      </div>

      {/* To */}
      <div>
        <label className="block text-sm font-medium">To</label>
        <div className="flex items-center w-full h-[80px] bg-surface p-2 rounded">
          <div className="flex-1 px-2">
            <Button
              onClick={() => handleTokenClick("out")}
              variant="outline"
              className="h-[32px] pl-[36px] pr-[12px] relative border-0 rounded text-base font-semibold hover:opacity-[0.6]"
            >
              <div className="absolute left-0 w-[32px]">
                {tokenOut?.icon && (
                  <Image
                    src={tokenOut.icon}
                    alt={tokenOut.symbol}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
              </div>
              <div className="hidden sm:inline-flex truncate">
                {tokenOut?.displaySymbol ?? "-"}
              </div>
              <div className="ml-auto text-white">
                <ChevronDown />
              </div>
            </Button>

            <div className="text-xs text-right text-muted-foreground mt-2">
              Estimated: {estimating ? "..." : estimatedOut ?? "-"}{" "}
              {tokenOut?.symbol}
              <hr />
              USD: {tokenOutUsd ? ` (~$${tokenOutUsd} USD)` : ""}
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Submit */}
      <Button
        onClick={account ? handleSwap : () => setIsConnectModalOpen(true)}
        disabled={swapDisabled}
        className="w-full !p-4 !py-6 font-semibold text-black rounded hover:opacity-[0.6]"
      >
        {!account
          ? "Connect Wallet"
          : insufficientBalance
          ? "Insufficient balance"
          : estimating
          ? "Estimating..."
          : "Swap"}
      </Button>

      {/* Token Modal */}
      <TokenSelectorModal
        open={editingField !== null}
        editingField={editingField}
        currentFromToken={tokenIn}
        currentToToken={tokenOut}
        onClose={() => setEditingField(null)}
        onSelect={handleSelectToken}
        onSwapTokens={handleSwapTokens}
      />
    </div>
  );
}
