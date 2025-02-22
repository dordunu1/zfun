import {
  h,
  y
} from "./chunk-ZKD3A47W.js";

// node_modules/@walletconnect/modal-core/node_modules/valtio/esm/vanilla.mjs
var isObject = (x) => typeof x === "object" && x !== null;
var proxyStateMap = /* @__PURE__ */ new WeakMap();
var refSet = /* @__PURE__ */ new WeakSet();
var buildProxyFunction = (objectIs = Object.is, newProxy = (target, handler) => new Proxy(target, handler), canProxy = (x) => isObject(x) && !refSet.has(x) && (Array.isArray(x) || !(Symbol.iterator in x)) && !(x instanceof WeakMap) && !(x instanceof WeakSet) && !(x instanceof Error) && !(x instanceof Number) && !(x instanceof Date) && !(x instanceof String) && !(x instanceof RegExp) && !(x instanceof ArrayBuffer), defaultHandlePromise = (promise) => {
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
      if (hasPrevValue && (objectIs(prevValue, value) || proxyCache.has(value) && objectIs(prevValue, proxyCache.get(value)))) {
        return true;
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
      Reflect.set(target, prop, nextValue, receiver);
      notifyUpdate(["set", [prop], value, prevValue]);
      return true;
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

// node_modules/@walletconnect/modal-core/dist/index.js
var o = proxy({ history: ["ConnectWallet"], view: "ConnectWallet", data: void 0 });
var T = { state: o, subscribe(e) {
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
var a = { WALLETCONNECT_DEEPLINK_CHOICE: "WALLETCONNECT_DEEPLINK_CHOICE", WCM_VERSION: "WCM_VERSION", RECOMMENDED_WALLET_AMOUNT: 9, isMobile() {
  return typeof window < "u" ? Boolean(window.matchMedia("(pointer:coarse)").matches || /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)) : false;
}, isAndroid() {
  return a.isMobile() && navigator.userAgent.toLowerCase().includes("android");
}, isIos() {
  const e = navigator.userAgent.toLowerCase();
  return a.isMobile() && (e.includes("iphone") || e.includes("ipad"));
}, isHttpUrl(e) {
  return e.startsWith("http://") || e.startsWith("https://");
}, isArray(e) {
  return Array.isArray(e) && e.length > 0;
}, formatNativeUrl(e, t, s) {
  if (a.isHttpUrl(e)) return this.formatUniversalUrl(e, t, s);
  let n = e;
  n.includes("://") || (n = e.replaceAll("/", "").replaceAll(":", ""), n = `${n}://`), n.endsWith("/") || (n = `${n}/`), this.setWalletConnectDeepLink(n, s);
  const i = encodeURIComponent(t);
  return `${n}wc?uri=${i}`;
}, formatUniversalUrl(e, t, s) {
  if (!a.isHttpUrl(e)) return this.formatNativeUrl(e, t, s);
  let n = e;
  n.endsWith("/") || (n = `${n}/`), this.setWalletConnectDeepLink(n, s);
  const i = encodeURIComponent(t);
  return `${n}wc?uri=${i}`;
}, async wait(e) {
  return new Promise((t) => {
    setTimeout(t, e);
  });
}, openHref(e, t) {
  window.open(e, t, "noreferrer noopener");
}, setWalletConnectDeepLink(e, t) {
  try {
    localStorage.setItem(a.WALLETCONNECT_DEEPLINK_CHOICE, JSON.stringify({ href: e, name: t }));
  } catch {
    console.info("Unable to set WalletConnect deep link");
  }
}, setWalletConnectAndroidDeepLink(e) {
  try {
    const [t] = e.split("?");
    localStorage.setItem(a.WALLETCONNECT_DEEPLINK_CHOICE, JSON.stringify({ href: t, name: "Android" }));
  } catch {
    console.info("Unable to set WalletConnect android deep link");
  }
}, removeWalletConnectDeepLink() {
  try {
    localStorage.removeItem(a.WALLETCONNECT_DEEPLINK_CHOICE);
  } catch {
    console.info("Unable to remove WalletConnect deep link");
  }
}, setModalVersionInStorage() {
  try {
    typeof localStorage < "u" && localStorage.setItem(a.WCM_VERSION, "2.6.2");
  } catch {
    console.info("Unable to set Web3Modal version in storage");
  }
}, getWalletRouterData() {
  var e;
  const t = (e = T.state.data) == null ? void 0 : e.Wallet;
  if (!t) throw new Error('Missing "Wallet" view data');
  return t;
} };
var _ = typeof location < "u" && (location.hostname.includes("localhost") || location.protocol.includes("https"));
var r = proxy({ enabled: _, userSessionId: "", events: [], connectedWalletId: void 0 });
var R = { state: r, subscribe(e) {
  return subscribe(r.events, () => e(snapshot(r.events[r.events.length - 1])));
}, initialize() {
  r.enabled && typeof (crypto == null ? void 0 : crypto.randomUUID) < "u" && (r.userSessionId = crypto.randomUUID());
}, setConnectedWalletId(e) {
  r.connectedWalletId = e;
}, click(e) {
  if (r.enabled) {
    const t = { type: "CLICK", name: e.name, userSessionId: r.userSessionId, timestamp: Date.now(), data: e };
    r.events.push(t);
  }
}, track(e) {
  if (r.enabled) {
    const t = { type: "TRACK", name: e.name, userSessionId: r.userSessionId, timestamp: Date.now(), data: e };
    r.events.push(t);
  }
}, view(e) {
  if (r.enabled) {
    const t = { type: "VIEW", name: e.name, userSessionId: r.userSessionId, timestamp: Date.now(), data: e };
    r.events.push(t);
  }
} };
var c = proxy({ chains: void 0, walletConnectUri: void 0, isAuth: false, isCustomDesktop: false, isCustomMobile: false, isDataLoaded: false, isUiLoaded: false });
var p = { state: c, subscribe(e) {
  return subscribe(c, () => e(c));
}, setChains(e) {
  c.chains = e;
}, setWalletConnectUri(e) {
  c.walletConnectUri = e;
}, setIsCustomDesktop(e) {
  c.isCustomDesktop = e;
}, setIsCustomMobile(e) {
  c.isCustomMobile = e;
}, setIsDataLoaded(e) {
  c.isDataLoaded = e;
}, setIsUiLoaded(e) {
  c.isUiLoaded = e;
}, setIsAuth(e) {
  c.isAuth = e;
} };
var W = proxy({ projectId: "", mobileWallets: void 0, desktopWallets: void 0, walletImages: void 0, chains: void 0, enableAuthMode: false, enableExplorer: true, explorerExcludedWalletIds: void 0, explorerRecommendedWalletIds: void 0, termsOfServiceUrl: void 0, privacyPolicyUrl: void 0 });
var y2 = { state: W, subscribe(e) {
  return subscribe(W, () => e(W));
}, setConfig(e) {
  var t, s;
  R.initialize(), p.setChains(e.chains), p.setIsAuth(Boolean(e.enableAuthMode)), p.setIsCustomMobile(Boolean((t = e.mobileWallets) == null ? void 0 : t.length)), p.setIsCustomDesktop(Boolean((s = e.desktopWallets) == null ? void 0 : s.length)), a.setModalVersionInStorage(), Object.assign(W, e);
} };
var V = Object.defineProperty;
var D = Object.getOwnPropertySymbols;
var H = Object.prototype.hasOwnProperty;
var B = Object.prototype.propertyIsEnumerable;
var M = (e, t, s) => t in e ? V(e, t, { enumerable: true, configurable: true, writable: true, value: s }) : e[t] = s;
var K = (e, t) => {
  for (var s in t || (t = {})) H.call(t, s) && M(e, s, t[s]);
  if (D) for (var s of D(t)) B.call(t, s) && M(e, s, t[s]);
  return e;
};
var L = "https://explorer-api.walletconnect.com";
var E = "wcm";
var O = "js-2.6.2";
async function w(e, t) {
  const s = K({ sdkType: E, sdkVersion: O }, t), n = new URL(e, L);
  return n.searchParams.append("projectId", y2.state.projectId), Object.entries(s).forEach(([i, l]) => {
    l && n.searchParams.append(i, String(l));
  }), (await fetch(n)).json();
}
var m = { async getDesktopListings(e) {
  return w("/w3m/v1/getDesktopListings", e);
}, async getMobileListings(e) {
  return w("/w3m/v1/getMobileListings", e);
}, async getInjectedListings(e) {
  return w("/w3m/v1/getInjectedListings", e);
}, async getAllListings(e) {
  return w("/w3m/v1/getAllListings", e);
}, getWalletImageUrl(e) {
  return `${L}/w3m/v1/getWalletImage/${e}?projectId=${y2.state.projectId}&sdkType=${E}&sdkVersion=${O}`;
}, getAssetImageUrl(e) {
  return `${L}/w3m/v1/getAssetImage/${e}?projectId=${y2.state.projectId}&sdkType=${E}&sdkVersion=${O}`;
} };
var z = Object.defineProperty;
var j = Object.getOwnPropertySymbols;
var J = Object.prototype.hasOwnProperty;
var q = Object.prototype.propertyIsEnumerable;
var k = (e, t, s) => t in e ? z(e, t, { enumerable: true, configurable: true, writable: true, value: s }) : e[t] = s;
var F = (e, t) => {
  for (var s in t || (t = {})) J.call(t, s) && k(e, s, t[s]);
  if (j) for (var s of j(t)) q.call(t, s) && k(e, s, t[s]);
  return e;
};
var N = a.isMobile();
var d = proxy({ wallets: { listings: [], total: 0, page: 1 }, search: { listings: [], total: 0, page: 1 }, recomendedWallets: [] });
var te = { state: d, async getRecomendedWallets() {
  const { explorerRecommendedWalletIds: e, explorerExcludedWalletIds: t } = y2.state;
  if (e === "NONE" || t === "ALL" && !e) return d.recomendedWallets;
  if (a.isArray(e)) {
    const s = { recommendedIds: e.join(",") }, { listings: n } = await m.getAllListings(s), i = Object.values(n);
    i.sort((l, v) => {
      const b = e.indexOf(l.id), f = e.indexOf(v.id);
      return b - f;
    }), d.recomendedWallets = i;
  } else {
    const { chains: s, isAuth: n } = p.state, i = s == null ? void 0 : s.join(","), l = a.isArray(t), v = { page: 1, sdks: n ? "auth_v1" : void 0, entries: a.RECOMMENDED_WALLET_AMOUNT, chains: i, version: 2, excludedIds: l ? t.join(",") : void 0 }, { listings: b } = N ? await m.getMobileListings(v) : await m.getDesktopListings(v);
    d.recomendedWallets = Object.values(b);
  }
  return d.recomendedWallets;
}, async getWallets(e) {
  const t = F({}, e), { explorerRecommendedWalletIds: s, explorerExcludedWalletIds: n } = y2.state, { recomendedWallets: i } = d;
  if (n === "ALL") return d.wallets;
  i.length ? t.excludedIds = i.map((x) => x.id).join(",") : a.isArray(s) && (t.excludedIds = s.join(",")), a.isArray(n) && (t.excludedIds = [t.excludedIds, n].filter(Boolean).join(",")), p.state.isAuth && (t.sdks = "auth_v1");
  const { page: l, search: v } = e, { listings: b, total: f } = N ? await m.getMobileListings(t) : await m.getDesktopListings(t), A = Object.values(b), U = v ? "search" : "wallets";
  return d[U] = { listings: [...d[U].listings, ...A], total: f, page: l ?? 1 }, { listings: A, total: f };
}, getWalletImageUrl(e) {
  return m.getWalletImageUrl(e);
}, getAssetImageUrl(e) {
  return m.getAssetImageUrl(e);
}, resetSearch() {
  d.search = { listings: [], total: 0, page: 1 };
} };
var I = proxy({ open: false });
var se = { state: I, subscribe(e) {
  return subscribe(I, () => e(I));
}, async open(e) {
  return new Promise((t) => {
    const { isUiLoaded: s, isDataLoaded: n } = p.state;
    if (a.removeWalletConnectDeepLink(), p.setWalletConnectUri(e == null ? void 0 : e.uri), p.setChains(e == null ? void 0 : e.chains), T.reset("ConnectWallet"), s && n) I.open = true, t();
    else {
      const i = setInterval(() => {
        const l = p.state;
        l.isUiLoaded && l.isDataLoaded && (clearInterval(i), I.open = true, t());
      }, 200);
    }
  });
}, close() {
  I.open = false;
} };
var G = Object.defineProperty;
var $ = Object.getOwnPropertySymbols;
var Q = Object.prototype.hasOwnProperty;
var X = Object.prototype.propertyIsEnumerable;
var S = (e, t, s) => t in e ? G(e, t, { enumerable: true, configurable: true, writable: true, value: s }) : e[t] = s;
var Y = (e, t) => {
  for (var s in t || (t = {})) Q.call(t, s) && S(e, s, t[s]);
  if ($) for (var s of $(t)) X.call(t, s) && S(e, s, t[s]);
  return e;
};
function Z() {
  return typeof matchMedia < "u" && matchMedia("(prefers-color-scheme: dark)").matches;
}
var C = proxy({ themeMode: Z() ? "dark" : "light" });
var ne = { state: C, subscribe(e) {
  return subscribe(C, () => e(C));
}, setThemeConfig(e) {
  const { themeMode: t, themeVariables: s } = e;
  t && (C.themeMode = t), s && (C.themeVariables = Y({}, s));
} };
var g = proxy({ open: false, message: "", variant: "success" });
var oe = { state: g, subscribe(e) {
  return subscribe(g, () => e(g));
}, openToast(e, t) {
  g.open = true, g.message = e, g.variant = t;
}, closeToast() {
  g.open = false;
} };

export {
  T,
  a,
  R,
  p,
  y2 as y,
  te,
  se,
  ne,
  oe
};
//# sourceMappingURL=chunk-XK22M6T2.js.map
