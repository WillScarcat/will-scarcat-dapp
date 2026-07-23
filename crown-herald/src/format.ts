import { formatEther } from 'viem';
import type { Address } from 'viem';

/** 0x1234...abcd — 6 leading hex chars (incl. 0x), 4 trailing. */
export function shortAddr(address: Address): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/** Trims trailing zeros but keeps at least one decimal place, e.g.
 *  "0.005", "1", "12.34". Never scientific notation. */
export function formatEth(amountWei: bigint): string {
  const full = formatEther(amountWei);
  if (!full.includes('.')) return full;
  const trimmed = full.replace(/0+$/, '').replace(/\.$/, '');
  return trimmed.length === 0 ? '0' : trimmed;
}
