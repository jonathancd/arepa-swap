"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRef, useState } from "react";
import { WalletAddressButton } from "./WalletAddressButton";
import { WalletOverviewContent } from "./WalletOverviewContent";

export function WalletOverview() {
  const [open, setOpen] = useState(false);

  const walletRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <WalletAddressButton ref={walletRef} />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <WalletOverviewContent onClose={() => setOpen(false)} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
