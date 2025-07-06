import { Protocol } from "@/features/protocols/constants/Protocol";
import { IBaseNetwork } from "@/features/protocols/types/IBaseNetwork";
import { INetwork } from "@/features/protocols/types/INetwork";

export abstract class BaseWalletProvider {
  abstract id: string;
  abstract name: string;
  abstract icon: string;
  abstract group: "main" | "top" | "more";
  abstract protocol: Protocol;

  abstract isAvailable(): boolean;
  abstract connect(): Promise<void>;
  abstract getAccount(): Promise<string | null>;
  abstract getBalance(account: string): Promise<string | null>;
  abstract getNetwork(): Promise<INetwork | null>;
  abstract switchNetwork(chainId: string): Promise<void>;

  onAccountChanged?(cb: (acc: string) => void): void;
  onChainChanged?(cb: () => void): void;
  offListeners?(): void;
}
