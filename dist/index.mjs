var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/discovery/evm-wallets.ts
import { createStore } from "mipd";
async function EvmWindowObjectWithStarknetKeys() {
  let Wallets = [];
  const store = createStore();
  const providers = store.getProviders();
  for (const wallet of providers) {
    if (wallet.info.rdns === "com.bitget.web3") {
      wallet.info.name = "Bitget Wallet via Rosettanet";
    } else if (wallet.info.rdns === "com.okex.wallet") {
      wallet.info.name = "OKX Wallet via Rosettanet";
    }
    const walletWithStarknetKeys = {
      ...wallet.provider,
      id: wallet.info.name,
      name: wallet.info.name,
      icon: wallet.info.icon,
      version: wallet.info.icon,
      on: wallet.provider.on,
      off: wallet.provider.off
    };
    Wallets.push(walletWithStarknetKeys);
  }
  return Wallets;
}
__name(EvmWindowObjectWithStarknetKeys, "EvmWindowObjectWithStarknetKeys");
var ETHEREUM_WALLET_KEYS = ["sendAsync", "send", "request"];
function isEthereumWindowObject(wallet) {
  if (typeof wallet !== "object" || wallet === null) return false;
  return ETHEREUM_WALLET_KEYS.every((key) => key in wallet);
}
__name(isEthereumWindowObject, "isEthereumWindowObject");

// src/wallet-standard/evm-injected-wallet.ts
import {
  StandardConnect as StandardConnect2,
  StandardDisconnect as StandardDisconnect2,
  StandardEvents as StandardEvents2
} from "@wallet-standard/features";

// src/wallet-standard/features.ts
import {
  StandardConnect,
  StandardDisconnect,
  StandardEvents
} from "@wallet-standard/features";
var StarknetWalletApi = "starknet:walletApi";
var RequiredStarknetFeatures = [
  StarknetWalletApi,
  StandardConnect,
  StandardDisconnect,
  StandardEvents
];
function isEVMWallet(wallet) {
  const result = RequiredStarknetFeatures.every((feature) => feature in wallet.features);
  return result;
}
__name(isEVMWallet, "isEVMWallet");

// src/wallet-standard/evm-injected-wallet.ts
var walletToEthereumRpcMap = {
  wallet_getPermissions: void 0,
  wallet_requestAccounts: "eth_requestAccounts",
  wallet_watchAsset: "wallet_watchAsset",
  wallet_addStarknetChain: void 0,
  wallet_switchStarknetChain: void 0,
  wallet_requestChainId: "eth_chainId",
  wallet_deploymentData: void 0,
  wallet_addInvokeTransaction: "eth_sendTransaction",
  wallet_addDeclareTransaction: void 0,
  wallet_signTypedData: "eth_signTypedData",
  wallet_supportedSpecs: void 0,
  wallet_supportedWalletApi: void 0
};
var EthereumInjectedWallet = class {
  constructor(injected) {
    this.injected = injected;
    this.injected.on("accountsChanged", this.#onAccountsChanged.bind(this));
    this.injected.on("networkChanged", this.#onNetworkChanged.bind(this));
  }
  static {
    __name(this, "EthereumInjectedWallet");
  }
  #listeners = {};
  #account = null;
  get version() {
    return "1.0.0";
  }
  get name() {
    return this.injected.name;
  }
  get icon() {
    return this.injected.icon;
  }
  get features() {
    return {
      [StandardConnect2]: {
        version: "1.0.0",
        connect: this.#connect.bind(this)
      },
      [StandardDisconnect2]: {
        version: "1.0.0",
        disconnect: this.#disconnect.bind(this)
      },
      [StandardEvents2]: {
        version: "1.0.0",
        on: this.#on.bind(this)
      },
      [StarknetWalletApi]: {
        version: "1.0.0",
        request: this.#request.bind(this),
        walletVersion: this.injected.version
      }
    };
  }
  get chains() {
    return [
      "eip155:1381192787"
      // Rosettanet Chain ID
    ];
  }
  get accounts() {
    if (this.#account) {
      return [
        {
          address: this.#account.address,
          publicKey: new Uint8Array(),
          chains: [this.#account.chain],
          features: []
        }
      ];
    }
    return [];
  }
  #connect = /* @__PURE__ */ __name(async () => {
    if (!this.#account) {
      const accounts = await this.injected.request({
        type: "wallet_requestAccounts"
      });
      if (accounts.length === 0) {
        return { accounts: [] };
      }
      await this.#updateAccount(accounts);
    }
    return { accounts: this.accounts };
  }, "#connect");
  #disconnect = /* @__PURE__ */ __name(async () => {
    this.#disconnected();
    return;
  }, "#disconnect");
  #on = /* @__PURE__ */ __name((event, listener) => {
    if (!this.#listeners[event]) {
      this.#listeners[event] = [];
    }
    this.#listeners[event].push(listener);
    return () => this.#off(event, listener);
  }, "#on");
  #emit(event, ...args) {
    if (!this.#listeners[event]) return;
    for (const listener of this.#listeners[event]) {
      listener.apply(null, args);
    }
  }
  #off(event, listener) {
    this.#listeners[event] = this.#listeners[event]?.filter(
      (existingListener) => listener !== existingListener
    );
  }
  #disconnected() {
    if (this.#account) {
      this.#account = null;
      this.#emit("change", { accounts: this.accounts });
    }
  }
  async #onAccountsChanged(accounts) {
    if (!accounts || accounts.length === 0) {
      this.#disconnected();
      return;
    }
    if (!this.#account) {
      return;
    }
    await this.#updateAccount(accounts);
  }
  #onNetworkChanged(chainIdHex) {
    if (!chainIdHex || !this.#account) {
      this.#disconnected();
      return;
    }
    const chainId = Number.parseInt(chainIdHex, 16).toString();
    const chain = `eip155:${chainId}`;
    if (!this.chains.includes(chain)) {
      console.warn("Switched to unsupported chain:", chain);
    }
    this.#account.chain = chain;
    this.#emit("change", { accounts: this.accounts });
  }
  async #updateAccount(accounts) {
    if (accounts.length === 0) {
      return;
    }
    const [account] = accounts;
    if (this.#account?.chain) {
      this.#account.address = account;
      this.#emit("change", { accounts: this.accounts });
    } else {
      const chain = await this.#getEthereumChain();
      this.#account = { address: account, chain };
      this.#emit("change", { accounts: this.accounts });
    }
  }
  #request = /* @__PURE__ */ __name(async (call) => {
    const mappedMethod = walletToEthereumRpcMap[call.type];
    if (!mappedMethod) {
      throw new Error(`Unsupported request type: ${call.type}`);
    }
    const ethPayload = {
      method: mappedMethod,
      // Ethereum tarafı params dizisi bekleyebilir, ama çoğu method tek obje alır.
      // Örn: eth_requestAccounts → params: undefined
      params: call.params ? [call.params] : []
    };
    return this.injected.request(ethPayload);
  }, "#request");
  async #getEthereumChain() {
    const chainIdHex = await this.injected.request({
      type: "wallet_requestChainId"
    });
    const chainId = Number.parseInt(chainIdHex, 16).toString();
    const chain = `eip155:${chainId}`;
    if (chainId !== "1381192787") {
      throw new Error("Invalid Rosettanet chain");
    }
    return chain;
  }
};

// src/types/index.ts
var ETHEREUM_CHAIN_PREFIX = "eip155:";
var STARKNET_CHAIN_PREFIX = "starknet:";
export {
  ETHEREUM_CHAIN_PREFIX,
  EthereumInjectedWallet,
  EvmWindowObjectWithStarknetKeys,
  STARKNET_CHAIN_PREFIX,
  StarknetWalletApi,
  isEVMWallet,
  isEthereumWindowObject
};
//# sourceMappingURL=index.mjs.map