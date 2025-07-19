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
import { motion } from "framer-motion";

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
  const [amountOut, setAmountOut] = useState("");
  const [editingField, setEditingField] = useState<"in" | "out" | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isTokenInFocused, setIsTokenInFocused] = useState(false);
  const [isTokenOutFocused, setIsTokenOutFocused] = useState(false);

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
  console.log({ tokenInUsd });

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
    setRotation((prev) => prev + 180);
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

  const validateNumberInput = (value: string): boolean => {
    const regex = /^\d*\.?\d{0,18}$/;
    return regex.test(value);
  };

  const handleAmountInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || validateNumberInput(value)) {
      setAmountIn(value);
    }
  };

  const handleAmountOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || validateNumberInput(value)) {
      setAmountOut(value);
    }
  };

  const swapDisabled =
    !!account && (estimating || !estimatedOut || insufficientBalance);

  return (
    <div className="w-full sm:w-[500px] flex flex-col gap-4 ">
      <div className="w-full mx-auto p-4 space-y-4 bg-surface rounded-xl shadow">
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
        {/* Token In */}
        <div className="flex flex-col gap-4">
          <label className="block text-xs font-medium">From</label>
          <div
            className={`relative flex items-center w-full h-[80px] bg-background p-2 rounded transition-all duration-200 ${
              isTokenInFocused ? "ring-2 ring-primary ring-offset-0" : ""
            }`}
          >
            <div className="flex flex-1 flex-row px-2">
              <div>
                <Button
                  onClick={() => handleTokenClick("in")}
                  variant="ghost"
                  className="w-85px h-[50px] pl-[36px] pr-[12px] py-4 relative border-0 rounded text-base font-semibold hover:opacity-[0.6]"
                >
                  <div className="absolute left-0 w-[32px]">
                    {tokenIn?.icon && (
                      <Image
                        src={tokenIn.icon}
                        alt={tokenIn.displaySymbol ?? tokenIn.symbol}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                  </div>
                  <div className="hidden sm:inline-flex flex-col text-left">
                    <span className="flex flex-row gap-1 items-center text-2xl">
                      {tokenIn?.displaySymbol ?? tokenIn?.symbol}
                      {tokenIn && <ChevronDown />}
                    </span>
                    <span className="text-xs">{selectedNetwork?.name}</span>
                  </div>
                </Button>
              </div>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="0.00"
                  className="border-0 font-semibold text-right !text-2xl focus:ring-0 focus:border-0 focus:outline-none [&::placeholder]:text-2xl [&::placeholder]:text-muted-foreground !ring-0 bg-transparent"
                  value={amountIn}
                  onChange={handleAmountInChange}
                  onFocus={() => setIsTokenInFocused(true)}
                  onBlur={() => setIsTokenInFocused(false)}
                />
              </div>
            </div>

            <div className="absolute bottom-4 right-7 text-xs text-muted-foreground">
              {tokenInUsd ? `~$${tokenInUsd} USD` : ""}
              {/* <div className="text-xs mt-1">
              {tokenIn && tokenInBalance != null
                ? `Balance: ${tokenInBalance} ${tokenIn?.symbol}`
                : "Balance: -"}
            </div> */}
            </div>
          </div>
        </div>

        {/* Switch */}
        <div className="flex items-center justify-center relative">
          <div className="absolute top-1/2 left-[-16px] right-[-16px] h-px border border-primary"></div>
          <motion.div
            className="relative z-10 bg-surface rounded-full border border-primary"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full bg-transparent border-0 hover:bg-primary/10 transition-all duration-300 ease-in-out"
              onClick={handleSwapTokens}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <ArrowDownUp />
            </button>
          </motion.div>
        </div>

        {/* Token Out */}
        <div className="flex flex-col gap-4">
          <label className="block text-xs font-medium">To</label>
          <div
            className={`relative flex items-center w-full h-[80px] bg-background p-2 rounded transition-all duration-200 ${
              isTokenOutFocused ? "ring-2 ring-primary ring-offset-0" : ""
            }`}
          >
            <div className="flex flex-1 flex-row px-2">
              <div>
                <Button
                  onClick={() => handleTokenClick("out")}
                  variant="outline"
                  className="w-85px h-[50px] pl-[36px] pr-[12px] py-4 relative border-0 rounded text-base font-semibold hover:opacity-[0.6]"
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
                  <div className="hidden sm:inline-flex flex-col text-left">
                    <span className="flex flex-row gap-1 items-center text-2xl">
                      {tokenOut?.displaySymbol ?? tokenOut?.symbol}
                      {tokenOut && <ChevronDown />}
                    </span>
                    <span className="text-xs">{selectedNetwork?.name}</span>
                  </div>
                </Button>
              </div>

              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="0.00"
                  className="border-0 font-semibold text-right !text-2xl focus:ring-0 focus:border-0 focus:outline-none [&::placeholder]:text-2xl [&::placeholder]:text-muted-foreground !ring-0 bg-transparent"
                  value={amountOut}
                  onChange={handleAmountOutChange}
                  onFocus={() => setIsTokenOutFocused(true)}
                  onBlur={() => setIsTokenOutFocused(false)}
                />
              </div>

              {/* <div className="text-xs text-right text-muted-foreground mt-2">
              Estimated: {estimating ? "..." : estimatedOut ?? "-"}{" "}
              {tokenOut?.symbol}
            </div> */}
            </div>

            <div className="absolute bottom-4 right-7 text-xs text-muted-foreground">
              {tokenOutUsd ? ` (~$${tokenOutUsd} USD)` : ""}
            </div>
          </div>
        </div>

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
      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Submit */}
      <Button
        onClick={account ? handleSwap : () => setIsConnectModalOpen(true)}
        disabled={swapDisabled}
        className="w-full !p-4 !py-6 font-semibold text-black rounded-full hover:opacity-[0.6]"
      >
        {!account
          ? "Connect Wallet"
          : insufficientBalance
          ? "Insufficient balance"
          : estimating
          ? "Estimating..."
          : "Swap"}
      </Button>
    </div>
  );
}
