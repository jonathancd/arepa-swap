interface Window {
  ethereum?: EthereumProvider;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
