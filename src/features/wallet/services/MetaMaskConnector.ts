"use client";

import { ethers } from "ethers";
import { IWalletConnector } from "../types/IWalletConnector";

export class MetaMaskConnector implements IWalletConnector {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private account: string | null = null;
  private chainId: number | null = null;

  name = "MetaMask";

  /**
   *
   * @returns connect() { ... } // método en el prototipo
   * connect = () => { ... } // propiedad en la instancia
   */
  async connect() {
    console.log("Connect in MetaMaskConnector");
    if (!window.ethereum) {
      alert("MetaMask is not installed!");
      return;
    }

    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const network = await this.provider.getNetwork();

      this.account = accounts[0];
      this.chainId = Number(network.chainId);
      this.signer = await this.provider.getSigner();
    } catch (error: any) {
      if (error.code === -32002) {
        console.warn("MetaMask is already processing a connection request.");
        alert("MetaMask is already connecting. Please check your wallet.");
        return;
      }

      console.error("Failed to connect to MetaMask", error);
      throw error;
    }

    // this.provider = new ethers.BrowserProvider(window.ethereum);

    // const accounts = await this.provider.send("eth_requestAccounts", []);
    // const network = await this.provider.getNetwork();

    // this.account = accounts[0];
    // this.chainId = Number(network.chainId);
    // this.signer = await this.provider.getSigner();
  }

  disconnect() {
    this.account = null;
    this.chainId = null;
    this.provider = null;
    this.signer = null;
  }

  isConnected() {
    return !!this.account;
  }

  isPreviouslyConnected(): boolean {
    return !!window.ethereum?.selectedAddress;
  }

  getAccount() {
    return this.account;
  }

  getChainId() {
    return this.chainId;
  }

  getProvider() {
    return this.provider;
  }

  getSigner() {
    return this.signer;
  }
}
