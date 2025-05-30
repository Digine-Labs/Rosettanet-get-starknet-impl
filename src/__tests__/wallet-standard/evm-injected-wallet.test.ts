import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import type { StarknetWindowObject, RequestFn } from '@starknet-io/types-js';
import { StandardConnect, StandardDisconnect, StandardEvents } from '@wallet-standard/features';
import type { WalletAccount, IdentifierArray } from '@wallet-standard/base';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MockRequestType = { type: string; params?: any };

interface MockWallet {
  version: string;
  name: string;
  icon: string;
  accounts: WalletAccount[];
  features: {
    [StandardConnect]: {
      version: string;
      connect: (options: { silent: boolean }) => Promise<{ accounts: WalletAccount[] }>;
    };
    [StandardDisconnect]: {
      version: string;
      disconnect: () => Promise<void>;
    };
  };
}

const MOCK_ICON =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiI+PC9zdmc+' as const;

const createMockStarknetWindowObject = (): StarknetWindowObject => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockRequest = jest.fn().mockImplementation(async (params: unknown): Promise<any> => {
    const request = params as MockRequestType;
    if (request.type === 'wallet_requestAccounts') {
      return ['0x123'];
    }
    if (request.type === 'wallet_requestChainId') {
      return '0x534e5f4d41494e'; // SN_MAIN
    }
    return false;
  });

  return {
    name: 'Mock Starknet Wallet',
    id: 'mock-wallet',
    version: '1.0.0',
    icon: MOCK_ICON,
    request: mockRequest as unknown as RequestFn,
    on: jest.fn(),
    off: jest.fn(),
  };
};

const createMockWallet = (injected: StarknetWindowObject): MockWallet => {
  const wallet: MockWallet = {
    version: '1.0.0',
    name: injected.name,
    icon: typeof injected.icon === 'string' ? injected.icon : injected.icon.light,
    accounts: [],
    features: {
      [StandardConnect]: {
        version: '1.0.0',
        connect: async ({ silent }) => {
          const addresses = (await injected.request({
            type: 'wallet_requestAccounts',
            params: { silent_mode: silent },
          })) as string[];

          const newAccounts: WalletAccount[] = addresses.map((address) => ({
            address,
            publicKey: new Uint8Array([1, 2, 3]), // Mock public key for testing
            chains: ['starknet:0x534e5f4d41494e'] as IdentifierArray,
            features: [],
            label: 'Test Account',
            icon: MOCK_ICON,
          }));

          wallet.accounts = newAccounts;
          return { accounts: newAccounts };
        },
      },
      [StandardDisconnect]: {
        version: '1.0.0',
        disconnect: async () => {
          wallet.accounts = [];
        },
      },
    },
  };

  return wallet;
};

describe('Wallet Standard Implementation', () => {
  let mockInjected: StarknetWindowObject;
  let wallet: MockWallet;

  beforeEach(() => {
    mockInjected = createMockStarknetWindowObject();
    wallet = createMockWallet(mockInjected);
  });

  describe('StarknetWalletApi', () => {
    test('has correct version', () => {
      expect(mockInjected.version).toBe('1.0.0');
    });

    test('inherits name from injected wallet', () => {
      expect(mockInjected.name).toBe('Mock Starknet Wallet');
    });

    test('inherits icon from injected wallet', () => {
      expect(mockInjected.icon).toBe(MOCK_ICON);
    });

    test('handles wallet_requestAccounts', async () => {
      const accounts = await mockInjected.request({ type: 'wallet_requestAccounts' });
      expect(accounts).toEqual(['0x123']);
    });

    test('handles wallet_requestChainId', async () => {
      const chainId = await mockInjected.request({ type: 'wallet_requestChainId' });
      expect(chainId).toBe('0x534e5f4d41494e');
    });
  });

  describe('connect/disconnect', () => {
    test('connects to wallet and populates accounts', async () => {
      const result = await wallet.features[StandardConnect].connect({
        silent: false,
      });

      expect(mockInjected.request).toHaveBeenCalledWith({
        type: 'wallet_requestAccounts',
        params: { silent_mode: false },
      });

      expect(result.accounts).toHaveLength(1);
      expect(result.accounts[0].address).toBe('0x123');
      expect(result.accounts[0].chains).toContain('starknet:0x534e5f4d41494e');
      expect(wallet.accounts).toEqual(result.accounts);
    });

    test('handles silent connection mode', async () => {
      await wallet.features[StandardConnect].connect({ silent: true });

      expect(mockInjected.request).toHaveBeenCalledWith({
        type: 'wallet_requestAccounts',
        params: { silent_mode: true },
      });
    });

    test('disconnects from wallet and clears accounts', async () => {
      // First connect
      await wallet.features[StandardConnect].connect({ silent: false });
      expect(wallet.accounts).toHaveLength(1);

      // Then disconnect
      await wallet.features[StandardDisconnect].disconnect();
      expect(wallet.accounts).toHaveLength(0);
    });
  });

  describe('Standard Features', () => {
    test('StandardConnect is defined', () => {
      expect(StandardConnect).toBeDefined();
    });

    test('StandardDisconnect is defined', () => {
      expect(StandardDisconnect).toBeDefined();
    });

    test('StandardEvents is defined', () => {
      expect(StandardEvents).toBeDefined();
    });
  });

  describe('Events', () => {
    test('can register event listeners', () => {
      const listener = jest.fn();
      mockInjected.on('accountsChanged', listener);
      expect(mockInjected.on).toHaveBeenCalledWith('accountsChanged', listener);
    });

    test('can remove event listeners', () => {
      const listener = jest.fn();
      mockInjected.off('accountsChanged', listener);
      expect(mockInjected.off).toHaveBeenCalledWith('accountsChanged', listener);
    });
  });
});
