import {
  C,
  concat,
  detect,
  fromString,
  require_binary,
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
  require_wipe,
  require_x25519,
  toString
} from "./chunk-M7NQJYYH.js";
import {
  __commonJS,
  __esm,
  __export,
  __reExport,
  __toCommonJS,
  __toESM
} from "./chunk-256EKJAK.js";

// node_modules/events/events.js
var require_events = __commonJS({
  "node_modules/events/events.js"(exports, module) {
    "use strict";
    var R2 = typeof Reflect === "object" ? Reflect : null;
    var ReflectApply = R2 && typeof R2.apply === "function" ? R2.apply : function ReflectApply2(target, receiver, args) {
      return Function.prototype.apply.call(target, receiver, args);
    };
    var ReflectOwnKeys;
    if (R2 && typeof R2.ownKeys === "function") {
      ReflectOwnKeys = R2.ownKeys;
    } else if (Object.getOwnPropertySymbols) {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
      };
    } else {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target);
      };
    }
    function ProcessEmitWarning(warning) {
      if (console && console.warn) console.warn(warning);
    }
    var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
      return value !== value;
    };
    function EventEmitter3() {
      EventEmitter3.init.call(this);
    }
    module.exports = EventEmitter3;
    module.exports.once = once;
    EventEmitter3.EventEmitter = EventEmitter3;
    EventEmitter3.prototype._events = void 0;
    EventEmitter3.prototype._eventsCount = 0;
    EventEmitter3.prototype._maxListeners = void 0;
    var defaultMaxListeners = 10;
    function checkListener(listener) {
      if (typeof listener !== "function") {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
    }
    Object.defineProperty(EventEmitter3, "defaultMaxListeners", {
      enumerable: true,
      get: function() {
        return defaultMaxListeners;
      },
      set: function(arg) {
        if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
        }
        defaultMaxListeners = arg;
      }
    });
    EventEmitter3.init = function() {
      if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
      }
      this._maxListeners = this._maxListeners || void 0;
    };
    EventEmitter3.prototype.setMaxListeners = function setMaxListeners(n4) {
      if (typeof n4 !== "number" || n4 < 0 || NumberIsNaN(n4)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n4 + ".");
      }
      this._maxListeners = n4;
      return this;
    };
    function _getMaxListeners(that) {
      if (that._maxListeners === void 0)
        return EventEmitter3.defaultMaxListeners;
      return that._maxListeners;
    }
    EventEmitter3.prototype.getMaxListeners = function getMaxListeners() {
      return _getMaxListeners(this);
    };
    EventEmitter3.prototype.emit = function emit(type) {
      var args = [];
      for (var i3 = 1; i3 < arguments.length; i3++) args.push(arguments[i3]);
      var doError = type === "error";
      var events = this._events;
      if (events !== void 0)
        doError = doError && events.error === void 0;
      else if (!doError)
        return false;
      if (doError) {
        var er3;
        if (args.length > 0)
          er3 = args[0];
        if (er3 instanceof Error) {
          throw er3;
        }
        var err = new Error("Unhandled error." + (er3 ? " (" + er3.message + ")" : ""));
        err.context = er3;
        throw err;
      }
      var handler = events[type];
      if (handler === void 0)
        return false;
      if (typeof handler === "function") {
        ReflectApply(handler, this, args);
      } else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i3 = 0; i3 < len; ++i3)
          ReflectApply(listeners[i3], this, args);
      }
      return true;
    };
    function _addListener(target, type, listener, prepend) {
      var m5;
      var events;
      var existing;
      checkListener(listener);
      events = target._events;
      if (events === void 0) {
        events = target._events = /* @__PURE__ */ Object.create(null);
        target._eventsCount = 0;
      } else {
        if (events.newListener !== void 0) {
          target.emit(
            "newListener",
            type,
            listener.listener ? listener.listener : listener
          );
          events = target._events;
        }
        existing = events[type];
      }
      if (existing === void 0) {
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === "function") {
          existing = events[type] = prepend ? [listener, existing] : [existing, listener];
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
        m5 = _getMaxListeners(target);
        if (m5 > 0 && existing.length > m5 && !existing.warned) {
          existing.warned = true;
          var w7 = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
          w7.name = "MaxListenersExceededWarning";
          w7.emitter = target;
          w7.type = type;
          w7.count = existing.length;
          ProcessEmitWarning(w7);
        }
      }
      return target;
    }
    EventEmitter3.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };
    EventEmitter3.prototype.on = EventEmitter3.prototype.addListener;
    EventEmitter3.prototype.prependListener = function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };
    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0)
          return this.listener.call(this.target);
        return this.listener.apply(this.target, arguments);
      }
    }
    function _onceWrap(target, type, listener) {
      var state = { fired: false, wrapFn: void 0, target, type, listener };
      var wrapped = onceWrapper.bind(state);
      wrapped.listener = listener;
      state.wrapFn = wrapped;
      return wrapped;
    }
    EventEmitter3.prototype.once = function once2(type, listener) {
      checkListener(listener);
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter3.prototype.prependOnceListener = function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter3.prototype.removeListener = function removeListener(type, listener) {
      var list, events, position, i3, originalListener;
      checkListener(listener);
      events = this._events;
      if (events === void 0)
        return this;
      list = events[type];
      if (list === void 0)
        return this;
      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = /* @__PURE__ */ Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit("removeListener", type, list.listener || listener);
        }
      } else if (typeof list !== "function") {
        position = -1;
        for (i3 = list.length - 1; i3 >= 0; i3--) {
          if (list[i3] === listener || list[i3].listener === listener) {
            originalListener = list[i3].listener;
            position = i3;
            break;
          }
        }
        if (position < 0)
          return this;
        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }
        if (list.length === 1)
          events[type] = list[0];
        if (events.removeListener !== void 0)
          this.emit("removeListener", type, originalListener || listener);
      }
      return this;
    };
    EventEmitter3.prototype.off = EventEmitter3.prototype.removeListener;
    EventEmitter3.prototype.removeAllListeners = function removeAllListeners(type) {
      var listeners, events, i3;
      events = this._events;
      if (events === void 0)
        return this;
      if (events.removeListener === void 0) {
        if (arguments.length === 0) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== void 0) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else
            delete events[type];
        }
        return this;
      }
      if (arguments.length === 0) {
        var keys2 = Object.keys(events);
        var key;
        for (i3 = 0; i3 < keys2.length; ++i3) {
          key = keys2[i3];
          if (key === "removeListener") continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
        return this;
      }
      listeners = events[type];
      if (typeof listeners === "function") {
        this.removeListener(type, listeners);
      } else if (listeners !== void 0) {
        for (i3 = listeners.length - 1; i3 >= 0; i3--) {
          this.removeListener(type, listeners[i3]);
        }
      }
      return this;
    };
    function _listeners(target, type, unwrap) {
      var events = target._events;
      if (events === void 0)
        return [];
      var evlistener = events[type];
      if (evlistener === void 0)
        return [];
      if (typeof evlistener === "function")
        return unwrap ? [evlistener.listener || evlistener] : [evlistener];
      return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }
    EventEmitter3.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };
    EventEmitter3.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };
    EventEmitter3.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === "function") {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };
    EventEmitter3.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;
      if (events !== void 0) {
        var evlistener = events[type];
        if (typeof evlistener === "function") {
          return 1;
        } else if (evlistener !== void 0) {
          return evlistener.length;
        }
      }
      return 0;
    }
    EventEmitter3.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };
    function arrayClone(arr, n4) {
      var copy = new Array(n4);
      for (var i3 = 0; i3 < n4; ++i3)
        copy[i3] = arr[i3];
      return copy;
    }
    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++)
        list[index] = list[index + 1];
      list.pop();
    }
    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i3 = 0; i3 < ret.length; ++i3) {
        ret[i3] = arr[i3].listener || arr[i3];
      }
      return ret;
    }
    function once(emitter, name) {
      return new Promise(function(resolve, reject) {
        function errorListener(err) {
          emitter.removeListener(name, resolver);
          reject(err);
        }
        function resolver() {
          if (typeof emitter.removeListener === "function") {
            emitter.removeListener("error", errorListener);
          }
          resolve([].slice.call(arguments));
        }
        ;
        eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
        if (name !== "error") {
          addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
        }
      });
    }
    function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
      if (typeof emitter.on === "function") {
        eventTargetAgnosticAddListener(emitter, "error", handler, flags);
      }
    }
    function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
      if (typeof emitter.on === "function") {
        if (flags.once) {
          emitter.once(name, listener);
        } else {
          emitter.on(name, listener);
        }
      } else if (typeof emitter.addEventListener === "function") {
        emitter.addEventListener(name, function wrapListener(arg) {
          if (flags.once) {
            emitter.removeEventListener(name, wrapListener);
          }
          listener(arg);
        });
      } else {
        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
      }
    }
  }
});

// node_modules/@walletconnect/ethereum-provider/node_modules/query-string/index.js
var require_query_string = __commonJS({
  "node_modules/@walletconnect/ethereum-provider/node_modules/query-string/index.js"(exports) {
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
        return keysSorter(Object.keys(input)).sort((a3, b6) => Number(a3) - Number(b6)).map((key) => input[key]);
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
    function parse5(query, options) {
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
          for (const k7 of Object.keys(value)) {
            value[k7] = parseValue(value[k7], options);
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
    exports.parse = parse5;
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
      const keys2 = Object.keys(objectCopy);
      if (options.sort !== false) {
        keys2.sort(options.sort);
      }
      return keys2.map((key) => {
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
      }).filter((x3) => x3.length > 0).join("&");
    };
    exports.parseUrl = (url, options) => {
      options = Object.assign({
        decode: true
      }, options);
      const [url_, hash] = splitOnFirst(url, "#");
      return Object.assign(
        {
          url: url_.split("?")[0] || "",
          query: parse5(extract(url), options)
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

// node_modules/@walletconnect/heartbeat/node_modules/tslib/tslib.es6.js
var tslib_es6_exports = {};
__export(tslib_es6_exports, {
  __assign: () => __assign,
  __asyncDelegator: () => __asyncDelegator,
  __asyncGenerator: () => __asyncGenerator,
  __asyncValues: () => __asyncValues,
  __await: () => __await,
  __awaiter: () => __awaiter,
  __classPrivateFieldGet: () => __classPrivateFieldGet,
  __classPrivateFieldSet: () => __classPrivateFieldSet,
  __createBinding: () => __createBinding,
  __decorate: () => __decorate,
  __exportStar: () => __exportStar,
  __extends: () => __extends,
  __generator: () => __generator,
  __importDefault: () => __importDefault,
  __importStar: () => __importStar,
  __makeTemplateObject: () => __makeTemplateObject,
  __metadata: () => __metadata,
  __param: () => __param,
  __read: () => __read,
  __rest: () => __rest,
  __spread: () => __spread,
  __spreadArrays: () => __spreadArrays,
  __values: () => __values
});
function __extends(d3, b6) {
  extendStatics(d3, b6);
  function __() {
    this.constructor = d3;
  }
  d3.prototype = b6 === null ? Object.create(b6) : (__.prototype = b6.prototype, new __());
}
function __rest(s2, e2) {
  var t = {};
  for (var p7 in s2) if (Object.prototype.hasOwnProperty.call(s2, p7) && e2.indexOf(p7) < 0)
    t[p7] = s2[p7];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i3 = 0, p7 = Object.getOwnPropertySymbols(s2); i3 < p7.length; i3++) {
      if (e2.indexOf(p7[i3]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p7[i3]))
        t[p7[i3]] = s2[p7[i3]];
    }
  return t;
}
function __decorate(decorators, target, key, desc) {
  var c5 = arguments.length, r2 = c5 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d3;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r2 = Reflect.decorate(decorators, target, key, desc);
  else for (var i3 = decorators.length - 1; i3 >= 0; i3--) if (d3 = decorators[i3]) r2 = (c5 < 3 ? d3(r2) : c5 > 3 ? d3(target, key, r2) : d3(target, key)) || r2;
  return c5 > 3 && r2 && Object.defineProperty(target, key, r2), r2;
}
function __param(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P4, generator) {
  function adopt(value) {
    return value instanceof P4 ? value : new P4(function(resolve) {
      resolve(value);
    });
  }
  return new (P4 || (P4 = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e2) {
        reject(e2);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e2) {
        reject(e2);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _6 = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f5, y7, t, g7;
  return g7 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g7[Symbol.iterator] = function() {
    return this;
  }), g7;
  function verb(n4) {
    return function(v5) {
      return step([n4, v5]);
    };
  }
  function step(op) {
    if (f5) throw new TypeError("Generator is already executing.");
    while (_6) try {
      if (f5 = 1, y7 && (t = op[0] & 2 ? y7["return"] : op[0] ? y7["throw"] || ((t = y7["return"]) && t.call(y7), 0) : y7.next) && !(t = t.call(y7, op[1])).done) return t;
      if (y7 = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _6.label++;
          return { value: op[1], done: false };
        case 5:
          _6.label++;
          y7 = op[1];
          op = [0];
          continue;
        case 7:
          op = _6.ops.pop();
          _6.trys.pop();
          continue;
        default:
          if (!(t = _6.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _6 = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _6.label = op[1];
            break;
          }
          if (op[0] === 6 && _6.label < t[1]) {
            _6.label = t[1];
            t = op;
            break;
          }
          if (t && _6.label < t[2]) {
            _6.label = t[2];
            _6.ops.push(op);
            break;
          }
          if (t[2]) _6.ops.pop();
          _6.trys.pop();
          continue;
      }
      op = body.call(thisArg, _6);
    } catch (e2) {
      op = [6, e2];
      y7 = 0;
    } finally {
      f5 = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __createBinding(o3, m5, k7, k22) {
  if (k22 === void 0) k22 = k7;
  o3[k22] = m5[k7];
}
function __exportStar(m5, exports) {
  for (var p7 in m5) if (p7 !== "default" && !exports.hasOwnProperty(p7)) exports[p7] = m5[p7];
}
function __values(o3) {
  var s2 = typeof Symbol === "function" && Symbol.iterator, m5 = s2 && o3[s2], i3 = 0;
  if (m5) return m5.call(o3);
  if (o3 && typeof o3.length === "number") return {
    next: function() {
      if (o3 && i3 >= o3.length) o3 = void 0;
      return { value: o3 && o3[i3++], done: !o3 };
    }
  };
  throw new TypeError(s2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o3, n4) {
  var m5 = typeof Symbol === "function" && o3[Symbol.iterator];
  if (!m5) return o3;
  var i3 = m5.call(o3), r2, ar2 = [], e2;
  try {
    while ((n4 === void 0 || n4-- > 0) && !(r2 = i3.next()).done) ar2.push(r2.value);
  } catch (error) {
    e2 = { error };
  } finally {
    try {
      if (r2 && !r2.done && (m5 = i3["return"])) m5.call(i3);
    } finally {
      if (e2) throw e2.error;
    }
  }
  return ar2;
}
function __spread() {
  for (var ar2 = [], i3 = 0; i3 < arguments.length; i3++)
    ar2 = ar2.concat(__read(arguments[i3]));
  return ar2;
}
function __spreadArrays() {
  for (var s2 = 0, i3 = 0, il = arguments.length; i3 < il; i3++) s2 += arguments[i3].length;
  for (var r2 = Array(s2), k7 = 0, i3 = 0; i3 < il; i3++)
    for (var a3 = arguments[i3], j4 = 0, jl = a3.length; j4 < jl; j4++, k7++)
      r2[k7] = a3[j4];
  return r2;
}
function __await(v5) {
  return this instanceof __await ? (this.v = v5, this) : new __await(v5);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g7 = generator.apply(thisArg, _arguments || []), i3, q3 = [];
  return i3 = {}, verb("next"), verb("throw"), verb("return"), i3[Symbol.asyncIterator] = function() {
    return this;
  }, i3;
  function verb(n4) {
    if (g7[n4]) i3[n4] = function(v5) {
      return new Promise(function(a3, b6) {
        q3.push([n4, v5, a3, b6]) > 1 || resume(n4, v5);
      });
    };
  }
  function resume(n4, v5) {
    try {
      step(g7[n4](v5));
    } catch (e2) {
      settle(q3[0][3], e2);
    }
  }
  function step(r2) {
    r2.value instanceof __await ? Promise.resolve(r2.value.v).then(fulfill, reject) : settle(q3[0][2], r2);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f5, v5) {
    if (f5(v5), q3.shift(), q3.length) resume(q3[0][0], q3[0][1]);
  }
}
function __asyncDelegator(o3) {
  var i3, p7;
  return i3 = {}, verb("next"), verb("throw", function(e2) {
    throw e2;
  }), verb("return"), i3[Symbol.iterator] = function() {
    return this;
  }, i3;
  function verb(n4, f5) {
    i3[n4] = o3[n4] ? function(v5) {
      return (p7 = !p7) ? { value: __await(o3[n4](v5)), done: n4 === "return" } : f5 ? f5(v5) : v5;
    } : f5;
  }
}
function __asyncValues(o3) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m5 = o3[Symbol.asyncIterator], i3;
  return m5 ? m5.call(o3) : (o3 = typeof __values === "function" ? __values(o3) : o3[Symbol.iterator](), i3 = {}, verb("next"), verb("throw"), verb("return"), i3[Symbol.asyncIterator] = function() {
    return this;
  }, i3);
  function verb(n4) {
    i3[n4] = o3[n4] && function(v5) {
      return new Promise(function(resolve, reject) {
        v5 = o3[n4](v5), settle(resolve, reject, v5.done, v5.value);
      });
    };
  }
  function settle(resolve, reject, d3, v5) {
    Promise.resolve(v5).then(function(v6) {
      resolve({ value: v6, done: d3 });
    }, reject);
  }
}
function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", { value: raw });
  } else {
    cooked.raw = raw;
  }
  return cooked;
}
function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) {
    for (var k7 in mod) if (Object.hasOwnProperty.call(mod, k7)) result[k7] = mod[k7];
  }
  result.default = mod;
  return result;
}
function __importDefault(mod) {
  return mod && mod.__esModule ? mod : { default: mod };
}
function __classPrivateFieldGet(receiver, privateMap) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }
  return privateMap.get(receiver);
}
function __classPrivateFieldSet(receiver, privateMap, value) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to set private field on non-instance");
  }
  privateMap.set(receiver, value);
  return value;
}
var extendStatics, __assign;
var init_tslib_es6 = __esm({
  "node_modules/@walletconnect/heartbeat/node_modules/tslib/tslib.es6.js"() {
    extendStatics = function(d3, b6) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d4, b7) {
        d4.__proto__ = b7;
      } || function(d4, b7) {
        for (var p7 in b7) if (b7.hasOwnProperty(p7)) d4[p7] = b7[p7];
      };
      return extendStatics(d3, b6);
    };
    __assign = function() {
      __assign = Object.assign || function __assign3(t) {
        for (var s2, i3 = 1, n4 = arguments.length; i3 < n4; i3++) {
          s2 = arguments[i3];
          for (var p7 in s2) if (Object.prototype.hasOwnProperty.call(s2, p7)) t[p7] = s2[p7];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
  }
});

// node_modules/@walletconnect/events/dist/esm/events.js
var IEvents;
var init_events = __esm({
  "node_modules/@walletconnect/events/dist/esm/events.js"() {
    IEvents = class {
    };
  }
});

// node_modules/@walletconnect/events/dist/esm/index.js
var esm_exports = {};
__export(esm_exports, {
  IEvents: () => IEvents
});
var init_esm = __esm({
  "node_modules/@walletconnect/events/dist/esm/index.js"() {
    init_events();
  }
});

// node_modules/@walletconnect/heartbeat/dist/cjs/types/heartbeat.js
var require_heartbeat = __commonJS({
  "node_modules/@walletconnect/heartbeat/dist/cjs/types/heartbeat.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IHeartBeat = void 0;
    var events_1 = (init_esm(), __toCommonJS(esm_exports));
    var IHeartBeat = class extends events_1.IEvents {
      constructor(opts) {
        super();
      }
    };
    exports.IHeartBeat = IHeartBeat;
  }
});

// node_modules/@walletconnect/heartbeat/dist/cjs/types/index.js
var require_types = __commonJS({
  "node_modules/@walletconnect/heartbeat/dist/cjs/types/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_heartbeat(), exports);
  }
});

// node_modules/@walletconnect/heartbeat/dist/cjs/constants/heartbeat.js
var require_heartbeat2 = __commonJS({
  "node_modules/@walletconnect/heartbeat/dist/cjs/constants/heartbeat.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HEARTBEAT_EVENTS = exports.HEARTBEAT_INTERVAL = void 0;
    var time_1 = require_cjs();
    exports.HEARTBEAT_INTERVAL = time_1.FIVE_SECONDS;
    exports.HEARTBEAT_EVENTS = {
      pulse: "heartbeat_pulse"
    };
  }
});

// node_modules/@walletconnect/heartbeat/dist/cjs/constants/index.js
var require_constants = __commonJS({
  "node_modules/@walletconnect/heartbeat/dist/cjs/constants/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_heartbeat2(), exports);
  }
});

// node_modules/@walletconnect/heartbeat/dist/cjs/heartbeat.js
var require_heartbeat3 = __commonJS({
  "node_modules/@walletconnect/heartbeat/dist/cjs/heartbeat.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HeartBeat = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var events_1 = require_events();
    var time_1 = require_cjs();
    var types_1 = require_types();
    var constants_1 = require_constants();
    var HeartBeat = class _HeartBeat extends types_1.IHeartBeat {
      constructor(opts) {
        super(opts);
        this.events = new events_1.EventEmitter();
        this.interval = constants_1.HEARTBEAT_INTERVAL;
        this.interval = (opts === null || opts === void 0 ? void 0 : opts.interval) || constants_1.HEARTBEAT_INTERVAL;
      }
      static init(opts) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          const heartbeat = new _HeartBeat(opts);
          yield heartbeat.init();
          return heartbeat;
        });
      }
      init() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          yield this.initialize();
        });
      }
      stop() {
        clearInterval(this.intervalRef);
      }
      on(event, listener) {
        this.events.on(event, listener);
      }
      once(event, listener) {
        this.events.once(event, listener);
      }
      off(event, listener) {
        this.events.off(event, listener);
      }
      removeListener(event, listener) {
        this.events.removeListener(event, listener);
      }
      initialize() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          this.intervalRef = setInterval(() => this.pulse(), time_1.toMiliseconds(this.interval));
        });
      }
      pulse() {
        this.events.emit(constants_1.HEARTBEAT_EVENTS.pulse);
      }
    };
    exports.HeartBeat = HeartBeat;
  }
});

// node_modules/@walletconnect/heartbeat/dist/cjs/index.js
var require_cjs4 = __commonJS({
  "node_modules/@walletconnect/heartbeat/dist/cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_heartbeat3(), exports);
    tslib_1.__exportStar(require_types(), exports);
    tslib_1.__exportStar(require_constants(), exports);
  }
});

// node_modules/quick-format-unescaped/index.js
var require_quick_format_unescaped = __commonJS({
  "node_modules/quick-format-unescaped/index.js"(exports, module) {
    "use strict";
    function tryStringify(o3) {
      try {
        return JSON.stringify(o3);
      } catch (e2) {
        return '"[Circular]"';
      }
    }
    module.exports = format;
    function format(f5, args, opts) {
      var ss2 = opts && opts.stringify || tryStringify;
      var offset = 1;
      if (typeof f5 === "object" && f5 !== null) {
        var len = args.length + offset;
        if (len === 1) return f5;
        var objects = new Array(len);
        objects[0] = ss2(f5);
        for (var index = 1; index < len; index++) {
          objects[index] = ss2(args[index]);
        }
        return objects.join(" ");
      }
      if (typeof f5 !== "string") {
        return f5;
      }
      var argLen = args.length;
      if (argLen === 0) return f5;
      var str = "";
      var a3 = 1 - offset;
      var lastPos = -1;
      var flen = f5 && f5.length || 0;
      for (var i3 = 0; i3 < flen; ) {
        if (f5.charCodeAt(i3) === 37 && i3 + 1 < flen) {
          lastPos = lastPos > -1 ? lastPos : 0;
          switch (f5.charCodeAt(i3 + 1)) {
            case 100:
            case 102:
              if (a3 >= argLen)
                break;
              if (args[a3] == null) break;
              if (lastPos < i3)
                str += f5.slice(lastPos, i3);
              str += Number(args[a3]);
              lastPos = i3 + 2;
              i3++;
              break;
            case 105:
              if (a3 >= argLen)
                break;
              if (args[a3] == null) break;
              if (lastPos < i3)
                str += f5.slice(lastPos, i3);
              str += Math.floor(Number(args[a3]));
              lastPos = i3 + 2;
              i3++;
              break;
            case 79:
            case 111:
            case 106:
              if (a3 >= argLen)
                break;
              if (args[a3] === void 0) break;
              if (lastPos < i3)
                str += f5.slice(lastPos, i3);
              var type = typeof args[a3];
              if (type === "string") {
                str += "'" + args[a3] + "'";
                lastPos = i3 + 2;
                i3++;
                break;
              }
              if (type === "function") {
                str += args[a3].name || "<anonymous>";
                lastPos = i3 + 2;
                i3++;
                break;
              }
              str += ss2(args[a3]);
              lastPos = i3 + 2;
              i3++;
              break;
            case 115:
              if (a3 >= argLen)
                break;
              if (lastPos < i3)
                str += f5.slice(lastPos, i3);
              str += String(args[a3]);
              lastPos = i3 + 2;
              i3++;
              break;
            case 37:
              if (lastPos < i3)
                str += f5.slice(lastPos, i3);
              str += "%";
              lastPos = i3 + 2;
              i3++;
              a3--;
              break;
          }
          ++a3;
        }
        ++i3;
      }
      if (lastPos === -1)
        return f5;
      else if (lastPos < flen) {
        str += f5.slice(lastPos);
      }
      return str;
    }
  }
});

// node_modules/pino/browser.js
var require_browser = __commonJS({
  "node_modules/pino/browser.js"(exports, module) {
    "use strict";
    var format = require_quick_format_unescaped();
    module.exports = pino;
    var _console = pfGlobalThisOrFallback().console || {};
    var stdSerializers = {
      mapHttpRequest: mock,
      mapHttpResponse: mock,
      wrapRequestSerializer: passthrough,
      wrapResponseSerializer: passthrough,
      wrapErrorSerializer: passthrough,
      req: mock,
      res: mock,
      err: asErrValue
    };
    function shouldSerialize(serialize, serializers) {
      if (Array.isArray(serialize)) {
        const hasToFilter = serialize.filter(function(k7) {
          return k7 !== "!stdSerializers.err";
        });
        return hasToFilter;
      } else if (serialize === true) {
        return Object.keys(serializers);
      }
      return false;
    }
    function pino(opts) {
      opts = opts || {};
      opts.browser = opts.browser || {};
      const transmit2 = opts.browser.transmit;
      if (transmit2 && typeof transmit2.send !== "function") {
        throw Error("pino: transmit option must have a send function");
      }
      const proto = opts.browser.write || _console;
      if (opts.browser.write) opts.browser.asObject = true;
      const serializers = opts.serializers || {};
      const serialize = shouldSerialize(opts.browser.serialize, serializers);
      let stdErrSerialize = opts.browser.serialize;
      if (Array.isArray(opts.browser.serialize) && opts.browser.serialize.indexOf("!stdSerializers.err") > -1) stdErrSerialize = false;
      const levels = ["error", "fatal", "warn", "info", "debug", "trace"];
      if (typeof proto === "function") {
        proto.error = proto.fatal = proto.warn = proto.info = proto.debug = proto.trace = proto;
      }
      if (opts.enabled === false) opts.level = "silent";
      const level = opts.level || "info";
      const logger = Object.create(proto);
      if (!logger.log) logger.log = noop;
      Object.defineProperty(logger, "levelVal", {
        get: getLevelVal
      });
      Object.defineProperty(logger, "level", {
        get: getLevel,
        set: setLevel
      });
      const setOpts = {
        transmit: transmit2,
        serialize,
        asObject: opts.browser.asObject,
        levels,
        timestamp: getTimeFunction(opts)
      };
      logger.levels = pino.levels;
      logger.level = level;
      logger.setMaxListeners = logger.getMaxListeners = logger.emit = logger.addListener = logger.on = logger.prependListener = logger.once = logger.prependOnceListener = logger.removeListener = logger.removeAllListeners = logger.listeners = logger.listenerCount = logger.eventNames = logger.write = logger.flush = noop;
      logger.serializers = serializers;
      logger._serialize = serialize;
      logger._stdErrSerialize = stdErrSerialize;
      logger.child = child;
      if (transmit2) logger._logEvent = createLogEventShape();
      function getLevelVal() {
        return this.level === "silent" ? Infinity : this.levels.values[this.level];
      }
      function getLevel() {
        return this._level;
      }
      function setLevel(level2) {
        if (level2 !== "silent" && !this.levels.values[level2]) {
          throw Error("unknown level " + level2);
        }
        this._level = level2;
        set2(setOpts, logger, "error", "log");
        set2(setOpts, logger, "fatal", "error");
        set2(setOpts, logger, "warn", "error");
        set2(setOpts, logger, "info", "log");
        set2(setOpts, logger, "debug", "log");
        set2(setOpts, logger, "trace", "log");
      }
      function child(bindings, childOptions) {
        if (!bindings) {
          throw new Error("missing bindings for child Pino");
        }
        childOptions = childOptions || {};
        if (serialize && bindings.serializers) {
          childOptions.serializers = bindings.serializers;
        }
        const childOptionsSerializers = childOptions.serializers;
        if (serialize && childOptionsSerializers) {
          var childSerializers = Object.assign({}, serializers, childOptionsSerializers);
          var childSerialize = opts.browser.serialize === true ? Object.keys(childSerializers) : serialize;
          delete bindings.serializers;
          applySerializers([bindings], childSerialize, childSerializers, this._stdErrSerialize);
        }
        function Child(parent) {
          this._childLevel = (parent._childLevel | 0) + 1;
          this.error = bind(parent, bindings, "error");
          this.fatal = bind(parent, bindings, "fatal");
          this.warn = bind(parent, bindings, "warn");
          this.info = bind(parent, bindings, "info");
          this.debug = bind(parent, bindings, "debug");
          this.trace = bind(parent, bindings, "trace");
          if (childSerializers) {
            this.serializers = childSerializers;
            this._serialize = childSerialize;
          }
          if (transmit2) {
            this._logEvent = createLogEventShape(
              [].concat(parent._logEvent.bindings, bindings)
            );
          }
        }
        Child.prototype = this;
        return new Child(this);
      }
      return logger;
    }
    pino.levels = {
      values: {
        fatal: 60,
        error: 50,
        warn: 40,
        info: 30,
        debug: 20,
        trace: 10
      },
      labels: {
        10: "trace",
        20: "debug",
        30: "info",
        40: "warn",
        50: "error",
        60: "fatal"
      }
    };
    pino.stdSerializers = stdSerializers;
    pino.stdTimeFunctions = Object.assign({}, { nullTime, epochTime, unixTime, isoTime });
    function set2(opts, logger, level, fallback) {
      const proto = Object.getPrototypeOf(logger);
      logger[level] = logger.levelVal > logger.levels.values[level] ? noop : proto[level] ? proto[level] : _console[level] || _console[fallback] || noop;
      wrap(opts, logger, level);
    }
    function wrap(opts, logger, level) {
      if (!opts.transmit && logger[level] === noop) return;
      logger[level] = /* @__PURE__ */ function(write) {
        return function LOG() {
          const ts2 = opts.timestamp();
          const args = new Array(arguments.length);
          const proto = Object.getPrototypeOf && Object.getPrototypeOf(this) === _console ? _console : this;
          for (var i3 = 0; i3 < args.length; i3++) args[i3] = arguments[i3];
          if (opts.serialize && !opts.asObject) {
            applySerializers(args, this._serialize, this.serializers, this._stdErrSerialize);
          }
          if (opts.asObject) write.call(proto, asObject(this, level, args, ts2));
          else write.apply(proto, args);
          if (opts.transmit) {
            const transmitLevel = opts.transmit.level || logger.level;
            const transmitValue = pino.levels.values[transmitLevel];
            const methodValue = pino.levels.values[level];
            if (methodValue < transmitValue) return;
            transmit(this, {
              ts: ts2,
              methodLevel: level,
              methodValue,
              transmitLevel,
              transmitValue: pino.levels.values[opts.transmit.level || logger.level],
              send: opts.transmit.send,
              val: logger.levelVal
            }, args);
          }
        };
      }(logger[level]);
    }
    function asObject(logger, level, args, ts2) {
      if (logger._serialize) applySerializers(args, logger._serialize, logger.serializers, logger._stdErrSerialize);
      const argsCloned = args.slice();
      let msg = argsCloned[0];
      const o3 = {};
      if (ts2) {
        o3.time = ts2;
      }
      o3.level = pino.levels.values[level];
      let lvl = (logger._childLevel | 0) + 1;
      if (lvl < 1) lvl = 1;
      if (msg !== null && typeof msg === "object") {
        while (lvl-- && typeof argsCloned[0] === "object") {
          Object.assign(o3, argsCloned.shift());
        }
        msg = argsCloned.length ? format(argsCloned.shift(), argsCloned) : void 0;
      } else if (typeof msg === "string") msg = format(argsCloned.shift(), argsCloned);
      if (msg !== void 0) o3.msg = msg;
      return o3;
    }
    function applySerializers(args, serialize, serializers, stdErrSerialize) {
      for (const i3 in args) {
        if (stdErrSerialize && args[i3] instanceof Error) {
          args[i3] = pino.stdSerializers.err(args[i3]);
        } else if (typeof args[i3] === "object" && !Array.isArray(args[i3])) {
          for (const k7 in args[i3]) {
            if (serialize && serialize.indexOf(k7) > -1 && k7 in serializers) {
              args[i3][k7] = serializers[k7](args[i3][k7]);
            }
          }
        }
      }
    }
    function bind(parent, bindings, level) {
      return function() {
        const args = new Array(1 + arguments.length);
        args[0] = bindings;
        for (var i3 = 1; i3 < args.length; i3++) {
          args[i3] = arguments[i3 - 1];
        }
        return parent[level].apply(this, args);
      };
    }
    function transmit(logger, opts, args) {
      const send = opts.send;
      const ts2 = opts.ts;
      const methodLevel = opts.methodLevel;
      const methodValue = opts.methodValue;
      const val = opts.val;
      const bindings = logger._logEvent.bindings;
      applySerializers(
        args,
        logger._serialize || Object.keys(logger.serializers),
        logger.serializers,
        logger._stdErrSerialize === void 0 ? true : logger._stdErrSerialize
      );
      logger._logEvent.ts = ts2;
      logger._logEvent.messages = args.filter(function(arg) {
        return bindings.indexOf(arg) === -1;
      });
      logger._logEvent.level.label = methodLevel;
      logger._logEvent.level.value = methodValue;
      send(methodLevel, logger._logEvent, val);
      logger._logEvent = createLogEventShape(bindings);
    }
    function createLogEventShape(bindings) {
      return {
        ts: 0,
        messages: [],
        bindings: bindings || [],
        level: { label: "", value: 0 }
      };
    }
    function asErrValue(err) {
      const obj = {
        type: err.constructor.name,
        msg: err.message,
        stack: err.stack
      };
      for (const key in err) {
        if (obj[key] === void 0) {
          obj[key] = err[key];
        }
      }
      return obj;
    }
    function getTimeFunction(opts) {
      if (typeof opts.timestamp === "function") {
        return opts.timestamp;
      }
      if (opts.timestamp === false) {
        return nullTime;
      }
      return epochTime;
    }
    function mock() {
      return {};
    }
    function passthrough(a3) {
      return a3;
    }
    function noop() {
    }
    function nullTime() {
      return false;
    }
    function epochTime() {
      return Date.now();
    }
    function unixTime() {
      return Math.round(Date.now() / 1e3);
    }
    function isoTime() {
      return new Date(Date.now()).toISOString();
    }
    function pfGlobalThisOrFallback() {
      function defd(o3) {
        return typeof o3 !== "undefined" && o3;
      }
      try {
        if (typeof globalThis !== "undefined") return globalThis;
        Object.defineProperty(Object.prototype, "globalThis", {
          get: function() {
            delete Object.prototype.globalThis;
            return this.globalThis = this;
          },
          configurable: true
        });
        return globalThis;
      } catch (e2) {
        return defd(self) || defd(window) || defd(this) || {};
      }
    }
  }
});

// node_modules/@stablelib/sha512/lib/sha512.js
var require_sha512 = __commonJS({
  "node_modules/@stablelib/sha512/lib/sha512.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var binary_1 = require_binary();
    var wipe_1 = require_wipe();
    exports.DIGEST_LENGTH = 64;
    exports.BLOCK_SIZE = 128;
    var SHA512 = (
      /** @class */
      function() {
        function SHA5122() {
          this.digestLength = exports.DIGEST_LENGTH;
          this.blockSize = exports.BLOCK_SIZE;
          this._stateHi = new Int32Array(8);
          this._stateLo = new Int32Array(8);
          this._tempHi = new Int32Array(16);
          this._tempLo = new Int32Array(16);
          this._buffer = new Uint8Array(256);
          this._bufferLength = 0;
          this._bytesHashed = 0;
          this._finished = false;
          this.reset();
        }
        SHA5122.prototype._initState = function() {
          this._stateHi[0] = 1779033703;
          this._stateHi[1] = 3144134277;
          this._stateHi[2] = 1013904242;
          this._stateHi[3] = 2773480762;
          this._stateHi[4] = 1359893119;
          this._stateHi[5] = 2600822924;
          this._stateHi[6] = 528734635;
          this._stateHi[7] = 1541459225;
          this._stateLo[0] = 4089235720;
          this._stateLo[1] = 2227873595;
          this._stateLo[2] = 4271175723;
          this._stateLo[3] = 1595750129;
          this._stateLo[4] = 2917565137;
          this._stateLo[5] = 725511199;
          this._stateLo[6] = 4215389547;
          this._stateLo[7] = 327033209;
        };
        SHA5122.prototype.reset = function() {
          this._initState();
          this._bufferLength = 0;
          this._bytesHashed = 0;
          this._finished = false;
          return this;
        };
        SHA5122.prototype.clean = function() {
          wipe_1.wipe(this._buffer);
          wipe_1.wipe(this._tempHi);
          wipe_1.wipe(this._tempLo);
          this.reset();
        };
        SHA5122.prototype.update = function(data, dataLength) {
          if (dataLength === void 0) {
            dataLength = data.length;
          }
          if (this._finished) {
            throw new Error("SHA512: can't update because hash was finished.");
          }
          var dataPos = 0;
          this._bytesHashed += dataLength;
          if (this._bufferLength > 0) {
            while (this._bufferLength < exports.BLOCK_SIZE && dataLength > 0) {
              this._buffer[this._bufferLength++] = data[dataPos++];
              dataLength--;
            }
            if (this._bufferLength === this.blockSize) {
              hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, this._buffer, 0, this.blockSize);
              this._bufferLength = 0;
            }
          }
          if (dataLength >= this.blockSize) {
            dataPos = hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, data, dataPos, dataLength);
            dataLength %= this.blockSize;
          }
          while (dataLength > 0) {
            this._buffer[this._bufferLength++] = data[dataPos++];
            dataLength--;
          }
          return this;
        };
        SHA5122.prototype.finish = function(out) {
          if (!this._finished) {
            var bytesHashed = this._bytesHashed;
            var left = this._bufferLength;
            var bitLenHi = bytesHashed / 536870912 | 0;
            var bitLenLo = bytesHashed << 3;
            var padLength = bytesHashed % 128 < 112 ? 128 : 256;
            this._buffer[left] = 128;
            for (var i3 = left + 1; i3 < padLength - 8; i3++) {
              this._buffer[i3] = 0;
            }
            binary_1.writeUint32BE(bitLenHi, this._buffer, padLength - 8);
            binary_1.writeUint32BE(bitLenLo, this._buffer, padLength - 4);
            hashBlocks(this._tempHi, this._tempLo, this._stateHi, this._stateLo, this._buffer, 0, padLength);
            this._finished = true;
          }
          for (var i3 = 0; i3 < this.digestLength / 8; i3++) {
            binary_1.writeUint32BE(this._stateHi[i3], out, i3 * 8);
            binary_1.writeUint32BE(this._stateLo[i3], out, i3 * 8 + 4);
          }
          return this;
        };
        SHA5122.prototype.digest = function() {
          var out = new Uint8Array(this.digestLength);
          this.finish(out);
          return out;
        };
        SHA5122.prototype.saveState = function() {
          if (this._finished) {
            throw new Error("SHA256: cannot save finished state");
          }
          return {
            stateHi: new Int32Array(this._stateHi),
            stateLo: new Int32Array(this._stateLo),
            buffer: this._bufferLength > 0 ? new Uint8Array(this._buffer) : void 0,
            bufferLength: this._bufferLength,
            bytesHashed: this._bytesHashed
          };
        };
        SHA5122.prototype.restoreState = function(savedState) {
          this._stateHi.set(savedState.stateHi);
          this._stateLo.set(savedState.stateLo);
          this._bufferLength = savedState.bufferLength;
          if (savedState.buffer) {
            this._buffer.set(savedState.buffer);
          }
          this._bytesHashed = savedState.bytesHashed;
          this._finished = false;
          return this;
        };
        SHA5122.prototype.cleanSavedState = function(savedState) {
          wipe_1.wipe(savedState.stateHi);
          wipe_1.wipe(savedState.stateLo);
          if (savedState.buffer) {
            wipe_1.wipe(savedState.buffer);
          }
          savedState.bufferLength = 0;
          savedState.bytesHashed = 0;
        };
        return SHA5122;
      }()
    );
    exports.SHA512 = SHA512;
    var K3 = new Int32Array([
      1116352408,
      3609767458,
      1899447441,
      602891725,
      3049323471,
      3964484399,
      3921009573,
      2173295548,
      961987163,
      4081628472,
      1508970993,
      3053834265,
      2453635748,
      2937671579,
      2870763221,
      3664609560,
      3624381080,
      2734883394,
      310598401,
      1164996542,
      607225278,
      1323610764,
      1426881987,
      3590304994,
      1925078388,
      4068182383,
      2162078206,
      991336113,
      2614888103,
      633803317,
      3248222580,
      3479774868,
      3835390401,
      2666613458,
      4022224774,
      944711139,
      264347078,
      2341262773,
      604807628,
      2007800933,
      770255983,
      1495990901,
      1249150122,
      1856431235,
      1555081692,
      3175218132,
      1996064986,
      2198950837,
      2554220882,
      3999719339,
      2821834349,
      766784016,
      2952996808,
      2566594879,
      3210313671,
      3203337956,
      3336571891,
      1034457026,
      3584528711,
      2466948901,
      113926993,
      3758326383,
      338241895,
      168717936,
      666307205,
      1188179964,
      773529912,
      1546045734,
      1294757372,
      1522805485,
      1396182291,
      2643833823,
      1695183700,
      2343527390,
      1986661051,
      1014477480,
      2177026350,
      1206759142,
      2456956037,
      344077627,
      2730485921,
      1290863460,
      2820302411,
      3158454273,
      3259730800,
      3505952657,
      3345764771,
      106217008,
      3516065817,
      3606008344,
      3600352804,
      1432725776,
      4094571909,
      1467031594,
      275423344,
      851169720,
      430227734,
      3100823752,
      506948616,
      1363258195,
      659060556,
      3750685593,
      883997877,
      3785050280,
      958139571,
      3318307427,
      1322822218,
      3812723403,
      1537002063,
      2003034995,
      1747873779,
      3602036899,
      1955562222,
      1575990012,
      2024104815,
      1125592928,
      2227730452,
      2716904306,
      2361852424,
      442776044,
      2428436474,
      593698344,
      2756734187,
      3733110249,
      3204031479,
      2999351573,
      3329325298,
      3815920427,
      3391569614,
      3928383900,
      3515267271,
      566280711,
      3940187606,
      3454069534,
      4118630271,
      4000239992,
      116418474,
      1914138554,
      174292421,
      2731055270,
      289380356,
      3203993006,
      460393269,
      320620315,
      685471733,
      587496836,
      852142971,
      1086792851,
      1017036298,
      365543100,
      1126000580,
      2618297676,
      1288033470,
      3409855158,
      1501505948,
      4234509866,
      1607167915,
      987167468,
      1816402316,
      1246189591
    ]);
    function hashBlocks(wh, wl, hh, hl, m5, pos, len) {
      var ah0 = hh[0], ah1 = hh[1], ah2 = hh[2], ah3 = hh[3], ah4 = hh[4], ah5 = hh[5], ah6 = hh[6], ah7 = hh[7], al0 = hl[0], al1 = hl[1], al2 = hl[2], al3 = hl[3], al4 = hl[4], al5 = hl[5], al6 = hl[6], al7 = hl[7];
      var h7, l4;
      var th, tl;
      var a3, b6, c5, d3;
      while (len >= 128) {
        for (var i3 = 0; i3 < 16; i3++) {
          var j4 = 8 * i3 + pos;
          wh[i3] = binary_1.readUint32BE(m5, j4);
          wl[i3] = binary_1.readUint32BE(m5, j4 + 4);
        }
        for (var i3 = 0; i3 < 80; i3++) {
          var bh0 = ah0;
          var bh1 = ah1;
          var bh2 = ah2;
          var bh3 = ah3;
          var bh4 = ah4;
          var bh5 = ah5;
          var bh6 = ah6;
          var bh7 = ah7;
          var bl0 = al0;
          var bl1 = al1;
          var bl2 = al2;
          var bl3 = al3;
          var bl4 = al4;
          var bl5 = al5;
          var bl6 = al6;
          var bl7 = al7;
          h7 = ah7;
          l4 = al7;
          a3 = l4 & 65535;
          b6 = l4 >>> 16;
          c5 = h7 & 65535;
          d3 = h7 >>> 16;
          h7 = (ah4 >>> 14 | al4 << 32 - 14) ^ (ah4 >>> 18 | al4 << 32 - 18) ^ (al4 >>> 41 - 32 | ah4 << 32 - (41 - 32));
          l4 = (al4 >>> 14 | ah4 << 32 - 14) ^ (al4 >>> 18 | ah4 << 32 - 18) ^ (ah4 >>> 41 - 32 | al4 << 32 - (41 - 32));
          a3 += l4 & 65535;
          b6 += l4 >>> 16;
          c5 += h7 & 65535;
          d3 += h7 >>> 16;
          h7 = ah4 & ah5 ^ ~ah4 & ah6;
          l4 = al4 & al5 ^ ~al4 & al6;
          a3 += l4 & 65535;
          b6 += l4 >>> 16;
          c5 += h7 & 65535;
          d3 += h7 >>> 16;
          h7 = K3[i3 * 2];
          l4 = K3[i3 * 2 + 1];
          a3 += l4 & 65535;
          b6 += l4 >>> 16;
          c5 += h7 & 65535;
          d3 += h7 >>> 16;
          h7 = wh[i3 % 16];
          l4 = wl[i3 % 16];
          a3 += l4 & 65535;
          b6 += l4 >>> 16;
          c5 += h7 & 65535;
          d3 += h7 >>> 16;
          b6 += a3 >>> 16;
          c5 += b6 >>> 16;
          d3 += c5 >>> 16;
          th = c5 & 65535 | d3 << 16;
          tl = a3 & 65535 | b6 << 16;
          h7 = th;
          l4 = tl;
          a3 = l4 & 65535;
          b6 = l4 >>> 16;
          c5 = h7 & 65535;
          d3 = h7 >>> 16;
          h7 = (ah0 >>> 28 | al0 << 32 - 28) ^ (al0 >>> 34 - 32 | ah0 << 32 - (34 - 32)) ^ (al0 >>> 39 - 32 | ah0 << 32 - (39 - 32));
          l4 = (al0 >>> 28 | ah0 << 32 - 28) ^ (ah0 >>> 34 - 32 | al0 << 32 - (34 - 32)) ^ (ah0 >>> 39 - 32 | al0 << 32 - (39 - 32));
          a3 += l4 & 65535;
          b6 += l4 >>> 16;
          c5 += h7 & 65535;
          d3 += h7 >>> 16;
          h7 = ah0 & ah1 ^ ah0 & ah2 ^ ah1 & ah2;
          l4 = al0 & al1 ^ al0 & al2 ^ al1 & al2;
          a3 += l4 & 65535;
          b6 += l4 >>> 16;
          c5 += h7 & 65535;
          d3 += h7 >>> 16;
          b6 += a3 >>> 16;
          c5 += b6 >>> 16;
          d3 += c5 >>> 16;
          bh7 = c5 & 65535 | d3 << 16;
          bl7 = a3 & 65535 | b6 << 16;
          h7 = bh3;
          l4 = bl3;
          a3 = l4 & 65535;
          b6 = l4 >>> 16;
          c5 = h7 & 65535;
          d3 = h7 >>> 16;
          h7 = th;
          l4 = tl;
          a3 += l4 & 65535;
          b6 += l4 >>> 16;
          c5 += h7 & 65535;
          d3 += h7 >>> 16;
          b6 += a3 >>> 16;
          c5 += b6 >>> 16;
          d3 += c5 >>> 16;
          bh3 = c5 & 65535 | d3 << 16;
          bl3 = a3 & 65535 | b6 << 16;
          ah1 = bh0;
          ah2 = bh1;
          ah3 = bh2;
          ah4 = bh3;
          ah5 = bh4;
          ah6 = bh5;
          ah7 = bh6;
          ah0 = bh7;
          al1 = bl0;
          al2 = bl1;
          al3 = bl2;
          al4 = bl3;
          al5 = bl4;
          al6 = bl5;
          al7 = bl6;
          al0 = bl7;
          if (i3 % 16 === 15) {
            for (var j4 = 0; j4 < 16; j4++) {
              h7 = wh[j4];
              l4 = wl[j4];
              a3 = l4 & 65535;
              b6 = l4 >>> 16;
              c5 = h7 & 65535;
              d3 = h7 >>> 16;
              h7 = wh[(j4 + 9) % 16];
              l4 = wl[(j4 + 9) % 16];
              a3 += l4 & 65535;
              b6 += l4 >>> 16;
              c5 += h7 & 65535;
              d3 += h7 >>> 16;
              th = wh[(j4 + 1) % 16];
              tl = wl[(j4 + 1) % 16];
              h7 = (th >>> 1 | tl << 32 - 1) ^ (th >>> 8 | tl << 32 - 8) ^ th >>> 7;
              l4 = (tl >>> 1 | th << 32 - 1) ^ (tl >>> 8 | th << 32 - 8) ^ (tl >>> 7 | th << 32 - 7);
              a3 += l4 & 65535;
              b6 += l4 >>> 16;
              c5 += h7 & 65535;
              d3 += h7 >>> 16;
              th = wh[(j4 + 14) % 16];
              tl = wl[(j4 + 14) % 16];
              h7 = (th >>> 19 | tl << 32 - 19) ^ (tl >>> 61 - 32 | th << 32 - (61 - 32)) ^ th >>> 6;
              l4 = (tl >>> 19 | th << 32 - 19) ^ (th >>> 61 - 32 | tl << 32 - (61 - 32)) ^ (tl >>> 6 | th << 32 - 6);
              a3 += l4 & 65535;
              b6 += l4 >>> 16;
              c5 += h7 & 65535;
              d3 += h7 >>> 16;
              b6 += a3 >>> 16;
              c5 += b6 >>> 16;
              d3 += c5 >>> 16;
              wh[j4] = c5 & 65535 | d3 << 16;
              wl[j4] = a3 & 65535 | b6 << 16;
            }
          }
        }
        h7 = ah0;
        l4 = al0;
        a3 = l4 & 65535;
        b6 = l4 >>> 16;
        c5 = h7 & 65535;
        d3 = h7 >>> 16;
        h7 = hh[0];
        l4 = hl[0];
        a3 += l4 & 65535;
        b6 += l4 >>> 16;
        c5 += h7 & 65535;
        d3 += h7 >>> 16;
        b6 += a3 >>> 16;
        c5 += b6 >>> 16;
        d3 += c5 >>> 16;
        hh[0] = ah0 = c5 & 65535 | d3 << 16;
        hl[0] = al0 = a3 & 65535 | b6 << 16;
        h7 = ah1;
        l4 = al1;
        a3 = l4 & 65535;
        b6 = l4 >>> 16;
        c5 = h7 & 65535;
        d3 = h7 >>> 16;
        h7 = hh[1];
        l4 = hl[1];
        a3 += l4 & 65535;
        b6 += l4 >>> 16;
        c5 += h7 & 65535;
        d3 += h7 >>> 16;
        b6 += a3 >>> 16;
        c5 += b6 >>> 16;
        d3 += c5 >>> 16;
        hh[1] = ah1 = c5 & 65535 | d3 << 16;
        hl[1] = al1 = a3 & 65535 | b6 << 16;
        h7 = ah2;
        l4 = al2;
        a3 = l4 & 65535;
        b6 = l4 >>> 16;
        c5 = h7 & 65535;
        d3 = h7 >>> 16;
        h7 = hh[2];
        l4 = hl[2];
        a3 += l4 & 65535;
        b6 += l4 >>> 16;
        c5 += h7 & 65535;
        d3 += h7 >>> 16;
        b6 += a3 >>> 16;
        c5 += b6 >>> 16;
        d3 += c5 >>> 16;
        hh[2] = ah2 = c5 & 65535 | d3 << 16;
        hl[2] = al2 = a3 & 65535 | b6 << 16;
        h7 = ah3;
        l4 = al3;
        a3 = l4 & 65535;
        b6 = l4 >>> 16;
        c5 = h7 & 65535;
        d3 = h7 >>> 16;
        h7 = hh[3];
        l4 = hl[3];
        a3 += l4 & 65535;
        b6 += l4 >>> 16;
        c5 += h7 & 65535;
        d3 += h7 >>> 16;
        b6 += a3 >>> 16;
        c5 += b6 >>> 16;
        d3 += c5 >>> 16;
        hh[3] = ah3 = c5 & 65535 | d3 << 16;
        hl[3] = al3 = a3 & 65535 | b6 << 16;
        h7 = ah4;
        l4 = al4;
        a3 = l4 & 65535;
        b6 = l4 >>> 16;
        c5 = h7 & 65535;
        d3 = h7 >>> 16;
        h7 = hh[4];
        l4 = hl[4];
        a3 += l4 & 65535;
        b6 += l4 >>> 16;
        c5 += h7 & 65535;
        d3 += h7 >>> 16;
        b6 += a3 >>> 16;
        c5 += b6 >>> 16;
        d3 += c5 >>> 16;
        hh[4] = ah4 = c5 & 65535 | d3 << 16;
        hl[4] = al4 = a3 & 65535 | b6 << 16;
        h7 = ah5;
        l4 = al5;
        a3 = l4 & 65535;
        b6 = l4 >>> 16;
        c5 = h7 & 65535;
        d3 = h7 >>> 16;
        h7 = hh[5];
        l4 = hl[5];
        a3 += l4 & 65535;
        b6 += l4 >>> 16;
        c5 += h7 & 65535;
        d3 += h7 >>> 16;
        b6 += a3 >>> 16;
        c5 += b6 >>> 16;
        d3 += c5 >>> 16;
        hh[5] = ah5 = c5 & 65535 | d3 << 16;
        hl[5] = al5 = a3 & 65535 | b6 << 16;
        h7 = ah6;
        l4 = al6;
        a3 = l4 & 65535;
        b6 = l4 >>> 16;
        c5 = h7 & 65535;
        d3 = h7 >>> 16;
        h7 = hh[6];
        l4 = hl[6];
        a3 += l4 & 65535;
        b6 += l4 >>> 16;
        c5 += h7 & 65535;
        d3 += h7 >>> 16;
        b6 += a3 >>> 16;
        c5 += b6 >>> 16;
        d3 += c5 >>> 16;
        hh[6] = ah6 = c5 & 65535 | d3 << 16;
        hl[6] = al6 = a3 & 65535 | b6 << 16;
        h7 = ah7;
        l4 = al7;
        a3 = l4 & 65535;
        b6 = l4 >>> 16;
        c5 = h7 & 65535;
        d3 = h7 >>> 16;
        h7 = hh[7];
        l4 = hl[7];
        a3 += l4 & 65535;
        b6 += l4 >>> 16;
        c5 += h7 & 65535;
        d3 += h7 >>> 16;
        b6 += a3 >>> 16;
        c5 += b6 >>> 16;
        d3 += c5 >>> 16;
        hh[7] = ah7 = c5 & 65535 | d3 << 16;
        hl[7] = al7 = a3 & 65535 | b6 << 16;
        pos += 128;
        len -= 128;
      }
      return pos;
    }
    function hash(data) {
      var h7 = new SHA512();
      h7.update(data);
      var digest = h7.digest();
      h7.clean();
      return digest;
    }
    exports.hash = hash;
  }
});

// node_modules/@stablelib/ed25519/lib/ed25519.js
var require_ed25519 = __commonJS({
  "node_modules/@stablelib/ed25519/lib/ed25519.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.convertSecretKeyToX25519 = exports.convertPublicKeyToX25519 = exports.verify = exports.sign = exports.extractPublicKeyFromSecretKey = exports.generateKeyPair = exports.generateKeyPairFromSeed = exports.SEED_LENGTH = exports.SECRET_KEY_LENGTH = exports.PUBLIC_KEY_LENGTH = exports.SIGNATURE_LENGTH = void 0;
    var random_1 = require_random();
    var sha512_1 = require_sha512();
    var wipe_1 = require_wipe();
    exports.SIGNATURE_LENGTH = 64;
    exports.PUBLIC_KEY_LENGTH = 32;
    exports.SECRET_KEY_LENGTH = 64;
    exports.SEED_LENGTH = 32;
    function gf(init) {
      const r2 = new Float64Array(16);
      if (init) {
        for (let i3 = 0; i3 < init.length; i3++) {
          r2[i3] = init[i3];
        }
      }
      return r2;
    }
    var _9 = new Uint8Array(32);
    _9[0] = 9;
    var gf0 = gf();
    var gf1 = gf([1]);
    var D6 = gf([
      30883,
      4953,
      19914,
      30187,
      55467,
      16705,
      2637,
      112,
      59544,
      30585,
      16505,
      36039,
      65139,
      11119,
      27886,
      20995
    ]);
    var D22 = gf([
      61785,
      9906,
      39828,
      60374,
      45398,
      33411,
      5274,
      224,
      53552,
      61171,
      33010,
      6542,
      64743,
      22239,
      55772,
      9222
    ]);
    var X4 = gf([
      54554,
      36645,
      11616,
      51542,
      42930,
      38181,
      51040,
      26924,
      56412,
      64982,
      57905,
      49316,
      21502,
      52590,
      14035,
      8553
    ]);
    var Y = gf([
      26200,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214
    ]);
    var I2 = gf([
      41136,
      18958,
      6951,
      50414,
      58488,
      44335,
      6150,
      12099,
      55207,
      15867,
      153,
      11085,
      57099,
      20417,
      9344,
      11139
    ]);
    function set25519(r2, a3) {
      for (let i3 = 0; i3 < 16; i3++) {
        r2[i3] = a3[i3] | 0;
      }
    }
    function car25519(o3) {
      let c5 = 1;
      for (let i3 = 0; i3 < 16; i3++) {
        let v5 = o3[i3] + c5 + 65535;
        c5 = Math.floor(v5 / 65536);
        o3[i3] = v5 - c5 * 65536;
      }
      o3[0] += c5 - 1 + 37 * (c5 - 1);
    }
    function sel25519(p7, q3, b6) {
      const c5 = ~(b6 - 1);
      for (let i3 = 0; i3 < 16; i3++) {
        const t = c5 & (p7[i3] ^ q3[i3]);
        p7[i3] ^= t;
        q3[i3] ^= t;
      }
    }
    function pack25519(o3, n4) {
      const m5 = gf();
      const t = gf();
      for (let i3 = 0; i3 < 16; i3++) {
        t[i3] = n4[i3];
      }
      car25519(t);
      car25519(t);
      car25519(t);
      for (let j4 = 0; j4 < 2; j4++) {
        m5[0] = t[0] - 65517;
        for (let i3 = 1; i3 < 15; i3++) {
          m5[i3] = t[i3] - 65535 - (m5[i3 - 1] >> 16 & 1);
          m5[i3 - 1] &= 65535;
        }
        m5[15] = t[15] - 32767 - (m5[14] >> 16 & 1);
        const b6 = m5[15] >> 16 & 1;
        m5[14] &= 65535;
        sel25519(t, m5, 1 - b6);
      }
      for (let i3 = 0; i3 < 16; i3++) {
        o3[2 * i3] = t[i3] & 255;
        o3[2 * i3 + 1] = t[i3] >> 8;
      }
    }
    function verify32(x3, y7) {
      let d3 = 0;
      for (let i3 = 0; i3 < 32; i3++) {
        d3 |= x3[i3] ^ y7[i3];
      }
      return (1 & d3 - 1 >>> 8) - 1;
    }
    function neq25519(a3, b6) {
      const c5 = new Uint8Array(32);
      const d3 = new Uint8Array(32);
      pack25519(c5, a3);
      pack25519(d3, b6);
      return verify32(c5, d3);
    }
    function par25519(a3) {
      const d3 = new Uint8Array(32);
      pack25519(d3, a3);
      return d3[0] & 1;
    }
    function unpack25519(o3, n4) {
      for (let i3 = 0; i3 < 16; i3++) {
        o3[i3] = n4[2 * i3] + (n4[2 * i3 + 1] << 8);
      }
      o3[15] &= 32767;
    }
    function add(o3, a3, b6) {
      for (let i3 = 0; i3 < 16; i3++) {
        o3[i3] = a3[i3] + b6[i3];
      }
    }
    function sub(o3, a3, b6) {
      for (let i3 = 0; i3 < 16; i3++) {
        o3[i3] = a3[i3] - b6[i3];
      }
    }
    function mul(o3, a3, b6) {
      let v5, c5, t0 = 0, t1 = 0, t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, t8 = 0, t9 = 0, t10 = 0, t11 = 0, t12 = 0, t13 = 0, t14 = 0, t15 = 0, t16 = 0, t17 = 0, t18 = 0, t19 = 0, t20 = 0, t21 = 0, t22 = 0, t23 = 0, t24 = 0, t25 = 0, t26 = 0, t27 = 0, t28 = 0, t29 = 0, t30 = 0, b0 = b6[0], b1 = b6[1], b22 = b6[2], b32 = b6[3], b42 = b6[4], b52 = b6[5], b62 = b6[6], b7 = b6[7], b8 = b6[8], b9 = b6[9], b10 = b6[10], b11 = b6[11], b12 = b6[12], b13 = b6[13], b14 = b6[14], b15 = b6[15];
      v5 = a3[0];
      t0 += v5 * b0;
      t1 += v5 * b1;
      t2 += v5 * b22;
      t3 += v5 * b32;
      t4 += v5 * b42;
      t5 += v5 * b52;
      t6 += v5 * b62;
      t7 += v5 * b7;
      t8 += v5 * b8;
      t9 += v5 * b9;
      t10 += v5 * b10;
      t11 += v5 * b11;
      t12 += v5 * b12;
      t13 += v5 * b13;
      t14 += v5 * b14;
      t15 += v5 * b15;
      v5 = a3[1];
      t1 += v5 * b0;
      t2 += v5 * b1;
      t3 += v5 * b22;
      t4 += v5 * b32;
      t5 += v5 * b42;
      t6 += v5 * b52;
      t7 += v5 * b62;
      t8 += v5 * b7;
      t9 += v5 * b8;
      t10 += v5 * b9;
      t11 += v5 * b10;
      t12 += v5 * b11;
      t13 += v5 * b12;
      t14 += v5 * b13;
      t15 += v5 * b14;
      t16 += v5 * b15;
      v5 = a3[2];
      t2 += v5 * b0;
      t3 += v5 * b1;
      t4 += v5 * b22;
      t5 += v5 * b32;
      t6 += v5 * b42;
      t7 += v5 * b52;
      t8 += v5 * b62;
      t9 += v5 * b7;
      t10 += v5 * b8;
      t11 += v5 * b9;
      t12 += v5 * b10;
      t13 += v5 * b11;
      t14 += v5 * b12;
      t15 += v5 * b13;
      t16 += v5 * b14;
      t17 += v5 * b15;
      v5 = a3[3];
      t3 += v5 * b0;
      t4 += v5 * b1;
      t5 += v5 * b22;
      t6 += v5 * b32;
      t7 += v5 * b42;
      t8 += v5 * b52;
      t9 += v5 * b62;
      t10 += v5 * b7;
      t11 += v5 * b8;
      t12 += v5 * b9;
      t13 += v5 * b10;
      t14 += v5 * b11;
      t15 += v5 * b12;
      t16 += v5 * b13;
      t17 += v5 * b14;
      t18 += v5 * b15;
      v5 = a3[4];
      t4 += v5 * b0;
      t5 += v5 * b1;
      t6 += v5 * b22;
      t7 += v5 * b32;
      t8 += v5 * b42;
      t9 += v5 * b52;
      t10 += v5 * b62;
      t11 += v5 * b7;
      t12 += v5 * b8;
      t13 += v5 * b9;
      t14 += v5 * b10;
      t15 += v5 * b11;
      t16 += v5 * b12;
      t17 += v5 * b13;
      t18 += v5 * b14;
      t19 += v5 * b15;
      v5 = a3[5];
      t5 += v5 * b0;
      t6 += v5 * b1;
      t7 += v5 * b22;
      t8 += v5 * b32;
      t9 += v5 * b42;
      t10 += v5 * b52;
      t11 += v5 * b62;
      t12 += v5 * b7;
      t13 += v5 * b8;
      t14 += v5 * b9;
      t15 += v5 * b10;
      t16 += v5 * b11;
      t17 += v5 * b12;
      t18 += v5 * b13;
      t19 += v5 * b14;
      t20 += v5 * b15;
      v5 = a3[6];
      t6 += v5 * b0;
      t7 += v5 * b1;
      t8 += v5 * b22;
      t9 += v5 * b32;
      t10 += v5 * b42;
      t11 += v5 * b52;
      t12 += v5 * b62;
      t13 += v5 * b7;
      t14 += v5 * b8;
      t15 += v5 * b9;
      t16 += v5 * b10;
      t17 += v5 * b11;
      t18 += v5 * b12;
      t19 += v5 * b13;
      t20 += v5 * b14;
      t21 += v5 * b15;
      v5 = a3[7];
      t7 += v5 * b0;
      t8 += v5 * b1;
      t9 += v5 * b22;
      t10 += v5 * b32;
      t11 += v5 * b42;
      t12 += v5 * b52;
      t13 += v5 * b62;
      t14 += v5 * b7;
      t15 += v5 * b8;
      t16 += v5 * b9;
      t17 += v5 * b10;
      t18 += v5 * b11;
      t19 += v5 * b12;
      t20 += v5 * b13;
      t21 += v5 * b14;
      t22 += v5 * b15;
      v5 = a3[8];
      t8 += v5 * b0;
      t9 += v5 * b1;
      t10 += v5 * b22;
      t11 += v5 * b32;
      t12 += v5 * b42;
      t13 += v5 * b52;
      t14 += v5 * b62;
      t15 += v5 * b7;
      t16 += v5 * b8;
      t17 += v5 * b9;
      t18 += v5 * b10;
      t19 += v5 * b11;
      t20 += v5 * b12;
      t21 += v5 * b13;
      t22 += v5 * b14;
      t23 += v5 * b15;
      v5 = a3[9];
      t9 += v5 * b0;
      t10 += v5 * b1;
      t11 += v5 * b22;
      t12 += v5 * b32;
      t13 += v5 * b42;
      t14 += v5 * b52;
      t15 += v5 * b62;
      t16 += v5 * b7;
      t17 += v5 * b8;
      t18 += v5 * b9;
      t19 += v5 * b10;
      t20 += v5 * b11;
      t21 += v5 * b12;
      t22 += v5 * b13;
      t23 += v5 * b14;
      t24 += v5 * b15;
      v5 = a3[10];
      t10 += v5 * b0;
      t11 += v5 * b1;
      t12 += v5 * b22;
      t13 += v5 * b32;
      t14 += v5 * b42;
      t15 += v5 * b52;
      t16 += v5 * b62;
      t17 += v5 * b7;
      t18 += v5 * b8;
      t19 += v5 * b9;
      t20 += v5 * b10;
      t21 += v5 * b11;
      t22 += v5 * b12;
      t23 += v5 * b13;
      t24 += v5 * b14;
      t25 += v5 * b15;
      v5 = a3[11];
      t11 += v5 * b0;
      t12 += v5 * b1;
      t13 += v5 * b22;
      t14 += v5 * b32;
      t15 += v5 * b42;
      t16 += v5 * b52;
      t17 += v5 * b62;
      t18 += v5 * b7;
      t19 += v5 * b8;
      t20 += v5 * b9;
      t21 += v5 * b10;
      t22 += v5 * b11;
      t23 += v5 * b12;
      t24 += v5 * b13;
      t25 += v5 * b14;
      t26 += v5 * b15;
      v5 = a3[12];
      t12 += v5 * b0;
      t13 += v5 * b1;
      t14 += v5 * b22;
      t15 += v5 * b32;
      t16 += v5 * b42;
      t17 += v5 * b52;
      t18 += v5 * b62;
      t19 += v5 * b7;
      t20 += v5 * b8;
      t21 += v5 * b9;
      t22 += v5 * b10;
      t23 += v5 * b11;
      t24 += v5 * b12;
      t25 += v5 * b13;
      t26 += v5 * b14;
      t27 += v5 * b15;
      v5 = a3[13];
      t13 += v5 * b0;
      t14 += v5 * b1;
      t15 += v5 * b22;
      t16 += v5 * b32;
      t17 += v5 * b42;
      t18 += v5 * b52;
      t19 += v5 * b62;
      t20 += v5 * b7;
      t21 += v5 * b8;
      t22 += v5 * b9;
      t23 += v5 * b10;
      t24 += v5 * b11;
      t25 += v5 * b12;
      t26 += v5 * b13;
      t27 += v5 * b14;
      t28 += v5 * b15;
      v5 = a3[14];
      t14 += v5 * b0;
      t15 += v5 * b1;
      t16 += v5 * b22;
      t17 += v5 * b32;
      t18 += v5 * b42;
      t19 += v5 * b52;
      t20 += v5 * b62;
      t21 += v5 * b7;
      t22 += v5 * b8;
      t23 += v5 * b9;
      t24 += v5 * b10;
      t25 += v5 * b11;
      t26 += v5 * b12;
      t27 += v5 * b13;
      t28 += v5 * b14;
      t29 += v5 * b15;
      v5 = a3[15];
      t15 += v5 * b0;
      t16 += v5 * b1;
      t17 += v5 * b22;
      t18 += v5 * b32;
      t19 += v5 * b42;
      t20 += v5 * b52;
      t21 += v5 * b62;
      t22 += v5 * b7;
      t23 += v5 * b8;
      t24 += v5 * b9;
      t25 += v5 * b10;
      t26 += v5 * b11;
      t27 += v5 * b12;
      t28 += v5 * b13;
      t29 += v5 * b14;
      t30 += v5 * b15;
      t0 += 38 * t16;
      t1 += 38 * t17;
      t2 += 38 * t18;
      t3 += 38 * t19;
      t4 += 38 * t20;
      t5 += 38 * t21;
      t6 += 38 * t22;
      t7 += 38 * t23;
      t8 += 38 * t24;
      t9 += 38 * t25;
      t10 += 38 * t26;
      t11 += 38 * t27;
      t12 += 38 * t28;
      t13 += 38 * t29;
      t14 += 38 * t30;
      c5 = 1;
      v5 = t0 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t0 = v5 - c5 * 65536;
      v5 = t1 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t1 = v5 - c5 * 65536;
      v5 = t2 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t2 = v5 - c5 * 65536;
      v5 = t3 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t3 = v5 - c5 * 65536;
      v5 = t4 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t4 = v5 - c5 * 65536;
      v5 = t5 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t5 = v5 - c5 * 65536;
      v5 = t6 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t6 = v5 - c5 * 65536;
      v5 = t7 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t7 = v5 - c5 * 65536;
      v5 = t8 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t8 = v5 - c5 * 65536;
      v5 = t9 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t9 = v5 - c5 * 65536;
      v5 = t10 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t10 = v5 - c5 * 65536;
      v5 = t11 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t11 = v5 - c5 * 65536;
      v5 = t12 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t12 = v5 - c5 * 65536;
      v5 = t13 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t13 = v5 - c5 * 65536;
      v5 = t14 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t14 = v5 - c5 * 65536;
      v5 = t15 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t15 = v5 - c5 * 65536;
      t0 += c5 - 1 + 37 * (c5 - 1);
      c5 = 1;
      v5 = t0 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t0 = v5 - c5 * 65536;
      v5 = t1 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t1 = v5 - c5 * 65536;
      v5 = t2 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t2 = v5 - c5 * 65536;
      v5 = t3 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t3 = v5 - c5 * 65536;
      v5 = t4 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t4 = v5 - c5 * 65536;
      v5 = t5 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t5 = v5 - c5 * 65536;
      v5 = t6 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t6 = v5 - c5 * 65536;
      v5 = t7 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t7 = v5 - c5 * 65536;
      v5 = t8 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t8 = v5 - c5 * 65536;
      v5 = t9 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t9 = v5 - c5 * 65536;
      v5 = t10 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t10 = v5 - c5 * 65536;
      v5 = t11 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t11 = v5 - c5 * 65536;
      v5 = t12 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t12 = v5 - c5 * 65536;
      v5 = t13 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t13 = v5 - c5 * 65536;
      v5 = t14 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t14 = v5 - c5 * 65536;
      v5 = t15 + c5 + 65535;
      c5 = Math.floor(v5 / 65536);
      t15 = v5 - c5 * 65536;
      t0 += c5 - 1 + 37 * (c5 - 1);
      o3[0] = t0;
      o3[1] = t1;
      o3[2] = t2;
      o3[3] = t3;
      o3[4] = t4;
      o3[5] = t5;
      o3[6] = t6;
      o3[7] = t7;
      o3[8] = t8;
      o3[9] = t9;
      o3[10] = t10;
      o3[11] = t11;
      o3[12] = t12;
      o3[13] = t13;
      o3[14] = t14;
      o3[15] = t15;
    }
    function square(o3, a3) {
      mul(o3, a3, a3);
    }
    function inv25519(o3, i3) {
      const c5 = gf();
      let a3;
      for (a3 = 0; a3 < 16; a3++) {
        c5[a3] = i3[a3];
      }
      for (a3 = 253; a3 >= 0; a3--) {
        square(c5, c5);
        if (a3 !== 2 && a3 !== 4) {
          mul(c5, c5, i3);
        }
      }
      for (a3 = 0; a3 < 16; a3++) {
        o3[a3] = c5[a3];
      }
    }
    function pow2523(o3, i3) {
      const c5 = gf();
      let a3;
      for (a3 = 0; a3 < 16; a3++) {
        c5[a3] = i3[a3];
      }
      for (a3 = 250; a3 >= 0; a3--) {
        square(c5, c5);
        if (a3 !== 1) {
          mul(c5, c5, i3);
        }
      }
      for (a3 = 0; a3 < 16; a3++) {
        o3[a3] = c5[a3];
      }
    }
    function edadd(p7, q3) {
      const a3 = gf(), b6 = gf(), c5 = gf(), d3 = gf(), e2 = gf(), f5 = gf(), g7 = gf(), h7 = gf(), t = gf();
      sub(a3, p7[1], p7[0]);
      sub(t, q3[1], q3[0]);
      mul(a3, a3, t);
      add(b6, p7[0], p7[1]);
      add(t, q3[0], q3[1]);
      mul(b6, b6, t);
      mul(c5, p7[3], q3[3]);
      mul(c5, c5, D22);
      mul(d3, p7[2], q3[2]);
      add(d3, d3, d3);
      sub(e2, b6, a3);
      sub(f5, d3, c5);
      add(g7, d3, c5);
      add(h7, b6, a3);
      mul(p7[0], e2, f5);
      mul(p7[1], h7, g7);
      mul(p7[2], g7, f5);
      mul(p7[3], e2, h7);
    }
    function cswap(p7, q3, b6) {
      for (let i3 = 0; i3 < 4; i3++) {
        sel25519(p7[i3], q3[i3], b6);
      }
    }
    function pack(r2, p7) {
      const tx = gf(), ty = gf(), zi = gf();
      inv25519(zi, p7[2]);
      mul(tx, p7[0], zi);
      mul(ty, p7[1], zi);
      pack25519(r2, ty);
      r2[31] ^= par25519(tx) << 7;
    }
    function scalarmult(p7, q3, s2) {
      set25519(p7[0], gf0);
      set25519(p7[1], gf1);
      set25519(p7[2], gf1);
      set25519(p7[3], gf0);
      for (let i3 = 255; i3 >= 0; --i3) {
        const b6 = s2[i3 / 8 | 0] >> (i3 & 7) & 1;
        cswap(p7, q3, b6);
        edadd(q3, p7);
        edadd(p7, p7);
        cswap(p7, q3, b6);
      }
    }
    function scalarbase(p7, s2) {
      const q3 = [gf(), gf(), gf(), gf()];
      set25519(q3[0], X4);
      set25519(q3[1], Y);
      set25519(q3[2], gf1);
      mul(q3[3], X4, Y);
      scalarmult(p7, q3, s2);
    }
    function generateKeyPairFromSeed2(seed) {
      if (seed.length !== exports.SEED_LENGTH) {
        throw new Error(`ed25519: seed must be ${exports.SEED_LENGTH} bytes`);
      }
      const d3 = (0, sha512_1.hash)(seed);
      d3[0] &= 248;
      d3[31] &= 127;
      d3[31] |= 64;
      const publicKey = new Uint8Array(32);
      const p7 = [gf(), gf(), gf(), gf()];
      scalarbase(p7, d3);
      pack(publicKey, p7);
      const secretKey = new Uint8Array(64);
      secretKey.set(seed);
      secretKey.set(publicKey, 32);
      return {
        publicKey,
        secretKey
      };
    }
    exports.generateKeyPairFromSeed = generateKeyPairFromSeed2;
    function generateKeyPair6(prng) {
      const seed = (0, random_1.randomBytes)(32, prng);
      const result = generateKeyPairFromSeed2(seed);
      (0, wipe_1.wipe)(seed);
      return result;
    }
    exports.generateKeyPair = generateKeyPair6;
    function extractPublicKeyFromSecretKey(secretKey) {
      if (secretKey.length !== exports.SECRET_KEY_LENGTH) {
        throw new Error(`ed25519: secret key must be ${exports.SECRET_KEY_LENGTH} bytes`);
      }
      return new Uint8Array(secretKey.subarray(32));
    }
    exports.extractPublicKeyFromSecretKey = extractPublicKeyFromSecretKey;
    var L5 = new Float64Array([
      237,
      211,
      245,
      92,
      26,
      99,
      18,
      88,
      214,
      156,
      247,
      162,
      222,
      249,
      222,
      20,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      16
    ]);
    function modL(r2, x3) {
      let carry;
      let i3;
      let j4;
      let k7;
      for (i3 = 63; i3 >= 32; --i3) {
        carry = 0;
        for (j4 = i3 - 32, k7 = i3 - 12; j4 < k7; ++j4) {
          x3[j4] += carry - 16 * x3[i3] * L5[j4 - (i3 - 32)];
          carry = Math.floor((x3[j4] + 128) / 256);
          x3[j4] -= carry * 256;
        }
        x3[j4] += carry;
        x3[i3] = 0;
      }
      carry = 0;
      for (j4 = 0; j4 < 32; j4++) {
        x3[j4] += carry - (x3[31] >> 4) * L5[j4];
        carry = x3[j4] >> 8;
        x3[j4] &= 255;
      }
      for (j4 = 0; j4 < 32; j4++) {
        x3[j4] -= carry * L5[j4];
      }
      for (i3 = 0; i3 < 32; i3++) {
        x3[i3 + 1] += x3[i3] >> 8;
        r2[i3] = x3[i3] & 255;
      }
    }
    function reduce(r2) {
      const x3 = new Float64Array(64);
      for (let i3 = 0; i3 < 64; i3++) {
        x3[i3] = r2[i3];
      }
      for (let i3 = 0; i3 < 64; i3++) {
        r2[i3] = 0;
      }
      modL(r2, x3);
    }
    function sign2(secretKey, message) {
      const x3 = new Float64Array(64);
      const p7 = [gf(), gf(), gf(), gf()];
      const d3 = (0, sha512_1.hash)(secretKey.subarray(0, 32));
      d3[0] &= 248;
      d3[31] &= 127;
      d3[31] |= 64;
      const signature = new Uint8Array(64);
      signature.set(d3.subarray(32), 32);
      const hs3 = new sha512_1.SHA512();
      hs3.update(signature.subarray(32));
      hs3.update(message);
      const r2 = hs3.digest();
      hs3.clean();
      reduce(r2);
      scalarbase(p7, r2);
      pack(signature, p7);
      hs3.reset();
      hs3.update(signature.subarray(0, 32));
      hs3.update(secretKey.subarray(32));
      hs3.update(message);
      const h7 = hs3.digest();
      reduce(h7);
      for (let i3 = 0; i3 < 32; i3++) {
        x3[i3] = r2[i3];
      }
      for (let i3 = 0; i3 < 32; i3++) {
        for (let j4 = 0; j4 < 32; j4++) {
          x3[i3 + j4] += h7[i3] * d3[j4];
        }
      }
      modL(signature.subarray(32), x3);
      return signature;
    }
    exports.sign = sign2;
    function unpackneg(r2, p7) {
      const t = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
      set25519(r2[2], gf1);
      unpack25519(r2[1], p7);
      square(num, r2[1]);
      mul(den, num, D6);
      sub(num, num, r2[2]);
      add(den, r2[2], den);
      square(den2, den);
      square(den4, den2);
      mul(den6, den4, den2);
      mul(t, den6, num);
      mul(t, t, den);
      pow2523(t, t);
      mul(t, t, num);
      mul(t, t, den);
      mul(t, t, den);
      mul(r2[0], t, den);
      square(chk, r2[0]);
      mul(chk, chk, den);
      if (neq25519(chk, num)) {
        mul(r2[0], r2[0], I2);
      }
      square(chk, r2[0]);
      mul(chk, chk, den);
      if (neq25519(chk, num)) {
        return -1;
      }
      if (par25519(r2[0]) === p7[31] >> 7) {
        sub(r2[0], gf0, r2[0]);
      }
      mul(r2[3], r2[0], r2[1]);
      return 0;
    }
    function verify2(publicKey, message, signature) {
      const t = new Uint8Array(32);
      const p7 = [gf(), gf(), gf(), gf()];
      const q3 = [gf(), gf(), gf(), gf()];
      if (signature.length !== exports.SIGNATURE_LENGTH) {
        throw new Error(`ed25519: signature must be ${exports.SIGNATURE_LENGTH} bytes`);
      }
      if (unpackneg(q3, publicKey)) {
        return false;
      }
      const hs3 = new sha512_1.SHA512();
      hs3.update(signature.subarray(0, 32));
      hs3.update(publicKey);
      hs3.update(message);
      const h7 = hs3.digest();
      reduce(h7);
      scalarmult(p7, q3, h7);
      scalarbase(q3, signature.subarray(32));
      edadd(p7, q3);
      pack(t, p7);
      if (verify32(signature, t)) {
        return false;
      }
      return true;
    }
    exports.verify = verify2;
    function convertPublicKeyToX25519(publicKey) {
      let q3 = [gf(), gf(), gf(), gf()];
      if (unpackneg(q3, publicKey)) {
        throw new Error("Ed25519: invalid public key");
      }
      let a3 = gf();
      let b6 = gf();
      let y7 = q3[1];
      add(a3, gf1, y7);
      sub(b6, gf1, y7);
      inv25519(b6, b6);
      mul(a3, a3, b6);
      let z4 = new Uint8Array(32);
      pack25519(z4, a3);
      return z4;
    }
    exports.convertPublicKeyToX25519 = convertPublicKeyToX25519;
    function convertSecretKeyToX25519(secretKey) {
      const d3 = (0, sha512_1.hash)(secretKey.subarray(0, 32));
      d3[0] &= 248;
      d3[31] &= 127;
      d3[31] |= 64;
      const o3 = new Uint8Array(d3.subarray(0, 32));
      (0, wipe_1.wipe)(d3);
      return o3;
    }
    exports.convertSecretKeyToX25519 = convertSecretKeyToX25519;
  }
});

// node_modules/@walletconnect/core/node_modules/query-string/index.js
var require_query_string2 = __commonJS({
  "node_modules/@walletconnect/core/node_modules/query-string/index.js"(exports) {
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
        return keysSorter(Object.keys(input)).sort((a3, b6) => Number(a3) - Number(b6)).map((key) => input[key]);
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
    function parse5(query, options) {
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
          for (const k7 of Object.keys(value)) {
            value[k7] = parseValue(value[k7], options);
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
    exports.parse = parse5;
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
      const keys2 = Object.keys(objectCopy);
      if (options.sort !== false) {
        keys2.sort(options.sort);
      }
      return keys2.map((key) => {
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
      }).filter((x3) => x3.length > 0).join("&");
    };
    exports.parseUrl = (url, options) => {
      options = Object.assign({
        decode: true
      }, options);
      const [url_, hash] = splitOnFirst(url, "#");
      return Object.assign(
        {
          url: url_.split("?")[0] || "",
          query: parse5(extract(url), options)
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

// node_modules/@walletconnect/environment/node_modules/tslib/tslib.es6.js
var tslib_es6_exports2 = {};
__export(tslib_es6_exports2, {
  __assign: () => __assign2,
  __asyncDelegator: () => __asyncDelegator2,
  __asyncGenerator: () => __asyncGenerator2,
  __asyncValues: () => __asyncValues2,
  __await: () => __await2,
  __awaiter: () => __awaiter2,
  __classPrivateFieldGet: () => __classPrivateFieldGet2,
  __classPrivateFieldSet: () => __classPrivateFieldSet2,
  __createBinding: () => __createBinding2,
  __decorate: () => __decorate2,
  __exportStar: () => __exportStar2,
  __extends: () => __extends2,
  __generator: () => __generator2,
  __importDefault: () => __importDefault2,
  __importStar: () => __importStar2,
  __makeTemplateObject: () => __makeTemplateObject2,
  __metadata: () => __metadata2,
  __param: () => __param2,
  __read: () => __read2,
  __rest: () => __rest2,
  __spread: () => __spread2,
  __spreadArrays: () => __spreadArrays2,
  __values: () => __values2
});
function __extends2(d3, b6) {
  extendStatics2(d3, b6);
  function __() {
    this.constructor = d3;
  }
  d3.prototype = b6 === null ? Object.create(b6) : (__.prototype = b6.prototype, new __());
}
function __rest2(s2, e2) {
  var t = {};
  for (var p7 in s2) if (Object.prototype.hasOwnProperty.call(s2, p7) && e2.indexOf(p7) < 0)
    t[p7] = s2[p7];
  if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i3 = 0, p7 = Object.getOwnPropertySymbols(s2); i3 < p7.length; i3++) {
      if (e2.indexOf(p7[i3]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p7[i3]))
        t[p7[i3]] = s2[p7[i3]];
    }
  return t;
}
function __decorate2(decorators, target, key, desc) {
  var c5 = arguments.length, r2 = c5 < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d3;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r2 = Reflect.decorate(decorators, target, key, desc);
  else for (var i3 = decorators.length - 1; i3 >= 0; i3--) if (d3 = decorators[i3]) r2 = (c5 < 3 ? d3(r2) : c5 > 3 ? d3(target, key, r2) : d3(target, key)) || r2;
  return c5 > 3 && r2 && Object.defineProperty(target, key, r2), r2;
}
function __param2(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
function __metadata2(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter2(thisArg, _arguments, P4, generator) {
  function adopt(value) {
    return value instanceof P4 ? value : new P4(function(resolve) {
      resolve(value);
    });
  }
  return new (P4 || (P4 = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e2) {
        reject(e2);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e2) {
        reject(e2);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator2(thisArg, body) {
  var _6 = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f5, y7, t, g7;
  return g7 = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g7[Symbol.iterator] = function() {
    return this;
  }), g7;
  function verb(n4) {
    return function(v5) {
      return step([n4, v5]);
    };
  }
  function step(op) {
    if (f5) throw new TypeError("Generator is already executing.");
    while (_6) try {
      if (f5 = 1, y7 && (t = op[0] & 2 ? y7["return"] : op[0] ? y7["throw"] || ((t = y7["return"]) && t.call(y7), 0) : y7.next) && !(t = t.call(y7, op[1])).done) return t;
      if (y7 = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _6.label++;
          return { value: op[1], done: false };
        case 5:
          _6.label++;
          y7 = op[1];
          op = [0];
          continue;
        case 7:
          op = _6.ops.pop();
          _6.trys.pop();
          continue;
        default:
          if (!(t = _6.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _6 = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _6.label = op[1];
            break;
          }
          if (op[0] === 6 && _6.label < t[1]) {
            _6.label = t[1];
            t = op;
            break;
          }
          if (t && _6.label < t[2]) {
            _6.label = t[2];
            _6.ops.push(op);
            break;
          }
          if (t[2]) _6.ops.pop();
          _6.trys.pop();
          continue;
      }
      op = body.call(thisArg, _6);
    } catch (e2) {
      op = [6, e2];
      y7 = 0;
    } finally {
      f5 = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __createBinding2(o3, m5, k7, k22) {
  if (k22 === void 0) k22 = k7;
  o3[k22] = m5[k7];
}
function __exportStar2(m5, exports) {
  for (var p7 in m5) if (p7 !== "default" && !exports.hasOwnProperty(p7)) exports[p7] = m5[p7];
}
function __values2(o3) {
  var s2 = typeof Symbol === "function" && Symbol.iterator, m5 = s2 && o3[s2], i3 = 0;
  if (m5) return m5.call(o3);
  if (o3 && typeof o3.length === "number") return {
    next: function() {
      if (o3 && i3 >= o3.length) o3 = void 0;
      return { value: o3 && o3[i3++], done: !o3 };
    }
  };
  throw new TypeError(s2 ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read2(o3, n4) {
  var m5 = typeof Symbol === "function" && o3[Symbol.iterator];
  if (!m5) return o3;
  var i3 = m5.call(o3), r2, ar2 = [], e2;
  try {
    while ((n4 === void 0 || n4-- > 0) && !(r2 = i3.next()).done) ar2.push(r2.value);
  } catch (error) {
    e2 = { error };
  } finally {
    try {
      if (r2 && !r2.done && (m5 = i3["return"])) m5.call(i3);
    } finally {
      if (e2) throw e2.error;
    }
  }
  return ar2;
}
function __spread2() {
  for (var ar2 = [], i3 = 0; i3 < arguments.length; i3++)
    ar2 = ar2.concat(__read2(arguments[i3]));
  return ar2;
}
function __spreadArrays2() {
  for (var s2 = 0, i3 = 0, il = arguments.length; i3 < il; i3++) s2 += arguments[i3].length;
  for (var r2 = Array(s2), k7 = 0, i3 = 0; i3 < il; i3++)
    for (var a3 = arguments[i3], j4 = 0, jl = a3.length; j4 < jl; j4++, k7++)
      r2[k7] = a3[j4];
  return r2;
}
function __await2(v5) {
  return this instanceof __await2 ? (this.v = v5, this) : new __await2(v5);
}
function __asyncGenerator2(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g7 = generator.apply(thisArg, _arguments || []), i3, q3 = [];
  return i3 = {}, verb("next"), verb("throw"), verb("return"), i3[Symbol.asyncIterator] = function() {
    return this;
  }, i3;
  function verb(n4) {
    if (g7[n4]) i3[n4] = function(v5) {
      return new Promise(function(a3, b6) {
        q3.push([n4, v5, a3, b6]) > 1 || resume(n4, v5);
      });
    };
  }
  function resume(n4, v5) {
    try {
      step(g7[n4](v5));
    } catch (e2) {
      settle(q3[0][3], e2);
    }
  }
  function step(r2) {
    r2.value instanceof __await2 ? Promise.resolve(r2.value.v).then(fulfill, reject) : settle(q3[0][2], r2);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f5, v5) {
    if (f5(v5), q3.shift(), q3.length) resume(q3[0][0], q3[0][1]);
  }
}
function __asyncDelegator2(o3) {
  var i3, p7;
  return i3 = {}, verb("next"), verb("throw", function(e2) {
    throw e2;
  }), verb("return"), i3[Symbol.iterator] = function() {
    return this;
  }, i3;
  function verb(n4, f5) {
    i3[n4] = o3[n4] ? function(v5) {
      return (p7 = !p7) ? { value: __await2(o3[n4](v5)), done: n4 === "return" } : f5 ? f5(v5) : v5;
    } : f5;
  }
}
function __asyncValues2(o3) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m5 = o3[Symbol.asyncIterator], i3;
  return m5 ? m5.call(o3) : (o3 = typeof __values2 === "function" ? __values2(o3) : o3[Symbol.iterator](), i3 = {}, verb("next"), verb("throw"), verb("return"), i3[Symbol.asyncIterator] = function() {
    return this;
  }, i3);
  function verb(n4) {
    i3[n4] = o3[n4] && function(v5) {
      return new Promise(function(resolve, reject) {
        v5 = o3[n4](v5), settle(resolve, reject, v5.done, v5.value);
      });
    };
  }
  function settle(resolve, reject, d3, v5) {
    Promise.resolve(v5).then(function(v6) {
      resolve({ value: v6, done: d3 });
    }, reject);
  }
}
function __makeTemplateObject2(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", { value: raw });
  } else {
    cooked.raw = raw;
  }
  return cooked;
}
function __importStar2(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) {
    for (var k7 in mod) if (Object.hasOwnProperty.call(mod, k7)) result[k7] = mod[k7];
  }
  result.default = mod;
  return result;
}
function __importDefault2(mod) {
  return mod && mod.__esModule ? mod : { default: mod };
}
function __classPrivateFieldGet2(receiver, privateMap) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }
  return privateMap.get(receiver);
}
function __classPrivateFieldSet2(receiver, privateMap, value) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to set private field on non-instance");
  }
  privateMap.set(receiver, value);
  return value;
}
var extendStatics2, __assign2;
var init_tslib_es62 = __esm({
  "node_modules/@walletconnect/environment/node_modules/tslib/tslib.es6.js"() {
    extendStatics2 = function(d3, b6) {
      extendStatics2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d4, b7) {
        d4.__proto__ = b7;
      } || function(d4, b7) {
        for (var p7 in b7) if (b7.hasOwnProperty(p7)) d4[p7] = b7[p7];
      };
      return extendStatics2(d3, b6);
    };
    __assign2 = function() {
      __assign2 = Object.assign || function __assign3(t) {
        for (var s2, i3 = 1, n4 = arguments.length; i3 < n4; i3++) {
          s2 = arguments[i3];
          for (var p7 in s2) if (Object.prototype.hasOwnProperty.call(s2, p7)) t[p7] = s2[p7];
        }
        return t;
      };
      return __assign2.apply(this, arguments);
    };
  }
});

// node_modules/@walletconnect/environment/dist/cjs/crypto.js
var require_crypto = __commonJS({
  "node_modules/@walletconnect/environment/dist/cjs/crypto.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isBrowserCryptoAvailable = exports.getSubtleCrypto = exports.getBrowerCrypto = void 0;
    function getBrowerCrypto() {
      return (global === null || global === void 0 ? void 0 : global.crypto) || (global === null || global === void 0 ? void 0 : global.msCrypto) || {};
    }
    exports.getBrowerCrypto = getBrowerCrypto;
    function getSubtleCrypto() {
      const browserCrypto = getBrowerCrypto();
      return browserCrypto.subtle || browserCrypto.webkitSubtle;
    }
    exports.getSubtleCrypto = getSubtleCrypto;
    function isBrowserCryptoAvailable() {
      return !!getBrowerCrypto() && !!getSubtleCrypto();
    }
    exports.isBrowserCryptoAvailable = isBrowserCryptoAvailable;
  }
});

// node_modules/@walletconnect/environment/dist/cjs/env.js
var require_env = __commonJS({
  "node_modules/@walletconnect/environment/dist/cjs/env.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isBrowser = exports.isNode = exports.isReactNative = void 0;
    function isReactNative() {
      return typeof document === "undefined" && typeof navigator !== "undefined" && navigator.product === "ReactNative";
    }
    exports.isReactNative = isReactNative;
    function isNode2() {
      return typeof process !== "undefined" && typeof process.versions !== "undefined" && typeof process.versions.node !== "undefined";
    }
    exports.isNode = isNode2;
    function isBrowser() {
      return !isReactNative() && !isNode2();
    }
    exports.isBrowser = isBrowser;
  }
});

// node_modules/@walletconnect/environment/dist/cjs/index.js
var require_cjs5 = __commonJS({
  "node_modules/@walletconnect/environment/dist/cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es62(), __toCommonJS(tslib_es6_exports2));
    tslib_1.__exportStar(require_crypto(), exports);
    tslib_1.__exportStar(require_env(), exports);
  }
});

// node_modules/@walletconnect/jsonrpc-ws-connection/node_modules/ws/browser.js
var require_browser2 = __commonJS({
  "node_modules/@walletconnect/jsonrpc-ws-connection/node_modules/ws/browser.js"(exports, module) {
    "use strict";
    module.exports = function() {
      throw new Error(
        "ws does not work in the browser. Browser clients must use the native WebSocket object"
      );
    };
  }
});

// node_modules/lodash.isequal/index.js
var require_lodash = __commonJS({
  "node_modules/lodash.isequal/index.js"(exports, module) {
    var LARGE_ARRAY_SIZE = 200;
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var asyncTag = "[object AsyncFunction]";
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var nullTag = "[object Null]";
    var objectTag = "[object Object]";
    var promiseTag = "[object Promise]";
    var proxyTag = "[object Proxy]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var undefinedTag = "[object Undefined]";
    var weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = function() {
      try {
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e2) {
      }
    }();
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    function arrayFilter(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }
    function arrayPush(array, values) {
      var index = -1, length = values.length, offset = array.length;
      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }
    function arraySome(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }
    function baseTimes(n4, iteratee) {
      var index = -1, result = Array(n4);
      while (++index < n4) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    function mapToArray(map) {
      var index = -1, result = Array(map.size);
      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    function setToArray(set2) {
      var index = -1, result = Array(set2.size);
      set2.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    var arrayProto = Array.prototype;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var maskSrcKey = function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var nativeObjectToString = objectProto.toString;
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var Buffer2 = moduleExports ? root.Buffer : void 0;
    var Symbol2 = root.Symbol;
    var Uint8Array2 = root.Uint8Array;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var splice = arrayProto.splice;
    var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    var nativeGetSymbols = Object.getOwnPropertySymbols;
    var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
    var nativeKeys = overArg(Object.keys, Object);
    var DataView2 = getNative(root, "DataView");
    var Map2 = getNative(root, "Map");
    var Promise2 = getNative(root, "Promise");
    var Set2 = getNative(root, "Set");
    var WeakMap = getNative(root, "WeakMap");
    var nativeCreate = getNative(Object, "create");
    var dataViewCtorString = toSource(DataView2);
    var mapCtorString = toSource(Map2);
    var promiseCtorString = toSource(Promise2);
    var setCtorString = toSource(Set2);
    var weakMapCtorString = toSource(WeakMap);
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
    function Hash(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    function mapCacheDelete(key) {
      var result = getMapData(this, key)["delete"](key);
      this.size -= result ? 1 : 0;
      return result;
    }
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    function mapCacheSet(key, value) {
      var data = getMapData(this, key), size = data.size;
      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function SetCache(values) {
      var index = -1, length = values == null ? 0 : values.length;
      this.__data__ = new MapCache();
      while (++index < length) {
        this.add(values[index]);
      }
    }
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }
    function setCacheHas(value) {
      return this.__data__.has(value);
    }
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }
    function stackClear() {
      this.__data__ = new ListCache();
      this.size = 0;
    }
    function stackDelete(key) {
      var data = this.__data__, result = data["delete"](key);
      this.size = data.size;
      return result;
    }
    function stackGet(key) {
      return this.__data__.get(key);
    }
    function stackHas(key) {
      return this.__data__.has(key);
    }
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }
    Stack.prototype.clear = stackClear;
    Stack.prototype["delete"] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
        (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
        isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }
    function baseGetTag(value) {
      if (value == null) {
        return value === void 0 ? undefinedTag : nullTag;
      }
      return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    }
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;
      var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack());
        return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
          stack || (stack = new Stack());
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack());
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseIsTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      var stacked = stack.get(array);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : void 0;
      stack.set(array, other);
      stack.set(other, array);
      while (++index < arrLength) {
        var arrValue = array[index], othValue = other[index];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== void 0) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        if (seen) {
          if (!arraySome(other, function(othValue2, othIndex) {
            if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
            result = false;
            break;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          result = false;
          break;
        }
      }
      stack["delete"](array);
      stack["delete"](other);
      return result;
    }
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;
        case arrayBufferTag:
          if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
            return false;
          }
          return true;
        case boolTag:
        case dateTag:
        case numberTag:
          return eq(+object, +other);
        case errorTag:
          return object.name == other.name && object.message == other.message;
        case regexpTag:
        case stringTag:
          return object == other + "";
        case mapTag:
          var convert = mapToArray;
        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);
          if (object.size != other.size && !isPartial) {
            return false;
          }
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack["delete"](object);
          return result;
        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      var stacked = stack.get(object);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);
      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key], othValue = other[key];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
        }
        if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == "constructor");
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor, othCtor = other.constructor;
        if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack["delete"](object);
      stack["delete"](other);
      return result;
    }
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys2, getSymbols);
    }
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
      try {
        value[symToStringTag] = void 0;
        var unmasked = true;
      } catch (e2) {
      }
      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };
    var getTag = baseGetTag;
    if (DataView2 && getTag(new DataView2(new ArrayBuffer(1))) != dataViewTag || Map2 && getTag(new Map2()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set2 && getTag(new Set2()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
      getTag = function(value) {
        var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString:
              return dataViewTag;
            case mapCtorString:
              return mapTag;
            case promiseCtorString:
              return promiseTag;
            case setCtorString:
              return setTag;
            case weakMapCtorString:
              return weakMapTag;
          }
        }
        return result;
      };
    }
    function isIndex(value, length) {
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (typeof value == "number" || reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e2) {
        }
        try {
          return func + "";
        } catch (e2) {
        }
      }
      return "";
    }
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    var isArguments = baseIsArguments(/* @__PURE__ */ function() {
      return arguments;
    }()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
    };
    var isArray = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    var isBuffer = nativeIsBuffer || stubFalse;
    function isEqual(value, other) {
      return baseIsEqual(value, other);
    }
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return value != null && typeof value == "object";
    }
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
    function keys2(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }
    function stubArray() {
      return [];
    }
    function stubFalse() {
      return false;
    }
    module.exports = isEqual;
  }
});

// node_modules/@walletconnect/sign-client/node_modules/query-string/index.js
var require_query_string3 = __commonJS({
  "node_modules/@walletconnect/sign-client/node_modules/query-string/index.js"(exports) {
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
        return keysSorter(Object.keys(input)).sort((a3, b6) => Number(a3) - Number(b6)).map((key) => input[key]);
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
    function parse5(query, options) {
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
          for (const k7 of Object.keys(value)) {
            value[k7] = parseValue(value[k7], options);
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
    exports.parse = parse5;
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
      const keys2 = Object.keys(objectCopy);
      if (options.sort !== false) {
        keys2.sort(options.sort);
      }
      return keys2.map((key) => {
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
      }).filter((x3) => x3.length > 0).join("&");
    };
    exports.parseUrl = (url, options) => {
      options = Object.assign({
        decode: true
      }, options);
      const [url_, hash] = splitOnFirst(url, "#");
      return Object.assign(
        {
          url: url_.split("?")[0] || "",
          query: parse5(extract(url), options)
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

// node_modules/@walletconnect/universal-provider/node_modules/query-string/index.js
var require_query_string4 = __commonJS({
  "node_modules/@walletconnect/universal-provider/node_modules/query-string/index.js"(exports) {
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
        return keysSorter(Object.keys(input)).sort((a3, b6) => Number(a3) - Number(b6)).map((key) => input[key]);
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
    function parse5(query, options) {
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
          for (const k7 of Object.keys(value)) {
            value[k7] = parseValue(value[k7], options);
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
    exports.parse = parse5;
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
      const keys2 = Object.keys(objectCopy);
      if (options.sort !== false) {
        keys2.sort(options.sort);
      }
      return keys2.map((key) => {
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
      }).filter((x3) => x3.length > 0).join("&");
    };
    exports.parseUrl = (url, options) => {
      options = Object.assign({
        decode: true
      }, options);
      const [url_, hash] = splitOnFirst(url, "#");
      return Object.assign(
        {
          url: url_.split("?")[0] || "",
          query: parse5(extract(url), options)
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

// node_modules/cross-fetch/dist/browser-ponyfill.js
var require_browser_ponyfill = __commonJS({
  "node_modules/cross-fetch/dist/browser-ponyfill.js"(exports, module) {
    var global2 = typeof self !== "undefined" ? self : exports;
    var __self__ = function() {
      function F4() {
        this.fetch = false;
        this.DOMException = global2.DOMException;
      }
      F4.prototype = global2;
      return new F4();
    }();
    (function(self2) {
      var irrelevant = function(exports2) {
        var support = {
          searchParams: "URLSearchParams" in self2,
          iterable: "Symbol" in self2 && "iterator" in Symbol,
          blob: "FileReader" in self2 && "Blob" in self2 && function() {
            try {
              new Blob();
              return true;
            } catch (e2) {
              return false;
            }
          }(),
          formData: "FormData" in self2,
          arrayBuffer: "ArrayBuffer" in self2
        };
        function isDataView(obj) {
          return obj && DataView.prototype.isPrototypeOf(obj);
        }
        if (support.arrayBuffer) {
          var viewClasses = [
            "[object Int8Array]",
            "[object Uint8Array]",
            "[object Uint8ClampedArray]",
            "[object Int16Array]",
            "[object Uint16Array]",
            "[object Int32Array]",
            "[object Uint32Array]",
            "[object Float32Array]",
            "[object Float64Array]"
          ];
          var isArrayBufferView = ArrayBuffer.isView || function(obj) {
            return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
          };
        }
        function normalizeName(name) {
          if (typeof name !== "string") {
            name = String(name);
          }
          if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
            throw new TypeError("Invalid character in header field name");
          }
          return name.toLowerCase();
        }
        function normalizeValue(value) {
          if (typeof value !== "string") {
            value = String(value);
          }
          return value;
        }
        function iteratorFor(items) {
          var iterator = {
            next: function() {
              var value = items.shift();
              return { done: value === void 0, value };
            }
          };
          if (support.iterable) {
            iterator[Symbol.iterator] = function() {
              return iterator;
            };
          }
          return iterator;
        }
        function Headers(headers) {
          this.map = {};
          if (headers instanceof Headers) {
            headers.forEach(function(value, name) {
              this.append(name, value);
            }, this);
          } else if (Array.isArray(headers)) {
            headers.forEach(function(header) {
              this.append(header[0], header[1]);
            }, this);
          } else if (headers) {
            Object.getOwnPropertyNames(headers).forEach(function(name) {
              this.append(name, headers[name]);
            }, this);
          }
        }
        Headers.prototype.append = function(name, value) {
          name = normalizeName(name);
          value = normalizeValue(value);
          var oldValue = this.map[name];
          this.map[name] = oldValue ? oldValue + ", " + value : value;
        };
        Headers.prototype["delete"] = function(name) {
          delete this.map[normalizeName(name)];
        };
        Headers.prototype.get = function(name) {
          name = normalizeName(name);
          return this.has(name) ? this.map[name] : null;
        };
        Headers.prototype.has = function(name) {
          return this.map.hasOwnProperty(normalizeName(name));
        };
        Headers.prototype.set = function(name, value) {
          this.map[normalizeName(name)] = normalizeValue(value);
        };
        Headers.prototype.forEach = function(callback, thisArg) {
          for (var name in this.map) {
            if (this.map.hasOwnProperty(name)) {
              callback.call(thisArg, this.map[name], name, this);
            }
          }
        };
        Headers.prototype.keys = function() {
          var items = [];
          this.forEach(function(value, name) {
            items.push(name);
          });
          return iteratorFor(items);
        };
        Headers.prototype.values = function() {
          var items = [];
          this.forEach(function(value) {
            items.push(value);
          });
          return iteratorFor(items);
        };
        Headers.prototype.entries = function() {
          var items = [];
          this.forEach(function(value, name) {
            items.push([name, value]);
          });
          return iteratorFor(items);
        };
        if (support.iterable) {
          Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
        }
        function consumed(body) {
          if (body.bodyUsed) {
            return Promise.reject(new TypeError("Already read"));
          }
          body.bodyUsed = true;
        }
        function fileReaderReady(reader) {
          return new Promise(function(resolve, reject) {
            reader.onload = function() {
              resolve(reader.result);
            };
            reader.onerror = function() {
              reject(reader.error);
            };
          });
        }
        function readBlobAsArrayBuffer(blob) {
          var reader = new FileReader();
          var promise = fileReaderReady(reader);
          reader.readAsArrayBuffer(blob);
          return promise;
        }
        function readBlobAsText(blob) {
          var reader = new FileReader();
          var promise = fileReaderReady(reader);
          reader.readAsText(blob);
          return promise;
        }
        function readArrayBufferAsText(buf) {
          var view = new Uint8Array(buf);
          var chars = new Array(view.length);
          for (var i3 = 0; i3 < view.length; i3++) {
            chars[i3] = String.fromCharCode(view[i3]);
          }
          return chars.join("");
        }
        function bufferClone(buf) {
          if (buf.slice) {
            return buf.slice(0);
          } else {
            var view = new Uint8Array(buf.byteLength);
            view.set(new Uint8Array(buf));
            return view.buffer;
          }
        }
        function Body() {
          this.bodyUsed = false;
          this._initBody = function(body) {
            this._bodyInit = body;
            if (!body) {
              this._bodyText = "";
            } else if (typeof body === "string") {
              this._bodyText = body;
            } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
              this._bodyBlob = body;
            } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
              this._bodyFormData = body;
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this._bodyText = body.toString();
            } else if (support.arrayBuffer && support.blob && isDataView(body)) {
              this._bodyArrayBuffer = bufferClone(body.buffer);
              this._bodyInit = new Blob([this._bodyArrayBuffer]);
            } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
              this._bodyArrayBuffer = bufferClone(body);
            } else {
              this._bodyText = body = Object.prototype.toString.call(body);
            }
            if (!this.headers.get("content-type")) {
              if (typeof body === "string") {
                this.headers.set("content-type", "text/plain;charset=UTF-8");
              } else if (this._bodyBlob && this._bodyBlob.type) {
                this.headers.set("content-type", this._bodyBlob.type);
              } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
              }
            }
          };
          if (support.blob) {
            this.blob = function() {
              var rejected = consumed(this);
              if (rejected) {
                return rejected;
              }
              if (this._bodyBlob) {
                return Promise.resolve(this._bodyBlob);
              } else if (this._bodyArrayBuffer) {
                return Promise.resolve(new Blob([this._bodyArrayBuffer]));
              } else if (this._bodyFormData) {
                throw new Error("could not read FormData body as blob");
              } else {
                return Promise.resolve(new Blob([this._bodyText]));
              }
            };
            this.arrayBuffer = function() {
              if (this._bodyArrayBuffer) {
                return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
              } else {
                return this.blob().then(readBlobAsArrayBuffer);
              }
            };
          }
          this.text = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected;
            }
            if (this._bodyBlob) {
              return readBlobAsText(this._bodyBlob);
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
            } else if (this._bodyFormData) {
              throw new Error("could not read FormData body as text");
            } else {
              return Promise.resolve(this._bodyText);
            }
          };
          if (support.formData) {
            this.formData = function() {
              return this.text().then(decode);
            };
          }
          this.json = function() {
            return this.text().then(JSON.parse);
          };
          return this;
        }
        var methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
        function normalizeMethod(method) {
          var upcased = method.toUpperCase();
          return methods.indexOf(upcased) > -1 ? upcased : method;
        }
        function Request(input, options) {
          options = options || {};
          var body = options.body;
          if (input instanceof Request) {
            if (input.bodyUsed) {
              throw new TypeError("Already read");
            }
            this.url = input.url;
            this.credentials = input.credentials;
            if (!options.headers) {
              this.headers = new Headers(input.headers);
            }
            this.method = input.method;
            this.mode = input.mode;
            this.signal = input.signal;
            if (!body && input._bodyInit != null) {
              body = input._bodyInit;
              input.bodyUsed = true;
            }
          } else {
            this.url = String(input);
          }
          this.credentials = options.credentials || this.credentials || "same-origin";
          if (options.headers || !this.headers) {
            this.headers = new Headers(options.headers);
          }
          this.method = normalizeMethod(options.method || this.method || "GET");
          this.mode = options.mode || this.mode || null;
          this.signal = options.signal || this.signal;
          this.referrer = null;
          if ((this.method === "GET" || this.method === "HEAD") && body) {
            throw new TypeError("Body not allowed for GET or HEAD requests");
          }
          this._initBody(body);
        }
        Request.prototype.clone = function() {
          return new Request(this, { body: this._bodyInit });
        };
        function decode(body) {
          var form = new FormData();
          body.trim().split("&").forEach(function(bytes) {
            if (bytes) {
              var split = bytes.split("=");
              var name = split.shift().replace(/\+/g, " ");
              var value = split.join("=").replace(/\+/g, " ");
              form.append(decodeURIComponent(name), decodeURIComponent(value));
            }
          });
          return form;
        }
        function parseHeaders(rawHeaders) {
          var headers = new Headers();
          var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
          preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
            var parts = line.split(":");
            var key = parts.shift().trim();
            if (key) {
              var value = parts.join(":").trim();
              headers.append(key, value);
            }
          });
          return headers;
        }
        Body.call(Request.prototype);
        function Response(bodyInit, options) {
          if (!options) {
            options = {};
          }
          this.type = "default";
          this.status = options.status === void 0 ? 200 : options.status;
          this.ok = this.status >= 200 && this.status < 300;
          this.statusText = "statusText" in options ? options.statusText : "OK";
          this.headers = new Headers(options.headers);
          this.url = options.url || "";
          this._initBody(bodyInit);
        }
        Body.call(Response.prototype);
        Response.prototype.clone = function() {
          return new Response(this._bodyInit, {
            status: this.status,
            statusText: this.statusText,
            headers: new Headers(this.headers),
            url: this.url
          });
        };
        Response.error = function() {
          var response = new Response(null, { status: 0, statusText: "" });
          response.type = "error";
          return response;
        };
        var redirectStatuses = [301, 302, 303, 307, 308];
        Response.redirect = function(url, status) {
          if (redirectStatuses.indexOf(status) === -1) {
            throw new RangeError("Invalid status code");
          }
          return new Response(null, { status, headers: { location: url } });
        };
        exports2.DOMException = self2.DOMException;
        try {
          new exports2.DOMException();
        } catch (err) {
          exports2.DOMException = function(message, name) {
            this.message = message;
            this.name = name;
            var error = Error(message);
            this.stack = error.stack;
          };
          exports2.DOMException.prototype = Object.create(Error.prototype);
          exports2.DOMException.prototype.constructor = exports2.DOMException;
        }
        function fetch2(input, init) {
          return new Promise(function(resolve, reject) {
            var request = new Request(input, init);
            if (request.signal && request.signal.aborted) {
              return reject(new exports2.DOMException("Aborted", "AbortError"));
            }
            var xhr = new XMLHttpRequest();
            function abortXhr() {
              xhr.abort();
            }
            xhr.onload = function() {
              var options = {
                status: xhr.status,
                statusText: xhr.statusText,
                headers: parseHeaders(xhr.getAllResponseHeaders() || "")
              };
              options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
              var body = "response" in xhr ? xhr.response : xhr.responseText;
              resolve(new Response(body, options));
            };
            xhr.onerror = function() {
              reject(new TypeError("Network request failed"));
            };
            xhr.ontimeout = function() {
              reject(new TypeError("Network request failed"));
            };
            xhr.onabort = function() {
              reject(new exports2.DOMException("Aborted", "AbortError"));
            };
            xhr.open(request.method, request.url, true);
            if (request.credentials === "include") {
              xhr.withCredentials = true;
            } else if (request.credentials === "omit") {
              xhr.withCredentials = false;
            }
            if ("responseType" in xhr && support.blob) {
              xhr.responseType = "blob";
            }
            request.headers.forEach(function(value, name) {
              xhr.setRequestHeader(name, value);
            });
            if (request.signal) {
              request.signal.addEventListener("abort", abortXhr);
              xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                  request.signal.removeEventListener("abort", abortXhr);
                }
              };
            }
            xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
          });
        }
        fetch2.polyfill = true;
        if (!self2.fetch) {
          self2.fetch = fetch2;
          self2.Headers = Headers;
          self2.Request = Request;
          self2.Response = Response;
        }
        exports2.Headers = Headers;
        exports2.Request = Request;
        exports2.Response = Response;
        exports2.fetch = fetch2;
        Object.defineProperty(exports2, "__esModule", { value: true });
        return exports2;
      }({});
    })(__self__);
    __self__.fetch.ponyfill = true;
    delete __self__.fetch.polyfill;
    var ctx = __self__;
    exports = ctx.fetch;
    exports.default = ctx.fetch;
    exports.fetch = ctx.fetch;
    exports.Headers = ctx.Headers;
    exports.Request = ctx.Request;
    exports.Response = ctx.Response;
    module.exports = exports;
  }
});

// node_modules/@walletconnect/ethereum-provider/dist/index.es.js
var import_events10 = __toESM(require_events());

// node_modules/@walletconnect/ethereum-provider/node_modules/@walletconnect/utils/dist/index.es.js
var import_chacha20poly1305 = __toESM(require_chacha20poly1305());
var import_hkdf = __toESM(require_hkdf());
var import_random = __toESM(require_random());
var import_sha256 = __toESM(require_sha256());
var fe = __toESM(require_x25519());
var import_time = __toESM(require_cjs());
var import_window_getters = __toESM(require_cjs2());
var import_window_metadata = __toESM(require_cjs3());
var M = __toESM(require_query_string());
function Un(e2, n4 = []) {
  const t = [];
  return Object.keys(e2).forEach((r2) => {
    if (n4.length && !n4.includes(r2)) return;
    const o3 = e2[r2];
    t.push(...o3.accounts);
  }), t;
}
var en = { INVALID_METHOD: { message: "Invalid method.", code: 1001 }, INVALID_EVENT: { message: "Invalid event.", code: 1002 }, INVALID_UPDATE_REQUEST: { message: "Invalid update request.", code: 1003 }, INVALID_EXTEND_REQUEST: { message: "Invalid extend request.", code: 1004 }, INVALID_SESSION_SETTLE_REQUEST: { message: "Invalid session settle request.", code: 1005 }, UNAUTHORIZED_METHOD: { message: "Unauthorized method.", code: 3001 }, UNAUTHORIZED_EVENT: { message: "Unauthorized event.", code: 3002 }, UNAUTHORIZED_UPDATE_REQUEST: { message: "Unauthorized update request.", code: 3003 }, UNAUTHORIZED_EXTEND_REQUEST: { message: "Unauthorized extend request.", code: 3004 }, USER_REJECTED: { message: "User rejected.", code: 5e3 }, USER_REJECTED_CHAINS: { message: "User rejected chains.", code: 5001 }, USER_REJECTED_METHODS: { message: "User rejected methods.", code: 5002 }, USER_REJECTED_EVENTS: { message: "User rejected events.", code: 5003 }, UNSUPPORTED_CHAINS: { message: "Unsupported chains.", code: 5100 }, UNSUPPORTED_METHODS: { message: "Unsupported methods.", code: 5101 }, UNSUPPORTED_EVENTS: { message: "Unsupported events.", code: 5102 }, UNSUPPORTED_ACCOUNTS: { message: "Unsupported accounts.", code: 5103 }, UNSUPPORTED_NAMESPACE_KEY: { message: "Unsupported namespace key.", code: 5104 }, USER_DISCONNECTED: { message: "User disconnected.", code: 6e3 }, SESSION_SETTLEMENT_FAILED: { message: "Session settlement failed.", code: 7e3 }, WC_METHOD_UNSUPPORTED: { message: "Unsupported wc_ method.", code: 10001 } };
function U(e2, n4) {
  const { message: t, code: r2 } = en[e2];
  return { message: n4 ? `${t} ${n4}` : t, code: r2 };
}
function k(e2, n4) {
  return Array.isArray(e2) ? typeof n4 < "u" && e2.length ? e2.every(n4) : true : false;
}

// node_modules/@walletconnect/core/dist/index.es.js
var import_events5 = __toESM(require_events());

// node_modules/destr/dist/index.mjs
var suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
var suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
var JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  const _value = value.trim();
  if (
    // eslint-disable-next-line unicorn/prefer-at
    value[0] === '"' && value.endsWith('"') && !value.includes("\\")
  ) {
    return _value.slice(1, -1);
  }
  if (_value.length <= 9) {
    const _lval = _value.toLowerCase();
    if (_lval === "true") {
      return true;
    }
    if (_lval === "false") {
      return false;
    }
    if (_lval === "undefined") {
      return void 0;
    }
    if (_lval === "null") {
      return null;
    }
    if (_lval === "nan") {
      return Number.NaN;
    }
    if (_lval === "infinity") {
      return Number.POSITIVE_INFINITY;
    }
    if (_lval === "-infinity") {
      return Number.NEGATIVE_INFINITY;
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

// node_modules/unstorage/dist/shared/unstorage.d569726e.mjs
function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error) {
    return Promise.reject(error);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify2(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify2(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
function checkBufferSupport() {
  if (typeof Buffer === "undefined") {
    throw new TypeError("[unstorage] Buffer is not supported!");
  }
}
var BASE64_PREFIX = "base64:";
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  checkBufferSupport();
  const base64 = Buffer.from(value).toString("base64");
  return BASE64_PREFIX + base64;
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  checkBufferSupport();
  return Buffer.from(value.slice(BASE64_PREFIX.length), "base64");
}
function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}
function joinKeys(...keys2) {
  return normalizeKey(keys2.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey(base);
  return base ? base + ":" : "";
}

// node_modules/unstorage/dist/index.mjs
function defineDriver(factory) {
  return factory;
}
var DRIVER_NAME = "memory";
var memory = defineDriver(() => {
  const data = /* @__PURE__ */ new Map();
  return {
    name: DRIVER_NAME,
    getInstance: () => data,
    hasItem(key) {
      return data.has(key);
    },
    getItem(key) {
      return data.get(key) ?? null;
    },
    getItemRaw(key) {
      return data.get(key) ?? null;
    },
    setItem(key, value) {
      data.set(key, value);
    },
    setItemRaw(key, value) {
      data.set(key, value);
    },
    removeItem(key) {
      data.delete(key);
    },
    getKeys() {
      return [...data.keys()];
    },
    clear() {
      data.clear();
    },
    dispose() {
      data.clear();
    }
  };
});
function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r2) => r2.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r2) => r2.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify2(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify2(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify2(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      for (const mount of mounts) {
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey(key);
          if (!maskedMounts.some((p7) => fullKey.startsWith(p7))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p7) => !p7.startsWith(mount.mountpoint))
        ];
      }
      return base ? allKeys.filter(
        (key) => key.startsWith(base) && key[key.length - 1] !== "$"
      ) : allKeys.filter((key) => key[key.length - 1] !== "$");
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m5) => {
          if (m5.driver.clear) {
            return asyncCall(m5.driver.clear, m5.relativeBase, opts);
          }
          if (m5.driver.removeItem) {
            const keys2 = await m5.driver.getKeys(m5.relativeBase || "", opts);
            return Promise.all(
              keys2.map((key) => m5.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a3, b6) => b6.length - a3.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey(key) + ":";
      const m5 = getMount(key);
      return {
        driver: m5.driver,
        base: m5.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m5) => ({
        driver: m5.driver,
        base: m5.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}

// node_modules/idb-keyval/dist/index.js
function promisifyRequest(request) {
  return new Promise((resolve, reject) => {
    request.oncomplete = request.onsuccess = () => resolve(request.result);
    request.onabort = request.onerror = () => reject(request.error);
  });
}
function createStore(dbName, storeName) {
  const request = indexedDB.open(dbName);
  request.onupgradeneeded = () => request.result.createObjectStore(storeName);
  const dbp = promisifyRequest(request);
  return (txMode, callback) => dbp.then((db) => callback(db.transaction(storeName, txMode).objectStore(storeName)));
}
var defaultGetStoreFunc;
function defaultGetStore() {
  if (!defaultGetStoreFunc) {
    defaultGetStoreFunc = createStore("keyval-store", "keyval");
  }
  return defaultGetStoreFunc;
}
function get(key, customStore = defaultGetStore()) {
  return customStore("readonly", (store) => promisifyRequest(store.get(key)));
}
function set(key, value, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.put(value, key);
    return promisifyRequest(store.transaction);
  });
}
function del(key, customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.delete(key);
    return promisifyRequest(store.transaction);
  });
}
function clear(customStore = defaultGetStore()) {
  return customStore("readwrite", (store) => {
    store.clear();
    return promisifyRequest(store.transaction);
  });
}
function eachCursor(store, callback) {
  store.openCursor().onsuccess = function() {
    if (!this.result)
      return;
    callback(this.result);
    this.result.continue();
  };
  return promisifyRequest(store.transaction);
}
function keys(customStore = defaultGetStore()) {
  return customStore("readonly", (store) => {
    if (store.getAllKeys) {
      return promisifyRequest(store.getAllKeys());
    }
    const items = [];
    return eachCursor(store, (cursor) => items.push(cursor.key)).then(() => items);
  });
}

// node_modules/@walletconnect/safe-json/dist/esm/index.js
var JSONStringify = (data) => JSON.stringify(data, (_6, value) => typeof value === "bigint" ? value.toString() + "n" : value);
var JSONParse = (json) => {
  const numbersBiggerThanMaxInt = /([\[:])?(\d{17,}|(?:[9](?:[1-9]07199254740991|0[1-9]7199254740991|00[8-9]199254740991|007[2-9]99254740991|007199[3-9]54740991|0071992[6-9]4740991|00719925[5-9]740991|007199254[8-9]40991|0071992547[5-9]0991|00719925474[1-9]991|00719925474099[2-9])))([,\}\]])/g;
  const serializedData = json.replace(numbersBiggerThanMaxInt, '$1"$2n"$3');
  return JSON.parse(serializedData, (_6, value) => {
    const isCustomFormatBigInt = typeof value === "string" && value.match(/^\d+n$/);
    if (isCustomFormatBigInt)
      return BigInt(value.substring(0, value.length - 1));
    return value;
  });
};
function safeJsonParse(value) {
  if (typeof value !== "string") {
    throw new Error(`Cannot safe json parse value of type ${typeof value}`);
  }
  try {
    return JSONParse(value);
  } catch (_a) {
    return value;
  }
}
function safeJsonStringify(value) {
  return typeof value === "string" ? value : JSONStringify(value) || "";
}

// node_modules/@walletconnect/keyvaluestorage/dist/index.es.js
var x = "idb-keyval";
var z = (i3 = {}) => {
  const t = i3.base && i3.base.length > 0 ? `${i3.base}:` : "", e2 = (s2) => t + s2;
  let n4;
  return i3.dbName && i3.storeName && (n4 = createStore(i3.dbName, i3.storeName)), { name: x, options: i3, async hasItem(s2) {
    return !(typeof await get(e2(s2), n4) > "u");
  }, async getItem(s2) {
    return await get(e2(s2), n4) ?? null;
  }, setItem(s2, a3) {
    return set(e2(s2), a3, n4);
  }, removeItem(s2) {
    return del(e2(s2), n4);
  }, getKeys() {
    return keys(n4);
  }, clear() {
    return clear(n4);
  } };
};
var D = "WALLET_CONNECT_V2_INDEXED_DB";
var E = "keyvaluestorage";
var _ = class {
  constructor() {
    this.indexedDb = createStorage({ driver: z({ dbName: D, storeName: E }) });
  }
  async getKeys() {
    return this.indexedDb.getKeys();
  }
  async getEntries() {
    return (await this.indexedDb.getItems(await this.indexedDb.getKeys())).map((t) => [t.key, t.value]);
  }
  async getItem(t) {
    const e2 = await this.indexedDb.getItem(t);
    if (e2 !== null) return e2;
  }
  async setItem(t, e2) {
    await this.indexedDb.setItem(t, safeJsonStringify(e2));
  }
  async removeItem(t) {
    await this.indexedDb.removeItem(t);
  }
};
var l = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
var c = { exports: {} };
(function() {
  let i3;
  function t() {
  }
  i3 = t, i3.prototype.getItem = function(e2) {
    return this.hasOwnProperty(e2) ? String(this[e2]) : null;
  }, i3.prototype.setItem = function(e2, n4) {
    this[e2] = String(n4);
  }, i3.prototype.removeItem = function(e2) {
    delete this[e2];
  }, i3.prototype.clear = function() {
    const e2 = this;
    Object.keys(e2).forEach(function(n4) {
      e2[n4] = void 0, delete e2[n4];
    });
  }, i3.prototype.key = function(e2) {
    return e2 = e2 || 0, Object.keys(this)[e2];
  }, i3.prototype.__defineGetter__("length", function() {
    return Object.keys(this).length;
  }), typeof l < "u" && l.localStorage ? c.exports = l.localStorage : typeof window < "u" && window.localStorage ? c.exports = window.localStorage : c.exports = new t();
})();
function k2(i3) {
  var t;
  return [i3[0], safeJsonParse((t = i3[1]) != null ? t : "")];
}
var K = class {
  constructor() {
    this.localStorage = c.exports;
  }
  async getKeys() {
    return Object.keys(this.localStorage);
  }
  async getEntries() {
    return Object.entries(this.localStorage).map(k2);
  }
  async getItem(t) {
    const e2 = this.localStorage.getItem(t);
    if (e2 !== null) return safeJsonParse(e2);
  }
  async setItem(t, e2) {
    this.localStorage.setItem(t, safeJsonStringify(e2));
  }
  async removeItem(t) {
    this.localStorage.removeItem(t);
  }
};
var N = "wc_storage_version";
var y = 1;
var O = async (i3, t, e2) => {
  const n4 = N, s2 = await t.getItem(n4);
  if (s2 && s2 >= y) {
    e2(t);
    return;
  }
  const a3 = await i3.getKeys();
  if (!a3.length) {
    e2(t);
    return;
  }
  const m5 = [];
  for (; a3.length; ) {
    const r2 = a3.shift();
    if (!r2) continue;
    const o3 = r2.toLowerCase();
    if (o3.includes("wc@") || o3.includes("walletconnect") || o3.includes("wc_") || o3.includes("wallet_connect")) {
      const f5 = await i3.getItem(r2);
      await t.setItem(r2, f5), m5.push(r2);
    }
  }
  await t.setItem(n4, y), e2(t), j(i3, m5);
};
var j = async (i3, t) => {
  t.length && t.forEach(async (e2) => {
    await i3.removeItem(e2);
  });
};
var h = class {
  constructor() {
    this.initialized = false, this.setInitialized = (e2) => {
      this.storage = e2, this.initialized = true;
    };
    const t = new K();
    this.storage = t;
    try {
      const e2 = new _();
      O(t, e2, this.setInitialized);
    } catch {
      this.initialized = true;
    }
  }
  async getKeys() {
    return await this.initialize(), this.storage.getKeys();
  }
  async getEntries() {
    return await this.initialize(), this.storage.getEntries();
  }
  async getItem(t) {
    return await this.initialize(), this.storage.getItem(t);
  }
  async setItem(t, e2) {
    return await this.initialize(), this.storage.setItem(t, e2);
  }
  async removeItem(t) {
    return await this.initialize(), this.storage.removeItem(t);
  }
  async initialize() {
    this.initialized || await new Promise((t) => {
      const e2 = setInterval(() => {
        this.initialized && (clearInterval(e2), t());
      }, 20);
    });
  }
};

// node_modules/@walletconnect/core/dist/index.es.js
var import_heartbeat = __toESM(require_cjs4());

// node_modules/@walletconnect/logger/dist/index.es.js
var import_pino = __toESM(require_browser());
var import_pino2 = __toESM(require_browser());
var c2 = { level: "info" };
var n = "custom_context";
var l2 = 1e3 * 1024;
var x2 = Object.defineProperty;
var S = Object.defineProperties;
var _2 = Object.getOwnPropertyDescriptors;
var p = Object.getOwnPropertySymbols;
var T = Object.prototype.hasOwnProperty;
var z2 = Object.prototype.propertyIsEnumerable;
var f = (r2, e2, t) => e2 in r2 ? x2(r2, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r2[e2] = t;
var i = (r2, e2) => {
  for (var t in e2 || (e2 = {})) T.call(e2, t) && f(r2, t, e2[t]);
  if (p) for (var t of p(e2)) z2.call(e2, t) && f(r2, t, e2[t]);
  return r2;
};
var g = (r2, e2) => S(r2, _2(e2));
function k3(r2) {
  return g(i({}, r2), { level: (r2 == null ? void 0 : r2.level) || c2.level });
}
function v(r2, e2 = n) {
  return r2[e2] || "";
}
function b(r2, e2, t = n) {
  return r2[t] = e2, r2;
}
function y2(r2, e2 = n) {
  let t = "";
  return typeof r2.bindings > "u" ? t = v(r2, e2) : t = r2.bindings().context || "", t;
}
function w(r2, e2, t = n) {
  const o3 = y2(r2, t);
  return o3.trim() ? `${o3}/${e2}` : e2;
}
function E2(r2, e2, t = n) {
  const o3 = w(r2, e2, t), a3 = r2.child({ context: o3 });
  return b(a3, o3, t);
}

// node_modules/@walletconnect/types/dist/index.es.js
init_esm();
var import_events2 = __toESM(require_events());
var n2 = class extends IEvents {
  constructor(s2) {
    super(), this.opts = s2, this.protocol = "wc", this.version = 2;
  }
};
var h3 = class extends IEvents {
  constructor(s2, t) {
    super(), this.core = s2, this.logger = t, this.records = /* @__PURE__ */ new Map();
  }
};
var a = class {
  constructor(s2, t) {
    this.logger = s2, this.core = t;
  }
};
var u = class extends IEvents {
  constructor(s2, t) {
    super(), this.relayer = s2, this.logger = t;
  }
};
var g2 = class extends IEvents {
  constructor(s2) {
    super();
  }
};
var p2 = class {
  constructor(s2, t, o3, w7) {
    this.core = s2, this.logger = t, this.name = o3;
  }
};
var d = class extends IEvents {
  constructor(s2, t) {
    super(), this.relayer = s2, this.logger = t;
  }
};
var E3 = class extends IEvents {
  constructor(s2, t) {
    super(), this.core = s2, this.logger = t;
  }
};
var y3 = class {
  constructor(s2, t) {
    this.projectId = s2, this.logger = t;
  }
};
var b2 = class {
  constructor(s2) {
    this.opts = s2, this.protocol = "wc", this.version = 2;
  }
};
var S2 = class {
  constructor(s2) {
    this.client = s2;
  }
};

// node_modules/@walletconnect/relay-auth/dist/esm/api.js
var ed25519 = __toESM(require_ed25519());
var import_random2 = __toESM(require_random());
var import_time2 = __toESM(require_cjs());

// node_modules/@walletconnect/relay-auth/dist/esm/constants.js
var JWT_IRIDIUM_ALG = "EdDSA";
var JWT_IRIDIUM_TYP = "JWT";
var JWT_DELIMITER = ".";
var JWT_ENCODING = "base64url";
var JSON_ENCODING = "utf8";
var DATA_ENCODING = "utf8";
var DID_DELIMITER = ":";
var DID_PREFIX = "did";
var DID_METHOD = "key";
var MULTICODEC_ED25519_ENCODING = "base58btc";
var MULTICODEC_ED25519_BASE = "z";
var MULTICODEC_ED25519_HEADER = "K36";
var KEY_PAIR_SEED_LENGTH = 32;

// node_modules/@walletconnect/relay-auth/dist/esm/utils.js
function encodeJSON(val) {
  return toString(fromString(safeJsonStringify(val), JSON_ENCODING), JWT_ENCODING);
}
function encodeIss(publicKey) {
  const header = fromString(MULTICODEC_ED25519_HEADER, MULTICODEC_ED25519_ENCODING);
  const multicodec = MULTICODEC_ED25519_BASE + toString(concat([header, publicKey]), MULTICODEC_ED25519_ENCODING);
  return [DID_PREFIX, DID_METHOD, multicodec].join(DID_DELIMITER);
}
function encodeSig(bytes) {
  return toString(bytes, JWT_ENCODING);
}
function encodeData(params) {
  return fromString([encodeJSON(params.header), encodeJSON(params.payload)].join(JWT_DELIMITER), DATA_ENCODING);
}
function encodeJWT(params) {
  return [
    encodeJSON(params.header),
    encodeJSON(params.payload),
    encodeSig(params.signature)
  ].join(JWT_DELIMITER);
}

// node_modules/@walletconnect/relay-auth/dist/esm/api.js
function generateKeyPair2(seed = (0, import_random2.randomBytes)(KEY_PAIR_SEED_LENGTH)) {
  return ed25519.generateKeyPairFromSeed(seed);
}
async function signJWT(sub, aud, ttl, keyPair, iat = (0, import_time2.fromMiliseconds)(Date.now())) {
  const header = { alg: JWT_IRIDIUM_ALG, typ: JWT_IRIDIUM_TYP };
  const iss = encodeIss(keyPair.publicKey);
  const exp = iat + ttl;
  const payload = { iss, sub, aud, iat, exp };
  const data = encodeData({ header, payload });
  const signature = ed25519.sign(keyPair.secretKey, data);
  return encodeJWT({ header, payload, signature });
}

// node_modules/@walletconnect/core/node_modules/@walletconnect/utils/dist/index.es.js
var import_chacha20poly13052 = __toESM(require_chacha20poly1305());
var import_hkdf2 = __toESM(require_hkdf());
var import_random3 = __toESM(require_random());
var import_sha2562 = __toESM(require_sha256());
var fe2 = __toESM(require_x25519());
var import_time3 = __toESM(require_cjs());
var import_window_getters2 = __toESM(require_cjs2());
var import_window_metadata2 = __toESM(require_cjs3());
var M2 = __toESM(require_query_string2());
var J = "base10";
var p3 = "base16";
var F = "base64pad";
var H = "utf8";
var Q = 0;
var _3 = 1;
var Dn = 0;
var Ie = 1;
var Z = 12;
var X = 32;
function kn() {
  const e2 = fe2.generateKeyPair();
  return { privateKey: toString(e2.secretKey, p3), publicKey: toString(e2.publicKey, p3) };
}
function Vn() {
  const e2 = (0, import_random3.randomBytes)(X);
  return toString(e2, p3);
}
function Mn(e2, n4) {
  const t = fe2.sharedKey(fromString(e2, p3), fromString(n4, p3), true), r2 = new import_hkdf2.HKDF(import_sha2562.SHA256, t).expand(X);
  return toString(r2, p3);
}
function Kn(e2) {
  const n4 = (0, import_sha2562.hash)(fromString(e2, p3));
  return toString(n4, p3);
}
function Ln(e2) {
  const n4 = (0, import_sha2562.hash)(fromString(e2, H));
  return toString(n4, p3);
}
function Pe(e2) {
  return fromString(`${e2}`, J);
}
function $(e2) {
  return Number(toString(e2, J));
}
function xn(e2) {
  const n4 = Pe(typeof e2.type < "u" ? e2.type : Q);
  if ($(n4) === _3 && typeof e2.senderPublicKey > "u") throw new Error("Missing sender public key for type 1 envelope");
  const t = typeof e2.senderPublicKey < "u" ? fromString(e2.senderPublicKey, p3) : void 0, r2 = typeof e2.iv < "u" ? fromString(e2.iv, p3) : (0, import_random3.randomBytes)(Z), o3 = new import_chacha20poly13052.ChaCha20Poly1305(fromString(e2.symKey, p3)).seal(r2, fromString(e2.message, H));
  return Re({ type: n4, sealed: o3, iv: r2, senderPublicKey: t });
}
function Fn(e2) {
  const n4 = new import_chacha20poly13052.ChaCha20Poly1305(fromString(e2.symKey, p3)), { sealed: t, iv: r2 } = ee(e2.encoded), o3 = n4.open(r2, t);
  if (o3 === null) throw new Error("Failed to decrypt");
  return toString(o3, H);
}
function Re(e2) {
  if ($(e2.type) === _3) {
    if (typeof e2.senderPublicKey > "u") throw new Error("Missing sender public key for type 1 envelope");
    return toString(concat([e2.type, e2.senderPublicKey, e2.iv, e2.sealed]), F);
  }
  return toString(concat([e2.type, e2.iv, e2.sealed]), F);
}
function ee(e2) {
  const n4 = fromString(e2, F), t = n4.slice(Dn, Ie), r2 = Ie;
  if ($(t) === _3) {
    const d3 = r2 + X, l4 = d3 + Z, c5 = n4.slice(r2, d3), u4 = n4.slice(d3, l4), a3 = n4.slice(l4);
    return { type: t, sealed: a3, iv: u4, senderPublicKey: c5 };
  }
  const o3 = r2 + Z, s2 = n4.slice(r2, o3), i3 = n4.slice(o3);
  return { type: t, sealed: i3, iv: s2 };
}
function Hn(e2, n4) {
  const t = ee(e2);
  return Te({ type: $(t.type), senderPublicKey: typeof t.senderPublicKey < "u" ? toString(t.senderPublicKey, p3) : void 0, receiverPublicKey: n4 == null ? void 0 : n4.receiverPublicKey });
}
function Te(e2) {
  const n4 = (e2 == null ? void 0 : e2.type) || Q;
  if (n4 === _3) {
    if (typeof (e2 == null ? void 0 : e2.senderPublicKey) > "u") throw new Error("missing sender public key");
    if (typeof (e2 == null ? void 0 : e2.receiverPublicKey) > "u") throw new Error("missing receiver public key");
  }
  return { type: n4, senderPublicKey: e2 == null ? void 0 : e2.senderPublicKey, receiverPublicKey: e2 == null ? void 0 : e2.receiverPublicKey };
}
function qn(e2) {
  return e2.type === _3 && typeof e2.senderPublicKey == "string" && typeof e2.receiverPublicKey == "string";
}
var Bn = Object.defineProperty;
var Ae = Object.getOwnPropertySymbols;
var Gn = Object.prototype.hasOwnProperty;
var Wn = Object.prototype.propertyIsEnumerable;
var Ue = (e2, n4, t) => n4 in e2 ? Bn(e2, n4, { enumerable: true, configurable: true, writable: true, value: t }) : e2[n4] = t;
var _e = (e2, n4) => {
  for (var t in n4 || (n4 = {})) Gn.call(n4, t) && Ue(e2, t, n4[t]);
  if (Ae) for (var t of Ae(n4)) Wn.call(n4, t) && Ue(e2, t, n4[t]);
  return e2;
};
var Ce = "ReactNative";
var m = { reactNative: "react-native", node: "node", browser: "browser", unknown: "unknown" };
var $e = "js";
function te() {
  return typeof process < "u" && typeof process.versions < "u" && typeof process.versions.node < "u";
}
function C2() {
  return !(0, import_window_getters2.getDocument)() && !!(0, import_window_getters2.getNavigator)() && navigator.product === Ce;
}
function D2() {
  return !te() && !!(0, import_window_getters2.getNavigator)();
}
function T2() {
  return C2() ? m.reactNative : te() ? m.node : D2() ? m.browser : m.unknown;
}
function Jn() {
  var e2;
  try {
    return C2() && typeof global < "u" && typeof (global == null ? void 0 : global.Application) < "u" ? (e2 = global.Application) == null ? void 0 : e2.applicationId : void 0;
  } catch {
    return;
  }
}
function De(e2, n4) {
  let t = M2.parse(e2);
  return t = _e(_e({}, t), n4), e2 = M2.stringify(t), e2;
}
function ke() {
  if (T2() === m.reactNative && typeof global < "u" && typeof (global == null ? void 0 : global.Platform) < "u") {
    const { OS: t, Version: r2 } = global.Platform;
    return [t, r2].join("-");
  }
  const e2 = detect();
  if (e2 === null) return "unknown";
  const n4 = e2.os ? e2.os.replace(" ", "").toLowerCase() : "unknown";
  return e2.type === "browser" ? [n4, e2.name, e2.version].join("-") : [n4, e2.version].join("-");
}
function Ve() {
  var e2;
  const n4 = T2();
  return n4 === m.browser ? [n4, ((e2 = (0, import_window_getters2.getLocation)()) == null ? void 0 : e2.host) || "unknown"].join(":") : n4;
}
function Me(e2, n4, t) {
  const r2 = ke(), o3 = Ve();
  return [[e2, n4].join("-"), [$e, t].join("-"), r2, o3].join("/");
}
function Xn({ protocol: e2, version: n4, relayUrl: t, sdkVersion: r2, auth: o3, projectId: s2, useOnCloseEvent: i3, bundleId: d3 }) {
  const l4 = t.split("?"), c5 = Me(e2, n4, r2), u4 = { auth: o3, ua: c5, projectId: s2, useOnCloseEvent: i3 || void 0, origin: d3 || void 0 }, a3 = De(l4[1] || "", u4);
  return l4[0] + "?" + a3;
}
function rt(e2) {
  return Object.fromEntries(e2.entries());
}
function ot(e2) {
  return new Map(Object.entries(e2));
}
function at(e2 = import_time3.FIVE_MINUTES, n4) {
  const t = (0, import_time3.toMiliseconds)(e2 || import_time3.FIVE_MINUTES);
  let r2, o3, s2;
  return { resolve: (i3) => {
    s2 && r2 && (clearTimeout(s2), r2(i3));
  }, reject: (i3) => {
    s2 && o3 && (clearTimeout(s2), o3(i3));
  }, done: () => new Promise((i3, d3) => {
    s2 = setTimeout(() => {
      d3(new Error(n4));
    }, t), r2 = i3, o3 = d3;
  }) };
}
function ut(e2, n4, t) {
  return new Promise(async (r2, o3) => {
    const s2 = setTimeout(() => o3(new Error(t)), n4);
    try {
      const i3 = await e2;
      r2(i3);
    } catch (i3) {
      o3(i3);
    }
    clearTimeout(s2);
  });
}
function re(e2, n4) {
  if (typeof n4 == "string" && n4.startsWith(`${e2}:`)) return n4;
  if (e2.toLowerCase() === "topic") {
    if (typeof n4 != "string") throw new Error('Value must be "string" for expirer target type: topic');
    return `topic:${n4}`;
  } else if (e2.toLowerCase() === "id") {
    if (typeof n4 != "number") throw new Error('Value must be "number" for expirer target type: id');
    return `id:${n4}`;
  }
  throw new Error(`Unknown expirer target type: ${e2}`);
}
function lt(e2) {
  return re("topic", e2);
}
function dt(e2) {
  return re("id", e2);
}
function ft(e2) {
  const [n4, t] = e2.split(":"), r2 = { id: void 0, topic: void 0 };
  if (n4 === "topic" && typeof t == "string") r2.topic = t;
  else if (n4 === "id" && Number.isInteger(Number(t))) r2.id = Number(t);
  else throw new Error(`Invalid target, expected id:number or topic:string, got ${n4}:${t}`);
  return r2;
}
function pt(e2, n4) {
  return (0, import_time3.fromMiliseconds)((n4 || Date.now()) + (0, import_time3.toMiliseconds)(e2));
}
function mt(e2) {
  return Date.now() >= (0, import_time3.toMiliseconds)(e2);
}
function yt(e2, n4) {
  return `${e2}${n4 ? `:${n4}` : ""}`;
}
var Fe = "irn";
function vt(e2) {
  return (e2 == null ? void 0 : e2.relay) || { protocol: Fe };
}
function Et(e2) {
  const n4 = C[e2];
  if (typeof n4 > "u") throw new Error(`Relay Protocol not supported: ${e2}`);
  return n4;
}
var bt = Object.defineProperty;
var He = Object.getOwnPropertySymbols;
var Nt = Object.prototype.hasOwnProperty;
var Ot = Object.prototype.propertyIsEnumerable;
var qe = (e2, n4, t) => n4 in e2 ? bt(e2, n4, { enumerable: true, configurable: true, writable: true, value: t }) : e2[n4] = t;
var St = (e2, n4) => {
  for (var t in n4 || (n4 = {})) Nt.call(n4, t) && qe(e2, t, n4[t]);
  if (He) for (var t of He(n4)) Ot.call(n4, t) && qe(e2, t, n4[t]);
  return e2;
};
function Be(e2, n4 = "-") {
  const t = {}, r2 = "relay" + n4;
  return Object.keys(e2).forEach((o3) => {
    if (o3.startsWith(r2)) {
      const s2 = o3.replace(r2, ""), i3 = e2[o3];
      t[s2] = i3;
    }
  }), t;
}
function wt(e2) {
  e2 = e2.includes("wc://") ? e2.replace("wc://", "") : e2, e2 = e2.includes("wc:") ? e2.replace("wc:", "") : e2;
  const n4 = e2.indexOf(":"), t = e2.indexOf("?") !== -1 ? e2.indexOf("?") : void 0, r2 = e2.substring(0, n4), o3 = e2.substring(n4 + 1, t).split("@"), s2 = typeof t < "u" ? e2.substring(t) : "", i3 = M2.parse(s2);
  return { protocol: r2, topic: Ge(o3[0]), version: parseInt(o3[1], 10), symKey: i3.symKey, relay: Be(i3) };
}
function Ge(e2) {
  return e2.startsWith("//") ? e2.substring(2) : e2;
}
function We(e2, n4 = "-") {
  const t = "relay", r2 = {};
  return Object.keys(e2).forEach((o3) => {
    const s2 = t + n4 + o3;
    e2[o3] && (r2[s2] = e2[o3]);
  }), r2;
}
function It(e2) {
  return `${e2.protocol}:${e2.topic}@${e2.version}?` + M2.stringify(St({ symKey: e2.symKey }, We(e2.relay)));
}
var en2 = { INVALID_METHOD: { message: "Invalid method.", code: 1001 }, INVALID_EVENT: { message: "Invalid event.", code: 1002 }, INVALID_UPDATE_REQUEST: { message: "Invalid update request.", code: 1003 }, INVALID_EXTEND_REQUEST: { message: "Invalid extend request.", code: 1004 }, INVALID_SESSION_SETTLE_REQUEST: { message: "Invalid session settle request.", code: 1005 }, UNAUTHORIZED_METHOD: { message: "Unauthorized method.", code: 3001 }, UNAUTHORIZED_EVENT: { message: "Unauthorized event.", code: 3002 }, UNAUTHORIZED_UPDATE_REQUEST: { message: "Unauthorized update request.", code: 3003 }, UNAUTHORIZED_EXTEND_REQUEST: { message: "Unauthorized extend request.", code: 3004 }, USER_REJECTED: { message: "User rejected.", code: 5e3 }, USER_REJECTED_CHAINS: { message: "User rejected chains.", code: 5001 }, USER_REJECTED_METHODS: { message: "User rejected methods.", code: 5002 }, USER_REJECTED_EVENTS: { message: "User rejected events.", code: 5003 }, UNSUPPORTED_CHAINS: { message: "Unsupported chains.", code: 5100 }, UNSUPPORTED_METHODS: { message: "Unsupported methods.", code: 5101 }, UNSUPPORTED_EVENTS: { message: "Unsupported events.", code: 5102 }, UNSUPPORTED_ACCOUNTS: { message: "Unsupported accounts.", code: 5103 }, UNSUPPORTED_NAMESPACE_KEY: { message: "Unsupported namespace key.", code: 5104 }, USER_DISCONNECTED: { message: "User disconnected.", code: 6e3 }, SESSION_SETTLEMENT_FAILED: { message: "Session settlement failed.", code: 7e3 }, WC_METHOD_UNSUPPORTED: { message: "Unsupported wc_ method.", code: 10001 } };
var nn = { NOT_INITIALIZED: { message: "Not initialized.", code: 1 }, NO_MATCHING_KEY: { message: "No matching key.", code: 2 }, RESTORE_WILL_OVERRIDE: { message: "Restore will override.", code: 3 }, RESUBSCRIBED: { message: "Resubscribed.", code: 4 }, MISSING_OR_INVALID: { message: "Missing or invalid.", code: 5 }, EXPIRED: { message: "Expired.", code: 6 }, UNKNOWN_TYPE: { message: "Unknown type.", code: 7 }, MISMATCHED_TOPIC: { message: "Mismatched topic.", code: 8 }, NON_CONFORMING_NAMESPACES: { message: "Non conforming namespaces.", code: 9 } };
function N2(e2, n4) {
  const { message: t, code: r2 } = nn[e2];
  return { message: n4 ? `${t} ${n4}` : t, code: r2 };
}
function U3(e2, n4) {
  const { message: t, code: r2 } = en2[e2];
  return { message: n4 ? `${t} ${n4}` : t, code: r2 };
}
function k4(e2, n4) {
  return Array.isArray(e2) ? typeof n4 < "u" && e2.length ? e2.every(n4) : true : false;
}
function w2(e2) {
  return typeof e2 > "u";
}
function h4(e2, n4) {
  return n4 && w2(e2) ? true : typeof e2 == "string" && !!e2.trim().length;
}
function kt(e2) {
  if (h4(e2, false)) try {
    return typeof new URL(e2) < "u";
  } catch {
    return false;
  }
  return false;
}
function Vt(e2) {
  var n4;
  return (n4 = e2 == null ? void 0 : e2.proposer) == null ? void 0 : n4.publicKey;
}
function Mt(e2) {
  return e2 == null ? void 0 : e2.topic;
}
function Ht(e2) {
  return typeof e2 < "u" && typeof e2 !== null;
}
function er() {
  const e2 = T2();
  return new Promise((n4) => {
    switch (e2) {
      case m.browser:
        n4(pn());
        break;
      case m.reactNative:
        n4(mn());
        break;
      case m.node:
        n4(yn());
        break;
      default:
        n4(true);
    }
  });
}
function pn() {
  return D2() && (navigator == null ? void 0 : navigator.onLine);
}
async function mn() {
  if (C2() && typeof global < "u" && global != null && global.NetInfo) {
    const e2 = await (global == null ? void 0 : global.NetInfo.fetch());
    return e2 == null ? void 0 : e2.isConnected;
  }
  return true;
}
function yn() {
  return true;
}
function nr(e2) {
  switch (T2()) {
    case m.browser:
      hn(e2);
      break;
    case m.reactNative:
      gn(e2);
      break;
    case m.node:
      break;
  }
}
function hn(e2) {
  !C2() && D2() && (window.addEventListener("online", () => e2(true)), window.addEventListener("offline", () => e2(false)));
}
function gn(e2) {
  C2() && typeof global < "u" && global != null && global.NetInfo && (global == null ? void 0 : global.NetInfo.addEventListener((n4) => e2(n4 == null ? void 0 : n4.isConnected)));
}

// node_modules/@walletconnect/core/dist/index.es.js
var import_time4 = __toESM(require_cjs());

// node_modules/@walletconnect/core/node_modules/@walletconnect/jsonrpc-provider/dist/esm/provider.js
var import_events3 = __toESM(require_events());

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/index.js
var esm_exports2 = {};
__export(esm_exports2, {
  DEFAULT_ERROR: () => DEFAULT_ERROR,
  IBaseJsonRpcProvider: () => n3,
  IEvents: () => e,
  IJsonRpcConnection: () => o,
  IJsonRpcProvider: () => r,
  INTERNAL_ERROR: () => INTERNAL_ERROR,
  INVALID_PARAMS: () => INVALID_PARAMS,
  INVALID_REQUEST: () => INVALID_REQUEST,
  METHOD_NOT_FOUND: () => METHOD_NOT_FOUND,
  PARSE_ERROR: () => PARSE_ERROR,
  RESERVED_ERROR_CODES: () => RESERVED_ERROR_CODES,
  SERVER_ERROR: () => SERVER_ERROR,
  SERVER_ERROR_CODE_RANGE: () => SERVER_ERROR_CODE_RANGE,
  STANDARD_ERROR_MAP: () => STANDARD_ERROR_MAP,
  formatErrorMessage: () => formatErrorMessage,
  formatJsonRpcError: () => formatJsonRpcError,
  formatJsonRpcRequest: () => formatJsonRpcRequest,
  formatJsonRpcResult: () => formatJsonRpcResult,
  getBigIntRpcId: () => getBigIntRpcId,
  getError: () => getError,
  getErrorByCode: () => getErrorByCode,
  isHttpUrl: () => isHttpUrl,
  isJsonRpcError: () => isJsonRpcError,
  isJsonRpcPayload: () => isJsonRpcPayload,
  isJsonRpcRequest: () => isJsonRpcRequest,
  isJsonRpcResponse: () => isJsonRpcResponse,
  isJsonRpcResult: () => isJsonRpcResult,
  isJsonRpcValidationInvalid: () => isJsonRpcValidationInvalid,
  isLocalhostUrl: () => isLocalhostUrl,
  isNodeJs: () => isNodeJs,
  isReservedErrorCode: () => isReservedErrorCode,
  isServerErrorCode: () => isServerErrorCode,
  isValidDefaultRoute: () => isValidDefaultRoute,
  isValidErrorCode: () => isValidErrorCode,
  isValidLeadingWildcardRoute: () => isValidLeadingWildcardRoute,
  isValidRoute: () => isValidRoute,
  isValidTrailingWildcardRoute: () => isValidTrailingWildcardRoute,
  isValidWildcardRoute: () => isValidWildcardRoute,
  isWsUrl: () => isWsUrl,
  parseConnectionError: () => parseConnectionError,
  payloadId: () => payloadId,
  validateJsonRpcError: () => validateJsonRpcError
});

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/constants.js
var PARSE_ERROR = "PARSE_ERROR";
var INVALID_REQUEST = "INVALID_REQUEST";
var METHOD_NOT_FOUND = "METHOD_NOT_FOUND";
var INVALID_PARAMS = "INVALID_PARAMS";
var INTERNAL_ERROR = "INTERNAL_ERROR";
var SERVER_ERROR = "SERVER_ERROR";
var RESERVED_ERROR_CODES = [-32700, -32600, -32601, -32602, -32603];
var SERVER_ERROR_CODE_RANGE = [-32e3, -32099];
var STANDARD_ERROR_MAP = {
  [PARSE_ERROR]: { code: -32700, message: "Parse error" },
  [INVALID_REQUEST]: { code: -32600, message: "Invalid Request" },
  [METHOD_NOT_FOUND]: { code: -32601, message: "Method not found" },
  [INVALID_PARAMS]: { code: -32602, message: "Invalid params" },
  [INTERNAL_ERROR]: { code: -32603, message: "Internal error" },
  [SERVER_ERROR]: { code: -32e3, message: "Server error" }
};
var DEFAULT_ERROR = SERVER_ERROR;

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/error.js
function isServerErrorCode(code) {
  return code <= SERVER_ERROR_CODE_RANGE[0] && code >= SERVER_ERROR_CODE_RANGE[1];
}
function isReservedErrorCode(code) {
  return RESERVED_ERROR_CODES.includes(code);
}
function isValidErrorCode(code) {
  return typeof code === "number";
}
function getError(type) {
  if (!Object.keys(STANDARD_ERROR_MAP).includes(type)) {
    return STANDARD_ERROR_MAP[DEFAULT_ERROR];
  }
  return STANDARD_ERROR_MAP[type];
}
function getErrorByCode(code) {
  const match = Object.values(STANDARD_ERROR_MAP).find((e2) => e2.code === code);
  if (!match) {
    return STANDARD_ERROR_MAP[DEFAULT_ERROR];
  }
  return match;
}
function validateJsonRpcError(response) {
  if (typeof response.error.code === "undefined") {
    return { valid: false, error: "Missing code for JSON-RPC error" };
  }
  if (typeof response.error.message === "undefined") {
    return { valid: false, error: "Missing message for JSON-RPC error" };
  }
  if (!isValidErrorCode(response.error.code)) {
    return {
      valid: false,
      error: `Invalid error code type for JSON-RPC: ${response.error.code}`
    };
  }
  if (isReservedErrorCode(response.error.code)) {
    const error = getErrorByCode(response.error.code);
    if (error.message !== STANDARD_ERROR_MAP[DEFAULT_ERROR].message && response.error.message === error.message) {
      return {
        valid: false,
        error: `Invalid error code message for JSON-RPC: ${response.error.code}`
      };
    }
  }
  return { valid: true };
}
function parseConnectionError(e2, url, type) {
  return e2.message.includes("getaddrinfo ENOTFOUND") || e2.message.includes("connect ECONNREFUSED") ? new Error(`Unavailable ${type} RPC url at ${url}`) : e2;
}

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/env.js
var env_exports = {};
__export(env_exports, {
  isNodeJs: () => isNodeJs
});
var import_environment = __toESM(require_cjs5());
__reExport(env_exports, __toESM(require_cjs5()));
var isNodeJs = import_environment.isNode;

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/index.js
__reExport(esm_exports2, env_exports);

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/format.js
function payloadId(entropy = 3) {
  const date = Date.now() * Math.pow(10, entropy);
  const extra = Math.floor(Math.random() * Math.pow(10, entropy));
  return date + extra;
}
function getBigIntRpcId(entropy = 6) {
  return BigInt(payloadId(entropy));
}
function formatJsonRpcRequest(method, params, id) {
  return {
    id: id || payloadId(),
    jsonrpc: "2.0",
    method,
    params
  };
}
function formatJsonRpcResult(id, result) {
  return {
    id,
    jsonrpc: "2.0",
    result
  };
}
function formatJsonRpcError(id, error, data) {
  return {
    id,
    jsonrpc: "2.0",
    error: formatErrorMessage(error, data)
  };
}
function formatErrorMessage(error, data) {
  if (typeof error === "undefined") {
    return getError(INTERNAL_ERROR);
  }
  if (typeof error === "string") {
    error = Object.assign(Object.assign({}, getError(SERVER_ERROR)), { message: error });
  }
  if (typeof data !== "undefined") {
    error.data = data;
  }
  if (isReservedErrorCode(error.code)) {
    error = getErrorByCode(error.code);
  }
  return error;
}

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/routing.js
function isValidRoute(route) {
  if (route.includes("*")) {
    return isValidWildcardRoute(route);
  }
  if (/\W/g.test(route)) {
    return false;
  }
  return true;
}
function isValidDefaultRoute(route) {
  return route === "*";
}
function isValidWildcardRoute(route) {
  if (isValidDefaultRoute(route)) {
    return true;
  }
  if (!route.includes("*")) {
    return false;
  }
  if (route.split("*").length !== 2) {
    return false;
  }
  if (route.split("*").filter((x3) => x3.trim() === "").length !== 1) {
    return false;
  }
  return true;
}
function isValidLeadingWildcardRoute(route) {
  return !isValidDefaultRoute(route) && isValidWildcardRoute(route) && !route.split("*")[0].trim();
}
function isValidTrailingWildcardRoute(route) {
  return !isValidDefaultRoute(route) && isValidWildcardRoute(route) && !route.split("*")[1].trim();
}

// node_modules/@walletconnect/jsonrpc-types/dist/index.es.js
var e = class {
};
var o = class extends e {
  constructor(c5) {
    super();
  }
};
var n3 = class extends e {
  constructor() {
    super();
  }
};
var r = class extends n3 {
  constructor(c5) {
    super();
  }
};

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/url.js
var HTTP_REGEX = "^https?:";
var WS_REGEX = "^wss?:";
function getUrlProtocol(url) {
  const matches = url.match(new RegExp(/^\w+:/, "gi"));
  if (!matches || !matches.length)
    return;
  return matches[0];
}
function matchRegexProtocol(url, regex) {
  const protocol = getUrlProtocol(url);
  if (typeof protocol === "undefined")
    return false;
  return new RegExp(regex).test(protocol);
}
function isHttpUrl(url) {
  return matchRegexProtocol(url, HTTP_REGEX);
}
function isWsUrl(url) {
  return matchRegexProtocol(url, WS_REGEX);
}
function isLocalhostUrl(url) {
  return new RegExp("wss?://localhost(:d{2,5})?").test(url);
}

// node_modules/@walletconnect/jsonrpc-utils/dist/esm/validators.js
function isJsonRpcPayload(payload) {
  return typeof payload === "object" && "id" in payload && "jsonrpc" in payload && payload.jsonrpc === "2.0";
}
function isJsonRpcRequest(payload) {
  return isJsonRpcPayload(payload) && "method" in payload;
}
function isJsonRpcResponse(payload) {
  return isJsonRpcPayload(payload) && (isJsonRpcResult(payload) || isJsonRpcError(payload));
}
function isJsonRpcResult(payload) {
  return "result" in payload;
}
function isJsonRpcError(payload) {
  return "error" in payload;
}
function isJsonRpcValidationInvalid(validation) {
  return "error" in validation && validation.valid === false;
}

// node_modules/@walletconnect/core/node_modules/@walletconnect/jsonrpc-provider/dist/esm/provider.js
var JsonRpcProvider = class extends r {
  constructor(connection) {
    super(connection);
    this.events = new import_events3.EventEmitter();
    this.hasRegisteredEventListeners = false;
    this.connection = this.setConnection(connection);
    if (this.connection.connected) {
      this.registerEventListeners();
    }
  }
  async connect(connection = this.connection) {
    await this.open(connection);
  }
  async disconnect() {
    await this.close();
  }
  on(event, listener) {
    this.events.on(event, listener);
  }
  once(event, listener) {
    this.events.once(event, listener);
  }
  off(event, listener) {
    this.events.off(event, listener);
  }
  removeListener(event, listener) {
    this.events.removeListener(event, listener);
  }
  async request(request, context) {
    return this.requestStrict(formatJsonRpcRequest(request.method, request.params || [], request.id || getBigIntRpcId().toString()), context);
  }
  async requestStrict(request, context) {
    return new Promise(async (resolve, reject) => {
      if (!this.connection.connected) {
        try {
          await this.open();
        } catch (e2) {
          reject(e2);
        }
      }
      this.events.on(`${request.id}`, (response) => {
        if (isJsonRpcError(response)) {
          reject(response.error);
        } else {
          resolve(response.result);
        }
      });
      try {
        await this.connection.send(request, context);
      } catch (e2) {
        reject(e2);
      }
    });
  }
  setConnection(connection = this.connection) {
    return connection;
  }
  onPayload(payload) {
    this.events.emit("payload", payload);
    if (isJsonRpcResponse(payload)) {
      this.events.emit(`${payload.id}`, payload);
    } else {
      this.events.emit("message", {
        type: payload.method,
        data: payload.params
      });
    }
  }
  onClose(event) {
    if (event && event.code === 3e3) {
      this.events.emit("error", new Error(`WebSocket connection closed abnormally with code: ${event.code} ${event.reason ? `(${event.reason})` : ""}`));
    }
    this.events.emit("disconnect");
  }
  async open(connection = this.connection) {
    if (this.connection === connection && this.connection.connected)
      return;
    if (this.connection.connected)
      this.close();
    if (typeof connection === "string") {
      await this.connection.open(connection);
      connection = this.connection;
    }
    this.connection = this.setConnection(connection);
    await this.connection.open();
    this.registerEventListeners();
    this.events.emit("connect");
  }
  async close() {
    await this.connection.close();
  }
  registerEventListeners() {
    if (this.hasRegisteredEventListeners)
      return;
    this.connection.on("payload", (payload) => this.onPayload(payload));
    this.connection.on("close", (event) => this.onClose(event));
    this.connection.on("error", (error) => this.events.emit("error", error));
    this.connection.on("register_error", (error) => this.onClose());
    this.hasRegisteredEventListeners = true;
  }
};

// node_modules/@walletconnect/jsonrpc-ws-connection/dist/index.es.js
var import_events4 = __toESM(require_events());
var w3 = () => typeof WebSocket < "u" ? WebSocket : typeof global < "u" && typeof global.WebSocket < "u" ? global.WebSocket : typeof window < "u" && typeof window.WebSocket < "u" ? window.WebSocket : typeof self < "u" && typeof self.WebSocket < "u" ? self.WebSocket : require_browser2();
var b3 = () => typeof WebSocket < "u" || typeof global < "u" && typeof global.WebSocket < "u" || typeof window < "u" && typeof window.WebSocket < "u" || typeof self < "u" && typeof self.WebSocket < "u";
var a2 = (c5) => c5.split("?")[0];
var h5 = 10;
var S3 = w3();
var f2 = class {
  constructor(e2) {
    if (this.url = e2, this.events = new import_events4.EventEmitter(), this.registering = false, !isWsUrl(e2)) throw new Error(`Provided URL is not compatible with WebSocket connection: ${e2}`);
    this.url = e2;
  }
  get connected() {
    return typeof this.socket < "u";
  }
  get connecting() {
    return this.registering;
  }
  on(e2, t) {
    this.events.on(e2, t);
  }
  once(e2, t) {
    this.events.once(e2, t);
  }
  off(e2, t) {
    this.events.off(e2, t);
  }
  removeListener(e2, t) {
    this.events.removeListener(e2, t);
  }
  async open(e2 = this.url) {
    await this.register(e2);
  }
  async close() {
    return new Promise((e2, t) => {
      if (typeof this.socket > "u") {
        t(new Error("Connection already closed"));
        return;
      }
      this.socket.onclose = (n4) => {
        this.onClose(n4), e2();
      }, this.socket.close();
    });
  }
  async send(e2) {
    typeof this.socket > "u" && (this.socket = await this.register());
    try {
      this.socket.send(safeJsonStringify(e2));
    } catch (t) {
      this.onError(e2.id, t);
    }
  }
  register(e2 = this.url) {
    if (!isWsUrl(e2)) throw new Error(`Provided URL is not compatible with WebSocket connection: ${e2}`);
    if (this.registering) {
      const t = this.events.getMaxListeners();
      return (this.events.listenerCount("register_error") >= t || this.events.listenerCount("open") >= t) && this.events.setMaxListeners(t + 1), new Promise((n4, o3) => {
        this.events.once("register_error", (s2) => {
          this.resetMaxListeners(), o3(s2);
        }), this.events.once("open", () => {
          if (this.resetMaxListeners(), typeof this.socket > "u") return o3(new Error("WebSocket connection is missing or invalid"));
          n4(this.socket);
        });
      });
    }
    return this.url = e2, this.registering = true, new Promise((t, n4) => {
      const o3 = new URLSearchParams(e2).get("origin"), s2 = (0, esm_exports2.isReactNative)() ? { headers: { origin: o3 } } : { rejectUnauthorized: !isLocalhostUrl(e2) }, i3 = new S3(e2, [], s2);
      b3() ? i3.onerror = (r2) => {
        const l4 = r2;
        n4(this.emitError(l4.error));
      } : i3.on("error", (r2) => {
        n4(this.emitError(r2));
      }), i3.onopen = () => {
        this.onOpen(i3), t(i3);
      };
    });
  }
  onOpen(e2) {
    e2.onmessage = (t) => this.onPayload(t), e2.onclose = (t) => this.onClose(t), this.socket = e2, this.registering = false, this.events.emit("open");
  }
  onClose(e2) {
    this.socket = void 0, this.registering = false, this.events.emit("close", e2);
  }
  onPayload(e2) {
    if (typeof e2.data > "u") return;
    const t = typeof e2.data == "string" ? safeJsonParse(e2.data) : e2.data;
    this.events.emit("payload", t);
  }
  onError(e2, t) {
    const n4 = this.parseError(t), o3 = n4.message || n4.toString(), s2 = formatJsonRpcError(e2, o3);
    this.events.emit("payload", s2);
  }
  parseError(e2, t = this.url) {
    return parseConnectionError(e2, a2(t), "WS");
  }
  resetMaxListeners() {
    this.events.getMaxListeners() > h5 && this.events.setMaxListeners(h5);
  }
  emitError(e2) {
    const t = this.parseError(new Error((e2 == null ? void 0 : e2.message) || `WebSocket connection failed for host: ${a2(this.url)}`));
    return this.events.emit("register_error", t), t;
  }
};

// node_modules/@walletconnect/core/dist/index.es.js
var import_lodash = __toESM(require_lodash());
function Vi(r2, e2) {
  if (r2.length >= 255) throw new TypeError("Alphabet too long");
  for (var t = new Uint8Array(256), i3 = 0; i3 < t.length; i3++) t[i3] = 255;
  for (var s2 = 0; s2 < r2.length; s2++) {
    var n4 = r2.charAt(s2), o3 = n4.charCodeAt(0);
    if (t[o3] !== 255) throw new TypeError(n4 + " is ambiguous");
    t[o3] = s2;
  }
  var a3 = r2.length, h7 = r2.charAt(0), l4 = Math.log(a3) / Math.log(256), d3 = Math.log(256) / Math.log(a3);
  function p7(u4) {
    if (u4 instanceof Uint8Array || (ArrayBuffer.isView(u4) ? u4 = new Uint8Array(u4.buffer, u4.byteOffset, u4.byteLength) : Array.isArray(u4) && (u4 = Uint8Array.from(u4))), !(u4 instanceof Uint8Array)) throw new TypeError("Expected Uint8Array");
    if (u4.length === 0) return "";
    for (var m5 = 0, z4 = 0, I2 = 0, _6 = u4.length; I2 !== _6 && u4[I2] === 0; ) I2++, m5++;
    for (var S6 = (_6 - I2) * d3 + 1 >>> 0, b6 = new Uint8Array(S6); I2 !== _6; ) {
      for (var T5 = u4[I2], A3 = 0, C4 = S6 - 1; (T5 !== 0 || A3 < z4) && C4 !== -1; C4--, A3++) T5 += 256 * b6[C4] >>> 0, b6[C4] = T5 % a3 >>> 0, T5 = T5 / a3 >>> 0;
      if (T5 !== 0) throw new Error("Non-zero carry");
      z4 = A3, I2++;
    }
    for (var x3 = S6 - z4; x3 !== S6 && b6[x3] === 0; ) x3++;
    for (var j4 = h7.repeat(m5); x3 < S6; ++x3) j4 += r2.charAt(b6[x3]);
    return j4;
  }
  function y7(u4) {
    if (typeof u4 != "string") throw new TypeError("Expected String");
    if (u4.length === 0) return new Uint8Array();
    var m5 = 0;
    if (u4[m5] !== " ") {
      for (var z4 = 0, I2 = 0; u4[m5] === h7; ) z4++, m5++;
      for (var _6 = (u4.length - m5) * l4 + 1 >>> 0, S6 = new Uint8Array(_6); u4[m5]; ) {
        var b6 = t[u4.charCodeAt(m5)];
        if (b6 === 255) return;
        for (var T5 = 0, A3 = _6 - 1; (b6 !== 0 || T5 < I2) && A3 !== -1; A3--, T5++) b6 += a3 * S6[A3] >>> 0, S6[A3] = b6 % 256 >>> 0, b6 = b6 / 256 >>> 0;
        if (b6 !== 0) throw new Error("Non-zero carry");
        I2 = T5, m5++;
      }
      if (u4[m5] !== " ") {
        for (var C4 = _6 - I2; C4 !== _6 && S6[C4] === 0; ) C4++;
        for (var x3 = new Uint8Array(z4 + (_6 - C4)), j4 = z4; C4 !== _6; ) x3[j4++] = S6[C4++];
        return x3;
      }
    }
  }
  function M7(u4) {
    var m5 = y7(u4);
    if (m5) return m5;
    throw new Error(`Non-${e2} character`);
  }
  return { encode: p7, decodeUnsafe: y7, decode: M7 };
}
var qi = Vi;
var ji = qi;
var Ne = (r2) => {
  if (r2 instanceof Uint8Array && r2.constructor.name === "Uint8Array") return r2;
  if (r2 instanceof ArrayBuffer) return new Uint8Array(r2);
  if (ArrayBuffer.isView(r2)) return new Uint8Array(r2.buffer, r2.byteOffset, r2.byteLength);
  throw new Error("Unknown type, must be binary type");
};
var Gi = (r2) => new TextEncoder().encode(r2);
var Yi = (r2) => new TextDecoder().decode(r2);
var Hi = class {
  constructor(e2, t, i3) {
    this.name = e2, this.prefix = t, this.baseEncode = i3;
  }
  encode(e2) {
    if (e2 instanceof Uint8Array) return `${this.prefix}${this.baseEncode(e2)}`;
    throw Error("Unknown type, must be binary type");
  }
};
var Ji = class {
  constructor(e2, t, i3) {
    if (this.name = e2, this.prefix = t, t.codePointAt(0) === void 0) throw new Error("Invalid prefix character");
    this.prefixCodePoint = t.codePointAt(0), this.baseDecode = i3;
  }
  decode(e2) {
    if (typeof e2 == "string") {
      if (e2.codePointAt(0) !== this.prefixCodePoint) throw Error(`Unable to decode multibase string ${JSON.stringify(e2)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
      return this.baseDecode(e2.slice(this.prefix.length));
    } else throw Error("Can only multibase decode strings");
  }
  or(e2) {
    return Ue2(this, e2);
  }
};
var Wi = class {
  constructor(e2) {
    this.decoders = e2;
  }
  or(e2) {
    return Ue2(this, e2);
  }
  decode(e2) {
    const t = e2[0], i3 = this.decoders[t];
    if (i3) return i3.decode(e2);
    throw RangeError(`Unable to decode multibase string ${JSON.stringify(e2)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
  }
};
var Ue2 = (r2, e2) => new Wi({ ...r2.decoders || { [r2.prefix]: r2 }, ...e2.decoders || { [e2.prefix]: e2 } });
var Xi = class {
  constructor(e2, t, i3, s2) {
    this.name = e2, this.prefix = t, this.baseEncode = i3, this.baseDecode = s2, this.encoder = new Hi(e2, t, i3), this.decoder = new Ji(e2, t, s2);
  }
  encode(e2) {
    return this.encoder.encode(e2);
  }
  decode(e2) {
    return this.decoder.decode(e2);
  }
};
var X2 = ({ name: r2, prefix: e2, encode: t, decode: i3 }) => new Xi(r2, e2, t, i3);
var B = ({ prefix: r2, name: e2, alphabet: t }) => {
  const { encode: i3, decode: s2 } = ji(t, e2);
  return X2({ prefix: r2, name: e2, encode: i3, decode: (n4) => Ne(s2(n4)) });
};
var Qi = (r2, e2, t, i3) => {
  const s2 = {};
  for (let d3 = 0; d3 < e2.length; ++d3) s2[e2[d3]] = d3;
  let n4 = r2.length;
  for (; r2[n4 - 1] === "="; ) --n4;
  const o3 = new Uint8Array(n4 * t / 8 | 0);
  let a3 = 0, h7 = 0, l4 = 0;
  for (let d3 = 0; d3 < n4; ++d3) {
    const p7 = s2[r2[d3]];
    if (p7 === void 0) throw new SyntaxError(`Non-${i3} character`);
    h7 = h7 << t | p7, a3 += t, a3 >= 8 && (a3 -= 8, o3[l4++] = 255 & h7 >> a3);
  }
  if (a3 >= t || 255 & h7 << 8 - a3) throw new SyntaxError("Unexpected end of data");
  return o3;
};
var Zi = (r2, e2, t) => {
  const i3 = e2[e2.length - 1] === "=", s2 = (1 << t) - 1;
  let n4 = "", o3 = 0, a3 = 0;
  for (let h7 = 0; h7 < r2.length; ++h7) for (a3 = a3 << 8 | r2[h7], o3 += 8; o3 > t; ) o3 -= t, n4 += e2[s2 & a3 >> o3];
  if (o3 && (n4 += e2[s2 & a3 << t - o3]), i3) for (; n4.length * t & 7; ) n4 += "=";
  return n4;
};
var g3 = ({ name: r2, prefix: e2, bitsPerChar: t, alphabet: i3 }) => X2({ prefix: e2, name: r2, encode(s2) {
  return Zi(s2, i3, t);
}, decode(s2) {
  return Qi(s2, i3, t, r2);
} });
var es = X2({ prefix: "\0", name: "identity", encode: (r2) => Yi(r2), decode: (r2) => Gi(r2) });
var ts = Object.freeze({ __proto__: null, identity: es });
var is = g3({ prefix: "0", name: "base2", alphabet: "01", bitsPerChar: 1 });
var ss = Object.freeze({ __proto__: null, base2: is });
var rs = g3({ prefix: "7", name: "base8", alphabet: "01234567", bitsPerChar: 3 });
var ns = Object.freeze({ __proto__: null, base8: rs });
var os = B({ prefix: "9", name: "base10", alphabet: "0123456789" });
var as = Object.freeze({ __proto__: null, base10: os });
var hs = g3({ prefix: "f", name: "base16", alphabet: "0123456789abcdef", bitsPerChar: 4 });
var cs = g3({ prefix: "F", name: "base16upper", alphabet: "0123456789ABCDEF", bitsPerChar: 4 });
var us = Object.freeze({ __proto__: null, base16: hs, base16upper: cs });
var ls = g3({ prefix: "b", name: "base32", alphabet: "abcdefghijklmnopqrstuvwxyz234567", bitsPerChar: 5 });
var ds = g3({ prefix: "B", name: "base32upper", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", bitsPerChar: 5 });
var gs = g3({ prefix: "c", name: "base32pad", alphabet: "abcdefghijklmnopqrstuvwxyz234567=", bitsPerChar: 5 });
var ps = g3({ prefix: "C", name: "base32padupper", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=", bitsPerChar: 5 });
var Ds = g3({ prefix: "v", name: "base32hex", alphabet: "0123456789abcdefghijklmnopqrstuv", bitsPerChar: 5 });
var ys = g3({ prefix: "V", name: "base32hexupper", alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV", bitsPerChar: 5 });
var ms = g3({ prefix: "t", name: "base32hexpad", alphabet: "0123456789abcdefghijklmnopqrstuv=", bitsPerChar: 5 });
var bs = g3({ prefix: "T", name: "base32hexpadupper", alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUV=", bitsPerChar: 5 });
var fs = g3({ prefix: "h", name: "base32z", alphabet: "ybndrfg8ejkmcpqxot1uwisza345h769", bitsPerChar: 5 });
var Es = Object.freeze({ __proto__: null, base32: ls, base32upper: ds, base32pad: gs, base32padupper: ps, base32hex: Ds, base32hexupper: ys, base32hexpad: ms, base32hexpadupper: bs, base32z: fs });
var ws = B({ prefix: "k", name: "base36", alphabet: "0123456789abcdefghijklmnopqrstuvwxyz" });
var vs = B({ prefix: "K", name: "base36upper", alphabet: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ" });
var Is = Object.freeze({ __proto__: null, base36: ws, base36upper: vs });
var Cs = B({ name: "base58btc", prefix: "z", alphabet: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz" });
var Rs = B({ name: "base58flickr", prefix: "Z", alphabet: "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ" });
var _s = Object.freeze({ __proto__: null, base58btc: Cs, base58flickr: Rs });
var Ss = g3({ prefix: "m", name: "base64", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", bitsPerChar: 6 });
var Ts = g3({ prefix: "M", name: "base64pad", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", bitsPerChar: 6 });
var Ps = g3({ prefix: "u", name: "base64url", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_", bitsPerChar: 6 });
var xs = g3({ prefix: "U", name: "base64urlpad", alphabet: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=", bitsPerChar: 6 });
var Os = Object.freeze({ __proto__: null, base64: Ss, base64pad: Ts, base64url: Ps, base64urlpad: xs });
var Le = Array.from("🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂");
var As = Le.reduce((r2, e2, t) => (r2[t] = e2, r2), []);
var zs = Le.reduce((r2, e2, t) => (r2[e2.codePointAt(0)] = t, r2), []);
function Ns(r2) {
  return r2.reduce((e2, t) => (e2 += As[t], e2), "");
}
function Us(r2) {
  const e2 = [];
  for (const t of r2) {
    const i3 = zs[t.codePointAt(0)];
    if (i3 === void 0) throw new Error(`Non-base256emoji character: ${t}`);
    e2.push(i3);
  }
  return new Uint8Array(e2);
}
var Ls = X2({ prefix: "🚀", name: "base256emoji", encode: Ns, decode: Us });
var Fs = Object.freeze({ __proto__: null, base256emoji: Ls });
var $s = $e2;
var Fe2 = 128;
var Ms = 127;
var ks = ~Ms;
var Ks = Math.pow(2, 31);
function $e2(r2, e2, t) {
  e2 = e2 || [], t = t || 0;
  for (var i3 = t; r2 >= Ks; ) e2[t++] = r2 & 255 | Fe2, r2 /= 128;
  for (; r2 & ks; ) e2[t++] = r2 & 255 | Fe2, r2 >>>= 7;
  return e2[t] = r2 | 0, $e2.bytes = t - i3 + 1, e2;
}
var Bs = he3;
var Vs = 128;
var Me2 = 127;
function he3(r2, i3) {
  var t = 0, i3 = i3 || 0, s2 = 0, n4 = i3, o3, a3 = r2.length;
  do {
    if (n4 >= a3) throw he3.bytes = 0, new RangeError("Could not decode varint");
    o3 = r2[n4++], t += s2 < 28 ? (o3 & Me2) << s2 : (o3 & Me2) * Math.pow(2, s2), s2 += 7;
  } while (o3 >= Vs);
  return he3.bytes = n4 - i3, t;
}
var qs = Math.pow(2, 7);
var js = Math.pow(2, 14);
var Gs = Math.pow(2, 21);
var Ys = Math.pow(2, 28);
var Hs = Math.pow(2, 35);
var Js = Math.pow(2, 42);
var Ws = Math.pow(2, 49);
var Xs = Math.pow(2, 56);
var Qs = Math.pow(2, 63);
var Zs = function(r2) {
  return r2 < qs ? 1 : r2 < js ? 2 : r2 < Gs ? 3 : r2 < Ys ? 4 : r2 < Hs ? 5 : r2 < Js ? 6 : r2 < Ws ? 7 : r2 < Xs ? 8 : r2 < Qs ? 9 : 10;
};
var er2 = { encode: $s, decode: Bs, encodingLength: Zs };
var ke2 = er2;
var Ke = (r2, e2, t = 0) => (ke2.encode(r2, e2, t), e2);
var Be2 = (r2) => ke2.encodingLength(r2);
var ce = (r2, e2) => {
  const t = e2.byteLength, i3 = Be2(r2), s2 = i3 + Be2(t), n4 = new Uint8Array(s2 + t);
  return Ke(r2, n4, 0), Ke(t, n4, i3), n4.set(e2, s2), new tr(r2, t, e2, n4);
};
var tr = class {
  constructor(e2, t, i3, s2) {
    this.code = e2, this.size = t, this.digest = i3, this.bytes = s2;
  }
};
var Ve2 = ({ name: r2, code: e2, encode: t }) => new ir(r2, e2, t);
var ir = class {
  constructor(e2, t, i3) {
    this.name = e2, this.code = t, this.encode = i3;
  }
  digest(e2) {
    if (e2 instanceof Uint8Array) {
      const t = this.encode(e2);
      return t instanceof Uint8Array ? ce(this.code, t) : t.then((i3) => ce(this.code, i3));
    } else throw Error("Unknown type, must be binary type");
  }
};
var qe2 = (r2) => async (e2) => new Uint8Array(await crypto.subtle.digest(r2, e2));
var sr = Ve2({ name: "sha2-256", code: 18, encode: qe2("SHA-256") });
var rr = Ve2({ name: "sha2-512", code: 19, encode: qe2("SHA-512") });
var nr2 = Object.freeze({ __proto__: null, sha256: sr, sha512: rr });
var je = 0;
var or = "identity";
var Ge2 = Ne;
var ar = (r2) => ce(je, Ge2(r2));
var hr = { code: je, name: or, encode: Ge2, digest: ar };
var cr = Object.freeze({ __proto__: null, identity: hr });
new TextEncoder(), new TextDecoder();
var Ye = { ...ts, ...ss, ...ns, ...as, ...us, ...Es, ...Is, ..._s, ...Os, ...Fs };
({ ...nr2, ...cr });
function He2(r2) {
  return globalThis.Buffer != null ? new Uint8Array(r2.buffer, r2.byteOffset, r2.byteLength) : r2;
}
function ur(r2 = 0) {
  return globalThis.Buffer != null && globalThis.Buffer.allocUnsafe != null ? He2(globalThis.Buffer.allocUnsafe(r2)) : new Uint8Array(r2);
}
function Je(r2, e2, t, i3) {
  return { name: r2, prefix: e2, encoder: { name: r2, prefix: e2, encode: t }, decoder: { decode: i3 } };
}
var We2 = Je("utf8", "u", (r2) => "u" + new TextDecoder("utf8").decode(r2), (r2) => new TextEncoder().encode(r2.substring(1)));
var ue3 = Je("ascii", "a", (r2) => {
  let e2 = "a";
  for (let t = 0; t < r2.length; t++) e2 += String.fromCharCode(r2[t]);
  return e2;
}, (r2) => {
  r2 = r2.substring(1);
  const e2 = ur(r2.length);
  for (let t = 0; t < r2.length; t++) e2[t] = r2.charCodeAt(t);
  return e2;
});
var lr = { utf8: We2, "utf-8": We2, hex: Ye.base16, latin1: ue3, ascii: ue3, binary: ue3, ...Ye };
function dr(r2, e2 = "utf8") {
  const t = lr[e2];
  if (!t) throw new Error(`Unsupported encoding "${e2}"`);
  return (e2 === "utf8" || e2 === "utf-8") && globalThis.Buffer != null && globalThis.Buffer.from != null ? He2(globalThis.Buffer.from(r2, "utf-8")) : t.decoder.decode(`${t.prefix}${r2}`);
}
var le3 = "wc";
var Xe = 2;
var Q2 = "core";
var O2 = `${le3}@2:${Q2}:`;
var Qe = { name: Q2, logger: "error" };
var Ze = { database: ":memory:" };
var et = "crypto";
var de3 = "client_ed25519_seed";
var tt = import_time4.ONE_DAY;
var it = "keychain";
var st = "0.3";
var rt2 = "messages";
var nt = "0.3";
var ot2 = import_time4.SIX_HOURS;
var at2 = "publisher";
var ht = "irn";
var ct = "error";
var ge = "wss://relay.walletconnect.com";
var pe = "wss://relay.walletconnect.org";
var ut2 = "relayer";
var D3 = { message: "relayer_message", message_ack: "relayer_message_ack", connect: "relayer_connect", disconnect: "relayer_disconnect", error: "relayer_error", connection_stalled: "relayer_connection_stalled", transport_closed: "relayer_transport_closed", publish: "relayer_publish" };
var lt2 = "_subscription";
var P = { payload: "payload", connect: "connect", disconnect: "disconnect", error: "error" };
var dt2 = import_time4.ONE_SECOND;
var gt = "2.10.6";
var pt2 = 1e4;
var Dt = "0.3";
var yt2 = "WALLETCONNECT_CLIENT_ID";
var w4 = { created: "subscription_created", deleted: "subscription_deleted", expired: "subscription_expired", disabled: "subscription_disabled", sync: "subscription_sync", resubscribed: "subscription_resubscribed" };
var mt2 = "subscription";
var bt2 = "0.3";
var ft2 = import_time4.FIVE_SECONDS * 1e3;
var Et2 = "pairing";
var wt2 = "0.3";
var F2 = { wc_pairingDelete: { req: { ttl: import_time4.ONE_DAY, prompt: false, tag: 1e3 }, res: { ttl: import_time4.ONE_DAY, prompt: false, tag: 1001 } }, wc_pairingPing: { req: { ttl: import_time4.THIRTY_SECONDS, prompt: false, tag: 1002 }, res: { ttl: import_time4.THIRTY_SECONDS, prompt: false, tag: 1003 } }, unregistered_method: { req: { ttl: import_time4.ONE_DAY, prompt: false, tag: 0 }, res: { ttl: import_time4.ONE_DAY, prompt: false, tag: 0 } } };
var V = { create: "pairing_create", expire: "pairing_expire", delete: "pairing_delete", ping: "pairing_ping" };
var R = { created: "history_created", updated: "history_updated", deleted: "history_deleted", sync: "history_sync" };
var vt2 = "history";
var It2 = "0.3";
var Ct = "expirer";
var v2 = { created: "expirer_created", deleted: "expirer_deleted", expired: "expirer_expired", sync: "expirer_sync" };
var Rt = "0.3";
var Z2 = "verify-api";
var $2 = "https://verify.walletconnect.com";
var ee2 = "https://verify.walletconnect.org";
var _t = [$2, ee2];
var St2 = class {
  constructor(e2, t) {
    this.core = e2, this.logger = t, this.keychain = /* @__PURE__ */ new Map(), this.name = it, this.version = st, this.initialized = false, this.storagePrefix = O2, this.init = async () => {
      if (!this.initialized) {
        const i3 = await this.getKeyChain();
        typeof i3 < "u" && (this.keychain = i3), this.initialized = true;
      }
    }, this.has = (i3) => (this.isInitialized(), this.keychain.has(i3)), this.set = async (i3, s2) => {
      this.isInitialized(), this.keychain.set(i3, s2), await this.persist();
    }, this.get = (i3) => {
      this.isInitialized();
      const s2 = this.keychain.get(i3);
      if (typeof s2 > "u") {
        const { message: n4 } = N2("NO_MATCHING_KEY", `${this.name}: ${i3}`);
        throw new Error(n4);
      }
      return s2;
    }, this.del = async (i3) => {
      this.isInitialized(), this.keychain.delete(i3), await this.persist();
    }, this.core = e2, this.logger = E2(t, this.name);
  }
  get context() {
    return y2(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  async setKeyChain(e2) {
    await this.core.storage.setItem(this.storageKey, rt(e2));
  }
  async getKeyChain() {
    const e2 = await this.core.storage.getItem(this.storageKey);
    return typeof e2 < "u" ? ot(e2) : void 0;
  }
  async persist() {
    await this.setKeyChain(this.keychain);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = N2("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
};
var Tt = class {
  constructor(e2, t, i3) {
    this.core = e2, this.logger = t, this.name = et, this.initialized = false, this.init = async () => {
      this.initialized || (await this.keychain.init(), this.initialized = true);
    }, this.hasKeys = (s2) => (this.isInitialized(), this.keychain.has(s2)), this.getClientId = async () => {
      this.isInitialized();
      const s2 = await this.getClientSeed(), n4 = generateKeyPair2(s2);
      return encodeIss(n4.publicKey);
    }, this.generateKeyPair = () => {
      this.isInitialized();
      const s2 = kn();
      return this.setPrivateKey(s2.publicKey, s2.privateKey);
    }, this.signJWT = async (s2) => {
      this.isInitialized();
      const n4 = await this.getClientSeed(), o3 = generateKeyPair2(n4), a3 = Vn(), h7 = tt;
      return await signJWT(a3, s2, h7, o3);
    }, this.generateSharedKey = (s2, n4, o3) => {
      this.isInitialized();
      const a3 = this.getPrivateKey(s2), h7 = Mn(a3, n4);
      return this.setSymKey(h7, o3);
    }, this.setSymKey = async (s2, n4) => {
      this.isInitialized();
      const o3 = n4 || Kn(s2);
      return await this.keychain.set(o3, s2), o3;
    }, this.deleteKeyPair = async (s2) => {
      this.isInitialized(), await this.keychain.del(s2);
    }, this.deleteSymKey = async (s2) => {
      this.isInitialized(), await this.keychain.del(s2);
    }, this.encode = async (s2, n4, o3) => {
      this.isInitialized();
      const a3 = Te(o3), h7 = safeJsonStringify(n4);
      if (qn(a3)) {
        const y7 = a3.senderPublicKey, M7 = a3.receiverPublicKey;
        s2 = await this.generateSharedKey(y7, M7);
      }
      const l4 = this.getSymKey(s2), { type: d3, senderPublicKey: p7 } = a3;
      return xn({ type: d3, symKey: l4, message: h7, senderPublicKey: p7 });
    }, this.decode = async (s2, n4, o3) => {
      this.isInitialized();
      const a3 = Hn(n4, o3);
      if (qn(a3)) {
        const h7 = a3.receiverPublicKey, l4 = a3.senderPublicKey;
        s2 = await this.generateSharedKey(h7, l4);
      }
      try {
        const h7 = this.getSymKey(s2), l4 = Fn({ symKey: h7, encoded: n4 });
        return safeJsonParse(l4);
      } catch (h7) {
        this.logger.error(`Failed to decode message from topic: '${s2}', clientId: '${await this.getClientId()}'`), this.logger.error(h7);
      }
    }, this.getPayloadType = (s2) => {
      const n4 = ee(s2);
      return $(n4.type);
    }, this.getPayloadSenderPublicKey = (s2) => {
      const n4 = ee(s2);
      return n4.senderPublicKey ? toString(n4.senderPublicKey, p3) : void 0;
    }, this.core = e2, this.logger = E2(t, this.name), this.keychain = i3 || new St2(this.core, this.logger);
  }
  get context() {
    return y2(this.logger);
  }
  async setPrivateKey(e2, t) {
    return await this.keychain.set(e2, t), e2;
  }
  getPrivateKey(e2) {
    return this.keychain.get(e2);
  }
  async getClientSeed() {
    let e2 = "";
    try {
      e2 = this.keychain.get(de3);
    } catch {
      e2 = Vn(), await this.keychain.set(de3, e2);
    }
    return dr(e2, "base16");
  }
  getSymKey(e2) {
    return this.keychain.get(e2);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = N2("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
};
var Pt = class extends a {
  constructor(e2, t) {
    super(e2, t), this.logger = e2, this.core = t, this.messages = /* @__PURE__ */ new Map(), this.name = rt2, this.version = nt, this.initialized = false, this.storagePrefix = O2, this.init = async () => {
      if (!this.initialized) {
        this.logger.trace("Initialized");
        try {
          const i3 = await this.getRelayerMessages();
          typeof i3 < "u" && (this.messages = i3), this.logger.debug(`Successfully Restored records for ${this.name}`), this.logger.trace({ type: "method", method: "restore", size: this.messages.size });
        } catch (i3) {
          this.logger.debug(`Failed to Restore records for ${this.name}`), this.logger.error(i3);
        } finally {
          this.initialized = true;
        }
      }
    }, this.set = async (i3, s2) => {
      this.isInitialized();
      const n4 = Ln(s2);
      let o3 = this.messages.get(i3);
      return typeof o3 > "u" && (o3 = {}), typeof o3[n4] < "u" || (o3[n4] = s2, this.messages.set(i3, o3), await this.persist()), n4;
    }, this.get = (i3) => {
      this.isInitialized();
      let s2 = this.messages.get(i3);
      return typeof s2 > "u" && (s2 = {}), s2;
    }, this.has = (i3, s2) => {
      this.isInitialized();
      const n4 = this.get(i3), o3 = Ln(s2);
      return typeof n4[o3] < "u";
    }, this.del = async (i3) => {
      this.isInitialized(), this.messages.delete(i3), await this.persist();
    }, this.logger = E2(e2, this.name), this.core = t;
  }
  get context() {
    return y2(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  async setRelayerMessages(e2) {
    await this.core.storage.setItem(this.storageKey, rt(e2));
  }
  async getRelayerMessages() {
    const e2 = await this.core.storage.getItem(this.storageKey);
    return typeof e2 < "u" ? ot(e2) : void 0;
  }
  async persist() {
    await this.setRelayerMessages(this.messages);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = N2("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
};
var mr = class extends u {
  constructor(e2, t) {
    super(e2, t), this.relayer = e2, this.logger = t, this.events = new import_events5.EventEmitter(), this.name = at2, this.queue = /* @__PURE__ */ new Map(), this.publishTimeout = (0, import_time4.toMiliseconds)(import_time4.TEN_SECONDS), this.needsTransportRestart = false, this.publish = async (i3, s2, n4) => {
      var o3;
      this.logger.debug("Publishing Payload"), this.logger.trace({ type: "method", method: "publish", params: { topic: i3, message: s2, opts: n4 } });
      try {
        const a3 = (n4 == null ? void 0 : n4.ttl) || ot2, h7 = vt(n4), l4 = (n4 == null ? void 0 : n4.prompt) || false, d3 = (n4 == null ? void 0 : n4.tag) || 0, p7 = (n4 == null ? void 0 : n4.id) || getBigIntRpcId().toString(), y7 = { topic: i3, message: s2, opts: { ttl: a3, relay: h7, prompt: l4, tag: d3, id: p7 } }, M7 = setTimeout(() => this.queue.set(p7, y7), this.publishTimeout);
        try {
          await await ut(this.rpcPublish(i3, s2, a3, h7, l4, d3, p7), this.publishTimeout, "Failed to publish payload, please try again."), this.removeRequestFromQueue(p7), this.relayer.events.emit(D3.publish, y7);
        } catch (u4) {
          if (this.logger.debug("Publishing Payload stalled"), this.needsTransportRestart = true, (o3 = n4 == null ? void 0 : n4.internal) != null && o3.throwOnFailedPublish) throw this.removeRequestFromQueue(p7), u4;
          return;
        } finally {
          clearTimeout(M7);
        }
        this.logger.debug("Successfully Published Payload"), this.logger.trace({ type: "method", method: "publish", params: { topic: i3, message: s2, opts: n4 } });
      } catch (a3) {
        throw this.logger.debug("Failed to Publish Payload"), this.logger.error(a3), a3;
      }
    }, this.on = (i3, s2) => {
      this.events.on(i3, s2);
    }, this.once = (i3, s2) => {
      this.events.once(i3, s2);
    }, this.off = (i3, s2) => {
      this.events.off(i3, s2);
    }, this.removeListener = (i3, s2) => {
      this.events.removeListener(i3, s2);
    }, this.relayer = e2, this.logger = E2(t, this.name), this.registerEventListeners();
  }
  get context() {
    return y2(this.logger);
  }
  rpcPublish(e2, t, i3, s2, n4, o3, a3) {
    var h7, l4, d3, p7;
    const y7 = { method: Et(s2.protocol).publish, params: { topic: e2, message: t, ttl: i3, prompt: n4, tag: o3 }, id: a3 };
    return w2((h7 = y7.params) == null ? void 0 : h7.prompt) && ((l4 = y7.params) == null || delete l4.prompt), w2((d3 = y7.params) == null ? void 0 : d3.tag) && ((p7 = y7.params) == null || delete p7.tag), this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "message", direction: "outgoing", request: y7 }), this.relayer.request(y7);
  }
  removeRequestFromQueue(e2) {
    this.queue.delete(e2);
  }
  checkQueue() {
    this.queue.forEach(async (e2) => {
      const { topic: t, message: i3, opts: s2 } = e2;
      await this.publish(t, i3, s2);
    });
  }
  registerEventListeners() {
    this.relayer.core.heartbeat.on(import_heartbeat.HEARTBEAT_EVENTS.pulse, () => {
      if (this.needsTransportRestart) {
        this.needsTransportRestart = false, this.relayer.events.emit(D3.connection_stalled);
        return;
      }
      this.checkQueue();
    }), this.relayer.on(D3.message_ack, (e2) => {
      this.removeRequestFromQueue(e2.id.toString());
    });
  }
};
var br = class {
  constructor() {
    this.map = /* @__PURE__ */ new Map(), this.set = (e2, t) => {
      const i3 = this.get(e2);
      this.exists(e2, t) || this.map.set(e2, [...i3, t]);
    }, this.get = (e2) => this.map.get(e2) || [], this.exists = (e2, t) => this.get(e2).includes(t), this.delete = (e2, t) => {
      if (typeof t > "u") {
        this.map.delete(e2);
        return;
      }
      if (!this.map.has(e2)) return;
      const i3 = this.get(e2);
      if (!this.exists(e2, t)) return;
      const s2 = i3.filter((n4) => n4 !== t);
      if (!s2.length) {
        this.map.delete(e2);
        return;
      }
      this.map.set(e2, s2);
    }, this.clear = () => {
      this.map.clear();
    };
  }
  get topics() {
    return Array.from(this.map.keys());
  }
};
var fr = Object.defineProperty;
var Er = Object.defineProperties;
var wr = Object.getOwnPropertyDescriptors;
var xt = Object.getOwnPropertySymbols;
var vr = Object.prototype.hasOwnProperty;
var Ir = Object.prototype.propertyIsEnumerable;
var Ot2 = (r2, e2, t) => e2 in r2 ? fr(r2, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r2[e2] = t;
var q = (r2, e2) => {
  for (var t in e2 || (e2 = {})) vr.call(e2, t) && Ot2(r2, t, e2[t]);
  if (xt) for (var t of xt(e2)) Ir.call(e2, t) && Ot2(r2, t, e2[t]);
  return r2;
};
var De2 = (r2, e2) => Er(r2, wr(e2));
var At = class extends d {
  constructor(e2, t) {
    super(e2, t), this.relayer = e2, this.logger = t, this.subscriptions = /* @__PURE__ */ new Map(), this.topicMap = new br(), this.events = new import_events5.EventEmitter(), this.name = mt2, this.version = bt2, this.pending = /* @__PURE__ */ new Map(), this.cached = [], this.initialized = false, this.pendingSubscriptionWatchLabel = "pending_sub_watch_label", this.pollingInterval = 20, this.storagePrefix = O2, this.subscribeTimeout = 1e4, this.restartInProgress = false, this.batchSubscribeTopicsLimit = 500, this.init = async () => {
      this.initialized || (this.logger.trace("Initialized"), this.registerEventListeners(), this.clientId = await this.relayer.core.crypto.getClientId());
    }, this.subscribe = async (i3, s2) => {
      await this.restartToComplete(), this.isInitialized(), this.logger.debug("Subscribing Topic"), this.logger.trace({ type: "method", method: "subscribe", params: { topic: i3, opts: s2 } });
      try {
        const n4 = vt(s2), o3 = { topic: i3, relay: n4 };
        this.pending.set(i3, o3);
        const a3 = await this.rpcSubscribe(i3, n4);
        return this.onSubscribe(a3, o3), this.logger.debug("Successfully Subscribed Topic"), this.logger.trace({ type: "method", method: "subscribe", params: { topic: i3, opts: s2 } }), a3;
      } catch (n4) {
        throw this.logger.debug("Failed to Subscribe Topic"), this.logger.error(n4), n4;
      }
    }, this.unsubscribe = async (i3, s2) => {
      await this.restartToComplete(), this.isInitialized(), typeof (s2 == null ? void 0 : s2.id) < "u" ? await this.unsubscribeById(i3, s2.id, s2) : await this.unsubscribeByTopic(i3, s2);
    }, this.isSubscribed = async (i3) => this.topics.includes(i3) ? true : await new Promise((s2, n4) => {
      const o3 = new import_time4.Watch();
      o3.start(this.pendingSubscriptionWatchLabel);
      const a3 = setInterval(() => {
        !this.pending.has(i3) && this.topics.includes(i3) && (clearInterval(a3), o3.stop(this.pendingSubscriptionWatchLabel), s2(true)), o3.elapsed(this.pendingSubscriptionWatchLabel) >= ft2 && (clearInterval(a3), o3.stop(this.pendingSubscriptionWatchLabel), n4(new Error("Subscription resolution timeout")));
      }, this.pollingInterval);
    }).catch(() => false), this.on = (i3, s2) => {
      this.events.on(i3, s2);
    }, this.once = (i3, s2) => {
      this.events.once(i3, s2);
    }, this.off = (i3, s2) => {
      this.events.off(i3, s2);
    }, this.removeListener = (i3, s2) => {
      this.events.removeListener(i3, s2);
    }, this.restart = async () => {
      this.restartInProgress = true, await this.restore(), await this.reset(), this.restartInProgress = false;
    }, this.relayer = e2, this.logger = E2(t, this.name), this.clientId = "";
  }
  get context() {
    return y2(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.relayer.core.customStoragePrefix + "//" + this.name;
  }
  get length() {
    return this.subscriptions.size;
  }
  get ids() {
    return Array.from(this.subscriptions.keys());
  }
  get values() {
    return Array.from(this.subscriptions.values());
  }
  get topics() {
    return this.topicMap.topics;
  }
  hasSubscription(e2, t) {
    let i3 = false;
    try {
      i3 = this.getSubscription(e2).topic === t;
    } catch {
    }
    return i3;
  }
  onEnable() {
    this.cached = [], this.initialized = true;
  }
  onDisable() {
    this.cached = this.values, this.subscriptions.clear(), this.topicMap.clear();
  }
  async unsubscribeByTopic(e2, t) {
    const i3 = this.topicMap.get(e2);
    await Promise.all(i3.map(async (s2) => await this.unsubscribeById(e2, s2, t)));
  }
  async unsubscribeById(e2, t, i3) {
    this.logger.debug("Unsubscribing Topic"), this.logger.trace({ type: "method", method: "unsubscribe", params: { topic: e2, id: t, opts: i3 } });
    try {
      const s2 = vt(i3);
      await this.rpcUnsubscribe(e2, t, s2);
      const n4 = U3("USER_DISCONNECTED", `${this.name}, ${e2}`);
      await this.onUnsubscribe(e2, t, n4), this.logger.debug("Successfully Unsubscribed Topic"), this.logger.trace({ type: "method", method: "unsubscribe", params: { topic: e2, id: t, opts: i3 } });
    } catch (s2) {
      throw this.logger.debug("Failed to Unsubscribe Topic"), this.logger.error(s2), s2;
    }
  }
  async rpcSubscribe(e2, t) {
    const i3 = { method: Et(t.protocol).subscribe, params: { topic: e2 } };
    this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "payload", direction: "outgoing", request: i3 });
    try {
      await await ut(this.relayer.request(i3), this.subscribeTimeout);
    } catch {
      this.logger.debug("Outgoing Relay Subscribe Payload stalled"), this.relayer.events.emit(D3.connection_stalled);
    }
    return Ln(e2 + this.clientId);
  }
  async rpcBatchSubscribe(e2) {
    if (!e2.length) return;
    const t = e2[0].relay, i3 = { method: Et(t.protocol).batchSubscribe, params: { topics: e2.map((s2) => s2.topic) } };
    this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "payload", direction: "outgoing", request: i3 });
    try {
      return await await ut(this.relayer.request(i3), this.subscribeTimeout);
    } catch {
      this.logger.debug("Outgoing Relay Payload stalled"), this.relayer.events.emit(D3.connection_stalled);
    }
  }
  rpcUnsubscribe(e2, t, i3) {
    const s2 = { method: Et(i3.protocol).unsubscribe, params: { topic: e2, id: t } };
    return this.logger.debug("Outgoing Relay Payload"), this.logger.trace({ type: "payload", direction: "outgoing", request: s2 }), this.relayer.request(s2);
  }
  onSubscribe(e2, t) {
    this.setSubscription(e2, De2(q({}, t), { id: e2 })), this.pending.delete(t.topic);
  }
  onBatchSubscribe(e2) {
    e2.length && e2.forEach((t) => {
      this.setSubscription(t.id, q({}, t)), this.pending.delete(t.topic);
    });
  }
  async onUnsubscribe(e2, t, i3) {
    this.events.removeAllListeners(t), this.hasSubscription(t, e2) && this.deleteSubscription(t, i3), await this.relayer.messages.del(e2);
  }
  async setRelayerSubscriptions(e2) {
    await this.relayer.core.storage.setItem(this.storageKey, e2);
  }
  async getRelayerSubscriptions() {
    return await this.relayer.core.storage.getItem(this.storageKey);
  }
  setSubscription(e2, t) {
    this.subscriptions.has(e2) || (this.logger.debug("Setting subscription"), this.logger.trace({ type: "method", method: "setSubscription", id: e2, subscription: t }), this.addSubscription(e2, t));
  }
  addSubscription(e2, t) {
    this.subscriptions.set(e2, q({}, t)), this.topicMap.set(t.topic, e2), this.events.emit(w4.created, t);
  }
  getSubscription(e2) {
    this.logger.debug("Getting subscription"), this.logger.trace({ type: "method", method: "getSubscription", id: e2 });
    const t = this.subscriptions.get(e2);
    if (!t) {
      const { message: i3 } = N2("NO_MATCHING_KEY", `${this.name}: ${e2}`);
      throw new Error(i3);
    }
    return t;
  }
  deleteSubscription(e2, t) {
    this.logger.debug("Deleting subscription"), this.logger.trace({ type: "method", method: "deleteSubscription", id: e2, reason: t });
    const i3 = this.getSubscription(e2);
    this.subscriptions.delete(e2), this.topicMap.delete(i3.topic, e2), this.events.emit(w4.deleted, De2(q({}, i3), { reason: t }));
  }
  async persist() {
    await this.setRelayerSubscriptions(this.values), this.events.emit(w4.sync);
  }
  async reset() {
    if (this.cached.length) {
      const e2 = Math.ceil(this.cached.length / this.batchSubscribeTopicsLimit);
      for (let t = 0; t < e2; t++) {
        const i3 = this.cached.splice(0, this.batchSubscribeTopicsLimit);
        await this.batchSubscribe(i3);
      }
    }
    this.events.emit(w4.resubscribed);
  }
  async restore() {
    try {
      const e2 = await this.getRelayerSubscriptions();
      if (typeof e2 > "u" || !e2.length) return;
      if (this.subscriptions.size) {
        const { message: t } = N2("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), this.logger.error(`${this.name}: ${JSON.stringify(this.values)}`), new Error(t);
      }
      this.cached = e2, this.logger.debug(`Successfully Restored subscriptions for ${this.name}`), this.logger.trace({ type: "method", method: "restore", subscriptions: this.values });
    } catch (e2) {
      this.logger.debug(`Failed to Restore subscriptions for ${this.name}`), this.logger.error(e2);
    }
  }
  async batchSubscribe(e2) {
    if (!e2.length) return;
    const t = await this.rpcBatchSubscribe(e2);
    k4(t) && this.onBatchSubscribe(t.map((i3, s2) => De2(q({}, e2[s2]), { id: i3 })));
  }
  async onConnect() {
    this.restartInProgress || (await this.restart(), this.onEnable());
  }
  onDisconnect() {
    this.onDisable();
  }
  async checkPending() {
    if (!this.initialized || this.relayer.transportExplicitlyClosed) return;
    const e2 = [];
    this.pending.forEach((t) => {
      e2.push(t);
    }), await this.batchSubscribe(e2);
  }
  registerEventListeners() {
    this.relayer.core.heartbeat.on(import_heartbeat.HEARTBEAT_EVENTS.pulse, async () => {
      await this.checkPending();
    }), this.relayer.on(D3.connect, async () => {
      await this.onConnect();
    }), this.relayer.on(D3.disconnect, () => {
      this.onDisconnect();
    }), this.events.on(w4.created, async (e2) => {
      const t = w4.created;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e2 }), await this.persist();
    }), this.events.on(w4.deleted, async (e2) => {
      const t = w4.deleted;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e2 }), await this.persist();
    });
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = N2("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
  async restartToComplete() {
    this.restartInProgress && await new Promise((e2) => {
      const t = setInterval(() => {
        this.restartInProgress || (clearInterval(t), e2());
      }, this.pollingInterval);
    });
  }
};
var Cr = Object.defineProperty;
var zt = Object.getOwnPropertySymbols;
var Rr = Object.prototype.hasOwnProperty;
var _r = Object.prototype.propertyIsEnumerable;
var Nt2 = (r2, e2, t) => e2 in r2 ? Cr(r2, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r2[e2] = t;
var Sr = (r2, e2) => {
  for (var t in e2 || (e2 = {})) Rr.call(e2, t) && Nt2(r2, t, e2[t]);
  if (zt) for (var t of zt(e2)) _r.call(e2, t) && Nt2(r2, t, e2[t]);
  return r2;
};
var Ut = class extends g2 {
  constructor(e2) {
    super(e2), this.protocol = "wc", this.version = 2, this.events = new import_events5.EventEmitter(), this.name = ut2, this.transportExplicitlyClosed = false, this.initialized = false, this.connectionAttemptInProgress = false, this.connectionStatusPollingInterval = 20, this.staleConnectionErrors = ["socket hang up", "socket stalled"], this.hasExperiencedNetworkDisruption = false, this.request = async (t) => {
      this.logger.debug("Publishing Request Payload");
      try {
        return await this.toEstablishConnection(), await this.provider.request(t);
      } catch (i3) {
        throw this.logger.debug("Failed to Publish Request"), this.logger.error(i3), i3;
      }
    }, this.onPayloadHandler = (t) => {
      this.onProviderPayload(t);
    }, this.onConnectHandler = () => {
      this.events.emit(D3.connect);
    }, this.onDisconnectHandler = () => {
      this.onProviderDisconnect();
    }, this.onProviderErrorHandler = (t) => {
      this.logger.error(t), this.events.emit(D3.error, t), this.logger.info("Fatal socket error received, closing transport"), this.transportClose();
    }, this.registerProviderListeners = () => {
      this.provider.on(P.payload, this.onPayloadHandler), this.provider.on(P.connect, this.onConnectHandler), this.provider.on(P.disconnect, this.onDisconnectHandler), this.provider.on(P.error, this.onProviderErrorHandler);
    }, this.core = e2.core, this.logger = typeof e2.logger < "u" && typeof e2.logger != "string" ? E2(e2.logger, this.name) : (0, import_pino2.default)(k3({ level: e2.logger || ct })), this.messages = new Pt(this.logger, e2.core), this.subscriber = new At(this, this.logger), this.publisher = new mr(this, this.logger), this.relayUrl = (e2 == null ? void 0 : e2.relayUrl) || ge, this.projectId = e2.projectId, this.bundleId = Jn(), this.provider = {};
  }
  async init() {
    this.logger.trace("Initialized"), this.registerEventListeners(), await this.createProvider(), await Promise.all([this.messages.init(), this.subscriber.init()]);
    try {
      await this.transportOpen();
    } catch {
      this.logger.warn(`Connection via ${this.relayUrl} failed, attempting to connect via failover domain ${pe}...`), await this.restartTransport(pe);
    }
    this.initialized = true, setTimeout(async () => {
      this.subscriber.topics.length === 0 && (this.logger.info("No topics subscribed to after init, closing transport"), await this.transportClose(), this.transportExplicitlyClosed = false);
    }, pt2);
  }
  get context() {
    return y2(this.logger);
  }
  get connected() {
    return this.provider.connection.connected;
  }
  get connecting() {
    return this.provider.connection.connecting;
  }
  async publish(e2, t, i3) {
    this.isInitialized(), await this.publisher.publish(e2, t, i3), await this.recordMessageEvent({ topic: e2, message: t, publishedAt: Date.now() });
  }
  async subscribe(e2, t) {
    var i3;
    this.isInitialized();
    let s2 = ((i3 = this.subscriber.topicMap.get(e2)) == null ? void 0 : i3[0]) || "";
    if (s2) return s2;
    let n4;
    const o3 = (a3) => {
      a3.topic === e2 && (this.subscriber.off(w4.created, o3), n4());
    };
    return await Promise.all([new Promise((a3) => {
      n4 = a3, this.subscriber.on(w4.created, o3);
    }), new Promise(async (a3) => {
      s2 = await this.subscriber.subscribe(e2, t), a3();
    })]), s2;
  }
  async unsubscribe(e2, t) {
    this.isInitialized(), await this.subscriber.unsubscribe(e2, t);
  }
  on(e2, t) {
    this.events.on(e2, t);
  }
  once(e2, t) {
    this.events.once(e2, t);
  }
  off(e2, t) {
    this.events.off(e2, t);
  }
  removeListener(e2, t) {
    this.events.removeListener(e2, t);
  }
  async transportClose() {
    this.transportExplicitlyClosed = true, this.hasExperiencedNetworkDisruption && this.connected ? await ut(this.provider.disconnect(), 1e3, "provider.disconnect()").catch(() => this.onProviderDisconnect()) : this.connected && await this.provider.disconnect();
  }
  async transportOpen(e2) {
    if (this.transportExplicitlyClosed = false, await this.confirmOnlineStateOrThrow(), !this.connectionAttemptInProgress) {
      e2 && e2 !== this.relayUrl && (this.relayUrl = e2, await this.transportClose(), await this.createProvider()), this.connectionAttemptInProgress = true;
      try {
        await Promise.all([new Promise((t) => {
          if (!this.initialized) return t();
          this.subscriber.once(w4.resubscribed, () => {
            t();
          });
        }), new Promise(async (t, i3) => {
          try {
            await ut(this.provider.connect(), 1e4, `Socket stalled when trying to connect to ${this.relayUrl}`);
          } catch (s2) {
            i3(s2);
            return;
          }
          t();
        })]);
      } catch (t) {
        this.logger.error(t);
        const i3 = t;
        if (!this.isConnectionStalled(i3.message)) throw t;
        this.provider.events.emit(P.disconnect);
      } finally {
        this.connectionAttemptInProgress = false, this.hasExperiencedNetworkDisruption = false;
      }
    }
  }
  async restartTransport(e2) {
    await this.confirmOnlineStateOrThrow(), !this.connectionAttemptInProgress && (this.relayUrl = e2 || this.relayUrl, await this.transportClose(), await this.createProvider(), await this.transportOpen());
  }
  async confirmOnlineStateOrThrow() {
    if (!await er()) throw new Error("No internet connection detected. Please restart your network and try again.");
  }
  isConnectionStalled(e2) {
    return this.staleConnectionErrors.some((t) => e2.includes(t));
  }
  async createProvider() {
    this.provider.connection && this.unregisterProviderListeners();
    const e2 = await this.core.crypto.signJWT(this.relayUrl);
    this.provider = new JsonRpcProvider(new f2(Xn({ sdkVersion: gt, protocol: this.protocol, version: this.version, relayUrl: this.relayUrl, projectId: this.projectId, auth: e2, useOnCloseEvent: true, bundleId: this.bundleId }))), this.registerProviderListeners();
  }
  async recordMessageEvent(e2) {
    const { topic: t, message: i3 } = e2;
    await this.messages.set(t, i3);
  }
  async shouldIgnoreMessageEvent(e2) {
    const { topic: t, message: i3 } = e2;
    if (!i3 || i3.length === 0) return this.logger.debug(`Ignoring invalid/empty message: ${i3}`), true;
    if (!await this.subscriber.isSubscribed(t)) return this.logger.debug(`Ignoring message for non-subscribed topic ${t}`), true;
    const s2 = this.messages.has(t, i3);
    return s2 && this.logger.debug(`Ignoring duplicate message: ${i3}`), s2;
  }
  async onProviderPayload(e2) {
    if (this.logger.debug("Incoming Relay Payload"), this.logger.trace({ type: "payload", direction: "incoming", payload: e2 }), isJsonRpcRequest(e2)) {
      if (!e2.method.endsWith(lt2)) return;
      const t = e2.params, { topic: i3, message: s2, publishedAt: n4 } = t.data, o3 = { topic: i3, message: s2, publishedAt: n4 };
      this.logger.debug("Emitting Relayer Payload"), this.logger.trace(Sr({ type: "event", event: t.id }, o3)), this.events.emit(t.id, o3), await this.acknowledgePayload(e2), await this.onMessageEvent(o3);
    } else isJsonRpcResponse(e2) && this.events.emit(D3.message_ack, e2);
  }
  async onMessageEvent(e2) {
    await this.shouldIgnoreMessageEvent(e2) || (this.events.emit(D3.message, e2), await this.recordMessageEvent(e2));
  }
  async acknowledgePayload(e2) {
    const t = formatJsonRpcResult(e2.id, true);
    await this.provider.connection.send(t);
  }
  unregisterProviderListeners() {
    this.provider.off(P.payload, this.onPayloadHandler), this.provider.off(P.connect, this.onConnectHandler), this.provider.off(P.disconnect, this.onDisconnectHandler), this.provider.off(P.error, this.onProviderErrorHandler);
  }
  async registerEventListeners() {
    this.events.on(D3.connection_stalled, () => {
      this.restartTransport().catch((t) => this.logger.error(t));
    });
    let e2 = await er();
    nr(async (t) => {
      this.initialized && e2 !== t && (e2 = t, t ? await this.restartTransport().catch((i3) => this.logger.error(i3)) : (this.hasExperiencedNetworkDisruption = true, await this.transportClose().catch((i3) => this.logger.error(i3))));
    });
  }
  onProviderDisconnect() {
    this.events.emit(D3.disconnect), this.attemptToReconnect();
  }
  attemptToReconnect() {
    this.transportExplicitlyClosed || (this.logger.info("attemptToReconnect called. Connecting..."), setTimeout(async () => {
      await this.restartTransport().catch((e2) => this.logger.error(e2));
    }, (0, import_time4.toMiliseconds)(dt2)));
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = N2("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
  async toEstablishConnection() {
    if (await this.confirmOnlineStateOrThrow(), !this.connected) {
      if (this.connectionAttemptInProgress) return await new Promise((e2) => {
        const t = setInterval(() => {
          this.connected && (clearInterval(t), e2());
        }, this.connectionStatusPollingInterval);
      });
      await this.restartTransport();
    }
  }
};
var Tr = Object.defineProperty;
var Lt = Object.getOwnPropertySymbols;
var Pr = Object.prototype.hasOwnProperty;
var xr = Object.prototype.propertyIsEnumerable;
var Ft = (r2, e2, t) => e2 in r2 ? Tr(r2, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r2[e2] = t;
var $t = (r2, e2) => {
  for (var t in e2 || (e2 = {})) Pr.call(e2, t) && Ft(r2, t, e2[t]);
  if (Lt) for (var t of Lt(e2)) xr.call(e2, t) && Ft(r2, t, e2[t]);
  return r2;
};
var Mt2 = class extends p2 {
  constructor(e2, t, i3, s2 = O2, n4 = void 0) {
    super(e2, t, i3, s2), this.core = e2, this.logger = t, this.name = i3, this.map = /* @__PURE__ */ new Map(), this.version = Dt, this.cached = [], this.initialized = false, this.storagePrefix = O2, this.init = async () => {
      this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((o3) => {
        this.getKey && o3 !== null && !w2(o3) ? this.map.set(this.getKey(o3), o3) : Vt(o3) ? this.map.set(o3.id, o3) : Mt(o3) && this.map.set(o3.topic, o3);
      }), this.cached = [], this.initialized = true);
    }, this.set = async (o3, a3) => {
      this.isInitialized(), this.map.has(o3) ? await this.update(o3, a3) : (this.logger.debug("Setting value"), this.logger.trace({ type: "method", method: "set", key: o3, value: a3 }), this.map.set(o3, a3), await this.persist());
    }, this.get = (o3) => (this.isInitialized(), this.logger.debug("Getting value"), this.logger.trace({ type: "method", method: "get", key: o3 }), this.getData(o3)), this.getAll = (o3) => (this.isInitialized(), o3 ? this.values.filter((a3) => Object.keys(o3).every((h7) => (0, import_lodash.default)(a3[h7], o3[h7]))) : this.values), this.update = async (o3, a3) => {
      this.isInitialized(), this.logger.debug("Updating value"), this.logger.trace({ type: "method", method: "update", key: o3, update: a3 });
      const h7 = $t($t({}, this.getData(o3)), a3);
      this.map.set(o3, h7), await this.persist();
    }, this.delete = async (o3, a3) => {
      this.isInitialized(), this.map.has(o3) && (this.logger.debug("Deleting value"), this.logger.trace({ type: "method", method: "delete", key: o3, reason: a3 }), this.map.delete(o3), await this.persist());
    }, this.logger = E2(t, this.name), this.storagePrefix = s2, this.getKey = n4;
  }
  get context() {
    return y2(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  get length() {
    return this.map.size;
  }
  get keys() {
    return Array.from(this.map.keys());
  }
  get values() {
    return Array.from(this.map.values());
  }
  async setDataStore(e2) {
    await this.core.storage.setItem(this.storageKey, e2);
  }
  async getDataStore() {
    return await this.core.storage.getItem(this.storageKey);
  }
  getData(e2) {
    const t = this.map.get(e2);
    if (!t) {
      const { message: i3 } = N2("NO_MATCHING_KEY", `${this.name}: ${e2}`);
      throw this.logger.error(i3), new Error(i3);
    }
    return t;
  }
  async persist() {
    await this.setDataStore(this.values);
  }
  async restore() {
    try {
      const e2 = await this.getDataStore();
      if (typeof e2 > "u" || !e2.length) return;
      if (this.map.size) {
        const { message: t } = N2("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), new Error(t);
      }
      this.cached = e2, this.logger.debug(`Successfully Restored value for ${this.name}`), this.logger.trace({ type: "method", method: "restore", value: this.values });
    } catch (e2) {
      this.logger.debug(`Failed to Restore value for ${this.name}`), this.logger.error(e2);
    }
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = N2("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
};
var kt2 = class {
  constructor(e2, t) {
    this.core = e2, this.logger = t, this.name = Et2, this.version = wt2, this.events = new import_events5.default(), this.initialized = false, this.storagePrefix = O2, this.ignoredPayloadTypes = [_3], this.registeredMethods = [], this.init = async () => {
      this.initialized || (await this.pairings.init(), await this.cleanup(), this.registerRelayerEvents(), this.registerExpirerEvents(), this.initialized = true, this.logger.trace("Initialized"));
    }, this.register = ({ methods: i3 }) => {
      this.isInitialized(), this.registeredMethods = [.../* @__PURE__ */ new Set([...this.registeredMethods, ...i3])];
    }, this.create = async () => {
      this.isInitialized();
      const i3 = Vn(), s2 = await this.core.crypto.setSymKey(i3), n4 = pt(import_time4.FIVE_MINUTES), o3 = { protocol: ht }, a3 = { topic: s2, expiry: n4, relay: o3, active: false }, h7 = It({ protocol: this.core.protocol, version: this.core.version, topic: s2, symKey: i3, relay: o3 });
      return await this.pairings.set(s2, a3), await this.core.relayer.subscribe(s2), this.core.expirer.set(s2, n4), { topic: s2, uri: h7 };
    }, this.pair = async (i3) => {
      this.isInitialized(), this.isValidPair(i3);
      const { topic: s2, symKey: n4, relay: o3 } = wt(i3.uri);
      let a3;
      if (this.pairings.keys.includes(s2) && (a3 = this.pairings.get(s2), a3.active)) throw new Error(`Pairing already exists: ${s2}. Please try again with a new connection URI.`);
      const h7 = pt(import_time4.FIVE_MINUTES), l4 = { topic: s2, relay: o3, expiry: h7, active: false };
      return await this.pairings.set(s2, l4), this.core.expirer.set(s2, h7), i3.activatePairing && await this.activate({ topic: s2 }), this.events.emit(V.create, l4), this.core.crypto.keychain.has(s2) || (await this.core.crypto.setSymKey(n4, s2), await this.core.relayer.subscribe(s2, { relay: o3 })), l4;
    }, this.activate = async ({ topic: i3 }) => {
      this.isInitialized();
      const s2 = pt(import_time4.THIRTY_DAYS);
      await this.pairings.update(i3, { active: true, expiry: s2 }), this.core.expirer.set(i3, s2);
    }, this.ping = async (i3) => {
      this.isInitialized(), await this.isValidPing(i3);
      const { topic: s2 } = i3;
      if (this.pairings.keys.includes(s2)) {
        const n4 = await this.sendRequest(s2, "wc_pairingPing", {}), { done: o3, resolve: a3, reject: h7 } = at();
        this.events.once(yt("pairing_ping", n4), ({ error: l4 }) => {
          l4 ? h7(l4) : a3();
        }), await o3();
      }
    }, this.updateExpiry = async ({ topic: i3, expiry: s2 }) => {
      this.isInitialized(), await this.pairings.update(i3, { expiry: s2 });
    }, this.updateMetadata = async ({ topic: i3, metadata: s2 }) => {
      this.isInitialized(), await this.pairings.update(i3, { peerMetadata: s2 });
    }, this.getPairings = () => (this.isInitialized(), this.pairings.values), this.disconnect = async (i3) => {
      this.isInitialized(), await this.isValidDisconnect(i3);
      const { topic: s2 } = i3;
      this.pairings.keys.includes(s2) && (await this.sendRequest(s2, "wc_pairingDelete", U3("USER_DISCONNECTED")), await this.deletePairing(s2));
    }, this.sendRequest = async (i3, s2, n4) => {
      const o3 = formatJsonRpcRequest(s2, n4), a3 = await this.core.crypto.encode(i3, o3), h7 = F2[s2].req;
      return this.core.history.set(i3, o3), this.core.relayer.publish(i3, a3, h7), o3.id;
    }, this.sendResult = async (i3, s2, n4) => {
      const o3 = formatJsonRpcResult(i3, n4), a3 = await this.core.crypto.encode(s2, o3), h7 = await this.core.history.get(s2, i3), l4 = F2[h7.request.method].res;
      await this.core.relayer.publish(s2, a3, l4), await this.core.history.resolve(o3);
    }, this.sendError = async (i3, s2, n4) => {
      const o3 = formatJsonRpcError(i3, n4), a3 = await this.core.crypto.encode(s2, o3), h7 = await this.core.history.get(s2, i3), l4 = F2[h7.request.method] ? F2[h7.request.method].res : F2.unregistered_method.res;
      await this.core.relayer.publish(s2, a3, l4), await this.core.history.resolve(o3);
    }, this.deletePairing = async (i3, s2) => {
      await this.core.relayer.unsubscribe(i3), await Promise.all([this.pairings.delete(i3, U3("USER_DISCONNECTED")), this.core.crypto.deleteSymKey(i3), s2 ? Promise.resolve() : this.core.expirer.del(i3)]);
    }, this.cleanup = async () => {
      const i3 = this.pairings.getAll().filter((s2) => mt(s2.expiry));
      await Promise.all(i3.map((s2) => this.deletePairing(s2.topic)));
    }, this.onRelayEventRequest = (i3) => {
      const { topic: s2, payload: n4 } = i3;
      switch (n4.method) {
        case "wc_pairingPing":
          return this.onPairingPingRequest(s2, n4);
        case "wc_pairingDelete":
          return this.onPairingDeleteRequest(s2, n4);
        default:
          return this.onUnknownRpcMethodRequest(s2, n4);
      }
    }, this.onRelayEventResponse = async (i3) => {
      const { topic: s2, payload: n4 } = i3, o3 = (await this.core.history.get(s2, n4.id)).request.method;
      switch (o3) {
        case "wc_pairingPing":
          return this.onPairingPingResponse(s2, n4);
        default:
          return this.onUnknownRpcMethodResponse(o3);
      }
    }, this.onPairingPingRequest = async (i3, s2) => {
      const { id: n4 } = s2;
      try {
        this.isValidPing({ topic: i3 }), await this.sendResult(n4, i3, true), this.events.emit(V.ping, { id: n4, topic: i3 });
      } catch (o3) {
        await this.sendError(n4, i3, o3), this.logger.error(o3);
      }
    }, this.onPairingPingResponse = (i3, s2) => {
      const { id: n4 } = s2;
      setTimeout(() => {
        isJsonRpcResult(s2) ? this.events.emit(yt("pairing_ping", n4), {}) : isJsonRpcError(s2) && this.events.emit(yt("pairing_ping", n4), { error: s2.error });
      }, 500);
    }, this.onPairingDeleteRequest = async (i3, s2) => {
      const { id: n4 } = s2;
      try {
        this.isValidDisconnect({ topic: i3 }), await this.deletePairing(i3), this.events.emit(V.delete, { id: n4, topic: i3 });
      } catch (o3) {
        await this.sendError(n4, i3, o3), this.logger.error(o3);
      }
    }, this.onUnknownRpcMethodRequest = async (i3, s2) => {
      const { id: n4, method: o3 } = s2;
      try {
        if (this.registeredMethods.includes(o3)) return;
        const a3 = U3("WC_METHOD_UNSUPPORTED", o3);
        await this.sendError(n4, i3, a3), this.logger.error(a3);
      } catch (a3) {
        await this.sendError(n4, i3, a3), this.logger.error(a3);
      }
    }, this.onUnknownRpcMethodResponse = (i3) => {
      this.registeredMethods.includes(i3) || this.logger.error(U3("WC_METHOD_UNSUPPORTED", i3));
    }, this.isValidPair = (i3) => {
      var s2;
      if (!Ht(i3)) {
        const { message: o3 } = N2("MISSING_OR_INVALID", `pair() params: ${i3}`);
        throw new Error(o3);
      }
      if (!kt(i3.uri)) {
        const { message: o3 } = N2("MISSING_OR_INVALID", `pair() uri: ${i3.uri}`);
        throw new Error(o3);
      }
      const n4 = wt(i3.uri);
      if (!((s2 = n4 == null ? void 0 : n4.relay) != null && s2.protocol)) {
        const { message: o3 } = N2("MISSING_OR_INVALID", "pair() uri#relay-protocol");
        throw new Error(o3);
      }
      if (!(n4 != null && n4.symKey)) {
        const { message: o3 } = N2("MISSING_OR_INVALID", "pair() uri#symKey");
        throw new Error(o3);
      }
    }, this.isValidPing = async (i3) => {
      if (!Ht(i3)) {
        const { message: n4 } = N2("MISSING_OR_INVALID", `ping() params: ${i3}`);
        throw new Error(n4);
      }
      const { topic: s2 } = i3;
      await this.isValidPairingTopic(s2);
    }, this.isValidDisconnect = async (i3) => {
      if (!Ht(i3)) {
        const { message: n4 } = N2("MISSING_OR_INVALID", `disconnect() params: ${i3}`);
        throw new Error(n4);
      }
      const { topic: s2 } = i3;
      await this.isValidPairingTopic(s2);
    }, this.isValidPairingTopic = async (i3) => {
      if (!h4(i3, false)) {
        const { message: s2 } = N2("MISSING_OR_INVALID", `pairing topic should be a string: ${i3}`);
        throw new Error(s2);
      }
      if (!this.pairings.keys.includes(i3)) {
        const { message: s2 } = N2("NO_MATCHING_KEY", `pairing topic doesn't exist: ${i3}`);
        throw new Error(s2);
      }
      if (mt(this.pairings.get(i3).expiry)) {
        await this.deletePairing(i3);
        const { message: s2 } = N2("EXPIRED", `pairing topic: ${i3}`);
        throw new Error(s2);
      }
    }, this.core = e2, this.logger = E2(t, this.name), this.pairings = new Mt2(this.core, this.logger, this.name, this.storagePrefix);
  }
  get context() {
    return y2(this.logger);
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = N2("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
  registerRelayerEvents() {
    this.core.relayer.on(D3.message, async (e2) => {
      const { topic: t, message: i3 } = e2;
      if (!this.pairings.keys.includes(t) || this.ignoredPayloadTypes.includes(this.core.crypto.getPayloadType(i3))) return;
      const s2 = await this.core.crypto.decode(t, i3);
      try {
        isJsonRpcRequest(s2) ? (this.core.history.set(t, s2), this.onRelayEventRequest({ topic: t, payload: s2 })) : isJsonRpcResponse(s2) && (await this.core.history.resolve(s2), await this.onRelayEventResponse({ topic: t, payload: s2 }), this.core.history.delete(t, s2.id));
      } catch (n4) {
        this.logger.error(n4);
      }
    });
  }
  registerExpirerEvents() {
    this.core.expirer.on(v2.expired, async (e2) => {
      const { topic: t } = ft(e2.target);
      t && this.pairings.keys.includes(t) && (await this.deletePairing(t, true), this.events.emit(V.expire, { topic: t }));
    });
  }
};
var Kt = class extends h3 {
  constructor(e2, t) {
    super(e2, t), this.core = e2, this.logger = t, this.records = /* @__PURE__ */ new Map(), this.events = new import_events5.EventEmitter(), this.name = vt2, this.version = It2, this.cached = [], this.initialized = false, this.storagePrefix = O2, this.init = async () => {
      this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((i3) => this.records.set(i3.id, i3)), this.cached = [], this.registerEventListeners(), this.initialized = true);
    }, this.set = (i3, s2, n4) => {
      if (this.isInitialized(), this.logger.debug("Setting JSON-RPC request history record"), this.logger.trace({ type: "method", method: "set", topic: i3, request: s2, chainId: n4 }), this.records.has(s2.id)) return;
      const o3 = { id: s2.id, topic: i3, request: { method: s2.method, params: s2.params || null }, chainId: n4, expiry: pt(import_time4.THIRTY_DAYS) };
      this.records.set(o3.id, o3), this.events.emit(R.created, o3);
    }, this.resolve = async (i3) => {
      if (this.isInitialized(), this.logger.debug("Updating JSON-RPC response history record"), this.logger.trace({ type: "method", method: "update", response: i3 }), !this.records.has(i3.id)) return;
      const s2 = await this.getRecord(i3.id);
      typeof s2.response > "u" && (s2.response = isJsonRpcError(i3) ? { error: i3.error } : { result: i3.result }, this.records.set(s2.id, s2), this.events.emit(R.updated, s2));
    }, this.get = async (i3, s2) => (this.isInitialized(), this.logger.debug("Getting record"), this.logger.trace({ type: "method", method: "get", topic: i3, id: s2 }), await this.getRecord(s2)), this.delete = (i3, s2) => {
      this.isInitialized(), this.logger.debug("Deleting record"), this.logger.trace({ type: "method", method: "delete", id: s2 }), this.values.forEach((n4) => {
        if (n4.topic === i3) {
          if (typeof s2 < "u" && n4.id !== s2) return;
          this.records.delete(n4.id), this.events.emit(R.deleted, n4);
        }
      });
    }, this.exists = async (i3, s2) => (this.isInitialized(), this.records.has(s2) ? (await this.getRecord(s2)).topic === i3 : false), this.on = (i3, s2) => {
      this.events.on(i3, s2);
    }, this.once = (i3, s2) => {
      this.events.once(i3, s2);
    }, this.off = (i3, s2) => {
      this.events.off(i3, s2);
    }, this.removeListener = (i3, s2) => {
      this.events.removeListener(i3, s2);
    }, this.logger = E2(t, this.name);
  }
  get context() {
    return y2(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  get size() {
    return this.records.size;
  }
  get keys() {
    return Array.from(this.records.keys());
  }
  get values() {
    return Array.from(this.records.values());
  }
  get pending() {
    const e2 = [];
    return this.values.forEach((t) => {
      if (typeof t.response < "u") return;
      const i3 = { topic: t.topic, request: formatJsonRpcRequest(t.request.method, t.request.params, t.id), chainId: t.chainId };
      return e2.push(i3);
    }), e2;
  }
  async setJsonRpcRecords(e2) {
    await this.core.storage.setItem(this.storageKey, e2);
  }
  async getJsonRpcRecords() {
    return await this.core.storage.getItem(this.storageKey);
  }
  getRecord(e2) {
    this.isInitialized();
    const t = this.records.get(e2);
    if (!t) {
      const { message: i3 } = N2("NO_MATCHING_KEY", `${this.name}: ${e2}`);
      throw new Error(i3);
    }
    return t;
  }
  async persist() {
    await this.setJsonRpcRecords(this.values), this.events.emit(R.sync);
  }
  async restore() {
    try {
      const e2 = await this.getJsonRpcRecords();
      if (typeof e2 > "u" || !e2.length) return;
      if (this.records.size) {
        const { message: t } = N2("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), new Error(t);
      }
      this.cached = e2, this.logger.debug(`Successfully Restored records for ${this.name}`), this.logger.trace({ type: "method", method: "restore", records: this.values });
    } catch (e2) {
      this.logger.debug(`Failed to Restore records for ${this.name}`), this.logger.error(e2);
    }
  }
  registerEventListeners() {
    this.events.on(R.created, (e2) => {
      const t = R.created;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, record: e2 }), this.persist();
    }), this.events.on(R.updated, (e2) => {
      const t = R.updated;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, record: e2 }), this.persist();
    }), this.events.on(R.deleted, (e2) => {
      const t = R.deleted;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, record: e2 }), this.persist();
    }), this.core.heartbeat.on(import_heartbeat.HEARTBEAT_EVENTS.pulse, () => {
      this.cleanup();
    });
  }
  cleanup() {
    try {
      this.records.forEach((e2) => {
        (0, import_time4.toMiliseconds)(e2.expiry || 0) - Date.now() <= 0 && (this.logger.info(`Deleting expired history log: ${e2.id}`), this.delete(e2.topic, e2.id));
      });
    } catch (e2) {
      this.logger.warn(e2);
    }
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = N2("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
};
var Bt = class extends E3 {
  constructor(e2, t) {
    super(e2, t), this.core = e2, this.logger = t, this.expirations = /* @__PURE__ */ new Map(), this.events = new import_events5.EventEmitter(), this.name = Ct, this.version = Rt, this.cached = [], this.initialized = false, this.storagePrefix = O2, this.init = async () => {
      this.initialized || (this.logger.trace("Initialized"), await this.restore(), this.cached.forEach((i3) => this.expirations.set(i3.target, i3)), this.cached = [], this.registerEventListeners(), this.initialized = true);
    }, this.has = (i3) => {
      try {
        const s2 = this.formatTarget(i3);
        return typeof this.getExpiration(s2) < "u";
      } catch {
        return false;
      }
    }, this.set = (i3, s2) => {
      this.isInitialized();
      const n4 = this.formatTarget(i3), o3 = { target: n4, expiry: s2 };
      this.expirations.set(n4, o3), this.checkExpiry(n4, o3), this.events.emit(v2.created, { target: n4, expiration: o3 });
    }, this.get = (i3) => {
      this.isInitialized();
      const s2 = this.formatTarget(i3);
      return this.getExpiration(s2);
    }, this.del = (i3) => {
      if (this.isInitialized(), this.has(i3)) {
        const s2 = this.formatTarget(i3), n4 = this.getExpiration(s2);
        this.expirations.delete(s2), this.events.emit(v2.deleted, { target: s2, expiration: n4 });
      }
    }, this.on = (i3, s2) => {
      this.events.on(i3, s2);
    }, this.once = (i3, s2) => {
      this.events.once(i3, s2);
    }, this.off = (i3, s2) => {
      this.events.off(i3, s2);
    }, this.removeListener = (i3, s2) => {
      this.events.removeListener(i3, s2);
    }, this.logger = E2(t, this.name);
  }
  get context() {
    return y2(this.logger);
  }
  get storageKey() {
    return this.storagePrefix + this.version + this.core.customStoragePrefix + "//" + this.name;
  }
  get length() {
    return this.expirations.size;
  }
  get keys() {
    return Array.from(this.expirations.keys());
  }
  get values() {
    return Array.from(this.expirations.values());
  }
  formatTarget(e2) {
    if (typeof e2 == "string") return lt(e2);
    if (typeof e2 == "number") return dt(e2);
    const { message: t } = N2("UNKNOWN_TYPE", `Target type: ${typeof e2}`);
    throw new Error(t);
  }
  async setExpirations(e2) {
    await this.core.storage.setItem(this.storageKey, e2);
  }
  async getExpirations() {
    return await this.core.storage.getItem(this.storageKey);
  }
  async persist() {
    await this.setExpirations(this.values), this.events.emit(v2.sync);
  }
  async restore() {
    try {
      const e2 = await this.getExpirations();
      if (typeof e2 > "u" || !e2.length) return;
      if (this.expirations.size) {
        const { message: t } = N2("RESTORE_WILL_OVERRIDE", this.name);
        throw this.logger.error(t), new Error(t);
      }
      this.cached = e2, this.logger.debug(`Successfully Restored expirations for ${this.name}`), this.logger.trace({ type: "method", method: "restore", expirations: this.values });
    } catch (e2) {
      this.logger.debug(`Failed to Restore expirations for ${this.name}`), this.logger.error(e2);
    }
  }
  getExpiration(e2) {
    const t = this.expirations.get(e2);
    if (!t) {
      const { message: i3 } = N2("NO_MATCHING_KEY", `${this.name}: ${e2}`);
      throw this.logger.error(i3), new Error(i3);
    }
    return t;
  }
  checkExpiry(e2, t) {
    const { expiry: i3 } = t;
    (0, import_time4.toMiliseconds)(i3) - Date.now() <= 0 && this.expire(e2, t);
  }
  expire(e2, t) {
    this.expirations.delete(e2), this.events.emit(v2.expired, { target: e2, expiration: t });
  }
  checkExpirations() {
    this.core.relayer.connected && this.expirations.forEach((e2, t) => this.checkExpiry(t, e2));
  }
  registerEventListeners() {
    this.core.heartbeat.on(import_heartbeat.HEARTBEAT_EVENTS.pulse, () => this.checkExpirations()), this.events.on(v2.created, (e2) => {
      const t = v2.created;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e2 }), this.persist();
    }), this.events.on(v2.expired, (e2) => {
      const t = v2.expired;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e2 }), this.persist();
    }), this.events.on(v2.deleted, (e2) => {
      const t = v2.deleted;
      this.logger.info(`Emitting ${t}`), this.logger.debug({ type: "event", event: t, data: e2 }), this.persist();
    });
  }
  isInitialized() {
    if (!this.initialized) {
      const { message: e2 } = N2("NOT_INITIALIZED", this.name);
      throw new Error(e2);
    }
  }
};
var Vt2 = class extends y3 {
  constructor(e2, t) {
    super(e2, t), this.projectId = e2, this.logger = t, this.name = Z2, this.initialized = false, this.queue = [], this.verifyDisabled = false, this.init = async (i3) => {
      if (this.verifyDisabled || C2() || !D2()) return;
      const s2 = this.getVerifyUrl(i3 == null ? void 0 : i3.verifyUrl);
      this.verifyUrl !== s2 && this.removeIframe(), this.verifyUrl = s2;
      try {
        await this.createIframe();
      } catch (n4) {
        this.logger.info(`Verify iframe failed to load: ${this.verifyUrl}`), this.logger.info(n4);
      }
      if (!this.initialized) {
        this.removeIframe(), this.verifyUrl = ee2;
        try {
          await this.createIframe();
        } catch (n4) {
          this.logger.info(`Verify iframe failed to load: ${this.verifyUrl}`), this.logger.info(n4), this.verifyDisabled = true;
        }
      }
    }, this.register = async (i3) => {
      this.initialized ? this.sendPost(i3.attestationId) : (this.addToQueue(i3.attestationId), await this.init());
    }, this.resolve = async (i3) => {
      if (this.isDevEnv) return "";
      const s2 = this.getVerifyUrl(i3 == null ? void 0 : i3.verifyUrl);
      let n4;
      try {
        n4 = await this.fetchAttestation(i3.attestationId, s2);
      } catch (o3) {
        this.logger.info(`failed to resolve attestation: ${i3.attestationId} from url: ${s2}`), this.logger.info(o3), n4 = await this.fetchAttestation(i3.attestationId, ee2);
      }
      return n4;
    }, this.fetchAttestation = async (i3, s2) => {
      this.logger.info(`resolving attestation: ${i3} from url: ${s2}`);
      const n4 = this.startAbortTimer(import_time4.ONE_SECOND * 2), o3 = await fetch(`${s2}/attestation/${i3}`, { signal: this.abortController.signal });
      return clearTimeout(n4), o3.status === 200 ? await o3.json() : void 0;
    }, this.addToQueue = (i3) => {
      this.queue.push(i3);
    }, this.processQueue = () => {
      this.queue.length !== 0 && (this.queue.forEach((i3) => this.sendPost(i3)), this.queue = []);
    }, this.sendPost = (i3) => {
      var s2;
      try {
        if (!this.iframe) return;
        (s2 = this.iframe.contentWindow) == null || s2.postMessage(i3, "*"), this.logger.info(`postMessage sent: ${i3} ${this.verifyUrl}`);
      } catch {
      }
    }, this.createIframe = async () => {
      let i3;
      const s2 = (n4) => {
        n4.data === "verify_ready" && (this.initialized = true, this.processQueue(), window.removeEventListener("message", s2), i3());
      };
      await Promise.race([new Promise((n4) => {
        if (document.getElementById(Z2)) return n4();
        window.addEventListener("message", s2);
        const o3 = document.createElement("iframe");
        o3.id = Z2, o3.src = `${this.verifyUrl}/${this.projectId}`, o3.style.display = "none", document.body.append(o3), this.iframe = o3, i3 = n4;
      }), new Promise((n4, o3) => setTimeout(() => {
        window.removeEventListener("message", s2), o3("verify iframe load timeout");
      }, (0, import_time4.toMiliseconds)(import_time4.FIVE_SECONDS)))]);
    }, this.removeIframe = () => {
      this.iframe && (this.iframe.remove(), this.iframe = void 0, this.initialized = false);
    }, this.getVerifyUrl = (i3) => {
      let s2 = i3 || $2;
      return _t.includes(s2) || (this.logger.info(`verify url: ${s2}, not included in trusted list, assigning default: ${$2}`), s2 = $2), s2;
    }, this.logger = E2(t, this.name), this.verifyUrl = $2, this.abortController = new AbortController(), this.isDevEnv = te() && process.env.IS_VITEST;
  }
  get context() {
    return y2(this.logger);
  }
  startAbortTimer(e2) {
    return this.abortController = new AbortController(), setTimeout(() => this.abortController.abort(), (0, import_time4.toMiliseconds)(e2));
  }
};
var Or = Object.defineProperty;
var qt = Object.getOwnPropertySymbols;
var Ar = Object.prototype.hasOwnProperty;
var zr = Object.prototype.propertyIsEnumerable;
var jt = (r2, e2, t) => e2 in r2 ? Or(r2, e2, { enumerable: true, configurable: true, writable: true, value: t }) : r2[e2] = t;
var Gt = (r2, e2) => {
  for (var t in e2 || (e2 = {})) Ar.call(e2, t) && jt(r2, t, e2[t]);
  if (qt) for (var t of qt(e2)) zr.call(e2, t) && jt(r2, t, e2[t]);
  return r2;
};
var te2 = class _te extends n2 {
  constructor(e2) {
    super(e2), this.protocol = le3, this.version = Xe, this.name = Q2, this.events = new import_events5.EventEmitter(), this.initialized = false, this.on = (i3, s2) => this.events.on(i3, s2), this.once = (i3, s2) => this.events.once(i3, s2), this.off = (i3, s2) => this.events.off(i3, s2), this.removeListener = (i3, s2) => this.events.removeListener(i3, s2), this.projectId = e2 == null ? void 0 : e2.projectId, this.relayUrl = (e2 == null ? void 0 : e2.relayUrl) || ge, this.customStoragePrefix = e2 != null && e2.customStoragePrefix ? `:${e2.customStoragePrefix}` : "";
    const t = typeof (e2 == null ? void 0 : e2.logger) < "u" && typeof (e2 == null ? void 0 : e2.logger) != "string" ? e2.logger : (0, import_pino2.default)(k3({ level: (e2 == null ? void 0 : e2.logger) || Qe.logger }));
    this.logger = E2(t, this.name), this.heartbeat = new import_heartbeat.HeartBeat(), this.crypto = new Tt(this, this.logger, e2 == null ? void 0 : e2.keychain), this.history = new Kt(this, this.logger), this.expirer = new Bt(this, this.logger), this.storage = e2 != null && e2.storage ? e2.storage : new h(Gt(Gt({}, Ze), e2 == null ? void 0 : e2.storageOptions)), this.relayer = new Ut({ core: this, logger: this.logger, relayUrl: this.relayUrl, projectId: this.projectId }), this.pairing = new kt2(this, this.logger), this.verify = new Vt2(this.projectId || "", this.logger);
  }
  static async init(e2) {
    const t = new _te(e2);
    await t.initialize();
    const i3 = await t.crypto.getClientId();
    return await t.storage.setItem(yt2, i3), t;
  }
  get context() {
    return y2(this.logger);
  }
  async start() {
    this.initialized || await this.initialize();
  }
  async initialize() {
    this.logger.trace("Initialized");
    try {
      await this.crypto.init(), await this.history.init(), await this.expirer.init(), await this.relayer.init(), await this.heartbeat.init(), await this.pairing.init(), this.initialized = true, this.logger.info("Core Initialization Success");
    } catch (e2) {
      throw this.logger.warn(`Core Initialization Failure at epoch ${Date.now()}`, e2), this.logger.error(e2.message), e2;
    }
  }
};
var Nr = te2;

// node_modules/@walletconnect/sign-client/node_modules/@walletconnect/utils/dist/index.es.js
var import_chacha20poly13053 = __toESM(require_chacha20poly1305());
var import_hkdf3 = __toESM(require_hkdf());
var import_random4 = __toESM(require_random());
var import_sha2563 = __toESM(require_sha256());
var fe3 = __toESM(require_x25519());
var import_time5 = __toESM(require_cjs());
var import_window_getters3 = __toESM(require_cjs2());
var import_window_metadata3 = __toESM(require_cjs3());
var M3 = __toESM(require_query_string3());
function L2(e2, n4) {
  return e2.includes(":") ? [e2] : n4.chains || [];
}
var p4 = "base16";
var H2 = "utf8";
var _4 = 1;
function Ln2(e2) {
  const n4 = (0, import_sha2563.hash)(fromString(e2, H2));
  return toString(n4, p4);
}
var Ce2 = "ReactNative";
var m2 = { reactNative: "react-native", node: "node", browser: "browser", unknown: "unknown" };
function te3() {
  return typeof process < "u" && typeof process.versions < "u" && typeof process.versions.node < "u";
}
function C3() {
  return !(0, import_window_getters3.getDocument)() && !!(0, import_window_getters3.getNavigator)() && navigator.product === Ce2;
}
function D4() {
  return !te3() && !!(0, import_window_getters3.getNavigator)();
}
function T3() {
  return C3() ? m2.reactNative : te3() ? m2.node : D4() ? m2.browser : m2.unknown;
}
function Qn() {
  return (0, import_window_metadata3.getWindowMetadata)() || { name: "", description: "", url: "", icons: [""] };
}
function O3(e2, n4) {
  return e2.filter((t) => n4.includes(t)).length === e2.length;
}
function at3(e2 = import_time5.FIVE_MINUTES, n4) {
  const t = (0, import_time5.toMiliseconds)(e2 || import_time5.FIVE_MINUTES);
  let r2, o3, s2;
  return { resolve: (i3) => {
    s2 && r2 && (clearTimeout(s2), r2(i3));
  }, reject: (i3) => {
    s2 && o3 && (clearTimeout(s2), o3(i3));
  }, done: () => new Promise((i3, d3) => {
    s2 = setTimeout(() => {
      d3(new Error(n4));
    }, t), r2 = i3, o3 = d3;
  }) };
}
function ft3(e2) {
  const [n4, t] = e2.split(":"), r2 = { id: void 0, topic: void 0 };
  if (n4 === "topic" && typeof t == "string") r2.topic = t;
  else if (n4 === "id" && Number.isInteger(Number(t))) r2.id = Number(t);
  else throw new Error(`Invalid target, expected id:number or topic:string, got ${n4}:${t}`);
  return r2;
}
function pt3(e2, n4) {
  return (0, import_time5.fromMiliseconds)((n4 || Date.now()) + (0, import_time5.toMiliseconds)(e2));
}
function mt3(e2) {
  return Date.now() >= (0, import_time5.toMiliseconds)(e2);
}
function yt3(e2, n4) {
  return `${e2}${n4 ? `:${n4}` : ""}`;
}
async function ht2({ id: e2, topic: n4, wcDeepLink: t }) {
  try {
    if (!t) return;
    const r2 = typeof t == "string" ? JSON.parse(t) : t;
    let o3 = r2 == null ? void 0 : r2.href;
    if (typeof o3 != "string") return;
    o3.endsWith("/") && (o3 = o3.slice(0, -1));
    const s2 = `${o3}/wc?requestId=${e2}&sessionTopic=${n4}`, i3 = T3();
    i3 === m2.browser ? s2.startsWith("https://") ? window.open(s2, "_blank", "noreferrer noopener") : window.open(s2, "_self", "noreferrer noopener") : i3 === m2.reactNative && typeof (global == null ? void 0 : global.Linking) < "u" && await global.Linking.openURL(s2);
  } catch (r2) {
    console.error(r2);
  }
}
async function gt2(e2, n4) {
  try {
    return await e2.getItem(n4) || (D4() ? localStorage.getItem(n4) : void 0);
  } catch (t) {
    console.error(t);
  }
}
function A(e2) {
  const n4 = [];
  return e2.forEach((t) => {
    const [r2, o3] = t.split(":");
    n4.push(`${r2}:${o3}`);
  }), n4;
}
function Je2(e2) {
  const n4 = [];
  return Object.values(e2).forEach((t) => {
    n4.push(...A(t.accounts));
  }), n4;
}
function Qe2(e2, n4) {
  const t = [];
  return Object.values(e2).forEach((r2) => {
    A(r2.accounts).includes(n4) && t.push(...r2.methods);
  }), t;
}
function Ze2(e2, n4) {
  const t = [];
  return Object.values(e2).forEach((r2) => {
    A(r2.accounts).includes(n4) && t.push(...r2.events);
  }), t;
}
function jt2(e2, n4) {
  const t = un(e2, n4);
  if (t) throw new Error(t.message);
  const r2 = {};
  for (const [o3, s2] of Object.entries(e2)) r2[o3] = { methods: s2.methods, events: s2.events, chains: s2.accounts.map((i3) => `${i3.split(":")[0]}:${i3.split(":")[1]}`) };
  return r2;
}
var en3 = { INVALID_METHOD: { message: "Invalid method.", code: 1001 }, INVALID_EVENT: { message: "Invalid event.", code: 1002 }, INVALID_UPDATE_REQUEST: { message: "Invalid update request.", code: 1003 }, INVALID_EXTEND_REQUEST: { message: "Invalid extend request.", code: 1004 }, INVALID_SESSION_SETTLE_REQUEST: { message: "Invalid session settle request.", code: 1005 }, UNAUTHORIZED_METHOD: { message: "Unauthorized method.", code: 3001 }, UNAUTHORIZED_EVENT: { message: "Unauthorized event.", code: 3002 }, UNAUTHORIZED_UPDATE_REQUEST: { message: "Unauthorized update request.", code: 3003 }, UNAUTHORIZED_EXTEND_REQUEST: { message: "Unauthorized extend request.", code: 3004 }, USER_REJECTED: { message: "User rejected.", code: 5e3 }, USER_REJECTED_CHAINS: { message: "User rejected chains.", code: 5001 }, USER_REJECTED_METHODS: { message: "User rejected methods.", code: 5002 }, USER_REJECTED_EVENTS: { message: "User rejected events.", code: 5003 }, UNSUPPORTED_CHAINS: { message: "Unsupported chains.", code: 5100 }, UNSUPPORTED_METHODS: { message: "Unsupported methods.", code: 5101 }, UNSUPPORTED_EVENTS: { message: "Unsupported events.", code: 5102 }, UNSUPPORTED_ACCOUNTS: { message: "Unsupported accounts.", code: 5103 }, UNSUPPORTED_NAMESPACE_KEY: { message: "Unsupported namespace key.", code: 5104 }, USER_DISCONNECTED: { message: "User disconnected.", code: 6e3 }, SESSION_SETTLEMENT_FAILED: { message: "Session settlement failed.", code: 7e3 }, WC_METHOD_UNSUPPORTED: { message: "Unsupported wc_ method.", code: 10001 } };
var nn2 = { NOT_INITIALIZED: { message: "Not initialized.", code: 1 }, NO_MATCHING_KEY: { message: "No matching key.", code: 2 }, RESTORE_WILL_OVERRIDE: { message: "Restore will override.", code: 3 }, RESUBSCRIBED: { message: "Resubscribed.", code: 4 }, MISSING_OR_INVALID: { message: "Missing or invalid.", code: 5 }, EXPIRED: { message: "Expired.", code: 6 }, UNKNOWN_TYPE: { message: "Unknown type.", code: 7 }, MISMATCHED_TOPIC: { message: "Mismatched topic.", code: 8 }, NON_CONFORMING_NAMESPACES: { message: "Non conforming namespaces.", code: 9 } };
function N4(e2, n4) {
  const { message: t, code: r2 } = nn2[e2];
  return { message: n4 ? `${t} ${n4}` : t, code: r2 };
}
function U5(e2, n4) {
  const { message: t, code: r2 } = en3[e2];
  return { message: n4 ? `${t} ${n4}` : t, code: r2 };
}
function k5(e2, n4) {
  return Array.isArray(e2) ? typeof n4 < "u" && e2.length ? e2.every(n4) : true : false;
}
function B2(e2) {
  return Object.getPrototypeOf(e2) === Object.prototype && Object.keys(e2).length;
}
function w5(e2) {
  return typeof e2 > "u";
}
function h6(e2, n4) {
  return n4 && w5(e2) ? true : typeof e2 == "string" && !!e2.trim().length;
}
function G2(e2, n4) {
  return n4 && w5(e2) ? true : typeof e2 == "number" && !isNaN(e2);
}
function Dt2(e2, n4) {
  const { requiredNamespaces: t } = n4, r2 = Object.keys(e2.namespaces), o3 = Object.keys(t);
  let s2 = true;
  return O3(o3, r2) ? (r2.forEach((i3) => {
    const { accounts: d3, methods: l4, events: c5 } = e2.namespaces[i3], u4 = A(d3), a3 = t[i3];
    (!O3(L2(i3, a3), u4) || !O3(a3.methods, l4) || !O3(a3.events, c5)) && (s2 = false);
  }), s2) : false;
}
function V2(e2) {
  return h6(e2, false) && e2.includes(":") ? e2.split(":").length === 2 : false;
}
function tn(e2) {
  if (h6(e2, false) && e2.includes(":")) {
    const n4 = e2.split(":");
    if (n4.length === 3) {
      const t = n4[0] + ":" + n4[1];
      return !!n4[2] && V2(t);
    }
  }
  return false;
}
function Kt2(e2, n4) {
  let t = null;
  return h6(e2 == null ? void 0 : e2.publicKey, false) || (t = N4("MISSING_OR_INVALID", `${n4} controller public key should be a string`)), t;
}
function ie(e2) {
  let n4 = true;
  return k5(e2) ? e2.length && (n4 = e2.every((t) => h6(t, false))) : n4 = false, n4;
}
function rn(e2, n4, t) {
  let r2 = null;
  return k5(n4) && n4.length ? n4.forEach((o3) => {
    r2 || V2(o3) || (r2 = U5("UNSUPPORTED_CHAINS", `${t}, chain ${o3} should be a string and conform to "namespace:chainId" format`));
  }) : V2(e2) || (r2 = U5("UNSUPPORTED_CHAINS", `${t}, chains must be defined as "namespace:chainId" e.g. "eip155:1": {...} in the namespace key OR as an array of CAIP-2 chainIds e.g. eip155: { chains: ["eip155:1", "eip155:5"] }`)), r2;
}
function on(e2, n4, t) {
  let r2 = null;
  return Object.entries(e2).forEach(([o3, s2]) => {
    if (r2) return;
    const i3 = rn(o3, L2(o3, s2), `${n4} ${t}`);
    i3 && (r2 = i3);
  }), r2;
}
function sn(e2, n4) {
  let t = null;
  return k5(e2) ? e2.forEach((r2) => {
    t || tn(r2) || (t = U5("UNSUPPORTED_ACCOUNTS", `${n4}, account ${r2} should be a string and conform to "namespace:chainId:address" format`));
  }) : t = U5("UNSUPPORTED_ACCOUNTS", `${n4}, accounts should be an array of strings conforming to "namespace:chainId:address" format`), t;
}
function cn(e2, n4) {
  let t = null;
  return Object.values(e2).forEach((r2) => {
    if (t) return;
    const o3 = sn(r2 == null ? void 0 : r2.accounts, `${n4} namespace`);
    o3 && (t = o3);
  }), t;
}
function an(e2, n4) {
  let t = null;
  return ie(e2 == null ? void 0 : e2.methods) ? ie(e2 == null ? void 0 : e2.events) || (t = U5("UNSUPPORTED_EVENTS", `${n4}, events should be an array of strings or empty array for no events`)) : t = U5("UNSUPPORTED_METHODS", `${n4}, methods should be an array of strings or empty array for no methods`), t;
}
function ce2(e2, n4) {
  let t = null;
  return Object.values(e2).forEach((r2) => {
    if (t) return;
    const o3 = an(r2, `${n4}, namespace`);
    o3 && (t = o3);
  }), t;
}
function Lt2(e2, n4, t) {
  let r2 = null;
  if (e2 && B2(e2)) {
    const o3 = ce2(e2, n4);
    o3 && (r2 = o3);
    const s2 = on(e2, n4, t);
    s2 && (r2 = s2);
  } else r2 = N4("MISSING_OR_INVALID", `${n4}, ${t} should be an object with data`);
  return r2;
}
function un(e2, n4) {
  let t = null;
  if (e2 && B2(e2)) {
    const r2 = ce2(e2, n4);
    r2 && (t = r2);
    const o3 = cn(e2, n4);
    o3 && (t = o3);
  } else t = N4("MISSING_OR_INVALID", `${n4}, namespaces should be an object with data`);
  return t;
}
function ln(e2) {
  return h6(e2.protocol, true);
}
function xt2(e2, n4) {
  let t = false;
  return n4 && !e2 ? t = true : e2 && k5(e2) && e2.length && e2.forEach((r2) => {
    t = ln(r2);
  }), t;
}
function Ft2(e2) {
  return typeof e2 == "number";
}
function Ht2(e2) {
  return typeof e2 < "u" && typeof e2 !== null;
}
function qt2(e2) {
  return !(!e2 || typeof e2 != "object" || !e2.code || !G2(e2.code, false) || !e2.message || !h6(e2.message, false));
}
function Bt2(e2) {
  return !(w5(e2) || !h6(e2.method, false));
}
function Gt2(e2) {
  return !(w5(e2) || w5(e2.result) && w5(e2.error) || !G2(e2.id, false) || !h6(e2.jsonrpc, false));
}
function Wt(e2) {
  return !(w5(e2) || !h6(e2.name, false));
}
function zt2(e2, n4) {
  return !(!V2(n4) || !Je2(e2).includes(n4));
}
function Yt2(e2, n4, t) {
  return h6(t, false) ? Qe2(e2, n4).includes(t) : false;
}
function Jt2(e2, n4, t) {
  return h6(t, false) ? Ze2(e2, n4).includes(t) : false;
}
function dn(e2, n4, t) {
  let r2 = null;
  const o3 = Qt(e2), s2 = Zt(n4), i3 = Object.keys(o3), d3 = Object.keys(s2), l4 = fn(Object.keys(e2)), c5 = fn(Object.keys(n4)), u4 = l4.filter((a3) => !c5.includes(a3));
  return u4.length && (r2 = N4("NON_CONFORMING_NAMESPACES", `${t} namespaces keys don't satisfy requiredNamespaces.
      Required: ${u4.toString()}
      Received: ${Object.keys(n4).toString()}`)), O3(i3, d3) || (r2 = N4("NON_CONFORMING_NAMESPACES", `${t} namespaces chains don't satisfy required namespaces.
      Required: ${i3.toString()}
      Approved: ${d3.toString()}`)), Object.keys(n4).forEach((a3) => {
    if (!a3.includes(":") || r2) return;
    const b6 = A(n4[a3].accounts);
    b6.includes(a3) || (r2 = N4("NON_CONFORMING_NAMESPACES", `${t} namespaces accounts don't satisfy namespace accounts for ${a3}
        Required: ${a3}
        Approved: ${b6.toString()}`));
  }), i3.forEach((a3) => {
    r2 || (O3(o3[a3].methods, s2[a3].methods) ? O3(o3[a3].events, s2[a3].events) || (r2 = N4("NON_CONFORMING_NAMESPACES", `${t} namespaces events don't satisfy namespace events for ${a3}`)) : r2 = N4("NON_CONFORMING_NAMESPACES", `${t} namespaces methods don't satisfy namespace methods for ${a3}`));
  }), r2;
}
function Qt(e2) {
  const n4 = {};
  return Object.keys(e2).forEach((t) => {
    var r2;
    t.includes(":") ? n4[t] = e2[t] : (r2 = e2[t].chains) == null || r2.forEach((o3) => {
      n4[o3] = { methods: e2[t].methods, events: e2[t].events };
    });
  }), n4;
}
function fn(e2) {
  return [...new Set(e2.map((n4) => n4.includes(":") ? n4.split(":")[0] : n4))];
}
function Zt(e2) {
  const n4 = {};
  return Object.keys(e2).forEach((t) => {
    if (t.includes(":")) n4[t] = e2[t];
    else {
      const r2 = A(e2[t].accounts);
      r2 == null ? void 0 : r2.forEach((o3) => {
        n4[o3] = { accounts: e2[t].accounts.filter((s2) => s2.includes(`${o3}:`)), methods: e2[t].methods, events: e2[t].events };
      });
    }
  }), n4;
}
function Xt(e2, n4) {
  return G2(e2, false) && e2 <= n4.max && e2 >= n4.min;
}
var ae = {};
var tr2 = class {
  static get(n4) {
    return ae[n4];
  }
  static set(n4, t) {
    ae[n4] = t;
  }
  static delete(n4) {
    delete ae[n4];
  }
};

// node_modules/@walletconnect/sign-client/dist/index.es.js
var import_events6 = __toESM(require_events());
var import_time6 = __toESM(require_cjs());
var X3 = "wc";
var F3 = 2;
var H3 = "client";
var G3 = `${X3}@${F3}:${H3}:`;
var M4 = { name: H3, logger: "error", controller: false, relayUrl: "wss://relay.walletconnect.com" };
var W5 = "WALLETCONNECT_DEEPLINK_CHOICE";
var ne = "proposal";
var oe = "Proposal expired";
var ae2 = "session";
var A2 = import_time6.SEVEN_DAYS;
var ce3 = "engine";
var V3 = { wc_sessionPropose: { req: { ttl: import_time6.FIVE_MINUTES, prompt: true, tag: 1100 }, res: { ttl: import_time6.FIVE_MINUTES, prompt: false, tag: 1101 } }, wc_sessionSettle: { req: { ttl: import_time6.FIVE_MINUTES, prompt: false, tag: 1102 }, res: { ttl: import_time6.FIVE_MINUTES, prompt: false, tag: 1103 } }, wc_sessionUpdate: { req: { ttl: import_time6.ONE_DAY, prompt: false, tag: 1104 }, res: { ttl: import_time6.ONE_DAY, prompt: false, tag: 1105 } }, wc_sessionExtend: { req: { ttl: import_time6.ONE_DAY, prompt: false, tag: 1106 }, res: { ttl: import_time6.ONE_DAY, prompt: false, tag: 1107 } }, wc_sessionRequest: { req: { ttl: import_time6.FIVE_MINUTES, prompt: true, tag: 1108 }, res: { ttl: import_time6.FIVE_MINUTES, prompt: false, tag: 1109 } }, wc_sessionEvent: { req: { ttl: import_time6.FIVE_MINUTES, prompt: true, tag: 1110 }, res: { ttl: import_time6.FIVE_MINUTES, prompt: false, tag: 1111 } }, wc_sessionDelete: { req: { ttl: import_time6.ONE_DAY, prompt: false, tag: 1112 }, res: { ttl: import_time6.ONE_DAY, prompt: false, tag: 1113 } }, wc_sessionPing: { req: { ttl: import_time6.THIRTY_SECONDS, prompt: false, tag: 1114 }, res: { ttl: import_time6.THIRTY_SECONDS, prompt: false, tag: 1115 } } };
var U6 = { min: import_time6.FIVE_MINUTES, max: import_time6.SEVEN_DAYS };
var I = { idle: "IDLE", active: "ACTIVE" };
var le5 = "request";
var pe2 = ["wc_sessionPropose", "wc_sessionRequest", "wc_authRequest"];
var os2 = Object.defineProperty;
var as2 = Object.defineProperties;
var cs2 = Object.getOwnPropertyDescriptors;
var he5 = Object.getOwnPropertySymbols;
var ls2 = Object.prototype.hasOwnProperty;
var ps2 = Object.prototype.propertyIsEnumerable;
var de5 = (m5, r2, e2) => r2 in m5 ? os2(m5, r2, { enumerable: true, configurable: true, writable: true, value: e2 }) : m5[r2] = e2;
var g4 = (m5, r2) => {
  for (var e2 in r2 || (r2 = {})) ls2.call(r2, e2) && de5(m5, e2, r2[e2]);
  if (he5) for (var e2 of he5(r2)) ps2.call(r2, e2) && de5(m5, e2, r2[e2]);
  return m5;
};
var b4 = (m5, r2) => as2(m5, cs2(r2));
var hs2 = class extends S2 {
  constructor(r2) {
    super(r2), this.name = ce3, this.events = new import_events6.default(), this.initialized = false, this.ignoredPayloadTypes = [_4], this.requestQueue = { state: I.idle, queue: [] }, this.sessionRequestQueue = { state: I.idle, queue: [] }, this.requestQueueDelay = import_time6.ONE_SECOND, this.init = async () => {
      this.initialized || (await this.cleanup(), this.registerRelayerEvents(), this.registerExpirerEvents(), this.registerPairingEvents(), this.client.core.pairing.register({ methods: Object.keys(V3) }), this.initialized = true, setTimeout(() => {
        this.sessionRequestQueue.queue = this.getPendingSessionRequests(), this.processSessionRequestQueue();
      }, (0, import_time6.toMiliseconds)(this.requestQueueDelay)));
    }, this.connect = async (e2) => {
      await this.isInitialized();
      const s2 = b4(g4({}, e2), { requiredNamespaces: e2.requiredNamespaces || {}, optionalNamespaces: e2.optionalNamespaces || {} });
      await this.isValidConnect(s2);
      const { pairingTopic: t, requiredNamespaces: i3, optionalNamespaces: n4, sessionProperties: o3, relays: a3 } = s2;
      let c5 = t, p7, d3 = false;
      if (c5 && (d3 = this.client.core.pairing.pairings.get(c5).active), !c5 || !d3) {
        const { topic: v5, uri: S6 } = await this.client.core.pairing.create();
        c5 = v5, p7 = S6;
      }
      const h7 = await this.client.core.crypto.generateKeyPair(), R2 = g4({ requiredNamespaces: i3, optionalNamespaces: n4, relays: a3 ?? [{ protocol: ht }], proposer: { publicKey: h7, metadata: this.client.metadata } }, o3 && { sessionProperties: o3 }), { reject: w7, resolve: T5, done: K3 } = at3(import_time6.FIVE_MINUTES, oe);
      if (this.events.once(yt3("session_connect"), async ({ error: v5, session: S6 }) => {
        if (v5) w7(v5);
        else if (S6) {
          S6.self.publicKey = h7;
          const B4 = b4(g4({}, S6), { requiredNamespaces: S6.requiredNamespaces, optionalNamespaces: S6.optionalNamespaces });
          await this.client.session.set(S6.topic, B4), await this.setExpiry(S6.topic, S6.expiry), c5 && await this.client.core.pairing.updateMetadata({ topic: c5, metadata: S6.peer.metadata }), T5(B4);
        }
      }), !c5) {
        const { message: v5 } = N4("NO_MATCHING_KEY", `connect() pairing topic: ${c5}`);
        throw new Error(v5);
      }
      const L5 = await this.sendRequest({ topic: c5, method: "wc_sessionPropose", params: R2 }), ue6 = pt3(import_time6.FIVE_MINUTES);
      return await this.setProposal(L5, g4({ id: L5, expiry: ue6 }, R2)), { uri: p7, approval: K3 };
    }, this.pair = async (e2) => (await this.isInitialized(), await this.client.core.pairing.pair(e2)), this.approve = async (e2) => {
      await this.isInitialized(), await this.isValidApprove(e2);
      const { id: s2, relayProtocol: t, namespaces: i3, sessionProperties: n4 } = e2, o3 = this.client.proposal.get(s2);
      let { pairingTopic: a3, proposer: c5, requiredNamespaces: p7, optionalNamespaces: d3 } = o3;
      a3 = a3 || "", B2(p7) || (p7 = jt2(i3, "approve()"));
      const h7 = await this.client.core.crypto.generateKeyPair(), R2 = c5.publicKey, w7 = await this.client.core.crypto.generateSharedKey(h7, R2);
      a3 && s2 && (await this.client.core.pairing.updateMetadata({ topic: a3, metadata: c5.metadata }), await this.sendResult({ id: s2, topic: a3, result: { relay: { protocol: t ?? "irn" }, responderPublicKey: h7 } }), await this.client.proposal.delete(s2, U5("USER_DISCONNECTED")), await this.client.core.pairing.activate({ topic: a3 }));
      const T5 = g4({ relay: { protocol: t ?? "irn" }, namespaces: i3, requiredNamespaces: p7, optionalNamespaces: d3, pairingTopic: a3, controller: { publicKey: h7, metadata: this.client.metadata }, expiry: pt3(A2) }, n4 && { sessionProperties: n4 });
      await this.client.core.relayer.subscribe(w7), await this.sendRequest({ topic: w7, method: "wc_sessionSettle", params: T5, throwOnFailedPublish: true });
      const K3 = b4(g4({}, T5), { topic: w7, pairingTopic: a3, acknowledged: false, self: T5.controller, peer: { publicKey: c5.publicKey, metadata: c5.metadata }, controller: h7 });
      return await this.client.session.set(w7, K3), await this.setExpiry(w7, pt3(A2)), { topic: w7, acknowledged: () => new Promise((L5) => setTimeout(() => L5(this.client.session.get(w7)), 500)) };
    }, this.reject = async (e2) => {
      await this.isInitialized(), await this.isValidReject(e2);
      const { id: s2, reason: t } = e2, { pairingTopic: i3 } = this.client.proposal.get(s2);
      i3 && (await this.sendError(s2, i3, t), await this.client.proposal.delete(s2, U5("USER_DISCONNECTED")));
    }, this.update = async (e2) => {
      await this.isInitialized(), await this.isValidUpdate(e2);
      const { topic: s2, namespaces: t } = e2, i3 = await this.sendRequest({ topic: s2, method: "wc_sessionUpdate", params: { namespaces: t } }), { done: n4, resolve: o3, reject: a3 } = at3();
      return this.events.once(yt3("session_update", i3), ({ error: c5 }) => {
        c5 ? a3(c5) : o3();
      }), await this.client.session.update(s2, { namespaces: t }), { acknowledged: n4 };
    }, this.extend = async (e2) => {
      await this.isInitialized(), await this.isValidExtend(e2);
      const { topic: s2 } = e2, t = await this.sendRequest({ topic: s2, method: "wc_sessionExtend", params: {} }), { done: i3, resolve: n4, reject: o3 } = at3();
      return this.events.once(yt3("session_extend", t), ({ error: a3 }) => {
        a3 ? o3(a3) : n4();
      }), await this.setExpiry(s2, pt3(A2)), { acknowledged: i3 };
    }, this.request = async (e2) => {
      await this.isInitialized(), await this.isValidRequest(e2);
      const { chainId: s2, request: t, topic: i3, expiry: n4 } = e2, o3 = payloadId(), { done: a3, resolve: c5, reject: p7 } = at3(n4, "Request expired. Please try again.");
      return this.events.once(yt3("session_request", o3), ({ error: d3, result: h7 }) => {
        d3 ? p7(d3) : c5(h7);
      }), await Promise.all([new Promise(async (d3) => {
        await this.sendRequest({ clientRpcId: o3, topic: i3, method: "wc_sessionRequest", params: { request: t, chainId: s2 }, expiry: n4, throwOnFailedPublish: true }).catch((h7) => p7(h7)), this.client.events.emit("session_request_sent", { topic: i3, request: t, chainId: s2, id: o3 }), d3();
      }), new Promise(async (d3) => {
        const h7 = await gt2(this.client.core.storage, W5);
        ht2({ id: o3, topic: i3, wcDeepLink: h7 }), d3();
      }), a3()]).then((d3) => d3[2]);
    }, this.respond = async (e2) => {
      await this.isInitialized(), await this.isValidRespond(e2);
      const { topic: s2, response: t } = e2, { id: i3 } = t;
      isJsonRpcResult(t) ? await this.sendResult({ id: i3, topic: s2, result: t.result, throwOnFailedPublish: true }) : isJsonRpcError(t) && await this.sendError(i3, s2, t.error), this.cleanupAfterResponse(e2);
    }, this.ping = async (e2) => {
      await this.isInitialized(), await this.isValidPing(e2);
      const { topic: s2 } = e2;
      if (this.client.session.keys.includes(s2)) {
        const t = await this.sendRequest({ topic: s2, method: "wc_sessionPing", params: {} }), { done: i3, resolve: n4, reject: o3 } = at3();
        this.events.once(yt3("session_ping", t), ({ error: a3 }) => {
          a3 ? o3(a3) : n4();
        }), await i3();
      } else this.client.core.pairing.pairings.keys.includes(s2) && await this.client.core.pairing.ping({ topic: s2 });
    }, this.emit = async (e2) => {
      await this.isInitialized(), await this.isValidEmit(e2);
      const { topic: s2, event: t, chainId: i3 } = e2;
      await this.sendRequest({ topic: s2, method: "wc_sessionEvent", params: { event: t, chainId: i3 } });
    }, this.disconnect = async (e2) => {
      await this.isInitialized(), await this.isValidDisconnect(e2);
      const { topic: s2 } = e2;
      this.client.session.keys.includes(s2) ? (await this.sendRequest({ topic: s2, method: "wc_sessionDelete", params: U5("USER_DISCONNECTED"), throwOnFailedPublish: true }), await this.deleteSession(s2)) : await this.client.core.pairing.disconnect({ topic: s2 });
    }, this.find = (e2) => (this.isInitialized(), this.client.session.getAll().filter((s2) => Dt2(s2, e2))), this.getPendingSessionRequests = () => (this.isInitialized(), this.client.pendingRequest.getAll()), this.cleanupDuplicatePairings = async (e2) => {
      if (e2.pairingTopic) try {
        const s2 = this.client.core.pairing.pairings.get(e2.pairingTopic), t = this.client.core.pairing.pairings.getAll().filter((i3) => {
          var n4, o3;
          return ((n4 = i3.peerMetadata) == null ? void 0 : n4.url) && ((o3 = i3.peerMetadata) == null ? void 0 : o3.url) === e2.peer.metadata.url && i3.topic && i3.topic !== s2.topic;
        });
        if (t.length === 0) return;
        this.client.logger.info(`Cleaning up ${t.length} duplicate pairing(s)`), await Promise.all(t.map((i3) => this.client.core.pairing.disconnect({ topic: i3.topic }))), this.client.logger.info("Duplicate pairings clean up finished");
      } catch (s2) {
        this.client.logger.error(s2);
      }
    }, this.deleteSession = async (e2, s2) => {
      const { self: t } = this.client.session.get(e2);
      await this.client.core.relayer.unsubscribe(e2), this.client.session.delete(e2, U5("USER_DISCONNECTED")), this.client.core.crypto.keychain.has(t.publicKey) && await this.client.core.crypto.deleteKeyPair(t.publicKey), this.client.core.crypto.keychain.has(e2) && await this.client.core.crypto.deleteSymKey(e2), s2 || this.client.core.expirer.del(e2), this.client.core.storage.removeItem(W5).catch((i3) => this.client.logger.warn(i3));
    }, this.deleteProposal = async (e2, s2) => {
      await Promise.all([this.client.proposal.delete(e2, U5("USER_DISCONNECTED")), s2 ? Promise.resolve() : this.client.core.expirer.del(e2)]);
    }, this.deletePendingSessionRequest = async (e2, s2, t = false) => {
      await Promise.all([this.client.pendingRequest.delete(e2, s2), t ? Promise.resolve() : this.client.core.expirer.del(e2)]), this.sessionRequestQueue.queue = this.sessionRequestQueue.queue.filter((i3) => i3.id !== e2), t && (this.sessionRequestQueue.state = I.idle);
    }, this.setExpiry = async (e2, s2) => {
      this.client.session.keys.includes(e2) && await this.client.session.update(e2, { expiry: s2 }), this.client.core.expirer.set(e2, s2);
    }, this.setProposal = async (e2, s2) => {
      await this.client.proposal.set(e2, s2), this.client.core.expirer.set(e2, s2.expiry);
    }, this.setPendingSessionRequest = async (e2) => {
      const s2 = V3.wc_sessionRequest.req.ttl, { id: t, topic: i3, params: n4, verifyContext: o3 } = e2;
      await this.client.pendingRequest.set(t, { id: t, topic: i3, params: n4, verifyContext: o3 }), s2 && this.client.core.expirer.set(t, pt3(s2));
    }, this.sendRequest = async (e2) => {
      const { topic: s2, method: t, params: i3, expiry: n4, relayRpcId: o3, clientRpcId: a3, throwOnFailedPublish: c5 } = e2, p7 = formatJsonRpcRequest(t, i3, a3);
      if (D4() && pe2.includes(t)) {
        const R2 = Ln2(JSON.stringify(p7));
        this.client.core.verify.register({ attestationId: R2 });
      }
      const d3 = await this.client.core.crypto.encode(s2, p7), h7 = V3[t].req;
      return n4 && (h7.ttl = n4), o3 && (h7.id = o3), this.client.core.history.set(s2, p7), c5 ? (h7.internal = b4(g4({}, h7.internal), { throwOnFailedPublish: true }), await this.client.core.relayer.publish(s2, d3, h7)) : this.client.core.relayer.publish(s2, d3, h7).catch((R2) => this.client.logger.error(R2)), p7.id;
    }, this.sendResult = async (e2) => {
      const { id: s2, topic: t, result: i3, throwOnFailedPublish: n4 } = e2, o3 = formatJsonRpcResult(s2, i3), a3 = await this.client.core.crypto.encode(t, o3), c5 = await this.client.core.history.get(t, s2), p7 = V3[c5.request.method].res;
      n4 ? (p7.internal = b4(g4({}, p7.internal), { throwOnFailedPublish: true }), await this.client.core.relayer.publish(t, a3, p7)) : this.client.core.relayer.publish(t, a3, p7).catch((d3) => this.client.logger.error(d3)), await this.client.core.history.resolve(o3);
    }, this.sendError = async (e2, s2, t) => {
      const i3 = formatJsonRpcError(e2, t), n4 = await this.client.core.crypto.encode(s2, i3), o3 = await this.client.core.history.get(s2, e2), a3 = V3[o3.request.method].res;
      this.client.core.relayer.publish(s2, n4, a3), await this.client.core.history.resolve(i3);
    }, this.cleanup = async () => {
      const e2 = [], s2 = [];
      this.client.session.getAll().forEach((t) => {
        mt3(t.expiry) && e2.push(t.topic);
      }), this.client.proposal.getAll().forEach((t) => {
        mt3(t.expiry) && s2.push(t.id);
      }), await Promise.all([...e2.map((t) => this.deleteSession(t)), ...s2.map((t) => this.deleteProposal(t))]);
    }, this.onRelayEventRequest = async (e2) => {
      this.requestQueue.queue.push(e2), await this.processRequestsQueue();
    }, this.processRequestsQueue = async () => {
      if (this.requestQueue.state === I.active) {
        this.client.logger.info("Request queue already active, skipping...");
        return;
      }
      for (this.client.logger.info(`Request queue starting with ${this.requestQueue.queue.length} requests`); this.requestQueue.queue.length > 0; ) {
        this.requestQueue.state = I.active;
        const e2 = this.requestQueue.queue.shift();
        if (e2) try {
          this.processRequest(e2), await new Promise((s2) => setTimeout(s2, 300));
        } catch (s2) {
          this.client.logger.warn(s2);
        }
      }
      this.requestQueue.state = I.idle;
    }, this.processRequest = (e2) => {
      const { topic: s2, payload: t } = e2, i3 = t.method;
      switch (i3) {
        case "wc_sessionPropose":
          return this.onSessionProposeRequest(s2, t);
        case "wc_sessionSettle":
          return this.onSessionSettleRequest(s2, t);
        case "wc_sessionUpdate":
          return this.onSessionUpdateRequest(s2, t);
        case "wc_sessionExtend":
          return this.onSessionExtendRequest(s2, t);
        case "wc_sessionPing":
          return this.onSessionPingRequest(s2, t);
        case "wc_sessionDelete":
          return this.onSessionDeleteRequest(s2, t);
        case "wc_sessionRequest":
          return this.onSessionRequest(s2, t);
        case "wc_sessionEvent":
          return this.onSessionEventRequest(s2, t);
        default:
          return this.client.logger.info(`Unsupported request method ${i3}`);
      }
    }, this.onRelayEventResponse = async (e2) => {
      const { topic: s2, payload: t } = e2, i3 = (await this.client.core.history.get(s2, t.id)).request.method;
      switch (i3) {
        case "wc_sessionPropose":
          return this.onSessionProposeResponse(s2, t);
        case "wc_sessionSettle":
          return this.onSessionSettleResponse(s2, t);
        case "wc_sessionUpdate":
          return this.onSessionUpdateResponse(s2, t);
        case "wc_sessionExtend":
          return this.onSessionExtendResponse(s2, t);
        case "wc_sessionPing":
          return this.onSessionPingResponse(s2, t);
        case "wc_sessionRequest":
          return this.onSessionRequestResponse(s2, t);
        default:
          return this.client.logger.info(`Unsupported response method ${i3}`);
      }
    }, this.onRelayEventUnknownPayload = (e2) => {
      const { topic: s2 } = e2, { message: t } = N4("MISSING_OR_INVALID", `Decoded payload on topic ${s2} is not identifiable as a JSON-RPC request or a response.`);
      throw new Error(t);
    }, this.onSessionProposeRequest = async (e2, s2) => {
      const { params: t, id: i3 } = s2;
      try {
        this.isValidConnect(g4({}, s2.params));
        const n4 = pt3(import_time6.FIVE_MINUTES), o3 = g4({ id: i3, pairingTopic: e2, expiry: n4 }, t);
        await this.setProposal(i3, o3);
        const a3 = Ln2(JSON.stringify(s2)), c5 = await this.getVerifyContext(a3, o3.proposer.metadata);
        this.client.events.emit("session_proposal", { id: i3, params: o3, verifyContext: c5 });
      } catch (n4) {
        await this.sendError(i3, e2, n4), this.client.logger.error(n4);
      }
    }, this.onSessionProposeResponse = async (e2, s2) => {
      const { id: t } = s2;
      if (isJsonRpcResult(s2)) {
        const { result: i3 } = s2;
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", result: i3 });
        const n4 = this.client.proposal.get(t);
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", proposal: n4 });
        const o3 = n4.proposer.publicKey;
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", selfPublicKey: o3 });
        const a3 = i3.responderPublicKey;
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", peerPublicKey: a3 });
        const c5 = await this.client.core.crypto.generateSharedKey(o3, a3);
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", sessionTopic: c5 });
        const p7 = await this.client.core.relayer.subscribe(c5);
        this.client.logger.trace({ type: "method", method: "onSessionProposeResponse", subscriptionId: p7 }), await this.client.core.pairing.activate({ topic: e2 });
      } else isJsonRpcError(s2) && (await this.client.proposal.delete(t, U5("USER_DISCONNECTED")), this.events.emit(yt3("session_connect"), { error: s2.error }));
    }, this.onSessionSettleRequest = async (e2, s2) => {
      const { id: t, params: i3 } = s2;
      try {
        this.isValidSessionSettleRequest(i3);
        const { relay: n4, controller: o3, expiry: a3, namespaces: c5, requiredNamespaces: p7, optionalNamespaces: d3, sessionProperties: h7, pairingTopic: R2 } = s2.params, w7 = g4({ topic: e2, relay: n4, expiry: a3, namespaces: c5, acknowledged: true, pairingTopic: R2, requiredNamespaces: p7, optionalNamespaces: d3, controller: o3.publicKey, self: { publicKey: "", metadata: this.client.metadata }, peer: { publicKey: o3.publicKey, metadata: o3.metadata } }, h7 && { sessionProperties: h7 });
        await this.sendResult({ id: s2.id, topic: e2, result: true }), this.events.emit(yt3("session_connect"), { session: w7 }), this.cleanupDuplicatePairings(w7);
      } catch (n4) {
        await this.sendError(t, e2, n4), this.client.logger.error(n4);
      }
    }, this.onSessionSettleResponse = async (e2, s2) => {
      const { id: t } = s2;
      isJsonRpcResult(s2) ? (await this.client.session.update(e2, { acknowledged: true }), this.events.emit(yt3("session_approve", t), {})) : isJsonRpcError(s2) && (await this.client.session.delete(e2, U5("USER_DISCONNECTED")), this.events.emit(yt3("session_approve", t), { error: s2.error }));
    }, this.onSessionUpdateRequest = async (e2, s2) => {
      const { params: t, id: i3 } = s2;
      try {
        const n4 = `${e2}_session_update`, o3 = tr2.get(n4);
        if (o3 && this.isRequestOutOfSync(o3, i3)) {
          this.client.logger.info(`Discarding out of sync request - ${i3}`);
          return;
        }
        this.isValidUpdate(g4({ topic: e2 }, t)), await this.client.session.update(e2, { namespaces: t.namespaces }), await this.sendResult({ id: i3, topic: e2, result: true }), this.client.events.emit("session_update", { id: i3, topic: e2, params: t }), tr2.set(n4, i3);
      } catch (n4) {
        await this.sendError(i3, e2, n4), this.client.logger.error(n4);
      }
    }, this.isRequestOutOfSync = (e2, s2) => parseInt(s2.toString().slice(0, -3)) <= parseInt(e2.toString().slice(0, -3)), this.onSessionUpdateResponse = (e2, s2) => {
      const { id: t } = s2;
      isJsonRpcResult(s2) ? this.events.emit(yt3("session_update", t), {}) : isJsonRpcError(s2) && this.events.emit(yt3("session_update", t), { error: s2.error });
    }, this.onSessionExtendRequest = async (e2, s2) => {
      const { id: t } = s2;
      try {
        this.isValidExtend({ topic: e2 }), await this.setExpiry(e2, pt3(A2)), await this.sendResult({ id: t, topic: e2, result: true }), this.client.events.emit("session_extend", { id: t, topic: e2 });
      } catch (i3) {
        await this.sendError(t, e2, i3), this.client.logger.error(i3);
      }
    }, this.onSessionExtendResponse = (e2, s2) => {
      const { id: t } = s2;
      isJsonRpcResult(s2) ? this.events.emit(yt3("session_extend", t), {}) : isJsonRpcError(s2) && this.events.emit(yt3("session_extend", t), { error: s2.error });
    }, this.onSessionPingRequest = async (e2, s2) => {
      const { id: t } = s2;
      try {
        this.isValidPing({ topic: e2 }), await this.sendResult({ id: t, topic: e2, result: true }), this.client.events.emit("session_ping", { id: t, topic: e2 });
      } catch (i3) {
        await this.sendError(t, e2, i3), this.client.logger.error(i3);
      }
    }, this.onSessionPingResponse = (e2, s2) => {
      const { id: t } = s2;
      setTimeout(() => {
        isJsonRpcResult(s2) ? this.events.emit(yt3("session_ping", t), {}) : isJsonRpcError(s2) && this.events.emit(yt3("session_ping", t), { error: s2.error });
      }, 500);
    }, this.onSessionDeleteRequest = async (e2, s2) => {
      const { id: t } = s2;
      try {
        this.isValidDisconnect({ topic: e2, reason: s2.params }), await Promise.all([new Promise((i3) => {
          this.client.core.relayer.once(D3.publish, async () => {
            i3(await this.deleteSession(e2));
          });
        }), this.sendResult({ id: t, topic: e2, result: true })]), this.client.events.emit("session_delete", { id: t, topic: e2 });
      } catch (i3) {
        this.client.logger.error(i3);
      }
    }, this.onSessionRequest = async (e2, s2) => {
      const { id: t, params: i3 } = s2;
      try {
        this.isValidRequest(g4({ topic: e2 }, i3));
        const n4 = Ln2(JSON.stringify(formatJsonRpcRequest("wc_sessionRequest", i3, t))), o3 = this.client.session.get(e2), a3 = await this.getVerifyContext(n4, o3.peer.metadata), c5 = { id: t, topic: e2, params: i3, verifyContext: a3 };
        await this.setPendingSessionRequest(c5), this.addSessionRequestToSessionRequestQueue(c5), this.processSessionRequestQueue();
      } catch (n4) {
        await this.sendError(t, e2, n4), this.client.logger.error(n4);
      }
    }, this.onSessionRequestResponse = (e2, s2) => {
      const { id: t } = s2;
      isJsonRpcResult(s2) ? this.events.emit(yt3("session_request", t), { result: s2.result }) : isJsonRpcError(s2) && this.events.emit(yt3("session_request", t), { error: s2.error });
    }, this.onSessionEventRequest = async (e2, s2) => {
      const { id: t, params: i3 } = s2;
      try {
        const n4 = `${e2}_session_event_${i3.event.name}`, o3 = tr2.get(n4);
        if (o3 && this.isRequestOutOfSync(o3, t)) {
          this.client.logger.info(`Discarding out of sync request - ${t}`);
          return;
        }
        this.isValidEmit(g4({ topic: e2 }, i3)), this.client.events.emit("session_event", { id: t, topic: e2, params: i3 }), tr2.set(n4, t);
      } catch (n4) {
        await this.sendError(t, e2, n4), this.client.logger.error(n4);
      }
    }, this.addSessionRequestToSessionRequestQueue = (e2) => {
      this.sessionRequestQueue.queue.push(e2);
    }, this.cleanupAfterResponse = (e2) => {
      this.deletePendingSessionRequest(e2.response.id, { message: "fulfilled", code: 0 }), setTimeout(() => {
        this.sessionRequestQueue.state = I.idle, this.processSessionRequestQueue();
      }, (0, import_time6.toMiliseconds)(this.requestQueueDelay));
    }, this.processSessionRequestQueue = () => {
      if (this.sessionRequestQueue.state === I.active) {
        this.client.logger.info("session request queue is already active.");
        return;
      }
      const e2 = this.sessionRequestQueue.queue[0];
      if (!e2) {
        this.client.logger.info("session request queue is empty.");
        return;
      }
      try {
        this.sessionRequestQueue.state = I.active, this.client.events.emit("session_request", e2);
      } catch (s2) {
        this.client.logger.error(s2);
      }
    }, this.onPairingCreated = (e2) => {
      if (e2.active) return;
      const s2 = this.client.proposal.getAll().find((t) => t.pairingTopic === e2.topic);
      s2 && this.onSessionProposeRequest(e2.topic, formatJsonRpcRequest("wc_sessionPropose", { requiredNamespaces: s2.requiredNamespaces, optionalNamespaces: s2.optionalNamespaces, relays: s2.relays, proposer: s2.proposer, sessionProperties: s2.sessionProperties }, s2.id));
    }, this.isValidConnect = async (e2) => {
      if (!Ht2(e2)) {
        const { message: a3 } = N4("MISSING_OR_INVALID", `connect() params: ${JSON.stringify(e2)}`);
        throw new Error(a3);
      }
      const { pairingTopic: s2, requiredNamespaces: t, optionalNamespaces: i3, sessionProperties: n4, relays: o3 } = e2;
      if (w5(s2) || await this.isValidPairingTopic(s2), !xt2(o3, true)) {
        const { message: a3 } = N4("MISSING_OR_INVALID", `connect() relays: ${o3}`);
        throw new Error(a3);
      }
      !w5(t) && B2(t) !== 0 && this.validateNamespaces(t, "requiredNamespaces"), !w5(i3) && B2(i3) !== 0 && this.validateNamespaces(i3, "optionalNamespaces"), w5(n4) || this.validateSessionProps(n4, "sessionProperties");
    }, this.validateNamespaces = (e2, s2) => {
      const t = Lt2(e2, "connect()", s2);
      if (t) throw new Error(t.message);
    }, this.isValidApprove = async (e2) => {
      if (!Ht2(e2)) throw new Error(N4("MISSING_OR_INVALID", `approve() params: ${e2}`).message);
      const { id: s2, namespaces: t, relayProtocol: i3, sessionProperties: n4 } = e2;
      await this.isValidProposalId(s2);
      const o3 = this.client.proposal.get(s2), a3 = un(t, "approve()");
      if (a3) throw new Error(a3.message);
      const c5 = dn(o3.requiredNamespaces, t, "approve()");
      if (c5) throw new Error(c5.message);
      if (!h6(i3, true)) {
        const { message: p7 } = N4("MISSING_OR_INVALID", `approve() relayProtocol: ${i3}`);
        throw new Error(p7);
      }
      w5(n4) || this.validateSessionProps(n4, "sessionProperties");
    }, this.isValidReject = async (e2) => {
      if (!Ht2(e2)) {
        const { message: i3 } = N4("MISSING_OR_INVALID", `reject() params: ${e2}`);
        throw new Error(i3);
      }
      const { id: s2, reason: t } = e2;
      if (await this.isValidProposalId(s2), !qt2(t)) {
        const { message: i3 } = N4("MISSING_OR_INVALID", `reject() reason: ${JSON.stringify(t)}`);
        throw new Error(i3);
      }
    }, this.isValidSessionSettleRequest = (e2) => {
      if (!Ht2(e2)) {
        const { message: c5 } = N4("MISSING_OR_INVALID", `onSessionSettleRequest() params: ${e2}`);
        throw new Error(c5);
      }
      const { relay: s2, controller: t, namespaces: i3, expiry: n4 } = e2;
      if (!ln(s2)) {
        const { message: c5 } = N4("MISSING_OR_INVALID", "onSessionSettleRequest() relay protocol should be a string");
        throw new Error(c5);
      }
      const o3 = Kt2(t, "onSessionSettleRequest()");
      if (o3) throw new Error(o3.message);
      const a3 = un(i3, "onSessionSettleRequest()");
      if (a3) throw new Error(a3.message);
      if (mt3(n4)) {
        const { message: c5 } = N4("EXPIRED", "onSessionSettleRequest()");
        throw new Error(c5);
      }
    }, this.isValidUpdate = async (e2) => {
      if (!Ht2(e2)) {
        const { message: a3 } = N4("MISSING_OR_INVALID", `update() params: ${e2}`);
        throw new Error(a3);
      }
      const { topic: s2, namespaces: t } = e2;
      await this.isValidSessionTopic(s2);
      const i3 = this.client.session.get(s2), n4 = un(t, "update()");
      if (n4) throw new Error(n4.message);
      const o3 = dn(i3.requiredNamespaces, t, "update()");
      if (o3) throw new Error(o3.message);
    }, this.isValidExtend = async (e2) => {
      if (!Ht2(e2)) {
        const { message: t } = N4("MISSING_OR_INVALID", `extend() params: ${e2}`);
        throw new Error(t);
      }
      const { topic: s2 } = e2;
      await this.isValidSessionTopic(s2);
    }, this.isValidRequest = async (e2) => {
      if (!Ht2(e2)) {
        const { message: a3 } = N4("MISSING_OR_INVALID", `request() params: ${e2}`);
        throw new Error(a3);
      }
      const { topic: s2, request: t, chainId: i3, expiry: n4 } = e2;
      await this.isValidSessionTopic(s2);
      const { namespaces: o3 } = this.client.session.get(s2);
      if (!zt2(o3, i3)) {
        const { message: a3 } = N4("MISSING_OR_INVALID", `request() chainId: ${i3}`);
        throw new Error(a3);
      }
      if (!Bt2(t)) {
        const { message: a3 } = N4("MISSING_OR_INVALID", `request() ${JSON.stringify(t)}`);
        throw new Error(a3);
      }
      if (!Yt2(o3, i3, t.method)) {
        const { message: a3 } = N4("MISSING_OR_INVALID", `request() method: ${t.method}`);
        throw new Error(a3);
      }
      if (n4 && !Xt(n4, U6)) {
        const { message: a3 } = N4("MISSING_OR_INVALID", `request() expiry: ${n4}. Expiry must be a number (in seconds) between ${U6.min} and ${U6.max}`);
        throw new Error(a3);
      }
    }, this.isValidRespond = async (e2) => {
      if (!Ht2(e2)) {
        const { message: i3 } = N4("MISSING_OR_INVALID", `respond() params: ${e2}`);
        throw new Error(i3);
      }
      const { topic: s2, response: t } = e2;
      if (await this.isValidSessionTopic(s2), !Gt2(t)) {
        const { message: i3 } = N4("MISSING_OR_INVALID", `respond() response: ${JSON.stringify(t)}`);
        throw new Error(i3);
      }
    }, this.isValidPing = async (e2) => {
      if (!Ht2(e2)) {
        const { message: t } = N4("MISSING_OR_INVALID", `ping() params: ${e2}`);
        throw new Error(t);
      }
      const { topic: s2 } = e2;
      await this.isValidSessionOrPairingTopic(s2);
    }, this.isValidEmit = async (e2) => {
      if (!Ht2(e2)) {
        const { message: o3 } = N4("MISSING_OR_INVALID", `emit() params: ${e2}`);
        throw new Error(o3);
      }
      const { topic: s2, event: t, chainId: i3 } = e2;
      await this.isValidSessionTopic(s2);
      const { namespaces: n4 } = this.client.session.get(s2);
      if (!zt2(n4, i3)) {
        const { message: o3 } = N4("MISSING_OR_INVALID", `emit() chainId: ${i3}`);
        throw new Error(o3);
      }
      if (!Wt(t)) {
        const { message: o3 } = N4("MISSING_OR_INVALID", `emit() event: ${JSON.stringify(t)}`);
        throw new Error(o3);
      }
      if (!Jt2(n4, i3, t.name)) {
        const { message: o3 } = N4("MISSING_OR_INVALID", `emit() event: ${JSON.stringify(t)}`);
        throw new Error(o3);
      }
    }, this.isValidDisconnect = async (e2) => {
      if (!Ht2(e2)) {
        const { message: t } = N4("MISSING_OR_INVALID", `disconnect() params: ${e2}`);
        throw new Error(t);
      }
      const { topic: s2 } = e2;
      await this.isValidSessionOrPairingTopic(s2);
    }, this.getVerifyContext = async (e2, s2) => {
      const t = { verified: { verifyUrl: s2.verifyUrl || $2, validation: "UNKNOWN", origin: s2.url || "" } };
      try {
        const i3 = await this.client.core.verify.resolve({ attestationId: e2, verifyUrl: s2.verifyUrl });
        i3 && (t.verified.origin = i3.origin, t.verified.isScam = i3.isScam, t.verified.validation = i3.origin === new URL(s2.url).origin ? "VALID" : "INVALID");
      } catch (i3) {
        this.client.logger.info(i3);
      }
      return this.client.logger.info(`Verify context: ${JSON.stringify(t)}`), t;
    }, this.validateSessionProps = (e2, s2) => {
      Object.values(e2).forEach((t) => {
        if (!h6(t, false)) {
          const { message: i3 } = N4("MISSING_OR_INVALID", `${s2} must be in Record<string, string> format. Received: ${JSON.stringify(t)}`);
          throw new Error(i3);
        }
      });
    };
  }
  async isInitialized() {
    if (!this.initialized) {
      const { message: r2 } = N4("NOT_INITIALIZED", this.name);
      throw new Error(r2);
    }
    await this.client.core.relayer.confirmOnlineStateOrThrow();
  }
  registerRelayerEvents() {
    this.client.core.relayer.on(D3.message, async (r2) => {
      const { topic: e2, message: s2 } = r2;
      if (this.ignoredPayloadTypes.includes(this.client.core.crypto.getPayloadType(s2))) return;
      const t = await this.client.core.crypto.decode(e2, s2);
      try {
        isJsonRpcRequest(t) ? (this.client.core.history.set(e2, t), this.onRelayEventRequest({ topic: e2, payload: t })) : isJsonRpcResponse(t) ? (await this.client.core.history.resolve(t), await this.onRelayEventResponse({ topic: e2, payload: t }), this.client.core.history.delete(e2, t.id)) : this.onRelayEventUnknownPayload({ topic: e2, payload: t });
      } catch (i3) {
        this.client.logger.error(i3);
      }
    });
  }
  registerExpirerEvents() {
    this.client.core.expirer.on(v2.expired, async (r2) => {
      const { topic: e2, id: s2 } = ft3(r2.target);
      if (s2 && this.client.pendingRequest.keys.includes(s2)) return await this.deletePendingSessionRequest(s2, N4("EXPIRED"), true);
      e2 ? this.client.session.keys.includes(e2) && (await this.deleteSession(e2, true), this.client.events.emit("session_expire", { topic: e2 })) : s2 && (await this.deleteProposal(s2, true), this.client.events.emit("proposal_expire", { id: s2 }));
    });
  }
  registerPairingEvents() {
    this.client.core.pairing.events.on(V.create, (r2) => this.onPairingCreated(r2));
  }
  isValidPairingTopic(r2) {
    if (!h6(r2, false)) {
      const { message: e2 } = N4("MISSING_OR_INVALID", `pairing topic should be a string: ${r2}`);
      throw new Error(e2);
    }
    if (!this.client.core.pairing.pairings.keys.includes(r2)) {
      const { message: e2 } = N4("NO_MATCHING_KEY", `pairing topic doesn't exist: ${r2}`);
      throw new Error(e2);
    }
    if (mt3(this.client.core.pairing.pairings.get(r2).expiry)) {
      const { message: e2 } = N4("EXPIRED", `pairing topic: ${r2}`);
      throw new Error(e2);
    }
  }
  async isValidSessionTopic(r2) {
    if (!h6(r2, false)) {
      const { message: e2 } = N4("MISSING_OR_INVALID", `session topic should be a string: ${r2}`);
      throw new Error(e2);
    }
    if (!this.client.session.keys.includes(r2)) {
      const { message: e2 } = N4("NO_MATCHING_KEY", `session topic doesn't exist: ${r2}`);
      throw new Error(e2);
    }
    if (mt3(this.client.session.get(r2).expiry)) {
      await this.deleteSession(r2);
      const { message: e2 } = N4("EXPIRED", `session topic: ${r2}`);
      throw new Error(e2);
    }
  }
  async isValidSessionOrPairingTopic(r2) {
    if (this.client.session.keys.includes(r2)) await this.isValidSessionTopic(r2);
    else if (this.client.core.pairing.pairings.keys.includes(r2)) this.isValidPairingTopic(r2);
    else if (h6(r2, false)) {
      const { message: e2 } = N4("NO_MATCHING_KEY", `session or pairing topic doesn't exist: ${r2}`);
      throw new Error(e2);
    } else {
      const { message: e2 } = N4("MISSING_OR_INVALID", `session or pairing topic should be a string: ${r2}`);
      throw new Error(e2);
    }
  }
  async isValidProposalId(r2) {
    if (!Ft2(r2)) {
      const { message: e2 } = N4("MISSING_OR_INVALID", `proposal id should be a number: ${r2}`);
      throw new Error(e2);
    }
    if (!this.client.proposal.keys.includes(r2)) {
      const { message: e2 } = N4("NO_MATCHING_KEY", `proposal id doesn't exist: ${r2}`);
      throw new Error(e2);
    }
    if (mt3(this.client.proposal.get(r2).expiry)) {
      await this.deleteProposal(r2);
      const { message: e2 } = N4("EXPIRED", `proposal id: ${r2}`);
      throw new Error(e2);
    }
  }
};
var ds2 = class extends Mt2 {
  constructor(r2, e2) {
    super(r2, e2, ne, G3), this.core = r2, this.logger = e2;
  }
};
var us2 = class extends Mt2 {
  constructor(r2, e2) {
    super(r2, e2, ae2, G3), this.core = r2, this.logger = e2;
  }
};
var gs2 = class extends Mt2 {
  constructor(r2, e2) {
    super(r2, e2, le5, G3, (s2) => s2.id), this.core = r2, this.logger = e2;
  }
};
var Q3 = class _Q extends b2 {
  constructor(r2) {
    super(r2), this.protocol = X3, this.version = F3, this.name = M4.name, this.events = new import_events6.EventEmitter(), this.on = (s2, t) => this.events.on(s2, t), this.once = (s2, t) => this.events.once(s2, t), this.off = (s2, t) => this.events.off(s2, t), this.removeListener = (s2, t) => this.events.removeListener(s2, t), this.removeAllListeners = (s2) => this.events.removeAllListeners(s2), this.connect = async (s2) => {
      try {
        return await this.engine.connect(s2);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.pair = async (s2) => {
      try {
        return await this.engine.pair(s2);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.approve = async (s2) => {
      try {
        return await this.engine.approve(s2);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.reject = async (s2) => {
      try {
        return await this.engine.reject(s2);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.update = async (s2) => {
      try {
        return await this.engine.update(s2);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.extend = async (s2) => {
      try {
        return await this.engine.extend(s2);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.request = async (s2) => {
      try {
        return await this.engine.request(s2);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.respond = async (s2) => {
      try {
        return await this.engine.respond(s2);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.ping = async (s2) => {
      try {
        return await this.engine.ping(s2);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.emit = async (s2) => {
      try {
        return await this.engine.emit(s2);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.disconnect = async (s2) => {
      try {
        return await this.engine.disconnect(s2);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.find = (s2) => {
      try {
        return this.engine.find(s2);
      } catch (t) {
        throw this.logger.error(t.message), t;
      }
    }, this.getPendingSessionRequests = () => {
      try {
        return this.engine.getPendingSessionRequests();
      } catch (s2) {
        throw this.logger.error(s2.message), s2;
      }
    }, this.name = (r2 == null ? void 0 : r2.name) || M4.name, this.metadata = (r2 == null ? void 0 : r2.metadata) || Qn();
    const e2 = typeof (r2 == null ? void 0 : r2.logger) < "u" && typeof (r2 == null ? void 0 : r2.logger) != "string" ? r2.logger : (0, import_pino2.default)(k3({ level: (r2 == null ? void 0 : r2.logger) || M4.logger }));
    this.core = (r2 == null ? void 0 : r2.core) || new Nr(r2), this.logger = E2(e2, this.name), this.session = new us2(this.core, this.logger), this.proposal = new ds2(this.core, this.logger), this.pendingRequest = new gs2(this.core, this.logger), this.engine = new hs2(this);
  }
  static async init(r2) {
    const e2 = new _Q(r2);
    return await e2.initialize(), e2;
  }
  get context() {
    return y2(this.logger);
  }
  get pairing() {
    return this.core.pairing.pairings;
  }
  async initialize() {
    this.logger.trace("Initialized");
    try {
      await this.core.start(), await this.session.init(), await this.proposal.init(), await this.pendingRequest.init(), await this.engine.init(), this.core.verify.init({ verifyUrl: this.metadata.verifyUrl }), this.logger.info("SignClient Initialization Success");
    } catch (r2) {
      throw this.logger.info("SignClient Initialization Failure"), this.logger.error(r2.message), r2;
    }
  }
};

// node_modules/@walletconnect/universal-provider/node_modules/@walletconnect/utils/dist/index.es.js
var import_chacha20poly13054 = __toESM(require_chacha20poly1305());
var import_hkdf4 = __toESM(require_hkdf());
var import_random5 = __toESM(require_random());
var import_sha2564 = __toESM(require_sha256());
var fe4 = __toESM(require_x25519());
var import_time7 = __toESM(require_cjs());
var import_window_getters4 = __toESM(require_cjs2());
var import_window_metadata4 = __toESM(require_cjs3());
var M5 = __toESM(require_query_string4());
var K2 = ":";
function ge2(e2) {
  const [n4, t] = e2.split(K2);
  return { namespace: n4, reference: t };
}
function S4(e2 = [], n4 = []) {
  return [.../* @__PURE__ */ new Set([...e2, ...n4])];
}
function oe2(e2) {
  return e2.includes(":");
}
function Xe3(e2) {
  return oe2(e2) ? e2.split(":")[0] : e2;
}
var en4 = { INVALID_METHOD: { message: "Invalid method.", code: 1001 }, INVALID_EVENT: { message: "Invalid event.", code: 1002 }, INVALID_UPDATE_REQUEST: { message: "Invalid update request.", code: 1003 }, INVALID_EXTEND_REQUEST: { message: "Invalid extend request.", code: 1004 }, INVALID_SESSION_SETTLE_REQUEST: { message: "Invalid session settle request.", code: 1005 }, UNAUTHORIZED_METHOD: { message: "Unauthorized method.", code: 3001 }, UNAUTHORIZED_EVENT: { message: "Unauthorized event.", code: 3002 }, UNAUTHORIZED_UPDATE_REQUEST: { message: "Unauthorized update request.", code: 3003 }, UNAUTHORIZED_EXTEND_REQUEST: { message: "Unauthorized extend request.", code: 3004 }, USER_REJECTED: { message: "User rejected.", code: 5e3 }, USER_REJECTED_CHAINS: { message: "User rejected chains.", code: 5001 }, USER_REJECTED_METHODS: { message: "User rejected methods.", code: 5002 }, USER_REJECTED_EVENTS: { message: "User rejected events.", code: 5003 }, UNSUPPORTED_CHAINS: { message: "Unsupported chains.", code: 5100 }, UNSUPPORTED_METHODS: { message: "Unsupported methods.", code: 5101 }, UNSUPPORTED_EVENTS: { message: "Unsupported events.", code: 5102 }, UNSUPPORTED_ACCOUNTS: { message: "Unsupported accounts.", code: 5103 }, UNSUPPORTED_NAMESPACE_KEY: { message: "Unsupported namespace key.", code: 5104 }, USER_DISCONNECTED: { message: "User disconnected.", code: 6e3 }, SESSION_SETTLEMENT_FAILED: { message: "Session settlement failed.", code: 7e3 }, WC_METHOD_UNSUPPORTED: { message: "Unsupported wc_ method.", code: 10001 } };
function U7(e2, n4) {
  const { message: t, code: r2 } = en4[e2];
  return { message: n4 ? `${t} ${n4}` : t, code: r2 };
}
function k6(e2, n4) {
  return Array.isArray(e2) ? typeof n4 < "u" && e2.length ? e2.every(n4) : true : false;
}
function B3(e2) {
  return Object.getPrototypeOf(e2) === Object.prototype && Object.keys(e2).length;
}

// node_modules/@walletconnect/jsonrpc-http-connection/dist/index.es.js
var import_events7 = __toESM(require_events());
var import_cross_fetch = __toESM(require_browser_ponyfill());
var P2 = Object.defineProperty;
var w6 = Object.defineProperties;
var E4 = Object.getOwnPropertyDescriptors;
var c4 = Object.getOwnPropertySymbols;
var L3 = Object.prototype.hasOwnProperty;
var O5 = Object.prototype.propertyIsEnumerable;
var l3 = (r2, t, e2) => t in r2 ? P2(r2, t, { enumerable: true, configurable: true, writable: true, value: e2 }) : r2[t] = e2;
var p5 = (r2, t) => {
  for (var e2 in t || (t = {})) L3.call(t, e2) && l3(r2, e2, t[e2]);
  if (c4) for (var e2 of c4(t)) O5.call(t, e2) && l3(r2, e2, t[e2]);
  return r2;
};
var v3 = (r2, t) => w6(r2, E4(t));
var j2 = { Accept: "application/json", "Content-Type": "application/json" };
var T4 = "POST";
var d2 = { headers: j2, method: T4 };
var g5 = 10;
var f3 = class {
  constructor(t, e2 = false) {
    if (this.url = t, this.disableProviderPing = e2, this.events = new import_events7.EventEmitter(), this.isAvailable = false, this.registering = false, !isHttpUrl(t)) throw new Error(`Provided URL is not compatible with HTTP connection: ${t}`);
    this.url = t, this.disableProviderPing = e2;
  }
  get connected() {
    return this.isAvailable;
  }
  get connecting() {
    return this.registering;
  }
  on(t, e2) {
    this.events.on(t, e2);
  }
  once(t, e2) {
    this.events.once(t, e2);
  }
  off(t, e2) {
    this.events.off(t, e2);
  }
  removeListener(t, e2) {
    this.events.removeListener(t, e2);
  }
  async open(t = this.url) {
    await this.register(t);
  }
  async close() {
    if (!this.isAvailable) throw new Error("Connection already closed");
    this.onClose();
  }
  async send(t) {
    this.isAvailable || await this.register();
    try {
      const e2 = safeJsonStringify(t), s2 = await (await (0, import_cross_fetch.default)(this.url, v3(p5({}, d2), { body: e2 }))).json();
      this.onPayload({ data: s2 });
    } catch (e2) {
      this.onError(t.id, e2);
    }
  }
  async register(t = this.url) {
    if (!isHttpUrl(t)) throw new Error(`Provided URL is not compatible with HTTP connection: ${t}`);
    if (this.registering) {
      const e2 = this.events.getMaxListeners();
      return (this.events.listenerCount("register_error") >= e2 || this.events.listenerCount("open") >= e2) && this.events.setMaxListeners(e2 + 1), new Promise((s2, i3) => {
        this.events.once("register_error", (n4) => {
          this.resetMaxListeners(), i3(n4);
        }), this.events.once("open", () => {
          if (this.resetMaxListeners(), typeof this.isAvailable > "u") return i3(new Error("HTTP connection is missing or invalid"));
          s2();
        });
      });
    }
    this.url = t, this.registering = true;
    try {
      if (!this.disableProviderPing) {
        const e2 = safeJsonStringify({ id: 1, jsonrpc: "2.0", method: "test", params: [] });
        await (0, import_cross_fetch.default)(t, v3(p5({}, d2), { body: e2 }));
      }
      this.onOpen();
    } catch (e2) {
      const s2 = this.parseError(e2);
      throw this.events.emit("register_error", s2), this.onClose(), s2;
    }
  }
  onOpen() {
    this.isAvailable = true, this.registering = false, this.events.emit("open");
  }
  onClose() {
    this.isAvailable = false, this.registering = false, this.events.emit("close");
  }
  onPayload(t) {
    if (typeof t.data > "u") return;
    const e2 = typeof t.data == "string" ? safeJsonParse(t.data) : t.data;
    this.events.emit("payload", e2);
  }
  onError(t, e2) {
    const s2 = this.parseError(e2), i3 = s2.message || s2.toString(), n4 = formatJsonRpcError(t, i3);
    this.events.emit("payload", n4);
  }
  parseError(t, e2 = this.url) {
    return parseConnectionError(t, e2, "HTTP");
  }
  resetMaxListeners() {
    this.events.getMaxListeners() > g5 && this.events.setMaxListeners(g5);
  }
};

// node_modules/@walletconnect/universal-provider/node_modules/@walletconnect/jsonrpc-provider/dist/esm/provider.js
var import_events8 = __toESM(require_events());
var JsonRpcProvider2 = class extends r {
  constructor(connection) {
    super(connection);
    this.events = new import_events8.EventEmitter();
    this.hasRegisteredEventListeners = false;
    this.connection = this.setConnection(connection);
    if (this.connection.connected) {
      this.registerEventListeners();
    }
  }
  async connect(connection = this.connection) {
    await this.open(connection);
  }
  async disconnect() {
    await this.close();
  }
  on(event, listener) {
    this.events.on(event, listener);
  }
  once(event, listener) {
    this.events.once(event, listener);
  }
  off(event, listener) {
    this.events.off(event, listener);
  }
  removeListener(event, listener) {
    this.events.removeListener(event, listener);
  }
  async request(request, context) {
    return this.requestStrict(formatJsonRpcRequest(request.method, request.params || [], request.id || getBigIntRpcId().toString()), context);
  }
  async requestStrict(request, context) {
    return new Promise(async (resolve, reject) => {
      if (!this.connection.connected) {
        try {
          await this.open();
        } catch (e2) {
          reject(e2);
        }
      }
      this.events.on(`${request.id}`, (response) => {
        if (isJsonRpcError(response)) {
          reject(response.error);
        } else {
          resolve(response.result);
        }
      });
      try {
        await this.connection.send(request, context);
      } catch (e2) {
        reject(e2);
      }
    });
  }
  setConnection(connection = this.connection) {
    return connection;
  }
  onPayload(payload) {
    this.events.emit("payload", payload);
    if (isJsonRpcResponse(payload)) {
      this.events.emit(`${payload.id}`, payload);
    } else {
      this.events.emit("message", {
        type: payload.method,
        data: payload.params
      });
    }
  }
  onClose(event) {
    if (event && event.code === 3e3) {
      this.events.emit("error", new Error(`WebSocket connection closed abnormally with code: ${event.code} ${event.reason ? `(${event.reason})` : ""}`));
    }
    this.events.emit("disconnect");
  }
  async open(connection = this.connection) {
    if (this.connection === connection && this.connection.connected)
      return;
    if (this.connection.connected)
      this.close();
    if (typeof connection === "string") {
      await this.connection.open(connection);
      connection = this.connection;
    }
    this.connection = this.setConnection(connection);
    await this.connection.open();
    this.registerEventListeners();
    this.events.emit("connect");
  }
  async close() {
    await this.connection.close();
  }
  registerEventListeners() {
    if (this.hasRegisteredEventListeners)
      return;
    this.connection.on("payload", (payload) => this.onPayload(payload));
    this.connection.on("close", (event) => this.onClose(event));
    this.connection.on("error", (error) => this.events.emit("error", error));
    this.connection.on("register_error", (error) => this.onClose());
    this.hasRegisteredEventListeners = true;
  }
};

// node_modules/@walletconnect/universal-provider/dist/index.es.js
var import_events9 = __toESM(require_events());
var Ia = "error";
var Ug = "wss://relay.walletconnect.com";
var Wg = "wc";
var Fg = "universal_provider";
var xa = `${Wg}@2:${Fg}:`;
var Mg = "https://rpc.walletconnect.com/v1/";
var Vn2 = { DEFAULT_CHAIN_CHANGED: "default_chain_changed" };
var ge3 = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
var Ui2 = { exports: {} };
(function(C4, u4) {
  (function() {
    var i3, d3 = "4.17.21", w7 = 200, T5 = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", $4 = "Expected a function", En = "Invalid `variable` option passed into `_.template`", zt3 = "__lodash_hash_undefined__", pr = 500, It3 = "__lodash_placeholder__", Ln3 = 1, Fn2 = 2, xt3 = 4, Et3 = 1, ve = 2, vn = 1, ct2 = 2, qi2 = 4, Dn2 = 8, yt4 = 16, Hn2 = 32, St3 = 64, Mn2 = 128, Kt3 = 256, dr2 = 512, La = 30, Da = "...", Ha = 800, Na = 16, Bi2 = 1, $a = 2, Ua = 3, ht3 = 1 / 0, kn2 = 9007199254740991, Wa = 17976931348623157e292, _e3 = 0 / 0, Nn5 = 4294967295, Fa = Nn5 - 1, Ma = Nn5 >>> 1, qa = [["ary", Mn2], ["bind", vn], ["bindKey", ct2], ["curry", Dn2], ["curryRight", yt4], ["flip", dr2], ["partial", Hn2], ["partialRight", St3], ["rearg", Kt3]], Ot3 = "[object Arguments]", me5 = "[object Array]", Ba = "[object AsyncFunction]", Yt3 = "[object Boolean]", Zt2 = "[object Date]", Ga = "[object DOMException]", we = "[object Error]", Pe2 = "[object Function]", Gi2 = "[object GeneratorFunction]", yn2 = "[object Map]", Jt3 = "[object Number]", za = "[object Null]", qn2 = "[object Object]", zi = "[object Promise]", Ka = "[object Proxy]", Xt2 = "[object RegExp]", Sn = "[object Set]", Qt2 = "[object String]", Ae2 = "[object Symbol]", Ya = "[object Undefined]", Vt3 = "[object WeakMap]", Za = "[object WeakSet]", kt3 = "[object ArrayBuffer]", Rt2 = "[object DataView]", gr = "[object Float32Array]", vr2 = "[object Float64Array]", _r2 = "[object Int8Array]", mr2 = "[object Int16Array]", wr2 = "[object Int32Array]", Pr2 = "[object Uint8Array]", Ar2 = "[object Uint8ClampedArray]", Cr2 = "[object Uint16Array]", Ir2 = "[object Uint32Array]", Ja = /\b__p \+= '';/g, Xa = /\b(__p \+=) '' \+/g, Qa = /(__e\(.*?\)|\b__t\)) \+\n'';/g, Ki = /&(?:amp|lt|gt|quot|#39);/g, Yi2 = /[&<>"']/g, Va = RegExp(Ki.source), ka = RegExp(Yi2.source), ja = /<%-([\s\S]+?)%>/g, no = /<%([\s\S]+?)%>/g, Zi2 = /<%=([\s\S]+?)%>/g, to = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, eo = /^\w*$/, ro = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, xr2 = /[\\^$.*+?()[\]{}|]/g, io = RegExp(xr2.source), Er2 = /^\s+/, so = /\s/, uo = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, ao = /\{\n\/\* \[wrapped with (.+)\] \*/, oo = /,? & /, fo = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, co = /[()=,{}\[\]\/\s]/, ho = /\\(\\)?/g, lo = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Ji2 = /\w*$/, po = /^[-+]0x[0-9a-f]+$/i, go = /^0b[01]+$/i, vo = /^\[object .+?Constructor\]$/, _o = /^0o[0-7]+$/i, mo = /^(?:0|[1-9]\d*)$/, wo = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, Ce3 = /($^)/, Po = /['\n\r\u2028\u2029\\]/g, Ie2 = "\\ud800-\\udfff", Ao = "\\u0300-\\u036f", Co = "\\ufe20-\\ufe2f", Io = "\\u20d0-\\u20ff", Xi2 = Ao + Co + Io, Qi2 = "\\u2700-\\u27bf", Vi2 = "a-z\\xdf-\\xf6\\xf8-\\xff", xo = "\\xac\\xb1\\xd7\\xf7", Eo = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", yo = "\\u2000-\\u206f", So = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", ki = "A-Z\\xc0-\\xd6\\xd8-\\xde", ji2 = "\\ufe0e\\ufe0f", ns2 = xo + Eo + yo + So, yr = "['’]", Oo = "[" + Ie2 + "]", ts2 = "[" + ns2 + "]", xe = "[" + Xi2 + "]", es2 = "\\d+", Ro = "[" + Qi2 + "]", rs2 = "[" + Vi2 + "]", is2 = "[^" + Ie2 + ns2 + es2 + Qi2 + Vi2 + ki + "]", Sr2 = "\\ud83c[\\udffb-\\udfff]", bo = "(?:" + xe + "|" + Sr2 + ")", ss2 = "[^" + Ie2 + "]", Or2 = "(?:\\ud83c[\\udde6-\\uddff]){2}", Rr2 = "[\\ud800-\\udbff][\\udc00-\\udfff]", bt3 = "[" + ki + "]", us3 = "\\u200d", as3 = "(?:" + rs2 + "|" + is2 + ")", To = "(?:" + bt3 + "|" + is2 + ")", os3 = "(?:" + yr + "(?:d|ll|m|re|s|t|ve))?", fs2 = "(?:" + yr + "(?:D|LL|M|RE|S|T|VE))?", cs3 = bo + "?", hs3 = "[" + ji2 + "]?", Lo = "(?:" + us3 + "(?:" + [ss2, Or2, Rr2].join("|") + ")" + hs3 + cs3 + ")*", Do = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", Ho = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", ls3 = hs3 + cs3 + Lo, No = "(?:" + [Ro, Or2, Rr2].join("|") + ")" + ls3, $o = "(?:" + [ss2 + xe + "?", xe, Or2, Rr2, Oo].join("|") + ")", Uo = RegExp(yr, "g"), Wo = RegExp(xe, "g"), br2 = RegExp(Sr2 + "(?=" + Sr2 + ")|" + $o + ls3, "g"), Fo = RegExp([bt3 + "?" + rs2 + "+" + os3 + "(?=" + [ts2, bt3, "$"].join("|") + ")", To + "+" + fs2 + "(?=" + [ts2, bt3 + as3, "$"].join("|") + ")", bt3 + "?" + as3 + "+" + os3, bt3 + "+" + fs2, Ho, Do, es2, No].join("|"), "g"), Mo = RegExp("[" + us3 + Ie2 + Xi2 + ji2 + "]"), qo = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, Bo = ["Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout"], Go = -1, B4 = {};
    B4[gr] = B4[vr2] = B4[_r2] = B4[mr2] = B4[wr2] = B4[Pr2] = B4[Ar2] = B4[Cr2] = B4[Ir2] = true, B4[Ot3] = B4[me5] = B4[kt3] = B4[Yt3] = B4[Rt2] = B4[Zt2] = B4[we] = B4[Pe2] = B4[yn2] = B4[Jt3] = B4[qn2] = B4[Xt2] = B4[Sn] = B4[Qt2] = B4[Vt3] = false;
    var q3 = {};
    q3[Ot3] = q3[me5] = q3[kt3] = q3[Rt2] = q3[Yt3] = q3[Zt2] = q3[gr] = q3[vr2] = q3[_r2] = q3[mr2] = q3[wr2] = q3[yn2] = q3[Jt3] = q3[qn2] = q3[Xt2] = q3[Sn] = q3[Qt2] = q3[Ae2] = q3[Pr2] = q3[Ar2] = q3[Cr2] = q3[Ir2] = true, q3[we] = q3[Pe2] = q3[Vt3] = false;
    var zo = { À: "A", Á: "A", Â: "A", Ã: "A", Ä: "A", Å: "A", à: "a", á: "a", â: "a", ã: "a", ä: "a", å: "a", Ç: "C", ç: "c", Ð: "D", ð: "d", È: "E", É: "E", Ê: "E", Ë: "E", è: "e", é: "e", ê: "e", ë: "e", Ì: "I", Í: "I", Î: "I", Ï: "I", ì: "i", í: "i", î: "i", ï: "i", Ñ: "N", ñ: "n", Ò: "O", Ó: "O", Ô: "O", Õ: "O", Ö: "O", Ø: "O", ò: "o", ó: "o", ô: "o", õ: "o", ö: "o", ø: "o", Ù: "U", Ú: "U", Û: "U", Ü: "U", ù: "u", ú: "u", û: "u", ü: "u", Ý: "Y", ý: "y", ÿ: "y", Æ: "Ae", æ: "ae", Þ: "Th", þ: "th", ß: "ss", Ā: "A", Ă: "A", Ą: "A", ā: "a", ă: "a", ą: "a", Ć: "C", Ĉ: "C", Ċ: "C", Č: "C", ć: "c", ĉ: "c", ċ: "c", č: "c", Ď: "D", Đ: "D", ď: "d", đ: "d", Ē: "E", Ĕ: "E", Ė: "E", Ę: "E", Ě: "E", ē: "e", ĕ: "e", ė: "e", ę: "e", ě: "e", Ĝ: "G", Ğ: "G", Ġ: "G", Ģ: "G", ĝ: "g", ğ: "g", ġ: "g", ģ: "g", Ĥ: "H", Ħ: "H", ĥ: "h", ħ: "h", Ĩ: "I", Ī: "I", Ĭ: "I", Į: "I", İ: "I", ĩ: "i", ī: "i", ĭ: "i", į: "i", ı: "i", Ĵ: "J", ĵ: "j", Ķ: "K", ķ: "k", ĸ: "k", Ĺ: "L", Ļ: "L", Ľ: "L", Ŀ: "L", Ł: "L", ĺ: "l", ļ: "l", ľ: "l", ŀ: "l", ł: "l", Ń: "N", Ņ: "N", Ň: "N", Ŋ: "N", ń: "n", ņ: "n", ň: "n", ŋ: "n", Ō: "O", Ŏ: "O", Ő: "O", ō: "o", ŏ: "o", ő: "o", Ŕ: "R", Ŗ: "R", Ř: "R", ŕ: "r", ŗ: "r", ř: "r", Ś: "S", Ŝ: "S", Ş: "S", Š: "S", ś: "s", ŝ: "s", ş: "s", š: "s", Ţ: "T", Ť: "T", Ŧ: "T", ţ: "t", ť: "t", ŧ: "t", Ũ: "U", Ū: "U", Ŭ: "U", Ů: "U", Ű: "U", Ų: "U", ũ: "u", ū: "u", ŭ: "u", ů: "u", ű: "u", ų: "u", Ŵ: "W", ŵ: "w", Ŷ: "Y", ŷ: "y", Ÿ: "Y", Ź: "Z", Ż: "Z", Ž: "Z", ź: "z", ż: "z", ž: "z", Ĳ: "IJ", ĳ: "ij", Œ: "Oe", œ: "oe", ŉ: "'n", ſ: "s" }, Ko = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Yo = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" }, Zo = { "\\": "\\", "'": "'", "\n": "n", "\r": "r", "\u2028": "u2028", "\u2029": "u2029" }, Jo = parseFloat, Xo = parseInt, ps3 = typeof ge3 == "object" && ge3 && ge3.Object === Object && ge3, Qo = typeof self == "object" && self && self.Object === Object && self, k7 = ps3 || Qo || Function("return this")(), Tr2 = u4 && !u4.nodeType && u4, lt3 = Tr2 && true && C4 && !C4.nodeType && C4, ds3 = lt3 && lt3.exports === Tr2, Lr = ds3 && ps3.process, _n = function() {
      try {
        var h7 = lt3 && lt3.require && lt3.require("util").types;
        return h7 || Lr && Lr.binding && Lr.binding("util");
      } catch {
      }
    }(), gs3 = _n && _n.isArrayBuffer, vs2 = _n && _n.isDate, _s2 = _n && _n.isMap, ms2 = _n && _n.isRegExp, ws2 = _n && _n.isSet, Ps2 = _n && _n.isTypedArray;
    function cn2(h7, g7, p7) {
      switch (p7.length) {
        case 0:
          return h7.call(g7);
        case 1:
          return h7.call(g7, p7[0]);
        case 2:
          return h7.call(g7, p7[0], p7[1]);
        case 3:
          return h7.call(g7, p7[0], p7[1], p7[2]);
      }
      return h7.apply(g7, p7);
    }
    function Vo(h7, g7, p7, A3) {
      for (var S6 = -1, U9 = h7 == null ? 0 : h7.length; ++S6 < U9; ) {
        var X4 = h7[S6];
        g7(A3, X4, p7(X4), h7);
      }
      return A3;
    }
    function mn2(h7, g7) {
      for (var p7 = -1, A3 = h7 == null ? 0 : h7.length; ++p7 < A3 && g7(h7[p7], p7, h7) !== false; ) ;
      return h7;
    }
    function ko(h7, g7) {
      for (var p7 = h7 == null ? 0 : h7.length; p7-- && g7(h7[p7], p7, h7) !== false; ) ;
      return h7;
    }
    function As2(h7, g7) {
      for (var p7 = -1, A3 = h7 == null ? 0 : h7.length; ++p7 < A3; ) if (!g7(h7[p7], p7, h7)) return false;
      return true;
    }
    function jn(h7, g7) {
      for (var p7 = -1, A3 = h7 == null ? 0 : h7.length, S6 = 0, U9 = []; ++p7 < A3; ) {
        var X4 = h7[p7];
        g7(X4, p7, h7) && (U9[S6++] = X4);
      }
      return U9;
    }
    function Ee(h7, g7) {
      var p7 = h7 == null ? 0 : h7.length;
      return !!p7 && Tt2(h7, g7, 0) > -1;
    }
    function Dr(h7, g7, p7) {
      for (var A3 = -1, S6 = h7 == null ? 0 : h7.length; ++A3 < S6; ) if (p7(g7, h7[A3])) return true;
      return false;
    }
    function G5(h7, g7) {
      for (var p7 = -1, A3 = h7 == null ? 0 : h7.length, S6 = Array(A3); ++p7 < A3; ) S6[p7] = g7(h7[p7], p7, h7);
      return S6;
    }
    function nt2(h7, g7) {
      for (var p7 = -1, A3 = g7.length, S6 = h7.length; ++p7 < A3; ) h7[S6 + p7] = g7[p7];
      return h7;
    }
    function Hr(h7, g7, p7, A3) {
      var S6 = -1, U9 = h7 == null ? 0 : h7.length;
      for (A3 && U9 && (p7 = h7[++S6]); ++S6 < U9; ) p7 = g7(p7, h7[S6], S6, h7);
      return p7;
    }
    function jo(h7, g7, p7, A3) {
      var S6 = h7 == null ? 0 : h7.length;
      for (A3 && S6 && (p7 = h7[--S6]); S6--; ) p7 = g7(p7, h7[S6], S6, h7);
      return p7;
    }
    function Nr2(h7, g7) {
      for (var p7 = -1, A3 = h7 == null ? 0 : h7.length; ++p7 < A3; ) if (g7(h7[p7], p7, h7)) return true;
      return false;
    }
    var nf = $r("length");
    function tf(h7) {
      return h7.split("");
    }
    function ef(h7) {
      return h7.match(fo) || [];
    }
    function Cs2(h7, g7, p7) {
      var A3;
      return p7(h7, function(S6, U9, X4) {
        if (g7(S6, U9, X4)) return A3 = U9, false;
      }), A3;
    }
    function ye5(h7, g7, p7, A3) {
      for (var S6 = h7.length, U9 = p7 + (A3 ? 1 : -1); A3 ? U9-- : ++U9 < S6; ) if (g7(h7[U9], U9, h7)) return U9;
      return -1;
    }
    function Tt2(h7, g7, p7) {
      return g7 === g7 ? gf(h7, g7, p7) : ye5(h7, Is2, p7);
    }
    function rf(h7, g7, p7, A3) {
      for (var S6 = p7 - 1, U9 = h7.length; ++S6 < U9; ) if (A3(h7[S6], g7)) return S6;
      return -1;
    }
    function Is2(h7) {
      return h7 !== h7;
    }
    function xs2(h7, g7) {
      var p7 = h7 == null ? 0 : h7.length;
      return p7 ? Wr(h7, g7) / p7 : _e3;
    }
    function $r(h7) {
      return function(g7) {
        return g7 == null ? i3 : g7[h7];
      };
    }
    function Ur(h7) {
      return function(g7) {
        return h7 == null ? i3 : h7[g7];
      };
    }
    function Es2(h7, g7, p7, A3, S6) {
      return S6(h7, function(U9, X4, M7) {
        p7 = A3 ? (A3 = false, U9) : g7(p7, U9, X4, M7);
      }), p7;
    }
    function sf(h7, g7) {
      var p7 = h7.length;
      for (h7.sort(g7); p7--; ) h7[p7] = h7[p7].value;
      return h7;
    }
    function Wr(h7, g7) {
      for (var p7, A3 = -1, S6 = h7.length; ++A3 < S6; ) {
        var U9 = g7(h7[A3]);
        U9 !== i3 && (p7 = p7 === i3 ? U9 : p7 + U9);
      }
      return p7;
    }
    function Fr(h7, g7) {
      for (var p7 = -1, A3 = Array(h7); ++p7 < h7; ) A3[p7] = g7(p7);
      return A3;
    }
    function uf(h7, g7) {
      return G5(g7, function(p7) {
        return [p7, h7[p7]];
      });
    }
    function ys2(h7) {
      return h7 && h7.slice(0, bs2(h7) + 1).replace(Er2, "");
    }
    function hn2(h7) {
      return function(g7) {
        return h7(g7);
      };
    }
    function Mr(h7, g7) {
      return G5(g7, function(p7) {
        return h7[p7];
      });
    }
    function jt3(h7, g7) {
      return h7.has(g7);
    }
    function Ss2(h7, g7) {
      for (var p7 = -1, A3 = h7.length; ++p7 < A3 && Tt2(g7, h7[p7], 0) > -1; ) ;
      return p7;
    }
    function Os2(h7, g7) {
      for (var p7 = h7.length; p7-- && Tt2(g7, h7[p7], 0) > -1; ) ;
      return p7;
    }
    function af(h7, g7) {
      for (var p7 = h7.length, A3 = 0; p7--; ) h7[p7] === g7 && ++A3;
      return A3;
    }
    var of = Ur(zo), ff = Ur(Ko);
    function cf(h7) {
      return "\\" + Zo[h7];
    }
    function hf(h7, g7) {
      return h7 == null ? i3 : h7[g7];
    }
    function Lt3(h7) {
      return Mo.test(h7);
    }
    function lf(h7) {
      return qo.test(h7);
    }
    function pf(h7) {
      for (var g7, p7 = []; !(g7 = h7.next()).done; ) p7.push(g7.value);
      return p7;
    }
    function qr(h7) {
      var g7 = -1, p7 = Array(h7.size);
      return h7.forEach(function(A3, S6) {
        p7[++g7] = [S6, A3];
      }), p7;
    }
    function Rs2(h7, g7) {
      return function(p7) {
        return h7(g7(p7));
      };
    }
    function tt2(h7, g7) {
      for (var p7 = -1, A3 = h7.length, S6 = 0, U9 = []; ++p7 < A3; ) {
        var X4 = h7[p7];
        (X4 === g7 || X4 === It3) && (h7[p7] = It3, U9[S6++] = p7);
      }
      return U9;
    }
    function Se2(h7) {
      var g7 = -1, p7 = Array(h7.size);
      return h7.forEach(function(A3) {
        p7[++g7] = A3;
      }), p7;
    }
    function df(h7) {
      var g7 = -1, p7 = Array(h7.size);
      return h7.forEach(function(A3) {
        p7[++g7] = [A3, A3];
      }), p7;
    }
    function gf(h7, g7, p7) {
      for (var A3 = p7 - 1, S6 = h7.length; ++A3 < S6; ) if (h7[A3] === g7) return A3;
      return -1;
    }
    function vf(h7, g7, p7) {
      for (var A3 = p7 + 1; A3--; ) if (h7[A3] === g7) return A3;
      return A3;
    }
    function Dt3(h7) {
      return Lt3(h7) ? mf(h7) : nf(h7);
    }
    function On5(h7) {
      return Lt3(h7) ? wf(h7) : tf(h7);
    }
    function bs2(h7) {
      for (var g7 = h7.length; g7-- && so.test(h7.charAt(g7)); ) ;
      return g7;
    }
    var _f = Ur(Yo);
    function mf(h7) {
      for (var g7 = br2.lastIndex = 0; br2.test(h7); ) ++g7;
      return g7;
    }
    function wf(h7) {
      return h7.match(br2) || [];
    }
    function Pf(h7) {
      return h7.match(Fo) || [];
    }
    var Af = function h7(g7) {
      g7 = g7 == null ? k7 : Ht3.defaults(k7.Object(), g7, Ht3.pick(k7, Bo));
      var p7 = g7.Array, A3 = g7.Date, S6 = g7.Error, U9 = g7.Function, X4 = g7.Math, M7 = g7.Object, Br = g7.RegExp, Cf = g7.String, wn5 = g7.TypeError, Oe = p7.prototype, If = U9.prototype, Nt3 = M7.prototype, Re3 = g7["__core-js_shared__"], be = If.toString, F4 = Nt3.hasOwnProperty, xf = 0, Ts2 = function() {
        var n4 = /[^.]+$/.exec(Re3 && Re3.keys && Re3.keys.IE_PROTO || "");
        return n4 ? "Symbol(src)_1." + n4 : "";
      }(), Te3 = Nt3.toString, Ef = be.call(M7), yf = k7._, Sf = Br("^" + be.call(F4).replace(xr2, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), Le2 = ds3 ? g7.Buffer : i3, et2 = g7.Symbol, De3 = g7.Uint8Array, Ls2 = Le2 ? Le2.allocUnsafe : i3, He3 = Rs2(M7.getPrototypeOf, M7), Ds2 = M7.create, Hs2 = Nt3.propertyIsEnumerable, Ne2 = Oe.splice, Ns2 = et2 ? et2.isConcatSpreadable : i3, ne2 = et2 ? et2.iterator : i3, pt4 = et2 ? et2.toStringTag : i3, $e3 = function() {
        try {
          var n4 = mt4(M7, "defineProperty");
          return n4({}, "", {}), n4;
        } catch {
        }
      }(), Of = g7.clearTimeout !== k7.clearTimeout && g7.clearTimeout, Rf = A3 && A3.now !== k7.Date.now && A3.now, bf = g7.setTimeout !== k7.setTimeout && g7.setTimeout, Ue3 = X4.ceil, We3 = X4.floor, Gr = M7.getOwnPropertySymbols, Tf = Le2 ? Le2.isBuffer : i3, $s2 = g7.isFinite, Lf = Oe.join, Df = Rs2(M7.keys, M7), Q5 = X4.max, nn3 = X4.min, Hf = A3.now, Nf = g7.parseInt, Us2 = X4.random, $f = Oe.reverse, zr2 = mt4(g7, "DataView"), te5 = mt4(g7, "Map"), Kr = mt4(g7, "Promise"), $t2 = mt4(g7, "Set"), ee3 = mt4(g7, "WeakMap"), re3 = mt4(M7, "create"), Fe3 = ee3 && new ee3(), Ut2 = {}, Uf = wt3(zr2), Wf = wt3(te5), Ff = wt3(Kr), Mf = wt3($t2), qf = wt3(ee3), Me3 = et2 ? et2.prototype : i3, ie3 = Me3 ? Me3.valueOf : i3, Ws2 = Me3 ? Me3.toString : i3;
      function a3(n4) {
        if (Y(n4) && !O7(n4) && !(n4 instanceof H4)) {
          if (n4 instanceof Pn5) return n4;
          if (F4.call(n4, "__wrapped__")) return Fu(n4);
        }
        return new Pn5(n4);
      }
      var Wt2 = /* @__PURE__ */ function() {
        function n4() {
        }
        return function(t) {
          if (!K3(t)) return {};
          if (Ds2) return Ds2(t);
          n4.prototype = t;
          var e2 = new n4();
          return n4.prototype = i3, e2;
        };
      }();
      function qe3() {
      }
      function Pn5(n4, t) {
        this.__wrapped__ = n4, this.__actions__ = [], this.__chain__ = !!t, this.__index__ = 0, this.__values__ = i3;
      }
      a3.templateSettings = { escape: ja, evaluate: no, interpolate: Zi2, variable: "", imports: { _: a3 } }, a3.prototype = qe3.prototype, a3.prototype.constructor = a3, Pn5.prototype = Wt2(qe3.prototype), Pn5.prototype.constructor = Pn5;
      function H4(n4) {
        this.__wrapped__ = n4, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = false, this.__iteratees__ = [], this.__takeCount__ = Nn5, this.__views__ = [];
      }
      function Bf() {
        var n4 = new H4(this.__wrapped__);
        return n4.__actions__ = un2(this.__actions__), n4.__dir__ = this.__dir__, n4.__filtered__ = this.__filtered__, n4.__iteratees__ = un2(this.__iteratees__), n4.__takeCount__ = this.__takeCount__, n4.__views__ = un2(this.__views__), n4;
      }
      function Gf() {
        if (this.__filtered__) {
          var n4 = new H4(this);
          n4.__dir__ = -1, n4.__filtered__ = true;
        } else n4 = this.clone(), n4.__dir__ *= -1;
        return n4;
      }
      function zf() {
        var n4 = this.__wrapped__.value(), t = this.__dir__, e2 = O7(n4), r2 = t < 0, s2 = e2 ? n4.length : 0, o3 = eh(0, s2, this.__views__), f5 = o3.start, c5 = o3.end, l4 = c5 - f5, v5 = r2 ? c5 : f5 - 1, _6 = this.__iteratees__, m5 = _6.length, P4 = 0, I2 = nn3(l4, this.__takeCount__);
        if (!e2 || !r2 && s2 == l4 && I2 == l4) return ou(n4, this.__actions__);
        var E6 = [];
        n: for (; l4-- && P4 < I2; ) {
          v5 += t;
          for (var b6 = -1, y7 = n4[v5]; ++b6 < m5; ) {
            var D6 = _6[b6], N6 = D6.iteratee, dn2 = D6.type, sn2 = N6(y7);
            if (dn2 == $a) y7 = sn2;
            else if (!sn2) {
              if (dn2 == Bi2) continue n;
              break n;
            }
          }
          E6[P4++] = y7;
        }
        return E6;
      }
      H4.prototype = Wt2(qe3.prototype), H4.prototype.constructor = H4;
      function dt3(n4) {
        var t = -1, e2 = n4 == null ? 0 : n4.length;
        for (this.clear(); ++t < e2; ) {
          var r2 = n4[t];
          this.set(r2[0], r2[1]);
        }
      }
      function Kf() {
        this.__data__ = re3 ? re3(null) : {}, this.size = 0;
      }
      function Yf(n4) {
        var t = this.has(n4) && delete this.__data__[n4];
        return this.size -= t ? 1 : 0, t;
      }
      function Zf(n4) {
        var t = this.__data__;
        if (re3) {
          var e2 = t[n4];
          return e2 === zt3 ? i3 : e2;
        }
        return F4.call(t, n4) ? t[n4] : i3;
      }
      function Jf(n4) {
        var t = this.__data__;
        return re3 ? t[n4] !== i3 : F4.call(t, n4);
      }
      function Xf(n4, t) {
        var e2 = this.__data__;
        return this.size += this.has(n4) ? 0 : 1, e2[n4] = re3 && t === i3 ? zt3 : t, this;
      }
      dt3.prototype.clear = Kf, dt3.prototype.delete = Yf, dt3.prototype.get = Zf, dt3.prototype.has = Jf, dt3.prototype.set = Xf;
      function Bn2(n4) {
        var t = -1, e2 = n4 == null ? 0 : n4.length;
        for (this.clear(); ++t < e2; ) {
          var r2 = n4[t];
          this.set(r2[0], r2[1]);
        }
      }
      function Qf() {
        this.__data__ = [], this.size = 0;
      }
      function Vf(n4) {
        var t = this.__data__, e2 = Be3(t, n4);
        if (e2 < 0) return false;
        var r2 = t.length - 1;
        return e2 == r2 ? t.pop() : Ne2.call(t, e2, 1), --this.size, true;
      }
      function kf(n4) {
        var t = this.__data__, e2 = Be3(t, n4);
        return e2 < 0 ? i3 : t[e2][1];
      }
      function jf(n4) {
        return Be3(this.__data__, n4) > -1;
      }
      function nc(n4, t) {
        var e2 = this.__data__, r2 = Be3(e2, n4);
        return r2 < 0 ? (++this.size, e2.push([n4, t])) : e2[r2][1] = t, this;
      }
      Bn2.prototype.clear = Qf, Bn2.prototype.delete = Vf, Bn2.prototype.get = kf, Bn2.prototype.has = jf, Bn2.prototype.set = nc;
      function Gn2(n4) {
        var t = -1, e2 = n4 == null ? 0 : n4.length;
        for (this.clear(); ++t < e2; ) {
          var r2 = n4[t];
          this.set(r2[0], r2[1]);
        }
      }
      function tc() {
        this.size = 0, this.__data__ = { hash: new dt3(), map: new (te5 || Bn2)(), string: new dt3() };
      }
      function ec(n4) {
        var t = nr3(this, n4).delete(n4);
        return this.size -= t ? 1 : 0, t;
      }
      function rc(n4) {
        return nr3(this, n4).get(n4);
      }
      function ic(n4) {
        return nr3(this, n4).has(n4);
      }
      function sc(n4, t) {
        var e2 = nr3(this, n4), r2 = e2.size;
        return e2.set(n4, t), this.size += e2.size == r2 ? 0 : 1, this;
      }
      Gn2.prototype.clear = tc, Gn2.prototype.delete = ec, Gn2.prototype.get = rc, Gn2.prototype.has = ic, Gn2.prototype.set = sc;
      function gt3(n4) {
        var t = -1, e2 = n4 == null ? 0 : n4.length;
        for (this.__data__ = new Gn2(); ++t < e2; ) this.add(n4[t]);
      }
      function uc(n4) {
        return this.__data__.set(n4, zt3), this;
      }
      function ac(n4) {
        return this.__data__.has(n4);
      }
      gt3.prototype.add = gt3.prototype.push = uc, gt3.prototype.has = ac;
      function Rn(n4) {
        var t = this.__data__ = new Bn2(n4);
        this.size = t.size;
      }
      function oc() {
        this.__data__ = new Bn2(), this.size = 0;
      }
      function fc(n4) {
        var t = this.__data__, e2 = t.delete(n4);
        return this.size = t.size, e2;
      }
      function cc(n4) {
        return this.__data__.get(n4);
      }
      function hc(n4) {
        return this.__data__.has(n4);
      }
      function lc(n4, t) {
        var e2 = this.__data__;
        if (e2 instanceof Bn2) {
          var r2 = e2.__data__;
          if (!te5 || r2.length < w7 - 1) return r2.push([n4, t]), this.size = ++e2.size, this;
          e2 = this.__data__ = new Gn2(r2);
        }
        return e2.set(n4, t), this.size = e2.size, this;
      }
      Rn.prototype.clear = oc, Rn.prototype.delete = fc, Rn.prototype.get = cc, Rn.prototype.has = hc, Rn.prototype.set = lc;
      function Fs2(n4, t) {
        var e2 = O7(n4), r2 = !e2 && Pt2(n4), s2 = !e2 && !r2 && at4(n4), o3 = !e2 && !r2 && !s2 && Bt3(n4), f5 = e2 || r2 || s2 || o3, c5 = f5 ? Fr(n4.length, Cf) : [], l4 = c5.length;
        for (var v5 in n4) (t || F4.call(n4, v5)) && !(f5 && (v5 == "length" || s2 && (v5 == "offset" || v5 == "parent") || o3 && (v5 == "buffer" || v5 == "byteLength" || v5 == "byteOffset") || Zn(v5, l4))) && c5.push(v5);
        return c5;
      }
      function Ms2(n4) {
        var t = n4.length;
        return t ? n4[ei(0, t - 1)] : i3;
      }
      function pc(n4, t) {
        return tr3(un2(n4), vt3(t, 0, n4.length));
      }
      function dc(n4) {
        return tr3(un2(n4));
      }
      function Yr(n4, t, e2) {
        (e2 !== i3 && !bn(n4[t], e2) || e2 === i3 && !(t in n4)) && zn(n4, t, e2);
      }
      function se(n4, t, e2) {
        var r2 = n4[t];
        (!(F4.call(n4, t) && bn(r2, e2)) || e2 === i3 && !(t in n4)) && zn(n4, t, e2);
      }
      function Be3(n4, t) {
        for (var e2 = n4.length; e2--; ) if (bn(n4[e2][0], t)) return e2;
        return -1;
      }
      function gc(n4, t, e2, r2) {
        return rt3(n4, function(s2, o3, f5) {
          t(r2, s2, e2(s2), f5);
        }), r2;
      }
      function qs2(n4, t) {
        return n4 && Un2(t, V4(t), n4);
      }
      function vc(n4, t) {
        return n4 && Un2(t, on2(t), n4);
      }
      function zn(n4, t, e2) {
        t == "__proto__" && $e3 ? $e3(n4, t, { configurable: true, enumerable: true, value: e2, writable: true }) : n4[t] = e2;
      }
      function Zr(n4, t) {
        for (var e2 = -1, r2 = t.length, s2 = p7(r2), o3 = n4 == null; ++e2 < r2; ) s2[e2] = o3 ? i3 : Si(n4, t[e2]);
        return s2;
      }
      function vt3(n4, t, e2) {
        return n4 === n4 && (e2 !== i3 && (n4 = n4 <= e2 ? n4 : e2), t !== i3 && (n4 = n4 >= t ? n4 : t)), n4;
      }
      function An(n4, t, e2, r2, s2, o3) {
        var f5, c5 = t & Ln3, l4 = t & Fn2, v5 = t & xt3;
        if (e2 && (f5 = s2 ? e2(n4, r2, s2, o3) : e2(n4)), f5 !== i3) return f5;
        if (!K3(n4)) return n4;
        var _6 = O7(n4);
        if (_6) {
          if (f5 = ih(n4), !c5) return un2(n4, f5);
        } else {
          var m5 = tn2(n4), P4 = m5 == Pe2 || m5 == Gi2;
          if (at4(n4)) return hu(n4, c5);
          if (m5 == qn2 || m5 == Ot3 || P4 && !s2) {
            if (f5 = l4 || P4 ? {} : bu(n4), !c5) return l4 ? Zc(n4, vc(f5, n4)) : Yc(n4, qs2(f5, n4));
          } else {
            if (!q3[m5]) return s2 ? n4 : {};
            f5 = sh(n4, m5, c5);
          }
        }
        o3 || (o3 = new Rn());
        var I2 = o3.get(n4);
        if (I2) return I2;
        o3.set(n4, f5), sa(n4) ? n4.forEach(function(y7) {
          f5.add(An(y7, t, e2, y7, n4, o3));
        }) : ra(n4) && n4.forEach(function(y7, D6) {
          f5.set(D6, An(y7, t, e2, D6, n4, o3));
        });
        var E6 = v5 ? l4 ? pi : li : l4 ? on2 : V4, b6 = _6 ? i3 : E6(n4);
        return mn2(b6 || n4, function(y7, D6) {
          b6 && (D6 = y7, y7 = n4[D6]), se(f5, D6, An(y7, t, e2, D6, n4, o3));
        }), f5;
      }
      function _c(n4) {
        var t = V4(n4);
        return function(e2) {
          return Bs2(e2, n4, t);
        };
      }
      function Bs2(n4, t, e2) {
        var r2 = e2.length;
        if (n4 == null) return !r2;
        for (n4 = M7(n4); r2--; ) {
          var s2 = e2[r2], o3 = t[s2], f5 = n4[s2];
          if (f5 === i3 && !(s2 in n4) || !o3(f5)) return false;
        }
        return true;
      }
      function Gs2(n4, t, e2) {
        if (typeof n4 != "function") throw new wn5($4);
        return le7(function() {
          n4.apply(i3, e2);
        }, t);
      }
      function ue6(n4, t, e2, r2) {
        var s2 = -1, o3 = Ee, f5 = true, c5 = n4.length, l4 = [], v5 = t.length;
        if (!c5) return l4;
        e2 && (t = G5(t, hn2(e2))), r2 ? (o3 = Dr, f5 = false) : t.length >= w7 && (o3 = jt3, f5 = false, t = new gt3(t));
        n: for (; ++s2 < c5; ) {
          var _6 = n4[s2], m5 = e2 == null ? _6 : e2(_6);
          if (_6 = r2 || _6 !== 0 ? _6 : 0, f5 && m5 === m5) {
            for (var P4 = v5; P4--; ) if (t[P4] === m5) continue n;
            l4.push(_6);
          } else o3(t, m5, r2) || l4.push(_6);
        }
        return l4;
      }
      var rt3 = vu($n), zs2 = vu(Xr, true);
      function mc(n4, t) {
        var e2 = true;
        return rt3(n4, function(r2, s2, o3) {
          return e2 = !!t(r2, s2, o3), e2;
        }), e2;
      }
      function Ge3(n4, t, e2) {
        for (var r2 = -1, s2 = n4.length; ++r2 < s2; ) {
          var o3 = n4[r2], f5 = t(o3);
          if (f5 != null && (c5 === i3 ? f5 === f5 && !pn2(f5) : e2(f5, c5))) var c5 = f5, l4 = o3;
        }
        return l4;
      }
      function wc(n4, t, e2, r2) {
        var s2 = n4.length;
        for (e2 = R2(e2), e2 < 0 && (e2 = -e2 > s2 ? 0 : s2 + e2), r2 = r2 === i3 || r2 > s2 ? s2 : R2(r2), r2 < 0 && (r2 += s2), r2 = e2 > r2 ? 0 : aa(r2); e2 < r2; ) n4[e2++] = t;
        return n4;
      }
      function Ks2(n4, t) {
        var e2 = [];
        return rt3(n4, function(r2, s2, o3) {
          t(r2, s2, o3) && e2.push(r2);
        }), e2;
      }
      function j4(n4, t, e2, r2, s2) {
        var o3 = -1, f5 = n4.length;
        for (e2 || (e2 = ah), s2 || (s2 = []); ++o3 < f5; ) {
          var c5 = n4[o3];
          t > 0 && e2(c5) ? t > 1 ? j4(c5, t - 1, e2, r2, s2) : nt2(s2, c5) : r2 || (s2[s2.length] = c5);
        }
        return s2;
      }
      var Jr = _u(), Ys2 = _u(true);
      function $n(n4, t) {
        return n4 && Jr(n4, t, V4);
      }
      function Xr(n4, t) {
        return n4 && Ys2(n4, t, V4);
      }
      function ze(n4, t) {
        return jn(t, function(e2) {
          return Jn2(n4[e2]);
        });
      }
      function _t2(n4, t) {
        t = st2(t, n4);
        for (var e2 = 0, r2 = t.length; n4 != null && e2 < r2; ) n4 = n4[Wn2(t[e2++])];
        return e2 && e2 == r2 ? n4 : i3;
      }
      function Zs2(n4, t, e2) {
        var r2 = t(n4);
        return O7(n4) ? r2 : nt2(r2, e2(n4));
      }
      function en5(n4) {
        return n4 == null ? n4 === i3 ? Ya : za : pt4 && pt4 in M7(n4) ? th(n4) : dh(n4);
      }
      function Qr(n4, t) {
        return n4 > t;
      }
      function Pc(n4, t) {
        return n4 != null && F4.call(n4, t);
      }
      function Ac(n4, t) {
        return n4 != null && t in M7(n4);
      }
      function Cc(n4, t, e2) {
        return n4 >= nn3(t, e2) && n4 < Q5(t, e2);
      }
      function Vr(n4, t, e2) {
        for (var r2 = e2 ? Dr : Ee, s2 = n4[0].length, o3 = n4.length, f5 = o3, c5 = p7(o3), l4 = 1 / 0, v5 = []; f5--; ) {
          var _6 = n4[f5];
          f5 && t && (_6 = G5(_6, hn2(t))), l4 = nn3(_6.length, l4), c5[f5] = !e2 && (t || s2 >= 120 && _6.length >= 120) ? new gt3(f5 && _6) : i3;
        }
        _6 = n4[0];
        var m5 = -1, P4 = c5[0];
        n: for (; ++m5 < s2 && v5.length < l4; ) {
          var I2 = _6[m5], E6 = t ? t(I2) : I2;
          if (I2 = e2 || I2 !== 0 ? I2 : 0, !(P4 ? jt3(P4, E6) : r2(v5, E6, e2))) {
            for (f5 = o3; --f5; ) {
              var b6 = c5[f5];
              if (!(b6 ? jt3(b6, E6) : r2(n4[f5], E6, e2))) continue n;
            }
            P4 && P4.push(E6), v5.push(I2);
          }
        }
        return v5;
      }
      function Ic(n4, t, e2, r2) {
        return $n(n4, function(s2, o3, f5) {
          t(r2, e2(s2), o3, f5);
        }), r2;
      }
      function ae3(n4, t, e2) {
        t = st2(t, n4), n4 = Hu(n4, t);
        var r2 = n4 == null ? n4 : n4[Wn2(In5(t))];
        return r2 == null ? i3 : cn2(r2, n4, e2);
      }
      function Js2(n4) {
        return Y(n4) && en5(n4) == Ot3;
      }
      function xc(n4) {
        return Y(n4) && en5(n4) == kt3;
      }
      function Ec(n4) {
        return Y(n4) && en5(n4) == Zt2;
      }
      function oe3(n4, t, e2, r2, s2) {
        return n4 === t ? true : n4 == null || t == null || !Y(n4) && !Y(t) ? n4 !== n4 && t !== t : yc(n4, t, e2, r2, oe3, s2);
      }
      function yc(n4, t, e2, r2, s2, o3) {
        var f5 = O7(n4), c5 = O7(t), l4 = f5 ? me5 : tn2(n4), v5 = c5 ? me5 : tn2(t);
        l4 = l4 == Ot3 ? qn2 : l4, v5 = v5 == Ot3 ? qn2 : v5;
        var _6 = l4 == qn2, m5 = v5 == qn2, P4 = l4 == v5;
        if (P4 && at4(n4)) {
          if (!at4(t)) return false;
          f5 = true, _6 = false;
        }
        if (P4 && !_6) return o3 || (o3 = new Rn()), f5 || Bt3(n4) ? Su(n4, t, e2, r2, s2, o3) : jc(n4, t, l4, e2, r2, s2, o3);
        if (!(e2 & Et3)) {
          var I2 = _6 && F4.call(n4, "__wrapped__"), E6 = m5 && F4.call(t, "__wrapped__");
          if (I2 || E6) {
            var b6 = I2 ? n4.value() : n4, y7 = E6 ? t.value() : t;
            return o3 || (o3 = new Rn()), s2(b6, y7, e2, r2, o3);
          }
        }
        return P4 ? (o3 || (o3 = new Rn()), nh(n4, t, e2, r2, s2, o3)) : false;
      }
      function Sc(n4) {
        return Y(n4) && tn2(n4) == yn2;
      }
      function kr(n4, t, e2, r2) {
        var s2 = e2.length, o3 = s2, f5 = !r2;
        if (n4 == null) return !o3;
        for (n4 = M7(n4); s2--; ) {
          var c5 = e2[s2];
          if (f5 && c5[2] ? c5[1] !== n4[c5[0]] : !(c5[0] in n4)) return false;
        }
        for (; ++s2 < o3; ) {
          c5 = e2[s2];
          var l4 = c5[0], v5 = n4[l4], _6 = c5[1];
          if (f5 && c5[2]) {
            if (v5 === i3 && !(l4 in n4)) return false;
          } else {
            var m5 = new Rn();
            if (r2) var P4 = r2(v5, _6, l4, n4, t, m5);
            if (!(P4 === i3 ? oe3(_6, v5, Et3 | ve, r2, m5) : P4)) return false;
          }
        }
        return true;
      }
      function Xs2(n4) {
        if (!K3(n4) || fh(n4)) return false;
        var t = Jn2(n4) ? Sf : vo;
        return t.test(wt3(n4));
      }
      function Oc(n4) {
        return Y(n4) && en5(n4) == Xt2;
      }
      function Rc(n4) {
        return Y(n4) && tn2(n4) == Sn;
      }
      function bc(n4) {
        return Y(n4) && ar2(n4.length) && !!B4[en5(n4)];
      }
      function Qs2(n4) {
        return typeof n4 == "function" ? n4 : n4 == null ? fn2 : typeof n4 == "object" ? O7(n4) ? js2(n4[0], n4[1]) : ks2(n4) : ma(n4);
      }
      function jr(n4) {
        if (!he7(n4)) return Df(n4);
        var t = [];
        for (var e2 in M7(n4)) F4.call(n4, e2) && e2 != "constructor" && t.push(e2);
        return t;
      }
      function Tc(n4) {
        if (!K3(n4)) return ph(n4);
        var t = he7(n4), e2 = [];
        for (var r2 in n4) r2 == "constructor" && (t || !F4.call(n4, r2)) || e2.push(r2);
        return e2;
      }
      function ni(n4, t) {
        return n4 < t;
      }
      function Vs2(n4, t) {
        var e2 = -1, r2 = an2(n4) ? p7(n4.length) : [];
        return rt3(n4, function(s2, o3, f5) {
          r2[++e2] = t(s2, o3, f5);
        }), r2;
      }
      function ks2(n4) {
        var t = gi(n4);
        return t.length == 1 && t[0][2] ? Lu(t[0][0], t[0][1]) : function(e2) {
          return e2 === n4 || kr(e2, n4, t);
        };
      }
      function js2(n4, t) {
        return _i(n4) && Tu(t) ? Lu(Wn2(n4), t) : function(e2) {
          var r2 = Si(e2, n4);
          return r2 === i3 && r2 === t ? Oi(e2, n4) : oe3(t, r2, Et3 | ve);
        };
      }
      function Ke2(n4, t, e2, r2, s2) {
        n4 !== t && Jr(t, function(o3, f5) {
          if (s2 || (s2 = new Rn()), K3(o3)) Lc(n4, t, f5, e2, Ke2, r2, s2);
          else {
            var c5 = r2 ? r2(wi(n4, f5), o3, f5 + "", n4, t, s2) : i3;
            c5 === i3 && (c5 = o3), Yr(n4, f5, c5);
          }
        }, on2);
      }
      function Lc(n4, t, e2, r2, s2, o3, f5) {
        var c5 = wi(n4, e2), l4 = wi(t, e2), v5 = f5.get(l4);
        if (v5) {
          Yr(n4, e2, v5);
          return;
        }
        var _6 = o3 ? o3(c5, l4, e2 + "", n4, t, f5) : i3, m5 = _6 === i3;
        if (m5) {
          var P4 = O7(l4), I2 = !P4 && at4(l4), E6 = !P4 && !I2 && Bt3(l4);
          _6 = l4, P4 || I2 || E6 ? O7(c5) ? _6 = c5 : Z3(c5) ? _6 = un2(c5) : I2 ? (m5 = false, _6 = hu(l4, true)) : E6 ? (m5 = false, _6 = lu(l4, true)) : _6 = [] : pe3(l4) || Pt2(l4) ? (_6 = c5, Pt2(c5) ? _6 = oa(c5) : (!K3(c5) || Jn2(c5)) && (_6 = bu(l4))) : m5 = false;
        }
        m5 && (f5.set(l4, _6), s2(_6, l4, r2, o3, f5), f5.delete(l4)), Yr(n4, e2, _6);
      }
      function nu(n4, t) {
        var e2 = n4.length;
        if (e2) return t += t < 0 ? e2 : 0, Zn(t, e2) ? n4[t] : i3;
      }
      function tu(n4, t, e2) {
        t.length ? t = G5(t, function(o3) {
          return O7(o3) ? function(f5) {
            return _t2(f5, o3.length === 1 ? o3[0] : o3);
          } : o3;
        }) : t = [fn2];
        var r2 = -1;
        t = G5(t, hn2(x3()));
        var s2 = Vs2(n4, function(o3, f5, c5) {
          var l4 = G5(t, function(v5) {
            return v5(o3);
          });
          return { criteria: l4, index: ++r2, value: o3 };
        });
        return sf(s2, function(o3, f5) {
          return Kc(o3, f5, e2);
        });
      }
      function Dc(n4, t) {
        return eu(n4, t, function(e2, r2) {
          return Oi(n4, r2);
        });
      }
      function eu(n4, t, e2) {
        for (var r2 = -1, s2 = t.length, o3 = {}; ++r2 < s2; ) {
          var f5 = t[r2], c5 = _t2(n4, f5);
          e2(c5, f5) && fe5(o3, st2(f5, n4), c5);
        }
        return o3;
      }
      function Hc(n4) {
        return function(t) {
          return _t2(t, n4);
        };
      }
      function ti(n4, t, e2, r2) {
        var s2 = r2 ? rf : Tt2, o3 = -1, f5 = t.length, c5 = n4;
        for (n4 === t && (t = un2(t)), e2 && (c5 = G5(n4, hn2(e2))); ++o3 < f5; ) for (var l4 = 0, v5 = t[o3], _6 = e2 ? e2(v5) : v5; (l4 = s2(c5, _6, l4, r2)) > -1; ) c5 !== n4 && Ne2.call(c5, l4, 1), Ne2.call(n4, l4, 1);
        return n4;
      }
      function ru(n4, t) {
        for (var e2 = n4 ? t.length : 0, r2 = e2 - 1; e2--; ) {
          var s2 = t[e2];
          if (e2 == r2 || s2 !== o3) {
            var o3 = s2;
            Zn(s2) ? Ne2.call(n4, s2, 1) : si(n4, s2);
          }
        }
        return n4;
      }
      function ei(n4, t) {
        return n4 + We3(Us2() * (t - n4 + 1));
      }
      function Nc(n4, t, e2, r2) {
        for (var s2 = -1, o3 = Q5(Ue3((t - n4) / (e2 || 1)), 0), f5 = p7(o3); o3--; ) f5[r2 ? o3 : ++s2] = n4, n4 += e2;
        return f5;
      }
      function ri(n4, t) {
        var e2 = "";
        if (!n4 || t < 1 || t > kn2) return e2;
        do
          t % 2 && (e2 += n4), t = We3(t / 2), t && (n4 += n4);
        while (t);
        return e2;
      }
      function L5(n4, t) {
        return Pi(Du(n4, t, fn2), n4 + "");
      }
      function $c(n4) {
        return Ms2(Gt3(n4));
      }
      function Uc(n4, t) {
        var e2 = Gt3(n4);
        return tr3(e2, vt3(t, 0, e2.length));
      }
      function fe5(n4, t, e2, r2) {
        if (!K3(n4)) return n4;
        t = st2(t, n4);
        for (var s2 = -1, o3 = t.length, f5 = o3 - 1, c5 = n4; c5 != null && ++s2 < o3; ) {
          var l4 = Wn2(t[s2]), v5 = e2;
          if (l4 === "__proto__" || l4 === "constructor" || l4 === "prototype") return n4;
          if (s2 != f5) {
            var _6 = c5[l4];
            v5 = r2 ? r2(_6, l4, c5) : i3, v5 === i3 && (v5 = K3(_6) ? _6 : Zn(t[s2 + 1]) ? [] : {});
          }
          se(c5, l4, v5), c5 = c5[l4];
        }
        return n4;
      }
      var iu = Fe3 ? function(n4, t) {
        return Fe3.set(n4, t), n4;
      } : fn2, Wc = $e3 ? function(n4, t) {
        return $e3(n4, "toString", { configurable: true, enumerable: false, value: bi(t), writable: true });
      } : fn2;
      function Fc(n4) {
        return tr3(Gt3(n4));
      }
      function Cn(n4, t, e2) {
        var r2 = -1, s2 = n4.length;
        t < 0 && (t = -t > s2 ? 0 : s2 + t), e2 = e2 > s2 ? s2 : e2, e2 < 0 && (e2 += s2), s2 = t > e2 ? 0 : e2 - t >>> 0, t >>>= 0;
        for (var o3 = p7(s2); ++r2 < s2; ) o3[r2] = n4[r2 + t];
        return o3;
      }
      function Mc(n4, t) {
        var e2;
        return rt3(n4, function(r2, s2, o3) {
          return e2 = t(r2, s2, o3), !e2;
        }), !!e2;
      }
      function Ye3(n4, t, e2) {
        var r2 = 0, s2 = n4 == null ? r2 : n4.length;
        if (typeof t == "number" && t === t && s2 <= Ma) {
          for (; r2 < s2; ) {
            var o3 = r2 + s2 >>> 1, f5 = n4[o3];
            f5 !== null && !pn2(f5) && (e2 ? f5 <= t : f5 < t) ? r2 = o3 + 1 : s2 = o3;
          }
          return s2;
        }
        return ii(n4, t, fn2, e2);
      }
      function ii(n4, t, e2, r2) {
        var s2 = 0, o3 = n4 == null ? 0 : n4.length;
        if (o3 === 0) return 0;
        t = e2(t);
        for (var f5 = t !== t, c5 = t === null, l4 = pn2(t), v5 = t === i3; s2 < o3; ) {
          var _6 = We3((s2 + o3) / 2), m5 = e2(n4[_6]), P4 = m5 !== i3, I2 = m5 === null, E6 = m5 === m5, b6 = pn2(m5);
          if (f5) var y7 = r2 || E6;
          else v5 ? y7 = E6 && (r2 || P4) : c5 ? y7 = E6 && P4 && (r2 || !I2) : l4 ? y7 = E6 && P4 && !I2 && (r2 || !b6) : I2 || b6 ? y7 = false : y7 = r2 ? m5 <= t : m5 < t;
          y7 ? s2 = _6 + 1 : o3 = _6;
        }
        return nn3(o3, Fa);
      }
      function su(n4, t) {
        for (var e2 = -1, r2 = n4.length, s2 = 0, o3 = []; ++e2 < r2; ) {
          var f5 = n4[e2], c5 = t ? t(f5) : f5;
          if (!e2 || !bn(c5, l4)) {
            var l4 = c5;
            o3[s2++] = f5 === 0 ? 0 : f5;
          }
        }
        return o3;
      }
      function uu(n4) {
        return typeof n4 == "number" ? n4 : pn2(n4) ? _e3 : +n4;
      }
      function ln2(n4) {
        if (typeof n4 == "string") return n4;
        if (O7(n4)) return G5(n4, ln2) + "";
        if (pn2(n4)) return Ws2 ? Ws2.call(n4) : "";
        var t = n4 + "";
        return t == "0" && 1 / n4 == -ht3 ? "-0" : t;
      }
      function it2(n4, t, e2) {
        var r2 = -1, s2 = Ee, o3 = n4.length, f5 = true, c5 = [], l4 = c5;
        if (e2) f5 = false, s2 = Dr;
        else if (o3 >= w7) {
          var v5 = t ? null : Vc(n4);
          if (v5) return Se2(v5);
          f5 = false, s2 = jt3, l4 = new gt3();
        } else l4 = t ? [] : c5;
        n: for (; ++r2 < o3; ) {
          var _6 = n4[r2], m5 = t ? t(_6) : _6;
          if (_6 = e2 || _6 !== 0 ? _6 : 0, f5 && m5 === m5) {
            for (var P4 = l4.length; P4--; ) if (l4[P4] === m5) continue n;
            t && l4.push(m5), c5.push(_6);
          } else s2(l4, m5, e2) || (l4 !== c5 && l4.push(m5), c5.push(_6));
        }
        return c5;
      }
      function si(n4, t) {
        return t = st2(t, n4), n4 = Hu(n4, t), n4 == null || delete n4[Wn2(In5(t))];
      }
      function au(n4, t, e2, r2) {
        return fe5(n4, t, e2(_t2(n4, t)), r2);
      }
      function Ze3(n4, t, e2, r2) {
        for (var s2 = n4.length, o3 = r2 ? s2 : -1; (r2 ? o3-- : ++o3 < s2) && t(n4[o3], o3, n4); ) ;
        return e2 ? Cn(n4, r2 ? 0 : o3, r2 ? o3 + 1 : s2) : Cn(n4, r2 ? o3 + 1 : 0, r2 ? s2 : o3);
      }
      function ou(n4, t) {
        var e2 = n4;
        return e2 instanceof H4 && (e2 = e2.value()), Hr(t, function(r2, s2) {
          return s2.func.apply(s2.thisArg, nt2([r2], s2.args));
        }, e2);
      }
      function ui(n4, t, e2) {
        var r2 = n4.length;
        if (r2 < 2) return r2 ? it2(n4[0]) : [];
        for (var s2 = -1, o3 = p7(r2); ++s2 < r2; ) for (var f5 = n4[s2], c5 = -1; ++c5 < r2; ) c5 != s2 && (o3[s2] = ue6(o3[s2] || f5, n4[c5], t, e2));
        return it2(j4(o3, 1), t, e2);
      }
      function fu(n4, t, e2) {
        for (var r2 = -1, s2 = n4.length, o3 = t.length, f5 = {}; ++r2 < s2; ) {
          var c5 = r2 < o3 ? t[r2] : i3;
          e2(f5, n4[r2], c5);
        }
        return f5;
      }
      function ai(n4) {
        return Z3(n4) ? n4 : [];
      }
      function oi(n4) {
        return typeof n4 == "function" ? n4 : fn2;
      }
      function st2(n4, t) {
        return O7(n4) ? n4 : _i(n4, t) ? [n4] : Wu(W7(n4));
      }
      var qc = L5;
      function ut3(n4, t, e2) {
        var r2 = n4.length;
        return e2 = e2 === i3 ? r2 : e2, !t && e2 >= r2 ? n4 : Cn(n4, t, e2);
      }
      var cu = Of || function(n4) {
        return k7.clearTimeout(n4);
      };
      function hu(n4, t) {
        if (t) return n4.slice();
        var e2 = n4.length, r2 = Ls2 ? Ls2(e2) : new n4.constructor(e2);
        return n4.copy(r2), r2;
      }
      function fi(n4) {
        var t = new n4.constructor(n4.byteLength);
        return new De3(t).set(new De3(n4)), t;
      }
      function Bc(n4, t) {
        var e2 = t ? fi(n4.buffer) : n4.buffer;
        return new n4.constructor(e2, n4.byteOffset, n4.byteLength);
      }
      function Gc(n4) {
        var t = new n4.constructor(n4.source, Ji2.exec(n4));
        return t.lastIndex = n4.lastIndex, t;
      }
      function zc(n4) {
        return ie3 ? M7(ie3.call(n4)) : {};
      }
      function lu(n4, t) {
        var e2 = t ? fi(n4.buffer) : n4.buffer;
        return new n4.constructor(e2, n4.byteOffset, n4.length);
      }
      function pu(n4, t) {
        if (n4 !== t) {
          var e2 = n4 !== i3, r2 = n4 === null, s2 = n4 === n4, o3 = pn2(n4), f5 = t !== i3, c5 = t === null, l4 = t === t, v5 = pn2(t);
          if (!c5 && !v5 && !o3 && n4 > t || o3 && f5 && l4 && !c5 && !v5 || r2 && f5 && l4 || !e2 && l4 || !s2) return 1;
          if (!r2 && !o3 && !v5 && n4 < t || v5 && e2 && s2 && !r2 && !o3 || c5 && e2 && s2 || !f5 && s2 || !l4) return -1;
        }
        return 0;
      }
      function Kc(n4, t, e2) {
        for (var r2 = -1, s2 = n4.criteria, o3 = t.criteria, f5 = s2.length, c5 = e2.length; ++r2 < f5; ) {
          var l4 = pu(s2[r2], o3[r2]);
          if (l4) {
            if (r2 >= c5) return l4;
            var v5 = e2[r2];
            return l4 * (v5 == "desc" ? -1 : 1);
          }
        }
        return n4.index - t.index;
      }
      function du(n4, t, e2, r2) {
        for (var s2 = -1, o3 = n4.length, f5 = e2.length, c5 = -1, l4 = t.length, v5 = Q5(o3 - f5, 0), _6 = p7(l4 + v5), m5 = !r2; ++c5 < l4; ) _6[c5] = t[c5];
        for (; ++s2 < f5; ) (m5 || s2 < o3) && (_6[e2[s2]] = n4[s2]);
        for (; v5--; ) _6[c5++] = n4[s2++];
        return _6;
      }
      function gu(n4, t, e2, r2) {
        for (var s2 = -1, o3 = n4.length, f5 = -1, c5 = e2.length, l4 = -1, v5 = t.length, _6 = Q5(o3 - c5, 0), m5 = p7(_6 + v5), P4 = !r2; ++s2 < _6; ) m5[s2] = n4[s2];
        for (var I2 = s2; ++l4 < v5; ) m5[I2 + l4] = t[l4];
        for (; ++f5 < c5; ) (P4 || s2 < o3) && (m5[I2 + e2[f5]] = n4[s2++]);
        return m5;
      }
      function un2(n4, t) {
        var e2 = -1, r2 = n4.length;
        for (t || (t = p7(r2)); ++e2 < r2; ) t[e2] = n4[e2];
        return t;
      }
      function Un2(n4, t, e2, r2) {
        var s2 = !e2;
        e2 || (e2 = {});
        for (var o3 = -1, f5 = t.length; ++o3 < f5; ) {
          var c5 = t[o3], l4 = r2 ? r2(e2[c5], n4[c5], c5, e2, n4) : i3;
          l4 === i3 && (l4 = n4[c5]), s2 ? zn(e2, c5, l4) : se(e2, c5, l4);
        }
        return e2;
      }
      function Yc(n4, t) {
        return Un2(n4, vi(n4), t);
      }
      function Zc(n4, t) {
        return Un2(n4, Ou(n4), t);
      }
      function Je4(n4, t) {
        return function(e2, r2) {
          var s2 = O7(e2) ? Vo : gc, o3 = t ? t() : {};
          return s2(e2, n4, x3(r2, 2), o3);
        };
      }
      function Ft3(n4) {
        return L5(function(t, e2) {
          var r2 = -1, s2 = e2.length, o3 = s2 > 1 ? e2[s2 - 1] : i3, f5 = s2 > 2 ? e2[2] : i3;
          for (o3 = n4.length > 3 && typeof o3 == "function" ? (s2--, o3) : i3, f5 && rn2(e2[0], e2[1], f5) && (o3 = s2 < 3 ? i3 : o3, s2 = 1), t = M7(t); ++r2 < s2; ) {
            var c5 = e2[r2];
            c5 && n4(t, c5, r2, o3);
          }
          return t;
        });
      }
      function vu(n4, t) {
        return function(e2, r2) {
          if (e2 == null) return e2;
          if (!an2(e2)) return n4(e2, r2);
          for (var s2 = e2.length, o3 = t ? s2 : -1, f5 = M7(e2); (t ? o3-- : ++o3 < s2) && r2(f5[o3], o3, f5) !== false; ) ;
          return e2;
        };
      }
      function _u(n4) {
        return function(t, e2, r2) {
          for (var s2 = -1, o3 = M7(t), f5 = r2(t), c5 = f5.length; c5--; ) {
            var l4 = f5[n4 ? c5 : ++s2];
            if (e2(o3[l4], l4, o3) === false) break;
          }
          return t;
        };
      }
      function Jc(n4, t, e2) {
        var r2 = t & vn, s2 = ce4(n4);
        function o3() {
          var f5 = this && this !== k7 && this instanceof o3 ? s2 : n4;
          return f5.apply(r2 ? e2 : this, arguments);
        }
        return o3;
      }
      function mu(n4) {
        return function(t) {
          t = W7(t);
          var e2 = Lt3(t) ? On5(t) : i3, r2 = e2 ? e2[0] : t.charAt(0), s2 = e2 ? ut3(e2, 1).join("") : t.slice(1);
          return r2[n4]() + s2;
        };
      }
      function Mt3(n4) {
        return function(t) {
          return Hr(va(ga(t).replace(Uo, "")), n4, "");
        };
      }
      function ce4(n4) {
        return function() {
          var t = arguments;
          switch (t.length) {
            case 0:
              return new n4();
            case 1:
              return new n4(t[0]);
            case 2:
              return new n4(t[0], t[1]);
            case 3:
              return new n4(t[0], t[1], t[2]);
            case 4:
              return new n4(t[0], t[1], t[2], t[3]);
            case 5:
              return new n4(t[0], t[1], t[2], t[3], t[4]);
            case 6:
              return new n4(t[0], t[1], t[2], t[3], t[4], t[5]);
            case 7:
              return new n4(t[0], t[1], t[2], t[3], t[4], t[5], t[6]);
          }
          var e2 = Wt2(n4.prototype), r2 = n4.apply(e2, t);
          return K3(r2) ? r2 : e2;
        };
      }
      function Xc(n4, t, e2) {
        var r2 = ce4(n4);
        function s2() {
          for (var o3 = arguments.length, f5 = p7(o3), c5 = o3, l4 = qt3(s2); c5--; ) f5[c5] = arguments[c5];
          var v5 = o3 < 3 && f5[0] !== l4 && f5[o3 - 1] !== l4 ? [] : tt2(f5, l4);
          if (o3 -= v5.length, o3 < e2) return Iu(n4, t, Xe4, s2.placeholder, i3, f5, v5, i3, i3, e2 - o3);
          var _6 = this && this !== k7 && this instanceof s2 ? r2 : n4;
          return cn2(_6, this, f5);
        }
        return s2;
      }
      function wu(n4) {
        return function(t, e2, r2) {
          var s2 = M7(t);
          if (!an2(t)) {
            var o3 = x3(e2, 3);
            t = V4(t), e2 = function(c5) {
              return o3(s2[c5], c5, s2);
            };
          }
          var f5 = n4(t, e2, r2);
          return f5 > -1 ? s2[o3 ? t[f5] : f5] : i3;
        };
      }
      function Pu(n4) {
        return Yn(function(t) {
          var e2 = t.length, r2 = e2, s2 = Pn5.prototype.thru;
          for (n4 && t.reverse(); r2--; ) {
            var o3 = t[r2];
            if (typeof o3 != "function") throw new wn5($4);
            if (s2 && !f5 && je3(o3) == "wrapper") var f5 = new Pn5([], true);
          }
          for (r2 = f5 ? r2 : e2; ++r2 < e2; ) {
            o3 = t[r2];
            var c5 = je3(o3), l4 = c5 == "wrapper" ? di(o3) : i3;
            l4 && mi(l4[0]) && l4[1] == (Mn2 | Dn2 | Hn2 | Kt3) && !l4[4].length && l4[9] == 1 ? f5 = f5[je3(l4[0])].apply(f5, l4[3]) : f5 = o3.length == 1 && mi(o3) ? f5[c5]() : f5.thru(o3);
          }
          return function() {
            var v5 = arguments, _6 = v5[0];
            if (f5 && v5.length == 1 && O7(_6)) return f5.plant(_6).value();
            for (var m5 = 0, P4 = e2 ? t[m5].apply(this, v5) : _6; ++m5 < e2; ) P4 = t[m5].call(this, P4);
            return P4;
          };
        });
      }
      function Xe4(n4, t, e2, r2, s2, o3, f5, c5, l4, v5) {
        var _6 = t & Mn2, m5 = t & vn, P4 = t & ct2, I2 = t & (Dn2 | yt4), E6 = t & dr2, b6 = P4 ? i3 : ce4(n4);
        function y7() {
          for (var D6 = arguments.length, N6 = p7(D6), dn2 = D6; dn2--; ) N6[dn2] = arguments[dn2];
          if (I2) var sn2 = qt3(y7), gn2 = af(N6, sn2);
          if (r2 && (N6 = du(N6, r2, s2, I2)), o3 && (N6 = gu(N6, o3, f5, I2)), D6 -= gn2, I2 && D6 < v5) {
            var J2 = tt2(N6, sn2);
            return Iu(n4, t, Xe4, y7.placeholder, e2, N6, J2, c5, l4, v5 - D6);
          }
          var Tn = m5 ? e2 : this, Qn2 = P4 ? Tn[n4] : n4;
          return D6 = N6.length, c5 ? N6 = gh(N6, c5) : E6 && D6 > 1 && N6.reverse(), _6 && l4 < D6 && (N6.length = l4), this && this !== k7 && this instanceof y7 && (Qn2 = b6 || ce4(Qn2)), Qn2.apply(Tn, N6);
        }
        return y7;
      }
      function Au(n4, t) {
        return function(e2, r2) {
          return Ic(e2, n4, t(r2), {});
        };
      }
      function Qe3(n4, t) {
        return function(e2, r2) {
          var s2;
          if (e2 === i3 && r2 === i3) return t;
          if (e2 !== i3 && (s2 = e2), r2 !== i3) {
            if (s2 === i3) return r2;
            typeof e2 == "string" || typeof r2 == "string" ? (e2 = ln2(e2), r2 = ln2(r2)) : (e2 = uu(e2), r2 = uu(r2)), s2 = n4(e2, r2);
          }
          return s2;
        };
      }
      function ci(n4) {
        return Yn(function(t) {
          return t = G5(t, hn2(x3())), L5(function(e2) {
            var r2 = this;
            return n4(t, function(s2) {
              return cn2(s2, r2, e2);
            });
          });
        });
      }
      function Ve3(n4, t) {
        t = t === i3 ? " " : ln2(t);
        var e2 = t.length;
        if (e2 < 2) return e2 ? ri(t, n4) : t;
        var r2 = ri(t, Ue3(n4 / Dt3(t)));
        return Lt3(t) ? ut3(On5(r2), 0, n4).join("") : r2.slice(0, n4);
      }
      function Qc(n4, t, e2, r2) {
        var s2 = t & vn, o3 = ce4(n4);
        function f5() {
          for (var c5 = -1, l4 = arguments.length, v5 = -1, _6 = r2.length, m5 = p7(_6 + l4), P4 = this && this !== k7 && this instanceof f5 ? o3 : n4; ++v5 < _6; ) m5[v5] = r2[v5];
          for (; l4--; ) m5[v5++] = arguments[++c5];
          return cn2(P4, s2 ? e2 : this, m5);
        }
        return f5;
      }
      function Cu(n4) {
        return function(t, e2, r2) {
          return r2 && typeof r2 != "number" && rn2(t, e2, r2) && (e2 = r2 = i3), t = Xn2(t), e2 === i3 ? (e2 = t, t = 0) : e2 = Xn2(e2), r2 = r2 === i3 ? t < e2 ? 1 : -1 : Xn2(r2), Nc(t, e2, r2, n4);
        };
      }
      function ke3(n4) {
        return function(t, e2) {
          return typeof t == "string" && typeof e2 == "string" || (t = xn2(t), e2 = xn2(e2)), n4(t, e2);
        };
      }
      function Iu(n4, t, e2, r2, s2, o3, f5, c5, l4, v5) {
        var _6 = t & Dn2, m5 = _6 ? f5 : i3, P4 = _6 ? i3 : f5, I2 = _6 ? o3 : i3, E6 = _6 ? i3 : o3;
        t |= _6 ? Hn2 : St3, t &= ~(_6 ? St3 : Hn2), t & qi2 || (t &= ~(vn | ct2));
        var b6 = [n4, t, s2, I2, m5, E6, P4, c5, l4, v5], y7 = e2.apply(i3, b6);
        return mi(n4) && Nu(y7, b6), y7.placeholder = r2, $u(y7, n4, t);
      }
      function hi(n4) {
        var t = X4[n4];
        return function(e2, r2) {
          if (e2 = xn2(e2), r2 = r2 == null ? 0 : nn3(R2(r2), 292), r2 && $s2(e2)) {
            var s2 = (W7(e2) + "e").split("e"), o3 = t(s2[0] + "e" + (+s2[1] + r2));
            return s2 = (W7(o3) + "e").split("e"), +(s2[0] + "e" + (+s2[1] - r2));
          }
          return t(e2);
        };
      }
      var Vc = $t2 && 1 / Se2(new $t2([, -0]))[1] == ht3 ? function(n4) {
        return new $t2(n4);
      } : Di;
      function xu(n4) {
        return function(t) {
          var e2 = tn2(t);
          return e2 == yn2 ? qr(t) : e2 == Sn ? df(t) : uf(t, n4(t));
        };
      }
      function Kn2(n4, t, e2, r2, s2, o3, f5, c5) {
        var l4 = t & ct2;
        if (!l4 && typeof n4 != "function") throw new wn5($4);
        var v5 = r2 ? r2.length : 0;
        if (v5 || (t &= ~(Hn2 | St3), r2 = s2 = i3), f5 = f5 === i3 ? f5 : Q5(R2(f5), 0), c5 = c5 === i3 ? c5 : R2(c5), v5 -= s2 ? s2.length : 0, t & St3) {
          var _6 = r2, m5 = s2;
          r2 = s2 = i3;
        }
        var P4 = l4 ? i3 : di(n4), I2 = [n4, t, e2, r2, s2, _6, m5, o3, f5, c5];
        if (P4 && lh(I2, P4), n4 = I2[0], t = I2[1], e2 = I2[2], r2 = I2[3], s2 = I2[4], c5 = I2[9] = I2[9] === i3 ? l4 ? 0 : n4.length : Q5(I2[9] - v5, 0), !c5 && t & (Dn2 | yt4) && (t &= ~(Dn2 | yt4)), !t || t == vn) var E6 = Jc(n4, t, e2);
        else t == Dn2 || t == yt4 ? E6 = Xc(n4, t, c5) : (t == Hn2 || t == (vn | Hn2)) && !s2.length ? E6 = Qc(n4, t, e2, r2) : E6 = Xe4.apply(i3, I2);
        var b6 = P4 ? iu : Nu;
        return $u(b6(E6, I2), n4, t);
      }
      function Eu(n4, t, e2, r2) {
        return n4 === i3 || bn(n4, Nt3[e2]) && !F4.call(r2, e2) ? t : n4;
      }
      function yu(n4, t, e2, r2, s2, o3) {
        return K3(n4) && K3(t) && (o3.set(t, n4), Ke2(n4, t, i3, yu, o3), o3.delete(t)), n4;
      }
      function kc(n4) {
        return pe3(n4) ? i3 : n4;
      }
      function Su(n4, t, e2, r2, s2, o3) {
        var f5 = e2 & Et3, c5 = n4.length, l4 = t.length;
        if (c5 != l4 && !(f5 && l4 > c5)) return false;
        var v5 = o3.get(n4), _6 = o3.get(t);
        if (v5 && _6) return v5 == t && _6 == n4;
        var m5 = -1, P4 = true, I2 = e2 & ve ? new gt3() : i3;
        for (o3.set(n4, t), o3.set(t, n4); ++m5 < c5; ) {
          var E6 = n4[m5], b6 = t[m5];
          if (r2) var y7 = f5 ? r2(b6, E6, m5, t, n4, o3) : r2(E6, b6, m5, n4, t, o3);
          if (y7 !== i3) {
            if (y7) continue;
            P4 = false;
            break;
          }
          if (I2) {
            if (!Nr2(t, function(D6, N6) {
              if (!jt3(I2, N6) && (E6 === D6 || s2(E6, D6, e2, r2, o3))) return I2.push(N6);
            })) {
              P4 = false;
              break;
            }
          } else if (!(E6 === b6 || s2(E6, b6, e2, r2, o3))) {
            P4 = false;
            break;
          }
        }
        return o3.delete(n4), o3.delete(t), P4;
      }
      function jc(n4, t, e2, r2, s2, o3, f5) {
        switch (e2) {
          case Rt2:
            if (n4.byteLength != t.byteLength || n4.byteOffset != t.byteOffset) return false;
            n4 = n4.buffer, t = t.buffer;
          case kt3:
            return !(n4.byteLength != t.byteLength || !o3(new De3(n4), new De3(t)));
          case Yt3:
          case Zt2:
          case Jt3:
            return bn(+n4, +t);
          case we:
            return n4.name == t.name && n4.message == t.message;
          case Xt2:
          case Qt2:
            return n4 == t + "";
          case yn2:
            var c5 = qr;
          case Sn:
            var l4 = r2 & Et3;
            if (c5 || (c5 = Se2), n4.size != t.size && !l4) return false;
            var v5 = f5.get(n4);
            if (v5) return v5 == t;
            r2 |= ve, f5.set(n4, t);
            var _6 = Su(c5(n4), c5(t), r2, s2, o3, f5);
            return f5.delete(n4), _6;
          case Ae2:
            if (ie3) return ie3.call(n4) == ie3.call(t);
        }
        return false;
      }
      function nh(n4, t, e2, r2, s2, o3) {
        var f5 = e2 & Et3, c5 = li(n4), l4 = c5.length, v5 = li(t), _6 = v5.length;
        if (l4 != _6 && !f5) return false;
        for (var m5 = l4; m5--; ) {
          var P4 = c5[m5];
          if (!(f5 ? P4 in t : F4.call(t, P4))) return false;
        }
        var I2 = o3.get(n4), E6 = o3.get(t);
        if (I2 && E6) return I2 == t && E6 == n4;
        var b6 = true;
        o3.set(n4, t), o3.set(t, n4);
        for (var y7 = f5; ++m5 < l4; ) {
          P4 = c5[m5];
          var D6 = n4[P4], N6 = t[P4];
          if (r2) var dn2 = f5 ? r2(N6, D6, P4, t, n4, o3) : r2(D6, N6, P4, n4, t, o3);
          if (!(dn2 === i3 ? D6 === N6 || s2(D6, N6, e2, r2, o3) : dn2)) {
            b6 = false;
            break;
          }
          y7 || (y7 = P4 == "constructor");
        }
        if (b6 && !y7) {
          var sn2 = n4.constructor, gn2 = t.constructor;
          sn2 != gn2 && "constructor" in n4 && "constructor" in t && !(typeof sn2 == "function" && sn2 instanceof sn2 && typeof gn2 == "function" && gn2 instanceof gn2) && (b6 = false);
        }
        return o3.delete(n4), o3.delete(t), b6;
      }
      function Yn(n4) {
        return Pi(Du(n4, i3, Bu), n4 + "");
      }
      function li(n4) {
        return Zs2(n4, V4, vi);
      }
      function pi(n4) {
        return Zs2(n4, on2, Ou);
      }
      var di = Fe3 ? function(n4) {
        return Fe3.get(n4);
      } : Di;
      function je3(n4) {
        for (var t = n4.name + "", e2 = Ut2[t], r2 = F4.call(Ut2, t) ? e2.length : 0; r2--; ) {
          var s2 = e2[r2], o3 = s2.func;
          if (o3 == null || o3 == n4) return s2.name;
        }
        return t;
      }
      function qt3(n4) {
        var t = F4.call(a3, "placeholder") ? a3 : n4;
        return t.placeholder;
      }
      function x3() {
        var n4 = a3.iteratee || Ti;
        return n4 = n4 === Ti ? Qs2 : n4, arguments.length ? n4(arguments[0], arguments[1]) : n4;
      }
      function nr3(n4, t) {
        var e2 = n4.__data__;
        return oh(t) ? e2[typeof t == "string" ? "string" : "hash"] : e2.map;
      }
      function gi(n4) {
        for (var t = V4(n4), e2 = t.length; e2--; ) {
          var r2 = t[e2], s2 = n4[r2];
          t[e2] = [r2, s2, Tu(s2)];
        }
        return t;
      }
      function mt4(n4, t) {
        var e2 = hf(n4, t);
        return Xs2(e2) ? e2 : i3;
      }
      function th(n4) {
        var t = F4.call(n4, pt4), e2 = n4[pt4];
        try {
          n4[pt4] = i3;
          var r2 = true;
        } catch {
        }
        var s2 = Te3.call(n4);
        return r2 && (t ? n4[pt4] = e2 : delete n4[pt4]), s2;
      }
      var vi = Gr ? function(n4) {
        return n4 == null ? [] : (n4 = M7(n4), jn(Gr(n4), function(t) {
          return Hs2.call(n4, t);
        }));
      } : Hi2, Ou = Gr ? function(n4) {
        for (var t = []; n4; ) nt2(t, vi(n4)), n4 = He3(n4);
        return t;
      } : Hi2, tn2 = en5;
      (zr2 && tn2(new zr2(new ArrayBuffer(1))) != Rt2 || te5 && tn2(new te5()) != yn2 || Kr && tn2(Kr.resolve()) != zi || $t2 && tn2(new $t2()) != Sn || ee3 && tn2(new ee3()) != Vt3) && (tn2 = function(n4) {
        var t = en5(n4), e2 = t == qn2 ? n4.constructor : i3, r2 = e2 ? wt3(e2) : "";
        if (r2) switch (r2) {
          case Uf:
            return Rt2;
          case Wf:
            return yn2;
          case Ff:
            return zi;
          case Mf:
            return Sn;
          case qf:
            return Vt3;
        }
        return t;
      });
      function eh(n4, t, e2) {
        for (var r2 = -1, s2 = e2.length; ++r2 < s2; ) {
          var o3 = e2[r2], f5 = o3.size;
          switch (o3.type) {
            case "drop":
              n4 += f5;
              break;
            case "dropRight":
              t -= f5;
              break;
            case "take":
              t = nn3(t, n4 + f5);
              break;
            case "takeRight":
              n4 = Q5(n4, t - f5);
              break;
          }
        }
        return { start: n4, end: t };
      }
      function rh(n4) {
        var t = n4.match(ao);
        return t ? t[1].split(oo) : [];
      }
      function Ru(n4, t, e2) {
        t = st2(t, n4);
        for (var r2 = -1, s2 = t.length, o3 = false; ++r2 < s2; ) {
          var f5 = Wn2(t[r2]);
          if (!(o3 = n4 != null && e2(n4, f5))) break;
          n4 = n4[f5];
        }
        return o3 || ++r2 != s2 ? o3 : (s2 = n4 == null ? 0 : n4.length, !!s2 && ar2(s2) && Zn(f5, s2) && (O7(n4) || Pt2(n4)));
      }
      function ih(n4) {
        var t = n4.length, e2 = new n4.constructor(t);
        return t && typeof n4[0] == "string" && F4.call(n4, "index") && (e2.index = n4.index, e2.input = n4.input), e2;
      }
      function bu(n4) {
        return typeof n4.constructor == "function" && !he7(n4) ? Wt2(He3(n4)) : {};
      }
      function sh(n4, t, e2) {
        var r2 = n4.constructor;
        switch (t) {
          case kt3:
            return fi(n4);
          case Yt3:
          case Zt2:
            return new r2(+n4);
          case Rt2:
            return Bc(n4, e2);
          case gr:
          case vr2:
          case _r2:
          case mr2:
          case wr2:
          case Pr2:
          case Ar2:
          case Cr2:
          case Ir2:
            return lu(n4, e2);
          case yn2:
            return new r2();
          case Jt3:
          case Qt2:
            return new r2(n4);
          case Xt2:
            return Gc(n4);
          case Sn:
            return new r2();
          case Ae2:
            return zc(n4);
        }
      }
      function uh(n4, t) {
        var e2 = t.length;
        if (!e2) return n4;
        var r2 = e2 - 1;
        return t[r2] = (e2 > 1 ? "& " : "") + t[r2], t = t.join(e2 > 2 ? ", " : " "), n4.replace(uo, `{
/* [wrapped with ` + t + `] */
`);
      }
      function ah(n4) {
        return O7(n4) || Pt2(n4) || !!(Ns2 && n4 && n4[Ns2]);
      }
      function Zn(n4, t) {
        var e2 = typeof n4;
        return t = t ?? kn2, !!t && (e2 == "number" || e2 != "symbol" && mo.test(n4)) && n4 > -1 && n4 % 1 == 0 && n4 < t;
      }
      function rn2(n4, t, e2) {
        if (!K3(e2)) return false;
        var r2 = typeof t;
        return (r2 == "number" ? an2(e2) && Zn(t, e2.length) : r2 == "string" && t in e2) ? bn(e2[t], n4) : false;
      }
      function _i(n4, t) {
        if (O7(n4)) return false;
        var e2 = typeof n4;
        return e2 == "number" || e2 == "symbol" || e2 == "boolean" || n4 == null || pn2(n4) ? true : eo.test(n4) || !to.test(n4) || t != null && n4 in M7(t);
      }
      function oh(n4) {
        var t = typeof n4;
        return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? n4 !== "__proto__" : n4 === null;
      }
      function mi(n4) {
        var t = je3(n4), e2 = a3[t];
        if (typeof e2 != "function" || !(t in H4.prototype)) return false;
        if (n4 === e2) return true;
        var r2 = di(e2);
        return !!r2 && n4 === r2[0];
      }
      function fh(n4) {
        return !!Ts2 && Ts2 in n4;
      }
      var ch = Re3 ? Jn2 : Ni2;
      function he7(n4) {
        var t = n4 && n4.constructor, e2 = typeof t == "function" && t.prototype || Nt3;
        return n4 === e2;
      }
      function Tu(n4) {
        return n4 === n4 && !K3(n4);
      }
      function Lu(n4, t) {
        return function(e2) {
          return e2 == null ? false : e2[n4] === t && (t !== i3 || n4 in M7(e2));
        };
      }
      function hh(n4) {
        var t = sr2(n4, function(r2) {
          return e2.size === pr && e2.clear(), r2;
        }), e2 = t.cache;
        return t;
      }
      function lh(n4, t) {
        var e2 = n4[1], r2 = t[1], s2 = e2 | r2, o3 = s2 < (vn | ct2 | Mn2), f5 = r2 == Mn2 && e2 == Dn2 || r2 == Mn2 && e2 == Kt3 && n4[7].length <= t[8] || r2 == (Mn2 | Kt3) && t[7].length <= t[8] && e2 == Dn2;
        if (!(o3 || f5)) return n4;
        r2 & vn && (n4[2] = t[2], s2 |= e2 & vn ? 0 : qi2);
        var c5 = t[3];
        if (c5) {
          var l4 = n4[3];
          n4[3] = l4 ? du(l4, c5, t[4]) : c5, n4[4] = l4 ? tt2(n4[3], It3) : t[4];
        }
        return c5 = t[5], c5 && (l4 = n4[5], n4[5] = l4 ? gu(l4, c5, t[6]) : c5, n4[6] = l4 ? tt2(n4[5], It3) : t[6]), c5 = t[7], c5 && (n4[7] = c5), r2 & Mn2 && (n4[8] = n4[8] == null ? t[8] : nn3(n4[8], t[8])), n4[9] == null && (n4[9] = t[9]), n4[0] = t[0], n4[1] = s2, n4;
      }
      function ph(n4) {
        var t = [];
        if (n4 != null) for (var e2 in M7(n4)) t.push(e2);
        return t;
      }
      function dh(n4) {
        return Te3.call(n4);
      }
      function Du(n4, t, e2) {
        return t = Q5(t === i3 ? n4.length - 1 : t, 0), function() {
          for (var r2 = arguments, s2 = -1, o3 = Q5(r2.length - t, 0), f5 = p7(o3); ++s2 < o3; ) f5[s2] = r2[t + s2];
          s2 = -1;
          for (var c5 = p7(t + 1); ++s2 < t; ) c5[s2] = r2[s2];
          return c5[t] = e2(f5), cn2(n4, this, c5);
        };
      }
      function Hu(n4, t) {
        return t.length < 2 ? n4 : _t2(n4, Cn(t, 0, -1));
      }
      function gh(n4, t) {
        for (var e2 = n4.length, r2 = nn3(t.length, e2), s2 = un2(n4); r2--; ) {
          var o3 = t[r2];
          n4[r2] = Zn(o3, e2) ? s2[o3] : i3;
        }
        return n4;
      }
      function wi(n4, t) {
        if (!(t === "constructor" && typeof n4[t] == "function") && t != "__proto__") return n4[t];
      }
      var Nu = Uu(iu), le7 = bf || function(n4, t) {
        return k7.setTimeout(n4, t);
      }, Pi = Uu(Wc);
      function $u(n4, t, e2) {
        var r2 = t + "";
        return Pi(n4, uh(r2, vh(rh(r2), e2)));
      }
      function Uu(n4) {
        var t = 0, e2 = 0;
        return function() {
          var r2 = Hf(), s2 = Na - (r2 - e2);
          if (e2 = r2, s2 > 0) {
            if (++t >= Ha) return arguments[0];
          } else t = 0;
          return n4.apply(i3, arguments);
        };
      }
      function tr3(n4, t) {
        var e2 = -1, r2 = n4.length, s2 = r2 - 1;
        for (t = t === i3 ? r2 : t; ++e2 < t; ) {
          var o3 = ei(e2, s2), f5 = n4[o3];
          n4[o3] = n4[e2], n4[e2] = f5;
        }
        return n4.length = t, n4;
      }
      var Wu = hh(function(n4) {
        var t = [];
        return n4.charCodeAt(0) === 46 && t.push(""), n4.replace(ro, function(e2, r2, s2, o3) {
          t.push(s2 ? o3.replace(ho, "$1") : r2 || e2);
        }), t;
      });
      function Wn2(n4) {
        if (typeof n4 == "string" || pn2(n4)) return n4;
        var t = n4 + "";
        return t == "0" && 1 / n4 == -ht3 ? "-0" : t;
      }
      function wt3(n4) {
        if (n4 != null) {
          try {
            return be.call(n4);
          } catch {
          }
          try {
            return n4 + "";
          } catch {
          }
        }
        return "";
      }
      function vh(n4, t) {
        return mn2(qa, function(e2) {
          var r2 = "_." + e2[0];
          t & e2[1] && !Ee(n4, r2) && n4.push(r2);
        }), n4.sort();
      }
      function Fu(n4) {
        if (n4 instanceof H4) return n4.clone();
        var t = new Pn5(n4.__wrapped__, n4.__chain__);
        return t.__actions__ = un2(n4.__actions__), t.__index__ = n4.__index__, t.__values__ = n4.__values__, t;
      }
      function _h(n4, t, e2) {
        (e2 ? rn2(n4, t, e2) : t === i3) ? t = 1 : t = Q5(R2(t), 0);
        var r2 = n4 == null ? 0 : n4.length;
        if (!r2 || t < 1) return [];
        for (var s2 = 0, o3 = 0, f5 = p7(Ue3(r2 / t)); s2 < r2; ) f5[o3++] = Cn(n4, s2, s2 += t);
        return f5;
      }
      function mh(n4) {
        for (var t = -1, e2 = n4 == null ? 0 : n4.length, r2 = 0, s2 = []; ++t < e2; ) {
          var o3 = n4[t];
          o3 && (s2[r2++] = o3);
        }
        return s2;
      }
      function wh() {
        var n4 = arguments.length;
        if (!n4) return [];
        for (var t = p7(n4 - 1), e2 = arguments[0], r2 = n4; r2--; ) t[r2 - 1] = arguments[r2];
        return nt2(O7(e2) ? un2(e2) : [e2], j4(t, 1));
      }
      var Ph = L5(function(n4, t) {
        return Z3(n4) ? ue6(n4, j4(t, 1, Z3, true)) : [];
      }), Ah = L5(function(n4, t) {
        var e2 = In5(t);
        return Z3(e2) && (e2 = i3), Z3(n4) ? ue6(n4, j4(t, 1, Z3, true), x3(e2, 2)) : [];
      }), Ch = L5(function(n4, t) {
        var e2 = In5(t);
        return Z3(e2) && (e2 = i3), Z3(n4) ? ue6(n4, j4(t, 1, Z3, true), i3, e2) : [];
      });
      function Ih(n4, t, e2) {
        var r2 = n4 == null ? 0 : n4.length;
        return r2 ? (t = e2 || t === i3 ? 1 : R2(t), Cn(n4, t < 0 ? 0 : t, r2)) : [];
      }
      function xh(n4, t, e2) {
        var r2 = n4 == null ? 0 : n4.length;
        return r2 ? (t = e2 || t === i3 ? 1 : R2(t), t = r2 - t, Cn(n4, 0, t < 0 ? 0 : t)) : [];
      }
      function Eh(n4, t) {
        return n4 && n4.length ? Ze3(n4, x3(t, 3), true, true) : [];
      }
      function yh(n4, t) {
        return n4 && n4.length ? Ze3(n4, x3(t, 3), true) : [];
      }
      function Sh(n4, t, e2, r2) {
        var s2 = n4 == null ? 0 : n4.length;
        return s2 ? (e2 && typeof e2 != "number" && rn2(n4, t, e2) && (e2 = 0, r2 = s2), wc(n4, t, e2, r2)) : [];
      }
      function Mu(n4, t, e2) {
        var r2 = n4 == null ? 0 : n4.length;
        if (!r2) return -1;
        var s2 = e2 == null ? 0 : R2(e2);
        return s2 < 0 && (s2 = Q5(r2 + s2, 0)), ye5(n4, x3(t, 3), s2);
      }
      function qu(n4, t, e2) {
        var r2 = n4 == null ? 0 : n4.length;
        if (!r2) return -1;
        var s2 = r2 - 1;
        return e2 !== i3 && (s2 = R2(e2), s2 = e2 < 0 ? Q5(r2 + s2, 0) : nn3(s2, r2 - 1)), ye5(n4, x3(t, 3), s2, true);
      }
      function Bu(n4) {
        var t = n4 == null ? 0 : n4.length;
        return t ? j4(n4, 1) : [];
      }
      function Oh(n4) {
        var t = n4 == null ? 0 : n4.length;
        return t ? j4(n4, ht3) : [];
      }
      function Rh(n4, t) {
        var e2 = n4 == null ? 0 : n4.length;
        return e2 ? (t = t === i3 ? 1 : R2(t), j4(n4, t)) : [];
      }
      function bh(n4) {
        for (var t = -1, e2 = n4 == null ? 0 : n4.length, r2 = {}; ++t < e2; ) {
          var s2 = n4[t];
          r2[s2[0]] = s2[1];
        }
        return r2;
      }
      function Gu(n4) {
        return n4 && n4.length ? n4[0] : i3;
      }
      function Th(n4, t, e2) {
        var r2 = n4 == null ? 0 : n4.length;
        if (!r2) return -1;
        var s2 = e2 == null ? 0 : R2(e2);
        return s2 < 0 && (s2 = Q5(r2 + s2, 0)), Tt2(n4, t, s2);
      }
      function Lh(n4) {
        var t = n4 == null ? 0 : n4.length;
        return t ? Cn(n4, 0, -1) : [];
      }
      var Dh = L5(function(n4) {
        var t = G5(n4, ai);
        return t.length && t[0] === n4[0] ? Vr(t) : [];
      }), Hh = L5(function(n4) {
        var t = In5(n4), e2 = G5(n4, ai);
        return t === In5(e2) ? t = i3 : e2.pop(), e2.length && e2[0] === n4[0] ? Vr(e2, x3(t, 2)) : [];
      }), Nh = L5(function(n4) {
        var t = In5(n4), e2 = G5(n4, ai);
        return t = typeof t == "function" ? t : i3, t && e2.pop(), e2.length && e2[0] === n4[0] ? Vr(e2, i3, t) : [];
      });
      function $h(n4, t) {
        return n4 == null ? "" : Lf.call(n4, t);
      }
      function In5(n4) {
        var t = n4 == null ? 0 : n4.length;
        return t ? n4[t - 1] : i3;
      }
      function Uh(n4, t, e2) {
        var r2 = n4 == null ? 0 : n4.length;
        if (!r2) return -1;
        var s2 = r2;
        return e2 !== i3 && (s2 = R2(e2), s2 = s2 < 0 ? Q5(r2 + s2, 0) : nn3(s2, r2 - 1)), t === t ? vf(n4, t, s2) : ye5(n4, Is2, s2, true);
      }
      function Wh(n4, t) {
        return n4 && n4.length ? nu(n4, R2(t)) : i3;
      }
      var Fh = L5(zu);
      function zu(n4, t) {
        return n4 && n4.length && t && t.length ? ti(n4, t) : n4;
      }
      function Mh(n4, t, e2) {
        return n4 && n4.length && t && t.length ? ti(n4, t, x3(e2, 2)) : n4;
      }
      function qh(n4, t, e2) {
        return n4 && n4.length && t && t.length ? ti(n4, t, i3, e2) : n4;
      }
      var Bh = Yn(function(n4, t) {
        var e2 = n4 == null ? 0 : n4.length, r2 = Zr(n4, t);
        return ru(n4, G5(t, function(s2) {
          return Zn(s2, e2) ? +s2 : s2;
        }).sort(pu)), r2;
      });
      function Gh(n4, t) {
        var e2 = [];
        if (!(n4 && n4.length)) return e2;
        var r2 = -1, s2 = [], o3 = n4.length;
        for (t = x3(t, 3); ++r2 < o3; ) {
          var f5 = n4[r2];
          t(f5, r2, n4) && (e2.push(f5), s2.push(r2));
        }
        return ru(n4, s2), e2;
      }
      function Ai(n4) {
        return n4 == null ? n4 : $f.call(n4);
      }
      function zh(n4, t, e2) {
        var r2 = n4 == null ? 0 : n4.length;
        return r2 ? (e2 && typeof e2 != "number" && rn2(n4, t, e2) ? (t = 0, e2 = r2) : (t = t == null ? 0 : R2(t), e2 = e2 === i3 ? r2 : R2(e2)), Cn(n4, t, e2)) : [];
      }
      function Kh(n4, t) {
        return Ye3(n4, t);
      }
      function Yh(n4, t, e2) {
        return ii(n4, t, x3(e2, 2));
      }
      function Zh(n4, t) {
        var e2 = n4 == null ? 0 : n4.length;
        if (e2) {
          var r2 = Ye3(n4, t);
          if (r2 < e2 && bn(n4[r2], t)) return r2;
        }
        return -1;
      }
      function Jh(n4, t) {
        return Ye3(n4, t, true);
      }
      function Xh(n4, t, e2) {
        return ii(n4, t, x3(e2, 2), true);
      }
      function Qh(n4, t) {
        var e2 = n4 == null ? 0 : n4.length;
        if (e2) {
          var r2 = Ye3(n4, t, true) - 1;
          if (bn(n4[r2], t)) return r2;
        }
        return -1;
      }
      function Vh(n4) {
        return n4 && n4.length ? su(n4) : [];
      }
      function kh(n4, t) {
        return n4 && n4.length ? su(n4, x3(t, 2)) : [];
      }
      function jh(n4) {
        var t = n4 == null ? 0 : n4.length;
        return t ? Cn(n4, 1, t) : [];
      }
      function nl(n4, t, e2) {
        return n4 && n4.length ? (t = e2 || t === i3 ? 1 : R2(t), Cn(n4, 0, t < 0 ? 0 : t)) : [];
      }
      function tl(n4, t, e2) {
        var r2 = n4 == null ? 0 : n4.length;
        return r2 ? (t = e2 || t === i3 ? 1 : R2(t), t = r2 - t, Cn(n4, t < 0 ? 0 : t, r2)) : [];
      }
      function el(n4, t) {
        return n4 && n4.length ? Ze3(n4, x3(t, 3), false, true) : [];
      }
      function rl(n4, t) {
        return n4 && n4.length ? Ze3(n4, x3(t, 3)) : [];
      }
      var il = L5(function(n4) {
        return it2(j4(n4, 1, Z3, true));
      }), sl = L5(function(n4) {
        var t = In5(n4);
        return Z3(t) && (t = i3), it2(j4(n4, 1, Z3, true), x3(t, 2));
      }), ul = L5(function(n4) {
        var t = In5(n4);
        return t = typeof t == "function" ? t : i3, it2(j4(n4, 1, Z3, true), i3, t);
      });
      function al(n4) {
        return n4 && n4.length ? it2(n4) : [];
      }
      function ol(n4, t) {
        return n4 && n4.length ? it2(n4, x3(t, 2)) : [];
      }
      function fl(n4, t) {
        return t = typeof t == "function" ? t : i3, n4 && n4.length ? it2(n4, i3, t) : [];
      }
      function Ci(n4) {
        if (!(n4 && n4.length)) return [];
        var t = 0;
        return n4 = jn(n4, function(e2) {
          if (Z3(e2)) return t = Q5(e2.length, t), true;
        }), Fr(t, function(e2) {
          return G5(n4, $r(e2));
        });
      }
      function Ku(n4, t) {
        if (!(n4 && n4.length)) return [];
        var e2 = Ci(n4);
        return t == null ? e2 : G5(e2, function(r2) {
          return cn2(t, i3, r2);
        });
      }
      var cl = L5(function(n4, t) {
        return Z3(n4) ? ue6(n4, t) : [];
      }), hl = L5(function(n4) {
        return ui(jn(n4, Z3));
      }), ll = L5(function(n4) {
        var t = In5(n4);
        return Z3(t) && (t = i3), ui(jn(n4, Z3), x3(t, 2));
      }), pl = L5(function(n4) {
        var t = In5(n4);
        return t = typeof t == "function" ? t : i3, ui(jn(n4, Z3), i3, t);
      }), dl = L5(Ci);
      function gl(n4, t) {
        return fu(n4 || [], t || [], se);
      }
      function vl(n4, t) {
        return fu(n4 || [], t || [], fe5);
      }
      var _l = L5(function(n4) {
        var t = n4.length, e2 = t > 1 ? n4[t - 1] : i3;
        return e2 = typeof e2 == "function" ? (n4.pop(), e2) : i3, Ku(n4, e2);
      });
      function Yu(n4) {
        var t = a3(n4);
        return t.__chain__ = true, t;
      }
      function ml(n4, t) {
        return t(n4), n4;
      }
      function er3(n4, t) {
        return t(n4);
      }
      var wl = Yn(function(n4) {
        var t = n4.length, e2 = t ? n4[0] : 0, r2 = this.__wrapped__, s2 = function(o3) {
          return Zr(o3, n4);
        };
        return t > 1 || this.__actions__.length || !(r2 instanceof H4) || !Zn(e2) ? this.thru(s2) : (r2 = r2.slice(e2, +e2 + (t ? 1 : 0)), r2.__actions__.push({ func: er3, args: [s2], thisArg: i3 }), new Pn5(r2, this.__chain__).thru(function(o3) {
          return t && !o3.length && o3.push(i3), o3;
        }));
      });
      function Pl() {
        return Yu(this);
      }
      function Al() {
        return new Pn5(this.value(), this.__chain__);
      }
      function Cl() {
        this.__values__ === i3 && (this.__values__ = ua(this.value()));
        var n4 = this.__index__ >= this.__values__.length, t = n4 ? i3 : this.__values__[this.__index__++];
        return { done: n4, value: t };
      }
      function Il() {
        return this;
      }
      function xl(n4) {
        for (var t, e2 = this; e2 instanceof qe3; ) {
          var r2 = Fu(e2);
          r2.__index__ = 0, r2.__values__ = i3, t ? s2.__wrapped__ = r2 : t = r2;
          var s2 = r2;
          e2 = e2.__wrapped__;
        }
        return s2.__wrapped__ = n4, t;
      }
      function El() {
        var n4 = this.__wrapped__;
        if (n4 instanceof H4) {
          var t = n4;
          return this.__actions__.length && (t = new H4(this)), t = t.reverse(), t.__actions__.push({ func: er3, args: [Ai], thisArg: i3 }), new Pn5(t, this.__chain__);
        }
        return this.thru(Ai);
      }
      function yl() {
        return ou(this.__wrapped__, this.__actions__);
      }
      var Sl = Je4(function(n4, t, e2) {
        F4.call(n4, e2) ? ++n4[e2] : zn(n4, e2, 1);
      });
      function Ol(n4, t, e2) {
        var r2 = O7(n4) ? As2 : mc;
        return e2 && rn2(n4, t, e2) && (t = i3), r2(n4, x3(t, 3));
      }
      function Rl(n4, t) {
        var e2 = O7(n4) ? jn : Ks2;
        return e2(n4, x3(t, 3));
      }
      var bl = wu(Mu), Tl = wu(qu);
      function Ll(n4, t) {
        return j4(rr2(n4, t), 1);
      }
      function Dl(n4, t) {
        return j4(rr2(n4, t), ht3);
      }
      function Hl(n4, t, e2) {
        return e2 = e2 === i3 ? 1 : R2(e2), j4(rr2(n4, t), e2);
      }
      function Zu(n4, t) {
        var e2 = O7(n4) ? mn2 : rt3;
        return e2(n4, x3(t, 3));
      }
      function Ju(n4, t) {
        var e2 = O7(n4) ? ko : zs2;
        return e2(n4, x3(t, 3));
      }
      var Nl = Je4(function(n4, t, e2) {
        F4.call(n4, e2) ? n4[e2].push(t) : zn(n4, e2, [t]);
      });
      function $l(n4, t, e2, r2) {
        n4 = an2(n4) ? n4 : Gt3(n4), e2 = e2 && !r2 ? R2(e2) : 0;
        var s2 = n4.length;
        return e2 < 0 && (e2 = Q5(s2 + e2, 0)), or2(n4) ? e2 <= s2 && n4.indexOf(t, e2) > -1 : !!s2 && Tt2(n4, t, e2) > -1;
      }
      var Ul = L5(function(n4, t, e2) {
        var r2 = -1, s2 = typeof t == "function", o3 = an2(n4) ? p7(n4.length) : [];
        return rt3(n4, function(f5) {
          o3[++r2] = s2 ? cn2(t, f5, e2) : ae3(f5, t, e2);
        }), o3;
      }), Wl = Je4(function(n4, t, e2) {
        zn(n4, e2, t);
      });
      function rr2(n4, t) {
        var e2 = O7(n4) ? G5 : Vs2;
        return e2(n4, x3(t, 3));
      }
      function Fl(n4, t, e2, r2) {
        return n4 == null ? [] : (O7(t) || (t = t == null ? [] : [t]), e2 = r2 ? i3 : e2, O7(e2) || (e2 = e2 == null ? [] : [e2]), tu(n4, t, e2));
      }
      var Ml = Je4(function(n4, t, e2) {
        n4[e2 ? 0 : 1].push(t);
      }, function() {
        return [[], []];
      });
      function ql(n4, t, e2) {
        var r2 = O7(n4) ? Hr : Es2, s2 = arguments.length < 3;
        return r2(n4, x3(t, 4), e2, s2, rt3);
      }
      function Bl(n4, t, e2) {
        var r2 = O7(n4) ? jo : Es2, s2 = arguments.length < 3;
        return r2(n4, x3(t, 4), e2, s2, zs2);
      }
      function Gl(n4, t) {
        var e2 = O7(n4) ? jn : Ks2;
        return e2(n4, ur2(x3(t, 3)));
      }
      function zl(n4) {
        var t = O7(n4) ? Ms2 : $c;
        return t(n4);
      }
      function Kl(n4, t, e2) {
        (e2 ? rn2(n4, t, e2) : t === i3) ? t = 1 : t = R2(t);
        var r2 = O7(n4) ? pc : Uc;
        return r2(n4, t);
      }
      function Yl(n4) {
        var t = O7(n4) ? dc : Fc;
        return t(n4);
      }
      function Zl(n4) {
        if (n4 == null) return 0;
        if (an2(n4)) return or2(n4) ? Dt3(n4) : n4.length;
        var t = tn2(n4);
        return t == yn2 || t == Sn ? n4.size : jr(n4).length;
      }
      function Jl(n4, t, e2) {
        var r2 = O7(n4) ? Nr2 : Mc;
        return e2 && rn2(n4, t, e2) && (t = i3), r2(n4, x3(t, 3));
      }
      var Xl = L5(function(n4, t) {
        if (n4 == null) return [];
        var e2 = t.length;
        return e2 > 1 && rn2(n4, t[0], t[1]) ? t = [] : e2 > 2 && rn2(t[0], t[1], t[2]) && (t = [t[0]]), tu(n4, j4(t, 1), []);
      }), ir2 = Rf || function() {
        return k7.Date.now();
      };
      function Ql(n4, t) {
        if (typeof t != "function") throw new wn5($4);
        return n4 = R2(n4), function() {
          if (--n4 < 1) return t.apply(this, arguments);
        };
      }
      function Xu(n4, t, e2) {
        return t = e2 ? i3 : t, t = n4 && t == null ? n4.length : t, Kn2(n4, Mn2, i3, i3, i3, i3, t);
      }
      function Qu(n4, t) {
        var e2;
        if (typeof t != "function") throw new wn5($4);
        return n4 = R2(n4), function() {
          return --n4 > 0 && (e2 = t.apply(this, arguments)), n4 <= 1 && (t = i3), e2;
        };
      }
      var Ii = L5(function(n4, t, e2) {
        var r2 = vn;
        if (e2.length) {
          var s2 = tt2(e2, qt3(Ii));
          r2 |= Hn2;
        }
        return Kn2(n4, r2, t, e2, s2);
      }), Vu = L5(function(n4, t, e2) {
        var r2 = vn | ct2;
        if (e2.length) {
          var s2 = tt2(e2, qt3(Vu));
          r2 |= Hn2;
        }
        return Kn2(t, r2, n4, e2, s2);
      });
      function ku(n4, t, e2) {
        t = e2 ? i3 : t;
        var r2 = Kn2(n4, Dn2, i3, i3, i3, i3, i3, t);
        return r2.placeholder = ku.placeholder, r2;
      }
      function ju(n4, t, e2) {
        t = e2 ? i3 : t;
        var r2 = Kn2(n4, yt4, i3, i3, i3, i3, i3, t);
        return r2.placeholder = ju.placeholder, r2;
      }
      function na(n4, t, e2) {
        var r2, s2, o3, f5, c5, l4, v5 = 0, _6 = false, m5 = false, P4 = true;
        if (typeof n4 != "function") throw new wn5($4);
        t = xn2(t) || 0, K3(e2) && (_6 = !!e2.leading, m5 = "maxWait" in e2, o3 = m5 ? Q5(xn2(e2.maxWait) || 0, t) : o3, P4 = "trailing" in e2 ? !!e2.trailing : P4);
        function I2(J2) {
          var Tn = r2, Qn2 = s2;
          return r2 = s2 = i3, v5 = J2, f5 = n4.apply(Qn2, Tn), f5;
        }
        function E6(J2) {
          return v5 = J2, c5 = le7(D6, t), _6 ? I2(J2) : f5;
        }
        function b6(J2) {
          var Tn = J2 - l4, Qn2 = J2 - v5, wa = t - Tn;
          return m5 ? nn3(wa, o3 - Qn2) : wa;
        }
        function y7(J2) {
          var Tn = J2 - l4, Qn2 = J2 - v5;
          return l4 === i3 || Tn >= t || Tn < 0 || m5 && Qn2 >= o3;
        }
        function D6() {
          var J2 = ir2();
          if (y7(J2)) return N6(J2);
          c5 = le7(D6, b6(J2));
        }
        function N6(J2) {
          return c5 = i3, P4 && r2 ? I2(J2) : (r2 = s2 = i3, f5);
        }
        function dn2() {
          c5 !== i3 && cu(c5), v5 = 0, r2 = l4 = s2 = c5 = i3;
        }
        function sn2() {
          return c5 === i3 ? f5 : N6(ir2());
        }
        function gn2() {
          var J2 = ir2(), Tn = y7(J2);
          if (r2 = arguments, s2 = this, l4 = J2, Tn) {
            if (c5 === i3) return E6(l4);
            if (m5) return cu(c5), c5 = le7(D6, t), I2(l4);
          }
          return c5 === i3 && (c5 = le7(D6, t)), f5;
        }
        return gn2.cancel = dn2, gn2.flush = sn2, gn2;
      }
      var Vl = L5(function(n4, t) {
        return Gs2(n4, 1, t);
      }), kl = L5(function(n4, t, e2) {
        return Gs2(n4, xn2(t) || 0, e2);
      });
      function jl(n4) {
        return Kn2(n4, dr2);
      }
      function sr2(n4, t) {
        if (typeof n4 != "function" || t != null && typeof t != "function") throw new wn5($4);
        var e2 = function() {
          var r2 = arguments, s2 = t ? t.apply(this, r2) : r2[0], o3 = e2.cache;
          if (o3.has(s2)) return o3.get(s2);
          var f5 = n4.apply(this, r2);
          return e2.cache = o3.set(s2, f5) || o3, f5;
        };
        return e2.cache = new (sr2.Cache || Gn2)(), e2;
      }
      sr2.Cache = Gn2;
      function ur2(n4) {
        if (typeof n4 != "function") throw new wn5($4);
        return function() {
          var t = arguments;
          switch (t.length) {
            case 0:
              return !n4.call(this);
            case 1:
              return !n4.call(this, t[0]);
            case 2:
              return !n4.call(this, t[0], t[1]);
            case 3:
              return !n4.call(this, t[0], t[1], t[2]);
          }
          return !n4.apply(this, t);
        };
      }
      function np(n4) {
        return Qu(2, n4);
      }
      var tp = qc(function(n4, t) {
        t = t.length == 1 && O7(t[0]) ? G5(t[0], hn2(x3())) : G5(j4(t, 1), hn2(x3()));
        var e2 = t.length;
        return L5(function(r2) {
          for (var s2 = -1, o3 = nn3(r2.length, e2); ++s2 < o3; ) r2[s2] = t[s2].call(this, r2[s2]);
          return cn2(n4, this, r2);
        });
      }), xi = L5(function(n4, t) {
        var e2 = tt2(t, qt3(xi));
        return Kn2(n4, Hn2, i3, t, e2);
      }), ta = L5(function(n4, t) {
        var e2 = tt2(t, qt3(ta));
        return Kn2(n4, St3, i3, t, e2);
      }), ep = Yn(function(n4, t) {
        return Kn2(n4, Kt3, i3, i3, i3, t);
      });
      function rp(n4, t) {
        if (typeof n4 != "function") throw new wn5($4);
        return t = t === i3 ? t : R2(t), L5(n4, t);
      }
      function ip(n4, t) {
        if (typeof n4 != "function") throw new wn5($4);
        return t = t == null ? 0 : Q5(R2(t), 0), L5(function(e2) {
          var r2 = e2[t], s2 = ut3(e2, 0, t);
          return r2 && nt2(s2, r2), cn2(n4, this, s2);
        });
      }
      function sp(n4, t, e2) {
        var r2 = true, s2 = true;
        if (typeof n4 != "function") throw new wn5($4);
        return K3(e2) && (r2 = "leading" in e2 ? !!e2.leading : r2, s2 = "trailing" in e2 ? !!e2.trailing : s2), na(n4, t, { leading: r2, maxWait: t, trailing: s2 });
      }
      function up(n4) {
        return Xu(n4, 1);
      }
      function ap(n4, t) {
        return xi(oi(t), n4);
      }
      function op() {
        if (!arguments.length) return [];
        var n4 = arguments[0];
        return O7(n4) ? n4 : [n4];
      }
      function fp(n4) {
        return An(n4, xt3);
      }
      function cp(n4, t) {
        return t = typeof t == "function" ? t : i3, An(n4, xt3, t);
      }
      function hp(n4) {
        return An(n4, Ln3 | xt3);
      }
      function lp(n4, t) {
        return t = typeof t == "function" ? t : i3, An(n4, Ln3 | xt3, t);
      }
      function pp(n4, t) {
        return t == null || Bs2(n4, t, V4(t));
      }
      function bn(n4, t) {
        return n4 === t || n4 !== n4 && t !== t;
      }
      var dp = ke3(Qr), gp = ke3(function(n4, t) {
        return n4 >= t;
      }), Pt2 = Js2(/* @__PURE__ */ function() {
        return arguments;
      }()) ? Js2 : function(n4) {
        return Y(n4) && F4.call(n4, "callee") && !Hs2.call(n4, "callee");
      }, O7 = p7.isArray, vp = gs3 ? hn2(gs3) : xc;
      function an2(n4) {
        return n4 != null && ar2(n4.length) && !Jn2(n4);
      }
      function Z3(n4) {
        return Y(n4) && an2(n4);
      }
      function _p(n4) {
        return n4 === true || n4 === false || Y(n4) && en5(n4) == Yt3;
      }
      var at4 = Tf || Ni2, mp = vs2 ? hn2(vs2) : Ec;
      function wp(n4) {
        return Y(n4) && n4.nodeType === 1 && !pe3(n4);
      }
      function Pp(n4) {
        if (n4 == null) return true;
        if (an2(n4) && (O7(n4) || typeof n4 == "string" || typeof n4.splice == "function" || at4(n4) || Bt3(n4) || Pt2(n4))) return !n4.length;
        var t = tn2(n4);
        if (t == yn2 || t == Sn) return !n4.size;
        if (he7(n4)) return !jr(n4).length;
        for (var e2 in n4) if (F4.call(n4, e2)) return false;
        return true;
      }
      function Ap(n4, t) {
        return oe3(n4, t);
      }
      function Cp(n4, t, e2) {
        e2 = typeof e2 == "function" ? e2 : i3;
        var r2 = e2 ? e2(n4, t) : i3;
        return r2 === i3 ? oe3(n4, t, i3, e2) : !!r2;
      }
      function Ei(n4) {
        if (!Y(n4)) return false;
        var t = en5(n4);
        return t == we || t == Ga || typeof n4.message == "string" && typeof n4.name == "string" && !pe3(n4);
      }
      function Ip(n4) {
        return typeof n4 == "number" && $s2(n4);
      }
      function Jn2(n4) {
        if (!K3(n4)) return false;
        var t = en5(n4);
        return t == Pe2 || t == Gi2 || t == Ba || t == Ka;
      }
      function ea(n4) {
        return typeof n4 == "number" && n4 == R2(n4);
      }
      function ar2(n4) {
        return typeof n4 == "number" && n4 > -1 && n4 % 1 == 0 && n4 <= kn2;
      }
      function K3(n4) {
        var t = typeof n4;
        return n4 != null && (t == "object" || t == "function");
      }
      function Y(n4) {
        return n4 != null && typeof n4 == "object";
      }
      var ra = _s2 ? hn2(_s2) : Sc;
      function xp(n4, t) {
        return n4 === t || kr(n4, t, gi(t));
      }
      function Ep(n4, t, e2) {
        return e2 = typeof e2 == "function" ? e2 : i3, kr(n4, t, gi(t), e2);
      }
      function yp(n4) {
        return ia(n4) && n4 != +n4;
      }
      function Sp(n4) {
        if (ch(n4)) throw new S6(T5);
        return Xs2(n4);
      }
      function Op(n4) {
        return n4 === null;
      }
      function Rp(n4) {
        return n4 == null;
      }
      function ia(n4) {
        return typeof n4 == "number" || Y(n4) && en5(n4) == Jt3;
      }
      function pe3(n4) {
        if (!Y(n4) || en5(n4) != qn2) return false;
        var t = He3(n4);
        if (t === null) return true;
        var e2 = F4.call(t, "constructor") && t.constructor;
        return typeof e2 == "function" && e2 instanceof e2 && be.call(e2) == Ef;
      }
      var yi = ms2 ? hn2(ms2) : Oc;
      function bp(n4) {
        return ea(n4) && n4 >= -kn2 && n4 <= kn2;
      }
      var sa = ws2 ? hn2(ws2) : Rc;
      function or2(n4) {
        return typeof n4 == "string" || !O7(n4) && Y(n4) && en5(n4) == Qt2;
      }
      function pn2(n4) {
        return typeof n4 == "symbol" || Y(n4) && en5(n4) == Ae2;
      }
      var Bt3 = Ps2 ? hn2(Ps2) : bc;
      function Tp(n4) {
        return n4 === i3;
      }
      function Lp(n4) {
        return Y(n4) && tn2(n4) == Vt3;
      }
      function Dp(n4) {
        return Y(n4) && en5(n4) == Za;
      }
      var Hp = ke3(ni), Np = ke3(function(n4, t) {
        return n4 <= t;
      });
      function ua(n4) {
        if (!n4) return [];
        if (an2(n4)) return or2(n4) ? On5(n4) : un2(n4);
        if (ne2 && n4[ne2]) return pf(n4[ne2]());
        var t = tn2(n4), e2 = t == yn2 ? qr : t == Sn ? Se2 : Gt3;
        return e2(n4);
      }
      function Xn2(n4) {
        if (!n4) return n4 === 0 ? n4 : 0;
        if (n4 = xn2(n4), n4 === ht3 || n4 === -ht3) {
          var t = n4 < 0 ? -1 : 1;
          return t * Wa;
        }
        return n4 === n4 ? n4 : 0;
      }
      function R2(n4) {
        var t = Xn2(n4), e2 = t % 1;
        return t === t ? e2 ? t - e2 : t : 0;
      }
      function aa(n4) {
        return n4 ? vt3(R2(n4), 0, Nn5) : 0;
      }
      function xn2(n4) {
        if (typeof n4 == "number") return n4;
        if (pn2(n4)) return _e3;
        if (K3(n4)) {
          var t = typeof n4.valueOf == "function" ? n4.valueOf() : n4;
          n4 = K3(t) ? t + "" : t;
        }
        if (typeof n4 != "string") return n4 === 0 ? n4 : +n4;
        n4 = ys2(n4);
        var e2 = go.test(n4);
        return e2 || _o.test(n4) ? Xo(n4.slice(2), e2 ? 2 : 8) : po.test(n4) ? _e3 : +n4;
      }
      function oa(n4) {
        return Un2(n4, on2(n4));
      }
      function $p(n4) {
        return n4 ? vt3(R2(n4), -kn2, kn2) : n4 === 0 ? n4 : 0;
      }
      function W7(n4) {
        return n4 == null ? "" : ln2(n4);
      }
      var Up = Ft3(function(n4, t) {
        if (he7(t) || an2(t)) {
          Un2(t, V4(t), n4);
          return;
        }
        for (var e2 in t) F4.call(t, e2) && se(n4, e2, t[e2]);
      }), fa = Ft3(function(n4, t) {
        Un2(t, on2(t), n4);
      }), fr2 = Ft3(function(n4, t, e2, r2) {
        Un2(t, on2(t), n4, r2);
      }), Wp = Ft3(function(n4, t, e2, r2) {
        Un2(t, V4(t), n4, r2);
      }), Fp = Yn(Zr);
      function Mp(n4, t) {
        var e2 = Wt2(n4);
        return t == null ? e2 : qs2(e2, t);
      }
      var qp = L5(function(n4, t) {
        n4 = M7(n4);
        var e2 = -1, r2 = t.length, s2 = r2 > 2 ? t[2] : i3;
        for (s2 && rn2(t[0], t[1], s2) && (r2 = 1); ++e2 < r2; ) for (var o3 = t[e2], f5 = on2(o3), c5 = -1, l4 = f5.length; ++c5 < l4; ) {
          var v5 = f5[c5], _6 = n4[v5];
          (_6 === i3 || bn(_6, Nt3[v5]) && !F4.call(n4, v5)) && (n4[v5] = o3[v5]);
        }
        return n4;
      }), Bp = L5(function(n4) {
        return n4.push(i3, yu), cn2(ca, i3, n4);
      });
      function Gp(n4, t) {
        return Cs2(n4, x3(t, 3), $n);
      }
      function zp(n4, t) {
        return Cs2(n4, x3(t, 3), Xr);
      }
      function Kp(n4, t) {
        return n4 == null ? n4 : Jr(n4, x3(t, 3), on2);
      }
      function Yp(n4, t) {
        return n4 == null ? n4 : Ys2(n4, x3(t, 3), on2);
      }
      function Zp(n4, t) {
        return n4 && $n(n4, x3(t, 3));
      }
      function Jp(n4, t) {
        return n4 && Xr(n4, x3(t, 3));
      }
      function Xp(n4) {
        return n4 == null ? [] : ze(n4, V4(n4));
      }
      function Qp(n4) {
        return n4 == null ? [] : ze(n4, on2(n4));
      }
      function Si(n4, t, e2) {
        var r2 = n4 == null ? i3 : _t2(n4, t);
        return r2 === i3 ? e2 : r2;
      }
      function Vp(n4, t) {
        return n4 != null && Ru(n4, t, Pc);
      }
      function Oi(n4, t) {
        return n4 != null && Ru(n4, t, Ac);
      }
      var kp = Au(function(n4, t, e2) {
        t != null && typeof t.toString != "function" && (t = Te3.call(t)), n4[t] = e2;
      }, bi(fn2)), jp = Au(function(n4, t, e2) {
        t != null && typeof t.toString != "function" && (t = Te3.call(t)), F4.call(n4, t) ? n4[t].push(e2) : n4[t] = [e2];
      }, x3), nd = L5(ae3);
      function V4(n4) {
        return an2(n4) ? Fs2(n4) : jr(n4);
      }
      function on2(n4) {
        return an2(n4) ? Fs2(n4, true) : Tc(n4);
      }
      function td(n4, t) {
        var e2 = {};
        return t = x3(t, 3), $n(n4, function(r2, s2, o3) {
          zn(e2, t(r2, s2, o3), r2);
        }), e2;
      }
      function ed(n4, t) {
        var e2 = {};
        return t = x3(t, 3), $n(n4, function(r2, s2, o3) {
          zn(e2, s2, t(r2, s2, o3));
        }), e2;
      }
      var rd = Ft3(function(n4, t, e2) {
        Ke2(n4, t, e2);
      }), ca = Ft3(function(n4, t, e2, r2) {
        Ke2(n4, t, e2, r2);
      }), id = Yn(function(n4, t) {
        var e2 = {};
        if (n4 == null) return e2;
        var r2 = false;
        t = G5(t, function(o3) {
          return o3 = st2(o3, n4), r2 || (r2 = o3.length > 1), o3;
        }), Un2(n4, pi(n4), e2), r2 && (e2 = An(e2, Ln3 | Fn2 | xt3, kc));
        for (var s2 = t.length; s2--; ) si(e2, t[s2]);
        return e2;
      });
      function sd(n4, t) {
        return ha(n4, ur2(x3(t)));
      }
      var ud = Yn(function(n4, t) {
        return n4 == null ? {} : Dc(n4, t);
      });
      function ha(n4, t) {
        if (n4 == null) return {};
        var e2 = G5(pi(n4), function(r2) {
          return [r2];
        });
        return t = x3(t), eu(n4, e2, function(r2, s2) {
          return t(r2, s2[0]);
        });
      }
      function ad(n4, t, e2) {
        t = st2(t, n4);
        var r2 = -1, s2 = t.length;
        for (s2 || (s2 = 1, n4 = i3); ++r2 < s2; ) {
          var o3 = n4 == null ? i3 : n4[Wn2(t[r2])];
          o3 === i3 && (r2 = s2, o3 = e2), n4 = Jn2(o3) ? o3.call(n4) : o3;
        }
        return n4;
      }
      function od(n4, t, e2) {
        return n4 == null ? n4 : fe5(n4, t, e2);
      }
      function fd(n4, t, e2, r2) {
        return r2 = typeof r2 == "function" ? r2 : i3, n4 == null ? n4 : fe5(n4, t, e2, r2);
      }
      var la = xu(V4), pa = xu(on2);
      function cd(n4, t, e2) {
        var r2 = O7(n4), s2 = r2 || at4(n4) || Bt3(n4);
        if (t = x3(t, 4), e2 == null) {
          var o3 = n4 && n4.constructor;
          s2 ? e2 = r2 ? new o3() : [] : K3(n4) ? e2 = Jn2(o3) ? Wt2(He3(n4)) : {} : e2 = {};
        }
        return (s2 ? mn2 : $n)(n4, function(f5, c5, l4) {
          return t(e2, f5, c5, l4);
        }), e2;
      }
      function hd(n4, t) {
        return n4 == null ? true : si(n4, t);
      }
      function ld(n4, t, e2) {
        return n4 == null ? n4 : au(n4, t, oi(e2));
      }
      function pd(n4, t, e2, r2) {
        return r2 = typeof r2 == "function" ? r2 : i3, n4 == null ? n4 : au(n4, t, oi(e2), r2);
      }
      function Gt3(n4) {
        return n4 == null ? [] : Mr(n4, V4(n4));
      }
      function dd(n4) {
        return n4 == null ? [] : Mr(n4, on2(n4));
      }
      function gd(n4, t, e2) {
        return e2 === i3 && (e2 = t, t = i3), e2 !== i3 && (e2 = xn2(e2), e2 = e2 === e2 ? e2 : 0), t !== i3 && (t = xn2(t), t = t === t ? t : 0), vt3(xn2(n4), t, e2);
      }
      function vd(n4, t, e2) {
        return t = Xn2(t), e2 === i3 ? (e2 = t, t = 0) : e2 = Xn2(e2), n4 = xn2(n4), Cc(n4, t, e2);
      }
      function _d(n4, t, e2) {
        if (e2 && typeof e2 != "boolean" && rn2(n4, t, e2) && (t = e2 = i3), e2 === i3 && (typeof t == "boolean" ? (e2 = t, t = i3) : typeof n4 == "boolean" && (e2 = n4, n4 = i3)), n4 === i3 && t === i3 ? (n4 = 0, t = 1) : (n4 = Xn2(n4), t === i3 ? (t = n4, n4 = 0) : t = Xn2(t)), n4 > t) {
          var r2 = n4;
          n4 = t, t = r2;
        }
        if (e2 || n4 % 1 || t % 1) {
          var s2 = Us2();
          return nn3(n4 + s2 * (t - n4 + Jo("1e-" + ((s2 + "").length - 1))), t);
        }
        return ei(n4, t);
      }
      var md = Mt3(function(n4, t, e2) {
        return t = t.toLowerCase(), n4 + (e2 ? da(t) : t);
      });
      function da(n4) {
        return Ri(W7(n4).toLowerCase());
      }
      function ga(n4) {
        return n4 = W7(n4), n4 && n4.replace(wo, of).replace(Wo, "");
      }
      function wd(n4, t, e2) {
        n4 = W7(n4), t = ln2(t);
        var r2 = n4.length;
        e2 = e2 === i3 ? r2 : vt3(R2(e2), 0, r2);
        var s2 = e2;
        return e2 -= t.length, e2 >= 0 && n4.slice(e2, s2) == t;
      }
      function Pd(n4) {
        return n4 = W7(n4), n4 && ka.test(n4) ? n4.replace(Yi2, ff) : n4;
      }
      function Ad(n4) {
        return n4 = W7(n4), n4 && io.test(n4) ? n4.replace(xr2, "\\$&") : n4;
      }
      var Cd = Mt3(function(n4, t, e2) {
        return n4 + (e2 ? "-" : "") + t.toLowerCase();
      }), Id = Mt3(function(n4, t, e2) {
        return n4 + (e2 ? " " : "") + t.toLowerCase();
      }), xd = mu("toLowerCase");
      function Ed(n4, t, e2) {
        n4 = W7(n4), t = R2(t);
        var r2 = t ? Dt3(n4) : 0;
        if (!t || r2 >= t) return n4;
        var s2 = (t - r2) / 2;
        return Ve3(We3(s2), e2) + n4 + Ve3(Ue3(s2), e2);
      }
      function yd(n4, t, e2) {
        n4 = W7(n4), t = R2(t);
        var r2 = t ? Dt3(n4) : 0;
        return t && r2 < t ? n4 + Ve3(t - r2, e2) : n4;
      }
      function Sd(n4, t, e2) {
        n4 = W7(n4), t = R2(t);
        var r2 = t ? Dt3(n4) : 0;
        return t && r2 < t ? Ve3(t - r2, e2) + n4 : n4;
      }
      function Od(n4, t, e2) {
        return e2 || t == null ? t = 0 : t && (t = +t), Nf(W7(n4).replace(Er2, ""), t || 0);
      }
      function Rd(n4, t, e2) {
        return (e2 ? rn2(n4, t, e2) : t === i3) ? t = 1 : t = R2(t), ri(W7(n4), t);
      }
      function bd() {
        var n4 = arguments, t = W7(n4[0]);
        return n4.length < 3 ? t : t.replace(n4[1], n4[2]);
      }
      var Td = Mt3(function(n4, t, e2) {
        return n4 + (e2 ? "_" : "") + t.toLowerCase();
      });
      function Ld(n4, t, e2) {
        return e2 && typeof e2 != "number" && rn2(n4, t, e2) && (t = e2 = i3), e2 = e2 === i3 ? Nn5 : e2 >>> 0, e2 ? (n4 = W7(n4), n4 && (typeof t == "string" || t != null && !yi(t)) && (t = ln2(t), !t && Lt3(n4)) ? ut3(On5(n4), 0, e2) : n4.split(t, e2)) : [];
      }
      var Dd = Mt3(function(n4, t, e2) {
        return n4 + (e2 ? " " : "") + Ri(t);
      });
      function Hd(n4, t, e2) {
        return n4 = W7(n4), e2 = e2 == null ? 0 : vt3(R2(e2), 0, n4.length), t = ln2(t), n4.slice(e2, e2 + t.length) == t;
      }
      function Nd(n4, t, e2) {
        var r2 = a3.templateSettings;
        e2 && rn2(n4, t, e2) && (t = i3), n4 = W7(n4), t = fr2({}, t, r2, Eu);
        var s2 = fr2({}, t.imports, r2.imports, Eu), o3 = V4(s2), f5 = Mr(s2, o3), c5, l4, v5 = 0, _6 = t.interpolate || Ce3, m5 = "__p += '", P4 = Br((t.escape || Ce3).source + "|" + _6.source + "|" + (_6 === Zi2 ? lo : Ce3).source + "|" + (t.evaluate || Ce3).source + "|$", "g"), I2 = "//# sourceURL=" + (F4.call(t, "sourceURL") ? (t.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++Go + "]") + `
`;
        n4.replace(P4, function(y7, D6, N6, dn2, sn2, gn2) {
          return N6 || (N6 = dn2), m5 += n4.slice(v5, gn2).replace(Po, cf), D6 && (c5 = true, m5 += `' +
__e(` + D6 + `) +
'`), sn2 && (l4 = true, m5 += `';
` + sn2 + `;
__p += '`), N6 && (m5 += `' +
((__t = (` + N6 + `)) == null ? '' : __t) +
'`), v5 = gn2 + y7.length, y7;
        }), m5 += `';
`;
        var E6 = F4.call(t, "variable") && t.variable;
        if (!E6) m5 = `with (obj) {
` + m5 + `
}
`;
        else if (co.test(E6)) throw new S6(En);
        m5 = (l4 ? m5.replace(Ja, "") : m5).replace(Xa, "$1").replace(Qa, "$1;"), m5 = "function(" + (E6 || "obj") + `) {
` + (E6 ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (c5 ? ", __e = _.escape" : "") + (l4 ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + m5 + `return __p
}`;
        var b6 = _a(function() {
          return U9(o3, I2 + "return " + m5).apply(i3, f5);
        });
        if (b6.source = m5, Ei(b6)) throw b6;
        return b6;
      }
      function $d(n4) {
        return W7(n4).toLowerCase();
      }
      function Ud(n4) {
        return W7(n4).toUpperCase();
      }
      function Wd(n4, t, e2) {
        if (n4 = W7(n4), n4 && (e2 || t === i3)) return ys2(n4);
        if (!n4 || !(t = ln2(t))) return n4;
        var r2 = On5(n4), s2 = On5(t), o3 = Ss2(r2, s2), f5 = Os2(r2, s2) + 1;
        return ut3(r2, o3, f5).join("");
      }
      function Fd(n4, t, e2) {
        if (n4 = W7(n4), n4 && (e2 || t === i3)) return n4.slice(0, bs2(n4) + 1);
        if (!n4 || !(t = ln2(t))) return n4;
        var r2 = On5(n4), s2 = Os2(r2, On5(t)) + 1;
        return ut3(r2, 0, s2).join("");
      }
      function Md(n4, t, e2) {
        if (n4 = W7(n4), n4 && (e2 || t === i3)) return n4.replace(Er2, "");
        if (!n4 || !(t = ln2(t))) return n4;
        var r2 = On5(n4), s2 = Ss2(r2, On5(t));
        return ut3(r2, s2).join("");
      }
      function qd(n4, t) {
        var e2 = La, r2 = Da;
        if (K3(t)) {
          var s2 = "separator" in t ? t.separator : s2;
          e2 = "length" in t ? R2(t.length) : e2, r2 = "omission" in t ? ln2(t.omission) : r2;
        }
        n4 = W7(n4);
        var o3 = n4.length;
        if (Lt3(n4)) {
          var f5 = On5(n4);
          o3 = f5.length;
        }
        if (e2 >= o3) return n4;
        var c5 = e2 - Dt3(r2);
        if (c5 < 1) return r2;
        var l4 = f5 ? ut3(f5, 0, c5).join("") : n4.slice(0, c5);
        if (s2 === i3) return l4 + r2;
        if (f5 && (c5 += l4.length - c5), yi(s2)) {
          if (n4.slice(c5).search(s2)) {
            var v5, _6 = l4;
            for (s2.global || (s2 = Br(s2.source, W7(Ji2.exec(s2)) + "g")), s2.lastIndex = 0; v5 = s2.exec(_6); ) var m5 = v5.index;
            l4 = l4.slice(0, m5 === i3 ? c5 : m5);
          }
        } else if (n4.indexOf(ln2(s2), c5) != c5) {
          var P4 = l4.lastIndexOf(s2);
          P4 > -1 && (l4 = l4.slice(0, P4));
        }
        return l4 + r2;
      }
      function Bd(n4) {
        return n4 = W7(n4), n4 && Va.test(n4) ? n4.replace(Ki, _f) : n4;
      }
      var Gd = Mt3(function(n4, t, e2) {
        return n4 + (e2 ? " " : "") + t.toUpperCase();
      }), Ri = mu("toUpperCase");
      function va(n4, t, e2) {
        return n4 = W7(n4), t = e2 ? i3 : t, t === i3 ? lf(n4) ? Pf(n4) : ef(n4) : n4.match(t) || [];
      }
      var _a = L5(function(n4, t) {
        try {
          return cn2(n4, i3, t);
        } catch (e2) {
          return Ei(e2) ? e2 : new S6(e2);
        }
      }), zd = Yn(function(n4, t) {
        return mn2(t, function(e2) {
          e2 = Wn2(e2), zn(n4, e2, Ii(n4[e2], n4));
        }), n4;
      });
      function Kd(n4) {
        var t = n4 == null ? 0 : n4.length, e2 = x3();
        return n4 = t ? G5(n4, function(r2) {
          if (typeof r2[1] != "function") throw new wn5($4);
          return [e2(r2[0]), r2[1]];
        }) : [], L5(function(r2) {
          for (var s2 = -1; ++s2 < t; ) {
            var o3 = n4[s2];
            if (cn2(o3[0], this, r2)) return cn2(o3[1], this, r2);
          }
        });
      }
      function Yd(n4) {
        return _c(An(n4, Ln3));
      }
      function bi(n4) {
        return function() {
          return n4;
        };
      }
      function Zd(n4, t) {
        return n4 == null || n4 !== n4 ? t : n4;
      }
      var Jd = Pu(), Xd = Pu(true);
      function fn2(n4) {
        return n4;
      }
      function Ti(n4) {
        return Qs2(typeof n4 == "function" ? n4 : An(n4, Ln3));
      }
      function Qd(n4) {
        return ks2(An(n4, Ln3));
      }
      function Vd(n4, t) {
        return js2(n4, An(t, Ln3));
      }
      var kd = L5(function(n4, t) {
        return function(e2) {
          return ae3(e2, n4, t);
        };
      }), jd = L5(function(n4, t) {
        return function(e2) {
          return ae3(n4, e2, t);
        };
      });
      function Li2(n4, t, e2) {
        var r2 = V4(t), s2 = ze(t, r2);
        e2 == null && !(K3(t) && (s2.length || !r2.length)) && (e2 = t, t = n4, n4 = this, s2 = ze(t, V4(t)));
        var o3 = !(K3(e2) && "chain" in e2) || !!e2.chain, f5 = Jn2(n4);
        return mn2(s2, function(c5) {
          var l4 = t[c5];
          n4[c5] = l4, f5 && (n4.prototype[c5] = function() {
            var v5 = this.__chain__;
            if (o3 || v5) {
              var _6 = n4(this.__wrapped__), m5 = _6.__actions__ = un2(this.__actions__);
              return m5.push({ func: l4, args: arguments, thisArg: n4 }), _6.__chain__ = v5, _6;
            }
            return l4.apply(n4, nt2([this.value()], arguments));
          });
        }), n4;
      }
      function ng() {
        return k7._ === this && (k7._ = yf), this;
      }
      function Di() {
      }
      function tg(n4) {
        return n4 = R2(n4), L5(function(t) {
          return nu(t, n4);
        });
      }
      var eg = ci(G5), rg = ci(As2), ig = ci(Nr2);
      function ma(n4) {
        return _i(n4) ? $r(Wn2(n4)) : Hc(n4);
      }
      function sg(n4) {
        return function(t) {
          return n4 == null ? i3 : _t2(n4, t);
        };
      }
      var ug = Cu(), ag = Cu(true);
      function Hi2() {
        return [];
      }
      function Ni2() {
        return false;
      }
      function og() {
        return {};
      }
      function fg() {
        return "";
      }
      function cg() {
        return true;
      }
      function hg(n4, t) {
        if (n4 = R2(n4), n4 < 1 || n4 > kn2) return [];
        var e2 = Nn5, r2 = nn3(n4, Nn5);
        t = x3(t), n4 -= Nn5;
        for (var s2 = Fr(r2, t); ++e2 < n4; ) t(e2);
        return s2;
      }
      function lg(n4) {
        return O7(n4) ? G5(n4, Wn2) : pn2(n4) ? [n4] : un2(Wu(W7(n4)));
      }
      function pg(n4) {
        var t = ++xf;
        return W7(n4) + t;
      }
      var dg = Qe3(function(n4, t) {
        return n4 + t;
      }, 0), gg = hi("ceil"), vg = Qe3(function(n4, t) {
        return n4 / t;
      }, 1), _g = hi("floor");
      function mg(n4) {
        return n4 && n4.length ? Ge3(n4, fn2, Qr) : i3;
      }
      function wg(n4, t) {
        return n4 && n4.length ? Ge3(n4, x3(t, 2), Qr) : i3;
      }
      function Pg(n4) {
        return xs2(n4, fn2);
      }
      function Ag(n4, t) {
        return xs2(n4, x3(t, 2));
      }
      function Cg(n4) {
        return n4 && n4.length ? Ge3(n4, fn2, ni) : i3;
      }
      function Ig(n4, t) {
        return n4 && n4.length ? Ge3(n4, x3(t, 2), ni) : i3;
      }
      var xg = Qe3(function(n4, t) {
        return n4 * t;
      }, 1), Eg = hi("round"), yg = Qe3(function(n4, t) {
        return n4 - t;
      }, 0);
      function Sg(n4) {
        return n4 && n4.length ? Wr(n4, fn2) : 0;
      }
      function Og(n4, t) {
        return n4 && n4.length ? Wr(n4, x3(t, 2)) : 0;
      }
      return a3.after = Ql, a3.ary = Xu, a3.assign = Up, a3.assignIn = fa, a3.assignInWith = fr2, a3.assignWith = Wp, a3.at = Fp, a3.before = Qu, a3.bind = Ii, a3.bindAll = zd, a3.bindKey = Vu, a3.castArray = op, a3.chain = Yu, a3.chunk = _h, a3.compact = mh, a3.concat = wh, a3.cond = Kd, a3.conforms = Yd, a3.constant = bi, a3.countBy = Sl, a3.create = Mp, a3.curry = ku, a3.curryRight = ju, a3.debounce = na, a3.defaults = qp, a3.defaultsDeep = Bp, a3.defer = Vl, a3.delay = kl, a3.difference = Ph, a3.differenceBy = Ah, a3.differenceWith = Ch, a3.drop = Ih, a3.dropRight = xh, a3.dropRightWhile = Eh, a3.dropWhile = yh, a3.fill = Sh, a3.filter = Rl, a3.flatMap = Ll, a3.flatMapDeep = Dl, a3.flatMapDepth = Hl, a3.flatten = Bu, a3.flattenDeep = Oh, a3.flattenDepth = Rh, a3.flip = jl, a3.flow = Jd, a3.flowRight = Xd, a3.fromPairs = bh, a3.functions = Xp, a3.functionsIn = Qp, a3.groupBy = Nl, a3.initial = Lh, a3.intersection = Dh, a3.intersectionBy = Hh, a3.intersectionWith = Nh, a3.invert = kp, a3.invertBy = jp, a3.invokeMap = Ul, a3.iteratee = Ti, a3.keyBy = Wl, a3.keys = V4, a3.keysIn = on2, a3.map = rr2, a3.mapKeys = td, a3.mapValues = ed, a3.matches = Qd, a3.matchesProperty = Vd, a3.memoize = sr2, a3.merge = rd, a3.mergeWith = ca, a3.method = kd, a3.methodOf = jd, a3.mixin = Li2, a3.negate = ur2, a3.nthArg = tg, a3.omit = id, a3.omitBy = sd, a3.once = np, a3.orderBy = Fl, a3.over = eg, a3.overArgs = tp, a3.overEvery = rg, a3.overSome = ig, a3.partial = xi, a3.partialRight = ta, a3.partition = Ml, a3.pick = ud, a3.pickBy = ha, a3.property = ma, a3.propertyOf = sg, a3.pull = Fh, a3.pullAll = zu, a3.pullAllBy = Mh, a3.pullAllWith = qh, a3.pullAt = Bh, a3.range = ug, a3.rangeRight = ag, a3.rearg = ep, a3.reject = Gl, a3.remove = Gh, a3.rest = rp, a3.reverse = Ai, a3.sampleSize = Kl, a3.set = od, a3.setWith = fd, a3.shuffle = Yl, a3.slice = zh, a3.sortBy = Xl, a3.sortedUniq = Vh, a3.sortedUniqBy = kh, a3.split = Ld, a3.spread = ip, a3.tail = jh, a3.take = nl, a3.takeRight = tl, a3.takeRightWhile = el, a3.takeWhile = rl, a3.tap = ml, a3.throttle = sp, a3.thru = er3, a3.toArray = ua, a3.toPairs = la, a3.toPairsIn = pa, a3.toPath = lg, a3.toPlainObject = oa, a3.transform = cd, a3.unary = up, a3.union = il, a3.unionBy = sl, a3.unionWith = ul, a3.uniq = al, a3.uniqBy = ol, a3.uniqWith = fl, a3.unset = hd, a3.unzip = Ci, a3.unzipWith = Ku, a3.update = ld, a3.updateWith = pd, a3.values = Gt3, a3.valuesIn = dd, a3.without = cl, a3.words = va, a3.wrap = ap, a3.xor = hl, a3.xorBy = ll, a3.xorWith = pl, a3.zip = dl, a3.zipObject = gl, a3.zipObjectDeep = vl, a3.zipWith = _l, a3.entries = la, a3.entriesIn = pa, a3.extend = fa, a3.extendWith = fr2, Li2(a3, a3), a3.add = dg, a3.attempt = _a, a3.camelCase = md, a3.capitalize = da, a3.ceil = gg, a3.clamp = gd, a3.clone = fp, a3.cloneDeep = hp, a3.cloneDeepWith = lp, a3.cloneWith = cp, a3.conformsTo = pp, a3.deburr = ga, a3.defaultTo = Zd, a3.divide = vg, a3.endsWith = wd, a3.eq = bn, a3.escape = Pd, a3.escapeRegExp = Ad, a3.every = Ol, a3.find = bl, a3.findIndex = Mu, a3.findKey = Gp, a3.findLast = Tl, a3.findLastIndex = qu, a3.findLastKey = zp, a3.floor = _g, a3.forEach = Zu, a3.forEachRight = Ju, a3.forIn = Kp, a3.forInRight = Yp, a3.forOwn = Zp, a3.forOwnRight = Jp, a3.get = Si, a3.gt = dp, a3.gte = gp, a3.has = Vp, a3.hasIn = Oi, a3.head = Gu, a3.identity = fn2, a3.includes = $l, a3.indexOf = Th, a3.inRange = vd, a3.invoke = nd, a3.isArguments = Pt2, a3.isArray = O7, a3.isArrayBuffer = vp, a3.isArrayLike = an2, a3.isArrayLikeObject = Z3, a3.isBoolean = _p, a3.isBuffer = at4, a3.isDate = mp, a3.isElement = wp, a3.isEmpty = Pp, a3.isEqual = Ap, a3.isEqualWith = Cp, a3.isError = Ei, a3.isFinite = Ip, a3.isFunction = Jn2, a3.isInteger = ea, a3.isLength = ar2, a3.isMap = ra, a3.isMatch = xp, a3.isMatchWith = Ep, a3.isNaN = yp, a3.isNative = Sp, a3.isNil = Rp, a3.isNull = Op, a3.isNumber = ia, a3.isObject = K3, a3.isObjectLike = Y, a3.isPlainObject = pe3, a3.isRegExp = yi, a3.isSafeInteger = bp, a3.isSet = sa, a3.isString = or2, a3.isSymbol = pn2, a3.isTypedArray = Bt3, a3.isUndefined = Tp, a3.isWeakMap = Lp, a3.isWeakSet = Dp, a3.join = $h, a3.kebabCase = Cd, a3.last = In5, a3.lastIndexOf = Uh, a3.lowerCase = Id, a3.lowerFirst = xd, a3.lt = Hp, a3.lte = Np, a3.max = mg, a3.maxBy = wg, a3.mean = Pg, a3.meanBy = Ag, a3.min = Cg, a3.minBy = Ig, a3.stubArray = Hi2, a3.stubFalse = Ni2, a3.stubObject = og, a3.stubString = fg, a3.stubTrue = cg, a3.multiply = xg, a3.nth = Wh, a3.noConflict = ng, a3.noop = Di, a3.now = ir2, a3.pad = Ed, a3.padEnd = yd, a3.padStart = Sd, a3.parseInt = Od, a3.random = _d, a3.reduce = ql, a3.reduceRight = Bl, a3.repeat = Rd, a3.replace = bd, a3.result = ad, a3.round = Eg, a3.runInContext = h7, a3.sample = zl, a3.size = Zl, a3.snakeCase = Td, a3.some = Jl, a3.sortedIndex = Kh, a3.sortedIndexBy = Yh, a3.sortedIndexOf = Zh, a3.sortedLastIndex = Jh, a3.sortedLastIndexBy = Xh, a3.sortedLastIndexOf = Qh, a3.startCase = Dd, a3.startsWith = Hd, a3.subtract = yg, a3.sum = Sg, a3.sumBy = Og, a3.template = Nd, a3.times = hg, a3.toFinite = Xn2, a3.toInteger = R2, a3.toLength = aa, a3.toLower = $d, a3.toNumber = xn2, a3.toSafeInteger = $p, a3.toString = W7, a3.toUpper = Ud, a3.trim = Wd, a3.trimEnd = Fd, a3.trimStart = Md, a3.truncate = qd, a3.unescape = Bd, a3.uniqueId = pg, a3.upperCase = Gd, a3.upperFirst = Ri, a3.each = Zu, a3.eachRight = Ju, a3.first = Gu, Li2(a3, function() {
        var n4 = {};
        return $n(a3, function(t, e2) {
          F4.call(a3.prototype, e2) || (n4[e2] = t);
        }), n4;
      }(), { chain: false }), a3.VERSION = d3, mn2(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(n4) {
        a3[n4].placeholder = a3;
      }), mn2(["drop", "take"], function(n4, t) {
        H4.prototype[n4] = function(e2) {
          e2 = e2 === i3 ? 1 : Q5(R2(e2), 0);
          var r2 = this.__filtered__ && !t ? new H4(this) : this.clone();
          return r2.__filtered__ ? r2.__takeCount__ = nn3(e2, r2.__takeCount__) : r2.__views__.push({ size: nn3(e2, Nn5), type: n4 + (r2.__dir__ < 0 ? "Right" : "") }), r2;
        }, H4.prototype[n4 + "Right"] = function(e2) {
          return this.reverse()[n4](e2).reverse();
        };
      }), mn2(["filter", "map", "takeWhile"], function(n4, t) {
        var e2 = t + 1, r2 = e2 == Bi2 || e2 == Ua;
        H4.prototype[n4] = function(s2) {
          var o3 = this.clone();
          return o3.__iteratees__.push({ iteratee: x3(s2, 3), type: e2 }), o3.__filtered__ = o3.__filtered__ || r2, o3;
        };
      }), mn2(["head", "last"], function(n4, t) {
        var e2 = "take" + (t ? "Right" : "");
        H4.prototype[n4] = function() {
          return this[e2](1).value()[0];
        };
      }), mn2(["initial", "tail"], function(n4, t) {
        var e2 = "drop" + (t ? "" : "Right");
        H4.prototype[n4] = function() {
          return this.__filtered__ ? new H4(this) : this[e2](1);
        };
      }), H4.prototype.compact = function() {
        return this.filter(fn2);
      }, H4.prototype.find = function(n4) {
        return this.filter(n4).head();
      }, H4.prototype.findLast = function(n4) {
        return this.reverse().find(n4);
      }, H4.prototype.invokeMap = L5(function(n4, t) {
        return typeof n4 == "function" ? new H4(this) : this.map(function(e2) {
          return ae3(e2, n4, t);
        });
      }), H4.prototype.reject = function(n4) {
        return this.filter(ur2(x3(n4)));
      }, H4.prototype.slice = function(n4, t) {
        n4 = R2(n4);
        var e2 = this;
        return e2.__filtered__ && (n4 > 0 || t < 0) ? new H4(e2) : (n4 < 0 ? e2 = e2.takeRight(-n4) : n4 && (e2 = e2.drop(n4)), t !== i3 && (t = R2(t), e2 = t < 0 ? e2.dropRight(-t) : e2.take(t - n4)), e2);
      }, H4.prototype.takeRightWhile = function(n4) {
        return this.reverse().takeWhile(n4).reverse();
      }, H4.prototype.toArray = function() {
        return this.take(Nn5);
      }, $n(H4.prototype, function(n4, t) {
        var e2 = /^(?:filter|find|map|reject)|While$/.test(t), r2 = /^(?:head|last)$/.test(t), s2 = a3[r2 ? "take" + (t == "last" ? "Right" : "") : t], o3 = r2 || /^find/.test(t);
        s2 && (a3.prototype[t] = function() {
          var f5 = this.__wrapped__, c5 = r2 ? [1] : arguments, l4 = f5 instanceof H4, v5 = c5[0], _6 = l4 || O7(f5), m5 = function(D6) {
            var N6 = s2.apply(a3, nt2([D6], c5));
            return r2 && P4 ? N6[0] : N6;
          };
          _6 && e2 && typeof v5 == "function" && v5.length != 1 && (l4 = _6 = false);
          var P4 = this.__chain__, I2 = !!this.__actions__.length, E6 = o3 && !P4, b6 = l4 && !I2;
          if (!o3 && _6) {
            f5 = b6 ? f5 : new H4(this);
            var y7 = n4.apply(f5, c5);
            return y7.__actions__.push({ func: er3, args: [m5], thisArg: i3 }), new Pn5(y7, P4);
          }
          return E6 && b6 ? n4.apply(this, c5) : (y7 = this.thru(m5), E6 ? r2 ? y7.value()[0] : y7.value() : y7);
        });
      }), mn2(["pop", "push", "shift", "sort", "splice", "unshift"], function(n4) {
        var t = Oe[n4], e2 = /^(?:push|sort|unshift)$/.test(n4) ? "tap" : "thru", r2 = /^(?:pop|shift)$/.test(n4);
        a3.prototype[n4] = function() {
          var s2 = arguments;
          if (r2 && !this.__chain__) {
            var o3 = this.value();
            return t.apply(O7(o3) ? o3 : [], s2);
          }
          return this[e2](function(f5) {
            return t.apply(O7(f5) ? f5 : [], s2);
          });
        };
      }), $n(H4.prototype, function(n4, t) {
        var e2 = a3[t];
        if (e2) {
          var r2 = e2.name + "";
          F4.call(Ut2, r2) || (Ut2[r2] = []), Ut2[r2].push({ name: t, func: e2 });
        }
      }), Ut2[Xe4(i3, ct2).name] = [{ name: "wrapper", func: i3 }], H4.prototype.clone = Bf, H4.prototype.reverse = Gf, H4.prototype.value = zf, a3.prototype.at = wl, a3.prototype.chain = Pl, a3.prototype.commit = Al, a3.prototype.next = Cl, a3.prototype.plant = xl, a3.prototype.reverse = El, a3.prototype.toJSON = a3.prototype.valueOf = a3.prototype.value = yl, a3.prototype.first = a3.prototype.head, ne2 && (a3.prototype[ne2] = Il), a3;
    }, Ht3 = Af();
    lt3 ? ((lt3.exports = Ht3)._ = Ht3, Tr2._ = Ht3) : k7._ = Ht3;
  }).call(ge3);
})(Ui2, Ui2.exports);
var qg = Object.defineProperty;
var Bg = Object.defineProperties;
var Gg = Object.getOwnPropertyDescriptors;
var Ea = Object.getOwnPropertySymbols;
var zg = Object.prototype.hasOwnProperty;
var Kg = Object.prototype.propertyIsEnumerable;
var ya = (C4, u4, i3) => u4 in C4 ? qg(C4, u4, { enumerable: true, configurable: true, writable: true, value: i3 }) : C4[u4] = i3;
var cr2 = (C4, u4) => {
  for (var i3 in u4 || (u4 = {})) zg.call(u4, i3) && ya(C4, i3, u4[i3]);
  if (Ea) for (var i3 of Ea(u4)) Kg.call(u4, i3) && ya(C4, i3, u4[i3]);
  return C4;
};
var Yg = (C4, u4) => Bg(C4, Gg(u4));
function ft4(C4, u4, i3) {
  var d3;
  const w7 = ge2(C4);
  return ((d3 = u4.rpcMap) == null ? void 0 : d3[w7.reference]) || `${Mg}?chainId=${w7.namespace}:${w7.reference}&projectId=${i3}`;
}
function Ct2(C4) {
  return C4.includes(":") ? C4.split(":")[1] : C4;
}
function Sa(C4) {
  return C4.map((u4) => `${u4.split(":")[0]}:${u4.split(":")[1]}`);
}
function Zg(C4, u4) {
  const i3 = Object.keys(u4.namespaces).filter((w7) => w7.includes(C4));
  if (!i3.length) return [];
  const d3 = [];
  return i3.forEach((w7) => {
    const T5 = u4.namespaces[w7].accounts;
    d3.push(...T5);
  }), d3;
}
function Jg(C4 = {}, u4 = {}) {
  const i3 = Oa(C4), d3 = Oa(u4);
  return Ui2.exports.merge(i3, d3);
}
function Oa(C4) {
  var u4, i3, d3, w7;
  const T5 = {};
  if (!B3(C4)) return T5;
  for (const [$4, En] of Object.entries(C4)) {
    const zt3 = oe2($4) ? [$4] : En.chains, pr = En.methods || [], It3 = En.events || [], Ln3 = En.rpcMap || {}, Fn2 = Xe3($4);
    T5[Fn2] = Yg(cr2(cr2({}, T5[Fn2]), En), { chains: S4(zt3, (u4 = T5[Fn2]) == null ? void 0 : u4.chains), methods: S4(pr, (i3 = T5[Fn2]) == null ? void 0 : i3.methods), events: S4(It3, (d3 = T5[Fn2]) == null ? void 0 : d3.events), rpcMap: cr2(cr2({}, Ln3), (w7 = T5[Fn2]) == null ? void 0 : w7.rpcMap) });
  }
  return T5;
}
function Xg(C4) {
  return C4.includes(":") ? C4.split(":")[2] : C4;
}
function Qg(C4) {
  const u4 = {};
  for (const [i3, d3] of Object.entries(C4)) {
    const w7 = d3.methods || [], T5 = d3.events || [], $4 = d3.accounts || [], En = oe2(i3) ? [i3] : d3.chains ? d3.chains : Sa(d3.accounts);
    u4[i3] = { chains: En, methods: w7, events: T5, accounts: $4 };
  }
  return u4;
}
function Wi2(C4) {
  return typeof C4 == "number" ? C4 : C4.includes("0x") ? parseInt(C4, 16) : C4.includes(":") ? Number(C4.split(":")[1]) : Number(C4);
}
var Ra = {};
var z3 = (C4) => Ra[C4];
var Fi = (C4, u4) => {
  Ra[C4] = u4;
};
var Vg = class {
  constructor(u4) {
    this.name = "polkadot", this.namespace = u4.namespace, this.events = z3("events"), this.client = z3("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u4) {
    this.namespace = Object.assign(this.namespace, u4);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const u4 = this.namespace.chains[0];
    if (!u4) throw new Error("ChainId not found");
    return u4.split(":")[1];
  }
  request(u4) {
    return this.namespace.methods.includes(u4.request.method) ? this.client.request(u4) : this.getHttpProvider().request(u4.request);
  }
  setDefaultChain(u4, i3) {
    this.httpProviders[u4] || this.setHttpProvider(u4, i3), this.chainId = u4, this.events.emit(Vn2.DEFAULT_CHAIN_CHANGED, `${this.name}:${u4}`);
  }
  getAccounts() {
    const u4 = this.namespace.accounts;
    return u4 ? u4.filter((i3) => i3.split(":")[1] === this.chainId.toString()).map((i3) => i3.split(":")[2]) || [] : [];
  }
  createHttpProviders() {
    const u4 = {};
    return this.namespace.chains.forEach((i3) => {
      var d3;
      const w7 = Ct2(i3);
      u4[w7] = this.createHttpProvider(w7, (d3 = this.namespace.rpcMap) == null ? void 0 : d3[i3]);
    }), u4;
  }
  getHttpProvider() {
    const u4 = `${this.name}:${this.chainId}`, i3 = this.httpProviders[u4];
    if (typeof i3 > "u") throw new Error(`JSON-RPC provider for ${u4} not found`);
    return i3;
  }
  setHttpProvider(u4, i3) {
    const d3 = this.createHttpProvider(u4, i3);
    d3 && (this.httpProviders[u4] = d3);
  }
  createHttpProvider(u4, i3) {
    const d3 = i3 || ft4(u4, this.namespace, this.client.core.projectId);
    if (!d3) throw new Error(`No RPC url provided for chainId: ${u4}`);
    return new JsonRpcProvider2(new f3(d3, z3("disableProviderPing")));
  }
};
var kg = class {
  constructor(u4) {
    this.name = "eip155", this.namespace = u4.namespace, this.events = z3("events"), this.client = z3("client"), this.httpProviders = this.createHttpProviders(), this.chainId = parseInt(this.getDefaultChain());
  }
  async request(u4) {
    switch (u4.request.method) {
      case "eth_requestAccounts":
        return this.getAccounts();
      case "eth_accounts":
        return this.getAccounts();
      case "wallet_switchEthereumChain":
        return await this.handleSwitchChain(u4);
      case "eth_chainId":
        return parseInt(this.getDefaultChain());
    }
    return this.namespace.methods.includes(u4.request.method) ? await this.client.request(u4) : this.getHttpProvider().request(u4.request);
  }
  updateNamespace(u4) {
    this.namespace = Object.assign(this.namespace, u4);
  }
  setDefaultChain(u4, i3) {
    this.httpProviders[u4] || this.setHttpProvider(parseInt(u4), i3), this.chainId = parseInt(u4), this.events.emit(Vn2.DEFAULT_CHAIN_CHANGED, `${this.name}:${u4}`);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId.toString();
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const u4 = this.namespace.chains[0];
    if (!u4) throw new Error("ChainId not found");
    return u4.split(":")[1];
  }
  createHttpProvider(u4, i3) {
    const d3 = i3 || ft4(`${this.name}:${u4}`, this.namespace, this.client.core.projectId);
    if (!d3) throw new Error(`No RPC url provided for chainId: ${u4}`);
    return new JsonRpcProvider2(new f3(d3, z3("disableProviderPing")));
  }
  setHttpProvider(u4, i3) {
    const d3 = this.createHttpProvider(u4, i3);
    d3 && (this.httpProviders[u4] = d3);
  }
  createHttpProviders() {
    const u4 = {};
    return this.namespace.chains.forEach((i3) => {
      var d3;
      const w7 = parseInt(Ct2(i3));
      u4[w7] = this.createHttpProvider(w7, (d3 = this.namespace.rpcMap) == null ? void 0 : d3[i3]);
    }), u4;
  }
  getAccounts() {
    const u4 = this.namespace.accounts;
    return u4 ? [...new Set(u4.filter((i3) => i3.split(":")[1] === this.chainId.toString()).map((i3) => i3.split(":")[2]))] : [];
  }
  getHttpProvider() {
    const u4 = this.chainId, i3 = this.httpProviders[u4];
    if (typeof i3 > "u") throw new Error(`JSON-RPC provider for ${u4} not found`);
    return i3;
  }
  async handleSwitchChain(u4) {
    var i3, d3;
    let w7 = u4.request.params ? (i3 = u4.request.params[0]) == null ? void 0 : i3.chainId : "0x0";
    w7 = w7.startsWith("0x") ? w7 : `0x${w7}`;
    const T5 = parseInt(w7, 16);
    if (this.isChainApproved(T5)) this.setDefaultChain(`${T5}`);
    else if (this.namespace.methods.includes("wallet_switchEthereumChain")) await this.client.request({ topic: u4.topic, request: { method: u4.request.method, params: [{ chainId: w7 }] }, chainId: (d3 = this.namespace.chains) == null ? void 0 : d3[0] }), this.setDefaultChain(`${T5}`);
    else throw new Error(`Failed to switch to chain 'eip155:${T5}'. The chain is not approved or the wallet does not support 'wallet_switchEthereumChain' method.`);
    return null;
  }
  isChainApproved(u4) {
    return this.namespace.chains.includes(`${this.name}:${u4}`);
  }
};
var jg = class {
  constructor(u4) {
    this.name = "solana", this.namespace = u4.namespace, this.events = z3("events"), this.client = z3("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u4) {
    this.namespace = Object.assign(this.namespace, u4);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  request(u4) {
    return this.namespace.methods.includes(u4.request.method) ? this.client.request(u4) : this.getHttpProvider().request(u4.request);
  }
  setDefaultChain(u4, i3) {
    this.httpProviders[u4] || this.setHttpProvider(u4, i3), this.chainId = u4, this.events.emit(Vn2.DEFAULT_CHAIN_CHANGED, `${this.name}:${u4}`);
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const u4 = this.namespace.chains[0];
    if (!u4) throw new Error("ChainId not found");
    return u4.split(":")[1];
  }
  getAccounts() {
    const u4 = this.namespace.accounts;
    return u4 ? [...new Set(u4.filter((i3) => i3.split(":")[1] === this.chainId.toString()).map((i3) => i3.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const u4 = {};
    return this.namespace.chains.forEach((i3) => {
      var d3;
      const w7 = Ct2(i3);
      u4[w7] = this.createHttpProvider(w7, (d3 = this.namespace.rpcMap) == null ? void 0 : d3[i3]);
    }), u4;
  }
  getHttpProvider() {
    const u4 = `${this.name}:${this.chainId}`, i3 = this.httpProviders[u4];
    if (typeof i3 > "u") throw new Error(`JSON-RPC provider for ${u4} not found`);
    return i3;
  }
  setHttpProvider(u4, i3) {
    const d3 = this.createHttpProvider(u4, i3);
    d3 && (this.httpProviders[u4] = d3);
  }
  createHttpProvider(u4, i3) {
    const d3 = i3 || ft4(u4, this.namespace, this.client.core.projectId);
    if (!d3) throw new Error(`No RPC url provided for chainId: ${u4}`);
    return new JsonRpcProvider2(new f3(d3, z3("disableProviderPing")));
  }
};
var nv = class {
  constructor(u4) {
    this.name = "cosmos", this.namespace = u4.namespace, this.events = z3("events"), this.client = z3("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u4) {
    this.namespace = Object.assign(this.namespace, u4);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const u4 = this.namespace.chains[0];
    if (!u4) throw new Error("ChainId not found");
    return u4.split(":")[1];
  }
  request(u4) {
    return this.namespace.methods.includes(u4.request.method) ? this.client.request(u4) : this.getHttpProvider().request(u4.request);
  }
  setDefaultChain(u4, i3) {
    this.httpProviders[u4] || this.setHttpProvider(u4, i3), this.chainId = u4, this.events.emit(Vn2.DEFAULT_CHAIN_CHANGED, `${this.name}:${this.chainId}`);
  }
  getAccounts() {
    const u4 = this.namespace.accounts;
    return u4 ? [...new Set(u4.filter((i3) => i3.split(":")[1] === this.chainId.toString()).map((i3) => i3.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const u4 = {};
    return this.namespace.chains.forEach((i3) => {
      var d3;
      const w7 = Ct2(i3);
      u4[w7] = this.createHttpProvider(w7, (d3 = this.namespace.rpcMap) == null ? void 0 : d3[i3]);
    }), u4;
  }
  getHttpProvider() {
    const u4 = `${this.name}:${this.chainId}`, i3 = this.httpProviders[u4];
    if (typeof i3 > "u") throw new Error(`JSON-RPC provider for ${u4} not found`);
    return i3;
  }
  setHttpProvider(u4, i3) {
    const d3 = this.createHttpProvider(u4, i3);
    d3 && (this.httpProviders[u4] = d3);
  }
  createHttpProvider(u4, i3) {
    const d3 = i3 || ft4(u4, this.namespace, this.client.core.projectId);
    if (!d3) throw new Error(`No RPC url provided for chainId: ${u4}`);
    return new JsonRpcProvider2(new f3(d3, z3("disableProviderPing")));
  }
};
var tv = class {
  constructor(u4) {
    this.name = "cip34", this.namespace = u4.namespace, this.events = z3("events"), this.client = z3("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u4) {
    this.namespace = Object.assign(this.namespace, u4);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const u4 = this.namespace.chains[0];
    if (!u4) throw new Error("ChainId not found");
    return u4.split(":")[1];
  }
  request(u4) {
    return this.namespace.methods.includes(u4.request.method) ? this.client.request(u4) : this.getHttpProvider().request(u4.request);
  }
  setDefaultChain(u4, i3) {
    this.httpProviders[u4] || this.setHttpProvider(u4, i3), this.chainId = u4, this.events.emit(Vn2.DEFAULT_CHAIN_CHANGED, `${this.name}:${this.chainId}`);
  }
  getAccounts() {
    const u4 = this.namespace.accounts;
    return u4 ? [...new Set(u4.filter((i3) => i3.split(":")[1] === this.chainId.toString()).map((i3) => i3.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const u4 = {};
    return this.namespace.chains.forEach((i3) => {
      const d3 = this.getCardanoRPCUrl(i3), w7 = Ct2(i3);
      u4[w7] = this.createHttpProvider(w7, d3);
    }), u4;
  }
  getHttpProvider() {
    const u4 = `${this.name}:${this.chainId}`, i3 = this.httpProviders[u4];
    if (typeof i3 > "u") throw new Error(`JSON-RPC provider for ${u4} not found`);
    return i3;
  }
  getCardanoRPCUrl(u4) {
    const i3 = this.namespace.rpcMap;
    if (i3) return i3[u4];
  }
  setHttpProvider(u4, i3) {
    const d3 = this.createHttpProvider(u4, i3);
    d3 && (this.httpProviders[u4] = d3);
  }
  createHttpProvider(u4, i3) {
    const d3 = i3 || this.getCardanoRPCUrl(u4);
    if (!d3) throw new Error(`No RPC url provided for chainId: ${u4}`);
    return new JsonRpcProvider2(new f3(d3, z3("disableProviderPing")));
  }
};
var ev = class {
  constructor(u4) {
    this.name = "elrond", this.namespace = u4.namespace, this.events = z3("events"), this.client = z3("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u4) {
    this.namespace = Object.assign(this.namespace, u4);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  request(u4) {
    return this.namespace.methods.includes(u4.request.method) ? this.client.request(u4) : this.getHttpProvider().request(u4.request);
  }
  setDefaultChain(u4, i3) {
    this.httpProviders[u4] || this.setHttpProvider(u4, i3), this.chainId = u4, this.events.emit(Vn2.DEFAULT_CHAIN_CHANGED, `${this.name}:${u4}`);
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const u4 = this.namespace.chains[0];
    if (!u4) throw new Error("ChainId not found");
    return u4.split(":")[1];
  }
  getAccounts() {
    const u4 = this.namespace.accounts;
    return u4 ? [...new Set(u4.filter((i3) => i3.split(":")[1] === this.chainId.toString()).map((i3) => i3.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const u4 = {};
    return this.namespace.chains.forEach((i3) => {
      var d3;
      const w7 = Ct2(i3);
      u4[w7] = this.createHttpProvider(w7, (d3 = this.namespace.rpcMap) == null ? void 0 : d3[i3]);
    }), u4;
  }
  getHttpProvider() {
    const u4 = `${this.name}:${this.chainId}`, i3 = this.httpProviders[u4];
    if (typeof i3 > "u") throw new Error(`JSON-RPC provider for ${u4} not found`);
    return i3;
  }
  setHttpProvider(u4, i3) {
    const d3 = this.createHttpProvider(u4, i3);
    d3 && (this.httpProviders[u4] = d3);
  }
  createHttpProvider(u4, i3) {
    const d3 = i3 || ft4(u4, this.namespace, this.client.core.projectId);
    if (!d3) throw new Error(`No RPC url provided for chainId: ${u4}`);
    return new JsonRpcProvider2(new f3(d3, z3("disableProviderPing")));
  }
};
var rv = class {
  constructor(u4) {
    this.name = "multiversx", this.namespace = u4.namespace, this.events = z3("events"), this.client = z3("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u4) {
    this.namespace = Object.assign(this.namespace, u4);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  request(u4) {
    return this.namespace.methods.includes(u4.request.method) ? this.client.request(u4) : this.getHttpProvider().request(u4.request);
  }
  setDefaultChain(u4, i3) {
    this.httpProviders[u4] || this.setHttpProvider(u4, i3), this.chainId = u4, this.events.emit(Vn2.DEFAULT_CHAIN_CHANGED, `${this.name}:${u4}`);
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const u4 = this.namespace.chains[0];
    if (!u4) throw new Error("ChainId not found");
    return u4.split(":")[1];
  }
  getAccounts() {
    const u4 = this.namespace.accounts;
    return u4 ? [...new Set(u4.filter((i3) => i3.split(":")[1] === this.chainId.toString()).map((i3) => i3.split(":")[2]))] : [];
  }
  createHttpProviders() {
    const u4 = {};
    return this.namespace.chains.forEach((i3) => {
      var d3;
      const w7 = Ct2(i3);
      u4[w7] = this.createHttpProvider(w7, (d3 = this.namespace.rpcMap) == null ? void 0 : d3[i3]);
    }), u4;
  }
  getHttpProvider() {
    const u4 = `${this.name}:${this.chainId}`, i3 = this.httpProviders[u4];
    if (typeof i3 > "u") throw new Error(`JSON-RPC provider for ${u4} not found`);
    return i3;
  }
  setHttpProvider(u4, i3) {
    const d3 = this.createHttpProvider(u4, i3);
    d3 && (this.httpProviders[u4] = d3);
  }
  createHttpProvider(u4, i3) {
    const d3 = i3 || ft4(u4, this.namespace, this.client.core.projectId);
    if (!d3) throw new Error(`No RPC url provided for chainId: ${u4}`);
    return new JsonRpcProvider2(new f3(d3, z3("disableProviderPing")));
  }
};
var iv = class {
  constructor(u4) {
    this.name = "near", this.namespace = u4.namespace, this.events = z3("events"), this.client = z3("client"), this.chainId = this.getDefaultChain(), this.httpProviders = this.createHttpProviders();
  }
  updateNamespace(u4) {
    this.namespace = Object.assign(this.namespace, u4);
  }
  requestAccounts() {
    return this.getAccounts();
  }
  getDefaultChain() {
    if (this.chainId) return this.chainId;
    if (this.namespace.defaultChain) return this.namespace.defaultChain;
    const u4 = this.namespace.chains[0];
    if (!u4) throw new Error("ChainId not found");
    return u4.split(":")[1];
  }
  request(u4) {
    return this.namespace.methods.includes(u4.request.method) ? this.client.request(u4) : this.getHttpProvider().request(u4.request);
  }
  setDefaultChain(u4, i3) {
    if (this.chainId = u4, !this.httpProviders[u4]) {
      const d3 = i3 || ft4(`${this.name}:${u4}`, this.namespace);
      if (!d3) throw new Error(`No RPC url provided for chainId: ${u4}`);
      this.setHttpProvider(u4, d3);
    }
    this.events.emit(Vn2.DEFAULT_CHAIN_CHANGED, `${this.name}:${this.chainId}`);
  }
  getAccounts() {
    const u4 = this.namespace.accounts;
    return u4 ? u4.filter((i3) => i3.split(":")[1] === this.chainId.toString()).map((i3) => i3.split(":")[2]) || [] : [];
  }
  createHttpProviders() {
    const u4 = {};
    return this.namespace.chains.forEach((i3) => {
      var d3;
      u4[i3] = this.createHttpProvider(i3, (d3 = this.namespace.rpcMap) == null ? void 0 : d3[i3]);
    }), u4;
  }
  getHttpProvider() {
    const u4 = `${this.name}:${this.chainId}`, i3 = this.httpProviders[u4];
    if (typeof i3 > "u") throw new Error(`JSON-RPC provider for ${u4} not found`);
    return i3;
  }
  setHttpProvider(u4, i3) {
    const d3 = this.createHttpProvider(u4, i3);
    d3 && (this.httpProviders[u4] = d3);
  }
  createHttpProvider(u4, i3) {
    const d3 = i3 || ft4(u4, this.namespace);
    return typeof d3 > "u" ? void 0 : new JsonRpcProvider2(new f3(d3, z3("disableProviderPing")));
  }
};
var sv = Object.defineProperty;
var uv = Object.defineProperties;
var av = Object.getOwnPropertyDescriptors;
var ba = Object.getOwnPropertySymbols;
var ov = Object.prototype.hasOwnProperty;
var fv = Object.prototype.propertyIsEnumerable;
var Ta = (C4, u4, i3) => u4 in C4 ? sv(C4, u4, { enumerable: true, configurable: true, writable: true, value: i3 }) : C4[u4] = i3;
var hr2 = (C4, u4) => {
  for (var i3 in u4 || (u4 = {})) ov.call(u4, i3) && Ta(C4, i3, u4[i3]);
  if (ba) for (var i3 of ba(u4)) fv.call(u4, i3) && Ta(C4, i3, u4[i3]);
  return C4;
};
var Mi = (C4, u4) => uv(C4, av(u4));
var lr2 = class _lr {
  constructor(u4) {
    this.events = new import_events9.default(), this.rpcProviders = {}, this.shouldAbortPairingAttempt = false, this.maxPairingAttempts = 10, this.disableProviderPing = false, this.providerOpts = u4, this.logger = typeof (u4 == null ? void 0 : u4.logger) < "u" && typeof (u4 == null ? void 0 : u4.logger) != "string" ? u4.logger : (0, import_pino2.default)(k3({ level: (u4 == null ? void 0 : u4.logger) || Ia })), this.disableProviderPing = (u4 == null ? void 0 : u4.disableProviderPing) || false;
  }
  static async init(u4) {
    const i3 = new _lr(u4);
    return await i3.initialize(), i3;
  }
  async request(u4, i3) {
    const [d3, w7] = this.validateChain(i3);
    if (!this.session) throw new Error("Please call connect() before request()");
    return await this.getProvider(d3).request({ request: hr2({}, u4), chainId: `${d3}:${w7}`, topic: this.session.topic });
  }
  sendAsync(u4, i3, d3) {
    this.request(u4, d3).then((w7) => i3(null, w7)).catch((w7) => i3(w7, void 0));
  }
  async enable() {
    if (!this.client) throw new Error("Sign Client not initialized");
    return this.session || await this.connect({ namespaces: this.namespaces, optionalNamespaces: this.optionalNamespaces, sessionProperties: this.sessionProperties }), await this.requestAccounts();
  }
  async disconnect() {
    var u4;
    if (!this.session) throw new Error("Please call connect() before enable()");
    await this.client.disconnect({ topic: (u4 = this.session) == null ? void 0 : u4.topic, reason: U7("USER_DISCONNECTED") }), await this.cleanup();
  }
  async connect(u4) {
    if (!this.client) throw new Error("Sign Client not initialized");
    if (this.setNamespaces(u4), await this.cleanupPendingPairings(), !u4.skipPairing) return await this.pair(u4.pairingTopic);
  }
  on(u4, i3) {
    this.events.on(u4, i3);
  }
  once(u4, i3) {
    this.events.once(u4, i3);
  }
  removeListener(u4, i3) {
    this.events.removeListener(u4, i3);
  }
  off(u4, i3) {
    this.events.off(u4, i3);
  }
  get isWalletConnect() {
    return true;
  }
  async pair(u4) {
    this.shouldAbortPairingAttempt = false;
    let i3 = 0;
    do {
      if (this.shouldAbortPairingAttempt) throw new Error("Pairing aborted");
      if (i3 >= this.maxPairingAttempts) throw new Error("Max auto pairing attempts reached");
      const { uri: d3, approval: w7 } = await this.client.connect({ pairingTopic: u4, requiredNamespaces: this.namespaces, optionalNamespaces: this.optionalNamespaces, sessionProperties: this.sessionProperties });
      d3 && (this.uri = d3, this.events.emit("display_uri", d3)), await w7().then((T5) => {
        this.session = T5, this.namespaces || (this.namespaces = Qg(T5.namespaces), this.persist("namespaces", this.namespaces));
      }).catch((T5) => {
        if (T5.message !== oe) throw T5;
        i3++;
      });
    } while (!this.session);
    return this.onConnect(), this.session;
  }
  setDefaultChain(u4, i3) {
    try {
      if (!this.session) return;
      const [d3, w7] = this.validateChain(u4);
      this.getProvider(d3).setDefaultChain(w7, i3);
    } catch (d3) {
      if (!/Please call connect/.test(d3.message)) throw d3;
    }
  }
  async cleanupPendingPairings(u4 = {}) {
    this.logger.info("Cleaning up inactive pairings...");
    const i3 = this.client.pairing.getAll();
    if (k6(i3)) {
      for (const d3 of i3) u4.deletePairings ? this.client.core.expirer.set(d3.topic, 0) : await this.client.core.relayer.subscriber.unsubscribe(d3.topic);
      this.logger.info(`Inactive pairings cleared: ${i3.length}`);
    }
  }
  abortPairingAttempt() {
    this.shouldAbortPairingAttempt = true;
  }
  async checkStorage() {
    if (this.namespaces = await this.getFromStore("namespaces"), this.optionalNamespaces = await this.getFromStore("optionalNamespaces") || {}, this.client.session.length) {
      const u4 = this.client.session.keys.length - 1;
      this.session = this.client.session.get(this.client.session.keys[u4]), this.createProviders();
    }
  }
  async initialize() {
    this.logger.trace("Initialized"), await this.createClient(), await this.checkStorage(), this.registerEventListeners();
  }
  async createClient() {
    this.client = this.providerOpts.client || await Q3.init({ logger: this.providerOpts.logger || Ia, relayUrl: this.providerOpts.relayUrl || Ug, projectId: this.providerOpts.projectId, metadata: this.providerOpts.metadata, storageOptions: this.providerOpts.storageOptions, storage: this.providerOpts.storage, name: this.providerOpts.name }), this.logger.trace("SignClient Initialized");
  }
  createProviders() {
    if (!this.client) throw new Error("Sign Client not initialized");
    if (!this.session) throw new Error("Session not initialized. Please call connect() before enable()");
    const u4 = [...new Set(Object.keys(this.session.namespaces).map((i3) => Xe3(i3)))];
    Fi("client", this.client), Fi("events", this.events), Fi("disableProviderPing", this.disableProviderPing), u4.forEach((i3) => {
      if (!this.session) return;
      const d3 = Zg(i3, this.session), w7 = Sa(d3), T5 = Jg(this.namespaces, this.optionalNamespaces), $4 = Mi(hr2({}, T5[i3]), { accounts: d3, chains: w7 });
      switch (i3) {
        case "eip155":
          this.rpcProviders[i3] = new kg({ namespace: $4 });
          break;
        case "solana":
          this.rpcProviders[i3] = new jg({ namespace: $4 });
          break;
        case "cosmos":
          this.rpcProviders[i3] = new nv({ namespace: $4 });
          break;
        case "polkadot":
          this.rpcProviders[i3] = new Vg({ namespace: $4 });
          break;
        case "cip34":
          this.rpcProviders[i3] = new tv({ namespace: $4 });
          break;
        case "elrond":
          this.rpcProviders[i3] = new ev({ namespace: $4 });
          break;
        case "multiversx":
          this.rpcProviders[i3] = new rv({ namespace: $4 });
          break;
        case "near":
          this.rpcProviders[i3] = new iv({ namespace: $4 });
          break;
      }
    });
  }
  registerEventListeners() {
    if (typeof this.client > "u") throw new Error("Sign Client is not initialized");
    this.client.on("session_ping", (u4) => {
      this.events.emit("session_ping", u4);
    }), this.client.on("session_event", (u4) => {
      const { params: i3 } = u4, { event: d3 } = i3;
      if (d3.name === "accountsChanged") {
        const w7 = d3.data;
        w7 && k6(w7) && this.events.emit("accountsChanged", w7.map(Xg));
      } else if (d3.name === "chainChanged") {
        const w7 = i3.chainId, T5 = i3.event.data, $4 = Xe3(w7), En = Wi2(w7) !== Wi2(T5) ? `${$4}:${Wi2(T5)}` : w7;
        this.onChainChanged(En);
      } else this.events.emit(d3.name, d3.data);
      this.events.emit("session_event", u4);
    }), this.client.on("session_update", ({ topic: u4, params: i3 }) => {
      var d3;
      const { namespaces: w7 } = i3, T5 = (d3 = this.client) == null ? void 0 : d3.session.get(u4);
      this.session = Mi(hr2({}, T5), { namespaces: w7 }), this.onSessionUpdate(), this.events.emit("session_update", { topic: u4, params: i3 });
    }), this.client.on("session_delete", async (u4) => {
      await this.cleanup(), this.events.emit("session_delete", u4), this.events.emit("disconnect", Mi(hr2({}, U7("USER_DISCONNECTED")), { data: u4.topic }));
    }), this.on(Vn2.DEFAULT_CHAIN_CHANGED, (u4) => {
      this.onChainChanged(u4, true);
    });
  }
  getProvider(u4) {
    if (!this.rpcProviders[u4]) throw new Error(`Provider not found: ${u4}`);
    return this.rpcProviders[u4];
  }
  onSessionUpdate() {
    Object.keys(this.rpcProviders).forEach((u4) => {
      var i3;
      this.getProvider(u4).updateNamespace((i3 = this.session) == null ? void 0 : i3.namespaces[u4]);
    });
  }
  setNamespaces(u4) {
    const { namespaces: i3, optionalNamespaces: d3, sessionProperties: w7 } = u4;
    i3 && Object.keys(i3).length && (this.namespaces = i3), d3 && Object.keys(d3).length && (this.optionalNamespaces = d3), this.sessionProperties = w7, this.persist("namespaces", i3), this.persist("optionalNamespaces", d3);
  }
  validateChain(u4) {
    const [i3, d3] = (u4 == null ? void 0 : u4.split(":")) || ["", ""];
    if (!this.namespaces || !Object.keys(this.namespaces).length) return [i3, d3];
    if (i3 && !Object.keys(this.namespaces || {}).map(($4) => Xe3($4)).includes(i3)) throw new Error(`Namespace '${i3}' is not configured. Please call connect() first with namespace config.`);
    if (i3 && d3) return [i3, d3];
    const w7 = Xe3(Object.keys(this.namespaces)[0]), T5 = this.rpcProviders[w7].getDefaultChain();
    return [w7, T5];
  }
  async requestAccounts() {
    const [u4] = this.validateChain();
    return await this.getProvider(u4).requestAccounts();
  }
  onChainChanged(u4, i3 = false) {
    var d3;
    if (!this.namespaces) return;
    const [w7, T5] = this.validateChain(u4);
    i3 || this.getProvider(w7).setDefaultChain(T5), ((d3 = this.namespaces[w7]) != null ? d3 : this.namespaces[`${w7}:${T5}`]).defaultChain = T5, this.persist("namespaces", this.namespaces), this.events.emit("chainChanged", T5);
  }
  onConnect() {
    this.createProviders(), this.events.emit("connect", { session: this.session });
  }
  async cleanup() {
    this.session = void 0, this.namespaces = void 0, this.optionalNamespaces = void 0, this.sessionProperties = void 0, this.persist("namespaces", void 0), this.persist("optionalNamespaces", void 0), this.persist("sessionProperties", void 0), await this.cleanupPendingPairings({ deletePairings: true });
  }
  persist(u4, i3) {
    this.client.core.storage.setItem(`${xa}/${u4}`, i3);
  }
  async getFromStore(u4) {
    return await this.client.core.storage.getItem(`${xa}/${u4}`);
  }
};
var cv = lr2;

// node_modules/@walletconnect/ethereum-provider/dist/index.es.js
var P3 = "wc";
var S5 = "ethereum_provider";
var $3 = `${P3}@2:${S5}:`;
var j3 = "https://rpc.walletconnect.com/v1/";
var u3 = ["eth_sendTransaction", "personal_sign"];
var E5 = ["eth_accounts", "eth_requestAccounts", "eth_sendRawTransaction", "eth_sign", "eth_signTransaction", "eth_signTypedData", "eth_signTypedData_v3", "eth_signTypedData_v4", "eth_sendTransaction", "personal_sign", "wallet_switchEthereumChain", "wallet_addEthereumChain", "wallet_getPermissions", "wallet_requestPermissions", "wallet_registerOnboarding", "wallet_watchAsset", "wallet_scanQRCode"];
var m4 = ["chainChanged", "accountsChanged"];
var _5 = ["chainChanged", "accountsChanged", "message", "disconnect", "connect"];
var N5 = Object.defineProperty;
var q2 = Object.defineProperties;
var D5 = Object.getOwnPropertyDescriptors;
var y6 = Object.getOwnPropertySymbols;
var U8 = Object.prototype.hasOwnProperty;
var Q4 = Object.prototype.propertyIsEnumerable;
var O6 = (a3, t, s2) => t in a3 ? N5(a3, t, { enumerable: true, configurable: true, writable: true, value: s2 }) : a3[t] = s2;
var p6 = (a3, t) => {
  for (var s2 in t || (t = {})) U8.call(t, s2) && O6(a3, s2, t[s2]);
  if (y6) for (var s2 of y6(t)) Q4.call(t, s2) && O6(a3, s2, t[s2]);
  return a3;
};
var M6 = (a3, t) => q2(a3, D5(t));
function g6(a3) {
  return Number(a3[0].split(":")[1]);
}
function f4(a3) {
  return `0x${a3.toString(16)}`;
}
function L4(a3) {
  const { chains: t, optionalChains: s2, methods: i3, optionalMethods: n4, events: e2, optionalEvents: h7, rpcMap: c5 } = a3;
  if (!k(t)) throw new Error("Invalid chains");
  const o3 = { chains: t, methods: i3 || u3, events: e2 || m4, rpcMap: p6({}, t.length ? { [g6(t)]: c5[g6(t)] } : {}) }, r2 = e2 == null ? void 0 : e2.filter((l4) => !m4.includes(l4)), d3 = i3 == null ? void 0 : i3.filter((l4) => !u3.includes(l4));
  if (!s2 && !h7 && !n4 && !(r2 != null && r2.length) && !(d3 != null && d3.length)) return { required: t.length ? o3 : void 0 };
  const C4 = (r2 == null ? void 0 : r2.length) && (d3 == null ? void 0 : d3.length) || !s2, I2 = { chains: [...new Set(C4 ? o3.chains.concat(s2 || []) : s2)], methods: [...new Set(o3.methods.concat(n4 != null && n4.length ? n4 : E5))], events: [...new Set(o3.events.concat(h7 != null && h7.length ? h7 : _5))], rpcMap: c5 };
  return { required: t.length ? o3 : void 0, optional: s2.length ? I2 : void 0 };
}
var v4 = class _v {
  constructor() {
    this.events = new import_events10.EventEmitter(), this.namespace = "eip155", this.accounts = [], this.chainId = 1, this.STORAGE_KEY = $3, this.on = (t, s2) => (this.events.on(t, s2), this), this.once = (t, s2) => (this.events.once(t, s2), this), this.removeListener = (t, s2) => (this.events.removeListener(t, s2), this), this.off = (t, s2) => (this.events.off(t, s2), this), this.parseAccount = (t) => this.isCompatibleChainId(t) ? this.parseAccountId(t).address : t, this.signer = {}, this.rpc = {};
  }
  static async init(t) {
    const s2 = new _v();
    return await s2.initialize(t), s2;
  }
  async request(t) {
    return await this.signer.request(t, this.formatChainId(this.chainId));
  }
  sendAsync(t, s2) {
    this.signer.sendAsync(t, s2, this.formatChainId(this.chainId));
  }
  get connected() {
    return this.signer.client ? this.signer.client.core.relayer.connected : false;
  }
  get connecting() {
    return this.signer.client ? this.signer.client.core.relayer.connecting : false;
  }
  async enable() {
    return this.session || await this.connect(), await this.request({ method: "eth_requestAccounts" });
  }
  async connect(t) {
    if (!this.signer.client) throw new Error("Provider not initialized. Call init() first");
    this.loadConnectOpts(t);
    const { required: s2, optional: i3 } = L4(this.rpc);
    try {
      const n4 = await new Promise(async (h7, c5) => {
        var o3;
        this.rpc.showQrModal && ((o3 = this.modal) == null || o3.subscribeModal((r2) => {
          !r2.open && !this.signer.session && (this.signer.abortPairingAttempt(), c5(new Error("Connection request reset. Please try again.")));
        })), await this.signer.connect(M6(p6({ namespaces: p6({}, s2 && { [this.namespace]: s2 }) }, i3 && { optionalNamespaces: { [this.namespace]: i3 } }), { pairingTopic: t == null ? void 0 : t.pairingTopic })).then((r2) => {
          h7(r2);
        }).catch((r2) => {
          c5(new Error(r2.message));
        });
      });
      if (!n4) return;
      const e2 = Un(n4.namespaces, [this.namespace]);
      this.setChainIds(this.rpc.chains.length ? this.rpc.chains : e2), this.setAccounts(e2), this.events.emit("connect", { chainId: f4(this.chainId) });
    } catch (n4) {
      throw this.signer.logger.error(n4), n4;
    } finally {
      this.modal && this.modal.closeModal();
    }
  }
  async disconnect() {
    this.session && await this.signer.disconnect(), this.reset();
  }
  get isWalletConnect() {
    return true;
  }
  get session() {
    return this.signer.session;
  }
  registerEventListeners() {
    this.signer.on("session_event", (t) => {
      const { params: s2 } = t, { event: i3 } = s2;
      i3.name === "accountsChanged" ? (this.accounts = this.parseAccounts(i3.data), this.events.emit("accountsChanged", this.accounts)) : i3.name === "chainChanged" ? this.setChainId(this.formatChainId(i3.data)) : this.events.emit(i3.name, i3.data), this.events.emit("session_event", t);
    }), this.signer.on("chainChanged", (t) => {
      const s2 = parseInt(t);
      this.chainId = s2, this.events.emit("chainChanged", f4(this.chainId)), this.persist();
    }), this.signer.on("session_update", (t) => {
      this.events.emit("session_update", t);
    }), this.signer.on("session_delete", (t) => {
      this.reset(), this.events.emit("session_delete", t), this.events.emit("disconnect", M6(p6({}, U("USER_DISCONNECTED")), { data: t.topic, name: "USER_DISCONNECTED" }));
    }), this.signer.on("display_uri", (t) => {
      var s2, i3;
      this.rpc.showQrModal && ((s2 = this.modal) == null || s2.closeModal(), (i3 = this.modal) == null || i3.openModal({ uri: t })), this.events.emit("display_uri", t);
    });
  }
  switchEthereumChain(t) {
    this.request({ method: "wallet_switchEthereumChain", params: [{ chainId: t.toString(16) }] });
  }
  isCompatibleChainId(t) {
    return typeof t == "string" ? t.startsWith(`${this.namespace}:`) : false;
  }
  formatChainId(t) {
    return `${this.namespace}:${t}`;
  }
  parseChainId(t) {
    return Number(t.split(":")[1]);
  }
  setChainIds(t) {
    const s2 = t.filter((i3) => this.isCompatibleChainId(i3)).map((i3) => this.parseChainId(i3));
    s2.length && (this.chainId = s2[0], this.events.emit("chainChanged", f4(this.chainId)), this.persist());
  }
  setChainId(t) {
    if (this.isCompatibleChainId(t)) {
      const s2 = this.parseChainId(t);
      this.chainId = s2, this.switchEthereumChain(s2);
    }
  }
  parseAccountId(t) {
    const [s2, i3, n4] = t.split(":");
    return { chainId: `${s2}:${i3}`, address: n4 };
  }
  setAccounts(t) {
    this.accounts = t.filter((s2) => this.parseChainId(this.parseAccountId(s2).chainId) === this.chainId).map((s2) => this.parseAccountId(s2).address), this.events.emit("accountsChanged", this.accounts);
  }
  getRpcConfig(t) {
    var s2, i3;
    const n4 = (s2 = t == null ? void 0 : t.chains) != null ? s2 : [], e2 = (i3 = t == null ? void 0 : t.optionalChains) != null ? i3 : [], h7 = n4.concat(e2);
    if (!h7.length) throw new Error("No chains specified in either `chains` or `optionalChains`");
    const c5 = n4.length ? (t == null ? void 0 : t.methods) || u3 : [], o3 = n4.length ? (t == null ? void 0 : t.events) || m4 : [], r2 = (t == null ? void 0 : t.optionalMethods) || [], d3 = (t == null ? void 0 : t.optionalEvents) || [], C4 = (t == null ? void 0 : t.rpcMap) || this.buildRpcMap(h7, t.projectId), I2 = (t == null ? void 0 : t.qrModalOptions) || void 0;
    return { chains: n4 == null ? void 0 : n4.map((l4) => this.formatChainId(l4)), optionalChains: e2.map((l4) => this.formatChainId(l4)), methods: c5, events: o3, optionalMethods: r2, optionalEvents: d3, rpcMap: C4, showQrModal: !!(t != null && t.showQrModal), qrModalOptions: I2, projectId: t.projectId, metadata: t.metadata };
  }
  buildRpcMap(t, s2) {
    const i3 = {};
    return t.forEach((n4) => {
      i3[n4] = this.getRpcUrl(n4, s2);
    }), i3;
  }
  async initialize(t) {
    if (this.rpc = this.getRpcConfig(t), this.chainId = this.rpc.chains.length ? g6(this.rpc.chains) : g6(this.rpc.optionalChains), this.signer = await cv.init({ projectId: this.rpc.projectId, metadata: this.rpc.metadata, disableProviderPing: t.disableProviderPing, relayUrl: t.relayUrl, storageOptions: t.storageOptions }), this.registerEventListeners(), await this.loadPersistedSession(), this.rpc.showQrModal) {
      let s2;
      try {
        const { WalletConnectModal: i3 } = await import("./dist-K3S32BSA.js");
        s2 = i3;
      } catch {
        throw new Error("To use QR modal, please install @walletconnect/modal package");
      }
      if (s2) try {
        this.modal = new s2(p6({ walletConnectVersion: 2, projectId: this.rpc.projectId, standaloneChains: this.rpc.chains }, this.rpc.qrModalOptions));
      } catch (i3) {
        throw this.signer.logger.error(i3), new Error("Could not generate WalletConnectModal Instance");
      }
    }
  }
  loadConnectOpts(t) {
    if (!t) return;
    const { chains: s2, optionalChains: i3, rpcMap: n4 } = t;
    s2 && k(s2) && (this.rpc.chains = s2.map((e2) => this.formatChainId(e2)), s2.forEach((e2) => {
      this.rpc.rpcMap[e2] = (n4 == null ? void 0 : n4[e2]) || this.getRpcUrl(e2);
    })), i3 && k(i3) && (this.rpc.optionalChains = [], this.rpc.optionalChains = i3 == null ? void 0 : i3.map((e2) => this.formatChainId(e2)), i3.forEach((e2) => {
      this.rpc.rpcMap[e2] = (n4 == null ? void 0 : n4[e2]) || this.getRpcUrl(e2);
    }));
  }
  getRpcUrl(t, s2) {
    var i3;
    return ((i3 = this.rpc.rpcMap) == null ? void 0 : i3[t]) || `${j3}?chainId=eip155:${t}&projectId=${s2 || this.rpc.projectId}`;
  }
  async loadPersistedSession() {
    if (!this.session) return;
    const t = await this.signer.client.core.storage.getItem(`${this.STORAGE_KEY}/chainId`), s2 = this.session.namespaces[`${this.namespace}:${t}`] ? this.session.namespaces[`${this.namespace}:${t}`] : this.session.namespaces[this.namespace];
    this.setChainIds(t ? [this.formatChainId(t)] : s2 == null ? void 0 : s2.accounts), this.setAccounts(s2 == null ? void 0 : s2.accounts);
  }
  reset() {
    this.chainId = 1, this.accounts = [];
  }
  persist() {
    this.session && this.signer.client.core.storage.setItem(`${this.STORAGE_KEY}/chainId`, this.chainId);
  }
  parseAccounts(t) {
    return typeof t == "string" || t instanceof String ? [this.parseAccount(t)] : t.map((s2) => this.parseAccount(s2));
  }
};
var G4 = v4;
export {
  G4 as EthereumProvider,
  _5 as OPTIONAL_EVENTS,
  E5 as OPTIONAL_METHODS,
  m4 as REQUIRED_EVENTS,
  u3 as REQUIRED_METHODS,
  v4 as default
};
/*! Bundled license information:

tslib/tslib.es6.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)

tslib/tslib.es6.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)

@walletconnect/universal-provider/dist/index.es.js:
  (**
  * @license
  * Lodash <https://lodash.com/>
  * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
  * Released under MIT license <https://lodash.com/license>
  * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
  * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
  *)
*/
//# sourceMappingURL=index.es-X6OOVBVU.js.map
