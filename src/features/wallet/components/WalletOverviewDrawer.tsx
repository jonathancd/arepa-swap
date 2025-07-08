"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { WalletOverviewContent } from "./WalletOverviewContent";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useWalletStore } from "../stores/walletStore";
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";

export function WalletOverviewDrawer() {
  const { isOverviewModalOpen, closeOverviewModal } = useWalletStore();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Drawer
      open={isOverviewModalOpen}
      onOpenChange={(open) => {
        if (!open) closeOverviewModal();
      }}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent className="h-full w-full bg-background text-foreground p-0 rounded-l-[var(--radius)] border-[var(--drawer-border-color)]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--drawer-border-color)] rounded-tl-[var(--radius)] bg-[var(--drawer-header-bg)] text-[var(--drawer-header-text)]">
          <DialogTitle className="text-lg font-semibold">
            Wallet Overview
          </DialogTitle>

          <DialogClose asChild>
            <button
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close wallet overview"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </DialogClose>
        </div>
        <div className="px-4 pt-4">
          <DialogDescription>
            View your assets and wallet details in this drawer.
          </DialogDescription>
          <WalletOverviewContent onClose={closeOverviewModal} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
