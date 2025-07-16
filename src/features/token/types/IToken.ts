export interface IToken {
  symbol: string;
  displaySymbol?: string;
  name?: string;
  address: string;
  decimals: number;
  icon: string;
  chainId: number;
  isNative?: boolean;
}
