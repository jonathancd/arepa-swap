import { motion } from "framer-motion";
import Image from "next/image";
import { INetworkSelectorLayoutProps as Props } from "../../types/INetworkSelector";
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { XIcon } from "lucide-react";

export function NetworkSelectorLayout({
  isMobile,
  networks,
  handleSelect,
}: Props) {
  return (
    <motion.div
      initial={{ y: isMobile ? "100%" : "0%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: isMobile ? "100%" : "0%", opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-1 min-h-0 w-full flex-col"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-background rounded">
        <DialogTitle className="text-lg font-semibold">
          Select a Network
        </DialogTitle>

        <DialogDescription className="sr-only">
          Select a network to connect your wallet.
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

      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
        {networks.map((net) => (
          <motion.button
            key={net.id}
            onClick={() => handleSelect(net.id)}
            className="w-full flex items-center gap-3 p-3 bg-surface hover:bg-muted transition-colors hover:opacity-[0.6]"
          >
            <Image
              className="rounded-full"
              src={net.icon}
              alt={net.name}
              width={24}
              height={24}
            />
            <span className="text-sm font-medium">{net.name}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
