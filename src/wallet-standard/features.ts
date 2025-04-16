import type { Wallet } from '@wallet-standard/base';
import { StandardConnect, StandardDisconnect, StandardEvents } from '@wallet-standard/features';
import {
  EthereumWalletApi,
  EthereumFeatures,
  WalletWithEthereumFeatures,
} from './evm-injected-wallet';

const RequiredEthereumFeatures = [
  EthereumWalletApi,
  StandardConnect,
  StandardDisconnect,
  StandardEvents,
] as const satisfies (keyof EthereumFeatures)[];

export function isEVMWallet(wallet: Wallet): wallet is WalletWithEthereumFeatures {
  const result = RequiredEthereumFeatures.every((feature) => feature in wallet.features);
  return result;
}
