export interface RawTokenDTO {
  token_address: string;
  name: string;
  symbol: string;
  logo?: string;
  decimals?: number;
  balance: string;
}

export interface NormalizedToken {
  contract_address: string;
  contract_name: string;
  contract_ticker_symbol: string;
  logo_url: string;
  decimals: number;
  balance: number;
  network: string;
}

export interface EnrichedToken extends NormalizedToken {
  quote: number | null;
  is_suspicious: boolean;
}
