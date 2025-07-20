"use client";

import { ArrowDownUp, Settings } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

import { SWAP_MODES } from "@/features/swap/constants/swapModes";
import { useSwapStore } from "@/features/swap/stores/swapStore";
import { TokenSelectorModal } from "@/features/token/components/TokenSelectorModal";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TokenInputField } from "./TokenInputField";
import { SwapButton } from "./SwapButton";
import { useSwapForm } from "../hooks/useSwapForm";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useInitializationStore } from "@/stores/initializationStore";

export function SwapForm() {
  const { swapMode, setSwapMode } = useSwapStore();
  const { account } = useWalletStore();
  const { isReady } = useInitializationStore();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [rotation, setRotation] = useState(0);

  const {
    amountIn,
    amountOut,
    editingField,
    isTokenInFocused,

    tokenIn,
    tokenOut,
    tokenInBalance,
    tokenOutBalance,
    tokenInUsd,
    tokenOutUsd,
    selectedNetwork,

    insufficientBalanceIn,
    insufficientBalanceOut,
    swapDisabled,

    estimating,
    error,

    setAmountIn,
    setIsTokenInFocused,
    handleSwapTokens,
    handleTokenClick,
    handleSelectToken,
    handleSwap,
    handleConnectWallet,
  } = useSwapForm();

  const handleSwapTokensWithRotation = () => {
    handleSwapTokens();
    setRotation((prev) => prev + 180);
  };

  return (
    <div className="w-full sm:w-[500px] flex flex-col gap-4">
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
        <TokenInputField
          label="From"
          token={tokenIn}
          amount={amountIn}
          onAmountChange={setAmountIn}
          onTokenClick={() => handleTokenClick("in")}
          networkName={selectedNetwork?.name}
          balance={tokenInBalance}
          usdValue={tokenInUsd ?? "0.0"}
          isFocused={isTokenInFocused}
          onFocus={() => setIsTokenInFocused(true)}
          onBlur={() => setIsTokenInFocused(false)}
          showBalance={!!account}
          disabled={!isReady()}
        />

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
              onClick={handleSwapTokensWithRotation}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <ArrowDownUp />
            </button>
          </motion.div>
        </div>

        {/* Token Out (solo lectura, no input) */}
        <TokenInputField
          label="To"
          token={tokenOut}
          amount={amountOut}
          onAmountChange={() => {}}
          onTokenClick={() => handleTokenClick("out")}
          networkName={selectedNetwork?.name}
          balance={tokenOutBalance}
          usdValue={tokenOutUsd ?? "0.0"}
          isFocused={false}
          onFocus={() => {}}
          onBlur={() => {}}
          showBalance={!!account}
          readOnly={true}
          placeholder="0.00"
          estimating={estimating}
        />

        <TokenSelectorModal
          open={editingField !== null}
          editingField={editingField}
          currentFromToken={tokenIn}
          currentToToken={tokenOut}
          onClose={() => handleTokenClick(null)}
          onSelect={handleSelectToken}
          onSwapTokens={handleSwapTokensWithRotation}
        />
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Submit */}
      <SwapButton
        tokenIn={tokenIn}
        tokenOut={tokenOut}
        amountIn={amountIn}
        amountOut={amountOut}
        insufficientBalanceIn={insufficientBalanceIn}
        insufficientBalanceOut={insufficientBalanceOut}
        estimating={estimating}
        swapDisabled={swapDisabled || !isReady()}
        onSwap={handleSwap}
        onConnectWallet={handleConnectWallet}
        isLoading={!isReady()}
      />
    </div>
  );
}
