import { Dialog, DialogContent } from "@/components/ui/dialog";
import { NetworkSelectorLayout } from "../layouts/NetworkSelectorLayout";
import { INetworkSelectorProps as Props } from "../../types/INetworkSelector";

export function NetworkSelectorDialog({ open, onOpenChange, ...props }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="
          !max-w-sm 
          w-full border-0 
          sm:h-[196px]
          flex flex-col
          min-h-0
          p-0 
          gap-0
          rounded
          overflow-hidden
      "
      >
        <NetworkSelectorLayout {...props} />
      </DialogContent>
    </Dialog>
  );
}
