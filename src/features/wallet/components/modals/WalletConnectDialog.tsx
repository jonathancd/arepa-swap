"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWalletStore } from "@/features/wallet/stores/walletStore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { XIcon } from "lucide-react";
import { walletRegistry } from "../../registry/walletRegistry";

export function WalletConnectDialog() {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const wallets = walletRegistry.getAll();
  const { isConnectModalOpen, connectWallet, setIsConnectModalOpen } =
    useWalletStore();
  const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
  const selectedWallet = wallets.find((w) => w.id === selectedWalletId) || null;

  useEffect(() => {
    const tryConnect = async () => {
      if (selectedWallet && selectedWallet.isAvailable()) {
        await connectWallet(selectedWallet.id);
        setIsConnectModalOpen(false);
      }
    };
    tryConnect();
  }, [selectedWallet]);

  return (
    <AnimatePresence>
      {isConnectModalOpen && (
        <Dialog open={isConnectModalOpen} onOpenChange={setIsConnectModalOpen}>
          <DialogContent
            showCloseButton={false}
            className="
              flex
              flex-col
              h-screen
              sm:h-[500px]
              min-h-0
              w-full
              md:min-w-[720px]
              max-w-3xl
              border-0
              p-0
              rounded
            "
          >
            <motion.div
              initial={{ y: isMobile ? "100%" : "0%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: isMobile ? "100%" : "0%", opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-1 min-h-0"
            >
              <DialogTitle className="sr-only text-lg font-semibold">
                Wallet Overview
              </DialogTitle>

              <DialogDescription className="sr-only">
                Connect your wallet to be able to use the system
              </DialogDescription>

              <Tabs
                defaultValue="connect"
                className="flex flex-col flex-1 min-h-0 w-full relative rounded"
              >
                {/* Tabs header */}
                <div className="absolute top-2 sm:top-[-36px] left-1/2 -translate-x-1/2 z-10">
                  <TabsList className="bg-background border border-[var(--border)] rounded-full shadow-md flex gap-2 p-0">
                    <TabsTrigger
                      value="connect"
                      className="px-2 sm:px-4 py-4 font-semibold text-xs sm:text-sm rounded-full data-[state=active]:bg-yellow-400 data-[state=active]:text-black transition"
                    >
                      Connect Wallet
                    </TabsTrigger>
                    <TabsTrigger
                      value="about"
                      className="px2 sm:px-4 py-4 font-semibold  text-xs sm:text-sm rounded-full data-[state=active]:bg-yellow-400 data-[state=active]:text-black transition"
                    >
                      What is a Web3 Wallet?
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="absolute right-4 top-4">
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

                {/* Tab 1 */}
                <TabsContent
                  value="connect"
                  className="flex flex-1 min-h-0 overflow-hidden bg-surface rounded"
                >
                  <div className="flex flex-1 flex-col md:flex-row w-full min-h-0">
                    {/* Wallet list with scroll */}
                    <div className="flex flex-col flex-1 min-h-0 md:w-1/2 md:max-w-[360px] pt-14 sm:pt-6 bg-background border-r border-[var(--border)]">
                      <div className="shrink-0 px-4">
                        <DialogTitle className="mb-4 text-lg">
                          Connect your wallet
                        </DialogTitle>
                      </div>
                      <div className="flex-1 min-h-0 pb-4 overflow-y-auto no-scrollbar">
                        <div className="grid grid-cols-3 gap-4 px-4">
                          {wallets.map((wallet) => (
                            <div
                              key={`${wallet.id}`}
                              className="max-w-[100px] flex flex-col items-center justify-center cursor-pointer gap-2 p-3 rounded border border-[var(--border)] hover:opacity-70"
                              onClick={() => setSelectedWalletId(wallet.id)}
                            >
                              <div
                                className={`w-[48px] h-[48px] flex items-center justify-center rounded transition ${
                                  selectedWalletId === wallet.id
                                    ? "opacity-[0.6]"
                                    : ""
                                }`}
                              >
                                <Image
                                  src={wallet.icon}
                                  alt={wallet.name}
                                  width={40}
                                  height={40}
                                />
                              </div>
                              <span className="text-xs text-gray-200">
                                {wallet.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Info panel */}
                    <div className="hidden md:flex md:w-1/2 md:max-w-[360px] p-6 flex-col justify-center text-center">
                      {!selectedWallet && (
                        <div className="text-sm text-gray-400 space-y-2">
                          <p>Haven't got a wallet yet?</p>
                          <a
                            href="https://ethereum.org/en/wallets/"
                            target="_blank"
                            className="text-sky-400 hover:underline"
                          >
                            Learn how to connect
                          </a>
                        </div>
                      )}

                      {selectedWallet && !selectedWallet.isAvailable() && (
                        <div className="text-sm text-gray-400 space-y-3">
                          <p className="font-semibold">
                            {selectedWallet.name} is not installed
                          </p>
                          <p className="text-xs">
                            Please install the {selectedWallet.name} browser
                            extension to connect.
                          </p>
                          <a
                            href="https://ethereum.org/en/wallets/"
                            target="_blank"
                            className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-md text-sm hover:bg-yellow-300"
                          >
                            Install
                          </a>
                        </div>
                      )}

                      {selectedWallet && selectedWallet.isAvailable() && (
                        <div className="text-gray-100 space-y-3">
                          <div className="flex justify-center">
                            <Image
                              src={selectedWallet.icon}
                              alt={selectedWallet.name}
                              width={48}
                              height={48}
                            />
                          </div>
                          <p className="text-sm font-semibold">
                            Opening {selectedWallet.name}
                          </p>
                          <p className="text-xs">
                            Please confirm in {selectedWallet.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Tab 2 */}
                <TabsContent
                  value="about"
                  className="w-full h-full p-6 pt-20 overflow-y-auto"
                >
                  <div className="text-sm text-gray-300 leading-relaxed space-y-4 max-w-xl mx-auto">
                    <p>
                      A Web3 wallet allows you to access decentralized
                      applications (dApps), store your crypto assets, and
                      interact with the blockchain.
                    </p>
                    <p>With wallets like MetaMask or Trust Wallet, you can:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Connect securely to dApps</li>
                      <li>Swap, stake, and manage tokens</li>
                      <li>Retain full control over your assets</li>
                    </ul>
                    <p>
                      It's your gateway into the decentralized world with no
                      banks, no middlemen.
                    </p>
                    <a
                      href="https://ethereum.org/en/wallets/"
                      target="_blank"
                      className="inline-block text-sky-400 hover:underline mt-2"
                    >
                      Learn more on ethereum.org →
                    </a>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
