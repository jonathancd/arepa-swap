export async function switchToNetwork(chainId: number) {
  if (!window.ethereum) {
    alert("No wallet provider found");
    return;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
  } catch (error: any) {
    // in case the network is not in MetaMask, we can try to add it.
    if (error.code === 4902) {
      alert("This Network is not in MetaMask");
    } else {
      console.log(error);
    }
  }
}
