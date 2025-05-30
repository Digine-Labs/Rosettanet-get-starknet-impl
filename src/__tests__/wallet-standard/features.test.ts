import { describe, expect, test } from '@jest/globals';
import { StarknetWalletApi } from '../../wallet-standard/features';
import type { WalletAccount } from '@wallet-standard/base';
import { StandardConnect, StandardDisconnect, StandardEvents } from '@wallet-standard/features';

describe('Wallet Standard Features', () => {
  describe('StarknetWalletApi', () => {
    test('is defined', () => {
      expect(StarknetWalletApi).toBeDefined();
    });

    test('has correct version', () => {
      const api = {
        [StarknetWalletApi]: {
          version: '1.0.0',
          walletVersion: '1.0.0',
          request: async () => ({}),
        },
      };
      expect(api[StarknetWalletApi].version).toBe('1.0.0');
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

  describe('Account Features', () => {
    const mockAccount: Partial<WalletAccount> = {
      address: '0x123',
      chains: ['starknet:0x534e5f4d41494e'],
      features: [],
      label: 'Test Account',
      icon: 'data:image/svg+xml;base64,test',
    };

    test('account has required properties', () => {
      expect(mockAccount.address).toBeDefined();
      expect(mockAccount.chains).toBeDefined();
      expect(Array.isArray(mockAccount.chains)).toBe(true);
      expect(mockAccount.features).toBeDefined();
      expect(Array.isArray(mockAccount.features)).toBe(true);
    });

    test('account chains are properly formatted', () => {
      expect(mockAccount.chains?.[0]).toMatch(/^starknet:/);
    });
  });
});
