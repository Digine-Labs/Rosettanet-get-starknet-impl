import type { Wallet, WalletAccount, WalletWithFeatures } from '@wallet-standard/base';
import {
  StandardConnect,
  type StandardConnectFeature,
  type StandardConnectMethod,
  StandardDisconnect,
  type StandardDisconnectFeature,
  type StandardDisconnectMethod,
  StandardEvents,
  type StandardEventsFeature,
  type StandardEventsOnMethod,
} from '@wallet-standard/features';

// Type definitions
type StandardEventsNames = 'change' | 'connect' | 'disconnect' | 'error';

interface StandardEventsListeners {
  change: (data: { accounts: WalletAccount[] }) => void;
  connect: () => void;
  disconnect: () => void;
  error: (error: any) => void;
}

const EthereumWalletApi = 'ethereum:wallet';

// Ethereum specific types
type EthereumChain = `eip155:${string}`;

interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  id: string;
  name: string;
  icon: string;
  version: string;
  on: (eventName: string, listener: (...args: any[]) => void) => void;
  off: (eventName: string, listener: (...args: any[]) => void) => void;
}

export type EthereumFeatures = EthereumWalletRequestFeature &
  StandardConnectFeature &
  StandardDisconnectFeature &
  StandardEventsFeature;
export type WalletWithEthereumFeatures = WalletWithFeatures<EthereumFeatures>;

export type EthereumWalletRequestFeature = {
  [EthereumWalletApi]: {
    version: '1.0.0';
    request: (args: { method: string; params?: any[] }) => Promise<any>;
  };
};

/**
 * Implementation of the Wallet Standard for Ethereum/EVM wallets
 */
export class EthereumInjectedWallet implements WalletWithEthereumFeatures {
  #listeners: { [E in StandardEventsNames]?: StandardEventsListeners[E][] } = {};
  #account: { address: string; chain: EthereumChain } | null = null;

  constructor(private readonly injected: EthereumProvider) {
    // Subscribe to EVM wallet events
    this.injected.on('accountsChanged', this.#onAccountsChanged.bind(this));
    this.injected.on('networkChanged', this.#onNetworkChanged.bind(this));
    this.injected.on('disconnect', this.#onDisconnect.bind(this));
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

  get features(): EthereumFeatures {
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
      [EthereumWalletApi]: {
        version: '1.0.0' as const,
        request: this.#request.bind(this),
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

  #connect: StandardConnectMethod = async ({ silent } = {}) => {
    if (!this.#account) {
      try {
        // For EVM wallets
        const accounts = await this.injected.request({
          method: 'eth_requestAccounts',
        });

        // User rejected the request or no accounts
        if (!accounts || accounts.length === 0) {
          return { accounts: [] };
        }

        await this.#onAccountsChanged(accounts);
      } catch (error) {
        // Handle user rejection or errors
        console.error('Connection error:', error);
        return { accounts: [] };
      }
    }

    return { accounts: this.accounts };
  };

  #disconnect: StandardDisconnectMethod = async () => {
    // Most EVM wallets don't have a disconnect method
    // We'll just clear our internal state
    this.#disconnected();
    return;
  };

  #on: StandardEventsOnMethod = <E extends StandardEventsNames>(
    event: E,
    listener: StandardEventsListeners[E]
  ): (() => void) => {
    if (!this.#listeners[event]) {
      this.#listeners[event] = [];
    }
    (this.#listeners[event] as StandardEventsListeners[E][]).push(listener);

    return () => {
      this.#off(event, listener);
    };
  };

  #emit<E extends StandardEventsNames>(
    event: E,
    ...args: Parameters<StandardEventsListeners[E]>
  ): void {
    if (!this.#listeners[event]) return;

    for (const listener of this.#listeners[event] as StandardEventsListeners[E][]) {
      (listener as Function).apply(null, args);
    }
  }

  #off<E extends StandardEventsNames>(event: E, listener: StandardEventsListeners[E]): void {
    const arr = this.#listeners[event] as StandardEventsListeners[E][] | undefined;
    if (!arr) return;

    this.#listeners[event] = arr.filter((l) => l !== listener) as any;
  }

  #disconnected() {
    if (this.#account) {
      this.#account = null;
      this.#emit('change', { accounts: this.accounts });
    }
  }

  async #onAccountsChanged(accounts: string[]) {
    if (!accounts || accounts.length === 0) {
      this.#disconnected();
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

  #onNetworkChanged(chainIdHex: string) {
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

  #onDisconnect() {
    this.#disconnected();
  }

  #request(args: { method: string; params?: any[] }): Promise<any> {
    return this.injected.request(args);
  }

  async #getEthereumChain(): Promise<EthereumChain> {
    try {
      const chainIdHex = await this.injected.request({
        method: 'eth_chainId',
      });

      // Convert hex to decimal
      const chainId = Number.parseInt(chainIdHex, 16).toString();
      const chain = `eip155:${chainId}` as EthereumChain;

      return chain;
    } catch (error) {
      console.error('Failed to get chain ID:', error);
      throw new Error('Invalid Ethereum chain');
    }
  }
}
