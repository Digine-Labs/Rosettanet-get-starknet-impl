var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/discovery/evm-wallets.ts
import { createStore } from "mipd";

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
import { hash } from "starknet";
import { prepareMulticallCalldata } from "rosettanet";

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
        const entryPoint = entryPointValue.startsWith("0x") ? entryPointValue : hash.getSelectorFromName(entryPointValue);
        return {
          contract_address: it[0],
          entry_point: entryPoint,
          calldata: it[2]
        };
      });
      const params = {
        calls: txCalls
      };
      const txData = prepareMulticallCalldata(params.calls);
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