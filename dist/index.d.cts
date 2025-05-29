import { WalletWithFeatures, Wallet, WalletAccount } from '@wallet-standard/base';
import { RequestFn, StarknetWindowObject } from '@starknet-io/types-js';
import { StandardConnectFeature, StandardDisconnectFeature, StandardEventsFeature } from '@wallet-standard/features';

interface EthereumProvider {
    request(): Promise<any>;
    id: string;
    name: string;
    icon: string;
    version: string;
    on: <T extends string>(eventName: T, listener: (...args: unknown[]) => void) => void;
    off: <T extends string>(eventName: T, listener: (...args: unknown[]) => void) => void;
}
declare const ETHEREUM_CHAIN_PREFIX = "eip155:";
declare const STARKNET_CHAIN_PREFIX = "starknet:";
type ChainId = `0x${string}`;
type EthereumChain = `${typeof ETHEREUM_CHAIN_PREFIX}${string}`;
type StarknetChain = `${typeof STARKNET_CHAIN_PREFIX}${ChainId}`;

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

declare function EvmWindowObjectWithStarknetKeys(): Promise<EthereumInjectedWallet[]>;
declare function isEthereumWindowObject(wallet: unknown): wallet is EthereumProvider;

export { type ChainId, ETHEREUM_CHAIN_PREFIX, type EthereumChain, EthereumInjectedWallet, type EthereumProvider, type EthereumWalletWithStarknetFeatures, EvmWindowObjectWithStarknetKeys, STARKNET_CHAIN_PREFIX, type StarknetChain, type StarknetFeatures, StarknetWalletApi, type StarknetWalletApiVersion, type StarknetWalletRequestFeature, isEVMWallet, isEthereumWindowObject };
