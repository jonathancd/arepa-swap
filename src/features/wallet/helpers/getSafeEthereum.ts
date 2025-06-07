import { ethers } from "ethers";

/**
 * Helper que retorna el objeto window.ethereum con type safety.
 *
 * - Asegura que se está ejecutando en el cliente (no en SSR).
 * - Aplica un type cast que incluye los métodos `on` y `removeListener`,
 *   que no están declarados en el tipo base `Eip1193Provider` de ethers.
 *
 * Esto permite que TypeScript entienda correctamente que `ethereum` es
 * un provider compatible con EIP-1193 + eventos, como MetaMask.
 */
export function getSafeEthereum() {
  // Validación SSR: si estamos en el servidor, no hay window
  if (typeof window === "undefined") return undefined;

  /**
   * El objeto `window.ethereum` inyectado por MetaMask y otros wallets
   * cumple con la especificación EIP-1193: un estándar para la comunicación
   * entre dApps y wallets.
   *
   * El tipo `Eip1193Provider` de ethers.js define métodos básicos como:
   * - request({ method: 'eth_chainId' }) para interactuar con el wallet.
   *
   * Pero no incluye los eventos `.on` y `.removeListener`, así que:
   *
   * Usamos TypeScript para hacer un "intersection type" (&) que dice:
   * -> Este objeto tiene todo lo de `Eip1193Provider`
   *    Y además tiene los métodos `on` y `removeListener`.
   *
   * El tipo completo resultante se usa como un cast para window.ethereum.
   */
  const eth = window.ethereum as
    | (ethers.Eip1193Provider & {
        on: (event: string, handler: (...args: any[]) => void) => void;
        removeListener: (
          event: string,
          handler: (...args: any[]) => void
        ) => void;
      })
    | undefined;

  /**
   * type assertion (as) para decirle a TypeScript:
   * “window.ethereum es del tipo A | B”.
   *
   * Es decir:
   *
   * Este objeto es o bien un proveedor con .on y .removeListener, o es undefined.
   *
   * ¿Por qué | undefined?
   * Porque window.ethereum no siempre está definido. Por ejemplo:
   * En SSR (Server Side Rendering) no existe window.
   * Si el usuario no tiene MetaMask u otro wallet instalado, no existirá window.ethereum.
   */

  return eth;
}
