"use client";

import Image from "next/image";
import { useMemo, useState, useRef } from "react";
import { useDebounce } from "use-debounce";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useSwapStore } from "@/features/swap/stores/swapStore";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTokenPrice } from "@/features/token/hooks/useTokenPrice";
import { ChevronDown, ArrowDownUp, Settings } from "lucide-react";
import { TokenSelectorModal } from "@/features/token/components/TokenSelectorModal";
import { useTokenBalanceFromStore } from "@/features/token/hooks/useTokenBalanceFromStore";
import { useAvailableNetworks } from "@/features/network/hooks/useAvailableNetworks";
import { IToken } from "@/features/token/types/IToken";
import { useSwapEstimation } from "../hooks/useSwapEstimation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SWAP_MODES } from "@/features/swap/constants/swapModes";

export function SwapForm() {
  const availableNetworks = useAvailableNetworks();
  const { account, protocol, setIsConnectModalOpen } = useWalletStore();
  const {
    config,
    swapMode,
    setFromToken,
    setToToken,
    swapTokens,
    setSwapMode,
  } = useSwapStore();
  const { selectedNetwork, setSelectedNetwork } = useNetworkStore();

  const [amountIn, setAmountIn] = useState("");
  const [editingField, setEditingField] = useState<"in" | "out" | null>(null);
  const [debouncedAmountIn] = useDebounce(amountIn, 400);
  const [settingsOpen, setSettingsOpen] = useState(false);

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

  // Mover aquí el hook de estimación
  const { estimatedOut, estimating, error } = useSwapEstimation({
    swapAdapter: config.swapAdapter,
    tokenIn,
    tokenOut,
    amountIn: debouncedAmountIn,
    account,
  });

  console.log("Calculando el tokenOutUsd...");
  console.log({ priceOut, estimatedOut });
  const tokenOutUsd =
    priceOut && estimatedOut
      ? (parseFloat(estimatedOut) * priceOut).toFixed(2)
      : null;
  console.log({ estimatedOut });
  console.log(tokenOutUsd);

  // Elimina el useEffect de estimación y polling, ya no es necesario aquí

  const handleSwap = async () => {
    if (!config.swapAdapter || !account || !tokenIn || !tokenOut || !amountIn)
      return;

    try {
      const tx = await config.swapAdapter.executeSwap({
        account,
        tokenIn,
        tokenOut,
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
    // estimatedOut se limpia automáticamente por el hook al cambiar tokens
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
      <div>
        <p>protocol: {protocol}</p>
        <p>net: {selectedNetwork?.name}</p>
      </div>
      {/* Settings Button */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSettingsOpen(true)}
          title="Swap settings"
        >
          <Settings />
        </Button>
      </div>
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-xs p-4 space-y-4">
          <h3 className="text-lg font-semibold mb-2">Modo de swap</h3>
          <div className="flex flex-col gap-2">
            {SWAP_MODES.map((mode) => (
              <Button
                key={mode.key}
                variant={swapMode === mode.key ? "default" : "outline"}
                onClick={() => {
                  setSwapMode(mode.key);
                  setSettingsOpen(false);
                }}
                className="w-full justify-start"
              >
                {mode.label} ({mode.description})
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
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
                    alt={tokenIn.displaySymbol ?? tokenIn.symbol}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
              </div>
              <div className="hidden sm:inline-flex truncate">
                {tokenIn?.displaySymbol ?? tokenIn?.symbol}
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
                    alt={tokenOut.displaySymbol ?? tokenOut.symbol}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
              </div>
              <div className="hidden sm:inline-flex truncate">
                {tokenOut?.displaySymbol ?? tokenOut?.symbol}
              </div>
              <div className="ml-auto text-white">
                <ChevronDown />
              </div>
            </Button>

            <div className="text-xs text-right text-muted-foreground mt-2">
              Estimated: {estimating ? "..." : estimatedOut ?? "-"}{" "}
              {tokenOut?.symbol}
              <hr />
              USD: {tokenOutUsd ? ` (~$${tokenOutUsd} USD)` : " (N/A)"}
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
