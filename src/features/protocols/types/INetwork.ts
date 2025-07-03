import { IEvmNetwork } from "../evm/types/IEvmNetwork";

export type INetwork = IEvmNetwork; // Expand later with | SolanaNetwork | BitcoinNetwork etc.

// ¿Y después?
// Para agregar soporte a Solana:

// features/solana/types/SolanaNetwork.ts

// features/solana/constants/registry.ts

// features/solana/utils/solanaNetworkUtils.ts

// Actualizar INetwork.ts así:

// import { EvmNetwork } from "@/features/evm/types/EvmNetwork";
// import { SolanaNetwork } from "@/features/solana/types/SolanaNetwork";

// export type Network = EvmNetwork | SolanaNetwork;
// Y también agregar a NetworkRegistry:

// import { evmNetworks } from "@/features/evm/constants/registry";
// import { solanaNetworks } from "@/features/solana/constants/registry";

// export const NetworkRegistry: Network[] = [...evmNetworks, ...solanaNetworks];

// Ejemplo de SolanaNetwork
// {
//   id: "solana",
//   name: "Solana",
//   icon: "/icons/networks/solana.svg",
//   explorerUrl: "https://solscan.io",
//   rpcUrl: "...",
//   type: "solana",
// }

/**
 * 
 * 
 *  types/INetwork.ts
    export interface INetworkBase {
        id: string | number;
        name: string;
        icon: string;
        type: "evm" | "solana" | "bitcoin"; // etc.
    }

    // types/evm/EvmNetwork.ts
    import { EvmChain } from "@moralisweb3/common-evm-utils";
    import { INetworkBase } from "../INetwork";

    export interface EvmNetwork extends INetworkBase {
        type: "evm";
        chainIdHex: string;
        evmChain: EvmChain;
    }

    // types/solana/SolanaNetwork.ts
    import { INetworkBase } from "../INetwork";

    export interface SolanaNetwork extends INetworkBase {
        type: "solana";
        explorerUrl: string;
        rpcUrl: string;
    }
 */
