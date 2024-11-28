import {
  h,
  y
} from "./chunk-ZKD3A47W.js";

// node_modules/valtio/esm/vanilla.mjs
var isObject = (x2) => typeof x2 === "object" && x2 !== null;
var proxyStateMap = /* @__PURE__ */ new WeakMap();
var refSet = /* @__PURE__ */ new WeakSet();
var buildProxyFunction = (objectIs = Object.is, newProxy = (target, handler) => new Proxy(target, handler), canProxy = (x2) => isObject(x2) && !refSet.has(x2) && (Array.isArray(x2) || !(Symbol.iterator in x2)) && !(x2 instanceof WeakMap) && !(x2 instanceof WeakSet) && !(x2 instanceof Error) && !(x2 instanceof Number) && !(x2 instanceof Date) && !(x2 instanceof String) && !(x2 instanceof RegExp) && !(x2 instanceof ArrayBuffer), shouldTrapDefineProperty = (desc) => desc.configurable && desc.enumerable && desc.writable, defaultHandlePromise = (promise) => {
  switch (promise.status) {
    case "fulfilled":
      return promise.value;
    case "rejected":
      throw promise.reason;
    default:
      throw promise;
  }
}, snapCache = /* @__PURE__ */ new WeakMap(), createSnapshot = (target, version, handlePromise = defaultHandlePromise) => {
  const cache = snapCache.get(target);
  if ((cache == null ? void 0 : cache[0]) === version) {
    return cache[1];
  }
  const snap = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target));
  h(snap, true);
  snapCache.set(target, [version, snap]);
  Reflect.ownKeys(target).forEach((key) => {
    if (Object.getOwnPropertyDescriptor(snap, key)) {
      return;
    }
    const value = Reflect.get(target, key);
    const desc = {
      value,
      enumerable: true,
      // This is intentional to avoid copying with proxy-compare.
      // It's still non-writable, so it avoids assigning a value.
      configurable: true
    };
    if (refSet.has(value)) {
      h(value, false);
    } else if (value instanceof Promise) {
      delete desc.value;
      desc.get = () => handlePromise(value);
    } else if (proxyStateMap.has(value)) {
      const [target2, ensureVersion] = proxyStateMap.get(
        value
      );
      desc.value = createSnapshot(
        target2,
        ensureVersion(),
        handlePromise
      );
    }
    Object.defineProperty(snap, key, desc);
  });
  return Object.preventExtensions(snap);
}, proxyCache = /* @__PURE__ */ new WeakMap(), versionHolder = [1, 1], proxyFunction = (initialObject) => {
  if (!isObject(initialObject)) {
    throw new Error("object required");
  }
  const found = proxyCache.get(initialObject);
  if (found) {
    return found;
  }
  let version = versionHolder[0];
  const listeners = /* @__PURE__ */ new Set();
  const notifyUpdate = (op, nextVersion = ++versionHolder[0]) => {
    if (version !== nextVersion) {
      version = nextVersion;
      listeners.forEach((listener) => listener(op, nextVersion));
    }
  };
  let checkVersion = versionHolder[1];
  const ensureVersion = (nextCheckVersion = ++versionHolder[1]) => {
    if (checkVersion !== nextCheckVersion && !listeners.size) {
      checkVersion = nextCheckVersion;
      propProxyStates.forEach(([propProxyState]) => {
        const propVersion = propProxyState[1](nextCheckVersion);
        if (propVersion > version) {
          version = propVersion;
        }
      });
    }
    return version;
  };
  const createPropListener = (prop) => (op, nextVersion) => {
    const newOp = [...op];
    newOp[1] = [prop, ...newOp[1]];
    notifyUpdate(newOp, nextVersion);
  };
  const propProxyStates = /* @__PURE__ */ new Map();
  const addPropListener = (prop, propProxyState) => {
    if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production" && propProxyStates.has(prop)) {
      throw new Error("prop listener already exists");
    }
    if (listeners.size) {
      const remove = propProxyState[3](createPropListener(prop));
      propProxyStates.set(prop, [propProxyState, remove]);
    } else {
      propProxyStates.set(prop, [propProxyState]);
    }
  };
  const removePropListener = (prop) => {
    var _a;
    const entry = propProxyStates.get(prop);
    if (entry) {
      propProxyStates.delete(prop);
      (_a = entry[1]) == null ? void 0 : _a.call(entry);
    }
  };
  const addListener = (listener) => {
    listeners.add(listener);
    if (listeners.size === 1) {
      propProxyStates.forEach(([propProxyState, prevRemove], prop) => {
        if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production" && prevRemove) {
          throw new Error("remove already exists");
        }
        const remove = propProxyState[3](createPropListener(prop));
        propProxyStates.set(prop, [propProxyState, remove]);
      });
    }
    const removeListener = () => {
      listeners.delete(listener);
      if (listeners.size === 0) {
        propProxyStates.forEach(([propProxyState, remove], prop) => {
          if (remove) {
            remove();
            propProxyStates.set(prop, [propProxyState]);
          }
        });
      }
    };
    return removeListener;
  };
  const baseObject = Array.isArray(initialObject) ? [] : Object.create(Object.getPrototypeOf(initialObject));
  const trapSet = (hasPrevValue, prevValue, prop, value, setValue) => {
    if (hasPrevValue && (objectIs(prevValue, value) || proxyCache.has(value) && objectIs(prevValue, proxyCache.get(value)))) {
      return;
    }
    removePropListener(prop);
    if (isObject(value)) {
      value = y(value) || value;
    }
    let nextValue = value;
    if (value instanceof Promise) {
      value.then((v) => {
        value.status = "fulfilled";
        value.value = v;
        notifyUpdate(["resolve", [prop], v]);
      }).catch((e) => {
        value.status = "rejected";
        value.reason = e;
        notifyUpdate(["reject", [prop], e]);
      });
    } else {
      if (!proxyStateMap.has(value) && canProxy(value)) {
        nextValue = proxyFunction(value);
      }
      const childProxyState = !refSet.has(nextValue) && proxyStateMap.get(nextValue);
      if (childProxyState) {
        addPropListener(prop, childProxyState);
      }
    }
    setValue(nextValue);
    notifyUpdate(["set", [prop], value, prevValue]);
  };
  const handler = {
    deleteProperty(target, prop) {
      const prevValue = Reflect.get(target, prop);
      removePropListener(prop);
      const deleted = Reflect.deleteProperty(target, prop);
      if (deleted) {
        notifyUpdate(["delete", [prop], prevValue]);
      }
      return deleted;
    },
    set(target, prop, value, receiver) {
      const hasPrevValue = Reflect.has(target, prop);
      const prevValue = Reflect.get(target, prop, receiver);
      trapSet(hasPrevValue, prevValue, prop, value, (nextValue) => {
        Reflect.set(target, prop, nextValue, receiver);
      });
      return true;
    },
    defineProperty(target, prop, desc) {
      if (shouldTrapDefineProperty(desc)) {
        const prevDesc = Reflect.getOwnPropertyDescriptor(target, prop);
        if (!prevDesc || shouldTrapDefineProperty(prevDesc)) {
          trapSet(
            !!prevDesc && "value" in prevDesc,
            prevDesc == null ? void 0 : prevDesc.value,
            prop,
            desc.value,
            (nextValue) => {
              Reflect.defineProperty(target, prop, {
                ...desc,
                value: nextValue
              });
            }
          );
          return true;
        }
      }
      return Reflect.defineProperty(target, prop, desc);
    }
  };
  const proxyObject = newProxy(baseObject, handler);
  proxyCache.set(initialObject, proxyObject);
  const proxyState = [
    baseObject,
    ensureVersion,
    createSnapshot,
    addListener
  ];
  proxyStateMap.set(proxyObject, proxyState);
  Reflect.ownKeys(initialObject).forEach((key) => {
    const desc = Object.getOwnPropertyDescriptor(
      initialObject,
      key
    );
    if ("value" in desc) {
      proxyObject[key] = initialObject[key];
      delete desc.value;
      delete desc.writable;
    }
    Object.defineProperty(baseObject, key, desc);
  });
  return proxyObject;
}) => [
  // public functions
  proxyFunction,
  // shared state
  proxyStateMap,
  refSet,
  // internal things
  objectIs,
  newProxy,
  canProxy,
  shouldTrapDefineProperty,
  defaultHandlePromise,
  snapCache,
  createSnapshot,
  proxyCache,
  versionHolder
];
var [defaultProxyFunction] = buildProxyFunction();
function proxy(initialObject = {}) {
  return defaultProxyFunction(initialObject);
}
function subscribe(proxyObject, callback, notifyInSync) {
  const proxyState = proxyStateMap.get(proxyObject);
  if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production" && !proxyState) {
    console.warn("Please use proxy object");
  }
  let promise;
  const ops = [];
  const addListener = proxyState[3];
  let isListenerActive = false;
  const listener = (op) => {
    ops.push(op);
    if (notifyInSync) {
      callback(ops.splice(0));
      return;
    }
    if (!promise) {
      promise = Promise.resolve().then(() => {
        promise = void 0;
        if (isListenerActive) {
          callback(ops.splice(0));
        }
      });
    }
  };
  const removeListener = addListener(listener);
  isListenerActive = true;
  return () => {
    isListenerActive = false;
    removeListener();
  };
}
function snapshot(proxyObject, handlePromise) {
  const proxyState = proxyStateMap.get(proxyObject);
  if ((import.meta.env ? import.meta.env.MODE : void 0) !== "production" && !proxyState) {
    console.warn("Please use proxy object");
  }
  const [target, ensureVersion, createSnapshot] = proxyState;
  return createSnapshot(target, ensureVersion(), handlePromise);
}

// node_modules/@web3modal/core/dist/index.js
var o = proxy({ history: ["ConnectWallet"], view: "ConnectWallet", data: void 0 });
var W = { state: o, subscribe(e) {
  return subscribe(o, () => e(o));
}, push(e, t) {
  e !== o.view && (o.view = e, t && (o.data = t), o.history.push(e));
}, reset(e) {
  o.view = e, o.history = [e];
}, replace(e) {
  o.history.length > 1 && (o.history[o.history.length - 1] = e, o.view = e);
}, goBack() {
  if (o.history.length > 1) {
    o.history.pop();
    const [e] = o.history.slice(-1);
    o.view = e;
  }
}, setData(e) {
  o.data = e;
} };
var i = { WALLETCONNECT_DEEPLINK_CHOICE: "WALLETCONNECT_DEEPLINK_CHOICE", W3M_VERSION: "W3M_VERSION", W3M_PREFER_INJECTED_URL_FLAG: "w3mPreferInjected", RECOMMENDED_WALLET_AMOUNT: 9, isMobile() {
  return typeof window < "u" ? Boolean(window.matchMedia("(pointer:coarse)").matches || /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)) : false;
}, isAndroid() {
  return i.isMobile() && navigator.userAgent.toLowerCase().includes("android");
}, isIos() {
  const e = navigator.userAgent.toLowerCase();
  return i.isMobile() && (e.includes("iphone") || e.includes("ipad"));
}, isHttpUrl(e) {
  return e.startsWith("http://") || e.startsWith("https://");
}, isArray(e) {
  return Array.isArray(e) && e.length > 0;
}, formatNativeUrl(e, t, n) {
  if (i.isHttpUrl(e)) return this.formatUniversalUrl(e, t, n);
  let s = e;
  s.includes("://") || (s = e.replaceAll("/", "").replaceAll(":", ""), s = `${s}://`), s.endsWith("/") || (s = `${s}/`), this.setWalletConnectDeepLink(s, n);
  const a = encodeURIComponent(t);
  return `${s}wc?uri=${a}`;
}, formatUniversalUrl(e, t, n) {
  if (!i.isHttpUrl(e)) return this.formatNativeUrl(e, t, n);
  let s = e;
  s.endsWith("/") || (s = `${s}/`), this.setWalletConnectDeepLink(s, n);
  const a = encodeURIComponent(t);
  return `${s}wc?uri=${a}`;
}, async wait(e) {
  return new Promise((t) => {
    setTimeout(t, e);
  });
}, openHref(e, t) {
  window.open(e, t, "noreferrer noopener");
}, setWalletConnectDeepLink(e, t) {
  try {
    localStorage.setItem(i.WALLETCONNECT_DEEPLINK_CHOICE, JSON.stringify({ href: e, name: t }));
  } catch {
    console.info("Unable to set WalletConnect deep link");
  }
}, setWalletConnectAndroidDeepLink(e) {
  try {
    const [t] = e.split("?");
    localStorage.setItem(i.WALLETCONNECT_DEEPLINK_CHOICE, JSON.stringify({ href: t, name: "Android" }));
  } catch {
    console.info("Unable to set WalletConnect android deep link");
  }
}, removeWalletConnectDeepLink() {
  try {
    localStorage.removeItem(i.WALLETCONNECT_DEEPLINK_CHOICE);
  } catch {
    console.info("Unable to remove WalletConnect deep link");
  }
}, setWeb3ModalVersionInStorage() {
  try {
    typeof localStorage < "u" && localStorage.setItem(i.W3M_VERSION, "2.7.1");
  } catch {
    console.info("Unable to set Web3Modal version in storage");
  }
}, getWalletRouterData() {
  var e;
  const t = (e = W.state.data) == null ? void 0 : e.Wallet;
  if (!t) throw new Error('Missing "Wallet" view data');
  return t;
}, getSwitchNetworkRouterData() {
  var e;
  const t = (e = W.state.data) == null ? void 0 : e.SwitchNetwork;
  if (!t) throw new Error('Missing "SwitchNetwork" view data');
  return t;
}, isPreferInjectedFlag() {
  return typeof location < "u" ? new URLSearchParams(location.search).has(i.W3M_PREFER_INJECTED_URL_FLAG) : false;
} };
var k;
var f = { ethereumClient: void 0, setEthereumClient(e) {
  k = e;
}, client() {
  if (k) return k;
  throw new Error("ClientCtrl has no client set");
} };
var K = typeof location < "u" && (location.hostname.includes("localhost") || location.protocol.includes("https"));
var l = proxy({ enabled: K, userSessionId: "", events: [], connectedWalletId: void 0 });
var F = { state: l, subscribe(e) {
  return subscribe(l.events, () => e(snapshot(l.events[l.events.length - 1])));
}, initialize() {
  l.enabled && typeof (crypto == null ? void 0 : crypto.randomUUID) < "u" && (l.userSessionId = crypto.randomUUID());
}, setConnectedWalletId(e) {
  l.connectedWalletId = e;
}, click(e) {
  if (l.enabled) {
    const t = { type: "CLICK", name: e.name, userSessionId: l.userSessionId, timestamp: Date.now(), data: e };
    l.events.push(t);
  }
}, track(e) {
  if (l.enabled) {
    const t = { type: "TRACK", name: e.name, userSessionId: l.userSessionId, timestamp: Date.now(), data: e };
    l.events.push(t);
  }
}, view(e) {
  if (l.enabled) {
    const t = { type: "VIEW", name: e.name, userSessionId: l.userSessionId, timestamp: Date.now(), data: e };
    l.events.push(t);
  }
} };
var p = proxy({ selectedChain: void 0, chains: void 0, isCustomDesktop: false, isCustomMobile: false, isDataLoaded: false, isUiLoaded: false, isPreferInjected: false });
var b = { state: p, subscribe(e) {
  return subscribe(p, () => e(p));
}, setChains(e) {
  p.chains = e;
}, getSelectedChain() {
  const e = f.client().getNetwork().chain;
  return e && (p.selectedChain = e), p.selectedChain;
}, setSelectedChain(e) {
  p.selectedChain = e;
}, setIsCustomDesktop(e) {
  p.isCustomDesktop = e;
}, setIsCustomMobile(e) {
  p.isCustomMobile = e;
}, setIsDataLoaded(e) {
  p.isDataLoaded = e;
}, setIsUiLoaded(e) {
  p.isUiLoaded = e;
}, setIsPreferInjected(e) {
  p.isPreferInjected = e;
} };
var O = proxy({ projectId: "", mobileWallets: void 0, desktopWallets: void 0, walletImages: void 0, chainImages: void 0, tokenImages: void 0, tokenContracts: void 0, enableNetworkView: false, enableAccountView: true, enableExplorer: true, defaultChain: void 0, explorerExcludedWalletIds: void 0, explorerRecommendedWalletIds: void 0, termsOfServiceUrl: void 0, privacyPolicyUrl: void 0 });
var C = { state: O, subscribe(e) {
  return subscribe(O, () => e(O));
}, setConfig(e) {
  var t, n;
  F.initialize(), b.setIsCustomMobile(Boolean((t = e.mobileWallets) == null ? void 0 : t.length)), b.setIsCustomDesktop(Boolean((n = e.desktopWallets) == null ? void 0 : n.length)), b.setChains(f.client().chains), b.setIsPreferInjected(f.client().isInjectedProviderInstalled() && i.isPreferInjectedFlag()), e.defaultChain && b.setSelectedChain(e.defaultChain), i.setWeb3ModalVersionInStorage(), Object.assign(O, e);
} };
var J = "eip155";
var z = "https://rpc.walletconnect.com";
var G = { async getIdentity(e, t) {
  const { projectId: n } = C.state, s = `${J}:${t}`, a = `${z}/v1/identity/${e}?chainId=${s}&projectId=${n}`;
  return (await fetch(a)).json();
} };
var r = proxy({ address: void 0, profileName: void 0, profileAvatar: void 0, profileLoading: false, balanceLoading: false, balance: void 0, isConnected: false });
var q = { state: r, subscribe(e) {
  return subscribe(r, () => e(r));
}, getAccount() {
  const e = f.client().getAccount();
  r.address = e.address, r.isConnected = e.isConnected;
}, async fetchProfile(e, t) {
  var n;
  try {
    r.profileLoading = true, r.profileName = null, r.profileAvatar = null;
    const s = t ?? r.address, a = 1, c = (n = b.state.chains) == null ? void 0 : n.find((d) => d.id === a);
    if (s && c) {
      try {
        const d = await G.getIdentity(s, a);
        r.profileName = d.name, r.profileAvatar = d.avatar;
      } catch {
        const m = await f.client().fetchEnsName({ address: s, chainId: a });
        if (r.profileName = m, m) {
          const v = await f.client().fetchEnsAvatar({ name: m, chainId: a });
          r.profileAvatar = v;
        }
      }
      r.profileAvatar && await e(r.profileAvatar);
    }
  } finally {
    r.profileLoading = false;
  }
}, async fetchBalance(e) {
  try {
    const { chain: t } = f.client().getNetwork(), { tokenContracts: n } = C.state;
    let s;
    t && n && (s = n[t.id]), r.balanceLoading = true;
    const a = e ?? r.address;
    if (a) {
      const c = await f.client().fetchBalance({ address: a, token: s });
      r.balance = { amount: c.formatted, symbol: c.symbol };
    }
  } finally {
    r.balanceLoading = false;
  }
}, setAddress(e) {
  r.address = e;
}, setIsConnected(e) {
  r.isConnected = e;
}, resetBalance() {
  r.balance = void 0;
}, resetAccount() {
  r.address = void 0, r.isConnected = false, r.profileName = void 0, r.profileAvatar = void 0, r.balance = void 0;
} };
var Q = Object.defineProperty;
var S = Object.getOwnPropertySymbols;
var X = Object.prototype.hasOwnProperty;
var Y = Object.prototype.propertyIsEnumerable;
var T = (e, t, n) => t in e ? Q(e, t, { enumerable: true, configurable: true, writable: true, value: n }) : e[t] = n;
var Z = (e, t) => {
  for (var n in t || (t = {})) X.call(t, n) && T(e, n, t[n]);
  if (S) for (var n of S(t)) Y.call(t, n) && T(e, n, t[n]);
  return e;
};
var D = "https://explorer-api.walletconnect.com";
var M = "w3m";
var $ = "js-2.7.1";
async function U(e, t) {
  const n = Z({ sdkType: M, sdkVersion: $ }, t), s = new URL(e, D);
  return s.searchParams.append("projectId", C.state.projectId), Object.entries(n).forEach(([a, c]) => {
    c && s.searchParams.append(a, String(c));
  }), (await fetch(s)).json();
}
var I = { async getDesktopListings(e) {
  return U("/w3m/v1/getDesktopListings", e);
}, async getMobileListings(e) {
  return U("/w3m/v1/getMobileListings", e);
}, async getInjectedListings(e) {
  return U("/w3m/v1/getInjectedListings", e);
}, async getAllListings(e) {
  return U("/w3m/v1/getAllListings", e);
}, getWalletImageUrl(e) {
  return `${D}/w3m/v1/getWalletImage/${e}?projectId=${C.state.projectId}&sdkType=${M}&sdkVersion=${$}`;
}, getAssetImageUrl(e) {
  return `${D}/w3m/v1/getAssetImage/${e}?projectId=${C.state.projectId}&sdkType=${M}&sdkVersion=${$}`;
} };
var ee = Object.defineProperty;
var _ = Object.getOwnPropertySymbols;
var te = Object.prototype.hasOwnProperty;
var ne = Object.prototype.propertyIsEnumerable;
var x = (e, t, n) => t in e ? ee(e, t, { enumerable: true, configurable: true, writable: true, value: n }) : e[t] = n;
var se = (e, t) => {
  for (var n in t || (t = {})) te.call(t, n) && x(e, n, t[n]);
  if (_) for (var n of _(t)) ne.call(t, n) && x(e, n, t[n]);
  return e;
};
var R = i.isMobile();
var u = proxy({ wallets: { listings: [], total: 0, page: 1 }, injectedWallets: [], search: { listings: [], total: 0, page: 1 }, recomendedWallets: [] });
var de = { state: u, async getRecomendedWallets() {
  const { explorerRecommendedWalletIds: e, explorerExcludedWalletIds: t } = C.state;
  if (e === "NONE" || t === "ALL" && !e) return u.recomendedWallets;
  if (i.isArray(e)) {
    const n = { recommendedIds: e.join(",") }, { listings: s } = await I.getAllListings(n), a = Object.values(s);
    a.sort((c, d) => {
      const m = e.indexOf(c.id), v = e.indexOf(d.id);
      return m - v;
    }), u.recomendedWallets = a;
  } else {
    const n = i.isArray(t), s = { page: 1, entries: i.RECOMMENDED_WALLET_AMOUNT, version: 2, excludedIds: n ? t.join(",") : void 0 }, { listings: a } = R ? await I.getMobileListings(s) : await I.getDesktopListings(s);
    u.recomendedWallets = Object.values(a);
  }
  return u.recomendedWallets;
}, async getWallets(e) {
  const t = se({}, e), { explorerRecommendedWalletIds: n, explorerExcludedWalletIds: s } = C.state, { recomendedWallets: a } = u;
  if (s === "ALL") return u.wallets;
  a.length ? t.excludedIds = a.map((N) => N.id).join(",") : i.isArray(n) && (t.excludedIds = n.join(",")), i.isArray(s) && (t.excludedIds = [t.excludedIds, s].filter(Boolean).join(","));
  const { page: c, search: d } = e, { listings: m, total: v } = R ? await I.getMobileListings(t) : await I.getDesktopListings(t), w = Object.values(m), A = d ? "search" : "wallets";
  return u[A] = { listings: [...u[A].listings, ...w], total: v, page: c ?? 1 }, { listings: w, total: v };
}, async getInjectedWallets() {
  const { listings: e } = await I.getInjectedListings({}), t = Object.values(e);
  return u.injectedWallets = t, u.injectedWallets;
}, getWalletImageUrl(e) {
  return I.getWalletImageUrl(e);
}, getAssetImageUrl(e) {
  return I.getAssetImageUrl(e);
}, resetSearch() {
  u.search = { listings: [], total: 0, page: 1 };
} };
var E = proxy({ pairingEnabled: false, pairingUri: "", pairingError: false });
var P = { state: E, subscribe(e) {
  return subscribe(E, () => e(E));
}, setPairingUri(e) {
  E.pairingUri = e;
}, setPairingError(e) {
  E.pairingError = e;
}, setPairingEnabled(e) {
  E.pairingEnabled = e;
} };
var L = proxy({ open: false });
var pe = { state: L, subscribe(e) {
  return subscribe(L, () => e(L));
}, async open(e) {
  return new Promise((t) => {
    const { isUiLoaded: n, isDataLoaded: s, isPreferInjected: a, selectedChain: c } = b.state, { isConnected: d } = q.state, { enableNetworkView: m } = C.state;
    if (P.setPairingEnabled(true), d || i.removeWalletConnectDeepLink(), e != null && e.route) W.reset(e.route);
    else if (d) W.reset("Account");
    else if (m) W.reset("SelectNetwork");
    else if (a) {
      f.client().connectConnector("injected", c == null ? void 0 : c.id).catch((w) => console.error(w)), t();
      return;
    } else W.reset("ConnectWallet");
    const { pairingUri: v } = P.state;
    if (n && s && (v || d)) L.open = true, t();
    else {
      const w = setInterval(() => {
        const A = b.state, N = P.state;
        A.isUiLoaded && A.isDataLoaded && (N.pairingUri || d) && (clearInterval(w), L.open = true, t());
      }, 200);
    }
  });
}, close() {
  L.open = false;
} };
var re = Object.defineProperty;
var V = Object.getOwnPropertySymbols;
var ae = Object.prototype.hasOwnProperty;
var oe = Object.prototype.propertyIsEnumerable;
var B = (e, t, n) => t in e ? re(e, t, { enumerable: true, configurable: true, writable: true, value: n }) : e[t] = n;
var ie = (e, t) => {
  for (var n in t || (t = {})) ae.call(t, n) && B(e, n, t[n]);
  if (V) for (var n of V(t)) oe.call(t, n) && B(e, n, t[n]);
  return e;
};
function le() {
  return typeof matchMedia < "u" && matchMedia("(prefers-color-scheme: dark)").matches;
}
var j = proxy({ themeMode: le() ? "dark" : "light" });
var ue = { state: j, subscribe(e) {
  return subscribe(j, () => e(j));
}, setThemeConfig(e) {
  const { themeMode: t, themeVariables: n } = e;
  t && (j.themeMode = t), n && (j.themeVariables = ie({}, n));
} };
var y2 = proxy({ open: false, message: "", variant: "success" });
var ge = { state: y2, subscribe(e) {
  return subscribe(y2, () => e(y2));
}, openToast(e, t) {
  y2.open = true, y2.message = e, y2.variant = t;
}, closeToast() {
  y2.open = false;
} };

export {
  W,
  i,
  f,
  F,
  b,
  C,
  q,
  de,
  P,
  pe,
  ue,
  ge
};
//# sourceMappingURL=chunk-WEX4K2CR.js.map
