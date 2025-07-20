"use client";

import { Wallet, LoaderCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { TokenSelector } from "@/features/token/components/TokenSelector";
import { IToken } from "@/features/token/types/IToken";
import { formatNumber } from "@/lib/formatters/formatNumber";
import { useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

interface TokenInputFieldProps {
  label: string;
  token: IToken | null;
  amount: string;
  networkName?: string;
  balance?: number;
  usdValue?: string | null;
  isFocused: boolean;
  placeholder?: string;
  disabled?: boolean;
  showBalance?: boolean;
  readOnly?: boolean;
  estimating?: boolean;
  onAmountChange: (value: string) => void;
  onTokenClick: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export function TokenInputField({
  label,
  token,
  amount,
  networkName,
  balance = 0,
  usdValue = "0.0",
  isFocused,
  placeholder = "0.00",
  disabled = false,
  showBalance = true,
  readOnly = false,
  estimating = false,
  onAmountChange,
  onTokenClick,
  onFocus,
  onBlur,
}: TokenInputFieldProps) {
  const validateNumberInput = (value: string): boolean => {
    const regex = /^\d*\.?\d{0,18}$/;
    return regex.test(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || validateNumberInput(value)) {
      onAmountChange(value);
    }
  };

  useEffect(() => {
    if (!token) {
      onAmountChange("");
    }
  }, [token, onAmountChange]);

  const insufficientBalance = amount && parseFloat(amount) > balance;

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-row justify-between text-xs font-semibold">
        {label}
        {showBalance && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={`flex flex-row items-center gap-1 cursor-pointer ${
                    insufficientBalance ? "text-red-500" : ""
                  }`}
                >
                  {insufficientBalance ? 1 : 0}
                  <Wallet className="w-[14px]" />
                  {formatNumber(balance, { decimals: 6 })}
                </span>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="center"
                className="border border-primary text-xs font-normal bg-muted bg-surface text-white p-2 rounded"
              >
                {formatNumber(balance, {
                  decimals: token?.decimals,
                })}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </label>
      <div
        className={`relative flex items-center w-full h-[80px] bg-background p-2 rounded transition-all duration-200 ${
          isFocused ? "ring-2 ring-primary ring-offset-0" : ""
        }`}
      >
        <div className="flex flex-1 flex-row px-2">
          <div>
            <TokenSelector
              token={token}
              networkName={networkName}
              onClick={onTokenClick}
              variant={label === "From" ? "ghost" : "outline"}
              disabled={disabled}
            />
          </div>
          <div className="flex-1">
            <Input
              type="text"
              placeholder={placeholder}
              className="border-0 font-semibold text-right !text-2xl focus:ring-0 focus:border-0 focus:outline-none [&::placeholder]:text-2xl [&::placeholder]:text-muted-foreground !ring-0 bg-transparent"
              value={amount}
              onChange={handleAmountChange}
              onFocus={onFocus}
              onBlur={onBlur}
              disabled={disabled}
              readOnly={readOnly}
            />
          </div>
        </div>

        <div className="absolute bottom-4 right-7 text-xs text-muted-foreground flex items-center gap-1">
          {estimating ? (
            <>
              <LoaderCircle className="w-3 h-3 animate-spin" />
              {usdValue && <span className="ml-2">~${usdValue} USD</span>}
            </>
          ) : amount ? (
            `~${usdValue} USD`
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
