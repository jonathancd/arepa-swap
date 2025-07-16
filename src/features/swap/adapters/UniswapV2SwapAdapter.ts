import { BaseSwapAdapter } from "./BaseSwapAdapter";
import { SwapParams, SwapEstimate, ApproveParams } from "../types/ISwapAdapter";
import { Contract, formatUnits, parseUnits } from "ethers";
import UniswapV2RouterABI from "../abi/UniswapV2Router.json";

// ABI (Application Binary Interface) for UniswapV2Router02
// UniswapV2RouterABI includes only the functions needed for a basic swap flow.
// ABI is used by ethers.js to encode/decode calls to smart contracts.
// UniswapV2 documentation: https://docs.uniswap.org/protocol/V2/reference/smart-contracts/router-02

/**
 * UniswapV2RouterABI is 100% compatible with:
 *
 * Uniswap V2
 * PancakeSwap
 * QuickSwap
 * SushiSwap
 */

/**
 * Adapter for UniswapV2-based routers on EVM chains.
 * This adapter assumes the router contract is already deployed and known.
 */
export class UniswapV2SwapAdapter extends BaseSwapAdapter {
  constructor(
    private routerAddress: string,
    private signer: any // Ethers Signer (must be passed from wallet integration)
  ) {
    super();
    this.router = new Contract(
      this.routerAddress,
      UniswapV2RouterABI,
      this.signer
    );
  }

  private router: Contract;

  async estimateSwap(params: SwapParams): Promise<SwapEstimate> {
    const { amountIn, tokenIn, tokenOut, path } = params;

    const route = path ?? [tokenIn, tokenOut];
    const amountInParsed = parseUnits(amountIn, 18); // ajustar a decimals reales si es necesario

    const amountsOut = await this.router.getAmountsOut(amountInParsed, route);
    // const amountOut = amountsOut[amountsOut.length - 1].toString();
    const amountOut = amountsOut[amountsOut.length - 1];
    const amountOutFormatted = formatUnits(amountOut, 18);

    return {
      amountOut,
      amountOutFormatted,
      route,
    };
  }

  async approve(params: ApproveParams): Promise<boolean> {
    const { tokenAddress, spender, amount } = params;
    const erc20 = new Contract(
      tokenAddress,
      [
        "function approve(address spender, uint256 amount) public returns (bool)",
      ],
      this.signer
    );
    const tx = await erc20.approve(spender, parseUnits(amount, 18));
    await tx.wait();
    return true;
  }

  async executeSwap(params: SwapParams): Promise<string> {
    const { account, tokenIn, tokenOut, amountIn, slippage, path } = params;
    const route = path ?? [tokenIn, tokenOut];

    const amountInParsed = parseUnits(amountIn, 18);
    const amountsOut = await this.router.getAmountsOut(amountInParsed, route);

    const amountOut = amountsOut[amountsOut.length - 1];
    const slippageFactor = BigInt(Math.floor((1 - slippage / 100) * 10000));
    const amountOutMin = (amountOut * slippageFactor) / BigInt(10000);

    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const tx = await this.router.swapExactTokensForTokens(
      amountInParsed,
      amountOutMin,
      route,
      account,
      deadline
    );

    const receipt = await tx.wait();
    return receipt.hash;
  }
}
