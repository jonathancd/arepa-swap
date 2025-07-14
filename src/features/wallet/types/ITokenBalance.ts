export interface ITokenBalance {
  contract_address: string;
  contract_name: string;
  contract_ticker_symbol: string;
  logo_url: string;
  balance: number;
  quote?: number;
  network?: string; // solo para multichain overview
}
