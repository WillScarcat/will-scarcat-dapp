import 'dotenv/config';
import type { Address } from 'viem';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.length === 0) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function optionalEnv(name: string): string | null {
  const value = process.env[name];
  return value && value.length > 0 ? value : null;
}

function requireAddress(name: string): Address {
  const value = requireEnv(name);
  if (!/^0x[0-9a-fA-F]{40}$/.test(value)) {
    throw new Error(`${name} is not a valid address: ${value}`);
  }
  return value as Address;
}

function optionalEnvNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Env var ${name} must be a positive number, got: ${raw}`);
  }
  return parsed;
}

export interface Config {
  rpcUrl: string;
  chainId: number;
  hookAddress: Address;
  tgBotToken: string;
  tgChatId: string;
  debounceMs: number;
  pollingIntervalMs: number;
  // SCARCAT Intelligence
  willToken: Address;
  trackerAddress: Address;
  poolAddress: Address;
  scarcatChatId: string;        // defaults to tgChatId if SCARCAT_TG_CHAT_ID unset
  anthropicApiKey: string | null;
}

export function loadConfig(): Config {
  const tgChatId = requireEnv('TG_CHAT_ID');

  return {
    rpcUrl: process.env['RPC_URL'] ?? 'https://rpc.mainnet.chain.robinhood.com',
    chainId: optionalEnvNumber('CHAIN_ID', 4663),
    hookAddress: requireAddress('HOOK_ADDRESS'),
    tgBotToken: requireEnv('TG_BOT_TOKEN'),
    tgChatId,
    debounceMs: optionalEnvNumber('DEBOUNCE_MS', 60_000),
    pollingIntervalMs: optionalEnvNumber('POLLING_INTERVAL_MS', 5_000),
    willToken: requireAddress('WILL_TOKEN'),
    trackerAddress: requireAddress('TRACKER'),
    poolAddress: requireAddress('WILL_POOL'),
    scarcatChatId: process.env['SCARCAT_TG_CHAT_ID'] ?? tgChatId,
    anthropicApiKey: optionalEnv('ANTHROPIC_API_KEY'),
  };
}
