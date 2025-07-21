import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { TokenSelectorLayout } from "../layouts/TokenSelectorLayout";
import { ITokenSelectorProps as Props } from "../../types/ITokenSelector";

export function TokenSelectorDrawer({ open, onClose, ...props }: Props) {
  return (
    <Drawer open={open} onOpenChange={onClose} direction={"bottom"}>
      <DrawerContent className="flex flex-col bg-background rounded-t-[var(--radius)] h-[85vh] border-t border-[var(--drawer-border-color)] custom-no-drawer-handle">
        <TokenSelectorLayout open={open} onClose={onClose} {...props} />
      </DrawerContent>
    </Drawer>
  );
}
