import { useEffect } from "react";
import { useWalletStore } from "./useWalletStore";
import { CHAIN_REGISTRY } from "@/features/chains/registry/chainRegistry";
import { IChainAdapter } from "@/features/chains/types/IChainAdapter";
import { getSafeEthereum } from "../helpers/getSafeEthereum";

export function useEthereumEvents() {
  const { account, isConnected, setSelectedChainId, setChainAdapter } =
    useWalletStore();

  useEffect(() => {
    const ethereum = getSafeEthereum();
    if (!ethereum) return;

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      console.log("MetaMask changed to chain:", newChainId);

      setSelectedChainId(newChainId);

      const adapterFactory = CHAIN_REGISTRY[newChainId]?.adapter;
      if (adapterFactory) {
        setChainAdapter(adapterFactory());
      }
    };

    ethereum.on("chainChanged", handleChainChanged);

    return () => {
      ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [setSelectedChainId, setChainAdapter]);

  // useEffect(() => {
  //   const ethereum = getSafeEthereum();

  //   if (!ethereum) return;

  //   const handleChainChanged = async (chainIdHex: string) => {
  //     console.log("handleChainChanged en useEthereumEvents");
  //     const newChainId = parseInt(chainIdHex, 16);
  //     console.log("MetaMask manually changed to chaing: ", newChainId);

  //     setSelectedChainId(newChainId);

  //     const adapterFactory = CHAIN_REGISTRY[newChainId]?.adapter;

  //     /**
  //      *
  //      * Type annotation con declaración sin inicialización.
  //      * Es muy común cuando:
  //      *    Vas a usar la variable más adelante.
  //      *    Solo quieres restringir los posibles valores (IChainAdapter o undefined).
  //      *    Te estás preparando para asignar condicionalmente.
  //      */
  //     let adapter: IChainAdapter | null;

  //     if (adapterFactory) {
  //       adapter = adapterFactory();
  //       setChainAdapter(adapter);
  //     } else {
  //       console.log("No adapter registered for this chain", newChainId);
  //       return;
  //     }

  //     // we can reset the account for security reassons
  //     if (!account || !isConnected) return;

  //     // MetaMask should keep the connection, we can keep showing the data
  //   };

  //   ethereum.on("chainChanged", handleChainChanged);

  //   return () => {
  //     ethereum.removeListener("chainChanged", handleChainChanged);
  //   };
  // }, [account, isConnected, setChainAdapter, setSelectedChainId]);
}
