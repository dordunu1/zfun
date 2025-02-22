import {
  C,
  F,
  b,
  f,
  pe,
  ue
} from "./chunk-WEX4K2CR.js";
import "./chunk-ZKD3A47W.js";
import {
  require_react
} from "./chunk-OJK6TXMW.js";
import {
  __toESM
} from "./chunk-256EKJAK.js";

// node_modules/@web3modal/react/dist/index.js
var import_react = __toESM(require_react());
var M = Object.defineProperty;
var b2 = Object.getOwnPropertySymbols;
var S = Object.prototype.hasOwnProperty;
var I = Object.prototype.propertyIsEnumerable;
var s = (t, e, r) => e in t ? M(t, e, { enumerable: true, configurable: true, writable: true, value: r }) : t[e] = r;
var W = (t, e) => {
  for (var r in e || (e = {})) S.call(e, r) && s(t, r, e[r]);
  if (b2) for (var r of b2(e)) I.call(e, r) && s(t, r, e[r]);
  return t;
};
function ee(t) {
  const { size: e } = t;
  return import_react.default.createElement("div", { style: { width: e, height: e } }, import_react.default.createElement("w3m-qrcode", W({}, t)));
}
var T = Object.defineProperty;
var p = Object.getOwnPropertySymbols;
var V = Object.prototype.hasOwnProperty;
var k = Object.prototype.propertyIsEnumerable;
var u = (t, e, r) => e in t ? T(t, e, { enumerable: true, configurable: true, writable: true, value: r }) : t[e] = r;
var x = (t, e) => {
  for (var r in e || (e = {})) V.call(e, r) && u(t, r, e[r]);
  if (p) for (var r of p(e)) k.call(e, r) && u(t, r, e[r]);
  return t;
};
function re(t) {
  return import_react.default.createElement("w3m-core-button", x({}, t));
}
var q = Object.defineProperty;
var f2 = Object.getOwnPropertySymbols;
var z = Object.prototype.hasOwnProperty;
var B = Object.prototype.propertyIsEnumerable;
var m = (t, e, r) => e in t ? q(t, e, { enumerable: true, configurable: true, writable: true, value: r }) : t[e] = r;
var D = (t, e) => {
  for (var r in e || (e = {})) z.call(e, r) && m(t, r, e[r]);
  if (f2) for (var r of f2(e)) B.call(e, r) && m(t, r, e[r]);
  return t;
};
function L(t) {
  return import_react.default.createElement("w3m-modal", D({}, t));
}
var v = Object.getOwnPropertySymbols;
var N = Object.prototype.hasOwnProperty;
var Q = Object.prototype.propertyIsEnumerable;
var U = (t, e) => {
  var r = {};
  for (var o in t) N.call(t, o) && e.indexOf(o) < 0 && (r[o] = t[o]);
  if (t != null && v) for (var o of v(t)) e.indexOf(o) < 0 && Q.call(t, o) && (r[o] = t[o]);
  return r;
};
function A(t) {
  var e = t, { ethereumClient: r } = e, o = U(e, ["ethereumClient"]);
  const i = (0, import_react.useCallback)(async () => {
    ue.setThemeConfig(o), r && f.setEthereumClient(r), C.setConfig(o), await import("./dist-XI73BVL6.js"), b.setIsUiLoaded(true);
  }, [r, o]);
  return (0, import_react.useEffect)(() => {
    i();
  }, [i]), import_react.default.createElement(L, null);
}
var te = (0, import_react.memo)(A);
var F2 = Object.defineProperty;
var y = Object.getOwnPropertySymbols;
var G = Object.prototype.hasOwnProperty;
var H = Object.prototype.propertyIsEnumerable;
var O = (t, e, r) => e in t ? F2(t, e, { enumerable: true, configurable: true, writable: true, value: r }) : t[e] = r;
var J = (t, e) => {
  for (var r in e || (e = {})) G.call(e, r) && O(t, r, e[r]);
  if (y) for (var r of y(e)) H.call(e, r) && O(t, r, e[r]);
  return t;
};
function oe(t) {
  return import_react.default.createElement("w3m-network-switch", J({}, t));
}
var K = Object.defineProperty;
var h = Object.getOwnPropertySymbols;
var R = Object.prototype.hasOwnProperty;
var X = Object.prototype.propertyIsEnumerable;
var w = (t, e, r) => e in t ? K(t, e, { enumerable: true, configurable: true, writable: true, value: r }) : t[e] = r;
var Y = (t, e) => {
  for (var r in e || (e = {})) R.call(e, r) && w(t, r, e[r]);
  if (h) for (var r of h(e)) X.call(e, r) && w(t, r, e[r]);
  return t;
};
function ne() {
  const [t, e] = (0, import_react.useState)(pe.state);
  return (0, import_react.useEffect)(() => {
    const r = pe.subscribe((o) => e(Y({}, o)));
    return () => {
      r();
    };
  }, []), { isOpen: t.open, open: pe.open, close: pe.close, setDefaultChain: b.setSelectedChain };
}
function ae(t) {
  (0, import_react.useEffect)(() => {
    const e = F.subscribe(t);
    return () => {
      e();
    };
  }, []);
}
function le() {
  const [t, e] = (0, import_react.useState)({ themeMode: ue.state.themeMode, themeVariables: ue.state.themeVariables });
  return (0, import_react.useEffect)(() => {
    const r = ue.subscribe((o) => e({ themeMode: o.themeMode, themeVariables: o.themeVariables }));
    return () => {
      r();
    };
  }, []), { theme: t, setTheme: ue.setThemeConfig };
}
export {
  ee as W3mQrCode,
  re as Web3Button,
  te as Web3Modal,
  oe as Web3NetworkSwitch,
  ne as useWeb3Modal,
  ae as useWeb3ModalEvents,
  le as useWeb3ModalTheme
};
//# sourceMappingURL=@web3modal_react.js.map
