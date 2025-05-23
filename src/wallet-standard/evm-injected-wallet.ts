import type { Wallet, WalletAccount, WalletWithFeatures } from '@wallet-standard/base';
import {
  StandardConnect,
  type StandardConnectMethod,
  StandardDisconnect,
  type StandardDisconnectMethod,
  StandardEvents,
  type StandardEventsOnMethod,
  type StandardEventsNames,
  type StandardEventsListeners
} from '@wallet-standard/features';
import { RequestFn, StarknetWindowObject, RpcTypeToMessageMap, RpcMessage, RequestFnCall } from '@starknet-io/types-js';
import { EthereumWalletWithStarknetFeatures, StarknetFeatures, StarknetWalletApi } from './features';
import { StarknetChain, EthereumChain } from '../types';

const walletToEthereumRpcMap: Record<keyof RpcTypeToMessageMap, string | undefined> = {
  wallet_getPermissions: undefined,
  wallet_requestAccounts: 'eth_requestAccounts',
  wallet_watchAsset: 'wallet_watchAsset',
  wallet_addStarknetChain: undefined,
  wallet_switchStarknetChain: undefined,
  wallet_requestChainId: 'eth_chainId',
  wallet_deploymentData: undefined,
  wallet_addInvokeTransaction: 'eth_sendTransaction',
  wallet_addDeclareTransaction: undefined,
  wallet_signTypedData: 'eth_signTypedData',
  wallet_supportedSpecs: undefined,
  wallet_supportedWalletApi: undefined,
};

/**
 * Implementation of the Wallet Standard for Ethereum/EVM wallets
 */
export class EthereumInjectedWallet implements EthereumWalletWithStarknetFeatures {
  #listeners: { [E in StandardEventsNames]?: StandardEventsListeners[E][] } = {};
  #account: { address: string; chain: EthereumChain } | null = null;

  constructor(private readonly injected: StarknetWindowObject) {
    this.injected.on("accountsChanged", this.#onAccountsChanged.bind(this));
    this.injected.on("networkChanged", this.#onNetworkChanged.bind(this));
  }

  get version() {
    return '1.0.0' as const;
  }

  get name() {
    return this.injected.name;
  }

  get icon() {
    return this.injected.icon as Wallet['icon'];
  }

  get features(): StarknetFeatures {
    return {
      [StandardConnect]: {
        version: '1.0.0' as const,
        connect: this.#connect.bind(this),
      },
      [StandardDisconnect]: {
        version: '1.0.0' as const,
        disconnect: this.#disconnect.bind(this),
      },
      [StandardEvents]: {
        version: '1.0.0' as const,
        on: this.#on.bind(this),
      },
      [StarknetWalletApi]: {
        version: "1.0.0" as const,
        request: this.#request.bind(this),
        walletVersion: this.injected.version,
      },
    };
  }

  get chains() {
    return [
      'eip155:1381192787', // Rosettanet Chain ID
    ] as EthereumChain[];
  }

  get accounts(): WalletAccount[] {
    if (this.#account) {
      return [
        {
          address: this.#account.address,
          publicKey: new Uint8Array(),
          chains: [this.#account.chain],
          features: [],
        },
      ];
    }

    return [];
  }

  #connect: StandardConnectMethod = async ({ silent }) => {
    if (!this.#account) {
      const accounts = await this.injected.request({
        type: "wallet_requestAccounts",
        params: {
          silent_mode: silent,
        },
      });

      // TODO(fra): maybe we should throw an error here?
      // User rejected the request.
      if (accounts.length === 0) {
        return { accounts: [] };
      }

      await this.#updateAccount(accounts);
    }

    return { accounts: this.accounts };
  };

  #disconnect: StandardDisconnectMethod = async () => {
    // Most EVM wallets don't have a disconnect method
    // We'll just clear our internal state
    this.#disconnected();
    return;
  };

  #on: StandardEventsOnMethod = (event, listener) => {
    if (!this.#listeners[event]) {
      this.#listeners[event] = [];
    }

    this.#listeners[event].push(listener);

    return (): void => this.#off(event, listener);
  };

  #emit<E extends StandardEventsNames>(
    event: E,
    ...args: Parameters<StandardEventsListeners[E]>
  ): void {
    if (!this.#listeners[event]) return;

    for (const listener of this.#listeners[event]) {
      listener.apply(null, args);
    }
  }

  #off<E extends StandardEventsNames>(
    event: E,
    listener: StandardEventsListeners[E],
  ): void {
    this.#listeners[event] = this.#listeners[event]?.filter(
      (existingListener) => listener !== existingListener,
    );
  }

  #disconnected() {
    if (this.#account) {
      this.#account = null;
      this.#emit('change', { accounts: this.accounts });
    }
  }

  async #onAccountsChanged(accounts: string[] | undefined) {
    if (!accounts || accounts.length === 0) {
      this.#disconnected();
      return;
    }

    if (!this.#account) {
      return;
    }

    await this.#updateAccount(accounts);
  }

  #onNetworkChanged(chainIdHex: string | undefined) {
    if (!chainIdHex || !this.#account) {
      this.#disconnected();
      return;
    }

    // Convert hex chainId to decimal
    const chainId = Number.parseInt(chainIdHex, 16).toString();
    const chain = `eip155:${chainId}` as EthereumChain;

    // Check if this is a supported chain
    if (!this.chains.includes(chain)) {
      console.warn('Switched to unsupported chain:', chain);
    }

    this.#account.chain = chain;
    this.#emit('change', { accounts: this.accounts });
  }

  async #updateAccount(accounts: string[]) {
    if (accounts.length === 0) {
      return;
    }

    const [account] = accounts;

    if (this.#account?.chain) {
      // Only account changed, chain remains the same
      this.#account.address = account;
      this.#emit('change', { accounts: this.accounts });
    } else {
      // Need to get the chain ID too
      const chain = await this.#getEthereumChain();
      this.#account = { address: account, chain };
      this.#emit('change', { accounts: this.accounts });
    }
  }

  #request = async <T extends RpcMessage['type']>(
    call: RequestFnCall<T>
  ): Promise<RpcTypeToMessageMap[T]['result']> => {
    const mappedMethod = walletToEthereumRpcMap[call.type];

    if (!mappedMethod) {
      throw new Error(`Unsupported request type: ${call.type}`);
    }

    const ethPayload = {
      method: mappedMethod,
      // Ethereum tarafı params dizisi bekleyebilir, ama çoğu method tek obje alır.
      // Örn: eth_requestAccounts → params: undefined
      params: call.params ? [call.params] : [],
    };

    return (this.injected.request as any)(ethPayload);
  };

  async #getEthereumChain(): Promise<EthereumChain> {
    const chainIdHex = await this.injected.request({
      type: "wallet_requestChainId",
    });
    // Convert hex to decimal
    const chainId = Number.parseInt(chainIdHex, 16).toString();
    const chain = `eip155:${chainId}` as EthereumChain;

    // Check if the chain is rosettanet chain
    if (chainId !== '1381192787') {
      throw new Error('Invalid Rosettanet chain');
    }

    return chain;
  }
}
