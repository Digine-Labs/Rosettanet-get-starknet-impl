// Base interfaces
interface CallObject {
  from?: string;
  to: string;
  gas?: string;
  gasPrice?: string;
  maxPriorityFeePerGas?: string;
  maxFeePerGas?: string;
  value?: string;
  data?: string;
  nonce?: string;
  chainId?: number;
  type?: string;
  accessList?: {
    address: string;
    storageKeys: string[];
  }[];
}

interface FilterObject {
  fromBlock?: string;
  toBlock?: string;
  address?: string | string[];
  topics?: (string | null | (string | null)[])[];
  blockHash?: string;
}

interface EthereumRPCRequestBase {
  method: string;
  params?: unknown[];
}

export interface RPCError {
  id: number;
  jsonrpc: string;
  error: {
    code: number;
    message: string;
    data?: string | object | string[] | object[];
  };
}

export interface RPCResponse {
  jsonrpc: string;
  id: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any;
}

export interface EthereumProvider {
  request(args: { method: 'eth_requestAccounts'; params?: [] }): Promise<string[]>;
  request(args: EthereumRPCParams): Promise<RPCResponse | RPCError>;
  id: string;
  name: string;
  icon: string;
  version: string;
  on: <T extends string>(eventName: T, listener: (...args: unknown[]) => void) => void;
  off: <T extends string>(eventName: T, listener: (...args: unknown[]) => void) => void;
}

// Union of known RPC calls
export type EthereumRPCParams =
  | { method: 'eth_chainId'; params?: [] }
  | { method: 'eth_blockNumber'; params?: [] }
  | { method: 'eth_getBalance'; params: [string, string] }
  | { method: 'eth_getTransactionCount'; params: [string, string] }
  | { method: 'eth_getTransactionByHash'; params: [string] }
  | { method: 'eth_sendTransaction'; params: [CallObject] }
  | { method: 'eth_sendRawTransaction'; params: [string] }
  | { method: 'eth_call'; params: [CallObject, string] }
  | { method: 'eth_getBlockByNumber'; params: [string, boolean] }
  | { method: 'eth_getLogs'; params: [FilterObject] }
  | { method: 'eth_requestAccounts'; params?: [] }
  | EthereumRPCRequestBase; // fallback for non-strict methods
