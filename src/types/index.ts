export interface EthereumProvider {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  request(): Promise<any>;
  id: string;
  name: string;
  icon: string;
  version: string;
  on: <T extends string>(eventName: T, listener: (...args: unknown[]) => void) => void;
  off: <T extends string>(eventName: T, listener: (...args: unknown[]) => void) => void;
}

export const ETHEREUM_CHAIN_PREFIX = 'eip155:';

export const STARKNET_CHAIN_PREFIX = 'starknet:';

export type ChainId = `0x${string}`;

export type EthereumChain = `${typeof ETHEREUM_CHAIN_PREFIX}${string}`;

export type StarknetChain = `${typeof STARKNET_CHAIN_PREFIX}${ChainId}`;
