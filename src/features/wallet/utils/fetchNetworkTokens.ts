export async function fetchNetworkTokens(
  address: string,
  chainId: string
): Promise<any[]> {
  const response = await fetch(
    `/api/wallet/network-balances?address=${address}&chainId=${chainId}`
  );
  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.tokens;
}
