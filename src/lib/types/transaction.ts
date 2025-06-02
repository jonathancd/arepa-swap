export interface TxReceipt {
  hash: string;
  from: string;
  to: string;
  status: number; // 1 = success, 0 = failed
  blockNumber: number;
  gasUsed: bigint;
  logs: any[];
}
