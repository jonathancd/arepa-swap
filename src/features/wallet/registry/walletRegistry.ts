import { BaseWalletAdapter } from "../adapters/BaseWalletAdapter";

/**
 * A passive, in-memory registry for wallet adapters.
 * Used to list available wallets, retrieve them by ID,
 * or register new implementations at runtime.
 *
 * This module is decoupled from Zustand or any reactive logic.
 * You can import it from init.ts, server-side logic, etc.
 */

const adapters = new Map<string, BaseWalletAdapter>();

export const walletRegistry = {
  /**
   * Registers a new wallet adapter in the registry.
   * If an adapter with the same ID exists, it will be overwritten.
   */
  register(adapter: BaseWalletAdapter) {
    adapters.set(adapter.id, adapter);
  },

  /**
   * Returns a wallet adapter by its ID.
   */
  get(id: string): BaseWalletAdapter | undefined {
    return adapters.get(id);
  },

  /**
   * Returns all registered wallet adapters.
   */
  getAll(): BaseWalletAdapter[] {
    return [...adapters.values()];
  },

  /**
   * Clears all adapters (useful for tests or re-init).
   */
  clear() {
    adapters.clear();
  },
};
