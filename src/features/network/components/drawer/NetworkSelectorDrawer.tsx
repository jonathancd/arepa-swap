import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { INetworkSelectorProps as Props } from "../../types/INetworkSelector";
import { NetworkSelectorLayout } from "../layouts/NetworkSelectorLayout";

export function NetworkSelectorDrawer({ open, onOpenChange, ...props }: Props) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction={"bottom"}>
      <DrawerContent className="flex flex-col bg-background rounded-t-[var(--radius)] h-[85vh] border-t border-[var(--drawer-border-color)] custom-no-drawer-handle">
        <NetworkSelectorLayout {...props} />
      </DrawerContent>
    </Drawer>
  );
}
