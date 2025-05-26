"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
    get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
  }) : x)(function(x) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x + '" is not supported');
  });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod3) => function __require2() {
    return mod3 || (0, cb[__getOwnPropNames(cb)[0]])((mod3 = { exports: {} }).exports, mod3), mod3.exports;
  };
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
  var __toESM = (mod3, isNodeMode, target) => (target = mod3 != null ? __create(__getProtoOf(mod3)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod3 || !mod3.__esModule ? __defProp(target, "default", { value: mod3, enumerable: true }) : target,
    mod3
  ));
  var __toCommonJS = (mod3) => __copyProps(__defProp({}, "__esModule", { value: true }), mod3);

  // node_modules/punycode/punycode.es6.js
  var punycode_es6_exports = {};
  __export(punycode_es6_exports, {
    decode: () => decode,
    default: () => punycode_es6_default,
    encode: () => encode,
    toASCII: () => toASCII,
    toUnicode: () => toUnicode,
    ucs2decode: () => ucs2decode,
    ucs2encode: () => ucs2encode
  });
  function error(type) {
    throw new RangeError(errors[type]);
  }
  function map(array, callback) {
    const result = [];
    let length = array.length;
    while (length--) {
      result[length] = callback(array[length]);
    }
    return result;
  }
  function mapDomain(domain, callback) {
    const parts = domain.split("@");
    let result = "";
    if (parts.length > 1) {
      result = parts[0] + "@";
      domain = parts[1];
    }
    domain = domain.replace(regexSeparators, ".");
    const labels = domain.split(".");
    const encoded = map(labels, callback).join(".");
    return result + encoded;
  }
  function ucs2decode(string) {
    const output = [];
    let counter = 0;
    const length = string.length;
    while (counter < length) {
      const value = string.charCodeAt(counter++);
      if (value >= 55296 && value <= 56319 && counter < length) {
        const extra = string.charCodeAt(counter++);
        if ((extra & 64512) == 56320) {
          output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
        } else {
          output.push(value);
          counter--;
        }
      } else {
        output.push(value);
      }
    }
    return output;
  }
  var maxInt, base, tMin, tMax, skew, damp, initialBias, initialN, delimiter, regexPunycode, regexNonASCII, regexSeparators, errors, baseMinusTMin, floor, stringFromCharCode, ucs2encode, basicToDigit, digitToBasic, adapt, decode, encode, toUnicode, toASCII, punycode, punycode_es6_default;
  var init_punycode_es6 = __esm({
    "node_modules/punycode/punycode.es6.js"() {
      "use strict";
      maxInt = 2147483647;
      base = 36;
      tMin = 1;
      tMax = 26;
      skew = 38;
      damp = 700;
      initialBias = 72;
      initialN = 128;
      delimiter = "-";
      regexPunycode = /^xn--/;
      regexNonASCII = /[^\0-\x7F]/;
      regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g;
      errors = {
        "overflow": "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      };
      baseMinusTMin = base - tMin;
      floor = Math.floor;
      stringFromCharCode = String.fromCharCode;
      __name(error, "error");
      __name(map, "map");
      __name(mapDomain, "mapDomain");
      __name(ucs2decode, "ucs2decode");
      ucs2encode = /* @__PURE__ */ __name((codePoints) => String.fromCodePoint(...codePoints), "ucs2encode");
      basicToDigit = /* @__PURE__ */ __name(function(codePoint) {
        if (codePoint >= 48 && codePoint < 58) {
          return 26 + (codePoint - 48);
        }
        if (codePoint >= 65 && codePoint < 91) {
          return codePoint - 65;
        }
        if (codePoint >= 97 && codePoint < 123) {
          return codePoint - 97;
        }
        return base;
      }, "basicToDigit");
      digitToBasic = /* @__PURE__ */ __name(function(digit, flag) {
        return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
      }, "digitToBasic");
      adapt = /* @__PURE__ */ __name(function(delta, numPoints, firstTime) {
        let k = 0;
        delta = firstTime ? floor(delta / damp) : delta >> 1;
        delta += floor(delta / numPoints);
        for (; delta > baseMinusTMin * tMax >> 1; k += base) {
          delta = floor(delta / baseMinusTMin);
        }
        return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
      }, "adapt");
      decode = /* @__PURE__ */ __name(function(input) {
        const output = [];
        const inputLength = input.length;
        let i = 0;
        let n = initialN;
        let bias = initialBias;
        let basic = input.lastIndexOf(delimiter);
        if (basic < 0) {
          basic = 0;
        }
        for (let j = 0; j < basic; ++j) {
          if (input.charCodeAt(j) >= 128) {
            error("not-basic");
          }
          output.push(input.charCodeAt(j));
        }
        for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
          const oldi = i;
          for (let w = 1, k = base; ; k += base) {
            if (index >= inputLength) {
              error("invalid-input");
            }
            const digit = basicToDigit(input.charCodeAt(index++));
            if (digit >= base) {
              error("invalid-input");
            }
            if (digit > floor((maxInt - i) / w)) {
              error("overflow");
            }
            i += digit * w;
            const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
            if (digit < t) {
              break;
            }
            const baseMinusT = base - t;
            if (w > floor(maxInt / baseMinusT)) {
              error("overflow");
            }
            w *= baseMinusT;
          }
          const out = output.length + 1;
          bias = adapt(i - oldi, out, oldi == 0);
          if (floor(i / out) > maxInt - n) {
            error("overflow");
          }
          n += floor(i / out);
          i %= out;
          output.splice(i++, 0, n);
        }
        return String.fromCodePoint(...output);
      }, "decode");
      encode = /* @__PURE__ */ __name(function(input) {
        const output = [];
        input = ucs2decode(input);
        const inputLength = input.length;
        let n = initialN;
        let delta = 0;
        let bias = initialBias;
        for (const currentValue of input) {
          if (currentValue < 128) {
            output.push(stringFromCharCode(currentValue));
          }
        }
        const basicLength = output.length;
        let handledCPCount = basicLength;
        if (basicLength) {
          output.push(delimiter);
        }
        while (handledCPCount < inputLength) {
          let m = maxInt;
          for (const currentValue of input) {
            if (currentValue >= n && currentValue < m) {
              m = currentValue;
            }
          }
          const handledCPCountPlusOne = handledCPCount + 1;
          if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
            error("overflow");
          }
          delta += (m - n) * handledCPCountPlusOne;
          n = m;
          for (const currentValue of input) {
            if (currentValue < n && ++delta > maxInt) {
              error("overflow");
            }
            if (currentValue === n) {
              let q = delta;
              for (let k = base; ; k += base) {
                const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                if (q < t) {
                  break;
                }
                const qMinusT = q - t;
                const baseMinusT = base - t;
                output.push(
                  stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
                );
                q = floor(qMinusT / baseMinusT);
              }
              output.push(stringFromCharCode(digitToBasic(q, 0)));
              bias = adapt(delta, handledCPCountPlusOne, handledCPCount === basicLength);
              delta = 0;
              ++handledCPCount;
            }
          }
          ++delta;
          ++n;
        }
        return output.join("");
      }, "encode");
      toUnicode = /* @__PURE__ */ __name(function(input) {
        return mapDomain(input, function(string) {
          return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
        });
      }, "toUnicode");
      toASCII = /* @__PURE__ */ __name(function(input) {
        return mapDomain(input, function(string) {
          return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
        });
      }, "toASCII");
      punycode = {
        /**
         * A string representing the current Punycode.js version number.
         * @memberOf punycode
         * @type String
         */
        "version": "2.3.1",
        /**
         * An object of methods to convert from JavaScript's internal character
         * representation (UCS-2) to Unicode code points, and back.
         * @see <https://mathiasbynens.be/notes/javascript-encoding>
         * @memberOf punycode
         * @type Object
         */
        "ucs2": {
          "decode": ucs2decode,
          "encode": ucs2encode
        },
        "decode": decode,
        "encode": encode,
        "toASCII": toASCII,
        "toUnicode": toUnicode
      };
      punycode_es6_default = punycode;
    }
  });

  // node_modules/requires-port/index.js
  var require_requires_port = __commonJS({
    "node_modules/requires-port/index.js"(exports, module) {
      "use strict";
      module.exports = /* @__PURE__ */ __name(function required(port, protocol) {
        protocol = protocol.split(":")[0];
        port = +port;
        if (!port) return false;
        switch (protocol) {
          case "http":
          case "ws":
            return port !== 80;
          case "https":
          case "wss":
            return port !== 443;
          case "ftp":
            return port !== 21;
          case "gopher":
            return port !== 70;
          case "file":
            return false;
        }
        return port !== 0;
      }, "required");
    }
  });

  // node_modules/querystringify/index.js
  var require_querystringify = __commonJS({
    "node_modules/querystringify/index.js"(exports) {
      "use strict";
      var has = Object.prototype.hasOwnProperty;
      var undef;
      function decode3(input) {
        try {
          return decodeURIComponent(input.replace(/\+/g, " "));
        } catch (e) {
          return null;
        }
      }
      __name(decode3, "decode");
      function encode2(input) {
        try {
          return encodeURIComponent(input);
        } catch (e) {
          return null;
        }
      }
      __name(encode2, "encode");
      function querystring(query) {
        var parser = /([^=?#&]+)=?([^&]*)/g, result = {}, part;
        while (part = parser.exec(query)) {
          var key = decode3(part[1]), value = decode3(part[2]);
          if (key === null || value === null || key in result) continue;
          result[key] = value;
        }
        return result;
      }
      __name(querystring, "querystring");
      function querystringify(obj, prefix) {
        prefix = prefix || "";
        var pairs = [], value, key;
        if ("string" !== typeof prefix) prefix = "?";
        for (key in obj) {
          if (has.call(obj, key)) {
            value = obj[key];
            if (!value && (value === null || value === undef || isNaN(value))) {
              value = "";
            }
            key = encode2(key);
            value = encode2(value);
            if (key === null || value === null) continue;
            pairs.push(key + "=" + value);
          }
        }
        return pairs.length ? prefix + pairs.join("&") : "";
      }
      __name(querystringify, "querystringify");
      exports.stringify = querystringify;
      exports.parse = querystring;
    }
  });

  // node_modules/url-parse/index.js
  var require_url_parse = __commonJS({
    "node_modules/url-parse/index.js"(exports, module) {
      "use strict";
      var required = require_requires_port();
      var qs = require_querystringify();
      var controlOrWhitespace = /^[\x00-\x20\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/;
      var CRHTLF = /[\n\r\t]/g;
      var slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;
      var port = /:\d+$/;
      var protocolre = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\\/]+)?([\S\s]*)/i;
      var windowsDriveLetter = /^[a-zA-Z]:/;
      function trimLeft(str) {
        return (str ? str : "").toString().replace(controlOrWhitespace, "");
      }
      __name(trimLeft, "trimLeft");
      var rules = [
        ["#", "hash"],
        // Extract from the back.
        ["?", "query"],
        // Extract from the back.
        /* @__PURE__ */ __name(function sanitize(address, url) {
          return isSpecial(url.protocol) ? address.replace(/\\/g, "/") : address;
        }, "sanitize"),
        ["/", "pathname"],
        // Extract from the back.
        ["@", "auth", 1],
        // Extract from the front.
        [NaN, "host", void 0, 1, 1],
        // Set left over value.
        [/:(\d*)$/, "port", void 0, 1],
        // RegExp the back.
        [NaN, "hostname", void 0, 1, 1]
        // Set left over.
      ];
      var ignore = { hash: 1, query: 1 };
      function lolcation(loc) {
        var globalVar;
        if (typeof window !== "undefined") globalVar = window;
        else if (typeof global !== "undefined") globalVar = global;
        else if (typeof self !== "undefined") globalVar = self;
        else globalVar = {};
        var location = globalVar.location || {};
        loc = loc || location;
        var finaldestination = {}, type = typeof loc, key;
        if ("blob:" === loc.protocol) {
          finaldestination = new Url(unescape(loc.pathname), {});
        } else if ("string" === type) {
          finaldestination = new Url(loc, {});
          for (key in ignore) delete finaldestination[key];
        } else if ("object" === type) {
          for (key in loc) {
            if (key in ignore) continue;
            finaldestination[key] = loc[key];
          }
          if (finaldestination.slashes === void 0) {
            finaldestination.slashes = slashes.test(loc.href);
          }
        }
        return finaldestination;
      }
      __name(lolcation, "lolcation");
      function isSpecial(scheme) {
        return scheme === "file:" || scheme === "ftp:" || scheme === "http:" || scheme === "https:" || scheme === "ws:" || scheme === "wss:";
      }
      __name(isSpecial, "isSpecial");
      function extractProtocol(address, location) {
        address = trimLeft(address);
        address = address.replace(CRHTLF, "");
        location = location || {};
        var match = protocolre.exec(address);
        var protocol = match[1] ? match[1].toLowerCase() : "";
        var forwardSlashes = !!match[2];
        var otherSlashes = !!match[3];
        var slashesCount = 0;
        var rest;
        if (forwardSlashes) {
          if (otherSlashes) {
            rest = match[2] + match[3] + match[4];
            slashesCount = match[2].length + match[3].length;
          } else {
            rest = match[2] + match[4];
            slashesCount = match[2].length;
          }
        } else {
          if (otherSlashes) {
            rest = match[3] + match[4];
            slashesCount = match[3].length;
          } else {
            rest = match[4];
          }
        }
        if (protocol === "file:") {
          if (slashesCount >= 2) {
            rest = rest.slice(2);
          }
        } else if (isSpecial(protocol)) {
          rest = match[4];
        } else if (protocol) {
          if (forwardSlashes) {
            rest = rest.slice(2);
          }
        } else if (slashesCount >= 2 && isSpecial(location.protocol)) {
          rest = match[4];
        }
        return {
          protocol,
          slashes: forwardSlashes || isSpecial(protocol),
          slashesCount,
          rest
        };
      }
      __name(extractProtocol, "extractProtocol");
      function resolve(relative, base2) {
        if (relative === "") return base2;
        var path = (base2 || "/").split("/").slice(0, -1).concat(relative.split("/")), i = path.length, last = path[i - 1], unshift = false, up = 0;
        while (i--) {
          if (path[i] === ".") {
            path.splice(i, 1);
          } else if (path[i] === "..") {
            path.splice(i, 1);
            up++;
          } else if (up) {
            if (i === 0) unshift = true;
            path.splice(i, 1);
            up--;
          }
        }
        if (unshift) path.unshift("");
        if (last === "." || last === "..") path.push("");
        return path.join("/");
      }
      __name(resolve, "resolve");
      function Url(address, location, parser) {
        address = trimLeft(address);
        address = address.replace(CRHTLF, "");
        if (!(this instanceof Url)) {
          return new Url(address, location, parser);
        }
        var relative, extracted, parse3, instruction, index, key, instructions = rules.slice(), type = typeof location, url = this, i = 0;
        if ("object" !== type && "string" !== type) {
          parser = location;
          location = null;
        }
        if (parser && "function" !== typeof parser) parser = qs.parse;
        location = lolcation(location);
        extracted = extractProtocol(address || "", location);
        relative = !extracted.protocol && !extracted.slashes;
        url.slashes = extracted.slashes || relative && location.slashes;
        url.protocol = extracted.protocol || location.protocol || "";
        address = extracted.rest;
        if (extracted.protocol === "file:" && (extracted.slashesCount !== 2 || windowsDriveLetter.test(address)) || !extracted.slashes && (extracted.protocol || extracted.slashesCount < 2 || !isSpecial(url.protocol))) {
          instructions[3] = [/(.*)/, "pathname"];
        }
        for (; i < instructions.length; i++) {
          instruction = instructions[i];
          if (typeof instruction === "function") {
            address = instruction(address, url);
            continue;
          }
          parse3 = instruction[0];
          key = instruction[1];
          if (parse3 !== parse3) {
            url[key] = address;
          } else if ("string" === typeof parse3) {
            index = parse3 === "@" ? address.lastIndexOf(parse3) : address.indexOf(parse3);
            if (~index) {
              if ("number" === typeof instruction[2]) {
                url[key] = address.slice(0, index);
                address = address.slice(index + instruction[2]);
              } else {
                url[key] = address.slice(index);
                address = address.slice(0, index);
              }
            }
          } else if (index = parse3.exec(address)) {
            url[key] = index[1];
            address = address.slice(0, index.index);
          }
          url[key] = url[key] || (relative && instruction[3] ? location[key] || "" : "");
          if (instruction[4]) url[key] = url[key].toLowerCase();
        }
        if (parser) url.query = parser(url.query);
        if (relative && location.slashes && url.pathname.charAt(0) !== "/" && (url.pathname !== "" || location.pathname !== "")) {
          url.pathname = resolve(url.pathname, location.pathname);
        }
        if (url.pathname.charAt(0) !== "/" && isSpecial(url.protocol)) {
          url.pathname = "/" + url.pathname;
        }
        if (!required(url.port, url.protocol)) {
          url.host = url.hostname;
          url.port = "";
        }
        url.username = url.password = "";
        if (url.auth) {
          index = url.auth.indexOf(":");
          if (~index) {
            url.username = url.auth.slice(0, index);
            url.username = encodeURIComponent(decodeURIComponent(url.username));
            url.password = url.auth.slice(index + 1);
            url.password = encodeURIComponent(decodeURIComponent(url.password));
          } else {
            url.username = encodeURIComponent(decodeURIComponent(url.auth));
          }
          url.auth = url.password ? url.username + ":" + url.password : url.username;
        }
        url.origin = url.protocol !== "file:" && isSpecial(url.protocol) && url.host ? url.protocol + "//" + url.host : "null";
        url.href = url.toString();
      }
      __name(Url, "Url");
      function set(part, value, fn) {
        var url = this;
        switch (part) {
          case "query":
            if ("string" === typeof value && value.length) {
              value = (fn || qs.parse)(value);
            }
            url[part] = value;
            break;
          case "port":
            url[part] = value;
            if (!required(value, url.protocol)) {
              url.host = url.hostname;
              url[part] = "";
            } else if (value) {
              url.host = url.hostname + ":" + value;
            }
            break;
          case "hostname":
            url[part] = value;
            if (url.port) value += ":" + url.port;
            url.host = value;
            break;
          case "host":
            url[part] = value;
            if (port.test(value)) {
              value = value.split(":");
              url.port = value.pop();
              url.hostname = value.join(":");
            } else {
              url.hostname = value;
              url.port = "";
            }
            break;
          case "protocol":
            url.protocol = value.toLowerCase();
            url.slashes = !fn;
            break;
          case "pathname":
          case "hash":
            if (value) {
              var char = part === "pathname" ? "/" : "#";
              url[part] = value.charAt(0) !== char ? char + value : value;
            } else {
              url[part] = value;
            }
            break;
          case "username":
          case "password":
            url[part] = encodeURIComponent(value);
            break;
          case "auth":
            var index = value.indexOf(":");
            if (~index) {
              url.username = value.slice(0, index);
              url.username = encodeURIComponent(decodeURIComponent(url.username));
              url.password = value.slice(index + 1);
              url.password = encodeURIComponent(decodeURIComponent(url.password));
            } else {
              url.username = encodeURIComponent(decodeURIComponent(value));
            }
        }
        for (var i = 0; i < rules.length; i++) {
          var ins = rules[i];
          if (ins[4]) url[ins[1]] = url[ins[1]].toLowerCase();
        }
        url.auth = url.password ? url.username + ":" + url.password : url.username;
        url.origin = url.protocol !== "file:" && isSpecial(url.protocol) && url.host ? url.protocol + "//" + url.host : "null";
        url.href = url.toString();
        return url;
      }
      __name(set, "set");
      function toString2(stringify3) {
        if (!stringify3 || "function" !== typeof stringify3) stringify3 = qs.stringify;
        var query, url = this, host = url.host, protocol = url.protocol;
        if (protocol && protocol.charAt(protocol.length - 1) !== ":") protocol += ":";
        var result = protocol + (url.protocol && url.slashes || isSpecial(url.protocol) ? "//" : "");
        if (url.username) {
          result += url.username;
          if (url.password) result += ":" + url.password;
          result += "@";
        } else if (url.password) {
          result += ":" + url.password;
          result += "@";
        } else if (url.protocol !== "file:" && isSpecial(url.protocol) && !host && url.pathname !== "/") {
          result += "@";
        }
        if (host[host.length - 1] === ":" || port.test(url.hostname) && !url.port) {
          host += ":";
        }
        result += host + url.pathname;
        query = "object" === typeof url.query ? stringify3(url.query) : url.query;
        if (query) result += "?" !== query.charAt(0) ? "?" + query : query;
        if (url.hash) result += url.hash;
        return result;
      }
      __name(toString2, "toString");
      Url.prototype = { set, toString: toString2 };
      Url.extractProtocol = extractProtocol;
      Url.location = lolcation;
      Url.trimLeft = trimLeft;
      Url.qs = qs;
      module.exports = Url;
    }
  });

  // node_modules/psl/dist/psl.cjs
  var require_psl = __commonJS({
    "node_modules/psl/dist/psl.cjs"(exports) {
      "use strict";
      Object.defineProperties(exports, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
      function K(e) {
        return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
      }
      __name(K, "K");
      var O;
      var F;
      function Q() {
        if (F) return O;
        F = 1;
        const e = 2147483647, s = 36, c = 1, o = 26, t = 38, d = 700, z = 72, y = 128, g2 = "-", P = /^xn--/, V = /[^\0-\x7F]/, G = /[\x2E\u3002\uFF0E\uFF61]/g, W = { overflow: "Overflow: input needs wider integers to process", "not-basic": "Illegal input >= 0x80 (not a basic code point)", "invalid-input": "Invalid input" }, C = s - c, h = Math.floor, I = String.fromCharCode;
        function v(a) {
          throw new RangeError(W[a]);
        }
        __name(v, "v");
        function U(a, i) {
          const m = [];
          let n = a.length;
          for (; n--; ) m[n] = i(a[n]);
          return m;
        }
        __name(U, "U");
        function S(a, i) {
          const m = a.split("@");
          let n = "";
          m.length > 1 && (n = m[0] + "@", a = m[1]), a = a.replace(G, ".");
          const r = a.split("."), p = U(r, i).join(".");
          return n + p;
        }
        __name(S, "S");
        function L(a) {
          const i = [];
          let m = 0;
          const n = a.length;
          for (; m < n; ) {
            const r = a.charCodeAt(m++);
            if (r >= 55296 && r <= 56319 && m < n) {
              const p = a.charCodeAt(m++);
              (p & 64512) == 56320 ? i.push(((r & 1023) << 10) + (p & 1023) + 65536) : (i.push(r), m--);
            } else i.push(r);
          }
          return i;
        }
        __name(L, "L");
        const $ = /* @__PURE__ */ __name((a) => String.fromCodePoint(...a), "$"), J = /* @__PURE__ */ __name(function(a) {
          return a >= 48 && a < 58 ? 26 + (a - 48) : a >= 65 && a < 91 ? a - 65 : a >= 97 && a < 123 ? a - 97 : s;
        }, "J"), D = /* @__PURE__ */ __name(function(a, i) {
          return a + 22 + 75 * (a < 26) - ((i != 0) << 5);
        }, "D"), T = /* @__PURE__ */ __name(function(a, i, m) {
          let n = 0;
          for (a = m ? h(a / d) : a >> 1, a += h(a / i); a > C * o >> 1; n += s) a = h(a / C);
          return h(n + (C + 1) * a / (a + t));
        }, "T"), E = /* @__PURE__ */ __name(function(a) {
          const i = [], m = a.length;
          let n = 0, r = y, p = z, j = a.lastIndexOf(g2);
          j < 0 && (j = 0);
          for (let u = 0; u < j; ++u) a.charCodeAt(u) >= 128 && v("not-basic"), i.push(a.charCodeAt(u));
          for (let u = j > 0 ? j + 1 : 0; u < m; ) {
            const k = n;
            for (let l = 1, b = s; ; b += s) {
              u >= m && v("invalid-input");
              const w = J(a.charCodeAt(u++));
              w >= s && v("invalid-input"), w > h((e - n) / l) && v("overflow"), n += w * l;
              const x = b <= p ? c : b >= p + o ? o : b - p;
              if (w < x) break;
              const q = s - x;
              l > h(e / q) && v("overflow"), l *= q;
            }
            const f = i.length + 1;
            p = T(n - k, f, k == 0), h(n / f) > e - r && v("overflow"), r += h(n / f), n %= f, i.splice(n++, 0, r);
          }
          return String.fromCodePoint(...i);
        }, "E"), B = /* @__PURE__ */ __name(function(a) {
          const i = [];
          a = L(a);
          const m = a.length;
          let n = y, r = 0, p = z;
          for (const k of a) k < 128 && i.push(I(k));
          const j = i.length;
          let u = j;
          for (j && i.push(g2); u < m; ) {
            let k = e;
            for (const l of a) l >= n && l < k && (k = l);
            const f = u + 1;
            k - n > h((e - r) / f) && v("overflow"), r += (k - n) * f, n = k;
            for (const l of a) if (l < n && ++r > e && v("overflow"), l === n) {
              let b = r;
              for (let w = s; ; w += s) {
                const x = w <= p ? c : w >= p + o ? o : w - p;
                if (b < x) break;
                const q = b - x, M = s - x;
                i.push(I(D(x + q % M, 0))), b = h(q / M);
              }
              i.push(I(D(b, 0))), p = T(r, f, u === j), r = 0, ++u;
            }
            ++r, ++n;
          }
          return i.join("");
        }, "B");
        return O = { version: "2.3.1", ucs2: { decode: L, encode: $ }, decode: E, encode: B, toASCII: /* @__PURE__ */ __name(function(a) {
          return S(a, function(i) {
            return V.test(i) ? "xn--" + B(i) : i;
          });
        }, "toASCII"), toUnicode: /* @__PURE__ */ __name(function(a) {
          return S(a, function(i) {
            return P.test(i) ? E(i.slice(4).toLowerCase()) : i;
          });
        }, "toUnicode") }, O;
      }
      __name(Q, "Q");
      var X = Q();
      var A = K(X);
      var Y = ["ac", "com.ac", "edu.ac", "gov.ac", "mil.ac", "net.ac", "org.ac", "ad", "ae", "ac.ae", "co.ae", "gov.ae", "mil.ae", "net.ae", "org.ae", "sch.ae", "aero", "airline.aero", "airport.aero", "accident-investigation.aero", "accident-prevention.aero", "aerobatic.aero", "aeroclub.aero", "aerodrome.aero", "agents.aero", "air-surveillance.aero", "air-traffic-control.aero", "aircraft.aero", "airtraffic.aero", "ambulance.aero", "association.aero", "author.aero", "ballooning.aero", "broker.aero", "caa.aero", "cargo.aero", "catering.aero", "certification.aero", "championship.aero", "charter.aero", "civilaviation.aero", "club.aero", "conference.aero", "consultant.aero", "consulting.aero", "control.aero", "council.aero", "crew.aero", "design.aero", "dgca.aero", "educator.aero", "emergency.aero", "engine.aero", "engineer.aero", "entertainment.aero", "equipment.aero", "exchange.aero", "express.aero", "federation.aero", "flight.aero", "freight.aero", "fuel.aero", "gliding.aero", "government.aero", "groundhandling.aero", "group.aero", "hanggliding.aero", "homebuilt.aero", "insurance.aero", "journal.aero", "journalist.aero", "leasing.aero", "logistics.aero", "magazine.aero", "maintenance.aero", "marketplace.aero", "media.aero", "microlight.aero", "modelling.aero", "navigation.aero", "parachuting.aero", "paragliding.aero", "passenger-association.aero", "pilot.aero", "press.aero", "production.aero", "recreation.aero", "repbody.aero", "res.aero", "research.aero", "rotorcraft.aero", "safety.aero", "scientist.aero", "services.aero", "show.aero", "skydiving.aero", "software.aero", "student.aero", "taxi.aero", "trader.aero", "trading.aero", "trainer.aero", "union.aero", "workinggroup.aero", "works.aero", "af", "com.af", "edu.af", "gov.af", "net.af", "org.af", "ag", "co.ag", "com.ag", "net.ag", "nom.ag", "org.ag", "ai", "com.ai", "net.ai", "off.ai", "org.ai", "al", "com.al", "edu.al", "gov.al", "mil.al", "net.al", "org.al", "am", "co.am", "com.am", "commune.am", "net.am", "org.am", "ao", "co.ao", "ed.ao", "edu.ao", "gov.ao", "gv.ao", "it.ao", "og.ao", "org.ao", "pb.ao", "aq", "ar", "bet.ar", "com.ar", "coop.ar", "edu.ar", "gob.ar", "gov.ar", "int.ar", "mil.ar", "musica.ar", "mutual.ar", "net.ar", "org.ar", "senasa.ar", "tur.ar", "arpa", "e164.arpa", "home.arpa", "in-addr.arpa", "ip6.arpa", "iris.arpa", "uri.arpa", "urn.arpa", "as", "gov.as", "asia", "at", "ac.at", "sth.ac.at", "co.at", "gv.at", "or.at", "au", "asn.au", "com.au", "edu.au", "gov.au", "id.au", "net.au", "org.au", "conf.au", "oz.au", "act.au", "nsw.au", "nt.au", "qld.au", "sa.au", "tas.au", "vic.au", "wa.au", "act.edu.au", "catholic.edu.au", "nsw.edu.au", "nt.edu.au", "qld.edu.au", "sa.edu.au", "tas.edu.au", "vic.edu.au", "wa.edu.au", "qld.gov.au", "sa.gov.au", "tas.gov.au", "vic.gov.au", "wa.gov.au", "schools.nsw.edu.au", "aw", "com.aw", "ax", "az", "biz.az", "com.az", "edu.az", "gov.az", "info.az", "int.az", "mil.az", "name.az", "net.az", "org.az", "pp.az", "pro.az", "ba", "com.ba", "edu.ba", "gov.ba", "mil.ba", "net.ba", "org.ba", "bb", "biz.bb", "co.bb", "com.bb", "edu.bb", "gov.bb", "info.bb", "net.bb", "org.bb", "store.bb", "tv.bb", "*.bd", "be", "ac.be", "bf", "gov.bf", "bg", "0.bg", "1.bg", "2.bg", "3.bg", "4.bg", "5.bg", "6.bg", "7.bg", "8.bg", "9.bg", "a.bg", "b.bg", "c.bg", "d.bg", "e.bg", "f.bg", "g.bg", "h.bg", "i.bg", "j.bg", "k.bg", "l.bg", "m.bg", "n.bg", "o.bg", "p.bg", "q.bg", "r.bg", "s.bg", "t.bg", "u.bg", "v.bg", "w.bg", "x.bg", "y.bg", "z.bg", "bh", "com.bh", "edu.bh", "gov.bh", "net.bh", "org.bh", "bi", "co.bi", "com.bi", "edu.bi", "or.bi", "org.bi", "biz", "bj", "africa.bj", "agro.bj", "architectes.bj", "assur.bj", "avocats.bj", "co.bj", "com.bj", "eco.bj", "econo.bj", "edu.bj", "info.bj", "loisirs.bj", "money.bj", "net.bj", "org.bj", "ote.bj", "restaurant.bj", "resto.bj", "tourism.bj", "univ.bj", "bm", "com.bm", "edu.bm", "gov.bm", "net.bm", "org.bm", "bn", "com.bn", "edu.bn", "gov.bn", "net.bn", "org.bn", "bo", "com.bo", "edu.bo", "gob.bo", "int.bo", "mil.bo", "net.bo", "org.bo", "tv.bo", "web.bo", "academia.bo", "agro.bo", "arte.bo", "blog.bo", "bolivia.bo", "ciencia.bo", "cooperativa.bo", "democracia.bo", "deporte.bo", "ecologia.bo", "economia.bo", "empresa.bo", "indigena.bo", "industria.bo", "info.bo", "medicina.bo", "movimiento.bo", "musica.bo", "natural.bo", "nombre.bo", "noticias.bo", "patria.bo", "plurinacional.bo", "politica.bo", "profesional.bo", "pueblo.bo", "revista.bo", "salud.bo", "tecnologia.bo", "tksat.bo", "transporte.bo", "wiki.bo", "br", "9guacu.br", "abc.br", "adm.br", "adv.br", "agr.br", "aju.br", "am.br", "anani.br", "aparecida.br", "app.br", "arq.br", "art.br", "ato.br", "b.br", "barueri.br", "belem.br", "bet.br", "bhz.br", "bib.br", "bio.br", "blog.br", "bmd.br", "boavista.br", "bsb.br", "campinagrande.br", "campinas.br", "caxias.br", "cim.br", "cng.br", "cnt.br", "com.br", "contagem.br", "coop.br", "coz.br", "cri.br", "cuiaba.br", "curitiba.br", "def.br", "des.br", "det.br", "dev.br", "ecn.br", "eco.br", "edu.br", "emp.br", "enf.br", "eng.br", "esp.br", "etc.br", "eti.br", "far.br", "feira.br", "flog.br", "floripa.br", "fm.br", "fnd.br", "fortal.br", "fot.br", "foz.br", "fst.br", "g12.br", "geo.br", "ggf.br", "goiania.br", "gov.br", "ac.gov.br", "al.gov.br", "am.gov.br", "ap.gov.br", "ba.gov.br", "ce.gov.br", "df.gov.br", "es.gov.br", "go.gov.br", "ma.gov.br", "mg.gov.br", "ms.gov.br", "mt.gov.br", "pa.gov.br", "pb.gov.br", "pe.gov.br", "pi.gov.br", "pr.gov.br", "rj.gov.br", "rn.gov.br", "ro.gov.br", "rr.gov.br", "rs.gov.br", "sc.gov.br", "se.gov.br", "sp.gov.br", "to.gov.br", "gru.br", "imb.br", "ind.br", "inf.br", "jab.br", "jampa.br", "jdf.br", "joinville.br", "jor.br", "jus.br", "leg.br", "leilao.br", "lel.br", "log.br", "londrina.br", "macapa.br", "maceio.br", "manaus.br", "maringa.br", "mat.br", "med.br", "mil.br", "morena.br", "mp.br", "mus.br", "natal.br", "net.br", "niteroi.br", "*.nom.br", "not.br", "ntr.br", "odo.br", "ong.br", "org.br", "osasco.br", "palmas.br", "poa.br", "ppg.br", "pro.br", "psc.br", "psi.br", "pvh.br", "qsl.br", "radio.br", "rec.br", "recife.br", "rep.br", "ribeirao.br", "rio.br", "riobranco.br", "riopreto.br", "salvador.br", "sampa.br", "santamaria.br", "santoandre.br", "saobernardo.br", "saogonca.br", "seg.br", "sjc.br", "slg.br", "slz.br", "sorocaba.br", "srv.br", "taxi.br", "tc.br", "tec.br", "teo.br", "the.br", "tmp.br", "trd.br", "tur.br", "tv.br", "udi.br", "vet.br", "vix.br", "vlog.br", "wiki.br", "zlg.br", "bs", "com.bs", "edu.bs", "gov.bs", "net.bs", "org.bs", "bt", "com.bt", "edu.bt", "gov.bt", "net.bt", "org.bt", "bv", "bw", "co.bw", "org.bw", "by", "gov.by", "mil.by", "com.by", "of.by", "bz", "co.bz", "com.bz", "edu.bz", "gov.bz", "net.bz", "org.bz", "ca", "ab.ca", "bc.ca", "mb.ca", "nb.ca", "nf.ca", "nl.ca", "ns.ca", "nt.ca", "nu.ca", "on.ca", "pe.ca", "qc.ca", "sk.ca", "yk.ca", "gc.ca", "cat", "cc", "cd", "gov.cd", "cf", "cg", "ch", "ci", "ac.ci", "a\xE9roport.ci", "asso.ci", "co.ci", "com.ci", "ed.ci", "edu.ci", "go.ci", "gouv.ci", "int.ci", "net.ci", "or.ci", "org.ci", "*.ck", "!www.ck", "cl", "co.cl", "gob.cl", "gov.cl", "mil.cl", "cm", "co.cm", "com.cm", "gov.cm", "net.cm", "cn", "ac.cn", "com.cn", "edu.cn", "gov.cn", "mil.cn", "net.cn", "org.cn", "\u516C\u53F8.cn", "\u7DB2\u7D61.cn", "\u7F51\u7EDC.cn", "ah.cn", "bj.cn", "cq.cn", "fj.cn", "gd.cn", "gs.cn", "gx.cn", "gz.cn", "ha.cn", "hb.cn", "he.cn", "hi.cn", "hk.cn", "hl.cn", "hn.cn", "jl.cn", "js.cn", "jx.cn", "ln.cn", "mo.cn", "nm.cn", "nx.cn", "qh.cn", "sc.cn", "sd.cn", "sh.cn", "sn.cn", "sx.cn", "tj.cn", "tw.cn", "xj.cn", "xz.cn", "yn.cn", "zj.cn", "co", "com.co", "edu.co", "gov.co", "mil.co", "net.co", "nom.co", "org.co", "com", "coop", "cr", "ac.cr", "co.cr", "ed.cr", "fi.cr", "go.cr", "or.cr", "sa.cr", "cu", "com.cu", "edu.cu", "gob.cu", "inf.cu", "nat.cu", "net.cu", "org.cu", "cv", "com.cv", "edu.cv", "id.cv", "int.cv", "net.cv", "nome.cv", "org.cv", "publ.cv", "cw", "com.cw", "edu.cw", "net.cw", "org.cw", "cx", "gov.cx", "cy", "ac.cy", "biz.cy", "com.cy", "ekloges.cy", "gov.cy", "ltd.cy", "mil.cy", "net.cy", "org.cy", "press.cy", "pro.cy", "tm.cy", "cz", "de", "dj", "dk", "dm", "co.dm", "com.dm", "edu.dm", "gov.dm", "net.dm", "org.dm", "do", "art.do", "com.do", "edu.do", "gob.do", "gov.do", "mil.do", "net.do", "org.do", "sld.do", "web.do", "dz", "art.dz", "asso.dz", "com.dz", "edu.dz", "gov.dz", "net.dz", "org.dz", "pol.dz", "soc.dz", "tm.dz", "ec", "com.ec", "edu.ec", "fin.ec", "gob.ec", "gov.ec", "info.ec", "k12.ec", "med.ec", "mil.ec", "net.ec", "org.ec", "pro.ec", "edu", "ee", "aip.ee", "com.ee", "edu.ee", "fie.ee", "gov.ee", "lib.ee", "med.ee", "org.ee", "pri.ee", "riik.ee", "eg", "ac.eg", "com.eg", "edu.eg", "eun.eg", "gov.eg", "info.eg", "me.eg", "mil.eg", "name.eg", "net.eg", "org.eg", "sci.eg", "sport.eg", "tv.eg", "*.er", "es", "com.es", "edu.es", "gob.es", "nom.es", "org.es", "et", "biz.et", "com.et", "edu.et", "gov.et", "info.et", "name.et", "net.et", "org.et", "eu", "fi", "aland.fi", "fj", "ac.fj", "biz.fj", "com.fj", "gov.fj", "info.fj", "mil.fj", "name.fj", "net.fj", "org.fj", "pro.fj", "*.fk", "fm", "com.fm", "edu.fm", "net.fm", "org.fm", "fo", "fr", "asso.fr", "com.fr", "gouv.fr", "nom.fr", "prd.fr", "tm.fr", "avoues.fr", "cci.fr", "greta.fr", "huissier-justice.fr", "ga", "gb", "gd", "edu.gd", "gov.gd", "ge", "com.ge", "edu.ge", "gov.ge", "net.ge", "org.ge", "pvt.ge", "school.ge", "gf", "gg", "co.gg", "net.gg", "org.gg", "gh", "com.gh", "edu.gh", "gov.gh", "mil.gh", "org.gh", "gi", "com.gi", "edu.gi", "gov.gi", "ltd.gi", "mod.gi", "org.gi", "gl", "co.gl", "com.gl", "edu.gl", "net.gl", "org.gl", "gm", "gn", "ac.gn", "com.gn", "edu.gn", "gov.gn", "net.gn", "org.gn", "gov", "gp", "asso.gp", "com.gp", "edu.gp", "mobi.gp", "net.gp", "org.gp", "gq", "gr", "com.gr", "edu.gr", "gov.gr", "net.gr", "org.gr", "gs", "gt", "com.gt", "edu.gt", "gob.gt", "ind.gt", "mil.gt", "net.gt", "org.gt", "gu", "com.gu", "edu.gu", "gov.gu", "guam.gu", "info.gu", "net.gu", "org.gu", "web.gu", "gw", "gy", "co.gy", "com.gy", "edu.gy", "gov.gy", "net.gy", "org.gy", "hk", "com.hk", "edu.hk", "gov.hk", "idv.hk", "net.hk", "org.hk", "\u4E2A\u4EBA.hk", "\u500B\u4EBA.hk", "\u516C\u53F8.hk", "\u653F\u5E9C.hk", "\u654E\u80B2.hk", "\u6559\u80B2.hk", "\u7B87\u4EBA.hk", "\u7D44\u7E54.hk", "\u7D44\u7EC7.hk", "\u7DB2\u7D61.hk", "\u7DB2\u7EDC.hk", "\u7EC4\u7E54.hk", "\u7EC4\u7EC7.hk", "\u7F51\u7D61.hk", "\u7F51\u7EDC.hk", "hm", "hn", "com.hn", "edu.hn", "gob.hn", "mil.hn", "net.hn", "org.hn", "hr", "com.hr", "from.hr", "iz.hr", "name.hr", "ht", "adult.ht", "art.ht", "asso.ht", "com.ht", "coop.ht", "edu.ht", "firm.ht", "gouv.ht", "info.ht", "med.ht", "net.ht", "org.ht", "perso.ht", "pol.ht", "pro.ht", "rel.ht", "shop.ht", "hu", "2000.hu", "agrar.hu", "bolt.hu", "casino.hu", "city.hu", "co.hu", "erotica.hu", "erotika.hu", "film.hu", "forum.hu", "games.hu", "hotel.hu", "info.hu", "ingatlan.hu", "jogasz.hu", "konyvelo.hu", "lakas.hu", "media.hu", "news.hu", "org.hu", "priv.hu", "reklam.hu", "sex.hu", "shop.hu", "sport.hu", "suli.hu", "szex.hu", "tm.hu", "tozsde.hu", "utazas.hu", "video.hu", "id", "ac.id", "biz.id", "co.id", "desa.id", "go.id", "mil.id", "my.id", "net.id", "or.id", "ponpes.id", "sch.id", "web.id", "ie", "gov.ie", "il", "ac.il", "co.il", "gov.il", "idf.il", "k12.il", "muni.il", "net.il", "org.il", "\u05D9\u05E9\u05E8\u05D0\u05DC", "\u05D0\u05E7\u05D3\u05DE\u05D9\u05D4.\u05D9\u05E9\u05E8\u05D0\u05DC", "\u05D9\u05E9\u05D5\u05D1.\u05D9\u05E9\u05E8\u05D0\u05DC", "\u05E6\u05D4\u05DC.\u05D9\u05E9\u05E8\u05D0\u05DC", "\u05DE\u05DE\u05E9\u05DC.\u05D9\u05E9\u05E8\u05D0\u05DC", "im", "ac.im", "co.im", "ltd.co.im", "plc.co.im", "com.im", "net.im", "org.im", "tt.im", "tv.im", "in", "5g.in", "6g.in", "ac.in", "ai.in", "am.in", "bihar.in", "biz.in", "business.in", "ca.in", "cn.in", "co.in", "com.in", "coop.in", "cs.in", "delhi.in", "dr.in", "edu.in", "er.in", "firm.in", "gen.in", "gov.in", "gujarat.in", "ind.in", "info.in", "int.in", "internet.in", "io.in", "me.in", "mil.in", "net.in", "nic.in", "org.in", "pg.in", "post.in", "pro.in", "res.in", "travel.in", "tv.in", "uk.in", "up.in", "us.in", "info", "int", "eu.int", "io", "co.io", "com.io", "edu.io", "gov.io", "mil.io", "net.io", "nom.io", "org.io", "iq", "com.iq", "edu.iq", "gov.iq", "mil.iq", "net.iq", "org.iq", "ir", "ac.ir", "co.ir", "gov.ir", "id.ir", "net.ir", "org.ir", "sch.ir", "\u0627\u06CC\u0631\u0627\u0646.ir", "\u0627\u064A\u0631\u0627\u0646.ir", "is", "it", "edu.it", "gov.it", "abr.it", "abruzzo.it", "aosta-valley.it", "aostavalley.it", "bas.it", "basilicata.it", "cal.it", "calabria.it", "cam.it", "campania.it", "emilia-romagna.it", "emiliaromagna.it", "emr.it", "friuli-v-giulia.it", "friuli-ve-giulia.it", "friuli-vegiulia.it", "friuli-venezia-giulia.it", "friuli-veneziagiulia.it", "friuli-vgiulia.it", "friuliv-giulia.it", "friulive-giulia.it", "friulivegiulia.it", "friulivenezia-giulia.it", "friuliveneziagiulia.it", "friulivgiulia.it", "fvg.it", "laz.it", "lazio.it", "lig.it", "liguria.it", "lom.it", "lombardia.it", "lombardy.it", "lucania.it", "mar.it", "marche.it", "mol.it", "molise.it", "piedmont.it", "piemonte.it", "pmn.it", "pug.it", "puglia.it", "sar.it", "sardegna.it", "sardinia.it", "sic.it", "sicilia.it", "sicily.it", "taa.it", "tos.it", "toscana.it", "trentin-sud-tirol.it", "trentin-s\xFCd-tirol.it", "trentin-sudtirol.it", "trentin-s\xFCdtirol.it", "trentin-sued-tirol.it", "trentin-suedtirol.it", "trentino.it", "trentino-a-adige.it", "trentino-aadige.it", "trentino-alto-adige.it", "trentino-altoadige.it", "trentino-s-tirol.it", "trentino-stirol.it", "trentino-sud-tirol.it", "trentino-s\xFCd-tirol.it", "trentino-sudtirol.it", "trentino-s\xFCdtirol.it", "trentino-sued-tirol.it", "trentino-suedtirol.it", "trentinoa-adige.it", "trentinoaadige.it", "trentinoalto-adige.it", "trentinoaltoadige.it", "trentinos-tirol.it", "trentinostirol.it", "trentinosud-tirol.it", "trentinos\xFCd-tirol.it", "trentinosudtirol.it", "trentinos\xFCdtirol.it", "trentinosued-tirol.it", "trentinosuedtirol.it", "trentinsud-tirol.it", "trentins\xFCd-tirol.it", "trentinsudtirol.it", "trentins\xFCdtirol.it", "trentinsued-tirol.it", "trentinsuedtirol.it", "tuscany.it", "umb.it", "umbria.it", "val-d-aosta.it", "val-daosta.it", "vald-aosta.it", "valdaosta.it", "valle-aosta.it", "valle-d-aosta.it", "valle-daosta.it", "valleaosta.it", "valled-aosta.it", "valledaosta.it", "vallee-aoste.it", "vall\xE9e-aoste.it", "vallee-d-aoste.it", "vall\xE9e-d-aoste.it", "valleeaoste.it", "vall\xE9eaoste.it", "valleedaoste.it", "vall\xE9edaoste.it", "vao.it", "vda.it", "ven.it", "veneto.it", "ag.it", "agrigento.it", "al.it", "alessandria.it", "alto-adige.it", "altoadige.it", "an.it", "ancona.it", "andria-barletta-trani.it", "andria-trani-barletta.it", "andriabarlettatrani.it", "andriatranibarletta.it", "ao.it", "aosta.it", "aoste.it", "ap.it", "aq.it", "aquila.it", "ar.it", "arezzo.it", "ascoli-piceno.it", "ascolipiceno.it", "asti.it", "at.it", "av.it", "avellino.it", "ba.it", "balsan.it", "balsan-sudtirol.it", "balsan-s\xFCdtirol.it", "balsan-suedtirol.it", "bari.it", "barletta-trani-andria.it", "barlettatraniandria.it", "belluno.it", "benevento.it", "bergamo.it", "bg.it", "bi.it", "biella.it", "bl.it", "bn.it", "bo.it", "bologna.it", "bolzano.it", "bolzano-altoadige.it", "bozen.it", "bozen-sudtirol.it", "bozen-s\xFCdtirol.it", "bozen-suedtirol.it", "br.it", "brescia.it", "brindisi.it", "bs.it", "bt.it", "bulsan.it", "bulsan-sudtirol.it", "bulsan-s\xFCdtirol.it", "bulsan-suedtirol.it", "bz.it", "ca.it", "cagliari.it", "caltanissetta.it", "campidano-medio.it", "campidanomedio.it", "campobasso.it", "carbonia-iglesias.it", "carboniaiglesias.it", "carrara-massa.it", "carraramassa.it", "caserta.it", "catania.it", "catanzaro.it", "cb.it", "ce.it", "cesena-forli.it", "cesena-forl\xEC.it", "cesenaforli.it", "cesenaforl\xEC.it", "ch.it", "chieti.it", "ci.it", "cl.it", "cn.it", "co.it", "como.it", "cosenza.it", "cr.it", "cremona.it", "crotone.it", "cs.it", "ct.it", "cuneo.it", "cz.it", "dell-ogliastra.it", "dellogliastra.it", "en.it", "enna.it", "fc.it", "fe.it", "fermo.it", "ferrara.it", "fg.it", "fi.it", "firenze.it", "florence.it", "fm.it", "foggia.it", "forli-cesena.it", "forl\xEC-cesena.it", "forlicesena.it", "forl\xECcesena.it", "fr.it", "frosinone.it", "ge.it", "genoa.it", "genova.it", "go.it", "gorizia.it", "gr.it", "grosseto.it", "iglesias-carbonia.it", "iglesiascarbonia.it", "im.it", "imperia.it", "is.it", "isernia.it", "kr.it", "la-spezia.it", "laquila.it", "laspezia.it", "latina.it", "lc.it", "le.it", "lecce.it", "lecco.it", "li.it", "livorno.it", "lo.it", "lodi.it", "lt.it", "lu.it", "lucca.it", "macerata.it", "mantova.it", "massa-carrara.it", "massacarrara.it", "matera.it", "mb.it", "mc.it", "me.it", "medio-campidano.it", "mediocampidano.it", "messina.it", "mi.it", "milan.it", "milano.it", "mn.it", "mo.it", "modena.it", "monza.it", "monza-brianza.it", "monza-e-della-brianza.it", "monzabrianza.it", "monzaebrianza.it", "monzaedellabrianza.it", "ms.it", "mt.it", "na.it", "naples.it", "napoli.it", "no.it", "novara.it", "nu.it", "nuoro.it", "og.it", "ogliastra.it", "olbia-tempio.it", "olbiatempio.it", "or.it", "oristano.it", "ot.it", "pa.it", "padova.it", "padua.it", "palermo.it", "parma.it", "pavia.it", "pc.it", "pd.it", "pe.it", "perugia.it", "pesaro-urbino.it", "pesarourbino.it", "pescara.it", "pg.it", "pi.it", "piacenza.it", "pisa.it", "pistoia.it", "pn.it", "po.it", "pordenone.it", "potenza.it", "pr.it", "prato.it", "pt.it", "pu.it", "pv.it", "pz.it", "ra.it", "ragusa.it", "ravenna.it", "rc.it", "re.it", "reggio-calabria.it", "reggio-emilia.it", "reggiocalabria.it", "reggioemilia.it", "rg.it", "ri.it", "rieti.it", "rimini.it", "rm.it", "rn.it", "ro.it", "roma.it", "rome.it", "rovigo.it", "sa.it", "salerno.it", "sassari.it", "savona.it", "si.it", "siena.it", "siracusa.it", "so.it", "sondrio.it", "sp.it", "sr.it", "ss.it", "s\xFCdtirol.it", "suedtirol.it", "sv.it", "ta.it", "taranto.it", "te.it", "tempio-olbia.it", "tempioolbia.it", "teramo.it", "terni.it", "tn.it", "to.it", "torino.it", "tp.it", "tr.it", "trani-andria-barletta.it", "trani-barletta-andria.it", "traniandriabarletta.it", "tranibarlettaandria.it", "trapani.it", "trento.it", "treviso.it", "trieste.it", "ts.it", "turin.it", "tv.it", "ud.it", "udine.it", "urbino-pesaro.it", "urbinopesaro.it", "va.it", "varese.it", "vb.it", "vc.it", "ve.it", "venezia.it", "venice.it", "verbania.it", "vercelli.it", "verona.it", "vi.it", "vibo-valentia.it", "vibovalentia.it", "vicenza.it", "viterbo.it", "vr.it", "vs.it", "vt.it", "vv.it", "je", "co.je", "net.je", "org.je", "*.jm", "jo", "agri.jo", "ai.jo", "com.jo", "edu.jo", "eng.jo", "fm.jo", "gov.jo", "mil.jo", "net.jo", "org.jo", "per.jo", "phd.jo", "sch.jo", "tv.jo", "jobs", "jp", "ac.jp", "ad.jp", "co.jp", "ed.jp", "go.jp", "gr.jp", "lg.jp", "ne.jp", "or.jp", "aichi.jp", "akita.jp", "aomori.jp", "chiba.jp", "ehime.jp", "fukui.jp", "fukuoka.jp", "fukushima.jp", "gifu.jp", "gunma.jp", "hiroshima.jp", "hokkaido.jp", "hyogo.jp", "ibaraki.jp", "ishikawa.jp", "iwate.jp", "kagawa.jp", "kagoshima.jp", "kanagawa.jp", "kochi.jp", "kumamoto.jp", "kyoto.jp", "mie.jp", "miyagi.jp", "miyazaki.jp", "nagano.jp", "nagasaki.jp", "nara.jp", "niigata.jp", "oita.jp", "okayama.jp", "okinawa.jp", "osaka.jp", "saga.jp", "saitama.jp", "shiga.jp", "shimane.jp", "shizuoka.jp", "tochigi.jp", "tokushima.jp", "tokyo.jp", "tottori.jp", "toyama.jp", "wakayama.jp", "yamagata.jp", "yamaguchi.jp", "yamanashi.jp", "\u4E09\u91CD.jp", "\u4EAC\u90FD.jp", "\u4F50\u8CC0.jp", "\u5175\u5EAB.jp", "\u5317\u6D77\u9053.jp", "\u5343\u8449.jp", "\u548C\u6B4C\u5C71.jp", "\u57FC\u7389.jp", "\u5927\u5206.jp", "\u5927\u962A.jp", "\u5948\u826F.jp", "\u5BAE\u57CE.jp", "\u5BAE\u5D0E.jp", "\u5BCC\u5C71.jp", "\u5C71\u53E3.jp", "\u5C71\u5F62.jp", "\u5C71\u68A8.jp", "\u5C90\u961C.jp", "\u5CA1\u5C71.jp", "\u5CA9\u624B.jp", "\u5CF6\u6839.jp", "\u5E83\u5CF6.jp", "\u5FB3\u5CF6.jp", "\u611B\u5A9B.jp", "\u611B\u77E5.jp", "\u65B0\u6F5F.jp", "\u6771\u4EAC.jp", "\u6803\u6728.jp", "\u6C96\u7E04.jp", "\u6ECB\u8CC0.jp", "\u718A\u672C.jp", "\u77F3\u5DDD.jp", "\u795E\u5948\u5DDD.jp", "\u798F\u4E95.jp", "\u798F\u5CA1.jp", "\u798F\u5CF6.jp", "\u79CB\u7530.jp", "\u7FA4\u99AC.jp", "\u8328\u57CE.jp", "\u9577\u5D0E.jp", "\u9577\u91CE.jp", "\u9752\u68EE.jp", "\u9759\u5CA1.jp", "\u9999\u5DDD.jp", "\u9AD8\u77E5.jp", "\u9CE5\u53D6.jp", "\u9E7F\u5150\u5CF6.jp", "*.kawasaki.jp", "!city.kawasaki.jp", "*.kitakyushu.jp", "!city.kitakyushu.jp", "*.kobe.jp", "!city.kobe.jp", "*.nagoya.jp", "!city.nagoya.jp", "*.sapporo.jp", "!city.sapporo.jp", "*.sendai.jp", "!city.sendai.jp", "*.yokohama.jp", "!city.yokohama.jp", "aisai.aichi.jp", "ama.aichi.jp", "anjo.aichi.jp", "asuke.aichi.jp", "chiryu.aichi.jp", "chita.aichi.jp", "fuso.aichi.jp", "gamagori.aichi.jp", "handa.aichi.jp", "hazu.aichi.jp", "hekinan.aichi.jp", "higashiura.aichi.jp", "ichinomiya.aichi.jp", "inazawa.aichi.jp", "inuyama.aichi.jp", "isshiki.aichi.jp", "iwakura.aichi.jp", "kanie.aichi.jp", "kariya.aichi.jp", "kasugai.aichi.jp", "kira.aichi.jp", "kiyosu.aichi.jp", "komaki.aichi.jp", "konan.aichi.jp", "kota.aichi.jp", "mihama.aichi.jp", "miyoshi.aichi.jp", "nishio.aichi.jp", "nisshin.aichi.jp", "obu.aichi.jp", "oguchi.aichi.jp", "oharu.aichi.jp", "okazaki.aichi.jp", "owariasahi.aichi.jp", "seto.aichi.jp", "shikatsu.aichi.jp", "shinshiro.aichi.jp", "shitara.aichi.jp", "tahara.aichi.jp", "takahama.aichi.jp", "tobishima.aichi.jp", "toei.aichi.jp", "togo.aichi.jp", "tokai.aichi.jp", "tokoname.aichi.jp", "toyoake.aichi.jp", "toyohashi.aichi.jp", "toyokawa.aichi.jp", "toyone.aichi.jp", "toyota.aichi.jp", "tsushima.aichi.jp", "yatomi.aichi.jp", "akita.akita.jp", "daisen.akita.jp", "fujisato.akita.jp", "gojome.akita.jp", "hachirogata.akita.jp", "happou.akita.jp", "higashinaruse.akita.jp", "honjo.akita.jp", "honjyo.akita.jp", "ikawa.akita.jp", "kamikoani.akita.jp", "kamioka.akita.jp", "katagami.akita.jp", "kazuno.akita.jp", "kitaakita.akita.jp", "kosaka.akita.jp", "kyowa.akita.jp", "misato.akita.jp", "mitane.akita.jp", "moriyoshi.akita.jp", "nikaho.akita.jp", "noshiro.akita.jp", "odate.akita.jp", "oga.akita.jp", "ogata.akita.jp", "semboku.akita.jp", "yokote.akita.jp", "yurihonjo.akita.jp", "aomori.aomori.jp", "gonohe.aomori.jp", "hachinohe.aomori.jp", "hashikami.aomori.jp", "hiranai.aomori.jp", "hirosaki.aomori.jp", "itayanagi.aomori.jp", "kuroishi.aomori.jp", "misawa.aomori.jp", "mutsu.aomori.jp", "nakadomari.aomori.jp", "noheji.aomori.jp", "oirase.aomori.jp", "owani.aomori.jp", "rokunohe.aomori.jp", "sannohe.aomori.jp", "shichinohe.aomori.jp", "shingo.aomori.jp", "takko.aomori.jp", "towada.aomori.jp", "tsugaru.aomori.jp", "tsuruta.aomori.jp", "abiko.chiba.jp", "asahi.chiba.jp", "chonan.chiba.jp", "chosei.chiba.jp", "choshi.chiba.jp", "chuo.chiba.jp", "funabashi.chiba.jp", "futtsu.chiba.jp", "hanamigawa.chiba.jp", "ichihara.chiba.jp", "ichikawa.chiba.jp", "ichinomiya.chiba.jp", "inzai.chiba.jp", "isumi.chiba.jp", "kamagaya.chiba.jp", "kamogawa.chiba.jp", "kashiwa.chiba.jp", "katori.chiba.jp", "katsuura.chiba.jp", "kimitsu.chiba.jp", "kisarazu.chiba.jp", "kozaki.chiba.jp", "kujukuri.chiba.jp", "kyonan.chiba.jp", "matsudo.chiba.jp", "midori.chiba.jp", "mihama.chiba.jp", "minamiboso.chiba.jp", "mobara.chiba.jp", "mutsuzawa.chiba.jp", "nagara.chiba.jp", "nagareyama.chiba.jp", "narashino.chiba.jp", "narita.chiba.jp", "noda.chiba.jp", "oamishirasato.chiba.jp", "omigawa.chiba.jp", "onjuku.chiba.jp", "otaki.chiba.jp", "sakae.chiba.jp", "sakura.chiba.jp", "shimofusa.chiba.jp", "shirako.chiba.jp", "shiroi.chiba.jp", "shisui.chiba.jp", "sodegaura.chiba.jp", "sosa.chiba.jp", "tako.chiba.jp", "tateyama.chiba.jp", "togane.chiba.jp", "tohnosho.chiba.jp", "tomisato.chiba.jp", "urayasu.chiba.jp", "yachimata.chiba.jp", "yachiyo.chiba.jp", "yokaichiba.chiba.jp", "yokoshibahikari.chiba.jp", "yotsukaido.chiba.jp", "ainan.ehime.jp", "honai.ehime.jp", "ikata.ehime.jp", "imabari.ehime.jp", "iyo.ehime.jp", "kamijima.ehime.jp", "kihoku.ehime.jp", "kumakogen.ehime.jp", "masaki.ehime.jp", "matsuno.ehime.jp", "matsuyama.ehime.jp", "namikata.ehime.jp", "niihama.ehime.jp", "ozu.ehime.jp", "saijo.ehime.jp", "seiyo.ehime.jp", "shikokuchuo.ehime.jp", "tobe.ehime.jp", "toon.ehime.jp", "uchiko.ehime.jp", "uwajima.ehime.jp", "yawatahama.ehime.jp", "echizen.fukui.jp", "eiheiji.fukui.jp", "fukui.fukui.jp", "ikeda.fukui.jp", "katsuyama.fukui.jp", "mihama.fukui.jp", "minamiechizen.fukui.jp", "obama.fukui.jp", "ohi.fukui.jp", "ono.fukui.jp", "sabae.fukui.jp", "sakai.fukui.jp", "takahama.fukui.jp", "tsuruga.fukui.jp", "wakasa.fukui.jp", "ashiya.fukuoka.jp", "buzen.fukuoka.jp", "chikugo.fukuoka.jp", "chikuho.fukuoka.jp", "chikujo.fukuoka.jp", "chikushino.fukuoka.jp", "chikuzen.fukuoka.jp", "chuo.fukuoka.jp", "dazaifu.fukuoka.jp", "fukuchi.fukuoka.jp", "hakata.fukuoka.jp", "higashi.fukuoka.jp", "hirokawa.fukuoka.jp", "hisayama.fukuoka.jp", "iizuka.fukuoka.jp", "inatsuki.fukuoka.jp", "kaho.fukuoka.jp", "kasuga.fukuoka.jp", "kasuya.fukuoka.jp", "kawara.fukuoka.jp", "keisen.fukuoka.jp", "koga.fukuoka.jp", "kurate.fukuoka.jp", "kurogi.fukuoka.jp", "kurume.fukuoka.jp", "minami.fukuoka.jp", "miyako.fukuoka.jp", "miyama.fukuoka.jp", "miyawaka.fukuoka.jp", "mizumaki.fukuoka.jp", "munakata.fukuoka.jp", "nakagawa.fukuoka.jp", "nakama.fukuoka.jp", "nishi.fukuoka.jp", "nogata.fukuoka.jp", "ogori.fukuoka.jp", "okagaki.fukuoka.jp", "okawa.fukuoka.jp", "oki.fukuoka.jp", "omuta.fukuoka.jp", "onga.fukuoka.jp", "onojo.fukuoka.jp", "oto.fukuoka.jp", "saigawa.fukuoka.jp", "sasaguri.fukuoka.jp", "shingu.fukuoka.jp", "shinyoshitomi.fukuoka.jp", "shonai.fukuoka.jp", "soeda.fukuoka.jp", "sue.fukuoka.jp", "tachiarai.fukuoka.jp", "tagawa.fukuoka.jp", "takata.fukuoka.jp", "toho.fukuoka.jp", "toyotsu.fukuoka.jp", "tsuiki.fukuoka.jp", "ukiha.fukuoka.jp", "umi.fukuoka.jp", "usui.fukuoka.jp", "yamada.fukuoka.jp", "yame.fukuoka.jp", "yanagawa.fukuoka.jp", "yukuhashi.fukuoka.jp", "aizubange.fukushima.jp", "aizumisato.fukushima.jp", "aizuwakamatsu.fukushima.jp", "asakawa.fukushima.jp", "bandai.fukushima.jp", "date.fukushima.jp", "fukushima.fukushima.jp", "furudono.fukushima.jp", "futaba.fukushima.jp", "hanawa.fukushima.jp", "higashi.fukushima.jp", "hirata.fukushima.jp", "hirono.fukushima.jp", "iitate.fukushima.jp", "inawashiro.fukushima.jp", "ishikawa.fukushima.jp", "iwaki.fukushima.jp", "izumizaki.fukushima.jp", "kagamiishi.fukushima.jp", "kaneyama.fukushima.jp", "kawamata.fukushima.jp", "kitakata.fukushima.jp", "kitashiobara.fukushima.jp", "koori.fukushima.jp", "koriyama.fukushima.jp", "kunimi.fukushima.jp", "miharu.fukushima.jp", "mishima.fukushima.jp", "namie.fukushima.jp", "nango.fukushima.jp", "nishiaizu.fukushima.jp", "nishigo.fukushima.jp", "okuma.fukushima.jp", "omotego.fukushima.jp", "ono.fukushima.jp", "otama.fukushima.jp", "samegawa.fukushima.jp", "shimogo.fukushima.jp", "shirakawa.fukushima.jp", "showa.fukushima.jp", "soma.fukushima.jp", "sukagawa.fukushima.jp", "taishin.fukushima.jp", "tamakawa.fukushima.jp", "tanagura.fukushima.jp", "tenei.fukushima.jp", "yabuki.fukushima.jp", "yamato.fukushima.jp", "yamatsuri.fukushima.jp", "yanaizu.fukushima.jp", "yugawa.fukushima.jp", "anpachi.gifu.jp", "ena.gifu.jp", "gifu.gifu.jp", "ginan.gifu.jp", "godo.gifu.jp", "gujo.gifu.jp", "hashima.gifu.jp", "hichiso.gifu.jp", "hida.gifu.jp", "higashishirakawa.gifu.jp", "ibigawa.gifu.jp", "ikeda.gifu.jp", "kakamigahara.gifu.jp", "kani.gifu.jp", "kasahara.gifu.jp", "kasamatsu.gifu.jp", "kawaue.gifu.jp", "kitagata.gifu.jp", "mino.gifu.jp", "minokamo.gifu.jp", "mitake.gifu.jp", "mizunami.gifu.jp", "motosu.gifu.jp", "nakatsugawa.gifu.jp", "ogaki.gifu.jp", "sakahogi.gifu.jp", "seki.gifu.jp", "sekigahara.gifu.jp", "shirakawa.gifu.jp", "tajimi.gifu.jp", "takayama.gifu.jp", "tarui.gifu.jp", "toki.gifu.jp", "tomika.gifu.jp", "wanouchi.gifu.jp", "yamagata.gifu.jp", "yaotsu.gifu.jp", "yoro.gifu.jp", "annaka.gunma.jp", "chiyoda.gunma.jp", "fujioka.gunma.jp", "higashiagatsuma.gunma.jp", "isesaki.gunma.jp", "itakura.gunma.jp", "kanna.gunma.jp", "kanra.gunma.jp", "katashina.gunma.jp", "kawaba.gunma.jp", "kiryu.gunma.jp", "kusatsu.gunma.jp", "maebashi.gunma.jp", "meiwa.gunma.jp", "midori.gunma.jp", "minakami.gunma.jp", "naganohara.gunma.jp", "nakanojo.gunma.jp", "nanmoku.gunma.jp", "numata.gunma.jp", "oizumi.gunma.jp", "ora.gunma.jp", "ota.gunma.jp", "shibukawa.gunma.jp", "shimonita.gunma.jp", "shinto.gunma.jp", "showa.gunma.jp", "takasaki.gunma.jp", "takayama.gunma.jp", "tamamura.gunma.jp", "tatebayashi.gunma.jp", "tomioka.gunma.jp", "tsukiyono.gunma.jp", "tsumagoi.gunma.jp", "ueno.gunma.jp", "yoshioka.gunma.jp", "asaminami.hiroshima.jp", "daiwa.hiroshima.jp", "etajima.hiroshima.jp", "fuchu.hiroshima.jp", "fukuyama.hiroshima.jp", "hatsukaichi.hiroshima.jp", "higashihiroshima.hiroshima.jp", "hongo.hiroshima.jp", "jinsekikogen.hiroshima.jp", "kaita.hiroshima.jp", "kui.hiroshima.jp", "kumano.hiroshima.jp", "kure.hiroshima.jp", "mihara.hiroshima.jp", "miyoshi.hiroshima.jp", "naka.hiroshima.jp", "onomichi.hiroshima.jp", "osakikamijima.hiroshima.jp", "otake.hiroshima.jp", "saka.hiroshima.jp", "sera.hiroshima.jp", "seranishi.hiroshima.jp", "shinichi.hiroshima.jp", "shobara.hiroshima.jp", "takehara.hiroshima.jp", "abashiri.hokkaido.jp", "abira.hokkaido.jp", "aibetsu.hokkaido.jp", "akabira.hokkaido.jp", "akkeshi.hokkaido.jp", "asahikawa.hokkaido.jp", "ashibetsu.hokkaido.jp", "ashoro.hokkaido.jp", "assabu.hokkaido.jp", "atsuma.hokkaido.jp", "bibai.hokkaido.jp", "biei.hokkaido.jp", "bifuka.hokkaido.jp", "bihoro.hokkaido.jp", "biratori.hokkaido.jp", "chippubetsu.hokkaido.jp", "chitose.hokkaido.jp", "date.hokkaido.jp", "ebetsu.hokkaido.jp", "embetsu.hokkaido.jp", "eniwa.hokkaido.jp", "erimo.hokkaido.jp", "esan.hokkaido.jp", "esashi.hokkaido.jp", "fukagawa.hokkaido.jp", "fukushima.hokkaido.jp", "furano.hokkaido.jp", "furubira.hokkaido.jp", "haboro.hokkaido.jp", "hakodate.hokkaido.jp", "hamatonbetsu.hokkaido.jp", "hidaka.hokkaido.jp", "higashikagura.hokkaido.jp", "higashikawa.hokkaido.jp", "hiroo.hokkaido.jp", "hokuryu.hokkaido.jp", "hokuto.hokkaido.jp", "honbetsu.hokkaido.jp", "horokanai.hokkaido.jp", "horonobe.hokkaido.jp", "ikeda.hokkaido.jp", "imakane.hokkaido.jp", "ishikari.hokkaido.jp", "iwamizawa.hokkaido.jp", "iwanai.hokkaido.jp", "kamifurano.hokkaido.jp", "kamikawa.hokkaido.jp", "kamishihoro.hokkaido.jp", "kamisunagawa.hokkaido.jp", "kamoenai.hokkaido.jp", "kayabe.hokkaido.jp", "kembuchi.hokkaido.jp", "kikonai.hokkaido.jp", "kimobetsu.hokkaido.jp", "kitahiroshima.hokkaido.jp", "kitami.hokkaido.jp", "kiyosato.hokkaido.jp", "koshimizu.hokkaido.jp", "kunneppu.hokkaido.jp", "kuriyama.hokkaido.jp", "kuromatsunai.hokkaido.jp", "kushiro.hokkaido.jp", "kutchan.hokkaido.jp", "kyowa.hokkaido.jp", "mashike.hokkaido.jp", "matsumae.hokkaido.jp", "mikasa.hokkaido.jp", "minamifurano.hokkaido.jp", "mombetsu.hokkaido.jp", "moseushi.hokkaido.jp", "mukawa.hokkaido.jp", "muroran.hokkaido.jp", "naie.hokkaido.jp", "nakagawa.hokkaido.jp", "nakasatsunai.hokkaido.jp", "nakatombetsu.hokkaido.jp", "nanae.hokkaido.jp", "nanporo.hokkaido.jp", "nayoro.hokkaido.jp", "nemuro.hokkaido.jp", "niikappu.hokkaido.jp", "niki.hokkaido.jp", "nishiokoppe.hokkaido.jp", "noboribetsu.hokkaido.jp", "numata.hokkaido.jp", "obihiro.hokkaido.jp", "obira.hokkaido.jp", "oketo.hokkaido.jp", "okoppe.hokkaido.jp", "otaru.hokkaido.jp", "otobe.hokkaido.jp", "otofuke.hokkaido.jp", "otoineppu.hokkaido.jp", "oumu.hokkaido.jp", "ozora.hokkaido.jp", "pippu.hokkaido.jp", "rankoshi.hokkaido.jp", "rebun.hokkaido.jp", "rikubetsu.hokkaido.jp", "rishiri.hokkaido.jp", "rishirifuji.hokkaido.jp", "saroma.hokkaido.jp", "sarufutsu.hokkaido.jp", "shakotan.hokkaido.jp", "shari.hokkaido.jp", "shibecha.hokkaido.jp", "shibetsu.hokkaido.jp", "shikabe.hokkaido.jp", "shikaoi.hokkaido.jp", "shimamaki.hokkaido.jp", "shimizu.hokkaido.jp", "shimokawa.hokkaido.jp", "shinshinotsu.hokkaido.jp", "shintoku.hokkaido.jp", "shiranuka.hokkaido.jp", "shiraoi.hokkaido.jp", "shiriuchi.hokkaido.jp", "sobetsu.hokkaido.jp", "sunagawa.hokkaido.jp", "taiki.hokkaido.jp", "takasu.hokkaido.jp", "takikawa.hokkaido.jp", "takinoue.hokkaido.jp", "teshikaga.hokkaido.jp", "tobetsu.hokkaido.jp", "tohma.hokkaido.jp", "tomakomai.hokkaido.jp", "tomari.hokkaido.jp", "toya.hokkaido.jp", "toyako.hokkaido.jp", "toyotomi.hokkaido.jp", "toyoura.hokkaido.jp", "tsubetsu.hokkaido.jp", "tsukigata.hokkaido.jp", "urakawa.hokkaido.jp", "urausu.hokkaido.jp", "uryu.hokkaido.jp", "utashinai.hokkaido.jp", "wakkanai.hokkaido.jp", "wassamu.hokkaido.jp", "yakumo.hokkaido.jp", "yoichi.hokkaido.jp", "aioi.hyogo.jp", "akashi.hyogo.jp", "ako.hyogo.jp", "amagasaki.hyogo.jp", "aogaki.hyogo.jp", "asago.hyogo.jp", "ashiya.hyogo.jp", "awaji.hyogo.jp", "fukusaki.hyogo.jp", "goshiki.hyogo.jp", "harima.hyogo.jp", "himeji.hyogo.jp", "ichikawa.hyogo.jp", "inagawa.hyogo.jp", "itami.hyogo.jp", "kakogawa.hyogo.jp", "kamigori.hyogo.jp", "kamikawa.hyogo.jp", "kasai.hyogo.jp", "kasuga.hyogo.jp", "kawanishi.hyogo.jp", "miki.hyogo.jp", "minamiawaji.hyogo.jp", "nishinomiya.hyogo.jp", "nishiwaki.hyogo.jp", "ono.hyogo.jp", "sanda.hyogo.jp", "sannan.hyogo.jp", "sasayama.hyogo.jp", "sayo.hyogo.jp", "shingu.hyogo.jp", "shinonsen.hyogo.jp", "shiso.hyogo.jp", "sumoto.hyogo.jp", "taishi.hyogo.jp", "taka.hyogo.jp", "takarazuka.hyogo.jp", "takasago.hyogo.jp", "takino.hyogo.jp", "tamba.hyogo.jp", "tatsuno.hyogo.jp", "toyooka.hyogo.jp", "yabu.hyogo.jp", "yashiro.hyogo.jp", "yoka.hyogo.jp", "yokawa.hyogo.jp", "ami.ibaraki.jp", "asahi.ibaraki.jp", "bando.ibaraki.jp", "chikusei.ibaraki.jp", "daigo.ibaraki.jp", "fujishiro.ibaraki.jp", "hitachi.ibaraki.jp", "hitachinaka.ibaraki.jp", "hitachiomiya.ibaraki.jp", "hitachiota.ibaraki.jp", "ibaraki.ibaraki.jp", "ina.ibaraki.jp", "inashiki.ibaraki.jp", "itako.ibaraki.jp", "iwama.ibaraki.jp", "joso.ibaraki.jp", "kamisu.ibaraki.jp", "kasama.ibaraki.jp", "kashima.ibaraki.jp", "kasumigaura.ibaraki.jp", "koga.ibaraki.jp", "miho.ibaraki.jp", "mito.ibaraki.jp", "moriya.ibaraki.jp", "naka.ibaraki.jp", "namegata.ibaraki.jp", "oarai.ibaraki.jp", "ogawa.ibaraki.jp", "omitama.ibaraki.jp", "ryugasaki.ibaraki.jp", "sakai.ibaraki.jp", "sakuragawa.ibaraki.jp", "shimodate.ibaraki.jp", "shimotsuma.ibaraki.jp", "shirosato.ibaraki.jp", "sowa.ibaraki.jp", "suifu.ibaraki.jp", "takahagi.ibaraki.jp", "tamatsukuri.ibaraki.jp", "tokai.ibaraki.jp", "tomobe.ibaraki.jp", "tone.ibaraki.jp", "toride.ibaraki.jp", "tsuchiura.ibaraki.jp", "tsukuba.ibaraki.jp", "uchihara.ibaraki.jp", "ushiku.ibaraki.jp", "yachiyo.ibaraki.jp", "yamagata.ibaraki.jp", "yawara.ibaraki.jp", "yuki.ibaraki.jp", "anamizu.ishikawa.jp", "hakui.ishikawa.jp", "hakusan.ishikawa.jp", "kaga.ishikawa.jp", "kahoku.ishikawa.jp", "kanazawa.ishikawa.jp", "kawakita.ishikawa.jp", "komatsu.ishikawa.jp", "nakanoto.ishikawa.jp", "nanao.ishikawa.jp", "nomi.ishikawa.jp", "nonoichi.ishikawa.jp", "noto.ishikawa.jp", "shika.ishikawa.jp", "suzu.ishikawa.jp", "tsubata.ishikawa.jp", "tsurugi.ishikawa.jp", "uchinada.ishikawa.jp", "wajima.ishikawa.jp", "fudai.iwate.jp", "fujisawa.iwate.jp", "hanamaki.iwate.jp", "hiraizumi.iwate.jp", "hirono.iwate.jp", "ichinohe.iwate.jp", "ichinoseki.iwate.jp", "iwaizumi.iwate.jp", "iwate.iwate.jp", "joboji.iwate.jp", "kamaishi.iwate.jp", "kanegasaki.iwate.jp", "karumai.iwate.jp", "kawai.iwate.jp", "kitakami.iwate.jp", "kuji.iwate.jp", "kunohe.iwate.jp", "kuzumaki.iwate.jp", "miyako.iwate.jp", "mizusawa.iwate.jp", "morioka.iwate.jp", "ninohe.iwate.jp", "noda.iwate.jp", "ofunato.iwate.jp", "oshu.iwate.jp", "otsuchi.iwate.jp", "rikuzentakata.iwate.jp", "shiwa.iwate.jp", "shizukuishi.iwate.jp", "sumita.iwate.jp", "tanohata.iwate.jp", "tono.iwate.jp", "yahaba.iwate.jp", "yamada.iwate.jp", "ayagawa.kagawa.jp", "higashikagawa.kagawa.jp", "kanonji.kagawa.jp", "kotohira.kagawa.jp", "manno.kagawa.jp", "marugame.kagawa.jp", "mitoyo.kagawa.jp", "naoshima.kagawa.jp", "sanuki.kagawa.jp", "tadotsu.kagawa.jp", "takamatsu.kagawa.jp", "tonosho.kagawa.jp", "uchinomi.kagawa.jp", "utazu.kagawa.jp", "zentsuji.kagawa.jp", "akune.kagoshima.jp", "amami.kagoshima.jp", "hioki.kagoshima.jp", "isa.kagoshima.jp", "isen.kagoshima.jp", "izumi.kagoshima.jp", "kagoshima.kagoshima.jp", "kanoya.kagoshima.jp", "kawanabe.kagoshima.jp", "kinko.kagoshima.jp", "kouyama.kagoshima.jp", "makurazaki.kagoshima.jp", "matsumoto.kagoshima.jp", "minamitane.kagoshima.jp", "nakatane.kagoshima.jp", "nishinoomote.kagoshima.jp", "satsumasendai.kagoshima.jp", "soo.kagoshima.jp", "tarumizu.kagoshima.jp", "yusui.kagoshima.jp", "aikawa.kanagawa.jp", "atsugi.kanagawa.jp", "ayase.kanagawa.jp", "chigasaki.kanagawa.jp", "ebina.kanagawa.jp", "fujisawa.kanagawa.jp", "hadano.kanagawa.jp", "hakone.kanagawa.jp", "hiratsuka.kanagawa.jp", "isehara.kanagawa.jp", "kaisei.kanagawa.jp", "kamakura.kanagawa.jp", "kiyokawa.kanagawa.jp", "matsuda.kanagawa.jp", "minamiashigara.kanagawa.jp", "miura.kanagawa.jp", "nakai.kanagawa.jp", "ninomiya.kanagawa.jp", "odawara.kanagawa.jp", "oi.kanagawa.jp", "oiso.kanagawa.jp", "sagamihara.kanagawa.jp", "samukawa.kanagawa.jp", "tsukui.kanagawa.jp", "yamakita.kanagawa.jp", "yamato.kanagawa.jp", "yokosuka.kanagawa.jp", "yugawara.kanagawa.jp", "zama.kanagawa.jp", "zushi.kanagawa.jp", "aki.kochi.jp", "geisei.kochi.jp", "hidaka.kochi.jp", "higashitsuno.kochi.jp", "ino.kochi.jp", "kagami.kochi.jp", "kami.kochi.jp", "kitagawa.kochi.jp", "kochi.kochi.jp", "mihara.kochi.jp", "motoyama.kochi.jp", "muroto.kochi.jp", "nahari.kochi.jp", "nakamura.kochi.jp", "nankoku.kochi.jp", "nishitosa.kochi.jp", "niyodogawa.kochi.jp", "ochi.kochi.jp", "okawa.kochi.jp", "otoyo.kochi.jp", "otsuki.kochi.jp", "sakawa.kochi.jp", "sukumo.kochi.jp", "susaki.kochi.jp", "tosa.kochi.jp", "tosashimizu.kochi.jp", "toyo.kochi.jp", "tsuno.kochi.jp", "umaji.kochi.jp", "yasuda.kochi.jp", "yusuhara.kochi.jp", "amakusa.kumamoto.jp", "arao.kumamoto.jp", "aso.kumamoto.jp", "choyo.kumamoto.jp", "gyokuto.kumamoto.jp", "kamiamakusa.kumamoto.jp", "kikuchi.kumamoto.jp", "kumamoto.kumamoto.jp", "mashiki.kumamoto.jp", "mifune.kumamoto.jp", "minamata.kumamoto.jp", "minamioguni.kumamoto.jp", "nagasu.kumamoto.jp", "nishihara.kumamoto.jp", "oguni.kumamoto.jp", "ozu.kumamoto.jp", "sumoto.kumamoto.jp", "takamori.kumamoto.jp", "uki.kumamoto.jp", "uto.kumamoto.jp", "yamaga.kumamoto.jp", "yamato.kumamoto.jp", "yatsushiro.kumamoto.jp", "ayabe.kyoto.jp", "fukuchiyama.kyoto.jp", "higashiyama.kyoto.jp", "ide.kyoto.jp", "ine.kyoto.jp", "joyo.kyoto.jp", "kameoka.kyoto.jp", "kamo.kyoto.jp", "kita.kyoto.jp", "kizu.kyoto.jp", "kumiyama.kyoto.jp", "kyotamba.kyoto.jp", "kyotanabe.kyoto.jp", "kyotango.kyoto.jp", "maizuru.kyoto.jp", "minami.kyoto.jp", "minamiyamashiro.kyoto.jp", "miyazu.kyoto.jp", "muko.kyoto.jp", "nagaokakyo.kyoto.jp", "nakagyo.kyoto.jp", "nantan.kyoto.jp", "oyamazaki.kyoto.jp", "sakyo.kyoto.jp", "seika.kyoto.jp", "tanabe.kyoto.jp", "uji.kyoto.jp", "ujitawara.kyoto.jp", "wazuka.kyoto.jp", "yamashina.kyoto.jp", "yawata.kyoto.jp", "asahi.mie.jp", "inabe.mie.jp", "ise.mie.jp", "kameyama.mie.jp", "kawagoe.mie.jp", "kiho.mie.jp", "kisosaki.mie.jp", "kiwa.mie.jp", "komono.mie.jp", "kumano.mie.jp", "kuwana.mie.jp", "matsusaka.mie.jp", "meiwa.mie.jp", "mihama.mie.jp", "minamiise.mie.jp", "misugi.mie.jp", "miyama.mie.jp", "nabari.mie.jp", "shima.mie.jp", "suzuka.mie.jp", "tado.mie.jp", "taiki.mie.jp", "taki.mie.jp", "tamaki.mie.jp", "toba.mie.jp", "tsu.mie.jp", "udono.mie.jp", "ureshino.mie.jp", "watarai.mie.jp", "yokkaichi.mie.jp", "furukawa.miyagi.jp", "higashimatsushima.miyagi.jp", "ishinomaki.miyagi.jp", "iwanuma.miyagi.jp", "kakuda.miyagi.jp", "kami.miyagi.jp", "kawasaki.miyagi.jp", "marumori.miyagi.jp", "matsushima.miyagi.jp", "minamisanriku.miyagi.jp", "misato.miyagi.jp", "murata.miyagi.jp", "natori.miyagi.jp", "ogawara.miyagi.jp", "ohira.miyagi.jp", "onagawa.miyagi.jp", "osaki.miyagi.jp", "rifu.miyagi.jp", "semine.miyagi.jp", "shibata.miyagi.jp", "shichikashuku.miyagi.jp", "shikama.miyagi.jp", "shiogama.miyagi.jp", "shiroishi.miyagi.jp", "tagajo.miyagi.jp", "taiwa.miyagi.jp", "tome.miyagi.jp", "tomiya.miyagi.jp", "wakuya.miyagi.jp", "watari.miyagi.jp", "yamamoto.miyagi.jp", "zao.miyagi.jp", "aya.miyazaki.jp", "ebino.miyazaki.jp", "gokase.miyazaki.jp", "hyuga.miyazaki.jp", "kadogawa.miyazaki.jp", "kawaminami.miyazaki.jp", "kijo.miyazaki.jp", "kitagawa.miyazaki.jp", "kitakata.miyazaki.jp", "kitaura.miyazaki.jp", "kobayashi.miyazaki.jp", "kunitomi.miyazaki.jp", "kushima.miyazaki.jp", "mimata.miyazaki.jp", "miyakonojo.miyazaki.jp", "miyazaki.miyazaki.jp", "morotsuka.miyazaki.jp", "nichinan.miyazaki.jp", "nishimera.miyazaki.jp", "nobeoka.miyazaki.jp", "saito.miyazaki.jp", "shiiba.miyazaki.jp", "shintomi.miyazaki.jp", "takaharu.miyazaki.jp", "takanabe.miyazaki.jp", "takazaki.miyazaki.jp", "tsuno.miyazaki.jp", "achi.nagano.jp", "agematsu.nagano.jp", "anan.nagano.jp", "aoki.nagano.jp", "asahi.nagano.jp", "azumino.nagano.jp", "chikuhoku.nagano.jp", "chikuma.nagano.jp", "chino.nagano.jp", "fujimi.nagano.jp", "hakuba.nagano.jp", "hara.nagano.jp", "hiraya.nagano.jp", "iida.nagano.jp", "iijima.nagano.jp", "iiyama.nagano.jp", "iizuna.nagano.jp", "ikeda.nagano.jp", "ikusaka.nagano.jp", "ina.nagano.jp", "karuizawa.nagano.jp", "kawakami.nagano.jp", "kiso.nagano.jp", "kisofukushima.nagano.jp", "kitaaiki.nagano.jp", "komagane.nagano.jp", "komoro.nagano.jp", "matsukawa.nagano.jp", "matsumoto.nagano.jp", "miasa.nagano.jp", "minamiaiki.nagano.jp", "minamimaki.nagano.jp", "minamiminowa.nagano.jp", "minowa.nagano.jp", "miyada.nagano.jp", "miyota.nagano.jp", "mochizuki.nagano.jp", "nagano.nagano.jp", "nagawa.nagano.jp", "nagiso.nagano.jp", "nakagawa.nagano.jp", "nakano.nagano.jp", "nozawaonsen.nagano.jp", "obuse.nagano.jp", "ogawa.nagano.jp", "okaya.nagano.jp", "omachi.nagano.jp", "omi.nagano.jp", "ookuwa.nagano.jp", "ooshika.nagano.jp", "otaki.nagano.jp", "otari.nagano.jp", "sakae.nagano.jp", "sakaki.nagano.jp", "saku.nagano.jp", "sakuho.nagano.jp", "shimosuwa.nagano.jp", "shinanomachi.nagano.jp", "shiojiri.nagano.jp", "suwa.nagano.jp", "suzaka.nagano.jp", "takagi.nagano.jp", "takamori.nagano.jp", "takayama.nagano.jp", "tateshina.nagano.jp", "tatsuno.nagano.jp", "togakushi.nagano.jp", "togura.nagano.jp", "tomi.nagano.jp", "ueda.nagano.jp", "wada.nagano.jp", "yamagata.nagano.jp", "yamanouchi.nagano.jp", "yasaka.nagano.jp", "yasuoka.nagano.jp", "chijiwa.nagasaki.jp", "futsu.nagasaki.jp", "goto.nagasaki.jp", "hasami.nagasaki.jp", "hirado.nagasaki.jp", "iki.nagasaki.jp", "isahaya.nagasaki.jp", "kawatana.nagasaki.jp", "kuchinotsu.nagasaki.jp", "matsuura.nagasaki.jp", "nagasaki.nagasaki.jp", "obama.nagasaki.jp", "omura.nagasaki.jp", "oseto.nagasaki.jp", "saikai.nagasaki.jp", "sasebo.nagasaki.jp", "seihi.nagasaki.jp", "shimabara.nagasaki.jp", "shinkamigoto.nagasaki.jp", "togitsu.nagasaki.jp", "tsushima.nagasaki.jp", "unzen.nagasaki.jp", "ando.nara.jp", "gose.nara.jp", "heguri.nara.jp", "higashiyoshino.nara.jp", "ikaruga.nara.jp", "ikoma.nara.jp", "kamikitayama.nara.jp", "kanmaki.nara.jp", "kashiba.nara.jp", "kashihara.nara.jp", "katsuragi.nara.jp", "kawai.nara.jp", "kawakami.nara.jp", "kawanishi.nara.jp", "koryo.nara.jp", "kurotaki.nara.jp", "mitsue.nara.jp", "miyake.nara.jp", "nara.nara.jp", "nosegawa.nara.jp", "oji.nara.jp", "ouda.nara.jp", "oyodo.nara.jp", "sakurai.nara.jp", "sango.nara.jp", "shimoichi.nara.jp", "shimokitayama.nara.jp", "shinjo.nara.jp", "soni.nara.jp", "takatori.nara.jp", "tawaramoto.nara.jp", "tenkawa.nara.jp", "tenri.nara.jp", "uda.nara.jp", "yamatokoriyama.nara.jp", "yamatotakada.nara.jp", "yamazoe.nara.jp", "yoshino.nara.jp", "aga.niigata.jp", "agano.niigata.jp", "gosen.niigata.jp", "itoigawa.niigata.jp", "izumozaki.niigata.jp", "joetsu.niigata.jp", "kamo.niigata.jp", "kariwa.niigata.jp", "kashiwazaki.niigata.jp", "minamiuonuma.niigata.jp", "mitsuke.niigata.jp", "muika.niigata.jp", "murakami.niigata.jp", "myoko.niigata.jp", "nagaoka.niigata.jp", "niigata.niigata.jp", "ojiya.niigata.jp", "omi.niigata.jp", "sado.niigata.jp", "sanjo.niigata.jp", "seiro.niigata.jp", "seirou.niigata.jp", "sekikawa.niigata.jp", "shibata.niigata.jp", "tagami.niigata.jp", "tainai.niigata.jp", "tochio.niigata.jp", "tokamachi.niigata.jp", "tsubame.niigata.jp", "tsunan.niigata.jp", "uonuma.niigata.jp", "yahiko.niigata.jp", "yoita.niigata.jp", "yuzawa.niigata.jp", "beppu.oita.jp", "bungoono.oita.jp", "bungotakada.oita.jp", "hasama.oita.jp", "hiji.oita.jp", "himeshima.oita.jp", "hita.oita.jp", "kamitsue.oita.jp", "kokonoe.oita.jp", "kuju.oita.jp", "kunisaki.oita.jp", "kusu.oita.jp", "oita.oita.jp", "saiki.oita.jp", "taketa.oita.jp", "tsukumi.oita.jp", "usa.oita.jp", "usuki.oita.jp", "yufu.oita.jp", "akaiwa.okayama.jp", "asakuchi.okayama.jp", "bizen.okayama.jp", "hayashima.okayama.jp", "ibara.okayama.jp", "kagamino.okayama.jp", "kasaoka.okayama.jp", "kibichuo.okayama.jp", "kumenan.okayama.jp", "kurashiki.okayama.jp", "maniwa.okayama.jp", "misaki.okayama.jp", "nagi.okayama.jp", "niimi.okayama.jp", "nishiawakura.okayama.jp", "okayama.okayama.jp", "satosho.okayama.jp", "setouchi.okayama.jp", "shinjo.okayama.jp", "shoo.okayama.jp", "soja.okayama.jp", "takahashi.okayama.jp", "tamano.okayama.jp", "tsuyama.okayama.jp", "wake.okayama.jp", "yakage.okayama.jp", "aguni.okinawa.jp", "ginowan.okinawa.jp", "ginoza.okinawa.jp", "gushikami.okinawa.jp", "haebaru.okinawa.jp", "higashi.okinawa.jp", "hirara.okinawa.jp", "iheya.okinawa.jp", "ishigaki.okinawa.jp", "ishikawa.okinawa.jp", "itoman.okinawa.jp", "izena.okinawa.jp", "kadena.okinawa.jp", "kin.okinawa.jp", "kitadaito.okinawa.jp", "kitanakagusuku.okinawa.jp", "kumejima.okinawa.jp", "kunigami.okinawa.jp", "minamidaito.okinawa.jp", "motobu.okinawa.jp", "nago.okinawa.jp", "naha.okinawa.jp", "nakagusuku.okinawa.jp", "nakijin.okinawa.jp", "nanjo.okinawa.jp", "nishihara.okinawa.jp", "ogimi.okinawa.jp", "okinawa.okinawa.jp", "onna.okinawa.jp", "shimoji.okinawa.jp", "taketomi.okinawa.jp", "tarama.okinawa.jp", "tokashiki.okinawa.jp", "tomigusuku.okinawa.jp", "tonaki.okinawa.jp", "urasoe.okinawa.jp", "uruma.okinawa.jp", "yaese.okinawa.jp", "yomitan.okinawa.jp", "yonabaru.okinawa.jp", "yonaguni.okinawa.jp", "zamami.okinawa.jp", "abeno.osaka.jp", "chihayaakasaka.osaka.jp", "chuo.osaka.jp", "daito.osaka.jp", "fujiidera.osaka.jp", "habikino.osaka.jp", "hannan.osaka.jp", "higashiosaka.osaka.jp", "higashisumiyoshi.osaka.jp", "higashiyodogawa.osaka.jp", "hirakata.osaka.jp", "ibaraki.osaka.jp", "ikeda.osaka.jp", "izumi.osaka.jp", "izumiotsu.osaka.jp", "izumisano.osaka.jp", "kadoma.osaka.jp", "kaizuka.osaka.jp", "kanan.osaka.jp", "kashiwara.osaka.jp", "katano.osaka.jp", "kawachinagano.osaka.jp", "kishiwada.osaka.jp", "kita.osaka.jp", "kumatori.osaka.jp", "matsubara.osaka.jp", "minato.osaka.jp", "minoh.osaka.jp", "misaki.osaka.jp", "moriguchi.osaka.jp", "neyagawa.osaka.jp", "nishi.osaka.jp", "nose.osaka.jp", "osakasayama.osaka.jp", "sakai.osaka.jp", "sayama.osaka.jp", "sennan.osaka.jp", "settsu.osaka.jp", "shijonawate.osaka.jp", "shimamoto.osaka.jp", "suita.osaka.jp", "tadaoka.osaka.jp", "taishi.osaka.jp", "tajiri.osaka.jp", "takaishi.osaka.jp", "takatsuki.osaka.jp", "tondabayashi.osaka.jp", "toyonaka.osaka.jp", "toyono.osaka.jp", "yao.osaka.jp", "ariake.saga.jp", "arita.saga.jp", "fukudomi.saga.jp", "genkai.saga.jp", "hamatama.saga.jp", "hizen.saga.jp", "imari.saga.jp", "kamimine.saga.jp", "kanzaki.saga.jp", "karatsu.saga.jp", "kashima.saga.jp", "kitagata.saga.jp", "kitahata.saga.jp", "kiyama.saga.jp", "kouhoku.saga.jp", "kyuragi.saga.jp", "nishiarita.saga.jp", "ogi.saga.jp", "omachi.saga.jp", "ouchi.saga.jp", "saga.saga.jp", "shiroishi.saga.jp", "taku.saga.jp", "tara.saga.jp", "tosu.saga.jp", "yoshinogari.saga.jp", "arakawa.saitama.jp", "asaka.saitama.jp", "chichibu.saitama.jp", "fujimi.saitama.jp", "fujimino.saitama.jp", "fukaya.saitama.jp", "hanno.saitama.jp", "hanyu.saitama.jp", "hasuda.saitama.jp", "hatogaya.saitama.jp", "hatoyama.saitama.jp", "hidaka.saitama.jp", "higashichichibu.saitama.jp", "higashimatsuyama.saitama.jp", "honjo.saitama.jp", "ina.saitama.jp", "iruma.saitama.jp", "iwatsuki.saitama.jp", "kamiizumi.saitama.jp", "kamikawa.saitama.jp", "kamisato.saitama.jp", "kasukabe.saitama.jp", "kawagoe.saitama.jp", "kawaguchi.saitama.jp", "kawajima.saitama.jp", "kazo.saitama.jp", "kitamoto.saitama.jp", "koshigaya.saitama.jp", "kounosu.saitama.jp", "kuki.saitama.jp", "kumagaya.saitama.jp", "matsubushi.saitama.jp", "minano.saitama.jp", "misato.saitama.jp", "miyashiro.saitama.jp", "miyoshi.saitama.jp", "moroyama.saitama.jp", "nagatoro.saitama.jp", "namegawa.saitama.jp", "niiza.saitama.jp", "ogano.saitama.jp", "ogawa.saitama.jp", "ogose.saitama.jp", "okegawa.saitama.jp", "omiya.saitama.jp", "otaki.saitama.jp", "ranzan.saitama.jp", "ryokami.saitama.jp", "saitama.saitama.jp", "sakado.saitama.jp", "satte.saitama.jp", "sayama.saitama.jp", "shiki.saitama.jp", "shiraoka.saitama.jp", "soka.saitama.jp", "sugito.saitama.jp", "toda.saitama.jp", "tokigawa.saitama.jp", "tokorozawa.saitama.jp", "tsurugashima.saitama.jp", "urawa.saitama.jp", "warabi.saitama.jp", "yashio.saitama.jp", "yokoze.saitama.jp", "yono.saitama.jp", "yorii.saitama.jp", "yoshida.saitama.jp", "yoshikawa.saitama.jp", "yoshimi.saitama.jp", "aisho.shiga.jp", "gamo.shiga.jp", "higashiomi.shiga.jp", "hikone.shiga.jp", "koka.shiga.jp", "konan.shiga.jp", "kosei.shiga.jp", "koto.shiga.jp", "kusatsu.shiga.jp", "maibara.shiga.jp", "moriyama.shiga.jp", "nagahama.shiga.jp", "nishiazai.shiga.jp", "notogawa.shiga.jp", "omihachiman.shiga.jp", "otsu.shiga.jp", "ritto.shiga.jp", "ryuoh.shiga.jp", "takashima.shiga.jp", "takatsuki.shiga.jp", "torahime.shiga.jp", "toyosato.shiga.jp", "yasu.shiga.jp", "akagi.shimane.jp", "ama.shimane.jp", "gotsu.shimane.jp", "hamada.shimane.jp", "higashiizumo.shimane.jp", "hikawa.shimane.jp", "hikimi.shimane.jp", "izumo.shimane.jp", "kakinoki.shimane.jp", "masuda.shimane.jp", "matsue.shimane.jp", "misato.shimane.jp", "nishinoshima.shimane.jp", "ohda.shimane.jp", "okinoshima.shimane.jp", "okuizumo.shimane.jp", "shimane.shimane.jp", "tamayu.shimane.jp", "tsuwano.shimane.jp", "unnan.shimane.jp", "yakumo.shimane.jp", "yasugi.shimane.jp", "yatsuka.shimane.jp", "arai.shizuoka.jp", "atami.shizuoka.jp", "fuji.shizuoka.jp", "fujieda.shizuoka.jp", "fujikawa.shizuoka.jp", "fujinomiya.shizuoka.jp", "fukuroi.shizuoka.jp", "gotemba.shizuoka.jp", "haibara.shizuoka.jp", "hamamatsu.shizuoka.jp", "higashiizu.shizuoka.jp", "ito.shizuoka.jp", "iwata.shizuoka.jp", "izu.shizuoka.jp", "izunokuni.shizuoka.jp", "kakegawa.shizuoka.jp", "kannami.shizuoka.jp", "kawanehon.shizuoka.jp", "kawazu.shizuoka.jp", "kikugawa.shizuoka.jp", "kosai.shizuoka.jp", "makinohara.shizuoka.jp", "matsuzaki.shizuoka.jp", "minamiizu.shizuoka.jp", "mishima.shizuoka.jp", "morimachi.shizuoka.jp", "nishiizu.shizuoka.jp", "numazu.shizuoka.jp", "omaezaki.shizuoka.jp", "shimada.shizuoka.jp", "shimizu.shizuoka.jp", "shimoda.shizuoka.jp", "shizuoka.shizuoka.jp", "susono.shizuoka.jp", "yaizu.shizuoka.jp", "yoshida.shizuoka.jp", "ashikaga.tochigi.jp", "bato.tochigi.jp", "haga.tochigi.jp", "ichikai.tochigi.jp", "iwafune.tochigi.jp", "kaminokawa.tochigi.jp", "kanuma.tochigi.jp", "karasuyama.tochigi.jp", "kuroiso.tochigi.jp", "mashiko.tochigi.jp", "mibu.tochigi.jp", "moka.tochigi.jp", "motegi.tochigi.jp", "nasu.tochigi.jp", "nasushiobara.tochigi.jp", "nikko.tochigi.jp", "nishikata.tochigi.jp", "nogi.tochigi.jp", "ohira.tochigi.jp", "ohtawara.tochigi.jp", "oyama.tochigi.jp", "sakura.tochigi.jp", "sano.tochigi.jp", "shimotsuke.tochigi.jp", "shioya.tochigi.jp", "takanezawa.tochigi.jp", "tochigi.tochigi.jp", "tsuga.tochigi.jp", "ujiie.tochigi.jp", "utsunomiya.tochigi.jp", "yaita.tochigi.jp", "aizumi.tokushima.jp", "anan.tokushima.jp", "ichiba.tokushima.jp", "itano.tokushima.jp", "kainan.tokushima.jp", "komatsushima.tokushima.jp", "matsushige.tokushima.jp", "mima.tokushima.jp", "minami.tokushima.jp", "miyoshi.tokushima.jp", "mugi.tokushima.jp", "nakagawa.tokushima.jp", "naruto.tokushima.jp", "sanagochi.tokushima.jp", "shishikui.tokushima.jp", "tokushima.tokushima.jp", "wajiki.tokushima.jp", "adachi.tokyo.jp", "akiruno.tokyo.jp", "akishima.tokyo.jp", "aogashima.tokyo.jp", "arakawa.tokyo.jp", "bunkyo.tokyo.jp", "chiyoda.tokyo.jp", "chofu.tokyo.jp", "chuo.tokyo.jp", "edogawa.tokyo.jp", "fuchu.tokyo.jp", "fussa.tokyo.jp", "hachijo.tokyo.jp", "hachioji.tokyo.jp", "hamura.tokyo.jp", "higashikurume.tokyo.jp", "higashimurayama.tokyo.jp", "higashiyamato.tokyo.jp", "hino.tokyo.jp", "hinode.tokyo.jp", "hinohara.tokyo.jp", "inagi.tokyo.jp", "itabashi.tokyo.jp", "katsushika.tokyo.jp", "kita.tokyo.jp", "kiyose.tokyo.jp", "kodaira.tokyo.jp", "koganei.tokyo.jp", "kokubunji.tokyo.jp", "komae.tokyo.jp", "koto.tokyo.jp", "kouzushima.tokyo.jp", "kunitachi.tokyo.jp", "machida.tokyo.jp", "meguro.tokyo.jp", "minato.tokyo.jp", "mitaka.tokyo.jp", "mizuho.tokyo.jp", "musashimurayama.tokyo.jp", "musashino.tokyo.jp", "nakano.tokyo.jp", "nerima.tokyo.jp", "ogasawara.tokyo.jp", "okutama.tokyo.jp", "ome.tokyo.jp", "oshima.tokyo.jp", "ota.tokyo.jp", "setagaya.tokyo.jp", "shibuya.tokyo.jp", "shinagawa.tokyo.jp", "shinjuku.tokyo.jp", "suginami.tokyo.jp", "sumida.tokyo.jp", "tachikawa.tokyo.jp", "taito.tokyo.jp", "tama.tokyo.jp", "toshima.tokyo.jp", "chizu.tottori.jp", "hino.tottori.jp", "kawahara.tottori.jp", "koge.tottori.jp", "kotoura.tottori.jp", "misasa.tottori.jp", "nanbu.tottori.jp", "nichinan.tottori.jp", "sakaiminato.tottori.jp", "tottori.tottori.jp", "wakasa.tottori.jp", "yazu.tottori.jp", "yonago.tottori.jp", "asahi.toyama.jp", "fuchu.toyama.jp", "fukumitsu.toyama.jp", "funahashi.toyama.jp", "himi.toyama.jp", "imizu.toyama.jp", "inami.toyama.jp", "johana.toyama.jp", "kamiichi.toyama.jp", "kurobe.toyama.jp", "nakaniikawa.toyama.jp", "namerikawa.toyama.jp", "nanto.toyama.jp", "nyuzen.toyama.jp", "oyabe.toyama.jp", "taira.toyama.jp", "takaoka.toyama.jp", "tateyama.toyama.jp", "toga.toyama.jp", "tonami.toyama.jp", "toyama.toyama.jp", "unazuki.toyama.jp", "uozu.toyama.jp", "yamada.toyama.jp", "arida.wakayama.jp", "aridagawa.wakayama.jp", "gobo.wakayama.jp", "hashimoto.wakayama.jp", "hidaka.wakayama.jp", "hirogawa.wakayama.jp", "inami.wakayama.jp", "iwade.wakayama.jp", "kainan.wakayama.jp", "kamitonda.wakayama.jp", "katsuragi.wakayama.jp", "kimino.wakayama.jp", "kinokawa.wakayama.jp", "kitayama.wakayama.jp", "koya.wakayama.jp", "koza.wakayama.jp", "kozagawa.wakayama.jp", "kudoyama.wakayama.jp", "kushimoto.wakayama.jp", "mihama.wakayama.jp", "misato.wakayama.jp", "nachikatsuura.wakayama.jp", "shingu.wakayama.jp", "shirahama.wakayama.jp", "taiji.wakayama.jp", "tanabe.wakayama.jp", "wakayama.wakayama.jp", "yuasa.wakayama.jp", "yura.wakayama.jp", "asahi.yamagata.jp", "funagata.yamagata.jp", "higashine.yamagata.jp", "iide.yamagata.jp", "kahoku.yamagata.jp", "kaminoyama.yamagata.jp", "kaneyama.yamagata.jp", "kawanishi.yamagata.jp", "mamurogawa.yamagata.jp", "mikawa.yamagata.jp", "murayama.yamagata.jp", "nagai.yamagata.jp", "nakayama.yamagata.jp", "nanyo.yamagata.jp", "nishikawa.yamagata.jp", "obanazawa.yamagata.jp", "oe.yamagata.jp", "oguni.yamagata.jp", "ohkura.yamagata.jp", "oishida.yamagata.jp", "sagae.yamagata.jp", "sakata.yamagata.jp", "sakegawa.yamagata.jp", "shinjo.yamagata.jp", "shirataka.yamagata.jp", "shonai.yamagata.jp", "takahata.yamagata.jp", "tendo.yamagata.jp", "tozawa.yamagata.jp", "tsuruoka.yamagata.jp", "yamagata.yamagata.jp", "yamanobe.yamagata.jp", "yonezawa.yamagata.jp", "yuza.yamagata.jp", "abu.yamaguchi.jp", "hagi.yamaguchi.jp", "hikari.yamaguchi.jp", "hofu.yamaguchi.jp", "iwakuni.yamaguchi.jp", "kudamatsu.yamaguchi.jp", "mitou.yamaguchi.jp", "nagato.yamaguchi.jp", "oshima.yamaguchi.jp", "shimonoseki.yamaguchi.jp", "shunan.yamaguchi.jp", "tabuse.yamaguchi.jp", "tokuyama.yamaguchi.jp", "toyota.yamaguchi.jp", "ube.yamaguchi.jp", "yuu.yamaguchi.jp", "chuo.yamanashi.jp", "doshi.yamanashi.jp", "fuefuki.yamanashi.jp", "fujikawa.yamanashi.jp", "fujikawaguchiko.yamanashi.jp", "fujiyoshida.yamanashi.jp", "hayakawa.yamanashi.jp", "hokuto.yamanashi.jp", "ichikawamisato.yamanashi.jp", "kai.yamanashi.jp", "kofu.yamanashi.jp", "koshu.yamanashi.jp", "kosuge.yamanashi.jp", "minami-alps.yamanashi.jp", "minobu.yamanashi.jp", "nakamichi.yamanashi.jp", "nanbu.yamanashi.jp", "narusawa.yamanashi.jp", "nirasaki.yamanashi.jp", "nishikatsura.yamanashi.jp", "oshino.yamanashi.jp", "otsuki.yamanashi.jp", "showa.yamanashi.jp", "tabayama.yamanashi.jp", "tsuru.yamanashi.jp", "uenohara.yamanashi.jp", "yamanakako.yamanashi.jp", "yamanashi.yamanashi.jp", "ke", "ac.ke", "co.ke", "go.ke", "info.ke", "me.ke", "mobi.ke", "ne.ke", "or.ke", "sc.ke", "kg", "com.kg", "edu.kg", "gov.kg", "mil.kg", "net.kg", "org.kg", "*.kh", "ki", "biz.ki", "com.ki", "edu.ki", "gov.ki", "info.ki", "net.ki", "org.ki", "km", "ass.km", "com.km", "edu.km", "gov.km", "mil.km", "nom.km", "org.km", "prd.km", "tm.km", "asso.km", "coop.km", "gouv.km", "medecin.km", "notaires.km", "pharmaciens.km", "presse.km", "veterinaire.km", "kn", "edu.kn", "gov.kn", "net.kn", "org.kn", "kp", "com.kp", "edu.kp", "gov.kp", "org.kp", "rep.kp", "tra.kp", "kr", "ac.kr", "co.kr", "es.kr", "go.kr", "hs.kr", "kg.kr", "mil.kr", "ms.kr", "ne.kr", "or.kr", "pe.kr", "re.kr", "sc.kr", "busan.kr", "chungbuk.kr", "chungnam.kr", "daegu.kr", "daejeon.kr", "gangwon.kr", "gwangju.kr", "gyeongbuk.kr", "gyeonggi.kr", "gyeongnam.kr", "incheon.kr", "jeju.kr", "jeonbuk.kr", "jeonnam.kr", "seoul.kr", "ulsan.kr", "kw", "com.kw", "edu.kw", "emb.kw", "gov.kw", "ind.kw", "net.kw", "org.kw", "ky", "com.ky", "edu.ky", "net.ky", "org.ky", "kz", "com.kz", "edu.kz", "gov.kz", "mil.kz", "net.kz", "org.kz", "la", "com.la", "edu.la", "gov.la", "info.la", "int.la", "net.la", "org.la", "per.la", "lb", "com.lb", "edu.lb", "gov.lb", "net.lb", "org.lb", "lc", "co.lc", "com.lc", "edu.lc", "gov.lc", "net.lc", "org.lc", "li", "lk", "ac.lk", "assn.lk", "com.lk", "edu.lk", "gov.lk", "grp.lk", "hotel.lk", "int.lk", "ltd.lk", "net.lk", "ngo.lk", "org.lk", "sch.lk", "soc.lk", "web.lk", "lr", "com.lr", "edu.lr", "gov.lr", "net.lr", "org.lr", "ls", "ac.ls", "biz.ls", "co.ls", "edu.ls", "gov.ls", "info.ls", "net.ls", "org.ls", "sc.ls", "lt", "gov.lt", "lu", "lv", "asn.lv", "com.lv", "conf.lv", "edu.lv", "gov.lv", "id.lv", "mil.lv", "net.lv", "org.lv", "ly", "com.ly", "edu.ly", "gov.ly", "id.ly", "med.ly", "net.ly", "org.ly", "plc.ly", "sch.ly", "ma", "ac.ma", "co.ma", "gov.ma", "net.ma", "org.ma", "press.ma", "mc", "asso.mc", "tm.mc", "md", "me", "ac.me", "co.me", "edu.me", "gov.me", "its.me", "net.me", "org.me", "priv.me", "mg", "co.mg", "com.mg", "edu.mg", "gov.mg", "mil.mg", "nom.mg", "org.mg", "prd.mg", "mh", "mil", "mk", "com.mk", "edu.mk", "gov.mk", "inf.mk", "name.mk", "net.mk", "org.mk", "ml", "com.ml", "edu.ml", "gouv.ml", "gov.ml", "net.ml", "org.ml", "presse.ml", "*.mm", "mn", "edu.mn", "gov.mn", "org.mn", "mo", "com.mo", "edu.mo", "gov.mo", "net.mo", "org.mo", "mobi", "mp", "mq", "mr", "gov.mr", "ms", "com.ms", "edu.ms", "gov.ms", "net.ms", "org.ms", "mt", "com.mt", "edu.mt", "net.mt", "org.mt", "mu", "ac.mu", "co.mu", "com.mu", "gov.mu", "net.mu", "or.mu", "org.mu", "museum", "mv", "aero.mv", "biz.mv", "com.mv", "coop.mv", "edu.mv", "gov.mv", "info.mv", "int.mv", "mil.mv", "museum.mv", "name.mv", "net.mv", "org.mv", "pro.mv", "mw", "ac.mw", "biz.mw", "co.mw", "com.mw", "coop.mw", "edu.mw", "gov.mw", "int.mw", "net.mw", "org.mw", "mx", "com.mx", "edu.mx", "gob.mx", "net.mx", "org.mx", "my", "biz.my", "com.my", "edu.my", "gov.my", "mil.my", "name.my", "net.my", "org.my", "mz", "ac.mz", "adv.mz", "co.mz", "edu.mz", "gov.mz", "mil.mz", "net.mz", "org.mz", "na", "alt.na", "co.na", "com.na", "gov.na", "net.na", "org.na", "name", "nc", "asso.nc", "nom.nc", "ne", "net", "nf", "arts.nf", "com.nf", "firm.nf", "info.nf", "net.nf", "other.nf", "per.nf", "rec.nf", "store.nf", "web.nf", "ng", "com.ng", "edu.ng", "gov.ng", "i.ng", "mil.ng", "mobi.ng", "name.ng", "net.ng", "org.ng", "sch.ng", "ni", "ac.ni", "biz.ni", "co.ni", "com.ni", "edu.ni", "gob.ni", "in.ni", "info.ni", "int.ni", "mil.ni", "net.ni", "nom.ni", "org.ni", "web.ni", "nl", "no", "fhs.no", "folkebibl.no", "fylkesbibl.no", "idrett.no", "museum.no", "priv.no", "vgs.no", "dep.no", "herad.no", "kommune.no", "mil.no", "stat.no", "aa.no", "ah.no", "bu.no", "fm.no", "hl.no", "hm.no", "jan-mayen.no", "mr.no", "nl.no", "nt.no", "of.no", "ol.no", "oslo.no", "rl.no", "sf.no", "st.no", "svalbard.no", "tm.no", "tr.no", "va.no", "vf.no", "gs.aa.no", "gs.ah.no", "gs.bu.no", "gs.fm.no", "gs.hl.no", "gs.hm.no", "gs.jan-mayen.no", "gs.mr.no", "gs.nl.no", "gs.nt.no", "gs.of.no", "gs.ol.no", "gs.oslo.no", "gs.rl.no", "gs.sf.no", "gs.st.no", "gs.svalbard.no", "gs.tm.no", "gs.tr.no", "gs.va.no", "gs.vf.no", "akrehamn.no", "\xE5krehamn.no", "algard.no", "\xE5lg\xE5rd.no", "arna.no", "bronnoysund.no", "br\xF8nn\xF8ysund.no", "brumunddal.no", "bryne.no", "drobak.no", "dr\xF8bak.no", "egersund.no", "fetsund.no", "floro.no", "flor\xF8.no", "fredrikstad.no", "hokksund.no", "honefoss.no", "h\xF8nefoss.no", "jessheim.no", "jorpeland.no", "j\xF8rpeland.no", "kirkenes.no", "kopervik.no", "krokstadelva.no", "langevag.no", "langev\xE5g.no", "leirvik.no", "mjondalen.no", "mj\xF8ndalen.no", "mo-i-rana.no", "mosjoen.no", "mosj\xF8en.no", "nesoddtangen.no", "orkanger.no", "osoyro.no", "os\xF8yro.no", "raholt.no", "r\xE5holt.no", "sandnessjoen.no", "sandnessj\xF8en.no", "skedsmokorset.no", "slattum.no", "spjelkavik.no", "stathelle.no", "stavern.no", "stjordalshalsen.no", "stj\xF8rdalshalsen.no", "tananger.no", "tranby.no", "vossevangen.no", "aarborte.no", "aejrie.no", "afjord.no", "\xE5fjord.no", "agdenes.no", "nes.akershus.no", "aknoluokta.no", "\xE1k\u014Boluokta.no", "al.no", "\xE5l.no", "alaheadju.no", "\xE1laheadju.no", "alesund.no", "\xE5lesund.no", "alstahaug.no", "alta.no", "\xE1lt\xE1.no", "alvdal.no", "amli.no", "\xE5mli.no", "amot.no", "\xE5mot.no", "andasuolo.no", "andebu.no", "andoy.no", "and\xF8y.no", "ardal.no", "\xE5rdal.no", "aremark.no", "arendal.no", "\xE5s.no", "aseral.no", "\xE5seral.no", "asker.no", "askim.no", "askoy.no", "ask\xF8y.no", "askvoll.no", "asnes.no", "\xE5snes.no", "audnedaln.no", "aukra.no", "aure.no", "aurland.no", "aurskog-holand.no", "aurskog-h\xF8land.no", "austevoll.no", "austrheim.no", "averoy.no", "aver\xF8y.no", "badaddja.no", "b\xE5d\xE5ddj\xE5.no", "b\xE6rum.no", "bahcavuotna.no", "b\xE1hcavuotna.no", "bahccavuotna.no", "b\xE1hccavuotna.no", "baidar.no", "b\xE1id\xE1r.no", "bajddar.no", "b\xE1jddar.no", "balat.no", "b\xE1l\xE1t.no", "balestrand.no", "ballangen.no", "balsfjord.no", "bamble.no", "bardu.no", "barum.no", "batsfjord.no", "b\xE5tsfjord.no", "bearalvahki.no", "bearalv\xE1hki.no", "beardu.no", "beiarn.no", "berg.no", "bergen.no", "berlevag.no", "berlev\xE5g.no", "bievat.no", "biev\xE1t.no", "bindal.no", "birkenes.no", "bjarkoy.no", "bjark\xF8y.no", "bjerkreim.no", "bjugn.no", "bodo.no", "bod\xF8.no", "bokn.no", "bomlo.no", "b\xF8mlo.no", "bremanger.no", "bronnoy.no", "br\xF8nn\xF8y.no", "budejju.no", "nes.buskerud.no", "bygland.no", "bykle.no", "cahcesuolo.no", "\u010D\xE1hcesuolo.no", "davvenjarga.no", "davvenj\xE1rga.no", "davvesiida.no", "deatnu.no", "dielddanuorri.no", "divtasvuodna.no", "divttasvuotna.no", "donna.no", "d\xF8nna.no", "dovre.no", "drammen.no", "drangedal.no", "dyroy.no", "dyr\xF8y.no", "eid.no", "eidfjord.no", "eidsberg.no", "eidskog.no", "eidsvoll.no", "eigersund.no", "elverum.no", "enebakk.no", "engerdal.no", "etne.no", "etnedal.no", "evenassi.no", "even\xE1\u0161\u0161i.no", "evenes.no", "evje-og-hornnes.no", "farsund.no", "fauske.no", "fedje.no", "fet.no", "finnoy.no", "finn\xF8y.no", "fitjar.no", "fjaler.no", "fjell.no", "fla.no", "fl\xE5.no", "flakstad.no", "flatanger.no", "flekkefjord.no", "flesberg.no", "flora.no", "folldal.no", "forde.no", "f\xF8rde.no", "forsand.no", "fosnes.no", "fr\xE6na.no", "frana.no", "frei.no", "frogn.no", "froland.no", "frosta.no", "froya.no", "fr\xF8ya.no", "fuoisku.no", "fuossko.no", "fusa.no", "fyresdal.no", "gaivuotna.no", "g\xE1ivuotna.no", "galsa.no", "g\xE1ls\xE1.no", "gamvik.no", "gangaviika.no", "g\xE1\u014Bgaviika.no", "gaular.no", "gausdal.no", "giehtavuoatna.no", "gildeskal.no", "gildesk\xE5l.no", "giske.no", "gjemnes.no", "gjerdrum.no", "gjerstad.no", "gjesdal.no", "gjovik.no", "gj\xF8vik.no", "gloppen.no", "gol.no", "gran.no", "grane.no", "granvin.no", "gratangen.no", "grimstad.no", "grong.no", "grue.no", "gulen.no", "guovdageaidnu.no", "ha.no", "h\xE5.no", "habmer.no", "h\xE1bmer.no", "hadsel.no", "h\xE6gebostad.no", "hagebostad.no", "halden.no", "halsa.no", "hamar.no", "hamaroy.no", "hammarfeasta.no", "h\xE1mm\xE1rfeasta.no", "hammerfest.no", "hapmir.no", "h\xE1pmir.no", "haram.no", "hareid.no", "harstad.no", "hasvik.no", "hattfjelldal.no", "haugesund.no", "os.hedmark.no", "valer.hedmark.no", "v\xE5ler.hedmark.no", "hemne.no", "hemnes.no", "hemsedal.no", "hitra.no", "hjartdal.no", "hjelmeland.no", "hobol.no", "hob\xF8l.no", "hof.no", "hol.no", "hole.no", "holmestrand.no", "holtalen.no", "holt\xE5len.no", "os.hordaland.no", "hornindal.no", "horten.no", "hoyanger.no", "h\xF8yanger.no", "hoylandet.no", "h\xF8ylandet.no", "hurdal.no", "hurum.no", "hvaler.no", "hyllestad.no", "ibestad.no", "inderoy.no", "inder\xF8y.no", "iveland.no", "ivgu.no", "jevnaker.no", "jolster.no", "j\xF8lster.no", "jondal.no", "kafjord.no", "k\xE5fjord.no", "karasjohka.no", "k\xE1r\xE1\u0161johka.no", "karasjok.no", "karlsoy.no", "karmoy.no", "karm\xF8y.no", "kautokeino.no", "klabu.no", "kl\xE6bu.no", "klepp.no", "kongsberg.no", "kongsvinger.no", "kraanghke.no", "kr\xE5anghke.no", "kragero.no", "krager\xF8.no", "kristiansand.no", "kristiansund.no", "krodsherad.no", "kr\xF8dsherad.no", "kv\xE6fjord.no", "kv\xE6nangen.no", "kvafjord.no", "kvalsund.no", "kvam.no", "kvanangen.no", "kvinesdal.no", "kvinnherad.no", "kviteseid.no", "kvitsoy.no", "kvits\xF8y.no", "laakesvuemie.no", "l\xE6rdal.no", "lahppi.no", "l\xE1hppi.no", "lardal.no", "larvik.no", "lavagis.no", "lavangen.no", "leangaviika.no", "lea\u014Bgaviika.no", "lebesby.no", "leikanger.no", "leirfjord.no", "leka.no", "leksvik.no", "lenvik.no", "lerdal.no", "lesja.no", "levanger.no", "lier.no", "lierne.no", "lillehammer.no", "lillesand.no", "lindas.no", "lind\xE5s.no", "lindesnes.no", "loabat.no", "loab\xE1t.no", "lodingen.no", "l\xF8dingen.no", "lom.no", "loppa.no", "lorenskog.no", "l\xF8renskog.no", "loten.no", "l\xF8ten.no", "lund.no", "lunner.no", "luroy.no", "lur\xF8y.no", "luster.no", "lyngdal.no", "lyngen.no", "malatvuopmi.no", "m\xE1latvuopmi.no", "malselv.no", "m\xE5lselv.no", "malvik.no", "mandal.no", "marker.no", "marnardal.no", "masfjorden.no", "masoy.no", "m\xE5s\xF8y.no", "matta-varjjat.no", "m\xE1tta-v\xE1rjjat.no", "meland.no", "meldal.no", "melhus.no", "meloy.no", "mel\xF8y.no", "meraker.no", "mer\xE5ker.no", "midsund.no", "midtre-gauldal.no", "moareke.no", "mo\xE5reke.no", "modalen.no", "modum.no", "molde.no", "heroy.more-og-romsdal.no", "sande.more-og-romsdal.no", "her\xF8y.m\xF8re-og-romsdal.no", "sande.m\xF8re-og-romsdal.no", "moskenes.no", "moss.no", "mosvik.no", "muosat.no", "muos\xE1t.no", "naamesjevuemie.no", "n\xE5\xE5mesjevuemie.no", "n\xE6r\xF8y.no", "namdalseid.no", "namsos.no", "namsskogan.no", "nannestad.no", "naroy.no", "narviika.no", "narvik.no", "naustdal.no", "navuotna.no", "n\xE1vuotna.no", "nedre-eiker.no", "nesna.no", "nesodden.no", "nesseby.no", "nesset.no", "nissedal.no", "nittedal.no", "nord-aurdal.no", "nord-fron.no", "nord-odal.no", "norddal.no", "nordkapp.no", "bo.nordland.no", "b\xF8.nordland.no", "heroy.nordland.no", "her\xF8y.nordland.no", "nordre-land.no", "nordreisa.no", "nore-og-uvdal.no", "notodden.no", "notteroy.no", "n\xF8tter\xF8y.no", "odda.no", "oksnes.no", "\xF8ksnes.no", "omasvuotna.no", "oppdal.no", "oppegard.no", "oppeg\xE5rd.no", "orkdal.no", "orland.no", "\xF8rland.no", "orskog.no", "\xF8rskog.no", "orsta.no", "\xF8rsta.no", "osen.no", "osteroy.no", "oster\xF8y.no", "valer.ostfold.no", "v\xE5ler.\xF8stfold.no", "ostre-toten.no", "\xF8stre-toten.no", "overhalla.no", "ovre-eiker.no", "\xF8vre-eiker.no", "oyer.no", "\xF8yer.no", "oygarden.no", "\xF8ygarden.no", "oystre-slidre.no", "\xF8ystre-slidre.no", "porsanger.no", "porsangu.no", "pors\xE1\u014Bgu.no", "porsgrunn.no", "rade.no", "r\xE5de.no", "radoy.no", "rad\xF8y.no", "r\xE6lingen.no", "rahkkeravju.no", "r\xE1hkker\xE1vju.no", "raisa.no", "r\xE1isa.no", "rakkestad.no", "ralingen.no", "rana.no", "randaberg.no", "rauma.no", "rendalen.no", "rennebu.no", "rennesoy.no", "rennes\xF8y.no", "rindal.no", "ringebu.no", "ringerike.no", "ringsaker.no", "risor.no", "ris\xF8r.no", "rissa.no", "roan.no", "rodoy.no", "r\xF8d\xF8y.no", "rollag.no", "romsa.no", "romskog.no", "r\xF8mskog.no", "roros.no", "r\xF8ros.no", "rost.no", "r\xF8st.no", "royken.no", "r\xF8yken.no", "royrvik.no", "r\xF8yrvik.no", "ruovat.no", "rygge.no", "salangen.no", "salat.no", "s\xE1lat.no", "s\xE1l\xE1t.no", "saltdal.no", "samnanger.no", "sandefjord.no", "sandnes.no", "sandoy.no", "sand\xF8y.no", "sarpsborg.no", "sauda.no", "sauherad.no", "sel.no", "selbu.no", "selje.no", "seljord.no", "siellak.no", "sigdal.no", "siljan.no", "sirdal.no", "skanit.no", "sk\xE1nit.no", "skanland.no", "sk\xE5nland.no", "skaun.no", "skedsmo.no", "ski.no", "skien.no", "skierva.no", "skierv\xE1.no", "skiptvet.no", "skjak.no", "skj\xE5k.no", "skjervoy.no", "skjerv\xF8y.no", "skodje.no", "smola.no", "sm\xF8la.no", "snaase.no", "sn\xE5ase.no", "snasa.no", "sn\xE5sa.no", "snillfjord.no", "snoasa.no", "sogndal.no", "sogne.no", "s\xF8gne.no", "sokndal.no", "sola.no", "solund.no", "somna.no", "s\xF8mna.no", "sondre-land.no", "s\xF8ndre-land.no", "songdalen.no", "sor-aurdal.no", "s\xF8r-aurdal.no", "sor-fron.no", "s\xF8r-fron.no", "sor-odal.no", "s\xF8r-odal.no", "sor-varanger.no", "s\xF8r-varanger.no", "sorfold.no", "s\xF8rfold.no", "sorreisa.no", "s\xF8rreisa.no", "sortland.no", "sorum.no", "s\xF8rum.no", "spydeberg.no", "stange.no", "stavanger.no", "steigen.no", "steinkjer.no", "stjordal.no", "stj\xF8rdal.no", "stokke.no", "stor-elvdal.no", "stord.no", "stordal.no", "storfjord.no", "strand.no", "stranda.no", "stryn.no", "sula.no", "suldal.no", "sund.no", "sunndal.no", "surnadal.no", "sveio.no", "svelvik.no", "sykkylven.no", "tana.no", "bo.telemark.no", "b\xF8.telemark.no", "time.no", "tingvoll.no", "tinn.no", "tjeldsund.no", "tjome.no", "tj\xF8me.no", "tokke.no", "tolga.no", "tonsberg.no", "t\xF8nsberg.no", "torsken.no", "tr\xE6na.no", "trana.no", "tranoy.no", "tran\xF8y.no", "troandin.no", "trogstad.no", "tr\xF8gstad.no", "tromsa.no", "tromso.no", "troms\xF8.no", "trondheim.no", "trysil.no", "tvedestrand.no", "tydal.no", "tynset.no", "tysfjord.no", "tysnes.no", "tysv\xE6r.no", "tysvar.no", "ullensaker.no", "ullensvang.no", "ulvik.no", "unjarga.no", "unj\xE1rga.no", "utsira.no", "vaapste.no", "vadso.no", "vads\xF8.no", "v\xE6r\xF8y.no", "vaga.no", "v\xE5g\xE5.no", "vagan.no", "v\xE5gan.no", "vagsoy.no", "v\xE5gs\xF8y.no", "vaksdal.no", "valle.no", "vang.no", "vanylven.no", "vardo.no", "vard\xF8.no", "varggat.no", "v\xE1rgg\xE1t.no", "varoy.no", "vefsn.no", "vega.no", "vegarshei.no", "veg\xE5rshei.no", "vennesla.no", "verdal.no", "verran.no", "vestby.no", "sande.vestfold.no", "vestnes.no", "vestre-slidre.no", "vestre-toten.no", "vestvagoy.no", "vestv\xE5g\xF8y.no", "vevelstad.no", "vik.no", "vikna.no", "vindafjord.no", "voagat.no", "volda.no", "voss.no", "*.np", "nr", "biz.nr", "com.nr", "edu.nr", "gov.nr", "info.nr", "net.nr", "org.nr", "nu", "nz", "ac.nz", "co.nz", "cri.nz", "geek.nz", "gen.nz", "govt.nz", "health.nz", "iwi.nz", "kiwi.nz", "maori.nz", "m\u0101ori.nz", "mil.nz", "net.nz", "org.nz", "parliament.nz", "school.nz", "om", "co.om", "com.om", "edu.om", "gov.om", "med.om", "museum.om", "net.om", "org.om", "pro.om", "onion", "org", "pa", "abo.pa", "ac.pa", "com.pa", "edu.pa", "gob.pa", "ing.pa", "med.pa", "net.pa", "nom.pa", "org.pa", "sld.pa", "pe", "com.pe", "edu.pe", "gob.pe", "mil.pe", "net.pe", "nom.pe", "org.pe", "pf", "com.pf", "edu.pf", "org.pf", "*.pg", "ph", "com.ph", "edu.ph", "gov.ph", "i.ph", "mil.ph", "net.ph", "ngo.ph", "org.ph", "pk", "ac.pk", "biz.pk", "com.pk", "edu.pk", "fam.pk", "gkp.pk", "gob.pk", "gog.pk", "gok.pk", "gon.pk", "gop.pk", "gos.pk", "gov.pk", "net.pk", "org.pk", "web.pk", "pl", "com.pl", "net.pl", "org.pl", "agro.pl", "aid.pl", "atm.pl", "auto.pl", "biz.pl", "edu.pl", "gmina.pl", "gsm.pl", "info.pl", "mail.pl", "media.pl", "miasta.pl", "mil.pl", "nieruchomosci.pl", "nom.pl", "pc.pl", "powiat.pl", "priv.pl", "realestate.pl", "rel.pl", "sex.pl", "shop.pl", "sklep.pl", "sos.pl", "szkola.pl", "targi.pl", "tm.pl", "tourism.pl", "travel.pl", "turystyka.pl", "gov.pl", "ap.gov.pl", "griw.gov.pl", "ic.gov.pl", "is.gov.pl", "kmpsp.gov.pl", "konsulat.gov.pl", "kppsp.gov.pl", "kwp.gov.pl", "kwpsp.gov.pl", "mup.gov.pl", "mw.gov.pl", "oia.gov.pl", "oirm.gov.pl", "oke.gov.pl", "oow.gov.pl", "oschr.gov.pl", "oum.gov.pl", "pa.gov.pl", "pinb.gov.pl", "piw.gov.pl", "po.gov.pl", "pr.gov.pl", "psp.gov.pl", "psse.gov.pl", "pup.gov.pl", "rzgw.gov.pl", "sa.gov.pl", "sdn.gov.pl", "sko.gov.pl", "so.gov.pl", "sr.gov.pl", "starostwo.gov.pl", "ug.gov.pl", "ugim.gov.pl", "um.gov.pl", "umig.gov.pl", "upow.gov.pl", "uppo.gov.pl", "us.gov.pl", "uw.gov.pl", "uzs.gov.pl", "wif.gov.pl", "wiih.gov.pl", "winb.gov.pl", "wios.gov.pl", "witd.gov.pl", "wiw.gov.pl", "wkz.gov.pl", "wsa.gov.pl", "wskr.gov.pl", "wsse.gov.pl", "wuoz.gov.pl", "wzmiuw.gov.pl", "zp.gov.pl", "zpisdn.gov.pl", "augustow.pl", "babia-gora.pl", "bedzin.pl", "beskidy.pl", "bialowieza.pl", "bialystok.pl", "bielawa.pl", "bieszczady.pl", "boleslawiec.pl", "bydgoszcz.pl", "bytom.pl", "cieszyn.pl", "czeladz.pl", "czest.pl", "dlugoleka.pl", "elblag.pl", "elk.pl", "glogow.pl", "gniezno.pl", "gorlice.pl", "grajewo.pl", "ilawa.pl", "jaworzno.pl", "jelenia-gora.pl", "jgora.pl", "kalisz.pl", "karpacz.pl", "kartuzy.pl", "kaszuby.pl", "katowice.pl", "kazimierz-dolny.pl", "kepno.pl", "ketrzyn.pl", "klodzko.pl", "kobierzyce.pl", "kolobrzeg.pl", "konin.pl", "konskowola.pl", "kutno.pl", "lapy.pl", "lebork.pl", "legnica.pl", "lezajsk.pl", "limanowa.pl", "lomza.pl", "lowicz.pl", "lubin.pl", "lukow.pl", "malbork.pl", "malopolska.pl", "mazowsze.pl", "mazury.pl", "mielec.pl", "mielno.pl", "mragowo.pl", "naklo.pl", "nowaruda.pl", "nysa.pl", "olawa.pl", "olecko.pl", "olkusz.pl", "olsztyn.pl", "opoczno.pl", "opole.pl", "ostroda.pl", "ostroleka.pl", "ostrowiec.pl", "ostrowwlkp.pl", "pila.pl", "pisz.pl", "podhale.pl", "podlasie.pl", "polkowice.pl", "pomorskie.pl", "pomorze.pl", "prochowice.pl", "pruszkow.pl", "przeworsk.pl", "pulawy.pl", "radom.pl", "rawa-maz.pl", "rybnik.pl", "rzeszow.pl", "sanok.pl", "sejny.pl", "skoczow.pl", "slask.pl", "slupsk.pl", "sosnowiec.pl", "stalowa-wola.pl", "starachowice.pl", "stargard.pl", "suwalki.pl", "swidnica.pl", "swiebodzin.pl", "swinoujscie.pl", "szczecin.pl", "szczytno.pl", "tarnobrzeg.pl", "tgory.pl", "turek.pl", "tychy.pl", "ustka.pl", "walbrzych.pl", "warmia.pl", "warszawa.pl", "waw.pl", "wegrow.pl", "wielun.pl", "wlocl.pl", "wloclawek.pl", "wodzislaw.pl", "wolomin.pl", "wroclaw.pl", "zachpomor.pl", "zagan.pl", "zarow.pl", "zgora.pl", "zgorzelec.pl", "pm", "pn", "co.pn", "edu.pn", "gov.pn", "net.pn", "org.pn", "post", "pr", "biz.pr", "com.pr", "edu.pr", "gov.pr", "info.pr", "isla.pr", "name.pr", "net.pr", "org.pr", "pro.pr", "ac.pr", "est.pr", "prof.pr", "pro", "aaa.pro", "aca.pro", "acct.pro", "avocat.pro", "bar.pro", "cpa.pro", "eng.pro", "jur.pro", "law.pro", "med.pro", "recht.pro", "ps", "com.ps", "edu.ps", "gov.ps", "net.ps", "org.ps", "plo.ps", "sec.ps", "pt", "com.pt", "edu.pt", "gov.pt", "int.pt", "net.pt", "nome.pt", "org.pt", "publ.pt", "pw", "belau.pw", "co.pw", "ed.pw", "go.pw", "or.pw", "py", "com.py", "coop.py", "edu.py", "gov.py", "mil.py", "net.py", "org.py", "qa", "com.qa", "edu.qa", "gov.qa", "mil.qa", "name.qa", "net.qa", "org.qa", "sch.qa", "re", "asso.re", "com.re", "ro", "arts.ro", "com.ro", "firm.ro", "info.ro", "nom.ro", "nt.ro", "org.ro", "rec.ro", "store.ro", "tm.ro", "www.ro", "rs", "ac.rs", "co.rs", "edu.rs", "gov.rs", "in.rs", "org.rs", "ru", "rw", "ac.rw", "co.rw", "coop.rw", "gov.rw", "mil.rw", "net.rw", "org.rw", "sa", "com.sa", "edu.sa", "gov.sa", "med.sa", "net.sa", "org.sa", "pub.sa", "sch.sa", "sb", "com.sb", "edu.sb", "gov.sb", "net.sb", "org.sb", "sc", "com.sc", "edu.sc", "gov.sc", "net.sc", "org.sc", "sd", "com.sd", "edu.sd", "gov.sd", "info.sd", "med.sd", "net.sd", "org.sd", "tv.sd", "se", "a.se", "ac.se", "b.se", "bd.se", "brand.se", "c.se", "d.se", "e.se", "f.se", "fh.se", "fhsk.se", "fhv.se", "g.se", "h.se", "i.se", "k.se", "komforb.se", "kommunalforbund.se", "komvux.se", "l.se", "lanbib.se", "m.se", "n.se", "naturbruksgymn.se", "o.se", "org.se", "p.se", "parti.se", "pp.se", "press.se", "r.se", "s.se", "t.se", "tm.se", "u.se", "w.se", "x.se", "y.se", "z.se", "sg", "com.sg", "edu.sg", "gov.sg", "net.sg", "org.sg", "sh", "com.sh", "gov.sh", "mil.sh", "net.sh", "org.sh", "si", "sj", "sk", "sl", "com.sl", "edu.sl", "gov.sl", "net.sl", "org.sl", "sm", "sn", "art.sn", "com.sn", "edu.sn", "gouv.sn", "org.sn", "perso.sn", "univ.sn", "so", "com.so", "edu.so", "gov.so", "me.so", "net.so", "org.so", "sr", "ss", "biz.ss", "co.ss", "com.ss", "edu.ss", "gov.ss", "me.ss", "net.ss", "org.ss", "sch.ss", "st", "co.st", "com.st", "consulado.st", "edu.st", "embaixada.st", "mil.st", "net.st", "org.st", "principe.st", "saotome.st", "store.st", "su", "sv", "com.sv", "edu.sv", "gob.sv", "org.sv", "red.sv", "sx", "gov.sx", "sy", "com.sy", "edu.sy", "gov.sy", "mil.sy", "net.sy", "org.sy", "sz", "ac.sz", "co.sz", "org.sz", "tc", "td", "tel", "tf", "tg", "th", "ac.th", "co.th", "go.th", "in.th", "mi.th", "net.th", "or.th", "tj", "ac.tj", "biz.tj", "co.tj", "com.tj", "edu.tj", "go.tj", "gov.tj", "int.tj", "mil.tj", "name.tj", "net.tj", "nic.tj", "org.tj", "test.tj", "web.tj", "tk", "tl", "gov.tl", "tm", "co.tm", "com.tm", "edu.tm", "gov.tm", "mil.tm", "net.tm", "nom.tm", "org.tm", "tn", "com.tn", "ens.tn", "fin.tn", "gov.tn", "ind.tn", "info.tn", "intl.tn", "mincom.tn", "nat.tn", "net.tn", "org.tn", "perso.tn", "tourism.tn", "to", "com.to", "edu.to", "gov.to", "mil.to", "net.to", "org.to", "tr", "av.tr", "bbs.tr", "bel.tr", "biz.tr", "com.tr", "dr.tr", "edu.tr", "gen.tr", "gov.tr", "info.tr", "k12.tr", "kep.tr", "mil.tr", "name.tr", "net.tr", "org.tr", "pol.tr", "tel.tr", "tsk.tr", "tv.tr", "web.tr", "nc.tr", "gov.nc.tr", "tt", "biz.tt", "co.tt", "com.tt", "edu.tt", "gov.tt", "info.tt", "mil.tt", "name.tt", "net.tt", "org.tt", "pro.tt", "tv", "tw", "club.tw", "com.tw", "ebiz.tw", "edu.tw", "game.tw", "gov.tw", "idv.tw", "mil.tw", "net.tw", "org.tw", "tz", "ac.tz", "co.tz", "go.tz", "hotel.tz", "info.tz", "me.tz", "mil.tz", "mobi.tz", "ne.tz", "or.tz", "sc.tz", "tv.tz", "ua", "com.ua", "edu.ua", "gov.ua", "in.ua", "net.ua", "org.ua", "cherkassy.ua", "cherkasy.ua", "chernigov.ua", "chernihiv.ua", "chernivtsi.ua", "chernovtsy.ua", "ck.ua", "cn.ua", "cr.ua", "crimea.ua", "cv.ua", "dn.ua", "dnepropetrovsk.ua", "dnipropetrovsk.ua", "donetsk.ua", "dp.ua", "if.ua", "ivano-frankivsk.ua", "kh.ua", "kharkiv.ua", "kharkov.ua", "kherson.ua", "khmelnitskiy.ua", "khmelnytskyi.ua", "kiev.ua", "kirovograd.ua", "km.ua", "kr.ua", "kropyvnytskyi.ua", "krym.ua", "ks.ua", "kv.ua", "kyiv.ua", "lg.ua", "lt.ua", "lugansk.ua", "luhansk.ua", "lutsk.ua", "lv.ua", "lviv.ua", "mk.ua", "mykolaiv.ua", "nikolaev.ua", "od.ua", "odesa.ua", "odessa.ua", "pl.ua", "poltava.ua", "rivne.ua", "rovno.ua", "rv.ua", "sb.ua", "sebastopol.ua", "sevastopol.ua", "sm.ua", "sumy.ua", "te.ua", "ternopil.ua", "uz.ua", "uzhgorod.ua", "uzhhorod.ua", "vinnica.ua", "vinnytsia.ua", "vn.ua", "volyn.ua", "yalta.ua", "zakarpattia.ua", "zaporizhzhe.ua", "zaporizhzhia.ua", "zhitomir.ua", "zhytomyr.ua", "zp.ua", "zt.ua", "ug", "ac.ug", "co.ug", "com.ug", "go.ug", "ne.ug", "or.ug", "org.ug", "sc.ug", "uk", "ac.uk", "co.uk", "gov.uk", "ltd.uk", "me.uk", "net.uk", "nhs.uk", "org.uk", "plc.uk", "police.uk", "*.sch.uk", "us", "dni.us", "fed.us", "isa.us", "kids.us", "nsn.us", "ak.us", "al.us", "ar.us", "as.us", "az.us", "ca.us", "co.us", "ct.us", "dc.us", "de.us", "fl.us", "ga.us", "gu.us", "hi.us", "ia.us", "id.us", "il.us", "in.us", "ks.us", "ky.us", "la.us", "ma.us", "md.us", "me.us", "mi.us", "mn.us", "mo.us", "ms.us", "mt.us", "nc.us", "nd.us", "ne.us", "nh.us", "nj.us", "nm.us", "nv.us", "ny.us", "oh.us", "ok.us", "or.us", "pa.us", "pr.us", "ri.us", "sc.us", "sd.us", "tn.us", "tx.us", "ut.us", "va.us", "vi.us", "vt.us", "wa.us", "wi.us", "wv.us", "wy.us", "k12.ak.us", "k12.al.us", "k12.ar.us", "k12.as.us", "k12.az.us", "k12.ca.us", "k12.co.us", "k12.ct.us", "k12.dc.us", "k12.fl.us", "k12.ga.us", "k12.gu.us", "k12.ia.us", "k12.id.us", "k12.il.us", "k12.in.us", "k12.ks.us", "k12.ky.us", "k12.la.us", "k12.ma.us", "k12.md.us", "k12.me.us", "k12.mi.us", "k12.mn.us", "k12.mo.us", "k12.ms.us", "k12.mt.us", "k12.nc.us", "k12.ne.us", "k12.nh.us", "k12.nj.us", "k12.nm.us", "k12.nv.us", "k12.ny.us", "k12.oh.us", "k12.ok.us", "k12.or.us", "k12.pa.us", "k12.pr.us", "k12.sc.us", "k12.tn.us", "k12.tx.us", "k12.ut.us", "k12.va.us", "k12.vi.us", "k12.vt.us", "k12.wa.us", "k12.wi.us", "cc.ak.us", "lib.ak.us", "cc.al.us", "lib.al.us", "cc.ar.us", "lib.ar.us", "cc.as.us", "lib.as.us", "cc.az.us", "lib.az.us", "cc.ca.us", "lib.ca.us", "cc.co.us", "lib.co.us", "cc.ct.us", "lib.ct.us", "cc.dc.us", "lib.dc.us", "cc.de.us", "cc.fl.us", "cc.ga.us", "cc.gu.us", "cc.hi.us", "cc.ia.us", "cc.id.us", "cc.il.us", "cc.in.us", "cc.ks.us", "cc.ky.us", "cc.la.us", "cc.ma.us", "cc.md.us", "cc.me.us", "cc.mi.us", "cc.mn.us", "cc.mo.us", "cc.ms.us", "cc.mt.us", "cc.nc.us", "cc.nd.us", "cc.ne.us", "cc.nh.us", "cc.nj.us", "cc.nm.us", "cc.nv.us", "cc.ny.us", "cc.oh.us", "cc.ok.us", "cc.or.us", "cc.pa.us", "cc.pr.us", "cc.ri.us", "cc.sc.us", "cc.sd.us", "cc.tn.us", "cc.tx.us", "cc.ut.us", "cc.va.us", "cc.vi.us", "cc.vt.us", "cc.wa.us", "cc.wi.us", "cc.wv.us", "cc.wy.us", "k12.wy.us", "lib.fl.us", "lib.ga.us", "lib.gu.us", "lib.hi.us", "lib.ia.us", "lib.id.us", "lib.il.us", "lib.in.us", "lib.ks.us", "lib.ky.us", "lib.la.us", "lib.ma.us", "lib.md.us", "lib.me.us", "lib.mi.us", "lib.mn.us", "lib.mo.us", "lib.ms.us", "lib.mt.us", "lib.nc.us", "lib.nd.us", "lib.ne.us", "lib.nh.us", "lib.nj.us", "lib.nm.us", "lib.nv.us", "lib.ny.us", "lib.oh.us", "lib.ok.us", "lib.or.us", "lib.pa.us", "lib.pr.us", "lib.ri.us", "lib.sc.us", "lib.sd.us", "lib.tn.us", "lib.tx.us", "lib.ut.us", "lib.va.us", "lib.vi.us", "lib.vt.us", "lib.wa.us", "lib.wi.us", "lib.wy.us", "chtr.k12.ma.us", "paroch.k12.ma.us", "pvt.k12.ma.us", "ann-arbor.mi.us", "cog.mi.us", "dst.mi.us", "eaton.mi.us", "gen.mi.us", "mus.mi.us", "tec.mi.us", "washtenaw.mi.us", "uy", "com.uy", "edu.uy", "gub.uy", "mil.uy", "net.uy", "org.uy", "uz", "co.uz", "com.uz", "net.uz", "org.uz", "va", "vc", "com.vc", "edu.vc", "gov.vc", "mil.vc", "net.vc", "org.vc", "ve", "arts.ve", "bib.ve", "co.ve", "com.ve", "e12.ve", "edu.ve", "firm.ve", "gob.ve", "gov.ve", "info.ve", "int.ve", "mil.ve", "net.ve", "nom.ve", "org.ve", "rar.ve", "rec.ve", "store.ve", "tec.ve", "web.ve", "vg", "vi", "co.vi", "com.vi", "k12.vi", "net.vi", "org.vi", "vn", "ac.vn", "ai.vn", "biz.vn", "com.vn", "edu.vn", "gov.vn", "health.vn", "id.vn", "info.vn", "int.vn", "io.vn", "name.vn", "net.vn", "org.vn", "pro.vn", "angiang.vn", "bacgiang.vn", "backan.vn", "baclieu.vn", "bacninh.vn", "baria-vungtau.vn", "bentre.vn", "binhdinh.vn", "binhduong.vn", "binhphuoc.vn", "binhthuan.vn", "camau.vn", "cantho.vn", "caobang.vn", "daklak.vn", "daknong.vn", "danang.vn", "dienbien.vn", "dongnai.vn", "dongthap.vn", "gialai.vn", "hagiang.vn", "haiduong.vn", "haiphong.vn", "hanam.vn", "hanoi.vn", "hatinh.vn", "haugiang.vn", "hoabinh.vn", "hungyen.vn", "khanhhoa.vn", "kiengiang.vn", "kontum.vn", "laichau.vn", "lamdong.vn", "langson.vn", "laocai.vn", "longan.vn", "namdinh.vn", "nghean.vn", "ninhbinh.vn", "ninhthuan.vn", "phutho.vn", "phuyen.vn", "quangbinh.vn", "quangnam.vn", "quangngai.vn", "quangninh.vn", "quangtri.vn", "soctrang.vn", "sonla.vn", "tayninh.vn", "thaibinh.vn", "thainguyen.vn", "thanhhoa.vn", "thanhphohochiminh.vn", "thuathienhue.vn", "tiengiang.vn", "travinh.vn", "tuyenquang.vn", "vinhlong.vn", "vinhphuc.vn", "yenbai.vn", "vu", "com.vu", "edu.vu", "net.vu", "org.vu", "wf", "ws", "com.ws", "edu.ws", "gov.ws", "net.ws", "org.ws", "yt", "\u0627\u0645\u0627\u0631\u0627\u062A", "\u0570\u0561\u0575", "\u09AC\u09BE\u0982\u09B2\u09BE", "\u0431\u0433", "\u0627\u0644\u0628\u062D\u0631\u064A\u0646", "\u0431\u0435\u043B", "\u4E2D\u56FD", "\u4E2D\u570B", "\u0627\u0644\u062C\u0632\u0627\u0626\u0631", "\u0645\u0635\u0631", "\u0435\u044E", "\u03B5\u03C5", "\u0645\u0648\u0631\u064A\u062A\u0627\u0646\u064A\u0627", "\u10D2\u10D4", "\u03B5\u03BB", "\u9999\u6E2F", "\u500B\u4EBA.\u9999\u6E2F", "\u516C\u53F8.\u9999\u6E2F", "\u653F\u5E9C.\u9999\u6E2F", "\u6559\u80B2.\u9999\u6E2F", "\u7D44\u7E54.\u9999\u6E2F", "\u7DB2\u7D61.\u9999\u6E2F", "\u0CAD\u0CBE\u0CB0\u0CA4", "\u0B2D\u0B3E\u0B30\u0B24", "\u09AD\u09BE\u09F0\u09A4", "\u092D\u093E\u0930\u0924\u092E\u094D", "\u092D\u093E\u0930\u094B\u0924", "\u0680\u0627\u0631\u062A", "\u0D2D\u0D3E\u0D30\u0D24\u0D02", "\u092D\u093E\u0930\u0924", "\u0628\u0627\u0631\u062A", "\u0628\u06BE\u0627\u0631\u062A", "\u0C2D\u0C3E\u0C30\u0C24\u0C4D", "\u0AAD\u0ABE\u0AB0\u0AA4", "\u0A2D\u0A3E\u0A30\u0A24", "\u09AD\u09BE\u09B0\u09A4", "\u0B87\u0BA8\u0BCD\u0BA4\u0BBF\u0BAF\u0BBE", "\u0627\u06CC\u0631\u0627\u0646", "\u0627\u064A\u0631\u0627\u0646", "\u0639\u0631\u0627\u0642", "\u0627\u0644\u0627\u0631\u062F\u0646", "\uD55C\uAD6D", "\u049B\u0430\u0437", "\u0EA5\u0EB2\u0EA7", "\u0DBD\u0D82\u0D9A\u0DCF", "\u0B87\u0BB2\u0B99\u0BCD\u0B95\u0BC8", "\u0627\u0644\u0645\u063A\u0631\u0628", "\u043C\u043A\u0434", "\u043C\u043E\u043D", "\u6FB3\u9580", "\u6FB3\u95E8", "\u0645\u0644\u064A\u0633\u064A\u0627", "\u0639\u0645\u0627\u0646", "\u067E\u0627\u06A9\u0633\u062A\u0627\u0646", "\u067E\u0627\u0643\u0633\u062A\u0627\u0646", "\u0641\u0644\u0633\u0637\u064A\u0646", "\u0441\u0440\u0431", "\u0430\u043A.\u0441\u0440\u0431", "\u043E\u0431\u0440.\u0441\u0440\u0431", "\u043E\u0434.\u0441\u0440\u0431", "\u043E\u0440\u0433.\u0441\u0440\u0431", "\u043F\u0440.\u0441\u0440\u0431", "\u0443\u043F\u0440.\u0441\u0440\u0431", "\u0440\u0444", "\u0642\u0637\u0631", "\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629", "\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u0629", "\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u06C3", "\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0647", "\u0633\u0648\u062F\u0627\u0646", "\u65B0\u52A0\u5761", "\u0B9A\u0BBF\u0B99\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0BC2\u0BB0\u0BCD", "\u0633\u0648\u0631\u064A\u0629", "\u0633\u0648\u0631\u064A\u0627", "\u0E44\u0E17\u0E22", "\u0E17\u0E2B\u0E32\u0E23.\u0E44\u0E17\u0E22", "\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08.\u0E44\u0E17\u0E22", "\u0E40\u0E19\u0E47\u0E15.\u0E44\u0E17\u0E22", "\u0E23\u0E31\u0E10\u0E1A\u0E32\u0E25.\u0E44\u0E17\u0E22", "\u0E28\u0E36\u0E01\u0E29\u0E32.\u0E44\u0E17\u0E22", "\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E23.\u0E44\u0E17\u0E22", "\u062A\u0648\u0646\u0633", "\u53F0\u7063", "\u53F0\u6E7E", "\u81FA\u7063", "\u0443\u043A\u0440", "\u0627\u0644\u064A\u0645\u0646", "xxx", "ye", "com.ye", "edu.ye", "gov.ye", "mil.ye", "net.ye", "org.ye", "ac.za", "agric.za", "alt.za", "co.za", "edu.za", "gov.za", "grondar.za", "law.za", "mil.za", "net.za", "ngo.za", "nic.za", "nis.za", "nom.za", "org.za", "school.za", "tm.za", "web.za", "zm", "ac.zm", "biz.zm", "co.zm", "com.zm", "edu.zm", "gov.zm", "info.zm", "mil.zm", "net.zm", "org.zm", "sch.zm", "zw", "ac.zw", "co.zw", "gov.zw", "mil.zw", "org.zw", "aaa", "aarp", "abb", "abbott", "abbvie", "abc", "able", "abogado", "abudhabi", "academy", "accenture", "accountant", "accountants", "aco", "actor", "ads", "adult", "aeg", "aetna", "afl", "africa", "agakhan", "agency", "aig", "airbus", "airforce", "airtel", "akdn", "alibaba", "alipay", "allfinanz", "allstate", "ally", "alsace", "alstom", "amazon", "americanexpress", "americanfamily", "amex", "amfam", "amica", "amsterdam", "analytics", "android", "anquan", "anz", "aol", "apartments", "app", "apple", "aquarelle", "arab", "aramco", "archi", "army", "art", "arte", "asda", "associates", "athleta", "attorney", "auction", "audi", "audible", "audio", "auspost", "author", "auto", "autos", "aws", "axa", "azure", "baby", "baidu", "banamex", "band", "bank", "bar", "barcelona", "barclaycard", "barclays", "barefoot", "bargains", "baseball", "basketball", "bauhaus", "bayern", "bbc", "bbt", "bbva", "bcg", "bcn", "beats", "beauty", "beer", "bentley", "berlin", "best", "bestbuy", "bet", "bharti", "bible", "bid", "bike", "bing", "bingo", "bio", "black", "blackfriday", "blockbuster", "blog", "bloomberg", "blue", "bms", "bmw", "bnpparibas", "boats", "boehringer", "bofa", "bom", "bond", "boo", "book", "booking", "bosch", "bostik", "boston", "bot", "boutique", "box", "bradesco", "bridgestone", "broadway", "broker", "brother", "brussels", "build", "builders", "business", "buy", "buzz", "bzh", "cab", "cafe", "cal", "call", "calvinklein", "cam", "camera", "camp", "canon", "capetown", "capital", "capitalone", "car", "caravan", "cards", "care", "career", "careers", "cars", "casa", "case", "cash", "casino", "catering", "catholic", "cba", "cbn", "cbre", "center", "ceo", "cern", "cfa", "cfd", "chanel", "channel", "charity", "chase", "chat", "cheap", "chintai", "christmas", "chrome", "church", "cipriani", "circle", "cisco", "citadel", "citi", "citic", "city", "claims", "cleaning", "click", "clinic", "clinique", "clothing", "cloud", "club", "clubmed", "coach", "codes", "coffee", "college", "cologne", "commbank", "community", "company", "compare", "computer", "comsec", "condos", "construction", "consulting", "contact", "contractors", "cooking", "cool", "corsica", "country", "coupon", "coupons", "courses", "cpa", "credit", "creditcard", "creditunion", "cricket", "crown", "crs", "cruise", "cruises", "cuisinella", "cymru", "cyou", "dad", "dance", "data", "date", "dating", "datsun", "day", "dclk", "dds", "deal", "dealer", "deals", "degree", "delivery", "dell", "deloitte", "delta", "democrat", "dental", "dentist", "desi", "design", "dev", "dhl", "diamonds", "diet", "digital", "direct", "directory", "discount", "discover", "dish", "diy", "dnp", "docs", "doctor", "dog", "domains", "dot", "download", "drive", "dtv", "dubai", "dunlop", "dupont", "durban", "dvag", "dvr", "earth", "eat", "eco", "edeka", "education", "email", "emerck", "energy", "engineer", "engineering", "enterprises", "epson", "equipment", "ericsson", "erni", "esq", "estate", "eurovision", "eus", "events", "exchange", "expert", "exposed", "express", "extraspace", "fage", "fail", "fairwinds", "faith", "family", "fan", "fans", "farm", "farmers", "fashion", "fast", "fedex", "feedback", "ferrari", "ferrero", "fidelity", "fido", "film", "final", "finance", "financial", "fire", "firestone", "firmdale", "fish", "fishing", "fit", "fitness", "flickr", "flights", "flir", "florist", "flowers", "fly", "foo", "food", "football", "ford", "forex", "forsale", "forum", "foundation", "fox", "free", "fresenius", "frl", "frogans", "frontier", "ftr", "fujitsu", "fun", "fund", "furniture", "futbol", "fyi", "gal", "gallery", "gallo", "gallup", "game", "games", "gap", "garden", "gay", "gbiz", "gdn", "gea", "gent", "genting", "george", "ggee", "gift", "gifts", "gives", "giving", "glass", "gle", "global", "globo", "gmail", "gmbh", "gmo", "gmx", "godaddy", "gold", "goldpoint", "golf", "goo", "goodyear", "goog", "google", "gop", "got", "grainger", "graphics", "gratis", "green", "gripe", "grocery", "group", "gucci", "guge", "guide", "guitars", "guru", "hair", "hamburg", "hangout", "haus", "hbo", "hdfc", "hdfcbank", "health", "healthcare", "help", "helsinki", "here", "hermes", "hiphop", "hisamitsu", "hitachi", "hiv", "hkt", "hockey", "holdings", "holiday", "homedepot", "homegoods", "homes", "homesense", "honda", "horse", "hospital", "host", "hosting", "hot", "hotels", "hotmail", "house", "how", "hsbc", "hughes", "hyatt", "hyundai", "ibm", "icbc", "ice", "icu", "ieee", "ifm", "ikano", "imamat", "imdb", "immo", "immobilien", "inc", "industries", "infiniti", "ing", "ink", "institute", "insurance", "insure", "international", "intuit", "investments", "ipiranga", "irish", "ismaili", "ist", "istanbul", "itau", "itv", "jaguar", "java", "jcb", "jeep", "jetzt", "jewelry", "jio", "jll", "jmp", "jnj", "joburg", "jot", "joy", "jpmorgan", "jprs", "juegos", "juniper", "kaufen", "kddi", "kerryhotels", "kerrylogistics", "kerryproperties", "kfh", "kia", "kids", "kim", "kindle", "kitchen", "kiwi", "koeln", "komatsu", "kosher", "kpmg", "kpn", "krd", "kred", "kuokgroup", "kyoto", "lacaixa", "lamborghini", "lamer", "lancaster", "land", "landrover", "lanxess", "lasalle", "lat", "latino", "latrobe", "law", "lawyer", "lds", "lease", "leclerc", "lefrak", "legal", "lego", "lexus", "lgbt", "lidl", "life", "lifeinsurance", "lifestyle", "lighting", "like", "lilly", "limited", "limo", "lincoln", "link", "lipsy", "live", "living", "llc", "llp", "loan", "loans", "locker", "locus", "lol", "london", "lotte", "lotto", "love", "lpl", "lplfinancial", "ltd", "ltda", "lundbeck", "luxe", "luxury", "madrid", "maif", "maison", "makeup", "man", "management", "mango", "map", "market", "marketing", "markets", "marriott", "marshalls", "mattel", "mba", "mckinsey", "med", "media", "meet", "melbourne", "meme", "memorial", "men", "menu", "merck", "merckmsd", "miami", "microsoft", "mini", "mint", "mit", "mitsubishi", "mlb", "mls", "mma", "mobile", "moda", "moe", "moi", "mom", "monash", "money", "monster", "mormon", "mortgage", "moscow", "moto", "motorcycles", "mov", "movie", "msd", "mtn", "mtr", "music", "nab", "nagoya", "navy", "nba", "nec", "netbank", "netflix", "network", "neustar", "new", "news", "next", "nextdirect", "nexus", "nfl", "ngo", "nhk", "nico", "nike", "nikon", "ninja", "nissan", "nissay", "nokia", "norton", "now", "nowruz", "nowtv", "nra", "nrw", "ntt", "nyc", "obi", "observer", "office", "okinawa", "olayan", "olayangroup", "ollo", "omega", "one", "ong", "onl", "online", "ooo", "open", "oracle", "orange", "organic", "origins", "osaka", "otsuka", "ott", "ovh", "page", "panasonic", "paris", "pars", "partners", "parts", "party", "pay", "pccw", "pet", "pfizer", "pharmacy", "phd", "philips", "phone", "photo", "photography", "photos", "physio", "pics", "pictet", "pictures", "pid", "pin", "ping", "pink", "pioneer", "pizza", "place", "play", "playstation", "plumbing", "plus", "pnc", "pohl", "poker", "politie", "porn", "pramerica", "praxi", "press", "prime", "prod", "productions", "prof", "progressive", "promo", "properties", "property", "protection", "pru", "prudential", "pub", "pwc", "qpon", "quebec", "quest", "racing", "radio", "read", "realestate", "realtor", "realty", "recipes", "red", "redstone", "redumbrella", "rehab", "reise", "reisen", "reit", "reliance", "ren", "rent", "rentals", "repair", "report", "republican", "rest", "restaurant", "review", "reviews", "rexroth", "rich", "richardli", "ricoh", "ril", "rio", "rip", "rocks", "rodeo", "rogers", "room", "rsvp", "rugby", "ruhr", "run", "rwe", "ryukyu", "saarland", "safe", "safety", "sakura", "sale", "salon", "samsclub", "samsung", "sandvik", "sandvikcoromant", "sanofi", "sap", "sarl", "sas", "save", "saxo", "sbi", "sbs", "scb", "schaeffler", "schmidt", "scholarships", "school", "schule", "schwarz", "science", "scot", "search", "seat", "secure", "security", "seek", "select", "sener", "services", "seven", "sew", "sex", "sexy", "sfr", "shangrila", "sharp", "shell", "shia", "shiksha", "shoes", "shop", "shopping", "shouji", "show", "silk", "sina", "singles", "site", "ski", "skin", "sky", "skype", "sling", "smart", "smile", "sncf", "soccer", "social", "softbank", "software", "sohu", "solar", "solutions", "song", "sony", "soy", "spa", "space", "sport", "spot", "srl", "stada", "staples", "star", "statebank", "statefarm", "stc", "stcgroup", "stockholm", "storage", "store", "stream", "studio", "study", "style", "sucks", "supplies", "supply", "support", "surf", "surgery", "suzuki", "swatch", "swiss", "sydney", "systems", "tab", "taipei", "talk", "taobao", "target", "tatamotors", "tatar", "tattoo", "tax", "taxi", "tci", "tdk", "team", "tech", "technology", "temasek", "tennis", "teva", "thd", "theater", "theatre", "tiaa", "tickets", "tienda", "tips", "tires", "tirol", "tjmaxx", "tjx", "tkmaxx", "tmall", "today", "tokyo", "tools", "top", "toray", "toshiba", "total", "tours", "town", "toyota", "toys", "trade", "trading", "training", "travel", "travelers", "travelersinsurance", "trust", "trv", "tube", "tui", "tunes", "tushu", "tvs", "ubank", "ubs", "unicom", "university", "uno", "uol", "ups", "vacations", "vana", "vanguard", "vegas", "ventures", "verisign", "versicherung", "vet", "viajes", "video", "vig", "viking", "villas", "vin", "vip", "virgin", "visa", "vision", "viva", "vivo", "vlaanderen", "vodka", "volvo", "vote", "voting", "voto", "voyage", "wales", "walmart", "walter", "wang", "wanggou", "watch", "watches", "weather", "weatherchannel", "webcam", "weber", "website", "wed", "wedding", "weibo", "weir", "whoswho", "wien", "wiki", "williamhill", "win", "windows", "wine", "winners", "wme", "wolterskluwer", "woodside", "work", "works", "world", "wow", "wtc", "wtf", "xbox", "xerox", "xihuan", "xin", "\u0915\u0949\u092E", "\u30BB\u30FC\u30EB", "\u4F5B\u5C71", "\u6148\u5584", "\u96C6\u56E2", "\u5728\u7EBF", "\u70B9\u770B", "\u0E04\u0E2D\u0E21", "\u516B\u5366", "\u0645\u0648\u0642\u0639", "\u516C\u76CA", "\u516C\u53F8", "\u9999\u683C\u91CC\u62C9", "\u7F51\u7AD9", "\u79FB\u52A8", "\u6211\u7231\u4F60", "\u043C\u043E\u0441\u043A\u0432\u0430", "\u043A\u0430\u0442\u043E\u043B\u0438\u043A", "\u043E\u043D\u043B\u0430\u0439\u043D", "\u0441\u0430\u0439\u0442", "\u8054\u901A", "\u05E7\u05D5\u05DD", "\u65F6\u5C1A", "\u5FAE\u535A", "\u6DE1\u9A6C\u9521", "\u30D5\u30A1\u30C3\u30B7\u30E7\u30F3", "\u043E\u0440\u0433", "\u0928\u0947\u091F", "\u30B9\u30C8\u30A2", "\u30A2\u30DE\u30BE\u30F3", "\uC0BC\uC131", "\u5546\u6807", "\u5546\u5E97", "\u5546\u57CE", "\u0434\u0435\u0442\u0438", "\u30DD\u30A4\u30F3\u30C8", "\u65B0\u95FB", "\u5BB6\u96FB", "\u0643\u0648\u0645", "\u4E2D\u6587\u7F51", "\u4E2D\u4FE1", "\u5A31\u4E50", "\u8C37\u6B4C", "\u96FB\u8A0A\u76C8\u79D1", "\u8D2D\u7269", "\u30AF\u30E9\u30A6\u30C9", "\u901A\u8CA9", "\u7F51\u5E97", "\u0938\u0902\u0917\u0920\u0928", "\u9910\u5385", "\u7F51\u7EDC", "\u043A\u043E\u043C", "\u4E9A\u9A6C\u900A", "\u98DF\u54C1", "\u98DE\u5229\u6D66", "\u624B\u673A", "\u0627\u0631\u0627\u0645\u0643\u0648", "\u0627\u0644\u0639\u0644\u064A\u0627\u0646", "\u0628\u0627\u0632\u0627\u0631", "\u0627\u0628\u0648\u0638\u0628\u064A", "\u0643\u0627\u062B\u0648\u0644\u064A\u0643", "\u0647\u0645\u0631\u0627\u0647", "\uB2F7\uCEF4", "\u653F\u5E9C", "\u0634\u0628\u0643\u0629", "\u0628\u064A\u062A\u0643", "\u0639\u0631\u0628", "\u673A\u6784", "\u7EC4\u7EC7\u673A\u6784", "\u5065\u5EB7", "\u62DB\u8058", "\u0440\u0443\u0441", "\u5927\u62FF", "\u307F\u3093\u306A", "\u30B0\u30FC\u30B0\u30EB", "\u4E16\u754C", "\u66F8\u7C4D", "\u7F51\u5740", "\uB2F7\uB137", "\u30B3\u30E0", "\u5929\u4E3B\u6559", "\u6E38\u620F", "verm\xF6gensberater", "verm\xF6gensberatung", "\u4F01\u4E1A", "\u4FE1\u606F", "\u5609\u91CC\u5927\u9152\u5E97", "\u5609\u91CC", "\u5E7F\u4E1C", "\u653F\u52A1", "xyz", "yachts", "yahoo", "yamaxun", "yandex", "yodobashi", "yoga", "yokohama", "you", "youtube", "yun", "zappos", "zara", "zero", "zip", "zone", "zuerich", "co.krd", "edu.krd", "art.pl", "gliwice.pl", "krakow.pl", "poznan.pl", "wroc.pl", "zakopane.pl", "lib.de.us", "12chars.dev", "12chars.it", "12chars.pro", "cc.ua", "inf.ua", "ltd.ua", "611.to", "a2hosted.com", "cpserver.com", "aaa.vodka", "*.on-acorn.io", "activetrail.biz", "adaptable.app", "adobeaemcloud.com", "*.dev.adobeaemcloud.com", "aem.live", "hlx.live", "adobeaemcloud.net", "aem.page", "hlx.page", "hlx3.page", "adobeio-static.net", "adobeioruntime.net", "africa.com", "beep.pl", "airkitapps.com", "airkitapps-au.com", "airkitapps.eu", "aivencloud.com", "akadns.net", "akamai.net", "akamai-staging.net", "akamaiedge.net", "akamaiedge-staging.net", "akamaihd.net", "akamaihd-staging.net", "akamaiorigin.net", "akamaiorigin-staging.net", "akamaized.net", "akamaized-staging.net", "edgekey.net", "edgekey-staging.net", "edgesuite.net", "edgesuite-staging.net", "barsy.ca", "*.compute.estate", "*.alces.network", "kasserver.com", "altervista.org", "alwaysdata.net", "myamaze.net", "execute-api.cn-north-1.amazonaws.com.cn", "execute-api.cn-northwest-1.amazonaws.com.cn", "execute-api.af-south-1.amazonaws.com", "execute-api.ap-east-1.amazonaws.com", "execute-api.ap-northeast-1.amazonaws.com", "execute-api.ap-northeast-2.amazonaws.com", "execute-api.ap-northeast-3.amazonaws.com", "execute-api.ap-south-1.amazonaws.com", "execute-api.ap-south-2.amazonaws.com", "execute-api.ap-southeast-1.amazonaws.com", "execute-api.ap-southeast-2.amazonaws.com", "execute-api.ap-southeast-3.amazonaws.com", "execute-api.ap-southeast-4.amazonaws.com", "execute-api.ap-southeast-5.amazonaws.com", "execute-api.ca-central-1.amazonaws.com", "execute-api.ca-west-1.amazonaws.com", "execute-api.eu-central-1.amazonaws.com", "execute-api.eu-central-2.amazonaws.com", "execute-api.eu-north-1.amazonaws.com", "execute-api.eu-south-1.amazonaws.com", "execute-api.eu-south-2.amazonaws.com", "execute-api.eu-west-1.amazonaws.com", "execute-api.eu-west-2.amazonaws.com", "execute-api.eu-west-3.amazonaws.com", "execute-api.il-central-1.amazonaws.com", "execute-api.me-central-1.amazonaws.com", "execute-api.me-south-1.amazonaws.com", "execute-api.sa-east-1.amazonaws.com", "execute-api.us-east-1.amazonaws.com", "execute-api.us-east-2.amazonaws.com", "execute-api.us-gov-east-1.amazonaws.com", "execute-api.us-gov-west-1.amazonaws.com", "execute-api.us-west-1.amazonaws.com", "execute-api.us-west-2.amazonaws.com", "cloudfront.net", "auth.af-south-1.amazoncognito.com", "auth.ap-east-1.amazoncognito.com", "auth.ap-northeast-1.amazoncognito.com", "auth.ap-northeast-2.amazoncognito.com", "auth.ap-northeast-3.amazoncognito.com", "auth.ap-south-1.amazoncognito.com", "auth.ap-south-2.amazoncognito.com", "auth.ap-southeast-1.amazoncognito.com", "auth.ap-southeast-2.amazoncognito.com", "auth.ap-southeast-3.amazoncognito.com", "auth.ap-southeast-4.amazoncognito.com", "auth.ca-central-1.amazoncognito.com", "auth.ca-west-1.amazoncognito.com", "auth.eu-central-1.amazoncognito.com", "auth.eu-central-2.amazoncognito.com", "auth.eu-north-1.amazoncognito.com", "auth.eu-south-1.amazoncognito.com", "auth.eu-south-2.amazoncognito.com", "auth.eu-west-1.amazoncognito.com", "auth.eu-west-2.amazoncognito.com", "auth.eu-west-3.amazoncognito.com", "auth.il-central-1.amazoncognito.com", "auth.me-central-1.amazoncognito.com", "auth.me-south-1.amazoncognito.com", "auth.sa-east-1.amazoncognito.com", "auth.us-east-1.amazoncognito.com", "auth-fips.us-east-1.amazoncognito.com", "auth.us-east-2.amazoncognito.com", "auth-fips.us-east-2.amazoncognito.com", "auth-fips.us-gov-west-1.amazoncognito.com", "auth.us-west-1.amazoncognito.com", "auth-fips.us-west-1.amazoncognito.com", "auth.us-west-2.amazoncognito.com", "auth-fips.us-west-2.amazoncognito.com", "*.compute.amazonaws.com.cn", "*.compute.amazonaws.com", "*.compute-1.amazonaws.com", "us-east-1.amazonaws.com", "emrappui-prod.cn-north-1.amazonaws.com.cn", "emrnotebooks-prod.cn-north-1.amazonaws.com.cn", "emrstudio-prod.cn-north-1.amazonaws.com.cn", "emrappui-prod.cn-northwest-1.amazonaws.com.cn", "emrnotebooks-prod.cn-northwest-1.amazonaws.com.cn", "emrstudio-prod.cn-northwest-1.amazonaws.com.cn", "emrappui-prod.af-south-1.amazonaws.com", "emrnotebooks-prod.af-south-1.amazonaws.com", "emrstudio-prod.af-south-1.amazonaws.com", "emrappui-prod.ap-east-1.amazonaws.com", "emrnotebooks-prod.ap-east-1.amazonaws.com", "emrstudio-prod.ap-east-1.amazonaws.com", "emrappui-prod.ap-northeast-1.amazonaws.com", "emrnotebooks-prod.ap-northeast-1.amazonaws.com", "emrstudio-prod.ap-northeast-1.amazonaws.com", "emrappui-prod.ap-northeast-2.amazonaws.com", "emrnotebooks-prod.ap-northeast-2.amazonaws.com", "emrstudio-prod.ap-northeast-2.amazonaws.com", "emrappui-prod.ap-northeast-3.amazonaws.com", "emrnotebooks-prod.ap-northeast-3.amazonaws.com", "emrstudio-prod.ap-northeast-3.amazonaws.com", "emrappui-prod.ap-south-1.amazonaws.com", "emrnotebooks-prod.ap-south-1.amazonaws.com", "emrstudio-prod.ap-south-1.amazonaws.com", "emrappui-prod.ap-south-2.amazonaws.com", "emrnotebooks-prod.ap-south-2.amazonaws.com", "emrstudio-prod.ap-south-2.amazonaws.com", "emrappui-prod.ap-southeast-1.amazonaws.com", "emrnotebooks-prod.ap-southeast-1.amazonaws.com", "emrstudio-prod.ap-southeast-1.amazonaws.com", "emrappui-prod.ap-southeast-2.amazonaws.com", "emrnotebooks-prod.ap-southeast-2.amazonaws.com", "emrstudio-prod.ap-southeast-2.amazonaws.com", "emrappui-prod.ap-southeast-3.amazonaws.com", "emrnotebooks-prod.ap-southeast-3.amazonaws.com", "emrstudio-prod.ap-southeast-3.amazonaws.com", "emrappui-prod.ap-southeast-4.amazonaws.com", "emrnotebooks-prod.ap-southeast-4.amazonaws.com", "emrstudio-prod.ap-southeast-4.amazonaws.com", "emrappui-prod.ca-central-1.amazonaws.com", "emrnotebooks-prod.ca-central-1.amazonaws.com", "emrstudio-prod.ca-central-1.amazonaws.com", "emrappui-prod.ca-west-1.amazonaws.com", "emrnotebooks-prod.ca-west-1.amazonaws.com", "emrstudio-prod.ca-west-1.amazonaws.com", "emrappui-prod.eu-central-1.amazonaws.com", "emrnotebooks-prod.eu-central-1.amazonaws.com", "emrstudio-prod.eu-central-1.amazonaws.com", "emrappui-prod.eu-central-2.amazonaws.com", "emrnotebooks-prod.eu-central-2.amazonaws.com", "emrstudio-prod.eu-central-2.amazonaws.com", "emrappui-prod.eu-north-1.amazonaws.com", "emrnotebooks-prod.eu-north-1.amazonaws.com", "emrstudio-prod.eu-north-1.amazonaws.com", "emrappui-prod.eu-south-1.amazonaws.com", "emrnotebooks-prod.eu-south-1.amazonaws.com", "emrstudio-prod.eu-south-1.amazonaws.com", "emrappui-prod.eu-south-2.amazonaws.com", "emrnotebooks-prod.eu-south-2.amazonaws.com", "emrstudio-prod.eu-south-2.amazonaws.com", "emrappui-prod.eu-west-1.amazonaws.com", "emrnotebooks-prod.eu-west-1.amazonaws.com", "emrstudio-prod.eu-west-1.amazonaws.com", "emrappui-prod.eu-west-2.amazonaws.com", "emrnotebooks-prod.eu-west-2.amazonaws.com", "emrstudio-prod.eu-west-2.amazonaws.com", "emrappui-prod.eu-west-3.amazonaws.com", "emrnotebooks-prod.eu-west-3.amazonaws.com", "emrstudio-prod.eu-west-3.amazonaws.com", "emrappui-prod.il-central-1.amazonaws.com", "emrnotebooks-prod.il-central-1.amazonaws.com", "emrstudio-prod.il-central-1.amazonaws.com", "emrappui-prod.me-central-1.amazonaws.com", "emrnotebooks-prod.me-central-1.amazonaws.com", "emrstudio-prod.me-central-1.amazonaws.com", "emrappui-prod.me-south-1.amazonaws.com", "emrnotebooks-prod.me-south-1.amazonaws.com", "emrstudio-prod.me-south-1.amazonaws.com", "emrappui-prod.sa-east-1.amazonaws.com", "emrnotebooks-prod.sa-east-1.amazonaws.com", "emrstudio-prod.sa-east-1.amazonaws.com", "emrappui-prod.us-east-1.amazonaws.com", "emrnotebooks-prod.us-east-1.amazonaws.com", "emrstudio-prod.us-east-1.amazonaws.com", "emrappui-prod.us-east-2.amazonaws.com", "emrnotebooks-prod.us-east-2.amazonaws.com", "emrstudio-prod.us-east-2.amazonaws.com", "emrappui-prod.us-gov-east-1.amazonaws.com", "emrnotebooks-prod.us-gov-east-1.amazonaws.com", "emrstudio-prod.us-gov-east-1.amazonaws.com", "emrappui-prod.us-gov-west-1.amazonaws.com", "emrnotebooks-prod.us-gov-west-1.amazonaws.com", "emrstudio-prod.us-gov-west-1.amazonaws.com", "emrappui-prod.us-west-1.amazonaws.com", "emrnotebooks-prod.us-west-1.amazonaws.com", "emrstudio-prod.us-west-1.amazonaws.com", "emrappui-prod.us-west-2.amazonaws.com", "emrnotebooks-prod.us-west-2.amazonaws.com", "emrstudio-prod.us-west-2.amazonaws.com", "*.cn-north-1.airflow.amazonaws.com.cn", "*.cn-northwest-1.airflow.amazonaws.com.cn", "*.af-south-1.airflow.amazonaws.com", "*.ap-east-1.airflow.amazonaws.com", "*.ap-northeast-1.airflow.amazonaws.com", "*.ap-northeast-2.airflow.amazonaws.com", "*.ap-northeast-3.airflow.amazonaws.com", "*.ap-south-1.airflow.amazonaws.com", "*.ap-south-2.airflow.amazonaws.com", "*.ap-southeast-1.airflow.amazonaws.com", "*.ap-southeast-2.airflow.amazonaws.com", "*.ap-southeast-3.airflow.amazonaws.com", "*.ap-southeast-4.airflow.amazonaws.com", "*.ca-central-1.airflow.amazonaws.com", "*.ca-west-1.airflow.amazonaws.com", "*.eu-central-1.airflow.amazonaws.com", "*.eu-central-2.airflow.amazonaws.com", "*.eu-north-1.airflow.amazonaws.com", "*.eu-south-1.airflow.amazonaws.com", "*.eu-south-2.airflow.amazonaws.com", "*.eu-west-1.airflow.amazonaws.com", "*.eu-west-2.airflow.amazonaws.com", "*.eu-west-3.airflow.amazonaws.com", "*.il-central-1.airflow.amazonaws.com", "*.me-central-1.airflow.amazonaws.com", "*.me-south-1.airflow.amazonaws.com", "*.sa-east-1.airflow.amazonaws.com", "*.us-east-1.airflow.amazonaws.com", "*.us-east-2.airflow.amazonaws.com", "*.us-west-1.airflow.amazonaws.com", "*.us-west-2.airflow.amazonaws.com", "s3.dualstack.cn-north-1.amazonaws.com.cn", "s3-accesspoint.dualstack.cn-north-1.amazonaws.com.cn", "s3-website.dualstack.cn-north-1.amazonaws.com.cn", "s3.cn-north-1.amazonaws.com.cn", "s3-accesspoint.cn-north-1.amazonaws.com.cn", "s3-deprecated.cn-north-1.amazonaws.com.cn", "s3-object-lambda.cn-north-1.amazonaws.com.cn", "s3-website.cn-north-1.amazonaws.com.cn", "s3.dualstack.cn-northwest-1.amazonaws.com.cn", "s3-accesspoint.dualstack.cn-northwest-1.amazonaws.com.cn", "s3.cn-northwest-1.amazonaws.com.cn", "s3-accesspoint.cn-northwest-1.amazonaws.com.cn", "s3-object-lambda.cn-northwest-1.amazonaws.com.cn", "s3-website.cn-northwest-1.amazonaws.com.cn", "s3.dualstack.af-south-1.amazonaws.com", "s3-accesspoint.dualstack.af-south-1.amazonaws.com", "s3-website.dualstack.af-south-1.amazonaws.com", "s3.af-south-1.amazonaws.com", "s3-accesspoint.af-south-1.amazonaws.com", "s3-object-lambda.af-south-1.amazonaws.com", "s3-website.af-south-1.amazonaws.com", "s3.dualstack.ap-east-1.amazonaws.com", "s3-accesspoint.dualstack.ap-east-1.amazonaws.com", "s3.ap-east-1.amazonaws.com", "s3-accesspoint.ap-east-1.amazonaws.com", "s3-object-lambda.ap-east-1.amazonaws.com", "s3-website.ap-east-1.amazonaws.com", "s3.dualstack.ap-northeast-1.amazonaws.com", "s3-accesspoint.dualstack.ap-northeast-1.amazonaws.com", "s3-website.dualstack.ap-northeast-1.amazonaws.com", "s3.ap-northeast-1.amazonaws.com", "s3-accesspoint.ap-northeast-1.amazonaws.com", "s3-object-lambda.ap-northeast-1.amazonaws.com", "s3-website.ap-northeast-1.amazonaws.com", "s3.dualstack.ap-northeast-2.amazonaws.com", "s3-accesspoint.dualstack.ap-northeast-2.amazonaws.com", "s3-website.dualstack.ap-northeast-2.amazonaws.com", "s3.ap-northeast-2.amazonaws.com", "s3-accesspoint.ap-northeast-2.amazonaws.com", "s3-object-lambda.ap-northeast-2.amazonaws.com", "s3-website.ap-northeast-2.amazonaws.com", "s3.dualstack.ap-northeast-3.amazonaws.com", "s3-accesspoint.dualstack.ap-northeast-3.amazonaws.com", "s3-website.dualstack.ap-northeast-3.amazonaws.com", "s3.ap-northeast-3.amazonaws.com", "s3-accesspoint.ap-northeast-3.amazonaws.com", "s3-object-lambda.ap-northeast-3.amazonaws.com", "s3-website.ap-northeast-3.amazonaws.com", "s3.dualstack.ap-south-1.amazonaws.com", "s3-accesspoint.dualstack.ap-south-1.amazonaws.com", "s3-website.dualstack.ap-south-1.amazonaws.com", "s3.ap-south-1.amazonaws.com", "s3-accesspoint.ap-south-1.amazonaws.com", "s3-object-lambda.ap-south-1.amazonaws.com", "s3-website.ap-south-1.amazonaws.com", "s3.dualstack.ap-south-2.amazonaws.com", "s3-accesspoint.dualstack.ap-south-2.amazonaws.com", "s3-website.dualstack.ap-south-2.amazonaws.com", "s3.ap-south-2.amazonaws.com", "s3-accesspoint.ap-south-2.amazonaws.com", "s3-object-lambda.ap-south-2.amazonaws.com", "s3-website.ap-south-2.amazonaws.com", "s3.dualstack.ap-southeast-1.amazonaws.com", "s3-accesspoint.dualstack.ap-southeast-1.amazonaws.com", "s3-website.dualstack.ap-southeast-1.amazonaws.com", "s3.ap-southeast-1.amazonaws.com", "s3-accesspoint.ap-southeast-1.amazonaws.com", "s3-object-lambda.ap-southeast-1.amazonaws.com", "s3-website.ap-southeast-1.amazonaws.com", "s3.dualstack.ap-southeast-2.amazonaws.com", "s3-accesspoint.dualstack.ap-southeast-2.amazonaws.com", "s3-website.dualstack.ap-southeast-2.amazonaws.com", "s3.ap-southeast-2.amazonaws.com", "s3-accesspoint.ap-southeast-2.amazonaws.com", "s3-object-lambda.ap-southeast-2.amazonaws.com", "s3-website.ap-southeast-2.amazonaws.com", "s3.dualstack.ap-southeast-3.amazonaws.com", "s3-accesspoint.dualstack.ap-southeast-3.amazonaws.com", "s3-website.dualstack.ap-southeast-3.amazonaws.com", "s3.ap-southeast-3.amazonaws.com", "s3-accesspoint.ap-southeast-3.amazonaws.com", "s3-object-lambda.ap-southeast-3.amazonaws.com", "s3-website.ap-southeast-3.amazonaws.com", "s3.dualstack.ap-southeast-4.amazonaws.com", "s3-accesspoint.dualstack.ap-southeast-4.amazonaws.com", "s3-website.dualstack.ap-southeast-4.amazonaws.com", "s3.ap-southeast-4.amazonaws.com", "s3-accesspoint.ap-southeast-4.amazonaws.com", "s3-object-lambda.ap-southeast-4.amazonaws.com", "s3-website.ap-southeast-4.amazonaws.com", "s3.dualstack.ap-southeast-5.amazonaws.com", "s3-accesspoint.dualstack.ap-southeast-5.amazonaws.com", "s3-website.dualstack.ap-southeast-5.amazonaws.com", "s3.ap-southeast-5.amazonaws.com", "s3-accesspoint.ap-southeast-5.amazonaws.com", "s3-deprecated.ap-southeast-5.amazonaws.com", "s3-object-lambda.ap-southeast-5.amazonaws.com", "s3-website.ap-southeast-5.amazonaws.com", "s3.dualstack.ca-central-1.amazonaws.com", "s3-accesspoint.dualstack.ca-central-1.amazonaws.com", "s3-accesspoint-fips.dualstack.ca-central-1.amazonaws.com", "s3-fips.dualstack.ca-central-1.amazonaws.com", "s3-website.dualstack.ca-central-1.amazonaws.com", "s3.ca-central-1.amazonaws.com", "s3-accesspoint.ca-central-1.amazonaws.com", "s3-accesspoint-fips.ca-central-1.amazonaws.com", "s3-fips.ca-central-1.amazonaws.com", "s3-object-lambda.ca-central-1.amazonaws.com", "s3-website.ca-central-1.amazonaws.com", "s3.dualstack.ca-west-1.amazonaws.com", "s3-accesspoint.dualstack.ca-west-1.amazonaws.com", "s3-accesspoint-fips.dualstack.ca-west-1.amazonaws.com", "s3-fips.dualstack.ca-west-1.amazonaws.com", "s3-website.dualstack.ca-west-1.amazonaws.com", "s3.ca-west-1.amazonaws.com", "s3-accesspoint.ca-west-1.amazonaws.com", "s3-accesspoint-fips.ca-west-1.amazonaws.com", "s3-fips.ca-west-1.amazonaws.com", "s3-object-lambda.ca-west-1.amazonaws.com", "s3-website.ca-west-1.amazonaws.com", "s3.dualstack.eu-central-1.amazonaws.com", "s3-accesspoint.dualstack.eu-central-1.amazonaws.com", "s3-website.dualstack.eu-central-1.amazonaws.com", "s3.eu-central-1.amazonaws.com", "s3-accesspoint.eu-central-1.amazonaws.com", "s3-object-lambda.eu-central-1.amazonaws.com", "s3-website.eu-central-1.amazonaws.com", "s3.dualstack.eu-central-2.amazonaws.com", "s3-accesspoint.dualstack.eu-central-2.amazonaws.com", "s3-website.dualstack.eu-central-2.amazonaws.com", "s3.eu-central-2.amazonaws.com", "s3-accesspoint.eu-central-2.amazonaws.com", "s3-object-lambda.eu-central-2.amazonaws.com", "s3-website.eu-central-2.amazonaws.com", "s3.dualstack.eu-north-1.amazonaws.com", "s3-accesspoint.dualstack.eu-north-1.amazonaws.com", "s3.eu-north-1.amazonaws.com", "s3-accesspoint.eu-north-1.amazonaws.com", "s3-object-lambda.eu-north-1.amazonaws.com", "s3-website.eu-north-1.amazonaws.com", "s3.dualstack.eu-south-1.amazonaws.com", "s3-accesspoint.dualstack.eu-south-1.amazonaws.com", "s3-website.dualstack.eu-south-1.amazonaws.com", "s3.eu-south-1.amazonaws.com", "s3-accesspoint.eu-south-1.amazonaws.com", "s3-object-lambda.eu-south-1.amazonaws.com", "s3-website.eu-south-1.amazonaws.com", "s3.dualstack.eu-south-2.amazonaws.com", "s3-accesspoint.dualstack.eu-south-2.amazonaws.com", "s3-website.dualstack.eu-south-2.amazonaws.com", "s3.eu-south-2.amazonaws.com", "s3-accesspoint.eu-south-2.amazonaws.com", "s3-object-lambda.eu-south-2.amazonaws.com", "s3-website.eu-south-2.amazonaws.com", "s3.dualstack.eu-west-1.amazonaws.com", "s3-accesspoint.dualstack.eu-west-1.amazonaws.com", "s3-website.dualstack.eu-west-1.amazonaws.com", "s3.eu-west-1.amazonaws.com", "s3-accesspoint.eu-west-1.amazonaws.com", "s3-deprecated.eu-west-1.amazonaws.com", "s3-object-lambda.eu-west-1.amazonaws.com", "s3-website.eu-west-1.amazonaws.com", "s3.dualstack.eu-west-2.amazonaws.com", "s3-accesspoint.dualstack.eu-west-2.amazonaws.com", "s3.eu-west-2.amazonaws.com", "s3-accesspoint.eu-west-2.amazonaws.com", "s3-object-lambda.eu-west-2.amazonaws.com", "s3-website.eu-west-2.amazonaws.com", "s3.dualstack.eu-west-3.amazonaws.com", "s3-accesspoint.dualstack.eu-west-3.amazonaws.com", "s3-website.dualstack.eu-west-3.amazonaws.com", "s3.eu-west-3.amazonaws.com", "s3-accesspoint.eu-west-3.amazonaws.com", "s3-object-lambda.eu-west-3.amazonaws.com", "s3-website.eu-west-3.amazonaws.com", "s3.dualstack.il-central-1.amazonaws.com", "s3-accesspoint.dualstack.il-central-1.amazonaws.com", "s3-website.dualstack.il-central-1.amazonaws.com", "s3.il-central-1.amazonaws.com", "s3-accesspoint.il-central-1.amazonaws.com", "s3-object-lambda.il-central-1.amazonaws.com", "s3-website.il-central-1.amazonaws.com", "s3.dualstack.me-central-1.amazonaws.com", "s3-accesspoint.dualstack.me-central-1.amazonaws.com", "s3-website.dualstack.me-central-1.amazonaws.com", "s3.me-central-1.amazonaws.com", "s3-accesspoint.me-central-1.amazonaws.com", "s3-object-lambda.me-central-1.amazonaws.com", "s3-website.me-central-1.amazonaws.com", "s3.dualstack.me-south-1.amazonaws.com", "s3-accesspoint.dualstack.me-south-1.amazonaws.com", "s3.me-south-1.amazonaws.com", "s3-accesspoint.me-south-1.amazonaws.com", "s3-object-lambda.me-south-1.amazonaws.com", "s3-website.me-south-1.amazonaws.com", "s3.amazonaws.com", "s3-1.amazonaws.com", "s3-ap-east-1.amazonaws.com", "s3-ap-northeast-1.amazonaws.com", "s3-ap-northeast-2.amazonaws.com", "s3-ap-northeast-3.amazonaws.com", "s3-ap-south-1.amazonaws.com", "s3-ap-southeast-1.amazonaws.com", "s3-ap-southeast-2.amazonaws.com", "s3-ca-central-1.amazonaws.com", "s3-eu-central-1.amazonaws.com", "s3-eu-north-1.amazonaws.com", "s3-eu-west-1.amazonaws.com", "s3-eu-west-2.amazonaws.com", "s3-eu-west-3.amazonaws.com", "s3-external-1.amazonaws.com", "s3-fips-us-gov-east-1.amazonaws.com", "s3-fips-us-gov-west-1.amazonaws.com", "mrap.accesspoint.s3-global.amazonaws.com", "s3-me-south-1.amazonaws.com", "s3-sa-east-1.amazonaws.com", "s3-us-east-2.amazonaws.com", "s3-us-gov-east-1.amazonaws.com", "s3-us-gov-west-1.amazonaws.com", "s3-us-west-1.amazonaws.com", "s3-us-west-2.amazonaws.com", "s3-website-ap-northeast-1.amazonaws.com", "s3-website-ap-southeast-1.amazonaws.com", "s3-website-ap-southeast-2.amazonaws.com", "s3-website-eu-west-1.amazonaws.com", "s3-website-sa-east-1.amazonaws.com", "s3-website-us-east-1.amazonaws.com", "s3-website-us-gov-west-1.amazonaws.com", "s3-website-us-west-1.amazonaws.com", "s3-website-us-west-2.amazonaws.com", "s3.dualstack.sa-east-1.amazonaws.com", "s3-accesspoint.dualstack.sa-east-1.amazonaws.com", "s3-website.dualstack.sa-east-1.amazonaws.com", "s3.sa-east-1.amazonaws.com", "s3-accesspoint.sa-east-1.amazonaws.com", "s3-object-lambda.sa-east-1.amazonaws.com", "s3-website.sa-east-1.amazonaws.com", "s3.dualstack.us-east-1.amazonaws.com", "s3-accesspoint.dualstack.us-east-1.amazonaws.com", "s3-accesspoint-fips.dualstack.us-east-1.amazonaws.com", "s3-fips.dualstack.us-east-1.amazonaws.com", "s3-website.dualstack.us-east-1.amazonaws.com", "s3.us-east-1.amazonaws.com", "s3-accesspoint.us-east-1.amazonaws.com", "s3-accesspoint-fips.us-east-1.amazonaws.com", "s3-deprecated.us-east-1.amazonaws.com", "s3-fips.us-east-1.amazonaws.com", "s3-object-lambda.us-east-1.amazonaws.com", "s3-website.us-east-1.amazonaws.com", "s3.dualstack.us-east-2.amazonaws.com", "s3-accesspoint.dualstack.us-east-2.amazonaws.com", "s3-accesspoint-fips.dualstack.us-east-2.amazonaws.com", "s3-fips.dualstack.us-east-2.amazonaws.com", "s3-website.dualstack.us-east-2.amazonaws.com", "s3.us-east-2.amazonaws.com", "s3-accesspoint.us-east-2.amazonaws.com", "s3-accesspoint-fips.us-east-2.amazonaws.com", "s3-deprecated.us-east-2.amazonaws.com", "s3-fips.us-east-2.amazonaws.com", "s3-object-lambda.us-east-2.amazonaws.com", "s3-website.us-east-2.amazonaws.com", "s3.dualstack.us-gov-east-1.amazonaws.com", "s3-accesspoint.dualstack.us-gov-east-1.amazonaws.com", "s3-accesspoint-fips.dualstack.us-gov-east-1.amazonaws.com", "s3-fips.dualstack.us-gov-east-1.amazonaws.com", "s3.us-gov-east-1.amazonaws.com", "s3-accesspoint.us-gov-east-1.amazonaws.com", "s3-accesspoint-fips.us-gov-east-1.amazonaws.com", "s3-fips.us-gov-east-1.amazonaws.com", "s3-object-lambda.us-gov-east-1.amazonaws.com", "s3-website.us-gov-east-1.amazonaws.com", "s3.dualstack.us-gov-west-1.amazonaws.com", "s3-accesspoint.dualstack.us-gov-west-1.amazonaws.com", "s3-accesspoint-fips.dualstack.us-gov-west-1.amazonaws.com", "s3-fips.dualstack.us-gov-west-1.amazonaws.com", "s3.us-gov-west-1.amazonaws.com", "s3-accesspoint.us-gov-west-1.amazonaws.com", "s3-accesspoint-fips.us-gov-west-1.amazonaws.com", "s3-fips.us-gov-west-1.amazonaws.com", "s3-object-lambda.us-gov-west-1.amazonaws.com", "s3-website.us-gov-west-1.amazonaws.com", "s3.dualstack.us-west-1.amazonaws.com", "s3-accesspoint.dualstack.us-west-1.amazonaws.com", "s3-accesspoint-fips.dualstack.us-west-1.amazonaws.com", "s3-fips.dualstack.us-west-1.amazonaws.com", "s3-website.dualstack.us-west-1.amazonaws.com", "s3.us-west-1.amazonaws.com", "s3-accesspoint.us-west-1.amazonaws.com", "s3-accesspoint-fips.us-west-1.amazonaws.com", "s3-fips.us-west-1.amazonaws.com", "s3-object-lambda.us-west-1.amazonaws.com", "s3-website.us-west-1.amazonaws.com", "s3.dualstack.us-west-2.amazonaws.com", "s3-accesspoint.dualstack.us-west-2.amazonaws.com", "s3-accesspoint-fips.dualstack.us-west-2.amazonaws.com", "s3-fips.dualstack.us-west-2.amazonaws.com", "s3-website.dualstack.us-west-2.amazonaws.com", "s3.us-west-2.amazonaws.com", "s3-accesspoint.us-west-2.amazonaws.com", "s3-accesspoint-fips.us-west-2.amazonaws.com", "s3-deprecated.us-west-2.amazonaws.com", "s3-fips.us-west-2.amazonaws.com", "s3-object-lambda.us-west-2.amazonaws.com", "s3-website.us-west-2.amazonaws.com", "labeling.ap-northeast-1.sagemaker.aws", "labeling.ap-northeast-2.sagemaker.aws", "labeling.ap-south-1.sagemaker.aws", "labeling.ap-southeast-1.sagemaker.aws", "labeling.ap-southeast-2.sagemaker.aws", "labeling.ca-central-1.sagemaker.aws", "labeling.eu-central-1.sagemaker.aws", "labeling.eu-west-1.sagemaker.aws", "labeling.eu-west-2.sagemaker.aws", "labeling.us-east-1.sagemaker.aws", "labeling.us-east-2.sagemaker.aws", "labeling.us-west-2.sagemaker.aws", "notebook.af-south-1.sagemaker.aws", "notebook.ap-east-1.sagemaker.aws", "notebook.ap-northeast-1.sagemaker.aws", "notebook.ap-northeast-2.sagemaker.aws", "notebook.ap-northeast-3.sagemaker.aws", "notebook.ap-south-1.sagemaker.aws", "notebook.ap-south-2.sagemaker.aws", "notebook.ap-southeast-1.sagemaker.aws", "notebook.ap-southeast-2.sagemaker.aws", "notebook.ap-southeast-3.sagemaker.aws", "notebook.ap-southeast-4.sagemaker.aws", "notebook.ca-central-1.sagemaker.aws", "notebook-fips.ca-central-1.sagemaker.aws", "notebook.ca-west-1.sagemaker.aws", "notebook-fips.ca-west-1.sagemaker.aws", "notebook.eu-central-1.sagemaker.aws", "notebook.eu-central-2.sagemaker.aws", "notebook.eu-north-1.sagemaker.aws", "notebook.eu-south-1.sagemaker.aws", "notebook.eu-south-2.sagemaker.aws", "notebook.eu-west-1.sagemaker.aws", "notebook.eu-west-2.sagemaker.aws", "notebook.eu-west-3.sagemaker.aws", "notebook.il-central-1.sagemaker.aws", "notebook.me-central-1.sagemaker.aws", "notebook.me-south-1.sagemaker.aws", "notebook.sa-east-1.sagemaker.aws", "notebook.us-east-1.sagemaker.aws", "notebook-fips.us-east-1.sagemaker.aws", "notebook.us-east-2.sagemaker.aws", "notebook-fips.us-east-2.sagemaker.aws", "notebook.us-gov-east-1.sagemaker.aws", "notebook-fips.us-gov-east-1.sagemaker.aws", "notebook.us-gov-west-1.sagemaker.aws", "notebook-fips.us-gov-west-1.sagemaker.aws", "notebook.us-west-1.sagemaker.aws", "notebook-fips.us-west-1.sagemaker.aws", "notebook.us-west-2.sagemaker.aws", "notebook-fips.us-west-2.sagemaker.aws", "notebook.cn-north-1.sagemaker.com.cn", "notebook.cn-northwest-1.sagemaker.com.cn", "studio.af-south-1.sagemaker.aws", "studio.ap-east-1.sagemaker.aws", "studio.ap-northeast-1.sagemaker.aws", "studio.ap-northeast-2.sagemaker.aws", "studio.ap-northeast-3.sagemaker.aws", "studio.ap-south-1.sagemaker.aws", "studio.ap-southeast-1.sagemaker.aws", "studio.ap-southeast-2.sagemaker.aws", "studio.ap-southeast-3.sagemaker.aws", "studio.ca-central-1.sagemaker.aws", "studio.eu-central-1.sagemaker.aws", "studio.eu-north-1.sagemaker.aws", "studio.eu-south-1.sagemaker.aws", "studio.eu-south-2.sagemaker.aws", "studio.eu-west-1.sagemaker.aws", "studio.eu-west-2.sagemaker.aws", "studio.eu-west-3.sagemaker.aws", "studio.il-central-1.sagemaker.aws", "studio.me-central-1.sagemaker.aws", "studio.me-south-1.sagemaker.aws", "studio.sa-east-1.sagemaker.aws", "studio.us-east-1.sagemaker.aws", "studio.us-east-2.sagemaker.aws", "studio.us-gov-east-1.sagemaker.aws", "studio-fips.us-gov-east-1.sagemaker.aws", "studio.us-gov-west-1.sagemaker.aws", "studio-fips.us-gov-west-1.sagemaker.aws", "studio.us-west-1.sagemaker.aws", "studio.us-west-2.sagemaker.aws", "studio.cn-north-1.sagemaker.com.cn", "studio.cn-northwest-1.sagemaker.com.cn", "*.experiments.sagemaker.aws", "analytics-gateway.ap-northeast-1.amazonaws.com", "analytics-gateway.ap-northeast-2.amazonaws.com", "analytics-gateway.ap-south-1.amazonaws.com", "analytics-gateway.ap-southeast-1.amazonaws.com", "analytics-gateway.ap-southeast-2.amazonaws.com", "analytics-gateway.eu-central-1.amazonaws.com", "analytics-gateway.eu-west-1.amazonaws.com", "analytics-gateway.us-east-1.amazonaws.com", "analytics-gateway.us-east-2.amazonaws.com", "analytics-gateway.us-west-2.amazonaws.com", "amplifyapp.com", "*.awsapprunner.com", "webview-assets.aws-cloud9.af-south-1.amazonaws.com", "vfs.cloud9.af-south-1.amazonaws.com", "webview-assets.cloud9.af-south-1.amazonaws.com", "webview-assets.aws-cloud9.ap-east-1.amazonaws.com", "vfs.cloud9.ap-east-1.amazonaws.com", "webview-assets.cloud9.ap-east-1.amazonaws.com", "webview-assets.aws-cloud9.ap-northeast-1.amazonaws.com", "vfs.cloud9.ap-northeast-1.amazonaws.com", "webview-assets.cloud9.ap-northeast-1.amazonaws.com", "webview-assets.aws-cloud9.ap-northeast-2.amazonaws.com", "vfs.cloud9.ap-northeast-2.amazonaws.com", "webview-assets.cloud9.ap-northeast-2.amazonaws.com", "webview-assets.aws-cloud9.ap-northeast-3.amazonaws.com", "vfs.cloud9.ap-northeast-3.amazonaws.com", "webview-assets.cloud9.ap-northeast-3.amazonaws.com", "webview-assets.aws-cloud9.ap-south-1.amazonaws.com", "vfs.cloud9.ap-south-1.amazonaws.com", "webview-assets.cloud9.ap-south-1.amazonaws.com", "webview-assets.aws-cloud9.ap-southeast-1.amazonaws.com", "vfs.cloud9.ap-southeast-1.amazonaws.com", "webview-assets.cloud9.ap-southeast-1.amazonaws.com", "webview-assets.aws-cloud9.ap-southeast-2.amazonaws.com", "vfs.cloud9.ap-southeast-2.amazonaws.com", "webview-assets.cloud9.ap-southeast-2.amazonaws.com", "webview-assets.aws-cloud9.ca-central-1.amazonaws.com", "vfs.cloud9.ca-central-1.amazonaws.com", "webview-assets.cloud9.ca-central-1.amazonaws.com", "webview-assets.aws-cloud9.eu-central-1.amazonaws.com", "vfs.cloud9.eu-central-1.amazonaws.com", "webview-assets.cloud9.eu-central-1.amazonaws.com", "webview-assets.aws-cloud9.eu-north-1.amazonaws.com", "vfs.cloud9.eu-north-1.amazonaws.com", "webview-assets.cloud9.eu-north-1.amazonaws.com", "webview-assets.aws-cloud9.eu-south-1.amazonaws.com", "vfs.cloud9.eu-south-1.amazonaws.com", "webview-assets.cloud9.eu-south-1.amazonaws.com", "webview-assets.aws-cloud9.eu-west-1.amazonaws.com", "vfs.cloud9.eu-west-1.amazonaws.com", "webview-assets.cloud9.eu-west-1.amazonaws.com", "webview-assets.aws-cloud9.eu-west-2.amazonaws.com", "vfs.cloud9.eu-west-2.amazonaws.com", "webview-assets.cloud9.eu-west-2.amazonaws.com", "webview-assets.aws-cloud9.eu-west-3.amazonaws.com", "vfs.cloud9.eu-west-3.amazonaws.com", "webview-assets.cloud9.eu-west-3.amazonaws.com", "webview-assets.aws-cloud9.il-central-1.amazonaws.com", "vfs.cloud9.il-central-1.amazonaws.com", "webview-assets.aws-cloud9.me-south-1.amazonaws.com", "vfs.cloud9.me-south-1.amazonaws.com", "webview-assets.cloud9.me-south-1.amazonaws.com", "webview-assets.aws-cloud9.sa-east-1.amazonaws.com", "vfs.cloud9.sa-east-1.amazonaws.com", "webview-assets.cloud9.sa-east-1.amazonaws.com", "webview-assets.aws-cloud9.us-east-1.amazonaws.com", "vfs.cloud9.us-east-1.amazonaws.com", "webview-assets.cloud9.us-east-1.amazonaws.com", "webview-assets.aws-cloud9.us-east-2.amazonaws.com", "vfs.cloud9.us-east-2.amazonaws.com", "webview-assets.cloud9.us-east-2.amazonaws.com", "webview-assets.aws-cloud9.us-west-1.amazonaws.com", "vfs.cloud9.us-west-1.amazonaws.com", "webview-assets.cloud9.us-west-1.amazonaws.com", "webview-assets.aws-cloud9.us-west-2.amazonaws.com", "vfs.cloud9.us-west-2.amazonaws.com", "webview-assets.cloud9.us-west-2.amazonaws.com", "awsapps.com", "cn-north-1.eb.amazonaws.com.cn", "cn-northwest-1.eb.amazonaws.com.cn", "elasticbeanstalk.com", "af-south-1.elasticbeanstalk.com", "ap-east-1.elasticbeanstalk.com", "ap-northeast-1.elasticbeanstalk.com", "ap-northeast-2.elasticbeanstalk.com", "ap-northeast-3.elasticbeanstalk.com", "ap-south-1.elasticbeanstalk.com", "ap-southeast-1.elasticbeanstalk.com", "ap-southeast-2.elasticbeanstalk.com", "ap-southeast-3.elasticbeanstalk.com", "ca-central-1.elasticbeanstalk.com", "eu-central-1.elasticbeanstalk.com", "eu-north-1.elasticbeanstalk.com", "eu-south-1.elasticbeanstalk.com", "eu-west-1.elasticbeanstalk.com", "eu-west-2.elasticbeanstalk.com", "eu-west-3.elasticbeanstalk.com", "il-central-1.elasticbeanstalk.com", "me-south-1.elasticbeanstalk.com", "sa-east-1.elasticbeanstalk.com", "us-east-1.elasticbeanstalk.com", "us-east-2.elasticbeanstalk.com", "us-gov-east-1.elasticbeanstalk.com", "us-gov-west-1.elasticbeanstalk.com", "us-west-1.elasticbeanstalk.com", "us-west-2.elasticbeanstalk.com", "*.elb.amazonaws.com.cn", "*.elb.amazonaws.com", "awsglobalaccelerator.com", "*.private.repost.aws", "eero.online", "eero-stage.online", "apigee.io", "panel.dev", "siiites.com", "appspacehosted.com", "appspaceusercontent.com", "appudo.net", "on-aptible.com", "f5.si", "arvanedge.ir", "user.aseinet.ne.jp", "gv.vc", "d.gv.vc", "user.party.eus", "pimienta.org", "poivron.org", "potager.org", "sweetpepper.org", "myasustor.com", "cdn.prod.atlassian-dev.net", "translated.page", "myfritz.link", "myfritz.net", "onavstack.net", "*.awdev.ca", "*.advisor.ws", "ecommerce-shop.pl", "b-data.io", "balena-devices.com", "base.ec", "official.ec", "buyshop.jp", "fashionstore.jp", "handcrafted.jp", "kawaiishop.jp", "supersale.jp", "theshop.jp", "shopselect.net", "base.shop", "beagleboard.io", "*.beget.app", "pages.gay", "bnr.la", "bitbucket.io", "blackbaudcdn.net", "of.je", "bluebite.io", "boomla.net", "boutir.com", "boxfuse.io", "square7.ch", "bplaced.com", "bplaced.de", "square7.de", "bplaced.net", "square7.net", "*.s.brave.io", "shop.brendly.hr", "shop.brendly.rs", "browsersafetymark.io", "radio.am", "radio.fm", "uk0.bigv.io", "dh.bytemark.co.uk", "vm.bytemark.co.uk", "cafjs.com", "canva-apps.cn", "*.my.canvasite.cn", "canva-apps.com", "*.my.canva.site", "drr.ac", "uwu.ai", "carrd.co", "crd.co", "ju.mp", "api.gov.uk", "cdn77-storage.com", "rsc.contentproxy9.cz", "r.cdn77.net", "cdn77-ssl.net", "c.cdn77.org", "rsc.cdn77.org", "ssl.origin.cdn77-secure.org", "za.bz", "br.com", "cn.com", "de.com", "eu.com", "jpn.com", "mex.com", "ru.com", "sa.com", "uk.com", "us.com", "za.com", "com.de", "gb.net", "hu.net", "jp.net", "se.net", "uk.net", "ae.org", "com.se", "cx.ua", "discourse.group", "discourse.team", "clerk.app", "clerkstage.app", "*.lcl.dev", "*.lclstage.dev", "*.stg.dev", "*.stgstage.dev", "cleverapps.cc", "*.services.clever-cloud.com", "cleverapps.io", "cleverapps.tech", "clickrising.net", "cloudns.asia", "cloudns.be", "cloud-ip.biz", "cloudns.biz", "cloudns.cc", "cloudns.ch", "cloudns.cl", "cloudns.club", "dnsabr.com", "ip-ddns.com", "cloudns.cx", "cloudns.eu", "cloudns.in", "cloudns.info", "ddns-ip.net", "dns-cloud.net", "dns-dynamic.net", "cloudns.nz", "cloudns.org", "ip-dynamic.org", "cloudns.ph", "cloudns.pro", "cloudns.pw", "cloudns.us", "c66.me", "cloud66.ws", "cloud66.zone", "jdevcloud.com", "wpdevcloud.com", "cloudaccess.host", "freesite.host", "cloudaccess.net", "*.cloudera.site", "cf-ipfs.com", "cloudflare-ipfs.com", "trycloudflare.com", "pages.dev", "r2.dev", "workers.dev", "cloudflare.net", "cdn.cloudflare.net", "cdn.cloudflareanycast.net", "cdn.cloudflarecn.net", "cdn.cloudflareglobal.net", "cust.cloudscale.ch", "objects.lpg.cloudscale.ch", "objects.rma.cloudscale.ch", "wnext.app", "cnpy.gdn", "*.otap.co", "co.ca", "co.com", "codeberg.page", "csb.app", "preview.csb.app", "co.nl", "co.no", "webhosting.be", "hosting-cluster.nl", "ctfcloud.net", "convex.site", "ac.ru", "edu.ru", "gov.ru", "int.ru", "mil.ru", "test.ru", "dyn.cosidns.de", "dnsupdater.de", "dynamisches-dns.de", "internet-dns.de", "l-o-g-i-n.de", "dynamic-dns.info", "feste-ip.net", "knx-server.net", "static-access.net", "craft.me", "realm.cz", "on.crisp.email", "*.cryptonomic.net", "curv.dev", "cfolks.pl", "cyon.link", "cyon.site", "platform0.app", "fnwk.site", "folionetwork.site", "biz.dk", "co.dk", "firm.dk", "reg.dk", "store.dk", "dyndns.dappnode.io", "builtwithdark.com", "darklang.io", "demo.datadetect.com", "instance.datadetect.com", "edgestack.me", "dattolocal.com", "dattorelay.com", "dattoweb.com", "mydatto.com", "dattolocal.net", "mydatto.net", "ddnss.de", "dyn.ddnss.de", "dyndns.ddnss.de", "dyn-ip24.de", "dyndns1.de", "home-webserver.de", "dyn.home-webserver.de", "myhome-server.de", "ddnss.org", "debian.net", "definima.io", "definima.net", "deno.dev", "deno-staging.dev", "dedyn.io", "deta.app", "deta.dev", "dfirma.pl", "dkonto.pl", "you2.pl", "ondigitalocean.app", "*.digitaloceanspaces.com", "us.kg", "rss.my.id", "diher.solutions", "discordsays.com", "discordsez.com", "jozi.biz", "dnshome.de", "online.th", "shop.th", "drayddns.com", "shoparena.pl", "dreamhosters.com", "durumis.com", "mydrobo.com", "drud.io", "drud.us", "duckdns.org", "dy.fi", "tunk.org", "dyndns.biz", "for-better.biz", "for-more.biz", "for-some.biz", "for-the.biz", "selfip.biz", "webhop.biz", "ftpaccess.cc", "game-server.cc", "myphotos.cc", "scrapping.cc", "blogdns.com", "cechire.com", "dnsalias.com", "dnsdojo.com", "doesntexist.com", "dontexist.com", "doomdns.com", "dyn-o-saur.com", "dynalias.com", "dyndns-at-home.com", "dyndns-at-work.com", "dyndns-blog.com", "dyndns-free.com", "dyndns-home.com", "dyndns-ip.com", "dyndns-mail.com", "dyndns-office.com", "dyndns-pics.com", "dyndns-remote.com", "dyndns-server.com", "dyndns-web.com", "dyndns-wiki.com", "dyndns-work.com", "est-a-la-maison.com", "est-a-la-masion.com", "est-le-patron.com", "est-mon-blogueur.com", "from-ak.com", "from-al.com", "from-ar.com", "from-ca.com", "from-ct.com", "from-dc.com", "from-de.com", "from-fl.com", "from-ga.com", "from-hi.com", "from-ia.com", "from-id.com", "from-il.com", "from-in.com", "from-ks.com", "from-ky.com", "from-ma.com", "from-md.com", "from-mi.com", "from-mn.com", "from-mo.com", "from-ms.com", "from-mt.com", "from-nc.com", "from-nd.com", "from-ne.com", "from-nh.com", "from-nj.com", "from-nm.com", "from-nv.com", "from-oh.com", "from-ok.com", "from-or.com", "from-pa.com", "from-pr.com", "from-ri.com", "from-sc.com", "from-sd.com", "from-tn.com", "from-tx.com", "from-ut.com", "from-va.com", "from-vt.com", "from-wa.com", "from-wi.com", "from-wv.com", "from-wy.com", "getmyip.com", "gotdns.com", "hobby-site.com", "homelinux.com", "homeunix.com", "iamallama.com", "is-a-anarchist.com", "is-a-blogger.com", "is-a-bookkeeper.com", "is-a-bulls-fan.com", "is-a-caterer.com", "is-a-chef.com", "is-a-conservative.com", "is-a-cpa.com", "is-a-cubicle-slave.com", "is-a-democrat.com", "is-a-designer.com", "is-a-doctor.com", "is-a-financialadvisor.com", "is-a-geek.com", "is-a-green.com", "is-a-guru.com", "is-a-hard-worker.com", "is-a-hunter.com", "is-a-landscaper.com", "is-a-lawyer.com", "is-a-liberal.com", "is-a-libertarian.com", "is-a-llama.com", "is-a-musician.com", "is-a-nascarfan.com", "is-a-nurse.com", "is-a-painter.com", "is-a-personaltrainer.com", "is-a-photographer.com", "is-a-player.com", "is-a-republican.com", "is-a-rockstar.com", "is-a-socialist.com", "is-a-student.com", "is-a-teacher.com", "is-a-techie.com", "is-a-therapist.com", "is-an-accountant.com", "is-an-actor.com", "is-an-actress.com", "is-an-anarchist.com", "is-an-artist.com", "is-an-engineer.com", "is-an-entertainer.com", "is-certified.com", "is-gone.com", "is-into-anime.com", "is-into-cars.com", "is-into-cartoons.com", "is-into-games.com", "is-leet.com", "is-not-certified.com", "is-slick.com", "is-uberleet.com", "is-with-theband.com", "isa-geek.com", "isa-hockeynut.com", "issmarterthanyou.com", "likes-pie.com", "likescandy.com", "neat-url.com", "saves-the-whales.com", "selfip.com", "sells-for-less.com", "sells-for-u.com", "servebbs.com", "simple-url.com", "space-to-rent.com", "teaches-yoga.com", "writesthisblog.com", "ath.cx", "fuettertdasnetz.de", "isteingeek.de", "istmein.de", "lebtimnetz.de", "leitungsen.de", "traeumtgerade.de", "barrel-of-knowledge.info", "barrell-of-knowledge.info", "dyndns.info", "for-our.info", "groks-the.info", "groks-this.info", "here-for-more.info", "knowsitall.info", "selfip.info", "webhop.info", "forgot.her.name", "forgot.his.name", "at-band-camp.net", "blogdns.net", "broke-it.net", "buyshouses.net", "dnsalias.net", "dnsdojo.net", "does-it.net", "dontexist.net", "dynalias.net", "dynathome.net", "endofinternet.net", "from-az.net", "from-co.net", "from-la.net", "from-ny.net", "gets-it.net", "ham-radio-op.net", "homeftp.net", "homeip.net", "homelinux.net", "homeunix.net", "in-the-band.net", "is-a-chef.net", "is-a-geek.net", "isa-geek.net", "kicks-ass.net", "office-on-the.net", "podzone.net", "scrapper-site.net", "selfip.net", "sells-it.net", "servebbs.net", "serveftp.net", "thruhere.net", "webhop.net", "merseine.nu", "mine.nu", "shacknet.nu", "blogdns.org", "blogsite.org", "boldlygoingnowhere.org", "dnsalias.org", "dnsdojo.org", "doesntexist.org", "dontexist.org", "doomdns.org", "dvrdns.org", "dynalias.org", "dyndns.org", "go.dyndns.org", "home.dyndns.org", "endofinternet.org", "endoftheinternet.org", "from-me.org", "game-host.org", "gotdns.org", "hobby-site.org", "homedns.org", "homeftp.org", "homelinux.org", "homeunix.org", "is-a-bruinsfan.org", "is-a-candidate.org", "is-a-celticsfan.org", "is-a-chef.org", "is-a-geek.org", "is-a-knight.org", "is-a-linux-user.org", "is-a-patsfan.org", "is-a-soxfan.org", "is-found.org", "is-lost.org", "is-saved.org", "is-very-bad.org", "is-very-evil.org", "is-very-good.org", "is-very-nice.org", "is-very-sweet.org", "isa-geek.org", "kicks-ass.org", "misconfused.org", "podzone.org", "readmyblog.org", "selfip.org", "sellsyourhome.org", "servebbs.org", "serveftp.org", "servegame.org", "stuff-4-sale.org", "webhop.org", "better-than.tv", "dyndns.tv", "on-the-web.tv", "worse-than.tv", "is-by.us", "land-4-sale.us", "stuff-4-sale.us", "dyndns.ws", "mypets.ws", "ddnsfree.com", "ddnsgeek.com", "giize.com", "gleeze.com", "kozow.com", "loseyourip.com", "ooguy.com", "theworkpc.com", "casacam.net", "dynu.net", "accesscam.org", "camdvr.org", "freeddns.org", "mywire.org", "webredirect.org", "myddns.rocks", "dynv6.net", "e4.cz", "easypanel.app", "easypanel.host", "*.ewp.live", "twmail.cc", "twmail.net", "twmail.org", "mymailer.com.tw", "url.tw", "at.emf.camp", "rt.ht", "elementor.cloud", "elementor.cool", "en-root.fr", "mytuleap.com", "tuleap-partners.com", "encr.app", "encoreapi.com", "eu.encoway.cloud", "eu.org", "al.eu.org", "asso.eu.org", "at.eu.org", "au.eu.org", "be.eu.org", "bg.eu.org", "ca.eu.org", "cd.eu.org", "ch.eu.org", "cn.eu.org", "cy.eu.org", "cz.eu.org", "de.eu.org", "dk.eu.org", "edu.eu.org", "ee.eu.org", "es.eu.org", "fi.eu.org", "fr.eu.org", "gr.eu.org", "hr.eu.org", "hu.eu.org", "ie.eu.org", "il.eu.org", "in.eu.org", "int.eu.org", "is.eu.org", "it.eu.org", "jp.eu.org", "kr.eu.org", "lt.eu.org", "lu.eu.org", "lv.eu.org", "me.eu.org", "mk.eu.org", "mt.eu.org", "my.eu.org", "net.eu.org", "ng.eu.org", "nl.eu.org", "no.eu.org", "nz.eu.org", "pl.eu.org", "pt.eu.org", "ro.eu.org", "ru.eu.org", "se.eu.org", "si.eu.org", "sk.eu.org", "tr.eu.org", "uk.eu.org", "us.eu.org", "eurodir.ru", "eu-1.evennode.com", "eu-2.evennode.com", "eu-3.evennode.com", "eu-4.evennode.com", "us-1.evennode.com", "us-2.evennode.com", "us-3.evennode.com", "us-4.evennode.com", "relay.evervault.app", "relay.evervault.dev", "expo.app", "staging.expo.app", "onfabrica.com", "ru.net", "adygeya.ru", "bashkiria.ru", "bir.ru", "cbg.ru", "com.ru", "dagestan.ru", "grozny.ru", "kalmykia.ru", "kustanai.ru", "marine.ru", "mordovia.ru", "msk.ru", "mytis.ru", "nalchik.ru", "nov.ru", "pyatigorsk.ru", "spb.ru", "vladikavkaz.ru", "vladimir.ru", "abkhazia.su", "adygeya.su", "aktyubinsk.su", "arkhangelsk.su", "armenia.su", "ashgabad.su", "azerbaijan.su", "balashov.su", "bashkiria.su", "bryansk.su", "bukhara.su", "chimkent.su", "dagestan.su", "east-kazakhstan.su", "exnet.su", "georgia.su", "grozny.su", "ivanovo.su", "jambyl.su", "kalmykia.su", "kaluga.su", "karacol.su", "karaganda.su", "karelia.su", "khakassia.su", "krasnodar.su", "kurgan.su", "kustanai.su", "lenug.su", "mangyshlak.su", "mordovia.su", "msk.su", "murmansk.su", "nalchik.su", "navoi.su", "north-kazakhstan.su", "nov.su", "obninsk.su", "penza.su", "pokrovsk.su", "sochi.su", "spb.su", "tashkent.su", "termez.su", "togliatti.su", "troitsk.su", "tselinograd.su", "tula.su", "tuva.su", "vladikavkaz.su", "vladimir.su", "vologda.su", "channelsdvr.net", "u.channelsdvr.net", "edgecompute.app", "fastly-edge.com", "fastly-terrarium.com", "freetls.fastly.net", "map.fastly.net", "a.prod.fastly.net", "global.prod.fastly.net", "a.ssl.fastly.net", "b.ssl.fastly.net", "global.ssl.fastly.net", "fastlylb.net", "map.fastlylb.net", "*.user.fm", "fastvps-server.com", "fastvps.host", "myfast.host", "fastvps.site", "myfast.space", "conn.uk", "copro.uk", "hosp.uk", "fedorainfracloud.org", "fedorapeople.org", "cloud.fedoraproject.org", "app.os.fedoraproject.org", "app.os.stg.fedoraproject.org", "mydobiss.com", "fh-muenster.io", "filegear.me", "firebaseapp.com", "fldrv.com", "flutterflow.app", "fly.dev", "shw.io", "edgeapp.net", "forgeblocks.com", "id.forgerock.io", "framer.ai", "framer.app", "framercanvas.com", "framer.media", "framer.photos", "framer.website", "framer.wiki", "0e.vc", "freebox-os.com", "freeboxos.com", "fbx-os.fr", "fbxos.fr", "freebox-os.fr", "freeboxos.fr", "freedesktop.org", "freemyip.com", "*.frusky.de", "wien.funkfeuer.at", "daemon.asia", "dix.asia", "mydns.bz", "0am.jp", "0g0.jp", "0j0.jp", "0t0.jp", "mydns.jp", "pgw.jp", "wjg.jp", "keyword-on.net", "live-on.net", "server-on.net", "mydns.tw", "mydns.vc", "*.futurecms.at", "*.ex.futurecms.at", "*.in.futurecms.at", "futurehosting.at", "futuremailing.at", "*.ex.ortsinfo.at", "*.kunden.ortsinfo.at", "*.statics.cloud", "aliases121.com", "campaign.gov.uk", "service.gov.uk", "independent-commission.uk", "independent-inquest.uk", "independent-inquiry.uk", "independent-panel.uk", "independent-review.uk", "public-inquiry.uk", "royal-commission.uk", "gehirn.ne.jp", "usercontent.jp", "gentapps.com", "gentlentapis.com", "lab.ms", "cdn-edges.net", "localcert.net", "localhostcert.net", "gsj.bz", "githubusercontent.com", "githubpreview.dev", "github.io", "gitlab.io", "gitapp.si", "gitpage.si", "glitch.me", "nog.community", "co.ro", "shop.ro", "lolipop.io", "angry.jp", "babyblue.jp", "babymilk.jp", "backdrop.jp", "bambina.jp", "bitter.jp", "blush.jp", "boo.jp", "boy.jp", "boyfriend.jp", "but.jp", "candypop.jp", "capoo.jp", "catfood.jp", "cheap.jp", "chicappa.jp", "chillout.jp", "chips.jp", "chowder.jp", "chu.jp", "ciao.jp", "cocotte.jp", "coolblog.jp", "cranky.jp", "cutegirl.jp", "daa.jp", "deca.jp", "deci.jp", "digick.jp", "egoism.jp", "fakefur.jp", "fem.jp", "flier.jp", "floppy.jp", "fool.jp", "frenchkiss.jp", "girlfriend.jp", "girly.jp", "gloomy.jp", "gonna.jp", "greater.jp", "hacca.jp", "heavy.jp", "her.jp", "hiho.jp", "hippy.jp", "holy.jp", "hungry.jp", "icurus.jp", "itigo.jp", "jellybean.jp", "kikirara.jp", "kill.jp", "kilo.jp", "kuron.jp", "littlestar.jp", "lolipopmc.jp", "lolitapunk.jp", "lomo.jp", "lovepop.jp", "lovesick.jp", "main.jp", "mods.jp", "mond.jp", "mongolian.jp", "moo.jp", "namaste.jp", "nikita.jp", "nobushi.jp", "noor.jp", "oops.jp", "parallel.jp", "parasite.jp", "pecori.jp", "peewee.jp", "penne.jp", "pepper.jp", "perma.jp", "pigboat.jp", "pinoko.jp", "punyu.jp", "pupu.jp", "pussycat.jp", "pya.jp", "raindrop.jp", "readymade.jp", "sadist.jp", "schoolbus.jp", "secret.jp", "staba.jp", "stripper.jp", "sub.jp", "sunnyday.jp", "thick.jp", "tonkotsu.jp", "under.jp", "upper.jp", "velvet.jp", "verse.jp", "versus.jp", "vivian.jp", "watson.jp", "weblike.jp", "whitesnow.jp", "zombie.jp", "heteml.net", "graphic.design", "goip.de", "blogspot.ae", "blogspot.al", "blogspot.am", "*.hosted.app", "*.run.app", "web.app", "blogspot.com.ar", "blogspot.co.at", "blogspot.com.au", "blogspot.ba", "blogspot.be", "blogspot.bg", "blogspot.bj", "blogspot.com.br", "blogspot.com.by", "blogspot.ca", "blogspot.cf", "blogspot.ch", "blogspot.cl", "blogspot.com.co", "*.0emm.com", "appspot.com", "*.r.appspot.com", "blogspot.com", "codespot.com", "googleapis.com", "googlecode.com", "pagespeedmobilizer.com", "withgoogle.com", "withyoutube.com", "blogspot.cv", "blogspot.com.cy", "blogspot.cz", "blogspot.de", "*.gateway.dev", "blogspot.dk", "blogspot.com.ee", "blogspot.com.eg", "blogspot.com.es", "blogspot.fi", "blogspot.fr", "cloud.goog", "translate.goog", "*.usercontent.goog", "blogspot.gr", "blogspot.hk", "blogspot.hr", "blogspot.hu", "blogspot.co.id", "blogspot.ie", "blogspot.co.il", "blogspot.in", "blogspot.is", "blogspot.it", "blogspot.jp", "blogspot.co.ke", "blogspot.kr", "blogspot.li", "blogspot.lt", "blogspot.lu", "blogspot.md", "blogspot.mk", "blogspot.com.mt", "blogspot.mx", "blogspot.my", "cloudfunctions.net", "blogspot.com.ng", "blogspot.nl", "blogspot.no", "blogspot.co.nz", "blogspot.pe", "blogspot.pt", "blogspot.qa", "blogspot.re", "blogspot.ro", "blogspot.rs", "blogspot.ru", "blogspot.se", "blogspot.sg", "blogspot.si", "blogspot.sk", "blogspot.sn", "blogspot.td", "blogspot.com.tr", "blogspot.tw", "blogspot.ug", "blogspot.co.uk", "blogspot.com.uy", "blogspot.vn", "blogspot.co.za", "goupile.fr", "pymnt.uk", "cloudapps.digital", "london.cloudapps.digital", "gov.nl", "grafana-dev.net", "grayjayleagues.com", "g\xFCnstigbestellen.de", "g\xFCnstigliefern.de", "fin.ci", "free.hr", "caa.li", "ua.rs", "conf.se", "h\xE4kkinen.fi", "hrsn.dev", "hashbang.sh", "hasura.app", "hasura-app.io", "hatenablog.com", "hatenadiary.com", "hateblo.jp", "hatenablog.jp", "hatenadiary.jp", "hatenadiary.org", "pages.it.hs-heilbronn.de", "pages-research.it.hs-heilbronn.de", "heiyu.space", "helioho.st", "heliohost.us", "hepforge.org", "herokuapp.com", "herokussl.com", "heyflow.page", "heyflow.site", "ravendb.cloud", "ravendb.community", "development.run", "ravendb.run", "homesklep.pl", "*.kin.one", "*.id.pub", "*.kin.pub", "secaas.hk", "hoplix.shop", "orx.biz", "biz.gl", "biz.ng", "co.biz.ng", "dl.biz.ng", "go.biz.ng", "lg.biz.ng", "on.biz.ng", "col.ng", "firm.ng", "gen.ng", "ltd.ng", "ngo.ng", "plc.ng", "ie.ua", "hostyhosting.io", "hf.space", "static.hf.space", "hypernode.io", "iobb.net", "co.cz", "*.moonscale.io", "moonscale.net", "gr.com", "iki.fi", "ibxos.it", "iliadboxos.it", "smushcdn.com", "wphostedmail.com", "wpmucdn.com", "tempurl.host", "wpmudev.host", "dyn-berlin.de", "in-berlin.de", "in-brb.de", "in-butter.de", "in-dsl.de", "in-vpn.de", "in-dsl.net", "in-vpn.net", "in-dsl.org", "in-vpn.org", "biz.at", "info.at", "info.cx", "ac.leg.br", "al.leg.br", "am.leg.br", "ap.leg.br", "ba.leg.br", "ce.leg.br", "df.leg.br", "es.leg.br", "go.leg.br", "ma.leg.br", "mg.leg.br", "ms.leg.br", "mt.leg.br", "pa.leg.br", "pb.leg.br", "pe.leg.br", "pi.leg.br", "pr.leg.br", "rj.leg.br", "rn.leg.br", "ro.leg.br", "rr.leg.br", "rs.leg.br", "sc.leg.br", "se.leg.br", "sp.leg.br", "to.leg.br", "pixolino.com", "na4u.ru", "apps-1and1.com", "live-website.com", "apps-1and1.net", "websitebuilder.online", "app-ionos.space", "iopsys.se", "*.dweb.link", "ipifony.net", "ir.md", "is-a-good.dev", "is-a.dev", "iservschule.de", "mein-iserv.de", "schulplattform.de", "schulserver.de", "test-iserv.de", "iserv.dev", "mel.cloudlets.com.au", "cloud.interhostsolutions.be", "alp1.ae.flow.ch", "appengine.flow.ch", "es-1.axarnet.cloud", "diadem.cloud", "vip.jelastic.cloud", "jele.cloud", "it1.eur.aruba.jenv-aruba.cloud", "it1.jenv-aruba.cloud", "keliweb.cloud", "cs.keliweb.cloud", "oxa.cloud", "tn.oxa.cloud", "uk.oxa.cloud", "primetel.cloud", "uk.primetel.cloud", "ca.reclaim.cloud", "uk.reclaim.cloud", "us.reclaim.cloud", "ch.trendhosting.cloud", "de.trendhosting.cloud", "jele.club", "dopaas.com", "paas.hosted-by-previder.com", "rag-cloud.hosteur.com", "rag-cloud-ch.hosteur.com", "jcloud.ik-server.com", "jcloud-ver-jpc.ik-server.com", "demo.jelastic.com", "paas.massivegrid.com", "jed.wafaicloud.com", "ryd.wafaicloud.com", "j.scaleforce.com.cy", "jelastic.dogado.eu", "fi.cloudplatform.fi", "demo.datacenter.fi", "paas.datacenter.fi", "jele.host", "mircloud.host", "paas.beebyte.io", "sekd1.beebyteapp.io", "jele.io", "jc.neen.it", "jcloud.kz", "cloudjiffy.net", "fra1-de.cloudjiffy.net", "west1-us.cloudjiffy.net", "jls-sto1.elastx.net", "jls-sto2.elastx.net", "jls-sto3.elastx.net", "fr-1.paas.massivegrid.net", "lon-1.paas.massivegrid.net", "lon-2.paas.massivegrid.net", "ny-1.paas.massivegrid.net", "ny-2.paas.massivegrid.net", "sg-1.paas.massivegrid.net", "jelastic.saveincloud.net", "nordeste-idc.saveincloud.net", "j.scaleforce.net", "sdscloud.pl", "unicloud.pl", "mircloud.ru", "enscaled.sg", "jele.site", "jelastic.team", "orangecloud.tn", "j.layershift.co.uk", "phx.enscaled.us", "mircloud.us", "myjino.ru", "*.hosting.myjino.ru", "*.landing.myjino.ru", "*.spectrum.myjino.ru", "*.vps.myjino.ru", "jotelulu.cloud", "webadorsite.com", "jouwweb.site", "*.cns.joyent.com", "*.triton.zone", "js.org", "kaas.gg", "khplay.nl", "kapsi.fi", "ezproxy.kuleuven.be", "kuleuven.cloud", "keymachine.de", "kinghost.net", "uni5.net", "knightpoint.systems", "koobin.events", "webthings.io", "krellian.net", "oya.to", "git-repos.de", "lcube-server.de", "svn-repos.de", "leadpages.co", "lpages.co", "lpusercontent.com", "lelux.site", "libp2p.direct", "runcontainers.dev", "co.business", "co.education", "co.events", "co.financial", "co.network", "co.place", "co.technology", "linkyard-cloud.ch", "linkyard.cloud", "members.linode.com", "*.nodebalancer.linode.com", "*.linodeobjects.com", "ip.linodeusercontent.com", "we.bs", "filegear-sg.me", "ggff.net", "*.user.localcert.dev", "lodz.pl", "pabianice.pl", "plock.pl", "sieradz.pl", "skierniewice.pl", "zgierz.pl", "loginline.app", "loginline.dev", "loginline.io", "loginline.services", "loginline.site", "lohmus.me", "servers.run", "krasnik.pl", "leczna.pl", "lubartow.pl", "lublin.pl", "poniatowa.pl", "swidnik.pl", "glug.org.uk", "lug.org.uk", "lugs.org.uk", "barsy.bg", "barsy.club", "barsycenter.com", "barsyonline.com", "barsy.de", "barsy.dev", "barsy.eu", "barsy.gr", "barsy.in", "barsy.info", "barsy.io", "barsy.me", "barsy.menu", "barsyonline.menu", "barsy.mobi", "barsy.net", "barsy.online", "barsy.org", "barsy.pro", "barsy.pub", "barsy.ro", "barsy.rs", "barsy.shop", "barsyonline.shop", "barsy.site", "barsy.store", "barsy.support", "barsy.uk", "barsy.co.uk", "barsyonline.co.uk", "*.magentosite.cloud", "hb.cldmail.ru", "matlab.cloud", "modelscape.com", "mwcloudnonprod.com", "polyspace.com", "mayfirst.info", "mayfirst.org", "mazeplay.com", "mcdir.me", "mcdir.ru", "vps.mcdir.ru", "mcpre.ru", "mediatech.by", "mediatech.dev", "hra.health", "medusajs.app", "miniserver.com", "memset.net", "messerli.app", "atmeta.com", "apps.fbsbx.com", "*.cloud.metacentrum.cz", "custom.metacentrum.cz", "flt.cloud.muni.cz", "usr.cloud.muni.cz", "meteorapp.com", "eu.meteorapp.com", "co.pl", "*.azurecontainer.io", "azure-api.net", "azure-mobile.net", "azureedge.net", "azurefd.net", "azurestaticapps.net", "1.azurestaticapps.net", "2.azurestaticapps.net", "3.azurestaticapps.net", "4.azurestaticapps.net", "5.azurestaticapps.net", "6.azurestaticapps.net", "7.azurestaticapps.net", "centralus.azurestaticapps.net", "eastasia.azurestaticapps.net", "eastus2.azurestaticapps.net", "westeurope.azurestaticapps.net", "westus2.azurestaticapps.net", "azurewebsites.net", "cloudapp.net", "trafficmanager.net", "blob.core.windows.net", "servicebus.windows.net", "routingthecloud.com", "sn.mynetname.net", "routingthecloud.net", "routingthecloud.org", "csx.cc", "mydbserver.com", "webspaceconfig.de", "mittwald.info", "mittwaldserver.info", "typo3server.info", "project.space", "modx.dev", "bmoattachments.org", "net.ru", "org.ru", "pp.ru", "hostedpi.com", "caracal.mythic-beasts.com", "customer.mythic-beasts.com", "fentiger.mythic-beasts.com", "lynx.mythic-beasts.com", "ocelot.mythic-beasts.com", "oncilla.mythic-beasts.com", "onza.mythic-beasts.com", "sphinx.mythic-beasts.com", "vs.mythic-beasts.com", "x.mythic-beasts.com", "yali.mythic-beasts.com", "cust.retrosnub.co.uk", "ui.nabu.casa", "cloud.nospamproxy.com", "netfy.app", "netlify.app", "4u.com", "nfshost.com", "ipfs.nftstorage.link", "ngo.us", "ngrok.app", "ngrok-free.app", "ngrok.dev", "ngrok-free.dev", "ngrok.io", "ap.ngrok.io", "au.ngrok.io", "eu.ngrok.io", "in.ngrok.io", "jp.ngrok.io", "sa.ngrok.io", "us.ngrok.io", "ngrok.pizza", "ngrok.pro", "torun.pl", "nh-serv.co.uk", "nimsite.uk", "mmafan.biz", "myftp.biz", "no-ip.biz", "no-ip.ca", "fantasyleague.cc", "gotdns.ch", "3utilities.com", "blogsyte.com", "ciscofreak.com", "damnserver.com", "ddnsking.com", "ditchyourip.com", "dnsiskinky.com", "dynns.com", "geekgalaxy.com", "health-carereform.com", "homesecuritymac.com", "homesecuritypc.com", "myactivedirectory.com", "mysecuritycamera.com", "myvnc.com", "net-freaks.com", "onthewifi.com", "point2this.com", "quicksytes.com", "securitytactics.com", "servebeer.com", "servecounterstrike.com", "serveexchange.com", "serveftp.com", "servegame.com", "servehalflife.com", "servehttp.com", "servehumour.com", "serveirc.com", "servemp3.com", "servep2p.com", "servepics.com", "servequake.com", "servesarcasm.com", "stufftoread.com", "unusualperson.com", "workisboring.com", "dvrcam.info", "ilovecollege.info", "no-ip.info", "brasilia.me", "ddns.me", "dnsfor.me", "hopto.me", "loginto.me", "noip.me", "webhop.me", "bounceme.net", "ddns.net", "eating-organic.net", "mydissent.net", "myeffect.net", "mymediapc.net", "mypsx.net", "mysecuritycamera.net", "nhlfan.net", "no-ip.net", "pgafan.net", "privatizehealthinsurance.net", "redirectme.net", "serveblog.net", "serveminecraft.net", "sytes.net", "cable-modem.org", "collegefan.org", "couchpotatofries.org", "hopto.org", "mlbfan.org", "myftp.org", "mysecuritycamera.org", "nflfan.org", "no-ip.org", "read-books.org", "ufcfan.org", "zapto.org", "no-ip.co.uk", "golffan.us", "noip.us", "pointto.us", "stage.nodeart.io", "*.developer.app", "noop.app", "*.northflank.app", "*.build.run", "*.code.run", "*.database.run", "*.migration.run", "noticeable.news", "notion.site", "dnsking.ch", "mypi.co", "n4t.co", "001www.com", "myiphost.com", "forumz.info", "soundcast.me", "tcp4.me", "dnsup.net", "hicam.net", "now-dns.net", "ownip.net", "vpndns.net", "dynserv.org", "now-dns.org", "x443.pw", "now-dns.top", "ntdll.top", "freeddns.us", "nsupdate.info", "nerdpol.ovh", "nyc.mn", "prvcy.page", "obl.ong", "observablehq.cloud", "static.observableusercontent.com", "omg.lol", "cloudycluster.net", "omniwe.site", "123webseite.at", "123website.be", "simplesite.com.br", "123website.ch", "simplesite.com", "123webseite.de", "123hjemmeside.dk", "123miweb.es", "123kotisivu.fi", "123siteweb.fr", "simplesite.gr", "123homepage.it", "123website.lu", "123website.nl", "123hjemmeside.no", "service.one", "simplesite.pl", "123paginaweb.pt", "123minsida.se", "is-a-fullstack.dev", "is-cool.dev", "is-not-a.dev", "localplayer.dev", "is-local.org", "opensocial.site", "opencraft.hosting", "16-b.it", "32-b.it", "64-b.it", "orsites.com", "operaunite.com", "*.customer-oci.com", "*.oci.customer-oci.com", "*.ocp.customer-oci.com", "*.ocs.customer-oci.com", "*.oraclecloudapps.com", "*.oraclegovcloudapps.com", "*.oraclegovcloudapps.uk", "tech.orange", "can.re", "authgear-staging.com", "authgearapps.com", "skygearapp.com", "outsystemscloud.com", "*.hosting.ovh.net", "*.webpaas.ovh.net", "ownprovider.com", "own.pm", "*.owo.codes", "ox.rs", "oy.lc", "pgfog.com", "pagexl.com", "gotpantheon.com", "pantheonsite.io", "*.paywhirl.com", "*.xmit.co", "xmit.dev", "madethis.site", "srv.us", "gh.srv.us", "gl.srv.us", "lk3.ru", "mypep.link", "perspecta.cloud", "on-web.fr", "*.upsun.app", "upsunapp.com", "ent.platform.sh", "eu.platform.sh", "us.platform.sh", "*.platformsh.site", "*.tst.site", "platter-app.com", "platter-app.dev", "platterp.us", "pley.games", "onporter.run", "co.bn", "postman-echo.com", "pstmn.io", "mock.pstmn.io", "httpbin.org", "prequalifyme.today", "xen.prgmr.com", "priv.at", "protonet.io", "chirurgiens-dentistes-en-france.fr", "byen.site", "pubtls.org", "pythonanywhere.com", "eu.pythonanywhere.com", "qa2.com", "qcx.io", "*.sys.qcx.io", "myqnapcloud.cn", "alpha-myqnapcloud.com", "dev-myqnapcloud.com", "mycloudnas.com", "mynascloud.com", "myqnapcloud.com", "qoto.io", "qualifioapp.com", "ladesk.com", "qbuser.com", "*.quipelements.com", "vapor.cloud", "vaporcloud.io", "rackmaze.com", "rackmaze.net", "cloudsite.builders", "myradweb.net", "servername.us", "web.in", "in.net", "myrdbx.io", "site.rb-hosting.io", "*.on-rancher.cloud", "*.on-k3s.io", "*.on-rio.io", "ravpage.co.il", "readthedocs-hosted.com", "readthedocs.io", "rhcloud.com", "instances.spawn.cc", "onrender.com", "app.render.com", "replit.app", "id.replit.app", "firewalledreplit.co", "id.firewalledreplit.co", "repl.co", "id.repl.co", "replit.dev", "archer.replit.dev", "bones.replit.dev", "canary.replit.dev", "global.replit.dev", "hacker.replit.dev", "id.replit.dev", "janeway.replit.dev", "kim.replit.dev", "kira.replit.dev", "kirk.replit.dev", "odo.replit.dev", "paris.replit.dev", "picard.replit.dev", "pike.replit.dev", "prerelease.replit.dev", "reed.replit.dev", "riker.replit.dev", "sisko.replit.dev", "spock.replit.dev", "staging.replit.dev", "sulu.replit.dev", "tarpit.replit.dev", "teams.replit.dev", "tucker.replit.dev", "wesley.replit.dev", "worf.replit.dev", "repl.run", "resindevice.io", "devices.resinstaging.io", "hzc.io", "adimo.co.uk", "itcouldbewor.se", "aus.basketball", "nz.basketball", "git-pages.rit.edu", "rocky.page", "rub.de", "ruhr-uni-bochum.de", "io.noc.ruhr-uni-bochum.de", "\u0431\u0438\u0437.\u0440\u0443\u0441", "\u043A\u043E\u043C.\u0440\u0443\u0441", "\u043A\u0440\u044B\u043C.\u0440\u0443\u0441", "\u043C\u0438\u0440.\u0440\u0443\u0441", "\u043C\u0441\u043A.\u0440\u0443\u0441", "\u043E\u0440\u0433.\u0440\u0443\u0441", "\u0441\u0430\u043C\u0430\u0440\u0430.\u0440\u0443\u0441", "\u0441\u043E\u0447\u0438.\u0440\u0443\u0441", "\u0441\u043F\u0431.\u0440\u0443\u0441", "\u044F.\u0440\u0443\u0441", "ras.ru", "nyat.app", "180r.com", "dojin.com", "sakuratan.com", "sakuraweb.com", "x0.com", "2-d.jp", "bona.jp", "crap.jp", "daynight.jp", "eek.jp", "flop.jp", "halfmoon.jp", "jeez.jp", "matrix.jp", "mimoza.jp", "ivory.ne.jp", "mail-box.ne.jp", "mints.ne.jp", "mokuren.ne.jp", "opal.ne.jp", "sakura.ne.jp", "sumomo.ne.jp", "topaz.ne.jp", "netgamers.jp", "nyanta.jp", "o0o0.jp", "rdy.jp", "rgr.jp", "rulez.jp", "s3.isk01.sakurastorage.jp", "s3.isk02.sakurastorage.jp", "saloon.jp", "sblo.jp", "skr.jp", "tank.jp", "uh-oh.jp", "undo.jp", "rs.webaccel.jp", "user.webaccel.jp", "websozai.jp", "xii.jp", "squares.net", "jpn.org", "kirara.st", "x0.to", "from.tv", "sakura.tv", "*.builder.code.com", "*.dev-builder.code.com", "*.stg-builder.code.com", "*.001.test.code-builder-stg.platform.salesforce.com", "*.d.crm.dev", "*.w.crm.dev", "*.wa.crm.dev", "*.wb.crm.dev", "*.wc.crm.dev", "*.wd.crm.dev", "*.we.crm.dev", "*.wf.crm.dev", "sandcats.io", "logoip.com", "logoip.de", "fr-par-1.baremetal.scw.cloud", "fr-par-2.baremetal.scw.cloud", "nl-ams-1.baremetal.scw.cloud", "cockpit.fr-par.scw.cloud", "fnc.fr-par.scw.cloud", "functions.fnc.fr-par.scw.cloud", "k8s.fr-par.scw.cloud", "nodes.k8s.fr-par.scw.cloud", "s3.fr-par.scw.cloud", "s3-website.fr-par.scw.cloud", "whm.fr-par.scw.cloud", "priv.instances.scw.cloud", "pub.instances.scw.cloud", "k8s.scw.cloud", "cockpit.nl-ams.scw.cloud", "k8s.nl-ams.scw.cloud", "nodes.k8s.nl-ams.scw.cloud", "s3.nl-ams.scw.cloud", "s3-website.nl-ams.scw.cloud", "whm.nl-ams.scw.cloud", "cockpit.pl-waw.scw.cloud", "k8s.pl-waw.scw.cloud", "nodes.k8s.pl-waw.scw.cloud", "s3.pl-waw.scw.cloud", "s3-website.pl-waw.scw.cloud", "scalebook.scw.cloud", "smartlabeling.scw.cloud", "dedibox.fr", "schokokeks.net", "gov.scot", "service.gov.scot", "scrysec.com", "client.scrypted.io", "firewall-gateway.com", "firewall-gateway.de", "my-gateway.de", "my-router.de", "spdns.de", "spdns.eu", "firewall-gateway.net", "my-firewall.org", "myfirewall.org", "spdns.org", "seidat.net", "sellfy.store", "minisite.ms", "senseering.net", "servebolt.cloud", "biz.ua", "co.ua", "pp.ua", "as.sh.cn", "sheezy.games", "shiftedit.io", "myshopblocks.com", "myshopify.com", "shopitsite.com", "shopware.shop", "shopware.store", "mo-siemens.io", "1kapp.com", "appchizi.com", "applinzi.com", "sinaapp.com", "vipsinaapp.com", "siteleaf.net", "small-web.org", "aeroport.fr", "avocat.fr", "chambagri.fr", "chirurgiens-dentistes.fr", "experts-comptables.fr", "medecin.fr", "notaires.fr", "pharmacien.fr", "port.fr", "veterinaire.fr", "vp4.me", "*.snowflake.app", "*.privatelink.snowflake.app", "streamlit.app", "streamlitapp.com", "try-snowplow.com", "mafelo.net", "playstation-cloud.com", "srht.site", "apps.lair.io", "*.stolos.io", "spacekit.io", "ind.mom", "customer.speedpartner.de", "myspreadshop.at", "myspreadshop.com.au", "myspreadshop.be", "myspreadshop.ca", "myspreadshop.ch", "myspreadshop.com", "myspreadshop.de", "myspreadshop.dk", "myspreadshop.es", "myspreadshop.fi", "myspreadshop.fr", "myspreadshop.ie", "myspreadshop.it", "myspreadshop.net", "myspreadshop.nl", "myspreadshop.no", "myspreadshop.pl", "myspreadshop.se", "myspreadshop.co.uk", "w-corp-staticblitz.com", "w-credentialless-staticblitz.com", "w-staticblitz.com", "stackhero-network.com", "runs.onstackit.cloud", "stackit.gg", "stackit.rocks", "stackit.run", "stackit.zone", "musician.io", "novecore.site", "api.stdlib.com", "feedback.ac", "forms.ac", "assessments.cx", "calculators.cx", "funnels.cx", "paynow.cx", "quizzes.cx", "researched.cx", "tests.cx", "surveys.so", "storebase.store", "storipress.app", "storj.farm", "strapiapp.com", "media.strapiapp.com", "vps-host.net", "atl.jelastic.vps-host.net", "njs.jelastic.vps-host.net", "ric.jelastic.vps-host.net", "streak-link.com", "streaklinks.com", "streakusercontent.com", "soc.srcf.net", "user.srcf.net", "utwente.io", "temp-dns.com", "supabase.co", "supabase.in", "supabase.net", "syncloud.it", "dscloud.biz", "direct.quickconnect.cn", "dsmynas.com", "familyds.com", "diskstation.me", "dscloud.me", "i234.me", "myds.me", "synology.me", "dscloud.mobi", "dsmynas.net", "familyds.net", "dsmynas.org", "familyds.org", "direct.quickconnect.to", "vpnplus.to", "mytabit.com", "mytabit.co.il", "tabitorder.co.il", "taifun-dns.de", "ts.net", "*.c.ts.net", "gda.pl", "gdansk.pl", "gdynia.pl", "med.pl", "sopot.pl", "taveusercontent.com", "p.tawk.email", "p.tawkto.email", "site.tb-hosting.com", "edugit.io", "s3.teckids.org", "telebit.app", "telebit.io", "*.telebit.xyz", "*.firenet.ch", "*.svc.firenet.ch", "reservd.com", "thingdustdata.com", "cust.dev.thingdust.io", "reservd.dev.thingdust.io", "cust.disrec.thingdust.io", "reservd.disrec.thingdust.io", "cust.prod.thingdust.io", "cust.testing.thingdust.io", "reservd.testing.thingdust.io", "tickets.io", "arvo.network", "azimuth.network", "tlon.network", "torproject.net", "pages.torproject.net", "townnews-staging.com", "12hp.at", "2ix.at", "4lima.at", "lima-city.at", "12hp.ch", "2ix.ch", "4lima.ch", "lima-city.ch", "trafficplex.cloud", "de.cool", "12hp.de", "2ix.de", "4lima.de", "lima-city.de", "1337.pictures", "clan.rip", "lima-city.rocks", "webspace.rocks", "lima.zone", "*.transurl.be", "*.transurl.eu", "site.transip.me", "*.transurl.nl", "tuxfamily.org", "dd-dns.de", "dray-dns.de", "draydns.de", "dyn-vpn.de", "dynvpn.de", "mein-vigor.de", "my-vigor.de", "my-wan.de", "syno-ds.de", "synology-diskstation.de", "synology-ds.de", "diskstation.eu", "diskstation.org", "typedream.app", "pro.typeform.com", "*.uberspace.de", "uber.space", "hk.com", "inc.hk", "ltd.hk", "hk.org", "it.com", "unison-services.cloud", "virtual-user.de", "virtualuser.de", "name.pm", "sch.tf", "biz.wf", "sch.wf", "org.yt", "rs.ba", "bielsko.pl", "upli.io", "urown.cloud", "dnsupdate.info", "us.org", "v.ua", "express.val.run", "web.val.run", "vercel.app", "v0.build", "vercel.dev", "vusercontent.net", "now.sh", "2038.io", "router.management", "v-info.info", "voorloper.cloud", "*.vultrobjects.com", "wafflecell.com", "webflow.io", "webflowtest.io", "*.webhare.dev", "bookonline.app", "hotelwithflight.com", "reserve-online.com", "reserve-online.net", "cprapid.com", "pleskns.com", "wp2.host", "pdns.page", "plesk.page", "wpsquared.site", "*.wadl.top", "remotewd.com", "box.ca", "pages.wiardweb.com", "toolforge.org", "wmcloud.org", "wmflabs.org", "wdh.app", "panel.gg", "daemon.panel.gg", "wixsite.com", "wixstudio.com", "editorx.io", "wixstudio.io", "wix.run", "messwithdns.com", "woltlab-demo.com", "myforum.community", "community-pro.de", "diskussionsbereich.de", "community-pro.net", "meinforum.net", "affinitylottery.org.uk", "raffleentry.org.uk", "weeklylottery.org.uk", "wpenginepowered.com", "js.wpenginepowered.com", "half.host", "xnbay.com", "u2.xnbay.com", "u2-local.xnbay.com", "cistron.nl", "demon.nl", "xs4all.space", "yandexcloud.net", "storage.yandexcloud.net", "website.yandexcloud.net", "official.academy", "yolasite.com", "yombo.me", "ynh.fr", "nohost.me", "noho.st", "za.net", "za.org", "zap.cloud", "zeabur.app", "bss.design", "basicserver.io", "virtualserver.io", "enterprisecloud.nu"];
      var Z = Y.reduce((e, s) => {
        const c = s.replace(/^(\*\.|\!)/, ""), o = A.toASCII(c), t = s.charAt(0);
        if (e.has(o)) throw new Error(`Multiple rules found for ${s} (${o})`);
        return e.set(o, { rule: s, suffix: c, punySuffix: o, wildcard: t === "*", exception: t === "!" }), e;
      }, /* @__PURE__ */ new Map());
      var aa = /* @__PURE__ */ __name((e) => {
        const c = A.toASCII(e).split(".");
        for (let o = 0; o < c.length; o++) {
          const t = c.slice(o).join("."), d = Z.get(t);
          if (d) return d;
        }
        return null;
      }, "aa");
      var H = { DOMAIN_TOO_SHORT: "Domain name too short.", DOMAIN_TOO_LONG: "Domain name too long. It should be no more than 255 chars.", LABEL_STARTS_WITH_DASH: "Domain name label can not start with a dash.", LABEL_ENDS_WITH_DASH: "Domain name label can not end with a dash.", LABEL_TOO_LONG: "Domain name label should be at most 63 chars long.", LABEL_TOO_SHORT: "Domain name label should be at least 1 character long.", LABEL_INVALID_CHARS: "Domain name label can only contain alphanumeric characters or dashes." };
      var oa = /* @__PURE__ */ __name((e) => {
        const s = A.toASCII(e);
        if (s.length < 1) return "DOMAIN_TOO_SHORT";
        if (s.length > 255) return "DOMAIN_TOO_LONG";
        const c = s.split(".");
        let o;
        for (let t = 0; t < c.length; ++t) {
          if (o = c[t], !o.length) return "LABEL_TOO_SHORT";
          if (o.length > 63) return "LABEL_TOO_LONG";
          if (o.charAt(0) === "-") return "LABEL_STARTS_WITH_DASH";
          if (o.charAt(o.length - 1) === "-") return "LABEL_ENDS_WITH_DASH";
          if (!/^[a-z0-9\-_]+$/.test(o)) return "LABEL_INVALID_CHARS";
        }
      }, "oa");
      var _ = /* @__PURE__ */ __name((e) => {
        if (typeof e != "string") throw new TypeError("Domain name must be a string.");
        let s = e.slice(0).toLowerCase();
        s.charAt(s.length - 1) === "." && (s = s.slice(0, s.length - 1));
        const c = oa(s);
        if (c) return { input: e, error: { message: H[c], code: c } };
        const o = { input: e, tld: null, sld: null, domain: null, subdomain: null, listed: false }, t = s.split(".");
        if (t[t.length - 1] === "local") return o;
        const d = /* @__PURE__ */ __name(() => (/xn--/.test(s) && (o.domain && (o.domain = A.toASCII(o.domain)), o.subdomain && (o.subdomain = A.toASCII(o.subdomain))), o), "d"), z = aa(s);
        if (!z) return t.length < 2 ? o : (o.tld = t.pop(), o.sld = t.pop(), o.domain = [o.sld, o.tld].join("."), t.length && (o.subdomain = t.pop()), d());
        o.listed = true;
        const y = z.suffix.split("."), g2 = t.slice(0, t.length - y.length);
        return z.exception && g2.push(y.shift()), o.tld = y.join("."), !g2.length || (z.wildcard && (y.unshift(g2.pop()), o.tld = y.join(".")), !g2.length) || (o.sld = g2.pop(), o.domain = [o.sld, o.tld].join("."), g2.length && (o.subdomain = g2.join("."))), d();
      }, "_");
      var N = /* @__PURE__ */ __name((e) => e && _(e).domain || null, "N");
      var R = /* @__PURE__ */ __name((e) => {
        const s = _(e);
        return !!(s.domain && s.listed);
      }, "R");
      var sa = { parse: _, get: N, isValid: R };
      exports.default = sa;
      exports.errorCodes = H;
      exports.get = N;
      exports.isValid = R;
      exports.parse = _;
    }
  });

  // node_modules/tough-cookie/lib/pubsuffix-psl.js
  var require_pubsuffix_psl = __commonJS({
    "node_modules/tough-cookie/lib/pubsuffix-psl.js"(exports) {
      "use strict";
      var psl = require_psl();
      var SPECIAL_USE_DOMAINS = [
        "local",
        "example",
        "invalid",
        "localhost",
        "test"
      ];
      var SPECIAL_TREATMENT_DOMAINS = ["localhost", "invalid"];
      function getPublicSuffix(domain, options = {}) {
        const domainParts = domain.split(".");
        const topLevelDomain = domainParts[domainParts.length - 1];
        const allowSpecialUseDomain = !!options.allowSpecialUseDomain;
        const ignoreError = !!options.ignoreError;
        if (allowSpecialUseDomain && SPECIAL_USE_DOMAINS.includes(topLevelDomain)) {
          if (domainParts.length > 1) {
            const secondLevelDomain = domainParts[domainParts.length - 2];
            return `${secondLevelDomain}.${topLevelDomain}`;
          } else if (SPECIAL_TREATMENT_DOMAINS.includes(topLevelDomain)) {
            return `${topLevelDomain}`;
          }
        }
        if (!ignoreError && SPECIAL_USE_DOMAINS.includes(topLevelDomain)) {
          throw new Error(
            `Cookie has domain set to the public suffix "${topLevelDomain}" which is a special use domain. To allow this, configure your CookieJar with {allowSpecialUseDomain:true, rejectPublicSuffixes: false}.`
          );
        }
        return psl.get(domain);
      }
      __name(getPublicSuffix, "getPublicSuffix");
      exports.getPublicSuffix = getPublicSuffix;
    }
  });

  // node_modules/tough-cookie/lib/store.js
  var require_store = __commonJS({
    "node_modules/tough-cookie/lib/store.js"(exports) {
      "use strict";
      var Store = class {
        static {
          __name(this, "Store");
        }
        constructor() {
          this.synchronous = false;
        }
        findCookie(domain, path, key, cb) {
          throw new Error("findCookie is not implemented");
        }
        findCookies(domain, path, allowSpecialUseDomain, cb) {
          throw new Error("findCookies is not implemented");
        }
        putCookie(cookie, cb) {
          throw new Error("putCookie is not implemented");
        }
        updateCookie(oldCookie, newCookie, cb) {
          throw new Error("updateCookie is not implemented");
        }
        removeCookie(domain, path, key, cb) {
          throw new Error("removeCookie is not implemented");
        }
        removeCookies(domain, path, cb) {
          throw new Error("removeCookies is not implemented");
        }
        removeAllCookies(cb) {
          throw new Error("removeAllCookies is not implemented");
        }
        getAllCookies(cb) {
          throw new Error(
            "getAllCookies is not implemented (therefore jar cannot be serialized)"
          );
        }
      };
      exports.Store = Store;
    }
  });

  // node_modules/tough-cookie/node_modules/universalify/index.js
  var require_universalify = __commonJS({
    "node_modules/tough-cookie/node_modules/universalify/index.js"(exports) {
      "use strict";
      exports.fromCallback = function(fn) {
        return Object.defineProperty(function() {
          if (typeof arguments[arguments.length - 1] === "function") fn.apply(this, arguments);
          else {
            return new Promise((resolve, reject) => {
              arguments[arguments.length] = (err2, res) => {
                if (err2) return reject(err2);
                resolve(res);
              };
              arguments.length++;
              fn.apply(this, arguments);
            });
          }
        }, "name", { value: fn.name });
      };
      exports.fromPromise = function(fn) {
        return Object.defineProperty(function() {
          const cb = arguments[arguments.length - 1];
          if (typeof cb !== "function") return fn.apply(this, arguments);
          else {
            delete arguments[arguments.length - 1];
            arguments.length--;
            fn.apply(this, arguments).then((r) => cb(null, r), cb);
          }
        }, "name", { value: fn.name });
      };
    }
  });

  // node_modules/tough-cookie/lib/permuteDomain.js
  var require_permuteDomain = __commonJS({
    "node_modules/tough-cookie/lib/permuteDomain.js"(exports) {
      "use strict";
      var pubsuffix = require_pubsuffix_psl();
      function permuteDomain(domain, allowSpecialUseDomain) {
        const pubSuf = pubsuffix.getPublicSuffix(domain, {
          allowSpecialUseDomain
        });
        if (!pubSuf) {
          return null;
        }
        if (pubSuf == domain) {
          return [domain];
        }
        if (domain.slice(-1) == ".") {
          domain = domain.slice(0, -1);
        }
        const prefix = domain.slice(0, -(pubSuf.length + 1));
        const parts = prefix.split(".").reverse();
        let cur = pubSuf;
        const permutations = [cur];
        while (parts.length) {
          cur = `${parts.shift()}.${cur}`;
          permutations.push(cur);
        }
        return permutations;
      }
      __name(permuteDomain, "permuteDomain");
      exports.permuteDomain = permuteDomain;
    }
  });

  // node_modules/tough-cookie/lib/pathMatch.js
  var require_pathMatch = __commonJS({
    "node_modules/tough-cookie/lib/pathMatch.js"(exports) {
      "use strict";
      function pathMatch(reqPath, cookiePath) {
        if (cookiePath === reqPath) {
          return true;
        }
        const idx = reqPath.indexOf(cookiePath);
        if (idx === 0) {
          if (cookiePath.substr(-1) === "/") {
            return true;
          }
          if (reqPath.substr(cookiePath.length, 1) === "/") {
            return true;
          }
        }
        return false;
      }
      __name(pathMatch, "pathMatch");
      exports.pathMatch = pathMatch;
    }
  });

  // node_modules/tough-cookie/lib/utilHelper.js
  var require_utilHelper = __commonJS({
    "node_modules/tough-cookie/lib/utilHelper.js"(exports) {
      "use strict";
      function requireUtil() {
        try {
          return __require("util");
        } catch (e) {
          return null;
        }
      }
      __name(requireUtil, "requireUtil");
      function lookupCustomInspectSymbol() {
        return Symbol.for("nodejs.util.inspect.custom");
      }
      __name(lookupCustomInspectSymbol, "lookupCustomInspectSymbol");
      function tryReadingCustomSymbolFromUtilInspect(options) {
        const _requireUtil = options.requireUtil || requireUtil;
        const util = _requireUtil();
        return util ? util.inspect.custom : null;
      }
      __name(tryReadingCustomSymbolFromUtilInspect, "tryReadingCustomSymbolFromUtilInspect");
      exports.getUtilInspect = /* @__PURE__ */ __name(function getUtilInspect(fallback, options = {}) {
        const _requireUtil = options.requireUtil || requireUtil;
        const util = _requireUtil();
        return /* @__PURE__ */ __name(function inspect(value, showHidden, depth) {
          return util ? util.inspect(value, showHidden, depth) : fallback(value);
        }, "inspect");
      }, "getUtilInspect");
      exports.getCustomInspectSymbol = /* @__PURE__ */ __name(function getCustomInspectSymbol(options = {}) {
        const _lookupCustomInspectSymbol = options.lookupCustomInspectSymbol || lookupCustomInspectSymbol;
        return _lookupCustomInspectSymbol() || tryReadingCustomSymbolFromUtilInspect(options);
      }, "getCustomInspectSymbol");
    }
  });

  // node_modules/tough-cookie/lib/memstore.js
  var require_memstore = __commonJS({
    "node_modules/tough-cookie/lib/memstore.js"(exports) {
      "use strict";
      var { fromCallback } = require_universalify();
      var Store = require_store().Store;
      var permuteDomain = require_permuteDomain().permuteDomain;
      var pathMatch = require_pathMatch().pathMatch;
      var { getCustomInspectSymbol, getUtilInspect } = require_utilHelper();
      var MemoryCookieStore = class extends Store {
        static {
          __name(this, "MemoryCookieStore");
        }
        constructor() {
          super();
          this.synchronous = true;
          this.idx = /* @__PURE__ */ Object.create(null);
          const customInspectSymbol = getCustomInspectSymbol();
          if (customInspectSymbol) {
            this[customInspectSymbol] = this.inspect;
          }
        }
        inspect() {
          const util = { inspect: getUtilInspect(inspectFallback) };
          return `{ idx: ${util.inspect(this.idx, false, 2)} }`;
        }
        findCookie(domain, path, key, cb) {
          if (!this.idx[domain]) {
            return cb(null, void 0);
          }
          if (!this.idx[domain][path]) {
            return cb(null, void 0);
          }
          return cb(null, this.idx[domain][path][key] || null);
        }
        findCookies(domain, path, allowSpecialUseDomain, cb) {
          const results = [];
          if (typeof allowSpecialUseDomain === "function") {
            cb = allowSpecialUseDomain;
            allowSpecialUseDomain = true;
          }
          if (!domain) {
            return cb(null, []);
          }
          let pathMatcher;
          if (!path) {
            pathMatcher = /* @__PURE__ */ __name(function matchAll(domainIndex) {
              for (const curPath in domainIndex) {
                const pathIndex = domainIndex[curPath];
                for (const key in pathIndex) {
                  results.push(pathIndex[key]);
                }
              }
            }, "matchAll");
          } else {
            pathMatcher = /* @__PURE__ */ __name(function matchRFC(domainIndex) {
              Object.keys(domainIndex).forEach((cookiePath) => {
                if (pathMatch(path, cookiePath)) {
                  const pathIndex = domainIndex[cookiePath];
                  for (const key in pathIndex) {
                    results.push(pathIndex[key]);
                  }
                }
              });
            }, "matchRFC");
          }
          const domains = permuteDomain(domain, allowSpecialUseDomain) || [domain];
          const idx = this.idx;
          domains.forEach((curDomain) => {
            const domainIndex = idx[curDomain];
            if (!domainIndex) {
              return;
            }
            pathMatcher(domainIndex);
          });
          cb(null, results);
        }
        putCookie(cookie, cb) {
          if (!this.idx[cookie.domain]) {
            this.idx[cookie.domain] = /* @__PURE__ */ Object.create(null);
          }
          if (!this.idx[cookie.domain][cookie.path]) {
            this.idx[cookie.domain][cookie.path] = /* @__PURE__ */ Object.create(null);
          }
          this.idx[cookie.domain][cookie.path][cookie.key] = cookie;
          cb(null);
        }
        updateCookie(oldCookie, newCookie, cb) {
          this.putCookie(newCookie, cb);
        }
        removeCookie(domain, path, key, cb) {
          if (this.idx[domain] && this.idx[domain][path] && this.idx[domain][path][key]) {
            delete this.idx[domain][path][key];
          }
          cb(null);
        }
        removeCookies(domain, path, cb) {
          if (this.idx[domain]) {
            if (path) {
              delete this.idx[domain][path];
            } else {
              delete this.idx[domain];
            }
          }
          return cb(null);
        }
        removeAllCookies(cb) {
          this.idx = /* @__PURE__ */ Object.create(null);
          return cb(null);
        }
        getAllCookies(cb) {
          const cookies = [];
          const idx = this.idx;
          const domains = Object.keys(idx);
          domains.forEach((domain) => {
            const paths = Object.keys(idx[domain]);
            paths.forEach((path) => {
              const keys = Object.keys(idx[domain][path]);
              keys.forEach((key) => {
                if (key !== null) {
                  cookies.push(idx[domain][path][key]);
                }
              });
            });
          });
          cookies.sort((a, b) => {
            return (a.creationIndex || 0) - (b.creationIndex || 0);
          });
          cb(null, cookies);
        }
      };
      [
        "findCookie",
        "findCookies",
        "putCookie",
        "updateCookie",
        "removeCookie",
        "removeCookies",
        "removeAllCookies",
        "getAllCookies"
      ].forEach((name) => {
        MemoryCookieStore.prototype[name] = fromCallback(
          MemoryCookieStore.prototype[name]
        );
      });
      exports.MemoryCookieStore = MemoryCookieStore;
      function inspectFallback(val) {
        const domains = Object.keys(val);
        if (domains.length === 0) {
          return "[Object: null prototype] {}";
        }
        let result = "[Object: null prototype] {\n";
        Object.keys(val).forEach((domain, i) => {
          result += formatDomain(domain, val[domain]);
          if (i < domains.length - 1) {
            result += ",";
          }
          result += "\n";
        });
        result += "}";
        return result;
      }
      __name(inspectFallback, "inspectFallback");
      function formatDomain(domainName, domainValue) {
        const indent = "  ";
        let result = `${indent}'${domainName}': [Object: null prototype] {
`;
        Object.keys(domainValue).forEach((path, i, paths) => {
          result += formatPath(path, domainValue[path]);
          if (i < paths.length - 1) {
            result += ",";
          }
          result += "\n";
        });
        result += `${indent}}`;
        return result;
      }
      __name(formatDomain, "formatDomain");
      function formatPath(pathName, pathValue) {
        const indent = "    ";
        let result = `${indent}'${pathName}': [Object: null prototype] {
`;
        Object.keys(pathValue).forEach((cookieName, i, cookieNames) => {
          const cookie = pathValue[cookieName];
          result += `      ${cookieName}: ${cookie.inspect()}`;
          if (i < cookieNames.length - 1) {
            result += ",";
          }
          result += "\n";
        });
        result += `${indent}}`;
        return result;
      }
      __name(formatPath, "formatPath");
      exports.inspectFallback = inspectFallback;
    }
  });

  // node_modules/tough-cookie/lib/validators.js
  var require_validators = __commonJS({
    "node_modules/tough-cookie/lib/validators.js"(exports) {
      "use strict";
      var toString2 = Object.prototype.toString;
      function isFunction(data) {
        return typeof data === "function";
      }
      __name(isFunction, "isFunction");
      function isNonEmptyString(data) {
        return isString2(data) && data !== "";
      }
      __name(isNonEmptyString, "isNonEmptyString");
      function isDate(data) {
        return isInstanceStrict(data, Date) && isInteger2(data.getTime());
      }
      __name(isDate, "isDate");
      function isEmptyString(data) {
        return data === "" || data instanceof String && data.toString() === "";
      }
      __name(isEmptyString, "isEmptyString");
      function isString2(data) {
        return typeof data === "string" || data instanceof String;
      }
      __name(isString2, "isString");
      function isObject3(data) {
        return toString2.call(data) === "[object Object]";
      }
      __name(isObject3, "isObject");
      function isInstanceStrict(data, prototype) {
        try {
          return data instanceof prototype;
        } catch (error2) {
          return false;
        }
      }
      __name(isInstanceStrict, "isInstanceStrict");
      function isUrlStringOrObject(data) {
        return isNonEmptyString(data) || isObject3(data) && "hostname" in data && "pathname" in data && "protocol" in data || isInstanceStrict(data, URL);
      }
      __name(isUrlStringOrObject, "isUrlStringOrObject");
      function isInteger2(data) {
        return typeof data === "number" && data % 1 === 0;
      }
      __name(isInteger2, "isInteger");
      function validate(bool, cb, options) {
        if (!isFunction(cb)) {
          options = cb;
          cb = null;
        }
        if (!isObject3(options)) options = { Error: "Failed Check" };
        if (!bool) {
          if (cb) {
            cb(new ParameterError(options));
          } else {
            throw new ParameterError(options);
          }
        }
      }
      __name(validate, "validate");
      var ParameterError = class extends Error {
        static {
          __name(this, "ParameterError");
        }
        constructor(...params) {
          super(...params);
        }
      };
      exports.ParameterError = ParameterError;
      exports.isFunction = isFunction;
      exports.isNonEmptyString = isNonEmptyString;
      exports.isDate = isDate;
      exports.isEmptyString = isEmptyString;
      exports.isString = isString2;
      exports.isObject = isObject3;
      exports.isUrlStringOrObject = isUrlStringOrObject;
      exports.validate = validate;
    }
  });

  // node_modules/tough-cookie/lib/version.js
  var require_version = __commonJS({
    "node_modules/tough-cookie/lib/version.js"(exports, module) {
      "use strict";
      module.exports = "4.1.4";
    }
  });

  // node_modules/tough-cookie/lib/cookie.js
  var require_cookie = __commonJS({
    "node_modules/tough-cookie/lib/cookie.js"(exports) {
      "use strict";
      var punycode2 = (init_punycode_es6(), __toCommonJS(punycode_es6_exports));
      var urlParse = require_url_parse();
      var pubsuffix = require_pubsuffix_psl();
      var Store = require_store().Store;
      var MemoryCookieStore = require_memstore().MemoryCookieStore;
      var pathMatch = require_pathMatch().pathMatch;
      var validators = require_validators();
      var VERSION = require_version();
      var { fromCallback } = require_universalify();
      var { getCustomInspectSymbol } = require_utilHelper();
      var COOKIE_OCTETS = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]+$/;
      var CONTROL_CHARS = /[\x00-\x1F]/;
      var TERMINATORS = ["\n", "\r", "\0"];
      var PATH_VALUE = /[\x20-\x3A\x3C-\x7E]+/;
      var DATE_DELIM = /[\x09\x20-\x2F\x3B-\x40\x5B-\x60\x7B-\x7E]/;
      var MONTH_TO_NUM = {
        jan: 0,
        feb: 1,
        mar: 2,
        apr: 3,
        may: 4,
        jun: 5,
        jul: 6,
        aug: 7,
        sep: 8,
        oct: 9,
        nov: 10,
        dec: 11
      };
      var MAX_TIME = 2147483647e3;
      var MIN_TIME = 0;
      var SAME_SITE_CONTEXT_VAL_ERR = 'Invalid sameSiteContext option for getCookies(); expected one of "strict", "lax", or "none"';
      function checkSameSiteContext(value) {
        validators.validate(validators.isNonEmptyString(value), value);
        const context = String(value).toLowerCase();
        if (context === "none" || context === "lax" || context === "strict") {
          return context;
        } else {
          return null;
        }
      }
      __name(checkSameSiteContext, "checkSameSiteContext");
      var PrefixSecurityEnum = Object.freeze({
        SILENT: "silent",
        STRICT: "strict",
        DISABLED: "unsafe-disabled"
      });
      var IP_REGEX_LOWERCASE = /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-f\d]{1,4}:){7}(?:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,2}|:)|(?:[a-f\d]{1,4}:){4}(?:(?::[a-f\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,3}|:)|(?:[a-f\d]{1,4}:){3}(?:(?::[a-f\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,4}|:)|(?:[a-f\d]{1,4}:){2}(?:(?::[a-f\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,5}|:)|(?:[a-f\d]{1,4}:){1}(?:(?::[a-f\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,6}|:)|(?::(?:(?::[a-f\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,7}|:)))$)/;
      var IP_V6_REGEX = `
\\[?(?:
(?:[a-fA-F\\d]{1,4}:){7}(?:[a-fA-F\\d]{1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|:[a-fA-F\\d]{1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,2}|:)|
(?:[a-fA-F\\d]{1,4}:){4}(?:(?::[a-fA-F\\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,3}|:)|
(?:[a-fA-F\\d]{1,4}:){3}(?:(?::[a-fA-F\\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){2}(?:(?::[a-fA-F\\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,5}|:)|
(?:[a-fA-F\\d]{1,4}:){1}(?:(?::[a-fA-F\\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,6}|:)|
(?::(?:(?::[a-fA-F\\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,7}|:))
)(?:%[0-9a-zA-Z]{1,})?\\]?
`.replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
      var IP_V6_REGEX_OBJECT = new RegExp(`^${IP_V6_REGEX}$`);
      function parseDigits(token, minDigits, maxDigits, trailingOK) {
        let count = 0;
        while (count < token.length) {
          const c = token.charCodeAt(count);
          if (c <= 47 || c >= 58) {
            break;
          }
          count++;
        }
        if (count < minDigits || count > maxDigits) {
          return null;
        }
        if (!trailingOK && count != token.length) {
          return null;
        }
        return parseInt(token.substr(0, count), 10);
      }
      __name(parseDigits, "parseDigits");
      function parseTime(token) {
        const parts = token.split(":");
        const result = [0, 0, 0];
        if (parts.length !== 3) {
          return null;
        }
        for (let i = 0; i < 3; i++) {
          const trailingOK = i == 2;
          const num = parseDigits(parts[i], 1, 2, trailingOK);
          if (num === null) {
            return null;
          }
          result[i] = num;
        }
        return result;
      }
      __name(parseTime, "parseTime");
      function parseMonth(token) {
        token = String(token).substr(0, 3).toLowerCase();
        const num = MONTH_TO_NUM[token];
        return num >= 0 ? num : null;
      }
      __name(parseMonth, "parseMonth");
      function parseDate(str) {
        if (!str) {
          return;
        }
        const tokens = str.split(DATE_DELIM);
        if (!tokens) {
          return;
        }
        let hour = null;
        let minute = null;
        let second = null;
        let dayOfMonth = null;
        let month = null;
        let year = null;
        for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i].trim();
          if (!token.length) {
            continue;
          }
          let result;
          if (second === null) {
            result = parseTime(token);
            if (result) {
              hour = result[0];
              minute = result[1];
              second = result[2];
              continue;
            }
          }
          if (dayOfMonth === null) {
            result = parseDigits(token, 1, 2, true);
            if (result !== null) {
              dayOfMonth = result;
              continue;
            }
          }
          if (month === null) {
            result = parseMonth(token);
            if (result !== null) {
              month = result;
              continue;
            }
          }
          if (year === null) {
            result = parseDigits(token, 2, 4, true);
            if (result !== null) {
              year = result;
              if (year >= 70 && year <= 99) {
                year += 1900;
              } else if (year >= 0 && year <= 69) {
                year += 2e3;
              }
            }
          }
        }
        if (dayOfMonth === null || month === null || year === null || second === null || dayOfMonth < 1 || dayOfMonth > 31 || year < 1601 || hour > 23 || minute > 59 || second > 59) {
          return;
        }
        return new Date(Date.UTC(year, month, dayOfMonth, hour, minute, second));
      }
      __name(parseDate, "parseDate");
      function formatDate(date) {
        validators.validate(validators.isDate(date), date);
        return date.toUTCString();
      }
      __name(formatDate, "formatDate");
      function canonicalDomain(str) {
        if (str == null) {
          return null;
        }
        str = str.trim().replace(/^\./, "");
        if (IP_V6_REGEX_OBJECT.test(str)) {
          str = str.replace("[", "").replace("]", "");
        }
        if (punycode2 && /[^\u0001-\u007f]/.test(str)) {
          str = punycode2.toASCII(str);
        }
        return str.toLowerCase();
      }
      __name(canonicalDomain, "canonicalDomain");
      function domainMatch(str, domStr, canonicalize) {
        if (str == null || domStr == null) {
          return null;
        }
        if (canonicalize !== false) {
          str = canonicalDomain(str);
          domStr = canonicalDomain(domStr);
        }
        if (str == domStr) {
          return true;
        }
        const idx = str.lastIndexOf(domStr);
        if (idx <= 0) {
          return false;
        }
        if (str.length !== domStr.length + idx) {
          return false;
        }
        if (str.substr(idx - 1, 1) !== ".") {
          return false;
        }
        if (IP_REGEX_LOWERCASE.test(str)) {
          return false;
        }
        return true;
      }
      __name(domainMatch, "domainMatch");
      function defaultPath(path) {
        if (!path || path.substr(0, 1) !== "/") {
          return "/";
        }
        if (path === "/") {
          return path;
        }
        const rightSlash = path.lastIndexOf("/");
        if (rightSlash === 0) {
          return "/";
        }
        return path.slice(0, rightSlash);
      }
      __name(defaultPath, "defaultPath");
      function trimTerminator(str) {
        if (validators.isEmptyString(str)) return str;
        for (let t = 0; t < TERMINATORS.length; t++) {
          const terminatorIdx = str.indexOf(TERMINATORS[t]);
          if (terminatorIdx !== -1) {
            str = str.substr(0, terminatorIdx);
          }
        }
        return str;
      }
      __name(trimTerminator, "trimTerminator");
      function parseCookiePair(cookiePair, looseMode) {
        cookiePair = trimTerminator(cookiePair);
        validators.validate(validators.isString(cookiePair), cookiePair);
        let firstEq = cookiePair.indexOf("=");
        if (looseMode) {
          if (firstEq === 0) {
            cookiePair = cookiePair.substr(1);
            firstEq = cookiePair.indexOf("=");
          }
        } else {
          if (firstEq <= 0) {
            return;
          }
        }
        let cookieName, cookieValue;
        if (firstEq <= 0) {
          cookieName = "";
          cookieValue = cookiePair.trim();
        } else {
          cookieName = cookiePair.substr(0, firstEq).trim();
          cookieValue = cookiePair.substr(firstEq + 1).trim();
        }
        if (CONTROL_CHARS.test(cookieName) || CONTROL_CHARS.test(cookieValue)) {
          return;
        }
        const c = new Cookie();
        c.key = cookieName;
        c.value = cookieValue;
        return c;
      }
      __name(parseCookiePair, "parseCookiePair");
      function parse3(str, options) {
        if (!options || typeof options !== "object") {
          options = {};
        }
        if (validators.isEmptyString(str) || !validators.isString(str)) {
          return null;
        }
        str = str.trim();
        const firstSemi = str.indexOf(";");
        const cookiePair = firstSemi === -1 ? str : str.substr(0, firstSemi);
        const c = parseCookiePair(cookiePair, !!options.loose);
        if (!c) {
          return;
        }
        if (firstSemi === -1) {
          return c;
        }
        const unparsed = str.slice(firstSemi + 1).trim();
        if (unparsed.length === 0) {
          return c;
        }
        const cookie_avs = unparsed.split(";");
        while (cookie_avs.length) {
          const av = cookie_avs.shift().trim();
          if (av.length === 0) {
            continue;
          }
          const av_sep = av.indexOf("=");
          let av_key, av_value;
          if (av_sep === -1) {
            av_key = av;
            av_value = null;
          } else {
            av_key = av.substr(0, av_sep);
            av_value = av.substr(av_sep + 1);
          }
          av_key = av_key.trim().toLowerCase();
          if (av_value) {
            av_value = av_value.trim();
          }
          switch (av_key) {
            case "expires":
              if (av_value) {
                const exp = parseDate(av_value);
                if (exp) {
                  c.expires = exp;
                }
              }
              break;
            case "max-age":
              if (av_value) {
                if (/^-?[0-9]+$/.test(av_value)) {
                  const delta = parseInt(av_value, 10);
                  c.setMaxAge(delta);
                }
              }
              break;
            case "domain":
              if (av_value) {
                const domain = av_value.trim().replace(/^\./, "");
                if (domain) {
                  c.domain = domain.toLowerCase();
                }
              }
              break;
            case "path":
              c.path = av_value && av_value[0] === "/" ? av_value : null;
              break;
            case "secure":
              c.secure = true;
              break;
            case "httponly":
              c.httpOnly = true;
              break;
            case "samesite":
              const enforcement = av_value ? av_value.toLowerCase() : "";
              switch (enforcement) {
                case "strict":
                  c.sameSite = "strict";
                  break;
                case "lax":
                  c.sameSite = "lax";
                  break;
                case "none":
                  c.sameSite = "none";
                  break;
                default:
                  c.sameSite = void 0;
                  break;
              }
              break;
            default:
              c.extensions = c.extensions || [];
              c.extensions.push(av);
              break;
          }
        }
        return c;
      }
      __name(parse3, "parse");
      function isSecurePrefixConditionMet(cookie) {
        validators.validate(validators.isObject(cookie), cookie);
        return !cookie.key.startsWith("__Secure-") || cookie.secure;
      }
      __name(isSecurePrefixConditionMet, "isSecurePrefixConditionMet");
      function isHostPrefixConditionMet(cookie) {
        validators.validate(validators.isObject(cookie));
        return !cookie.key.startsWith("__Host-") || cookie.secure && cookie.hostOnly && cookie.path != null && cookie.path === "/";
      }
      __name(isHostPrefixConditionMet, "isHostPrefixConditionMet");
      function jsonParse(str) {
        let obj;
        try {
          obj = JSON.parse(str);
        } catch (e) {
          return e;
        }
        return obj;
      }
      __name(jsonParse, "jsonParse");
      function fromJSON(str) {
        if (!str || validators.isEmptyString(str)) {
          return null;
        }
        let obj;
        if (typeof str === "string") {
          obj = jsonParse(str);
          if (obj instanceof Error) {
            return null;
          }
        } else {
          obj = str;
        }
        const c = new Cookie();
        for (let i = 0; i < Cookie.serializableProperties.length; i++) {
          const prop = Cookie.serializableProperties[i];
          if (obj[prop] === void 0 || obj[prop] === cookieDefaults[prop]) {
            continue;
          }
          if (prop === "expires" || prop === "creation" || prop === "lastAccessed") {
            if (obj[prop] === null) {
              c[prop] = null;
            } else {
              c[prop] = obj[prop] == "Infinity" ? "Infinity" : new Date(obj[prop]);
            }
          } else {
            c[prop] = obj[prop];
          }
        }
        return c;
      }
      __name(fromJSON, "fromJSON");
      function cookieCompare(a, b) {
        validators.validate(validators.isObject(a), a);
        validators.validate(validators.isObject(b), b);
        let cmp = 0;
        const aPathLen = a.path ? a.path.length : 0;
        const bPathLen = b.path ? b.path.length : 0;
        cmp = bPathLen - aPathLen;
        if (cmp !== 0) {
          return cmp;
        }
        const aTime = a.creation ? a.creation.getTime() : MAX_TIME;
        const bTime = b.creation ? b.creation.getTime() : MAX_TIME;
        cmp = aTime - bTime;
        if (cmp !== 0) {
          return cmp;
        }
        cmp = a.creationIndex - b.creationIndex;
        return cmp;
      }
      __name(cookieCompare, "cookieCompare");
      function permutePath(path) {
        validators.validate(validators.isString(path));
        if (path === "/") {
          return ["/"];
        }
        const permutations = [path];
        while (path.length > 1) {
          const lindex = path.lastIndexOf("/");
          if (lindex === 0) {
            break;
          }
          path = path.substr(0, lindex);
          permutations.push(path);
        }
        permutations.push("/");
        return permutations;
      }
      __name(permutePath, "permutePath");
      function getCookieContext(url) {
        if (url instanceof Object) {
          return url;
        }
        try {
          url = decodeURI(url);
        } catch (err2) {
        }
        return urlParse(url);
      }
      __name(getCookieContext, "getCookieContext");
      var cookieDefaults = {
        // the order in which the RFC has them:
        key: "",
        value: "",
        expires: "Infinity",
        maxAge: null,
        domain: null,
        path: null,
        secure: false,
        httpOnly: false,
        extensions: null,
        // set by the CookieJar:
        hostOnly: null,
        pathIsDefault: null,
        creation: null,
        lastAccessed: null,
        sameSite: void 0
      };
      var Cookie = class _Cookie {
        static {
          __name(this, "Cookie");
        }
        constructor(options = {}) {
          const customInspectSymbol = getCustomInspectSymbol();
          if (customInspectSymbol) {
            this[customInspectSymbol] = this.inspect;
          }
          Object.assign(this, cookieDefaults, options);
          this.creation = this.creation || /* @__PURE__ */ new Date();
          Object.defineProperty(this, "creationIndex", {
            configurable: false,
            enumerable: false,
            // important for assert.deepEqual checks
            writable: true,
            value: ++_Cookie.cookiesCreated
          });
        }
        inspect() {
          const now = Date.now();
          const hostOnly = this.hostOnly != null ? this.hostOnly : "?";
          const createAge = this.creation ? `${now - this.creation.getTime()}ms` : "?";
          const accessAge = this.lastAccessed ? `${now - this.lastAccessed.getTime()}ms` : "?";
          return `Cookie="${this.toString()}; hostOnly=${hostOnly}; aAge=${accessAge}; cAge=${createAge}"`;
        }
        toJSON() {
          const obj = {};
          for (const prop of _Cookie.serializableProperties) {
            if (this[prop] === cookieDefaults[prop]) {
              continue;
            }
            if (prop === "expires" || prop === "creation" || prop === "lastAccessed") {
              if (this[prop] === null) {
                obj[prop] = null;
              } else {
                obj[prop] = this[prop] == "Infinity" ? "Infinity" : this[prop].toISOString();
              }
            } else if (prop === "maxAge") {
              if (this[prop] !== null) {
                obj[prop] = this[prop] == Infinity || this[prop] == -Infinity ? this[prop].toString() : this[prop];
              }
            } else {
              if (this[prop] !== cookieDefaults[prop]) {
                obj[prop] = this[prop];
              }
            }
          }
          return obj;
        }
        clone() {
          return fromJSON(this.toJSON());
        }
        validate() {
          if (!COOKIE_OCTETS.test(this.value)) {
            return false;
          }
          if (this.expires != Infinity && !(this.expires instanceof Date) && !parseDate(this.expires)) {
            return false;
          }
          if (this.maxAge != null && this.maxAge <= 0) {
            return false;
          }
          if (this.path != null && !PATH_VALUE.test(this.path)) {
            return false;
          }
          const cdomain = this.cdomain();
          if (cdomain) {
            if (cdomain.match(/\.$/)) {
              return false;
            }
            const suffix = pubsuffix.getPublicSuffix(cdomain);
            if (suffix == null) {
              return false;
            }
          }
          return true;
        }
        setExpires(exp) {
          if (exp instanceof Date) {
            this.expires = exp;
          } else {
            this.expires = parseDate(exp) || "Infinity";
          }
        }
        setMaxAge(age) {
          if (age === Infinity || age === -Infinity) {
            this.maxAge = age.toString();
          } else {
            this.maxAge = age;
          }
        }
        cookieString() {
          let val = this.value;
          if (val == null) {
            val = "";
          }
          if (this.key === "") {
            return val;
          }
          return `${this.key}=${val}`;
        }
        // gives Set-Cookie header format
        toString() {
          let str = this.cookieString();
          if (this.expires != Infinity) {
            if (this.expires instanceof Date) {
              str += `; Expires=${formatDate(this.expires)}`;
            } else {
              str += `; Expires=${this.expires}`;
            }
          }
          if (this.maxAge != null && this.maxAge != Infinity) {
            str += `; Max-Age=${this.maxAge}`;
          }
          if (this.domain && !this.hostOnly) {
            str += `; Domain=${this.domain}`;
          }
          if (this.path) {
            str += `; Path=${this.path}`;
          }
          if (this.secure) {
            str += "; Secure";
          }
          if (this.httpOnly) {
            str += "; HttpOnly";
          }
          if (this.sameSite && this.sameSite !== "none") {
            const ssCanon = _Cookie.sameSiteCanonical[this.sameSite.toLowerCase()];
            str += `; SameSite=${ssCanon ? ssCanon : this.sameSite}`;
          }
          if (this.extensions) {
            this.extensions.forEach((ext) => {
              str += `; ${ext}`;
            });
          }
          return str;
        }
        // TTL() partially replaces the "expiry-time" parts of S5.3 step 3 (setCookie()
        // elsewhere)
        // S5.3 says to give the "latest representable date" for which we use Infinity
        // For "expired" we use 0
        TTL(now) {
          if (this.maxAge != null) {
            return this.maxAge <= 0 ? 0 : this.maxAge * 1e3;
          }
          let expires = this.expires;
          if (expires != Infinity) {
            if (!(expires instanceof Date)) {
              expires = parseDate(expires) || Infinity;
            }
            if (expires == Infinity) {
              return Infinity;
            }
            return expires.getTime() - (now || Date.now());
          }
          return Infinity;
        }
        // expiryTime() replaces the "expiry-time" parts of S5.3 step 3 (setCookie()
        // elsewhere)
        expiryTime(now) {
          if (this.maxAge != null) {
            const relativeTo = now || this.creation || /* @__PURE__ */ new Date();
            const age = this.maxAge <= 0 ? -Infinity : this.maxAge * 1e3;
            return relativeTo.getTime() + age;
          }
          if (this.expires == Infinity) {
            return Infinity;
          }
          return this.expires.getTime();
        }
        // expiryDate() replaces the "expiry-time" parts of S5.3 step 3 (setCookie()
        // elsewhere), except it returns a Date
        expiryDate(now) {
          const millisec = this.expiryTime(now);
          if (millisec == Infinity) {
            return new Date(MAX_TIME);
          } else if (millisec == -Infinity) {
            return new Date(MIN_TIME);
          } else {
            return new Date(millisec);
          }
        }
        // This replaces the "persistent-flag" parts of S5.3 step 3
        isPersistent() {
          return this.maxAge != null || this.expires != Infinity;
        }
        // Mostly S5.1.2 and S5.2.3:
        canonicalizedDomain() {
          if (this.domain == null) {
            return null;
          }
          return canonicalDomain(this.domain);
        }
        cdomain() {
          return this.canonicalizedDomain();
        }
      };
      Cookie.cookiesCreated = 0;
      Cookie.parse = parse3;
      Cookie.fromJSON = fromJSON;
      Cookie.serializableProperties = Object.keys(cookieDefaults);
      Cookie.sameSiteLevel = {
        strict: 3,
        lax: 2,
        none: 1
      };
      Cookie.sameSiteCanonical = {
        strict: "Strict",
        lax: "Lax"
      };
      function getNormalizedPrefixSecurity(prefixSecurity) {
        if (prefixSecurity != null) {
          const normalizedPrefixSecurity = prefixSecurity.toLowerCase();
          switch (normalizedPrefixSecurity) {
            case PrefixSecurityEnum.STRICT:
            case PrefixSecurityEnum.SILENT:
            case PrefixSecurityEnum.DISABLED:
              return normalizedPrefixSecurity;
          }
        }
        return PrefixSecurityEnum.SILENT;
      }
      __name(getNormalizedPrefixSecurity, "getNormalizedPrefixSecurity");
      var CookieJar2 = class _CookieJar {
        static {
          __name(this, "CookieJar");
        }
        constructor(store, options = { rejectPublicSuffixes: true }) {
          if (typeof options === "boolean") {
            options = { rejectPublicSuffixes: options };
          }
          validators.validate(validators.isObject(options), options);
          this.rejectPublicSuffixes = options.rejectPublicSuffixes;
          this.enableLooseMode = !!options.looseMode;
          this.allowSpecialUseDomain = typeof options.allowSpecialUseDomain === "boolean" ? options.allowSpecialUseDomain : true;
          this.store = store || new MemoryCookieStore();
          this.prefixSecurity = getNormalizedPrefixSecurity(options.prefixSecurity);
          this._cloneSync = syncWrap("clone");
          this._importCookiesSync = syncWrap("_importCookies");
          this.getCookiesSync = syncWrap("getCookies");
          this.getCookieStringSync = syncWrap("getCookieString");
          this.getSetCookieStringsSync = syncWrap("getSetCookieStrings");
          this.removeAllCookiesSync = syncWrap("removeAllCookies");
          this.setCookieSync = syncWrap("setCookie");
          this.serializeSync = syncWrap("serialize");
        }
        setCookie(cookie, url, options, cb) {
          validators.validate(validators.isUrlStringOrObject(url), cb, options);
          let err2;
          if (validators.isFunction(url)) {
            cb = url;
            return cb(new Error("No URL was specified"));
          }
          const context = getCookieContext(url);
          if (validators.isFunction(options)) {
            cb = options;
            options = {};
          }
          validators.validate(validators.isFunction(cb), cb);
          if (!validators.isNonEmptyString(cookie) && !validators.isObject(cookie) && cookie instanceof String && cookie.length == 0) {
            return cb(null);
          }
          const host = canonicalDomain(context.hostname);
          const loose = options.loose || this.enableLooseMode;
          let sameSiteContext = null;
          if (options.sameSiteContext) {
            sameSiteContext = checkSameSiteContext(options.sameSiteContext);
            if (!sameSiteContext) {
              return cb(new Error(SAME_SITE_CONTEXT_VAL_ERR));
            }
          }
          if (typeof cookie === "string" || cookie instanceof String) {
            cookie = Cookie.parse(cookie, { loose });
            if (!cookie) {
              err2 = new Error("Cookie failed to parse");
              return cb(options.ignoreError ? null : err2);
            }
          } else if (!(cookie instanceof Cookie)) {
            err2 = new Error(
              "First argument to setCookie must be a Cookie object or string"
            );
            return cb(options.ignoreError ? null : err2);
          }
          const now = options.now || /* @__PURE__ */ new Date();
          if (this.rejectPublicSuffixes && cookie.domain) {
            const suffix = pubsuffix.getPublicSuffix(cookie.cdomain(), {
              allowSpecialUseDomain: this.allowSpecialUseDomain,
              ignoreError: options.ignoreError
            });
            if (suffix == null && !IP_V6_REGEX_OBJECT.test(cookie.domain)) {
              err2 = new Error("Cookie has domain set to a public suffix");
              return cb(options.ignoreError ? null : err2);
            }
          }
          if (cookie.domain) {
            if (!domainMatch(host, cookie.cdomain(), false)) {
              err2 = new Error(
                `Cookie not in this host's domain. Cookie:${cookie.cdomain()} Request:${host}`
              );
              return cb(options.ignoreError ? null : err2);
            }
            if (cookie.hostOnly == null) {
              cookie.hostOnly = false;
            }
          } else {
            cookie.hostOnly = true;
            cookie.domain = host;
          }
          if (!cookie.path || cookie.path[0] !== "/") {
            cookie.path = defaultPath(context.pathname);
            cookie.pathIsDefault = true;
          }
          if (options.http === false && cookie.httpOnly) {
            err2 = new Error("Cookie is HttpOnly and this isn't an HTTP API");
            return cb(options.ignoreError ? null : err2);
          }
          if (cookie.sameSite !== "none" && cookie.sameSite !== void 0 && sameSiteContext) {
            if (sameSiteContext === "none") {
              err2 = new Error(
                "Cookie is SameSite but this is a cross-origin request"
              );
              return cb(options.ignoreError ? null : err2);
            }
          }
          const ignoreErrorForPrefixSecurity = this.prefixSecurity === PrefixSecurityEnum.SILENT;
          const prefixSecurityDisabled = this.prefixSecurity === PrefixSecurityEnum.DISABLED;
          if (!prefixSecurityDisabled) {
            let errorFound = false;
            let errorMsg;
            if (!isSecurePrefixConditionMet(cookie)) {
              errorFound = true;
              errorMsg = "Cookie has __Secure prefix but Secure attribute is not set";
            } else if (!isHostPrefixConditionMet(cookie)) {
              errorFound = true;
              errorMsg = "Cookie has __Host prefix but either Secure or HostOnly attribute is not set or Path is not '/'";
            }
            if (errorFound) {
              return cb(
                options.ignoreError || ignoreErrorForPrefixSecurity ? null : new Error(errorMsg)
              );
            }
          }
          const store = this.store;
          if (!store.updateCookie) {
            store.updateCookie = function(oldCookie, newCookie, cb2) {
              this.putCookie(newCookie, cb2);
            };
          }
          function withCookie(err3, oldCookie) {
            if (err3) {
              return cb(err3);
            }
            const next = /* @__PURE__ */ __name(function(err4) {
              if (err4) {
                return cb(err4);
              } else {
                cb(null, cookie);
              }
            }, "next");
            if (oldCookie) {
              if (options.http === false && oldCookie.httpOnly) {
                err3 = new Error("old Cookie is HttpOnly and this isn't an HTTP API");
                return cb(options.ignoreError ? null : err3);
              }
              cookie.creation = oldCookie.creation;
              cookie.creationIndex = oldCookie.creationIndex;
              cookie.lastAccessed = now;
              store.updateCookie(oldCookie, cookie, next);
            } else {
              cookie.creation = cookie.lastAccessed = now;
              store.putCookie(cookie, next);
            }
          }
          __name(withCookie, "withCookie");
          store.findCookie(cookie.domain, cookie.path, cookie.key, withCookie);
        }
        // RFC6365 S5.4
        getCookies(url, options, cb) {
          validators.validate(validators.isUrlStringOrObject(url), cb, url);
          const context = getCookieContext(url);
          if (validators.isFunction(options)) {
            cb = options;
            options = {};
          }
          validators.validate(validators.isObject(options), cb, options);
          validators.validate(validators.isFunction(cb), cb);
          const host = canonicalDomain(context.hostname);
          const path = context.pathname || "/";
          let secure = options.secure;
          if (secure == null && context.protocol && (context.protocol == "https:" || context.protocol == "wss:")) {
            secure = true;
          }
          let sameSiteLevel = 0;
          if (options.sameSiteContext) {
            const sameSiteContext = checkSameSiteContext(options.sameSiteContext);
            sameSiteLevel = Cookie.sameSiteLevel[sameSiteContext];
            if (!sameSiteLevel) {
              return cb(new Error(SAME_SITE_CONTEXT_VAL_ERR));
            }
          }
          let http = options.http;
          if (http == null) {
            http = true;
          }
          const now = options.now || Date.now();
          const expireCheck = options.expire !== false;
          const allPaths = !!options.allPaths;
          const store = this.store;
          function matchingCookie(c) {
            if (c.hostOnly) {
              if (c.domain != host) {
                return false;
              }
            } else {
              if (!domainMatch(host, c.domain, false)) {
                return false;
              }
            }
            if (!allPaths && !pathMatch(path, c.path)) {
              return false;
            }
            if (c.secure && !secure) {
              return false;
            }
            if (c.httpOnly && !http) {
              return false;
            }
            if (sameSiteLevel) {
              const cookieLevel = Cookie.sameSiteLevel[c.sameSite || "none"];
              if (cookieLevel > sameSiteLevel) {
                return false;
              }
            }
            if (expireCheck && c.expiryTime() <= now) {
              store.removeCookie(c.domain, c.path, c.key, () => {
              });
              return false;
            }
            return true;
          }
          __name(matchingCookie, "matchingCookie");
          store.findCookies(
            host,
            allPaths ? null : path,
            this.allowSpecialUseDomain,
            (err2, cookies) => {
              if (err2) {
                return cb(err2);
              }
              cookies = cookies.filter(matchingCookie);
              if (options.sort !== false) {
                cookies = cookies.sort(cookieCompare);
              }
              const now2 = /* @__PURE__ */ new Date();
              for (const cookie of cookies) {
                cookie.lastAccessed = now2;
              }
              cb(null, cookies);
            }
          );
        }
        getCookieString(...args) {
          const cb = args.pop();
          validators.validate(validators.isFunction(cb), cb);
          const next = /* @__PURE__ */ __name(function(err2, cookies) {
            if (err2) {
              cb(err2);
            } else {
              cb(
                null,
                cookies.sort(cookieCompare).map((c) => c.cookieString()).join("; ")
              );
            }
          }, "next");
          args.push(next);
          this.getCookies.apply(this, args);
        }
        getSetCookieStrings(...args) {
          const cb = args.pop();
          validators.validate(validators.isFunction(cb), cb);
          const next = /* @__PURE__ */ __name(function(err2, cookies) {
            if (err2) {
              cb(err2);
            } else {
              cb(
                null,
                cookies.map((c) => {
                  return c.toString();
                })
              );
            }
          }, "next");
          args.push(next);
          this.getCookies.apply(this, args);
        }
        serialize(cb) {
          validators.validate(validators.isFunction(cb), cb);
          let type = this.store.constructor.name;
          if (validators.isObject(type)) {
            type = null;
          }
          const serialized = {
            // The version of tough-cookie that serialized this jar. Generally a good
            // practice since future versions can make data import decisions based on
            // known past behavior. When/if this matters, use `semver`.
            version: `tough-cookie@${VERSION}`,
            // add the store type, to make humans happy:
            storeType: type,
            // CookieJar configuration:
            rejectPublicSuffixes: !!this.rejectPublicSuffixes,
            enableLooseMode: !!this.enableLooseMode,
            allowSpecialUseDomain: !!this.allowSpecialUseDomain,
            prefixSecurity: getNormalizedPrefixSecurity(this.prefixSecurity),
            // this gets filled from getAllCookies:
            cookies: []
          };
          if (!(this.store.getAllCookies && typeof this.store.getAllCookies === "function")) {
            return cb(
              new Error(
                "store does not support getAllCookies and cannot be serialized"
              )
            );
          }
          this.store.getAllCookies((err2, cookies) => {
            if (err2) {
              return cb(err2);
            }
            serialized.cookies = cookies.map((cookie) => {
              cookie = cookie instanceof Cookie ? cookie.toJSON() : cookie;
              delete cookie.creationIndex;
              return cookie;
            });
            return cb(null, serialized);
          });
        }
        toJSON() {
          return this.serializeSync();
        }
        // use the class method CookieJar.deserialize instead of calling this directly
        _importCookies(serialized, cb) {
          let cookies = serialized.cookies;
          if (!cookies || !Array.isArray(cookies)) {
            return cb(new Error("serialized jar has no cookies array"));
          }
          cookies = cookies.slice();
          const putNext = /* @__PURE__ */ __name((err2) => {
            if (err2) {
              return cb(err2);
            }
            if (!cookies.length) {
              return cb(err2, this);
            }
            let cookie;
            try {
              cookie = fromJSON(cookies.shift());
            } catch (e) {
              return cb(e);
            }
            if (cookie === null) {
              return putNext(null);
            }
            this.store.putCookie(cookie, putNext);
          }, "putNext");
          putNext();
        }
        clone(newStore, cb) {
          if (arguments.length === 1) {
            cb = newStore;
            newStore = null;
          }
          this.serialize((err2, serialized) => {
            if (err2) {
              return cb(err2);
            }
            _CookieJar.deserialize(serialized, newStore, cb);
          });
        }
        cloneSync(newStore) {
          if (arguments.length === 0) {
            return this._cloneSync();
          }
          if (!newStore.synchronous) {
            throw new Error(
              "CookieJar clone destination store is not synchronous; use async API instead."
            );
          }
          return this._cloneSync(newStore);
        }
        removeAllCookies(cb) {
          validators.validate(validators.isFunction(cb), cb);
          const store = this.store;
          if (typeof store.removeAllCookies === "function" && store.removeAllCookies !== Store.prototype.removeAllCookies) {
            return store.removeAllCookies(cb);
          }
          store.getAllCookies((err2, cookies) => {
            if (err2) {
              return cb(err2);
            }
            if (cookies.length === 0) {
              return cb(null);
            }
            let completedCount = 0;
            const removeErrors = [];
            function removeCookieCb(removeErr) {
              if (removeErr) {
                removeErrors.push(removeErr);
              }
              completedCount++;
              if (completedCount === cookies.length) {
                return cb(removeErrors.length ? removeErrors[0] : null);
              }
            }
            __name(removeCookieCb, "removeCookieCb");
            cookies.forEach((cookie) => {
              store.removeCookie(
                cookie.domain,
                cookie.path,
                cookie.key,
                removeCookieCb
              );
            });
          });
        }
        static deserialize(strOrObj, store, cb) {
          if (arguments.length !== 3) {
            cb = store;
            store = null;
          }
          validators.validate(validators.isFunction(cb), cb);
          let serialized;
          if (typeof strOrObj === "string") {
            serialized = jsonParse(strOrObj);
            if (serialized instanceof Error) {
              return cb(serialized);
            }
          } else {
            serialized = strOrObj;
          }
          const jar = new _CookieJar(store, {
            rejectPublicSuffixes: serialized.rejectPublicSuffixes,
            looseMode: serialized.enableLooseMode,
            allowSpecialUseDomain: serialized.allowSpecialUseDomain,
            prefixSecurity: serialized.prefixSecurity
          });
          jar._importCookies(serialized, (err2) => {
            if (err2) {
              return cb(err2);
            }
            cb(null, jar);
          });
        }
        static deserializeSync(strOrObj, store) {
          const serialized = typeof strOrObj === "string" ? JSON.parse(strOrObj) : strOrObj;
          const jar = new _CookieJar(store, {
            rejectPublicSuffixes: serialized.rejectPublicSuffixes,
            looseMode: serialized.enableLooseMode
          });
          if (!jar.store.synchronous) {
            throw new Error(
              "CookieJar store is not synchronous; use async API instead."
            );
          }
          jar._importCookiesSync(serialized);
          return jar;
        }
      };
      CookieJar2.fromJSON = CookieJar2.deserializeSync;
      [
        "_importCookies",
        "clone",
        "getCookies",
        "getCookieString",
        "getSetCookieStrings",
        "removeAllCookies",
        "serialize",
        "setCookie"
      ].forEach((name) => {
        CookieJar2.prototype[name] = fromCallback(CookieJar2.prototype[name]);
      });
      CookieJar2.deserialize = fromCallback(CookieJar2.deserialize);
      function syncWrap(method) {
        return function(...args) {
          if (!this.store.synchronous) {
            throw new Error(
              "CookieJar store is not synchronous; use async API instead."
            );
          }
          let syncErr, syncResult;
          this[method](...args, (err2, result) => {
            syncErr = err2;
            syncResult = result;
          });
          if (syncErr) {
            throw syncErr;
          }
          return syncResult;
        };
      }
      __name(syncWrap, "syncWrap");
      exports.version = VERSION;
      exports.CookieJar = CookieJar2;
      exports.Cookie = Cookie;
      exports.Store = Store;
      exports.MemoryCookieStore = MemoryCookieStore;
      exports.parseDate = parseDate;
      exports.formatDate = formatDate;
      exports.parse = parse3;
      exports.fromJSON = fromJSON;
      exports.domainMatch = domainMatch;
      exports.defaultPath = defaultPath;
      exports.pathMatch = pathMatch;
      exports.getPublicSuffix = pubsuffix.getPublicSuffix;
      exports.cookieCompare = cookieCompare;
      exports.permuteDomain = require_permuteDomain().permuteDomain;
      exports.permutePath = permutePath;
      exports.canonicalDomain = canonicalDomain;
      exports.PrefixSecurityEnum = PrefixSecurityEnum;
      exports.ParameterError = validators.ParameterError;
    }
  });

  // node_modules/set-cookie-parser/lib/set-cookie.js
  var require_set_cookie = __commonJS({
    "node_modules/set-cookie-parser/lib/set-cookie.js"(exports, module) {
      "use strict";
      var defaultParseOptions = {
        decodeValues: true,
        map: false,
        silent: false
      };
      function isNonEmptyString(str) {
        return typeof str === "string" && !!str.trim();
      }
      __name(isNonEmptyString, "isNonEmptyString");
      function parseString(setCookieValue, options) {
        var parts = setCookieValue.split(";").filter(isNonEmptyString);
        var nameValuePairStr = parts.shift();
        var parsed = parseNameValuePair(nameValuePairStr);
        var name = parsed.name;
        var value = parsed.value;
        options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
        try {
          value = options.decodeValues ? decodeURIComponent(value) : value;
        } catch (e) {
          console.error(
            "set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.",
            e
          );
        }
        var cookie = {
          name,
          value
        };
        parts.forEach(function(part) {
          var sides = part.split("=");
          var key = sides.shift().trimLeft().toLowerCase();
          var value2 = sides.join("=");
          if (key === "expires") {
            cookie.expires = new Date(value2);
          } else if (key === "max-age") {
            cookie.maxAge = parseInt(value2, 10);
          } else if (key === "secure") {
            cookie.secure = true;
          } else if (key === "httponly") {
            cookie.httpOnly = true;
          } else if (key === "samesite") {
            cookie.sameSite = value2;
          } else if (key === "partitioned") {
            cookie.partitioned = true;
          } else {
            cookie[key] = value2;
          }
        });
        return cookie;
      }
      __name(parseString, "parseString");
      function parseNameValuePair(nameValuePairStr) {
        var name = "";
        var value = "";
        var nameValueArr = nameValuePairStr.split("=");
        if (nameValueArr.length > 1) {
          name = nameValueArr.shift();
          value = nameValueArr.join("=");
        } else {
          value = nameValuePairStr;
        }
        return { name, value };
      }
      __name(parseNameValuePair, "parseNameValuePair");
      function parse3(input, options) {
        options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
        if (!input) {
          if (!options.map) {
            return [];
          } else {
            return {};
          }
        }
        if (input.headers) {
          if (typeof input.headers.getSetCookie === "function") {
            input = input.headers.getSetCookie();
          } else if (input.headers["set-cookie"]) {
            input = input.headers["set-cookie"];
          } else {
            var sch = input.headers[Object.keys(input.headers).find(function(key) {
              return key.toLowerCase() === "set-cookie";
            })];
            if (!sch && input.headers.cookie && !options.silent) {
              console.warn(
                "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
              );
            }
            input = sch;
          }
        }
        if (!Array.isArray(input)) {
          input = [input];
        }
        if (!options.map) {
          return input.filter(isNonEmptyString).map(function(str) {
            return parseString(str, options);
          });
        } else {
          var cookies = {};
          return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
            var cookie = parseString(str, options);
            cookies2[cookie.name] = cookie;
            return cookies2;
          }, cookies);
        }
      }
      __name(parse3, "parse");
      function splitCookiesString2(cookiesString) {
        if (Array.isArray(cookiesString)) {
          return cookiesString;
        }
        if (typeof cookiesString !== "string") {
          return [];
        }
        var cookiesStrings = [];
        var pos = 0;
        var start;
        var ch;
        var lastComma;
        var nextStart;
        var cookiesSeparatorFound;
        function skipWhitespace() {
          while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
            pos += 1;
          }
          return pos < cookiesString.length;
        }
        __name(skipWhitespace, "skipWhitespace");
        function notSpecialChar() {
          ch = cookiesString.charAt(pos);
          return ch !== "=" && ch !== ";" && ch !== ",";
        }
        __name(notSpecialChar, "notSpecialChar");
        while (pos < cookiesString.length) {
          start = pos;
          cookiesSeparatorFound = false;
          while (skipWhitespace()) {
            ch = cookiesString.charAt(pos);
            if (ch === ",") {
              lastComma = pos;
              pos += 1;
              skipWhitespace();
              nextStart = pos;
              while (pos < cookiesString.length && notSpecialChar()) {
                pos += 1;
              }
              if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
                cookiesSeparatorFound = true;
                pos = nextStart;
                cookiesStrings.push(cookiesString.substring(start, lastComma));
                start = pos;
              } else {
                pos = lastComma + 1;
              }
            } else {
              pos += 1;
            }
          }
          if (!cookiesSeparatorFound || pos >= cookiesString.length) {
            cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
          }
        }
        return cookiesStrings;
      }
      __name(splitCookiesString2, "splitCookiesString");
      module.exports = parse3;
      module.exports.parse = parse3;
      module.exports.parseString = parseString;
      module.exports.splitCookiesString = splitCookiesString2;
    }
  });

  // node_modules/whatwg-fetch/fetch.js
  var fetch_exports = {};
  __export(fetch_exports, {
    DOMException: () => DOMException,
    Headers: () => Headers,
    Request: () => Request,
    Response: () => Response,
    fetch: () => fetch
  });
  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj);
  }
  function normalizeName(name) {
    if (typeof name !== "string") {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === "") {
      throw new TypeError('Invalid character in header field name: "' + name + '"');
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
      next: /* @__PURE__ */ __name(function() {
        var value = items.shift();
        return { done: value === void 0, value };
      }, "next")
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
        if (header.length != 2) {
          throw new TypeError("Headers constructor: expected name/value pair to be length 2, found" + header.length);
        }
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }
  function consumed(body) {
    if (body._noBody) return;
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
    var match = /charset=([A-Za-z0-9_-]+)/.exec(blob.type);
    var encoding = match ? match[1] : "utf-8";
    reader.readAsText(blob, encoding);
    return promise;
  }
  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);
    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
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
      this.bodyUsed = this.bodyUsed;
      this._bodyInit = body;
      if (!body) {
        this._noBody = true;
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
    }
    this.arrayBuffer = function() {
      if (this._bodyArrayBuffer) {
        var isConsumed = consumed(this);
        if (isConsumed) {
          return isConsumed;
        } else if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
          return Promise.resolve(
            this._bodyArrayBuffer.buffer.slice(
              this._bodyArrayBuffer.byteOffset,
              this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
            )
          );
        } else {
          return Promise.resolve(this._bodyArrayBuffer);
        }
      } else if (support.blob) {
        return this.blob().then(readBlobAsArrayBuffer);
      } else {
        throw new Error("could not read as ArrayBuffer");
      }
    };
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
        return this.text().then(decode2);
      };
    }
    this.json = function() {
      return this.text().then(JSON.parse);
    };
    return this;
  }
  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method;
  }
  function Request(input, options) {
    if (!(this instanceof Request)) {
      throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
    }
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
    this.signal = options.signal || this.signal || function() {
      if ("AbortController" in g) {
        var ctrl = new AbortController();
        return ctrl.signal;
      }
    }();
    this.referrer = null;
    if ((this.method === "GET" || this.method === "HEAD") && body) {
      throw new TypeError("Body not allowed for GET or HEAD requests");
    }
    this._initBody(body);
    if (this.method === "GET" || this.method === "HEAD") {
      if (options.cache === "no-store" || options.cache === "no-cache") {
        var reParamSearch = /([?&])_=[^&]*/;
        if (reParamSearch.test(this.url)) {
          this.url = this.url.replace(reParamSearch, "$1_=" + (/* @__PURE__ */ new Date()).getTime());
        } else {
          var reQueryString = /\?/;
          this.url += (reQueryString.test(this.url) ? "&" : "?") + "_=" + (/* @__PURE__ */ new Date()).getTime();
        }
      }
    }
  }
  function decode2(body) {
    var form = new FormData();
    body.trim().split("&").forEach(function(bytes) {
      if (bytes) {
        var split3 = bytes.split("=");
        var name = split3.shift().replace(/\+/g, " ");
        var value = split3.join("=").replace(/\+/g, " ");
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form;
  }
  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
    preProcessedHeaders.split("\r").map(function(header) {
      return header.indexOf("\n") === 0 ? header.substr(1, header.length) : header;
    }).forEach(function(line) {
      var parts = line.split(":");
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(":").trim();
        try {
          headers.append(key, value);
        } catch (error2) {
          console.warn("Response " + error2.message);
        }
      }
    });
    return headers;
  }
  function Response(bodyInit, options) {
    if (!(this instanceof Response)) {
      throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');
    }
    if (!options) {
      options = {};
    }
    this.type = "default";
    this.status = options.status === void 0 ? 200 : options.status;
    if (this.status < 200 || this.status > 599) {
      throw new RangeError("Failed to construct 'Response': The status provided (0) is outside the range [200, 599].");
    }
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = options.statusText === void 0 ? "" : "" + options.statusText;
    this.headers = new Headers(options.headers);
    this.url = options.url || "";
    this._initBody(bodyInit);
  }
  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);
      if (request.signal && request.signal.aborted) {
        return reject(new DOMException("Aborted", "AbortError"));
      }
      var xhr = new XMLHttpRequest();
      function abortXhr() {
        xhr.abort();
      }
      __name(abortXhr, "abortXhr");
      xhr.onload = function() {
        var options = {
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || "")
        };
        if (request.url.indexOf("file://") === 0 && (xhr.status < 200 || xhr.status > 599)) {
          options.status = 200;
        } else {
          options.status = xhr.status;
        }
        options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
        var body = "response" in xhr ? xhr.response : xhr.responseText;
        setTimeout(function() {
          resolve(new Response(body, options));
        }, 0);
      };
      xhr.onerror = function() {
        setTimeout(function() {
          reject(new TypeError("Network request failed"));
        }, 0);
      };
      xhr.ontimeout = function() {
        setTimeout(function() {
          reject(new TypeError("Network request timed out"));
        }, 0);
      };
      xhr.onabort = function() {
        setTimeout(function() {
          reject(new DOMException("Aborted", "AbortError"));
        }, 0);
      };
      function fixUrl(url) {
        try {
          return url === "" && g.location.href ? g.location.href : url;
        } catch (e) {
          return url;
        }
      }
      __name(fixUrl, "fixUrl");
      xhr.open(request.method, fixUrl(request.url), true);
      if (request.credentials === "include") {
        xhr.withCredentials = true;
      } else if (request.credentials === "omit") {
        xhr.withCredentials = false;
      }
      if ("responseType" in xhr) {
        if (support.blob) {
          xhr.responseType = "blob";
        } else if (support.arrayBuffer) {
          xhr.responseType = "arraybuffer";
        }
      }
      if (init && typeof init.headers === "object" && !(init.headers instanceof Headers || g.Headers && init.headers instanceof g.Headers)) {
        var names = [];
        Object.getOwnPropertyNames(init.headers).forEach(function(name) {
          names.push(normalizeName(name));
          xhr.setRequestHeader(name, normalizeValue(init.headers[name]));
        });
        request.headers.forEach(function(value, name) {
          if (names.indexOf(name) === -1) {
            xhr.setRequestHeader(name, value);
          }
        });
      } else {
        request.headers.forEach(function(value, name) {
          xhr.setRequestHeader(name, value);
        });
      }
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
  var g, support, viewClasses, isArrayBufferView, methods, redirectStatuses, DOMException;
  var init_fetch = __esm({
    "node_modules/whatwg-fetch/fetch.js"() {
      "use strict";
      g = typeof globalThis !== "undefined" && globalThis || typeof self !== "undefined" && self || // eslint-disable-next-line no-undef
      typeof global !== "undefined" && global || {};
      support = {
        searchParams: "URLSearchParams" in g,
        iterable: "Symbol" in g && "iterator" in Symbol,
        blob: "FileReader" in g && "Blob" in g && function() {
          try {
            new Blob();
            return true;
          } catch (e) {
            return false;
          }
        }(),
        formData: "FormData" in g,
        arrayBuffer: "ArrayBuffer" in g
      };
      __name(isDataView, "isDataView");
      if (support.arrayBuffer) {
        viewClasses = [
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
        isArrayBufferView = ArrayBuffer.isView || function(obj) {
          return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
        };
      }
      __name(normalizeName, "normalizeName");
      __name(normalizeValue, "normalizeValue");
      __name(iteratorFor, "iteratorFor");
      __name(Headers, "Headers");
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
      __name(consumed, "consumed");
      __name(fileReaderReady, "fileReaderReady");
      __name(readBlobAsArrayBuffer, "readBlobAsArrayBuffer");
      __name(readBlobAsText, "readBlobAsText");
      __name(readArrayBufferAsText, "readArrayBufferAsText");
      __name(bufferClone, "bufferClone");
      __name(Body, "Body");
      methods = ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"];
      __name(normalizeMethod, "normalizeMethod");
      __name(Request, "Request");
      Request.prototype.clone = function() {
        return new Request(this, { body: this._bodyInit });
      };
      __name(decode2, "decode");
      __name(parseHeaders, "parseHeaders");
      Body.call(Request.prototype);
      __name(Response, "Response");
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
        var response = new Response(null, { status: 200, statusText: "" });
        response.ok = false;
        response.status = 0;
        response.type = "error";
        return response;
      };
      redirectStatuses = [301, 302, 303, 307, 308];
      Response.redirect = function(url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
          throw new RangeError("Invalid status code");
        }
        return new Response(null, { status, headers: { location: url } });
      };
      DOMException = g.DOMException;
      try {
        new DOMException();
      } catch (err2) {
        DOMException = /* @__PURE__ */ __name(function(message, name) {
          this.message = message;
          this.name = name;
          var error2 = Error(message);
          this.stack = error2.stack;
        }, "DOMException");
        DOMException.prototype = Object.create(Error.prototype);
        DOMException.prototype.constructor = DOMException;
      }
      __name(fetch, "fetch");
      fetch.polyfill = true;
      if (!g.fetch) {
        g.fetch = fetch;
        g.Headers = Headers;
        g.Request = Request;
        g.Response = Response;
      }
    }
  });

  // node_modules/isomorphic-fetch/fetch-npm-browserify.js
  var require_fetch_npm_browserify = __commonJS({
    "node_modules/isomorphic-fetch/fetch-npm-browserify.js"(exports, module) {
      "use strict";
      init_fetch();
      module.exports = self.fetch.bind(self);
    }
  });

  // node_modules/mipd/dist/esm/utils.js
  function requestProviders(listener) {
    if (typeof window === "undefined")
      return;
    const handler = /* @__PURE__ */ __name((event) => listener(event.detail), "handler");
    window.addEventListener("eip6963:announceProvider", handler);
    window.dispatchEvent(new CustomEvent("eip6963:requestProvider"));
    return () => window.removeEventListener("eip6963:announceProvider", handler);
  }
  __name(requestProviders, "requestProviders");

  // node_modules/mipd/dist/esm/store.js
  function createStore() {
    const listeners = /* @__PURE__ */ new Set();
    let providerDetails = [];
    const request = /* @__PURE__ */ __name(() => requestProviders((providerDetail) => {
      if (providerDetails.some(({ info }) => info.uuid === providerDetail.info.uuid))
        return;
      providerDetails = [...providerDetails, providerDetail];
      listeners.forEach((listener) => listener(providerDetails, { added: [providerDetail] }));
    }), "request");
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
  __name(createStore, "createStore");

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
        version: wallet.info.icon,
        on: wallet.provider.on,
        off: wallet.provider.off
      };
      Wallets.push(walletWithStarknetKeys);
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

  // node_modules/@wallet-standard/features/lib/esm/connect.js
  var StandardConnect = "standard:connect";

  // node_modules/@wallet-standard/features/lib/esm/disconnect.js
  var StandardDisconnect = "standard:disconnect";

  // node_modules/@wallet-standard/features/lib/esm/events.js
  var StandardEvents = "standard:events";

  // src/wallet-standard/features.ts
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

  // node_modules/starknet-types-07/dist/esm/index.js
  var esm_exports = {};
  __export(esm_exports, {
    API: () => api_exports,
    EBlockTag: () => EBlockTag,
    EDAMode: () => EDAMode,
    EDataAvailabilityMode: () => EDataAvailabilityMode,
    ESimulationFlag: () => ESimulationFlag,
    ETransactionExecutionStatus: () => ETransactionExecutionStatus,
    ETransactionFinalityStatus: () => ETransactionFinalityStatus,
    ETransactionStatus: () => ETransactionStatus,
    ETransactionType: () => ETransactionType,
    ETransactionVersion: () => ETransactionVersion,
    ETransactionVersion2: () => ETransactionVersion2,
    ETransactionVersion3: () => ETransactionVersion3,
    Errors: () => errors_exports,
    Permission: () => Permission,
    SPEC: () => components_exports,
    TypedDataRevision: () => TypedDataRevision,
    WALLET_API: () => wallet_api_exports
  });

  // node_modules/starknet-types-07/dist/esm/api/index.js
  var api_exports = {};
  __export(api_exports, {
    EBlockTag: () => EBlockTag,
    EDAMode: () => EDAMode,
    EDataAvailabilityMode: () => EDataAvailabilityMode,
    ESimulationFlag: () => ESimulationFlag,
    ETransactionExecutionStatus: () => ETransactionExecutionStatus,
    ETransactionFinalityStatus: () => ETransactionFinalityStatus,
    ETransactionStatus: () => ETransactionStatus,
    ETransactionType: () => ETransactionType,
    ETransactionVersion: () => ETransactionVersion,
    ETransactionVersion2: () => ETransactionVersion2,
    ETransactionVersion3: () => ETransactionVersion3,
    Errors: () => errors_exports,
    SPEC: () => components_exports
  });

  // node_modules/starknet-types-07/dist/esm/api/errors.js
  var errors_exports = {};

  // node_modules/starknet-types-07/dist/esm/api/components.js
  var components_exports = {};

  // node_modules/starknet-types-07/dist/esm/api/nonspec.js
  var ETransactionType = {
    DECLARE: "DECLARE",
    DEPLOY: "DEPLOY",
    DEPLOY_ACCOUNT: "DEPLOY_ACCOUNT",
    INVOKE: "INVOKE",
    L1_HANDLER: "L1_HANDLER"
  };
  var ESimulationFlag = {
    SKIP_VALIDATE: "SKIP_VALIDATE",
    SKIP_FEE_CHARGE: "SKIP_FEE_CHARGE"
  };
  var ETransactionStatus = {
    RECEIVED: "RECEIVED",
    REJECTED: "REJECTED",
    ACCEPTED_ON_L2: "ACCEPTED_ON_L2",
    ACCEPTED_ON_L1: "ACCEPTED_ON_L1"
  };
  var ETransactionFinalityStatus = {
    ACCEPTED_ON_L2: "ACCEPTED_ON_L2",
    ACCEPTED_ON_L1: "ACCEPTED_ON_L1"
  };
  var ETransactionExecutionStatus = {
    SUCCEEDED: "SUCCEEDED",
    REVERTED: "REVERTED"
  };
  var EBlockTag = {
    LATEST: "latest",
    PENDING: "pending"
  };
  var EDataAvailabilityMode = {
    L1: "L1",
    L2: "L2"
  };
  var EDAMode = {
    L1: 0,
    L2: 1
  };
  var ETransactionVersion = {
    V0: "0x0",
    V1: "0x1",
    V2: "0x2",
    V3: "0x3",
    F0: "0x100000000000000000000000000000000",
    F1: "0x100000000000000000000000000000001",
    F2: "0x100000000000000000000000000000002",
    F3: "0x100000000000000000000000000000003"
  };
  var ETransactionVersion2 = {
    V0: "0x0",
    V1: "0x1",
    V2: "0x2",
    F0: "0x100000000000000000000000000000000",
    F1: "0x100000000000000000000000000000001",
    F2: "0x100000000000000000000000000000002"
  };
  var ETransactionVersion3 = {
    V3: "0x3",
    F3: "0x100000000000000000000000000000003"
  };

  // node_modules/starknet-types-07/dist/esm/wallet-api/index.js
  var wallet_api_exports = {};
  __export(wallet_api_exports, {
    Permission: () => Permission,
    TypedDataRevision: () => TypedDataRevision
  });

  // node_modules/starknet-types-07/dist/esm/wallet-api/constants.js
  var Permission = {
    ACCOUNTS: "accounts"
  };

  // node_modules/starknet-types-07/dist/esm/wallet-api/typedData.js
  var TypedDataRevision = {
    ACTIVE: "1",
    LEGACY: "0"
  };

  // node_modules/starknet/node_modules/@scure/base/lib/esm/index.js
  function isBytes(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  __name(isBytes, "isBytes");
  function isArrayOf(isString2, arr) {
    if (!Array.isArray(arr))
      return false;
    if (arr.length === 0)
      return true;
    if (isString2) {
      return arr.every((item) => typeof item === "string");
    } else {
      return arr.every((item) => Number.isSafeInteger(item));
    }
  }
  __name(isArrayOf, "isArrayOf");
  function astr(label, input) {
    if (typeof input !== "string")
      throw new Error(`${label}: string expected`);
    return true;
  }
  __name(astr, "astr");
  function anumber(n) {
    if (!Number.isSafeInteger(n))
      throw new Error(`invalid integer: ${n}`);
  }
  __name(anumber, "anumber");
  function aArr(input) {
    if (!Array.isArray(input))
      throw new Error("array expected");
  }
  __name(aArr, "aArr");
  function astrArr(label, input) {
    if (!isArrayOf(true, input))
      throw new Error(`${label}: array of strings expected`);
  }
  __name(astrArr, "astrArr");
  function anumArr(label, input) {
    if (!isArrayOf(false, input))
      throw new Error(`${label}: array of numbers expected`);
  }
  __name(anumArr, "anumArr");
  // @__NO_SIDE_EFFECTS__
  function chain(...args) {
    const id = /* @__PURE__ */ __name((a) => a, "id");
    const wrap = /* @__PURE__ */ __name((a, b) => (c) => a(b(c)), "wrap");
    const encode2 = args.map((x) => x.encode).reduceRight(wrap, id);
    const decode3 = args.map((x) => x.decode).reduce(wrap, id);
    return { encode: encode2, decode: decode3 };
  }
  __name(chain, "chain");
  // @__NO_SIDE_EFFECTS__
  function alphabet(letters) {
    const lettersA = typeof letters === "string" ? letters.split("") : letters;
    const len = lettersA.length;
    astrArr("alphabet", lettersA);
    const indexes = new Map(lettersA.map((l, i) => [l, i]));
    return {
      encode: /* @__PURE__ */ __name((digits) => {
        aArr(digits);
        return digits.map((i) => {
          if (!Number.isSafeInteger(i) || i < 0 || i >= len)
            throw new Error(`alphabet.encode: digit index outside alphabet "${i}". Allowed: ${letters}`);
          return lettersA[i];
        });
      }, "encode"),
      decode: /* @__PURE__ */ __name((input) => {
        aArr(input);
        return input.map((letter) => {
          astr("alphabet.decode", letter);
          const i = indexes.get(letter);
          if (i === void 0)
            throw new Error(`Unknown letter: "${letter}". Allowed: ${letters}`);
          return i;
        });
      }, "decode")
    };
  }
  __name(alphabet, "alphabet");
  // @__NO_SIDE_EFFECTS__
  function join(separator = "") {
    astr("join", separator);
    return {
      encode: /* @__PURE__ */ __name((from) => {
        astrArr("join.decode", from);
        return from.join(separator);
      }, "encode"),
      decode: /* @__PURE__ */ __name((to) => {
        astr("join.decode", to);
        return to.split(separator);
      }, "decode")
    };
  }
  __name(join, "join");
  // @__NO_SIDE_EFFECTS__
  function padding(bits, chr = "=") {
    anumber(bits);
    astr("padding", chr);
    return {
      encode(data) {
        astrArr("padding.encode", data);
        while (data.length * bits % 8)
          data.push(chr);
        return data;
      },
      decode(input) {
        astrArr("padding.decode", input);
        let end = input.length;
        if (end * bits % 8)
          throw new Error("padding: invalid, string should have whole number of bytes");
        for (; end > 0 && input[end - 1] === chr; end--) {
          const last = end - 1;
          const byte = last * bits;
          if (byte % 8 === 0)
            throw new Error("padding: invalid, string has too much padding");
        }
        return input.slice(0, end);
      }
    };
  }
  __name(padding, "padding");
  var gcd = /* @__PURE__ */ __name((a, b) => b === 0 ? a : gcd(b, a % b), "gcd");
  var radix2carry = /* @__PURE__ */ __name(/* @__NO_SIDE_EFFECTS__ */ (from, to) => from + (to - gcd(from, to)), "radix2carry");
  var powers = /* @__PURE__ */ (() => {
    let res = [];
    for (let i = 0; i < 40; i++)
      res.push(2 ** i);
    return res;
  })();
  function convertRadix2(data, from, to, padding2) {
    aArr(data);
    if (from <= 0 || from > 32)
      throw new Error(`convertRadix2: wrong from=${from}`);
    if (to <= 0 || to > 32)
      throw new Error(`convertRadix2: wrong to=${to}`);
    if (/* @__PURE__ */ radix2carry(from, to) > 32) {
      throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${/* @__PURE__ */ radix2carry(from, to)}`);
    }
    let carry = 0;
    let pos = 0;
    const max = powers[from];
    const mask = powers[to] - 1;
    const res = [];
    for (const n of data) {
      anumber(n);
      if (n >= max)
        throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
      carry = carry << from | n;
      if (pos + from > 32)
        throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
      pos += from;
      for (; pos >= to; pos -= to)
        res.push((carry >> pos - to & mask) >>> 0);
      const pow3 = powers[pos];
      if (pow3 === void 0)
        throw new Error("invalid carry");
      carry &= pow3 - 1;
    }
    carry = carry << to - pos & mask;
    if (!padding2 && pos >= from)
      throw new Error("Excess padding");
    if (!padding2 && carry > 0)
      throw new Error(`Non-zero padding: ${carry}`);
    if (padding2 && pos > 0)
      res.push(carry >>> 0);
    return res;
  }
  __name(convertRadix2, "convertRadix2");
  // @__NO_SIDE_EFFECTS__
  function radix2(bits, revPadding = false) {
    anumber(bits);
    if (bits <= 0 || bits > 32)
      throw new Error("radix2: bits should be in (0..32]");
    if (/* @__PURE__ */ radix2carry(8, bits) > 32 || /* @__PURE__ */ radix2carry(bits, 8) > 32)
      throw new Error("radix2: carry overflow");
    return {
      encode: /* @__PURE__ */ __name((bytes) => {
        if (!isBytes(bytes))
          throw new Error("radix2.encode input should be Uint8Array");
        return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
      }, "encode"),
      decode: /* @__PURE__ */ __name((digits) => {
        anumArr("radix2.decode", digits);
        return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
      }, "decode")
    };
  }
  __name(radix2, "radix2");
  var base64 = /* @__PURE__ */ chain(/* @__PURE__ */ radix2(6), /* @__PURE__ */ alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"), /* @__PURE__ */ padding(6), /* @__PURE__ */ join(""));

  // node_modules/lossless-json/lib/esm/utils.js
  function isInteger(value) {
    return INTEGER_REGEX.test(value);
  }
  __name(isInteger, "isInteger");
  var INTEGER_REGEX = /^-?[0-9]+$/;
  function isNumber(value) {
    return NUMBER_REGEX.test(value);
  }
  __name(isNumber, "isNumber");
  var NUMBER_REGEX = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;
  function isSafeNumber(value, config3) {
    const num = Number.parseFloat(value);
    const str = String(num);
    if (value === str) {
      return true;
    }
    const valueDigits = countSignificantDigits(value);
    const strDigits = countSignificantDigits(str);
    if (valueDigits === strDigits) {
      return true;
    }
    if (config3?.approx === true) {
      const requiredDigits = 14;
      if (strDigits >= requiredDigits && !isInteger(value)) {
        return true;
      }
    }
    return false;
  }
  __name(isSafeNumber, "isSafeNumber");
  var UnsafeNumberReason = /* @__PURE__ */ function(UnsafeNumberReason2) {
    UnsafeNumberReason2["underflow"] = "underflow";
    UnsafeNumberReason2["overflow"] = "overflow";
    UnsafeNumberReason2["truncate_integer"] = "truncate_integer";
    UnsafeNumberReason2["truncate_float"] = "truncate_float";
    return UnsafeNumberReason2;
  }({});
  function getUnsafeNumberReason(value) {
    if (isSafeNumber(value, {
      approx: false
    })) {
      return void 0;
    }
    if (isInteger(value)) {
      return UnsafeNumberReason.truncate_integer;
    }
    const num = Number.parseFloat(value);
    if (!Number.isFinite(num)) {
      return UnsafeNumberReason.overflow;
    }
    if (num === 0) {
      return UnsafeNumberReason.underflow;
    }
    return UnsafeNumberReason.truncate_float;
  }
  __name(getUnsafeNumberReason, "getUnsafeNumberReason");
  function countSignificantDigits(value) {
    let start = 0;
    if (value[0] === "-") {
      start++;
    }
    while (value[start] === "0" || value[start] === ".") {
      start++;
    }
    let end = value.lastIndexOf("e");
    if (end === -1) {
      end = value.lastIndexOf("E");
    }
    if (end === -1) {
      end = value.length;
    }
    while (value[end - 1] === "0" || value[end - 1] === ".") {
      end--;
    }
    let digits = end >= start ? end - start : 0;
    const dot = value.indexOf(".", start);
    if (dot !== -1 && dot < end) {
      digits--;
    }
    return digits;
  }
  __name(countSignificantDigits, "countSignificantDigits");

  // node_modules/lossless-json/lib/esm/LosslessNumber.js
  var LosslessNumber = class {
    static {
      __name(this, "LosslessNumber");
    }
    // numeric value as string
    // type information
    isLosslessNumber = true;
    constructor(value) {
      if (!isNumber(value)) {
        throw new Error(`Invalid number (value: "${value}")`);
      }
      this.value = value;
    }
    /**
     * Get the value of the LosslessNumber as number or bigint.
     *
     * - a number is returned for safe numbers and decimal values that only lose some insignificant digits
     * - a bigint is returned for big integer numbers
     * - an Error is thrown for values that will overflow or underflow
     *
     * Note that you can implement your own strategy for conversion by just getting the value as string
     * via .toString(), and using util functions like isInteger, isSafeNumber, getUnsafeNumberReason,
     * and toSafeNumberOrThrow to convert it to a numeric value.
     */
    valueOf() {
      const unsafeReason = getUnsafeNumberReason(this.value);
      if (unsafeReason === void 0 || unsafeReason === UnsafeNumberReason.truncate_float) {
        return Number.parseFloat(this.value);
      }
      if (isInteger(this.value)) {
        return BigInt(this.value);
      }
      throw new Error(`Cannot safely convert to number: the value '${this.value}' would ${unsafeReason} and become ${Number.parseFloat(this.value)}`);
    }
    /**
     * Get the value of the LosslessNumber as string.
     */
    toString() {
      return this.value;
    }
    // Note: we do NOT implement a .toJSON() method, and you should not implement
    // or use that, it cannot safely turn the numeric value in the string into
    // stringified JSON since it has to be parsed into a number first.
  };
  function isLosslessNumber(value) {
    return value && typeof value === "object" && value.isLosslessNumber || false;
  }
  __name(isLosslessNumber, "isLosslessNumber");

  // node_modules/lossless-json/lib/esm/numberParsers.js
  function parseLosslessNumber(value) {
    return new LosslessNumber(value);
  }
  __name(parseLosslessNumber, "parseLosslessNumber");
  function parseNumberAndBigInt(value) {
    return isInteger(value) ? BigInt(value) : Number.parseFloat(value);
  }
  __name(parseNumberAndBigInt, "parseNumberAndBigInt");

  // node_modules/lossless-json/lib/esm/revive.js
  function revive(json, reviver) {
    return reviveValue({
      "": json
    }, "", json, reviver);
  }
  __name(revive, "revive");
  function reviveValue(context, key, value, reviver) {
    if (Array.isArray(value)) {
      return reviver.call(context, key, reviveArray(value, reviver));
    }
    if (value && typeof value === "object" && !isLosslessNumber(value)) {
      return reviver.call(context, key, reviveObject(value, reviver));
    }
    return reviver.call(context, key, value);
  }
  __name(reviveValue, "reviveValue");
  function reviveObject(object, reviver) {
    for (const key of Object.keys(object)) {
      const value = reviveValue(object, key, object[key], reviver);
      if (value !== void 0) {
        object[key] = value;
      } else {
        delete object[key];
      }
    }
    return object;
  }
  __name(reviveObject, "reviveObject");
  function reviveArray(array, reviver) {
    for (let i = 0; i < array.length; i++) {
      array[i] = reviveValue(array, String(i), array[i], reviver);
    }
    return array;
  }
  __name(reviveArray, "reviveArray");

  // node_modules/lossless-json/lib/esm/parse.js
  function parse(text, reviver) {
    let parseNumber = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : parseLosslessNumber;
    let i = 0;
    const value = parseValue();
    expectValue(value);
    expectEndOfInput();
    return reviver ? revive(value, reviver) : value;
    function parseObject() {
      if (text.charCodeAt(i) === codeOpeningBrace) {
        i++;
        skipWhitespace();
        const object = {};
        let initial = true;
        while (i < text.length && text.charCodeAt(i) !== codeClosingBrace) {
          if (!initial) {
            eatComma();
            skipWhitespace();
          } else {
            initial = false;
          }
          const start = i;
          const key = parseString();
          if (key === void 0) {
            throwObjectKeyExpected();
            return;
          }
          skipWhitespace();
          eatColon();
          const value2 = parseValue();
          if (value2 === void 0) {
            throwObjectValueExpected();
            return;
          }
          if (Object.prototype.hasOwnProperty.call(object, key) && !isDeepEqual(value2, object[key])) {
            throwDuplicateKey(key, start + 1);
          }
          object[key] = value2;
        }
        if (text.charCodeAt(i) !== codeClosingBrace) {
          throwObjectKeyOrEndExpected();
        }
        i++;
        return object;
      }
    }
    __name(parseObject, "parseObject");
    function parseArray() {
      if (text.charCodeAt(i) === codeOpeningBracket) {
        i++;
        skipWhitespace();
        const array = [];
        let initial = true;
        while (i < text.length && text.charCodeAt(i) !== codeClosingBracket) {
          if (!initial) {
            eatComma();
          } else {
            initial = false;
          }
          const value2 = parseValue();
          expectArrayItem(value2);
          array.push(value2);
        }
        if (text.charCodeAt(i) !== codeClosingBracket) {
          throwArrayItemOrEndExpected();
        }
        i++;
        return array;
      }
    }
    __name(parseArray, "parseArray");
    function parseValue() {
      skipWhitespace();
      const value2 = parseString() ?? parseNumeric() ?? parseObject() ?? parseArray() ?? parseKeyword("true", true) ?? parseKeyword("false", false) ?? parseKeyword("null", null);
      skipWhitespace();
      return value2;
    }
    __name(parseValue, "parseValue");
    function parseKeyword(name, value2) {
      if (text.slice(i, i + name.length) === name) {
        i += name.length;
        return value2;
      }
    }
    __name(parseKeyword, "parseKeyword");
    function skipWhitespace() {
      while (isWhitespace(text.charCodeAt(i))) {
        i++;
      }
    }
    __name(skipWhitespace, "skipWhitespace");
    function parseString() {
      if (text.charCodeAt(i) === codeDoubleQuote) {
        i++;
        let result = "";
        while (i < text.length && text.charCodeAt(i) !== codeDoubleQuote) {
          if (text.charCodeAt(i) === codeBackslash) {
            const char = text[i + 1];
            const escapeChar = escapeCharacters[char];
            if (escapeChar !== void 0) {
              result += escapeChar;
              i++;
            } else if (char === "u") {
              if (isHex(text.charCodeAt(i + 2)) && isHex(text.charCodeAt(i + 3)) && isHex(text.charCodeAt(i + 4)) && isHex(text.charCodeAt(i + 5))) {
                result += String.fromCharCode(Number.parseInt(text.slice(i + 2, i + 6), 16));
                i += 5;
              } else {
                throwInvalidUnicodeCharacter(i);
              }
            } else {
              throwInvalidEscapeCharacter(i);
            }
          } else {
            if (isValidStringCharacter(text.charCodeAt(i))) {
              result += text[i];
            } else {
              throwInvalidCharacter(text[i]);
            }
          }
          i++;
        }
        expectEndOfString();
        i++;
        return result;
      }
    }
    __name(parseString, "parseString");
    function parseNumeric() {
      const start = i;
      if (text.charCodeAt(i) === codeMinus) {
        i++;
        expectDigit(start);
      }
      if (text.charCodeAt(i) === codeZero) {
        i++;
      } else if (isNonZeroDigit(text.charCodeAt(i))) {
        i++;
        while (isDigit(text.charCodeAt(i))) {
          i++;
        }
      }
      if (text.charCodeAt(i) === codeDot) {
        i++;
        expectDigit(start);
        while (isDigit(text.charCodeAt(i))) {
          i++;
        }
      }
      if (text.charCodeAt(i) === codeLowercaseE || text.charCodeAt(i) === codeUppercaseE) {
        i++;
        if (text.charCodeAt(i) === codeMinus || text.charCodeAt(i) === codePlus) {
          i++;
        }
        expectDigit(start);
        while (isDigit(text.charCodeAt(i))) {
          i++;
        }
      }
      if (i > start) {
        return parseNumber(text.slice(start, i));
      }
    }
    __name(parseNumeric, "parseNumeric");
    function eatComma() {
      if (text.charCodeAt(i) !== codeComma) {
        throw new SyntaxError(`Comma ',' expected after value ${gotAt()}`);
      }
      i++;
    }
    __name(eatComma, "eatComma");
    function eatColon() {
      if (text.charCodeAt(i) !== codeColon) {
        throw new SyntaxError(`Colon ':' expected after property name ${gotAt()}`);
      }
      i++;
    }
    __name(eatColon, "eatColon");
    function expectValue(value2) {
      if (value2 === void 0) {
        throw new SyntaxError(`JSON value expected ${gotAt()}`);
      }
    }
    __name(expectValue, "expectValue");
    function expectArrayItem(value2) {
      if (value2 === void 0) {
        throw new SyntaxError(`Array item expected ${gotAt()}`);
      }
    }
    __name(expectArrayItem, "expectArrayItem");
    function expectEndOfInput() {
      if (i < text.length) {
        throw new SyntaxError(`Expected end of input ${gotAt()}`);
      }
    }
    __name(expectEndOfInput, "expectEndOfInput");
    function expectDigit(start) {
      if (!isDigit(text.charCodeAt(i))) {
        const numSoFar = text.slice(start, i);
        throw new SyntaxError(`Invalid number '${numSoFar}', expecting a digit ${gotAt()}`);
      }
    }
    __name(expectDigit, "expectDigit");
    function expectEndOfString() {
      if (text.charCodeAt(i) !== codeDoubleQuote) {
        throw new SyntaxError(`End of string '"' expected ${gotAt()}`);
      }
    }
    __name(expectEndOfString, "expectEndOfString");
    function throwObjectKeyExpected() {
      throw new SyntaxError(`Quoted object key expected ${gotAt()}`);
    }
    __name(throwObjectKeyExpected, "throwObjectKeyExpected");
    function throwDuplicateKey(key, pos2) {
      throw new SyntaxError(`Duplicate key '${key}' encountered at position ${pos2}`);
    }
    __name(throwDuplicateKey, "throwDuplicateKey");
    function throwObjectKeyOrEndExpected() {
      throw new SyntaxError(`Quoted object key or end of object '}' expected ${gotAt()}`);
    }
    __name(throwObjectKeyOrEndExpected, "throwObjectKeyOrEndExpected");
    function throwArrayItemOrEndExpected() {
      throw new SyntaxError(`Array item or end of array ']' expected ${gotAt()}`);
    }
    __name(throwArrayItemOrEndExpected, "throwArrayItemOrEndExpected");
    function throwInvalidCharacter(char) {
      throw new SyntaxError(`Invalid character '${char}' ${pos()}`);
    }
    __name(throwInvalidCharacter, "throwInvalidCharacter");
    function throwInvalidEscapeCharacter(start) {
      const chars = text.slice(start, start + 2);
      throw new SyntaxError(`Invalid escape character '${chars}' ${pos()}`);
    }
    __name(throwInvalidEscapeCharacter, "throwInvalidEscapeCharacter");
    function throwObjectValueExpected() {
      throw new SyntaxError(`Object value expected after ':' ${pos()}`);
    }
    __name(throwObjectValueExpected, "throwObjectValueExpected");
    function throwInvalidUnicodeCharacter(start) {
      const chars = text.slice(start, start + 6);
      throw new SyntaxError(`Invalid unicode character '${chars}' ${pos()}`);
    }
    __name(throwInvalidUnicodeCharacter, "throwInvalidUnicodeCharacter");
    function pos() {
      return `at position ${i}`;
    }
    __name(pos, "pos");
    function got() {
      return i < text.length ? `but got '${text[i]}'` : "but reached end of input";
    }
    __name(got, "got");
    function gotAt() {
      return `${got()} ${pos()}`;
    }
    __name(gotAt, "gotAt");
  }
  __name(parse, "parse");
  function isWhitespace(code) {
    return code === codeSpace || code === codeNewline || code === codeTab || code === codeReturn;
  }
  __name(isWhitespace, "isWhitespace");
  function isHex(code) {
    return code >= codeZero && code <= codeNine || code >= codeUppercaseA && code <= codeUppercaseF || code >= codeLowercaseA && code <= codeLowercaseF;
  }
  __name(isHex, "isHex");
  function isDigit(code) {
    return code >= codeZero && code <= codeNine;
  }
  __name(isDigit, "isDigit");
  function isNonZeroDigit(code) {
    return code >= codeOne && code <= codeNine;
  }
  __name(isNonZeroDigit, "isNonZeroDigit");
  function isValidStringCharacter(code) {
    return code >= 32 && code <= 1114111;
  }
  __name(isValidStringCharacter, "isValidStringCharacter");
  function isDeepEqual(a, b) {
    if (a === b) {
      return true;
    }
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.length === b.length && a.every((item, index) => isDeepEqual(item, b[index]));
    }
    if (isObject(a) && isObject(b)) {
      const keys = [.../* @__PURE__ */ new Set([...Object.keys(a), ...Object.keys(b)])];
      return keys.every((key) => isDeepEqual(a[key], b[key]));
    }
    return false;
  }
  __name(isDeepEqual, "isDeepEqual");
  function isObject(value) {
    return typeof value === "object" && value !== null;
  }
  __name(isObject, "isObject");
  var escapeCharacters = {
    '"': '"',
    "\\": "\\",
    "/": "/",
    b: "\b",
    f: "\f",
    n: "\n",
    r: "\r",
    t: "	"
    // note that \u is handled separately in parseString()
  };
  var codeBackslash = 92;
  var codeOpeningBrace = 123;
  var codeClosingBrace = 125;
  var codeOpeningBracket = 91;
  var codeClosingBracket = 93;
  var codeSpace = 32;
  var codeNewline = 10;
  var codeTab = 9;
  var codeReturn = 13;
  var codeDoubleQuote = 34;
  var codePlus = 43;
  var codeMinus = 45;
  var codeZero = 48;
  var codeOne = 49;
  var codeNine = 57;
  var codeComma = 44;
  var codeDot = 46;
  var codeColon = 58;
  var codeUppercaseA = 65;
  var codeLowercaseA = 97;
  var codeUppercaseE = 69;
  var codeLowercaseE = 101;
  var codeUppercaseF = 70;
  var codeLowercaseF = 102;

  // node_modules/lossless-json/lib/esm/stringify.js
  function stringify(value, replacer, space, numberStringifiers) {
    const resolvedSpace = resolveSpace(space);
    const replacedValue = typeof replacer === "function" ? replacer.call({
      "": value
    }, "", value) : value;
    return stringifyValue(replacedValue, "");
    function stringifyValue(value2, indent) {
      if (Array.isArray(numberStringifiers)) {
        const stringifier = numberStringifiers.find((item) => item.test(value2));
        if (stringifier) {
          const str = stringifier.stringify(value2);
          if (typeof str !== "string" || !isNumber(str)) {
            throw new Error(`Invalid JSON number: output of a number stringifier must be a string containing a JSON number (output: ${str})`);
          }
          return str;
        }
      }
      if (typeof value2 === "boolean" || typeof value2 === "number" || typeof value2 === "string" || value2 === null || value2 instanceof Date || value2 instanceof Boolean || value2 instanceof Number || value2 instanceof String) {
        return JSON.stringify(value2);
      }
      if (value2?.isLosslessNumber) {
        return value2.toString();
      }
      if (typeof value2 === "bigint") {
        return value2.toString();
      }
      if (Array.isArray(value2)) {
        return stringifyArray(value2, indent);
      }
      if (value2 && typeof value2 === "object") {
        return stringifyObject(value2, indent);
      }
      return void 0;
    }
    __name(stringifyValue, "stringifyValue");
    function stringifyArray(array, indent) {
      if (array.length === 0) {
        return "[]";
      }
      const childIndent = resolvedSpace ? indent + resolvedSpace : void 0;
      let str = resolvedSpace ? "[\n" : "[";
      for (let i = 0; i < array.length; i++) {
        const item = typeof replacer === "function" ? replacer.call(array, String(i), array[i]) : array[i];
        if (resolvedSpace) {
          str += childIndent;
        }
        if (typeof item !== "undefined" && typeof item !== "function") {
          str += stringifyValue(item, childIndent);
        } else {
          str += "null";
        }
        if (i < array.length - 1) {
          str += resolvedSpace ? ",\n" : ",";
        }
      }
      str += resolvedSpace ? `
${indent}]` : "]";
      return str;
    }
    __name(stringifyArray, "stringifyArray");
    function stringifyObject(object, indent) {
      if (typeof object.toJSON === "function") {
        return stringify(object.toJSON(), replacer, space, void 0);
      }
      const keys = Array.isArray(replacer) ? replacer.map(String) : Object.keys(object);
      if (keys.length === 0) {
        return "{}";
      }
      const childIndent = resolvedSpace ? indent + resolvedSpace : void 0;
      let first = true;
      let str = resolvedSpace ? "{\n" : "{";
      for (const key of keys) {
        const value2 = typeof replacer === "function" ? replacer.call(object, key, object[key]) : object[key];
        if (includeProperty(key, value2)) {
          if (first) {
            first = false;
          } else {
            str += resolvedSpace ? ",\n" : ",";
          }
          const keyStr = JSON.stringify(key);
          str += resolvedSpace ? `${childIndent + keyStr}: ` : `${keyStr}:`;
          str += stringifyValue(value2, childIndent);
        }
      }
      str += resolvedSpace ? `
${indent}}` : "}";
      return str;
    }
    __name(stringifyObject, "stringifyObject");
    function includeProperty(_key, value2) {
      return typeof value2 !== "undefined" && typeof value2 !== "function" && typeof value2 !== "symbol";
    }
    __name(includeProperty, "includeProperty");
  }
  __name(stringify, "stringify");
  function resolveSpace(space) {
    if (typeof space === "number") {
      return " ".repeat(space);
    }
    if (typeof space === "string" && space !== "") {
      return space;
    }
    return void 0;
  }
  __name(resolveSpace, "resolveSpace");

  // node_modules/starknet/node_modules/@noble/curves/esm/abstract/utils.js
  var utils_exports = {};
  __export(utils_exports, {
    aInRange: () => aInRange,
    abool: () => abool,
    abytes: () => abytes,
    bitGet: () => bitGet,
    bitLen: () => bitLen,
    bitMask: () => bitMask,
    bitSet: () => bitSet,
    bytesToHex: () => bytesToHex,
    bytesToNumberBE: () => bytesToNumberBE,
    bytesToNumberLE: () => bytesToNumberLE,
    concatBytes: () => concatBytes,
    createHmacDrbg: () => createHmacDrbg,
    ensureBytes: () => ensureBytes,
    equalBytes: () => equalBytes,
    hexToBytes: () => hexToBytes,
    hexToNumber: () => hexToNumber,
    inRange: () => inRange,
    isBytes: () => isBytes2,
    memoized: () => memoized,
    notImplemented: () => notImplemented,
    numberToBytesBE: () => numberToBytesBE,
    numberToBytesLE: () => numberToBytesLE,
    numberToHexUnpadded: () => numberToHexUnpadded,
    numberToVarBytesBE: () => numberToVarBytesBE,
    utf8ToBytes: () => utf8ToBytes,
    validateObject: () => validateObject
  });
  var _0n = /* @__PURE__ */ BigInt(0);
  var _1n = /* @__PURE__ */ BigInt(1);
  var _2n = /* @__PURE__ */ BigInt(2);
  function isBytes2(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  __name(isBytes2, "isBytes");
  function abytes(item) {
    if (!isBytes2(item))
      throw new Error("Uint8Array expected");
  }
  __name(abytes, "abytes");
  function abool(title, value) {
    if (typeof value !== "boolean")
      throw new Error(title + " boolean expected, got " + value);
  }
  __name(abool, "abool");
  var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
  function bytesToHex(bytes) {
    abytes(bytes);
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
      hex += hexes[bytes[i]];
    }
    return hex;
  }
  __name(bytesToHex, "bytesToHex");
  function numberToHexUnpadded(num) {
    const hex = num.toString(16);
    return hex.length & 1 ? "0" + hex : hex;
  }
  __name(numberToHexUnpadded, "numberToHexUnpadded");
  function hexToNumber(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    return hex === "" ? _0n : BigInt("0x" + hex);
  }
  __name(hexToNumber, "hexToNumber");
  var asciis = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function asciiToBase16(ch) {
    if (ch >= asciis._0 && ch <= asciis._9)
      return ch - asciis._0;
    if (ch >= asciis.A && ch <= asciis.F)
      return ch - (asciis.A - 10);
    if (ch >= asciis.a && ch <= asciis.f)
      return ch - (asciis.a - 10);
    return;
  }
  __name(asciiToBase16, "asciiToBase16");
  function hexToBytes(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    const hl = hex.length;
    const al = hl / 2;
    if (hl % 2)
      throw new Error("hex string expected, got unpadded hex of length " + hl);
    const array = new Uint8Array(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
      const n1 = asciiToBase16(hex.charCodeAt(hi));
      const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
      if (n1 === void 0 || n2 === void 0) {
        const char = hex[hi] + hex[hi + 1];
        throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
      }
      array[ai] = n1 * 16 + n2;
    }
    return array;
  }
  __name(hexToBytes, "hexToBytes");
  function bytesToNumberBE(bytes) {
    return hexToNumber(bytesToHex(bytes));
  }
  __name(bytesToNumberBE, "bytesToNumberBE");
  function bytesToNumberLE(bytes) {
    abytes(bytes);
    return hexToNumber(bytesToHex(Uint8Array.from(bytes).reverse()));
  }
  __name(bytesToNumberLE, "bytesToNumberLE");
  function numberToBytesBE(n, len) {
    return hexToBytes(n.toString(16).padStart(len * 2, "0"));
  }
  __name(numberToBytesBE, "numberToBytesBE");
  function numberToBytesLE(n, len) {
    return numberToBytesBE(n, len).reverse();
  }
  __name(numberToBytesLE, "numberToBytesLE");
  function numberToVarBytesBE(n) {
    return hexToBytes(numberToHexUnpadded(n));
  }
  __name(numberToVarBytesBE, "numberToVarBytesBE");
  function ensureBytes(title, hex, expectedLength) {
    let res;
    if (typeof hex === "string") {
      try {
        res = hexToBytes(hex);
      } catch (e) {
        throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
      }
    } else if (isBytes2(hex)) {
      res = Uint8Array.from(hex);
    } else {
      throw new Error(title + " must be hex string or Uint8Array");
    }
    const len = res.length;
    if (typeof expectedLength === "number" && len !== expectedLength)
      throw new Error(title + " of length " + expectedLength + " expected, got " + len);
    return res;
  }
  __name(ensureBytes, "ensureBytes");
  function concatBytes(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
      const a = arrays[i];
      abytes(a);
      sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
      const a = arrays[i];
      res.set(a, pad);
      pad += a.length;
    }
    return res;
  }
  __name(concatBytes, "concatBytes");
  function equalBytes(a, b) {
    if (a.length !== b.length)
      return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++)
      diff |= a[i] ^ b[i];
    return diff === 0;
  }
  __name(equalBytes, "equalBytes");
  function utf8ToBytes(str) {
    if (typeof str !== "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(str));
  }
  __name(utf8ToBytes, "utf8ToBytes");
  var isPosBig = /* @__PURE__ */ __name((n) => typeof n === "bigint" && _0n <= n, "isPosBig");
  function inRange(n, min, max) {
    return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
  }
  __name(inRange, "inRange");
  function aInRange(title, n, min, max) {
    if (!inRange(n, min, max))
      throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
  }
  __name(aInRange, "aInRange");
  function bitLen(n) {
    let len;
    for (len = 0; n > _0n; n >>= _1n, len += 1)
      ;
    return len;
  }
  __name(bitLen, "bitLen");
  function bitGet(n, pos) {
    return n >> BigInt(pos) & _1n;
  }
  __name(bitGet, "bitGet");
  function bitSet(n, pos, value) {
    return n | (value ? _1n : _0n) << BigInt(pos);
  }
  __name(bitSet, "bitSet");
  var bitMask = /* @__PURE__ */ __name((n) => (_2n << BigInt(n - 1)) - _1n, "bitMask");
  var u8n = /* @__PURE__ */ __name((data) => new Uint8Array(data), "u8n");
  var u8fr = /* @__PURE__ */ __name((arr) => Uint8Array.from(arr), "u8fr");
  function createHmacDrbg(hashLen, qByteLen, hmacFn) {
    if (typeof hashLen !== "number" || hashLen < 2)
      throw new Error("hashLen must be a number");
    if (typeof qByteLen !== "number" || qByteLen < 2)
      throw new Error("qByteLen must be a number");
    if (typeof hmacFn !== "function")
      throw new Error("hmacFn must be a function");
    let v = u8n(hashLen);
    let k = u8n(hashLen);
    let i = 0;
    const reset = /* @__PURE__ */ __name(() => {
      v.fill(1);
      k.fill(0);
      i = 0;
    }, "reset");
    const h = /* @__PURE__ */ __name((...b) => hmacFn(k, v, ...b), "h");
    const reseed = /* @__PURE__ */ __name((seed = u8n()) => {
      k = h(u8fr([0]), seed);
      v = h();
      if (seed.length === 0)
        return;
      k = h(u8fr([1]), seed);
      v = h();
    }, "reseed");
    const gen3 = /* @__PURE__ */ __name(() => {
      if (i++ >= 1e3)
        throw new Error("drbg: tried 1000 values");
      let len = 0;
      const out = [];
      while (len < qByteLen) {
        v = h();
        const sl = v.slice();
        out.push(sl);
        len += v.length;
      }
      return concatBytes(...out);
    }, "gen");
    const genUntil = /* @__PURE__ */ __name((seed, pred) => {
      reset();
      reseed(seed);
      let res = void 0;
      while (!(res = pred(gen3())))
        reseed();
      reset();
      return res;
    }, "genUntil");
    return genUntil;
  }
  __name(createHmacDrbg, "createHmacDrbg");
  var validatorFns = {
    bigint: /* @__PURE__ */ __name((val) => typeof val === "bigint", "bigint"),
    function: /* @__PURE__ */ __name((val) => typeof val === "function", "function"),
    boolean: /* @__PURE__ */ __name((val) => typeof val === "boolean", "boolean"),
    string: /* @__PURE__ */ __name((val) => typeof val === "string", "string"),
    stringOrUint8Array: /* @__PURE__ */ __name((val) => typeof val === "string" || isBytes2(val), "stringOrUint8Array"),
    isSafeInteger: /* @__PURE__ */ __name((val) => Number.isSafeInteger(val), "isSafeInteger"),
    array: /* @__PURE__ */ __name((val) => Array.isArray(val), "array"),
    field: /* @__PURE__ */ __name((val, object) => object.Fp.isValid(val), "field"),
    hash: /* @__PURE__ */ __name((val) => typeof val === "function" && Number.isSafeInteger(val.outputLen), "hash")
  };
  function validateObject(object, validators, optValidators = {}) {
    const checkField = /* @__PURE__ */ __name((fieldName, type, isOptional) => {
      const checkVal = validatorFns[type];
      if (typeof checkVal !== "function")
        throw new Error("invalid validator function");
      const val = object[fieldName];
      if (isOptional && val === void 0)
        return;
      if (!checkVal(val, object)) {
        throw new Error("param " + String(fieldName) + " is invalid. Expected " + type + ", got " + val);
      }
    }, "checkField");
    for (const [fieldName, type] of Object.entries(validators))
      checkField(fieldName, type, false);
    for (const [fieldName, type] of Object.entries(optValidators))
      checkField(fieldName, type, true);
    return object;
  }
  __name(validateObject, "validateObject");
  var notImplemented = /* @__PURE__ */ __name(() => {
    throw new Error("not implemented");
  }, "notImplemented");
  function memoized(fn) {
    const map2 = /* @__PURE__ */ new WeakMap();
    return (arg, ...args) => {
      const val = map2.get(arg);
      if (val !== void 0)
        return val;
      const computed = fn(arg, ...args);
      map2.set(arg, computed);
      return computed;
    };
  }
  __name(memoized, "memoized");

  // node_modules/starknet/node_modules/@noble/hashes/esm/_assert.js
  function anumber2(n) {
    if (!Number.isSafeInteger(n) || n < 0)
      throw new Error("positive integer expected, got " + n);
  }
  __name(anumber2, "anumber");
  function isBytes3(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  __name(isBytes3, "isBytes");
  function abytes2(b, ...lengths) {
    if (!isBytes3(b))
      throw new Error("Uint8Array expected");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
  }
  __name(abytes2, "abytes");
  function ahash(h) {
    if (typeof h !== "function" || typeof h.create !== "function")
      throw new Error("Hash should be wrapped by utils.wrapConstructor");
    anumber2(h.outputLen);
    anumber2(h.blockLen);
  }
  __name(ahash, "ahash");
  function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  __name(aexists, "aexists");
  function aoutput(out, instance) {
    abytes2(out);
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error("digestInto() expects output buffer of length at least " + min);
    }
  }
  __name(aoutput, "aoutput");

  // node_modules/starknet/node_modules/@noble/hashes/esm/crypto.js
  var crypto = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;

  // node_modules/starknet/node_modules/@noble/hashes/esm/utils.js
  var u32 = /* @__PURE__ */ __name((arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4)), "u32");
  var createView = /* @__PURE__ */ __name((arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength), "createView");
  var rotr = /* @__PURE__ */ __name((word, shift) => word << 32 - shift | word >>> shift, "rotr");
  var isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
  var byteSwap = /* @__PURE__ */ __name((word) => word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255, "byteSwap");
  function byteSwap32(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = byteSwap(arr[i]);
    }
  }
  __name(byteSwap32, "byteSwap32");
  function utf8ToBytes2(str) {
    if (typeof str !== "string")
      throw new Error("utf8ToBytes expected string, got " + typeof str);
    return new Uint8Array(new TextEncoder().encode(str));
  }
  __name(utf8ToBytes2, "utf8ToBytes");
  function toBytes(data) {
    if (typeof data === "string")
      data = utf8ToBytes2(data);
    abytes2(data);
    return data;
  }
  __name(toBytes, "toBytes");
  function concatBytes2(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
      const a = arrays[i];
      abytes2(a);
      sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
      const a = arrays[i];
      res.set(a, pad);
      pad += a.length;
    }
    return res;
  }
  __name(concatBytes2, "concatBytes");
  var Hash = class {
    static {
      __name(this, "Hash");
    }
    // Safe version that clones internal state
    clone() {
      return this._cloneInto();
    }
  };
  function wrapConstructor(hashCons) {
    const hashC = /* @__PURE__ */ __name((msg) => hashCons().update(toBytes(msg)).digest(), "hashC");
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
  }
  __name(wrapConstructor, "wrapConstructor");
  function wrapXOFConstructorWithOpts(hashCons) {
    const hashC = /* @__PURE__ */ __name((msg, opts) => hashCons(opts).update(toBytes(msg)).digest(), "hashC");
    const tmp = hashCons({});
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts) => hashCons(opts);
    return hashC;
  }
  __name(wrapXOFConstructorWithOpts, "wrapXOFConstructorWithOpts");
  function randomBytes(bytesLength = 32) {
    if (crypto && typeof crypto.getRandomValues === "function") {
      return crypto.getRandomValues(new Uint8Array(bytesLength));
    }
    if (crypto && typeof crypto.randomBytes === "function") {
      return crypto.randomBytes(bytesLength);
    }
    throw new Error("crypto.getRandomValues must be defined");
  }
  __name(randomBytes, "randomBytes");

  // node_modules/starknet/node_modules/@noble/hashes/esm/_md.js
  function setBigUint64(view, byteOffset, value, isLE3) {
    if (typeof view.setBigUint64 === "function")
      return view.setBigUint64(byteOffset, value, isLE3);
    const _32n3 = BigInt(32);
    const _u32_max = BigInt(4294967295);
    const wh = Number(value >> _32n3 & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE3 ? 4 : 0;
    const l = isLE3 ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE3);
    view.setUint32(byteOffset + l, wl, isLE3);
  }
  __name(setBigUint64, "setBigUint64");
  var Chi = /* @__PURE__ */ __name((a, b, c) => a & b ^ ~a & c, "Chi");
  var Maj = /* @__PURE__ */ __name((a, b, c) => a & b ^ a & c ^ b & c, "Maj");
  var HashMD = class extends Hash {
    static {
      __name(this, "HashMD");
    }
    constructor(blockLen, outputLen, padOffset, isLE3) {
      super();
      this.blockLen = blockLen;
      this.outputLen = outputLen;
      this.padOffset = padOffset;
      this.isLE = isLE3;
      this.finished = false;
      this.length = 0;
      this.pos = 0;
      this.destroyed = false;
      this.buffer = new Uint8Array(blockLen);
      this.view = createView(this.buffer);
    }
    update(data) {
      aexists(this);
      const { view, buffer, blockLen } = this;
      data = toBytes(data);
      const len = data.length;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        if (take === blockLen) {
          const dataView = createView(data);
          for (; blockLen <= len - pos; pos += blockLen)
            this.process(dataView, pos);
          continue;
        }
        buffer.set(data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        pos += take;
        if (this.pos === blockLen) {
          this.process(view, 0);
          this.pos = 0;
        }
      }
      this.length += data.length;
      this.roundClean();
      return this;
    }
    digestInto(out) {
      aexists(this);
      aoutput(out, this);
      this.finished = true;
      const { buffer, view, blockLen, isLE: isLE3 } = this;
      let { pos } = this;
      buffer[pos++] = 128;
      this.buffer.subarray(pos).fill(0);
      if (this.padOffset > blockLen - pos) {
        this.process(view, 0);
        pos = 0;
      }
      for (let i = pos; i < blockLen; i++)
        buffer[i] = 0;
      setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE3);
      this.process(view, 0);
      const oview = createView(out);
      const len = this.outputLen;
      if (len % 4)
        throw new Error("_sha2: outputLen should be aligned to 32bit");
      const outLen = len / 4;
      const state = this.get();
      if (outLen > state.length)
        throw new Error("_sha2: outputLen bigger than state");
      for (let i = 0; i < outLen; i++)
        oview.setUint32(4 * i, state[i], isLE3);
    }
    digest() {
      const { buffer, outputLen } = this;
      this.digestInto(buffer);
      const res = buffer.slice(0, outputLen);
      this.destroy();
      return res;
    }
    _cloneInto(to) {
      to || (to = new this.constructor());
      to.set(...this.get());
      const { blockLen, buffer, length, finished, destroyed, pos } = this;
      to.length = length;
      to.pos = pos;
      to.finished = finished;
      to.destroyed = destroyed;
      if (length % blockLen)
        to.buffer.set(buffer);
      return to;
    }
  };

  // node_modules/starknet/node_modules/@noble/hashes/esm/sha256.js
  var SHA256_K = /* @__PURE__ */ new Uint32Array([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]);
  var SHA256_IV = /* @__PURE__ */ new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
  var SHA256 = class extends HashMD {
    static {
      __name(this, "SHA256");
    }
    constructor() {
      super(64, 32, 8, false);
      this.A = SHA256_IV[0] | 0;
      this.B = SHA256_IV[1] | 0;
      this.C = SHA256_IV[2] | 0;
      this.D = SHA256_IV[3] | 0;
      this.E = SHA256_IV[4] | 0;
      this.F = SHA256_IV[5] | 0;
      this.G = SHA256_IV[6] | 0;
      this.H = SHA256_IV[7] | 0;
    }
    get() {
      const { A, B, C, D, E, F, G, H } = this;
      return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
      this.A = A | 0;
      this.B = B | 0;
      this.C = C | 0;
      this.D = D | 0;
      this.E = E | 0;
      this.F = F | 0;
      this.G = G | 0;
      this.H = H | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        SHA256_W[i] = view.getUint32(offset, false);
      for (let i = 16; i < 64; i++) {
        const W15 = SHA256_W[i - 15];
        const W2 = SHA256_W[i - 2];
        const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
        const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
        SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
      }
      let { A, B, C, D, E, F, G, H } = this;
      for (let i = 0; i < 64; i++) {
        const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
        const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
        const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
        const T2 = sigma0 + Maj(A, B, C) | 0;
        H = G;
        G = F;
        F = E;
        E = D + T1 | 0;
        D = C;
        C = B;
        B = A;
        A = T1 + T2 | 0;
      }
      A = A + this.A | 0;
      B = B + this.B | 0;
      C = C + this.C | 0;
      D = D + this.D | 0;
      E = E + this.E | 0;
      F = F + this.F | 0;
      G = G + this.G | 0;
      H = H + this.H | 0;
      this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
      SHA256_W.fill(0);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0);
      this.buffer.fill(0);
    }
  };
  var sha256 = /* @__PURE__ */ wrapConstructor(() => new SHA256());

  // node_modules/@scure/starknet/lib/esm/index.js
  var esm_exports2 = {};
  __export(esm_exports2, {
    CURVE: () => CURVE,
    Fp251: () => Fp251,
    MAX_VALUE: () => MAX_VALUE,
    ProjectivePoint: () => ProjectivePoint,
    Signature: () => Signature,
    _poseidonMDS: () => _poseidonMDS,
    _starkCurve: () => _starkCurve,
    computeHashOnElements: () => computeHashOnElements,
    ethSigToPrivate: () => ethSigToPrivate,
    getAccountPath: () => getAccountPath,
    getPublicKey: () => getPublicKey,
    getSharedSecret: () => getSharedSecret,
    getStarkKey: () => getStarkKey,
    grindKey: () => grindKey,
    keccak: () => keccak,
    normalizePrivateKey: () => normalizePrivateKey,
    pedersen: () => pedersen,
    poseidonBasic: () => poseidonBasic,
    poseidonCreate: () => poseidonCreate,
    poseidonHash: () => poseidonHash,
    poseidonHashFunc: () => poseidonHashFunc,
    poseidonHashMany: () => poseidonHashMany,
    poseidonHashSingle: () => poseidonHashSingle,
    poseidonSmall: () => poseidonSmall,
    sign: () => sign,
    utils: () => utils,
    verify: () => verify
  });

  // node_modules/@scure/starknet/node_modules/@noble/hashes/esm/_assert.js
  function anumber3(n) {
    if (!Number.isSafeInteger(n) || n < 0)
      throw new Error("positive integer expected, got " + n);
  }
  __name(anumber3, "anumber");
  function isBytes4(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  __name(isBytes4, "isBytes");
  function abytes3(b, ...lengths) {
    if (!isBytes4(b))
      throw new Error("Uint8Array expected");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
  }
  __name(abytes3, "abytes");
  function aexists2(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  __name(aexists2, "aexists");
  function aoutput2(out, instance) {
    abytes3(out);
    const min = instance.outputLen;
    if (out.length < min) {
      throw new Error("digestInto() expects output buffer of length at least " + min);
    }
  }
  __name(aoutput2, "aoutput");

  // node_modules/@scure/starknet/node_modules/@noble/hashes/esm/_u64.js
  var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
  var _32n = /* @__PURE__ */ BigInt(32);
  function fromBig(n, le = false) {
    if (le)
      return { h: Number(n & U32_MASK64), l: Number(n >> _32n & U32_MASK64) };
    return { h: Number(n >> _32n & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
  }
  __name(fromBig, "fromBig");
  function split(lst, le = false) {
    let Ah = new Uint32Array(lst.length);
    let Al = new Uint32Array(lst.length);
    for (let i = 0; i < lst.length; i++) {
      const { h, l } = fromBig(lst[i], le);
      [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
  }
  __name(split, "split");
  var rotlSH = /* @__PURE__ */ __name((h, l, s) => h << s | l >>> 32 - s, "rotlSH");
  var rotlSL = /* @__PURE__ */ __name((h, l, s) => l << s | h >>> 32 - s, "rotlSL");
  var rotlBH = /* @__PURE__ */ __name((h, l, s) => l << s - 32 | h >>> 64 - s, "rotlBH");
  var rotlBL = /* @__PURE__ */ __name((h, l, s) => h << s - 32 | l >>> 64 - s, "rotlBL");

  // node_modules/@scure/starknet/node_modules/@noble/hashes/esm/utils.js
  var u322 = /* @__PURE__ */ __name((arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4)), "u32");
  var createView2 = /* @__PURE__ */ __name((arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength), "createView");
  var rotr2 = /* @__PURE__ */ __name((word, shift) => word << 32 - shift | word >>> shift, "rotr");
  var isLE2 = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68)();
  var byteSwap2 = /* @__PURE__ */ __name((word) => word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255, "byteSwap");
  function byteSwap322(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = byteSwap2(arr[i]);
    }
  }
  __name(byteSwap322, "byteSwap32");
  function utf8ToBytes3(str) {
    if (typeof str !== "string")
      throw new Error("utf8ToBytes expected string, got " + typeof str);
    return new Uint8Array(new TextEncoder().encode(str));
  }
  __name(utf8ToBytes3, "utf8ToBytes");
  function toBytes2(data) {
    if (typeof data === "string")
      data = utf8ToBytes3(data);
    abytes3(data);
    return data;
  }
  __name(toBytes2, "toBytes");
  var Hash2 = class {
    static {
      __name(this, "Hash");
    }
    // Safe version that clones internal state
    clone() {
      return this._cloneInto();
    }
  };
  function wrapConstructor2(hashCons) {
    const hashC = /* @__PURE__ */ __name((msg) => hashCons().update(toBytes2(msg)).digest(), "hashC");
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
  }
  __name(wrapConstructor2, "wrapConstructor");
  function wrapXOFConstructorWithOpts2(hashCons) {
    const hashC = /* @__PURE__ */ __name((msg, opts) => hashCons(opts).update(toBytes2(msg)).digest(), "hashC");
    const tmp = hashCons({});
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts) => hashCons(opts);
    return hashC;
  }
  __name(wrapXOFConstructorWithOpts2, "wrapXOFConstructorWithOpts");

  // node_modules/@scure/starknet/node_modules/@noble/hashes/esm/sha3.js
  var SHA3_PI = [];
  var SHA3_ROTL = [];
  var _SHA3_IOTA = [];
  var _0n2 = /* @__PURE__ */ BigInt(0);
  var _1n2 = /* @__PURE__ */ BigInt(1);
  var _2n2 = /* @__PURE__ */ BigInt(2);
  var _7n = /* @__PURE__ */ BigInt(7);
  var _256n = /* @__PURE__ */ BigInt(256);
  var _0x71n = /* @__PURE__ */ BigInt(113);
  for (let round = 0, R = _1n2, x = 1, y = 0; round < 24; round++) {
    [x, y] = [y, (2 * x + 3 * y) % 5];
    SHA3_PI.push(2 * (5 * y + x));
    SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
    let t = _0n2;
    for (let j = 0; j < 7; j++) {
      R = (R << _1n2 ^ (R >> _7n) * _0x71n) % _256n;
      if (R & _2n2)
        t ^= _1n2 << (_1n2 << /* @__PURE__ */ BigInt(j)) - _1n2;
    }
    _SHA3_IOTA.push(t);
  }
  var [SHA3_IOTA_H, SHA3_IOTA_L] = /* @__PURE__ */ split(_SHA3_IOTA, true);
  var rotlH = /* @__PURE__ */ __name((h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s), "rotlH");
  var rotlL = /* @__PURE__ */ __name((h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s), "rotlL");
  function keccakP(s, rounds = 24) {
    const B = new Uint32Array(5 * 2);
    for (let round = 24 - rounds; round < 24; round++) {
      for (let x = 0; x < 10; x++)
        B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
      for (let x = 0; x < 10; x += 2) {
        const idx1 = (x + 8) % 10;
        const idx0 = (x + 2) % 10;
        const B0 = B[idx0];
        const B1 = B[idx0 + 1];
        const Th = rotlH(B0, B1, 1) ^ B[idx1];
        const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
        for (let y = 0; y < 50; y += 10) {
          s[x + y] ^= Th;
          s[x + y + 1] ^= Tl;
        }
      }
      let curH = s[2];
      let curL = s[3];
      for (let t = 0; t < 24; t++) {
        const shift = SHA3_ROTL[t];
        const Th = rotlH(curH, curL, shift);
        const Tl = rotlL(curH, curL, shift);
        const PI = SHA3_PI[t];
        curH = s[PI];
        curL = s[PI + 1];
        s[PI] = Th;
        s[PI + 1] = Tl;
      }
      for (let y = 0; y < 50; y += 10) {
        for (let x = 0; x < 10; x++)
          B[x] = s[y + x];
        for (let x = 0; x < 10; x++)
          s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
      }
      s[0] ^= SHA3_IOTA_H[round];
      s[1] ^= SHA3_IOTA_L[round];
    }
    B.fill(0);
  }
  __name(keccakP, "keccakP");
  var Keccak = class _Keccak extends Hash2 {
    static {
      __name(this, "Keccak");
    }
    // NOTE: we accept arguments in bytes instead of bits here.
    constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
      super();
      this.blockLen = blockLen;
      this.suffix = suffix;
      this.outputLen = outputLen;
      this.enableXOF = enableXOF;
      this.rounds = rounds;
      this.pos = 0;
      this.posOut = 0;
      this.finished = false;
      this.destroyed = false;
      anumber3(outputLen);
      if (0 >= this.blockLen || this.blockLen >= 200)
        throw new Error("Sha3 supports only keccak-f1600 function");
      this.state = new Uint8Array(200);
      this.state32 = u322(this.state);
    }
    keccak() {
      if (!isLE2)
        byteSwap322(this.state32);
      keccakP(this.state32, this.rounds);
      if (!isLE2)
        byteSwap322(this.state32);
      this.posOut = 0;
      this.pos = 0;
    }
    update(data) {
      aexists2(this);
      const { blockLen, state } = this;
      data = toBytes2(data);
      const len = data.length;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        for (let i = 0; i < take; i++)
          state[this.pos++] ^= data[pos++];
        if (this.pos === blockLen)
          this.keccak();
      }
      return this;
    }
    finish() {
      if (this.finished)
        return;
      this.finished = true;
      const { state, suffix, pos, blockLen } = this;
      state[pos] ^= suffix;
      if ((suffix & 128) !== 0 && pos === blockLen - 1)
        this.keccak();
      state[blockLen - 1] ^= 128;
      this.keccak();
    }
    writeInto(out) {
      aexists2(this, false);
      abytes3(out);
      this.finish();
      const bufferOut = this.state;
      const { blockLen } = this;
      for (let pos = 0, len = out.length; pos < len; ) {
        if (this.posOut >= blockLen)
          this.keccak();
        const take = Math.min(blockLen - this.posOut, len - pos);
        out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
        this.posOut += take;
        pos += take;
      }
      return out;
    }
    xofInto(out) {
      if (!this.enableXOF)
        throw new Error("XOF is not possible for this instance");
      return this.writeInto(out);
    }
    xof(bytes) {
      anumber3(bytes);
      return this.xofInto(new Uint8Array(bytes));
    }
    digestInto(out) {
      aoutput2(out, this);
      if (this.finished)
        throw new Error("digest() was already called");
      this.writeInto(out);
      this.destroy();
      return out;
    }
    digest() {
      return this.digestInto(new Uint8Array(this.outputLen));
    }
    destroy() {
      this.destroyed = true;
      this.state.fill(0);
    }
    _cloneInto(to) {
      const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
      to || (to = new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
      to.state32.set(this.state32);
      to.pos = this.pos;
      to.posOut = this.posOut;
      to.finished = this.finished;
      to.rounds = rounds;
      to.suffix = suffix;
      to.outputLen = outputLen;
      to.enableXOF = enableXOF;
      to.destroyed = this.destroyed;
      return to;
    }
  };
  var gen = /* @__PURE__ */ __name((suffix, blockLen, outputLen) => wrapConstructor2(() => new Keccak(blockLen, suffix, outputLen)), "gen");
  var sha3_224 = /* @__PURE__ */ gen(6, 144, 224 / 8);
  var sha3_256 = /* @__PURE__ */ gen(6, 136, 256 / 8);
  var sha3_384 = /* @__PURE__ */ gen(6, 104, 384 / 8);
  var sha3_512 = /* @__PURE__ */ gen(6, 72, 512 / 8);
  var keccak_224 = /* @__PURE__ */ gen(1, 144, 224 / 8);
  var keccak_256 = /* @__PURE__ */ gen(1, 136, 256 / 8);
  var keccak_384 = /* @__PURE__ */ gen(1, 104, 384 / 8);
  var keccak_512 = /* @__PURE__ */ gen(1, 72, 512 / 8);
  var genShake = /* @__PURE__ */ __name((suffix, blockLen, outputLen) => wrapXOFConstructorWithOpts2((opts = {}) => new Keccak(blockLen, suffix, opts.dkLen === void 0 ? outputLen : opts.dkLen, true)), "genShake");
  var shake128 = /* @__PURE__ */ genShake(31, 168, 128 / 8);
  var shake256 = /* @__PURE__ */ genShake(31, 136, 256 / 8);

  // node_modules/@scure/starknet/node_modules/@noble/hashes/esm/_md.js
  function setBigUint642(view, byteOffset, value, isLE3) {
    if (typeof view.setBigUint64 === "function")
      return view.setBigUint64(byteOffset, value, isLE3);
    const _32n3 = BigInt(32);
    const _u32_max = BigInt(4294967295);
    const wh = Number(value >> _32n3 & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE3 ? 4 : 0;
    const l = isLE3 ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE3);
    view.setUint32(byteOffset + l, wl, isLE3);
  }
  __name(setBigUint642, "setBigUint64");
  var Chi2 = /* @__PURE__ */ __name((a, b, c) => a & b ^ ~a & c, "Chi");
  var Maj2 = /* @__PURE__ */ __name((a, b, c) => a & b ^ a & c ^ b & c, "Maj");
  var HashMD2 = class extends Hash2 {
    static {
      __name(this, "HashMD");
    }
    constructor(blockLen, outputLen, padOffset, isLE3) {
      super();
      this.blockLen = blockLen;
      this.outputLen = outputLen;
      this.padOffset = padOffset;
      this.isLE = isLE3;
      this.finished = false;
      this.length = 0;
      this.pos = 0;
      this.destroyed = false;
      this.buffer = new Uint8Array(blockLen);
      this.view = createView2(this.buffer);
    }
    update(data) {
      aexists2(this);
      const { view, buffer, blockLen } = this;
      data = toBytes2(data);
      const len = data.length;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        if (take === blockLen) {
          const dataView = createView2(data);
          for (; blockLen <= len - pos; pos += blockLen)
            this.process(dataView, pos);
          continue;
        }
        buffer.set(data.subarray(pos, pos + take), this.pos);
        this.pos += take;
        pos += take;
        if (this.pos === blockLen) {
          this.process(view, 0);
          this.pos = 0;
        }
      }
      this.length += data.length;
      this.roundClean();
      return this;
    }
    digestInto(out) {
      aexists2(this);
      aoutput2(out, this);
      this.finished = true;
      const { buffer, view, blockLen, isLE: isLE3 } = this;
      let { pos } = this;
      buffer[pos++] = 128;
      this.buffer.subarray(pos).fill(0);
      if (this.padOffset > blockLen - pos) {
        this.process(view, 0);
        pos = 0;
      }
      for (let i = pos; i < blockLen; i++)
        buffer[i] = 0;
      setBigUint642(view, blockLen - 8, BigInt(this.length * 8), isLE3);
      this.process(view, 0);
      const oview = createView2(out);
      const len = this.outputLen;
      if (len % 4)
        throw new Error("_sha2: outputLen should be aligned to 32bit");
      const outLen = len / 4;
      const state = this.get();
      if (outLen > state.length)
        throw new Error("_sha2: outputLen bigger than state");
      for (let i = 0; i < outLen; i++)
        oview.setUint32(4 * i, state[i], isLE3);
    }
    digest() {
      const { buffer, outputLen } = this;
      this.digestInto(buffer);
      const res = buffer.slice(0, outputLen);
      this.destroy();
      return res;
    }
    _cloneInto(to) {
      to || (to = new this.constructor());
      to.set(...this.get());
      const { blockLen, buffer, length, finished, destroyed, pos } = this;
      to.length = length;
      to.pos = pos;
      to.finished = finished;
      to.destroyed = destroyed;
      if (length % blockLen)
        to.buffer.set(buffer);
      return to;
    }
  };

  // node_modules/@scure/starknet/node_modules/@noble/hashes/esm/sha256.js
  var SHA256_K2 = /* @__PURE__ */ new Uint32Array([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]);
  var SHA256_IV2 = /* @__PURE__ */ new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  var SHA256_W2 = /* @__PURE__ */ new Uint32Array(64);
  var SHA2562 = class extends HashMD2 {
    static {
      __name(this, "SHA256");
    }
    constructor() {
      super(64, 32, 8, false);
      this.A = SHA256_IV2[0] | 0;
      this.B = SHA256_IV2[1] | 0;
      this.C = SHA256_IV2[2] | 0;
      this.D = SHA256_IV2[3] | 0;
      this.E = SHA256_IV2[4] | 0;
      this.F = SHA256_IV2[5] | 0;
      this.G = SHA256_IV2[6] | 0;
      this.H = SHA256_IV2[7] | 0;
    }
    get() {
      const { A, B, C, D, E, F, G, H } = this;
      return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
      this.A = A | 0;
      this.B = B | 0;
      this.C = C | 0;
      this.D = D | 0;
      this.E = E | 0;
      this.F = F | 0;
      this.G = G | 0;
      this.H = H | 0;
    }
    process(view, offset) {
      for (let i = 0; i < 16; i++, offset += 4)
        SHA256_W2[i] = view.getUint32(offset, false);
      for (let i = 16; i < 64; i++) {
        const W15 = SHA256_W2[i - 15];
        const W2 = SHA256_W2[i - 2];
        const s0 = rotr2(W15, 7) ^ rotr2(W15, 18) ^ W15 >>> 3;
        const s1 = rotr2(W2, 17) ^ rotr2(W2, 19) ^ W2 >>> 10;
        SHA256_W2[i] = s1 + SHA256_W2[i - 7] + s0 + SHA256_W2[i - 16] | 0;
      }
      let { A, B, C, D, E, F, G, H } = this;
      for (let i = 0; i < 64; i++) {
        const sigma1 = rotr2(E, 6) ^ rotr2(E, 11) ^ rotr2(E, 25);
        const T1 = H + sigma1 + Chi2(E, F, G) + SHA256_K2[i] + SHA256_W2[i] | 0;
        const sigma0 = rotr2(A, 2) ^ rotr2(A, 13) ^ rotr2(A, 22);
        const T2 = sigma0 + Maj2(A, B, C) | 0;
        H = G;
        G = F;
        F = E;
        E = D + T1 | 0;
        D = C;
        C = B;
        B = A;
        A = T1 + T2 | 0;
      }
      A = A + this.A | 0;
      B = B + this.B | 0;
      C = C + this.C | 0;
      D = D + this.D | 0;
      E = E + this.E | 0;
      F = F + this.F | 0;
      G = G + this.G | 0;
      H = H + this.H | 0;
      this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
      SHA256_W2.fill(0);
    }
    destroy() {
      this.set(0, 0, 0, 0, 0, 0, 0, 0);
      this.buffer.fill(0);
    }
  };
  var sha2562 = /* @__PURE__ */ wrapConstructor2(() => new SHA2562());

  // node_modules/@scure/starknet/node_modules/@noble/curves/esm/abstract/utils.js
  var utils_exports2 = {};
  __export(utils_exports2, {
    aInRange: () => aInRange2,
    abool: () => abool2,
    abytes: () => abytes4,
    bitGet: () => bitGet2,
    bitLen: () => bitLen2,
    bitMask: () => bitMask2,
    bitSet: () => bitSet2,
    bytesToHex: () => bytesToHex2,
    bytesToNumberBE: () => bytesToNumberBE2,
    bytesToNumberLE: () => bytesToNumberLE2,
    concatBytes: () => concatBytes3,
    createHmacDrbg: () => createHmacDrbg2,
    ensureBytes: () => ensureBytes2,
    equalBytes: () => equalBytes2,
    hexToBytes: () => hexToBytes2,
    hexToNumber: () => hexToNumber2,
    inRange: () => inRange2,
    isBytes: () => isBytes5,
    memoized: () => memoized2,
    notImplemented: () => notImplemented2,
    numberToBytesBE: () => numberToBytesBE2,
    numberToBytesLE: () => numberToBytesLE2,
    numberToHexUnpadded: () => numberToHexUnpadded2,
    numberToVarBytesBE: () => numberToVarBytesBE2,
    utf8ToBytes: () => utf8ToBytes4,
    validateObject: () => validateObject2
  });
  var _0n3 = /* @__PURE__ */ BigInt(0);
  var _1n3 = /* @__PURE__ */ BigInt(1);
  var _2n3 = /* @__PURE__ */ BigInt(2);
  function isBytes5(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  __name(isBytes5, "isBytes");
  function abytes4(item) {
    if (!isBytes5(item))
      throw new Error("Uint8Array expected");
  }
  __name(abytes4, "abytes");
  function abool2(title, value) {
    if (typeof value !== "boolean")
      throw new Error(title + " boolean expected, got " + value);
  }
  __name(abool2, "abool");
  var hexes2 = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
  function bytesToHex2(bytes) {
    abytes4(bytes);
    let hex = "";
    for (let i = 0; i < bytes.length; i++) {
      hex += hexes2[bytes[i]];
    }
    return hex;
  }
  __name(bytesToHex2, "bytesToHex");
  function numberToHexUnpadded2(num) {
    const hex = num.toString(16);
    return hex.length & 1 ? "0" + hex : hex;
  }
  __name(numberToHexUnpadded2, "numberToHexUnpadded");
  function hexToNumber2(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    return hex === "" ? _0n3 : BigInt("0x" + hex);
  }
  __name(hexToNumber2, "hexToNumber");
  var asciis2 = { _0: 48, _9: 57, A: 65, F: 70, a: 97, f: 102 };
  function asciiToBase162(ch) {
    if (ch >= asciis2._0 && ch <= asciis2._9)
      return ch - asciis2._0;
    if (ch >= asciis2.A && ch <= asciis2.F)
      return ch - (asciis2.A - 10);
    if (ch >= asciis2.a && ch <= asciis2.f)
      return ch - (asciis2.a - 10);
    return;
  }
  __name(asciiToBase162, "asciiToBase16");
  function hexToBytes2(hex) {
    if (typeof hex !== "string")
      throw new Error("hex string expected, got " + typeof hex);
    const hl = hex.length;
    const al = hl / 2;
    if (hl % 2)
      throw new Error("hex string expected, got unpadded hex of length " + hl);
    const array = new Uint8Array(al);
    for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
      const n1 = asciiToBase162(hex.charCodeAt(hi));
      const n2 = asciiToBase162(hex.charCodeAt(hi + 1));
      if (n1 === void 0 || n2 === void 0) {
        const char = hex[hi] + hex[hi + 1];
        throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
      }
      array[ai] = n1 * 16 + n2;
    }
    return array;
  }
  __name(hexToBytes2, "hexToBytes");
  function bytesToNumberBE2(bytes) {
    return hexToNumber2(bytesToHex2(bytes));
  }
  __name(bytesToNumberBE2, "bytesToNumberBE");
  function bytesToNumberLE2(bytes) {
    abytes4(bytes);
    return hexToNumber2(bytesToHex2(Uint8Array.from(bytes).reverse()));
  }
  __name(bytesToNumberLE2, "bytesToNumberLE");
  function numberToBytesBE2(n, len) {
    return hexToBytes2(n.toString(16).padStart(len * 2, "0"));
  }
  __name(numberToBytesBE2, "numberToBytesBE");
  function numberToBytesLE2(n, len) {
    return numberToBytesBE2(n, len).reverse();
  }
  __name(numberToBytesLE2, "numberToBytesLE");
  function numberToVarBytesBE2(n) {
    return hexToBytes2(numberToHexUnpadded2(n));
  }
  __name(numberToVarBytesBE2, "numberToVarBytesBE");
  function ensureBytes2(title, hex, expectedLength) {
    let res;
    if (typeof hex === "string") {
      try {
        res = hexToBytes2(hex);
      } catch (e) {
        throw new Error(title + " must be hex string or Uint8Array, cause: " + e);
      }
    } else if (isBytes5(hex)) {
      res = Uint8Array.from(hex);
    } else {
      throw new Error(title + " must be hex string or Uint8Array");
    }
    const len = res.length;
    if (typeof expectedLength === "number" && len !== expectedLength)
      throw new Error(title + " of length " + expectedLength + " expected, got " + len);
    return res;
  }
  __name(ensureBytes2, "ensureBytes");
  function concatBytes3(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
      const a = arrays[i];
      abytes4(a);
      sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
      const a = arrays[i];
      res.set(a, pad);
      pad += a.length;
    }
    return res;
  }
  __name(concatBytes3, "concatBytes");
  function equalBytes2(a, b) {
    if (a.length !== b.length)
      return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++)
      diff |= a[i] ^ b[i];
    return diff === 0;
  }
  __name(equalBytes2, "equalBytes");
  function utf8ToBytes4(str) {
    if (typeof str !== "string")
      throw new Error("string expected");
    return new Uint8Array(new TextEncoder().encode(str));
  }
  __name(utf8ToBytes4, "utf8ToBytes");
  var isPosBig2 = /* @__PURE__ */ __name((n) => typeof n === "bigint" && _0n3 <= n, "isPosBig");
  function inRange2(n, min, max) {
    return isPosBig2(n) && isPosBig2(min) && isPosBig2(max) && min <= n && n < max;
  }
  __name(inRange2, "inRange");
  function aInRange2(title, n, min, max) {
    if (!inRange2(n, min, max))
      throw new Error("expected valid " + title + ": " + min + " <= n < " + max + ", got " + n);
  }
  __name(aInRange2, "aInRange");
  function bitLen2(n) {
    let len;
    for (len = 0; n > _0n3; n >>= _1n3, len += 1)
      ;
    return len;
  }
  __name(bitLen2, "bitLen");
  function bitGet2(n, pos) {
    return n >> BigInt(pos) & _1n3;
  }
  __name(bitGet2, "bitGet");
  function bitSet2(n, pos, value) {
    return n | (value ? _1n3 : _0n3) << BigInt(pos);
  }
  __name(bitSet2, "bitSet");
  var bitMask2 = /* @__PURE__ */ __name((n) => (_2n3 << BigInt(n - 1)) - _1n3, "bitMask");
  var u8n2 = /* @__PURE__ */ __name((data) => new Uint8Array(data), "u8n");
  var u8fr2 = /* @__PURE__ */ __name((arr) => Uint8Array.from(arr), "u8fr");
  function createHmacDrbg2(hashLen, qByteLen, hmacFn) {
    if (typeof hashLen !== "number" || hashLen < 2)
      throw new Error("hashLen must be a number");
    if (typeof qByteLen !== "number" || qByteLen < 2)
      throw new Error("qByteLen must be a number");
    if (typeof hmacFn !== "function")
      throw new Error("hmacFn must be a function");
    let v = u8n2(hashLen);
    let k = u8n2(hashLen);
    let i = 0;
    const reset = /* @__PURE__ */ __name(() => {
      v.fill(1);
      k.fill(0);
      i = 0;
    }, "reset");
    const h = /* @__PURE__ */ __name((...b) => hmacFn(k, v, ...b), "h");
    const reseed = /* @__PURE__ */ __name((seed = u8n2()) => {
      k = h(u8fr2([0]), seed);
      v = h();
      if (seed.length === 0)
        return;
      k = h(u8fr2([1]), seed);
      v = h();
    }, "reseed");
    const gen3 = /* @__PURE__ */ __name(() => {
      if (i++ >= 1e3)
        throw new Error("drbg: tried 1000 values");
      let len = 0;
      const out = [];
      while (len < qByteLen) {
        v = h();
        const sl = v.slice();
        out.push(sl);
        len += v.length;
      }
      return concatBytes3(...out);
    }, "gen");
    const genUntil = /* @__PURE__ */ __name((seed, pred) => {
      reset();
      reseed(seed);
      let res = void 0;
      while (!(res = pred(gen3())))
        reseed();
      reset();
      return res;
    }, "genUntil");
    return genUntil;
  }
  __name(createHmacDrbg2, "createHmacDrbg");
  var validatorFns2 = {
    bigint: /* @__PURE__ */ __name((val) => typeof val === "bigint", "bigint"),
    function: /* @__PURE__ */ __name((val) => typeof val === "function", "function"),
    boolean: /* @__PURE__ */ __name((val) => typeof val === "boolean", "boolean"),
    string: /* @__PURE__ */ __name((val) => typeof val === "string", "string"),
    stringOrUint8Array: /* @__PURE__ */ __name((val) => typeof val === "string" || isBytes5(val), "stringOrUint8Array"),
    isSafeInteger: /* @__PURE__ */ __name((val) => Number.isSafeInteger(val), "isSafeInteger"),
    array: /* @__PURE__ */ __name((val) => Array.isArray(val), "array"),
    field: /* @__PURE__ */ __name((val, object) => object.Fp.isValid(val), "field"),
    hash: /* @__PURE__ */ __name((val) => typeof val === "function" && Number.isSafeInteger(val.outputLen), "hash")
  };
  function validateObject2(object, validators, optValidators = {}) {
    const checkField = /* @__PURE__ */ __name((fieldName, type, isOptional) => {
      const checkVal = validatorFns2[type];
      if (typeof checkVal !== "function")
        throw new Error("invalid validator function");
      const val = object[fieldName];
      if (isOptional && val === void 0)
        return;
      if (!checkVal(val, object)) {
        throw new Error("param " + String(fieldName) + " is invalid. Expected " + type + ", got " + val);
      }
    }, "checkField");
    for (const [fieldName, type] of Object.entries(validators))
      checkField(fieldName, type, false);
    for (const [fieldName, type] of Object.entries(optValidators))
      checkField(fieldName, type, true);
    return object;
  }
  __name(validateObject2, "validateObject");
  var notImplemented2 = /* @__PURE__ */ __name(() => {
    throw new Error("not implemented");
  }, "notImplemented");
  function memoized2(fn) {
    const map2 = /* @__PURE__ */ new WeakMap();
    return (arg, ...args) => {
      const val = map2.get(arg);
      if (val !== void 0)
        return val;
      const computed = fn(arg, ...args);
      map2.set(arg, computed);
      return computed;
    };
  }
  __name(memoized2, "memoized");

  // node_modules/@scure/starknet/node_modules/@noble/curves/esm/abstract/modular.js
  var _0n4 = BigInt(0);
  var _1n4 = BigInt(1);
  var _2n4 = /* @__PURE__ */ BigInt(2);
  var _3n = /* @__PURE__ */ BigInt(3);
  var _4n = /* @__PURE__ */ BigInt(4);
  var _5n = /* @__PURE__ */ BigInt(5);
  var _8n = /* @__PURE__ */ BigInt(8);
  var _9n = /* @__PURE__ */ BigInt(9);
  var _16n = /* @__PURE__ */ BigInt(16);
  function mod(a, b) {
    const result = a % b;
    return result >= _0n4 ? result : b + result;
  }
  __name(mod, "mod");
  function pow(num, power, modulo) {
    if (power < _0n4)
      throw new Error("invalid exponent, negatives unsupported");
    if (modulo <= _0n4)
      throw new Error("invalid modulus");
    if (modulo === _1n4)
      return _0n4;
    let res = _1n4;
    while (power > _0n4) {
      if (power & _1n4)
        res = res * num % modulo;
      num = num * num % modulo;
      power >>= _1n4;
    }
    return res;
  }
  __name(pow, "pow");
  function invert(number, modulo) {
    if (number === _0n4)
      throw new Error("invert: expected non-zero number");
    if (modulo <= _0n4)
      throw new Error("invert: expected positive modulus, got " + modulo);
    let a = mod(number, modulo);
    let b = modulo;
    let x = _0n4, y = _1n4, u = _1n4, v = _0n4;
    while (a !== _0n4) {
      const q = b / a;
      const r = b % a;
      const m = x - u * q;
      const n = y - v * q;
      b = a, a = r, x = u, y = v, u = m, v = n;
    }
    const gcd2 = b;
    if (gcd2 !== _1n4)
      throw new Error("invert: does not exist");
    return mod(x, modulo);
  }
  __name(invert, "invert");
  function tonelliShanks(P) {
    const legendreC = (P - _1n4) / _2n4;
    let Q, S, Z;
    for (Q = P - _1n4, S = 0; Q % _2n4 === _0n4; Q /= _2n4, S++)
      ;
    for (Z = _2n4; Z < P && pow(Z, legendreC, P) !== P - _1n4; Z++) {
      if (Z > 1e3)
        throw new Error("Cannot find square root: likely non-prime P");
    }
    if (S === 1) {
      const p1div4 = (P + _1n4) / _4n;
      return /* @__PURE__ */ __name(function tonelliFast(Fp, n) {
        const root = Fp.pow(n, p1div4);
        if (!Fp.eql(Fp.sqr(root), n))
          throw new Error("Cannot find square root");
        return root;
      }, "tonelliFast");
    }
    const Q1div2 = (Q + _1n4) / _2n4;
    return /* @__PURE__ */ __name(function tonelliSlow(Fp, n) {
      if (Fp.pow(n, legendreC) === Fp.neg(Fp.ONE))
        throw new Error("Cannot find square root");
      let r = S;
      let g2 = Fp.pow(Fp.mul(Fp.ONE, Z), Q);
      let x = Fp.pow(n, Q1div2);
      let b = Fp.pow(n, Q);
      while (!Fp.eql(b, Fp.ONE)) {
        if (Fp.eql(b, Fp.ZERO))
          return Fp.ZERO;
        let m = 1;
        for (let t2 = Fp.sqr(b); m < r; m++) {
          if (Fp.eql(t2, Fp.ONE))
            break;
          t2 = Fp.sqr(t2);
        }
        const ge = Fp.pow(g2, _1n4 << BigInt(r - m - 1));
        g2 = Fp.sqr(ge);
        x = Fp.mul(x, ge);
        b = Fp.mul(b, g2);
        r = m;
      }
      return x;
    }, "tonelliSlow");
  }
  __name(tonelliShanks, "tonelliShanks");
  function FpSqrt(P) {
    if (P % _4n === _3n) {
      const p1div4 = (P + _1n4) / _4n;
      return /* @__PURE__ */ __name(function sqrt3mod4(Fp, n) {
        const root = Fp.pow(n, p1div4);
        if (!Fp.eql(Fp.sqr(root), n))
          throw new Error("Cannot find square root");
        return root;
      }, "sqrt3mod4");
    }
    if (P % _8n === _5n) {
      const c1 = (P - _5n) / _8n;
      return /* @__PURE__ */ __name(function sqrt5mod8(Fp, n) {
        const n2 = Fp.mul(n, _2n4);
        const v = Fp.pow(n2, c1);
        const nv = Fp.mul(n, v);
        const i = Fp.mul(Fp.mul(nv, _2n4), v);
        const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
        if (!Fp.eql(Fp.sqr(root), n))
          throw new Error("Cannot find square root");
        return root;
      }, "sqrt5mod8");
    }
    if (P % _16n === _9n) {
    }
    return tonelliShanks(P);
  }
  __name(FpSqrt, "FpSqrt");
  var FIELD_FIELDS = [
    "create",
    "isValid",
    "is0",
    "neg",
    "inv",
    "sqrt",
    "sqr",
    "eql",
    "add",
    "sub",
    "mul",
    "pow",
    "div",
    "addN",
    "subN",
    "mulN",
    "sqrN"
  ];
  function validateField(field) {
    const initial = {
      ORDER: "bigint",
      MASK: "bigint",
      BYTES: "isSafeInteger",
      BITS: "isSafeInteger"
    };
    const opts = FIELD_FIELDS.reduce((map2, val) => {
      map2[val] = "function";
      return map2;
    }, initial);
    return validateObject2(field, opts);
  }
  __name(validateField, "validateField");
  function FpPow(f, num, power) {
    if (power < _0n4)
      throw new Error("invalid exponent, negatives unsupported");
    if (power === _0n4)
      return f.ONE;
    if (power === _1n4)
      return num;
    let p = f.ONE;
    let d = num;
    while (power > _0n4) {
      if (power & _1n4)
        p = f.mul(p, d);
      d = f.sqr(d);
      power >>= _1n4;
    }
    return p;
  }
  __name(FpPow, "FpPow");
  function FpInvertBatch(f, nums) {
    const tmp = new Array(nums.length);
    const lastMultiplied = nums.reduce((acc, num, i) => {
      if (f.is0(num))
        return acc;
      tmp[i] = acc;
      return f.mul(acc, num);
    }, f.ONE);
    const inverted = f.inv(lastMultiplied);
    nums.reduceRight((acc, num, i) => {
      if (f.is0(num))
        return acc;
      tmp[i] = f.mul(acc, tmp[i]);
      return f.mul(acc, num);
    }, inverted);
    return tmp;
  }
  __name(FpInvertBatch, "FpInvertBatch");
  function nLength(n, nBitLength2) {
    const _nBitLength = nBitLength2 !== void 0 ? nBitLength2 : n.toString(2).length;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return { nBitLength: _nBitLength, nByteLength };
  }
  __name(nLength, "nLength");
  function Field(ORDER, bitLen3, isLE3 = false, redef = {}) {
    if (ORDER <= _0n4)
      throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
    const { nBitLength: BITS, nByteLength: BYTES } = nLength(ORDER, bitLen3);
    if (BYTES > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    let sqrtP;
    const f = Object.freeze({
      ORDER,
      BITS,
      BYTES,
      MASK: bitMask2(BITS),
      ZERO: _0n4,
      ONE: _1n4,
      create: /* @__PURE__ */ __name((num) => mod(num, ORDER), "create"),
      isValid: /* @__PURE__ */ __name((num) => {
        if (typeof num !== "bigint")
          throw new Error("invalid field element: expected bigint, got " + typeof num);
        return _0n4 <= num && num < ORDER;
      }, "isValid"),
      is0: /* @__PURE__ */ __name((num) => num === _0n4, "is0"),
      isOdd: /* @__PURE__ */ __name((num) => (num & _1n4) === _1n4, "isOdd"),
      neg: /* @__PURE__ */ __name((num) => mod(-num, ORDER), "neg"),
      eql: /* @__PURE__ */ __name((lhs, rhs) => lhs === rhs, "eql"),
      sqr: /* @__PURE__ */ __name((num) => mod(num * num, ORDER), "sqr"),
      add: /* @__PURE__ */ __name((lhs, rhs) => mod(lhs + rhs, ORDER), "add"),
      sub: /* @__PURE__ */ __name((lhs, rhs) => mod(lhs - rhs, ORDER), "sub"),
      mul: /* @__PURE__ */ __name((lhs, rhs) => mod(lhs * rhs, ORDER), "mul"),
      pow: /* @__PURE__ */ __name((num, power) => FpPow(f, num, power), "pow"),
      div: /* @__PURE__ */ __name((lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER), "div"),
      // Same as above, but doesn't normalize
      sqrN: /* @__PURE__ */ __name((num) => num * num, "sqrN"),
      addN: /* @__PURE__ */ __name((lhs, rhs) => lhs + rhs, "addN"),
      subN: /* @__PURE__ */ __name((lhs, rhs) => lhs - rhs, "subN"),
      mulN: /* @__PURE__ */ __name((lhs, rhs) => lhs * rhs, "mulN"),
      inv: /* @__PURE__ */ __name((num) => invert(num, ORDER), "inv"),
      sqrt: redef.sqrt || ((n) => {
        if (!sqrtP)
          sqrtP = FpSqrt(ORDER);
        return sqrtP(f, n);
      }),
      invertBatch: /* @__PURE__ */ __name((lst) => FpInvertBatch(f, lst), "invertBatch"),
      // TODO: do we really need constant cmov?
      // We don't have const-time bigints anyway, so probably will be not very useful
      cmov: /* @__PURE__ */ __name((a, b, c) => c ? b : a, "cmov"),
      toBytes: /* @__PURE__ */ __name((num) => isLE3 ? numberToBytesLE2(num, BYTES) : numberToBytesBE2(num, BYTES), "toBytes"),
      fromBytes: /* @__PURE__ */ __name((bytes) => {
        if (bytes.length !== BYTES)
          throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
        return isLE3 ? bytesToNumberLE2(bytes) : bytesToNumberBE2(bytes);
      }, "fromBytes")
    });
    return Object.freeze(f);
  }
  __name(Field, "Field");
  function getFieldBytesLength(fieldOrder) {
    if (typeof fieldOrder !== "bigint")
      throw new Error("field order must be bigint");
    const bitLength = fieldOrder.toString(2).length;
    return Math.ceil(bitLength / 8);
  }
  __name(getFieldBytesLength, "getFieldBytesLength");
  function getMinHashLength(fieldOrder) {
    const length = getFieldBytesLength(fieldOrder);
    return length + Math.ceil(length / 2);
  }
  __name(getMinHashLength, "getMinHashLength");
  function mapHashToField(key, fieldOrder, isLE3 = false) {
    const len = key.length;
    const fieldLen = getFieldBytesLength(fieldOrder);
    const minLen = getMinHashLength(fieldOrder);
    if (len < 16 || len < minLen || len > 1024)
      throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
    const num = isLE3 ? bytesToNumberBE2(key) : bytesToNumberLE2(key);
    const reduced = mod(num, fieldOrder - _1n4) + _1n4;
    return isLE3 ? numberToBytesLE2(reduced, fieldLen) : numberToBytesBE2(reduced, fieldLen);
  }
  __name(mapHashToField, "mapHashToField");

  // node_modules/@scure/starknet/node_modules/@noble/curves/esm/abstract/poseidon.js
  function validateOpts(opts) {
    const { Fp, mds, reversePartialPowIdx: rev, roundConstants: rc } = opts;
    const { roundsFull, roundsPartial, sboxPower, t } = opts;
    validateField(Fp);
    for (const i of ["t", "roundsFull", "roundsPartial"]) {
      if (typeof opts[i] !== "number" || !Number.isSafeInteger(opts[i]))
        throw new Error("invalid number " + i);
    }
    if (!Array.isArray(mds) || mds.length !== t)
      throw new Error("Poseidon: invalid MDS matrix");
    const _mds = mds.map((mdsRow) => {
      if (!Array.isArray(mdsRow) || mdsRow.length !== t)
        throw new Error("invalid MDS matrix row: " + mdsRow);
      return mdsRow.map((i) => {
        if (typeof i !== "bigint")
          throw new Error("invalid MDS matrix bigint: " + i);
        return Fp.create(i);
      });
    });
    if (rev !== void 0 && typeof rev !== "boolean")
      throw new Error("invalid param reversePartialPowIdx=" + rev);
    if (roundsFull & 1)
      throw new Error("roundsFull is not even" + roundsFull);
    const rounds = roundsFull + roundsPartial;
    if (!Array.isArray(rc) || rc.length !== rounds)
      throw new Error("Poseidon: invalid round constants");
    const roundConstants = rc.map((rc2) => {
      if (!Array.isArray(rc2) || rc2.length !== t)
        throw new Error("invalid round constants");
      return rc2.map((i) => {
        if (typeof i !== "bigint" || !Fp.isValid(i))
          throw new Error("invalid round constant");
        return Fp.create(i);
      });
    });
    if (!sboxPower || ![3, 5, 7].includes(sboxPower))
      throw new Error("invalid sboxPower");
    const _sboxPower = BigInt(sboxPower);
    let sboxFn = /* @__PURE__ */ __name((n) => FpPow(Fp, n, _sboxPower), "sboxFn");
    if (sboxPower === 3)
      sboxFn = /* @__PURE__ */ __name((n) => Fp.mul(Fp.sqrN(n), n), "sboxFn");
    else if (sboxPower === 5)
      sboxFn = /* @__PURE__ */ __name((n) => Fp.mul(Fp.sqrN(Fp.sqrN(n)), n), "sboxFn");
    return Object.freeze({ ...opts, rounds, sboxFn, roundConstants, mds: _mds });
  }
  __name(validateOpts, "validateOpts");
  function poseidon(opts) {
    const _opts = validateOpts(opts);
    const { Fp, mds, roundConstants, rounds: totalRounds, roundsPartial, sboxFn, t } = _opts;
    const halfRoundsFull = _opts.roundsFull / 2;
    const partialIdx = _opts.reversePartialPowIdx ? t - 1 : 0;
    const poseidonRound = /* @__PURE__ */ __name((values, isFull, idx) => {
      values = values.map((i, j) => Fp.add(i, roundConstants[idx][j]));
      if (isFull)
        values = values.map((i) => sboxFn(i));
      else
        values[partialIdx] = sboxFn(values[partialIdx]);
      values = mds.map((i) => i.reduce((acc, i2, j) => Fp.add(acc, Fp.mulN(i2, values[j])), Fp.ZERO));
      return values;
    }, "poseidonRound");
    const poseidonHash2 = /* @__PURE__ */ __name(function poseidonHash3(values) {
      if (!Array.isArray(values) || values.length !== t)
        throw new Error("invalid values, expected array of bigints with length " + t);
      values = values.map((i) => {
        if (typeof i !== "bigint")
          throw new Error("invalid bigint=" + i);
        return Fp.create(i);
      });
      let lastRound = 0;
      for (let i = 0; i < halfRoundsFull; i++)
        values = poseidonRound(values, true, lastRound++);
      for (let i = 0; i < roundsPartial; i++)
        values = poseidonRound(values, false, lastRound++);
      for (let i = 0; i < halfRoundsFull; i++)
        values = poseidonRound(values, true, lastRound++);
      if (lastRound !== totalRounds)
        throw new Error("invalid number of rounds");
      return values;
    }, "poseidonHash");
    poseidonHash2.roundConstants = roundConstants;
    return poseidonHash2;
  }
  __name(poseidon, "poseidon");

  // node_modules/@scure/starknet/node_modules/@noble/curves/esm/abstract/curve.js
  var _0n5 = BigInt(0);
  var _1n5 = BigInt(1);
  function constTimeNegate(condition, item) {
    const neg = item.negate();
    return condition ? neg : item;
  }
  __name(constTimeNegate, "constTimeNegate");
  function validateW(W, bits) {
    if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
      throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
  }
  __name(validateW, "validateW");
  function calcWOpts(W, bits) {
    validateW(W, bits);
    const windows = Math.ceil(bits / W) + 1;
    const windowSize = 2 ** (W - 1);
    return { windows, windowSize };
  }
  __name(calcWOpts, "calcWOpts");
  function validateMSMPoints(points, c) {
    if (!Array.isArray(points))
      throw new Error("array expected");
    points.forEach((p, i) => {
      if (!(p instanceof c))
        throw new Error("invalid point at index " + i);
    });
  }
  __name(validateMSMPoints, "validateMSMPoints");
  function validateMSMScalars(scalars, field) {
    if (!Array.isArray(scalars))
      throw new Error("array of scalars expected");
    scalars.forEach((s, i) => {
      if (!field.isValid(s))
        throw new Error("invalid scalar at index " + i);
    });
  }
  __name(validateMSMScalars, "validateMSMScalars");
  var pointPrecomputes = /* @__PURE__ */ new WeakMap();
  var pointWindowSizes = /* @__PURE__ */ new WeakMap();
  function getW(P) {
    return pointWindowSizes.get(P) || 1;
  }
  __name(getW, "getW");
  function wNAF(c, bits) {
    return {
      constTimeNegate,
      hasPrecomputes(elm) {
        return getW(elm) !== 1;
      },
      // non-const time multiplication ladder
      unsafeLadder(elm, n, p = c.ZERO) {
        let d = elm;
        while (n > _0n5) {
          if (n & _1n5)
            p = p.add(d);
          d = d.double();
          n >>= _1n5;
        }
        return p;
      },
      /**
       * Creates a wNAF precomputation window. Used for caching.
       * Default window size is set by `utils.precompute()` and is equal to 8.
       * Number of precomputed points depends on the curve size:
       * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
       * - 𝑊 is the window size
       * - 𝑛 is the bitlength of the curve order.
       * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
       * @param elm Point instance
       * @param W window size
       * @returns precomputed point tables flattened to a single array
       */
      precomputeWindow(elm, W) {
        const { windows, windowSize } = calcWOpts(W, bits);
        const points = [];
        let p = elm;
        let base2 = p;
        for (let window2 = 0; window2 < windows; window2++) {
          base2 = p;
          points.push(base2);
          for (let i = 1; i < windowSize; i++) {
            base2 = base2.add(p);
            points.push(base2);
          }
          p = base2.double();
        }
        return points;
      },
      /**
       * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
       * @param W window size
       * @param precomputes precomputed tables
       * @param n scalar (we don't check here, but should be less than curve order)
       * @returns real and fake (for const-time) points
       */
      wNAF(W, precomputes, n) {
        const { windows, windowSize } = calcWOpts(W, bits);
        let p = c.ZERO;
        let f = c.BASE;
        const mask = BigInt(2 ** W - 1);
        const maxNumber = 2 ** W;
        const shiftBy = BigInt(W);
        for (let window2 = 0; window2 < windows; window2++) {
          const offset = window2 * windowSize;
          let wbits = Number(n & mask);
          n >>= shiftBy;
          if (wbits > windowSize) {
            wbits -= maxNumber;
            n += _1n5;
          }
          const offset1 = offset;
          const offset2 = offset + Math.abs(wbits) - 1;
          const cond1 = window2 % 2 !== 0;
          const cond2 = wbits < 0;
          if (wbits === 0) {
            f = f.add(constTimeNegate(cond1, precomputes[offset1]));
          } else {
            p = p.add(constTimeNegate(cond2, precomputes[offset2]));
          }
        }
        return { p, f };
      },
      /**
       * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
       * @param W window size
       * @param precomputes precomputed tables
       * @param n scalar (we don't check here, but should be less than curve order)
       * @param acc accumulator point to add result of multiplication
       * @returns point
       */
      wNAFUnsafe(W, precomputes, n, acc = c.ZERO) {
        const { windows, windowSize } = calcWOpts(W, bits);
        const mask = BigInt(2 ** W - 1);
        const maxNumber = 2 ** W;
        const shiftBy = BigInt(W);
        for (let window2 = 0; window2 < windows; window2++) {
          const offset = window2 * windowSize;
          if (n === _0n5)
            break;
          let wbits = Number(n & mask);
          n >>= shiftBy;
          if (wbits > windowSize) {
            wbits -= maxNumber;
            n += _1n5;
          }
          if (wbits === 0)
            continue;
          let curr = precomputes[offset + Math.abs(wbits) - 1];
          if (wbits < 0)
            curr = curr.negate();
          acc = acc.add(curr);
        }
        return acc;
      },
      getPrecomputes(W, P, transform) {
        let comp = pointPrecomputes.get(P);
        if (!comp) {
          comp = this.precomputeWindow(P, W);
          if (W !== 1)
            pointPrecomputes.set(P, transform(comp));
        }
        return comp;
      },
      wNAFCached(P, n, transform) {
        const W = getW(P);
        return this.wNAF(W, this.getPrecomputes(W, P, transform), n);
      },
      wNAFCachedUnsafe(P, n, transform, prev) {
        const W = getW(P);
        if (W === 1)
          return this.unsafeLadder(P, n, prev);
        return this.wNAFUnsafe(W, this.getPrecomputes(W, P, transform), n, prev);
      },
      // We calculate precomputes for elliptic curve point multiplication
      // using windowed method. This specifies window size and
      // stores precomputed values. Usually only base point would be precomputed.
      setWindowSize(P, W) {
        validateW(W, bits);
        pointWindowSizes.set(P, W);
        pointPrecomputes.delete(P);
      }
    };
  }
  __name(wNAF, "wNAF");
  function pippenger(c, fieldN, points, scalars) {
    validateMSMPoints(points, c);
    validateMSMScalars(scalars, fieldN);
    if (points.length !== scalars.length)
      throw new Error("arrays of points and scalars must have equal length");
    const zero2 = c.ZERO;
    const wbits = bitLen2(BigInt(points.length));
    const windowSize = wbits > 12 ? wbits - 3 : wbits > 4 ? wbits - 2 : wbits ? 2 : 1;
    const MASK = (1 << windowSize) - 1;
    const buckets = new Array(MASK + 1).fill(zero2);
    const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
    let sum = zero2;
    for (let i = lastBits; i >= 0; i -= windowSize) {
      buckets.fill(zero2);
      for (let j = 0; j < scalars.length; j++) {
        const scalar = scalars[j];
        const wbits2 = Number(scalar >> BigInt(i) & BigInt(MASK));
        buckets[wbits2] = buckets[wbits2].add(points[j]);
      }
      let resI = zero2;
      for (let j = buckets.length - 1, sumI = zero2; j > 0; j--) {
        sumI = sumI.add(buckets[j]);
        resI = resI.add(sumI);
      }
      sum = sum.add(resI);
      if (i !== 0)
        for (let j = 0; j < windowSize; j++)
          sum = sum.double();
    }
    return sum;
  }
  __name(pippenger, "pippenger");
  function validateBasic(curve2) {
    validateField(curve2.Fp);
    validateObject2(curve2, {
      n: "bigint",
      h: "bigint",
      Gx: "field",
      Gy: "field"
    }, {
      nBitLength: "isSafeInteger",
      nByteLength: "isSafeInteger"
    });
    return Object.freeze({
      ...nLength(curve2.n, curve2.nBitLength),
      ...curve2,
      ...{ p: curve2.Fp.ORDER }
    });
  }
  __name(validateBasic, "validateBasic");

  // node_modules/@scure/starknet/node_modules/@noble/curves/esm/abstract/weierstrass.js
  function validateSigVerOpts(opts) {
    if (opts.lowS !== void 0)
      abool2("lowS", opts.lowS);
    if (opts.prehash !== void 0)
      abool2("prehash", opts.prehash);
  }
  __name(validateSigVerOpts, "validateSigVerOpts");
  function validatePointOpts(curve2) {
    const opts = validateBasic(curve2);
    validateObject2(opts, {
      a: "field",
      b: "field"
    }, {
      allowedPrivateKeyLengths: "array",
      wrapPrivateKey: "boolean",
      isTorsionFree: "function",
      clearCofactor: "function",
      allowInfinityPoint: "boolean",
      fromBytes: "function",
      toBytes: "function"
    });
    const { endo, Fp, a } = opts;
    if (endo) {
      if (!Fp.eql(a, Fp.ZERO)) {
        throw new Error("invalid endomorphism, can only be defined for Koblitz curves that have a=0");
      }
      if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
        throw new Error("invalid endomorphism, expected beta: bigint and splitScalar: function");
      }
    }
    return Object.freeze({ ...opts });
  }
  __name(validatePointOpts, "validatePointOpts");
  var { bytesToNumberBE: b2n, hexToBytes: h2b } = utils_exports2;
  var DER = {
    // asn.1 DER encoding utils
    Err: class DERErr extends Error {
      static {
        __name(this, "DERErr");
      }
      constructor(m = "") {
        super(m);
      }
    },
    // Basic building block is TLV (Tag-Length-Value)
    _tlv: {
      encode: /* @__PURE__ */ __name((tag, data) => {
        const { Err: E } = DER;
        if (tag < 0 || tag > 256)
          throw new E("tlv.encode: wrong tag");
        if (data.length & 1)
          throw new E("tlv.encode: unpadded data");
        const dataLen = data.length / 2;
        const len = numberToHexUnpadded2(dataLen);
        if (len.length / 2 & 128)
          throw new E("tlv.encode: long form length too big");
        const lenLen = dataLen > 127 ? numberToHexUnpadded2(len.length / 2 | 128) : "";
        const t = numberToHexUnpadded2(tag);
        return t + lenLen + len + data;
      }, "encode"),
      // v - value, l - left bytes (unparsed)
      decode(tag, data) {
        const { Err: E } = DER;
        let pos = 0;
        if (tag < 0 || tag > 256)
          throw new E("tlv.encode: wrong tag");
        if (data.length < 2 || data[pos++] !== tag)
          throw new E("tlv.decode: wrong tlv");
        const first = data[pos++];
        const isLong = !!(first & 128);
        let length = 0;
        if (!isLong)
          length = first;
        else {
          const lenLen = first & 127;
          if (!lenLen)
            throw new E("tlv.decode(long): indefinite length not supported");
          if (lenLen > 4)
            throw new E("tlv.decode(long): byte length is too big");
          const lengthBytes = data.subarray(pos, pos + lenLen);
          if (lengthBytes.length !== lenLen)
            throw new E("tlv.decode: length bytes not complete");
          if (lengthBytes[0] === 0)
            throw new E("tlv.decode(long): zero leftmost byte");
          for (const b of lengthBytes)
            length = length << 8 | b;
          pos += lenLen;
          if (length < 128)
            throw new E("tlv.decode(long): not minimal encoding");
        }
        const v = data.subarray(pos, pos + length);
        if (v.length !== length)
          throw new E("tlv.decode: wrong value length");
        return { v, l: data.subarray(pos + length) };
      }
    },
    // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
    // since we always use positive integers here. It must always be empty:
    // - add zero byte if exists
    // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
    _int: {
      encode(num) {
        const { Err: E } = DER;
        if (num < _0n6)
          throw new E("integer: negative integers are not allowed");
        let hex = numberToHexUnpadded2(num);
        if (Number.parseInt(hex[0], 16) & 8)
          hex = "00" + hex;
        if (hex.length & 1)
          throw new E("unexpected DER parsing assertion: unpadded hex");
        return hex;
      },
      decode(data) {
        const { Err: E } = DER;
        if (data[0] & 128)
          throw new E("invalid signature integer: negative");
        if (data[0] === 0 && !(data[1] & 128))
          throw new E("invalid signature integer: unnecessary leading zero");
        return b2n(data);
      }
    },
    toSig(hex) {
      const { Err: E, _int: int, _tlv: tlv } = DER;
      const data = typeof hex === "string" ? h2b(hex) : hex;
      abytes4(data);
      const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
      if (seqLeftBytes.length)
        throw new E("invalid signature: left bytes after parsing");
      const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
      const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
      if (sLeftBytes.length)
        throw new E("invalid signature: left bytes after parsing");
      return { r: int.decode(rBytes), s: int.decode(sBytes) };
    },
    hexFromSig(sig) {
      const { _tlv: tlv, _int: int } = DER;
      const rs = tlv.encode(2, int.encode(sig.r));
      const ss = tlv.encode(2, int.encode(sig.s));
      const seq = rs + ss;
      return tlv.encode(48, seq);
    }
  };
  var _0n6 = BigInt(0);
  var _1n6 = BigInt(1);
  var _2n5 = BigInt(2);
  var _3n2 = BigInt(3);
  var _4n2 = BigInt(4);
  function weierstrassPoints(opts) {
    const CURVE2 = validatePointOpts(opts);
    const { Fp } = CURVE2;
    const Fn = Field(CURVE2.n, CURVE2.nBitLength);
    const toBytes4 = CURVE2.toBytes || ((_c, point, _isCompressed) => {
      const a = point.toAffine();
      return concatBytes3(Uint8Array.from([4]), Fp.toBytes(a.x), Fp.toBytes(a.y));
    });
    const fromBytes = CURVE2.fromBytes || ((bytes) => {
      const tail = bytes.subarray(1);
      const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
      const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
      return { x, y };
    });
    function weierstrassEquation(x) {
      const { a, b } = CURVE2;
      const x2 = Fp.sqr(x);
      const x3 = Fp.mul(x2, x);
      return Fp.add(Fp.add(x3, Fp.mul(x, a)), b);
    }
    __name(weierstrassEquation, "weierstrassEquation");
    if (!Fp.eql(Fp.sqr(CURVE2.Gy), weierstrassEquation(CURVE2.Gx)))
      throw new Error("bad generator point: equation left != right");
    function isWithinCurveOrder(num) {
      return inRange2(num, _1n6, CURVE2.n);
    }
    __name(isWithinCurveOrder, "isWithinCurveOrder");
    function normPrivateKeyToScalar(key) {
      const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n: N } = CURVE2;
      if (lengths && typeof key !== "bigint") {
        if (isBytes5(key))
          key = bytesToHex2(key);
        if (typeof key !== "string" || !lengths.includes(key.length))
          throw new Error("invalid private key");
        key = key.padStart(nByteLength * 2, "0");
      }
      let num;
      try {
        num = typeof key === "bigint" ? key : bytesToNumberBE2(ensureBytes2("private key", key, nByteLength));
      } catch (error2) {
        throw new Error("invalid private key, expected hex or " + nByteLength + " bytes, got " + typeof key);
      }
      if (wrapPrivateKey)
        num = mod(num, N);
      aInRange2("private key", num, _1n6, N);
      return num;
    }
    __name(normPrivateKeyToScalar, "normPrivateKeyToScalar");
    function assertPrjPoint(other) {
      if (!(other instanceof Point2))
        throw new Error("ProjectivePoint expected");
    }
    __name(assertPrjPoint, "assertPrjPoint");
    const toAffineMemo = memoized2((p, iz) => {
      const { px: x, py: y, pz: z } = p;
      if (Fp.eql(z, Fp.ONE))
        return { x, y };
      const is0 = p.is0();
      if (iz == null)
        iz = is0 ? Fp.ONE : Fp.inv(z);
      const ax = Fp.mul(x, iz);
      const ay = Fp.mul(y, iz);
      const zz = Fp.mul(z, iz);
      if (is0)
        return { x: Fp.ZERO, y: Fp.ZERO };
      if (!Fp.eql(zz, Fp.ONE))
        throw new Error("invZ was invalid");
      return { x: ax, y: ay };
    });
    const assertValidMemo = memoized2((p) => {
      if (p.is0()) {
        if (CURVE2.allowInfinityPoint && !Fp.is0(p.py))
          return;
        throw new Error("bad point: ZERO");
      }
      const { x, y } = p.toAffine();
      if (!Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("bad point: x or y not FE");
      const left = Fp.sqr(y);
      const right = weierstrassEquation(x);
      if (!Fp.eql(left, right))
        throw new Error("bad point: equation left != right");
      if (!p.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
      return true;
    });
    class Point2 {
      static {
        __name(this, "Point");
      }
      constructor(px, py, pz) {
        this.px = px;
        this.py = py;
        this.pz = pz;
        if (px == null || !Fp.isValid(px))
          throw new Error("x required");
        if (py == null || !Fp.isValid(py))
          throw new Error("y required");
        if (pz == null || !Fp.isValid(pz))
          throw new Error("z required");
        Object.freeze(this);
      }
      // Does not validate if the point is on-curve.
      // Use fromHex instead, or call assertValidity() later.
      static fromAffine(p) {
        const { x, y } = p || {};
        if (!p || !Fp.isValid(x) || !Fp.isValid(y))
          throw new Error("invalid affine point");
        if (p instanceof Point2)
          throw new Error("projective point not allowed");
        const is0 = /* @__PURE__ */ __name((i) => Fp.eql(i, Fp.ZERO), "is0");
        if (is0(x) && is0(y))
          return Point2.ZERO;
        return new Point2(x, y, Fp.ONE);
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      /**
       * Takes a bunch of Projective Points but executes only one
       * inversion on all of them. Inversion is very slow operation,
       * so this improves performance massively.
       * Optimization: converts a list of projective points to a list of identical points with Z=1.
       */
      static normalizeZ(points) {
        const toInv = Fp.invertBatch(points.map((p) => p.pz));
        return points.map((p, i) => p.toAffine(toInv[i])).map(Point2.fromAffine);
      }
      /**
       * Converts hash string or Uint8Array to Point.
       * @param hex short/long ECDSA hex
       */
      static fromHex(hex) {
        const P = Point2.fromAffine(fromBytes(ensureBytes2("pointHex", hex)));
        P.assertValidity();
        return P;
      }
      // Multiplies generator point by privateKey.
      static fromPrivateKey(privateKey) {
        return Point2.BASE.multiply(normPrivateKeyToScalar(privateKey));
      }
      // Multiscalar Multiplication
      static msm(points, scalars) {
        return pippenger(Point2, Fn, points, scalars);
      }
      // "Private method", don't use it directly
      _setWindowSize(windowSize) {
        wnaf.setWindowSize(this, windowSize);
      }
      // A point on curve is valid if it conforms to equation.
      assertValidity() {
        assertValidMemo(this);
      }
      hasEvenY() {
        const { y } = this.toAffine();
        if (Fp.isOdd)
          return !Fp.isOdd(y);
        throw new Error("Field doesn't support isOdd");
      }
      /**
       * Compare one point to another.
       */
      equals(other) {
        assertPrjPoint(other);
        const { px: X1, py: Y1, pz: Z1 } = this;
        const { px: X2, py: Y2, pz: Z2 } = other;
        const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
        const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
        return U1 && U2;
      }
      /**
       * Flips point to one corresponding to (x, -y) in Affine coordinates.
       */
      negate() {
        return new Point2(this.px, Fp.neg(this.py), this.pz);
      }
      // Renes-Costello-Batina exception-free doubling formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 3
      // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
      double() {
        const { a, b } = CURVE2;
        const b3 = Fp.mul(b, _3n2);
        const { px: X1, py: Y1, pz: Z1 } = this;
        let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
        let t0 = Fp.mul(X1, X1);
        let t1 = Fp.mul(Y1, Y1);
        let t2 = Fp.mul(Z1, Z1);
        let t3 = Fp.mul(X1, Y1);
        t3 = Fp.add(t3, t3);
        Z3 = Fp.mul(X1, Z1);
        Z3 = Fp.add(Z3, Z3);
        X3 = Fp.mul(a, Z3);
        Y3 = Fp.mul(b3, t2);
        Y3 = Fp.add(X3, Y3);
        X3 = Fp.sub(t1, Y3);
        Y3 = Fp.add(t1, Y3);
        Y3 = Fp.mul(X3, Y3);
        X3 = Fp.mul(t3, X3);
        Z3 = Fp.mul(b3, Z3);
        t2 = Fp.mul(a, t2);
        t3 = Fp.sub(t0, t2);
        t3 = Fp.mul(a, t3);
        t3 = Fp.add(t3, Z3);
        Z3 = Fp.add(t0, t0);
        t0 = Fp.add(Z3, t0);
        t0 = Fp.add(t0, t2);
        t0 = Fp.mul(t0, t3);
        Y3 = Fp.add(Y3, t0);
        t2 = Fp.mul(Y1, Z1);
        t2 = Fp.add(t2, t2);
        t0 = Fp.mul(t2, t3);
        X3 = Fp.sub(X3, t0);
        Z3 = Fp.mul(t2, t1);
        Z3 = Fp.add(Z3, Z3);
        Z3 = Fp.add(Z3, Z3);
        return new Point2(X3, Y3, Z3);
      }
      // Renes-Costello-Batina exception-free addition formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 1
      // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
      add(other) {
        assertPrjPoint(other);
        const { px: X1, py: Y1, pz: Z1 } = this;
        const { px: X2, py: Y2, pz: Z2 } = other;
        let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
        const a = CURVE2.a;
        const b3 = Fp.mul(CURVE2.b, _3n2);
        let t0 = Fp.mul(X1, X2);
        let t1 = Fp.mul(Y1, Y2);
        let t2 = Fp.mul(Z1, Z2);
        let t3 = Fp.add(X1, Y1);
        let t4 = Fp.add(X2, Y2);
        t3 = Fp.mul(t3, t4);
        t4 = Fp.add(t0, t1);
        t3 = Fp.sub(t3, t4);
        t4 = Fp.add(X1, Z1);
        let t5 = Fp.add(X2, Z2);
        t4 = Fp.mul(t4, t5);
        t5 = Fp.add(t0, t2);
        t4 = Fp.sub(t4, t5);
        t5 = Fp.add(Y1, Z1);
        X3 = Fp.add(Y2, Z2);
        t5 = Fp.mul(t5, X3);
        X3 = Fp.add(t1, t2);
        t5 = Fp.sub(t5, X3);
        Z3 = Fp.mul(a, t4);
        X3 = Fp.mul(b3, t2);
        Z3 = Fp.add(X3, Z3);
        X3 = Fp.sub(t1, Z3);
        Z3 = Fp.add(t1, Z3);
        Y3 = Fp.mul(X3, Z3);
        t1 = Fp.add(t0, t0);
        t1 = Fp.add(t1, t0);
        t2 = Fp.mul(a, t2);
        t4 = Fp.mul(b3, t4);
        t1 = Fp.add(t1, t2);
        t2 = Fp.sub(t0, t2);
        t2 = Fp.mul(a, t2);
        t4 = Fp.add(t4, t2);
        t0 = Fp.mul(t1, t4);
        Y3 = Fp.add(Y3, t0);
        t0 = Fp.mul(t5, t4);
        X3 = Fp.mul(t3, X3);
        X3 = Fp.sub(X3, t0);
        t0 = Fp.mul(t3, t1);
        Z3 = Fp.mul(t5, Z3);
        Z3 = Fp.add(Z3, t0);
        return new Point2(X3, Y3, Z3);
      }
      subtract(other) {
        return this.add(other.negate());
      }
      is0() {
        return this.equals(Point2.ZERO);
      }
      wNAF(n) {
        return wnaf.wNAFCached(this, n, Point2.normalizeZ);
      }
      /**
       * Non-constant-time multiplication. Uses double-and-add algorithm.
       * It's faster, but should only be used when you don't care about
       * an exposed private key e.g. sig verification, which works over *public* keys.
       */
      multiplyUnsafe(sc) {
        const { endo, n: N } = CURVE2;
        aInRange2("scalar", sc, _0n6, N);
        const I = Point2.ZERO;
        if (sc === _0n6)
          return I;
        if (this.is0() || sc === _1n6)
          return this;
        if (!endo || wnaf.hasPrecomputes(this))
          return wnaf.wNAFCachedUnsafe(this, sc, Point2.normalizeZ);
        let { k1neg, k1, k2neg, k2 } = endo.splitScalar(sc);
        let k1p = I;
        let k2p = I;
        let d = this;
        while (k1 > _0n6 || k2 > _0n6) {
          if (k1 & _1n6)
            k1p = k1p.add(d);
          if (k2 & _1n6)
            k2p = k2p.add(d);
          d = d.double();
          k1 >>= _1n6;
          k2 >>= _1n6;
        }
        if (k1neg)
          k1p = k1p.negate();
        if (k2neg)
          k2p = k2p.negate();
        k2p = new Point2(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
        return k1p.add(k2p);
      }
      /**
       * Constant time multiplication.
       * Uses wNAF method. Windowed method may be 10% faster,
       * but takes 2x longer to generate and consumes 2x memory.
       * Uses precomputes when available.
       * Uses endomorphism for Koblitz curves.
       * @param scalar by which the point would be multiplied
       * @returns New point
       */
      multiply(scalar) {
        const { endo, n: N } = CURVE2;
        aInRange2("scalar", scalar, _1n6, N);
        let point, fake;
        if (endo) {
          const { k1neg, k1, k2neg, k2 } = endo.splitScalar(scalar);
          let { p: k1p, f: f1p } = this.wNAF(k1);
          let { p: k2p, f: f2p } = this.wNAF(k2);
          k1p = wnaf.constTimeNegate(k1neg, k1p);
          k2p = wnaf.constTimeNegate(k2neg, k2p);
          k2p = new Point2(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
          point = k1p.add(k2p);
          fake = f1p.add(f2p);
        } else {
          const { p, f } = this.wNAF(scalar);
          point = p;
          fake = f;
        }
        return Point2.normalizeZ([point, fake])[0];
      }
      /**
       * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
       * Not using Strauss-Shamir trick: precomputation tables are faster.
       * The trick could be useful if both P and Q are not G (not in our case).
       * @returns non-zero affine point
       */
      multiplyAndAddUnsafe(Q, a, b) {
        const G = Point2.BASE;
        const mul = /* @__PURE__ */ __name((P, a2) => a2 === _0n6 || a2 === _1n6 || !P.equals(G) ? P.multiplyUnsafe(a2) : P.multiply(a2), "mul");
        const sum = mul(this, a).add(mul(Q, b));
        return sum.is0() ? void 0 : sum;
      }
      // Converts Projective point to affine (x, y) coordinates.
      // Can accept precomputed Z^-1 - for example, from invertBatch.
      // (x, y, z) ∋ (x=x/z, y=y/z)
      toAffine(iz) {
        return toAffineMemo(this, iz);
      }
      isTorsionFree() {
        const { h: cofactor, isTorsionFree } = CURVE2;
        if (cofactor === _1n6)
          return true;
        if (isTorsionFree)
          return isTorsionFree(Point2, this);
        throw new Error("isTorsionFree() has not been declared for the elliptic curve");
      }
      clearCofactor() {
        const { h: cofactor, clearCofactor } = CURVE2;
        if (cofactor === _1n6)
          return this;
        if (clearCofactor)
          return clearCofactor(Point2, this);
        return this.multiplyUnsafe(CURVE2.h);
      }
      toRawBytes(isCompressed = true) {
        abool2("isCompressed", isCompressed);
        this.assertValidity();
        return toBytes4(Point2, this, isCompressed);
      }
      toHex(isCompressed = true) {
        abool2("isCompressed", isCompressed);
        return bytesToHex2(this.toRawBytes(isCompressed));
      }
    }
    Point2.BASE = new Point2(CURVE2.Gx, CURVE2.Gy, Fp.ONE);
    Point2.ZERO = new Point2(Fp.ZERO, Fp.ONE, Fp.ZERO);
    const _bits = CURVE2.nBitLength;
    const wnaf = wNAF(Point2, CURVE2.endo ? Math.ceil(_bits / 2) : _bits);
    return {
      CURVE: CURVE2,
      ProjectivePoint: Point2,
      normPrivateKeyToScalar,
      weierstrassEquation,
      isWithinCurveOrder
    };
  }
  __name(weierstrassPoints, "weierstrassPoints");
  function validateOpts2(curve2) {
    const opts = validateBasic(curve2);
    validateObject2(opts, {
      hash: "hash",
      hmac: "function",
      randomBytes: "function"
    }, {
      bits2int: "function",
      bits2int_modN: "function",
      lowS: "boolean"
    });
    return Object.freeze({ lowS: true, ...opts });
  }
  __name(validateOpts2, "validateOpts");
  function weierstrass(curveDef) {
    const CURVE2 = validateOpts2(curveDef);
    const { Fp, n: CURVE_ORDER2 } = CURVE2;
    const compressedLen = Fp.BYTES + 1;
    const uncompressedLen = 2 * Fp.BYTES + 1;
    function modN(a) {
      return mod(a, CURVE_ORDER2);
    }
    __name(modN, "modN");
    function invN(a) {
      return invert(a, CURVE_ORDER2);
    }
    __name(invN, "invN");
    const { ProjectivePoint: Point2, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints({
      ...CURVE2,
      toBytes(_c, point, isCompressed) {
        const a = point.toAffine();
        const x = Fp.toBytes(a.x);
        const cat = concatBytes3;
        abool2("isCompressed", isCompressed);
        if (isCompressed) {
          return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
        } else {
          return cat(Uint8Array.from([4]), x, Fp.toBytes(a.y));
        }
      },
      fromBytes(bytes) {
        const len = bytes.length;
        const head = bytes[0];
        const tail = bytes.subarray(1);
        if (len === compressedLen && (head === 2 || head === 3)) {
          const x = bytesToNumberBE2(tail);
          if (!inRange2(x, _1n6, Fp.ORDER))
            throw new Error("Point is not on curve");
          const y2 = weierstrassEquation(x);
          let y;
          try {
            y = Fp.sqrt(y2);
          } catch (sqrtError) {
            const suffix = sqrtError instanceof Error ? ": " + sqrtError.message : "";
            throw new Error("Point is not on curve" + suffix);
          }
          const isYOdd = (y & _1n6) === _1n6;
          const isHeadOdd = (head & 1) === 1;
          if (isHeadOdd !== isYOdd)
            y = Fp.neg(y);
          return { x, y };
        } else if (len === uncompressedLen && head === 4) {
          const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
          const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
          return { x, y };
        } else {
          const cl = compressedLen;
          const ul = uncompressedLen;
          throw new Error("invalid Point, expected length of " + cl + ", or uncompressed " + ul + ", got " + len);
        }
      }
    });
    const numToNByteStr = /* @__PURE__ */ __name((num) => bytesToHex2(numberToBytesBE2(num, CURVE2.nByteLength)), "numToNByteStr");
    function isBiggerThanHalfOrder(number) {
      const HALF = CURVE_ORDER2 >> _1n6;
      return number > HALF;
    }
    __name(isBiggerThanHalfOrder, "isBiggerThanHalfOrder");
    function normalizeS(s) {
      return isBiggerThanHalfOrder(s) ? modN(-s) : s;
    }
    __name(normalizeS, "normalizeS");
    const slcNum = /* @__PURE__ */ __name((b, from, to) => bytesToNumberBE2(b.slice(from, to)), "slcNum");
    class Signature2 {
      static {
        __name(this, "Signature");
      }
      constructor(r, s, recovery) {
        this.r = r;
        this.s = s;
        this.recovery = recovery;
        this.assertValidity();
      }
      // pair (bytes of r, bytes of s)
      static fromCompact(hex) {
        const l = CURVE2.nByteLength;
        hex = ensureBytes2("compactSignature", hex, l * 2);
        return new Signature2(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
      }
      // DER encoded ECDSA signature
      // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
      static fromDER(hex) {
        const { r, s } = DER.toSig(ensureBytes2("DER", hex));
        return new Signature2(r, s);
      }
      assertValidity() {
        aInRange2("r", this.r, _1n6, CURVE_ORDER2);
        aInRange2("s", this.s, _1n6, CURVE_ORDER2);
      }
      addRecoveryBit(recovery) {
        return new Signature2(this.r, this.s, recovery);
      }
      recoverPublicKey(msgHash) {
        const { r, s, recovery: rec } = this;
        const h = bits2int_modN(ensureBytes2("msgHash", msgHash));
        if (rec == null || ![0, 1, 2, 3].includes(rec))
          throw new Error("recovery id invalid");
        const radj = rec === 2 || rec === 3 ? r + CURVE2.n : r;
        if (radj >= Fp.ORDER)
          throw new Error("recovery id 2 or 3 invalid");
        const prefix = (rec & 1) === 0 ? "02" : "03";
        const R = Point2.fromHex(prefix + numToNByteStr(radj));
        const ir = invN(radj);
        const u1 = modN(-h * ir);
        const u2 = modN(s * ir);
        const Q = Point2.BASE.multiplyAndAddUnsafe(R, u1, u2);
        if (!Q)
          throw new Error("point at infinify");
        Q.assertValidity();
        return Q;
      }
      // Signatures should be low-s, to prevent malleability.
      hasHighS() {
        return isBiggerThanHalfOrder(this.s);
      }
      normalizeS() {
        return this.hasHighS() ? new Signature2(this.r, modN(-this.s), this.recovery) : this;
      }
      // DER-encoded
      toDERRawBytes() {
        return hexToBytes2(this.toDERHex());
      }
      toDERHex() {
        return DER.hexFromSig({ r: this.r, s: this.s });
      }
      // padded bytes of r, then padded bytes of s
      toCompactRawBytes() {
        return hexToBytes2(this.toCompactHex());
      }
      toCompactHex() {
        return numToNByteStr(this.r) + numToNByteStr(this.s);
      }
    }
    const utils2 = {
      isValidPrivateKey(privateKey) {
        try {
          normPrivateKeyToScalar(privateKey);
          return true;
        } catch (error2) {
          return false;
        }
      },
      normPrivateKeyToScalar,
      /**
       * Produces cryptographically secure private key from random of size
       * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
       */
      randomPrivateKey: /* @__PURE__ */ __name(() => {
        const length = getMinHashLength(CURVE2.n);
        return mapHashToField(CURVE2.randomBytes(length), CURVE2.n);
      }, "randomPrivateKey"),
      /**
       * Creates precompute table for an arbitrary EC point. Makes point "cached".
       * Allows to massively speed-up `point.multiply(scalar)`.
       * @returns cached point
       * @example
       * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
       * fast.multiply(privKey); // much faster ECDH now
       */
      precompute(windowSize = 8, point = Point2.BASE) {
        point._setWindowSize(windowSize);
        point.multiply(BigInt(3));
        return point;
      }
    };
    function getPublicKey2(privateKey, isCompressed = true) {
      return Point2.fromPrivateKey(privateKey).toRawBytes(isCompressed);
    }
    __name(getPublicKey2, "getPublicKey");
    function isProbPub(item) {
      const arr = isBytes5(item);
      const str = typeof item === "string";
      const len = (arr || str) && item.length;
      if (arr)
        return len === compressedLen || len === uncompressedLen;
      if (str)
        return len === 2 * compressedLen || len === 2 * uncompressedLen;
      if (item instanceof Point2)
        return true;
      return false;
    }
    __name(isProbPub, "isProbPub");
    function getSharedSecret2(privateA, publicB, isCompressed = true) {
      if (isProbPub(privateA))
        throw new Error("first arg must be private key");
      if (!isProbPub(publicB))
        throw new Error("second arg must be public key");
      const b = Point2.fromHex(publicB);
      return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
    }
    __name(getSharedSecret2, "getSharedSecret");
    const bits2int2 = CURVE2.bits2int || function(bytes) {
      if (bytes.length > 8192)
        throw new Error("input is too large");
      const num = bytesToNumberBE2(bytes);
      const delta = bytes.length * 8 - CURVE2.nBitLength;
      return delta > 0 ? num >> BigInt(delta) : num;
    };
    const bits2int_modN = CURVE2.bits2int_modN || function(bytes) {
      return modN(bits2int2(bytes));
    };
    const ORDER_MASK = bitMask2(CURVE2.nBitLength);
    function int2octets(num) {
      aInRange2("num < 2^" + CURVE2.nBitLength, num, _0n6, ORDER_MASK);
      return numberToBytesBE2(num, CURVE2.nByteLength);
    }
    __name(int2octets, "int2octets");
    function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
      if (["recovered", "canonical"].some((k) => k in opts))
        throw new Error("sign() legacy options not supported");
      const { hash, randomBytes: randomBytes3 } = CURVE2;
      let { lowS, prehash, extraEntropy: ent } = opts;
      if (lowS == null)
        lowS = true;
      msgHash = ensureBytes2("msgHash", msgHash);
      validateSigVerOpts(opts);
      if (prehash)
        msgHash = ensureBytes2("prehashed msgHash", hash(msgHash));
      const h1int = bits2int_modN(msgHash);
      const d = normPrivateKeyToScalar(privateKey);
      const seedArgs = [int2octets(d), int2octets(h1int)];
      if (ent != null && ent !== false) {
        const e = ent === true ? randomBytes3(Fp.BYTES) : ent;
        seedArgs.push(ensureBytes2("extraEntropy", e));
      }
      const seed = concatBytes3(...seedArgs);
      const m = h1int;
      function k2sig(kBytes) {
        const k = bits2int2(kBytes);
        if (!isWithinCurveOrder(k))
          return;
        const ik = invN(k);
        const q = Point2.BASE.multiply(k).toAffine();
        const r = modN(q.x);
        if (r === _0n6)
          return;
        const s = modN(ik * modN(m + r * d));
        if (s === _0n6)
          return;
        let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n6);
        let normS = s;
        if (lowS && isBiggerThanHalfOrder(s)) {
          normS = normalizeS(s);
          recovery ^= 1;
        }
        return new Signature2(r, normS, recovery);
      }
      __name(k2sig, "k2sig");
      return { seed, k2sig };
    }
    __name(prepSig, "prepSig");
    const defaultSigOpts = { lowS: CURVE2.lowS, prehash: false };
    const defaultVerOpts = { lowS: CURVE2.lowS, prehash: false };
    function sign2(msgHash, privKey, opts = defaultSigOpts) {
      const { seed, k2sig } = prepSig(msgHash, privKey, opts);
      const C = CURVE2;
      const drbg = createHmacDrbg2(C.hash.outputLen, C.nByteLength, C.hmac);
      return drbg(seed, k2sig);
    }
    __name(sign2, "sign");
    Point2.BASE._setWindowSize(8);
    function verify2(signature, msgHash, publicKey, opts = defaultVerOpts) {
      const sg = signature;
      msgHash = ensureBytes2("msgHash", msgHash);
      publicKey = ensureBytes2("publicKey", publicKey);
      const { lowS, prehash, format } = opts;
      validateSigVerOpts(opts);
      if ("strict" in opts)
        throw new Error("options.strict was renamed to lowS");
      if (format !== void 0 && format !== "compact" && format !== "der")
        throw new Error("format must be compact or der");
      const isHex3 = typeof sg === "string" || isBytes5(sg);
      const isObj = !isHex3 && !format && typeof sg === "object" && sg !== null && typeof sg.r === "bigint" && typeof sg.s === "bigint";
      if (!isHex3 && !isObj)
        throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
      let _sig = void 0;
      let P;
      try {
        if (isObj)
          _sig = new Signature2(sg.r, sg.s);
        if (isHex3) {
          try {
            if (format !== "compact")
              _sig = Signature2.fromDER(sg);
          } catch (derError) {
            if (!(derError instanceof DER.Err))
              throw derError;
          }
          if (!_sig && format !== "der")
            _sig = Signature2.fromCompact(sg);
        }
        P = Point2.fromHex(publicKey);
      } catch (error2) {
        return false;
      }
      if (!_sig)
        return false;
      if (lowS && _sig.hasHighS())
        return false;
      if (prehash)
        msgHash = CURVE2.hash(msgHash);
      const { r, s } = _sig;
      const h = bits2int_modN(msgHash);
      const is = invN(s);
      const u1 = modN(h * is);
      const u2 = modN(r * is);
      const R = Point2.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine();
      if (!R)
        return false;
      const v = modN(R.x);
      return v === r;
    }
    __name(verify2, "verify");
    return {
      CURVE: CURVE2,
      getPublicKey: getPublicKey2,
      getSharedSecret: getSharedSecret2,
      sign: sign2,
      verify: verify2,
      ProjectivePoint: Point2,
      Signature: Signature2,
      utils: utils2
    };
  }
  __name(weierstrass, "weierstrass");

  // node_modules/@scure/starknet/node_modules/@noble/curves/node_modules/@noble/hashes/esm/_assert.js
  function anumber4(n) {
    if (!Number.isSafeInteger(n) || n < 0)
      throw new Error("positive integer expected, got " + n);
  }
  __name(anumber4, "anumber");
  function isBytes6(a) {
    return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array";
  }
  __name(isBytes6, "isBytes");
  function abytes5(b, ...lengths) {
    if (!isBytes6(b))
      throw new Error("Uint8Array expected");
    if (lengths.length > 0 && !lengths.includes(b.length))
      throw new Error("Uint8Array expected of length " + lengths + ", got length=" + b.length);
  }
  __name(abytes5, "abytes");
  function ahash2(h) {
    if (typeof h !== "function" || typeof h.create !== "function")
      throw new Error("Hash should be wrapped by utils.wrapConstructor");
    anumber4(h.outputLen);
    anumber4(h.blockLen);
  }
  __name(ahash2, "ahash");
  function aexists3(instance, checkFinished = true) {
    if (instance.destroyed)
      throw new Error("Hash instance has been destroyed");
    if (checkFinished && instance.finished)
      throw new Error("Hash#digest() has already been called");
  }
  __name(aexists3, "aexists");

  // node_modules/@scure/starknet/node_modules/@noble/curves/node_modules/@noble/hashes/esm/crypto.js
  var crypto2 = typeof globalThis === "object" && "crypto" in globalThis ? globalThis.crypto : void 0;

  // node_modules/@scure/starknet/node_modules/@noble/curves/node_modules/@noble/hashes/esm/utils.js
  function utf8ToBytes5(str) {
    if (typeof str !== "string")
      throw new Error("utf8ToBytes expected string, got " + typeof str);
    return new Uint8Array(new TextEncoder().encode(str));
  }
  __name(utf8ToBytes5, "utf8ToBytes");
  function toBytes3(data) {
    if (typeof data === "string")
      data = utf8ToBytes5(data);
    abytes5(data);
    return data;
  }
  __name(toBytes3, "toBytes");
  function concatBytes4(...arrays) {
    let sum = 0;
    for (let i = 0; i < arrays.length; i++) {
      const a = arrays[i];
      abytes5(a);
      sum += a.length;
    }
    const res = new Uint8Array(sum);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
      const a = arrays[i];
      res.set(a, pad);
      pad += a.length;
    }
    return res;
  }
  __name(concatBytes4, "concatBytes");
  var Hash3 = class {
    static {
      __name(this, "Hash");
    }
    // Safe version that clones internal state
    clone() {
      return this._cloneInto();
    }
  };
  function randomBytes2(bytesLength = 32) {
    if (crypto2 && typeof crypto2.getRandomValues === "function") {
      return crypto2.getRandomValues(new Uint8Array(bytesLength));
    }
    if (crypto2 && typeof crypto2.randomBytes === "function") {
      return crypto2.randomBytes(bytesLength);
    }
    throw new Error("crypto.getRandomValues must be defined");
  }
  __name(randomBytes2, "randomBytes");

  // node_modules/@scure/starknet/node_modules/@noble/curves/node_modules/@noble/hashes/esm/hmac.js
  var HMAC = class extends Hash3 {
    static {
      __name(this, "HMAC");
    }
    constructor(hash, _key) {
      super();
      this.finished = false;
      this.destroyed = false;
      ahash2(hash);
      const key = toBytes3(_key);
      this.iHash = hash.create();
      if (typeof this.iHash.update !== "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen;
      this.outputLen = this.iHash.outputLen;
      const blockLen = this.blockLen;
      const pad = new Uint8Array(blockLen);
      pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
      for (let i = 0; i < pad.length; i++)
        pad[i] ^= 54;
      this.iHash.update(pad);
      this.oHash = hash.create();
      for (let i = 0; i < pad.length; i++)
        pad[i] ^= 54 ^ 92;
      this.oHash.update(pad);
      pad.fill(0);
    }
    update(buf) {
      aexists3(this);
      this.iHash.update(buf);
      return this;
    }
    digestInto(out) {
      aexists3(this);
      abytes5(out, this.outputLen);
      this.finished = true;
      this.iHash.digestInto(out);
      this.oHash.update(out);
      this.oHash.digestInto(out);
      this.destroy();
    }
    digest() {
      const out = new Uint8Array(this.oHash.outputLen);
      this.digestInto(out);
      return out;
    }
    _cloneInto(to) {
      to || (to = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
      to = to;
      to.finished = finished;
      to.destroyed = destroyed;
      to.blockLen = blockLen;
      to.outputLen = outputLen;
      to.oHash = oHash._cloneInto(to.oHash);
      to.iHash = iHash._cloneInto(to.iHash);
      return to;
    }
    destroy() {
      this.destroyed = true;
      this.oHash.destroy();
      this.iHash.destroy();
    }
  };
  var hmac = /* @__PURE__ */ __name((hash, key, message) => new HMAC(hash, key).update(message).digest(), "hmac");
  hmac.create = (hash, key) => new HMAC(hash, key);

  // node_modules/@scure/starknet/node_modules/@noble/curves/esm/_shortw_utils.js
  function getHash(hash) {
    return {
      hash,
      hmac: /* @__PURE__ */ __name((key, ...msgs) => hmac(hash, key, concatBytes4(...msgs)), "hmac"),
      randomBytes: randomBytes2
    };
  }
  __name(getHash, "getHash");

  // node_modules/@scure/starknet/lib/esm/index.js
  var CURVE_ORDER = BigInt("3618502788666131213697322783095070105526743751716087489154079457884512865583");
  var MAX_VALUE = BigInt("0x800000000000000000000000000000000000000000000000000000000000000");
  var nBitLength = 252;
  function bits2int(bytes) {
    while (bytes[0] === 0)
      bytes = bytes.subarray(1);
    const delta = bytes.length * 8 - nBitLength;
    const num = bytesToNumberBE2(bytes);
    return delta > 0 ? num >> BigInt(delta) : num;
  }
  __name(bits2int, "bits2int");
  function hex0xToBytes(hex) {
    if (typeof hex === "string") {
      hex = strip0x(hex);
      if (hex.length & 1)
        hex = "0" + hex;
    }
    return hexToBytes2(hex);
  }
  __name(hex0xToBytes, "hex0xToBytes");
  var curve = weierstrass({
    a: BigInt(1),
    // Params: a, b
    b: BigInt("3141592653589793238462643383279502884197169399375105820974944592307816406665"),
    // Field over which we'll do calculations; 2n**251n + 17n * 2n**192n + 1n
    // There is no efficient sqrt for field (P%4==1)
    Fp: Field(BigInt("0x800000000000011000000000000000000000000000000000000000000000001")),
    n: CURVE_ORDER,
    // Curve order, total count of valid points in the field.
    nBitLength,
    // len(bin(N).replace('0b',''))
    // Base point (x, y) aka generator point
    Gx: BigInt("874739451078007766457464989774322083649278607533249481151382481072868806602"),
    Gy: BigInt("152666792071518830868575557812948353041420400780739481342941381225525861407"),
    h: BigInt(1),
    // cofactor
    lowS: false,
    // Allow high-s signatures
    ...getHash(sha2562),
    // Custom truncation routines for stark curve
    bits2int,
    bits2int_modN: /* @__PURE__ */ __name((bytes) => {
      const hex = bytesToNumberBE2(bytes).toString(16);
      if (hex.length === 63)
        bytes = hex0xToBytes(hex + "0");
      return mod(bits2int(bytes), CURVE_ORDER);
    }, "bits2int_modN")
  });
  var _starkCurve = curve;
  function ensureBytes3(hex) {
    return ensureBytes2("", typeof hex === "string" ? hex0xToBytes(hex) : hex);
  }
  __name(ensureBytes3, "ensureBytes");
  function normalizePrivateKey(privKey) {
    return bytesToHex2(ensureBytes3(privKey)).padStart(64, "0");
  }
  __name(normalizePrivateKey, "normalizePrivateKey");
  function getPublicKey(privKey, isCompressed = false) {
    return curve.getPublicKey(normalizePrivateKey(privKey), isCompressed);
  }
  __name(getPublicKey, "getPublicKey");
  function getSharedSecret(privKeyA, pubKeyB) {
    return curve.getSharedSecret(normalizePrivateKey(privKeyA), pubKeyB);
  }
  __name(getSharedSecret, "getSharedSecret");
  function checkSignature(signature) {
    const { r, s } = signature;
    if (r < 0n || r >= MAX_VALUE)
      throw new Error(`Signature.r should be [1, ${MAX_VALUE})`);
    const w = invert(s, CURVE_ORDER);
    if (w < 0n || w >= MAX_VALUE)
      throw new Error(`inv(Signature.s) should be [1, ${MAX_VALUE})`);
  }
  __name(checkSignature, "checkSignature");
  function checkMessage(msgHash) {
    const bytes = ensureBytes3(msgHash);
    const num = bytesToNumberBE2(bytes);
    if (num >= MAX_VALUE)
      throw new Error(`msgHash should be [0, ${MAX_VALUE})`);
    return bytes;
  }
  __name(checkMessage, "checkMessage");
  function sign(msgHash, privKey, opts) {
    const sig = curve.sign(checkMessage(msgHash), normalizePrivateKey(privKey), opts);
    checkSignature(sig);
    return sig;
  }
  __name(sign, "sign");
  function verify(signature, msgHash, pubKey) {
    if (!(signature instanceof Signature)) {
      const bytes = ensureBytes3(signature);
      try {
        signature = Signature.fromDER(bytes);
      } catch (derError) {
        if (!(derError instanceof DER.Err))
          throw derError;
        signature = Signature.fromCompact(bytes);
      }
    }
    checkSignature(signature);
    return curve.verify(signature, checkMessage(msgHash), ensureBytes3(pubKey));
  }
  __name(verify, "verify");
  var { CURVE, ProjectivePoint, Signature, utils } = curve;
  function extractX(bytes) {
    const hex = bytesToHex2(bytes.subarray(1));
    const stripped = hex.replace(/^0+/gm, "");
    return `0x${stripped}`;
  }
  __name(extractX, "extractX");
  function strip0x(hex) {
    return hex.replace(/^0x/i, "");
  }
  __name(strip0x, "strip0x");
  function grindKey(seed) {
    const _seed = ensureBytes3(seed);
    const sha256mask = 2n ** 256n;
    const limit = sha256mask - mod(sha256mask, CURVE_ORDER);
    for (let i = 0; ; i++) {
      const key = sha256Num(concatBytes3(_seed, numberToVarBytesBE2(BigInt(i))));
      if (key < limit)
        return mod(key, CURVE_ORDER).toString(16);
      if (i === 1e5)
        throw new Error("grindKey is broken: tried 100k vals");
    }
  }
  __name(grindKey, "grindKey");
  function getStarkKey(privateKey) {
    return extractX(getPublicKey(privateKey, true));
  }
  __name(getStarkKey, "getStarkKey");
  function ethSigToPrivate(signature) {
    signature = strip0x(signature);
    if (signature.length !== 130)
      throw new Error("Wrong ethereum signature");
    return grindKey(signature.substring(0, 64));
  }
  __name(ethSigToPrivate, "ethSigToPrivate");
  var MASK_31 = 2n ** 31n - 1n;
  var int31 = /* @__PURE__ */ __name((n) => Number(n & MASK_31), "int31");
  function getAccountPath(layer, application, ethereumAddress, index) {
    const layerNum = int31(sha256Num(layer));
    const applicationNum = int31(sha256Num(application));
    const eth = hexToNumber2(strip0x(ethereumAddress));
    return `m/2645'/${layerNum}'/${applicationNum}'/${int31(eth)}'/${int31(eth >> 31n)}'/${index}`;
  }
  __name(getAccountPath, "getAccountPath");
  var PEDERSEN_POINTS = [
    new ProjectivePoint(2089986280348253421170679821480865132823066470938446095505822317253594081284n, 1713931329540660377023406109199410414810705867260802078187082345529207694986n, 1n),
    new ProjectivePoint(996781205833008774514500082376783249102396023663454813447423147977397232763n, 1668503676786377725805489344771023921079126552019160156920634619255970485781n, 1n),
    new ProjectivePoint(2251563274489750535117886426533222435294046428347329203627021249169616184184n, 1798716007562728905295480679789526322175868328062420237419143593021674992973n, 1n),
    new ProjectivePoint(2138414695194151160943305727036575959195309218611738193261179310511854807447n, 113410276730064486255102093846540133784865286929052426931474106396135072156n, 1n),
    new ProjectivePoint(2379962749567351885752724891227938183011949129833673362440656643086021394946n, 776496453633298175483985398648758586525933812536653089401905292063708816422n, 1n)
  ];
  function pedersenPrecompute(p1, p2) {
    const out = [];
    let p = p1;
    for (let i = 0; i < 248; i++) {
      out.push(p);
      p = p.double();
    }
    p = p2;
    for (let i = 0; i < 4; i++) {
      out.push(p);
      p = p.double();
    }
    return out;
  }
  __name(pedersenPrecompute, "pedersenPrecompute");
  var PEDERSEN_POINTS1 = pedersenPrecompute(PEDERSEN_POINTS[1], PEDERSEN_POINTS[2]);
  var PEDERSEN_POINTS2 = pedersenPrecompute(PEDERSEN_POINTS[3], PEDERSEN_POINTS[4]);
  function pedersenArg(arg) {
    let value;
    if (typeof arg === "bigint") {
      value = arg;
    } else if (typeof arg === "number") {
      if (!Number.isSafeInteger(arg))
        throw new Error(`Invalid pedersenArg: ${arg}`);
      value = BigInt(arg);
    } else {
      value = bytesToNumberBE2(ensureBytes3(arg));
    }
    if (!(0n <= value && value < curve.CURVE.Fp.ORDER))
      throw new Error(`PedersenArg should be 0 <= value < CURVE.P: ${value}`);
    return value;
  }
  __name(pedersenArg, "pedersenArg");
  function pedersenSingle(point, value, constants2) {
    let x = pedersenArg(value);
    for (let j = 0; j < 252; j++) {
      const pt = constants2[j];
      if (!pt)
        throw new Error("invalid constant index");
      if (pt.equals(point))
        throw new Error("Same point");
      if ((x & 1n) !== 0n)
        point = point.add(pt);
      x >>= 1n;
    }
    return point;
  }
  __name(pedersenSingle, "pedersenSingle");
  function pedersen(x, y) {
    let point = PEDERSEN_POINTS[0];
    point = pedersenSingle(point, x, PEDERSEN_POINTS1);
    point = pedersenSingle(point, y, PEDERSEN_POINTS2);
    return extractX(point.toRawBytes(true));
  }
  __name(pedersen, "pedersen");
  var computeHashOnElements = /* @__PURE__ */ __name((data, fn = pedersen) => [0, ...data, data.length].reduce((x, y) => fn(x, y)), "computeHashOnElements");
  var MASK_250 = bitMask2(250);
  var keccak = /* @__PURE__ */ __name((data) => bytesToNumberBE2(keccak_256(data)) & MASK_250, "keccak");
  var sha256Num = /* @__PURE__ */ __name((data) => bytesToNumberBE2(sha2562(data)), "sha256Num");
  var Fp251 = Field(BigInt("3618502788666131213697322783095070105623107215331596699973092056135872020481"));
  function poseidonRoundConstant(Fp, name, idx) {
    const val = Fp.fromBytes(sha2562(utf8ToBytes3(`${name}${idx}`)));
    return Fp.create(val);
  }
  __name(poseidonRoundConstant, "poseidonRoundConstant");
  function _poseidonMDS(Fp, name, m, attempt = 0) {
    const x_values = [];
    const y_values = [];
    for (let i = 0; i < m; i++) {
      x_values.push(poseidonRoundConstant(Fp, `${name}x`, attempt * m + i));
      y_values.push(poseidonRoundConstant(Fp, `${name}y`, attempt * m + i));
    }
    if ((/* @__PURE__ */ new Set([...x_values, ...y_values])).size !== 2 * m)
      throw new Error("X and Y values are not distinct");
    return x_values.map((x) => y_values.map((y) => Fp.inv(Fp.sub(x, y))));
  }
  __name(_poseidonMDS, "_poseidonMDS");
  var MDS_SMALL = [
    [3, 1, 1],
    [1, -1, 1],
    [1, 1, -2]
  ].map((i) => i.map(BigInt));
  function poseidonBasic(opts, mds) {
    validateField(opts.Fp);
    if (!Number.isSafeInteger(opts.rate) || !Number.isSafeInteger(opts.capacity))
      throw new Error(`Wrong poseidon opts: ${opts}`);
    const m = opts.rate + opts.capacity;
    const rounds = opts.roundsFull + opts.roundsPartial;
    const roundConstants = [];
    for (let i = 0; i < rounds; i++) {
      const row = [];
      for (let j = 0; j < m; j++)
        row.push(poseidonRoundConstant(opts.Fp, "Hades", m * i + j));
      roundConstants.push(row);
    }
    const res = poseidon({
      ...opts,
      t: m,
      sboxPower: 3,
      reversePartialPowIdx: true,
      // Why?!
      mds,
      roundConstants
    });
    res.m = m;
    res.rate = opts.rate;
    res.capacity = opts.capacity;
    return res;
  }
  __name(poseidonBasic, "poseidonBasic");
  function poseidonCreate(opts, mdsAttempt = 0) {
    const m = opts.rate + opts.capacity;
    if (!Number.isSafeInteger(mdsAttempt))
      throw new Error(`Wrong mdsAttempt=${mdsAttempt}`);
    return poseidonBasic(opts, _poseidonMDS(opts.Fp, "HadesMDS", m, mdsAttempt));
  }
  __name(poseidonCreate, "poseidonCreate");
  var poseidonSmall = poseidonBasic({ Fp: Fp251, rate: 2, capacity: 1, roundsFull: 8, roundsPartial: 83 }, MDS_SMALL);
  function poseidonHash(x, y, fn = poseidonSmall) {
    return fn([x, y, 2n])[0];
  }
  __name(poseidonHash, "poseidonHash");
  function poseidonHashFunc(x, y, fn = poseidonSmall) {
    return numberToVarBytesBE2(poseidonHash(bytesToNumberBE2(x), bytesToNumberBE2(y), fn));
  }
  __name(poseidonHashFunc, "poseidonHashFunc");
  function poseidonHashSingle(x, fn = poseidonSmall) {
    return fn([x, 0n, 1n])[0];
  }
  __name(poseidonHashSingle, "poseidonHashSingle");
  function poseidonHashMany(values, fn = poseidonSmall) {
    const { m, rate } = fn;
    if (!Array.isArray(values))
      throw new Error("bigint array expected in values");
    const padded = Array.from(values);
    padded.push(1n);
    while (padded.length % rate !== 0)
      padded.push(0n);
    let state = new Array(m).fill(0n);
    for (let i = 0; i < padded.length; i += rate) {
      for (let j = 0; j < rate; j++) {
        const item = padded[i + j];
        if (typeof item === "undefined")
          throw new Error("invalid index");
        if (typeof state[j] === "undefined")
          throw new Error("state[j] is undefined");
        state[j] = state[j] + item;
      }
      state = fn(state);
    }
    return state[0];
  }
  __name(poseidonHashMany, "poseidonHashMany");

  // node_modules/starknet/node_modules/@noble/hashes/esm/_u64.js
  var U32_MASK642 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
  var _32n2 = /* @__PURE__ */ BigInt(32);
  function fromBig2(n, le = false) {
    if (le)
      return { h: Number(n & U32_MASK642), l: Number(n >> _32n2 & U32_MASK642) };
    return { h: Number(n >> _32n2 & U32_MASK642) | 0, l: Number(n & U32_MASK642) | 0 };
  }
  __name(fromBig2, "fromBig");
  function split2(lst, le = false) {
    let Ah = new Uint32Array(lst.length);
    let Al = new Uint32Array(lst.length);
    for (let i = 0; i < lst.length; i++) {
      const { h, l } = fromBig2(lst[i], le);
      [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
  }
  __name(split2, "split");
  var rotlSH2 = /* @__PURE__ */ __name((h, l, s) => h << s | l >>> 32 - s, "rotlSH");
  var rotlSL2 = /* @__PURE__ */ __name((h, l, s) => l << s | h >>> 32 - s, "rotlSL");
  var rotlBH2 = /* @__PURE__ */ __name((h, l, s) => l << s - 32 | h >>> 64 - s, "rotlBH");
  var rotlBL2 = /* @__PURE__ */ __name((h, l, s) => h << s - 32 | l >>> 64 - s, "rotlBL");

  // node_modules/starknet/node_modules/@noble/hashes/esm/sha3.js
  var SHA3_PI2 = [];
  var SHA3_ROTL2 = [];
  var _SHA3_IOTA2 = [];
  var _0n7 = /* @__PURE__ */ BigInt(0);
  var _1n7 = /* @__PURE__ */ BigInt(1);
  var _2n6 = /* @__PURE__ */ BigInt(2);
  var _7n2 = /* @__PURE__ */ BigInt(7);
  var _256n2 = /* @__PURE__ */ BigInt(256);
  var _0x71n2 = /* @__PURE__ */ BigInt(113);
  for (let round = 0, R = _1n7, x = 1, y = 0; round < 24; round++) {
    [x, y] = [y, (2 * x + 3 * y) % 5];
    SHA3_PI2.push(2 * (5 * y + x));
    SHA3_ROTL2.push((round + 1) * (round + 2) / 2 % 64);
    let t = _0n7;
    for (let j = 0; j < 7; j++) {
      R = (R << _1n7 ^ (R >> _7n2) * _0x71n2) % _256n2;
      if (R & _2n6)
        t ^= _1n7 << (_1n7 << /* @__PURE__ */ BigInt(j)) - _1n7;
    }
    _SHA3_IOTA2.push(t);
  }
  var [SHA3_IOTA_H2, SHA3_IOTA_L2] = /* @__PURE__ */ split2(_SHA3_IOTA2, true);
  var rotlH2 = /* @__PURE__ */ __name((h, l, s) => s > 32 ? rotlBH2(h, l, s) : rotlSH2(h, l, s), "rotlH");
  var rotlL2 = /* @__PURE__ */ __name((h, l, s) => s > 32 ? rotlBL2(h, l, s) : rotlSL2(h, l, s), "rotlL");
  function keccakP2(s, rounds = 24) {
    const B = new Uint32Array(5 * 2);
    for (let round = 24 - rounds; round < 24; round++) {
      for (let x = 0; x < 10; x++)
        B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
      for (let x = 0; x < 10; x += 2) {
        const idx1 = (x + 8) % 10;
        const idx0 = (x + 2) % 10;
        const B0 = B[idx0];
        const B1 = B[idx0 + 1];
        const Th = rotlH2(B0, B1, 1) ^ B[idx1];
        const Tl = rotlL2(B0, B1, 1) ^ B[idx1 + 1];
        for (let y = 0; y < 50; y += 10) {
          s[x + y] ^= Th;
          s[x + y + 1] ^= Tl;
        }
      }
      let curH = s[2];
      let curL = s[3];
      for (let t = 0; t < 24; t++) {
        const shift = SHA3_ROTL2[t];
        const Th = rotlH2(curH, curL, shift);
        const Tl = rotlL2(curH, curL, shift);
        const PI = SHA3_PI2[t];
        curH = s[PI];
        curL = s[PI + 1];
        s[PI] = Th;
        s[PI + 1] = Tl;
      }
      for (let y = 0; y < 50; y += 10) {
        for (let x = 0; x < 10; x++)
          B[x] = s[y + x];
        for (let x = 0; x < 10; x++)
          s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
      }
      s[0] ^= SHA3_IOTA_H2[round];
      s[1] ^= SHA3_IOTA_L2[round];
    }
    B.fill(0);
  }
  __name(keccakP2, "keccakP");
  var Keccak2 = class _Keccak extends Hash {
    static {
      __name(this, "Keccak");
    }
    // NOTE: we accept arguments in bytes instead of bits here.
    constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
      super();
      this.blockLen = blockLen;
      this.suffix = suffix;
      this.outputLen = outputLen;
      this.enableXOF = enableXOF;
      this.rounds = rounds;
      this.pos = 0;
      this.posOut = 0;
      this.finished = false;
      this.destroyed = false;
      anumber2(outputLen);
      if (0 >= this.blockLen || this.blockLen >= 200)
        throw new Error("Sha3 supports only keccak-f1600 function");
      this.state = new Uint8Array(200);
      this.state32 = u32(this.state);
    }
    keccak() {
      if (!isLE)
        byteSwap32(this.state32);
      keccakP2(this.state32, this.rounds);
      if (!isLE)
        byteSwap32(this.state32);
      this.posOut = 0;
      this.pos = 0;
    }
    update(data) {
      aexists(this);
      const { blockLen, state } = this;
      data = toBytes(data);
      const len = data.length;
      for (let pos = 0; pos < len; ) {
        const take = Math.min(blockLen - this.pos, len - pos);
        for (let i = 0; i < take; i++)
          state[this.pos++] ^= data[pos++];
        if (this.pos === blockLen)
          this.keccak();
      }
      return this;
    }
    finish() {
      if (this.finished)
        return;
      this.finished = true;
      const { state, suffix, pos, blockLen } = this;
      state[pos] ^= suffix;
      if ((suffix & 128) !== 0 && pos === blockLen - 1)
        this.keccak();
      state[blockLen - 1] ^= 128;
      this.keccak();
    }
    writeInto(out) {
      aexists(this, false);
      abytes2(out);
      this.finish();
      const bufferOut = this.state;
      const { blockLen } = this;
      for (let pos = 0, len = out.length; pos < len; ) {
        if (this.posOut >= blockLen)
          this.keccak();
        const take = Math.min(blockLen - this.posOut, len - pos);
        out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
        this.posOut += take;
        pos += take;
      }
      return out;
    }
    xofInto(out) {
      if (!this.enableXOF)
        throw new Error("XOF is not possible for this instance");
      return this.writeInto(out);
    }
    xof(bytes) {
      anumber2(bytes);
      return this.xofInto(new Uint8Array(bytes));
    }
    digestInto(out) {
      aoutput(out, this);
      if (this.finished)
        throw new Error("digest() was already called");
      this.writeInto(out);
      this.destroy();
      return out;
    }
    digest() {
      return this.digestInto(new Uint8Array(this.outputLen));
    }
    destroy() {
      this.destroyed = true;
      this.state.fill(0);
    }
    _cloneInto(to) {
      const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
      to || (to = new _Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
      to.state32.set(this.state32);
      to.pos = this.pos;
      to.posOut = this.posOut;
      to.finished = this.finished;
      to.rounds = rounds;
      to.suffix = suffix;
      to.outputLen = outputLen;
      to.enableXOF = enableXOF;
      to.destroyed = this.destroyed;
      return to;
    }
  };
  var gen2 = /* @__PURE__ */ __name((suffix, blockLen, outputLen) => wrapConstructor(() => new Keccak2(blockLen, suffix, outputLen)), "gen");
  var sha3_2242 = /* @__PURE__ */ gen2(6, 144, 224 / 8);
  var sha3_2562 = /* @__PURE__ */ gen2(6, 136, 256 / 8);
  var sha3_3842 = /* @__PURE__ */ gen2(6, 104, 384 / 8);
  var sha3_5122 = /* @__PURE__ */ gen2(6, 72, 512 / 8);
  var keccak_2242 = /* @__PURE__ */ gen2(1, 144, 224 / 8);
  var keccak_2562 = /* @__PURE__ */ gen2(1, 136, 256 / 8);
  var keccak_3842 = /* @__PURE__ */ gen2(1, 104, 384 / 8);
  var keccak_5122 = /* @__PURE__ */ gen2(1, 72, 512 / 8);
  var genShake2 = /* @__PURE__ */ __name((suffix, blockLen, outputLen) => wrapXOFConstructorWithOpts((opts = {}) => new Keccak2(blockLen, suffix, opts.dkLen === void 0 ? outputLen : opts.dkLen, true)), "genShake");
  var shake1282 = /* @__PURE__ */ genShake2(31, 168, 128 / 8);
  var shake2562 = /* @__PURE__ */ genShake2(31, 136, 256 / 8);

  // node_modules/starknet/node_modules/@noble/curves/esm/abstract/poseidon.js
  var poseidon_exports = {};
  __export(poseidon_exports, {
    poseidon: () => poseidon2,
    splitConstants: () => splitConstants,
    validateOpts: () => validateOpts3
  });

  // node_modules/starknet/node_modules/@noble/curves/esm/abstract/modular.js
  var _0n8 = BigInt(0);
  var _1n8 = BigInt(1);
  var _2n7 = /* @__PURE__ */ BigInt(2);
  var _3n3 = /* @__PURE__ */ BigInt(3);
  var _4n3 = /* @__PURE__ */ BigInt(4);
  var _5n2 = /* @__PURE__ */ BigInt(5);
  var _8n2 = /* @__PURE__ */ BigInt(8);
  var _9n2 = /* @__PURE__ */ BigInt(9);
  var _16n2 = /* @__PURE__ */ BigInt(16);
  function mod2(a, b) {
    const result = a % b;
    return result >= _0n8 ? result : b + result;
  }
  __name(mod2, "mod");
  function pow2(num, power, modulo) {
    if (power < _0n8)
      throw new Error("invalid exponent, negatives unsupported");
    if (modulo <= _0n8)
      throw new Error("invalid modulus");
    if (modulo === _1n8)
      return _0n8;
    let res = _1n8;
    while (power > _0n8) {
      if (power & _1n8)
        res = res * num % modulo;
      num = num * num % modulo;
      power >>= _1n8;
    }
    return res;
  }
  __name(pow2, "pow");
  function pow22(x, power, modulo) {
    let res = x;
    while (power-- > _0n8) {
      res *= res;
      res %= modulo;
    }
    return res;
  }
  __name(pow22, "pow2");
  function invert2(number, modulo) {
    if (number === _0n8)
      throw new Error("invert: expected non-zero number");
    if (modulo <= _0n8)
      throw new Error("invert: expected positive modulus, got " + modulo);
    let a = mod2(number, modulo);
    let b = modulo;
    let x = _0n8, y = _1n8, u = _1n8, v = _0n8;
    while (a !== _0n8) {
      const q = b / a;
      const r = b % a;
      const m = x - u * q;
      const n = y - v * q;
      b = a, a = r, x = u, y = v, u = m, v = n;
    }
    const gcd2 = b;
    if (gcd2 !== _1n8)
      throw new Error("invert: does not exist");
    return mod2(x, modulo);
  }
  __name(invert2, "invert");
  function tonelliShanks2(P) {
    const legendreC = (P - _1n8) / _2n7;
    let Q, S, Z;
    for (Q = P - _1n8, S = 0; Q % _2n7 === _0n8; Q /= _2n7, S++)
      ;
    for (Z = _2n7; Z < P && pow2(Z, legendreC, P) !== P - _1n8; Z++) {
      if (Z > 1e3)
        throw new Error("Cannot find square root: likely non-prime P");
    }
    if (S === 1) {
      const p1div4 = (P + _1n8) / _4n3;
      return /* @__PURE__ */ __name(function tonelliFast(Fp, n) {
        const root = Fp.pow(n, p1div4);
        if (!Fp.eql(Fp.sqr(root), n))
          throw new Error("Cannot find square root");
        return root;
      }, "tonelliFast");
    }
    const Q1div2 = (Q + _1n8) / _2n7;
    return /* @__PURE__ */ __name(function tonelliSlow(Fp, n) {
      if (Fp.pow(n, legendreC) === Fp.neg(Fp.ONE))
        throw new Error("Cannot find square root");
      let r = S;
      let g2 = Fp.pow(Fp.mul(Fp.ONE, Z), Q);
      let x = Fp.pow(n, Q1div2);
      let b = Fp.pow(n, Q);
      while (!Fp.eql(b, Fp.ONE)) {
        if (Fp.eql(b, Fp.ZERO))
          return Fp.ZERO;
        let m = 1;
        for (let t2 = Fp.sqr(b); m < r; m++) {
          if (Fp.eql(t2, Fp.ONE))
            break;
          t2 = Fp.sqr(t2);
        }
        const ge = Fp.pow(g2, _1n8 << BigInt(r - m - 1));
        g2 = Fp.sqr(ge);
        x = Fp.mul(x, ge);
        b = Fp.mul(b, g2);
        r = m;
      }
      return x;
    }, "tonelliSlow");
  }
  __name(tonelliShanks2, "tonelliShanks");
  function FpSqrt2(P) {
    if (P % _4n3 === _3n3) {
      const p1div4 = (P + _1n8) / _4n3;
      return /* @__PURE__ */ __name(function sqrt3mod4(Fp, n) {
        const root = Fp.pow(n, p1div4);
        if (!Fp.eql(Fp.sqr(root), n))
          throw new Error("Cannot find square root");
        return root;
      }, "sqrt3mod4");
    }
    if (P % _8n2 === _5n2) {
      const c1 = (P - _5n2) / _8n2;
      return /* @__PURE__ */ __name(function sqrt5mod8(Fp, n) {
        const n2 = Fp.mul(n, _2n7);
        const v = Fp.pow(n2, c1);
        const nv = Fp.mul(n, v);
        const i = Fp.mul(Fp.mul(nv, _2n7), v);
        const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
        if (!Fp.eql(Fp.sqr(root), n))
          throw new Error("Cannot find square root");
        return root;
      }, "sqrt5mod8");
    }
    if (P % _16n2 === _9n2) {
    }
    return tonelliShanks2(P);
  }
  __name(FpSqrt2, "FpSqrt");
  var FIELD_FIELDS2 = [
    "create",
    "isValid",
    "is0",
    "neg",
    "inv",
    "sqrt",
    "sqr",
    "eql",
    "add",
    "sub",
    "mul",
    "pow",
    "div",
    "addN",
    "subN",
    "mulN",
    "sqrN"
  ];
  function validateField2(field) {
    const initial = {
      ORDER: "bigint",
      MASK: "bigint",
      BYTES: "isSafeInteger",
      BITS: "isSafeInteger"
    };
    const opts = FIELD_FIELDS2.reduce((map2, val) => {
      map2[val] = "function";
      return map2;
    }, initial);
    return validateObject(field, opts);
  }
  __name(validateField2, "validateField");
  function FpPow2(f, num, power) {
    if (power < _0n8)
      throw new Error("invalid exponent, negatives unsupported");
    if (power === _0n8)
      return f.ONE;
    if (power === _1n8)
      return num;
    let p = f.ONE;
    let d = num;
    while (power > _0n8) {
      if (power & _1n8)
        p = f.mul(p, d);
      d = f.sqr(d);
      power >>= _1n8;
    }
    return p;
  }
  __name(FpPow2, "FpPow");
  function FpInvertBatch2(f, nums) {
    const tmp = new Array(nums.length);
    const lastMultiplied = nums.reduce((acc, num, i) => {
      if (f.is0(num))
        return acc;
      tmp[i] = acc;
      return f.mul(acc, num);
    }, f.ONE);
    const inverted = f.inv(lastMultiplied);
    nums.reduceRight((acc, num, i) => {
      if (f.is0(num))
        return acc;
      tmp[i] = f.mul(acc, tmp[i]);
      return f.mul(acc, num);
    }, inverted);
    return tmp;
  }
  __name(FpInvertBatch2, "FpInvertBatch");
  function nLength2(n, nBitLength2) {
    const _nBitLength = nBitLength2 !== void 0 ? nBitLength2 : n.toString(2).length;
    const nByteLength = Math.ceil(_nBitLength / 8);
    return { nBitLength: _nBitLength, nByteLength };
  }
  __name(nLength2, "nLength");
  function Field2(ORDER, bitLen3, isLE3 = false, redef = {}) {
    if (ORDER <= _0n8)
      throw new Error("invalid field: expected ORDER > 0, got " + ORDER);
    const { nBitLength: BITS, nByteLength: BYTES } = nLength2(ORDER, bitLen3);
    if (BYTES > 2048)
      throw new Error("invalid field: expected ORDER of <= 2048 bytes");
    let sqrtP;
    const f = Object.freeze({
      ORDER,
      BITS,
      BYTES,
      MASK: bitMask(BITS),
      ZERO: _0n8,
      ONE: _1n8,
      create: /* @__PURE__ */ __name((num) => mod2(num, ORDER), "create"),
      isValid: /* @__PURE__ */ __name((num) => {
        if (typeof num !== "bigint")
          throw new Error("invalid field element: expected bigint, got " + typeof num);
        return _0n8 <= num && num < ORDER;
      }, "isValid"),
      is0: /* @__PURE__ */ __name((num) => num === _0n8, "is0"),
      isOdd: /* @__PURE__ */ __name((num) => (num & _1n8) === _1n8, "isOdd"),
      neg: /* @__PURE__ */ __name((num) => mod2(-num, ORDER), "neg"),
      eql: /* @__PURE__ */ __name((lhs, rhs) => lhs === rhs, "eql"),
      sqr: /* @__PURE__ */ __name((num) => mod2(num * num, ORDER), "sqr"),
      add: /* @__PURE__ */ __name((lhs, rhs) => mod2(lhs + rhs, ORDER), "add"),
      sub: /* @__PURE__ */ __name((lhs, rhs) => mod2(lhs - rhs, ORDER), "sub"),
      mul: /* @__PURE__ */ __name((lhs, rhs) => mod2(lhs * rhs, ORDER), "mul"),
      pow: /* @__PURE__ */ __name((num, power) => FpPow2(f, num, power), "pow"),
      div: /* @__PURE__ */ __name((lhs, rhs) => mod2(lhs * invert2(rhs, ORDER), ORDER), "div"),
      // Same as above, but doesn't normalize
      sqrN: /* @__PURE__ */ __name((num) => num * num, "sqrN"),
      addN: /* @__PURE__ */ __name((lhs, rhs) => lhs + rhs, "addN"),
      subN: /* @__PURE__ */ __name((lhs, rhs) => lhs - rhs, "subN"),
      mulN: /* @__PURE__ */ __name((lhs, rhs) => lhs * rhs, "mulN"),
      inv: /* @__PURE__ */ __name((num) => invert2(num, ORDER), "inv"),
      sqrt: redef.sqrt || ((n) => {
        if (!sqrtP)
          sqrtP = FpSqrt2(ORDER);
        return sqrtP(f, n);
      }),
      invertBatch: /* @__PURE__ */ __name((lst) => FpInvertBatch2(f, lst), "invertBatch"),
      // TODO: do we really need constant cmov?
      // We don't have const-time bigints anyway, so probably will be not very useful
      cmov: /* @__PURE__ */ __name((a, b, c) => c ? b : a, "cmov"),
      toBytes: /* @__PURE__ */ __name((num) => isLE3 ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES), "toBytes"),
      fromBytes: /* @__PURE__ */ __name((bytes) => {
        if (bytes.length !== BYTES)
          throw new Error("Field.fromBytes: expected " + BYTES + " bytes, got " + bytes.length);
        return isLE3 ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
      }, "fromBytes")
    });
    return Object.freeze(f);
  }
  __name(Field2, "Field");
  function getFieldBytesLength2(fieldOrder) {
    if (typeof fieldOrder !== "bigint")
      throw new Error("field order must be bigint");
    const bitLength = fieldOrder.toString(2).length;
    return Math.ceil(bitLength / 8);
  }
  __name(getFieldBytesLength2, "getFieldBytesLength");
  function getMinHashLength2(fieldOrder) {
    const length = getFieldBytesLength2(fieldOrder);
    return length + Math.ceil(length / 2);
  }
  __name(getMinHashLength2, "getMinHashLength");
  function mapHashToField2(key, fieldOrder, isLE3 = false) {
    const len = key.length;
    const fieldLen = getFieldBytesLength2(fieldOrder);
    const minLen = getMinHashLength2(fieldOrder);
    if (len < 16 || len < minLen || len > 1024)
      throw new Error("expected " + minLen + "-1024 bytes of input, got " + len);
    const num = isLE3 ? bytesToNumberBE(key) : bytesToNumberLE(key);
    const reduced = mod2(num, fieldOrder - _1n8) + _1n8;
    return isLE3 ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
  }
  __name(mapHashToField2, "mapHashToField");

  // node_modules/starknet/node_modules/@noble/curves/esm/abstract/poseidon.js
  function validateOpts3(opts) {
    const { Fp, mds, reversePartialPowIdx: rev, roundConstants: rc } = opts;
    const { roundsFull, roundsPartial, sboxPower, t } = opts;
    validateField2(Fp);
    for (const i of ["t", "roundsFull", "roundsPartial"]) {
      if (typeof opts[i] !== "number" || !Number.isSafeInteger(opts[i]))
        throw new Error("invalid number " + i);
    }
    if (!Array.isArray(mds) || mds.length !== t)
      throw new Error("Poseidon: invalid MDS matrix");
    const _mds = mds.map((mdsRow) => {
      if (!Array.isArray(mdsRow) || mdsRow.length !== t)
        throw new Error("invalid MDS matrix row: " + mdsRow);
      return mdsRow.map((i) => {
        if (typeof i !== "bigint")
          throw new Error("invalid MDS matrix bigint: " + i);
        return Fp.create(i);
      });
    });
    if (rev !== void 0 && typeof rev !== "boolean")
      throw new Error("invalid param reversePartialPowIdx=" + rev);
    if (roundsFull & 1)
      throw new Error("roundsFull is not even" + roundsFull);
    const rounds = roundsFull + roundsPartial;
    if (!Array.isArray(rc) || rc.length !== rounds)
      throw new Error("Poseidon: invalid round constants");
    const roundConstants = rc.map((rc2) => {
      if (!Array.isArray(rc2) || rc2.length !== t)
        throw new Error("invalid round constants");
      return rc2.map((i) => {
        if (typeof i !== "bigint" || !Fp.isValid(i))
          throw new Error("invalid round constant");
        return Fp.create(i);
      });
    });
    if (!sboxPower || ![3, 5, 7].includes(sboxPower))
      throw new Error("invalid sboxPower");
    const _sboxPower = BigInt(sboxPower);
    let sboxFn = /* @__PURE__ */ __name((n) => FpPow2(Fp, n, _sboxPower), "sboxFn");
    if (sboxPower === 3)
      sboxFn = /* @__PURE__ */ __name((n) => Fp.mul(Fp.sqrN(n), n), "sboxFn");
    else if (sboxPower === 5)
      sboxFn = /* @__PURE__ */ __name((n) => Fp.mul(Fp.sqrN(Fp.sqrN(n)), n), "sboxFn");
    return Object.freeze({ ...opts, rounds, sboxFn, roundConstants, mds: _mds });
  }
  __name(validateOpts3, "validateOpts");
  function splitConstants(rc, t) {
    if (typeof t !== "number")
      throw new Error("poseidonSplitConstants: invalid t");
    if (!Array.isArray(rc) || rc.length % t)
      throw new Error("poseidonSplitConstants: invalid rc");
    const res = [];
    let tmp = [];
    for (let i = 0; i < rc.length; i++) {
      tmp.push(rc[i]);
      if (tmp.length === t) {
        res.push(tmp);
        tmp = [];
      }
    }
    return res;
  }
  __name(splitConstants, "splitConstants");
  function poseidon2(opts) {
    const _opts = validateOpts3(opts);
    const { Fp, mds, roundConstants, rounds: totalRounds, roundsPartial, sboxFn, t } = _opts;
    const halfRoundsFull = _opts.roundsFull / 2;
    const partialIdx = _opts.reversePartialPowIdx ? t - 1 : 0;
    const poseidonRound = /* @__PURE__ */ __name((values, isFull, idx) => {
      values = values.map((i, j) => Fp.add(i, roundConstants[idx][j]));
      if (isFull)
        values = values.map((i) => sboxFn(i));
      else
        values[partialIdx] = sboxFn(values[partialIdx]);
      values = mds.map((i) => i.reduce((acc, i2, j) => Fp.add(acc, Fp.mulN(i2, values[j])), Fp.ZERO));
      return values;
    }, "poseidonRound");
    const poseidonHash2 = /* @__PURE__ */ __name(function poseidonHash3(values) {
      if (!Array.isArray(values) || values.length !== t)
        throw new Error("invalid values, expected array of bigints with length " + t);
      values = values.map((i) => {
        if (typeof i !== "bigint")
          throw new Error("invalid bigint=" + i);
        return Fp.create(i);
      });
      let lastRound = 0;
      for (let i = 0; i < halfRoundsFull; i++)
        values = poseidonRound(values, true, lastRound++);
      for (let i = 0; i < roundsPartial; i++)
        values = poseidonRound(values, false, lastRound++);
      for (let i = 0; i < halfRoundsFull; i++)
        values = poseidonRound(values, true, lastRound++);
      if (lastRound !== totalRounds)
        throw new Error("invalid number of rounds");
      return values;
    }, "poseidonHash");
    poseidonHash2.roundConstants = roundConstants;
    return poseidonHash2;
  }
  __name(poseidon2, "poseidon");

  // node_modules/starknet/node_modules/@noble/curves/esm/abstract/weierstrass.js
  var weierstrass_exports = {};
  __export(weierstrass_exports, {
    DER: () => DER2,
    SWUFpSqrtRatio: () => SWUFpSqrtRatio,
    mapToCurveSimpleSWU: () => mapToCurveSimpleSWU,
    weierstrass: () => weierstrass2,
    weierstrassPoints: () => weierstrassPoints2
  });

  // node_modules/starknet/node_modules/@noble/curves/esm/abstract/curve.js
  var _0n9 = BigInt(0);
  var _1n9 = BigInt(1);
  function constTimeNegate2(condition, item) {
    const neg = item.negate();
    return condition ? neg : item;
  }
  __name(constTimeNegate2, "constTimeNegate");
  function validateW2(W, bits) {
    if (!Number.isSafeInteger(W) || W <= 0 || W > bits)
      throw new Error("invalid window size, expected [1.." + bits + "], got W=" + W);
  }
  __name(validateW2, "validateW");
  function calcWOpts2(W, bits) {
    validateW2(W, bits);
    const windows = Math.ceil(bits / W) + 1;
    const windowSize = 2 ** (W - 1);
    return { windows, windowSize };
  }
  __name(calcWOpts2, "calcWOpts");
  function validateMSMPoints2(points, c) {
    if (!Array.isArray(points))
      throw new Error("array expected");
    points.forEach((p, i) => {
      if (!(p instanceof c))
        throw new Error("invalid point at index " + i);
    });
  }
  __name(validateMSMPoints2, "validateMSMPoints");
  function validateMSMScalars2(scalars, field) {
    if (!Array.isArray(scalars))
      throw new Error("array of scalars expected");
    scalars.forEach((s, i) => {
      if (!field.isValid(s))
        throw new Error("invalid scalar at index " + i);
    });
  }
  __name(validateMSMScalars2, "validateMSMScalars");
  var pointPrecomputes2 = /* @__PURE__ */ new WeakMap();
  var pointWindowSizes2 = /* @__PURE__ */ new WeakMap();
  function getW2(P) {
    return pointWindowSizes2.get(P) || 1;
  }
  __name(getW2, "getW");
  function wNAF2(c, bits) {
    return {
      constTimeNegate: constTimeNegate2,
      hasPrecomputes(elm) {
        return getW2(elm) !== 1;
      },
      // non-const time multiplication ladder
      unsafeLadder(elm, n, p = c.ZERO) {
        let d = elm;
        while (n > _0n9) {
          if (n & _1n9)
            p = p.add(d);
          d = d.double();
          n >>= _1n9;
        }
        return p;
      },
      /**
       * Creates a wNAF precomputation window. Used for caching.
       * Default window size is set by `utils.precompute()` and is equal to 8.
       * Number of precomputed points depends on the curve size:
       * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
       * - 𝑊 is the window size
       * - 𝑛 is the bitlength of the curve order.
       * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
       * @param elm Point instance
       * @param W window size
       * @returns precomputed point tables flattened to a single array
       */
      precomputeWindow(elm, W) {
        const { windows, windowSize } = calcWOpts2(W, bits);
        const points = [];
        let p = elm;
        let base2 = p;
        for (let window2 = 0; window2 < windows; window2++) {
          base2 = p;
          points.push(base2);
          for (let i = 1; i < windowSize; i++) {
            base2 = base2.add(p);
            points.push(base2);
          }
          p = base2.double();
        }
        return points;
      },
      /**
       * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
       * @param W window size
       * @param precomputes precomputed tables
       * @param n scalar (we don't check here, but should be less than curve order)
       * @returns real and fake (for const-time) points
       */
      wNAF(W, precomputes, n) {
        const { windows, windowSize } = calcWOpts2(W, bits);
        let p = c.ZERO;
        let f = c.BASE;
        const mask = BigInt(2 ** W - 1);
        const maxNumber = 2 ** W;
        const shiftBy = BigInt(W);
        for (let window2 = 0; window2 < windows; window2++) {
          const offset = window2 * windowSize;
          let wbits = Number(n & mask);
          n >>= shiftBy;
          if (wbits > windowSize) {
            wbits -= maxNumber;
            n += _1n9;
          }
          const offset1 = offset;
          const offset2 = offset + Math.abs(wbits) - 1;
          const cond1 = window2 % 2 !== 0;
          const cond2 = wbits < 0;
          if (wbits === 0) {
            f = f.add(constTimeNegate2(cond1, precomputes[offset1]));
          } else {
            p = p.add(constTimeNegate2(cond2, precomputes[offset2]));
          }
        }
        return { p, f };
      },
      /**
       * Implements ec unsafe (non const-time) multiplication using precomputed tables and w-ary non-adjacent form.
       * @param W window size
       * @param precomputes precomputed tables
       * @param n scalar (we don't check here, but should be less than curve order)
       * @param acc accumulator point to add result of multiplication
       * @returns point
       */
      wNAFUnsafe(W, precomputes, n, acc = c.ZERO) {
        const { windows, windowSize } = calcWOpts2(W, bits);
        const mask = BigInt(2 ** W - 1);
        const maxNumber = 2 ** W;
        const shiftBy = BigInt(W);
        for (let window2 = 0; window2 < windows; window2++) {
          const offset = window2 * windowSize;
          if (n === _0n9)
            break;
          let wbits = Number(n & mask);
          n >>= shiftBy;
          if (wbits > windowSize) {
            wbits -= maxNumber;
            n += _1n9;
          }
          if (wbits === 0)
            continue;
          let curr = precomputes[offset + Math.abs(wbits) - 1];
          if (wbits < 0)
            curr = curr.negate();
          acc = acc.add(curr);
        }
        return acc;
      },
      getPrecomputes(W, P, transform) {
        let comp = pointPrecomputes2.get(P);
        if (!comp) {
          comp = this.precomputeWindow(P, W);
          if (W !== 1)
            pointPrecomputes2.set(P, transform(comp));
        }
        return comp;
      },
      wNAFCached(P, n, transform) {
        const W = getW2(P);
        return this.wNAF(W, this.getPrecomputes(W, P, transform), n);
      },
      wNAFCachedUnsafe(P, n, transform, prev) {
        const W = getW2(P);
        if (W === 1)
          return this.unsafeLadder(P, n, prev);
        return this.wNAFUnsafe(W, this.getPrecomputes(W, P, transform), n, prev);
      },
      // We calculate precomputes for elliptic curve point multiplication
      // using windowed method. This specifies window size and
      // stores precomputed values. Usually only base point would be precomputed.
      setWindowSize(P, W) {
        validateW2(W, bits);
        pointWindowSizes2.set(P, W);
        pointPrecomputes2.delete(P);
      }
    };
  }
  __name(wNAF2, "wNAF");
  function pippenger2(c, fieldN, points, scalars) {
    validateMSMPoints2(points, c);
    validateMSMScalars2(scalars, fieldN);
    if (points.length !== scalars.length)
      throw new Error("arrays of points and scalars must have equal length");
    const zero2 = c.ZERO;
    const wbits = bitLen(BigInt(points.length));
    const windowSize = wbits > 12 ? wbits - 3 : wbits > 4 ? wbits - 2 : wbits ? 2 : 1;
    const MASK = (1 << windowSize) - 1;
    const buckets = new Array(MASK + 1).fill(zero2);
    const lastBits = Math.floor((fieldN.BITS - 1) / windowSize) * windowSize;
    let sum = zero2;
    for (let i = lastBits; i >= 0; i -= windowSize) {
      buckets.fill(zero2);
      for (let j = 0; j < scalars.length; j++) {
        const scalar = scalars[j];
        const wbits2 = Number(scalar >> BigInt(i) & BigInt(MASK));
        buckets[wbits2] = buckets[wbits2].add(points[j]);
      }
      let resI = zero2;
      for (let j = buckets.length - 1, sumI = zero2; j > 0; j--) {
        sumI = sumI.add(buckets[j]);
        resI = resI.add(sumI);
      }
      sum = sum.add(resI);
      if (i !== 0)
        for (let j = 0; j < windowSize; j++)
          sum = sum.double();
    }
    return sum;
  }
  __name(pippenger2, "pippenger");
  function validateBasic2(curve2) {
    validateField2(curve2.Fp);
    validateObject(curve2, {
      n: "bigint",
      h: "bigint",
      Gx: "field",
      Gy: "field"
    }, {
      nBitLength: "isSafeInteger",
      nByteLength: "isSafeInteger"
    });
    return Object.freeze({
      ...nLength2(curve2.n, curve2.nBitLength),
      ...curve2,
      ...{ p: curve2.Fp.ORDER }
    });
  }
  __name(validateBasic2, "validateBasic");

  // node_modules/starknet/node_modules/@noble/curves/esm/abstract/weierstrass.js
  function validateSigVerOpts2(opts) {
    if (opts.lowS !== void 0)
      abool("lowS", opts.lowS);
    if (opts.prehash !== void 0)
      abool("prehash", opts.prehash);
  }
  __name(validateSigVerOpts2, "validateSigVerOpts");
  function validatePointOpts2(curve2) {
    const opts = validateBasic2(curve2);
    validateObject(opts, {
      a: "field",
      b: "field"
    }, {
      allowedPrivateKeyLengths: "array",
      wrapPrivateKey: "boolean",
      isTorsionFree: "function",
      clearCofactor: "function",
      allowInfinityPoint: "boolean",
      fromBytes: "function",
      toBytes: "function"
    });
    const { endo, Fp, a } = opts;
    if (endo) {
      if (!Fp.eql(a, Fp.ZERO)) {
        throw new Error("invalid endomorphism, can only be defined for Koblitz curves that have a=0");
      }
      if (typeof endo !== "object" || typeof endo.beta !== "bigint" || typeof endo.splitScalar !== "function") {
        throw new Error("invalid endomorphism, expected beta: bigint and splitScalar: function");
      }
    }
    return Object.freeze({ ...opts });
  }
  __name(validatePointOpts2, "validatePointOpts");
  var { bytesToNumberBE: b2n2, hexToBytes: h2b2 } = utils_exports;
  var DER2 = {
    // asn.1 DER encoding utils
    Err: class DERErr2 extends Error {
      static {
        __name(this, "DERErr");
      }
      constructor(m = "") {
        super(m);
      }
    },
    // Basic building block is TLV (Tag-Length-Value)
    _tlv: {
      encode: /* @__PURE__ */ __name((tag, data) => {
        const { Err: E } = DER2;
        if (tag < 0 || tag > 256)
          throw new E("tlv.encode: wrong tag");
        if (data.length & 1)
          throw new E("tlv.encode: unpadded data");
        const dataLen = data.length / 2;
        const len = numberToHexUnpadded(dataLen);
        if (len.length / 2 & 128)
          throw new E("tlv.encode: long form length too big");
        const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : "";
        const t = numberToHexUnpadded(tag);
        return t + lenLen + len + data;
      }, "encode"),
      // v - value, l - left bytes (unparsed)
      decode(tag, data) {
        const { Err: E } = DER2;
        let pos = 0;
        if (tag < 0 || tag > 256)
          throw new E("tlv.encode: wrong tag");
        if (data.length < 2 || data[pos++] !== tag)
          throw new E("tlv.decode: wrong tlv");
        const first = data[pos++];
        const isLong = !!(first & 128);
        let length = 0;
        if (!isLong)
          length = first;
        else {
          const lenLen = first & 127;
          if (!lenLen)
            throw new E("tlv.decode(long): indefinite length not supported");
          if (lenLen > 4)
            throw new E("tlv.decode(long): byte length is too big");
          const lengthBytes = data.subarray(pos, pos + lenLen);
          if (lengthBytes.length !== lenLen)
            throw new E("tlv.decode: length bytes not complete");
          if (lengthBytes[0] === 0)
            throw new E("tlv.decode(long): zero leftmost byte");
          for (const b of lengthBytes)
            length = length << 8 | b;
          pos += lenLen;
          if (length < 128)
            throw new E("tlv.decode(long): not minimal encoding");
        }
        const v = data.subarray(pos, pos + length);
        if (v.length !== length)
          throw new E("tlv.decode: wrong value length");
        return { v, l: data.subarray(pos + length) };
      }
    },
    // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
    // since we always use positive integers here. It must always be empty:
    // - add zero byte if exists
    // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
    _int: {
      encode(num) {
        const { Err: E } = DER2;
        if (num < _0n10)
          throw new E("integer: negative integers are not allowed");
        let hex = numberToHexUnpadded(num);
        if (Number.parseInt(hex[0], 16) & 8)
          hex = "00" + hex;
        if (hex.length & 1)
          throw new E("unexpected DER parsing assertion: unpadded hex");
        return hex;
      },
      decode(data) {
        const { Err: E } = DER2;
        if (data[0] & 128)
          throw new E("invalid signature integer: negative");
        if (data[0] === 0 && !(data[1] & 128))
          throw new E("invalid signature integer: unnecessary leading zero");
        return b2n2(data);
      }
    },
    toSig(hex) {
      const { Err: E, _int: int, _tlv: tlv } = DER2;
      const data = typeof hex === "string" ? h2b2(hex) : hex;
      abytes(data);
      const { v: seqBytes, l: seqLeftBytes } = tlv.decode(48, data);
      if (seqLeftBytes.length)
        throw new E("invalid signature: left bytes after parsing");
      const { v: rBytes, l: rLeftBytes } = tlv.decode(2, seqBytes);
      const { v: sBytes, l: sLeftBytes } = tlv.decode(2, rLeftBytes);
      if (sLeftBytes.length)
        throw new E("invalid signature: left bytes after parsing");
      return { r: int.decode(rBytes), s: int.decode(sBytes) };
    },
    hexFromSig(sig) {
      const { _tlv: tlv, _int: int } = DER2;
      const rs = tlv.encode(2, int.encode(sig.r));
      const ss = tlv.encode(2, int.encode(sig.s));
      const seq = rs + ss;
      return tlv.encode(48, seq);
    }
  };
  var _0n10 = BigInt(0);
  var _1n10 = BigInt(1);
  var _2n8 = BigInt(2);
  var _3n4 = BigInt(3);
  var _4n4 = BigInt(4);
  function weierstrassPoints2(opts) {
    const CURVE2 = validatePointOpts2(opts);
    const { Fp } = CURVE2;
    const Fn = Field2(CURVE2.n, CURVE2.nBitLength);
    const toBytes4 = CURVE2.toBytes || ((_c, point, _isCompressed) => {
      const a = point.toAffine();
      return concatBytes(Uint8Array.from([4]), Fp.toBytes(a.x), Fp.toBytes(a.y));
    });
    const fromBytes = CURVE2.fromBytes || ((bytes) => {
      const tail = bytes.subarray(1);
      const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
      const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
      return { x, y };
    });
    function weierstrassEquation(x) {
      const { a, b } = CURVE2;
      const x2 = Fp.sqr(x);
      const x3 = Fp.mul(x2, x);
      return Fp.add(Fp.add(x3, Fp.mul(x, a)), b);
    }
    __name(weierstrassEquation, "weierstrassEquation");
    if (!Fp.eql(Fp.sqr(CURVE2.Gy), weierstrassEquation(CURVE2.Gx)))
      throw new Error("bad generator point: equation left != right");
    function isWithinCurveOrder(num) {
      return inRange(num, _1n10, CURVE2.n);
    }
    __name(isWithinCurveOrder, "isWithinCurveOrder");
    function normPrivateKeyToScalar(key) {
      const { allowedPrivateKeyLengths: lengths, nByteLength, wrapPrivateKey, n: N } = CURVE2;
      if (lengths && typeof key !== "bigint") {
        if (isBytes2(key))
          key = bytesToHex(key);
        if (typeof key !== "string" || !lengths.includes(key.length))
          throw new Error("invalid private key");
        key = key.padStart(nByteLength * 2, "0");
      }
      let num;
      try {
        num = typeof key === "bigint" ? key : bytesToNumberBE(ensureBytes("private key", key, nByteLength));
      } catch (error2) {
        throw new Error("invalid private key, expected hex or " + nByteLength + " bytes, got " + typeof key);
      }
      if (wrapPrivateKey)
        num = mod2(num, N);
      aInRange("private key", num, _1n10, N);
      return num;
    }
    __name(normPrivateKeyToScalar, "normPrivateKeyToScalar");
    function assertPrjPoint(other) {
      if (!(other instanceof Point2))
        throw new Error("ProjectivePoint expected");
    }
    __name(assertPrjPoint, "assertPrjPoint");
    const toAffineMemo = memoized((p, iz) => {
      const { px: x, py: y, pz: z } = p;
      if (Fp.eql(z, Fp.ONE))
        return { x, y };
      const is0 = p.is0();
      if (iz == null)
        iz = is0 ? Fp.ONE : Fp.inv(z);
      const ax = Fp.mul(x, iz);
      const ay = Fp.mul(y, iz);
      const zz = Fp.mul(z, iz);
      if (is0)
        return { x: Fp.ZERO, y: Fp.ZERO };
      if (!Fp.eql(zz, Fp.ONE))
        throw new Error("invZ was invalid");
      return { x: ax, y: ay };
    });
    const assertValidMemo = memoized((p) => {
      if (p.is0()) {
        if (CURVE2.allowInfinityPoint && !Fp.is0(p.py))
          return;
        throw new Error("bad point: ZERO");
      }
      const { x, y } = p.toAffine();
      if (!Fp.isValid(x) || !Fp.isValid(y))
        throw new Error("bad point: x or y not FE");
      const left = Fp.sqr(y);
      const right = weierstrassEquation(x);
      if (!Fp.eql(left, right))
        throw new Error("bad point: equation left != right");
      if (!p.isTorsionFree())
        throw new Error("bad point: not in prime-order subgroup");
      return true;
    });
    class Point2 {
      static {
        __name(this, "Point");
      }
      constructor(px, py, pz) {
        this.px = px;
        this.py = py;
        this.pz = pz;
        if (px == null || !Fp.isValid(px))
          throw new Error("x required");
        if (py == null || !Fp.isValid(py))
          throw new Error("y required");
        if (pz == null || !Fp.isValid(pz))
          throw new Error("z required");
        Object.freeze(this);
      }
      // Does not validate if the point is on-curve.
      // Use fromHex instead, or call assertValidity() later.
      static fromAffine(p) {
        const { x, y } = p || {};
        if (!p || !Fp.isValid(x) || !Fp.isValid(y))
          throw new Error("invalid affine point");
        if (p instanceof Point2)
          throw new Error("projective point not allowed");
        const is0 = /* @__PURE__ */ __name((i) => Fp.eql(i, Fp.ZERO), "is0");
        if (is0(x) && is0(y))
          return Point2.ZERO;
        return new Point2(x, y, Fp.ONE);
      }
      get x() {
        return this.toAffine().x;
      }
      get y() {
        return this.toAffine().y;
      }
      /**
       * Takes a bunch of Projective Points but executes only one
       * inversion on all of them. Inversion is very slow operation,
       * so this improves performance massively.
       * Optimization: converts a list of projective points to a list of identical points with Z=1.
       */
      static normalizeZ(points) {
        const toInv = Fp.invertBatch(points.map((p) => p.pz));
        return points.map((p, i) => p.toAffine(toInv[i])).map(Point2.fromAffine);
      }
      /**
       * Converts hash string or Uint8Array to Point.
       * @param hex short/long ECDSA hex
       */
      static fromHex(hex) {
        const P = Point2.fromAffine(fromBytes(ensureBytes("pointHex", hex)));
        P.assertValidity();
        return P;
      }
      // Multiplies generator point by privateKey.
      static fromPrivateKey(privateKey) {
        return Point2.BASE.multiply(normPrivateKeyToScalar(privateKey));
      }
      // Multiscalar Multiplication
      static msm(points, scalars) {
        return pippenger2(Point2, Fn, points, scalars);
      }
      // "Private method", don't use it directly
      _setWindowSize(windowSize) {
        wnaf.setWindowSize(this, windowSize);
      }
      // A point on curve is valid if it conforms to equation.
      assertValidity() {
        assertValidMemo(this);
      }
      hasEvenY() {
        const { y } = this.toAffine();
        if (Fp.isOdd)
          return !Fp.isOdd(y);
        throw new Error("Field doesn't support isOdd");
      }
      /**
       * Compare one point to another.
       */
      equals(other) {
        assertPrjPoint(other);
        const { px: X1, py: Y1, pz: Z1 } = this;
        const { px: X2, py: Y2, pz: Z2 } = other;
        const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
        const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
        return U1 && U2;
      }
      /**
       * Flips point to one corresponding to (x, -y) in Affine coordinates.
       */
      negate() {
        return new Point2(this.px, Fp.neg(this.py), this.pz);
      }
      // Renes-Costello-Batina exception-free doubling formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 3
      // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
      double() {
        const { a, b } = CURVE2;
        const b3 = Fp.mul(b, _3n4);
        const { px: X1, py: Y1, pz: Z1 } = this;
        let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
        let t0 = Fp.mul(X1, X1);
        let t1 = Fp.mul(Y1, Y1);
        let t2 = Fp.mul(Z1, Z1);
        let t3 = Fp.mul(X1, Y1);
        t3 = Fp.add(t3, t3);
        Z3 = Fp.mul(X1, Z1);
        Z3 = Fp.add(Z3, Z3);
        X3 = Fp.mul(a, Z3);
        Y3 = Fp.mul(b3, t2);
        Y3 = Fp.add(X3, Y3);
        X3 = Fp.sub(t1, Y3);
        Y3 = Fp.add(t1, Y3);
        Y3 = Fp.mul(X3, Y3);
        X3 = Fp.mul(t3, X3);
        Z3 = Fp.mul(b3, Z3);
        t2 = Fp.mul(a, t2);
        t3 = Fp.sub(t0, t2);
        t3 = Fp.mul(a, t3);
        t3 = Fp.add(t3, Z3);
        Z3 = Fp.add(t0, t0);
        t0 = Fp.add(Z3, t0);
        t0 = Fp.add(t0, t2);
        t0 = Fp.mul(t0, t3);
        Y3 = Fp.add(Y3, t0);
        t2 = Fp.mul(Y1, Z1);
        t2 = Fp.add(t2, t2);
        t0 = Fp.mul(t2, t3);
        X3 = Fp.sub(X3, t0);
        Z3 = Fp.mul(t2, t1);
        Z3 = Fp.add(Z3, Z3);
        Z3 = Fp.add(Z3, Z3);
        return new Point2(X3, Y3, Z3);
      }
      // Renes-Costello-Batina exception-free addition formula.
      // There is 30% faster Jacobian formula, but it is not complete.
      // https://eprint.iacr.org/2015/1060, algorithm 1
      // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
      add(other) {
        assertPrjPoint(other);
        const { px: X1, py: Y1, pz: Z1 } = this;
        const { px: X2, py: Y2, pz: Z2 } = other;
        let X3 = Fp.ZERO, Y3 = Fp.ZERO, Z3 = Fp.ZERO;
        const a = CURVE2.a;
        const b3 = Fp.mul(CURVE2.b, _3n4);
        let t0 = Fp.mul(X1, X2);
        let t1 = Fp.mul(Y1, Y2);
        let t2 = Fp.mul(Z1, Z2);
        let t3 = Fp.add(X1, Y1);
        let t4 = Fp.add(X2, Y2);
        t3 = Fp.mul(t3, t4);
        t4 = Fp.add(t0, t1);
        t3 = Fp.sub(t3, t4);
        t4 = Fp.add(X1, Z1);
        let t5 = Fp.add(X2, Z2);
        t4 = Fp.mul(t4, t5);
        t5 = Fp.add(t0, t2);
        t4 = Fp.sub(t4, t5);
        t5 = Fp.add(Y1, Z1);
        X3 = Fp.add(Y2, Z2);
        t5 = Fp.mul(t5, X3);
        X3 = Fp.add(t1, t2);
        t5 = Fp.sub(t5, X3);
        Z3 = Fp.mul(a, t4);
        X3 = Fp.mul(b3, t2);
        Z3 = Fp.add(X3, Z3);
        X3 = Fp.sub(t1, Z3);
        Z3 = Fp.add(t1, Z3);
        Y3 = Fp.mul(X3, Z3);
        t1 = Fp.add(t0, t0);
        t1 = Fp.add(t1, t0);
        t2 = Fp.mul(a, t2);
        t4 = Fp.mul(b3, t4);
        t1 = Fp.add(t1, t2);
        t2 = Fp.sub(t0, t2);
        t2 = Fp.mul(a, t2);
        t4 = Fp.add(t4, t2);
        t0 = Fp.mul(t1, t4);
        Y3 = Fp.add(Y3, t0);
        t0 = Fp.mul(t5, t4);
        X3 = Fp.mul(t3, X3);
        X3 = Fp.sub(X3, t0);
        t0 = Fp.mul(t3, t1);
        Z3 = Fp.mul(t5, Z3);
        Z3 = Fp.add(Z3, t0);
        return new Point2(X3, Y3, Z3);
      }
      subtract(other) {
        return this.add(other.negate());
      }
      is0() {
        return this.equals(Point2.ZERO);
      }
      wNAF(n) {
        return wnaf.wNAFCached(this, n, Point2.normalizeZ);
      }
      /**
       * Non-constant-time multiplication. Uses double-and-add algorithm.
       * It's faster, but should only be used when you don't care about
       * an exposed private key e.g. sig verification, which works over *public* keys.
       */
      multiplyUnsafe(sc) {
        const { endo, n: N } = CURVE2;
        aInRange("scalar", sc, _0n10, N);
        const I = Point2.ZERO;
        if (sc === _0n10)
          return I;
        if (this.is0() || sc === _1n10)
          return this;
        if (!endo || wnaf.hasPrecomputes(this))
          return wnaf.wNAFCachedUnsafe(this, sc, Point2.normalizeZ);
        let { k1neg, k1, k2neg, k2 } = endo.splitScalar(sc);
        let k1p = I;
        let k2p = I;
        let d = this;
        while (k1 > _0n10 || k2 > _0n10) {
          if (k1 & _1n10)
            k1p = k1p.add(d);
          if (k2 & _1n10)
            k2p = k2p.add(d);
          d = d.double();
          k1 >>= _1n10;
          k2 >>= _1n10;
        }
        if (k1neg)
          k1p = k1p.negate();
        if (k2neg)
          k2p = k2p.negate();
        k2p = new Point2(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
        return k1p.add(k2p);
      }
      /**
       * Constant time multiplication.
       * Uses wNAF method. Windowed method may be 10% faster,
       * but takes 2x longer to generate and consumes 2x memory.
       * Uses precomputes when available.
       * Uses endomorphism for Koblitz curves.
       * @param scalar by which the point would be multiplied
       * @returns New point
       */
      multiply(scalar) {
        const { endo, n: N } = CURVE2;
        aInRange("scalar", scalar, _1n10, N);
        let point, fake;
        if (endo) {
          const { k1neg, k1, k2neg, k2 } = endo.splitScalar(scalar);
          let { p: k1p, f: f1p } = this.wNAF(k1);
          let { p: k2p, f: f2p } = this.wNAF(k2);
          k1p = wnaf.constTimeNegate(k1neg, k1p);
          k2p = wnaf.constTimeNegate(k2neg, k2p);
          k2p = new Point2(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
          point = k1p.add(k2p);
          fake = f1p.add(f2p);
        } else {
          const { p, f } = this.wNAF(scalar);
          point = p;
          fake = f;
        }
        return Point2.normalizeZ([point, fake])[0];
      }
      /**
       * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
       * Not using Strauss-Shamir trick: precomputation tables are faster.
       * The trick could be useful if both P and Q are not G (not in our case).
       * @returns non-zero affine point
       */
      multiplyAndAddUnsafe(Q, a, b) {
        const G = Point2.BASE;
        const mul = /* @__PURE__ */ __name((P, a2) => a2 === _0n10 || a2 === _1n10 || !P.equals(G) ? P.multiplyUnsafe(a2) : P.multiply(a2), "mul");
        const sum = mul(this, a).add(mul(Q, b));
        return sum.is0() ? void 0 : sum;
      }
      // Converts Projective point to affine (x, y) coordinates.
      // Can accept precomputed Z^-1 - for example, from invertBatch.
      // (x, y, z) ∋ (x=x/z, y=y/z)
      toAffine(iz) {
        return toAffineMemo(this, iz);
      }
      isTorsionFree() {
        const { h: cofactor, isTorsionFree } = CURVE2;
        if (cofactor === _1n10)
          return true;
        if (isTorsionFree)
          return isTorsionFree(Point2, this);
        throw new Error("isTorsionFree() has not been declared for the elliptic curve");
      }
      clearCofactor() {
        const { h: cofactor, clearCofactor } = CURVE2;
        if (cofactor === _1n10)
          return this;
        if (clearCofactor)
          return clearCofactor(Point2, this);
        return this.multiplyUnsafe(CURVE2.h);
      }
      toRawBytes(isCompressed = true) {
        abool("isCompressed", isCompressed);
        this.assertValidity();
        return toBytes4(Point2, this, isCompressed);
      }
      toHex(isCompressed = true) {
        abool("isCompressed", isCompressed);
        return bytesToHex(this.toRawBytes(isCompressed));
      }
    }
    Point2.BASE = new Point2(CURVE2.Gx, CURVE2.Gy, Fp.ONE);
    Point2.ZERO = new Point2(Fp.ZERO, Fp.ONE, Fp.ZERO);
    const _bits = CURVE2.nBitLength;
    const wnaf = wNAF2(Point2, CURVE2.endo ? Math.ceil(_bits / 2) : _bits);
    return {
      CURVE: CURVE2,
      ProjectivePoint: Point2,
      normPrivateKeyToScalar,
      weierstrassEquation,
      isWithinCurveOrder
    };
  }
  __name(weierstrassPoints2, "weierstrassPoints");
  function validateOpts4(curve2) {
    const opts = validateBasic2(curve2);
    validateObject(opts, {
      hash: "hash",
      hmac: "function",
      randomBytes: "function"
    }, {
      bits2int: "function",
      bits2int_modN: "function",
      lowS: "boolean"
    });
    return Object.freeze({ lowS: true, ...opts });
  }
  __name(validateOpts4, "validateOpts");
  function weierstrass2(curveDef) {
    const CURVE2 = validateOpts4(curveDef);
    const { Fp, n: CURVE_ORDER2 } = CURVE2;
    const compressedLen = Fp.BYTES + 1;
    const uncompressedLen = 2 * Fp.BYTES + 1;
    function modN(a) {
      return mod2(a, CURVE_ORDER2);
    }
    __name(modN, "modN");
    function invN(a) {
      return invert2(a, CURVE_ORDER2);
    }
    __name(invN, "invN");
    const { ProjectivePoint: Point2, normPrivateKeyToScalar, weierstrassEquation, isWithinCurveOrder } = weierstrassPoints2({
      ...CURVE2,
      toBytes(_c, point, isCompressed) {
        const a = point.toAffine();
        const x = Fp.toBytes(a.x);
        const cat = concatBytes;
        abool("isCompressed", isCompressed);
        if (isCompressed) {
          return cat(Uint8Array.from([point.hasEvenY() ? 2 : 3]), x);
        } else {
          return cat(Uint8Array.from([4]), x, Fp.toBytes(a.y));
        }
      },
      fromBytes(bytes) {
        const len = bytes.length;
        const head = bytes[0];
        const tail = bytes.subarray(1);
        if (len === compressedLen && (head === 2 || head === 3)) {
          const x = bytesToNumberBE(tail);
          if (!inRange(x, _1n10, Fp.ORDER))
            throw new Error("Point is not on curve");
          const y2 = weierstrassEquation(x);
          let y;
          try {
            y = Fp.sqrt(y2);
          } catch (sqrtError) {
            const suffix = sqrtError instanceof Error ? ": " + sqrtError.message : "";
            throw new Error("Point is not on curve" + suffix);
          }
          const isYOdd = (y & _1n10) === _1n10;
          const isHeadOdd = (head & 1) === 1;
          if (isHeadOdd !== isYOdd)
            y = Fp.neg(y);
          return { x, y };
        } else if (len === uncompressedLen && head === 4) {
          const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
          const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
          return { x, y };
        } else {
          const cl = compressedLen;
          const ul = uncompressedLen;
          throw new Error("invalid Point, expected length of " + cl + ", or uncompressed " + ul + ", got " + len);
        }
      }
    });
    const numToNByteStr = /* @__PURE__ */ __name((num) => bytesToHex(numberToBytesBE(num, CURVE2.nByteLength)), "numToNByteStr");
    function isBiggerThanHalfOrder(number) {
      const HALF = CURVE_ORDER2 >> _1n10;
      return number > HALF;
    }
    __name(isBiggerThanHalfOrder, "isBiggerThanHalfOrder");
    function normalizeS(s) {
      return isBiggerThanHalfOrder(s) ? modN(-s) : s;
    }
    __name(normalizeS, "normalizeS");
    const slcNum = /* @__PURE__ */ __name((b, from, to) => bytesToNumberBE(b.slice(from, to)), "slcNum");
    class Signature2 {
      static {
        __name(this, "Signature");
      }
      constructor(r, s, recovery) {
        this.r = r;
        this.s = s;
        this.recovery = recovery;
        this.assertValidity();
      }
      // pair (bytes of r, bytes of s)
      static fromCompact(hex) {
        const l = CURVE2.nByteLength;
        hex = ensureBytes("compactSignature", hex, l * 2);
        return new Signature2(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
      }
      // DER encoded ECDSA signature
      // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
      static fromDER(hex) {
        const { r, s } = DER2.toSig(ensureBytes("DER", hex));
        return new Signature2(r, s);
      }
      assertValidity() {
        aInRange("r", this.r, _1n10, CURVE_ORDER2);
        aInRange("s", this.s, _1n10, CURVE_ORDER2);
      }
      addRecoveryBit(recovery) {
        return new Signature2(this.r, this.s, recovery);
      }
      recoverPublicKey(msgHash) {
        const { r, s, recovery: rec } = this;
        const h = bits2int_modN(ensureBytes("msgHash", msgHash));
        if (rec == null || ![0, 1, 2, 3].includes(rec))
          throw new Error("recovery id invalid");
        const radj = rec === 2 || rec === 3 ? r + CURVE2.n : r;
        if (radj >= Fp.ORDER)
          throw new Error("recovery id 2 or 3 invalid");
        const prefix = (rec & 1) === 0 ? "02" : "03";
        const R = Point2.fromHex(prefix + numToNByteStr(radj));
        const ir = invN(radj);
        const u1 = modN(-h * ir);
        const u2 = modN(s * ir);
        const Q = Point2.BASE.multiplyAndAddUnsafe(R, u1, u2);
        if (!Q)
          throw new Error("point at infinify");
        Q.assertValidity();
        return Q;
      }
      // Signatures should be low-s, to prevent malleability.
      hasHighS() {
        return isBiggerThanHalfOrder(this.s);
      }
      normalizeS() {
        return this.hasHighS() ? new Signature2(this.r, modN(-this.s), this.recovery) : this;
      }
      // DER-encoded
      toDERRawBytes() {
        return hexToBytes(this.toDERHex());
      }
      toDERHex() {
        return DER2.hexFromSig({ r: this.r, s: this.s });
      }
      // padded bytes of r, then padded bytes of s
      toCompactRawBytes() {
        return hexToBytes(this.toCompactHex());
      }
      toCompactHex() {
        return numToNByteStr(this.r) + numToNByteStr(this.s);
      }
    }
    const utils2 = {
      isValidPrivateKey(privateKey) {
        try {
          normPrivateKeyToScalar(privateKey);
          return true;
        } catch (error2) {
          return false;
        }
      },
      normPrivateKeyToScalar,
      /**
       * Produces cryptographically secure private key from random of size
       * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
       */
      randomPrivateKey: /* @__PURE__ */ __name(() => {
        const length = getMinHashLength2(CURVE2.n);
        return mapHashToField2(CURVE2.randomBytes(length), CURVE2.n);
      }, "randomPrivateKey"),
      /**
       * Creates precompute table for an arbitrary EC point. Makes point "cached".
       * Allows to massively speed-up `point.multiply(scalar)`.
       * @returns cached point
       * @example
       * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
       * fast.multiply(privKey); // much faster ECDH now
       */
      precompute(windowSize = 8, point = Point2.BASE) {
        point._setWindowSize(windowSize);
        point.multiply(BigInt(3));
        return point;
      }
    };
    function getPublicKey2(privateKey, isCompressed = true) {
      return Point2.fromPrivateKey(privateKey).toRawBytes(isCompressed);
    }
    __name(getPublicKey2, "getPublicKey");
    function isProbPub(item) {
      const arr = isBytes2(item);
      const str = typeof item === "string";
      const len = (arr || str) && item.length;
      if (arr)
        return len === compressedLen || len === uncompressedLen;
      if (str)
        return len === 2 * compressedLen || len === 2 * uncompressedLen;
      if (item instanceof Point2)
        return true;
      return false;
    }
    __name(isProbPub, "isProbPub");
    function getSharedSecret2(privateA, publicB, isCompressed = true) {
      if (isProbPub(privateA))
        throw new Error("first arg must be private key");
      if (!isProbPub(publicB))
        throw new Error("second arg must be public key");
      const b = Point2.fromHex(publicB);
      return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
    }
    __name(getSharedSecret2, "getSharedSecret");
    const bits2int2 = CURVE2.bits2int || function(bytes) {
      if (bytes.length > 8192)
        throw new Error("input is too large");
      const num = bytesToNumberBE(bytes);
      const delta = bytes.length * 8 - CURVE2.nBitLength;
      return delta > 0 ? num >> BigInt(delta) : num;
    };
    const bits2int_modN = CURVE2.bits2int_modN || function(bytes) {
      return modN(bits2int2(bytes));
    };
    const ORDER_MASK = bitMask(CURVE2.nBitLength);
    function int2octets(num) {
      aInRange("num < 2^" + CURVE2.nBitLength, num, _0n10, ORDER_MASK);
      return numberToBytesBE(num, CURVE2.nByteLength);
    }
    __name(int2octets, "int2octets");
    function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
      if (["recovered", "canonical"].some((k) => k in opts))
        throw new Error("sign() legacy options not supported");
      const { hash, randomBytes: randomBytes3 } = CURVE2;
      let { lowS, prehash, extraEntropy: ent } = opts;
      if (lowS == null)
        lowS = true;
      msgHash = ensureBytes("msgHash", msgHash);
      validateSigVerOpts2(opts);
      if (prehash)
        msgHash = ensureBytes("prehashed msgHash", hash(msgHash));
      const h1int = bits2int_modN(msgHash);
      const d = normPrivateKeyToScalar(privateKey);
      const seedArgs = [int2octets(d), int2octets(h1int)];
      if (ent != null && ent !== false) {
        const e = ent === true ? randomBytes3(Fp.BYTES) : ent;
        seedArgs.push(ensureBytes("extraEntropy", e));
      }
      const seed = concatBytes(...seedArgs);
      const m = h1int;
      function k2sig(kBytes) {
        const k = bits2int2(kBytes);
        if (!isWithinCurveOrder(k))
          return;
        const ik = invN(k);
        const q = Point2.BASE.multiply(k).toAffine();
        const r = modN(q.x);
        if (r === _0n10)
          return;
        const s = modN(ik * modN(m + r * d));
        if (s === _0n10)
          return;
        let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n10);
        let normS = s;
        if (lowS && isBiggerThanHalfOrder(s)) {
          normS = normalizeS(s);
          recovery ^= 1;
        }
        return new Signature2(r, normS, recovery);
      }
      __name(k2sig, "k2sig");
      return { seed, k2sig };
    }
    __name(prepSig, "prepSig");
    const defaultSigOpts = { lowS: CURVE2.lowS, prehash: false };
    const defaultVerOpts = { lowS: CURVE2.lowS, prehash: false };
    function sign2(msgHash, privKey, opts = defaultSigOpts) {
      const { seed, k2sig } = prepSig(msgHash, privKey, opts);
      const C = CURVE2;
      const drbg = createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac);
      return drbg(seed, k2sig);
    }
    __name(sign2, "sign");
    Point2.BASE._setWindowSize(8);
    function verify2(signature, msgHash, publicKey, opts = defaultVerOpts) {
      const sg = signature;
      msgHash = ensureBytes("msgHash", msgHash);
      publicKey = ensureBytes("publicKey", publicKey);
      const { lowS, prehash, format } = opts;
      validateSigVerOpts2(opts);
      if ("strict" in opts)
        throw new Error("options.strict was renamed to lowS");
      if (format !== void 0 && format !== "compact" && format !== "der")
        throw new Error("format must be compact or der");
      const isHex3 = typeof sg === "string" || isBytes2(sg);
      const isObj = !isHex3 && !format && typeof sg === "object" && sg !== null && typeof sg.r === "bigint" && typeof sg.s === "bigint";
      if (!isHex3 && !isObj)
        throw new Error("invalid signature, expected Uint8Array, hex string or Signature instance");
      let _sig = void 0;
      let P;
      try {
        if (isObj)
          _sig = new Signature2(sg.r, sg.s);
        if (isHex3) {
          try {
            if (format !== "compact")
              _sig = Signature2.fromDER(sg);
          } catch (derError) {
            if (!(derError instanceof DER2.Err))
              throw derError;
          }
          if (!_sig && format !== "der")
            _sig = Signature2.fromCompact(sg);
        }
        P = Point2.fromHex(publicKey);
      } catch (error2) {
        return false;
      }
      if (!_sig)
        return false;
      if (lowS && _sig.hasHighS())
        return false;
      if (prehash)
        msgHash = CURVE2.hash(msgHash);
      const { r, s } = _sig;
      const h = bits2int_modN(msgHash);
      const is = invN(s);
      const u1 = modN(h * is);
      const u2 = modN(r * is);
      const R = Point2.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine();
      if (!R)
        return false;
      const v = modN(R.x);
      return v === r;
    }
    __name(verify2, "verify");
    return {
      CURVE: CURVE2,
      getPublicKey: getPublicKey2,
      getSharedSecret: getSharedSecret2,
      sign: sign2,
      verify: verify2,
      ProjectivePoint: Point2,
      Signature: Signature2,
      utils: utils2
    };
  }
  __name(weierstrass2, "weierstrass");
  function SWUFpSqrtRatio(Fp, Z) {
    const q = Fp.ORDER;
    let l = _0n10;
    for (let o = q - _1n10; o % _2n8 === _0n10; o /= _2n8)
      l += _1n10;
    const c1 = l;
    const _2n_pow_c1_1 = _2n8 << c1 - _1n10 - _1n10;
    const _2n_pow_c1 = _2n_pow_c1_1 * _2n8;
    const c2 = (q - _1n10) / _2n_pow_c1;
    const c3 = (c2 - _1n10) / _2n8;
    const c4 = _2n_pow_c1 - _1n10;
    const c5 = _2n_pow_c1_1;
    const c6 = Fp.pow(Z, c2);
    const c7 = Fp.pow(Z, (c2 + _1n10) / _2n8);
    let sqrtRatio = /* @__PURE__ */ __name((u, v) => {
      let tv1 = c6;
      let tv2 = Fp.pow(v, c4);
      let tv3 = Fp.sqr(tv2);
      tv3 = Fp.mul(tv3, v);
      let tv5 = Fp.mul(u, tv3);
      tv5 = Fp.pow(tv5, c3);
      tv5 = Fp.mul(tv5, tv2);
      tv2 = Fp.mul(tv5, v);
      tv3 = Fp.mul(tv5, u);
      let tv4 = Fp.mul(tv3, tv2);
      tv5 = Fp.pow(tv4, c5);
      let isQR = Fp.eql(tv5, Fp.ONE);
      tv2 = Fp.mul(tv3, c7);
      tv5 = Fp.mul(tv4, tv1);
      tv3 = Fp.cmov(tv2, tv3, isQR);
      tv4 = Fp.cmov(tv5, tv4, isQR);
      for (let i = c1; i > _1n10; i--) {
        let tv52 = i - _2n8;
        tv52 = _2n8 << tv52 - _1n10;
        let tvv5 = Fp.pow(tv4, tv52);
        const e1 = Fp.eql(tvv5, Fp.ONE);
        tv2 = Fp.mul(tv3, tv1);
        tv1 = Fp.mul(tv1, tv1);
        tvv5 = Fp.mul(tv4, tv1);
        tv3 = Fp.cmov(tv2, tv3, e1);
        tv4 = Fp.cmov(tvv5, tv4, e1);
      }
      return { isValid: isQR, value: tv3 };
    }, "sqrtRatio");
    if (Fp.ORDER % _4n4 === _3n4) {
      const c12 = (Fp.ORDER - _3n4) / _4n4;
      const c22 = Fp.sqrt(Fp.neg(Z));
      sqrtRatio = /* @__PURE__ */ __name((u, v) => {
        let tv1 = Fp.sqr(v);
        const tv2 = Fp.mul(u, v);
        tv1 = Fp.mul(tv1, tv2);
        let y1 = Fp.pow(tv1, c12);
        y1 = Fp.mul(y1, tv2);
        const y2 = Fp.mul(y1, c22);
        const tv3 = Fp.mul(Fp.sqr(y1), v);
        const isQR = Fp.eql(tv3, u);
        let y = Fp.cmov(y2, y1, isQR);
        return { isValid: isQR, value: y };
      }, "sqrtRatio");
    }
    return sqrtRatio;
  }
  __name(SWUFpSqrtRatio, "SWUFpSqrtRatio");
  function mapToCurveSimpleSWU(Fp, opts) {
    validateField2(Fp);
    if (!Fp.isValid(opts.A) || !Fp.isValid(opts.B) || !Fp.isValid(opts.Z))
      throw new Error("mapToCurveSimpleSWU: invalid opts");
    const sqrtRatio = SWUFpSqrtRatio(Fp, opts.Z);
    if (!Fp.isOdd)
      throw new Error("Fp.isOdd is not implemented!");
    return (u) => {
      let tv1, tv2, tv3, tv4, tv5, tv6, x, y;
      tv1 = Fp.sqr(u);
      tv1 = Fp.mul(tv1, opts.Z);
      tv2 = Fp.sqr(tv1);
      tv2 = Fp.add(tv2, tv1);
      tv3 = Fp.add(tv2, Fp.ONE);
      tv3 = Fp.mul(tv3, opts.B);
      tv4 = Fp.cmov(opts.Z, Fp.neg(tv2), !Fp.eql(tv2, Fp.ZERO));
      tv4 = Fp.mul(tv4, opts.A);
      tv2 = Fp.sqr(tv3);
      tv6 = Fp.sqr(tv4);
      tv5 = Fp.mul(tv6, opts.A);
      tv2 = Fp.add(tv2, tv5);
      tv2 = Fp.mul(tv2, tv3);
      tv6 = Fp.mul(tv6, tv4);
      tv5 = Fp.mul(tv6, opts.B);
      tv2 = Fp.add(tv2, tv5);
      x = Fp.mul(tv1, tv3);
      const { isValid, value } = sqrtRatio(tv2, tv6);
      y = Fp.mul(tv1, u);
      y = Fp.mul(y, value);
      x = Fp.cmov(x, tv3, isValid);
      y = Fp.cmov(y, value, isValid);
      const e1 = Fp.isOdd(u) === Fp.isOdd(y);
      y = Fp.cmov(Fp.neg(y), y, e1);
      x = Fp.div(x, tv4);
      return { x, y };
    };
  }
  __name(mapToCurveSimpleSWU, "mapToCurveSimpleSWU");

  // node_modules/pako/dist/pako.esm.mjs
  var Z_FIXED$1 = 4;
  var Z_BINARY = 0;
  var Z_TEXT = 1;
  var Z_UNKNOWN$1 = 2;
  function zero$1(buf) {
    let len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  }
  __name(zero$1, "zero$1");
  var STORED_BLOCK = 0;
  var STATIC_TREES = 1;
  var DYN_TREES = 2;
  var MIN_MATCH$1 = 3;
  var MAX_MATCH$1 = 258;
  var LENGTH_CODES$1 = 29;
  var LITERALS$1 = 256;
  var L_CODES$1 = LITERALS$1 + 1 + LENGTH_CODES$1;
  var D_CODES$1 = 30;
  var BL_CODES$1 = 19;
  var HEAP_SIZE$1 = 2 * L_CODES$1 + 1;
  var MAX_BITS$1 = 15;
  var Buf_size = 16;
  var MAX_BL_BITS = 7;
  var END_BLOCK = 256;
  var REP_3_6 = 16;
  var REPZ_3_10 = 17;
  var REPZ_11_138 = 18;
  var extra_lbits = (
    /* extra bits for each length code */
    new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0])
  );
  var extra_dbits = (
    /* extra bits for each distance code */
    new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13])
  );
  var extra_blbits = (
    /* extra bits for each bit length code */
    new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7])
  );
  var bl_order = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
  var DIST_CODE_LEN = 512;
  var static_ltree = new Array((L_CODES$1 + 2) * 2);
  zero$1(static_ltree);
  var static_dtree = new Array(D_CODES$1 * 2);
  zero$1(static_dtree);
  var _dist_code = new Array(DIST_CODE_LEN);
  zero$1(_dist_code);
  var _length_code = new Array(MAX_MATCH$1 - MIN_MATCH$1 + 1);
  zero$1(_length_code);
  var base_length = new Array(LENGTH_CODES$1);
  zero$1(base_length);
  var base_dist = new Array(D_CODES$1);
  zero$1(base_dist);
  function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
    this.static_tree = static_tree;
    this.extra_bits = extra_bits;
    this.extra_base = extra_base;
    this.elems = elems;
    this.max_length = max_length;
    this.has_stree = static_tree && static_tree.length;
  }
  __name(StaticTreeDesc, "StaticTreeDesc");
  var static_l_desc;
  var static_d_desc;
  var static_bl_desc;
  function TreeDesc(dyn_tree, stat_desc) {
    this.dyn_tree = dyn_tree;
    this.max_code = 0;
    this.stat_desc = stat_desc;
  }
  __name(TreeDesc, "TreeDesc");
  var d_code = /* @__PURE__ */ __name((dist) => {
    return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
  }, "d_code");
  var put_short = /* @__PURE__ */ __name((s, w) => {
    s.pending_buf[s.pending++] = w & 255;
    s.pending_buf[s.pending++] = w >>> 8 & 255;
  }, "put_short");
  var send_bits = /* @__PURE__ */ __name((s, value, length) => {
    if (s.bi_valid > Buf_size - length) {
      s.bi_buf |= value << s.bi_valid & 65535;
      put_short(s, s.bi_buf);
      s.bi_buf = value >> Buf_size - s.bi_valid;
      s.bi_valid += length - Buf_size;
    } else {
      s.bi_buf |= value << s.bi_valid & 65535;
      s.bi_valid += length;
    }
  }, "send_bits");
  var send_code = /* @__PURE__ */ __name((s, c, tree) => {
    send_bits(
      s,
      tree[c * 2],
      tree[c * 2 + 1]
      /*.Len*/
    );
  }, "send_code");
  var bi_reverse = /* @__PURE__ */ __name((code, len) => {
    let res = 0;
    do {
      res |= code & 1;
      code >>>= 1;
      res <<= 1;
    } while (--len > 0);
    return res >>> 1;
  }, "bi_reverse");
  var bi_flush = /* @__PURE__ */ __name((s) => {
    if (s.bi_valid === 16) {
      put_short(s, s.bi_buf);
      s.bi_buf = 0;
      s.bi_valid = 0;
    } else if (s.bi_valid >= 8) {
      s.pending_buf[s.pending++] = s.bi_buf & 255;
      s.bi_buf >>= 8;
      s.bi_valid -= 8;
    }
  }, "bi_flush");
  var gen_bitlen = /* @__PURE__ */ __name((s, desc) => {
    const tree = desc.dyn_tree;
    const max_code = desc.max_code;
    const stree = desc.stat_desc.static_tree;
    const has_stree = desc.stat_desc.has_stree;
    const extra = desc.stat_desc.extra_bits;
    const base2 = desc.stat_desc.extra_base;
    const max_length = desc.stat_desc.max_length;
    let h;
    let n, m;
    let bits;
    let xbits;
    let f;
    let overflow = 0;
    for (bits = 0; bits <= MAX_BITS$1; bits++) {
      s.bl_count[bits] = 0;
    }
    tree[s.heap[s.heap_max] * 2 + 1] = 0;
    for (h = s.heap_max + 1; h < HEAP_SIZE$1; h++) {
      n = s.heap[h];
      bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
      if (bits > max_length) {
        bits = max_length;
        overflow++;
      }
      tree[n * 2 + 1] = bits;
      if (n > max_code) {
        continue;
      }
      s.bl_count[bits]++;
      xbits = 0;
      if (n >= base2) {
        xbits = extra[n - base2];
      }
      f = tree[n * 2];
      s.opt_len += f * (bits + xbits);
      if (has_stree) {
        s.static_len += f * (stree[n * 2 + 1] + xbits);
      }
    }
    if (overflow === 0) {
      return;
    }
    do {
      bits = max_length - 1;
      while (s.bl_count[bits] === 0) {
        bits--;
      }
      s.bl_count[bits]--;
      s.bl_count[bits + 1] += 2;
      s.bl_count[max_length]--;
      overflow -= 2;
    } while (overflow > 0);
    for (bits = max_length; bits !== 0; bits--) {
      n = s.bl_count[bits];
      while (n !== 0) {
        m = s.heap[--h];
        if (m > max_code) {
          continue;
        }
        if (tree[m * 2 + 1] !== bits) {
          s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
          tree[m * 2 + 1] = bits;
        }
        n--;
      }
    }
  }, "gen_bitlen");
  var gen_codes = /* @__PURE__ */ __name((tree, max_code, bl_count) => {
    const next_code = new Array(MAX_BITS$1 + 1);
    let code = 0;
    let bits;
    let n;
    for (bits = 1; bits <= MAX_BITS$1; bits++) {
      code = code + bl_count[bits - 1] << 1;
      next_code[bits] = code;
    }
    for (n = 0; n <= max_code; n++) {
      let len = tree[n * 2 + 1];
      if (len === 0) {
        continue;
      }
      tree[n * 2] = bi_reverse(next_code[len]++, len);
    }
  }, "gen_codes");
  var tr_static_init = /* @__PURE__ */ __name(() => {
    let n;
    let bits;
    let length;
    let code;
    let dist;
    const bl_count = new Array(MAX_BITS$1 + 1);
    length = 0;
    for (code = 0; code < LENGTH_CODES$1 - 1; code++) {
      base_length[code] = length;
      for (n = 0; n < 1 << extra_lbits[code]; n++) {
        _length_code[length++] = code;
      }
    }
    _length_code[length - 1] = code;
    dist = 0;
    for (code = 0; code < 16; code++) {
      base_dist[code] = dist;
      for (n = 0; n < 1 << extra_dbits[code]; n++) {
        _dist_code[dist++] = code;
      }
    }
    dist >>= 7;
    for (; code < D_CODES$1; code++) {
      base_dist[code] = dist << 7;
      for (n = 0; n < 1 << extra_dbits[code] - 7; n++) {
        _dist_code[256 + dist++] = code;
      }
    }
    for (bits = 0; bits <= MAX_BITS$1; bits++) {
      bl_count[bits] = 0;
    }
    n = 0;
    while (n <= 143) {
      static_ltree[n * 2 + 1] = 8;
      n++;
      bl_count[8]++;
    }
    while (n <= 255) {
      static_ltree[n * 2 + 1] = 9;
      n++;
      bl_count[9]++;
    }
    while (n <= 279) {
      static_ltree[n * 2 + 1] = 7;
      n++;
      bl_count[7]++;
    }
    while (n <= 287) {
      static_ltree[n * 2 + 1] = 8;
      n++;
      bl_count[8]++;
    }
    gen_codes(static_ltree, L_CODES$1 + 1, bl_count);
    for (n = 0; n < D_CODES$1; n++) {
      static_dtree[n * 2 + 1] = 5;
      static_dtree[n * 2] = bi_reverse(n, 5);
    }
    static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS$1 + 1, L_CODES$1, MAX_BITS$1);
    static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0, D_CODES$1, MAX_BITS$1);
    static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0, BL_CODES$1, MAX_BL_BITS);
  }, "tr_static_init");
  var init_block = /* @__PURE__ */ __name((s) => {
    let n;
    for (n = 0; n < L_CODES$1; n++) {
      s.dyn_ltree[n * 2] = 0;
    }
    for (n = 0; n < D_CODES$1; n++) {
      s.dyn_dtree[n * 2] = 0;
    }
    for (n = 0; n < BL_CODES$1; n++) {
      s.bl_tree[n * 2] = 0;
    }
    s.dyn_ltree[END_BLOCK * 2] = 1;
    s.opt_len = s.static_len = 0;
    s.sym_next = s.matches = 0;
  }, "init_block");
  var bi_windup = /* @__PURE__ */ __name((s) => {
    if (s.bi_valid > 8) {
      put_short(s, s.bi_buf);
    } else if (s.bi_valid > 0) {
      s.pending_buf[s.pending++] = s.bi_buf;
    }
    s.bi_buf = 0;
    s.bi_valid = 0;
  }, "bi_windup");
  var smaller = /* @__PURE__ */ __name((tree, n, m, depth) => {
    const _n2 = n * 2;
    const _m2 = m * 2;
    return tree[_n2] < tree[_m2] || tree[_n2] === tree[_m2] && depth[n] <= depth[m];
  }, "smaller");
  var pqdownheap = /* @__PURE__ */ __name((s, tree, k) => {
    const v = s.heap[k];
    let j = k << 1;
    while (j <= s.heap_len) {
      if (j < s.heap_len && smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
        j++;
      }
      if (smaller(tree, v, s.heap[j], s.depth)) {
        break;
      }
      s.heap[k] = s.heap[j];
      k = j;
      j <<= 1;
    }
    s.heap[k] = v;
  }, "pqdownheap");
  var compress_block = /* @__PURE__ */ __name((s, ltree, dtree) => {
    let dist;
    let lc;
    let sx = 0;
    let code;
    let extra;
    if (s.sym_next !== 0) {
      do {
        dist = s.pending_buf[s.sym_buf + sx++] & 255;
        dist += (s.pending_buf[s.sym_buf + sx++] & 255) << 8;
        lc = s.pending_buf[s.sym_buf + sx++];
        if (dist === 0) {
          send_code(s, lc, ltree);
        } else {
          code = _length_code[lc];
          send_code(s, code + LITERALS$1 + 1, ltree);
          extra = extra_lbits[code];
          if (extra !== 0) {
            lc -= base_length[code];
            send_bits(s, lc, extra);
          }
          dist--;
          code = d_code(dist);
          send_code(s, code, dtree);
          extra = extra_dbits[code];
          if (extra !== 0) {
            dist -= base_dist[code];
            send_bits(s, dist, extra);
          }
        }
      } while (sx < s.sym_next);
    }
    send_code(s, END_BLOCK, ltree);
  }, "compress_block");
  var build_tree = /* @__PURE__ */ __name((s, desc) => {
    const tree = desc.dyn_tree;
    const stree = desc.stat_desc.static_tree;
    const has_stree = desc.stat_desc.has_stree;
    const elems = desc.stat_desc.elems;
    let n, m;
    let max_code = -1;
    let node;
    s.heap_len = 0;
    s.heap_max = HEAP_SIZE$1;
    for (n = 0; n < elems; n++) {
      if (tree[n * 2] !== 0) {
        s.heap[++s.heap_len] = max_code = n;
        s.depth[n] = 0;
      } else {
        tree[n * 2 + 1] = 0;
      }
    }
    while (s.heap_len < 2) {
      node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
      tree[node * 2] = 1;
      s.depth[node] = 0;
      s.opt_len--;
      if (has_stree) {
        s.static_len -= stree[node * 2 + 1];
      }
    }
    desc.max_code = max_code;
    for (n = s.heap_len >> 1; n >= 1; n--) {
      pqdownheap(s, tree, n);
    }
    node = elems;
    do {
      n = s.heap[
        1
        /*SMALLEST*/
      ];
      s.heap[
        1
        /*SMALLEST*/
      ] = s.heap[s.heap_len--];
      pqdownheap(
        s,
        tree,
        1
        /*SMALLEST*/
      );
      m = s.heap[
        1
        /*SMALLEST*/
      ];
      s.heap[--s.heap_max] = n;
      s.heap[--s.heap_max] = m;
      tree[node * 2] = tree[n * 2] + tree[m * 2];
      s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
      tree[n * 2 + 1] = tree[m * 2 + 1] = node;
      s.heap[
        1
        /*SMALLEST*/
      ] = node++;
      pqdownheap(
        s,
        tree,
        1
        /*SMALLEST*/
      );
    } while (s.heap_len >= 2);
    s.heap[--s.heap_max] = s.heap[
      1
      /*SMALLEST*/
    ];
    gen_bitlen(s, desc);
    gen_codes(tree, max_code, s.bl_count);
  }, "build_tree");
  var scan_tree = /* @__PURE__ */ __name((s, tree, max_code) => {
    let n;
    let prevlen = -1;
    let curlen;
    let nextlen = tree[0 * 2 + 1];
    let count = 0;
    let max_count = 7;
    let min_count = 4;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    tree[(max_code + 1) * 2 + 1] = 65535;
    for (n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1];
      if (++count < max_count && curlen === nextlen) {
        continue;
      } else if (count < min_count) {
        s.bl_tree[curlen * 2] += count;
      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          s.bl_tree[curlen * 2]++;
        }
        s.bl_tree[REP_3_6 * 2]++;
      } else if (count <= 10) {
        s.bl_tree[REPZ_3_10 * 2]++;
      } else {
        s.bl_tree[REPZ_11_138 * 2]++;
      }
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  }, "scan_tree");
  var send_tree = /* @__PURE__ */ __name((s, tree, max_code) => {
    let n;
    let prevlen = -1;
    let curlen;
    let nextlen = tree[0 * 2 + 1];
    let count = 0;
    let max_count = 7;
    let min_count = 4;
    if (nextlen === 0) {
      max_count = 138;
      min_count = 3;
    }
    for (n = 0; n <= max_code; n++) {
      curlen = nextlen;
      nextlen = tree[(n + 1) * 2 + 1];
      if (++count < max_count && curlen === nextlen) {
        continue;
      } else if (count < min_count) {
        do {
          send_code(s, curlen, s.bl_tree);
        } while (--count !== 0);
      } else if (curlen !== 0) {
        if (curlen !== prevlen) {
          send_code(s, curlen, s.bl_tree);
          count--;
        }
        send_code(s, REP_3_6, s.bl_tree);
        send_bits(s, count - 3, 2);
      } else if (count <= 10) {
        send_code(s, REPZ_3_10, s.bl_tree);
        send_bits(s, count - 3, 3);
      } else {
        send_code(s, REPZ_11_138, s.bl_tree);
        send_bits(s, count - 11, 7);
      }
      count = 0;
      prevlen = curlen;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      } else if (curlen === nextlen) {
        max_count = 6;
        min_count = 3;
      } else {
        max_count = 7;
        min_count = 4;
      }
    }
  }, "send_tree");
  var build_bl_tree = /* @__PURE__ */ __name((s) => {
    let max_blindex;
    scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
    scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
    build_tree(s, s.bl_desc);
    for (max_blindex = BL_CODES$1 - 1; max_blindex >= 3; max_blindex--) {
      if (s.bl_tree[bl_order[max_blindex] * 2 + 1] !== 0) {
        break;
      }
    }
    s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
    return max_blindex;
  }, "build_bl_tree");
  var send_all_trees = /* @__PURE__ */ __name((s, lcodes, dcodes, blcodes) => {
    let rank2;
    send_bits(s, lcodes - 257, 5);
    send_bits(s, dcodes - 1, 5);
    send_bits(s, blcodes - 4, 4);
    for (rank2 = 0; rank2 < blcodes; rank2++) {
      send_bits(s, s.bl_tree[bl_order[rank2] * 2 + 1], 3);
    }
    send_tree(s, s.dyn_ltree, lcodes - 1);
    send_tree(s, s.dyn_dtree, dcodes - 1);
  }, "send_all_trees");
  var detect_data_type = /* @__PURE__ */ __name((s) => {
    let block_mask = 4093624447;
    let n;
    for (n = 0; n <= 31; n++, block_mask >>>= 1) {
      if (block_mask & 1 && s.dyn_ltree[n * 2] !== 0) {
        return Z_BINARY;
      }
    }
    if (s.dyn_ltree[9 * 2] !== 0 || s.dyn_ltree[10 * 2] !== 0 || s.dyn_ltree[13 * 2] !== 0) {
      return Z_TEXT;
    }
    for (n = 32; n < LITERALS$1; n++) {
      if (s.dyn_ltree[n * 2] !== 0) {
        return Z_TEXT;
      }
    }
    return Z_BINARY;
  }, "detect_data_type");
  var static_init_done = false;
  var _tr_init$1 = /* @__PURE__ */ __name((s) => {
    if (!static_init_done) {
      tr_static_init();
      static_init_done = true;
    }
    s.l_desc = new TreeDesc(s.dyn_ltree, static_l_desc);
    s.d_desc = new TreeDesc(s.dyn_dtree, static_d_desc);
    s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
    s.bi_buf = 0;
    s.bi_valid = 0;
    init_block(s);
  }, "_tr_init$1");
  var _tr_stored_block$1 = /* @__PURE__ */ __name((s, buf, stored_len, last) => {
    send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);
    bi_windup(s);
    put_short(s, stored_len);
    put_short(s, ~stored_len);
    if (stored_len) {
      s.pending_buf.set(s.window.subarray(buf, buf + stored_len), s.pending);
    }
    s.pending += stored_len;
  }, "_tr_stored_block$1");
  var _tr_align$1 = /* @__PURE__ */ __name((s) => {
    send_bits(s, STATIC_TREES << 1, 3);
    send_code(s, END_BLOCK, static_ltree);
    bi_flush(s);
  }, "_tr_align$1");
  var _tr_flush_block$1 = /* @__PURE__ */ __name((s, buf, stored_len, last) => {
    let opt_lenb, static_lenb;
    let max_blindex = 0;
    if (s.level > 0) {
      if (s.strm.data_type === Z_UNKNOWN$1) {
        s.strm.data_type = detect_data_type(s);
      }
      build_tree(s, s.l_desc);
      build_tree(s, s.d_desc);
      max_blindex = build_bl_tree(s);
      opt_lenb = s.opt_len + 3 + 7 >>> 3;
      static_lenb = s.static_len + 3 + 7 >>> 3;
      if (static_lenb <= opt_lenb) {
        opt_lenb = static_lenb;
      }
    } else {
      opt_lenb = static_lenb = stored_len + 5;
    }
    if (stored_len + 4 <= opt_lenb && buf !== -1) {
      _tr_stored_block$1(s, buf, stored_len, last);
    } else if (s.strategy === Z_FIXED$1 || static_lenb === opt_lenb) {
      send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
      compress_block(s, static_ltree, static_dtree);
    } else {
      send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
      send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
      compress_block(s, s.dyn_ltree, s.dyn_dtree);
    }
    init_block(s);
    if (last) {
      bi_windup(s);
    }
  }, "_tr_flush_block$1");
  var _tr_tally$1 = /* @__PURE__ */ __name((s, dist, lc) => {
    s.pending_buf[s.sym_buf + s.sym_next++] = dist;
    s.pending_buf[s.sym_buf + s.sym_next++] = dist >> 8;
    s.pending_buf[s.sym_buf + s.sym_next++] = lc;
    if (dist === 0) {
      s.dyn_ltree[lc * 2]++;
    } else {
      s.matches++;
      dist--;
      s.dyn_ltree[(_length_code[lc] + LITERALS$1 + 1) * 2]++;
      s.dyn_dtree[d_code(dist) * 2]++;
    }
    return s.sym_next === s.sym_end;
  }, "_tr_tally$1");
  var _tr_init_1 = _tr_init$1;
  var _tr_stored_block_1 = _tr_stored_block$1;
  var _tr_flush_block_1 = _tr_flush_block$1;
  var _tr_tally_1 = _tr_tally$1;
  var _tr_align_1 = _tr_align$1;
  var trees = {
    _tr_init: _tr_init_1,
    _tr_stored_block: _tr_stored_block_1,
    _tr_flush_block: _tr_flush_block_1,
    _tr_tally: _tr_tally_1,
    _tr_align: _tr_align_1
  };
  var adler32 = /* @__PURE__ */ __name((adler, buf, len, pos) => {
    let s1 = adler & 65535 | 0, s2 = adler >>> 16 & 65535 | 0, n = 0;
    while (len !== 0) {
      n = len > 2e3 ? 2e3 : len;
      len -= n;
      do {
        s1 = s1 + buf[pos++] | 0;
        s2 = s2 + s1 | 0;
      } while (--n);
      s1 %= 65521;
      s2 %= 65521;
    }
    return s1 | s2 << 16 | 0;
  }, "adler32");
  var adler32_1 = adler32;
  var makeTable = /* @__PURE__ */ __name(() => {
    let c, table = [];
    for (var n = 0; n < 256; n++) {
      c = n;
      for (var k = 0; k < 8; k++) {
        c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
      }
      table[n] = c;
    }
    return table;
  }, "makeTable");
  var crcTable = new Uint32Array(makeTable());
  var crc32 = /* @__PURE__ */ __name((crc, buf, len, pos) => {
    const t = crcTable;
    const end = pos + len;
    crc ^= -1;
    for (let i = pos; i < end; i++) {
      crc = crc >>> 8 ^ t[(crc ^ buf[i]) & 255];
    }
    return crc ^ -1;
  }, "crc32");
  var crc32_1 = crc32;
  var messages = {
    2: "need dictionary",
    /* Z_NEED_DICT       2  */
    1: "stream end",
    /* Z_STREAM_END      1  */
    0: "",
    /* Z_OK              0  */
    "-1": "file error",
    /* Z_ERRNO         (-1) */
    "-2": "stream error",
    /* Z_STREAM_ERROR  (-2) */
    "-3": "data error",
    /* Z_DATA_ERROR    (-3) */
    "-4": "insufficient memory",
    /* Z_MEM_ERROR     (-4) */
    "-5": "buffer error",
    /* Z_BUF_ERROR     (-5) */
    "-6": "incompatible version"
    /* Z_VERSION_ERROR (-6) */
  };
  var constants$2 = {
    /* Allowed flush values; see deflate() and inflate() below for details */
    Z_NO_FLUSH: 0,
    Z_PARTIAL_FLUSH: 1,
    Z_SYNC_FLUSH: 2,
    Z_FULL_FLUSH: 3,
    Z_FINISH: 4,
    Z_BLOCK: 5,
    Z_TREES: 6,
    /* Return codes for the compression/decompression functions. Negative values
    * are errors, positive values are used for special but normal events.
    */
    Z_OK: 0,
    Z_STREAM_END: 1,
    Z_NEED_DICT: 2,
    Z_ERRNO: -1,
    Z_STREAM_ERROR: -2,
    Z_DATA_ERROR: -3,
    Z_MEM_ERROR: -4,
    Z_BUF_ERROR: -5,
    //Z_VERSION_ERROR: -6,
    /* compression levels */
    Z_NO_COMPRESSION: 0,
    Z_BEST_SPEED: 1,
    Z_BEST_COMPRESSION: 9,
    Z_DEFAULT_COMPRESSION: -1,
    Z_FILTERED: 1,
    Z_HUFFMAN_ONLY: 2,
    Z_RLE: 3,
    Z_FIXED: 4,
    Z_DEFAULT_STRATEGY: 0,
    /* Possible values of the data_type field (though see inflate()) */
    Z_BINARY: 0,
    Z_TEXT: 1,
    //Z_ASCII:                1, // = Z_TEXT (deprecated)
    Z_UNKNOWN: 2,
    /* The deflate compression method */
    Z_DEFLATED: 8
    //Z_NULL:                 null // Use -1 or null inline, depending on var type
  };
  var { _tr_init, _tr_stored_block, _tr_flush_block, _tr_tally, _tr_align } = trees;
  var {
    Z_NO_FLUSH: Z_NO_FLUSH$2,
    Z_PARTIAL_FLUSH,
    Z_FULL_FLUSH: Z_FULL_FLUSH$1,
    Z_FINISH: Z_FINISH$3,
    Z_BLOCK: Z_BLOCK$1,
    Z_OK: Z_OK$3,
    Z_STREAM_END: Z_STREAM_END$3,
    Z_STREAM_ERROR: Z_STREAM_ERROR$2,
    Z_DATA_ERROR: Z_DATA_ERROR$2,
    Z_BUF_ERROR: Z_BUF_ERROR$1,
    Z_DEFAULT_COMPRESSION: Z_DEFAULT_COMPRESSION$1,
    Z_FILTERED,
    Z_HUFFMAN_ONLY,
    Z_RLE,
    Z_FIXED,
    Z_DEFAULT_STRATEGY: Z_DEFAULT_STRATEGY$1,
    Z_UNKNOWN,
    Z_DEFLATED: Z_DEFLATED$2
  } = constants$2;
  var MAX_MEM_LEVEL = 9;
  var MAX_WBITS$1 = 15;
  var DEF_MEM_LEVEL = 8;
  var LENGTH_CODES = 29;
  var LITERALS = 256;
  var L_CODES = LITERALS + 1 + LENGTH_CODES;
  var D_CODES = 30;
  var BL_CODES = 19;
  var HEAP_SIZE = 2 * L_CODES + 1;
  var MAX_BITS = 15;
  var MIN_MATCH = 3;
  var MAX_MATCH = 258;
  var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
  var PRESET_DICT = 32;
  var INIT_STATE = 42;
  var GZIP_STATE = 57;
  var EXTRA_STATE = 69;
  var NAME_STATE = 73;
  var COMMENT_STATE = 91;
  var HCRC_STATE = 103;
  var BUSY_STATE = 113;
  var FINISH_STATE = 666;
  var BS_NEED_MORE = 1;
  var BS_BLOCK_DONE = 2;
  var BS_FINISH_STARTED = 3;
  var BS_FINISH_DONE = 4;
  var OS_CODE = 3;
  var err = /* @__PURE__ */ __name((strm, errorCode) => {
    strm.msg = messages[errorCode];
    return errorCode;
  }, "err");
  var rank = /* @__PURE__ */ __name((f) => {
    return f * 2 - (f > 4 ? 9 : 0);
  }, "rank");
  var zero = /* @__PURE__ */ __name((buf) => {
    let len = buf.length;
    while (--len >= 0) {
      buf[len] = 0;
    }
  }, "zero");
  var slide_hash = /* @__PURE__ */ __name((s) => {
    let n, m;
    let p;
    let wsize = s.w_size;
    n = s.hash_size;
    p = n;
    do {
      m = s.head[--p];
      s.head[p] = m >= wsize ? m - wsize : 0;
    } while (--n);
    n = wsize;
    p = n;
    do {
      m = s.prev[--p];
      s.prev[p] = m >= wsize ? m - wsize : 0;
    } while (--n);
  }, "slide_hash");
  var HASH_ZLIB = /* @__PURE__ */ __name((s, prev, data) => (prev << s.hash_shift ^ data) & s.hash_mask, "HASH_ZLIB");
  var HASH = HASH_ZLIB;
  var flush_pending = /* @__PURE__ */ __name((strm) => {
    const s = strm.state;
    let len = s.pending;
    if (len > strm.avail_out) {
      len = strm.avail_out;
    }
    if (len === 0) {
      return;
    }
    strm.output.set(s.pending_buf.subarray(s.pending_out, s.pending_out + len), strm.next_out);
    strm.next_out += len;
    s.pending_out += len;
    strm.total_out += len;
    strm.avail_out -= len;
    s.pending -= len;
    if (s.pending === 0) {
      s.pending_out = 0;
    }
  }, "flush_pending");
  var flush_block_only = /* @__PURE__ */ __name((s, last) => {
    _tr_flush_block(s, s.block_start >= 0 ? s.block_start : -1, s.strstart - s.block_start, last);
    s.block_start = s.strstart;
    flush_pending(s.strm);
  }, "flush_block_only");
  var put_byte = /* @__PURE__ */ __name((s, b) => {
    s.pending_buf[s.pending++] = b;
  }, "put_byte");
  var putShortMSB = /* @__PURE__ */ __name((s, b) => {
    s.pending_buf[s.pending++] = b >>> 8 & 255;
    s.pending_buf[s.pending++] = b & 255;
  }, "putShortMSB");
  var read_buf = /* @__PURE__ */ __name((strm, buf, start, size) => {
    let len = strm.avail_in;
    if (len > size) {
      len = size;
    }
    if (len === 0) {
      return 0;
    }
    strm.avail_in -= len;
    buf.set(strm.input.subarray(strm.next_in, strm.next_in + len), start);
    if (strm.state.wrap === 1) {
      strm.adler = adler32_1(strm.adler, buf, len, start);
    } else if (strm.state.wrap === 2) {
      strm.adler = crc32_1(strm.adler, buf, len, start);
    }
    strm.next_in += len;
    strm.total_in += len;
    return len;
  }, "read_buf");
  var longest_match = /* @__PURE__ */ __name((s, cur_match) => {
    let chain_length = s.max_chain_length;
    let scan = s.strstart;
    let match;
    let len;
    let best_len = s.prev_length;
    let nice_match = s.nice_match;
    const limit = s.strstart > s.w_size - MIN_LOOKAHEAD ? s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0;
    const _win = s.window;
    const wmask = s.w_mask;
    const prev = s.prev;
    const strend = s.strstart + MAX_MATCH;
    let scan_end1 = _win[scan + best_len - 1];
    let scan_end = _win[scan + best_len];
    if (s.prev_length >= s.good_match) {
      chain_length >>= 2;
    }
    if (nice_match > s.lookahead) {
      nice_match = s.lookahead;
    }
    do {
      match = cur_match;
      if (_win[match + best_len] !== scan_end || _win[match + best_len - 1] !== scan_end1 || _win[match] !== _win[scan] || _win[++match] !== _win[scan + 1]) {
        continue;
      }
      scan += 2;
      match++;
      do {
      } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && _win[++scan] === _win[++match] && scan < strend);
      len = MAX_MATCH - (strend - scan);
      scan = strend - MAX_MATCH;
      if (len > best_len) {
        s.match_start = cur_match;
        best_len = len;
        if (len >= nice_match) {
          break;
        }
        scan_end1 = _win[scan + best_len - 1];
        scan_end = _win[scan + best_len];
      }
    } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
    if (best_len <= s.lookahead) {
      return best_len;
    }
    return s.lookahead;
  }, "longest_match");
  var fill_window = /* @__PURE__ */ __name((s) => {
    const _w_size = s.w_size;
    let n, more, str;
    do {
      more = s.window_size - s.lookahead - s.strstart;
      if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
        s.window.set(s.window.subarray(_w_size, _w_size + _w_size - more), 0);
        s.match_start -= _w_size;
        s.strstart -= _w_size;
        s.block_start -= _w_size;
        if (s.insert > s.strstart) {
          s.insert = s.strstart;
        }
        slide_hash(s);
        more += _w_size;
      }
      if (s.strm.avail_in === 0) {
        break;
      }
      n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
      s.lookahead += n;
      if (s.lookahead + s.insert >= MIN_MATCH) {
        str = s.strstart - s.insert;
        s.ins_h = s.window[str];
        s.ins_h = HASH(s, s.ins_h, s.window[str + 1]);
        while (s.insert) {
          s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
          s.prev[str & s.w_mask] = s.head[s.ins_h];
          s.head[s.ins_h] = str;
          str++;
          s.insert--;
          if (s.lookahead + s.insert < MIN_MATCH) {
            break;
          }
        }
      }
    } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
  }, "fill_window");
  var deflate_stored = /* @__PURE__ */ __name((s, flush) => {
    let min_block = s.pending_buf_size - 5 > s.w_size ? s.w_size : s.pending_buf_size - 5;
    let len, left, have, last = 0;
    let used = s.strm.avail_in;
    do {
      len = 65535;
      have = s.bi_valid + 42 >> 3;
      if (s.strm.avail_out < have) {
        break;
      }
      have = s.strm.avail_out - have;
      left = s.strstart - s.block_start;
      if (len > left + s.strm.avail_in) {
        len = left + s.strm.avail_in;
      }
      if (len > have) {
        len = have;
      }
      if (len < min_block && (len === 0 && flush !== Z_FINISH$3 || flush === Z_NO_FLUSH$2 || len !== left + s.strm.avail_in)) {
        break;
      }
      last = flush === Z_FINISH$3 && len === left + s.strm.avail_in ? 1 : 0;
      _tr_stored_block(s, 0, 0, last);
      s.pending_buf[s.pending - 4] = len;
      s.pending_buf[s.pending - 3] = len >> 8;
      s.pending_buf[s.pending - 2] = ~len;
      s.pending_buf[s.pending - 1] = ~len >> 8;
      flush_pending(s.strm);
      if (left) {
        if (left > len) {
          left = len;
        }
        s.strm.output.set(s.window.subarray(s.block_start, s.block_start + left), s.strm.next_out);
        s.strm.next_out += left;
        s.strm.avail_out -= left;
        s.strm.total_out += left;
        s.block_start += left;
        len -= left;
      }
      if (len) {
        read_buf(s.strm, s.strm.output, s.strm.next_out, len);
        s.strm.next_out += len;
        s.strm.avail_out -= len;
        s.strm.total_out += len;
      }
    } while (last === 0);
    used -= s.strm.avail_in;
    if (used) {
      if (used >= s.w_size) {
        s.matches = 2;
        s.window.set(s.strm.input.subarray(s.strm.next_in - s.w_size, s.strm.next_in), 0);
        s.strstart = s.w_size;
        s.insert = s.strstart;
      } else {
        if (s.window_size - s.strstart <= used) {
          s.strstart -= s.w_size;
          s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
          if (s.matches < 2) {
            s.matches++;
          }
          if (s.insert > s.strstart) {
            s.insert = s.strstart;
          }
        }
        s.window.set(s.strm.input.subarray(s.strm.next_in - used, s.strm.next_in), s.strstart);
        s.strstart += used;
        s.insert += used > s.w_size - s.insert ? s.w_size - s.insert : used;
      }
      s.block_start = s.strstart;
    }
    if (s.high_water < s.strstart) {
      s.high_water = s.strstart;
    }
    if (last) {
      return BS_FINISH_DONE;
    }
    if (flush !== Z_NO_FLUSH$2 && flush !== Z_FINISH$3 && s.strm.avail_in === 0 && s.strstart === s.block_start) {
      return BS_BLOCK_DONE;
    }
    have = s.window_size - s.strstart;
    if (s.strm.avail_in > have && s.block_start >= s.w_size) {
      s.block_start -= s.w_size;
      s.strstart -= s.w_size;
      s.window.set(s.window.subarray(s.w_size, s.w_size + s.strstart), 0);
      if (s.matches < 2) {
        s.matches++;
      }
      have += s.w_size;
      if (s.insert > s.strstart) {
        s.insert = s.strstart;
      }
    }
    if (have > s.strm.avail_in) {
      have = s.strm.avail_in;
    }
    if (have) {
      read_buf(s.strm, s.window, s.strstart, have);
      s.strstart += have;
      s.insert += have > s.w_size - s.insert ? s.w_size - s.insert : have;
    }
    if (s.high_water < s.strstart) {
      s.high_water = s.strstart;
    }
    have = s.bi_valid + 42 >> 3;
    have = s.pending_buf_size - have > 65535 ? 65535 : s.pending_buf_size - have;
    min_block = have > s.w_size ? s.w_size : have;
    left = s.strstart - s.block_start;
    if (left >= min_block || (left || flush === Z_FINISH$3) && flush !== Z_NO_FLUSH$2 && s.strm.avail_in === 0 && left <= have) {
      len = left > have ? have : left;
      last = flush === Z_FINISH$3 && s.strm.avail_in === 0 && len === left ? 1 : 0;
      _tr_stored_block(s, s.block_start, len, last);
      s.block_start += len;
      flush_pending(s.strm);
    }
    return last ? BS_FINISH_STARTED : BS_NEED_MORE;
  }, "deflate_stored");
  var deflate_fast = /* @__PURE__ */ __name((s, flush) => {
    let hash_head;
    let bflush;
    for (; ; ) {
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      hash_head = 0;
      if (s.lookahead >= MIN_MATCH) {
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
      }
      if (hash_head !== 0 && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
        s.match_length = longest_match(s, hash_head);
      }
      if (s.match_length >= MIN_MATCH) {
        bflush = _tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
        s.lookahead -= s.match_length;
        if (s.match_length <= s.max_lazy_match && s.lookahead >= MIN_MATCH) {
          s.match_length--;
          do {
            s.strstart++;
            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          } while (--s.match_length !== 0);
          s.strstart++;
        } else {
          s.strstart += s.match_length;
          s.match_length = 0;
          s.ins_h = s.window[s.strstart];
          s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + 1]);
        }
      } else {
        bflush = _tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  }, "deflate_fast");
  var deflate_slow = /* @__PURE__ */ __name((s, flush) => {
    let hash_head;
    let bflush;
    let max_insert;
    for (; ; ) {
      if (s.lookahead < MIN_LOOKAHEAD) {
        fill_window(s);
        if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      hash_head = 0;
      if (s.lookahead >= MIN_MATCH) {
        s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
        hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = s.strstart;
      }
      s.prev_length = s.match_length;
      s.prev_match = s.match_start;
      s.match_length = MIN_MATCH - 1;
      if (hash_head !== 0 && s.prev_length < s.max_lazy_match && s.strstart - hash_head <= s.w_size - MIN_LOOKAHEAD) {
        s.match_length = longest_match(s, hash_head);
        if (s.match_length <= 5 && (s.strategy === Z_FILTERED || s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096)) {
          s.match_length = MIN_MATCH - 1;
        }
      }
      if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
        max_insert = s.strstart + s.lookahead - MIN_MATCH;
        bflush = _tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
        s.lookahead -= s.prev_length - 1;
        s.prev_length -= 2;
        do {
          if (++s.strstart <= max_insert) {
            s.ins_h = HASH(s, s.ins_h, s.window[s.strstart + MIN_MATCH - 1]);
            hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
            s.head[s.ins_h] = s.strstart;
          }
        } while (--s.prev_length !== 0);
        s.match_available = 0;
        s.match_length = MIN_MATCH - 1;
        s.strstart++;
        if (bflush) {
          flush_block_only(s, false);
          if (s.strm.avail_out === 0) {
            return BS_NEED_MORE;
          }
        }
      } else if (s.match_available) {
        bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
        if (bflush) {
          flush_block_only(s, false);
        }
        s.strstart++;
        s.lookahead--;
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      } else {
        s.match_available = 1;
        s.strstart++;
        s.lookahead--;
      }
    }
    if (s.match_available) {
      bflush = _tr_tally(s, 0, s.window[s.strstart - 1]);
      s.match_available = 0;
    }
    s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  }, "deflate_slow");
  var deflate_rle = /* @__PURE__ */ __name((s, flush) => {
    let bflush;
    let prev;
    let scan, strend;
    const _win = s.window;
    for (; ; ) {
      if (s.lookahead <= MAX_MATCH) {
        fill_window(s);
        if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH$2) {
          return BS_NEED_MORE;
        }
        if (s.lookahead === 0) {
          break;
        }
      }
      s.match_length = 0;
      if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
        scan = s.strstart - 1;
        prev = _win[scan];
        if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
          strend = s.strstart + MAX_MATCH;
          do {
          } while (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan] && scan < strend);
          s.match_length = MAX_MATCH - (strend - scan);
          if (s.match_length > s.lookahead) {
            s.match_length = s.lookahead;
          }
        }
      }
      if (s.match_length >= MIN_MATCH) {
        bflush = _tr_tally(s, 1, s.match_length - MIN_MATCH);
        s.lookahead -= s.match_length;
        s.strstart += s.match_length;
        s.match_length = 0;
      } else {
        bflush = _tr_tally(s, 0, s.window[s.strstart]);
        s.lookahead--;
        s.strstart++;
      }
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  }, "deflate_rle");
  var deflate_huff = /* @__PURE__ */ __name((s, flush) => {
    let bflush;
    for (; ; ) {
      if (s.lookahead === 0) {
        fill_window(s);
        if (s.lookahead === 0) {
          if (flush === Z_NO_FLUSH$2) {
            return BS_NEED_MORE;
          }
          break;
        }
      }
      s.match_length = 0;
      bflush = _tr_tally(s, 0, s.window[s.strstart]);
      s.lookahead--;
      s.strstart++;
      if (bflush) {
        flush_block_only(s, false);
        if (s.strm.avail_out === 0) {
          return BS_NEED_MORE;
        }
      }
    }
    s.insert = 0;
    if (flush === Z_FINISH$3) {
      flush_block_only(s, true);
      if (s.strm.avail_out === 0) {
        return BS_FINISH_STARTED;
      }
      return BS_FINISH_DONE;
    }
    if (s.sym_next) {
      flush_block_only(s, false);
      if (s.strm.avail_out === 0) {
        return BS_NEED_MORE;
      }
    }
    return BS_BLOCK_DONE;
  }, "deflate_huff");
  function Config(good_length, max_lazy, nice_length, max_chain, func) {
    this.good_length = good_length;
    this.max_lazy = max_lazy;
    this.nice_length = nice_length;
    this.max_chain = max_chain;
    this.func = func;
  }
  __name(Config, "Config");
  var configuration_table = [
    /*      good lazy nice chain */
    new Config(0, 0, 0, 0, deflate_stored),
    /* 0 store only */
    new Config(4, 4, 8, 4, deflate_fast),
    /* 1 max speed, no lazy matches */
    new Config(4, 5, 16, 8, deflate_fast),
    /* 2 */
    new Config(4, 6, 32, 32, deflate_fast),
    /* 3 */
    new Config(4, 4, 16, 16, deflate_slow),
    /* 4 lazy matches */
    new Config(8, 16, 32, 32, deflate_slow),
    /* 5 */
    new Config(8, 16, 128, 128, deflate_slow),
    /* 6 */
    new Config(8, 32, 128, 256, deflate_slow),
    /* 7 */
    new Config(32, 128, 258, 1024, deflate_slow),
    /* 8 */
    new Config(32, 258, 258, 4096, deflate_slow)
    /* 9 max compression */
  ];
  var lm_init = /* @__PURE__ */ __name((s) => {
    s.window_size = 2 * s.w_size;
    zero(s.head);
    s.max_lazy_match = configuration_table[s.level].max_lazy;
    s.good_match = configuration_table[s.level].good_length;
    s.nice_match = configuration_table[s.level].nice_length;
    s.max_chain_length = configuration_table[s.level].max_chain;
    s.strstart = 0;
    s.block_start = 0;
    s.lookahead = 0;
    s.insert = 0;
    s.match_length = s.prev_length = MIN_MATCH - 1;
    s.match_available = 0;
    s.ins_h = 0;
  }, "lm_init");
  function DeflateState() {
    this.strm = null;
    this.status = 0;
    this.pending_buf = null;
    this.pending_buf_size = 0;
    this.pending_out = 0;
    this.pending = 0;
    this.wrap = 0;
    this.gzhead = null;
    this.gzindex = 0;
    this.method = Z_DEFLATED$2;
    this.last_flush = -1;
    this.w_size = 0;
    this.w_bits = 0;
    this.w_mask = 0;
    this.window = null;
    this.window_size = 0;
    this.prev = null;
    this.head = null;
    this.ins_h = 0;
    this.hash_size = 0;
    this.hash_bits = 0;
    this.hash_mask = 0;
    this.hash_shift = 0;
    this.block_start = 0;
    this.match_length = 0;
    this.prev_match = 0;
    this.match_available = 0;
    this.strstart = 0;
    this.match_start = 0;
    this.lookahead = 0;
    this.prev_length = 0;
    this.max_chain_length = 0;
    this.max_lazy_match = 0;
    this.level = 0;
    this.strategy = 0;
    this.good_match = 0;
    this.nice_match = 0;
    this.dyn_ltree = new Uint16Array(HEAP_SIZE * 2);
    this.dyn_dtree = new Uint16Array((2 * D_CODES + 1) * 2);
    this.bl_tree = new Uint16Array((2 * BL_CODES + 1) * 2);
    zero(this.dyn_ltree);
    zero(this.dyn_dtree);
    zero(this.bl_tree);
    this.l_desc = null;
    this.d_desc = null;
    this.bl_desc = null;
    this.bl_count = new Uint16Array(MAX_BITS + 1);
    this.heap = new Uint16Array(2 * L_CODES + 1);
    zero(this.heap);
    this.heap_len = 0;
    this.heap_max = 0;
    this.depth = new Uint16Array(2 * L_CODES + 1);
    zero(this.depth);
    this.sym_buf = 0;
    this.lit_bufsize = 0;
    this.sym_next = 0;
    this.sym_end = 0;
    this.opt_len = 0;
    this.static_len = 0;
    this.matches = 0;
    this.insert = 0;
    this.bi_buf = 0;
    this.bi_valid = 0;
  }
  __name(DeflateState, "DeflateState");
  var deflateStateCheck = /* @__PURE__ */ __name((strm) => {
    if (!strm) {
      return 1;
    }
    const s = strm.state;
    if (!s || s.strm !== strm || s.status !== INIT_STATE && //#ifdef GZIP
    s.status !== GZIP_STATE && //#endif
    s.status !== EXTRA_STATE && s.status !== NAME_STATE && s.status !== COMMENT_STATE && s.status !== HCRC_STATE && s.status !== BUSY_STATE && s.status !== FINISH_STATE) {
      return 1;
    }
    return 0;
  }, "deflateStateCheck");
  var deflateResetKeep = /* @__PURE__ */ __name((strm) => {
    if (deflateStateCheck(strm)) {
      return err(strm, Z_STREAM_ERROR$2);
    }
    strm.total_in = strm.total_out = 0;
    strm.data_type = Z_UNKNOWN;
    const s = strm.state;
    s.pending = 0;
    s.pending_out = 0;
    if (s.wrap < 0) {
      s.wrap = -s.wrap;
    }
    s.status = //#ifdef GZIP
    s.wrap === 2 ? GZIP_STATE : (
      //#endif
      s.wrap ? INIT_STATE : BUSY_STATE
    );
    strm.adler = s.wrap === 2 ? 0 : 1;
    s.last_flush = -2;
    _tr_init(s);
    return Z_OK$3;
  }, "deflateResetKeep");
  var deflateReset = /* @__PURE__ */ __name((strm) => {
    const ret = deflateResetKeep(strm);
    if (ret === Z_OK$3) {
      lm_init(strm.state);
    }
    return ret;
  }, "deflateReset");
  var deflateSetHeader = /* @__PURE__ */ __name((strm, head) => {
    if (deflateStateCheck(strm) || strm.state.wrap !== 2) {
      return Z_STREAM_ERROR$2;
    }
    strm.state.gzhead = head;
    return Z_OK$3;
  }, "deflateSetHeader");
  var deflateInit2 = /* @__PURE__ */ __name((strm, level, method, windowBits, memLevel, strategy) => {
    if (!strm) {
      return Z_STREAM_ERROR$2;
    }
    let wrap = 1;
    if (level === Z_DEFAULT_COMPRESSION$1) {
      level = 6;
    }
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else if (windowBits > 15) {
      wrap = 2;
      windowBits -= 16;
    }
    if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED$2 || windowBits < 8 || windowBits > 15 || level < 0 || level > 9 || strategy < 0 || strategy > Z_FIXED || windowBits === 8 && wrap !== 1) {
      return err(strm, Z_STREAM_ERROR$2);
    }
    if (windowBits === 8) {
      windowBits = 9;
    }
    const s = new DeflateState();
    strm.state = s;
    s.strm = strm;
    s.status = INIT_STATE;
    s.wrap = wrap;
    s.gzhead = null;
    s.w_bits = windowBits;
    s.w_size = 1 << s.w_bits;
    s.w_mask = s.w_size - 1;
    s.hash_bits = memLevel + 7;
    s.hash_size = 1 << s.hash_bits;
    s.hash_mask = s.hash_size - 1;
    s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
    s.window = new Uint8Array(s.w_size * 2);
    s.head = new Uint16Array(s.hash_size);
    s.prev = new Uint16Array(s.w_size);
    s.lit_bufsize = 1 << memLevel + 6;
    s.pending_buf_size = s.lit_bufsize * 4;
    s.pending_buf = new Uint8Array(s.pending_buf_size);
    s.sym_buf = s.lit_bufsize;
    s.sym_end = (s.lit_bufsize - 1) * 3;
    s.level = level;
    s.strategy = strategy;
    s.method = method;
    return deflateReset(strm);
  }, "deflateInit2");
  var deflateInit = /* @__PURE__ */ __name((strm, level) => {
    return deflateInit2(strm, level, Z_DEFLATED$2, MAX_WBITS$1, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY$1);
  }, "deflateInit");
  var deflate$2 = /* @__PURE__ */ __name((strm, flush) => {
    if (deflateStateCheck(strm) || flush > Z_BLOCK$1 || flush < 0) {
      return strm ? err(strm, Z_STREAM_ERROR$2) : Z_STREAM_ERROR$2;
    }
    const s = strm.state;
    if (!strm.output || strm.avail_in !== 0 && !strm.input || s.status === FINISH_STATE && flush !== Z_FINISH$3) {
      return err(strm, strm.avail_out === 0 ? Z_BUF_ERROR$1 : Z_STREAM_ERROR$2);
    }
    const old_flush = s.last_flush;
    s.last_flush = flush;
    if (s.pending !== 0) {
      flush_pending(strm);
      if (strm.avail_out === 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) && flush !== Z_FINISH$3) {
      return err(strm, Z_BUF_ERROR$1);
    }
    if (s.status === FINISH_STATE && strm.avail_in !== 0) {
      return err(strm, Z_BUF_ERROR$1);
    }
    if (s.status === INIT_STATE && s.wrap === 0) {
      s.status = BUSY_STATE;
    }
    if (s.status === INIT_STATE) {
      let header = Z_DEFLATED$2 + (s.w_bits - 8 << 4) << 8;
      let level_flags = -1;
      if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
        level_flags = 0;
      } else if (s.level < 6) {
        level_flags = 1;
      } else if (s.level === 6) {
        level_flags = 2;
      } else {
        level_flags = 3;
      }
      header |= level_flags << 6;
      if (s.strstart !== 0) {
        header |= PRESET_DICT;
      }
      header += 31 - header % 31;
      putShortMSB(s, header);
      if (s.strstart !== 0) {
        putShortMSB(s, strm.adler >>> 16);
        putShortMSB(s, strm.adler & 65535);
      }
      strm.adler = 1;
      s.status = BUSY_STATE;
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
    if (s.status === GZIP_STATE) {
      strm.adler = 0;
      put_byte(s, 31);
      put_byte(s, 139);
      put_byte(s, 8);
      if (!s.gzhead) {
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, 0);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, OS_CODE);
        s.status = BUSY_STATE;
        flush_pending(strm);
        if (s.pending !== 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      } else {
        put_byte(
          s,
          (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (!s.gzhead.extra ? 0 : 4) + (!s.gzhead.name ? 0 : 8) + (!s.gzhead.comment ? 0 : 16)
        );
        put_byte(s, s.gzhead.time & 255);
        put_byte(s, s.gzhead.time >> 8 & 255);
        put_byte(s, s.gzhead.time >> 16 & 255);
        put_byte(s, s.gzhead.time >> 24 & 255);
        put_byte(s, s.level === 9 ? 2 : s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ? 4 : 0);
        put_byte(s, s.gzhead.os & 255);
        if (s.gzhead.extra && s.gzhead.extra.length) {
          put_byte(s, s.gzhead.extra.length & 255);
          put_byte(s, s.gzhead.extra.length >> 8 & 255);
        }
        if (s.gzhead.hcrc) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending, 0);
        }
        s.gzindex = 0;
        s.status = EXTRA_STATE;
      }
    }
    if (s.status === EXTRA_STATE) {
      if (s.gzhead.extra) {
        let beg = s.pending;
        let left = (s.gzhead.extra.length & 65535) - s.gzindex;
        while (s.pending + left > s.pending_buf_size) {
          let copy = s.pending_buf_size - s.pending;
          s.pending_buf.set(s.gzhead.extra.subarray(s.gzindex, s.gzindex + copy), s.pending);
          s.pending = s.pending_buf_size;
          if (s.gzhead.hcrc && s.pending > beg) {
            strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
          }
          s.gzindex += copy;
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
          beg = 0;
          left -= copy;
        }
        let gzhead_extra = new Uint8Array(s.gzhead.extra);
        s.pending_buf.set(gzhead_extra.subarray(s.gzindex, s.gzindex + left), s.pending);
        s.pending += left;
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        s.gzindex = 0;
      }
      s.status = NAME_STATE;
    }
    if (s.status === NAME_STATE) {
      if (s.gzhead.name) {
        let beg = s.pending;
        let val;
        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return Z_OK$3;
            }
            beg = 0;
          }
          if (s.gzindex < s.gzhead.name.length) {
            val = s.gzhead.name.charCodeAt(s.gzindex++) & 255;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
        s.gzindex = 0;
      }
      s.status = COMMENT_STATE;
    }
    if (s.status === COMMENT_STATE) {
      if (s.gzhead.comment) {
        let beg = s.pending;
        let val;
        do {
          if (s.pending === s.pending_buf_size) {
            if (s.gzhead.hcrc && s.pending > beg) {
              strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
            }
            flush_pending(strm);
            if (s.pending !== 0) {
              s.last_flush = -1;
              return Z_OK$3;
            }
            beg = 0;
          }
          if (s.gzindex < s.gzhead.comment.length) {
            val = s.gzhead.comment.charCodeAt(s.gzindex++) & 255;
          } else {
            val = 0;
          }
          put_byte(s, val);
        } while (val !== 0);
        if (s.gzhead.hcrc && s.pending > beg) {
          strm.adler = crc32_1(strm.adler, s.pending_buf, s.pending - beg, beg);
        }
      }
      s.status = HCRC_STATE;
    }
    if (s.status === HCRC_STATE) {
      if (s.gzhead.hcrc) {
        if (s.pending + 2 > s.pending_buf_size) {
          flush_pending(strm);
          if (s.pending !== 0) {
            s.last_flush = -1;
            return Z_OK$3;
          }
        }
        put_byte(s, strm.adler & 255);
        put_byte(s, strm.adler >> 8 & 255);
        strm.adler = 0;
      }
      s.status = BUSY_STATE;
      flush_pending(strm);
      if (s.pending !== 0) {
        s.last_flush = -1;
        return Z_OK$3;
      }
    }
    if (strm.avail_in !== 0 || s.lookahead !== 0 || flush !== Z_NO_FLUSH$2 && s.status !== FINISH_STATE) {
      let bstate = s.level === 0 ? deflate_stored(s, flush) : s.strategy === Z_HUFFMAN_ONLY ? deflate_huff(s, flush) : s.strategy === Z_RLE ? deflate_rle(s, flush) : configuration_table[s.level].func(s, flush);
      if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
        s.status = FINISH_STATE;
      }
      if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
        if (strm.avail_out === 0) {
          s.last_flush = -1;
        }
        return Z_OK$3;
      }
      if (bstate === BS_BLOCK_DONE) {
        if (flush === Z_PARTIAL_FLUSH) {
          _tr_align(s);
        } else if (flush !== Z_BLOCK$1) {
          _tr_stored_block(s, 0, 0, false);
          if (flush === Z_FULL_FLUSH$1) {
            zero(s.head);
            if (s.lookahead === 0) {
              s.strstart = 0;
              s.block_start = 0;
              s.insert = 0;
            }
          }
        }
        flush_pending(strm);
        if (strm.avail_out === 0) {
          s.last_flush = -1;
          return Z_OK$3;
        }
      }
    }
    if (flush !== Z_FINISH$3) {
      return Z_OK$3;
    }
    if (s.wrap <= 0) {
      return Z_STREAM_END$3;
    }
    if (s.wrap === 2) {
      put_byte(s, strm.adler & 255);
      put_byte(s, strm.adler >> 8 & 255);
      put_byte(s, strm.adler >> 16 & 255);
      put_byte(s, strm.adler >> 24 & 255);
      put_byte(s, strm.total_in & 255);
      put_byte(s, strm.total_in >> 8 & 255);
      put_byte(s, strm.total_in >> 16 & 255);
      put_byte(s, strm.total_in >> 24 & 255);
    } else {
      putShortMSB(s, strm.adler >>> 16);
      putShortMSB(s, strm.adler & 65535);
    }
    flush_pending(strm);
    if (s.wrap > 0) {
      s.wrap = -s.wrap;
    }
    return s.pending !== 0 ? Z_OK$3 : Z_STREAM_END$3;
  }, "deflate$2");
  var deflateEnd = /* @__PURE__ */ __name((strm) => {
    if (deflateStateCheck(strm)) {
      return Z_STREAM_ERROR$2;
    }
    const status = strm.state.status;
    strm.state = null;
    return status === BUSY_STATE ? err(strm, Z_DATA_ERROR$2) : Z_OK$3;
  }, "deflateEnd");
  var deflateSetDictionary = /* @__PURE__ */ __name((strm, dictionary) => {
    let dictLength = dictionary.length;
    if (deflateStateCheck(strm)) {
      return Z_STREAM_ERROR$2;
    }
    const s = strm.state;
    const wrap = s.wrap;
    if (wrap === 2 || wrap === 1 && s.status !== INIT_STATE || s.lookahead) {
      return Z_STREAM_ERROR$2;
    }
    if (wrap === 1) {
      strm.adler = adler32_1(strm.adler, dictionary, dictLength, 0);
    }
    s.wrap = 0;
    if (dictLength >= s.w_size) {
      if (wrap === 0) {
        zero(s.head);
        s.strstart = 0;
        s.block_start = 0;
        s.insert = 0;
      }
      let tmpDict = new Uint8Array(s.w_size);
      tmpDict.set(dictionary.subarray(dictLength - s.w_size, dictLength), 0);
      dictionary = tmpDict;
      dictLength = s.w_size;
    }
    const avail = strm.avail_in;
    const next = strm.next_in;
    const input = strm.input;
    strm.avail_in = dictLength;
    strm.next_in = 0;
    strm.input = dictionary;
    fill_window(s);
    while (s.lookahead >= MIN_MATCH) {
      let str = s.strstart;
      let n = s.lookahead - (MIN_MATCH - 1);
      do {
        s.ins_h = HASH(s, s.ins_h, s.window[str + MIN_MATCH - 1]);
        s.prev[str & s.w_mask] = s.head[s.ins_h];
        s.head[s.ins_h] = str;
        str++;
      } while (--n);
      s.strstart = str;
      s.lookahead = MIN_MATCH - 1;
      fill_window(s);
    }
    s.strstart += s.lookahead;
    s.block_start = s.strstart;
    s.insert = s.lookahead;
    s.lookahead = 0;
    s.match_length = s.prev_length = MIN_MATCH - 1;
    s.match_available = 0;
    strm.next_in = next;
    strm.input = input;
    strm.avail_in = avail;
    s.wrap = wrap;
    return Z_OK$3;
  }, "deflateSetDictionary");
  var deflateInit_1 = deflateInit;
  var deflateInit2_1 = deflateInit2;
  var deflateReset_1 = deflateReset;
  var deflateResetKeep_1 = deflateResetKeep;
  var deflateSetHeader_1 = deflateSetHeader;
  var deflate_2$1 = deflate$2;
  var deflateEnd_1 = deflateEnd;
  var deflateSetDictionary_1 = deflateSetDictionary;
  var deflateInfo = "pako deflate (from Nodeca project)";
  var deflate_1$2 = {
    deflateInit: deflateInit_1,
    deflateInit2: deflateInit2_1,
    deflateReset: deflateReset_1,
    deflateResetKeep: deflateResetKeep_1,
    deflateSetHeader: deflateSetHeader_1,
    deflate: deflate_2$1,
    deflateEnd: deflateEnd_1,
    deflateSetDictionary: deflateSetDictionary_1,
    deflateInfo
  };
  var _has = /* @__PURE__ */ __name((obj, key) => {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }, "_has");
  var assign = /* @__PURE__ */ __name(function(obj) {
    const sources = Array.prototype.slice.call(arguments, 1);
    while (sources.length) {
      const source = sources.shift();
      if (!source) {
        continue;
      }
      if (typeof source !== "object") {
        throw new TypeError(source + "must be non-object");
      }
      for (const p in source) {
        if (_has(source, p)) {
          obj[p] = source[p];
        }
      }
    }
    return obj;
  }, "assign");
  var flattenChunks = /* @__PURE__ */ __name((chunks) => {
    let len = 0;
    for (let i = 0, l = chunks.length; i < l; i++) {
      len += chunks[i].length;
    }
    const result = new Uint8Array(len);
    for (let i = 0, pos = 0, l = chunks.length; i < l; i++) {
      let chunk = chunks[i];
      result.set(chunk, pos);
      pos += chunk.length;
    }
    return result;
  }, "flattenChunks");
  var common = {
    assign,
    flattenChunks
  };
  var STR_APPLY_UIA_OK = true;
  try {
    String.fromCharCode.apply(null, new Uint8Array(1));
  } catch (__) {
    STR_APPLY_UIA_OK = false;
  }
  var _utf8len = new Uint8Array(256);
  for (let q = 0; q < 256; q++) {
    _utf8len[q] = q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1;
  }
  _utf8len[254] = _utf8len[254] = 1;
  var string2buf = /* @__PURE__ */ __name((str) => {
    if (typeof TextEncoder === "function" && TextEncoder.prototype.encode) {
      return new TextEncoder().encode(str);
    }
    let buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
    for (m_pos = 0; m_pos < str_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 64512) === 56320) {
          c = 65536 + (c - 55296 << 10) + (c2 - 56320);
          m_pos++;
        }
      }
      buf_len += c < 128 ? 1 : c < 2048 ? 2 : c < 65536 ? 3 : 4;
    }
    buf = new Uint8Array(buf_len);
    for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
      c = str.charCodeAt(m_pos);
      if ((c & 64512) === 55296 && m_pos + 1 < str_len) {
        c2 = str.charCodeAt(m_pos + 1);
        if ((c2 & 64512) === 56320) {
          c = 65536 + (c - 55296 << 10) + (c2 - 56320);
          m_pos++;
        }
      }
      if (c < 128) {
        buf[i++] = c;
      } else if (c < 2048) {
        buf[i++] = 192 | c >>> 6;
        buf[i++] = 128 | c & 63;
      } else if (c < 65536) {
        buf[i++] = 224 | c >>> 12;
        buf[i++] = 128 | c >>> 6 & 63;
        buf[i++] = 128 | c & 63;
      } else {
        buf[i++] = 240 | c >>> 18;
        buf[i++] = 128 | c >>> 12 & 63;
        buf[i++] = 128 | c >>> 6 & 63;
        buf[i++] = 128 | c & 63;
      }
    }
    return buf;
  }, "string2buf");
  var buf2binstring = /* @__PURE__ */ __name((buf, len) => {
    if (len < 65534) {
      if (buf.subarray && STR_APPLY_UIA_OK) {
        return String.fromCharCode.apply(null, buf.length === len ? buf : buf.subarray(0, len));
      }
    }
    let result = "";
    for (let i = 0; i < len; i++) {
      result += String.fromCharCode(buf[i]);
    }
    return result;
  }, "buf2binstring");
  var buf2string = /* @__PURE__ */ __name((buf, max) => {
    const len = max || buf.length;
    if (typeof TextDecoder === "function" && TextDecoder.prototype.decode) {
      return new TextDecoder().decode(buf.subarray(0, max));
    }
    let i, out;
    const utf16buf = new Array(len * 2);
    for (out = 0, i = 0; i < len; ) {
      let c = buf[i++];
      if (c < 128) {
        utf16buf[out++] = c;
        continue;
      }
      let c_len = _utf8len[c];
      if (c_len > 4) {
        utf16buf[out++] = 65533;
        i += c_len - 1;
        continue;
      }
      c &= c_len === 2 ? 31 : c_len === 3 ? 15 : 7;
      while (c_len > 1 && i < len) {
        c = c << 6 | buf[i++] & 63;
        c_len--;
      }
      if (c_len > 1) {
        utf16buf[out++] = 65533;
        continue;
      }
      if (c < 65536) {
        utf16buf[out++] = c;
      } else {
        c -= 65536;
        utf16buf[out++] = 55296 | c >> 10 & 1023;
        utf16buf[out++] = 56320 | c & 1023;
      }
    }
    return buf2binstring(utf16buf, out);
  }, "buf2string");
  var utf8border = /* @__PURE__ */ __name((buf, max) => {
    max = max || buf.length;
    if (max > buf.length) {
      max = buf.length;
    }
    let pos = max - 1;
    while (pos >= 0 && (buf[pos] & 192) === 128) {
      pos--;
    }
    if (pos < 0) {
      return max;
    }
    if (pos === 0) {
      return max;
    }
    return pos + _utf8len[buf[pos]] > max ? pos : max;
  }, "utf8border");
  var strings = {
    string2buf,
    buf2string,
    utf8border
  };
  function ZStream() {
    this.input = null;
    this.next_in = 0;
    this.avail_in = 0;
    this.total_in = 0;
    this.output = null;
    this.next_out = 0;
    this.avail_out = 0;
    this.total_out = 0;
    this.msg = "";
    this.state = null;
    this.data_type = 2;
    this.adler = 0;
  }
  __name(ZStream, "ZStream");
  var zstream = ZStream;
  var toString$1 = Object.prototype.toString;
  var {
    Z_NO_FLUSH: Z_NO_FLUSH$1,
    Z_SYNC_FLUSH,
    Z_FULL_FLUSH,
    Z_FINISH: Z_FINISH$2,
    Z_OK: Z_OK$2,
    Z_STREAM_END: Z_STREAM_END$2,
    Z_DEFAULT_COMPRESSION,
    Z_DEFAULT_STRATEGY,
    Z_DEFLATED: Z_DEFLATED$1
  } = constants$2;
  function Deflate$1(options) {
    this.options = common.assign({
      level: Z_DEFAULT_COMPRESSION,
      method: Z_DEFLATED$1,
      chunkSize: 16384,
      windowBits: 15,
      memLevel: 8,
      strategy: Z_DEFAULT_STRATEGY
    }, options || {});
    let opt = this.options;
    if (opt.raw && opt.windowBits > 0) {
      opt.windowBits = -opt.windowBits;
    } else if (opt.gzip && opt.windowBits > 0 && opt.windowBits < 16) {
      opt.windowBits += 16;
    }
    this.err = 0;
    this.msg = "";
    this.ended = false;
    this.chunks = [];
    this.strm = new zstream();
    this.strm.avail_out = 0;
    let status = deflate_1$2.deflateInit2(
      this.strm,
      opt.level,
      opt.method,
      opt.windowBits,
      opt.memLevel,
      opt.strategy
    );
    if (status !== Z_OK$2) {
      throw new Error(messages[status]);
    }
    if (opt.header) {
      deflate_1$2.deflateSetHeader(this.strm, opt.header);
    }
    if (opt.dictionary) {
      let dict;
      if (typeof opt.dictionary === "string") {
        dict = strings.string2buf(opt.dictionary);
      } else if (toString$1.call(opt.dictionary) === "[object ArrayBuffer]") {
        dict = new Uint8Array(opt.dictionary);
      } else {
        dict = opt.dictionary;
      }
      status = deflate_1$2.deflateSetDictionary(this.strm, dict);
      if (status !== Z_OK$2) {
        throw new Error(messages[status]);
      }
      this._dict_set = true;
    }
  }
  __name(Deflate$1, "Deflate$1");
  Deflate$1.prototype.push = function(data, flush_mode) {
    const strm = this.strm;
    const chunkSize = this.options.chunkSize;
    let status, _flush_mode;
    if (this.ended) {
      return false;
    }
    if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
    else _flush_mode = flush_mode === true ? Z_FINISH$2 : Z_NO_FLUSH$1;
    if (typeof data === "string") {
      strm.input = strings.string2buf(data);
    } else if (toString$1.call(data) === "[object ArrayBuffer]") {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    for (; ; ) {
      if (strm.avail_out === 0) {
        strm.output = new Uint8Array(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }
      if ((_flush_mode === Z_SYNC_FLUSH || _flush_mode === Z_FULL_FLUSH) && strm.avail_out <= 6) {
        this.onData(strm.output.subarray(0, strm.next_out));
        strm.avail_out = 0;
        continue;
      }
      status = deflate_1$2.deflate(strm, _flush_mode);
      if (status === Z_STREAM_END$2) {
        if (strm.next_out > 0) {
          this.onData(strm.output.subarray(0, strm.next_out));
        }
        status = deflate_1$2.deflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return status === Z_OK$2;
      }
      if (strm.avail_out === 0) {
        this.onData(strm.output);
        continue;
      }
      if (_flush_mode > 0 && strm.next_out > 0) {
        this.onData(strm.output.subarray(0, strm.next_out));
        strm.avail_out = 0;
        continue;
      }
      if (strm.avail_in === 0) break;
    }
    return true;
  };
  Deflate$1.prototype.onData = function(chunk) {
    this.chunks.push(chunk);
  };
  Deflate$1.prototype.onEnd = function(status) {
    if (status === Z_OK$2) {
      this.result = common.flattenChunks(this.chunks);
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };
  function deflate$1(input, options) {
    const deflator = new Deflate$1(options);
    deflator.push(input, true);
    if (deflator.err) {
      throw deflator.msg || messages[deflator.err];
    }
    return deflator.result;
  }
  __name(deflate$1, "deflate$1");
  function deflateRaw$1(input, options) {
    options = options || {};
    options.raw = true;
    return deflate$1(input, options);
  }
  __name(deflateRaw$1, "deflateRaw$1");
  function gzip$1(input, options) {
    options = options || {};
    options.gzip = true;
    return deflate$1(input, options);
  }
  __name(gzip$1, "gzip$1");
  var Deflate_1$1 = Deflate$1;
  var deflate_2 = deflate$1;
  var deflateRaw_1$1 = deflateRaw$1;
  var gzip_1$1 = gzip$1;
  var constants$1 = constants$2;
  var deflate_1$1 = {
    Deflate: Deflate_1$1,
    deflate: deflate_2,
    deflateRaw: deflateRaw_1$1,
    gzip: gzip_1$1,
    constants: constants$1
  };
  var BAD$1 = 16209;
  var TYPE$1 = 16191;
  var inffast = /* @__PURE__ */ __name(function inflate_fast(strm, start) {
    let _in;
    let last;
    let _out;
    let beg;
    let end;
    let dmax;
    let wsize;
    let whave;
    let wnext;
    let s_window;
    let hold;
    let bits;
    let lcode;
    let dcode;
    let lmask;
    let dmask;
    let here;
    let op;
    let len;
    let dist;
    let from;
    let from_source;
    let input, output;
    const state = strm.state;
    _in = strm.next_in;
    input = strm.input;
    last = _in + (strm.avail_in - 5);
    _out = strm.next_out;
    output = strm.output;
    beg = _out - (start - strm.avail_out);
    end = _out + (strm.avail_out - 257);
    dmax = state.dmax;
    wsize = state.wsize;
    whave = state.whave;
    wnext = state.wnext;
    s_window = state.window;
    hold = state.hold;
    bits = state.bits;
    lcode = state.lencode;
    dcode = state.distcode;
    lmask = (1 << state.lenbits) - 1;
    dmask = (1 << state.distbits) - 1;
    top:
      do {
        if (bits < 15) {
          hold += input[_in++] << bits;
          bits += 8;
          hold += input[_in++] << bits;
          bits += 8;
        }
        here = lcode[hold & lmask];
        dolen:
          for (; ; ) {
            op = here >>> 24;
            hold >>>= op;
            bits -= op;
            op = here >>> 16 & 255;
            if (op === 0) {
              output[_out++] = here & 65535;
            } else if (op & 16) {
              len = here & 65535;
              op &= 15;
              if (op) {
                if (bits < op) {
                  hold += input[_in++] << bits;
                  bits += 8;
                }
                len += hold & (1 << op) - 1;
                hold >>>= op;
                bits -= op;
              }
              if (bits < 15) {
                hold += input[_in++] << bits;
                bits += 8;
                hold += input[_in++] << bits;
                bits += 8;
              }
              here = dcode[hold & dmask];
              dodist:
                for (; ; ) {
                  op = here >>> 24;
                  hold >>>= op;
                  bits -= op;
                  op = here >>> 16 & 255;
                  if (op & 16) {
                    dist = here & 65535;
                    op &= 15;
                    if (bits < op) {
                      hold += input[_in++] << bits;
                      bits += 8;
                      if (bits < op) {
                        hold += input[_in++] << bits;
                        bits += 8;
                      }
                    }
                    dist += hold & (1 << op) - 1;
                    if (dist > dmax) {
                      strm.msg = "invalid distance too far back";
                      state.mode = BAD$1;
                      break top;
                    }
                    hold >>>= op;
                    bits -= op;
                    op = _out - beg;
                    if (dist > op) {
                      op = dist - op;
                      if (op > whave) {
                        if (state.sane) {
                          strm.msg = "invalid distance too far back";
                          state.mode = BAD$1;
                          break top;
                        }
                      }
                      from = 0;
                      from_source = s_window;
                      if (wnext === 0) {
                        from += wsize - op;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output;
                        }
                      } else if (wnext < op) {
                        from += wsize + wnext - op;
                        op -= wnext;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = 0;
                          if (wnext < len) {
                            op = wnext;
                            len -= op;
                            do {
                              output[_out++] = s_window[from++];
                            } while (--op);
                            from = _out - dist;
                            from_source = output;
                          }
                        }
                      } else {
                        from += wnext - op;
                        if (op < len) {
                          len -= op;
                          do {
                            output[_out++] = s_window[from++];
                          } while (--op);
                          from = _out - dist;
                          from_source = output;
                        }
                      }
                      while (len > 2) {
                        output[_out++] = from_source[from++];
                        output[_out++] = from_source[from++];
                        output[_out++] = from_source[from++];
                        len -= 3;
                      }
                      if (len) {
                        output[_out++] = from_source[from++];
                        if (len > 1) {
                          output[_out++] = from_source[from++];
                        }
                      }
                    } else {
                      from = _out - dist;
                      do {
                        output[_out++] = output[from++];
                        output[_out++] = output[from++];
                        output[_out++] = output[from++];
                        len -= 3;
                      } while (len > 2);
                      if (len) {
                        output[_out++] = output[from++];
                        if (len > 1) {
                          output[_out++] = output[from++];
                        }
                      }
                    }
                  } else if ((op & 64) === 0) {
                    here = dcode[(here & 65535) + (hold & (1 << op) - 1)];
                    continue dodist;
                  } else {
                    strm.msg = "invalid distance code";
                    state.mode = BAD$1;
                    break top;
                  }
                  break;
                }
            } else if ((op & 64) === 0) {
              here = lcode[(here & 65535) + (hold & (1 << op) - 1)];
              continue dolen;
            } else if (op & 32) {
              state.mode = TYPE$1;
              break top;
            } else {
              strm.msg = "invalid literal/length code";
              state.mode = BAD$1;
              break top;
            }
            break;
          }
      } while (_in < last && _out < end);
    len = bits >> 3;
    _in -= len;
    bits -= len << 3;
    hold &= (1 << bits) - 1;
    strm.next_in = _in;
    strm.next_out = _out;
    strm.avail_in = _in < last ? 5 + (last - _in) : 5 - (_in - last);
    strm.avail_out = _out < end ? 257 + (end - _out) : 257 - (_out - end);
    state.hold = hold;
    state.bits = bits;
    return;
  }, "inflate_fast");
  var MAXBITS = 15;
  var ENOUGH_LENS$1 = 852;
  var ENOUGH_DISTS$1 = 592;
  var CODES$1 = 0;
  var LENS$1 = 1;
  var DISTS$1 = 2;
  var lbase = new Uint16Array([
    /* Length codes 257..285 base */
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    13,
    15,
    17,
    19,
    23,
    27,
    31,
    35,
    43,
    51,
    59,
    67,
    83,
    99,
    115,
    131,
    163,
    195,
    227,
    258,
    0,
    0
  ]);
  var lext = new Uint8Array([
    /* Length codes 257..285 extra */
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    16,
    72,
    78
  ]);
  var dbase = new Uint16Array([
    /* Distance codes 0..29 base */
    1,
    2,
    3,
    4,
    5,
    7,
    9,
    13,
    17,
    25,
    33,
    49,
    65,
    97,
    129,
    193,
    257,
    385,
    513,
    769,
    1025,
    1537,
    2049,
    3073,
    4097,
    6145,
    8193,
    12289,
    16385,
    24577,
    0,
    0
  ]);
  var dext = new Uint8Array([
    /* Distance codes 0..29 extra */
    16,
    16,
    16,
    16,
    17,
    17,
    18,
    18,
    19,
    19,
    20,
    20,
    21,
    21,
    22,
    22,
    23,
    23,
    24,
    24,
    25,
    25,
    26,
    26,
    27,
    27,
    28,
    28,
    29,
    29,
    64,
    64
  ]);
  var inflate_table = /* @__PURE__ */ __name((type, lens, lens_index, codes, table, table_index, work, opts) => {
    const bits = opts.bits;
    let len = 0;
    let sym = 0;
    let min = 0, max = 0;
    let root = 0;
    let curr = 0;
    let drop = 0;
    let left = 0;
    let used = 0;
    let huff = 0;
    let incr;
    let fill;
    let low;
    let mask;
    let next;
    let base2 = null;
    let match;
    const count = new Uint16Array(MAXBITS + 1);
    const offs = new Uint16Array(MAXBITS + 1);
    let extra = null;
    let here_bits, here_op, here_val;
    for (len = 0; len <= MAXBITS; len++) {
      count[len] = 0;
    }
    for (sym = 0; sym < codes; sym++) {
      count[lens[lens_index + sym]]++;
    }
    root = bits;
    for (max = MAXBITS; max >= 1; max--) {
      if (count[max] !== 0) {
        break;
      }
    }
    if (root > max) {
      root = max;
    }
    if (max === 0) {
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      table[table_index++] = 1 << 24 | 64 << 16 | 0;
      opts.bits = 1;
      return 0;
    }
    for (min = 1; min < max; min++) {
      if (count[min] !== 0) {
        break;
      }
    }
    if (root < min) {
      root = min;
    }
    left = 1;
    for (len = 1; len <= MAXBITS; len++) {
      left <<= 1;
      left -= count[len];
      if (left < 0) {
        return -1;
      }
    }
    if (left > 0 && (type === CODES$1 || max !== 1)) {
      return -1;
    }
    offs[1] = 0;
    for (len = 1; len < MAXBITS; len++) {
      offs[len + 1] = offs[len] + count[len];
    }
    for (sym = 0; sym < codes; sym++) {
      if (lens[lens_index + sym] !== 0) {
        work[offs[lens[lens_index + sym]]++] = sym;
      }
    }
    if (type === CODES$1) {
      base2 = extra = work;
      match = 20;
    } else if (type === LENS$1) {
      base2 = lbase;
      extra = lext;
      match = 257;
    } else {
      base2 = dbase;
      extra = dext;
      match = 0;
    }
    huff = 0;
    sym = 0;
    len = min;
    next = table_index;
    curr = root;
    drop = 0;
    low = -1;
    used = 1 << root;
    mask = used - 1;
    if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
      return 1;
    }
    for (; ; ) {
      here_bits = len - drop;
      if (work[sym] + 1 < match) {
        here_op = 0;
        here_val = work[sym];
      } else if (work[sym] >= match) {
        here_op = extra[work[sym] - match];
        here_val = base2[work[sym] - match];
      } else {
        here_op = 32 + 64;
        here_val = 0;
      }
      incr = 1 << len - drop;
      fill = 1 << curr;
      min = fill;
      do {
        fill -= incr;
        table[next + (huff >> drop) + fill] = here_bits << 24 | here_op << 16 | here_val | 0;
      } while (fill !== 0);
      incr = 1 << len - 1;
      while (huff & incr) {
        incr >>= 1;
      }
      if (incr !== 0) {
        huff &= incr - 1;
        huff += incr;
      } else {
        huff = 0;
      }
      sym++;
      if (--count[len] === 0) {
        if (len === max) {
          break;
        }
        len = lens[lens_index + work[sym]];
      }
      if (len > root && (huff & mask) !== low) {
        if (drop === 0) {
          drop = root;
        }
        next += min;
        curr = len - drop;
        left = 1 << curr;
        while (curr + drop < max) {
          left -= count[curr + drop];
          if (left <= 0) {
            break;
          }
          curr++;
          left <<= 1;
        }
        used += 1 << curr;
        if (type === LENS$1 && used > ENOUGH_LENS$1 || type === DISTS$1 && used > ENOUGH_DISTS$1) {
          return 1;
        }
        low = huff & mask;
        table[low] = root << 24 | curr << 16 | next - table_index | 0;
      }
    }
    if (huff !== 0) {
      table[next + huff] = len - drop << 24 | 64 << 16 | 0;
    }
    opts.bits = root;
    return 0;
  }, "inflate_table");
  var inftrees = inflate_table;
  var CODES = 0;
  var LENS = 1;
  var DISTS = 2;
  var {
    Z_FINISH: Z_FINISH$1,
    Z_BLOCK,
    Z_TREES,
    Z_OK: Z_OK$1,
    Z_STREAM_END: Z_STREAM_END$1,
    Z_NEED_DICT: Z_NEED_DICT$1,
    Z_STREAM_ERROR: Z_STREAM_ERROR$1,
    Z_DATA_ERROR: Z_DATA_ERROR$1,
    Z_MEM_ERROR: Z_MEM_ERROR$1,
    Z_BUF_ERROR,
    Z_DEFLATED
  } = constants$2;
  var HEAD = 16180;
  var FLAGS = 16181;
  var TIME = 16182;
  var OS = 16183;
  var EXLEN = 16184;
  var EXTRA = 16185;
  var NAME = 16186;
  var COMMENT = 16187;
  var HCRC = 16188;
  var DICTID = 16189;
  var DICT = 16190;
  var TYPE = 16191;
  var TYPEDO = 16192;
  var STORED = 16193;
  var COPY_ = 16194;
  var COPY = 16195;
  var TABLE = 16196;
  var LENLENS = 16197;
  var CODELENS = 16198;
  var LEN_ = 16199;
  var LEN = 16200;
  var LENEXT = 16201;
  var DIST = 16202;
  var DISTEXT = 16203;
  var MATCH = 16204;
  var LIT = 16205;
  var CHECK = 16206;
  var LENGTH = 16207;
  var DONE = 16208;
  var BAD = 16209;
  var MEM = 16210;
  var SYNC = 16211;
  var ENOUGH_LENS = 852;
  var ENOUGH_DISTS = 592;
  var MAX_WBITS = 15;
  var DEF_WBITS = MAX_WBITS;
  var zswap32 = /* @__PURE__ */ __name((q) => {
    return (q >>> 24 & 255) + (q >>> 8 & 65280) + ((q & 65280) << 8) + ((q & 255) << 24);
  }, "zswap32");
  function InflateState() {
    this.strm = null;
    this.mode = 0;
    this.last = false;
    this.wrap = 0;
    this.havedict = false;
    this.flags = 0;
    this.dmax = 0;
    this.check = 0;
    this.total = 0;
    this.head = null;
    this.wbits = 0;
    this.wsize = 0;
    this.whave = 0;
    this.wnext = 0;
    this.window = null;
    this.hold = 0;
    this.bits = 0;
    this.length = 0;
    this.offset = 0;
    this.extra = 0;
    this.lencode = null;
    this.distcode = null;
    this.lenbits = 0;
    this.distbits = 0;
    this.ncode = 0;
    this.nlen = 0;
    this.ndist = 0;
    this.have = 0;
    this.next = null;
    this.lens = new Uint16Array(320);
    this.work = new Uint16Array(288);
    this.lendyn = null;
    this.distdyn = null;
    this.sane = 0;
    this.back = 0;
    this.was = 0;
  }
  __name(InflateState, "InflateState");
  var inflateStateCheck = /* @__PURE__ */ __name((strm) => {
    if (!strm) {
      return 1;
    }
    const state = strm.state;
    if (!state || state.strm !== strm || state.mode < HEAD || state.mode > SYNC) {
      return 1;
    }
    return 0;
  }, "inflateStateCheck");
  var inflateResetKeep = /* @__PURE__ */ __name((strm) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    strm.total_in = strm.total_out = state.total = 0;
    strm.msg = "";
    if (state.wrap) {
      strm.adler = state.wrap & 1;
    }
    state.mode = HEAD;
    state.last = 0;
    state.havedict = 0;
    state.flags = -1;
    state.dmax = 32768;
    state.head = null;
    state.hold = 0;
    state.bits = 0;
    state.lencode = state.lendyn = new Int32Array(ENOUGH_LENS);
    state.distcode = state.distdyn = new Int32Array(ENOUGH_DISTS);
    state.sane = 1;
    state.back = -1;
    return Z_OK$1;
  }, "inflateResetKeep");
  var inflateReset = /* @__PURE__ */ __name((strm) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    state.wsize = 0;
    state.whave = 0;
    state.wnext = 0;
    return inflateResetKeep(strm);
  }, "inflateReset");
  var inflateReset2 = /* @__PURE__ */ __name((strm, windowBits) => {
    let wrap;
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    if (windowBits < 0) {
      wrap = 0;
      windowBits = -windowBits;
    } else {
      wrap = (windowBits >> 4) + 5;
      if (windowBits < 48) {
        windowBits &= 15;
      }
    }
    if (windowBits && (windowBits < 8 || windowBits > 15)) {
      return Z_STREAM_ERROR$1;
    }
    if (state.window !== null && state.wbits !== windowBits) {
      state.window = null;
    }
    state.wrap = wrap;
    state.wbits = windowBits;
    return inflateReset(strm);
  }, "inflateReset2");
  var inflateInit2 = /* @__PURE__ */ __name((strm, windowBits) => {
    if (!strm) {
      return Z_STREAM_ERROR$1;
    }
    const state = new InflateState();
    strm.state = state;
    state.strm = strm;
    state.window = null;
    state.mode = HEAD;
    const ret = inflateReset2(strm, windowBits);
    if (ret !== Z_OK$1) {
      strm.state = null;
    }
    return ret;
  }, "inflateInit2");
  var inflateInit = /* @__PURE__ */ __name((strm) => {
    return inflateInit2(strm, DEF_WBITS);
  }, "inflateInit");
  var virgin = true;
  var lenfix;
  var distfix;
  var fixedtables = /* @__PURE__ */ __name((state) => {
    if (virgin) {
      lenfix = new Int32Array(512);
      distfix = new Int32Array(32);
      let sym = 0;
      while (sym < 144) {
        state.lens[sym++] = 8;
      }
      while (sym < 256) {
        state.lens[sym++] = 9;
      }
      while (sym < 280) {
        state.lens[sym++] = 7;
      }
      while (sym < 288) {
        state.lens[sym++] = 8;
      }
      inftrees(LENS, state.lens, 0, 288, lenfix, 0, state.work, { bits: 9 });
      sym = 0;
      while (sym < 32) {
        state.lens[sym++] = 5;
      }
      inftrees(DISTS, state.lens, 0, 32, distfix, 0, state.work, { bits: 5 });
      virgin = false;
    }
    state.lencode = lenfix;
    state.lenbits = 9;
    state.distcode = distfix;
    state.distbits = 5;
  }, "fixedtables");
  var updatewindow = /* @__PURE__ */ __name((strm, src, end, copy) => {
    let dist;
    const state = strm.state;
    if (state.window === null) {
      state.wsize = 1 << state.wbits;
      state.wnext = 0;
      state.whave = 0;
      state.window = new Uint8Array(state.wsize);
    }
    if (copy >= state.wsize) {
      state.window.set(src.subarray(end - state.wsize, end), 0);
      state.wnext = 0;
      state.whave = state.wsize;
    } else {
      dist = state.wsize - state.wnext;
      if (dist > copy) {
        dist = copy;
      }
      state.window.set(src.subarray(end - copy, end - copy + dist), state.wnext);
      copy -= dist;
      if (copy) {
        state.window.set(src.subarray(end - copy, end), 0);
        state.wnext = copy;
        state.whave = state.wsize;
      } else {
        state.wnext += dist;
        if (state.wnext === state.wsize) {
          state.wnext = 0;
        }
        if (state.whave < state.wsize) {
          state.whave += dist;
        }
      }
    }
    return 0;
  }, "updatewindow");
  var inflate$2 = /* @__PURE__ */ __name((strm, flush) => {
    let state;
    let input, output;
    let next;
    let put;
    let have, left;
    let hold;
    let bits;
    let _in, _out;
    let copy;
    let from;
    let from_source;
    let here = 0;
    let here_bits, here_op, here_val;
    let last_bits, last_op, last_val;
    let len;
    let ret;
    const hbuf = new Uint8Array(4);
    let opts;
    let n;
    const order = (
      /* permutation of code lengths */
      new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
    );
    if (inflateStateCheck(strm) || !strm.output || !strm.input && strm.avail_in !== 0) {
      return Z_STREAM_ERROR$1;
    }
    state = strm.state;
    if (state.mode === TYPE) {
      state.mode = TYPEDO;
    }
    put = strm.next_out;
    output = strm.output;
    left = strm.avail_out;
    next = strm.next_in;
    input = strm.input;
    have = strm.avail_in;
    hold = state.hold;
    bits = state.bits;
    _in = have;
    _out = left;
    ret = Z_OK$1;
    inf_leave:
      for (; ; ) {
        switch (state.mode) {
          case HEAD:
            if (state.wrap === 0) {
              state.mode = TYPEDO;
              break;
            }
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.wrap & 2 && hold === 35615) {
              if (state.wbits === 0) {
                state.wbits = 15;
              }
              state.check = 0;
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32_1(state.check, hbuf, 2, 0);
              hold = 0;
              bits = 0;
              state.mode = FLAGS;
              break;
            }
            if (state.head) {
              state.head.done = false;
            }
            if (!(state.wrap & 1) || /* check if zlib header allowed */
            (((hold & 255) << 8) + (hold >> 8)) % 31) {
              strm.msg = "incorrect header check";
              state.mode = BAD;
              break;
            }
            if ((hold & 15) !== Z_DEFLATED) {
              strm.msg = "unknown compression method";
              state.mode = BAD;
              break;
            }
            hold >>>= 4;
            bits -= 4;
            len = (hold & 15) + 8;
            if (state.wbits === 0) {
              state.wbits = len;
            }
            if (len > 15 || len > state.wbits) {
              strm.msg = "invalid window size";
              state.mode = BAD;
              break;
            }
            state.dmax = 1 << state.wbits;
            state.flags = 0;
            strm.adler = state.check = 1;
            state.mode = hold & 512 ? DICTID : TYPE;
            hold = 0;
            bits = 0;
            break;
          case FLAGS:
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.flags = hold;
            if ((state.flags & 255) !== Z_DEFLATED) {
              strm.msg = "unknown compression method";
              state.mode = BAD;
              break;
            }
            if (state.flags & 57344) {
              strm.msg = "unknown header flags set";
              state.mode = BAD;
              break;
            }
            if (state.head) {
              state.head.text = hold >> 8 & 1;
            }
            if (state.flags & 512 && state.wrap & 4) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32_1(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = TIME;
          /* falls through */
          case TIME:
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.head) {
              state.head.time = hold;
            }
            if (state.flags & 512 && state.wrap & 4) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              hbuf[2] = hold >>> 16 & 255;
              hbuf[3] = hold >>> 24 & 255;
              state.check = crc32_1(state.check, hbuf, 4, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = OS;
          /* falls through */
          case OS:
            while (bits < 16) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (state.head) {
              state.head.xflags = hold & 255;
              state.head.os = hold >> 8;
            }
            if (state.flags & 512 && state.wrap & 4) {
              hbuf[0] = hold & 255;
              hbuf[1] = hold >>> 8 & 255;
              state.check = crc32_1(state.check, hbuf, 2, 0);
            }
            hold = 0;
            bits = 0;
            state.mode = EXLEN;
          /* falls through */
          case EXLEN:
            if (state.flags & 1024) {
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.length = hold;
              if (state.head) {
                state.head.extra_len = hold;
              }
              if (state.flags & 512 && state.wrap & 4) {
                hbuf[0] = hold & 255;
                hbuf[1] = hold >>> 8 & 255;
                state.check = crc32_1(state.check, hbuf, 2, 0);
              }
              hold = 0;
              bits = 0;
            } else if (state.head) {
              state.head.extra = null;
            }
            state.mode = EXTRA;
          /* falls through */
          case EXTRA:
            if (state.flags & 1024) {
              copy = state.length;
              if (copy > have) {
                copy = have;
              }
              if (copy) {
                if (state.head) {
                  len = state.head.extra_len - state.length;
                  if (!state.head.extra) {
                    state.head.extra = new Uint8Array(state.head.extra_len);
                  }
                  state.head.extra.set(
                    input.subarray(
                      next,
                      // extra field is limited to 65536 bytes
                      // - no need for additional size check
                      next + copy
                    ),
                    /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
                    len
                  );
                }
                if (state.flags & 512 && state.wrap & 4) {
                  state.check = crc32_1(state.check, input, copy, next);
                }
                have -= copy;
                next += copy;
                state.length -= copy;
              }
              if (state.length) {
                break inf_leave;
              }
            }
            state.length = 0;
            state.mode = NAME;
          /* falls through */
          case NAME:
            if (state.flags & 2048) {
              if (have === 0) {
                break inf_leave;
              }
              copy = 0;
              do {
                len = input[next + copy++];
                if (state.head && len && state.length < 65536) {
                  state.head.name += String.fromCharCode(len);
                }
              } while (len && copy < have);
              if (state.flags & 512 && state.wrap & 4) {
                state.check = crc32_1(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              if (len) {
                break inf_leave;
              }
            } else if (state.head) {
              state.head.name = null;
            }
            state.length = 0;
            state.mode = COMMENT;
          /* falls through */
          case COMMENT:
            if (state.flags & 4096) {
              if (have === 0) {
                break inf_leave;
              }
              copy = 0;
              do {
                len = input[next + copy++];
                if (state.head && len && state.length < 65536) {
                  state.head.comment += String.fromCharCode(len);
                }
              } while (len && copy < have);
              if (state.flags & 512 && state.wrap & 4) {
                state.check = crc32_1(state.check, input, copy, next);
              }
              have -= copy;
              next += copy;
              if (len) {
                break inf_leave;
              }
            } else if (state.head) {
              state.head.comment = null;
            }
            state.mode = HCRC;
          /* falls through */
          case HCRC:
            if (state.flags & 512) {
              while (bits < 16) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.wrap & 4 && hold !== (state.check & 65535)) {
                strm.msg = "header crc mismatch";
                state.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            if (state.head) {
              state.head.hcrc = state.flags >> 9 & 1;
              state.head.done = true;
            }
            strm.adler = state.check = 0;
            state.mode = TYPE;
            break;
          case DICTID:
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            strm.adler = state.check = zswap32(hold);
            hold = 0;
            bits = 0;
            state.mode = DICT;
          /* falls through */
          case DICT:
            if (state.havedict === 0) {
              strm.next_out = put;
              strm.avail_out = left;
              strm.next_in = next;
              strm.avail_in = have;
              state.hold = hold;
              state.bits = bits;
              return Z_NEED_DICT$1;
            }
            strm.adler = state.check = 1;
            state.mode = TYPE;
          /* falls through */
          case TYPE:
            if (flush === Z_BLOCK || flush === Z_TREES) {
              break inf_leave;
            }
          /* falls through */
          case TYPEDO:
            if (state.last) {
              hold >>>= bits & 7;
              bits -= bits & 7;
              state.mode = CHECK;
              break;
            }
            while (bits < 3) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.last = hold & 1;
            hold >>>= 1;
            bits -= 1;
            switch (hold & 3) {
              case 0:
                state.mode = STORED;
                break;
              case 1:
                fixedtables(state);
                state.mode = LEN_;
                if (flush === Z_TREES) {
                  hold >>>= 2;
                  bits -= 2;
                  break inf_leave;
                }
                break;
              case 2:
                state.mode = TABLE;
                break;
              case 3:
                strm.msg = "invalid block type";
                state.mode = BAD;
            }
            hold >>>= 2;
            bits -= 2;
            break;
          case STORED:
            hold >>>= bits & 7;
            bits -= bits & 7;
            while (bits < 32) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if ((hold & 65535) !== (hold >>> 16 ^ 65535)) {
              strm.msg = "invalid stored block lengths";
              state.mode = BAD;
              break;
            }
            state.length = hold & 65535;
            hold = 0;
            bits = 0;
            state.mode = COPY_;
            if (flush === Z_TREES) {
              break inf_leave;
            }
          /* falls through */
          case COPY_:
            state.mode = COPY;
          /* falls through */
          case COPY:
            copy = state.length;
            if (copy) {
              if (copy > have) {
                copy = have;
              }
              if (copy > left) {
                copy = left;
              }
              if (copy === 0) {
                break inf_leave;
              }
              output.set(input.subarray(next, next + copy), put);
              have -= copy;
              next += copy;
              left -= copy;
              put += copy;
              state.length -= copy;
              break;
            }
            state.mode = TYPE;
            break;
          case TABLE:
            while (bits < 14) {
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            state.nlen = (hold & 31) + 257;
            hold >>>= 5;
            bits -= 5;
            state.ndist = (hold & 31) + 1;
            hold >>>= 5;
            bits -= 5;
            state.ncode = (hold & 15) + 4;
            hold >>>= 4;
            bits -= 4;
            if (state.nlen > 286 || state.ndist > 30) {
              strm.msg = "too many length or distance symbols";
              state.mode = BAD;
              break;
            }
            state.have = 0;
            state.mode = LENLENS;
          /* falls through */
          case LENLENS:
            while (state.have < state.ncode) {
              while (bits < 3) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.lens[order[state.have++]] = hold & 7;
              hold >>>= 3;
              bits -= 3;
            }
            while (state.have < 19) {
              state.lens[order[state.have++]] = 0;
            }
            state.lencode = state.lendyn;
            state.lenbits = 7;
            opts = { bits: state.lenbits };
            ret = inftrees(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
            state.lenbits = opts.bits;
            if (ret) {
              strm.msg = "invalid code lengths set";
              state.mode = BAD;
              break;
            }
            state.have = 0;
            state.mode = CODELENS;
          /* falls through */
          case CODELENS:
            while (state.have < state.nlen + state.ndist) {
              for (; ; ) {
                here = state.lencode[hold & (1 << state.lenbits) - 1];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (here_val < 16) {
                hold >>>= here_bits;
                bits -= here_bits;
                state.lens[state.have++] = here_val;
              } else {
                if (here_val === 16) {
                  n = here_bits + 2;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  if (state.have === 0) {
                    strm.msg = "invalid bit length repeat";
                    state.mode = BAD;
                    break;
                  }
                  len = state.lens[state.have - 1];
                  copy = 3 + (hold & 3);
                  hold >>>= 2;
                  bits -= 2;
                } else if (here_val === 17) {
                  n = here_bits + 3;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  len = 0;
                  copy = 3 + (hold & 7);
                  hold >>>= 3;
                  bits -= 3;
                } else {
                  n = here_bits + 7;
                  while (bits < n) {
                    if (have === 0) {
                      break inf_leave;
                    }
                    have--;
                    hold += input[next++] << bits;
                    bits += 8;
                  }
                  hold >>>= here_bits;
                  bits -= here_bits;
                  len = 0;
                  copy = 11 + (hold & 127);
                  hold >>>= 7;
                  bits -= 7;
                }
                if (state.have + copy > state.nlen + state.ndist) {
                  strm.msg = "invalid bit length repeat";
                  state.mode = BAD;
                  break;
                }
                while (copy--) {
                  state.lens[state.have++] = len;
                }
              }
            }
            if (state.mode === BAD) {
              break;
            }
            if (state.lens[256] === 0) {
              strm.msg = "invalid code -- missing end-of-block";
              state.mode = BAD;
              break;
            }
            state.lenbits = 9;
            opts = { bits: state.lenbits };
            ret = inftrees(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
            state.lenbits = opts.bits;
            if (ret) {
              strm.msg = "invalid literal/lengths set";
              state.mode = BAD;
              break;
            }
            state.distbits = 6;
            state.distcode = state.distdyn;
            opts = { bits: state.distbits };
            ret = inftrees(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
            state.distbits = opts.bits;
            if (ret) {
              strm.msg = "invalid distances set";
              state.mode = BAD;
              break;
            }
            state.mode = LEN_;
            if (flush === Z_TREES) {
              break inf_leave;
            }
          /* falls through */
          case LEN_:
            state.mode = LEN;
          /* falls through */
          case LEN:
            if (have >= 6 && left >= 258) {
              strm.next_out = put;
              strm.avail_out = left;
              strm.next_in = next;
              strm.avail_in = have;
              state.hold = hold;
              state.bits = bits;
              inffast(strm, _out);
              put = strm.next_out;
              output = strm.output;
              left = strm.avail_out;
              next = strm.next_in;
              input = strm.input;
              have = strm.avail_in;
              hold = state.hold;
              bits = state.bits;
              if (state.mode === TYPE) {
                state.back = -1;
              }
              break;
            }
            state.back = 0;
            for (; ; ) {
              here = state.lencode[hold & (1 << state.lenbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if (here_op && (here_op & 240) === 0) {
              last_bits = here_bits;
              last_op = here_op;
              last_val = here_val;
              for (; ; ) {
                here = state.lencode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (last_bits + here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              hold >>>= last_bits;
              bits -= last_bits;
              state.back += last_bits;
            }
            hold >>>= here_bits;
            bits -= here_bits;
            state.back += here_bits;
            state.length = here_val;
            if (here_op === 0) {
              state.mode = LIT;
              break;
            }
            if (here_op & 32) {
              state.back = -1;
              state.mode = TYPE;
              break;
            }
            if (here_op & 64) {
              strm.msg = "invalid literal/length code";
              state.mode = BAD;
              break;
            }
            state.extra = here_op & 15;
            state.mode = LENEXT;
          /* falls through */
          case LENEXT:
            if (state.extra) {
              n = state.extra;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.length += hold & (1 << state.extra) - 1;
              hold >>>= state.extra;
              bits -= state.extra;
              state.back += state.extra;
            }
            state.was = state.length;
            state.mode = DIST;
          /* falls through */
          case DIST:
            for (; ; ) {
              here = state.distcode[hold & (1 << state.distbits) - 1];
              here_bits = here >>> 24;
              here_op = here >>> 16 & 255;
              here_val = here & 65535;
              if (here_bits <= bits) {
                break;
              }
              if (have === 0) {
                break inf_leave;
              }
              have--;
              hold += input[next++] << bits;
              bits += 8;
            }
            if ((here_op & 240) === 0) {
              last_bits = here_bits;
              last_op = here_op;
              last_val = here_val;
              for (; ; ) {
                here = state.distcode[last_val + ((hold & (1 << last_bits + last_op) - 1) >> last_bits)];
                here_bits = here >>> 24;
                here_op = here >>> 16 & 255;
                here_val = here & 65535;
                if (last_bits + here_bits <= bits) {
                  break;
                }
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              hold >>>= last_bits;
              bits -= last_bits;
              state.back += last_bits;
            }
            hold >>>= here_bits;
            bits -= here_bits;
            state.back += here_bits;
            if (here_op & 64) {
              strm.msg = "invalid distance code";
              state.mode = BAD;
              break;
            }
            state.offset = here_val;
            state.extra = here_op & 15;
            state.mode = DISTEXT;
          /* falls through */
          case DISTEXT:
            if (state.extra) {
              n = state.extra;
              while (bits < n) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              state.offset += hold & (1 << state.extra) - 1;
              hold >>>= state.extra;
              bits -= state.extra;
              state.back += state.extra;
            }
            if (state.offset > state.dmax) {
              strm.msg = "invalid distance too far back";
              state.mode = BAD;
              break;
            }
            state.mode = MATCH;
          /* falls through */
          case MATCH:
            if (left === 0) {
              break inf_leave;
            }
            copy = _out - left;
            if (state.offset > copy) {
              copy = state.offset - copy;
              if (copy > state.whave) {
                if (state.sane) {
                  strm.msg = "invalid distance too far back";
                  state.mode = BAD;
                  break;
                }
              }
              if (copy > state.wnext) {
                copy -= state.wnext;
                from = state.wsize - copy;
              } else {
                from = state.wnext - copy;
              }
              if (copy > state.length) {
                copy = state.length;
              }
              from_source = state.window;
            } else {
              from_source = output;
              from = put - state.offset;
              copy = state.length;
            }
            if (copy > left) {
              copy = left;
            }
            left -= copy;
            state.length -= copy;
            do {
              output[put++] = from_source[from++];
            } while (--copy);
            if (state.length === 0) {
              state.mode = LEN;
            }
            break;
          case LIT:
            if (left === 0) {
              break inf_leave;
            }
            output[put++] = state.length;
            left--;
            state.mode = LEN;
            break;
          case CHECK:
            if (state.wrap) {
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold |= input[next++] << bits;
                bits += 8;
              }
              _out -= left;
              strm.total_out += _out;
              state.total += _out;
              if (state.wrap & 4 && _out) {
                strm.adler = state.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
                state.flags ? crc32_1(state.check, output, _out, put - _out) : adler32_1(state.check, output, _out, put - _out);
              }
              _out = left;
              if (state.wrap & 4 && (state.flags ? hold : zswap32(hold)) !== state.check) {
                strm.msg = "incorrect data check";
                state.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            state.mode = LENGTH;
          /* falls through */
          case LENGTH:
            if (state.wrap && state.flags) {
              while (bits < 32) {
                if (have === 0) {
                  break inf_leave;
                }
                have--;
                hold += input[next++] << bits;
                bits += 8;
              }
              if (state.wrap & 4 && hold !== (state.total & 4294967295)) {
                strm.msg = "incorrect length check";
                state.mode = BAD;
                break;
              }
              hold = 0;
              bits = 0;
            }
            state.mode = DONE;
          /* falls through */
          case DONE:
            ret = Z_STREAM_END$1;
            break inf_leave;
          case BAD:
            ret = Z_DATA_ERROR$1;
            break inf_leave;
          case MEM:
            return Z_MEM_ERROR$1;
          case SYNC:
          /* falls through */
          default:
            return Z_STREAM_ERROR$1;
        }
      }
    strm.next_out = put;
    strm.avail_out = left;
    strm.next_in = next;
    strm.avail_in = have;
    state.hold = hold;
    state.bits = bits;
    if (state.wsize || _out !== strm.avail_out && state.mode < BAD && (state.mode < CHECK || flush !== Z_FINISH$1)) {
      if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) ;
    }
    _in -= strm.avail_in;
    _out -= strm.avail_out;
    strm.total_in += _in;
    strm.total_out += _out;
    state.total += _out;
    if (state.wrap & 4 && _out) {
      strm.adler = state.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
      state.flags ? crc32_1(state.check, output, _out, strm.next_out - _out) : adler32_1(state.check, output, _out, strm.next_out - _out);
    }
    strm.data_type = state.bits + (state.last ? 64 : 0) + (state.mode === TYPE ? 128 : 0) + (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
    if ((_in === 0 && _out === 0 || flush === Z_FINISH$1) && ret === Z_OK$1) {
      ret = Z_BUF_ERROR;
    }
    return ret;
  }, "inflate$2");
  var inflateEnd = /* @__PURE__ */ __name((strm) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    let state = strm.state;
    if (state.window) {
      state.window = null;
    }
    strm.state = null;
    return Z_OK$1;
  }, "inflateEnd");
  var inflateGetHeader = /* @__PURE__ */ __name((strm, head) => {
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    const state = strm.state;
    if ((state.wrap & 2) === 0) {
      return Z_STREAM_ERROR$1;
    }
    state.head = head;
    head.done = false;
    return Z_OK$1;
  }, "inflateGetHeader");
  var inflateSetDictionary = /* @__PURE__ */ __name((strm, dictionary) => {
    const dictLength = dictionary.length;
    let state;
    let dictid;
    let ret;
    if (inflateStateCheck(strm)) {
      return Z_STREAM_ERROR$1;
    }
    state = strm.state;
    if (state.wrap !== 0 && state.mode !== DICT) {
      return Z_STREAM_ERROR$1;
    }
    if (state.mode === DICT) {
      dictid = 1;
      dictid = adler32_1(dictid, dictionary, dictLength, 0);
      if (dictid !== state.check) {
        return Z_DATA_ERROR$1;
      }
    }
    ret = updatewindow(strm, dictionary, dictLength, dictLength);
    if (ret) {
      state.mode = MEM;
      return Z_MEM_ERROR$1;
    }
    state.havedict = 1;
    return Z_OK$1;
  }, "inflateSetDictionary");
  var inflateReset_1 = inflateReset;
  var inflateReset2_1 = inflateReset2;
  var inflateResetKeep_1 = inflateResetKeep;
  var inflateInit_1 = inflateInit;
  var inflateInit2_1 = inflateInit2;
  var inflate_2$1 = inflate$2;
  var inflateEnd_1 = inflateEnd;
  var inflateGetHeader_1 = inflateGetHeader;
  var inflateSetDictionary_1 = inflateSetDictionary;
  var inflateInfo = "pako inflate (from Nodeca project)";
  var inflate_1$2 = {
    inflateReset: inflateReset_1,
    inflateReset2: inflateReset2_1,
    inflateResetKeep: inflateResetKeep_1,
    inflateInit: inflateInit_1,
    inflateInit2: inflateInit2_1,
    inflate: inflate_2$1,
    inflateEnd: inflateEnd_1,
    inflateGetHeader: inflateGetHeader_1,
    inflateSetDictionary: inflateSetDictionary_1,
    inflateInfo
  };
  function GZheader() {
    this.text = 0;
    this.time = 0;
    this.xflags = 0;
    this.os = 0;
    this.extra = null;
    this.extra_len = 0;
    this.name = "";
    this.comment = "";
    this.hcrc = 0;
    this.done = false;
  }
  __name(GZheader, "GZheader");
  var gzheader = GZheader;
  var toString = Object.prototype.toString;
  var {
    Z_NO_FLUSH,
    Z_FINISH,
    Z_OK,
    Z_STREAM_END,
    Z_NEED_DICT,
    Z_STREAM_ERROR,
    Z_DATA_ERROR,
    Z_MEM_ERROR
  } = constants$2;
  function Inflate$1(options) {
    this.options = common.assign({
      chunkSize: 1024 * 64,
      windowBits: 15,
      to: ""
    }, options || {});
    const opt = this.options;
    if (opt.raw && opt.windowBits >= 0 && opt.windowBits < 16) {
      opt.windowBits = -opt.windowBits;
      if (opt.windowBits === 0) {
        opt.windowBits = -15;
      }
    }
    if (opt.windowBits >= 0 && opt.windowBits < 16 && !(options && options.windowBits)) {
      opt.windowBits += 32;
    }
    if (opt.windowBits > 15 && opt.windowBits < 48) {
      if ((opt.windowBits & 15) === 0) {
        opt.windowBits |= 15;
      }
    }
    this.err = 0;
    this.msg = "";
    this.ended = false;
    this.chunks = [];
    this.strm = new zstream();
    this.strm.avail_out = 0;
    let status = inflate_1$2.inflateInit2(
      this.strm,
      opt.windowBits
    );
    if (status !== Z_OK) {
      throw new Error(messages[status]);
    }
    this.header = new gzheader();
    inflate_1$2.inflateGetHeader(this.strm, this.header);
    if (opt.dictionary) {
      if (typeof opt.dictionary === "string") {
        opt.dictionary = strings.string2buf(opt.dictionary);
      } else if (toString.call(opt.dictionary) === "[object ArrayBuffer]") {
        opt.dictionary = new Uint8Array(opt.dictionary);
      }
      if (opt.raw) {
        status = inflate_1$2.inflateSetDictionary(this.strm, opt.dictionary);
        if (status !== Z_OK) {
          throw new Error(messages[status]);
        }
      }
    }
  }
  __name(Inflate$1, "Inflate$1");
  Inflate$1.prototype.push = function(data, flush_mode) {
    const strm = this.strm;
    const chunkSize = this.options.chunkSize;
    const dictionary = this.options.dictionary;
    let status, _flush_mode, last_avail_out;
    if (this.ended) return false;
    if (flush_mode === ~~flush_mode) _flush_mode = flush_mode;
    else _flush_mode = flush_mode === true ? Z_FINISH : Z_NO_FLUSH;
    if (toString.call(data) === "[object ArrayBuffer]") {
      strm.input = new Uint8Array(data);
    } else {
      strm.input = data;
    }
    strm.next_in = 0;
    strm.avail_in = strm.input.length;
    for (; ; ) {
      if (strm.avail_out === 0) {
        strm.output = new Uint8Array(chunkSize);
        strm.next_out = 0;
        strm.avail_out = chunkSize;
      }
      status = inflate_1$2.inflate(strm, _flush_mode);
      if (status === Z_NEED_DICT && dictionary) {
        status = inflate_1$2.inflateSetDictionary(strm, dictionary);
        if (status === Z_OK) {
          status = inflate_1$2.inflate(strm, _flush_mode);
        } else if (status === Z_DATA_ERROR) {
          status = Z_NEED_DICT;
        }
      }
      while (strm.avail_in > 0 && status === Z_STREAM_END && strm.state.wrap > 0 && data[strm.next_in] !== 0) {
        inflate_1$2.inflateReset(strm);
        status = inflate_1$2.inflate(strm, _flush_mode);
      }
      switch (status) {
        case Z_STREAM_ERROR:
        case Z_DATA_ERROR:
        case Z_NEED_DICT:
        case Z_MEM_ERROR:
          this.onEnd(status);
          this.ended = true;
          return false;
      }
      last_avail_out = strm.avail_out;
      if (strm.next_out) {
        if (strm.avail_out === 0 || status === Z_STREAM_END) {
          if (this.options.to === "string") {
            let next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
            let tail = strm.next_out - next_out_utf8;
            let utf8str = strings.buf2string(strm.output, next_out_utf8);
            strm.next_out = tail;
            strm.avail_out = chunkSize - tail;
            if (tail) strm.output.set(strm.output.subarray(next_out_utf8, next_out_utf8 + tail), 0);
            this.onData(utf8str);
          } else {
            this.onData(strm.output.length === strm.next_out ? strm.output : strm.output.subarray(0, strm.next_out));
          }
        }
      }
      if (status === Z_OK && last_avail_out === 0) continue;
      if (status === Z_STREAM_END) {
        status = inflate_1$2.inflateEnd(this.strm);
        this.onEnd(status);
        this.ended = true;
        return true;
      }
      if (strm.avail_in === 0) break;
    }
    return true;
  };
  Inflate$1.prototype.onData = function(chunk) {
    this.chunks.push(chunk);
  };
  Inflate$1.prototype.onEnd = function(status) {
    if (status === Z_OK) {
      if (this.options.to === "string") {
        this.result = this.chunks.join("");
      } else {
        this.result = common.flattenChunks(this.chunks);
      }
    }
    this.chunks = [];
    this.err = status;
    this.msg = this.strm.msg;
  };
  function inflate$1(input, options) {
    const inflator = new Inflate$1(options);
    inflator.push(input);
    if (inflator.err) throw inflator.msg || messages[inflator.err];
    return inflator.result;
  }
  __name(inflate$1, "inflate$1");
  function inflateRaw$1(input, options) {
    options = options || {};
    options.raw = true;
    return inflate$1(input, options);
  }
  __name(inflateRaw$1, "inflateRaw$1");
  var Inflate_1$1 = Inflate$1;
  var inflate_2 = inflate$1;
  var inflateRaw_1$1 = inflateRaw$1;
  var ungzip$1 = inflate$1;
  var constants = constants$2;
  var inflate_1$1 = {
    Inflate: Inflate_1$1,
    inflate: inflate_2,
    inflateRaw: inflateRaw_1$1,
    ungzip: ungzip$1,
    constants
  };
  var { Deflate, deflate, deflateRaw, gzip } = deflate_1$1;
  var { Inflate, inflate, inflateRaw, ungzip } = inflate_1$1;
  var gzip_1 = gzip;
  var ungzip_1 = ungzip;

  // node_modules/starknet/node_modules/@noble/hashes/esm/hmac.js
  var HMAC2 = class extends Hash {
    static {
      __name(this, "HMAC");
    }
    constructor(hash, _key) {
      super();
      this.finished = false;
      this.destroyed = false;
      ahash(hash);
      const key = toBytes(_key);
      this.iHash = hash.create();
      if (typeof this.iHash.update !== "function")
        throw new Error("Expected instance of class which extends utils.Hash");
      this.blockLen = this.iHash.blockLen;
      this.outputLen = this.iHash.outputLen;
      const blockLen = this.blockLen;
      const pad = new Uint8Array(blockLen);
      pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
      for (let i = 0; i < pad.length; i++)
        pad[i] ^= 54;
      this.iHash.update(pad);
      this.oHash = hash.create();
      for (let i = 0; i < pad.length; i++)
        pad[i] ^= 54 ^ 92;
      this.oHash.update(pad);
      pad.fill(0);
    }
    update(buf) {
      aexists(this);
      this.iHash.update(buf);
      return this;
    }
    digestInto(out) {
      aexists(this);
      abytes2(out, this.outputLen);
      this.finished = true;
      this.iHash.digestInto(out);
      this.oHash.update(out);
      this.oHash.digestInto(out);
      this.destroy();
    }
    digest() {
      const out = new Uint8Array(this.oHash.outputLen);
      this.digestInto(out);
      return out;
    }
    _cloneInto(to) {
      to || (to = Object.create(Object.getPrototypeOf(this), {}));
      const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
      to = to;
      to.finished = finished;
      to.destroyed = destroyed;
      to.blockLen = blockLen;
      to.outputLen = outputLen;
      to.oHash = oHash._cloneInto(to.oHash);
      to.iHash = iHash._cloneInto(to.iHash);
      return to;
    }
    destroy() {
      this.destroyed = true;
      this.oHash.destroy();
      this.iHash.destroy();
    }
  };
  var hmac2 = /* @__PURE__ */ __name((hash, key, message) => new HMAC2(hash, key).update(message).digest(), "hmac");
  hmac2.create = (hash, key) => new HMAC2(hash, key);

  // node_modules/starknet/node_modules/@noble/curves/esm/_shortw_utils.js
  function getHash2(hash) {
    return {
      hash,
      hmac: /* @__PURE__ */ __name((key, ...msgs) => hmac2(hash, key, concatBytes2(...msgs)), "hmac"),
      randomBytes
    };
  }
  __name(getHash2, "getHash");
  function createCurve(curveDef, defHash) {
    const create = /* @__PURE__ */ __name((hash) => weierstrass2({ ...curveDef, ...getHash2(hash) }), "create");
    return Object.freeze({ ...create(defHash), create });
  }
  __name(createCurve, "createCurve");

  // node_modules/starknet/node_modules/@noble/curves/esm/secp256k1.js
  var secp256k1P = BigInt("0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f");
  var secp256k1N = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
  var _1n11 = BigInt(1);
  var _2n9 = BigInt(2);
  var divNearest = /* @__PURE__ */ __name((a, b) => (a + b / _2n9) / b, "divNearest");
  function sqrtMod(y) {
    const P = secp256k1P;
    const _3n5 = BigInt(3), _6n = BigInt(6), _11n = BigInt(11), _22n = BigInt(22);
    const _23n = BigInt(23), _44n = BigInt(44), _88n = BigInt(88);
    const b2 = y * y * y % P;
    const b3 = b2 * b2 * y % P;
    const b6 = pow22(b3, _3n5, P) * b3 % P;
    const b9 = pow22(b6, _3n5, P) * b3 % P;
    const b11 = pow22(b9, _2n9, P) * b2 % P;
    const b22 = pow22(b11, _11n, P) * b11 % P;
    const b44 = pow22(b22, _22n, P) * b22 % P;
    const b88 = pow22(b44, _44n, P) * b44 % P;
    const b176 = pow22(b88, _88n, P) * b88 % P;
    const b220 = pow22(b176, _44n, P) * b44 % P;
    const b223 = pow22(b220, _3n5, P) * b3 % P;
    const t1 = pow22(b223, _23n, P) * b22 % P;
    const t2 = pow22(t1, _6n, P) * b2 % P;
    const root = pow22(t2, _2n9, P);
    if (!Fpk1.eql(Fpk1.sqr(root), y))
      throw new Error("Cannot find square root");
    return root;
  }
  __name(sqrtMod, "sqrtMod");
  var Fpk1 = Field2(secp256k1P, void 0, void 0, { sqrt: sqrtMod });
  var secp256k1 = createCurve({
    a: BigInt(0),
    // equation params: a, b
    b: BigInt(7),
    // Seem to be rigid: bitcointalk.org/index.php?topic=289795.msg3183975#msg3183975
    Fp: Fpk1,
    // Field's prime: 2n**256n - 2n**32n - 2n**9n - 2n**8n - 2n**7n - 2n**6n - 2n**4n - 1n
    n: secp256k1N,
    // Curve order, total count of valid points in the field
    // Base point (x, y) aka generator point
    Gx: BigInt("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
    Gy: BigInt("32670510020758816978083085130507043184471273380659243275938904335757337482424"),
    h: BigInt(1),
    // Cofactor
    lowS: true,
    // Allow only low-S signatures by default in sign() and verify()
    /**
     * secp256k1 belongs to Koblitz curves: it has efficiently computable endomorphism.
     * Endomorphism uses 2x less RAM, speeds up precomputation by 2x and ECDH / key recovery by 20%.
     * For precomputed wNAF it trades off 1/2 init time & 1/3 ram for 20% perf hit.
     * Explanation: https://gist.github.com/paulmillr/eb670806793e84df628a7c434a873066
     */
    endo: {
      beta: BigInt("0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee"),
      splitScalar: /* @__PURE__ */ __name((k) => {
        const n = secp256k1N;
        const a1 = BigInt("0x3086d221a7d46bcde86c90e49284eb15");
        const b1 = -_1n11 * BigInt("0xe4437ed6010e88286f547fa90abfe4c3");
        const a2 = BigInt("0x114ca50f7a8e2f3f657c1108d9d44cfd8");
        const b2 = a1;
        const POW_2_128 = BigInt("0x100000000000000000000000000000000");
        const c1 = divNearest(b2 * k, n);
        const c2 = divNearest(-b1 * k, n);
        let k1 = mod2(k - c1 * a1 - c2 * a2, n);
        let k2 = mod2(-c1 * b1 - c2 * b2, n);
        const k1neg = k1 > POW_2_128;
        const k2neg = k2 > POW_2_128;
        if (k1neg)
          k1 = n - k1;
        if (k2neg)
          k2 = n - k2;
        if (k1 > POW_2_128 || k2 > POW_2_128) {
          throw new Error("splitScalar: Endomorphism failed, k=" + k);
        }
        return { k1neg, k1, k2neg, k2 };
      }, "splitScalar")
    }
  }, sha256);
  var _0n11 = BigInt(0);
  var Point = secp256k1.ProjectivePoint;

  // node_modules/fetch-cookie/esm/index.js
  var tough = __toESM(require_cookie(), 1);
  var import_set_cookie_parser = __toESM(require_set_cookie(), 1);
  function isDomainOrSubdomain(destination, original) {
    const orig = new URL(original).hostname;
    const dest = new URL(destination).hostname;
    return orig === dest || orig.endsWith(`.${dest}`);
  }
  __name(isDomainOrSubdomain, "isDomainOrSubdomain");
  var referrerPolicy = /* @__PURE__ */ new Set([
    "",
    "no-referrer",
    "no-referrer-when-downgrade",
    "same-origin",
    "origin",
    "strict-origin",
    "origin-when-cross-origin",
    "strict-origin-when-cross-origin",
    "unsafe-url"
  ]);
  function parseReferrerPolicy(policyHeader) {
    const policyTokens = policyHeader.split(/[,\s]+/);
    let policy = "";
    for (const token of policyTokens) {
      if (token !== "" && referrerPolicy.has(token)) {
        policy = token;
      }
    }
    return policy;
  }
  __name(parseReferrerPolicy, "parseReferrerPolicy");
  function doNothing(init, name) {
  }
  __name(doNothing, "doNothing");
  function callDeleteMethod(init, name) {
    init.headers.delete(name);
  }
  __name(callDeleteMethod, "callDeleteMethod");
  function deleteFromObject(init, name) {
    const headers = init.headers;
    for (const key of Object.keys(headers)) {
      if (key.toLowerCase() === name) {
        delete headers[key];
      }
    }
  }
  __name(deleteFromObject, "deleteFromObject");
  function identifyDeleteHeader(init) {
    if (init.headers == null) {
      return doNothing;
    }
    if (typeof init.headers.delete === "function") {
      return callDeleteMethod;
    }
    return deleteFromObject;
  }
  __name(identifyDeleteHeader, "identifyDeleteHeader");
  var redirectStatus = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
  function isRedirect(status) {
    return redirectStatus.has(status);
  }
  __name(isRedirect, "isRedirect");
  async function handleRedirect(fetchImpl, init, response) {
    switch (init.redirect ?? "follow") {
      case "error":
        throw new TypeError(`URI requested responded with a redirect and redirect mode is set to error: ${response.url}`);
      case "manual":
        return response;
      case "follow":
        break;
      default:
        throw new TypeError(`Invalid redirect option: ${init.redirect}`);
    }
    const locationUrl = response.headers.get("location");
    if (locationUrl === null) {
      return response;
    }
    const requestUrl = response.url;
    const redirectUrl = new URL(locationUrl, requestUrl).toString();
    const redirectCount = init.redirectCount ?? 0;
    const maxRedirect = init.maxRedirect ?? 20;
    if (redirectCount >= maxRedirect) {
      throw new TypeError(`Reached maximum redirect of ${maxRedirect} for URL: ${requestUrl}`);
    }
    init = {
      ...init,
      redirectCount: redirectCount + 1
    };
    const deleteHeader = identifyDeleteHeader(init);
    if (!isDomainOrSubdomain(requestUrl, redirectUrl)) {
      for (const name of ["authorization", "www-authenticate", "cookie", "cookie2"]) {
        deleteHeader(init, name);
      }
    }
    const maybeNodeStreamBody = init.body;
    const maybeStreamBody = init.body;
    if (response.status !== 303 && init.body != null && (typeof maybeNodeStreamBody.pipe === "function" || typeof maybeStreamBody.pipeTo === "function")) {
      throw new TypeError("Cannot follow redirect with body being a readable stream");
    }
    if (response.status === 303 || (response.status === 301 || response.status === 302) && init.method === "POST") {
      init.method = "GET";
      init.body = void 0;
      deleteHeader(init, "content-length");
    }
    if (response.headers.has("referrer-policy")) {
      init.referrerPolicy = parseReferrerPolicy(response.headers.get("referrer-policy"));
    }
    return await fetchImpl(redirectUrl, init);
  }
  __name(handleRedirect, "handleRedirect");
  function addCookiesToRequest(input, init, cookie) {
    if (cookie === "") {
      return init;
    }
    const maybeRequest = input;
    const maybeHeaders = init.headers;
    if (maybeRequest.headers && typeof maybeRequest.headers.append === "function") {
      maybeRequest.headers.append("cookie", cookie);
    } else if (maybeHeaders && typeof maybeHeaders.append === "function") {
      maybeHeaders.append("cookie", cookie);
    } else {
      init = { ...init, headers: { ...init.headers, cookie } };
    }
    return init;
  }
  __name(addCookiesToRequest, "addCookiesToRequest");
  function getCookiesFromResponse(response) {
    const maybeNodeFetchHeaders = response.headers;
    if (typeof maybeNodeFetchHeaders.getAll === "function") {
      return maybeNodeFetchHeaders.getAll("set-cookie");
    }
    if (typeof maybeNodeFetchHeaders.raw === "function") {
      const headers = maybeNodeFetchHeaders.raw();
      if (Array.isArray(headers["set-cookie"])) {
        return headers["set-cookie"];
      }
      return [];
    }
    const cookieString = response.headers.get("set-cookie");
    if (cookieString !== null) {
      return (0, import_set_cookie_parser.splitCookiesString)(cookieString);
    }
    return [];
  }
  __name(getCookiesFromResponse, "getCookiesFromResponse");
  function fetchCookie(fetch2, jar, ignoreError = true) {
    const actualFetch = fetch2;
    const actualJar = jar ?? new tough.CookieJar();
    async function fetchCookieWrapper(input, init) {
      const originalInit = init ?? {};
      init = { ...init, redirect: "manual" };
      const requestUrl = typeof input === "string" ? input : input.url ?? input.href;
      const cookie = await actualJar.getCookieString(requestUrl);
      init = addCookiesToRequest(input, init, cookie);
      const response = await actualFetch(input, init);
      const cookies = getCookiesFromResponse(response);
      await Promise.all(cookies.map(async (cookie2) => await actualJar.setCookie(cookie2, response.url, { ignoreError })));
      if ((init.redirectCount ?? 0) > 0) {
        Object.defineProperty(response, "redirected", { value: true });
      }
      if (!isRedirect(response.status)) {
        return response;
      }
      return await handleRedirect(fetchCookieWrapper, originalInit, response);
    }
    __name(fetchCookieWrapper, "fetchCookieWrapper");
    fetchCookieWrapper.toughCookie = tough;
    return fetchCookieWrapper;
  }
  __name(fetchCookie, "fetchCookie");
  fetchCookie.toughCookie = tough;

  // node_modules/starknet/dist/index.mjs
  var import_isomorphic_fetch = __toESM(require_fetch_npm_browserify(), 1);

  // node_modules/ts-mixer/dist/esm/index.js
  var copyProps = /* @__PURE__ */ __name((dest, src, exclude = []) => {
    const props = Object.getOwnPropertyDescriptors(src);
    for (let prop of exclude)
      delete props[prop];
    Object.defineProperties(dest, props);
  }, "copyProps");
  var protoChain = /* @__PURE__ */ __name((obj, currentChain = [obj]) => {
    const proto = Object.getPrototypeOf(obj);
    if (proto === null)
      return currentChain;
    return protoChain(proto, [...currentChain, proto]);
  }, "protoChain");
  var nearestCommonProto = /* @__PURE__ */ __name((...objs) => {
    if (objs.length === 0)
      return void 0;
    let commonProto = void 0;
    const protoChains = objs.map((obj) => protoChain(obj));
    while (protoChains.every((protoChain2) => protoChain2.length > 0)) {
      const protos = protoChains.map((protoChain2) => protoChain2.pop());
      const potentialCommonProto = protos[0];
      if (protos.every((proto) => proto === potentialCommonProto))
        commonProto = potentialCommonProto;
      else
        break;
    }
    return commonProto;
  }, "nearestCommonProto");
  var hardMixProtos = /* @__PURE__ */ __name((ingredients, constructor, exclude = []) => {
    var _a;
    const base2 = (_a = nearestCommonProto(...ingredients)) !== null && _a !== void 0 ? _a : Object.prototype;
    const mixedProto = Object.create(base2);
    const visitedProtos = protoChain(base2);
    for (let prototype of ingredients) {
      let protos = protoChain(prototype);
      for (let i = protos.length - 1; i >= 0; i--) {
        let newProto = protos[i];
        if (visitedProtos.indexOf(newProto) === -1) {
          copyProps(mixedProto, newProto, ["constructor", ...exclude]);
          visitedProtos.push(newProto);
        }
      }
    }
    mixedProto.constructor = constructor;
    return mixedProto;
  }, "hardMixProtos");
  var unique = /* @__PURE__ */ __name((arr) => arr.filter((e, i) => arr.indexOf(e) == i), "unique");
  var getIngredientWithProp = /* @__PURE__ */ __name((prop, ingredients) => {
    const protoChains = ingredients.map((ingredient) => protoChain(ingredient));
    let protoDepth = 0;
    let protosAreLeftToSearch = true;
    while (protosAreLeftToSearch) {
      protosAreLeftToSearch = false;
      for (let i = ingredients.length - 1; i >= 0; i--) {
        const searchTarget = protoChains[i][protoDepth];
        if (searchTarget !== void 0 && searchTarget !== null) {
          protosAreLeftToSearch = true;
          if (Object.getOwnPropertyDescriptor(searchTarget, prop) != void 0) {
            return protoChains[i][0];
          }
        }
      }
      protoDepth++;
    }
    return void 0;
  }, "getIngredientWithProp");
  var proxyMix = /* @__PURE__ */ __name((ingredients, prototype = Object.prototype) => new Proxy({}, {
    getPrototypeOf() {
      return prototype;
    },
    setPrototypeOf() {
      throw Error("Cannot set prototype of Proxies created by ts-mixer");
    },
    getOwnPropertyDescriptor(_, prop) {
      return Object.getOwnPropertyDescriptor(getIngredientWithProp(prop, ingredients) || {}, prop);
    },
    defineProperty() {
      throw new Error("Cannot define new properties on Proxies created by ts-mixer");
    },
    has(_, prop) {
      return getIngredientWithProp(prop, ingredients) !== void 0 || prototype[prop] !== void 0;
    },
    get(_, prop) {
      return (getIngredientWithProp(prop, ingredients) || prototype)[prop];
    },
    set(_, prop, val) {
      const ingredientWithProp = getIngredientWithProp(prop, ingredients);
      if (ingredientWithProp === void 0)
        throw new Error("Cannot set new properties on Proxies created by ts-mixer");
      ingredientWithProp[prop] = val;
      return true;
    },
    deleteProperty() {
      throw new Error("Cannot delete properties on Proxies created by ts-mixer");
    },
    ownKeys() {
      return ingredients.map(Object.getOwnPropertyNames).reduce((prev, curr) => curr.concat(prev.filter((key) => curr.indexOf(key) < 0)));
    }
  }), "proxyMix");
  var softMixProtos = /* @__PURE__ */ __name((ingredients, constructor) => proxyMix([...ingredients, { constructor }]), "softMixProtos");
  var settings = {
    initFunction: null,
    staticsStrategy: "copy",
    prototypeStrategy: "copy",
    decoratorInheritance: "deep"
  };
  var mixins = /* @__PURE__ */ new WeakMap();
  var getMixinsForClass = /* @__PURE__ */ __name((clazz) => mixins.get(clazz), "getMixinsForClass");
  var registerMixins = /* @__PURE__ */ __name((mixedClass, constituents) => mixins.set(mixedClass, constituents), "registerMixins");
  var mergeObjectsOfDecorators = /* @__PURE__ */ __name((o1, o2) => {
    var _a, _b;
    const allKeys = unique([...Object.getOwnPropertyNames(o1), ...Object.getOwnPropertyNames(o2)]);
    const mergedObject = {};
    for (let key of allKeys)
      mergedObject[key] = unique([...(_a = o1 === null || o1 === void 0 ? void 0 : o1[key]) !== null && _a !== void 0 ? _a : [], ...(_b = o2 === null || o2 === void 0 ? void 0 : o2[key]) !== null && _b !== void 0 ? _b : []]);
    return mergedObject;
  }, "mergeObjectsOfDecorators");
  var mergePropertyAndMethodDecorators = /* @__PURE__ */ __name((d1, d2) => {
    var _a, _b, _c, _d;
    return {
      property: mergeObjectsOfDecorators((_a = d1 === null || d1 === void 0 ? void 0 : d1.property) !== null && _a !== void 0 ? _a : {}, (_b = d2 === null || d2 === void 0 ? void 0 : d2.property) !== null && _b !== void 0 ? _b : {}),
      method: mergeObjectsOfDecorators((_c = d1 === null || d1 === void 0 ? void 0 : d1.method) !== null && _c !== void 0 ? _c : {}, (_d = d2 === null || d2 === void 0 ? void 0 : d2.method) !== null && _d !== void 0 ? _d : {})
    };
  }, "mergePropertyAndMethodDecorators");
  var mergeDecorators = /* @__PURE__ */ __name((d1, d2) => {
    var _a, _b, _c, _d, _e, _f;
    return {
      class: unique([...(_a = d1 === null || d1 === void 0 ? void 0 : d1.class) !== null && _a !== void 0 ? _a : [], ...(_b = d2 === null || d2 === void 0 ? void 0 : d2.class) !== null && _b !== void 0 ? _b : []]),
      static: mergePropertyAndMethodDecorators((_c = d1 === null || d1 === void 0 ? void 0 : d1.static) !== null && _c !== void 0 ? _c : {}, (_d = d2 === null || d2 === void 0 ? void 0 : d2.static) !== null && _d !== void 0 ? _d : {}),
      instance: mergePropertyAndMethodDecorators((_e = d1 === null || d1 === void 0 ? void 0 : d1.instance) !== null && _e !== void 0 ? _e : {}, (_f = d2 === null || d2 === void 0 ? void 0 : d2.instance) !== null && _f !== void 0 ? _f : {})
    };
  }, "mergeDecorators");
  var decorators = /* @__PURE__ */ new Map();
  var findAllConstituentClasses = /* @__PURE__ */ __name((...classes) => {
    var _a;
    const allClasses = /* @__PURE__ */ new Set();
    const frontier = /* @__PURE__ */ new Set([...classes]);
    while (frontier.size > 0) {
      for (let clazz of frontier) {
        const protoChainClasses = protoChain(clazz.prototype).map((proto) => proto.constructor);
        const mixinClasses = (_a = getMixinsForClass(clazz)) !== null && _a !== void 0 ? _a : [];
        const potentiallyNewClasses = [...protoChainClasses, ...mixinClasses];
        const newClasses = potentiallyNewClasses.filter((c) => !allClasses.has(c));
        for (let newClass of newClasses)
          frontier.add(newClass);
        allClasses.add(clazz);
        frontier.delete(clazz);
      }
    }
    return [...allClasses];
  }, "findAllConstituentClasses");
  var deepDecoratorSearch = /* @__PURE__ */ __name((...classes) => {
    const decoratorsForClassChain = findAllConstituentClasses(...classes).map((clazz) => decorators.get(clazz)).filter((decorators2) => !!decorators2);
    if (decoratorsForClassChain.length == 0)
      return {};
    if (decoratorsForClassChain.length == 1)
      return decoratorsForClassChain[0];
    return decoratorsForClassChain.reduce((d1, d2) => mergeDecorators(d1, d2));
  }, "deepDecoratorSearch");
  var directDecoratorSearch = /* @__PURE__ */ __name((...classes) => {
    const classDecorators = classes.map((clazz) => getDecoratorsForClass(clazz));
    if (classDecorators.length === 0)
      return {};
    if (classDecorators.length === 1)
      return classDecorators[0];
    return classDecorators.reduce((d1, d2) => mergeDecorators(d1, d2));
  }, "directDecoratorSearch");
  var getDecoratorsForClass = /* @__PURE__ */ __name((clazz) => {
    let decoratorsForClass = decorators.get(clazz);
    if (!decoratorsForClass) {
      decoratorsForClass = {};
      decorators.set(clazz, decoratorsForClass);
    }
    return decoratorsForClass;
  }, "getDecoratorsForClass");
  function Mixin(...constructors) {
    var _a, _b, _c;
    const prototypes = constructors.map((constructor) => constructor.prototype);
    const initFunctionName = settings.initFunction;
    if (initFunctionName !== null) {
      const initFunctions = prototypes.map((proto) => proto[initFunctionName]).filter((func) => typeof func === "function");
      const combinedInitFunction = /* @__PURE__ */ __name(function(...args) {
        for (let initFunction of initFunctions)
          initFunction.apply(this, args);
      }, "combinedInitFunction");
      const extraProto = { [initFunctionName]: combinedInitFunction };
      prototypes.push(extraProto);
    }
    function MixedClass(...args) {
      for (const constructor of constructors)
        copyProps(this, new constructor(...args));
      if (initFunctionName !== null && typeof this[initFunctionName] === "function")
        this[initFunctionName].apply(this, args);
    }
    __name(MixedClass, "MixedClass");
    MixedClass.prototype = settings.prototypeStrategy === "copy" ? hardMixProtos(prototypes, MixedClass) : softMixProtos(prototypes, MixedClass);
    Object.setPrototypeOf(MixedClass, settings.staticsStrategy === "copy" ? hardMixProtos(constructors, null, ["prototype"]) : proxyMix(constructors, Function.prototype));
    let DecoratedMixedClass = MixedClass;
    if (settings.decoratorInheritance !== "none") {
      const classDecorators = settings.decoratorInheritance === "deep" ? deepDecoratorSearch(...constructors) : directDecoratorSearch(...constructors);
      for (let decorator of (_a = classDecorators === null || classDecorators === void 0 ? void 0 : classDecorators.class) !== null && _a !== void 0 ? _a : []) {
        const result = decorator(DecoratedMixedClass);
        if (result) {
          DecoratedMixedClass = result;
        }
      }
      applyPropAndMethodDecorators((_b = classDecorators === null || classDecorators === void 0 ? void 0 : classDecorators.static) !== null && _b !== void 0 ? _b : {}, DecoratedMixedClass);
      applyPropAndMethodDecorators((_c = classDecorators === null || classDecorators === void 0 ? void 0 : classDecorators.instance) !== null && _c !== void 0 ? _c : {}, DecoratedMixedClass.prototype);
    }
    registerMixins(DecoratedMixedClass, constructors);
    return DecoratedMixedClass;
  }
  __name(Mixin, "Mixin");
  var applyPropAndMethodDecorators = /* @__PURE__ */ __name((propAndMethodDecorators, target) => {
    const propDecorators = propAndMethodDecorators.property;
    const methodDecorators = propAndMethodDecorators.method;
    if (propDecorators)
      for (let key in propDecorators)
        for (let decorator of propDecorators[key])
          decorator(target, key);
    if (methodDecorators)
      for (let key in methodDecorators)
        for (let decorator of methodDecorators[key])
          decorator(target, key, Object.getOwnPropertyDescriptor(target, key));
  }, "applyPropAndMethodDecorators");

  // node_modules/starknet/dist/index.mjs
  var __defProp2 = Object.defineProperty;
  var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames2 = Object.getOwnPropertyNames;
  var __hasOwnProp2 = Object.prototype.hasOwnProperty;
  var __export2 = /* @__PURE__ */ __name((target, all) => {
    for (var name in all)
      __defProp2(target, name, { get: all[name], enumerable: true });
  }, "__export");
  var __copyProps2 = /* @__PURE__ */ __name((to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames2(from))
        if (!__hasOwnProp2.call(to, key) && key !== except)
          __defProp2(to, key, { get: /* @__PURE__ */ __name(() => from[key], "get"), enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
    }
    return to;
  }, "__copyProps");
  var __reExport = /* @__PURE__ */ __name((target, mod3, secondTarget) => (__copyProps2(target, mod3, "default"), secondTarget && __copyProps2(secondTarget, mod3, "default")), "__reExport");
  var constants_exports = {};
  __export2(constants_exports, {
    ADDR_BOUND: /* @__PURE__ */ __name(() => ADDR_BOUND, "ADDR_BOUND"),
    API_VERSION: /* @__PURE__ */ __name(() => API_VERSION, "API_VERSION"),
    BaseUrl: /* @__PURE__ */ __name(() => BaseUrl, "BaseUrl"),
    DEFAULT_GLOBAL_CONFIG: /* @__PURE__ */ __name(() => DEFAULT_GLOBAL_CONFIG, "DEFAULT_GLOBAL_CONFIG"),
    FeeMarginPercentage: /* @__PURE__ */ __name(() => FeeMarginPercentage, "FeeMarginPercentage"),
    HARDENING_4BYTES: /* @__PURE__ */ __name(() => HARDENING_4BYTES, "HARDENING_4BYTES"),
    HARDENING_BYTE: /* @__PURE__ */ __name(() => HARDENING_BYTE, "HARDENING_BYTE"),
    IS_BROWSER: /* @__PURE__ */ __name(() => IS_BROWSER, "IS_BROWSER"),
    MASK_250: /* @__PURE__ */ __name(() => MASK_2502, "MASK_250"),
    MASK_31: /* @__PURE__ */ __name(() => MASK_312, "MASK_31"),
    MAX_STORAGE_ITEM_SIZE: /* @__PURE__ */ __name(() => MAX_STORAGE_ITEM_SIZE, "MAX_STORAGE_ITEM_SIZE"),
    NetworkName: /* @__PURE__ */ __name(() => NetworkName, "NetworkName"),
    OutsideExecutionCallerAny: /* @__PURE__ */ __name(() => OutsideExecutionCallerAny, "OutsideExecutionCallerAny"),
    PRIME: /* @__PURE__ */ __name(() => PRIME, "PRIME"),
    RANGE_FELT: /* @__PURE__ */ __name(() => RANGE_FELT, "RANGE_FELT"),
    RANGE_I128: /* @__PURE__ */ __name(() => RANGE_I128, "RANGE_I128"),
    RANGE_U128: /* @__PURE__ */ __name(() => RANGE_U128, "RANGE_U128"),
    RPC_DEFAULT_VERSION: /* @__PURE__ */ __name(() => RPC_DEFAULT_VERSION, "RPC_DEFAULT_VERSION"),
    RPC_NODES: /* @__PURE__ */ __name(() => RPC_NODES, "RPC_NODES"),
    SNIP9_V1_INTERFACE_ID: /* @__PURE__ */ __name(() => SNIP9_V1_INTERFACE_ID, "SNIP9_V1_INTERFACE_ID"),
    SNIP9_V2_INTERFACE_ID: /* @__PURE__ */ __name(() => SNIP9_V2_INTERFACE_ID, "SNIP9_V2_INTERFACE_ID"),
    SYSTEM_MESSAGES: /* @__PURE__ */ __name(() => SYSTEM_MESSAGES, "SYSTEM_MESSAGES"),
    StarknetChainId: /* @__PURE__ */ __name(() => StarknetChainId, "StarknetChainId"),
    TEXT_TO_FELT_MAX_LEN: /* @__PURE__ */ __name(() => TEXT_TO_FELT_MAX_LEN, "TEXT_TO_FELT_MAX_LEN"),
    TRANSACTION_VERSION: /* @__PURE__ */ __name(() => api_exports2.ETransactionVersion, "TRANSACTION_VERSION"),
    TransactionHashPrefix: /* @__PURE__ */ __name(() => TransactionHashPrefix, "TransactionHashPrefix"),
    UDC: /* @__PURE__ */ __name(() => UDC, "UDC"),
    ZERO: /* @__PURE__ */ __name(() => ZERO, "ZERO")
  });
  var api_exports2 = {};
  __export2(api_exports2, {
    JRPC: /* @__PURE__ */ __name(() => jsonrpc_exports, "JRPC"),
    RPCSPEC06: /* @__PURE__ */ __name(() => rpcspec_0_6_exports, "RPCSPEC06"),
    RPCSPEC07: /* @__PURE__ */ __name(() => esm_exports, "RPCSPEC07")
  });
  var jsonrpc_exports = {};
  var rpcspec_0_6_exports = {};
  __export2(rpcspec_0_6_exports, {
    EBlockTag: /* @__PURE__ */ __name(() => EBlockTag2, "EBlockTag"),
    EDAMode: /* @__PURE__ */ __name(() => EDAMode2, "EDAMode"),
    EDataAvailabilityMode: /* @__PURE__ */ __name(() => EDataAvailabilityMode2, "EDataAvailabilityMode"),
    ESimulationFlag: /* @__PURE__ */ __name(() => ESimulationFlag2, "ESimulationFlag"),
    ETransactionExecutionStatus: /* @__PURE__ */ __name(() => ETransactionExecutionStatus2, "ETransactionExecutionStatus"),
    ETransactionFinalityStatus: /* @__PURE__ */ __name(() => ETransactionFinalityStatus2, "ETransactionFinalityStatus"),
    ETransactionStatus: /* @__PURE__ */ __name(() => ETransactionStatus2, "ETransactionStatus"),
    ETransactionType: /* @__PURE__ */ __name(() => ETransactionType2, "ETransactionType"),
    ETransactionVersion: /* @__PURE__ */ __name(() => ETransactionVersion4, "ETransactionVersion"),
    ETransactionVersion2: /* @__PURE__ */ __name(() => ETransactionVersion22, "ETransactionVersion2"),
    ETransactionVersion3: /* @__PURE__ */ __name(() => ETransactionVersion32, "ETransactionVersion3"),
    Errors: /* @__PURE__ */ __name(() => errors_exports2, "Errors"),
    SPEC: /* @__PURE__ */ __name(() => components_exports2, "SPEC")
  });
  var errors_exports2 = {};
  var components_exports2 = {};
  var ETransactionType2 = {
    DECLARE: "DECLARE",
    DEPLOY: "DEPLOY",
    DEPLOY_ACCOUNT: "DEPLOY_ACCOUNT",
    INVOKE: "INVOKE",
    L1_HANDLER: "L1_HANDLER"
  };
  var ESimulationFlag2 = {
    SKIP_VALIDATE: "SKIP_VALIDATE",
    SKIP_FEE_CHARGE: "SKIP_FEE_CHARGE"
  };
  var ETransactionStatus2 = {
    RECEIVED: "RECEIVED",
    REJECTED: "REJECTED",
    ACCEPTED_ON_L2: "ACCEPTED_ON_L2",
    ACCEPTED_ON_L1: "ACCEPTED_ON_L1"
  };
  var ETransactionFinalityStatus2 = {
    ACCEPTED_ON_L2: "ACCEPTED_ON_L2",
    ACCEPTED_ON_L1: "ACCEPTED_ON_L1"
  };
  var ETransactionExecutionStatus2 = {
    SUCCEEDED: "SUCCEEDED",
    REVERTED: "REVERTED"
  };
  var EBlockTag2 = {
    PENDING: "pending",
    LATEST: "latest"
  };
  var EDataAvailabilityMode2 = {
    L1: "L1",
    L2: "L2"
  };
  var EDAMode2 = {
    L1: 0,
    L2: 1
  };
  var ETransactionVersion4 = {
    V0: "0x0",
    V1: "0x1",
    V2: "0x2",
    V3: "0x3",
    F0: "0x100000000000000000000000000000000",
    F1: "0x100000000000000000000000000000001",
    F2: "0x100000000000000000000000000000002",
    F3: "0x100000000000000000000000000000003"
  };
  var ETransactionVersion22 = {
    V0: "0x0",
    V1: "0x1",
    V2: "0x2",
    F0: "0x100000000000000000000000000000000",
    F1: "0x100000000000000000000000000000001",
    F2: "0x100000000000000000000000000000002"
  };
  var ETransactionVersion32 = {
    V3: "0x3",
    F3: "0x100000000000000000000000000000003"
  };
  __reExport(api_exports2, esm_exports);
  var encode_exports = {};
  __export2(encode_exports, {
    IS_BROWSER: /* @__PURE__ */ __name(() => IS_BROWSER, "IS_BROWSER"),
    addHexPrefix: /* @__PURE__ */ __name(() => addHexPrefix, "addHexPrefix"),
    arrayBufferToString: /* @__PURE__ */ __name(() => arrayBufferToString, "arrayBufferToString"),
    atobUniversal: /* @__PURE__ */ __name(() => atobUniversal, "atobUniversal"),
    btoaUniversal: /* @__PURE__ */ __name(() => btoaUniversal, "btoaUniversal"),
    buf2hex: /* @__PURE__ */ __name(() => buf2hex, "buf2hex"),
    calcByteLength: /* @__PURE__ */ __name(() => calcByteLength, "calcByteLength"),
    concatenateArrayBuffer: /* @__PURE__ */ __name(() => concatenateArrayBuffer, "concatenateArrayBuffer"),
    padLeft: /* @__PURE__ */ __name(() => padLeft, "padLeft"),
    pascalToSnake: /* @__PURE__ */ __name(() => pascalToSnake, "pascalToSnake"),
    removeHexPrefix: /* @__PURE__ */ __name(() => removeHexPrefix, "removeHexPrefix"),
    sanitizeBytes: /* @__PURE__ */ __name(() => sanitizeBytes, "sanitizeBytes"),
    sanitizeHex: /* @__PURE__ */ __name(() => sanitizeHex, "sanitizeHex"),
    stringToArrayBuffer: /* @__PURE__ */ __name(() => stringToArrayBuffer, "stringToArrayBuffer"),
    utf8ToArray: /* @__PURE__ */ __name(() => utf8ToArray, "utf8ToArray")
  });
  var IS_BROWSER = typeof window !== "undefined";
  var STRING_ZERO = "0";
  function arrayBufferToString(array) {
    return new Uint8Array(array).reduce((data, byte) => data + String.fromCharCode(byte), "");
  }
  __name(arrayBufferToString, "arrayBufferToString");
  function utf8ToArray(str) {
    return new TextEncoder().encode(str);
  }
  __name(utf8ToArray, "utf8ToArray");
  function stringToArrayBuffer(str) {
    return utf8ToArray(str);
  }
  __name(stringToArrayBuffer, "stringToArrayBuffer");
  function atobUniversal(a) {
    return base64.decode(a);
  }
  __name(atobUniversal, "atobUniversal");
  function btoaUniversal(b) {
    return base64.encode(new Uint8Array(b));
  }
  __name(btoaUniversal, "btoaUniversal");
  function buf2hex(buffer) {
    return buffer.reduce((r, x) => r + x.toString(16).padStart(2, "0"), "");
  }
  __name(buf2hex, "buf2hex");
  function removeHexPrefix(hex) {
    return hex.replace(/^0x/i, "");
  }
  __name(removeHexPrefix, "removeHexPrefix");
  function addHexPrefix(hex) {
    return `0x${removeHexPrefix(hex)}`;
  }
  __name(addHexPrefix, "addHexPrefix");
  function padString(str, length, left, padding2 = STRING_ZERO) {
    const diff = length - str.length;
    let result = str;
    if (diff > 0) {
      const pad = padding2.repeat(diff);
      result = left ? pad + str : str + pad;
    }
    return result;
  }
  __name(padString, "padString");
  function padLeft(str, length, padding2 = STRING_ZERO) {
    return padString(str, length, true, padding2);
  }
  __name(padLeft, "padLeft");
  function calcByteLength(str, byteSize = 8) {
    const { length } = str;
    const remainder = length % byteSize;
    return remainder ? (length - remainder) / byteSize * byteSize + byteSize : length;
  }
  __name(calcByteLength, "calcByteLength");
  function sanitizeBytes(str, byteSize = 8, padding2 = STRING_ZERO) {
    return padLeft(str, calcByteLength(str, byteSize), padding2);
  }
  __name(sanitizeBytes, "sanitizeBytes");
  function sanitizeHex(hex) {
    const hexWithoutPrefix = removeHexPrefix(hex);
    const sanitizedHex = sanitizeBytes(hexWithoutPrefix, 2);
    return sanitizedHex ? addHexPrefix(sanitizedHex) : sanitizedHex;
  }
  __name(sanitizeHex, "sanitizeHex");
  var pascalToSnake = /* @__PURE__ */ __name((text) => /[a-z]/.test(text) ? text.split(/(?=[A-Z])/).join("_").toUpperCase() : text, "pascalToSnake");
  function concatenateArrayBuffer(uint8arrays) {
    const totalLength = uint8arrays.reduce((total, uint8array) => total + uint8array.byteLength, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    uint8arrays.forEach((uint8array) => {
      result.set(uint8array, offset);
      offset += uint8array.byteLength;
    });
    return result;
  }
  __name(concatenateArrayBuffer, "concatenateArrayBuffer");
  var TEXT_TO_FELT_MAX_LEN = 31;
  var ZERO = 0n;
  var MASK_2502 = 2n ** 250n - 1n;
  var MASK_312 = 2n ** 31n - 1n;
  var API_VERSION = ZERO;
  var PRIME = 2n ** 251n + 17n * 2n ** 192n + 1n;
  var MAX_STORAGE_ITEM_SIZE = 256n;
  var ADDR_BOUND = 2n ** 251n - MAX_STORAGE_ITEM_SIZE;
  var range = /* @__PURE__ */ __name((min, max) => ({ min, max }), "range");
  var RANGE_FELT = range(ZERO, PRIME - 1n);
  var RANGE_I128 = range(-(2n ** 127n), 2n ** 127n - 1n);
  var RANGE_U128 = range(ZERO, 2n ** 128n - 1n);
  var BaseUrl = /* @__PURE__ */ ((BaseUrl2) => {
    BaseUrl2["SN_MAIN"] = "https://alpha-mainnet.starknet.io";
    BaseUrl2["SN_SEPOLIA"] = "https://alpha-sepolia.starknet.io";
    return BaseUrl2;
  })(BaseUrl || {});
  var NetworkName = /* @__PURE__ */ ((NetworkName2) => {
    NetworkName2["SN_MAIN"] = "SN_MAIN";
    NetworkName2["SN_SEPOLIA"] = "SN_SEPOLIA";
    return NetworkName2;
  })(NetworkName || {});
  var StarknetChainId = /* @__PURE__ */ ((StarknetChainId6) => {
    StarknetChainId6["SN_MAIN"] = "0x534e5f4d41494e";
    StarknetChainId6["SN_SEPOLIA"] = "0x534e5f5345504f4c4941";
    return StarknetChainId6;
  })(StarknetChainId || {});
  var TransactionHashPrefix = /* @__PURE__ */ ((TransactionHashPrefix2) => {
    TransactionHashPrefix2["DECLARE"] = "0x6465636c617265";
    TransactionHashPrefix2["DEPLOY"] = "0x6465706c6f79";
    TransactionHashPrefix2["DEPLOY_ACCOUNT"] = "0x6465706c6f795f6163636f756e74";
    TransactionHashPrefix2["INVOKE"] = "0x696e766f6b65";
    TransactionHashPrefix2["L1_HANDLER"] = "0x6c315f68616e646c6572";
    return TransactionHashPrefix2;
  })(TransactionHashPrefix || {});
  var FeeMarginPercentage = /* @__PURE__ */ ((FeeMarginPercentage2) => {
    FeeMarginPercentage2[FeeMarginPercentage2["L1_BOUND_MAX_AMOUNT"] = 50] = "L1_BOUND_MAX_AMOUNT";
    FeeMarginPercentage2[FeeMarginPercentage2["L1_BOUND_MAX_PRICE_PER_UNIT"] = 50] = "L1_BOUND_MAX_PRICE_PER_UNIT";
    FeeMarginPercentage2[FeeMarginPercentage2["MAX_FEE"] = 50] = "MAX_FEE";
    return FeeMarginPercentage2;
  })(FeeMarginPercentage || {});
  var UDC = {
    ADDRESS: "0x041a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf",
    ENTRYPOINT: "deployContract"
  };
  var RPC_DEFAULT_VERSION = "v0_7";
  var RPC_NODES = {
    SN_MAIN: [
      `https://starknet-mainnet.public.blastapi.io/rpc/${RPC_DEFAULT_VERSION}`,
      `https://free-rpc.nethermind.io/mainnet-juno/${RPC_DEFAULT_VERSION}`
    ],
    SN_SEPOLIA: [
      `https://starknet-sepolia.public.blastapi.io/rpc/${RPC_DEFAULT_VERSION}`,
      `https://free-rpc.nethermind.io/sepolia-juno/${RPC_DEFAULT_VERSION}`
    ]
  };
  var OutsideExecutionCallerAny = "0x414e595f43414c4c4552";
  var SNIP9_V1_INTERFACE_ID = "0x68cfd18b92d1907b8ba3cc324900277f5a3622099431ea85dd8089255e4181";
  var SNIP9_V2_INTERFACE_ID = "0x1d1144bb2138366ff28d8e9ab57456b1d332ac42196230c3a602003c89872";
  var HARDENING_BYTE = 128;
  var HARDENING_4BYTES = 2147483648n;
  var DEFAULT_GLOBAL_CONFIG = {
    legacyMode: false,
    logLevel: "INFO",
    accountTxVersion: api_exports2.ETransactionVersion.V2
  };
  var SYSTEM_MESSAGES = {
    legacyTxWarningMessage: "You are using a deprecated transaction version (V0,V1,V2)!\nUpdate to the latest V3 transactions!"
  };
  var rpc_0_6_exports = {};
  __export2(rpc_0_6_exports, {
    RpcChannel: /* @__PURE__ */ __name(() => RpcChannel, "RpcChannel")
  });
  var json_exports = {};
  __export2(json_exports, {
    parse: /* @__PURE__ */ __name(() => parse2, "parse"),
    parseAlwaysAsBig: /* @__PURE__ */ __name(() => parseAlwaysAsBig, "parseAlwaysAsBig"),
    stringify: /* @__PURE__ */ __name(() => stringify2, "stringify"),
    stringifyAlwaysAsBig: /* @__PURE__ */ __name(() => stringifyAlwaysAsBig, "stringifyAlwaysAsBig")
  });
  var parseIntAsNumberOrBigInt = /* @__PURE__ */ __name((str) => {
    if (!isInteger(str)) return parseFloat(str);
    const num = parseInt(str, 10);
    return Number.isSafeInteger(num) ? num : BigInt(str);
  }, "parseIntAsNumberOrBigInt");
  var parse2 = /* @__PURE__ */ __name((str) => parse(String(str), void 0, parseIntAsNumberOrBigInt), "parse2");
  var parseAlwaysAsBig = /* @__PURE__ */ __name((str) => parse(String(str), void 0, parseNumberAndBigInt), "parseAlwaysAsBig");
  var stringify2 = /* @__PURE__ */ __name((value, replacer, space, numberStringifiers) => stringify(value, replacer, space, numberStringifiers), "stringify2");
  var stringifyAlwaysAsBig = stringify2;
  var errorCodes = {
    FAILED_TO_RECEIVE_TXN: 1,
    NO_TRACE_AVAILABLE: 10,
    CONTRACT_NOT_FOUND: 20,
    BLOCK_NOT_FOUND: 24,
    INVALID_TXN_INDEX: 27,
    CLASS_HASH_NOT_FOUND: 28,
    TXN_HASH_NOT_FOUND: 29,
    PAGE_SIZE_TOO_BIG: 31,
    NO_BLOCKS: 32,
    INVALID_CONTINUATION_TOKEN: 33,
    TOO_MANY_KEYS_IN_FILTER: 34,
    CONTRACT_ERROR: 40,
    TRANSACTION_EXECUTION_ERROR: 41,
    CLASS_ALREADY_DECLARED: 51,
    INVALID_TRANSACTION_NONCE: 52,
    INSUFFICIENT_MAX_FEE: 53,
    INSUFFICIENT_ACCOUNT_BALANCE: 54,
    VALIDATION_FAILURE: 55,
    COMPILATION_FAILED: 56,
    CONTRACT_CLASS_SIZE_IS_TOO_LARGE: 57,
    NON_ACCOUNT: 58,
    DUPLICATE_TX: 59,
    COMPILED_CLASS_HASH_MISMATCH: 60,
    UNSUPPORTED_TX_VERSION: 61,
    UNSUPPORTED_CONTRACT_CLASS_VERSION: 62,
    UNEXPECTED_ERROR: 63
  };
  var rpc_default = errorCodes;
  function fixStack(target, fn = target.constructor) {
    const { captureStackTrace } = Error;
    captureStackTrace && captureStackTrace(target, fn);
  }
  __name(fixStack, "fixStack");
  function fixProto(target, prototype) {
    const { setPrototypeOf } = Object;
    setPrototypeOf ? setPrototypeOf(target, prototype) : target.__proto__ = prototype;
  }
  __name(fixProto, "fixProto");
  var CustomError = class extends Error {
    static {
      __name(this, "CustomError");
    }
    name;
    constructor(message) {
      super(message);
      Object.defineProperty(this, "name", {
        value: new.target.name,
        enumerable: false,
        configurable: true
      });
      fixProto(this, new.target.prototype);
      fixStack(this);
    }
  };
  var LibraryError = class extends CustomError {
    static {
      __name(this, "LibraryError");
    }
  };
  var RpcError = class extends LibraryError {
    static {
      __name(this, "RpcError");
    }
    constructor(baseError, method, params) {
      super(`RPC: ${method} with params ${stringify2(params, null, 2)}

      ${baseError.code}: ${baseError.message}: ${stringify2(baseError.data)}`);
      this.baseError = baseError;
      this.request = { method, params };
    }
    request;
    get code() {
      return this.baseError.code;
    }
    /**
     * Verifies the underlying RPC error, also serves as a type guard for the _baseError_ property
     * @example
     * ```typescript
     * SomeError.isType('UNEXPECTED_ERROR');
     * ```
     */
    isType(typeName) {
      return rpc_default[typeName] === this.code;
    }
  };
  var types_exports = {};
  __export2(types_exports, {
    BlockStatus: /* @__PURE__ */ __name(() => BlockStatus, "BlockStatus"),
    BlockTag: /* @__PURE__ */ __name(() => BlockTag, "BlockTag"),
    ETH_ADDRESS: /* @__PURE__ */ __name(() => ETH_ADDRESS, "ETH_ADDRESS"),
    EntryPointType: /* @__PURE__ */ __name(() => EntryPointType, "EntryPointType"),
    Literal: /* @__PURE__ */ __name(() => Literal, "Literal"),
    NON_ZERO_PREFIX: /* @__PURE__ */ __name(() => NON_ZERO_PREFIX, "NON_ZERO_PREFIX"),
    OutsideExecutionTypesV1: /* @__PURE__ */ __name(() => OutsideExecutionTypesV1, "OutsideExecutionTypesV1"),
    OutsideExecutionTypesV2: /* @__PURE__ */ __name(() => OutsideExecutionTypesV2, "OutsideExecutionTypesV2"),
    OutsideExecutionVersion: /* @__PURE__ */ __name(() => OutsideExecutionVersion, "OutsideExecutionVersion"),
    RPC: /* @__PURE__ */ __name(() => api_exports2, "RPC"),
    TransactionExecutionStatus: /* @__PURE__ */ __name(() => TransactionExecutionStatus, "TransactionExecutionStatus"),
    TransactionFinalityStatus: /* @__PURE__ */ __name(() => TransactionFinalityStatus, "TransactionFinalityStatus"),
    TransactionStatus: /* @__PURE__ */ __name(() => TransactionStatus, "TransactionStatus"),
    TransactionType: /* @__PURE__ */ __name(() => TransactionType, "TransactionType"),
    TypedDataRevision: /* @__PURE__ */ __name(() => TypedDataRevision, "TypedDataRevision"),
    Uint: /* @__PURE__ */ __name(() => Uint, "Uint"),
    ValidateType: /* @__PURE__ */ __name(() => ValidateType, "ValidateType")
  });
  var EntryPointType = {
    EXTERNAL: "EXTERNAL",
    L1_HANDLER: "L1_HANDLER",
    CONSTRUCTOR: "CONSTRUCTOR"
  };
  var TransactionType = {
    DECLARE: "DECLARE",
    DEPLOY: "DEPLOY",
    DEPLOY_ACCOUNT: "DEPLOY_ACCOUNT",
    INVOKE: "INVOKE_FUNCTION"
  };
  var TransactionStatus = {
    NOT_RECEIVED: "NOT_RECEIVED",
    RECEIVED: "RECEIVED",
    ACCEPTED_ON_L2: "ACCEPTED_ON_L2",
    ACCEPTED_ON_L1: "ACCEPTED_ON_L1",
    REJECTED: "REJECTED",
    REVERTED: "REVERTED"
  };
  var TransactionFinalityStatus = {
    NOT_RECEIVED: "NOT_RECEIVED",
    RECEIVED: "RECEIVED",
    ACCEPTED_ON_L2: "ACCEPTED_ON_L2",
    ACCEPTED_ON_L1: "ACCEPTED_ON_L1"
  };
  var TransactionExecutionStatus = {
    REJECTED: "REJECTED",
    REVERTED: "REVERTED",
    SUCCEEDED: "SUCCEEDED"
  };
  var BlockStatus = {
    PENDING: "PENDING",
    ACCEPTED_ON_L1: "ACCEPTED_ON_L1",
    ACCEPTED_ON_L2: "ACCEPTED_ON_L2",
    REJECTED: "REJECTED"
  };
  var BlockTag = {
    PENDING: "pending",
    LATEST: "latest"
  };
  var ValidateType = {
    DEPLOY: "DEPLOY",
    CALL: "CALL",
    INVOKE: "INVOKE"
  };
  var Uint = {
    u8: "core::integer::u8",
    u16: "core::integer::u16",
    u32: "core::integer::u32",
    u64: "core::integer::u64",
    u128: "core::integer::u128",
    u256: "core::integer::u256",
    // This one is struct
    u512: "core::integer::u512"
    // This one is struct
  };
  var Literal = {
    ClassHash: "core::starknet::class_hash::ClassHash",
    ContractAddress: "core::starknet::contract_address::ContractAddress",
    Secp256k1Point: "core::starknet::secp256k1::Secp256k1Point",
    U96: "core::internal::bounded_int::BoundedInt::<0, 79228162514264337593543950335>"
  };
  var ETH_ADDRESS = "core::starknet::eth_address::EthAddress";
  var NON_ZERO_PREFIX = "core::zeroable::NonZero::";
  var OutsideExecutionTypesV1 = {
    StarkNetDomain: [
      { name: "name", type: "felt" },
      { name: "version", type: "felt" },
      { name: "chainId", type: "felt" }
    ],
    OutsideExecution: [
      { name: "caller", type: "felt" },
      { name: "nonce", type: "felt" },
      { name: "execute_after", type: "felt" },
      { name: "execute_before", type: "felt" },
      { name: "calls_len", type: "felt" },
      { name: "calls", type: "OutsideCall*" }
    ],
    OutsideCall: [
      { name: "to", type: "felt" },
      { name: "selector", type: "felt" },
      { name: "calldata_len", type: "felt" },
      { name: "calldata", type: "felt*" }
    ]
  };
  var OutsideExecutionTypesV2 = {
    StarknetDomain: [
      // SNIP-12 revision 1 is used, so should be "StarknetDomain", not "StarkNetDomain"
      { name: "name", type: "shortstring" },
      { name: "version", type: "shortstring" },
      // set to 2 in v2
      { name: "chainId", type: "shortstring" },
      { name: "revision", type: "shortstring" }
    ],
    OutsideExecution: [
      { name: "Caller", type: "ContractAddress" },
      { name: "Nonce", type: "felt" },
      { name: "Execute After", type: "u128" },
      { name: "Execute Before", type: "u128" },
      { name: "Calls", type: "Call*" }
    ],
    Call: [
      { name: "To", type: "ContractAddress" },
      { name: "Selector", type: "selector" },
      { name: "Calldata", type: "felt*" }
    ]
  };
  var OutsideExecutionVersion = /* @__PURE__ */ ((OutsideExecutionVersion2) => {
    OutsideExecutionVersion2["UNSUPPORTED"] = "0";
    OutsideExecutionVersion2["V1"] = "1";
    OutsideExecutionVersion2["V2"] = "2";
    return OutsideExecutionVersion2;
  })(OutsideExecutionVersion || {});
  var BatchClient = class {
    static {
      __name(this, "BatchClient");
    }
    nodeUrl;
    headers;
    interval;
    requestId = 0;
    pendingRequests = {};
    batchPromises = {};
    delayTimer;
    delayPromise;
    delayPromiseResolve;
    baseFetch;
    constructor(options) {
      this.nodeUrl = options.nodeUrl;
      this.headers = options.headers;
      this.interval = options.interval;
      this.baseFetch = options.baseFetch;
    }
    async wait() {
      if (!this.delayPromise || !this.delayPromiseResolve) {
        this.delayPromise = new Promise((resolve) => {
          this.delayPromiseResolve = resolve;
        });
      }
      if (this.delayTimer) {
        clearTimeout(this.delayTimer);
        this.delayTimer = void 0;
      }
      this.delayTimer = setTimeout(() => {
        if (this.delayPromiseResolve) {
          this.delayPromiseResolve();
          this.delayPromise = void 0;
          this.delayPromiseResolve = void 0;
        }
      }, this.interval);
      return this.delayPromise;
    }
    addPendingRequest(method, params, id) {
      const request = {
        id: id ?? `batched_${this.requestId += 1}`,
        jsonrpc: "2.0",
        method,
        params: params ?? void 0
      };
      this.pendingRequests[request.id] = request;
      return request.id;
    }
    async sendBatch(requests) {
      const raw = await this.baseFetch(this.nodeUrl, {
        method: "POST",
        body: stringify2(requests),
        headers: this.headers
      });
      return raw.json();
    }
    /**
     * Automatically batches and fetches JSON-RPC calls in a single request.
     * @param method Method to call
     * @param params Method parameters
     * @param id JSON-RPC Request ID
     * @returns JSON-RPC Response
     */
    async fetch(method, params, id) {
      const requestId = this.addPendingRequest(method, params, id);
      await this.wait();
      const requests = this.pendingRequests;
      this.pendingRequests = {};
      if (!this.batchPromises[requestId]) {
        const promise = this.sendBatch(Object.values(requests));
        Object.keys(requests).forEach((key) => {
          this.batchPromises[key] = promise;
        });
      }
      const results = await this.batchPromises[requestId];
      delete this.batchPromises[requestId];
      const result = results.find((res) => res.id === requestId);
      if (!result) throw new Error(`Couldn't find the result for the request. Method: ${method}`);
      return result;
    }
  };
  function assert(condition, message) {
    if (!condition) {
      throw new Error(message || "Assertion failure");
    }
  }
  __name(assert, "assert");
  var num_exports = {};
  __export2(num_exports, {
    addPercent: /* @__PURE__ */ __name(() => addPercent, "addPercent"),
    assertInRange: /* @__PURE__ */ __name(() => assertInRange, "assertInRange"),
    bigNumberishArrayToDecimalStringArray: /* @__PURE__ */ __name(() => bigNumberishArrayToDecimalStringArray, "bigNumberishArrayToDecimalStringArray"),
    bigNumberishArrayToHexadecimalStringArray: /* @__PURE__ */ __name(() => bigNumberishArrayToHexadecimalStringArray, "bigNumberishArrayToHexadecimalStringArray"),
    cleanHex: /* @__PURE__ */ __name(() => cleanHex, "cleanHex"),
    getDecimalString: /* @__PURE__ */ __name(() => getDecimalString, "getDecimalString"),
    getHexString: /* @__PURE__ */ __name(() => getHexString, "getHexString"),
    getHexStringArray: /* @__PURE__ */ __name(() => getHexStringArray, "getHexStringArray"),
    hexToBytes: /* @__PURE__ */ __name(() => hexToBytes3, "hexToBytes"),
    hexToDecimalString: /* @__PURE__ */ __name(() => hexToDecimalString, "hexToDecimalString"),
    isBigNumberish: /* @__PURE__ */ __name(() => isBigNumberish, "isBigNumberish"),
    isHex: /* @__PURE__ */ __name(() => isHex2, "isHex"),
    isStringWholeNumber: /* @__PURE__ */ __name(() => isStringWholeNumber, "isStringWholeNumber"),
    stringToSha256ToArrayBuff4: /* @__PURE__ */ __name(() => stringToSha256ToArrayBuff4, "stringToSha256ToArrayBuff4"),
    toBigInt: /* @__PURE__ */ __name(() => toBigInt, "toBigInt"),
    toCairoBool: /* @__PURE__ */ __name(() => toCairoBool, "toCairoBool"),
    toHex: /* @__PURE__ */ __name(() => toHex, "toHex"),
    toHex64: /* @__PURE__ */ __name(() => toHex64, "toHex64"),
    toHexString: /* @__PURE__ */ __name(() => toHexString, "toHexString"),
    toStorageKey: /* @__PURE__ */ __name(() => toStorageKey, "toStorageKey")
  });
  var isUndefined = /* @__PURE__ */ __name((value) => {
    return typeof value === "undefined" || value === void 0;
  }, "isUndefined");
  function isNumber2(value) {
    return typeof value === "number";
  }
  __name(isNumber2, "isNumber");
  function isBoolean(value) {
    return typeof value === "boolean";
  }
  __name(isBoolean, "isBoolean");
  function isBigInt(value) {
    return typeof value === "bigint";
  }
  __name(isBigInt, "isBigInt");
  function isString(value) {
    return typeof value === "string";
  }
  __name(isString, "isString");
  function isObject2(item) {
    return !!item && typeof item === "object" && !Array.isArray(item);
  }
  __name(isObject2, "isObject");
  function isHex2(hex) {
    return /^0x[0-9a-f]*$/i.test(hex);
  }
  __name(isHex2, "isHex");
  function toBigInt(value) {
    return BigInt(value);
  }
  __name(toBigInt, "toBigInt");
  function toHex(value) {
    return addHexPrefix(toBigInt(value).toString(16));
  }
  __name(toHex, "toHex");
  var toHexString = toHex;
  function toStorageKey(number2) {
    return addHexPrefix(toBigInt(number2).toString(16).padStart(64, "0"));
  }
  __name(toStorageKey, "toStorageKey");
  function toHex64(number2) {
    const res = addHexPrefix(toBigInt(number2).toString(16).padStart(64, "0"));
    if (res.length !== 66) throw TypeError("number is too big for hex 0x(64) representation");
    return res;
  }
  __name(toHex64, "toHex64");
  function hexToDecimalString(hex) {
    return BigInt(addHexPrefix(hex)).toString(10);
  }
  __name(hexToDecimalString, "hexToDecimalString");
  function cleanHex(hex) {
    return hex.toLowerCase().replace(/^(0x)0+/, "$1");
  }
  __name(cleanHex, "cleanHex");
  function assertInRange(input, lowerBound, upperBound, inputName = "") {
    const messageSuffix = inputName === "" ? "invalid length" : `invalid ${inputName} length`;
    const inputBigInt = BigInt(input);
    const lowerBoundBigInt = BigInt(lowerBound);
    const upperBoundBigInt = BigInt(upperBound);
    assert(
      inputBigInt >= lowerBoundBigInt && inputBigInt <= upperBoundBigInt,
      `Message not signable, ${messageSuffix}.`
    );
  }
  __name(assertInRange, "assertInRange");
  function bigNumberishArrayToDecimalStringArray(data) {
    return data.map((x) => toBigInt(x).toString(10));
  }
  __name(bigNumberishArrayToDecimalStringArray, "bigNumberishArrayToDecimalStringArray");
  function bigNumberishArrayToHexadecimalStringArray(data) {
    return data.map((x) => toHex(x));
  }
  __name(bigNumberishArrayToHexadecimalStringArray, "bigNumberishArrayToHexadecimalStringArray");
  function isStringWholeNumber(str) {
    return /^\d+$/.test(str);
  }
  __name(isStringWholeNumber, "isStringWholeNumber");
  function getDecimalString(str) {
    if (isHex2(str)) {
      return hexToDecimalString(str);
    }
    if (isStringWholeNumber(str)) {
      return str;
    }
    throw new Error(`${str} needs to be a hex-string or whole-number-string`);
  }
  __name(getDecimalString, "getDecimalString");
  function getHexString(str) {
    if (isHex2(str)) {
      return str;
    }
    if (isStringWholeNumber(str)) {
      return toHexString(str);
    }
    throw new Error(`${str} needs to be a hex-string or whole-number-string`);
  }
  __name(getHexString, "getHexString");
  function getHexStringArray(array) {
    return array.map(getHexString);
  }
  __name(getHexStringArray, "getHexStringArray");
  function toCairoBool(value) {
    return (+value).toString();
  }
  __name(toCairoBool, "toCairoBool");
  function hexToBytes3(str) {
    if (!isHex2(str)) throw new Error(`${str} needs to be a hex-string`);
    let adaptedValue = removeHexPrefix(str);
    if (adaptedValue.length % 2 !== 0) {
      adaptedValue = `0${adaptedValue}`;
    }
    return hexToBytes(adaptedValue);
  }
  __name(hexToBytes3, "hexToBytes");
  function addPercent(number2, percent) {
    const bigIntNum = BigInt(number2);
    return bigIntNum + bigIntNum * BigInt(percent) / 100n;
  }
  __name(addPercent, "addPercent");
  function stringToSha256ToArrayBuff4(str) {
    const int312 = /* @__PURE__ */ __name((n) => Number(n & MASK_312), "int31");
    const result = int312(BigInt(addHexPrefix(buf2hex(sha256(str)))));
    return hexToBytes3(toHex(result));
  }
  __name(stringToSha256ToArrayBuff4, "stringToSha256ToArrayBuff4");
  function isBigNumberish(input) {
    return isNumber2(input) || isBigInt(input) || isString(input) && (isHex2(input) || isStringWholeNumber(input));
  }
  __name(isBigNumberish, "isBigNumberish");
  var selector_exports = {};
  __export2(selector_exports, {
    getL2MessageHash: /* @__PURE__ */ __name(() => getL2MessageHash, "getL2MessageHash"),
    getSelector: /* @__PURE__ */ __name(() => getSelector, "getSelector"),
    getSelectorFromName: /* @__PURE__ */ __name(() => getSelectorFromName, "getSelectorFromName"),
    keccakBn: /* @__PURE__ */ __name(() => keccakBn, "keccakBn"),
    solidityUint256PackedKeccak256: /* @__PURE__ */ __name(() => solidityUint256PackedKeccak256, "solidityUint256PackedKeccak256"),
    starknetKeccak: /* @__PURE__ */ __name(() => starknetKeccak, "starknetKeccak")
  });
  function keccakBn(value) {
    const hexWithoutPrefix = removeHexPrefix(toHex(BigInt(value)));
    const evenHex = hexWithoutPrefix.length % 2 === 0 ? hexWithoutPrefix : `0${hexWithoutPrefix}`;
    return addHexPrefix(keccak(hexToBytes3(addHexPrefix(evenHex))).toString(16));
  }
  __name(keccakBn, "keccakBn");
  function keccakHex(str) {
    return addHexPrefix(keccak(utf8ToArray(str)).toString(16));
  }
  __name(keccakHex, "keccakHex");
  function starknetKeccak(str) {
    const hash = BigInt(keccakHex(str));
    return hash & MASK_2502;
  }
  __name(starknetKeccak, "starknetKeccak");
  function getSelectorFromName(funcName) {
    return toHex(starknetKeccak(funcName));
  }
  __name(getSelectorFromName, "getSelectorFromName");
  function getSelector(value) {
    if (isNumber2(value) || isBigInt(value)) return toHex(value);
    if (isHex2(value)) return value;
    if (isStringWholeNumber(value)) return toHex(value);
    return getSelectorFromName(value);
  }
  __name(getSelector, "getSelector");
  function solidityUint256PackedKeccak256(params) {
    const myEncode = addHexPrefix(
      params.reduce(
        (res, par) => res + removeHexPrefix(toHex(par)).padStart(64, "0"),
        ""
      )
    );
    return addHexPrefix(bytesToHex(keccak_2562(hexToBytes3(myEncode))));
  }
  __name(solidityUint256PackedKeccak256, "solidityUint256PackedKeccak256");
  function getL2MessageHash(l1FromAddress, l2ToAddress, l2Selector, l2Calldata, l1Nonce) {
    return solidityUint256PackedKeccak256([
      l1FromAddress,
      l2ToAddress,
      l1Nonce,
      l2Selector,
      l2Calldata.length,
      ...l2Calldata
    ]);
  }
  __name(getL2MessageHash, "getL2MessageHash");
  var shortString_exports = {};
  __export2(shortString_exports, {
    decodeShortString: /* @__PURE__ */ __name(() => decodeShortString, "decodeShortString"),
    encodeShortString: /* @__PURE__ */ __name(() => encodeShortString, "encodeShortString"),
    isASCII: /* @__PURE__ */ __name(() => isASCII, "isASCII"),
    isDecimalString: /* @__PURE__ */ __name(() => isDecimalString, "isDecimalString"),
    isLongText: /* @__PURE__ */ __name(() => isLongText, "isLongText"),
    isShortString: /* @__PURE__ */ __name(() => isShortString, "isShortString"),
    isShortText: /* @__PURE__ */ __name(() => isShortText, "isShortText"),
    isText: /* @__PURE__ */ __name(() => isText, "isText"),
    splitLongString: /* @__PURE__ */ __name(() => splitLongString, "splitLongString")
  });
  function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str);
  }
  __name(isASCII, "isASCII");
  function isShortString(str) {
    return str.length <= TEXT_TO_FELT_MAX_LEN;
  }
  __name(isShortString, "isShortString");
  function isDecimalString(str) {
    return /^[0-9]*$/i.test(str);
  }
  __name(isDecimalString, "isDecimalString");
  function isText(val) {
    return isString(val) && !isHex2(val) && !isStringWholeNumber(val);
  }
  __name(isText, "isText");
  var isShortText = /* @__PURE__ */ __name((val) => isText(val) && isShortString(val), "isShortText");
  var isLongText = /* @__PURE__ */ __name((val) => isText(val) && !isShortString(val), "isLongText");
  function splitLongString(longStr) {
    const regex = RegExp(`[^]{1,${TEXT_TO_FELT_MAX_LEN}}`, "g");
    return longStr.match(regex) || [];
  }
  __name(splitLongString, "splitLongString");
  function encodeShortString(str) {
    if (!isASCII(str)) throw new Error(`${str} is not an ASCII string`);
    if (!isShortString(str)) throw new Error(`${str} is too long`);
    return addHexPrefix(str.replace(/./g, (char) => char.charCodeAt(0).toString(16)));
  }
  __name(encodeShortString, "encodeShortString");
  function decodeShortString(str) {
    if (!isASCII(str)) throw new Error(`${str} is not an ASCII string`);
    if (isHex2(str)) {
      return removeHexPrefix(str).replace(/.{2}/g, (hex) => String.fromCharCode(parseInt(hex, 16)));
    }
    if (isDecimalString(str)) {
      return decodeShortString("0X".concat(BigInt(str).toString(16)));
    }
    throw new Error(`${str} is not Hex or decimal`);
  }
  __name(decodeShortString, "decodeShortString");
  var byteArray_exports = {};
  __export2(byteArray_exports, {
    byteArrayFromString: /* @__PURE__ */ __name(() => byteArrayFromString, "byteArrayFromString"),
    stringFromByteArray: /* @__PURE__ */ __name(() => stringFromByteArray, "stringFromByteArray")
  });
  function stringFromByteArray(myByteArray) {
    const pending_word = BigInt(myByteArray.pending_word) === 0n ? "" : decodeShortString(toHex(myByteArray.pending_word));
    return myByteArray.data.reduce((cumuledString, encodedString) => {
      const add = BigInt(encodedString) === 0n ? "" : decodeShortString(toHex(encodedString));
      return cumuledString + add;
    }, "") + pending_word;
  }
  __name(stringFromByteArray, "stringFromByteArray");
  function byteArrayFromString(targetString) {
    const shortStrings = splitLongString(targetString);
    const remainder = shortStrings[shortStrings.length - 1];
    const shortStringsEncoded = shortStrings.map(encodeShortString);
    const [pendingWord, pendingWordLength] = remainder === void 0 || remainder.length === 31 ? ["0x00", 0] : [shortStringsEncoded.pop(), remainder.length];
    return {
      data: shortStringsEncoded.length === 0 ? [] : shortStringsEncoded,
      pending_word: pendingWord,
      pending_word_len: pendingWordLength
    };
  }
  __name(byteArrayFromString, "byteArrayFromString");
  var cairo_exports = {};
  __export2(cairo_exports, {
    felt: /* @__PURE__ */ __name(() => felt, "felt"),
    getAbiContractVersion: /* @__PURE__ */ __name(() => getAbiContractVersion, "getAbiContractVersion"),
    getArrayType: /* @__PURE__ */ __name(() => getArrayType, "getArrayType"),
    isCairo1Abi: /* @__PURE__ */ __name(() => isCairo1Abi, "isCairo1Abi"),
    isCairo1Type: /* @__PURE__ */ __name(() => isCairo1Type, "isCairo1Type"),
    isLen: /* @__PURE__ */ __name(() => isLen, "isLen"),
    isTypeArray: /* @__PURE__ */ __name(() => isTypeArray, "isTypeArray"),
    isTypeBool: /* @__PURE__ */ __name(() => isTypeBool, "isTypeBool"),
    isTypeByteArray: /* @__PURE__ */ __name(() => isTypeByteArray, "isTypeByteArray"),
    isTypeBytes31: /* @__PURE__ */ __name(() => isTypeBytes31, "isTypeBytes31"),
    isTypeContractAddress: /* @__PURE__ */ __name(() => isTypeContractAddress, "isTypeContractAddress"),
    isTypeEnum: /* @__PURE__ */ __name(() => isTypeEnum, "isTypeEnum"),
    isTypeEthAddress: /* @__PURE__ */ __name(() => isTypeEthAddress, "isTypeEthAddress"),
    isTypeFelt: /* @__PURE__ */ __name(() => isTypeFelt, "isTypeFelt"),
    isTypeLiteral: /* @__PURE__ */ __name(() => isTypeLiteral, "isTypeLiteral"),
    isTypeNamedTuple: /* @__PURE__ */ __name(() => isTypeNamedTuple, "isTypeNamedTuple"),
    isTypeNonZero: /* @__PURE__ */ __name(() => isTypeNonZero, "isTypeNonZero"),
    isTypeOption: /* @__PURE__ */ __name(() => isTypeOption, "isTypeOption"),
    isTypeResult: /* @__PURE__ */ __name(() => isTypeResult, "isTypeResult"),
    isTypeSecp256k1Point: /* @__PURE__ */ __name(() => isTypeSecp256k1Point, "isTypeSecp256k1Point"),
    isTypeStruct: /* @__PURE__ */ __name(() => isTypeStruct, "isTypeStruct"),
    isTypeTuple: /* @__PURE__ */ __name(() => isTypeTuple, "isTypeTuple"),
    isTypeU96: /* @__PURE__ */ __name(() => isTypeU96, "isTypeU96"),
    isTypeUint: /* @__PURE__ */ __name(() => isTypeUint, "isTypeUint"),
    isTypeUint256: /* @__PURE__ */ __name(() => isTypeUint256, "isTypeUint256"),
    tuple: /* @__PURE__ */ __name(() => tuple, "tuple"),
    uint256: /* @__PURE__ */ __name(() => uint256, "uint256"),
    uint512: /* @__PURE__ */ __name(() => uint512, "uint512")
  });
  function CairoFelt(it) {
    if (isBigInt(it) || Number.isInteger(it)) {
      return it.toString();
    }
    if (isString(it)) {
      if (isHex2(it)) {
        return BigInt(it).toString();
      }
      if (isText(it)) {
        if (!isShortString(it)) {
          throw new Error(
            `${it} is a long string > 31 chars. Please split it into an array of short strings.`
          );
        }
        return BigInt(encodeShortString(it)).toString();
      }
      if (isStringWholeNumber(it)) {
        return it;
      }
    }
    if (isBoolean(it)) {
      return `${+it}`;
    }
    throw new Error(`${it} can't be computed by felt()`);
  }
  __name(CairoFelt, "CairoFelt");
  var UINT_128_MAX = (1n << 128n) - 1n;
  var UINT_256_MAX = (1n << 256n) - 1n;
  var UINT_256_MIN = 0n;
  var UINT_256_LOW_MAX = 340282366920938463463374607431768211455n;
  var UINT_256_HIGH_MAX = 340282366920938463463374607431768211455n;
  var UINT_256_LOW_MIN = 0n;
  var UINT_256_HIGH_MIN = 0n;
  var CairoUint256 = class _CairoUint256 {
    static {
      __name(this, "_CairoUint256");
    }
    low;
    high;
    static abiSelector = "core::integer::u256";
    constructor(...arr) {
      if (typeof arr[0] === "object" && arr.length === 1 && "low" in arr[0] && "high" in arr[0]) {
        const props = _CairoUint256.validateProps(arr[0].low, arr[0].high);
        this.low = props.low;
        this.high = props.high;
      } else if (arr.length === 1) {
        const bigInt = _CairoUint256.validate(arr[0]);
        this.low = bigInt & UINT_128_MAX;
        this.high = bigInt >> 128n;
      } else if (arr.length === 2) {
        const props = _CairoUint256.validateProps(arr[0], arr[1]);
        this.low = props.low;
        this.high = props.high;
      } else {
        throw Error("Incorrect constructor parameters");
      }
    }
    /**
     * Validate if BigNumberish can be represented as Unit256
     */
    static validate(bigNumberish) {
      const bigInt = BigInt(bigNumberish);
      if (bigInt < UINT_256_MIN) throw Error("bigNumberish is smaller than UINT_256_MIN");
      if (bigInt > UINT_256_MAX) throw new Error("bigNumberish is bigger than UINT_256_MAX");
      return bigInt;
    }
    /**
     * Validate if low and high can be represented as Unit256
     */
    static validateProps(low, high) {
      const bigIntLow = BigInt(low);
      const bigIntHigh = BigInt(high);
      if (bigIntLow < UINT_256_LOW_MIN || bigIntLow > UINT_256_LOW_MAX) {
        throw new Error("low is out of range UINT_256_LOW_MIN - UINT_256_LOW_MAX");
      }
      if (bigIntHigh < UINT_256_HIGH_MIN || bigIntHigh > UINT_256_HIGH_MAX) {
        throw new Error("high is out of range UINT_256_HIGH_MIN - UINT_256_HIGH_MAX");
      }
      return { low: bigIntLow, high: bigIntHigh };
    }
    /**
     * Check if BigNumberish can be represented as Unit256
     */
    static is(bigNumberish) {
      try {
        _CairoUint256.validate(bigNumberish);
      } catch (error2) {
        return false;
      }
      return true;
    }
    /**
     * Check if provided abi type is this data type
     */
    static isAbiType(abiType) {
      return abiType === _CairoUint256.abiSelector;
    }
    /**
     * Return bigint representation
     */
    toBigInt() {
      return (this.high << 128n) + this.low;
    }
    /**
     * Return Uint256 structure with HexString props
     * {low: HexString, high: HexString}
     */
    toUint256HexString() {
      return {
        low: addHexPrefix(this.low.toString(16)),
        high: addHexPrefix(this.high.toString(16))
      };
    }
    /**
     * Return Uint256 structure with DecimalString props
     * {low: DecString, high: DecString}
     */
    toUint256DecimalString() {
      return {
        low: this.low.toString(10),
        high: this.high.toString(10)
      };
    }
    /**
     * Return api requests representation witch is felt array
     */
    toApiRequest() {
      return [CairoFelt(this.low), CairoFelt(this.high)];
    }
  };
  var UINT_512_MAX = (1n << 512n) - 1n;
  var UINT_512_MIN = 0n;
  var UINT_128_MIN = 0n;
  var CairoUint512 = class _CairoUint512 {
    static {
      __name(this, "_CairoUint512");
    }
    limb0;
    limb1;
    limb2;
    limb3;
    static abiSelector = "core::integer::u512";
    constructor(...arr) {
      if (typeof arr[0] === "object" && arr.length === 1 && "limb0" in arr[0] && "limb1" in arr[0] && "limb2" in arr[0] && "limb3" in arr[0]) {
        const props = _CairoUint512.validateProps(
          arr[0].limb0,
          arr[0].limb1,
          arr[0].limb2,
          arr[0].limb3
        );
        this.limb0 = props.limb0;
        this.limb1 = props.limb1;
        this.limb2 = props.limb2;
        this.limb3 = props.limb3;
      } else if (arr.length === 1) {
        const bigInt = _CairoUint512.validate(arr[0]);
        this.limb0 = bigInt & UINT_128_MAX;
        this.limb1 = (bigInt & UINT_128_MAX << 128n) >> 128n;
        this.limb2 = (bigInt & UINT_128_MAX << 256n) >> 256n;
        this.limb3 = bigInt >> 384n;
      } else if (arr.length === 4) {
        const props = _CairoUint512.validateProps(arr[0], arr[1], arr[2], arr[3]);
        this.limb0 = props.limb0;
        this.limb1 = props.limb1;
        this.limb2 = props.limb2;
        this.limb3 = props.limb3;
      } else {
        throw Error("Incorrect Uint512 constructor parameters");
      }
    }
    /**
     * Validate if BigNumberish can be represented as Uint512
     */
    static validate(bigNumberish) {
      const bigInt = BigInt(bigNumberish);
      if (bigInt < UINT_512_MIN) throw Error("bigNumberish is smaller than UINT_512_MIN.");
      if (bigInt > UINT_512_MAX) throw Error("bigNumberish is bigger than UINT_512_MAX.");
      return bigInt;
    }
    /**
     * Validate if limbs can be represented as Uint512
     */
    static validateProps(limb0, limb1, limb2, limb3) {
      const l0 = BigInt(limb0);
      const l1 = BigInt(limb1);
      const l2 = BigInt(limb2);
      const l3 = BigInt(limb3);
      [l0, l1, l2, l3].forEach((value, index) => {
        if (value < UINT_128_MIN || value > UINT_128_MAX) {
          throw Error(`limb${index} is not in the range of a u128 number`);
        }
      });
      return { limb0: l0, limb1: l1, limb2: l2, limb3: l3 };
    }
    /**
     * Check if BigNumberish can be represented as Uint512
     */
    static is(bigNumberish) {
      try {
        _CairoUint512.validate(bigNumberish);
      } catch (error2) {
        return false;
      }
      return true;
    }
    /**
     * Check if provided abi type is this data type
     */
    static isAbiType(abiType) {
      return abiType === _CairoUint512.abiSelector;
    }
    /**
     * Return bigint representation
     */
    toBigInt() {
      return (this.limb3 << 384n) + (this.limb2 << 256n) + (this.limb1 << 128n) + this.limb0;
    }
    /**
     * Return Uint512 structure with HexString props
     * limbx: HexString
     */
    toUint512HexString() {
      return {
        limb0: addHexPrefix(this.limb0.toString(16)),
        limb1: addHexPrefix(this.limb1.toString(16)),
        limb2: addHexPrefix(this.limb2.toString(16)),
        limb3: addHexPrefix(this.limb3.toString(16))
      };
    }
    /**
     * Return Uint512 structure with DecimalString props
     * limbx DecString
     */
    toUint512DecimalString() {
      return {
        limb0: this.limb0.toString(10),
        limb1: this.limb1.toString(10),
        limb2: this.limb2.toString(10),
        limb3: this.limb3.toString(10)
      };
    }
    /**
     * Return api requests representation witch is felt array
     */
    toApiRequest() {
      return [
        CairoFelt(this.limb0),
        CairoFelt(this.limb1),
        CairoFelt(this.limb2),
        CairoFelt(this.limb3)
      ];
    }
  };
  var isLen = /* @__PURE__ */ __name((name) => /_len$/.test(name), "isLen");
  var isTypeFelt = /* @__PURE__ */ __name((type) => type === "felt" || type === "core::felt252", "isTypeFelt");
  var isTypeArray = /* @__PURE__ */ __name((type) => /\*/.test(type) || type.startsWith("core::array::Array::") || type.startsWith("core::array::Span::"), "isTypeArray");
  var isTypeTuple = /* @__PURE__ */ __name((type) => /^\(.*\)$/i.test(type), "isTypeTuple");
  var isTypeNamedTuple = /* @__PURE__ */ __name((type) => /\(.*\)/i.test(type) && type.includes(":"), "isTypeNamedTuple");
  var isTypeStruct = /* @__PURE__ */ __name((type, structs) => type in structs, "isTypeStruct");
  var isTypeEnum = /* @__PURE__ */ __name((type, enums) => type in enums, "isTypeEnum");
  var isTypeOption = /* @__PURE__ */ __name((type) => type.startsWith("core::option::Option::"), "isTypeOption");
  var isTypeResult = /* @__PURE__ */ __name((type) => type.startsWith("core::result::Result::"), "isTypeResult");
  var isTypeUint = /* @__PURE__ */ __name((type) => Object.values(Uint).includes(type), "isTypeUint");
  var isTypeUint256 = /* @__PURE__ */ __name((type) => CairoUint256.isAbiType(type), "isTypeUint256");
  var isTypeLiteral = /* @__PURE__ */ __name((type) => Object.values(Literal).includes(type), "isTypeLiteral");
  var isTypeBool = /* @__PURE__ */ __name((type) => type === "core::bool", "isTypeBool");
  var isTypeContractAddress = /* @__PURE__ */ __name((type) => type === Literal.ContractAddress, "isTypeContractAddress");
  var isTypeEthAddress = /* @__PURE__ */ __name((type) => type === ETH_ADDRESS, "isTypeEthAddress");
  var isTypeBytes31 = /* @__PURE__ */ __name((type) => type === "core::bytes_31::bytes31", "isTypeBytes31");
  var isTypeByteArray = /* @__PURE__ */ __name((type) => type === "core::byte_array::ByteArray", "isTypeByteArray");
  var isTypeU96 = /* @__PURE__ */ __name((type) => type === "core::internal::bounded_int::BoundedInt::<0, 79228162514264337593543950335>", "isTypeU96");
  var isTypeSecp256k1Point = /* @__PURE__ */ __name((type) => type === Literal.Secp256k1Point, "isTypeSecp256k1Point");
  var isCairo1Type = /* @__PURE__ */ __name((type) => type.includes("::"), "isCairo1Type");
  var getArrayType = /* @__PURE__ */ __name((type) => {
    return isCairo1Type(type) ? type.substring(type.indexOf("<") + 1, type.lastIndexOf(">")) : type.replace("*", "");
  }, "getArrayType");
  function isCairo1Abi(abi) {
    const { cairo } = getAbiContractVersion(abi);
    if (cairo === void 0) {
      throw Error("Unable to determine Cairo version");
    }
    return cairo === "1";
  }
  __name(isCairo1Abi, "isCairo1Abi");
  function isTypeNonZero(type) {
    return type.startsWith(NON_ZERO_PREFIX);
  }
  __name(isTypeNonZero, "isTypeNonZero");
  function getAbiContractVersion(abi) {
    if (abi.find((it) => it.type === "interface")) {
      return { cairo: "1", compiler: "2" };
    }
    const testSubject = abi.find(
      (it) => (it.type === "function" || it.type === "constructor") && (it.inputs.length || it.outputs.length)
    );
    if (!testSubject) {
      return { cairo: void 0, compiler: void 0 };
    }
    const io = testSubject.inputs.length ? testSubject.inputs : testSubject.outputs;
    if (isCairo1Type(io[0].type)) {
      return { cairo: "1", compiler: "1" };
    }
    return { cairo: "0", compiler: "0" };
  }
  __name(getAbiContractVersion, "getAbiContractVersion");
  var uint256 = /* @__PURE__ */ __name((it) => {
    return new CairoUint256(it).toUint256DecimalString();
  }, "uint256");
  var uint512 = /* @__PURE__ */ __name((it) => {
    return new CairoUint512(it).toUint512DecimalString();
  }, "uint512");
  var tuple = /* @__PURE__ */ __name((...args) => ({ ...args }), "tuple");
  function felt(it) {
    return CairoFelt(it);
  }
  __name(felt, "felt");
  var CairoCustomEnum = class {
    static {
      __name(this, "CairoCustomEnum");
    }
    /**
     * direct readonly access to variants of the Cairo Custom Enum.
     * @returns a value of type any
     * @example
     * ```typescript
     * const successValue = myCairoEnum.variant.Success;
     */
    variant;
    /**
     * @param enumContent an object with the variants as keys and the content as value. Only one content shall be defined.
     */
    constructor(enumContent) {
      const variantsList = Object.values(enumContent);
      if (variantsList.length === 0) {
        throw new Error("This Enum must have at least 1 variant");
      }
      const nbActiveVariants = variantsList.filter((content) => !isUndefined(content)).length;
      if (nbActiveVariants !== 1) {
        throw new Error("This Enum must have exactly one active variant");
      }
      this.variant = enumContent;
    }
    /**
     *
     * @returns the content of the valid variant of a Cairo custom Enum.
     */
    unwrap() {
      const variants = Object.values(this.variant);
      return variants.find((item) => !isUndefined(item));
    }
    /**
     *
     * @returns the name of the valid variant of a Cairo custom Enum.
     */
    activeVariant() {
      const variants = Object.entries(this.variant);
      const activeVariant = variants.find((item) => !isUndefined(item[1]));
      return isUndefined(activeVariant) ? "" : activeVariant[0];
    }
  };
  var CairoOptionVariant = {
    Some: 0,
    None: 1
  };
  var CairoOption = class {
    static {
      __name(this, "CairoOption");
    }
    Some;
    None;
    constructor(variant, content) {
      if (!(variant in Object.values(CairoOptionVariant))) {
        throw new Error("Wrong variant! It should be CairoOptionVariant.Some or .None.");
      }
      if (variant === CairoOptionVariant.Some) {
        if (isUndefined(content)) {
          throw new Error(
            'The creation of a Cairo Option with "Some" variant needs a content as input.'
          );
        }
        this.Some = content;
        this.None = void 0;
      } else {
        this.Some = void 0;
        this.None = true;
      }
    }
    /**
     *
     * @returns the content of the valid variant of a Cairo custom Enum.
     *  If None, returns 'undefined'.
     */
    unwrap() {
      return this.None ? void 0 : this.Some;
    }
    /**
     *
     * @returns true if the valid variant is 'isSome'.
     */
    isSome() {
      return !isUndefined(this.Some);
    }
    /**
     *
     * @returns true if the valid variant is 'isNone'.
     */
    isNone() {
      return this.None === true;
    }
  };
  var CairoResultVariant = {
    Ok: 0,
    Err: 1
  };
  var CairoResult = class {
    static {
      __name(this, "CairoResult");
    }
    Ok;
    Err;
    constructor(variant, resultContent) {
      if (!(variant in Object.values(CairoResultVariant))) {
        throw new Error("Wrong variant! It should be CairoResultVariant.Ok or .Err.");
      }
      if (variant === CairoResultVariant.Ok) {
        this.Ok = resultContent;
        this.Err = void 0;
      } else {
        this.Ok = void 0;
        this.Err = resultContent;
      }
    }
    /**
     *
     * @returns the content of the valid variant of a Cairo Result.
     */
    unwrap() {
      if (!isUndefined(this.Ok)) {
        return this.Ok;
      }
      if (!isUndefined(this.Err)) {
        return this.Err;
      }
      throw new Error("Both Result.Ok and .Err are undefined. Not authorized.");
    }
    /**
     *
     * @returns true if the valid variant is 'Ok'.
     */
    isOk() {
      return !isUndefined(this.Ok);
    }
    /**
     *
     * @returns true if the valid variant is 'isErr'.
     */
    isErr() {
      return !isUndefined(this.Err);
    }
  };
  var guard = {
    /**
     * Checks if the data is a BigInt (BN) and throws an error if not.
     *
     * @param {Record<string, any>} data - The data object containing the key to check.
     * @param {Record<string, any>} type - The type definition object.
     * @param {string} key - The key in the data object to check.
     * @throws {Error} If the data type does not match the expected BigInt (BN) type.
     */
    isBN: /* @__PURE__ */ __name((data, type, key) => {
      if (!isBigInt(data[key]))
        throw new Error(
          `Data and formatter mismatch on ${key}:${type[key]}, expected response data ${key}:${data[key]} to be BN instead it is ${typeof data[key]}`
        );
    }, "isBN"),
    /**
     * Throws an error for unhandled formatter types.
     *
     * @param {Record<string, any>} data - The data object containing the key.
     * @param {Record<string, any>} type - The type definition object.
     * @param {string} key - The key in the data object to check.
     * @throws {Error} If the formatter encounters an unknown type.
     */
    unknown: /* @__PURE__ */ __name((data, type, key) => {
      throw new Error(`Unhandled formatter type on ${key}:${type[key]} for data ${key}:${data[key]}`);
    }, "unknown")
  };
  function formatter(data, type, sameType) {
    return Object.entries(data).reduce(
      (acc, [key, value]) => {
        const elType = sameType ?? type[key];
        if (!(key in type) && !sameType) {
          acc[key] = value;
          return acc;
        }
        if (elType === "string") {
          if (Array.isArray(data[key])) {
            const arrayStr = formatter(
              data[key],
              data[key].map((_) => elType)
            );
            acc[key] = Object.values(arrayStr).join("");
            return acc;
          }
          guard.isBN(data, type, key);
          acc[key] = decodeShortString(value);
          return acc;
        }
        if (elType === "number") {
          guard.isBN(data, type, key);
          acc[key] = Number(value);
          return acc;
        }
        if (typeof elType === "function") {
          acc[key] = elType(value);
          return acc;
        }
        if (Array.isArray(elType)) {
          const arrayObj = formatter(data[key], elType, elType[0]);
          acc[key] = Object.values(arrayObj);
          return acc;
        }
        if (isObject2(elType)) {
          acc[key] = formatter(data[key], elType);
          return acc;
        }
        guard.unknown(data, type, key);
        return acc;
      },
      {}
    );
  }
  __name(formatter, "formatter");
  var AbiParser1 = class {
    static {
      __name(this, "AbiParser1");
    }
    abi;
    constructor(abi) {
      this.abi = abi;
    }
    /**
     * abi method inputs length without '_len' inputs
     * cairo 0 reducer
     * @param abiMethod FunctionAbi
     * @returns number
     */
    methodInputsLength(abiMethod) {
      return abiMethod.inputs.reduce((acc, input) => !isLen(input.name) ? acc + 1 : acc, 0);
    }
    /**
     * get method definition from abi
     * @param name string
     * @returns FunctionAbi | undefined
     */
    getMethod(name) {
      return this.abi.find((it) => it.name === name);
    }
    /**
     * Get Abi in legacy format
     * @returns Abi
     */
    getLegacyFormat() {
      return this.abi;
    }
  };
  var AbiParser2 = class {
    static {
      __name(this, "AbiParser2");
    }
    abi;
    constructor(abi) {
      this.abi = abi;
    }
    /**
     * abi method inputs length
     * @param abiMethod FunctionAbi
     * @returns number
     */
    methodInputsLength(abiMethod) {
      return abiMethod.inputs.length;
    }
    /**
     * get method definition from abi
     * @param name string
     * @returns FunctionAbi | undefined
     */
    getMethod(name) {
      const intf = this.abi.find(
        (it) => it.type === "interface"
      );
      return intf?.items?.find((it) => it.name === name);
    }
    /**
     * Get Abi in legacy format
     * @returns Abi
     */
    getLegacyFormat() {
      return this.abi.flatMap((it) => {
        return it.type === "interface" ? it.items : it;
      });
    }
  };
  function createAbiParser(abi) {
    const version = getAbiVersion(abi);
    if (version === 0 || version === 1) {
      return new AbiParser1(abi);
    }
    if (version === 2) {
      return new AbiParser2(abi);
    }
    throw Error(`Unsupported ABI version ${version}`);
  }
  __name(createAbiParser, "createAbiParser");
  function getAbiVersion(abi) {
    if (abi.find((it) => it.type === "interface")) return 2;
    if (isCairo1Abi(abi)) return 1;
    return 0;
  }
  __name(getAbiVersion, "getAbiVersion");
  function isNoConstructorValid(method, argsCalldata, abiMethod) {
    return method === "constructor" && !abiMethod && !argsCalldata.length;
  }
  __name(isNoConstructorValid, "isNoConstructorValid");
  function parseNamedTuple(namedTuple) {
    const name = namedTuple.substring(0, namedTuple.indexOf(":"));
    const type = namedTuple.substring(name.length + ":".length);
    return { name, type };
  }
  __name(parseNamedTuple, "parseNamedTuple");
  function parseSubTuple(s) {
    if (!s.includes("(")) return { subTuple: [], result: s };
    const subTuple = [];
    let result = "";
    let i = 0;
    while (i < s.length) {
      if (s[i] === "(") {
        let counter = 1;
        const lBracket = i;
        i++;
        while (counter) {
          if (s[i] === ")") counter--;
          if (s[i] === "(") counter++;
          i++;
        }
        subTuple.push(s.substring(lBracket, i));
        result += " ";
        i--;
      } else {
        result += s[i];
      }
      i++;
    }
    return {
      subTuple,
      result
    };
  }
  __name(parseSubTuple, "parseSubTuple");
  function extractCairo0Tuple(type) {
    const cleanType = type.replace(/\s/g, "").slice(1, -1);
    const { subTuple, result } = parseSubTuple(cleanType);
    let recomposed = result.split(",").map((it) => {
      return subTuple.length ? it.replace(" ", subTuple.shift()) : it;
    });
    if (isTypeNamedTuple(type)) {
      recomposed = recomposed.reduce((acc, it) => {
        return acc.concat(parseNamedTuple(it));
      }, []);
    }
    return recomposed;
  }
  __name(extractCairo0Tuple, "extractCairo0Tuple");
  function getClosureOffset(input, open, close) {
    for (let i = 0, counter = 0; i < input.length; i++) {
      if (input[i] === open) {
        counter++;
      } else if (input[i] === close && --counter === 0) {
        return i;
      }
    }
    return Number.POSITIVE_INFINITY;
  }
  __name(getClosureOffset, "getClosureOffset");
  function extractCairo1Tuple(type) {
    const input = type.slice(1, -1);
    const result = [];
    let currentIndex = 0;
    let limitIndex;
    while (currentIndex < input.length) {
      switch (true) {
        // Tuple
        case input[currentIndex] === "(": {
          limitIndex = currentIndex + getClosureOffset(input.slice(currentIndex), "(", ")") + 1;
          break;
        }
        case (input.startsWith("core::result::Result::<", currentIndex) || input.startsWith("core::array::Array::<", currentIndex) || input.startsWith("core::option::Option::<", currentIndex)): {
          limitIndex = currentIndex + getClosureOffset(input.slice(currentIndex), "<", ">") + 1;
          break;
        }
        default: {
          const commaIndex = input.indexOf(",", currentIndex);
          limitIndex = commaIndex !== -1 ? commaIndex : Number.POSITIVE_INFINITY;
        }
      }
      result.push(input.slice(currentIndex, limitIndex));
      currentIndex = limitIndex + 2;
    }
    return result;
  }
  __name(extractCairo1Tuple, "extractCairo1Tuple");
  function extractTupleMemberTypes(type) {
    return isCairo1Type(type) ? extractCairo1Tuple(type) : extractCairo0Tuple(type);
  }
  __name(extractTupleMemberTypes, "extractTupleMemberTypes");
  var CairoFixedArray = class _CairoFixedArray {
    static {
      __name(this, "_CairoFixedArray");
    }
    /**
     * JS array representing a Cairo fixed array.
     */
    content;
    /**
     * Cairo fixed array type.
     */
    arrayType;
    /**
     * Create an instance representing a Cairo fixed Array.
     * @param {any[]} content JS array representing a Cairo fixed array.
     * @param {string} arrayType Cairo fixed array type.
     */
    constructor(content, arrayType) {
      assert(
        _CairoFixedArray.isTypeFixedArray(arrayType),
        `The type ${arrayType} is not a Cairo fixed array. Needs [type; length].`
      );
      try {
        _CairoFixedArray.getFixedArrayType(arrayType);
      } catch {
        throw new Error(
          `The type ${arrayType} do not includes any content type. Needs [type; length].`
        );
      }
      try {
        _CairoFixedArray.getFixedArraySize(arrayType);
      } catch {
        throw new Error(
          `The type ${arrayType} type do not includes any length. Needs [type; length].`
        );
      }
      assert(
        _CairoFixedArray.getFixedArraySize(arrayType) === content.length,
        `The ABI type ${arrayType} is expecting ${_CairoFixedArray.getFixedArraySize(arrayType)} items. ${content.length} items provided.`
      );
      this.content = content;
      this.arrayType = arrayType;
    }
    /**
     * Retrieves the array size from the given type string representing a Cairo fixed array.
     * @param {string} type - The Cairo fixed array type.
     * @returns {number} The array size.
     * @example
     * ```typescript
     * const result = CairoFixedArray.getFixedArraySize("[core::integer::u32; 8]");
     * // result = 8
     * ```
     */
    static getFixedArraySize(type) {
      const matchArray = type.match(/(?<=; )\d+(?=\])/);
      if (matchArray === null)
        throw new Error(`ABI type ${type} do not includes a valid number after ';' character.`);
      return Number(matchArray[0]);
    }
    /**
     * Retrieves the Cairo fixed array size from the CairoFixedArray instance.
     * @returns {number} The fixed array size.
     * @example
     * ```typescript
     * const fArray = new CairoFixedArray([10,20,30], "[core::integer::u32; 3]");
     * const result = fArray.getFixedArraySize();
     * // result = 3
     * ```
     */
    getFixedArraySize() {
      return _CairoFixedArray.getFixedArraySize(this.arrayType);
    }
    /**
     * Retrieve the Cairo content type from a Cairo fixed array type.
     * @param {string} type - The type string.
     * @returns {string} The fixed-array type.
     * @example
     * ```typescript
     * const result = CairoFixedArray.getFixedArrayType("[core::integer::u32; 8]");
     * // result = "core::integer::u32"
     * ```
     */
    static getFixedArrayType = /* @__PURE__ */ __name((type) => {
      const matchArray = type.match(/(?<=\[).+(?=;)/);
      if (matchArray === null)
        throw new Error(`ABI type ${type} do not includes a valid type of data.`);
      return matchArray[0];
    }, "getFixedArrayType");
    /**
     * Retrieve the Cairo content type of the Cairo fixed array.
     * @returns {string} The fixed-array content type.
     * @example
     * ```typescript
     * const fArray = new CairoFixedArray([10,20,30], "[core::integer::u32; 3]");
     * const result = fArray.getFixedArrayType();
     * // result = "core::integer::u32"
     * ```
     */
    getFixedArrayType() {
      return _CairoFixedArray.getFixedArrayType(this.arrayType);
    }
    /**
     * Create an object from a Cairo fixed array.
     * Be sure to have an array length conform to the ABI.
     * To be used with CallData.compile().
     * @param {Array<any>} input JS array representing a Cairo fixed array.
     * @returns {Object} a specific struct representing a fixed Array.
     * @example
     * ```typescript
     * const result = CairoFixedArray.compile([10,20,30]);
     * // result = { '0': 10, '1': 20, '2': 30 }
     * ```
     */
    static compile(input) {
      return input.reduce((acc, item, idx) => {
        acc[idx] = item;
        return acc;
      }, {});
    }
    /**
     * Generate an object from the Cairo fixed array instance.
     * To be used with CallData.compile().
     * @returns a specific struct representing a fixed array.
     * @example
     * ```typescript
     * const fArray = new CairoFixedArray([10,20,30], "[core::integer::u32; 3]");
     * const result = fArray.compile();
     * // result = { '0': 10, '1': 20, '2': 30 }
     * ```
     */
    compile() {
      return _CairoFixedArray.compile(this.content);
    }
    /**
     * Checks if the given Cairo type is a fixed-array type.
     *
     * @param {string} type - The type to check.
     * @returns - `true` if the type is a fixed array type, `false` otherwise.
     * ```typescript
     * const result = CairoFixedArray.isTypeFixedArray("[core::integer::u32; 8]");
     * // result = true
     */
    static isTypeFixedArray(type) {
      return /^\[.*;\s.*\]$/.test(type) && /(?<=\[).+(?=;)/.test(type) && /(?<=; )\d+(?=\])/.test(type);
    }
  };
  function errorU256(key) {
    return Error(
      `Your object includes the property : ${key}, containing an Uint256 object without the 'low' and 'high' keys.`
    );
  }
  __name(errorU256, "errorU256");
  function errorU512(key) {
    return Error(
      `Your object includes the property : ${key}, containing an Uint512 object without the 'limb0' to 'limb3' keys.`
    );
  }
  __name(errorU512, "errorU512");
  function orderPropsByAbi(unorderedObject, abiOfObject, structs, enums) {
    const orderInput = /* @__PURE__ */ __name((unorderedItem, abiType) => {
      if (CairoFixedArray.isTypeFixedArray(abiType)) {
        return orderFixedArray(unorderedItem, abiType);
      }
      if (isTypeArray(abiType)) {
        return orderArray(unorderedItem, abiType);
      }
      if (isTypeEnum(abiType, enums)) {
        const abiObj = enums[abiType];
        return orderEnum(unorderedItem, abiObj);
      }
      if (isTypeTuple(abiType)) {
        return orderTuple(unorderedItem, abiType);
      }
      if (isTypeEthAddress(abiType)) {
        return unorderedItem;
      }
      if (isTypeNonZero(abiType)) {
        return unorderedItem;
      }
      if (isTypeByteArray(abiType)) {
        return unorderedItem;
      }
      if (isTypeU96(abiType)) {
        return unorderedItem;
      }
      if (isTypeSecp256k1Point(abiType)) {
        return unorderedItem;
      }
      if (CairoUint256.isAbiType(abiType)) {
        const u256 = unorderedItem;
        if (typeof u256 !== "object") {
          return u256;
        }
        if (!("low" in u256 && "high" in u256)) {
          throw errorU256(abiType);
        }
        return { low: u256.low, high: u256.high };
      }
      if (CairoUint512.isAbiType(abiType)) {
        const u512 = unorderedItem;
        if (typeof u512 !== "object") {
          return u512;
        }
        if (!["limb0", "limb1", "limb2", "limb3"].every((key) => key in u512)) {
          throw errorU512(abiType);
        }
        return { limb0: u512.limb0, limb1: u512.limb1, limb2: u512.limb2, limb3: u512.limb3 };
      }
      if (isTypeStruct(abiType, structs)) {
        const abiOfStruct = structs[abiType].members;
        return orderStruct(unorderedItem, abiOfStruct);
      }
      return unorderedItem;
    }, "orderInput");
    const orderStruct = /* @__PURE__ */ __name((unorderedObject2, abiObject) => {
      const orderedObject2 = abiObject.reduce((orderedObject, abiParam) => {
        const setProperty = /* @__PURE__ */ __name((value) => Object.defineProperty(orderedObject, abiParam.name, {
          enumerable: true,
          value: value ?? unorderedObject2[abiParam.name]
        }), "setProperty");
        if (unorderedObject2[abiParam.name] === "undefined") {
          if (isCairo1Type(abiParam.type) || !isLen(abiParam.name)) {
            throw Error(`Your object needs a property with key : ${abiParam.name} .`);
          }
        }
        setProperty(orderInput(unorderedObject2[abiParam.name], abiParam.type));
        return orderedObject;
      }, {});
      return orderedObject2;
    }, "orderStruct");
    function orderArray(myArray, abiParam) {
      const typeInArray = getArrayType(abiParam);
      if (isString(myArray)) {
        return myArray;
      }
      return myArray.map((myElem) => orderInput(myElem, typeInArray));
    }
    __name(orderArray, "orderArray");
    function orderFixedArray(input, abiParam) {
      const typeInFixedArray = CairoFixedArray.getFixedArrayType(abiParam);
      const arraySize = CairoFixedArray.getFixedArraySize(abiParam);
      if (Array.isArray(input)) {
        if (arraySize !== input.length) {
          throw new Error(
            `ABI type ${abiParam}: array provided do not includes  ${arraySize} items. ${input.length} items provided.`
          );
        }
        return input.map((myElem) => orderInput(myElem, typeInFixedArray));
      }
      if (arraySize !== Object.keys(input).length) {
        throw new Error(
          `ABI type ${abiParam}: object provided do not includes  ${arraySize} properties. ${Object.keys(input).length} items provided.`
        );
      }
      return orderInput(input, typeInFixedArray);
    }
    __name(orderFixedArray, "orderFixedArray");
    function orderTuple(unorderedObject2, abiParam) {
      const typeList = extractTupleMemberTypes(abiParam);
      const orderedObject2 = typeList.reduce((orderedObject, abiTypeCairoX, index) => {
        const myObjKeys = Object.keys(unorderedObject2);
        const setProperty = /* @__PURE__ */ __name((value) => Object.defineProperty(orderedObject, index.toString(), {
          enumerable: true,
          value: value ?? unorderedObject2[myObjKeys[index]]
        }), "setProperty");
        const abiType = abiTypeCairoX?.type ? abiTypeCairoX.type : abiTypeCairoX;
        setProperty(orderInput(unorderedObject2[myObjKeys[index]], abiType));
        return orderedObject;
      }, {});
      return orderedObject2;
    }
    __name(orderTuple, "orderTuple");
    const orderEnum = /* @__PURE__ */ __name((unorderedObject2, abiObject) => {
      if (isTypeResult(abiObject.name)) {
        const unorderedResult = unorderedObject2;
        const resultOkType = abiObject.name.substring(
          abiObject.name.indexOf("<") + 1,
          abiObject.name.lastIndexOf(",")
        );
        const resultErrType = abiObject.name.substring(
          abiObject.name.indexOf(",") + 1,
          abiObject.name.lastIndexOf(">")
        );
        if (unorderedResult.isOk()) {
          return new CairoResult(
            CairoResultVariant.Ok,
            orderInput(unorderedObject2.unwrap(), resultOkType)
          );
        }
        return new CairoResult(
          CairoResultVariant.Err,
          orderInput(unorderedObject2.unwrap(), resultErrType)
        );
      }
      if (isTypeOption(abiObject.name)) {
        const unorderedOption = unorderedObject2;
        const resultSomeType = abiObject.name.substring(
          abiObject.name.indexOf("<") + 1,
          abiObject.name.lastIndexOf(">")
        );
        if (unorderedOption.isSome()) {
          return new CairoOption(
            CairoOptionVariant.Some,
            orderInput(unorderedOption.unwrap(), resultSomeType)
          );
        }
        return new CairoOption(CairoOptionVariant.None, {});
      }
      const unorderedCustomEnum = unorderedObject2;
      const variants = Object.entries(unorderedCustomEnum.variant);
      const newEntries = variants.map((variant) => {
        if (isUndefined(variant[1])) {
          return variant;
        }
        const variantType = abiObject.type.substring(
          abiObject.type.lastIndexOf("<") + 1,
          abiObject.type.lastIndexOf(">")
        );
        if (variantType === "()") {
          return variant;
        }
        return [variant[0], orderInput(unorderedCustomEnum.unwrap(), variantType)];
      });
      return new CairoCustomEnum(Object.fromEntries(newEntries));
    }, "orderEnum");
    const finalOrderedObject = abiOfObject.reduce((orderedObject, abiParam) => {
      const setProperty = /* @__PURE__ */ __name((value) => Object.defineProperty(orderedObject, abiParam.name, {
        enumerable: true,
        value
      }), "setProperty");
      if (isLen(abiParam.name) && !isCairo1Type(abiParam.type)) {
        return orderedObject;
      }
      setProperty(orderInput(unorderedObject[abiParam.name], abiParam.type));
      return orderedObject;
    }, {});
    return finalOrderedObject;
  }
  __name(orderPropsByAbi, "orderPropsByAbi");
  function parseBaseTypes(type, val) {
    switch (true) {
      case CairoUint256.isAbiType(type):
        return new CairoUint256(val).toApiRequest();
      case CairoUint512.isAbiType(type):
        return new CairoUint512(val).toApiRequest();
      case isTypeBytes31(type):
        return encodeShortString(val.toString());
      case isTypeSecp256k1Point(type): {
        const pubKeyETH = removeHexPrefix(toHex(val)).padStart(128, "0");
        const pubKeyETHy = uint256(addHexPrefix(pubKeyETH.slice(-64)));
        const pubKeyETHx = uint256(addHexPrefix(pubKeyETH.slice(0, -64)));
        return [
          felt(pubKeyETHx.low),
          felt(pubKeyETHx.high),
          felt(pubKeyETHy.low),
          felt(pubKeyETHy.high)
        ];
      }
      default:
        return felt(val);
    }
  }
  __name(parseBaseTypes, "parseBaseTypes");
  function parseTuple(element, typeStr) {
    const memberTypes = extractTupleMemberTypes(typeStr);
    const elements = Object.values(element);
    if (elements.length !== memberTypes.length) {
      throw Error(
        `ParseTuple: provided and expected abi tuple size do not match.
      provided: ${elements}
      expected: ${memberTypes}`
      );
    }
    return memberTypes.map((it, dx) => {
      return {
        element: elements[dx],
        type: it.type ?? it
      };
    });
  }
  __name(parseTuple, "parseTuple");
  function parseByteArray(element) {
    const myByteArray = byteArrayFromString(element);
    return [
      myByteArray.data.length.toString(),
      ...myByteArray.data.map((bn) => bn.toString()),
      myByteArray.pending_word.toString(),
      myByteArray.pending_word_len.toString()
    ];
  }
  __name(parseByteArray, "parseByteArray");
  function parseCalldataValue(element, type, structs, enums) {
    if (element === void 0) {
      throw Error(`Missing parameter for type ${type}`);
    }
    if (CairoFixedArray.isTypeFixedArray(type)) {
      const arrayType = CairoFixedArray.getFixedArrayType(type);
      let values = [];
      if (Array.isArray(element)) {
        const array = new CairoFixedArray(element, type);
        values = array.content;
      } else if (typeof element === "object") {
        values = Object.values(element);
        assert(
          values.length === CairoFixedArray.getFixedArraySize(type),
          `ABI type ${type}: object provided do not includes  ${CairoFixedArray.getFixedArraySize(type)} items. ${values.length} items provided.`
        );
      } else {
        throw new Error(`ABI type ${type}: not an Array representing a cairo.fixedArray() provided.`);
      }
      return values.reduce((acc, it) => {
        return acc.concat(parseCalldataValue(it, arrayType, structs, enums));
      }, []);
    }
    if (Array.isArray(element)) {
      const result = [];
      result.push(felt(element.length));
      const arrayType = getArrayType(type);
      return element.reduce((acc, it) => {
        return acc.concat(parseCalldataValue(it, arrayType, structs, enums));
      }, result);
    }
    if (structs[type] && structs[type].members.length) {
      if (CairoUint256.isAbiType(type)) {
        return new CairoUint256(element).toApiRequest();
      }
      if (CairoUint512.isAbiType(type)) {
        return new CairoUint512(element).toApiRequest();
      }
      if (isTypeEthAddress(type)) return parseBaseTypes(type, element);
      if (isTypeByteArray(type)) return parseByteArray(element);
      const { members } = structs[type];
      const subElement = element;
      return members.reduce((acc, it) => {
        return acc.concat(parseCalldataValue(subElement[it.name], it.type, structs, enums));
      }, []);
    }
    if (isTypeTuple(type)) {
      const tupled = parseTuple(element, type);
      return tupled.reduce((acc, it) => {
        const parsedData = parseCalldataValue(it.element, it.type, structs, enums);
        return acc.concat(parsedData);
      }, []);
    }
    if (CairoUint256.isAbiType(type)) {
      return new CairoUint256(element).toApiRequest();
    }
    if (CairoUint512.isAbiType(type)) {
      return new CairoUint512(element).toApiRequest();
    }
    if (isTypeEnum(type, enums)) {
      const { variants } = enums[type];
      if (isTypeOption(type)) {
        const myOption = element;
        if (myOption.isSome()) {
          const listTypeVariant2 = variants.find((variant) => variant.name === "Some");
          if (isUndefined(listTypeVariant2)) {
            throw Error(`Error in abi : Option has no 'Some' variant.`);
          }
          const typeVariantSome = listTypeVariant2.type;
          if (typeVariantSome === "()") {
            return CairoOptionVariant.Some.toString();
          }
          const parsedParameter2 = parseCalldataValue(
            myOption.unwrap(),
            typeVariantSome,
            structs,
            enums
          );
          if (Array.isArray(parsedParameter2)) {
            return [CairoOptionVariant.Some.toString(), ...parsedParameter2];
          }
          return [CairoOptionVariant.Some.toString(), parsedParameter2];
        }
        return CairoOptionVariant.None.toString();
      }
      if (isTypeResult(type)) {
        const myResult = element;
        if (myResult.isOk()) {
          const listTypeVariant3 = variants.find((variant) => variant.name === "Ok");
          if (isUndefined(listTypeVariant3)) {
            throw Error(`Error in abi : Result has no 'Ok' variant.`);
          }
          const typeVariantOk = listTypeVariant3.type;
          if (typeVariantOk === "()") {
            return CairoResultVariant.Ok.toString();
          }
          const parsedParameter3 = parseCalldataValue(
            myResult.unwrap(),
            typeVariantOk,
            structs,
            enums
          );
          if (Array.isArray(parsedParameter3)) {
            return [CairoResultVariant.Ok.toString(), ...parsedParameter3];
          }
          return [CairoResultVariant.Ok.toString(), parsedParameter3];
        }
        const listTypeVariant2 = variants.find((variant) => variant.name === "Err");
        if (isUndefined(listTypeVariant2)) {
          throw Error(`Error in abi : Result has no 'Err' variant.`);
        }
        const typeVariantErr = listTypeVariant2.type;
        if (typeVariantErr === "()") {
          return CairoResultVariant.Err.toString();
        }
        const parsedParameter2 = parseCalldataValue(myResult.unwrap(), typeVariantErr, structs, enums);
        if (Array.isArray(parsedParameter2)) {
          return [CairoResultVariant.Err.toString(), ...parsedParameter2];
        }
        return [CairoResultVariant.Err.toString(), parsedParameter2];
      }
      const myEnum = element;
      const activeVariant = myEnum.activeVariant();
      const listTypeVariant = variants.find((variant) => variant.name === activeVariant);
      if (isUndefined(listTypeVariant)) {
        throw Error(`Not find in abi : Enum has no '${activeVariant}' variant.`);
      }
      const typeActiveVariant = listTypeVariant.type;
      const numActiveVariant = variants.findIndex((variant) => variant.name === activeVariant);
      if (typeActiveVariant === "()") {
        return numActiveVariant.toString();
      }
      const parsedParameter = parseCalldataValue(myEnum.unwrap(), typeActiveVariant, structs, enums);
      if (Array.isArray(parsedParameter)) {
        return [numActiveVariant.toString(), ...parsedParameter];
      }
      return [numActiveVariant.toString(), parsedParameter];
    }
    if (isTypeNonZero(type)) {
      return parseBaseTypes(getArrayType(type), element);
    }
    if (typeof element === "object") {
      throw Error(`Parameter ${element} do not align with abi parameter ${type}`);
    }
    return parseBaseTypes(type, element);
  }
  __name(parseCalldataValue, "parseCalldataValue");
  function parseCalldataField(argsIterator, input, structs, enums) {
    const { name, type } = input;
    let { value } = argsIterator.next();
    switch (true) {
      // Fixed array
      case CairoFixedArray.isTypeFixedArray(type):
        if (!Array.isArray(value) && !(typeof value === "object")) {
          throw Error(`ABI expected parameter ${name} to be an array or an object, got ${value}`);
        }
        return parseCalldataValue(value, input.type, structs, enums);
      // Normal Array
      case isTypeArray(type):
        if (!Array.isArray(value) && !isText(value)) {
          throw Error(`ABI expected parameter ${name} to be array or long string, got ${value}`);
        }
        if (isString(value)) {
          value = splitLongString(value);
        }
        return parseCalldataValue(value, input.type, structs, enums);
      case isTypeNonZero(type):
        return parseBaseTypes(getArrayType(type), value);
      case isTypeEthAddress(type):
        return parseBaseTypes(type, value);
      // Struct or Tuple
      case (isTypeStruct(type, structs) || isTypeTuple(type) || CairoUint256.isAbiType(type)):
        return parseCalldataValue(value, type, structs, enums);
      // Enums
      case isTypeEnum(type, enums):
        return parseCalldataValue(
          value,
          type,
          structs,
          enums
        );
      // Felt or unhandled
      default:
        return parseBaseTypes(type, value);
    }
  }
  __name(parseCalldataField, "parseCalldataField");
  function parseBaseTypes2(type, it) {
    let temp;
    switch (true) {
      case isTypeBool(type):
        temp = it.next().value;
        return Boolean(BigInt(temp));
      case CairoUint256.isAbiType(type):
        const low = it.next().value;
        const high = it.next().value;
        return new CairoUint256(low, high).toBigInt();
      case CairoUint512.isAbiType(type):
        const limb0 = it.next().value;
        const limb1 = it.next().value;
        const limb2 = it.next().value;
        const limb3 = it.next().value;
        return new CairoUint512(limb0, limb1, limb2, limb3).toBigInt();
      case isTypeEthAddress(type):
        temp = it.next().value;
        return BigInt(temp);
      case isTypeBytes31(type):
        temp = it.next().value;
        return decodeShortString(temp);
      case isTypeSecp256k1Point(type):
        const xLow = removeHexPrefix(it.next().value).padStart(32, "0");
        const xHigh = removeHexPrefix(it.next().value).padStart(32, "0");
        const yLow = removeHexPrefix(it.next().value).padStart(32, "0");
        const yHigh = removeHexPrefix(it.next().value).padStart(32, "0");
        const pubK = BigInt(addHexPrefix(xHigh + xLow + yHigh + yLow));
        return pubK;
      default:
        temp = it.next().value;
        return BigInt(temp);
    }
  }
  __name(parseBaseTypes2, "parseBaseTypes2");
  function parseResponseValue(responseIterator, element, structs, enums) {
    if (element.type === "()") {
      return {};
    }
    if (CairoUint256.isAbiType(element.type)) {
      const low = responseIterator.next().value;
      const high = responseIterator.next().value;
      return new CairoUint256(low, high).toBigInt();
    }
    if (CairoUint512.isAbiType(element.type)) {
      const limb0 = responseIterator.next().value;
      const limb1 = responseIterator.next().value;
      const limb2 = responseIterator.next().value;
      const limb3 = responseIterator.next().value;
      return new CairoUint512(limb0, limb1, limb2, limb3).toBigInt();
    }
    if (isTypeByteArray(element.type)) {
      const parsedBytes31Arr = [];
      const bytes31ArrLen = BigInt(responseIterator.next().value);
      while (parsedBytes31Arr.length < bytes31ArrLen) {
        parsedBytes31Arr.push(toHex(responseIterator.next().value));
      }
      const pending_word = toHex(responseIterator.next().value);
      const pending_word_len = BigInt(responseIterator.next().value);
      const myByteArray = {
        data: parsedBytes31Arr,
        pending_word,
        pending_word_len
      };
      return stringFromByteArray(myByteArray);
    }
    if (CairoFixedArray.isTypeFixedArray(element.type)) {
      const parsedDataArr = [];
      const el = { name: "", type: CairoFixedArray.getFixedArrayType(element.type) };
      const arraySize = CairoFixedArray.getFixedArraySize(element.type);
      while (parsedDataArr.length < arraySize) {
        parsedDataArr.push(parseResponseValue(responseIterator, el, structs, enums));
      }
      return parsedDataArr;
    }
    if (isTypeArray(element.type)) {
      const parsedDataArr = [];
      const el = { name: "", type: getArrayType(element.type) };
      const len = BigInt(responseIterator.next().value);
      while (parsedDataArr.length < len) {
        parsedDataArr.push(parseResponseValue(responseIterator, el, structs, enums));
      }
      return parsedDataArr;
    }
    if (isTypeNonZero(element.type)) {
      const el = { name: "", type: getArrayType(element.type) };
      return parseResponseValue(responseIterator, el, structs, enums);
    }
    if (structs && element.type in structs && structs[element.type]) {
      if (isTypeEthAddress(element.type)) {
        return parseBaseTypes2(element.type, responseIterator);
      }
      return structs[element.type].members.reduce((acc, el) => {
        acc[el.name] = parseResponseValue(responseIterator, el, structs, enums);
        return acc;
      }, {});
    }
    if (enums && element.type in enums && enums[element.type]) {
      const variantNum = Number(responseIterator.next().value);
      const rawEnum = enums[element.type].variants.reduce((acc, variant, num) => {
        if (num === variantNum) {
          acc[variant.name] = parseResponseValue(
            responseIterator,
            { name: "", type: variant.type },
            structs,
            enums
          );
          return acc;
        }
        acc[variant.name] = void 0;
        return acc;
      }, {});
      if (element.type.startsWith("core::option::Option")) {
        const content = variantNum === CairoOptionVariant.Some ? rawEnum.Some : void 0;
        return new CairoOption(variantNum, content);
      }
      if (element.type.startsWith("core::result::Result")) {
        let content;
        if (variantNum === CairoResultVariant.Ok) {
          content = rawEnum.Ok;
        } else {
          content = rawEnum.Err;
        }
        return new CairoResult(variantNum, content);
      }
      const customEnum = new CairoCustomEnum(rawEnum);
      return customEnum;
    }
    if (isTypeTuple(element.type)) {
      const memberTypes = extractTupleMemberTypes(element.type);
      return memberTypes.reduce((acc, it, idx) => {
        const name = it?.name ? it.name : idx;
        const type = it?.type ? it.type : it;
        const el = { name, type };
        acc[name] = parseResponseValue(responseIterator, el, structs, enums);
        return acc;
      }, {});
    }
    if (isTypeArray(element.type)) {
      const parsedDataArr = [];
      const el = { name: "", type: getArrayType(element.type) };
      const len = BigInt(responseIterator.next().value);
      while (parsedDataArr.length < len) {
        parsedDataArr.push(parseResponseValue(responseIterator, el, structs, enums));
      }
      return parsedDataArr;
    }
    return parseBaseTypes2(element.type, responseIterator);
  }
  __name(parseResponseValue, "parseResponseValue");
  function responseParser(responseIterator, output, structs, enums, parsedResult) {
    const { name, type } = output;
    let temp;
    switch (true) {
      case isLen(name):
        temp = responseIterator.next().value;
        return BigInt(temp);
      case (structs && type in structs || isTypeTuple(type)):
        return parseResponseValue(responseIterator, output, structs, enums);
      case (enums && isTypeEnum(type, enums)):
        return parseResponseValue(responseIterator, output, structs, enums);
      case CairoFixedArray.isTypeFixedArray(type):
        return parseResponseValue(responseIterator, output, structs, enums);
      case isTypeArray(type):
        if (isCairo1Type(type)) {
          return parseResponseValue(responseIterator, output, structs, enums);
        }
        const parsedDataArr = [];
        if (parsedResult && parsedResult[`${name}_len`]) {
          const arrLen = parsedResult[`${name}_len`];
          while (parsedDataArr.length < arrLen) {
            parsedDataArr.push(
              parseResponseValue(
                responseIterator,
                { name, type: output.type.replace("*", "") },
                structs,
                enums
              )
            );
          }
        }
        return parsedDataArr;
      case isTypeNonZero(type):
        return parseResponseValue(responseIterator, output, structs, enums);
      default:
        return parseBaseTypes2(type, responseIterator);
    }
  }
  __name(responseParser, "responseParser");
  var validateFelt = /* @__PURE__ */ __name((parameter, input) => {
    assert(
      isString(parameter) || isNumber2(parameter) || isBigInt(parameter),
      `Validate: arg ${input.name} should be a felt typed as (String, Number or BigInt)`
    );
    if (isString(parameter) && !isHex2(parameter)) return;
    const param = BigInt(parameter.toString(10));
    assert(
      // from : https://github.com/starkware-libs/starknet-specs/blob/29bab650be6b1847c92d4461d4c33008b5e50b1a/api/starknet_api_openrpc.json#L1266
      param >= 0n && param <= 2n ** 252n - 1n,
      `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 2^252-1]`
    );
  }, "validateFelt");
  var validateBytes31 = /* @__PURE__ */ __name((parameter, input) => {
    assert(isString(parameter), `Validate: arg ${input.name} should be a string.`);
    assert(
      parameter.length < 32,
      `Validate: arg ${input.name} cairo typed ${input.type} should be a string of less than 32 characters.`
    );
  }, "validateBytes31");
  var validateByteArray = /* @__PURE__ */ __name((parameter, input) => {
    assert(isString(parameter), `Validate: arg ${input.name} should be a string.`);
  }, "validateByteArray");
  var validateUint = /* @__PURE__ */ __name((parameter, input) => {
    if (isNumber2(parameter)) {
      assert(
        parameter <= Number.MAX_SAFE_INTEGER,
        "Validation: Parameter is too large to be typed as Number use (BigInt or String)"
      );
    }
    assert(
      isString(parameter) || isNumber2(parameter) || isBigInt(parameter) || isObject2(parameter) && "low" in parameter && "high" in parameter || isObject2(parameter) && ["limb0", "limb1", "limb2", "limb3"].every((key) => key in parameter),
      `Validate: arg ${input.name} of cairo type ${input.type} should be type (String, Number or BigInt), but is ${typeof parameter} ${parameter}.`
    );
    let param;
    switch (input.type) {
      case Uint.u256:
        param = new CairoUint256(parameter).toBigInt();
        break;
      case Uint.u512:
        param = new CairoUint512(parameter).toBigInt();
        break;
      default:
        param = toBigInt(parameter);
    }
    switch (input.type) {
      case Uint.u8:
        assert(
          param >= 0n && param <= 255n,
          `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0 - 255]`
        );
        break;
      case Uint.u16:
        assert(
          param >= 0n && param <= 65535n,
          `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 65535]`
        );
        break;
      case Uint.u32:
        assert(
          param >= 0n && param <= 4294967295n,
          `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 4294967295]`
        );
        break;
      case Uint.u64:
        assert(
          param >= 0n && param <= 2n ** 64n - 1n,
          `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 2^64-1]`
        );
        break;
      case Uint.u128:
        assert(
          param >= 0n && param <= 2n ** 128n - 1n,
          `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 2^128-1]`
        );
        break;
      case Uint.u256:
        assert(
          param >= 0n && param <= 2n ** 256n - 1n,
          `Validate: arg ${input.name} is ${input.type} should be in range 0 - 2^256-1`
        );
        break;
      case Uint.u512:
        assert(
          CairoUint512.is(param),
          `Validate: arg ${input.name} is ${input.type} should be in range 0 - 2^512-1`
        );
        break;
      case Literal.ClassHash:
        assert(
          // from : https://github.com/starkware-libs/starknet-specs/blob/29bab650be6b1847c92d4461d4c33008b5e50b1a/api/starknet_api_openrpc.json#L1670
          param >= 0n && param <= 2n ** 252n - 1n,
          `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 2^252-1]`
        );
        break;
      case Literal.ContractAddress:
        assert(
          // from : https://github.com/starkware-libs/starknet-specs/blob/29bab650be6b1847c92d4461d4c33008b5e50b1a/api/starknet_api_openrpc.json#L1245
          param >= 0n && param <= 2n ** 252n - 1n,
          `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 2^252-1]`
        );
        break;
      case Literal.Secp256k1Point: {
        assert(
          param >= 0n && param <= 2n ** 512n - 1n,
          `Validate: arg ${input.name} must be ${input.type} : a 512 bits number.`
        );
        break;
      }
      case Literal.U96: {
        assert(
          param >= 0n && param <= 2n ** 96n - 1n,
          `Validate: arg ${input.name} must be ${input.type} : a 96 bits number.`
        );
        break;
      }
      default:
        break;
    }
  }, "validateUint");
  var validateBool = /* @__PURE__ */ __name((parameter, input) => {
    assert(
      isBoolean(parameter),
      `Validate: arg ${input.name} of cairo type ${input.type} should be type (Boolean)`
    );
  }, "validateBool");
  var validateStruct = /* @__PURE__ */ __name((parameter, input, structs) => {
    if (input.type === Uint.u256 || input.type === Uint.u512) {
      validateUint(parameter, input);
      return;
    }
    if (isTypeEthAddress(input.type)) {
      assert(!isObject2(parameter), `EthAddress type is waiting a BigNumberish. Got "${parameter}"`);
      const param = BigInt(parameter.toString(10));
      assert(
        // from : https://github.com/starkware-libs/starknet-specs/blob/29bab650be6b1847c92d4461d4c33008b5e50b1a/api/starknet_api_openrpc.json#L1259
        param >= 0n && param <= 2n ** 160n - 1n,
        `Validate: arg ${input.name} cairo typed ${input.type} should be in range [0, 2^160-1]`
      );
      return;
    }
    assert(
      isObject2(parameter),
      `Validate: arg ${input.name} is cairo type struct (${input.type}), and should be defined as a js object (not array)`
    );
    structs[input.type].members.forEach(({ name }) => {
      assert(
        Object.keys(parameter).includes(name),
        `Validate: arg ${input.name} should have a property ${name}`
      );
    });
  }, "validateStruct");
  var validateEnum = /* @__PURE__ */ __name((parameter, input) => {
    assert(
      isObject2(parameter),
      `Validate: arg ${input.name} is cairo type Enum (${input.type}), and should be defined as a js object (not array)`
    );
    const methodsKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(parameter));
    const keys = [...Object.getOwnPropertyNames(parameter), ...methodsKeys];
    if (isTypeOption(input.type) && keys.includes("isSome") && keys.includes("isNone")) {
      return;
    }
    if (isTypeResult(input.type) && keys.includes("isOk") && keys.includes("isErr")) {
      return;
    }
    if (keys.includes("variant") && keys.includes("activeVariant")) {
      return;
    }
    throw new Error(
      `Validate Enum: argument ${input.name}, type ${input.type}, value received "${parameter}", is not an Enum.`
    );
  }, "validateEnum");
  var validateTuple = /* @__PURE__ */ __name((parameter, input) => {
    assert(isObject2(parameter), `Validate: arg ${input.name} should be a tuple (defined as object)`);
  }, "validateTuple");
  var validateArray = /* @__PURE__ */ __name((parameterArray, input, structs, enums) => {
    const isNormalArray = isTypeArray(input.type);
    const baseType = isNormalArray ? getArrayType(input.type) : CairoFixedArray.getFixedArrayType(input.type);
    if (isNormalArray && isTypeFelt(baseType) && isLongText(parameterArray)) {
      return;
    }
    let parameter = [];
    if (isNormalArray) {
      assert(Array.isArray(parameterArray), `Validate: arg ${input.name} should be an Array`);
      parameter = parameterArray;
    } else {
      switch (true) {
        case Array.isArray(parameterArray):
          parameter = parameterArray;
          break;
        case typeof parameterArray === "object":
          parameter = Object.values(parameterArray);
          break;
        default:
          throw new Error(`Validate: arg ${input.name} should be an Array or an object.`);
      }
    }
    switch (true) {
      case isTypeFelt(baseType):
        parameter.forEach((param) => validateFelt(param, input));
        break;
      case isTypeTuple(baseType):
        parameter.forEach((it) => validateTuple(it, { name: input.name, type: baseType }));
        break;
      case isTypeArray(baseType):
        parameter.forEach(
          (param) => validateArray(param, { name: "", type: baseType }, structs, enums)
        );
        break;
      case isTypeStruct(baseType, structs):
        parameter.forEach(
          (it) => validateStruct(it, { name: input.name, type: baseType }, structs)
        );
        break;
      case isTypeEnum(baseType, enums):
        parameter.forEach((it) => validateEnum(it, { name: input.name, type: baseType }));
        break;
      case (isTypeUint(baseType) || isTypeLiteral(baseType)):
        parameter.forEach((param) => validateUint(param, { name: "", type: baseType }));
        break;
      case isTypeBool(baseType):
        parameter.forEach((param) => validateBool(param, input));
        break;
      default:
        throw new Error(
          `Validate Unhandled: argument ${input.name}, type ${input.type}, value ${parameter}`
        );
    }
  }, "validateArray");
  var validateNonZero = /* @__PURE__ */ __name((parameter, input) => {
    const baseType = getArrayType(input.type);
    assert(
      isTypeUint(baseType) && baseType !== CairoUint512.abiSelector || isTypeFelt(baseType),
      `Validate: ${input.name} type is not authorized for NonZero type.`
    );
    switch (true) {
      case isTypeFelt(baseType):
        validateFelt(parameter, input);
        assert(
          BigInt(parameter.toString(10)) > 0,
          "Validate: value 0 is not authorized in NonZero felt252 type."
        );
        break;
      case isTypeUint(baseType):
        validateUint(parameter, { name: "", type: baseType });
        switch (baseType) {
          case Uint.u256:
            assert(
              new CairoUint256(parameter).toBigInt() > 0,
              "Validate: value 0 is not authorized in NonZero uint256 type."
            );
            break;
          default:
            assert(
              toBigInt(parameter) > 0,
              "Validate: value 0 is not authorized in NonZero uint type."
            );
        }
        break;
      default:
        throw new Error(
          `Validate Unhandled: argument ${input.name}, type ${input.type}, value "${parameter}"`
        );
    }
  }, "validateNonZero");
  function validateFields(abiMethod, args, structs, enums) {
    abiMethod.inputs.reduce((acc, input) => {
      const parameter = args[acc];
      switch (true) {
        case isLen(input.name):
          return acc;
        case isTypeFelt(input.type):
          validateFelt(parameter, input);
          break;
        case isTypeBytes31(input.type):
          validateBytes31(parameter, input);
          break;
        case (isTypeUint(input.type) || isTypeLiteral(input.type)):
          validateUint(parameter, input);
          break;
        case isTypeBool(input.type):
          validateBool(parameter, input);
          break;
        case isTypeByteArray(input.type):
          validateByteArray(parameter, input);
          break;
        case (isTypeArray(input.type) || CairoFixedArray.isTypeFixedArray(input.type)):
          validateArray(parameter, input, structs, enums);
          break;
        case isTypeStruct(input.type, structs):
          validateStruct(parameter, input, structs);
          break;
        case isTypeEnum(input.type, enums):
          validateEnum(parameter, input);
          break;
        case isTypeTuple(input.type):
          validateTuple(parameter, input);
          break;
        case isTypeNonZero(input.type):
          validateNonZero(parameter, input);
          break;
        default:
          throw new Error(
            `Validate Unhandled: argument ${input.name}, type ${input.type}, value ${parameter}`
          );
      }
      return acc + 1;
    }, 0);
  }
  __name(validateFields, "validateFields");
  var CallData = class _CallData {
    static {
      __name(this, "_CallData");
    }
    abi;
    parser;
    structs;
    enums;
    constructor(abi) {
      this.structs = _CallData.getAbiStruct(abi);
      this.enums = _CallData.getAbiEnum(abi);
      this.parser = createAbiParser(abi);
      this.abi = this.parser.getLegacyFormat();
    }
    /**
     * Validate arguments passed to the method as corresponding to the ones in the abi
     * @param type ValidateType - type of the method
     * @param method string - name of the method
     * @param args ArgsOrCalldata - arguments that are passed to the method
     */
    validate(type, method, args = []) {
      if (type !== ValidateType.DEPLOY) {
        const invocableFunctionNames = this.abi.filter((abi) => {
          if (abi.type !== "function") return false;
          const isView = abi.stateMutability === "view" || abi.state_mutability === "view";
          return type === ValidateType.INVOKE ? !isView : isView;
        }).map((abi) => abi.name);
        assert(
          invocableFunctionNames.includes(method),
          `${type === ValidateType.INVOKE ? "invocable" : "viewable"} method not found in abi`
        );
      }
      const abiMethod = this.abi.find(
        (abi) => type === ValidateType.DEPLOY ? abi.name === method && abi.type === "constructor" : abi.name === method && abi.type === "function"
      );
      if (isNoConstructorValid(method, args, abiMethod)) {
        return;
      }
      const inputsLength = this.parser.methodInputsLength(abiMethod);
      if (args.length !== inputsLength) {
        throw Error(
          `Invalid number of arguments, expected ${inputsLength} arguments, but got ${args.length}`
        );
      }
      validateFields(abiMethod, args, this.structs, this.enums);
    }
    /**
     * Compile contract callData with abi
     * Parse the calldata by using input fields from the abi for that method
     * @param method string - method name
     * @param argsCalldata RawArgs - arguments passed to the method. Can be an array of arguments (in the order of abi definition), or an object constructed in conformity with abi (in this case, the parameter can be in a wrong order).
     * @return Calldata - parsed arguments in format that contract is expecting
     * @example
     * ```typescript
     * const calldata = myCallData.compile("constructor", ["0x34a", [1, 3n]]);
     * ```
     * ```typescript
     * const calldata2 = myCallData.compile("constructor", {list:[1, 3n], balance:"0x34"}); // wrong order is valid
     * ```
     */
    compile(method, argsCalldata) {
      const abiMethod = this.abi.find((abiFunction) => abiFunction.name === method);
      if (isNoConstructorValid(method, argsCalldata, abiMethod)) {
        return [];
      }
      let args;
      if (Array.isArray(argsCalldata)) {
        args = argsCalldata;
      } else {
        const orderedObject = orderPropsByAbi(
          argsCalldata,
          abiMethod.inputs,
          this.structs,
          this.enums
        );
        args = Object.values(orderedObject);
        validateFields(abiMethod, args, this.structs, this.enums);
      }
      const argsIterator = args[Symbol.iterator]();
      const callArray = abiMethod.inputs.reduce(
        (acc, input) => isLen(input.name) && !isCairo1Type(input.type) ? acc : acc.concat(parseCalldataField(argsIterator, input, this.structs, this.enums)),
        []
      );
      Object.defineProperty(callArray, "__compiled__", {
        enumerable: false,
        writable: false,
        value: true
      });
      return callArray;
    }
    /**
     * Compile contract callData without abi
     * @param rawArgs RawArgs representing cairo method arguments or string array of compiled data
     * @returns Calldata
     */
    static compile(rawArgs) {
      const createTree = /* @__PURE__ */ __name((obj) => {
        const getEntries = /* @__PURE__ */ __name((o, prefix = ".") => {
          const oe = Array.isArray(o) ? [o.length.toString(), ...o] : o;
          return Object.entries(oe).flatMap(([k, v]) => {
            let value = v;
            if (k === "entrypoint") value = getSelectorFromName(value);
            else if (isLongText(value)) value = byteArrayFromString(value);
            const kk = Array.isArray(oe) && k === "0" ? "$$len" : k;
            if (isBigInt(value)) return [[`${prefix}${kk}`, felt(value)]];
            if (Object(value) === value) {
              const methodsKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(value));
              const keys = [...Object.getOwnPropertyNames(value), ...methodsKeys];
              if (keys.includes("isSome") && keys.includes("isNone")) {
                const myOption = value;
                const variantNb = myOption.isSome() ? CairoOptionVariant.Some : CairoOptionVariant.None;
                if (myOption.isSome())
                  return getEntries({ 0: variantNb, 1: myOption.unwrap() }, `${prefix}${kk}.`);
                return [[`${prefix}${kk}`, felt(variantNb)]];
              }
              if (keys.includes("isOk") && keys.includes("isErr")) {
                const myResult = value;
                const variantNb = myResult.isOk() ? CairoResultVariant.Ok : CairoResultVariant.Err;
                return getEntries({ 0: variantNb, 1: myResult.unwrap() }, `${prefix}${kk}.`);
              }
              if (keys.includes("variant") && keys.includes("activeVariant")) {
                const myEnum = value;
                const activeVariant = myEnum.activeVariant();
                const listVariants = Object.keys(myEnum.variant);
                const activeVariantNb = listVariants.findIndex(
                  (variant) => variant === activeVariant
                );
                if (typeof myEnum.unwrap() === "object" && Object.keys(myEnum.unwrap()).length === 0) {
                  return [[`${prefix}${kk}`, felt(activeVariantNb)]];
                }
                return getEntries({ 0: activeVariantNb, 1: myEnum.unwrap() }, `${prefix}${kk}.`);
              }
              return getEntries(value, `${prefix}${kk}.`);
            }
            return [[`${prefix}${kk}`, felt(value)]];
          });
        }, "getEntries");
        const result = Object.fromEntries(getEntries(obj));
        return result;
      }, "createTree");
      let callTreeArray;
      if (!Array.isArray(rawArgs)) {
        const callTree = createTree(rawArgs);
        callTreeArray = Object.values(callTree);
      } else {
        const callObj = { ...rawArgs };
        const callTree = createTree(callObj);
        callTreeArray = Object.values(callTree);
      }
      Object.defineProperty(callTreeArray, "__compiled__", {
        enumerable: false,
        writable: false,
        value: true
      });
      return callTreeArray;
    }
    /**
     * Parse elements of the response array and structuring them into response object
     * @param method string - method name
     * @param response string[] - response from the method
     * @return Result - parsed response corresponding to the abi
     */
    parse(method, response) {
      const { outputs } = this.abi.find((abi) => abi.name === method);
      const responseIterator = response.flat()[Symbol.iterator]();
      const parsed = outputs.flat().reduce((acc, output, idx) => {
        const propName = output.name ?? idx;
        acc[propName] = responseParser(responseIterator, output, this.structs, this.enums, acc);
        if (acc[propName] && acc[`${propName}_len`]) {
          delete acc[`${propName}_len`];
        }
        return acc;
      }, {});
      return Object.keys(parsed).length === 1 && 0 in parsed ? parsed[0] : parsed;
    }
    /**
     * Format cairo method response data to native js values based on provided format schema
     * @param method string - cairo method name
     * @param response string[] - cairo method response
     * @param format object - formatter object schema
     * @returns Result - parsed and formatted response object
     */
    format(method, response, format) {
      const parsed = this.parse(method, response);
      return formatter(parsed, format);
    }
    /**
     * Helper to extract structs from abi
     * @param abi Abi
     * @returns AbiStructs - structs from abi
     */
    static getAbiStruct(abi) {
      return abi.filter((abiEntry) => abiEntry.type === "struct").reduce(
        (acc, abiEntry) => ({
          ...acc,
          [abiEntry.name]: abiEntry
        }),
        {}
      );
    }
    /**
     * Helper to extract enums from abi
     * @param abi Abi
     * @returns AbiEnums - enums from abi
     */
    static getAbiEnum(abi) {
      const fullEnumList = abi.filter((abiEntry) => abiEntry.type === "enum").reduce(
        (acc, abiEntry) => ({
          ...acc,
          [abiEntry.name]: abiEntry
        }),
        {}
      );
      delete fullEnumList["core::bool"];
      return fullEnumList;
    }
    /**
     * Helper: Compile HexCalldata | RawCalldata | RawArgs
     * @param rawCalldata HexCalldata | RawCalldata | RawArgs
     * @returns Calldata
     */
    static toCalldata(rawCalldata = []) {
      return _CallData.compile(rawCalldata);
    }
    /**
     * Helper: Convert raw to HexCalldata
     * @param raw HexCalldata | RawCalldata | RawArgs
     * @returns HexCalldata
     */
    static toHex(raw = []) {
      const calldata = _CallData.compile(raw);
      return calldata.map((it) => toHex(it));
    }
    /**
     * Parse the elements of a contract response and structure them into one or several Result.
     * In Cairo 0, arrays are not supported.
     * @param typeCairo string or string[] - Cairo type name, ex : "hello::hello::UserData"
     * @param response string[] - serialized data corresponding to typeCairo.
     * @return Result or Result[] - parsed response corresponding to typeData.
     * @example
     * const res2=helloCallData.decodeParameters("hello::hello::UserData",["0x123456","0x1"]);
     * result = { address: 1193046n, is_claimed: true }
     */
    decodeParameters(typeCairo, response) {
      const typeCairoArray = Array.isArray(typeCairo) ? typeCairo : [typeCairo];
      const responseIterator = response.flat()[Symbol.iterator]();
      const decodedArray = typeCairoArray.map(
        (typeParam) => responseParser(
          responseIterator,
          { name: "", type: typeParam },
          this.structs,
          this.enums
        )
      );
      return decodedArray.length === 1 ? decodedArray[0] : decodedArray;
    }
  };
  var hash_exports = {};
  __export2(hash_exports, {
    calculateContractAddressFromHash: /* @__PURE__ */ __name(() => calculateContractAddressFromHash, "calculateContractAddressFromHash"),
    calculateDeclareTransactionHash: /* @__PURE__ */ __name(() => calculateDeclareTransactionHash3, "calculateDeclareTransactionHash"),
    calculateDeployAccountTransactionHash: /* @__PURE__ */ __name(() => calculateDeployAccountTransactionHash3, "calculateDeployAccountTransactionHash"),
    calculateInvokeTransactionHash: /* @__PURE__ */ __name(() => calculateInvokeTransactionHash2, "calculateInvokeTransactionHash"),
    calculateL2MessageTxHash: /* @__PURE__ */ __name(() => calculateL2MessageTxHash, "calculateL2MessageTxHash"),
    computeCompiledClassHash: /* @__PURE__ */ __name(() => computeCompiledClassHash, "computeCompiledClassHash"),
    computeContractClassHash: /* @__PURE__ */ __name(() => computeContractClassHash, "computeContractClassHash"),
    computeHashOnElements: /* @__PURE__ */ __name(() => computeHashOnElements22, "computeHashOnElements"),
    computeHintedClassHash: /* @__PURE__ */ __name(() => computeHintedClassHash, "computeHintedClassHash"),
    computeLegacyContractClassHash: /* @__PURE__ */ __name(() => computeLegacyContractClassHash, "computeLegacyContractClassHash"),
    computePedersenHash: /* @__PURE__ */ __name(() => computePedersenHash, "computePedersenHash"),
    computePedersenHashOnElements: /* @__PURE__ */ __name(() => computePedersenHashOnElements, "computePedersenHashOnElements"),
    computePoseidonHash: /* @__PURE__ */ __name(() => computePoseidonHash, "computePoseidonHash"),
    computePoseidonHashOnElements: /* @__PURE__ */ __name(() => computePoseidonHashOnElements, "computePoseidonHashOnElements"),
    computeSierraContractClassHash: /* @__PURE__ */ __name(() => computeSierraContractClassHash, "computeSierraContractClassHash"),
    formatSpaces: /* @__PURE__ */ __name(() => formatSpaces, "formatSpaces"),
    getL2MessageHash: /* @__PURE__ */ __name(() => getL2MessageHash, "getL2MessageHash"),
    getSelector: /* @__PURE__ */ __name(() => getSelector, "getSelector"),
    getSelectorFromName: /* @__PURE__ */ __name(() => getSelectorFromName, "getSelectorFromName"),
    hashByteCodeSegments: /* @__PURE__ */ __name(() => hashByteCodeSegments, "hashByteCodeSegments"),
    keccakBn: /* @__PURE__ */ __name(() => keccakBn, "keccakBn"),
    poseidon: /* @__PURE__ */ __name(() => poseidon_exports, "poseidon"),
    solidityUint256PackedKeccak256: /* @__PURE__ */ __name(() => solidityUint256PackedKeccak256, "solidityUint256PackedKeccak256"),
    starknetKeccak: /* @__PURE__ */ __name(() => starknetKeccak, "starknetKeccak")
  });
  var v2_exports = {};
  __export2(v2_exports, {
    calculateDeclareTransactionHash: /* @__PURE__ */ __name(() => calculateDeclareTransactionHash, "calculateDeclareTransactionHash"),
    calculateDeployAccountTransactionHash: /* @__PURE__ */ __name(() => calculateDeployAccountTransactionHash, "calculateDeployAccountTransactionHash"),
    calculateL2MessageTxHash: /* @__PURE__ */ __name(() => calculateL2MessageTxHash, "calculateL2MessageTxHash"),
    calculateTransactionHash: /* @__PURE__ */ __name(() => calculateTransactionHash, "calculateTransactionHash"),
    calculateTransactionHashCommon: /* @__PURE__ */ __name(() => calculateTransactionHashCommon, "calculateTransactionHashCommon"),
    computeHashOnElements: /* @__PURE__ */ __name(() => computeHashOnElements2, "computeHashOnElements")
  });
  var ec_exports = {};
  __export2(ec_exports, {
    starkCurve: /* @__PURE__ */ __name(() => esm_exports2, "starkCurve"),
    weierstrass: /* @__PURE__ */ __name(() => weierstrass_exports, "weierstrass")
  });
  function computeHashOnElements2(data) {
    return [...data, data.length].reduce((x, y) => pedersen(toBigInt(x), toBigInt(y)), 0).toString();
  }
  __name(computeHashOnElements2, "computeHashOnElements");
  function calculateTransactionHashCommon(txHashPrefix, version, contractAddress, entryPointSelector, calldata, maxFee, chainId, additionalData = []) {
    const calldataHash = computeHashOnElements2(calldata);
    const dataToHash = [
      txHashPrefix,
      version,
      contractAddress,
      entryPointSelector,
      calldataHash,
      maxFee,
      chainId,
      ...additionalData
    ];
    return computeHashOnElements2(dataToHash);
  }
  __name(calculateTransactionHashCommon, "calculateTransactionHashCommon");
  function calculateDeclareTransactionHash(classHash, senderAddress, version, maxFee, chainId, nonce, compiledClassHash) {
    return calculateTransactionHashCommon(
      "0x6465636c617265",
      version,
      senderAddress,
      0,
      [classHash],
      maxFee,
      chainId,
      [nonce, ...compiledClassHash ? [compiledClassHash] : []]
    );
  }
  __name(calculateDeclareTransactionHash, "calculateDeclareTransactionHash");
  function calculateDeployAccountTransactionHash(contractAddress, classHash, constructorCalldata, salt, version, maxFee, chainId, nonce) {
    const calldata = [classHash, salt, ...constructorCalldata];
    return calculateTransactionHashCommon(
      "0x6465706c6f795f6163636f756e74",
      version,
      contractAddress,
      0,
      calldata,
      maxFee,
      chainId,
      [nonce]
    );
  }
  __name(calculateDeployAccountTransactionHash, "calculateDeployAccountTransactionHash");
  function calculateTransactionHash(contractAddress, version, calldata, maxFee, chainId, nonce) {
    return calculateTransactionHashCommon(
      "0x696e766f6b65",
      version,
      contractAddress,
      0,
      calldata,
      maxFee,
      chainId,
      [nonce]
    );
  }
  __name(calculateTransactionHash, "calculateTransactionHash");
  function calculateL2MessageTxHash(l1FromAddress, l2ToAddress, l2Selector, l2Calldata, l2ChainId, l1Nonce) {
    const payload = [l1FromAddress, ...l2Calldata];
    return calculateTransactionHashCommon(
      "0x6c315f68616e646c6572",
      0,
      l2ToAddress,
      getSelector(l2Selector),
      payload,
      0,
      l2ChainId,
      [l1Nonce]
    );
  }
  __name(calculateL2MessageTxHash, "calculateL2MessageTxHash");
  var v3_exports = {};
  __export2(v3_exports, {
    calculateDeclareTransactionHash: /* @__PURE__ */ __name(() => calculateDeclareTransactionHash2, "calculateDeclareTransactionHash"),
    calculateDeployAccountTransactionHash: /* @__PURE__ */ __name(() => calculateDeployAccountTransactionHash2, "calculateDeployAccountTransactionHash"),
    calculateInvokeTransactionHash: /* @__PURE__ */ __name(() => calculateInvokeTransactionHash, "calculateInvokeTransactionHash"),
    calculateTransactionHashCommon: /* @__PURE__ */ __name(() => calculateTransactionHashCommon2, "calculateTransactionHashCommon"),
    encodeResourceBoundsL1: /* @__PURE__ */ __name(() => encodeResourceBoundsL1, "encodeResourceBoundsL1"),
    encodeResourceBoundsL2: /* @__PURE__ */ __name(() => encodeResourceBoundsL2, "encodeResourceBoundsL2"),
    hashDAMode: /* @__PURE__ */ __name(() => hashDAMode, "hashDAMode"),
    hashFeeField: /* @__PURE__ */ __name(() => hashFeeField, "hashFeeField")
  });
  var AToBI = /* @__PURE__ */ __name((array) => array.map((it) => BigInt(it)), "AToBI");
  var DATA_AVAILABILITY_MODE_BITS = 32n;
  var MAX_AMOUNT_BITS = 64n;
  var MAX_PRICE_PER_UNIT_BITS = 128n;
  var RESOURCE_VALUE_OFFSET = MAX_AMOUNT_BITS + MAX_PRICE_PER_UNIT_BITS;
  var L1_GAS_NAME = BigInt(encodeShortString("L1_GAS"));
  var L2_GAS_NAME = BigInt(encodeShortString("L2_GAS"));
  function hashDAMode(nonceDAMode, feeDAMode) {
    return (BigInt(nonceDAMode) << DATA_AVAILABILITY_MODE_BITS) + BigInt(feeDAMode);
  }
  __name(hashDAMode, "hashDAMode");
  function encodeResourceBoundsL1(bounds) {
    return (L1_GAS_NAME << RESOURCE_VALUE_OFFSET) + (BigInt(bounds.l1_gas.max_amount) << MAX_PRICE_PER_UNIT_BITS) + BigInt(bounds.l1_gas.max_price_per_unit);
  }
  __name(encodeResourceBoundsL1, "encodeResourceBoundsL1");
  function encodeResourceBoundsL2(bounds) {
    return (L2_GAS_NAME << RESOURCE_VALUE_OFFSET) + (BigInt(bounds.l2_gas.max_amount) << MAX_PRICE_PER_UNIT_BITS) + BigInt(bounds.l2_gas.max_price_per_unit);
  }
  __name(encodeResourceBoundsL2, "encodeResourceBoundsL2");
  function hashFeeField(tip, bounds) {
    const L1Bound = encodeResourceBoundsL1(bounds);
    const L2Bound = encodeResourceBoundsL2(bounds);
    return poseidonHashMany([BigInt(tip), L1Bound, L2Bound]);
  }
  __name(hashFeeField, "hashFeeField");
  function calculateTransactionHashCommon2(txHashPrefix, version, senderAddress, chainId, nonce, tip, paymasterData, nonceDataAvailabilityMode, feeDataAvailabilityMode, resourceBounds, additionalData = []) {
    const feeFieldHash = hashFeeField(tip, resourceBounds);
    const dAModeHash = hashDAMode(nonceDataAvailabilityMode, feeDataAvailabilityMode);
    const dataToHash = AToBI([
      txHashPrefix,
      version,
      senderAddress,
      feeFieldHash,
      poseidonHashMany(AToBI(paymasterData)),
      chainId,
      nonce,
      dAModeHash,
      ...AToBI(additionalData)
    ]);
    return toHex(poseidonHashMany(dataToHash));
  }
  __name(calculateTransactionHashCommon2, "calculateTransactionHashCommon2");
  function calculateDeployAccountTransactionHash2(contractAddress, classHash, compiledConstructorCalldata, salt, version, chainId, nonce, nonceDataAvailabilityMode, feeDataAvailabilityMode, resourceBounds, tip, paymasterData) {
    return calculateTransactionHashCommon2(
      "0x6465706c6f795f6163636f756e74",
      version,
      contractAddress,
      chainId,
      nonce,
      tip,
      paymasterData,
      nonceDataAvailabilityMode,
      feeDataAvailabilityMode,
      resourceBounds,
      [poseidonHashMany(AToBI(compiledConstructorCalldata)), classHash, salt]
    );
  }
  __name(calculateDeployAccountTransactionHash2, "calculateDeployAccountTransactionHash2");
  function calculateDeclareTransactionHash2(classHash, compiledClassHash, senderAddress, version, chainId, nonce, accountDeploymentData, nonceDataAvailabilityMode, feeDataAvailabilityMode, resourceBounds, tip, paymasterData) {
    return calculateTransactionHashCommon2(
      "0x6465636c617265",
      version,
      senderAddress,
      chainId,
      nonce,
      tip,
      AToBI(paymasterData),
      nonceDataAvailabilityMode,
      feeDataAvailabilityMode,
      resourceBounds,
      [poseidonHashMany(AToBI(accountDeploymentData)), classHash, compiledClassHash]
    );
  }
  __name(calculateDeclareTransactionHash2, "calculateDeclareTransactionHash2");
  function calculateInvokeTransactionHash(senderAddress, version, compiledCalldata, chainId, nonce, accountDeploymentData, nonceDataAvailabilityMode, feeDataAvailabilityMode, resourceBounds, tip, paymasterData) {
    return calculateTransactionHashCommon2(
      "0x696e766f6b65",
      version,
      senderAddress,
      chainId,
      nonce,
      tip,
      paymasterData,
      nonceDataAvailabilityMode,
      feeDataAvailabilityMode,
      resourceBounds,
      [poseidonHashMany(AToBI(accountDeploymentData)), poseidonHashMany(AToBI(compiledCalldata))]
    );
  }
  __name(calculateInvokeTransactionHash, "calculateInvokeTransactionHash");
  function isV3InvokeTx(args) {
    return [api_exports2.ETransactionVersion.V3, api_exports2.ETransactionVersion.F3].includes(args.version);
  }
  __name(isV3InvokeTx, "isV3InvokeTx");
  function calculateInvokeTransactionHash2(args) {
    if (isV3InvokeTx(args)) {
      return calculateInvokeTransactionHash(
        args.senderAddress,
        args.version,
        args.compiledCalldata,
        args.chainId,
        args.nonce,
        args.accountDeploymentData,
        args.nonceDataAvailabilityMode,
        args.feeDataAvailabilityMode,
        args.resourceBounds,
        args.tip,
        args.paymasterData
      );
    }
    return calculateTransactionHash(
      args.senderAddress,
      args.version,
      args.compiledCalldata,
      args.maxFee,
      args.chainId,
      args.nonce
    );
  }
  __name(calculateInvokeTransactionHash2, "calculateInvokeTransactionHash2");
  function isV3DeclareTx(args) {
    return [api_exports2.ETransactionVersion.V3, api_exports2.ETransactionVersion.F3].includes(args.version);
  }
  __name(isV3DeclareTx, "isV3DeclareTx");
  function calculateDeclareTransactionHash3(args) {
    if (isV3DeclareTx(args)) {
      return calculateDeclareTransactionHash2(
        args.classHash,
        args.compiledClassHash,
        args.senderAddress,
        args.version,
        args.chainId,
        args.nonce,
        args.accountDeploymentData,
        args.nonceDataAvailabilityMode,
        args.feeDataAvailabilityMode,
        args.resourceBounds,
        args.tip,
        args.paymasterData
      );
    }
    return calculateDeclareTransactionHash(
      args.classHash,
      args.senderAddress,
      args.version,
      args.maxFee,
      args.chainId,
      args.nonce,
      args.compiledClassHash
    );
  }
  __name(calculateDeclareTransactionHash3, "calculateDeclareTransactionHash3");
  function isV3DeployAccountTx(args) {
    return [api_exports2.ETransactionVersion.V3, api_exports2.ETransactionVersion.F3].includes(args.version);
  }
  __name(isV3DeployAccountTx, "isV3DeployAccountTx");
  function calculateDeployAccountTransactionHash3(args) {
    if (isV3DeployAccountTx(args)) {
      return calculateDeployAccountTransactionHash2(
        args.contractAddress,
        args.classHash,
        args.compiledConstructorCalldata,
        args.salt,
        args.version,
        args.chainId,
        args.nonce,
        args.nonceDataAvailabilityMode,
        args.feeDataAvailabilityMode,
        args.resourceBounds,
        args.tip,
        args.paymasterData
      );
    }
    return calculateDeployAccountTransactionHash(
      args.contractAddress,
      args.classHash,
      args.constructorCalldata,
      args.salt,
      args.version,
      args.maxFee,
      args.chainId,
      args.nonce
    );
  }
  __name(calculateDeployAccountTransactionHash3, "calculateDeployAccountTransactionHash3");
  function computePedersenHash(a, b) {
    return pedersen(BigInt(a), BigInt(b));
  }
  __name(computePedersenHash, "computePedersenHash");
  function computePoseidonHash(a, b) {
    return toHex(poseidonHash(BigInt(a), BigInt(b)));
  }
  __name(computePoseidonHash, "computePoseidonHash");
  function computeHashOnElements22(data) {
    return [...data, data.length].reduce((x, y) => pedersen(BigInt(x), BigInt(y)), 0).toString();
  }
  __name(computeHashOnElements22, "computeHashOnElements2");
  var computePedersenHashOnElements = computeHashOnElements22;
  function computePoseidonHashOnElements(data) {
    return toHex(poseidonHashMany(data.map((x) => BigInt(x))));
  }
  __name(computePoseidonHashOnElements, "computePoseidonHashOnElements");
  function calculateContractAddressFromHash(salt, classHash, constructorCalldata, deployerAddress) {
    const compiledCalldata = CallData.compile(constructorCalldata);
    const constructorCalldataHash = computeHashOnElements22(compiledCalldata);
    const CONTRACT_ADDRESS_PREFIX = felt("0x535441524b4e45545f434f4e54524143545f41444452455353");
    const hash = computeHashOnElements22([
      CONTRACT_ADDRESS_PREFIX,
      deployerAddress,
      salt,
      classHash,
      constructorCalldataHash
    ]);
    return toHex(BigInt(hash) % ADDR_BOUND);
  }
  __name(calculateContractAddressFromHash, "calculateContractAddressFromHash");
  function nullSkipReplacer(key, value) {
    if (key === "attributes" || key === "accessible_scopes") {
      return Array.isArray(value) && value.length === 0 ? void 0 : value;
    }
    if (key === "debug_info") {
      return null;
    }
    return value === null ? void 0 : value;
  }
  __name(nullSkipReplacer, "nullSkipReplacer");
  function formatSpaces(json2) {
    let insideQuotes = false;
    const newString = [];
    for (const char of json2) {
      if (char === '"' && (newString.length > 0 && newString.slice(-1)[0] === "\\") === false) {
        insideQuotes = !insideQuotes;
      }
      if (insideQuotes) {
        newString.push(char);
      } else {
        newString.push(char === ":" ? ": " : char === "," ? ", " : char);
      }
    }
    return newString.join("");
  }
  __name(formatSpaces, "formatSpaces");
  function computeHintedClassHash(compiledContract) {
    const { abi, program } = compiledContract;
    const contractClass = { abi, program };
    const serializedJson = formatSpaces(stringify2(contractClass, nullSkipReplacer));
    return addHexPrefix(keccak(utf8ToArray(serializedJson)).toString(16));
  }
  __name(computeHintedClassHash, "computeHintedClassHash");
  function computeLegacyContractClassHash(contract) {
    const compiledContract = isString(contract) ? parse2(contract) : contract;
    const apiVersion = toHex(API_VERSION);
    const externalEntryPointsHash = computeHashOnElements22(
      compiledContract.entry_points_by_type.EXTERNAL.flatMap((e) => [e.selector, e.offset])
    );
    const l1HandlerEntryPointsHash = computeHashOnElements22(
      compiledContract.entry_points_by_type.L1_HANDLER.flatMap((e) => [e.selector, e.offset])
    );
    const constructorEntryPointHash = computeHashOnElements22(
      compiledContract.entry_points_by_type.CONSTRUCTOR.flatMap((e) => [e.selector, e.offset])
    );
    const builtinsHash = computeHashOnElements22(
      compiledContract.program.builtins.map((s) => encodeShortString(s))
    );
    const hintedClassHash = computeHintedClassHash(compiledContract);
    const dataHash = computeHashOnElements22(compiledContract.program.data);
    return computeHashOnElements22([
      apiVersion,
      externalEntryPointsHash,
      l1HandlerEntryPointsHash,
      constructorEntryPointHash,
      builtinsHash,
      hintedClassHash,
      dataHash
    ]);
  }
  __name(computeLegacyContractClassHash, "computeLegacyContractClassHash");
  function hashBuiltins(builtins) {
    return poseidonHashMany(
      builtins.flatMap((it) => {
        return BigInt(encodeShortString(it));
      })
    );
  }
  __name(hashBuiltins, "hashBuiltins");
  function hashEntryPoint(data) {
    const base2 = data.flatMap((it) => {
      return [BigInt(it.selector), BigInt(it.offset), hashBuiltins(it.builtins)];
    });
    return poseidonHashMany(base2);
  }
  __name(hashEntryPoint, "hashEntryPoint");
  function hashByteCodeSegments(casm) {
    const byteCode = casm.bytecode.map((n) => BigInt(n));
    const bytecodeSegmentLengths = casm.bytecode_segment_lengths ?? [];
    let segmentStart = 0;
    const hashLeaves = bytecodeSegmentLengths.flatMap((len) => {
      const segment = byteCode.slice(segmentStart, segmentStart += len);
      return [BigInt(len), poseidonHashMany(segment)];
    });
    return 1n + poseidonHashMany(hashLeaves);
  }
  __name(hashByteCodeSegments, "hashByteCodeSegments");
  function computeCompiledClassHash(casm) {
    const COMPILED_CLASS_VERSION = "COMPILED_CLASS_V1";
    const compiledClassVersion = BigInt(encodeShortString(COMPILED_CLASS_VERSION));
    const externalEntryPointsHash = hashEntryPoint(casm.entry_points_by_type.EXTERNAL);
    const l1Handlers = hashEntryPoint(casm.entry_points_by_type.L1_HANDLER);
    const constructor = hashEntryPoint(casm.entry_points_by_type.CONSTRUCTOR);
    const bytecode = casm.bytecode_segment_lengths ? hashByteCodeSegments(casm) : poseidonHashMany(casm.bytecode.map((it) => BigInt(it)));
    return toHex(
      poseidonHashMany([
        compiledClassVersion,
        externalEntryPointsHash,
        l1Handlers,
        constructor,
        bytecode
      ])
    );
  }
  __name(computeCompiledClassHash, "computeCompiledClassHash");
  function hashEntryPointSierra(data) {
    const base2 = data.flatMap((it) => {
      return [BigInt(it.selector), BigInt(it.function_idx)];
    });
    return poseidonHashMany(base2);
  }
  __name(hashEntryPointSierra, "hashEntryPointSierra");
  function hashAbi(sierra) {
    const indentString = formatSpaces(stringify2(sierra.abi, null));
    return BigInt(addHexPrefix(keccak(utf8ToArray(indentString)).toString(16)));
  }
  __name(hashAbi, "hashAbi");
  function computeSierraContractClassHash(sierra) {
    const CONTRACT_CLASS_VERSION = "CONTRACT_CLASS_V0.1.0";
    const compiledClassVersion = BigInt(encodeShortString(CONTRACT_CLASS_VERSION));
    const externalEntryPointsHash = hashEntryPointSierra(sierra.entry_points_by_type.EXTERNAL);
    const l1Handlers = hashEntryPointSierra(sierra.entry_points_by_type.L1_HANDLER);
    const constructor = hashEntryPointSierra(sierra.entry_points_by_type.CONSTRUCTOR);
    const abiHash = hashAbi(sierra);
    const sierraProgram = poseidonHashMany(sierra.sierra_program.map((it) => BigInt(it)));
    return toHex(
      poseidonHashMany([
        compiledClassVersion,
        externalEntryPointsHash,
        l1Handlers,
        constructor,
        abiHash,
        sierraProgram
      ])
    );
  }
  __name(computeSierraContractClassHash, "computeSierraContractClassHash");
  function computeContractClassHash(contract) {
    const compiledContract = isString(contract) ? parse2(contract) : contract;
    if ("sierra_program" in compiledContract) {
      return computeSierraContractClassHash(compiledContract);
    }
    return computeLegacyContractClassHash(compiledContract);
  }
  __name(computeContractClassHash, "computeContractClassHash");
  var stark_exports = {};
  __export2(stark_exports, {
    compressProgram: /* @__PURE__ */ __name(() => compressProgram, "compressProgram"),
    decompressProgram: /* @__PURE__ */ __name(() => decompressProgram, "decompressProgram"),
    estimateFeeToBounds: /* @__PURE__ */ __name(() => estimateFeeToBounds, "estimateFeeToBounds"),
    estimatedFeeToMaxFee: /* @__PURE__ */ __name(() => estimatedFeeToMaxFee, "estimatedFeeToMaxFee"),
    formatSignature: /* @__PURE__ */ __name(() => formatSignature, "formatSignature"),
    getFullPublicKey: /* @__PURE__ */ __name(() => getFullPublicKey, "getFullPublicKey"),
    intDAM: /* @__PURE__ */ __name(() => intDAM, "intDAM"),
    makeAddress: /* @__PURE__ */ __name(() => makeAddress, "makeAddress"),
    randomAddress: /* @__PURE__ */ __name(() => randomAddress, "randomAddress"),
    reduceV2: /* @__PURE__ */ __name(() => reduceV2, "reduceV2"),
    signatureToDecimalArray: /* @__PURE__ */ __name(() => signatureToDecimalArray, "signatureToDecimalArray"),
    signatureToHexArray: /* @__PURE__ */ __name(() => signatureToHexArray, "signatureToHexArray"),
    toFeeVersion: /* @__PURE__ */ __name(() => toFeeVersion, "toFeeVersion"),
    toTransactionVersion: /* @__PURE__ */ __name(() => toTransactionVersion, "toTransactionVersion"),
    v3Details: /* @__PURE__ */ __name(() => v3Details, "v3Details")
  });
  function compressProgram(jsonProgram) {
    const stringified = isString(jsonProgram) ? jsonProgram : stringify2(jsonProgram);
    const compressedProgram = gzip_1(stringified);
    return btoaUniversal(compressedProgram);
  }
  __name(compressProgram, "compressProgram");
  function decompressProgram(base642) {
    if (Array.isArray(base642)) return base642;
    const decompressed = arrayBufferToString(ungzip_1(atobUniversal(base642)));
    return parse2(decompressed);
  }
  __name(decompressProgram, "decompressProgram");
  function randomAddress() {
    const randomKeyPair = utils.randomPrivateKey();
    return getStarkKey(randomKeyPair);
  }
  __name(randomAddress, "randomAddress");
  function makeAddress(input) {
    return addHexPrefix(input).toLowerCase();
  }
  __name(makeAddress, "makeAddress");
  function formatSignature(sig) {
    if (!sig) throw Error("formatSignature: provided signature is undefined");
    if (Array.isArray(sig)) {
      return sig.map((it) => toHex(it));
    }
    try {
      const { r, s } = sig;
      return [toHex(r), toHex(s)];
    } catch (e) {
      throw new Error("Signature need to be weierstrass.SignatureType or an array for custom");
    }
  }
  __name(formatSignature, "formatSignature");
  function signatureToDecimalArray(sig) {
    return bigNumberishArrayToDecimalStringArray(formatSignature(sig));
  }
  __name(signatureToDecimalArray, "signatureToDecimalArray");
  function signatureToHexArray(sig) {
    return bigNumberishArrayToHexadecimalStringArray(formatSignature(sig));
  }
  __name(signatureToHexArray, "signatureToHexArray");
  function estimatedFeeToMaxFee(estimatedFee, overhead = 50) {
    return addPercent(estimatedFee, overhead);
  }
  __name(estimatedFeeToMaxFee, "estimatedFeeToMaxFee");
  function estimateFeeToBounds(estimate, amountOverhead = 50, priceOverhead = 50) {
    if (isBigInt(estimate)) {
      return {
        l2_gas: { max_amount: "0x0", max_price_per_unit: "0x0" },
        l1_gas: { max_amount: "0x0", max_price_per_unit: "0x0" }
      };
    }
    if (isUndefined(estimate.gas_consumed) || isUndefined(estimate.gas_price)) {
      throw Error("estimateFeeToBounds: estimate is undefined");
    }
    const maxUnits = estimate.data_gas_consumed !== void 0 && estimate.data_gas_price !== void 0 ? toHex(addPercent(BigInt(estimate.overall_fee) / BigInt(estimate.gas_price), amountOverhead)) : toHex(addPercent(estimate.gas_consumed, amountOverhead));
    const maxUnitPrice = toHex(addPercent(estimate.gas_price, priceOverhead));
    return {
      l2_gas: { max_amount: "0x0", max_price_per_unit: "0x0" },
      l1_gas: { max_amount: maxUnits, max_price_per_unit: maxUnitPrice }
    };
  }
  __name(estimateFeeToBounds, "estimateFeeToBounds");
  function intDAM(dam) {
    if (dam === api_exports2.EDataAvailabilityMode.L1) return api_exports2.EDAMode.L1;
    if (dam === api_exports2.EDataAvailabilityMode.L2) return api_exports2.EDAMode.L2;
    throw Error("EDAM conversion");
  }
  __name(intDAM, "intDAM");
  function toTransactionVersion(defaultVersion, providedVersion) {
    const providedVersion0xs = providedVersion ? toHex(providedVersion) : void 0;
    const defaultVersion0xs = toHex(defaultVersion);
    if (providedVersion && !Object.values(api_exports2.ETransactionVersion).includes(providedVersion0xs)) {
      throw Error(`providedVersion ${providedVersion} is not ETransactionVersion`);
    }
    if (!Object.values(api_exports2.ETransactionVersion).includes(defaultVersion0xs)) {
      throw Error(`defaultVersion ${defaultVersion} is not ETransactionVersion`);
    }
    return providedVersion ? providedVersion0xs : defaultVersion0xs;
  }
  __name(toTransactionVersion, "toTransactionVersion");
  function toFeeVersion(providedVersion) {
    if (!providedVersion) return void 0;
    const version = toHex(providedVersion);
    if (version === api_exports2.ETransactionVersion.V0) return api_exports2.ETransactionVersion.F0;
    if (version === api_exports2.ETransactionVersion.V1) return api_exports2.ETransactionVersion.F1;
    if (version === api_exports2.ETransactionVersion.V2) return api_exports2.ETransactionVersion.F2;
    if (version === api_exports2.ETransactionVersion.V3) return api_exports2.ETransactionVersion.F3;
    throw Error(`toFeeVersion: ${version} is not supported`);
  }
  __name(toFeeVersion, "toFeeVersion");
  function v3Details(details) {
    return {
      tip: details.tip || 0,
      paymasterData: details.paymasterData || [],
      accountDeploymentData: details.accountDeploymentData || [],
      nonceDataAvailabilityMode: details.nonceDataAvailabilityMode || api_exports2.EDataAvailabilityMode.L1,
      feeDataAvailabilityMode: details.feeDataAvailabilityMode || api_exports2.EDataAvailabilityMode.L1,
      resourceBounds: details.resourceBounds ?? estimateFeeToBounds(ZERO)
    };
  }
  __name(v3Details, "v3Details");
  function reduceV2(providedVersion) {
    if (providedVersion === api_exports2.ETransactionVersion.F2) return api_exports2.ETransactionVersion.F1;
    if (providedVersion === api_exports2.ETransactionVersion.V2) return api_exports2.ETransactionVersion.V1;
    return providedVersion;
  }
  __name(reduceV2, "reduceV2");
  function getFullPublicKey(privateKey) {
    const privKey = toHex(privateKey);
    const fullPrivKey = addHexPrefix(buf2hex(getPublicKey(privKey, false)));
    return fullPrivKey;
  }
  __name(getFullPublicKey, "getFullPublicKey");
  function isSierra(contract) {
    const compiledContract = isString(contract) ? parse2(contract) : contract;
    return "sierra_program" in compiledContract;
  }
  __name(isSierra, "isSierra");
  function extractContractHashes(payload) {
    const response = { ...payload };
    if (isSierra(payload.contract)) {
      if (!payload.compiledClassHash && payload.casm) {
        response.compiledClassHash = computeCompiledClassHash(payload.casm);
      }
      if (!response.compiledClassHash)
        throw new Error(
          "Extract compiledClassHash failed, provide (CairoAssembly).casm file or compiledClassHash"
        );
    }
    response.classHash = payload.classHash ?? computeContractClassHash(payload.contract);
    if (!response.classHash)
      throw new Error("Extract classHash failed, provide (CompiledContract).json file or classHash");
    return response;
  }
  __name(extractContractHashes, "extractContractHashes");
  var eth_exports = {};
  __export2(eth_exports, {
    ethRandomPrivateKey: /* @__PURE__ */ __name(() => ethRandomPrivateKey, "ethRandomPrivateKey"),
    validateAndParseEthAddress: /* @__PURE__ */ __name(() => validateAndParseEthAddress, "validateAndParseEthAddress")
  });
  function ethRandomPrivateKey() {
    return sanitizeHex(buf2hex(secp256k1.utils.randomPrivateKey()));
  }
  __name(ethRandomPrivateKey, "ethRandomPrivateKey");
  function validateAndParseEthAddress(address) {
    assertInRange(address, ZERO, 2n ** 160n - 1n, "Ethereum Address ");
    const result = addHexPrefix(removeHexPrefix(toHex(address)).padStart(40, "0"));
    assert(Boolean(result.match(/^(0x)?[0-9a-f]{40}$/)), "Invalid Ethereum Address Format");
    return result;
  }
  __name(validateAndParseEthAddress, "validateAndParseEthAddress");
  var fetchPonyfill_default = IS_BROWSER && window.fetch.bind(window) || // use built-in fetch in browser if available
  !isUndefined(global) && fetchCookie(global.fetch) || // use built-in fetch in node, react-native and service worker if available
  import_isomorphic_fetch.default;
  var provider_exports = {};
  __export2(provider_exports, {
    Block: /* @__PURE__ */ __name(() => Block, "Block"),
    createSierraContractClass: /* @__PURE__ */ __name(() => createSierraContractClass, "createSierraContractClass"),
    getDefaultNodeUrl: /* @__PURE__ */ __name(() => getDefaultNodeUrl, "getDefaultNodeUrl"),
    isPendingBlock: /* @__PURE__ */ __name(() => isPendingBlock, "isPendingBlock"),
    isPendingStateUpdate: /* @__PURE__ */ __name(() => isPendingStateUpdate, "isPendingStateUpdate"),
    isPendingTransaction: /* @__PURE__ */ __name(() => isPendingTransaction, "isPendingTransaction"),
    isV3Tx: /* @__PURE__ */ __name(() => isV3Tx, "isV3Tx"),
    isVersion: /* @__PURE__ */ __name(() => isVersion, "isVersion"),
    parseContract: /* @__PURE__ */ __name(() => parseContract, "parseContract"),
    validBlockTags: /* @__PURE__ */ __name(() => validBlockTags, "validBlockTags"),
    wait: /* @__PURE__ */ __name(() => wait, "wait")
  });
  var Configuration = class _Configuration {
    static {
      __name(this, "_Configuration");
    }
    static instance;
    config;
    constructor() {
      this.initialize();
    }
    initialize() {
      this.config = { ...DEFAULT_GLOBAL_CONFIG };
    }
    static getInstance() {
      if (!_Configuration.instance) {
        _Configuration.instance = new _Configuration();
      }
      return _Configuration.instance;
    }
    get(key, defaultValue) {
      return this.config[key] ?? defaultValue;
    }
    set(key, value) {
      this.config[key] = value;
    }
    update(configData) {
      this.config = {
        ...this.config,
        ...configData
      };
    }
    getAll() {
      return { ...this.config };
    }
    reset() {
      this.initialize();
    }
    delete(key) {
      delete this.config[key];
    }
    hasKey(key) {
      return key in this.config;
    }
  };
  var config2 = Configuration.getInstance();
  var LogLevelIndex = {
    DEBUG: 5,
    INFO: 4,
    WARN: 3,
    ERROR: 2,
    FATAL: 1,
    OFF: 0
  };
  var Logger = class _Logger {
    static {
      __name(this, "_Logger");
    }
    static instance;
    config;
    constructor() {
      this.config = config2;
    }
    static getInstance() {
      if (!_Logger.instance) {
        _Logger.instance = new _Logger();
      }
      return _Logger.instance;
    }
    getTimestamp() {
      return (/* @__PURE__ */ new Date()).toISOString();
    }
    shouldLog(messageLevel) {
      const configLevel = this.config.get("logLevel", "INFO");
      return messageLevel <= LogLevelIndex[configLevel];
    }
    formatMessage(logMessage) {
      const { level, message, timestamp, data } = logMessage;
      let formattedMessage = `[${timestamp}] ${level}: ${message}`;
      if (data) {
        try {
          formattedMessage += `
${JSON.stringify(data, null, 2)}`;
        } catch (error2) {
          formattedMessage += `
[JSON.stringify Error/Circular]: ${error2}`;
        }
      }
      return formattedMessage;
    }
    log(level, message, data) {
      if (!this.shouldLog(LogLevelIndex[level])) {
        return;
      }
      const logMessage = {
        level,
        message,
        timestamp: this.getTimestamp(),
        data
      };
      const formattedMessage = this.formatMessage(logMessage);
      switch (level) {
        case "DEBUG":
          console.debug(formattedMessage);
          break;
        case "INFO":
          console.info(formattedMessage);
          break;
        case "WARN":
          console.warn(formattedMessage);
          break;
        case "ERROR":
        case "FATAL":
          console.error(formattedMessage);
          break;
        case "OFF":
          break;
        default:
          console.log(formattedMessage);
          break;
      }
    }
    /**
     * debug will be displayed when LogLevel level is set to DEBUG(5)
     */
    debug(message, data) {
      this.log("DEBUG", message, data);
    }
    /**
     * info will be displayed when LogLevel level is set to DEBUG(5), INFO(4)
     */
    info(message, data) {
      this.log("INFO", message, data);
    }
    /**
     * warn will be displayed when LogLevel level is set to DEBUG(5), INFO(4), WARN(3)
     */
    warn(message, data) {
      this.log("WARN", message, data);
    }
    /**
     * error will be displayed when LogLevel level is set to DEBUG(5), INFO(4), WARN(3), ERROR(2)
     */
    error(message, data) {
      this.log("ERROR", message, data);
    }
    /**
     * fatal will be displayed when LogLevel level is set to DEBUG(5), INFO(4), WARN(3), ERROR(2), FATAL(1)
     */
    fatal(message, data) {
      this.log("FATAL", message, data);
    }
    /**
     * Set the logging level you would like system to display
     * * 5 DEBUG  - show all logs
     * * 4 INFO
     * * 3 WARN
     * * 2 ERROR
     * * 1 FATAL
     * * 0 OFF    - disable logs
     */
    setLogLevel(level) {
      this.config.set("logLevel", level);
    }
    getLogLevel() {
      return this.config.get("logLevel", "INFO");
    }
    /**
     *
     * @returns logs levels displayed on the configured LogLevel
     */
    getEnabledLogLevels() {
      return Object.keys(LogLevelIndex).filter((s) => {
        return this.shouldLog(LogLevelIndex[s]) && s !== "OFF";
      });
    }
  };
  var logger = Logger.getInstance();
  function wait(delay) {
    return new Promise((res) => {
      setTimeout(res, delay);
    });
  }
  __name(wait, "wait");
  function createSierraContractClass(contract) {
    const result = { ...contract };
    delete result.sierra_program_debug_info;
    result.abi = formatSpaces(stringify2(contract.abi));
    result.sierra_program = formatSpaces(stringify2(contract.sierra_program));
    result.sierra_program = compressProgram(result.sierra_program);
    return result;
  }
  __name(createSierraContractClass, "createSierraContractClass");
  function parseContract(contract) {
    const parsedContract = isString(contract) ? parse2(contract) : contract;
    if (!isSierra(contract)) {
      return {
        ...parsedContract,
        ..."program" in parsedContract && { program: compressProgram(parsedContract.program) }
      };
    }
    return createSierraContractClass(parsedContract);
  }
  __name(parseContract, "parseContract");
  var getDefaultNodeUrl = /* @__PURE__ */ __name((networkName, mute = false) => {
    if (!mute) {
      logger.info("Using default public node url, please provide nodeUrl in provider options!");
    }
    const nodes = RPC_NODES[
      networkName ?? "SN_SEPOLIA"
      /* SN_SEPOLIA */
    ];
    const randIdx = Math.floor(Math.random() * nodes.length);
    return nodes[randIdx];
  }, "getDefaultNodeUrl");
  var validBlockTags = Object.values(BlockTag);
  var Block = class {
    static {
      __name(this, "Block");
    }
    /**
     * @param {BlockIdentifier} hash if not null, contains the block hash
     */
    hash = null;
    /**
     * @param {BlockIdentifier} number if not null, contains the block number
     */
    number = null;
    /**
     * @param {BlockIdentifier} tag if not null, contains "pending" or "latest"
     */
    tag = null;
    setIdentifier(__identifier) {
      if (isString(__identifier)) {
        if (isDecimalString(__identifier)) {
          this.number = parseInt(__identifier, 10);
        } else if (isHex2(__identifier)) {
          this.hash = __identifier;
        } else if (validBlockTags.includes(__identifier)) {
          this.tag = __identifier;
        } else {
          throw TypeError(`Block identifier unmanaged: ${__identifier}`);
        }
      } else if (isBigInt(__identifier)) {
        this.hash = toHex(__identifier);
      } else if (isNumber2(__identifier)) {
        this.number = __identifier;
      } else {
        this.tag = BlockTag.PENDING;
      }
      if (isNumber2(this.number) && this.number < 0) {
        throw TypeError(`Block number (${this.number}) can't be negative`);
      }
    }
    /**
     * Create a Block instance
     * @param {BlockIdentifier} _identifier  hex string and BigInt are detected as block hashes.
     * decimal string and number are detected as block numbers.
     * text string are detected as block tag.
     * null is considered as a 'pending' block tag.
     */
    constructor(_identifier) {
      this.setIdentifier(_identifier);
    }
    // TODO: fix any
    /**
     * @returns {any} the identifier as a string
     * @example
     * ```typescript
     * const result = new provider.Block(123456n).queryIdentifier;
     * // result = "blockHash=0x1e240"
     * ```
     */
    get queryIdentifier() {
      if (this.number !== null) {
        return `blockNumber=${this.number}`;
      }
      if (this.hash !== null) {
        return `blockHash=${this.hash}`;
      }
      return `blockNumber=${this.tag}`;
    }
    // TODO: fix any
    /**
     * @returns {any} the identifier as an object
     * @example
     * ```typescript
     * const result = new provider.Block(56789).identifier;
     * // result = { block_number: 56789 }
     * ```
     */
    get identifier() {
      if (this.number !== null) {
        return { block_number: this.number };
      }
      if (this.hash !== null) {
        return { block_hash: this.hash };
      }
      return this.tag;
    }
    /**
     * change the identifier of an existing Block instance
     * @example
     * ```typescript
     * const myBlock = new provider.Block("latest");
     * myBlock.identifier ="0x3456789abc";
     * const result = myBlock.identifier;
     * // result = { block_hash: '0x3456789abc' }
     * ```
     */
    set identifier(_identifier) {
      this.setIdentifier(_identifier);
    }
    valueOf = /* @__PURE__ */ __name(() => this.number, "valueOf");
    toString = /* @__PURE__ */ __name(() => this.hash, "toString");
  };
  function isV3Tx(details) {
    const version = details.version ? toHex(details.version) : api_exports2.ETransactionVersion.V3;
    return version === api_exports2.ETransactionVersion.V3 || version === api_exports2.ETransactionVersion.F3;
  }
  __name(isV3Tx, "isV3Tx");
  function isVersion(version, response) {
    const [majorS, minorS] = version.split(".");
    const [majorR, minorR] = response.split(".");
    return majorS === majorR && minorS === minorR;
  }
  __name(isVersion, "isVersion");
  function isPendingBlock(response) {
    return response.status === "PENDING";
  }
  __name(isPendingBlock, "isPendingBlock");
  function isPendingTransaction(response) {
    return !("block_hash" in response);
  }
  __name(isPendingTransaction, "isPendingTransaction");
  function isPendingStateUpdate(response) {
    return !("block_hash" in response);
  }
  __name(isPendingStateUpdate, "isPendingStateUpdate");
  var transaction_exports = {};
  __export2(transaction_exports, {
    buildUDCCall: /* @__PURE__ */ __name(() => buildUDCCall, "buildUDCCall"),
    fromCallsToExecuteCalldata: /* @__PURE__ */ __name(() => fromCallsToExecuteCalldata, "fromCallsToExecuteCalldata"),
    fromCallsToExecuteCalldataWithNonce: /* @__PURE__ */ __name(() => fromCallsToExecuteCalldataWithNonce, "fromCallsToExecuteCalldataWithNonce"),
    fromCallsToExecuteCalldata_cairo1: /* @__PURE__ */ __name(() => fromCallsToExecuteCalldata_cairo1, "fromCallsToExecuteCalldata_cairo1"),
    getExecuteCalldata: /* @__PURE__ */ __name(() => getExecuteCalldata, "getExecuteCalldata"),
    getVersionsByType: /* @__PURE__ */ __name(() => getVersionsByType, "getVersionsByType"),
    transformCallsToMulticallArrays: /* @__PURE__ */ __name(() => transformCallsToMulticallArrays, "transformCallsToMulticallArrays"),
    transformCallsToMulticallArrays_cairo1: /* @__PURE__ */ __name(() => transformCallsToMulticallArrays_cairo1, "transformCallsToMulticallArrays_cairo1")
  });
  var transformCallsToMulticallArrays = /* @__PURE__ */ __name((calls) => {
    const callArray = [];
    const calldata = [];
    calls.forEach((call) => {
      const data = CallData.compile(call.calldata || []);
      callArray.push({
        to: toBigInt(call.contractAddress).toString(10),
        selector: toBigInt(getSelectorFromName(call.entrypoint)).toString(10),
        data_offset: calldata.length.toString(),
        data_len: data.length.toString()
      });
      calldata.push(...data);
    });
    return {
      callArray,
      calldata: CallData.compile({ calldata })
    };
  }, "transformCallsToMulticallArrays");
  var fromCallsToExecuteCalldata = /* @__PURE__ */ __name((calls) => {
    const { callArray, calldata } = transformCallsToMulticallArrays(calls);
    const compiledCalls = CallData.compile({ callArray });
    return [...compiledCalls, ...calldata];
  }, "fromCallsToExecuteCalldata");
  var fromCallsToExecuteCalldataWithNonce = /* @__PURE__ */ __name((calls, nonce) => {
    return [...fromCallsToExecuteCalldata(calls), toBigInt(nonce).toString()];
  }, "fromCallsToExecuteCalldataWithNonce");
  var transformCallsToMulticallArrays_cairo1 = /* @__PURE__ */ __name((calls) => {
    const callArray = calls.map((call) => ({
      to: toBigInt(call.contractAddress).toString(10),
      selector: toBigInt(getSelectorFromName(call.entrypoint)).toString(10),
      calldata: CallData.compile(call.calldata || [])
    }));
    return callArray;
  }, "transformCallsToMulticallArrays_cairo1");
  var fromCallsToExecuteCalldata_cairo1 = /* @__PURE__ */ __name((calls) => {
    const orderCalls = calls.map((call) => ({
      contractAddress: call.contractAddress,
      entrypoint: call.entrypoint,
      calldata: Array.isArray(call.calldata) && "__compiled__" in call.calldata ? call.calldata : CallData.compile(call.calldata)
      // RawArgsObject | RawArgsArray type
    }));
    return CallData.compile({ orderCalls });
  }, "fromCallsToExecuteCalldata_cairo1");
  var getExecuteCalldata = /* @__PURE__ */ __name((calls, cairoVersion = "0") => {
    if (cairoVersion === "1") {
      return fromCallsToExecuteCalldata_cairo1(calls);
    }
    return fromCallsToExecuteCalldata(calls);
  }, "getExecuteCalldata");
  function buildUDCCall(payload, address) {
    const params = [].concat(payload).map((it) => {
      const {
        classHash,
        salt,
        unique: unique2 = true,
        constructorCalldata = []
      } = it;
      const compiledConstructorCallData = CallData.compile(constructorCalldata);
      const deploySalt = salt ?? randomAddress();
      return {
        call: {
          contractAddress: UDC.ADDRESS,
          entrypoint: UDC.ENTRYPOINT,
          calldata: [
            classHash,
            deploySalt,
            toCairoBool(unique2),
            compiledConstructorCallData.length,
            ...compiledConstructorCallData
          ]
        },
        address: calculateContractAddressFromHash(
          unique2 ? pedersen(address, deploySalt) : deploySalt,
          classHash,
          compiledConstructorCallData,
          unique2 ? UDC.ADDRESS : 0
        )
      };
    });
    return {
      calls: params.map((it) => it.call),
      addresses: params.map((it) => it.address)
    };
  }
  __name(buildUDCCall, "buildUDCCall");
  function getVersionsByType(versionType) {
    return versionType === "fee" ? {
      v1: api_exports2.ETransactionVersion.F1,
      v2: api_exports2.ETransactionVersion.F2,
      v3: api_exports2.ETransactionVersion.F3
    } : { v1: api_exports2.ETransactionVersion.V1, v2: api_exports2.ETransactionVersion.V2, v3: api_exports2.ETransactionVersion.V3 };
  }
  __name(getVersionsByType, "getVersionsByType");
  var defaultOptions = {
    headers: { "Content-Type": "application/json" },
    blockIdentifier: BlockTag.PENDING,
    retries: 200
  };
  var RpcChannel = class {
    static {
      __name(this, "RpcChannel");
    }
    nodeUrl;
    headers;
    requestId;
    blockIdentifier;
    retries;
    waitMode;
    // behave like web2 rpc and return when tx is processed
    chainId;
    specVersion;
    transactionRetryIntervalFallback;
    batchClient;
    baseFetch;
    constructor(optionsOrProvider) {
      const {
        baseFetch,
        batch,
        blockIdentifier,
        chainId,
        headers,
        nodeUrl,
        retries,
        specVersion,
        transactionRetryIntervalFallback,
        waitMode
      } = optionsOrProvider || {};
      if (Object.values(NetworkName).includes(nodeUrl)) {
        this.nodeUrl = getDefaultNodeUrl(nodeUrl, optionsOrProvider?.default);
      } else if (nodeUrl) {
        this.nodeUrl = nodeUrl;
      } else {
        this.nodeUrl = getDefaultNodeUrl(void 0, optionsOrProvider?.default);
      }
      this.baseFetch = baseFetch ?? fetchPonyfill_default;
      this.blockIdentifier = blockIdentifier ?? defaultOptions.blockIdentifier;
      this.chainId = chainId;
      this.headers = { ...defaultOptions.headers, ...headers };
      this.retries = retries ?? defaultOptions.retries;
      this.specVersion = specVersion;
      this.transactionRetryIntervalFallback = transactionRetryIntervalFallback;
      this.waitMode = waitMode ?? false;
      this.requestId = 0;
      if (typeof batch === "number") {
        this.batchClient = new BatchClient({
          nodeUrl: this.nodeUrl,
          headers: this.headers,
          interval: batch,
          baseFetch: this.baseFetch
        });
      }
    }
    get transactionRetryIntervalDefault() {
      return this.transactionRetryIntervalFallback ?? 5e3;
    }
    setChainId(chainId) {
      this.chainId = chainId;
    }
    fetch(method, params, id = 0) {
      const rpcRequestBody = {
        id,
        jsonrpc: "2.0",
        method,
        ...params && { params }
      };
      return this.baseFetch(this.nodeUrl, {
        method: "POST",
        body: stringify2(rpcRequestBody),
        headers: this.headers
      });
    }
    errorHandler(method, params, rpcError, otherError) {
      if (rpcError) {
        throw new RpcError(rpcError, method, params);
      }
      if (otherError instanceof LibraryError) {
        throw otherError;
      }
      if (otherError) {
        throw Error(otherError.message);
      }
    }
    async fetchEndpoint(method, params) {
      try {
        if (this.batchClient) {
          const { error: error22, result: result2 } = await this.batchClient.fetch(
            method,
            params,
            this.requestId += 1
          );
          this.errorHandler(method, params, error22);
          return result2;
        }
        const rawResult = await this.fetch(method, params, this.requestId += 1);
        const { error: error2, result } = await rawResult.json();
        this.errorHandler(method, params, error2);
        return result;
      } catch (error2) {
        this.errorHandler(method, params, error2?.response?.data, error2);
        throw error2;
      }
    }
    async getChainId() {
      this.chainId ??= await this.fetchEndpoint("starknet_chainId");
      return this.chainId;
    }
    async getSpecVersion() {
      this.specVersion ??= await this.fetchEndpoint("starknet_specVersion");
      return this.specVersion;
    }
    getNonceForAddress(contractAddress, blockIdentifier = this.blockIdentifier) {
      const contract_address = toHex(contractAddress);
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getNonce", {
        contract_address,
        block_id
      });
    }
    /**
     * Get the most recent accepted block hash and number
     */
    getBlockLatestAccepted() {
      return this.fetchEndpoint("starknet_blockHashAndNumber");
    }
    /**
     * Get the most recent accepted block number
     * redundant use getBlockLatestAccepted();
     * @returns Number of the latest block
     */
    getBlockNumber() {
      return this.fetchEndpoint("starknet_blockNumber");
    }
    getBlockWithTxHashes(blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getBlockWithTxHashes", { block_id });
    }
    getBlockWithTxs(blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getBlockWithTxs", { block_id });
    }
    getBlockStateUpdate(blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getStateUpdate", { block_id });
    }
    getBlockTransactionsTraces(blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_traceBlockTransactions", { block_id });
    }
    getBlockTransactionCount(blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getBlockTransactionCount", { block_id });
    }
    getTransactionByHash(txHash) {
      const transaction_hash = toHex(txHash);
      return this.fetchEndpoint("starknet_getTransactionByHash", {
        transaction_hash
      });
    }
    getTransactionByBlockIdAndIndex(blockIdentifier, index) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getTransactionByBlockIdAndIndex", { block_id, index });
    }
    getTransactionReceipt(txHash) {
      const transaction_hash = toHex(txHash);
      return this.fetchEndpoint("starknet_getTransactionReceipt", { transaction_hash });
    }
    getTransactionTrace(txHash) {
      const transaction_hash = toHex(txHash);
      return this.fetchEndpoint("starknet_traceTransaction", { transaction_hash });
    }
    /**
     * Get the status of a transaction
     */
    getTransactionStatus(transactionHash) {
      const transaction_hash = toHex(transactionHash);
      return this.fetchEndpoint("starknet_getTransactionStatus", { transaction_hash });
    }
    /**
     * @param invocations AccountInvocations
     * @param simulateTransactionOptions blockIdentifier and flags to skip validation and fee charge<br/>
     * - blockIdentifier<br/>
     * - skipValidate (default false)<br/>
     * - skipFeeCharge (default true)<br/>
     */
    simulateTransaction(invocations, simulateTransactionOptions = {}) {
      const {
        blockIdentifier = this.blockIdentifier,
        skipValidate = true,
        skipFeeCharge = true
      } = simulateTransactionOptions;
      const block_id = new Block(blockIdentifier).identifier;
      const simulationFlags = [];
      if (skipValidate) simulationFlags.push(rpcspec_0_6_exports.ESimulationFlag.SKIP_VALIDATE);
      if (skipFeeCharge) simulationFlags.push(rpcspec_0_6_exports.ESimulationFlag.SKIP_FEE_CHARGE);
      return this.fetchEndpoint("starknet_simulateTransactions", {
        block_id,
        transactions: invocations.map((it) => this.buildTransaction(it)),
        simulation_flags: simulationFlags
      });
    }
    async waitForTransaction(txHash, options) {
      const transactionHash = toHex(txHash);
      let { retries } = this;
      let onchain = false;
      let isErrorState = false;
      const retryInterval = options?.retryInterval ?? this.transactionRetryIntervalDefault;
      const errorStates = options?.errorStates ?? [
        rpcspec_0_6_exports.ETransactionStatus.REJECTED
        // TODO: commented out to preserve the long-standing behavior of "reverted" not being treated as an error by default
        // should decide which behavior to keep in the future
        // RPC.ETransactionExecutionStatus.REVERTED,
      ];
      const successStates = options?.successStates ?? [
        rpcspec_0_6_exports.ETransactionExecutionStatus.SUCCEEDED,
        rpcspec_0_6_exports.ETransactionStatus.ACCEPTED_ON_L2,
        rpcspec_0_6_exports.ETransactionStatus.ACCEPTED_ON_L1
      ];
      let txStatus;
      while (!onchain) {
        await wait(retryInterval);
        try {
          txStatus = await this.getTransactionStatus(transactionHash);
          const executionStatus = txStatus.execution_status;
          const finalityStatus = txStatus.finality_status;
          if (!finalityStatus) {
            const error2 = new Error("waiting for transaction status");
            throw error2;
          }
          if (errorStates.includes(executionStatus) || errorStates.includes(finalityStatus)) {
            const message = `${executionStatus}: ${finalityStatus}`;
            const error2 = new Error(message);
            error2.response = txStatus;
            isErrorState = true;
            throw error2;
          } else if (successStates.includes(executionStatus) || successStates.includes(finalityStatus)) {
            onchain = true;
          }
        } catch (error2) {
          if (error2 instanceof Error && isErrorState) {
            throw error2;
          }
          if (retries <= 0) {
            throw new Error(`waitForTransaction timed-out with retries ${this.retries}`);
          }
        }
        retries -= 1;
      }
      let txReceipt = null;
      while (txReceipt === null) {
        try {
          txReceipt = await this.getTransactionReceipt(transactionHash);
        } catch (error2) {
          if (retries <= 0) {
            throw new Error(`waitForTransaction timed-out with retries ${this.retries}`);
          }
        }
        retries -= 1;
        await wait(retryInterval);
      }
      return txReceipt;
    }
    getStorageAt(contractAddress, key, blockIdentifier = this.blockIdentifier) {
      const contract_address = toHex(contractAddress);
      const parsedKey = toStorageKey(key);
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getStorageAt", {
        contract_address,
        key: parsedKey,
        block_id
      });
    }
    getClassHashAt(contractAddress, blockIdentifier = this.blockIdentifier) {
      const contract_address = toHex(contractAddress);
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getClassHashAt", {
        block_id,
        contract_address
      });
    }
    getClass(classHash, blockIdentifier = this.blockIdentifier) {
      const class_hash = toHex(classHash);
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getClass", {
        class_hash,
        block_id
      });
    }
    getClassAt(contractAddress, blockIdentifier = this.blockIdentifier) {
      const contract_address = toHex(contractAddress);
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getClassAt", {
        block_id,
        contract_address
      });
    }
    async getEstimateFee(invocations, { blockIdentifier = this.blockIdentifier, skipValidate = true }) {
      const block_id = new Block(blockIdentifier).identifier;
      let flags = {};
      if (!isVersion("0.5", await this.getSpecVersion())) {
        flags = {
          simulation_flags: skipValidate ? [rpcspec_0_6_exports.ESimulationFlag.SKIP_VALIDATE] : []
        };
      }
      return this.fetchEndpoint("starknet_estimateFee", {
        request: invocations.map((it) => this.buildTransaction(it, "fee")),
        block_id,
        ...flags
      });
    }
    async invoke(functionInvocation, details) {
      let promise;
      if (!isV3Tx(details)) {
        promise = this.fetchEndpoint("starknet_addInvokeTransaction", {
          invoke_transaction: {
            sender_address: functionInvocation.contractAddress,
            calldata: CallData.toHex(functionInvocation.calldata),
            type: rpcspec_0_6_exports.ETransactionType.INVOKE,
            max_fee: toHex(details.maxFee || 0),
            version: rpcspec_0_6_exports.ETransactionVersion.V1,
            signature: signatureToHexArray(functionInvocation.signature),
            nonce: toHex(details.nonce)
          }
        });
        logger.warn(SYSTEM_MESSAGES.legacyTxWarningMessage, {
          version: rpcspec_0_6_exports.ETransactionVersion.V1,
          type: rpcspec_0_6_exports.ETransactionType.INVOKE
        });
      } else {
        promise = this.fetchEndpoint("starknet_addInvokeTransaction", {
          invoke_transaction: {
            type: rpcspec_0_6_exports.ETransactionType.INVOKE,
            sender_address: functionInvocation.contractAddress,
            calldata: CallData.toHex(functionInvocation.calldata),
            version: rpcspec_0_6_exports.ETransactionVersion.V3,
            signature: signatureToHexArray(functionInvocation.signature),
            nonce: toHex(details.nonce),
            resource_bounds: details.resourceBounds,
            tip: toHex(details.tip),
            paymaster_data: details.paymasterData.map((it) => toHex(it)),
            account_deployment_data: details.accountDeploymentData.map((it) => toHex(it)),
            nonce_data_availability_mode: details.nonceDataAvailabilityMode,
            fee_data_availability_mode: details.feeDataAvailabilityMode
          }
        });
      }
      return this.waitMode ? this.waitForTransaction((await promise).transaction_hash) : promise;
    }
    async declare({ contract, signature, senderAddress, compiledClassHash }, details) {
      let promise;
      if (!isSierra(contract) && !isV3Tx(details)) {
        promise = this.fetchEndpoint("starknet_addDeclareTransaction", {
          declare_transaction: {
            type: rpcspec_0_6_exports.ETransactionType.DECLARE,
            contract_class: {
              program: contract.program,
              entry_points_by_type: contract.entry_points_by_type,
              abi: contract.abi
            },
            version: rpcspec_0_6_exports.ETransactionVersion.V1,
            max_fee: toHex(details.maxFee || 0),
            signature: signatureToHexArray(signature),
            sender_address: senderAddress,
            nonce: toHex(details.nonce)
          }
        });
        logger.warn(SYSTEM_MESSAGES.legacyTxWarningMessage, {
          version: rpcspec_0_6_exports.ETransactionVersion.V1,
          type: rpcspec_0_6_exports.ETransactionType.DECLARE
        });
      } else if (isSierra(contract) && !isV3Tx(details)) {
        promise = this.fetchEndpoint("starknet_addDeclareTransaction", {
          declare_transaction: {
            type: rpcspec_0_6_exports.ETransactionType.DECLARE,
            contract_class: {
              sierra_program: decompressProgram(contract.sierra_program),
              contract_class_version: contract.contract_class_version,
              entry_points_by_type: contract.entry_points_by_type,
              abi: contract.abi
            },
            compiled_class_hash: compiledClassHash || "",
            version: rpcspec_0_6_exports.ETransactionVersion.V2,
            max_fee: toHex(details.maxFee || 0),
            signature: signatureToHexArray(signature),
            sender_address: senderAddress,
            nonce: toHex(details.nonce)
          }
        });
        logger.warn(SYSTEM_MESSAGES.legacyTxWarningMessage, {
          version: rpcspec_0_6_exports.ETransactionVersion.V2,
          type: rpcspec_0_6_exports.ETransactionType.DECLARE
        });
      } else if (isSierra(contract) && isV3Tx(details)) {
        promise = this.fetchEndpoint("starknet_addDeclareTransaction", {
          declare_transaction: {
            type: rpcspec_0_6_exports.ETransactionType.DECLARE,
            sender_address: senderAddress,
            compiled_class_hash: compiledClassHash || "",
            version: rpcspec_0_6_exports.ETransactionVersion.V3,
            signature: signatureToHexArray(signature),
            nonce: toHex(details.nonce),
            contract_class: {
              sierra_program: decompressProgram(contract.sierra_program),
              contract_class_version: contract.contract_class_version,
              entry_points_by_type: contract.entry_points_by_type,
              abi: contract.abi
            },
            resource_bounds: details.resourceBounds,
            tip: toHex(details.tip),
            paymaster_data: details.paymasterData.map((it) => toHex(it)),
            account_deployment_data: details.accountDeploymentData.map((it) => toHex(it)),
            nonce_data_availability_mode: details.nonceDataAvailabilityMode,
            fee_data_availability_mode: details.feeDataAvailabilityMode
          }
        });
      } else {
        throw Error("declare unspotted parameters");
      }
      return this.waitMode ? this.waitForTransaction((await promise).transaction_hash) : promise;
    }
    async deployAccount({ classHash, constructorCalldata, addressSalt, signature }, details) {
      let promise;
      if (!isV3Tx(details)) {
        promise = this.fetchEndpoint("starknet_addDeployAccountTransaction", {
          deploy_account_transaction: {
            constructor_calldata: CallData.toHex(constructorCalldata || []),
            class_hash: toHex(classHash),
            contract_address_salt: toHex(addressSalt || 0),
            type: rpcspec_0_6_exports.ETransactionType.DEPLOY_ACCOUNT,
            max_fee: toHex(details.maxFee || 0),
            version: rpcspec_0_6_exports.ETransactionVersion.V1,
            signature: signatureToHexArray(signature),
            nonce: toHex(details.nonce)
          }
        });
        logger.warn(SYSTEM_MESSAGES.legacyTxWarningMessage, {
          version: rpcspec_0_6_exports.ETransactionVersion.V1,
          type: rpcspec_0_6_exports.ETransactionType.DEPLOY_ACCOUNT
        });
      } else {
        promise = this.fetchEndpoint("starknet_addDeployAccountTransaction", {
          deploy_account_transaction: {
            type: rpcspec_0_6_exports.ETransactionType.DEPLOY_ACCOUNT,
            version: rpcspec_0_6_exports.ETransactionVersion.V3,
            signature: signatureToHexArray(signature),
            nonce: toHex(details.nonce),
            contract_address_salt: toHex(addressSalt || 0),
            constructor_calldata: CallData.toHex(constructorCalldata || []),
            class_hash: toHex(classHash),
            resource_bounds: details.resourceBounds,
            tip: toHex(details.tip),
            paymaster_data: details.paymasterData.map((it) => toHex(it)),
            nonce_data_availability_mode: details.nonceDataAvailabilityMode,
            fee_data_availability_mode: details.feeDataAvailabilityMode
          }
        });
      }
      return this.waitMode ? this.waitForTransaction((await promise).transaction_hash) : promise;
    }
    callContract(call, blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_call", {
        request: {
          contract_address: call.contractAddress,
          entry_point_selector: getSelectorFromName(call.entrypoint),
          calldata: CallData.toHex(call.calldata)
        },
        block_id
      });
    }
    /**
     * NEW: Estimate the fee for a message from L1
     * @param message Message From L1
     */
    estimateMessageFee(message, blockIdentifier = this.blockIdentifier) {
      const { from_address, to_address, entry_point_selector, payload } = message;
      const formattedMessage = {
        from_address: validateAndParseEthAddress(from_address),
        to_address: toHex(to_address),
        entry_point_selector: getSelector(entry_point_selector),
        payload: getHexStringArray(payload)
      };
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_estimateMessageFee", {
        message: formattedMessage,
        block_id
      });
    }
    /**
     * Returns an object about the sync status, or false if the node is not synching
     * @returns Object with the stats data
     */
    getSyncingStats() {
      return this.fetchEndpoint("starknet_syncing");
    }
    /**
     * Returns all events matching the given filter
     * @returns events and the pagination of the events
     */
    getEvents(eventFilter) {
      return this.fetchEndpoint("starknet_getEvents", { filter: eventFilter });
    }
    buildTransaction(invocation, versionType) {
      const defaultVersions = getVersionsByType(versionType);
      let details;
      if (!isV3Tx(invocation)) {
        details = {
          signature: signatureToHexArray(invocation.signature),
          nonce: toHex(invocation.nonce),
          max_fee: toHex(invocation.maxFee || 0)
        };
        logger.warn(SYSTEM_MESSAGES.legacyTxWarningMessage, {
          version: invocation.version,
          type: invocation.type
        });
      } else {
        details = {
          signature: signatureToHexArray(invocation.signature),
          nonce: toHex(invocation.nonce),
          resource_bounds: invocation.resourceBounds,
          tip: toHex(invocation.tip),
          paymaster_data: invocation.paymasterData.map((it) => toHex(it)),
          nonce_data_availability_mode: invocation.nonceDataAvailabilityMode,
          fee_data_availability_mode: invocation.feeDataAvailabilityMode,
          account_deployment_data: invocation.accountDeploymentData.map((it) => toHex(it))
        };
      }
      if (invocation.type === TransactionType.INVOKE) {
        return {
          // v0 v1 v3
          type: rpcspec_0_6_exports.ETransactionType.INVOKE,
          sender_address: invocation.contractAddress,
          calldata: CallData.toHex(invocation.calldata),
          version: toHex(invocation.version || defaultVersions.v3),
          ...details
        };
      }
      if (invocation.type === TransactionType.DECLARE) {
        if (!isSierra(invocation.contract)) {
          return {
            type: invocation.type,
            contract_class: invocation.contract,
            sender_address: invocation.senderAddress,
            version: toHex(invocation.version || defaultVersions.v1),
            ...details
          };
        }
        return {
          // Cairo 1 - v2 v3
          type: invocation.type,
          contract_class: {
            ...invocation.contract,
            sierra_program: decompressProgram(invocation.contract.sierra_program)
          },
          compiled_class_hash: invocation.compiledClassHash || "",
          sender_address: invocation.senderAddress,
          version: toHex(invocation.version || defaultVersions.v3),
          ...details
        };
      }
      if (invocation.type === TransactionType.DEPLOY_ACCOUNT) {
        const { account_deployment_data, ...restDetails } = details;
        return {
          type: invocation.type,
          constructor_calldata: CallData.toHex(invocation.constructorCalldata || []),
          class_hash: toHex(invocation.classHash),
          contract_address_salt: toHex(invocation.addressSalt || 0),
          version: toHex(invocation.version || defaultVersions.v3),
          ...restDetails
        };
      }
      throw Error("RPC buildTransaction received unknown TransactionType");
    }
  };
  var rpc_0_7_exports = {};
  __export2(rpc_0_7_exports, {
    RpcChannel: /* @__PURE__ */ __name(() => RpcChannel2, "RpcChannel")
  });
  var defaultOptions2 = {
    headers: { "Content-Type": "application/json" },
    blockIdentifier: BlockTag.PENDING,
    retries: 200
  };
  var RpcChannel2 = class {
    static {
      __name(this, "RpcChannel2");
    }
    nodeUrl;
    headers;
    requestId;
    blockIdentifier;
    retries;
    waitMode;
    // behave like web2 rpc and return when tx is processed
    chainId;
    specVersion;
    transactionRetryIntervalFallback;
    batchClient;
    baseFetch;
    constructor(optionsOrProvider) {
      const {
        baseFetch,
        batch,
        blockIdentifier,
        chainId,
        headers,
        nodeUrl,
        retries,
        specVersion,
        transactionRetryIntervalFallback,
        waitMode
      } = optionsOrProvider || {};
      if (Object.values(NetworkName).includes(nodeUrl)) {
        this.nodeUrl = getDefaultNodeUrl(nodeUrl, optionsOrProvider?.default);
      } else if (nodeUrl) {
        this.nodeUrl = nodeUrl;
      } else {
        this.nodeUrl = getDefaultNodeUrl(void 0, optionsOrProvider?.default);
      }
      this.baseFetch = baseFetch ?? fetchPonyfill_default;
      this.blockIdentifier = blockIdentifier ?? defaultOptions2.blockIdentifier;
      this.chainId = chainId;
      this.headers = { ...defaultOptions2.headers, ...headers };
      this.retries = retries ?? defaultOptions2.retries;
      this.specVersion = specVersion;
      this.transactionRetryIntervalFallback = transactionRetryIntervalFallback;
      this.waitMode = waitMode ?? false;
      this.requestId = 0;
      if (typeof batch === "number") {
        this.batchClient = new BatchClient({
          nodeUrl: this.nodeUrl,
          headers: this.headers,
          interval: batch,
          baseFetch: this.baseFetch
        });
      }
    }
    get transactionRetryIntervalDefault() {
      return this.transactionRetryIntervalFallback ?? 5e3;
    }
    setChainId(chainId) {
      this.chainId = chainId;
    }
    fetch(method, params, id = 0) {
      const rpcRequestBody = {
        id,
        jsonrpc: "2.0",
        method,
        ...params && { params }
      };
      return this.baseFetch(this.nodeUrl, {
        method: "POST",
        body: stringify2(rpcRequestBody),
        headers: this.headers
      });
    }
    errorHandler(method, params, rpcError, otherError) {
      if (rpcError) {
        throw new RpcError(rpcError, method, params);
      }
      if (otherError instanceof LibraryError) {
        throw otherError;
      }
      if (otherError) {
        throw Error(otherError.message);
      }
    }
    async fetchEndpoint(method, params) {
      try {
        if (this.batchClient) {
          const { error: error22, result: result2 } = await this.batchClient.fetch(
            method,
            params,
            this.requestId += 1
          );
          this.errorHandler(method, params, error22);
          return result2;
        }
        const rawResult = await this.fetch(method, params, this.requestId += 1);
        const { error: error2, result } = await rawResult.json();
        this.errorHandler(method, params, error2);
        return result;
      } catch (error2) {
        this.errorHandler(method, params, error2?.response?.data, error2);
        throw error2;
      }
    }
    async getChainId() {
      this.chainId ??= await this.fetchEndpoint("starknet_chainId");
      return this.chainId;
    }
    async getSpecVersion() {
      this.specVersion ??= await this.fetchEndpoint("starknet_specVersion");
      return this.specVersion;
    }
    getNonceForAddress(contractAddress, blockIdentifier = this.blockIdentifier) {
      const contract_address = toHex(contractAddress);
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getNonce", {
        contract_address,
        block_id
      });
    }
    /**
     * Get the most recent accepted block hash and number
     */
    getBlockLatestAccepted() {
      return this.fetchEndpoint("starknet_blockHashAndNumber");
    }
    /**
     * Get the most recent accepted block number
     * redundant use getBlockLatestAccepted();
     * @returns Number of the latest block
     */
    getBlockNumber() {
      return this.fetchEndpoint("starknet_blockNumber");
    }
    getBlockWithTxHashes(blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getBlockWithTxHashes", { block_id });
    }
    getBlockWithTxs(blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getBlockWithTxs", { block_id });
    }
    getBlockWithReceipts(blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getBlockWithReceipts", { block_id });
    }
    getBlockStateUpdate(blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getStateUpdate", { block_id });
    }
    getBlockTransactionsTraces(blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_traceBlockTransactions", { block_id });
    }
    getBlockTransactionCount(blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getBlockTransactionCount", { block_id });
    }
    getTransactionByHash(txHash) {
      const transaction_hash = toHex(txHash);
      return this.fetchEndpoint("starknet_getTransactionByHash", {
        transaction_hash
      });
    }
    getTransactionByBlockIdAndIndex(blockIdentifier, index) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getTransactionByBlockIdAndIndex", { block_id, index });
    }
    getTransactionReceipt(txHash) {
      const transaction_hash = toHex(txHash);
      return this.fetchEndpoint("starknet_getTransactionReceipt", { transaction_hash });
    }
    getTransactionTrace(txHash) {
      const transaction_hash = toHex(txHash);
      return this.fetchEndpoint("starknet_traceTransaction", { transaction_hash });
    }
    /**
     * Get the status of a transaction
     */
    getTransactionStatus(transactionHash) {
      const transaction_hash = toHex(transactionHash);
      return this.fetchEndpoint("starknet_getTransactionStatus", { transaction_hash });
    }
    /**
     * @param invocations AccountInvocations
     * @param simulateTransactionOptions blockIdentifier and flags to skip validation and fee charge<br/>
     * - blockIdentifier<br/>
     * - skipValidate (default false)<br/>
     * - skipFeeCharge (default true)<br/>
     */
    simulateTransaction(invocations, simulateTransactionOptions = {}) {
      const {
        blockIdentifier = this.blockIdentifier,
        skipValidate = true,
        skipFeeCharge = true
      } = simulateTransactionOptions;
      const block_id = new Block(blockIdentifier).identifier;
      const simulationFlags = [];
      if (skipValidate) simulationFlags.push(ESimulationFlag.SKIP_VALIDATE);
      if (skipFeeCharge) simulationFlags.push(ESimulationFlag.SKIP_FEE_CHARGE);
      return this.fetchEndpoint("starknet_simulateTransactions", {
        block_id,
        transactions: invocations.map((it) => this.buildTransaction(it)),
        simulation_flags: simulationFlags
      });
    }
    async waitForTransaction(txHash, options) {
      const transactionHash = toHex(txHash);
      let { retries } = this;
      let onchain = false;
      let isErrorState = false;
      const retryInterval = options?.retryInterval ?? this.transactionRetryIntervalDefault;
      const errorStates = options?.errorStates ?? [
        ETransactionStatus.REJECTED
        // TODO: commented out to preserve the long-standing behavior of "reverted" not being treated as an error by default
        // should decide which behavior to keep in the future
        // RPC.ETransactionExecutionStatus.REVERTED,
      ];
      const successStates = options?.successStates ?? [
        ETransactionExecutionStatus.SUCCEEDED,
        ETransactionStatus.ACCEPTED_ON_L2,
        ETransactionStatus.ACCEPTED_ON_L1
      ];
      let txStatus;
      while (!onchain) {
        await wait(retryInterval);
        try {
          txStatus = await this.getTransactionStatus(transactionHash);
          const executionStatus = txStatus.execution_status;
          const finalityStatus = txStatus.finality_status;
          if (!finalityStatus) {
            const error2 = new Error("waiting for transaction status");
            throw error2;
          }
          if (errorStates.includes(executionStatus) || errorStates.includes(finalityStatus)) {
            const message = `${executionStatus}: ${finalityStatus}`;
            const error2 = new Error(message);
            error2.response = txStatus;
            isErrorState = true;
            throw error2;
          } else if (successStates.includes(executionStatus) || successStates.includes(finalityStatus)) {
            onchain = true;
          }
        } catch (error2) {
          if (error2 instanceof Error && isErrorState) {
            throw error2;
          }
          if (retries <= 0) {
            throw new Error(`waitForTransaction timed-out with retries ${this.retries}`);
          }
        }
        retries -= 1;
      }
      let txReceipt = null;
      while (txReceipt === null) {
        try {
          txReceipt = await this.getTransactionReceipt(transactionHash);
        } catch (error2) {
          if (retries <= 0) {
            throw new Error(`waitForTransaction timed-out with retries ${this.retries}`);
          }
        }
        retries -= 1;
        await wait(retryInterval);
      }
      return txReceipt;
    }
    getStorageAt(contractAddress, key, blockIdentifier = this.blockIdentifier) {
      const contract_address = toHex(contractAddress);
      const parsedKey = toStorageKey(key);
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getStorageAt", {
        contract_address,
        key: parsedKey,
        block_id
      });
    }
    getClassHashAt(contractAddress, blockIdentifier = this.blockIdentifier) {
      const contract_address = toHex(contractAddress);
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getClassHashAt", {
        block_id,
        contract_address
      });
    }
    getClass(classHash, blockIdentifier = this.blockIdentifier) {
      const class_hash = toHex(classHash);
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getClass", {
        class_hash,
        block_id
      });
    }
    getClassAt(contractAddress, blockIdentifier = this.blockIdentifier) {
      const contract_address = toHex(contractAddress);
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_getClassAt", {
        block_id,
        contract_address
      });
    }
    async getEstimateFee(invocations, { blockIdentifier = this.blockIdentifier, skipValidate = true }) {
      const block_id = new Block(blockIdentifier).identifier;
      let flags = {};
      if (!isVersion("0.5", await this.getSpecVersion())) {
        flags = {
          simulation_flags: skipValidate ? [ESimulationFlag.SKIP_VALIDATE] : []
        };
      }
      return this.fetchEndpoint("starknet_estimateFee", {
        request: invocations.map((it) => this.buildTransaction(it, "fee")),
        block_id,
        ...flags
      });
    }
    async invoke(functionInvocation, details) {
      let promise;
      if (!isV3Tx(details)) {
        promise = this.fetchEndpoint("starknet_addInvokeTransaction", {
          invoke_transaction: {
            sender_address: functionInvocation.contractAddress,
            calldata: CallData.toHex(functionInvocation.calldata),
            type: ETransactionType.INVOKE,
            max_fee: toHex(details.maxFee || 0),
            version: ETransactionVersion.V1,
            signature: signatureToHexArray(functionInvocation.signature),
            nonce: toHex(details.nonce)
          }
        });
        logger.warn(SYSTEM_MESSAGES.legacyTxWarningMessage, {
          version: ETransactionVersion.V1,
          type: ETransactionType.INVOKE
        });
      } else {
        promise = this.fetchEndpoint("starknet_addInvokeTransaction", {
          invoke_transaction: {
            type: ETransactionType.INVOKE,
            sender_address: functionInvocation.contractAddress,
            calldata: CallData.toHex(functionInvocation.calldata),
            version: ETransactionVersion.V3,
            signature: signatureToHexArray(functionInvocation.signature),
            nonce: toHex(details.nonce),
            resource_bounds: details.resourceBounds,
            tip: toHex(details.tip),
            paymaster_data: details.paymasterData.map((it) => toHex(it)),
            account_deployment_data: details.accountDeploymentData.map((it) => toHex(it)),
            nonce_data_availability_mode: details.nonceDataAvailabilityMode,
            fee_data_availability_mode: details.feeDataAvailabilityMode
          }
        });
      }
      return this.waitMode ? this.waitForTransaction((await promise).transaction_hash) : promise;
    }
    async declare({ contract, signature, senderAddress, compiledClassHash }, details) {
      let promise;
      if (!isSierra(contract) && !isV3Tx(details)) {
        promise = this.fetchEndpoint("starknet_addDeclareTransaction", {
          declare_transaction: {
            type: ETransactionType.DECLARE,
            contract_class: {
              program: contract.program,
              entry_points_by_type: contract.entry_points_by_type,
              abi: contract.abi
            },
            version: ETransactionVersion.V1,
            max_fee: toHex(details.maxFee || 0),
            signature: signatureToHexArray(signature),
            sender_address: senderAddress,
            nonce: toHex(details.nonce)
          }
        });
        logger.warn(SYSTEM_MESSAGES.legacyTxWarningMessage, {
          version: ETransactionVersion.V1,
          type: ETransactionType.DECLARE
        });
      } else if (isSierra(contract) && !isV3Tx(details)) {
        promise = this.fetchEndpoint("starknet_addDeclareTransaction", {
          declare_transaction: {
            type: ETransactionType.DECLARE,
            contract_class: {
              sierra_program: decompressProgram(contract.sierra_program),
              contract_class_version: contract.contract_class_version,
              entry_points_by_type: contract.entry_points_by_type,
              abi: contract.abi
            },
            compiled_class_hash: compiledClassHash || "",
            version: ETransactionVersion.V2,
            max_fee: toHex(details.maxFee || 0),
            signature: signatureToHexArray(signature),
            sender_address: senderAddress,
            nonce: toHex(details.nonce)
          }
        });
        logger.warn(SYSTEM_MESSAGES.legacyTxWarningMessage, {
          version: ETransactionVersion.V2,
          type: ETransactionType.DECLARE
        });
      } else if (isSierra(contract) && isV3Tx(details)) {
        promise = this.fetchEndpoint("starknet_addDeclareTransaction", {
          declare_transaction: {
            type: ETransactionType.DECLARE,
            sender_address: senderAddress,
            compiled_class_hash: compiledClassHash || "",
            version: ETransactionVersion.V3,
            signature: signatureToHexArray(signature),
            nonce: toHex(details.nonce),
            contract_class: {
              sierra_program: decompressProgram(contract.sierra_program),
              contract_class_version: contract.contract_class_version,
              entry_points_by_type: contract.entry_points_by_type,
              abi: contract.abi
            },
            resource_bounds: details.resourceBounds,
            tip: toHex(details.tip),
            paymaster_data: details.paymasterData.map((it) => toHex(it)),
            account_deployment_data: details.accountDeploymentData.map((it) => toHex(it)),
            nonce_data_availability_mode: details.nonceDataAvailabilityMode,
            fee_data_availability_mode: details.feeDataAvailabilityMode
          }
        });
      } else {
        throw Error("declare unspotted parameters");
      }
      return this.waitMode ? this.waitForTransaction((await promise).transaction_hash) : promise;
    }
    async deployAccount({ classHash, constructorCalldata, addressSalt, signature }, details) {
      let promise;
      if (!isV3Tx(details)) {
        promise = this.fetchEndpoint("starknet_addDeployAccountTransaction", {
          deploy_account_transaction: {
            constructor_calldata: CallData.toHex(constructorCalldata || []),
            class_hash: toHex(classHash),
            contract_address_salt: toHex(addressSalt || 0),
            type: ETransactionType.DEPLOY_ACCOUNT,
            max_fee: toHex(details.maxFee || 0),
            version: ETransactionVersion.V1,
            signature: signatureToHexArray(signature),
            nonce: toHex(details.nonce)
          }
        });
        logger.warn(SYSTEM_MESSAGES.legacyTxWarningMessage, {
          version: ETransactionVersion.V1,
          type: ETransactionType.DEPLOY_ACCOUNT
        });
      } else {
        promise = this.fetchEndpoint("starknet_addDeployAccountTransaction", {
          deploy_account_transaction: {
            type: ETransactionType.DEPLOY_ACCOUNT,
            version: ETransactionVersion.V3,
            signature: signatureToHexArray(signature),
            nonce: toHex(details.nonce),
            contract_address_salt: toHex(addressSalt || 0),
            constructor_calldata: CallData.toHex(constructorCalldata || []),
            class_hash: toHex(classHash),
            resource_bounds: details.resourceBounds,
            tip: toHex(details.tip),
            paymaster_data: details.paymasterData.map((it) => toHex(it)),
            nonce_data_availability_mode: details.nonceDataAvailabilityMode,
            fee_data_availability_mode: details.feeDataAvailabilityMode
          }
        });
      }
      return this.waitMode ? this.waitForTransaction((await promise).transaction_hash) : promise;
    }
    callContract(call, blockIdentifier = this.blockIdentifier) {
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_call", {
        request: {
          contract_address: call.contractAddress,
          entry_point_selector: getSelectorFromName(call.entrypoint),
          calldata: CallData.toHex(call.calldata)
        },
        block_id
      });
    }
    /**
     * NEW: Estimate the fee for a message from L1
     * @param message Message From L1
     */
    estimateMessageFee(message, blockIdentifier = this.blockIdentifier) {
      const { from_address, to_address, entry_point_selector, payload } = message;
      const formattedMessage = {
        from_address: validateAndParseEthAddress(from_address),
        to_address: toHex(to_address),
        entry_point_selector: getSelector(entry_point_selector),
        payload: getHexStringArray(payload)
      };
      const block_id = new Block(blockIdentifier).identifier;
      return this.fetchEndpoint("starknet_estimateMessageFee", {
        message: formattedMessage,
        block_id
      });
    }
    /**
     * Returns an object about the sync status, or false if the node is not synching
     * @returns Object with the stats data
     */
    getSyncingStats() {
      return this.fetchEndpoint("starknet_syncing");
    }
    /**
     * Returns all events matching the given filter
     * @returns events and the pagination of the events
     */
    getEvents(eventFilter) {
      return this.fetchEndpoint("starknet_getEvents", { filter: eventFilter });
    }
    buildTransaction(invocation, versionType) {
      const defaultVersions = getVersionsByType(versionType);
      let details;
      if (!isV3Tx(invocation)) {
        details = {
          signature: signatureToHexArray(invocation.signature),
          nonce: toHex(invocation.nonce),
          max_fee: toHex(invocation.maxFee || 0)
        };
        logger.warn(SYSTEM_MESSAGES.legacyTxWarningMessage, {
          version: invocation.version,
          type: invocation.type
        });
      } else {
        details = {
          signature: signatureToHexArray(invocation.signature),
          nonce: toHex(invocation.nonce),
          resource_bounds: invocation.resourceBounds,
          tip: toHex(invocation.tip),
          paymaster_data: invocation.paymasterData.map((it) => toHex(it)),
          nonce_data_availability_mode: invocation.nonceDataAvailabilityMode,
          fee_data_availability_mode: invocation.feeDataAvailabilityMode,
          account_deployment_data: invocation.accountDeploymentData.map((it) => toHex(it))
        };
      }
      if (invocation.type === TransactionType.INVOKE) {
        return {
          // v0 v1 v3
          type: ETransactionType.INVOKE,
          sender_address: invocation.contractAddress,
          calldata: CallData.toHex(invocation.calldata),
          version: toHex(invocation.version || defaultVersions.v3),
          ...details
        };
      }
      if (invocation.type === TransactionType.DECLARE) {
        if (!isSierra(invocation.contract)) {
          return {
            type: invocation.type,
            contract_class: invocation.contract,
            sender_address: invocation.senderAddress,
            version: toHex(invocation.version || defaultVersions.v1),
            ...details
          };
        }
        return {
          // Cairo 1 - v2 v3
          type: invocation.type,
          contract_class: {
            ...invocation.contract,
            sierra_program: decompressProgram(invocation.contract.sierra_program)
          },
          compiled_class_hash: invocation.compiledClassHash || "",
          sender_address: invocation.senderAddress,
          version: toHex(invocation.version || defaultVersions.v3),
          ...details
        };
      }
      if (invocation.type === TransactionType.DEPLOY_ACCOUNT) {
        const { account_deployment_data, ...restDetails } = details;
        return {
          type: invocation.type,
          constructor_calldata: CallData.toHex(invocation.constructorCalldata || []),
          class_hash: toHex(invocation.classHash),
          contract_address_salt: toHex(invocation.addressSalt || 0),
          version: toHex(invocation.version || defaultVersions.v3),
          ...restDetails
        };
      }
      throw Error("RPC buildTransaction received unknown TransactionType");
    }
  };
  var RPCResponseParser = class {
    static {
      __name(this, "RPCResponseParser");
    }
    margin;
    constructor(margin) {
      this.margin = margin;
    }
    estimatedFeeToMaxFee(estimatedFee) {
      return estimatedFeeToMaxFee(estimatedFee, this.margin?.maxFee);
    }
    estimateFeeToBounds(estimate) {
      return estimateFeeToBounds(
        estimate,
        this.margin?.l1BoundMaxAmount,
        this.margin?.l1BoundMaxPricePerUnit
      );
    }
    parseGetBlockResponse(res) {
      return { status: "PENDING", ...res };
    }
    parseTransactionReceipt(res) {
      if ("actual_fee" in res && isString(res.actual_fee)) {
        return {
          ...res,
          actual_fee: {
            amount: res.actual_fee,
            unit: "FRI"
          }
        };
      }
      return res;
    }
    parseFeeEstimateResponse(res) {
      const val = res[0];
      return {
        overall_fee: toBigInt(val.overall_fee),
        gas_consumed: toBigInt(val.gas_consumed),
        gas_price: toBigInt(val.gas_price),
        unit: val.unit,
        suggestedMaxFee: this.estimatedFeeToMaxFee(val.overall_fee),
        resourceBounds: this.estimateFeeToBounds(val),
        data_gas_consumed: val.data_gas_consumed ? toBigInt(val.data_gas_consumed) : 0n,
        data_gas_price: val.data_gas_price ? toBigInt(val.data_gas_price) : 0n
      };
    }
    parseFeeEstimateBulkResponse(res) {
      return res.map((val) => ({
        overall_fee: toBigInt(val.overall_fee),
        gas_consumed: toBigInt(val.gas_consumed),
        gas_price: toBigInt(val.gas_price),
        unit: val.unit,
        suggestedMaxFee: this.estimatedFeeToMaxFee(val.overall_fee),
        resourceBounds: this.estimateFeeToBounds(val),
        data_gas_consumed: val.data_gas_consumed ? toBigInt(val.data_gas_consumed) : 0n,
        data_gas_price: val.data_gas_price ? toBigInt(val.data_gas_price) : 0n
      }));
    }
    parseSimulateTransactionResponse(res) {
      return res.map((it) => {
        return {
          ...it,
          suggestedMaxFee: this.estimatedFeeToMaxFee(it.fee_estimation.overall_fee),
          resourceBounds: this.estimateFeeToBounds(it.fee_estimation)
        };
      });
    }
    parseContractClassResponse(res) {
      return {
        ...res,
        abi: isString(res.abi) ? JSON.parse(res.abi) : res.abi
      };
    }
    parseL1GasPriceResponse(res) {
      return res.l1_gas_price.price_in_wei;
    }
  };
  var ReceiptTx = class _ReceiptTx {
    static {
      __name(this, "_ReceiptTx");
    }
    statusReceipt;
    value;
    constructor(receipt) {
      [this.statusReceipt, this.value] = _ReceiptTx.isSuccess(receipt) ? ["success", receipt] : _ReceiptTx.isReverted(receipt) ? ["reverted", receipt] : _ReceiptTx.isRejected(receipt) ? ["rejected", receipt] : ["error", new Error("Unknown response type")];
      for (const [key] of Object.entries(this)) {
        Object.defineProperty(this, key, {
          enumerable: false
        });
      }
      for (const [key, value] of Object.entries(receipt)) {
        Object.defineProperty(this, key, {
          enumerable: true,
          writable: false,
          value
        });
      }
    }
    match(callbacks) {
      if (this.statusReceipt in callbacks) {
        return callbacks[this.statusReceipt](this.value);
      }
      return callbacks._();
    }
    isSuccess() {
      return this.statusReceipt === "success";
    }
    isReverted() {
      return this.statusReceipt === "reverted";
    }
    isRejected() {
      return this.statusReceipt === "rejected";
    }
    isError() {
      return this.statusReceipt === "error";
    }
    static isSuccess(transactionReceipt) {
      return transactionReceipt.execution_status === TransactionExecutionStatus.SUCCEEDED;
    }
    static isReverted(transactionReceipt) {
      return transactionReceipt.execution_status === TransactionExecutionStatus.REVERTED;
    }
    static isRejected(transactionReceipt) {
      return transactionReceipt.status === TransactionExecutionStatus.REJECTED;
    }
  };
  var typedData_exports = {};
  __export2(typedData_exports, {
    TypedDataRevision: /* @__PURE__ */ __name(() => TypedDataRevision, "TypedDataRevision"),
    encodeData: /* @__PURE__ */ __name(() => encodeData, "encodeData"),
    encodeType: /* @__PURE__ */ __name(() => encodeType, "encodeType"),
    encodeValue: /* @__PURE__ */ __name(() => encodeValue, "encodeValue"),
    getDependencies: /* @__PURE__ */ __name(() => getDependencies, "getDependencies"),
    getMessageHash: /* @__PURE__ */ __name(() => getMessageHash, "getMessageHash"),
    getStructHash: /* @__PURE__ */ __name(() => getStructHash, "getStructHash"),
    getTypeHash: /* @__PURE__ */ __name(() => getTypeHash, "getTypeHash"),
    isMerkleTreeType: /* @__PURE__ */ __name(() => isMerkleTreeType, "isMerkleTreeType"),
    prepareSelector: /* @__PURE__ */ __name(() => prepareSelector, "prepareSelector"),
    validateTypedData: /* @__PURE__ */ __name(() => validateTypedData, "validateTypedData"),
    verifyMessage: /* @__PURE__ */ __name(() => verifyMessage, "verifyMessage")
  });
  var merkle_exports = {};
  __export2(merkle_exports, {
    MerkleTree: /* @__PURE__ */ __name(() => MerkleTree, "MerkleTree"),
    proofMerklePath: /* @__PURE__ */ __name(() => proofMerklePath, "proofMerklePath")
  });
  var MerkleTree = class _MerkleTree {
    static {
      __name(this, "_MerkleTree");
    }
    leaves;
    branches = [];
    root;
    hashMethod;
    /**
     * Create a Merkle tree
     *
     * @param leafHashes hex-string array
     * @param hashMethod hash method to use, default: Pedersen
     * @returns created Merkle tree
     * @example
     * ```typescript
     * const leaves = ['0x1', '0x2', '0x3', '0x4', '0x5', '0x6', '0x7'];
     * const tree = new MerkleTree(leaves);
     * // tree = {
     * //   branches: [['0x5bb9440e2...', '0x262697b88...', ...], ['0x38118a340...', ...], ...],
     * //   leaves: ['0x1', '0x2', '0x3', '0x4', '0x5', '0x6', '0x7'],
     * //   root: '0x7f748c75e5bdb7ae28013f076b8ab650c4e01d3530c6e5ab665f9f1accbe7d4',
     * //   hashMethod: [Function computePedersenHash],
     * // }
     * ```
     */
    constructor(leafHashes, hashMethod = computePedersenHash) {
      this.hashMethod = hashMethod;
      this.leaves = leafHashes;
      this.root = this.build(leafHashes);
    }
    /** @ignore */
    build(leaves) {
      if (leaves.length === 1) {
        return leaves[0];
      }
      if (leaves.length !== this.leaves.length) {
        this.branches.push(leaves);
      }
      const newLeaves = [];
      for (let i = 0; i < leaves.length; i += 2) {
        if (i + 1 === leaves.length) {
          newLeaves.push(_MerkleTree.hash(leaves[i], "0x0", this.hashMethod));
        } else {
          newLeaves.push(_MerkleTree.hash(leaves[i], leaves[i + 1], this.hashMethod));
        }
      }
      return this.build(newLeaves);
    }
    /**
     * Calculate hash from ordered a and b, Pedersen hash default
     *
     * @param a first value
     * @param b second value
     * @param hashMethod hash method to use, default: Pedersen
     * @returns result of the hash function
     * @example
     * ```typescript
     * const result1 = MerkleTree.hash('0xabc', '0xdef');
     * // result1 = '0x484f029da7914ada038b1adf67fc83632364a3ebc2cd9349b41ab61626d9e82'
     *
     * const customHashMethod = (a, b) => `custom_${a}_${b}`;
     * const result2 = MerkleTree.hash('0xabc', '0xdef', customHashMethod);
     * // result2 = 'custom_2748_3567'
     * ```
     */
    static hash(a, b, hashMethod = computePedersenHash) {
      const [aSorted, bSorted] = [BigInt(a), BigInt(b)].sort((x, y) => x >= y ? 1 : -1);
      return hashMethod(aSorted, bSorted);
    }
    /**
     * Calculates the merkle membership proof path
     *
     * @param leaf hex-string
     * @param branch hex-string array
     * @param hashPath hex-string array
     * @returns collection of merkle proof hex-string hashes
     * @example
     * ```typescript
     * const leaves = ['0x1', '0x2', '0x3', '0x4', '0x5', '0x6', '0x7'];
     * const tree = new MerkleTree(leaves);
     * const result = tree.getProof('0x3');
     * // result = [
     * //   '0x4',
     * //   '0x5bb9440e27889a364bcb678b1f679ecd1347acdedcbf36e83494f857cc58026',
     * //   '0x8c0e46dd2df9aaf3a8ebfbc25408a582ad7fa7171f0698ddbbc5130b4b4e60',
     * // ]
     * ```
     */
    getProof(leaf, branch = this.leaves, hashPath = []) {
      const index = branch.indexOf(leaf);
      if (index === -1) {
        throw new Error("leaf not found");
      }
      if (branch.length === 1) {
        return hashPath;
      }
      const isLeft = index % 2 === 0;
      const neededBranch = (isLeft ? branch[index + 1] : branch[index - 1]) ?? "0x0";
      const newHashPath = [...hashPath, neededBranch];
      const currentBranchLevelIndex = this.leaves.length === branch.length ? -1 : this.branches.findIndex((b) => b.length === branch.length);
      const nextBranch = this.branches[currentBranchLevelIndex + 1] ?? [this.root];
      return this.getProof(
        _MerkleTree.hash(isLeft ? leaf : neededBranch, isLeft ? neededBranch : leaf, this.hashMethod),
        nextBranch,
        newHashPath
      );
    }
  };
  function proofMerklePath(root, leaf, path, hashMethod = computePedersenHash) {
    if (path.length === 0) {
      return root === leaf;
    }
    const [next, ...rest] = path;
    return proofMerklePath(root, MerkleTree.hash(leaf, next, hashMethod), rest, hashMethod);
  }
  __name(proofMerklePath, "proofMerklePath");
  var presetTypes = {
    u256: JSON.parse('[{ "name": "low", "type": "u128" }, { "name": "high", "type": "u128" }]'),
    TokenAmount: JSON.parse(
      '[{ "name": "token_address", "type": "ContractAddress" }, { "name": "amount", "type": "u256" }]'
    ),
    NftId: JSON.parse(
      '[{ "name": "collection_address", "type": "ContractAddress" }, { "name": "token_id", "type": "u256" }]'
    )
  };
  var revisionConfiguration = {
    [TypedDataRevision.ACTIVE]: {
      domain: "StarknetDomain",
      hashMethod: computePoseidonHashOnElements,
      hashMerkleMethod: computePoseidonHash,
      escapeTypeString: /* @__PURE__ */ __name((s) => `"${s}"`, "escapeTypeString"),
      presetTypes
    },
    [TypedDataRevision.LEGACY]: {
      domain: "StarkNetDomain",
      hashMethod: computePedersenHashOnElements,
      hashMerkleMethod: computePedersenHash,
      escapeTypeString: /* @__PURE__ */ __name((s) => s, "escapeTypeString"),
      presetTypes: {}
    }
  };
  function assertRange(data, type, { min, max }) {
    const value = BigInt(data);
    assert(value >= min && value <= max, `${value} (${type}) is out of bounds [${min}, ${max}]`);
  }
  __name(assertRange, "assertRange");
  function identifyRevision({ types, domain }) {
    if (revisionConfiguration[TypedDataRevision.ACTIVE].domain in types && domain.revision === TypedDataRevision.ACTIVE)
      return TypedDataRevision.ACTIVE;
    if (revisionConfiguration[TypedDataRevision.LEGACY].domain in types && (domain.revision ?? TypedDataRevision.LEGACY) === TypedDataRevision.LEGACY)
      return TypedDataRevision.LEGACY;
    return void 0;
  }
  __name(identifyRevision, "identifyRevision");
  function getHex(value) {
    try {
      return toHex(value);
    } catch (e) {
      if (isString(value)) {
        return toHex(encodeShortString(value));
      }
      throw new Error(`Invalid BigNumberish: ${value}`);
    }
  }
  __name(getHex, "getHex");
  function validateTypedData(data) {
    const typedData = data;
    return Boolean(
      typedData.message && typedData.primaryType && typedData.types && identifyRevision(typedData)
    );
  }
  __name(validateTypedData, "validateTypedData");
  function prepareSelector(selector) {
    return isHex2(selector) ? selector : getSelectorFromName(selector);
  }
  __name(prepareSelector, "prepareSelector");
  function isMerkleTreeType(type) {
    return type.type === "merkletree";
  }
  __name(isMerkleTreeType, "isMerkleTreeType");
  function getDependencies(types, type, dependencies = [], contains = "", revision = TypedDataRevision.LEGACY) {
    let dependencyTypes = [type];
    if (type[type.length - 1] === "*") {
      dependencyTypes = [type.slice(0, -1)];
    } else if (revision === TypedDataRevision.ACTIVE) {
      if (type === "enum") {
        dependencyTypes = [contains];
      } else if (type.match(/^\(.*\)$/)) {
        dependencyTypes = type.slice(1, -1).split(",").map((depType) => depType[depType.length - 1] === "*" ? depType.slice(0, -1) : depType);
      }
    }
    return dependencyTypes.filter((t) => !dependencies.includes(t) && types[t]).reduce(
      // This comment prevents prettier from rolling everything here into a single line.
      (p, depType) => [
        ...p,
        ...[
          depType,
          ...types[depType].reduce(
            (previous, t) => [
              ...previous,
              ...getDependencies(types, t.type, previous, t.contains, revision).filter(
                (dependency) => !previous.includes(dependency)
              )
            ],
            []
          )
        ].filter((dependency) => !p.includes(dependency))
      ],
      []
    );
  }
  __name(getDependencies, "getDependencies");
  function getMerkleTreeType(types, ctx) {
    if (ctx.parent && ctx.key) {
      const parentType = types[ctx.parent];
      const merkleType = parentType.find((t) => t.name === ctx.key);
      const isMerkleTree = isMerkleTreeType(merkleType);
      if (!isMerkleTree) {
        throw new Error(`${ctx.key} is not a merkle tree`);
      }
      if (merkleType.contains.endsWith("*")) {
        throw new Error(`Merkle tree contain property must not be an array but was given ${ctx.key}`);
      }
      return merkleType.contains;
    }
    return "raw";
  }
  __name(getMerkleTreeType, "getMerkleTreeType");
  function encodeType(types, type, revision = TypedDataRevision.LEGACY) {
    const allTypes = revision === TypedDataRevision.ACTIVE ? { ...types, ...revisionConfiguration[revision].presetTypes } : types;
    const [primary, ...dependencies] = getDependencies(
      allTypes,
      type,
      void 0,
      void 0,
      revision
    );
    const newTypes = !primary ? [] : [primary, ...dependencies.sort()];
    const esc = revisionConfiguration[revision].escapeTypeString;
    return newTypes.map((dependency) => {
      const dependencyElements = allTypes[dependency].map((t) => {
        const targetType = t.type === "enum" && revision === TypedDataRevision.ACTIVE ? t.contains : t.type;
        const typeString = targetType.match(/^\(.*\)$/) ? `(${targetType.slice(1, -1).split(",").map((e) => e ? esc(e) : e).join(",")})` : esc(targetType);
        return `${esc(t.name)}:${typeString}`;
      });
      return `${esc(dependency)}(${dependencyElements})`;
    }).join("");
  }
  __name(encodeType, "encodeType");
  function getTypeHash(types, type, revision = TypedDataRevision.LEGACY) {
    return getSelectorFromName(encodeType(types, type, revision));
  }
  __name(getTypeHash, "getTypeHash");
  function encodeValue(types, type, data, ctx = {}, revision = TypedDataRevision.LEGACY) {
    if (types[type]) {
      return [type, getStructHash(types, type, data, revision)];
    }
    if (revisionConfiguration[revision].presetTypes[type]) {
      return [
        type,
        getStructHash(
          revisionConfiguration[revision].presetTypes,
          type,
          data,
          revision
        )
      ];
    }
    if (type.endsWith("*")) {
      const hashes = data.map(
        (entry) => encodeValue(types, type.slice(0, -1), entry, void 0, revision)[1]
      );
      return [type, revisionConfiguration[revision].hashMethod(hashes)];
    }
    switch (type) {
      case "enum": {
        if (revision === TypedDataRevision.ACTIVE) {
          const [variantKey, variantData] = Object.entries(data)[0];
          const parentType = types[ctx.parent].find((t) => t.name === ctx.key);
          const enumType = types[parentType.contains];
          const variantType = enumType.find((t) => t.name === variantKey);
          const variantIndex = enumType.indexOf(variantType);
          const encodedSubtypes = variantType.type.slice(1, -1).split(",").map((subtype, index) => {
            if (!subtype) return subtype;
            const subtypeData = variantData[index];
            return encodeValue(types, subtype, subtypeData, void 0, revision)[1];
          });
          return [
            type,
            revisionConfiguration[revision].hashMethod([variantIndex, ...encodedSubtypes])
          ];
        }
        return [type, getHex(data)];
      }
      case "merkletree": {
        const merkleTreeType = getMerkleTreeType(types, ctx);
        const structHashes = data.map((struct) => {
          return encodeValue(types, merkleTreeType, struct, void 0, revision)[1];
        });
        const { root } = new MerkleTree(
          structHashes,
          revisionConfiguration[revision].hashMerkleMethod
        );
        return ["felt", root];
      }
      case "selector": {
        return ["felt", prepareSelector(data)];
      }
      case "string": {
        if (revision === TypedDataRevision.ACTIVE) {
          const byteArray = byteArrayFromString(data);
          const elements = [
            byteArray.data.length,
            ...byteArray.data,
            byteArray.pending_word,
            byteArray.pending_word_len
          ];
          return [type, revisionConfiguration[revision].hashMethod(elements)];
        }
        return [type, getHex(data)];
      }
      case "i128": {
        if (revision === TypedDataRevision.ACTIVE) {
          const value = BigInt(data);
          assertRange(value, type, RANGE_I128);
          return [type, getHex(value < 0n ? PRIME + value : value)];
        }
        return [type, getHex(data)];
      }
      case "timestamp":
      case "u128": {
        if (revision === TypedDataRevision.ACTIVE) {
          assertRange(data, type, RANGE_U128);
        }
        return [type, getHex(data)];
      }
      case "felt":
      case "shortstring": {
        if (revision === TypedDataRevision.ACTIVE) {
          assertRange(getHex(data), type, RANGE_FELT);
        }
        return [type, getHex(data)];
      }
      case "ClassHash":
      case "ContractAddress": {
        if (revision === TypedDataRevision.ACTIVE) {
          assertRange(data, type, RANGE_FELT);
        }
        return [type, getHex(data)];
      }
      case "bool": {
        if (revision === TypedDataRevision.ACTIVE) {
          assert(isBoolean(data), `Type mismatch for ${type} ${data}`);
        }
        return [type, getHex(data)];
      }
      default: {
        if (revision === TypedDataRevision.ACTIVE) {
          throw new Error(`Unsupported type: ${type}`);
        }
        return [type, getHex(data)];
      }
    }
  }
  __name(encodeValue, "encodeValue");
  function encodeData(types, type, data, revision = TypedDataRevision.LEGACY) {
    const targetType = types[type] ?? revisionConfiguration[revision].presetTypes[type];
    const [returnTypes, values] = targetType.reduce(
      ([ts, vs], field) => {
        if (data[field.name] === void 0 || data[field.name] === null && field.type !== "enum") {
          throw new Error(`Cannot encode data: missing data for '${field.name}'`);
        }
        const value = data[field.name];
        const ctx = { parent: type, key: field.name };
        const [t, encodedValue] = encodeValue(types, field.type, value, ctx, revision);
        return [
          [...ts, t],
          [...vs, encodedValue]
        ];
      },
      [["felt"], [getTypeHash(types, type, revision)]]
    );
    return [returnTypes, values];
  }
  __name(encodeData, "encodeData");
  function getStructHash(types, type, data, revision = TypedDataRevision.LEGACY) {
    return revisionConfiguration[revision].hashMethod(encodeData(types, type, data, revision)[1]);
  }
  __name(getStructHash, "getStructHash");
  function getMessageHash(typedData, account) {
    if (!validateTypedData(typedData)) {
      throw new Error("Typed data does not match JSON schema");
    }
    const revision = identifyRevision(typedData);
    const { domain, hashMethod } = revisionConfiguration[revision];
    const message = [
      encodeShortString("StarkNet Message"),
      getStructHash(typedData.types, domain, typedData.domain, revision),
      account,
      getStructHash(typedData.types, typedData.primaryType, typedData.message, revision)
    ];
    return hashMethod(message);
  }
  __name(getMessageHash, "getMessageHash");
  function verifyMessage(message, signature, fullPublicKey, accountAddress) {
    const isTypedData = validateTypedData(message);
    if (!isBigNumberish(message) && !isTypedData) {
      throw new Error("message has a wrong format.");
    }
    if (isTypedData && accountAddress === void 0) {
      throw new Error(
        "When providing a TypedData in message parameter, the accountAddress parameter has to be provided."
      );
    }
    if (isTypedData && !isBigNumberish(accountAddress)) {
      throw new Error("accountAddress shall be a BigNumberish");
    }
    const messageHash = isTypedData ? getMessageHash(message, accountAddress) : toHex(message);
    const sign2 = Array.isArray(signature) ? new Signature(BigInt(signature[0]), BigInt(signature[1])) : signature;
    const fullPubKey = toHex(fullPublicKey);
    const isValid = verify(sign2, messageHash, fullPubKey);
    return isValid;
  }
  __name(verifyMessage, "verifyMessage");
  var RpcProvider = class {
    static {
      __name(this, "RpcProvider");
    }
    responseParser;
    channel;
    constructor(optionsOrProvider) {
      if (optionsOrProvider && "channel" in optionsOrProvider) {
        this.channel = optionsOrProvider.channel;
        this.responseParser = "responseParser" in optionsOrProvider ? optionsOrProvider.responseParser : new RPCResponseParser();
      } else {
        this.channel = new RpcChannel2({ ...optionsOrProvider, waitMode: false });
        this.responseParser = new RPCResponseParser(optionsOrProvider?.feeMarginPercentage);
      }
    }
    fetch(method, params, id = 0) {
      return this.channel.fetch(method, params, id);
    }
    async getChainId() {
      return this.channel.getChainId();
    }
    async getSpecVersion() {
      return this.channel.getSpecVersion();
    }
    async getNonceForAddress(contractAddress, blockIdentifier) {
      return this.channel.getNonceForAddress(contractAddress, blockIdentifier);
    }
    async getBlock(blockIdentifier) {
      return this.channel.getBlockWithTxHashes(blockIdentifier).then(this.responseParser.parseGetBlockResponse);
    }
    /**
     * Get the most recent accepted block hash and number
     */
    async getBlockLatestAccepted() {
      return this.channel.getBlockLatestAccepted();
    }
    /**
     * Get the most recent accepted block number
     * redundant use getBlockLatestAccepted();
     * @returns Number of the latest block
     */
    async getBlockNumber() {
      return this.channel.getBlockNumber();
    }
    async getBlockWithTxHashes(blockIdentifier) {
      return this.channel.getBlockWithTxHashes(blockIdentifier);
    }
    async getBlockWithTxs(blockIdentifier) {
      return this.channel.getBlockWithTxs(blockIdentifier);
    }
    /**
     * Pause the execution of the script until a specified block is created.
     * @param {BlockIdentifier} blockIdentifier bloc number (BigNumberish) or 'pending' or 'latest'.
     * Use of 'latest" or of a block already created will generate no pause.
     * @param {number} [retryInterval] number of milliseconds between 2 requests to the node
     * @example
     * ```typescript
     * await myProvider.waitForBlock();
     * // wait the creation of the pending block
     * ```
     */
    async waitForBlock(blockIdentifier = "pending", retryInterval = 5e3) {
      if (blockIdentifier === BlockTag.LATEST) return;
      const currentBlock = await this.getBlockNumber();
      const targetBlock = blockIdentifier === BlockTag.PENDING ? currentBlock + 1 : Number(toHex(blockIdentifier));
      if (targetBlock <= currentBlock) return;
      const { retries } = this.channel;
      let retriesCount = retries;
      let isTargetBlock = false;
      while (!isTargetBlock) {
        const currBlock = await this.getBlockNumber();
        if (currBlock === targetBlock) {
          isTargetBlock = true;
        } else {
          await wait(retryInterval);
        }
        retriesCount -= 1;
        if (retriesCount <= 0) {
          throw new Error(`waitForBlock() timed-out after ${retries} tries.`);
        }
      }
    }
    async getL1GasPrice(blockIdentifier) {
      return this.channel.getBlockWithTxHashes(blockIdentifier).then(this.responseParser.parseL1GasPriceResponse);
    }
    async getL1MessageHash(l2TxHash) {
      const transaction = await this.channel.getTransactionByHash(l2TxHash);
      assert(transaction.type === "L1_HANDLER", "This L2 transaction is not a L1 message.");
      const { calldata, contract_address, entry_point_selector, nonce } = transaction;
      const params = [
        calldata[0],
        contract_address,
        nonce,
        entry_point_selector,
        calldata.length - 1,
        ...calldata.slice(1)
      ];
      return solidityUint256PackedKeccak256(params);
    }
    async getBlockWithReceipts(blockIdentifier) {
      if (this.channel instanceof rpc_0_6_exports.RpcChannel)
        throw new LibraryError("Unsupported method for RPC version");
      return this.channel.getBlockWithReceipts(blockIdentifier);
    }
    getStateUpdate = this.getBlockStateUpdate;
    async getBlockStateUpdate(blockIdentifier) {
      return this.channel.getBlockStateUpdate(blockIdentifier);
    }
    async getBlockTransactionsTraces(blockIdentifier) {
      return this.channel.getBlockTransactionsTraces(blockIdentifier);
    }
    async getBlockTransactionCount(blockIdentifier) {
      return this.channel.getBlockTransactionCount(blockIdentifier);
    }
    /**
     * Return transactions from pending block
     * @deprecated Instead use getBlock(BlockTag.PENDING); (will be removed in next minor version)
     * Utility method, same result can be achieved using getBlockWithTxHashes(BlockTag.pending);
     */
    async getPendingTransactions() {
      const { transactions } = await this.getBlockWithTxHashes(BlockTag.PENDING).then(
        this.responseParser.parseGetBlockResponse
      );
      return Promise.all(transactions.map((it) => this.getTransactionByHash(it)));
    }
    async getTransaction(txHash) {
      return this.channel.getTransactionByHash(txHash);
    }
    async getTransactionByHash(txHash) {
      return this.channel.getTransactionByHash(txHash);
    }
    async getTransactionByBlockIdAndIndex(blockIdentifier, index) {
      return this.channel.getTransactionByBlockIdAndIndex(blockIdentifier, index);
    }
    async getTransactionReceipt(txHash) {
      const txReceiptWoHelper = await this.channel.getTransactionReceipt(txHash);
      const txReceiptWoHelperModified = this.responseParser.parseTransactionReceipt(txReceiptWoHelper);
      return new ReceiptTx(txReceiptWoHelperModified);
    }
    async getTransactionTrace(txHash) {
      return this.channel.getTransactionTrace(txHash);
    }
    /**
     * Get the status of a transaction
     */
    async getTransactionStatus(transactionHash) {
      return this.channel.getTransactionStatus(transactionHash);
    }
    /**
     * @param invocations AccountInvocations
     * @param options blockIdentifier and flags to skip validation and fee charge<br/>
     * - blockIdentifier<br/>
     * - skipValidate (default false)<br/>
     * - skipFeeCharge (default true)<br/>
     */
    async getSimulateTransaction(invocations, options) {
      return this.channel.simulateTransaction(invocations, options).then((r) => this.responseParser.parseSimulateTransactionResponse(r));
    }
    async waitForTransaction(txHash, options) {
      const receiptWoHelper = await this.channel.waitForTransaction(
        txHash,
        options
      );
      return new ReceiptTx(receiptWoHelper);
    }
    async getStorageAt(contractAddress, key, blockIdentifier) {
      return this.channel.getStorageAt(contractAddress, key, blockIdentifier);
    }
    async getClassHashAt(contractAddress, blockIdentifier) {
      return this.channel.getClassHashAt(contractAddress, blockIdentifier);
    }
    async getClassByHash(classHash) {
      return this.getClass(classHash);
    }
    async getClass(classHash, blockIdentifier) {
      return this.channel.getClass(classHash, blockIdentifier).then(this.responseParser.parseContractClassResponse);
    }
    async getClassAt(contractAddress, blockIdentifier) {
      return this.channel.getClassAt(contractAddress, blockIdentifier).then(this.responseParser.parseContractClassResponse);
    }
    async getContractVersion(contractAddress, classHash, {
      blockIdentifier = this.channel.blockIdentifier,
      compiler = true
    } = {}) {
      let contractClass;
      if (contractAddress) {
        contractClass = await this.getClassAt(contractAddress, blockIdentifier);
      } else if (classHash) {
        contractClass = await this.getClass(classHash, blockIdentifier);
      } else {
        throw Error("getContractVersion require contractAddress or classHash");
      }
      if (isSierra(contractClass)) {
        if (compiler) {
          const abiTest = getAbiContractVersion(contractClass.abi);
          return { cairo: "1", compiler: abiTest.compiler };
        }
        return { cairo: "1", compiler: void 0 };
      }
      return { cairo: "0", compiler: "0" };
    }
    /**
     * @deprecated use get*type*EstimateFee (will be refactored based on type after sequencer deprecation)
     */
    async getEstimateFee(invocation, invocationDetails, blockIdentifier, skipValidate) {
      return this.getInvokeEstimateFee(invocation, invocationDetails, blockIdentifier, skipValidate);
    }
    async getInvokeEstimateFee(invocation, invocationDetails, blockIdentifier, skipValidate) {
      return this.channel.getEstimateFee(
        [
          {
            type: TransactionType.INVOKE,
            ...invocation,
            ...invocationDetails
          }
        ],
        { blockIdentifier, skipValidate }
      ).then((r) => this.responseParser.parseFeeEstimateResponse(r));
    }
    async getDeclareEstimateFee(invocation, details, blockIdentifier, skipValidate) {
      return this.channel.getEstimateFee(
        [
          {
            type: TransactionType.DECLARE,
            ...invocation,
            ...details
          }
        ],
        { blockIdentifier, skipValidate }
      ).then((r) => this.responseParser.parseFeeEstimateResponse(r));
    }
    async getDeployAccountEstimateFee(invocation, details, blockIdentifier, skipValidate) {
      return this.channel.getEstimateFee(
        [
          {
            type: TransactionType.DEPLOY_ACCOUNT,
            ...invocation,
            ...details
          }
        ],
        { blockIdentifier, skipValidate }
      ).then((r) => this.responseParser.parseFeeEstimateResponse(r));
    }
    async getEstimateFeeBulk(invocations, options) {
      return this.channel.getEstimateFee(invocations, options).then((r) => this.responseParser.parseFeeEstimateBulkResponse(r));
    }
    async invokeFunction(functionInvocation, details) {
      return this.channel.invoke(functionInvocation, details);
    }
    async declareContract(transaction, details) {
      return this.channel.declare(transaction, details);
    }
    async deployAccountContract(transaction, details) {
      return this.channel.deployAccount(
        transaction,
        details
      );
    }
    async callContract(call, blockIdentifier) {
      return this.channel.callContract(call, blockIdentifier);
    }
    /**
     * NEW: Estimate the fee for a message from L1
     * @param message Message From L1
     */
    async estimateMessageFee(message, blockIdentifier) {
      return this.channel.estimateMessageFee(message, blockIdentifier);
    }
    /**
     * Returns an object about the sync status, or false if the node is not synching
     * @returns Object with the stats data
     */
    async getSyncingStats() {
      return this.channel.getSyncingStats();
    }
    /**
     * Returns all events matching the given filter
     * @returns events and the pagination of the events
     */
    async getEvents(eventFilter) {
      return this.channel.getEvents(eventFilter);
    }
    /**
     * Verify in Starknet a signature of a TypedData object or of a given hash.
     * @param {BigNumberish | TypedData} message TypedData object to be verified, or message hash to be verified.
     * @param {Signature} signature signature of the message.
     * @param {BigNumberish} accountAddress address of the account that has signed the message.
     * @param {string} [signatureVerificationFunctionName] if account contract with non standard account verification function name.
     * @param { okResponse: string[]; nokResponse: string[]; error: string[] } [signatureVerificationResponse] if account contract with non standard response of verification function.
     * @returns
     * ```typescript
     * const myTypedMessage: TypedMessage = .... ;
     * const messageHash = typedData.getMessageHash(myTypedMessage,accountAddress);
     * const sign: WeierstrassSignatureType = ec.starkCurve.sign(messageHash, privateKey);
     * const accountAddress = "0x43b7240d227aa2fb8434350b3321c40ac1b88c7067982549e7609870621b535";
     * const result1 = myRpcProvider.verifyMessageInStarknet(myTypedMessage, sign, accountAddress);
     * const result2 = myRpcProvider.verifyMessageInStarknet(messageHash, sign, accountAddress);
     * // result1 = result2 = true
     * ```
     */
    async verifyMessageInStarknet(message, signature, accountAddress, signatureVerificationFunctionName, signatureVerificationResponse) {
      const isTypedData = validateTypedData(message);
      if (!isBigNumberish(message) && !isTypedData) {
        throw new Error("message has a wrong format.");
      }
      if (!isBigNumberish(accountAddress)) {
        throw new Error("accountAddress shall be a BigNumberish");
      }
      const messageHash = isTypedData ? getMessageHash(message, accountAddress) : toHex(message);
      const knownSigVerificationFName = signatureVerificationFunctionName ? [signatureVerificationFunctionName] : ["isValidSignature", "is_valid_signature"];
      const knownSignatureResponse = signatureVerificationResponse || {
        okResponse: [
          // any non-nok response is true
        ],
        nokResponse: [
          "0x0",
          // Devnet
          "0x00"
          // OpenZeppelin 0.7.0 to 0.9.0 invalid signature
        ],
        error: [
          "argent/invalid-signature",
          // ArgentX 0.3.0 to 0.3.1
          "is invalid, with respect to the public key",
          // OpenZeppelin until 0.6.1, Braavos 0.0.11
          "INVALID_SIG"
          // Braavos 1.0.0
        ]
      };
      let error2;
      for (const SigVerificationFName of knownSigVerificationFName) {
        try {
          const resp = await this.callContract({
            contractAddress: toHex(accountAddress),
            entrypoint: SigVerificationFName,
            calldata: CallData.compile({
              hash: toBigInt(messageHash).toString(),
              signature: formatSignature(signature)
            })
          });
          if (knownSignatureResponse.nokResponse.includes(resp[0].toString())) {
            return false;
          }
          if (knownSignatureResponse.okResponse.length === 0 || knownSignatureResponse.okResponse.includes(resp[0].toString())) {
            return true;
          }
          throw Error("signatureVerificationResponse Error: response is not part of known responses");
        } catch (err2) {
          if (knownSignatureResponse.error.some(
            (errMessage) => err2.message.includes(errMessage)
          )) {
            return false;
          }
          error2 = err2;
        }
      }
      throw Error(`Signature verification Error: ${error2}`);
    }
    /**
     * Test if class is already declared from ContractClassIdentifier
     * Helper method using getClass
     * @param ContractClassIdentifier
     * @param blockIdentifier
     */
    async isClassDeclared(contractClassIdentifier, blockIdentifier) {
      let classHash;
      if (!contractClassIdentifier.classHash && "contract" in contractClassIdentifier) {
        const hashes = extractContractHashes(contractClassIdentifier);
        classHash = hashes.classHash;
      } else if (contractClassIdentifier.classHash) {
        classHash = contractClassIdentifier.classHash;
      } else {
        throw Error("contractClassIdentifier type not satisfied");
      }
      try {
        const result = await this.getClass(classHash, blockIdentifier);
        return result instanceof Object;
      } catch (error2) {
        if (error2 instanceof LibraryError) {
          return false;
        }
        throw error2;
      }
    }
    /**
     * Build bulk invocations with auto-detect declared class
     * 1. Test if class is declared if not declare it preventing already declared class error and not declared class errors
     * 2. Order declarations first
     * @param invocations
     */
    async prepareInvocations(invocations) {
      const bulk = [];
      for (const invocation of invocations) {
        if (invocation.type === TransactionType.DECLARE) {
          const isDeclared = await this.isClassDeclared(
            "payload" in invocation ? invocation.payload : invocation
          );
          if (!isDeclared) {
            bulk.unshift(invocation);
          }
        } else {
          bulk.push(invocation);
        }
      }
      return bulk;
    }
  };
  var starknetId_exports = {};
  __export2(starknetId_exports, {
    StarknetIdContract: /* @__PURE__ */ __name(() => StarknetIdContract, "StarknetIdContract"),
    StarknetIdIdentityContract: /* @__PURE__ */ __name(() => StarknetIdIdentityContract, "StarknetIdIdentityContract"),
    StarknetIdMulticallContract: /* @__PURE__ */ __name(() => StarknetIdMulticallContract, "StarknetIdMulticallContract"),
    StarknetIdPfpContract: /* @__PURE__ */ __name(() => StarknetIdPfpContract, "StarknetIdPfpContract"),
    StarknetIdPopContract: /* @__PURE__ */ __name(() => StarknetIdPopContract, "StarknetIdPopContract"),
    StarknetIdVerifierContract: /* @__PURE__ */ __name(() => StarknetIdVerifierContract, "StarknetIdVerifierContract"),
    dynamicCallData: /* @__PURE__ */ __name(() => dynamicCallData, "dynamicCallData"),
    dynamicFelt: /* @__PURE__ */ __name(() => dynamicFelt, "dynamicFelt"),
    execution: /* @__PURE__ */ __name(() => execution, "execution"),
    getStarknetIdContract: /* @__PURE__ */ __name(() => getStarknetIdContract, "getStarknetIdContract"),
    getStarknetIdIdentityContract: /* @__PURE__ */ __name(() => getStarknetIdIdentityContract, "getStarknetIdIdentityContract"),
    getStarknetIdMulticallContract: /* @__PURE__ */ __name(() => getStarknetIdMulticallContract, "getStarknetIdMulticallContract"),
    getStarknetIdPfpContract: /* @__PURE__ */ __name(() => getStarknetIdPfpContract, "getStarknetIdPfpContract"),
    getStarknetIdPopContract: /* @__PURE__ */ __name(() => getStarknetIdPopContract, "getStarknetIdPopContract"),
    getStarknetIdVerifierContract: /* @__PURE__ */ __name(() => getStarknetIdVerifierContract, "getStarknetIdVerifierContract"),
    isStarkDomain: /* @__PURE__ */ __name(() => isStarkDomain, "isStarkDomain"),
    useDecoded: /* @__PURE__ */ __name(() => useDecoded, "useDecoded"),
    useEncoded: /* @__PURE__ */ __name(() => useEncoded, "useEncoded")
  });
  var basicAlphabet = "abcdefghijklmnopqrstuvwxyz0123456789-";
  var basicSizePlusOne = BigInt(basicAlphabet.length + 1);
  var bigAlphabet = "\u8FD9\u6765";
  var basicAlphabetSize = BigInt(basicAlphabet.length);
  var bigAlphabetSize = BigInt(bigAlphabet.length);
  var bigAlphabetSizePlusOne = BigInt(bigAlphabet.length + 1);
  function extractStars(str) {
    let k = 0;
    while (str.endsWith(bigAlphabet[bigAlphabet.length - 1])) {
      str = str.substring(0, str.length - 1);
      k += 1;
    }
    return [str, k];
  }
  __name(extractStars, "extractStars");
  function useDecoded(encoded) {
    let decoded = "";
    encoded.forEach((subdomain) => {
      while (subdomain !== ZERO) {
        const code = subdomain % basicSizePlusOne;
        subdomain /= basicSizePlusOne;
        if (code === BigInt(basicAlphabet.length)) {
          const nextSubdomain = subdomain / bigAlphabetSizePlusOne;
          if (nextSubdomain === ZERO) {
            const code2 = subdomain % bigAlphabetSizePlusOne;
            subdomain = nextSubdomain;
            if (code2 === ZERO) decoded += basicAlphabet[0];
            else decoded += bigAlphabet[Number(code2) - 1];
          } else {
            const code2 = subdomain % bigAlphabetSize;
            decoded += bigAlphabet[Number(code2)];
            subdomain /= bigAlphabetSize;
          }
        } else decoded += basicAlphabet[Number(code)];
      }
      const [str, k] = extractStars(decoded);
      if (k)
        decoded = str + (k % 2 === 0 ? bigAlphabet[bigAlphabet.length - 1].repeat(k / 2 - 1) + bigAlphabet[0] + basicAlphabet[1] : bigAlphabet[bigAlphabet.length - 1].repeat((k - 1) / 2 + 1));
      decoded += ".";
    });
    if (!decoded) {
      return decoded;
    }
    return decoded.concat("stark");
  }
  __name(useDecoded, "useDecoded");
  function useEncoded(decoded) {
    let encoded = BigInt(0);
    let multiplier = BigInt(1);
    if (decoded.endsWith(bigAlphabet[0] + basicAlphabet[1])) {
      const [str, k] = extractStars(decoded.substring(0, decoded.length - 2));
      decoded = str + bigAlphabet[bigAlphabet.length - 1].repeat(2 * (k + 1));
    } else {
      const [str, k] = extractStars(decoded);
      if (k) decoded = str + bigAlphabet[bigAlphabet.length - 1].repeat(1 + 2 * (k - 1));
    }
    for (let i = 0; i < decoded.length; i += 1) {
      const char = decoded[i];
      const index = basicAlphabet.indexOf(char);
      const bnIndex = BigInt(basicAlphabet.indexOf(char));
      if (index !== -1) {
        if (i === decoded.length - 1 && decoded[i] === basicAlphabet[0]) {
          encoded += multiplier * basicAlphabetSize;
          multiplier *= basicSizePlusOne;
          multiplier *= basicSizePlusOne;
        } else {
          encoded += multiplier * bnIndex;
          multiplier *= basicSizePlusOne;
        }
      } else if (bigAlphabet.indexOf(char) !== -1) {
        encoded += multiplier * basicAlphabetSize;
        multiplier *= basicSizePlusOne;
        const newid = (i === decoded.length - 1 ? 1 : 0) + bigAlphabet.indexOf(char);
        encoded += multiplier * BigInt(newid);
        multiplier *= bigAlphabetSize;
      }
    }
    return encoded;
  }
  __name(useEncoded, "useEncoded");
  var StarknetIdContract = {
    MAINNET: "0x6ac597f8116f886fa1c97a23fa4e08299975ecaf6b598873ca6792b9bbfb678",
    TESTNET_SEPOLIA: "0x154bc2e1af9260b9e66af0e9c46fc757ff893b3ff6a85718a810baf1474"
  };
  function getStarknetIdContract(chainId) {
    switch (chainId) {
      case "0x534e5f4d41494e":
        return StarknetIdContract.MAINNET;
      case "0x534e5f5345504f4c4941":
        return StarknetIdContract.TESTNET_SEPOLIA;
      default:
        throw new Error("Starknet.id is not yet deployed on this network");
    }
  }
  __name(getStarknetIdContract, "getStarknetIdContract");
  var StarknetIdIdentityContract = {
    MAINNET: "0x05dbdedc203e92749e2e746e2d40a768d966bd243df04a6b712e222bc040a9af",
    TESTNET_SEPOLIA: "0x3697660a0981d734780731949ecb2b4a38d6a58fc41629ed611e8defda"
  };
  function getStarknetIdIdentityContract(chainId) {
    switch (chainId) {
      case "0x534e5f4d41494e":
        return StarknetIdIdentityContract.MAINNET;
      case "0x534e5f5345504f4c4941":
        return StarknetIdIdentityContract.TESTNET_SEPOLIA;
      default:
        throw new Error("Starknet.id verifier contract is not yet deployed on this network");
    }
  }
  __name(getStarknetIdIdentityContract, "getStarknetIdIdentityContract");
  var StarknetIdMulticallContract = "0x034ffb8f4452df7a613a0210824d6414dbadcddce6c6e19bf4ddc9e22ce5f970";
  function getStarknetIdMulticallContract(chainId) {
    switch (chainId) {
      case "0x534e5f4d41494e":
        return StarknetIdMulticallContract;
      case "0x534e5f5345504f4c4941":
        return StarknetIdMulticallContract;
      default:
        throw new Error("Starknet.id multicall contract is not yet deployed on this network");
    }
  }
  __name(getStarknetIdMulticallContract, "getStarknetIdMulticallContract");
  var StarknetIdVerifierContract = {
    MAINNET: "0x07d14dfd8ee95b41fce179170d88ba1f0d5a512e13aeb232f19cfeec0a88f8bf",
    TESTNET_SEPOLIA: "0x60B94fEDe525f815AE5E8377A463e121C787cCCf3a36358Aa9B18c12c4D566"
  };
  function getStarknetIdVerifierContract(chainId) {
    switch (chainId) {
      case "0x534e5f4d41494e":
        return StarknetIdVerifierContract.MAINNET;
      case "0x534e5f5345504f4c4941":
        return StarknetIdVerifierContract.TESTNET_SEPOLIA;
      default:
        throw new Error("Starknet.id verifier contract is not yet deployed on this network");
    }
  }
  __name(getStarknetIdVerifierContract, "getStarknetIdVerifierContract");
  var StarknetIdPfpContract = {
    MAINNET: "0x070aaa20ec4a46da57c932d9fd89ca5e6bb9ca3188d3df361a32306aff7d59c7",
    TESTNET_SEPOLIA: "0x9e7bdb8dabd02ea8cfc23b1d1c5278e46490f193f87516ed5ff2dfec02"
  };
  function getStarknetIdPfpContract(chainId) {
    switch (chainId) {
      case "0x534e5f4d41494e":
        return StarknetIdPfpContract.MAINNET;
      case "0x534e5f5345504f4c4941":
        return StarknetIdPfpContract.TESTNET_SEPOLIA;
      default:
        throw new Error(
          "Starknet.id profile picture verifier contract is not yet deployed on this network"
        );
    }
  }
  __name(getStarknetIdPfpContract, "getStarknetIdPfpContract");
  var StarknetIdPopContract = {
    MAINNET: "0x0293eb2ba9862f762bd3036586d5755a782bd22e6f5028320f1d0405fd47bff4",
    TESTNET_SEPOLIA: "0x15ae88ae054caa74090b89025c1595683f12edf7a4ed2ad0274de3e1d4a"
  };
  function getStarknetIdPopContract(chainId) {
    switch (chainId) {
      case "0x534e5f4d41494e":
        return StarknetIdPopContract.MAINNET;
      case "0x534e5f5345504f4c4941":
        return StarknetIdPopContract.TESTNET_SEPOLIA;
      default:
        throw new Error(
          "Starknet.id proof of personhood verifier contract is not yet deployed on this network"
        );
    }
  }
  __name(getStarknetIdPopContract, "getStarknetIdPopContract");
  function execution(staticEx, ifEqual = void 0, ifNotEqual = void 0) {
    return new CairoCustomEnum({
      Static: staticEx,
      IfEqual: ifEqual ? tuple(ifEqual[0], ifEqual[1], ifEqual[2]) : void 0,
      IfNotEqual: ifNotEqual ? tuple(ifNotEqual[0], ifNotEqual[1], ifNotEqual[2]) : void 0
    });
  }
  __name(execution, "execution");
  function dynamicFelt(hardcoded, reference = void 0) {
    return new CairoCustomEnum({
      Hardcoded: hardcoded,
      Reference: reference ? tuple(reference[0], reference[1]) : void 0
    });
  }
  __name(dynamicFelt, "dynamicFelt");
  function dynamicCallData(hardcoded, reference = void 0, arrayReference = void 0) {
    return new CairoCustomEnum({
      Hardcoded: hardcoded,
      Reference: reference ? tuple(reference[0], reference[1]) : void 0,
      ArrayReference: arrayReference ? tuple(arrayReference[0], arrayReference[1]) : void 0
    });
  }
  __name(dynamicCallData, "dynamicCallData");
  function isStarkDomain(domain) {
    return /^(?:[a-z0-9-]{1,48}(?:[a-z0-9-]{1,48}[a-z0-9-])?\.)*[a-z0-9-]{1,48}\.stark$/.test(domain);
  }
  __name(isStarkDomain, "isStarkDomain");
  var StarknetId = class _StarknetId {
    static {
      __name(this, "_StarknetId");
    }
    async getStarkName(address, StarknetIdContract2) {
      return _StarknetId.getStarkName(
        // After Mixin, this is ProviderInterface
        this,
        address,
        StarknetIdContract2
      );
    }
    async getAddressFromStarkName(name, StarknetIdContract2) {
      return _StarknetId.getAddressFromStarkName(
        // After Mixin, this is ProviderInterface
        this,
        name,
        StarknetIdContract2
      );
    }
    async getStarkProfile(address, StarknetIdContract2, StarknetIdIdentityContract2, StarknetIdVerifierContract2, StarknetIdPfpContract2, StarknetIdPopContract2, StarknetIdMulticallContract2) {
      return _StarknetId.getStarkProfile(
        // After Mixin, this is ProviderInterface
        this,
        address,
        StarknetIdContract2,
        StarknetIdIdentityContract2,
        StarknetIdVerifierContract2,
        StarknetIdPfpContract2,
        StarknetIdPopContract2,
        StarknetIdMulticallContract2
      );
    }
    static async getStarkName(provider, address, StarknetIdContract2) {
      const chainId = await provider.getChainId();
      const contract = StarknetIdContract2 ?? getStarknetIdContract(chainId);
      try {
        const hexDomain = await provider.callContract({
          contractAddress: contract,
          entrypoint: "address_to_domain",
          calldata: CallData.compile({
            address,
            hint: []
          })
        });
        const decimalDomain = hexDomain.map((element) => BigInt(element)).slice(1);
        const stringDomain = useDecoded(decimalDomain);
        if (!stringDomain) {
          throw Error("Starkname not found");
        }
        return stringDomain;
      } catch (e) {
        if (e instanceof Error && e.message === "Starkname not found") {
          throw e;
        }
        throw Error("Could not get stark name");
      }
    }
    static async getAddressFromStarkName(provider, name, StarknetIdContract2) {
      const starkName = name.endsWith(".stark") ? name : `${name}.stark`;
      if (!isStarkDomain(starkName)) {
        throw new Error("Invalid domain, must be a valid .stark domain");
      }
      const chainId = await provider.getChainId();
      const contract = StarknetIdContract2 ?? getStarknetIdContract(chainId);
      try {
        const encodedDomain = starkName.replace(".stark", "").split(".").map((part) => useEncoded(part).toString(10));
        const addressData = await provider.callContract({
          contractAddress: contract,
          entrypoint: "domain_to_address",
          calldata: CallData.compile({ domain: encodedDomain, hint: [] })
        });
        return addressData[0];
      } catch {
        throw Error("Could not get address from stark name");
      }
    }
    static async getStarkProfile(provider, address, StarknetIdContract2, StarknetIdIdentityContract2, StarknetIdVerifierContract2, StarknetIdPfpContract2, StarknetIdPopContract2, StarknetIdMulticallContract2) {
      const chainId = await provider.getChainId();
      const contract = StarknetIdContract2 ?? getStarknetIdContract(chainId);
      const identityContract = StarknetIdIdentityContract2 ?? getStarknetIdIdentityContract(chainId);
      const verifierContract = StarknetIdVerifierContract2 ?? getStarknetIdVerifierContract(chainId);
      const pfpContract = StarknetIdPfpContract2 ?? getStarknetIdPfpContract(chainId);
      const popContract = StarknetIdPopContract2 ?? getStarknetIdPopContract(chainId);
      const multicallAddress = StarknetIdMulticallContract2 ?? getStarknetIdMulticallContract(chainId);
      try {
        const calls = [
          {
            execution: execution({}),
            to: dynamicCallData(contract),
            selector: dynamicCallData(getSelectorFromName("address_to_domain")),
            calldata: [dynamicCallData(address), dynamicCallData("0")]
          },
          {
            execution: execution({}),
            to: dynamicFelt(contract),
            selector: dynamicFelt(getSelectorFromName("domain_to_id")),
            calldata: [dynamicCallData(void 0, void 0, [0, 0])]
          },
          {
            execution: execution({}),
            to: dynamicFelt(identityContract),
            selector: dynamicFelt(getSelectorFromName("get_verifier_data")),
            calldata: [
              dynamicCallData(void 0, [1, 0]),
              dynamicCallData(encodeShortString("twitter")),
              dynamicCallData(verifierContract),
              dynamicCallData("0")
            ]
          },
          {
            execution: execution({}),
            to: dynamicFelt(identityContract),
            selector: dynamicFelt(getSelectorFromName("get_verifier_data")),
            calldata: [
              dynamicCallData(void 0, [1, 0]),
              dynamicCallData(encodeShortString("github")),
              dynamicCallData(verifierContract),
              dynamicCallData("0")
            ]
          },
          {
            execution: execution({}),
            to: dynamicFelt(identityContract),
            selector: dynamicFelt(getSelectorFromName("get_verifier_data")),
            calldata: [
              dynamicCallData(void 0, [1, 0]),
              dynamicCallData(encodeShortString("discord")),
              dynamicCallData(verifierContract),
              dynamicCallData("0")
            ]
          },
          {
            execution: execution({}),
            to: dynamicFelt(identityContract),
            selector: dynamicFelt(getSelectorFromName("get_verifier_data")),
            calldata: [
              dynamicCallData(void 0, [1, 0]),
              dynamicCallData(encodeShortString("proof_of_personhood")),
              dynamicCallData(popContract),
              dynamicCallData("0")
            ]
          },
          // PFP
          {
            execution: execution({}),
            to: dynamicFelt(identityContract),
            selector: dynamicFelt(getSelectorFromName("get_verifier_data")),
            calldata: [
              dynamicCallData(void 0, [1, 0]),
              dynamicCallData(encodeShortString("nft_pp_contract")),
              dynamicCallData(pfpContract),
              dynamicCallData("0")
            ]
          },
          {
            execution: execution({}),
            to: dynamicFelt(identityContract),
            selector: dynamicFelt(getSelectorFromName("get_extended_verifier_data")),
            calldata: [
              dynamicCallData(void 0, [1, 0]),
              dynamicCallData(encodeShortString("nft_pp_id")),
              dynamicCallData("2"),
              dynamicCallData(pfpContract),
              dynamicCallData("0")
            ]
          },
          {
            execution: execution(void 0, void 0, [6, 0, 0]),
            to: dynamicFelt(void 0, [6, 0]),
            selector: dynamicFelt(getSelectorFromName("tokenURI")),
            calldata: [dynamicCallData(void 0, [7, 1]), dynamicCallData(void 0, [7, 2])]
          }
        ];
        const data = await provider.callContract({
          contractAddress: multicallAddress,
          entrypoint: "aggregate",
          calldata: CallData.compile({
            calls
          })
        });
        if (Array.isArray(data)) {
          const size = parseInt(data[0], 16);
          const finalArray = [];
          let index = 1;
          for (let i = 0; i < size; i += 1) {
            if (index < data.length) {
              const subArraySize = parseInt(data[index], 16);
              index += 1;
              const subArray = data.slice(index, index + subArraySize);
              finalArray.push(subArray);
              index += subArraySize;
            } else {
              break;
            }
          }
          const name = useDecoded(finalArray[0].slice(1).map((hexString) => BigInt(hexString)));
          const twitter = finalArray[2][0] !== "0x0" ? BigInt(finalArray[2][0]).toString() : void 0;
          const github = finalArray[3][0] !== "0x0" ? BigInt(finalArray[3][0]).toString() : void 0;
          const discord = finalArray[4][0] !== "0x0" ? BigInt(finalArray[4][0]).toString() : void 0;
          const proofOfPersonhood = finalArray[5][0] === "0x1";
          const profilePictureMetadata = data[0] === "0x9" ? finalArray[8].slice(1).map((val) => decodeShortString(val)).join("") : void 0;
          const profilePicture = profilePictureMetadata || `https://starknet.id/api/identicons/${BigInt(finalArray[1][0]).toString()}`;
          return {
            name,
            twitter,
            github,
            discord,
            proofOfPersonhood,
            profilePicture
          };
        }
        throw Error("Error while calling aggregate function");
      } catch (e) {
        if (e instanceof Error) {
          throw e;
        }
        throw Error("Could not get user stark profile data from address");
      }
    }
  };
  var RpcProvider2 = class extends Mixin(RpcProvider, StarknetId) {
    static {
      __name(this, "RpcProvider2");
    }
  };
  var defaultProvider = new RpcProvider({ default: true });
  var uint256_exports = {};
  __export2(uint256_exports, {
    UINT_128_MAX: /* @__PURE__ */ __name(() => UINT_128_MAX, "UINT_128_MAX"),
    UINT_256_MAX: /* @__PURE__ */ __name(() => UINT_256_MAX, "UINT_256_MAX"),
    bnToUint256: /* @__PURE__ */ __name(() => bnToUint256, "bnToUint256"),
    isUint256: /* @__PURE__ */ __name(() => isUint256, "isUint256"),
    uint256ToBN: /* @__PURE__ */ __name(() => uint256ToBN, "uint256ToBN")
  });
  function uint256ToBN(uint2562) {
    return new CairoUint256(uint2562).toBigInt();
  }
  __name(uint256ToBN, "uint256ToBN");
  function isUint256(bn) {
    return CairoUint256.is(bn);
  }
  __name(isUint256, "isUint256");
  function bnToUint256(bn) {
    return new CairoUint256(bn).toUint256HexString();
  }
  __name(bnToUint256, "bnToUint256");
  var events_exports = {};
  __export2(events_exports, {
    getAbiEvents: /* @__PURE__ */ __name(() => getAbiEvents, "getAbiEvents"),
    isAbiEvent: /* @__PURE__ */ __name(() => isAbiEvent, "isAbiEvent"),
    parseEvents: /* @__PURE__ */ __name(() => parseEvents, "parseEvents"),
    parseUDCEvent: /* @__PURE__ */ __name(() => parseUDCEvent, "parseUDCEvent")
  });
  function isAbiEvent(object) {
    return object.type === "event";
  }
  __name(isAbiEvent, "isAbiEvent");
  function getCairo0AbiEvents(abi) {
    return abi.filter((abiEntry) => abiEntry.type === "event").reduce((acc, abiEntry) => {
      const entryName = abiEntry.name;
      const abiEntryMod = { ...abiEntry };
      abiEntryMod.name = entryName;
      return {
        ...acc,
        [addHexPrefix(keccak(utf8ToArray(entryName)).toString(16))]: abiEntryMod
      };
    }, {});
  }
  __name(getCairo0AbiEvents, "getCairo0AbiEvents");
  function getCairo1AbiEvents(abi) {
    const abiEventsStructs = abi.filter((obj) => isAbiEvent(obj) && obj.kind === "struct");
    const abiEventsEnums = abi.filter((obj) => isAbiEvent(obj) && obj.kind === "enum");
    const abiEventsData = abiEventsStructs.reduce((acc, event) => {
      let nameList = [];
      let { name } = event;
      let flat = false;
      const findName = /* @__PURE__ */ __name((variant) => variant.type === name, "findName");
      while (true) {
        const eventEnum = abiEventsEnums.find((eventE) => eventE.variants.some(findName));
        if (isUndefined(eventEnum)) break;
        const variant = eventEnum.variants.find(findName);
        nameList.unshift(variant.name);
        if (variant.kind === "flat") flat = true;
        name = eventEnum.name;
      }
      if (nameList.length === 0) {
        throw new Error("inconsistency in ABI events definition.");
      }
      if (flat) nameList = [nameList[nameList.length - 1]];
      const final = nameList.pop();
      let result = {
        [addHexPrefix(keccak(utf8ToArray(final)).toString(16))]: event
      };
      while (nameList.length > 0) {
        result = {
          [addHexPrefix(keccak(utf8ToArray(nameList.pop())).toString(16))]: result
        };
      }
      result = { ...result };
      return mergeAbiEvents(acc, result);
    }, {});
    return abiEventsData;
  }
  __name(getCairo1AbiEvents, "getCairo1AbiEvents");
  function getAbiEvents(abi) {
    return isCairo1Abi(abi) ? getCairo1AbiEvents(abi) : getCairo0AbiEvents(abi);
  }
  __name(getAbiEvents, "getAbiEvents");
  function mergeAbiEvents(target, source) {
    const output = { ...target };
    if (isObject2(target) && isObject2(source)) {
      Object.keys(source).forEach((key) => {
        if (isObject2(source[key])) {
          if (!(key in target)) Object.assign(output, { [key]: source[key] });
          else output[key] = mergeAbiEvents(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }
  __name(mergeAbiEvents, "mergeAbiEvents");
  function parseEvents(providerReceivedEvents, abiEvents, abiStructs, abiEnums) {
    const ret = providerReceivedEvents.flat().reduce((acc, recEvent) => {
      let abiEvent = abiEvents[recEvent.keys.shift() ?? 0];
      if (!abiEvent) {
        return acc;
      }
      while (!abiEvent.name) {
        const hashName = recEvent.keys.shift();
        assert(!!hashName, 'Not enough data in "keys" property of this event.');
        abiEvent = abiEvent[hashName];
      }
      const parsedEvent = {};
      parsedEvent[abiEvent.name] = {};
      const keysIter = recEvent.keys[Symbol.iterator]();
      const dataIter = recEvent.data[Symbol.iterator]();
      const abiEventKeys = abiEvent.members?.filter((it) => it.kind === "key") || abiEvent.keys;
      const abiEventData = abiEvent.members?.filter((it) => it.kind === "data") || abiEvent.data;
      abiEventKeys.forEach((key) => {
        parsedEvent[abiEvent.name][key.name] = responseParser(
          keysIter,
          key,
          abiStructs,
          abiEnums,
          parsedEvent[abiEvent.name]
        );
      });
      abiEventData.forEach((data) => {
        parsedEvent[abiEvent.name][data.name] = responseParser(
          dataIter,
          data,
          abiStructs,
          abiEnums,
          parsedEvent[abiEvent.name]
        );
      });
      if ("block_hash" in recEvent) parsedEvent.block_hash = recEvent.block_hash;
      if ("block_number" in recEvent) parsedEvent.block_number = recEvent.block_number;
      if ("transaction_hash" in recEvent) parsedEvent.transaction_hash = recEvent.transaction_hash;
      acc.push(parsedEvent);
      return acc;
    }, []);
    return ret;
  }
  __name(parseEvents, "parseEvents");
  function parseUDCEvent(txReceipt) {
    if (!txReceipt.events?.length) {
      throw new Error("UDC emitted event is empty");
    }
    const event = txReceipt.events.find(
      (it) => cleanHex(it.from_address) === cleanHex(UDC.ADDRESS)
    ) || {
      data: []
    };
    return {
      transaction_hash: txReceipt.transaction_hash,
      contract_address: event.data[0],
      address: event.data[0],
      deployer: event.data[1],
      unique: event.data[2],
      classHash: event.data[3],
      calldata_len: event.data[4],
      calldata: event.data.slice(5, 5 + parseInt(event.data[4], 16)),
      salt: event.data[event.data.length - 1]
    };
  }
  __name(parseUDCEvent, "parseUDCEvent");
  var outsideExecution_exports = {};
  __export2(outsideExecution_exports, {
    buildExecuteFromOutsideCall: /* @__PURE__ */ __name(() => buildExecuteFromOutsideCall, "buildExecuteFromOutsideCall"),
    buildExecuteFromOutsideCallData: /* @__PURE__ */ __name(() => buildExecuteFromOutsideCallData, "buildExecuteFromOutsideCallData"),
    getOutsideCall: /* @__PURE__ */ __name(() => getOutsideCall, "getOutsideCall"),
    getTypedData: /* @__PURE__ */ __name(() => getTypedData, "getTypedData")
  });
  function getOutsideCall(call) {
    const callData = call.calldata ?? [];
    const callDataCompiled = Array.isArray(callData) ? callData : CallData.compile(callData);
    return {
      to: call.contractAddress,
      selector: getSelectorFromName(call.entrypoint),
      calldata: callDataCompiled
    };
  }
  __name(getOutsideCall, "getOutsideCall");
  function callToTypedData(call, version) {
    const outsideCall = getOutsideCall(call);
    if (version === "1") {
      return {
        ...outsideCall,
        calldata_len: outsideCall.calldata.length,
        calldata: outsideCall.calldata
      };
    }
    return {
      To: outsideCall.to,
      Selector: outsideCall.selector,
      Calldata: outsideCall.calldata
    };
  }
  __name(callToTypedData, "callToTypedData");
  function getDomain(chainId, version) {
    return {
      name: "Account.execute_from_outside",
      version,
      chainId,
      ...version === "2" ? { revision: "1" } : {}
    };
  }
  __name(getDomain, "getDomain");
  function getTypedData(chainId, options, nonce, myCalls, version) {
    if (version === "1") {
      return {
        types: OutsideExecutionTypesV1,
        primaryType: "OutsideExecution",
        domain: getDomain(chainId, version),
        message: {
          ...options,
          nonce,
          calls_len: myCalls.length,
          calls: myCalls.map((call) => callToTypedData(call, version))
        }
      };
    }
    return {
      types: OutsideExecutionTypesV2,
      primaryType: "OutsideExecution",
      domain: getDomain(chainId, version),
      message: {
        Caller: options.caller,
        Nonce: nonce,
        "Execute After": options.execute_after,
        "Execute Before": options.execute_before,
        Calls: myCalls.map((call) => callToTypedData(call, version))
      }
    };
  }
  __name(getTypedData, "getTypedData");
  function buildExecuteFromOutsideCallData(outsideTransaction) {
    const execution2 = outsideTransaction.outsideExecution;
    const formattedSignature = formatSignature(outsideTransaction.signature);
    return CallData.compile({
      outside_execution: execution2,
      signature: formattedSignature
    });
  }
  __name(buildExecuteFromOutsideCallData, "buildExecuteFromOutsideCallData");
  function buildExecuteFromOutsideCall(outsideTransaction) {
    const myOutsideTransactions = Array.isArray(outsideTransaction) ? outsideTransaction : [outsideTransaction];
    const multiCall = myOutsideTransactions.map((outsideTx) => {
      let entrypoint;
      if (outsideTx.version === "1") {
        entrypoint = "execute_from_outside";
      } else if (outsideTx.version === "2") {
        entrypoint = "execute_from_outside_v2";
      } else {
        throw new Error("Unsupported OutsideExecution version");
      }
      return {
        contractAddress: toHex(outsideTx.signerAddress),
        entrypoint,
        calldata: buildExecuteFromOutsideCallData(outsideTx)
      };
    });
    return multiCall;
  }
  __name(buildExecuteFromOutsideCall, "buildExecuteFromOutsideCall");
  var src5_exports = {};
  __export2(src5_exports, {
    supportsInterface: /* @__PURE__ */ __name(() => supportsInterface, "supportsInterface")
  });
  async function supportsInterface(provider, contractAddress, interfaceId) {
    const call = {
      contractAddress: toHex(contractAddress),
      entrypoint: "supports_interface",
      calldata: [toHex(interfaceId)]
    };
    try {
      const resp = await provider.callContract(call);
      return BigInt(resp[0]) !== 0n;
    } catch {
      return false;
    }
  }
  __name(supportsInterface, "supportsInterface");
  var connect_exports = {};
  __export2(connect_exports, {
    addDeclareTransaction: /* @__PURE__ */ __name(() => addDeclareTransaction, "addDeclareTransaction"),
    addInvokeTransaction: /* @__PURE__ */ __name(() => addInvokeTransaction, "addInvokeTransaction"),
    addStarknetChain: /* @__PURE__ */ __name(() => addStarknetChain, "addStarknetChain"),
    deploymentData: /* @__PURE__ */ __name(() => deploymentData, "deploymentData"),
    getPermissions: /* @__PURE__ */ __name(() => getPermissions, "getPermissions"),
    onAccountChange: /* @__PURE__ */ __name(() => onAccountChange, "onAccountChange"),
    onNetworkChanged: /* @__PURE__ */ __name(() => onNetworkChanged, "onNetworkChanged"),
    requestAccounts: /* @__PURE__ */ __name(() => requestAccounts, "requestAccounts"),
    requestChainId: /* @__PURE__ */ __name(() => requestChainId, "requestChainId"),
    signMessage: /* @__PURE__ */ __name(() => signMessage, "signMessage"),
    supportedSpecs: /* @__PURE__ */ __name(() => supportedSpecs, "supportedSpecs"),
    switchStarknetChain: /* @__PURE__ */ __name(() => switchStarknetChain, "switchStarknetChain"),
    watchAsset: /* @__PURE__ */ __name(() => watchAsset, "watchAsset")
  });
  function requestAccounts(swo, silent_mode = false) {
    return swo.request({
      type: "wallet_requestAccounts",
      params: { silent_mode }
    });
  }
  __name(requestAccounts, "requestAccounts");
  function getPermissions(swo) {
    return swo.request({ type: "wallet_getPermissions" });
  }
  __name(getPermissions, "getPermissions");
  function watchAsset(swo, asset) {
    return swo.request({ type: "wallet_watchAsset", params: asset });
  }
  __name(watchAsset, "watchAsset");
  function addStarknetChain(swo, chain2) {
    return swo.request({ type: "wallet_addStarknetChain", params: chain2 });
  }
  __name(addStarknetChain, "addStarknetChain");
  function switchStarknetChain(swo, chainId) {
    return swo.request({
      type: "wallet_switchStarknetChain",
      params: { chainId }
    });
  }
  __name(switchStarknetChain, "switchStarknetChain");
  function requestChainId(swo) {
    return swo.request({ type: "wallet_requestChainId" });
  }
  __name(requestChainId, "requestChainId");
  function deploymentData(swo) {
    return swo.request({ type: "wallet_deploymentData" });
  }
  __name(deploymentData, "deploymentData");
  function addInvokeTransaction(swo, params) {
    return swo.request({ type: "wallet_addInvokeTransaction", params });
  }
  __name(addInvokeTransaction, "addInvokeTransaction");
  function addDeclareTransaction(swo, params) {
    return swo.request({ type: "wallet_addDeclareTransaction", params });
  }
  __name(addDeclareTransaction, "addDeclareTransaction");
  function signMessage(swo, typedData) {
    return swo.request({ type: "wallet_signTypedData", params: typedData });
  }
  __name(signMessage, "signMessage");
  function supportedSpecs(swo) {
    return swo.request({ type: "wallet_supportedSpecs" });
  }
  __name(supportedSpecs, "supportedSpecs");
  function onAccountChange(swo, callback) {
    swo.on("accountsChanged", callback);
  }
  __name(onAccountChange, "onAccountChange");
  function onNetworkChanged(swo, callback) {
    swo.on("networkChanged", callback);
  }
  __name(onNetworkChanged, "onNetworkChanged");

  // node_modules/rosettanet/dist/index.mjs
  function padLeftTo32Bytes(input) {
    const length = input.length % 32 ? input.length + 32 - input.length % 32 : input.length;
    const result = new Uint8Array(length);
    result.set(input, result.length - input.length);
    return result;
  }
  __name(padLeftTo32Bytes, "padLeftTo32Bytes");
  function padRightTo32Bytes(input) {
    const length = input.length % 32 ? input.length + 32 - input.length % 32 : input.length;
    const result = new Uint8Array(length);
    result.set(input, 0);
    return result;
  }
  __name(padRightTo32Bytes, "padRightTo32Bytes");
  function concatenateBytes(source) {
    return new Uint8Array(source.flatMap((x) => [...x]));
  }
  __name(concatenateBytes, "concatenateBytes");
  function padAndLengthPrefix(source) {
    const length = source.length;
    const padded = padRightTo32Bytes(source);
    return concatenateBytes([integerToBytes(length), padded]);
  }
  __name(padAndLengthPrefix, "padAndLengthPrefix");
  function encodeDynamicData(encodedData) {
    let staticBytesSize = 0;
    for (let encodedParameter of encodedData) {
      if (encodedParameter.isDynamic) staticBytesSize += 32;
      else staticBytesSize += encodedParameter.bytes.length;
    }
    const staticBytes = [];
    const dynamicBytes = [];
    for (let encodedParameter of encodedData) {
      if (encodedParameter.isDynamic) {
        const dynamicBytesAppendedSoFar = dynamicBytes.reduce(
          (total, bytes) => total += bytes.length,
          0
        );
        staticBytes.push(integerToBytes(staticBytesSize + dynamicBytesAppendedSoFar));
        dynamicBytes.push(encodedParameter.bytes);
      } else {
        staticBytes.push(encodedParameter.bytes);
      }
    }
    return concatenateBytes([...staticBytes, ...dynamicBytes]);
  }
  __name(encodeDynamicData, "encodeDynamicData");
  function isEncodableArray(maybe) {
    return Array.isArray(maybe);
  }
  __name(isEncodableArray, "isEncodableArray");
  function integerToBytes(value, byteWidth = 32, signed = false) {
    return signed ? signedToBytes(value, byteWidth) : unsignedToBytes(value, byteWidth);
  }
  __name(integerToBytes, "integerToBytes");
  function unsignedToBytes(value, byteWidth = 32) {
    if (typeof value === "number") value = BigInt(value);
    const bits = byteWidth * 8;
    if (value >= 2n ** BigInt(bits) || value < 0n)
      throw new Error(`Cannot fit ${value} into a ${bits}-bit unsigned integer.`);
    const result = new Uint8Array(byteWidth);
    for (let i = 0; i < byteWidth; ++i) {
      result[i] = Number(value >> BigInt(bits - i * 8 - 8) & 0xffn);
    }
    return result;
  }
  __name(unsignedToBytes, "unsignedToBytes");
  function signedToBytes(value, byteWidth = 32) {
    if (typeof value === "number") value = BigInt(value);
    const bits = byteWidth * 8;
    if (value >= 2n ** (BigInt(bits) - 1n) || value < -(2n ** (BigInt(bits) - 1n)))
      throw new Error(`Cannot fit ${value} into a ${bits}-bit signed integer.`);
    const unsignedValue = twosComplement(value, bits);
    return unsignedToBytes(unsignedValue);
  }
  __name(signedToBytes, "signedToBytes");
  function twosComplement(value, numberOfBits) {
    const mask = 2n ** (BigInt(numberOfBits) - 1n) - 1n;
    return (value & mask) - (value & ~mask);
  }
  __name(twosComplement, "twosComplement");
  function parseSignature(functionSignature) {
    const signatureMatcher = /^([a-zA-Z_][a-zA-Z0-9_]+)\((.*)\)$/;
    const matchedSignature = signatureMatcher.exec(functionSignature);
    if (matchedSignature === null)
      throw new Error(`${functionSignature} is not a valid Solidity function signature.`);
    const name = matchedSignature[1];
    const inputs = parseParameters(matchedSignature[2]);
    return { type: "function", name, inputs, outputs: [] };
  }
  __name(parseSignature, "parseSignature");
  function parseParameters(functionParameters) {
    const parameters = [];
    let remainingParameters = functionParameters.trim();
    while (remainingParameters.length !== 0) {
      let { parameterDescription, remaining } = extractNextParameter(remainingParameters);
      remainingParameters = remaining;
      parameters.push(parameterDescription);
    }
    return parameters.map((x, i) => ({ ...x, name: x.name || `arg${i}` }));
  }
  __name(parseParameters, "parseParameters");
  function extractNextParameter(functionParameters) {
    let nesting = 0;
    let typeAndName = "";
    for (const character of functionParameters) {
      if (character === "(") ++nesting;
      if (character === ")") --nesting;
      if (nesting < 0)
        throw new Error(
          `${functionParameters} does not have matching number of open and close parenthesis`
        );
      if (nesting > 0) {
        typeAndName += character;
        continue;
      }
      if (character === ",") break;
      typeAndName += character;
    }
    const typeAndNameMatch = /^\s*(.+?)\s*(?:\s([a-zA-Z_][a-zA-Z0-9_]*))?\s*$/.exec(typeAndName);
    if (typeAndNameMatch === null)
      throw new Error(`${typeAndNameMatch} is not a valid parameter/name pair.`);
    let parameterType = typeAndNameMatch[1];
    let components = void 0;
    if (parameterType.startsWith("(")) {
      const tupleTypes = parameterType.slice(1, parameterType.lastIndexOf(")"));
      parameterType = `tuple${parameterType.slice(tupleTypes.length + 2)}`;
      components = parseParameters(tupleTypes);
    }
    const parameterName = typeAndNameMatch[2] || "";
    let remaining = functionParameters.slice(typeAndName.length);
    if (remaining.startsWith(",")) remaining = remaining.slice(1);
    remaining = remaining.trim();
    const parameterDescription = {
      name: parameterName,
      type: parameterType,
      components
    };
    return { parameterDescription, remaining };
  }
  __name(extractNextParameter, "extractNextParameter");
  function encodeParameters(descriptions, parameters) {
    if (descriptions.length !== parameters.length)
      throw new Error(
        `Number of provided parameters (${parameters.length}) does not match number of expected parameters (${descriptions.length})`
      );
    const encodedParameters = parameters.map(
      (nestedParameter, index) => encodeParameter(descriptions[index], nestedParameter)
    );
    return encodeDynamicData(encodedParameters);
  }
  __name(encodeParameters, "encodeParameters");
  function encodeParameter(description, parameter) {
    return tryEncodeFixedArray(description, parameter) || tryEncodeDynamicArray(description, parameter) || tryEncodeTuple(description, parameter) || tryEncodeDynamicBytes(description, parameter) || tryEncodeString(description, parameter) || tryEncodeBoolean(description, parameter) || tryEncodeNumber(description, parameter) || tryEncodeAddress(description, parameter) || tryEncodeFixedBytes(description, parameter) || tryEncodeFixedPointNumber(description) || tryEncodeFunction(description) || function() {
      throw new Error(`Unsupported parameter type ${description.type}`);
    }();
  }
  __name(encodeParameter, "encodeParameter");
  function tryEncodeFixedArray(description, parameter) {
    const match = /^(.*)\[(\d+)\]$/.exec(description.type);
    if (match === null) return null;
    const size = Number.parseInt(match[2]);
    if (!Array.isArray(parameter) || parameter.length !== size)
      throw new Error(
        `Can only encode a JavaScript 'array' of length ${size} into an EVM 'array' of length ${size}
${parameter}`
      );
    const nestedDescription = Object.assign({}, description, { type: match[1] });
    const encodedParameters = parameter.map(
      (nestedParameter) => encodeParameter(nestedDescription, nestedParameter)
    );
    const isDynamic = encodedParameters.some((x) => x.isDynamic);
    if (isDynamic) {
      return { isDynamic, bytes: encodeDynamicData(encodedParameters) };
    } else {
      return { isDynamic, bytes: concatenateBytes(encodedParameters.map((x) => x.bytes)) };
    }
  }
  __name(tryEncodeFixedArray, "tryEncodeFixedArray");
  function tryEncodeDynamicArray(description, parameter) {
    if (!description.type.endsWith("[]")) return null;
    if (!Array.isArray(parameter))
      throw new Error(`Can only encode a JavaScript 'array' into an EVM 'array'
${parameter}`);
    const nestedDescription = Object.assign({}, description, {
      type: description.type.substring(0, description.type.length - 2)
    });
    const encodedParameters = parameter.map(
      (nestedParameter) => encodeParameter(nestedDescription, nestedParameter)
    );
    const lengthBytes = integerToBytes(encodedParameters.length);
    return {
      isDynamic: true,
      bytes: concatenateBytes([lengthBytes, encodeDynamicData(encodedParameters)])
    };
  }
  __name(tryEncodeDynamicArray, "tryEncodeDynamicArray");
  function tryEncodeTuple(description, parameter) {
    if (description.type !== "tuple") return null;
    if (typeof parameter !== "object")
      throw new Error(
        `Can only encode a JavaScript 'object' or a JavaScript array into an EVM 'tuple'
${parameter}`
      );
    if (description.components === void 0 || description.components.length === 0) {
      return { isDynamic: false, bytes: new Uint8Array(0) };
    } else {
      const encodableTupleOrArray = parameter;
      const encodedComponents = description.components.map((component, index) => {
        const parameter2 = isEncodableArray(encodableTupleOrArray) ? encodableTupleOrArray[index] : encodableTupleOrArray[component.name];
        return encodeParameter(component, parameter2);
      });
      const isDynamic = encodedComponents.some((x) => x.isDynamic);
      return {
        isDynamic,
        bytes: isDynamic ? encodeDynamicData(encodedComponents) : concatenateBytes(encodedComponents.map((x) => x.bytes))
      };
    }
  }
  __name(tryEncodeTuple, "tryEncodeTuple");
  function tryEncodeDynamicBytes(description, parameter) {
    if (description.type !== "bytes") return null;
    if (!(parameter instanceof Uint8Array))
      throw new Error(`Can only encode a JavaScript 'Uint8Array' into EVM 'bytes'
${parameter}`);
    return { isDynamic: true, bytes: padAndLengthPrefix(parameter) };
  }
  __name(tryEncodeDynamicBytes, "tryEncodeDynamicBytes");
  function tryEncodeString(description, parameter) {
    if (description.type !== "string") return null;
    if (typeof parameter !== "string")
      throw new Error(`Can only encode a JavaScript 'string' into an EVM 'string'
${parameter}`);
    const encoded = new TextEncoder().encode(parameter);
    return { isDynamic: true, bytes: padAndLengthPrefix(encoded) };
  }
  __name(tryEncodeString, "tryEncodeString");
  function tryEncodeBoolean(description, parameter) {
    if (description.type !== "bool") return null;
    if (typeof parameter !== "boolean")
      throw new Error(`Can only encode JavaScript 'boolean' into EVM 'bool'
${parameter}`);
    const bytes = new Uint8Array(32);
    bytes.set([parameter ? 1 : 0], 31);
    return { isDynamic: false, bytes };
  }
  __name(tryEncodeBoolean, "tryEncodeBoolean");
  function tryEncodeNumber(description, parameter) {
    const match = /^(u?)int(\d*)$/.exec(description.type);
    if (match === null) return null;
    if (typeof parameter !== "bigint")
      throw new Error(
        `Can only encode a JavaScript 'bigint' into an EVM '${description.type}'
${parameter}`
      );
    const size = Number.parseInt(match[2]);
    if (size <= 0 || size > 256 || size % 8)
      throw new Error(`EVM numbers must be in range [8, 256] and must be divisible by 8.`);
    const signed = !match[1];
    if (!signed && parameter >= 2n ** BigInt(size))
      throw new Error(
        `Attempted to encode ${parameter} into a ${description.type}, but it is too big to fit.`
      );
    if (!signed && parameter < 0n)
      throw new Error(
        `Attempted to encode ${parameter} into a ${description.type}, but you cannot encode negative numbers into a ${description.type}.`
      );
    if (signed && parameter >= 2n ** BigInt(size - 1))
      throw new Error(
        `Attempted to encode ${parameter} into a ${description.type}, but it is too big to fit.`
      );
    if (signed && parameter < -(2n ** BigInt(size - 1)))
      throw new Error(
        `Attempted to encode ${parameter} into a ${description.type}, but it is too big (of a negative number) to fit.`
      );
    const bytes = integerToBytes(parameter, 32, signed);
    return { isDynamic: false, bytes };
  }
  __name(tryEncodeNumber, "tryEncodeNumber");
  function tryEncodeAddress(description, parameter) {
    if (description.type !== "address") return null;
    if (typeof parameter !== "bigint")
      throw new Error(`Can only encode JavaScript 'bigint' into EVM 'address'
${parameter}`);
    if (parameter > 0xffffffffffffffffffffffffffffffffffffffffn)
      throw new Error(
        `Attempted to encode 0x${parameter.toString(16)} into an EVM address, but it is too big to fit.`
      );
    if (parameter < 0n)
      throw new Error(
        `Attempted to encode ${parameter} into an EVM address, but addresses must be positive numbers.`
      );
    return { isDynamic: false, bytes: padLeftTo32Bytes(integerToBytes(parameter, 20)) };
  }
  __name(tryEncodeAddress, "tryEncodeAddress");
  function tryEncodeFixedBytes(description, parameter) {
    const match = /^bytes(\d+)$/.exec(description.type);
    if (match === null) return null;
    const size = Number.parseInt(match[1]);
    if (typeof parameter !== "bigint")
      throw new Error(`Can only encode JavaScript 'bigint' into EVM 'bytes${size}'
${parameter}`);
    if (parameter >= 2n ** BigInt(size * 8))
      throw new Error(
        `Attempted to encode 0x${parameter.toString(16)} into an EVM ${description.type}, but it is too big to fit.`
      );
    if (parameter < 0n)
      throw new Error(
        `Attempted to encode -0x${parameter.toString(16).slice(1)} into an EVM ${description.type}, but you cannot encode negative numbers into a ${description.type}.`
      );
    return { isDynamic: false, bytes: padRightTo32Bytes(integerToBytes(parameter, size)) };
  }
  __name(tryEncodeFixedBytes, "tryEncodeFixedBytes");
  function tryEncodeFixedPointNumber(description) {
    if (!/^u?fixed\d+x\d+$/.test(description.type)) return null;
    throw new Error(`Encoding into EVM type ${description.type} is not supported`);
  }
  __name(tryEncodeFixedPointNumber, "tryEncodeFixedPointNumber");
  function tryEncodeFunction(description) {
    if (description.type !== "function") return null;
    throw new Error(`Encoding into EVM type ${description.type} is not supported`);
  }
  __name(tryEncodeFunction, "tryEncodeFunction");
  function prepareMulticallCalldata(calls) {
    const functionDesc = parseSignature("multicall((uint256,uint256,uint256[])[])");
    const encodedParams = wireEncodeByteArray(
      encodeParameters(functionDesc.inputs, [
        calls.map((call) => [
          BigInt(call.contract_address),
          BigInt(call.entry_point),
          [...call.calldata.map((cd) => BigInt(cd))]
        ])
      ])
    );
    return encodedParams.replace("0x", "0x76971d7f");
  }
  __name(prepareMulticallCalldata, "prepareMulticallCalldata");
  function wireEncodeByteArray(bytes) {
    let result = "";
    for (let i = 0; i < bytes.length; ++i) {
      result += ("0" + bytes[i].toString(16)).slice(-2);
    }
    return `0x${result}`;
  }
  __name(wireEncodeByteArray, "wireEncodeByteArray");

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
        const accounts = await this.injected.request({
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
      const chain2 = `eip155:${chainId}`;
      if (!this.chains.includes(chain2)) {
        console.warn("Switched to unsupported chain:", chain2);
      }
      this.#account.chain = chain2;
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
        const chain2 = await this.#getEthereumChain();
        this.#account = { address: account, chain: chain2 };
        this.#emit("change", { accounts: this.accounts });
      }
    }
    #request = /* @__PURE__ */ __name(async (call) => {
      const mappedMethod = walletToEthereumRpcMap[call.type];
      if (!mappedMethod) {
        throw new Error(`Unsupported request type: ${call.type}`);
      }
      if (mappedMethod === "eth_sendTransaction" && call.params) {
        if (Array.isArray(call.params) === false) {
          throw new Error("Invalid calls parameter. Expected an array of calls.");
        }
        const arrayCalls = call.params.map((item) => [
          item.contractAddress,
          item.entrypoint,
          item.calldata
        ]);
        const txCalls = [].concat(arrayCalls).map((it) => {
          const entryPointValue = it[1];
          const entryPoint = entryPointValue.startsWith("0x") ? entryPointValue : hash_exports.getSelectorFromName(entryPointValue);
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
        const ethPayload2 = {
          method: mappedMethod,
          params: [txObject]
        };
        return this.injected.request(ethPayload2);
      }
      const ethPayload = {
        method: mappedMethod,
        params: call.params ? [call.params] : []
      };
      return this.injected.request(ethPayload);
    }, "#request");
    async #getEthereumChain() {
      const chainIdHex = await this.injected.request({
        type: "wallet_requestChainId"
      });
      const chainId = Number.parseInt(chainIdHex, 16).toString();
      const chain2 = `eip155:${chainId}`;
      if (chainId !== "1381192787") {
        throw new Error("Invalid Rosettanet chain");
      }
      return chain2;
    }
  };

  // src/types/index.ts
  var ETHEREUM_CHAIN_PREFIX = "eip155:";
  var STARKNET_CHAIN_PREFIX = "starknet:";
})();
/*! Bundled license information:

tough-cookie/lib/pubsuffix-psl.js:
  (*!
   * Copyright (c) 2018, Salesforce.com, Inc.
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice,
   * this list of conditions and the following disclaimer.
   *
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   * this list of conditions and the following disclaimer in the documentation
   * and/or other materials provided with the distribution.
   *
   * 3. Neither the name of Salesforce.com nor the names of its contributors may
   * be used to endorse or promote products derived from this software without
   * specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
   * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   * POSSIBILITY OF SUCH DAMAGE.
   *)

tough-cookie/lib/store.js:
  (*!
   * Copyright (c) 2015, Salesforce.com, Inc.
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice,
   * this list of conditions and the following disclaimer.
   *
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   * this list of conditions and the following disclaimer in the documentation
   * and/or other materials provided with the distribution.
   *
   * 3. Neither the name of Salesforce.com nor the names of its contributors may
   * be used to endorse or promote products derived from this software without
   * specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
   * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   * POSSIBILITY OF SUCH DAMAGE.
   *)

tough-cookie/lib/permuteDomain.js:
  (*!
   * Copyright (c) 2015, Salesforce.com, Inc.
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice,
   * this list of conditions and the following disclaimer.
   *
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   * this list of conditions and the following disclaimer in the documentation
   * and/or other materials provided with the distribution.
   *
   * 3. Neither the name of Salesforce.com nor the names of its contributors may
   * be used to endorse or promote products derived from this software without
   * specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
   * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   * POSSIBILITY OF SUCH DAMAGE.
   *)

tough-cookie/lib/pathMatch.js:
  (*!
   * Copyright (c) 2015, Salesforce.com, Inc.
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice,
   * this list of conditions and the following disclaimer.
   *
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   * this list of conditions and the following disclaimer in the documentation
   * and/or other materials provided with the distribution.
   *
   * 3. Neither the name of Salesforce.com nor the names of its contributors may
   * be used to endorse or promote products derived from this software without
   * specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
   * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   * POSSIBILITY OF SUCH DAMAGE.
   *)

tough-cookie/lib/memstore.js:
  (*!
   * Copyright (c) 2015, Salesforce.com, Inc.
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice,
   * this list of conditions and the following disclaimer.
   *
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   * this list of conditions and the following disclaimer in the documentation
   * and/or other materials provided with the distribution.
   *
   * 3. Neither the name of Salesforce.com nor the names of its contributors may
   * be used to endorse or promote products derived from this software without
   * specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
   * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   * POSSIBILITY OF SUCH DAMAGE.
   *)

tough-cookie/lib/cookie.js:
  (*!
   * Copyright (c) 2015-2020, Salesforce.com, Inc.
   * All rights reserved.
   *
   * Redistribution and use in source and binary forms, with or without
   * modification, are permitted provided that the following conditions are met:
   *
   * 1. Redistributions of source code must retain the above copyright notice,
   * this list of conditions and the following disclaimer.
   *
   * 2. Redistributions in binary form must reproduce the above copyright notice,
   * this list of conditions and the following disclaimer in the documentation
   * and/or other materials provided with the distribution.
   *
   * 3. Neither the name of Salesforce.com nor the names of its contributors may
   * be used to endorse or promote products derived from this software without
   * specific prior written permission.
   *
   * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
   * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
   * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
   * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
   * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
   * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
   * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
   * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
   * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
   * POSSIBILITY OF SUCH DAMAGE.
   *)

@scure/base/lib/esm/index.js:
  (*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/modular.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/poseidon.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/curve.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/weierstrass.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/hashes/esm/utils.js:
  (*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/_shortw_utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@scure/starknet/lib/esm/index.js:
  (*! scure-starknet - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/modular.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/poseidon.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/curve.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/abstract/weierstrass.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

pako/dist/pako.esm.mjs:
  (*! pako 2.1.0 https://github.com/nodeca/pako @license (MIT AND Zlib) *)

@noble/curves/esm/_shortw_utils.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)

@noble/curves/esm/secp256k1.js:
  (*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) *)
*/
//# sourceMappingURL=index.js.map