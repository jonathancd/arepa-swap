import { ethers } from "ethers";

export const getWalletBalance = async (
  provider: ethers.Provider,
  account: string
): Promise<string> => {
  const balance = await provider.getBalance(account);
  return ethers.formatEther(balance);
};
