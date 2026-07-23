import { createPublicClient, http, parseAbi, type Address, type Chain, type Log } from 'viem';
import type { Config } from './config.js';

export const CROWN_CLAIMED_ABI = parseAbi([
  'event CrownClaimed(address indexed newHolder, uint256 amountETH, bytes32 seed)',
]);

export interface CrownClaimedLog {
  newHolder: Address;
  amountETH: bigint;
  seed: `0x${string}`;
  transactionHash: `0x${string}` | null;
  logIndex: number | null;
}

function toRobinhoodChain(chainId: number, rpcUrl: string): Chain {
  return {
    id: chainId,
    name: 'Robinhood Chain',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: [rpcUrl] },
    },
  } as const satisfies Chain;
}

export function createChainClient(config: Config) {
  const chain = toRobinhoodChain(config.chainId, config.rpcUrl);
  return createPublicClient({
    chain,
    transport: http(config.rpcUrl),
    pollingInterval: config.pollingIntervalMs,
  });
}

export type ChainClient = ReturnType<typeof createChainClient>;

/**
 * Watches CrownClaimed on `config.hookAddress` via HTTP polling (this RPC
 * has no WebSocket endpoint) — viem's watchContractEvent handles the
 * fromBlock/toBlock bookkeeping across polls internally. Returns an unwatch
 * function.
 */
export function watchCrownClaimed(
  client: ChainClient,
  config: Config,
  onCrownClaimed: (log: CrownClaimedLog) => void,
): () => void {
  return client.watchContractEvent({
    address: config.hookAddress,
    abi: CROWN_CLAIMED_ABI,
    eventName: 'CrownClaimed',
    poll: true,
    pollingInterval: config.pollingIntervalMs,
    onLogs: (logs: Log[]) => {
      for (const log of logs) {
        const typed = log as unknown as {
          args: { newHolder: Address; amountETH: bigint; seed: `0x${string}` };
          transactionHash: `0x${string}` | null;
          logIndex: number | null;
        };
        onCrownClaimed({
          newHolder: typed.args.newHolder,
          amountETH: typed.args.amountETH,
          seed: typed.args.seed,
          transactionHash: typed.transactionHash,
          logIndex: typed.logIndex,
        });
      }
    },
    onError: (error: Error) => {
      console.error('[chain] watchContractEvent error:', error.message);
    },
  });
}
