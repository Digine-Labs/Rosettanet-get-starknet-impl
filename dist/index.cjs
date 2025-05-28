"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ETHEREUM_CHAIN_PREFIX: () => ETHEREUM_CHAIN_PREFIX,
  EthereumInjectedWallet: () => EthereumInjectedWallet,
  EvmWindowObjectWithStarknetKeys: () => EvmWindowObjectWithStarknetKeys,
  STARKNET_CHAIN_PREFIX: () => STARKNET_CHAIN_PREFIX,
  StarknetWalletApi: () => StarknetWalletApi,
  isEVMWallet: () => isEVMWallet,
  isEthereumWindowObject: () => isEthereumWindowObject
});
module.exports = __toCommonJS(index_exports);

// src/discovery/evm-wallets.ts
var import_mipd = require("mipd");

// src/wallet-standard/evm-injected-wallet.ts
var import_features2 = require("@wallet-standard/features");

// src/wallet-standard/features.ts
var import_features = require("@wallet-standard/features");
var StarknetWalletApi = "starknet:walletApi";
var RequiredStarknetFeatures = [
  StarknetWalletApi,
  import_features.StandardConnect,
  import_features.StandardDisconnect,
  import_features.StandardEvents
];
function isEVMWallet(wallet) {
  const result = RequiredStarknetFeatures.every((feature) => feature in wallet.features);
  return result;
}
__name(isEVMWallet, "isEVMWallet");

// src/wallet-standard/evm-injected-wallet.ts
var import_starknet = require("starknet");
var import_rosettanet = require("rosettanet");

// src/utils/validateCallParams.ts
var validateCallParams = /* @__PURE__ */ __name((value) => {
  return Array.isArray(value) && value.every(
    (item) => typeof item === "object" && item !== null && !Array.isArray(item) && "contractAddress" in item && "entrypoint" in item && "calldata" in item
  );
}, "validateCallParams");

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
  wallet_signTypedData: "eth_signTypedData_v4",
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
      [import_features2.StandardConnect]: {
        version: "1.0.0",
        connect: this.#connect.bind(this)
      },
      [import_features2.StandardDisconnect]: {
        version: "1.0.0",
        disconnect: this.#disconnect.bind(this)
      },
      [import_features2.StandardEvents]: {
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
      const accounts = await this.#request({
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
    if (mappedMethod === "eth_sendTransaction" && call.params) {
      if (validateCallParams(call.params) === false) {
        throw new Error("Invalid call parameter. Expected an array of objects. Rosettanet only supports multicall.");
      }
      const arrayCalls = call.params.map((item) => [
        item.contractAddress,
        item.entrypoint,
        item.calldata
      ]);
      const txCalls = [].concat(arrayCalls).map((it) => {
        const entryPointValue = it[1];
        const entryPoint = entryPointValue.startsWith("0x") ? entryPointValue : import_starknet.hash.getSelectorFromName(entryPointValue);
        return {
          contract_address: it[0],
          entry_point: entryPoint,
          calldata: it[2]
        };
      });
      const params = {
        calls: txCalls
      };
      const txData = (0, import_rosettanet.prepareMulticallCalldata)(params.calls);
      const txObject = {
        from: this.#account?.address,
        to: "0x0000000000000000000000004645415455524553",
        data: txData,
        value: "0x0"
      };
      const ethPayload = {
        method: mappedMethod,
        params: [txObject]
      };
      return this.injected.request(ethPayload);
    }
    return this.injected.request({ method: mappedMethod, params: call.params ? [call.params] : [] });
  }, "#request");
  async #getEthereumChain() {
    const chainIdHex = await this.#request({
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

// src/discovery/evm-wallets.ts
async function EvmWindowObjectWithStarknetKeys() {
  let Wallets = [];
  const store = (0, import_mipd.createStore)();
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
      version: "1.0.0",
      on: wallet.provider.on,
      off: wallet.provider.removeListener
    };
    Wallets.push(new EthereumInjectedWallet(walletWithStarknetKeys));
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

// src/types/index.ts
var ETHEREUM_CHAIN_PREFIX = "eip155:";
var STARKNET_CHAIN_PREFIX = "starknet:";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ETHEREUM_CHAIN_PREFIX,
  EthereumInjectedWallet,
  EvmWindowObjectWithStarknetKeys,
  STARKNET_CHAIN_PREFIX,
  StarknetWalletApi,
  isEVMWallet,
  isEthereumWindowObject
});
//# sourceMappingURL=index.cjs.map