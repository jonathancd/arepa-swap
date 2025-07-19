"use client";

import { motion } from "framer-motion";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { WalletOverviewContent } from "./WalletOverviewContent";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useWalletStore } from "../../stores/walletStore";
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { LogOut, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WalletOverviewDrawer() {
  const { isOverviewModalOpen, closeOverviewModal, disconnectWallet } =
    useWalletStore();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const disconnect = () => {
    disconnectWallet();
    closeOverviewModal();
  };

  return (
    <Drawer
      open={isOverviewModalOpen}
      onOpenChange={(open) => {
        if (!open) closeOverviewModal();
      }}
      direction={isMobile ? "bottom" : "right"}
    >
      <DrawerContent
        className={`flex flex-col bg-background p-0 ${
          isMobile
            ? "rounded-t-[var(--radius)] h-[85vh] border-t border-[var(--drawer-border-color)]"
            : "rounded-l-[var(--radius)] h-screen border-l border-[var(--drawer-border-color)]"
        } custom-no-drawer-handle`}
      >
        <motion.div
          initial={{ y: isMobile ? "100%" : "0%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: isMobile ? "100%" : "0%", opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-1 min-h-0 w-full flex-col"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-background rounded">
            <DialogTitle className="text-lg font-semibold">
              Wallet Overview
            </DialogTitle>

            <DialogDescription className="sr-only">
              An overview of your wallet's current holdings and balances.
            </DialogDescription>

            <DialogClose asChild>
              <button
                className="text-muted-foreground hover:opacity-[0.6]"
                aria-label="Close wallet overview"
                autoFocus
              >
                <XIcon className="h-5 w-5" />
              </button>
            </DialogClose>
          </div>
          <div className="flex flex-col flex-1 min-h-0 pt-4">
            <WalletOverviewContent />
          </div>
          <div className="px-4 pb-4">
            <div className="grid grid-cols-1 gap-4 text-right">
              <Button
                className="border-0 text-xs text-primary hover:opacity-[0.6]"
                variant="outline"
                onClick={disconnect}
              >
                Disconnect
                <LogOut className="w-4 h-4 mr-1" />
              </Button>
            </div>
          </div>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
}
