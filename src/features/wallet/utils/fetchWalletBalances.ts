export async function fetchWalletBalances(
  address: string,
  setOverviewTokenBalances: (tokens: any[]) => void,
  setOverviewTotalUSD: (amount: number) => void
) {
  try {
    console.log("Haciendo llamada a la api...");
    const response = await fetch(`/api/wallet/overview?address=${address}`);
    const data = await response.json();
    if (data.error) {
      console.error("Error fetching balances: ", data.error);
      return;
    }

    const { tokens, totalUSD } = data;

    console.log("aja tokens en fetch overview balance");
    console.log({ tokens, totalUSD });
    setOverviewTokenBalances(tokens);
    setOverviewTotalUSD(totalUSD);
  } catch (error) {}
}
