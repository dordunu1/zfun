// node_modules/proxy-compare/dist/index.modern.js
var e = Symbol();
var t = Symbol();
var s = Object.getPrototypeOf;
var c = /* @__PURE__ */ new WeakMap();
var l = (e2) => e2 && (c.has(e2) ? c.get(e2) : s(e2) === Object.prototype || s(e2) === Array.prototype);
var y = (e2) => l(e2) && e2[t] || null;
var h = (e2, t2 = true) => {
  c.set(e2, t2);
};

export {
  y,
  h
};
//# sourceMappingURL=chunk-ZKD3A47W.js.map
