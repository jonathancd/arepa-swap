import { BaseSwapAdapter } from "./BaseSwapAdapter";
import { SwapParams, SwapEstimate, ApproveParams } from "../types/ISwapAdapter";
import { Contract, formatUnits, parseUnits } from "ethers";
import UniswapV2RouterABI from "../abi/UniswapV2Router.json";

export class UniswapV2SwapAdapter extends BaseSwapAdapter {
  private router: Contract;
  private providerOrSigner: any;
  constructor(
    routerAddress: string,
    providerOrSigner: any // Puede ser un signer o un provider
  ) {
    super();
    this.providerOrSigner = providerOrSigner;
    this.router = new Contract(
      routerAddress,
      UniswapV2RouterABI,
      providerOrSigner
    );
  }

  async estimateSwap(params: SwapParams): Promise<SwapEstimate> {
    const { amountIn, tokenIn, tokenOut, path } = params;

    const route = path ?? [tokenIn.address, tokenOut.address];
    const amountInParsed = parseUnits(amountIn, tokenIn.decimals);

    const amountsOut = await this.router.getAmountsOut(amountInParsed, route);
    const amountOut = amountsOut[amountsOut.length - 1];
    const amountOutFormatted = formatUnits(amountOut, tokenOut.decimals);

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
      this.providerOrSigner
    );
    const tx = await erc20.approve(spender, parseUnits(amount, 18));
    await tx.wait();
    return true;
  }

  async executeSwap(params: SwapParams): Promise<string> {
    const { account, tokenIn, tokenOut, amountIn, slippage, path } = params;
    const route = path ?? [tokenIn.address, tokenOut.address];

    const amountInParsed = parseUnits(amountIn, tokenIn.decimals);
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
