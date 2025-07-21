import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TokenSelectorLayout } from "../layouts/TokenSelectorLayout";
import { ITokenSelectorProps as Props } from "../../types/ITokenSelector";

export function TokenSelectorDialog({ open, onClose, ...props }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        showCloseButton={false}
        className="
          !max-w-md
          w-full border-0
          sm:h-[550px]
          flex flex-col
          min-h-0
          p-0
          gap-0
          rounded
          overflow-hidden
        "
      >
        <TokenSelectorLayout open={open} onClose={onClose} {...props} />
      </DialogContent>
    </Dialog>
  );
}
