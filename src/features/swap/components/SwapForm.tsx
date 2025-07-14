"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import { useSwapStore } from "@/features/swap/stores/swapStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNetworkStore } from "@/features/network/stores/networkStore";
import { ChevronDown, Image } from "lucide-react";

export function SwapForm() {
  const { account, setIsConnectModalOpen } = useWalletStore();
  const { activeSwapAdapter } = useSwapStore();

  const [tokenIn, setTokenIn] = useState("WETH"); // TODO: use from registry
  const [tokenOut, setTokenOut] = useState("USDT");
  const [amountIn, setAmountIn] = useState("");
  const [estimatedOut, setEstimatedOut] = useState<string | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [debouncedAmountIn] = useDebounce(amountIn, 400);

  useEffect(() => {
    const estimate = async () => {
      if (
        !activeSwapAdapter ||
        !account ||
        !tokenIn ||
        !tokenOut ||
        !debouncedAmountIn
      )
        return;
      try {
        setEstimating(true);
        setError(null);
        const result = await activeSwapAdapter.estimateSwap({
          account,
          tokenIn,
          tokenOut,
          amountIn: debouncedAmountIn,
          slippage: 0.005,
        });
        setEstimatedOut(result.amountOut);
      } catch (e: any) {
        console.error("Estimate error", e);
        setError("Failed to estimate swap");
        setEstimatedOut(null);
      } finally {
        setEstimating(false);
      }
    };
    estimate();
  }, [activeSwapAdapter, account, tokenIn, tokenOut, debouncedAmountIn]);

  const handleSwap = async () => {
    if (!activeSwapAdapter || !account || !tokenIn || !tokenOut || !amountIn)
      return;
    try {
      const tx = await activeSwapAdapter.executeSwap({
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

  //   if (!activeSwapAdapter) {
  //     return <p className="text-white">No swap adapter available</p>;
  //   }
  return (
    <div className="max-w-md mx-auto p-4 space-y-4 bg-muted rounded-xl shadow">
      <div>
        <div className="flex flex-col border-0 gap-2">
          <div>
            <label className="block text-sm font-medium">From</label>
            <span>{tokenIn}</span>
          </div>
          <div className="flex flex-row w-full h-[80px] bg-surface p-2 rounded">
            <div>
              <div className="px-2">
                <Button
                  variant="outline"
                  className="h-[32px] pl-[36px] pr-[12px] relative border-0 rounded text-base font-semibold hover:opacity-[0.6]"
                >
                  <div className="absolute left-0 w-[32px]">
                    {/* <Image
                    src={selectedNetwork.icon}
                    alt={selectedNetwork.name}
                    width={100}
                    height={20}
                    className="rounded"
                  /> */}
                  </div>
                  <div className="hidden sm:inline-flex truncate">USDT</div>
                  <div className="ml-auto text-white">
                    <ChevronDown />
                  </div>
                </Button>
              </div>
              <div className="flex-1 text-xs text-right text-muted-foreground">
                <Input
                  type="text"
                  placeholder="Token In"
                  value={tokenIn}
                  onChange={(e) => setTokenIn(e.target.value)}
                />
              </div>
            </div>
            <span>~52.80 USD</span>
          </div>
        </div>
        {/*  */}
        <div>
          <span>Change</span>
        </div>
        {/*  */}
        <div>
          <label className="block text-sm font-medium">To</label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Token Out"
              value={tokenOut}
              onChange={(e) => setTokenOut(e.target.value)}
            />
          </div>
          <div className="text-xs text-right text-muted-foreground">
            Estimated: {estimating ? "..." : estimatedOut ?? "-"} {tokenOut}
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button
        onClick={account ? handleSwap : () => setIsConnectModalOpen(true)}
        disabled={account && (estimating || !estimatedOut) ? true : false}
        className="w-full !p-4 !py-6 font-semibold text-black rounded hover:opacity-[0.6]"
      >
        {account ? "Swap" : "Connect Wallet"}
        {/* Searhing for the best price */}
      </Button>
    </div>
  );
}
/**
 * SwapForm handles swap estimations and executions.
 *
 * This component relies on `account` and `activeSwapAdapter` from the store.
 *    Any update to those values (e.g. from wallet or network sync hooks) will cause a re-render.
 *
 * We debounce `amountIn` to avoid excessive calls to `estimateSwap`.
 * Estimations and execution are fully abstracted through the active swap adapter (based on protocol).
 *
 * Make sure to avoid subscribing to unrelated store properties like `balance` here,
 *    unless they're strictly needed, to reduce unnecessary re-renders (especially from polling).
 */
