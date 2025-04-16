import { StarknetWindowObject } from '@starknet-io/types-js';
import { createStore } from 'mipd';
import { EthereumProvider } from '../types';

export async function EvmWindowObjectWithStarknetKeys(): Promise<StarknetWindowObject[]> {
  let starknetWallets = [];

  const store = await createStore();

  const providers = await store.getProviders();

  for (const wallet of providers) {
    if (wallet.info.rdns === 'com.bitget.web3') {
      wallet.info.name = 'Bitget Wallet via Rosettanet';
    } else if (wallet.info.rdns === 'com.okex.wallet') {
      wallet.info.name = 'OKX Wallet via Rosettanet';
    }

    const starkNetWallet = {
      ...wallet.provider,
      id: wallet.info.name,
      name: wallet.info.name,
      icon: wallet.info.icon,
      version: wallet.info.icon,
      on: wallet.provider.on,
      off: wallet.provider.off,
    };

    starknetWallets.push(starkNetWallet);
  }

  return starknetWallets;
}

const ETHEREUM_WALLET_KEYS = ['sendAsync', 'send', 'request'];

export function isEthereumWindowObject(wallet: unknown): wallet is EthereumProvider {
  if (typeof wallet !== 'object' || wallet === null) return false;
  return ETHEREUM_WALLET_KEYS.every((key) => key in wallet);
}
