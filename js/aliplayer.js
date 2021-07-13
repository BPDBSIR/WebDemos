/*! Aliplayer - v2.9.3 - 2020-12-31 14.51.22 */
!function o(a, s, l) {
  function u(t, e) {
    if (!s[t]) {
      if (!a[t]) {
        var r = "function" == typeof require && require;
        if (!e && r) return r(t, !0);
        if (c) return c(t, !0);
        var i = new Error("Cannot find module '" + t + "'");
        throw i.code = "MODULE_NOT_FOUND", i
      }
      var n = s[t] = {exports: {}};
      a[t][0].call(n.exports, function (e) {
        return u(a[t][1][e] || e)
      }, n, n.exports, o, a, s, l)
    }
    return s[t].exports
  }

  for (var c = "function" == typeof require && require, e = 0; e < l.length; e++) u(l[e]);
  return u
}({
  1: [function (e, t, r) {
    var i = r;
    i.bignum = e("bn.js"), i.define = e("./asn1/api").define, i.base = e("./asn1/base"), i.constants = e("./asn1/constants"), i.decoders = e("./asn1/decoders"), i.encoders = e("./asn1/encoders")
  }, {
    "./asn1/api": 2,
    "./asn1/base": 4,
    "./asn1/constants": 8,
    "./asn1/decoders": 10,
    "./asn1/encoders": 13,
    "bn.js": 15
  }],
  2: [function (e, t, r) {
    var i = e("../asn1"), n = e("inherits");

    function o(e, t) {
      this.name = e, this.body = t, this.decoders = {}, this.encoders = {}
    }

    r.define = function (e, t) {
      return new o(e, t)
    }, o.prototype._createNamed = function (t) {
      var r;
      try {
        r = e("vm").runInThisContext("(function " + this.name + "(entity) {\n  this._initNamed(entity);\n})")
      } catch (e) {
        r = function (e) {
          this._initNamed(e)
        }
      }
      return n(r, t), r.prototype._initNamed = function (e) {
        t.call(this, e)
      }, new r(this)
    }, o.prototype._getDecoder = function (e) {
      return e = e || "der", this.decoders.hasOwnProperty(e) || (this.decoders[e] = this._createNamed(i.decoders[e])), this.decoders[e]
    }, o.prototype.decode = function (e, t, r) {
      return this._getDecoder(t).decode(e, r)
    }, o.prototype._getEncoder = function (e) {
      return e = e || "der", this.encoders.hasOwnProperty(e) || (this.encoders[e] = this._createNamed(i.encoders[e])), this.encoders[e]
    }, o.prototype.encode = function (e, t, r) {
      return this._getEncoder(t).encode(e, r)
    }
  }, {"../asn1": 1, inherits: 142, vm: 200}],
  3: [function (e, t, r) {
    var i = e("inherits"), n = e("../base").Reporter, o = e("buffer").Buffer;

    function a(e, t) {
      n.call(this, t), o.isBuffer(e) ? (this.base = e, this.offset = 0, this.length = e.length) : this.error("Input not Buffer")
    }

    function s(e, t) {
      if (Array.isArray(e)) this.length = 0, this.value = e.map(function (e) {
        return e instanceof s || (e = new s(e, t)), this.length += e.length, e
      }, this); else if ("number" == typeof e) {
        if (!(0 <= e && e <= 255)) return t.error("non-byte EncoderBuffer value");
        this.value = e, this.length = 1
      } else if ("string" == typeof e) this.value = e, this.length = o.byteLength(e); else {
        if (!o.isBuffer(e)) return t.error("Unsupported type: " + typeof e);
        this.value = e, this.length = e.length
      }
    }

    i(a, n), (r.DecoderBuffer = a).prototype.save = function () {
      return {offset: this.offset, reporter: n.prototype.save.call(this)}
    }, a.prototype.restore = function (e) {
      var t = new a(this.base);
      return t.offset = e.offset, t.length = this.offset, this.offset = e.offset, n.prototype.restore.call(this, e.reporter), t
    }, a.prototype.isEmpty = function () {
      return this.offset === this.length
    }, a.prototype.readUInt8 = function (e) {
      return this.offset + 1 <= this.length ? this.base.readUInt8(this.offset++, !0) : this.error(e || "DecoderBuffer overrun")
    }, a.prototype.skip = function (e, t) {
      if (!(this.offset + e <= this.length)) return this.error(t || "DecoderBuffer overrun");
      var r = new a(this.base);
      return r._reporterState = this._reporterState, r.offset = this.offset, r.length = this.offset + e, this.offset += e, r
    }, a.prototype.raw = function (e) {
      return this.base.slice(e ? e.offset : this.offset, this.length)
    }, (r.EncoderBuffer = s).prototype.join = function (t, r) {
      return t = t || new o(this.length), r = r || 0, 0 === this.length || (Array.isArray(this.value) ? this.value.forEach(function (e) {
        e.join(t, r), r += e.length
      }) : ("number" == typeof this.value ? t[r] = this.value : "string" == typeof this.value ? t.write(this.value, r) : o.isBuffer(this.value) && this.value.copy(t, r), r += this.length)), t
    }
  }, {"../base": 4, buffer: 64, inherits: 142}],
  4: [function (e, t, r) {
    var i = r;
    i.Reporter = e("./reporter").Reporter, i.DecoderBuffer = e("./buffer").DecoderBuffer, i.EncoderBuffer = e("./buffer").EncoderBuffer, i.Node = e("./node")
  }, {"./buffer": 3, "./node": 5, "./reporter": 6}],
  5: [function (e, t, r) {
    var c = e("../base").Reporter, i = e("../base").EncoderBuffer, f = e("../base").DecoderBuffer,
        n = e("minimalistic-assert"),
        o = ["seq", "seqof", "set", "setof", "objid", "bool", "gentime", "utctime", "null_", "enum", "int", "objDesc", "bitstr", "bmpstr", "charstr", "genstr", "graphstr", "ia5str", "iso646str", "numstr", "octstr", "printstr", "t61str", "unistr", "utf8str", "videostr"],
        a = ["key", "obj", "use", "optional", "explicit", "implicit", "def", "choice", "any", "contains"].concat(o);

    function s(e, t) {
      var r = {};
      (this._baseState = r).enc = e, r.parent = t || null, r.children = null, r.tag = null, r.args = null, r.reverseArgs = null, r.choice = null, r.optional = !1, r.any = !1, r.obj = !1, r.use = null, r.useDecoder = null, r.key = null, r["default"] = null, r.explicit = null, r.implicit = null, r.contains = null, r.parent || (r.children = [], this._wrap())
    }

    t.exports = s;
    var l = ["enc", "parent", "children", "tag", "args", "reverseArgs", "choice", "optional", "any", "obj", "use", "alteredUse", "key", "default", "explicit", "implicit", "contains"];
    s.prototype.clone = function () {
      var t = this._baseState, r = {};
      l.forEach(function (e) {
        r[e] = t[e]
      });
      var e = new this.constructor(r.parent);
      return e._baseState = r, e
    }, s.prototype._wrap = function () {
      var r = this._baseState;
      a.forEach(function (t) {
        this[t] = function () {
          var e = new this.constructor(this);
          return r.children.push(e), e[t].apply(e, arguments)
        }
      }, this)
    }, s.prototype._init = function (e) {
      var t = this._baseState;
      n(null === t.parent), e.call(this), t.children = t.children.filter(function (e) {
        return e._baseState.parent === this
      }, this), n.equal(t.children.length, 1, "Root node can have only one child")
    }, s.prototype._useArgs = function (e) {
      var t = this._baseState, r = e.filter(function (e) {
        return e instanceof this.constructor
      }, this);
      e = e.filter(function (e) {
        return !(e instanceof this.constructor)
      }, this), 0 !== r.length && (n(null === t.children), (t.children = r).forEach(function (e) {
        e._baseState.parent = this
      }, this)), 0 !== e.length && (n(null === t.args), t.args = e, t.reverseArgs = e.map(function (r) {
        if ("object" != typeof r || r.constructor !== Object) return r;
        var i = {};
        return Object.keys(r).forEach(function (e) {
          e == (0 | e) && (e |= 0);
          var t = r[e];
          i[t] = e
        }), i
      }))
    }, ["_peekTag", "_decodeTag", "_use", "_decodeStr", "_decodeObjid", "_decodeTime", "_decodeNull", "_decodeInt", "_decodeBool", "_decodeList", "_encodeComposite", "_encodeStr", "_encodeObjid", "_encodeTime", "_encodeNull", "_encodeInt", "_encodeBool"].forEach(function (t) {
      s.prototype[t] = function () {
        var e = this._baseState;
        throw new Error(t + " not implemented for encoding: " + e.enc)
      }
    }), o.forEach(function (r) {
      s.prototype[r] = function () {
        var e = this._baseState, t = Array.prototype.slice.call(arguments);
        return n(null === e.tag), e.tag = r, this._useArgs(t), this
      }
    }), s.prototype.use = function (e) {
      n(e);
      var t = this._baseState;
      return n(null === t.use), t.use = e, this
    }, s.prototype.optional = function () {
      return this._baseState.optional = !0, this
    }, s.prototype.def = function (e) {
      var t = this._baseState;
      return n(null === t["default"]), t["default"] = e, t.optional = !0, this
    }, s.prototype.explicit = function (e) {
      var t = this._baseState;
      return n(null === t.explicit && null === t.implicit), t.explicit = e, this
    }, s.prototype.implicit = function (e) {
      var t = this._baseState;
      return n(null === t.explicit && null === t.implicit), t.implicit = e, this
    }, s.prototype.obj = function () {
      var e = this._baseState, t = Array.prototype.slice.call(arguments);
      return e.obj = !0, 0 !== t.length && this._useArgs(t), this
    }, s.prototype.key = function (e) {
      var t = this._baseState;
      return n(null === t.key), t.key = e, this
    }, s.prototype.any = function () {
      return this._baseState.any = !0, this
    }, s.prototype.choice = function (t) {
      var e = this._baseState;
      return n(null === e.choice), e.choice = t, this._useArgs(Object.keys(t).map(function (e) {
        return t[e]
      })), this
    }, s.prototype.contains = function (e) {
      var t = this._baseState;
      return n(null === t.use), t.contains = e, this
    }, s.prototype._decode = function (t, r) {
      var e = this._baseState;
      if (null === e.parent) return t.wrapResult(e.children[0]._decode(t, r));
      var i, n = e["default"], o = !0, a = null;
      if (null !== e.key && (a = t.enterKey(e.key)), e.optional) {
        var s = null;
        if (null !== e.explicit ? s = e.explicit : null !== e.implicit ? s = e.implicit : null !== e.tag && (s = e.tag), null !== s || e.any) {
          if (o = this._peekTag(t, s, e.any), t.isError(o)) return o
        } else {
          var l = t.save();
          try {
            null === e.choice ? this._decodeGeneric(e.tag, t, r) : this._decodeChoice(t, r), o = !0
          } catch (e) {
            o = !1
          }
          t.restore(l)
        }
      }
      if (e.obj && o && (i = t.enterObject()), o) {
        if (null !== e.explicit) {
          var u = this._decodeTag(t, e.explicit);
          if (t.isError(u)) return u;
          t = u
        }
        var c, h = t.offset;
        if (null === e.use && null === e.choice) {
          e.any && (l = t.save());
          var d = this._decodeTag(t, null !== e.implicit ? e.implicit : e.tag, e.any);
          if (t.isError(d)) return d;
          e.any ? n = t.raw(l) : t = d
        }
        if (r && r.track && null !== e.tag && r.track(t.path(), h, t.length, "tagged"), r && r.track && null !== e.tag && r.track(t.path(), t.offset, t.length, "content"), n = e.any ? n : null === e.choice ? this._decodeGeneric(e.tag, t, r) : this._decodeChoice(t, r), t.isError(n)) return n;
        e.any || null !== e.choice || null === e.children || e.children.forEach(function (e) {
          e._decode(t, r)
        }), !e.contains || "octstr" !== e.tag && "bitstr" !== e.tag || (c = new f(n), n = this._getUse(e.contains, t._reporterState.obj)._decode(c, r))
      }
      return e.obj && o && (n = t.leaveObject(i)), null === e.key || null === n && !0 !== o ? null !== a && t.exitKey(a) : t.leaveKey(a, e.key, n), n
    }, s.prototype._decodeGeneric = function (e, t, r) {
      var i = this._baseState;
      return "seq" === e || "set" === e ? null : "seqof" === e || "setof" === e ? this._decodeList(t, e, i.args[0], r) : /str$/.test(e) ? this._decodeStr(t, e, r) : "objid" === e && i.args ? this._decodeObjid(t, i.args[0], i.args[1], r) : "objid" === e ? this._decodeObjid(t, null, null, r) : "gentime" === e || "utctime" === e ? this._decodeTime(t, e, r) : "null_" === e ? this._decodeNull(t, r) : "bool" === e ? this._decodeBool(t, r) : "objDesc" === e ? this._decodeStr(t, e, r) : "int" === e || "enum" === e ? this._decodeInt(t, i.args && i.args[0], r) : null !== i.use ? this._getUse(i.use, t._reporterState.obj)._decode(t, r) : t.error("unknown tag: " + e)
    }, s.prototype._getUse = function (e, t) {
      var r = this._baseState;
      return r.useDecoder = this._use(e, t), n(null === r.useDecoder._baseState.parent), r.useDecoder = r.useDecoder._baseState.children[0], r.implicit !== r.useDecoder._baseState.implicit && (r.useDecoder = r.useDecoder.clone(), r.useDecoder._baseState.implicit = r.implicit), r.useDecoder
    }, s.prototype._decodeChoice = function (n, o) {
      var a = this._baseState, s = null, l = !1;
      return Object.keys(a.choice).some(function (e) {
        var t = n.save(), r = a.choice[e];
        try {
          var i = r._decode(n, o);
          if (n.isError(i)) return !1;
          s = {type: e, value: i}, l = !0
        } catch (e) {
          return n.restore(t), !1
        }
        return !0
      }, this), l ? s : n.error("Choice not matched")
    }, s.prototype._createEncoderBuffer = function (e) {
      return new i(e, this.reporter)
    }, s.prototype._encode = function (e, t, r) {
      var i = this._baseState;
      if (null === i["default"] || i["default"] !== e) {
        var n = this._encodeValue(e, t, r);
        if (void 0 !== n && !this._skipDefault(n, t, r)) return n
      }
    }, s.prototype._encodeValue = function (i, n, e) {
      var t = this._baseState;
      if (null === t.parent) return t.children[0]._encode(i, n || new c);
      var r = null;
      if (this.reporter = n, t.optional && void 0 === i) {
        if (null === t["default"]) return;
        i = t["default"]
      }
      var o, a, s = null, l = !1;
      if (t.any) r = this._createEncoderBuffer(i); else if (t.choice) r = this._encodeChoice(i, n); else if (t.contains) s = this._getUse(t.contains, e)._encode(i, n), l = !0; else if (t.children) s = t.children.map(function (e) {
        if ("null_" === e._baseState.tag) return e._encode(null, n, i);
        if (null === e._baseState.key) return n.error("Child should have a key");
        var t = n.enterKey(e._baseState.key);
        if ("object" != typeof i) return n.error("Child expected, but input is not object");
        var r = e._encode(i[e._baseState.key], n, i);
        return n.leaveKey(t), r
      }, this).filter(function (e) {
        return e
      }), s = this._createEncoderBuffer(s); else if ("seqof" === t.tag || "setof" === t.tag) {
        if (!t.args || 1 !== t.args.length) return n.error("Too many args for : " + t.tag);
        if (!Array.isArray(i)) return n.error("seqof/setof, but data is not Array");
        var u = this.clone();
        u._baseState.implicit = null, s = this._createEncoderBuffer(i.map(function (e) {
          var t = this._baseState;
          return this._getUse(t.args[0], i)._encode(e, n)
        }, u))
      } else null !== t.use ? r = this._getUse(t.use, e)._encode(i, n) : (s = this._encodePrimitive(t.tag, i), l = !0);
      return t.any || null !== t.choice || (o = null !== t.implicit ? t.implicit : t.tag, a = null === t.implicit ? "universal" : "context", null === o ? null === t.use && n.error("Tag could be omitted only for .use()") : null === t.use && (r = this._encodeComposite(o, l, a, s))), null !== t.explicit && (r = this._encodeComposite(t.explicit, !1, "context", r)), r
    }, s.prototype._encodeChoice = function (e, t) {
      var r = this._baseState, i = r.choice[e.type];
      return i || n(!1, e.type + " not found in " + JSON.stringify(Object.keys(r.choice))), i._encode(e.value, t)
    }, s.prototype._encodePrimitive = function (e, t) {
      var r = this._baseState;
      if (/str$/.test(e)) return this._encodeStr(t, e);
      if ("objid" === e && r.args) return this._encodeObjid(t, r.reverseArgs[0], r.args[1]);
      if ("objid" === e) return this._encodeObjid(t, null, null);
      if ("gentime" === e || "utctime" === e) return this._encodeTime(t, e);
      if ("null_" === e) return this._encodeNull();
      if ("int" === e || "enum" === e) return this._encodeInt(t, r.args && r.reverseArgs[0]);
      if ("bool" === e) return this._encodeBool(t);
      if ("objDesc" === e) return this._encodeStr(t, e);
      throw new Error("Unsupported tag: " + e)
    }, s.prototype._isNumstr = function (e) {
      return /^[0-9 ]*$/.test(e)
    }, s.prototype._isPrintstr = function (e) {
      return /^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(e)
    }
  }, {"../base": 4, "minimalistic-assert": 148}],
  6: [function (e, t, r) {
    var i = e("inherits");

    function n(e) {
      this._reporterState = {obj: null, path: [], options: e || {}, errors: []}
    }

    function o(e, t) {
      this.path = e, this.rethrow(t)
    }

    (r.Reporter = n).prototype.isError = function (e) {
      return e instanceof o
    }, n.prototype.save = function () {
      var e = this._reporterState;
      return {obj: e.obj, pathLen: e.path.length}
    }, n.prototype.restore = function (e) {
      var t = this._reporterState;
      t.obj = e.obj, t.path = t.path.slice(0, e.pathLen)
    }, n.prototype.enterKey = function (e) {
      return this._reporterState.path.push(e)
    }, n.prototype.exitKey = function (e) {
      var t = this._reporterState;
      t.path = t.path.slice(0, e - 1)
    }, n.prototype.leaveKey = function (e, t, r) {
      var i = this._reporterState;
      this.exitKey(e), null !== i.obj && (i.obj[t] = r)
    }, n.prototype.path = function () {
      return this._reporterState.path.join("/")
    }, n.prototype.enterObject = function () {
      var e = this._reporterState, t = e.obj;
      return e.obj = {}, t
    }, n.prototype.leaveObject = function (e) {
      var t = this._reporterState, r = t.obj;
      return t.obj = e, r
    }, n.prototype.error = function (e) {
      var t = this._reporterState, r = e instanceof o, i = r ? e : new o(t.path.map(function (e) {
        return "[" + JSON.stringify(e) + "]"
      }).join(""), e.message || e, e.stack);
      if (!t.options.partial) throw i;
      return r || t.errors.push(i), i
    }, n.prototype.wrapResult = function (e) {
      var t = this._reporterState;
      return t.options.partial ? {result: this.isError(e) ? null : e, errors: t.errors} : e
    }, i(o, Error), o.prototype.rethrow = function (e) {
      if (this.message = e + " at: " + (this.path || "(shallow)"), Error.captureStackTrace && Error.captureStackTrace(this, o), !this.stack) try {
        throw new Error(this.message)
      } catch (e) {
        this.stack = e.stack
      }
      return this
    }
  }, {inherits: 142}],
  7: [function (e, t, r) {
    var i = e("../constants");
    r.tagClass = {
      0: "universal",
      1: "application",
      2: "context",
      3: "private"
    }, r.tagClassByName = i._reverse(r.tagClass), r.tag = {
      0: "end",
      1: "bool",
      2: "int",
      3: "bitstr",
      4: "octstr",
      5: "null_",
      6: "objid",
      7: "objDesc",
      8: "external",
      9: "real",
      10: "enum",
      11: "embed",
      12: "utf8str",
      13: "relativeOid",
      16: "seq",
      17: "set",
      18: "numstr",
      19: "printstr",
      20: "t61str",
      21: "videostr",
      22: "ia5str",
      23: "utctime",
      24: "gentime",
      25: "graphstr",
      26: "iso646str",
      27: "genstr",
      28: "unistr",
      29: "charstr",
      30: "bmpstr"
    }, r.tagByName = i._reverse(r.tag)
  }, {"../constants": 8}],
  8: [function (e, t, r) {
    var i = r;
    i._reverse = function (r) {
      var i = {};
      return Object.keys(r).forEach(function (e) {
        (0 | e) == e && (e |= 0);
        var t = r[e];
        i[t] = e
      }), i
    }, i.der = e("./der")
  }, {"./der": 7}],
  9: [function (e, t, r) {
    var i = e("inherits"), n = e("../../asn1"), o = n.base, a = n.bignum, s = n.constants.der;

    function l(e) {
      this.enc = "der", this.name = e.name, this.entity = e, this.tree = new u, this.tree._init(e.body)
    }

    function u(e) {
      o.Node.call(this, "der", e)
    }

    function c(e, t) {
      var r = e.readUInt8(t);
      if (e.isError(r)) return r;
      var i = s.tagClass[r >> 6], n = 0 == (32 & r);
      if (31 == (31 & r)) for (var o = r, r = 0; 128 == (128 & o);) {
        if (o = e.readUInt8(t), e.isError(o)) return o;
        r <<= 7, r |= 127 & o
      } else r &= 31;
      return {cls: i, primitive: n, tag: r, tagStr: s.tag[r]}
    }

    function h(e, t, r) {
      var i = e.readUInt8(r);
      if (e.isError(i)) return i;
      if (!t && 128 === i) return null;
      if (0 == (128 & i)) return i;
      var n = 127 & i;
      if (4 < n) return e.error("length octect is too long");
      for (var o = i = 0; o < n; o++) {
        i <<= 8;
        var a = e.readUInt8(r);
        if (e.isError(a)) return a;
        i |= a
      }
      return i
    }

    (t.exports = l).prototype.decode = function (e, t) {
      return e instanceof o.DecoderBuffer || (e = new o.DecoderBuffer(e, t)), this.tree._decode(e, t)
    }, i(u, o.Node), u.prototype._peekTag = function (e, t, r) {
      if (e.isEmpty()) return !1;
      var i = e.save(), n = c(e, 'Failed to peek tag: "' + t + '"');
      return e.isError(n) ? n : (e.restore(i), n.tag === t || n.tagStr === t || n.tagStr + "of" === t || r)
    }, u.prototype._decodeTag = function (e, t, r) {
      var i = c(e, 'Failed to decode tag of "' + t + '"');
      if (e.isError(i)) return i;
      var n = h(e, i.primitive, 'Failed to get length of "' + t + '"');
      if (e.isError(n)) return n;
      if (!r && i.tag !== t && i.tagStr !== t && i.tagStr + "of" !== t) return e.error('Failed to match tag: "' + t + '"');
      if (i.primitive || null !== n) return e.skip(n, 'Failed to match body of: "' + t + '"');
      var o = e.save(), a = this._skipUntilEnd(e, 'Failed to skip indefinite length body: "' + this.tag + '"');
      return e.isError(a) ? a : (n = e.offset - o.offset, e.restore(o), e.skip(n, 'Failed to match body of: "' + t + '"'))
    }, u.prototype._skipUntilEnd = function (e, t) {
      for (; ;) {
        var r = c(e, t);
        if (e.isError(r)) return r;
        var i, n = h(e, r.primitive, t);
        if (e.isError(n)) return n;
        if (i = r.primitive || null !== n ? e.skip(n) : this._skipUntilEnd(e, t), e.isError(i)) return i;
        if ("end" === r.tagStr) break
      }
    }, u.prototype._decodeList = function (e, t, r, i) {
      for (var n = []; !e.isEmpty();) {
        var o = this._peekTag(e, "end");
        if (e.isError(o)) return o;
        var a = r.decode(e, "der", i);
        if (e.isError(a) && o) break;
        n.push(a)
      }
      return n
    }, u.prototype._decodeStr = function (e, t) {
      if ("bitstr" === t) {
        var r = e.readUInt8();
        return e.isError(r) ? r : {unused: r, data: e.raw()}
      }
      if ("bmpstr" === t) {
        var i = e.raw();
        if (i.length % 2 == 1) return e.error("Decoding of string type: bmpstr length mismatch");
        for (var n = "", o = 0; o < i.length / 2; o++) n += String.fromCharCode(i.readUInt16BE(2 * o));
        return n
      }
      if ("numstr" === t) {
        var a = e.raw().toString("ascii");
        return this._isNumstr(a) ? a : e.error("Decoding of string type: numstr unsupported characters")
      }
      if ("octstr" === t) return e.raw();
      if ("objDesc" === t) return e.raw();
      if ("printstr" !== t) return /str$/.test(t) ? e.raw().toString() : e.error("Decoding of string type: " + t + " unsupported");
      var s = e.raw().toString("ascii");
      return this._isPrintstr(s) ? s : e.error("Decoding of string type: printstr unsupported characters")
    }, u.prototype._decodeObjid = function (e, t, r) {
      for (var i = [], n = 0; !e.isEmpty();) {
        var o = e.readUInt8();
        n <<= 7, n |= 127 & o, 0 == (128 & o) && (i.push(n), n = 0)
      }
      128 & o && i.push(n);
      var a, s = i[0] / 40 | 0, l = i[0] % 40, u = r ? i : [s, l].concat(i.slice(1));
      return t && (void 0 === (a = t[u.join(" ")]) && (a = t[u.join(".")]), void 0 !== a && (u = a)), u
    }, u.prototype._decodeTime = function (e, t) {
      var r = e.raw().toString();
      if ("gentime" === t) var i = 0 | r.slice(0, 4), n = 0 | r.slice(4, 6), o = 0 | r.slice(6, 8),
          a = 0 | r.slice(8, 10), s = 0 | r.slice(10, 12), l = 0 | r.slice(12, 14); else {
        if ("utctime" !== t) return e.error("Decoding " + t + " time is not supported yet");
        i = 0 | r.slice(0, 2), n = 0 | r.slice(2, 4), o = 0 | r.slice(4, 6), a = 0 | r.slice(6, 8), s = 0 | r.slice(8, 10), l = 0 | r.slice(10, 12);
        i = i < 70 ? 2e3 + i : 1900 + i
      }
      return Date.UTC(i, n - 1, o, a, s, l, 0)
    }, u.prototype._decodeNull = function () {
      return null
    }, u.prototype._decodeBool = function (e) {
      var t = e.readUInt8();
      return e.isError(t) ? t : 0 !== t
    }, u.prototype._decodeInt = function (e, t) {
      var r = e.raw(), i = new a(r);
      return t && (i = t[i.toString(10)] || i), i
    }, u.prototype._use = function (e, t) {
      return "function" == typeof e && (e = e(t)), e._getDecoder("der").tree
    }
  }, {"../../asn1": 1, inherits: 142}],
  10: [function (e, t, r) {
    var i = r;
    i.der = e("./der"), i.pem = e("./pem")
  }, {"./der": 9, "./pem": 11}],
  11: [function (e, t, r) {
    var i = e("inherits"), h = e("buffer").Buffer, d = e("./der");

    function n(e) {
      d.call(this, e), this.enc = "pem"
    }

    i(n, d), (t.exports = n).prototype.decode = function (e, t) {
      for (var r = e.toString().split(/[\r\n]+/g), i = t.label.toUpperCase(), n = /^-----(BEGIN|END) ([^-]+)-----$/, o = -1, a = -1, s = 0; s < r.length; s++) {
        var l = r[s].match(n);
        if (null !== l && l[2] === i) {
          if (-1 !== o) {
            if ("END" !== l[1]) break;
            a = s;
            break
          }
          if ("BEGIN" !== l[1]) break;
          o = s
        }
      }
      if (-1 === o || -1 === a) throw new Error("PEM section not found for: " + i);
      var u = r.slice(o + 1, a).join("");
      u.replace(/[^a-z0-9\+\/=]+/gi, "");
      var c = new h(u, "base64");
      return d.prototype.decode.call(this, c, t)
    }
  }, {"./der": 9, buffer: 64, inherits: 142}],
  12: [function (e, t, r) {
    var i = e("inherits"), u = e("buffer").Buffer, n = e("../../asn1"), o = n.base, c = n.constants.der;

    function a(e) {
      this.enc = "der", this.name = e.name, this.entity = e, this.tree = new s, this.tree._init(e.body)
    }

    function s(e) {
      o.Node.call(this, "der", e)
    }

    function l(e) {
      return e < 10 ? "0" + e : e
    }

    (t.exports = a).prototype.encode = function (e, t) {
      return this.tree._encode(e, t).join()
    }, i(s, o.Node), s.prototype._encodeComposite = function (e, t, r, i) {
      var n = function (e, t, r, i) {
        var n;
        "seqof" === e ? e = "seq" : "setof" === e && (e = "set");
        if (c.tagByName.hasOwnProperty(e)) n = c.tagByName[e]; else {
          if ("number" != typeof e || (0 | e) !== e) return i.error("Unknown tag: " + e);
          n = e
        }
        if (31 <= n) return i.error("Multi-octet tag encoding unsupported");
        t || (n |= 32);
        return n |= c.tagClassByName[r || "universal"] << 6
      }(e, t, r, this.reporter);
      if (i.length < 128) return (o = new u(2))[0] = n, o[1] = i.length, this._createEncoderBuffer([o, i]);
      for (var o, a = 1, s = i.length; 256 <= s; s >>= 8) a++;
      (o = new u(2 + a))[0] = n, o[1] = 128 | a;
      for (var s = 1 + a, l = i.length; 0 < l; s--, l >>= 8) o[s] = 255 & l;
      return this._createEncoderBuffer([o, i])
    }, s.prototype._encodeStr = function (e, t) {
      if ("bitstr" === t) return this._createEncoderBuffer([0 | e.unused, e.data]);
      if ("bmpstr" !== t) return "numstr" === t ? this._isNumstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: numstr supports only digits and space") : "printstr" === t ? this._isPrintstr(e) ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark") : /str$/.test(t) || "objDesc" === t ? this._createEncoderBuffer(e) : this.reporter.error("Encoding of string type: " + t + " unsupported");
      for (var r = new u(2 * e.length), i = 0; i < e.length; i++) r.writeUInt16BE(e.charCodeAt(i), 2 * i);
      return this._createEncoderBuffer(r)
    }, s.prototype._encodeObjid = function (e, t, r) {
      if ("string" == typeof e) {
        if (!t) return this.reporter.error("string objid given, but no values map found");
        if (!t.hasOwnProperty(e)) return this.reporter.error("objid not found in values map");
        e = t[e].split(/[\s\.]+/g);
        for (var i = 0; i < e.length; i++) e[i] |= 0
      } else if (Array.isArray(e)) {
        e = e.slice();
        for (i = 0; i < e.length; i++) e[i] |= 0
      }
      if (!Array.isArray(e)) return this.reporter.error("objid() should be either array or string, got: " + JSON.stringify(e));
      if (!r) {
        if (40 <= e[1]) return this.reporter.error("Second objid identifier OOB");
        e.splice(0, 2, 40 * e[0] + e[1])
      }
      for (var n = 0, i = 0; i < e.length; i++) {
        var o = e[i];
        for (n++; 128 <= o; o >>= 7) n++
      }
      for (var a = new u(n), s = a.length - 1, i = e.length - 1; 0 <= i; i--) {
        o = e[i];
        for (a[s--] = 127 & o; 0 < (o >>= 7);) a[s--] = 128 | 127 & o
      }
      return this._createEncoderBuffer(a)
    }, s.prototype._encodeTime = function (e, t) {
      var r, i = new Date(e);
      return "gentime" === t ? r = [l(i.getFullYear()), l(i.getUTCMonth() + 1), l(i.getUTCDate()), l(i.getUTCHours()), l(i.getUTCMinutes()), l(i.getUTCSeconds()), "Z"].join("") : "utctime" === t ? r = [l(i.getFullYear() % 100), l(i.getUTCMonth() + 1), l(i.getUTCDate()), l(i.getUTCHours()), l(i.getUTCMinutes()), l(i.getUTCSeconds()), "Z"].join("") : this.reporter.error("Encoding " + t + " time is not supported yet"), this._encodeStr(r, "octstr")
    }, s.prototype._encodeNull = function () {
      return this._createEncoderBuffer("")
    }, s.prototype._encodeInt = function (e, t) {
      if ("string" == typeof e) {
        if (!t) return this.reporter.error("String int or enum given, but no values map");
        if (!t.hasOwnProperty(e)) return this.reporter.error("Values map doesn't contain: " + JSON.stringify(e));
        e = t[e]
      }
      var r;
      if ("number" == typeof e || u.isBuffer(e) || (r = e.toArray(), !e.sign && 128 & r[0] && r.unshift(0), e = new u(r)), u.isBuffer(e)) {
        var i = e.length;
        0 === e.length && i++;
        var n = new u(i);
        return e.copy(n), 0 === e.length && (n[0] = 0), this._createEncoderBuffer(n)
      }
      if (e < 128) return this._createEncoderBuffer(e);
      if (e < 256) return this._createEncoderBuffer([0, e]);
      for (var i = 1, o = e; 256 <= o; o >>= 8) i++;
      for (o = (n = new Array(i)).length - 1; 0 <= o; o--) n[o] = 255 & e, e >>= 8;
      return 128 & n[0] && n.unshift(0), this._createEncoderBuffer(new u(n))
    }, s.prototype._encodeBool = function (e) {
      return this._createEncoderBuffer(e ? 255 : 0)
    }, s.prototype._use = function (e, t) {
      return "function" == typeof e && (e = e(t)), e._getEncoder("der").tree
    }, s.prototype._skipDefault = function (e, t, r) {
      var i, n = this._baseState;
      if (null === n["default"]) return !1;
      var o = e.join();
      if (void 0 === n.defaultBuffer && (n.defaultBuffer = this._encodeValue(n["default"], t, r).join()), o.length !== n.defaultBuffer.length) return !1;
      for (i = 0; i < o.length; i++) if (o[i] !== n.defaultBuffer[i]) return !1;
      return !0
    }
  }, {"../../asn1": 1, buffer: 64, inherits: 142}],
  13: [function (e, t, r) {
    var i = r;
    i.der = e("./der"), i.pem = e("./pem")
  }, {"./der": 12, "./pem": 14}],
  14: [function (e, t, r) {
    var i = e("inherits"), o = e("./der");

    function n(e) {
      o.call(this, e), this.enc = "pem"
    }

    i(n, o), (t.exports = n).prototype.encode = function (e, t) {
      for (var r = o.prototype.encode.call(this, e).toString("base64"), i = ["-----BEGIN " + t.label + "-----"], n = 0; n < r.length; n += 64) i.push(r.slice(n, n + 64));
      return i.push("-----END " + t.label + "-----"), i.join("\n")
    }
  }, {"./der": 12, inherits: 142}],
  15: [function (E, e, t) {
    !function (e, t) {
      "use strict";

      function m(e, t) {
        if (!e) throw new Error(t || "Assertion failed")
      }

      function r(e, t) {
        e.super_ = t;

        function r() {
        }

        r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e
      }

      function g(e, t, r) {
        if (g.isBN(e)) return e;
        this.negative = 0, this.words = null, this.length = 0, (this.red = null) !== e && ("le" !== t && "be" !== t || (r = t, t = 10), this._init(e || 0, t || 10, r || "be"))
      }

      var i;
      "object" == typeof e ? e.exports = g : t.BN = g, (g.BN = g).wordSize = 26;
      try {
        i = E("buffer").Buffer
      } catch (e) {
      }

      function a(e, t, r) {
        for (var i = 0, n = Math.min(e.length, r), o = t; o < n; o++) {
          var a = e.charCodeAt(o) - 48;
          i <<= 4, i |= 49 <= a && a <= 54 ? a - 49 + 10 : 17 <= a && a <= 22 ? a - 17 + 10 : 15 & a
        }
        return i
      }

      function h(e, t, r, i) {
        for (var n = 0, o = Math.min(e.length, r), a = t; a < o; a++) {
          var s = e.charCodeAt(a) - 48;
          n *= i, n += 49 <= s ? s - 49 + 10 : 17 <= s ? s - 17 + 10 : s
        }
        return n
      }

      g.isBN = function (e) {
        return e instanceof g || null !== e && "object" == typeof e && e.constructor.wordSize === g.wordSize && Array.isArray(e.words)
      }, g.max = function (e, t) {
        return 0 < e.cmp(t) ? e : t
      }, g.min = function (e, t) {
        return e.cmp(t) < 0 ? e : t
      }, g.prototype._init = function (e, t, r) {
        if ("number" == typeof e) return this._initNumber(e, t, r);
        if ("object" == typeof e) return this._initArray(e, t, r);
        "hex" === t && (t = 16), m(t === (0 | t) && 2 <= t && t <= 36);
        var i = 0;
        "-" === (e = e.toString().replace(/\s+/g, ""))[0] && i++, 16 === t ? this._parseHex(e, i) : this._parseBase(e, t, i), "-" === e[0] && (this.negative = 1), this.strip(), "le" === r && this._initArray(this.toArray(), t, r)
      }, g.prototype._initNumber = function (e, t, r) {
        e < 0 && (this.negative = 1, e = -e), e < 67108864 ? (this.words = [67108863 & e], this.length = 1) : e < 4503599627370496 ? (this.words = [67108863 & e, e / 67108864 & 67108863], this.length = 2) : (m(e < 9007199254740992), this.words = [67108863 & e, e / 67108864 & 67108863, 1], this.length = 3), "le" === r && this._initArray(this.toArray(), t, r)
      }, g.prototype._initArray = function (e, t, r) {
        if (m("number" == typeof e.length), e.length <= 0) return this.words = [0], this.length = 1, this;
        this.length = Math.ceil(e.length / 3), this.words = new Array(this.length);
        for (var i, n, o = 0; o < this.length; o++) this.words[o] = 0;
        var a = 0;
        if ("be" === r) for (o = e.length - 1, i = 0; 0 <= o; o -= 3) n = e[o] | e[o - 1] << 8 | e[o - 2] << 16, this.words[i] |= n << a & 67108863, this.words[i + 1] = n >>> 26 - a & 67108863, 26 <= (a += 24) && (a -= 26, i++); else if ("le" === r) for (i = o = 0; o < e.length; o += 3) n = e[o] | e[o + 1] << 8 | e[o + 2] << 16, this.words[i] |= n << a & 67108863, this.words[i + 1] = n >>> 26 - a & 67108863, 26 <= (a += 24) && (a -= 26, i++);
        return this.strip()
      }, g.prototype._parseHex = function (e, t) {
        this.length = Math.ceil((e.length - t) / 6), this.words = new Array(this.length);
        for (var r, i = 0; i < this.length; i++) this.words[i] = 0;
        for (var n = 0, i = e.length - 6, o = 0; t <= i; i -= 6) r = a(e, i, i + 6), this.words[o] |= r << n & 67108863, this.words[o + 1] |= r >>> 26 - n & 4194303, 26 <= (n += 24) && (n -= 26, o++);
        i + 6 !== t && (r = a(e, t, i + 6), this.words[o] |= r << n & 67108863, this.words[o + 1] |= r >>> 26 - n & 4194303), this.strip()
      }, g.prototype._parseBase = function (e, t, r) {
        this.words = [0];
        for (var i = 0, n = this.length = 1; n <= 67108863; n *= t) i++;
        i--, n = n / t | 0;
        for (var o = e.length - r, a = o % i, s = Math.min(o, o - a) + r, l = 0, u = r; u < s; u += i) l = h(e, u, u + i, t), this.imuln(n), this.words[0] + l < 67108864 ? this.words[0] += l : this._iaddn(l);
        if (0 != a) {
          for (var c = 1, l = h(e, u, e.length, t), u = 0; u < a; u++) c *= t;
          this.imuln(c), this.words[0] + l < 67108864 ? this.words[0] += l : this._iaddn(l)
        }
      }, g.prototype.copy = function (e) {
        e.words = new Array(this.length);
        for (var t = 0; t < this.length; t++) e.words[t] = this.words[t];
        e.length = this.length, e.negative = this.negative, e.red = this.red
      }, g.prototype.clone = function () {
        var e = new g(null);
        return this.copy(e), e
      }, g.prototype._expand = function (e) {
        for (; this.length < e;) this.words[this.length++] = 0;
        return this
      }, g.prototype.strip = function () {
        for (; 1 < this.length && 0 === this.words[this.length - 1];) this.length--;
        return this._normSign()
      }, g.prototype._normSign = function () {
        return 1 === this.length && 0 === this.words[0] && (this.negative = 0), this
      }, g.prototype.inspect = function () {
        return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">"
      };
      var d = ["", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000"],
          f = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
          p = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];

      function n(e, t, r) {
        r.negative = t.negative ^ e.negative;
        var i = e.length + t.length | 0, i = (r.length = i) - 1 | 0,
            n = 67108863 & (h = (0 | e.words[0]) * (0 | t.words[0])), o = h / 67108864 | 0;
        r.words[0] = n;
        for (var a = 1; a < i; a++) {
          for (var s = o >>> 26, l = 67108863 & o, u = Math.min(a, t.length - 1), c = Math.max(0, a - e.length + 1); c <= u; c++) {
            var h, d = a - c | 0;
            s += (h = (0 | e.words[d]) * (0 | t.words[c]) + l) / 67108864 | 0, l = 67108863 & h
          }
          r.words[a] = 0 | l, o = 0 | s
        }
        return 0 !== o ? r.words[a] = 0 | o : r.length--, r.strip()
      }

      g.prototype.toString = function (e, t) {
        if (t = 0 | t || 1, 16 === (e = e || 10) || "hex" === e) {
          s = "";
          for (var r = 0, i = 0, n = 0; n < this.length; n++) {
            var o = this.words[n], a = (16777215 & (o << r | i)).toString(16),
                s = 0 !== (i = o >>> 24 - r & 16777215) || n !== this.length - 1 ? d[6 - a.length] + a + s : a + s;
            26 <= (r += 2) && (r -= 26, n--)
          }
          for (0 !== i && (s = i.toString(16) + s); s.length % t != 0;) s = "0" + s;
          return 0 !== this.negative && (s = "-" + s), s
        }
        if (e === (0 | e) && 2 <= e && e <= 36) {
          var l = f[e], u = p[e];
          for (s = "", (c = this.clone()).negative = 0; !c.isZero();) {
            var c, h = c.modn(u).toString(e);
            s = (c = c.idivn(u)).isZero() ? h + s : d[l - h.length] + h + s
          }
          for (this.isZero() && (s = "0" + s); s.length % t != 0;) s = "0" + s;
          return 0 !== this.negative && (s = "-" + s), s
        }
        m(!1, "Base should be between 2 and 36")
      }, g.prototype.toNumber = function () {
        var e = this.words[0];
        return 2 === this.length ? e += 67108864 * this.words[1] : 3 === this.length && 1 === this.words[2] ? e += 4503599627370496 + 67108864 * this.words[1] : 2 < this.length && m(!1, "Number can only safely store up to 53 bits"), 0 !== this.negative ? -e : e
      }, g.prototype.toJSON = function () {
        return this.toString(16)
      }, g.prototype.toBuffer = function (e, t) {
        return m(void 0 !== i), this.toArrayLike(i, e, t)
      }, g.prototype.toArray = function (e, t) {
        return this.toArrayLike(Array, e, t)
      }, g.prototype.toArrayLike = function (e, t, r) {
        var i = this.byteLength(), n = r || Math.max(1, i);
        m(i <= n, "byte array longer than desired length"), m(0 < n, "Requested array length <= 0"), this.strip();
        var o, a, s = "le" === t, l = new e(n), u = this.clone();
        if (s) {
          for (a = 0; !u.isZero(); a++) o = u.andln(255), u.iushrn(8), l[a] = o;
          for (; a < n; a++) l[a] = 0
        } else {
          for (a = 0; a < n - i; a++) l[a] = 0;
          for (a = 0; !u.isZero(); a++) o = u.andln(255), u.iushrn(8), l[n - a - 1] = o
        }
        return l
      }, Math.clz32 ? g.prototype._countBits = function (e) {
        return 32 - Math.clz32(e)
      } : g.prototype._countBits = function (e) {
        var t = e, r = 0;
        return 4096 <= t && (r += 13, t >>>= 13), 64 <= t && (r += 7, t >>>= 7), 8 <= t && (r += 4, t >>>= 4), 2 <= t && (r += 2, t >>>= 2), r + t
      }, g.prototype._zeroBits = function (e) {
        if (0 === e) return 26;
        var t = e, r = 0;
        return 0 == (8191 & t) && (r += 13, t >>>= 13), 0 == (127 & t) && (r += 7, t >>>= 7), 0 == (15 & t) && (r += 4, t >>>= 4), 0 == (3 & t) && (r += 2, t >>>= 2), 0 == (1 & t) && r++, r
      }, g.prototype.bitLength = function () {
        var e = this.words[this.length - 1], t = this._countBits(e);
        return 26 * (this.length - 1) + t
      }, g.prototype.zeroBits = function () {
        if (this.isZero()) return 0;
        for (var e = 0, t = 0; t < this.length; t++) {
          var r = this._zeroBits(this.words[t]);
          if (e += r, 26 !== r) break
        }
        return e
      }, g.prototype.byteLength = function () {
        return Math.ceil(this.bitLength() / 8)
      }, g.prototype.toTwos = function (e) {
        return 0 !== this.negative ? this.abs().inotn(e).iaddn(1) : this.clone()
      }, g.prototype.fromTwos = function (e) {
        return this.testn(e - 1) ? this.notn(e).iaddn(1).ineg() : this.clone()
      }, g.prototype.isNeg = function () {
        return 0 !== this.negative
      }, g.prototype.neg = function () {
        return this.clone().ineg()
      }, g.prototype.ineg = function () {
        return this.isZero() || (this.negative ^= 1), this
      }, g.prototype.iuor = function (e) {
        for (; this.length < e.length;) this.words[this.length++] = 0;
        for (var t = 0; t < e.length; t++) this.words[t] = this.words[t] | e.words[t];
        return this.strip()
      }, g.prototype.ior = function (e) {
        return m(0 == (this.negative | e.negative)), this.iuor(e)
      }, g.prototype.or = function (e) {
        return this.length > e.length ? this.clone().ior(e) : e.clone().ior(this)
      }, g.prototype.uor = function (e) {
        return this.length > e.length ? this.clone().iuor(e) : e.clone().iuor(this)
      }, g.prototype.iuand = function (e) {
        for (var t = this.length > e.length ? e : this, r = 0; r < t.length; r++) this.words[r] = this.words[r] & e.words[r];
        return this.length = t.length, this.strip()
      }, g.prototype.iand = function (e) {
        return m(0 == (this.negative | e.negative)), this.iuand(e)
      }, g.prototype.and = function (e) {
        return this.length > e.length ? this.clone().iand(e) : e.clone().iand(this)
      }, g.prototype.uand = function (e) {
        return this.length > e.length ? this.clone().iuand(e) : e.clone().iuand(this)
      }, g.prototype.iuxor = function (e) {
        for (var t, r = this.length > e.length ? (t = this, e) : (t = e, this), i = 0; i < r.length; i++) this.words[i] = t.words[i] ^ r.words[i];
        if (this !== t) for (; i < t.length; i++) this.words[i] = t.words[i];
        return this.length = t.length, this.strip()
      }, g.prototype.ixor = function (e) {
        return m(0 == (this.negative | e.negative)), this.iuxor(e)
      }, g.prototype.xor = function (e) {
        return this.length > e.length ? this.clone().ixor(e) : e.clone().ixor(this)
      }, g.prototype.uxor = function (e) {
        return this.length > e.length ? this.clone().iuxor(e) : e.clone().iuxor(this)
      }, g.prototype.inotn = function (e) {
        m("number" == typeof e && 0 <= e);
        var t = 0 | Math.ceil(e / 26), r = e % 26;
        this._expand(t), 0 < r && t--;
        for (var i = 0; i < t; i++) this.words[i] = 67108863 & ~this.words[i];
        return 0 < r && (this.words[i] = ~this.words[i] & 67108863 >> 26 - r), this.strip()
      }, g.prototype.notn = function (e) {
        return this.clone().inotn(e)
      }, g.prototype.setn = function (e, t) {
        m("number" == typeof e && 0 <= e);
        var r = e / 26 | 0, i = e % 26;
        return this._expand(1 + r), this.words[r] = t ? this.words[r] | 1 << i : this.words[r] & ~(1 << i), this.strip()
      }, g.prototype.iadd = function (e) {
        var t, r, i;
        if (0 !== this.negative && 0 === e.negative) return this.negative = 0, t = this.isub(e), this.negative ^= 1, this._normSign();
        if (0 === this.negative && 0 !== e.negative) return e.negative = 0, t = this.isub(e), e.negative = 1, t._normSign();
        i = this.length > e.length ? (r = this, e) : (r = e, this);
        for (var n = 0, o = 0; o < i.length; o++) t = (0 | r.words[o]) + (0 | i.words[o]) + n, this.words[o] = 67108863 & t, n = t >>> 26;
        for (; 0 !== n && o < r.length; o++) t = (0 | r.words[o]) + n, this.words[o] = 67108863 & t, n = t >>> 26;
        if (this.length = r.length, 0 !== n) this.words[this.length] = n, this.length++; else if (r !== this) for (; o < r.length; o++) this.words[o] = r.words[o];
        return this
      }, g.prototype.add = function (e) {
        var t;
        return 0 !== e.negative && 0 === this.negative ? (e.negative = 0, t = this.sub(e), e.negative ^= 1, t) : 0 === e.negative && 0 !== this.negative ? (this.negative = 0, t = e.sub(this), this.negative = 1, t) : this.length > e.length ? this.clone().iadd(e) : e.clone().iadd(this)
      }, g.prototype.isub = function (e) {
        if (0 !== e.negative) {
          e.negative = 0;
          var t = this.iadd(e);
          return e.negative = 1, t._normSign()
        }
        if (0 !== this.negative) return this.negative = 0, this.iadd(e), this.negative = 1, this._normSign();
        var r, i, n = this.cmp(e);
        if (0 === n) return this.negative = 0, this.length = 1, this.words[0] = 0, this;
        i = 0 < n ? (r = this, e) : (r = e, this);
        for (var o = 0, a = 0; a < i.length; a++) o = (t = (0 | r.words[a]) - (0 | i.words[a]) + o) >> 26, this.words[a] = 67108863 & t;
        for (; 0 !== o && a < r.length; a++) o = (t = (0 | r.words[a]) + o) >> 26, this.words[a] = 67108863 & t;
        if (0 === o && a < r.length && r !== this) for (; a < r.length; a++) this.words[a] = r.words[a];
        return this.length = Math.max(this.length, a), r !== this && (this.negative = 1), this.strip()
      }, g.prototype.sub = function (e) {
        return this.clone().isub(e)
      };
      var o = function (e, t, r) {
        var i, n, o, a = e.words, s = t.words, l = r.words, u = 0, c = 0 | a[0], h = 8191 & c, d = c >>> 13,
            f = 0 | a[1], p = 8191 & f, y = f >>> 13, m = 0 | a[2], g = 8191 & m, b = m >>> 13, v = 0 | a[3],
            _ = 8191 & v, w = v >>> 13, S = 0 | a[4], E = 8191 & S, x = S >>> 13, T = 0 | a[5], M = 8191 & T,
            k = T >>> 13, P = 0 | a[6], C = 8191 & P, A = P >>> 13, I = 0 | a[7], R = 8191 & I, L = I >>> 13,
            D = 0 | a[8], B = 8191 & D, O = D >>> 13, U = 0 | a[9], N = 8191 & U, H = U >>> 13, j = 0 | s[0],
            F = 8191 & j, q = j >>> 13, V = 0 | s[1], z = 8191 & V, K = V >>> 13, W = 0 | s[2], X = 8191 & W,
            G = W >>> 13, Y = 0 | s[3], Q = 8191 & Y, J = Y >>> 13, Z = 0 | s[4], $ = 8191 & Z, ee = Z >>> 13,
            te = 0 | s[5], re = 8191 & te, ie = te >>> 13, ne = 0 | s[6], oe = 8191 & ne, ae = ne >>> 13, se = 0 | s[7],
            le = 8191 & se, ue = se >>> 13, ce = 0 | s[8], he = 8191 & ce, de = ce >>> 13, fe = 0 | s[9],
            pe = 8191 & fe, ye = fe >>> 13;
        r.negative = e.negative ^ t.negative, r.length = 19;
        var me = (u + (i = Math.imul(h, F)) | 0) + ((8191 & (n = (n = Math.imul(h, q)) + Math.imul(d, F) | 0)) << 13) | 0,
            u = ((o = Math.imul(d, q)) + (n >>> 13) | 0) + (me >>> 26) | 0;
        me &= 67108863, i = Math.imul(p, F), n = (n = Math.imul(p, q)) + Math.imul(y, F) | 0, o = Math.imul(y, q);
        var ge = (u + (i = i + Math.imul(h, z) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, K) | 0) + Math.imul(d, z) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, K) | 0) + (n >>> 13) | 0) + (ge >>> 26) | 0, ge &= 67108863, i = Math.imul(g, F), n = (n = Math.imul(g, q)) + Math.imul(b, F) | 0, o = Math.imul(b, q), i = i + Math.imul(p, z) | 0, n = (n = n + Math.imul(p, K) | 0) + Math.imul(y, z) | 0, o = o + Math.imul(y, K) | 0;
        var be = (u + (i = i + Math.imul(h, X) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, G) | 0) + Math.imul(d, X) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, G) | 0) + (n >>> 13) | 0) + (be >>> 26) | 0, be &= 67108863, i = Math.imul(_, F), n = (n = Math.imul(_, q)) + Math.imul(w, F) | 0, o = Math.imul(w, q), i = i + Math.imul(g, z) | 0, n = (n = n + Math.imul(g, K) | 0) + Math.imul(b, z) | 0, o = o + Math.imul(b, K) | 0, i = i + Math.imul(p, X) | 0, n = (n = n + Math.imul(p, G) | 0) + Math.imul(y, X) | 0, o = o + Math.imul(y, G) | 0;
        var ve = (u + (i = i + Math.imul(h, Q) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, J) | 0) + Math.imul(d, Q) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, J) | 0) + (n >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, i = Math.imul(E, F), n = (n = Math.imul(E, q)) + Math.imul(x, F) | 0, o = Math.imul(x, q), i = i + Math.imul(_, z) | 0, n = (n = n + Math.imul(_, K) | 0) + Math.imul(w, z) | 0, o = o + Math.imul(w, K) | 0, i = i + Math.imul(g, X) | 0, n = (n = n + Math.imul(g, G) | 0) + Math.imul(b, X) | 0, o = o + Math.imul(b, G) | 0, i = i + Math.imul(p, Q) | 0, n = (n = n + Math.imul(p, J) | 0) + Math.imul(y, Q) | 0, o = o + Math.imul(y, J) | 0;
        var _e = (u + (i = i + Math.imul(h, $) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, ee) | 0) + Math.imul(d, $) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, ee) | 0) + (n >>> 13) | 0) + (_e >>> 26) | 0, _e &= 67108863, i = Math.imul(M, F), n = (n = Math.imul(M, q)) + Math.imul(k, F) | 0, o = Math.imul(k, q), i = i + Math.imul(E, z) | 0, n = (n = n + Math.imul(E, K) | 0) + Math.imul(x, z) | 0, o = o + Math.imul(x, K) | 0, i = i + Math.imul(_, X) | 0, n = (n = n + Math.imul(_, G) | 0) + Math.imul(w, X) | 0, o = o + Math.imul(w, G) | 0, i = i + Math.imul(g, Q) | 0, n = (n = n + Math.imul(g, J) | 0) + Math.imul(b, Q) | 0, o = o + Math.imul(b, J) | 0, i = i + Math.imul(p, $) | 0, n = (n = n + Math.imul(p, ee) | 0) + Math.imul(y, $) | 0, o = o + Math.imul(y, ee) | 0;
        var we = (u + (i = i + Math.imul(h, re) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, ie) | 0) + Math.imul(d, re) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, ie) | 0) + (n >>> 13) | 0) + (we >>> 26) | 0, we &= 67108863, i = Math.imul(C, F), n = (n = Math.imul(C, q)) + Math.imul(A, F) | 0, o = Math.imul(A, q), i = i + Math.imul(M, z) | 0, n = (n = n + Math.imul(M, K) | 0) + Math.imul(k, z) | 0, o = o + Math.imul(k, K) | 0, i = i + Math.imul(E, X) | 0, n = (n = n + Math.imul(E, G) | 0) + Math.imul(x, X) | 0, o = o + Math.imul(x, G) | 0, i = i + Math.imul(_, Q) | 0, n = (n = n + Math.imul(_, J) | 0) + Math.imul(w, Q) | 0, o = o + Math.imul(w, J) | 0, i = i + Math.imul(g, $) | 0, n = (n = n + Math.imul(g, ee) | 0) + Math.imul(b, $) | 0, o = o + Math.imul(b, ee) | 0, i = i + Math.imul(p, re) | 0, n = (n = n + Math.imul(p, ie) | 0) + Math.imul(y, re) | 0, o = o + Math.imul(y, ie) | 0;
        var Se = (u + (i = i + Math.imul(h, oe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, ae) | 0) + Math.imul(d, oe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, ae) | 0) + (n >>> 13) | 0) + (Se >>> 26) | 0, Se &= 67108863, i = Math.imul(R, F), n = (n = Math.imul(R, q)) + Math.imul(L, F) | 0, o = Math.imul(L, q), i = i + Math.imul(C, z) | 0, n = (n = n + Math.imul(C, K) | 0) + Math.imul(A, z) | 0, o = o + Math.imul(A, K) | 0, i = i + Math.imul(M, X) | 0, n = (n = n + Math.imul(M, G) | 0) + Math.imul(k, X) | 0, o = o + Math.imul(k, G) | 0, i = i + Math.imul(E, Q) | 0, n = (n = n + Math.imul(E, J) | 0) + Math.imul(x, Q) | 0, o = o + Math.imul(x, J) | 0, i = i + Math.imul(_, $) | 0, n = (n = n + Math.imul(_, ee) | 0) + Math.imul(w, $) | 0, o = o + Math.imul(w, ee) | 0, i = i + Math.imul(g, re) | 0, n = (n = n + Math.imul(g, ie) | 0) + Math.imul(b, re) | 0, o = o + Math.imul(b, ie) | 0, i = i + Math.imul(p, oe) | 0, n = (n = n + Math.imul(p, ae) | 0) + Math.imul(y, oe) | 0, o = o + Math.imul(y, ae) | 0;
        var Ee = (u + (i = i + Math.imul(h, le) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, ue) | 0) + Math.imul(d, le) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, ue) | 0) + (n >>> 13) | 0) + (Ee >>> 26) | 0, Ee &= 67108863, i = Math.imul(B, F), n = (n = Math.imul(B, q)) + Math.imul(O, F) | 0, o = Math.imul(O, q), i = i + Math.imul(R, z) | 0, n = (n = n + Math.imul(R, K) | 0) + Math.imul(L, z) | 0, o = o + Math.imul(L, K) | 0, i = i + Math.imul(C, X) | 0, n = (n = n + Math.imul(C, G) | 0) + Math.imul(A, X) | 0, o = o + Math.imul(A, G) | 0, i = i + Math.imul(M, Q) | 0, n = (n = n + Math.imul(M, J) | 0) + Math.imul(k, Q) | 0, o = o + Math.imul(k, J) | 0, i = i + Math.imul(E, $) | 0, n = (n = n + Math.imul(E, ee) | 0) + Math.imul(x, $) | 0, o = o + Math.imul(x, ee) | 0, i = i + Math.imul(_, re) | 0, n = (n = n + Math.imul(_, ie) | 0) + Math.imul(w, re) | 0, o = o + Math.imul(w, ie) | 0, i = i + Math.imul(g, oe) | 0, n = (n = n + Math.imul(g, ae) | 0) + Math.imul(b, oe) | 0, o = o + Math.imul(b, ae) | 0, i = i + Math.imul(p, le) | 0, n = (n = n + Math.imul(p, ue) | 0) + Math.imul(y, le) | 0, o = o + Math.imul(y, ue) | 0;
        var xe = (u + (i = i + Math.imul(h, he) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, de) | 0) + Math.imul(d, he) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, de) | 0) + (n >>> 13) | 0) + (xe >>> 26) | 0, xe &= 67108863, i = Math.imul(N, F), n = (n = Math.imul(N, q)) + Math.imul(H, F) | 0, o = Math.imul(H, q), i = i + Math.imul(B, z) | 0, n = (n = n + Math.imul(B, K) | 0) + Math.imul(O, z) | 0, o = o + Math.imul(O, K) | 0, i = i + Math.imul(R, X) | 0, n = (n = n + Math.imul(R, G) | 0) + Math.imul(L, X) | 0, o = o + Math.imul(L, G) | 0, i = i + Math.imul(C, Q) | 0, n = (n = n + Math.imul(C, J) | 0) + Math.imul(A, Q) | 0, o = o + Math.imul(A, J) | 0, i = i + Math.imul(M, $) | 0, n = (n = n + Math.imul(M, ee) | 0) + Math.imul(k, $) | 0, o = o + Math.imul(k, ee) | 0, i = i + Math.imul(E, re) | 0, n = (n = n + Math.imul(E, ie) | 0) + Math.imul(x, re) | 0, o = o + Math.imul(x, ie) | 0, i = i + Math.imul(_, oe) | 0, n = (n = n + Math.imul(_, ae) | 0) + Math.imul(w, oe) | 0, o = o + Math.imul(w, ae) | 0, i = i + Math.imul(g, le) | 0, n = (n = n + Math.imul(g, ue) | 0) + Math.imul(b, le) | 0, o = o + Math.imul(b, ue) | 0, i = i + Math.imul(p, he) | 0, n = (n = n + Math.imul(p, de) | 0) + Math.imul(y, he) | 0, o = o + Math.imul(y, de) | 0;
        var Te = (u + (i = i + Math.imul(h, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, ye) | 0) + Math.imul(d, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, ye) | 0) + (n >>> 13) | 0) + (Te >>> 26) | 0, Te &= 67108863, i = Math.imul(N, z), n = (n = Math.imul(N, K)) + Math.imul(H, z) | 0, o = Math.imul(H, K), i = i + Math.imul(B, X) | 0, n = (n = n + Math.imul(B, G) | 0) + Math.imul(O, X) | 0, o = o + Math.imul(O, G) | 0, i = i + Math.imul(R, Q) | 0, n = (n = n + Math.imul(R, J) | 0) + Math.imul(L, Q) | 0, o = o + Math.imul(L, J) | 0, i = i + Math.imul(C, $) | 0, n = (n = n + Math.imul(C, ee) | 0) + Math.imul(A, $) | 0, o = o + Math.imul(A, ee) | 0, i = i + Math.imul(M, re) | 0, n = (n = n + Math.imul(M, ie) | 0) + Math.imul(k, re) | 0, o = o + Math.imul(k, ie) | 0, i = i + Math.imul(E, oe) | 0, n = (n = n + Math.imul(E, ae) | 0) + Math.imul(x, oe) | 0, o = o + Math.imul(x, ae) | 0, i = i + Math.imul(_, le) | 0, n = (n = n + Math.imul(_, ue) | 0) + Math.imul(w, le) | 0, o = o + Math.imul(w, ue) | 0, i = i + Math.imul(g, he) | 0, n = (n = n + Math.imul(g, de) | 0) + Math.imul(b, he) | 0, o = o + Math.imul(b, de) | 0;
        var Me = (u + (i = i + Math.imul(p, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(p, ye) | 0) + Math.imul(y, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(y, ye) | 0) + (n >>> 13) | 0) + (Me >>> 26) | 0, Me &= 67108863, i = Math.imul(N, X), n = (n = Math.imul(N, G)) + Math.imul(H, X) | 0, o = Math.imul(H, G), i = i + Math.imul(B, Q) | 0, n = (n = n + Math.imul(B, J) | 0) + Math.imul(O, Q) | 0, o = o + Math.imul(O, J) | 0, i = i + Math.imul(R, $) | 0, n = (n = n + Math.imul(R, ee) | 0) + Math.imul(L, $) | 0, o = o + Math.imul(L, ee) | 0, i = i + Math.imul(C, re) | 0, n = (n = n + Math.imul(C, ie) | 0) + Math.imul(A, re) | 0, o = o + Math.imul(A, ie) | 0, i = i + Math.imul(M, oe) | 0, n = (n = n + Math.imul(M, ae) | 0) + Math.imul(k, oe) | 0, o = o + Math.imul(k, ae) | 0, i = i + Math.imul(E, le) | 0, n = (n = n + Math.imul(E, ue) | 0) + Math.imul(x, le) | 0, o = o + Math.imul(x, ue) | 0, i = i + Math.imul(_, he) | 0, n = (n = n + Math.imul(_, de) | 0) + Math.imul(w, he) | 0, o = o + Math.imul(w, de) | 0;
        var ke = (u + (i = i + Math.imul(g, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(g, ye) | 0) + Math.imul(b, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(b, ye) | 0) + (n >>> 13) | 0) + (ke >>> 26) | 0, ke &= 67108863, i = Math.imul(N, Q), n = (n = Math.imul(N, J)) + Math.imul(H, Q) | 0, o = Math.imul(H, J), i = i + Math.imul(B, $) | 0, n = (n = n + Math.imul(B, ee) | 0) + Math.imul(O, $) | 0, o = o + Math.imul(O, ee) | 0, i = i + Math.imul(R, re) | 0, n = (n = n + Math.imul(R, ie) | 0) + Math.imul(L, re) | 0, o = o + Math.imul(L, ie) | 0, i = i + Math.imul(C, oe) | 0, n = (n = n + Math.imul(C, ae) | 0) + Math.imul(A, oe) | 0, o = o + Math.imul(A, ae) | 0, i = i + Math.imul(M, le) | 0, n = (n = n + Math.imul(M, ue) | 0) + Math.imul(k, le) | 0, o = o + Math.imul(k, ue) | 0, i = i + Math.imul(E, he) | 0, n = (n = n + Math.imul(E, de) | 0) + Math.imul(x, he) | 0, o = o + Math.imul(x, de) | 0;
        var Pe = (u + (i = i + Math.imul(_, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(_, ye) | 0) + Math.imul(w, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(w, ye) | 0) + (n >>> 13) | 0) + (Pe >>> 26) | 0, Pe &= 67108863, i = Math.imul(N, $), n = (n = Math.imul(N, ee)) + Math.imul(H, $) | 0, o = Math.imul(H, ee), i = i + Math.imul(B, re) | 0, n = (n = n + Math.imul(B, ie) | 0) + Math.imul(O, re) | 0, o = o + Math.imul(O, ie) | 0, i = i + Math.imul(R, oe) | 0, n = (n = n + Math.imul(R, ae) | 0) + Math.imul(L, oe) | 0, o = o + Math.imul(L, ae) | 0, i = i + Math.imul(C, le) | 0, n = (n = n + Math.imul(C, ue) | 0) + Math.imul(A, le) | 0, o = o + Math.imul(A, ue) | 0, i = i + Math.imul(M, he) | 0, n = (n = n + Math.imul(M, de) | 0) + Math.imul(k, he) | 0, o = o + Math.imul(k, de) | 0;
        var Ce = (u + (i = i + Math.imul(E, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(E, ye) | 0) + Math.imul(x, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(x, ye) | 0) + (n >>> 13) | 0) + (Ce >>> 26) | 0, Ce &= 67108863, i = Math.imul(N, re), n = (n = Math.imul(N, ie)) + Math.imul(H, re) | 0, o = Math.imul(H, ie), i = i + Math.imul(B, oe) | 0, n = (n = n + Math.imul(B, ae) | 0) + Math.imul(O, oe) | 0, o = o + Math.imul(O, ae) | 0, i = i + Math.imul(R, le) | 0, n = (n = n + Math.imul(R, ue) | 0) + Math.imul(L, le) | 0, o = o + Math.imul(L, ue) | 0, i = i + Math.imul(C, he) | 0, n = (n = n + Math.imul(C, de) | 0) + Math.imul(A, he) | 0, o = o + Math.imul(A, de) | 0;
        var Ae = (u + (i = i + Math.imul(M, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(M, ye) | 0) + Math.imul(k, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(k, ye) | 0) + (n >>> 13) | 0) + (Ae >>> 26) | 0, Ae &= 67108863, i = Math.imul(N, oe), n = (n = Math.imul(N, ae)) + Math.imul(H, oe) | 0, o = Math.imul(H, ae), i = i + Math.imul(B, le) | 0, n = (n = n + Math.imul(B, ue) | 0) + Math.imul(O, le) | 0, o = o + Math.imul(O, ue) | 0, i = i + Math.imul(R, he) | 0, n = (n = n + Math.imul(R, de) | 0) + Math.imul(L, he) | 0, o = o + Math.imul(L, de) | 0;
        var Ie = (u + (i = i + Math.imul(C, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(C, ye) | 0) + Math.imul(A, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(A, ye) | 0) + (n >>> 13) | 0) + (Ie >>> 26) | 0, Ie &= 67108863, i = Math.imul(N, le), n = (n = Math.imul(N, ue)) + Math.imul(H, le) | 0, o = Math.imul(H, ue), i = i + Math.imul(B, he) | 0, n = (n = n + Math.imul(B, de) | 0) + Math.imul(O, he) | 0, o = o + Math.imul(O, de) | 0;
        var Re = (u + (i = i + Math.imul(R, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(R, ye) | 0) + Math.imul(L, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(L, ye) | 0) + (n >>> 13) | 0) + (Re >>> 26) | 0, Re &= 67108863, i = Math.imul(N, he), n = (n = Math.imul(N, de)) + Math.imul(H, he) | 0, o = Math.imul(H, de);
        var Le = (u + (i = i + Math.imul(B, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(B, ye) | 0) + Math.imul(O, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(O, ye) | 0) + (n >>> 13) | 0) + (Le >>> 26) | 0, Le &= 67108863;
        var De = (u + (i = Math.imul(N, pe)) | 0) + ((8191 & (n = (n = Math.imul(N, ye)) + Math.imul(H, pe) | 0)) << 13) | 0;
        return u = ((o = Math.imul(H, ye)) + (n >>> 13) | 0) + (De >>> 26) | 0, De &= 67108863, l[0] = me, l[1] = ge, l[2] = be, l[3] = ve, l[4] = _e, l[5] = we, l[6] = Se, l[7] = Ee, l[8] = xe, l[9] = Te, l[10] = Me, l[11] = ke, l[12] = Pe, l[13] = Ce, l[14] = Ae, l[15] = Ie, l[16] = Re, l[17] = Le, l[18] = De, 0 !== u && (l[19] = u, r.length++), r
      };

      function s(e, t, r) {
        return (new l).mulp(e, t, r)
      }

      function l(e, t) {
        this.x = e, this.y = t
      }

      Math.imul || (o = n), g.prototype.mulTo = function (e, t) {
        var r = this.length + e.length,
            i = (10 === this.length && 10 === e.length ? o : r < 63 ? n : r < 1024 ? function (e, t, r) {
              r.negative = t.negative ^ e.negative, r.length = e.length + t.length;
              for (var i = 0, n = 0, o = 0; o < r.length - 1; o++) {
                for (var a = n, n = 0, s = 67108863 & i, l = Math.min(o, t.length - 1), u = Math.max(0, o - e.length + 1); u <= l; u++) {
                  var c = o - u, h = (0 | e.words[c]) * (0 | t.words[u]), d = 67108863 & h,
                      s = 67108863 & (d = d + s | 0);
                  n += (a = (a = a + (h / 67108864 | 0) | 0) + (d >>> 26) | 0) >>> 26, a &= 67108863
                }
                r.words[o] = s, i = a, a = n
              }
              return 0 !== i ? r.words[o] = i : r.length--, r.strip()
            } : s)(this, e, t);
        return i
      }, l.prototype.makeRBT = function (e) {
        for (var t = new Array(e), r = g.prototype._countBits(e) - 1, i = 0; i < e; i++) t[i] = this.revBin(i, r, e);
        return t
      }, l.prototype.revBin = function (e, t, r) {
        if (0 === e || e === r - 1) return e;
        for (var i = 0, n = 0; n < t; n++) i |= (1 & e) << t - n - 1, e >>= 1;
        return i
      }, l.prototype.permute = function (e, t, r, i, n, o) {
        for (var a = 0; a < o; a++) i[a] = t[e[a]], n[a] = r[e[a]]
      }, l.prototype.transform = function (e, t, r, i, n, o) {
        this.permute(o, e, t, r, i, n);
        for (var a = 1; a < n; a <<= 1) for (var s = a << 1, l = Math.cos(2 * Math.PI / s), u = Math.sin(2 * Math.PI / s), c = 0; c < n; c += s) for (var h = l, d = u, f = 0; f < a; f++) {
          var p = r[c + f], y = i[c + f], m = h * (b = r[c + f + a]) - d * (g = i[c + f + a]), g = h * g + d * b, b = m;
          r[c + f] = p + b, i[c + f] = y + g, r[c + f + a] = p - b, i[c + f + a] = y - g, f !== s && (m = l * h - u * d, d = l * d + u * h, h = m)
        }
      }, l.prototype.guessLen13b = function (e, t) {
        for (var r = 1 & (n = 1 | Math.max(t, e)), i = 0, n = n / 2 | 0; n; n >>>= 1) i++;
        return 1 << i + 1 + r
      }, l.prototype.conjugate = function (e, t, r) {
        if (!(r <= 1)) for (var i = 0; i < r / 2; i++) {
          var n = e[i];
          e[i] = e[r - i - 1], e[r - i - 1] = n, n = t[i], t[i] = -t[r - i - 1], t[r - i - 1] = -n
        }
      }, l.prototype.normalize13b = function (e, t) {
        for (var r = 0, i = 0; i < t / 2; i++) {
          var n = 8192 * Math.round(e[2 * i + 1] / t) + Math.round(e[2 * i] / t) + r;
          e[i] = 67108863 & n, r = n < 67108864 ? 0 : n / 67108864 | 0
        }
        return e
      }, l.prototype.convert13b = function (e, t, r, i) {
        for (var n = 0, o = 0; o < t; o++) n += 0 | e[o], r[2 * o] = 8191 & n, n >>>= 13, r[2 * o + 1] = 8191 & n, n >>>= 13;
        for (o = 2 * t; o < i; ++o) r[o] = 0;
        m(0 === n), m(0 == (-8192 & n))
      }, l.prototype.stub = function (e) {
        for (var t = new Array(e), r = 0; r < e; r++) t[r] = 0;
        return t
      }, l.prototype.mulp = function (e, t, r) {
        var i = 2 * this.guessLen13b(e.length, t.length), n = this.makeRBT(i), o = this.stub(i), a = new Array(i),
            s = new Array(i), l = new Array(i), u = new Array(i), c = new Array(i), h = new Array(i), d = r.words;
        d.length = i, this.convert13b(e.words, e.length, a, i), this.convert13b(t.words, t.length, u, i), this.transform(a, o, s, l, i, n), this.transform(u, o, c, h, i, n);
        for (var f = 0; f < i; f++) {
          var p = s[f] * c[f] - l[f] * h[f];
          l[f] = s[f] * h[f] + l[f] * c[f], s[f] = p
        }
        return this.conjugate(s, l, i), this.transform(s, l, d, o, i, n), this.conjugate(d, o, i), this.normalize13b(d, i), r.negative = e.negative ^ t.negative, r.length = e.length + t.length, r.strip()
      }, g.prototype.mul = function (e) {
        var t = new g(null);
        return t.words = new Array(this.length + e.length), this.mulTo(e, t)
      }, g.prototype.mulf = function (e) {
        var t = new g(null);
        return t.words = new Array(this.length + e.length), s(this, e, t)
      }, g.prototype.imul = function (e) {
        return this.clone().mulTo(e, this)
      }, g.prototype.imuln = function (e) {
        m("number" == typeof e), m(e < 67108864);
        for (var t = 0, r = 0; r < this.length; r++) {
          var i = (0 | this.words[r]) * e, n = (67108863 & i) + (67108863 & t);
          t >>= 26, t += i / 67108864 | 0, t += n >>> 26, this.words[r] = 67108863 & n
        }
        return 0 !== t && (this.words[r] = t, this.length++), this
      }, g.prototype.muln = function (e) {
        return this.clone().imuln(e)
      }, g.prototype.sqr = function () {
        return this.mul(this)
      }, g.prototype.isqr = function () {
        return this.imul(this.clone())
      }, g.prototype.pow = function (e) {
        var t = function (e) {
          for (var t = new Array(e.bitLength()), r = 0; r < t.length; r++) {
            var i = r / 26 | 0, n = r % 26;
            t[r] = (e.words[i] & 1 << n) >>> n
          }
          return t
        }(e);
        if (0 === t.length) return new g(1);
        for (var r = this, i = 0; i < t.length && 0 === t[i]; i++, r = r.sqr()) ;
        if (++i < t.length) for (var n = r.sqr(); i < t.length; i++, n = n.sqr()) 0 !== t[i] && (r = r.mul(n));
        return r
      }, g.prototype.iushln = function (e) {
        m("number" == typeof e && 0 <= e);
        var t = e % 26, r = (e - t) / 26, i = 67108863 >>> 26 - t << 26 - t;
        if (0 != t) {
          for (var n = 0, o = 0; o < this.length; o++) {
            var a = this.words[o] & i, s = (0 | this.words[o]) - a << t;
            this.words[o] = s | n, n = a >>> 26 - t
          }
          n && (this.words[o] = n, this.length++)
        }
        if (0 != r) {
          for (o = this.length - 1; 0 <= o; o--) this.words[o + r] = this.words[o];
          for (o = 0; o < r; o++) this.words[o] = 0;
          this.length += r
        }
        return this.strip()
      }, g.prototype.ishln = function (e) {
        return m(0 === this.negative), this.iushln(e)
      }, g.prototype.iushrn = function (e, t, r) {
        var i;
        m("number" == typeof e && 0 <= e), i = t ? (t - t % 26) / 26 : 0;
        var n = e % 26, o = Math.min((e - n) / 26, this.length), a = 67108863 ^ 67108863 >>> n << n, s = r;
        if (i -= o, i = Math.max(0, i), s) {
          for (var l = 0; l < o; l++) s.words[l] = this.words[l];
          s.length = o
        }
        if (0 !== o) if (this.length > o) for (this.length -= o, l = 0; l < this.length; l++) this.words[l] = this.words[l + o]; else this.words[0] = 0, this.length = 1;
        for (var u = 0, l = this.length - 1; 0 <= l && (0 !== u || i <= l); l--) {
          var c = 0 | this.words[l];
          this.words[l] = u << 26 - n | c >>> n, u = c & a
        }
        return s && 0 !== u && (s.words[s.length++] = u), 0 === this.length && (this.words[0] = 0, this.length = 1), this.strip()
      }, g.prototype.ishrn = function (e, t, r) {
        return m(0 === this.negative), this.iushrn(e, t, r)
      }, g.prototype.shln = function (e) {
        return this.clone().ishln(e)
      }, g.prototype.ushln = function (e) {
        return this.clone().iushln(e)
      }, g.prototype.shrn = function (e) {
        return this.clone().ishrn(e)
      }, g.prototype.ushrn = function (e) {
        return this.clone().iushrn(e)
      }, g.prototype.testn = function (e) {
        m("number" == typeof e && 0 <= e);
        var t = e % 26, r = (e - t) / 26, i = 1 << t;
        return !(this.length <= r) && !!(this.words[r] & i)
      }, g.prototype.imaskn = function (e) {
        m("number" == typeof e && 0 <= e);
        var t, r = e % 26, i = (e - r) / 26;
        return m(0 === this.negative, "imaskn works only with positive numbers"), this.length <= i ? this : (0 != r && i++, this.length = Math.min(i, this.length), 0 != r && (t = 67108863 ^ 67108863 >>> r << r, this.words[this.length - 1] &= t), this.strip())
      }, g.prototype.maskn = function (e) {
        return this.clone().imaskn(e)
      }, g.prototype.iaddn = function (e) {
        return m("number" == typeof e), m(e < 67108864), e < 0 ? this.isubn(-e) : 0 !== this.negative ? (1 === this.length && (0 | this.words[0]) < e ? (this.words[0] = e - (0 | this.words[0]), this.negative = 0) : (this.negative = 0, this.isubn(e), this.negative = 1), this) : this._iaddn(e)
      }, g.prototype._iaddn = function (e) {
        this.words[0] += e;
        for (var t = 0; t < this.length && 67108864 <= this.words[t]; t++) this.words[t] -= 67108864, t === this.length - 1 ? this.words[t + 1] = 1 : this.words[t + 1]++;
        return this.length = Math.max(this.length, t + 1), this
      }, g.prototype.isubn = function (e) {
        if (m("number" == typeof e), m(e < 67108864), e < 0) return this.iaddn(-e);
        if (0 !== this.negative) return this.negative = 0, this.iaddn(e), this.negative = 1, this;
        if (this.words[0] -= e, 1 === this.length && this.words[0] < 0) this.words[0] = -this.words[0], this.negative = 1; else for (var t = 0; t < this.length && this.words[t] < 0; t++) this.words[t] += 67108864, --this.words[t + 1];
        return this.strip()
      }, g.prototype.addn = function (e) {
        return this.clone().iaddn(e)
      }, g.prototype.subn = function (e) {
        return this.clone().isubn(e)
      }, g.prototype.iabs = function () {
        return this.negative = 0, this
      }, g.prototype.abs = function () {
        return this.clone().iabs()
      }, g.prototype._ishlnsubmul = function (e, t, r) {
        var i, n = e.length + r;
        this._expand(n);
        for (var o = 0, a = 0; a < e.length; a++) {
          i = (0 | this.words[a + r]) + o;
          var s = (0 | e.words[a]) * t, o = ((i -= 67108863 & s) >> 26) - (s / 67108864 | 0);
          this.words[a + r] = 67108863 & i
        }
        for (; a < this.length - r; a++) o = (i = (0 | this.words[a + r]) + o) >> 26, this.words[a + r] = 67108863 & i;
        if (0 === o) return this.strip();
        for (m(-1 === o), a = o = 0; a < this.length; a++) o = (i = -(0 | this.words[a]) + o) >> 26, this.words[a] = 67108863 & i;
        return this.negative = 1, this.strip()
      }, g.prototype._wordDiv = function (e, t) {
        var r = (this.length, e.length), i = this.clone(), n = e, o = 0 | n.words[n.length - 1];
        0 != (r = 26 - this._countBits(o)) && (n = n.ushln(r), i.iushln(r), o = 0 | n.words[n.length - 1]);
        var a, s = i.length - n.length;
        if ("mod" !== t) {
          (a = new g(null)).length = 1 + s, a.words = new Array(a.length);
          for (var l = 0; l < a.length; l++) a.words[l] = 0
        }
        var u = i.clone()._ishlnsubmul(n, 1, s);
        0 === u.negative && (i = u, a && (a.words[s] = 1));
        for (var c = s - 1; 0 <= c; c--) {
          var h = 67108864 * (0 | i.words[n.length + c]) + (0 | i.words[n.length + c - 1]),
              h = Math.min(h / o | 0, 67108863);
          for (i._ishlnsubmul(n, h, c); 0 !== i.negative;) h--, i.negative = 0, i._ishlnsubmul(n, 1, c), i.isZero() || (i.negative ^= 1);
          a && (a.words[c] = h)
        }
        return a && a.strip(), i.strip(), "div" !== t && 0 != r && i.iushrn(r), {div: a || null, mod: i}
      }, g.prototype.divmod = function (e, t, r) {
        return m(!e.isZero()), this.isZero() ? {
          div: new g(0),
          mod: new g(0)
        } : 0 !== this.negative && 0 === e.negative ? (o = this.neg().divmod(e, t), "mod" !== t && (i = o.div.neg()), "div" !== t && (n = o.mod.neg(), r && 0 !== n.negative && n.iadd(e)), {
          div: i,
          mod: n
        }) : 0 === this.negative && 0 !== e.negative ? (o = this.divmod(e.neg(), t), "mod" !== t && (i = o.div.neg()), {
          div: i,
          mod: o.mod
        }) : 0 != (this.negative & e.negative) ? (o = this.neg().divmod(e.neg(), t), "div" !== t && (n = o.mod.neg(), r && 0 !== n.negative && n.isub(e)), {
          div: o.div,
          mod: n
        }) : e.length > this.length || this.cmp(e) < 0 ? {
          div: new g(0),
          mod: this
        } : 1 === e.length ? "div" === t ? {div: this.divn(e.words[0]), mod: null} : "mod" === t ? {
          div: null,
          mod: new g(this.modn(e.words[0]))
        } : {div: this.divn(e.words[0]), mod: new g(this.modn(e.words[0]))} : this._wordDiv(e, t);
        var i, n, o
      }, g.prototype.div = function (e) {
        return this.divmod(e, "div", !1).div
      }, g.prototype.mod = function (e) {
        return this.divmod(e, "mod", !1).mod
      }, g.prototype.umod = function (e) {
        return this.divmod(e, "mod", !0).mod
      }, g.prototype.divRound = function (e) {
        var t = this.divmod(e);
        if (t.mod.isZero()) return t.div;
        var r = 0 !== t.div.negative ? t.mod.isub(e) : t.mod, i = e.ushrn(1), n = e.andln(1), o = r.cmp(i);
        return o < 0 || 1 === n && 0 === o ? t.div : 0 !== t.div.negative ? t.div.isubn(1) : t.div.iaddn(1)
      }, g.prototype.modn = function (e) {
        m(e <= 67108863);
        for (var t = (1 << 26) % e, r = 0, i = this.length - 1; 0 <= i; i--) r = (t * r + (0 | this.words[i])) % e;
        return r
      }, g.prototype.idivn = function (e) {
        m(e <= 67108863);
        for (var t = 0, r = this.length - 1; 0 <= r; r--) {
          var i = (0 | this.words[r]) + 67108864 * t;
          this.words[r] = i / e | 0, t = i % e
        }
        return this.strip()
      }, g.prototype.divn = function (e) {
        return this.clone().idivn(e)
      }, g.prototype.egcd = function (e) {
        m(0 === e.negative), m(!e.isZero());
        for (var t = this, r = e.clone(), t = 0 !== t.negative ? t.umod(e) : t.clone(), i = new g(1), n = new g(0), o = new g(0), a = new g(1), s = 0; t.isEven() && r.isEven();) t.iushrn(1), r.iushrn(1), ++s;
        for (var l = r.clone(), u = t.clone(); !t.isZero();) {
          for (var c = 0, h = 1; 0 == (t.words[0] & h) && c < 26; ++c, h <<= 1) ;
          if (0 < c) for (t.iushrn(c); 0 < c--;) (i.isOdd() || n.isOdd()) && (i.iadd(l), n.isub(u)), i.iushrn(1), n.iushrn(1);
          for (var d = 0, f = 1; 0 == (r.words[0] & f) && d < 26; ++d, f <<= 1) ;
          if (0 < d) for (r.iushrn(d); 0 < d--;) (o.isOdd() || a.isOdd()) && (o.iadd(l), a.isub(u)), o.iushrn(1), a.iushrn(1);
          0 <= t.cmp(r) ? (t.isub(r), i.isub(o), n.isub(a)) : (r.isub(t), o.isub(i), a.isub(n))
        }
        return {a: o, b: a, gcd: r.iushln(s)}
      }, g.prototype._invmp = function (e) {
        m(0 === e.negative), m(!e.isZero());
        for (var t, r = this, i = e.clone(), r = 0 !== r.negative ? r.umod(e) : r.clone(), n = new g(1), o = new g(0), a = i.clone(); 0 < r.cmpn(1) && 0 < i.cmpn(1);) {
          for (var s = 0, l = 1; 0 == (r.words[0] & l) && s < 26; ++s, l <<= 1) ;
          if (0 < s) for (r.iushrn(s); 0 < s--;) n.isOdd() && n.iadd(a), n.iushrn(1);
          for (var u = 0, c = 1; 0 == (i.words[0] & c) && u < 26; ++u, c <<= 1) ;
          if (0 < u) for (i.iushrn(u); 0 < u--;) o.isOdd() && o.iadd(a), o.iushrn(1);
          0 <= r.cmp(i) ? (r.isub(i), n.isub(o)) : (i.isub(r), o.isub(n))
        }
        return (t = 0 === r.cmpn(1) ? n : o).cmpn(0) < 0 && t.iadd(e), t
      }, g.prototype.gcd = function (e) {
        if (this.isZero()) return e.abs();
        if (e.isZero()) return this.abs();
        var t = this.clone(), r = e.clone();
        t.negative = 0;
        for (var i = r.negative = 0; t.isEven() && r.isEven(); i++) t.iushrn(1), r.iushrn(1);
        for (; ;) {
          for (; t.isEven();) t.iushrn(1);
          for (; r.isEven();) r.iushrn(1);
          var n = t.cmp(r);
          if (n < 0) var o = t, t = r, r = o; else if (0 === n || 0 === r.cmpn(1)) break;
          t.isub(r)
        }
        return r.iushln(i)
      }, g.prototype.invm = function (e) {
        return this.egcd(e).a.umod(e)
      }, g.prototype.isEven = function () {
        return 0 == (1 & this.words[0])
      }, g.prototype.isOdd = function () {
        return 1 == (1 & this.words[0])
      }, g.prototype.andln = function (e) {
        return this.words[0] & e
      }, g.prototype.bincn = function (e) {
        m("number" == typeof e);
        var t = e % 26, r = (e - t) / 26, i = 1 << t;
        if (this.length <= r) return this._expand(1 + r), this.words[r] |= i, this;
        for (var n = i, o = r; 0 !== n && o < this.length; o++) {
          var a = 0 | this.words[o], n = (a += n) >>> 26;
          a &= 67108863, this.words[o] = a
        }
        return 0 !== n && (this.words[o] = n, this.length++), this
      }, g.prototype.isZero = function () {
        return 1 === this.length && 0 === this.words[0]
      }, g.prototype.cmpn = function (e) {
        var t, r, i = e < 0;
        return 0 === this.negative || i ? 0 === this.negative && i ? 1 : (this.strip(), r = 1 < this.length ? 1 : (i && (e = -e), m(e <= 67108863, "Number is too big"), (t = 0 | this.words[0]) === e ? 0 : t < e ? -1 : 1), 0 !== this.negative ? 0 | -r : r) : -1
      }, g.prototype.cmp = function (e) {
        if (0 !== this.negative && 0 === e.negative) return -1;
        if (0 === this.negative && 0 !== e.negative) return 1;
        var t = this.ucmp(e);
        return 0 !== this.negative ? 0 | -t : t
      }, g.prototype.ucmp = function (e) {
        if (this.length > e.length) return 1;
        if (this.length < e.length) return -1;
        for (var t = 0, r = this.length - 1; 0 <= r; r--) {
          var i = 0 | this.words[r], n = 0 | e.words[r];
          if (i != n) {
            i < n ? t = -1 : n < i && (t = 1);
            break
          }
        }
        return t
      }, g.prototype.gtn = function (e) {
        return 1 === this.cmpn(e)
      }, g.prototype.gt = function (e) {
        return 1 === this.cmp(e)
      }, g.prototype.gten = function (e) {
        return 0 <= this.cmpn(e)
      }, g.prototype.gte = function (e) {
        return 0 <= this.cmp(e)
      }, g.prototype.ltn = function (e) {
        return -1 === this.cmpn(e)
      }, g.prototype.lt = function (e) {
        return -1 === this.cmp(e)
      }, g.prototype.lten = function (e) {
        return this.cmpn(e) <= 0
      }, g.prototype.lte = function (e) {
        return this.cmp(e) <= 0
      }, g.prototype.eqn = function (e) {
        return 0 === this.cmpn(e)
      }, g.prototype.eq = function (e) {
        return 0 === this.cmp(e)
      }, g.red = function (e) {
        return new w(e)
      }, g.prototype.toRed = function (e) {
        return m(!this.red, "Already a number in reduction context"), m(0 === this.negative, "red works only with positives"), e.convertTo(this)._forceRed(e)
      }, g.prototype.fromRed = function () {
        return m(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this)
      }, g.prototype._forceRed = function (e) {
        return this.red = e, this
      }, g.prototype.forceRed = function (e) {
        return m(!this.red, "Already a number in reduction context"), this._forceRed(e)
      }, g.prototype.redAdd = function (e) {
        return m(this.red, "redAdd works only with red numbers"), this.red.add(this, e)
      }, g.prototype.redIAdd = function (e) {
        return m(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, e)
      }, g.prototype.redSub = function (e) {
        return m(this.red, "redSub works only with red numbers"), this.red.sub(this, e)
      }, g.prototype.redISub = function (e) {
        return m(this.red, "redISub works only with red numbers"), this.red.isub(this, e)
      }, g.prototype.redShl = function (e) {
        return m(this.red, "redShl works only with red numbers"), this.red.shl(this, e)
      }, g.prototype.redMul = function (e) {
        return m(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.mul(this, e)
      }, g.prototype.redIMul = function (e) {
        return m(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.imul(this, e)
      }, g.prototype.redSqr = function () {
        return m(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this)
      }, g.prototype.redISqr = function () {
        return m(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this)
      }, g.prototype.redSqrt = function () {
        return m(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this)
      }, g.prototype.redInvm = function () {
        return m(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this)
      }, g.prototype.redNeg = function () {
        return m(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this)
      }, g.prototype.redPow = function (e) {
        return m(this.red && !e.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, e)
      };
      var u = {k256: null, p224: null, p192: null, p25519: null};

      function c(e, t) {
        this.name = e, this.p = new g(t, 16), this.n = this.p.bitLength(), this.k = new g(1).iushln(this.n).isub(this.p), this.tmp = this._tmp()
      }

      function y() {
        c.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f")
      }

      function b() {
        c.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001")
      }

      function v() {
        c.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff")
      }

      function _() {
        c.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed")
      }

      function w(e) {
        var t;
        "string" == typeof e ? (t = g._prime(e), this.m = t.p, this.prime = t) : (m(e.gtn(1), "modulus must be greater than 1"), this.m = e, this.prime = null)
      }

      function S(e) {
        w.call(this, e), this.shift = this.m.bitLength(), this.shift % 26 != 0 && (this.shift += 26 - this.shift % 26), this.r = new g(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv)
      }

      c.prototype._tmp = function () {
        var e = new g(null);
        return e.words = new Array(Math.ceil(this.n / 13)), e
      }, c.prototype.ireduce = function (e) {
        for (var t, r = e; this.split(r, this.tmp), (t = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength()) > this.n;) ;
        var i = t < this.n ? -1 : r.ucmp(this.p);
        return 0 === i ? (r.words[0] = 0, r.length = 1) : 0 < i ? r.isub(this.p) : r.strip(), r
      }, c.prototype.split = function (e, t) {
        e.iushrn(this.n, 0, t)
      }, c.prototype.imulK = function (e) {
        return e.imul(this.k)
      }, r(y, c), y.prototype.split = function (e, t) {
        for (var r = Math.min(e.length, 9), i = 0; i < r; i++) t.words[i] = e.words[i];
        if (t.length = r, e.length <= 9) return e.words[0] = 0, void (e.length = 1);
        var n = e.words[9];
        for (t.words[t.length++] = 4194303 & n, i = 10; i < e.length; i++) {
          var o = 0 | e.words[i];
          e.words[i - 10] = (4194303 & o) << 4 | n >>> 22, n = o
        }
        n >>>= 22, 0 === (e.words[i - 10] = n) && 10 < e.length ? e.length -= 10 : e.length -= 9
      }, y.prototype.imulK = function (e) {
        e.words[e.length] = 0, e.words[e.length + 1] = 0, e.length += 2;
        for (var t = 0, r = 0; r < e.length; r++) {
          var i = 0 | e.words[r];
          t += 977 * i, e.words[r] = 67108863 & t, t = 64 * i + (t / 67108864 | 0)
        }
        return 0 === e.words[e.length - 1] && (e.length--, 0 === e.words[e.length - 1] && e.length--), e
      }, r(b, c), r(v, c), r(_, c), _.prototype.imulK = function (e) {
        for (var t = 0, r = 0; r < e.length; r++) {
          var i = 19 * (0 | e.words[r]) + t, n = 67108863 & i;
          i >>>= 26, e.words[r] = n, t = i
        }
        return 0 !== t && (e.words[e.length++] = t), e
      }, g._prime = function (e) {
        if (u[e]) return u[e];
        var t;
        if ("k256" === e) t = new y; else if ("p224" === e) t = new b; else if ("p192" === e) t = new v; else {
          if ("p25519" !== e) throw new Error("Unknown prime " + e);
          t = new _
        }
        return u[e] = t
      }, w.prototype._verify1 = function (e) {
        m(0 === e.negative, "red works only with positives"), m(e.red, "red works only with red numbers")
      }, w.prototype._verify2 = function (e, t) {
        m(0 == (e.negative | t.negative), "red works only with positives"), m(e.red && e.red === t.red, "red works only with red numbers")
      }, w.prototype.imod = function (e) {
        return this.prime ? this.prime.ireduce(e)._forceRed(this) : e.umod(this.m)._forceRed(this)
      }, w.prototype.neg = function (e) {
        return e.isZero() ? e.clone() : this.m.sub(e)._forceRed(this)
      }, w.prototype.add = function (e, t) {
        this._verify2(e, t);
        var r = e.add(t);
        return 0 <= r.cmp(this.m) && r.isub(this.m), r._forceRed(this)
      }, w.prototype.iadd = function (e, t) {
        this._verify2(e, t);
        var r = e.iadd(t);
        return 0 <= r.cmp(this.m) && r.isub(this.m), r
      }, w.prototype.sub = function (e, t) {
        this._verify2(e, t);
        var r = e.sub(t);
        return r.cmpn(0) < 0 && r.iadd(this.m), r._forceRed(this)
      }, w.prototype.isub = function (e, t) {
        this._verify2(e, t);
        var r = e.isub(t);
        return r.cmpn(0) < 0 && r.iadd(this.m), r
      }, w.prototype.shl = function (e, t) {
        return this._verify1(e), this.imod(e.ushln(t))
      }, w.prototype.imul = function (e, t) {
        return this._verify2(e, t), this.imod(e.imul(t))
      }, w.prototype.mul = function (e, t) {
        return this._verify2(e, t), this.imod(e.mul(t))
      }, w.prototype.isqr = function (e) {
        return this.imul(e, e.clone())
      }, w.prototype.sqr = function (e) {
        return this.mul(e, e)
      }, w.prototype.sqrt = function (e) {
        if (e.isZero()) return e.clone();
        var t = this.m.andln(3);
        if (m(t % 2 == 1), 3 === t) {
          var r = this.m.add(new g(1)).iushrn(2);
          return this.pow(e, r)
        }
        for (var i = this.m.subn(1), n = 0; !i.isZero() && 0 === i.andln(1);) n++, i.iushrn(1);
        m(!i.isZero());
        for (var o = new g(1).toRed(this), a = o.redNeg(), s = this.m.subn(1).iushrn(1), l = new g(2 * (l = this.m.bitLength()) * l).toRed(this); 0 !== this.pow(l, s).cmp(a);) l.redIAdd(a);
        for (var u = this.pow(l, i), c = this.pow(e, i.addn(1).iushrn(1)), h = this.pow(e, i), d = n; 0 !== h.cmp(o);) {
          for (var f = h, p = 0; 0 !== f.cmp(o); p++) f = f.redSqr();
          m(p < d);
          var y = this.pow(u, new g(1).iushln(d - p - 1)), c = c.redMul(y), u = y.redSqr(), h = h.redMul(u), d = p
        }
        return c
      }, w.prototype.invm = function (e) {
        var t = e._invmp(this.m);
        return 0 !== t.negative ? (t.negative = 0, this.imod(t).redNeg()) : this.imod(t)
      }, w.prototype.pow = function (e, t) {
        if (t.isZero()) return new g(1).toRed(this);
        if (0 === t.cmpn(1)) return e.clone();
        var r = new Array(16);
        r[0] = new g(1).toRed(this), r[1] = e;
        for (var i = 2; i < r.length; i++) r[i] = this.mul(r[i - 1], e);
        var n = r[0], o = 0, a = 0, s = t.bitLength() % 26;
        for (0 === s && (s = 26), i = t.length - 1; 0 <= i; i--) {
          for (var l = t.words[i], u = s - 1; 0 <= u; u--) {
            var c = l >> u & 1;
            n !== r[0] && (n = this.sqr(n)), 0 != c || 0 !== o ? (o <<= 1, o |= c, (4 === ++a || 0 === i && 0 === u) && (n = this.mul(n, r[o]), o = a = 0)) : a = 0
          }
          s = 26
        }
        return n
      }, w.prototype.convertTo = function (e) {
        var t = e.umod(this.m);
        return t === e ? t.clone() : t
      }, w.prototype.convertFrom = function (e) {
        var t = e.clone();
        return t.red = null, t
      }, g.mont = function (e) {
        return new S(e)
      }, r(S, w), S.prototype.convertTo = function (e) {
        return this.imod(e.ushln(this.shift))
      }, S.prototype.convertFrom = function (e) {
        var t = this.imod(e.mul(this.rinv));
        return t.red = null, t
      }, S.prototype.imul = function (e, t) {
        if (e.isZero() || t.isZero()) return e.words[0] = 0, e.length = 1, e;
        var r = e.imul(t), i = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
            n = r.isub(i).iushrn(this.shift), o = n;
        return 0 <= n.cmp(this.m) ? o = n.isub(this.m) : n.cmpn(0) < 0 && (o = n.iadd(this.m)), o._forceRed(this)
      }, S.prototype.mul = function (e, t) {
        if (e.isZero() || t.isZero()) return new g(0)._forceRed(this);
        var r = e.mul(t), i = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
            n = r.isub(i).iushrn(this.shift), o = n;
        return 0 <= n.cmp(this.m) ? o = n.isub(this.m) : n.cmpn(0) < 0 && (o = n.iadd(this.m)), o._forceRed(this)
      }, S.prototype.invm = function (e) {
        return this.imod(e._invmp(this.m).mul(this.r2))._forceRed(this)
      }
    }(void 0 === e || e, this)
  }, {buffer: 19}],
  16: [function (e, t, r) {
    "use strict";
    r.byteLength = function (e) {
      var t = h(e), r = t[0], i = t[1];
      return 3 * (r + i) / 4 - i
    }, r.toByteArray = function (e) {
      var t, r, i = h(e), n = i[0], o = i[1], a = new c(function (e, t) {
        return 3 * (e + t) / 4 - t
      }(n, o)), s = 0, l = 0 < o ? n - 4 : n;
      for (r = 0; r < l; r += 4) t = u[e.charCodeAt(r)] << 18 | u[e.charCodeAt(r + 1)] << 12 | u[e.charCodeAt(r + 2)] << 6 | u[e.charCodeAt(r + 3)], a[s++] = t >> 16 & 255, a[s++] = t >> 8 & 255, a[s++] = 255 & t;
      2 === o && (t = u[e.charCodeAt(r)] << 2 | u[e.charCodeAt(r + 1)] >> 4, a[s++] = 255 & t);
      1 === o && (t = u[e.charCodeAt(r)] << 10 | u[e.charCodeAt(r + 1)] << 4 | u[e.charCodeAt(r + 2)] >> 2, a[s++] = t >> 8 & 255, a[s++] = 255 & t);
      return a
    }, r.fromByteArray = function (e) {
      for (var t, r = e.length, i = r % 3, n = [], o = 0, a = r - i; o < a; o += 16383) n.push(l(e, o, a < o + 16383 ? a : o + 16383));
      1 == i ? (t = e[r - 1], n.push(s[t >> 2] + s[t << 4 & 63] + "==")) : 2 == i && (t = (e[r - 2] << 8) + e[r - 1], n.push(s[t >> 10] + s[t >> 4 & 63] + s[t << 2 & 63] + "="));
      return n.join("")
    };
    for (var s = [], u = [], c = "undefined" != typeof Uint8Array ? Uint8Array : Array, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = 0, o = i.length; n < o; ++n) s[n] = i[n], u[i.charCodeAt(n)] = n;

    function h(e) {
      var t = e.length;
      if (0 < t % 4) throw new Error("Invalid string. Length must be a multiple of 4");
      var r = e.indexOf("=");
      return -1 === r && (r = t), [r, r === t ? 0 : 4 - r % 4]
    }

    function l(e, t, r) {
      for (var i, n, o = [], a = t; a < r; a += 3) i = (e[a] << 16 & 16711680) + (e[a + 1] << 8 & 65280) + (255 & e[a + 2]), o.push(s[(n = i) >> 18 & 63] + s[n >> 12 & 63] + s[n >> 6 & 63] + s[63 & n]);
      return o.join("")
    }

    u["-".charCodeAt(0)] = 62, u["_".charCodeAt(0)] = 63
  }, {}],
  17: [function (T, e, t) {
    !function (e, t) {
      "use strict";

      function m(e, t) {
        if (!e) throw new Error(t || "Assertion failed")
      }

      function r(e, t) {
        e.super_ = t;

        function r() {
        }

        r.prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e
      }

      function g(e, t, r) {
        if (g.isBN(e)) return e;
        this.negative = 0, this.words = null, this.length = 0, (this.red = null) !== e && ("le" !== t && "be" !== t || (r = t, t = 10), this._init(e || 0, t || 10, r || "be"))
      }

      var i;
      "object" == typeof e ? e.exports = g : t.BN = g, (g.BN = g).wordSize = 26;
      try {
        i = T("buffer").Buffer
      } catch (e) {
      }

      function a(e, t, r) {
        for (var i = 0, n = Math.min(e.length, r), o = 0, a = t; a < n; a++) {
          var s, l = e.charCodeAt(a) - 48;
          i <<= 4, i |= s = 49 <= l && l <= 54 ? l - 49 + 10 : 17 <= l && l <= 22 ? l - 17 + 10 : l, o |= s
        }
        return m(!(240 & o), "Invalid character in " + e), i
      }

      function h(e, t, r, i) {
        for (var n = 0, o = 0, a = Math.min(e.length, r), s = t; s < a; s++) {
          var l = e.charCodeAt(s) - 48;
          n *= i, o = 49 <= l ? l - 49 + 10 : 17 <= l ? l - 17 + 10 : l, m(0 <= l && o < i, "Invalid character"), n += o
        }
        return n
      }

      function n(e, t) {
        e.words = t.words, e.length = t.length, e.negative = t.negative, e.red = t.red
      }

      function o() {
        return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">"
      }

      g.isBN = function (e) {
        return e instanceof g || null !== e && "object" == typeof e && e.constructor.wordSize === g.wordSize && Array.isArray(e.words)
      }, g.max = function (e, t) {
        return 0 < e.cmp(t) ? e : t
      }, g.min = function (e, t) {
        return e.cmp(t) < 0 ? e : t
      }, g.prototype._init = function (e, t, r) {
        if ("number" == typeof e) return this._initNumber(e, t, r);
        if ("object" == typeof e) return this._initArray(e, t, r);
        "hex" === t && (t = 16), m(t === (0 | t) && 2 <= t && t <= 36);
        var i = 0;
        "-" === (e = e.toString().replace(/\s+/g, ""))[0] && i++, 16 === t ? this._parseHex(e, i) : this._parseBase(e, t, i), "-" === e[0] && (this.negative = 1), this._strip(), "le" === r && this._initArray(this.toArray(), t, r)
      }, g.prototype._initNumber = function (e, t, r) {
        e < 0 && (this.negative = 1, e = -e), e < 67108864 ? (this.words = [67108863 & e], this.length = 1) : e < 4503599627370496 ? (this.words = [67108863 & e, e / 67108864 & 67108863], this.length = 2) : (m(e < 9007199254740992), this.words = [67108863 & e, e / 67108864 & 67108863, 1], this.length = 3), "le" === r && this._initArray(this.toArray(), t, r)
      }, g.prototype._initArray = function (e, t, r) {
        if (m("number" == typeof e.length), e.length <= 0) return this.words = [0], this.length = 1, this;
        this.length = Math.ceil(e.length / 3), this.words = new Array(this.length);
        for (var i, n, o = 0; o < this.length; o++) this.words[o] = 0;
        var a = 0;
        if ("be" === r) for (o = e.length - 1, i = 0; 0 <= o; o -= 3) n = e[o] | e[o - 1] << 8 | e[o - 2] << 16, this.words[i] |= n << a & 67108863, this.words[i + 1] = n >>> 26 - a & 67108863, 26 <= (a += 24) && (a -= 26, i++); else if ("le" === r) for (i = o = 0; o < e.length; o += 3) n = e[o] | e[o + 1] << 8 | e[o + 2] << 16, this.words[i] |= n << a & 67108863, this.words[i + 1] = n >>> 26 - a & 67108863, 26 <= (a += 24) && (a -= 26, i++);
        return this._strip()
      }, g.prototype._parseHex = function (e, t) {
        this.length = Math.ceil((e.length - t) / 6), this.words = new Array(this.length);
        for (var r, i = 0; i < this.length; i++) this.words[i] = 0;
        for (var n = 0, i = e.length - 6, o = 0; t <= i; i -= 6) r = a(e, i, i + 6), this.words[o] |= r << n & 67108863, this.words[o + 1] |= r >>> 26 - n & 4194303, 26 <= (n += 24) && (n -= 26, o++);
        i + 6 !== t && (r = a(e, t, i + 6), this.words[o] |= r << n & 67108863, this.words[o + 1] |= r >>> 26 - n & 4194303), this._strip()
      }, g.prototype._parseBase = function (e, t, r) {
        this.words = [0];
        for (var i = 0, n = this.length = 1; n <= 67108863; n *= t) i++;
        i--, n = n / t | 0;
        for (var o = e.length - r, a = o % i, s = Math.min(o, o - a) + r, l = 0, u = r; u < s; u += i) l = h(e, u, u + i, t), this.imuln(n), this.words[0] + l < 67108864 ? this.words[0] += l : this._iaddn(l);
        if (0 != a) {
          for (var c = 1, l = h(e, u, e.length, t), u = 0; u < a; u++) c *= t;
          this.imuln(c), this.words[0] + l < 67108864 ? this.words[0] += l : this._iaddn(l)
        }
      }, g.prototype.copy = function (e) {
        e.words = new Array(this.length);
        for (var t = 0; t < this.length; t++) e.words[t] = this.words[t];
        e.length = this.length, e.negative = this.negative, e.red = this.red
      }, g.prototype._move = function (e) {
        n(e, this)
      }, g.prototype.clone = function () {
        var e = new g(null);
        return this.copy(e), e
      }, g.prototype._expand = function (e) {
        for (; this.length < e;) this.words[this.length++] = 0;
        return this
      }, g.prototype._strip = function () {
        for (; 1 < this.length && 0 === this.words[this.length - 1];) this.length--;
        return this._normSign()
      }, g.prototype._normSign = function () {
        return 1 === this.length && 0 === this.words[0] && (this.negative = 0), this
      }, "undefined" != typeof Symbol && "function" == typeof Symbol["for"] ? g.prototype[Symbol["for"]("nodejs.util.inspect.custom")] = o : g.prototype.inspect = o;
      var d = ["", "0", "00", "000", "0000", "00000", "000000", "0000000", "00000000", "000000000", "0000000000", "00000000000", "000000000000", "0000000000000", "00000000000000", "000000000000000", "0000000000000000", "00000000000000000", "000000000000000000", "0000000000000000000", "00000000000000000000", "000000000000000000000", "0000000000000000000000", "00000000000000000000000", "000000000000000000000000", "0000000000000000000000000"],
          f = [0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
          p = [0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536, 11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101, 5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176];
      g.prototype.toString = function (e, t) {
        if (t = 0 | t || 1, 16 === (e = e || 10) || "hex" === e) {
          s = "";
          for (var r = 0, i = 0, n = 0; n < this.length; n++) {
            var o = this.words[n], a = (16777215 & (o << r | i)).toString(16),
                s = 0 !== (i = o >>> 24 - r & 16777215) || n !== this.length - 1 ? d[6 - a.length] + a + s : a + s;
            26 <= (r += 2) && (r -= 26, n--)
          }
          for (0 !== i && (s = i.toString(16) + s); s.length % t != 0;) s = "0" + s;
          return 0 !== this.negative && (s = "-" + s), s
        }
        if (e === (0 | e) && 2 <= e && e <= 36) {
          var l = f[e], u = p[e];
          for (s = "", (c = this.clone()).negative = 0; !c.isZero();) {
            var c, h = c.modrn(u).toString(e);
            s = (c = c.idivn(u)).isZero() ? h + s : d[l - h.length] + h + s
          }
          for (this.isZero() && (s = "0" + s); s.length % t != 0;) s = "0" + s;
          return 0 !== this.negative && (s = "-" + s), s
        }
        m(!1, "Base should be between 2 and 36")
      }, g.prototype.toNumber = function () {
        var e = this.words[0];
        return 2 === this.length ? e += 67108864 * this.words[1] : 3 === this.length && 1 === this.words[2] ? e += 4503599627370496 + 67108864 * this.words[1] : 2 < this.length && m(!1, "Number can only safely store up to 53 bits"), 0 !== this.negative ? -e : e
      }, g.prototype.toJSON = function () {
        return this.toString(16, 2)
      }, i && (g.prototype.toBuffer = function (e, t) {
        return this.toArrayLike(i, e, t)
      }), g.prototype.toArray = function (e, t) {
        return this.toArrayLike(Array, e, t)
      };

      function s(e, t, r) {
        r.negative = t.negative ^ e.negative;
        var i = e.length + t.length | 0, i = (r.length = i) - 1 | 0,
            n = 67108863 & (h = (0 | e.words[0]) * (0 | t.words[0])), o = h / 67108864 | 0;
        r.words[0] = n;
        for (var a = 1; a < i; a++) {
          for (var s = o >>> 26, l = 67108863 & o, u = Math.min(a, t.length - 1), c = Math.max(0, a - e.length + 1); c <= u; c++) {
            var h, d = a - c | 0;
            s += (h = (0 | e.words[d]) * (0 | t.words[c]) + l) / 67108864 | 0, l = 67108863 & h
          }
          r.words[a] = 0 | l, o = 0 | s
        }
        return 0 !== o ? r.words[a] = 0 | o : r.length--, r._strip()
      }

      g.prototype.toArrayLike = function (e, t, r) {
        this._strip();
        var i = this.byteLength(), n = r || Math.max(1, i);
        m(i <= n, "byte array longer than desired length"), m(0 < n, "Requested array length <= 0");
        var o, a, s = (a = n, (o = e).allocUnsafe ? o.allocUnsafe(a) : new o(a));
        return this["_toArrayLike" + ("le" === t ? "LE" : "BE")](s, i), s
      }, g.prototype._toArrayLikeLE = function (e) {
        for (var t = 0, r = 0, i = 0, n = 0; i < this.length; i++) {
          var o = this.words[i] << n | r;
          e[t++] = 255 & o, t < e.length && (e[t++] = o >> 8 & 255), t < e.length && (e[t++] = o >> 16 & 255), 6 === n ? (t < e.length && (e[t++] = o >> 24 & 255), n = r = 0) : (r = o >>> 24, n += 2)
        }
        if (t < e.length) for (e[t++] = r; t < e.length;) e[t++] = 0
      }, g.prototype._toArrayLikeBE = function (e) {
        for (var t = e.length - 1, r = 0, i = 0, n = 0; i < this.length; i++) {
          var o = this.words[i] << n | r;
          e[t--] = 255 & o, 0 <= t && (e[t--] = o >> 8 & 255), 0 <= t && (e[t--] = o >> 16 & 255), 6 === n ? (0 <= t && (e[t--] = o >> 24 & 255), n = r = 0) : (r = o >>> 24, n += 2)
        }
        if (0 <= t) for (e[t--] = r; 0 <= t;) e[t--] = 0
      }, Math.clz32 ? g.prototype._countBits = function (e) {
        return 32 - Math.clz32(e)
      } : g.prototype._countBits = function (e) {
        var t = e, r = 0;
        return 4096 <= t && (r += 13, t >>>= 13), 64 <= t && (r += 7, t >>>= 7), 8 <= t && (r += 4, t >>>= 4), 2 <= t && (r += 2, t >>>= 2), r + t
      }, g.prototype._zeroBits = function (e) {
        if (0 === e) return 26;
        var t = e, r = 0;
        return 0 == (8191 & t) && (r += 13, t >>>= 13), 0 == (127 & t) && (r += 7, t >>>= 7), 0 == (15 & t) && (r += 4, t >>>= 4), 0 == (3 & t) && (r += 2, t >>>= 2), 0 == (1 & t) && r++, r
      }, g.prototype.bitLength = function () {
        var e = this.words[this.length - 1], t = this._countBits(e);
        return 26 * (this.length - 1) + t
      }, g.prototype.zeroBits = function () {
        if (this.isZero()) return 0;
        for (var e = 0, t = 0; t < this.length; t++) {
          var r = this._zeroBits(this.words[t]);
          if (e += r, 26 !== r) break
        }
        return e
      }, g.prototype.byteLength = function () {
        return Math.ceil(this.bitLength() / 8)
      }, g.prototype.toTwos = function (e) {
        return 0 !== this.negative ? this.abs().inotn(e).iaddn(1) : this.clone()
      }, g.prototype.fromTwos = function (e) {
        return this.testn(e - 1) ? this.notn(e).iaddn(1).ineg() : this.clone()
      }, g.prototype.isNeg = function () {
        return 0 !== this.negative
      }, g.prototype.neg = function () {
        return this.clone().ineg()
      }, g.prototype.ineg = function () {
        return this.isZero() || (this.negative ^= 1), this
      }, g.prototype.iuor = function (e) {
        for (; this.length < e.length;) this.words[this.length++] = 0;
        for (var t = 0; t < e.length; t++) this.words[t] = this.words[t] | e.words[t];
        return this._strip()
      }, g.prototype.ior = function (e) {
        return m(0 == (this.negative | e.negative)), this.iuor(e)
      }, g.prototype.or = function (e) {
        return this.length > e.length ? this.clone().ior(e) : e.clone().ior(this)
      }, g.prototype.uor = function (e) {
        return this.length > e.length ? this.clone().iuor(e) : e.clone().iuor(this)
      }, g.prototype.iuand = function (e) {
        for (var t = this.length > e.length ? e : this, r = 0; r < t.length; r++) this.words[r] = this.words[r] & e.words[r];
        return this.length = t.length, this._strip()
      }, g.prototype.iand = function (e) {
        return m(0 == (this.negative | e.negative)), this.iuand(e)
      }, g.prototype.and = function (e) {
        return this.length > e.length ? this.clone().iand(e) : e.clone().iand(this)
      }, g.prototype.uand = function (e) {
        return this.length > e.length ? this.clone().iuand(e) : e.clone().iuand(this)
      }, g.prototype.iuxor = function (e) {
        for (var t, r = this.length > e.length ? (t = this, e) : (t = e, this), i = 0; i < r.length; i++) this.words[i] = t.words[i] ^ r.words[i];
        if (this !== t) for (; i < t.length; i++) this.words[i] = t.words[i];
        return this.length = t.length, this._strip()
      }, g.prototype.ixor = function (e) {
        return m(0 == (this.negative | e.negative)), this.iuxor(e)
      }, g.prototype.xor = function (e) {
        return this.length > e.length ? this.clone().ixor(e) : e.clone().ixor(this)
      }, g.prototype.uxor = function (e) {
        return this.length > e.length ? this.clone().iuxor(e) : e.clone().iuxor(this)
      }, g.prototype.inotn = function (e) {
        m("number" == typeof e && 0 <= e);
        var t = 0 | Math.ceil(e / 26), r = e % 26;
        this._expand(t), 0 < r && t--;
        for (var i = 0; i < t; i++) this.words[i] = 67108863 & ~this.words[i];
        return 0 < r && (this.words[i] = ~this.words[i] & 67108863 >> 26 - r), this._strip()
      }, g.prototype.notn = function (e) {
        return this.clone().inotn(e)
      }, g.prototype.setn = function (e, t) {
        m("number" == typeof e && 0 <= e);
        var r = e / 26 | 0, i = e % 26;
        return this._expand(1 + r), this.words[r] = t ? this.words[r] | 1 << i : this.words[r] & ~(1 << i), this._strip()
      }, g.prototype.iadd = function (e) {
        var t, r, i;
        if (0 !== this.negative && 0 === e.negative) return this.negative = 0, t = this.isub(e), this.negative ^= 1, this._normSign();
        if (0 === this.negative && 0 !== e.negative) return e.negative = 0, t = this.isub(e), e.negative = 1, t._normSign();
        i = this.length > e.length ? (r = this, e) : (r = e, this);
        for (var n = 0, o = 0; o < i.length; o++) t = (0 | r.words[o]) + (0 | i.words[o]) + n, this.words[o] = 67108863 & t, n = t >>> 26;
        for (; 0 !== n && o < r.length; o++) t = (0 | r.words[o]) + n, this.words[o] = 67108863 & t, n = t >>> 26;
        if (this.length = r.length, 0 !== n) this.words[this.length] = n, this.length++; else if (r !== this) for (; o < r.length; o++) this.words[o] = r.words[o];
        return this
      }, g.prototype.add = function (e) {
        var t;
        return 0 !== e.negative && 0 === this.negative ? (e.negative = 0, t = this.sub(e), e.negative ^= 1, t) : 0 === e.negative && 0 !== this.negative ? (this.negative = 0, t = e.sub(this), this.negative = 1, t) : this.length > e.length ? this.clone().iadd(e) : e.clone().iadd(this)
      }, g.prototype.isub = function (e) {
        if (0 !== e.negative) {
          e.negative = 0;
          var t = this.iadd(e);
          return e.negative = 1, t._normSign()
        }
        if (0 !== this.negative) return this.negative = 0, this.iadd(e), this.negative = 1, this._normSign();
        var r, i, n = this.cmp(e);
        if (0 === n) return this.negative = 0, this.length = 1, this.words[0] = 0, this;
        i = 0 < n ? (r = this, e) : (r = e, this);
        for (var o = 0, a = 0; a < i.length; a++) o = (t = (0 | r.words[a]) - (0 | i.words[a]) + o) >> 26, this.words[a] = 67108863 & t;
        for (; 0 !== o && a < r.length; a++) o = (t = (0 | r.words[a]) + o) >> 26, this.words[a] = 67108863 & t;
        if (0 === o && a < r.length && r !== this) for (; a < r.length; a++) this.words[a] = r.words[a];
        return this.length = Math.max(this.length, a), r !== this && (this.negative = 1), this._strip()
      }, g.prototype.sub = function (e) {
        return this.clone().isub(e)
      };
      var l = function (e, t, r) {
        var i, n, o, a = e.words, s = t.words, l = r.words, u = 0, c = 0 | a[0], h = 8191 & c, d = c >>> 13,
            f = 0 | a[1], p = 8191 & f, y = f >>> 13, m = 0 | a[2], g = 8191 & m, b = m >>> 13, v = 0 | a[3],
            _ = 8191 & v, w = v >>> 13, S = 0 | a[4], E = 8191 & S, x = S >>> 13, T = 0 | a[5], M = 8191 & T,
            k = T >>> 13, P = 0 | a[6], C = 8191 & P, A = P >>> 13, I = 0 | a[7], R = 8191 & I, L = I >>> 13,
            D = 0 | a[8], B = 8191 & D, O = D >>> 13, U = 0 | a[9], N = 8191 & U, H = U >>> 13, j = 0 | s[0],
            F = 8191 & j, q = j >>> 13, V = 0 | s[1], z = 8191 & V, K = V >>> 13, W = 0 | s[2], X = 8191 & W,
            G = W >>> 13, Y = 0 | s[3], Q = 8191 & Y, J = Y >>> 13, Z = 0 | s[4], $ = 8191 & Z, ee = Z >>> 13,
            te = 0 | s[5], re = 8191 & te, ie = te >>> 13, ne = 0 | s[6], oe = 8191 & ne, ae = ne >>> 13, se = 0 | s[7],
            le = 8191 & se, ue = se >>> 13, ce = 0 | s[8], he = 8191 & ce, de = ce >>> 13, fe = 0 | s[9],
            pe = 8191 & fe, ye = fe >>> 13;
        r.negative = e.negative ^ t.negative, r.length = 19;
        var me = (u + (i = Math.imul(h, F)) | 0) + ((8191 & (n = (n = Math.imul(h, q)) + Math.imul(d, F) | 0)) << 13) | 0,
            u = ((o = Math.imul(d, q)) + (n >>> 13) | 0) + (me >>> 26) | 0;
        me &= 67108863, i = Math.imul(p, F), n = (n = Math.imul(p, q)) + Math.imul(y, F) | 0, o = Math.imul(y, q);
        var ge = (u + (i = i + Math.imul(h, z) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, K) | 0) + Math.imul(d, z) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, K) | 0) + (n >>> 13) | 0) + (ge >>> 26) | 0, ge &= 67108863, i = Math.imul(g, F), n = (n = Math.imul(g, q)) + Math.imul(b, F) | 0, o = Math.imul(b, q), i = i + Math.imul(p, z) | 0, n = (n = n + Math.imul(p, K) | 0) + Math.imul(y, z) | 0, o = o + Math.imul(y, K) | 0;
        var be = (u + (i = i + Math.imul(h, X) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, G) | 0) + Math.imul(d, X) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, G) | 0) + (n >>> 13) | 0) + (be >>> 26) | 0, be &= 67108863, i = Math.imul(_, F), n = (n = Math.imul(_, q)) + Math.imul(w, F) | 0, o = Math.imul(w, q), i = i + Math.imul(g, z) | 0, n = (n = n + Math.imul(g, K) | 0) + Math.imul(b, z) | 0, o = o + Math.imul(b, K) | 0, i = i + Math.imul(p, X) | 0, n = (n = n + Math.imul(p, G) | 0) + Math.imul(y, X) | 0, o = o + Math.imul(y, G) | 0;
        var ve = (u + (i = i + Math.imul(h, Q) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, J) | 0) + Math.imul(d, Q) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, J) | 0) + (n >>> 13) | 0) + (ve >>> 26) | 0, ve &= 67108863, i = Math.imul(E, F), n = (n = Math.imul(E, q)) + Math.imul(x, F) | 0, o = Math.imul(x, q), i = i + Math.imul(_, z) | 0, n = (n = n + Math.imul(_, K) | 0) + Math.imul(w, z) | 0, o = o + Math.imul(w, K) | 0, i = i + Math.imul(g, X) | 0, n = (n = n + Math.imul(g, G) | 0) + Math.imul(b, X) | 0, o = o + Math.imul(b, G) | 0, i = i + Math.imul(p, Q) | 0, n = (n = n + Math.imul(p, J) | 0) + Math.imul(y, Q) | 0, o = o + Math.imul(y, J) | 0;
        var _e = (u + (i = i + Math.imul(h, $) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, ee) | 0) + Math.imul(d, $) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, ee) | 0) + (n >>> 13) | 0) + (_e >>> 26) | 0, _e &= 67108863, i = Math.imul(M, F), n = (n = Math.imul(M, q)) + Math.imul(k, F) | 0, o = Math.imul(k, q), i = i + Math.imul(E, z) | 0, n = (n = n + Math.imul(E, K) | 0) + Math.imul(x, z) | 0, o = o + Math.imul(x, K) | 0, i = i + Math.imul(_, X) | 0, n = (n = n + Math.imul(_, G) | 0) + Math.imul(w, X) | 0, o = o + Math.imul(w, G) | 0, i = i + Math.imul(g, Q) | 0, n = (n = n + Math.imul(g, J) | 0) + Math.imul(b, Q) | 0, o = o + Math.imul(b, J) | 0, i = i + Math.imul(p, $) | 0, n = (n = n + Math.imul(p, ee) | 0) + Math.imul(y, $) | 0, o = o + Math.imul(y, ee) | 0;
        var we = (u + (i = i + Math.imul(h, re) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, ie) | 0) + Math.imul(d, re) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, ie) | 0) + (n >>> 13) | 0) + (we >>> 26) | 0, we &= 67108863, i = Math.imul(C, F), n = (n = Math.imul(C, q)) + Math.imul(A, F) | 0, o = Math.imul(A, q), i = i + Math.imul(M, z) | 0, n = (n = n + Math.imul(M, K) | 0) + Math.imul(k, z) | 0, o = o + Math.imul(k, K) | 0, i = i + Math.imul(E, X) | 0, n = (n = n + Math.imul(E, G) | 0) + Math.imul(x, X) | 0, o = o + Math.imul(x, G) | 0, i = i + Math.imul(_, Q) | 0, n = (n = n + Math.imul(_, J) | 0) + Math.imul(w, Q) | 0, o = o + Math.imul(w, J) | 0, i = i + Math.imul(g, $) | 0, n = (n = n + Math.imul(g, ee) | 0) + Math.imul(b, $) | 0, o = o + Math.imul(b, ee) | 0, i = i + Math.imul(p, re) | 0, n = (n = n + Math.imul(p, ie) | 0) + Math.imul(y, re) | 0, o = o + Math.imul(y, ie) | 0;
        var Se = (u + (i = i + Math.imul(h, oe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, ae) | 0) + Math.imul(d, oe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, ae) | 0) + (n >>> 13) | 0) + (Se >>> 26) | 0, Se &= 67108863, i = Math.imul(R, F), n = (n = Math.imul(R, q)) + Math.imul(L, F) | 0, o = Math.imul(L, q), i = i + Math.imul(C, z) | 0, n = (n = n + Math.imul(C, K) | 0) + Math.imul(A, z) | 0, o = o + Math.imul(A, K) | 0, i = i + Math.imul(M, X) | 0, n = (n = n + Math.imul(M, G) | 0) + Math.imul(k, X) | 0, o = o + Math.imul(k, G) | 0, i = i + Math.imul(E, Q) | 0, n = (n = n + Math.imul(E, J) | 0) + Math.imul(x, Q) | 0, o = o + Math.imul(x, J) | 0, i = i + Math.imul(_, $) | 0, n = (n = n + Math.imul(_, ee) | 0) + Math.imul(w, $) | 0, o = o + Math.imul(w, ee) | 0, i = i + Math.imul(g, re) | 0, n = (n = n + Math.imul(g, ie) | 0) + Math.imul(b, re) | 0, o = o + Math.imul(b, ie) | 0, i = i + Math.imul(p, oe) | 0, n = (n = n + Math.imul(p, ae) | 0) + Math.imul(y, oe) | 0, o = o + Math.imul(y, ae) | 0;
        var Ee = (u + (i = i + Math.imul(h, le) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, ue) | 0) + Math.imul(d, le) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, ue) | 0) + (n >>> 13) | 0) + (Ee >>> 26) | 0, Ee &= 67108863, i = Math.imul(B, F), n = (n = Math.imul(B, q)) + Math.imul(O, F) | 0, o = Math.imul(O, q), i = i + Math.imul(R, z) | 0, n = (n = n + Math.imul(R, K) | 0) + Math.imul(L, z) | 0, o = o + Math.imul(L, K) | 0, i = i + Math.imul(C, X) | 0, n = (n = n + Math.imul(C, G) | 0) + Math.imul(A, X) | 0, o = o + Math.imul(A, G) | 0, i = i + Math.imul(M, Q) | 0, n = (n = n + Math.imul(M, J) | 0) + Math.imul(k, Q) | 0, o = o + Math.imul(k, J) | 0, i = i + Math.imul(E, $) | 0, n = (n = n + Math.imul(E, ee) | 0) + Math.imul(x, $) | 0, o = o + Math.imul(x, ee) | 0, i = i + Math.imul(_, re) | 0, n = (n = n + Math.imul(_, ie) | 0) + Math.imul(w, re) | 0, o = o + Math.imul(w, ie) | 0, i = i + Math.imul(g, oe) | 0, n = (n = n + Math.imul(g, ae) | 0) + Math.imul(b, oe) | 0, o = o + Math.imul(b, ae) | 0, i = i + Math.imul(p, le) | 0, n = (n = n + Math.imul(p, ue) | 0) + Math.imul(y, le) | 0, o = o + Math.imul(y, ue) | 0;
        var xe = (u + (i = i + Math.imul(h, he) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, de) | 0) + Math.imul(d, he) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, de) | 0) + (n >>> 13) | 0) + (xe >>> 26) | 0, xe &= 67108863, i = Math.imul(N, F), n = (n = Math.imul(N, q)) + Math.imul(H, F) | 0, o = Math.imul(H, q), i = i + Math.imul(B, z) | 0, n = (n = n + Math.imul(B, K) | 0) + Math.imul(O, z) | 0, o = o + Math.imul(O, K) | 0, i = i + Math.imul(R, X) | 0, n = (n = n + Math.imul(R, G) | 0) + Math.imul(L, X) | 0, o = o + Math.imul(L, G) | 0, i = i + Math.imul(C, Q) | 0, n = (n = n + Math.imul(C, J) | 0) + Math.imul(A, Q) | 0, o = o + Math.imul(A, J) | 0, i = i + Math.imul(M, $) | 0, n = (n = n + Math.imul(M, ee) | 0) + Math.imul(k, $) | 0, o = o + Math.imul(k, ee) | 0, i = i + Math.imul(E, re) | 0, n = (n = n + Math.imul(E, ie) | 0) + Math.imul(x, re) | 0, o = o + Math.imul(x, ie) | 0, i = i + Math.imul(_, oe) | 0, n = (n = n + Math.imul(_, ae) | 0) + Math.imul(w, oe) | 0, o = o + Math.imul(w, ae) | 0, i = i + Math.imul(g, le) | 0, n = (n = n + Math.imul(g, ue) | 0) + Math.imul(b, le) | 0, o = o + Math.imul(b, ue) | 0, i = i + Math.imul(p, he) | 0, n = (n = n + Math.imul(p, de) | 0) + Math.imul(y, he) | 0, o = o + Math.imul(y, de) | 0;
        var Te = (u + (i = i + Math.imul(h, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(h, ye) | 0) + Math.imul(d, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(d, ye) | 0) + (n >>> 13) | 0) + (Te >>> 26) | 0, Te &= 67108863, i = Math.imul(N, z), n = (n = Math.imul(N, K)) + Math.imul(H, z) | 0, o = Math.imul(H, K), i = i + Math.imul(B, X) | 0, n = (n = n + Math.imul(B, G) | 0) + Math.imul(O, X) | 0, o = o + Math.imul(O, G) | 0, i = i + Math.imul(R, Q) | 0, n = (n = n + Math.imul(R, J) | 0) + Math.imul(L, Q) | 0, o = o + Math.imul(L, J) | 0, i = i + Math.imul(C, $) | 0, n = (n = n + Math.imul(C, ee) | 0) + Math.imul(A, $) | 0, o = o + Math.imul(A, ee) | 0, i = i + Math.imul(M, re) | 0, n = (n = n + Math.imul(M, ie) | 0) + Math.imul(k, re) | 0, o = o + Math.imul(k, ie) | 0, i = i + Math.imul(E, oe) | 0, n = (n = n + Math.imul(E, ae) | 0) + Math.imul(x, oe) | 0, o = o + Math.imul(x, ae) | 0, i = i + Math.imul(_, le) | 0, n = (n = n + Math.imul(_, ue) | 0) + Math.imul(w, le) | 0, o = o + Math.imul(w, ue) | 0, i = i + Math.imul(g, he) | 0, n = (n = n + Math.imul(g, de) | 0) + Math.imul(b, he) | 0, o = o + Math.imul(b, de) | 0;
        var Me = (u + (i = i + Math.imul(p, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(p, ye) | 0) + Math.imul(y, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(y, ye) | 0) + (n >>> 13) | 0) + (Me >>> 26) | 0, Me &= 67108863, i = Math.imul(N, X), n = (n = Math.imul(N, G)) + Math.imul(H, X) | 0, o = Math.imul(H, G), i = i + Math.imul(B, Q) | 0, n = (n = n + Math.imul(B, J) | 0) + Math.imul(O, Q) | 0, o = o + Math.imul(O, J) | 0, i = i + Math.imul(R, $) | 0, n = (n = n + Math.imul(R, ee) | 0) + Math.imul(L, $) | 0, o = o + Math.imul(L, ee) | 0, i = i + Math.imul(C, re) | 0, n = (n = n + Math.imul(C, ie) | 0) + Math.imul(A, re) | 0, o = o + Math.imul(A, ie) | 0, i = i + Math.imul(M, oe) | 0, n = (n = n + Math.imul(M, ae) | 0) + Math.imul(k, oe) | 0, o = o + Math.imul(k, ae) | 0, i = i + Math.imul(E, le) | 0, n = (n = n + Math.imul(E, ue) | 0) + Math.imul(x, le) | 0, o = o + Math.imul(x, ue) | 0, i = i + Math.imul(_, he) | 0, n = (n = n + Math.imul(_, de) | 0) + Math.imul(w, he) | 0, o = o + Math.imul(w, de) | 0;
        var ke = (u + (i = i + Math.imul(g, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(g, ye) | 0) + Math.imul(b, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(b, ye) | 0) + (n >>> 13) | 0) + (ke >>> 26) | 0, ke &= 67108863, i = Math.imul(N, Q), n = (n = Math.imul(N, J)) + Math.imul(H, Q) | 0, o = Math.imul(H, J), i = i + Math.imul(B, $) | 0, n = (n = n + Math.imul(B, ee) | 0) + Math.imul(O, $) | 0, o = o + Math.imul(O, ee) | 0, i = i + Math.imul(R, re) | 0, n = (n = n + Math.imul(R, ie) | 0) + Math.imul(L, re) | 0, o = o + Math.imul(L, ie) | 0, i = i + Math.imul(C, oe) | 0, n = (n = n + Math.imul(C, ae) | 0) + Math.imul(A, oe) | 0, o = o + Math.imul(A, ae) | 0, i = i + Math.imul(M, le) | 0, n = (n = n + Math.imul(M, ue) | 0) + Math.imul(k, le) | 0, o = o + Math.imul(k, ue) | 0, i = i + Math.imul(E, he) | 0, n = (n = n + Math.imul(E, de) | 0) + Math.imul(x, he) | 0, o = o + Math.imul(x, de) | 0;
        var Pe = (u + (i = i + Math.imul(_, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(_, ye) | 0) + Math.imul(w, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(w, ye) | 0) + (n >>> 13) | 0) + (Pe >>> 26) | 0, Pe &= 67108863, i = Math.imul(N, $), n = (n = Math.imul(N, ee)) + Math.imul(H, $) | 0, o = Math.imul(H, ee), i = i + Math.imul(B, re) | 0, n = (n = n + Math.imul(B, ie) | 0) + Math.imul(O, re) | 0, o = o + Math.imul(O, ie) | 0, i = i + Math.imul(R, oe) | 0, n = (n = n + Math.imul(R, ae) | 0) + Math.imul(L, oe) | 0, o = o + Math.imul(L, ae) | 0, i = i + Math.imul(C, le) | 0, n = (n = n + Math.imul(C, ue) | 0) + Math.imul(A, le) | 0, o = o + Math.imul(A, ue) | 0, i = i + Math.imul(M, he) | 0, n = (n = n + Math.imul(M, de) | 0) + Math.imul(k, he) | 0, o = o + Math.imul(k, de) | 0;
        var Ce = (u + (i = i + Math.imul(E, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(E, ye) | 0) + Math.imul(x, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(x, ye) | 0) + (n >>> 13) | 0) + (Ce >>> 26) | 0, Ce &= 67108863, i = Math.imul(N, re), n = (n = Math.imul(N, ie)) + Math.imul(H, re) | 0, o = Math.imul(H, ie), i = i + Math.imul(B, oe) | 0, n = (n = n + Math.imul(B, ae) | 0) + Math.imul(O, oe) | 0, o = o + Math.imul(O, ae) | 0, i = i + Math.imul(R, le) | 0, n = (n = n + Math.imul(R, ue) | 0) + Math.imul(L, le) | 0, o = o + Math.imul(L, ue) | 0, i = i + Math.imul(C, he) | 0, n = (n = n + Math.imul(C, de) | 0) + Math.imul(A, he) | 0, o = o + Math.imul(A, de) | 0;
        var Ae = (u + (i = i + Math.imul(M, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(M, ye) | 0) + Math.imul(k, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(k, ye) | 0) + (n >>> 13) | 0) + (Ae >>> 26) | 0, Ae &= 67108863, i = Math.imul(N, oe), n = (n = Math.imul(N, ae)) + Math.imul(H, oe) | 0, o = Math.imul(H, ae), i = i + Math.imul(B, le) | 0, n = (n = n + Math.imul(B, ue) | 0) + Math.imul(O, le) | 0, o = o + Math.imul(O, ue) | 0, i = i + Math.imul(R, he) | 0, n = (n = n + Math.imul(R, de) | 0) + Math.imul(L, he) | 0, o = o + Math.imul(L, de) | 0;
        var Ie = (u + (i = i + Math.imul(C, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(C, ye) | 0) + Math.imul(A, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(A, ye) | 0) + (n >>> 13) | 0) + (Ie >>> 26) | 0, Ie &= 67108863, i = Math.imul(N, le), n = (n = Math.imul(N, ue)) + Math.imul(H, le) | 0, o = Math.imul(H, ue), i = i + Math.imul(B, he) | 0, n = (n = n + Math.imul(B, de) | 0) + Math.imul(O, he) | 0, o = o + Math.imul(O, de) | 0;
        var Re = (u + (i = i + Math.imul(R, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(R, ye) | 0) + Math.imul(L, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(L, ye) | 0) + (n >>> 13) | 0) + (Re >>> 26) | 0, Re &= 67108863, i = Math.imul(N, he), n = (n = Math.imul(N, de)) + Math.imul(H, he) | 0, o = Math.imul(H, de);
        var Le = (u + (i = i + Math.imul(B, pe) | 0) | 0) + ((8191 & (n = (n = n + Math.imul(B, ye) | 0) + Math.imul(O, pe) | 0)) << 13) | 0;
        u = ((o = o + Math.imul(O, ye) | 0) + (n >>> 13) | 0) + (Le >>> 26) | 0, Le &= 67108863;
        var De = (u + (i = Math.imul(N, pe)) | 0) + ((8191 & (n = (n = Math.imul(N, ye)) + Math.imul(H, pe) | 0)) << 13) | 0;
        return u = ((o = Math.imul(H, ye)) + (n >>> 13) | 0) + (De >>> 26) | 0, De &= 67108863, l[0] = me, l[1] = ge, l[2] = be, l[3] = ve, l[4] = _e, l[5] = we, l[6] = Se, l[7] = Ee, l[8] = xe, l[9] = Te, l[10] = Me, l[11] = ke, l[12] = Pe, l[13] = Ce, l[14] = Ae, l[15] = Ie, l[16] = Re, l[17] = Le, l[18] = De, 0 !== u && (l[19] = u, r.length++), r
      };

      function u(e, t, r) {
        r.negative = t.negative ^ e.negative, r.length = e.length + t.length;
        for (var i = 0, n = 0, o = 0; o < r.length - 1; o++) {
          for (var a = n, n = 0, s = 67108863 & i, l = Math.min(o, t.length - 1), u = Math.max(0, o - e.length + 1); u <= l; u++) {
            var c = o - u, h = (0 | e.words[c]) * (0 | t.words[u]), d = 67108863 & h, s = 67108863 & (d = d + s | 0);
            n += (a = (a = a + (h / 67108864 | 0) | 0) + (d >>> 26) | 0) >>> 26, a &= 67108863
          }
          r.words[o] = s, i = a, a = n
        }
        return 0 !== i ? r.words[o] = i : r.length--, r._strip()
      }

      function c(e, t, r) {
        return u(e, t, r)
      }

      Math.imul || (l = s), g.prototype.mulTo = function (e, t) {
        var r = this.length + e.length,
            i = (10 === this.length && 10 === e.length ? l : r < 63 ? s : r < 1024 ? u : c)(this, e, t);
        return i
      }, g.prototype.mul = function (e) {
        var t = new g(null);
        return t.words = new Array(this.length + e.length), this.mulTo(e, t)
      }, g.prototype.mulf = function (e) {
        var t = new g(null);
        return t.words = new Array(this.length + e.length), c(this, e, t)
      }, g.prototype.imul = function (e) {
        return this.clone().mulTo(e, this)
      }, g.prototype.imuln = function (e) {
        var t = e < 0;
        t && (e = -e), m("number" == typeof e), m(e < 67108864);
        for (var r = 0, i = 0; i < this.length; i++) {
          var n = (0 | this.words[i]) * e, o = (67108863 & n) + (67108863 & r);
          r >>= 26, r += n / 67108864 | 0, r += o >>> 26, this.words[i] = 67108863 & o
        }
        return 0 !== r && (this.words[i] = r, this.length++), t ? this.ineg() : this
      }, g.prototype.muln = function (e) {
        return this.clone().imuln(e)
      }, g.prototype.sqr = function () {
        return this.mul(this)
      }, g.prototype.isqr = function () {
        return this.imul(this.clone())
      }, g.prototype.pow = function (e) {
        var t = function (e) {
          for (var t = new Array(e.bitLength()), r = 0; r < t.length; r++) {
            var i = r / 26 | 0, n = r % 26;
            t[r] = e.words[i] >>> n & 1
          }
          return t
        }(e);
        if (0 === t.length) return new g(1);
        for (var r = this, i = 0; i < t.length && 0 === t[i]; i++, r = r.sqr()) ;
        if (++i < t.length) for (var n = r.sqr(); i < t.length; i++, n = n.sqr()) 0 !== t[i] && (r = r.mul(n));
        return r
      }, g.prototype.iushln = function (e) {
        m("number" == typeof e && 0 <= e);
        var t = e % 26, r = (e - t) / 26, i = 67108863 >>> 26 - t << 26 - t;
        if (0 != t) {
          for (var n = 0, o = 0; o < this.length; o++) {
            var a = this.words[o] & i, s = (0 | this.words[o]) - a << t;
            this.words[o] = s | n, n = a >>> 26 - t
          }
          n && (this.words[o] = n, this.length++)
        }
        if (0 != r) {
          for (o = this.length - 1; 0 <= o; o--) this.words[o + r] = this.words[o];
          for (o = 0; o < r; o++) this.words[o] = 0;
          this.length += r
        }
        return this._strip()
      }, g.prototype.ishln = function (e) {
        return m(0 === this.negative), this.iushln(e)
      }, g.prototype.iushrn = function (e, t, r) {
        var i;
        m("number" == typeof e && 0 <= e), i = t ? (t - t % 26) / 26 : 0;
        var n = e % 26, o = Math.min((e - n) / 26, this.length), a = 67108863 ^ 67108863 >>> n << n, s = r;
        if (i -= o, i = Math.max(0, i), s) {
          for (var l = 0; l < o; l++) s.words[l] = this.words[l];
          s.length = o
        }
        if (0 !== o) if (this.length > o) for (this.length -= o, l = 0; l < this.length; l++) this.words[l] = this.words[l + o]; else this.words[0] = 0, this.length = 1;
        for (var u = 0, l = this.length - 1; 0 <= l && (0 !== u || i <= l); l--) {
          var c = 0 | this.words[l];
          this.words[l] = u << 26 - n | c >>> n, u = c & a
        }
        return s && 0 !== u && (s.words[s.length++] = u), 0 === this.length && (this.words[0] = 0, this.length = 1), this._strip()
      }, g.prototype.ishrn = function (e, t, r) {
        return m(0 === this.negative), this.iushrn(e, t, r)
      }, g.prototype.shln = function (e) {
        return this.clone().ishln(e)
      }, g.prototype.ushln = function (e) {
        return this.clone().iushln(e)
      }, g.prototype.shrn = function (e) {
        return this.clone().ishrn(e)
      }, g.prototype.ushrn = function (e) {
        return this.clone().iushrn(e)
      }, g.prototype.testn = function (e) {
        m("number" == typeof e && 0 <= e);
        var t = e % 26, r = (e - t) / 26, i = 1 << t;
        return !(this.length <= r) && !!(this.words[r] & i)
      }, g.prototype.imaskn = function (e) {
        m("number" == typeof e && 0 <= e);
        var t, r = e % 26, i = (e - r) / 26;
        return m(0 === this.negative, "imaskn works only with positive numbers"), this.length <= i ? this : (0 != r && i++, this.length = Math.min(i, this.length), 0 != r && (t = 67108863 ^ 67108863 >>> r << r, this.words[this.length - 1] &= t), this._strip())
      }, g.prototype.maskn = function (e) {
        return this.clone().imaskn(e)
      }, g.prototype.iaddn = function (e) {
        return m("number" == typeof e), m(e < 67108864), e < 0 ? this.isubn(-e) : 0 !== this.negative ? (1 === this.length && (0 | this.words[0]) <= e ? (this.words[0] = e - (0 | this.words[0]), this.negative = 0) : (this.negative = 0, this.isubn(e), this.negative = 1), this) : this._iaddn(e)
      }, g.prototype._iaddn = function (e) {
        this.words[0] += e;
        for (var t = 0; t < this.length && 67108864 <= this.words[t]; t++) this.words[t] -= 67108864, t === this.length - 1 ? this.words[t + 1] = 1 : this.words[t + 1]++;
        return this.length = Math.max(this.length, t + 1), this
      }, g.prototype.isubn = function (e) {
        if (m("number" == typeof e), m(e < 67108864), e < 0) return this.iaddn(-e);
        if (0 !== this.negative) return this.negative = 0, this.iaddn(e), this.negative = 1, this;
        if (this.words[0] -= e, 1 === this.length && this.words[0] < 0) this.words[0] = -this.words[0], this.negative = 1; else for (var t = 0; t < this.length && this.words[t] < 0; t++) this.words[t] += 67108864, --this.words[t + 1];
        return this._strip()
      }, g.prototype.addn = function (e) {
        return this.clone().iaddn(e)
      }, g.prototype.subn = function (e) {
        return this.clone().isubn(e)
      }, g.prototype.iabs = function () {
        return this.negative = 0, this
      }, g.prototype.abs = function () {
        return this.clone().iabs()
      }, g.prototype._ishlnsubmul = function (e, t, r) {
        var i, n = e.length + r;
        this._expand(n);
        for (var o = 0, a = 0; a < e.length; a++) {
          i = (0 | this.words[a + r]) + o;
          var s = (0 | e.words[a]) * t, o = ((i -= 67108863 & s) >> 26) - (s / 67108864 | 0);
          this.words[a + r] = 67108863 & i
        }
        for (; a < this.length - r; a++) o = (i = (0 | this.words[a + r]) + o) >> 26, this.words[a + r] = 67108863 & i;
        if (0 === o) return this._strip();
        for (m(-1 === o), a = o = 0; a < this.length; a++) o = (i = -(0 | this.words[a]) + o) >> 26, this.words[a] = 67108863 & i;
        return this.negative = 1, this._strip()
      }, g.prototype._wordDiv = function (e, t) {
        var r = (this.length, e.length), i = this.clone(), n = e, o = 0 | n.words[n.length - 1];
        0 != (r = 26 - this._countBits(o)) && (n = n.ushln(r), i.iushln(r), o = 0 | n.words[n.length - 1]);
        var a, s = i.length - n.length;
        if ("mod" !== t) {
          (a = new g(null)).length = 1 + s, a.words = new Array(a.length);
          for (var l = 0; l < a.length; l++) a.words[l] = 0
        }
        var u = i.clone()._ishlnsubmul(n, 1, s);
        0 === u.negative && (i = u, a && (a.words[s] = 1));
        for (var c = s - 1; 0 <= c; c--) {
          var h = 67108864 * (0 | i.words[n.length + c]) + (0 | i.words[n.length + c - 1]),
              h = Math.min(h / o | 0, 67108863);
          for (i._ishlnsubmul(n, h, c); 0 !== i.negative;) h--, i.negative = 0, i._ishlnsubmul(n, 1, c), i.isZero() || (i.negative ^= 1);
          a && (a.words[c] = h)
        }
        return a && a._strip(), i._strip(), "div" !== t && 0 != r && i.iushrn(r), {div: a || null, mod: i}
      }, g.prototype.divmod = function (e, t, r) {
        return m(!e.isZero()), this.isZero() ? {
          div: new g(0),
          mod: new g(0)
        } : 0 !== this.negative && 0 === e.negative ? (o = this.neg().divmod(e, t), "mod" !== t && (i = o.div.neg()), "div" !== t && (n = o.mod.neg(), r && 0 !== n.negative && n.iadd(e)), {
          div: i,
          mod: n
        }) : 0 === this.negative && 0 !== e.negative ? (o = this.divmod(e.neg(), t), "mod" !== t && (i = o.div.neg()), {
          div: i,
          mod: o.mod
        }) : 0 != (this.negative & e.negative) ? (o = this.neg().divmod(e.neg(), t), "div" !== t && (n = o.mod.neg(), r && 0 !== n.negative && n.isub(e)), {
          div: o.div,
          mod: n
        }) : e.length > this.length || this.cmp(e) < 0 ? {
          div: new g(0),
          mod: this
        } : 1 === e.length ? "div" === t ? {div: this.divn(e.words[0]), mod: null} : "mod" === t ? {
          div: null,
          mod: new g(this.modrn(e.words[0]))
        } : {div: this.divn(e.words[0]), mod: new g(this.modrn(e.words[0]))} : this._wordDiv(e, t);
        var i, n, o
      }, g.prototype.div = function (e) {
        return this.divmod(e, "div", !1).div
      }, g.prototype.mod = function (e) {
        return this.divmod(e, "mod", !1).mod
      }, g.prototype.umod = function (e) {
        return this.divmod(e, "mod", !0).mod
      }, g.prototype.divRound = function (e) {
        var t = this.divmod(e);
        if (t.mod.isZero()) return t.div;
        var r = 0 !== t.div.negative ? t.mod.isub(e) : t.mod, i = e.ushrn(1), n = e.andln(1), o = r.cmp(i);
        return o < 0 || 1 === n && 0 === o ? t.div : 0 !== t.div.negative ? t.div.isubn(1) : t.div.iaddn(1)
      }, g.prototype.modrn = function (e) {
        var t = e < 0;
        t && (e = -e), m(e <= 67108863);
        for (var r = (1 << 26) % e, i = 0, n = this.length - 1; 0 <= n; n--) i = (r * i + (0 | this.words[n])) % e;
        return t ? -i : i
      }, g.prototype.modn = function (e) {
        return this.modrn(e)
      }, g.prototype.idivn = function (e) {
        var t = e < 0;
        t && (e = -e), m(e <= 67108863);
        for (var r = 0, i = this.length - 1; 0 <= i; i--) {
          var n = (0 | this.words[i]) + 67108864 * r;
          this.words[i] = n / e | 0, r = n % e
        }
        return this._strip(), t ? this.ineg() : this
      }, g.prototype.divn = function (e) {
        return this.clone().idivn(e)
      }, g.prototype.egcd = function (e) {
        m(0 === e.negative), m(!e.isZero());
        for (var t = this, r = e.clone(), t = 0 !== t.negative ? t.umod(e) : t.clone(), i = new g(1), n = new g(0), o = new g(0), a = new g(1), s = 0; t.isEven() && r.isEven();) t.iushrn(1), r.iushrn(1), ++s;
        for (var l = r.clone(), u = t.clone(); !t.isZero();) {
          for (var c = 0, h = 1; 0 == (t.words[0] & h) && c < 26; ++c, h <<= 1) ;
          if (0 < c) for (t.iushrn(c); 0 < c--;) (i.isOdd() || n.isOdd()) && (i.iadd(l), n.isub(u)), i.iushrn(1), n.iushrn(1);
          for (var d = 0, f = 1; 0 == (r.words[0] & f) && d < 26; ++d, f <<= 1) ;
          if (0 < d) for (r.iushrn(d); 0 < d--;) (o.isOdd() || a.isOdd()) && (o.iadd(l), a.isub(u)), o.iushrn(1), a.iushrn(1);
          0 <= t.cmp(r) ? (t.isub(r), i.isub(o), n.isub(a)) : (r.isub(t), o.isub(i), a.isub(n))
        }
        return {a: o, b: a, gcd: r.iushln(s)}
      }, g.prototype._invmp = function (e) {
        m(0 === e.negative), m(!e.isZero());
        for (var t, r = this, i = e.clone(), r = 0 !== r.negative ? r.umod(e) : r.clone(), n = new g(1), o = new g(0), a = i.clone(); 0 < r.cmpn(1) && 0 < i.cmpn(1);) {
          for (var s = 0, l = 1; 0 == (r.words[0] & l) && s < 26; ++s, l <<= 1) ;
          if (0 < s) for (r.iushrn(s); 0 < s--;) n.isOdd() && n.iadd(a), n.iushrn(1);
          for (var u = 0, c = 1; 0 == (i.words[0] & c) && u < 26; ++u, c <<= 1) ;
          if (0 < u) for (i.iushrn(u); 0 < u--;) o.isOdd() && o.iadd(a), o.iushrn(1);
          0 <= r.cmp(i) ? (r.isub(i), n.isub(o)) : (i.isub(r), o.isub(n))
        }
        return (t = 0 === r.cmpn(1) ? n : o).cmpn(0) < 0 && t.iadd(e), t
      }, g.prototype.gcd = function (e) {
        if (this.isZero()) return e.abs();
        if (e.isZero()) return this.abs();
        var t = this.clone(), r = e.clone();
        t.negative = 0;
        for (var i = r.negative = 0; t.isEven() && r.isEven(); i++) t.iushrn(1), r.iushrn(1);
        for (; ;) {
          for (; t.isEven();) t.iushrn(1);
          for (; r.isEven();) r.iushrn(1);
          var n = t.cmp(r);
          if (n < 0) var o = t, t = r, r = o; else if (0 === n || 0 === r.cmpn(1)) break;
          t.isub(r)
        }
        return r.iushln(i)
      }, g.prototype.invm = function (e) {
        return this.egcd(e).a.umod(e)
      }, g.prototype.isEven = function () {
        return 0 == (1 & this.words[0])
      }, g.prototype.isOdd = function () {
        return 1 == (1 & this.words[0])
      }, g.prototype.andln = function (e) {
        return this.words[0] & e
      }, g.prototype.bincn = function (e) {
        m("number" == typeof e);
        var t = e % 26, r = (e - t) / 26, i = 1 << t;
        if (this.length <= r) return this._expand(1 + r), this.words[r] |= i, this;
        for (var n = i, o = r; 0 !== n && o < this.length; o++) {
          var a = 0 | this.words[o], n = (a += n) >>> 26;
          a &= 67108863, this.words[o] = a
        }
        return 0 !== n && (this.words[o] = n, this.length++), this
      }, g.prototype.isZero = function () {
        return 1 === this.length && 0 === this.words[0]
      }, g.prototype.cmpn = function (e) {
        var t, r, i = e < 0;
        return 0 === this.negative || i ? 0 === this.negative && i ? 1 : (this._strip(), r = 1 < this.length ? 1 : (i && (e = -e), m(e <= 67108863, "Number is too big"), (t = 0 | this.words[0]) === e ? 0 : t < e ? -1 : 1), 0 !== this.negative ? 0 | -r : r) : -1
      }, g.prototype.cmp = function (e) {
        if (0 !== this.negative && 0 === e.negative) return -1;
        if (0 === this.negative && 0 !== e.negative) return 1;
        var t = this.ucmp(e);
        return 0 !== this.negative ? 0 | -t : t
      }, g.prototype.ucmp = function (e) {
        if (this.length > e.length) return 1;
        if (this.length < e.length) return -1;
        for (var t = 0, r = this.length - 1; 0 <= r; r--) {
          var i = 0 | this.words[r], n = 0 | e.words[r];
          if (i != n) {
            i < n ? t = -1 : n < i && (t = 1);
            break
          }
        }
        return t
      }, g.prototype.gtn = function (e) {
        return 1 === this.cmpn(e)
      }, g.prototype.gt = function (e) {
        return 1 === this.cmp(e)
      }, g.prototype.gten = function (e) {
        return 0 <= this.cmpn(e)
      }, g.prototype.gte = function (e) {
        return 0 <= this.cmp(e)
      }, g.prototype.ltn = function (e) {
        return -1 === this.cmpn(e)
      }, g.prototype.lt = function (e) {
        return -1 === this.cmp(e)
      }, g.prototype.lten = function (e) {
        return this.cmpn(e) <= 0
      }, g.prototype.lte = function (e) {
        return this.cmp(e) <= 0
      }, g.prototype.eqn = function (e) {
        return 0 === this.cmpn(e)
      }, g.prototype.eq = function (e) {
        return 0 === this.cmp(e)
      }, g.red = function (e) {
        return new E(e)
      }, g.prototype.toRed = function (e) {
        return m(!this.red, "Already a number in reduction context"), m(0 === this.negative, "red works only with positives"), e.convertTo(this)._forceRed(e)
      }, g.prototype.fromRed = function () {
        return m(this.red, "fromRed works only with numbers in reduction context"), this.red.convertFrom(this)
      }, g.prototype._forceRed = function (e) {
        return this.red = e, this
      }, g.prototype.forceRed = function (e) {
        return m(!this.red, "Already a number in reduction context"), this._forceRed(e)
      }, g.prototype.redAdd = function (e) {
        return m(this.red, "redAdd works only with red numbers"), this.red.add(this, e)
      }, g.prototype.redIAdd = function (e) {
        return m(this.red, "redIAdd works only with red numbers"), this.red.iadd(this, e)
      }, g.prototype.redSub = function (e) {
        return m(this.red, "redSub works only with red numbers"), this.red.sub(this, e)
      }, g.prototype.redISub = function (e) {
        return m(this.red, "redISub works only with red numbers"), this.red.isub(this, e)
      }, g.prototype.redShl = function (e) {
        return m(this.red, "redShl works only with red numbers"), this.red.shl(this, e)
      }, g.prototype.redMul = function (e) {
        return m(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.mul(this, e)
      }, g.prototype.redIMul = function (e) {
        return m(this.red, "redMul works only with red numbers"), this.red._verify2(this, e), this.red.imul(this, e)
      }, g.prototype.redSqr = function () {
        return m(this.red, "redSqr works only with red numbers"), this.red._verify1(this), this.red.sqr(this)
      }, g.prototype.redISqr = function () {
        return m(this.red, "redISqr works only with red numbers"), this.red._verify1(this), this.red.isqr(this)
      }, g.prototype.redSqrt = function () {
        return m(this.red, "redSqrt works only with red numbers"), this.red._verify1(this), this.red.sqrt(this)
      }, g.prototype.redInvm = function () {
        return m(this.red, "redInvm works only with red numbers"), this.red._verify1(this), this.red.invm(this)
      }, g.prototype.redNeg = function () {
        return m(this.red, "redNeg works only with red numbers"), this.red._verify1(this), this.red.neg(this)
      }, g.prototype.redPow = function (e) {
        return m(this.red && !e.red, "redPow(normalNum)"), this.red._verify1(this), this.red.pow(this, e)
      };
      var y = {k256: null, p224: null, p192: null, p25519: null};

      function b(e, t) {
        this.name = e, this.p = new g(t, 16), this.n = this.p.bitLength(), this.k = new g(1).iushln(this.n).isub(this.p), this.tmp = this._tmp()
      }

      function v() {
        b.call(this, "k256", "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f")
      }

      function _() {
        b.call(this, "p224", "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001")
      }

      function w() {
        b.call(this, "p192", "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff")
      }

      function S() {
        b.call(this, "25519", "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed")
      }

      function E(e) {
        var t;
        "string" == typeof e ? (t = g._prime(e), this.m = t.p, this.prime = t) : (m(e.gtn(1), "modulus must be greater than 1"), this.m = e, this.prime = null)
      }

      function x(e) {
        E.call(this, e), this.shift = this.m.bitLength(), this.shift % 26 != 0 && (this.shift += 26 - this.shift % 26), this.r = new g(1).iushln(this.shift), this.r2 = this.imod(this.r.sqr()), this.rinv = this.r._invmp(this.m), this.minv = this.rinv.mul(this.r).isubn(1).div(this.m), this.minv = this.minv.umod(this.r), this.minv = this.r.sub(this.minv)
      }

      b.prototype._tmp = function () {
        var e = new g(null);
        return e.words = new Array(Math.ceil(this.n / 13)), e
      }, b.prototype.ireduce = function (e) {
        for (var t, r = e; this.split(r, this.tmp), (t = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength()) > this.n;) ;
        var i = t < this.n ? -1 : r.ucmp(this.p);
        return 0 === i ? (r.words[0] = 0, r.length = 1) : 0 < i ? r.isub(this.p) : r._strip(), r
      }, b.prototype.split = function (e, t) {
        e.iushrn(this.n, 0, t)
      }, b.prototype.imulK = function (e) {
        return e.imul(this.k)
      }, r(v, b), v.prototype.split = function (e, t) {
        for (var r = Math.min(e.length, 9), i = 0; i < r; i++) t.words[i] = e.words[i];
        if (t.length = r, e.length <= 9) return e.words[0] = 0, void (e.length = 1);
        var n = e.words[9];
        for (t.words[t.length++] = 4194303 & n, i = 10; i < e.length; i++) {
          var o = 0 | e.words[i];
          e.words[i - 10] = (4194303 & o) << 4 | n >>> 22, n = o
        }
        n >>>= 22, 0 === (e.words[i - 10] = n) && 10 < e.length ? e.length -= 10 : e.length -= 9
      }, v.prototype.imulK = function (e) {
        e.words[e.length] = 0, e.words[e.length + 1] = 0, e.length += 2;
        for (var t = 0, r = 0; r < e.length; r++) {
          var i = 0 | e.words[r];
          t += 977 * i, e.words[r] = 67108863 & t, t = 64 * i + (t / 67108864 | 0)
        }
        return 0 === e.words[e.length - 1] && (e.length--, 0 === e.words[e.length - 1] && e.length--), e
      }, r(_, b), r(w, b), r(S, b), S.prototype.imulK = function (e) {
        for (var t = 0, r = 0; r < e.length; r++) {
          var i = 19 * (0 | e.words[r]) + t, n = 67108863 & i;
          i >>>= 26, e.words[r] = n, t = i
        }
        return 0 !== t && (e.words[e.length++] = t), e
      }, g._prime = function (e) {
        if (y[e]) return y[e];
        var t;
        if ("k256" === e) t = new v; else if ("p224" === e) t = new _; else if ("p192" === e) t = new w; else {
          if ("p25519" !== e) throw new Error("Unknown prime " + e);
          t = new S
        }
        return y[e] = t
      }, E.prototype._verify1 = function (e) {
        m(0 === e.negative, "red works only with positives"), m(e.red, "red works only with red numbers")
      }, E.prototype._verify2 = function (e, t) {
        m(0 == (e.negative | t.negative), "red works only with positives"), m(e.red && e.red === t.red, "red works only with red numbers")
      }, E.prototype.imod = function (e) {
        return this.prime ? this.prime.ireduce(e)._forceRed(this) : (n(e, e.umod(this.m)._forceRed(this)), e)
      }, E.prototype.neg = function (e) {
        return e.isZero() ? e.clone() : this.m.sub(e)._forceRed(this)
      }, E.prototype.add = function (e, t) {
        this._verify2(e, t);
        var r = e.add(t);
        return 0 <= r.cmp(this.m) && r.isub(this.m), r._forceRed(this)
      }, E.prototype.iadd = function (e, t) {
        this._verify2(e, t);
        var r = e.iadd(t);
        return 0 <= r.cmp(this.m) && r.isub(this.m), r
      }, E.prototype.sub = function (e, t) {
        this._verify2(e, t);
        var r = e.sub(t);
        return r.cmpn(0) < 0 && r.iadd(this.m), r._forceRed(this)
      }, E.prototype.isub = function (e, t) {
        this._verify2(e, t);
        var r = e.isub(t);
        return r.cmpn(0) < 0 && r.iadd(this.m), r
      }, E.prototype.shl = function (e, t) {
        return this._verify1(e), this.imod(e.ushln(t))
      }, E.prototype.imul = function (e, t) {
        return this._verify2(e, t), this.imod(e.imul(t))
      }, E.prototype.mul = function (e, t) {
        return this._verify2(e, t), this.imod(e.mul(t))
      }, E.prototype.isqr = function (e) {
        return this.imul(e, e.clone())
      }, E.prototype.sqr = function (e) {
        return this.mul(e, e)
      }, E.prototype.sqrt = function (e) {
        if (e.isZero()) return e.clone();
        var t = this.m.andln(3);
        if (m(t % 2 == 1), 3 === t) {
          var r = this.m.add(new g(1)).iushrn(2);
          return this.pow(e, r)
        }
        for (var i = this.m.subn(1), n = 0; !i.isZero() && 0 === i.andln(1);) n++, i.iushrn(1);
        m(!i.isZero());
        for (var o = new g(1).toRed(this), a = o.redNeg(), s = this.m.subn(1).iushrn(1), l = new g(2 * (l = this.m.bitLength()) * l).toRed(this); 0 !== this.pow(l, s).cmp(a);) l.redIAdd(a);
        for (var u = this.pow(l, i), c = this.pow(e, i.addn(1).iushrn(1)), h = this.pow(e, i), d = n; 0 !== h.cmp(o);) {
          for (var f = h, p = 0; 0 !== f.cmp(o); p++) f = f.redSqr();
          m(p < d);
          var y = this.pow(u, new g(1).iushln(d - p - 1)), c = c.redMul(y), u = y.redSqr(), h = h.redMul(u), d = p
        }
        return c
      }, E.prototype.invm = function (e) {
        var t = e._invmp(this.m);
        return 0 !== t.negative ? (t.negative = 0, this.imod(t).redNeg()) : this.imod(t)
      }, E.prototype.pow = function (e, t) {
        if (t.isZero()) return new g(1).toRed(this);
        if (0 === t.cmpn(1)) return e.clone();
        var r = new Array(16);
        r[0] = new g(1).toRed(this), r[1] = e;
        for (var i = 2; i < r.length; i++) r[i] = this.mul(r[i - 1], e);
        var n = r[0], o = 0, a = 0, s = t.bitLength() % 26;
        for (0 === s && (s = 26), i = t.length - 1; 0 <= i; i--) {
          for (var l = t.words[i], u = s - 1; 0 <= u; u--) {
            var c = l >> u & 1;
            n !== r[0] && (n = this.sqr(n)), 0 != c || 0 !== o ? (o <<= 1, o |= c, (4 === ++a || 0 === i && 0 === u) && (n = this.mul(n, r[o]), o = a = 0)) : a = 0
          }
          s = 26
        }
        return n
      }, E.prototype.convertTo = function (e) {
        var t = e.umod(this.m);
        return t === e ? t.clone() : t
      }, E.prototype.convertFrom = function (e) {
        var t = e.clone();
        return t.red = null, t
      }, g.mont = function (e) {
        return new x(e)
      }, r(x, E), x.prototype.convertTo = function (e) {
        return this.imod(e.ushln(this.shift))
      }, x.prototype.convertFrom = function (e) {
        var t = this.imod(e.mul(this.rinv));
        return t.red = null, t
      }, x.prototype.imul = function (e, t) {
        if (e.isZero() || t.isZero()) return e.words[0] = 0, e.length = 1, e;
        var r = e.imul(t), i = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
            n = r.isub(i).iushrn(this.shift), o = n;
        return 0 <= n.cmp(this.m) ? o = n.isub(this.m) : n.cmpn(0) < 0 && (o = n.iadd(this.m)), o._forceRed(this)
      }, x.prototype.mul = function (e, t) {
        if (e.isZero() || t.isZero()) return new g(0)._forceRed(this);
        var r = e.mul(t), i = r.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),
            n = r.isub(i).iushrn(this.shift), o = n;
        return 0 <= n.cmp(this.m) ? o = n.isub(this.m) : n.cmpn(0) < 0 && (o = n.iadd(this.m)), o._forceRed(this)
      }, x.prototype.invm = function (e) {
        return this.imod(e._invmp(this.m).mul(this.r2))._forceRed(this)
      }
    }(void 0 === e || e, this)
  }, {buffer: 19}],
  18: [function (e, t, r) {
    var i;

    function n(e) {
      this.rand = e
    }

    if (t.exports = function (e) {
      return (i = i || new n(null)).generate(e)
    }, (t.exports.Rand = n).prototype.generate = function (e) {
      return this._rand(e)
    }, n.prototype._rand = function (e) {
      if (this.rand.getBytes) return this.rand.getBytes(e);
      for (var t = new Uint8Array(e), r = 0; r < t.length; r++) t[r] = this.rand.getByte();
      return t
    }, "object" == typeof self) self.crypto && self.crypto.getRandomValues ? n.prototype._rand = function (e) {
      var t = new Uint8Array(e);
      return self.crypto.getRandomValues(t), t
    } : self.msCrypto && self.msCrypto.getRandomValues ? n.prototype._rand = function (e) {
      var t = new Uint8Array(e);
      return self.msCrypto.getRandomValues(t), t
    } : "object" == typeof window && (n.prototype._rand = function () {
      throw new Error("Not implemented yet")
    }); else try {
      var o = e("crypto");
      if ("function" != typeof o.randomBytes) throw new Error("Not supported");
      n.prototype._rand = function (e) {
        return o.randomBytes(e)
      }
    } catch (e) {
    }
  }, {crypto: 19}],
  19: [function (e, t, r) {
  }, {}],
  20: [function (e, t, r) {
    var n = e("safe-buffer").Buffer;

    function o(e) {
      n.isBuffer(e) || (e = n.from(e));
      for (var t = e.length / 4 | 0, r = new Array(t), i = 0; i < t; i++) r[i] = e.readUInt32BE(4 * i);
      return r
    }

    function i(e) {
      for (; 0 < e.length; e++) e[0] = 0
    }

    function a(e, t, r, i, n) {
      for (var o, a, s, l, u = r[0], c = r[1], h = r[2], d = r[3], f = e[0] ^ t[0], p = e[1] ^ t[1], y = e[2] ^ t[2], m = e[3] ^ t[3], g = 4, b = 1; b < n; b++) o = u[f >>> 24] ^ c[p >>> 16 & 255] ^ h[y >>> 8 & 255] ^ d[255 & m] ^ t[g++], a = u[p >>> 24] ^ c[y >>> 16 & 255] ^ h[m >>> 8 & 255] ^ d[255 & f] ^ t[g++], s = u[y >>> 24] ^ c[m >>> 16 & 255] ^ h[f >>> 8 & 255] ^ d[255 & p] ^ t[g++], l = u[m >>> 24] ^ c[f >>> 16 & 255] ^ h[p >>> 8 & 255] ^ d[255 & y] ^ t[g++], f = o, p = a, y = s, m = l;
      return o = (i[f >>> 24] << 24 | i[p >>> 16 & 255] << 16 | i[y >>> 8 & 255] << 8 | i[255 & m]) ^ t[g++], a = (i[p >>> 24] << 24 | i[y >>> 16 & 255] << 16 | i[m >>> 8 & 255] << 8 | i[255 & f]) ^ t[g++], s = (i[y >>> 24] << 24 | i[m >>> 16 & 255] << 16 | i[f >>> 8 & 255] << 8 | i[255 & p]) ^ t[g++], l = (i[m >>> 24] << 24 | i[f >>> 16 & 255] << 16 | i[p >>> 8 & 255] << 8 | i[255 & y]) ^ t[g++], [o >>>= 0, a >>>= 0, s >>>= 0, l >>>= 0]
    }

    var h = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54], d = function () {
      for (var e = new Array(256), t = 0; t < 256; t++) e[t] = t < 128 ? t << 1 : t << 1 ^ 283;
      for (var r = [], i = [], n = [[], [], [], []], o = [[], [], [], []], a = 0, s = 0, l = 0; l < 256; ++l) {
        var u = (u = s ^ s << 1 ^ s << 2 ^ s << 3 ^ s << 4) >>> 8 ^ 255 & u ^ 99, c = e[i[r[a] = u] = a], h = e[c],
            d = e[h], f = 257 * e[u] ^ 16843008 * u;
        n[0][a] = f << 24 | f >>> 8, n[1][a] = f << 16 | f >>> 16, n[2][a] = f << 8 | f >>> 24, n[3][a] = f, f = 16843009 * d ^ 65537 * h ^ 257 * c ^ 16843008 * a, o[0][u] = f << 24 | f >>> 8, o[1][u] = f << 16 | f >>> 16, o[2][u] = f << 8 | f >>> 24, o[3][u] = f, 0 === a ? a = s = 1 : (a = c ^ e[e[e[d ^ c]]], s ^= e[e[s]])
      }
      return {SBOX: r, INV_SBOX: i, SUB_MIX: n, INV_SUB_MIX: o}
    }();

    function s(e) {
      this._key = o(e), this._reset()
    }

    s.blockSize = 16, s.keySize = 32, s.prototype.blockSize = s.blockSize, s.prototype.keySize = s.keySize, s.prototype._reset = function () {
      for (var e = this._key, t = e.length, r = t + 6, i = 4 * (r + 1), n = [], o = 0; o < t; o++) n[o] = e[o];
      for (o = t; o < i; o++) {
        var a = n[o - 1];
        o % t == 0 ? (a = a << 8 | a >>> 24, a = d.SBOX[a >>> 24] << 24 | d.SBOX[a >>> 16 & 255] << 16 | d.SBOX[a >>> 8 & 255] << 8 | d.SBOX[255 & a], a ^= h[o / t | 0] << 24) : 6 < t && o % t == 4 && (a = d.SBOX[a >>> 24] << 24 | d.SBOX[a >>> 16 & 255] << 16 | d.SBOX[a >>> 8 & 255] << 8 | d.SBOX[255 & a]), n[o] = n[o - t] ^ a
      }
      for (var s = [], l = 0; l < i; l++) {
        var u = i - l, c = n[u - (l % 4 ? 0 : 4)];
        s[l] = l < 4 || u <= 4 ? c : d.INV_SUB_MIX[0][d.SBOX[c >>> 24]] ^ d.INV_SUB_MIX[1][d.SBOX[c >>> 16 & 255]] ^ d.INV_SUB_MIX[2][d.SBOX[c >>> 8 & 255]] ^ d.INV_SUB_MIX[3][d.SBOX[255 & c]]
      }
      this._nRounds = r, this._keySchedule = n, this._invKeySchedule = s
    }, s.prototype.encryptBlockRaw = function (e) {
      return a(e = o(e), this._keySchedule, d.SUB_MIX, d.SBOX, this._nRounds)
    }, s.prototype.encryptBlock = function (e) {
      var t = this.encryptBlockRaw(e), r = n.allocUnsafe(16);
      return r.writeUInt32BE(t[0], 0), r.writeUInt32BE(t[1], 4), r.writeUInt32BE(t[2], 8), r.writeUInt32BE(t[3], 12), r
    }, s.prototype.decryptBlock = function (e) {
      var t = (e = o(e))[1];
      e[1] = e[3], e[3] = t;
      var r = a(e, this._invKeySchedule, d.INV_SUB_MIX, d.INV_SBOX, this._nRounds), i = n.allocUnsafe(16);
      return i.writeUInt32BE(r[0], 0), i.writeUInt32BE(r[3], 4), i.writeUInt32BE(r[2], 8), i.writeUInt32BE(r[1], 12), i
    }, s.prototype.scrub = function () {
      i(this._keySchedule), i(this._invKeySchedule), i(this._key)
    }, t.exports.AES = s
  }, {"safe-buffer": 186}],
  21: [function (e, t, r) {
    var a = e("./aes"), u = e("safe-buffer").Buffer, s = e("cipher-base"), i = e("inherits"), c = e("./ghash"),
        n = e("buffer-xor"), h = e("./incr32");

    function o(e, t, r, i) {
      s.call(this);
      var n = u.alloc(4, 0);
      this._cipher = new a.AES(t);
      var o = this._cipher.encryptBlock(n);
      this._ghash = new c(o), r = function (e, t, r) {
        if (12 === t.length) return e._finID = u.concat([t, u.from([0, 0, 0, 1])]), u.concat([t, u.from([0, 0, 0, 2])]);
        var i = new c(r), n = t.length, o = n % 16;
        i.update(t), o && (o = 16 - o, i.update(u.alloc(o, 0))), i.update(u.alloc(8, 0));
        var a = 8 * n, s = u.alloc(8);
        s.writeUIntBE(a, 0, 8), i.update(s), e._finID = i.state;
        var l = u.from(e._finID);
        return h(l), l
      }(this, r, o), this._prev = u.from(r), this._cache = u.allocUnsafe(0), this._secCache = u.allocUnsafe(0), this._decrypt = i, this._alen = 0, this._len = 0, this._mode = e, this._authTag = null, this._called = !1
    }

    i(o, s), o.prototype._update = function (e) {
      var t;
      this._called || !this._alen || (t = 16 - this._alen % 16) < 16 && (t = u.alloc(t, 0), this._ghash.update(t)), this._called = !0;
      var r = this._mode.encrypt(this, e);
      return this._decrypt ? this._ghash.update(e) : this._ghash.update(r), this._len += e.length, r
    }, o.prototype._final = function () {
      if (this._decrypt && !this._authTag) throw new Error("Unsupported state or unable to authenticate data");
      var e = n(this._ghash["final"](8 * this._alen, 8 * this._len), this._cipher.encryptBlock(this._finID));
      if (this._decrypt && function (e, t) {
        var r = 0;
        e.length !== t.length && r++;
        for (var i = Math.min(e.length, t.length), n = 0; n < i; ++n) r += e[n] ^ t[n];
        return r
      }(e, this._authTag)) throw new Error("Unsupported state or unable to authenticate data");
      this._authTag = e, this._cipher.scrub()
    }, o.prototype.getAuthTag = function () {
      if (this._decrypt || !u.isBuffer(this._authTag)) throw new Error("Attempting to get auth tag in unsupported state");
      return this._authTag
    }, o.prototype.setAuthTag = function (e) {
      if (!this._decrypt) throw new Error("Attempting to set auth tag in unsupported state");
      this._authTag = e
    }, o.prototype.setAAD = function (e) {
      if (this._called) throw new Error("Attempting to set AAD in unsupported state");
      this._ghash.update(e), this._alen += e.length
    }, t.exports = o
  }, {
    "./aes": 20,
    "./ghash": 25,
    "./incr32": 26,
    "buffer-xor": 63,
    "cipher-base": 65,
    inherits: 142,
    "safe-buffer": 186
  }],
  22: [function (e, t, r) {
    var i = e("./encrypter"), n = e("./decrypter"), o = e("./modes/list.json");
    r.createCipher = r.Cipher = i.createCipher, r.createCipheriv = r.Cipheriv = i.createCipheriv, r.createDecipher = r.Decipher = n.createDecipher, r.createDecipheriv = r.Decipheriv = n.createDecipheriv, r.listCiphers = r.getCiphers = function () {
      return Object.keys(o)
    }
  }, {"./decrypter": 23, "./encrypter": 24, "./modes/list.json": 34}],
  23: [function (e, t, r) {
    var n = e("./authCipher"), o = e("safe-buffer").Buffer, a = e("./modes"), s = e("./streamCipher"),
        i = e("cipher-base"), l = e("./aes"), u = e("evp_bytestokey");

    function c(e, t, r) {
      i.call(this), this._cache = new h, this._last = void 0, this._cipher = new l.AES(t), this._prev = o.from(r), this._mode = e, this._autopadding = !0
    }

    function h() {
      this.cache = o.allocUnsafe(0)
    }

    function d(e, t, r) {
      var i = a[e.toLowerCase()];
      if (!i) throw new TypeError("invalid suite type");
      if ("string" == typeof r && (r = o.from(r)), "GCM" !== i.mode && r.length !== i.iv) throw new TypeError("invalid iv length " + r.length);
      if ("string" == typeof t && (t = o.from(t)), t.length !== i.key / 8) throw new TypeError("invalid key length " + t.length);
      return "stream" === i.type ? new s(i.module, t, r, !0) : "auth" === i.type ? new n(i.module, t, r, !0) : new c(i.module, t, r)
    }

    e("inherits")(c, i), c.prototype._update = function (e) {
      var t, r;
      this._cache.add(e);
      for (var i = []; t = this._cache.get(this._autopadding);) r = this._mode.decrypt(this, t), i.push(r);
      return o.concat(i)
    }, c.prototype._final = function () {
      var e = this._cache.flush();
      if (this._autopadding) return function (e) {
        var t = e[15];
        if (t < 1 || 16 < t) throw new Error("unable to decrypt data");
        var r = -1;
        for (; ++r < t;) if (e[r + (16 - t)] !== t) throw new Error("unable to decrypt data");
        if (16 === t) return;
        return e.slice(0, 16 - t)
      }(this._mode.decrypt(this, e));
      if (e) throw new Error("data not multiple of block length")
    }, c.prototype.setAutoPadding = function (e) {
      return this._autopadding = !!e, this
    }, h.prototype.add = function (e) {
      this.cache = o.concat([this.cache, e])
    }, h.prototype.get = function (e) {
      var t;
      if (e) {
        if (16 < this.cache.length) return t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), t
      } else if (16 <= this.cache.length) return t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), t;
      return null
    }, h.prototype.flush = function () {
      if (this.cache.length) return this.cache
    }, r.createDecipher = function (e, t) {
      var r = a[e.toLowerCase()];
      if (!r) throw new TypeError("invalid suite type");
      var i = u(t, !1, r.key, r.iv);
      return d(e, i.key, i.iv)
    }, r.createDecipheriv = d
  }, {
    "./aes": 20,
    "./authCipher": 21,
    "./modes": 33,
    "./streamCipher": 36,
    "cipher-base": 65,
    evp_bytestokey: 109,
    inherits: 142,
    "safe-buffer": 186
  }],
  24: [function (e, t, r) {
    var n = e("./modes"), o = e("./authCipher"), a = e("safe-buffer").Buffer, s = e("./streamCipher"),
        i = e("cipher-base"), l = e("./aes"), u = e("evp_bytestokey");

    function c(e, t, r) {
      i.call(this), this._cache = new d, this._cipher = new l.AES(t), this._prev = a.from(r), this._mode = e, this._autopadding = !0
    }

    e("inherits")(c, i), c.prototype._update = function (e) {
      var t, r;
      this._cache.add(e);
      for (var i = []; t = this._cache.get();) r = this._mode.encrypt(this, t), i.push(r);
      return a.concat(i)
    };
    var h = a.alloc(16, 16);

    function d() {
      this.cache = a.allocUnsafe(0)
    }

    function f(e, t, r) {
      var i = n[e.toLowerCase()];
      if (!i) throw new TypeError("invalid suite type");
      if ("string" == typeof t && (t = a.from(t)), t.length !== i.key / 8) throw new TypeError("invalid key length " + t.length);
      if ("string" == typeof r && (r = a.from(r)), "GCM" !== i.mode && r.length !== i.iv) throw new TypeError("invalid iv length " + r.length);
      return new ("stream" === i.type ? s : "auth" === i.type ? o : c)(i.module, t, r)
    }

    c.prototype._final = function () {
      var e = this._cache.flush();
      if (this._autopadding) return e = this._mode.encrypt(this, e), this._cipher.scrub(), e;
      if (!e.equals(h)) throw this._cipher.scrub(), new Error("data not multiple of block length")
    }, c.prototype.setAutoPadding = function (e) {
      return this._autopadding = !!e, this
    }, d.prototype.add = function (e) {
      this.cache = a.concat([this.cache, e])
    }, d.prototype.get = function () {
      if (15 < this.cache.length) {
        var e = this.cache.slice(0, 16);
        return this.cache = this.cache.slice(16), e
      }
      return null
    }, d.prototype.flush = function () {
      for (var e = 16 - this.cache.length, t = a.allocUnsafe(e), r = -1; ++r < e;) t.writeUInt8(e, r);
      return a.concat([this.cache, t])
    }, r.createCipheriv = f, r.createCipher = function (e, t) {
      var r = n[e.toLowerCase()];
      if (!r) throw new TypeError("invalid suite type");
      var i = u(t, !1, r.key, r.iv);
      return f(e, i.key, i.iv)
    }
  }, {
    "./aes": 20,
    "./authCipher": 21,
    "./modes": 33,
    "./streamCipher": 36,
    "cipher-base": 65,
    evp_bytestokey: 109,
    inherits: 142,
    "safe-buffer": 186
  }],
  25: [function (e, t, r) {
    var i = e("safe-buffer").Buffer, n = i.alloc(16, 0);

    function a(e) {
      var t = i.allocUnsafe(16);
      return t.writeUInt32BE(e[0] >>> 0, 0), t.writeUInt32BE(e[1] >>> 0, 4), t.writeUInt32BE(e[2] >>> 0, 8), t.writeUInt32BE(e[3] >>> 0, 12), t
    }

    function o(e) {
      this.h = e, this.state = i.alloc(16, 0), this.cache = i.allocUnsafe(0)
    }

    o.prototype.ghash = function (e) {
      for (var t = -1; ++t < e.length;) this.state[t] ^= e[t];
      this._multiply()
    }, o.prototype._multiply = function () {
      for (var e, t, r, i = [(e = this.h).readUInt32BE(0), e.readUInt32BE(4), e.readUInt32BE(8), e.readUInt32BE(12)], n = [0, 0, 0, 0], o = -1; ++o < 128;) {
        for (0 != (this.state[~~(o / 8)] & 1 << 7 - o % 8) && (n[0] ^= i[0], n[1] ^= i[1], n[2] ^= i[2], n[3] ^= i[3]), r = 0 != (1 & i[3]), t = 3; 0 < t; t--) i[t] = i[t] >>> 1 | (1 & i[t - 1]) << 31;
        i[0] = i[0] >>> 1, r && (i[0] = i[0] ^ 225 << 24)
      }
      this.state = a(n)
    }, o.prototype.update = function (e) {
      var t;
      for (this.cache = i.concat([this.cache, e]); 16 <= this.cache.length;) t = this.cache.slice(0, 16), this.cache = this.cache.slice(16), this.ghash(t)
    }, o.prototype["final"] = function (e, t) {
      return this.cache.length && this.ghash(i.concat([this.cache, n], 16)), this.ghash(a([0, e, 0, t])), this.state
    }, t.exports = o
  }, {"safe-buffer": 186}],
  26: [function (e, t, r) {
    t.exports = function (e) {
      for (var t, r = e.length; r--;) {
        if (255 !== (t = e.readUInt8(r))) {
          t++, e.writeUInt8(t, r);
          break
        }
        e.writeUInt8(0, r)
      }
    }
  }, {}],
  27: [function (e, t, r) {
    var n = e("buffer-xor");
    r.encrypt = function (e, t) {
      var r = n(t, e._prev);
      return e._prev = e._cipher.encryptBlock(r), e._prev
    }, r.decrypt = function (e, t) {
      var r = e._prev;
      e._prev = t;
      var i = e._cipher.decryptBlock(t);
      return n(i, r)
    }
  }, {"buffer-xor": 63}],
  28: [function (e, t, r) {
    var o = e("safe-buffer").Buffer, a = e("buffer-xor");

    function s(e, t, r) {
      var i = t.length, n = a(t, e._cache);
      return e._cache = e._cache.slice(i), e._prev = o.concat([e._prev, r ? t : n]), n
    }

    r.encrypt = function (e, t, r) {
      for (var i, n = o.allocUnsafe(0); t.length;) {
        if (0 === e._cache.length && (e._cache = e._cipher.encryptBlock(e._prev), e._prev = o.allocUnsafe(0)), !(e._cache.length <= t.length)) {
          n = o.concat([n, s(e, t, r)]);
          break
        }
        i = e._cache.length, n = o.concat([n, s(e, t.slice(0, i), r)]), t = t.slice(i)
      }
      return n
    }
  }, {"buffer-xor": 63, "safe-buffer": 186}],
  29: [function (e, t, r) {
    var a = e("safe-buffer").Buffer;

    function s(e, t, r) {
      for (var i, n, o = -1, a = 0; ++o < 8;) i = t & 1 << 7 - o ? 128 : 0, a += (128 & (n = e._cipher.encryptBlock(e._prev)[0] ^ i)) >> o % 8, e._prev = l(e._prev, r ? i : n);
      return a
    }

    function l(e, t) {
      var r = e.length, i = -1, n = a.allocUnsafe(e.length);
      for (e = a.concat([e, a.from([t])]); ++i < r;) n[i] = e[i] << 1 | e[i + 1] >> 7;
      return n
    }

    r.encrypt = function (e, t, r) {
      for (var i = t.length, n = a.allocUnsafe(i), o = -1; ++o < i;) n[o] = s(e, t[o], r);
      return n
    }
  }, {"safe-buffer": 186}],
  30: [function (e, t, r) {
    var c = e("safe-buffer").Buffer;
    r.encrypt = function (e, t, r) {
      for (var i, n, o, a, s = t.length, l = c.allocUnsafe(s), u = -1; ++u < s;) l[u] = (i = e, n = t[u], o = r, a = i._cipher.encryptBlock(i._prev)[0] ^ n, i._prev = c.concat([i._prev.slice(1), c.from([o ? n : a])]), a);
      return l
    }
  }, {"safe-buffer": 186}],
  31: [function (e, t, r) {
    var c = e("buffer-xor"), h = e("safe-buffer").Buffer, d = e("../incr32");
    r.encrypt = function (e, t) {
      var r = Math.ceil(t.length / 16), i = e._cache.length;
      e._cache = h.concat([e._cache, h.allocUnsafe(16 * r)]);
      for (var n, o, a = 0; a < r; a++) {
        var s = (o = (n = e)._cipher.encryptBlockRaw(n._prev), d(n._prev), o), l = i + 16 * a;
        e._cache.writeUInt32BE(s[0], l + 0), e._cache.writeUInt32BE(s[1], l + 4), e._cache.writeUInt32BE(s[2], l + 8), e._cache.writeUInt32BE(s[3], l + 12)
      }
      var u = e._cache.slice(0, t.length);
      return e._cache = e._cache.slice(t.length), c(t, u)
    }
  }, {"../incr32": 26, "buffer-xor": 63, "safe-buffer": 186}],
  32: [function (e, t, r) {
    r.encrypt = function (e, t) {
      return e._cipher.encryptBlock(t)
    }, r.decrypt = function (e, t) {
      return e._cipher.decryptBlock(t)
    }
  }, {}],
  33: [function (e, t, r) {
    var i = {
      ECB: e("./ecb"),
      CBC: e("./cbc"),
      CFB: e("./cfb"),
      CFB8: e("./cfb8"),
      CFB1: e("./cfb1"),
      OFB: e("./ofb"),
      CTR: e("./ctr"),
      GCM: e("./ctr")
    }, n = e("./list.json");
    for (var o in n) n[o].module = i[n[o].mode];
    t.exports = n
  }, {"./cbc": 27, "./cfb": 28, "./cfb1": 29, "./cfb8": 30, "./ctr": 31, "./ecb": 32, "./list.json": 34, "./ofb": 35}],
  34: [function (e, t, r) {
    t.exports = {
      "aes-128-ecb": {cipher: "AES", key: 128, iv: 0, mode: "ECB", type: "block"},
      "aes-192-ecb": {cipher: "AES", key: 192, iv: 0, mode: "ECB", type: "block"},
      "aes-256-ecb": {cipher: "AES", key: 256, iv: 0, mode: "ECB", type: "block"},
      "aes-128-cbc": {cipher: "AES", key: 128, iv: 16, mode: "CBC", type: "block"},
      "aes-192-cbc": {cipher: "AES", key: 192, iv: 16, mode: "CBC", type: "block"},
      "aes-256-cbc": {cipher: "AES", key: 256, iv: 16, mode: "CBC", type: "block"},
      aes128: {cipher: "AES", key: 128, iv: 16, mode: "CBC", type: "block"},
      aes192: {cipher: "AES", key: 192, iv: 16, mode: "CBC", type: "block"},
      aes256: {cipher: "AES", key: 256, iv: 16, mode: "CBC", type: "block"},
      "aes-128-cfb": {cipher: "AES", key: 128, iv: 16, mode: "CFB", type: "stream"},
      "aes-192-cfb": {cipher: "AES", key: 192, iv: 16, mode: "CFB", type: "stream"},
      "aes-256-cfb": {cipher: "AES", key: 256, iv: 16, mode: "CFB", type: "stream"},
      "aes-128-cfb8": {cipher: "AES", key: 128, iv: 16, mode: "CFB8", type: "stream"},
      "aes-192-cfb8": {cipher: "AES", key: 192, iv: 16, mode: "CFB8", type: "stream"},
      "aes-256-cfb8": {cipher: "AES", key: 256, iv: 16, mode: "CFB8", type: "stream"},
      "aes-128-cfb1": {cipher: "AES", key: 128, iv: 16, mode: "CFB1", type: "stream"},
      "aes-192-cfb1": {cipher: "AES", key: 192, iv: 16, mode: "CFB1", type: "stream"},
      "aes-256-cfb1": {cipher: "AES", key: 256, iv: 16, mode: "CFB1", type: "stream"},
      "aes-128-ofb": {cipher: "AES", key: 128, iv: 16, mode: "OFB", type: "stream"},
      "aes-192-ofb": {cipher: "AES", key: 192, iv: 16, mode: "OFB", type: "stream"},
      "aes-256-ofb": {cipher: "AES", key: 256, iv: 16, mode: "OFB", type: "stream"},
      "aes-128-ctr": {cipher: "AES", key: 128, iv: 16, mode: "CTR", type: "stream"},
      "aes-192-ctr": {cipher: "AES", key: 192, iv: 16, mode: "CTR", type: "stream"},
      "aes-256-ctr": {cipher: "AES", key: 256, iv: 16, mode: "CTR", type: "stream"},
      "aes-128-gcm": {cipher: "AES", key: 128, iv: 12, mode: "GCM", type: "auth"},
      "aes-192-gcm": {cipher: "AES", key: 192, iv: 12, mode: "GCM", type: "auth"},
      "aes-256-gcm": {cipher: "AES", key: 256, iv: 12, mode: "GCM", type: "auth"}
    }
  }, {}],
  35: [function (e, t, r) {
    (function (n) {
      var o = e("buffer-xor");
      r.encrypt = function (e, t) {
        for (; e._cache.length < t.length;) e._cache = n.concat([e._cache, ((r = e)._prev = r._cipher.encryptBlock(r._prev), r._prev)]);
        var r, i = e._cache.slice(0, t.length);
        return e._cache = e._cache.slice(t.length), o(t, i)
      }
    }).call(this, e("buffer").Buffer)
  }, {buffer: 64, "buffer-xor": 63}],
  36: [function (e, t, r) {
    var n = e("./aes"), o = e("safe-buffer").Buffer, a = e("cipher-base");

    function i(e, t, r, i) {
      a.call(this), this._cipher = new n.AES(t), this._prev = o.from(r), this._cache = o.allocUnsafe(0), this._secCache = o.allocUnsafe(0), this._decrypt = i, this._mode = e
    }

    e("inherits")(i, a), i.prototype._update = function (e) {
      return this._mode.encrypt(this, e, this._decrypt)
    }, i.prototype._final = function () {
      this._cipher.scrub()
    }, t.exports = i
  }, {"./aes": 20, "cipher-base": 65, inherits: 142, "safe-buffer": 186}],
  37: [function (e, t, r) {
    var i = e("browserify-des"), n = e("browserify-aes/browser"), o = e("browserify-aes/modes"),
        a = e("browserify-des/modes"), s = e("evp_bytestokey");

    function l(e, t, r) {
      if (e = e.toLowerCase(), o[e]) return n.createCipheriv(e, t, r);
      if (a[e]) return new i({key: t, iv: r, mode: e});
      throw new TypeError("invalid suite type")
    }

    function u(e, t, r) {
      if (e = e.toLowerCase(), o[e]) return n.createDecipheriv(e, t, r);
      if (a[e]) return new i({key: t, iv: r, mode: e, decrypt: !0});
      throw new TypeError("invalid suite type")
    }

    r.createCipher = r.Cipher = function (e, t) {
      var r, i;
      if (e = e.toLowerCase(), o[e]) r = o[e].key, i = o[e].iv; else {
        if (!a[e]) throw new TypeError("invalid suite type");
        r = 8 * a[e].key, i = a[e].iv
      }
      var n = s(t, !1, r, i);
      return l(e, n.key, n.iv)
    }, r.createCipheriv = r.Cipheriv = l, r.createDecipher = r.Decipher = function (e, t) {
      var r, i;
      if (e = e.toLowerCase(), o[e]) r = o[e].key, i = o[e].iv; else {
        if (!a[e]) throw new TypeError("invalid suite type");
        r = 8 * a[e].key, i = a[e].iv
      }
      var n = s(t, !1, r, i);
      return u(e, n.key, n.iv)
    }, r.createDecipheriv = r.Decipheriv = u, r.listCiphers = r.getCiphers = function () {
      return Object.keys(a).concat(n.getCiphers())
    }
  }, {
    "browserify-aes/browser": 22,
    "browserify-aes/modes": 33,
    "browserify-des": 38,
    "browserify-des/modes": 39,
    evp_bytestokey: 109
  }],
  38: [function (e, t, r) {
    var a = e("cipher-base"), i = e("des.js"), n = e("inherits"), s = e("safe-buffer").Buffer, l = {
      "des-ede3-cbc": i.CBC.instantiate(i.EDE),
      "des-ede3": i.EDE,
      "des-ede-cbc": i.CBC.instantiate(i.EDE),
      "des-ede": i.EDE,
      "des-cbc": i.CBC.instantiate(i.DES),
      "des-ecb": i.DES
    };

    function o(e) {
      a.call(this);
      var t = e.mode.toLowerCase(), r = l[t], i = e.decrypt ? "decrypt" : "encrypt", n = e.key;
      s.isBuffer(n) || (n = s.from(n)), "des-ede" !== t && "des-ede-cbc" !== t || (n = s.concat([n, n.slice(0, 8)]));
      var o = e.iv;
      s.isBuffer(o) || (o = s.from(o)), this._des = r.create({key: n, iv: o, type: i})
    }

    l.des = l["des-cbc"], l.des3 = l["des-ede3-cbc"], n(t.exports = o, a), o.prototype._update = function (e) {
      return s.from(this._des.update(e))
    }, o.prototype._final = function () {
      return s.from(this._des["final"]())
    }
  }, {"cipher-base": 65, "des.js": 80, inherits: 142, "safe-buffer": 186}],
  39: [function (e, t, r) {
    r["des-ecb"] = {key: 8, iv: 0}, r["des-cbc"] = r.des = {key: 8, iv: 8}, r["des-ede3-cbc"] = r.des3 = {
      key: 24,
      iv: 8
    }, r["des-ede3"] = {key: 24, iv: 0}, r["des-ede-cbc"] = {key: 16, iv: 8}, r["des-ede"] = {key: 16, iv: 0}
  }, {}],
  40: [function (t, r, e) {
    (function (y) {
      var m = t("bn.js"), i = t("randombytes");

      function e(e, t) {
        var r, i, n = {
              blinder: (i = g(r = t)).toRed(m.mont(r.modulus)).redPow(new m(r.publicExponent)).fromRed(),
              unblinder: i.invm(r.modulus)
            }, o = t.modulus.byteLength(), a = (m.mont(t.modulus), new m(e).mul(n.blinder).umod(t.modulus)),
            s = a.toRed(m.mont(t.prime1)), l = a.toRed(m.mont(t.prime2)), u = t.coefficient, c = t.prime1, h = t.prime2,
            d = s.redPow(t.exponent1), f = l.redPow(t.exponent2), d = d.fromRed(), f = f.fromRed(),
            p = d.isub(f).imul(u).umod(c);
        return p.imul(h), f.iadd(p), new y(f.imul(n.unblinder).umod(t.modulus).toArray(!1, o))
      }

      function g(e) {
        for (var t = e.modulus.byteLength(), r = new m(i(t)); 0 <= r.cmp(e.modulus) || !r.umod(e.prime1) || !r.umod(e.prime2);) r = new m(i(t));
        return r
      }

      (r.exports = e).getr = g
    }).call(this, t("buffer").Buffer)
  }, {"bn.js": 41, buffer: 64, randombytes: 169}],
  41: [function (e, t, r) {
    arguments[4][15][0].apply(r, arguments)
  }, {buffer: 19, dup: 15}],
  42: [function (e, t, r) {
    t.exports = e("./browser/algorithms.json")
  }, {"./browser/algorithms.json": 43}],
  43: [function (e, t, r) {
    t.exports = {
      sha224WithRSAEncryption: {sign: "rsa", hash: "sha224", id: "302d300d06096086480165030402040500041c"},
      "RSA-SHA224": {sign: "ecdsa/rsa", hash: "sha224", id: "302d300d06096086480165030402040500041c"},
      sha256WithRSAEncryption: {sign: "rsa", hash: "sha256", id: "3031300d060960864801650304020105000420"},
      "RSA-SHA256": {sign: "ecdsa/rsa", hash: "sha256", id: "3031300d060960864801650304020105000420"},
      sha384WithRSAEncryption: {sign: "rsa", hash: "sha384", id: "3041300d060960864801650304020205000430"},
      "RSA-SHA384": {sign: "ecdsa/rsa", hash: "sha384", id: "3041300d060960864801650304020205000430"},
      sha512WithRSAEncryption: {sign: "rsa", hash: "sha512", id: "3051300d060960864801650304020305000440"},
      "RSA-SHA512": {sign: "ecdsa/rsa", hash: "sha512", id: "3051300d060960864801650304020305000440"},
      "RSA-SHA1": {sign: "rsa", hash: "sha1", id: "3021300906052b0e03021a05000414"},
      "ecdsa-with-SHA1": {sign: "ecdsa", hash: "sha1", id: ""},
      sha256: {sign: "ecdsa", hash: "sha256", id: ""},
      sha224: {sign: "ecdsa", hash: "sha224", id: ""},
      sha384: {sign: "ecdsa", hash: "sha384", id: ""},
      sha512: {sign: "ecdsa", hash: "sha512", id: ""},
      "DSA-SHA": {sign: "dsa", hash: "sha1", id: ""},
      "DSA-SHA1": {sign: "dsa", hash: "sha1", id: ""},
      DSA: {sign: "dsa", hash: "sha1", id: ""},
      "DSA-WITH-SHA224": {sign: "dsa", hash: "sha224", id: ""},
      "DSA-SHA224": {sign: "dsa", hash: "sha224", id: ""},
      "DSA-WITH-SHA256": {sign: "dsa", hash: "sha256", id: ""},
      "DSA-SHA256": {sign: "dsa", hash: "sha256", id: ""},
      "DSA-WITH-SHA384": {sign: "dsa", hash: "sha384", id: ""},
      "DSA-SHA384": {sign: "dsa", hash: "sha384", id: ""},
      "DSA-WITH-SHA512": {sign: "dsa", hash: "sha512", id: ""},
      "DSA-SHA512": {sign: "dsa", hash: "sha512", id: ""},
      "DSA-RIPEMD160": {sign: "dsa", hash: "rmd160", id: ""},
      ripemd160WithRSA: {sign: "rsa", hash: "rmd160", id: "3021300906052b2403020105000414"},
      "RSA-RIPEMD160": {sign: "rsa", hash: "rmd160", id: "3021300906052b2403020105000414"},
      md5WithRSAEncryption: {sign: "rsa", hash: "md5", id: "3020300c06082a864886f70d020505000410"},
      "RSA-MD5": {sign: "rsa", hash: "md5", id: "3020300c06082a864886f70d020505000410"}
    }
  }, {}],
  44: [function (e, t, r) {
    t.exports = {
      "1.3.132.0.10": "secp256k1",
      "1.3.132.0.33": "p224",
      "1.2.840.10045.3.1.1": "p192",
      "1.2.840.10045.3.1.7": "p256",
      "1.3.132.0.34": "p384",
      "1.3.132.0.35": "p521"
    }
  }, {}],
  45: [function (e, t, r) {
    var n = e("buffer").Buffer, i = e("create-hash"), o = e("readable-stream"), a = e("inherits"), s = e("./sign"),
        l = e("./verify"), u = e("./algorithms.json");

    function c(e) {
      o.Writable.call(this);
      var t = u[e];
      if (!t) throw new Error("Unknown message digest");
      this._hashType = t.hash, this._hash = i(t.hash), this._tag = t.id, this._signType = t.sign
    }

    function h(e) {
      o.Writable.call(this);
      var t = u[e];
      if (!t) throw new Error("Unknown message digest");
      this._hash = i(t.hash), this._tag = t.id, this._signType = t.sign
    }

    function d(e) {
      return new c(e)
    }

    function f(e) {
      return new h(e)
    }

    Object.keys(u).forEach(function (e) {
      u[e].id = n.from(u[e].id, "hex"), u[e.toLowerCase()] = u[e]
    }), a(c, o.Writable), c.prototype._write = function (e, t, r) {
      this._hash.update(e), r()
    }, c.prototype.update = function (e, t) {
      return "string" == typeof e && (e = n.from(e, t)), this._hash.update(e), this
    }, c.prototype.sign = function (e, t) {
      this.end();
      var r = this._hash.digest(), i = s(r, e, this._hashType, this._signType, this._tag);
      return t ? i.toString(t) : i
    }, a(h, o.Writable), h.prototype._write = function (e, t, r) {
      this._hash.update(e), r()
    }, h.prototype.update = function (e, t) {
      return "string" == typeof e && (e = n.from(e, t)), this._hash.update(e), this
    }, h.prototype.verify = function (e, t, r) {
      "string" == typeof t && (t = n.from(t, r)), this.end();
      var i = this._hash.digest();
      return l(t, i, e, this._signType, this._tag)
    }, t.exports = {Sign: d, Verify: f, createSign: d, createVerify: f}
  }, {
    "./algorithms.json": 43,
    "./sign": 46,
    "./verify": 47,
    buffer: 64,
    "create-hash": 69,
    inherits: 142,
    "readable-stream": 62
  }],
  46: [function (e, t, r) {
    var y = e("buffer").Buffer, u = e("create-hmac"), c = e("browserify-rsa"), h = e("elliptic").ec, m = e("bn.js"),
        d = e("parse-asn1"), f = e("./curves.json");

    function g(e, t, r, i) {
      var n;
      (e = y.from(e.toArray())).length < t.byteLength() && (n = y.alloc(t.byteLength() - e.length), e = y.concat([n, e]));
      var o = r.length, a = function (e, t) {
        e = (e = b(e, t)).mod(t);
        var r = y.from(e.toArray());
        {
          var i;
          r.length < t.byteLength() && (i = y.alloc(t.byteLength() - r.length), r = y.concat([i, r]))
        }
        return r
      }(r, t);
      (l = y.alloc(o)).fill(1);
      var s = y.alloc(o), s = u(i, s).update(l).update(y.from([0])).update(e).update(a).digest(),
          l = u(i, s).update(l).digest();
      return {
        k: s = u(i, s).update(l).update(y.from([1])).update(e).update(a).digest(),
        v: l = u(i, s).update(l).digest()
      }
    }

    function b(e, t) {
      var r = new m(e), i = (e.length << 3) - t.bitLength();
      return 0 < i && r.ishrn(i), r
    }

    function v(e, t, r) {
      var i, n;
      do {
        for (i = y.alloc(0); 8 * i.length < e.bitLength();) t.v = u(r, t.k).update(t.v).digest(), i = y.concat([i, t.v]);
        n = b(i, e), t.k = u(r, t.k).update(t.v).update(y.from([0])).digest(), t.v = u(r, t.k).update(t.v).digest()
      } while (-1 !== n.cmp(e));
      return n
    }

    t.exports = function (e, t, r, i, n) {
      var o = d(t);
      if (o.curve) {
        if ("ecdsa" !== i && "ecdsa/rsa" !== i) throw new Error("wrong private key type");
        return function (e, t) {
          var r = f[t.curve.join(".")];
          if (!r) throw new Error("unknown curve " + t.curve.join("."));
          var i = new h(r).keyFromPrivate(t.privateKey).sign(e);
          return y.from(i.toDER())
        }(e, o)
      }
      if ("dsa" === o.type) {
        if ("dsa" !== i) throw new Error("wrong private key type");
        return function (e, t, r) {
          var i, n = t.params.priv_key, o = t.params.p, a = t.params.q, s = t.params.g, l = new m(0),
              u = b(e, a).mod(a), c = !1, h = g(n, a, e, r);
          for (; !1 === c;) i = v(a, h, r), d = i, f = o, p = a, l = s.toRed(m.mont(f)).redPow(d).fromRed().mod(p), 0 === (c = i.invm(a).imul(u.add(n.mul(l))).mod(a)).cmpn(0) && (c = !1, l = new m(0));
          var d, f, p;
          return function (e, t) {
            e = e.toArray(), t = t.toArray(), 128 & e[0] && (e = [0].concat(e));
            128 & t[0] && (t = [0].concat(t));
            var r = [48, e.length + t.length + 4, 2, e.length];
            return r = r.concat(e, [2, t.length], t), y.from(r)
          }(l, c)
        }(e, o, r)
      }
      if ("rsa" !== i && "ecdsa/rsa" !== i) throw new Error("wrong private key type");
      e = y.concat([n, e]);
      for (var a = o.modulus.byteLength(), s = [0, 1]; e.length + s.length + 1 < a;) s.push(255);
      s.push(0);
      for (var l = -1; ++l < e.length;) s.push(e[l]);
      return c(s, o)
    }, t.exports.getKey = g, t.exports.makeKey = v
  }, {
    "./curves.json": 44,
    "bn.js": 17,
    "browserify-rsa": 40,
    buffer: 64,
    "create-hmac": 71,
    elliptic: 91,
    "parse-asn1": 154
  }],
  47: [function (e, t, r) {
    var d = e("buffer").Buffer, f = e("bn.js"), p = e("elliptic").ec, y = e("parse-asn1"), m = e("./curves.json");

    function g(e, t) {
      if (e.cmpn(0) <= 0) throw new Error("invalid sig");
      if (e.cmp(t) >= t) throw new Error("invalid sig")
    }

    t.exports = function (e, t, r, i, n) {
      var o = y(r);
      if ("ec" === o.type) {
        if ("ecdsa" !== i && "ecdsa/rsa" !== i) throw new Error("wrong public key type");
        return function (e, t, r) {
          var i = m[r.data.algorithm.curve.join(".")];
          if (!i) throw new Error("unknown curve " + r.data.algorithm.curve.join("."));
          var n = new p(i), o = r.data.subjectPrivateKey.data;
          return n.verify(t, e, o)
        }(e, t, o)
      }
      if ("dsa" === o.type) {
        if ("dsa" !== i) throw new Error("wrong public key type");
        return function (e, t, r) {
          var i = r.data.p, n = r.data.q, o = r.data.g, a = r.data.pub_key, s = y.signature.decode(e, "der"), l = s.s,
              u = s.r;
          g(l, n), g(u, n);
          var c = f.mont(i), h = l.invm(n);
          return 0 === o.toRed(c).redPow(new f(t).mul(h).mod(n)).fromRed().mul(a.toRed(c).redPow(u.mul(h).mod(n)).fromRed()).mod(i).mod(n).cmp(u)
        }(e, t, o)
      }
      if ("rsa" !== i && "ecdsa/rsa" !== i) throw new Error("wrong public key type");
      t = d.concat([n, t]);
      for (var a = o.modulus.byteLength(), s = [1], l = 0; t.length + s.length + 2 < a;) s.push(255), l++;
      s.push(0);
      for (var u = -1; ++u < t.length;) s.push(t[u]);
      s = d.from(s);
      var c = f.mont(o.modulus);
      e = (e = new f(e).toRed(c)).redPow(new f(o.publicExponent)), e = d.from(e.fromRed().toArray());
      var h = l < 8 ? 1 : 0, a = Math.min(e.length, s.length);
      for (e.length !== s.length && (h = 1), u = -1; ++u < a;) h |= e[u] ^ s[u];
      return 0 === h
    }
  }, {"./curves.json": 44, "bn.js": 17, buffer: 64, elliptic: 91, "parse-asn1": 154}],
  48: [function (e, t, r) {
    "use strict";
    var i = {};

    function n(e, s, t) {
      var r = function (a) {
        var e, t;

        function r(e, t, r) {
          return a.call(this, (i = e, n = t, o = r, "string" == typeof s ? s : s(i, n, o))) || this;
          var i, n, o
        }

        return t = a, (e = r).prototype = Object.create(t.prototype), (e.prototype.constructor = e).__proto__ = t, r
      }(t = t || Error);
      r.prototype.name = t.name, r.prototype.code = e, i[e] = r
    }

    function p(e, t) {
      if (Array.isArray(e)) {
        var r = e.length;
        return e = e.map(function (e) {
          return String(e)
        }), 2 < r ? "one of ".concat(t, " ").concat(e.slice(0, r - 1).join(", "), ", or ") + e[r - 1] : 2 === r ? "one of ".concat(t, " ").concat(e[0], " or ").concat(e[1]) : "of ".concat(t, " ").concat(e[0])
      }
      return "of ".concat(t, " ").concat(String(e))
    }

    n("ERR_INVALID_OPT_VALUE", function (e, t) {
      return 'The value "' + t + '" is invalid for option "' + e + '"'
    }, TypeError), n("ERR_INVALID_ARG_TYPE", function (e, t, r) {
      var i, n, o, a, s, l, u, c, h, d, f;
      return "string" == typeof t && (n = "not ", t.substr(!o || o < 0 ? 0 : +o, n.length) === n) ? (i = "must not be", t = t.replace(/^not /, "")) : i = "must be", h = e, d = " argument", (void 0 === f || f > h.length) && (f = h.length), s = h.substring(f - d.length, f) === d ? "The ".concat(e, " ").concat(i, " ").concat(p(t, "type")) : ("number" != typeof c && (c = 0), a = c + (u = ".").length > (l = e).length || -1 === l.indexOf(u, c) ? "argument" : "property", 'The "'.concat(e, '" ').concat(a, " ").concat(i, " ").concat(p(t, "type"))), s += ". Received type ".concat(typeof r)
    }, TypeError), n("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"), n("ERR_METHOD_NOT_IMPLEMENTED", function (e) {
      return "The " + e + " method is not implemented"
    }), n("ERR_STREAM_PREMATURE_CLOSE", "Premature close"), n("ERR_STREAM_DESTROYED", function (e) {
      return "Cannot call " + e + " after a stream was destroyed"
    }), n("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"), n("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"), n("ERR_STREAM_WRITE_AFTER_END", "write after end"), n("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), n("ERR_UNKNOWN_ENCODING", function (e) {
      return "Unknown encoding: " + e
    }, TypeError), n("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"), t.exports.codes = i
  }, {}],
  49: [function (c, h, e) {
    (function (e) {
      "use strict";
      var t = Object.keys || function (e) {
        var t = [];
        for (var r in e) t.push(r);
        return t
      };
      h.exports = s;
      var r = c("./_stream_readable"), i = c("./_stream_writable");
      c("inherits")(s, r);
      for (var n = t(i.prototype), o = 0; o < n.length; o++) {
        var a = n[o];
        s.prototype[a] || (s.prototype[a] = i.prototype[a])
      }

      function s(e) {
        if (!(this instanceof s)) return new s(e);
        r.call(this, e), i.call(this, e), this.allowHalfOpen = !0, e && (!1 === e.readable && (this.readable = !1), !1 === e.writable && (this.writable = !1), !1 === e.allowHalfOpen && (this.allowHalfOpen = !1, this.once("end", l)))
      }

      function l() {
        this._writableState.ended || e.nextTick(u, this)
      }

      function u(e) {
        e.end()
      }

      Object.defineProperty(s.prototype, "writableHighWaterMark", {
        enumerable: !1, get: function () {
          return this._writableState.highWaterMark
        }
      }), Object.defineProperty(s.prototype, "writableBuffer", {
        enumerable: !1, get: function () {
          return this._writableState && this._writableState.getBuffer()
        }
      }), Object.defineProperty(s.prototype, "writableLength", {
        enumerable: !1, get: function () {
          return this._writableState.length
        }
      }), Object.defineProperty(s.prototype, "destroyed", {
        enumerable: !1, get: function () {
          return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed)
        }, set: function (e) {
          void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, this._writableState.destroyed = e)
        }
      })
    }).call(this, c("_process"))
  }, {"./_stream_readable": 51, "./_stream_writable": 53, _process: 161, inherits: 142}],
  50: [function (e, t, r) {
    "use strict";
    t.exports = n;
    var i = e("./_stream_transform");

    function n(e) {
      if (!(this instanceof n)) return new n(e);
      i.call(this, e)
    }

    e("inherits")(n, i), n.prototype._transform = function (e, t, r) {
      r(null, e)
    }
  }, {"./_stream_transform": 52, inherits: 142}],
  51: [function (j, F, e) {
    (function (y, e) {
      "use strict";
      var i;
      (F.exports = E).ReadableState = S;

      function m(e, t) {
        return e.listeners(t).length
      }

      j("events").EventEmitter;
      var n = j("./internal/streams/stream"), l = j("buffer").Buffer, u = e.Uint8Array || function () {
      };
      var o, t, r, a = j("util"), g = a && a.debuglog ? a.debuglog("stream") : function () {
          }, s = j("./internal/streams/buffer_list"), c = j("./internal/streams/destroy"),
          h = j("./internal/streams/state").getHighWaterMark, d = j("../errors").codes, f = d.ERR_INVALID_ARG_TYPE,
          p = d.ERR_STREAM_PUSH_AFTER_EOF, b = d.ERR_METHOD_NOT_IMPLEMENTED, v = d.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
      j("inherits")(E, n);
      var _ = c.errorOrDestroy, w = ["error", "close", "destroy", "pause", "resume"];

      function S(e, t, r) {
        i = i || j("./_stream_duplex"), e = e || {}, "boolean" != typeof r && (r = t instanceof i), this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.readableObjectMode), this.highWaterMark = h(this, e, "readableHighWaterMark", r), this.buffer = new s, this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = !1 !== e.emitClose, this.autoDestroy = !!e.autoDestroy, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (o = o || j("string_decoder/").StringDecoder, this.decoder = new o(e.encoding), this.encoding = e.encoding)
      }

      function E(e) {
        if (i = i || j("./_stream_duplex"), !(this instanceof E)) return new E(e);
        var t = this instanceof i;
        this._readableState = new S(e, this, t), this.readable = !0, e && ("function" == typeof e.read && (this._read = e.read), "function" == typeof e.destroy && (this._destroy = e.destroy)), n.call(this)
      }

      function x(e, t, r, i, n) {
        g("readableAddChunk", t);
        var o, a, s = e._readableState;
        if (null === t) s.reading = !1, function (e, t) {
          if (g("onEofChunk"), t.ended) return;
          {
            var r;
            !t.decoder || (r = t.decoder.end()) && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length)
          }
          t.ended = !0, t.sync ? P(e) : (t.needReadable = !1, t.emittedReadable || (t.emittedReadable = !0, C(e)))
        }(e, s); else if (n || (o = function (e, t) {
          var r;
          (function (e) {
            return l.isBuffer(e) || e instanceof u
          })(t) || "string" == typeof t || void 0 === t || e.objectMode || (r = new f("chunk", ["string", "Buffer", "Uint8Array"], t));
          return r
        }(s, t)), o) _(e, o); else if (s.objectMode || t && 0 < t.length) if ("string" == typeof t || s.objectMode || Object.getPrototypeOf(t) === l.prototype || (a = t, t = l.from(a)), i) s.endEmitted ? _(e, new v) : T(e, s, t, !0); else if (s.ended) _(e, new p); else {
          if (s.destroyed) return !1;
          s.reading = !1, s.decoder && !r ? (t = s.decoder.write(t), s.objectMode || 0 !== t.length ? T(e, s, t, !1) : A(e, s)) : T(e, s, t, !1)
        } else i || (s.reading = !1, A(e, s));
        return !s.ended && (s.length < s.highWaterMark || 0 === s.length)
      }

      function T(e, t, r, i) {
        t.flowing && 0 === t.length && !t.sync ? (t.awaitDrain = 0, e.emit("data", r)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && P(e)), A(e, t)
      }

      Object.defineProperty(E.prototype, "destroyed", {
        enumerable: !1, get: function () {
          return void 0 !== this._readableState && this._readableState.destroyed
        }, set: function (e) {
          this._readableState && (this._readableState.destroyed = e)
        }
      }), E.prototype.destroy = c.destroy, E.prototype._undestroy = c.undestroy, E.prototype._destroy = function (e, t) {
        t(e)
      }, E.prototype.push = function (e, t) {
        var r, i = this._readableState;
        return i.objectMode ? r = !0 : "string" == typeof e && ((t = t || i.defaultEncoding) !== i.encoding && (e = l.from(e, t), t = ""), r = !0), x(this, e, t, !1, r)
      }, E.prototype.unshift = function (e) {
        return x(this, e, null, !0, !1)
      }, E.prototype.isPaused = function () {
        return !1 === this._readableState.flowing
      }, E.prototype.setEncoding = function (e) {
        var t = new (o = o || j("string_decoder/").StringDecoder)(e);
        this._readableState.decoder = t, this._readableState.encoding = this._readableState.decoder.encoding;
        for (var r = this._readableState.buffer.head, i = ""; null !== r;) i += t.write(r.data), r = r.next;
        return this._readableState.buffer.clear(), "" !== i && this._readableState.buffer.push(i), this._readableState.length = i.length, this
      };
      var M = 1073741824;

      function k(e, t) {
        return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = (M <= (r = e) ? r = M : (r--, r |= r >>> 1, r |= r >>> 2, r |= r >>> 4, r |= r >>> 8, r |= r >>> 16, r++), r)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
        var r
      }

      function P(e) {
        var t = e._readableState;
        g("emitReadable", t.needReadable, t.emittedReadable), t.needReadable = !1, t.emittedReadable || (g("emitReadable", t.flowing), t.emittedReadable = !0, y.nextTick(C, e))
      }

      function C(e) {
        var t = e._readableState;
        g("emitReadable_", t.destroyed, t.length, t.ended), t.destroyed || !t.length && !t.ended || (e.emit("readable"), t.emittedReadable = !1), t.needReadable = !t.flowing && !t.ended && t.length <= t.highWaterMark, B(e)
      }

      function A(e, t) {
        t.readingMore || (t.readingMore = !0, y.nextTick(I, e, t))
      }

      function I(e, t) {
        for (; !t.reading && !t.ended && (t.length < t.highWaterMark || t.flowing && 0 === t.length);) {
          var r = t.length;
          if (g("maybeReadMore read 0"), e.read(0), r === t.length) break
        }
        t.readingMore = !1
      }

      function R(e) {
        var t = e._readableState;
        t.readableListening = 0 < e.listenerCount("readable"), t.resumeScheduled && !t.paused ? t.flowing = !0 : 0 < e.listenerCount("data") && e.resume()
      }

      function L(e) {
        g("readable nexttick read 0"), e.read(0)
      }

      function D(e, t) {
        g("resume", t.reading), t.reading || e.read(0), t.resumeScheduled = !1, e.emit("resume"), B(e), t.flowing && !t.reading && e.read(0)
      }

      function B(e) {
        var t = e._readableState;
        for (g("flow", t.flowing); t.flowing && null !== e.read();) ;
      }

      function O(e, t) {
        return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.first() : t.buffer.concat(t.length), t.buffer.clear()) : r = t.buffer.consume(e, t.decoder), r);
        var r
      }

      function U(e) {
        var t = e._readableState;
        g("endReadable", t.endEmitted), t.endEmitted || (t.ended = !0, y.nextTick(N, t, e))
      }

      function N(e, t) {
        var r;
        g("endReadableNT", e.endEmitted, e.length), e.endEmitted || 0 !== e.length || (e.endEmitted = !0, t.readable = !1, t.emit("end"), !e.autoDestroy || (!(r = t._writableState) || r.autoDestroy && r.finished) && t.destroy())
      }

      function H(e, t) {
        for (var r = 0, i = e.length; r < i; r++) if (e[r] === t) return r;
        return -1
      }

      E.prototype.read = function (e) {
        g("read", e), e = parseInt(e, 10);
        var t = this._readableState, r = e;
        if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && ((0 !== t.highWaterMark ? t.length >= t.highWaterMark : 0 < t.length) || t.ended)) return g("read: emitReadable", t.length, t.ended), (0 === t.length && t.ended ? U : P)(this), null;
        if (0 === (e = k(e, t)) && t.ended) return 0 === t.length && U(this), null;
        var i, n = t.needReadable;
        return g("need readable", n), (0 === t.length || t.length - e < t.highWaterMark) && g("length less than watermark", n = !0), t.ended || t.reading ? g("reading or ended", n = !1) : n && (g("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = k(r, t))), null === (i = 0 < e ? O(e, t) : null) ? (t.needReadable = t.length <= t.highWaterMark, e = 0) : (t.length -= e, t.awaitDrain = 0), 0 === t.length && (t.ended || (t.needReadable = !0), r !== e && t.ended && U(this)), null !== i && this.emit("data", i), i
      }, E.prototype._read = function (e) {
        _(this, new b("_read()"))
      }, E.prototype.pipe = function (r, e) {
        var i = this, n = this._readableState;
        switch (n.pipesCount) {
          case 0:
            n.pipes = r;
            break;
          case 1:
            n.pipes = [n.pipes, r];
            break;
          default:
            n.pipes.push(r)
        }
        n.pipesCount += 1, g("pipe count=%d opts=%j", n.pipesCount, e);
        var t = (!e || !1 !== e.end) && r !== y.stdout && r !== y.stderr ? a : p;

        function o(e, t) {
          g("onunpipe"), e === i && t && !1 === t.hasUnpiped && (t.hasUnpiped = !0, g("cleanup"), r.removeListener("close", d), r.removeListener("finish", f), r.removeListener("drain", l), r.removeListener("error", h), r.removeListener("unpipe", o), i.removeListener("end", a), i.removeListener("end", p), i.removeListener("data", c), u = !0, !n.awaitDrain || r._writableState && !r._writableState.needDrain || l())
        }

        function a() {
          g("onend"), r.end()
        }

        n.endEmitted ? y.nextTick(t) : i.once("end", t), r.on("unpipe", o);
        var s, l = (s = i, function () {
          var e = s._readableState;
          g("pipeOnDrain", e.awaitDrain), e.awaitDrain && e.awaitDrain--, 0 === e.awaitDrain && m(s, "data") && (e.flowing = !0, B(s))
        });
        r.on("drain", l);
        var u = !1;

        function c(e) {
          g("ondata");
          var t = r.write(e);
          g("dest.write", t), !1 === t && ((1 === n.pipesCount && n.pipes === r || 1 < n.pipesCount && -1 !== H(n.pipes, r)) && !u && (g("false write response, pause", n.awaitDrain), n.awaitDrain++), i.pause())
        }

        function h(e) {
          g("onerror", e), p(), r.removeListener("error", h), 0 === m(r, "error") && _(r, e)
        }

        function d() {
          r.removeListener("finish", f), p()
        }

        function f() {
          g("onfinish"), r.removeListener("close", d), p()
        }

        function p() {
          g("unpipe"), i.unpipe(r)
        }

        return i.on("data", c), function (e, t, r) {
          if ("function" == typeof e.prependListener) return e.prependListener(t, r);
          e._events && e._events[t] ? Array.isArray(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r)
        }(r, "error", h), r.once("close", d), r.once("finish", f), r.emit("pipe", i), n.flowing || (g("pipe resume"), i.resume()), r
      }, E.prototype.unpipe = function (e) {
        var t = this._readableState, r = {hasUnpiped: !1};
        if (0 === t.pipesCount) return this;
        if (1 === t.pipesCount) return e && e !== t.pipes || (e = e || t.pipes, t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, r)), this;
        if (!e) {
          var i = t.pipes, n = t.pipesCount;
          t.pipes = null, t.pipesCount = 0, t.flowing = !1;
          for (var o = 0; o < n; o++) i[o].emit("unpipe", this, {hasUnpiped: !1});
          return this
        }
        var a = H(t.pipes, e);
        return -1 === a || (t.pipes.splice(a, 1), --t.pipesCount, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r)), this
      }, E.prototype.addListener = E.prototype.on = function (e, t) {
        var r = n.prototype.on.call(this, e, t), i = this._readableState;
        return "data" === e ? (i.readableListening = 0 < this.listenerCount("readable"), !1 !== i.flowing && this.resume()) : "readable" === e && (i.endEmitted || i.readableListening || (i.readableListening = i.needReadable = !0, i.flowing = !1, i.emittedReadable = !1, g("on readable", i.length, i.reading), i.length ? P(this) : i.reading || y.nextTick(L, this))), r
      }, E.prototype.removeListener = function (e, t) {
        var r = n.prototype.removeListener.call(this, e, t);
        return "readable" === e && y.nextTick(R, this), r
      }, E.prototype.removeAllListeners = function (e) {
        var t = n.prototype.removeAllListeners.apply(this, arguments);
        return "readable" !== e && void 0 !== e || y.nextTick(R, this), t
      }, E.prototype.resume = function () {
        var e, t, r = this._readableState;
        return r.flowing || (g("resume"), r.flowing = !r.readableListening, e = this, (t = r).resumeScheduled || (t.resumeScheduled = !0, y.nextTick(D, e, t))), r.paused = !1, this
      }, E.prototype.pause = function () {
        return g("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (g("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this
      }, E.prototype.wrap = function (t) {
        var r = this, i = this._readableState, n = !1;
        for (var e in t.on("end", function () {
          var e;
          g("wrapped end"), !i.decoder || i.ended || (e = i.decoder.end()) && e.length && r.push(e), r.push(null)
        }), t.on("data", function (e) {
          g("wrapped data"), i.decoder && (e = i.decoder.write(e)), i.objectMode && null == e || (i.objectMode || e && e.length) && (r.push(e) || (n = !0, t.pause()))
        }), t) void 0 === this[e] && "function" == typeof t[e] && (this[e] = function (e) {
          return function () {
            return t[e].apply(t, arguments)
          }
        }(e));
        for (var o = 0; o < w.length; o++) t.on(w[o], this.emit.bind(this, w[o]));
        return this._read = function (e) {
          g("wrapped _read", e), n && (n = !1, t.resume())
        }, this
      }, "function" == typeof Symbol && (E.prototype[Symbol.asyncIterator] = function () {
        return void 0 === t && (t = j("./internal/streams/async_iterator")), t(this)
      }), Object.defineProperty(E.prototype, "readableHighWaterMark", {
        enumerable: !1, get: function () {
          return this._readableState.highWaterMark
        }
      }), Object.defineProperty(E.prototype, "readableBuffer", {
        enumerable: !1, get: function () {
          return this._readableState && this._readableState.buffer
        }
      }), Object.defineProperty(E.prototype, "readableFlowing", {
        enumerable: !1, get: function () {
          return this._readableState.flowing
        }, set: function (e) {
          this._readableState && (this._readableState.flowing = e)
        }
      }), E._fromList = O, Object.defineProperty(E.prototype, "readableLength", {
        enumerable: !1, get: function () {
          return this._readableState.length
        }
      }), "function" == typeof Symbol && (E.from = function (e, t) {
        return void 0 === r && (r = j("./internal/streams/from")), r(E, e, t)
      })
    }).call(this, j("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
  }, {
    "../errors": 48,
    "./_stream_duplex": 49,
    "./internal/streams/async_iterator": 54,
    "./internal/streams/buffer_list": 55,
    "./internal/streams/destroy": 56,
    "./internal/streams/from": 58,
    "./internal/streams/state": 60,
    "./internal/streams/stream": 61,
    _process: 161,
    buffer: 64,
    events: 108,
    inherits: 142,
    "string_decoder/": 196,
    util: 19
  }],
  52: [function (e, t, r) {
    "use strict";
    t.exports = u;
    var i = e("../errors").codes, n = i.ERR_METHOD_NOT_IMPLEMENTED, o = i.ERR_MULTIPLE_CALLBACK,
        a = i.ERR_TRANSFORM_ALREADY_TRANSFORMING, s = i.ERR_TRANSFORM_WITH_LENGTH_0, l = e("./_stream_duplex");

    function u(e) {
      if (!(this instanceof u)) return new u(e);
      l.call(this, e), this._transformState = {
        afterTransform: function (e, t) {
          var r = this._transformState;
          r.transforming = !1;
          var i = r.writecb;
          if (null === i) return this.emit("error", new o);
          r.writechunk = null, (r.writecb = null) != t && this.push(t), i(e);
          var n = this._readableState;
          n.reading = !1, (n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark)
        }.bind(this), needTransform: !1, transforming: !1, writecb: null, writechunk: null, writeencoding: null
      }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), "function" == typeof e.flush && (this._flush = e.flush)), this.on("prefinish", c)
    }

    function c() {
      var r = this;
      "function" != typeof this._flush || this._readableState.destroyed ? h(this, null, null) : this._flush(function (e, t) {
        h(r, e, t)
      })
    }

    function h(e, t, r) {
      if (t) return e.emit("error", t);
      if (null != r && e.push(r), e._writableState.length) throw new s;
      if (e._transformState.transforming) throw new a;
      return e.push(null)
    }

    e("inherits")(u, l), u.prototype.push = function (e, t) {
      return this._transformState.needTransform = !1, l.prototype.push.call(this, e, t)
    }, u.prototype._transform = function (e, t, r) {
      r(new n("_transform()"))
    }, u.prototype._write = function (e, t, r) {
      var i, n = this._transformState;
      n.writecb = r, n.writechunk = e, n.writeencoding = t, n.transforming || (i = this._readableState, (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark))
    }, u.prototype._read = function (e) {
      var t = this._transformState;
      null === t.writechunk || t.transforming ? t.needTransform = !0 : (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform))
    }, u.prototype._destroy = function (e, t) {
      l.prototype._destroy.call(this, e, function (e) {
        t(e)
      })
    }
  }, {"../errors": 48, "./_stream_duplex": 49, inherits: 142}],
  53: [function (A, I, e) {
    (function (m, e) {
      "use strict";

      function h(e) {
        var t = this;
        this.next = null, this.entry = null, this.finish = function () {
          !function (e, t, r) {
            var i = e.entry;
            e.entry = null;
            for (; i;) {
              var n = i.callback;
              t.pendingcb--, n(r), i = i.next
            }
            t.corkedRequestsFree.next = e
          }(t, e)
        }
      }

      var n;
      (I.exports = y).WritableState = p;
      var t = {deprecate: A("util-deprecate")}, r = A("./internal/streams/stream"), g = A("buffer").Buffer,
          b = e.Uint8Array || function () {
          };
      var i, o = A("./internal/streams/destroy"), a = A("./internal/streams/state").getHighWaterMark,
          s = A("../errors").codes, v = s.ERR_INVALID_ARG_TYPE, l = s.ERR_METHOD_NOT_IMPLEMENTED,
          u = s.ERR_MULTIPLE_CALLBACK, c = s.ERR_STREAM_CANNOT_PIPE, d = s.ERR_STREAM_DESTROYED,
          _ = s.ERR_STREAM_NULL_VALUES, w = s.ERR_STREAM_WRITE_AFTER_END, f = s.ERR_UNKNOWN_ENCODING,
          S = o.errorOrDestroy;

      function E() {
      }

      function p(e, t, r) {
        n = n || A("./_stream_duplex"), e = e || {}, "boolean" != typeof r && (r = t instanceof n), this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.writableObjectMode), this.highWaterMark = a(this, e, "writableHighWaterMark", r), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
        var i = (this.destroyed = !1) === e.decodeStrings;
        this.decodeStrings = !i, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {
          !function (e, t) {
            var r = e._writableState, i = r.sync, n = r.writecb;
            if ("function" != typeof n) throw new u;
            {
              var o;
              (function (e) {
                e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0
              })(r), t ? function (e, t, r, i, n) {
                --t.pendingcb, r ? (m.nextTick(n, i), m.nextTick(C, e, t), e._writableState.errorEmitted = !0, S(e, i)) : (n(i), e._writableState.errorEmitted = !0, S(e, i), C(e, t))
              }(e, r, i, t, n) : ((o = k(r) || e.destroyed) || r.corked || r.bufferProcessing || !r.bufferedRequest || M(e, r), i ? m.nextTick(T, e, r, o, n) : T(e, r, o, n))
            }
          }(t, e)
        }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = !1 !== e.emitClose, this.autoDestroy = !!e.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new h(this)
      }

      function y(e) {
        var t = this instanceof (n = n || A("./_stream_duplex"));
        if (!t && !i.call(y, this)) return new y(e);
        this._writableState = new p(e, this, t), this.writable = !0, e && ("function" == typeof e.write && (this._write = e.write), "function" == typeof e.writev && (this._writev = e.writev), "function" == typeof e.destroy && (this._destroy = e.destroy), "function" == typeof e["final"] && (this._final = e["final"])), r.call(this)
      }

      function x(e, t, r, i, n, o, a) {
        t.writelen = i, t.writecb = a, t.writing = !0, t.sync = !0, t.destroyed ? t.onwrite(new d("write")) : r ? e._writev(n, t.onwrite) : e._write(n, o, t.onwrite), t.sync = !1
      }

      function T(e, t, r, i) {
        var n, o;
        r || (n = e, 0 === (o = t).length && o.needDrain && (o.needDrain = !1, n.emit("drain"))), t.pendingcb--, i(), C(e, t)
      }

      function M(e, t) {
        t.bufferProcessing = !0;
        var r = t.bufferedRequest;
        if (e._writev && r && r.next) {
          var i = t.bufferedRequestCount, n = new Array(i), o = t.corkedRequestsFree;
          o.entry = r;
          for (var a = 0, s = !0; r;) (n[a] = r).isBuf || (s = !1), r = r.next, a += 1;
          n.allBuffers = s, x(e, t, !0, t.length, n, "", o.finish), t.pendingcb++, t.lastBufferedRequest = null, o.next ? (t.corkedRequestsFree = o.next, o.next = null) : t.corkedRequestsFree = new h(t), t.bufferedRequestCount = 0
        } else {
          for (; r;) {
            var l = r.chunk, u = r.encoding, c = r.callback;
            if (x(e, t, !1, t.objectMode ? 1 : l.length, l, u, c), r = r.next, t.bufferedRequestCount--, t.writing) break
          }
          null === r && (t.lastBufferedRequest = null)
        }
        t.bufferedRequest = r, t.bufferProcessing = !1
      }

      function k(e) {
        return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing
      }

      function P(t, r) {
        t._final(function (e) {
          r.pendingcb--, e && S(t, e), r.prefinished = !0, t.emit("prefinish"), C(t, r)
        })
      }

      function C(e, t) {
        var r, i, n, o = k(t);
        return o && (i = e, (n = t).prefinished || n.finalCalled || ("function" != typeof i._final || n.destroyed ? (n.prefinished = !0, i.emit("prefinish")) : (n.pendingcb++, n.finalCalled = !0, m.nextTick(P, i, n))), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"), !t.autoDestroy || (!(r = e._readableState) || r.autoDestroy && r.endEmitted) && e.destroy())), o
      }

      A("inherits")(y, r), p.prototype.getBuffer = function () {
        for (var e = this.bufferedRequest, t = []; e;) t.push(e), e = e.next;
        return t
      }, function () {
        try {
          Object.defineProperty(p.prototype, "buffer", {
            get: t.deprecate(function () {
              return this.getBuffer()
            }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
          })
        } catch (e) {
        }
      }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (i = Function.prototype[Symbol.hasInstance], Object.defineProperty(y, Symbol.hasInstance, {
        value: function (e) {
          return !!i.call(this, e) || this === y && (e && e._writableState instanceof p)
        }
      })) : i = function (e) {
        return e instanceof this
      }, y.prototype.pipe = function () {
        S(this, new c)
      }, y.prototype.write = function (e, t, r) {
        var i, n, o, a, s, l, u, c, h, d, f = this._writableState, p = !1,
            y = !f.objectMode && (i = e, g.isBuffer(i) || i instanceof b);
        return y && !g.isBuffer(e) && (n = e, e = g.from(n)), "function" == typeof t && (r = t, t = null), t = y ? "buffer" : t || f.defaultEncoding, "function" != typeof r && (r = E), f.ending ? (c = this, h = r, d = new w, S(c, d), m.nextTick(h, d)) : !y && (o = this, a = f, l = r, null === (s = e) ? u = new _ : "string" == typeof s || a.objectMode || (u = new v("chunk", ["string", "Buffer"], s)), u && (S(o, u), !void m.nextTick(l, u))) || (f.pendingcb++, p = function (e, t, r, i, n, o) {
          {
            var a;
            r || (a = function (e, t, r) {
              e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = g.from(t, r));
              return t
            }(t, i, n), i !== a && (r = !0, n = "buffer", i = a))
          }
          var s = t.objectMode ? 1 : i.length;
          t.length += s;
          var l = t.length < t.highWaterMark;
          l || (t.needDrain = !0);
          {
            var u;
            t.writing || t.corked ? (u = t.lastBufferedRequest, t.lastBufferedRequest = {
              chunk: i,
              encoding: n,
              isBuf: r,
              callback: o,
              next: null
            }, u ? u.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1) : x(e, t, !1, s, i, n, o)
          }
          return l
        }(this, f, y, e, t, r)), p
      }, y.prototype.cork = function () {
        this._writableState.corked++
      }, y.prototype.uncork = function () {
        var e = this._writableState;
        e.corked && (e.corked--, e.writing || e.corked || e.bufferProcessing || !e.bufferedRequest || M(this, e))
      }, y.prototype.setDefaultEncoding = function (e) {
        if ("string" == typeof e && (e = e.toLowerCase()), !(-1 < ["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()))) throw new f(e);
        return this._writableState.defaultEncoding = e, this
      }, Object.defineProperty(y.prototype, "writableBuffer", {
        enumerable: !1, get: function () {
          return this._writableState && this._writableState.getBuffer()
        }
      }), Object.defineProperty(y.prototype, "writableHighWaterMark", {
        enumerable: !1, get: function () {
          return this._writableState.highWaterMark
        }
      }), y.prototype._write = function (e, t, r) {
        r(new l("_write()"))
      }, y.prototype._writev = null, y.prototype.end = function (e, t, r) {
        var i = this._writableState;
        return "function" == typeof e ? (r = e, t = e = null) : "function" == typeof t && (r = t, t = null), null != e && this.write(e, t), i.corked && (i.corked = 1, this.uncork()), i.ending || function (e, t, r) {
          t.ending = !0, C(e, t), r && (t.finished ? m.nextTick(r) : e.once("finish", r));
          t.ended = !0, e.writable = !1
        }(this, i, r), this
      }, Object.defineProperty(y.prototype, "writableLength", {
        enumerable: !1, get: function () {
          return this._writableState.length
        }
      }), Object.defineProperty(y.prototype, "destroyed", {
        enumerable: !1, get: function () {
          return void 0 !== this._writableState && this._writableState.destroyed
        }, set: function (e) {
          this._writableState && (this._writableState.destroyed = e)
        }
      }), y.prototype.destroy = o.destroy, y.prototype._undestroy = o.undestroy, y.prototype._destroy = function (e, t) {
        t(e)
      }
    }).call(this, A("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
  }, {
    "../errors": 48,
    "./_stream_duplex": 49,
    "./internal/streams/destroy": 56,
    "./internal/streams/state": 60,
    "./internal/streams/stream": 61,
    _process: 161,
    buffer: 64,
    inherits: 142,
    "util-deprecate": 199
  }],
  54: [function (i, m, e) {
    (function (s) {
      "use strict";
      var e;

      function r(e, t, r) {
        return t in e ? Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0
        }) : e[t] = r, e
      }

      var n = i("./end-of-stream"), o = Symbol("lastResolve"), a = Symbol("lastReject"), l = Symbol("error"),
          u = Symbol("ended"), c = Symbol("lastPromise"), h = Symbol("handlePromise"), d = Symbol("stream");

      function f(e, t) {
        return {value: e, done: t}
      }

      function p(e) {
        var t, r = e[o];
        null === r || null !== (t = e[d].read()) && (e[c] = null, e[o] = null, e[a] = null, r(f(t, !1)))
      }

      var t = Object.getPrototypeOf(function () {
      }), y = Object.setPrototypeOf((r(e = {
        get stream() {
          return this[d]
        }, next: function () {
          var r = this, e = this[l];
          if (null !== e) return Promise.reject(e);
          if (this[u]) return Promise.resolve(f(void 0, !0));
          if (this[d].destroyed) return new Promise(function (e, t) {
            s.nextTick(function () {
              r[l] ? t(r[l]) : e(f(void 0, !0))
            })
          });
          var t, i, n, o = this[c];
          if (o) t = new Promise((i = o, n = this, function (e, t) {
            i.then(function () {
              n[u] ? e(f(void 0, !0)) : n[h](e, t)
            }, t)
          })); else {
            var a = this[d].read();
            if (null !== a) return Promise.resolve(f(a, !1));
            t = new Promise(this[h])
          }
          return this[c] = t
        }
      }, Symbol.asyncIterator, function () {
        return this
      }), r(e, "return", function () {
        var e = this;
        return new Promise(function (t, r) {
          e[d].destroy(null, function (e) {
            e ? r(e) : t(f(void 0, !0))
          })
        })
      }), e), t);
      m.exports = function (e) {
        var t, i = Object.create(y, (r(t = {}, d, {value: e, writable: !0}), r(t, o, {
          value: null,
          writable: !0
        }), r(t, a, {value: null, writable: !0}), r(t, l, {
          value: null,
          writable: !0
        }), r(t, u, {value: e._readableState.endEmitted, writable: !0}), r(t, h, {
          value: function (e, t) {
            var r = i[d].read();
            r ? (i[c] = null, i[o] = null, i[a] = null, e(f(r, !1))) : (i[o] = e, i[a] = t)
          }, writable: !0
        }), t));
        return i[c] = null, n(e, function (e) {
          if (e && "ERR_STREAM_PREMATURE_CLOSE" !== e.code) {
            var t = i[a];
            return null !== t && (i[c] = null, i[o] = null, i[a] = null, t(e)), void (i[l] = e)
          }
          var r = i[o];
          null !== r && (i[c] = null, i[o] = null, r(f(void 0, !(i[a] = null)))), i[u] = !0
        }), e.on("readable", function (e) {
          s.nextTick(p, e)
        }.bind(null, i)), i
      }
    }).call(this, i("_process"))
  }, {"./end-of-stream": 57, _process: 161}],
  55: [function (e, t, r) {
    "use strict";

    function n(t, e) {
      var r, i = Object.keys(t);
      return Object.getOwnPropertySymbols && (r = Object.getOwnPropertySymbols(t), e && (r = r.filter(function (e) {
        return Object.getOwnPropertyDescriptor(t, e).enumerable
      })), i.push.apply(i, r)), i
    }

    function o(e, t, r) {
      return t in e ? Object.defineProperty(e, t, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }) : e[t] = r, e
    }

    function a(e, t) {
      for (var r = 0; r < t.length; r++) {
        var i = t[r];
        i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i)
      }
    }

    var s = e("buffer").Buffer, l = e("util").inspect, u = l && l.custom || "inspect";
    t.exports = function () {
      function e() {
        !function (e, t) {
          if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }(this, e), this.head = null, this.tail = null, this.length = 0
      }

      var t, r, i;
      return t = e, (r = [{
        key: "push", value: function (e) {
          var t = {data: e, next: null};
          0 < this.length ? this.tail.next = t : this.head = t, this.tail = t, ++this.length
        }
      }, {
        key: "unshift", value: function (e) {
          var t = {data: e, next: this.head};
          0 === this.length && (this.tail = t), this.head = t, ++this.length
        }
      }, {
        key: "shift", value: function () {
          if (0 !== this.length) {
            var e = this.head.data;
            return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, e
          }
        }
      }, {
        key: "clear", value: function () {
          this.head = this.tail = null, this.length = 0
        }
      }, {
        key: "join", value: function (e) {
          if (0 === this.length) return "";
          for (var t = this.head, r = "" + t.data; t = t.next;) r += e + t.data;
          return r
        }
      }, {
        key: "concat", value: function (e) {
          if (0 === this.length) return s.alloc(0);
          for (var t, r, i, n = s.allocUnsafe(e >>> 0), o = this.head, a = 0; o;) t = o.data, r = n, i = a, s.prototype.copy.call(t, r, i), a += o.data.length, o = o.next;
          return n
        }
      }, {
        key: "consume", value: function (e, t) {
          var r;
          return e < this.head.data.length ? (r = this.head.data.slice(0, e), this.head.data = this.head.data.slice(e)) : r = e === this.head.data.length ? this.shift() : t ? this._getString(e) : this._getBuffer(e), r
        }
      }, {
        key: "first", value: function () {
          return this.head.data
        }
      }, {
        key: "_getString", value: function (e) {
          var t = this.head, r = 1, i = t.data;
          for (e -= i.length; t = t.next;) {
            var n = t.data, o = e > n.length ? n.length : e;
            if (o === n.length ? i += n : i += n.slice(0, e), 0 === (e -= o)) {
              o === n.length ? (++r, t.next ? this.head = t.next : this.head = this.tail = null) : (this.head = t).data = n.slice(o);
              break
            }
            ++r
          }
          return this.length -= r, i
        }
      }, {
        key: "_getBuffer", value: function (e) {
          var t = s.allocUnsafe(e), r = this.head, i = 1;
          for (r.data.copy(t), e -= r.data.length; r = r.next;) {
            var n = r.data, o = e > n.length ? n.length : e;
            if (n.copy(t, t.length - e, 0, o), 0 === (e -= o)) {
              o === n.length ? (++i, r.next ? this.head = r.next : this.head = this.tail = null) : (this.head = r).data = n.slice(o);
              break
            }
            ++i
          }
          return this.length -= i, t
        }
      }, {
        key: u, value: function (e, t) {
          return l(this, function (t) {
            for (var e = 1; e < arguments.length; e++) {
              var r = null != arguments[e] ? arguments[e] : {};
              e % 2 ? n(Object(r), !0).forEach(function (e) {
                o(t, e, r[e])
              }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(r)) : n(Object(r)).forEach(function (e) {
                Object.defineProperty(t, e, Object.getOwnPropertyDescriptor(r, e))
              })
            }
            return t
          }({}, t, {depth: 0, customInspect: !1}))
        }
      }]) && a(t.prototype, r), i && a(t, i), e
    }()
  }, {buffer: 64, util: 19}],
  56: [function (e, t, r) {
    (function (o) {
      "use strict";

      function a(e, t) {
        l(e, t), s(e)
      }

      function s(e) {
        e._writableState && !e._writableState.emitClose || e._readableState && !e._readableState.emitClose || e.emit("close")
      }

      function l(e, t) {
        e.emit("error", t)
      }

      t.exports = {
        destroy: function (e, t) {
          var r = this, i = this._readableState && this._readableState.destroyed,
              n = this._writableState && this._writableState.destroyed;
          return i || n ? t ? t(e) : e && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, o.nextTick(l, this, e)) : o.nextTick(l, this, e)) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(e || null, function (e) {
            !t && e ? r._writableState ? r._writableState.errorEmitted ? o.nextTick(s, r) : (r._writableState.errorEmitted = !0, o.nextTick(a, r, e)) : o.nextTick(a, r, e) : t ? (o.nextTick(s, r), t(e)) : o.nextTick(s, r)
          })), this
        }, undestroy: function () {
          this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1)
        }, errorOrDestroy: function (e, t) {
          var r = e._readableState, i = e._writableState;
          r && r.autoDestroy || i && i.autoDestroy ? e.destroy(t) : e.emit("error", t)
        }
      }
    }).call(this, e("_process"))
  }, {_process: 161}],
  57: [function (e, t, r) {
    "use strict";
    var g = e("../../../errors").codes.ERR_STREAM_PREMATURE_CLOSE;

    function b() {
    }

    t.exports = function e(t, r, i) {
      if ("function" == typeof r) return e(t, null, r);
      var n, o;
      n = i || b, o = !1, i = function () {
        if (!o) {
          o = !0;
          for (var e = arguments.length, t = new Array(e), r = 0; r < e; r++) t[r] = arguments[r];
          n.apply(this, t)
        }
      };

      function a() {
        t.writable || y()
      }

      function s() {
        m = !(d = !1), f || i.call(t)
      }

      function l(e) {
        i.call(t, e)
      }

      function u() {
        var e;
        return d && !m ? (t._readableState && t._readableState.ended || (e = new g), i.call(t, e)) : f && !p ? (t._writableState && t._writableState.ended || (e = new g), i.call(t, e)) : void 0
      }

      function c() {
        t.req.on("finish", y)
      }

      var h, d = (r = r || {}).readable || !1 !== r.readable && t.readable,
          f = r.writable || !1 !== r.writable && t.writable, p = t._writableState && t._writableState.finished,
          y = function () {
            p = !(f = !1), d || i.call(t)
          }, m = t._readableState && t._readableState.endEmitted;
      return (h = t).setHeader && "function" == typeof h.abort ? (t.on("complete", y), t.on("abort", u), t.req ? c() : t.on("request", c)) : f && !t._writableState && (t.on("end", a), t.on("close", a)), t.on("end", s), t.on("finish", y), !1 !== r.error && t.on("error", l), t.on("close", u), function () {
        t.removeListener("complete", y), t.removeListener("abort", u), t.removeListener("request", c), t.req && t.req.removeListener("finish", y), t.removeListener("end", a), t.removeListener("close", a), t.removeListener("finish", y), t.removeListener("end", s), t.removeListener("error", l), t.removeListener("close", u)
      }
    }
  }, {"../../../errors": 48}],
  58: [function (e, t, r) {
    t.exports = function () {
      throw new Error("Readable.from is not available in the browser")
    }
  }, {}],
  59: [function (l, e, t) {
    "use strict";
    var u;
    var r = l("../../../errors").codes, s = r.ERR_MISSING_ARGS, c = r.ERR_STREAM_DESTROYED;

    function h(e) {
      if (e) throw e
    }

    function d(r, e, t, i) {
      var n, o;
      n = i, o = !1;
      var a = !(i = function () {
        o || (o = !0, n.apply(void 0, arguments))
      });
      r.on("close", function () {
        a = !0
      }), void 0 === u && (u = l("./end-of-stream")), u(r, {readable: e, writable: t}, function (e) {
        if (e) return i(e);
        a = !0, i()
      });
      var s = !1;
      return function (e) {
        var t;
        if (!a && !s) return s = !0, (t = r).setHeader && "function" == typeof t.abort ? r.abort() : "function" == typeof r.destroy ? r.destroy() : void i(e || new c("pipe"))
      }
    }

    function f(e) {
      e()
    }

    function p(e, t) {
      return e.pipe(t)
    }

    e.exports = function () {
      for (var e = arguments.length, i = new Array(e), t = 0; t < e; t++) i[t] = arguments[t];
      var r, n, o = (r = i).length && "function" == typeof r[r.length - 1] ? r.pop() : h;
      if (Array.isArray(i[0]) && (i = i[0]), i.length < 2) throw new s("streams");
      var a = i.map(function (e, t) {
        var r = t < i.length - 1;
        return d(e, r, 0 < t, function (e) {
          n = n || e, e && a.forEach(f), r || (a.forEach(f), o(n))
        })
      });
      return i.reduce(p)
    }
  }, {"../../../errors": 48, "./end-of-stream": 57}],
  60: [function (e, t, r) {
    "use strict";
    var l = e("../../../errors").codes.ERR_INVALID_OPT_VALUE;
    t.exports = {
      getHighWaterMark: function (e, t, r, i) {
        var n, o, a, s = (o = i, a = r, null != (n = t).highWaterMark ? n.highWaterMark : o ? n[a] : null);
        if (null == s) return e.objectMode ? 16 : 16384;
        if (!isFinite(s) || Math.floor(s) !== s || s < 0) throw new l(i ? r : "highWaterMark", s);
        return Math.floor(s)
      }
    }
  }, {"../../../errors": 48}],
  61: [function (e, t, r) {
    t.exports = e("events").EventEmitter
  }, {events: 108}],
  62: [function (e, t, r) {
    (((r = t.exports = e("./lib/_stream_readable.js")).Stream = r).Readable = r).Writable = e("./lib/_stream_writable.js"), r.Duplex = e("./lib/_stream_duplex.js"), r.Transform = e("./lib/_stream_transform.js"), r.PassThrough = e("./lib/_stream_passthrough.js"), r.finished = e("./lib/internal/streams/end-of-stream.js"), r.pipeline = e("./lib/internal/streams/pipeline.js")
  }, {
    "./lib/_stream_duplex.js": 49,
    "./lib/_stream_passthrough.js": 50,
    "./lib/_stream_readable.js": 51,
    "./lib/_stream_transform.js": 52,
    "./lib/_stream_writable.js": 53,
    "./lib/internal/streams/end-of-stream.js": 57,
    "./lib/internal/streams/pipeline.js": 59
  }],
  63: [function (e, t, r) {
    (function (o) {
      t.exports = function (e, t) {
        for (var r = Math.min(e.length, t.length), i = new o(r), n = 0; n < r; ++n) i[n] = e[n] ^ t[n];
        return i
      }
    }).call(this, e("buffer").Buffer)
  }, {buffer: 64}],
  64: [function (e, t, r) {
    "use strict";
    var i = e("base64-js"), o = e("ieee754");
    r.Buffer = h, r.SlowBuffer = function (e) {
      +e != e && (e = 0);
      return h.alloc(+e)
    }, r.INSPECT_MAX_BYTES = 50;
    var n = 2147483647;

    function a(e) {
      if (n < e) throw new RangeError('The value "' + e + '" is invalid for option "size"');
      var t = new Uint8Array(e);
      return t.__proto__ = h.prototype, t
    }

    function h(e, t, r) {
      if ("number" != typeof e) return s(e, t, r);
      if ("string" == typeof t) throw new TypeError('The "string" argument must be of type string. Received type number');
      return u(e)
    }

    function s(e, t, r) {
      if ("string" == typeof e) return function (e, t) {
        "string" == typeof t && "" !== t || (t = "utf8");
        if (!h.isEncoding(t)) throw new TypeError("Unknown encoding: " + t);
        var r = 0 | f(e, t), i = a(r), n = i.write(e, t);
        n !== r && (i = i.slice(0, n));
        return i
      }(e, t);
      if (ArrayBuffer.isView(e)) return c(e);
      if (null == e) throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
      if (U(e, ArrayBuffer) || e && U(e.buffer, ArrayBuffer)) return function (e, t, r) {
        if (t < 0 || e.byteLength < t) throw new RangeError('"offset" is outside of buffer bounds');
        if (e.byteLength < t + (r || 0)) throw new RangeError('"length" is outside of buffer bounds');
        var i;
        i = void 0 === t && void 0 === r ? new Uint8Array(e) : void 0 === r ? new Uint8Array(e, t) : new Uint8Array(e, t, r);
        return i.__proto__ = h.prototype, i
      }(e, t, r);
      if ("number" == typeof e) throw new TypeError('The "value" argument must not be of type number. Received type number');
      var i = e.valueOf && e.valueOf();
      if (null != i && i !== e) return h.from(i, t, r);
      var n = function (e) {
        if (h.isBuffer(e)) {
          var t = 0 | d(e.length), r = a(t);
          return 0 === r.length ? r : (e.copy(r, 0, 0, t), r)
        }
        if (void 0 !== e.length) return "number" != typeof e.length || N(e.length) ? a(0) : c(e);
        if ("Buffer" === e.type && Array.isArray(e.data)) return c(e.data)
      }(e);
      if (n) return n;
      if ("undefined" != typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e[Symbol.toPrimitive]) return h.from(e[Symbol.toPrimitive]("string"), t, r);
      throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e)
    }

    function l(e) {
      if ("number" != typeof e) throw new TypeError('"size" argument must be of type number');
      if (e < 0) throw new RangeError('The value "' + e + '" is invalid for option "size"')
    }

    function u(e) {
      return l(e), a(e < 0 ? 0 : 0 | d(e))
    }

    function c(e) {
      for (var t = e.length < 0 ? 0 : 0 | d(e.length), r = a(t), i = 0; i < t; i += 1) r[i] = 255 & e[i];
      return r
    }

    function d(e) {
      if (n <= e) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + n.toString(16) + " bytes");
      return 0 | e
    }

    function f(e, t) {
      if (h.isBuffer(e)) return e.length;
      if (ArrayBuffer.isView(e) || U(e, ArrayBuffer)) return e.byteLength;
      if ("string" != typeof e) throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e);
      var r = e.length, i = 2 < arguments.length && !0 === arguments[2];
      if (!i && 0 === r) return 0;
      for (var n = !1; ;) switch (t) {
        case"ascii":
        case"latin1":
        case"binary":
          return r;
        case"utf8":
        case"utf-8":
          return D(e).length;
        case"ucs2":
        case"ucs-2":
        case"utf16le":
        case"utf-16le":
          return 2 * r;
        case"hex":
          return r >>> 1;
        case"base64":
          return B(e).length;
        default:
          if (n) return i ? -1 : D(e).length;
          t = ("" + t).toLowerCase(), n = !0
      }
    }

    function p(e, t, r) {
      var i = e[t];
      e[t] = e[r], e[r] = i
    }

    function y(e, t, r, i, n) {
      if (0 === e.length) return -1;
      if ("string" == typeof r ? (i = r, r = 0) : 2147483647 < r ? r = 2147483647 : r < -2147483648 && (r = -2147483648), N(r = +r) && (r = n ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
        if (n) return -1;
        r = e.length - 1
      } else if (r < 0) {
        if (!n) return -1;
        r = 0
      }
      if ("string" == typeof t && (t = h.from(t, i)), h.isBuffer(t)) return 0 === t.length ? -1 : m(e, t, r, i, n);
      if ("number" == typeof t) return t &= 255, "function" == typeof Uint8Array.prototype.indexOf ? n ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : m(e, [t], r, i, n);
      throw new TypeError("val must be string, number or Buffer")
    }

    function m(e, t, r, i, n) {
      var o = 1, a = e.length, s = t.length;
      if (void 0 !== i && ("ucs2" === (i = String(i).toLowerCase()) || "ucs-2" === i || "utf16le" === i || "utf-16le" === i)) {
        if (e.length < 2 || t.length < 2) return -1;
        a /= o = 2, s /= 2, r /= 2
      }

      function l(e, t) {
        return 1 === o ? e[t] : e.readUInt16BE(t * o)
      }

      if (n) for (var u = -1, c = r; c < a; c++) if (l(e, c) === l(t, -1 === u ? 0 : c - u)) {
        if (-1 === u && (u = c), c - u + 1 === s) return u * o
      } else -1 !== u && (c -= c - u), u = -1; else for (a < r + s && (r = a - s), c = r; 0 <= c; c--) {
        for (var h = !0, d = 0; d < s; d++) if (l(e, c + d) !== l(t, d)) {
          h = !1;
          break
        }
        if (h) return c
      }
      return -1
    }

    function g(e, t, r, i) {
      r = Number(r) || 0;
      var n = e.length - r;
      (!i || n < (i = Number(i))) && (i = n);
      var o = t.length;
      o / 2 < i && (i = o / 2);
      for (var a = 0; a < i; ++a) {
        var s = parseInt(t.substr(2 * a, 2), 16);
        if (N(s)) return a;
        e[r + a] = s
      }
      return a
    }

    function b(e, t, r, i) {
      return O(function (e) {
        for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
        return t
      }(t), e, r, i)
    }

    function v(e, t, r, i) {
      return O(function (e, t) {
        for (var r, i, n, o = [], a = 0; a < e.length && !((t -= 2) < 0); ++a) r = e.charCodeAt(a), i = r >> 8, n = r % 256, o.push(n), o.push(i);
        return o
      }(t, e.length - r), e, r, i)
    }

    function _(e, t, r) {
      return 0 === t && r === e.length ? i.fromByteArray(e) : i.fromByteArray(e.slice(t, r))
    }

    function w(e, t, r) {
      r = Math.min(e.length, r);
      for (var i = [], n = t; n < r;) {
        var o, a, s, l, u = e[n], c = null, h = 239 < u ? 4 : 223 < u ? 3 : 191 < u ? 2 : 1;
        if (n + h <= r) switch (h) {
          case 1:
            u < 128 && (c = u);
            break;
          case 2:
            128 == (192 & (o = e[n + 1])) && 127 < (l = (31 & u) << 6 | 63 & o) && (c = l);
            break;
          case 3:
            o = e[n + 1], a = e[n + 2], 128 == (192 & o) && 128 == (192 & a) && 2047 < (l = (15 & u) << 12 | (63 & o) << 6 | 63 & a) && (l < 55296 || 57343 < l) && (c = l);
            break;
          case 4:
            o = e[n + 1], a = e[n + 2], s = e[n + 3], 128 == (192 & o) && 128 == (192 & a) && 128 == (192 & s) && 65535 < (l = (15 & u) << 18 | (63 & o) << 12 | (63 & a) << 6 | 63 & s) && l < 1114112 && (c = l)
        }
        null === c ? (c = 65533, h = 1) : 65535 < c && (c -= 65536, i.push(c >>> 10 & 1023 | 55296), c = 56320 | 1023 & c), i.push(c), n += h
      }
      return function (e) {
        var t = e.length;
        if (t <= S) return String.fromCharCode.apply(String, e);
        var r = "", i = 0;
        for (; i < t;) r += String.fromCharCode.apply(String, e.slice(i, i += S));
        return r
      }(i)
    }

    r.kMaxLength = n, (h.TYPED_ARRAY_SUPPORT = function () {
      try {
        var e = new Uint8Array(1);
        return e.__proto__ = {
          __proto__: Uint8Array.prototype, foo: function () {
            return 42
          }
        }, 42 === e.foo()
      } catch (e) {
        return !1
      }
    }()) || "undefined" == typeof console || "function" != typeof console.error || console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(h.prototype, "parent", {
      enumerable: !0,
      get: function () {
        if (h.isBuffer(this)) return this.buffer
      }
    }), Object.defineProperty(h.prototype, "offset", {
      enumerable: !0, get: function () {
        if (h.isBuffer(this)) return this.byteOffset
      }
    }), "undefined" != typeof Symbol && null != Symbol.species && h[Symbol.species] === h && Object.defineProperty(h, Symbol.species, {
      value: null,
      configurable: !0,
      enumerable: !1,
      writable: !1
    }), h.poolSize = 8192, h.from = s, h.prototype.__proto__ = Uint8Array.prototype, h.__proto__ = Uint8Array, h.alloc = function (e, t, r) {
      return n = t, o = r, l(i = e), i <= 0 || void 0 === n ? a(i) : "string" == typeof o ? a(i).fill(n, o) : a(i).fill(n);
      var i, n, o
    }, h.allocUnsafe = u, h.allocUnsafeSlow = u, h.isBuffer = function (e) {
      return null != e && !0 === e._isBuffer && e !== h.prototype
    }, h.compare = function (e, t) {
      if (U(e, Uint8Array) && (e = h.from(e, e.offset, e.byteLength)), U(t, Uint8Array) && (t = h.from(t, t.offset, t.byteLength)), !h.isBuffer(e) || !h.isBuffer(t)) throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
      if (e === t) return 0;
      for (var r = e.length, i = t.length, n = 0, o = Math.min(r, i); n < o; ++n) if (e[n] !== t[n]) {
        r = e[n], i = t[n];
        break
      }
      return r < i ? -1 : i < r ? 1 : 0
    }, h.isEncoding = function (e) {
      switch (String(e).toLowerCase()) {
        case"hex":
        case"utf8":
        case"utf-8":
        case"ascii":
        case"latin1":
        case"binary":
        case"base64":
        case"ucs2":
        case"ucs-2":
        case"utf16le":
        case"utf-16le":
          return !0;
        default:
          return !1
      }
    }, h.concat = function (e, t) {
      if (!Array.isArray(e)) throw new TypeError('"list" argument must be an Array of Buffers');
      if (0 === e.length) return h.alloc(0);
      if (void 0 === t) for (n = t = 0; n < e.length; ++n) t += e[n].length;
      for (var r = h.allocUnsafe(t), i = 0, n = 0; n < e.length; ++n) {
        var o = e[n];
        if (U(o, Uint8Array) && (o = h.from(o)), !h.isBuffer(o)) throw new TypeError('"list" argument must be an Array of Buffers');
        o.copy(r, i), i += o.length
      }
      return r
    }, h.byteLength = f, h.prototype._isBuffer = !0, h.prototype.swap16 = function () {
      var e = this.length;
      if (e % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (var t = 0; t < e; t += 2) p(this, t, t + 1);
      return this
    }, h.prototype.swap32 = function () {
      var e = this.length;
      if (e % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (var t = 0; t < e; t += 4) p(this, t, t + 3), p(this, t + 1, t + 2);
      return this
    }, h.prototype.swap64 = function () {
      var e = this.length;
      if (e % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (var t = 0; t < e; t += 8) p(this, t, t + 7), p(this, t + 1, t + 6), p(this, t + 2, t + 5), p(this, t + 3, t + 4);
      return this
    }, h.prototype.toLocaleString = h.prototype.toString = function () {
      var e = this.length;
      return 0 === e ? "" : 0 === arguments.length ? w(this, 0, e) : function (e, t, r) {
        var i = !1;
        if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
        if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
        if ((r >>>= 0) <= (t >>>= 0)) return "";
        for (e = e || "utf8"; ;) switch (e) {
          case"hex":
            return T(this, t, r);
          case"utf8":
          case"utf-8":
            return w(this, t, r);
          case"ascii":
            return E(this, t, r);
          case"latin1":
          case"binary":
            return x(this, t, r);
          case"base64":
            return _(this, t, r);
          case"ucs2":
          case"ucs-2":
          case"utf16le":
          case"utf-16le":
            return M(this, t, r);
          default:
            if (i) throw new TypeError("Unknown encoding: " + e);
            e = (e + "").toLowerCase(), i = !0
        }
      }.apply(this, arguments)
    }, h.prototype.equals = function (e) {
      if (!h.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
      return this === e || 0 === h.compare(this, e)
    }, h.prototype.inspect = function () {
      var e = "", t = r.INSPECT_MAX_BYTES, e = this.toString("hex", 0, t).replace(/(.{2})/g, "$1 ").trim();
      return this.length > t && (e += " ... "), "<Buffer " + e + ">"
    }, h.prototype.compare = function (e, t, r, i, n) {
      if (U(e, Uint8Array) && (e = h.from(e, e.offset, e.byteLength)), !h.isBuffer(e)) throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
      if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === i && (i = 0), void 0 === n && (n = this.length), t < 0 || r > e.length || i < 0 || n > this.length) throw new RangeError("out of range index");
      if (n <= i && r <= t) return 0;
      if (n <= i) return -1;
      if (r <= t) return 1;
      if (this === e) return 0;
      for (var o = (n >>>= 0) - (i >>>= 0), a = (r >>>= 0) - (t >>>= 0), s = Math.min(o, a), l = this.slice(i, n), u = e.slice(t, r), c = 0; c < s; ++c) if (l[c] !== u[c]) {
        o = l[c], a = u[c];
        break
      }
      return o < a ? -1 : a < o ? 1 : 0
    }, h.prototype.includes = function (e, t, r) {
      return -1 !== this.indexOf(e, t, r)
    }, h.prototype.indexOf = function (e, t, r) {
      return y(this, e, t, r, !0)
    }, h.prototype.lastIndexOf = function (e, t, r) {
      return y(this, e, t, r, !1)
    }, h.prototype.write = function (e, t, r, i) {
      if (void 0 === t) i = "utf8", r = this.length, t = 0; else if (void 0 === r && "string" == typeof t) i = t, r = this.length, t = 0; else {
        if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
        t >>>= 0, isFinite(r) ? (r >>>= 0, void 0 === i && (i = "utf8")) : (i = r, r = void 0)
      }
      var n = this.length - t;
      if ((void 0 === r || n < r) && (r = n), 0 < e.length && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
      i = i || "utf8";
      for (var o, a, s, l, u, c, h = !1; ;) switch (i) {
        case"hex":
          return g(this, e, t, r);
        case"utf8":
        case"utf-8":
          return u = t, c = r, O(D(e, (l = this).length - u), l, u, c);
        case"ascii":
          return b(this, e, t, r);
        case"latin1":
        case"binary":
          return b(this, e, t, r);
        case"base64":
          return o = this, a = t, s = r, O(B(e), o, a, s);
        case"ucs2":
        case"ucs-2":
        case"utf16le":
        case"utf-16le":
          return v(this, e, t, r);
        default:
          if (h) throw new TypeError("Unknown encoding: " + i);
          i = ("" + i).toLowerCase(), h = !0
      }
    }, h.prototype.toJSON = function () {
      return {type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0)}
    };
    var S = 4096;

    function E(e, t, r) {
      var i = "";
      r = Math.min(e.length, r);
      for (var n = t; n < r; ++n) i += String.fromCharCode(127 & e[n]);
      return i
    }

    function x(e, t, r) {
      var i = "";
      r = Math.min(e.length, r);
      for (var n = t; n < r; ++n) i += String.fromCharCode(e[n]);
      return i
    }

    function T(e, t, r) {
      var i = e.length;
      (!t || t < 0) && (t = 0), (!r || r < 0 || i < r) && (r = i);
      for (var n = "", o = t; o < r; ++o) n += L(e[o]);
      return n
    }

    function M(e, t, r) {
      for (var i = e.slice(t, r), n = "", o = 0; o < i.length; o += 2) n += String.fromCharCode(i[o] + 256 * i[o + 1]);
      return n
    }

    function k(e, t, r) {
      if (e % 1 != 0 || e < 0) throw new RangeError("offset is not uint");
      if (r < e + t) throw new RangeError("Trying to access beyond buffer length")
    }

    function P(e, t, r, i, n, o) {
      if (!h.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (n < t || t < o) throw new RangeError('"value" argument is out of bounds');
      if (r + i > e.length) throw new RangeError("Index out of range")
    }

    function C(e, t, r, i) {
      if (r + i > e.length) throw new RangeError("Index out of range");
      if (r < 0) throw new RangeError("Index out of range")
    }

    function A(e, t, r, i, n) {
      return t = +t, r >>>= 0, n || C(e, 0, r, 4), o.write(e, t, r, i, 23, 4), r + 4
    }

    function I(e, t, r, i, n) {
      return t = +t, r >>>= 0, n || C(e, 0, r, 8), o.write(e, t, r, i, 52, 8), r + 8
    }

    h.prototype.slice = function (e, t) {
      var r = this.length;
      (e = ~~e) < 0 ? (e += r) < 0 && (e = 0) : r < e && (e = r), (t = void 0 === t ? r : ~~t) < 0 ? (t += r) < 0 && (t = 0) : r < t && (t = r), t < e && (t = e);
      var i = this.subarray(e, t);
      return i.__proto__ = h.prototype, i
    }, h.prototype.readUIntLE = function (e, t, r) {
      e >>>= 0, t >>>= 0, r || k(e, t, this.length);
      for (var i = this[e], n = 1, o = 0; ++o < t && (n *= 256);) i += this[e + o] * n;
      return i
    }, h.prototype.readUIntBE = function (e, t, r) {
      e >>>= 0, t >>>= 0, r || k(e, t, this.length);
      for (var i = this[e + --t], n = 1; 0 < t && (n *= 256);) i += this[e + --t] * n;
      return i
    }, h.prototype.readUInt8 = function (e, t) {
      return e >>>= 0, t || k(e, 1, this.length), this[e]
    }, h.prototype.readUInt16LE = function (e, t) {
      return e >>>= 0, t || k(e, 2, this.length), this[e] | this[e + 1] << 8
    }, h.prototype.readUInt16BE = function (e, t) {
      return e >>>= 0, t || k(e, 2, this.length), this[e] << 8 | this[e + 1]
    }, h.prototype.readUInt32LE = function (e, t) {
      return e >>>= 0, t || k(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
    }, h.prototype.readUInt32BE = function (e, t) {
      return e >>>= 0, t || k(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
    }, h.prototype.readIntLE = function (e, t, r) {
      e >>>= 0, t >>>= 0, r || k(e, t, this.length);
      for (var i = this[e], n = 1, o = 0; ++o < t && (n *= 256);) i += this[e + o] * n;
      return (n *= 128) <= i && (i -= Math.pow(2, 8 * t)), i
    }, h.prototype.readIntBE = function (e, t, r) {
      e >>>= 0, t >>>= 0, r || k(e, t, this.length);
      for (var i = t, n = 1, o = this[e + --i]; 0 < i && (n *= 256);) o += this[e + --i] * n;
      return (n *= 128) <= o && (o -= Math.pow(2, 8 * t)), o
    }, h.prototype.readInt8 = function (e, t) {
      return e >>>= 0, t || k(e, 1, this.length), 128 & this[e] ? -1 * (255 - this[e] + 1) : this[e]
    }, h.prototype.readInt16LE = function (e, t) {
      e >>>= 0, t || k(e, 2, this.length);
      var r = this[e] | this[e + 1] << 8;
      return 32768 & r ? 4294901760 | r : r
    }, h.prototype.readInt16BE = function (e, t) {
      e >>>= 0, t || k(e, 2, this.length);
      var r = this[e + 1] | this[e] << 8;
      return 32768 & r ? 4294901760 | r : r
    }, h.prototype.readInt32LE = function (e, t) {
      return e >>>= 0, t || k(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
    }, h.prototype.readInt32BE = function (e, t) {
      return e >>>= 0, t || k(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
    }, h.prototype.readFloatLE = function (e, t) {
      return e >>>= 0, t || k(e, 4, this.length), o.read(this, e, !0, 23, 4)
    }, h.prototype.readFloatBE = function (e, t) {
      return e >>>= 0, t || k(e, 4, this.length), o.read(this, e, !1, 23, 4)
    }, h.prototype.readDoubleLE = function (e, t) {
      return e >>>= 0, t || k(e, 8, this.length), o.read(this, e, !0, 52, 8)
    }, h.prototype.readDoubleBE = function (e, t) {
      return e >>>= 0, t || k(e, 8, this.length), o.read(this, e, !1, 52, 8)
    }, h.prototype.writeUIntLE = function (e, t, r, i) {
      e = +e, t >>>= 0, r >>>= 0, i || P(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
      var n = 1, o = 0;
      for (this[t] = 255 & e; ++o < r && (n *= 256);) this[t + o] = e / n & 255;
      return t + r
    }, h.prototype.writeUIntBE = function (e, t, r, i) {
      e = +e, t >>>= 0, r >>>= 0, i || P(this, e, t, r, Math.pow(2, 8 * r) - 1, 0);
      var n = r - 1, o = 1;
      for (this[t + n] = 255 & e; 0 <= --n && (o *= 256);) this[t + n] = e / o & 255;
      return t + r
    }, h.prototype.writeUInt8 = function (e, t, r) {
      return e = +e, t >>>= 0, r || P(this, e, t, 1, 255, 0), this[t] = 255 & e, t + 1
    }, h.prototype.writeUInt16LE = function (e, t, r) {
      return e = +e, t >>>= 0, r || P(this, e, t, 2, 65535, 0), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2
    }, h.prototype.writeUInt16BE = function (e, t, r) {
      return e = +e, t >>>= 0, r || P(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2
    }, h.prototype.writeUInt32LE = function (e, t, r) {
      return e = +e, t >>>= 0, r || P(this, e, t, 4, 4294967295, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e, t + 4
    }, h.prototype.writeUInt32BE = function (e, t, r) {
      return e = +e, t >>>= 0, r || P(this, e, t, 4, 4294967295, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4
    }, h.prototype.writeIntLE = function (e, t, r, i) {
      var n;
      e = +e, t >>>= 0, i || P(this, e, t, r, (n = Math.pow(2, 8 * r - 1)) - 1, -n);
      var o = 0, a = 1, s = 0;
      for (this[t] = 255 & e; ++o < r && (a *= 256);) e < 0 && 0 === s && 0 !== this[t + o - 1] && (s = 1), this[t + o] = (e / a >> 0) - s & 255;
      return t + r
    }, h.prototype.writeIntBE = function (e, t, r, i) {
      var n;
      e = +e, t >>>= 0, i || P(this, e, t, r, (n = Math.pow(2, 8 * r - 1)) - 1, -n);
      var o = r - 1, a = 1, s = 0;
      for (this[t + o] = 255 & e; 0 <= --o && (a *= 256);) e < 0 && 0 === s && 0 !== this[t + o + 1] && (s = 1), this[t + o] = (e / a >> 0) - s & 255;
      return t + r
    }, h.prototype.writeInt8 = function (e, t, r) {
      return e = +e, t >>>= 0, r || P(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
    }, h.prototype.writeInt16LE = function (e, t, r) {
      return e = +e, t >>>= 0, r || P(this, e, t, 2, 32767, -32768), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2
    }, h.prototype.writeInt16BE = function (e, t, r) {
      return e = +e, t >>>= 0, r || P(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2
    }, h.prototype.writeInt32LE = function (e, t, r) {
      return e = +e, t >>>= 0, r || P(this, e, t, 4, 2147483647, -2147483648), this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4
    }, h.prototype.writeInt32BE = function (e, t, r) {
      return e = +e, t >>>= 0, r || P(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4
    }, h.prototype.writeFloatLE = function (e, t, r) {
      return A(this, e, t, !0, r)
    }, h.prototype.writeFloatBE = function (e, t, r) {
      return A(this, e, t, !1, r)
    }, h.prototype.writeDoubleLE = function (e, t, r) {
      return I(this, e, t, !0, r)
    }, h.prototype.writeDoubleBE = function (e, t, r) {
      return I(this, e, t, !1, r)
    }, h.prototype.copy = function (e, t, r, i) {
      if (!h.isBuffer(e)) throw new TypeError("argument should be a Buffer");
      if (r = r || 0, i || 0 === i || (i = this.length), t >= e.length && (t = e.length), t = t || 0, 0 < i && i < r && (i = r), i === r) return 0;
      if (0 === e.length || 0 === this.length) return 0;
      if (t < 0) throw new RangeError("targetStart out of bounds");
      if (r < 0 || r >= this.length) throw new RangeError("Index out of range");
      if (i < 0) throw new RangeError("sourceEnd out of bounds");
      i > this.length && (i = this.length), e.length - t < i - r && (i = e.length - t + r);
      var n = i - r;
      if (this === e && "function" == typeof Uint8Array.prototype.copyWithin) this.copyWithin(t, r, i); else if (this === e && r < t && t < i) for (var o = n - 1; 0 <= o; --o) e[o + t] = this[o + r]; else Uint8Array.prototype.set.call(e, this.subarray(r, i), t);
      return n
    }, h.prototype.fill = function (e, t, r, i) {
      if ("string" == typeof e) {
        if ("string" == typeof t ? (i = t, t = 0, r = this.length) : "string" == typeof r && (i = r, r = this.length), void 0 !== i && "string" != typeof i) throw new TypeError("encoding must be a string");
        if ("string" == typeof i && !h.isEncoding(i)) throw new TypeError("Unknown encoding: " + i);
        var n;
        1 === e.length && (n = e.charCodeAt(0), ("utf8" === i && n < 128 || "latin1" === i) && (e = n))
      } else "number" == typeof e && (e &= 255);
      if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
      if (r <= t) return this;
      var o;
      if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, "number" == typeof (e = e || 0)) for (o = t; o < r; ++o) this[o] = e; else {
        var a = h.isBuffer(e) ? e : h.from(e, i), s = a.length;
        if (0 === s) throw new TypeError('The value "' + e + '" is invalid for argument "value"');
        for (o = 0; o < r - t; ++o) this[o + t] = a[o % s]
      }
      return this
    };
    var R = /[^+/0-9A-Za-z-_]/g;

    function L(e) {
      return e < 16 ? "0" + e.toString(16) : e.toString(16)
    }

    function D(e, t) {
      var r;
      t = t || 1 / 0;
      for (var i = e.length, n = null, o = [], a = 0; a < i; ++a) {
        if (55295 < (r = e.charCodeAt(a)) && r < 57344) {
          if (!n) {
            if (56319 < r) {
              -1 < (t -= 3) && o.push(239, 191, 189);
              continue
            }
            if (a + 1 === i) {
              -1 < (t -= 3) && o.push(239, 191, 189);
              continue
            }
            n = r;
            continue
          }
          if (r < 56320) {
            -1 < (t -= 3) && o.push(239, 191, 189), n = r;
            continue
          }
          r = 65536 + (n - 55296 << 10 | r - 56320)
        } else n && -1 < (t -= 3) && o.push(239, 191, 189);
        if (n = null, r < 128) {
          if (--t < 0) break;
          o.push(r)
        } else if (r < 2048) {
          if ((t -= 2) < 0) break;
          o.push(r >> 6 | 192, 63 & r | 128)
        } else if (r < 65536) {
          if ((t -= 3) < 0) break;
          o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
        } else {
          if (!(r < 1114112)) throw new Error("Invalid code point");
          if ((t -= 4) < 0) break;
          o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
        }
      }
      return o
    }

    function B(e) {
      return i.toByteArray(function (e) {
        if ((e = (e = e.split("=")[0]).trim().replace(R, "")).length < 2) return "";
        for (; e.length % 4 != 0;) e += "=";
        return e
      }(e))
    }

    function O(e, t, r, i) {
      for (var n = 0; n < i && !(n + r >= t.length || n >= e.length); ++n) t[n + r] = e[n];
      return n
    }

    function U(e, t) {
      return e instanceof t || null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === t.name
    }

    function N(e) {
      return e != e
    }
  }, {"base64-js": 16, ieee754: 141}],
  65: [function (e, t, r) {
    var n = e("safe-buffer").Buffer, i = e("stream").Transform, o = e("string_decoder").StringDecoder;

    function a(e) {
      i.call(this), this.hashMode = "string" == typeof e, this.hashMode ? this[e] = this._finalOrDigest : this["final"] = this._finalOrDigest, this._final && (this.__final = this._final, this._final = null), this._decoder = null, this._encoding = null
    }

    e("inherits")(a, i), a.prototype.update = function (e, t, r) {
      "string" == typeof e && (e = n.from(e, t));
      var i = this._update(e);
      return this.hashMode ? this : (r && (i = this._toString(i, r)), i)
    }, a.prototype.setAutoPadding = function () {
    }, a.prototype.getAuthTag = function () {
      throw new Error("trying to get auth tag in unsupported state")
    }, a.prototype.setAuthTag = function () {
      throw new Error("trying to set auth tag in unsupported state")
    }, a.prototype.setAAD = function () {
      throw new Error("trying to set aad in unsupported state")
    }, a.prototype._transform = function (e, t, r) {
      var i;
      try {
        this.hashMode ? this._update(e) : this.push(this._update(e))
      } catch (e) {
        i = e
      } finally {
        r(i)
      }
    }, a.prototype._flush = function (e) {
      var t;
      try {
        this.push(this.__final())
      } catch (e) {
        t = e
      }
      e(t)
    }, a.prototype._finalOrDigest = function (e) {
      var t = this.__final() || n.alloc(0);
      return e && (t = this._toString(t, e, !0)), t
    }, a.prototype._toString = function (e, t, r) {
      if (this._decoder || (this._decoder = new o(t), this._encoding = t), this._encoding !== t) throw new Error("can't switch encodings");
      var i = this._decoder.write(e);
      return r && (i += this._decoder.end()), i
    }, t.exports = a
  }, {inherits: 142, "safe-buffer": 186, stream: 195, string_decoder: 196}],
  66: [function (e, t, r) {
    (function (e) {
      function t(e) {
        return Object.prototype.toString.call(e)
      }

      r.isArray = function (e) {
        return Array.isArray ? Array.isArray(e) : "[object Array]" === t(e)
      }, r.isBoolean = function (e) {
        return "boolean" == typeof e
      }, r.isNull = function (e) {
        return null === e
      }, r.isNullOrUndefined = function (e) {
        return null == e
      }, r.isNumber = function (e) {
        return "number" == typeof e
      }, r.isString = function (e) {
        return "string" == typeof e
      }, r.isSymbol = function (e) {
        return "symbol" == typeof e
      }, r.isUndefined = function (e) {
        return void 0 === e
      }, r.isRegExp = function (e) {
        return "[object RegExp]" === t(e)
      }, r.isObject = function (e) {
        return "object" == typeof e && null !== e
      }, r.isDate = function (e) {
        return "[object Date]" === t(e)
      }, r.isError = function (e) {
        return "[object Error]" === t(e) || e instanceof Error
      }, r.isFunction = function (e) {
        return "function" == typeof e
      }, r.isPrimitive = function (e) {
        return null === e || "boolean" == typeof e || "number" == typeof e || "string" == typeof e || "symbol" == typeof e || void 0 === e
      }, r.isBuffer = e.isBuffer
    }).call(this, {isBuffer: e("../../is-buffer/index.js")})
  }, {"../../is-buffer/index.js": 143}],
  67: [function (e, s, t) {
    (function (o) {
      var t = e("elliptic"), i = e("bn.js");
      s.exports = function (e) {
        return new n(e)
      };
      var r = {
        secp256k1: {name: "secp256k1", byteLength: 32},
        secp224r1: {name: "p224", byteLength: 28},
        prime256v1: {name: "p256", byteLength: 32},
        prime192v1: {name: "p192", byteLength: 24},
        ed25519: {name: "ed25519", byteLength: 32},
        secp384r1: {name: "p384", byteLength: 48},
        secp521r1: {name: "p521", byteLength: 66}
      };

      function n(e) {
        this.curveType = r[e], this.curveType || (this.curveType = {name: e}), this.curve = new t.ec(this.curveType.name), this.keys = void 0
      }

      function a(e, t, r) {
        Array.isArray(e) || (e = e.toArray());
        var i, n = new o(e);
        return r && n.length < r && ((i = new o(r - n.length)).fill(0), n = o.concat([i, n])), t ? n.toString(t) : n
      }

      r.p224 = r.secp224r1, r.p256 = r.secp256r1 = r.prime256v1, r.p192 = r.secp192r1 = r.prime192v1, r.p384 = r.secp384r1, r.p521 = r.secp521r1, n.prototype.generateKeys = function (e, t) {
        return this.keys = this.curve.genKeyPair(), this.getPublicKey(e, t)
      }, n.prototype.computeSecret = function (e, t, r) {
        return t = t || "utf8", o.isBuffer(e) || (e = new o(e, t)), a(this.curve.keyFromPublic(e).getPublic().mul(this.keys.getPrivate()).getX(), r, this.curveType.byteLength)
      }, n.prototype.getPublicKey = function (e, t) {
        var r = this.keys.getPublic("compressed" === t, !0);
        return "hybrid" === t && (r[r.length - 1] % 2 ? r[0] = 7 : r[0] = 6), a(r, e)
      }, n.prototype.getPrivateKey = function (e) {
        return a(this.keys.getPrivate(), e)
      }, n.prototype.setPublicKey = function (e, t) {
        return t = t || "utf8", o.isBuffer(e) || (e = new o(e, t)), this.keys._importPublic(e), this
      }, n.prototype.setPrivateKey = function (e, t) {
        t = t || "utf8", o.isBuffer(e) || (e = new o(e, t));
        var r = (r = new i(e)).toString(16);
        return this.keys = this.curve.genKeyPair(), this.keys._importPrivate(r), this
      }
    }).call(this, e("buffer").Buffer)
  }, {"bn.js": 68, buffer: 64, elliptic: 91}],
  68: [function (e, t, r) {
    arguments[4][15][0].apply(r, arguments)
  }, {buffer: 19, dup: 15}],
  69: [function (e, t, r) {
    "use strict";
    var i = e("inherits"), n = e("md5.js"), o = e("ripemd160"), a = e("sha.js"), s = e("cipher-base");

    function l(e) {
      s.call(this, "digest"), this._hash = e
    }

    i(l, s), l.prototype._update = function (e) {
      this._hash.update(e)
    }, l.prototype._final = function () {
      return this._hash.digest()
    }, t.exports = function (e) {
      return "md5" === (e = e.toLowerCase()) ? new n : "rmd160" === e || "ripemd160" === e ? new o : new l(a(e))
    }
  }, {"cipher-base": 65, inherits: 142, "md5.js": 145, ripemd160: 185, "sha.js": 188}],
  70: [function (e, t, r) {
    var i = e("md5.js");
    t.exports = function (e) {
      return (new i).update(e).digest()
    }
  }, {"md5.js": 145}],
  71: [function (e, t, r) {
    "use strict";
    var i = e("inherits"), n = e("./legacy"), a = e("cipher-base"), s = e("safe-buffer").Buffer,
        o = e("create-hash/md5"), l = e("ripemd160"), u = e("sha.js"), c = s.alloc(128);

    function h(e, t) {
      a.call(this, "digest"), "string" == typeof t && (t = s.from(t));
      var r = "sha512" === e || "sha384" === e ? 128 : 64;
      this._alg = e, (this._key = t).length > r ? t = ("rmd160" === e ? new l : u(e)).update(t).digest() : t.length < r && (t = s.concat([t, c], r));
      for (var i = this._ipad = s.allocUnsafe(r), n = this._opad = s.allocUnsafe(r), o = 0; o < r; o++) i[o] = 54 ^ t[o], n[o] = 92 ^ t[o];
      this._hash = "rmd160" === e ? new l : u(e), this._hash.update(i)
    }

    i(h, a), h.prototype._update = function (e) {
      this._hash.update(e)
    }, h.prototype._final = function () {
      var e = this._hash.digest();
      return ("rmd160" === this._alg ? new l : u(this._alg)).update(this._opad).update(e).digest()
    }, t.exports = function (e, t) {
      return "rmd160" === (e = e.toLowerCase()) || "ripemd160" === e ? new h("rmd160", t) : "md5" === e ? new n(o, t) : new h(e, t)
    }
  }, {
    "./legacy": 72,
    "cipher-base": 65,
    "create-hash/md5": 70,
    inherits: 142,
    ripemd160: 185,
    "safe-buffer": 186,
    "sha.js": 188
  }],
  72: [function (e, t, r) {
    "use strict";
    var i = e("inherits"), o = e("safe-buffer").Buffer, a = e("cipher-base"), s = o.alloc(128);

    function n(e, t) {
      a.call(this, "digest"), "string" == typeof t && (t = o.from(t)), this._alg = e, 64 < (this._key = t).length ? t = e(t) : t.length < 64 && (t = o.concat([t, s], 64));
      for (var r = this._ipad = o.allocUnsafe(64), i = this._opad = o.allocUnsafe(64), n = 0; n < 64; n++) r[n] = 54 ^ t[n], i[n] = 92 ^ t[n];
      this._hash = [r]
    }

    i(n, a), n.prototype._update = function (e) {
      this._hash.push(e)
    }, n.prototype._final = function () {
      var e = this._alg(o.concat(this._hash));
      return this._alg(o.concat([this._opad, e]))
    }, t.exports = n
  }, {"cipher-base": 65, inherits: 142, "safe-buffer": 186}],
  73: [function (e, t, r) {
    "use strict";
    r.randomBytes = r.rng = r.pseudoRandomBytes = r.prng = e("randombytes"), r.createHash = r.Hash = e("create-hash"), r.createHmac = r.Hmac = e("create-hmac");
    var i = e("browserify-sign/algos"), n = Object.keys(i),
        o = ["sha1", "sha224", "sha256", "sha384", "sha512", "md5", "rmd160"].concat(n);
    r.getHashes = function () {
      return o
    };
    var a = e("pbkdf2");
    r.pbkdf2 = a.pbkdf2, r.pbkdf2Sync = a.pbkdf2Sync;
    var s = e("browserify-cipher");
    r.Cipher = s.Cipher, r.createCipher = s.createCipher, r.Cipheriv = s.Cipheriv, r.createCipheriv = s.createCipheriv, r.Decipher = s.Decipher, r.createDecipher = s.createDecipher, r.Decipheriv = s.Decipheriv, r.createDecipheriv = s.createDecipheriv, r.getCiphers = s.getCiphers, r.listCiphers = s.listCiphers;
    var l = e("diffie-hellman");
    r.DiffieHellmanGroup = l.DiffieHellmanGroup, r.createDiffieHellmanGroup = l.createDiffieHellmanGroup, r.getDiffieHellman = l.getDiffieHellman, r.createDiffieHellman = l.createDiffieHellman, r.DiffieHellman = l.DiffieHellman;
    var u = e("browserify-sign");
    r.createSign = u.createSign, r.Sign = u.Sign, r.createVerify = u.createVerify, r.Verify = u.Verify, r.createECDH = e("create-ecdh");
    var c = e("public-encrypt");
    r.publicEncrypt = c.publicEncrypt, r.privateEncrypt = c.privateEncrypt, r.publicDecrypt = c.publicDecrypt, r.privateDecrypt = c.privateDecrypt;
    var h = e("randomfill");
    r.randomFill = h.randomFill, r.randomFillSync = h.randomFillSync, r.createCredentials = function () {
      throw new Error(["sorry, createCredentials is not implemented yet", "we accept pull requests", "https://github.com/crypto-browserify/crypto-browserify"].join("\n"))
    }, r.constants = {
      DH_CHECK_P_NOT_SAFE_PRIME: 2,
      DH_CHECK_P_NOT_PRIME: 1,
      DH_UNABLE_TO_CHECK_GENERATOR: 4,
      DH_NOT_SUITABLE_GENERATOR: 8,
      NPN_ENABLED: 1,
      ALPN_ENABLED: 1,
      RSA_PKCS1_PADDING: 1,
      RSA_SSLV23_PADDING: 2,
      RSA_NO_PADDING: 3,
      RSA_PKCS1_OAEP_PADDING: 4,
      RSA_X931_PADDING: 5,
      RSA_PKCS1_PSS_PADDING: 6,
      POINT_CONVERSION_COMPRESSED: 2,
      POINT_CONVERSION_UNCOMPRESSED: 4,
      POINT_CONVERSION_HYBRID: 6
    }
  }, {
    "browserify-cipher": 37,
    "browserify-sign": 45,
    "browserify-sign/algos": 42,
    "create-ecdh": 67,
    "create-hash": 69,
    "create-hmac": 71,
    "diffie-hellman": 86,
    pbkdf2: 155,
    "public-encrypt": 162,
    randombytes: 169,
    randomfill: 170
  }],
  74: [function (m, r, i) {
    (function (y) {
      var e, t;
      e = this, t = function () {
        var e = e || function (c) {
          var e;
          if ("undefined" != typeof window && window.crypto && (e = window.crypto), !e && "undefined" != typeof window && window.msCrypto && (e = window.msCrypto), !e && void 0 !== y && y.crypto && (e = y.crypto), !e && "function" == typeof m) try {
            e = m("crypto")
          } catch (e) {
          }

          function i() {
            if (e) {
              if ("function" == typeof e.getRandomValues) try {
                return e.getRandomValues(new Uint32Array(1))[0]
              } catch (e) {
              }
              if ("function" == typeof e.randomBytes) try {
                return e.randomBytes(4).readInt32LE()
              } catch (e) {
              }
            }
            throw new Error("Native crypto module could not be used to get secure random number.")
          }

          var r = Object.create || function (e) {
            var t;
            return n.prototype = e, t = new n, n.prototype = null, t
          };

          function n() {
          }

          var t = {}, o = t.lib = {}, a = o.Base = {
            extend: function (e) {
              var t = r(this);
              return e && t.mixIn(e), t.hasOwnProperty("init") && this.init !== t.init || (t.init = function () {
                t.$super.init.apply(this, arguments)
              }), (t.init.prototype = t).$super = this, t
            }, create: function () {
              var e = this.extend();
              return e.init.apply(e, arguments), e
            }, init: function () {
            }, mixIn: function (e) {
              for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
              e.hasOwnProperty("toString") && (this.toString = e.toString)
            }, clone: function () {
              return this.init.prototype.extend(this)
            }
          }, h = o.WordArray = a.extend({
            init: function (e, t) {
              e = this.words = e || [], this.sigBytes = null != t ? t : 4 * e.length
            }, toString: function (e) {
              return (e || l).stringify(this)
            }, concat: function (e) {
              var t = this.words, r = e.words, i = this.sigBytes, n = e.sigBytes;
              if (this.clamp(), i % 4) for (var o = 0; o < n; o++) {
                var a = r[o >>> 2] >>> 24 - o % 4 * 8 & 255;
                t[i + o >>> 2] |= a << 24 - (i + o) % 4 * 8
              } else for (o = 0; o < n; o += 4) t[i + o >>> 2] = r[o >>> 2];
              return this.sigBytes += n, this
            }, clamp: function () {
              var e = this.words, t = this.sigBytes;
              e[t >>> 2] &= 4294967295 << 32 - t % 4 * 8, e.length = c.ceil(t / 4)
            }, clone: function () {
              var e = a.clone.call(this);
              return e.words = this.words.slice(0), e
            }, random: function (e) {
              for (var t = [], r = 0; r < e; r += 4) t.push(i());
              return new h.init(t, e)
            }
          }), s = t.enc = {}, l = s.Hex = {
            stringify: function (e) {
              for (var t = e.words, r = e.sigBytes, i = [], n = 0; n < r; n++) {
                var o = t[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                i.push((o >>> 4).toString(16)), i.push((15 & o).toString(16))
              }
              return i.join("")
            }, parse: function (e) {
              for (var t = e.length, r = [], i = 0; i < t; i += 2) r[i >>> 3] |= parseInt(e.substr(i, 2), 16) << 24 - i % 8 * 4;
              return new h.init(r, t / 2)
            }
          }, u = s.Latin1 = {
            stringify: function (e) {
              for (var t = e.words, r = e.sigBytes, i = [], n = 0; n < r; n++) {
                var o = t[n >>> 2] >>> 24 - n % 4 * 8 & 255;
                i.push(String.fromCharCode(o))
              }
              return i.join("")
            }, parse: function (e) {
              for (var t = e.length, r = [], i = 0; i < t; i++) r[i >>> 2] |= (255 & e.charCodeAt(i)) << 24 - i % 4 * 8;
              return new h.init(r, t)
            }
          }, d = s.Utf8 = {
            stringify: function (e) {
              try {
                return decodeURIComponent(escape(u.stringify(e)))
              } catch (e) {
                throw new Error("Malformed UTF-8 data")
              }
            }, parse: function (e) {
              return u.parse(unescape(encodeURIComponent(e)))
            }
          }, f = o.BufferedBlockAlgorithm = a.extend({
            reset: function () {
              this._data = new h.init, this._nDataBytes = 0
            }, _append: function (e) {
              "string" == typeof e && (e = d.parse(e)), this._data.concat(e), this._nDataBytes += e.sigBytes
            }, _process: function (e) {
              var t, r = this._data, i = r.words, n = r.sigBytes, o = this.blockSize, a = n / (4 * o),
                  s = (a = e ? c.ceil(a) : c.max((0 | a) - this._minBufferSize, 0)) * o, l = c.min(4 * s, n);
              if (s) {
                for (var u = 0; u < s; u += o) this._doProcessBlock(i, u);
                t = i.splice(0, s), r.sigBytes -= l
              }
              return new h.init(t, l)
            }, clone: function () {
              var e = a.clone.call(this);
              return e._data = this._data.clone(), e
            }, _minBufferSize: 0
          }), p = (o.Hasher = f.extend({
            cfg: a.extend(), init: function (e) {
              this.cfg = this.cfg.extend(e), this.reset()
            }, reset: function () {
              f.reset.call(this), this._doReset()
            }, update: function (e) {
              return this._append(e), this._process(), this
            }, finalize: function (e) {
              return e && this._append(e), this._doFinalize()
            }, blockSize: 16, _createHelper: function (r) {
              return function (e, t) {
                return new r.init(t).finalize(e)
              }
            }, _createHmacHelper: function (r) {
              return function (e, t) {
                return new p.HMAC.init(r, t).finalize(e)
              }
            }
          }), t.algo = {});
          return t
        }(Math);
        return e
      }, "object" == typeof i ? r.exports = i = t() : "function" == typeof define && define.amd ? define([], t) : e.CryptoJS = t()
    }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
  }, {crypto: 73}],
  75: [function (e, t, r) {
    var i, n;
    i = this, n = function (e) {
      var u;
      return u = e.lib.WordArray, e.enc.Base64 = {
        stringify: function (e) {
          var t = e.words, r = e.sigBytes, i = this._map;
          e.clamp();
          for (var n = [], o = 0; o < r; o += 3) for (var a = (t[o >>> 2] >>> 24 - o % 4 * 8 & 255) << 16 | (t[o + 1 >>> 2] >>> 24 - (o + 1) % 4 * 8 & 255) << 8 | t[o + 2 >>> 2] >>> 24 - (o + 2) % 4 * 8 & 255, s = 0; s < 4 && o + .75 * s < r; s++) n.push(i.charAt(a >>> 6 * (3 - s) & 63));
          var l = i.charAt(64);
          if (l) for (; n.length % 4;) n.push(l);
          return n.join("")
        }, parse: function (e) {
          var t = e.length, r = this._map, i = this._reverseMap;
          if (!i) {
            i = this._reverseMap = [];
            for (var n = 0; n < r.length; n++) i[r.charCodeAt(n)] = n
          }
          var o, a = r.charAt(64);
          return !a || -1 !== (o = e.indexOf(a)) && (t = o), function (e, t, r) {
            for (var i = [], n = 0, o = 0; o < t; o++) {
              var a, s, l;
              o % 4 && (a = r[e.charCodeAt(o - 1)] << o % 4 * 2, s = r[e.charCodeAt(o)] >>> 6 - o % 4 * 2, l = a | s, i[n >>> 2] |= l << 24 - n % 4 * 8, n++)
            }
            return u.create(i, n)
          }(e, t, i)
        }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
      }, e.enc.Base64
    }, "object" == typeof r ? t.exports = r = n(e("crypto-js/core")) : "function" == typeof define && define.amd ? define(["crypto-js/core"], n) : n(i.CryptoJS)
  }, {"crypto-js/core": 74}],
  76: [function (e, t, r) {
    var i, n;
    i = this, n = function (e) {
      return e.enc.Utf8
    }, "object" == typeof r ? t.exports = r = n(e("crypto-js/core")) : "function" == typeof define && define.amd ? define(["crypto-js/core"], n) : n(i.CryptoJS)
  }, {"crypto-js/core": 74}],
  77: [function (e, t, r) {
    var i, n;
    i = this, n = function (e) {
      return e.HmacSHA1
    }, "object" == typeof r ? t.exports = r = n(e("crypto-js/core"), e("crypto-js/sha1"), e("crypto-js/hmac")) : "function" == typeof define && define.amd ? define(["crypto-js/core", "crypto-js/sha1", "crypto-js/hmac"], n) : n(i.CryptoJS)
  }, {"crypto-js/core": 74, "crypto-js/hmac": 78, "crypto-js/sha1": 79}],
  78: [function (e, t, r) {
    var i, n;
    i = this, n = function (e) {
      var t, u;
      t = e.lib.Base, u = e.enc.Utf8, e.algo.HMAC = t.extend({
        init: function (e, t) {
          e = this._hasher = new e.init, "string" == typeof t && (t = u.parse(t));
          var r = e.blockSize, i = 4 * r;
          t.sigBytes > i && (t = e.finalize(t)), t.clamp();
          for (var n = this._oKey = t.clone(), o = this._iKey = t.clone(), a = n.words, s = o.words, l = 0; l < r; l++) a[l] ^= 1549556828, s[l] ^= 909522486;
          n.sigBytes = o.sigBytes = i, this.reset()
        }, reset: function () {
          var e = this._hasher;
          e.reset(), e.update(this._iKey)
        }, update: function (e) {
          return this._hasher.update(e), this
        }, finalize: function (e) {
          var t = this._hasher, r = t.finalize(e);
          return t.reset(), t.finalize(this._oKey.clone().concat(r))
        }
      })
    }, "object" == typeof r ? t.exports = r = n(e("crypto-js/core")) : "function" == typeof define && define.amd ? define(["crypto-js/core"], n) : n(i.CryptoJS)
  }, {"crypto-js/core": 74}],
  79: [function (e, t, r) {
    var i, n;
    i = this, n = function (e) {
      var t, r, i, n, o, h, a;
      return r = (t = e).lib, i = r.WordArray, n = r.Hasher, o = t.algo, h = [], a = o.SHA1 = n.extend({
        _doReset: function () {
          this._hash = new i.init([1732584193, 4023233417, 2562383102, 271733878, 3285377520])
        }, _doProcessBlock: function (e, t) {
          for (var r, i = this._hash.words, n = i[0], o = i[1], a = i[2], s = i[3], l = i[4], u = 0; u < 80; u++) {
            u < 16 ? h[u] = 0 | e[t + u] : (r = h[u - 3] ^ h[u - 8] ^ h[u - 14] ^ h[u - 16], h[u] = r << 1 | r >>> 31);
            var c = (n << 5 | n >>> 27) + l + h[u];
            c += u < 20 ? 1518500249 + (o & a | ~o & s) : u < 40 ? 1859775393 + (o ^ a ^ s) : u < 60 ? (o & a | o & s | a & s) - 1894007588 : (o ^ a ^ s) - 899497514, l = s, s = a, a = o << 30 | o >>> 2, o = n, n = c
          }
          i[0] = i[0] + n | 0, i[1] = i[1] + o | 0, i[2] = i[2] + a | 0, i[3] = i[3] + s | 0, i[4] = i[4] + l | 0
        }, _doFinalize: function () {
          var e = this._data, t = e.words, r = 8 * this._nDataBytes, i = 8 * e.sigBytes;
          return t[i >>> 5] |= 128 << 24 - i % 32, t[14 + (64 + i >>> 9 << 4)] = Math.floor(r / 4294967296), t[15 + (64 + i >>> 9 << 4)] = r, e.sigBytes = 4 * t.length, this._process(), this._hash
        }, clone: function () {
          var e = n.clone.call(this);
          return e._hash = this._hash.clone(), e
        }
      }), t.SHA1 = n._createHelper(a), t.HmacSHA1 = n._createHmacHelper(a), e.SHA1
    }, "object" == typeof r ? t.exports = r = n(e("crypto-js/core")) : "function" == typeof define && define.amd ? define(["crypto-js/core"], n) : n(i.CryptoJS)
  }, {"crypto-js/core": 74}],
  80: [function (e, t, r) {
    "use strict";
    r.utils = e("./des/utils"), r.Cipher = e("./des/cipher"), r.DES = e("./des/des"), r.CBC = e("./des/cbc"), r.EDE = e("./des/ede")
  }, {"./des/cbc": 81, "./des/cipher": 82, "./des/des": 83, "./des/ede": 84, "./des/utils": 85}],
  81: [function (e, t, r) {
    "use strict";
    var i = e("minimalistic-assert"), o = e("inherits"), a = {};

    function n(e) {
      i.equal(e.length, 8, "Invalid IV length"), this.iv = new Array(8);
      for (var t = 0; t < this.iv.length; t++) this.iv[t] = e[t]
    }

    r.instantiate = function (t) {
      function r(e) {
        t.call(this, e), this._cbcInit()
      }

      o(r, t);
      for (var e = Object.keys(a), i = 0; i < e.length; i++) {
        var n = e[i];
        r.prototype[n] = a[n]
      }
      return r.create = function (e) {
        return new r(e)
      }, r
    }, a._cbcInit = function () {
      var e = new n(this.options.iv);
      this._cbcState = e
    }, a._update = function (e, t, r, i) {
      var n = this._cbcState, o = this.constructor.super_.prototype, a = n.iv;
      if ("encrypt" === this.type) {
        for (var s = 0; s < this.blockSize; s++) a[s] ^= e[t + s];
        o._update.call(this, a, 0, r, i);
        for (s = 0; s < this.blockSize; s++) a[s] = r[i + s]
      } else {
        o._update.call(this, e, t, r, i);
        for (s = 0; s < this.blockSize; s++) r[i + s] ^= a[s];
        for (s = 0; s < this.blockSize; s++) a[s] = e[t + s]
      }
    }
  }, {inherits: 142, "minimalistic-assert": 148}],
  82: [function (e, t, r) {
    "use strict";
    var i = e("minimalistic-assert");

    function n(e) {
      this.options = e, this.type = this.options.type, this.blockSize = 8, this._init(), this.buffer = new Array(this.blockSize), this.bufferOff = 0
    }

    (t.exports = n).prototype._init = function () {
    }, n.prototype.update = function (e) {
      return 0 === e.length ? [] : "decrypt" === this.type ? this._updateDecrypt(e) : this._updateEncrypt(e)
    }, n.prototype._buffer = function (e, t) {
      for (var r = Math.min(this.buffer.length - this.bufferOff, e.length - t), i = 0; i < r; i++) this.buffer[this.bufferOff + i] = e[t + i];
      return this.bufferOff += r, r
    }, n.prototype._flushBuffer = function (e, t) {
      return this._update(this.buffer, 0, e, t), this.bufferOff = 0, this.blockSize
    }, n.prototype._updateEncrypt = function (e) {
      var t = 0, r = 0, i = (this.bufferOff + e.length) / this.blockSize | 0, n = new Array(i * this.blockSize);
      0 !== this.bufferOff && (t += this._buffer(e, t), this.bufferOff === this.buffer.length && (r += this._flushBuffer(n, r)));
      for (var o = e.length - (e.length - t) % this.blockSize; t < o; t += this.blockSize) this._update(e, t, n, r), r += this.blockSize;
      for (; t < e.length; t++, this.bufferOff++) this.buffer[this.bufferOff] = e[t];
      return n
    }, n.prototype._updateDecrypt = function (e) {
      for (var t = 0, r = 0, i = Math.ceil((this.bufferOff + e.length) / this.blockSize) - 1, n = new Array(i * this.blockSize); 0 < i; i--) t += this._buffer(e, t), r += this._flushBuffer(n, r);
      return t += this._buffer(e, t), n
    }, n.prototype["final"] = function (e) {
      var t, r;
      return e && (t = this.update(e)), r = "encrypt" === this.type ? this._finalEncrypt() : this._finalDecrypt(), t ? t.concat(r) : r
    }, n.prototype._pad = function (e, t) {
      if (0 === t) return !1;
      for (; t < e.length;) e[t++] = 0;
      return !0
    }, n.prototype._finalEncrypt = function () {
      if (!this._pad(this.buffer, this.bufferOff)) return [];
      var e = new Array(this.blockSize);
      return this._update(this.buffer, 0, e, 0), e
    }, n.prototype._unpad = function (e) {
      return e
    }, n.prototype._finalDecrypt = function () {
      i.equal(this.bufferOff, this.blockSize, "Not enough data to decrypt");
      var e = new Array(this.blockSize);
      return this._flushBuffer(e, 0), this._unpad(e)
    }
  }, {"minimalistic-assert": 148}],
  83: [function (e, t, r) {
    "use strict";
    var a = e("minimalistic-assert"), i = e("inherits"), d = e("./utils"), n = e("./cipher");

    function o() {
      this.tmp = new Array(2), this.keys = null
    }

    function s(e) {
      n.call(this, e);
      var t = new o;
      this._desState = t, this.deriveKeys(t, e.key)
    }

    i(s, n), (t.exports = s).create = function (e) {
      return new s(e)
    };
    var l = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
    s.prototype.deriveKeys = function (e, t) {
      e.keys = new Array(32), a.equal(t.length, this.blockSize, "Invalid key length");
      var r = d.readUInt32BE(t, 0), i = d.readUInt32BE(t, 4);
      d.pc1(r, i, e.tmp, 0), r = e.tmp[0], i = e.tmp[1];
      for (var n = 0; n < e.keys.length; n += 2) {
        var o = l[n >>> 1], r = d.r28shl(r, o), i = d.r28shl(i, o);
        d.pc2(r, i, e.keys, n)
      }
    }, s.prototype._update = function (e, t, r, i) {
      var n = this._desState, o = d.readUInt32BE(e, t), a = d.readUInt32BE(e, t + 4);
      d.ip(o, a, n.tmp, 0), o = n.tmp[0], a = n.tmp[1], "encrypt" === this.type ? this._encrypt(n, o, a, n.tmp, 0) : this._decrypt(n, o, a, n.tmp, 0), o = n.tmp[0], a = n.tmp[1], d.writeUInt32BE(r, o, i), d.writeUInt32BE(r, a, i + 4)
    }, s.prototype._pad = function (e, t) {
      for (var r = e.length - t, i = t; i < e.length; i++) e[i] = r;
      return !0
    }, s.prototype._unpad = function (e) {
      for (var t = e[e.length - 1], r = e.length - t; r < e.length; r++) a.equal(e[r], t);
      return e.slice(0, e.length - t)
    }, s.prototype._encrypt = function (e, t, r, i, n) {
      for (var o = t, a = r, s = 0; s < e.keys.length; s += 2) {
        var l = e.keys[s], u = e.keys[s + 1];
        d.expand(a, e.tmp, 0), l ^= e.tmp[0], u ^= e.tmp[1];
        var c = d.substitute(l, u), h = a, a = (o ^ d.permute(c)) >>> 0, o = h
      }
      d.rip(a, o, i, n)
    }, s.prototype._decrypt = function (e, t, r, i, n) {
      for (var o = r, a = t, s = e.keys.length - 2; 0 <= s; s -= 2) {
        var l = e.keys[s], u = e.keys[s + 1];
        d.expand(o, e.tmp, 0), l ^= e.tmp[0], u ^= e.tmp[1];
        var c = d.substitute(l, u), h = o, o = (a ^ d.permute(c)) >>> 0, a = h
      }
      d.rip(o, a, i, n)
    }
  }, {"./cipher": 82, "./utils": 85, inherits: 142, "minimalistic-assert": 148}],
  84: [function (e, t, r) {
    "use strict";
    var o = e("minimalistic-assert"), i = e("inherits"), n = e("./cipher"), a = e("./des");

    function s(e, t) {
      o.equal(t.length, 24, "Invalid key length");
      var r = t.slice(0, 8), i = t.slice(8, 16), n = t.slice(16, 24);
      this.ciphers = "encrypt" === e ? [a.create({type: "encrypt", key: r}), a.create({
        type: "decrypt",
        key: i
      }), a.create({type: "encrypt", key: n})] : [a.create({type: "decrypt", key: n}), a.create({
        type: "encrypt",
        key: i
      }), a.create({type: "decrypt", key: r})]
    }

    function l(e) {
      n.call(this, e);
      var t = new s(this.type, this.options.key);
      this._edeState = t
    }

    i(l, n), (t.exports = l).create = function (e) {
      return new l(e)
    }, l.prototype._update = function (e, t, r, i) {
      var n = this._edeState;
      n.ciphers[0]._update(e, t, r, i), n.ciphers[1]._update(r, i, r, i), n.ciphers[2]._update(r, i, r, i)
    }, l.prototype._pad = a.prototype._pad, l.prototype._unpad = a.prototype._unpad
  }, {"./cipher": 82, "./des": 83, inherits: 142, "minimalistic-assert": 148}],
  85: [function (e, t, r) {
    "use strict";
    r.readUInt32BE = function (e, t) {
      return (e[0 + t] << 24 | e[1 + t] << 16 | e[2 + t] << 8 | e[3 + t]) >>> 0
    }, r.writeUInt32BE = function (e, t, r) {
      e[0 + r] = t >>> 24, e[1 + r] = t >>> 16 & 255, e[2 + r] = t >>> 8 & 255, e[3 + r] = 255 & t
    }, r.ip = function (e, t, r, i) {
      for (var n = 0, o = 0, a = 6; 0 <= a; a -= 2) {
        for (var s = 0; s <= 24; s += 8) n <<= 1, n |= t >>> s + a & 1;
        for (s = 0; s <= 24; s += 8) n <<= 1, n |= e >>> s + a & 1
      }
      for (a = 6; 0 <= a; a -= 2) {
        for (s = 1; s <= 25; s += 8) o <<= 1, o |= t >>> s + a & 1;
        for (s = 1; s <= 25; s += 8) o <<= 1, o |= e >>> s + a & 1
      }
      r[i + 0] = n >>> 0, r[i + 1] = o >>> 0
    }, r.rip = function (e, t, r, i) {
      for (var n = 0, o = 0, a = 0; a < 4; a++) for (var s = 24; 0 <= s; s -= 8) n <<= 1, n |= t >>> s + a & 1, n <<= 1, n |= e >>> s + a & 1;
      for (a = 4; a < 8; a++) for (s = 24; 0 <= s; s -= 8) o <<= 1, o |= t >>> s + a & 1, o <<= 1, o |= e >>> s + a & 1;
      r[i + 0] = n >>> 0, r[i + 1] = o >>> 0
    }, r.pc1 = function (e, t, r, i) {
      for (var n = 0, o = 0, a = 7; 5 <= a; a--) {
        for (var s = 0; s <= 24; s += 8) n <<= 1, n |= t >> s + a & 1;
        for (s = 0; s <= 24; s += 8) n <<= 1, n |= e >> s + a & 1
      }
      for (s = 0; s <= 24; s += 8) n <<= 1, n |= t >> s + a & 1;
      for (a = 1; a <= 3; a++) {
        for (s = 0; s <= 24; s += 8) o <<= 1, o |= t >> s + a & 1;
        for (s = 0; s <= 24; s += 8) o <<= 1, o |= e >> s + a & 1
      }
      for (s = 0; s <= 24; s += 8) o <<= 1, o |= e >> s + a & 1;
      r[i + 0] = n >>> 0, r[i + 1] = o >>> 0
    }, r.r28shl = function (e, t) {
      return e << t & 268435455 | e >>> 28 - t
    };
    var l = [14, 11, 17, 4, 27, 23, 25, 0, 13, 22, 7, 18, 5, 9, 16, 24, 2, 20, 12, 21, 1, 8, 15, 26, 15, 4, 25, 19, 9, 1, 26, 16, 5, 11, 23, 8, 12, 7, 17, 0, 22, 3, 10, 14, 6, 20, 27, 24];
    r.pc2 = function (e, t, r, i) {
      for (var n = 0, o = 0, a = l.length >>> 1, s = 0; s < a; s++) n <<= 1, n |= e >>> l[s] & 1;
      for (s = a; s < l.length; s++) o <<= 1, o |= t >>> l[s] & 1;
      r[i + 0] = n >>> 0, r[i + 1] = o >>> 0
    }, r.expand = function (e, t, r) {
      for (var i = 0, n = 0, i = (1 & e) << 5 | e >>> 27, o = 23; 15 <= o; o -= 4) i <<= 6, i |= e >>> o & 63;
      for (o = 11; 3 <= o; o -= 4) n |= e >>> o & 63, n <<= 6;
      n |= (31 & e) << 1 | e >>> 31, t[r + 0] = i >>> 0, t[r + 1] = n >>> 0
    };
    var n = [14, 0, 4, 15, 13, 7, 1, 4, 2, 14, 15, 2, 11, 13, 8, 1, 3, 10, 10, 6, 6, 12, 12, 11, 5, 9, 9, 5, 0, 3, 7, 8, 4, 15, 1, 12, 14, 8, 8, 2, 13, 4, 6, 9, 2, 1, 11, 7, 15, 5, 12, 11, 9, 3, 7, 14, 3, 10, 10, 0, 5, 6, 0, 13, 15, 3, 1, 13, 8, 4, 14, 7, 6, 15, 11, 2, 3, 8, 4, 14, 9, 12, 7, 0, 2, 1, 13, 10, 12, 6, 0, 9, 5, 11, 10, 5, 0, 13, 14, 8, 7, 10, 11, 1, 10, 3, 4, 15, 13, 4, 1, 2, 5, 11, 8, 6, 12, 7, 6, 12, 9, 0, 3, 5, 2, 14, 15, 9, 10, 13, 0, 7, 9, 0, 14, 9, 6, 3, 3, 4, 15, 6, 5, 10, 1, 2, 13, 8, 12, 5, 7, 14, 11, 12, 4, 11, 2, 15, 8, 1, 13, 1, 6, 10, 4, 13, 9, 0, 8, 6, 15, 9, 3, 8, 0, 7, 11, 4, 1, 15, 2, 14, 12, 3, 5, 11, 10, 5, 14, 2, 7, 12, 7, 13, 13, 8, 14, 11, 3, 5, 0, 6, 6, 15, 9, 0, 10, 3, 1, 4, 2, 7, 8, 2, 5, 12, 11, 1, 12, 10, 4, 14, 15, 9, 10, 3, 6, 15, 9, 0, 0, 6, 12, 10, 11, 1, 7, 13, 13, 8, 15, 9, 1, 4, 3, 5, 14, 11, 5, 12, 2, 7, 8, 2, 4, 14, 2, 14, 12, 11, 4, 2, 1, 12, 7, 4, 10, 7, 11, 13, 6, 1, 8, 5, 5, 0, 3, 15, 15, 10, 13, 3, 0, 9, 14, 8, 9, 6, 4, 11, 2, 8, 1, 12, 11, 7, 10, 1, 13, 14, 7, 2, 8, 13, 15, 6, 9, 15, 12, 0, 5, 9, 6, 10, 3, 4, 0, 5, 14, 3, 12, 10, 1, 15, 10, 4, 15, 2, 9, 7, 2, 12, 6, 9, 8, 5, 0, 6, 13, 1, 3, 13, 4, 14, 14, 0, 7, 11, 5, 3, 11, 8, 9, 4, 14, 3, 15, 2, 5, 12, 2, 9, 8, 5, 12, 15, 3, 10, 7, 11, 0, 14, 4, 1, 10, 7, 1, 6, 13, 0, 11, 8, 6, 13, 4, 13, 11, 0, 2, 11, 14, 7, 15, 4, 0, 9, 8, 1, 13, 10, 3, 14, 12, 3, 9, 5, 7, 12, 5, 2, 10, 15, 6, 8, 1, 6, 1, 6, 4, 11, 11, 13, 13, 8, 12, 1, 3, 4, 7, 10, 14, 7, 10, 9, 15, 5, 6, 0, 8, 15, 0, 14, 5, 2, 9, 3, 2, 12, 13, 1, 2, 15, 8, 13, 4, 8, 6, 10, 15, 3, 11, 7, 1, 4, 10, 12, 9, 5, 3, 6, 14, 11, 5, 0, 0, 14, 12, 9, 7, 2, 7, 2, 11, 1, 4, 14, 1, 7, 9, 4, 12, 10, 14, 8, 2, 13, 0, 15, 6, 12, 10, 9, 13, 0, 15, 3, 3, 5, 5, 6, 8, 11];
    r.substitute = function (e, t) {
      for (var r = 0, i = 0; i < 4; i++) {
        r <<= 4, r |= n[64 * i + (e >>> 18 - 6 * i & 63)]
      }
      for (i = 0; i < 4; i++) {
        r <<= 4, r |= n[256 + 64 * i + (t >>> 18 - 6 * i & 63)]
      }
      return r >>> 0
    };
    var i = [16, 25, 12, 11, 3, 20, 4, 15, 31, 17, 9, 6, 27, 14, 1, 22, 30, 24, 8, 18, 0, 5, 29, 23, 13, 19, 2, 26, 10, 21, 28, 7];
    r.permute = function (e) {
      for (var t = 0, r = 0; r < i.length; r++) t <<= 1, t |= e >>> i[r] & 1;
      return t >>> 0
    }, r.padSplit = function (e, t, r) {
      for (var i = e.toString(2); i.length < t;) i = "0" + i;
      for (var n = [], o = 0; o < t; o += r) n.push(i.slice(o, o + r));
      return n.join(" ")
    }
  }, {}],
  86: [function (e, t, r) {
    (function (o) {
      var a = e("./lib/generatePrime"), i = e("./lib/primes.json"), s = e("./lib/dh");
      var l = {binary: !0, hex: !0, base64: !0};
      r.DiffieHellmanGroup = r.createDiffieHellmanGroup = r.getDiffieHellman = function (e) {
        var t = new o(i[e].prime, "hex"), r = new o(i[e].gen, "hex");
        return new s(t, r)
      }, r.createDiffieHellman = r.DiffieHellman = function e(t, r, i, n) {
        return o.isBuffer(r) || void 0 === l[r] ? e(t, "binary", r, i) : (r = r || "binary", n = n || "binary", i = i || new o([2]), o.isBuffer(i) || (i = new o(i, n)), "number" == typeof t ? new s(a(t, i), i, !0) : (o.isBuffer(t) || (t = new o(t, r)), new s(t, i, !0)))
      }
    }).call(this, e("buffer").Buffer)
  }, {"./lib/dh": 87, "./lib/generatePrime": 88, "./lib/primes.json": 89, buffer: 64}],
  87: [function (y, m, e) {
    (function (o) {
      var a = y("bn.js"), s = new (y("miller-rabin")), l = new a(24), u = new a(11), c = new a(10), h = new a(3),
          d = new a(7), f = y("./generatePrime"), e = y("randombytes");

      function i(e, t) {
        return t = t || "utf8", o.isBuffer(e) || (e = new o(e, t)), this._pub = new a(e), this
      }

      function n(e, t) {
        return t = t || "utf8", o.isBuffer(e) || (e = new o(e, t)), this._priv = new a(e), this
      }

      m.exports = t;
      var p = {};

      function t(e, t, r) {
        this.setGenerator(t), this.__prime = new a(e), this._prime = a.mont(this.__prime), this._primeLen = e.length, this._pub = void 0, this._priv = void 0, this._primeCode = void 0, r ? (this.setPublicKey = i, this.setPrivateKey = n) : this._primeCode = 8
      }

      function r(e, t) {
        var r = new o(e.toArray());
        return t ? r.toString(t) : r
      }

      Object.defineProperty(t.prototype, "verifyError", {
        enumerable: !0, get: function () {
          return "number" != typeof this._primeCode && (this._primeCode = function (e, t) {
            var r = t.toString("hex"), i = [r, e.toString(16)].join("_");
            if (i in p) return p[i];
            var n, o = 0;
            if (e.isEven() || !f.simpleSieve || !f.fermatTest(e) || !s.test(e)) return o += 1, o += "02" === r || "05" === r ? 8 : 4, p[i] = o;
            switch (s.test(e.shrn(1)) || (o += 2), r) {
              case"02":
                e.mod(l).cmp(u) && (o += 8);
                break;
              case"05":
                (n = e.mod(c)).cmp(h) && n.cmp(d) && (o += 8);
                break;
              default:
                o += 4
            }
            return p[i] = o
          }(this.__prime, this.__gen)), this._primeCode
        }
      }), t.prototype.generateKeys = function () {
        return this._priv || (this._priv = new a(e(this._primeLen))), this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed(), this.getPublicKey()
      }, t.prototype.computeSecret = function (e) {
        var t, r = (e = (e = new a(e)).toRed(this._prime)).redPow(this._priv).fromRed(), i = new o(r.toArray()),
            n = this.getPrime();
        return i.length < n.length && ((t = new o(n.length - i.length)).fill(0), i = o.concat([t, i])), i
      }, t.prototype.getPublicKey = function (e) {
        return r(this._pub, e)
      }, t.prototype.getPrivateKey = function (e) {
        return r(this._priv, e)
      }, t.prototype.getPrime = function (e) {
        return r(this.__prime, e)
      }, t.prototype.getGenerator = function (e) {
        return r(this._gen, e)
      }, t.prototype.setGenerator = function (e, t) {
        return t = t || "utf8", o.isBuffer(e) || (e = new o(e, t)), this.__gen = e, this._gen = new a(e), this
      }
    }).call(this, y("buffer").Buffer)
  }, {"./generatePrime": 88, "bn.js": 90, buffer: 64, "miller-rabin": 146, randombytes: 169}],
  88: [function (e, t, r) {
    var n = e("randombytes");
    (t.exports = i).simpleSieve = m, i.fermatTest = g;
    var o = e("bn.js"), a = new o(24), s = new (e("miller-rabin")), l = new o(1), u = new o(2), c = new o(5),
        h = (new o(16), new o(8), new o(10)), d = new o(3), f = (new o(7), new o(11)), p = new o(4),
        y = (new o(12), null);

    function m(e) {
      for (var t = function () {
        if (null !== y) return y;
        var e = [];
        e[0] = 2;
        for (var t = 1, r = 3; r < 1048576; r += 2) {
          for (var i = Math.ceil(Math.sqrt(r)), n = 0; n < t && e[n] <= i && r % e[n] != 0; n++) ;
          t !== n && e[n] <= i || (e[t++] = r)
        }
        return y = e
      }(), r = 0; r < t.length; r++) if (0 === e.modn(t[r])) return 0 === e.cmpn(t[r]);
      return !0
    }

    function g(e) {
      var t = o.mont(e);
      return 0 === u.toRed(t).redPow(e.subn(1)).fromRed().cmpn(1)
    }

    function i(e, t) {
      if (e < 16) return new o(2 === t || 5 === t ? [140, 123] : [140, 39]);
      var r, i;
      for (t = new o(t); ;) {
        for (r = new o(n(Math.ceil(e / 8))); r.bitLength() > e;) r.ishrn(1);
        if (r.isEven() && r.iadd(l), r.testn(1) || r.iadd(u), t.cmp(u)) {
          if (!t.cmp(c)) for (; r.mod(h).cmp(d);) r.iadd(p)
        } else for (; r.mod(a).cmp(f);) r.iadd(p);
        if (m(i = r.shrn(1)) && m(r) && g(i) && g(r) && s.test(i) && s.test(r)) return r
      }
    }
  }, {"bn.js": 90, "miller-rabin": 146, randombytes: 169}],
  89: [function (e, t, r) {
    t.exports = {
      modp1: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff"
      },
      modp2: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff"
      },
      modp5: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff"
      },
      modp14: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff"
      },
      modp15: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff"
      },
      modp16: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff"
      },
      modp17: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff"
      },
      modp18: {
        gen: "02",
        prime: "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff"
      }
    }
  }, {}],
  90: [function (e, t, r) {
    arguments[4][15][0].apply(r, arguments)
  }, {buffer: 19, dup: 15}],
  91: [function (e, t, r) {
    "use strict";
    var i = r;
    i.version = e("../package.json").version, i.utils = e("./elliptic/utils"), i.rand = e("brorand"), i.curve = e("./elliptic/curve"), i.curves = e("./elliptic/curves"), i.ec = e("./elliptic/ec"), i.eddsa = e("./elliptic/eddsa")
  }, {
    "../package.json": 107,
    "./elliptic/curve": 94,
    "./elliptic/curves": 97,
    "./elliptic/ec": 98,
    "./elliptic/eddsa": 101,
    "./elliptic/utils": 105,
    brorand: 18
  }],
  92: [function (e, t, r) {
    "use strict";
    var i = e("bn.js"), n = e("../utils"), T = n.getNAF, M = n.getJSF, h = n.assert;

    function o(e, t) {
      this.type = e, this.p = new i(t.p, 16), this.red = t.prime ? i.red(t.prime) : i.mont(this.p), this.zero = new i(0).toRed(this.red), this.one = new i(1).toRed(this.red), this.two = new i(2).toRed(this.red), this.n = t.n && new i(t.n, 16), this.g = t.g && this.pointFromJSON(t.g, t.gRed), this._wnafT1 = new Array(4), this._wnafT2 = new Array(4), this._wnafT3 = new Array(4), this._wnafT4 = new Array(4), this._bitLength = this.n ? this.n.bitLength() : 0;
      var r = this.n && this.p.div(this.n);
      !r || 0 < r.cmpn(100) ? this.redN = null : (this._maxwellTrick = !0, this.redN = this.n.toRed(this.red))
    }

    function a(e, t) {
      this.curve = e, this.type = t, this.precomputed = null
    }

    (t.exports = o).prototype.point = function () {
      throw new Error("Not implemented")
    }, o.prototype.validate = function () {
      throw new Error("Not implemented")
    }, o.prototype._fixedNafMul = function (e, t) {
      h(e.precomputed);
      var r = e._getDoubles(), i = T(t, 1, this._bitLength), n = (1 << r.step + 1) - (r.step % 2 == 0 ? 2 : 1);
      n /= 3;
      for (var o = [], a = 0; a < i.length; a += r.step) {
        for (var s = 0, t = a + r.step - 1; a <= t; t--) s = (s << 1) + i[t];
        o.push(s)
      }
      for (var l = this.jpoint(null, null, null), u = this.jpoint(null, null, null), c = n; 0 < c; c--) {
        for (a = 0; a < o.length; a++) {
          (s = o[a]) === c ? u = u.mixedAdd(r.points[a]) : s === -c && (u = u.mixedAdd(r.points[a].neg()))
        }
        l = l.add(u)
      }
      return l.toP()
    }, o.prototype._wnafMul = function (e, t) {
      for (var r = 4, i = e._getNAFPoints(r), r = i.wnd, n = i.points, o = T(t, r, this._bitLength), a = this.jpoint(null, null, null), s = o.length - 1; 0 <= s; s--) {
        for (t = 0; 0 <= s && 0 === o[s]; s--) t++;
        if (0 <= s && t++, a = a.dblp(t), s < 0) break;
        var l = o[s];
        h(0 !== l), a = "affine" === e.type ? 0 < l ? a.mixedAdd(n[l - 1 >> 1]) : a.mixedAdd(n[-l - 1 >> 1].neg()) : 0 < l ? a.add(n[l - 1 >> 1]) : a.add(n[-l - 1 >> 1].neg())
      }
      return "affine" === e.type ? a.toP() : a
    }, o.prototype._wnafMulAdd = function (e, t, r, i, n) {
      for (var o = this._wnafT1, a = this._wnafT2, s = this._wnafT3, l = 0, u = 0; u < i; u++) {
        var c = (E = t[u])._getNAFPoints(e);
        o[u] = c.wnd, a[u] = c.points
      }
      for (u = i - 1; 1 <= u; u -= 2) {
        var h = u - 1, d = u;
        if (1 === o[h] && 1 === o[d]) {
          var f = [t[h], null, null, t[d]];
          0 === t[h].y.cmp(t[d].y) ? (f[1] = t[h].add(t[d]), f[2] = t[h].toJ().mixedAdd(t[d].neg())) : 0 === t[h].y.cmp(t[d].y.redNeg()) ? (f[1] = t[h].toJ().mixedAdd(t[d]), f[2] = t[h].add(t[d].neg())) : (f[1] = t[h].toJ().mixedAdd(t[d]), f[2] = t[h].toJ().mixedAdd(t[d].neg()));
          var p = [-3, -1, -5, -7, 0, 7, 5, 1, 3], y = M(r[h], r[d]), l = Math.max(y[0].length, l);
          s[h] = new Array(l), s[d] = new Array(l);
          for (var m = 0; m < l; m++) {
            var g = 0 | y[0][m], b = 0 | y[1][m];
            s[h][m] = p[3 * (1 + g) + (1 + b)], s[d][m] = 0, a[h] = f
          }
        } else s[h] = T(r[h], o[h], this._bitLength), s[d] = T(r[d], o[d], this._bitLength), l = Math.max(s[h].length, l), l = Math.max(s[d].length, l)
      }
      for (var v = this.jpoint(null, null, null), _ = this._wnafT4, u = l; 0 <= u; u--) {
        for (var w = 0; 0 <= u;) {
          for (var S = !0, m = 0; m < i; m++) _[m] = 0 | s[m][u], 0 !== _[m] && (S = !1);
          if (!S) break;
          w++, u--
        }
        if (0 <= u && w++, v = v.dblp(w), u < 0) break;
        for (m = 0; m < i; m++) {
          var E, x = _[m];
          0 !== x && (0 < x ? E = a[m][x - 1 >> 1] : x < 0 && (E = a[m][-x - 1 >> 1].neg()), v = "affine" === E.type ? v.mixedAdd(E) : v.add(E))
        }
      }
      for (u = 0; u < i; u++) a[u] = null;
      return n ? v : v.toP()
    }, (o.BasePoint = a).prototype.eq = function () {
      throw new Error("Not implemented")
    }, a.prototype.validate = function () {
      return this.curve.validate(this)
    }, o.prototype.decodePoint = function (e, t) {
      e = n.toArray(e, t);
      var r = this.p.byteLength();
      if ((4 === e[0] || 6 === e[0] || 7 === e[0]) && e.length - 1 == 2 * r) return 6 === e[0] ? h(e[e.length - 1] % 2 == 0) : 7 === e[0] && h(e[e.length - 1] % 2 == 1), this.point(e.slice(1, 1 + r), e.slice(1 + r, 1 + 2 * r));
      if ((2 === e[0] || 3 === e[0]) && e.length - 1 === r) return this.pointFromX(e.slice(1, 1 + r), 3 === e[0]);
      throw new Error("Unknown point format")
    }, a.prototype.encodeCompressed = function (e) {
      return this.encode(e, !0)
    }, a.prototype._encode = function (e) {
      var t = this.curve.p.byteLength(), r = this.getX().toArray("be", t);
      return e ? [this.getY().isEven() ? 2 : 3].concat(r) : [4].concat(r, this.getY().toArray("be", t))
    }, a.prototype.encode = function (e, t) {
      return n.encode(this._encode(t), e)
    }, a.prototype.precompute = function (e) {
      if (this.precomputed) return this;
      var t = {doubles: null, naf: null, beta: null};
      return t.naf = this._getNAFPoints(8), t.doubles = this._getDoubles(4, e), t.beta = this._getBeta(), this.precomputed = t, this
    }, a.prototype._hasDoubles = function (e) {
      if (!this.precomputed) return !1;
      var t = this.precomputed.doubles;
      return !!t && t.points.length >= Math.ceil((e.bitLength() + 1) / t.step)
    }, a.prototype._getDoubles = function (e, t) {
      if (this.precomputed && this.precomputed.doubles) return this.precomputed.doubles;
      for (var r = [this], i = this, n = 0; n < t; n += e) {
        for (var o = 0; o < e; o++) i = i.dbl();
        r.push(i)
      }
      return {step: e, points: r}
    }, a.prototype._getNAFPoints = function (e) {
      if (this.precomputed && this.precomputed.naf) return this.precomputed.naf;
      for (var t = [this], r = (1 << e) - 1, i = 1 == r ? null : this.dbl(), n = 1; n < r; n++) t[n] = t[n - 1].add(i);
      return {wnd: e, points: t}
    }, a.prototype._getBeta = function () {
      return null
    }, a.prototype.dblp = function (e) {
      for (var t = this, r = 0; r < e; r++) t = t.dbl();
      return t
    }
  }, {"../utils": 105, "bn.js": 106}],
  93: [function (e, t, r) {
    "use strict";
    var i = e("../utils"), l = e("bn.js"), n = e("inherits"), o = e("./base"), a = i.assert;

    function s(e) {
      this.twisted = 1 != (0 | e.a), this.mOneA = this.twisted && -1 == (0 | e.a), this.extended = this.mOneA, o.call(this, "edwards", e), this.a = new l(e.a, 16).umod(this.red.m), this.a = this.a.toRed(this.red), this.c = new l(e.c, 16).toRed(this.red), this.c2 = this.c.redSqr(), this.d = new l(e.d, 16).toRed(this.red), this.dd = this.d.redAdd(this.d), a(!this.twisted || 0 === this.c.fromRed().cmpn(1)), this.oneC = 1 == (0 | e.c)
    }

    function u(e, t, r, i, n) {
      o.BasePoint.call(this, e, "projective"), null === t && null === r && null === i ? (this.x = this.curve.zero, this.y = this.curve.one, this.z = this.curve.one, this.t = this.curve.zero, this.zOne = !0) : (this.x = new l(t, 16), this.y = new l(r, 16), this.z = i ? new l(i, 16) : this.curve.one, this.t = n && new l(n, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.t && !this.t.red && (this.t = this.t.toRed(this.curve.red)), this.zOne = this.z === this.curve.one, this.curve.extended && !this.t && (this.t = this.x.redMul(this.y), this.zOne || (this.t = this.t.redMul(this.z.redInvm()))))
    }

    n(s, o), (t.exports = s).prototype._mulA = function (e) {
      return this.mOneA ? e.redNeg() : this.a.redMul(e)
    }, s.prototype._mulC = function (e) {
      return this.oneC ? e : this.c.redMul(e)
    }, s.prototype.jpoint = function (e, t, r, i) {
      return this.point(e, t, r, i)
    }, s.prototype.pointFromX = function (e, t) {
      (e = new l(e, 16)).red || (e = e.toRed(this.red));
      var r = e.redSqr(), i = this.c2.redSub(this.a.redMul(r)), n = this.one.redSub(this.c2.redMul(this.d).redMul(r)),
          o = i.redMul(n.redInvm()), a = o.redSqrt();
      if (0 !== a.redSqr().redSub(o).cmp(this.zero)) throw new Error("invalid point");
      var s = a.fromRed().isOdd();
      return (t && !s || !t && s) && (a = a.redNeg()), this.point(e, a)
    }, s.prototype.pointFromY = function (e, t) {
      (e = new l(e, 16)).red || (e = e.toRed(this.red));
      var r = e.redSqr(), i = r.redSub(this.c2), n = r.redMul(this.d).redMul(this.c2).redSub(this.a),
          o = i.redMul(n.redInvm());
      if (0 === o.cmp(this.zero)) {
        if (t) throw new Error("invalid point");
        return this.point(this.zero, e)
      }
      var a = o.redSqrt();
      if (0 !== a.redSqr().redSub(o).cmp(this.zero)) throw new Error("invalid point");
      return a.fromRed().isOdd() !== t && (a = a.redNeg()), this.point(a, e)
    }, s.prototype.validate = function (e) {
      if (e.isInfinity()) return !0;
      e.normalize();
      var t = e.x.redSqr(), r = e.y.redSqr(), i = t.redMul(this.a).redAdd(r),
          n = this.c2.redMul(this.one.redAdd(this.d.redMul(t).redMul(r)));
      return 0 === i.cmp(n)
    }, n(u, o.BasePoint), s.prototype.pointFromJSON = function (e) {
      return u.fromJSON(this, e)
    }, s.prototype.point = function (e, t, r, i) {
      return new u(this, e, t, r, i)
    }, u.fromJSON = function (e, t) {
      return new u(e, t[0], t[1], t[2])
    }, u.prototype.inspect = function () {
      return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">"
    }, u.prototype.isInfinity = function () {
      return 0 === this.x.cmpn(0) && (0 === this.y.cmp(this.z) || this.zOne && 0 === this.y.cmp(this.curve.c))
    }, u.prototype._extDbl = function () {
      var e = this.x.redSqr(), t = this.y.redSqr(), r = (r = this.z.redSqr()).redIAdd(r), i = this.curve._mulA(e),
          n = this.x.redAdd(this.y).redSqr().redISub(e).redISub(t), o = i.redAdd(t), a = o.redSub(r), s = i.redSub(t),
          l = n.redMul(a), u = o.redMul(s), c = n.redMul(s), h = a.redMul(o);
      return this.curve.point(l, u, h, c)
    }, u.prototype._projDbl = function () {
      var e, t, r, i, n, o, a, s = this.x.redAdd(this.y).redSqr(), l = this.x.redSqr(), u = this.y.redSqr();
      return i = this.curve.twisted ? (e = (n = this.curve._mulA(l)).redAdd(u), this.zOne ? (t = s.redSub(l).redSub(u).redMul(e.redSub(this.curve.two)), r = e.redMul(n.redSub(u)), e.redSqr().redSub(e).redSub(e)) : (o = this.z.redSqr(), a = e.redSub(o).redISub(o), t = s.redSub(l).redISub(u).redMul(a), r = e.redMul(n.redSub(u)), e.redMul(a))) : (n = l.redAdd(u), o = this.curve._mulC(this.z).redSqr(), a = n.redSub(o).redSub(o), t = this.curve._mulC(s.redISub(n)).redMul(a), r = this.curve._mulC(n).redMul(l.redISub(u)), n.redMul(a)), this.curve.point(t, r, i)
    }, u.prototype.dbl = function () {
      return this.isInfinity() ? this : this.curve.extended ? this._extDbl() : this._projDbl()
    }, u.prototype._extAdd = function (e) {
      var t = this.y.redSub(this.x).redMul(e.y.redSub(e.x)), r = this.y.redAdd(this.x).redMul(e.y.redAdd(e.x)),
          i = this.t.redMul(this.curve.dd).redMul(e.t), n = this.z.redMul(e.z.redAdd(e.z)), o = r.redSub(t),
          a = n.redSub(i), s = n.redAdd(i), l = r.redAdd(t), u = o.redMul(a), c = s.redMul(l), h = o.redMul(l),
          d = a.redMul(s);
      return this.curve.point(u, c, d, h)
    }, u.prototype._projAdd = function (e) {
      var t, r = this.z.redMul(e.z), i = r.redSqr(), n = this.x.redMul(e.x), o = this.y.redMul(e.y),
          a = this.curve.d.redMul(n).redMul(o), s = i.redSub(a), l = i.redAdd(a),
          u = this.x.redAdd(this.y).redMul(e.x.redAdd(e.y)).redISub(n).redISub(o), c = r.redMul(s).redMul(u),
          h = this.curve.twisted ? (t = r.redMul(l).redMul(o.redSub(this.curve._mulA(n))), s.redMul(l)) : (t = r.redMul(l).redMul(o.redSub(n)), this.curve._mulC(s).redMul(l));
      return this.curve.point(c, t, h)
    }, u.prototype.add = function (e) {
      return this.isInfinity() ? e : e.isInfinity() ? this : this.curve.extended ? this._extAdd(e) : this._projAdd(e)
    }, u.prototype.mul = function (e) {
      return this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve._wnafMul(this, e)
    }, u.prototype.mulAdd = function (e, t, r) {
      return this.curve._wnafMulAdd(1, [this, t], [e, r], 2, !1)
    }, u.prototype.jmulAdd = function (e, t, r) {
      return this.curve._wnafMulAdd(1, [this, t], [e, r], 2, !0)
    }, u.prototype.normalize = function () {
      if (this.zOne) return this;
      var e = this.z.redInvm();
      return this.x = this.x.redMul(e), this.y = this.y.redMul(e), this.t && (this.t = this.t.redMul(e)), this.z = this.curve.one, this.zOne = !0, this
    }, u.prototype.neg = function () {
      return this.curve.point(this.x.redNeg(), this.y, this.z, this.t && this.t.redNeg())
    }, u.prototype.getX = function () {
      return this.normalize(), this.x.fromRed()
    }, u.prototype.getY = function () {
      return this.normalize(), this.y.fromRed()
    }, u.prototype.eq = function (e) {
      return this === e || 0 === this.getX().cmp(e.getX()) && 0 === this.getY().cmp(e.getY())
    }, u.prototype.eqXToP = function (e) {
      var t = e.toRed(this.curve.red).redMul(this.z);
      if (0 === this.x.cmp(t)) return !0;
      for (var r = e.clone(), i = this.curve.redN.redMul(this.z); ;) {
        if (r.iadd(this.curve.n), 0 <= r.cmp(this.curve.p)) return !1;
        if (t.redIAdd(i), 0 === this.x.cmp(t)) return !0
      }
    }, u.prototype.toP = u.prototype.normalize, u.prototype.mixedAdd = u.prototype.add
  }, {"../utils": 105, "./base": 92, "bn.js": 106, inherits: 142}],
  94: [function (e, t, r) {
    "use strict";
    var i = r;
    i.base = e("./base"), i["short"] = e("./short"), i.mont = e("./mont"), i.edwards = e("./edwards")
  }, {"./base": 92, "./edwards": 93, "./mont": 95, "./short": 96}],
  95: [function (e, t, r) {
    "use strict";
    var i = e("bn.js"), n = e("inherits"), o = e("./base"), a = e("../utils");

    function s(e) {
      o.call(this, "mont", e), this.a = new i(e.a, 16).toRed(this.red), this.b = new i(e.b, 16).toRed(this.red), this.i4 = new i(4).toRed(this.red).redInvm(), this.two = new i(2).toRed(this.red), this.a24 = this.i4.redMul(this.a.redAdd(this.two))
    }

    function l(e, t, r) {
      o.BasePoint.call(this, e, "projective"), null === t && null === r ? (this.x = this.curve.one, this.z = this.curve.zero) : (this.x = new i(t, 16), this.z = new i(r, 16), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)))
    }

    n(s, o), (t.exports = s).prototype.validate = function (e) {
      var t = e.normalize().x, r = t.redSqr(), i = r.redMul(t).redAdd(r.redMul(this.a)).redAdd(t);
      return 0 === i.redSqrt().redSqr().cmp(i)
    }, n(l, o.BasePoint), s.prototype.decodePoint = function (e, t) {
      return this.point(a.toArray(e, t), 1)
    }, s.prototype.point = function (e, t) {
      return new l(this, e, t)
    }, s.prototype.pointFromJSON = function (e) {
      return l.fromJSON(this, e)
    }, l.prototype.precompute = function () {
    }, l.prototype._encode = function () {
      return this.getX().toArray("be", this.curve.p.byteLength())
    }, l.fromJSON = function (e, t) {
      return new l(e, t[0], t[1] || e.one)
    }, l.prototype.inspect = function () {
      return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " z: " + this.z.fromRed().toString(16, 2) + ">"
    }, l.prototype.isInfinity = function () {
      return 0 === this.z.cmpn(0)
    }, l.prototype.dbl = function () {
      var e = this.x.redAdd(this.z).redSqr(), t = this.x.redSub(this.z).redSqr(), r = e.redSub(t), i = e.redMul(t),
          n = r.redMul(t.redAdd(this.curve.a24.redMul(r)));
      return this.curve.point(i, n)
    }, l.prototype.add = function () {
      throw new Error("Not supported on Montgomery curve")
    }, l.prototype.diffAdd = function (e, t) {
      var r = this.x.redAdd(this.z), i = this.x.redSub(this.z), n = e.x.redAdd(e.z), o = e.x.redSub(e.z).redMul(r),
          a = n.redMul(i), s = t.z.redMul(o.redAdd(a).redSqr()), l = t.x.redMul(o.redISub(a).redSqr());
      return this.curve.point(s, l)
    }, l.prototype.mul = function (e) {
      for (var t = e.clone(), r = this, i = this.curve.point(null, null), n = []; 0 !== t.cmpn(0); t.iushrn(1)) n.push(t.andln(1));
      for (var o = n.length - 1; 0 <= o; o--) 0 === n[o] ? (r = r.diffAdd(i, this), i = i.dbl()) : (i = r.diffAdd(i, this), r = r.dbl());
      return i
    }, l.prototype.mulAdd = function () {
      throw new Error("Not supported on Montgomery curve")
    }, l.prototype.jumlAdd = function () {
      throw new Error("Not supported on Montgomery curve")
    }, l.prototype.eq = function (e) {
      return 0 === this.getX().cmp(e.getX())
    }, l.prototype.normalize = function () {
      return this.x = this.x.redMul(this.z.redInvm()), this.z = this.curve.one, this
    }, l.prototype.getX = function () {
      return this.normalize(), this.x.fromRed()
    }
  }, {"../utils": 105, "./base": 92, "bn.js": 106, inherits: 142}],
  96: [function (e, t, r) {
    "use strict";
    var i = e("../utils"), w = e("bn.js"), n = e("inherits"), o = e("./base"), a = i.assert;

    function s(e) {
      o.call(this, "short", e), this.a = new w(e.a, 16).toRed(this.red), this.b = new w(e.b, 16).toRed(this.red), this.tinv = this.two.redInvm(), this.zeroA = 0 === this.a.fromRed().cmpn(0), this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3), this.endo = this._getEndomorphism(e), this._endoWnafT1 = new Array(4), this._endoWnafT2 = new Array(4)
    }

    function l(e, t, r, i) {
      o.BasePoint.call(this, e, "affine"), null === t && null === r ? (this.x = null, this.y = null, this.inf = !0) : (this.x = new w(t, 16), this.y = new w(r, 16), i && (this.x.forceRed(this.curve.red), this.y.forceRed(this.curve.red)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.inf = !1)
    }

    function u(e, t, r, i) {
      o.BasePoint.call(this, e, "jacobian"), null === t && null === r && null === i ? (this.x = this.curve.one, this.y = this.curve.one, this.z = new w(0)) : (this.x = new w(t, 16), this.y = new w(r, 16), this.z = new w(i, 16)), this.x.red || (this.x = this.x.toRed(this.curve.red)), this.y.red || (this.y = this.y.toRed(this.curve.red)), this.z.red || (this.z = this.z.toRed(this.curve.red)), this.zOne = this.z === this.curve.one
    }

    n(s, o), (t.exports = s).prototype._getEndomorphism = function (e) {
      var t, r, i, n;
      if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) return i = e.beta ? new w(e.beta, 16).toRed(this.red) : (i = (r = this._getEndoRoots(this.p))[0].cmp(r[1]) < 0 ? r[0] : r[1]).toRed(this.red), e.lambda ? t = new w(e.lambda, 16) : (n = this._getEndoRoots(this.n), 0 === this.g.mul(n[0]).x.cmp(this.g.x.redMul(i)) ? t = n[0] : (t = n[1], a(0 === this.g.mul(t).x.cmp(this.g.x.redMul(i))))), {
        beta: i,
        lambda: t,
        basis: e.basis ? e.basis.map(function (e) {
          return {a: new w(e.a, 16), b: new w(e.b, 16)}
        }) : this._getEndoBasis(t)
      }
    }, s.prototype._getEndoRoots = function (e) {
      var t = e === this.p ? this.red : w.mont(e), r = new w(2).toRed(t).redInvm(), i = r.redNeg(),
          n = new w(3).toRed(t).redNeg().redSqrt().redMul(r);
      return [i.redAdd(n).fromRed(), i.redSub(n).fromRed()]
    }, s.prototype._getEndoBasis = function (e) {
      for (var t, r, i, n, o, a, s, l = this.n.ushrn(Math.floor(this.n.bitLength() / 2)), u = e, c = this.n.clone(), h = new w(1), d = new w(0), f = new w(0), p = new w(1), y = 0; 0 !== u.cmpn(0);) {
        var m = c.div(u), g = c.sub(m.mul(u)), b = f.sub(m.mul(h)), v = p.sub(m.mul(d));
        if (!i && g.cmp(l) < 0) t = s.neg(), r = h, i = g.neg(), n = b; else if (i && 2 == ++y) break;
        c = u, u = s = g, f = h, h = b, p = d, d = v
      }
      o = g.neg(), a = b;
      var _ = i.sqr().add(n.sqr());
      return 0 <= o.sqr().add(a.sqr()).cmp(_) && (o = t, a = r), i.negative && (i = i.neg(), n = n.neg()), o.negative && (o = o.neg(), a = a.neg()), [{
        a: i,
        b: n
      }, {a: o, b: a}]
    }, s.prototype._endoSplit = function (e) {
      var t = this.endo.basis, r = t[0], i = t[1], n = i.b.mul(e).divRound(this.n),
          o = r.b.neg().mul(e).divRound(this.n), a = n.mul(r.a), s = o.mul(i.a), l = n.mul(r.b), u = o.mul(i.b);
      return {k1: e.sub(a).sub(s), k2: l.add(u).neg()}
    }, s.prototype.pointFromX = function (e, t) {
      (e = new w(e, 16)).red || (e = e.toRed(this.red));
      var r = e.redSqr().redMul(e).redIAdd(e.redMul(this.a)).redIAdd(this.b), i = r.redSqrt();
      if (0 !== i.redSqr().redSub(r).cmp(this.zero)) throw new Error("invalid point");
      var n = i.fromRed().isOdd();
      return (t && !n || !t && n) && (i = i.redNeg()), this.point(e, i)
    }, s.prototype.validate = function (e) {
      if (e.inf) return !0;
      var t = e.x, r = e.y, i = this.a.redMul(t), n = t.redSqr().redMul(t).redIAdd(i).redIAdd(this.b);
      return 0 === r.redSqr().redISub(n).cmpn(0)
    }, s.prototype._endoWnafMulAdd = function (e, t, r) {
      for (var i = this._endoWnafT1, n = this._endoWnafT2, o = 0; o < e.length; o++) {
        var a = this._endoSplit(t[o]), s = e[o], l = s._getBeta();
        a.k1.negative && (a.k1.ineg(), s = s.neg(!0)), a.k2.negative && (a.k2.ineg(), l = l.neg(!0)), i[2 * o] = s, i[2 * o + 1] = l, n[2 * o] = a.k1, n[2 * o + 1] = a.k2
      }
      for (var u = this._wnafMulAdd(1, i, n, 2 * o, r), c = 0; c < 2 * o; c++) i[c] = null, n[c] = null;
      return u
    }, n(l, o.BasePoint), s.prototype.point = function (e, t, r) {
      return new l(this, e, t, r)
    }, s.prototype.pointFromJSON = function (e, t) {
      return l.fromJSON(this, e, t)
    }, l.prototype._getBeta = function () {
      if (this.curve.endo) {
        var e = this.precomputed;
        if (e && e.beta) return e.beta;
        var t, r, i = this.curve.point(this.x.redMul(this.curve.endo.beta), this.y);
        return e && (t = this.curve, r = function (e) {
          return t.point(e.x.redMul(t.endo.beta), e.y)
        }, (e.beta = i).precomputed = {
          beta: null,
          naf: e.naf && {wnd: e.naf.wnd, points: e.naf.points.map(r)},
          doubles: e.doubles && {step: e.doubles.step, points: e.doubles.points.map(r)}
        }), i
      }
    }, l.prototype.toJSON = function () {
      return this.precomputed ? [this.x, this.y, this.precomputed && {
        doubles: this.precomputed.doubles && {
          step: this.precomputed.doubles.step,
          points: this.precomputed.doubles.points.slice(1)
        }, naf: this.precomputed.naf && {wnd: this.precomputed.naf.wnd, points: this.precomputed.naf.points.slice(1)}
      }] : [this.x, this.y]
    }, l.fromJSON = function (t, e, r) {
      "string" == typeof e && (e = JSON.parse(e));
      var i = t.point(e[0], e[1], r);
      if (!e[2]) return i;

      function n(e) {
        return t.point(e[0], e[1], r)
      }

      var o = e[2];
      return i.precomputed = {
        beta: null,
        doubles: o.doubles && {step: o.doubles.step, points: [i].concat(o.doubles.points.map(n))},
        naf: o.naf && {wnd: o.naf.wnd, points: [i].concat(o.naf.points.map(n))}
      }, i
    }, l.prototype.inspect = function () {
      return this.isInfinity() ? "<EC Point Infinity>" : "<EC Point x: " + this.x.fromRed().toString(16, 2) + " y: " + this.y.fromRed().toString(16, 2) + ">"
    }, l.prototype.isInfinity = function () {
      return this.inf
    }, l.prototype.add = function (e) {
      if (this.inf) return e;
      if (e.inf) return this;
      if (this.eq(e)) return this.dbl();
      if (this.neg().eq(e)) return this.curve.point(null, null);
      if (0 === this.x.cmp(e.x)) return this.curve.point(null, null);
      var t = this.y.redSub(e.y);
      0 !== t.cmpn(0) && (t = t.redMul(this.x.redSub(e.x).redInvm()));
      var r = t.redSqr().redISub(this.x).redISub(e.x), i = t.redMul(this.x.redSub(r)).redISub(this.y);
      return this.curve.point(r, i)
    }, l.prototype.dbl = function () {
      if (this.inf) return this;
      var e = this.y.redAdd(this.y);
      if (0 === e.cmpn(0)) return this.curve.point(null, null);
      var t = this.curve.a, r = this.x.redSqr(), i = e.redInvm(), n = r.redAdd(r).redIAdd(r).redIAdd(t).redMul(i),
          o = n.redSqr().redISub(this.x.redAdd(this.x)), a = n.redMul(this.x.redSub(o)).redISub(this.y);
      return this.curve.point(o, a)
    }, l.prototype.getX = function () {
      return this.x.fromRed()
    }, l.prototype.getY = function () {
      return this.y.fromRed()
    }, l.prototype.mul = function (e) {
      return e = new w(e, 16), this.isInfinity() ? this : this._hasDoubles(e) ? this.curve._fixedNafMul(this, e) : this.curve.endo ? this.curve._endoWnafMulAdd([this], [e]) : this.curve._wnafMul(this, e)
    }, l.prototype.mulAdd = function (e, t, r) {
      var i = [this, t], n = [e, r];
      return this.curve.endo ? this.curve._endoWnafMulAdd(i, n) : this.curve._wnafMulAdd(1, i, n, 2)
    }, l.prototype.jmulAdd = function (e, t, r) {
      var i = [this, t], n = [e, r];
      return this.curve.endo ? this.curve._endoWnafMulAdd(i, n, !0) : this.curve._wnafMulAdd(1, i, n, 2, !0)
    }, l.prototype.eq = function (e) {
      return this === e || this.inf === e.inf && (this.inf || 0 === this.x.cmp(e.x) && 0 === this.y.cmp(e.y))
    }, l.prototype.neg = function (e) {
      if (this.inf) return this;
      var t, r, i = this.curve.point(this.x, this.y.redNeg());
      return e && this.precomputed && (t = this.precomputed, r = function (e) {
        return e.neg()
      }, i.precomputed = {
        naf: t.naf && {wnd: t.naf.wnd, points: t.naf.points.map(r)},
        doubles: t.doubles && {step: t.doubles.step, points: t.doubles.points.map(r)}
      }), i
    }, l.prototype.toJ = function () {
      return this.inf ? this.curve.jpoint(null, null, null) : this.curve.jpoint(this.x, this.y, this.curve.one)
    }, n(u, o.BasePoint), s.prototype.jpoint = function (e, t, r) {
      return new u(this, e, t, r)
    }, u.prototype.toP = function () {
      if (this.isInfinity()) return this.curve.point(null, null);
      var e = this.z.redInvm(), t = e.redSqr(), r = this.x.redMul(t), i = this.y.redMul(t).redMul(e);
      return this.curve.point(r, i)
    }, u.prototype.neg = function () {
      return this.curve.jpoint(this.x, this.y.redNeg(), this.z)
    }, u.prototype.add = function (e) {
      if (this.isInfinity()) return e;
      if (e.isInfinity()) return this;
      var t = e.z.redSqr(), r = this.z.redSqr(), i = this.x.redMul(t), n = e.x.redMul(r),
          o = this.y.redMul(t.redMul(e.z)), a = e.y.redMul(r.redMul(this.z)), s = i.redSub(n), l = o.redSub(a);
      if (0 === s.cmpn(0)) return 0 !== l.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
      var u = s.redSqr(), c = u.redMul(s), h = i.redMul(u), d = l.redSqr().redIAdd(c).redISub(h).redISub(h),
          f = l.redMul(h.redISub(d)).redISub(o.redMul(c)), p = this.z.redMul(e.z).redMul(s);
      return this.curve.jpoint(d, f, p)
    }, u.prototype.mixedAdd = function (e) {
      if (this.isInfinity()) return e.toJ();
      if (e.isInfinity()) return this;
      var t = this.z.redSqr(), r = this.x, i = e.x.redMul(t), n = this.y, o = e.y.redMul(t).redMul(this.z),
          a = r.redSub(i), s = n.redSub(o);
      if (0 === a.cmpn(0)) return 0 !== s.cmpn(0) ? this.curve.jpoint(null, null, null) : this.dbl();
      var l = a.redSqr(), u = l.redMul(a), c = r.redMul(l), h = s.redSqr().redIAdd(u).redISub(c).redISub(c),
          d = s.redMul(c.redISub(h)).redISub(n.redMul(u)), f = this.z.redMul(a);
      return this.curve.jpoint(h, d, f)
    }, u.prototype.dblp = function (e) {
      if (0 === e) return this;
      if (this.isInfinity()) return this;
      if (!e) return this.dbl();
      if (this.curve.zeroA || this.curve.threeA) {
        for (var t = this, r = 0; r < e; r++) t = t.dbl();
        return t
      }
      for (var i = this.curve.a, n = this.curve.tinv, o = this.x, a = this.y, s = this.z, l = s.redSqr().redSqr(), u = a.redAdd(a), r = 0; r < e; r++) {
        var c = o.redSqr(), h = u.redSqr(), d = h.redSqr(), f = c.redAdd(c).redIAdd(c).redIAdd(i.redMul(l)),
            p = o.redMul(h), y = f.redSqr().redISub(p.redAdd(p)), m = p.redISub(y),
            g = (g = f.redMul(m)).redIAdd(g).redISub(d), b = u.redMul(s);
        r + 1 < e && (l = l.redMul(d)), o = y, s = b, u = g
      }
      return this.curve.jpoint(o, u.redMul(n), s)
    }, u.prototype.dbl = function () {
      return this.isInfinity() ? this : this.curve.zeroA ? this._zeroDbl() : this.curve.threeA ? this._threeDbl() : this._dbl()
    }, u.prototype._zeroDbl = function () {
      var e, t, r, i, n, o, a, s, l, u, c, h, d, f, p, y,
          m = this.zOne ? (r = this.x.redSqr(), n = (i = this.y.redSqr()).redSqr(), o = (o = this.x.redAdd(i).redSqr().redISub(r).redISub(n)).redIAdd(o), s = (a = r.redAdd(r).redIAdd(r)).redSqr().redISub(o).redISub(o), l = (l = (l = n.redIAdd(n)).redIAdd(l)).redIAdd(l), e = s, t = a.redMul(o.redISub(s)).redISub(l), this.y.redAdd(this.y)) : (u = this.x.redSqr(), h = (c = this.y.redSqr()).redSqr(), d = (d = this.x.redAdd(c).redSqr().redISub(u).redISub(h)).redIAdd(d), p = (f = u.redAdd(u).redIAdd(u)).redSqr(), y = (y = (y = h.redIAdd(h)).redIAdd(y)).redIAdd(y), e = p.redISub(d).redISub(d), t = f.redMul(d.redISub(e)).redISub(y), (m = this.y.redMul(this.z)).redIAdd(m));
      return this.curve.jpoint(e, t, m)
    }, u.prototype._threeDbl = function () {
      var e, t, r, i, n, o, a, s, l, u, c, h, d, f, p, y, m;
      return this.zOne ? (r = this.x.redSqr(), n = (i = this.y.redSqr()).redSqr(), o = (o = this.x.redAdd(i).redSqr().redISub(r).redISub(n)).redIAdd(o), l = s = (a = r.redAdd(r).redIAdd(r).redIAdd(this.curve.a)).redSqr().redISub(o).redISub(o), u = (u = (u = n.redIAdd(n)).redIAdd(u)).redIAdd(u), e = a.redMul(o.redISub(s)).redISub(u), t = this.y.redAdd(this.y)) : (c = this.z.redSqr(), h = this.y.redSqr(), d = this.x.redMul(h), f = (f = this.x.redSub(c).redMul(this.x.redAdd(c))).redAdd(f).redIAdd(f), y = (p = (p = d.redIAdd(d)).redIAdd(p)).redAdd(p), l = f.redSqr().redISub(y), t = this.y.redAdd(this.z).redSqr().redISub(h).redISub(c), m = (m = (m = (m = h.redSqr()).redIAdd(m)).redIAdd(m)).redIAdd(m), e = f.redMul(p.redISub(l)).redISub(m)), this.curve.jpoint(l, e, t)
    }, u.prototype._dbl = function () {
      var e = this.curve.a, t = this.x, r = this.y, i = this.z, n = i.redSqr().redSqr(), o = t.redSqr(), a = r.redSqr(),
          s = o.redAdd(o).redIAdd(o).redIAdd(e.redMul(n)), l = t.redAdd(t), u = (l = l.redIAdd(l)).redMul(a),
          c = s.redSqr().redISub(u.redAdd(u)), h = u.redISub(c), d = a.redSqr();
      d = (d = (d = d.redIAdd(d)).redIAdd(d)).redIAdd(d);
      var f = s.redMul(h).redISub(d), p = r.redAdd(r).redMul(i);
      return this.curve.jpoint(c, f, p)
    }, u.prototype.trpl = function () {
      if (!this.curve.zeroA) return this.dbl().add(this);
      var e = this.x.redSqr(), t = this.y.redSqr(), r = this.z.redSqr(), i = t.redSqr(), n = e.redAdd(e).redIAdd(e),
          o = n.redSqr(), a = this.x.redAdd(t).redSqr().redISub(e).redISub(i),
          s = (a = (a = (a = a.redIAdd(a)).redAdd(a).redIAdd(a)).redISub(o)).redSqr(), l = i.redIAdd(i);
      l = (l = (l = l.redIAdd(l)).redIAdd(l)).redIAdd(l);
      var u = n.redIAdd(a).redSqr().redISub(o).redISub(s).redISub(l), c = t.redMul(u);
      c = (c = c.redIAdd(c)).redIAdd(c);
      var h = this.x.redMul(s).redISub(c);
      h = (h = h.redIAdd(h)).redIAdd(h);
      var d = this.y.redMul(u.redMul(l.redISub(u)).redISub(a.redMul(s)));
      d = (d = (d = d.redIAdd(d)).redIAdd(d)).redIAdd(d);
      var f = this.z.redAdd(a).redSqr().redISub(r).redISub(s);
      return this.curve.jpoint(h, d, f)
    }, u.prototype.mul = function (e, t) {
      return e = new w(e, t), this.curve._wnafMul(this, e)
    }, u.prototype.eq = function (e) {
      if ("affine" === e.type) return this.eq(e.toJ());
      if (this === e) return !0;
      var t = this.z.redSqr(), r = e.z.redSqr();
      if (0 !== this.x.redMul(r).redISub(e.x.redMul(t)).cmpn(0)) return !1;
      var i = t.redMul(this.z), n = r.redMul(e.z);
      return 0 === this.y.redMul(n).redISub(e.y.redMul(i)).cmpn(0)
    }, u.prototype.eqXToP = function (e) {
      var t = this.z.redSqr(), r = e.toRed(this.curve.red).redMul(t);
      if (0 === this.x.cmp(r)) return !0;
      for (var i = e.clone(), n = this.curve.redN.redMul(t); ;) {
        if (i.iadd(this.curve.n), 0 <= i.cmp(this.curve.p)) return !1;
        if (r.redIAdd(n), 0 === this.x.cmp(r)) return !0
      }
    }, u.prototype.inspect = function () {
      return this.isInfinity() ? "<EC JPoint Infinity>" : "<EC JPoint x: " + this.x.toString(16, 2) + " y: " + this.y.toString(16, 2) + " z: " + this.z.toString(16, 2) + ">"
    }, u.prototype.isInfinity = function () {
      return 0 === this.z.cmpn(0)
    }
  }, {"../utils": 105, "./base": 92, "bn.js": 106, inherits: 142}],
  97: [function (e, t, r) {
    "use strict";
    var i, n = r, o = e("hash.js"), a = e("./curve"), s = e("./utils").assert;

    function l(e) {
      "short" === e.type ? this.curve = new a["short"](e) : "edwards" === e.type ? this.curve = new a.edwards(e) : this.curve = new a.mont(e), this.g = this.curve.g, this.n = this.curve.n, this.hash = e.hash, s(this.g.validate(), "Invalid curve"), s(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O")
    }

    function u(t, r) {
      Object.defineProperty(n, t, {
        configurable: !0, enumerable: !0, get: function () {
          var e = new l(r);
          return Object.defineProperty(n, t, {configurable: !0, enumerable: !0, value: e}), e
        }
      })
    }

    n.PresetCurve = l, u("p192", {
      type: "short",
      prime: "p192",
      p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
      a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
      b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
      n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
      hash: o.sha256,
      gRed: !1,
      g: ["188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012", "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811"]
    }), u("p224", {
      type: "short",
      prime: "p224",
      p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
      a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
      b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
      n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
      hash: o.sha256,
      gRed: !1,
      g: ["b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21", "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34"]
    }), u("p256", {
      type: "short",
      prime: null,
      p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
      a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
      b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
      n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
      hash: o.sha256,
      gRed: !1,
      g: ["6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296", "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5"]
    }), u("p384", {
      type: "short",
      prime: null,
      p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
      a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
      b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
      n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
      hash: o.sha384,
      gRed: !1,
      g: ["aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7", "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f"]
    }), u("p521", {
      type: "short",
      prime: null,
      p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
      a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
      b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
      n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
      hash: o.sha512,
      gRed: !1,
      g: ["000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66", "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650"]
    }), u("curve25519", {
      type: "mont",
      prime: "p25519",
      p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
      a: "76d06",
      b: "1",
      n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
      hash: o.sha256,
      gRed: !1,
      g: ["9"]
    }), u("ed25519", {
      type: "edwards",
      prime: "p25519",
      p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
      a: "-1",
      c: "1",
      d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
      n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
      hash: o.sha256,
      gRed: !1,
      g: ["216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a", "6666666666666666666666666666666666666666666666666666666666666658"]
    });
    try {
      i = e("./precomputed/secp256k1")
    } catch (e) {
      i = void 0
    }
    u("secp256k1", {
      type: "short",
      prime: "k256",
      p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
      a: "0",
      b: "7",
      n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
      h: "1",
      hash: o.sha256,
      beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
      lambda: "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
      basis: [{
        a: "3086d221a7d46bcde86c90e49284eb15",
        b: "-e4437ed6010e88286f547fa90abfe4c3"
      }, {a: "114ca50f7a8e2f3f657c1108d9d44cfd8", b: "3086d221a7d46bcde86c90e49284eb15"}],
      gRed: !1,
      g: ["79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798", "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8", i]
    })
  }, {"./curve": 94, "./precomputed/secp256k1": 104, "./utils": 105, "hash.js": 128}],
  98: [function (e, t, r) {
    "use strict";
    var m = e("bn.js"), g = e("hmac-drbg"), i = e("../utils"), n = e("../curves"), o = e("brorand"), f = i.assert,
        a = e("./key"), b = e("./signature");

    function s(e) {
      if (!(this instanceof s)) return new s(e);
      "string" == typeof e && (f(n.hasOwnProperty(e), "Unknown curve " + e), e = n[e]), e instanceof n.PresetCurve && (e = {curve: e}), this.curve = e.curve.curve, this.n = this.curve.n, this.nh = this.n.ushrn(1), this.g = this.curve.g, this.g = e.curve.g, this.g.precompute(e.curve.n.bitLength() + 1), this.hash = e.hash || e.curve.hash
    }

    (t.exports = s).prototype.keyPair = function (e) {
      return new a(this, e)
    }, s.prototype.keyFromPrivate = function (e, t) {
      return a.fromPrivate(this, e, t)
    }, s.prototype.keyFromPublic = function (e, t) {
      return a.fromPublic(this, e, t)
    }, s.prototype.genKeyPair = function (e) {
      e = e || {};
      for (var t = new g({
        hash: this.hash,
        pers: e.pers,
        persEnc: e.persEnc || "utf8",
        entropy: e.entropy || o(this.hash.hmacStrength),
        entropyEnc: e.entropy && e.entropyEnc || "utf8",
        nonce: this.n.toArray()
      }), r = this.n.byteLength(), i = this.n.sub(new m(2)); ;) {
        var n = new m(t.generate(r));
        if (!(0 < n.cmp(i))) return n.iaddn(1), this.keyFromPrivate(n)
      }
    }, s.prototype._truncateToN = function (e, t) {
      var r = 8 * e.byteLength() - this.n.bitLength();
      return 0 < r && (e = e.ushrn(r)), !t && 0 <= e.cmp(this.n) ? e.sub(this.n) : e
    }, s.prototype.sign = function (e, t, r, i) {
      "object" == typeof r && (i = r, r = null), i = i || {}, t = this.keyFromPrivate(t, r), e = this._truncateToN(new m(e, 16));
      for (var n = this.n.byteLength(), o = t.getPrivate().toArray("be", n), a = e.toArray("be", n), s = new g({
        hash: this.hash,
        entropy: o,
        nonce: a,
        pers: i.pers,
        persEnc: i.persEnc || "utf8"
      }), l = this.n.sub(new m(1)), u = 0; ; u++) {
        var c = i.k ? i.k(u) : new m(s.generate(this.n.byteLength()));
        if (!((c = this._truncateToN(c, !0)).cmpn(1) <= 0 || 0 <= c.cmp(l))) {
          var h = this.g.mul(c);
          if (!h.isInfinity()) {
            var d = h.getX(), f = d.umod(this.n);
            if (0 !== f.cmpn(0)) {
              var p = c.invm(this.n).mul(f.mul(t.getPrivate()).iadd(e));
              if (0 !== (p = p.umod(this.n)).cmpn(0)) {
                var y = (h.getY().isOdd() ? 1 : 0) | (0 !== d.cmp(f) ? 2 : 0);
                return i.canonical && 0 < p.cmp(this.nh) && (p = this.n.sub(p), y ^= 1), new b({
                  r: f,
                  s: p,
                  recoveryParam: y
                })
              }
            }
          }
        }
      }
    }, s.prototype.verify = function (e, t, r, i) {
      e = this._truncateToN(new m(e, 16)), r = this.keyFromPublic(r, i);
      var n = (t = new b(t, "hex")).r, o = t.s;
      if (n.cmpn(1) < 0 || 0 <= n.cmp(this.n)) return !1;
      if (o.cmpn(1) < 0 || 0 <= o.cmp(this.n)) return !1;
      var a, s = o.invm(this.n), l = s.mul(e).umod(this.n), u = s.mul(n).umod(this.n);
      return this.curve._maxwellTrick ? !(a = this.g.jmulAdd(l, r.getPublic(), u)).isInfinity() && a.eqXToP(n) : !(a = this.g.mulAdd(l, r.getPublic(), u)).isInfinity() && 0 === a.getX().umod(this.n).cmp(n)
    }, s.prototype.recoverPubKey = function (e, t, r, i) {
      f((3 & r) === r, "The recovery param is more than two bits"), t = new b(t, i);
      var n = this.n, o = new m(e), a = t.r, s = t.s, l = 1 & r, u = r >> 1;
      if (0 <= a.cmp(this.curve.p.umod(this.curve.n)) && u) throw new Error("Unable to find sencond key candinate");
      a = u ? this.curve.pointFromX(a.add(this.curve.n), l) : this.curve.pointFromX(a, l);
      var c = t.r.invm(n), h = n.sub(o).mul(c).umod(n), d = s.mul(c).umod(n);
      return this.g.mulAdd(h, a, d)
    }, s.prototype.getKeyRecoveryParam = function (e, t, r, i) {
      if (null !== (t = new b(t, i)).recoveryParam) return t.recoveryParam;
      for (var n, o = 0; o < 4; o++) {
        try {
          n = this.recoverPubKey(e, t, o)
        } catch (e) {
          continue
        }
        if (n.eq(r)) return o
      }
      throw new Error("Unable to find valid recovery factor")
    }
  }, {"../curves": 97, "../utils": 105, "./key": 99, "./signature": 100, "bn.js": 106, brorand: 18, "hmac-drbg": 140}],
  99: [function (e, t, r) {
    "use strict";
    var i = e("bn.js"), n = e("../utils").assert;

    function o(e, t) {
      this.ec = e, this.priv = null, this.pub = null, t.priv && this._importPrivate(t.priv, t.privEnc), t.pub && this._importPublic(t.pub, t.pubEnc)
    }

    (t.exports = o).fromPublic = function (e, t, r) {
      return t instanceof o ? t : new o(e, {pub: t, pubEnc: r})
    }, o.fromPrivate = function (e, t, r) {
      return t instanceof o ? t : new o(e, {priv: t, privEnc: r})
    }, o.prototype.validate = function () {
      var e = this.getPublic();
      return e.isInfinity() ? {
        result: !1,
        reason: "Invalid public key"
      } : e.validate() ? e.mul(this.ec.curve.n).isInfinity() ? {result: !0, reason: null} : {
        result: !1,
        reason: "Public key * N != O"
      } : {result: !1, reason: "Public key is not a point"}
    }, o.prototype.getPublic = function (e, t) {
      return "string" == typeof e && (t = e, e = null), this.pub || (this.pub = this.ec.g.mul(this.priv)), t ? this.pub.encode(t, e) : this.pub
    }, o.prototype.getPrivate = function (e) {
      return "hex" === e ? this.priv.toString(16, 2) : this.priv
    }, o.prototype._importPrivate = function (e, t) {
      this.priv = new i(e, t || 16), this.priv = this.priv.umod(this.ec.curve.n)
    }, o.prototype._importPublic = function (e, t) {
      if (e.x || e.y) return "mont" === this.ec.curve.type ? n(e.x, "Need x coordinate") : "short" !== this.ec.curve.type && "edwards" !== this.ec.curve.type || n(e.x && e.y, "Need both x and y coordinate"), void (this.pub = this.ec.curve.point(e.x, e.y));
      this.pub = this.ec.curve.decodePoint(e, t)
    }, o.prototype.derive = function (e) {
      return e.mul(this.priv).getX()
    }, o.prototype.sign = function (e, t, r) {
      return this.ec.sign(e, this, t, r)
    }, o.prototype.verify = function (e, t) {
      return this.ec.verify(e, t, this)
    }, o.prototype.inspect = function () {
      return "<Key priv: " + (this.priv && this.priv.toString(16, 2)) + " pub: " + (this.pub && this.pub.inspect()) + " >"
    }
  }, {"../utils": 105, "bn.js": 106}],
  100: [function (e, t, r) {
    "use strict";
    var s = e("bn.js"), l = e("../utils"), i = l.assert;

    function n(e, t) {
      if (e instanceof n) return e;
      this._importDER(e, t) || (i(e.r && e.s, "Signature without r or s"), this.r = new s(e.r, 16), this.s = new s(e.s, 16), void 0 === e.recoveryParam ? this.recoveryParam = null : this.recoveryParam = e.recoveryParam)
    }

    function u() {
      this.place = 0
    }

    function c(e, t) {
      var r = e[t.place++];
      if (!(128 & r)) return r;
      for (var i = 15 & r, n = 0, o = 0, a = t.place; o < i; o++, a++) n <<= 8, n |= e[a];
      return t.place = a, n
    }

    function a(e) {
      for (var t = 0, r = e.length - 1; !e[t] && !(128 & e[t + 1]) && t < r;) t++;
      return 0 === t ? e : e.slice(t)
    }

    function h(e, t) {
      if (t < 128) e.push(t); else {
        var r = 1 + (Math.log(t) / Math.LN2 >>> 3);
        for (e.push(128 | r); --r;) e.push(t >>> (r << 3) & 255);
        e.push(t)
      }
    }

    (t.exports = n).prototype._importDER = function (e, t) {
      e = l.toArray(e, t);
      var r = new u;
      if (48 !== e[r.place++]) return !1;
      if (c(e, r) + r.place !== e.length) return !1;
      if (2 !== e[r.place++]) return !1;
      var i = c(e, r), n = e.slice(r.place, i + r.place);
      if (r.place += i, 2 !== e[r.place++]) return !1;
      var o = c(e, r);
      if (e.length !== o + r.place) return !1;
      var a = e.slice(r.place, o + r.place);
      return 0 === n[0] && 128 & n[1] && (n = n.slice(1)), 0 === a[0] && 128 & a[1] && (a = a.slice(1)), this.r = new s(n), this.s = new s(a), !(this.recoveryParam = null)
    }, n.prototype.toDER = function (e) {
      var t = this.r.toArray(), r = this.s.toArray();
      for (128 & t[0] && (t = [0].concat(t)), 128 & r[0] && (r = [0].concat(r)), t = a(t), r = a(r); !(r[0] || 128 & r[1]);) r = r.slice(1);
      var i = [2];
      h(i, t.length), (i = i.concat(t)).push(2), h(i, r.length);
      var n = i.concat(r), o = [48];
      return h(o, n.length), o = o.concat(n), l.encode(o, e)
    }
  }, {"../utils": 105, "bn.js": 106}],
  101: [function (e, t, r) {
    "use strict";
    var i = e("hash.js"), n = e("../curves"), o = e("../utils"), a = o.assert, l = o.parseBytes, s = e("./key"),
        u = e("./signature");

    function c(e) {
      if (a("ed25519" === e, "only tested with ed25519 so far"), !(this instanceof c)) return new c(e);
      e = n[e].curve;
      this.curve = e, this.g = e.g, this.g.precompute(e.n.bitLength() + 1), this.pointClass = e.point().constructor, this.encodingLength = Math.ceil(e.n.bitLength() / 8), this.hash = i.sha512
    }

    (t.exports = c).prototype.sign = function (e, t) {
      e = l(e);
      var r = this.keyFromSecret(t), i = this.hashInt(r.messagePrefix(), e), n = this.g.mul(i), o = this.encodePoint(n),
          a = this.hashInt(o, r.pubBytes(), e).mul(r.priv()), s = i.add(a).umod(this.curve.n);
      return this.makeSignature({R: n, S: s, Rencoded: o})
    }, c.prototype.verify = function (e, t, r) {
      e = l(e), t = this.makeSignature(t);
      var i = this.keyFromPublic(r), n = this.hashInt(t.Rencoded(), i.pubBytes(), e), o = this.g.mul(t.S());
      return t.R().add(i.pub().mul(n)).eq(o)
    }, c.prototype.hashInt = function () {
      for (var e = this.hash(), t = 0; t < arguments.length; t++) e.update(arguments[t]);
      return o.intFromLE(e.digest()).umod(this.curve.n)
    }, c.prototype.keyFromPublic = function (e) {
      return s.fromPublic(this, e)
    }, c.prototype.keyFromSecret = function (e) {
      return s.fromSecret(this, e)
    }, c.prototype.makeSignature = function (e) {
      return e instanceof u ? e : new u(this, e)
    }, c.prototype.encodePoint = function (e) {
      var t = e.getY().toArray("le", this.encodingLength);
      return t[this.encodingLength - 1] |= e.getX().isOdd() ? 128 : 0, t
    }, c.prototype.decodePoint = function (e) {
      var t = (e = o.parseBytes(e)).length - 1, r = e.slice(0, t).concat(-129 & e[t]), i = 0 != (128 & e[t]),
          n = o.intFromLE(r);
      return this.curve.pointFromY(n, i)
    }, c.prototype.encodeInt = function (e) {
      return e.toArray("le", this.encodingLength)
    }, c.prototype.decodeInt = function (e) {
      return o.intFromLE(e)
    }, c.prototype.isPoint = function (e) {
      return e instanceof this.pointClass
    }
  }, {"../curves": 97, "../utils": 105, "./key": 102, "./signature": 103, "hash.js": 128}],
  102: [function (e, t, r) {
    "use strict";
    var i = e("../utils"), n = i.assert, o = i.parseBytes, a = i.cachedProperty;

    function s(e, t) {
      this.eddsa = e, this._secret = o(t.secret), e.isPoint(t.pub) ? this._pub = t.pub : this._pubBytes = o(t.pub)
    }

    s.fromPublic = function (e, t) {
      return t instanceof s ? t : new s(e, {pub: t})
    }, s.fromSecret = function (e, t) {
      return t instanceof s ? t : new s(e, {secret: t})
    }, s.prototype.secret = function () {
      return this._secret
    }, a(s, "pubBytes", function () {
      return this.eddsa.encodePoint(this.pub())
    }), a(s, "pub", function () {
      return this._pubBytes ? this.eddsa.decodePoint(this._pubBytes) : this.eddsa.g.mul(this.priv())
    }), a(s, "privBytes", function () {
      var e = this.eddsa, t = this.hash(), r = e.encodingLength - 1, i = t.slice(0, e.encodingLength);
      return i[0] &= 248, i[r] &= 127, i[r] |= 64, i
    }), a(s, "priv", function () {
      return this.eddsa.decodeInt(this.privBytes())
    }), a(s, "hash", function () {
      return this.eddsa.hash().update(this.secret()).digest()
    }), a(s, "messagePrefix", function () {
      return this.hash().slice(this.eddsa.encodingLength)
    }), s.prototype.sign = function (e) {
      return n(this._secret, "KeyPair can only verify"), this.eddsa.sign(e, this)
    }, s.prototype.verify = function (e, t) {
      return this.eddsa.verify(e, t, this)
    }, s.prototype.getSecret = function (e) {
      return n(this._secret, "KeyPair is public only"), i.encode(this.secret(), e)
    }, s.prototype.getPublic = function (e) {
      return i.encode(this.pubBytes(), e)
    }, t.exports = s
  }, {"../utils": 105}],
  103: [function (e, t, r) {
    "use strict";
    var i = e("bn.js"), n = e("../utils"), o = n.assert, a = n.cachedProperty, s = n.parseBytes;

    function l(e, t) {
      this.eddsa = e, "object" != typeof t && (t = s(t)), Array.isArray(t) && (t = {
        R: t.slice(0, e.encodingLength),
        S: t.slice(e.encodingLength)
      }), o(t.R && t.S, "Signature without R or S"), e.isPoint(t.R) && (this._R = t.R), t.S instanceof i && (this._S = t.S), this._Rencoded = Array.isArray(t.R) ? t.R : t.Rencoded, this._Sencoded = Array.isArray(t.S) ? t.S : t.Sencoded
    }

    a(l, "S", function () {
      return this.eddsa.decodeInt(this.Sencoded())
    }), a(l, "R", function () {
      return this.eddsa.decodePoint(this.Rencoded())
    }), a(l, "Rencoded", function () {
      return this.eddsa.encodePoint(this.R())
    }), a(l, "Sencoded", function () {
      return this.eddsa.encodeInt(this.S())
    }), l.prototype.toBytes = function () {
      return this.Rencoded().concat(this.Sencoded())
    }, l.prototype.toHex = function () {
      return n.encode(this.toBytes(), "hex").toUpperCase()
    }, t.exports = l
  }, {"../utils": 105, "bn.js": 106}],
  104: [function (e, t, r) {
    t.exports = {
      doubles: {
        step: 4,
        points: [["e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a", "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821"], ["8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508", "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf"], ["175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739", "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695"], ["363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640", "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9"], ["8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c", "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36"], ["723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda", "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f"], ["eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa", "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999"], ["100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0", "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09"], ["e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d", "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d"], ["feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d", "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088"], ["da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1", "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d"], ["53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0", "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8"], ["8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047", "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a"], ["385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862", "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453"], ["6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7", "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160"], ["3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd", "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0"], ["85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83", "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6"], ["948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a", "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589"], ["6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8", "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17"], ["e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d", "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda"], ["e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725", "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd"], ["213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754", "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2"], ["4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c", "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6"], ["fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6", "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f"], ["76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39", "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01"], ["c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891", "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3"], ["d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b", "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f"], ["b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03", "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7"], ["e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d", "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78"], ["a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070", "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1"], ["90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4", "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150"], ["8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da", "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82"], ["e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11", "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc"], ["8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e", "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b"], ["e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41", "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51"], ["b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef", "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45"], ["d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8", "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120"], ["324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d", "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84"], ["4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96", "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d"], ["9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd", "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d"], ["6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5", "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8"], ["a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266", "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8"], ["7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71", "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac"], ["928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac", "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f"], ["85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751", "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962"], ["ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e", "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907"], ["827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241", "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec"], ["eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3", "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d"], ["e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f", "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414"], ["1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19", "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd"], ["146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be", "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0"], ["fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9", "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811"], ["da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2", "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1"], ["a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13", "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c"], ["174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c", "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73"], ["959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba", "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd"], ["d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151", "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405"], ["64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073", "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589"], ["8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458", "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e"], ["13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b", "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27"], ["bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366", "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1"], ["8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa", "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482"], ["8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0", "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945"], ["dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787", "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573"], ["f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e", "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82"]]
      }, naf: {
        wnd: 7,
        points: [["f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9", "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672"], ["2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4", "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6"], ["5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc", "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da"], ["acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe", "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37"], ["774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb", "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b"], ["f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8", "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81"], ["d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e", "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58"], ["defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34", "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77"], ["2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c", "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a"], ["352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5", "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c"], ["2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f", "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67"], ["9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714", "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402"], ["daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729", "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55"], ["c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db", "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482"], ["6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4", "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82"], ["1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5", "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396"], ["605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479", "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49"], ["62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d", "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf"], ["80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f", "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a"], ["7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb", "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7"], ["d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9", "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933"], ["49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963", "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a"], ["77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74", "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6"], ["f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530", "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37"], ["463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b", "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e"], ["f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247", "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6"], ["caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1", "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476"], ["2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120", "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40"], ["7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435", "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61"], ["754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18", "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683"], ["e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8", "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5"], ["186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb", "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b"], ["df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f", "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417"], ["5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143", "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868"], ["290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba", "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a"], ["af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45", "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6"], ["766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a", "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996"], ["59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e", "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e"], ["f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8", "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d"], ["7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c", "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2"], ["948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519", "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e"], ["7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab", "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437"], ["3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca", "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311"], ["d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf", "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4"], ["1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610", "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575"], ["733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4", "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d"], ["15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c", "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d"], ["a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940", "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629"], ["e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980", "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06"], ["311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3", "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374"], ["34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf", "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee"], ["f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63", "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1"], ["d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448", "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b"], ["32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf", "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661"], ["7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5", "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6"], ["ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6", "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e"], ["16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5", "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d"], ["eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99", "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc"], ["78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51", "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4"], ["494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5", "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c"], ["a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5", "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b"], ["c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997", "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913"], ["841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881", "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154"], ["5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5", "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865"], ["36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66", "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc"], ["336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726", "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224"], ["8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede", "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e"], ["1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94", "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6"], ["85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31", "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511"], ["29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51", "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b"], ["a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252", "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2"], ["4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5", "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c"], ["d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b", "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3"], ["ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4", "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d"], ["af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f", "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700"], ["e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889", "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4"], ["591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246", "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196"], ["11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984", "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4"], ["3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a", "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257"], ["cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030", "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13"], ["c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197", "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096"], ["c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593", "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38"], ["a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef", "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f"], ["347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38", "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448"], ["da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a", "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a"], ["c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111", "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4"], ["4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502", "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437"], ["3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea", "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7"], ["cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26", "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d"], ["b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986", "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a"], ["d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e", "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54"], ["48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4", "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77"], ["dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda", "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517"], ["6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859", "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10"], ["e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f", "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125"], ["eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c", "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e"], ["13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942", "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1"], ["ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a", "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2"], ["b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80", "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423"], ["ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d", "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8"], ["8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1", "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758"], ["52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63", "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375"], ["e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352", "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d"], ["7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193", "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec"], ["5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00", "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0"], ["32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58", "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c"], ["e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7", "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4"], ["8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8", "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f"], ["4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e", "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649"], ["3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d", "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826"], ["674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b", "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5"], ["d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f", "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87"], ["30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6", "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b"], ["be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297", "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc"], ["93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a", "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c"], ["b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c", "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f"], ["d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52", "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a"], ["d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb", "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46"], ["463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065", "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f"], ["7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917", "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03"], ["74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9", "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08"], ["30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3", "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8"], ["9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57", "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373"], ["176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66", "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3"], ["75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8", "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8"], ["809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721", "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1"], ["1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180", "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9"]]
      }
    }
  }, {}],
  105: [function (e, t, r) {
    "use strict";
    var i = r, n = e("bn.js"), o = e("minimalistic-assert"), a = e("minimalistic-crypto-utils");
    i.assert = o, i.toArray = a.toArray, i.zero2 = a.zero2, i.toHex = a.toHex, i.encode = a.encode, i.getNAF = function (e, t, r) {
      var i = new Array(Math.max(e.bitLength(), r) + 1);
      i.fill(0);
      for (var n = 1 << t + 1, o = e.clone(), a = 0; a < i.length; a++) {
        var s, l = o.andln(n - 1);
        o.isOdd() ? (s = (n >> 1) - 1 < l ? (n >> 1) - l : l, o.isubn(s)) : s = 0, i[a] = s, o.iushrn(1)
      }
      return i
    }, i.getJSF = function (e, t) {
      var r = [[], []];
      e = e.clone(), t = t.clone();
      for (var i = 0, n = 0; 0 < e.cmpn(-i) || 0 < t.cmpn(-n);) {
        var o, a, s, l = e.andln(3) + i & 3, u = t.andln(3) + n & 3;
        3 === l && (l = -1), 3 === u && (u = -1), o = 0 == (1 & l) ? 0 : 3 !== (a = e.andln(7) + i & 7) && 5 !== a || 2 !== u ? l : -l, r[0].push(o), s = 0 == (1 & u) ? 0 : 3 !== (a = t.andln(7) + n & 7) && 5 !== a || 2 !== l ? u : -u, r[1].push(s), 2 * i === o + 1 && (i = 1 - i), 2 * n === s + 1 && (n = 1 - n), e.iushrn(1), t.iushrn(1)
      }
      return r
    }, i.cachedProperty = function (e, t, r) {
      var i = "_" + t;
      e.prototype[t] = function () {
        return void 0 !== this[i] ? this[i] : this[i] = r.call(this)
      }
    }, i.parseBytes = function (e) {
      return "string" == typeof e ? i.toArray(e, "hex") : e
    }, i.intFromLE = function (e) {
      return new n(e, "hex", "le")
    }
  }, {"bn.js": 106, "minimalistic-assert": 148, "minimalistic-crypto-utils": 149}],
  106: [function (e, t, r) {
    arguments[4][15][0].apply(r, arguments)
  }, {buffer: 19, dup: 15}],
  107: [function (e, t, r) {
    t.exports = {
      _from: "elliptic@^6.0.0",
      _id: "elliptic@6.5.2",
      _inBundle: !1,
      _integrity: "sha512-f4x70okzZbIQl/NSRLkI/+tteV/9WqL98zx+SQ69KbXxmVrmjwsNUPn/gYJJ0sHvEak24cZgHIPegRePAtA/xw==",
      _location: "/elliptic",
      _phantomChildren: {},
      _requested: {
        type: "range",
        registry: !0,
        raw: "elliptic@^6.0.0",
        name: "elliptic",
        escapedName: "elliptic",
        rawSpec: "^6.0.0",
        saveSpec: null,
        fetchSpec: "^6.0.0"
      },
      _requiredBy: ["/browserify-sign", "/create-ecdh"],
      _resolved: "https://registry.npmjs.org/elliptic/-/elliptic-6.5.2.tgz",
      _shasum: "05c5678d7173c049d8ca433552224a495d0e3762",
      _spec: "elliptic@^6.0.0",
      _where: "/Users/fjq/work/prismplayer/node_modules/browserify-sign",
      author: {name: "Fedor Indutny", email: "fedor@indutny.com"},
      bugs: {url: "https://github.com/indutny/elliptic/issues"},
      bundleDependencies: !1,
      dependencies: {
        "bn.js": "^4.4.0",
        brorand: "^1.0.1",
        "hash.js": "^1.0.0",
        "hmac-drbg": "^1.0.0",
        inherits: "^2.0.1",
        "minimalistic-assert": "^1.0.0",
        "minimalistic-crypto-utils": "^1.0.0"
      },
      deprecated: !1,
      description: "EC cryptography",
      devDependencies: {
        brfs: "^1.4.3",
        coveralls: "^3.0.8",
        grunt: "^1.0.4",
        "grunt-browserify": "^5.0.0",
        "grunt-cli": "^1.2.0",
        "grunt-contrib-connect": "^1.0.0",
        "grunt-contrib-copy": "^1.0.0",
        "grunt-contrib-uglify": "^1.0.1",
        "grunt-mocha-istanbul": "^3.0.1",
        "grunt-saucelabs": "^9.0.1",
        istanbul: "^0.4.2",
        jscs: "^3.0.7",
        jshint: "^2.10.3",
        mocha: "^6.2.2"
      },
      files: ["lib"],
      homepage: "https://github.com/indutny/elliptic",
      keywords: ["EC", "Elliptic", "curve", "Cryptography"],
      license: "MIT",
      main: "lib/elliptic.js",
      name: "elliptic",
      repository: {type: "git", url: "git+ssh://git@github.com/indutny/elliptic.git"},
      scripts: {
        jscs: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
        jshint: "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
        lint: "npm run jscs && npm run jshint",
        test: "npm run lint && npm run unit",
        unit: "istanbul test _mocha --reporter=spec test/index.js",
        version: "grunt dist && git add dist/"
      },
      version: "6.5.2"
    }
  }, {}],
  108: [function (e, t, r) {
    var l = Object.create || function (e) {
      function t() {
      }

      return t.prototype = e, new t
    }, a = Object.keys || function (e) {
      var t = [];
      for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && t.push(r);
      return r
    }, o = Function.prototype.bind || function (e) {
      var t = this;
      return function () {
        return t.apply(e, arguments)
      }
    };

    function i() {
      this._events && Object.prototype.hasOwnProperty.call(this, "_events") || (this._events = l(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0
    }

    ((t.exports = i).EventEmitter = i).prototype._events = void 0, i.prototype._maxListeners = void 0;
    var n, s = 10;
    try {
      var u = {};
      Object.defineProperty && Object.defineProperty(u, "x", {value: 0}), n = 0 === u.x
    } catch (e) {
      n = !1
    }

    function c(e) {
      return void 0 === e._maxListeners ? i.defaultMaxListeners : e._maxListeners
    }

    function h(e, t, r, i) {
      var n, o, a, s;
      if ("function" != typeof r) throw new TypeError('"listener" argument must be a function');
      return (n = e._events) ? (n.newListener && (e.emit("newListener", t, r.listener ? r.listener : r), n = e._events), o = n[t]) : (n = e._events = l(null), e._eventsCount = 0), o ? ("function" == typeof o ? o = n[t] = i ? [r, o] : [o, r] : i ? o.unshift(r) : o.push(r), o.warned || (s = c(e)) && 0 < s && o.length > s && (o.warned = !0, (a = new Error("Possible EventEmitter memory leak detected. " + o.length + ' "' + String(t) + '" listeners added. Use emitter.setMaxListeners() to increase limit.')).name = "MaxListenersExceededWarning", a.emitter = e, a.type = t, a.count = o.length, "object" == typeof console && console.warn && console.warn("%s: %s", a.name, a.message))) : (o = n[t] = r, ++e._eventsCount), e
    }

    function d() {
      if (!this.fired) switch (this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length) {
        case 0:
          return this.listener.call(this.target);
        case 1:
          return this.listener.call(this.target, arguments[0]);
        case 2:
          return this.listener.call(this.target, arguments[0], arguments[1]);
        case 3:
          return this.listener.call(this.target, arguments[0], arguments[1], arguments[2]);
        default:
          for (var e = new Array(arguments.length), t = 0; t < e.length; ++t) e[t] = arguments[t];
          this.listener.apply(this.target, e)
      }
    }

    function f(e, t, r) {
      var i = {fired: !1, wrapFn: void 0, target: e, type: t, listener: r}, n = o.call(d, i);
      return n.listener = r, i.wrapFn = n
    }

    function p(e, t, r) {
      var i = e._events;
      if (!i) return [];
      var n = i[t];
      return n ? "function" == typeof n ? r ? [n.listener || n] : [n] : r ? function (e) {
        for (var t = new Array(e.length), r = 0; r < t.length; ++r) t[r] = e[r].listener || e[r];
        return t
      }(n) : m(n, n.length) : []
    }

    function y(e) {
      var t = this._events;
      if (t) {
        var r = t[e];
        if ("function" == typeof r) return 1;
        if (r) return r.length
      }
      return 0
    }

    function m(e, t) {
      for (var r = new Array(t), i = 0; i < t; ++i) r[i] = e[i];
      return r
    }

    n ? Object.defineProperty(i, "defaultMaxListeners", {
      enumerable: !0, get: function () {
        return s
      }, set: function (e) {
        if ("number" != typeof e || e < 0 || e != e) throw new TypeError('"defaultMaxListeners" must be a positive number');
        s = e
      }
    }) : i.defaultMaxListeners = s, i.prototype.setMaxListeners = function (e) {
      if ("number" != typeof e || e < 0 || isNaN(e)) throw new TypeError('"n" argument must be a positive number');
      return this._maxListeners = e, this
    }, i.prototype.getMaxListeners = function () {
      return c(this)
    }, i.prototype.emit = function (e, t, r, i) {
      var n, o, a, s, l = "error" === e, u = this._events;
      if (u) l = l && null == u.error; else if (!l) return !1;
      if (l) {
        if (1 < arguments.length && (n = t), n instanceof Error) throw n;
        var c = new Error('Unhandled "error" event. (' + n + ")");
        throw c.context = n, c
      }
      if (!(o = u[e])) return !1;
      var h, d = "function" == typeof o;
      switch (h = arguments.length) {
        case 1:
          !function (e, t, r) {
            if (t) e.call(r); else for (var i = e.length, n = m(e, i), o = 0; o < i; ++o) n[o].call(r)
          }(o, d, this);
          break;
        case 2:
          !function (e, t, r, i) {
            if (t) e.call(r, i); else for (var n = e.length, o = m(e, n), a = 0; a < n; ++a) o[a].call(r, i)
          }(o, d, this, t);
          break;
        case 3:
          !function (e, t, r, i, n) {
            if (t) e.call(r, i, n); else for (var o = e.length, a = m(e, o), s = 0; s < o; ++s) a[s].call(r, i, n)
          }(o, d, this, t, r);
          break;
        case 4:
          !function (e, t, r, i, n, o) {
            if (t) e.call(r, i, n, o); else for (var a = e.length, s = m(e, a), l = 0; l < a; ++l) s[l].call(r, i, n, o)
          }(o, d, this, t, r, i);
          break;
        default:
          for (a = new Array(h - 1), s = 1; s < h; s++) a[s - 1] = arguments[s];
          !function (e, t, r, i) {
            if (t) e.apply(r, i); else for (var n = e.length, o = m(e, n), a = 0; a < n; ++a) o[a].apply(r, i)
          }(o, d, this, a)
      }
      return !0
    }, i.prototype.on = i.prototype.addListener = function (e, t) {
      return h(this, e, t, !1)
    }, i.prototype.prependListener = function (e, t) {
      return h(this, e, t, !0)
    }, i.prototype.once = function (e, t) {
      if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
      return this.on(e, f(this, e, t)), this
    }, i.prototype.prependOnceListener = function (e, t) {
      if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
      return this.prependListener(e, f(this, e, t)), this
    }, i.prototype.removeListener = function (e, t) {
      var r, i, n, o, a;
      if ("function" != typeof t) throw new TypeError('"listener" argument must be a function');
      if (!(i = this._events)) return this;
      if (!(r = i[e])) return this;
      if (r === t || r.listener === t) 0 == --this._eventsCount ? this._events = l(null) : (delete i[e], i.removeListener && this.emit("removeListener", e, r.listener || t)); else if ("function" != typeof r) {
        for (n = -1, o = r.length - 1; 0 <= o; o--) if (r[o] === t || r[o].listener === t) {
          a = r[o].listener, n = o;
          break
        }
        if (n < 0) return this;
        0 === n ? r.shift() : function (e, t) {
          for (var r = t, i = r + 1, n = e.length; i < n; r += 1, i += 1) e[r] = e[i];
          e.pop()
        }(r, n), 1 === r.length && (i[e] = r[0]), i.removeListener && this.emit("removeListener", e, a || t)
      }
      return this
    }, i.prototype.removeAllListeners = function (e) {
      var t, r = this._events;
      if (!r) return this;
      if (!r.removeListener) return 0 === arguments.length ? (this._events = l(null), this._eventsCount = 0) : r[e] && (0 == --this._eventsCount ? this._events = l(null) : delete r[e]), this;
      if (0 === arguments.length) {
        for (var i, n = a(r), o = 0; o < n.length; ++o) "removeListener" !== (i = n[o]) && this.removeAllListeners(i);
        return this.removeAllListeners("removeListener"), this._events = l(null), this._eventsCount = 0, this
      }
      if ("function" == typeof (t = r[e])) this.removeListener(e, t); else if (t) for (o = t.length - 1; 0 <= o; o--) this.removeListener(e, t[o]);
      return this
    }, i.prototype.listeners = function (e) {
      return p(this, e, !0)
    }, i.prototype.rawListeners = function (e) {
      return p(this, e, !1)
    }, i.listenerCount = function (e, t) {
      return "function" == typeof e.listenerCount ? e.listenerCount(t) : y.call(e, t)
    }, i.prototype.listenerCount = y, i.prototype.eventNames = function () {
      return 0 < this._eventsCount ? Reflect.ownKeys(this._events) : []
    }
  }, {}],
  109: [function (e, t, r) {
    var f = e("safe-buffer").Buffer, p = e("md5.js");
    t.exports = function (e, t, r, i) {
      if (f.isBuffer(e) || (e = f.from(e, "binary")), t && (f.isBuffer(t) || (t = f.from(t, "binary")), 8 !== t.length)) throw new RangeError("salt should be Buffer with 8 byte length");
      for (var n = r / 8, o = f.alloc(n), a = f.alloc(i || 0), s = f.alloc(0); 0 < n || 0 < i;) {
        var l = new p;
        l.update(s), l.update(e), t && l.update(t), s = l.digest();
        var u, c, h, d = 0;
        0 < n && (u = o.length - n, d = Math.min(n, s.length), s.copy(o, u, 0, d), n -= d), d < s.length && 0 < i && (c = a.length - i, h = Math.min(i, s.length - d), s.copy(a, c, d, d + h), i -= h)
      }
      return s.fill(0), {key: o, iv: a}
    }
  }, {"md5.js": 145, "safe-buffer": 186}],
  110: [function (e, t, r) {
    !function () {
      "use strict";

      function s(n, e) {
        var t;
        if (e = e || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = e.touchBoundary || 10, this.layer = n, this.tapDelay = e.tapDelay || 200, this.tapTimeout = e.tapTimeout || 700, !s.notNeeded(n)) {
          for (var r = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], i = 0, o = r.length; i < o; i++) this[r[i]] = a(this[r[i]], this);
          l && (n.addEventListener("mouseover", this.onMouse, !0), n.addEventListener("mousedown", this.onMouse, !0), n.addEventListener("mouseup", this.onMouse, !0)), n.addEventListener("click", this.onClick, !0), n.addEventListener("touchstart", this.onTouchStart, !1), n.addEventListener("touchmove", this.onTouchMove, !1), n.addEventListener("touchend", this.onTouchEnd, !1), n.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (n.removeEventListener = function (e, t, r) {
            var i = Node.prototype.removeEventListener;
            "click" === e ? i.call(n, e, t.hijacked || t, r) : i.call(n, e, t, r)
          }, n.addEventListener = function (e, t, r) {
            var i = Node.prototype.addEventListener;
            "click" === e ? i.call(n, e, t.hijacked || (t.hijacked = function (e) {
              e.propagationStopped || t(e)
            }), r) : i.call(n, e, t, r)
          }), "function" == typeof n.onclick && (t = n.onclick, n.addEventListener("click", function (e) {
            t(e)
          }, !1), n.onclick = null)
        }

        function a(e, t) {
          return function () {
            return e.apply(t, arguments)
          }
        }
      }

      var e = 0 <= navigator.userAgent.indexOf("Windows Phone"), l = 0 < navigator.userAgent.indexOf("Android") && !e,
          u = /iP(ad|hone|od)/.test(navigator.userAgent) && !e, c = u && /OS 4_\d(_\d)?/.test(navigator.userAgent),
          h = u && /OS [6-7]_\d/.test(navigator.userAgent), n = 0 < navigator.userAgent.indexOf("BB10");
      s.prototype.needsClick = function (e) {
        switch (e.nodeName.toLowerCase()) {
          case"button":
          case"select":
          case"textarea":
            if (e.disabled) return !0;
            break;
          case"input":
            if (u && "file" === e.type || e.disabled) return !0;
            break;
          case"label":
          case"iframe":
          case"video":
            return !0
        }
        return /\bneedsclick\b/.test(e.className)
      }, s.prototype.needsFocus = function (e) {
        switch (e.nodeName.toLowerCase()) {
          case"textarea":
            return !0;
          case"select":
            return !l;
          case"input":
            switch (e.type) {
              case"button":
              case"checkbox":
              case"file":
              case"image":
              case"radio":
              case"submit":
                return !1
            }
            return !e.disabled && !e.readOnly;
          default:
            return /\bneedsfocus\b/.test(e.className)
        }
      }, s.prototype.sendClick = function (e, t) {
        var r, i;
        document.activeElement && document.activeElement !== e && document.activeElement.blur(), i = t.changedTouches[0], (r = document.createEvent("MouseEvents")).initMouseEvent(this.determineEventType(e), !0, !0, window, 1, i.screenX, i.screenY, i.clientX, i.clientY, !1, !1, !1, !1, 0, null), r.forwardedTouchEvent = !0, e.dispatchEvent(r)
      }, s.prototype.determineEventType = function (e) {
        return l && "select" === e.tagName.toLowerCase() ? "mousedown" : "click"
      }, s.prototype.focus = function (e) {
        var t;
        u && e.setSelectionRange && 0 !== e.type.indexOf("date") && "time" !== e.type && "month" !== e.type ? (t = e.value.length, e.setSelectionRange(t, t)) : e.focus()
      }, s.prototype.updateScrollParent = function (e) {
        var t, r = e.fastClickScrollParent;
        if (!r || !r.contains(e)) {
          t = e;
          do {
            if (t.scrollHeight > t.offsetHeight) {
              r = t, e.fastClickScrollParent = t;
              break
            }
            t = t.parentElement
          } while (t)
        }
        r && (r.fastClickLastScrollTop = r.scrollTop)
      }, s.prototype.getTargetElementFromEventTarget = function (e) {
        return e.nodeType === Node.TEXT_NODE ? e.parentNode : e
      }, s.prototype.onTouchStart = function (e) {
        var t, r, i;
        if (1 < e.targetTouches.length) return !0;
        if (t = this.getTargetElementFromEventTarget(e.target), r = e.targetTouches[0], u) {
          if ((i = window.getSelection()).rangeCount && !i.isCollapsed) return !0;
          if (!c) {
            if (r.identifier && r.identifier === this.lastTouchIdentifier) return e.preventDefault(), !1;
            this.lastTouchIdentifier = r.identifier, this.updateScrollParent(t)
          }
        }
        return this.trackingClick = !0, this.trackingClickStart = e.timeStamp, this.targetElement = t, this.touchStartX = r.pageX, this.touchStartY = r.pageY, e.timeStamp - this.lastClickTime < this.tapDelay && e.preventDefault(), !0
      }, s.prototype.touchHasMoved = function (e) {
        var t = e.changedTouches[0], r = this.touchBoundary;
        return Math.abs(t.pageX - this.touchStartX) > r || Math.abs(t.pageY - this.touchStartY) > r
      }, s.prototype.onTouchMove = function (e) {
        return this.trackingClick && (this.targetElement === this.getTargetElementFromEventTarget(e.target) && !this.touchHasMoved(e) || (this.trackingClick = !1, this.targetElement = null)), !0
      }, s.prototype.findControl = function (e) {
        return void 0 !== e.control ? e.control : e.htmlFor ? document.getElementById(e.htmlFor) : e.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
      }, s.prototype.onTouchEnd = function (e) {
        var t, r, i, n, o, a = this.targetElement;
        if (!this.trackingClick) return !0;
        if (e.timeStamp - this.lastClickTime < this.tapDelay) return this.cancelNextClick = !0;
        if (e.timeStamp - this.trackingClickStart > this.tapTimeout) return !0;
        if (this.cancelNextClick = !1, this.lastClickTime = e.timeStamp, r = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, h && (o = e.changedTouches[0], (a = document.elementFromPoint(o.pageX - window.pageXOffset, o.pageY - window.pageYOffset) || a).fastClickScrollParent = this.targetElement.fastClickScrollParent), "label" === (i = a.tagName.toLowerCase())) {
          if (t = this.findControl(a)) {
            if (this.focus(a), l) return !1;
            a = t
          }
        } else if (this.needsFocus(a)) return 100 < e.timeStamp - r || u && window.top !== window && "input" === i ? this.targetElement = null : (this.focus(a), this.sendClick(a, e), u && "select" === i || (this.targetElement = null, e.preventDefault())), !1;
        return !(!u || c || !(n = a.fastClickScrollParent) || n.fastClickLastScrollTop === n.scrollTop) || (this.needsClick(a) || (e.preventDefault(), this.sendClick(a, e)), !1)
      }, s.prototype.onTouchCancel = function () {
        this.trackingClick = !1, this.targetElement = null
      }, s.prototype.onMouse = function (e) {
        return !this.targetElement || (!!e.forwardedTouchEvent || (!e.cancelable || (!(!this.needsClick(this.targetElement) || this.cancelNextClick) || (e.stopImmediatePropagation ? e.stopImmediatePropagation() : e.propagationStopped = !0, e.stopPropagation(), e.preventDefault(), !1))))
      }, s.prototype.onClick = function (e) {
        var t;
        return this.trackingClick ? (this.targetElement = null, !(this.trackingClick = !1)) : "submit" === e.target.type && 0 === e.detail || ((t = this.onMouse(e)) || (this.targetElement = null), t)
      }, s.prototype.destroy = function () {
        var e = this.layer;
        l && (e.removeEventListener("mouseover", this.onMouse, !0), e.removeEventListener("mousedown", this.onMouse, !0), e.removeEventListener("mouseup", this.onMouse, !0)), e.removeEventListener("click", this.onClick, !0), e.removeEventListener("touchstart", this.onTouchStart, !1), e.removeEventListener("touchmove", this.onTouchMove, !1), e.removeEventListener("touchend", this.onTouchEnd, !1), e.removeEventListener("touchcancel", this.onTouchCancel, !1)
      }, s.notNeeded = function (e) {
        var t, r, i;
        if (void 0 === window.ontouchstart) return !0;
        if (r = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
          if (!l) return !0;
          if (t = document.querySelector("meta[name=viewport]")) {
            if (-1 !== t.content.indexOf("user-scalable=no")) return !0;
            if (31 < r && document.documentElement.scrollWidth <= window.outerWidth) return !0
          }
        }
        if (n && 10 <= (i = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/))[1] && 3 <= i[2] && (t = document.querySelector("meta[name=viewport]"))) {
          if (-1 !== t.content.indexOf("user-scalable=no")) return !0;
          if (document.documentElement.scrollWidth <= window.outerWidth) return !0
        }
        return "none" === e.style.msTouchAction || "manipulation" === e.style.touchAction || (!!(27 <= +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1] && (t = document.querySelector("meta[name=viewport]")) && (-1 !== t.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) || ("none" === e.style.touchAction || "manipulation" === e.style.touchAction))
      }, s.attach = function (e, t) {
        return new s(e, t)
      }, "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function () {
        return s
      }) : void 0 !== t && t.exports ? (t.exports = s.attach, t.exports.FastClick = s) : window.FastClick = s
    }()
  }, {}],
  111: [function (e, t, r) {
    "use strict";
    var s = e("safe-buffer").Buffer, i = e("readable-stream").Transform;

    function n(e) {
      i.call(this), this._block = s.allocUnsafe(e), this._blockSize = e, this._blockOffset = 0, this._length = [0, 0, 0, 0], this._finalized = !1
    }

    e("inherits")(n, i), n.prototype._transform = function (e, t, r) {
      var i = null;
      try {
        this.update(e, t)
      } catch (e) {
        i = e
      }
      r(i)
    }, n.prototype._flush = function (e) {
      var t = null;
      try {
        this.push(this.digest())
      } catch (e) {
        t = e
      }
      e(t)
    }, n.prototype.update = function (e, t) {
      if (!function (e, t) {
        if (!s.isBuffer(e) && "string" != typeof e) throw new TypeError(t + " must be a string or a buffer")
      }(e, "Data"), this._finalized) throw new Error("Digest already called");
      s.isBuffer(e) || (e = s.from(e, t));
      for (var r = this._block, i = 0; this._blockOffset + e.length - i >= this._blockSize;) {
        for (var n = this._blockOffset; n < this._blockSize;) r[n++] = e[i++];
        this._update(), this._blockOffset = 0
      }
      for (; i < e.length;) r[this._blockOffset++] = e[i++];
      for (var o = 0, a = 8 * e.length; 0 < a; ++o) this._length[o] += a, 0 < (a = this._length[o] / 4294967296 | 0) && (this._length[o] -= 4294967296 * a);
      return this
    }, n.prototype._update = function () {
      throw new Error("_update is not implemented")
    }, n.prototype.digest = function (e) {
      if (this._finalized) throw new Error("Digest already called");
      this._finalized = !0;
      var t = this._digest();
      void 0 !== e && (t = t.toString(e)), this._block.fill(0);
      for (var r = this._blockOffset = 0; r < 4; ++r) this._length[r] = 0;
      return t
    }, n.prototype._digest = function () {
      throw new Error("_digest is not implemented")
    }, t.exports = n
  }, {inherits: 142, "readable-stream": 126, "safe-buffer": 127}],
  112: [function (e, t, r) {
    arguments[4][48][0].apply(r, arguments)
  }, {dup: 48}],
  113: [function (e, t, r) {
    arguments[4][49][0].apply(r, arguments)
  }, {"./_stream_readable": 115, "./_stream_writable": 117, _process: 161, dup: 49, inherits: 142}],
  114: [function (e, t, r) {
    arguments[4][50][0].apply(r, arguments)
  }, {"./_stream_transform": 116, dup: 50, inherits: 142}],
  115: [function (e, t, r) {
    arguments[4][51][0].apply(r, arguments)
  }, {
    "../errors": 112,
    "./_stream_duplex": 113,
    "./internal/streams/async_iterator": 118,
    "./internal/streams/buffer_list": 119,
    "./internal/streams/destroy": 120,
    "./internal/streams/from": 122,
    "./internal/streams/state": 124,
    "./internal/streams/stream": 125,
    _process: 161,
    buffer: 64,
    dup: 51,
    events: 108,
    inherits: 142,
    "string_decoder/": 196,
    util: 19
  }],
  116: [function (e, t, r) {
    arguments[4][52][0].apply(r, arguments)
  }, {"../errors": 112, "./_stream_duplex": 113, dup: 52, inherits: 142}],
  117: [function (e, t, r) {
    arguments[4][53][0].apply(r, arguments)
  }, {
    "../errors": 112,
    "./_stream_duplex": 113,
    "./internal/streams/destroy": 120,
    "./internal/streams/state": 124,
    "./internal/streams/stream": 125,
    _process: 161,
    buffer: 64,
    dup: 53,
    inherits: 142,
    "util-deprecate": 199
  }],
  118: [function (e, t, r) {
    arguments[4][54][0].apply(r, arguments)
  }, {"./end-of-stream": 121, _process: 161, dup: 54}],
  119: [function (e, t, r) {
    arguments[4][55][0].apply(r, arguments)
  }, {buffer: 64, dup: 55, util: 19}],
  120: [function (e, t, r) {
    arguments[4][56][0].apply(r, arguments)
  }, {_process: 161, dup: 56}],
  121: [function (e, t, r) {
    arguments[4][57][0].apply(r, arguments)
  }, {"../../../errors": 112, dup: 57}],
  122: [function (e, t, r) {
    arguments[4][58][0].apply(r, arguments)
  }, {dup: 58}],
  123: [function (e, t, r) {
    arguments[4][59][0].apply(r, arguments)
  }, {"../../../errors": 112, "./end-of-stream": 121, dup: 59}],
  124: [function (e, t, r) {
    arguments[4][60][0].apply(r, arguments)
  }, {"../../../errors": 112, dup: 60}],
  125: [function (e, t, r) {
    arguments[4][61][0].apply(r, arguments)
  }, {dup: 61, events: 108}],
  126: [function (e, t, r) {
    arguments[4][62][0].apply(r, arguments)
  }, {
    "./lib/_stream_duplex.js": 113,
    "./lib/_stream_passthrough.js": 114,
    "./lib/_stream_readable.js": 115,
    "./lib/_stream_transform.js": 116,
    "./lib/_stream_writable.js": 117,
    "./lib/internal/streams/end-of-stream.js": 121,
    "./lib/internal/streams/pipeline.js": 123,
    dup: 62
  }],
  127: [function (e, t, r) {
    var i = e("buffer"), n = i.Buffer;

    function o(e, t) {
      for (var r in e) t[r] = e[r]
    }

    function a(e, t, r) {
      return n(e, t, r)
    }

    n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow ? t.exports = i : (o(i, r), r.Buffer = a), a.prototype = Object.create(n.prototype), o(n, a), a.from = function (e, t, r) {
      if ("number" == typeof e) throw new TypeError("Argument must not be a number");
      return n(e, t, r)
    }, a.alloc = function (e, t, r) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      var i = n(e);
      return void 0 !== t ? "string" == typeof r ? i.fill(t, r) : i.fill(t) : i.fill(0), i
    }, a.allocUnsafe = function (e) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      return n(e)
    }, a.allocUnsafeSlow = function (e) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      return i.SlowBuffer(e)
    }
  }, {buffer: 64}],
  128: [function (e, t, r) {
    var i = r;
    i.utils = e("./hash/utils"), i.common = e("./hash/common"), i.sha = e("./hash/sha"), i.ripemd = e("./hash/ripemd"), i.hmac = e("./hash/hmac"), i.sha1 = i.sha.sha1, i.sha256 = i.sha.sha256, i.sha224 = i.sha.sha224, i.sha384 = i.sha.sha384, i.sha512 = i.sha.sha512, i.ripemd160 = i.ripemd.ripemd160
  }, {"./hash/common": 129, "./hash/hmac": 130, "./hash/ripemd": 131, "./hash/sha": 132, "./hash/utils": 139}],
  129: [function (e, t, r) {
    "use strict";
    var n = e("./utils"), i = e("minimalistic-assert");

    function o() {
      this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32
    }

    (r.BlockHash = o).prototype.update = function (e, t) {
      if (e = n.toArray(e, t), this.pending ? this.pending = this.pending.concat(e) : this.pending = e, this.pendingTotal += e.length, this.pending.length >= this._delta8) {
        var r = (e = this.pending).length % this._delta8;
        this.pending = e.slice(e.length - r, e.length), 0 === this.pending.length && (this.pending = null), e = n.join32(e, 0, e.length - r, this.endian);
        for (var i = 0; i < e.length; i += this._delta32) this._update(e, i, i + this._delta32)
      }
      return this
    }, o.prototype.digest = function (e) {
      return this.update(this._pad()), i(null === this.pending), this._digest(e)
    }, o.prototype._pad = function () {
      var e = this.pendingTotal, t = this._delta8, r = t - (e + this.padLength) % t, i = new Array(r + this.padLength);
      i[0] = 128;
      for (var n = 1; n < r; n++) i[n] = 0;
      if (e <<= 3, "big" === this.endian) {
        for (var o = 8; o < this.padLength; o++) i[n++] = 0;
        i[n++] = 0, i[n++] = 0, i[n++] = 0, i[n++] = 0, i[n++] = e >>> 24 & 255, i[n++] = e >>> 16 & 255, i[n++] = e >>> 8 & 255, i[n++] = 255 & e
      } else for (i[n++] = 255 & e, i[n++] = e >>> 8 & 255, i[n++] = e >>> 16 & 255, i[n++] = e >>> 24 & 255, i[n++] = 0, i[n++] = 0, i[n++] = 0, i[n++] = 0, o = 8; o < this.padLength; o++) i[n++] = 0;
      return i
    }
  }, {"./utils": 139, "minimalistic-assert": 148}],
  130: [function (e, t, r) {
    "use strict";
    var i = e("./utils"), n = e("minimalistic-assert");

    function o(e, t, r) {
      if (!(this instanceof o)) return new o(e, t, r);
      this.Hash = e, this.blockSize = e.blockSize / 8, this.outSize = e.outSize / 8, this.inner = null, this.outer = null, this._init(i.toArray(t, r))
    }

    (t.exports = o).prototype._init = function (e) {
      e.length > this.blockSize && (e = (new this.Hash).update(e).digest()), n(e.length <= this.blockSize);
      for (var t = e.length; t < this.blockSize; t++) e.push(0);
      for (t = 0; t < e.length; t++) e[t] ^= 54;
      for (this.inner = (new this.Hash).update(e), t = 0; t < e.length; t++) e[t] ^= 106;
      this.outer = (new this.Hash).update(e)
    }, o.prototype.update = function (e, t) {
      return this.inner.update(e, t), this
    }, o.prototype.digest = function (e) {
      return this.outer.update(this.inner.digest()), this.outer.digest(e)
    }
  }, {"./utils": 139, "minimalistic-assert": 148}],
  131: [function (e, t, r) {
    "use strict";
    var i = e("./utils"), n = e("./common"), p = i.rotl32, y = i.sum32, m = i.sum32_3, g = i.sum32_4, o = n.BlockHash;

    function a() {
      if (!(this instanceof a)) return new a;
      o.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.endian = "little"
    }

    function b(e, t, r, i) {
      return e <= 15 ? t ^ r ^ i : e <= 31 ? t & r | ~t & i : e <= 47 ? (t | ~r) ^ i : e <= 63 ? t & i | r & ~i : t ^ (r | ~i)
    }

    function v(e) {
      return e <= 15 ? 0 : e <= 31 ? 1518500249 : e <= 47 ? 1859775393 : e <= 63 ? 2400959708 : 2840853838
    }

    function _(e) {
      return e <= 15 ? 1352829926 : e <= 31 ? 1548603684 : e <= 47 ? 1836072691 : e <= 63 ? 2053994217 : 0
    }

    i.inherits(a, o), (r.ripemd160 = a).blockSize = 512, a.outSize = 160, a.hmacStrength = 192, a.padLength = 64, a.prototype._update = function (e, t) {
      for (var r = u = this.h[0], i = f = this.h[1], n = d = this.h[2], o = h = this.h[3], a = c = this.h[4], s = 0; s < 80; s++) var l = y(p(g(u, b(s, f, d, h), e[w[s] + t], v(s)), E[s]), c), u = c, c = h, h = p(d, 10), d = f, f = l, l = y(p(g(r, b(79 - s, i, n, o), e[S[s] + t], _(s)), x[s]), a), r = a, a = o, o = p(n, 10), n = i, i = l;
      l = m(this.h[1], d, o), this.h[1] = m(this.h[2], h, a), this.h[2] = m(this.h[3], c, r), this.h[3] = m(this.h[4], u, i), this.h[4] = m(this.h[0], f, n), this.h[0] = l
    }, a.prototype._digest = function (e) {
      return "hex" === e ? i.toHex32(this.h, "little") : i.split32(this.h, "little")
    };
    var w = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13],
        S = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11],
        E = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6],
        x = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11]
  }, {"./common": 129, "./utils": 139}],
  132: [function (e, t, r) {
    "use strict";
    r.sha1 = e("./sha/1"), r.sha224 = e("./sha/224"), r.sha256 = e("./sha/256"), r.sha384 = e("./sha/384"), r.sha512 = e("./sha/512")
  }, {"./sha/1": 133, "./sha/224": 134, "./sha/256": 135, "./sha/384": 136, "./sha/512": 137}],
  133: [function (e, t, r) {
    "use strict";
    var i = e("../utils"), n = e("../common"), o = e("./common"), h = i.rotl32, d = i.sum32, f = i.sum32_5, p = o.ft_1,
        a = n.BlockHash, y = [1518500249, 1859775393, 2400959708, 3395469782];

    function s() {
      if (!(this instanceof s)) return new s;
      a.call(this), this.h = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], this.W = new Array(80)
    }

    i.inherits(s, a), (t.exports = s).blockSize = 512, s.outSize = 160, s.hmacStrength = 80, s.padLength = 64, s.prototype._update = function (e, t) {
      for (var r = this.W, i = 0; i < 16; i++) r[i] = e[t + i];
      for (; i < r.length; i++) r[i] = h(r[i - 3] ^ r[i - 8] ^ r[i - 14] ^ r[i - 16], 1);
      for (var n = this.h[0], o = this.h[1], a = this.h[2], s = this.h[3], l = this.h[4], i = 0; i < r.length; i++) var u = ~~(i / 20), c = f(h(n, 5), p(u, o, a, s), l, r[i], y[u]), l = s, s = a, a = h(o, 30), o = n, n = c;
      this.h[0] = d(this.h[0], n), this.h[1] = d(this.h[1], o), this.h[2] = d(this.h[2], a), this.h[3] = d(this.h[3], s), this.h[4] = d(this.h[4], l)
    }, s.prototype._digest = function (e) {
      return "hex" === e ? i.toHex32(this.h, "big") : i.split32(this.h, "big")
    }
  }, {"../common": 129, "../utils": 139, "./common": 138}],
  134: [function (e, t, r) {
    "use strict";
    var i = e("../utils"), n = e("./256");

    function o() {
      if (!(this instanceof o)) return new o;
      n.call(this), this.h = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428]
    }

    i.inherits(o, n), (t.exports = o).blockSize = 512, o.outSize = 224, o.hmacStrength = 192, o.padLength = 64, o.prototype._digest = function (e) {
      return "hex" === e ? i.toHex32(this.h.slice(0, 7), "big") : i.split32(this.h.slice(0, 7), "big")
    }
  }, {"../utils": 139, "./256": 135}],
  135: [function (e, t, r) {
    "use strict";
    var i = e("../utils"), n = e("../common"), o = e("./common"), p = e("minimalistic-assert"), y = i.sum32,
        m = i.sum32_4, g = i.sum32_5, b = o.ch32, v = o.maj32, _ = o.s0_256, w = o.s1_256, S = o.g0_256, E = o.g1_256,
        a = n.BlockHash,
        s = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];

    function l() {
      if (!(this instanceof l)) return new l;
      a.call(this), this.h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], this.k = s, this.W = new Array(64)
    }

    i.inherits(l, a), (t.exports = l).blockSize = 512, l.outSize = 256, l.hmacStrength = 192, l.padLength = 64, l.prototype._update = function (e, t) {
      for (var r = this.W, i = 0; i < 16; i++) r[i] = e[t + i];
      for (; i < r.length; i++) r[i] = m(E(r[i - 2]), r[i - 7], S(r[i - 15]), r[i - 16]);
      var n = this.h[0], o = this.h[1], a = this.h[2], s = this.h[3], l = this.h[4], u = this.h[5], c = this.h[6],
          h = this.h[7];
      for (p(this.k.length === r.length), i = 0; i < r.length; i++) var d = g(h, w(l), b(l, u, c), this.k[i], r[i]), f = y(_(n), v(n, o, a)), h = c, c = u, u = l, l = y(s, d), s = a, a = o, o = n, n = y(d, f);
      this.h[0] = y(this.h[0], n), this.h[1] = y(this.h[1], o), this.h[2] = y(this.h[2], a), this.h[3] = y(this.h[3], s), this.h[4] = y(this.h[4], l), this.h[5] = y(this.h[5], u), this.h[6] = y(this.h[6], c), this.h[7] = y(this.h[7], h)
    }, l.prototype._digest = function (e) {
      return "hex" === e ? i.toHex32(this.h, "big") : i.split32(this.h, "big")
    }
  }, {"../common": 129, "../utils": 139, "./common": 138, "minimalistic-assert": 148}],
  136: [function (e, t, r) {
    "use strict";
    var i = e("../utils"), n = e("./512");

    function o() {
      if (!(this instanceof o)) return new o;
      n.call(this), this.h = [3418070365, 3238371032, 1654270250, 914150663, 2438529370, 812702999, 355462360, 4144912697, 1731405415, 4290775857, 2394180231, 1750603025, 3675008525, 1694076839, 1203062813, 3204075428]
    }

    i.inherits(o, n), (t.exports = o).blockSize = 1024, o.outSize = 384, o.hmacStrength = 192, o.padLength = 128, o.prototype._digest = function (e) {
      return "hex" === e ? i.toHex32(this.h.slice(0, 12), "big") : i.split32(this.h.slice(0, 12), "big")
    }
  }, {"../utils": 139, "./512": 137}],
  137: [function (e, t, r) {
    "use strict";
    var i = e("../utils"), n = e("../common"), D = e("minimalistic-assert"), o = i.rotr64_hi, a = i.rotr64_lo,
        s = i.shr64_hi, l = i.shr64_lo, B = i.sum64, O = i.sum64_hi, U = i.sum64_lo, d = i.sum64_4_hi, f = i.sum64_4_lo,
        N = i.sum64_5_hi, H = i.sum64_5_lo, u = n.BlockHash,
        c = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591];

    function h() {
      if (!(this instanceof h)) return new h;
      u.call(this), this.h = [1779033703, 4089235720, 3144134277, 2227873595, 1013904242, 4271175723, 2773480762, 1595750129, 1359893119, 2917565137, 2600822924, 725511199, 528734635, 4215389547, 1541459225, 327033209], this.k = c, this.W = new Array(160)
    }

    function j(e, t, r, i, n) {
      var o = e & r ^ ~e & n;
      return o < 0 && (o += 4294967296), o
    }

    function F(e, t, r, i, n, o) {
      var a = t & i ^ ~t & o;
      return a < 0 && (a += 4294967296), a
    }

    function q(e, t, r, i, n) {
      var o = e & r ^ e & n ^ r & n;
      return o < 0 && (o += 4294967296), o
    }

    function V(e, t, r, i, n, o) {
      var a = t & i ^ t & o ^ i & o;
      return a < 0 && (a += 4294967296), a
    }

    function z(e, t) {
      var r = o(e, t, 28) ^ o(t, e, 2) ^ o(t, e, 7);
      return r < 0 && (r += 4294967296), r
    }

    function K(e, t) {
      var r = a(e, t, 28) ^ a(t, e, 2) ^ a(t, e, 7);
      return r < 0 && (r += 4294967296), r
    }

    function W(e, t) {
      var r = o(e, t, 14) ^ o(e, t, 18) ^ o(t, e, 9);
      return r < 0 && (r += 4294967296), r
    }

    function X(e, t) {
      var r = a(e, t, 14) ^ a(e, t, 18) ^ a(t, e, 9);
      return r < 0 && (r += 4294967296), r
    }

    function p(e, t) {
      var r = o(e, t, 1) ^ o(e, t, 8) ^ s(e, t, 7);
      return r < 0 && (r += 4294967296), r
    }

    function y(e, t) {
      var r = a(e, t, 1) ^ a(e, t, 8) ^ l(e, t, 7);
      return r < 0 && (r += 4294967296), r
    }

    function m(e, t) {
      var r = o(e, t, 19) ^ o(t, e, 29) ^ s(e, t, 6);
      return r < 0 && (r += 4294967296), r
    }

    function g(e, t) {
      var r = a(e, t, 19) ^ a(t, e, 29) ^ l(e, t, 6);
      return r < 0 && (r += 4294967296), r
    }

    i.inherits(h, u), (t.exports = h).blockSize = 1024, h.outSize = 512, h.hmacStrength = 192, h.padLength = 128, h.prototype._prepareBlock = function (e, t) {
      for (var r = this.W, i = 0; i < 32; i++) r[i] = e[t + i];
      for (; i < r.length; i += 2) {
        var n = m(r[i - 4], r[i - 3]), o = g(r[i - 4], r[i - 3]), a = r[i - 14], s = r[i - 13],
            l = p(r[i - 30], r[i - 29]), u = y(r[i - 30], r[i - 29]), c = r[i - 32], h = r[i - 31];
        r[i] = d(n, o, a, s, l, u, c, h), r[i + 1] = f(n, o, a, s, l, u, c, h)
      }
    }, h.prototype._update = function (e, t) {
      this._prepareBlock(e, t);
      var r = this.W, i = this.h[0], n = this.h[1], o = this.h[2], a = this.h[3], s = this.h[4], l = this.h[5],
          u = this.h[6], c = this.h[7], h = this.h[8], d = this.h[9], f = this.h[10], p = this.h[11], y = this.h[12],
          m = this.h[13], g = this.h[14], b = this.h[15];
      D(this.k.length === r.length);
      for (var v = 0; v < r.length; v += 2) var _ = g, w = b, S = W(h, d), E = X(h, d), x = j(h, 0, f, 0, y), T = F(0, d, 0, p, 0, m), M = this.k[v], k = this.k[v + 1], P = r[v], C = r[v + 1], A = N(_, w, S, E, x, T, M, k, P, C), I = H(_, w, S, E, x, T, M, k, P, C), _ = z(i, n), w = K(i, n), S = q(i, 0, o, 0, s), E = V(0, n, 0, a, 0, l), R = O(_, w, S, E), L = U(_, w, S, E), g = y, b = m, y = f, m = p, f = h, p = d, h = O(u, c, A, I), d = U(c, c, A, I), u = s, c = l, s = o, l = a, o = i, a = n, i = O(A, I, R, L), n = U(A, I, R, L);
      B(this.h, 0, i, n), B(this.h, 2, o, a), B(this.h, 4, s, l), B(this.h, 6, u, c), B(this.h, 8, h, d), B(this.h, 10, f, p), B(this.h, 12, y, m), B(this.h, 14, g, b)
    }, h.prototype._digest = function (e) {
      return "hex" === e ? i.toHex32(this.h, "big") : i.split32(this.h, "big")
    }
  }, {"../common": 129, "../utils": 139, "minimalistic-assert": 148}],
  138: [function (e, t, r) {
    "use strict";
    var i = e("../utils").rotr32;

    function n(e, t, r) {
      return e & t ^ ~e & r
    }

    function o(e, t, r) {
      return e & t ^ e & r ^ t & r
    }

    function a(e, t, r) {
      return e ^ t ^ r
    }

    r.ft_1 = function (e, t, r, i) {
      return 0 === e ? n(t, r, i) : 1 === e || 3 === e ? t ^ r ^ i : 2 === e ? o(t, r, i) : void 0
    }, r.ch32 = n, r.maj32 = o, r.p32 = a, r.s0_256 = function (e) {
      return i(e, 2) ^ i(e, 13) ^ i(e, 22)
    }, r.s1_256 = function (e) {
      return i(e, 6) ^ i(e, 11) ^ i(e, 25)
    }, r.g0_256 = function (e) {
      return i(e, 7) ^ i(e, 18) ^ e >>> 3
    }, r.g1_256 = function (e) {
      return i(e, 17) ^ i(e, 19) ^ e >>> 10
    }
  }, {"../utils": 139}],
  139: [function (e, t, r) {
    "use strict";
    var u = e("minimalistic-assert"), i = e("inherits");

    function o(e) {
      return (e >>> 24 | e >>> 8 & 65280 | e << 8 & 16711680 | (255 & e) << 24) >>> 0
    }

    function n(e) {
      return 1 === e.length ? "0" + e : e
    }

    function a(e) {
      return 7 === e.length ? "0" + e : 6 === e.length ? "00" + e : 5 === e.length ? "000" + e : 4 === e.length ? "0000" + e : 3 === e.length ? "00000" + e : 2 === e.length ? "000000" + e : 1 === e.length ? "0000000" + e : e
    }

    r.inherits = i, r.toArray = function (e, t) {
      if (Array.isArray(e)) return e.slice();
      if (!e) return [];
      var r, i, n = [];
      if ("string" == typeof e) if (t) {
        if ("hex" === t) for ((e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e), a = 0; a < e.length; a += 2) n.push(parseInt(e[a] + e[a + 1], 16))
      } else for (var o = 0, a = 0; a < e.length; a++) {
        var s = e.charCodeAt(a);
        s < 128 ? n[o++] = s : s < 2048 ? (n[o++] = s >> 6 | 192, n[o++] = 63 & s | 128) : (i = a, 55296 != (64512 & (r = e).charCodeAt(i)) || i < 0 || i + 1 >= r.length || 56320 != (64512 & r.charCodeAt(i + 1)) ? n[o++] = s >> 12 | 224 : (s = 65536 + ((1023 & s) << 10) + (1023 & e.charCodeAt(++a)), n[o++] = s >> 18 | 240, n[o++] = s >> 12 & 63 | 128), n[o++] = s >> 6 & 63 | 128, n[o++] = 63 & s | 128)
      } else for (a = 0; a < e.length; a++) n[a] = 0 | e[a];
      return n
    }, r.toHex = function (e) {
      for (var t = "", r = 0; r < e.length; r++) t += n(e[r].toString(16));
      return t
    }, r.htonl = o, r.toHex32 = function (e, t) {
      for (var r = "", i = 0; i < e.length; i++) {
        var n = e[i];
        "little" === t && (n = o(n)), r += a(n.toString(16))
      }
      return r
    }, r.zero2 = n, r.zero8 = a, r.join32 = function (e, t, r, i) {
      var n = r - t;
      u(n % 4 == 0);
      for (var o = new Array(n / 4), a = 0, s = t; a < o.length; a++, s += 4) {
        var l = "big" === i ? e[s] << 24 | e[s + 1] << 16 | e[s + 2] << 8 | e[s + 3] : e[s + 3] << 24 | e[s + 2] << 16 | e[s + 1] << 8 | e[s];
        o[a] = l >>> 0
      }
      return o
    }, r.split32 = function (e, t) {
      for (var r = new Array(4 * e.length), i = 0, n = 0; i < e.length; i++, n += 4) {
        var o = e[i];
        "big" === t ? (r[n] = o >>> 24, r[n + 1] = o >>> 16 & 255, r[n + 2] = o >>> 8 & 255, r[n + 3] = 255 & o) : (r[n + 3] = o >>> 24, r[n + 2] = o >>> 16 & 255, r[n + 1] = o >>> 8 & 255, r[n] = 255 & o)
      }
      return r
    }, r.rotr32 = function (e, t) {
      return e >>> t | e << 32 - t
    }, r.rotl32 = function (e, t) {
      return e << t | e >>> 32 - t
    }, r.sum32 = function (e, t) {
      return e + t >>> 0
    }, r.sum32_3 = function (e, t, r) {
      return e + t + r >>> 0
    }, r.sum32_4 = function (e, t, r, i) {
      return e + t + r + i >>> 0
    }, r.sum32_5 = function (e, t, r, i, n) {
      return e + t + r + i + n >>> 0
    }, r.sum64 = function (e, t, r, i) {
      var n = e[t], o = i + e[t + 1] >>> 0, a = (o < i ? 1 : 0) + r + n;
      e[t] = a >>> 0, e[t + 1] = o
    }, r.sum64_hi = function (e, t, r, i) {
      return (t + i >>> 0 < t ? 1 : 0) + e + r >>> 0
    }, r.sum64_lo = function (e, t, r, i) {
      return t + i >>> 0
    }, r.sum64_4_hi = function (e, t, r, i, n, o, a, s) {
      var l = 0, u = t;
      return l += (u = u + i >>> 0) < t ? 1 : 0, l += (u = u + o >>> 0) < o ? 1 : 0, e + r + n + a + (l += (u = u + s >>> 0) < s ? 1 : 0) >>> 0
    }, r.sum64_4_lo = function (e, t, r, i, n, o, a, s) {
      return t + i + o + s >>> 0
    }, r.sum64_5_hi = function (e, t, r, i, n, o, a, s, l, u) {
      var c = 0, h = t;
      return c += (h = h + i >>> 0) < t ? 1 : 0, c += (h = h + o >>> 0) < o ? 1 : 0, c += (h = h + s >>> 0) < s ? 1 : 0, e + r + n + a + l + (c += (h = h + u >>> 0) < u ? 1 : 0) >>> 0
    }, r.sum64_5_lo = function (e, t, r, i, n, o, a, s, l, u) {
      return t + i + o + s + u >>> 0
    }, r.rotr64_hi = function (e, t, r) {
      return (t << 32 - r | e >>> r) >>> 0
    }, r.rotr64_lo = function (e, t, r) {
      return (e << 32 - r | t >>> r) >>> 0
    }, r.shr64_hi = function (e, t, r) {
      return e >>> r
    }, r.shr64_lo = function (e, t, r) {
      return (e << 32 - r | t >>> r) >>> 0
    }
  }, {inherits: 142, "minimalistic-assert": 148}],
  140: [function (e, t, r) {
    "use strict";
    var i = e("hash.js"), a = e("minimalistic-crypto-utils"), n = e("minimalistic-assert");

    function o(e) {
      if (!(this instanceof o)) return new o(e);
      this.hash = e.hash, this.predResist = !!e.predResist, this.outLen = this.hash.outSize, this.minEntropy = e.minEntropy || this.hash.hmacStrength, this._reseed = null, this.reseedInterval = null, this.K = null, this.V = null;
      var t = a.toArray(e.entropy, e.entropyEnc || "hex"), r = a.toArray(e.nonce, e.nonceEnc || "hex"),
          i = a.toArray(e.pers, e.persEnc || "hex");
      n(t.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._init(t, r, i)
    }

    (t.exports = o).prototype._init = function (e, t, r) {
      var i = e.concat(t).concat(r);
      this.K = new Array(this.outLen / 8), this.V = new Array(this.outLen / 8);
      for (var n = 0; n < this.V.length; n++) this.K[n] = 0, this.V[n] = 1;
      this._update(i), this._reseed = 1, this.reseedInterval = 281474976710656
    }, o.prototype._hmac = function () {
      return new i.hmac(this.hash, this.K)
    }, o.prototype._update = function (e) {
      var t = this._hmac().update(this.V).update([0]);
      e && (t = t.update(e)), this.K = t.digest(), this.V = this._hmac().update(this.V).digest(), e && (this.K = this._hmac().update(this.V).update([1]).update(e).digest(), this.V = this._hmac().update(this.V).digest())
    }, o.prototype.reseed = function (e, t, r, i) {
      "string" != typeof t && (i = r, r = t, t = null), e = a.toArray(e, t), r = a.toArray(r, i), n(e.length >= this.minEntropy / 8, "Not enough entropy. Minimum is: " + this.minEntropy + " bits"), this._update(e.concat(r || [])), this._reseed = 1
    }, o.prototype.generate = function (e, t, r, i) {
      if (this._reseed > this.reseedInterval) throw new Error("Reseed is required");
      "string" != typeof t && (i = r, r = t, t = null), r && (r = a.toArray(r, i || "hex"), this._update(r));
      for (var n = []; n.length < e;) this.V = this._hmac().update(this.V).digest(), n = n.concat(this.V);
      var o = n.slice(0, e);
      return this._update(r), this._reseed++, a.encode(o, t)
    }
  }, {"hash.js": 128, "minimalistic-assert": 148, "minimalistic-crypto-utils": 149}],
  141: [function (e, t, r) {
    r.read = function (e, t, r, i, n) {
      var o, a, s = 8 * n - i - 1, l = (1 << s) - 1, u = l >> 1, c = -7, h = r ? n - 1 : 0, d = r ? -1 : 1,
          f = e[t + h];
      for (h += d, o = f & (1 << -c) - 1, f >>= -c, c += s; 0 < c; o = 256 * o + e[t + h], h += d, c -= 8) ;
      for (a = o & (1 << -c) - 1, o >>= -c, c += i; 0 < c; a = 256 * a + e[t + h], h += d, c -= 8) ;
      if (0 === o) o = 1 - u; else {
        if (o === l) return a ? NaN : 1 / 0 * (f ? -1 : 1);
        a += Math.pow(2, i), o -= u
      }
      return (f ? -1 : 1) * a * Math.pow(2, o - i)
    }, r.write = function (e, t, r, i, n, o) {
      var a, s, l, u = 8 * o - n - 1, c = (1 << u) - 1, h = c >> 1,
          d = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0, f = i ? 0 : o - 1, p = i ? 1 : -1,
          y = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
      for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (s = isNaN(t) ? 1 : 0, a = c) : (a = Math.floor(Math.log(t) / Math.LN2), t * (l = Math.pow(2, -a)) < 1 && (a--, l *= 2), 2 <= (t += 1 <= a + h ? d / l : d * Math.pow(2, 1 - h)) * l && (a++, l /= 2), c <= a + h ? (s = 0, a = c) : 1 <= a + h ? (s = (t * l - 1) * Math.pow(2, n), a += h) : (s = t * Math.pow(2, h - 1) * Math.pow(2, n), a = 0)); 8 <= n; e[r + f] = 255 & s, f += p, s /= 256, n -= 8) ;
      for (a = a << n | s, u += n; 0 < u; e[r + f] = 255 & a, f += p, a /= 256, u -= 8) ;
      e[r + f - p] |= 128 * y
    }
  }, {}],
  142: [function (e, t, r) {
    "function" == typeof Object.create ? t.exports = function (e, t) {
      t && (e.super_ = t, e.prototype = Object.create(t.prototype, {
        constructor: {
          value: e,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }))
    } : t.exports = function (e, t) {
      var r;
      t && (e.super_ = t, (r = function () {
      }).prototype = t.prototype, e.prototype = new r, e.prototype.constructor = e)
    }
  }, {}],
  143: [function (e, t, r) {
    function i(e) {
      return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e)
    }

    t.exports = function (e) {
      return null != e && (i(e) || "function" == typeof (t = e).readFloatLE && "function" == typeof t.slice && i(t.slice(0, 0)) || !!e._isBuffer);
      var t
    }
  }, {}],
  144: [function (e, t, r) {
    var i = {}.toString;
    t.exports = Array.isArray || function (e) {
      return "[object Array]" == i.call(e)
    }
  }, {}],
  145: [function (e, t, r) {
    "use strict";
    var i = e("inherits"), n = e("hash-base"), o = e("safe-buffer").Buffer, a = new Array(16);

    function s() {
      n.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878
    }

    function l(e, t) {
      return e << t | e >>> 32 - t
    }

    function u(e, t, r, i, n, o, a) {
      return l(e + (t & r | ~t & i) + n + o | 0, a) + t | 0
    }

    function c(e, t, r, i, n, o, a) {
      return l(e + (t & i | r & ~i) + n + o | 0, a) + t | 0
    }

    function h(e, t, r, i, n, o, a) {
      return l(e + (t ^ r ^ i) + n + o | 0, a) + t | 0
    }

    function d(e, t, r, i, n, o, a) {
      return l(e + (r ^ (t | ~i)) + n + o | 0, a) + t | 0
    }

    i(s, n), s.prototype._update = function () {
      for (var e = a, t = 0; t < 16; ++t) e[t] = this._block.readInt32LE(4 * t);
      var r = u(r = this._a, o = this._b, n = this._c, i = this._d, e[0], 3614090360, 7),
          i = u(i, r, o, n, e[1], 3905402710, 12), n = u(n, i, r, o, e[2], 606105819, 17),
          o = u(o, n, i, r, e[3], 3250441966, 22);
      r = u(r, o, n, i, e[4], 4118548399, 7), i = u(i, r, o, n, e[5], 1200080426, 12), n = u(n, i, r, o, e[6], 2821735955, 17), o = u(o, n, i, r, e[7], 4249261313, 22), r = u(r, o, n, i, e[8], 1770035416, 7), i = u(i, r, o, n, e[9], 2336552879, 12), n = u(n, i, r, o, e[10], 4294925233, 17), o = u(o, n, i, r, e[11], 2304563134, 22), r = u(r, o, n, i, e[12], 1804603682, 7), i = u(i, r, o, n, e[13], 4254626195, 12), n = u(n, i, r, o, e[14], 2792965006, 17), r = c(r, o = u(o, n, i, r, e[15], 1236535329, 22), n, i, e[1], 4129170786, 5), i = c(i, r, o, n, e[6], 3225465664, 9), n = c(n, i, r, o, e[11], 643717713, 14), o = c(o, n, i, r, e[0], 3921069994, 20), r = c(r, o, n, i, e[5], 3593408605, 5), i = c(i, r, o, n, e[10], 38016083, 9), n = c(n, i, r, o, e[15], 3634488961, 14), o = c(o, n, i, r, e[4], 3889429448, 20), r = c(r, o, n, i, e[9], 568446438, 5), i = c(i, r, o, n, e[14], 3275163606, 9), n = c(n, i, r, o, e[3], 4107603335, 14), o = c(o, n, i, r, e[8], 1163531501, 20), r = c(r, o, n, i, e[13], 2850285829, 5), i = c(i, r, o, n, e[2], 4243563512, 9), n = c(n, i, r, o, e[7], 1735328473, 14), r = h(r, o = c(o, n, i, r, e[12], 2368359562, 20), n, i, e[5], 4294588738, 4), i = h(i, r, o, n, e[8], 2272392833, 11), n = h(n, i, r, o, e[11], 1839030562, 16), o = h(o, n, i, r, e[14], 4259657740, 23), r = h(r, o, n, i, e[1], 2763975236, 4), i = h(i, r, o, n, e[4], 1272893353, 11), n = h(n, i, r, o, e[7], 4139469664, 16), o = h(o, n, i, r, e[10], 3200236656, 23), r = h(r, o, n, i, e[13], 681279174, 4), i = h(i, r, o, n, e[0], 3936430074, 11), n = h(n, i, r, o, e[3], 3572445317, 16), o = h(o, n, i, r, e[6], 76029189, 23), r = h(r, o, n, i, e[9], 3654602809, 4), i = h(i, r, o, n, e[12], 3873151461, 11), n = h(n, i, r, o, e[15], 530742520, 16), r = d(r, o = h(o, n, i, r, e[2], 3299628645, 23), n, i, e[0], 4096336452, 6), i = d(i, r, o, n, e[7], 1126891415, 10), n = d(n, i, r, o, e[14], 2878612391, 15), o = d(o, n, i, r, e[5], 4237533241, 21), r = d(r, o, n, i, e[12], 1700485571, 6), i = d(i, r, o, n, e[3], 2399980690, 10), n = d(n, i, r, o, e[10], 4293915773, 15), o = d(o, n, i, r, e[1], 2240044497, 21), r = d(r, o, n, i, e[8], 1873313359, 6), i = d(i, r, o, n, e[15], 4264355552, 10), n = d(n, i, r, o, e[6], 2734768916, 15), o = d(o, n, i, r, e[13], 1309151649, 21), r = d(r, o, n, i, e[4], 4149444226, 6), i = d(i, r, o, n, e[11], 3174756917, 10), n = d(n, i, r, o, e[2], 718787259, 15), o = d(o, n, i, r, e[9], 3951481745, 21), this._a = this._a + r | 0, this._b = this._b + o | 0, this._c = this._c + n | 0, this._d = this._d + i | 0
    }, s.prototype._digest = function () {
      this._block[this._blockOffset++] = 128, 56 < this._blockOffset && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
      var e = o.allocUnsafe(16);
      return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), e.writeInt32LE(this._d, 12), e
    }, t.exports = s
  }, {"hash-base": 111, inherits: 142, "safe-buffer": 186}],
  146: [function (e, t, r) {
    var f = e("bn.js"), i = e("brorand");

    function n(e) {
      this.rand = e || new i.Rand
    }

    (t.exports = n).create = function (e) {
      return new n(e)
    }, n.prototype._randbelow = function (e) {
      var t = e.bitLength(), r = Math.ceil(t / 8);
      do {
        var i = new f(this.rand.generate(r))
      } while (0 <= i.cmp(e));
      return i
    }, n.prototype._randrange = function (e, t) {
      var r = t.sub(e);
      return e.add(this._randbelow(r))
    }, n.prototype.test = function (e, t, r) {
      var i = e.bitLength(), n = f.mont(e), o = new f(1).toRed(n);
      t = t || Math.max(1, i / 48 | 0);
      for (var a = e.subn(1), s = 0; !a.testn(s); s++) ;
      for (var l = e.shrn(s), u = a.toRed(n); 0 < t; t--) {
        var c = this._randrange(new f(2), a);
        r && r(c);
        var h = c.toRed(n).redPow(l);
        if (0 !== h.cmp(o) && 0 !== h.cmp(u)) {
          for (var d = 1; d < s; d++) {
            if (0 === (h = h.redSqr()).cmp(o)) return !1;
            if (0 === h.cmp(u)) break
          }
          if (d === s) return !1
        }
      }
      return !0
    }, n.prototype.getDivisor = function (e, t) {
      var r = e.bitLength(), i = f.mont(e), n = new f(1).toRed(i);
      t = t || Math.max(1, r / 48 | 0);
      for (var o = e.subn(1), a = 0; !o.testn(a); a++) ;
      for (var s = e.shrn(a), l = o.toRed(i); 0 < t; t--) {
        var u = this._randrange(new f(2), o), c = e.gcd(u);
        if (0 !== c.cmpn(1)) return c;
        var h = u.toRed(i).redPow(s);
        if (0 !== h.cmp(n) && 0 !== h.cmp(l)) {
          for (var d = 1; d < a; d++) {
            if (0 === (h = h.redSqr()).cmp(n)) return h.fromRed().subn(1).gcd(e);
            if (0 === h.cmp(l)) break
          }
          if (d === a) return (h = h.redSqr()).fromRed().subn(1).gcd(e)
        }
      }
      return !1
    }
  }, {"bn.js": 147, brorand: 18}],
  147: [function (e, t, r) {
    arguments[4][15][0].apply(r, arguments)
  }, {buffer: 19, dup: 15}],
  148: [function (e, t, r) {
    function i(e, t) {
      if (!e) throw new Error(t || "Assertion failed")
    }

    (t.exports = i).equal = function (e, t, r) {
      if (e != t) throw new Error(r || "Assertion failed: " + e + " != " + t)
    }
  }, {}],
  149: [function (e, t, r) {
    "use strict";
    var i = r;

    function n(e) {
      return 1 === e.length ? "0" + e : e
    }

    function o(e) {
      for (var t = "", r = 0; r < e.length; r++) t += n(e[r].toString(16));
      return t
    }

    i.toArray = function (e, t) {
      if (Array.isArray(e)) return e.slice();
      if (!e) return [];
      var r = [];
      if ("string" != typeof e) {
        for (var i = 0; i < e.length; i++) r[i] = 0 | e[i];
        return r
      }
      if ("hex" === t) {
        (e = e.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e = "0" + e);
        for (i = 0; i < e.length; i += 2) r.push(parseInt(e[i] + e[i + 1], 16))
      } else for (i = 0; i < e.length; i++) {
        var n = e.charCodeAt(i), o = n >> 8, a = 255 & n;
        o ? r.push(o, a) : r.push(a)
      }
      return r
    }, i.zero2 = n, i.toHex = o, i.encode = function (e, t) {
      return "hex" === t ? o(e) : e
    }
  }, {}],
  150: [function (e, t, r) {
    t.exports = {
      "2.16.840.1.101.3.4.1.1": "aes-128-ecb",
      "2.16.840.1.101.3.4.1.2": "aes-128-cbc",
      "2.16.840.1.101.3.4.1.3": "aes-128-ofb",
      "2.16.840.1.101.3.4.1.4": "aes-128-cfb",
      "2.16.840.1.101.3.4.1.21": "aes-192-ecb",
      "2.16.840.1.101.3.4.1.22": "aes-192-cbc",
      "2.16.840.1.101.3.4.1.23": "aes-192-ofb",
      "2.16.840.1.101.3.4.1.24": "aes-192-cfb",
      "2.16.840.1.101.3.4.1.41": "aes-256-ecb",
      "2.16.840.1.101.3.4.1.42": "aes-256-cbc",
      "2.16.840.1.101.3.4.1.43": "aes-256-ofb",
      "2.16.840.1.101.3.4.1.44": "aes-256-cfb"
    }
  }, {}],
  151: [function (e, t, r) {
    "use strict";
    var i = e("asn1.js");
    r.certificate = e("./certificate");
    var n = i.define("RSAPrivateKey", function () {
      this.seq().obj(this.key("version")["int"](), this.key("modulus")["int"](), this.key("publicExponent")["int"](), this.key("privateExponent")["int"](), this.key("prime1")["int"](), this.key("prime2")["int"](), this.key("exponent1")["int"](), this.key("exponent2")["int"](), this.key("coefficient")["int"]())
    });
    r.RSAPrivateKey = n;
    var o = i.define("RSAPublicKey", function () {
      this.seq().obj(this.key("modulus")["int"](), this.key("publicExponent")["int"]())
    });
    r.RSAPublicKey = o;
    var a = i.define("SubjectPublicKeyInfo", function () {
      this.seq().obj(this.key("algorithm").use(s), this.key("subjectPublicKey").bitstr())
    });
    r.PublicKey = a;
    var s = i.define("AlgorithmIdentifier", function () {
      this.seq().obj(this.key("algorithm").objid(), this.key("none").null_().optional(), this.key("curve").objid().optional(), this.key("params").seq().obj(this.key("p")["int"](), this.key("q")["int"](), this.key("g")["int"]()).optional())
    }), l = i.define("PrivateKeyInfo", function () {
      this.seq().obj(this.key("version")["int"](), this.key("algorithm").use(s), this.key("subjectPrivateKey").octstr())
    });
    r.PrivateKey = l;
    var u = i.define("EncryptedPrivateKeyInfo", function () {
      this.seq().obj(this.key("algorithm").seq().obj(this.key("id").objid(), this.key("decrypt").seq().obj(this.key("kde").seq().obj(this.key("id").objid(), this.key("kdeparams").seq().obj(this.key("salt").octstr(), this.key("iters")["int"]())), this.key("cipher").seq().obj(this.key("algo").objid(), this.key("iv").octstr()))), this.key("subjectPrivateKey").octstr())
    });
    r.EncryptedPrivateKey = u;
    var c = i.define("DSAPrivateKey", function () {
      this.seq().obj(this.key("version")["int"](), this.key("p")["int"](), this.key("q")["int"](), this.key("g")["int"](), this.key("pub_key")["int"](), this.key("priv_key")["int"]())
    });
    r.DSAPrivateKey = c, r.DSAparam = i.define("DSAparam", function () {
      this["int"]()
    });
    var h = i.define("ECPrivateKey", function () {
      this.seq().obj(this.key("version")["int"](), this.key("privateKey").octstr(), this.key("parameters").optional().explicit(0).use(d), this.key("publicKey").optional().explicit(1).bitstr())
    });
    r.ECPrivateKey = h;
    var d = i.define("ECParameters", function () {
      this.choice({namedCurve: this.objid()})
    });
    r.signature = i.define("signature", function () {
      this.seq().obj(this.key("r")["int"](), this.key("s")["int"]())
    })
  }, {"./certificate": 152, "asn1.js": 1}],
  152: [function (e, t, r) {
    "use strict";
    var i = e("asn1.js"), n = i.define("Time", function () {
      this.choice({utcTime: this.utctime(), generalTime: this.gentime()})
    }), o = i.define("AttributeTypeValue", function () {
      this.seq().obj(this.key("type").objid(), this.key("value").any())
    }), a = i.define("AlgorithmIdentifier", function () {
      this.seq().obj(this.key("algorithm").objid(), this.key("parameters").optional(), this.key("curve").objid().optional())
    }), s = i.define("SubjectPublicKeyInfo", function () {
      this.seq().obj(this.key("algorithm").use(a), this.key("subjectPublicKey").bitstr())
    }), l = i.define("RelativeDistinguishedName", function () {
      this.setof(o)
    }), u = i.define("RDNSequence", function () {
      this.seqof(l)
    }), c = i.define("Name", function () {
      this.choice({rdnSequence: this.use(u)})
    }), h = i.define("Validity", function () {
      this.seq().obj(this.key("notBefore").use(n), this.key("notAfter").use(n))
    }), d = i.define("Extension", function () {
      this.seq().obj(this.key("extnID").objid(), this.key("critical").bool().def(!1), this.key("extnValue").octstr())
    }), f = i.define("TBSCertificate", function () {
      this.seq().obj(this.key("version").explicit(0)["int"]().optional(), this.key("serialNumber")["int"](), this.key("signature").use(a), this.key("issuer").use(c), this.key("validity").use(h), this.key("subject").use(c), this.key("subjectPublicKeyInfo").use(s), this.key("issuerUniqueID").implicit(1).bitstr().optional(), this.key("subjectUniqueID").implicit(2).bitstr().optional(), this.key("extensions").explicit(3).seqof(d).optional())
    }), p = i.define("X509Certificate", function () {
      this.seq().obj(this.key("tbsCertificate").use(f), this.key("signatureAlgorithm").use(a), this.key("signatureValue").bitstr())
    });
    t.exports = p
  }, {"asn1.js": 1}],
  153: [function (e, t, r) {
    var d = /Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r\+\/\=]+)[\n\r]+/m,
        f = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----/m,
        p = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----([0-9A-z\n\r\+\/\=]+)-----END \1-----$/m,
        y = e("evp_bytestokey"), m = e("browserify-aes"), g = e("safe-buffer").Buffer;
    t.exports = function (e, t) {
      var r, i, n, o, a, s, l, u, c = e.toString(), h = c.match(d);
      return u = h ? (r = "aes" + h[1], i = g.from(h[2], "hex"), n = g.from(h[3].replace(/[\r\n]/g, ""), "base64"), o = y(t, i.slice(0, 8), parseInt(h[1], 10)).key, a = [], s = m.createDecipheriv(r, o, i), a.push(s.update(n)), a.push(s["final"]()), g.concat(a)) : (l = c.match(p), new g(l[2].replace(/[\r\n]/g, ""), "base64")), {
        tag: c.match(f)[1],
        data: u
      }
    }
  }, {"browserify-aes": 22, evp_bytestokey: 109, "safe-buffer": 186}],
  154: [function (e, t, r) {
    var b = e("./asn1"), v = e("./aesid.json"), _ = e("./fixProc"), w = e("browserify-aes"), S = e("pbkdf2"),
        E = e("safe-buffer").Buffer;

    function i(e) {
      var t;
      "object" != typeof e || E.isBuffer(e) || (t = e.passphrase, e = e.key), "string" == typeof e && (e = E.from(e));
      var r, i, n, o, a, s, l, u, c, h, d, f, p, y = _(e, t), m = y.tag, g = y.data;
      switch (m) {
        case"CERTIFICATE":
          i = b.certificate.decode(g, "der").tbsCertificate.subjectPublicKeyInfo;
        case"PUBLIC KEY":
          switch (r = (i = i || b.PublicKey.decode(g, "der")).algorithm.algorithm.join(".")) {
            case"1.2.840.113549.1.1.1":
              return b.RSAPublicKey.decode(i.subjectPublicKey.data, "der");
            case"1.2.840.10045.2.1":
              return i.subjectPrivateKey = i.subjectPublicKey, {type: "ec", data: i};
            case"1.2.840.10040.4.1":
              return i.algorithm.params.pub_key = b.DSAparam.decode(i.subjectPublicKey.data, "der"), {
                type: "dsa",
                data: i.algorithm.params
              };
            default:
              throw new Error("unknown key id " + r)
          }
          throw new Error("unknown key type " + m);
        case"ENCRYPTED PRIVATE KEY":
          g = b.EncryptedPrivateKey.decode(g, "der"), o = t, a = (n = g).algorithm.decrypt.kde.kdeparams.salt, s = parseInt(n.algorithm.decrypt.kde.kdeparams.iters.toString(), 10), l = v[n.algorithm.decrypt.cipher.algo.join(".")], u = n.algorithm.decrypt.cipher.iv, c = n.subjectPrivateKey, h = parseInt(l.split("-")[1], 10) / 8, d = S.pbkdf2Sync(o, a, s, h, "sha1"), f = w.createDecipheriv(l, d, u), (p = []).push(f.update(c)), p.push(f["final"]()), g = E.concat(p);
        case"PRIVATE KEY":
          switch (r = (i = b.PrivateKey.decode(g, "der")).algorithm.algorithm.join(".")) {
            case"1.2.840.113549.1.1.1":
              return b.RSAPrivateKey.decode(i.subjectPrivateKey, "der");
            case"1.2.840.10045.2.1":
              return {
                curve: i.algorithm.curve,
                privateKey: b.ECPrivateKey.decode(i.subjectPrivateKey, "der").privateKey
              };
            case"1.2.840.10040.4.1":
              return i.algorithm.params.priv_key = b.DSAparam.decode(i.subjectPrivateKey, "der"), {
                type: "dsa",
                params: i.algorithm.params
              };
            default:
              throw new Error("unknown key id " + r)
          }
          throw new Error("unknown key type " + m);
        case"RSA PUBLIC KEY":
          return b.RSAPublicKey.decode(g, "der");
        case"RSA PRIVATE KEY":
          return b.RSAPrivateKey.decode(g, "der");
        case"DSA PRIVATE KEY":
          return {type: "dsa", params: b.DSAPrivateKey.decode(g, "der")};
        case"EC PRIVATE KEY":
          return {curve: (g = b.ECPrivateKey.decode(g, "der")).parameters.value, privateKey: g.privateKey};
        default:
          throw new Error("unknown key type " + m)
      }
    }

    (t.exports = i).signature = b.signature
  }, {"./aesid.json": 150, "./asn1": 151, "./fixProc": 153, "browserify-aes": 22, pbkdf2: 155, "safe-buffer": 186}],
  155: [function (e, t, r) {
    r.pbkdf2 = e("./lib/async"), r.pbkdf2Sync = e("./lib/sync")
  }, {"./lib/async": 156, "./lib/sync": 159}],
  156: [function (e, t, r) {
    (function (u, c) {
      var h, d = e("./precondition"), f = e("./default-encoding"), p = e("./sync"), y = e("safe-buffer").Buffer,
          m = c.crypto && c.crypto.subtle, g = {
            sha: "SHA-1",
            "sha-1": "SHA-1",
            sha1: "SHA-1",
            sha256: "SHA-256",
            "sha-256": "SHA-256",
            sha384: "SHA-384",
            "sha-384": "SHA-384",
            "sha-512": "SHA-512",
            sha512: "SHA-512"
          }, b = [];

      function v(e, t, r, i, n) {
        return m.importKey("raw", e, {name: "PBKDF2"}, !1, ["deriveBits"]).then(function (e) {
          return m.deriveBits({name: "PBKDF2", salt: t, iterations: r, hash: {name: n}}, e, i << 3)
        }).then(function (e) {
          return y.from(e)
        })
      }

      t.exports = function (t, r, i, n, o, a) {
        "function" == typeof o && (a = o, o = void 0);
        var e, s, l = g[(o = o || "sha1").toLowerCase()];
        if (!l || "function" != typeof c.Promise) return u.nextTick(function () {
          var e;
          try {
            e = p(t, r, i, n, o)
          } catch (e) {
            return a(e)
          }
          a(null, e)
        });
        if (d(t, r, i, n), "function" != typeof a) throw new Error("No callback provided to pbkdf2");
        y.isBuffer(t) || (t = y.from(t, f)), y.isBuffer(r) || (r = y.from(r, f)), e = function (e) {
          if (c.process && !c.process.browser) return Promise.resolve(!1);
          if (!m || !m.importKey || !m.deriveBits) return Promise.resolve(!1);
          if (void 0 !== b[e]) return b[e];
          var t = v(h = h || y.alloc(8), h, 10, 128, e).then(function () {
            return !0
          })["catch"](function () {
            return !1
          });
          return b[e] = t
        }(l).then(function (e) {
          return e ? v(t, r, i, n, l) : p(t, r, i, n, o)
        }), s = a, e.then(function (e) {
          u.nextTick(function () {
            s(null, e)
          })
        }, function (e) {
          u.nextTick(function () {
            s(e)
          })
        })
      }
    }).call(this, e("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
  }, {"./default-encoding": 157, "./precondition": 158, "./sync": 159, _process: 161, "safe-buffer": 186}],
  157: [function (e, r, t) {
    (function (e) {
      var t;
      t = e.browser || 6 <= parseInt(e.version.split(".")[0].slice(1), 10) ? "utf-8" : "binary", r.exports = t
    }).call(this, e("_process"))
  }, {_process: 161}],
  158: [function (e, t, r) {
    (function (r) {
      var n = Math.pow(2, 30) - 1;

      function o(e, t) {
        if ("string" != typeof e && !r.isBuffer(e)) throw new TypeError(t + " must be a buffer or string")
      }

      t.exports = function (e, t, r, i) {
        if (o(e, "Password"), o(t, "Salt"), "number" != typeof r) throw new TypeError("Iterations not a number");
        if (r < 0) throw new TypeError("Bad iterations");
        if ("number" != typeof i) throw new TypeError("Key length not a number");
        if (i < 0 || n < i || i != i) throw new TypeError("Bad key length")
      }
    }).call(this, {isBuffer: e("../../is-buffer/index.js")})
  }, {"../../is-buffer/index.js": 143}],
  159: [function (e, t, r) {
    var c = e("create-hash/md5"), h = e("ripemd160"), d = e("sha.js"), m = e("./precondition"),
        g = e("./default-encoding"), b = e("safe-buffer").Buffer, f = b.alloc(128),
        v = {md5: 16, sha1: 20, sha224: 28, sha256: 32, sha384: 48, sha512: 64, rmd160: 20, ripemd160: 20};

    function _(e, t, r) {
      var i, n = "rmd160" === (i = e) || "ripemd160" === i ? function (e) {
        return (new h).update(e).digest()
      } : "md5" === i ? c : function (e) {
        return d(i).update(e).digest()
      }, o = "sha512" === e || "sha384" === e ? 128 : 64;
      t.length > o ? t = n(t) : t.length < o && (t = b.concat([t, f], o));
      for (var a = b.allocUnsafe(o + v[e]), s = b.allocUnsafe(o + v[e]), l = 0; l < o; l++) a[l] = 54 ^ t[l], s[l] = 92 ^ t[l];
      var u = b.allocUnsafe(o + r + 4);
      a.copy(u, 0, 0, o), this.ipad1 = u, this.ipad2 = a, this.opad = s, this.alg = e, this.blocksize = o, this.hash = n, this.size = v[e]
    }

    _.prototype.run = function (e, t) {
      return e.copy(t, this.blocksize), this.hash(t).copy(this.opad, this.blocksize), this.hash(this.opad)
    }, t.exports = function (e, t, r, i, n) {
      m(e, t, r, i), b.isBuffer(e) || (e = b.from(e, g)), b.isBuffer(t) || (t = b.from(t, g));
      var o = new _(n = n || "sha1", e, t.length), a = b.allocUnsafe(i), s = b.allocUnsafe(t.length + 4);
      t.copy(s, 0, 0, t.length);
      for (var l = 0, u = v[n], c = Math.ceil(i / u), h = 1; h <= c; h++) {
        s.writeUInt32BE(h, t.length);
        for (var d = o.run(s, o.ipad1), f = d, p = 1; p < r; p++) {
          f = o.run(f, o.ipad2);
          for (var y = 0; y < u; y++) d[y] ^= f[y]
        }
        d.copy(a, l), l += u
      }
      return a
    }
  }, {
    "./default-encoding": 157,
    "./precondition": 158,
    "create-hash/md5": 70,
    ripemd160: 185,
    "safe-buffer": 186,
    "sha.js": 188
  }],
  160: [function (e, t, r) {
    (function (s) {
      "use strict";
      void 0 === s || !s.version || 0 === s.version.indexOf("v0.") || 0 === s.version.indexOf("v1.") && 0 !== s.version.indexOf("v1.8.") ? t.exports = {
        nextTick: function (e, t, r, i) {
          if ("function" != typeof e) throw new TypeError('"callback" argument must be a function');
          var n, o, a = arguments.length;
          switch (a) {
            case 0:
            case 1:
              return s.nextTick(e);
            case 2:
              return s.nextTick(function () {
                e.call(null, t)
              });
            case 3:
              return s.nextTick(function () {
                e.call(null, t, r)
              });
            case 4:
              return s.nextTick(function () {
                e.call(null, t, r, i)
              });
            default:
              for (n = new Array(a - 1), o = 0; o < n.length;) n[o++] = arguments[o];
              return s.nextTick(function () {
                e.apply(null, n)
              })
          }
        }
      } : t.exports = s
    }).call(this, e("_process"))
  }, {_process: 161}],
  161: [function (e, t, r) {
    var i, n, o = t.exports = {};

    function a() {
      throw new Error("setTimeout has not been defined")
    }

    function s() {
      throw new Error("clearTimeout has not been defined")
    }

    function l(t) {
      if (i === setTimeout) return setTimeout(t, 0);
      if ((i === a || !i) && setTimeout) return i = setTimeout, setTimeout(t, 0);
      try {
        return i(t, 0)
      } catch (e) {
        try {
          return i.call(null, t, 0)
        } catch (e) {
          return i.call(this, t, 0)
        }
      }
    }

    !function () {
      try {
        i = "function" == typeof setTimeout ? setTimeout : a
      } catch (e) {
        i = a
      }
      try {
        n = "function" == typeof clearTimeout ? clearTimeout : s
      } catch (e) {
        n = s
      }
    }();
    var u, c = [], h = !1, d = -1;

    function f() {
      h && u && (h = !1, u.length ? c = u.concat(c) : d = -1, c.length && p())
    }

    function p() {
      if (!h) {
        var e = l(f);
        h = !0;
        for (var t = c.length; t;) {
          for (u = c, c = []; ++d < t;) u && u[d].run();
          d = -1, t = c.length
        }
        u = null, h = !1, function (t) {
          if (n === clearTimeout) return clearTimeout(t);
          if ((n === s || !n) && clearTimeout) return n = clearTimeout, clearTimeout(t);
          try {
            n(t)
          } catch (e) {
            try {
              return n.call(null, t)
            } catch (e) {
              return n.call(this, t)
            }
          }
        }(e)
      }
    }

    function y(e, t) {
      this.fun = e, this.array = t
    }

    function m() {
    }

    o.nextTick = function (e) {
      var t = new Array(arguments.length - 1);
      if (1 < arguments.length) for (var r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
      c.push(new y(e, t)), 1 !== c.length || h || l(p)
    }, y.prototype.run = function () {
      this.fun.apply(null, this.array)
    }, o.title = "browser", o.browser = !0, o.env = {}, o.argv = [], o.version = "", o.versions = {}, o.on = m, o.addListener = m, o.once = m, o.off = m, o.removeListener = m, o.removeAllListeners = m, o.emit = m, o.prependListener = m, o.prependOnceListener = m, o.listeners = function (e) {
      return []
    }, o.binding = function (e) {
      throw new Error("process.binding is not supported")
    }, o.cwd = function () {
      return "/"
    }, o.chdir = function (e) {
      throw new Error("process.chdir is not supported")
    }, o.umask = function () {
      return 0
    }
  }, {}],
  162: [function (e, t, r) {
    r.publicEncrypt = e("./publicEncrypt"), r.privateDecrypt = e("./privateDecrypt"), r.privateEncrypt = function (e, t) {
      return r.publicEncrypt(e, t, !0)
    }, r.publicDecrypt = function (e, t) {
      return r.privateDecrypt(e, t, !0)
    }
  }, {"./privateDecrypt": 165, "./publicEncrypt": 166}],
  163: [function (e, t, r) {
    var o = e("create-hash"), a = e("safe-buffer").Buffer;

    function s(e) {
      var t = a.allocUnsafe(4);
      return t.writeUInt32BE(e, 0), t
    }

    t.exports = function (e, t) {
      for (var r, i = a.alloc(0), n = 0; i.length < t;) r = s(n++), i = a.concat([i, o("sha1").update(e).update(r).digest()]);
      return i.slice(0, t)
    }
  }, {"create-hash": 69, "safe-buffer": 186}],
  164: [function (e, t, r) {
    arguments[4][15][0].apply(r, arguments)
  }, {buffer: 19, dup: 15}],
  165: [function (e, t, r) {
    var l = e("parse-asn1"), c = e("./mgf"), h = e("./xor"), u = e("bn.js"), d = e("browserify-rsa"),
        f = e("create-hash"), p = e("./withPublic"), y = e("safe-buffer").Buffer;
    t.exports = function (e, t, r) {
      var i = e.padding ? e.padding : r ? 1 : 4, n = l(e), o = n.modulus.byteLength();
      if (t.length > o || 0 <= new u(t).cmp(n.modulus)) throw new Error("decryption error");
      s = r ? p(new u(t), n) : d(t, n);
      var a = y.alloc(o - s.length), s = y.concat([a, s], o);
      if (4 === i) return function (e, t) {
        var r = e.modulus.byteLength(), i = f("sha1").update(y.alloc(0)).digest(), n = i.length;
        if (0 !== t[0]) throw new Error("decryption error");
        var o = t.slice(1, n + 1), a = t.slice(n + 1), s = h(o, c(a, n)), l = h(a, c(s, r - n - 1));
        if (function (e, t) {
          e = y.from(e), t = y.from(t);
          var r = 0, i = e.length;
          e.length !== t.length && (r++, i = Math.min(e.length, t.length));
          var n = -1;
          for (; ++n < i;) r += e[n] ^ t[n];
          return r
        }(i, l.slice(0, n))) throw new Error("decryption error");
        var u = n;
        for (; 0 === l[u];) u++;
        if (1 === l[u++]) return l.slice(u);
        throw new Error("decryption error")
      }(n, s);
      if (1 === i) return function (e, t) {
        var r = e.slice(0, 2), i = 2, n = 0;
        for (; 0 !== e[i++];) if (i >= e.length) {
          n++;
          break
        }
        var o = e.slice(2, i - 1);
        ("0002" !== r.toString("hex") && !t || "0001" !== r.toString("hex") && t) && n++;
        o.length < 8 && n++;
        if (n) throw new Error("decryption error");
        return e.slice(i)
      }(s, r);
      if (3 === i) return s;
      throw new Error("unknown padding")
    }
  }, {
    "./mgf": 163,
    "./withPublic": 167,
    "./xor": 168,
    "bn.js": 164,
    "browserify-rsa": 40,
    "create-hash": 69,
    "parse-asn1": 154,
    "safe-buffer": 186
  }],
  166: [function (e, t, r) {
    var a = e("parse-asn1"), d = e("randombytes"), f = e("create-hash"), p = e("./mgf"), y = e("./xor"), m = e("bn.js"),
        s = e("./withPublic"), l = e("browserify-rsa"), g = e("safe-buffer").Buffer;
    t.exports = function (e, t, r) {
      var i, n = e.padding ? e.padding : r ? 1 : 4, o = a(e);
      if (4 === n) i = function (e, t) {
        var r = e.modulus.byteLength(), i = t.length, n = f("sha1").update(g.alloc(0)).digest(), o = n.length,
            a = 2 * o;
        if (r - a - 2 < i) throw new Error("message too long");
        var s = g.alloc(r - i - a - 2), l = r - o - 1, u = d(o), c = y(g.concat([n, s, g.alloc(1, 1), t], l), p(u, l)),
            h = y(u, p(c, o));
        return new m(g.concat([g.alloc(1), h, c], r))
      }(o, t); else if (1 === n) i = function (e, t, r) {
        var i, n = t.length, o = e.modulus.byteLength();
        if (o - 11 < n) throw new Error("message too long");
        i = r ? g.alloc(o - n - 3, 255) : function (e) {
          var t, r = g.allocUnsafe(e), i = 0, n = d(2 * e), o = 0;
          for (; i < e;) o === n.length && (n = d(2 * e), o = 0), (t = n[o++]) && (r[i++] = t);
          return r
        }(o - n - 3);
        return new m(g.concat([g.from([0, r ? 1 : 2]), i, g.alloc(1), t], o))
      }(o, t, r); else {
        if (3 !== n) throw new Error("unknown padding");
        if (0 <= (i = new m(t)).cmp(o.modulus)) throw new Error("data too long for modulus")
      }
      return (r ? l : s)(i, o)
    }
  }, {
    "./mgf": 163,
    "./withPublic": 167,
    "./xor": 168,
    "bn.js": 164,
    "browserify-rsa": 40,
    "create-hash": 69,
    "parse-asn1": 154,
    randombytes: 169,
    "safe-buffer": 186
  }],
  167: [function (e, t, r) {
    var i = e("bn.js"), n = e("safe-buffer").Buffer;
    t.exports = function (e, t) {
      return n.from(e.toRed(i.mont(t.modulus)).redPow(new i(t.publicExponent)).fromRed().toArray())
    }
  }, {"bn.js": 164, "safe-buffer": 186}],
  168: [function (e, t, r) {
    t.exports = function (e, t) {
      for (var r = e.length, i = -1; ++i < r;) e[i] ^= t[i];
      return e
    }
  }, {}],
  169: [function (t, r, e) {
    (function (n, e) {
      "use strict";
      var o = t("safe-buffer").Buffer, a = e.crypto || e.msCrypto;
      a && a.getRandomValues ? r.exports = function (e, t) {
        if (4294967295 < e) throw new RangeError("requested too many random bytes");
        var r = o.allocUnsafe(e);
        if (0 < e) if (65536 < e) for (var i = 0; i < e; i += 65536) a.getRandomValues(r.slice(i, i + 65536)); else a.getRandomValues(r);
        return "function" != typeof t ? r : n.nextTick(function () {
          t(null, r)
        })
      } : r.exports = function () {
        throw new Error("Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11")
      }
    }).call(this, t("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
  }, {_process: 161, "safe-buffer": 186}],
  170: [function (r, e, f) {
    (function (a, n) {
      "use strict";

      function e() {
        throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11")
      }

      var t = r("safe-buffer"), s = r("randombytes"), o = t.Buffer, i = t.kMaxLength, l = n.crypto || n.msCrypto,
          u = Math.pow(2, 32) - 1;

      function c(e, t) {
        if ("number" != typeof e || e != e) throw new TypeError("offset must be a number");
        if (u < e || e < 0) throw new TypeError("offset must be a uint32");
        if (i < e || t < e) throw new RangeError("offset out of range")
      }

      function h(e, t, r) {
        if ("number" != typeof e || e != e) throw new TypeError("size must be a number");
        if (u < e || e < 0) throw new TypeError("size must be a uint32");
        if (r < e + t || i < e) throw new RangeError("buffer too small")
      }

      function d(r, i, e, n) {
        if (a.browser) {
          var t = r.buffer, o = new Uint8Array(t, i, e);
          return l.getRandomValues(o), n ? void a.nextTick(function () {
            n(null, r)
          }) : r
        }
        if (!n) return s(e).copy(r, i), r;
        s(e, function (e, t) {
          if (e) return n(e);
          t.copy(r, i), n(null, r)
        })
      }

      l && l.getRandomValues || !a.browser ? (f.randomFill = function (e, t, r, i) {
        if (!(o.isBuffer(e) || e instanceof n.Uint8Array)) throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
        if ("function" == typeof t) i = t, t = 0, r = e.length; else if ("function" == typeof r) i = r, r = e.length - t; else if ("function" != typeof i) throw new TypeError('"cb" argument must be a function');
        return c(t, e.length), h(r, t, e.length), d(e, t, r, i)
      }, f.randomFillSync = function (e, t, r) {
        void 0 === t && (t = 0);
        if (!(o.isBuffer(e) || e instanceof n.Uint8Array)) throw new TypeError('"buf" argument must be a Buffer or Uint8Array');
        c(t, e.length), void 0 === r && (r = e.length - t);
        return h(r, t, e.length), d(e, t, r)
      }) : (f.randomFill = e, f.randomFillSync = e)
    }).call(this, r("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
  }, {_process: 161, randombytes: 169, "safe-buffer": 186}],
  171: [function (e, t, r) {
    t.exports = e("./lib/_stream_duplex.js")
  }, {"./lib/_stream_duplex.js": 172}],
  172: [function (e, t, r) {
    "use strict";
    var i = e("process-nextick-args"), n = Object.keys || function (e) {
      var t = [];
      for (var r in e) t.push(r);
      return t
    };
    t.exports = h;
    var o = Object.create(e("core-util-is"));
    o.inherits = e("inherits");
    var a = e("./_stream_readable"), s = e("./_stream_writable");
    o.inherits(h, a);
    for (var l = n(s.prototype), u = 0; u < l.length; u++) {
      var c = l[u];
      h.prototype[c] || (h.prototype[c] = s.prototype[c])
    }

    function h(e) {
      if (!(this instanceof h)) return new h(e);
      a.call(this, e), s.call(this, e), e && !1 === e.readable && (this.readable = !1), e && !1 === e.writable && (this.writable = !1), this.allowHalfOpen = !0, e && !1 === e.allowHalfOpen && (this.allowHalfOpen = !1), this.once("end", d)
    }

    function d() {
      this.allowHalfOpen || this._writableState.ended || i.nextTick(f, this)
    }

    function f(e) {
      e.end()
    }

    Object.defineProperty(h.prototype, "writableHighWaterMark", {
      enumerable: !1, get: function () {
        return this._writableState.highWaterMark
      }
    }), Object.defineProperty(h.prototype, "destroyed", {
      get: function () {
        return void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed && this._writableState.destroyed)
      }, set: function (e) {
        void 0 !== this._readableState && void 0 !== this._writableState && (this._readableState.destroyed = e, this._writableState.destroyed = e)
      }
    }), h.prototype._destroy = function (e, t) {
      this.push(null), this.end(), i.nextTick(t, e)
    }
  }, {
    "./_stream_readable": 174,
    "./_stream_writable": 176,
    "core-util-is": 66,
    inherits: 142,
    "process-nextick-args": 160
  }],
  173: [function (e, t, r) {
    "use strict";
    t.exports = o;
    var i = e("./_stream_transform"), n = Object.create(e("core-util-is"));

    function o(e) {
      if (!(this instanceof o)) return new o(e);
      i.call(this, e)
    }

    n.inherits = e("inherits"), n.inherits(o, i), o.prototype._transform = function (e, t, r) {
      r(null, e)
    }
  }, {"./_stream_transform": 175, "core-util-is": 66, inherits: 142}],
  174: [function (L, D, e) {
    (function (m, e) {
      "use strict";
      var g = L("process-nextick-args");
      D.exports = d;
      var a, b = L("isarray");
      d.ReadableState = o;

      function v(e, t) {
        return e.listeners(t).length
      }

      L("events").EventEmitter;
      var n = L("./internal/streams/stream"), u = L("safe-buffer").Buffer, c = e.Uint8Array || function () {
      };
      var t = Object.create(L("core-util-is"));
      t.inherits = L("inherits");
      var s, r = L("util"), _ = void 0, _ = r && r.debuglog ? r.debuglog("stream") : function () {
      }, l = L("./internal/streams/BufferList"), i = L("./internal/streams/destroy");
      t.inherits(d, n);
      var h = ["error", "close", "destroy", "pause", "resume"];

      function o(e, t) {
        e = e || {};
        var r = t instanceof (a = a || L("./_stream_duplex"));
        this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.readableObjectMode);
        var i = e.highWaterMark, n = e.readableHighWaterMark, o = this.objectMode ? 16 : 16384;
        this.highWaterMark = i || 0 === i ? i : r && (n || 0 === n) ? n : o, this.highWaterMark = Math.floor(this.highWaterMark), this.buffer = new l, this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.destroyed = !1, this.defaultEncoding = e.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, e.encoding && (s = s || L("string_decoder/").StringDecoder, this.decoder = new s(e.encoding), this.encoding = e.encoding)
      }

      function d(e) {
        if (a = a || L("./_stream_duplex"), !(this instanceof d)) return new d(e);
        this._readableState = new o(e, this), this.readable = !0, e && ("function" == typeof e.read && (this._read = e.read), "function" == typeof e.destroy && (this._destroy = e.destroy)), n.call(this)
      }

      function f(e, t, r, i, n) {
        var o, a, s, l = e._readableState;
        return null === t ? (l.reading = !1, function (e, t) {
          if (t.ended) return;
          {
            var r;
            !t.decoder || (r = t.decoder.end()) && r.length && (t.buffer.push(r), t.length += t.objectMode ? 1 : r.length)
          }
          t.ended = !0, S(e)
        }(e, l)) : (n || (o = function (e, t) {
          var r;
          (function (e) {
            return u.isBuffer(e) || e instanceof c
          })(t) || "string" == typeof t || void 0 === t || e.objectMode || (r = new TypeError("Invalid non-string/buffer chunk"));
          return r
        }(l, t)), o ? e.emit("error", o) : l.objectMode || t && 0 < t.length ? ("string" == typeof t || l.objectMode || Object.getPrototypeOf(t) === u.prototype || (a = t, t = u.from(a)), i ? l.endEmitted ? e.emit("error", new Error("stream.unshift() after end event")) : p(e, l, t, !0) : l.ended ? e.emit("error", new Error("stream.push() after EOF")) : (l.reading = !1, l.decoder && !r ? (t = l.decoder.write(t), l.objectMode || 0 !== t.length ? p(e, l, t, !1) : x(e, l)) : p(e, l, t, !1))) : i || (l.reading = !1)), !(s = l).ended && (s.needReadable || s.length < s.highWaterMark || 0 === s.length)
      }

      function p(e, t, r, i) {
        t.flowing && 0 === t.length && !t.sync ? (e.emit("data", r), e.read(0)) : (t.length += t.objectMode ? 1 : r.length, i ? t.buffer.unshift(r) : t.buffer.push(r), t.needReadable && S(e)), x(e, t)
      }

      Object.defineProperty(d.prototype, "destroyed", {
        get: function () {
          return void 0 !== this._readableState && this._readableState.destroyed
        }, set: function (e) {
          this._readableState && (this._readableState.destroyed = e)
        }
      }), d.prototype.destroy = i.destroy, d.prototype._undestroy = i.undestroy, d.prototype._destroy = function (e, t) {
        this.push(null), t(e)
      }, d.prototype.push = function (e, t) {
        var r, i = this._readableState;
        return i.objectMode ? r = !0 : "string" == typeof e && ((t = t || i.defaultEncoding) !== i.encoding && (e = u.from(e, t), t = ""), r = !0), f(this, e, t, !1, r)
      }, d.prototype.unshift = function (e) {
        return f(this, e, null, !0, !1)
      }, d.prototype.isPaused = function () {
        return !1 === this._readableState.flowing
      }, d.prototype.setEncoding = function (e) {
        return s = s || L("string_decoder/").StringDecoder, this._readableState.decoder = new s(e), this._readableState.encoding = e, this
      };
      var y = 8388608;

      function w(e, t) {
        return e <= 0 || 0 === t.length && t.ended ? 0 : t.objectMode ? 1 : e != e ? t.flowing && t.length ? t.buffer.head.data.length : t.length : (e > t.highWaterMark && (t.highWaterMark = (y <= (r = e) ? r = y : (r--, r |= r >>> 1, r |= r >>> 2, r |= r >>> 4, r |= r >>> 8, r |= r >>> 16, r++), r)), e <= t.length ? e : t.ended ? t.length : (t.needReadable = !0, 0));
        var r
      }

      function S(e) {
        var t = e._readableState;
        t.needReadable = !1, t.emittedReadable || (_("emitReadable", t.flowing), t.emittedReadable = !0, t.sync ? g.nextTick(E, e) : E(e))
      }

      function E(e) {
        _("emit readable"), e.emit("readable"), P(e)
      }

      function x(e, t) {
        t.readingMore || (t.readingMore = !0, g.nextTick(T, e, t))
      }

      function T(e, t) {
        for (var r = t.length; !t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark && (_("maybeReadMore read 0"), e.read(0), r !== t.length);) r = t.length;
        t.readingMore = !1
      }

      function M(e) {
        _("readable nexttick read 0"), e.read(0)
      }

      function k(e, t) {
        t.reading || (_("resume read 0"), e.read(0)), t.resumeScheduled = !1, t.awaitDrain = 0, e.emit("resume"), P(e), t.flowing && !t.reading && e.read(0)
      }

      function P(e) {
        var t = e._readableState;
        for (_("flow", t.flowing); t.flowing && null !== e.read();) ;
      }

      function C(e, t) {
        return 0 === t.length ? null : (t.objectMode ? r = t.buffer.shift() : !e || e >= t.length ? (r = t.decoder ? t.buffer.join("") : 1 === t.buffer.length ? t.buffer.head.data : t.buffer.concat(t.length), t.buffer.clear()) : r = function (e, t, r) {
          var i;
          e < t.head.data.length ? (i = t.head.data.slice(0, e), t.head.data = t.head.data.slice(e)) : i = e === t.head.data.length ? t.shift() : (r ? function (e, t) {
            var r = t.head, i = 1, n = r.data;
            e -= n.length;
            for (; r = r.next;) {
              var o = r.data, a = e > o.length ? o.length : e;
              if (a === o.length ? n += o : n += o.slice(0, e), 0 === (e -= a)) {
                a === o.length ? (++i, r.next ? t.head = r.next : t.head = t.tail = null) : (t.head = r).data = o.slice(a);
                break
              }
              ++i
            }
            return t.length -= i, n
          } : function (e, t) {
            var r = u.allocUnsafe(e), i = t.head, n = 1;
            i.data.copy(r), e -= i.data.length;
            for (; i = i.next;) {
              var o = i.data, a = e > o.length ? o.length : e;
              if (o.copy(r, r.length - e, 0, a), 0 === (e -= a)) {
                a === o.length ? (++n, i.next ? t.head = i.next : t.head = t.tail = null) : (t.head = i).data = o.slice(a);
                break
              }
              ++n
            }
            return t.length -= n, r
          })(e, t);
          return i
        }(e, t.buffer, t.decoder), r);
        var r
      }

      function A(e) {
        var t = e._readableState;
        if (0 < t.length) throw new Error('"endReadable()" called on non-empty stream');
        t.endEmitted || (t.ended = !0, g.nextTick(I, t, e))
      }

      function I(e, t) {
        e.endEmitted || 0 !== e.length || (e.endEmitted = !0, t.readable = !1, t.emit("end"))
      }

      function R(e, t) {
        for (var r = 0, i = e.length; r < i; r++) if (e[r] === t) return r;
        return -1
      }

      d.prototype.read = function (e) {
        _("read", e), e = parseInt(e, 10);
        var t = this._readableState, r = e;
        if (0 !== e && (t.emittedReadable = !1), 0 === e && t.needReadable && (t.length >= t.highWaterMark || t.ended)) return _("read: emitReadable", t.length, t.ended), (0 === t.length && t.ended ? A : S)(this), null;
        if (0 === (e = w(e, t)) && t.ended) return 0 === t.length && A(this), null;
        var i, n = t.needReadable;
        return _("need readable", n), (0 === t.length || t.length - e < t.highWaterMark) && _("length less than watermark", n = !0), t.ended || t.reading ? _("reading or ended", n = !1) : n && (_("do read"), t.reading = !0, t.sync = !0, 0 === t.length && (t.needReadable = !0), this._read(t.highWaterMark), t.sync = !1, t.reading || (e = w(r, t))), null === (i = 0 < e ? C(e, t) : null) ? (t.needReadable = !0, e = 0) : t.length -= e, 0 === t.length && (t.ended || (t.needReadable = !0), r !== e && t.ended && A(this)), null !== i && this.emit("data", i), i
      }, d.prototype._read = function (e) {
        this.emit("error", new Error("_read() is not implemented"))
      }, d.prototype.pipe = function (r, e) {
        var i = this, n = this._readableState;
        switch (n.pipesCount) {
          case 0:
            n.pipes = r;
            break;
          case 1:
            n.pipes = [n.pipes, r];
            break;
          default:
            n.pipes.push(r)
        }
        n.pipesCount += 1, _("pipe count=%d opts=%j", n.pipesCount, e);
        var t = (!e || !1 !== e.end) && r !== m.stdout && r !== m.stderr ? a : y;

        function o(e, t) {
          _("onunpipe"), e === i && t && !1 === t.hasUnpiped && (t.hasUnpiped = !0, _("cleanup"), r.removeListener("close", f), r.removeListener("finish", p), r.removeListener("drain", l), r.removeListener("error", d), r.removeListener("unpipe", o), i.removeListener("end", a), i.removeListener("end", y), i.removeListener("data", h), u = !0, !n.awaitDrain || r._writableState && !r._writableState.needDrain || l())
        }

        function a() {
          _("onend"), r.end()
        }

        n.endEmitted ? g.nextTick(t) : i.once("end", t), r.on("unpipe", o);
        var s, l = (s = i, function () {
          var e = s._readableState;
          _("pipeOnDrain", e.awaitDrain), e.awaitDrain && e.awaitDrain--, 0 === e.awaitDrain && v(s, "data") && (e.flowing = !0, P(s))
        });
        r.on("drain", l);
        var u = !1;
        var c = !1;

        function h(e) {
          _("ondata"), (c = !1) !== r.write(e) || c || ((1 === n.pipesCount && n.pipes === r || 1 < n.pipesCount && -1 !== R(n.pipes, r)) && !u && (_("false write response, pause", i._readableState.awaitDrain), i._readableState.awaitDrain++, c = !0), i.pause())
        }

        function d(e) {
          _("onerror", e), y(), r.removeListener("error", d), 0 === v(r, "error") && r.emit("error", e)
        }

        function f() {
          r.removeListener("finish", p), y()
        }

        function p() {
          _("onfinish"), r.removeListener("close", f), y()
        }

        function y() {
          _("unpipe"), i.unpipe(r)
        }

        return i.on("data", h), function (e, t, r) {
          if ("function" == typeof e.prependListener) return e.prependListener(t, r);
          e._events && e._events[t] ? b(e._events[t]) ? e._events[t].unshift(r) : e._events[t] = [r, e._events[t]] : e.on(t, r)
        }(r, "error", d), r.once("close", f), r.once("finish", p), r.emit("pipe", i), n.flowing || (_("pipe resume"), i.resume()), r
      }, d.prototype.unpipe = function (e) {
        var t = this._readableState, r = {hasUnpiped: !1};
        if (0 === t.pipesCount) return this;
        if (1 === t.pipesCount) return e && e !== t.pipes || (e = e || t.pipes, t.pipes = null, t.pipesCount = 0, t.flowing = !1, e && e.emit("unpipe", this, r)), this;
        if (!e) {
          var i = t.pipes, n = t.pipesCount;
          t.pipes = null, t.pipesCount = 0, t.flowing = !1;
          for (var o = 0; o < n; o++) i[o].emit("unpipe", this, r);
          return this
        }
        var a = R(t.pipes, e);
        return -1 === a || (t.pipes.splice(a, 1), --t.pipesCount, 1 === t.pipesCount && (t.pipes = t.pipes[0]), e.emit("unpipe", this, r)), this
      }, d.prototype.addListener = d.prototype.on = function (e, t) {
        var r, i = n.prototype.on.call(this, e, t);
        return "data" === e ? !1 !== this._readableState.flowing && this.resume() : "readable" === e && ((r = this._readableState).endEmitted || r.readableListening || (r.readableListening = r.needReadable = !0, r.emittedReadable = !1, r.reading ? r.length && S(this) : g.nextTick(M, this))), i
      }, d.prototype.resume = function () {
        var e, t, r = this._readableState;
        return r.flowing || (_("resume"), r.flowing = !0, e = this, (t = r).resumeScheduled || (t.resumeScheduled = !0, g.nextTick(k, e, t))), this
      }, d.prototype.pause = function () {
        return _("call pause flowing=%j", this._readableState.flowing), !1 !== this._readableState.flowing && (_("pause"), this._readableState.flowing = !1, this.emit("pause")), this
      }, d.prototype.wrap = function (t) {
        var r = this, i = this._readableState, n = !1;
        for (var e in t.on("end", function () {
          var e;
          _("wrapped end"), !i.decoder || i.ended || (e = i.decoder.end()) && e.length && r.push(e), r.push(null)
        }), t.on("data", function (e) {
          _("wrapped data"), i.decoder && (e = i.decoder.write(e)), i.objectMode && null == e || (i.objectMode || e && e.length) && (r.push(e) || (n = !0, t.pause()))
        }), t) void 0 === this[e] && "function" == typeof t[e] && (this[e] = function (e) {
          return function () {
            return t[e].apply(t, arguments)
          }
        }(e));
        for (var o = 0; o < h.length; o++) t.on(h[o], this.emit.bind(this, h[o]));
        return this._read = function (e) {
          _("wrapped _read", e), n && (n = !1, t.resume())
        }, this
      }, Object.defineProperty(d.prototype, "readableHighWaterMark", {
        enumerable: !1, get: function () {
          return this._readableState.highWaterMark
        }
      }), d._fromList = C
    }).call(this, L("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
  }, {
    "./_stream_duplex": 172,
    "./internal/streams/BufferList": 177,
    "./internal/streams/destroy": 178,
    "./internal/streams/stream": 179,
    _process: 161,
    "core-util-is": 66,
    events: 108,
    inherits: 142,
    isarray: 144,
    "process-nextick-args": 160,
    "safe-buffer": 186,
    "string_decoder/": 180,
    util: 19
  }],
  175: [function (e, t, r) {
    "use strict";
    t.exports = o;
    var i = e("./_stream_duplex"), n = Object.create(e("core-util-is"));

    function o(e) {
      if (!(this instanceof o)) return new o(e);
      i.call(this, e), this._transformState = {
        afterTransform: function (e, t) {
          var r = this._transformState;
          r.transforming = !1;
          var i = r.writecb;
          if (!i) return this.emit("error", new Error("write callback called multiple times"));
          r.writechunk = null, (r.writecb = null) != t && this.push(t), i(e);
          var n = this._readableState;
          n.reading = !1, (n.needReadable || n.length < n.highWaterMark) && this._read(n.highWaterMark)
        }.bind(this), needTransform: !1, transforming: !1, writecb: null, writechunk: null, writeencoding: null
      }, this._readableState.needReadable = !0, this._readableState.sync = !1, e && ("function" == typeof e.transform && (this._transform = e.transform), "function" == typeof e.flush && (this._flush = e.flush)), this.on("prefinish", a)
    }

    function a() {
      var r = this;
      "function" == typeof this._flush ? this._flush(function (e, t) {
        s(r, e, t)
      }) : s(this, null, null)
    }

    function s(e, t, r) {
      if (t) return e.emit("error", t);
      if (null != r && e.push(r), e._writableState.length) throw new Error("Calling transform done when ws.length != 0");
      if (e._transformState.transforming) throw new Error("Calling transform done when still transforming");
      return e.push(null)
    }

    n.inherits = e("inherits"), n.inherits(o, i), o.prototype.push = function (e, t) {
      return this._transformState.needTransform = !1, i.prototype.push.call(this, e, t)
    }, o.prototype._transform = function (e, t, r) {
      throw new Error("_transform() is not implemented")
    }, o.prototype._write = function (e, t, r) {
      var i, n = this._transformState;
      n.writecb = r, n.writechunk = e, n.writeencoding = t, n.transforming || (i = this._readableState, (n.needTransform || i.needReadable || i.length < i.highWaterMark) && this._read(i.highWaterMark))
    }, o.prototype._read = function (e) {
      var t = this._transformState;
      null !== t.writechunk && t.writecb && !t.transforming ? (t.transforming = !0, this._transform(t.writechunk, t.writeencoding, t.afterTransform)) : t.needTransform = !0
    }, o.prototype._destroy = function (e, t) {
      var r = this;
      i.prototype._destroy.call(this, e, function (e) {
        t(e), r.emit("close")
      })
    }
  }, {"./_stream_duplex": 172, "core-util-is": 66, inherits: 142}],
  176: [function (E, x, e) {
    (function (e, t, r) {
      "use strict";
      var g = E("process-nextick-args");

      function h(e) {
        var t = this;
        this.next = null, this.entry = null, this.finish = function () {
          !function (e, t, r) {
            var i = e.entry;
            e.entry = null;
            for (; i;) {
              var n = i.callback;
              t.pendingcb--, n(r), i = i.next
            }
            t.corkedRequestsFree ? t.corkedRequestsFree.next = e : t.corkedRequestsFree = e
          }(t, e)
        }
      }

      x.exports = d;
      var s, l = !e.browser && -1 < ["v0.10", "v0.9."].indexOf(e.version.slice(0, 5)) ? r : g.nextTick;
      d.WritableState = c;
      var i = Object.create(E("core-util-is"));
      i.inherits = E("inherits");
      var n = {deprecate: E("util-deprecate")}, o = E("./internal/streams/stream"), b = E("safe-buffer").Buffer,
          v = t.Uint8Array || function () {
          };
      var a, u = E("./internal/streams/destroy");

      function _() {
      }

      function c(e, t) {
        s = s || E("./_stream_duplex"), e = e || {};
        var r = t instanceof s;
        this.objectMode = !!e.objectMode, r && (this.objectMode = this.objectMode || !!e.writableObjectMode);
        var i = e.highWaterMark, n = e.writableHighWaterMark, o = this.objectMode ? 16 : 16384;
        this.highWaterMark = i || 0 === i ? i : r && (n || 0 === n) ? n : o, this.highWaterMark = Math.floor(this.highWaterMark), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1;
        var a = (this.destroyed = !1) === e.decodeStrings;
        this.decodeStrings = !a, this.defaultEncoding = e.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function (e) {
          !function (e, t) {
            var r = e._writableState, i = r.sync, n = r.writecb;
            {
              var o;
              (function (e) {
                e.writing = !1, e.writecb = null, e.length -= e.writelen, e.writelen = 0
              })(r), t ? function (e, t, r, i, n) {
                --t.pendingcb, r ? (g.nextTick(n, i), g.nextTick(S, e, t), e._writableState.errorEmitted = !0, e.emit("error", i)) : (n(i), e._writableState.errorEmitted = !0, e.emit("error", i), S(e, t))
              }(e, r, i, t, n) : ((o = y(r)) || r.corked || r.bufferProcessing || !r.bufferedRequest || p(e, r), i ? l(f, e, r, o, n) : f(e, r, o, n))
            }
          }(t, e)
        }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.bufferedRequestCount = 0, this.corkedRequestsFree = new h(this)
      }

      function d(e) {
        if (s = s || E("./_stream_duplex"), !(a.call(d, this) || this instanceof s)) return new d(e);
        this._writableState = new c(e, this), this.writable = !0, e && ("function" == typeof e.write && (this._write = e.write), "function" == typeof e.writev && (this._writev = e.writev), "function" == typeof e.destroy && (this._destroy = e.destroy), "function" == typeof e["final"] && (this._final = e["final"])), o.call(this)
      }

      function w(e, t, r, i, n, o, a) {
        t.writelen = i, t.writecb = a, t.writing = !0, t.sync = !0, r ? e._writev(n, t.onwrite) : e._write(n, o, t.onwrite), t.sync = !1
      }

      function f(e, t, r, i) {
        var n, o;
        r || (n = e, 0 === (o = t).length && o.needDrain && (o.needDrain = !1, n.emit("drain"))), t.pendingcb--, i(), S(e, t)
      }

      function p(e, t) {
        t.bufferProcessing = !0;
        var r = t.bufferedRequest;
        if (e._writev && r && r.next) {
          var i = t.bufferedRequestCount, n = new Array(i), o = t.corkedRequestsFree;
          o.entry = r;
          for (var a = 0, s = !0; r;) (n[a] = r).isBuf || (s = !1), r = r.next, a += 1;
          n.allBuffers = s, w(e, t, !0, t.length, n, "", o.finish), t.pendingcb++, t.lastBufferedRequest = null, o.next ? (t.corkedRequestsFree = o.next, o.next = null) : t.corkedRequestsFree = new h(t), t.bufferedRequestCount = 0
        } else {
          for (; r;) {
            var l = r.chunk, u = r.encoding, c = r.callback;
            if (w(e, t, !1, t.objectMode ? 1 : l.length, l, u, c), r = r.next, t.bufferedRequestCount--, t.writing) break
          }
          null === r && (t.lastBufferedRequest = null)
        }
        t.bufferedRequest = r, t.bufferProcessing = !1
      }

      function y(e) {
        return e.ending && 0 === e.length && null === e.bufferedRequest && !e.finished && !e.writing
      }

      function m(t, r) {
        t._final(function (e) {
          r.pendingcb--, e && t.emit("error", e), r.prefinished = !0, t.emit("prefinish"), S(t, r)
        })
      }

      function S(e, t) {
        var r, i, n = y(t);
        return n && (r = e, (i = t).prefinished || i.finalCalled || ("function" == typeof r._final ? (i.pendingcb++, i.finalCalled = !0, g.nextTick(m, r, i)) : (i.prefinished = !0, r.emit("prefinish"))), 0 === t.pendingcb && (t.finished = !0, e.emit("finish"))), n
      }

      i.inherits(d, o), c.prototype.getBuffer = function () {
        for (var e = this.bufferedRequest, t = []; e;) t.push(e), e = e.next;
        return t
      }, function () {
        try {
          Object.defineProperty(c.prototype, "buffer", {
            get: n.deprecate(function () {
              return this.getBuffer()
            }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
          })
        } catch (e) {
        }
      }(), "function" == typeof Symbol && Symbol.hasInstance && "function" == typeof Function.prototype[Symbol.hasInstance] ? (a = Function.prototype[Symbol.hasInstance], Object.defineProperty(d, Symbol.hasInstance, {
        value: function (e) {
          return !!a.call(this, e) || this === d && (e && e._writableState instanceof c)
        }
      })) : a = function (e) {
        return e instanceof this
      }, d.prototype.pipe = function () {
        this.emit("error", new Error("Cannot pipe, not readable"))
      }, d.prototype.write = function (e, t, r) {
        var i, n, o, a, s, l, u, c, h, d, f, p = this._writableState, y = !1,
            m = !p.objectMode && (i = e, b.isBuffer(i) || i instanceof v);
        return m && !b.isBuffer(e) && (n = e, e = b.from(n)), "function" == typeof t && (r = t, t = null), t = m ? "buffer" : t || p.defaultEncoding, "function" != typeof r && (r = _), p.ended ? (h = this, d = r, f = new Error("write after end"), h.emit("error", f), g.nextTick(d, f)) : (m || (o = this, a = p, l = r, c = !(u = !0), null === (s = e) ? c = new TypeError("May not write null values to stream") : "string" == typeof s || void 0 === s || a.objectMode || (c = new TypeError("Invalid non-string/buffer chunk")), c && (o.emit("error", c), g.nextTick(l, c), u = !1), u)) && (p.pendingcb++, y = function (e, t, r, i, n, o) {
          {
            var a;
            r || (a = function (e, t, r) {
              e.objectMode || !1 === e.decodeStrings || "string" != typeof t || (t = b.from(t, r));
              return t
            }(t, i, n), i !== a && (r = !0, n = "buffer", i = a))
          }
          var s = t.objectMode ? 1 : i.length;
          t.length += s;
          var l = t.length < t.highWaterMark;
          l || (t.needDrain = !0);
          {
            var u;
            t.writing || t.corked ? (u = t.lastBufferedRequest, t.lastBufferedRequest = {
              chunk: i,
              encoding: n,
              isBuf: r,
              callback: o,
              next: null
            }, u ? u.next = t.lastBufferedRequest : t.bufferedRequest = t.lastBufferedRequest, t.bufferedRequestCount += 1) : w(e, t, !1, s, i, n, o)
          }
          return l
        }(this, p, m, e, t, r)), y
      }, d.prototype.cork = function () {
        this._writableState.corked++
      }, d.prototype.uncork = function () {
        var e = this._writableState;
        e.corked && (e.corked--, e.writing || e.corked || e.finished || e.bufferProcessing || !e.bufferedRequest || p(this, e))
      }, d.prototype.setDefaultEncoding = function (e) {
        if ("string" == typeof e && (e = e.toLowerCase()), !(-1 < ["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((e + "").toLowerCase()))) throw new TypeError("Unknown encoding: " + e);
        return this._writableState.defaultEncoding = e, this
      }, Object.defineProperty(d.prototype, "writableHighWaterMark", {
        enumerable: !1, get: function () {
          return this._writableState.highWaterMark
        }
      }), d.prototype._write = function (e, t, r) {
        r(new Error("_write() is not implemented"))
      }, d.prototype._writev = null, d.prototype.end = function (e, t, r) {
        var i = this._writableState;
        "function" == typeof e ? (r = e, t = e = null) : "function" == typeof t && (r = t, t = null), null != e && this.write(e, t), i.corked && (i.corked = 1, this.uncork()), i.ending || i.finished || function (e, t, r) {
          t.ending = !0, S(e, t), r && (t.finished ? g.nextTick(r) : e.once("finish", r));
          t.ended = !0, e.writable = !1
        }(this, i, r)
      }, Object.defineProperty(d.prototype, "destroyed", {
        get: function () {
          return void 0 !== this._writableState && this._writableState.destroyed
        }, set: function (e) {
          this._writableState && (this._writableState.destroyed = e)
        }
      }), d.prototype.destroy = u.destroy, d.prototype._undestroy = u.undestroy, d.prototype._destroy = function (e, t) {
        this.end(), t(e)
      }
    }).call(this, E("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, E("timers").setImmediate)
  }, {
    "./_stream_duplex": 172,
    "./internal/streams/destroy": 178,
    "./internal/streams/stream": 179,
    _process: 161,
    "core-util-is": 66,
    inherits: 142,
    "process-nextick-args": 160,
    "safe-buffer": 186,
    timers: 198,
    "util-deprecate": 199
  }],
  177: [function (e, t, r) {
    "use strict";
    var s = e("safe-buffer").Buffer, i = e("util");

    function n() {
      !function (e, t) {
        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
      }(this, n), this.head = null, this.tail = null, this.length = 0
    }

    t.exports = (n.prototype.push = function (e) {
      var t = {data: e, next: null};
      0 < this.length ? this.tail.next = t : this.head = t, this.tail = t, ++this.length
    }, n.prototype.unshift = function (e) {
      var t = {data: e, next: this.head};
      0 === this.length && (this.tail = t), this.head = t, ++this.length
    }, n.prototype.shift = function () {
      if (0 !== this.length) {
        var e = this.head.data;
        return 1 === this.length ? this.head = this.tail = null : this.head = this.head.next, --this.length, e
      }
    }, n.prototype.clear = function () {
      this.head = this.tail = null, this.length = 0
    }, n.prototype.join = function (e) {
      if (0 === this.length) return "";
      for (var t = this.head, r = "" + t.data; t = t.next;) r += e + t.data;
      return r
    }, n.prototype.concat = function (e) {
      if (0 === this.length) return s.alloc(0);
      if (1 === this.length) return this.head.data;
      for (var t, r, i, n = s.allocUnsafe(e >>> 0), o = this.head, a = 0; o;) t = o.data, r = n, i = a, t.copy(r, i), a += o.data.length, o = o.next;
      return n
    }, n), i && i.inspect && i.inspect.custom && (t.exports.prototype[i.inspect.custom] = function () {
      var e = i.inspect({length: this.length});
      return this.constructor.name + " " + e
    })
  }, {"safe-buffer": 186, util: 19}],
  178: [function (e, t, r) {
    "use strict";
    var o = e("process-nextick-args");

    function a(e, t) {
      e.emit("error", t)
    }

    t.exports = {
      destroy: function (e, t) {
        var r = this, i = this._readableState && this._readableState.destroyed,
            n = this._writableState && this._writableState.destroyed;
        return i || n ? t ? t(e) : !e || this._writableState && this._writableState.errorEmitted || o.nextTick(a, this, e) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(e || null, function (e) {
          !t && e ? (o.nextTick(a, r, e), r._writableState && (r._writableState.errorEmitted = !0)) : t && t(e)
        })), this
      }, undestroy: function () {
        this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1)
      }
    }
  }, {"process-nextick-args": 160}],
  179: [function (e, t, r) {
    arguments[4][61][0].apply(r, arguments)
  }, {dup: 61, events: 108}],
  180: [function (e, t, r) {
    "use strict";
    var i = e("safe-buffer").Buffer, n = i.isEncoding || function (e) {
      switch ((e = "" + e) && e.toLowerCase()) {
        case"hex":
        case"utf8":
        case"utf-8":
        case"ascii":
        case"binary":
        case"base64":
        case"ucs2":
        case"ucs-2":
        case"utf16le":
        case"utf-16le":
        case"raw":
          return !0;
        default:
          return !1
      }
    };

    function o(e) {
      var t = function (e) {
        if (!e) return "utf8";
        for (var t; ;) switch (e) {
          case"utf8":
          case"utf-8":
            return "utf8";
          case"ucs2":
          case"ucs-2":
          case"utf16le":
          case"utf-16le":
            return "utf16le";
          case"latin1":
          case"binary":
            return "latin1";
          case"base64":
          case"ascii":
          case"hex":
            return e;
          default:
            if (t) return;
            e = ("" + e).toLowerCase(), t = !0
        }
      }(e);
      if ("string" != typeof t && (i.isEncoding === n || !n(e))) throw new Error("Unknown encoding: " + e);
      return t || e
    }

    function a(e) {
      var t;
      switch (this.encoding = o(e), this.encoding) {
        case"utf16le":
          this.text = u, this.end = c, t = 4;
          break;
        case"utf8":
          this.fillLast = l, t = 4;
          break;
        case"base64":
          this.text = h, this.end = d, t = 3;
          break;
        default:
          return this.write = f, void (this.end = p)
      }
      this.lastNeed = 0, this.lastTotal = 0, this.lastChar = i.allocUnsafe(t)
    }

    function s(e) {
      return e <= 127 ? 0 : e >> 5 == 6 ? 2 : e >> 4 == 14 ? 3 : e >> 3 == 30 ? 4 : e >> 6 == 2 ? -1 : -2
    }

    function l(e) {
      var t = this.lastTotal - this.lastNeed, r = function (e, t) {
        if (128 != (192 & t[0])) return e.lastNeed = 0, "\ufffd";
        if (1 < e.lastNeed && 1 < t.length) {
          if (128 != (192 & t[1])) return e.lastNeed = 1, "\ufffd";
          if (2 < e.lastNeed && 2 < t.length && 128 != (192 & t[2])) return e.lastNeed = 2, "\ufffd"
        }
      }(this, e);
      return void 0 !== r ? r : this.lastNeed <= e.length ? (e.copy(this.lastChar, t, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal)) : (e.copy(this.lastChar, t, 0, e.length), void (this.lastNeed -= e.length))
    }

    function u(e, t) {
      if ((e.length - t) % 2 != 0) return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = e[e.length - 1], e.toString("utf16le", t, e.length - 1);
      var r = e.toString("utf16le", t);
      if (r) {
        var i = r.charCodeAt(r.length - 1);
        if (55296 <= i && i <= 56319) return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1], r.slice(0, -1)
      }
      return r
    }

    function c(e) {
      var t = e && e.length ? this.write(e) : "";
      if (this.lastNeed) {
        var r = this.lastTotal - this.lastNeed;
        return t + this.lastChar.toString("utf16le", 0, r)
      }
      return t
    }

    function h(e, t) {
      var r = (e.length - t) % 3;
      return 0 == r ? e.toString("base64", t) : (this.lastNeed = 3 - r, this.lastTotal = 3, 1 == r ? this.lastChar[0] = e[e.length - 1] : (this.lastChar[0] = e[e.length - 2], this.lastChar[1] = e[e.length - 1]), e.toString("base64", t, e.length - r))
    }

    function d(e) {
      var t = e && e.length ? this.write(e) : "";
      return this.lastNeed ? t + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : t
    }

    function f(e) {
      return e.toString(this.encoding)
    }

    function p(e) {
      return e && e.length ? this.write(e) : ""
    }

    (r.StringDecoder = a).prototype.write = function (e) {
      if (0 === e.length) return "";
      var t, r;
      if (this.lastNeed) {
        if (void 0 === (t = this.fillLast(e))) return "";
        r = this.lastNeed, this.lastNeed = 0
      } else r = 0;
      return r < e.length ? t ? t + this.text(e, r) : this.text(e, r) : t || ""
    }, a.prototype.end = function (e) {
      var t = e && e.length ? this.write(e) : "";
      return this.lastNeed ? t + "\ufffd" : t
    }, a.prototype.text = function (e, t) {
      var r = function (e, t, r) {
        var i = t.length - 1;
        if (i < r) return 0;
        var n = s(t[i]);
        if (0 <= n) return 0 < n && (e.lastNeed = n - 1), n;
        if (--i < r || -2 === n) return 0;
        if (0 <= (n = s(t[i]))) return 0 < n && (e.lastNeed = n - 2), n;
        if (--i < r || -2 === n) return 0;
        if (0 <= (n = s(t[i]))) return 0 < n && (2 === n ? n = 0 : e.lastNeed = n - 3), n;
        return 0
      }(this, e, t);
      if (!this.lastNeed) return e.toString("utf8", t);
      this.lastTotal = r;
      var i = e.length - (r - this.lastNeed);
      return e.copy(this.lastChar, 0, i), e.toString("utf8", t, i)
    }, a.prototype.fillLast = function (e) {
      if (this.lastNeed <= e.length) return e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
      e.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, e.length), this.lastNeed -= e.length
    }
  }, {"safe-buffer": 186}],
  181: [function (e, t, r) {
    t.exports = e("./readable").PassThrough
  }, {"./readable": 182}],
  182: [function (e, t, r) {
    (((r = t.exports = e("./lib/_stream_readable.js")).Stream = r).Readable = r).Writable = e("./lib/_stream_writable.js"), r.Duplex = e("./lib/_stream_duplex.js"), r.Transform = e("./lib/_stream_transform.js"), r.PassThrough = e("./lib/_stream_passthrough.js")
  }, {
    "./lib/_stream_duplex.js": 172,
    "./lib/_stream_passthrough.js": 173,
    "./lib/_stream_readable.js": 174,
    "./lib/_stream_transform.js": 175,
    "./lib/_stream_writable.js": 176
  }],
  183: [function (e, t, r) {
    t.exports = e("./readable").Transform
  }, {"./readable": 182}],
  184: [function (e, t, r) {
    t.exports = e("./lib/_stream_writable.js")
  }, {"./lib/_stream_writable.js": 176}],
  185: [function (e, t, r) {
    "use strict";
    var i = e("buffer").Buffer, n = e("inherits"), o = e("hash-base"), m = new Array(16),
        g = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13],
        b = [5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11],
        v = [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6],
        _ = [8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11],
        w = [0, 1518500249, 1859775393, 2400959708, 2840853838],
        S = [1352829926, 1548603684, 1836072691, 2053994217, 0];

    function a() {
      o.call(this, 64), this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520
    }

    function E(e, t) {
      return e << t | e >>> 32 - t
    }

    function x(e, t, r, i, n, o, a, s) {
      return E(e + (t ^ r ^ i) + o + a | 0, s) + n | 0
    }

    function T(e, t, r, i, n, o, a, s) {
      return E(e + (t & r | ~t & i) + o + a | 0, s) + n | 0
    }

    function M(e, t, r, i, n, o, a, s) {
      return E(e + ((t | ~r) ^ i) + o + a | 0, s) + n | 0
    }

    function k(e, t, r, i, n, o, a, s) {
      return E(e + (t & i | r & ~i) + o + a | 0, s) + n | 0
    }

    function P(e, t, r, i, n, o, a, s) {
      return E(e + (t ^ (r | ~i)) + o + a | 0, s) + n | 0
    }

    n(a, o), a.prototype._update = function () {
      for (var e = m, t = 0; t < 16; ++t) e[t] = this._block.readInt32LE(4 * t);
      for (var r = 0 | this._a, i = 0 | this._b, n = 0 | this._c, o = 0 | this._d, a = 0 | this._e, s = 0 | this._a, l = 0 | this._b, u = 0 | this._c, c = 0 | this._d, h = 0 | this._e, d = 0; d < 80; d += 1) var f, p = d < 16 ? (f = x(r, i, n, o, a, e[g[d]], w[0], v[d]), P(s, l, u, c, h, e[b[d]], S[0], _[d])) : d < 32 ? (f = T(r, i, n, o, a, e[g[d]], w[1], v[d]), k(s, l, u, c, h, e[b[d]], S[1], _[d])) : d < 48 ? (f = M(r, i, n, o, a, e[g[d]], w[2], v[d]), M(s, l, u, c, h, e[b[d]], S[2], _[d])) : d < 64 ? (f = k(r, i, n, o, a, e[g[d]], w[3], v[d]), T(s, l, u, c, h, e[b[d]], S[3], _[d])) : (f = P(r, i, n, o, a, e[g[d]], w[4], v[d]), x(s, l, u, c, h, e[b[d]], S[4], _[d])), r = a, a = o, o = E(n, 10), n = i, i = f, s = h, h = c, c = E(u, 10), u = l, l = p;
      var y = this._b + n + c | 0;
      this._b = this._c + o + h | 0, this._c = this._d + a + s | 0, this._d = this._e + r + l | 0, this._e = this._a + i + u | 0, this._a = y
    }, a.prototype._digest = function () {
      this._block[this._blockOffset++] = 128, 56 < this._blockOffset && (this._block.fill(0, this._blockOffset, 64), this._update(), this._blockOffset = 0), this._block.fill(0, this._blockOffset, 56), this._block.writeUInt32LE(this._length[0], 56), this._block.writeUInt32LE(this._length[1], 60), this._update();
      var e = i.alloc ? i.alloc(20) : new i(20);
      return e.writeInt32LE(this._a, 0), e.writeInt32LE(this._b, 4), e.writeInt32LE(this._c, 8), e.writeInt32LE(this._d, 12), e.writeInt32LE(this._e, 16), e
    }, t.exports = a
  }, {buffer: 64, "hash-base": 111, inherits: 142}],
  186: [function (e, t, r) {
    var i = e("buffer"), n = i.Buffer;

    function o(e, t) {
      for (var r in e) t[r] = e[r]
    }

    function a(e, t, r) {
      return n(e, t, r)
    }

    n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow ? t.exports = i : (o(i, r), r.Buffer = a), o(n, a), a.from = function (e, t, r) {
      if ("number" == typeof e) throw new TypeError("Argument must not be a number");
      return n(e, t, r)
    }, a.alloc = function (e, t, r) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      var i = n(e);
      return void 0 !== t ? "string" == typeof r ? i.fill(t, r) : i.fill(t) : i.fill(0), i
    }, a.allocUnsafe = function (e) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      return n(e)
    }, a.allocUnsafeSlow = function (e) {
      if ("number" != typeof e) throw new TypeError("Argument must be a number");
      return i.SlowBuffer(e)
    }
  }, {buffer: 64}],
  187: [function (e, t, r) {
    var c = e("safe-buffer").Buffer;

    function i(e, t) {
      this._block = c.alloc(e), this._finalSize = t, this._blockSize = e, this._len = 0
    }

    i.prototype.update = function (e, t) {
      "string" == typeof e && (t = t || "utf8", e = c.from(e, t));
      for (var r = this._block, i = this._blockSize, n = e.length, o = this._len, a = 0; a < n;) {
        for (var s = o % i, l = Math.min(n - a, i - s), u = 0; u < l; u++) r[s + u] = e[a + u];
        a += l, (o += l) % i == 0 && this._update(r)
      }
      return this._len += n, this
    }, i.prototype.digest = function (e) {
      var t = this._len % this._blockSize;
      this._block[t] = 128, this._block.fill(0, 1 + t), t >= this._finalSize && (this._update(this._block), this._block.fill(0));
      var r, i, n = 8 * this._len;
      n <= 4294967295 ? this._block.writeUInt32BE(n, this._blockSize - 4) : (i = (n - (r = (4294967295 & n) >>> 0)) / 4294967296, this._block.writeUInt32BE(i, this._blockSize - 8), this._block.writeUInt32BE(r, this._blockSize - 4)), this._update(this._block);
      var o = this._hash();
      return e ? o.toString(e) : o
    }, i.prototype._update = function () {
      throw new Error("_update must be implemented by subclass")
    }, t.exports = i
  }, {"safe-buffer": 186}],
  188: [function (e, t, r) {
    (r = t.exports = function (e) {
      e = e.toLowerCase();
      var t = r[e];
      if (!t) throw new Error(e + " is not supported (we accept pull requests)");
      return new t
    }).sha = e("./sha"), r.sha1 = e("crypto-js/sha1"), r.sha224 = e("./sha224"), r.sha256 = e("./sha256"), r.sha384 = e("./sha384"), r.sha512 = e("./sha512")
  }, {"./sha": 189, "crypto-js/sha1": 190, "./sha224": 191, "./sha256": 192, "./sha384": 193, "./sha512": 194}],
  189: [function (e, t, r) {
    var i = e("inherits"), n = e("./hash"), o = e("safe-buffer").Buffer,
        g = [1518500249, 1859775393, -1894007588, -899497514], a = new Array(80);

    function s() {
      this.init(), this._w = a, n.call(this, 64, 56)
    }

    i(s, n), s.prototype.init = function () {
      return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this
    }, s.prototype._update = function (e) {
      for (var t = this._w, r = 0 | this._a, i = 0 | this._b, n = 0 | this._c, o = 0 | this._d, a = 0 | this._e, s = 0; s < 16; ++s) t[s] = e.readInt32BE(4 * s);
      for (; s < 80; ++s) t[s] = t[s - 3] ^ t[s - 8] ^ t[s - 14] ^ t[s - 16];
      for (var l, u, c, h, d, f, p = 0; p < 80; ++p) var y = ~~(p / 20), m = 0 | ((f = r) << 5 | f >>> 27) + (c = i, h = n, d = o, 0 === (u = y) ? c & h | ~c & d : 2 === u ? c & h | c & d | h & d : c ^ h ^ d) + a + t[p] + g[y], a = o, o = n, n = (l = i) << 30 | l >>> 2, i = r, r = m;
      this._a = r + this._a | 0, this._b = i + this._b | 0, this._c = n + this._c | 0, this._d = o + this._d | 0, this._e = a + this._e | 0
    }, s.prototype._hash = function () {
      var e = o.allocUnsafe(20);
      return e.writeInt32BE(0 | this._a, 0), e.writeInt32BE(0 | this._b, 4), e.writeInt32BE(0 | this._c, 8), e.writeInt32BE(0 | this._d, 12), e.writeInt32BE(0 | this._e, 16), e
    }, t.exports = s
  }, {"./hash": 187, inherits: 142, "safe-buffer": 186}],
  190: [function (e, t, r) {
    var i = e("inherits"), n = e("./hash"), o = e("safe-buffer").Buffer,
        b = [1518500249, 1859775393, -1894007588, -899497514], a = new Array(80);

    function s() {
      this.init(), this._w = a, n.call(this, 64, 56)
    }

    i(s, n), s.prototype.init = function () {
      return this._a = 1732584193, this._b = 4023233417, this._c = 2562383102, this._d = 271733878, this._e = 3285377520, this
    }, s.prototype._update = function (e) {
      for (var t, r = this._w, i = 0 | this._a, n = 0 | this._b, o = 0 | this._c, a = 0 | this._d, s = 0 | this._e, l = 0; l < 16; ++l) r[l] = e.readInt32BE(4 * l);
      for (; l < 80; ++l) r[l] = (t = r[l - 3] ^ r[l - 8] ^ r[l - 14] ^ r[l - 16]) << 1 | t >>> 31;
      for (var u, c, h, d, f, p, y = 0; y < 80; ++y) var m = ~~(y / 20), g = 0 | ((p = i) << 5 | p >>> 27) + (h = n, d = o, f = a, 0 === (c = m) ? h & d | ~h & f : 2 === c ? h & d | h & f | d & f : h ^ d ^ f) + s + r[y] + b[m], s = a, a = o, o = (u = n) << 30 | u >>> 2, n = i, i = g;
      this._a = i + this._a | 0, this._b = n + this._b | 0, this._c = o + this._c | 0, this._d = a + this._d | 0, this._e = s + this._e | 0
    }, s.prototype._hash = function () {
      var e = o.allocUnsafe(20);
      return e.writeInt32BE(0 | this._a, 0), e.writeInt32BE(0 | this._b, 4), e.writeInt32BE(0 | this._c, 8), e.writeInt32BE(0 | this._d, 12), e.writeInt32BE(0 | this._e, 16), e
    }, t.exports = s
  }, {"./hash": 187, inherits: 142, "safe-buffer": 186}],
  191: [function (e, t, r) {
    var i = e("inherits"), n = e("./sha256"), o = e("./hash"), a = e("safe-buffer").Buffer, s = new Array(64);

    function l() {
      this.init(), this._w = s, o.call(this, 64, 56)
    }

    i(l, n), l.prototype.init = function () {
      return this._a = 3238371032, this._b = 914150663, this._c = 812702999, this._d = 4144912697, this._e = 4290775857, this._f = 1750603025, this._g = 1694076839, this._h = 3204075428, this
    }, l.prototype._hash = function () {
      var e = a.allocUnsafe(28);
      return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), e.writeInt32BE(this._g, 24), e
    }, t.exports = l
  }, {"./hash": 187, "./sha256": 192, inherits: 142, "safe-buffer": 186}],
  192: [function (e, t, r) {
    var i = e("inherits"), n = e("./hash"), o = e("safe-buffer").Buffer,
        w = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298],
        a = new Array(64);

    function s() {
      this.init(), this._w = a, n.call(this, 64, 56)
    }

    i(s, n), s.prototype.init = function () {
      return this._a = 1779033703, this._b = 3144134277, this._c = 1013904242, this._d = 2773480762, this._e = 1359893119, this._f = 2600822924, this._g = 528734635, this._h = 1541459225, this
    }, s.prototype._update = function (e) {
      for (var t, r, i = this._w, n = 0 | this._a, o = 0 | this._b, a = 0 | this._c, s = 0 | this._d, l = 0 | this._e, u = 0 | this._f, c = 0 | this._g, h = 0 | this._h, d = 0; d < 16; ++d) i[d] = e.readInt32BE(4 * d);
      for (; d < 64; ++d) i[d] = 0 | (((r = i[d - 2]) >>> 17 | r << 15) ^ (r >>> 19 | r << 13) ^ r >>> 10) + i[d - 7] + (((t = i[d - 15]) >>> 7 | t << 25) ^ (t >>> 18 | t << 14) ^ t >>> 3) + i[d - 16];
      for (var f, p, y, m, g, b = 0; b < 64; ++b) var v = h + (((g = l) >>> 6 | g << 26) ^ (g >>> 11 | g << 21) ^ (g >>> 25 | g << 7)) + ((m = c) ^ l & (u ^ m)) + w[b] + i[b] | 0, _ = 0 | (((y = n) >>> 2 | y << 30) ^ (y >>> 13 | y << 19) ^ (y >>> 22 | y << 10)) + ((f = n) & (p = o) | a & (f | p)), h = c, c = u, u = l, l = s + v | 0, s = a, a = o, o = n, n = v + _ | 0;
      this._a = n + this._a | 0, this._b = o + this._b | 0, this._c = a + this._c | 0, this._d = s + this._d | 0, this._e = l + this._e | 0, this._f = u + this._f | 0, this._g = c + this._g | 0, this._h = h + this._h | 0
    }, s.prototype._hash = function () {
      var e = o.allocUnsafe(32);
      return e.writeInt32BE(this._a, 0), e.writeInt32BE(this._b, 4), e.writeInt32BE(this._c, 8), e.writeInt32BE(this._d, 12), e.writeInt32BE(this._e, 16), e.writeInt32BE(this._f, 20), e.writeInt32BE(this._g, 24), e.writeInt32BE(this._h, 28), e
    }, t.exports = s
  }, {"./hash": 187, inherits: 142, "safe-buffer": 186}],
  193: [function (e, t, r) {
    var i = e("inherits"), n = e("./sha512"), o = e("./hash"), a = e("safe-buffer").Buffer, s = new Array(160);

    function l() {
      this.init(), this._w = s, o.call(this, 128, 112)
    }

    i(l, n), l.prototype.init = function () {
      return this._ah = 3418070365, this._bh = 1654270250, this._ch = 2438529370, this._dh = 355462360, this._eh = 1731405415, this._fh = 2394180231, this._gh = 3675008525, this._hh = 1203062813, this._al = 3238371032, this._bl = 914150663, this._cl = 812702999, this._dl = 4144912697, this._el = 4290775857, this._fl = 1750603025, this._gl = 1694076839, this._hl = 3204075428, this
    }, l.prototype._hash = function () {
      var i = a.allocUnsafe(48);

      function e(e, t, r) {
        i.writeInt32BE(e, r), i.writeInt32BE(t, r + 4)
      }

      return e(this._ah, this._al, 0), e(this._bh, this._bl, 8), e(this._ch, this._cl, 16), e(this._dh, this._dl, 24), e(this._eh, this._el, 32), e(this._fh, this._fl, 40), i
    }, t.exports = l
  }, {"./hash": 187, "./sha512": 194, inherits: 142, "safe-buffer": 186}],
  194: [function (e, t, r) {
    var i = e("inherits"), n = e("./hash"), o = e("safe-buffer").Buffer,
        $ = [1116352408, 3609767458, 1899447441, 602891725, 3049323471, 3964484399, 3921009573, 2173295548, 961987163, 4081628472, 1508970993, 3053834265, 2453635748, 2937671579, 2870763221, 3664609560, 3624381080, 2734883394, 310598401, 1164996542, 607225278, 1323610764, 1426881987, 3590304994, 1925078388, 4068182383, 2162078206, 991336113, 2614888103, 633803317, 3248222580, 3479774868, 3835390401, 2666613458, 4022224774, 944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983, 1495990901, 1249150122, 1856431235, 1555081692, 3175218132, 1996064986, 2198950837, 2554220882, 3999719339, 2821834349, 766784016, 2952996808, 2566594879, 3210313671, 3203337956, 3336571891, 1034457026, 3584528711, 2466948901, 113926993, 3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912, 1546045734, 1294757372, 1522805485, 1396182291, 2643833823, 1695183700, 2343527390, 1986661051, 1014477480, 2177026350, 1206759142, 2456956037, 344077627, 2730485921, 1290863460, 2820302411, 3158454273, 3259730800, 3505952657, 3345764771, 106217008, 3516065817, 3606008344, 3600352804, 1432725776, 4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752, 506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280, 958139571, 3318307427, 1322822218, 3812723403, 1537002063, 2003034995, 1747873779, 3602036899, 1955562222, 1575990012, 2024104815, 1125592928, 2227730452, 2716904306, 2361852424, 442776044, 2428436474, 593698344, 2756734187, 3733110249, 3204031479, 2999351573, 3329325298, 3815920427, 3391569614, 3928383900, 3515267271, 566280711, 3940187606, 3454069534, 4118630271, 4000239992, 116418474, 1914138554, 174292421, 2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733, 587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580, 2618297676, 1288033470, 3409855158, 1501505948, 4234509866, 1607167915, 987167468, 1816402316, 1246189591],
        a = new Array(160);

    function s() {
      this.init(), this._w = a, n.call(this, 128, 112)
    }

    function ee(e, t, r) {
      return r ^ e & (t ^ r)
    }

    function te(e, t, r) {
      return e & t | r & (e | t)
    }

    function re(e, t) {
      return (e >>> 28 | t << 4) ^ (t >>> 2 | e << 30) ^ (t >>> 7 | e << 25)
    }

    function ie(e, t) {
      return (e >>> 14 | t << 18) ^ (e >>> 18 | t << 14) ^ (t >>> 9 | e << 23)
    }

    function ne(e, t) {
      return e >>> 0 < t >>> 0 ? 1 : 0
    }

    i(s, n), s.prototype.init = function () {
      return this._ah = 1779033703, this._bh = 3144134277, this._ch = 1013904242, this._dh = 2773480762, this._eh = 1359893119, this._fh = 2600822924, this._gh = 528734635, this._hh = 1541459225, this._al = 4089235720, this._bl = 2227873595, this._cl = 4271175723, this._dl = 1595750129, this._el = 2917565137, this._fl = 725511199, this._gl = 4215389547, this._hl = 327033209, this
    }, s.prototype._update = function (e) {
      for (var t, r, i, n, o, a, s, l, u = this._w, c = 0 | this._ah, h = 0 | this._bh, d = 0 | this._ch, f = 0 | this._dh, p = 0 | this._eh, y = 0 | this._fh, m = 0 | this._gh, g = 0 | this._hh, b = 0 | this._al, v = 0 | this._bl, _ = 0 | this._cl, w = 0 | this._dl, S = 0 | this._el, E = 0 | this._fl, x = 0 | this._gl, T = 0 | this._hl, M = 0; M < 32; M += 2) u[M] = e.readInt32BE(4 * M), u[M + 1] = e.readInt32BE(4 * M + 4);
      for (; M < 160; M += 2) {
        var k = u[M - 30], P = u[M - 30 + 1], C = ((s = k) >>> 1 | (l = P) << 31) ^ (s >>> 8 | l << 24) ^ s >>> 7,
            A = ((o = P) >>> 1 | (a = k) << 31) ^ (o >>> 8 | a << 24) ^ (o >>> 7 | a << 25), k = u[M - 4],
            P = u[M - 4 + 1], I = ((i = k) >>> 19 | (n = P) << 13) ^ (n >>> 29 | i << 3) ^ i >>> 6,
            R = ((t = P) >>> 19 | (r = k) << 13) ^ (r >>> 29 | t << 3) ^ (t >>> 6 | r << 26), L = u[M - 14],
            D = u[M - 14 + 1], B = u[M - 32], O = u[M - 32 + 1], U = A + D | 0, N = C + L + ne(U, A) | 0;
        N = (N = N + I + ne(U = U + R | 0, R) | 0) + B + ne(U = U + O | 0, O) | 0, u[M] = N, u[M + 1] = U
      }
      for (var H = 0; H < 160; H += 2) {
        N = u[H], U = u[H + 1];
        var j = te(c, h, d), F = te(b, v, _), q = re(c, b), V = re(b, c), z = ie(p, S), K = ie(S, p), W = $[H + 1],
            X = ee(p, y, m), G = ee(S, E, x), Y = T + K | 0, Q = g + z + ne(Y, T) | 0;
        Q = (Q = (Q = Q + X + ne(Y = Y + G | 0, G) | 0) + $[H] + ne(Y = Y + W | 0, W) | 0) + N + ne(Y = Y + U | 0, U) | 0;
        var J = V + F | 0, Z = q + j + ne(J, V) | 0, g = m, T = x, m = y, x = E, y = p, E = S,
            p = f + Q + ne(S = w + Y | 0, w) | 0, f = d, w = _, d = h, _ = v, h = c, v = b,
            c = Q + Z + ne(b = Y + J | 0, Y) | 0
      }
      this._al = this._al + b | 0, this._bl = this._bl + v | 0, this._cl = this._cl + _ | 0, this._dl = this._dl + w | 0, this._el = this._el + S | 0, this._fl = this._fl + E | 0, this._gl = this._gl + x | 0, this._hl = this._hl + T | 0, this._ah = this._ah + c + ne(this._al, b) | 0, this._bh = this._bh + h + ne(this._bl, v) | 0, this._ch = this._ch + d + ne(this._cl, _) | 0, this._dh = this._dh + f + ne(this._dl, w) | 0, this._eh = this._eh + p + ne(this._el, S) | 0, this._fh = this._fh + y + ne(this._fl, E) | 0, this._gh = this._gh + m + ne(this._gl, x) | 0, this._hh = this._hh + g + ne(this._hl, T) | 0
    }, s.prototype._hash = function () {
      var i = o.allocUnsafe(64);

      function e(e, t, r) {
        i.writeInt32BE(e, r), i.writeInt32BE(t, r + 4)
      }

      return e(this._ah, this._al, 0), e(this._bh, this._bl, 8), e(this._ch, this._cl, 16), e(this._dh, this._dl, 24), e(this._eh, this._el, 32), e(this._fh, this._fl, 40), e(this._gh, this._gl, 48), e(this._hh, this._hl, 56), i
    }, t.exports = s
  }, {"./hash": 187, inherits: 142, "safe-buffer": 186}],
  195: [function (e, t, r) {
    t.exports = i;
    var c = e("events").EventEmitter;

    function i() {
      c.call(this)
    }

    e("inherits")(i, c), i.Readable = e("readable-stream/readable.js"), i.Writable = e("readable-stream/writable.js"), i.Duplex = e("readable-stream/duplex.js"), i.Transform = e("readable-stream/transform.js"), i.PassThrough = e("readable-stream/passthrough.js"), (i.Stream = i).prototype.pipe = function (t, e) {
      var r = this;

      function i(e) {
        t.writable && !1 === t.write(e) && r.pause && r.pause()
      }

      function n() {
        r.readable && r.resume && r.resume()
      }

      r.on("data", i), t.on("drain", n), t._isStdio || e && !1 === e.end || (r.on("end", a), r.on("close", s));
      var o = !1;

      function a() {
        o || (o = !0, t.end())
      }

      function s() {
        o || (o = !0, "function" == typeof t.destroy && t.destroy())
      }

      function l(e) {
        if (u(), 0 === c.listenerCount(this, "error")) throw e
      }

      function u() {
        r.removeListener("data", i), t.removeListener("drain", n), r.removeListener("end", a), r.removeListener("close", s), r.removeListener("error", l), t.removeListener("error", l), r.removeListener("end", u), r.removeListener("close", u), t.removeListener("close", u)
      }

      return r.on("error", l), t.on("error", l), r.on("end", u), r.on("close", u), t.on("close", u), t.emit("pipe", r), t
    }
  }, {
    events: 108,
    inherits: 142,
    "readable-stream/duplex.js": 171,
    "readable-stream/passthrough.js": 181,
    "readable-stream/readable.js": 182,
    "readable-stream/transform.js": 183,
    "readable-stream/writable.js": 184
  }],
  196: [function (e, t, r) {
    arguments[4][180][0].apply(r, arguments)
  }, {dup: 180, "safe-buffer": 197}],
  197: [function (e, t, r) {
    arguments[4][127][0].apply(r, arguments)
  }, {buffer: 64, dup: 127}],
  198: [function (l, e, u) {
    (function (e, t) {
      var i = l("process/browser.js").nextTick, r = Function.prototype.apply, n = Array.prototype.slice, o = {}, a = 0;

      function s(e, t) {
        this._id = e, this._clearFn = t
      }

      u.setTimeout = function () {
        return new s(r.call(setTimeout, window, arguments), clearTimeout)
      }, u.setInterval = function () {
        return new s(r.call(setInterval, window, arguments), clearInterval)
      }, u.clearTimeout = u.clearInterval = function (e) {
        e.close()
      }, s.prototype.unref = s.prototype.ref = function () {
      }, s.prototype.close = function () {
        this._clearFn.call(window, this._id)
      }, u.enroll = function (e, t) {
        clearTimeout(e._idleTimeoutId), e._idleTimeout = t
      }, u.unenroll = function (e) {
        clearTimeout(e._idleTimeoutId), e._idleTimeout = -1
      }, u._unrefActive = u.active = function (e) {
        clearTimeout(e._idleTimeoutId);
        var t = e._idleTimeout;
        0 <= t && (e._idleTimeoutId = setTimeout(function () {
          e._onTimeout && e._onTimeout()
        }, t))
      }, u.setImmediate = "function" == typeof e ? e : function (e) {
        var t = a++, r = !(arguments.length < 2) && n.call(arguments, 1);
        return o[t] = !0, i(function () {
          o[t] && (r ? e.apply(null, r) : e.call(null), u.clearImmediate(t))
        }), t
      }, u.clearImmediate = "function" == typeof t ? t : function (e) {
        delete o[e]
      }
    }).call(this, l("timers").setImmediate, l("timers").clearImmediate)
  }, {"process/browser.js": 161, timers: 198}],
  199: [function (e, t, r) {
    (function (r) {
      function i(e) {
        try {
          if (!r.localStorage) return
        } catch (e) {
          return
        }
        var t = r.localStorage[e];
        return null != t && "true" === String(t).toLowerCase()
      }

      t.exports = function (e, t) {
        if (i("noDeprecation")) return e;
        var r = !1;
        return function () {
          if (!r) {
            if (i("throwDeprecation")) throw new Error(t);
            i("traceDeprecation") ? console.trace(t) : console.warn(t), r = !0
          }
          return e.apply(this, arguments)
        }
      }
    }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
  }, {}],
  200: [function (require, module, exports) {
    var indexOf = function (e, t) {
          if (e.indexOf) return e.indexOf(t);
          for (var r = 0; r < e.length; r++) if (e[r] === t) return r;
          return -1
        }, Object_keys = function (e) {
          if (Object.keys) return Object.keys(e);
          var t = [];
          for (var r in e) t.push(r);
          return t
        }, forEach = function (e, t) {
          if (e.forEach) return e.forEach(t);
          for (var r = 0; r < e.length; r++) t(e[r], r, e)
        }, defineProp = function () {
          try {
            return Object.defineProperty({}, "_", {}), function (e, t, r) {
              Object.defineProperty(e, t, {writable: !0, enumerable: !1, configurable: !0, value: r})
            }
          } catch (e) {
            return function (e, t, r) {
              e[t] = r
            }
          }
        }(),
        globals = ["Array", "Boolean", "Date", "Error", "EvalError", "Function", "Infinity", "JSON", "Math", "NaN", "Number", "Object", "RangeError", "ReferenceError", "RegExp", "String", "SyntaxError", "TypeError", "URIError", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "undefined", "unescape"];

    function Context() {
    }

    Context.prototype = {};
    var Script = exports.Script = function (e) {
      if (!(this instanceof Script)) return new Script(e);
      this.code = e
    };
    Script.prototype.runInContext = function (t) {
      if (!(t instanceof Context)) throw new TypeError("needs a 'context' argument.");
      var e = document.createElement("iframe");
      e.style || (e.style = {}), e.style.display = "none", document.body.appendChild(e);
      var r = e.contentWindow, i = r.eval, n = r.execScript;
      !i && n && (n.call(r, "null"), i = r.eval), forEach(Object_keys(t), function (e) {
        r[e] = t[e]
      }), forEach(globals, function (e) {
        t[e] && (r[e] = t[e])
      });
      var o = Object_keys(r), a = i.call(r, this.code);
      return forEach(Object_keys(r), function (e) {
        (e in t || -1 === indexOf(o, e)) && (t[e] = r[e])
      }), forEach(globals, function (e) {
        e in t || defineProp(t, e, r[e])
      }), document.body.removeChild(e), a
    }, Script.prototype.runInThisContext = function () {
      return eval(this.code)
    }, Script.prototype.runInNewContext = function (t) {
      var r = Script.createContext(t), e = this.runInContext(r);
      return t && forEach(Object_keys(r), function (e) {
        t[e] = r[e]
      }), e
    }, forEach(Object_keys(Script.prototype), function (r) {
      exports[r] = Script[r] = function (e) {
        var t = Script(e);
        return t[r].apply(t, [].slice.call(arguments, 1))
      }
    }), exports.isContext = function (e) {
      return e instanceof Context
    }, exports.createScript = function (e) {
      return exports.Script(e)
    }, exports.createContext = Script.createContext = function (t) {
      var r = new Context;
      return "object" == typeof t && forEach(Object_keys(t), function (e) {
        r[e] = t[e]
      }), r
    }
  }, {}],
  201: [function (e, t, r) {
    var i = e("../ui/component"), n = (e("../lib/util"), e("../lib/dom")), o = e("../lib/event"),
        a = (e("../lib/ua"), e("../lang/index")), s = e("../player/base/event/eventtype"), l = i.extend({
          init: function (e, t) {
            i.call(this, e, t), this.className = t.className ? t.className : "prism-auto-stream-selector", this.addClass(this.className)
          }, createEl: function () {
            var e = i.prototype.createEl.call(this, "div");
            return e.innerHTML = "<div><p class='tip-text'></p></div><div class='operators'><a class='prism-button prism-button-ok' type='button'>" + a.get("OK_Text") + "</a><a class='prism-button prism-button-cancel'  target='_blank'>" + a.get("Cancel_Text") + "</a></div>", e
          }, bindEvent: function () {
            var i = this;
            i._player.on(s.Private.AutoStreamShow, function (e) {
              var t, r = document.querySelector("#" + i.getId() + " .tip-text");
              !i._player._getLowerQualityLevel || (t = i._player._getLowerQualityLevel()) && (i._switchUrl = t, r.innerText = a.get("Auto_Stream_Tip_Text").replace("$$", t.item.desc), n.css(i.el(), "display", "block"))
            }), i._player.on(s.Private.AutoStreamHide, function (e) {
              document.querySelector("#" + i.getId() + " .tip-text");
              n.css(i.el(), "display", "none")
            });
            var e = document.querySelector("#" + i.getId() + " .prism-button-ok");
            o.on(e, "click", function () {
              i._player._changeStream && i._switchUrl && i._player._changeStream(i._switchUrl.index, a.get("Quality_Change_Text")), n.css(i.el(), "display", "none")
            });
            var t = document.querySelector("#" + i.getId() + " .prism-button-cancel");
            o.on(t, "click", function () {
              n.css(i.el(), "display", "none")
            })
          }
        });
    t.exports = l
  }, {
    "../lang/index": 210,
    "../lib/dom": 217,
    "../lib/event": 218,
    "../lib/ua": 230,
    "../lib/util": 232,
    "../player/base/event/eventtype": 242,
    "../ui/component": 294
  }],
  202: [function (e, t, r) {
    var i = e("../ui/component"), s = e("../lib/dom"), n = e("../lib/event"), o = e("../lib/ua"),
        a = e("../lib/function"), l = (e("../lang/index"), e("../lib/util")), u = e("../config"),
        c = e("../lib/playerutil"), h = e("../player/base/event/eventtype"), d = i.extend({
          init: function (e, t) {
            i.call(this, e, t), this.className = t.className ? t.className : "prism-liveshift-progress", this.addClass(this.className), this._liveshiftService = e._liveshiftService
          }, createEl: function () {
            var e = i.prototype.createEl.call(this);
            return e.innerHTML = '<div class="prism-enable-liveshift"><div class="prism-progress-loaded"></div><div class="prism-progress-played"></div><div class="prism-progress-cursor"><img></img></div><p class="prism-progress-time"></p><div class="prism-liveshift-seperator">00:00:00</div></div><div class="prism-disable-liveshift"></div>', e
          }, bindEvent: function () {
            var r = this;
            this.loadedNode = document.querySelector("#" + this.id() + " .prism-progress-loaded"), this.playedNode = document.querySelector("#" + this.id() + " .prism-progress-played"), this.cursorNode = document.querySelector("#" + this.id() + " .prism-progress-cursor"), this.timeNode = document.querySelector("#" + this.id() + " .prism-progress-time"), this.controlNode = document.querySelector("#" + this._player._options.id + " .prism-controlbar"), this.seperatorNode = document.querySelector("#" + this.id() + " .prism-liveshift-seperator"), this.progressNode = document.querySelector("#" + this.id() + " .prism-enable-liveshift");
            var e = document.querySelector("#" + this.id() + " .prism-progress-cursor img"),
                t = "//" + u.domain + "/de/prismplayer/" + u.h5Version + "/skins/default/img/dragcursor.png";
            u.domain ? -1 < u.domain.indexOf("localhost") && (t = "//" + u.domain + "/build/skins/default/img/dragcursor.png") : t = this._player && this._player._options && this._player._options.sdkDomain ? this._player._options.sdkDomain + "/de/prismplayer/" + u.h5Version + "/skins/default/img/dragcursor.png" : "de/prismplayer/" + u.h5Version + "/skins/default/img/dragcursor.png", e.src = t, n.on(this.cursorNode, "mousedown", function (e) {
              r._onMouseDown(e)
            }), n.on(this.cursorNode, "touchstart", function (e) {
              r._onMouseDown(e)
            }), n.on(this.progressNode, "mousemove", function (e) {
              r._progressMove(e)
            }), n.on(this.progressNode, "touchmove", function (e) {
              r._progressMove(e)
            }), n.on(this._el, "click", function (e) {
              r._onMouseClick(e)
            }), this._player.on(h.Private.HideProgress, function (e) {
              r._hideProgress(e)
            }), this._player.on(h.Private.CancelHideProgress, function (e) {
              r._cancelHideProgress(e)
            }), this._player.on(h.Private.ShowBar, function () {
              r._updateLayout()
            }), n.on(this.progressNode, h.Private.MouseOver, function (e) {
              r._onMouseOver(e)
            }), n.on(this.progressNode, h.Private.MouseOut, function (e) {
              r._onMouseOut(e)
            }), this.bindTimeupdate = a.bind(this, this._onTimeupdate), this._player.on(h.Player.TimeUpdate, this.bindTimeupdate), c.isLiveShift(this._player._options) && this._player.on(h.Player.Play, function () {
              r._liveshiftService.start(6e4, function (e) {
                var t = {
                  mediaId: r._player._options.vid ? r._player._options.vid : "",
                  error_code: e.Code,
                  error_msg: e.Message
                };
                r._player.logError(t), r._player.trigger(h.Player.Error, t)
              })
            }), this._player.on(h.Private.LiveShiftQueryCompleted, function () {
              r._updateSeperator(), r._updateLayout()
            }), this._player.on(h.Player.Pause, function () {
              r._liveshiftService.stop()
            }), o.IS_IPAD ? this.interval = setInterval(function () {
              r._onProgress()
            }, 500) : this._player.on(h.Video.Progress, function () {
              r._onProgress()
            })
          }, _updateSeperator: function () {
            this._liveshiftService.currentTimeDisplay && (this.seperatorNode.innerText = this._liveshiftService.currentTimeDisplay)
          }, _updateLayout: function () {
            var e = this.seperatorNode.offsetWidth, t = this.el().offsetWidth, r = t - e;
            0 != e && 0 != r && (s.css(this.progressNode, "width", 100 * (r - 10) / t + "%"), s.css(this.seperatorNode, "right", -1 * (e + 10) + "px"))
          }, _progressMove: function (e) {
            var t = this._getSeconds(e), r = this._liveshiftService.availableLiveShiftTime;
            this.timeNode.innerText = "-" + l.formatTime(r - t);
            var i = r ? t / r : 0, n = 1 - this.timeNode.clientWidth / this.el().clientWidth;
            n < i && (i = n), this.timeNode && s.css(this.timeNode, "left", 100 * i + "%")
          }, _hideProgress: function (e) {
            n.off(this.cursorNode, "mousedown"), n.off(this.cursorNode, "touchstart")
          }, _cancelHideProgress: function (e) {
            var t = this;
            n.on(this.cursorNode, "mousedown", function (e) {
              t._onMouseDown(e)
            }), n.on(this.cursorNode, "touchstart", function (e) {
              t._onMouseDown(e)
            })
          }, _canSeekable: function (e) {
            var t = !0;
            return "function" == typeof this._player.canSeekable && (t = this._player.canSeekable(e)), t
          }, _onMouseOver: function (e) {
            this._updateCursorPosition(this._getCurrentTime()), s.css(this.timeNode, "display", "block")
          }, _onMouseOut: function (e) {
            s.css(this.timeNode, "display", "none")
          }, _getSeconds: function (e) {
            for (var t = this.el().offsetLeft, r = this.el(); r = r.offsetParent;) {
              var i = s.getTranslateX(r);
              t += r.offsetLeft + i
            }
            var n = (e.touches ? e.touches[0].pageX : e.pageX) - t, o = this.progressNode.offsetWidth,
                a = this._liveshiftService.availableLiveShiftTime;
            return sec = a ? n / o * a : 0, sec < 0 && (sec = 0), sec > a && (sec = a), sec
          }, _onMouseClick: function (e) {
            var t = this, r = this._getSeconds(e), i = this._liveshiftService.availableLiveShiftTime - r;
            this._player.trigger(h.Private.SeekStart, {fromTime: this._getCurrentTime()});
            var n = this._liveshiftService.getSourceUrl(i), o = t._player._options.source,
                a = c.isHls(t._player._options.source);
            a && n == o ? t._player.seek(r) : t._player._loadByUrlInner(n, r, !0), t._player.trigger(h.Private.Play_Btn_Hide), t._liveshiftService.seekTime = r, t._player.trigger(h.Private.EndStart, {toTime: r}), t._updateCursorPosition(r), a && setTimeout(function () {
              t._player.play()
            })
          }, _onMouseDown: function (e) {
            var t = this;
            e.preventDefault(), this._player.trigger(h.Private.SeekStart, {fromTime: this._getCurrentTime()}), n.on(this.controlNode, "mousemove", function (e) {
              t._onMouseMove(e)
            }), n.on(this.controlNode, "touchmove", function (e) {
              t._onMouseMove(e)
            }), n.on(this.controlNode, "mouseup", function (e) {
              t._onMouseUp(e)
            }), n.on(this.controlNode, "touchend", function (e) {
              t._onMouseUp(e)
            })
          }, _onMouseUp: function (e) {
            e.preventDefault(), n.off(this.controlNode, "mousemove"), n.off(this.controlNode, "touchmove"), n.off(this._player.tag, "mouseup"), n.off(this._player.tag, "touchend"), n.off(this.controlNode, "mouseup"), n.off(this.controlNode, "touchend");
            var t = this._liveshiftService.availableLiveShiftTime,
                r = this.playedNode.offsetWidth / this.el().offsetWidth * t;
            this._player.seek(r), this._player.trigger(h.Private.Play_Btn_Hide), this._liveshiftService.seekTime = r, this._player.trigger(h.Private.EndStart, {toTime: r})
          }, _onMouseMove: function (e) {
            e.preventDefault();
            var t = this._getSeconds(e);
            this._updateProgressBar(this.playedNode, t), this._updateCursorPosition(t)
          }, _onTimeupdate: function (e) {
            this._updateProgressBar(this.playedNode, this._getCurrentTime()), this._updateCursorPosition(this._getCurrentTime()), this._player.trigger(h.Private.UpdateProgressBar, {time: this._getCurrentTime()})
          }, _getCurrentTime: function () {
            var e = this._liveshiftService.seekTime;
            return -1 == e && (e = 0), this._player.getCurrentTime() + e
          }, _onProgress: function (e) {
            this._player.getDuration() && 1 <= this._player.getBuffered().length && this._updateProgressBar(this.loadedNode, this._player.getBuffered().end(this._player.getBuffered().length - 1))
          }, _updateProgressBar: function (e, t) {
            var r, i;
            1 != this._player._switchSourcing && (i = 0, -1 == this._liveshiftService.seekTime ? i = 1 : 1 < (i = (r = this._liveshiftService.availableLiveShiftTime) ? t / r : 0) && (i = 1, this._liveshiftService.seekTime = -1), this.liveShiftStartDisplay, e && s.css(e, "width", 100 * i + "%"))
          }, _updateCursorPosition: function (e) {
            var t, r, i, n, o;
            !this._player.el() || 1 == this._player._switchSourcing || 0 == e && 0 == this._player.tag.readyState || (i = 0, o = 1, t = this._player.el().clientWidth, -1 == this._liveshiftService.seekTime ? i = 1 : 1 < (i = (r = this._liveshiftService.availableLiveShiftTime) ? e / r : 0) && (this._liveshiftService.seekTime = -1), 0 != t && (o = 1 - (n = 18 / t), i -= n), this.cursorNode && (o < i ? (s.css(this.cursorNode, "right", "0px"), s.css(this.cursorNode, "left", "auto")) : (s.css(this.cursorNode, "right", "auto"), s.css(this.cursorNode, "left", 100 * i + "%"))))
          }
        });
    t.exports = d
  }, {
    "../config": 204,
    "../lang/index": 210,
    "../lib/dom": 217,
    "../lib/event": 218,
    "../lib/function": 219,
    "../lib/playerutil": 228,
    "../lib/ua": 230,
    "../lib/util": 232,
    "../player/base/event/eventtype": 242,
    "../ui/component": 294
  }],
  203: [function (e, t, r) {
    var i = e("../ui/component"), o = e("../lib/util"), a = e("../player/base/event/eventtype"), n = i.extend({
      init: function (e, t) {
        i.call(this, e, t), this.className = t.className ? t.className : "prism-live-time-display", this.addClass(this.className), this._liveshiftService = e._liveshiftService
      }, createEl: function () {
        var e = i.prototype.createEl.call(this, "div");
        return e.innerHTML = '<span class="current-time">00:00</span> <span class="time-bound">/</span> <span class="end-time">00:00</span><span class="live-text">Live: </span><span class="live-time"></span>', e
      }, bindEvent: function () {
        var n = this;
        this._player.on(a.Video.TimeUpdate, function () {
          var e, t, r = n._liveshiftService, i = document.querySelector("#" + n.id() + " .current-time");
          r.liveShiftStartDisplay && r.availableLiveShiftTime > r.seekTime && -1 != r.seekTime ? (e = n._liveshiftService.getBaseTime(), t = o.formatTime(e + n._player.getCurrentTime()), i.innerText = t) : r.currentTimeDisplay && (i.innerText = r.currentTimeDisplay)
        }), this._player.on(a.Private.LiveShiftQueryCompleted, function () {
          n.updateTime()
        })
      }, updateTime: function () {
        document.querySelector("#" + this.id() + " .end-time").innerText = this._liveshiftService.liveTimeRange.endDisplay, document.querySelector("#" + this.id() + " .live-time").innerText = this._liveshiftService.currentTimeDisplay
      }
    });
    t.exports = n
  }, {"../lib/util": 232, "../player/base/event/eventtype": 242, "../ui/component": 294}],
  204: [function (e, t, r) {
    t.exports = {
      domain: "g.alicdn.com",
      flashVersion: "2.8.2",
      h5Version: "2.9.3",
      rtsVersion: "1.2.4",
      cityBrain: !0,
      logDuration: 10,
      logCount: 100,
      logReportTo: "https://videocloud.cn-hangzhou.log.aliyuncs.com/logstores/newplayer/track"
    }
  }, {}],
  205: [function (e, t, r) {
    e("./lang/index").load();

    function i(e, t) {
      return n.create(e, t)
    }

    var n = e("./player/adaptivePlayer"), o = e("./lib/componentutil"), a = e("./config");
    i.getVersion = function () {
      return a.h5Version
    }, o.register(i);
    var s = window.Aliplayer = i;
    i.players = {}, "function" == typeof define && define.amd ? define([], function () {
      return s
    }) : "object" == typeof r && "object" == typeof t && (t.exports = s), "undefined" != typeof Uint8Array && (Uint8Array.prototype.slice || Object.defineProperty(Uint8Array.prototype, "slice", {value: Array.prototype.slice}))
  }, {"./config": 204, "./lang/index": 210, "./lib/componentutil": 213, "./player/adaptivePlayer": 239}],
  206: [function (e, t, r) {
    var i = e("../lib/oo"), n = e("../lang/index"), o = i.extend({
      init: function (e, t) {
        this._player = e, this._options = e.options()
      }
    });
    o.prototype.handle = function (e) {
      var t, r;
      this._options.autoPlayDelay && (t = (t = this._options.autoPlayDelayDisplayText) || n.get("AutoPlayDelayDisplayText").replace("$$", this._options.autoPlayDelay), this._player.trigger("info_show", t), this._player.trigger("h5_loading_hide"), this._player.trigger("play_btn_hide"), (r = this)._timeHandler = setTimeout(function () {
        r._player.trigger("info_hide"), r._options.autoPlayDelay = 0, e && e()
      }, 1e3 * this._options.autoPlayDelay), this._player.on("play", function () {
        a(r)
      }), this._player.on("pause", function () {
        a(r)
      }))
    }, o.prototype.dispose = function () {
      a(this), this._player = null
    };
    var a = function (e) {
      e._timeHandler && (clearTimeout(e._timeHandler), e._timeHandler = null)
    };
    t.exports = o
  }, {"../lang/index": 210, "../lib/oo": 226}],
  207: [function (e, t, r) {
    t.exports = t.exports = {
      OD: "OD",
      FD: "360p",
      LD: "540p",
      SD: "720p",
      HD: "1080p",
      "2K": "2K",
      "4K": "4K",
      FHD: "FHD",
      XLD: "XLD",
      SQ: "SQ",
      HQ: "HQ",
      Speed: "Speed",
      Speed_05X_Text: "0.5X",
      Speed_1X_Text: "Normal",
      Speed_125X_Text: "1.25X",
      Speed_15X_Text: "1.5X",
      Speed_2X_Text: "2X",
      Refresh_Text: "Refresh",
      Cancel: "Cancel",
      Mute: "Mute",
      Snapshot: "Snapshot",
      Detection_Text: "Diagnosis",
      Play_DateTime: "Time",
      Quality_Change_Fail_Switch_Text: "Cannot play, switch to ",
      Quality_Change_Text: "Switch to ",
      Quality_The_Url: "The url",
      AutoPlayDelayDisplayText: "Play in $$ seconds",
      Error_Load_Abort_Text: "Data abort erro",
      Error_Network_Text: "Loading failed due to network error",
      Error_Decode_Text: "Decode error",
      Error_Server_Network_NotSupport_Text: "Network error or \xa0the format of video is unsupported",
      Error_Offline_Text: "The network is unreachable, please click Refresh",
      Error_Play_Text: "Error occured while playing",
      Error_Retry_Text: " Please close or refresh",
      Error_AuthKey_Text: "Authentication expired or the domain is not in white list",
      Error_H5_Not_Support_Text: "The format of video is not supported by\xa0h5 player\uff0cplease use flash player",
      Error_Not_Support_M3U8_Text: "The format of m3u8 is not supported by this explorer",
      Error_Not_Support_MP4_Text: "The format of mp4\xa0is not supported by this explorer",
      Error_Not_Support_encrypt_Text: "Play the encrypted video,please set encryptType to 1",
      Error_Vod_URL_Is_Empty_Text: "The url is empty",
      Error_Vod_Fetch_Urls_Text: "Error occured when fetch urls\uff0cplease close or refresh",
      Fetch_Playauth_Error: "Error occured when fetch playauth close or refresh",
      Error_Playauth_Decode_Text: "PlayAuth parse failed",
      Error_Vid_Not_Same_Text: "Cannot renew url due to vid changed",
      Error_Playauth_Expired_Text: "Playauth expired, please close or refresh",
      Error_MTS_Fetch_Urls_Text: "Error occurred while requesting mst server",
      Error_Load_M3U8_Failed_Text: "The\xa0m3u8 file loaded failed",
      Error_Load_M3U8_Timeout_Text: "Timeout error occored\xa0when the\xa0m3u8 file loaded",
      Error_M3U8_Decode_Text: "The m3u8 file decoded failed",
      Error_TX_Decode_Text: "Video decoded failed",
      Error_Waiting_Timeout_Text: "Buffering timeout,\xa0please close or refresh",
      Error_Invalidate_Source: "Video shoud be mp4\u3001mp3\u3001m3u8\u3001mpd or flv",
      Error_Empty_Source: "Video URL shouldn't be empty",
      Error_Vid_Empty_Source: "vid's video URL hasn't been fetched",
      Error_Fetch_NotStream: "The vid has no stream to play",
      Error_Not_Found: "Url is not found",
      Live_End: "Live has finished",
      Play_Before_Fullscreen: "Please play before fullscreen",
      Can_Not_Seekable: "Can not seek to this position",
      Cancel_Text: "Cancel",
      OK_Text: "OK",
      Auto_Stream_Tip_Text: "Internet is slow, does switch to $$",
      Request_Block_Text: "This request is blocked, the video Url should be over https",
      Open_Html_By_File: "Html page should be on the server",
      Maybe_Cors_Error: "please make sure enable cors,<a href='https://help.aliyun.com/document_detail/62950.html?spm=a2c4g.11186623.2.21.Y3n2oi' target='_blank'>refer to document</a>",
      Speed_Switch_To: "Speed switch to ",
      Curent_Volume: "Current volume:",
      Volume_Mute: "set to mute",
      Volume_UnMute: "set to unmute",
      ShiftLiveTime_Error: "Live start time should not be greater than over time",
      Error_Not_Support_Format_On_Mobile: "flv\u3001rmtp can't be supported on mobile\uff0cplease use m3u8",
      SessionId_Ticket_Invalid: "please assign value for sessionId and ticket properties",
      Http_Error: " An HTTP network request failed with an error, but not from the server.",
      Http_Timeout: "A network request timed out",
      DRM_License_Expired: "DRM license is expired, please refresh",
      Not_Support_DRM: "Browser doesn't support DRM",
      CC_Switch_To: "Subtitle switch to ",
      AudioTrack_Switch_To: "Audio tracks switch to ",
      Subtitle: "Subtitle/CC",
      AudioTrack: "Audio Track",
      Quality: "Quality",
      Auto: "Auto",
      Quality_Switch_To: "Quality switch to ",
      Fullscreen: "Full Screen",
      Setting: "Settings",
      Volume: "Volume",
      Play: "Play",
      Pause: "Pause",
      CloseSubtitle: "Close CC",
      OpenSubtitle: "Open CC",
      ExistFullScreen: "Exit Full Screen",
      Muted: "Muted",
      Retry: "Retry",
      SwitchToLive: "Return to live",
      iOSNotSupportVodEncription: "iOS desn't suport Vod's encription video",
      UseChromeForVodEncription: "This browser desn't suport Vod's encription video, please use latest Chrome",
      Http_Request_Error: "http request error",
      ERROR_PLAY_FAILED: "play faild error",
      Browser_Not_Support: "browser not support",
      Not_Support_Webrtc: "not support webrtc",
      Browser_Version_Too_Low: "browser version too low",
      Not_Support_H264: "not support h264",
      Create_Offer_Error: "create offer error",
      Play_Url_Error: "play url error",
      Subscribe_Nonthing: "subscribe nonthing",
      Html_Element_Error: "html element error",
      Html_Element_Not_Match: "html element not match"
    }
  }, {}],
  208: [function (e, t, r) {
    t.exports = t.exports = {
      OD: "OD",
      LD: "360p",
      FD: "540p",
      SD: "720p",
      HD: "1080p",
      "2K": "2K",
      "4K": "4K",
      FHD: "FHD",
      XLD: "XLD",
      SQ: "SQ",
      HQ: "HQ",
      Forbidden_Text: "Internal information is strictly forbidden to outsider",
      Refresh: "Refresh",
      Diagnosis: "Diagnosis",
      Live_Finished: "Live has finished, thanks for watching",
      Play: "Play",
      Pause: "Pause",
      Snapshot: "Snapshot",
      Replay: "Replay",
      Live: "Live",
      Encrypt: "Encrypt",
      Sound: "Sound",
      Fullscreen: "Full Screen",
      Exist_Fullscreen: "Exit Full-screen",
      Resolution: "Resolution",
      Next: "Next Video",
      Brightness: "Brightness",
      Default: "Default",
      Contrast: "Contrast",
      Titles_Credits: "Titles\xa0and\xa0Credits",
      Skip_Titles: "Skip Titles",
      Skip_Credits: "Skip Credits",
      Not_Support_Out_Site: "The video is not supported for outside website, please watch it by TaoTV",
      Watch_Now: "Watch now",
      Network_Error: "Network is unreachable, please try to refresh",
      Video_Error: "Playing a video error,\xa0please try to refresh",
      Decode_Error: "Data decoding\xa0error",
      Live_Not_Start: "Live has not started, to be expected",
      Live_Loading: "Live information is loading,\xa0please try to refresh",
      Fetch_Playauth_Error: "Error occured when fetch playauth close or refresh",
      Live_End: "Live has finished",
      Live_Abrot: "Signal aborted,\xa0please try to refresh",
      Corss_Domain_Error: "Please ensure your domain has obtained IPC license and combined CNAME, \r\n or to set\xa0\xa0cross-domain accessing available",
      Url_Timeout_Error: "The video url is timeout,\xa0please try to refresh",
      Connetction_Error: "Sorry\uff0cthe video cannot play because of connection error, please try to watch other videos",
      Fetch_MTS_Error: "Fetching video list failed, please ensure",
      Token_Expired_Error: "Requesting open api failed, please ensure token expired or not",
      Video_Lists_Empty_Error: "The video list is empty, please check the format of video",
      Encrypted_Failed_Error: "Fetching encrypted file failed, please check the permission of player",
      Fetch_Failed_Permission_Error: "Fetching video list failed, please check the permission of player",
      Invalidate_Param_Error: "No video url, please check the parameters",
      AutoPlayDelayDisplayText: "Play in $$ seconds",
      Fetch_MTS_NOT_NotStream_Error: "The vid has no stream to play",
      Cancel_Text: "Cancel",
      OK_Text: "OK",
      Auto_Stream_Tip_Text: "Internet is slow, does switch to $$",
      Open_Html_By_File: "Html page should be on the server",
      Cant_Use_Flash_On_Mobile: "Mobile doesn't support flash player\uff0cplease use h5 player",
      Flash_Not_Ready: "Flash Player plugin hasn't been installed <a href='https://www.flash.cn/' target='_blank'>install plugin</a>, or check if disable Flash plugin"
    }
  }, {}],
  209: [function (e, t, r) {
    t.exports = t.exports = {
      OD: "\u539f\u753b",
      FD: "\u6d41\u7545",
      LD: "\u6807\u6e05",
      SD: "\u9ad8\u6e05",
      HD: "\u8d85\u6e05",
      "2K": "2K",
      "4K": "4K",
      FHD: "\u5168\u9ad8\u6e05",
      XLD: "\u6781\u901f",
      SQ: "\u666e\u901a\u97f3\u8d28",
      HQ: "\u9ad8\u97f3\u8d28",
      Forbidden_Text: "\u5185\u90e8\u4fe1\u606f\uff0c\u4e25\u7981\u5916\u4f20",
      Refresh: "\u5237\u65b0",
      Diagnosis: "\u8bca\u65ad",
      Live_Finished: "\u76f4\u64ad\u5df2\u7ed3\u675f,\u8c22\u8c22\u89c2\u770b",
      Play: "\u64ad\u653e",
      Pause: "\u6682\u505c",
      Snapshot: "\u622a\u56fe",
      Replay: "\u91cd\u64ad",
      Live: "\u76f4\u64ad",
      Encrypt: "\u52a0\u5bc6",
      Sound: "\u58f0\u97f3",
      Fullscreen: "\u5168\u5c4f",
      Exist_Fullscreen: "\u9000\u51fa\u5168\u5c4f",
      Resolution: "\u6e05\u6670\u5ea6",
      Next: "\u4e0b\u4e00\u96c6",
      Brightness: "\u4eae\u5ea6",
      Default: "\u9ed8\u8ba4",
      Contrast: "\u5bf9\u6bd4\u5ea6",
      Titles_Credits: "\u7247\u5934\u7247\u5c3e",
      Skip_Titles: "\u8df3\u8fc7\u7247\u5934",
      Skip_Credits: "\u8df3\u8fc7\u7247\u5c3e",
      Not_Support_Out_Site: "\u8be5\u89c6\u9891\u6682\u4e0d\u652f\u6301\u7ad9\u5916\u64ad\u653e\uff0c\u8bf7\u5230\u6dd8TV\u89c2\u770b",
      Watch_Now: "\u7acb\u5373\u89c2\u770b",
      Network_Error: "\u7f51\u7edc\u65e0\u6cd5\u8fde\u63a5\uff0c\u8bf7\u5c1d\u8bd5\u68c0\u67e5\u7f51\u7edc\u540e\u5237\u65b0\u8bd5\u8bd5",
      Video_Error: "\u89c6\u9891\u64ad\u653e\u5f02\u5e38\uff0c\u8bf7\u5237\u65b0\u8bd5\u8bd5",
      Decode_Error: "\u64ad\u653e\u6570\u636e\u89e3\u7801\u9519\u8bef",
      Live_Not_Start: "\u4eb2\uff0c\u76f4\u64ad\u8fd8\u672a\u5f00\u59cb\u54e6\uff0c\u656c\u8bf7\u671f\u5f85",
      Live_Loading: "\u76f4\u64ad\u4fe1\u606f\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u5237\u65b0\u8bd5\u8bd5",
      Live_End: "\u4eb2\uff0c\u76f4\u64ad\u5df2\u7ed3\u675f",
      Live_Abrot: "\u5f53\u524d\u76f4\u64ad\u4fe1\u53f7\u4e2d\u65ad\uff0c\u8bf7\u5237\u65b0\u540e\u91cd\u8bd5",
      Corss_Domain_Error: "\u8bf7\u786e\u8ba4\u60a8\u7684\u57df\u540d\u5df2\u5b8c\u6210\u5907\u6848\u548cCNAME\u7ed1\u5b9a\uff0c\r\n\u5e76\u5904\u4e8e\u542f\u7528\u72b6\u6001\uff0c\u6216\u8d44\u6e90\u5141\u8bb8\u8de8\u8d8a\u8bbf\u95ee",
      Url_Timeout_Error: "\u60a8\u6240\u89c2\u770b\u7684\u89c6\u9891\u5730\u5740\u8fde\u63a5\u8d85\u65f6\uff0c\u8bf7\u5237\u65b0\u540e\u91cd\u8bd5",
      Connetction_Error: "\u62b1\u6b49,\u8be5\u89c6\u9891\u7531\u4e8e\u8fde\u63a5\u9519\u8bef\u6682\u65f6\u4e0d\u80fd\u64ad\u653e,\u8bf7\u89c2\u770b\u5176\u5b83\u89c6\u9891",
      Fetch_MTS_Error: "\u83b7\u53d6\u89c6\u9891\u5217\u8868\u5931\u8d25\uff0c\u8bf7\u786e\u8ba4",
      Token_Expired_Error: "\u8bf7\u6c42\u63a5\u53e3\u5931\u8d25\uff0c\u8bf7\u786e\u8ba4Token\u662f\u5426\u8fc7\u671f",
      Video_Lists_Empty_Error: "\u83b7\u53d6\u89c6\u9891\u5217\u8868\u4e3a\u7a7a\uff0c\u8bf7\u786e\u8ba4\u64ad\u653e\u6570\u636e\u4e0e\u683c\u5f0f",
      Encrypted_Failed_Error: "\u83b7\u53d6\u89c6\u9891\u52a0\u5bc6\u79d8\u94a5\u9519\u8bef\uff0c\u8bf7\u786e\u8ba4\u64ad\u653e\u6743\u9650",
      Fetch_Failed_Permission_Error: "\u83b7\u53d6\u89c6\u9891\u5217\u8868\u5931\u8d25\uff0c\u8bf7\u786e\u8ba4\u64ad\u653e\u6743\u9650",
      Invalidate_Param_Error: "\u65e0\u8f93\u5165\u89c6\u9891\uff0c\u8bf7\u786e\u8ba4\u8f93\u5165\u53c2\u6570",
      AutoPlayDelayDisplayText: "$$\u79d2\u4ee5\u540e\u5f00\u59cb\u64ad\u653e",
      Fetch_MTS_NOT_NotStream_Error: "\u6b64vid\u6ca1\u6709\u53ef\u64ad\u653e\u89c6\u9891",
      Cancel_Text: "\u53d6\u6d88",
      OK_Text: "\u786e\u8ba4",
      Auto_Stream_Tip_Text: "\u7f51\u7edc\u4e0d\u7ed9\u529b\uff0c\u662f\u5426\u5207\u6362\u5230$$",
      Fetch_Playauth_Error: "\u83b7\u53d6\u64ad\u653e\u51ed\u8bc1\u51fa\u9519\u5566\uff0c\u8bf7\u5c1d\u8bd5\u9000\u51fa\u91cd\u8bd5\u6216\u5237\u65b0",
      Open_Html_By_File: "\u4e0d\u80fd\u76f4\u63a5\u5728\u6d4f\u89c8\u5668\u6253\u5f00html\u6587\u4ef6\uff0c\u8bf7\u90e8\u7f72\u5230\u670d\u52a1\u7aef",
      Cant_Use_Flash_On_Mobile: "\u79fb\u52a8\u7aef\u4e0d\u652f\u6301Flash\u64ad\u653e\u5668\uff0c\u8bf7\u4f7f\u7528h5\u64ad\u653e\u5668",
      Flash_Not_Ready: "Flash Player\u63d2\u4ef6\u672a\u5b89\u88c5<a href='https://www.flash.cn/' target='_blank'>\u5b89\u88c5\u63d2\u4ef6</a>\uff0c\u5982\u679c\u5df2\u7ecf\u5b89\u88c5\u8bf7\u68c0\u67e5\u662f\u5426\u88ab\u7981\u7528"
    }
  }, {}],
  210: [function (o, e, t) {
    function n() {
      var e;
      return void 0 !== window[s] && window[s] || (e = (e = (navigator.language || navigator.browserLanguage).toLowerCase()) && -1 < e.indexOf("zh") ? "zh-cn" : "en-us", window[s] = e), window[s]
    }

    var r = o("../config"), a = o("../lib/storage"), s = (o("../lib/io"), "aliplayer_lang"), l = function (e, t) {
      var r = h(e), i = "", n = c(),
          i = "flash" == e ? "en-us" == n ? o("./flash/en-us") : "zh-cn" == n ? o("./flash/zh-cn") : t[n] : "en-us" == n ? o("./en-us") : "zh-cn" == n ? o("./zh-cn") : t[n];
      a.set(r, JSON.stringify(i)), u(e, i)
    }, u = function (e, t) {
      var r = h(e);
      window[r] = t
    }, c = function () {
      return n()
    }, h = function (e) {
      var t = c();
      return "aliplayer_lang_data_" + (e = e || "h5") + "_" + r.h5Version.replace(/\./g, "_") + "_" + t
    };
    e.exports.setCurrentLanguage = function (e, t, r) {
      var i = window[s];
      if (void 0 !== e && e || (e = n()), "en-us" != e && "zh-cn" != e && (!r || r && !r[e])) throw new Error("There is not language resource for " + e + ", please specify the language resource by languageTexts property");
      window[s] = e, l(t, r), e != i && o("../lib/constants").updateByLanguage()
    }, e.exports.getCurrentLanguage = n, e.exports.getLanguageData = function (e, t) {
      var r = h(e);
      return window[r]
    }, e.exports.load = l, e.exports.get = function (e, t) {
      var r = h(t = t || "h5"), i = window[r];
      if (i) return i[e]
    }
  }, {
    "../config": 204,
    "../lib/constants": 214,
    "../lib/io": 223,
    "../lib/storage": 229,
    "./en-us": 207,
    "./flash/en-us": 208,
    "./flash/zh-cn": 209,
    "./zh-cn": 211
  }],
  211: [function (e, t, r) {
    t.exports = t.exports = {
      OD: "\u539f\u753b",
      FD: "\u6d41\u7545",
      LD: "\u6807\u6e05",
      SD: "\u9ad8\u6e05",
      HD: "\u8d85\u6e05",
      "2K": "2K",
      "4K": "4K",
      FHD: "\u5168\u9ad8\u6e05",
      XLD: "\u6781\u901f",
      SQ: "\u666e\u901a\u97f3\u8d28",
      HQ: "\u9ad8\u97f3\u8d28",
      Speed: "\u500d\u901f",
      Speed_05X_Text: "0.5X",
      Speed_1X_Text: "\u6b63\u5e38",
      Speed_125X_Text: "1.25X",
      Speed_15X_Text: "1.5X",
      Speed_2X_Text: "2X",
      Quality_Change_Fail_Switch_Text: "\u4e0d\u80fd\u64ad\u653e\uff0c\u5207\u6362\u4e3a",
      Quality_Change_Text: "\u6b63\u5728\u4e3a\u60a8\u5207\u6362\u5230 ",
      Quality_The_Url: "\u6b64\u5730\u5740",
      Refresh_Text: "\u5237\u65b0",
      Detection_Text: "\u8bca\u65ad",
      Cancel: "\u53d6\u6d88",
      Mute: "\u9759\u97f3",
      Snapshot: "\u622a\u56fe",
      Play_DateTime: "\u64ad\u653e\u65f6\u95f4",
      AutoPlayDelayDisplayText: "$$\u79d2\u4ee5\u540e\u5f00\u59cb\u64ad\u653e",
      Error_Load_Abort_Text: "\u83b7\u53d6\u6570\u636e\u8fc7\u7a0b\u88ab\u4e2d\u6b62",
      Error_Network_Text: "\u7f51\u7edc\u9519\u8bef\u52a0\u8f7d\u6570\u636e\u5931\u8d25",
      Error_Decode_Text: "\u89e3\u7801\u9519\u8bef",
      Error_Server_Network_NotSupport_Text: "\u670d\u52a1\u5668\u3001\u7f51\u7edc\u9519\u8bef\u6216\u683c\u5f0f\u4e0d\u652f\u6301",
      Error_Offline_Text: "\u7f51\u7edc\u4e0d\u53ef\u7528\uff0c\u8bf7\u786e\u5b9a",
      Error_Play_Text: "\u64ad\u653e\u51fa\u9519\u5566",
      Error_Retry_Text: "\u8bf7\u5c1d\u8bd5\u9000\u51fa\u91cd\u8bd5\u6216\u5237\u65b0",
      Error_AuthKey_Text: "\u53ef\u80fd\u9274\u6743\u8fc7\u671f\u3001\u57df\u540d\u4e0d\u5728\u767d\u540d\u5355\u6216\u8bf7\u6c42\u88ab\u62e6\u622a",
      Error_H5_Not_Support_Text: "h5\u4e0d\u652f\u6301\u6b64\u683c\u5f0f\uff0c\u8bf7\u4f7f\u7528flash\u64ad\u653e\u5668",
      Error_Not_Support_M3U8_Text: "\u6d4f\u89c8\u5668\u4e0d\u652f\u6301m3u8\u89c6\u9891\u64ad\u653e",
      Error_Not_Support_MP4_Text: "\u6d4f\u89c8\u5668\u4e0d\u652f\u6301mp4\u89c6\u9891\u64ad\u653e",
      Error_Not_Support_encrypt_Text: "\u64ad\u653e\u52a0\u5bc6\u89c6\u9891\uff0c\u8bf7\u8bbe\u7f6e\u5c5e\u6027encryptType to 1",
      Error_Vod_URL_Is_Empty_Text: "\u83b7\u53d6\u64ad\u653e\u5730\u5740\u4e3a\u7a7a",
      Error_Vod_Fetch_Urls_Text: "\u83b7\u53d6\u5730\u5740\u51fa\u9519\u5566\uff0c\u8bf7\u5c1d\u8bd5\u9000\u51fa\u91cd\u8bd5\u6216\u5237\u65b0",
      Fetch_Playauth_Error: "\u83b7\u53d6\u64ad\u653e\u51ed\u8bc1\u51fa\u9519\u5566\uff0c\u8bf7\u5c1d\u8bd5\u9000\u51fa\u91cd\u8bd5\u6216\u5237\u65b0",
      Error_Playauth_Decode_Text: "playauth\u89e3\u6790\u9519\u8bef",
      Error_Vid_Not_Same_Text: "\u4e0d\u80fd\u66f4\u65b0\u5730\u5740\uff0cvid\u548c\u64ad\u653e\u4e2d\u7684\u4e0d\u4e00\u81f4",
      Error_Playauth_Expired_Text: "\u51ed\u8bc1\u5df2\u8fc7\u671f\uff0c\u8bf7\u5c1d\u8bd5\u9000\u51fa\u91cd\u8bd5\u6216\u5237\u65b0",
      Error_MTS_Fetch_Urls_Text: "MTS\u83b7\u53d6\u53d6\u6570\u5931\u8d25",
      Error_Load_M3U8_Failed_Text: "\u83b7\u53d6m3u8\u6587\u4ef6\u5931\u8d25",
      Error_Load_M3U8_Timeout_Text: "\u83b7\u53d6m3u8\u6587\u4ef6\u8d85\u65f6",
      Error_M3U8_Decode_Text: "\u83b7\u53d6m3u8\u6587\u4ef6\u89e3\u6790\u5931\u8d25",
      Error_TX_Decode_Text: "\u89e3\u6790\u6570\u636e\u51fa\u9519",
      Error_Waiting_Timeout_Text: "\u7f13\u51b2\u6570\u636e\u8d85\u65f6\uff0c\u8bf7\u5c1d\u8bd5\u9000\u51fa\u91cd\u8bd5\u6216\u5237\u65b0",
      Error_Invalidate_Source: "\u64ad\u653e\u5730\u5740\u683c\u5f0f\u9700\u8981\u4e3amp4\u3001mp3\u3001m3u8\u3001mpd\u6216flv",
      Error_Empty_Source: "\u64ad\u653e\u5730\u5740\u4e0d\u80fd\u4e3a\u7a7a",
      Error_Vid_Empty_Source: "vid\u5bf9\u5e94\u7684\u89c6\u9891\u5730\u5740\u8fd8\u672a\u83b7\u53d6\u5230",
      Error_Fetch_NotStream: "\u6b64vid\u6ca1\u6709\u53ef\u64ad\u653e\u89c6\u9891",
      Error_Not_Found: "\u64ad\u653e\u5730\u5740\u4e0d\u5b58\u5728",
      Live_End: "\u4eb2\uff0c\u76f4\u64ad\u5df2\u7ed3\u675f",
      Play_Before_Fullscreen: "\u64ad\u653e\u540e\u518d\u5168\u5c4f",
      Can_Not_Seekable: "\u4e0d\u80fdseek\u5230\u8fd9\u91cc",
      Cancel_Text: "\u53d6\u6d88",
      OK_Text: "\u786e\u8ba4",
      Auto_Stream_Tip_Text: "\u7f51\u7edc\u4e0d\u7ed9\u529b\uff0c\u662f\u5426\u5207\u6362\u5230$$",
      Request_Block_Text: "\u6d4f\u89c8\u5668\u5b89\u5168\u7b56\u7565\u89c6\u9891\u5730\u5740\u4e0d\u80fd\u4e3ahttp\u534f\u8bae\uff0c\u4e0e\u7f51\u7ad9https\u534f\u8bae\u4e0d\u4e00\u81f4",
      Open_Html_By_File: "\u4e0d\u80fd\u76f4\u63a5\u5728\u6d4f\u89c8\u5668\u6253\u5f00html\u6587\u4ef6\uff0c\u8bf7\u90e8\u7f72\u5230\u670d\u52a1\u7aef",
      Maybe_Cors_Error: "\u8bf7\u786e\u8ba4\u662f\u5426\u5f00\u542f\u4e86\u5141\u8bb8\u8de8\u57df\u8bbf\u95ee<a href='https://help.aliyun.com/document_detail/62950.html' target='_blank'>\u53c2\u8003\u6587\u6863</a>",
      Speed_Switch_To: "\u500d\u901f\u5207\u6362\u5230 ",
      Curent_Volume: "\u5f53\u524d\u97f3\u91cf\uff1a",
      Volume_Mute: "\u8bbe\u7f6e\u4e3a\u9759\u97f3",
      Volume_UnMute: "\u8bbe\u7f6e\u4e3a\u975e\u9759\u97f3",
      ShiftLiveTime_Error: "\u76f4\u64ad\u5f00\u59cb\u65f6\u95f4\u4e0d\u80fd\u5927\u4e8e\u76f4\u64ad\u7ed3\u675f\u65f6\u95f4",
      Error_Not_Support_Format_On_Mobile: "\u79fb\u52a8\u7aef\u4e0d\u652f\u6301flv\u3001rmtp\u89c6\u9891\uff0c\u8bf7\u4f7f\u7528m3u8",
      SessionId_Ticket_Invalid: "DRM\u89c6\u9891\u64ad\u653e\uff0csessionId\u548cticket\u5c5e\u6027\u4e0d\u80fd\u4e3a\u7a7a",
      Http_Error: "Http\u7f51\u7edc\u8bf7\u6c42\u5931\u8d25",
      Http_Timeout: "http\u8bf7\u6c42\u8d85\u65f6",
      DRM_License_Expired: "DRM license\u8d85\u65f6\uff0c\u8bf7\u5237\u65b0",
      Not_Support_DRM: "\u6d4f\u89c8\u5668\u4e0d\u652f\u6301DRM\u89c6\u9891\u7684\u64ad\u653e",
      CC_Switch_To: "\u5b57\u5e55\u5207\u6362\u5230 ",
      AudioTrack_Switch_To: "\u97f3\u8f68\u5207\u6362\u5230 ",
      Subtitle: "\u5b57\u5e55",
      AudioTrack: "\u97f3\u8f68",
      Quality: "\u6e05\u6670\u5ea6",
      Auto: "\u81ea\u52a8",
      Quality_Switch_To: "\u6e05\u6670\u5ea6\u5207\u6362\u5230 ",
      Fullscreen: "\u5168\u5c4f",
      Setting: "\u8bbe\u7f6e",
      Volume: "\u97f3\u91cf",
      Play: "\u64ad\u653e",
      Pause: "\u6682\u505c",
      CloseSubtitle: "\u5173\u95ed\u5b57\u5e55",
      OpenSubtitle: "\u6253\u5f00\u5b57\u5e55",
      ExistFullScreen: "\u9000\u51fa\u5168\u5c4f",
      Muted: "\u9759\u97f3",
      Retry: "\u91cd\u8bd5",
      SwitchToLive: "\u8fd4\u56de\u76f4\u64ad",
      iOSNotSupportVodEncription: "iOS\u4e0d\u652f\u6301\u70b9\u64ad\u52a0\u5bc6\u64ad\u653e",
      UseChromeForVodEncription: "\u6d4f\u89c8\u5668\u4e0d\u652f\u6301\u70b9\u64ad\u52a0\u5bc6\u64ad\u653e\uff0c\u8bf7\u4f7f\u7528\u6700\u65b0Chrome\u6d4f\u89c8\u5668",
      Http_Request_Error: "\u4fe1\u4ee4\u8bf7\u6c42\u5931\u8d25",
      ERROR_PLAY_FAILED: "\u64ad\u653e\u5931\u8d25",
      Browser_Not_Support: "\u4e0d\u652f\u6301\u6b64\u6d4f\u89c8\u5668",
      Not_Support_Webrtc: "\u4e0d\u652f\u6301webrtc",
      Browser_Version_Too_Low: "\u6d4f\u89c8\u5668\u7248\u672c\u8fc7\u4f4e",
      Not_Support_H264: "\u4e0d\u652f\u6301H264",
      Create_Offer_Error: "create offer\u5931\u8d25",
      Play_Url_Error: "\u64ad\u653eurl\u534f\u8bae\u9519\u8bef",
      Subscribe_Nonthing: "\u53c2\u6570\u8bbe\u7f6e\u9519\u8bef",
      Html_Element_Error: "\u4f20\u5165\u7684HtmlElement\u9519\u8bef",
      Html_Element_Not_Match: "\u8ba2\u9605\u7684\u5185\u5bb9\u548c\u4f20\u5165\u7684\u53c2\u6570\u4e0d\u5339\u914d"
    }
  }, {}],
  212: [function (e, t, r) {
    var o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    if (window.Uint8Array) for (var h = new Uint8Array(256), i = 0; i < o.length; i++) h[o.charCodeAt(i)] = i;
    var u = function (e) {
      for (var t = "", r = 0; r < e.length; r += 16e3) {
        var i = e.subarray(r, r + 16e3);
        t += String.fromCharCode.apply(null, i)
      }
      return t
    };
    unpackPlayReady = function (e) {
      var t = function (e, t, r) {
        if (!e) return "";
        var i, n;
        r || e.byteLength % 2 == 0 || console.log("Data has an incorrect length, must be even."), i = e instanceof ArrayBuffer ? e : ((n = new Uint8Array(e.byteLength)).set(new Uint8Array(e)), n.buffer);
        for (var o = Math.floor(e.byteLength / 2), a = new Uint16Array(o), s = new DataView(i), l = 0; l < o; l++) a[l] = s.getUint16(2 * l, t);
        return u(a)
      }(e, !0, !0);
      if (-1 != t.indexOf("PlayReadyKeyMessage")) {
        for (var r = (new DOMParser).parseFromString(t, "application/xml"), i = r.getElementsByTagName("HttpHeader"), n = {}, o = 0; o < i.length; ++o) {
          var a = i[o].querySelector("name"), s = i[o].querySelector("value");
          n[a.textContent] = s.textContent
        }
        return {header: n, changange: r.querySelector("Challenge").textContent}
      }
      console.log("PlayReady request is already unwrapped.")
    }, t.exports = {
      decode: function (e) {
        var t, r, i, n, o = .75 * e.length, a = e.length, s = 0;
        "=" === e[e.length - 1] && (o--, "=" === e[e.length - 2] && o--);
        for (var l = new ArrayBuffer(o), u = new Uint8Array(l), c = 0; c < a; c += 4) t = h[e.charCodeAt(c)], r = h[e.charCodeAt(c + 1)], i = h[e.charCodeAt(c + 2)], n = h[e.charCodeAt(c + 3)], u[s++] = t << 2 | r >> 4, u[s++] = (15 & r) << 4 | i >> 2, u[s++] = (3 & i) << 6 | 63 & n;
        return l
      }, encode: function (e) {
        for (var t = new Uint8Array(e), r = t.length, i = "", n = 0; n < r; n += 3) i += o[t[n] >> 2], i += o[(3 & t[n]) << 4 | t[n + 1] >> 4], i += o[(15 & t[n + 1]) << 2 | t[n + 2] >> 6], i += o[63 & t[n + 2]];
        return r % 3 == 2 ? i = i.substring(0, i.length - 1) + "=" : r % 3 == 1 && (i = i.substring(0, i.length - 2) + "=="), i
      }, unpackPlayReady: unpackPlayReady
    }
  }, {}],
  213: [function (e, t, r) {
    var i = e("./oo"), n = e("../player/base/event/eventtype");
    t.exports.stopPropagation = function (e) {
      window.event ? window.event.cancelBubble = !0 : e.stopPropagation()
    }, t.exports.register = function (e) {
      e.util = {stopPropagation: t.exports.stopPropagation}, e.Component = i.extend, e.EventType = n.Player
    }
  }, {"../player/base/event/eventtype": 242, "./oo": 226}],
  214: [function (e, t, r) {
    var i = e("../lang/index");
    t.exports.LOAD_START = "loadstart", t.exports.LOADED_METADATA = "loadedmetadata", t.exports.LOADED_DATA = "loadeddata", t.exports.PROGRESS = "progress", t.exports.CAN_PLAY = "canplay", t.exports.CAN_PLYA_THROUGH = "canplaythrough", t.exports.PLAY = "play", t.exports.PAUSE = "pause", t.exports.ENDED = "ended", t.exports.PLAYING = "playing", t.exports.WAITING = "waiting", t.exports.ERROR = "error", t.exports.SUSPEND = "suspend", t.exports.STALLED = "stalled", t.exports.AuthKeyExpiredEvent = "authkeyexpired", t.exports.DRMKeySystem = {
      4: "com.microsoft.playready",
      5: "com.widevine.alpha"
    }, t.exports.EncryptionType = {
      Private: 1,
      Standard: 2,
      ChinaDRM: 3,
      PlayReady: 4,
      Widevine: 5
    }, t.exports.VodEncryptionType = {
      AliyunVoDEncryption: 1,
      HLSEncryption: 2
    }, t.exports.DRMType = {
      Widevine: "Widevine",
      PlayReady: "PlayReady"
    }, t.exports.ErrorCode = {
      InvalidParameter: 4001,
      AuthKeyExpired: 4002,
      InvalidSourceURL: 4003,
      NotFoundSourceURL: 4004,
      StartLoadData: 4005,
      LoadedMetadata: 4006,
      PlayingError: 4007,
      LoadingTimeout: 4008,
      RequestDataError: 4009,
      EncrptyVideoNotSupport: 4010,
      FormatNotSupport: 4011,
      PlayauthDecode: 4012,
      PlayDataDecode: 4013,
      NetworkUnavaiable: 4014,
      UserAbort: 4015,
      NetworkError: 4016,
      URLsIsEmpty: 4017,
      CrossDomain: 4027,
      OtherError: 4400,
      ServerAPIError: 4500,
      FlashNotInstalled: 4600,
      RequestHttpError: 4100,
      PlayFailedError: 4200,
      NotSupportWebRtc: 4110,
      BrowserNotSupport: 4111,
      BrowserVersionTooLow: 4112,
      NotSupportH264: 4113,
      CreateOfferError: 4114,
      AutoPLayFaild: 4115,
      PlayUrlError: 4116,
      SubscribeNonthing: 4117,
      HtmlElementError: 4118,
      HtmlElementNotMatch: 4119
    }, t.exports.AuthKeyExpired = 7200, t.exports.AuthKeyRefreshExpired = 7e3, t.exports.AuthInfoExpired = 100, t.exports.VideoErrorCode = {
      1: 4015,
      2: 4016,
      3: 4013,
      4: 4400
    }, t.exports.IconType = {
      FontClass: "fontclass",
      Symbol: "symbol",
      Sprite: "Sprite"
    }, t.exports.SelectedStreamLevel = "selectedStreamLevel", t.exports.SelectedCC = "selectedCC", t.exports.WidthMapToLevel = {
      0: "OD",
      640: "FD",
      960: "LD",
      1280: "SD",
      1920: "HD",
      2580: "2K",
      3840: "4K"
    };

    function n() {
      t.exports.VideoErrorCodeText = {
        1: i.get("Error_Load_Abort_Text"),
        2: i.get("Error_Network_Text"),
        3: i.get("Error_Decode_Text"),
        4: i.get("Error_Server_Network_NotSupport_Text")
      }, t.exports.VideoLevels = {
        0: i.get("OD"),
        640: i.get("FD"),
        960: i.get("LD"),
        1280: i.get("SD"),
        1920: i.get("HD"),
        2580: i.get("2K"),
        3840: i.get("4K")
      }, t.exports.QualityLevels = {
        OD: i.get("OD"),
        LD: i.get("LD"),
        FD: i.get("FD"),
        SD: i.get("SD"),
        HD: i.get("HD"),
        "2K": i.get("2K"),
        "4K": i.get("4K"),
        XLD: i.get("XLD"),
        FHD: i.get("FHD"),
        SQ: i.get("SQ"),
        HQ: i.get("HQ")
      }, t.exports.SpeedLevels = [{key: .5, text: i.get("Speed_05X_Text")}, {
        key: 1,
        text: i.get("Speed_1X_Text")
      }, {key: 1.25, text: i.get("Speed_125X_Text")}, {key: 1.5, text: i.get("Speed_15X_Text")}, {
        key: 2,
        text: i.get("Speed_2X_Text")
      }]
    }

    n(), t.exports.updateByLanguage = n
  }, {"../lang/index": 210}],
  215: [function (e, t, r) {
    t.exports.get = function (e) {
      for (var t = e + "", r = document.cookie.split(";"), i = 0; i < r.length; i++) {
        var n = r[i].trim();
        if (0 == n.indexOf(t)) return unescape(n.substring(t.length + 1, n.length))
      }
      return ""
    }, t.exports.set = function (e, t, r) {
      var i = new Date;
      i.setTime(i.getTime() + 24 * r * 60 * 60 * 1e3);
      var n = "expires=" + i.toGMTString();
      document.cookie = e + "=" + escape(t) + "; " + n
    }
  }, {}],
  216: [function (e, r, t) {
    var i = e("./object");
    r.exports.cache = {}, r.exports.guid = function (e, t) {
      var r, i, n = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""), o = [];
      if (t = t || n.length, e) for (r = 0; r < e; r++) o[r] = n[0 | Math.random() * t]; else for (o[8] = o[13] = o[18] = o[23] = "-", o[14] = "4", r = 0; r < 36; r++) o[r] || (i = 0 | 16 * Math.random(), o[r] = n[19 == r ? 3 & i | 8 : i]);
      return o.join("")
    }, r.exports.expando = "vdata" + (new Date).getTime(), r.exports.getData = function (e) {
      var t = e[r.exports.expando];
      return t || (t = e[r.exports.expando] = r.exports.guid(), r.exports.cache[t] = {}), r.exports.cache[t]
    }, r.exports.hasData = function (e) {
      var t = "";
      return e && (t = e[r.exports.expando]), !(!t || i.isEmpty(r.exports.cache[t]))
    }, r.exports.removeData = function (t) {
      var e = "";
      if (t && (e = t[r.exports.expando]), e) {
        delete r.exports.cache[e];
        try {
          delete t[r.exports.expando]
        } catch (e) {
          t.removeAttribute ? t.removeAttribute(r.exports.expando) : t[r.exports.expando] = null
        }
      }
    }
  }, {"./object": 225}],
  217: [function (e, c, t) {
    var i = e("./object");
    c.exports.el = function (e) {
      return document.getElementById(e)
    }, c.exports.createEl = function (e, t) {
      var r;
      return e = e || "div", t = t || {}, r = document.createElement(e), i.each(t, function (e, t) {
        -1 !== e.indexOf("aria-") || "role" == e ? r.setAttribute(e, t) : r[e] = t
      }), r
    }, c.exports.addClass = function (e, t) {
      -1 == (" " + e.className + " ").indexOf(" " + t + " ") && (e.className = "" === e.className ? t : e.className + " " + t)
    }, c.exports.removeClass = function (e, t) {
      var r, i;
      if (-1 != e.className.indexOf(t)) {
        for (i = (r = e.className.split(" ")).length - 1; 0 <= i; i--) r[i] === t && r.splice(i, 1);
        e.className = r.join(" ")
      }
    }, c.exports.hasClass = function (e, t) {
      return -1 != e.className.indexOf(t)
    }, c.exports.getClasses = function (e) {
      return e.className ? e.className.split(" ") : []
    }, c.exports.getElementAttributes = function (e) {
      var t, r, i, n = {}, o = ",autoplay,controls,loop,muted,default,";
      if (e && e.attributes && 0 < e.attributes.length) for (var a = (t = e.attributes).length - 1; 0 <= a; a--) r = t[a].name, i = t[a].value, "boolean" != typeof e[r] && -1 === o.indexOf("," + r + ",") || (i = null !== i), n[r] = i;
      return n
    }, c.exports.insertFirst = function (e, t) {
      t.firstChild ? t.insertBefore(e, t.firstChild) : t.appendChild(e)
    }, c.exports.blockTextSelection = function () {
      document.body.focus(), document.onselectstart = function () {
        return !1
      }
    }, c.exports.unblockTextSelection = function () {
      document.onselectstart = function () {
        return !0
      }
    }, c.exports.css = function (r, e, t) {
      return !(!r || !r.style) && (e && t ? (r.style[e] = t, !0) : t || "string" != typeof e ? !t && "object" == typeof e && (i.each(e, function (e, t) {
        r.style[e] = t
      }), !0) : r.style[e])
    }, c.exports.getTransformName = function (e) {
      for (var t = ["transform", "WebkitTransform", "MozTransform", "msTransform", "OTransform"], r = t[0], i = 0, n = t.length; i < n; i++) if (void 0 !== e.style[t[i]]) {
        r = t[i];
        break
      }
      return r
    }, c.exports.getTransformEventName = function (e, t) {
      for (var r = ["", "Webkit", "Moz", "ms", "O"], i = t.toLowerCase(), n = ["transform", "WebkitTransform", "MozTransform", "msTransform", "OTransform"], o = 0, a = n.length; o < a; o++) if (void 0 !== e.style[n[o]]) {
        0 != o && (i = r[o] + t);
        break
      }
      return i
    }, c.exports.addCssByStyle = function (e) {
      var t, r = document, i = r.createElement("style");
      i.setAttribute("type", "text/css"), i.styleSheet ? i.styleSheet.cssText = e : (t = r.createTextNode(e), i.appendChild(t));
      var n = r.getElementsByTagName("head");
      n.length ? n[0].appendChild(i) : r.documentElement.appendChild(i)
    }, c.exports.getTranslateX = function (e) {
      var t = 0;
      if (e) try {
        var r = window.getComputedStyle(e), i = c.exports.getTransformName(e), t = new WebKitCSSMatrix(r[i]).m41
      } catch (e) {
        console.log(e)
      }
      return t
    }, c.exports.getPointerPosition = function (e, t) {
      var r = {}, i = c.exports.findPosition(e), n = e.offsetWidth, o = e.offsetHeight, a = i.top, s = i.left,
          l = t.pageY, u = t.pageX;
      return t.changedTouches && (u = t.changedTouches[0].pageX, l = t.changedTouches[0].pageY), r.y = Math.max(0, Math.min(1, (a - l + o) / o)), r.x = Math.max(0, Math.min(1, (u - s) / n)), r
    }, c.exports.findPosition = function (e) {
      var t;
      if (e.getBoundingClientRect && e.parentNode && (t = e.getBoundingClientRect()), !t) return {left: 0, top: 0};
      var r = document.documentElement, i = document.body, n = r.clientLeft || i.clientLeft || 0,
          o = window.pageXOffset || i.scrollLeft, a = t.left + o - n, s = r.clientTop || i.clientTop || 0,
          l = window.pageYOffset || i.scrollTop, u = t.top + l - s;
      return {left: Math.round(a), top: Math.round(u)}
    }
  }, {"./object": 225}],
  218: [function (e, l, t) {
    var u = e("./object"), c = e("./data"), r = e("./ua"), i = e("fastclick");

    function h(t, r, e, i) {
      u.each(e, function (e) {
        t(r, e, i)
      })
    }

    l.exports.on = function (o, e, t) {
      if (o) {
        if (u.isArray(e)) return h(l.exports.on, o, e, t);
        r.IS_MOBILE && "click" == e && i(o);
        var a = c.getData(o);
        a.handlers || (a.handlers = {}), a.handlers[e] || (a.handlers[e] = []), t.guid || (t.guid = c.guid()), a.handlers[e].push(t), a.dispatcher || (a.disabled = !1, a.dispatcher = function (e) {
          if (!a.disabled) {
            e = l.exports.fixEvent(e);
            var t = a.handlers[e.type];
            if (t) for (var r = t.slice(0), i = 0, n = r.length; i < n && !e.isImmediatePropagationStopped(); i++) r[i].call(o, e)
          }
        }), 1 == a.handlers[e].length && (o.addEventListener ? o.addEventListener(e, a.dispatcher, !1) : o.attachEvent && o.attachEvent("on" + e, a.dispatcher))
      }
    }, l.exports.off = function (t, e, r) {
      if (t && c.hasData(t)) {
        var i = c.getData(t);
        if (i.handlers) {
          if (u.isArray(e)) return h(l.exports.off, t, e, r);

          function n(e) {
            i.handlers[e] = [], l.exports.cleanUpEvents(t, e)
          }

          if (e) {
            var o = i.handlers[e];
            if (o) if (r) {
              if (r.guid) for (var a = 0; a < o.length; a++) o[a].guid === r.guid && o.splice(a--, 1);
              l.exports.cleanUpEvents(t, e)
            } else n(e)
          } else for (var s in i.handlers) n(s)
        }
      }
    }, l.exports.cleanUpEvents = function (e, t) {
      var r = c.getData(e);
      0 === r.handlers[t].length && (delete r.handlers[t], e.removeEventListener ? e.removeEventListener(t, r.dispatcher, !1) : e.detachEvent && e.detachEvent("on" + t, r.dispatcher)), u.isEmpty(r.handlers) && (delete r.handlers, delete r.dispatcher, delete r.disabled), u.isEmpty(r) && c.removeData(e)
    }, l.exports.fixEvent = function (e) {
      function t() {
        return !0
      }

      function r() {
        return !1
      }

      if (!e || !e.isPropagationStopped) {
        var i, n, o = e || window.event;
        for (var a in e = {}, o) "layerX" !== a && "layerY" !== a && "keyboardEvent.keyLocation" !== a && ("returnValue" == a && o.preventDefault || (e[a] = o[a]));
        e.target || (e.target = e.srcElement || document), e.relatedTarget = e.fromElement === e.target ? e.toElement : e.fromElement, e.preventDefault = function () {
          o.preventDefault && o.preventDefault(), e.returnValue = !1, e.isDefaultPrevented = t, e.defaultPrevented = !0
        }, e.isDefaultPrevented = r, e.defaultPrevented = !1, e.stopPropagation = function () {
          o.stopPropagation && o.stopPropagation(), e.cancelBubble = !0, e.isPropagationStopped = t
        }, e.isPropagationStopped = r, e.stopImmediatePropagation = function () {
          o.stopImmediatePropagation && o.stopImmediatePropagation(), e.isImmediatePropagationStopped = t, e.stopPropagation()
        }, e.isImmediatePropagationStopped = r, null != e.clientX && (i = document.documentElement, n = document.body, e.pageX = e.clientX + (i && i.scrollLeft || n && n.scrollLeft || 0) - (i && i.clientLeft || n && n.clientLeft || 0), e.pageY = e.clientY + (i && i.scrollTop || n && n.scrollTop || 0) - (i && i.clientTop || n && n.clientTop || 0)), e.which = e.charCode || e.keyCode, null != e.button && (e.button = 1 & e.button ? 0 : 4 & e.button ? 1 : 2 & e.button ? 2 : 0)
      }
      return e
    }, l.exports.trigger = function (e, t) {
      if (e) {
        var r, i, n = c.hasData(e) ? c.getData(e) : {}, o = e.parentNode || e.ownerDocument;
        return "string" == typeof t && (r = null, !e.paramData && 0 != e.paramData || (r = e.paramData, e.paramData = null, e.removeAttribute(r)), t = {
          type: t,
          target: e,
          paramData: r
        }), t = l.exports.fixEvent(t), n.dispatcher && n.dispatcher.call(e, t), o && !t.isPropagationStopped() && !1 !== t.bubbles ? l.exports.trigger(o, t) : o || t.defaultPrevented || (i = c.getData(t.target), t.target[t.type] && (i.disabled = !0, "function" == typeof t.target[t.type] && t.target[t.type](), i.disabled = !1)), !t.defaultPrevented
      }
    }, l.exports.one = function (e, t, r) {
      if (e) {
        if (u.isArray(t)) return h(l.exports.one, e, t, r);
        var i = function () {
          l.exports.off(e, t, i), r.apply(this, arguments)
        };
        i.guid = r.guid = r.guid || c.guid(), l.exports.on(e, t, i)
      }
    }
  }, {"./data": 216, "./object": 225, "./ua": 230, fastclick: 110}],
  219: [function (e, t, r) {
    var n = e("./data");
    t.exports.bind = function (e, t, r) {
      t.guid || (t.guid = n.guid());

      function i() {
        return t.apply(e, arguments)
      }

      return i.guid = r ? r + "_" + t.guid : t.guid, i
    }
  }, {"./data": 216}],
  220: [function (e, t, r) {
    var i = /^((?:[a-zA-Z0-9+\-.]+:)?)(\/\/[^\/\;?#]*)?(.*?)??(;.*?)?(\?.*?)?(#.*?)?$/, c = /^([^\/;?#]*)(.*)$/,
        n = /(?:\/|^)\.(?=\/)/g, o = /(?:\/|^)\.\.\/(?!\.\.\/).*?(?=\/)/g, h = {
          buildAbsoluteURL: function (e, t, r) {
            if (r = r || {}, e = e.trim(), !(t = t.trim())) {
              if (!r.alwaysNormalize) return e;
              var i = h.parseURL(e);
              if (!i) throw new Error("Error trying to parse base URL.");
              return i.path = h.normalizePath(i.path), h.buildURLFromParts(i)
            }
            var n = h.parseURL(t);
            if (!n) throw new Error("Error trying to parse relative URL.");
            if (n.scheme) return r.alwaysNormalize ? (n.path = h.normalizePath(n.path), h.buildURLFromParts(n)) : t;
            var o, a = h.parseURL(e);
            if (!a) throw new Error("Error trying to parse base URL.");
            !a.netLoc && a.path && "/" !== a.path[0] && (o = c.exec(a.path), a.netLoc = o[1], a.path = o[2]), a.netLoc && !a.path && (a.path = "/");
            var s, l, u = {
              scheme: a.scheme,
              netLoc: n.netLoc,
              path: null,
              params: n.params,
              query: n.query,
              fragment: n.fragment
            };
            return n.netLoc || (u.netLoc = a.netLoc, "/" !== n.path[0] && (n.path ? (l = (s = a.path).substring(0, s.lastIndexOf("/") + 1) + n.path, u.path = h.normalizePath(l)) : (u.path = a.path, n.params || (u.params = a.params, n.query || (u.query = a.query))))), null === u.path && (u.path = r.alwaysNormalize ? h.normalizePath(n.path) : n.path), h.buildURLFromParts(u)
          }, parseURL: function (e) {
            var t = i.exec(e);
            return t ? {
              scheme: t[1] || "",
              netLoc: t[2] || "",
              path: t[3] || "",
              params: t[4] || "",
              query: t[5] || "",
              fragment: t[6] || ""
            } : null
          }, normalizePath: function (e) {
            for (e = e.split("").reverse().join("").replace(n, ""); e.length !== (e = e.replace(o, "")).length;) ;
            return e.split("").reverse().join("")
          }, buildURLFromParts: function (e) {
            return e.scheme + e.netLoc + e.path + e.params + e.query + e.fragment
          }
        };
    t.exports = h
  }, {}],
  221: [function (e, t, r) {
    function i(e) {
      for (var t in "string" == typeof e && (e = this.parseAttrList(e)), e) e.hasOwnProperty(t) && (this[t] = e[t])
    }

    var n = /^(\d+)x(\d+)$/, o = /\s*(.+?)\s*=((?:\".*?\")|.*?)(?:,|$)/g;
    i.prototype = {
      decimalInteger: function (e) {
        var t = parseInt(this[e], 10);
        return t > Number.MAX_SAFE_INTEGER ? 1 / 0 : t
      }, hexadecimalInteger: function (e) {
        if (this[e]) {
          for (var t = (1 & (t = (this[e] || "0x").slice(2)).length ? "0" : "") + t, r = new Uint8Array(t.length / 2), i = 0; i < t.length / 2; i++) r[i] = parseInt(t.slice(2 * i, 2 * i + 2), 16);
          return r
        }
        return null
      }, hexadecimalIntegerAsNumber: function (e) {
        var t = parseInt(this[e], 16);
        return t > Number.MAX_SAFE_INTEGER ? 1 / 0 : t
      }, decimalFloatingPoint: function (e) {
        return parseFloat(this[e])
      }, enumeratedString: function (e) {
        return this[e]
      }, decimalResolution: function (e) {
        var t = n.exec(this[e]);
        if (null !== t) return {width: parseInt(t[1], 10), height: parseInt(t[2], 10)}
      }, parseAttrList: function (e) {
        var t, r = {};
        for (o.lastIndex = 0; null !== (t = o.exec(e));) {
          var i = t[2];
          0 === i.indexOf('"') && i.lastIndexOf('"') === i.length - 1 && (i = i.slice(1, -1)), r[t[1]] = i
        }
        return r
      }
    }, t.exports = i
  }, {}],
  222: [function (e, t, r) {
    function T() {
      this.method = null, this.key = null, this.iv = null, this._uri = null
    }

    function M() {
      this._url = null, this._byteRange = null, this._decryptdata = null, this.tagList = []
    }

    var k = e("./attrlist"), i = e("../io"), n = e("./URLToolkit"),
        c = /#EXT-X-STREAM-INF:([^\n\r]*)[\r\n]+([^\r\n]+)/g, u = /#EXT-X-MEDIA:(.*)/g,
        P = new RegExp([/#EXTINF:(\d*(?:\.\d+)?)(?:,(.*)\s+)?/.source, /|(?!#)(\S+)/.source, /|#EXT-X-BYTERANGE:*(.+)/.source, /|#EXT-X-PROGRAM-DATE-TIME:(.+)/.source, /|#.*/.source].join(""), "g"),
        C = /(?:(?:#(EXTM3U))|(?:#EXT-X-(PLAYLIST-TYPE):(.+))|(?:#EXT-X-(MEDIA-SEQUENCE): *(\d+))|(?:#EXT-X-(TARGETDURATION): *(\d+))|(?:#EXT-X-(KEY):(.+))|(?:#EXT-X-(START):(.+))|(?:#EXT-X-(ENDLIST))|(?:#EXT-X-(DISCONTINUITY-SEQ)UENCE:(\d+))|(?:#EXT-X-(DIS)CONTINUITY))|(?:#EXT-X-(VERSION):(\d+))|(?:#EXT-X-(MAP):(.+))|(?:(#)(.*):(.*))|(?:(#)(.*))(?:.*)\r?\n?/;
    M.prototype.getUrl = function () {
      return !this._url && this.relurl && (this._url = n.buildAbsoluteURL(this.baseurl, this.relurl, {alwaysNormalize: !0})), this._url
    }, M.prototype.Seturl = function (e) {
      this._url = e
    }, M.prototype.getProgramDateTime = function () {
      return !this._programDateTime && this.rawProgramDateTime && (this._programDateTime = new Date(Date.parse(this.rawProgramDateTime))), this._programDateTime
    }, M.prototype.GetbyteRange = function () {
      var e, t, r;
      return this._byteRange || (e = this._byteRange = [], this.rawByteRange && (1 === (t = this.rawByteRange.split("@", 2)).length ? (r = this.lastByteRangeEndOffset, e[0] = r || 0) : e[0] = parseInt(t[1]), e[1] = parseInt(t[0]) + e[0])), this._byteRange
    }, M.prototype.getByteRangeStartOffset = function () {
      return this.byteRange[0]
    }, M.prototype.getByteRangeEndOffset = function () {
      return this.byteRange[1]
    };
    M.prototype.getDecryptdata = function () {
      return this._decryptdata || (this._decryptdata = this.fragmentDecryptdataFromLevelkey(this.levelkey, this.sn)), this._decryptdata
    };

    function o() {
      this.loaders = {}
    }

    o.prototype = {
      parseMasterPlaylist: function (e, t) {
        var r, i = [];
        for (c.lastIndex = 0; null != (r = c.exec(e));) {
          var n = {}, o = n.attrs = new k(r[1]);
          n.url = this.resolve(r[2], t);
          var a = o.decimalResolution("RESOLUTION");
          a && (n.width = a.width, n.height = a.height), n.bitrate = o.decimalInteger("AVERAGE-BANDWIDTH") || o.decimalInteger("BANDWIDTH"), n.name = o.NAME;
          var s = o.CODECS;
          if (s) {
            s = s.split(/[ ,]+/);
            for (var l = 0; l < s.length; l++) {
              var u = s[l];
              -1 !== u.indexOf("avc1") ? n.videoCodec = this.avc1toavcoti(u) : -1 !== u.indexOf("hvc1") ? n.videoCodec = u : n.audioCodec = u
            }
          }
          i.push(n)
        }
        return i
      }, parseMasterPlaylistMedia: function (e, t, r, i) {
        var n, o = [], a = 0;
        for (u.lastIndex = 0; null != (n = u.exec(e));) {
          var s = {}, l = new k(n[1]);
          l.TYPE === r && (s.groupId = l["GROUP-ID"], s.name = l.NAME, s.type = r, s["default"] = "YES" === l.DEFAULT, s.autoselect = "YES" === l.AUTOSELECT, s.forced = "YES" === l.FORCED, l.URI && (s.url = this.resolve(l.URI, t)), s.lang = l.LANGUAGE, s.name || (s.name = s.lang), i && (s.audioCodec = i), s.id = a++, o.push(s))
        }
        return o
      }, avc1toavcoti: function (e) {
        var t, r = e.split(".");
        return 2 < r.length ? (t = r.shift() + ".", t += parseInt(r.shift()).toString(16), t += ("000" + parseInt(r.shift()).toString(16)).substr(-4)) : t = e, t
      }, parseLevelPlaylist: function (e, t, r, i) {
        var n, o, a = 0, s = 0, l = {type: null, version: null, url: t, fragments: [], live: !0, startSN: 0}, u = new T,
            c = 0, h = null, d = new M;
        for (P.lastIndex = 0; null !== (n = P.exec(e));) {
          var f, p, y = n[1];
          if (y) {
            d.duration = parseFloat(y);
            var m = (" " + n[2]).slice(1);
            d.title = m || null, d.tagList.push(m ? ["INF", y, m] : ["INF", y])
          } else if (n[3]) {
            isNaN(d.duration) || (f = a++, d.type = i, d.start = s, d.levelkey = u, d.sn = f, d.level = r, d.cc = c, d.baseurl = t, d.relurl = (" " + n[3]).slice(1), l.fragments.push(d), s += (h = d).duration, d = new M)
          } else if (n[4]) {
            d.rawByteRange = (" " + n[4]).slice(1), !h || (p = h.byteRangeEndOffset) && (d.lastByteRangeEndOffset = p)
          } else if (n[5]) d.rawProgramDateTime = (" " + n[5]).slice(1), d.tagList.push(["PROGRAM-DATE-TIME", d.rawProgramDateTime]), void 0 === l.programDateTime && (l.programDateTime = new Date(new Date(Date.parse(n[5])) - 1e3 * s)); else {
            for (n = n[0].match(C), o = 1; o < n.length && void 0 === n[o]; o++) ;
            var g = (" " + n[o + 1]).slice(1), b = (" " + n[o + 2]).slice(1);
            switch (n[o]) {
              case"#":
                d.tagList.push(b ? [g, b] : [g]);
                break;
              case"PLAYLIST-TYPE":
                l.type = g.toUpperCase();
                break;
              case"MEDIA-SEQUENCE":
                a = l.startSN = parseInt(g);
                break;
              case"TARGETDURATION":
                l.targetduration = parseFloat(g);
                break;
              case"VERSION":
                l.version = parseInt(g);
                break;
              case"EXTM3U":
                break;
              case"ENDLIST":
                l.live = !1;
                break;
              case"DIS":
                c++, d.tagList.push(["DIS"]);
                break;
              case"DISCONTINUITY-SEQ":
                c = parseInt(g);
                break;
              case"KEY":
                var v = new k(g), _ = v.enumeratedString("METHOD"), w = v.URI, S = v.hexadecimalInteger("IV");
                _ && (u = new T, w && 0 <= ["AES-128", "SAMPLE-AES"].indexOf(_) && (u.method = _, u.baseuri = t, u.reluri = w, u.key = null, u.iv = S));
                break;
              case"START":
                var E = new k(g).decimalFloatingPoint("TIME-OFFSET");
                isNaN(E) || (l.startTimeOffset = E);
                break;
              case"MAP":
                var x = new k(g);
                d.relurl = x.URI, d.rawByteRange = x.BYTERANGE, d.baseurl = t, d.level = r, d.type = i, d.sn = "initSegment", l.initSegment = d, d = new M;
                break;
              default:
                console.log("line parsed but not handled: " + n)
            }
          }
        }
        return (d = h) && !d.relurl && (l.fragments.pop(), s -= d.duration), l.totalduration = s, l.averagetargetduration = s / l.fragments.length, l.endSN = a - 1, l
      }, load: function (o, a) {
        var s = this;
        i.get(o, function (e) {
          var t, r, i, n = s.parseMasterPlaylist(e, o);
          n.length && (t = s.parseMasterPlaylistMedia(e, o, "AUDIO", n[0].audioCodec), r = s.parseMasterPlaylistMedia(e, o, "SUBTITLES"), t.length && (i = !1, t.forEach(function (e) {
            e.url || (i = !0)
          }), !1 === i && n[0].audioCodec && !n[0].attrs.AUDIO && (console.log("audio codec signaled in quality level, but no embedded audio track signaled, create one"), t.unshift({
            type: "main",
            name: "main"
          })))), a({levels: n, audioTracks: t, subtitles: r, url: o})
        }, function (e) {
          console.log(e)
        })
      }, resolve: function (e, t) {
        return n.buildAbsoluteURL(t, e, {alwaysNormalize: !0})
      }
    }, t.exports = o
  }, {"../io": 223, "./URLToolkit": 220, "./attrlist": 221}],
  223: [function (e, s, t) {
    var f = e("./url");
    s.exports.get = function (e, t, r, i, n) {
      s.exports.ajax("GET", e, {}, t, r, i, n)
    }, s.exports.post = function (e, t, r, i, n, o) {
      var a = {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", Accept: "application/json"};
      s.exports.ajax("POST", e, t, r, i, n, o, a)
    }, s.exports.postWithHeader = function (e, t, r, i, n) {
      s.exports.ajax("POST", e, t, i, n, !0, !1, r)
    }, s.exports.ajax = function (e, t, r, i, n, o, a, s) {
      var l, u, c, h;
      n = n || function () {
      }, "undefined" == typeof XMLHttpRequest && (window.XMLHttpRequest = function () {
        try {
          return new window.ActiveXObject("Msxml2.XMLHTTP.6.0")
        } catch (e) {
        }
        try {
          return new window.ActiveXObject("Msxml2.XMLHTTP.3.0")
        } catch (e) {
        }
        try {
          return new window.ActiveXObject("Msxml2.XMLHTTP")
        } catch (e) {
        }
        throw new Error("This browser does not support XMLHttpRequest.")
      }), u = new XMLHttpRequest, c = f.parseUrl(t), h = window.location, !(c.protocol + c.host !== h.protocol + h.host) || !window.XDomainRequest || "withCredentials" in u ? (l = "file:" == c.protocol || "file:" == h.protocol, u.onreadystatechange = function () {
        4 === u.readyState && (200 === u.status || l && 0 === u.status ? i : n)(u.responseText)
      }) : ((u = new window.XDomainRequest).onload = function () {
        i(u.responseText)
      }, u.onerror = n, u.onprogress = function () {
      }, u.ontimeout = n);
      try {
        if (void 0 === o && (o = !0), u.open(e, t, o), a && (u.withCredentials = !0), s) for (var d in s) s.hasOwnProperty(d) && u.setRequestHeader(d, s[d])
      } catch (e) {
        return void n(e)
      }
      try {
        u.send(r)
      } catch (e) {
        n(e)
      }
    }, s.exports.jsonp = function (e, t, r) {
      var i = "jsonp_callback_" + Math.round(1e5 * Math.random()), n = document.createElement("script");
      e && (n.src = e + (0 <= e.indexOf("?") ? "&" : "?") + "callback=" + i + "&cb=" + i, n.onerror = function () {
        delete window[i], document.body.removeChild(n), r()
      }, n.onload = function () {
        setTimeout(function () {
          window[i] && (delete window[i], document.body.removeChild(n))
        }, 0)
      }, window[i] = function (e) {
        delete window[i], document.body.removeChild(n), t(e)
      }, document.body.appendChild(n))
    }, s.exports.loadJS = function (e, t) {
      var r = document.getElementsByTagName("HEAD").item(0), i = document.createElement("script");
      e && e.toLowerCase().indexOf("https://") < 0 && (e = document.URL.replace(/(\/[^\/]*?)$/i, "") + e), i.type = "text/javascript", i.src = e, i.onload = function () {
        t && t()
      }, r.appendChild(i)
    }
  }, {"./url": 231}],
  224: [function (e, t, r) {
    var s = e("./dom");
    t.exports.render = function (e, t) {
      var r = t.align ? t.align : t.className ? "" : "tl", i = t.x ? t.x : 0, n = t.y ? t.y : 0,
          o = i.indexOf && 0 < i.indexOf("%") ? "" : "px", a = n.indexOf && 0 < n.indexOf("%") ? "" : "px";
      "tl" === r ? s.css(e, {
        "float": "left",
        "margin-left": i + o,
        "margin-top": n + a
      }) : "tr" === r ? s.css(e, {
        "float": "right",
        "margin-right": i + o,
        "margin-top": n + a
      }) : "tlabs" === r ? s.css(e, {
        position: "absolute",
        left: i + o,
        top: n + a
      }) : "trabs" === r ? s.css(e, {
        position: "absolute",
        right: i + o,
        top: n + a
      }) : "blabs" === r ? s.css(e, {
        position: "absolute",
        left: i + o,
        bottom: n + a
      }) : "brabs" === r ? s.css(e, {
        position: "absolute",
        right: i + o,
        bottom: n + a
      }) : "cc" === r && s.addClass(e, "loading-center")
    }
  }, {"./dom": 217}],
  225: [function (e, a, t) {
    var s = Object.prototype.hasOwnProperty;
    a.exports.create = Object.create || function (e) {
      function t() {
      }

      return t.prototype = e, new t
    }, a.exports.isArray = function (e) {
      return "[object Array]" === Object.prototype.toString.call(arg)
    }, a.exports.isEmpty = function (e) {
      for (var t in e) if (null !== e[t]) return !1;
      return !0
    }, a.exports.each = function (e, t, r) {
      if (a.exports.isArray(e)) for (var i = 0, n = e.length; i < n && !1 !== t.call(r || this, e[i], i); ++i) ; else for (var o in e) if (s.call(e, o) && !1 === t.call(r || this, o, e[o])) break;
      return e
    }, a.exports.merge = function (e, t) {
      if (!t) return e;
      for (var r in t) s.call(t, r) && (e[r] = t[r]);
      return e
    }, a.exports.deepMerge = function (e, t) {
      var r, i, n;
      for (r in e = a.exports.copy(e), t) s.call(t, r) && (i = e[r], n = t[r], a.exports.isPlain(i) && a.exports.isPlain(n) ? e[r] = a.exports.deepMerge(i, n) : e[r] = t[r]);
      return e
    }, a.exports.copy = function (e) {
      return a.exports.merge({}, e)
    }, a.exports.isPlain = function (e) {
      return !!e && "object" == typeof e && "[object Object]" === e.toString() && e.constructor === Object
    }, a.exports.isArray = Array.isArray || function (e) {
      return "[object Array]" === Object.prototype.toString.call(e)
    }, a.exports.unescape = function (e) {
      return e.replace(/&([^;]+);/g, function (e, t) {
        return {amp: "&", lt: "<", gt: ">", quot: '"', "#x27": "'", "#x60": "`"}[t.toLowerCase()] || e
      })
    }
  }, {}],
  226: [function (e, t, r) {
    var n = e("./object"), o = function () {
    };
    (o = function () {
    }).extend = function (e) {
      var t, r = (e = e || {}).init || e.init || this.prototype.init || this.prototype.init || function () {
      };
      for (var i in (((t = function () {
        r.apply(this, arguments)
      }).prototype = n.create(this.prototype)).constructor = t).extend = o.extend, t.create = o.create, e) e.hasOwnProperty(i) && (t.prototype[i] = e[i]);
      return t
    }, o.create = function () {
      var e = n.create(this.prototype);
      return this.apply(e, arguments), e
    }, t.exports = o
  }, {"./object": 225}],
  227: [function (e, p, t) {
    var y = e("./object"), r = e("../config"), i = e("./dom"), n = e("./cookie"), o = e("./constants"),
        a = e("../lang/index"), s = e("./ua"), m = e("../player/base/plugin/defaultemptycomponent"), g = {
          preload: !0,
          autoplay: !0,
          useNativeControls: !1,
          width: "100%",
          height: "300px",
          cover: "",
          from: "",
          trackLog: !0,
          logBatched: !0,
          isLive: !1,
          playsinline: !0,
          showBarTime: 5e3,
          rePlay: !1,
          liveRetry: 5,
          liveRetryInterval: 1,
          liveRetryStep: 0,
          vodRetry: 3,
          format: "",
          definition: "",
          defaultDefinition: "",
          loadDataTimeout: 20,
          waitingTimeout: 60,
          waitingBufferedTime: 3,
          delayLoadingShow: 1,
          controlBarForOver: !1,
          controlBarVisibility: "hover",
          enableSystemMenu: !1,
          qualitySort: "asc",
          x5_video_position: "normal",
          x5_type: "",
          x5_fullscreen: !1,
          x5_orientation: "landscape|portrait",
          x5LandscapeAsFullScreen: !0,
          autoPlayDelay: 0,
          autoPlayDelayDisplayText: "",
          useHlsPluginForSafari: !1,
          enableMSEForAndroid: !0,
          encryptType: 0,
          language: "zh-cn",
          languageTexts: {},
          mediaType: "video",
          outputType: "",
          playConfig: {},
          reAuthInfo: {},
          components: [],
          liveTimeShiftUrl: "",
          liveShiftSource: "",
          liveShiftTime: "",
          videoHeight: "100%",
          videoWidth: "100%",
          enableWorker: !0,
          authTimeout: "",
          enableMockFullscreen: !1,
          region: "cn-shanghai",
          debug: !1,
          progressMarkers: [],
          snapshotWatermark: {
            left: "500",
            top: "100",
            text: "",
            font: "16px \u5b8b\u4f53",
            fillColor: "#FFFFFF",
            strokeColor: "#FFFFFF"
          },
          liveStartTime: "",
          liveOverTime: "",
          enableStashBufferForFlv: !0,
          stashInitialSizeForFlv: 32,
          flvOption: {},
          hlsOption: {stopLoadAsPaused: !1},
          hlsLoadingTimeOut: 2e4,
          useHlsPlugOnMobile: !0,
          nudgeMaxRetry: 5,
          tracks: [],
          recreatePlayer: function () {
          },
          diagnosisButtonVisible: !0,
          _native: !0,
          hlsUriToken: "",
          thumbnailUrl: "",
          skinRes: "//" + r.domain + "/de/prismplayer-flash/" + r.flashVersion + "/atlas/defaultSkin"
        };
    p.exports.defaultH5Layout = [{name: "bigPlayButton", align: "blabs", x: 30, y: 80}, {
      name: "H5Loading",
      align: "cc"
    }, {name: "errorDisplay", align: "tlabs", x: 0, y: 0}, {name: "infoDisplay"}, {
      name: "tooltip",
      align: "blabs",
      x: 0,
      y: 50
    }, {name: "thumbnail"}, {
      name: "controlBar",
      align: "blabs",
      x: 0,
      y: 0,
      children: [{name: "progress", align: "blabs", x: 0, y: 44}, {
        name: "playButton",
        align: "tl",
        x: 15,
        y: 12
      }, {name: "timeDisplay", align: "tl", x: 10, y: 5}, {
        name: "fullScreenButton",
        align: "tr",
        x: 10,
        y: 12
      }, {name: "subtitle", align: "tr", x: 15, y: 12}, {name: "setting", align: "tr", x: 15, y: 12}, {
        name: "volume",
        align: "tr",
        x: 5,
        y: 10
      }]
    }], p.exports.defaultAudioLayout = [{
      name: "controlBar",
      align: "blabs",
      x: 0,
      y: 0,
      children: [{name: "progress", align: "blabs", x: 0, y: 44}, {
        name: "playButton",
        align: "tl",
        x: 15,
        y: 12
      }, {name: "timeDisplay", align: "tl", x: 10, y: 5}, {name: "volume", align: "tr", x: 5, y: 10}]
    }], p.exports.defaultFlashLayout = [{name: "bigPlayButton", align: "blabs", x: 30, y: 80}, {
      name: "controlBar",
      align: "blabs",
      x: 0,
      y: 0,
      children: [{name: "progress", align: "tlabs", x: 0, y: 0}, {
        name: "playButton",
        align: "tl",
        x: 15,
        y: 26
      }, {name: "nextButton", align: "tl", x: 10, y: 26}, {
        name: "timeDisplay",
        align: "tl",
        x: 10,
        y: 24
      }, {name: "fullScreenButton", align: "tr", x: 10, y: 25}, {
        name: "streamButton",
        align: "tr",
        x: 10,
        y: 23
      }, {name: "volume", align: "tr", x: 10, y: 25}]
    }, {
      name: "fullControlBar",
      align: "tlabs",
      x: 0,
      y: 0,
      children: [{name: "fullTitle", align: "tl", x: 25, y: 6}, {
        name: "fullNormalScreenButton",
        align: "tr",
        x: 24,
        y: 13
      }, {name: "fullTimeDisplay", align: "tr", x: 10, y: 12}, {name: "fullZoom", align: "cc"}]
    }], p.exports.canPlayType = function (e) {
      var t = document.createElement("video");
      return t.canPlayType ? t.canPlayType(e) : ""
    }, p.exports.canPlayHls = function () {
      return "" != p.exports.canPlayType("application/x-mpegURL")
    }, p.exports.isUsedHlsPluginOnMobile = function (e) {
      return !(!s.IS_MOBILE || !s.IS_CHROME && !s.IS_FIREFOX || !p.exports.isSupportHls())
    }, p.exports.isSafariUsedHlsPlugin = function (e) {
      return !!(s.os.pc && s.browser.safari && e)
    }, p.exports.hasUIComponent = function (e, t) {
      if (void 0 === e || !e || 0 == e.length) return !1;
      for (var r = 0, i = e.length; r < i; r++) {
        var n = e[r].name;
        if (n == t) return !0;
        if ("controlBar" == n) return p.exports.hasUIComponent(e[r].children, t)
      }
      return !1
    }, p.exports.validateSource = function (e) {
      return !0
    }, p.exports.supportH5Video = function () {
      return void 0 !== document.createElement("video").canPlayType
    }, p.exports.createWrapper = function (e) {
      var t = e.id, r = "string" == typeof t ? (0 === t.indexOf("#") && (t = t.slice(1)), i.el(t)) : t;
      if (!r || !r.nodeName) throw new TypeError("\u6ca1\u6709\u4e3a\u64ad\u653e\u5668\u6307\u5b9a\u5bb9\u5668");
      return p.exports.adjustContainerLayout(r, e), r
    }, p.exports.adjustContainerLayout = function (e, t) {
      t.width && !e.style.width && (e.style.width = t.width), t.height && !e.style.height && (e.style.height = t.height)
    }, p.exports.isSupportHls = function () {
      var e = window.MediaSource = window.MediaSource || window.WebKitMediaSource,
          t = window.SourceBuffer = window.SourceBuffer || window.WebKitSourceBuffer,
          r = e && "function" == typeof e.isTypeSupported && e.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"'),
          i = !t || t.prototype && "function" == typeof t.prototype.appendBuffer && "function" == typeof t.prototype.remove;
      return r && i
    }, p.exports.isSupportFlv = function () {
      return p.exports.isSupportHls()
    }, p.exports.isSupportMSE = function () {
      return !!window.Promise && !!window.Uint8Array && !!Array.prototype.forEach && p.exports.isSupportedMediaSource()
    }, p.exports.isSupportedMediaSource = function () {
      return !!window.MediaSource && !!MediaSource.isTypeSupported
    }, p.exports.isSupportedDrm = function () {
      return !!(window.MediaKeys && window.navigator && window.navigator.requestMediaKeySystemAccess && window.MediaKeySystemAccess && window.MediaKeySystemAccess.prototype.getConfiguration) && p.exports.isSupportMSE()
    }, p.exports.isAudio = function (e) {
      return e && 0 < e.toLowerCase().indexOf(".mp3")
    }, p.exports.isLiveShift = function (e) {
      return e.isLive && e.liveStartTime && e.liveOverTime
    }, p.exports.isHls = function (e) {
      return e && 0 < e.toLowerCase().indexOf(".m3u8")
    }, p.exports.isDash = function (e) {
      return e && 0 < e.toLowerCase().indexOf(".mpd")
    }, p.exports.isFlv = function (e) {
      return e && 0 < e.toLowerCase().indexOf(".flv")
    }, p.exports.isRTMP = function (e) {
      return e && -1 < e.toLowerCase().indexOf("rtmp:")
    }, p.exports.isRts = function (e) {
      return e && -1 < e.toLowerCase().indexOf("artc:")
    }, p.exports.checkSecuritSupport = function () {
      return p.exports.isSupportHls() ? "" : s.IS_IOS ? a.get("iOSNotSupportVodEncription") : a.get("UseChromeForVodEncription")
    }, p.exports.findSelectedStreamLevel = function (e, t) {
      var r = t;
      if (!r && !(r = n.get(o.SelectedStreamLevel))) return n.set(o.SelectedStreamLevel, e[0].definition, 365), 0;
      for (var i = 0; i < e.length; i++) if (e[i].definition == r) return i;
      return 0
    }, p.exports.handleOption = function (e, t) {
      p.exports.isRts(e.source) && (e.isLive = !0);
      var r, i = y.merge(y.copy(g), e), n = [{name: "fullScreenButton", align: "tr", x: 20, y: 12}, {
        name: "subtitle",
        align: "tr",
        x: 15,
        y: 12
      }, {name: "setting", align: "tr", x: 15, y: 12}, {name: "volume", align: "tr", x: 5, y: 10}], o = !1;
      if (e.useFlashPrism || p.exports.isRTMP(e.source) ? (o = !0, n = [{
        name: "liveIco",
        align: "tlabs",
        x: 15,
        y: 25
      }, {name: "fullScreenButton", align: "tr", x: 10, y: 25}, {
        name: "volume",
        align: "tr",
        x: 10,
        y: 25
      }]) : (r = p.exports.isLiveShift(i)) ? (n.push({
        name: "liveShiftProgress",
        align: "tlabs",
        x: 0,
        y: 0
      }), n.push({name: "playButton", align: "tl", x: 15, y: 12}), n.push({
        name: "liveDisplay",
        align: "tl",
        x: 15,
        y: 6
      })) : n.push({
        name: "liveDisplay",
        align: "tlabs",
        x: 15,
        y: 6
      }), e.isLive) if (void 0 === e.skinLayout && p.exports.isRts(e.source)) i.skinLayout = [{
        name: "errorDisplay",
        align: "tlabs",
        x: 0,
        y: 0
      }, {name: "infoDisplay"}, {name: "bigPlayButton", align: "blabs", x: 30, y: 80}, {
        name: "tooltip",
        align: "blabs",
        x: 0,
        y: 56
      }, {name: "H5Loading", align: "cc"}, {
        name: "controlBar",
        align: "blabs",
        x: 0,
        y: 0,
        children: [{name: "fullScreenButton", align: "tr", x: 20, y: 12}, {
          name: "volume",
          align: "tr",
          x: 5,
          y: 10
        }, {name: "liveDisplay", align: "tlabs", x: 15, y: 6}]
      }]; else if (void 0 === e.skinLayout) i.skinLayout = [{
        name: "errorDisplay",
        align: "tlabs",
        x: 0,
        y: 0
      }, {name: "infoDisplay"}, {name: "bigPlayButton", align: "blabs", x: 30, y: 80}, {
        name: "tooltip",
        align: "blabs",
        x: 0,
        y: 56
      }, {name: "H5Loading", align: "cc"}, {
        name: "controlBar",
        align: "blabs",
        x: 0,
        y: 0,
        children: n
      }]; else if (0 != e.skinLayout) {
        for (var a = e.skinLayout.length, s = [], l = -1, u = 0; u < a; u++) if ("controlBar" == i.skinLayout[u].name) {
          l = u;
          for (var c = i.skinLayout[u].children.length, h = 0; h < c; h++) {
            var d, f = i.skinLayout[u].children[h].name;
            "liveDisplay" != f && "liveIco" != f && "fullScreenButton" != f && "volume" != f && "snapshot" != f && "setting" != f && "subtitle" != f && (!r || "progress" != f && "playButton" != f && "timeDisplay" != f) || (d = i.skinLayout[u].children[h], "progress" == f ? d.name = "liveShiftProgress" : "timeDisplay" == f ? d.name = "liveShiftTimeDisplay" : o && "liveDisplay" == f && (d.name = "liveIco"), s.push(d))
          }
          break
        }
        -1 != l && (i.skinLayout[l].children = s)
      }
      return (void 0 === e.components || !e.components || y.isArray(e.components) && 0 == e.components.length) && "false" != e.components && (i.components = [m]), i
    }
  }, {
    "../config": 204,
    "../lang/index": 210,
    "../player/base/plugin/defaultemptycomponent": 262,
    "./constants": 214,
    "./cookie": 215,
    "./dom": 217,
    "./object": 225,
    "./ua": 230
  }],
  228: [function (e, t, r) {
    arguments[4][227][0].apply(r, arguments)
  }, {
    "../config": 204,
    "../lang/index": 210,
    "../player/base/plugin/defaultemptycomponent": 262,
    "./constants": 214,
    "./cookie": 215,
    "./dom": 217,
    "./object": 225,
    "./ua": 230,
    dup: 227
  }],
  229: [function (e, t, r) {
    t.exports.set = function (t, r) {
      try {
        window.localStorage && localStorage.setItem(t, r)
      } catch (e) {
        window[t + "_localStorage"] = r
      }
    }, t.exports.get = function (t) {
      try {
        if (window.localStorage) return localStorage.getItem(t)
      } catch (e) {
        return window[t + "_localStorage"]
      }
      return ""
    }
  }, {}],
  230: [function (e, k, t) {
    var r, i, n, o;
    if (k.exports.USER_AGENT = navigator.userAgent, k.exports.IS_IPHONE = /iPhone/i.test(k.exports.USER_AGENT), k.exports.IS_IPAD = /iPad/i.test(k.exports.USER_AGENT), k.exports.IS_IPOD = /iPod/i.test(k.exports.USER_AGENT), k.exports.IS_MAC = /mac/i.test(k.exports.USER_AGENT), k.exports.IS_EDGE = /Edge/i.test(k.exports.USER_AGENT), k.exports.IS_IE11 = /Trident\/7.0/i.test(k.exports.USER_AGENT), k.exports.IS_X5 = /qqbrowser/i.test(k.exports.USER_AGENT.toLowerCase()), k.exports.IS_CHROME = /Chrome/i.test(k.exports.USER_AGENT) && !k.exports.IS_EDGE && !k.exports.IS_X5, k.exports.IS_SAFARI = /Safari/i.test(k.exports.USER_AGENT) && !k.exports.IS_CHROME, k.exports.IS_FIREFOX = /Firefox/i.test(k.exports.USER_AGENT), document.all) try {
      var a = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
      k.exports.HAS_FLASH = !!a
    } catch (e) {
      k.exports.HAS_FLASH = !1
    } else navigator.plugins && 0 < navigator.plugins.length ? (a = navigator.plugins["Shockwave Flash"], k.exports.HAS_FLASH = !!a) : k.exports.HAS_FLASH = !1;
    k.exports.IS_MAC_SAFARI = k.exports.IS_MAC && k.exports.IS_SAFARI && !k.exports.IS_CHROME && !k.exports.HAS_FLASH, k.exports.IS_IOS = k.exports.IS_IPHONE || k.exports.IS_IPAD || k.exports.IS_IPOD, k.exports.IOS_VERSION = function () {
      var e = k.exports.USER_AGENT.match(/OS (\d+)_/i);
      if (e && e[1]) return e[1]
    }(), k.exports.IS_ANDROID = /Android/i.test(k.exports.USER_AGENT), k.exports.ANDROID_VERSION = (n = k.exports.USER_AGENT.match(/Android (\d+)(?:\.(\d+))?(?:\.(\d+))*/i)) ? (r = n[1] && parseFloat(n[1]), i = n[2] && parseFloat(n[2]), r && i ? parseFloat(n[1] + "." + n[2]) : r || null) : null, k.exports.IS_OLD_ANDROID = k.exports.IS_ANDROID && /webkit/i.test(k.exports.USER_AGENT) && k.exports.ANDROID_VERSION < 2.3, k.exports.TOUCH_ENABLED = !!("ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch), k.exports.IS_MOBILE = k.exports.IS_IOS || k.exports.IS_ANDROID, k.exports.IS_H5 = k.exports.IS_MOBILE || !k.exports.HAS_FLASH, k.exports.IS_PC = !k.exports.IS_MOBILE, k.exports.is_X5 = /micromessenger/i.test(k.exports.USER_AGENT) || /qqbrowser/i.test(k.exports.USER_AGENT), k.exports.getHost = function (e) {
      var t = "";
      if (void 0 === e || null == e || "" == e) return "";
      var r = e.indexOf("//"), i = e;
      -1 < r && (i = e.substring(r + 2));
      var t = i, n = i.split("/");
      return n && 0 < n.length && (t = n[0]), (n = t.split(":")) && 0 < n.length && (t = n[0]), t
    }, k.exports.dingTalk = function () {
      var e = k.exports.USER_AGENT.toLowerCase();
      return /dingtalk/i.test(e)
    }, k.exports.wechat = function () {
      var e = k.exports.USER_AGENT.toLowerCase();
      return /micromessenger/i.test(e)
    }, k.exports.inIFrame = function () {
      return self != top
    }, k.exports.getReferer = function () {
      var t = document.referrer;
      if (k.exports.inIFrame()) try {
        t = top.document.referrer
      } catch (e) {
        t = document.referrer
      }
      return t
    }, k.exports.getHref = function () {
      location.href;
      if (k.exports.inIFrame()) try {
        top.location.href
      } catch (e) {
        location.href
      }
      return location.href
    }, o = k.exports, function (e, t) {
      var r, i = this.os = {}, n = this.browser = {}, o = e.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
          a = e.match(/(Android);?[\s\/]+([\d.]+)?/), s = !!e.match(/\(Macintosh\; Intel /),
          l = e.match(/(iPad).*OS\s([\d_]+)/), u = e.match(/(iPod)(.*OS\s([\d_]+))?/),
          c = !l && e.match(/(iPhone\sOS)\s([\d_]+)/), h = e.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
          d = /Win\d{2}|Windows/.test(t), f = e.match(/Windows Phone ([\d.]+)/), p = h && e.match(/TouchPad/),
          y = e.match(/Kindle\/([\d.]+)/), m = e.match(/Silk\/([\d._]+)/),
          g = e.match(/(BlackBerry).*Version\/([\d.]+)/), b = e.match(/(BB10).*Version\/([\d.]+)/),
          v = e.match(/(RIM\sTablet\sOS)\s([\d.]+)/), _ = e.match(/PlayBook/),
          w = e.match(/Chrome\/([\d.]+)/) || e.match(/CriOS\/([\d.]+)/), S = e.match(/Firefox\/([\d.]+)/),
          E = e.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
          x = e.match(/MSIE\s([\d.]+)/) || e.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
          T = !w && e.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
          M = T || e.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);
      (n.webkit = !!o) && (n.version = o[1]), a && (i.android = !0, i.version = a[2]), c && !u && (i.ios = i.iphone = !0, i.version = c[2].replace(/_/g, ".")), l && (i.ios = i.ipad = !0, i.version = l[2].replace(/_/g, ".")), u && (i.ios = i.ipod = !0, i.version = u[3] ? u[3].replace(/_/g, ".") : null), f && (i.wp = !0, i.version = f[1]), h && (i.webos = !0, i.version = h[2]), p && (i.touchpad = !0), g && (i.blackberry = !0, i.version = g[2]), b && (i.bb10 = !0, i.version = b[2]), v && (i.rimtabletos = !0, i.version = v[2]), _ && (n.playbook = !0), y && (i.kindle = !0, i.version = y[1]), m && (n.silk = !0, n.version = m[1]), !m && i.android && e.match(/Kindle Fire/) && (n.silk = !0), w && (n.chrome = !0, n.version = w[1]), S && (n.firefox = !0, n.version = S[1]), E && (i.firefoxos = !0, i.version = E[1]), x && (n.ie = !0, n.version = x[1]), M && (s || i.ios || d || a) && (n.safari = !0, i.ios || (n.version = M[1])), T && (n.webview = !0), !s || (r = e.match(/[\d]*_[\d]*_[\d]*/)) && 0 < r.length && r[0] && (i.version = r[0].replace(/_/g, ".")), i.tablet = !!(l || _ || a && !e.match(/Mobile/) || S && e.match(/Tablet/) || x && !e.match(/Phone/) && e.match(/Touch/)), i.phone = !(i.tablet || i.ipod || !(a || c || h || g || b || w && e.match(/Android/) || w && e.match(/CriOS\/([\d.]+)/) || S && e.match(/Mobile/) || x && e.match(/Touch/))), i.pc = !i.tablet && !i.phone, s ? i.name = "macOS" : d ? (i.name = "windows", i.version = function () {
        var e = navigator.userAgent, t = "";
        (-1 < e.indexOf("Windows NT 5.0") || -1 < e.indexOf("Windows 2000")) && (t = "2000");
        (-1 < e.indexOf("Windows NT 5.1") || -1 < e.indexOf("Windows XP")) && (t = "XP");
        (-1 < e.indexOf("Windows NT 5.2") || -1 < e.indexOf("Windows 2003")) && (t = "2003");
        (-1 < e.indexOf("Windows NT 6.0") || -1 < e.indexOf("Windows Vista")) && (t = "Vista");
        (-1 < e.indexOf("Windows NT 6.1") || -1 < e.indexOf("Windows 7")) && (t = "7");
        (-1 < e.indexOf("Windows NT 6.2") || -1 < e.indexOf("Windows 8")) && (t = "8");
        (-1 < e.indexOf("Windows NT 6.3") || -1 < e.indexOf("Windows 8.1")) && (t = "8.1");
        (-1 < e.indexOf("Windows NT 10") || -1 < e.indexOf("Windows 10")) && (t = "10");
        return t
      }()) : i.name = function () {
        var e = navigator.userAgent, t = "other", r = k.exports.os;
        if (r.ios) return "iOS";
        if (r.android) return "android";
        if (-1 < e.indexOf("Baiduspider")) return "Baiduspider";
        if (-1 < e.indexOf("PlayStation")) return "PS4";
        var i = "Win32" == navigator.platform || "Windows" == navigator.platform || -1 < e.indexOf("Windows"),
            n = "Mac68K" == navigator.platform || "MacPPC" == navigator.platform || "Macintosh" == navigator.platform || "MacIntel" == navigator.platform;
        n && (t = "macOS");
        "X11" != navigator.platform || i || n || (t = "Unix");
        -1 < String(navigator.platform).indexOf("Linux") && (t = "Linux");
        if (i) return "windows";
        return t
      }(), n.name = function () {
        var e = navigator.userAgent.toLowerCase(), t = k.exports.browser;
        {
          if (t.firefox) return "Firefox";
          if (t.ie) return /edge/.test(e) ? "Edge" : "IE";
          if (/micromessenger/.test(e)) return "\u5fae\u4fe1\u5185\u7f6e\u6d4f\u89c8\u5668";
          if (/qqbrowser/.test(e)) return "QQ\u6d4f\u89c8\u5668";
          if (t.webview) return "webview";
          if (t.chrome) return "Chrome";
          if (t.safari) return "Safari";
          if (/baiduspider/.test(e)) return "Baiduspider";
          if (/ucweb/.test(e) || /UCBrowser/.test(e)) return "UC";
          if (/opera/.test(e)) return "Opera";
          if (/ucweb/.test(e)) return "UC";
          if (/360se/.test(e)) return "360\u6d4f\u89c8\u5668";
          if (/bidubrowser/.test(e)) return "\u767e\u5ea6\u6d4f\u89c8\u5668";
          if (/metasr/.test(e)) return "\u641c\u72d7\u6d4f\u89c8\u5668";
          if (/lbbrowser/.test(e)) return "\u730e\u8c79\u6d4f\u89c8\u5668";
          if (/playstation/.test(e)) return "PS4\u6d4f\u89c8\u5668"
        }
      }()
    }.call(o, navigator.userAgent, navigator.platform)
  }, {}],
  231: [function (e, t, r) {
    var s = e("./dom");
    t.exports.getAbsoluteURL = function (e) {
      return e.match(/^https?:\/\//) || (e = s.createEl("div", {innerHTML: '<a href="' + e + '">x</a>'}).firstChild.href), e
    }, t.exports.parseUrl = function (e) {
      var t, r, i = ["protocol", "hostname", "port", "pathname", "search", "hash", "host"],
          n = s.createEl("a", {href: e}), o = "" === n.host && "file:" !== n.protocol;
      o && ((t = s.createEl("div")).innerHTML = '<a href="' + e + '"></a>', n = t.firstChild, t.setAttribute("style", "display:none; position:absolute;"), document.body.appendChild(t)), r = {};
      for (var a = 0; a < i.length; a++) r[i[a]] = n[i[a]];
      return r.segments = n.pathname.replace(/^\//, "").split("/"), o && document.body.removeChild(t), r
    }
  }, {"./dom": 217}],
  232: [function (e, i, t) {
    var r = e("./dom"), n = e("./ua"), o = e("./playerutil");
    i.exports.formatTime = function (e) {
      var t, r, i = Math.floor(e), n = Math.floor(i / 3600);
      return i %= 3600, t = Math.floor(i / 60), r = i % 60, !(n === 1 / 0 || isNaN(n) || t === 1 / 0 || isNaN(t) || r === 1 / 0 || isNaN(r)) && ("00" === (n = 10 <= n ? n : "0" + n) ? "" : n + ":") + (t = 10 <= t ? t : "0" + t) + ":" + (r = 10 <= r ? r : "0" + r)
    }, i.exports.extractTime = function (e) {
      if (e) {
        var t = parseInt(e.getHours()), r = parseInt(e.getMinutes()), i = parseInt(e.getSeconds());
        return ("00" === (t = 10 <= t ? t : "0" + t) ? "" : t + ":") + (r = 10 <= r ? r : "0" + r) + ":" + (i = 10 <= i ? i : "0" + i)
      }
      return ""
    }, i.exports.convertToTimestamp = function (e, t) {
      var r = "";
      return e && (t ? r = e.gettime() : (r = Date.parse(e), r /= 1e3)), r
    }, i.exports.convertToDate = function (e, t) {
      var r = "";
      return e && (r = new Date).setTime(1e3 * e), r
    }, i.exports.parseTime = function (e) {
      if (!e) return "00:00:00";
      var t = e.split(":"), r = 0, i = 0, n = 0;
      return 3 === t.length ? (r = t[0], i = t[1], n = t[2]) : 2 === t.length ? (i = t[0], n = t[1]) : 1 === t.length && (n = t[0]), 3600 * (r = parseInt(r, 10)) + 60 * (i = parseInt(i, 10)) + (n = Math.ceil(parseFloat(n)))
    }, i.exports.formatDate = function (e, t) {
      var r = {
        "M+": e.getMonth() + 1,
        "d+": e.getDate(),
        "H+": e.getHours(),
        "m+": e.getMinutes(),
        "s+": e.getSeconds(),
        "q+": Math.floor((e.getMonth() + 3) / 3),
        S: e.getMilliseconds()
      };
      for (var i in /(y+)/.test(t) && (t = t.replace(RegExp.$1, (e.getFullYear() + "").substr(4 - RegExp.$1.length))), r) new RegExp("(" + i + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? r[i] : ("00" + r[i]).substr(("" + r[i]).length)));
      return t
    }, i.exports.sleep = function (e) {
      for (var t = Date.now(); Date.now() - t <= e;) ;
    }, i.exports.htmlEncodeAll = function (e) {
      return null == e ? "" : e.replace(/\</g, "&lt;").replace(/\>/g, "&gt;").replace(/\&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
    }, i.exports.toBinary = function (e) {
      if (!window.atob) return "";
      for (var t = atob(e), r = t.length, i = new Uint8Array(r), n = 0; n < r; n++) i[n] = t.charCodeAt(n);
      return i
    }, i.exports.readyBinary = function (e) {
      for (var t = new Uint8Array(e), r = t.length, i = "", n = 0; n < r; n++) i += t[n];
      return i
    }, i.exports.delayHide = function (e, t) {
      e && (void 0 === t && (t = 1e3), e.delayHanlder && clearTimeout(e.delayHanlder), e.delayHanlder = setTimeout(function () {
        r.css(e, "display", "none")
      }, t))
    }, i.exports.openInFile = function () {
      return -1 != window.location.protocol.toLowerCase().indexOf("file")
    }, i.exports.contentProtocolMixed = function (e) {
      return !!(n.os.pc && (o.isHls(e) && !n.browser.safari || o.isFlv(e)) && "https:" == window.location.protocol.toLowerCase() && e && -1 < e.toLowerCase().indexOf("http://"))
    }, i.exports.queryString = function (e) {
      var t, r, i, n, o;
      return 2 !== (r = (e = decodeURIComponent(e)).split("?")).length ? {} : (o = r[1], (t = o.split("&")) ? (i = {}, n = 0, $(t).each(function () {
        var e = t[n].split("=");
        2 === e.length && (i[e[0]] = e[1].replace(/\+/g, " ")), n++
      }), i) : {})
    }, i.exports.log = function (e) {
      var t = window.location.href, r = i.exports.queryString(t);
      r && 1 == r.debug && console.log(e)
    }
  }, {"./dom": 217, "./playerutil": 228, "./ua": 230}],
  233: [function (e, t, r) {
    function s(e) {
      for (var t = 5381, r = e.length; r;) t = 33 * t ^ e.charCodeAt(--r);
      return (t >>> 0).toString()
    }

    var l = e("./vttparse"), i = {
      parse: function (e, t, r) {
        var i, n = e.trim().replace(/\r\n|\n\r|\n|\r/g, "\n").split("\n"), o = [], a = new l;
        a.oncue = function (e) {
          e.id = s(e.startTime) + s(e.endTime) + s(e.text), e.text = decodeURIComponent(escape(e.text)), e.isBig = !1;
          var t, r = e.text.split("#xywh=");
          2 == r.length && (t = r[1].split(","), e.x = t[0], e.y = t[1], e.w = t[2], e.h = t[3], e.isBig = !0), 0 < e.endTime && o.push(e)
        }, a.onparsingerror = function (e) {
          i = e
        }, a.onflush = function () {
          if (i && r) return r(i), void console.log(i);
          t(o)
        }, n.forEach(function (e) {
          a.parse(e + "\n")
        }), a.flush()
      }
    };
    t.exports = i
  }, {"./vttparse": 235}],
  234: [function (e, t, r) {
    t.exports = function () {
      if ("undefined" != typeof window && window.VTTCue) return window.VTTCue;
      var _ = {"": !0, lr: !0, rl: !0}, t = {start: !0, middle: !0, end: !0, left: !0, right: !0};

      function w(e) {
        return "string" == typeof e && (!!t[e.toLowerCase()] && e.toLowerCase())
      }

      function S(e) {
        for (var t = 1; t < arguments.length; t++) {
          var r = arguments[t];
          for (var i in r) e[i] = r[i]
        }
        return e
      }

      function e(e, t, r) {
        var i = this, n = function () {
          if ("undefined" != typeof navigator) return /MSIE\s8\.0/.test(navigator.userAgent)
        }(), o = {};
        n ? i = document.createElement("custom") : o.enumerable = !0, i.hasBeenReset = !1;
        var a = "", s = !1, l = e, u = t, c = r, h = null, d = "", f = !0, p = "auto", y = "start", m = 50,
            g = "middle", b = 50, v = "middle";
        if (Object.defineProperty(i, "id", S({}, o, {
          get: function () {
            return a
          }, set: function (e) {
            a = "" + e
          }
        })), Object.defineProperty(i, "pauseOnExit", S({}, o, {
          get: function () {
            return s
          }, set: function (e) {
            s = !!e
          }
        })), Object.defineProperty(i, "startTime", S({}, o, {
          get: function () {
            return l
          }, set: function (e) {
            if ("number" != typeof e) throw new TypeError("Start time must be set to a number.");
            l = e, this.hasBeenReset = !0
          }
        })), Object.defineProperty(i, "endTime", S({}, o, {
          get: function () {
            return u
          }, set: function (e) {
            if ("number" != typeof e) throw new TypeError("End time must be set to a number.");
            u = e, this.hasBeenReset = !0
          }
        })), Object.defineProperty(i, "text", S({}, o, {
          get: function () {
            return c
          }, set: function (e) {
            c = "" + e, this.hasBeenReset = !0
          }
        })), Object.defineProperty(i, "region", S({}, o, {
          get: function () {
            return h
          }, set: function (e) {
            h = e, this.hasBeenReset = !0
          }
        })), Object.defineProperty(i, "vertical", S({}, o, {
          get: function () {
            return d
          }, set: function (e) {
            var t, r = "string" == typeof (t = e) && !!_[t.toLowerCase()] && t.toLowerCase();
            if (!1 === r) throw new SyntaxError("An invalid or illegal string was specified.");
            d = r, this.hasBeenReset = !0
          }
        })), Object.defineProperty(i, "snapToLines", S({}, o, {
          get: function () {
            return f
          }, set: function (e) {
            f = !!e, this.hasBeenReset = !0
          }
        })), Object.defineProperty(i, "line", S({}, o, {
          get: function () {
            return p
          }, set: function (e) {
            if ("number" != typeof e && "auto" !== e) throw new SyntaxError("An invalid number or illegal string was specified.");
            p = e, this.hasBeenReset = !0
          }
        })), Object.defineProperty(i, "lineAlign", S({}, o, {
          get: function () {
            return y
          }, set: function (e) {
            var t = w(e);
            if (!t) throw new SyntaxError("An invalid or illegal string was specified.");
            y = t, this.hasBeenReset = !0
          }
        })), Object.defineProperty(i, "position", S({}, o, {
          get: function () {
            return m
          }, set: function (e) {
            if (e < 0 || 100 < e) throw new Error("Position must be between 0 and 100.");
            m = e, this.hasBeenReset = !0
          }
        })), Object.defineProperty(i, "positionAlign", S({}, o, {
          get: function () {
            return g
          }, set: function (e) {
            var t = w(e);
            if (!t) throw new SyntaxError("An invalid or illegal string was specified.");
            g = t, this.hasBeenReset = !0
          }
        })), Object.defineProperty(i, "size", S({}, o, {
          get: function () {
            return b
          }, set: function (e) {
            if (e < 0 || 100 < e) throw new Error("Size must be between 0 and 100.");
            b = e, this.hasBeenReset = !0
          }
        })), Object.defineProperty(i, "align", S({}, o, {
          get: function () {
            return v
          }, set: function (e) {
            var t = w(e);
            if (!t) throw new SyntaxError("An invalid or illegal string was specified.");
            v = t, this.hasBeenReset = !0
          }
        })), i.displayState = void 0, n) return i
      }

      return e.prototype.getCueAsHTML = function () {
        return window.WebVTT.convertCueToDOMTree(window, this.text)
      }, e
    }()
  }, {}],
  235: [function (e, t, r) {
    function i() {
      return {
        decode: function (e) {
          if (!e) return "";
          if ("string" != typeof e) throw new Error("Error - expected string data.");
          return decodeURIComponent(encodeURIComponent(e))
        }
      }
    }

    var s = e("./vttcue");

    function n() {
      this.window = window, this.state = "INITIAL", this.buffer = "", this.decoder = new i, this.regionList = []
    }

    function l() {
      this.values = Object.create(null)
    }

    function u(e, t, r, i) {
      var n, o = i ? e.split(i) : [e];
      for (var a in o) {
        "string" == typeof o[a] && (2 === (n = o[a].split(r)).length && t(n[0], n[1]))
      }
    }

    l.prototype = {
      set: function (e, t) {
        this.get(e) || "" === t || (this.values[e] = t)
      }, get: function (e, t, r) {
        return r ? this.has(e) ? this.values[e] : t[r] : this.has(e) ? this.values[e] : t
      }, has: function (e) {
        return e in this.values
      }, alt: function (e, t, r) {
        for (var i = 0; i < r.length; ++i) if (t === r[i]) {
          this.set(e, t);
          break
        }
      }, integer: function (e, t) {
        /^-?\d+$/.test(t) && this.set(e, parseInt(t, 10))
      }, percent: function (e, t) {
        return !!(t.match(/^([\d]{1,3})(\.[\d]*)?%$/) && 0 <= (t = parseFloat(t)) && t <= 100) && (this.set(e, t), !0)
      }
    };
    var c = new s(0, 0, 0), h = "middle" === c.align ? "middle" : "center";

    function d(t, e, a) {
      var r = t;

      function i() {
        var e = function (e) {
          function t(e, t, r, i) {
            return 3600 * (0 | e) + 60 * (0 | t) + (0 | r) + (0 | i) / 1e3
          }

          var r = e.match(/^(\d+):(\d{2})(:\d{2})?(\.\d{3})?/);
          if (!r) return null;
          var i = (i = r[4]) && i.replace(".", "");
          return r[3] ? t(r[1], r[2], r[3].replace(":", ""), i) : 59 < r[1] ? t(r[1], r[2], 0, i) : t(0, r[1], r[2], i)
        }(t);
        if (null === e) throw new Error("Malformed timestamp: " + r);
        return t = t.replace(/^[^\sa-zA-Z-]+/, ""), e
      }

      function n() {
        t = t.replace(/^\s+/, "")
      }

      if (n(), e.startTime = i(), n(), "--\x3e" !== t.substr(0, 3)) throw new Error("Malformed time stamp (time stamps must be separated by '--\x3e'): " + r);
      t = t.substr(3), n(), e.endTime = i(), n(), function (e, t) {
        var o = new l;
        u(e, function (e, t) {
          switch (e) {
            case"region":
              for (var r = a.length - 1; 0 <= r; r--) if (a[r].id === t) {
                o.set(e, a[r].region);
                break
              }
              break;
            case"vertical":
              o.alt(e, t, ["rl", "lr"]);
              break;
            case"line":
              var i = t.split(","), n = i[0];
              o.integer(e, n), o.percent(e, n) && o.set("snapToLines", !1), o.alt(e, n, ["auto"]), 2 === i.length && o.alt("lineAlign", i[1], ["start", h, "end"]);
              break;
            case"position":
              i = t.split(","), o.percent(e, i[0]), 2 === i.length && o.alt("positionAlign", i[1], ["start", h, "end", "line-left", "line-right", "auto"]);
              break;
            case"size":
              o.percent(e, t);
              break;
            case"align":
              o.alt(e, t, ["start", h, "end", "left", "right"])
          }
        }, /:/, /\s/), t.region = o.get("region", null), t.vertical = o.get("vertical", "");
        var r = o.get("line", "auto");
        "auto" === r && -1 === c.line && (r = -1), t.line = r, t.lineAlign = o.get("lineAlign", "start"), t.snapToLines = o.get("snapToLines", !0), t.size = o.get("size", 100), t.align = o.get("align", h);
        var i = o.get("position", "auto");
        "auto" === i && 50 === c.position && (i = "start" === t.align || "left" === t.align ? 0 : "end" === t.align || "right" === t.align ? 100 : 50), t.position = i
      }(t, e)
    }

    n.prototype = {
      parse: function (e) {
        var t, i = this;

        function r() {
          for (var e = i.buffer, t = 0, e = e.replace(/<br(?: \/)?>/gi, "\n"); t < e.length && "\r" !== e[t] && "\n" !== e[t];) ++t;
          var r = e.substr(0, t);
          return "\r" === e[t] && ++t, "\n" === e[t] && ++t, i.buffer = e.substr(t), r
        }

        e && (i.buffer += i.decoder.decode(e, {stream: !0}));
        try {
          if ("INITIAL" === i.state) {
            if (!/\r\n|\n/.test(i.buffer)) return this;
            var n = (t = r()).match(/^WEBVTT([ \t].*)?$/);
            if (!n || !n[0]) throw new Error("Malformed WebVTT signature.");
            i.state = "HEADER"
          }
          for (var o = !1; i.buffer;) {
            if (!/\r\n|\n/.test(i.buffer)) return this;
            switch (o ? o = !1 : t = r(), i.state) {
              case"HEADER":
                /:/.test(t) ? u(t, function (e, t) {
                  switch (e) {
                    case"Region":
                      console.log("parse region", t)
                  }
                }, /:/) : t || (i.state = "ID");
                continue;
              case"NOTE":
                t || (i.state = "ID");
                continue;
              case"ID":
                if (/^NOTE($|[ \t])/.test(t)) {
                  i.state = "NOTE";
                  break
                }
                if (!t) continue;
                if (i.cue = new s(0, 0, ""), i.state = "CUE", -1 === t.indexOf("--\x3e")) {
                  i.cue.id = t;
                  continue
                }
              case"CUE":
                try {
                  d(t, i.cue, i.regionList)
                } catch (e) {
                  i.cue = null, i.state = "BADCUE";
                  continue
                }
                i.state = "CUETEXT";
                continue;
              case"CUETEXT":
                var a = -1 !== t.indexOf("--\x3e");
                if (!t || a && (o = !0)) {
                  i.oncue && i.oncue(i.cue), i.cue = null, i.state = "ID";
                  continue
                }
                i.cue.text && (i.cue.text += "\n"), i.cue.text += t;
                continue;
              case"BADCUE":
                t || (i.state = "ID");
                continue
            }
          }
        } catch (e) {
          "CUETEXT" === i.state && i.cue && i.oncue && i.oncue(i.cue), i.cue = null, i.state = "INITIAL" === i.state ? "BADWEBVTT" : "BADCUE"
        }
        return this
      }, flush: function () {
        try {
          if (this.buffer += this.decoder.decode(), !this.cue && "HEADER" !== this.state || (this.buffer += "\n\n", this.parse()), "INITIAL" === this.state) throw new Error("Malformed WebVTT signature.")
        } catch (e) {
          throw e
        }
        return this.onflush && this.onflush(), this
      }
    }, t.exports = n
  }, {"./vttcue": 234}],
  236: [function (e, t, r) {
    var n = e("../lib/io");
    e("../lib/storage");

    function i(e) {
      this._uploadDuration = e.logDuration || 5, this._uploadCount = e.logCount || 10, this._logReportTo = e.logReportTo, this._logs = [], this._retry = 0, this._disposed = !1, this._supportLocalStorage = !0;
      var t, r = this;
      window && (window.onbeforeunload = function (e) {
        0 < r._logs.length && (r._supportLocalStorage ? localStorage.setItem("__aliplayer_log_data", JSON.stringify(r._logs)) : (r._report(), function (e) {
          for (var t = (new Date).getTime(), r = t; r < t + e;) r = (new Date).getTime()
        }(500)))
      });
      try {
        localStorage ? (t = localStorage.getItem("__aliplayer_log_data"), localStorage.removeItem("__aliplayer_log_data"), t && (this._logs = JSON.parse(t))) : this._supportLocalStorage = !1
      } catch (e) {
        this._supportLocalStorage = !1
      }
      this._start()
    }

    i.prototype.add = function (e) {
      var t = this._logs.length;
      if (e.__time__ = Math.round(new Date / 1e3), 0 < t && "4001" == e.e) {
        var r = this._logs[t - 1];
        if ("4001" == r.e && r.__time__ - e.__time__ < 5) return
      }
      this._logs.push(e), (this._logs.length > this._uploadCount || "4001" == e.e || "2002" == e.e) && this._report()
    }, i.prototype.dispose = function () {
      this._report(), this._disposed = !0
    }, i.prototype._start = function () {
      this._disposed = !1;
      this._retry = 0, this._report()
    }, i.prototype._report = function (t) {
      var e, r, i;
      this._tickHandler && (clearTimeout(this._tickHandler), this._tickHandler = null), 0 < (t = t || this._logs.splice(0, this._uploadCount)).length ? (e = JSON.stringify({
        __logs__: t,
        __source__: ""
      }), r = this, i = {
        "Content-Type": "application/json;charset=UTF-8",
        "x-log-apiversion": "0.6.0",
        "x-log-bodyrawsize": e.length
      }, n.postWithHeader(this._logReportTo, e, i, function (e) {
        r._tick()
      }, function (e) {
        0 == r._retry ? (r._retry = 1, r._report(t)) : r._tick()
      })) : this._tick()
    }, i.prototype._tick = function () {
      var e;
      this._disposed || (this._retry = 0, (e = this)._logs.length > this._uploadCount ? e._report() : this._tickHandler = setTimeout(function () {
        e._report()
      }, 1e3 * this._uploadDuration))
    }, t.exports = i
  }, {"../lib/io": 223, "../lib/storage": 229}],
  237: [function (e, t, r) {
    var i = e("../lib/oo"), u = e("../lib/object"), b = e("../lib/data"), c = e("../lib/io"), v = e("../lib/ua"),
        _ = e("../config"), n = e("../player/base/event/eventtype"), w = e("./util"), S = e("./log"), o = 0, h = {
          STARTFETCHDATA: 1003,
          COMPLETEFETCHDATA: 1004,
          PREPARE: 1101,
          PREPAREEND: 1102,
          STARTPLAY: 2e3,
          PLAY: 2001,
          STOP: 2002,
          PAUSE: 2003,
          SEEK: 2004,
          FULLSREEM: 2005,
          QUITFULLSCREEM: 2006,
          RESOLUTION: 2007,
          RESOLUTION_DONE: 2008,
          RECOVER: 2010,
          SEEK_END: 2011,
          FETCHEDIP: 2020,
          CDNDETECT: 2021,
          DETECT: 2022,
          UNDERLOAD: 3002,
          LOADED: 3001,
          HEARTBEAT: 9001,
          ERROR: 4001,
          ERRORRETRY: 4002,
          SNAPSHOT: 2027,
          ROTATE: 2028,
          IMAGE: 2029,
          THUMBNAILSTART: 2031,
          THUMBNAILCOMPLETE: 2032,
          CCSTART: 2033,
          CCCOMPLETE: 2034,
          AUDIOTRACKSTART: 2033,
          AUDIOTRACKCOMPLETE: 2034
        }, a = i.extend({
          init: function (e, t, r) {
            void 0 === r && (r = !0), this.trackLog = r, this.player = e, this.requestId = "", this.sessionId = b.guid(), this.playId = 0, this.firstPlay = !0, this.osName = v.os.name, this.osVersion = v.os.version || "", this.exName = v.browser.name, this.exVersion = v.browser.version || "", this._logService = "", t.logBatched && (this._logService = new S(_));
            var i = this.player.getOptions(), n = t.from ? t.from : "", o = (i.isLive, i.isLive ? "live" : "vod"), a = "pc";
            v.IS_IPAD ? a = "pad" : v.os.phone && (a = "phone");
            var s = this.encodeURL(v.getReferer()), l = v.getHref(), u = this.encodeURL(l), c = "";
            l && (c = v.getHost(l));
            var h = _.h5Version, d = w.getUuid(), f = i.source ? this.encodeURL(i.source) : "", p = v.getHost(i.source),
                y = i.userId ? i.userId + "" : "0", m = this.sessionId, g = (new Date).getTime();
            this._userNetInfo = {cdnIp: "", localIp: ""};
            this.opt = {
              APIVersion: "0.6.0",
              t: g,
              ll: "info",
              lv: "1.0",
              pd: "player",
              md: "saas_player",
              ui: "saas_player",
              sm: "play",
              os: this.osName,
              ov: this.osVersion,
              et: this.exName,
              ev: this.exVersion,
              uat: v.USER_AGENT,
              hn: "0.0.0.0",
              bi: n,
              ri: m,
              e: "0",
              args: "0",
              vt: o,
              tt: a,
              dm: "h5",
              av: h,
              uuid: d,
              vu: f,
              vd: p,
              ua: y,
              dn: "custom",
              cdn_ip: "0.0.0.0",
              app_n: c,
              r: s,
              pu: u
            }, this.bindEvent()
          }, updateVideoInfo: function (e) {
            var t = e.from ? e.from : "";
            this.opt.bi = t + "", this.updateSourceInfo()
          }, updateSourceInfo: function () {
            var e, t, r = this.player.getOptions();
            r && (e = r.source ? this.encodeURL(r.source) : "", t = v.getHost(r.source), this.opt.vu = e, this.opt.vd = t)
          }, replay: function () {
            this.reset(), this.player.trigger(n.Video.LoadStart), this.player.trigger(n.Video.LoadedMetadata), this.player.trigger(n.Video.LoadedData)
          }, bindEvent: function () {
            var t = this;
            this.player.on(n.Player.Init, function () {
              t._onPlayerInit()
            }), this.player.on(n.Video.LoadStart, function () {
              t._onPlayerloadstart()
            }), this.player.on(n.Video.LoadedMetadata, function () {
              t._onPlayerLoadMetadata()
            }), this.player.on(n.Video.LoadedData, function () {
              t._onPlayerLoaddata()
            }), this.player.on(n.Video.Play, function () {
              t._onPlayerPlay()
            }), this.player.on(n.Video.Playing, function () {
              t._onPlayerReady()
            }), this.player.on(n.Video.Ended, function () {
              t._onPlayerFinish()
            }), this.player.on(n.Video.Pause, function () {
              t._onPlayerPause()
            }), this.player.on(n.Private.SeekStart, function (e) {
              t._onPlayerSeekStart(e)
            }), this.player.on(n.Private.EndStart, function (e) {
              t._seekEndData = e.paramData
            }), this.player.on(n.Player.Waiting, function () {
              t._waitingDelayLoadingShowHandle && (clearTimeout(t._waitingDelayLoadingShowHandle), t._waitingDelayLoadingShowHandle = null), t._waitingDelayLoadingShowHandle = setTimeout(function () {
                t._onPlayerLoaded()
              }, 1e3 * t.player._options.delayLoadingShow)
            }), this.player.on(n.Video.CanPlayThrough, function () {
            }), this.player.on(n.Video.CanPlay, function () {
              t._waitingDelayLoadingShowHandle && (clearTimeout(t._waitingDelayLoadingShowHandle), t._waitingDelayLoadingShowHandle = null), t._onPlayerUnderload(), t._onPlayerCanplay()
            }), this.player.on(n.Video.TimeUpdate, function () {
              t._waitingDelayLoadingShowHandle && (clearTimeout(t._waitingDelayLoadingShowHandle), t._waitingDelayLoadingShowHandle = null), t._seekEndData && t.player._seeking && t._onPlayerSeekEnd()
            }), this.player.on(n.Player.Error, function () {
              t._onPlayerError()
            }), this.player.on(n.Player.RequestFullScreen, function () {
              t._onFullscreenChange(1)
            }), this.player.on(n.Player.CancelFullScreen, function () {
              t._onFullscreenChange(0)
            }), this.player.on(n.Private.PREPARE, function (e) {
              t._prepareTime = (new Date).getTime(), t._log("PREPARE", {dn: e.paramData})
            }), this.player.on(n.Player.Snapshoted, function () {
              t._log("SNAPSHOT")
            }), setInterval(function () {
              var e;
              t.player.getCurrentTime() && (e = Math.floor(1e3 * t.player.getCurrentTime()), t.player.paused() || 30 <= ++o && (t._log("HEARTBEAT", {
                vt: e,
                interval: 1e3 * o
              }), o = 0))
            }, 1e3)
          }, removeEvent: function () {
            this.player.off("init"), this.player.off("ready"), this.player.off("ended"), this.player.off("play"), this.player.off("pause"), this.player.off("seekStart"), this.player.off("seekEnd"), this.player.off("canplaythrough"), this.player.off("playing"), this.player.off("timeupdate"), this.player.off("error"), this.player.off("fullscreenchange"), this.player.off(n.Private.PREPARE), this._logService && this._logService.dispose()
          }, reset: function () {
            this.startTimePlay = 0, this.buffer_flag = 0, this.firstPlay = !1, this.playId = 0, this.loadstarted = 0, this._LoadedData = 0, this._canPlay = 0
          }, encodeURL: function (e) {
            if (!e) return "";
            var t = this.player.getOptions();
            return t && !t.logBatched ? encodeURIComponent(e) : e
          }, _onFullscreenChange: function (e) {
            e ? this._log("FULLSREEM", {}) : this._log("QUITFULLSCREEM", {})
          }, _onPlayerloadstart: function () {
            this.loadstartTime = (new Date).getTime(), this.playId = b.guid(), !this.loadstarted && this.player._isPreload() && (this.loadstarted = 1, this._log("STARTPLAY", {vt: (new Date).getTime()}))
          }, _onPlayerLoadMetadata: function () {
            this.loadMetaDataCost = (new Date).getTime() - this.loadstartTime
          }, _onPlayerLoaddata: function () {
            var e, t;
            this._LoadedData || this.buffer_flag || (t = e = 0, this.player.tag && (e = this.player.tag.videoWidth, t = this.player.tag.videoHeight), this._log("PREPAREEND", {
              tc: (new Date).getTime() - this._prepareTime,
              cc: (new Date).getTime() - this.loadstartTime,
              md: this.loadMetaDataCost,
              mi: JSON.stringify({type: "video", definition: e + "*" + t})
            })), this._LoadedData = 1
          }, _onPlayerCanplay: function () {
            this._canPlay = 1, this._reportPlay()
          }, _onPlayerInit: function () {
            this.buffer_flag = 0, this.pause_flag = 0, this.startTimePlay = 0, this.loadstarted = 0, this._LoadedData = 0, this._canPlay = 0
          }, _onPlayerReady: function () {
            this.startTimePlay || (this.startTimePlay = (new Date).getTime())
          }, _onPlayerFinish: function () {
            this._log("STOP", {vt: Math.floor(1e3 * this.player.getCurrentTime())}), this.reset()
          }, _reportPlay: function () {
            return !(this.buffer_flag || !this._LoadedData || !this.playstartTime) && (this.first_play_time = (new Date).getTime(), this._log("PLAY", {
              dsm: "fix",
              tc: this.first_play_time - this.loadstartTime,
              fc: this.first_play_time - this.playstartTime
            }), this.buffer_flag = 1, !0)
          }, _onPlayerPlay: function () {
            this.playstartTime = (new Date).getTime(), 0 == this.playId && (this.playId = b.guid()), this.firstPlay || 0 != this.pause_flag || this.player._seeking || (this.sessionId = b.guid()), this.player._isPreload() || (this._log("STARTPLAY", {vt: (new Date).getTime()}), this.loadstartTime = (new Date).getTime()), this._canPlay && this._reportPlay() || this.buffer_flag && this.pause_flag && (this.pause_flag = 0, this.pauseEndTime = (new Date).getTime(), this._log("RECOVER", {
              vt: Math.floor(1e3 * this.player.getCurrentTime()),
              cost: this.pauseEndTime - this.pauseTime
            }))
          }, _onPlayerPause: function () {
            this.buffer_flag && this.startTimePlay && (this.player._seeking || (this.pause_flag = 1, this.pauseTime = (new Date).getTime(), this._log("PAUSE", {vt: Math.floor(1e3 * this.player.getCurrentTime())})))
          }, _onPlayerSeekStart: function (e) {
            this.seekStartTime = e.paramData.fromTime, this.startTimePlay = 0, this.seekStartStamp = (new Date).getTime()
          }, _onPlayerSeekEnd: function () {
            this.seekEndStamp = (new Date).getTime(), this._log("SEEK", {
              drag_from_timestamp: Math.floor(1e3 * this.seekStartTime),
              drag_to_timestamp: Math.floor(1e3 * this._seekEndData.toTime)
            }), this._log("SEEK_END", {
              vt: Math.floor(1e3 * this.player.getCurrentTime()),
              cost: this.seekEndStamp - this.seekStartStamp
            }), this._seekEndData = null
          }, _onPlayerLoaded: function () {
            var e;
            this.buffer_flag && this.startTimePlay && (this.stucking || this.player._seeking || (this.stuckStartTime = (new Date).getTime(), this.stuckStartTime - this.startTimePlay <= 1e3 || (this.stucking = !0, e = this._getbwEstimator(), this._log("UNDERLOAD", {
              vt: Math.floor(1e3 * this.player.getCurrentTime()),
              bw: e
            }), this.stuckStartTime = (new Date).getTime())))
          }, _onPlayerUnderload: function () {
            var e, t, r, i;
            !this.buffer_flag && this.player._options && this.player._options.autoplay || this.stucking && !this.player._seeking && (e = Math.floor(1e3 * this.player.getCurrentTime()), t = this.stuckStartTime || (new Date).getTime(), 0 < (r = Math.floor((new Date).getTime() - t)) && (i = this._getbwEstimator(), this._log("LOADED", {
              vt: e,
              cost: r,
              bw: i
            })), this.stucking = !1)
          }, _onPlayerHeartBeat: function () {
            var e, t;
            this.player._seeking || (e = Math.floor(1e3 * this.player.getCurrentTime()), (t = this).timer || (this.timer = setTimeout(function () {
              this.player._seeking || t._log("HEARTBEAT", {progress: e}), clearTimeout(t.timer), t.timer = null
            }, 6e4)))
          }, _onPlayerError: function () {
            this.playId = 0, this._LoadedData = 1, this.buffer_flag || this._reportPlay()
          }, _getbwEstimator: function () {
            var e = NaN;
            try {
              e = this.player._getbwEstimator && this.player._getbwEstimator()
            } catch (e) {
            }
            return e
          }, _log: function (e, t) {
            if (this.trackLog) {
              this.updateSourceInfo();
              var r = u.copy(this.opt);
              this.requestId = b.guid();
              var i = _.logReportTo;
              r.e = h[e] + "", r.ri = this.sessionId, r.t = (new Date).getTime() + "", r.cdn_ip = this._userNetInfo.cdnIp, r.hn = this._userNetInfo.localIp;
              var n = this.player.getCurrentQuality();
              "" != n && (r.definition = n.definition);
              var o = [];
              u.each(t, function (e, t) {
                o.push(e + "=" + t)
              });
              var a, s = "", l = this.player.getOptions();
              l && l.vid && (s = l.vid), o.push("vid=" + s);
              try {
                Aliplayer && Aliplayer.__logCallback__ && (r.args = o, Aliplayer.__logCallback__(r))
              } catch (e) {
                console.log(e)
              }
              return "" == (o = o.join("&")) && (o = "0"), r.args = this.encodeURL(o), this._logService ? this._logService.add(r) : (a = [], u.each(r, function (e, t) {
                a.push(e + "=" + t)
              }), a = a.join("&"), c.jsonp(i + "?" + a, function () {
              }, function () {
              })), this.sessionId
            }
          }
        });
    t.exports = a
  }, {
    "../config": 204,
    "../lib/data": 216,
    "../lib/io": 223,
    "../lib/object": 225,
    "../lib/oo": 226,
    "../lib/ua": 230,
    "../player/base/event/eventtype": 242,
    "./log": 236,
    "./util": 238
  }],
  238: [function (e, t, r) {
    var i = e("../lib/cookie"), n = e("../lib/data"), o = e("../lib/ua");
    t.exports.getUuid = function () {
      var e = i.get("p_h5_u");
      return e || (e = n.guid(), i.set("p_h5_u", e, 730)), e
    }, t.exports.getTerminalType = function () {
      var e = "pc";
      return o.IS_IPAD ? e = "pad" : o.IS_ANDROID ? e = "android" : o.IS_IOS && (e = "iphone"), e
    }, t.exports.returnUTCDate = function (e) {
      var t = e.getUTCFullYear(), r = e.getUTCMonth(), i = e.getUTCDate(), n = e.getUTCHours(), o = e.getUTCMinutes(),
          a = e.getUTCSeconds(), s = e.getUTCMilliseconds();
      return Date.UTC(t, r, i, n, o, a, s)
    }, t.exports.getRfc822 = function (e) {
      return e.toUTCString().replace("UTC", "GMT")
    }
  }, {"../lib/cookie": 215, "../lib/data": 216, "../lib/ua": 230}],
  239: [function (e, t, r) {
    var l = e("./base/player"), u = e("./flash/flashplayer"), c = e("./saas/mtsplayer"), h = e("./saas/vodplayer"),
        d = e("./audio/audioplayer"), f = e("./hls/hlsplayer"), p = e("./flv/flvplayer"), y = e("./rts/rtsplayer"),
        m = e("./drm/drmplayer"), g = e("../lib/ua"), b = e("../lib/playerutil"),
        v = (e("../lib/dom"), e("../lib/io"), e("../lang/index"));
    t.exports.create = function (e, t) {
      navigator && navigator.userAgent && -1 < navigator.userAgent.indexOf("Olympic_Android") && (e.useNativeControls = !0), "function" != typeof t && (t = function () {
      }), e.readyCallback = t, v.setCurrentLanguage(e.language, "h5", e.languageTexts);
      var r = b.handleOption(e), i = r.source, n = b.isAudio(i);
      n && (r.mediaType = "audio");
      var o, a = b.createWrapper(r);
      if (a.player) return a.player;
      if (n) o = new d(a, r); else if (b.isRts(i)) o = new y(a, r); else if (!r.useFlashPrism && b.isFlv(i) && b.isSupportFlv()) o = new p(a, r); else if (g.IS_MOBILE || !r.useFlashPrism && !b.isRTMP(i)) if (r.vid && !r.source) if (r.authInfo) o = new c(a, r); else {
        if (!(r.playauth || r.accessKeyId && r.accessKeySecret)) {
          var s = "vid=" + r.vid + " playauth='', playauth property is required by VOD(\u89c6\u9891\u70b9\u64ad) as new Aliplayer.";
          throw new Error(s)
        }
        o = new h(a, r)
      } else b.isDash(i) && b.isSupportMSE() ? o = new m(a, r) : b.isHls(i) ? b.canPlayHls() ? o = new (b.isSupportHls() && (b.isUsedHlsPluginOnMobile() || b.isSafariUsedHlsPlugin(r.useHlsPluginForSafari)) ? f : l)(a, r) : b.isSupportHls() ? o = new f(a, r) : g.os.pc ? r.userH5Prism || r.useH5Prism || (o = new u(a, r)) : o = new l(a, r) : o = (g.os.pc, new l(a, r)); else o = new u(a, r);
      return o
    }
  }, {
    "../lang/index": 210,
    "../lib/dom": 217,
    "../lib/io": 223,
    "../lib/playerutil": 228,
    "../lib/ua": 230,
    "./audio/audioplayer": 240,
    "./base/player": 261,
    "./drm/drmplayer": 268,
    "./flash/flashplayer": 269,
    "./flv/flvplayer": 271,
    "./hls/hlsplayer": 273,
    "./rts/rtsplayer": 275,
    "./saas/mtsplayer": 279,
    "./saas/vodplayer": 285
  }],
  240: [function (e, t, r) {
    var i = e("../base/player"), n = e("../../ui/component"), o = e("../../lib/dom"), a = e("../../lib/object"),
        s = e("../../lib/playerutil"), l = i.extend({
          init: function (e, t) {
            this._isAudio = !0, void 0 === t.skinLayout && (t.skinLayout = s.defaultAudioLayout), i.call(this, e, t)
          }
        });
    l.prototype.createEl = function () {
      "AUDIO" !== this.tag.tagName && (this._el = this.tag, this.tag = n.prototype.createEl.call(this, "audio"));
      var t = this._el, e = this.tag;
      e.player = this;
      var r = o.getElementAttributes(e);
      return a.each(r, function (e) {
        t.setAttribute(e, r[e])
      }), this.setVideoAttrs(), e.parentNode && e.parentNode.insertBefore(t, e), o.insertFirst(e, t), t
    }, t.exports = l
  }, {
    "../../lib/dom": 217,
    "../../lib/object": 225,
    "../../lib/playerutil": 228,
    "../../ui/component": 294,
    "../base/player": 261
  }],
  241: [function (e, t, r) {
    var a = e("../../../lib/event"), s = e("./eventtype"), i = e("../eventHandler/video/index"),
        n = e("../eventHandler/player/index");
    t.exports.offAll = function (e) {
      var t = e.tag, r = e._el;
      for (var i in s.Video) a.off(t, s.Video[i]);
      for (var n in s.Player) a.off(r, s.Player[n]);
      for (var o in s.Private) a.off(r, s.Private[o])
    }, t.exports.onAll = function (e) {
      i.bind(e), n.bind(e)
    }
  }, {
    "../../../lib/event": 218,
    "../eventHandler/player/index": 246,
    "../eventHandler/video/index": 255,
    "./eventtype": 242
  }],
  242: [function (e, t, r) {
    t.exports = {
      Video: {
        TimeUpdate: "timeupdate",
        Play: "play",
        Playing: "playing",
        Pause: "pause",
        CanPlay: "canplay",
        Waiting: "waiting",
        Ended: "ended",
        Error: "error",
        Suspend: "suspend",
        Stalled: "stalled",
        LoadStart: "loadstart",
        DurationChange: "durationchange",
        LoadedData: "loadeddata",
        LoadedMetadata: "loadedmetadata",
        Progress: "progress",
        CanPlayThrough: "canplaythrough",
        ContextMenu: "contextmenu",
        Seeking: "seeking",
        Seeked: "seeked",
        ManualEnded: "manualended"
      },
      Player: {
        TimeUpdate: "timeupdate",
        DurationChange: "durationchange",
        Init: "init",
        Ready: "ready",
        Play: "play",
        Pause: "pause",
        CanPlay: "canplay",
        Waiting: "waiting",
        Ended: "ended",
        Error: "error",
        RequestFullScreen: "requestFullScreen",
        CancelFullScreen: "cancelFullScreen",
        Snapshoted: "snapshoted",
        Snapshoting: "snapshoting",
        OnM3u8Retry: "onM3u8Retry",
        LiveStreamStop: "liveStreamStop",
        AutoPlayPrevented: "autoPlayPrevented",
        AutoPlay: "autoplay",
        StartSeek: "startSeek",
        CompleteSeek: "completeSeek",
        TextTrackReady: "textTrackReady",
        AudioTrackReady: "audioTrackReady",
        AudioTrackUpdated: "audioTrackUpdated",
        LevelsLoaded: "levelsLoaded",
        AudioTrackSwitch: "audioTrackSwitch",
        AudioTrackSwitched: "audioTrackSwitched",
        LevelSwitch: "levelSwitch",
        LevelSwitched: "levelSwitched",
        MarkerDotOver: "markerDotOver",
        MarkerDotOut: "markerDotOut",
        DefaultBandWidth: "defaultbandwidth",
        ResolutionChange: "resolutionChange",
        SeiFrame: "seiFrame"
      },
      Private: {
        Play_Btn_Show: "play_btn_show",
        UiH5Ready: "uiH5Ready",
        Error_Hide: "error_hide",
        Error_Show: "error_show",
        Info_Show: "info_show",
        Info_Hide: "info_hide",
        H5_Loading_Show: "h5_loading_show",
        H5_Loading_Hide: "h5_loading_hide",
        HideProgress: "hideProgress",
        CancelHideProgress: "cancelHideProgress",
        Click: "click",
        MouseOver: "mouseover",
        MouseOut: "mouseout",
        MouseEnter: "mouseenter",
        MouseLeave: "mouseleave",
        TouchStart: "touchstart",
        TouchMove: "touchmove",
        TouchEnd: "touchend",
        HideBar: "hideBar",
        ShowBar: "showBar",
        ReadyState: "readyState",
        SourceLoaded: "sourceloaded",
        QualityChange: "qualitychange",
        Play_Btn_Hide: "play_btn_hide",
        Cover_Hide: "cover_hide",
        Cover_Show: "cover_show",
        SeekStart: "seekStart",
        EndStart: "endStart",
        UpdateProgressBar: "updateProgressBar",
        LifeCycleChanged: "lifeCycleChanged",
        Dispose: "dispose",
        Created: "created",
        Snapshot_Hide: "snapshot_hide",
        AutoStreamShow: "auto_stream_show",
        AutoStreamHide: "auto_stream_hide",
        VolumnChanged: "volumnchanged",
        LiveShiftQueryCompleted: "liveShiftQueryCompleted",
        StreamSelectorHide: "streamSelectorHide",
        SpeedSelectorHide: "speedSelectorHide",
        SettingShow: "settingShow",
        SettingHide: "settingHide",
        SelectorShow: "selectorShow",
        SelectorHide: "selectorHide",
        SettingListShow: "settingListShow",
        SettingListHide: "settingListHide",
        ThumbnailHide: "thumbnailHide",
        ThumbnailShow: "thumbnailShow",
        ThumbnailLoaded: "thumbnailLoaded",
        TooltipShow: "tooltipShow",
        TooltipHide: "tooltipHide",
        SelectorUpdateList: "selectorUpdateList",
        SelectorValueChange: "selectorValueChange",
        VolumeVisibilityChange: "volumeVisibilityChange",
        ChangeURL: "changeURL",
        UpdateToSettingList: "updateToSettingList",
        CCChanged: "CCChanged",
        CCStateChanged: "CCStateChanged",
        PlayClick: "click",
        ProgressMarkerLoaded: "progressMarkerLoaded",
        MarkerTextShow: "markerTextShow",
        MarkerTextHide: "markerTextHide",
        PREPARE: "prepare",
        ProgressMarkerChanged: "progressMarkerChanged"
      }
    }
  }, {}],
  243: [function (e, t, r) {
    e("../../event/eventtype");
    var i = e("../../../../lib/dom"), n = e("../../../../lib/ua");
    t.exports.handle = function () {
      n.IS_IOS || i.removeClass(this.el(), "prism-fullscreen")
    }
  }, {"../../../../lib/dom": 217, "../../../../lib/ua": 230, "../../event/eventtype": 242}],
  244: [function (e, t, r) {
    var i = e("../../event/eventtype");
    t.exports.handle = function (e) {
      var t = this;
      t.one(i.Player.CanPlay, function () {
        t._enteredProgressMarker && t.pause(), t.trigger(i.Player.CompleteSeek, e.paramData.toTime)
      })
    }
  }, {"../../event/eventtype": 242}],
  245: [function (e, t, r) {
    var i = e("../../event/eventtype"),
        n = (e("../../../../lib/constants"), e("../../../../lang/index"), e("../../../../monitor/util"));
    t.exports.handle = function (e) {
      var t = this, r = e.paramData;
      t.trigger(i.Private.H5_Loading_Hide), t.trigger(i.Private.Cover_Hide), t.trigger(i.Private.Play_Btn_Hide), t.trigger(i.Private.SettingListHide), t.trigger(i.Private.SelectorHide), t.trigger(i.Private.VolumeVisibilityChange, ""), r = r || {}, t._monitor && (r.uuid = n.getUuid(), r.requestId = t._serverRequestId, r.cdnIp = t._monitor._userNetInfo.cdnIp, r.localIp = t._monitor._userNetInfo.localIp), t._isError = !0, t.trigger(i.Private.Error_Show, r), t.trigger(i.Private.LifeCycleChanged, {
        type: i.Player.Error,
        data: r
      })
    }
  }, {
    "../../../../lang/index": 210,
    "../../../../lib/constants": 214,
    "../../../../monitor/util": 238,
    "../../event/eventtype": 242
  }],
  246: [function (e, t, r) {
    function i(r, i, n) {
      var e = r.el();
      o.on(e, i, function (e) {
        var t = n && n.handle ? n.handle : a.handle;
        t.call(r, e, i)
      })
    }

    var n = e("../../event/eventtype"), o = e("../../../../lib/event"), a = e("./lifecyclecommon"), s = {
          endStart: e("./endstart"),
          seekStart: e("./seekstart"),
          requestFullScreen: e("./requestfullscreen"),
          cancelFullScreen: e("./cancelfullscreen"),
          error: e("./error")
        },
        l = [n.Private.EndStart, n.Private.SeekStart, n.Player.RequestFullScreen, n.Player.CancelFullScreen, n.Player.Error, n.Player.Ready, n.Private.Dispose, n.Private.Created];
    t.exports.bind = function (e) {
      e.el();
      for (var t = 0; t < l.length; t++) {
        var r = l[t];
        "undefined" != s[r] && i(e, r, s[r])
      }
    }
  }, {
    "../../../../lib/event": 218,
    "../../event/eventtype": 242,
    "./cancelfullscreen": 243,
    "./endstart": 244,
    "./error": 245,
    "./lifecyclecommon": 247,
    "./requestfullscreen": 248,
    "./seekstart": 249
  }],
  247: [function (e, t, r) {
    var i = e("../../event/eventtype");
    t.exports.handle = function (e, t) {
      this.trigger(i.Private.LifeCycleChanged, {type: t, data: e})
    }
  }, {"../../event/eventtype": 242}],
  248: [function (e, t, r) {
    e("../../event/eventtype");
    var i = e("../../../../lib/dom"), n = e("../../../../lib/ua");
    t.exports.handle = function () {
      n.IS_IOS || i.addClass(this.el(), "prism-fullscreen")
    }
  }, {"../../../../lib/dom": 217, "../../../../lib/ua": 230, "../../event/eventtype": 242}],
  249: [function (e, t, r) {
    var i = e("../../event/eventtype");
    t.exports.handle = function (e) {
      this._seeking = !0, this.trigger(i.Player.StartSeek, e.paramData.fromTime)
    }
  }, {"../../event/eventtype": 242}],
  250: [function (e, t, r) {
    var i = e("../../event/eventtype");
    t.exports.handle = function (e) {
      var t = this;
      t._retrySwitchUrlCount = 0, t._liveRetryCount = 0, t._clearLiveErrorHandle();
      var r = (new Date).getTime() - t.readyTime;
      t._options.autoplay || t._options._autoplay || !t.paused() || (t.trigger(i.Private.H5_Loading_Hide), t.trigger(i.Private.Play_Btn_Show)), t.trigger(i.Player.CanPlay, {loadtime: r})
    }
  }, {"../../event/eventtype": 242}],
  251: [function (e, t, r) {
    var i = e("../../event/eventtype"), n = e("../../../../lib/dom"), o = e("../../../../lib/ua");
    t.exports.handle = function (e) {
      this._seeking = !1;
      var t = this.tag;
      "none" === t.style.display && o.IS_IOS && setTimeout(function () {
        n.css(t, "display", "block")
      }, 100), this.trigger(i.Video.CanPlayThrough)
    }
  }, {"../../../../lib/dom": 217, "../../../../lib/ua": 230, "../../event/eventtype": 242}],
  252: [function (e, t, r) {
    t.exports.handle = function (e, t) {
      var r = "";
      e && e.paramData && (r = e.paramData), this.trigger(t, r)
    }
  }, {}],
  253: [function (e, t, r) {
    var i = e("../../event/eventtype");
    e("../../../../lang/index");
    t.exports.handle = function (e) {
      var t = this;
      t.waiting = !1, t._ended = !0, t._monitor && t._monitor._onPlayerInit(), t._options.rePlay ? (t.seek(0), t.tag.play()) : t._options.isLive && t.trigger(i.Private.H5_Loading_Hide), t.trigger(i.Private.Play_Btn_Show), t.trigger(i.Player.Ended)
    }
  }, {"../../../../lang/index": 210, "../../event/eventtype": 242}],
  254: [function (e, t, r) {
    var c = e("../../event/eventtype"),
        h = (e("../../../../lib/ua"), e("../../../../lib/playerutil"), e("../../../../lib/constants")),
        d = e("../../../../lang/index");
    t.exports.handle = function (e) {
      var t = this;
      if (t.waiting = !1, t._clearTimeout(), t.checkOnline()) {
        var r, i = "", n = e.target || e.srcElement, o = n.error.message, i = "";
        if (n.error.code && (r = n.error.code, i = h.VideoErrorCode[n.error.code], o = r + " || " + o), t._options.isLive) t._options.liveRetry > t._liveRetryCount ? t._reloadAndPlayForM3u8() : (t._liveRetryCount = 0, t.trigger(c.Player.LiveStreamStop), t._liveErrorHandle = setTimeout(function () {
          var e = {
            mediaId: "ISLIVE",
            error_code: i,
            error_msg: d.get("Error_Play_Text") + "\uff0c" + d.get("Error_Retry_Text")
          };
          t.logError(e), t.trigger("error", e)
        })); else if (!t._reloadForVod()) {
          var a = d.get("Error_Play_Text"), s = !1;
          if (r < 4) {
            if (3 == r && t._firstDecodeError) {
              var l = t.getCurrentTime() + 1;
              return t._loadByUrlInner(t._options.source, l, !0), void (t._firstDecodeError = !1)
            }
            a = h.VideoErrorCodeText[r]
          } else t._eventState == h.SUSPEND ? (a = d.get("Error_Load_Abort_Text"), i = h.ErrorCode.RequestDataError) : t._eventState == h.LOAD_START ? (a = d.get("Error_Network_Text"), 0 < t._options.source.indexOf("auth_key") && (a = a + "\uff0c" + d.get("Error_AuthKey_Text")), i = h.ErrorCode.StartLoadData) : t._eventState == h.LOADED_METADATA && (a = d.get("Error_Play_Text"), i = h.ErrorCode.PlayingError);
          a = a + "\uff0c" + d.get("Error_Retry_Text"), 1 < t._urls.length && t._retrySwitchUrlCount < 3 && -1 == t._options.source.indexOf(".mpd") && (t.switchUrl(), s = !0);
          var u = {mediaId: t._options.vid ? t._options.vid : "", error_code: i, error_msg: o};
          s || (t.logError(u), u.display_msg = a, t.trigger(c.Player.Error, u))
        }
      }
    }
  }, {
    "../../../../lang/index": 210,
    "../../../../lib/constants": 214,
    "../../../../lib/playerutil": 228,
    "../../../../lib/ua": 230,
    "../../event/eventtype": 242
  }],
  255: [function (e, t, r) {
    function i(t, r, i) {
      var e = t.tag;
      n.on(e, r, function (e) {
        i.handle.call(t, e, r), r != o.Video.Error && (r == o.Video.ManualEnded && (r = o.Video.Ended), t.trigger(o.Private.LifeCycleChanged, {
          type: r,
          data: e
        }))
      })
    }

    var n = e("../../../../lib/event"), o = e("../../event/eventtype"), a = {
      canplay: e("./canplay"),
      canplaythrough: e("./canplaythrough"),
      common: e("./common"),
      ended: e("./ended"),
      error: e("./error"),
      pause: e("./pause"),
      play: e("./play"),
      playing: e("./playing"),
      waiting: e("./waiting"),
      timeupdate: e("./timeupdate"),
      manualended: e("./ended")
    };
    t.exports.bind = function (e) {
      e.tag;
      for (var t in o.Video) {
        var r = o.Video[t];
        i(e, r, void 0 !== a[r] ? a[r] : a.common)
      }
    }
  }, {
    "../../../../lib/event": 218,
    "../../event/eventtype": 242,
    "./canplay": 250,
    "./canplaythrough": 251,
    "./common": 252,
    "./ended": 253,
    "./error": 254,
    "./pause": 256,
    "./play": 257,
    "./playing": 258,
    "./timeupdate": 259,
    "./waiting": 260
  }],
  256: [function (e, t, r) {
    var i = e("../../event/eventtype");
    t.exports.handle = function (e) {
      this._clearTimeout(), this.trigger(i.Private.AutoStreamHide), this.trigger(i.Player.Pause), this._isManualPause && (this.trigger(i.Private.Play_Btn_Show), this.trigger(i.Private.H5_Loading_Hide)), this.waiting = !1
    }
  }, {"../../event/eventtype": 242}],
  257: [function (e, t, r) {
    var i = e("../../event/eventtype");
    t.exports.handle = function (e) {
      this.trigger(i.Private.Error_Hide), this.trigger(i.Private.Cover_Hide), this.trigger(i.Private.AutoStreamHide), this.waiting = !1, this.trigger(i.Player.Play)
    }
  }, {"../../event/eventtype": 242}],
  258: [function (e, t, r) {
    var n = e("../../event/eventtype");
    t.exports.handle = function (e) {
      var t = this;
      t.trigger(n.Private.H5_Loading_Hide), t.trigger(n.Private.Cover_Hide), t.trigger(n.Private.Info_Hide), t.waiting = !1, t._ended = !1, t._liveRetryCount = 0, t._vodRetryCount = 0, t._seeking = !1, t._firstDecodeError = !0;
      var r, i = t.getCurrentTime();
      t._waitingReloadTime != i && (t._waitingTimeoutCount = 0), t._checkTimeoutHandle && (clearTimeout(t._checkTimeoutHandle), t._checkTimeoutHandle = null), t._waitingLoadedHandle && (clearTimeout(t._waitingLoadedHandle), t._waitingLoadedHandle = null), t._waitingDelayLoadingShowHandle && (clearTimeout(t._waitingDelayLoadingShowHandle), t._waitingDelayLoadingShowHandle = null), t._waitingTimeoutHandle && (clearTimeout(t._waitingTimeoutHandle), t._waitingTimeoutHandle = null, t._ccService && t._options.isLive && (r = t._ccService.getCurrentSubtitle(), t._setDefaultCC = !0, r && t._ccService["switch"](r))), t.trigger(n.Private.AutoStreamHide), t.trigger(n.Player.Playing), t.trigger(n.Private.Play_Btn_Hide), t.trigger(n.Private.Error_Hide)
    }
  }, {"../../event/eventtype": 242}],
  259: [function (e, t, r) {
    var s = e("../../event/eventtype"), l = e("../../../../lib/ua"), u = e("../../../../lib/event"),
        c = e("../../plugin/status");
    t.exports.handle = function (e) {
      var r = this;
      r.trigger(s.Player.TimeUpdate, e.timeStamp);
      var t, i, n = r.getCurrentTime();
      r.waiting && !r._TimeUpdateStamp && (r._TimeUpdateStamp = n), 0 != r.waiting && r._TimeUpdateStamp == n || (r.trigger(s.Private.H5_Loading_Hide), r.trigger(s.Private.AutoStreamHide), r._checkTimeoutHandle && clearTimeout(r._checkTimeoutHandle), r._waitingTimeoutHandle && clearTimeout(r._waitingTimeoutHandle), r._waitingLoadedHandle && clearTimeout(r._waitingLoadedHandle), r.waiting = !1), r._TimeUpdateStamp = n, r._options.isLive || (i = !1, ((t = r.getDuration()) < n && !r.paused() || t - n < .2 && 0 <= l.browser.version.indexOf("49.") && !r.paused() || r.exceedPreviewTime(n)) && (i = !0), i && !r._ended && (r.pause(), u.trigger(r.tag, s.Video.ManualEnded)));
      var o, a = r._player.tag;
      r._options.isLive && a && (r._player.resolution && 0 < a.videoWidth && 0 < a.videoHeight && (0 < r._player.resolution.width || 0 < r._player.resolution.height) && (r._player.resolution.width !== a.videoWidth || r._player.resolution.height !== a.videoHeight) && (o = {
        oldResolution: {
          width: r._player.resolution.width,
          height: r._player.resolution.height
        }, newResolution: {width: a.videoWidth, height: a.videoHeight}
      }, r.trigger(s.Player.ResolutionChange, o)), r._player.resolution.width = 0 == a.videoWidth ? r._player.resolution.width : a.videoWidth, r._player.resolution.height = 0 == a.videoHeight ? r._player.resolution.height : a.videoHeight), r._playingSlientPause && (clearTimeout(r._playingSlientPause), r._playingSlientPause = null), r._playingSlientPause = setTimeout(function () {
        var e, t;
        r._status == c.playing && (e = r.getCurrentTime(), t = r._options.isLive ? 0 : e, r._loadByUrlInner(r._options.source, t, !0))
      }, 2e3)
    }
  }, {
    "../../../../lib/event": 218,
    "../../../../lib/ua": 230,
    "../../event/eventtype": 242,
    "../../plugin/status": 265
  }],
  260: [function (e, t, r) {
    var o = e("../../event/eventtype"), a = e("../../../../lib/constants"), s = e("../../../../lib/event"),
        l = e("../../../../lang/index");
    e("../../../../lib/ua");
    t.exports.handle = function (e) {
      var r = this;
      if (!r._options.isLive) {
        var t = this.getCurrentTime(), i = this.getDuration();
        if (0 < i && (i - t < .5 || i < t)) return r.pause(), r._ended = !0, void s.trigger(this.tag, o.Video.ManualEnded)
      }
      r.waiting = !0;

      function n() {
        r._checkTimeoutHandle && (clearTimeout(r._checkTimeoutHandle), r._checkTimeoutHandle = null), r._waitingTimeoutHandle && (clearTimeout(r._waitingTimeoutHandle), r._waitingTimeoutHandle = null), r._waitingLoadedHandle && (clearTimeout(r._waitingLoadedHandle), r._waitingLoadedHandle = null), r._waitingDelayLoadingShowHandle && (clearTimeout(r._waitingDelayLoadingShowHandle), r._waitingDelayLoadingShowHandle = null)
      }

      n(), r._waitingDelayLoadingShowHandle = setTimeout(function () {
        r.trigger(o.Private.H5_Loading_Show)
      }, 1e3 * r._options.delayLoadingShow), r._TimeUpdateStamp = null, r._checkTimeoutHandle = setTimeout(function () {
        r.trigger(o.Private.AutoStreamShow)
      }, 1e3 * r._options.loadDataTimeout), r.trigger(o.Player.Waiting), r._waitingTimeoutHandle = setTimeout(function () {
        var e;
        r.tag && r._options && (r.pause(), e = {
          mediaId: r._options.vid ? r._options.vid : "",
          error_code: a.ErrorCode.LoadingTimeout,
          error_msg: l.get("Error_Waiting_Timeout_Text")
        }, r.logError(e), r.trigger("error", e))
      }, 1e3 * r._options.waitingTimeout), r._waitingLoadedHandle = setTimeout(function () {
        var e, t = r.getCurrentTime();
        0 == r._waitingTimeoutCount && t != r._waitingReloadTime && (r._waitingTimeoutCount = 1, r._waitingReloadTime = t, e = r._options.isLive ? 0 : t, r._loadByUrlInner(r._options.source, e, !0))
      }, r._options.waitingTimeout / 2 * 1e3), r.on("error", function () {
        n()
      })
    }
  }, {
    "../../../../lang/index": 210,
    "../../../../lib/constants": 214,
    "../../../../lib/event": 218,
    "../../../../lib/ua": 230,
    "../../event/eventtype": 242
  }],
  261: [function (e, t, r) {
    var o = e("../../ui/component"), a = e("../../lib/object"), n = e("../../lib/dom"), s = e("../../lib/event"),
        l = (e("../../lib/io"), e("../../ui/exports")), u = e("../../monitor/monitor"), c = e("../../lib/ua"),
        h = e("../../lib/constants"), d = e("../../lib/util"), f = (e("../../config"), e("../../lib/playerutil")),
        p = e("./x5play"), y = e("../../lib/cookie"), m = e("../../lang/index"), g = e("../../feature/autoPlayDelay"),
        b = e("./event/eventmanager"), v = e("../../ui/component/cover"), _ = e("../../ui/component/play-animation"),
        w = e("../../commonui/autostreamselector"), S = e("./event/eventtype"), E = e("./plugin/lifecyclemanager"),
        x = e("../service/export"), T = e("../../ui/component/progressmarker"), M = o.extend({
          init: function (e, t) {
            var r, i, n;
            this.tag = e, this.loaded = !1, this.played = !1, this.waiting = !1, this._urls = [], this._currentPlayIndex = 0, this._retrySwitchUrlCount = 0, this._isError = !1, this._isHls = !1, this._liveRetryCount = 0, this._vodRetryCount = 0, this._seeking = !1, this._serverRequestId = 0, this._waitingTimeoutCount = 0, this._waitingReloadTime = 0, this._created = !1, this._firstDecodeError = !0, this._enteredProgressMarker = !1, this._liveShiftSeekStartTime = 0, this._duration = 0, this.isMutiLevel = !1, this.__disposed = !1, this.resolution = {
              width: 0,
              height: 0
            }, void 0 === t.skinLayout && (t.skinLayout = f.defaultH5Layout), c.wechat() && c.IS_ANDROID && (t.autoplay = !1), o.call(this, this, t), this.addClass("prism-player"), t.plugins && a.each(t.plugins, function (e, t) {
              this[e](t)
            }, this), this._createService(), this.UI = {}, t.useNativeControls ? this.tag.setAttribute("controls", "controls") : (this.UI = l, 0 == t.errorDisplay && (this.UI.errorDisplay = void 0)), this.initChildren(), this._options.trackLog && (this._monitor = new u(this, {
              video_id: 0,
              album_id: 0,
              from: this._options.from,
              source: this._options.source,
              logBatched: this._options.logBatched
            }, this._options.trackLog)), b.onAll(this), this._lifeCycleManager = new E(this), this._overrideNativePlay(), !this._liveshiftService || this._liveshiftService.validate() ? (!this._options.extraInfo || (r = this._options.extraInfo).liveRetry && (this._options.liveRetry = r.liveRetry), this.on(S.Private.ReadyState, function () {
              this.trigger(S.Player.Ready)
            }), this._thumbnailService && this._options.thumbnailUrl && this._thumbnailService.get(this._options.thumbnailUrl), 0 < this._options.progressMarkers.length && this.trigger(S.Private.ProgressMarkerLoaded, this._options.progressMarkers), this._options.source && this._options._native && this._executeReadyCallback(), this._options.autoplay || this._options.preload ? this.trigger(S.Private.H5_Loading_Show) : this.trigger(S.Private.Play_Btn_Show), this._extraMultiSources(), this._options.source && (this.trigger(S.Private.PREPARE, "custom"), this._options.autoPlayDelay ? (this._autoPlayDelay = new g(this), (i = this)._autoPlayDelay.handle(function () {
              i.initPlay()
            })) : this.initPlay())) : (n = {
              mediaId: this._options.vid ? this._options.vid : "",
              error_code: h.ErrorCode.InvalidParameter,
              error_msg: m.get("ShiftLiveTime_Error")
            }, this.trigger(S.Player.Error, n))
          }
        });
    M.prototype.isSupportMSE = function () {
      return f.isSupportMSE()
    }, M.prototype.initPlay = function (e) {
      this._initPlayBehavior(e, this._options.source)
    }, M.prototype.initChildren = function () {
      var e = this.options(), t = e.skinLayout;
      if (!1 !== t && !a.isArray(t)) throw new Error("PrismPlayer Error: skinLayout should be false or type of array!");
      !1 !== t && 0 !== t.length && (this.options({children: t}), o.prototype.initChildren.call(this)), this.UI.cover = v, e.className = "", this.addChild("cover", e), this.UI.playanimation = _, this.addChild("playanimation", e), this.UI.autoStreamSelector = w, this.addChild("autoStreamSelector", e), this.UI.progressMarker = T, this.addChild("progressMarker", e), this.trigger(S.Private.UiH5Ready)
    }, M.prototype.createEl = function () {
      var e = !1;
      "VIDEO" !== this.tag.tagName ? (this._el = this.tag, this.tag = o.prototype.createEl.call(this, "video"), this._options.playsinline && (this.tag.setAttribute("webkit-playsinline", ""), this.tag.setAttribute("playsinline", ""), this.tag.setAttribute("x-webkit-airplay", ""), this.tag.setAttribute("x5-playsinline", ""))) : (e = !0, this._el = this.tag.parentNode);
      var t = this._el, r = this.tag;
      this._options.enableSystemMenu || (r.addEventListener ? r.addEventListener("contextmenu", function (e) {
        e.preventDefault()
      }, !1) : r.attachEvent("oncontextmenu", function () {
        window.event.returnValue = !1
      })), r.player = this;
      var i = n.getElementAttributes(r);
      return a.each(i, function (e) {
        t.setAttribute(e, i[e])
      }), this.setVideoAttrs(), e || (r.parentNode && r.parentNode.insertBefore(t, r), n.insertFirst(r, t)), t
    }, M.prototype.setVideoAttrs = function () {
      var e = this._options.preload, t = this._options.autoplay;
      if (this.tag.style.width = this._options.videoWidth || "100%", this.tag.style.height = this._options.videoHeight || "100%", e && this.tag.setAttribute("preload", "preload"), t && !this._isEnabledAILabel() && this.tag.setAttribute("autoplay", "autoplay"), c.IS_IOS && this.tag.setAttribute("poster", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAAlwSFlzAAALEwAACxMBAJqcGAAAAVlpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDUuNC4wIj4KICAgPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICAgICAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KTMInWQAAAMZJREFUeAHt0DEBAAAAwqD1T20LL4hAYcCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMCAAQMGDBgwYMDAc2CcpAABaODCqQAAAABJRU5ErkJggg=="), this._options.extraInfo) for (var r in this._options.extraInfo) this.tag.setAttribute(r, this._options.extraInfo[r]);
      p.adaptX5Play(this)
    }, M.prototype.checkOnline = function () {
      if (!this._options || this._options.debug) return !0;
      if (0 != navigator.onLine) return !0;
      var e = {
        mediaId: this._options.vid ? this._options.vid : "",
        error_code: h.ErrorCode.NetworkUnavaiable,
        error_msg: m.get("Error_Offline_Text")
      };
      return e.display_msg = m.get("Error_Offline_Text"), this.trigger(S.Player.Error, e), !1
    }, M.prototype.id = function () {
      return this.el().id
    }, M.prototype.renderUI = function () {
    }, M.prototype.switchUrl = function () {
      var e, t;
      0 != this._urls.length && (this._currentPlayIndex = this._currentPlayIndex + 1, this._urls.length <= this._currentPlayIndex && (this._currentPlayIndex = 0, this._retrySwitchUrlCount++), e = this._urls[this._currentPlayIndex], y.set(h.SelectedStreamLevel, e.definition, 365), this.trigger(S.Private.QualityChange, m.get("Quality_Change_Fail_Switch_Text")), t = this.getCurrentTime(), this._vodRetryCount = 0, this._originalSource = "", this._loadByUrlInner(e.Url, t, !0))
    }, M.prototype.setControls = function () {
      var e, t = this.options();
      t.useNativeControls ? this.tag.setAttribute("controls", "controls") : "object" == typeof t.controls && (e = this._initControlBar(t.controls), this.addChild(e))
    }, M.prototype._initControlBar = function (e) {
      return new ControlBar(this, e)
    }, M.prototype.getMetaData = function () {
      var t = this, r = this.tag;
      t._readyStateTimer && clearInterval(t._readyStateTimer), t._readyStateTimer = window.setInterval(function (e) {
        t.tag ? r && 0 < r.readyState && (t._duration = r.duration < 1 ? 0 : r.duration, t.trigger(S.Private.ReadyState), clearInterval(t._readyStateTimer)) : clearInterval(t._readyStateTimer)
      }, 100)
    }, M.prototype.getReadyTime = function () {
      return this.readyTime
    }, M.prototype.readyState = function () {
      return this.tag.readyState
    }, M.prototype.getError = function () {
      return this.tag.error
    }, M.prototype.getRecentOccuredEvent = function () {
      return this._eventState
    }, M.prototype.getSourceUrl = function () {
      return this._options ? this._options.source : ""
    }, M.prototype.getMonitorInfo = function () {
      return this._monitor ? this._monitor.opt : {}
    }, M.prototype.getCurrentQuality = function () {
      if (0 < this._urls.length) {
        var e = this._urls[this._currentPlayIndex];
        return {width: e.width, url: e.Url, definition: e.definition}
      }
      return ""
    }, M.prototype.setSpeed = function (e) {
      this.tag && (this._originalPlaybackRate = e, this.tag.playbackRate = e)
    }, M.prototype.play = function (e) {
      return this.tag && (this.tag.ended || this._ended ? this.replay() : ((this._options.preload || this.loaded) && this.tag.src || this._initLoad(this._options.source), this.trigger(S.Private.Cover_Hide), this.tag.play())), this._isManualPlay = e || !1, this
    }, M.prototype.replay = function () {
      return this._monitor && this._monitor.replay(), this.seek(0), this.tag.play(), this
    }, M.prototype.pause = function (e) {
      return this.tag && this.tag.pause(), this._isManualPause = e || !1, this
    }, M.prototype.stop = function () {
      return this.tag.setAttribute("src", null), this
    }, M.prototype.paused = function () {
      if (this.tag) return !1 !== this.tag.paused
    }, M.prototype.getDuration = function () {
      var e = 0;
      return this.tag && (e = this.isPreview() ? this._vodDuration || this.tag.duration : this._duration && this._duration != 1 / 0 ? this._duration : this.tag.duration), e
    }, M.prototype.getDisplayDuration = function () {
      var e = 0;
      return this.tag && (e = this._vodDuration || this.getDuration()), e
    }, M.prototype.getCurrentTime = function () {
      return this.tag ? this.tag.currentTime : 0
    }, M.prototype.seek = function (e) {
      this._seeking = !0, e === this.tag.duration && e--;
      var t = this._originalPlaybackRate || this.tag.playbackRate;
      try {
        var r = this;
        this.tag.currentTime = e, setTimeout(function () {
          r.tag && (r.tag.playbackRate = t)
        })
      } catch (e) {
        console.log(e)
      }
      return this
    }, M.prototype.firstNewUrlloadByUrl = function (e, t) {
      this._clearTimeout(), this._options.vid = 0, this._options.source = e, this._monitor && this._monitor.updateVideoInfo({
        video_id: 0,
        album_id: 0,
        source: e,
        from: this._options.from
      }), this.trigger(S.Private.ChangeURL), this.initPlay(), this._options.autoplay && this.trigger(S.Private.Cover_Hide), this._options.autoplay ? this.trigger(S.Player.Play) : this.trigger(S.Player.Pause), !(t = t || 0) && 0 != t || isNaN(t) || this.seek(t)
    }, M.prototype._loadByUrlInner = function (e, t, r) {
      this.loadByUrl(e, t, r, !0)
    }, M.prototype.loadByUrl = function (e, t, r, i) {
      this._urls = [], this._monitor && !i && this._monitor.reset(), this._isError = !1, this._duration = 0, this._clearTimeout(), this.trigger(S.Private.Error_Hide), this._options.vid = 0, this._options.source = e, this._monitor && this._monitor.updateVideoInfo({
        video_id: 0,
        album_id: 0,
        source: e,
        from: this._options.from
      }), i || (this.trigger(S.Private.ChangeURL), this._vodRetryCount = 0), this._options._autoplay = r, this.initPlay(r), (this._options.autoplay || r) && this.trigger(S.Private.Cover_Hide), this._options.autoplay || r ? this.trigger(S.Player.Play) : this.trigger(S.Player.Pause);
      var n = this;
      this._options.isLive || s.one(this.tag, S.Video.CanPlay, function (e) {
        !t && 0 != t || isNaN(t) || n.seek(t)
      })
    }, M.prototype.dispose = function () {
      this.__disposed = !0, this.trigger(S.Private.Dispose), this.tag.pause(), b.offAll(this), this._monitor && (this._monitor.removeEvent(), this._monitor = null), this._autoPlayDelay && this._autoPlayDelay.dispose(), this._checkTimeoutHandle && (clearTimeout(this._checkTimeoutHandle), this._checkTimeoutHandle = null), this._waitingTimeoutHandle && (clearTimeout(this._waitingTimeoutHandle), this._waitingTimeoutHandle = null), this._playingSlientPause && (clearTimeout(this._playingSlientPause), this._playingSlientPause = null), this._waitingLoadedHandle && (clearTimeout(this._waitingLoadedHandle), this._waitingLoadedHandle = null), this._readyStateTimer && (clearInterval(this._readyStateTimer), this._readyStateTimer = null), this._vodRetryCountHandle && (clearTimeout(this._vodRetryCountHandle), this._vodRetryCountHandle = null), this._waitingDelayLoadingShowHandle && (clearTimeout(this._waitingDelayLoadingShowHandle), this._waitingDelayLoadingShowHandle = null), this._disposeService(), this._clearLiveErrorHandle(), this._el.innerHTML = "", this.destroy(), this.tag = null, this._options.recreatePlayer = null, this._options = null, this.isMutiLevel = !1
    }, M.prototype.mute = function () {
      this._muteInner(), this._originalVolumn = this.tag.volume;
      var e = m.get("Volume_Mute");
      return this._player.trigger(S.Private.Info_Show, {
        text: e,
        duration: 1e3,
        align: "lb"
      }), this._setInnerVolume(0), this
    }, M.prototype._muteInner = function () {
      this.tag.muted = !0, this.trigger(S.Private.VolumnChanged, -1)
    }, M.prototype.unMute = function () {
      this._unMuteInner();
      var e = m.get("Volume_UnMute");
      return this._player.trigger(S.Private.Info_Show, {
        text: e,
        duration: 1e3,
        align: "lb"
      }), this._setInnerVolume(this._originalVolumn || .5), this
    }, M.prototype._unMuteInner = function () {
      this.tag.muted = !1, this.trigger(S.Private.VolumnChanged, -2)
    }, M.prototype.muted = function () {
      return this.tag.muted
    }, M.prototype.getVolume = function () {
      return this.tag.volume
    }, M.prototype.getOptions = function () {
      return this._options
    }, M.prototype.setVolume = function (e, t) {
      0 != e ? this._unMuteInner() : 0 == e && this._muteInner(), this._setInnerVolume(e);
      var r = m.get("Curent_Volume") + "<span>" + (100 * e).toFixed() + "%</span>";
      this._player.trigger(S.Private.Info_Show, {text: r, duration: 1e3, align: "lb"})
    }, M.prototype._setInnerVolume = function (e) {
      this.tag.volume = e, this.trigger(S.Private.VolumnChanged, e)
    }, M.prototype.hideProgress = function () {
      this.trigger(S.Private.HideProgress)
    }, M.prototype.cancelHideProgress = function () {
      this.trigger(S.Private.CancelHideProgress)
    }, M.prototype.setPlayerSize = function (e, t) {
      this._el && (this._el.style.width = e, this._el.style.height = t)
    }, M.prototype.getBuffered = function () {
      return this.tag.buffered
    }, M.prototype.setRotate = function (e) {
      this.tag && (this._rotate = e, this._setTransform(), this.log("ROTATE", {rotation: e}))
    }, M.prototype.getRotate = function (e) {
      return void 0 === this._rotate ? 0 : this._rotate
    }, M.prototype.setImage = function (e) {
      this.tag && (this._image = e, this._setTransform(), this.log("IMAGE", {mirror: "horizon" == e ? 2 : 1, text: e}))
    }, M.prototype.getImage = function () {
      return this._image
    }, M.prototype.cancelImage = function () {
      this.tag && (this._image = "", this._setTransform(), this.log("IMAGE", {mirror: 0}))
    }, M.prototype.setCover = function (e) {
      var t = document.querySelector("#" + this.id() + " .prism-cover");
      t && e && (t.style.backgroundImage = "url(" + e + ")", this._options.cover = e, this.trigger(S.Private.Cover_Show))
    }, M.prototype._setTransform = function () {
      this._transformProp || (this._transformProp = n.getTransformName(this.tag));
      var e = " translate(-50%, -50%)";
      this._rotate && (e += " rotate(" + this._rotate + "deg)"), this._image && ("vertical" == this._image ? e += " scaleY(-1)" : "horizon" == this._image && (e += " scaleX(-1)")), this.tag.style[this._transformProp] = e
    }, M.prototype._startPlay = function () {
      this.tag.paused && this.tag.play()
    }, M.prototype._initPlayBehavior = function (e, t) {
      if (this._checkSupportVideoType()) return !1;
      if (f.validateSource(t)) return void 0 === e && (e = !1), this._created || (this._created = !0, this.trigger(S.Private.Created)), this.loaded || this.trigger(S.Player.Init), this._options.autoplay || this._options._autoplay || this._options.preload || e ? (this._options._preload = !0, this._initLoad(t), (this._options.autoplay || this._options._autoplay) && this._startPlay()) : this.trigger(S.Private.Play_Btn_Show), !0;
      var r = {
        mediaId: this._options.vid ? this._options.vid : "",
        error_code: h.ErrorCode.InvalidSourceURL,
        error_msg: "InvalidSourceURL"
      };
      return r.display_msg = m.get("Error_Invalidate_Source"), this.trigger(S.Player.Error, r), !1
    }, M.prototype._isPreload = function () {
      return this._options.autoplay || this._options.preload || this._options._preload
    }, M.prototype._initLoad = function (e) {
      this.getMetaData(), e && (this._isPreload() && !c.IS_MOBILE ? this.trigger(S.Private.H5_Loading_Show) : (this.trigger(S.Private.H5_Loading_Hide), this.trigger(S.Private.Play_Btn_Show)), this.tag.setAttribute("src", e), this.loaded = !0)
    }, M.prototype._clearLiveErrorHandle = function () {
      this._liveErrorHandle && (clearTimeout(this._liveErrorHandle), this._liveErrorHandle = null)
    }, M.prototype._reloadAndPlayForM3u8 = function () {
      0 == this._liveRetryCount && this.trigger(S.Player.OnM3u8Retry);
      var e = this._options, t = e.liveRetryInterval + e.liveRetryStep * this._liveRetryCount;
      d.sleep(1e3 * t), this._liveRetryCount++, this.tag.load(this._options.source), this.tag.play()
    }, M.prototype._checkSupportVideoType = function () {
      if (!this.tag.canPlayType || !this._options.source || !c.IS_MOBILE) return "";
      var e, t = this._options.source, r = "";
      return 0 < t.indexOf("m3u8") ? "" != this.tag.canPlayType("application/x-mpegURL") || f.isSupportHls() || (r = m.get("Error_Not_Support_M3U8_Text")) : 0 < t.indexOf("mp4") ? "" == this.tag.canPlayType("video/mp4") && (r = m.get("Error_Not_Support_MP4_Text")) : (f.isRTMP(t) || f.isFlv(t)) && c.IS_MOBILE && (r = m.get("Error_Not_Support_Format_On_Mobile")), r && (e = {
        mediaId: this._options.vid ? this._options.vid : "",
        error_code: h.ErrorCode.FormatNotSupport,
        error_msg: r
      }, this.logError(e), e.display_msg = r, this.trigger(S.Player.Error, e)), r
    }, M.prototype.getComponent = function (e) {
      return this._lifeCycleManager.getComponent(e)
    }, M.prototype.logError = function (e, t) {
      (e = e || {}).vt = this.getCurrentTime(), this._serverRequestId = this.log(t ? "ERRORRETRY" : "ERROR", e)
    }, M.prototype.log = function (e, t) {
      var r = 0, i = 0;
      if (this._monitor) return this._options && (r = this._options.vid || "0", i = this._options.from || "0"), this._monitor.updateVideoInfo({
        video_id: r,
        album_id: 0,
        source: this._options.source,
        from: i
      }), this._monitor._log(e, t)
    }, M.prototype.setSanpshotProperties = function (e, t, r) {
      if (this._snapshotMatric || (this._snapshotMatric = {}), this._snapshotMatric.width = e, this._snapshotMatric.height = t, 1 < r) throw new Error("rate doesn't allow more than 1");
      this._snapshotMatric.rate = r
    }, M.prototype.getStatus = function () {
      return this._status ? this._status : "init"
    }, M.prototype.enterProgressMarker = function () {
      this._enteredProgressMarker = !0
    }, M.prototype.isInProgressMarker = function () {
      return this._enteredProgressMarker
    }, M.prototype.exitProgressMarker = function () {
      this._enteredProgressMarker = !1
    }, M.prototype.setProgressMarkers = function (e) {
      e = e || [], this.trigger(S.Private.ProgressMarkerChanged, e)
    }, M.prototype.getProgressMarkers = function () {
      return this._progressMarkerService ? this._progressMarkerService.progressMarkers : []
    }, M.prototype.setPreviewTime = function (e) {
      this._options.playConfig || (this._options.playConfig = {}), this._options.playConfig.PreviewTime = e
    }, M.prototype.getPreviewTime = function () {
      var e = 0;
      return this._options.playConfig && (e = this._options.playConfig.PreviewTime), e
    }, M.prototype.exceedPreviewTime = function (e) {
      return this.isPreview() && e >= this._options.playConfig.PreviewTime
    }, M.prototype.isPreview = function () {
      var e = this._options.playConfig.PreviewTime, t = this._vodDuration || this.tag.duration;
      return 0 < e && e < t
    }, M.prototype._getSanpshotMatric = function () {
      return this._snapshotMatric || (this._snapshotMatric = {}), this._snapshotMatric
    }, M.prototype._overrideNativePlay = function () {
      var i = this.tag.play, n = this;
      this.tag.play = function () {
        if (!n._options.source) {
          var e = {
            mediaId: n._options.vid ? n._options.vid : "",
            error_code: h.ErrorCode.InvalidSourceURL,
            error_msg: "InvalidSourceURL"
          };
          return n._options.vid ? e.display_msg = m.get("Error_Vid_Empty_Source") : e.display_msg = m.get("Error_Empty_Source"), void n.trigger(S.Player.Error, e)
        }
        n.readyTime = (new Date).getTime();
        var t = i.apply(n.tag);
        void 0 !== t && t.then(function () {
          n.trigger(S.Player.AutoPlay, !0)
        })["catch"](function (e) {
          !n.tag || !n.tag.paused || n._isError || n._options._autoplay || n._switchedLevel || (n.trigger(S.Private.Play_Btn_Show), n.trigger(S.Private.H5_Loading_Hide), n.trigger(S.Player.AutoPlayPrevented), n.trigger(S.Player.AutoPlay, !1), n._options.cover && n.trigger(S.Private.Cover_Show))
        });
        var r = n._originalPlaybackRate || n.tag.playbackRate;
        setTimeout(function () {
          n.tag && (n.tag.playbackRate = r)
        })
      }
    }, M.prototype._extraMultiSources = function () {
      var e = this._options.source;
      if (e && -1 < e.indexOf("{") && -1 < e.indexOf("}")) {
        var t = "";
        try {
          t = JSON.parse(e)
        } catch (e) {
          console.error(e), console.error("\u5730\u5740json\u4e32\u683c\u5f0f\u4e0d\u5bf9")
        }
        this.isMutiLevel = !0;
        var r, i = [];
        for (var n in t) {
          var o = h.QualityLevels[n];
          i.push({definition: n, Url: t[n], desc: o || n})
        }
        0 < i.length && (this._currentPlayIndex = f.findSelectedStreamLevel(i), r = i[this._currentPlayIndex], this._urls = i, this._options.source = r.Url, this.trigger(S.Private.SourceLoaded, r))
      }
    }, M.prototype._isEnabledAILabel = function () {
      return this._options.ai && this._options.ai.label
    }, M.prototype._createService = function () {
      if (x) for (var e = x.length, t = 0; t < e; t++) {
        var r = x[t], i = r.condition;
        void 0 === i ? i = !0 : "function" == typeof i && (i = i.call(this)), i && (this[r.name] = new r.service(this))
      }
    }, M.prototype._disposeService = function () {
      if (x) for (var e = x.length, t = 0; t < e; t++) {
        var r = this[x[t].name];
        void 0 !== r && r.dispose && r.dispose()
      }
    }, M.prototype._executeReadyCallback = function () {
      try {
        this._options.autoplay || this._options.preload || (this.trigger(S.Private.H5_Loading_Hide), this.trigger(S.Private.Play_Btn_Show)), this._options.readyCallback(this)
      } catch (e) {
        console.log(e)
      }
    }, M.prototype._clearTimeout = function () {
      this._checkTimeoutHandle && (clearTimeout(this._checkTimeoutHandle), this._checkTimeoutHandle = null), this._waitingTimeoutHandle && (clearTimeout(this._waitingTimeoutHandle), this._waitingTimeoutHandle = null), this._clearLiveErrorHandle()
    }, M.prototype._reloadForVod = function () {
      if (this._originalSource || (this._originalSource = this._options.source), this._vodRetryCount < this._options.vodRetry && navigator.onLine) {
        var e = this.getCurrentTime(), t = this._originalSource;
        t.indexOf("auth_key=") < 0 && (t = t && 0 < t.indexOf("?") ? t + "&_t=" + (new Date).valueOf() : t + "?_t=" + (new Date).valueOf()), this._vodRetryCountHandle && clearTimeout(this._vodRetryCountHandle);
        var r = this;
        return this._vodRetryCountHandle = setTimeout(function () {
          r._loadByUrlInner(t, e, !0)
        }, 100 * this._vodRetryCount), this._vodRetryCount = this._vodRetryCount + 1, !0
      }
      return !1
    }, M.prototype._checkEnoughBufferedForWaiting = function (e) {
      this.getCurrentTime(), this._options.waitingBufferedTime;
      var t = this.tag.buffered;
      for (i = 0; i < t.length; i++) t.start(i), t.end(i)
    }, t.exports = M
  }, {
    "../../commonui/autostreamselector": 201,
    "../../config": 204,
    "../../feature/autoPlayDelay": 206,
    "../../lang/index": 210,
    "../../lib/constants": 214,
    "../../lib/cookie": 215,
    "../../lib/dom": 217,
    "../../lib/event": 218,
    "../../lib/io": 223,
    "../../lib/object": 225,
    "../../lib/playerutil": 228,
    "../../lib/ua": 230,
    "../../lib/util": 232,
    "../../monitor/monitor": 237,
    "../../ui/component": 294,
    "../../ui/component/cover": 298,
    "../../ui/component/play-animation": 304,
    "../../ui/component/progressmarker": 307,
    "../../ui/exports": 324,
    "../service/export": 288,
    "./event/eventmanager": 241,
    "./event/eventtype": 242,
    "./plugin/lifecyclemanager": 264,
    "./x5play": 266
  }],
  262: [function (e, t, r) {
    var i = e("../../../lib/oo").extend({});
    t.exports = i
  }, {"../../../lib/oo": 226}],
  263: [function (e, t, r) {
    t.exports = {
      createEl: "createEl",
      created: "created",
      ready: "ready",
      loading: "loading",
      play: "play",
      pause: "pause",
      playing: "playing",
      waiting: "waiting",
      timeUpdate: "timeupdate",
      error: "error",
      ended: "ended",
      dispose: "dispose",
      markerDotOver: "markerDotOver",
      markerDotOut: "markerDotOut"
    }
  }, {}],
  264: [function (e, t, r) {
    function i(t) {
      (this._player = t)._status = "init", this.components = [];
      var e = t.getOptions().components;
      if (e && s.isArray(e) && 0 < e.length) for (var r = 0; r < e.length; r++) {
        var i = e[r];
        if (!i) return void console.log("The " + r + " custome component is " + i);
        if (constr = void 0 === i.type ? i : i.type, args = void 0 === i.args ? [] : i.args, name = void 0 === i.name ? "" : i.name, !constr) return void console.log(name + " compenent is " + constr);
        args = args && 0 < args.length ? [].concat.call([constr], args) : [];
        var n = new (Function.prototype.bind.apply(constr, args)), o = n[h.createEl];
        o && "function" == typeof o && o.call(n, t.el(), t), this.components.push({name: name, obj: n})
      }
      var a = this;
      t.on(c.Private.LifeCycleChanged, function (e) {
        0 != a.components.length && l.call(a, t, e)
      })
    }

    var s = e("../../../lib/object"), c = e("../event/eventtype"), h = e("./lifecycle"), n = e("./status");
    i.prototype.getComponent = function (e) {
      var t = null, r = this.components.length;
      if (e) for (var i = 0; i < r; i++) if (this.components[i].name == e) {
        t = this.components[i].obj;
        break
      }
      return t
    };
    var l = function (e, t) {
      if (t) {
        var r, i = t.paramData, n = i.type, o = i.data;
        (r = n) != c.Video.LoadStart && r != c.Video.LoadedData && r != c.Video.LoadedMetadata || (n = h.loading), d(e, n);
        for (var a = this.components.length, s = 0; s < a; s++) {
          var l = this.components[s].obj, u = l[n];
          u && "function" == typeof u && u.call(l, e, o)
        }
        n == c.Private.Dispose && (this.components = [])
      }
    }, d = function (e, t) {
      void 0 !== n[t] && (t != n.pause || e._status != n.error && e._status != n.ended) && (e._status = t)
    };
    t.exports = i
  }, {"../../../lib/object": 225, "../event/eventtype": 242, "./lifecycle": 263, "./status": 265}],
  265: [function (e, t, r) {
    t.exports = {
      init: "init",
      ready: "ready",
      loading: "loading",
      play: "play",
      pause: "pause",
      playing: "playing",
      waiting: "waiting",
      error: "error",
      ended: "ended"
    }
  }, {}],
  266: [function (e, t, r) {
    function i(e, t) {
      var r = e.el().style.height, i = e.el().style.width;
      e.originalLayout = {
        container: {height: r, width: i},
        video: {width: e.tag.style.width, height: e.tag.style.height}
      };
      var n = document.body.clientHeight * (window.devicePixelRatio || 1) + "px", o = document.body.clientWidth + "px";
      width = t ? (height = n, o) : (height = r.indexOf("%") ? r : r + "px", i.indexOf("%") ? i : i + "px"), e.tag.style.width = o, e.tag.style.height = n, e.el().style.height = t ? n : height
    }

    var n = e("../../lib/ua"), o = e("../../lib/dom");
    t.exports.isAndroidX5 = function () {
      return n.os.android && n.is_X5 || n.dingTalk()
    }, t.exports.adaptX5Play = function (r) {
      n.os.android && n.is_X5 && ("h5" == r._options.x5_type && (r.tag.setAttribute("x5-video-player-type", r._options.x5_type), window.onresize = function () {
        var e, t;
        i(r, r._options.x5_fullscreen || "center" == r._options.x5_video_position), "landscape" == (e = r)._x5VideoOrientation && (e._originalTagWidth = e.tag.style.width, e._originalTagHeight = e.tag.style.height, (t = document.querySelector("#" + e.id() + " .prism-controlbar")) && parseFloat(t.offsetHeight), e.tag.style.height = "100%", e.tag.style.width = window.screen.width + "px")
      }, r.tag.addEventListener("x5videoenterfullscreen", function () {
        i(r, r._options.x5_fullscreen || "center" == r._options.x5_video_position), r.trigger("x5requestFullScreen")
      }), r.tag.addEventListener("x5videoexitfullscreen", function () {
        var e, t;
        (e = r).originalLayout && (t = e.originalLayout, e.el().style.height = t.container.height, e.el().style.width = t.container.width, e.tag.style.width = t.video.width, e.tag.style.height = t.video.height), r.trigger("x5cancelFullScreen"), r.fullscreenService.getIsFullScreen() && r.fullscreenService.cancelFullScreen()
      }), r.on("requestFullScreen", function () {
        "top" == r._options.x5_video_position && o.removeClass(r.tag, "x5-top-left"), n.os.android && n.is_X5 && r._options.x5LandscapeAsFullScreen && (r.tag.setAttribute("x5-video-orientation", "landscape"), r._x5VideoOrientation = "landscape")
      }), r.on("cancelFullScreen", function () {
        "top" == r._options.x5_video_position && o.addClass(r.tag, "x5-top-left"), n.os.android && n.is_X5 && r._options.x5LandscapeAsFullScreen && (r.tag.setAttribute("x5-video-orientation", "portrait"), i(r, r._options.x5_fullscreen || "center" == r._options.x5_video_position), r._x5VideoOrientation = "portrait")
      })), void 0 !== r._options.x5_fullscreen && r._options.x5_fullscreen && (r.tag.setAttribute("x5-video-player-fullscreen", r._options.x5_fullscreen), o.addClass(r.tag, "x5-full-screen")), "top" == r._options.x5_video_position && o.addClass(r.tag, "x5-top-left"), void 0 !== r._options.x5_orientation && r.tag.setAttribute("x5-video-orientation", r._options.x5_orientation))
    }
  }, {"../../lib/dom": 217, "../../lib/ua": 230}],
  267: [function (e, t, r) {
    var h = e("../../lib/io"), d = e("../../config"), f = e("../../lib/constants"), p = e("../../lib/util"),
        y = e("../../lib/playerutil"), m = (e("../../lib/dom"), e("../../lang/index")),
        g = e("../base/event/eventtype"), b = e("../saas/drm");
    t.exports.inject = function (e, t, r, i, a, n, o) {
      var s, l, u = i.source;

      function c(e, t) {
        var r = "Error code:" + t.code + "message:" + t.message;
        console.log(r);
        var i = f.ErrorCode.OtherError, r = m.get("Error_Play_Text");
        t.code == shaka.util.Error.Code.EXPIRED ? (i = f.ErrorCode.AuthKeyExpired, r = m.get("DRM_License_Expired")) : t.code == shaka.util.Error.Code.HTTP_ERROR ? (i = f.ErrorCode.NetworkError, r = m.get("Http_Error")) : t.code == shaka.util.Error.Code.HTTP_ERROR ? (i = f.ErrorCode.LoadingTimeout, r = m.get("Http_Timeout")) : t.category == shaka.util.Error.NETWORK && (i = f.ErrorCode.NetworkError, r = m.get("Error_Network_Text"));
        var n;
        setTimeout(function () {
          e.trigger(g.Private.Play_Btn_Hide)
        }), e.checkOnline() && (n = {
          mediaId: e._options.vid ? e._options.vid : "",
          error_code: i,
          error_msg: t.message
        }, e.logError(n), n.display_msg = t.code + "|" + r, e.trigger(g.Player.Error, n))
      }

      !n && (s = u, e._drm || !y.isDash(s)) || (t.prototype._checkDrmReady = function () {
        if (null == e._drm) throw new Error("please invoke this method after ready event")
      }, e._isDrm = !0, e._drm = null, e._isLoadedDrm = !1, t.prototype.play = function (e) {
        this._checkDrmReady(), this._isManualPlay = e || !1;
        return this.trigger(g.Private.Cover_Hide), this.tag.ended ? this.replay() : (this.getCurrentTime(), this.tag.paused && this.tag.play()), this
      }, t.prototype.replay = function () {
        var e;
        return this.tag.paused && (this._monitor && this._monitor.replay(), (e = this)._drm.load(this._options.source).then(function () {
          e._options._autoplay = !0, e._initPlayBehavior(!0), console.log("The video has now been loaded!")
        })["catch"](c)), this
      }, t.prototype.pause = function (e) {
        return this._checkDrmReady(), this._isManualPause = e || !1, this.tag.pause(), this
      }, t.prototype.stop = function () {
        return this._checkDrmReady(), this.tag.setAttribute("src", null), this
      }, t.prototype.initPlay = function (e) {
        if (p.contentProtocolMixed(u)) {
          var t = {
            mediaId: this._options.vid ? this._options.vid : "",
            error_code: f.ErrorCode.InvalidSourceURL,
            error_msg: "InvalidSourceURL"
          };
          return t.display_msg = m.get("Request_Block_Text"), void this.trigger(g.Player.Error, t)
        }

        function r(r, t) {
          function i() {
            l(r, r._drm);
            var e = {drm: {requestLicenseKey: b.requestLicenseKey(r), servers: {}}};
            f.DRMKeySystem[4] && (e.drm.servers[f.DRMKeySystem[5]] = "https://foo.bar/drm/widevine", e.drm.servers[f.DRMKeySystem[4]] = "https://foo.bar/drm/playready"), r._drm.configure(e), a && a(r._drm), o && r._executeReadyCallback(), r._drm.load(r._options.source).then(function () {
              r._initPlayBehavior(t), console.log("The video has now been loaded!")
            })["catch"](function (e) {
              c(r, e)
            })
          }

          function n(e) {
            var t;
            !e || r.__support && r.__support.drm[e] ? i() : (t = {
              mediaId: r._options.vid ? r._options.vid : "",
              error_code: f.ErrorCode.EncrptyVideoNotSupport,
              error_msg: m.get("Not_Support_DRM")
            }, r.trigger(g.Player.Error, t))
          }

          var o = !r._drm;
          r.destroy(function (t) {
            try {
              t._drm = new shaka.Player(t.tag);
              var r, e = t._getItemBySource();
              e ? (r = f.DRMKeySystem[e.encryptionType], t.__support ? n(r) : shaka.Player.probeSupport().then(function (e) {
                t.__support = e, n(r)
              })) : i()
            } catch (e) {
              console.log(e)
            }
          })
        }

        (that = this)._isLoadedDrm && "undefined" != typeof shaka ? r(this, e) : (this.trigger(g.Private.H5_Loading_Show), function (e) {
          var t = "aliplayer-drm-min.js", r = "",
              r = d.domain ? "https://" + d.domain + "/de/prismplayer/" + d.h5Version + "/drm/" + t : "/build/drm/" + t,
              i = this;
          h.loadJS(r, function () {
            shaka.polyfill.installAll(), e.apply(i)
          })
        }.call(that, function () {
          this._isLoadedDrm = !0, r(this, e)
        }))
      }, t.prototype.destroy = function (e) {
        var t;
        this._drm ? (t = this)._drm.destroy().then(function () {
          t._drm = null, e(t)
        }) : e(this)
      }, t.prototype.dispose = function () {
        r.dispose.call(this), this.destroy()
      }, t.prototype._getDRMEncryptItem = function () {
        var e = this._urls;
        if (e && 0 < e.length) {
          for (var t = e.length, r = 0; r < t; r++) {
            var i = e[r];
            if (i.Url == this._options.source && +i.encryption) return i
          }
          return ""
        }
        return ""
      }, t.prototype._getItemBySource = function () {
        var e = this._urls;
        if (e && 0 < e.length) {
          for (var t = e.length, r = 0; r < t; r++) {
            var i = e[r];
            if (i.Url == this._options.source) return i
          }
          return ""
        }
        return ""
      }, l = function (t, e) {
        e.addEventListener("error", function (e) {
          c(t, e.detail)
        })
      })
    }
  }, {
    "../../config": 204,
    "../../lang/index": 210,
    "../../lib/constants": 214,
    "../../lib/dom": 217,
    "../../lib/io": 223,
    "../../lib/playerutil": 228,
    "../../lib/util": 232,
    "../base/event/eventtype": 242,
    "../saas/drm": 277
  }],
  268: [function (e, t, r) {
    var i = e("../base/player"), n = e("./drminjector"), o = i.extend({
      init: function (e, t) {
        n.inject(this, o, i.prototype, t, function (e) {
        }), t._native = !1, i.call(this, e, t)
      }
    });
    t.exports = o
  }, {"../base/player": 261, "./drminjector": 267}],
  269: [function (e, t, r) {
    var n = e("../../ui/component"), o = e("../../lib/data"), s = e("../../lib/ua"), a = e("../../lib/constants"),
        l = e("../../lib/dom"), u = e("../../lib/object"), c = e("../../config"), h = e("../../lang/index"),
        d = e("../../lib/playerutil"), f = e("../../lib/util"), i = e("../../ui/component/info-display"),
        p = e("../../ui/component/error-display"), y = e("../../feature/autoPlayDelay"),
        m = e("../../commonui/autostreamselector"), g = e("../base/event/eventtype"), b = e("../saas/ststoken"),
        v = n.extend({
          init: function (e, t) {
            var r, i;
            void 0 === t.skinLayout && (t.skinLayout = d.defaultFlashLayout), n.call(this, this, t), this._id = "prism-player-" + o.guid(), this.tag = e, this._el = this.tag, this._childrenUI = [p], this.initChildren(), this.id = this._id, window[this.id] = this, h.setCurrentLanguage(this._options.language, "flash", this._options.languageTexts), f.openInFile() ? (r = {
              mediaId: this._options.vid ? this._options.vid : "",
              error_code: a.ErrorCode.FormatNotSupport,
              error_msg: h.get("Open_Html_By_File", "flash")
            }, this.trigger(g.Private.Error_Show, r)) : s.IS_MOBILE ? this.trigger(g.Private.Error_Show, {
              mediaId: this._options.vid ? this._options.vid : "",
              error_code: a.ErrorCode.FormatNotSupport,
              error_msg: h.get("Cant_Use_Flash_On_Mobile", "flash")
            }) : (this._options.vid && this._options.accessKeyId && this._options.securityToken && this._options.accessKeySecret ? (i = this, b.getPlayAuth(this._options, function (e) {
              i._options.playauth = e, i._createPlayer()
            }, function (e) {
              var t = {mediaId: i._options.vid, error_code: e.Code, error_msg: e.Message};
              e.sri && (t.sri = e.sri), t.display_msg = e.display_msg, i.trigger(g.Private.Error_Show, t)
            }, "flash")) : this._createPlayer(), this._status = "init")
          }, _createPlayer: function () {
            var e, t, r;
            this._options.autoPlayDelay ? (e = new y(this), t = this, e.handle(function () {
              t._options.autoplay = !0, t._initPlayer(), t._childrenUI = [i, m], t.initChildren()
            })) : (this._initPlayer(), this._childrenUI = [i, m], this.initChildren()), s.HAS_FLASH || (r = h.get("Flash_Not_Ready", "flash"), this.trigger(g.Private.Info_Show, {
              text: r,
              align: "tc",
              isBlack: !1
            }))
          }, _initPlayer: function () {
            var e = "//" + c.domain + "/de/prismplayer-flash/" + c.flashVersion + "/PrismPlayer.swf";
            this._options.playerSwfPath ? e = this._options.playerSwfPath : c.domain ? -1 < c.domain.indexOf("localhost") && (e = "//" + c.domain + "/build/flash//PrismPlayer.swf") : e = "de/prismplayer-flash/" + c.flashVersion + "/PrismPlayer.swf";
            var t = this._comboFlashVars(), r = this._options.wmode ? this._options.wmode : "opaque";
            this.tag.innerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=5,0,0,0" width="100%" height="100%" id="' + this.id + '"><param name=movie value="' + e + '"><param name=quality value=High><param name="FlashVars" value="' + t + '"><param name="WMode" value="' + r + '"><param name="AllowScriptAccess" value="always"><param name="AllowFullScreen" value="true"><param name="AllowFullScreenInteractive" value="true"><embed name="' + this.id + '" src="' + e + '" quality=high pluginspage="//www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" width="100%" height="100%" AllowScriptAccess="always" AllowFullScreen="true" AllowFullScreenInteractive="true" WMode="' + r + '" FlashVars="' + t + '"></embed></object>'
          }, _getPlayer: function (e) {
            return -1 != navigator.appName.indexOf("Microsoft") ? document.getElementById(e) : document[e]
          }, _getLowerQualityLevel: function () {
            var e = this._getVideoUrls();
            if (!e) return "";
            var t = e.Urls, r = e.index;
            return !(t && 0 == t.length || -1 == r) && 0 < r ? {item: t[r - 1], index: r - 1} : ""
          }, _comboFlashVars: function () {
            var e = encodeURIComponent(s.getReferer()), t = s.getHref(), r = encodeURIComponent(t), i = "";
            t && (i = s.getHost(t));
            var n = this._options, o = {
              autoPlay: n.autoplay ? 1 : 0,
              isInner: 0,
              actRequest: 1,
              vid: n.vid,
              diagnosisButtonVisible: n.diagnosisButtonVisible ? 1 : 0,
              domain: n.domain ? n.domain : "//tv.taobao.com",
              statisticService: n.statisticService ? n.statisticService : c.logReportTo,
              videoInfoService: n.videoInfoService ? n.videoInfoService : "/player/json/getBaseVideoInfo.do",
              disablePing: n.trackLog ? 0 : 1,
              namespace: this.id,
              barMode: 0 != n.barMode ? 1 : 0,
              isLive: n.isLive ? 1 : 0,
              waterMark: n.waterMark,
              environment: n.environment,
              vurl: n.source ? encodeURIComponent(n.source) : "",
              plugins: n.plugins ? n.plugins : "",
              snapShotShow: n.snapshot ? 1 : 0,
              accessId: n.accId ? n.accId : "",
              accessKey: n.accSecret ? n.accSecret : "",
              apiKey: n.apiKey ? n.apiKey : "",
              flashApiKey: n.flashApiKey ? n.flashApiKey : "",
              disableSeek: n.disableSeek ? 1 : 0,
              disableFullScreen: n.disableFullScreen ? 1 : 0,
              stsToken: n.stsToken ? n.stsToken : "",
              domainRegion: n.domainRegion ? n.domainRegion : "",
              authInfo: n.authInfo ? encodeURIComponent(n.authInfo) : "",
              playDomain: n.playDomain ? n.playDomain : "",
              stretcherZoomType: n.stretcherZoomType ? n.stretcherZoomType : "",
              playauth: n.playauth ? n.playauth.replace(/\+/g, "%2B") : "",
              prismType: n.prismType ? n.prismType : 0,
              formats: n.formats ? n.formats : "",
              notShowTips: n.notShowTips ? 1 : 0,
              showBarTime: n.showBarTime ? n.showBarTime : 0,
              showBuffer: 0 == n.showBuffer ? 0 : 1,
              rePlay: n.rePlay ? 1 : 0,
              encryp: n.encryp ? n.encryp : "",
              secret: n.secret ? n.secret : "",
              mediaType: "video",
              logInfo: {
                ud: s.getHost(n.source),
                os: s.os.name,
                ov: s.os.version || "",
                et: s.browser.name,
                ev: s.browser.version || "",
                uat: s.USER_AGENT,
                r: e,
                pu: r,
                app_n: i
              }
            }, a = [];
            return void 0 !== n.rtmpBufferTime && (o.rtmpBufferTime = n.rtmpBufferTime), n.cover && (o.cover = n.cover), n.extraInfo && (o.extraInfo = encodeURIComponent(JSON.stringify(n.extraInfo))), o.logInfo && (o.logInfo = encodeURIComponent(JSON.stringify(o.logInfo))), o.languageData = encodeURIComponent(JSON.stringify(h.getLanguageData("flash"))), o.language = h.getCurrentLanguage(), u.each(o, function (e, t) {
              a.push(e + "=" + t)
            }), a.join("&")
          }, initChildren: function () {
            for (var e = this._childrenUI.length, t = 0; t < e; t++) {
              var r = new this._childrenUI[t](this, this._options), i = r.el();
              i.id = r.id(), this.contentEl().appendChild(i), r.bindEvent()
            }
            var n = document.querySelector("#" + this._options.id + " .prism-info-display");
            l.css(n, "display", "none")
          }, flashReady: function () {
            this.flashPlayer = this._getPlayer(this.id), this._isReady = !0;
            var e, t = this._options.skinRes, r = this._options.skinLayout;
            if (!1 !== r && !u.isArray(r)) throw new Error("PrismPlayer Error: skinLayout should be false or type of array!");
            if ("string" != typeof t) throw new Error("PrismPlayer Error: skinRes should be string!");
            e = 0 != r && 0 !== r.length && {
              skinRes: t,
              skinLayout: r
            }, this.flashPlayer.setPlayerSkin(e), this.trigger("ready");
            var i = this;
            window.addEventListener("beforeunload", function () {
              try {
                i.flashPlayer.setPlayerCloseStatus()
              } catch (e) {
              }
            })
          }, jsReady: function () {
            return !0
          }, snapshoted: function (e) {
            var t = f.toBinary(e), r = "data:image/jpeg;base64," + e;
            this.trigger("snapshoted", {time: this.getCurrentTime(), base64: r, binary: t})
          }, uiReady: function () {
            this._status = "ready", this.trigger("uiReady")
          }, loadedmetadata: function () {
            "ended" != this._status && (this._status = "loading", this.trigger("loadedmetadata"))
          }, onPlay: function () {
            this._status = "play", this.trigger("play"), this._clearTimeoutHandle(), this.trigger(g.Private.AutoStreamHide)
          }, onEnded: function () {
            this._clearTimeoutHandle(), this._status = "ended", this.trigger("ended")
          }, onPause: function () {
            this._status = "pause", this._clearTimeoutHandle(), this.trigger(g.Private.AutoStreamHide), this.trigger("pause")
          }, onBulletScreenReady: function () {
            this.trigger("bSReady")
          }, onBulletScreenMsgSend: function (e) {
            this.trigger("bSSendMsg", e)
          }, onVideoRender: function (e) {
            this._clearTimeoutHandle(), this.trigger("videoRender"), this.trigger("canplay", {loadtime: e})
          }, onVideoError: function (e) {
            this._clearTimeoutHandle(), this._status = "error", this.trigger("error", {errortype: e})
          }, onM3u8Retry: function () {
            this.trigger("m3u8Retry")
          }, hideBar: function () {
            this.trigger("hideBar")
          }, showBar: function () {
            this.trigger("showBar")
          }, liveStreamStop: function () {
            this.trigger("liveStreamStop")
          }, stsTokenExpired: function () {
            this._status = "error", this.trigger("stsTokenExpired")
          }, onVideoBuffer: function () {
            var e;
            "pause" != this._status && (this._status = "waiting", this.trigger("waiting"), this._clearTimeoutHandle(), (e = this)._checkTimeoutHandle = setTimeout(function () {
              e.trigger(g.Private.AutoStreamShow)
            }, 1e3 * this._options.loadDataTimeout), this._checkVideoStatus())
          }, startSeek: function (e) {
            this.trigger("startSeek", e)
          }, completeSeek: function (e) {
            this.trigger("completeSeek", e)
          }, _invoke: function () {
            var e = arguments[0], t = arguments;
            if (Array.prototype.shift.call(t), !this.flashPlayer) throw new Error("PrismPlayer Error: flash player is not ready\uff0cplease use api after ready event occured!");
            if ("function" != typeof this.flashPlayer[e]) throw new Error("PrismPlayer Error: function " + e + " is not found!");
            return this.flashPlayer[e].apply(this.flashPlayer, t)
          }, play: function () {
            this._invoke("playVideo")
          }, replay: function () {
            this._invoke("replayVideo")
          }, pause: function () {
            this._invoke("pauseVideo")
          }, stop: function () {
            this._invoke("stopVideo")
          }, seek: function (e) {
            this._invoke("seekVideo", e)
          }, getCurrentTime: function () {
            return this._invoke("getCurrentTime")
          }, getDuration: function () {
            return this._invoke("getDuration")
          }, getStatus: function () {
            return this._status
          }, _getVideoUrls: function () {
            var e = this._invoke("getVideoUrls"), t = [];
            if (e && e.Urls) for (var r = 0; r < e.Urls.length; r++) {
              var i = e.Urls[r].value, n = i.desc.indexOf("_"), o = h.get(i.definition, "flash");
              i.desc = 0 < n ? o + "_" + i.height : o, t.push(i)
            }
            return {Urls: t, index: e.index}
          }, _getVideoStatus: function () {
            return this._invoke("getVideoStatus")
          }, _checkVideoStatus: function () {
            var t, r;
            this.flashPlayer && !this._checkVideoStatusHandler && (t = this, (r = function () {
              t._checkVideoStatusHandler = setTimeout(function () {
                var e = t._getVideoStatus();
                "playing" == e.videoStatus && "bufferFull" == e.bufferStatus ? (t._status = "playing", t._clearTimeoutHandle()) : "videoPlayOver" == e.videoStatus && (t._status = "ended", t._clearTimeoutHandle()), r()
              }, 500)
            })())
          }, _clearTimeoutHandle: function () {
            this._checkTimeoutHandle && (clearTimeout(this._checkTimeoutHandle), this._checkTimeoutHandle = null)
          }, _changeStream: function (e) {
            return this._invoke("changeStream", e)
          }, mute: function () {
            this.setVolume(0)
          }, unMute: function () {
            this.setVolume(.5)
          }, getVolume: function () {
            return this._invoke("getVolume")
          }, setVolume: function (e) {
            this._invoke("setVolume", e)
          }, loadByVid: function (e) {
            this._invoke("loadByVid", e, !1)
          }, loadByUrl: function (e, t) {
            this._invoke("loadByUrl", e, t)
          }, dispose: function () {
            this._clearTimeoutHandle(), this._checkVideoStatusHandler && (clearTimeout(this._checkVideoStatusHandler), this._checkVideoStatusHandler = null), this._invoke("pauseVideo");
            var e = this;
            setTimeout(function () {
              e.off("completeSeek"), e.off("startSeek"), e.off("stsTokenExpired"), e.off("liveStreamStop"), e.off("showBar"), e.off("hideBar"), e.off("m3u8Retry"), e.off("error"), e.off("canplay"), e.off("pause"), e.off("ended"), e.off("play"), e.off("loadedmetadata"), e.off("snapshoted"), e.off("uiReady"), e.off("ready"), e.flashPlayer = null, e._el && (e._el.innerHTML = "")
            })
          }, showBSMsg: function (e) {
            this._invoke("showBSMsg", e)
          }, setToastEnabled: function (e) {
            this._invoke("setToastEnabled", e)
          }, setLoadingInvisible: function () {
            this._invoke("setLoadingInvisible")
          }, setPlayerSize: function (e, t) {
            this._el.style.width = e, this._el.style.height = t
          }
        });
    t.exports = v
  }, {
    "../../commonui/autostreamselector": 201,
    "../../config": 204,
    "../../feature/autoPlayDelay": 206,
    "../../lang/index": 210,
    "../../lib/constants": 214,
    "../../lib/data": 216,
    "../../lib/dom": 217,
    "../../lib/object": 225,
    "../../lib/playerutil": 228,
    "../../lib/ua": 230,
    "../../lib/util": 232,
    "../../ui/component": 294,
    "../../ui/component/error-display": 299,
    "../../ui/component/info-display": 302,
    "../base/event/eventtype": 242,
    "../saas/ststoken": 282
  }],
  270: [function (e, t, r) {
    var s = e("../../lib/io"), h = e("../../config"), d = e("../../lib/constants"), f = e("../../lib/util"),
        c = e("../../lib/playerutil"), p = (e("../../lib/dom"), e("../../lib/ua")), y = e("../../lang/index"),
        m = e("../base/event/eventtype");
    e("../base/player");
    t.exports.inject = function (e, t, r, i, l, n) {
      var o, u, a = i.source;
      !n && (o = a, e._flv || !c.isFlv(o)) || (e._Type = t, e._superType = r, e._superPt = r.prototype, e._disposed = !1, t.prototype._checkFlvReady = function () {
        if (null == e._flv) throw new Error("please invoke this method after ready event")
      }, e._isFlv = !0, e._flv = null, e._isLoadedFlv = !1, e._originalUrl = "", t.prototype.play = function (e) {
        this._checkFlvReady(), this._isManualPlay = e || !1;
        var t;
        return this.trigger(m.Private.Cover_Hide), this._options.isLive && e ? this._loadByUrlInner(this._options.source, 0, e) : this.tag.ended || this._ended ? this.replay() : (0 == this._seeking && (t = 0, this.tag.ended || this._ended || 0 == (t = this.getCurrentTime()) && (t = -1), -1 != t && this.seek(t)), this.tag.paused && (this._hasLoaded || (this.getMetaData(), this._flv.load()), this._flv.play())), this
      }, t.prototype.seek = function (e) {
        this._checkFlvReady(), this._seeking = !0, e === this.tag.duration && e--;
        try {
          this._flv.currentTime = e
        } catch (e) {
          console.log(e)
        }
        return this
      }, t.prototype.pause = function (e) {
        return this._checkFlvReady(), this._isManualPause = e || !1, this._flv.pause(), this
      }, t.prototype.getProgramDateTime = function () {
        if (this._checkFlvReady(), !this._metadata) return "";
        var e = this._flv.getFirstSample(), t = e && e.pts ? e.pts : 0;
        return console.log("\u63a8\u6d41\u65f6\u95f4\uff1a" + this._metadata.NtpTime), console.log("\u9996\u5e27PTS\uff1a" + t), this._metadata.NtpTime + t
      }, t.prototype.initPlay = function (e) {
        if (p.browser.safari && this.trigger(m.Private.Snapshot_Hide), f.contentProtocolMixed(a)) {
          var t = {
            mediaId: this._options.vid ? this._options.vid : "",
            error_code: d.ErrorCode.InvalidSourceURL,
            error_msg: "InvalidSourceURL"
          };
          return t.display_msg = y.get("Request_Block_Text"), void this.trigger(m.Player.Error, t)
        }

        function r(t, e) {
          var r = !t._flv;
          t._destroyFlv();
          var i, n = t._options.isLive, o = {isLive: n, enableWorker: t._options.enableWorker, stashInitialSize: 2048},
              a = {type: "flv", isLive: n, url: t._options.source};
          for (var s in n ? (o.enableStashBuffer = t._options.enableStashBufferForFlv, stashInitialSize = t._options.stashInitialSizeForFlv, o.autoCleanupSourceBuffer = !1) : o.lazyLoadMaxDuration = 600, t._options.flvOption) "cors" == s || "hasAudio" == s || "withCredentials" == s || "hasVideo" == s || "type" == s ? a[s] = t._options.flvOption[s] : o[s] = t._options.flvOption[s];
          t._originalUrl = t._options.source, flvjs.LoggingControl.enableAll = t._options.debug, t._flv = flvjs.createPlayer(a, o), u(t, t._flv), t._flv.on(flvjs.Events.MEDIA_INFO, function (e) {
            t._metadata = e.metadata
          }), t._flv.attachMediaElement(t.tag), t._initPlayBehavior(e) && ((t._options.preload || t._options.autoplay) && (t._hasLoaded = !0, t._flv.load()), t._options.autoplay && !t.tag.paused && t._flv.play(), l && l(t._flv), r && (t._executeReadyCallback(), t._urls && 0 < t._urls.length && !t._options.defaultDefinition && (t._currentPlayIndex = c.findSelectedStreamLevel(t._urls), i = t._urls[t._currentPlayIndex], t._options.source = i.Url, t.trigger(m.Private.SourceLoaded, i))))
        }

        (that = this)._isLoadedFlv && "undefined" != typeof Hls ? setTimeout(function () {
          r(that, e)
        }, 1e3) : (this.trigger(m.Private.H5_Loading_Show), function (e, t) {
          var r = "aliplayer-flv-min.js", i = "",
              i = h.domain ? "https://" + h.domain + "/de/prismplayer/" + h.h5Version + "/flv/" + r : "/build/flv/" + r,
              n = this;
          s.loadJS(i, function () {
            e.apply(n)
          })
        }.call(that, function () {
          this._isLoadedFlv = !0, r(this, e)
        }, this._options.debug))
      }, t.prototype._destroyFlv = function () {
        try {
          this._flv && (this._flv.pause(), this._flv.destroy())
        } catch (e) {
          console.log(e)
        }
        this.loaded = !1, this._hasLoaded = !1, this._flv = null
      }, t.prototype.dispose = function () {
        this._disposed || (this._disposed = !0, this._superPt && this._superPt.dispose.call(this), this._destroyFlv(), this._superPt && (t.prototype.play = this._superPt.play, t.prototype.pause = this._superPt.pause, t.prototype.initPlay = this._superPt.initPlay, t.prototype.seek = this._superPt.seek, t.prototype.canSeekable = this._superPt.canSeekable))
      }, t.prototype.canSeekable = function (e) {
        var t = this._flv.mediaInfo;
        return !(!this._flv._isTimepointBuffered(e) && t && !t.hasKeyframesIndex)
      }, u = function (u, e) {
        var c = !1;
        e.on(flvjs.Events.ERROR, function (e, t, r) {
          var i, n = d.ErrorCode.OtherError, o = y.get("Error_Play_Text");
          t == flvjs.ErrorDetails.NETWORK_EXCEPTION ? !(i = u.getOptions().source) || 0 != i.toLowerCase().indexOf("http://") && 0 != i.toLowerCase().indexOf("https://") ? (n = d.ErrorCode.InvalidSourceURL, o = y.get("Error_Invalidate_Source_Widthout_Protocal"), c = !0) : o = navigator.onLine ? (n = d.ErrorCode.RequestDataError, y.get("Maybe_Cors_Error")) : (n = d.ErrorCode.NetworkError, y.get("Error_Network_Text")) : t == flvjs.ErrorDetails.NETWORK_STATUS_CODE_INVALID ? "404" == r.code ? (n = d.ErrorCode.NotFoundSourceURL, o = y.get("Error_Not_Found")) : "403" == r.code ? (n = d.ErrorCode.AuthKeyExpired, o = y.get("Error_AuthKey_Text"), c = !0) : (n = d.ErrorCode.NetworkError, o = y.get("Error_Network_Text")) : t == flvjs.ErrorDetails.NETWORK_TIMEOUT ? (n = d.ErrorCode.LoadingTimeout, o = y.get("Error_Waiting_Timeout_Text")) : t != flvjs.ErrorDetails.MEDIA_FORMAT_UNSUPPORTED && t != flvjs.ErrorDetails.MEDIA_CODEC_UNSUPPORTED || (n = d.ErrorCode.FormatNotSupport, o = y.get("Error_H5_Not_Support_Text"), c = !0);

          function a() {
            var e;
            setTimeout(function () {
              u.trigger(m.Private.Play_Btn_Hide)
            }), u.checkOnline() && (e = {
              mediaId: u._options && u._options.vid ? u._options.vid : "",
              error_code: n,
              error_msg: r.msg
            }, u.logError(e), e.display_msg = o, h.cityBrain && (u.flv = null), u.trigger(m.Player.Error, e))
          }

          if (u._options && u._options.isLive && !c) {
            var s, l = u._options;
            l.liveRetry > u._liveRetryCount ? (0 == u._liveRetryCount && u.trigger(m.Player.OnM3u8Retry), s = l.liveRetryInterval + l.liveRetryStep * u._liveRetryCount, u._liveRetryCount++, f.sleep(1e3 * s), u._loadByUrlInner(l.source)) : (u._liveErrorHandle && clearTimeout(u._liveErrorHandle), u.trigger(m.Player.LiveStreamStop), u._liveErrorHandle = setTimeout(a, 500))
          } else {
            if (u._reloadForVod()) return;
            a()
          }
        })
      })
    }
  }, {
    "../../config": 204,
    "../../lang/index": 210,
    "../../lib/constants": 214,
    "../../lib/dom": 217,
    "../../lib/io": 223,
    "../../lib/playerutil": 228,
    "../../lib/ua": 230,
    "../../lib/util": 232,
    "../base/event/eventtype": 242,
    "../base/player": 261
  }],
  271: [function (e, t, r) {
    var i = e("../base/player"), n = e("./flvinjector"), o = i.extend({
      init: function (e, t) {
        n.inject(this, o, i, t, function (e) {
        }), t._native = !1, i.call(this, e, t)
      }
    });
    t.exports = o
  }, {"../base/player": 261, "./flvinjector": 270}],
  272: [function (e, t, r) {
    var f = e("../../lib/io"), p = e("../../config"), y = e("../../lib/constants"), m = e("../../lib/util"),
        g = e("../../lib/playerutil"), b = (e("../../lib/dom"), e("../../lib/ua")), v = e("../../lang/index"),
        _ = e("../base/event/eventtype");
    e("../base/player");
    t.exports.inject = function (e, t, r, i, o, n) {
      var a, s, l, u, c = i.source, h = i.useHlsPluginForSafari, d = i.useHlsPlugOnMobile;
      (o || n || (a = c, s = h, l = d, !e._hls && g.isHls(a) && (!g.canPlayHls() || g.isSafariUsedHlsPlugin(s) || l && g.isUsedHlsPluginOnMobile()))) && (e._Type = t, e._superType = r, e._superPt = r.prototype, e._disposed = !1, t.prototype._checkHlsReady = function () {
        if (null == e._hls) throw new Error("please invoke this method after ready event")
      }, e._isHls = !0, e._hls = null, e._isLoadedHls = !1, e._stopLoadAsPaused = !0, t.prototype.play = function (e) {
        this._checkHlsReady(), this._isManualPlay = e || !1;
        var t;
        return this.trigger(_.Private.Cover_Hide), this._options.autoplay || this._options.preload || this._loadSourced || (this._loadSourced = !0, this._options._autoplay = !0, this._hls.loadSource(this._options.source)), this.tag.ended || this._ended ? this.replay() : this.tag.paused && (this.tag.play(), this._stopLoadAsPaused && (t = this.getCurrentTime(), this._hls.startLoad(t))), this
      }, t.prototype.replay = function () {
        return this._monitor && this._monitor.replay(), this._hls.startLoad(0), this.tag.play(), this
      }, t.prototype.pause = function (e) {
        return this.tag && (this._checkHlsReady(), this.tag.pause(), this._stopLoadAsPaused && this._hls.stopLoad()), this._isManualPause = e || !1, this
      }, t.prototype.stop = function () {
        return this._checkHlsReady(), this.tag.setAttribute("src", null), this._hls.stopLoad(), this
      }, t.prototype.seek = function (e) {
        this._checkHlsReady();
        try {
          this._superPt.seek.call(this, e), this.tag.paused && this._stopLoadAsPaused && this._hls.startLoad(e)
        } catch (e) {
          console.log(e)
        }
        return this
      }, t.prototype.getProgramDateTime = function () {
        if (this._checkHlsReady(), -1 == this._hls.currentLevel) return "";
        var e = this._hls.currentLevel, t = this._hls.levels[e].details;
        if (t) {
          var r = t.programDateTime;
          if (console.log("ProgramDateTime=" + r), r) return new Date(r).valueOf()
        }
        return 0
      }, t.prototype._reloadAndPlayForM3u8 = function () {
        0 == this._liveRetryCount && this.trigger(_.Player.OnM3u8Retry), this._liveRetryCount++
      }, t.prototype._switchLevel = function (e) {
        this.trigger(_.Player.LevelSwitch);
        for (var t = this._hls.levels, r = !0, i = 0; i < t.length; i++) if (t[i].url == e) {
          r = !1, this._hls.currentLevel = i;
          break
        }
        r && (this._hls.currentLevel = -1), this._switchedLevel = !0;
        var n = this;
        setTimeout(function () {
          n.trigger(_.Player.LevelSwitched), this._switchedLevel = !1
        }, 1e3)
      }, t.prototype.initPlay = function (e) {
        if (m.contentProtocolMixed(c)) {
          var t = {
            mediaId: this._options.vid ? this._options.vid : "",
            error_code: y.ErrorCode.InvalidSourceURL,
            error_msg: "InvalidSourceURL"
          };
          return t.display_msg = v.get("Request_Block_Text"), void this.trigger(_.Player.Error, t)
        }

        function r(s, t) {
          var r = !s._hls;
          s._destroyHls();
          var e = {
            xhrSetup: function (e, t) {
              e.withCredentials = s._options.withCredentials || !1
            }
          }, i = s._options.loadingTimeOut || s._options.hlsLoadingTimeOut;
          for (var n in i && (e.manifestLoadingTimeOut = i, e.levelLoadingTimeOut = i, e.fragLoadingTimeOut = i), s._options.liveSyncDurationCount && (e.liveSyncDurationCount = s._options.liveSyncDurationCount), s._options.defaultBandwidth && (e.defaultBandwidth = s._options.defaultBandwidth), s._options.isLive && (s._options.hlsFrameChasing && (e.hlsFrameChasing = s._options.hlsFrameChasing), s._options.chasingFirstParagraph && (e.chasingFirstParagraph = s._options.chasingFirstParagraph), s._options.chasingSecondParagraph && (e.chasingSecondParagraph = s._options.chasingSecondParagraph), s._options.chasingFirstSpeed && (e.chasingFirstSpeed = s._options.chasingFirstSpeed), s._options.chasingSecondSpeed && (e.chasingSecondSpeed = s._options.chasingSecondSpeed)), s._options.nudgeMaxRetry && (e.nudgeMaxRetry = s._options.nudgeMaxRetry), s._options.maxMaxBufferLength && (e.maxMaxBufferLength = s._options.maxMaxBufferLength), s._options.maxBufferSize && (e.maxBufferSize = s._options.maxBufferSize), s._options.fragLoadingRetryDelay && (e.fragLoadingRetryDelay = s._options.fragLoadingRetryDelay), s._options.maxBufferLength && (e.maxBufferLength = s._options.maxBufferLength), s._options.hlsBandWidthUpCacheTime && (e.abrBandWidthUpCacheTime = s._options.hlsBandWidthUpCacheTime), s._options.seamlessHandover && (e.seamlessHandover = s._options.seamlessHandover), s._options.accessKeyId && (e.accessKeyId = s._options.accessKeyId), s._options.accessKeySecret && (e.accessKeySecret = s._options.accessKeySecret), s._options.securityToken && (e.securityToken = s._options.securityToken), s._options.app && (e.app = s._options.app), s._options.stream && (e.stream = s._options.stream), s._options.domain && (e.domain = s._options.domain), o && (e._sce_dlgtqredxx = o), e.enableWorker = s._options.enableWorker, e.debug = s._options.debug, s._stopLoadAsPaused = s._options.hlsOption.stopLoadAsPaused, s._options.hlsOption) e[n] = s._options.hlsOption[n];
          b.IS_IE11 && o && (e.enableWorker = !1), s._hls = new Hls(e), u(s, s._hls), s._setLevels(), s._loadSourced = !1, s._hls.attachMedia(s.tag), s._hls.on(Hls.Events.FRAG_PARSING_USERDATA, function (e, t) {
            t && t.dataContent && t.dataContent.length && s.trigger(_.Player.SeiFrame, t.dataContent)
          }), s._hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            var e;
            s._hls.on(Hls.Events.MANIFEST_PARSED, function () {
              s._initPlayBehavior(t || s._loadSourced)
            }), s._hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, function (e, t) {
              s.trigger(_.Player.AudioTrackUpdated, t)
            }), s._hls.on(Hls.Events.MANIFEST_LOADED, function (e, t) {
              s.trigger(_.Player.LevelsLoaded, t)
            }), s._hls.on(Hls.Events.LEVEL_SWITCHED, function (e, t) {
              if (s._qualityService) {
                for (var r = s._hls.levels[t.level].url, i = s._qualityService.levels, n = "", o = "", a = 0; a < i.length; a++) if (i[a].Url == r) {
                  o = i[a].desc, n = i[a].bitrate;
                  break
                }
                (o || n) && s.trigger(_.Private.QualityChange, {levelSwitch: !0, url: r, bitrate: n, desc: o})
              }
            }), s._hls.on(Hls.Events.AUDIO_TRACK_SWITCH, function (e, t) {
              s.trigger(_.Player.AudioTrackSwitch, t), setTimeout(function () {
                s.trigger(_.Player.AudioTrackSwitched, t)
              }, 1e3)
            }), (s._options.autoplay || s._options.preload || t) && (s._loadSourced = !0, s._levels && 1 < s._levels.length ? (s.isMutiLevel || (s._hls.currentLevel = s._currentPlayIndex), s._hls.trigger(Hls.Events.MANIFEST_LOADING, {}), s._hls.trigger(Hls.Events.MANIFEST_LOADED, {levels: s._levels})) : s._hls.loadSource(s._options.source)), r && (s._executeReadyCallback(), s._urls && 0 < s._urls.length && !s._options.defaultDefinition && (s._currentPlayIndex = g.findSelectedStreamLevel(s._urls), e = s._urls[s._currentPlayIndex], s._options.source = e.Url, s.trigger(_.Private.SourceLoaded, e)))
          })
        }

        this._isLoadedHls && "undefined" != typeof Hls ? r(this, e) : (this.trigger(_.Private.H5_Loading_Show), function (e, t, r) {
          var i = "aliplayer-hls-min.js", n = "",
              n = p.domain ? "https://" + p.domain + "/de/prismplayer/" + p.h5Version + "/hls/" + i : "/build/hls/" + i,
              o = this;
          f.loadJS(n, function () {
            e.apply(o)
          })
        }.call(this, function () {
          this._isLoadedHls = !0, r(this, e)
        }, this._options.debug))
      }, t.prototype._getbwEstimator = function () {
        var e, t = NaN;
        return this._hls && (t = (e = this._hls.abrController._bwEstimator) ? e.getEstimate() : NaN), t
      }, t.prototype._destroyHls = function () {
        this._hls && this._hls.destroy(), this._hls = null
      }, t.prototype._setLevels = function () {
        if (!this._options.isLive) {
          for (var e = this._urls.length, t = [], r = 0; r < e; r++) {
            var i = this._urls[r];
            t.push({
              attrs: {},
              audioCodec: "mp4a.40.5",
              videoCodec: "avc1.42c01e",
              url: i.Url,
              width: i.width,
              height: i.height,
              bitrate: i.bitrate
            })
          }
          this._levels = t
        }
      }, t.prototype.dispose = function () {
        this._disposed || (this._disposed = !0, this._superPt && this._superPt.dispose.call(this), this._destroyHls(), this._superPt && (t.prototype.play = this._superPt.play, t.prototype.pause = this._superPt.pause, t.prototype.initPlay = this._superPt.initPlay, t.prototype.replay = this._superPt.replay, t.prototype.stop = this._superPt.stop, t.prototype.seek = this._superPt.seek, t.prototype.dispose = this._superPt.dispose))
      }, u = function (l, e) {
        e.on(Hls.Events.DEFAULT_BANDWIDTH, function (e, t) {
          l.trigger(_.Player.DefaultBandWidth, {width: t.width, height: t.height, bitrate: t.bitrate})
        }), e.on(Hls.Events.ERROR, function (e, t) {
          if (l._options && t.details != Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR && 1 != l._seeking && (0 != t.fatal || t.type == Hls.ErrorTypes.NETWORK_ERROR)) {
            l._clearTimeout();
            var r = y.ErrorCode.LoadedMetadata, i = v.get("Error_Play_Text"), n = !1;
            t.details == Hls.ErrorDetails.MANIFEST_LOAD_ERROR ? (n = !0, t.networkDetails, i = t.response ? "404" == t.response.code ? (r = y.ErrorCode.NotFoundSourceURL, v.get("Error_Not_Found")) : "403" == t.response.code ? (r = y.ErrorCode.AuthKeyExpired, v.get("Error_AuthKey_Text")) : "0" == t.response.code && navigator.onLine ? (r = y.ErrorCode.RequestDataError, i + "\uff0c" + v.get("Maybe_Cors_Error")) : v.get("Error_Load_M3U8_Failed_Text") : v.get("Error_Load_M3U8_Failed_Text")) : t.details == Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT ? (n = !0, i = v.get("Error_Load_M3U8_Timeout_Text")) : t.details == Hls.ErrorDetails.MANIFEST_PARSING_ERROR || t.details == Hls.ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR ? (n = !0, i = v.get("Error_M3U8_Decode_Text")) : t.type == Hls.ErrorTypes.NETWORK_ERROR ? (r = y.ErrorCode.NetworkError, i = v.get("Error_Network_Text")) : t.type != Hls.ErrorTypes.MUX_ERROR && t.type != Hls.ErrorTypes.MEDIA_ERROR || (r = y.ErrorCode.PlayDataDecode, i = v.get("Error_TX_Decode_Text")), i = i + "(" + t.details + ")";

            function o() {
              var e;
              l.pause(), setTimeout(function () {
                l.trigger(_.Private.Play_Btn_Hide)
              }), l.checkOnline() && (e = {
                mediaId: l._options && l._options.vid ? l._options.vid : "",
                error_code: r,
                error_msg: t.details
              }, l.logError(e), e.display_msg = i, l.trigger(_.Player.Error, e))
            }

            if (l._options && l._options.isLive) {
              var a, s = l._options;
              s.liveRetry > l._liveRetryCount ? (0 == l._liveRetryCount && l.trigger(_.Player.OnM3u8Retry), a = s.liveRetryInterval + s.liveRetryStep * l._liveRetryCount, l._liveRetryCount++, m.sleep(1e3 * a), n && l._loadByUrlInner(l._options.source, 0, !0)) : (l._liveErrorHandle && clearTimeout(l._liveErrorHandle), l.trigger(_.Player.LiveStreamStop), l._liveErrorHandle = setTimeout(o, 500))
            } else {
              if (l._reloadForVod()) return;
              o()
            }
          }
        })
      })
    }
  }, {
    "../../config": 204,
    "../../lang/index": 210,
    "../../lib/constants": 214,
    "../../lib/dom": 217,
    "../../lib/io": 223,
    "../../lib/playerutil": 228,
    "../../lib/ua": 230,
    "../../lib/util": 232,
    "../base/event/eventtype": 242,
    "../base/player": 261
  }],
  273: [function (e, t, r) {
    var i = e("../base/player"), n = e("./hlsinjector"), o = i.extend({
      init: function (e, t) {
        t._native = !1, n.inject(this, o, i, t), i.call(this, e, t)
      }
    });
    t.exports = o
  }, {"../base/player": 261, "./hlsinjector": 272}],
  274: [function (e, t, r) {
    var a = e("../../lib/io"), s = e("../../config"), u = e("../../lib/constants"), c = e("../../lib/util"),
        h = (e("../../lib/playerutil"), e("../../lib/dom"), e("../../lib/ua"), e("../../lang/index")),
        d = e("../base/event/eventtype");
    e("../base/player");
    t.exports.inject = function (e, t, r, i, n, o) {
      e._Type = t, e._superType = r, e._superPt = r.prototype, e._disposed = !1, t.prototype._checkRtsReady = function () {
        if (null == e._rts) throw new Error("please invoke this method after ready event")
      }, e._isRts = !0, e._rts = null, e._isLoadedRts = !1, e._originalUrl = "", t.prototype.play = function (e) {
        this._checkRtsReady(), this._isManualPlay = e || !1;
        return this.trigger(d.Private.Cover_Hide), this._options.autoplay || this._options.preload || this._loadSourced || (this._loadSourced = !0, this._options._autoplay = !0, this._rts.startLiveStream(this._options.source, this.tag)), this.tag.paused && (this.tag.play(), this._initPlayBehavior(!0)), this
      }, t.prototype.seek = function (e) {
      }, t.prototype.setSpeed = function (e) {
      }, t.prototype.pause = function (e) {
        return this._checkRtsReady(), this.tag.pause(), this
      }, t.prototype.stop = function () {
        return this._rts && this._rts.stopLiveStream(), this
      }, t.prototype.dispose = function () {
        this._disposed || (this._disposed = !0, this._superPt && this._superPt.dispose.call(this), this._destroyRts(), this._superPt && (t.prototype.play = this._superPt.play, t.prototype.pause = this._superPt.pause, t.prototype.initPlay = this._superPt.initPlay, t.prototype.stop = this._superPt.stop, t.prototype.dispose = this._superPt.dispose, t.prototype.seek = this._superPt.seek, t.prototype.setSpeed = this._superPt.setSpeed))
      }, t.prototype._destroyRts = function () {
        this._rts && this.stop(), this._rts = null
      }, t.prototype.initPlay = function (e) {
        function t(r, i) {
          var n = null, o = null, a = !r._rts;
          r._destroyRts();
          var e = r._options.customTag ? r._options.customTag : "", t = !!r._options.trackLog && r._options.trackLog,
              s = r._options.playTimeOut ? r._options.playTimeOut : 5e3;
          r._originalUrl = r._options.source, r._rts = new AliRTS({
            customTag: e,
            trackLog: t,
            playConfig: {playTimeOut: s}
          }), r._rts.isSupport({isReceiveVideo: !0}).then(function (e) {
            console.log(e), l(r, r._rts), r._initPlayBehavior(i), r._rts.startLiveStream(r._options.source, r.tag).then(function () {
            })["catch"](function (e) {
              10202 == e.code ? (n = u.ErrorCode.PlayUrlError, o = h.get("Play_Url_Error")) : 10203 == e.code ? (n = u.ErrorCode.SubscribeNonthing, o = h.get("Subscribe_Nonthing")) : 10204 == e.code && (n = u.ErrorCode.HtmlElementError, o = h.get("Html_Element_Error"));
              var t = {error_code: n, error_msg: o};
              null !== t.error_code && null !== t.error_msg && r.trigger(d.Player.Error, t)
            });
            var t = document.querySelector(".volume-icon");
            t && t.addEventListener("click", function (e) {
              r._rts.muteLiveStream(!1), t.setAttribute("class", "volume-icon")
            }), a && r._executeReadyCallback()
          })["catch"](function (e) {
            10011 == e.errorCode ? (n = u.ErrorCode.BrowserNotSupport, o = h.get("Browser_Not_Support")) : 10010 == e.errorCode && (n = u.ErrorCode.NotSupportWebRtc, o = h.get("Not_Support_Webrtc"));
            var t = {error_code: n, error_msg: o};
            return r.trigger(d.Player.Error, t), !1
          })
        }

        (that = this)._isLoadedRts ? t(this, e) : (this.trigger(d.Private.H5_Loading_Show), function (e, t) {
          var r = "https://g.alicdn.com/AliRTC/H5RTSSdk/" + (this._options.rtsVersion ? this._options.rtsVersion : s.rtsVersion) + "/aliyun-rts-sdk.js",
              i = this;
          a.loadJS(r, function () {
            e.apply(i)
          })
        }.call(that, function () {
          this._isLoadedRts = !0, t(this, e)
        }, this._options.debug))
      };
      var l = function (n, e) {
        function o(e, t) {
          var r;
          n.pause(), setTimeout(function () {
            n.trigger(d.Private.Play_Btn_Hide)
          }), n.checkOnline() && (r = {error_code: e, error_msg: t}, n.logError(r), n.trigger(d.Player.Error, r))
        }

        function i(e, t) {
          if (n._options && n._options.isLive) {
            var r, i = n._options;
            i.liveRetry > n._liveRetryCount ? (0 == n._liveRetryCount && n.trigger(d.Player.OnM3u8Retry), r = i.liveRetryInterval + i.liveRetryStep * n._liveRetryCount, n._liveRetryCount++, c.sleep(1e3 * r), n._loadByUrlInner(n._options.source, 0, !0)) : (n._liveErrorHandle && clearTimeout(n._liveErrorHandle), n.trigger(d.Player.LiveStreamStop), n._liveErrorHandle = setTimeout(o(e, t), 500))
          } else {
            if (n._reloadForVod()) return;
            o(e, t)
          }
        }

        e.on("onError", function (e) {
          var t = null, r = null;
          10001 == e.errorCode ? (t = u.ErrorCode.RequestHttpError, r = h.get("Http_Request_Error"), i(t, r)) : 10010 == e.errorCode ? (t = u.ErrorCode.NotSupportWebRtc, r = h.get("Not_Support_Webrtc"), o(t, r)) : 10012 == e.errorCode ? (t = u.ErrorCode.BrowserVersionTooLow, r = h.get("Browser_Version_Too_Low"), o(t, r)) : 10013 == e.errorCode ? (t = u.ErrorCode.NotSupportH264, r = h.get("Not_Support_H264"), o(t, r)) : 10014 == e.errorCode ? (t = u.ErrorCode.CreateOfferError, r = h.get("Create_Offer_Error"), o(t, r)) : 10002 == e.errorCode && (t = u.ErrorCode.PlayFailedError, r = h.get("ERROR_PLAY_FAILED"), i(t, r))
        });
        var t = "canplay", r = "waiting", a = "playing", s = "media", l = !1;
        e.on("onPlayEvent", function (e) {
          if (e.event !== t && e.event !== r && e.event !== a && e.event === s && e.data) {
            if (0 !== e.data.audio.bytesReceivedPerSecond || 0 !== e.data.video.bytesReceivedPerSecond) return void (l = !0);
            0 == e.data.audio.bytesReceivedPerSecond && 0 == e.data.video.bytesReceivedPerSecond && l && (errorCode = u.ErrorCode.PlayFailedError, errorMsg = h.get("ERROR_PLAY_FAILED"), i(errorCode, errorMsg), l = !1)
          }
        })
      }
    }
  }, {
    "../../config": 204,
    "../../lang/index": 210,
    "../../lib/constants": 214,
    "../../lib/dom": 217,
    "../../lib/io": 223,
    "../../lib/playerutil": 228,
    "../../lib/ua": 230,
    "../../lib/util": 232,
    "../base/event/eventtype": 242,
    "../base/player": 261
  }],
  275: [function (e, t, r) {
    var i = e("../base/player"), n = e("./rtsinjector"), o = i.extend({
      init: function (e, t) {
        t.isLive ? (t._native = !1, n.inject(this, o, i, t), i.call(this, e, t)) : console.error("RTS\u53ea\u652f\u6301\u76f4\u64ad\uff0c\u8bf7\u628aisLive\u8bbe\u7f6e\u4e3atrue")
      }
    });
    t.exports = o
  }, {"../base/player": 261, "./rtsinjector": 274}],
  276: [function (e, t, r) {
    var i = e("../../lib/constants"), n = e("../../lib/oo").extend({
      init: function (e) {
        this.player = e, this.tickhandle = null
      }
    });
    n.prototype.tick = function (e, t) {
      var r = this;
      this.tickhandle = setTimeout(function () {
        r.player && r.player.trigger(i.AuthKeyExpiredEvent), t && t()
      }, 1e3 * e)
    }, n.prototype.clearTick = function (e) {
      this.tickhandle && clearTimeout(this.tickhandle)
    }, t.exports = n
  }, {"../../lib/constants": 214, "../../lib/oo": 226}],
  277: [function (e, t, r) {
    var l = e("../../lib/io"), u = (e("../../lib/ua"), e("../../lib/bufferbase64")), c = e("../../lib/constants"),
        h = e("./signature"), d = e("./util"), f = e("../../lang/index"), p = function (e, i, n) {
          var t = h.randomUUID(), r = "https://mts." + e.domainRegion + ".aliyuncs.com/?", o = {
            AccessKeyId: e.accessId,
            Action: "GetLicense",
            MediaId: e.vid,
            LicenseUrl: r,
            data: e.data,
            SecurityToken: e.stsToken,
            Format: "JSON",
            Type: e.encryptionType,
            Version: "2014-06-18",
            SignatureMethod: "HMAC-SHA1",
            SignatureVersion: "1.0",
            SignatureNonce: t
          };
          e.header && (o.Header = e.header);
          var a = r + ("Signature=" + h.AliyunEncodeURI(h.makeChangeSiga(o, e.accessSecret, "POST"))),
              s = h.makeUTF8sort(o, "=", "&");
          l.post(a, s, function (e) {
            var t, r;
            e ? (t = JSON.parse(e), i && (r = t.License, i(r))) : n && n(d.createError("MPS\u83b7\u53d6License\u5931\u8d25"))
          }, function (e) {
            if (n) {
              var t = {Code: "", Message: f.get("Error_MTS_Fetch_Urls_Text")};
              try {
                t = JSON.parse(e)
              } catch (e) {
              }
              n({Code: c.ErrorCode.ServerAPIError, Message: t.Code + "|" + t.Message, sri: t.requestId || ""})
            }
          })
        };
    t.exports.requestLicenseKey = function (e) {
      var l = e;
      return l._options.vid && (l.__vid = l._options.vid), function (e, r) {
        var i, t, n, o, a = l._options, s = l._getDRMEncryptItem();
        s && (i = {
          vid: l.__vid,
          accessId: a.accId,
          accessSecret: a.accSecret,
          stsToken: a.stsToken,
          domainRegion: a.domainRegion,
          authInfo: a.authInfo,
          encryptionType: s.encryptionType
        }, s.encryptionType == c.EncryptionType.Widevine ? i.data = u.encode(e.message) : s.encryptionType == c.EncryptionType.PlayReady && (t = u.unpackPlayReady(e.message), i.data = t.changange, t.header && (i.header = JSON.stringify(t.header))), console.log(i.data), n = l.__licenseKeys, o = l.__vid + s.Url, n && n[o], p(i, function (e) {
          l.__licenseKeys || (l.__licenseKeys = {}), 10 < i.data.length && (l.__licenseKeys[o] = e);
          var t = u.decode(e);
          r(t)
        }, function (e) {
          var t = {mediaId: l.__vid, error_code: e.Code, error_msg: e.Message};
          l.logError(t), l.trigger("error", t)
        }))
      }
    }
  }, {
    "../../lang/index": 210,
    "../../lib/bufferbase64": 212,
    "../../lib/constants": 214,
    "../../lib/io": 223,
    "../../lib/ua": 230,
    "./signature": 281,
    "./util": 283
  }],
  278: [function (e, t, r) {
    var o = e("../../lib/io"), u = e("../../lib/constants"), c = e("./signature"), h = e("./util"),
        d = e("../../lang/index"), f = e("../../lib/ua");
    var p = function (e, n) {
      var t = "";
      e.sort(function (e, t) {
        var r = parseInt(e.bitrate), i = parseInt(t.bitrate);
        if ("desc" == n) {
          if (i < r) return -1;
          if (r < i) return 1
        } else {
          if (r < i) return -1;
          if (i < r) return 1
        }
      });
      for (var r = e.length, i = 0; i < r; i++) {
        var o = e[i], a = u.QualityLevels[o.definition], s = "",
            s = void 0 === a ? o.bitrate : t == a ? a + o.bitrate : a;
        o.desc = s, t = a
      }
    }, y = function (e, n) {
      var t = "";
      e.sort(function (e, t) {
        var r = parseInt(e.width), i = parseInt(t.width);
        if ("desc" == n) {
          if (i < r) return -1;
          if (r < i) return 1
        } else {
          if (r < i) return -1;
          if (i < r) return 1
        }
      });
      for (var r = e.length, i = 0; i < r; i++) {
        var o = e[i], a = u.QualityLevels[o.definition], s = "", s = void 0 === a ? "" : t == a ? a + o.height : a;
        o.desc = s, t = a
      }
    };
    t.exports.getDataByAuthInfo = function (e, a, s, l) {
      c.returnUTCDate(), c.randomUUID();
      var t = c.randomUUID(), r = {
        AccessKeyId: e.accessId,
        Action: "PlayInfo",
        MediaId: e.vid,
        Formats: e.format,
        AuthInfo: e.authInfo,
        AuthTimeout: e.authTimeout || u.AuthKeyExpired,
        IncludeSnapshotList: e.includeSnapshotList,
        Rand: e.rand,
        SecurityToken: e.stsToken,
        Format: "JSON",
        Version: "2014-06-18",
        SignatureMethod: "HMAC-SHA1",
        SignatureVersion: "1.0",
        Terminal: f.IS_CHROME ? "Chrome" : f.IS_EDGE ? "Edge" : f.IS_IE11 ? "IE" : f.IS_SAFARI ? "Safari" : f.IS_FIREFOX ? "Firefox" : "",
        SignatureNonce: t
      };
      e.hlsUriToken && (e.MtsHlsUriToken = e.hlsUriToken), e.playConfig && (r.PlayConfig = JSON.stringify(e.playConfig));
      var i = c.makeUTF8sort(r, "=", "&") + "&Signature=" + c.AliyunEncodeURI(c.makeChangeSiga(r, e.accessSecret)),
          n = "https://mts." + e.domainRegion + ".aliyuncs.com/?" + i;
      o.get(n, function (e) {
        var t, r, i, n, o;
        e ? (r = (t = JSON.parse(e)).PlayInfoList.PlayInfo, n = "", (i = t.SnapshotList ? t.SnapshotList.Snapshot : []) && 0 < i.length && (n = i[0].Url), o = function (e, t) {
          for (var r = [], i = [], n = [], o = [], a = e.length - 1; 0 <= a; a--) {
            var s = e[a];
            "mp4" == s.format ? i.push(s) : "mp3" == s.format ? n.push(s) : "m3u8" == s.format ? r.push(s) : o.push(s)
          }
          return 0 < n.length ? (p(n, t), n) : 0 < i.length ? (y(i, t), i) : 0 < r.length ? (y(r, t), r) : (y(o, t), o)
        }(r, a), s && s({
          requestId: t.RequestId,
          urls: o,
          thumbnailUrl: n
        })) : l && l(h.createError("MPS\u83b7\u53d6\u53d6\u6570\u5931\u8d25"))
      }, function (e) {
        if (l) {
          var t = {Code: "", Message: d.get("Error_MTS_Fetch_Urls_Text")};
          try {
            t = JSON.parse(e)
          } catch (e) {
          }
          l({Code: u.ErrorCode.ServerAPIError, Message: t.Code + "|" + t.Message, sri: t.requestId || ""})
        }
      })
    }
  }, {
    "../../lang/index": 210,
    "../../lib/constants": 214,
    "../../lib/io": 223,
    "../../lib/ua": 230,
    "./signature": 281,
    "./util": 283
  }],
  279: [function (e, t, r) {
    var i = e("./saasplayer"), n = (e("../../lib/constants"), e("./mts")), o = i.extend({
      init: function (e, t) {
        i.call(this, e, t), this.service = n, this.loadByMts()
      }
    });
    o.prototype.loadByMts = function (e) {
      var t = {
        vid: this._options.vid,
        accessId: this._options.accId,
        accessSecret: this._options.accSecret,
        stsToken: this._options.stsToken,
        domainRegion: this._options.domainRegion,
        authInfo: this._options.authInfo,
        format: this._options.format,
        includeSnapshotList: this._options.includeSnapshotList || !1,
        defaultDefinition: this._options.defaultDefinition,
        authTimeout: this._options.authTimeout,
        hlsUriToken: this._options.hlsUriToken,
        playConfig: this._options.playConfig
      };
      this.loadData(t, e)
    }, o.prototype.replayByVidAndAuthInfo = function (e, t, r, i, n, o) {
      this.trigger("error_hide"), this._options.source = "", this._isError = !1, this._duration = 0, this._options.cover = "", this._vodRetryCount = 0, this._clearTimeout(), this.reloadNewVideoInfo(e, t, r, i, n, o)
    }, o.prototype.reloadNewVideoInfo = function (e, t, r, i, n, o) {
      if (this.trigger("error_hide"), this._options.source = "", e && (this._options.vid = e, this._options.accId = t, this._options.accessSecret = r, this._options.stsToken = i, this._options.domainRegion = o, this._options.authInfo = n), !(this._options.vid && this._options.accId && this._options.accessSecret && this._options.stsToken && this._options.domainRegion && this._options.authInfo)) throw new Error("\u9700\u8981\u63d0\u4f9bvid\u3001accId\u3001accessSecret\u3001stsToken\u3001domainRegion\u548cauthInfo\u53c2\u6570");
      this.log("STARTFETCHDATA", JSON.stringify({it: "mps", pa: {vid: e}})), this.loadByMts(!0)
    }, t.exports = o
  }, {"../../lib/constants": 214, "./mts": 278, "./saasplayer": 280}],
  280: [function (e, t, r) {
    var p = e("../base/player"), i = e("../audio/audioplayer"), o = (e("../../lib/event"), e("../../lib/io")),
        y = e("../../lib/constants"), n = e("./signature"), a = e("./authkeyexpiredhandle"),
        m = e("../hls/hlsinjector"), g = e("../flv/flvinjector"), b = e("../drm/drminjector"),
        v = (e("../../lib/cookie"), e("../../lang/index")), _ = e("../../lib/ua"), s = e("../../config"),
        w = e("../../lib/playerutil"), S = e("../base/event/eventtype"), E = p.extend({
          init: function (e, t) {
            this._authKeyExpiredHandle = new a(this), p.prototype._videoCreateEl || (p.prototype._videoCreateEl = p.prototype.createEl), "mp3" == t.format ? (t.height = "auto", t.mediaType = "audio", p.prototype.createEl = i.prototype.createEl, i.call(this, e, t), E.prototype.play = p.prototype.play, E.prototype.pause = p.prototype.pause, E.prototype.initPlay = p.prototype.initPlay, E.prototype.replay = p.prototype.replay, E.prototype.stop = p.prototype.stop, E.prototype.seek = p.prototype.seek) : (p.prototype.createEl = p.prototype._videoCreateEl, t._native = !1, p.call(this, e, t))
          }
        });
    E.prototype.loadData = function (e, t) {
      var r, i, n;
      "undefined" != typeof _sce_r_skjhfnck || "" != e.format && "m3u8" != e.format && 1 != this._options.encryptType ? this._loadData(e, t) : (r = "aliplayer-vod-min.js", i = "", i = s.domain ? "https://" + s.domain + "/de/prismplayer/" + s.h5Version + "/hls/" + r : "/build/hls/" + r, n = this, o.loadJS(i, function () {
        n._loadData(e, t)
      }))
    }, E.prototype._loadData = function (u, c) {
      var h, d = (new Date).getTime(), f = this;
      this._urls = [], this._currentPlayIndex = 0, this._retrySwitchUrlCount = 0, this._authKeyExpiredHandle.clearTick(), "" != u.format && "m3u8" != u.format || 1 != this._options.encryptType ? u.rand = n.randomUUID() : (h = _sce_r_skjhfnck(), u.rand = _sce_lgtcaygl(h)), this._options.thumbnailUrl && (u.thumbnailUrl = this._options.thumbnailUrl), this.trigger(S.Private.H5_Loading_Show), this.service.getDataByAuthInfo(u, this._options.qualitySort, function (e) {
        if (e.urls && 0 == e.urls.length) f._mtsError_message(f, {
          Code: y.ErrorCode.URLsIsEmpty,
          Message: v.get("Error_Vod_URL_Is_Empty_Text") + (u.format ? "(format:" + u.format + ")" : "")
        }, ""); else {
          f.log("COMPLETEFETCHDATA", {
            cost: (new Date).getTime() - d, mi: JSON.stringify(function (e) {
              for (var t = [], r = 0; r < e.length; r++) t.push({
                width: e[r].width,
                height: e[r].height,
                definition: e[r].definition,
                format: e[r].format,
                encryptionType: e[r].encryptionType,
                duration: e[r].duration
              });
              return t
            }(e.urls))
          }), f._urls = e.urls, f._urls.sort(function (e, t) {
            return e.bitrate - t.bitrate
          }), f._currentPlayIndex = w.findSelectedStreamLevel(f._urls, u.defaultDefinition);
          var t, r = (i = e.urls[f._currentPlayIndex]).Url;
          if (f._vodDuration = i.duration || 0, f._options.source = r, f.encType = "", f.trigger(S.Private.PREPARE, i.definition), f.UI.cover && e.coverUrl && !f._options.cover && f.setCover(e.coverUrl), w.isHls(r)) {
            if (e.encryptUrlArr && 0 < e.encryptUrlArr.length) {
              t = [];
              for (var i, n, o = 0; o < e.encryptUrlArr.length; ++o) {
                (i = e.encryptUrlArr[o]).encryptionType === y.EncryptionType.Private && (n = _sce_dlgtqred(h, i.rand, i.plaintext), t.push({
                  url: i.Url,
                  secData: n
                }))
              }
            } else if (ecData = "", i.encryptionType == y.EncryptionType.Private) {
              f.encType = i.encryptionType;
              var a = w.checkSecuritSupport();
              if (a) return void f._mtsError_message(f, {
                Code: y.ErrorCode.EncrptyVideoNotSupport,
                Message: a,
                display_msg: a
              }, "");
              t = _sce_dlgtqred(h, i.rand, i.plaintext)
            }
            m.inject(f, E, p, f._options, t)
          } else w.isFlv(r) ? g.inject(f, E, p, f._options) : w.isDash(r) ? b.inject(f, E, p, f._options) : f._player._executeReadyCallback();
          f._authKeyExpiredHandle.tick(y.AuthKeyRefreshExpired), f.trigger(S.Private.SourceLoaded, i), f.initPlay(c), f.trigger(S.Private.ChangeURL), e.thumbnailUrl && f._thumbnailService.get(e.thumbnailUrl);
          var s = f._player._isFlv, l = -1 < f._player.getOptions().source.indexOf("mp4");
          1 == f._player.encType || s || l || (_.IS_IOS || _.IS_MAC_SAFARI || _.IS_X5 || _.IS_EDGE) && f._player._executeReadyCallback()
        }
      }, function (e) {
        f._mtsError_message(f, e, "")
      })
    }, E.prototype._changeStream = function (e, t) {
      this._urls.length > e && (this.loadByUrl(this._urls[e].Url, this.getCurrentTime()), this._currentPlayIndex = e, this.trigger(S.Private.QualityChange, t || v.get("Quality_Change_Fail_Switch_Text")))
    }, E.prototype._getLowerQualityLevel = function () {
      if (0 == this._urls.length || -1 == this._currentPlayIndex) return "";
      if ("asc" == this.options().qualitySort) {
        if (0 < this._currentPlayIndex) return {
          item: this._urls[this._currentPlayIndex - 1],
          index: this._currentPlayIndex - 1
        }
      } else if (this._currentPlayIndex < this._urls.length - 1) return {
        item: this._urls[this._currentPlayIndex + 1],
        index: this._currentPlayIndex + 1
      };
      return ""
    }, E.prototype._mtsError_message = function (e, t, r) {
      var i = e;
      i.trigger(S.Private.H5_Loading_Hide);
      var n = t.Code ? t.Code : "OTHER_ERR_CODE", o = t.Message ? t.Message : "OTHER_ERR_MSG",
          a = (y.ErrorCode.ServerAPIError, t.display_msg || "");
      -1 < o.indexOf("InvalidParameter.Rand") || -1 < o.indexOf('"Rand" is not valid.') ? (y.ErrorCode.EncrptyVideoNotSupport, a = v.get("Error_Not_Support_encrypt_Text")) : -1 < o.indexOf("SecurityToken.Expired") ? (y.ErrorCode.AuthKeyExpired, a = v.get("Error_Playauth_Expired_Text")) : -1 < o.indexOf("InvalidVideo.NoneStream") && (y.ErrorCode.URLsIsEmpty, a = v.get("Error_Fetch_NotStream") + "(" + i._options.format + "|" + i._options.definition + ")");
      var s = i._options.vid ? i._options.vid : "0",
          l = (i._options.from && i._options.from, {mediaId: s, error_code: n, error_msg: o});
      t.sri && (l.sri = t.sri), i.logError(l), l.display_msg = (a || v.get("Error_Vod_Fetch_Urls_Text")) + "</br>" + o, i.trigger("error", l), console.log("PrismPlayer Error: " + r + "! error_msg :" + o + ";")
    }, t.exports = E
  }, {
    "../../config": 204,
    "../../lang/index": 210,
    "../../lib/constants": 214,
    "../../lib/cookie": 215,
    "../../lib/event": 218,
    "../../lib/io": 223,
    "../../lib/playerutil": 228,
    "../../lib/ua": 230,
    "../audio/audioplayer": 240,
    "../base/event/eventtype": 242,
    "../base/player": 261,
    "../drm/drminjector": 267,
    "../flv/flvinjector": 270,
    "../hls/hlsinjector": 272,
    "./authkeyexpiredhandle": 276,
    "./signature": 281
  }],
  281: [function (e, c, t) {
    var i = e("crypto-js/hmac-sha1"), n = e("crypto-js/enc-base64"), r = e("crypto-js/enc-utf8");
    c.exports.randomUUID = function () {
      for (var e = [], t = "0123456789abcdef", r = 0; r < 36; r++) e[r] = t.substr(Math.floor(16 * Math.random()), 1);
      return e[14] = "4", e[19] = t.substr(3 & e[19] | 8, 1), e[8] = e[13] = e[18] = e[23] = "-", e.join("")
    }, c.exports.returnUTCDate = function () {
      var e = new Date, t = e.getUTCFullYear(), r = e.getUTCMonth(), i = e.getUTCDate(), n = e.getUTCHours(),
          o = e.getUTCMinutes(), a = e.getUTCSeconds(), s = e.getUTCMilliseconds();
      return Date.UTC(t, r, i, n, o, a, s)
    }, c.exports.AliyunEncodeURI = function (e) {
      var t = encodeURIComponent(e);
      return t = (t = (t = t.replace("+", "%2B")).replace("*", "%2A")).replace("%7E", "~")
    }, c.exports.makesort = function (e, t, r) {
      if (!e) throw new Error("PrismPlayer Error: vid should not be null!");
      var i = [];
      for (var n in e) i.push(n);
      for (var o = i.sort(), a = "", s = o.length, n = 0; n < s; n++) "" == a ? a = o[n] + t + e[o[n]] : a += r + o[n] + t + e[o[n]];
      return a
    }, c.exports.makeUTF8sort = function (e, t, r) {
      if (!e) throw new Error("PrismPlayer Error: vid should not be null!");
      var i = [];
      for (var n in e) i.push(n);
      for (var o = i.sort(), a = "", s = o.length, n = 0; n < s; n++) {
        var l = c.exports.AliyunEncodeURI(o[n]), u = c.exports.AliyunEncodeURI(e[o[n]]);
        "" == a ? a = l + t + u : a += r + l + t + u
      }
      return a
    }, c.exports.makeChangeSiga = function (e, t, r) {
      if (!e) throw new Error("PrismPlayer Error: vid should not be null!");
      return r = r || "GET", n.stringify(i(r + "&" + c.exports.AliyunEncodeURI("/") + "&" + c.exports.AliyunEncodeURI(c.exports.makeUTF8sort(e, "=", "&")), t + "&"))
    }, c.exports.ISODateString = function (e) {
      function t(e) {
        return e < 10 ? "0" + e : e
      }

      return e.getUTCFullYear() + "-" + t(e.getUTCMonth() + 1) + "-" + t(e.getUTCDate()) + "T" + t(e.getUTCHours()) + ":" + t(e.getUTCMinutes()) + ":" + t(e.getUTCSeconds()) + "Z"
    }, c.exports.encPlayAuth = function (e) {
      if (!(e = r.stringify(n.parse(e)))) throw new Error("playuth\u53c2\u6570\u89e3\u6790\u4e3a\u7a7a");
      return JSON.parse(e)
    }, c.exports.encRsa = function () {
    }
  }, {"crypto-js/enc-base64": 75, "crypto-js/enc-utf8": 76, "crypto-js/hmac-sha1": 77}],
  282: [function (e, t, r) {
    var l = e("../../lib/io"), u = e("../../lib/constants"), c = e("./signature"), h = e("./util"),
        d = e("../../lang/index");
    t.exports.getPlayAuth = function (e, r, i, n) {
      c.randomUUID();
      var t = c.randomUUID(), o = {
            AccessKeyId: e.accessKeyId,
            Action: "GetVideoPlayAuth",
            VideoId: e.vid,
            AuthTimeout: u.AuthInfoExpired,
            SecurityToken: e.securityToken,
            Format: "JSON",
            Version: "2017-03-21",
            SignatureMethod: "HMAC-SHA1",
            SignatureVersion: "1.0",
            SignatureNonce: t
          }, a = c.makeUTF8sort(o, "=", "&") + "&Signature=" + c.AliyunEncodeURI(c.makeChangeSiga(o, e.accessKeySecret)),
          s = "https://vod." + e.region + ".aliyuncs.com/?" + a;
      l.get(s, function (e) {
        var t;
        e ? (t = JSON.parse(e), r && r(t.PlayAuth)) : i && i(h.createError("\u83b7\u53d6\u89c6\u9891\u64ad\u653e\u51ed\u8bc1\u5931\u8d25"))
      }, function (e) {
        if (i) {
          var t = {Code: "", Message: d.get("Fetch_Playauth_Error")};
          try {
            (t = JSON.parse(e)).Code
          } catch (e) {
          }
          i({
            Code: u.ErrorCode.ServerAPIError,
            Message: t.Code + "|" + t.Message,
            sri: t.requestId,
            display_msg: d.get("Fetch_Playauth_Error", n)
          })
        }
      })
    }
  }, {"../../lang/index": 210, "../../lib/constants": 214, "../../lib/io": 223, "./signature": 281, "./util": 283}],
  283: [function (e, t, r) {
    t.exports.createError = function (e, t) {
      return {requestId: "", code: t || "", message: e}
    }
  }, {}],
  284: [function (e, t, r) {
    var n = e("../../lib/io"), f = e("../../lib/constants"), o = e("./signature"), p = e("./util"),
        a = e("../../config"), s = e("../../lang/index");

    function y(e, t) {
      for (var r, i, n = [], o = [], a = [], s = [], l = e.length - 1; 0 <= l; l--) {
        var u = e[l],
            c = (i = void 0, (i = {}).width = (r = u).Width, i.height = r.Height, i.definition = r.Definition, i.Url = r.PlayURL, i.format = r.Format, i.desc = f.QualityLevels[i.definition], i.encryptionType = f.VodEncryptionType[r.EncryptType], i.plaintext = r.Plaintext, i.rand = r.Rand, i.encrypt = r.Encrypt, i.duration = r.Duration, i.bitrate = r.Bitrate, i);
        "mp4" == c.format ? o.push(c) : "mp3" == c.format ? a.push(c) : "m3u8" == c.format ? n.push(c) : s.push(c)
      }
      var h = [], h = 0 < a.length ? a : 0 < o.length ? o : 0 < n.length ? n : s;
      return "asc" == t && h.reverse(), h
    }

    t.exports.getDataByAuthInfo = function (u, c, h, d) {
      o.randomUUID();
      var e = o.randomUUID(), t = {
        AccessKeyId: u.accessId,
        Action: "GetPlayInfo",
        VideoId: u.vid,
        Formats: u.format,
        AuthTimeout: u.authTimeout || f.AuthKeyExpired,
        Rand: u.rand,
        SecurityToken: u.stsToken,
        StreamType: u.mediaType,
        Format: "JSON",
        Version: "2017-03-21",
        SignatureMethod: "HMAC-SHA1",
        SignatureVersion: "1.0",
        SignatureNonce: e,
        PlayerVersion: a.h5Version,
        Channel: "HTML5"
      };
      "AUTO" === u.definition ? t.ResultType = "Multiple" : u.definition && (t.Definition = u.definition), u.authInfo && (t.AuthInfo = u.authInfo), u.outputType && (t.OutputType = u.outputType), u.playConfig && (t.PlayConfig = JSON.stringify(u.playConfig)), u.reAuthInfo && (t.ReAuthInfo = JSON.stringify(u.reAuthInfo));
      var r = o.makeUTF8sort(t, "=", "&") + "&Signature=" + o.AliyunEncodeURI(o.makeChangeSiga(t, u.accessSecret)),
          i = "https://vod." + u.domainRegion + ".aliyuncs.com/?" + r;
      n.get(i, function (e) {
        if (e) {
          var t = JSON.parse(e), r = "", i = t.VideoBase.ThumbnailList;
          i && i.Thumbnail && 0 < i.Thumbnail.length ? r = i.Thumbnail[0].URL : u.thumbnailUrl && (r = String(u.thumbnailUrl));
          for (var n = t.PlayInfoList.PlayInfo, o = [], a = [], s = n.length - 1; 0 <= s; --s) {
            "AUTO" === n[s].Definition ? o = [n.splice(s, 1)[0]] : 1 === n[s].Encrypt && a.push(n[s])
          }
          var l = null, a = 0 === o.length ? (l = y(n, c), []) : (l = y(o), y(a));
          l && h && h({
            requestId: t.RequestId,
            urls: l,
            encryptUrlArr: a,
            thumbnailUrl: r,
            coverUrl: t.VideoBase.CoverURL
          })
        } else d && d(p.createError("\u70b9\u64ad\u670d\u52a1\u83b7\u53d6\u53d6\u6570\u5931\u8d25"))
      }, function (e) {
        if (d) {
          var t = {Code: "", Message: s.get("Error_Vod_Fetch_Urls_Text")};
          try {
            t = JSON.parse(e)
          } catch (e) {
          }
          d({Code: f.ErrorCode.ServerAPIError, Message: t.Code + "|" + t.Message, sri: t.requestId || ""})
        }
      })
    }
  }, {
    "../../config": 204,
    "../../lang/index": 210,
    "../../lib/constants": 214,
    "../../lib/io": 223,
    "./signature": 281,
    "./util": 283
  }],
  285: [function (e, t, r) {
    var i = e("./saasplayer"), l = e("../../lib/constants"), n = e("./vod"), u = e("./signature"),
        o = (e("./authkeyexpiredhandle"), e("./ststoken"), i.extend({
          init: function (e, t) {
            i.call(this, e, t), this.service = n, this.loadByVod()
          }
        }));
    o.prototype.loadByVod = function (e) {
      var t = "", r = "", i = "", n = "", o = "";
      if (this._options.accessKeyId && this._options.accessKeySecret) t = this._options.accessKeyId, r = this._options.accessKeySecret, i = this._options.securityToken, n = this._options.region, this.log("STARTFETCHDATA", JSON.stringify({
        it: "sts",
        pa: {vid: this._options.vid}
      })); else {
        try {
          var a = u.encPlayAuth(this._options.playauth), t = a.AccessKeyId, r = a.AccessKeySecret, i = a.SecurityToken,
              n = a.Region, o = a.AuthInfo
        } catch (e) {
          var s = {
            Code: l.ErrorCode.PlayauthDecode,
            Message: "playauth decoded failed.",
            displayMessage: "playauth\u89e3\u6790\u9519\u8bef"
          };
          return void this._mtsError_message(this, s, this._options.playauth)
        }
        this._options.from = a.CustomerId ? a.CustomerId : "", this.log("STARTFETCHDATA", JSON.stringify({
          it: "playAuth",
          pa: {vid: this._options.vid}
        }))
      }
      this._loadByVodBySTS(t, r, i, n, o, e)
    }, o.prototype.replayByVidAndPlayAuth = function (e, t) {
      this.trigger("error_hide"), this._options.source = "", this._options.vid = e, this._options.playauth = t, this._isError = !1, this._duration = 0, this._options.cover = "", this._vodRetryCount = 0, this._clearTimeout(), this.loadByVod(!0)
    }, o.prototype.updateSourcesByVidAndPlayAuth = function (e, t) {
      if (e == this._options.vid) {
        this._options.vid = e, this._options.playauth = t;
        try {
          var r = u.encPlayAuth(this._options.playauth)
        } catch (e) {
          return void console.log("playauth\u89e3\u6790\u9519\u8bef")
        }
        var i = {
          vid: e,
          accessId: r.AccessKeyId,
          accessSecret: r.AccessKeySecret,
          stsToken: r.SecurityToken,
          domainRegion: r.Region,
          authInfo: r.AuthInfo,
          playDomain: r.PlayDomain,
          format: this._options.format,
          mediaType: this._options.mediaType
        };
        this._authKeyExpiredHandle.clearTick();
        var n = this;
        this.service.loadData(i, this._options.qualitySort, function (e) {
          n._serverRequestId = e.requestId, 0 != e.urls.length && (n._urls = e.urls), n._authKeyExpiredHandle.tick(l.AuthKeyRefreshExpired)
        }, function (e) {
          console.log(e)
        })
      } else console.log("\u4e0d\u80fd\u66f4\u65b0\u5730\u5740\uff0cvid\u548c\u64ad\u653e\u4e2d\u7684\u4e0d\u4e00\u81f4")
    }, o.prototype.reloaduserPlayInfoAndVidRequestMts = function (e, t) {
      this.replayByVidAndPlayAuth(e, t, accessSecret)
    }, o.prototype._loadByVodBySTS = function (e, t, r, i, n, o) {
      var a = {
        vid: this._options.vid,
        accessId: e,
        accessSecret: t,
        stsToken: r,
        authInfo: n,
        domainRegion: i,
        format: this._options.format,
        mediaType: this._options.mediaType,
        definition: this._options.definition,
        defaultDefinition: this._options.defaultDefinition,
        authTimeout: this._options.authTimeout,
        outputType: this._options.outputType,
        playConfig: this._options.playConfig,
        reAuthInfo: this._options.reAuthInfo
      };
      this.loadData(a, o)
    }, t.exports = o
  }, {
    "../../lib/constants": 214,
    "./authkeyexpiredhandle": 276,
    "./saasplayer": 280,
    "./signature": 281,
    "./ststoken": 282,
    "./vod": 284
  }],
  286: [function (e, t, r) {
    function i(r) {
      this._player = r, this._video = r.tag;
      var i = this;
      this._isCreated = !1, this._canPlayTriggered = !1, this._defaultTrack = "", r.on(n.Private.ChangeURL, function () {
        i._isCreated = !1, i._canPlayTriggered = !1, i._defaultTrack = ""
      }), r.on(n.Player.CanPlay, function () {
        var e;
        i._player._drm || i._canPlayTriggered || ((e = i._getTracks()) && (i._isCreated = !0, r.trigger(n.Player.AudioTrackReady, e), i._notifyDefaultValue(e)), i._canPlayTriggered = !0)
      }), r.on(n.Player.AudioTrackUpdated, function (e) {
        var t;
        i._isCreated || (t = i._getTracks(e.paramData.audioTracks)) && (i._isCreated = !0, r.trigger(n.Player.AudioTrackReady, t), i._notifyDefaultValue(t))
      })
    }

    var n = e("../base/event/eventtype");
    i.prototype._notifyDefaultValue = function (e) {
      !this._defaultTrack && 0 < e.length && (this._defaultTrack = e[0]), this._defaultTrack && this._player.trigger(n.Private.SelectorUpdateList, {
        type: "audio",
        text: this._defaultTrack.text
      })
    }, i.prototype.support = function () {
      return !!this._video.audioTracks
    }, i.prototype._getTracks = function (e) {
      if (!this.support() && !e) return null;
      this._video && this._video.audioTracks && (!e || e && 0 == e.length) && (e = this._video.audioTracks);
      for (var t = [], r = e ? e.length : 0, i = 0; i < r; i++) {
        var n = e[i], o = {value: n.id, text: n.label || n.name || n.language};
        (n["default"] || n.enabled) && (this._defaultTrack = o), t.push(o)
      }
      return t
    }, i.prototype["switch"] = function (e) {
      if (this._player._hls) this._player._hls.audioTrack = +e; else for (var t = this._video.audioTracks ? this._video.audioTracks.length : 0, r = 0; r < t; r++) {
        var i = this._video.audioTracks[r];
        i.id == e ? i.enabled = !0 : i.enabled = !1
      }
    }, i.prototype.dispose = function () {
      this._player = null
    }, t.exports = i
  }, {"../base/event/eventtype": 242}],
  287: [function (e, t, r) {
    function i(e) {
      this._video = e.tag, this._player = e, this._isCreated = !1, this._backupCC = "", this.tracks = [], this._defaultTrack = "", this._currentValue = "";
      var t = this;
      e.on(n.Private.ChangeURL, function () {
        t._disabledTracks(), t._isCreated = !1, t._defaultTrack = ""
      }), e.on(n.Player.CanPlay, function () {
        t._player._drm || (t._isCreated || (t.tracks = t._getTracks(), e.trigger(n.Player.TextTrackReady, t.tracks)), t._isCreated && !t._player._setDefaultCC || !t._defaultTrack || (e.trigger(n.Private.SelectorUpdateList, {
          type: "cc",
          text: t._defaultTrack.text
        }), t["switch"](t._defaultTrack.value), t._player._setDefaultCC = !1, t._isCreated = !0))
      }), this._adaptiveCueStype(), e.on(n.Player.RequestFullScreen, function () {
        t._adaptiveCueStype()
      }), e.on(n.Player.CancelFullScreen, function () {
        t._adaptiveCueStype()
      })
    }

    var n = e("../base/event/eventtype"), o = e("../../lib/dom"), a = e("../../lib/ua"), l = e("../../lib/cookie"),
        u = e("../../lib/constants");
    i.prototype._adaptiveCueStype = function () {
      var e, t = -10;
      a.IS_SAFARI ? (t = -65, (e = this._player.fullscreenService) && e.getIsFullScreen() && (t = -95)) : a.IS_MOBILE && (t = -30), o.addCssByStyle("video::-webkit-media-text-track-container{transform: translateY(" + t + "px) !important;}")
    }, i.prototype.close = function () {
      for (var e = this._video && this._video.textTracks ? this._video.textTracks.length : 0, t = 0; t < e; t++) {
        var r = this._video.textTracks[t];
        "expired" != r.mode && ("showing" == r.mode && (this._backupCC = r), r.mode = "disabled")
      }
    }, i.prototype.open = function () {
      if (this.tracks && !(this.tracks.length < 2)) {
        var e = this._backupCC ? this._backupCC.language : "", t = this._backupCC ? this._backupCC.label : "";
        return e || (e = this.tracks[1].value, t = this.tracks[1].text), this["switch"](e), t
      }
    }, i.prototype.getCurrentSubtitle = function () {
      return this._currentValue
    }, i.prototype._getTracks = function () {
      if (this._player._drm) return [];
      var e = this._video && this._video.textTracks ? this._video.textTracks.length : 0;
      this._defaultTrack = {value: "off", text: "Off"};
      for (var t = [this._defaultTrack], r = l.get(u.SelectedCC), i = "", n = !1, o = 0; o < e; o++) {
        var a, s = this._video.textTracks[o];
        "expired" != s.mode && "subtitles" == s.kind && (a = {
          value: s.language,
          text: s.label
        }, s["default"] && (this._defaultTrack = a, n = !0), a.value == r && (i = a), t.push(a))
      }
      return !n && i && (this._defaultTrack = i), t
    }, i.prototype._disabledTracks = function () {
      for (var e = this._video && this._video.textTracks ? this._video.textTracks.length : 0, t = 0; t < e; t++) {
        this._video.textTracks[t].mode = "expired"
      }
    }, i.prototype["switch"] = function (e) {
      if (this.close(), "off" != e) {
        for (var t = this._video && this._video.textTracks ? this._video.textTracks.length : 0, r = 0; r < t; r++) {
          var i = this._video.textTracks[r];
          i.language === e && "expired" != i.mode && (this._video.textTracks[r].mode = "showing")
        }
        this._currentValue = e
      } else this.close()
    }, i.prototype.dispose = function () {
      this._player = null
    }, t.exports = i
  }, {
    "../../lib/constants": 214,
    "../../lib/cookie": 215,
    "../../lib/dom": 217,
    "../../lib/ua": 230,
    "../base/event/eventtype": 242
  }],
  288: [function (e, t, r) {
    var i = e("../../lib/playerutil");
    t.exports = [{service: e("./ccservice"), name: "_ccService", condition: !0}, {
      service: e("./audiotrackservice"),
      name: "_audioTrackService"
    }, {service: e("./qualityservice"), name: "_qualityService"}, {
      service: e("./fullscreenservice"),
      name: "fullscreenService",
      condition: function () {
        return !0
      }
    }, {
      service: e("./liveshiftservice"), name: "_liveshiftService", condition: function () {
        var e = this.options();
        return i.isLiveShift(e)
      }
    }, {
      service: e("./thumbnailservice"), name: "_thumbnailService", condition: function () {
        return !0
      }
    }, {
      service: e("./progressmarkerservice"), name: "_progressMarkerService", condition: function () {
        return !0
      }
    }]
  }, {
    "../../lib/playerutil": 228,
    "./audiotrackservice": 286,
    "./ccservice": 287,
    "./fullscreenservice": 289,
    "./liveshiftservice": 290,
    "./progressmarkerservice": 291,
    "./qualityservice": 292,
    "./thumbnailservice": 293
  }],
  289: [function (e, t, r) {
    function i(e) {
      this.isFullWindow = !1, this.isFullScreen = !1, this.isFullScreenChanged = !1, this._requestFullScreenTimer = null, this._cancelFullScreenTimer = null, this._player = e;
      var i = this, n = c;
      this._fullscreenChanged = function (e) {
        var t, r;
        null != i._player && (void 0 !== (t = document[n.isFullScreen]) ? i.isFullScreen = t : (r = document[n.fullscreenElement], i.isFullScreen = null != r), (i.isFullScreenChanged = !0) === i.isFullScreen ? i._player.trigger(s.Player.RequestFullScreen) : i._player.trigger(s.Player.CancelFullScreen))
      }, n && a.on(document, n.eventName, this._fullscreenChanged)
    }

    var n = e("../../lib/ua"), o = e("../../lib/dom"), a = e("../../lib/event"), s = e("../base/event/eventtype"),
        l = e("../base/x5play"), u = e("../../lang/index"), c = function () {
          o.createEl("div");
          var e = {},
              t = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror", "fullScreen"], ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror", "webkitfullScreen"], ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror", "webkitIsFullScreen"], ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror", "mozFullScreen"], ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError", "MSFullScreen"]],
              r = !1;
          if (n.IS_IOS && (e.requestFn = "webkitEnterFullscreen", e.cancelFn = "webkitExitFullscreen", e.fullscreenElement = "webkitFullscreenElement", e.eventName = "webkitfullscreenchange", e.isFullScreen = "webkitDisplayingFullscreen", document[e.requestFn] && (r = !0)), !r) {
            for (var i = 0; i < 5; i++) if (t[i][1] in document) {
              e.requestFn = t[i][0], e.cancelFn = t[i][1], e.fullscreenElement = t[i][2], e.eventName = t[i][4], e.isFullScreen = t[i][6];
              break
            }
            "requestFullscreen" in document ? e.requestFn = "requestFullscreen" : "webkitRequestFullscreen" in document ? e.requestFn = "webkitRequestFullscreen" : "webkitRequestFullScreen" in document ? e.requestFn = "webkitRequestFullScreen" : "webkitEnterFullscreen" in document ? e.requestFn = "webkitEnterFullscreen" : "mozRequestFullScreen" in document ? e.requestFn = "mozRequestFullScreen" : "msRequestFullscreen" in document && (e.requestFn = "msRequestFullscreen"), "fullscreenchange" in document ? e.eventName = "fullscreenchange" : "webkitfullscreenchange" in document || "webkitfullscreenchange" in document || "webkitfullscreenchange" in document ? e.eventName = "webkitfullscreenchange" : "mozfullscreenchange" in document ? e.eventName = "mozfullscreenchange" : "MSFullscreenChange" in document && (e.eventName = "MSFullscreenChange"), "fullScreen" in document ? e.isFullScreen = "fullScreen" : "webkitfullScreen" in document ? e.isFullScreen = "webkitfullScreen" : "webkitIsFullScreen" in document ? e.isFullScreen = "webkitIsFullScreen" : "webkitDisplayingFullscreen" in document ? e.isFullScreen = "webkitDisplayingFullscreen" : "mozFullScreen" in document ? e.isFullScreen = "mozFullScreen" : "mozfullScreen" in document ? e.isFullScreen = "mozfullScreen" : "MSFullScreen" in document && (e.isFullScreen = "MSFullScreen"), "fullscreenElement" in document ? e.fullscreenElement = "fullscreenElement" : "webkitFullscreenElement" in document ? e.fullscreenElement = "webkitFullscreenElement" : "webkitFullScreenElement" in document ? e.fullscreenElement = "webkitFullScreenElement" : "mozFullScreenElement" in document ? e.fullscreenElement = "mozFullScreenElement" : "msFullscreenElement" in document ? e.fullscreenElement = "msFullscreenElement" : "MSFullscreenElement" in document && (e.fullscreenElement = "MSFullscreenElement")
          }
          return e.requestFn ? e : null
        }();
    i.prototype.requestFullScreen = function () {
      if (!l.isAndroidX5() || !this._player.paused()) {
        var e = c, t = this._player.el(), r = this;
        if (n.IS_IOS) {
          t = this._player.tag;
          try {
            t[e.requestFn](), r._player.trigger(s.Player.RequestFullScreen)
          } catch (e) {
            console.log(e)
          }
          return this
        }
        this.isFullScreen = !0, this.isFullScreenChanged = !1, this._requestFullScreenTimer = null, this._cancelFullScreenTimer || clearTimeout(this._cancelFullScreenTimer);
        r = this;
        if (e && !this._player._options.enableMockFullscreen) try {
          t[e.requestFn](), this._requestFullScreenTimer = setTimeout(function () {
            r.isFullScreenChanged || (h.apply(r), r._player.trigger(s.Player.RequestFullScreen)), r._requestFullScreenTimer = null
          }, 1e3)
        } catch (e) {
          console.log(e)
        } else h.apply(r), this._player.trigger(s.Player.RequestFullScreen);
        return this._player
      }
      this._player.trigger(s.Private.Info_Show, u.get("Play_Before_Fullscreen"))
    }, i.prototype.cancelFullScreen = function () {
      var e = c;
      this.isFullScreen = !1, this.isFullScreenChanged = !1, this._cancelFullScreenTimer = null, this._requestFullScreenTimer || clearTimeout(this._requestFullScreenTimer);
      var t = this;
      if (e && !this._player._options.enableMockFullscreen) {
        try {
          document[e.cancelFn]()
        } catch (e) {
          console.log(e)
        }
        t._cancelFullScreenTimer = setTimeout(function () {
          t.isFullScreenChanged || (d.apply(t), t._player.trigger(s.Player.CancelFullScreen)), t._cancelFullScreenTimer = null
        }, 500), this._player.tag.paused || this._player.trigger(s.Player.Play)
      } else d.apply(t), this._player.trigger(s.Player.CancelFullScreen), this._player.tag.paused || this._player.trigger(s.Player.Play);
      return this._player
    }, i.prototype.getIsFullScreen = function () {
      return this.isFullScreen
    }, i.prototype.dispose = function () {
      this._player = null;
      c && a.off(document, c.eventName, this._fullscreenChanged)
    };
    var h = function () {
      this.isFullWindow = !0, this.docOrigOverflow = document.documentElement.style.overflow, document.documentElement.style.overflow = "hidden", o.addClass(document.getElementsByTagName("body")[0], "prism-full-window")
    }, d = function () {
      this.isFullWindow = !1, document.documentElement.style.overflow = this.docOrigOverflow, o.removeClass(document.getElementsByTagName("body")[0], "prism-full-window")
    };
    t.exports = i
  }, {
    "../../lang/index": 210,
    "../../lib/dom": 217,
    "../../lib/event": 218,
    "../../lib/ua": 230,
    "../base/event/eventtype": 242,
    "../base/x5play": 266
  }],
  290: [function (e, t, r) {
    function n(e, t) {
      if (e && e) {
        var r = new Date(e), i = new Date(t), n = i.valueOf() / 1e3 - r.valueOf() / 1e3;
        return {start: r, end: i, endDisplay: s.extractTime(i), totalTime: n}
      }
    }

    function o(e, t) {
      t && (e.currentTimestamp = t, e.currentTime = s.convertToDate(t), e.currentTimeDisplay = s.extractTime(e.currentTime), e.liveShiftStart = e.liveTimeRange.start, e.liveShiftEnd = e.liveTimeRange.end, e.liveShiftStartDisplay = s.extractTime(e.liveShiftStart), e.liveShiftEndDisplay = s.extractTime(e.liveShiftEnd), e.availableLiveShiftTime = t - e.liveShiftStart.valueOf() / 1e3, e.timestampStart = s.convertToTimestamp(e.liveShiftStart), e.timestampEnd, s.convertToTimestamp(e.liveShiftEnd))
    }

    function i(t) {
      function e() {
        var e = t._options.source;
        this._originalPlayUrl = e, this._liveShiftUrl = t._options.liveTimeShiftUrl, this.liveTimeRange = n(t._options.liveStartTime, t._options.liveOverTime), this.availableLiveShiftTime = 0, this.seekTime = -1
      }

      this._player = t, this._isLiveShift = !1;
      var i = this;
      e.call(this), t.liveShiftSerivce = {
        setLiveTimeRange: function (e, t) {
          i.setLiveTimeRange(e, t)
        }, queryLiveShift: function (e, t, r) {
          i.queryLiveShift(e, t, r)
        }
      }, t.on(d.Private.ChangeURL, function () {
        e.call(i)
      })
    }

    var a = e("../../lib/io"), s = e("../../lib/util"), l = e("../../lib/playerUtil"), u = e("../../lang/index"),
        c = (e("../flv/flvinjector"), e("../hls/hlsinjector")), h = e("../../lib/constants"),
        d = e("../base/event/eventtype");
    e("../../lib/url");
    i.prototype.validate = function () {
      return !(this.liveTimeRange.start >= this.liveTimeRange.end)
    }, i.prototype.switchToLive = function () {
      var e = this._player._options.recreatePlayer;
      e && this._isLiveShift && (this._player.dispose(), setTimeout(function () {
        e()
      }, 1e3), this._isLiveShift = !1)
    }, i.prototype.getBaseTime = function () {
      this.liveShiftStartDisplay;
      return -1 == this.seekTime ? s.parseTime(this.currentTimeDisplay) : s.parseTime(this.liveShiftStartDisplay) + this.seekTime
    }, i.prototype.getSourceUrl = function (e, t) {
      var r = this._originalPlayUrl;
      return this.availableLiveShiftTime <= e ? r : (this._isLiveShift = !0, (e = parseInt(e)) <= 5 && (e = 5), r = -1 == (r = (r = this._switchLiveShiftPlayer(t)) && r.replace("lhs_offset_unix_s_0", "z")).indexOf("?") ? r + "?lhs_offset_unix_s_0=" + e : r + "&lhs_offset_unix_s_0=" + e)
    }, i.prototype._switchLiveShiftPlayer = function (e) {
      var t = this._originalPlayUrl, r = this._player._options.liveShiftSource, i = this._player._options.source;
      if (l.isHls(i)) t = i; else if (l.isFlv(t) && r && l.isHls(r)) {
        this._player._flv && this._player._destroyFlv();
        var n = this._player._superType, o = this._player._Type;
        return this._player._options._autoplay = !0, c.inject(this._player, o, n, this._player._options, "", !0), r
      }
      return t
    }, i.prototype.getTimeline = function (r, i) {
      if (this._player.trigger(d.Private.LiveShiftQueryCompleted), !this._liveShiftUrl) return o(this, (new Date).valueOf() / 1e3), void (r && r());
      var n = this;
      this.queryLiveShift(this._liveShiftUrl, function (e) {
        var t;
        e ? 0 == (t = e).retCode ? (o(n, t.content.current), r && r()) : i({
          Code: h.ErrorCode.ServerAPIError,
          Message: t.retCode + "|" + t.description + "|" + t.content
        }) : console.log("\u83b7\u53d6\u76f4\u64ad\u65f6\u79fb\u6570\u636e\u5931\u8d25")
      }, function (e) {
        if (i && e) {
          var t = {};
          if (e) {
            if (-1 < e.indexOf("403 Forbidden")) t.Code = h.ErrorCode.AuthKeyExpired, t.Message = "Query liveshift failed:" + u.get("Error_AuthKey_Text"); else {
              var r, t = e;
              try {
                r = JSON.parse(e)
              } catch (e) {
              }
              r && (t.Code = h.ErrorCode.ServerAPIError, t.Message = r.retCode + "|" + r.description + "|" + r.content)
            }
            i(t)
          }
        }
      })
    }, i.prototype.start = function (e, t) {
      var r = this, i = function () {
        r._loopHandler = setTimeout(function () {
          r.getTimeline(function () {
          }, t), i()
        }, e)
      };
      r.getTimeline(function (e) {
        r._localLiveTimeHandler || r.tickLocalLiveTime()
      }, t), i()
    }, i.prototype.tickLocalLiveTime = function () {
      var e = this, t = function () {
        e._localLiveTimeHandler = setTimeout(function () {
          e.currentTimestamp++, o(e, e.currentTimestamp), e._player.trigger(d.Private.LiveShiftQueryCompleted), t()
        }, 1e3)
      };
      t()
    }, i.prototype.setLiveTimeRange = function (e, t) {
      e = e || this._player._options.liveStartTime, t = t || this._player._options.liveOverTime, this.liveTimeRange = n(e, t), o(this, this.currentTimestamp), this._player.trigger(d.Private.LiveShiftQueryCompleted)
    }, i.prototype.queryLiveShift = function (e, r, i) {
      a.get(e, function (e) {
        var t;
        e ? 0 == (t = JSON.parse(e)).retCode ? r && r(t) : i && i(t) : i && i(e)
      }, function (e) {
        i && i(e)
      })
    }, i.prototype.stop = function (e) {
      this._loopHandler && (clearTimeout(this._loopHandler), this._loopHandler = null)
    }, i.prototype.dispose = function () {
      this.stop(), this._localLiveTimeHandler && (clearTimeout(this._localLiveTimeHandler), this._localLiveTimeHandler = null), this._player = null
    }, t.exports = i
  }, {
    "../../lang/index": 210,
    "../../lib/constants": 214,
    "../../lib/io": 223,
    "../../lib/playerUtil": 227,
    "../../lib/url": 231,
    "../../lib/util": 232,
    "../base/event/eventtype": 242,
    "../flv/flvinjector": 270,
    "../hls/hlsinjector": 272
  }],
  291: [function (e, t, r) {
    function i(l) {
      this.progressMarkers = [], this._player = l;
      var u = this;

      function r() {
        var e = document.querySelector("#" + l.id() + " .prism-progress-marker");
        if (e) {
          e.innerHTML = "";
          var o = u._player.getDuration();
          if (0 < o) {
            for (var t = 0; t < u.progressMarkers.length; t++) {
              var r, i, n, a = u.progressMarkers[t];
              void 0 !== a.offset && "" !== a.offset && (r = document.createElement("div"), h.addClass(r, "prism-marker-dot"), i = u.progressMarkers[t].offset / o, r.style.left = 100 * i + "%", e.appendChild(r), n = function (e, t) {
                return function () {
                  u._player.trigger(c.Private.MarkerTextShow, {left: e, progressMarker: t})
                }
              }(i, u.progressMarkers[t]), d.on(r, "mouseover", n), d.on(r, "mouseout", function (e) {
                u._player.trigger(c.Private.MarkerTextHide)
              }), d.on(r, "touchstart", n), d.on(r, "mousemove", function (e) {
                e.preventDefault()
              }), d.on(r, "touchmove", function (e) {
                e.preventDefault()
              }))
            }
            var s = document.querySelector("#" + u._player.id() + " .prism-progress-cursor");
            u._player.on(s, "click", function (e) {
              for (var t = u._player.getCurrentTime(), r = 0; r < u.progressMarkers.length; r++) {
                var i, n = u.progressMarkers[r];
                n && t - 1 < n.offset && n.offset < t + 1 && (i = n.offset / o * 100 + "%", u._player.trigger(c.Private.MarkerTextShow, {
                  left: i,
                  progressMarker: n
                }))
              }
            })
          }
        }
      }

      l.on(c.Private.ProgressMarkerLoaded, function (e) {
        var t = e.paramData;
        t && 0 < t.length && (u.progressMarkers = t)
      }), l.on(c.Private.ProgressMarkerChanged, function (e) {
        var t = e.paramData;
        t && 0 < t.length && (u.progressMarkers = t, r())
      }), l.on(c.Video.LoadedMetadata, r)
    }

    var c = e("../base/event/eventtype"),
        h = (e("../../lang/index"), e("../../lib/hls/hlsparse"), e("../../lib/object"), e("../../lib/dom")),
        d = e("../../lib/event");
    e("../../lib/playerutil");
    i.prototype.dispose = function () {
      this._player = null, this.progressMarkers = []
    }, t.exports = i
  }, {
    "../../lang/index": 210,
    "../../lib/dom": 217,
    "../../lib/event": 218,
    "../../lib/hls/hlsparse": 222,
    "../../lib/object": 225,
    "../../lib/playerutil": 228,
    "../base/event/eventtype": 242
  }],
  292: [function (e, t, r) {
    function i(a) {
      this.levels = [], this._player = a;
      var s = this;
      a.on(l.Player.LevelsLoaded, function (e) {
        if (0 < s.levels.length && (s.levels = []), (e = e.paramData) && e.levels) {
          for (var t, r = e.levels.length - 1; -1 < r; r--) {
            var i, n, o = e.levels[r];
            o.url && 0 < o.url.length && o.attrs && o.attrs.BANDWIDTH && (i = o.url, c.isArray(i) && (i = i[0]), n = {
              Url: i,
              desc: o.height || o.width,
              bitrate: o.bitrate,
              resolution: o.attrs.RESOLUTION,
              bandwidth: o.attrs.BANDWIDTH
            }, s.levels.push(n))
          }
          "AUTO" === a._options.definition && (a._urls = [], Object.assign(a._urls, this.levels)), 0 < s.levels.length && (t = u.get("Auto"), s.levels.push({
            Url: e.url,
            desc: t
          }), a.trigger(l.Private.SelectorUpdateList, {type: "quality", text: t}))
        }
      }), a.on(l.Video.LoadStart, function () {
        var e;
        a._options && (e = a._options.source, !a._hls && e && o.isHls(e) && s.loadLevels(e))
      })
    }

    var l = e("../base/event/eventtype"), u = e("../../lang/index"), n = e("../../lib/hls/hlsparse"),
        c = e("../../lib/object"), o = e("../../lib/playerutil");
    (i.prototype = {
      loadLevels: function (e) {
        var t = new n, r = this;
        t.load(e, function (e) {
          r._player.trigger(l.Player.LevelsLoaded, e)
        })
      }
    }).dispose = function () {
      this._player = null
    }, t.exports = i
  }, {
    "../../lang/index": 210,
    "../../lib/hls/hlsparse": 222,
    "../../lib/object": 225,
    "../../lib/playerutil": 228,
    "../base/event/eventtype": 242
  }],
  293: [function (e, t, r) {
    function i(e) {
      this._player = e, this.cues = [], this.baseUrl = "";
      var t = this;
      e.on(u.Private.ChangeURL, function () {
        t.cues = [], t.baseUrl = ""
      })
    }

    var a = e("../../lib/io"), s = e("../../lib/url"), l = e("../../lib/vtt/thumbnailvtt"),
        u = e("../base/event/eventtype");
    (i.prototype = {
      get: function (e) {
        var t, r, i, n, o = this;
        this.baseUrl = (t = e, !(n = s.parseUrl(t)) || (r = n.segments) && 0 < r.length && (i = r[r.length - 1], baseUrl = t.replace(i, "")), baseUrl), a.get(e, function (e) {
          e && l.parse(e, function (e) {
            o.cues = e, o._player.trigger(u.Private.ThumbnailLoaded, e)
          })
        }, function (e) {
          console.log(e)
        })
      }, findAvailableCue: function (e) {
        for (var t = this.cues.length, r = 0; r < t; r++) {
          var i = this.cues[r];
          if (i.startTime <= e && e < i.endTime) return i
        }
        return null
      }, makeUrl: function (e) {
        return -1 == e.indexOf("://") && (e = this.baseUrl + e), e
      }
    }).dispose = function () {
      this._player = null
    }, t.exports = i
  }, {"../../lib/io": 223, "../../lib/url": 231, "../../lib/vtt/thumbnailvtt": 233, "../base/event/eventtype": 242}],
  294: [function (e, t, r) {
    var i = e("../lib/oo"), n = e("../lib/data"), a = e("../lib/object"), o = e("../lib/dom"), s = e("../lib/event"),
        l = e("../lib/function"), u = e("../lib/layout"),
        c = (e("../lib/constants"), e("../lib/util"), e("../player/base/event/eventtype")), h = e("./component/util"),
        d = i.extend({
          init: function (e, t) {
            var r = this;
            this._player = e, this._eventState = "", this._options = a.copy(t), this._el = this.createEl();
            var i = e.id;
            "function" == typeof e.id && (i = e.id()), this._id = i + "_component_" + n.guid(), this._children = [], this._childIndex = {}, t.className && this.addClass(t.className), this._player.on(c.Private.UiH5Ready, function () {
              r.renderUI(), r.syncUI(), r.bindEvent()
            })
          }
        });
    d.prototype.renderUI = function () {
      u.render(this.el(), this.options()), this.el().id = this.id()
    }, d.prototype.syncUI = function () {
    }, d.prototype.bindEvent = function () {
    }, d.prototype.createEl = function (e, t) {
      return o.createEl(e, t)
    }, d.prototype.options = function (e) {
      return void 0 === e ? this._options : this._options = a.merge(this._options, e)
    }, d.prototype.el = function () {
      return this._el
    }, d.prototype._contentEl, d.prototype.player = function () {
      return this._player
    }, d.prototype.contentEl = function () {
      return this._contentEl || this._el
    }, d.prototype._id, d.prototype.id = function () {
      return this._id
    }, d.prototype.getId = function () {
      return this._id
    }, d.prototype.addChild = function (e, t) {
      var r, i;
      if ("string" == typeof e) {
        if (!this._player.UI[e]) return;
        r = new this._player.UI[e](this._player, t)
      } else r = e;
      return this._children.push(r), "function" == typeof r.id && (this._childIndex[r.id()] = r), "function" == typeof r.el && r.el() && ((i = r.el()).id = r.id(), this.contentEl().appendChild(i)), r
    }, d.prototype.removeChild = function (e) {
      if (e && this._children) {
        for (var t, r = !1, i = this._children.length - 1; 0 <= i; i--) if (this._children[i] === e) {
          r = !0, this._children.splice(i, 1);
          break
        }
        r && (this._childIndex[e.id] = null, (t = e.el()) && t.parentNode === this.contentEl() && this.contentEl().removeChild(e.el()))
      }
    }, d.prototype.initChildren = function () {
      var e, t, r, i = this, n = this.options().children;
      if (n) if (a.isArray(n)) for (var o = 0; o < n.length; o++) r = "string" == typeof (e = n[o]) ? (t = e, {}) : (t = e.name, e), i.addChild(t, r); else a.each(n, function (e, t) {
        !1 !== t && i.addChild(e, t)
      })
    }, d.prototype.on = function (e, t) {
      return s.on(this._el, e, l.bind(this, t)), this
    }, d.prototype.off = function (e, t) {
      return s.off(this._el, e, t), this
    }, d.prototype.one = function (e, t) {
      return s.one(this._el, e, l.bind(this, t)), this
    }, d.prototype.trigger = function (e, t) {
      if (this._el) return !t && 0 != t || (this._el.paramData = t), this._eventState = e, s.trigger(this._el, e), this
    }, d.prototype.off = function (e) {
      return s.off(this._el, e), this
    }, d.prototype.addClass = function (e) {
      return o.addClass(this._el, e), this
    }, d.prototype.removeClass = function (e) {
      return o.removeClass(this._el, e), this
    }, d.prototype.show = function () {
      return this._el && (this._el.style.display = "block"), this
    }, d.prototype.hide = function () {
      return this._el && (this._el.style.display = "none"), this
    }, d.prototype.destroy = function () {
      if (this.trigger({
        type: "destroy",
        bubbles: !1
      }), this._children) for (var e = this._children.length - 1; 0 <= e; e--) this._children[e].destroy && this._children[e].destroy();
      "function" == typeof this.disposeUI && this.disposeUI(), this.children_ = null, this.childIndex_ = null, this.off(), this._el.parentNode && this._el.id != this._player.id() && this._el.parentNode.removeChild(this._el), n.removeData(this._el), this._el = null
    }, d.prototype.registerControlBarTooltip = h.registerTooltipEvent, t.exports = d
  }, {
    "../lib/constants": 214,
    "../lib/data": 216,
    "../lib/dom": 217,
    "../lib/event": 218,
    "../lib/function": 219,
    "../lib/layout": 224,
    "../lib/object": 225,
    "../lib/oo": 226,
    "../lib/util": 232,
    "../player/base/event/eventtype": 242,
    "./component/util": 321
  }],
  295: [function (e, t, r) {
    var i = e("../component"), n = e("../../lib/dom"), o = e("../../lib/event"),
        a = e("../../player/base/event/eventtype"), s = e("../../player/base/plugin/status"), l = i.extend({
          init: function (e, t) {
            i.call(this, e, t), this.addClass("prism-big-play-btn")
          }, createEl: function () {
            var e = i.prototype.createEl.call(this, "div");
            return e.innerHTML = '<div class="outter"></div>', e
          }, bindEvent: function () {
            var t = this;
            this._player.on(a.Player.Play, function () {
              t.addClass("playing"), t.removeClass("pause"), t._hide()
            }), this._player.on(a.Player.Pause, function () {
              var e;
              t._player._switchSourcing || (t.removeClass("playing"), t.addClass("pause"), (e = t._player._status) != s.ended && e != s.error && e != s.playing && t._show())
            });
            var e = document.querySelector("#" + t.id() + " .outter");
            o.on(this.el(), "mouseover", function () {
              n.addClass(e, "big-playbtn-hover-animation")
            }), o.on(this.el(), "mouseout", function () {
              n.removeClass(e, "big-playbtn-hover-animation")
            }), this.on(a.Private.PlayClick, function () {
              var e;
              t._player.paused() ? (e = t._player.getCurrentTime(), (t._player.getDuration() <= e || t._player._ended || t._player.exceedPreviewTime(e)) && t._player.seek(0), t._player.play(!0)) : t._player.pause(!0)
            }), this._player.on(a.Private.Play_Btn_Show, function () {
              t._show()
            }), this._player.on(a.Private.Play_Btn_Hide, function () {
              t._hide()
            })
          }, _show: function () {
            n.css(this.el(), "display", "block")
          }, _hide: function () {
            n.css(this.el(), "display", "none")
          }
        });
    t.exports = l
  }, {
    "../../lib/dom": 217,
    "../../lib/event": 218,
    "../../player/base/event/eventtype": 242,
    "../../player/base/plugin/status": 265,
    "../component": 294
  }],
  296: [function (e, t, r) {
    var i = e("../component"), n = e("../../lib/dom"), o = e("./util"), a = e("../../lang/index"),
        s = e("../../player/base/event/eventtype"), l = i.extend({
          init: function (e, t) {
            this.isOpened = !1, i.call(this, e, t), this.addClass("prism-cc-btn")
          }, createEl: function () {
            return i.prototype.createEl.call(this, "div")
          }, bindEvent: function () {
            var r = this;
            this.on("click", function () {
              n.addClass(r._el, "disabled");
              var e = "on", t = "";
              r.isOpened ? (r._player._ccService.close(), e = "off") : t = r._player._ccService.open(), r.isOpened = !r.isOpened, r._player.trigger(s.Private.CCStateChanged, {
                value: e,
                lang: t
              }), r.disabledHandler && clearTimeout(r.disabledHandler), r.disabledHandler = setTimeout(function () {
                n.removeClass(r._el, "disabled")
              }, 1e3), r._player.trigger(s.Private.MarkerTextHide)
            }), this._player.on(s.Private.CCChanged, function (e) {
              var t = e.paramData;
              r.isOpened = "off" != t
            }), o.registerTooltipEvent.call(this, this.el(), function () {
              return r.isOpened ? a.get("CloseSubtitle") : a.get("OpenSubtitle")
            })
          }, disposeUI: function () {
            this.disabledHandler && (clearTimeout(this.disabledHandler), this.disabledHandler = null)
          }
        });
    t.exports = l
  }, {
    "../../lang/index": 210,
    "../../lib/dom": 217,
    "../../player/base/event/eventtype": 242,
    "../component": 294,
    "./util": 321
  }],
  297: [function (e, t, r) {
    var i = e("../component"), o = e("../../player/base/event/eventtype"), a = e("../../lib/event"),
        s = e("../../lib/dom"), n = i.extend({
          init: function (e, t) {
            i.call(this, e, t), this.addClass("prism-controlbar"), this.initChildren(), this.onEvent()
          }, createEl: function () {
            var e = i.prototype.createEl.call(this);
            return e.innerHTML = '<div class="prism-controlbar-bg"></div>', e
          }, onEvent: function () {
            var r = this.player(), e = r.options(), i = this;
            a.on(this._el, "mouseover", function () {
              var e = document.querySelector("#" + i.id() + " .prism-progress-cursor");
              s.css(e, "display", "block")
            }), a.on(this._el, "mouseout", function (e) {
              var t = document.querySelector("#" + i.id() + " .prism-progress-cursor");
              s.css(t, "display", "none"), r.trigger(o.Private.ThumbnailHide)
            }), this.timer = null;
            var t, n = e.controlBarVisibility;
            1 == e.controlBarForOver && (n = "hover"), "hover" == n ? (i.hide(), t = function () {
              i._hideHandler && clearTimeout(i._hideHandler), i._show(), r.fullscreenService.getIsFullScreen() && i._hide()
            }, r.on(o.Private.MouseOver, function () {
              t()
            }), a.on(this._player.tag, "click", function (e) {
              e && e.target == e.currentTarget && t()
            }), a.on(this._player.tag, "touchstart", function (e) {
              e && e.target == e.currentTarget && t()
            }), r.on(o.Private.MouseOut, function () {
              i._hideHandler = setTimeout(function () {
                i.hide(), r.trigger(o.Private.HideBar), r.trigger(o.Private.VolumeVisibilityChange, ""), r.trigger(o.Private.SettingListHide)
              })
            })) : "click" == n ? (r.on(o.Private.Click, function (e) {
              r._isError || (e.preventDefault(), e.stopPropagation(), i._show(), i._hide())
            }), r.on(o.Player.Ready, function () {
              i._hide()
            }), r.on(o.Private.TouchStart, function () {
              i._show()
            }), r.on(o.Private.TouchMove, function () {
              i._show()
            }), r.on(o.Private.TouchEnd, function () {
              i._hide()
            })) : i._show()
          }, _show: function () {
            this.show(), this._player.trigger(o.Private.ShowBar), this.timer && (clearTimeout(this.timer), this.timer = null)
          }, _hide: function () {
            var e = this, t = this.player().options().showBarTime;
            this.timer = setTimeout(function () {
              e.hide(), e._player.trigger(o.Private.HideBar), e._player.trigger(o.Private.VolumeVisibilityChange, ""), e._player.trigger(o.Private.SettingListHide)
            }, t)
          }, disposeUI: function () {
            this.timer && (clearTimeout(this.timer), this.timer = null), this._hideHandler && (clearTimeout(this._hideHandler), this._hideHandler = null)
          }
        });
    t.exports = n
  }, {"../../lib/dom": 217, "../../lib/event": 218, "../../player/base/event/eventtype": 242, "../component": 294}],
  298: [function (e, t, r) {
    var i = e("../component"), n = e("../../lib/dom"), o = e("../../player/base/event/eventtype"), a = i.extend({
      init: function (e, t) {
        i.call(this, e, t), this.addClass("prism-cover")
      }, createEl: function () {
        var e = i.prototype.createEl.call(this, "div"), t = this.options().cover;
        return t ? e.style.backgroundImage = "url(" + t + ")" : n.css(e, "display", "none"), e
      }, _hide: function (e) {
        var t = document.querySelector("#" + this.id() + " .prism-cover");
        t && n.css(t, "display", "none")
      }, _show: function (e) {
        var t = document.querySelector("#" + this.id() + " .prism-cover");
        t && n.css(t, "display", "block")
      }, bindEvent: function () {
        this._player.on(o.Private.Cover_Show, this._show), this._player.on(o.Private.Cover_Hide, this._hide)
      }
    });
    t.exports = a
  }, {"../../lib/dom": 217, "../../player/base/event/eventtype": 242, "../component": 294}],
  299: [function (e, t, r) {
    var i = e("../component"), f = e("../../lib/util"), p = e("../../lib/dom"), n = e("../../lib/event"),
        o = e("../../lib/ua"), y = e("../../lang/index"), a = e("../../player/base/event/eventtype"), s = i.extend({
          init: function (e, t) {
            i.call(this, e, t), this.addClass("prism-ErrorMessage")
          }, createEl: function () {
            var e = i.prototype.createEl.call(this, "div");
            return e.innerHTML = "<div class='prism-error-content'><p></p></div><div class='prism-error-operation'><a class='prism-button prism-button-refresh'>" + y.get("Refresh_Text") + "</a><a class='prism-button prism-button-retry'  target='_blank'>" + y.get("Retry") + "</a><a class='prism-button prism-button-orange'  target='_blank'>" + y.get("Detection_Text") + "</a></div><div class='prism-detect-info prism-center'><p class='errorCode'><span class='info-label'>code\uff1a</span><span class='info-content'></span></p><p class='vid'><span class='info-label'>vid:</span><span class='info-content'></span></p><p class='uuid'><span class='info-label'>uuid:</span><span class='info-content'></span></p><p class='requestId'><span class='info-label'>requestId:</span><span class='info-content'></span></p><p class='dateTime'><span class='info-label'>" + y.get("Play_DateTime") + "\uff1a</span><span class='info-content'></span></p></div>", e
          }, bindEvent: function () {
            var r = this;
            r._player.on(a.Private.Error_Show, function (e) {
              var t = null;
              r._player.getMonitorInfo && (t = r._player.getMonitorInfo()), r._show(e, t)
            }), r._player.on(a.Private.Error_Hide, function () {
              r._hide()
            });
            var e = document.querySelector("#" + r.id() + " .prism-button-refresh");
            n.on(e, "click", function () {
              location.reload(!0)
            }), o.IS_MOBILE && (e = document.querySelector("#" + r.id() + " .prism-detect-info"), p.addClass(e, "prism-width90"));
            var t = document.querySelector("#" + r.id() + " .prism-button-retry");
            n.on(t, "click", function () {
              var e = r._player.getCurrentTime(), t = r._player._options.source;
              r._player._setDefaultCC = !0, r._player._loadByUrlInner(t, e, !0)
            })
          }, _show: function (e, t) {
            var r = e.paramData, i = "", n = "";
            r.mediaId && (i = r.mediaId);
            var o, a, s, l, u, c, h, d = document.querySelector("#" + this.id() + " .prism-button-orange");
            d && (t && this._player._options.diagnosisButtonVisible ? (t.vu ? n = decodeURIComponent(t.vu) : p.css(d, "display", "none"), o = "//player.alicdn.com/detection.html?from=h5&vid=" + i + "&source=" + (n ? encodeURIComponent(n) : "") + "&uuid=" + t.uuid + "&lang=" + y.getCurrentLanguage(), d && (d.href = o)) : p.css(d, "display", "none"), a = r.display_msg || r.error_msg, document.querySelector("#" + this.id() + " .prism-error-content p").innerHTML = a, document.querySelector("#" + this.id() + " .errorCode .info-content").innerText = r.error_code, s = document.querySelector("#" + this.id() + " .vid"), r.mediaId ? (p.css(s, "display", "block"), document.querySelector("#" + this.id() + " .vid .info-content").innerText = r.mediaId) : p.css(s, "display", "none"), r.uuid ? document.querySelector("#" + this.id() + " .uuid .info-content").innerText = r.uuid : (l = document.querySelector("#" + this.id() + " .uuid"), p.css(l, "display", "none")), r.requestId ? document.querySelector("#" + this.id() + " .requestId .info-content").innerText = r.requestId : (u = document.querySelector("#" + this.id() + " .requestId"), p.css(u, "display", "none")), document.querySelector("#" + this.id() + " .dateTime .info-content").innerText = f.formatDate(new Date, "yyyy-MM-dd HH:mm:ss"), c = document.querySelector("#" + this.id()), p.css(c, "display", "block"), (h = this).playHideHandler && clearTimeout(h.playHideHandler), h.playHideHandler = setTimeout(function () {
              h._player.trigger("play_btn_hide")
            }))
          }, _hide: function () {
            var e = document.querySelector("#" + this.id());
            p.css(e, "display", "none")
          }, disposeUI: function () {
            this.playHideHandler && (clearTimeout(this.playHideHandler), this.playHideHandler = null)
          }
        });
    t.exports = s
  }, {
    "../../lang/index": 210,
    "../../lib/dom": 217,
    "../../lib/event": 218,
    "../../lib/ua": 230,
    "../../lib/util": 232,
    "../../player/base/event/eventtype": 242,
    "../component": 294
  }],
  300: [function (e, t, r) {
    var i = e("../component"), n = e("../../player/base/event/eventtype"),
        o = (e("../../lib/event"), e("../../lib/ua")), a = e("../../lang/index"), s = e("./util"), l = i.extend({
          init: function (e, t) {
            i.call(this, e, t), this.addClass("prism-fullscreen-btn")
          }, bindEvent: function () {
            var e = this;
            this._player.on(n.Player.RequestFullScreen, function () {
              o.IS_IOS || e.addClass("fullscreen")
            }), this._player.on(n.Player.CancelFullScreen, function () {
              e.removeClass("fullscreen")
            }), s.registerTooltipEvent.call(this, this.el(), function () {
              return e._player.fullscreenService.getIsFullScreen() ? a.get("ExistFullScreen") : a.get("Fullscreen")
            }), this.on("click", function () {
              e._player.fullscreenService.getIsFullScreen() ? e._player.fullscreenService.cancelFullScreen() : e._player.fullscreenService.requestFullScreen(), e._player.trigger(n.Private.MarkerTextHide)
            })
          }
        });
    t.exports = l
  }, {
    "../../lang/index": 210,
    "../../lib/event": 218,
    "../../lib/ua": 230,
    "../../player/base/event/eventtype": 242,
    "../component": 294,
    "./util": 321
  }],
  301: [function (e, t, r) {
    "use strict";
    var i = e("../component"), n = e("../../lib/dom"), o = e("../../player/base/event/eventtype"), a = i.extend({
      init: function (e, t) {
        i.call(this, e, t), this.addClass("prism-hide")
      }, createEl: function () {
        var e = i.prototype.createEl.call(this, "div");
        return e.innerHTML = '<div class="circle"></div> <div class="circle1"></div>', e
      }, _loading_hide: function (e) {
        var t = document.querySelector("#" + this.id() + " .prism-loading");
        t && (n.removeClass(t, "prism-loading"), n.addClass(t, "prism-hide"))
      }, _loading_show: function (e) {
        var t = document.querySelector("#" + this.id() + " .prism-hide");
        t && (n.removeClass(t, "prism-hide"), n.addClass(t, "prism-loading"))
      }, bindEvent: function () {
        this._player.on(o.Private.H5_Loading_Show, this._loading_show), this._player.on(o.Private.H5_Loading_Hide, this._loading_hide)
      }
    });
    t.exports = a
  }, {"../../lib/dom": 217, "../../player/base/event/eventtype": 242, "../component": 294}],
  302: [function (e, t, r) {
    var i = e("../component"), n = (e("../../lib/util"), e("../../lib/dom")),
        o = (e("../../lib/event"), e("../../lib/ua"), e("../../lang/index"), e("../../player/base/event/eventtype")),
        a = i.extend({
          init: function (e, t) {
            i.call(this, e, t), this.addClass("prism-info-display")
          }, createEl: function () {
            return i.prototype.createEl.call(this, "p")
          }, bindEvent: function () {
            var i = this;
            i._player.on(o.Private.Info_Show, function (e) {
              var t = document.querySelector("#" + i.id()), r = e.paramData;
              r && (void 0 !== r.text && r.text ? (t.innerHTML = r.text, void 0 !== r.duration && r.duration && (i.handler && clearTimeout(i.handler), i.handler = setTimeout(function () {
                n.css(t, "display", "none")
              }, r.duration)), "lb" == r.align ? (n.addClass(t, "prism-info-left-bottom"), n.removeClass(t, "prism-info-top-center")) : "tc" == r.align ? (n.addClass(t, "prism-info-top-center"), n.removeClass(t, "prism-info-left-bottom")) : (n.removeClass(t, "prism-info-left-bottom"), n.removeClass(t, "prism-info-top-center")), r.isBlack ? n.addClass(t, "prism-info-black") : n.removeClass(t, "prism-info-black")) : t.innerHTML = r, n.css(t, "display", "block"))
            }), i._player.on(o.Private.Info_Hide, function (e) {
              var t = document.querySelector("#" + i.id());
              n.css(t, "display", "none")
            })
          }, disposeUI: function () {
            this.handler && (clearTimeout(this.handler), this.handler = null)
          }
        });
    t.exports = a
  }, {
    "../../lang/index": 210,
    "../../lib/dom": 217,
    "../../lib/event": 218,
    "../../lib/ua": 230,
    "../../lib/util": 232,
    "../../player/base/event/eventtype": 242,
    "../component": 294
  }],
  303: [function (e, t, r) {
    var i = e("../component"), n = e("./util"), o = (e("../../lib/util"), e("../../lib/dom")), a = e("../../lib/event"),
        s = e("../../lib/playerUtil"), l = e("../../lang/index"), u = i.extend({
          init: function (e, t) {
            i.call(this, e, t), this.addClass("prism-live-display")
          }, createEl: function () {
            var e = i.prototype.createEl.call(this, "p");
            return e.innerText = "LIVE", s.isLiveShift(this._player._options) && o.addClass(e, "live-shift-display"), e
          }, bindEvent: function () {
            var e = document.querySelector("#" + this.id()), t = this;
            s.isLiveShift(this._player._options) && (a.on(e, "click", function () {
              t._player._liveshiftService.switchToLive()
            }), n.registerTooltipEvent.call(this, this.el(), l.get("SwitchToLive")))
          }
        });
    t.exports = u
  }, {
    "../../lang/index": 210,
    "../../lib/dom": 217,
    "../../lib/event": 218,
    "../../lib/playerUtil": 227,
    "../../lib/util": 232,
    "../component": 294,
    "./util": 321
  }],
  304: [function (e, t, r) {
    var i = e("../component"), n = (e("../../lib/dom"), e("../../lib/event"), e("../../player/base/event/eventtype")),
        o = e("../../player/base/plugin/status"), a = i.extend({
          init: function (e, t) {
            i.call(this, e, t), this.addClass("prism-animation")
          }, bindEvent: function () {
            var t = this;
            this._player.on(n.Player.Play, function () {
              t._player._isManualPlay && (t.removeClass("prism-pause-animation"), t.addClass("prism-play-animation"), t.removeClass("play-apply-animation"), t.playHandler && clearTimeout(t.playHandler), t.playHandler = setTimeout(function () {
                t.addClass("play-apply-animation")
              }))
            }), this._player.on(n.Player.Pause, function () {
              var e = t._player._status;
              e != o.ended && e != o.error && t._player._isManualPause && (t.removeClass("prism-play-animation"), t.addClass("prism-pause-animation"), t.removeClass("play-apply-animation"), t.pauseHandler && clearTimeout(t.pauseHandler), t.pauseHandler = setTimeout(function () {
                t.addClass("play-apply-animation")
              }))
            })
          }, disposeUI: function () {
            this.playHandler && (clearTimeout(this.playHandler), this.playHandler = null), this.pauseHandler && (clearTimeout(this.pauseHandler), this.pauseHandler = null)
          }
        });
    t.exports = a
  }, {
    "../../lib/dom": 217,
    "../../lib/event": 218,
    "../../player/base/event/eventtype": 242,
    "../../player/base/plugin/status": 265,
    "../component": 294
  }],
  305: [function (e, t, r) {
    var i = e("../component"), n = e("../../player/base/event/eventtype"), o = e("./util"), a = e("../../lang/index"),
        s = i.extend({
          init: function (e, t) {
            i.call(this, e, t), this.addClass("prism-play-btn")
          }, bindEvent: function () {
            var t = this;
            this._player.on(n.Player.Play, function () {
              t.addClass("playing")
            }), this._player.on(n.Player.Pause, function () {
              t.removeClass("playing")
            }), this.on(n.Private.PlayClick, function () {
              var e;
              t._player.paused() ? (e = t._player.getCurrentTime(), (t._player.getDuration() <= e || t._player._ended || t._player.exceedPreviewTime(e)) && t._player.seek(0), t._player.play(!0), t.addClass("playing")) : (t._player.pause(!0), t.removeClass("playing")), t._player.trigger(n.Private.MarkerTextHide)
            }), o.registerTooltipEvent.call(this, this.el(), function () {
              return t._player.paused() ? a.get("Play") : a.get("Pause")
            })
          }
        });
    t.exports = s
  }, {"../../lang/index": 210, "../../player/base/event/eventtype": 242, "../component": 294, "./util": 321}],
  306: [function (e, t, r) {
    var i = e("../component"), a = e("../../lib/dom"), o = (e("../../lib/constants"), e("../../lib/event")),
        s = e("../../lib/ua"), l = e("../../lib/function"), n = e("../../lang/index"), u = e("../../config"),
        c = e("../../lib/util"), h = e("../../player/base/event/eventtype"), d = i.extend({
          init: function (e, t) {
            i.call(this, e, t), this._seekTime = -1, this.addClass("prism-progress")
          }, createEl: function () {
            var e = i.prototype.createEl.call(this);
            return e.innerHTML = '<div class="prism-progress-loaded"></div><div class="prism-progress-played"></div><div class="prism-progress-marker"></div><div class="prism-progress-cursor"><img></img></div><p class="prism-progress-time"></p>', e
          }, bindEvent: function () {
            var t = this;
            this.loadedNode = document.querySelector("#" + this.id() + " .prism-progress-loaded"), this.playedNode = document.querySelector("#" + this.id() + " .prism-progress-played"), this.cursorNode = document.querySelector("#" + this.id() + " .prism-progress-cursor"), this.timeNode = document.querySelector("#" + this.id() + " .prism-progress-time"), this.timeNode = document.querySelector("#" + this._player._options.id + " .prism-progress-time"), this.thumbnailNode = document.querySelector(".prism-thumbnail");
            var r = document.querySelector("#" + this.id()),
                e = document.querySelector("#" + this.id() + " .prism-progress-cursor img"), i = "",
                i = u.domain ? "https://" + u.domain + "/de/prismplayer/" + u.h5Version + "/skins/default/img/dragcursor.png" : "/build/skins/default/img/dragcursor.png";
            e.src = i, o.on(this.cursorNode, "mousedown", function (e) {
              t._onMouseDown(e)
            }), o.on(this.cursorNode, "touchstart", function (e) {
              t._onMouseDown(e)
            }), o.on(r, "mousemove", function (e) {
              t._progressMove(e)
            }), o.on(r, "touchmove", function (e) {
              t._progressMove(e)
            });

            function n(e) {
              t._progressDown = e
            }

            o.on(r, "mousedown", function (e) {
              n(!0)
            }), o.on(r, "touchstart", function (e) {
              n(!0)
            }), o.on(r, "mouseup", function (e) {
              n(!1)
            }), o.on(r, "touchend", function (e) {
              n(!1)
            }), o.on(this._el, "click", function (e) {
              t._onMouseClick(e)
            }), this._player.on(h.Private.HideProgress, function (e) {
              t._hideProgress(e)
            }), this._player.on(h.Private.CancelHideProgress, function (e) {
              t._cancelHideProgress(e)
            }), o.on(r, h.Private.MouseOver, function (e) {
              t._onMouseOver(e)
            }), o.on(r, h.Private.MouseOut, function (e) {
              t._onMouseOut(e)
            }), o.on(this.controlNode, h.Private.MouseLeave, function (e) {
              t._offMouseUp()
            }), s.IS_PC ? (o.on(r, "mouseover", function () {
              a.addClass(r, "prism-progress-hover"), a.addClass(t.cursorNode, "cursor-hover")
            }), o.on(r, "mouseout", function (e) {
              a.removeClass(r, "prism-progress-hover"), a.removeClass(t.cursorNode, "cursor-hover"), t._progressDown = !1
            })) : (a.addClass(r, "prism-progress-hover"), a.addClass(t.cursorNode, "cursor-hover")), this.bindTimeupdate = l.bind(this, this._onTimeupdate), this._player.on(h.Player.TimeUpdate, this.bindTimeupdate), s.IS_IPAD ? this.interval = setInterval(function () {
              t._onProgress()
            }, 500) : this._player.on(h.Video.Progress, function () {
              t._onProgress()
            })
          }, _progressMove: function (e) {
            e.preventDefault();
            var t, r, i = this._getSeconds(e);
            i != 1 / 0 && (t = c.formatTime(i), r = this._getDistance(e), this.cursorNode && (this._player.trigger(h.Private.ThumbnailShow, {
              time: i,
              formatTime: t,
              left: r,
              progressWidth: this.el().offsetWidth
            }), this._progressDown && this._onMouseMove(e)))
          }, _hideProgress: function (e) {
            o.off(this.cursorNode, "mousedown"), o.off(this.cursorNode, "touchstart")
          }, _cancelHideProgress: function (e) {
            var t = this;
            o.on(this.cursorNode, "mousedown", function (e) {
              t._onMouseDown(e)
            }), o.on(this.cursorNode, "touchstart", function (e) {
              t._onMouseDown(e)
            })
          }, _canSeekable: function (e) {
            var t = !0;
            return "function" == typeof this._player.canSeekable && (t = this._player.canSeekable(e)), t
          }, _onMouseOver: function (e) {
            this._cursorHideHandler && (clearTimeout(this._cursorHideHandler), this._cursorHideHandler = null), this._mouseInProgress || this._updateCursorPosition(this._player.getCurrentTime()), this._mouseInProgress = !0
          }, _onMouseOut: function (e) {
            var t = this;
            this._cursorHideHandler && clearTimeout(this._cursorHideHandler), this._cursorHideHandler = setTimeout(function () {
              t._player.trigger(h.Private.ThumbnailHide), t._mouseInProgress = !1
            })
          }, _getSeconds: function (e) {
            var t = this._getDistance(e), r = this.el().offsetWidth,
                i = this._player.getDuration() ? t / r * this._player.getDuration() : 0;
            return i < 0 && (i = 0), i > this._player.getDuration() && (i = this._player.getDuration()), i
          }, _getDistance: function (e) {
            for (var t = this.el().offsetLeft, r = this.el(); r = r.offsetParent;) {
              var i = a.getTranslateX(r);
              t += r.offsetLeft + i
            }
            var n = e.touches ? e.touches[0].pageX : e.pageX;
            return Math.abs(n - t)
          }, _onMouseClick: function (e) {
            var t = this, r = t._getSeconds(e);
            t._canSeekable(r) ? (t._player.exceedPreviewTime(r) && (r = t._player.getPreviewTime()), this._seekTime = r, t._updateProgressBar(this.playedNode, r), t._updateCursorPosition(r), this._mouseClickTimeHandle && clearTimeout(this._mouseClickTimeHandle), this._mouseClickTimeHandle = setTimeout(function () {
              t._player._seeking = !0, t._mouseDown || t._player.trigger(h.Private.SeekStart, {fromTime: t._player.getCurrentTime()}), t._player.seek(r), t._mouseDown = !1, t._player.trigger(h.Private.EndStart, {toTime: r}), t._mouseClickTimeHandle = null, t._inWaitingSeek = !1
            }, 0), this._inWaitingSeek = !0) : t._player.trigger(h.Private.Info_Show, {
              text: n.get("Can_Not_Seekable"),
              duration: 2e3
            })
          }, _onMouseDown: function (e) {
            var t = this;
            e.preventDefault(), this._mouseDown = !0, this._player.trigger(h.Private.SeekStart, {fromTime: this._player.getCurrentTime()}), o.on(this.controlNode, "mousemove", function (e) {
              t._onMouseMove(e)
            }), o.on(this.controlNode, "touchmove", function (e) {
              t._onMouseMove(e)
            }), o.on(this.controlNode, "mouseup", function (e) {
              t._onControlBarMouseUp(e)
            }), o.on(this.controlNode, "touchend", function (e) {
              t._onControlBarMouseUp(e)
            })
          }, _onMouseUp: function (e) {
            this._onMouseUpIntern(e)
          }, _onControlBarMouseUp: function (e) {
            this._onMouseUpIntern(e)
          }, _onPlayerMouseUp: function (e) {
            this._onMouseUpIntern(e)
          }, _offMouseUp: function () {
            o.off(this.controlNode, "mousemove"), o.off(this.controlNode, "touchmove"), o.off(this.controlNode, "mouseup"), o.off(this.controlNode, "touchend")
          }, _onMouseUpIntern: function (e) {
            e.preventDefault(), this._offMouseUp();
            var t = this.playedNode.offsetWidth / this.el().offsetWidth * this._player.getDuration();
            this._player.getDuration();
            isNaN(t) || this._player.seek(t), this._player.trigger(h.Private.EndStart, {toTime: t}), this._mouseDown = !1
          }, _onMouseMove: function (e) {
            e.preventDefault();
            var t = this._getSeconds(e);
            this._player.exceedPreviewTime(t) && (t = this._player.getPreviewTime()), this._player.seek(t), this._updateProgressBar(this.playedNode, t), this._updateCursorPosition(t)
          }, _onTimeupdate: function (e) {
            var t = this._player.tag.currentSrc.split("."), r = !(!t || "mp4" !== t[t.length - 1]), i = !1;
            this.thumbnailNode && (this.thumbnailNode.style.display = "none"), r && (s.IS_MAC_SAFARI && (i = !0), s.IS_IOS && (i = !0), s.IS_IE11 && (i = !0)), (this._inWaitingSeek || this._player._seeking && !s.IS_EDGE || this._progressDown) && !i || (this._updateProgressBar(this.playedNode, this._player.getCurrentTime()), this._updateCursorPosition(this._player.getCurrentTime()), this._player.trigger(h.Private.UpdateProgressBar, {time: this._player.getCurrentTime()}))
          }, _onProgress: function (e) {
            this._player.getDuration() && 1 <= this._player.getBuffered().length && this._updateProgressBar(this.loadedNode, this._player.getBuffered().end(this._player.getBuffered().length - 1))
          }, _updateProgressBar: function (e, t) {
            var r, i = this._player.getDuration();
            1 != this._player._switchSourcing && i && (-1 != this._seekTime && (this._player.getCurrentTime() >= this._seekTime || !this._player._seeking ? this._seekTime = -1 : t = this._seekTime), 1 < (r = t / i + .005) && (r = 1), e && a.css(e, "width", 100 * r + "%"))
          }, _updateCursorPosition: function (e) {
            var t, r, i, n, o = this._player.getDuration();
            1 != this._player._switchSourcing && o && (t = 1, i = 10 / (r = this._player.el().clientWidth), 0 != r && (t = 1 - i), n = (n = e / o - i) < 0 ? 0 : n, this.cursorNode && (t < n ? (a.css(this.cursorNode, "right", "0px"), a.css(this.cursorNode, "left", "auto")) : (a.css(this.cursorNode, "right", "auto"), a.css(this.cursorNode, "left", 100 * n + "%"))))
          }, disposeUI: function () {
            this.cursorNodeHandler && (clearTimeout(this.cursorNodeHandler), this.cursorNodeHandler = null), this._cursorHideHandler && (clearTimeout(this._cursorHideHandler), this._cursorHideHandler = null), this._mouseClickTimeHandle && (clearTimeout(this._mouseClickTimeHandle), this._mouseClickTimeHandle = null)
          }
        });
    t.exports = d
  }, {
    "../../config": 204,
    "../../lang/index": 210,
    "../../lib/constants": 214,
    "../../lib/dom": 217,
    "../../lib/event": 218,
    "../../lib/function": 219,
    "../../lib/ua": 230,
    "../../lib/util": 232,
    "../../player/base/event/eventtype": 242,
    "../component": 294
  }],
  307: [function (e, t, r) {
    var i = e("../component"), n = (e("../../lib/util"), e("../../lib/dom")), o = e("../../lib/event"),
        a = e("../../player/base/event/eventtype"), s = i.extend({
          init: function (e, t) {
            i.call(this, e, t), this.addClass("prism-marker-text")
          }, createEl: function () {
            var e = i.prototype.createEl.call(this, "div");
            return e.innerHTML = "<p></p>", e
          }, bindEvent: function () {
            var i = this;
            i._player.on(a.Private.MarkerTextShow, function (e) {
              var t = e.paramData, r = a.Player.MarkerDotOver;
              i._player.trigger(r, e.paramData), t.progressMarker.isCustomized ? i._player.trigger(a.Private.LifeCycleChanged, {
                type: r,
                data: e.paramData
              }) : (i._thumbnailShowHanlde && (n.css(i.el(), "display", "none"), clearTimeout(i._thumbnailShowHanlde)), i._thumbnailShowHanlde = setTimeout(function () {
                var e;
                document.querySelector("#" + i.id() + " p").innerText = t.progressMarker.text || "", t && (n.css(i.el(), "display", "block"), e = i._player.el().offsetWidth, left = e * t.left, width = i.el().offsetWidth, left + width > e ? (n.css(i.el(), "right", "0px"), n.css(i.el(), "left", "auto")) : (left -= width / 2, left = left < 0 ? 0 : left, n.css(i.el(), "right", "auto"), n.css(i.el(), "left", left + "px")))
              }, 30))
            }), i._player.on(a.Private.MarkerTextHide, function (e) {
              i._player.trigger(a.Player.MarkerDotOut), i._player.trigger(a.Private.LifeCycleChanged, {
                type: a.Player.MarkerDotOut,
                data: ""
              }), i._thumbnailShowHanlde && clearTimeout(i._thumbnailShowHanlde), n.css(i.el(), "display", "none")
            }), o.on(i._player.tag, "click", function (e) {
              e && e.target == e.currentTarget && i._player.trigger(a.Private.MarkerTextHide)
            }), o.on(i._player.tag, "touchstart", function (e) {
              e && e.target == e.currentTarget && i._player.trigger(a.Private.MarkerTextHide)
            })
          }, disposeUI: function () {
            this._thumbnailShowHanlde && (clearTimeout(this._thumbnailShowHanlde), this._thumbnailShowHanlde = null)
          }
        });
    t.exports = s
  }, {
    "../../lib/dom": 217,
    "../../lib/event": 218,
    "../../lib/util": 232,
    "../../player/base/event/eventtype": 242,
    "../component": 294
  }],
  308: [function (e, t, r) {
    var i = e("./selector"), s = e("../../../lib/object"), u = (e("../../../lib/util"), e("../../../lib/cookie")),
        l = e("../../../lib/dom"), c = (e("../../../lib/event"), e("../../../lib/constants")),
        h = e("../../../lang/index"), d = e("../../../player/base/event/eventtype"), n = i.extend({
          init: function (e, t) {
            this.Name = h.get("Quality"), this.Type = "quality", this.Tooltip = h.get("Quality_Switch_To"), i.call(this, e, t), this._isMasterLevel = !1
          }, showTip: function (e, t) {
            this._player.trigger(d.Private.Info_Show, {text: e, duration: t, align: "lb"})
          }, bindEvent: function () {
            this.bindCommonEvent();
            var a = this;
            this._player.on(d.Private.QualityChange, function (e) {
              var t, r, i, n, o = 0 < a._player._urls.length ? a._player._urls : a._player._qualityService.levels;
              data = e.paramData, data.levelSwitch ? (t = data.desc ? data.desc : data.bitrate, a._autoSWitchDesc = t, a._updateText(t)) : 0 < a._player._currentPlayIndex && (a._autoSWitchDesc = "", i = o[(r = a._player._currentPlayIndex) - 1].desc, n = o[r].desc, a.showTip(i + e.paramData + n, 1e3), a._player.trigger(d.Private.SelectorValueChange, o[r].Url))
            });
            var e = document.querySelector("#" + a.id() + " .selector-list");
            this._player.on(d.Player.LevelSwitch, function () {
              l.addClass(e, "disabled")
            }), this._player.on(d.Player.LevelSwitched, function () {
              l.removeClass(e, "disabled")
            })
          }, generateList: function (e) {
            var t = this._player._urls, n = this._player._currentPlayIndex, r = this._player._qualityService.levels;
            0 < r.length && (this._isMasterLevel = !0, n = (t = r).length - 1);
            var o, a = document.querySelector("#" + this.id() + " .selector-list");
            0 < t.length && (o = this, s.each(t, function (e, t) {
              var r, i;
              (e.desc ? e.desc : e.bitrate) && (r = l.createEl.call(this, "li", {
                key: e.Url,
                index: t,
                text: e.desc ? e.desc : e.bitrate
              }), i = l.createEl.call(this, "span", {
                key: e.Url,
                index: t,
                text: e.desc ? e.desc : e.bitrate
              }), t == n && (l.addClass(r, "current"), o._previousSelection = r), i.innerText = e.desc ? e.desc : e.bitrate, r.appendChild(i), a.appendChild(r))
            })), this._autoSWitchDesc && this._updateText(this._autoSWitchDesc)
          }, execute: function (e) {
            if (this._player._switchSourcing = !0, this._isMasterLevel) {
              for (var t = this._player._qualityService.levels, r = 0; r < t.length; r++) t[r].Url == e && t[r].desc != h.get("Auto") && this._updateText("");
              this._player._switchLevel && this._player._switchLevel(e)
            } else {
              for (var i, n, o = this._player._urls.length, a = this._player._currentPlayIndex, s = -1, r = 0; r < o; r++) if (this._player._urls[r].Url == e) {
                s = this._player._currentPlayIndex = r, u.set(c.SelectedStreamLevel, this._player._urls[r].definition, 365);
                break
              }
              a != s && -1 < s ? (i = this._player.getCurrentTime(), this._previousCurrentTime ? "playing" != this._player._status && (i = this._previousCurrentTime) : this._previousCurrentTime = i, this._previousCurrentTime = i, n = this._player.autoplay || "pause" != this._player._status, this._player.autoplay || 0 != i || (n = !1), this._player._switchLevel && !this._player._options.isLive ? this._player._switchLevel(e) : this._player._loadByUrlInner(e, i, n)) : this._player._loadByUrlInner(e, i, n)
            }
            var l = this;
            setTimeout(function () {
              l._player._switchSourcing = !1
            })
          }, _updateText: function (e) {
            var t = document.querySelector("#" + this.id() + " .selector-list .current"),
                r = document.querySelector("#" + this.id() + " .selector-list .current span"), i = h.get("Auto");
            r && r.innerText && -1 < r.innerText.indexOf(i) && (i += e ? "(" + e + ")" : "", r.innerText = i, t && (t.text = i))
          }
        });
    t.exports = n
  }, {
    "../../../lang/index": 210,
    "../../../lib/constants": 214,
    "../../../lib/cookie": 215,
    "../../../lib/dom": 217,
    "../../../lib/event": 218,
    "../../../lib/object": 225,
    "../../../lib/util": 232,
    "../../../player/base/event/eventtype": 242,
    "./selector": 314
  }],
  309: [function (e, t, r) {
    var i = e("./selector"), a = e("../../../lib/object"),
        s = (e("../../../lib/util"), e("../../../lib/cookie"), e("../../../lib/dom")),
        n = (e("../../../lib/event"), e("./util"), e("../../../lang/index")),
        l = e("../../../player/base/event/eventtype"), o = i.extend({
          init: function (e, t) {
            this.Name = n.get("AudioTrack"), this.Type = "audio", this.Tooltip = n.get("AudioTrack_Switch_To"), i.call(this, e, t)
          }, bindEvent: function () {
            this.bindCommonEvent();
            var n = this, o = document.querySelector("#" + n.id() + " .selector-list");
            document.querySelector("#" + n.id() + " .header");
            n._player.on(l.Private.ChangeURL, function () {
              n._hasGeneratedList = !1
            }), this._player.on(l.Player.AudioTrackSwitch, function () {
              s.addClass(o, "disabled")
            }), this._player.on(l.Player.AudioTrackSwitched, function () {
              s.removeClass(o, "disabled")
            }), n._player.on(l.Player.AudioTrackReady, function (e) {
              n._hasGeneratedList || (n._clear(), (e = e.paramData) && (a.each(e, function (e, t) {
                var r = s.createEl.call(n, "li", {key: e.value, text: e.text}),
                    i = s.createEl.call(n, "span", {key: e.value, text: e.text});
                i.innerText = e.text, r.appendChild(i), o.appendChild(r)
              }), n._hasGeneratedList = !0))
            })
          }, execute: function (e) {
            this._player._audioTrackService["switch"](e)
          }
        });
    t.exports = o
  }, {
    "../../../lang/index": 210,
    "../../../lib/cookie": 215,
    "../../../lib/dom": 217,
    "../../../lib/event": 218,
    "../../../lib/object": 225,
    "../../../lib/util": 232,
    "../../../player/base/event/eventtype": 242,
    "./selector": 314,
    "./util": 316
  }],
  310: [function (e, t, r) {
    var i = e("../../component"), n = (e("../../../lib/dom"), e("../../../player/base/event/eventtype")),
        o = e("./list"), a = e("../../../lang/index"), s = e("../util"), l = i.extend({
          init: function (e, t) {
            i.call(this, e, t), this.addClass(t.className || "prism-setting-btn"), this._settingList = new o(e, t), e.addChild(this._settingList, t)
          }, createEl: function () {
            return i.prototype.createEl.call(this, "div")
          }, bindEvent: function () {
            var e = this;
            this.on("click", function () {
              e._settingList.isOpened ? e._player.trigger(n.Private.SettingListHide) : e._player.trigger(n.Private.SettingListShow), e._player.trigger(n.Private.SelectorHide), e._player.trigger(n.Private.MarkerTextHide), e._player.trigger(n.Private.VolumeVisibilityChange, "")
            }), s.registerTooltipEvent.call(this, this.el(), a.get("Setting"))
          }
        });
    t.exports = l
  }, {
    "../../../lang/index": 210,
    "../../../lib/dom": 217,
    "../../../player/base/event/eventtype": 242,
    "../../component": 294,
    "../util": 321,
    "./list": 313
  }],
  311: [function (e, t, r) {
    var i = e("./selector"), s = e("../../../lib/object"), l = e("../../../lib/dom"),
        n = (e("../../../lib/event"), e("./util"), e("../../../lib/cookie")), o = e("../../../lib/constants"),
        a = e("../../../lang/index"), u = e("../../../player/base/event/eventtype"), c = i.extend({
          init: function (e, t) {
            this.Name = a.get("Subtitle"), this.Type = "cc", this.Tooltip = a.get("CC_Switch_To"), i.call(this, e, t)
          }, bindEvent: function () {
            this.bindCommonEvent();
            var n = this;
            this._player.on(u.Private.CCStateChanged, function (e) {
              var t = e.paramData.value, r = e.paramData.lang;
              "on" == t && r ? n._backCCText = r : "off" == t && "" == n._backCCText && (n._backCCText = n._previousSelection.text);
              var i = "Off";
              "on" == t && (i = n._backCCText), n._player.trigger(u.Private.SelectorUpdateList, {type: "cc", text: i})
            })
          }, generateList: function (n) {
            var o = document.querySelector("#" + this.id() + " .selector-list"), e = this._player._ccService.tracks,
                a = this;
            s.each(e, function (e, t) {
              var r = l.createEl.call(this, "li", {key: e.value, text: e.text}),
                  i = l.createEl.call(this, "span", {key: e.value, text: e.text});
              e.text == n && (l.addClass(r, "current"), a._previousSelection = r), i.innerText = e.text, r.appendChild(i), o.appendChild(r)
            })
          }, execute: function (e) {
            this._backCCText = "", n.set(o.SelectedCC, e, 365), this._player._ccService["switch"](e), this._player.trigger(u.Private.CCChanged, e)
          }
        });
    t.exports = c
  }, {
    "../../../lang/index": 210,
    "../../../lib/constants": 214,
    "../../../lib/cookie": 215,
    "../../../lib/dom": 217,
    "../../../lib/event": 218,
    "../../../lib/object": 225,
    "../../../player/base/event/eventtype": 242,
    "./selector": 314,
    "./util": 316
  }],
  312: [function (e, t, r) {
    t.exports = {CC: e("./cc"), Speed: e("./speed"), Quality: e("./Quality"), Audio: e("./audio")}
  }, {"./Quality": 308, "./audio": 309, "./cc": 311, "./speed": 315}],
  313: [function (e, t, r) {
    var a = e("../../component"), i = e("../../../lib/dom"), o = e("../../../lib/ua"), s = e("../../../lib/event"),
        l = e("../../../player/base/event/eventtype"), n = e("./export"), u = e("./util"), c = e("../../../lang/index"),
        h = a.extend({
          init: function (e, t) {
            for (var r in this.isOpened = !1, a.call(this, e, t), this.addClass(t.className || "prism-setting-list"), n) {
              var i = new n[r](e, t);
              e.addChild(i, t)
            }
          }, createEl: function () {
            var e = a.prototype.createEl.call(this, "div"),
                t = "<div class='prism-setting-item prism-setting-{type}' type={type}><div class='setting-content'><span class='setting-title'>{value}</span><span class='array'></span><span class='current-setting'></span></div></div>",
                r = t.replace(/{type}/g, "speed").replace("{value}", c.get("Speed")),
                i = t.replace(/{type}/g, "cc").replace("{value}", c.get("Subtitle")),
                n = t.replace(/{type}/g, "audio").replace("{value}", c.get("AudioTrack")),
                o = t.replace(/{type}/g, "quality").replace("{value}", c.get("Quality"));
            return e.innerHTML = r + i + n + o, e
          }, bindEvent: function () {
            document.querySelector("#" + this.id() + " .prism-setting-speed .current-setting").innerText = c.get("Speed_1X_Text");

            function t() {
              n._player.trigger(l.Private.SettingListHide), n.isOpened = !1
            }

            function r(e) {
              e && e.text && (document.querySelector("#" + n.id() + " .prism-setting-" + e.type + " .current-setting").innerText = e.text)
            }

            var n = this;
            this._player.on(l.Private.SettingListShow, function (e) {
              n.isOpened = !0;
              e = e.paramData;
              r(e), i.css(n.el(), "display", "block")
            }), this._player.on(l.Private.UpdateToSettingList, function (e) {
              e = e.paramData;
              r(e)
            }), this._player.on(l.Private.SelectorUpdateList, function (e) {
              e = e.paramData;
              r(e), n._player.trigger(l.Private.SelectorValueChange, e)
            }), this._player.on(l.Private.SettingListHide, function () {
              n.isOpened = !1, i.css(n.el(), "display", "none")
            }), s.on(this.el(), "click", function (e) {
              n._player.trigger(l.Private.SettingListHide);
              var t, r = e.srcElement ? e.srcElement : e.target;
              (r = u.findItemElementForList(r)) && (t = r.getAttribute("type"), n._player.trigger(l.Private.SelectorShow, {type: t}))
            });
            var e = o.IS_MOBILE ? "touchleave" : "mouseleave";
            s.on(this.el(), e, function () {
              t()
            }), s.on(this._player.tag, "click", function (e) {
              e && e.target == e.currentTarget && t()
            }), s.on(this._player.tag, "touchstart", function (e) {
              e && e.target == e.currentTarget && t()
            }), this._player.on(l.Private.QualityChange, function (e) {
              var t, r, i = e.paramData;
              i.levelSwitch && (t = document.querySelector("#" + n.id() + " .prism-setting-quality .current-setting"), r = c.get("Auto"), -1 < t.innerText.indexOf(r) && (t.innerText = r + (i.desc ? "(" + i.desc + ")" : "")))
            })
          }
        });
    t.exports = h
  }, {
    "../../../lang/index": 210,
    "../../../lib/dom": 217,
    "../../../lib/event": 218,
    "../../../lib/ua": 230,
    "../../../player/base/event/eventtype": 242,
    "../../component": 294,
    "./export": 312,
    "./util": 316
  }],
  314: [function (e, t, r) {
    var i = e("../../component"), n = (e("../../../lib/object"), e("../../../lib/util"), e("../../../lib/ua")),
        a = (e("../../../lib/cookie"), e("../../../lib/dom")), s = e("../../../lib/event"), l = e("./util"),
        u = (e("../../../lang/index"), e("../../../player/base/event/eventtype")), o = i.extend({
          init: function (e, t) {
            this._hasGeneratedList = !1, this._previousSelection = null, this._backupSelector = "", i.call(this, e, t), this.className = t.className ? t.className : "prism-" + this.Type + "-selector prism-setting-selector", this.addClass(this.className)
          }, createEl: function () {
            var e = i.prototype.createEl.call(this, "div");
            return e.innerHTML = '<div class="header"><div class="left-array"></div><span>' + this.Name + '</span></div><ul class="selector-list"></ul>', e
          }, bindEvent: function () {
            this.bindCommonEvent()
          }, bindCommonEvent: function () {
            var o = this, e = document.querySelector("#" + o.id() + " .selector-list"),
                t = document.querySelector("#" + o.id() + " .header");
            this._player.on(u.Private.ChangeURL, function () {
              o._hasGeneratedList = !1
            }), s.on(t, "click", function () {
              o._player.trigger(u.Private.SelectorHide), o._player.trigger(u.Private.SettingListShow, {
                type: o.Type,
                text: o._previousSelection ? o._previousSelection.text : ""
              })
            }), s.on(e, "click", function (e) {
              var t, r = e.srcElement ? e.srcElement : e.target, i = r.key, n = r.text;
              void 0 !== n && (o._previousSelection && a.removeClass(o._previousSelection, "current"), o._previousSelection = l.findliElementForSelector(r), a.addClass(o._previousSelection, "current"), o.execute && o.execute(i), t = o.Tooltip + "<span>" + n + "</span>", o._player.trigger(u.Private.Info_Show, {
                text: t,
                duration: 1e3,
                align: "lb"
              }))
            }), o._player.on(u.Private.SelectorHide, function () {
              r()
            }), o._player.on(u.Private.SelectorValueChange, function (e) {
              var t = e.paramData;
              if (t) {
                if (t.type != o.Type) return;
                var r = document.querySelectorAll("#" + o.id() + " .selector-list li");
                if (r) {
                  var i = r.length;
                  0 == i && (o._backupSelector = t.text);
                  for (var n = 0; n < i; n++) if (r[n].text == t.text) {
                    o._previousSelection && a.removeClass(o._previousSelection, "current"), a.addClass(r[n], "current"), o._previousSelection = r[n];
                    break
                  }
                }
              }
            }), o._player.on(u.Private.SelectorShow, function (e) {
              var t;
              (e = e.paramData).type == o.Type && (t = document.querySelector("#" + o._player.id() + " .prism-" + e.type + "-selector"), o._hasGeneratedList || (o._clear(), o.generateList(o._backupSelector), o._backupSelector = "", o._hasGeneratedList = !0), a.css(t, "display", "block"))
            });
            var r = function () {
              a.css(o.el(), "display", "none"), o._player.trigger(u.Private.UpdateToSettingList, {
                type: o.Type,
                text: o._previousSelection ? o._previousSelection.text : ""
              })
            }, i = n.IS_MOBILE ? "touchleave" : "mouseleave";
            s.on(this.el(), i, function () {
              r()
            }), s.on(this._player.tag, "click", function (e) {
              e && e.target == e.currentTarget && r()
            }), s.on(this._player.tag, "touchstart", function (e) {
              e && e.target == e.currentTarget && r()
            })
          }, setSelected: function (e) {
          }, generateList: function () {
          }, _clear: function () {
            document.querySelector("#" + this.id() + " .selector-list").innerHTML = ""
          }
        });
    t.exports = o
  }, {
    "../../../lang/index": 210,
    "../../../lib/cookie": 215,
    "../../../lib/dom": 217,
    "../../../lib/event": 218,
    "../../../lib/object": 225,
    "../../../lib/ua": 230,
    "../../../lib/util": 232,
    "../../../player/base/event/eventtype": 242,
    "../../component": 294,
    "./util": 316
  }],
  315: [function (e, t, r) {
    var i = e("./selector"), a = e("../../../lib/object"),
        s = (e("../../../lib/util"), e("../../../lib/cookie"), e("../../../lib/dom")),
        l = (e("../../../lib/event"), e("./util"), e("../../../lib/constants")), u = e("../../../lang/index"),
        n = (e("../../../player/base/event/eventtype"), i.extend({
          init: function (e, t) {
            this.Name = u.get("Speed"), this.Type = "speed", this.Tooltip = u.get("Speed_Switch_To"), i.call(this, e, t)
          }, generateList: function () {
            var n = document.querySelector("#" + this.id() + " .selector-list"), e = l.SpeedLevels, o = this;
            a.each(e, function (e, t) {
              var r = s.createEl.call(this, "li", {key: e.key, text: e.text}),
                  i = s.createEl.call(this, "span", {key: e.key, text: e.text});
              i.innerText = e.text, e.text == u.get("Speed_1X_Text") && (s.addClass(r, "current"), o._previousSelection = r), r.appendChild(i), n.appendChild(r)
            })
          }, execute: function (e) {
            this._player.setSpeed(e)
          }
        }));
    t.exports = n
  }, {
    "../../../lang/index": 210,
    "../../../lib/constants": 214,
    "../../../lib/cookie": 215,
    "../../../lib/dom": 217,
    "../../../lib/event": 218,
    "../../../lib/object": 225,
    "../../../lib/util": 232,
    "../../../player/base/event/eventtype": 242,
    "./selector": 314,
    "./util": 316
  }],
  316: [function (e, r, t) {
    r.exports.findliElementForSelector = function (e) {
      if (!e || "li" == e.tagName.toLowerCase()) return e;
      var t = e.parentElement;
      return t && "li" == t.tagName.toLowerCase() ? t : null
    }, r.exports.findliElementByKey = function (e, t) {
      document.querySelectors(e);
      return null
    }, r.exports.findItemElementForList = function (e) {
      if (!e || -1 < e.className.indexOf("prism-setting-item")) return e;
      var t = e.parentElement;
      return t && (e = r.exports.findItemElementForList(t)), e
    }
  }, {}],
  317: [function (e, t, r) {
    var i = e("../component"), n = e("../../lib/dom"), p = e("../../lib/util"), o = e("../../lang/index"),
        y = e("../../player/base/event/eventtype"), a = e("./util"), s = i.extend({
          init: function (e, t) {
            i.call(this, e, t), this.addClass("prism-snapshot-btn")
          }, createEl: function () {
            return i.prototype.createEl.call(this, "div")
          }, bindEvent: function () {
            var f = this;
            this._player.on(y.Private.Snapshot_Hide, function () {
              n.css(f._el, "display", "none")
            }), a.registerTooltipEvent.call(this, this.el(), o.get("Snapshot")), this.on("click", function () {
              f.trigger(y.Player.Snapshoting);
              var e = document.createElement("canvas"), t = f._player.tag, r = t.videoWidth, i = t.videoHeight,
                  n = f._player._getSanpshotMatric();
              e.width = n.width || r, e.height = n.height || i;
              var o = f._player.getCurrentTime(), a = e.getContext("2d");
              a.save();
              var s = f._player.getImage();
              "vertical" == s ? (a.translate(0, e.height), a.scale(1, -1)) : "horizon" == s && (a.translate(e.width, 0), a.scale(-1, 1)), a.drawImage(t, 0, 0, r, i), a.restore(), m(a, f._player.getOptions());
              var l = "", u = "";
              try {
                l = e.toDataURL("image/jpeg", n.rate || 1)
              } catch (e) {
                u = e
              }
              var c = "", h = "", d = "";
              l && (h = (c = l).substr(c.indexOf(",") + 1), d = p.toBinary(h)), f.trigger(y.Player.Snapshoted, {
                time: o,
                base64: c,
                binary: d,
                error: u
              })
            })
          }
        }), m = function (e, t) {
          var r = t.snapshotWatermark;
          r && r.text && (e.font = r.font, r.fillColor && (e.fillStyle = r.fillColor, e.fillText(r.text, r.left, r.top)), r.strokeColor && (e.strokeStyle = r.strokeColor, e.strokeText(r.text, r.left, r.top)), e.stroke())
        };
    t.exports = s
  }, {
    "../../lang/index": 210,
    "../../lib/dom": 217,
    "../../lib/util": 232,
    "../../player/base/event/eventtype": 242,
    "../component": 294,
    "./util": 321
  }],
  318: [function (e, t, r) {
    var i = e("../component"), c = (e("../../lib/util"), e("../../lib/dom")), n = e("../../lib/event"),
        o = (e("../../lib/ua"), e("../../lang/index"), e("../../player/base/event/eventtype")), a = i.extend({
          init: function (e, t) {
            i.call(this, e, t), this.addClass("prism-thumbnail")
          }, createEl: function () {
            var e = i.prototype.createEl.call(this, "div");
            return e.innerHTML = "<img></img><span></span>", e
          }, bindEvent: function () {
            var u = this;
            n.on(this._el, "mousemove", function (e) {
              e.preventDefault()
            }), n.on(this._el, "touchmove", function (e) {
              e.preventDefault()
            }), u._player.on(o.Private.ThumbnailLoaded, function (e) {
              var t, r, i, n = e.paramData;
              n && 0 < n.length && (t = u._player._thumbnailService.makeUrl(n[0].text), u._player.log("THUMBNAILSTART", {tu: encodeURIComponent(t)}), r = (new Date).getTime(), n[0].isBig ? (c.css(u.el(), "background", "url(" + t + ")"), c.css(u.el(), "width", n[0].w + "px"), c.css(u.el(), "height", n[0].h + "px"), u._player.log("THUMBNAILCOMPLETE", {ftt: (new Date).getTime() - r})) : ((i = document.querySelector("#" + u.id() + " img")).onload = function () {
                var e = i.width, t = i.height;
                c.css(u.el(), "width", e + "px"), c.css(u.el(), "height", t + "px"), u._player.log("THUMBNAILCOMPLETE", {ftt: (new Date).getTime() - r})
              }, i.src = t))
            }), u._player.on(o.Private.ThumbnailShow, function (l) {
              u._thumbnailShowHanlde && clearTimeout(u._thumbnailShowHanlde), u._thumbnailShowHanlde = setTimeout(function () {
                var e, t, r, i, n, o, a = document.querySelector("#" + u.id() + " span"), s = l.paramData;
                a.innerText = s.formatTime, s && ((e = u._player._thumbnailService.findAvailableCue(s.time)) ? e.isBig ? (i = u._player._thumbnailService.makeUrl(e.text), c.css(u.el(), "background", "url(" + i + ")"), e.w, e.h, t = -1 * e.x + "px " + -1 * e.y + "px", c.css(u.el(), "background-position", t)) : (r = document.querySelector("#" + u.id() + " img"), i = u._player._thumbnailService.makeUrl(e.text), r.src != i && (r.src = i)) : (c.css(u.el(), "border", "none"), c.css(a, "left", "0px")), c.css(u.el(), "display", "block"), o = 0, n = e ? u.el().offsetWidth : a.offsetWidth, o = s.left + n > s.progressWidth ? s.left - n : (o = s.left - n / 2) < 0 ? 0 : o, c.css(u.el(), "left", o + "px"))
              }, 30)
            }), u._player.on(o.Private.ThumbnailHide, function (e) {
              u._thumbnailShowHanlde && clearTimeout(u._thumbnailShowHanlde), c.css(u.el(), "display", "none")
            })
          }, _createSamllThumbnail: function () {
          }, disposeUI: function () {
            this._thumbnailShowHanlde && (clearTimeout(this._thumbnailShowHanlde), this._thumbnailShowHanlde = null)
          }
        });
    t.exports = a
  }, {
    "../../lang/index": 210,
    "../../lib/dom": 217,
    "../../lib/event": 218,
    "../../lib/ua": 230,
    "../../lib/util": 232,
    "../../player/base/event/eventtype": 242,
    "../component": 294
  }],
  319: [function (e, t, r) {
    var i = e("../component"), n = e("../../lib/util"), o = e("../../player/base/event/eventtype"), a = i.extend({
      init: function (e, t) {
        i.call(this, e, t), this.addClass("prism-time-display")
      }, createEl: function () {
        var e = i.prototype.createEl.call(this, "div");
        return e.innerHTML = '<span class="current-time">00:00</span> <span class="time-bound">/</span> <span class="duration">00:00</span>', e
      }, bindEvent: function () {
        var r = this;
        this._player.on(o.Video.DurationChange, function () {
          var e = n.formatTime(r._player.getDisplayDuration());
          e ? (document.querySelector("#" + r.id() + " .time-bound").style.display = "inline", document.querySelector("#" + r.id() + " .duration").style.display = "inline", document.querySelector("#" + r.id() + " .duration").innerText = e) : (document.querySelector("#" + r.id() + " .duration").style.display = "none", document.querySelector("#" + r.id() + " .time-bound").style.display = "none")
        }), this._player.on(o.Video.TimeUpdate, function () {
          var e = r._player.getCurrentTime(), t = n.formatTime(e);
          document.querySelector("#" + r.id() + " .current-time") && (t ? (document.querySelector("#" + r.id() + " .current-time").style.display = "inline", document.querySelector("#" + r.id() + " .current-time").innerText = t) : document.querySelector("#" + r.id() + " .current-time").style.display = "none")
        })
      }
    });
    t.exports = a
  }, {"../../lib/util": 232, "../../player/base/event/eventtype": 242, "../component": 294}],
  320: [function (e, t, r) {
    var i = e("../component"), s = e("../../lib/dom"), n = e("../../player/base/event/eventtype"), o = i.extend({
      init: function (e, t) {
        i.call(this, e, t), this.addClass("prism-tooltip")
      }, createEl: function () {
        var e = i.prototype.createEl.call(this, "p");
        return e.innerText = "\u63d0\u793a\u4fe1\u606f", e
      }, bindEvent: function () {
        var a = this;
        a._player.on(n.Private.TooltipShow, function (e) {
          var t = document.querySelector("#" + a.id()), r = e.paramData;
          t.innerText = r.text, s.css(t, "display", "block");
          var i, n = t.offsetWidth, o = document.querySelector("#" + a._player.id() + " .prism-controlbar");
          o && (i = o.offsetWidth, r.left + n > i ? s.css(t, "left", i - n + "px") : s.css(t, "left", r.left - (n - r.width) / 2 + "px"))
        }), a._player.on(n.Private.TooltipHide, function (e) {
          var t = document.querySelector("#" + a.id());
          s.css(t, "display", "none")
        })
      }
    });
    t.exports = o
  }, {"../../lib/dom": 217, "../../player/base/event/eventtype": 242, "../component": 294}],
  321: [function (e, t, r) {
    var i = e("../../lib/event"), s = e("../../player/base/event/eventtype");
    t.exports.registerTooltipEvent = function (e, n) {
      function o() {
        a._controlbarTooltipHandler && (clearTimeout(a._controlbarTooltipHandler), a._controlbarTooltipHandler = null)
      }

      var a = this;
      i.on(this.el(), "mouseover", function (e) {
        o(), a._controlbarTooltipHandler = setTimeout(function () {
          a._player.trigger(s.Private.TooltipHide)
        }, 4e3);
        var t = a.el().offsetLeft, r = a.el().offsetWidth, i = n;
        "function" == typeof i && (i = n.call(this)), a._player.trigger(s.Private.TooltipShow, {
          left: t,
          width: r,
          text: i
        })
      }), i.on(this.el(), "mouseout", function () {
        o(), a._player.trigger(s.Private.TooltipHide)
      })
    }, t.exports.throttle = function (r, i) {
      var n = Date.now();
      return function () {
        var e = arguments, t = Date.now();
        i <= t - n && (r(e), n = t)
      }
    }
  }, {"../../lib/event": 218, "../../player/base/event/eventtype": 242}],
  322: [function (e, t, r) {
    var i = e("../component"), n = e("../../lib/dom"), o = e("../../lib/event"),
        a = e("../../player/base/event/eventtype"), s = e("./util"), l = e("../../lang/index"),
        u = e("./volumecontrol"), c = i.extend({
          init: function (e, t) {
            i.call(this, e, t), this.addClass("prism-volume");
            var r = new u(e, t);
            e.addChild(r, t)
          }, createEl: function () {
            var e = i.prototype.createEl.call(this, "div");
            return e.innerHTML = '<div class="volume-icon"><div class="short-horizontal"></div><div class="long-horizontal"></div></div>', e
          }, bindEvent: function () {
            var r = this;
            this.icon = document.querySelector("#" + r.id() + "  .volume-icon"), s.registerTooltipEvent.call(this, this.el(), function () {
              return r._player.muted() || 0 == r._player.getVolume() ? l.get("Muted") : l.get("Volume")
            }), o.on(this.icon, "click", function (e) {
              var t = r.el().offsetLeft;
              r._player.trigger(a.Private.SettingListHide), r._player.trigger(a.Private.SelectorHide), r._player.trigger(a.Private.VolumeVisibilityChange, t), r._player.trigger(a.Private.MarkerTextHide)
            });
            var e = document.querySelector("#" + r.id() + "  .long-horizontal"),
                t = document.querySelector("#" + r.id() + "  .short-horizontal");
            o.on(this.el(), "mouseover", function () {
              n.removeClass(e, "volume-hover-animation"), setTimeout(function () {
                n.addClass(e, "volume-hover-animation")
              }), setTimeout(function () {
                n.removeClass(e, "volume-hover-animation"), n.addClass(t, "volume-hover-animation"), setTimeout(function () {
                  n.removeClass(t, "volume-hover-animation"), n.addClass(e, "volume-hover-animation")
                }, 300)
              }, 300)
            })
          }
        });
    t.exports = c
  }, {
    "../../lang/index": 210,
    "../../lib/dom": 217,
    "../../lib/event": 218,
    "../../player/base/event/eventtype": 242,
    "../component": 294,
    "./util": 321,
    "./volumecontrol": 323
  }],
  323: [function (e, t, r) {
    var i = e("../component"), n = e("../../lib/dom"), o = e("../../lib/event"),
        a = e("../../player/base/event/eventtype"), s = (e("./util"), e("../../lang/index"), i.extend({
          init: function (e, t) {
            i.call(this, e, t), this.addClass("prism-volume-control"), this._shown = !1
          }, createEl: function () {
            var e = i.prototype.createEl.call(this, "div");
            return e.innerHTML = '<div class="volume-range"><div class="volume-value"></div><div class="volume-cursor"></div></div>', e
          }, bindEvent: function () {
            var i = this;
            this.icon = document.querySelector("#" + i._player.id() + "  .volume-icon"), this.control = document.querySelector("#" + i.id()), this.volumnValue = document.querySelector("#" + i.id() + "  .volume-value"), this.volumnRange = document.querySelector("#" + i.id() + "  .volume-range"), this.volumnCursor = document.querySelector("#" + i.id() + "  .volume-cursor"), this._player.on(a.Private.VolumeVisibilityChange, function (e) {
              var t, r = e.paramData;
              !i._shown && r ? (t = i._player.getVolume(), i._setVolumnUI(t), n.css(i.control, "display", "block"), r && n.css(i.control, "left", r - 5 + "px"), i._shown = !0) : (n.css(i.control, "display", "none"), i._shown = !1)
            }), o.on(this.volumnRange, "click", function (e) {
              var t = n.getPointerPosition(i.volumnRange, e).y;
              t < 0 || 1 < t || (t < 0 && (t = 0), 1 < t && (t = 1), i._setVolumnUI(t), i._setMuteUI(t), i._player.setVolume(t))
            }), o.on(this._player.tag, "click", function (e) {
              e && e.target == e.currentTarget && n.css(i.control, "display", "none")
            }), o.on(this._player.tag, "touchstart", function (e) {
              e && e.target == e.currentTarget && n.css(i.control, "display", "none")
            }), o.on(this.volumnCursor, "mousedown", function (e) {
              i._onMouseDown(e)
            }), o.on(this.volumnCursor, "touchstart", function (e) {
              i._onMouseDown(e)
            }), this._player.on(a.Private.VolumnChanged, function (e) {
              var t = e.paramData;
              -1 < t && i._setVolumnUI(t), i._setMuteUI(t)
            }), o.on(this.control, "mouseleave", function () {
              n.css(i.control, "display", "none"), i._shown = !1
            }), o.on(this.control, "mouseover", function () {
              n.addClass(i.control, "hover")
            }), i._rangeBottom = i._getBottom()
          }, _getBottom: function () {
            if (window.getComputedStyle) {
              var e = window.getComputedStyle(this.volumnRange, null).getPropertyValue("bottom");
              return parseFloat(e)
            }
            return 26
          }, _onMouseDown: function (e) {
            var t = this;
            e.preventDefault(), o.on(this.control, "mousemove", function (e) {
              t._onMouseMove(e)
            }), o.on(this.control, "touchmove", function (e) {
              t._onMouseMove(e)
            }), o.on(this._player.tag, "mouseup", function (e) {
              t._onMouseUp(e)
            }), o.on(this._player.tag, "touchend", function (e) {
              t._onMouseUp(e)
            }), o.on(this.control, "mouseup", function (e) {
              t._onMouseUp(e)
            }), o.on(this.control, "touchend", function (e) {
              t._onMouseUp(e)
            })
          }, _onMouseUp: function (e) {
            var t;
            e.preventDefault(), this._offEvent(), this.volumnRange.offsetHeight && (t = (this.volumnValue.offsetHeight / this.volumnRange.offsetHeight).toFixed(2), this._player.setVolume(t), this._setMuteUI(t))
          }, _onMouseMove: function (e) {
            e.preventDefault();
            var t = n.getPointerPosition(this.volumnRange, e).y;
            t < 0 || 1 < t || (t < 0 && (t = 0), 1 < t && (t = 1), this._setVolumnUI(t))
          }, _getPosition: function (e) {
            for (var t = this.volumnRange, r = 0; t = t.offsetParent;) r += t.offsetTop;
            var i = this.volumnRange.offsetHeight, n = this.volumnCursor.offsetHeight,
                o = e.touches ? e.touches[0].pageY : e.pageY;
            return i < o - r && (o = e.clientY), (i - (o - r) + n) / (i = this.volumnRange.offsetHeight)
          }, _offEvent: function () {
            o.off(this._player.tag, "mouseup"), o.off(this._player.tag, "touchend"), o.off(this.control, "mousemove"), o.off(this.control, "touchmove"), o.off(this.control, "mouseup"), o.off(this.control, "touchend")
          }, _setMuteUI: function (e) {
            isNaN(e) || (0 == e || -1 == e ? n.addClass(this.icon, "mute") : n.removeClass(this.icon, "mute"))
          }, _setVolumnUI: function (e) {
            isNaN(e) || (n.css(this.volumnValue, "height", 100 * e + "%"), 1 == e && (e = .99), n.css(this.volumnCursor, "bottom", 100 * e + "%"))
          }
        }));
    t.exports = s
  }, {
    "../../lang/index": 210,
    "../../lib/dom": 217,
    "../../lib/event": 218,
    "../../player/base/event/eventtype": 242,
    "../component": 294,
    "./util": 321
  }],
  324: [function (e, t, r) {
    t.exports = {
      H5Loading: e("./component/h5-loading"),
      bigPlayButton: e("./component/big-play-button"),
      controlBar: e("./component/controlbar"),
      progress: e("./component/progress"),
      playButton: e("./component/play-button"),
      liveDisplay: e("./component/live-display"),
      timeDisplay: e("./component/time-display"),
      fullScreenButton: e("./component/fullscreen-button"),
      volume: e("./component/volume"),
      snapshot: e("./component/snapshot"),
      errorDisplay: e("./component/error-display"),
      infoDisplay: e("./component/info-display"),
      liveShiftProgress: e("../commonui/liveshiftprogress"),
      liveShiftTimeDisplay: e("../commonui/livetimedisplay"),
      setting: e("./component/setting/button"),
      subtitle: e("./component/cc-button"),
      thumbnail: e("./component/thumbnail"),
      tooltip: e("./component/tooltip")
    }
  }, {
    "../commonui/liveshiftprogress": 202,
    "../commonui/livetimedisplay": 203,
    "./component/big-play-button": 295,
    "./component/cc-button": 296,
    "./component/controlbar": 297,
    "./component/error-display": 299,
    "./component/fullscreen-button": 300,
    "./component/h5-loading": 301,
    "./component/info-display": 302,
    "./component/live-display": 303,
    "./component/play-button": 305,
    "./component/progress": 306,
    "./component/setting/button": 310,
    "./component/snapshot": 317,
    "./component/thumbnail": 318,
    "./component/time-display": 319,
    "./component/tooltip": 320,
    "./component/volume": 322
  }]
}, {}, [205]);
