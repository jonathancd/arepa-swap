"use client";

import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { WalletOverviewContent } from "./WalletOverviewContent";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useWalletStore } from "../stores/walletStore";

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
      <DrawerContent className="h-full w-full bg-surface text-foreground p-4 overflow-y-auto">
        <WalletOverviewContent onClose={closeOverviewModal} />
      </DrawerContent>
    </Drawer>
  );
}
