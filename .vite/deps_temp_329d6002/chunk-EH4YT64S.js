import {
  goerli,
  mainnet
} from "./chunk-IODIOONO.js";
import {
  createWalletClient,
  custom
} from "./chunk-2UU34GTM.js";
import {
  ResourceUnavailableRpcError,
  SwitchChainError,
  UserRejectedRequestError,
  getAddress,
  numberToHex
} from "./chunk-VQ35IVSK.js";
import {
  __commonJS,
  __toESM
} from "./chunk-256EKJAK.js";

// node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "node_modules/eventemitter3/index.js"(exports, module) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__) prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0) return names;
      for (name in events = this._events) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter2.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter2.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };
    EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter2.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter2.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    if ("undefined" !== typeof module) {
      module.exports = EventEmitter2;
    }
  }
});

// node_modules/@wagmi/connectors/dist/chunk-UGBGYVBH.js
var ChainNotConfiguredForConnectorError = class extends Error {
  constructor({
    chainId,
    connectorId
  }) {
    super(`Chain "${chainId}" not configured for connector "${connectorId}".`);
    this.name = "ChainNotConfiguredForConnectorError";
  }
};
var ConnectorNotFoundError = class extends Error {
  constructor() {
    super(...arguments);
    this.name = "ConnectorNotFoundError";
    this.message = "Connector not found";
  }
};

// node_modules/@wagmi/connectors/dist/chunk-W65LBPLT.js
var import_eventemitter3 = __toESM(require_eventemitter3(), 1);
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var Connector = class extends import_eventemitter3.default {
  constructor({
    chains = [mainnet, goerli],
    options
  }) {
    super();
    this.chains = chains;
    this.options = options;
  }
  getBlockExplorerUrls(chain) {
    const { default: blockExplorer, ...blockExplorers } = chain.blockExplorers ?? {};
    if (blockExplorer)
      return [
        blockExplorer.url,
        ...Object.values(blockExplorers).map((x) => x.url)
      ];
  }
  isChainUnsupported(chainId) {
    return !this.chains.some((x) => x.id === chainId);
  }
  setStorage(storage) {
    this.storage = storage;
  }
};

// node_modules/@wagmi/connectors/dist/chunk-OQILYQDO.js
function normalizeChainId(chainId) {
  if (typeof chainId === "string")
    return Number.parseInt(
      chainId,
      chainId.trim().substring(0, 2) === "0x" ? 16 : 10
    );
  if (typeof chainId === "bigint")
    return Number(chainId);
  return chainId;
}

// node_modules/@wagmi/connectors/dist/chunk-P4NRLOY7.js
function getInjectedName(ethereum) {
  var _a;
  if (!ethereum)
    return "Injected";
  const getName = (provider) => {
    if (provider.isApexWallet)
      return "Apex Wallet";
    if (provider.isAvalanche)
      return "Core Wallet";
    if (provider.isBackpack)
      return "Backpack";
    if (provider.isBifrost)
      return "Bifrost Wallet";
    if (provider.isBitKeep)
      return "BitKeep";
    if (provider.isBitski)
      return "Bitski";
    if (provider.isBlockWallet)
      return "BlockWallet";
    if (provider.isBraveWallet)
      return "Brave Wallet";
    if (provider.isCoin98)
      return "Coin98 Wallet";
    if (provider.isCoinbaseWallet)
      return "Coinbase Wallet";
    if (provider.isDawn)
      return "Dawn Wallet";
    if (provider.isDefiant)
      return "Defiant";
    if (provider.isDesig)
      return "Desig Wallet";
    if (provider.isEnkrypt)
      return "Enkrypt";
    if (provider.isExodus)
      return "Exodus";
    if (provider.isFordefi)
      return "Fordefi";
    if (provider.isFrame)
      return "Frame";
    if (provider.isFrontier)
      return "Frontier Wallet";
    if (provider.isGamestop)
      return "GameStop Wallet";
    if (provider.isHaqqWallet)
      return "HAQQ Wallet";
    if (provider.isHyperPay)
      return "HyperPay Wallet";
    if (provider.isImToken)
      return "ImToken";
    if (provider.isHaloWallet)
      return "Halo Wallet";
    if (provider.isKuCoinWallet)
      return "KuCoin Wallet";
    if (provider.isMathWallet)
      return "MathWallet";
    if (provider.isNovaWallet)
      return "Nova Wallet";
    if (provider.isOkxWallet || provider.isOKExWallet)
      return "OKX Wallet";
    if (provider.isOktoWallet)
      return "Okto Wallet";
    if (provider.isOneInchIOSWallet || provider.isOneInchAndroidWallet)
      return "1inch Wallet";
    if (provider.isOneKey)
      return "OneKey Wallet";
    if (provider.isOpera)
      return "Opera";
    if (provider.isPhantom)
      return "Phantom";
    if (provider.isPortal)
      return "Ripio Portal";
    if (provider.isRabby)
      return "Rabby Wallet";
    if (provider.isRainbow)
      return "Rainbow";
    if (provider.isSafePal)
      return "SafePal Wallet";
    if (provider.isStatus)
      return "Status";
    if (provider.isSubWallet)
      return "SubWallet";
    if (provider.isTalisman)
      return "Talisman";
    if (provider.isTally)
      return "Taho";
    if (provider.isTokenPocket)
      return "TokenPocket";
    if (provider.isTokenary)
      return "Tokenary";
    if (provider.isTrust || provider.isTrustWallet)
      return "Trust Wallet";
    if (provider.isTTWallet)
      return "TTWallet";
    if (provider.isXDEFI)
      return "XDEFI Wallet";
    if (provider.isZeal)
      return "Zeal";
    if (provider.isZerion)
      return "Zerion";
    if (provider.isMetaMask)
      return "MetaMask";
  };
  if ((_a = ethereum.providers) == null ? void 0 : _a.length) {
    const nameSet = /* @__PURE__ */ new Set();
    let unknownCount = 1;
    for (const provider of ethereum.providers) {
      let name = getName(provider);
      if (!name) {
        name = `Unknown Wallet #${unknownCount}`;
        unknownCount += 1;
      }
      nameSet.add(name);
    }
    const names = [...nameSet];
    if (names.length)
      return names;
    return names[0] ?? "Injected";
  }
  return getName(ethereum) ?? "Injected";
}
var _provider;
var InjectedConnector = class extends Connector {
  constructor({
    chains,
    options: options_
  } = {}) {
    const options = {
      shimDisconnect: true,
      getProvider() {
        if (typeof window === "undefined")
          return;
        const ethereum = window.ethereum;
        if ((ethereum == null ? void 0 : ethereum.providers) && ethereum.providers.length > 0)
          return ethereum.providers[0];
        return ethereum;
      },
      ...options_
    };
    super({ chains, options });
    this.id = "injected";
    __privateAdd(this, _provider, void 0);
    this.shimDisconnectKey = `${this.id}.shimDisconnect`;
    this.onAccountsChanged = (accounts) => {
      if (accounts.length === 0)
        this.emit("disconnect");
      else
        this.emit("change", {
          account: getAddress(accounts[0])
        });
    };
    this.onChainChanged = (chainId) => {
      const id = normalizeChainId(chainId);
      const unsupported = this.isChainUnsupported(id);
      this.emit("change", { chain: { id, unsupported } });
    };
    this.onDisconnect = async (error) => {
      var _a;
      if (error.code === 1013) {
        const provider2 = await this.getProvider();
        if (provider2) {
          const isAuthorized = await this.getAccount();
          if (isAuthorized)
            return;
        }
      }
      this.emit("disconnect");
      if (this.options.shimDisconnect)
        (_a = this.storage) == null ? void 0 : _a.removeItem(this.shimDisconnectKey);
    };
    const provider = options.getProvider();
    if (typeof options.name === "string")
      this.name = options.name;
    else if (provider) {
      const detectedName = getInjectedName(provider);
      if (options.name)
        this.name = options.name(detectedName);
      else {
        if (typeof detectedName === "string")
          this.name = detectedName;
        else
          this.name = detectedName[0];
      }
    } else
      this.name = "Injected";
    this.ready = !!provider;
  }
  async connect({ chainId } = {}) {
    var _a;
    try {
      const provider = await this.getProvider();
      if (!provider)
        throw new ConnectorNotFoundError();
      if (provider.on) {
        provider.on("accountsChanged", this.onAccountsChanged);
        provider.on("chainChanged", this.onChainChanged);
        provider.on("disconnect", this.onDisconnect);
      }
      this.emit("message", { type: "connecting" });
      const accounts = await provider.request({
        method: "eth_requestAccounts"
      });
      const account = getAddress(accounts[0]);
      let id = await this.getChainId();
      let unsupported = this.isChainUnsupported(id);
      if (chainId && id !== chainId) {
        const chain = await this.switchChain(chainId);
        id = chain.id;
        unsupported = this.isChainUnsupported(id);
      }
      if (this.options.shimDisconnect)
        (_a = this.storage) == null ? void 0 : _a.setItem(this.shimDisconnectKey, true);
      return { account, chain: { id, unsupported } };
    } catch (error) {
      if (this.isUserRejectedRequestError(error))
        throw new UserRejectedRequestError(error);
      if (error.code === -32002)
        throw new ResourceUnavailableRpcError(error);
      throw error;
    }
  }
  async disconnect() {
    var _a;
    const provider = await this.getProvider();
    if (!(provider == null ? void 0 : provider.removeListener))
      return;
    provider.removeListener("accountsChanged", this.onAccountsChanged);
    provider.removeListener("chainChanged", this.onChainChanged);
    provider.removeListener("disconnect", this.onDisconnect);
    if (this.options.shimDisconnect)
      (_a = this.storage) == null ? void 0 : _a.removeItem(this.shimDisconnectKey);
  }
  async getAccount() {
    const provider = await this.getProvider();
    if (!provider)
      throw new ConnectorNotFoundError();
    const accounts = await provider.request({
      method: "eth_accounts"
    });
    return getAddress(accounts[0]);
  }
  async getChainId() {
    const provider = await this.getProvider();
    if (!provider)
      throw new ConnectorNotFoundError();
    return provider.request({ method: "eth_chainId" }).then(normalizeChainId);
  }
  async getProvider() {
    const provider = this.options.getProvider();
    if (provider)
      __privateSet(this, _provider, provider);
    return __privateGet(this, _provider);
  }
  async getWalletClient({
    chainId
  } = {}) {
    const [provider, account] = await Promise.all([
      this.getProvider(),
      this.getAccount()
    ]);
    const chain = this.chains.find((x) => x.id === chainId);
    if (!provider)
      throw new Error("provider is required.");
    return createWalletClient({
      account,
      chain,
      transport: custom(provider)
    });
  }
  async isAuthorized() {
    var _a;
    try {
      if (this.options.shimDisconnect && !((_a = this.storage) == null ? void 0 : _a.getItem(this.shimDisconnectKey)))
        return false;
      const provider = await this.getProvider();
      if (!provider)
        throw new ConnectorNotFoundError();
      const account = await this.getAccount();
      return !!account;
    } catch {
      return false;
    }
  }
  async switchChain(chainId) {
    var _a, _b, _c;
    const provider = await this.getProvider();
    if (!provider)
      throw new ConnectorNotFoundError();
    const id = numberToHex(chainId);
    try {
      await Promise.all([
        provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: id }]
        }),
        new Promise(
          (res) => this.on("change", ({ chain }) => {
            if ((chain == null ? void 0 : chain.id) === chainId)
              res();
          })
        )
      ]);
      return this.chains.find((x) => x.id === chainId) ?? {
        id: chainId,
        name: `Chain ${id}`,
        network: `${id}`,
        nativeCurrency: { name: "Ether", decimals: 18, symbol: "ETH" },
        rpcUrls: { default: { http: [""] }, public: { http: [""] } }
      };
    } catch (error) {
      const chain = this.chains.find((x) => x.id === chainId);
      if (!chain)
        throw new ChainNotConfiguredForConnectorError({
          chainId,
          connectorId: this.id
        });
      if (error.code === 4902 || ((_b = (_a = error == null ? void 0 : error.data) == null ? void 0 : _a.originalError) == null ? void 0 : _b.code) === 4902) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: id,
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: [((_c = chain.rpcUrls.public) == null ? void 0 : _c.http[0]) ?? ""],
                blockExplorerUrls: this.getBlockExplorerUrls(chain)
              }
            ]
          });
          const currentChainId = await this.getChainId();
          if (currentChainId !== chainId)
            throw new UserRejectedRequestError(
              new Error("User rejected switch after adding network.")
            );
          return chain;
        } catch (error2) {
          throw new UserRejectedRequestError(error2);
        }
      }
      if (this.isUserRejectedRequestError(error))
        throw new UserRejectedRequestError(error);
      throw new SwitchChainError(error);
    }
  }
  async watchAsset({
    address,
    decimals = 18,
    image,
    symbol
  }) {
    const provider = await this.getProvider();
    if (!provider)
      throw new ConnectorNotFoundError();
    return provider.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address,
          decimals,
          image,
          symbol
        }
      }
    });
  }
  isUserRejectedRequestError(error) {
    return error.code === 4001;
  }
};
_provider = /* @__PURE__ */ new WeakMap();

export {
  ConnectorNotFoundError,
  __privateGet,
  __privateAdd,
  __privateSet,
  __privateMethod,
  Connector,
  InjectedConnector
};
//# sourceMappingURL=chunk-EH4YT64S.js.map
