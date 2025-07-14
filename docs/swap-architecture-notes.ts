/*
  Swap Architecture Notes — ArepaSwap
  -----------------------------------
  This file serves as a long-term internal reference to understand
  the reasoning, design decisions, and architecture behind the
  swap feature in ArepaSwap. It is intended for developers extending
  or maintaining the project.
*/

/**
 * Why UniswapV2?
 *
 * - It's an open-source and battle-tested Automated Market Maker (AMM).
 * - Its Router02 contract is widely deployed across many EVM networks.
 * - Well-documented ABI and interaction pattern (getAmountsOut, swapExactTokensForTokens).
 * - Many DEXs (PancakeSwap, SushiSwap, QuickSwap) are based on UniswapV2.
 *
 * It allows us to start with EVM in a familiar and modular way.
 */

/**
 * 🔌 Swap Adapter Design
 *
 * - We use the Adapter Pattern to abstract interaction with swap protocols.
 * - Each implementation (UniswapV2, Jupiter, CowSwap, etc.) extends BaseSwapAdapter.
 * - Interface: estimateSwap(), executeSwap(), optional approve().
 *
 * Benefits:
 * - Supports multiple protocols (EVM/Solana/other).
 * - Decouples app logic from protocol specifics.
 * - Makes mocking and testing easier.
 */

/**
 * Protocol Awareness
 *
 * - Each wallet adapter defines its protocol (EVM, SOLANA, etc.).
 * - When a wallet is connected, we derive the protocol from the adapter.
 * - Then we select the correct SwapAdapter based on the protocol and network.
 *
 * This avoids any hardcoded logic like "if metamask then use Uniswap".
 *
 * SwapAdapterRegistry works like:
 * registerSwapAdapter(protocol: Protocol, networkId: number, adapter: ISwapAdapter)
 * getSwapAdapter(protocol: Protocol, networkId: number): ISwapAdapter
 */

/**
 * Signer & Provider Separation
 *
 * - Instead of using window.ethereum directly, we abstract access via the wallet adapter.
 * - Each WalletAdapter (e.g., MetaMask) must expose getSigner(): Promise<Signer>
 * - This keeps swap adapters decoupled from wallet details.
 *
 *   Swap logic does not care if you're using MetaMask or WalletConnect.
 */

/**
 * Example Future Adapters
 *
 * - UniswapV2SwapAdapter (EVM, already implemented)
 * - UniswapV3SwapAdapter (EVM, more complex, uses ticks and path encoding)
 * - CowSwapAdapter (EVM, order-based instead of direct AMM)
 * - JupiterSwapAdapter (Solana)
 * - ThorchainAdapter (Cross-chain, optional future)
 */

/**
 * Testing Strategy
 *
 * - Adapters are fully mockable because of the interface.
 * - You can inject mock signers, routers, and simulate swaps.
 * - Enables unit tests for slippage, path, minOut, and tx hash.
 */

/**
 * Naming Convention Summary
 *
 * - address: generic string like 0xabc... used in API or backend context
 * - account: connected wallet address, used in store or UI
 * - protocol: the standard (EVM, SOLANA)
 * - networkId: numeric id (1, 56, 137...) used to identify chains
 * - signer: ethers.js object used to sign/send transactions
 */
