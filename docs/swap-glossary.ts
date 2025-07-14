/*
Swap Glossary - ArepaSwap
This glossary serves as a reference for all key terms and concepts
needed to implement and understand the swap functionality across
different protocols and blockchains (EVM, Solana, etc.).

Format: Plain English definitions with technical context and relevance
for ArepaSwap. This file is for educational and onboarding purposes.
*/

/**

ABI (Application Binary Interface)

Describes how to interact with a smart contract from off-chain code.

Used by libraries like ethers.js to encode/decode data and call contract functions.
*/

/**

Smart Contract

A program deployed on a blockchain that can execute logic deterministically.

Swap functionality typically relies on routers which are smart contracts.
*/

/**

Router

A smart contract (e.g., UniswapV2Router02) that handles swapping tokens

by routing them through available liquidity pools.
*/

/**

Token Approval

ERC20-based action where a user gives permission to a smart contract (like a router)

to spend a certain amount of their tokens. Required before executing swaps.
*/

/**

Slippage

The difference (in %) between expected and actual received tokens.

A protection mechanism: if the price moves unfavorably beyond this threshold,

the transaction will revert.
*/

/**

AmountOutMin

The minimum amount of tokens the user is willing to receive after slippage.

Passed as a parameter in swap transactions.
*/

/**

Deadline

Unix timestamp indicating the latest time a swap transaction can be mined.

Prevents stuck or long-pending transactions from executing too late.
*/

/**

Gas

A fee paid to execute transactions on EVM-compatible blockchains.

Depends on network congestion and operation complexity.
*/

/**

Front-running

A common MEV (Miner Extractable Value) attack where another party submits

a transaction just before yours to profit from your expected price impact.
*/

/**

BigNumberish

A type used by ethers.js that accepts BigNumber, string, number, or hex values

to represent token or ether amounts.
*/

/**

Path

An array of token addresses that defines the swap route (e.g., [USDT, WETH, DAI]).

Used to traverse multiple pairs to reach the final output token.
*/

/**

getAmountsOut

A read-only function provided by router contracts that estimates the output

amount for a given input and path. Used to inform users before confirming swaps.
*/

/**

swapExactTokensForTokens

A function on routers that executes the swap.

Sends an exact amount of input tokens in exchange for at least a minimum amount of output.
*/

/**

ERC20

A widely adopted token standard for fungible tokens on EVM-based chains.

Includes functions like approve, transfer, balanceOf, decimals, etc.
*/

/**

Decimals

Defines how many digits a token uses after the decimal point.

Used to convert between raw BigNumber values and human-readable values.
*/

/**

Ethers.js

A TypeScript-based library for interacting with Ethereum-compatible blockchains.

Used for reading contract state, signing transactions, and handling wallets.
*/

/**

Signer

An object in ethers.js representing the user/wallet that can sign transactions.

Required to perform actions like approvals or swaps.
*/

/**

Protocol

Abstract identifier for blockchain communication standard (e.g., EVM, SOLANA).

Helps route functionality to the appropriate adapter.
*/

/**

Adapter Pattern

A design pattern where each protocol has its own adapter

implementing a common interface to handle operations like swap.
*/

/**

Registry Pattern

A dynamic system to register and retrieve implementations

(e.g., adapters) based on protocol/network.
*/

/**

Liquidity Pool (LP)

A smart contract that holds reserves of two tokens and allows swapping between them

based on an AMM formula (e.g., x * y = k).
*/

/**

Price Impact

The expected change in token price caused by the size of the trade

relative to the liquidity available in the pool.
*/

/**

MEV (Miner/Maximal Extractable Value)

Profits a validator or bot can extract by reordering or inserting transactions

within a block, often at the expense of users.
*/

/**

Estimate

The process of simulating the result of a swap (output amount, route, impact)

without executing the transaction.
*/
