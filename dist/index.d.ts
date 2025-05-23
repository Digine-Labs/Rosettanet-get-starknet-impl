import { StarknetWindowObject, RequestFn } from '@starknet-io/types-js';
import { WalletWithFeatures, Wallet, WalletAccount } from '@wallet-standard/base';
import { StandardConnectFeature, StandardDisconnectFeature, StandardEventsFeature } from '@wallet-standard/features';

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
interface EthereumProvider {
    request(args: EthereumRPCParams): Promise<any>;
    id: string;
    name: string;
    icon: string;
    version: string;
    on: <T extends string>(eventName: T, listener: (...args: unknown[]) => void) => void;
    off: <T extends string>(eventName: T, listener: (...args: unknown[]) => void) => void;
}
type EthereumRPCParams = {
    method: 'eth_chainId';
    params?: [];
} | {
    method: 'eth_blockNumber';
    params?: [];
} | {
    method: 'eth_getBalance';
    params: [string, string];
} | {
    method: 'eth_getTransactionCount';
    params: [string, string];
} | {
    method: 'eth_getTransactionByHash';
    params: [string];
} | {
    method: 'eth_sendTransaction';
    params: [CallObject];
} | {
    method: 'eth_sendRawTransaction';
    params: [string];
} | {
    method: 'eth_call';
    params: [CallObject, string];
} | {
    method: 'eth_getBlockByNumber';
    params: [string, boolean];
} | {
    method: 'eth_getLogs';
    params: [FilterObject];
} | {
    method: 'eth_requestAccounts';
    params?: [];
} | EthereumRPCRequestBase;
declare const ETHEREUM_CHAIN_PREFIX = "eip155:";
declare const STARKNET_CHAIN_PREFIX = "starknet:";
type ChainId = `0x${string}`;
type EthereumChain = `${typeof ETHEREUM_CHAIN_PREFIX}${string}`;
type StarknetChain = `${typeof STARKNET_CHAIN_PREFIX}${ChainId}`;

declare function EvmWindowObjectWithStarknetKeys(): Promise<StarknetWindowObject[]>;
declare function isEthereumWindowObject(wallet: unknown): wallet is EthereumProvider;

declare const StarknetWalletApi = "starknet:walletApi";
type StarknetWalletApiVersion = '1.0.0';
type StarknetWalletRequestFeature = {
    readonly [StarknetWalletApi]: {
        readonly version: StarknetWalletApiVersion;
        readonly request: RequestFn;
        readonly walletVersion: string;
    };
};
type StarknetFeatures = StarknetWalletRequestFeature & StandardConnectFeature & StandardDisconnectFeature & StandardEventsFeature;
type EthereumWalletWithStarknetFeatures = WalletWithFeatures<StarknetFeatures>;
declare function isEVMWallet(wallet: Wallet): wallet is EthereumWalletWithStarknetFeatures;

/**
 * Implementation of the Wallet Standard for Ethereum/EVM wallets
 */
declare class EthereumInjectedWallet implements EthereumWalletWithStarknetFeatures {
    #private;
    private readonly injected;
    constructor(injected: StarknetWindowObject);
    get version(): "1.0.0";
    get name(): string;
    get icon(): Wallet["icon"];
    get features(): StarknetFeatures;
    get chains(): EthereumChain[];
    get accounts(): WalletAccount[];
}

export { type ChainId, ETHEREUM_CHAIN_PREFIX, type EthereumChain, EthereumInjectedWallet, type EthereumProvider, type EthereumRPCParams, type EthereumWalletWithStarknetFeatures, EvmWindowObjectWithStarknetKeys, STARKNET_CHAIN_PREFIX, type StarknetChain, type StarknetFeatures, StarknetWalletApi, type StarknetWalletApiVersion, type StarknetWalletRequestFeature, isEVMWallet, isEthereumWindowObject };
