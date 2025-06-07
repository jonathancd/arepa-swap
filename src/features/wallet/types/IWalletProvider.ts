export interface IWalletProvider {
  id: string;
  name: string;
  icon: string;
  group: "main" | "top" | "more";
  isAvailable(): boolean;
  connect(): Promise<void>;
  getAccount(): Promise<string | null>;
  getNetwork(): Promise<string | null>;
  switchNetwork(chainIdHex: string): Promise<void>;
}
