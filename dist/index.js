"use strict";
(() => {
  // node_modules/mipd/dist/esm/utils.js
  function requestProviders(listener) {
    if (typeof window === "undefined")
      return;
    const handler = (event) => listener(event.detail);
    window.addEventListener("eip6963:announceProvider", handler);
    window.dispatchEvent(new CustomEvent("eip6963:requestProvider"));
    return () => window.removeEventListener("eip6963:announceProvider", handler);
  }

  // node_modules/mipd/dist/esm/store.js
  function createStore() {
    const listeners = /* @__PURE__ */ new Set();
    let providerDetails = [];
    const request = () => requestProviders((providerDetail) => {
      if (providerDetails.some(({ info }) => info.uuid === providerDetail.info.uuid))
        return;
      providerDetails = [...providerDetails, providerDetail];
      listeners.forEach((listener) => listener(providerDetails, { added: [providerDetail] }));
    });
    let unwatch = request();
    return {
      _listeners() {
        return listeners;
      },
      clear() {
        listeners.forEach((listener) => listener([], { removed: [...providerDetails] }));
        providerDetails = [];
      },
      destroy() {
        this.clear();
        listeners.clear();
        unwatch?.();
      },
      findProvider({ rdns }) {
        return providerDetails.find((providerDetail) => providerDetail.info.rdns === rdns);
      },
      getProviders() {
        return providerDetails;
      },
      reset() {
        this.clear();
        unwatch?.();
        unwatch = request();
      },
      subscribe(listener, { emitImmediately } = {}) {
        listeners.add(listener);
        if (emitImmediately)
          listener(providerDetails, { added: providerDetails });
        return () => listeners.delete(listener);
      }
    };
  }

  // src/discovery/evm-wallets.ts
  async function EvmWindowObjectWithStarknetKeys() {
    let starknetWallets = [];
    const store = await createStore();
    const providers = await store.getProviders();
    for (const wallet of providers) {
      if (wallet.info.rdns === "com.bitget.web3") {
        wallet.info.name = "Bitget Wallet via Rosettanet";
      } else if (wallet.info.rdns === "com.okex.wallet") {
        wallet.info.name = "OKX Wallet via Rosettanet";
      }
      const starkNetWallet = {
        ...wallet.provider,
        id: wallet.info.name,
        name: wallet.info.name,
        icon: wallet.info.icon,
        version: wallet.info.icon,
        on: wallet.provider.on,
        off: wallet.provider.off
      };
      starknetWallets.push(starkNetWallet);
    }
    return starknetWallets;
  }
  var ETHEREUM_WALLET_KEYS = ["sendAsync", "send", "request"];
  function isEthereumWindowObject(wallet) {
    if (typeof wallet !== "object" || wallet === null) return false;
    return ETHEREUM_WALLET_KEYS.every((key) => key in wallet);
  }

  // node_modules/@wallet-standard/features/lib/esm/connect.js
  var StandardConnect = "standard:connect";

  // node_modules/@wallet-standard/features/lib/esm/disconnect.js
  var StandardDisconnect = "standard:disconnect";

  // node_modules/@wallet-standard/features/lib/esm/events.js
  var StandardEvents = "standard:events";

  // src/wallet-standard/evm-injected-wallet.ts
  var EthereumWalletApi = "ethereum:wallet";
  var EthereumInjectedWallet = class {
    constructor(injected) {
      this.injected = injected;
      console.log(injected);
      this.injected.on("accountsChanged", (accounts) => {
        if (Array.isArray(accounts) && accounts.every((a) => typeof a === "string")) {
          this.#onAccountsChanged(accounts);
        } else {
          console.warn("Unexpected accounts type:", accounts);
        }
      });
      this.injected.on("networkChanged", (chainIdHex) => {
        if (typeof chainIdHex === "string") {
          this.#onNetworkChanged(chainIdHex);
        } else {
          console.warn("Unexpected chainIdHex type:", chainIdHex);
        }
      });
      this.injected.on("disconnect", this.#onDisconnect.bind(this));
    }
    #listeners = {};
    #account = null;
    get version() {
      return "1.0.0";
    }
    get name() {
      console.log(this.injected.name);
      return this.injected.name;
    }
    get icon() {
      return this.injected.icon;
    }
    get features() {
      return {
        [StandardConnect]: {
          version: "1.0.0",
          connect: this.#connect.bind(this)
        },
        [StandardDisconnect]: {
          version: "1.0.0",
          disconnect: this.#disconnect.bind(this)
        },
        [StandardEvents]: {
          version: "1.0.0",
          on: this.#on.bind(this)
        },
        [EthereumWalletApi]: {
          version: "1.0.0",
          request: this.#request.bind(this)
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    #connect = async ({ silent } = {}) => {
      if (!this.#account) {
        try {
          const accounts = await this.injected.request({
            method: "eth_requestAccounts"
          });
          if (!accounts || accounts.length === 0) {
            return { accounts: [] };
          }
          await this.#onAccountsChanged(accounts);
        } catch (error) {
          console.error("Connection error:", error);
          return { accounts: [] };
        }
      }
      return { accounts: this.accounts };
    };
    #disconnect = async () => {
      this.#disconnected();
      return;
    };
    #on = (event, listener) => {
      if (!this.#listeners[event]) {
        this.#listeners[event] = [];
      }
      this.#listeners[event].push(listener);
      return () => {
        this.#off(event, listener);
      };
    };
    #emit(event, ...args) {
      if (!this.#listeners[event]) return;
      for (const listener of this.#listeners[event]) {
        listener.apply(null, args);
      }
    }
    #off(event, listener) {
      const arr = this.#listeners[event];
      if (!arr) return;
      this.#listeners[event] = arr.filter((l) => l !== listener);
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
    #onDisconnect() {
      this.#disconnected();
    }
    #request(args) {
      return this.injected.request(args);
    }
    async #getEthereumChain() {
      try {
        const chainIdHex = await this.injected.request({
          method: "eth_chainId"
        });
        const chainId = Number.parseInt(chainIdHex, 16).toString();
        const chain = `eip155:${chainId}`;
        return chain;
      } catch (error) {
        console.error("Failed to get chain ID:", error);
        throw new Error("Invalid Ethereum chain");
      }
    }
  };
})();
//# sourceMappingURL=index.js.map