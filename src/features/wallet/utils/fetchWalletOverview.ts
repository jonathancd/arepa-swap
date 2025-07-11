export async function fetchWalletOverview(
  address: string,
  protocol: string,
  setOverviewTokenBalances: (tokens: any[]) => void,
  setOverviewTotalUSD: (amount: number) => void,
  setIsOverviewLoading: (value: boolean) => void
) {
  try {
    setIsOverviewLoading(true);
    const response = await fetch(
      `/api/wallet/overview?address=${address}&protocol=${protocol}`
    );
    const data = await response.json();

    setIsOverviewLoading(false);

    if (data.error) {
      console.error("Error fetching balances: ", data.error);
      return;
    }

    const { tokens, totalUSD } = data;

    setOverviewTokenBalances(tokens);
    setOverviewTotalUSD(totalUSD);
  } catch (error) {
    console.log("ok que pasa????");
    console.log(error);
  }
}
