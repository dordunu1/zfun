import {
  require_chacha20poly1305,
  require_cjs,
  require_cjs2,
  require_cjs3,
  require_decode_uri_component,
  require_filter_obj,
  require_hkdf,
  require_random,
  require_sha256,
  require_split_on_first,
  require_strict_uri_encode,
  require_x25519
} from "./chunk-M7NQJYYH.js";
import {
  connect,
  disconnect,
  fetchBalance,
  fetchEnsAvatar,
  fetchEnsName,
  getAccount,
  getNetwork,
  switchNetwork,
  watchAccount,
  watchNetwork
} from "./chunk-AHZ2PCJK.js";
import {
  Connector,
  InjectedConnector,
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet
} from "./chunk-EH4YT64S.js";
import "./chunk-FEESO44D.js";
import "./chunk-IODIOONO.js";
import {
  createWalletClient,
  custom
} from "./chunk-2UU34GTM.js";
import "./chunk-55XFJABX.js";
import "./chunk-QCGPEAVX.js";
import {
  SwitchChainError,
  UserRejectedRequestError,
  getAddress,
  numberToHex
} from "./chunk-VQ35IVSK.js";
import "./chunk-NV6WWUQM.js";
import "./chunk-ZDM6JSZO.js";
import "./chunk-GWMKVQ4W.js";
import "./chunk-FV3PPQPS.js";
import {
  __commonJS,
  __toESM
} from "./chunk-256EKJAK.js";

// node_modules/@walletconnect/utils/node_modules/query-string/index.js
var require_query_string = __commonJS({
  "node_modules/@walletconnect/utils/node_modules/query-string/index.js"(exports) {
    "use strict";
    var strictUriEncode = require_strict_uri_encode();
    var decodeComponent = require_decode_uri_component();
    var splitOnFirst = require_split_on_first();
    var filterObject = require_filter_obj();
    var isNullOrUndefined = (value) => value === null || value === void 0;
    var encodeFragmentIdentifier = Symbol("encodeFragmentIdentifier");
    function encoderForArrayFormat(options) {
      switch (options.arrayFormat) {
        case "index":
          return (key) => (result, value) => {
            const index = result.length;
            if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
              return result;
            }
            if (value === null) {
              return [...result, [encode(key, options), "[", index, "]"].join("")];
            }
            return [
              ...result,
              [encode(key, options), "[", encode(index, options), "]=", encode(value, options)].join("")
            ];
          };
        case "bracket":
          return (key) => (result, value) => {
            if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
              return result;
            }
            if (value === null) {
              return [...result, [encode(key, options), "[]"].join("")];
            }
            return [...result, [encode(key, options), "[]=", encode(value, options)].join("")];
          };
        case "colon-list-separator":
          return (key) => (result, value) => {
            if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
              return result;
            }
            if (value === null) {
              return [...result, [encode(key, options), ":list="].join("")];
            }
            return [...result, [encode(key, options), ":list=", encode(value, options)].join("")];
          };
        case "comma":
        case "separator":
        case "bracket-separator": {
          const keyValueSep = options.arrayFormat === "bracket-separator" ? "[]=" : "=";
          return (key) => (result, value) => {
            if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
              return result;
            }
            value = value === null ? "" : value;
            if (result.length === 0) {
              return [[encode(key, options), keyValueSep, encode(value, options)].join("")];
            }
            return [[result, encode(value, options)].join(options.arrayFormatSeparator)];
          };
        }
        default:
          return (key) => (result, value) => {
            if (value === void 0 || options.skipNull && value === null || options.skipEmptyString && value === "") {
              return result;
            }
            if (value === null) {
              return [...result, encode(key, options)];
            }
            return [...result, [encode(key, options), "=", encode(value, options)].join("")];
          };
      }
    }
    function parserForArrayFormat(options) {
      let result;
      switch (options.arrayFormat) {
        case "index":
          return (key, value, accumulator) => {
            result = /\[(\d*)\]$/.exec(key);
            key = key.replace(/\[\d*\]$/, "");
            if (!result) {
              accumulator[key] = value;
              return;
            }
            if (accumulator[key] === void 0) {
              accumulator[key] = {};
            }
            accumulator[key][result[1]] = value;
          };
        case "bracket":
          return (key, value, accumulator) => {
            result = /(\[\])$/.exec(key);
            key = key.replace(/\[\]$/, "");
            if (!result) {
              accumulator[key] = value;
              return;
            }
            if (accumulator[key] === void 0) {
              accumulator[key] = [value];
              return;
            }
            accumulator[key] = [].concat(accumulator[key], value);
          };
        case "colon-list-separator":
          return (key, value, accumulator) => {
            result = /(:list)$/.exec(key);
            key = key.replace(/:list$/, "");
            if (!result) {
              accumulator[key] = value;
              return;
            }
            if (accumulator[key] === void 0) {
              accumulator[key] = [value];
              return;
            }
            accumulator[key] = [].concat(accumulator[key], value);
          };
        case "comma":
        case "separator":
          return (key, value, accumulator) => {
            const isArray = typeof value === "string" && value.includes(options.arrayFormatSeparator);
            const isEncodedArray = typeof value === "string" && !isArray && decode(value, options).includes(options.arrayFormatSeparator);
            value = isEncodedArray ? decode(value, options) : value;
            const newValue = isArray || isEncodedArray ? value.split(options.arrayFormatSeparator).map((item) => decode(item, options)) : value === null ? value : decode(value, options);
            accumulator[key] = newValue;
          };
        case "bracket-separator":
          return (key, value, accumulator) => {
            const isArray = /(\[\])$/.test(key);
            key = key.replace(/\[\]$/, "");
            if (!isArray) {
              accumulator[key] = value ? decode(value, options) : value;
              return;
            }
            const arrayValue = value === null ? [] : value.split(options.arrayFormatSeparator).map((item) => decode(item, options));
            if (accumulator[key] === void 0) {
              accumulator[key] = arrayValue;
              return;
            }
            accumulator[key] = [].concat(accumulator[key], arrayValue);
          };
        default:
          return (key, value, accumulator) => {
            if (accumulator[key] === void 0) {
              accumulator[key] = value;
              return;
            }
            accumulator[key] = [].concat(accumulator[key], value);
          };
      }
    }
    function validateArrayFormatSeparator(value) {
      if (typeof value !== "string" || value.length !== 1) {
        throw new TypeError("arrayFormatSeparator must be single character string");
      }
    }
    function encode(value, options) {
      if (options.encode) {
        return options.strict ? strictUriEncode(value) : encodeURIComponent(value);
      }
      return value;
    }
    function decode(value, options) {
      if (options.decode) {
        return decodeComponent(value);
      }
      return value;
    }
    function keysSorter(input) {
      if (Array.isArray(input)) {
        return input.sort();
      }
      if (typeof input === "object") {
        return keysSorter(Object.keys(input)).sort((a, b) => Number(a) - Number(b)).map((key) => input[key]);
      }
      return input;
    }
    function removeHash(input) {
      const hashStart = input.indexOf("#");
      if (hashStart !== -1) {
        input = input.slice(0, hashStart);
      }
      return input;
    }
    function getHash(url) {
      let hash = "";
      const hashStart = url.indexOf("#");
      if (hashStart !== -1) {
        hash = url.slice(hashStart);
      }
      return hash;
    }
    function extract(input) {
      input = removeHash(input);
      const queryStart = input.indexOf("?");
      if (queryStart === -1) {
        return "";
      }
      return input.slice(queryStart + 1);
    }
    function parseValue(value, options) {
      if (options.parseNumbers && !Number.isNaN(Number(value)) && (typeof value === "string" && value.trim() !== "")) {
        value = Number(value);
      } else if (options.parseBooleans && value !== null && (value.toLowerCase() === "true" || value.toLowerCase() === "false")) {
        value = value.toLowerCase() === "true";
      }
      return value;
    }
    function parse2(query, options) {
      options = Object.assign({
        decode: true,
        sort: true,
        arrayFormat: "none",
        arrayFormatSeparator: ",",
        parseNumbers: false,
        parseBooleans: false
      }, options);
      validateArrayFormatSeparator(options.arrayFormatSeparator);
      const formatter = parserForArrayFormat(options);
      const ret = /* @__PURE__ */ Object.create(null);
      if (typeof query !== "string") {
        return ret;
      }
      query = query.trim().replace(/^[?#&]/, "");
      if (!query) {
        return ret;
      }
      for (const param of query.split("&")) {
        if (param === "") {
          continue;
        }
        let [key, value] = splitOnFirst(options.decode ? param.replace(/\+/g, " ") : param, "=");
        value = value === void 0 ? null : ["comma", "separator", "bracket-separator"].includes(options.arrayFormat) ? value : decode(value, options);
        formatter(decode(key, options), value, ret);
      }
      for (const key of Object.keys(ret)) {
        const value = ret[key];
        if (typeof value === "object" && value !== null) {
          for (const k of Object.keys(value)) {
            value[k] = parseValue(value[k], options);
          }
        } else {
          ret[key] = parseValue(value, options);
        }
      }
      if (options.sort === false) {
        return ret;
      }
      return (options.sort === true ? Object.keys(ret).sort() : Object.keys(ret).sort(options.sort)).reduce((result, key) => {
        const value = ret[key];
        if (Boolean(value) && typeof value === "object" && !Array.isArray(value)) {
          result[key] = keysSorter(value);
        } else {
          result[key] = value;
        }
        return result;
      }, /* @__PURE__ */ Object.create(null));
    }
    exports.extract = extract;
    exports.parse = parse2;
    exports.stringify = (object, options) => {
      if (!object) {
        return "";
      }
      options = Object.assign({
        encode: true,
        strict: true,
        arrayFormat: "none",
        arrayFormatSeparator: ","
      }, options);
      validateArrayFormatSeparator(options.arrayFormatSeparator);
      const shouldFilter = (key) => options.skipNull && isNullOrUndefined(object[key]) || options.skipEmptyString && object[key] === "";
      const formatter = encoderForArrayFormat(options);
      const objectCopy = {};
      for (const key of Object.keys(object)) {
        if (!shouldFilter(key)) {
          objectCopy[key] = object[key];
        }
      }
      const keys = Object.keys(objectCopy);
      if (options.sort !== false) {
        keys.sort(options.sort);
      }
      return keys.map((key) => {
        const value = object[key];
        if (value === void 0) {
          return "";
        }
        if (value === null) {
          return encode(key, options);
        }
        if (Array.isArray(value)) {
          if (value.length === 0 && options.arrayFormat === "bracket-separator") {
            return encode(key, options) + "[]";
          }
          return value.reduce(formatter(key), []).join("&");
        }
        return encode(key, options) + "=" + encode(value, options);
      }).filter((x) => x.length > 0).join("&");
    };
    exports.parseUrl = (url, options) => {
      options = Object.assign({
        decode: true
      }, options);
      const [url_, hash] = splitOnFirst(url, "#");
      return Object.assign(
        {
          url: url_.split("?")[0] || "",
          query: parse2(extract(url), options)
        },
        options && options.parseFragmentIdentifier && hash ? { fragmentIdentifier: decode(hash, options) } : {}
      );
    };
    exports.stringifyUrl = (object, options) => {
      options = Object.assign({
        encode: true,
        strict: true,
        [encodeFragmentIdentifier]: true
      }, options);
      const url = removeHash(object.url).split("?")[0] || "";
      const queryFromUrl = exports.extract(object.url);
      const parsedQueryFromUrl = exports.parse(queryFromUrl, { sort: false });
      const query = Object.assign(parsedQueryFromUrl, object.query);
      let queryString = exports.stringify(query, options);
      if (queryString) {
        queryString = `?${queryString}`;
      }
      let hash = getHash(object.url);
      if (object.fragmentIdentifier) {
        hash = `#${options[encodeFragmentIdentifier] ? encode(object.fragmentIdentifier, options) : object.fragmentIdentifier}`;
      }
      return `${url}${queryString}${hash}`;
    };
    exports.pick = (input, filter, options) => {
      options = Object.assign({
        parseFragmentIdentifier: true,
        [encodeFragmentIdentifier]: false
      }, options);
      const { url, query, fragmentIdentifier } = exports.parseUrl(input, options);
      return exports.stringifyUrl({
        url,
        query: filterObject(query, filter),
        fragmentIdentifier
      }, options);
    };
    exports.exclude = (input, filter, options) => {
      const exclusionFilter = Array.isArray(filter) ? (key) => !filter.includes(key) : (key, value) => !filter(key, value);
      return exports.pick(input, exclusionFilter, options);
    };
  }
});

// node_modules/@walletconnect/utils/dist/index.es.js
var import_chacha20poly1305 = __toESM(require_chacha20poly1305());
var import_hkdf = __toESM(require_hkdf());
var import_random = __toESM(require_random());
var import_sha256 = __toESM(require_sha256());
var fe = __toESM(require_x25519());
var import_time = __toESM(require_cjs());
var import_window_getters = __toESM(require_cjs2());
var import_window_metadata = __toESM(require_cjs3());
var V = __toESM(require_query_string());
function S(e = [], n = []) {
  return [.../* @__PURE__ */ new Set([...e, ...n])];
}
var Ot = Object.defineProperty;
var St = Object.defineProperties;
var wt = Object.getOwnPropertyDescriptors;
var ze = Object.getOwnPropertySymbols;
var It = Object.prototype.hasOwnProperty;
var Pt = Object.prototype.propertyIsEnumerable;
var Ye = (e, n, t) => n in e ? Ot(e, n, { enumerable: true, configurable: true, writable: true, value: t }) : e[n] = t;
var Tt = (e, n) => {
  for (var t in n || (n = {})) It.call(n, t) && Ye(e, t, n[t]);
  if (ze) for (var t of ze(n)) Pt.call(n, t) && Ye(e, t, n[t]);
  return e;
};
var Rt = (e, n) => St(e, wt(n));
function oe(e) {
  return e.includes(":");
}
function Xe(e) {
  return oe(e) ? e.split(":")[0] : e;
}
function se(e) {
  var n, t, r;
  const o = {};
  if (!B(e)) return o;
  for (const [s, i] of Object.entries(e)) {
    const l = oe(s) ? [s] : i.chains, d = i.methods || [], c = i.events || [], u = Xe(s);
    o[u] = Rt(Tt({}, o[u]), { chains: S(l, (n = o[u]) == null ? void 0 : n.chains), methods: S(d, (t = o[u]) == null ? void 0 : t.methods), events: S(c, (r = o[u]) == null ? void 0 : r.events) });
  }
  return o;
}
function B(e) {
  return Object.getPrototypeOf(e) === Object.prototype && Object.keys(e).length;
}

// node_modules/@wagmi/connectors/dist/walletConnect.js
var NAMESPACE = "eip155";
var STORE_KEY = "store";
var REQUESTED_CHAINS_KEY = "requestedChains";
var ADD_ETH_CHAIN_METHOD = "wallet_addEthereumChain";
var _provider;
var _initProviderPromise;
var _createProvider;
var createProvider_fn;
var _initProvider;
var initProvider_fn;
var _isChainsStale;
var isChainsStale_fn;
var _setupListeners;
var setupListeners_fn;
var _removeListeners;
var removeListeners_fn;
var _setRequestedChainsIds;
var setRequestedChainsIds_fn;
var _getRequestedChainsIds;
var getRequestedChainsIds_fn;
var _getNamespaceChainsIds;
var getNamespaceChainsIds_fn;
var _getNamespaceMethods;
var getNamespaceMethods_fn;
var WalletConnectConnector = class extends Connector {
  constructor(config) {
    super({
      ...config,
      options: { isNewChainsStale: true, ...config.options }
    });
    __privateAdd(this, _createProvider);
    __privateAdd(this, _initProvider);
    __privateAdd(this, _isChainsStale);
    __privateAdd(this, _setupListeners);
    __privateAdd(this, _removeListeners);
    __privateAdd(this, _setRequestedChainsIds);
    __privateAdd(this, _getRequestedChainsIds);
    __privateAdd(this, _getNamespaceChainsIds);
    __privateAdd(this, _getNamespaceMethods);
    this.id = "walletConnect";
    this.name = "WalletConnect";
    this.ready = true;
    __privateAdd(this, _provider, void 0);
    __privateAdd(this, _initProviderPromise, void 0);
    this.onAccountsChanged = (accounts) => {
      if (accounts.length === 0)
        this.emit("disconnect");
      else
        this.emit("change", { account: getAddress(accounts[0]) });
    };
    this.onChainChanged = (chainId) => {
      const id = Number(chainId);
      const unsupported = this.isChainUnsupported(id);
      this.emit("change", { chain: { id, unsupported } });
    };
    this.onDisconnect = () => {
      __privateMethod(this, _setRequestedChainsIds, setRequestedChainsIds_fn).call(this, []);
      this.emit("disconnect");
    };
    this.onDisplayUri = (uri) => {
      this.emit("message", { type: "display_uri", data: uri });
    };
    this.onConnect = () => {
      this.emit("connect", {});
    };
    __privateMethod(this, _createProvider, createProvider_fn).call(this);
  }
  async connect({ chainId, pairingTopic } = {}) {
    var _a, _b, _c, _d, _e;
    try {
      let targetChainId = chainId;
      if (!targetChainId) {
        const store = (_a = this.storage) == null ? void 0 : _a.getItem(STORE_KEY);
        const lastUsedChainId = (_d = (_c = (_b = store == null ? void 0 : store.state) == null ? void 0 : _b.data) == null ? void 0 : _c.chain) == null ? void 0 : _d.id;
        if (lastUsedChainId && !this.isChainUnsupported(lastUsedChainId))
          targetChainId = lastUsedChainId;
        else
          targetChainId = (_e = this.chains[0]) == null ? void 0 : _e.id;
      }
      if (!targetChainId)
        throw new Error("No chains found on connector.");
      const provider = await this.getProvider();
      __privateMethod(this, _setupListeners, setupListeners_fn).call(this);
      const isChainsStale = __privateMethod(this, _isChainsStale, isChainsStale_fn).call(this);
      if (provider.session && isChainsStale)
        await provider.disconnect();
      if (!provider.session || isChainsStale) {
        const optionalChains = this.chains.filter((chain) => chain.id !== targetChainId).map((optionalChain) => optionalChain.id);
        this.emit("message", { type: "connecting" });
        await provider.connect({
          pairingTopic,
          optionalChains: [targetChainId, ...optionalChains]
        });
        __privateMethod(this, _setRequestedChainsIds, setRequestedChainsIds_fn).call(this, this.chains.map(({ id: id2 }) => id2));
      }
      const accounts = await provider.enable();
      const account = getAddress(accounts[0]);
      const id = await this.getChainId();
      const unsupported = this.isChainUnsupported(id);
      return {
        account,
        chain: { id, unsupported }
      };
    } catch (error) {
      if (/user rejected/i.test(error == null ? void 0 : error.message)) {
        throw new UserRejectedRequestError(error);
      }
      throw error;
    }
  }
  async disconnect() {
    const provider = await this.getProvider();
    try {
      await provider.disconnect();
    } catch (error) {
      if (!/No matching key/i.test(error.message))
        throw error;
    } finally {
      __privateMethod(this, _removeListeners, removeListeners_fn).call(this);
      __privateMethod(this, _setRequestedChainsIds, setRequestedChainsIds_fn).call(this, []);
    }
  }
  async getAccount() {
    const { accounts } = await this.getProvider();
    return getAddress(accounts[0]);
  }
  async getChainId() {
    const { chainId } = await this.getProvider();
    return chainId;
  }
  async getProvider({ chainId } = {}) {
    if (!__privateGet(this, _provider))
      await __privateMethod(this, _createProvider, createProvider_fn).call(this);
    if (chainId)
      await this.switchChain(chainId);
    return __privateGet(this, _provider);
  }
  async getWalletClient({
    chainId
  } = {}) {
    const [provider, account] = await Promise.all([
      this.getProvider({ chainId }),
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
    try {
      const [account, provider] = await Promise.all([
        this.getAccount(),
        this.getProvider()
      ]);
      const isChainsStale = __privateMethod(this, _isChainsStale, isChainsStale_fn).call(this);
      if (!account)
        return false;
      if (isChainsStale && provider.session) {
        try {
          await provider.disconnect();
        } catch {
        }
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
  async switchChain(chainId) {
    var _a, _b;
    const chain = this.chains.find((chain2) => chain2.id === chainId);
    if (!chain)
      throw new SwitchChainError(new Error("chain not found on connector."));
    try {
      const provider = await this.getProvider();
      const namespaceChains = __privateMethod(this, _getNamespaceChainsIds, getNamespaceChainsIds_fn).call(this);
      const namespaceMethods = __privateMethod(this, _getNamespaceMethods, getNamespaceMethods_fn).call(this);
      const isChainApproved = namespaceChains.includes(chainId);
      if (!isChainApproved && namespaceMethods.includes(ADD_ETH_CHAIN_METHOD)) {
        await provider.request({
          method: ADD_ETH_CHAIN_METHOD,
          params: [
            {
              chainId: numberToHex(chain.id),
              blockExplorerUrls: [(_b = (_a = chain.blockExplorers) == null ? void 0 : _a.default) == null ? void 0 : _b.url],
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: [...chain.rpcUrls.default.http]
            }
          ]
        });
        const requestedChains = __privateMethod(this, _getRequestedChainsIds, getRequestedChainsIds_fn).call(this);
        requestedChains.push(chainId);
        __privateMethod(this, _setRequestedChainsIds, setRequestedChainsIds_fn).call(this, requestedChains);
      }
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: numberToHex(chainId) }]
      });
      return chain;
    } catch (error) {
      const message = typeof error === "string" ? error : error == null ? void 0 : error.message;
      if (/user rejected request/i.test(message)) {
        throw new UserRejectedRequestError(error);
      }
      throw new SwitchChainError(error);
    }
  }
};
_provider = /* @__PURE__ */ new WeakMap();
_initProviderPromise = /* @__PURE__ */ new WeakMap();
_createProvider = /* @__PURE__ */ new WeakSet();
createProvider_fn = async function() {
  if (!__privateGet(this, _initProviderPromise) && typeof window !== "undefined") {
    __privateSet(this, _initProviderPromise, __privateMethod(this, _initProvider, initProvider_fn).call(this));
  }
  return __privateGet(this, _initProviderPromise);
};
_initProvider = /* @__PURE__ */ new WeakSet();
initProvider_fn = async function() {
  const { EthereumProvider } = await import("./index.es-X6OOVBVU.js");
  const optionalChains = this.chains.map(({ id }) => id);
  if (optionalChains.length) {
    const {
      projectId,
      showQrModal = true,
      qrModalOptions,
      metadata,
      relayUrl
    } = this.options;
    __privateSet(this, _provider, await EthereumProvider.init({
      showQrModal,
      qrModalOptions,
      projectId,
      optionalChains,
      rpcMap: Object.fromEntries(
        this.chains.map((chain) => [
          chain.id,
          chain.rpcUrls.default.http[0]
        ])
      ),
      metadata,
      relayUrl
    }));
  }
};
_isChainsStale = /* @__PURE__ */ new WeakSet();
isChainsStale_fn = function() {
  const namespaceMethods = __privateMethod(this, _getNamespaceMethods, getNamespaceMethods_fn).call(this);
  if (namespaceMethods.includes(ADD_ETH_CHAIN_METHOD))
    return false;
  if (!this.options.isNewChainsStale)
    return false;
  const requestedChains = __privateMethod(this, _getRequestedChainsIds, getRequestedChainsIds_fn).call(this);
  const connectorChains = this.chains.map(({ id }) => id);
  const namespaceChains = __privateMethod(this, _getNamespaceChainsIds, getNamespaceChainsIds_fn).call(this);
  if (namespaceChains.length && !namespaceChains.some((id) => connectorChains.includes(id)))
    return false;
  return !connectorChains.every((id) => requestedChains.includes(id));
};
_setupListeners = /* @__PURE__ */ new WeakSet();
setupListeners_fn = function() {
  if (!__privateGet(this, _provider))
    return;
  __privateMethod(this, _removeListeners, removeListeners_fn).call(this);
  __privateGet(this, _provider).on("accountsChanged", this.onAccountsChanged);
  __privateGet(this, _provider).on("chainChanged", this.onChainChanged);
  __privateGet(this, _provider).on("disconnect", this.onDisconnect);
  __privateGet(this, _provider).on("session_delete", this.onDisconnect);
  __privateGet(this, _provider).on("display_uri", this.onDisplayUri);
  __privateGet(this, _provider).on("connect", this.onConnect);
};
_removeListeners = /* @__PURE__ */ new WeakSet();
removeListeners_fn = function() {
  if (!__privateGet(this, _provider))
    return;
  __privateGet(this, _provider).removeListener("accountsChanged", this.onAccountsChanged);
  __privateGet(this, _provider).removeListener("chainChanged", this.onChainChanged);
  __privateGet(this, _provider).removeListener("disconnect", this.onDisconnect);
  __privateGet(this, _provider).removeListener("session_delete", this.onDisconnect);
  __privateGet(this, _provider).removeListener("display_uri", this.onDisplayUri);
  __privateGet(this, _provider).removeListener("connect", this.onConnect);
};
_setRequestedChainsIds = /* @__PURE__ */ new WeakSet();
setRequestedChainsIds_fn = function(chains) {
  var _a;
  (_a = this.storage) == null ? void 0 : _a.setItem(REQUESTED_CHAINS_KEY, chains);
};
_getRequestedChainsIds = /* @__PURE__ */ new WeakSet();
getRequestedChainsIds_fn = function() {
  var _a;
  return ((_a = this.storage) == null ? void 0 : _a.getItem(REQUESTED_CHAINS_KEY)) ?? [];
};
_getNamespaceChainsIds = /* @__PURE__ */ new WeakSet();
getNamespaceChainsIds_fn = function() {
  var _a, _b, _c;
  if (!__privateGet(this, _provider))
    return [];
  const namespaces = (_a = __privateGet(this, _provider).session) == null ? void 0 : _a.namespaces;
  if (!namespaces)
    return [];
  const normalizedNamespaces = se(namespaces);
  const chainIds = (_c = (_b = normalizedNamespaces[NAMESPACE]) == null ? void 0 : _b.chains) == null ? void 0 : _c.map(
    (chain) => parseInt(chain.split(":")[1] || "")
  );
  return chainIds ?? [];
};
_getNamespaceMethods = /* @__PURE__ */ new WeakSet();
getNamespaceMethods_fn = function() {
  var _a, _b;
  if (!__privateGet(this, _provider))
    return [];
  const namespaces = (_a = __privateGet(this, _provider).session) == null ? void 0 : _a.namespaces;
  if (!namespaces)
    return [];
  const normalizedNamespaces = se(namespaces);
  const methods = (_b = normalizedNamespaces[NAMESPACE]) == null ? void 0 : _b.methods;
  return methods ?? [];
};

// node_modules/@wagmi/core/dist/providers/jsonRpc.js
function jsonRpcProvider({
  rpc
}) {
  return function(chain) {
    const rpcConfig = rpc(chain);
    if (!rpcConfig || rpcConfig.http === "")
      return null;
    return {
      chain: {
        ...chain,
        rpcUrls: {
          ...chain.rpcUrls,
          default: { http: [rpcConfig.http] }
        }
      },
      rpcUrls: {
        http: [rpcConfig.http],
        webSocket: rpcConfig.webSocket ? [rpcConfig.webSocket] : void 0
      }
    };
  };
}

// node_modules/@web3modal/ethereum/dist/index.js
var A = "wallet_addEthereumChain";
var j = class {
  constructor(t, e) {
    this.wagmi = {}, this.chains = [], this.namespace = "eip155", this.disconnect = disconnect, this.getAccount = getAccount, this.watchAccount = watchAccount, this.fetchBalance = fetchBalance, this.getNetwork = getNetwork, this.watchNetwork = watchNetwork, this.switchNetwork = switchNetwork, this.fetchEnsName = fetchEnsName, this.fetchEnsAvatar = fetchEnsAvatar, this.wagmi = t, this.chains = e;
  }
  getWalletConnectConnector() {
    const t = this.wagmi.connectors.find((e) => e.id === "walletConnect");
    if (!t) throw new Error("WalletConnectConnector is required");
    return t;
  }
  async connectWalletConnectProvider(t, e) {
    return await t.getProvider(), new Promise((n) => {
      t.once("message", (o) => {
        o.type === "display_uri" && (e(o.data), n());
      });
    });
  }
  getConnectorById(t) {
    const e = this.wagmi.connectors.find((n) => n.id === t);
    if (!e) throw new Error(`Connector for id ${t} was not found`);
    return e;
  }
  getConnectors() {
    return this.wagmi.connectors.filter((t) => !t.id.includes("walletConnect"));
  }
  async connectWalletConnect(t, e) {
    const n = this.getWalletConnectConnector(), o = { connector: n };
    return e && (o.chainId = e), Promise.all([connect(o), this.connectWalletConnectProvider(n, t)]);
  }
  async connectConnector(t, e) {
    const n = { connector: this.getConnectorById(t) };
    return e && (n.chainId = e), await connect(n);
  }
  isInjectedProviderInstalled() {
    return typeof window.ethereum < "u";
  }
  safeCheckInjectedProvider(t) {
    var e;
    try {
      const n = String(t);
      return Boolean((e = window.ethereum) == null ? void 0 : e[n]);
    } catch (n) {
      return console.error(n), false;
    }
  }
  async getConnectedChainIds() {
    var t, e, n;
    const o = (e = (t = (await this.getWalletConnectConnector().getProvider()).signer) == null ? void 0 : t.session) == null ? void 0 : e.namespaces, s = (n = o == null ? void 0 : o[this.namespace]) == null ? void 0 : n.methods;
    if (s != null && s.includes(A)) return "ALL";
    if (o) {
      const i = [];
      return Object.keys(o).forEach((r) => {
        r.includes(this.namespace) && i.push(...o[r].accounts);
      }), i == null ? void 0 : i.map((r) => r.split(":")[1]);
    }
    return "ALL";
  }
};
var P = "eip155";
var y = "https://rpc.walletconnect.com";
function W2({ projectId: c }) {
  return jsonRpcProvider({ rpc: (t) => {
    var e;
    return [1, 3, 4, 5, 10, 42, 56, 69, 97, 100, 137, 280, 324, 420, 42161, 42220, 43114, 80001, 421611, 421613, 1313161554, 1313161555].includes(t.id) ? { http: `${y}/v1/?chainId=${P}:${t.id}&projectId=${c}` } : { http: t.rpcUrls.default.http[0], webSocket: (e = t.rpcUrls.default.webSocket) == null ? void 0 : e[0] };
  } });
}
function B2({ chains: c, projectId: t }) {
  return [new WalletConnectConnector({ chains: c, options: { projectId: t, showQrModal: false } }), new InjectedConnector({ chains: c, options: { shimDisconnect: true } })];
}
export {
  j as EthereumClient,
  B2 as w3mConnectors,
  W2 as w3mProvider
};
//# sourceMappingURL=@web3modal_ethereum.js.map
