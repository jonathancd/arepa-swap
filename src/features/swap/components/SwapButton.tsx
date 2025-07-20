"use client";

import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

interface SwapButtonProps {
  tokenIn: any;
  tokenOut: any;
  amountIn: string;
  amountOut: string;
  insufficientBalanceIn: boolean;
  insufficientBalanceOut: boolean;
  estimating: boolean;
  swapDisabled: boolean;
  isLoading?: boolean;
  onSwap: () => void;
  onConnectWallet: () => void;
}

export function SwapButton({
  tokenIn,
  tokenOut,
  amountIn,
  amountOut,
  insufficientBalanceIn,
  insufficientBalanceOut,
  estimating,
  swapDisabled,
  isLoading = false,
  onSwap,
  onConnectWallet,
}: SwapButtonProps) {
  const getButtonText = () => {
    if (isLoading) return "Initializing...";
    if (!tokenIn || !tokenOut) return "Select tokens";
    if (insufficientBalanceIn) return "Insufficient balance";
    if (insufficientBalanceOut) return "Insufficient balance";
    if (estimating) return "Estimating...";
    if (!amountIn && !amountOut) return "Enter an amount";
    return "Swap";
  };

  const getButtonAction = () => {
    if (!tokenIn || !tokenOut) return onConnectWallet;
    if (swapDisabled) return onConnectWallet;
    return onSwap;
  };

  const isDisabled = swapDisabled && !!tokenIn && !!tokenOut;

  return (
    <Button
      onClick={getButtonAction()}
      disabled={isDisabled || isLoading}
      className="w-full !p-4 !py-6 font-semibold text-black rounded-full hover:opacity-[0.6]"
    >
      {isLoading && <LoaderCircle className="w-4 h-4 animate-spin mr-2" />}
      {getButtonText()}
    </Button>
  );
}
