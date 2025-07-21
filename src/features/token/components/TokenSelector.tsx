"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IToken } from "../types/IToken";

interface TokenSelectorProps {
  token: IToken | null;
  networkName?: string;
  onClick: () => void;
  variant?: "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export function TokenSelector({
  token,
  networkName,
  variant = "ghost",
  size = "md",
  disabled = false,
  onClick,
}: TokenSelectorProps) {
  const sizeClasses = {
    sm: "w-[100px] h-[40px] pr-[8px] py-2 text-sm",
    md: "w-[125px] h-[50px] pr-[12px] py-4 text-base",
    lg: "w-[150px] h-[60px] pr-[16px] py-5 text-lg",
  };

  const iconSizes = {
    sm: { width: 24, height: 24 },
    md: { width: 32, height: 32 },
    lg: { width: 40, height: 40 },
  };

  return (
    <Button
      onClick={onClick}
      variant={variant}
      disabled={disabled}
      className={`${sizeClasses[size]} relative border-0 pl-[50px] rounded font-semibold hover:opacity-[0.6]`}
    >
      <div className={`absolute left-0 w-[${iconSizes[size].width}px]`}>
        {token?.icon && (
          <Image
            src={token.icon}
            alt={token.displaySymbol ?? token.symbol}
            width={iconSizes[size].width}
            height={iconSizes[size].height}
            className="rounded-full"
          />
        )}
      </div>
      <div className="hidden sm:inline-flex flex-col text-left">
        <span className="flex flex-row gap-1 items-center text-2xl">
          {token?.displaySymbol ?? token?.symbol}
          {token && <ChevronDown />}
        </span>
        {networkName && <span className="text-xs">{networkName}</span>}
      </div>
    </Button>
  );
}
