import { Protocol } from "@/features/protocols/constants/Protocol";

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
  abstract getNetwork(): Promise<string | null>;
  abstract switchNetwork(chainId: string): Promise<void>;
}
