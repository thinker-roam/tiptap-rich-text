function pe(n) {
  this.content = n;
}
pe.prototype = {
  constructor: pe,
  find: function(n) {
    for (var e = 0; e < this.content.length; e += 2)
      if (this.content[e] === n)
        return e;
    return -1;
  },
  get: function(n) {
    var e = this.find(n);
    return e == -1 ? void 0 : this.content[e + 1];
  },
  update: function(n, e, t) {
    var r = t && t != n ? this.remove(t) : this, i = r.find(n), s = r.content.slice();
    return i == -1 ? s.push(t || n, e) : (s[i + 1] = e, t && (s[i] = t)), new pe(s);
  },
  remove: function(n) {
    var e = this.find(n);
    if (e == -1)
      return this;
    var t = this.content.slice();
    return t.splice(e, 2), new pe(t);
  },
  addToStart: function(n, e) {
    return new pe([n, e].concat(this.remove(n).content));
  },
  addToEnd: function(n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new pe(t);
  },
  addBefore: function(n, e, t) {
    var r = this.remove(e), i = r.content.slice(), s = r.find(n);
    return i.splice(s == -1 ? i.length : s, 0, e, t), new pe(i);
  },
  forEach: function(n) {
    for (var e = 0; e < this.content.length; e += 2)
      n(this.content[e], this.content[e + 1]);
  },
  prepend: function(n) {
    return n = pe.from(n), n.size ? new pe(n.content.concat(this.subtract(n).content)) : this;
  },
  append: function(n) {
    return n = pe.from(n), n.size ? new pe(this.subtract(n).content.concat(n.content)) : this;
  },
  subtract: function(n) {
    var e = this;
    n = pe.from(n);
    for (var t = 0; t < n.content.length; t += 2)
      e = e.remove(n.content[t]);
    return e;
  },
  get size() {
    return this.content.length >> 1;
  }
};
pe.from = function(n) {
  if (n instanceof pe)
    return n;
  var e = [];
  if (n)
    for (var t in n)
      e.push(t, n[t]);
  return new pe(e);
};
function kl(n, e, t) {
  for (let r = 0; ; r++) {
    if (r == n.childCount || r == e.childCount)
      return n.childCount == e.childCount ? null : t;
    let i = n.child(r), s = e.child(r);
    if (i == s) {
      t += i.nodeSize;
      continue;
    }
    if (!i.sameMarkup(s))
      return t;
    if (i.isText && i.text != s.text) {
      for (let o = 0; i.text[o] == s.text[o]; o++)
        t++;
      return t;
    }
    if (i.content.size || s.content.size) {
      let o = kl(i.content, s.content, t + 1);
      if (o != null)
        return o;
    }
    t += i.nodeSize;
  }
}
function Cl(n, e, t, r) {
  for (let i = n.childCount, s = e.childCount; ; ) {
    if (i == 0 || s == 0)
      return i == s ? null : { a: t, b: r };
    let o = n.child(--i), l = e.child(--s), a = o.nodeSize;
    if (o == l) {
      t -= a, r -= a;
      continue;
    }
    if (!o.sameMarkup(l))
      return { a: t, b: r };
    if (o.isText && o.text != l.text) {
      let c = 0, u = Math.min(o.text.length, l.text.length);
      for (; c < u && o.text[o.text.length - c - 1] == l.text[l.text.length - c - 1]; )
        c++, t--, r--;
      return { a: t, b: r };
    }
    if (o.content.size || l.content.size) {
      let c = Cl(o.content, l.content, t - 1, r - 1);
      if (c)
        return c;
    }
    t -= a, r -= a;
  }
}
class k {
  constructor(e, t) {
    if (this.content = e, this.size = t || 0, t == null)
      for (let r = 0; r < e.length; r++)
        this.size += e[r].nodeSize;
  }
  nodesBetween(e, t, r, i = 0, s) {
    for (let o = 0, l = 0; l < t; o++) {
      let a = this.content[o], c = l + a.nodeSize;
      if (c > e && r(a, i + l, s || null, o) !== !1 && a.content.size) {
        let u = l + 1;
        a.nodesBetween(Math.max(0, e - u), Math.min(a.content.size, t - u), r, i + u);
      }
      l = c;
    }
  }
  descendants(e) {
    this.nodesBetween(0, this.size, e);
  }
  textBetween(e, t, r, i) {
    let s = "", o = !0;
    return this.nodesBetween(e, t, (l, a) => {
      l.isText ? (s += l.text.slice(Math.max(e, a) - a, t - a), o = !r) : l.isLeaf ? (i ? s += typeof i == "function" ? i(l) : i : l.type.spec.leafText && (s += l.type.spec.leafText(l)), o = !r) : !o && l.isBlock && (s += r, o = !0);
    }, 0), s;
  }
  append(e) {
    if (!e.size)
      return this;
    if (!this.size)
      return e;
    let t = this.lastChild, r = e.firstChild, i = this.content.slice(), s = 0;
    for (t.isText && t.sameMarkup(r) && (i[i.length - 1] = t.withText(t.text + r.text), s = 1); s < e.content.length; s++)
      i.push(e.content[s]);
    return new k(i, this.size + e.size);
  }
  cut(e, t = this.size) {
    if (e == 0 && t == this.size)
      return this;
    let r = [], i = 0;
    if (t > e)
      for (let s = 0, o = 0; o < t; s++) {
        let l = this.content[s], a = o + l.nodeSize;
        a > e && ((o < e || a > t) && (l.isText ? l = l.cut(Math.max(0, e - o), Math.min(l.text.length, t - o)) : l = l.cut(Math.max(0, e - o - 1), Math.min(l.content.size, t - o - 1))), r.push(l), i += l.nodeSize), o = a;
      }
    return new k(r, i);
  }
  cutByIndex(e, t) {
    return e == t ? k.empty : e == 0 && t == this.content.length ? this : new k(this.content.slice(e, t));
  }
  replaceChild(e, t) {
    let r = this.content[e];
    if (r == t)
      return this;
    let i = this.content.slice(), s = this.size + t.nodeSize - r.nodeSize;
    return i[e] = t, new k(i, s);
  }
  addToStart(e) {
    return new k([e].concat(this.content), this.size + e.nodeSize);
  }
  addToEnd(e) {
    return new k(this.content.concat(e), this.size + e.nodeSize);
  }
  eq(e) {
    if (this.content.length != e.content.length)
      return !1;
    for (let t = 0; t < this.content.length; t++)
      if (!this.content[t].eq(e.content[t]))
        return !1;
    return !0;
  }
  get firstChild() {
    return this.content.length ? this.content[0] : null;
  }
  get lastChild() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  }
  get childCount() {
    return this.content.length;
  }
  child(e) {
    let t = this.content[e];
    if (!t)
      throw new RangeError("Index " + e + " out of range for " + this);
    return t;
  }
  maybeChild(e) {
    return this.content[e] || null;
  }
  forEach(e) {
    for (let t = 0, r = 0; t < this.content.length; t++) {
      let i = this.content[t];
      e(i, r, t), r += i.nodeSize;
    }
  }
  findDiffStart(e, t = 0) {
    return kl(this, e, t);
  }
  findDiffEnd(e, t = this.size, r = e.size) {
    return Cl(this, e, t, r);
  }
  findIndex(e, t = -1) {
    if (e == 0)
      return nr(0, e);
    if (e == this.size)
      return nr(this.content.length, e);
    if (e > this.size || e < 0)
      throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let r = 0, i = 0; ; r++) {
      let s = this.child(r), o = i + s.nodeSize;
      if (o >= e)
        return o == e || t > 0 ? nr(r + 1, o) : nr(r, i);
      i = o;
    }
  }
  toString() {
    return "<" + this.toStringInner() + ">";
  }
  toStringInner() {
    return this.content.join(", ");
  }
  toJSON() {
    return this.content.length ? this.content.map((e) => e.toJSON()) : null;
  }
  static fromJSON(e, t) {
    if (!t)
      return k.empty;
    if (!Array.isArray(t))
      throw new RangeError("Invalid input for Fragment.fromJSON");
    return new k(t.map(e.nodeFromJSON));
  }
  static fromArray(e) {
    if (!e.length)
      return k.empty;
    let t, r = 0;
    for (let i = 0; i < e.length; i++) {
      let s = e[i];
      r += s.nodeSize, i && s.isText && e[i - 1].sameMarkup(s) ? (t || (t = e.slice(0, i)), t[t.length - 1] = s.withText(t[t.length - 1].text + s.text)) : t && t.push(s);
    }
    return new k(t || e, r);
  }
  static from(e) {
    if (!e)
      return k.empty;
    if (e instanceof k)
      return e;
    if (Array.isArray(e))
      return this.fromArray(e);
    if (e.attrs)
      return new k([e], e.nodeSize);
    throw new RangeError("Can not convert " + e + " to a Fragment" + (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""));
  }
}
k.empty = new k([], 0);
const bi = { index: 0, offset: 0 };
function nr(n, e) {
  return bi.index = n, bi.offset = e, bi;
}
function fr(n, e) {
  if (n === e)
    return !0;
  if (!(n && typeof n == "object") || !(e && typeof e == "object"))
    return !1;
  let t = Array.isArray(n);
  if (Array.isArray(e) != t)
    return !1;
  if (t) {
    if (n.length != e.length)
      return !1;
    for (let r = 0; r < n.length; r++)
      if (!fr(n[r], e[r]))
        return !1;
  } else {
    for (let r in n)
      if (!(r in e) || !fr(n[r], e[r]))
        return !1;
    for (let r in e)
      if (!(r in n))
        return !1;
  }
  return !0;
}
class J {
  constructor(e, t) {
    this.type = e, this.attrs = t;
  }
  addToSet(e) {
    let t, r = !1;
    for (let i = 0; i < e.length; i++) {
      let s = e[i];
      if (this.eq(s))
        return e;
      if (this.type.excludes(s.type))
        t || (t = e.slice(0, i));
      else {
        if (s.type.excludes(this.type))
          return e;
        !r && s.type.rank > this.type.rank && (t || (t = e.slice(0, i)), t.push(this), r = !0), t && t.push(s);
      }
    }
    return t || (t = e.slice()), r || t.push(this), t;
  }
  removeFromSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return e.slice(0, t).concat(e.slice(t + 1));
    return e;
  }
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t]))
        return !0;
    return !1;
  }
  eq(e) {
    return this == e || this.type == e.type && fr(this.attrs, e.attrs);
  }
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return e;
  }
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Mark.fromJSON");
    let r = e.marks[t.type];
    if (!r)
      throw new RangeError(`There is no mark type ${t.type} in this schema`);
    return r.create(t.attrs);
  }
  static sameSet(e, t) {
    if (e == t)
      return !0;
    if (e.length != t.length)
      return !1;
    for (let r = 0; r < e.length; r++)
      if (!e[r].eq(t[r]))
        return !1;
    return !0;
  }
  static setFrom(e) {
    if (!e || Array.isArray(e) && e.length == 0)
      return J.none;
    if (e instanceof J)
      return [e];
    let t = e.slice();
    return t.sort((r, i) => r.type.rank - i.type.rank), t;
  }
}
J.none = [];
class Hn extends Error {
}
class O {
  constructor(e, t, r) {
    this.content = e, this.openStart = t, this.openEnd = r;
  }
  get size() {
    return this.content.size - this.openStart - this.openEnd;
  }
  insertAt(e, t) {
    let r = Al(this.content, e + this.openStart, t);
    return r && new O(r, this.openStart, this.openEnd);
  }
  removeBetween(e, t) {
    return new O(Sl(this.content, e + this.openStart, t + this.openStart), this.openStart, this.openEnd);
  }
  eq(e) {
    return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
  }
  toString() {
    return this.content + "(" + this.openStart + "," + this.openEnd + ")";
  }
  toJSON() {
    if (!this.content.size)
      return null;
    let e = { content: this.content.toJSON() };
    return this.openStart > 0 && (e.openStart = this.openStart), this.openEnd > 0 && (e.openEnd = this.openEnd), e;
  }
  static fromJSON(e, t) {
    if (!t)
      return O.empty;
    let r = t.openStart || 0, i = t.openEnd || 0;
    if (typeof r != "number" || typeof i != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new O(k.fromJSON(e, t.content), r, i);
  }
  static maxOpen(e, t = !0) {
    let r = 0, i = 0;
    for (let s = e.firstChild; s && !s.isLeaf && (t || !s.type.spec.isolating); s = s.firstChild)
      r++;
    for (let s = e.lastChild; s && !s.isLeaf && (t || !s.type.spec.isolating); s = s.lastChild)
      i++;
    return new O(e, r, i);
  }
}
O.empty = new O(k.empty, 0, 0);
function Sl(n, e, t) {
  let { index: r, offset: i } = n.findIndex(e), s = n.maybeChild(r), { index: o, offset: l } = n.findIndex(t);
  if (i == e || s.isText) {
    if (l != t && !n.child(o).isText)
      throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (r != o)
    throw new RangeError("Removing non-flat range");
  return n.replaceChild(r, s.copy(Sl(s.content, e - i - 1, t - i - 1)));
}
function Al(n, e, t, r) {
  let { index: i, offset: s } = n.findIndex(e), o = n.maybeChild(i);
  if (s == e || o.isText)
    return r && !r.canReplace(i, i, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let l = Al(o.content, e - s - 1, t);
  return l && n.replaceChild(i, o.copy(l));
}
function Nu(n, e, t) {
  if (t.openStart > n.depth)
    throw new Hn("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd)
    throw new Hn("Inconsistent open depths");
  return wl(n, e, t, 0);
}
function wl(n, e, t, r) {
  let i = n.index(r), s = n.node(r);
  if (i == e.index(r) && r < n.depth - t.openStart) {
    let o = wl(n, e, t, r + 1);
    return s.copy(s.content.replaceChild(i, o));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == r && e.depth == r) {
      let o = n.parent, l = o.content;
      return Lt(o, l.cut(0, n.parentOffset).append(t.content).append(l.cut(e.parentOffset)));
    } else {
      let { start: o, end: l } = Fu(t, n);
      return Lt(s, Tl(n, o, l, e, r));
    }
  else
    return Lt(s, pr(n, e, r));
}
function Ml(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new Hn("Cannot join " + e.type.name + " onto " + n.type.name);
}
function Ui(n, e, t) {
  let r = n.node(t);
  return Ml(r, e.node(t)), r;
}
function Pt(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? e[t] = n.withText(e[t].text + n.text) : e.push(n);
}
function Fn(n, e, t, r) {
  let i = (e || n).node(t), s = 0, o = e ? e.index(t) : i.childCount;
  n && (s = n.index(t), n.depth > t ? s++ : n.textOffset && (Pt(n.nodeAfter, r), s++));
  for (let l = s; l < o; l++)
    Pt(i.child(l), r);
  e && e.depth == t && e.textOffset && Pt(e.nodeBefore, r);
}
function Lt(n, e) {
  if (!n.type.validContent(e))
    throw new Hn("Invalid content for node " + n.type.name);
  return n.copy(e);
}
function Tl(n, e, t, r, i) {
  let s = n.depth > i && Ui(n, e, i + 1), o = r.depth > i && Ui(t, r, i + 1), l = [];
  return Fn(null, n, i, l), s && o && e.index(i) == t.index(i) ? (Ml(s, o), Pt(Lt(s, Tl(n, e, t, r, i + 1)), l)) : (s && Pt(Lt(s, pr(n, e, i + 1)), l), Fn(e, t, i, l), o && Pt(Lt(o, pr(t, r, i + 1)), l)), Fn(r, null, i, l), new k(l);
}
function pr(n, e, t) {
  let r = [];
  if (Fn(null, n, t, r), n.depth > t) {
    let i = Ui(n, e, t + 1);
    Pt(Lt(i, pr(n, e, t + 1)), r);
  }
  return Fn(e, null, t, r), new k(r);
}
function Fu(n, e) {
  let t = e.depth - n.openStart, i = e.node(t).copy(n.content);
  for (let s = t - 1; s >= 0; s--)
    i = e.node(s).copy(k.from(i));
  return {
    start: i.resolveNoCache(n.openStart + t),
    end: i.resolveNoCache(i.content.size - n.openEnd - t)
  };
}
class $n {
  constructor(e, t, r) {
    this.pos = e, this.path = t, this.parentOffset = r, this.depth = t.length / 3 - 1;
  }
  resolveDepth(e) {
    return e == null ? this.depth : e < 0 ? this.depth + e : e;
  }
  get parent() {
    return this.node(this.depth);
  }
  get doc() {
    return this.node(0);
  }
  node(e) {
    return this.path[this.resolveDepth(e) * 3];
  }
  index(e) {
    return this.path[this.resolveDepth(e) * 3 + 1];
  }
  indexAfter(e) {
    return e = this.resolveDepth(e), this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1);
  }
  start(e) {
    return e = this.resolveDepth(e), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
  }
  end(e) {
    return e = this.resolveDepth(e), this.start(e) + this.node(e).content.size;
  }
  before(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position before the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
  }
  after(e) {
    if (e = this.resolveDepth(e), !e)
      throw new RangeError("There is no position after the top-level node");
    return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
  }
  get textOffset() {
    return this.pos - this.path[this.path.length - 1];
  }
  get nodeAfter() {
    let e = this.parent, t = this.index(this.depth);
    if (t == e.childCount)
      return null;
    let r = this.pos - this.path[this.path.length - 1], i = e.child(t);
    return r ? e.child(t).cut(r) : i;
  }
  get nodeBefore() {
    let e = this.index(this.depth), t = this.pos - this.path[this.path.length - 1];
    return t ? this.parent.child(e).cut(0, t) : e == 0 ? null : this.parent.child(e - 1);
  }
  posAtIndex(e, t) {
    t = this.resolveDepth(t);
    let r = this.path[t * 3], i = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
    for (let s = 0; s < e; s++)
      i += r.child(s).nodeSize;
    return i;
  }
  marks() {
    let e = this.parent, t = this.index();
    if (e.content.size == 0)
      return J.none;
    if (this.textOffset)
      return e.child(t).marks;
    let r = e.maybeChild(t - 1), i = e.maybeChild(t);
    if (!r) {
      let l = r;
      r = i, i = l;
    }
    let s = r.marks;
    for (var o = 0; o < s.length; o++)
      s[o].type.spec.inclusive === !1 && (!i || !s[o].isInSet(i.marks)) && (s = s[o--].removeFromSet(s));
    return s;
  }
  marksAcross(e) {
    let t = this.parent.maybeChild(this.index());
    if (!t || !t.isInline)
      return null;
    let r = t.marks, i = e.parent.maybeChild(e.index());
    for (var s = 0; s < r.length; s++)
      r[s].type.spec.inclusive === !1 && (!i || !r[s].isInSet(i.marks)) && (r = r[s--].removeFromSet(r));
    return r;
  }
  sharedDepth(e) {
    for (let t = this.depth; t > 0; t--)
      if (this.start(t) <= e && this.end(t) >= e)
        return t;
    return 0;
  }
  blockRange(e = this, t) {
    if (e.pos < this.pos)
      return e.blockRange(this);
    for (let r = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0); r >= 0; r--)
      if (e.pos <= this.end(r) && (!t || t(this.node(r))))
        return new gr(this, e, r);
    return null;
  }
  sameParent(e) {
    return this.pos - this.parentOffset == e.pos - e.parentOffset;
  }
  max(e) {
    return e.pos > this.pos ? e : this;
  }
  min(e) {
    return e.pos < this.pos ? e : this;
  }
  toString() {
    let e = "";
    for (let t = 1; t <= this.depth; t++)
      e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
    return e + ":" + this.parentOffset;
  }
  static resolve(e, t) {
    if (!(t >= 0 && t <= e.content.size))
      throw new RangeError("Position " + t + " out of range");
    let r = [], i = 0, s = t;
    for (let o = e; ; ) {
      let { index: l, offset: a } = o.content.findIndex(s), c = s - a;
      if (r.push(o, l, i + a), !c || (o = o.child(l), o.isText))
        break;
      s = c - 1, i += a + 1;
    }
    return new $n(t, r, s);
  }
  static resolveCached(e, t) {
    for (let i = 0; i < Di.length; i++) {
      let s = Di[i];
      if (s.pos == t && s.doc == e)
        return s;
    }
    let r = Di[Ei] = $n.resolve(e, t);
    return Ei = (Ei + 1) % Ru, r;
  }
}
let Di = [], Ei = 0, Ru = 12;
class gr {
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.depth = r;
  }
  get start() {
    return this.$from.before(this.depth + 1);
  }
  get end() {
    return this.$to.after(this.depth + 1);
  }
  get parent() {
    return this.$from.node(this.depth);
  }
  get startIndex() {
    return this.$from.index(this.depth);
  }
  get endIndex() {
    return this.$to.indexAfter(this.depth);
  }
}
const Bu = /* @__PURE__ */ Object.create(null);
class Xe {
  constructor(e, t, r, i = J.none) {
    this.type = e, this.attrs = t, this.marks = i, this.content = r || k.empty;
  }
  get nodeSize() {
    return this.isLeaf ? 1 : 2 + this.content.size;
  }
  get childCount() {
    return this.content.childCount;
  }
  child(e) {
    return this.content.child(e);
  }
  maybeChild(e) {
    return this.content.maybeChild(e);
  }
  forEach(e) {
    this.content.forEach(e);
  }
  nodesBetween(e, t, r, i = 0) {
    this.content.nodesBetween(e, t, r, i, this);
  }
  descendants(e) {
    this.nodesBetween(0, this.content.size, e);
  }
  get textContent() {
    return this.isLeaf && this.type.spec.leafText ? this.type.spec.leafText(this) : this.textBetween(0, this.content.size, "");
  }
  textBetween(e, t, r, i) {
    return this.content.textBetween(e, t, r, i);
  }
  get firstChild() {
    return this.content.firstChild;
  }
  get lastChild() {
    return this.content.lastChild;
  }
  eq(e) {
    return this == e || this.sameMarkup(e) && this.content.eq(e.content);
  }
  sameMarkup(e) {
    return this.hasMarkup(e.type, e.attrs, e.marks);
  }
  hasMarkup(e, t, r) {
    return this.type == e && fr(this.attrs, t || e.defaultAttrs || Bu) && J.sameSet(this.marks, r || J.none);
  }
  copy(e = null) {
    return e == this.content ? this : new Xe(this.type, this.attrs, e, this.marks);
  }
  mark(e) {
    return e == this.marks ? this : new Xe(this.type, this.attrs, this.content, e);
  }
  cut(e, t = this.content.size) {
    return e == 0 && t == this.content.size ? this : this.copy(this.content.cut(e, t));
  }
  slice(e, t = this.content.size, r = !1) {
    if (e == t)
      return O.empty;
    let i = this.resolve(e), s = this.resolve(t), o = r ? 0 : i.sharedDepth(t), l = i.start(o), c = i.node(o).content.cut(i.pos - l, s.pos - l);
    return new O(c, i.depth - o, s.depth - o);
  }
  replace(e, t, r) {
    return Nu(this.resolve(e), this.resolve(t), r);
  }
  nodeAt(e) {
    for (let t = this; ; ) {
      let { index: r, offset: i } = t.content.findIndex(e);
      if (t = t.maybeChild(r), !t)
        return null;
      if (i == e || t.isText)
        return t;
      e -= i + 1;
    }
  }
  childAfter(e) {
    let { index: t, offset: r } = this.content.findIndex(e);
    return { node: this.content.maybeChild(t), index: t, offset: r };
  }
  childBefore(e) {
    if (e == 0)
      return { node: null, index: 0, offset: 0 };
    let { index: t, offset: r } = this.content.findIndex(e);
    if (r < e)
      return { node: this.content.child(t), index: t, offset: r };
    let i = this.content.child(t - 1);
    return { node: i, index: t - 1, offset: r - i.nodeSize };
  }
  resolve(e) {
    return $n.resolveCached(this, e);
  }
  resolveNoCache(e) {
    return $n.resolve(this, e);
  }
  rangeHasMark(e, t, r) {
    let i = !1;
    return t > e && this.nodesBetween(e, t, (s) => (r.isInSet(s.marks) && (i = !0), !i)), i;
  }
  get isBlock() {
    return this.type.isBlock;
  }
  get isTextblock() {
    return this.type.isTextblock;
  }
  get inlineContent() {
    return this.type.inlineContent;
  }
  get isInline() {
    return this.type.isInline;
  }
  get isText() {
    return this.type.isText;
  }
  get isLeaf() {
    return this.type.isLeaf;
  }
  get isAtom() {
    return this.type.isAtom;
  }
  toString() {
    if (this.type.spec.toDebugString)
      return this.type.spec.toDebugString(this);
    let e = this.type.name;
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), Ol(this.marks, e);
  }
  contentMatchAt(e) {
    let t = this.type.contentMatch.matchFragment(this.content, 0, e);
    if (!t)
      throw new Error("Called contentMatchAt on a node with invalid content");
    return t;
  }
  canReplace(e, t, r = k.empty, i = 0, s = r.childCount) {
    let o = this.contentMatchAt(e).matchFragment(r, i, s), l = o && o.matchFragment(this.content, t);
    if (!l || !l.validEnd)
      return !1;
    for (let a = i; a < s; a++)
      if (!this.type.allowsMarks(r.child(a).marks))
        return !1;
    return !0;
  }
  canReplaceWith(e, t, r, i) {
    if (i && !this.type.allowsMarks(i))
      return !1;
    let s = this.contentMatchAt(e).matchType(r), o = s && s.matchFragment(this.content, t);
    return o ? o.validEnd : !1;
  }
  canAppend(e) {
    return e.content.size ? this.canReplace(this.childCount, this.childCount, e.content) : this.type.compatibleContent(e.type);
  }
  check() {
    if (!this.type.validContent(this.content))
      throw new RangeError(`Invalid content for node ${this.type.name}: ${this.content.toString().slice(0, 50)}`);
    let e = J.none;
    for (let t = 0; t < this.marks.length; t++)
      e = this.marks[t].addToSet(e);
    if (!J.sameSet(e, this.marks))
      throw new RangeError(`Invalid collection of marks for node ${this.type.name}: ${this.marks.map((t) => t.type.name)}`);
    this.content.forEach((t) => t.check());
  }
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return this.content.size && (e.content = this.content.toJSON()), this.marks.length && (e.marks = this.marks.map((t) => t.toJSON())), e;
  }
  static fromJSON(e, t) {
    if (!t)
      throw new RangeError("Invalid input for Node.fromJSON");
    let r = null;
    if (t.marks) {
      if (!Array.isArray(t.marks))
        throw new RangeError("Invalid mark data for Node.fromJSON");
      r = t.marks.map(e.markFromJSON);
    }
    if (t.type == "text") {
      if (typeof t.text != "string")
        throw new RangeError("Invalid text node in JSON");
      return e.text(t.text, r);
    }
    let i = k.fromJSON(e, t.content);
    return e.nodeType(t.type).create(t.attrs, i, r);
  }
}
Xe.prototype.text = void 0;
class mr extends Xe {
  constructor(e, t, r, i) {
    if (super(e, t, null, i), !r)
      throw new RangeError("Empty text nodes are not allowed");
    this.text = r;
  }
  toString() {
    return this.type.spec.toDebugString ? this.type.spec.toDebugString(this) : Ol(this.marks, JSON.stringify(this.text));
  }
  get textContent() {
    return this.text;
  }
  textBetween(e, t) {
    return this.text.slice(e, t);
  }
  get nodeSize() {
    return this.text.length;
  }
  mark(e) {
    return e == this.marks ? this : new mr(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new mr(this.type, this.attrs, e, this.marks);
  }
  cut(e = 0, t = this.text.length) {
    return e == 0 && t == this.text.length ? this : this.withText(this.text.slice(e, t));
  }
  eq(e) {
    return this.sameMarkup(e) && this.text == e.text;
  }
  toJSON() {
    let e = super.toJSON();
    return e.text = this.text, e;
  }
}
function Ol(n, e) {
  for (let t = n.length - 1; t >= 0; t--)
    e = n[t].type.name + "(" + e + ")";
  return e;
}
class jt {
  constructor(e) {
    this.validEnd = e, this.next = [], this.wrapCache = [];
  }
  static parse(e, t) {
    let r = new Iu(e, t);
    if (r.next == null)
      return jt.empty;
    let i = vl(r);
    r.next && r.err("Unexpected trailing text");
    let s = ju($u(i));
    return Vu(s, r), s;
  }
  matchType(e) {
    for (let t = 0; t < this.next.length; t++)
      if (this.next[t].type == e)
        return this.next[t].next;
    return null;
  }
  matchFragment(e, t = 0, r = e.childCount) {
    let i = this;
    for (let s = t; i && s < r; s++)
      i = i.matchType(e.child(s).type);
    return i;
  }
  get inlineContent() {
    return this.next.length && this.next[0].type.isInline;
  }
  get defaultType() {
    for (let e = 0; e < this.next.length; e++) {
      let { type: t } = this.next[e];
      if (!(t.isText || t.hasRequiredAttrs()))
        return t;
    }
    return null;
  }
  compatible(e) {
    for (let t = 0; t < this.next.length; t++)
      for (let r = 0; r < e.next.length; r++)
        if (this.next[t].type == e.next[r].type)
          return !0;
    return !1;
  }
  fillBefore(e, t = !1, r = 0) {
    let i = [this];
    function s(o, l) {
      let a = o.matchFragment(e, r);
      if (a && (!t || a.validEnd))
        return k.from(l.map((c) => c.createAndFill()));
      for (let c = 0; c < o.next.length; c++) {
        let { type: u, next: d } = o.next[c];
        if (!(u.isText || u.hasRequiredAttrs()) && i.indexOf(d) == -1) {
          i.push(d);
          let h = s(d, l.concat(u));
          if (h)
            return h;
        }
      }
      return null;
    }
    return s(this, []);
  }
  findWrapping(e) {
    for (let r = 0; r < this.wrapCache.length; r += 2)
      if (this.wrapCache[r] == e)
        return this.wrapCache[r + 1];
    let t = this.computeWrapping(e);
    return this.wrapCache.push(e, t), t;
  }
  computeWrapping(e) {
    let t = /* @__PURE__ */ Object.create(null), r = [{ match: this, type: null, via: null }];
    for (; r.length; ) {
      let i = r.shift(), s = i.match;
      if (s.matchType(e)) {
        let o = [];
        for (let l = i; l.type; l = l.via)
          o.push(l.type);
        return o.reverse();
      }
      for (let o = 0; o < s.next.length; o++) {
        let { type: l, next: a } = s.next[o];
        !l.isLeaf && !l.hasRequiredAttrs() && !(l.name in t) && (!i.type || a.validEnd) && (r.push({ match: l.contentMatch, type: l, via: i }), t[l.name] = !0);
      }
    }
    return null;
  }
  get edgeCount() {
    return this.next.length;
  }
  edge(e) {
    if (e >= this.next.length)
      throw new RangeError(`There's no ${e}th edge in this content match`);
    return this.next[e];
  }
  toString() {
    let e = [];
    function t(r) {
      e.push(r);
      for (let i = 0; i < r.next.length; i++)
        e.indexOf(r.next[i].next) == -1 && t(r.next[i].next);
    }
    return t(this), e.map((r, i) => {
      let s = i + (r.validEnd ? "*" : " ") + " ";
      for (let o = 0; o < r.next.length; o++)
        s += (o ? ", " : "") + r.next[o].type.name + "->" + e.indexOf(r.next[o].next);
      return s;
    }).join(`
`);
  }
}
jt.empty = new jt(!0);
class Iu {
  constructor(e, t) {
    this.string = e, this.nodeTypes = t, this.inline = null, this.pos = 0, this.tokens = e.split(/\s*(?=\b|\W|$)/), this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(), this.tokens[0] == "" && this.tokens.shift();
  }
  get next() {
    return this.tokens[this.pos];
  }
  eat(e) {
    return this.next == e && (this.pos++ || !0);
  }
  err(e) {
    throw new SyntaxError(e + " (in content expression '" + this.string + "')");
  }
}
function vl(n) {
  let e = [];
  do
    e.push(Pu(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function Pu(n) {
  let e = [];
  do
    e.push(Lu(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function Lu(n) {
  let e = Hu(n);
  for (; ; )
    if (n.eat("+"))
      e = { type: "plus", expr: e };
    else if (n.eat("*"))
      e = { type: "star", expr: e };
    else if (n.eat("?"))
      e = { type: "opt", expr: e };
    else if (n.eat("{"))
      e = _u(n, e);
    else
      break;
  return e;
}
function Xs(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function _u(n, e) {
  let t = Xs(n), r = t;
  return n.eat(",") && (n.next != "}" ? r = Xs(n) : r = -1), n.eat("}") || n.err("Unclosed braced range"), { type: "range", min: t, max: r, expr: e };
}
function zu(n, e) {
  let t = n.nodeTypes, r = t[e];
  if (r)
    return [r];
  let i = [];
  for (let s in t) {
    let o = t[s];
    o.groups.indexOf(e) > -1 && i.push(o);
  }
  return i.length == 0 && n.err("No node type or group '" + e + "' found"), i;
}
function Hu(n) {
  if (n.eat("(")) {
    let e = vl(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next))
    n.err("Unexpected token '" + n.next + "'");
  else {
    let e = zu(n, n.next).map((t) => (n.inline == null ? n.inline = t.isInline : n.inline != t.isInline && n.err("Mixing inline and block content"), { type: "name", value: t }));
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function $u(n) {
  let e = [[]];
  return i(s(n, 0), t()), e;
  function t() {
    return e.push([]) - 1;
  }
  function r(o, l, a) {
    let c = { term: a, to: l };
    return e[o].push(c), c;
  }
  function i(o, l) {
    o.forEach((a) => a.to = l);
  }
  function s(o, l) {
    if (o.type == "choice")
      return o.exprs.reduce((a, c) => a.concat(s(c, l)), []);
    if (o.type == "seq")
      for (let a = 0; ; a++) {
        let c = s(o.exprs[a], l);
        if (a == o.exprs.length - 1)
          return c;
        i(c, l = t());
      }
    else if (o.type == "star") {
      let a = t();
      return r(l, a), i(s(o.expr, a), a), [r(a)];
    } else if (o.type == "plus") {
      let a = t();
      return i(s(o.expr, l), a), i(s(o.expr, a), a), [r(a)];
    } else {
      if (o.type == "opt")
        return [r(l)].concat(s(o.expr, l));
      if (o.type == "range") {
        let a = l;
        for (let c = 0; c < o.min; c++) {
          let u = t();
          i(s(o.expr, a), u), a = u;
        }
        if (o.max == -1)
          i(s(o.expr, a), a);
        else
          for (let c = o.min; c < o.max; c++) {
            let u = t();
            r(a, u), i(s(o.expr, a), u), a = u;
          }
        return [r(a)];
      } else {
        if (o.type == "name")
          return [r(l, void 0, o.value)];
        throw new Error("Unknown expr type");
      }
    }
  }
}
function Nl(n, e) {
  return e - n;
}
function Qs(n, e) {
  let t = [];
  return r(e), t.sort(Nl);
  function r(i) {
    let s = n[i];
    if (s.length == 1 && !s[0].term)
      return r(s[0].to);
    t.push(i);
    for (let o = 0; o < s.length; o++) {
      let { term: l, to: a } = s[o];
      !l && t.indexOf(a) == -1 && r(a);
    }
  }
}
function ju(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return t(Qs(n, 0));
  function t(r) {
    let i = [];
    r.forEach((o) => {
      n[o].forEach(({ term: l, to: a }) => {
        if (!l)
          return;
        let c;
        for (let u = 0; u < i.length; u++)
          i[u][0] == l && (c = i[u][1]);
        Qs(n, a).forEach((u) => {
          c || i.push([l, c = []]), c.indexOf(u) == -1 && c.push(u);
        });
      });
    });
    let s = e[r.join(",")] = new jt(r.indexOf(n.length - 1) > -1);
    for (let o = 0; o < i.length; o++) {
      let l = i[o][1].sort(Nl);
      s.next.push({ type: i[o][0], next: e[l.join(",")] || t(l) });
    }
    return s;
  }
}
function Vu(n, e) {
  for (let t = 0, r = [n]; t < r.length; t++) {
    let i = r[t], s = !i.validEnd, o = [];
    for (let l = 0; l < i.next.length; l++) {
      let { type: a, next: c } = i.next[l];
      o.push(a.name), s && !(a.isText || a.hasRequiredAttrs()) && (s = !1), r.indexOf(c) == -1 && r.push(c);
    }
    s && e.err("Only non-generatable nodes (" + o.join(", ") + ") in a required position (see https://prosemirror.net/docs/guide/#generatable)");
  }
}
function Fl(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let r = n[t];
    if (!r.hasDefault)
      return null;
    e[t] = r.default;
  }
  return e;
}
function Rl(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r in n) {
    let i = e && e[r];
    if (i === void 0) {
      let s = n[r];
      if (s.hasDefault)
        i = s.default;
      else
        throw new RangeError("No value supplied for attribute " + r);
    }
    t[r] = i;
  }
  return t;
}
function Bl(n) {
  let e = /* @__PURE__ */ Object.create(null);
  if (n)
    for (let t in n)
      e[t] = new Uu(n[t]);
  return e;
}
class yr {
  constructor(e, t, r) {
    this.name = e, this.schema = t, this.spec = r, this.markSet = null, this.groups = r.group ? r.group.split(" ") : [], this.attrs = Bl(r.attrs), this.defaultAttrs = Fl(this.attrs), this.contentMatch = null, this.inlineContent = null, this.isBlock = !(r.inline || e == "text"), this.isText = e == "text";
  }
  get isInline() {
    return !this.isBlock;
  }
  get isTextblock() {
    return this.isBlock && this.inlineContent;
  }
  get isLeaf() {
    return this.contentMatch == jt.empty;
  }
  get isAtom() {
    return this.isLeaf || !!this.spec.atom;
  }
  get whitespace() {
    return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
  }
  hasRequiredAttrs() {
    for (let e in this.attrs)
      if (this.attrs[e].isRequired)
        return !0;
    return !1;
  }
  compatibleContent(e) {
    return this == e || this.contentMatch.compatible(e.contentMatch);
  }
  computeAttrs(e) {
    return !e && this.defaultAttrs ? this.defaultAttrs : Rl(this.attrs, e);
  }
  create(e = null, t, r) {
    if (this.isText)
      throw new Error("NodeType.create can't construct text nodes");
    return new Xe(this, this.computeAttrs(e), k.from(t), J.setFrom(r));
  }
  createChecked(e = null, t, r) {
    if (t = k.from(t), !this.validContent(t))
      throw new RangeError("Invalid content for node " + this.name);
    return new Xe(this, this.computeAttrs(e), t, J.setFrom(r));
  }
  createAndFill(e = null, t, r) {
    if (e = this.computeAttrs(e), t = k.from(t), t.size) {
      let o = this.contentMatch.fillBefore(t);
      if (!o)
        return null;
      t = o.append(t);
    }
    let i = this.contentMatch.matchFragment(t), s = i && i.fillBefore(k.empty, !0);
    return s ? new Xe(this, e, t.append(s), J.setFrom(r)) : null;
  }
  validContent(e) {
    let t = this.contentMatch.matchFragment(e);
    if (!t || !t.validEnd)
      return !1;
    for (let r = 0; r < e.childCount; r++)
      if (!this.allowsMarks(e.child(r).marks))
        return !1;
    return !0;
  }
  allowsMarkType(e) {
    return this.markSet == null || this.markSet.indexOf(e) > -1;
  }
  allowsMarks(e) {
    if (this.markSet == null)
      return !0;
    for (let t = 0; t < e.length; t++)
      if (!this.allowsMarkType(e[t].type))
        return !1;
    return !0;
  }
  allowedMarks(e) {
    if (this.markSet == null)
      return e;
    let t;
    for (let r = 0; r < e.length; r++)
      this.allowsMarkType(e[r].type) ? t && t.push(e[r]) : t || (t = e.slice(0, r));
    return t ? t.length ? t : J.none : e;
  }
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null);
    e.forEach((s, o) => r[s] = new yr(s, t, o));
    let i = t.spec.topNode || "doc";
    if (!r[i])
      throw new RangeError("Schema is missing its top node type ('" + i + "')");
    if (!r.text)
      throw new RangeError("Every schema needs a 'text' type");
    for (let s in r.text.attrs)
      throw new RangeError("The text node type should not have attributes");
    return r;
  }
}
class Uu {
  constructor(e) {
    this.hasDefault = Object.prototype.hasOwnProperty.call(e, "default"), this.default = e.default;
  }
  get isRequired() {
    return !this.hasDefault;
  }
}
class Gr {
  constructor(e, t, r, i) {
    this.name = e, this.rank = t, this.schema = r, this.spec = i, this.attrs = Bl(i.attrs), this.excluded = null;
    let s = Fl(this.attrs);
    this.instance = s ? new J(this, s) : null;
  }
  create(e = null) {
    return !e && this.instance ? this.instance : new J(this, Rl(this.attrs, e));
  }
  static compile(e, t) {
    let r = /* @__PURE__ */ Object.create(null), i = 0;
    return e.forEach((s, o) => r[s] = new Gr(s, i++, t, o)), r;
  }
  removeFromSet(e) {
    for (var t = 0; t < e.length; t++)
      e[t].type == this && (e = e.slice(0, t).concat(e.slice(t + 1)), t--);
    return e;
  }
  isInSet(e) {
    for (let t = 0; t < e.length; t++)
      if (e[t].type == this)
        return e[t];
  }
  excludes(e) {
    return this.excluded.indexOf(e) > -1;
  }
}
class Ku {
  constructor(e) {
    this.cached = /* @__PURE__ */ Object.create(null), this.spec = {
      nodes: pe.from(e.nodes),
      marks: pe.from(e.marks || {}),
      topNode: e.topNode
    }, this.nodes = yr.compile(this.spec.nodes, this), this.marks = Gr.compile(this.spec.marks, this);
    let t = /* @__PURE__ */ Object.create(null);
    for (let r in this.nodes) {
      if (r in this.marks)
        throw new RangeError(r + " can not be both a node and a mark");
      let i = this.nodes[r], s = i.spec.content || "", o = i.spec.marks;
      i.contentMatch = t[s] || (t[s] = jt.parse(s, this.nodes)), i.inlineContent = i.contentMatch.inlineContent, i.markSet = o == "_" ? null : o ? Zs(this, o.split(" ")) : o == "" || !i.inlineContent ? [] : null;
    }
    for (let r in this.marks) {
      let i = this.marks[r], s = i.spec.excludes;
      i.excluded = s == null ? [i] : s == "" ? [] : Zs(this, s.split(" "));
    }
    this.nodeFromJSON = this.nodeFromJSON.bind(this), this.markFromJSON = this.markFromJSON.bind(this), this.topNodeType = this.nodes[this.spec.topNode || "doc"], this.cached.wrappings = /* @__PURE__ */ Object.create(null);
  }
  node(e, t = null, r, i) {
    if (typeof e == "string")
      e = this.nodeType(e);
    else if (e instanceof yr) {
      if (e.schema != this)
        throw new RangeError("Node type from different schema used (" + e.name + ")");
    } else
      throw new RangeError("Invalid node type: " + e);
    return e.createChecked(t, r, i);
  }
  text(e, t) {
    let r = this.nodes.text;
    return new mr(r, r.defaultAttrs, e, J.setFrom(t));
  }
  mark(e, t) {
    return typeof e == "string" && (e = this.marks[e]), e.create(t);
  }
  nodeFromJSON(e) {
    return Xe.fromJSON(this, e);
  }
  markFromJSON(e) {
    return J.fromJSON(this, e);
  }
  nodeType(e) {
    let t = this.nodes[e];
    if (!t)
      throw new RangeError("Unknown node type: " + e);
    return t;
  }
}
function Zs(n, e) {
  let t = [];
  for (let r = 0; r < e.length; r++) {
    let i = e[r], s = n.marks[i], o = s;
    if (s)
      t.push(s);
    else
      for (let l in n.marks) {
        let a = n.marks[l];
        (i == "_" || a.spec.group && a.spec.group.split(" ").indexOf(i) > -1) && t.push(o = a);
      }
    if (!o)
      throw new SyntaxError("Unknown mark type: '" + e[r] + "'");
  }
  return t;
}
class fn {
  constructor(e, t) {
    this.schema = e, this.rules = t, this.tags = [], this.styles = [], t.forEach((r) => {
      r.tag ? this.tags.push(r) : r.style && this.styles.push(r);
    }), this.normalizeLists = !this.tags.some((r) => {
      if (!/^(ul|ol)\b/.test(r.tag) || !r.node)
        return !1;
      let i = e.nodes[r.node];
      return i.contentMatch.matchType(i);
    });
  }
  parse(e, t = {}) {
    let r = new to(this, t, !1);
    return r.addAll(e, t.from, t.to), r.finish();
  }
  parseSlice(e, t = {}) {
    let r = new to(this, t, !0);
    return r.addAll(e, t.from, t.to), O.maxOpen(r.finish());
  }
  matchTag(e, t, r) {
    for (let i = r ? this.tags.indexOf(r) + 1 : 0; i < this.tags.length; i++) {
      let s = this.tags[i];
      if (Ju(e, s.tag) && (s.namespace === void 0 || e.namespaceURI == s.namespace) && (!s.context || t.matchesContext(s.context))) {
        if (s.getAttrs) {
          let o = s.getAttrs(e);
          if (o === !1)
            continue;
          s.attrs = o || void 0;
        }
        return s;
      }
    }
  }
  matchStyle(e, t, r, i) {
    for (let s = i ? this.styles.indexOf(i) + 1 : 0; s < this.styles.length; s++) {
      let o = this.styles[s], l = o.style;
      if (!(l.indexOf(e) != 0 || o.context && !r.matchesContext(o.context) || l.length > e.length && (l.charCodeAt(e.length) != 61 || l.slice(e.length + 1) != t))) {
        if (o.getAttrs) {
          let a = o.getAttrs(t);
          if (a === !1)
            continue;
          o.attrs = a || void 0;
        }
        return o;
      }
    }
  }
  static schemaRules(e) {
    let t = [];
    function r(i) {
      let s = i.priority == null ? 50 : i.priority, o = 0;
      for (; o < t.length; o++) {
        let l = t[o];
        if ((l.priority == null ? 50 : l.priority) < s)
          break;
      }
      t.splice(o, 0, i);
    }
    for (let i in e.marks) {
      let s = e.marks[i].spec.parseDOM;
      s && s.forEach((o) => {
        r(o = no(o)), o.mark = i;
      });
    }
    for (let i in e.nodes) {
      let s = e.nodes[i].spec.parseDOM;
      s && s.forEach((o) => {
        r(o = no(o)), o.node = i;
      });
    }
    return t;
  }
  static fromSchema(e) {
    return e.cached.domParser || (e.cached.domParser = new fn(e, fn.schemaRules(e)));
  }
}
const Il = {
  address: !0,
  article: !0,
  aside: !0,
  blockquote: !0,
  canvas: !0,
  dd: !0,
  div: !0,
  dl: !0,
  fieldset: !0,
  figcaption: !0,
  figure: !0,
  footer: !0,
  form: !0,
  h1: !0,
  h2: !0,
  h3: !0,
  h4: !0,
  h5: !0,
  h6: !0,
  header: !0,
  hgroup: !0,
  hr: !0,
  li: !0,
  noscript: !0,
  ol: !0,
  output: !0,
  p: !0,
  pre: !0,
  section: !0,
  table: !0,
  tfoot: !0,
  ul: !0
}, Wu = {
  head: !0,
  noscript: !0,
  object: !0,
  script: !0,
  style: !0,
  title: !0
}, Pl = { ol: !0, ul: !0 }, br = 1, Dr = 2, Rn = 4;
function eo(n, e, t) {
  return e != null ? (e ? br : 0) | (e === "full" ? Dr : 0) : n && n.whitespace == "pre" ? br | Dr : t & ~Rn;
}
class rr {
  constructor(e, t, r, i, s, o, l) {
    this.type = e, this.attrs = t, this.marks = r, this.pendingMarks = i, this.solid = s, this.options = l, this.content = [], this.activeMarks = J.none, this.stashMarks = [], this.match = o || (l & Rn ? null : e.contentMatch);
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type)
        return [];
      let t = this.type.contentMatch.fillBefore(k.from(e));
      if (t)
        this.match = this.type.contentMatch.matchFragment(t);
      else {
        let r = this.type.contentMatch, i;
        return (i = r.findWrapping(e.type)) ? (this.match = r, i) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & br)) {
      let r = this.content[this.content.length - 1], i;
      if (r && r.isText && (i = /[ \t\r\n\u000c]+$/.exec(r.text))) {
        let s = r;
        r.text.length == i[0].length ? this.content.pop() : this.content[this.content.length - 1] = s.withText(s.text.slice(0, s.text.length - i[0].length));
      }
    }
    let t = k.from(this.content);
    return !e && this.match && (t = t.append(this.match.fillBefore(k.empty, !0))), this.type ? this.type.create(this.attrs, t, this.marks) : t;
  }
  popFromStashMark(e) {
    for (let t = this.stashMarks.length - 1; t >= 0; t--)
      if (e.eq(this.stashMarks[t]))
        return this.stashMarks.splice(t, 1)[0];
  }
  applyPending(e) {
    for (let t = 0, r = this.pendingMarks; t < r.length; t++) {
      let i = r[t];
      (this.type ? this.type.allowsMarkType(i.type) : Yu(i.type, e)) && !i.isInSet(this.activeMarks) && (this.activeMarks = i.addToSet(this.activeMarks), this.pendingMarks = i.removeFromSet(this.pendingMarks));
    }
  }
  inlineContext(e) {
    return this.type ? this.type.inlineContent : this.content.length ? this.content[0].isInline : e.parentNode && !Il.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class to {
  constructor(e, t, r) {
    this.parser = e, this.options = t, this.isOpen = r, this.open = 0;
    let i = t.topNode, s, o = eo(null, t.preserveWhitespace, 0) | (r ? Rn : 0);
    i ? s = new rr(i.type, i.attrs, J.none, J.none, !0, t.topMatch || i.type.contentMatch, o) : r ? s = new rr(null, null, J.none, J.none, !0, null, o) : s = new rr(e.schema.topNodeType, null, J.none, J.none, !0, null, o), this.nodes = [s], this.find = t.findPositions, this.needsBlock = !1;
  }
  get top() {
    return this.nodes[this.open];
  }
  addDOM(e) {
    if (e.nodeType == 3)
      this.addTextNode(e);
    else if (e.nodeType == 1) {
      let t = e.getAttribute("style"), r = t ? this.readStyles(Gu(t)) : null, i = this.top;
      if (r != null)
        for (let s = 0; s < r.length; s++)
          this.addPendingMark(r[s]);
      if (this.addElement(e), r != null)
        for (let s = 0; s < r.length; s++)
          this.removePendingMark(r[s], i);
    }
  }
  addTextNode(e) {
    let t = e.nodeValue, r = this.top;
    if (r.options & Dr || r.inlineContext(e) || /[^ \t\r\n\u000c]/.test(t)) {
      if (r.options & br)
        r.options & Dr ? t = t.replace(/\r\n?/g, `
`) : t = t.replace(/\r?\n|\r/g, " ");
      else if (t = t.replace(/[ \t\r\n\u000c]+/g, " "), /^[ \t\r\n\u000c]/.test(t) && this.open == this.nodes.length - 1) {
        let i = r.content[r.content.length - 1], s = e.previousSibling;
        (!i || s && s.nodeName == "BR" || i.isText && /[ \t\r\n\u000c]$/.test(i.text)) && (t = t.slice(1));
      }
      t && this.insertNode(this.parser.schema.text(t)), this.findInText(e);
    } else
      this.findInside(e);
  }
  addElement(e, t) {
    let r = e.nodeName.toLowerCase(), i;
    Pl.hasOwnProperty(r) && this.parser.normalizeLists && qu(e);
    let s = this.options.ruleFromNode && this.options.ruleFromNode(e) || (i = this.parser.matchTag(e, this, t));
    if (s ? s.ignore : Wu.hasOwnProperty(r))
      this.findInside(e), this.ignoreFallback(e);
    else if (!s || s.skip || s.closeParent) {
      s && s.closeParent ? this.open = Math.max(0, this.open - 1) : s && s.skip.nodeType && (e = s.skip);
      let o, l = this.top, a = this.needsBlock;
      if (Il.hasOwnProperty(r))
        o = !0, l.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e);
        return;
      }
      this.addAll(e), o && this.sync(l), this.needsBlock = a;
    } else
      this.addElementByRule(e, s, s.consuming === !1 ? i : void 0);
  }
  leafFallback(e) {
    e.nodeName == "BR" && this.top.type && this.top.type.inlineContent && this.addTextNode(e.ownerDocument.createTextNode(`
`));
  }
  ignoreFallback(e) {
    e.nodeName == "BR" && (!this.top.type || !this.top.type.inlineContent) && this.findPlace(this.parser.schema.text("-"));
  }
  readStyles(e) {
    let t = J.none;
    e:
      for (let r = 0; r < e.length; r += 2)
        for (let i = void 0; ; ) {
          let s = this.parser.matchStyle(e[r], e[r + 1], this, i);
          if (!s)
            continue e;
          if (s.ignore)
            return null;
          if (t = this.parser.schema.marks[s.mark].create(s.attrs).addToSet(t), s.consuming === !1)
            i = s;
          else
            break;
        }
    return t;
  }
  addElementByRule(e, t, r) {
    let i, s, o;
    t.node ? (s = this.parser.schema.nodes[t.node], s.isLeaf ? this.insertNode(s.create(t.attrs)) || this.leafFallback(e) : i = this.enter(s, t.attrs || null, t.preserveWhitespace)) : (o = this.parser.schema.marks[t.mark].create(t.attrs), this.addPendingMark(o));
    let l = this.top;
    if (s && s.isLeaf)
      this.findInside(e);
    else if (r)
      this.addElement(e, r);
    else if (t.getContent)
      this.findInside(e), t.getContent(e, this.parser.schema).forEach((a) => this.insertNode(a));
    else {
      let a = e;
      typeof t.contentElement == "string" ? a = e.querySelector(t.contentElement) : typeof t.contentElement == "function" ? a = t.contentElement(e) : t.contentElement && (a = t.contentElement), this.findAround(e, a, !0), this.addAll(a);
    }
    i && this.sync(l) && this.open--, o && this.removePendingMark(o, l);
  }
  addAll(e, t, r) {
    let i = t || 0;
    for (let s = t ? e.childNodes[t] : e.firstChild, o = r == null ? null : e.childNodes[r]; s != o; s = s.nextSibling, ++i)
      this.findAtPoint(e, i), this.addDOM(s);
    this.findAtPoint(e, i);
  }
  findPlace(e) {
    let t, r;
    for (let i = this.open; i >= 0; i--) {
      let s = this.nodes[i], o = s.findWrapping(e);
      if (o && (!t || t.length > o.length) && (t = o, r = s, !o.length) || s.solid)
        break;
    }
    if (!t)
      return !1;
    this.sync(r);
    for (let i = 0; i < t.length; i++)
      this.enterInner(t[i], null, !1);
    return !0;
  }
  insertNode(e) {
    if (e.isInline && this.needsBlock && !this.top.type) {
      let t = this.textblockFromContext();
      t && this.enterInner(t);
    }
    if (this.findPlace(e)) {
      this.closeExtra();
      let t = this.top;
      t.applyPending(e.type), t.match && (t.match = t.match.matchType(e.type));
      let r = t.activeMarks;
      for (let i = 0; i < e.marks.length; i++)
        (!t.type || t.type.allowsMarkType(e.marks[i].type)) && (r = e.marks[i].addToSet(r));
      return t.content.push(e.mark(r)), !0;
    }
    return !1;
  }
  enter(e, t, r) {
    let i = this.findPlace(e.create(t));
    return i && this.enterInner(e, t, !0, r), i;
  }
  enterInner(e, t = null, r = !1, i) {
    this.closeExtra();
    let s = this.top;
    s.applyPending(e), s.match = s.match && s.match.matchType(e);
    let o = eo(e, i, s.options);
    s.options & Rn && s.content.length == 0 && (o |= Rn), this.nodes.push(new rr(e, t, s.activeMarks, s.pendingMarks, r, null, o)), this.open++;
  }
  closeExtra(e = !1) {
    let t = this.nodes.length - 1;
    if (t > this.open) {
      for (; t > this.open; t--)
        this.nodes[t - 1].content.push(this.nodes[t].finish(e));
      this.nodes.length = this.open + 1;
    }
  }
  finish() {
    return this.open = 0, this.closeExtra(this.isOpen), this.nodes[0].finish(this.isOpen || this.options.topOpen);
  }
  sync(e) {
    for (let t = this.open; t >= 0; t--)
      if (this.nodes[t] == e)
        return this.open = t, !0;
    return !1;
  }
  get currentPos() {
    this.closeExtra();
    let e = 0;
    for (let t = this.open; t >= 0; t--) {
      let r = this.nodes[t].content;
      for (let i = r.length - 1; i >= 0; i--)
        e += r[i].nodeSize;
      t && e++;
    }
    return e;
  }
  findAtPoint(e, t) {
    if (this.find)
      for (let r = 0; r < this.find.length; r++)
        this.find[r].node == e && this.find[r].offset == t && (this.find[r].pos = this.currentPos);
  }
  findInside(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].pos == null && e.nodeType == 1 && e.contains(this.find[t].node) && (this.find[t].pos = this.currentPos);
  }
  findAround(e, t, r) {
    if (e != t && this.find)
      for (let i = 0; i < this.find.length; i++)
        this.find[i].pos == null && e.nodeType == 1 && e.contains(this.find[i].node) && t.compareDocumentPosition(this.find[i].node) & (r ? 2 : 4) && (this.find[i].pos = this.currentPos);
  }
  findInText(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].node == e && (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
  }
  matchesContext(e) {
    if (e.indexOf("|") > -1)
      return e.split(/\s*\|\s*/).some(this.matchesContext, this);
    let t = e.split("/"), r = this.options.context, i = !this.isOpen && (!r || r.parent.type == this.nodes[0].type), s = -(r ? r.depth + 1 : 0) + (i ? 0 : 1), o = (l, a) => {
      for (; l >= 0; l--) {
        let c = t[l];
        if (c == "") {
          if (l == t.length - 1 || l == 0)
            continue;
          for (; a >= s; a--)
            if (o(l - 1, a))
              return !0;
          return !1;
        } else {
          let u = a > 0 || a == 0 && i ? this.nodes[a].type : r && a >= s ? r.node(a - s).type : null;
          if (!u || u.name != c && u.groups.indexOf(c) == -1)
            return !1;
          a--;
        }
      }
      return !0;
    };
    return o(t.length - 1, this.open);
  }
  textblockFromContext() {
    let e = this.options.context;
    if (e)
      for (let t = e.depth; t >= 0; t--) {
        let r = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
        if (r && r.isTextblock && r.defaultAttrs)
          return r;
      }
    for (let t in this.parser.schema.nodes) {
      let r = this.parser.schema.nodes[t];
      if (r.isTextblock && r.defaultAttrs)
        return r;
    }
  }
  addPendingMark(e) {
    let t = Xu(e, this.top.pendingMarks);
    t && this.top.stashMarks.push(t), this.top.pendingMarks = e.addToSet(this.top.pendingMarks);
  }
  removePendingMark(e, t) {
    for (let r = this.open; r >= 0; r--) {
      let i = this.nodes[r];
      if (i.pendingMarks.lastIndexOf(e) > -1)
        i.pendingMarks = e.removeFromSet(i.pendingMarks);
      else {
        i.activeMarks = e.removeFromSet(i.activeMarks);
        let o = i.popFromStashMark(e);
        o && i.type && i.type.allowsMarkType(o.type) && (i.activeMarks = o.addToSet(i.activeMarks));
      }
      if (i == t)
        break;
    }
  }
}
function qu(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let r = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    r && Pl.hasOwnProperty(r) && t ? (t.appendChild(e), e = t) : r == "li" ? t = e : r && (t = null);
  }
}
function Ju(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(n, e);
}
function Gu(n) {
  let e = /\s*([\w-]+)\s*:\s*([^;]+)/g, t, r = [];
  for (; t = e.exec(n); )
    r.push(t[1], t[2].trim());
  return r;
}
function no(n) {
  let e = {};
  for (let t in n)
    e[t] = n[t];
  return e;
}
function Yu(n, e) {
  let t = e.schema.nodes;
  for (let r in t) {
    let i = t[r];
    if (!i.allowsMarkType(n))
      continue;
    let s = [], o = (l) => {
      s.push(l);
      for (let a = 0; a < l.edgeCount; a++) {
        let { type: c, next: u } = l.edge(a);
        if (c == e || s.indexOf(u) < 0 && o(u))
          return !0;
      }
    };
    if (o(i.contentMatch))
      return !0;
  }
}
function Xu(n, e) {
  for (let t = 0; t < e.length; t++)
    if (n.eq(e[t]))
      return e[t];
}
class Ge {
  constructor(e, t) {
    this.nodes = e, this.marks = t;
  }
  serializeFragment(e, t = {}, r) {
    r || (r = xi(t).createDocumentFragment());
    let i = r, s = [];
    return e.forEach((o) => {
      if (s.length || o.marks.length) {
        let l = 0, a = 0;
        for (; l < s.length && a < o.marks.length; ) {
          let c = o.marks[a];
          if (!this.marks[c.type.name]) {
            a++;
            continue;
          }
          if (!c.eq(s[l][0]) || c.type.spec.spanning === !1)
            break;
          l++, a++;
        }
        for (; l < s.length; )
          i = s.pop()[1];
        for (; a < o.marks.length; ) {
          let c = o.marks[a++], u = this.serializeMark(c, o.isInline, t);
          u && (s.push([c, i]), i.appendChild(u.dom), i = u.contentDOM || u.dom);
        }
      }
      i.appendChild(this.serializeNodeInner(o, t));
    }), r;
  }
  serializeNodeInner(e, t) {
    let { dom: r, contentDOM: i } = Ge.renderSpec(xi(t), this.nodes[e.type.name](e));
    if (i) {
      if (e.isLeaf)
        throw new RangeError("Content hole not allowed in a leaf node spec");
      this.serializeFragment(e.content, t, i);
    }
    return r;
  }
  serializeNode(e, t = {}) {
    let r = this.serializeNodeInner(e, t);
    for (let i = e.marks.length - 1; i >= 0; i--) {
      let s = this.serializeMark(e.marks[i], e.isInline, t);
      s && ((s.contentDOM || s.dom).appendChild(r), r = s.dom);
    }
    return r;
  }
  serializeMark(e, t, r = {}) {
    let i = this.marks[e.type.name];
    return i && Ge.renderSpec(xi(r), i(e, t));
  }
  static renderSpec(e, t, r = null) {
    if (typeof t == "string")
      return { dom: e.createTextNode(t) };
    if (t.nodeType != null)
      return { dom: t };
    if (t.dom && t.dom.nodeType != null)
      return t;
    let i = t[0], s = i.indexOf(" ");
    s > 0 && (r = i.slice(0, s), i = i.slice(s + 1));
    let o, l = r ? e.createElementNS(r, i) : e.createElement(i), a = t[1], c = 1;
    if (a && typeof a == "object" && a.nodeType == null && !Array.isArray(a)) {
      c = 2;
      for (let u in a)
        if (a[u] != null) {
          let d = u.indexOf(" ");
          d > 0 ? l.setAttributeNS(u.slice(0, d), u.slice(d + 1), a[u]) : l.setAttribute(u, a[u]);
        }
    }
    for (let u = c; u < t.length; u++) {
      let d = t[u];
      if (d === 0) {
        if (u < t.length - 1 || u > c)
          throw new RangeError("Content hole must be the only child of its parent node");
        return { dom: l, contentDOM: l };
      } else {
        let { dom: h, contentDOM: f } = Ge.renderSpec(e, d, r);
        if (l.appendChild(h), f) {
          if (o)
            throw new RangeError("Multiple content holes");
          o = f;
        }
      }
    }
    return { dom: l, contentDOM: o };
  }
  static fromSchema(e) {
    return e.cached.domSerializer || (e.cached.domSerializer = new Ge(this.nodesFromSchema(e), this.marksFromSchema(e)));
  }
  static nodesFromSchema(e) {
    let t = ro(e.nodes);
    return t.text || (t.text = (r) => r.text), t;
  }
  static marksFromSchema(e) {
    return ro(e.marks);
  }
}
function ro(n) {
  let e = {};
  for (let t in n) {
    let r = n[t].spec.toDOM;
    r && (e[t] = r);
  }
  return e;
}
function xi(n) {
  return n.document || window.document;
}
const Ll = 65535, _l = Math.pow(2, 16);
function Qu(n, e) {
  return n + e * _l;
}
function io(n) {
  return n & Ll;
}
function Zu(n) {
  return (n - (n & Ll)) / _l;
}
const zl = 1, Hl = 2, ar = 4, $l = 8;
class Ki {
  constructor(e, t, r) {
    this.pos = e, this.delInfo = t, this.recover = r;
  }
  get deleted() {
    return (this.delInfo & $l) > 0;
  }
  get deletedBefore() {
    return (this.delInfo & (zl | ar)) > 0;
  }
  get deletedAfter() {
    return (this.delInfo & (Hl | ar)) > 0;
  }
  get deletedAcross() {
    return (this.delInfo & ar) > 0;
  }
}
class He {
  constructor(e, t = !1) {
    if (this.ranges = e, this.inverted = t, !e.length && He.empty)
      return He.empty;
  }
  recover(e) {
    let t = 0, r = io(e);
    if (!this.inverted)
      for (let i = 0; i < r; i++)
        t += this.ranges[i * 3 + 2] - this.ranges[i * 3 + 1];
    return this.ranges[r * 3] + t + Zu(e);
  }
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  map(e, t = 1) {
    return this._map(e, t, !0);
  }
  _map(e, t, r) {
    let i = 0, s = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? i : 0);
      if (a > e)
        break;
      let c = this.ranges[l + s], u = this.ranges[l + o], d = a + c;
      if (e <= d) {
        let h = c ? e == a ? -1 : e == d ? 1 : t : t, f = a + i + (h < 0 ? 0 : u);
        if (r)
          return f;
        let p = e == (t < 0 ? a : d) ? null : Qu(l / 3, e - a), g = e == a ? Hl : e == d ? zl : ar;
        return (t < 0 ? e != a : e != d) && (g |= $l), new Ki(f, g, p);
      }
      i += u - c;
    }
    return r ? e + i : new Ki(e + i, 0, null);
  }
  touches(e, t) {
    let r = 0, i = io(t), s = this.inverted ? 2 : 1, o = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? r : 0);
      if (a > e)
        break;
      let c = this.ranges[l + s], u = a + c;
      if (e <= u && l == i * 3)
        return !0;
      r += this.ranges[l + o] - c;
    }
    return !1;
  }
  forEach(e) {
    let t = this.inverted ? 2 : 1, r = this.inverted ? 1 : 2;
    for (let i = 0, s = 0; i < this.ranges.length; i += 3) {
      let o = this.ranges[i], l = o - (this.inverted ? s : 0), a = o + (this.inverted ? 0 : s), c = this.ranges[i + t], u = this.ranges[i + r];
      e(l, l + c, a, a + u), s += u - c;
    }
  }
  invert() {
    return new He(this.ranges, !this.inverted);
  }
  toString() {
    return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
  }
  static offset(e) {
    return e == 0 ? He.empty : new He(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
He.empty = new He([]);
class cn {
  constructor(e = [], t, r = 0, i = e.length) {
    this.maps = e, this.mirror = t, this.from = r, this.to = i;
  }
  slice(e = 0, t = this.maps.length) {
    return new cn(this.maps, this.mirror, e, t);
  }
  copy() {
    return new cn(this.maps.slice(), this.mirror && this.mirror.slice(), this.from, this.to);
  }
  appendMap(e, t) {
    this.to = this.maps.push(e), t != null && this.setMirror(this.maps.length - 1, t);
  }
  appendMapping(e) {
    for (let t = 0, r = this.maps.length; t < e.maps.length; t++) {
      let i = e.getMirror(t);
      this.appendMap(e.maps[t], i != null && i < t ? r + i : void 0);
    }
  }
  getMirror(e) {
    if (this.mirror) {
      for (let t = 0; t < this.mirror.length; t++)
        if (this.mirror[t] == e)
          return this.mirror[t + (t % 2 ? -1 : 1)];
    }
  }
  setMirror(e, t) {
    this.mirror || (this.mirror = []), this.mirror.push(e, t);
  }
  appendMappingInverted(e) {
    for (let t = e.maps.length - 1, r = this.maps.length + e.maps.length; t >= 0; t--) {
      let i = e.getMirror(t);
      this.appendMap(e.maps[t].invert(), i != null && i > t ? r - i - 1 : void 0);
    }
  }
  invert() {
    let e = new cn();
    return e.appendMappingInverted(this), e;
  }
  map(e, t = 1) {
    if (this.mirror)
      return this._map(e, t, !0);
    for (let r = this.from; r < this.to; r++)
      e = this.maps[r].map(e, t);
    return e;
  }
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  _map(e, t, r) {
    let i = 0;
    for (let s = this.from; s < this.to; s++) {
      let o = this.maps[s], l = o.mapResult(e, t);
      if (l.recover != null) {
        let a = this.getMirror(s);
        if (a != null && a > s && a < this.to) {
          s = a, e = this.maps[a].recover(l.recover);
          continue;
        }
      }
      i |= l.delInfo, e = l.pos;
    }
    return r ? e : new Ki(e, i, null);
  }
}
const ki = /* @__PURE__ */ Object.create(null);
class Ct {
  getMap() {
    return He.empty;
  }
  merge(e) {
    return null;
  }
  static fromJSON(e, t) {
    if (!t || !t.stepType)
      throw new RangeError("Invalid input for Step.fromJSON");
    let r = ki[t.stepType];
    if (!r)
      throw new RangeError(`No step type ${t.stepType} defined`);
    return r.fromJSON(e, t);
  }
  static jsonID(e, t) {
    if (e in ki)
      throw new RangeError("Duplicate use of step JSON ID " + e);
    return ki[e] = t, t.prototype.jsonID = e, t;
  }
}
class Fe {
  constructor(e, t) {
    this.doc = e, this.failed = t;
  }
  static ok(e) {
    return new Fe(e, null);
  }
  static fail(e) {
    return new Fe(null, e);
  }
  static fromReplace(e, t, r, i) {
    try {
      return Fe.ok(e.replace(t, r, i));
    } catch (s) {
      if (s instanceof Hn)
        return Fe.fail(s.message);
      throw s;
    }
  }
}
function hs(n, e, t) {
  let r = [];
  for (let i = 0; i < n.childCount; i++) {
    let s = n.child(i);
    s.content.size && (s = s.copy(hs(s.content, e, s))), s.isInline && (s = e(s, t, i)), r.push(s);
  }
  return k.fromArray(r);
}
class ft extends Ct {
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = e.resolve(this.from), i = r.node(r.sharedDepth(this.to)), s = new O(hs(t.content, (o, l) => !o.isAtom || !l.type.allowsMarkType(this.mark.type) ? o : o.mark(this.mark.addToSet(o.marks)), i), t.openStart, t.openEnd);
    return Fe.fromReplace(e, this.from, this.to, s);
  }
  invert() {
    return new Ye(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new ft(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof ft && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new ft(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "addMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new ft(t.from, t.to, e.markFromJSON(t.mark));
  }
}
Ct.jsonID("addMark", ft);
class Ye extends Ct {
  constructor(e, t, r) {
    super(), this.from = e, this.to = t, this.mark = r;
  }
  apply(e) {
    let t = e.slice(this.from, this.to), r = new O(hs(t.content, (i) => i.mark(this.mark.removeFromSet(i.marks)), e), t.openStart, t.openEnd);
    return Fe.fromReplace(e, this.from, this.to, r);
  }
  invert() {
    return new ft(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deleted && r.deleted || t.pos >= r.pos ? null : new Ye(t.pos, r.pos, this.mark);
  }
  merge(e) {
    return e instanceof Ye && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from ? new Ye(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark) : null;
  }
  toJSON() {
    return {
      stepType: "removeMark",
      mark: this.mark.toJSON(),
      from: this.from,
      to: this.to
    };
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new Ye(t.from, t.to, e.markFromJSON(t.mark));
  }
}
Ct.jsonID("removeMark", Ye);
class Ee extends Ct {
  constructor(e, t, r, i = !1) {
    super(), this.from = e, this.to = t, this.slice = r, this.structure = i;
  }
  apply(e) {
    return this.structure && Wi(e, this.from, this.to) ? Fe.fail("Structure replace would overwrite content") : Fe.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new He([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new Ee(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1);
    return t.deletedAcross && r.deletedAcross ? null : new Ee(t.pos, Math.max(t.pos, r.pos), this.slice);
  }
  merge(e) {
    if (!(e instanceof Ee) || e.structure || this.structure)
      return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t = this.slice.size + e.slice.size == 0 ? O.empty : new O(this.slice.content.append(e.slice.content), this.slice.openStart, e.slice.openEnd);
      return new Ee(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t = this.slice.size + e.slice.size == 0 ? O.empty : new O(e.slice.content.append(this.slice.content), e.slice.openStart, this.slice.openEnd);
      return new Ee(e.from, this.to, t, this.structure);
    } else
      return null;
  }
  toJSON() {
    let e = { stepType: "replace", from: this.from, to: this.to };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new Ee(t.from, t.to, O.fromJSON(e, t.slice), !!t.structure);
  }
}
Ct.jsonID("replace", Ee);
class le extends Ct {
  constructor(e, t, r, i, s, o, l = !1) {
    super(), this.from = e, this.to = t, this.gapFrom = r, this.gapTo = i, this.slice = s, this.insert = o, this.structure = l;
  }
  apply(e) {
    if (this.structure && (Wi(e, this.from, this.gapFrom) || Wi(e, this.gapTo, this.to)))
      return Fe.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd)
      return Fe.fail("Gap is not a flat range");
    let r = this.slice.insertAt(this.insert, t.content);
    return r ? Fe.fromReplace(e, this.from, this.to, r) : Fe.fail("Content does not fit in gap");
  }
  getMap() {
    return new He([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert
    ]);
  }
  invert(e) {
    let t = this.gapTo - this.gapFrom;
    return new le(this.from, this.from + this.slice.size + t, this.from + this.insert, this.from + this.insert + t, e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from), this.gapFrom - this.from, this.structure);
  }
  map(e) {
    let t = e.mapResult(this.from, 1), r = e.mapResult(this.to, -1), i = e.map(this.gapFrom, -1), s = e.map(this.gapTo, 1);
    return t.deletedAcross && r.deletedAcross || i < t.pos || s > r.pos ? null : new le(t.pos, r.pos, i, s, this.slice, this.insert, this.structure);
  }
  toJSON() {
    let e = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert
    };
    return this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e;
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number" || typeof t.gapFrom != "number" || typeof t.gapTo != "number" || typeof t.insert != "number")
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new le(t.from, t.to, t.gapFrom, t.gapTo, O.fromJSON(e, t.slice), t.insert, !!t.structure);
  }
}
Ct.jsonID("replaceAround", le);
function Wi(n, e, t) {
  let r = n.resolve(e), i = t - e, s = r.depth;
  for (; i > 0 && s > 0 && r.indexAfter(s) == r.node(s).childCount; )
    s--, i--;
  if (i > 0) {
    let o = r.node(s).maybeChild(r.indexAfter(s));
    for (; i > 0; ) {
      if (!o || o.isLeaf)
        return !0;
      o = o.firstChild, i--;
    }
  }
  return !1;
}
function ec(n, e, t, r) {
  let i = [], s = [], o, l;
  n.doc.nodesBetween(e, t, (a, c, u) => {
    if (!a.isInline)
      return;
    let d = a.marks;
    if (!r.isInSet(d) && u.type.allowsMarkType(r.type)) {
      let h = Math.max(c, e), f = Math.min(c + a.nodeSize, t), p = r.addToSet(d);
      for (let g = 0; g < d.length; g++)
        d[g].isInSet(p) || (o && o.to == h && o.mark.eq(d[g]) ? o.to = f : i.push(o = new Ye(h, f, d[g])));
      l && l.to == h ? l.to = f : s.push(l = new ft(h, f, r));
    }
  }), i.forEach((a) => n.step(a)), s.forEach((a) => n.step(a));
}
function tc(n, e, t, r) {
  let i = [], s = 0;
  n.doc.nodesBetween(e, t, (o, l) => {
    if (!o.isInline)
      return;
    s++;
    let a = null;
    if (r instanceof Gr) {
      let c = o.marks, u;
      for (; u = r.isInSet(c); )
        (a || (a = [])).push(u), c = u.removeFromSet(c);
    } else
      r ? r.isInSet(o.marks) && (a = [r]) : a = o.marks;
    if (a && a.length) {
      let c = Math.min(l + o.nodeSize, t);
      for (let u = 0; u < a.length; u++) {
        let d = a[u], h;
        for (let f = 0; f < i.length; f++) {
          let p = i[f];
          p.step == s - 1 && d.eq(i[f].style) && (h = p);
        }
        h ? (h.to = c, h.step = s) : i.push({ style: d, from: Math.max(l, e), to: c, step: s });
      }
    }
  }), i.forEach((o) => n.step(new Ye(o.from, o.to, o.style)));
}
function nc(n, e, t, r = t.contentMatch) {
  let i = n.doc.nodeAt(e), s = [], o = e + 1;
  for (let l = 0; l < i.childCount; l++) {
    let a = i.child(l), c = o + a.nodeSize, u = r.matchType(a.type);
    if (!u)
      s.push(new Ee(o, c, O.empty));
    else {
      r = u;
      for (let d = 0; d < a.marks.length; d++)
        t.allowsMarkType(a.marks[d].type) || n.step(new Ye(o, c, a.marks[d]));
    }
    o = c;
  }
  if (!r.validEnd) {
    let l = r.fillBefore(k.empty, !0);
    n.replace(o, o, new O(l, 0, 0));
  }
  for (let l = s.length - 1; l >= 0; l--)
    n.step(s[l]);
}
function rc(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function Dn(n) {
  let t = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let r = n.depth; ; --r) {
    let i = n.$from.node(r), s = n.$from.index(r), o = n.$to.indexAfter(r);
    if (r < n.depth && i.canReplace(s, o, t))
      return r;
    if (r == 0 || i.type.spec.isolating || !rc(i, s, o))
      break;
  }
  return null;
}
function ic(n, e, t) {
  let { $from: r, $to: i, depth: s } = e, o = r.before(s + 1), l = i.after(s + 1), a = o, c = l, u = k.empty, d = 0;
  for (let p = s, g = !1; p > t; p--)
    g || r.index(p) > 0 ? (g = !0, u = k.from(r.node(p).copy(u)), d++) : a--;
  let h = k.empty, f = 0;
  for (let p = s, g = !1; p > t; p--)
    g || i.after(p + 1) < i.end(p) ? (g = !0, h = k.from(i.node(p).copy(h)), f++) : c++;
  n.step(new le(a, c, o, l, new O(u.append(h), d, f), u.size - d, !0));
}
function fs(n, e, t = null, r = n) {
  let i = sc(n, e), s = i && oc(r, e);
  return s ? i.map(so).concat({ type: e, attrs: t }).concat(s.map(so)) : null;
}
function so(n) {
  return { type: n, attrs: null };
}
function sc(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, s = t.contentMatchAt(r).findWrapping(e);
  if (!s)
    return null;
  let o = s.length ? s[0] : e;
  return t.canReplaceWith(r, i, o) ? s : null;
}
function oc(n, e) {
  let { parent: t, startIndex: r, endIndex: i } = n, s = t.child(r), o = e.contentMatch.findWrapping(s.type);
  if (!o)
    return null;
  let a = (o.length ? o[o.length - 1] : e).contentMatch;
  for (let c = r; a && c < i; c++)
    a = a.matchType(t.child(c).type);
  return !a || !a.validEnd ? null : o;
}
function lc(n, e, t) {
  let r = k.empty;
  for (let o = t.length - 1; o >= 0; o--) {
    if (r.size) {
      let l = t[o].type.contentMatch.matchFragment(r);
      if (!l || !l.validEnd)
        throw new RangeError("Wrapper type given to Transform.wrap does not form valid content of its parent wrapper");
    }
    r = k.from(t[o].type.create(t[o].attrs, r));
  }
  let i = e.start, s = e.end;
  n.step(new le(i, s, i, s, new O(r, 0, 0), t.length, !0));
}
function ac(n, e, t, r, i) {
  if (!r.isTextblock)
    throw new RangeError("Type given to setBlockType should be a textblock");
  let s = n.steps.length;
  n.doc.nodesBetween(e, t, (o, l) => {
    if (o.isTextblock && !o.hasMarkup(r, i) && uc(n.doc, n.mapping.slice(s).map(l), r)) {
      n.clearIncompatible(n.mapping.slice(s).map(l, 1), r);
      let a = n.mapping.slice(s), c = a.map(l, 1), u = a.map(l + o.nodeSize, 1);
      return n.step(new le(c, u, c + 1, u - 1, new O(k.from(r.create(i, null, o.marks)), 0, 0), 1, !0)), !1;
    }
  });
}
function uc(n, e, t) {
  let r = n.resolve(e), i = r.index();
  return r.parent.canReplaceWith(i, i + 1, t);
}
function cc(n, e, t, r, i) {
  let s = n.doc.nodeAt(e);
  if (!s)
    throw new RangeError("No node at given position");
  t || (t = s.type);
  let o = t.create(r, null, i || s.marks);
  if (s.isLeaf)
    return n.replaceWith(e, e + s.nodeSize, o);
  if (!t.validContent(s.content))
    throw new RangeError("Invalid content for node type " + t.name);
  n.step(new le(e, e + s.nodeSize, e + 1, e + s.nodeSize - 1, new O(k.from(o), 0, 0), 1, !0));
}
function dn(n, e, t = 1, r) {
  let i = n.resolve(e), s = i.depth - t, o = r && r[r.length - 1] || i.parent;
  if (s < 0 || i.parent.type.spec.isolating || !i.parent.canReplace(i.index(), i.parent.childCount) || !o.type.validContent(i.parent.content.cutByIndex(i.index(), i.parent.childCount)))
    return !1;
  for (let c = i.depth - 1, u = t - 2; c > s; c--, u--) {
    let d = i.node(c), h = i.index(c);
    if (d.type.spec.isolating)
      return !1;
    let f = d.content.cutByIndex(h, d.childCount), p = r && r[u] || d;
    if (p != d && (f = f.replaceChild(0, p.type.create(p.attrs))), !d.canReplace(h + 1, d.childCount) || !p.type.validContent(f))
      return !1;
  }
  let l = i.indexAfter(s), a = r && r[0];
  return i.node(s).canReplaceWith(l, l, a ? a.type : i.node(s + 1).type);
}
function dc(n, e, t = 1, r) {
  let i = n.doc.resolve(e), s = k.empty, o = k.empty;
  for (let l = i.depth, a = i.depth - t, c = t - 1; l > a; l--, c--) {
    s = k.from(i.node(l).copy(s));
    let u = r && r[c];
    o = k.from(u ? u.type.create(u.attrs, o) : i.node(l).copy(o));
  }
  n.step(new Ee(e, e, new O(s.append(o), t, t), !0));
}
function Xn(n, e) {
  let t = n.resolve(e), r = t.index();
  return hc(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(r, r + 1);
}
function hc(n, e) {
  return !!(n && e && !n.isLeaf && n.canAppend(e));
}
function fc(n, e, t) {
  let r = new Ee(e - t, e + t, O.empty, !0);
  n.step(r);
}
function pc(n, e, t) {
  let r = n.resolve(e);
  if (r.parent.canReplaceWith(r.index(), r.index(), t))
    return e;
  if (r.parentOffset == 0)
    for (let i = r.depth - 1; i >= 0; i--) {
      let s = r.index(i);
      if (r.node(i).canReplaceWith(s, s, t))
        return r.before(i + 1);
      if (s > 0)
        return null;
    }
  if (r.parentOffset == r.parent.content.size)
    for (let i = r.depth - 1; i >= 0; i--) {
      let s = r.indexAfter(i);
      if (r.node(i).canReplaceWith(s, s, t))
        return r.after(i + 1);
      if (s < r.node(i).childCount)
        return null;
    }
  return null;
}
function jl(n, e, t) {
  let r = n.resolve(e);
  if (!t.content.size)
    return e;
  let i = t.content;
  for (let s = 0; s < t.openStart; s++)
    i = i.firstChild.content;
  for (let s = 1; s <= (t.openStart == 0 && t.size ? 2 : 1); s++)
    for (let o = r.depth; o >= 0; o--) {
      let l = o == r.depth ? 0 : r.pos <= (r.start(o + 1) + r.end(o + 1)) / 2 ? -1 : 1, a = r.index(o) + (l > 0 ? 1 : 0), c = r.node(o), u = !1;
      if (s == 1)
        u = c.canReplace(a, a, i);
      else {
        let d = c.contentMatchAt(a).findWrapping(i.firstChild.type);
        u = d && c.canReplaceWith(a, a, d[0]);
      }
      if (u)
        return l == 0 ? r.pos : l < 0 ? r.before(o + 1) : r.after(o + 1);
    }
  return null;
}
function ps(n, e, t = e, r = O.empty) {
  if (e == t && !r.size)
    return null;
  let i = n.resolve(e), s = n.resolve(t);
  return Vl(i, s, r) ? new Ee(e, t, r) : new gc(i, s, r).fit();
}
function Vl(n, e, t) {
  return !t.openStart && !t.openEnd && n.start() == e.start() && n.parent.canReplace(n.index(), e.index(), t.content);
}
class gc {
  constructor(e, t, r) {
    this.$from = e, this.$to = t, this.unplaced = r, this.frontier = [], this.placed = k.empty;
    for (let i = 0; i <= e.depth; i++) {
      let s = e.node(i);
      this.frontier.push({
        type: s.type,
        match: s.contentMatchAt(e.indexAfter(i))
      });
    }
    for (let i = e.depth; i > 0; i--)
      this.placed = k.from(e.node(i).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let c = this.findFittable();
      c ? this.placeNodes(c) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(), t = this.placed.size - this.depth - this.$from.depth, r = this.$from, i = this.close(e < 0 ? this.$to : r.doc.resolve(e));
    if (!i)
      return null;
    let s = this.placed, o = r.depth, l = i.depth;
    for (; o && l && s.childCount == 1; )
      s = s.firstChild.content, o--, l--;
    let a = new O(s, o, l);
    return e > -1 ? new le(r.pos, e, this.$to.pos, this.$to.end(), a, t) : a.size || r.pos != this.$to.pos ? new Ee(r.pos, i.pos, a) : null;
  }
  findFittable() {
    for (let e = 1; e <= 2; e++)
      for (let t = this.unplaced.openStart; t >= 0; t--) {
        let r, i = null;
        t ? (i = Ci(this.unplaced.content, t - 1).firstChild, r = i.content) : r = this.unplaced.content;
        let s = r.firstChild;
        for (let o = this.depth; o >= 0; o--) {
          let { type: l, match: a } = this.frontier[o], c, u = null;
          if (e == 1 && (s ? a.matchType(s.type) || (u = a.fillBefore(k.from(s), !1)) : i && l.compatibleContent(i.type)))
            return { sliceDepth: t, frontierDepth: o, parent: i, inject: u };
          if (e == 2 && s && (c = a.findWrapping(s.type)))
            return { sliceDepth: t, frontierDepth: o, parent: i, wrap: c };
          if (i && a.matchType(i.type))
            break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = Ci(e, t);
    return !i.childCount || i.firstChild.isLeaf ? !1 : (this.unplaced = new O(e, t + 1, Math.max(r, i.size + t >= e.size - r ? t + 1 : 0)), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: r } = this.unplaced, i = Ci(e, t);
    if (i.childCount <= 1 && t > 0) {
      let s = e.size - t <= t + i.size;
      this.unplaced = new O(On(e, t - 1, 1), t - 1, s ? t - 1 : r);
    } else
      this.unplaced = new O(On(e, t, 1), t, r);
  }
  placeNodes({ sliceDepth: e, frontierDepth: t, parent: r, inject: i, wrap: s }) {
    for (; this.depth > t; )
      this.closeFrontierNode();
    if (s)
      for (let g = 0; g < s.length; g++)
        this.openFrontierNode(s[g]);
    let o = this.unplaced, l = r ? r.content : o.content, a = o.openStart - e, c = 0, u = [], { match: d, type: h } = this.frontier[t];
    if (i) {
      for (let g = 0; g < i.childCount; g++)
        u.push(i.child(g));
      d = d.matchFragment(i);
    }
    let f = l.size + e - (o.content.size - o.openEnd);
    for (; c < l.childCount; ) {
      let g = l.child(c), y = d.matchType(g.type);
      if (!y)
        break;
      c++, (c > 1 || a == 0 || g.content.size) && (d = y, u.push(Ul(g.mark(h.allowedMarks(g.marks)), c == 1 ? a : 0, c == l.childCount ? f : -1)));
    }
    let p = c == l.childCount;
    p || (f = -1), this.placed = vn(this.placed, t, k.from(u)), this.frontier[t].match = d, p && f < 0 && r && r.type == this.frontier[this.depth].type && this.frontier.length > 1 && this.closeFrontierNode();
    for (let g = 0, y = l; g < f; g++) {
      let D = y.lastChild;
      this.frontier.push({ type: D.type, match: D.contentMatchAt(D.childCount) }), y = D.content;
    }
    this.unplaced = p ? e == 0 ? O.empty : new O(On(o.content, e - 1, 1), e - 1, f < 0 ? o.openEnd : e - 1) : new O(On(o.content, e, c), o.openStart, o.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock)
      return -1;
    let e = this.frontier[this.depth], t;
    if (!e.type.isTextblock || !Si(this.$to, this.$to.depth, e.type, e.match, !1) || this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
      return -1;
    let { depth: r } = this.$to, i = this.$to.after(r);
    for (; r > 1 && i == this.$to.end(--r); )
      ++i;
    return i;
  }
  findCloseLevel(e) {
    e:
      for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
        let { match: r, type: i } = this.frontier[t], s = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)), o = Si(e, t, i, r, s);
        if (!!o) {
          for (let l = t - 1; l >= 0; l--) {
            let { match: a, type: c } = this.frontier[l], u = Si(e, l, c, a, !0);
            if (!u || u.childCount)
              continue e;
          }
          return { depth: t, fit: o, move: s ? e.doc.resolve(e.after(t + 1)) : e };
        }
      }
  }
  close(e) {
    let t = this.findCloseLevel(e);
    if (!t)
      return null;
    for (; this.depth > t.depth; )
      this.closeFrontierNode();
    t.fit.childCount && (this.placed = vn(this.placed, t.depth, t.fit)), e = t.move;
    for (let r = t.depth + 1; r <= e.depth; r++) {
      let i = e.node(r), s = i.type.contentMatch.fillBefore(i.content, !0, e.index(r));
      this.openFrontierNode(i.type, i.attrs, s);
    }
    return e;
  }
  openFrontierNode(e, t = null, r) {
    let i = this.frontier[this.depth];
    i.match = i.match.matchType(e), this.placed = vn(this.placed, this.depth, k.from(e.create(t, r))), this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let t = this.frontier.pop().match.fillBefore(k.empty, !0);
    t.childCount && (this.placed = vn(this.placed, this.frontier.length, t));
  }
}
function On(n, e, t) {
  return e == 0 ? n.cutByIndex(t, n.childCount) : n.replaceChild(0, n.firstChild.copy(On(n.firstChild.content, e - 1, t)));
}
function vn(n, e, t) {
  return e == 0 ? n.append(t) : n.replaceChild(n.childCount - 1, n.lastChild.copy(vn(n.lastChild.content, e - 1, t)));
}
function Ci(n, e) {
  for (let t = 0; t < e; t++)
    n = n.firstChild.content;
  return n;
}
function Ul(n, e, t) {
  if (e <= 0)
    return n;
  let r = n.content;
  return e > 1 && (r = r.replaceChild(0, Ul(r.firstChild, e - 1, r.childCount == 1 ? t - 1 : 0))), e > 0 && (r = n.type.contentMatch.fillBefore(r).append(r), t <= 0 && (r = r.append(n.type.contentMatch.matchFragment(r).fillBefore(k.empty, !0)))), n.copy(r);
}
function Si(n, e, t, r, i) {
  let s = n.node(e), o = i ? n.indexAfter(e) : n.index(e);
  if (o == s.childCount && !t.compatibleContent(s.type))
    return null;
  let l = r.fillBefore(s.content, !0, o);
  return l && !mc(t, s.content, o) ? l : null;
}
function mc(n, e, t) {
  for (let r = t; r < e.childCount; r++)
    if (!n.allowsMarks(e.child(r).marks))
      return !0;
  return !1;
}
function yc(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function bc(n, e, t, r) {
  if (!r.size)
    return n.deleteRange(e, t);
  let i = n.doc.resolve(e), s = n.doc.resolve(t);
  if (Vl(i, s, r))
    return n.step(new Ee(e, t, r));
  let o = Wl(i, n.doc.resolve(t));
  o[o.length - 1] == 0 && o.pop();
  let l = -(i.depth + 1);
  o.unshift(l);
  for (let h = i.depth, f = i.pos - 1; h > 0; h--, f--) {
    let p = i.node(h).type.spec;
    if (p.defining || p.definingAsContext || p.isolating)
      break;
    o.indexOf(h) > -1 ? l = h : i.before(h) == f && o.splice(1, 0, -h);
  }
  let a = o.indexOf(l), c = [], u = r.openStart;
  for (let h = r.content, f = 0; ; f++) {
    let p = h.firstChild;
    if (c.push(p), f == r.openStart)
      break;
    h = p.content;
  }
  for (let h = u - 1; h >= 0; h--) {
    let f = c[h].type, p = yc(f);
    if (p && i.node(a).type != f)
      u = h;
    else if (p || !f.isTextblock)
      break;
  }
  for (let h = r.openStart; h >= 0; h--) {
    let f = (h + u + 1) % (r.openStart + 1), p = c[f];
    if (!!p)
      for (let g = 0; g < o.length; g++) {
        let y = o[(g + a) % o.length], D = !0;
        y < 0 && (D = !1, y = -y);
        let R = i.node(y - 1), P = i.index(y - 1);
        if (R.canReplaceWith(P, P, p.type, p.marks))
          return n.replace(i.before(y), D ? s.after(y) : t, new O(Kl(r.content, 0, r.openStart, f), f, r.openEnd));
      }
  }
  let d = n.steps.length;
  for (let h = o.length - 1; h >= 0 && (n.replace(e, t, r), !(n.steps.length > d)); h--) {
    let f = o[h];
    f < 0 || (e = i.before(f), t = s.after(f));
  }
}
function Kl(n, e, t, r, i) {
  if (e < t) {
    let s = n.firstChild;
    n = n.replaceChild(0, s.copy(Kl(s.content, e + 1, t, r, s)));
  }
  if (e > r) {
    let s = i.contentMatchAt(0), o = s.fillBefore(n).append(n);
    n = o.append(s.matchFragment(o).fillBefore(k.empty, !0));
  }
  return n;
}
function Dc(n, e, t, r) {
  if (!r.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let i = pc(n.doc, e, r.type);
    i != null && (e = t = i);
  }
  n.replaceRange(e, t, new O(k.from(r), 0, 0));
}
function Ec(n, e, t) {
  let r = n.doc.resolve(e), i = n.doc.resolve(t), s = Wl(r, i);
  for (let o = 0; o < s.length; o++) {
    let l = s[o], a = o == s.length - 1;
    if (a && l == 0 || r.node(l).type.contentMatch.validEnd)
      return n.delete(r.start(l), i.end(l));
    if (l > 0 && (a || r.node(l - 1).canReplace(r.index(l - 1), i.indexAfter(l - 1))))
      return n.delete(r.before(l), i.after(l));
  }
  for (let o = 1; o <= r.depth && o <= i.depth; o++)
    if (e - r.start(o) == r.depth - o && t > r.end(o) && i.end(o) - t != i.depth - o)
      return n.delete(r.before(o), t);
  n.delete(e, t);
}
function Wl(n, e) {
  let t = [], r = Math.min(n.depth, e.depth);
  for (let i = r; i >= 0; i--) {
    let s = n.start(i);
    if (s < n.pos - (n.depth - i) || e.end(i) > e.pos + (e.depth - i) || n.node(i).type.spec.isolating || e.node(i).type.spec.isolating)
      break;
    (s == e.start(i) || i == n.depth && i == e.depth && n.parent.inlineContent && e.parent.inlineContent && i && e.start(i - 1) == s - 1) && t.push(i);
  }
  return t;
}
let pn = class extends Error {
};
pn = function n(e) {
  let t = Error.call(this, e);
  return t.__proto__ = n.prototype, t;
};
pn.prototype = Object.create(Error.prototype);
pn.prototype.constructor = pn;
pn.prototype.name = "TransformError";
class ql {
  constructor(e) {
    this.doc = e, this.steps = [], this.docs = [], this.mapping = new cn();
  }
  get before() {
    return this.docs.length ? this.docs[0] : this.doc;
  }
  step(e) {
    let t = this.maybeStep(e);
    if (t.failed)
      throw new pn(t.failed);
    return this;
  }
  maybeStep(e) {
    let t = e.apply(this.doc);
    return t.failed || this.addStep(e, t.doc), t;
  }
  get docChanged() {
    return this.steps.length > 0;
  }
  addStep(e, t) {
    this.docs.push(this.doc), this.steps.push(e), this.mapping.appendMap(e.getMap()), this.doc = t;
  }
  replace(e, t = e, r = O.empty) {
    let i = ps(this.doc, e, t, r);
    return i && this.step(i), this;
  }
  replaceWith(e, t, r) {
    return this.replace(e, t, new O(k.from(r), 0, 0));
  }
  delete(e, t) {
    return this.replace(e, t, O.empty);
  }
  insert(e, t) {
    return this.replaceWith(e, e, t);
  }
  replaceRange(e, t, r) {
    return bc(this, e, t, r), this;
  }
  replaceRangeWith(e, t, r) {
    return Dc(this, e, t, r), this;
  }
  deleteRange(e, t) {
    return Ec(this, e, t), this;
  }
  lift(e, t) {
    return ic(this, e, t), this;
  }
  join(e, t = 1) {
    return fc(this, e, t), this;
  }
  wrap(e, t) {
    return lc(this, e, t), this;
  }
  setBlockType(e, t = e, r, i = null) {
    return ac(this, e, t, r, i), this;
  }
  setNodeMarkup(e, t, r = null, i = []) {
    return cc(this, e, t, r, i), this;
  }
  split(e, t = 1, r) {
    return dc(this, e, t, r), this;
  }
  addMark(e, t, r) {
    return ec(this, e, t, r), this;
  }
  removeMark(e, t, r) {
    return tc(this, e, t, r), this;
  }
  clearIncompatible(e, t, r) {
    return nc(this, e, t, r), this;
  }
}
const Ai = /* @__PURE__ */ Object.create(null);
class V {
  constructor(e, t, r) {
    this.$anchor = e, this.$head = t, this.ranges = r || [new xc(e.min(t), e.max(t))];
  }
  get anchor() {
    return this.$anchor.pos;
  }
  get head() {
    return this.$head.pos;
  }
  get from() {
    return this.$from.pos;
  }
  get to() {
    return this.$to.pos;
  }
  get $from() {
    return this.ranges[0].$from;
  }
  get $to() {
    return this.ranges[0].$to;
  }
  get empty() {
    let e = this.ranges;
    for (let t = 0; t < e.length; t++)
      if (e[t].$from.pos != e[t].$to.pos)
        return !1;
    return !0;
  }
  content() {
    return this.$from.doc.slice(this.from, this.to, !0);
  }
  replace(e, t = O.empty) {
    let r = t.content.lastChild, i = null;
    for (let l = 0; l < t.openEnd; l++)
      i = r, r = r.lastChild;
    let s = e.steps.length, o = this.ranges;
    for (let l = 0; l < o.length; l++) {
      let { $from: a, $to: c } = o[l], u = e.mapping.slice(s);
      e.replaceRange(u.map(a.pos), u.map(c.pos), l ? O.empty : t), l == 0 && ao(e, s, (r ? r.isInline : i && i.isTextblock) ? -1 : 1);
    }
  }
  replaceWith(e, t) {
    let r = e.steps.length, i = this.ranges;
    for (let s = 0; s < i.length; s++) {
      let { $from: o, $to: l } = i[s], a = e.mapping.slice(r), c = a.map(o.pos), u = a.map(l.pos);
      s ? e.deleteRange(c, u) : (e.replaceRangeWith(c, u, t), ao(e, r, t.isInline ? -1 : 1));
    }
  }
  static findFrom(e, t, r = !1) {
    let i = e.parent.inlineContent ? new $(e) : Qt(e.node(0), e.parent, e.pos, e.index(), t, r);
    if (i)
      return i;
    for (let s = e.depth - 1; s >= 0; s--) {
      let o = t < 0 ? Qt(e.node(0), e.node(s), e.before(s + 1), e.index(s), t, r) : Qt(e.node(0), e.node(s), e.after(s + 1), e.index(s) + 1, t, r);
      if (o)
        return o;
    }
    return null;
  }
  static near(e, t = 1) {
    return this.findFrom(e, t) || this.findFrom(e, -t) || new Ve(e.node(0));
  }
  static atStart(e) {
    return Qt(e, e, 0, 0, 1) || new Ve(e);
  }
  static atEnd(e) {
    return Qt(e, e, e.content.size, e.childCount, -1) || new Ve(e);
  }
  static fromJSON(e, t) {
    if (!t || !t.type)
      throw new RangeError("Invalid input for Selection.fromJSON");
    let r = Ai[t.type];
    if (!r)
      throw new RangeError(`No selection type ${t.type} defined`);
    return r.fromJSON(e, t);
  }
  static jsonID(e, t) {
    if (e in Ai)
      throw new RangeError("Duplicate use of selection JSON ID " + e);
    return Ai[e] = t, t.prototype.jsonID = e, t;
  }
  getBookmark() {
    return $.between(this.$anchor, this.$head).getBookmark();
  }
}
V.prototype.visible = !0;
class xc {
  constructor(e, t) {
    this.$from = e, this.$to = t;
  }
}
let oo = !1;
function lo(n) {
  !oo && !n.parent.inlineContent && (oo = !0, console.warn("TextSelection endpoint not pointing into a node with inline content (" + n.parent.type.name + ")"));
}
class $ extends V {
  constructor(e, t = e) {
    lo(e), lo(t), super(e, t);
  }
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    if (!r.parent.inlineContent)
      return V.near(r);
    let i = e.resolve(t.map(this.anchor));
    return new $(i.parent.inlineContent ? i : r, r);
  }
  replace(e, t = O.empty) {
    if (super.replace(e, t), t == O.empty) {
      let r = this.$from.marksAcross(this.$to);
      r && e.ensureMarks(r);
    }
  }
  eq(e) {
    return e instanceof $ && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Yr(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  static fromJSON(e, t) {
    if (typeof t.anchor != "number" || typeof t.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new $(e.resolve(t.anchor), e.resolve(t.head));
  }
  static create(e, t, r = t) {
    let i = e.resolve(t);
    return new this(i, r == t ? i : e.resolve(r));
  }
  static between(e, t, r) {
    let i = e.pos - t.pos;
    if ((!r || i) && (r = i >= 0 ? 1 : -1), !t.parent.inlineContent) {
      let s = V.findFrom(t, r, !0) || V.findFrom(t, -r, !0);
      if (s)
        t = s.$head;
      else
        return V.near(t, r);
    }
    return e.parent.inlineContent || (i == 0 ? e = t : (e = (V.findFrom(e, -r, !0) || V.findFrom(e, r, !0)).$anchor, e.pos < t.pos != i < 0 && (e = t))), new $(e, t);
  }
}
V.jsonID("text", $);
class Yr {
  constructor(e, t) {
    this.anchor = e, this.head = t;
  }
  map(e) {
    return new Yr(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return $.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class _ extends V {
  constructor(e) {
    let t = e.nodeAfter, r = e.node(0).resolve(e.pos + t.nodeSize);
    super(e, r), this.node = t;
  }
  map(e, t) {
    let { deleted: r, pos: i } = t.mapResult(this.anchor), s = e.resolve(i);
    return r ? V.near(s) : new _(s);
  }
  content() {
    return new O(k.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof _ && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new gs(this.anchor);
  }
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new _(e.resolve(t.anchor));
  }
  static create(e, t) {
    return new _(e.resolve(t));
  }
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
_.prototype.visible = !1;
V.jsonID("node", _);
class gs {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: r } = e.mapResult(this.anchor);
    return t ? new Yr(r, r) : new gs(r);
  }
  resolve(e) {
    let t = e.resolve(this.anchor), r = t.nodeAfter;
    return r && _.isSelectable(r) ? new _(t) : V.near(t);
  }
}
class Ve extends V {
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = O.empty) {
    if (t == O.empty) {
      e.delete(0, e.doc.content.size);
      let r = V.atStart(e.doc);
      r.eq(e.selection) || e.setSelection(r);
    } else
      super.replace(e, t);
  }
  toJSON() {
    return { type: "all" };
  }
  static fromJSON(e) {
    return new Ve(e);
  }
  map(e) {
    return new Ve(e);
  }
  eq(e) {
    return e instanceof Ve;
  }
  getBookmark() {
    return kc;
  }
}
V.jsonID("all", Ve);
const kc = {
  map() {
    return this;
  },
  resolve(n) {
    return new Ve(n);
  }
};
function Qt(n, e, t, r, i, s = !1) {
  if (e.inlineContent)
    return $.create(n, t);
  for (let o = r - (i > 0 ? 0 : 1); i > 0 ? o < e.childCount : o >= 0; o += i) {
    let l = e.child(o);
    if (l.isAtom) {
      if (!s && _.isSelectable(l))
        return _.create(n, t - (i < 0 ? l.nodeSize : 0));
    } else {
      let a = Qt(n, l, t + i, i < 0 ? l.childCount : 0, i, s);
      if (a)
        return a;
    }
    t += l.nodeSize * i;
  }
  return null;
}
function ao(n, e, t) {
  let r = n.steps.length - 1;
  if (r < e)
    return;
  let i = n.steps[r];
  if (!(i instanceof Ee || i instanceof le))
    return;
  let s = n.mapping.maps[r], o;
  s.forEach((l, a, c, u) => {
    o == null && (o = u);
  }), n.setSelection(V.near(n.doc.resolve(o), t));
}
const uo = 1, ir = 2, co = 4;
class Cc extends ql {
  constructor(e) {
    super(e.doc), this.curSelectionFor = 0, this.updated = 0, this.meta = /* @__PURE__ */ Object.create(null), this.time = Date.now(), this.curSelection = e.selection, this.storedMarks = e.storedMarks;
  }
  get selection() {
    return this.curSelectionFor < this.steps.length && (this.curSelection = this.curSelection.map(this.doc, this.mapping.slice(this.curSelectionFor)), this.curSelectionFor = this.steps.length), this.curSelection;
  }
  setSelection(e) {
    if (e.$from.doc != this.doc)
      throw new RangeError("Selection passed to setSelection must point at the current document");
    return this.curSelection = e, this.curSelectionFor = this.steps.length, this.updated = (this.updated | uo) & ~ir, this.storedMarks = null, this;
  }
  get selectionSet() {
    return (this.updated & uo) > 0;
  }
  setStoredMarks(e) {
    return this.storedMarks = e, this.updated |= ir, this;
  }
  ensureMarks(e) {
    return J.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this;
  }
  addStoredMark(e) {
    return this.ensureMarks(e.addToSet(this.storedMarks || this.selection.$head.marks()));
  }
  removeStoredMark(e) {
    return this.ensureMarks(e.removeFromSet(this.storedMarks || this.selection.$head.marks()));
  }
  get storedMarksSet() {
    return (this.updated & ir) > 0;
  }
  addStep(e, t) {
    super.addStep(e, t), this.updated = this.updated & ~ir, this.storedMarks = null;
  }
  setTime(e) {
    return this.time = e, this;
  }
  replaceSelection(e) {
    return this.selection.replace(this, e), this;
  }
  replaceSelectionWith(e, t = !0) {
    let r = this.selection;
    return t && (e = e.mark(this.storedMarks || (r.empty ? r.$from.marks() : r.$from.marksAcross(r.$to) || J.none))), r.replaceWith(this, e), this;
  }
  deleteSelection() {
    return this.selection.replace(this), this;
  }
  insertText(e, t, r) {
    let i = this.doc.type.schema;
    if (t == null)
      return e ? this.replaceSelectionWith(i.text(e), !0) : this.deleteSelection();
    {
      if (r == null && (r = t), r = r == null ? t : r, !e)
        return this.deleteRange(t, r);
      let s = this.storedMarks;
      if (!s) {
        let o = this.doc.resolve(t);
        s = r == t ? o.marks() : o.marksAcross(this.doc.resolve(r));
      }
      return this.replaceRangeWith(t, r, i.text(e, s)), this.selection.empty || this.setSelection(V.near(this.selection.$to)), this;
    }
  }
  setMeta(e, t) {
    return this.meta[typeof e == "string" ? e : e.key] = t, this;
  }
  getMeta(e) {
    return this.meta[typeof e == "string" ? e : e.key];
  }
  get isGeneric() {
    for (let e in this.meta)
      return !1;
    return !0;
  }
  scrollIntoView() {
    return this.updated |= co, this;
  }
  get scrolledIntoView() {
    return (this.updated & co) > 0;
  }
}
function ho(n, e) {
  return !e || !n ? n : n.bind(e);
}
class Nn {
  constructor(e, t, r) {
    this.name = e, this.init = ho(t.init, r), this.apply = ho(t.apply, r);
  }
}
const Sc = [
  new Nn("doc", {
    init(n) {
      return n.doc || n.schema.topNodeType.createAndFill();
    },
    apply(n) {
      return n.doc;
    }
  }),
  new Nn("selection", {
    init(n, e) {
      return n.selection || V.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    }
  }),
  new Nn("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, r) {
      return r.selection.$cursor ? n.storedMarks : null;
    }
  }),
  new Nn("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    }
  })
];
class wi {
  constructor(e, t) {
    this.schema = e, this.plugins = [], this.pluginsByKey = /* @__PURE__ */ Object.create(null), this.fields = Sc.slice(), t && t.forEach((r) => {
      if (this.pluginsByKey[r.key])
        throw new RangeError("Adding different instances of a keyed plugin (" + r.key + ")");
      this.plugins.push(r), this.pluginsByKey[r.key] = r, r.spec.state && this.fields.push(new Nn(r.key, r.spec.state, r));
    });
  }
}
class en {
  constructor(e) {
    this.config = e;
  }
  get schema() {
    return this.config.schema;
  }
  get plugins() {
    return this.config.plugins;
  }
  apply(e) {
    return this.applyTransaction(e).state;
  }
  filterTransaction(e, t = -1) {
    for (let r = 0; r < this.config.plugins.length; r++)
      if (r != t) {
        let i = this.config.plugins[r];
        if (i.spec.filterTransaction && !i.spec.filterTransaction.call(i, e, this))
          return !1;
      }
    return !0;
  }
  applyTransaction(e) {
    if (!this.filterTransaction(e))
      return { state: this, transactions: [] };
    let t = [e], r = this.applyInner(e), i = null;
    for (; ; ) {
      let s = !1;
      for (let o = 0; o < this.config.plugins.length; o++) {
        let l = this.config.plugins[o];
        if (l.spec.appendTransaction) {
          let a = i ? i[o].n : 0, c = i ? i[o].state : this, u = a < t.length && l.spec.appendTransaction.call(l, a ? t.slice(a) : t, c, r);
          if (u && r.filterTransaction(u, o)) {
            if (u.setMeta("appendedTransaction", e), !i) {
              i = [];
              for (let d = 0; d < this.config.plugins.length; d++)
                i.push(d < o ? { state: r, n: t.length } : { state: this, n: 0 });
            }
            t.push(u), r = r.applyInner(u), s = !0;
          }
          i && (i[o] = { state: r, n: t.length });
        }
      }
      if (!s)
        return { state: r, transactions: t };
    }
  }
  applyInner(e) {
    if (!e.before.eq(this.doc))
      throw new RangeError("Applying a mismatched transaction");
    let t = new en(this.config), r = this.config.fields;
    for (let i = 0; i < r.length; i++) {
      let s = r[i];
      t[s.name] = s.apply(e, this[s.name], this, t);
    }
    return t;
  }
  get tr() {
    return new Cc(this);
  }
  static create(e) {
    let t = new wi(e.doc ? e.doc.type.schema : e.schema, e.plugins), r = new en(t);
    for (let i = 0; i < t.fields.length; i++)
      r[t.fields[i].name] = t.fields[i].init(e, r);
    return r;
  }
  reconfigure(e) {
    let t = new wi(this.schema, e.plugins), r = t.fields, i = new en(t);
    for (let s = 0; s < r.length; s++) {
      let o = r[s].name;
      i[o] = this.hasOwnProperty(o) ? this[o] : r[s].init(e, i);
    }
    return i;
  }
  toJSON(e) {
    let t = { doc: this.doc.toJSON(), selection: this.selection.toJSON() };
    if (this.storedMarks && (t.storedMarks = this.storedMarks.map((r) => r.toJSON())), e && typeof e == "object")
      for (let r in e) {
        if (r == "doc" || r == "selection")
          throw new RangeError("The JSON fields `doc` and `selection` are reserved");
        let i = e[r], s = i.spec.state;
        s && s.toJSON && (t[r] = s.toJSON.call(i, this[i.key]));
      }
    return t;
  }
  static fromJSON(e, t, r) {
    if (!t)
      throw new RangeError("Invalid input for EditorState.fromJSON");
    if (!e.schema)
      throw new RangeError("Required config field 'schema' missing");
    let i = new wi(e.schema, e.plugins), s = new en(i);
    return i.fields.forEach((o) => {
      if (o.name == "doc")
        s.doc = Xe.fromJSON(e.schema, t.doc);
      else if (o.name == "selection")
        s.selection = V.fromJSON(s.doc, t.selection);
      else if (o.name == "storedMarks")
        t.storedMarks && (s.storedMarks = t.storedMarks.map(e.schema.markFromJSON));
      else {
        if (r)
          for (let l in r) {
            let a = r[l], c = a.spec.state;
            if (a.key == o.name && c && c.fromJSON && Object.prototype.hasOwnProperty.call(t, l)) {
              s[o.name] = c.fromJSON.call(a, e, t[l], s);
              return;
            }
          }
        s[o.name] = o.init(e, s);
      }
    }), s;
  }
}
function Jl(n, e, t) {
  for (let r in n) {
    let i = n[r];
    i instanceof Function ? i = i.bind(e) : r == "handleDOMEvents" && (i = Jl(i, e, {})), t[r] = i;
  }
  return t;
}
class ye {
  constructor(e) {
    this.spec = e, this.props = {}, e.props && Jl(e.props, this, this.props), this.key = e.key ? e.key.key : Gl("plugin");
  }
  getState(e) {
    return e[this.key];
  }
}
const Mi = /* @__PURE__ */ Object.create(null);
function Gl(n) {
  return n in Mi ? n + "$" + ++Mi[n] : (Mi[n] = 0, n + "$");
}
class Oe {
  constructor(e = "key") {
    this.key = Gl(e);
  }
  get(e) {
    return e.config.pluginsByKey[this.key];
  }
  getState(e) {
    return e[this.key];
  }
}
const Dt = typeof navigator < "u" ? navigator : null, fo = typeof document < "u" ? document : null, St = Dt && Dt.userAgent || "", qi = /Edge\/(\d+)/.exec(St), Yl = /MSIE \d/.exec(St), Ji = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(St), Re = !!(Yl || Ji || qi), mt = Yl ? document.documentMode : Ji ? +Ji[1] : qi ? +qi[1] : 0, Qe = !Re && /gecko\/(\d+)/i.test(St);
Qe && +(/Firefox\/(\d+)/.exec(St) || [0, 0])[1];
const Gi = !Re && /Chrome\/(\d+)/.exec(St), Ce = !!Gi, Ac = Gi ? +Gi[1] : 0, Me = !Re && !!Dt && /Apple Computer/.test(Dt.vendor), gn = Me && (/Mobile\/\w+/.test(St) || !!Dt && Dt.maxTouchPoints > 2), Pe = gn || (Dt ? /Mac/.test(Dt.platform) : !1), qe = /Android \d/.test(St), Xr = !!fo && "webkitFontSmoothing" in fo.documentElement.style, wc = Xr ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0, Ne = function(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}, ms = function(n) {
  let e = n.assignedSlot || n.parentNode;
  return e && e.nodeType == 11 ? e.host : e;
};
let po = null;
const rt = function(n, e, t) {
  let r = po || (po = document.createRange());
  return r.setEnd(n, t == null ? n.nodeValue.length : t), r.setStart(n, e || 0), r;
}, jn = function(n, e, t, r) {
  return t && (go(n, e, t, r, -1) || go(n, e, t, r, 1));
}, Mc = /^(img|br|input|textarea|hr)$/i;
function go(n, e, t, r, i) {
  for (; ; ) {
    if (n == t && e == r)
      return !0;
    if (e == (i < 0 ? 0 : Je(n))) {
      let s = n.parentNode;
      if (!s || s.nodeType != 1 || Oc(n) || Mc.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      e = Ne(n) + (i < 0 ? 0 : 1), n = s;
    } else if (n.nodeType == 1) {
      if (n = n.childNodes[e + (i < 0 ? -1 : 0)], n.contentEditable == "false")
        return !1;
      e = i < 0 ? Je(n) : 0;
    } else
      return !1;
  }
}
function Je(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Tc(n, e, t) {
  for (let r = e == 0, i = e == Je(n); r || i; ) {
    if (n == t)
      return !0;
    let s = Ne(n);
    if (n = n.parentNode, !n)
      return !1;
    r = r && s == 0, i = i && s == Je(n);
  }
}
function Oc(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode)
    ;
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const ys = function(n) {
  let e = n.isCollapsed;
  return e && Ce && n.rangeCount && !n.getRangeAt(0).collapsed && (e = !1), e;
};
function tn(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), t.keyCode = n, t.key = t.code = e, t;
}
function vc(n) {
  return {
    left: 0,
    right: n.documentElement.clientWidth,
    top: 0,
    bottom: n.documentElement.clientHeight
  };
}
function lt(n, e) {
  return typeof n == "number" ? n : n[e];
}
function Nc(n) {
  let e = n.getBoundingClientRect(), t = e.width / n.offsetWidth || 1, r = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * r
  };
}
function mo(n, e, t) {
  let r = n.someProp("scrollThreshold") || 0, i = n.someProp("scrollMargin") || 5, s = n.dom.ownerDocument;
  for (let o = t || n.dom; o; o = ms(o)) {
    if (o.nodeType != 1)
      continue;
    let l = o, a = l == s.body, c = a ? vc(s) : Nc(l), u = 0, d = 0;
    if (e.top < c.top + lt(r, "top") ? d = -(c.top - e.top + lt(i, "top")) : e.bottom > c.bottom - lt(r, "bottom") && (d = e.bottom - c.bottom + lt(i, "bottom")), e.left < c.left + lt(r, "left") ? u = -(c.left - e.left + lt(i, "left")) : e.right > c.right - lt(r, "right") && (u = e.right - c.right + lt(i, "right")), u || d)
      if (a)
        s.defaultView.scrollBy(u, d);
      else {
        let h = l.scrollLeft, f = l.scrollTop;
        d && (l.scrollTop += d), u && (l.scrollLeft += u);
        let p = l.scrollLeft - h, g = l.scrollTop - f;
        e = { left: e.left - p, top: e.top - g, right: e.right - p, bottom: e.bottom - g };
      }
    if (a)
      break;
  }
}
function Fc(n) {
  let e = n.dom.getBoundingClientRect(), t = Math.max(0, e.top), r, i;
  for (let s = (e.left + e.right) / 2, o = t + 1; o < Math.min(innerHeight, e.bottom); o += 5) {
    let l = n.root.elementFromPoint(s, o);
    if (!l || l == n.dom || !n.dom.contains(l))
      continue;
    let a = l.getBoundingClientRect();
    if (a.top >= t - 20) {
      r = l, i = a.top;
      break;
    }
  }
  return { refDOM: r, refTop: i, stack: Xl(n.dom) };
}
function Xl(n) {
  let e = [], t = n.ownerDocument;
  for (let r = n; r && (e.push({ dom: r, top: r.scrollTop, left: r.scrollLeft }), n != t); r = ms(r))
    ;
  return e;
}
function Rc({ refDOM: n, refTop: e, stack: t }) {
  let r = n ? n.getBoundingClientRect().top : 0;
  Ql(t, r == 0 ? 0 : r - e);
}
function Ql(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: r, top: i, left: s } = n[t];
    r.scrollTop != i + e && (r.scrollTop = i + e), r.scrollLeft != s && (r.scrollLeft = s);
  }
}
let Gt = null;
function Bc(n) {
  if (n.setActive)
    return n.setActive();
  if (Gt)
    return n.focus(Gt);
  let e = Xl(n);
  n.focus(Gt == null ? {
    get preventScroll() {
      return Gt = { preventScroll: !0 }, !0;
    }
  } : void 0), Gt || (Gt = !1, Ql(e, 0));
}
function Zl(n, e) {
  let t, r = 2e8, i, s = 0, o = e.top, l = e.top;
  for (let a = n.firstChild, c = 0; a; a = a.nextSibling, c++) {
    let u;
    if (a.nodeType == 1)
      u = a.getClientRects();
    else if (a.nodeType == 3)
      u = rt(a).getClientRects();
    else
      continue;
    for (let d = 0; d < u.length; d++) {
      let h = u[d];
      if (h.top <= o && h.bottom >= l) {
        o = Math.max(h.bottom, o), l = Math.min(h.top, l);
        let f = h.left > e.left ? h.left - e.left : h.right < e.left ? e.left - h.right : 0;
        if (f < r) {
          t = a, r = f, i = f && t.nodeType == 3 ? {
            left: h.right < e.left ? h.right : h.left,
            top: e.top
          } : e, a.nodeType == 1 && f && (s = c + (e.left >= (h.left + h.right) / 2 ? 1 : 0));
          continue;
        }
      }
      !t && (e.left >= h.right && e.top >= h.top || e.left >= h.left && e.top >= h.bottom) && (s = c + 1);
    }
  }
  return t && t.nodeType == 3 ? Ic(t, i) : !t || r && t.nodeType == 1 ? { node: n, offset: s } : Zl(t, i);
}
function Ic(n, e) {
  let t = n.nodeValue.length, r = document.createRange();
  for (let i = 0; i < t; i++) {
    r.setEnd(n, i + 1), r.setStart(n, i);
    let s = at(r, 1);
    if (s.top != s.bottom && bs(e, s))
      return { node: n, offset: i + (e.left >= (s.left + s.right) / 2 ? 1 : 0) };
  }
  return { node: n, offset: 0 };
}
function bs(n, e) {
  return n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1;
}
function Pc(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function Lc(n, e, t) {
  let { node: r, offset: i } = Zl(e, t), s = -1;
  if (r.nodeType == 1 && !r.firstChild) {
    let o = r.getBoundingClientRect();
    s = o.left != o.right && t.left > (o.left + o.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(r, i, s);
}
function _c(n, e, t, r) {
  let i = -1;
  for (let s = e; s != n.dom; ) {
    let o = n.docView.nearestDesc(s, !0);
    if (!o)
      return null;
    if (o.node.isBlock && o.parent) {
      let l = o.dom.getBoundingClientRect();
      if (l.left > r.left || l.top > r.top)
        i = o.posBefore;
      else if (l.right < r.left || l.bottom < r.top)
        i = o.posAfter;
      else
        break;
    }
    s = o.dom.parentNode;
  }
  return i > -1 ? i : n.docView.posFromDOM(e, t, 1);
}
function ea(n, e, t) {
  let r = n.childNodes.length;
  if (r && t.top < t.bottom)
    for (let i = Math.max(0, Math.min(r - 1, Math.floor(r * (e.top - t.top) / (t.bottom - t.top)) - 2)), s = i; ; ) {
      let o = n.childNodes[s];
      if (o.nodeType == 1) {
        let l = o.getClientRects();
        for (let a = 0; a < l.length; a++) {
          let c = l[a];
          if (bs(e, c))
            return ea(o, e, c);
        }
      }
      if ((s = (s + 1) % r) == i)
        break;
    }
  return n;
}
function zc(n, e) {
  let t = n.dom.ownerDocument, r, i = 0;
  if (t.caretPositionFromPoint)
    try {
      let a = t.caretPositionFromPoint(e.left, e.top);
      a && ({ offsetNode: r, offset: i } = a);
    } catch {
    }
  if (!r && t.caretRangeFromPoint) {
    let a = t.caretRangeFromPoint(e.left, e.top);
    a && ({ startContainer: r, startOffset: i } = a);
  }
  let s = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top + 1), o;
  if (!s || !n.dom.contains(s.nodeType != 1 ? s.parentNode : s)) {
    let a = n.dom.getBoundingClientRect();
    if (!bs(e, a) || (s = ea(n.dom, e, a), !s))
      return null;
  }
  if (Me)
    for (let a = s; r && a; a = ms(a))
      a.draggable && (r = void 0);
  if (s = Pc(s, e), r) {
    if (Qe && r.nodeType == 1 && (i = Math.min(i, r.childNodes.length), i < r.childNodes.length)) {
      let a = r.childNodes[i], c;
      a.nodeName == "IMG" && (c = a.getBoundingClientRect()).right <= e.left && c.bottom > e.top && i++;
    }
    r == n.dom && i == r.childNodes.length - 1 && r.lastChild.nodeType == 1 && e.top > r.lastChild.getBoundingClientRect().bottom ? o = n.state.doc.content.size : (i == 0 || r.nodeType != 1 || r.childNodes[i - 1].nodeName != "BR") && (o = _c(n, r, i, e));
  }
  o == null && (o = Lc(n, s, e));
  let l = n.docView.nearestDesc(s, !0);
  return { pos: o, inside: l ? l.posAtStart - l.border : -1 };
}
function at(n, e) {
  let t = n.getClientRects();
  return t.length ? t[e < 0 ? 0 : t.length - 1] : n.getBoundingClientRect();
}
const Hc = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function ta(n, e, t) {
  let { node: r, offset: i } = n.docView.domFromPos(e, t < 0 ? -1 : 1), s = Xr || Qe;
  if (r.nodeType == 3)
    if (s && (Hc.test(r.nodeValue) || (t < 0 ? !i : i == r.nodeValue.length))) {
      let o = at(rt(r, i, i), t);
      if (Qe && i && /\s/.test(r.nodeValue[i - 1]) && i < r.nodeValue.length) {
        let l = at(rt(r, i - 1, i - 1), -1);
        if (l.top == o.top) {
          let a = at(rt(r, i, i + 1), -1);
          if (a.top != o.top)
            return Sn(a, a.left < l.left);
        }
      }
      return o;
    } else {
      let o = i, l = i, a = t < 0 ? 1 : -1;
      return t < 0 && !i ? (l++, a = -1) : t >= 0 && i == r.nodeValue.length ? (o--, a = 1) : t < 0 ? o-- : l++, Sn(at(rt(r, o, l), a), a < 0);
    }
  if (!n.state.doc.resolve(e).parent.inlineContent) {
    if (i && (t < 0 || i == Je(r))) {
      let o = r.childNodes[i - 1];
      if (o.nodeType == 1)
        return Ti(o.getBoundingClientRect(), !1);
    }
    if (i < Je(r)) {
      let o = r.childNodes[i];
      if (o.nodeType == 1)
        return Ti(o.getBoundingClientRect(), !0);
    }
    return Ti(r.getBoundingClientRect(), t >= 0);
  }
  if (i && (t < 0 || i == Je(r))) {
    let o = r.childNodes[i - 1], l = o.nodeType == 3 ? rt(o, Je(o) - (s ? 0 : 1)) : o.nodeType == 1 && (o.nodeName != "BR" || !o.nextSibling) ? o : null;
    if (l)
      return Sn(at(l, 1), !1);
  }
  if (i < Je(r)) {
    let o = r.childNodes[i];
    for (; o.pmViewDesc && o.pmViewDesc.ignoreForCoords; )
      o = o.nextSibling;
    let l = o ? o.nodeType == 3 ? rt(o, 0, s ? 0 : 1) : o.nodeType == 1 ? o : null : null;
    if (l)
      return Sn(at(l, -1), !0);
  }
  return Sn(at(r.nodeType == 3 ? rt(r) : r, -t), t >= 0);
}
function Sn(n, e) {
  if (n.width == 0)
    return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function Ti(n, e) {
  if (n.height == 0)
    return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function na(n, e, t) {
  let r = n.state, i = n.root.activeElement;
  r != e && n.updateState(e), i != n.dom && n.focus();
  try {
    return t();
  } finally {
    r != e && n.updateState(r), i != n.dom && i && i.focus();
  }
}
function $c(n, e, t) {
  let r = e.selection, i = t == "up" ? r.$from : r.$to;
  return na(n, e, () => {
    let { node: s } = n.docView.domFromPos(i.pos, t == "up" ? -1 : 1);
    for (; ; ) {
      let l = n.docView.nearestDesc(s, !0);
      if (!l)
        break;
      if (l.node.isBlock) {
        s = l.dom;
        break;
      }
      s = l.dom.parentNode;
    }
    let o = ta(n, i.pos, 1);
    for (let l = s.firstChild; l; l = l.nextSibling) {
      let a;
      if (l.nodeType == 1)
        a = l.getClientRects();
      else if (l.nodeType == 3)
        a = rt(l, 0, l.nodeValue.length).getClientRects();
      else
        continue;
      for (let c = 0; c < a.length; c++) {
        let u = a[c];
        if (u.bottom > u.top + 1 && (t == "up" ? o.top - u.top > (u.bottom - o.top) * 2 : u.bottom - o.bottom > (o.bottom - u.top) * 2))
          return !1;
      }
    }
    return !0;
  });
}
const jc = /[\u0590-\u08ac]/;
function Vc(n, e, t) {
  let { $head: r } = e.selection;
  if (!r.parent.isTextblock)
    return !1;
  let i = r.parentOffset, s = !i, o = i == r.parent.content.size, l = n.domSelection();
  return !jc.test(r.parent.textContent) || !l.modify ? t == "left" || t == "backward" ? s : o : na(n, e, () => {
    let a = l.getRangeAt(0), c = l.focusNode, u = l.focusOffset, d = l.caretBidiLevel;
    l.modify("move", t, "character");
    let f = !(r.depth ? n.docView.domAfterPos(r.before()) : n.dom).contains(l.focusNode.nodeType == 1 ? l.focusNode : l.focusNode.parentNode) || c == l.focusNode && u == l.focusOffset;
    return l.removeAllRanges(), l.addRange(a), d != null && (l.caretBidiLevel = d), f;
  });
}
let yo = null, bo = null, Do = !1;
function Uc(n, e, t) {
  return yo == e && bo == t ? Do : (yo = e, bo = t, Do = t == "up" || t == "down" ? $c(n, e, t) : Vc(n, e, t));
}
const Ue = 0, Eo = 1, nn = 2, Ze = 3;
class Qn {
  constructor(e, t, r, i) {
    this.parent = e, this.children = t, this.dom = r, this.contentDOM = i, this.dirty = Ue, r.pmViewDesc = this;
  }
  matchesWidget(e) {
    return !1;
  }
  matchesMark(e) {
    return !1;
  }
  matchesNode(e, t, r) {
    return !1;
  }
  matchesHack(e) {
    return !1;
  }
  parseRule() {
    return null;
  }
  stopEvent(e) {
    return !1;
  }
  get size() {
    let e = 0;
    for (let t = 0; t < this.children.length; t++)
      e += this.children[t].size;
    return e;
  }
  get border() {
    return 0;
  }
  destroy() {
    this.parent = void 0, this.dom.pmViewDesc == this && (this.dom.pmViewDesc = void 0);
    for (let e = 0; e < this.children.length; e++)
      this.children[e].destroy();
  }
  posBeforeChild(e) {
    for (let t = 0, r = this.posAtStart; ; t++) {
      let i = this.children[t];
      if (i == e)
        return r;
      r += i.size;
    }
  }
  get posBefore() {
    return this.parent.posBeforeChild(this);
  }
  get posAtStart() {
    return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
  }
  get posAfter() {
    return this.posBefore + this.size;
  }
  get posAtEnd() {
    return this.posAtStart + this.size - 2 * this.border;
  }
  localPosFromDOM(e, t, r) {
    if (this.contentDOM && this.contentDOM.contains(e.nodeType == 1 ? e : e.parentNode))
      if (r < 0) {
        let s, o;
        if (e == this.contentDOM)
          s = e.childNodes[t - 1];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          s = e.previousSibling;
        }
        for (; s && !((o = s.pmViewDesc) && o.parent == this); )
          s = s.previousSibling;
        return s ? this.posBeforeChild(o) + o.size : this.posAtStart;
      } else {
        let s, o;
        if (e == this.contentDOM)
          s = e.childNodes[t];
        else {
          for (; e.parentNode != this.contentDOM; )
            e = e.parentNode;
          s = e.nextSibling;
        }
        for (; s && !((o = s.pmViewDesc) && o.parent == this); )
          s = s.nextSibling;
        return s ? this.posBeforeChild(o) : this.posAtEnd;
      }
    let i;
    if (e == this.dom && this.contentDOM)
      i = t > Ne(this.contentDOM);
    else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM))
      i = e.compareDocumentPosition(this.contentDOM) & 2;
    else if (this.dom.firstChild) {
      if (t == 0)
        for (let s = e; ; s = s.parentNode) {
          if (s == this.dom) {
            i = !1;
            break;
          }
          if (s.previousSibling)
            break;
        }
      if (i == null && t == e.childNodes.length)
        for (let s = e; ; s = s.parentNode) {
          if (s == this.dom) {
            i = !0;
            break;
          }
          if (s.nextSibling)
            break;
        }
    }
    return (i == null ? r > 0 : i) ? this.posAtEnd : this.posAtStart;
  }
  nearestDesc(e, t = !1) {
    for (let r = !0, i = e; i; i = i.parentNode) {
      let s = this.getDesc(i), o;
      if (s && (!t || s.node))
        if (r && (o = s.nodeDOM) && !(o.nodeType == 1 ? o.contains(e.nodeType == 1 ? e : e.parentNode) : o == e))
          r = !1;
        else
          return s;
    }
  }
  getDesc(e) {
    let t = e.pmViewDesc;
    for (let r = t; r; r = r.parent)
      if (r == this)
        return t;
  }
  posFromDOM(e, t, r) {
    for (let i = e; i; i = i.parentNode) {
      let s = this.getDesc(i);
      if (s)
        return s.localPosFromDOM(e, t, r);
    }
    return -1;
  }
  descAt(e) {
    for (let t = 0, r = 0; t < this.children.length; t++) {
      let i = this.children[t], s = r + i.size;
      if (r == e && s != r) {
        for (; !i.border && i.children.length; )
          i = i.children[0];
        return i;
      }
      if (e < s)
        return i.descAt(e - r - i.border);
      r = s;
    }
  }
  domFromPos(e, t) {
    if (!this.contentDOM)
      return { node: this.dom, offset: 0 };
    let r = 0, i = 0;
    for (let s = 0; r < this.children.length; r++) {
      let o = this.children[r], l = s + o.size;
      if (l > e || o instanceof ia) {
        i = e - s;
        break;
      }
      s = l;
    }
    if (i)
      return this.children[r].domFromPos(i - this.children[r].border, t);
    for (let s; r && !(s = this.children[r - 1]).size && s instanceof ra && s.side >= 0; r--)
      ;
    if (t <= 0) {
      let s, o = !0;
      for (; s = r ? this.children[r - 1] : null, !(!s || s.dom.parentNode == this.contentDOM); r--, o = !1)
        ;
      return s && t && o && !s.border && !s.domAtom ? s.domFromPos(s.size, t) : { node: this.contentDOM, offset: s ? Ne(s.dom) + 1 : 0 };
    } else {
      let s, o = !0;
      for (; s = r < this.children.length ? this.children[r] : null, !(!s || s.dom.parentNode == this.contentDOM); r++, o = !1)
        ;
      return s && o && !s.border && !s.domAtom ? s.domFromPos(0, t) : { node: this.contentDOM, offset: s ? Ne(s.dom) : this.contentDOM.childNodes.length };
    }
  }
  parseRange(e, t, r = 0) {
    if (this.children.length == 0)
      return { node: this.contentDOM, from: e, to: t, fromOffset: 0, toOffset: this.contentDOM.childNodes.length };
    let i = -1, s = -1;
    for (let o = r, l = 0; ; l++) {
      let a = this.children[l], c = o + a.size;
      if (i == -1 && e <= c) {
        let u = o + a.border;
        if (e >= u && t <= c - a.border && a.node && a.contentDOM && this.contentDOM.contains(a.contentDOM))
          return a.parseRange(e, t, u);
        e = o;
        for (let d = l; d > 0; d--) {
          let h = this.children[d - 1];
          if (h.size && h.dom.parentNode == this.contentDOM && !h.emptyChildAt(1)) {
            i = Ne(h.dom) + 1;
            break;
          }
          e -= h.size;
        }
        i == -1 && (i = 0);
      }
      if (i > -1 && (c > t || l == this.children.length - 1)) {
        t = c;
        for (let u = l + 1; u < this.children.length; u++) {
          let d = this.children[u];
          if (d.size && d.dom.parentNode == this.contentDOM && !d.emptyChildAt(-1)) {
            s = Ne(d.dom);
            break;
          }
          t += d.size;
        }
        s == -1 && (s = this.contentDOM.childNodes.length);
        break;
      }
      o = c;
    }
    return { node: this.contentDOM, from: e, to: t, fromOffset: i, toOffset: s };
  }
  emptyChildAt(e) {
    if (this.border || !this.contentDOM || !this.children.length)
      return !1;
    let t = this.children[e < 0 ? 0 : this.children.length - 1];
    return t.size == 0 || t.emptyChildAt(e);
  }
  domAfterPos(e) {
    let { node: t, offset: r } = this.domFromPos(e, 0);
    if (t.nodeType != 1 || r == t.childNodes.length)
      throw new RangeError("No node after pos " + e);
    return t.childNodes[r];
  }
  setSelection(e, t, r, i = !1) {
    let s = Math.min(e, t), o = Math.max(e, t);
    for (let h = 0, f = 0; h < this.children.length; h++) {
      let p = this.children[h], g = f + p.size;
      if (s > f && o < g)
        return p.setSelection(e - f - p.border, t - f - p.border, r, i);
      f = g;
    }
    let l = this.domFromPos(e, e ? -1 : 1), a = t == e ? l : this.domFromPos(t, t ? -1 : 1), c = r.getSelection(), u = !1;
    if ((Qe || Me) && e == t) {
      let { node: h, offset: f } = l;
      if (h.nodeType == 3) {
        if (u = !!(f && h.nodeValue[f - 1] == `
`), u && f == h.nodeValue.length)
          for (let p = h, g; p; p = p.parentNode) {
            if (g = p.nextSibling) {
              g.nodeName == "BR" && (l = a = { node: g.parentNode, offset: Ne(g) + 1 });
              break;
            }
            let y = p.pmViewDesc;
            if (y && y.node && y.node.isBlock)
              break;
          }
      } else {
        let p = h.childNodes[f - 1];
        u = p && (p.nodeName == "BR" || p.contentEditable == "false");
      }
    }
    if (Qe && c.focusNode && c.focusNode != a.node && c.focusNode.nodeType == 1) {
      let h = c.focusNode.childNodes[c.focusOffset];
      h && h.contentEditable == "false" && (i = !0);
    }
    if (!(i || u && Me) && jn(l.node, l.offset, c.anchorNode, c.anchorOffset) && jn(a.node, a.offset, c.focusNode, c.focusOffset))
      return;
    let d = !1;
    if ((c.extend || e == t) && !u) {
      c.collapse(l.node, l.offset);
      try {
        e != t && c.extend(a.node, a.offset), d = !0;
      } catch (h) {
        if (!(h instanceof DOMException))
          throw h;
      }
    }
    if (!d) {
      if (e > t) {
        let f = l;
        l = a, a = f;
      }
      let h = document.createRange();
      h.setEnd(a.node, a.offset), h.setStart(l.node, l.offset), c.removeAllRanges(), c.addRange(h);
    }
  }
  ignoreMutation(e) {
    return !this.contentDOM && e.type != "selection";
  }
  get contentLost() {
    return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
  }
  markDirty(e, t) {
    for (let r = 0, i = 0; i < this.children.length; i++) {
      let s = this.children[i], o = r + s.size;
      if (r == o ? e <= o && t >= r : e < o && t > r) {
        let l = r + s.border, a = o - s.border;
        if (e >= l && t <= a) {
          this.dirty = e == r || t == o ? nn : Eo, e == l && t == a && (s.contentLost || s.dom.parentNode != this.contentDOM) ? s.dirty = Ze : s.markDirty(e - l, t - l);
          return;
        } else
          s.dirty = s.dom == s.contentDOM && s.dom.parentNode == this.contentDOM && !s.children.length ? nn : Ze;
      }
      r = o;
    }
    this.dirty = nn;
  }
  markParentsDirty() {
    let e = 1;
    for (let t = this.parent; t; t = t.parent, e++) {
      let r = e == 1 ? nn : Eo;
      t.dirty < r && (t.dirty = r);
    }
  }
  get domAtom() {
    return !1;
  }
  get ignoreForCoords() {
    return !1;
  }
}
class ra extends Qn {
  constructor(e, t, r, i) {
    let s, o = t.type.toDOM;
    if (typeof o == "function" && (o = o(r, () => {
      if (!s)
        return i;
      if (s.parent)
        return s.parent.posBeforeChild(s);
    })), !t.type.spec.raw) {
      if (o.nodeType != 1) {
        let l = document.createElement("span");
        l.appendChild(o), o = l;
      }
      o.contentEditable = "false", o.classList.add("ProseMirror-widget");
    }
    super(e, [], o, null), this.widget = t, this.widget = t, s = this;
  }
  matchesWidget(e) {
    return this.dirty == Ue && e.type.eq(this.widget.type);
  }
  parseRule() {
    return { ignore: !0 };
  }
  stopEvent(e) {
    let t = this.widget.spec.stopEvent;
    return t ? t(e) : !1;
  }
  ignoreMutation(e) {
    return e.type != "selection" || this.widget.spec.ignoreSelection;
  }
  destroy() {
    this.widget.type.destroy(this.dom), super.destroy();
  }
  get domAtom() {
    return !0;
  }
  get side() {
    return this.widget.type.side;
  }
}
class Kc extends Qn {
  constructor(e, t, r, i) {
    super(e, [], t, null), this.textDOM = r, this.text = i;
  }
  get size() {
    return this.text.length;
  }
  localPosFromDOM(e, t) {
    return e != this.textDOM ? this.posAtStart + (t ? this.size : 0) : this.posAtStart + t;
  }
  domFromPos(e) {
    return { node: this.textDOM, offset: e };
  }
  ignoreMutation(e) {
    return e.type === "characterData" && e.target.nodeValue == e.oldValue;
  }
}
class Vt extends Qn {
  constructor(e, t, r, i) {
    super(e, [], r, i), this.mark = t;
  }
  static create(e, t, r, i) {
    let s = i.nodeViews[t.type.name], o = s && s(t, i, r);
    return (!o || !o.dom) && (o = Ge.renderSpec(document, t.type.spec.toDOM(t, r))), new Vt(e, t, o.dom, o.contentDOM || o.dom);
  }
  parseRule() {
    return this.dirty & Ze || this.mark.type.spec.reparseInView ? null : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM || void 0 };
  }
  matchesMark(e) {
    return this.dirty != Ze && this.mark.eq(e);
  }
  markDirty(e, t) {
    if (super.markDirty(e, t), this.dirty != Ue) {
      let r = this.parent;
      for (; !r.node; )
        r = r.parent;
      r.dirty < this.dirty && (r.dirty = this.dirty), this.dirty = Ue;
    }
  }
  slice(e, t, r) {
    let i = Vt.create(this.parent, this.mark, !0, r), s = this.children, o = this.size;
    t < o && (s = Qi(s, t, o, r)), e > 0 && (s = Qi(s, 0, e, r));
    for (let l = 0; l < s.length; l++)
      s[l].parent = i;
    return i.children = s, i;
  }
}
class Ut extends Qn {
  constructor(e, t, r, i, s, o, l, a, c) {
    super(e, [], s, o), this.node = t, this.outerDeco = r, this.innerDeco = i, this.nodeDOM = l, o && this.updateChildren(a, c);
  }
  static create(e, t, r, i, s, o) {
    let l = s.nodeViews[t.type.name], a, c = l && l(t, s, () => {
      if (!a)
        return o;
      if (a.parent)
        return a.parent.posBeforeChild(a);
    }, r, i), u = c && c.dom, d = c && c.contentDOM;
    if (t.isText) {
      if (!u)
        u = document.createTextNode(t.text);
      else if (u.nodeType != 3)
        throw new RangeError("Text must be rendered as a DOM text node");
    } else
      u || ({ dom: u, contentDOM: d } = Ge.renderSpec(document, t.type.spec.toDOM(t)));
    !d && !t.isText && u.nodeName != "BR" && (u.hasAttribute("contenteditable") || (u.contentEditable = "false"), t.type.spec.draggable && (u.draggable = !0));
    let h = u;
    return u = la(u, r, t), c ? a = new Wc(e, t, r, i, u, d || null, h, c, s, o + 1) : t.isText ? new Qr(e, t, r, i, u, h, s) : new Ut(e, t, r, i, u, d || null, h, s, o + 1);
  }
  parseRule() {
    if (this.node.type.spec.reparseInView)
      return null;
    let e = { node: this.node.type.name, attrs: this.node.attrs };
    if (this.node.type.whitespace == "pre" && (e.preserveWhitespace = "full"), !this.contentDOM)
      e.getContent = () => this.node.content;
    else if (!this.contentLost)
      e.contentElement = this.contentDOM;
    else {
      for (let t = this.children.length - 1; t >= 0; t--) {
        let r = this.children[t];
        if (this.dom.contains(r.dom.parentNode)) {
          e.contentElement = r.dom.parentNode;
          break;
        }
      }
      e.contentElement || (e.getContent = () => k.empty);
    }
    return e;
  }
  matchesNode(e, t, r) {
    return this.dirty == Ue && e.eq(this.node) && Xi(t, this.outerDeco) && r.eq(this.innerDeco);
  }
  get size() {
    return this.node.nodeSize;
  }
  get border() {
    return this.node.isLeaf ? 0 : 1;
  }
  updateChildren(e, t) {
    let r = this.node.inlineContent, i = t, s = e.composing ? this.localCompositionInfo(e, t) : null, o = s && s.pos > -1 ? s : null, l = s && s.pos < 0, a = new Jc(this, o && o.node);
    Xc(this.node, this.innerDeco, (c, u, d) => {
      c.spec.marks ? a.syncToMarks(c.spec.marks, r, e) : c.type.side >= 0 && !d && a.syncToMarks(u == this.node.childCount ? J.none : this.node.child(u).marks, r, e), a.placeWidget(c, e, i);
    }, (c, u, d, h) => {
      a.syncToMarks(c.marks, r, e);
      let f;
      a.findNodeMatch(c, u, d, h) || l && e.state.selection.from > i && e.state.selection.to < i + c.nodeSize && (f = a.findIndexWithChild(s.node)) > -1 && a.updateNodeAt(c, u, d, f, e) || a.updateNextNode(c, u, d, e, h) || a.addNode(c, u, d, e, i), i += c.nodeSize;
    }), a.syncToMarks([], r, e), this.node.isTextblock && a.addTextblockHacks(), a.destroyRest(), (a.changed || this.dirty == nn) && (o && this.protectLocalComposition(e, o), sa(this.contentDOM, this.children, e), gn && Qc(this.dom));
  }
  localCompositionInfo(e, t) {
    let { from: r, to: i } = e.state.selection;
    if (!(e.state.selection instanceof $) || r < t || i > t + this.node.content.size)
      return null;
    let s = e.domSelection(), o = Zc(s.focusNode, s.focusOffset);
    if (!o || !this.dom.contains(o.parentNode))
      return null;
    if (this.node.inlineContent) {
      let l = o.nodeValue, a = ed(this.node.content, l, r - t, i - t);
      return a < 0 ? null : { node: o, pos: a, text: l };
    } else
      return { node: o, pos: -1, text: "" };
  }
  protectLocalComposition(e, { node: t, pos: r, text: i }) {
    if (this.getDesc(t))
      return;
    let s = t;
    for (; s.parentNode != this.contentDOM; s = s.parentNode) {
      for (; s.previousSibling; )
        s.parentNode.removeChild(s.previousSibling);
      for (; s.nextSibling; )
        s.parentNode.removeChild(s.nextSibling);
      s.pmViewDesc && (s.pmViewDesc = void 0);
    }
    let o = new Kc(this, s, t, i);
    e.input.compositionNodes.push(o), this.children = Qi(this.children, r, r + i.length, e, o);
  }
  update(e, t, r, i) {
    return this.dirty == Ze || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, r, i), !0);
  }
  updateInner(e, t, r, i) {
    this.updateOuterDeco(t), this.node = e, this.innerDeco = r, this.contentDOM && this.updateChildren(i, this.posAtStart), this.dirty = Ue;
  }
  updateOuterDeco(e) {
    if (Xi(e, this.outerDeco))
      return;
    let t = this.nodeDOM.nodeType != 1, r = this.dom;
    this.dom = oa(this.dom, this.nodeDOM, Yi(this.outerDeco, this.node, t), Yi(e, this.node, t)), this.dom != r && (r.pmViewDesc = void 0, this.dom.pmViewDesc = this), this.outerDeco = e;
  }
  selectNode() {
    this.nodeDOM.nodeType == 1 && this.nodeDOM.classList.add("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && (this.dom.draggable = !0);
  }
  deselectNode() {
    this.nodeDOM.nodeType == 1 && this.nodeDOM.classList.remove("ProseMirror-selectednode"), (this.contentDOM || !this.node.type.spec.draggable) && this.dom.removeAttribute("draggable");
  }
  get domAtom() {
    return this.node.isAtom;
  }
}
function xo(n, e, t, r, i) {
  return la(r, e, n), new Ut(void 0, n, e, t, r, r, r, i, 0);
}
class Qr extends Ut {
  constructor(e, t, r, i, s, o, l) {
    super(e, t, r, i, s, null, o, l, 0);
  }
  parseRule() {
    let e = this.nodeDOM.parentNode;
    for (; e && e != this.dom && !e.pmIsDeco; )
      e = e.parentNode;
    return { skip: e || !0 };
  }
  update(e, t, r, i) {
    return this.dirty == Ze || this.dirty != Ue && !this.inParent() || !e.sameMarkup(this.node) ? !1 : (this.updateOuterDeco(t), (this.dirty != Ue || e.text != this.node.text) && e.text != this.nodeDOM.nodeValue && (this.nodeDOM.nodeValue = e.text, i.trackWrites == this.nodeDOM && (i.trackWrites = null)), this.node = e, this.dirty = Ue, !0);
  }
  inParent() {
    let e = this.parent.contentDOM;
    for (let t = this.nodeDOM; t; t = t.parentNode)
      if (t == e)
        return !0;
    return !1;
  }
  domFromPos(e) {
    return { node: this.nodeDOM, offset: e };
  }
  localPosFromDOM(e, t, r) {
    return e == this.nodeDOM ? this.posAtStart + Math.min(t, this.node.text.length) : super.localPosFromDOM(e, t, r);
  }
  ignoreMutation(e) {
    return e.type != "characterData" && e.type != "selection";
  }
  slice(e, t, r) {
    let i = this.node.cut(e, t), s = document.createTextNode(i.text);
    return new Qr(this.parent, i, this.outerDeco, this.innerDeco, s, s, r);
  }
  markDirty(e, t) {
    super.markDirty(e, t), this.dom != this.nodeDOM && (e == 0 || t == this.nodeDOM.nodeValue.length) && (this.dirty = Ze);
  }
  get domAtom() {
    return !1;
  }
}
class ia extends Qn {
  parseRule() {
    return { ignore: !0 };
  }
  matchesHack(e) {
    return this.dirty == Ue && this.dom.nodeName == e;
  }
  get domAtom() {
    return !0;
  }
  get ignoreForCoords() {
    return this.dom.nodeName == "IMG";
  }
}
class Wc extends Ut {
  constructor(e, t, r, i, s, o, l, a, c, u) {
    super(e, t, r, i, s, o, l, c, u), this.spec = a;
  }
  update(e, t, r, i) {
    if (this.dirty == Ze)
      return !1;
    if (this.spec.update) {
      let s = this.spec.update(e, t, r);
      return s && this.updateInner(e, t, r, i), s;
    } else
      return !this.contentDOM && !e.isLeaf ? !1 : super.update(e, t, r, i);
  }
  selectNode() {
    this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
  }
  deselectNode() {
    this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
  }
  setSelection(e, t, r, i) {
    this.spec.setSelection ? this.spec.setSelection(e, t, r) : super.setSelection(e, t, r, i);
  }
  destroy() {
    this.spec.destroy && this.spec.destroy(), super.destroy();
  }
  stopEvent(e) {
    return this.spec.stopEvent ? this.spec.stopEvent(e) : !1;
  }
  ignoreMutation(e) {
    return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
  }
}
function sa(n, e, t) {
  let r = n.firstChild, i = !1;
  for (let s = 0; s < e.length; s++) {
    let o = e[s], l = o.dom;
    if (l.parentNode == n) {
      for (; l != r; )
        r = ko(r), i = !0;
      r = r.nextSibling;
    } else
      i = !0, n.insertBefore(l, r);
    if (o instanceof Vt) {
      let a = r ? r.previousSibling : n.lastChild;
      sa(o.contentDOM, o.children, t), r = a ? a.nextSibling : n.firstChild;
    }
  }
  for (; r; )
    r = ko(r), i = !0;
  i && t.trackWrites == n && (t.trackWrites = null);
}
const Bn = function(n) {
  n && (this.nodeName = n);
};
Bn.prototype = /* @__PURE__ */ Object.create(null);
const Rt = [new Bn()];
function Yi(n, e, t) {
  if (n.length == 0)
    return Rt;
  let r = t ? Rt[0] : new Bn(), i = [r];
  for (let s = 0; s < n.length; s++) {
    let o = n[s].type.attrs;
    if (!!o) {
      o.nodeName && i.push(r = new Bn(o.nodeName));
      for (let l in o) {
        let a = o[l];
        a != null && (t && i.length == 1 && i.push(r = new Bn(e.isInline ? "span" : "div")), l == "class" ? r.class = (r.class ? r.class + " " : "") + a : l == "style" ? r.style = (r.style ? r.style + ";" : "") + a : l != "nodeName" && (r[l] = a));
      }
    }
  }
  return i;
}
function oa(n, e, t, r) {
  if (t == Rt && r == Rt)
    return e;
  let i = e;
  for (let s = 0; s < r.length; s++) {
    let o = r[s], l = t[s];
    if (s) {
      let a;
      l && l.nodeName == o.nodeName && i != n && (a = i.parentNode) && a.nodeName.toLowerCase() == o.nodeName || (a = document.createElement(o.nodeName), a.pmIsDeco = !0, a.appendChild(i), l = Rt[0]), i = a;
    }
    qc(i, l || Rt[0], o);
  }
  return i;
}
function qc(n, e, t) {
  for (let r in e)
    r != "class" && r != "style" && r != "nodeName" && !(r in t) && n.removeAttribute(r);
  for (let r in t)
    r != "class" && r != "style" && r != "nodeName" && t[r] != e[r] && n.setAttribute(r, t[r]);
  if (e.class != t.class) {
    let r = e.class ? e.class.split(" ").filter(Boolean) : [], i = t.class ? t.class.split(" ").filter(Boolean) : [];
    for (let s = 0; s < r.length; s++)
      i.indexOf(r[s]) == -1 && n.classList.remove(r[s]);
    for (let s = 0; s < i.length; s++)
      r.indexOf(i[s]) == -1 && n.classList.add(i[s]);
    n.classList.length == 0 && n.removeAttribute("class");
  }
  if (e.style != t.style) {
    if (e.style) {
      let r = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g, i;
      for (; i = r.exec(e.style); )
        n.style.removeProperty(i[1]);
    }
    t.style && (n.style.cssText += t.style);
  }
}
function la(n, e, t) {
  return oa(n, n, Rt, Yi(e, t, n.nodeType != 1));
}
function Xi(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].type.eq(e[t].type))
      return !1;
  return !0;
}
function ko(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class Jc {
  constructor(e, t) {
    this.lock = t, this.index = 0, this.stack = [], this.changed = !1, this.top = e, this.preMatch = Gc(e.node.content, e);
  }
  destroyBetween(e, t) {
    if (e != t) {
      for (let r = e; r < t; r++)
        this.top.children[r].destroy();
      this.top.children.splice(e, t - e), this.changed = !0;
    }
  }
  destroyRest() {
    this.destroyBetween(this.index, this.top.children.length);
  }
  syncToMarks(e, t, r) {
    let i = 0, s = this.stack.length >> 1, o = Math.min(s, e.length);
    for (; i < o && (i == s - 1 ? this.top : this.stack[i + 1 << 1]).matchesMark(e[i]) && e[i].type.spec.spanning !== !1; )
      i++;
    for (; i < s; )
      this.destroyRest(), this.top.dirty = Ue, this.index = this.stack.pop(), this.top = this.stack.pop(), s--;
    for (; s < e.length; ) {
      this.stack.push(this.top, this.index + 1);
      let l = -1;
      for (let a = this.index; a < Math.min(this.index + 3, this.top.children.length); a++)
        if (this.top.children[a].matchesMark(e[s])) {
          l = a;
          break;
        }
      if (l > -1)
        l > this.index && (this.changed = !0, this.destroyBetween(this.index, l)), this.top = this.top.children[this.index];
      else {
        let a = Vt.create(this.top, e[s], t, r);
        this.top.children.splice(this.index, 0, a), this.top = a, this.changed = !0;
      }
      this.index = 0, s++;
    }
  }
  findNodeMatch(e, t, r, i) {
    let s = -1, o;
    if (i >= this.preMatch.index && (o = this.preMatch.matches[i - this.preMatch.index]).parent == this.top && o.matchesNode(e, t, r))
      s = this.top.children.indexOf(o, this.index);
    else
      for (let l = this.index, a = Math.min(this.top.children.length, l + 5); l < a; l++) {
        let c = this.top.children[l];
        if (c.matchesNode(e, t, r) && !this.preMatch.matched.has(c)) {
          s = l;
          break;
        }
      }
    return s < 0 ? !1 : (this.destroyBetween(this.index, s), this.index++, !0);
  }
  updateNodeAt(e, t, r, i, s) {
    let o = this.top.children[i];
    return o.dirty == Ze && o.dom == o.contentDOM && (o.dirty = nn), o.update(e, t, r, s) ? (this.destroyBetween(this.index, i), this.index = i + 1, !0) : !1;
  }
  findIndexWithChild(e) {
    for (; ; ) {
      let t = e.parentNode;
      if (!t)
        return -1;
      if (t == this.top.contentDOM) {
        let r = e.pmViewDesc;
        if (r) {
          for (let i = this.index; i < this.top.children.length; i++)
            if (this.top.children[i] == r)
              return i;
        }
        return -1;
      }
      e = t;
    }
  }
  updateNextNode(e, t, r, i, s) {
    for (let o = this.index; o < this.top.children.length; o++) {
      let l = this.top.children[o];
      if (l instanceof Ut) {
        let a = this.preMatch.matched.get(l);
        if (a != null && a != s)
          return !1;
        let c = l.dom;
        if (!(this.lock && (c == this.lock || c.nodeType == 1 && c.contains(this.lock.parentNode)) && !(e.isText && l.node && l.node.isText && l.nodeDOM.nodeValue == e.text && l.dirty != Ze && Xi(t, l.outerDeco))) && l.update(e, t, r, i))
          return this.destroyBetween(this.index, o), l.dom != c && (this.changed = !0), this.index++, !0;
        break;
      }
    }
    return !1;
  }
  addNode(e, t, r, i, s) {
    this.top.children.splice(this.index++, 0, Ut.create(this.top, e, t, r, i, s)), this.changed = !0;
  }
  placeWidget(e, t, r) {
    let i = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (i && i.matchesWidget(e) && (e == i.widget || !i.widget.type.toDOM.parentNode))
      this.index++;
    else {
      let s = new ra(this.top, e, t, r);
      this.top.children.splice(this.index++, 0, s), this.changed = !0;
    }
  }
  addTextblockHacks() {
    let e = this.top.children[this.index - 1], t = this.top;
    for (; e instanceof Vt; )
      t = e, e = t.children[t.children.length - 1];
    (!e || !(e instanceof Qr) || /\n$/.test(e.node.text)) && ((Me || Ce) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t), this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e))
      this.index++;
    else {
      let r = document.createElement(e);
      e == "IMG" && (r.className = "ProseMirror-separator", r.alt = ""), e == "BR" && (r.className = "ProseMirror-trailingBreak");
      let i = new ia(this.top, [], r, null);
      t != this.top ? t.children.push(i) : t.children.splice(this.index++, 0, i), this.changed = !0;
    }
  }
}
function Gc(n, e) {
  let t = e, r = t.children.length, i = n.childCount, s = /* @__PURE__ */ new Map(), o = [];
  e:
    for (; i > 0; ) {
      let l;
      for (; ; )
        if (r) {
          let c = t.children[r - 1];
          if (c instanceof Vt)
            t = c, r = c.children.length;
          else {
            l = c, r--;
            break;
          }
        } else {
          if (t == e)
            break e;
          r = t.parent.children.indexOf(t), t = t.parent;
        }
      let a = l.node;
      if (!!a) {
        if (a != n.child(i - 1))
          break;
        --i, s.set(l, i), o.push(l);
      }
    }
  return { index: i, matched: s, matches: o.reverse() };
}
function Yc(n, e) {
  return n.type.side - e.type.side;
}
function Xc(n, e, t, r) {
  let i = e.locals(n), s = 0;
  if (i.length == 0) {
    for (let c = 0; c < n.childCount; c++) {
      let u = n.child(c);
      r(u, i, e.forChild(s, u), c), s += u.nodeSize;
    }
    return;
  }
  let o = 0, l = [], a = null;
  for (let c = 0; ; ) {
    if (o < i.length && i[o].to == s) {
      let p = i[o++], g;
      for (; o < i.length && i[o].to == s; )
        (g || (g = [p])).push(i[o++]);
      if (g) {
        g.sort(Yc);
        for (let y = 0; y < g.length; y++)
          t(g[y], c, !!a);
      } else
        t(p, c, !!a);
    }
    let u, d;
    if (a)
      d = -1, u = a, a = null;
    else if (c < n.childCount)
      d = c, u = n.child(c++);
    else
      break;
    for (let p = 0; p < l.length; p++)
      l[p].to <= s && l.splice(p--, 1);
    for (; o < i.length && i[o].from <= s && i[o].to > s; )
      l.push(i[o++]);
    let h = s + u.nodeSize;
    if (u.isText) {
      let p = h;
      o < i.length && i[o].from < p && (p = i[o].from);
      for (let g = 0; g < l.length; g++)
        l[g].to < p && (p = l[g].to);
      p < h && (a = u.cut(p - s), u = u.cut(0, p - s), h = p, d = -1);
    }
    let f = u.isInline && !u.isLeaf ? l.filter((p) => !p.inline) : l.slice();
    r(u, f, e.forChild(s, u), d), s = h;
  }
}
function Qc(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    n.style.cssText = e + "; list-style: square !important", window.getComputedStyle(n).listStyle, n.style.cssText = e;
  }
}
function Zc(n, e) {
  for (; ; ) {
    if (n.nodeType == 3)
      return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.childNodes.length > e && n.childNodes[e].nodeType == 3)
        return n.childNodes[e];
      n = n.childNodes[e - 1], e = Je(n);
    } else if (n.nodeType == 1 && e < n.childNodes.length)
      n = n.childNodes[e], e = 0;
    else
      return null;
  }
}
function ed(n, e, t, r) {
  for (let i = 0, s = 0; i < n.childCount && s <= r; ) {
    let o = n.child(i++), l = s;
    if (s += o.nodeSize, !o.isText)
      continue;
    let a = o.text;
    for (; i < n.childCount; ) {
      let c = n.child(i++);
      if (s += c.nodeSize, !c.isText)
        break;
      a += c.text;
    }
    if (s >= t) {
      let c = l < r ? a.lastIndexOf(e, r - l - 1) : -1;
      if (c >= 0 && c + e.length + l >= t)
        return l + c;
      if (t == r && a.length >= r + e.length - l && a.slice(r - l, r - l + e.length) == e)
        return r;
    }
  }
  return -1;
}
function Qi(n, e, t, r, i) {
  let s = [];
  for (let o = 0, l = 0; o < n.length; o++) {
    let a = n[o], c = l, u = l += a.size;
    c >= t || u <= e ? s.push(a) : (c < e && s.push(a.slice(0, e - c, r)), i && (s.push(i), i = void 0), u > t && s.push(a.slice(t - c, a.size, r)));
  }
  return s;
}
function aa(n, e = null) {
  let t = n.domSelection(), r = n.state.doc;
  if (!t.focusNode)
    return null;
  let i = n.docView.nearestDesc(t.focusNode), s = i && i.size == 0, o = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (o < 0)
    return null;
  let l = r.resolve(o), a, c;
  if (ys(t)) {
    for (a = l; i && !i.node; )
      i = i.parent;
    let u = i.node;
    if (i && u.isAtom && _.isSelectable(u) && i.parent && !(u.isInline && Tc(t.focusNode, t.focusOffset, i.dom))) {
      let d = i.posBefore;
      c = new _(o == d ? l : r.resolve(d));
    }
  } else {
    let u = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
    if (u < 0)
      return null;
    a = r.resolve(u);
  }
  if (!c) {
    let u = e == "pointer" || n.state.selection.head < l.pos && !s ? 1 : -1;
    c = Ds(n, a, l, u);
  }
  return c;
}
function ua(n) {
  return n.editable ? n.hasFocus() : da(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function Et(n, e = !1) {
  let t = n.state.selection;
  if (ca(n, t), !!ua(n)) {
    if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && Ce) {
      let r = n.domSelection(), i = n.domObserver.currentSelection;
      if (r.anchorNode && i.anchorNode && jn(r.anchorNode, r.anchorOffset, i.anchorNode, i.anchorOffset)) {
        n.input.mouseDown.delayedSelectionSync = !0, n.domObserver.setCurSelection();
        return;
      }
    }
    if (n.domObserver.disconnectSelection(), n.cursorWrapper)
      nd(n);
    else {
      let { anchor: r, head: i } = t, s, o;
      Co && !(t instanceof $) && (t.$from.parent.inlineContent || (s = So(n, t.from)), !t.empty && !t.$from.parent.inlineContent && (o = So(n, t.to))), n.docView.setSelection(r, i, n.root, e), Co && (s && Ao(s), o && Ao(o)), t.visible ? n.dom.classList.remove("ProseMirror-hideselection") : (n.dom.classList.add("ProseMirror-hideselection"), "onselectionchange" in document && td(n));
    }
    n.domObserver.setCurSelection(), n.domObserver.connectSelection();
  }
}
const Co = Me || Ce && Ac < 63;
function So(n, e) {
  let { node: t, offset: r } = n.docView.domFromPos(e, 0), i = r < t.childNodes.length ? t.childNodes[r] : null, s = r ? t.childNodes[r - 1] : null;
  if (Me && i && i.contentEditable == "false")
    return Oi(i);
  if ((!i || i.contentEditable == "false") && (!s || s.contentEditable == "false")) {
    if (i)
      return Oi(i);
    if (s)
      return Oi(s);
  }
}
function Oi(n) {
  return n.contentEditable = "true", Me && n.draggable && (n.draggable = !1, n.wasDraggable = !0), n;
}
function Ao(n) {
  n.contentEditable = "false", n.wasDraggable && (n.draggable = !0, n.wasDraggable = null);
}
function td(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelection(), r = t.anchorNode, i = t.anchorOffset;
  e.addEventListener("selectionchange", n.input.hideSelectionGuard = () => {
    (t.anchorNode != r || t.anchorOffset != i) && (e.removeEventListener("selectionchange", n.input.hideSelectionGuard), setTimeout(() => {
      (!ua(n) || n.state.selection.visible) && n.dom.classList.remove("ProseMirror-hideselection");
    }, 20));
  });
}
function nd(n) {
  let e = n.domSelection(), t = document.createRange(), r = n.cursorWrapper.dom, i = r.nodeName == "IMG";
  i ? t.setEnd(r.parentNode, Ne(r) + 1) : t.setEnd(r, 0), t.collapse(!1), e.removeAllRanges(), e.addRange(t), !i && !n.state.selection.visible && Re && mt <= 11 && (r.disabled = !0, r.disabled = !1);
}
function ca(n, e) {
  if (e instanceof _) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (wo(n), t && t.selectNode(), n.lastSelectedViewDesc = t);
  } else
    wo(n);
}
function wo(n) {
  n.lastSelectedViewDesc && (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(), n.lastSelectedViewDesc = void 0);
}
function Ds(n, e, t, r) {
  return n.someProp("createSelectionBetween", (i) => i(n, e, t)) || $.between(e, t, r);
}
function Mo(n) {
  return n.editable && n.root.activeElement != n.dom ? !1 : da(n);
}
function da(n) {
  let e = n.domSelection();
  if (!e.anchorNode)
    return !1;
  try {
    return n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) && (n.editable || n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode));
  } catch {
    return !1;
  }
}
function rd(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0), t = n.domSelection();
  return jn(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function Zi(n, e) {
  let { $anchor: t, $head: r } = n.selection, i = e > 0 ? t.max(r) : t.min(r), s = i.parent.inlineContent ? i.depth ? n.doc.resolve(e > 0 ? i.after() : i.before()) : null : i;
  return s && V.findFrom(s, e);
}
function Nt(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function To(n, e, t) {
  let r = n.state.selection;
  if (r instanceof $) {
    if (!r.empty || t.indexOf("s") > -1)
      return !1;
    if (n.endOfTextblock(e > 0 ? "right" : "left")) {
      let i = Zi(n.state, e);
      return i && i instanceof _ ? Nt(n, i) : !1;
    } else if (!(Pe && t.indexOf("m") > -1)) {
      let i = r.$head, s = i.textOffset ? null : e < 0 ? i.nodeBefore : i.nodeAfter, o;
      if (!s || s.isText)
        return !1;
      let l = e < 0 ? i.pos - s.nodeSize : i.pos;
      return s.isAtom || (o = n.docView.descAt(l)) && !o.contentDOM ? _.isSelectable(s) ? Nt(n, new _(e < 0 ? n.state.doc.resolve(i.pos - s.nodeSize) : i)) : Xr ? Nt(n, new $(n.state.doc.resolve(e < 0 ? l : l + s.nodeSize))) : !1 : !1;
    }
  } else {
    if (r instanceof _ && r.node.isInline)
      return Nt(n, new $(e > 0 ? r.$to : r.$from));
    {
      let i = Zi(n.state, e);
      return i ? Nt(n, i) : !1;
    }
  }
}
function Er(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function In(n) {
  let e = n.pmViewDesc;
  return e && e.size == 0 && (n.nextSibling || n.nodeName != "BR");
}
function vi(n) {
  let e = n.domSelection(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i, s, o = !1;
  for (Qe && t.nodeType == 1 && r < Er(t) && In(t.childNodes[r]) && (o = !0); ; )
    if (r > 0) {
      if (t.nodeType != 1)
        break;
      {
        let l = t.childNodes[r - 1];
        if (In(l))
          i = t, s = --r;
        else if (l.nodeType == 3)
          t = l, r = t.nodeValue.length;
        else
          break;
      }
    } else {
      if (ha(t))
        break;
      {
        let l = t.previousSibling;
        for (; l && In(l); )
          i = t.parentNode, s = Ne(l), l = l.previousSibling;
        if (l)
          t = l, r = Er(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = 0;
        }
      }
    }
  o ? es(n, e, t, r) : i && es(n, e, i, s);
}
function Ni(n) {
  let e = n.domSelection(), t = e.focusNode, r = e.focusOffset;
  if (!t)
    return;
  let i = Er(t), s, o;
  for (; ; )
    if (r < i) {
      if (t.nodeType != 1)
        break;
      let l = t.childNodes[r];
      if (In(l))
        s = t, o = ++r;
      else
        break;
    } else {
      if (ha(t))
        break;
      {
        let l = t.nextSibling;
        for (; l && In(l); )
          s = l.parentNode, o = Ne(l) + 1, l = l.nextSibling;
        if (l)
          t = l, r = 0, i = Er(t);
        else {
          if (t = t.parentNode, t == n.dom)
            break;
          r = i = 0;
        }
      }
    }
  s && es(n, e, s, o);
}
function ha(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function es(n, e, t, r) {
  if (ys(e)) {
    let s = document.createRange();
    s.setEnd(t, r), s.setStart(t, r), e.removeAllRanges(), e.addRange(s);
  } else
    e.extend && e.extend(t, r);
  n.domObserver.setCurSelection();
  let { state: i } = n;
  setTimeout(() => {
    n.state == i && Et(n);
  }, 50);
}
function Oo(n, e, t) {
  let r = n.state.selection;
  if (r instanceof $ && !r.empty || t.indexOf("s") > -1 || Pe && t.indexOf("m") > -1)
    return !1;
  let { $from: i, $to: s } = r;
  if (!i.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let o = Zi(n.state, e);
    if (o && o instanceof _)
      return Nt(n, o);
  }
  if (!i.parent.inlineContent) {
    let o = e < 0 ? i : s, l = r instanceof Ve ? V.near(o, e) : V.findFrom(o, e);
    return l ? Nt(n, l) : !1;
  }
  return !1;
}
function vo(n, e) {
  if (!(n.state.selection instanceof $))
    return !0;
  let { $head: t, $anchor: r, empty: i } = n.state.selection;
  if (!t.sameParent(r))
    return !0;
  if (!i)
    return !1;
  if (n.endOfTextblock(e > 0 ? "forward" : "backward"))
    return !0;
  let s = !t.textOffset && (e < 0 ? t.nodeBefore : t.nodeAfter);
  if (s && !s.isText) {
    let o = n.state.tr;
    return e < 0 ? o.delete(t.pos - s.nodeSize, t.pos) : o.delete(t.pos, t.pos + s.nodeSize), n.dispatch(o), !0;
  }
  return !1;
}
function No(n, e, t) {
  n.domObserver.stop(), e.contentEditable = t, n.domObserver.start();
}
function id(n) {
  if (!Me || n.state.selection.$head.parentOffset > 0)
    return !1;
  let { focusNode: e, focusOffset: t } = n.domSelection();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let r = e.firstChild;
    No(n, r, "true"), setTimeout(() => No(n, r, "false"), 20);
  }
  return !1;
}
function sd(n) {
  let e = "";
  return n.ctrlKey && (e += "c"), n.metaKey && (e += "m"), n.altKey && (e += "a"), n.shiftKey && (e += "s"), e;
}
function od(n, e) {
  let t = e.keyCode, r = sd(e);
  return t == 8 || Pe && t == 72 && r == "c" ? vo(n, -1) || vi(n) : t == 46 || Pe && t == 68 && r == "c" ? vo(n, 1) || Ni(n) : t == 13 || t == 27 ? !0 : t == 37 || Pe && t == 66 && r == "c" ? To(n, -1, r) || vi(n) : t == 39 || Pe && t == 70 && r == "c" ? To(n, 1, r) || Ni(n) : t == 38 || Pe && t == 80 && r == "c" ? Oo(n, -1, r) || vi(n) : t == 40 || Pe && t == 78 && r == "c" ? id(n) || Oo(n, 1, r) || Ni(n) : r == (Pe ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90);
}
function fa(n, e) {
  let t = [], { content: r, openStart: i, openEnd: s } = e;
  for (; i > 1 && s > 1 && r.childCount == 1 && r.firstChild.childCount == 1; ) {
    i--, s--;
    let f = r.firstChild;
    t.push(f.type.name, f.attrs != f.type.defaultAttrs ? f.attrs : null), r = f.content;
  }
  let o = n.someProp("clipboardSerializer") || Ge.fromSchema(n.state.schema), l = Da(), a = l.createElement("div");
  a.appendChild(o.serializeFragment(r, { document: l }));
  let c = a.firstChild, u, d = 0;
  for (; c && c.nodeType == 1 && (u = ba[c.nodeName.toLowerCase()]); ) {
    for (let f = u.length - 1; f >= 0; f--) {
      let p = l.createElement(u[f]);
      for (; a.firstChild; )
        p.appendChild(a.firstChild);
      a.appendChild(p), d++;
    }
    c = a.firstChild;
  }
  c && c.nodeType == 1 && c.setAttribute("data-pm-slice", `${i} ${s}${d ? ` -${d}` : ""} ${JSON.stringify(t)}`);
  let h = n.someProp("clipboardTextSerializer", (f) => f(e)) || e.content.textBetween(0, e.content.size, `

`);
  return { dom: a, text: h };
}
function pa(n, e, t, r, i) {
  let s = i.parent.type.spec.code, o, l;
  if (!t && !e)
    return null;
  let a = e && (r || s || !t);
  if (a) {
    if (n.someProp("transformPastedText", (h) => {
      e = h(e, s || r);
    }), s)
      return e ? new O(k.from(n.state.schema.text(e.replace(/\r\n?/g, `
`))), 0, 0) : O.empty;
    let d = n.someProp("clipboardTextParser", (h) => h(e, i, r));
    if (d)
      l = d;
    else {
      let h = i.marks(), { schema: f } = n.state, p = Ge.fromSchema(f);
      o = document.createElement("div"), e.split(/(?:\r\n?|\n)+/).forEach((g) => {
        let y = o.appendChild(document.createElement("p"));
        g && y.appendChild(p.serializeNode(f.text(g, h)));
      });
    }
  } else
    n.someProp("transformPastedHTML", (d) => {
      t = d(t);
    }), o = ud(t), Xr && cd(o);
  let c = o && o.querySelector("[data-pm-slice]"), u = c && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(c.getAttribute("data-pm-slice") || "");
  if (u && u[3])
    for (let d = +u[3]; d > 0 && o.firstChild; d--)
      o = o.firstChild;
  if (l || (l = (n.someProp("clipboardParser") || n.someProp("domParser") || fn.fromSchema(n.state.schema)).parseSlice(o, {
    preserveWhitespace: !!(a || u),
    context: i,
    ruleFromNode(h) {
      return h.nodeName == "BR" && !h.nextSibling && h.parentNode && !ld.test(h.parentNode.nodeName) ? { ignore: !0 } : null;
    }
  })), u)
    l = dd(Fo(l, +u[1], +u[2]), u[4]);
  else if (l = O.maxOpen(ad(l.content, i), !0), l.openStart || l.openEnd) {
    let d = 0, h = 0;
    for (let f = l.content.firstChild; d < l.openStart && !f.type.spec.isolating; d++, f = f.firstChild)
      ;
    for (let f = l.content.lastChild; h < l.openEnd && !f.type.spec.isolating; h++, f = f.lastChild)
      ;
    l = Fo(l, d, h);
  }
  return n.someProp("transformPasted", (d) => {
    l = d(l);
  }), l;
}
const ld = /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function ad(n, e) {
  if (n.childCount < 2)
    return n;
  for (let t = e.depth; t >= 0; t--) {
    let i = e.node(t).contentMatchAt(e.index(t)), s, o = [];
    if (n.forEach((l) => {
      if (!o)
        return;
      let a = i.findWrapping(l.type), c;
      if (!a)
        return o = null;
      if (c = o.length && s.length && ma(a, s, l, o[o.length - 1], 0))
        o[o.length - 1] = c;
      else {
        o.length && (o[o.length - 1] = ya(o[o.length - 1], s.length));
        let u = ga(l, a);
        o.push(u), i = i.matchType(u.type), s = a;
      }
    }), o)
      return k.from(o);
  }
  return n;
}
function ga(n, e, t = 0) {
  for (let r = e.length - 1; r >= t; r--)
    n = e[r].create(null, k.from(n));
  return n;
}
function ma(n, e, t, r, i) {
  if (i < n.length && i < e.length && n[i] == e[i]) {
    let s = ma(n, e, t, r.lastChild, i + 1);
    if (s)
      return r.copy(r.content.replaceChild(r.childCount - 1, s));
    if (r.contentMatchAt(r.childCount).matchType(i == n.length - 1 ? t.type : n[i + 1]))
      return r.copy(r.content.append(k.from(ga(t, n, i + 1))));
  }
}
function ya(n, e) {
  if (e == 0)
    return n;
  let t = n.content.replaceChild(n.childCount - 1, ya(n.lastChild, e - 1)), r = n.contentMatchAt(n.childCount).fillBefore(k.empty, !0);
  return n.copy(t.append(r));
}
function ts(n, e, t, r, i, s) {
  let o = e < 0 ? n.firstChild : n.lastChild, l = o.content;
  return i < r - 1 && (l = ts(l, e, t, r, i + 1, s)), i >= t && (l = e < 0 ? o.contentMatchAt(0).fillBefore(l, n.childCount > 1 || s <= i).append(l) : l.append(o.contentMatchAt(o.childCount).fillBefore(k.empty, !0))), n.replaceChild(e < 0 ? 0 : n.childCount - 1, o.copy(l));
}
function Fo(n, e, t) {
  return e < n.openStart && (n = new O(ts(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)), t < n.openEnd && (n = new O(ts(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)), n;
}
const ba = {
  thead: ["table"],
  tbody: ["table"],
  tfoot: ["table"],
  caption: ["table"],
  colgroup: ["table"],
  col: ["table", "colgroup"],
  tr: ["table", "tbody"],
  td: ["table", "tbody", "tr"],
  th: ["table", "tbody", "tr"]
};
let Ro = null;
function Da() {
  return Ro || (Ro = document.implementation.createHTMLDocument("title"));
}
function ud(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = Da().createElement("div"), r = /<([a-z][^>\s]+)/i.exec(n), i;
  if ((i = r && ba[r[1].toLowerCase()]) && (n = i.map((s) => "<" + s + ">").join("") + n + i.map((s) => "</" + s + ">").reverse().join("")), t.innerHTML = n, i)
    for (let s = 0; s < i.length; s++)
      t = t.querySelector(i[s]) || t;
  return t;
}
function cd(n) {
  let e = n.querySelectorAll(Ce ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let r = e[t];
    r.childNodes.length == 1 && r.textContent == "\xA0" && r.parentNode && r.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), r);
  }
}
function dd(n, e) {
  if (!n.size)
    return n;
  let t = n.content.firstChild.type.schema, r;
  try {
    r = JSON.parse(e);
  } catch {
    return n;
  }
  let { content: i, openStart: s, openEnd: o } = n;
  for (let l = r.length - 2; l >= 0; l -= 2) {
    let a = t.nodes[r[l]];
    if (!a || a.hasRequiredAttrs())
      break;
    i = k.from(a.create(r[l + 1], i)), s++, o++;
  }
  return new O(i, s, o);
}
const Te = {};
let Se = {};
class hd {
  constructor() {
    this.shiftKey = !1, this.mouseDown = null, this.lastKeyCode = null, this.lastKeyCodeTime = 0, this.lastClick = { time: 0, x: 0, y: 0, type: "" }, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastIOSEnter = 0, this.lastIOSEnterFallbackTimeout = -1, this.lastAndroidDelete = 0, this.composing = !1, this.composingTimeout = -1, this.compositionNodes = [], this.compositionEndedAt = -2e8, this.domChangeCount = 0, this.eventHandlers = /* @__PURE__ */ Object.create(null), this.hideSelectionGuard = null;
  }
}
function fd(n) {
  for (let e in Te) {
    let t = Te[e];
    n.dom.addEventListener(e, n.input.eventHandlers[e] = (r) => {
      gd(n, r) && !Es(n, r) && (n.editable || !(r.type in Se)) && t(n, r);
    });
  }
  Me && n.dom.addEventListener("input", () => null), ns(n);
}
function Bt(n, e) {
  n.input.lastSelectionOrigin = e, n.input.lastSelectionTime = Date.now();
}
function pd(n) {
  n.domObserver.stop();
  for (let e in n.input.eventHandlers)
    n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function ns(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] || n.dom.addEventListener(t, n.input.eventHandlers[t] = (r) => Es(n, r));
  });
}
function Es(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let r = t[e.type];
    return r ? r(n, e) || e.defaultPrevented : !1;
  });
}
function gd(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || t.pmViewDesc && t.pmViewDesc.stopEvent(e))
      return !1;
  return !0;
}
function md(n, e) {
  !Es(n, e) && Te[e.type] && (n.editable || !(e.type in Se)) && Te[e.type](n, e);
}
Se.keydown = (n, e) => {
  let t = e;
  if (n.input.shiftKey = t.keyCode == 16 || t.shiftKey, !xa(n, t) && (n.input.lastKeyCode = t.keyCode, n.input.lastKeyCodeTime = Date.now(), !(qe && Ce && t.keyCode == 13)))
    if (t.keyCode != 229 && n.domObserver.forceFlush(), gn && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey) {
      let r = Date.now();
      n.input.lastIOSEnter = r, n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
        n.input.lastIOSEnter == r && (n.someProp("handleKeyDown", (i) => i(n, tn(13, "Enter"))), n.input.lastIOSEnter = 0);
      }, 200);
    } else
      n.someProp("handleKeyDown", (r) => r(n, t)) || od(n, t) ? t.preventDefault() : Bt(n, "key");
};
Se.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
Se.keypress = (n, e) => {
  let t = e;
  if (xa(n, t) || !t.charCode || t.ctrlKey && !t.altKey || Pe && t.metaKey)
    return;
  if (n.someProp("handleKeyPress", (i) => i(n, t))) {
    t.preventDefault();
    return;
  }
  let r = n.state.selection;
  if (!(r instanceof $) || !r.$from.sameParent(r.$to)) {
    let i = String.fromCharCode(t.charCode);
    n.someProp("handleTextInput", (s) => s(n, r.$from.pos, r.$to.pos, i)) || n.dispatch(n.state.tr.insertText(i).scrollIntoView()), t.preventDefault();
  }
};
function Zr(n) {
  return { left: n.clientX, top: n.clientY };
}
function yd(n, e) {
  let t = e.x - n.clientX, r = e.y - n.clientY;
  return t * t + r * r < 100;
}
function xs(n, e, t, r, i) {
  if (r == -1)
    return !1;
  let s = n.state.doc.resolve(r);
  for (let o = s.depth + 1; o > 0; o--)
    if (n.someProp(e, (l) => o > s.depth ? l(n, t, s.nodeAfter, s.before(o), i, !0) : l(n, t, s.node(o), s.before(o), i, !1)))
      return !0;
  return !1;
}
function hn(n, e, t) {
  n.focused || n.focus();
  let r = n.state.tr.setSelection(e);
  t == "pointer" && r.setMeta("pointer", !0), n.dispatch(r);
}
function bd(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.doc.resolve(e), r = t.nodeAfter;
  return r && r.isAtom && _.isSelectable(r) ? (hn(n, new _(t), "pointer"), !0) : !1;
}
function Dd(n, e) {
  if (e == -1)
    return !1;
  let t = n.state.selection, r, i;
  t instanceof _ && (r = t.node);
  let s = n.state.doc.resolve(e);
  for (let o = s.depth + 1; o > 0; o--) {
    let l = o > s.depth ? s.nodeAfter : s.node(o);
    if (_.isSelectable(l)) {
      r && t.$from.depth > 0 && o >= t.$from.depth && s.before(t.$from.depth + 1) == t.$from.pos ? i = s.before(t.$from.depth) : i = s.before(o);
      break;
    }
  }
  return i != null ? (hn(n, _.create(n.state.doc, i), "pointer"), !0) : !1;
}
function Ed(n, e, t, r, i) {
  return xs(n, "handleClickOn", e, t, r) || n.someProp("handleClick", (s) => s(n, e, r)) || (i ? Dd(n, t) : bd(n, t));
}
function xd(n, e, t, r) {
  return xs(n, "handleDoubleClickOn", e, t, r) || n.someProp("handleDoubleClick", (i) => i(n, e, r));
}
function kd(n, e, t, r) {
  return xs(n, "handleTripleClickOn", e, t, r) || n.someProp("handleTripleClick", (i) => i(n, e, r)) || Cd(n, t, r);
}
function Cd(n, e, t) {
  if (t.button != 0)
    return !1;
  let r = n.state.doc;
  if (e == -1)
    return r.inlineContent ? (hn(n, $.create(r, 0, r.content.size), "pointer"), !0) : !1;
  let i = r.resolve(e);
  for (let s = i.depth + 1; s > 0; s--) {
    let o = s > i.depth ? i.nodeAfter : i.node(s), l = i.before(s);
    if (o.inlineContent)
      hn(n, $.create(r, l + 1, l + 1 + o.content.size), "pointer");
    else if (_.isSelectable(o))
      hn(n, _.create(r, l), "pointer");
    else
      continue;
    return !0;
  }
}
function ks(n) {
  return xr(n);
}
const Ea = Pe ? "metaKey" : "ctrlKey";
Te.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let r = ks(n), i = Date.now(), s = "singleClick";
  i - n.input.lastClick.time < 500 && yd(t, n.input.lastClick) && !t[Ea] && (n.input.lastClick.type == "singleClick" ? s = "doubleClick" : n.input.lastClick.type == "doubleClick" && (s = "tripleClick")), n.input.lastClick = { time: i, x: t.clientX, y: t.clientY, type: s };
  let o = n.posAtCoords(Zr(t));
  !o || (s == "singleClick" ? (n.input.mouseDown && n.input.mouseDown.done(), n.input.mouseDown = new Sd(n, o, t, !!r)) : (s == "doubleClick" ? xd : kd)(n, o.pos, o.inside, t) ? t.preventDefault() : Bt(n, "pointer"));
};
class Sd {
  constructor(e, t, r, i) {
    this.view = e, this.pos = t, this.event = r, this.flushed = i, this.delayedSelectionSync = !1, this.mightDrag = null, this.startDoc = e.state.doc, this.selectNode = !!r[Ea], this.allowDefault = r.shiftKey;
    let s, o;
    if (t.inside > -1)
      s = e.state.doc.nodeAt(t.inside), o = t.inside;
    else {
      let u = e.state.doc.resolve(t.pos);
      s = u.parent, o = u.depth ? u.before() : 0;
    }
    const l = i ? null : r.target, a = l ? e.docView.nearestDesc(l, !0) : null;
    this.target = a ? a.dom : null;
    let { selection: c } = e.state;
    (r.button == 0 && s.type.spec.draggable && s.type.spec.selectable !== !1 || c instanceof _ && c.from <= o && c.to > o) && (this.mightDrag = {
      node: s,
      pos: o,
      addAttr: !!(this.target && !this.target.draggable),
      setUneditable: !!(this.target && Qe && !this.target.hasAttribute("contentEditable"))
    }), this.target && this.mightDrag && (this.mightDrag.addAttr || this.mightDrag.setUneditable) && (this.view.domObserver.stop(), this.mightDrag.addAttr && (this.target.draggable = !0), this.mightDrag.setUneditable && setTimeout(() => {
      this.view.input.mouseDown == this && this.target.setAttribute("contentEditable", "false");
    }, 20), this.view.domObserver.start()), e.root.addEventListener("mouseup", this.up = this.up.bind(this)), e.root.addEventListener("mousemove", this.move = this.move.bind(this)), Bt(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up), this.view.root.removeEventListener("mousemove", this.move), this.mightDrag && this.target && (this.view.domObserver.stop(), this.mightDrag.addAttr && this.target.removeAttribute("draggable"), this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"), this.view.domObserver.start()), this.delayedSelectionSync && setTimeout(() => Et(this.view)), this.view.input.mouseDown = null;
  }
  up(e) {
    if (this.done(), !this.view.dom.contains(e.target))
      return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Zr(e))), this.allowDefault || !t ? Bt(this.view, "pointer") : Ed(this.view, t.pos, t.inside, e, this.selectNode) ? e.preventDefault() : e.button == 0 && (this.flushed || Me && this.mightDrag && !this.mightDrag.node.isAtom || Ce && !(this.view.state.selection instanceof $) && Math.min(Math.abs(t.pos - this.view.state.selection.from), Math.abs(t.pos - this.view.state.selection.to)) <= 2) ? (hn(this.view, V.near(this.view.state.doc.resolve(t.pos)), "pointer"), e.preventDefault()) : Bt(this.view, "pointer");
  }
  move(e) {
    !this.allowDefault && (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) && (this.allowDefault = !0), Bt(this.view, "pointer"), e.buttons == 0 && this.done();
  }
}
Te.touchdown = (n) => {
  ks(n), Bt(n, "pointer");
};
Te.contextmenu = (n) => ks(n);
function xa(n, e) {
  return n.composing ? !0 : Me && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500 ? (n.input.compositionEndedAt = -2e8, !0) : !1;
}
const Ad = qe ? 5e3 : -1;
Se.compositionstart = Se.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n, t = e.selection.$from;
    if (e.selection.empty && (e.storedMarks || !t.textOffset && t.parentOffset && t.nodeBefore.marks.some((r) => r.type.spec.inclusive === !1)))
      n.markCursor = n.state.storedMarks || t.marks(), xr(n, !0), n.markCursor = null;
    else if (xr(n), Qe && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length) {
      let r = n.domSelection();
      for (let i = r.focusNode, s = r.focusOffset; i && i.nodeType == 1 && s != 0; ) {
        let o = s < 0 ? i.lastChild : i.childNodes[s - 1];
        if (!o)
          break;
        if (o.nodeType == 3) {
          r.collapse(o, o.nodeValue.length);
          break;
        } else
          i = o, s = -1;
      }
    }
    n.input.composing = !0;
  }
  ka(n, Ad);
};
Se.compositionend = (n, e) => {
  n.composing && (n.input.composing = !1, n.input.compositionEndedAt = e.timeStamp, ka(n, 20));
};
function ka(n, e) {
  clearTimeout(n.input.composingTimeout), e > -1 && (n.input.composingTimeout = setTimeout(() => xr(n), e));
}
function Ca(n) {
  for (n.composing && (n.input.composing = !1, n.input.compositionEndedAt = wd()); n.input.compositionNodes.length > 0; )
    n.input.compositionNodes.pop().markParentsDirty();
}
function wd() {
  let n = document.createEvent("Event");
  return n.initEvent("event", !0, !0), n.timeStamp;
}
function xr(n, e = !1) {
  if (!(qe && n.domObserver.flushingSoon >= 0)) {
    if (n.domObserver.forceFlush(), Ca(n), e || n.docView && n.docView.dirty) {
      let t = aa(n);
      return t && !t.eq(n.state.selection) ? n.dispatch(n.state.tr.setSelection(t)) : n.updateState(n.state), !0;
    }
    return !1;
  }
}
function Md(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), t.style.cssText = "position: fixed; left: -10000px; top: 10px";
  let r = getSelection(), i = document.createRange();
  i.selectNodeContents(e), n.dom.blur(), r.removeAllRanges(), r.addRange(i), setTimeout(() => {
    t.parentNode && t.parentNode.removeChild(t), n.focus();
  }, 50);
}
const mn = Re && mt < 15 || gn && wc < 604;
Te.copy = Se.cut = (n, e) => {
  let t = e, r = n.state.selection, i = t.type == "cut";
  if (r.empty)
    return;
  let s = mn ? null : t.clipboardData, o = r.content(), { dom: l, text: a } = fa(n, o);
  s ? (t.preventDefault(), s.clearData(), s.setData("text/html", l.innerHTML), s.setData("text/plain", a)) : Md(n, l), i && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function Td(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1 ? n.content.firstChild : null;
}
function Od(n, e) {
  if (!n.dom.parentNode)
    return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code, r = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (r.contentEditable = "true"), r.style.cssText = "position: fixed; left: -10000px; top: 10px", r.focus(), setTimeout(() => {
    n.focus(), r.parentNode && r.parentNode.removeChild(r), t ? rs(n, r.value, null, e) : rs(n, r.textContent, r.innerHTML, e);
  }, 50);
}
function rs(n, e, t, r) {
  let i = pa(n, e, t, n.input.shiftKey, n.state.selection.$from);
  if (n.someProp("handlePaste", (l) => l(n, r, i || O.empty)))
    return !0;
  if (!i)
    return !1;
  let s = Td(i), o = s ? n.state.tr.replaceSelectionWith(s, n.input.shiftKey) : n.state.tr.replaceSelection(i);
  return n.dispatch(o.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
Se.paste = (n, e) => {
  let t = e;
  if (n.composing && !qe)
    return;
  let r = mn ? null : t.clipboardData;
  r && rs(n, r.getData("text/plain"), r.getData("text/html"), t) ? t.preventDefault() : Od(n, t);
};
class vd {
  constructor(e, t) {
    this.slice = e, this.move = t;
  }
}
const Sa = Pe ? "altKey" : "ctrlKey";
Te.dragstart = (n, e) => {
  let t = e, r = n.input.mouseDown;
  if (r && r.done(), !t.dataTransfer)
    return;
  let i = n.state.selection, s = i.empty ? null : n.posAtCoords(Zr(t));
  if (!(s && s.pos >= i.from && s.pos <= (i instanceof _ ? i.to - 1 : i.to))) {
    if (r && r.mightDrag)
      n.dispatch(n.state.tr.setSelection(_.create(n.state.doc, r.mightDrag.pos)));
    else if (t.target && t.target.nodeType == 1) {
      let c = n.docView.nearestDesc(t.target, !0);
      c && c.node.type.spec.draggable && c != n.docView && n.dispatch(n.state.tr.setSelection(_.create(n.state.doc, c.posBefore)));
    }
  }
  let o = n.state.selection.content(), { dom: l, text: a } = fa(n, o);
  t.dataTransfer.clearData(), t.dataTransfer.setData(mn ? "Text" : "text/html", l.innerHTML), t.dataTransfer.effectAllowed = "copyMove", mn || t.dataTransfer.setData("text/plain", a), n.dragging = new vd(o, !t[Sa]);
};
Te.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
Se.dragover = Se.dragenter = (n, e) => e.preventDefault();
Se.drop = (n, e) => {
  let t = e, r = n.dragging;
  if (n.dragging = null, !t.dataTransfer)
    return;
  let i = n.posAtCoords(Zr(t));
  if (!i)
    return;
  let s = n.state.doc.resolve(i.pos);
  if (!s)
    return;
  let o = r && r.slice;
  o ? n.someProp("transformPasted", (p) => {
    o = p(o);
  }) : o = pa(n, t.dataTransfer.getData(mn ? "Text" : "text/plain"), mn ? null : t.dataTransfer.getData("text/html"), !1, s);
  let l = !!(r && !t[Sa]);
  if (n.someProp("handleDrop", (p) => p(n, t, o || O.empty, l))) {
    t.preventDefault();
    return;
  }
  if (!o)
    return;
  t.preventDefault();
  let a = o ? jl(n.state.doc, s.pos, o) : s.pos;
  a == null && (a = s.pos);
  let c = n.state.tr;
  l && c.deleteSelection();
  let u = c.mapping.map(a), d = o.openStart == 0 && o.openEnd == 0 && o.content.childCount == 1, h = c.doc;
  if (d ? c.replaceRangeWith(u, u, o.content.firstChild) : c.replaceRange(u, u, o), c.doc.eq(h))
    return;
  let f = c.doc.resolve(u);
  if (d && _.isSelectable(o.content.firstChild) && f.nodeAfter && f.nodeAfter.sameMarkup(o.content.firstChild))
    c.setSelection(new _(f));
  else {
    let p = c.mapping.map(a);
    c.mapping.maps[c.mapping.maps.length - 1].forEach((g, y, D, R) => p = R), c.setSelection(Ds(n, f, c.doc.resolve(p)));
  }
  n.focus(), n.dispatch(c.setMeta("uiEvent", "drop"));
};
Te.focus = (n) => {
  n.focused || (n.domObserver.stop(), n.dom.classList.add("ProseMirror-focused"), n.domObserver.start(), n.focused = !0, setTimeout(() => {
    n.docView && n.hasFocus() && !n.domObserver.currentSelection.eq(n.domSelection()) && Et(n);
  }, 20));
};
Te.blur = (n, e) => {
  let t = e;
  n.focused && (n.domObserver.stop(), n.dom.classList.remove("ProseMirror-focused"), n.domObserver.start(), t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(), n.focused = !1);
};
Te.beforeinput = (n, e) => {
  if (Ce && qe && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: r } = n.input;
    setTimeout(() => {
      if (n.input.domChangeCount != r || (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (s) => s(n, tn(8, "Backspace")))))
        return;
      let { $cursor: i } = n.state.selection;
      i && i.pos > 0 && n.dispatch(n.state.tr.delete(i.pos - 1, i.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in Se)
  Te[n] = Se[n];
function Vn(n, e) {
  if (n == e)
    return !0;
  for (let t in n)
    if (n[t] !== e[t])
      return !1;
  for (let t in e)
    if (!(t in n))
      return !1;
  return !0;
}
class Cs {
  constructor(e, t) {
    this.toDOM = e, this.spec = t || _t, this.side = this.spec.side || 0;
  }
  map(e, t, r, i) {
    let { pos: s, deleted: o } = e.mapResult(t.from + i, this.side < 0 ? -1 : 1);
    return o ? null : new we(s - r, s - r, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return this == e || e instanceof Cs && (this.spec.key && this.spec.key == e.spec.key || this.toDOM == e.toDOM && Vn(this.spec, e.spec));
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class yt {
  constructor(e, t) {
    this.attrs = e, this.spec = t || _t;
  }
  map(e, t, r, i) {
    let s = e.map(t.from + i, this.spec.inclusiveStart ? -1 : 1) - r, o = e.map(t.to + i, this.spec.inclusiveEnd ? 1 : -1) - r;
    return s >= o ? null : new we(s, o, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || e instanceof yt && Vn(this.attrs, e.attrs) && Vn(this.spec, e.spec);
  }
  static is(e) {
    return e.type instanceof yt;
  }
  destroy() {
  }
}
class Ss {
  constructor(e, t) {
    this.attrs = e, this.spec = t || _t;
  }
  map(e, t, r, i) {
    let s = e.mapResult(t.from + i, 1);
    if (s.deleted)
      return null;
    let o = e.mapResult(t.to + i, -1);
    return o.deleted || o.pos <= s.pos ? null : new we(s.pos - r, o.pos - r, this);
  }
  valid(e, t) {
    let { index: r, offset: i } = e.content.findIndex(t.from), s;
    return i == t.from && !(s = e.child(r)).isText && i + s.nodeSize == t.to;
  }
  eq(e) {
    return this == e || e instanceof Ss && Vn(this.attrs, e.attrs) && Vn(this.spec, e.spec);
  }
  destroy() {
  }
}
class we {
  constructor(e, t, r) {
    this.from = e, this.to = t, this.type = r;
  }
  copy(e, t) {
    return new we(e, t, this.type);
  }
  eq(e, t = 0) {
    return this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to;
  }
  map(e, t, r) {
    return this.type.map(e, this, t, r);
  }
  static widget(e, t, r) {
    return new we(e, e, new Cs(t, r));
  }
  static inline(e, t, r, i) {
    return new we(e, t, new yt(r, i));
  }
  static node(e, t, r, i) {
    return new we(e, t, new Ss(r, i));
  }
  get spec() {
    return this.type.spec;
  }
  get inline() {
    return this.type instanceof yt;
  }
}
const Zt = [], _t = {};
class se {
  constructor(e, t) {
    this.local = e.length ? e : Zt, this.children = t.length ? t : Zt;
  }
  static create(e, t) {
    return t.length ? kr(t, e, 0, _t) : De;
  }
  find(e, t, r) {
    let i = [];
    return this.findInner(e == null ? 0 : e, t == null ? 1e9 : t, i, 0, r), i;
  }
  findInner(e, t, r, i, s) {
    for (let o = 0; o < this.local.length; o++) {
      let l = this.local[o];
      l.from <= t && l.to >= e && (!s || s(l.spec)) && r.push(l.copy(l.from + i, l.to + i));
    }
    for (let o = 0; o < this.children.length; o += 3)
      if (this.children[o] < t && this.children[o + 1] > e) {
        let l = this.children[o] + 1;
        this.children[o + 2].findInner(e - l, t - l, r, i + l, s);
      }
  }
  map(e, t, r) {
    return this == De || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, r || _t);
  }
  mapInner(e, t, r, i, s) {
    let o;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l].map(e, r, i);
      a && a.type.valid(t, a) ? (o || (o = [])).push(a) : s.onRemove && s.onRemove(this.local[l].spec);
    }
    return this.children.length ? Nd(this.children, o || [], e, t, r, i, s) : o ? new se(o.sort(zt), Zt) : De;
  }
  add(e, t) {
    return t.length ? this == De ? se.create(e, t) : this.addInner(e, t, 0) : this;
  }
  addInner(e, t, r) {
    let i, s = 0;
    e.forEach((l, a) => {
      let c = a + r, u;
      if (!!(u = wa(t, l, c))) {
        for (i || (i = this.children.slice()); s < i.length && i[s] < a; )
          s += 3;
        i[s] == a ? i[s + 2] = i[s + 2].addInner(l, u, c + 1) : i.splice(s, 0, a, a + l.nodeSize, kr(u, l, c + 1, _t)), s += 3;
      }
    });
    let o = Aa(s ? Ma(t) : t, -r);
    for (let l = 0; l < o.length; l++)
      o[l].type.valid(e, o[l]) || o.splice(l--, 1);
    return new se(o.length ? this.local.concat(o).sort(zt) : this.local, i || this.children);
  }
  remove(e) {
    return e.length == 0 || this == De ? this : this.removeInner(e, 0);
  }
  removeInner(e, t) {
    let r = this.children, i = this.local;
    for (let s = 0; s < r.length; s += 3) {
      let o, l = r[s] + t, a = r[s + 1] + t;
      for (let u = 0, d; u < e.length; u++)
        (d = e[u]) && d.from > l && d.to < a && (e[u] = null, (o || (o = [])).push(d));
      if (!o)
        continue;
      r == this.children && (r = this.children.slice());
      let c = r[s + 2].removeInner(o, l + 1);
      c != De ? r[s + 2] = c : (r.splice(s, 3), s -= 3);
    }
    if (i.length) {
      for (let s = 0, o; s < e.length; s++)
        if (o = e[s])
          for (let l = 0; l < i.length; l++)
            i[l].eq(o, t) && (i == this.local && (i = this.local.slice()), i.splice(l--, 1));
    }
    return r == this.children && i == this.local ? this : i.length || r.length ? new se(i, r) : De;
  }
  forChild(e, t) {
    if (this == De)
      return this;
    if (t.isLeaf)
      return se.empty;
    let r, i;
    for (let l = 0; l < this.children.length; l += 3)
      if (this.children[l] >= e) {
        this.children[l] == e && (r = this.children[l + 2]);
        break;
      }
    let s = e + 1, o = s + t.content.size;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l];
      if (a.from < o && a.to > s && a.type instanceof yt) {
        let c = Math.max(s, a.from) - s, u = Math.min(o, a.to) - s;
        c < u && (i || (i = [])).push(a.copy(c, u));
      }
    }
    if (i) {
      let l = new se(i.sort(zt), Zt);
      return r ? new ht([l, r]) : l;
    }
    return r || De;
  }
  eq(e) {
    if (this == e)
      return !0;
    if (!(e instanceof se) || this.local.length != e.local.length || this.children.length != e.children.length)
      return !1;
    for (let t = 0; t < this.local.length; t++)
      if (!this.local[t].eq(e.local[t]))
        return !1;
    for (let t = 0; t < this.children.length; t += 3)
      if (this.children[t] != e.children[t] || this.children[t + 1] != e.children[t + 1] || !this.children[t + 2].eq(e.children[t + 2]))
        return !1;
    return !0;
  }
  locals(e) {
    return As(this.localsInner(e));
  }
  localsInner(e) {
    if (this == De)
      return Zt;
    if (e.inlineContent || !this.local.some(yt.is))
      return this.local;
    let t = [];
    for (let r = 0; r < this.local.length; r++)
      this.local[r].type instanceof yt || t.push(this.local[r]);
    return t;
  }
}
se.empty = new se([], []);
se.removeOverlap = As;
const De = se.empty;
class ht {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const r = this.members.map((i) => i.map(e, t, _t));
    return ht.from(r);
  }
  forChild(e, t) {
    if (t.isLeaf)
      return se.empty;
    let r = [];
    for (let i = 0; i < this.members.length; i++) {
      let s = this.members[i].forChild(e, t);
      s != De && (s instanceof ht ? r = r.concat(s.members) : r.push(s));
    }
    return ht.from(r);
  }
  eq(e) {
    if (!(e instanceof ht) || e.members.length != this.members.length)
      return !1;
    for (let t = 0; t < this.members.length; t++)
      if (!this.members[t].eq(e.members[t]))
        return !1;
    return !0;
  }
  locals(e) {
    let t, r = !0;
    for (let i = 0; i < this.members.length; i++) {
      let s = this.members[i].localsInner(e);
      if (!!s.length)
        if (!t)
          t = s;
        else {
          r && (t = t.slice(), r = !1);
          for (let o = 0; o < s.length; o++)
            t.push(s[o]);
        }
    }
    return t ? As(r ? t : t.sort(zt)) : Zt;
  }
  static from(e) {
    switch (e.length) {
      case 0:
        return De;
      case 1:
        return e[0];
      default:
        return new ht(e);
    }
  }
}
function Nd(n, e, t, r, i, s, o) {
  let l = n.slice(), a = (u, d, h, f) => {
    for (let p = 0; p < l.length; p += 3) {
      let g = l[p + 1], y;
      if (g < 0 || u > g + s)
        continue;
      let D = l[p] + s;
      d >= D ? l[p + 1] = u <= D ? -2 : -1 : h >= i && (y = f - h - (d - u)) && (l[p] += y, l[p + 1] += y);
    }
  };
  for (let u = 0; u < t.maps.length; u++)
    t.maps[u].forEach(a);
  let c = !1;
  for (let u = 0; u < l.length; u += 3)
    if (l[u + 1] < 0) {
      if (l[u + 1] == -2) {
        c = !0, l[u + 1] = -1;
        continue;
      }
      let d = t.map(n[u] + s), h = d - i;
      if (h < 0 || h >= r.content.size) {
        c = !0;
        continue;
      }
      let f = t.map(n[u + 1] + s, -1), p = f - i, { index: g, offset: y } = r.content.findIndex(h), D = r.maybeChild(g);
      if (D && y == h && y + D.nodeSize == p) {
        let R = l[u + 2].mapInner(t, D, d + 1, n[u] + s + 1, o);
        R != De ? (l[u] = h, l[u + 1] = p, l[u + 2] = R) : (l[u + 1] = -2, c = !0);
      } else
        c = !0;
    }
  if (c) {
    let u = Fd(l, n, e, t, i, s, o), d = kr(u, r, 0, o);
    e = d.local;
    for (let h = 0; h < l.length; h += 3)
      l[h + 1] < 0 && (l.splice(h, 3), h -= 3);
    for (let h = 0, f = 0; h < d.children.length; h += 3) {
      let p = d.children[h];
      for (; f < l.length && l[f] < p; )
        f += 3;
      l.splice(f, 0, d.children[h], d.children[h + 1], d.children[h + 2]);
    }
  }
  return new se(e.sort(zt), l);
}
function Aa(n, e) {
  if (!e || !n.length)
    return n;
  let t = [];
  for (let r = 0; r < n.length; r++) {
    let i = n[r];
    t.push(new we(i.from + e, i.to + e, i.type));
  }
  return t;
}
function Fd(n, e, t, r, i, s, o) {
  function l(a, c) {
    for (let u = 0; u < a.local.length; u++) {
      let d = a.local[u].map(r, i, c);
      d ? t.push(d) : o.onRemove && o.onRemove(a.local[u].spec);
    }
    for (let u = 0; u < a.children.length; u += 3)
      l(a.children[u + 2], a.children[u] + c + 1);
  }
  for (let a = 0; a < n.length; a += 3)
    n[a + 1] == -1 && l(n[a + 2], e[a] + s + 1);
  return t;
}
function wa(n, e, t) {
  if (e.isLeaf)
    return null;
  let r = t + e.nodeSize, i = null;
  for (let s = 0, o; s < n.length; s++)
    (o = n[s]) && o.from > t && o.to < r && ((i || (i = [])).push(o), n[s] = null);
  return i;
}
function Ma(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    n[t] != null && e.push(n[t]);
  return e;
}
function kr(n, e, t, r) {
  let i = [], s = !1;
  e.forEach((l, a) => {
    let c = wa(n, l, a + t);
    if (c) {
      s = !0;
      let u = kr(c, l, t + a + 1, r);
      u != De && i.push(a, a + l.nodeSize, u);
    }
  });
  let o = Aa(s ? Ma(n) : n, -t).sort(zt);
  for (let l = 0; l < o.length; l++)
    o[l].type.valid(e, o[l]) || (r.onRemove && r.onRemove(o[l].spec), o.splice(l--, 1));
  return o.length || i.length ? new se(o, i) : De;
}
function zt(n, e) {
  return n.from - e.from || n.to - e.to;
}
function As(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let r = e[t];
    if (r.from != r.to)
      for (let i = t + 1; i < e.length; i++) {
        let s = e[i];
        if (s.from == r.from) {
          s.to != r.to && (e == n && (e = n.slice()), e[i] = s.copy(s.from, r.to), Bo(e, i + 1, s.copy(r.to, s.to)));
          continue;
        } else {
          s.from < r.to && (e == n && (e = n.slice()), e[t] = r.copy(r.from, s.from), Bo(e, i, r.copy(s.from, r.to)));
          break;
        }
      }
  }
  return e;
}
function Bo(n, e, t) {
  for (; e < n.length && zt(t, n[e]) > 0; )
    e++;
  n.splice(e, 0, t);
}
function Fi(n) {
  let e = [];
  return n.someProp("decorations", (t) => {
    let r = t(n.state);
    r && r != De && e.push(r);
  }), n.cursorWrapper && e.push(se.create(n.state.doc, [n.cursorWrapper.deco])), ht.from(e);
}
const Rd = {
  childList: !0,
  characterData: !0,
  characterDataOldValue: !0,
  attributes: !0,
  attributeOldValue: !0,
  subtree: !0
}, Bd = Re && mt <= 11;
class Id {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  set(e) {
    this.anchorNode = e.anchorNode, this.anchorOffset = e.anchorOffset, this.focusNode = e.focusNode, this.focusOffset = e.focusOffset;
  }
  clear() {
    this.anchorNode = this.focusNode = null;
  }
  eq(e) {
    return e.anchorNode == this.anchorNode && e.anchorOffset == this.anchorOffset && e.focusNode == this.focusNode && e.focusOffset == this.focusOffset;
  }
}
class Pd {
  constructor(e, t) {
    this.view = e, this.handleDOMChange = t, this.queue = [], this.flushingSoon = -1, this.observer = null, this.currentSelection = new Id(), this.onCharData = null, this.suppressingSelectionUpdates = !1, this.observer = window.MutationObserver && new window.MutationObserver((r) => {
      for (let i = 0; i < r.length; i++)
        this.queue.push(r[i]);
      Re && mt <= 11 && r.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), Bd && (this.onCharData = (r) => {
      this.queue.push({ target: r.target, type: "characterData", oldValue: r.prevValue }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this);
  }
  flushSoon() {
    this.flushingSoon < 0 && (this.flushingSoon = window.setTimeout(() => {
      this.flushingSoon = -1, this.flush();
    }, 20));
  }
  forceFlush() {
    this.flushingSoon > -1 && (window.clearTimeout(this.flushingSoon), this.flushingSoon = -1, this.flush());
  }
  start() {
    this.observer && this.observer.observe(this.view.dom, Rd), this.onCharData && this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.connectSelection();
  }
  stop() {
    if (this.observer) {
      let e = this.observer.takeRecords();
      if (e.length) {
        for (let t = 0; t < e.length; t++)
          this.queue.push(e[t]);
        window.setTimeout(() => this.flush(), 20);
      }
      this.observer.disconnect();
    }
    this.onCharData && this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData), this.disconnectSelection();
  }
  connectSelection() {
    this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
  }
  disconnectSelection() {
    this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
  }
  suppressSelectionUpdates() {
    this.suppressingSelectionUpdates = !0, setTimeout(() => this.suppressingSelectionUpdates = !1, 50);
  }
  onSelectionChange() {
    if (!!Mo(this.view)) {
      if (this.suppressingSelectionUpdates)
        return Et(this.view);
      if (Re && mt <= 11 && !this.view.state.selection.empty) {
        let e = this.view.domSelection();
        if (e.focusNode && jn(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
          return this.flushSoon();
      }
      this.flush();
    }
  }
  setCurSelection() {
    this.currentSelection.set(this.view.domSelection());
  }
  ignoreSelectionChange(e) {
    if (e.rangeCount == 0)
      return !0;
    let t = e.getRangeAt(0).commonAncestorContainer, r = this.view.docView.nearestDesc(t);
    if (r && r.ignoreMutation({
      type: "selection",
      target: t.nodeType == 3 ? t.parentNode : t
    }))
      return this.setCurSelection(), !0;
  }
  flush() {
    if (!this.view.docView || this.flushingSoon > -1)
      return;
    let e = this.observer ? this.observer.takeRecords() : [];
    this.queue.length && (e = this.queue.concat(e), this.queue.length = 0);
    let t = this.view.domSelection(), r = !this.suppressingSelectionUpdates && !this.currentSelection.eq(t) && Mo(this.view) && !this.ignoreSelectionChange(t), i = -1, s = -1, o = !1, l = [];
    if (this.view.editable)
      for (let a = 0; a < e.length; a++) {
        let c = this.registerMutation(e[a], l);
        c && (i = i < 0 ? c.from : Math.min(c.from, i), s = s < 0 ? c.to : Math.max(c.to, s), c.typeOver && (o = !0));
      }
    if (Qe && l.length > 1) {
      let a = l.filter((c) => c.nodeName == "BR");
      if (a.length == 2) {
        let c = a[0], u = a[1];
        c.parentNode && c.parentNode.parentNode == u.parentNode ? u.remove() : c.remove();
      }
    }
    (i > -1 || r) && (i > -1 && (this.view.docView.markDirty(i, s), Ld(this.view)), this.handleDOMChange(i, s, o, l), this.view.docView && this.view.docView.dirty ? this.view.updateState(this.view.state) : this.currentSelection.eq(t) || Et(this.view), this.currentSelection.set(t));
  }
  registerMutation(e, t) {
    if (t.indexOf(e.target) > -1)
      return null;
    let r = this.view.docView.nearestDesc(e.target);
    if (e.type == "attributes" && (r == this.view.docView || e.attributeName == "contenteditable" || e.attributeName == "style" && !e.oldValue && !e.target.getAttribute("style")) || !r || r.ignoreMutation(e))
      return null;
    if (e.type == "childList") {
      for (let u = 0; u < e.addedNodes.length; u++)
        t.push(e.addedNodes[u]);
      if (r.contentDOM && r.contentDOM != r.dom && !r.contentDOM.contains(e.target))
        return { from: r.posBefore, to: r.posAfter };
      let i = e.previousSibling, s = e.nextSibling;
      if (Re && mt <= 11 && e.addedNodes.length)
        for (let u = 0; u < e.addedNodes.length; u++) {
          let { previousSibling: d, nextSibling: h } = e.addedNodes[u];
          (!d || Array.prototype.indexOf.call(e.addedNodes, d) < 0) && (i = d), (!h || Array.prototype.indexOf.call(e.addedNodes, h) < 0) && (s = h);
        }
      let o = i && i.parentNode == e.target ? Ne(i) + 1 : 0, l = r.localPosFromDOM(e.target, o, -1), a = s && s.parentNode == e.target ? Ne(s) : e.target.childNodes.length, c = r.localPosFromDOM(e.target, a, 1);
      return { from: l, to: c };
    } else
      return e.type == "attributes" ? { from: r.posAtStart - r.border, to: r.posAtEnd + r.border } : {
        from: r.posAtStart,
        to: r.posAtEnd,
        typeOver: e.target.nodeValue == e.oldValue
      };
  }
}
let Io = !1;
function Ld(n) {
  Io || (Io = !0, getComputedStyle(n.dom).whiteSpace == "normal" && console.warn("ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package."));
}
function _d(n, e, t) {
  let { node: r, fromOffset: i, toOffset: s, from: o, to: l } = n.docView.parseRange(e, t), a = n.domSelection(), c, u = a.anchorNode;
  if (u && n.dom.contains(u.nodeType == 1 ? u : u.parentNode) && (c = [{ node: u, offset: a.anchorOffset }], ys(a) || c.push({ node: a.focusNode, offset: a.focusOffset })), Ce && n.input.lastKeyCode === 8)
    for (let y = s; y > i; y--) {
      let D = r.childNodes[y - 1], R = D.pmViewDesc;
      if (D.nodeName == "BR" && !R) {
        s = y;
        break;
      }
      if (!R || R.size)
        break;
    }
  let d = n.state.doc, h = n.someProp("domParser") || fn.fromSchema(n.state.schema), f = d.resolve(o), p = null, g = h.parse(r, {
    topNode: f.parent,
    topMatch: f.parent.contentMatchAt(f.index()),
    topOpen: !0,
    from: i,
    to: s,
    preserveWhitespace: f.parent.type.whitespace == "pre" ? "full" : !0,
    findPositions: c,
    ruleFromNode: zd,
    context: f
  });
  if (c && c[0].pos != null) {
    let y = c[0].pos, D = c[1] && c[1].pos;
    D == null && (D = y), p = { anchor: y + o, head: D + o };
  }
  return { doc: g, sel: p, from: o, to: l };
}
function zd(n) {
  let e = n.pmViewDesc;
  if (e)
    return e.parseRule();
  if (n.nodeName == "BR" && n.parentNode) {
    if (Me && /^(ul|ol)$/i.test(n.parentNode.nodeName)) {
      let t = document.createElement("div");
      return t.appendChild(document.createElement("li")), { skip: t };
    } else if (n.parentNode.lastChild == n || Me && /^(tr|table)$/i.test(n.parentNode.nodeName))
      return { ignore: !0 };
  } else if (n.nodeName == "IMG" && n.getAttribute("mark-placeholder"))
    return { ignore: !0 };
  return null;
}
function Hd(n, e, t, r, i) {
  if (e < 0) {
    let T = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null, L = aa(n, T);
    if (L && !n.state.selection.eq(L)) {
      let te = n.state.tr.setSelection(L);
      T == "pointer" ? te.setMeta("pointer", !0) : T == "key" && te.scrollIntoView(), n.dispatch(te);
    }
    return;
  }
  let s = n.state.doc.resolve(e), o = s.sharedDepth(t);
  e = s.before(o + 1), t = n.state.doc.resolve(t).after(o + 1);
  let l = n.state.selection, a = _d(n, e, t);
  if (Ce && n.cursorWrapper && a.sel && a.sel.anchor == n.cursorWrapper.deco.from) {
    let T = n.cursorWrapper.deco.type.toDOM.nextSibling, L = T && T.nodeValue ? T.nodeValue.length : 1;
    a.sel = { anchor: a.sel.anchor + L, head: a.sel.anchor + L };
  }
  let c = n.state.doc, u = c.slice(a.from, a.to), d, h;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime ? (d = n.state.selection.to, h = "end") : (d = n.state.selection.from, h = "start"), n.input.lastKeyCode = null;
  let f = Vd(u.content, a.doc.content, a.from, d, h);
  if ((gn && n.input.lastIOSEnter > Date.now() - 225 || qe) && i.some((T) => T.nodeName == "DIV" || T.nodeName == "P") && (!f || f.endA >= f.endB) && n.someProp("handleKeyDown", (T) => T(n, tn(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!f)
    if (r && l instanceof $ && !l.empty && l.$head.sameParent(l.$anchor) && !n.composing && !(a.sel && a.sel.anchor != a.sel.head))
      f = { start: l.from, endA: l.to, endB: l.to };
    else {
      if (a.sel) {
        let T = Po(n, n.state.doc, a.sel);
        T && !T.eq(n.state.selection) && n.dispatch(n.state.tr.setSelection(T));
      }
      return;
    }
  n.input.domChangeCount++, n.state.selection.from < n.state.selection.to && f.start == f.endB && n.state.selection instanceof $ && (f.start > n.state.selection.from && f.start <= n.state.selection.from + 2 && n.state.selection.from >= a.from ? f.start = n.state.selection.from : f.endA < n.state.selection.to && f.endA >= n.state.selection.to - 2 && n.state.selection.to <= a.to && (f.endB += n.state.selection.to - f.endA, f.endA = n.state.selection.to)), Re && mt <= 11 && f.endB == f.start + 1 && f.endA == f.start && f.start > a.from && a.doc.textBetween(f.start - a.from - 1, f.start - a.from + 1) == " \xA0" && (f.start--, f.endA--, f.endB--);
  let p = a.doc.resolveNoCache(f.start - a.from), g = a.doc.resolveNoCache(f.endB - a.from), y = c.resolve(f.start), D = p.sameParent(g) && p.parent.inlineContent && y.end() >= f.endA, R;
  if ((gn && n.input.lastIOSEnter > Date.now() - 225 && (!D || i.some((T) => T.nodeName == "DIV" || T.nodeName == "P")) || !D && p.pos < a.doc.content.size && (R = V.findFrom(a.doc.resolve(p.pos + 1), 1, !0)) && R.head == g.pos) && n.someProp("handleKeyDown", (T) => T(n, tn(13, "Enter")))) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (n.state.selection.anchor > f.start && jd(c, f.start, f.endA, p, g) && n.someProp("handleKeyDown", (T) => T(n, tn(8, "Backspace")))) {
    qe && Ce && n.domObserver.suppressSelectionUpdates();
    return;
  }
  Ce && qe && f.endB == f.start && (n.input.lastAndroidDelete = Date.now()), qe && !D && p.start() != g.start() && g.parentOffset == 0 && p.depth == g.depth && a.sel && a.sel.anchor == a.sel.head && a.sel.head == f.endA && (f.endB -= 2, g = a.doc.resolveNoCache(f.endB - a.from), setTimeout(() => {
    n.someProp("handleKeyDown", function(T) {
      return T(n, tn(13, "Enter"));
    });
  }, 20));
  let P = f.start, z = f.endA, j, Q, G;
  if (D) {
    if (p.pos == g.pos)
      Re && mt <= 11 && p.parentOffset == 0 && (n.domObserver.suppressSelectionUpdates(), setTimeout(() => Et(n), 20)), j = n.state.tr.delete(P, z), Q = c.resolve(f.start).marksAcross(c.resolve(f.endA));
    else if (f.endA == f.endB && (G = $d(p.parent.content.cut(p.parentOffset, g.parentOffset), y.parent.content.cut(y.parentOffset, f.endA - y.start()))))
      j = n.state.tr, G.type == "add" ? j.addMark(P, z, G.mark) : j.removeMark(P, z, G.mark);
    else if (p.parent.child(p.index()).isText && p.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let T = p.parent.textBetween(p.parentOffset, g.parentOffset);
      if (n.someProp("handleTextInput", (L) => L(n, P, z, T)))
        return;
      j = n.state.tr.insertText(T, P, z);
    }
  }
  if (j || (j = n.state.tr.replace(P, z, a.doc.slice(f.start - a.from, f.endB - a.from))), a.sel) {
    let T = Po(n, j.doc, a.sel);
    T && !(Ce && qe && n.composing && T.empty && (f.start != f.endB || n.input.lastAndroidDelete < Date.now() - 100) && (T.head == P || T.head == j.mapping.map(z) - 1) || Re && T.empty && T.head == P) && j.setSelection(T);
  }
  Q && j.ensureMarks(Q), n.dispatch(j.scrollIntoView());
}
function Po(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size ? null : Ds(n, e.resolve(t.anchor), e.resolve(t.head));
}
function $d(n, e) {
  let t = n.firstChild.marks, r = e.firstChild.marks, i = t, s = r, o, l, a;
  for (let u = 0; u < r.length; u++)
    i = r[u].removeFromSet(i);
  for (let u = 0; u < t.length; u++)
    s = t[u].removeFromSet(s);
  if (i.length == 1 && s.length == 0)
    l = i[0], o = "add", a = (u) => u.mark(l.addToSet(u.marks));
  else if (i.length == 0 && s.length == 1)
    l = s[0], o = "remove", a = (u) => u.mark(l.removeFromSet(u.marks));
  else
    return null;
  let c = [];
  for (let u = 0; u < e.childCount; u++)
    c.push(a(e.child(u)));
  if (k.from(c).eq(n))
    return { mark: l, type: o };
}
function jd(n, e, t, r, i) {
  if (!r.parent.isTextblock || t - e <= i.pos - r.pos || Ri(r, !0, !1) < i.pos)
    return !1;
  let s = n.resolve(e);
  if (s.parentOffset < s.parent.content.size || !s.parent.isTextblock)
    return !1;
  let o = n.resolve(Ri(s, !0, !0));
  return !o.parent.isTextblock || o.pos > t || Ri(o, !0, !1) < t ? !1 : r.parent.content.cut(r.parentOffset).eq(o.parent.content);
}
function Ri(n, e, t) {
  let r = n.depth, i = e ? n.end() : n.pos;
  for (; r > 0 && (e || n.indexAfter(r) == n.node(r).childCount); )
    r--, i++, e = !1;
  if (t) {
    let s = n.node(r).maybeChild(n.indexAfter(r));
    for (; s && !s.isLeaf; )
      s = s.firstChild, i++;
  }
  return i;
}
function Vd(n, e, t, r, i) {
  let s = n.findDiffStart(e, t);
  if (s == null)
    return null;
  let { a: o, b: l } = n.findDiffEnd(e, t + n.size, t + e.size);
  if (i == "end") {
    let a = Math.max(0, s - Math.min(o, l));
    r -= o + a - s;
  }
  return o < s && n.size < e.size ? (s -= r <= s && r >= o ? s - r : 0, l = s + (l - o), o = s) : l < s && (s -= r <= s && r >= l ? s - r : 0, o = s + (o - l), l = s), { start: s, endA: o, endB: l };
}
class Ud {
  constructor(e, t) {
    this._root = null, this.focused = !1, this.trackWrites = null, this.mounted = !1, this.markCursor = null, this.cursorWrapper = null, this.lastSelectedViewDesc = void 0, this.input = new hd(), this.prevDirectPlugins = [], this.pluginViews = [], this.dragging = null, this._props = t, this.state = t.state, this.directPlugins = t.plugins || [], this.directPlugins.forEach($o), this.dispatch = this.dispatch.bind(this), this.dom = e && e.mount || document.createElement("div"), e && (e.appendChild ? e.appendChild(this.dom) : typeof e == "function" ? e(this.dom) : e.mount && (this.mounted = !0)), this.editable = zo(this), _o(this), this.nodeViews = Ho(this), this.docView = xo(this.state.doc, Lo(this), Fi(this), this.dom, this), this.domObserver = new Pd(this, (r, i, s, o) => Hd(this, r, i, s, o)), this.domObserver.start(), fd(this), this.updatePluginViews();
  }
  get composing() {
    return this.input.composing;
  }
  get props() {
    if (this._props.state != this.state) {
      let e = this._props;
      this._props = {};
      for (let t in e)
        this._props[t] = e[t];
      this._props.state = this.state;
    }
    return this._props;
  }
  update(e) {
    e.handleDOMEvents != this._props.handleDOMEvents && ns(this), this._props = e, e.plugins && (e.plugins.forEach($o), this.directPlugins = e.plugins), this.updateStateInner(e.state, !0);
  }
  setProps(e) {
    let t = {};
    for (let r in this._props)
      t[r] = this._props[r];
    t.state = this.state;
    for (let r in e)
      t[r] = e[r];
    this.update(t);
  }
  updateState(e) {
    this.updateStateInner(e, this.state.plugins != e.plugins);
  }
  updateStateInner(e, t) {
    let r = this.state, i = !1, s = !1;
    if (e.storedMarks && this.composing && (Ca(this), s = !0), this.state = e, t) {
      let d = Ho(this);
      Wd(d, this.nodeViews) && (this.nodeViews = d, i = !0), ns(this);
    }
    this.editable = zo(this), _o(this);
    let o = Fi(this), l = Lo(this), a = t ? "reset" : e.scrollToSelection > r.scrollToSelection ? "to selection" : "preserve", c = i || !this.docView.matchesNode(e.doc, l, o);
    (c || !e.selection.eq(r.selection)) && (s = !0);
    let u = a == "preserve" && s && this.dom.style.overflowAnchor == null && Fc(this);
    if (s) {
      this.domObserver.stop();
      let d = c && (Re || Ce) && !this.composing && !r.selection.empty && !e.selection.empty && Kd(r.selection, e.selection);
      if (c) {
        let h = Ce ? this.trackWrites = this.domSelection().focusNode : null;
        (i || !this.docView.update(e.doc, l, o, this)) && (this.docView.updateOuterDeco([]), this.docView.destroy(), this.docView = xo(e.doc, l, o, this.dom, this)), h && !this.trackWrites && (d = !0);
      }
      d || !(this.input.mouseDown && this.domObserver.currentSelection.eq(this.domSelection()) && rd(this)) ? Et(this, d) : (ca(this, e.selection), this.domObserver.setCurSelection()), this.domObserver.start();
    }
    if (this.updatePluginViews(r), a == "reset")
      this.dom.scrollTop = 0;
    else if (a == "to selection") {
      let d = this.domSelection().focusNode;
      if (!this.someProp("handleScrollToSelection", (h) => h(this)))
        if (e.selection instanceof _) {
          let h = this.docView.domAfterPos(e.selection.from);
          h.nodeType == 1 && mo(this, h.getBoundingClientRect(), d);
        } else
          mo(this, this.coordsAtPos(e.selection.head, 1), d);
    } else
      u && Rc(u);
  }
  destroyPluginViews() {
    let e;
    for (; e = this.pluginViews.pop(); )
      e.destroy && e.destroy();
  }
  updatePluginViews(e) {
    if (!e || e.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
      this.prevDirectPlugins = this.directPlugins, this.destroyPluginViews();
      for (let t = 0; t < this.directPlugins.length; t++) {
        let r = this.directPlugins[t];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
      for (let t = 0; t < this.state.plugins.length; t++) {
        let r = this.state.plugins[t];
        r.spec.view && this.pluginViews.push(r.spec.view(this));
      }
    } else
      for (let t = 0; t < this.pluginViews.length; t++) {
        let r = this.pluginViews[t];
        r.update && r.update(this, e);
      }
  }
  someProp(e, t) {
    let r = this._props && this._props[e], i;
    if (r != null && (i = t ? t(r) : r))
      return i;
    for (let o = 0; o < this.directPlugins.length; o++) {
      let l = this.directPlugins[o].props[e];
      if (l != null && (i = t ? t(l) : l))
        return i;
    }
    let s = this.state.plugins;
    if (s)
      for (let o = 0; o < s.length; o++) {
        let l = s[o].props[e];
        if (l != null && (i = t ? t(l) : l))
          return i;
      }
  }
  hasFocus() {
    return this.root.activeElement == this.dom;
  }
  focus() {
    this.domObserver.stop(), this.editable && Bc(this.dom), Et(this), this.domObserver.start();
  }
  get root() {
    let e = this._root;
    if (e == null) {
      for (let t = this.dom.parentNode; t; t = t.parentNode)
        if (t.nodeType == 9 || t.nodeType == 11 && t.host)
          return t.getSelection || (Object.getPrototypeOf(t).getSelection = () => t.ownerDocument.getSelection()), this._root = t;
    }
    return e || document;
  }
  posAtCoords(e) {
    return zc(this, e);
  }
  coordsAtPos(e, t = 1) {
    return ta(this, e, t);
  }
  domAtPos(e, t = 0) {
    return this.docView.domFromPos(e, t);
  }
  nodeDOM(e) {
    let t = this.docView.descAt(e);
    return t ? t.nodeDOM : null;
  }
  posAtDOM(e, t, r = -1) {
    let i = this.docView.posFromDOM(e, t, r);
    if (i == null)
      throw new RangeError("DOM position not inside the editor");
    return i;
  }
  endOfTextblock(e, t) {
    return Uc(this, t || this.state, e);
  }
  destroy() {
    !this.docView || (pd(this), this.destroyPluginViews(), this.mounted ? (this.docView.update(this.state.doc, [], Fi(this), this), this.dom.textContent = "") : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom), this.docView.destroy(), this.docView = null);
  }
  get isDestroyed() {
    return this.docView == null;
  }
  dispatchEvent(e) {
    return md(this, e);
  }
  dispatch(e) {
    let t = this._props.dispatchTransaction;
    t ? t.call(this, e) : this.updateState(this.state.apply(e));
  }
  domSelection() {
    return this.root.getSelection();
  }
}
function Lo(n) {
  let e = /* @__PURE__ */ Object.create(null);
  return e.class = "ProseMirror", e.contenteditable = String(n.editable), e.translate = "no", n.someProp("attributes", (t) => {
    if (typeof t == "function" && (t = t(n.state)), t)
      for (let r in t)
        r == "class" && (e.class += " " + t[r]), r == "style" ? e.style = (e.style ? e.style + ";" : "") + t[r] : !e[r] && r != "contenteditable" && r != "nodeName" && (e[r] = String(t[r]));
  }), [we.node(0, n.state.doc.content.size, e)];
}
function _o(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    e.className = "ProseMirror-separator", e.setAttribute("mark-placeholder", "true"), e.setAttribute("alt", ""), n.cursorWrapper = { dom: e, deco: we.widget(n.state.selection.head, e, { raw: !0, marks: n.markCursor }) };
  } else
    n.cursorWrapper = null;
}
function zo(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function Kd(n, e) {
  let t = Math.min(n.$anchor.sharedDepth(n.head), e.$anchor.sharedDepth(e.head));
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function Ho(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(r) {
    for (let i in r)
      Object.prototype.hasOwnProperty.call(e, i) || (e[i] = r[i]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function Wd(n, e) {
  let t = 0, r = 0;
  for (let i in n) {
    if (n[i] != e[i])
      return !0;
    t++;
  }
  for (let i in e)
    r++;
  return t != r;
}
function $o(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
var xt = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, Cr = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, jo = typeof navigator < "u" && /Chrome\/(\d+)/.exec(navigator.userAgent);
typeof navigator < "u" && /Gecko\/\d+/.test(navigator.userAgent);
var qd = typeof navigator < "u" && /Mac/.test(navigator.platform), Jd = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent), Gd = qd || jo && +jo[1] < 57;
for (var ge = 0; ge < 10; ge++)
  xt[48 + ge] = xt[96 + ge] = String(ge);
for (var ge = 1; ge <= 24; ge++)
  xt[ge + 111] = "F" + ge;
for (var ge = 65; ge <= 90; ge++)
  xt[ge] = String.fromCharCode(ge + 32), Cr[ge] = String.fromCharCode(ge);
for (var Bi in xt)
  Cr.hasOwnProperty(Bi) || (Cr[Bi] = xt[Bi]);
function Yd(n) {
  var e = Gd && (n.ctrlKey || n.altKey || n.metaKey) || Jd && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? Cr : xt)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
const Xd = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
function Qd(n) {
  let e = n.split(/-(?!$)/), t = e[e.length - 1];
  t == "Space" && (t = " ");
  let r, i, s, o;
  for (let l = 0; l < e.length - 1; l++) {
    let a = e[l];
    if (/^(cmd|meta|m)$/i.test(a))
      o = !0;
    else if (/^a(lt)?$/i.test(a))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(a))
      i = !0;
    else if (/^s(hift)?$/i.test(a))
      s = !0;
    else if (/^mod$/i.test(a))
      Xd ? o = !0 : i = !0;
    else
      throw new Error("Unrecognized modifier name: " + a);
  }
  return r && (t = "Alt-" + t), i && (t = "Ctrl-" + t), o && (t = "Meta-" + t), s && (t = "Shift-" + t), t;
}
function Zd(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n)
    e[Qd(t)] = n[t];
  return e;
}
function Ii(n, e, t) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t !== !1 && e.shiftKey && (n = "Shift-" + n), n;
}
function eh(n) {
  return new ye({ props: { handleKeyDown: Ta(n) } });
}
function Ta(n) {
  let e = Zd(n);
  return function(t, r) {
    let i = Yd(r), s = i.length == 1 && i != " ", o, l = e[Ii(i, r, !s)];
    if (l && l(t.state, t.dispatch, t))
      return !0;
    if (s && (r.shiftKey || r.altKey || r.metaKey || i.charCodeAt(0) > 127) && (o = xt[r.keyCode]) && o != i) {
      let a = e[Ii(o, r, !0)];
      if (a && a(t.state, t.dispatch, t))
        return !0;
    } else if (s && r.shiftKey) {
      let a = e[Ii(i, r, !0)];
      if (a && a(t.state, t.dispatch, t))
        return !0;
    }
    return !1;
  };
}
const th = (n, e) => n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0), nh = (n, e, t) => {
  let { $cursor: r } = n.selection;
  if (!r || (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0))
    return !1;
  let i = Oa(r);
  if (!i) {
    let o = r.blockRange(), l = o && Dn(o);
    return l == null ? !1 : (e && e(n.tr.lift(o, l).scrollIntoView()), !0);
  }
  let s = i.nodeBefore;
  if (!s.type.spec.isolating && Fa(n, i, e))
    return !0;
  if (r.parent.content.size == 0 && (yn(s, "end") || _.isSelectable(s))) {
    let o = ps(n.doc, r.before(), r.after(), O.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let l = n.tr.step(o);
        l.setSelection(yn(s, "end") ? V.findFrom(l.doc.resolve(l.mapping.map(i.pos, -1)), -1) : _.create(l.doc, i.pos - s.nodeSize)), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos - s.nodeSize, i.pos).scrollIntoView()), !0) : !1;
};
function yn(n, e, t = !1) {
  for (let r = n; r; r = e == "start" ? r.firstChild : r.lastChild) {
    if (r.isTextblock)
      return !0;
    if (t && r.childCount != 1)
      return !1;
  }
  return !1;
}
const rh = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : r.parentOffset > 0)
      return !1;
    s = Oa(r);
  }
  let o = s && s.nodeBefore;
  return !o || !_.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(_.create(n.doc, s.pos - o.nodeSize)).scrollIntoView()), !0);
};
function Oa(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0)
        return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating)
        break;
    }
  return null;
}
const ih = (n, e, t) => {
  let { $cursor: r } = n.selection;
  if (!r || (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size))
    return !1;
  let i = va(r);
  if (!i)
    return !1;
  let s = i.nodeAfter;
  if (Fa(n, i, e))
    return !0;
  if (r.parent.content.size == 0 && (yn(s, "start") || _.isSelectable(s))) {
    let o = ps(n.doc, r.before(), r.after(), O.empty);
    if (o && o.slice.size < o.to - o.from) {
      if (e) {
        let l = n.tr.step(o);
        l.setSelection(yn(s, "start") ? V.findFrom(l.doc.resolve(l.mapping.map(i.pos)), 1) : _.create(l.doc, l.mapping.map(i.pos))), e(l.scrollIntoView());
      }
      return !0;
    }
  }
  return s.isAtom && i.depth == r.depth - 1 ? (e && e(n.tr.delete(i.pos, i.pos + s.nodeSize).scrollIntoView()), !0) : !1;
}, sh = (n, e, t) => {
  let { $head: r, empty: i } = n.selection, s = r;
  if (!i)
    return !1;
  if (r.parent.isTextblock) {
    if (t ? !t.endOfTextblock("forward", n) : r.parentOffset < r.parent.content.size)
      return !1;
    s = va(r);
  }
  let o = s && s.nodeAfter;
  return !o || !_.isSelectable(o) ? !1 : (e && e(n.tr.setSelection(_.create(n.doc, s.pos)).scrollIntoView()), !0);
};
function va(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      let t = n.node(e);
      if (n.index(e) + 1 < t.childCount)
        return n.doc.resolve(n.after(e + 1));
      if (t.type.spec.isolating)
        break;
    }
  return null;
}
const oh = (n, e) => {
  let { $from: t, $to: r } = n.selection, i = t.blockRange(r), s = i && Dn(i);
  return s == null ? !1 : (e && e(n.tr.lift(i, s).scrollIntoView()), !0);
}, lh = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  return !t.parent.type.spec.code || !t.sameParent(r) ? !1 : (e && e(n.tr.insertText(`
`).scrollIntoView()), !0);
};
function Na(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
const ah = (n, e) => {
  let { $head: t, $anchor: r } = n.selection;
  if (!t.parent.type.spec.code || !t.sameParent(r))
    return !1;
  let i = t.node(-1), s = t.indexAfter(-1), o = Na(i.contentMatchAt(s));
  if (!o || !i.canReplaceWith(s, s, o))
    return !1;
  if (e) {
    let l = t.after(), a = n.tr.replaceWith(l, l, o.createAndFill());
    a.setSelection(V.near(a.doc.resolve(l), 1)), e(a.scrollIntoView());
  }
  return !0;
}, uh = (n, e) => {
  let t = n.selection, { $from: r, $to: i } = t;
  if (t instanceof Ve || r.parent.inlineContent || i.parent.inlineContent)
    return !1;
  let s = Na(i.parent.contentMatchAt(i.indexAfter()));
  if (!s || !s.isTextblock)
    return !1;
  if (e) {
    let o = (!r.parentOffset && i.index() < i.parent.childCount ? r : i).pos, l = n.tr.insert(o, s.createAndFill());
    l.setSelection($.create(l.doc, o + 1)), e(l.scrollIntoView());
  }
  return !0;
}, ch = (n, e) => {
  let { $cursor: t } = n.selection;
  if (!t || t.parent.content.size)
    return !1;
  if (t.depth > 1 && t.after() != t.end(-1)) {
    let s = t.before();
    if (dn(n.doc, s))
      return e && e(n.tr.split(s).scrollIntoView()), !0;
  }
  let r = t.blockRange(), i = r && Dn(r);
  return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
}, dh = (n, e) => {
  let { $from: t, to: r } = n.selection, i, s = t.sharedDepth(r);
  return s == 0 ? !1 : (i = t.before(s), e && e(n.tr.setSelection(_.create(n.doc, i))), !0);
};
function hh(n, e, t) {
  let r = e.nodeBefore, i = e.nodeAfter, s = e.index();
  return !r || !i || !r.type.compatibleContent(i.type) ? !1 : !r.content.size && e.parent.canReplace(s - 1, s) ? (t && t(n.tr.delete(e.pos - r.nodeSize, e.pos).scrollIntoView()), !0) : !e.parent.canReplace(s, s + 1) || !(i.isTextblock || Xn(n.doc, e.pos)) ? !1 : (t && t(n.tr.clearIncompatible(e.pos, r.type, r.contentMatchAt(r.childCount)).join(e.pos).scrollIntoView()), !0);
}
function Fa(n, e, t) {
  let r = e.nodeBefore, i = e.nodeAfter, s, o;
  if (r.type.spec.isolating || i.type.spec.isolating)
    return !1;
  if (hh(n, e, t))
    return !0;
  let l = e.parent.canReplace(e.index(), e.index() + 1);
  if (l && (s = (o = r.contentMatchAt(r.childCount)).findWrapping(i.type)) && o.matchType(s[0] || i.type).validEnd) {
    if (t) {
      let d = e.pos + i.nodeSize, h = k.empty;
      for (let g = s.length - 1; g >= 0; g--)
        h = k.from(s[g].create(null, h));
      h = k.from(r.copy(h));
      let f = n.tr.step(new le(e.pos - 1, d, e.pos, d, new O(h, 1, 0), s.length, !0)), p = d + 2 * s.length;
      Xn(f.doc, p) && f.join(p), t(f.scrollIntoView());
    }
    return !0;
  }
  let a = V.findFrom(e, 1), c = a && a.$from.blockRange(a.$to), u = c && Dn(c);
  if (u != null && u >= e.depth)
    return t && t(n.tr.lift(c, u).scrollIntoView()), !0;
  if (l && yn(i, "start", !0) && yn(r, "end")) {
    let d = r, h = [];
    for (; h.push(d), !d.isTextblock; )
      d = d.lastChild;
    let f = i, p = 1;
    for (; !f.isTextblock; f = f.firstChild)
      p++;
    if (d.canReplace(d.childCount, d.childCount, f.content)) {
      if (t) {
        let g = k.empty;
        for (let D = h.length - 1; D >= 0; D--)
          g = k.from(h[D].copy(g));
        let y = n.tr.step(new le(e.pos - h.length, e.pos + i.nodeSize, e.pos + p, e.pos + i.nodeSize - p, new O(g, h.length, 0), 0, !0));
        t(y.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Ra(n) {
  return function(e, t) {
    let r = e.selection, i = n < 0 ? r.$from : r.$to, s = i.depth;
    for (; i.node(s).isInline; ) {
      if (!s)
        return !1;
      s--;
    }
    return i.node(s).isTextblock ? (t && t(e.tr.setSelection($.create(e.doc, n < 0 ? i.start(s) : i.end(s)))), !0) : !1;
  };
}
const fh = Ra(-1), ph = Ra(1);
function gh(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: s } = t.selection, o = i.blockRange(s), l = o && fs(o, n, e);
    return l ? (r && r(t.tr.wrap(o, l).scrollIntoView()), !0) : !1;
  };
}
function Vo(n, e = null) {
  return function(t, r) {
    let { from: i, to: s } = t.selection, o = !1;
    return t.doc.nodesBetween(i, s, (l, a) => {
      if (o)
        return !1;
      if (!(!l.isTextblock || l.hasMarkup(n, e)))
        if (l.type == n)
          o = !0;
        else {
          let c = t.doc.resolve(a), u = c.index();
          o = c.parent.canReplaceWith(u, u + 1, n);
        }
    }), o ? (r && r(t.tr.setBlockType(i, s, n, e).scrollIntoView()), !0) : !1;
  };
}
typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : typeof os < "u" && os.platform && os.platform() == "darwin";
function mh(n, e = null) {
  return function(t, r) {
    let { $from: i, $to: s } = t.selection, o = i.blockRange(s), l = !1, a = o;
    if (!o)
      return !1;
    if (o.depth >= 2 && i.node(o.depth - 1).type.compatibleContent(n) && o.startIndex == 0) {
      if (i.index(o.depth - 1) == 0)
        return !1;
      let u = t.doc.resolve(o.start - 2);
      a = new gr(u, u, o.depth), o.endIndex < o.parent.childCount && (o = new gr(i, t.doc.resolve(s.end(o.depth)), o.depth)), l = !0;
    }
    let c = fs(a, n, e, o);
    return c ? (r && r(yh(t.tr, o, c, l, n).scrollIntoView()), !0) : !1;
  };
}
function yh(n, e, t, r, i) {
  let s = k.empty;
  for (let u = t.length - 1; u >= 0; u--)
    s = k.from(t[u].type.create(t[u].attrs, s));
  n.step(new le(e.start - (r ? 2 : 0), e.end, e.start, e.end, new O(s, 0, 0), t.length, !0));
  let o = 0;
  for (let u = 0; u < t.length; u++)
    t[u].type == i && (o = u + 1);
  let l = t.length - o, a = e.start + t.length - (r ? 2 : 0), c = e.parent;
  for (let u = e.startIndex, d = e.endIndex, h = !0; u < d; u++, h = !1)
    !h && dn(n.doc, a, l) && (n.split(a, l), a += 2 * l), a += c.child(u).nodeSize;
  return n;
}
function bh(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, s = r.blockRange(i, (o) => o.childCount > 0 && o.firstChild.type == n);
    return s ? t ? r.node(s.depth - 1).type == n ? Dh(e, t, n, s) : Eh(e, t, s) : !0 : !1;
  };
}
function Dh(n, e, t, r) {
  let i = n.tr, s = r.end, o = r.$to.end(r.depth);
  return s < o && (i.step(new le(s - 1, o, s, o, new O(k.from(t.create(null, r.parent.copy())), 1, 0), 1, !0)), r = new gr(i.doc.resolve(r.$from.pos), i.doc.resolve(o), r.depth)), e(i.lift(r, Dn(r)).scrollIntoView()), !0;
}
function Eh(n, e, t) {
  let r = n.tr, i = t.parent;
  for (let f = t.end, p = t.endIndex - 1, g = t.startIndex; p > g; p--)
    f -= i.child(p).nodeSize, r.delete(f - 1, f + 1);
  let s = r.doc.resolve(t.start), o = s.nodeAfter;
  if (r.mapping.map(t.end) != t.start + s.nodeAfter.nodeSize)
    return !1;
  let l = t.startIndex == 0, a = t.endIndex == i.childCount, c = s.node(-1), u = s.index(-1);
  if (!c.canReplace(u + (l ? 0 : 1), u + 1, o.content.append(a ? k.empty : k.from(i))))
    return !1;
  let d = s.pos, h = d + o.nodeSize;
  return r.step(new le(d - (l ? 1 : 0), h + (a ? 1 : 0), d + 1, h - 1, new O((l ? k.empty : k.from(i.copy(k.empty))).append(a ? k.empty : k.from(i.copy(k.empty))), l ? 0 : 1, a ? 0 : 1), l ? 0 : 1)), e(r.scrollIntoView()), !0;
}
function xh(n) {
  return function(e, t) {
    let { $from: r, $to: i } = e.selection, s = r.blockRange(i, (c) => c.childCount > 0 && c.firstChild.type == n);
    if (!s)
      return !1;
    let o = s.startIndex;
    if (o == 0)
      return !1;
    let l = s.parent, a = l.child(o - 1);
    if (a.type != n)
      return !1;
    if (t) {
      let c = a.lastChild && a.lastChild.type == l.type, u = k.from(c ? n.create() : null), d = new O(k.from(n.create(null, k.from(l.type.create(null, u)))), c ? 3 : 1, 0), h = s.start, f = s.end;
      t(e.tr.step(new le(h - (c ? 3 : 1), f, h, f, d, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function ei(n) {
  const { state: e, transaction: t } = n;
  let { selection: r } = t, { doc: i } = t, { storedMarks: s } = t;
  return {
    ...e,
    apply: e.apply.bind(e),
    applyTransaction: e.applyTransaction.bind(e),
    filterTransaction: e.filterTransaction,
    plugins: e.plugins,
    schema: e.schema,
    reconfigure: e.reconfigure.bind(e),
    toJSON: e.toJSON.bind(e),
    get storedMarks() {
      return s;
    },
    get selection() {
      return r;
    },
    get doc() {
      return i;
    },
    get tr() {
      return r = t.selection, i = t.doc, s = t.storedMarks, t;
    }
  };
}
class ti {
  constructor(e) {
    this.editor = e.editor, this.rawCommands = this.editor.extensionManager.commands, this.customState = e.state;
  }
  get hasCustomState() {
    return !!this.customState;
  }
  get state() {
    return this.customState || this.editor.state;
  }
  get commands() {
    const { rawCommands: e, editor: t, state: r } = this, { view: i } = t, { tr: s } = r, o = this.buildProps(s);
    return Object.fromEntries(Object.entries(e).map(([l, a]) => [l, (...u) => {
      const d = a(...u)(o);
      return !s.getMeta("preventDispatch") && !this.hasCustomState && i.dispatch(s), d;
    }]));
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(e, t = !0) {
    const { rawCommands: r, editor: i, state: s } = this, { view: o } = i, l = [], a = !!e, c = e || s.tr, u = () => (!a && t && !c.getMeta("preventDispatch") && !this.hasCustomState && o.dispatch(c), l.every((h) => h === !0)), d = {
      ...Object.fromEntries(Object.entries(r).map(([h, f]) => [h, (...g) => {
        const y = this.buildProps(c, t), D = f(...g)(y);
        return l.push(D), d;
      }])),
      run: u
    };
    return d;
  }
  createCan(e) {
    const { rawCommands: t, state: r } = this, i = !1, s = e || r.tr, o = this.buildProps(s, i);
    return {
      ...Object.fromEntries(Object.entries(t).map(([a, c]) => [a, (...u) => c(...u)({ ...o, dispatch: void 0 })])),
      chain: () => this.createChain(s, i)
    };
  }
  buildProps(e, t = !0) {
    const { rawCommands: r, editor: i, state: s } = this, { view: o } = i;
    s.storedMarks && e.setStoredMarks(s.storedMarks);
    const l = {
      tr: e,
      editor: i,
      view: o,
      state: ei({
        state: s,
        transaction: e
      }),
      dispatch: t ? () => {
      } : void 0,
      chain: () => this.createChain(e),
      can: () => this.createCan(e),
      get commands() {
        return Object.fromEntries(Object.entries(r).map(([a, c]) => [a, (...u) => c(...u)(l)]));
      }
    };
    return l;
  }
}
class kh {
  constructor() {
    this.callbacks = {};
  }
  on(e, t) {
    return this.callbacks[e] || (this.callbacks[e] = []), this.callbacks[e].push(t), this;
  }
  emit(e, ...t) {
    const r = this.callbacks[e];
    return r && r.forEach((i) => i.apply(this, t)), this;
  }
  off(e, t) {
    const r = this.callbacks[e];
    return r && (t ? this.callbacks[e] = r.filter((i) => i !== t) : delete this.callbacks[e]), this;
  }
  removeAllListeners() {
    this.callbacks = {};
  }
}
function v(n, e, t) {
  return n.config[e] === void 0 && n.parent ? v(n.parent, e, t) : typeof n.config[e] == "function" ? n.config[e].bind({
    ...t,
    parent: n.parent ? v(n.parent, e, t) : null
  }) : n.config[e];
}
function ni(n) {
  const e = n.filter((i) => i.type === "extension"), t = n.filter((i) => i.type === "node"), r = n.filter((i) => i.type === "mark");
  return {
    baseExtensions: e,
    nodeExtensions: t,
    markExtensions: r
  };
}
function Ba(n) {
  const e = [], { nodeExtensions: t, markExtensions: r } = ni(n), i = [...t, ...r], s = {
    default: null,
    rendered: !0,
    renderHTML: null,
    parseHTML: null,
    keepOnSplit: !0,
    isRequired: !1
  };
  return n.forEach((o) => {
    const l = {
      name: o.name,
      options: o.options,
      storage: o.storage
    }, a = v(o, "addGlobalAttributes", l);
    if (!a)
      return;
    a().forEach((u) => {
      u.types.forEach((d) => {
        Object.entries(u.attributes).forEach(([h, f]) => {
          e.push({
            type: d,
            name: h,
            attribute: {
              ...s,
              ...f
            }
          });
        });
      });
    });
  }), i.forEach((o) => {
    const l = {
      name: o.name,
      options: o.options,
      storage: o.storage
    }, a = v(o, "addAttributes", l);
    if (!a)
      return;
    const c = a();
    Object.entries(c).forEach(([u, d]) => {
      const h = {
        ...s,
        ...d
      };
      d.isRequired && d.default === void 0 && delete h.default, e.push({
        type: o.name,
        name: u,
        attribute: h
      });
    });
  }), e;
}
function ae(n, e) {
  if (typeof n == "string") {
    if (!e.nodes[n])
      throw Error(`There is no node type named '${n}'. Maybe you forgot to add the extension?`);
    return e.nodes[n];
  }
  return n;
}
function ee(...n) {
  return n.filter((e) => !!e).reduce((e, t) => {
    const r = { ...e };
    return Object.entries(t).forEach(([i, s]) => {
      if (!r[i]) {
        r[i] = s;
        return;
      }
      i === "class" ? r[i] = [r[i], s].join(" ") : i === "style" ? r[i] = [r[i], s].join("; ") : r[i] = s;
    }), r;
  }, {});
}
function is(n, e) {
  return e.filter((t) => t.attribute.rendered).map((t) => t.attribute.renderHTML ? t.attribute.renderHTML(n.attrs) || {} : {
    [t.name]: n.attrs[t.name]
  }).reduce((t, r) => ee(t, r), {});
}
function Ia(n) {
  return typeof n == "function";
}
function H(n, e = void 0, ...t) {
  return Ia(n) ? e ? n.bind(e)(...t) : n(...t) : n;
}
function Ch(n = {}) {
  return Object.keys(n).length === 0 && n.constructor === Object;
}
function Sh(n) {
  return typeof n != "string" ? n : n.match(/^[+-]?(?:\d*\.)?\d+$/) ? Number(n) : n === "true" ? !0 : n === "false" ? !1 : n;
}
function Uo(n, e) {
  return n.style ? n : {
    ...n,
    getAttrs: (t) => {
      const r = n.getAttrs ? n.getAttrs(t) : n.attrs;
      if (r === !1)
        return !1;
      const i = e.reduce((s, o) => {
        const l = o.attribute.parseHTML ? o.attribute.parseHTML(t) : Sh(t.getAttribute(o.name));
        return l == null ? s : {
          ...s,
          [o.name]: l
        };
      }, {});
      return { ...r, ...i };
    }
  };
}
function Ko(n) {
  return Object.fromEntries(Object.entries(n).filter(([e, t]) => e === "attrs" && Ch(t) ? !1 : t != null));
}
function Ah(n) {
  var e;
  const t = Ba(n), { nodeExtensions: r, markExtensions: i } = ni(n), s = (e = r.find((a) => v(a, "topNode"))) === null || e === void 0 ? void 0 : e.name, o = Object.fromEntries(r.map((a) => {
    const c = t.filter((y) => y.type === a.name), u = {
      name: a.name,
      options: a.options,
      storage: a.storage
    }, d = n.reduce((y, D) => {
      const R = v(D, "extendNodeSchema", u);
      return {
        ...y,
        ...R ? R(a) : {}
      };
    }, {}), h = Ko({
      ...d,
      content: H(v(a, "content", u)),
      marks: H(v(a, "marks", u)),
      group: H(v(a, "group", u)),
      inline: H(v(a, "inline", u)),
      atom: H(v(a, "atom", u)),
      selectable: H(v(a, "selectable", u)),
      draggable: H(v(a, "draggable", u)),
      code: H(v(a, "code", u)),
      defining: H(v(a, "defining", u)),
      isolating: H(v(a, "isolating", u)),
      attrs: Object.fromEntries(c.map((y) => {
        var D;
        return [y.name, { default: (D = y == null ? void 0 : y.attribute) === null || D === void 0 ? void 0 : D.default }];
      }))
    }), f = H(v(a, "parseHTML", u));
    f && (h.parseDOM = f.map((y) => Uo(y, c)));
    const p = v(a, "renderHTML", u);
    p && (h.toDOM = (y) => p({
      node: y,
      HTMLAttributes: is(y, c)
    }));
    const g = v(a, "renderText", u);
    return g && (h.toText = g), [a.name, h];
  })), l = Object.fromEntries(i.map((a) => {
    const c = t.filter((g) => g.type === a.name), u = {
      name: a.name,
      options: a.options,
      storage: a.storage
    }, d = n.reduce((g, y) => {
      const D = v(y, "extendMarkSchema", u);
      return {
        ...g,
        ...D ? D(a) : {}
      };
    }, {}), h = Ko({
      ...d,
      inclusive: H(v(a, "inclusive", u)),
      excludes: H(v(a, "excludes", u)),
      group: H(v(a, "group", u)),
      spanning: H(v(a, "spanning", u)),
      code: H(v(a, "code", u)),
      attrs: Object.fromEntries(c.map((g) => {
        var y;
        return [g.name, { default: (y = g == null ? void 0 : g.attribute) === null || y === void 0 ? void 0 : y.default }];
      }))
    }), f = H(v(a, "parseHTML", u));
    f && (h.parseDOM = f.map((g) => Uo(g, c)));
    const p = v(a, "renderHTML", u);
    return p && (h.toDOM = (g) => p({
      mark: g,
      HTMLAttributes: is(g, c)
    })), [a.name, h];
  }));
  return new Ku({
    topNode: s,
    nodes: o,
    marks: l
  });
}
function Pi(n, e) {
  return e.nodes[n] || e.marks[n] || null;
}
function Wo(n, e) {
  return Array.isArray(e) ? e.some((t) => (typeof t == "string" ? t : t.name) === n.name) : e;
}
const wh = (n, e = 500) => {
  let t = "";
  return n.parent.nodesBetween(Math.max(0, n.parentOffset - e), n.parentOffset, (r, i, s, o) => {
    var l, a, c;
    t += ((a = (l = r.type.spec).toText) === null || a === void 0 ? void 0 : a.call(l, {
      node: r,
      pos: i,
      parent: s,
      index: o
    })) || ((c = n.nodeBefore) === null || c === void 0 ? void 0 : c.text) || "%leaf%";
  }), t;
};
function ws(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
class ri {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
const Mh = (n, e) => {
  if (ws(e))
    return e.exec(n);
  const t = e(n);
  if (!t)
    return null;
  const r = [];
  return r.push(t.text), r.index = t.index, r.input = n, r.data = t.data, t.replaceWith && (t.text.includes(t.replaceWith) || console.warn('[tiptap warn]: "inputRuleMatch.replaceWith" must be part of "inputRuleMatch.text".'), r.push(t.replaceWith)), r;
};
function Li(n) {
  var e;
  const { editor: t, from: r, to: i, text: s, rules: o, plugin: l } = n, { view: a } = t;
  if (a.composing)
    return !1;
  const c = a.state.doc.resolve(r);
  if (c.parent.type.spec.code || !!(!((e = c.nodeBefore || c.nodeAfter) === null || e === void 0) && e.marks.find((h) => h.type.spec.code)))
    return !1;
  let u = !1;
  const d = wh(c) + s;
  return o.forEach((h) => {
    if (u)
      return;
    const f = Mh(d, h.find);
    if (!f)
      return;
    const p = a.state.tr, g = ei({
      state: a.state,
      transaction: p
    }), y = {
      from: r - (f[0].length - s.length),
      to: i
    }, { commands: D, chain: R, can: P } = new ti({
      editor: t,
      state: g
    });
    h.handler({
      state: g,
      range: y,
      match: f,
      commands: D,
      chain: R,
      can: P
    }) === null || !p.steps.length || (p.setMeta(l, {
      transform: p,
      from: r,
      to: i,
      text: s
    }), a.dispatch(p), u = !0);
  }), u;
}
function Th(n) {
  const { editor: e, rules: t } = n, r = new ye({
    state: {
      init() {
        return null;
      },
      apply(i, s) {
        const o = i.getMeta(r);
        return o || (i.selectionSet || i.docChanged ? null : s);
      }
    },
    props: {
      handleTextInput(i, s, o, l) {
        return Li({
          editor: e,
          from: s,
          to: o,
          text: l,
          rules: t,
          plugin: r
        });
      },
      handleDOMEvents: {
        compositionend: (i) => (setTimeout(() => {
          const { $cursor: s } = i.state.selection;
          s && Li({
            editor: e,
            from: s.pos,
            to: s.pos,
            text: "",
            rules: t,
            plugin: r
          });
        }), !1)
      },
      handleKeyDown(i, s) {
        if (s.key !== "Enter")
          return !1;
        const { $cursor: o } = i.state.selection;
        return o ? Li({
          editor: e,
          from: o.pos,
          to: o.pos,
          text: `
`,
          rules: t,
          plugin: r
        }) : !1;
      }
    },
    isInputRules: !0
  });
  return r;
}
function Oh(n) {
  return typeof n == "number";
}
class Pa {
  constructor(e) {
    this.find = e.find, this.handler = e.handler;
  }
}
const vh = (n, e) => {
  if (ws(e))
    return [...n.matchAll(e)];
  const t = e(n);
  return t ? t.map((r) => {
    const i = [];
    return i.push(r.text), i.index = r.index, i.input = n, i.data = r.data, r.replaceWith && (r.text.includes(r.replaceWith) || console.warn('[tiptap warn]: "pasteRuleMatch.replaceWith" must be part of "pasteRuleMatch.text".'), i.push(r.replaceWith)), i;
  }) : [];
};
function Nh(n) {
  const { editor: e, state: t, from: r, to: i, rule: s } = n, { commands: o, chain: l, can: a } = new ti({
    editor: e,
    state: t
  }), c = [];
  return t.doc.nodesBetween(r, i, (d, h) => {
    if (!d.isTextblock || d.type.spec.code)
      return;
    const f = Math.max(r, h), p = Math.min(i, h + d.content.size), g = d.textBetween(f - h, p - h, void 0, "\uFFFC");
    vh(g, s.find).forEach((D) => {
      if (D.index === void 0)
        return;
      const R = f + D.index + 1, P = R + D[0].length, z = {
        from: t.tr.mapping.map(R),
        to: t.tr.mapping.map(P)
      }, j = s.handler({
        state: t,
        range: z,
        match: D,
        commands: o,
        chain: l,
        can: a
      });
      c.push(j);
    });
  }), c.every((d) => d !== null);
}
function Fh(n) {
  const { editor: e, rules: t } = n;
  let r = null, i = !1, s = !1;
  return t.map((l) => new ye({
    view(a) {
      const c = (u) => {
        var d;
        r = !((d = a.dom.parentElement) === null || d === void 0) && d.contains(u.target) ? a.dom.parentElement : null;
      };
      return window.addEventListener("dragstart", c), {
        destroy() {
          window.removeEventListener("dragstart", c);
        }
      };
    },
    props: {
      handleDOMEvents: {
        drop: (a) => (s = r === a.dom.parentElement, !1),
        paste: (a, c) => {
          var u;
          const d = (u = c.clipboardData) === null || u === void 0 ? void 0 : u.getData("text/html");
          return i = !!(d != null && d.includes("data-pm-slice")), !1;
        }
      }
    },
    appendTransaction: (a, c, u) => {
      const d = a[0], h = d.getMeta("uiEvent") === "paste" && !i, f = d.getMeta("uiEvent") === "drop" && !s;
      if (!h && !f)
        return;
      const p = c.doc.content.findDiffStart(u.doc.content), g = c.doc.content.findDiffEnd(u.doc.content);
      if (!Oh(p) || !g || p === g.b)
        return;
      const y = u.tr, D = ei({
        state: u,
        transaction: y
      });
      if (!(!Nh({
        editor: e,
        state: D,
        from: Math.max(p - 1, 0),
        to: g.b - 1,
        rule: l
      }) || !y.steps.length))
        return y;
    }
  }));
}
function Rh(n) {
  const e = n.filter((t, r) => n.indexOf(t) !== r);
  return [...new Set(e)];
}
class rn {
  constructor(e, t) {
    this.splittableMarks = [], this.editor = t, this.extensions = rn.resolve(e), this.schema = Ah(this.extensions), this.extensions.forEach((r) => {
      var i;
      this.editor.extensionStorage[r.name] = r.storage;
      const s = {
        name: r.name,
        options: r.options,
        storage: r.storage,
        editor: this.editor,
        type: Pi(r.name, this.schema)
      };
      r.type === "mark" && ((i = H(v(r, "keepOnSplit", s))) !== null && i !== void 0 ? i : !0) && this.splittableMarks.push(r.name);
      const o = v(r, "onBeforeCreate", s);
      o && this.editor.on("beforeCreate", o);
      const l = v(r, "onCreate", s);
      l && this.editor.on("create", l);
      const a = v(r, "onUpdate", s);
      a && this.editor.on("update", a);
      const c = v(r, "onSelectionUpdate", s);
      c && this.editor.on("selectionUpdate", c);
      const u = v(r, "onTransaction", s);
      u && this.editor.on("transaction", u);
      const d = v(r, "onFocus", s);
      d && this.editor.on("focus", d);
      const h = v(r, "onBlur", s);
      h && this.editor.on("blur", h);
      const f = v(r, "onDestroy", s);
      f && this.editor.on("destroy", f);
    });
  }
  static resolve(e) {
    const t = rn.sort(rn.flatten(e)), r = Rh(t.map((i) => i.name));
    return r.length && console.warn(`[tiptap warn]: Duplicate extension names found: [${r.map((i) => `'${i}'`).join(", ")}]. This can lead to issues.`), t;
  }
  static flatten(e) {
    return e.map((t) => {
      const r = {
        name: t.name,
        options: t.options,
        storage: t.storage
      }, i = v(t, "addExtensions", r);
      return i ? [
        t,
        ...this.flatten(i())
      ] : t;
    }).flat(10);
  }
  static sort(e) {
    return e.sort((r, i) => {
      const s = v(r, "priority") || 100, o = v(i, "priority") || 100;
      return s > o ? -1 : s < o ? 1 : 0;
    });
  }
  get commands() {
    return this.extensions.reduce((e, t) => {
      const r = {
        name: t.name,
        options: t.options,
        storage: t.storage,
        editor: this.editor,
        type: Pi(t.name, this.schema)
      }, i = v(t, "addCommands", r);
      return i ? {
        ...e,
        ...i()
      } : e;
    }, {});
  }
  get plugins() {
    const { editor: e } = this, t = rn.sort([...this.extensions].reverse()), r = [], i = [], s = t.map((o) => {
      const l = {
        name: o.name,
        options: o.options,
        storage: o.storage,
        editor: e,
        type: Pi(o.name, this.schema)
      }, a = [], c = v(o, "addKeyboardShortcuts", l);
      let u = {};
      if (o.type === "mark" && o.config.exitable && (u.ArrowRight = () => Be.handleExit({ editor: e, mark: o })), c) {
        const g = Object.fromEntries(Object.entries(c()).map(([y, D]) => [y, () => D({ editor: e })]));
        u = { ...u, ...g };
      }
      const d = eh(u);
      a.push(d);
      const h = v(o, "addInputRules", l);
      Wo(o, e.options.enableInputRules) && h && r.push(...h());
      const f = v(o, "addPasteRules", l);
      Wo(o, e.options.enablePasteRules) && f && i.push(...f());
      const p = v(o, "addProseMirrorPlugins", l);
      if (p) {
        const g = p();
        a.push(...g);
      }
      return a;
    }).flat();
    return [
      Th({
        editor: e,
        rules: r
      }),
      ...Fh({
        editor: e,
        rules: i
      }),
      ...s
    ];
  }
  get attributes() {
    return Ba(this.extensions);
  }
  get nodeViews() {
    const { editor: e } = this, { nodeExtensions: t } = ni(this.extensions);
    return Object.fromEntries(t.filter((r) => !!v(r, "addNodeView")).map((r) => {
      const i = this.attributes.filter((a) => a.type === r.name), s = {
        name: r.name,
        options: r.options,
        storage: r.storage,
        editor: e,
        type: ae(r.name, this.schema)
      }, o = v(r, "addNodeView", s);
      if (!o)
        return [];
      const l = (a, c, u, d) => {
        const h = is(a, i);
        return o()({
          editor: e,
          node: a,
          getPos: u,
          decorations: d,
          HTMLAttributes: h,
          extension: r
        });
      };
      return [r.name, l];
    }));
  }
}
function Bh(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function _i(n) {
  return Bh(n) !== "Object" ? !1 : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function ii(n, e) {
  const t = { ...n };
  return _i(n) && _i(e) && Object.keys(e).forEach((r) => {
    _i(e[r]) ? r in n ? t[r] = ii(n[r], e[r]) : Object.assign(t, { [r]: e[r] }) : Object.assign(t, { [r]: e[r] });
  }), t;
}
class Le {
  constructor(e = {}) {
    this.type = "extension", this.name = "extension", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = H(v(this, "addOptions", {
      name: this.name
    }))), this.storage = H(v(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new Le(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return t.options = ii(this.options, e), t.storage = H(v(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  extend(e = {}) {
    const t = new Le(e);
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = H(v(t, "addOptions", {
      name: t.name
    })), t.storage = H(v(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
function La(n, e, t) {
  const { from: r, to: i } = e, { blockSeparator: s = `

`, textSerializers: o = {} } = t || {};
  let l = "", a = !0;
  return n.nodesBetween(r, i, (c, u, d, h) => {
    var f;
    const p = o == null ? void 0 : o[c.type.name];
    p ? (c.isBlock && !a && (l += s, a = !0), d && (l += p({
      node: c,
      pos: u,
      parent: d,
      index: h,
      range: e
    }))) : c.isText ? (l += (f = c == null ? void 0 : c.text) === null || f === void 0 ? void 0 : f.slice(Math.max(r, u) - u, i - u), a = !1) : c.isBlock && !a && (l += s, a = !0);
  }), l;
}
function _a(n) {
  return Object.fromEntries(Object.entries(n.nodes).filter(([, e]) => e.spec.toText).map(([e, t]) => [e, t.spec.toText]));
}
const Ih = Le.create({
  name: "clipboardTextSerializer",
  addProseMirrorPlugins() {
    return [
      new ye({
        key: new Oe("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: n } = this, { state: e, schema: t } = n, { doc: r, selection: i } = e, { ranges: s } = i, o = Math.min(...s.map((u) => u.$from.pos)), l = Math.max(...s.map((u) => u.$to.pos)), a = _a(t);
            return La(r, { from: o, to: l }, {
              textSerializers: a
            });
          }
        }
      })
    ];
  }
}), Ph = () => ({ editor: n, view: e }) => (requestAnimationFrame(() => {
  var t;
  n.isDestroyed || (e.dom.blur(), (t = window == null ? void 0 : window.getSelection()) === null || t === void 0 || t.removeAllRanges());
}), !0), Lh = (n = !1) => ({ commands: e }) => e.setContent("", n), _h = () => ({ state: n, tr: e, dispatch: t }) => {
  const { selection: r } = e, { ranges: i } = r;
  return t && i.forEach(({ $from: s, $to: o }) => {
    n.doc.nodesBetween(s.pos, o.pos, (l, a) => {
      if (l.type.isText)
        return;
      const { doc: c, mapping: u } = e, d = c.resolve(u.map(a)), h = c.resolve(u.map(a + l.nodeSize)), f = d.blockRange(h);
      if (!f)
        return;
      const p = Dn(f);
      if (l.type.isTextblock) {
        const { defaultType: g } = d.parent.contentMatchAt(d.index());
        e.setNodeMarkup(f.start, g);
      }
      (p || p === 0) && e.lift(f, p);
    });
  }), !0;
}, zh = (n) => (e) => n(e), Hh = () => ({ state: n, dispatch: e }) => uh(n, e), $h = (n) => ({ tr: e, state: t, dispatch: r }) => {
  const i = ae(n, t.schema), s = e.selection.$anchor;
  for (let o = s.depth; o > 0; o -= 1)
    if (s.node(o).type === i) {
      if (r) {
        const a = s.before(o), c = s.after(o);
        e.delete(a, c).scrollIntoView();
      }
      return !0;
    }
  return !1;
}, jh = (n) => ({ tr: e, dispatch: t }) => {
  const { from: r, to: i } = n;
  return t && e.delete(r, i), !0;
}, Vh = () => ({ state: n, dispatch: e }) => th(n, e), Uh = () => ({ commands: n }) => n.keyboardShortcut("Enter"), Kh = () => ({ state: n, dispatch: e }) => ah(n, e);
function Sr(n, e, t = { strict: !0 }) {
  const r = Object.keys(e);
  return r.length ? r.every((i) => t.strict ? e[i] === n[i] : ws(e[i]) ? e[i].test(n[i]) : e[i] === n[i]) : !0;
}
function ss(n, e, t = {}) {
  return n.find((r) => r.type === e && Sr(r.attrs, t));
}
function Wh(n, e, t = {}) {
  return !!ss(n, e, t);
}
function Ms(n, e, t = {}) {
  if (!n || !e)
    return;
  let r = n.parent.childAfter(n.parentOffset);
  if (n.parentOffset === r.offset && r.offset !== 0 && (r = n.parent.childBefore(n.parentOffset)), !r.node)
    return;
  const i = ss([...r.node.marks], e, t);
  if (!i)
    return;
  let s = r.index, o = n.start() + r.offset, l = s + 1, a = o + r.node.nodeSize;
  for (ss([...r.node.marks], e, t); s > 0 && i.isInSet(n.parent.child(s - 1).marks); )
    s -= 1, o -= n.parent.child(s).nodeSize;
  for (; l < n.parent.childCount && Wh([...n.parent.child(l).marks], e, t); )
    a += n.parent.child(l).nodeSize, l += 1;
  return {
    from: o,
    to: a
  };
}
function At(n, e) {
  if (typeof n == "string") {
    if (!e.marks[n])
      throw Error(`There is no mark type named '${n}'. Maybe you forgot to add the extension?`);
    return e.marks[n];
  }
  return n;
}
const qh = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const s = At(n, r.schema), { doc: o, selection: l } = t, { $from: a, from: c, to: u } = l;
  if (i) {
    const d = Ms(a, s, e);
    if (d && d.from <= c && d.to >= u) {
      const h = $.create(o, d.from, d.to);
      t.setSelection(h);
    }
  }
  return !0;
}, Jh = (n) => (e) => {
  const t = typeof n == "function" ? n(e) : n;
  for (let r = 0; r < t.length; r += 1)
    if (t[r](e))
      return !0;
  return !1;
};
function Gh(n) {
  return n instanceof $;
}
function It(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function za(n, e = null) {
  if (!e)
    return null;
  const t = V.atStart(n), r = V.atEnd(n);
  if (e === "start" || e === !0)
    return t;
  if (e === "end")
    return r;
  const i = t.from, s = r.to;
  return e === "all" ? $.create(n, It(0, i, s), It(n.content.size, i, s)) : $.create(n, It(e, i, s), It(e, i, s));
}
function Ts() {
  return [
    "iPad Simulator",
    "iPhone Simulator",
    "iPod Simulator",
    "iPad",
    "iPhone",
    "iPod"
  ].includes(navigator.platform) || navigator.userAgent.includes("Mac") && "ontouchend" in document;
}
const Yh = (n = null, e = {}) => ({ editor: t, view: r, tr: i, dispatch: s }) => {
  e = {
    scrollIntoView: !0,
    ...e
  };
  const o = () => {
    Ts() && r.dom.focus(), requestAnimationFrame(() => {
      t.isDestroyed || (r.focus(), e != null && e.scrollIntoView && t.commands.scrollIntoView());
    });
  };
  if (r.hasFocus() && n === null || n === !1)
    return !0;
  if (s && n === null && !Gh(t.state.selection))
    return o(), !0;
  const l = za(i.doc, n) || t.state.selection, a = t.state.selection.eq(l);
  return s && (a || i.setSelection(l), a && i.storedMarks && i.setStoredMarks(i.storedMarks), o()), !0;
}, Xh = (n, e) => (t) => n.every((r, i) => e(r, { ...t, index: i })), Qh = (n, e) => ({ tr: t, commands: r }) => r.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e);
function qo(n) {
  const e = `<body>${n}</body>`;
  return new window.DOMParser().parseFromString(e, "text/html").body;
}
function Ar(n, e, t) {
  if (t = {
    slice: !0,
    parseOptions: {},
    ...t
  }, typeof n == "object" && n !== null)
    try {
      return Array.isArray(n) ? k.fromArray(n.map((r) => e.nodeFromJSON(r))) : e.nodeFromJSON(n);
    } catch (r) {
      return console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", r), Ar("", e, t);
    }
  if (typeof n == "string") {
    const r = fn.fromSchema(e);
    return t.slice ? r.parseSlice(qo(n), t.parseOptions).content : r.parse(qo(n), t.parseOptions);
  }
  return Ar("", e, t);
}
function Zh(n, e, t) {
  const r = n.steps.length - 1;
  if (r < e)
    return;
  const i = n.steps[r];
  if (!(i instanceof Ee || i instanceof le))
    return;
  const s = n.mapping.maps[r];
  let o = 0;
  s.forEach((l, a, c, u) => {
    o === 0 && (o = u);
  }), n.setSelection(V.near(n.doc.resolve(o), t));
}
const ef = (n) => n.toString().startsWith("<"), tf = (n, e, t) => ({ tr: r, dispatch: i, editor: s }) => {
  if (i) {
    t = {
      parseOptions: {},
      updateSelection: !0,
      ...t
    };
    const o = Ar(e, s.schema, {
      parseOptions: {
        preserveWhitespace: "full",
        ...t.parseOptions
      }
    });
    if (o.toString() === "<>")
      return !0;
    let { from: l, to: a } = typeof n == "number" ? { from: n, to: n } : n, c = !0, u = !0;
    if ((ef(o) ? o : [o]).forEach((h) => {
      h.check(), c = c ? h.isText && h.marks.length === 0 : !1, u = u ? h.isBlock : !1;
    }), l === a && u) {
      const { parent: h } = r.doc.resolve(l);
      h.isTextblock && !h.type.spec.code && !h.childCount && (l -= 1, a += 1);
    }
    c ? r.insertText(e, l, a) : r.replaceWith(l, a, o), t.updateSelection && Zh(r, r.steps.length - 1, -1);
  }
  return !0;
}, nf = () => ({ state: n, dispatch: e }) => nh(n, e), rf = () => ({ state: n, dispatch: e }) => ih(n, e);
function Ha() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function sf(n) {
  const e = n.split(/-(?!$)/);
  let t = e[e.length - 1];
  t === "Space" && (t = " ");
  let r, i, s, o;
  for (let l = 0; l < e.length - 1; l += 1) {
    const a = e[l];
    if (/^(cmd|meta|m)$/i.test(a))
      o = !0;
    else if (/^a(lt)?$/i.test(a))
      r = !0;
    else if (/^(c|ctrl|control)$/i.test(a))
      i = !0;
    else if (/^s(hift)?$/i.test(a))
      s = !0;
    else if (/^mod$/i.test(a))
      Ts() || Ha() ? o = !0 : i = !0;
    else
      throw new Error(`Unrecognized modifier name: ${a}`);
  }
  return r && (t = `Alt-${t}`), i && (t = `Ctrl-${t}`), o && (t = `Meta-${t}`), s && (t = `Shift-${t}`), t;
}
const of = (n) => ({ editor: e, view: t, tr: r, dispatch: i }) => {
  const s = sf(n).split(/-(?!$)/), o = s.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)), l = new KeyboardEvent("keydown", {
    key: o === "Space" ? " " : o,
    altKey: s.includes("Alt"),
    ctrlKey: s.includes("Ctrl"),
    metaKey: s.includes("Meta"),
    shiftKey: s.includes("Shift"),
    bubbles: !0,
    cancelable: !0
  }), a = e.captureTransaction(() => {
    t.someProp("handleKeyDown", (c) => c(t, l));
  });
  return a == null || a.steps.forEach((c) => {
    const u = c.map(r.mapping);
    u && i && r.maybeStep(u);
  }), !0;
};
function Un(n, e, t = {}) {
  const { from: r, to: i, empty: s } = n.selection, o = e ? ae(e, n.schema) : null, l = [];
  n.doc.nodesBetween(r, i, (d, h) => {
    if (d.isText)
      return;
    const f = Math.max(r, h), p = Math.min(i, h + d.nodeSize);
    l.push({
      node: d,
      from: f,
      to: p
    });
  });
  const a = i - r, c = l.filter((d) => o ? o.name === d.node.type.name : !0).filter((d) => Sr(d.node.attrs, t, { strict: !1 }));
  return s ? !!c.length : c.reduce((d, h) => d + h.to - h.from, 0) >= a;
}
const lf = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = ae(n, t.schema);
  return Un(t, i, e) ? oh(t, r) : !1;
}, af = () => ({ state: n, dispatch: e }) => ch(n, e), uf = (n) => ({ state: e, dispatch: t }) => {
  const r = ae(n, e.schema);
  return bh(r)(e, t);
}, cf = () => ({ state: n, dispatch: e }) => lh(n, e);
function si(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function Jo(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((r, i) => (t.includes(i) || (r[i] = n[i]), r), {});
}
const df = (n, e) => ({ tr: t, state: r, dispatch: i }) => {
  let s = null, o = null;
  const l = si(typeof n == "string" ? n : n.name, r.schema);
  return l ? (l === "node" && (s = ae(n, r.schema)), l === "mark" && (o = At(n, r.schema)), i && t.selection.ranges.forEach((a) => {
    r.doc.nodesBetween(a.$from.pos, a.$to.pos, (c, u) => {
      s && s === c.type && t.setNodeMarkup(u, void 0, Jo(c.attrs, e)), o && c.marks.length && c.marks.forEach((d) => {
        o === d.type && t.addMark(u, u + c.nodeSize, o.create(Jo(d.attrs, e)));
      });
    });
  }), !0) : !1;
}, hf = () => ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0), ff = () => ({ tr: n, commands: e }) => e.setTextSelection({
  from: 0,
  to: n.doc.content.size
}), pf = () => ({ state: n, dispatch: e }) => rh(n, e), gf = () => ({ state: n, dispatch: e }) => sh(n, e), mf = () => ({ state: n, dispatch: e }) => dh(n, e), yf = () => ({ state: n, dispatch: e }) => ph(n, e), bf = () => ({ state: n, dispatch: e }) => fh(n, e);
function $a(n, e, t = {}) {
  return Ar(n, e, { slice: !1, parseOptions: t });
}
const Df = (n, e = !1, t = {}) => ({ tr: r, editor: i, dispatch: s }) => {
  const { doc: o } = r, l = $a(n, i.schema, t);
  return s && r.replaceWith(0, o.content.size, l).setMeta("preventUpdate", !e), !0;
};
function ja(n, e) {
  const t = At(e, n.schema), { from: r, to: i, empty: s } = n.selection, o = [];
  s ? (n.storedMarks && o.push(...n.storedMarks), o.push(...n.selection.$head.marks())) : n.doc.nodesBetween(r, i, (a) => {
    o.push(...a.marks);
  });
  const l = o.find((a) => a.type.name === t.name);
  return l ? { ...l.attrs } : {};
}
const Ef = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  const { selection: s } = t, { empty: o, ranges: l } = s, a = At(n, r.schema);
  if (i)
    if (o) {
      const c = ja(r, a);
      t.addStoredMark(a.create({
        ...c,
        ...e
      }));
    } else
      l.forEach((c) => {
        const u = c.$from.pos, d = c.$to.pos;
        r.doc.nodesBetween(u, d, (h, f) => {
          const p = Math.max(f, u), g = Math.min(f + h.nodeSize, d);
          h.marks.find((D) => D.type === a) ? h.marks.forEach((D) => {
            a === D.type && t.addMark(p, g, a.create({
              ...D.attrs,
              ...e
            }));
          }) : t.addMark(p, g, a.create(e));
        });
      });
  return !0;
}, xf = (n, e) => ({ tr: t }) => (t.setMeta(n, e), !0), kf = (n, e = {}) => ({ state: t, dispatch: r, chain: i }) => {
  const s = ae(n, t.schema);
  return s.isTextblock ? i().command(({ commands: o }) => Vo(s, e)(t) ? !0 : o.clearNodes()).command(({ state: o }) => Vo(s, e)(o, r)).run() : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'), !1);
}, Cf = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, i = It(n, 0, r.content.size), s = _.create(r, i);
    e.setSelection(s);
  }
  return !0;
}, Sf = (n) => ({ tr: e, dispatch: t }) => {
  if (t) {
    const { doc: r } = e, { from: i, to: s } = typeof n == "number" ? { from: n, to: n } : n, o = $.atStart(r).from, l = $.atEnd(r).to, a = It(i, o, l), c = It(s, o, l), u = $.create(r, a, c);
    e.setSelection(u);
  }
  return !0;
}, Af = (n) => ({ state: e, dispatch: t }) => {
  const r = ae(n, e.schema);
  return xh(r)(e, t);
};
function wf(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs())
      return t;
  }
  return null;
}
function ur(n, e, t) {
  return Object.fromEntries(Object.entries(t).filter(([r]) => {
    const i = n.find((s) => s.type === e && s.name === r);
    return i ? i.attribute.keepOnSplit : !1;
  }));
}
function Go(n, e) {
  const t = n.storedMarks || n.selection.$to.parentOffset && n.selection.$from.marks();
  if (t) {
    const r = t.filter((i) => e == null ? void 0 : e.includes(i.type.name));
    n.tr.ensureMarks(r);
  }
}
const Mf = ({ keepMarks: n = !0 } = {}) => ({ tr: e, state: t, dispatch: r, editor: i }) => {
  const { selection: s, doc: o } = e, { $from: l, $to: a } = s, c = i.extensionManager.attributes, u = ur(c, l.node().type.name, l.node().attrs);
  if (s instanceof _ && s.node.isBlock)
    return !l.parentOffset || !dn(o, l.pos) ? !1 : (r && (n && Go(t, i.extensionManager.splittableMarks), e.split(l.pos).scrollIntoView()), !0);
  if (!l.parent.isBlock)
    return !1;
  if (r) {
    const d = a.parentOffset === a.parent.content.size;
    s instanceof $ && e.deleteSelection();
    const h = l.depth === 0 ? void 0 : wf(l.node(-1).contentMatchAt(l.indexAfter(-1)));
    let f = d && h ? [{
      type: h,
      attrs: u
    }] : void 0, p = dn(e.doc, e.mapping.map(l.pos), 1, f);
    if (!f && !p && dn(e.doc, e.mapping.map(l.pos), 1, h ? [{ type: h }] : void 0) && (p = !0, f = h ? [{
      type: h,
      attrs: u
    }] : void 0), p && (e.split(e.mapping.map(l.pos), 1, f), h && !d && !l.parentOffset && l.parent.type !== h)) {
      const g = e.mapping.map(l.before()), y = e.doc.resolve(g);
      l.node(-1).canReplaceWith(y.index(), y.index() + 1, h) && e.setNodeMarkup(e.mapping.map(l.before()), h);
    }
    n && Go(t, i.extensionManager.splittableMarks), e.scrollIntoView();
  }
  return !0;
}, Tf = (n) => ({ tr: e, state: t, dispatch: r, editor: i }) => {
  var s;
  const o = ae(n, t.schema), { $from: l, $to: a } = t.selection, c = t.selection.node;
  if (c && c.isBlock || l.depth < 2 || !l.sameParent(a))
    return !1;
  const u = l.node(-1);
  if (u.type !== o)
    return !1;
  const d = i.extensionManager.attributes;
  if (l.parent.content.size === 0 && l.node(-1).childCount === l.indexAfter(-1)) {
    if (l.depth === 2 || l.node(-3).type !== o || l.index(-2) !== l.node(-2).childCount - 1)
      return !1;
    if (r) {
      let y = k.empty;
      const D = l.index(-1) ? 1 : l.index(-2) ? 2 : 3;
      for (let G = l.depth - D; G >= l.depth - 3; G -= 1)
        y = k.from(l.node(G).copy(y));
      const R = l.indexAfter(-1) < l.node(-2).childCount ? 1 : l.indexAfter(-2) < l.node(-3).childCount ? 2 : 3, P = ur(d, l.node().type.name, l.node().attrs), z = ((s = o.contentMatch.defaultType) === null || s === void 0 ? void 0 : s.createAndFill(P)) || void 0;
      y = y.append(k.from(o.createAndFill(null, z) || void 0));
      const j = l.before(l.depth - (D - 1));
      e.replace(j, l.after(-R), new O(y, 4 - D, 0));
      let Q = -1;
      e.doc.nodesBetween(j, e.doc.content.size, (G, T) => {
        if (Q > -1)
          return !1;
        G.isTextblock && G.content.size === 0 && (Q = T + 1);
      }), Q > -1 && e.setSelection($.near(e.doc.resolve(Q))), e.scrollIntoView();
    }
    return !0;
  }
  const h = a.pos === l.end() ? u.contentMatchAt(0).defaultType : null, f = ur(d, u.type.name, u.attrs), p = ur(d, l.node().type.name, l.node().attrs);
  e.delete(l.pos, a.pos);
  const g = h ? [{ type: o, attrs: f }, { type: h, attrs: p }] : [{ type: o, attrs: f }];
  return dn(e.doc, l.pos, 2) ? (r && e.split(l.pos, 2, g).scrollIntoView(), !0) : !1;
};
function Of(n, e) {
  for (let t = n.depth; t > 0; t -= 1) {
    const r = n.node(t);
    if (e(r))
      return {
        pos: t > 0 ? n.before(t) : 0,
        start: n.start(t),
        depth: t,
        node: r
      };
  }
}
function Os(n) {
  return (e) => Of(e.$from, n);
}
function Yo(n, e) {
  const { nodeExtensions: t } = ni(e), r = t.find((o) => o.name === n);
  if (!r)
    return !1;
  const i = {
    name: r.name,
    options: r.options,
    storage: r.storage
  }, s = H(v(r, "group", i));
  return typeof s != "string" ? !1 : s.split(" ").includes("list");
}
const Xo = (n, e) => {
  const t = Os((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === (i == null ? void 0 : i.type) && Xn(n.doc, t.pos) && n.join(t.pos), !0;
}, Qo = (n, e) => {
  const t = Os((o) => o.type === e)(n.selection);
  if (!t)
    return !0;
  const r = n.doc.resolve(t.start).after(t.depth);
  if (r === void 0)
    return !0;
  const i = n.doc.nodeAt(r);
  return t.node.type === (i == null ? void 0 : i.type) && Xn(n.doc, r) && n.join(r), !0;
}, vf = (n, e) => ({ editor: t, tr: r, state: i, dispatch: s, chain: o, commands: l, can: a }) => {
  const { extensions: c } = t.extensionManager, u = ae(n, i.schema), d = ae(e, i.schema), { selection: h } = i, { $from: f, $to: p } = h, g = f.blockRange(p);
  if (!g)
    return !1;
  const y = Os((D) => Yo(D.type.name, c))(h);
  if (g.depth >= 1 && y && g.depth - y.depth <= 1) {
    if (y.node.type === u)
      return l.liftListItem(d);
    if (Yo(y.node.type.name, c) && u.validContent(y.node.content) && s)
      return o().command(() => (r.setNodeMarkup(y.pos, u), !0)).command(() => Xo(r, u)).command(() => Qo(r, u)).run();
  }
  return o().command(() => a().wrapInList(u) ? !0 : l.clearNodes()).wrapInList(u).command(() => Xo(r, u)).command(() => Qo(r, u)).run();
};
function ls(n, e, t = {}) {
  const { empty: r, ranges: i } = n.selection, s = e ? At(e, n.schema) : null;
  if (r)
    return !!(n.storedMarks || n.selection.$from.marks()).filter((d) => s ? s.name === d.type.name : !0).find((d) => Sr(d.attrs, t, { strict: !1 }));
  let o = 0;
  const l = [];
  if (i.forEach(({ $from: d, $to: h }) => {
    const f = d.pos, p = h.pos;
    n.doc.nodesBetween(f, p, (g, y) => {
      if (!g.isText && !g.marks.length)
        return;
      const D = Math.max(f, y), R = Math.min(p, y + g.nodeSize);
      o += R - D, l.push(...g.marks.map((z) => ({
        mark: z,
        from: D,
        to: R
      })));
    });
  }), o === 0)
    return !1;
  const a = l.filter((d) => s ? s.name === d.mark.type.name : !0).filter((d) => Sr(d.mark.attrs, t, { strict: !1 })).reduce((d, h) => d + h.to - h.from, 0), c = l.filter((d) => s ? d.mark.type !== s && d.mark.type.excludes(s) : !0).reduce((d, h) => d + h.to - h.from, 0);
  return (a > 0 ? a + c : a) >= o;
}
const Nf = (n, e = {}, t = {}) => ({ state: r, commands: i }) => {
  const { extendEmptyMarkRange: s = !1 } = t, o = At(n, r.schema);
  return ls(r, o, e) ? i.unsetMark(o, { extendEmptyMarkRange: s }) : i.setMark(o, e);
}, Ff = (n, e, t = {}) => ({ state: r, commands: i }) => {
  const s = ae(n, r.schema), o = ae(e, r.schema);
  return Un(r, s, t) ? i.setNode(o) : i.setNode(s, t);
}, Rf = (n, e = {}) => ({ state: t, commands: r }) => {
  const i = ae(n, t.schema);
  return Un(t, i, e) ? r.lift(i) : r.wrapIn(i, e);
}, Bf = () => ({ state: n, dispatch: e }) => {
  const t = n.plugins;
  for (let r = 0; r < t.length; r += 1) {
    const i = t[r];
    let s;
    if (i.spec.isInputRules && (s = i.getState(n))) {
      if (e) {
        const o = n.tr, l = s.transform;
        for (let a = l.steps.length - 1; a >= 0; a -= 1)
          o.step(l.steps[a].invert(l.docs[a]));
        if (s.text) {
          const a = o.doc.resolve(s.from).marks();
          o.replaceWith(s.from, s.to, n.schema.text(s.text, a));
        } else
          o.delete(s.from, s.to);
      }
      return !0;
    }
  }
  return !1;
}, If = () => ({ tr: n, dispatch: e }) => {
  const { selection: t } = n, { empty: r, ranges: i } = t;
  return r || e && i.forEach((s) => {
    n.removeMark(s.$from.pos, s.$to.pos);
  }), !0;
}, Pf = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  var s;
  const { extendEmptyMarkRange: o = !1 } = e, { selection: l } = t, a = At(n, r.schema), { $from: c, empty: u, ranges: d } = l;
  if (!i)
    return !0;
  if (u && o) {
    let { from: h, to: f } = l;
    const p = (s = c.marks().find((y) => y.type === a)) === null || s === void 0 ? void 0 : s.attrs, g = Ms(c, a, p);
    g && (h = g.from, f = g.to), t.removeMark(h, f, a);
  } else
    d.forEach((h) => {
      t.removeMark(h.$from.pos, h.$to.pos, a);
    });
  return t.removeStoredMark(a), !0;
}, Lf = (n, e = {}) => ({ tr: t, state: r, dispatch: i }) => {
  let s = null, o = null;
  const l = si(typeof n == "string" ? n : n.name, r.schema);
  return l ? (l === "node" && (s = ae(n, r.schema)), l === "mark" && (o = At(n, r.schema)), i && t.selection.ranges.forEach((a) => {
    const c = a.$from.pos, u = a.$to.pos;
    r.doc.nodesBetween(c, u, (d, h) => {
      s && s === d.type && t.setNodeMarkup(h, void 0, {
        ...d.attrs,
        ...e
      }), o && d.marks.length && d.marks.forEach((f) => {
        if (o === f.type) {
          const p = Math.max(h, c), g = Math.min(h + d.nodeSize, u);
          t.addMark(p, g, o.create({
            ...f.attrs,
            ...e
          }));
        }
      });
    });
  }), !0) : !1;
}, _f = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = ae(n, t.schema);
  return gh(i, e)(t, r);
}, zf = (n, e = {}) => ({ state: t, dispatch: r }) => {
  const i = ae(n, t.schema);
  return mh(i, e)(t, r);
};
var Hf = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  blur: Ph,
  clearContent: Lh,
  clearNodes: _h,
  command: zh,
  createParagraphNear: Hh,
  deleteNode: $h,
  deleteRange: jh,
  deleteSelection: Vh,
  enter: Uh,
  exitCode: Kh,
  extendMarkRange: qh,
  first: Jh,
  focus: Yh,
  forEach: Xh,
  insertContent: Qh,
  insertContentAt: tf,
  joinBackward: nf,
  joinForward: rf,
  keyboardShortcut: of,
  lift: lf,
  liftEmptyBlock: af,
  liftListItem: uf,
  newlineInCode: cf,
  resetAttributes: df,
  scrollIntoView: hf,
  selectAll: ff,
  selectNodeBackward: pf,
  selectNodeForward: gf,
  selectParentNode: mf,
  selectTextblockEnd: yf,
  selectTextblockStart: bf,
  setContent: Df,
  setMark: Ef,
  setMeta: xf,
  setNode: kf,
  setNodeSelection: Cf,
  setTextSelection: Sf,
  sinkListItem: Af,
  splitBlock: Mf,
  splitListItem: Tf,
  toggleList: vf,
  toggleMark: Nf,
  toggleNode: Ff,
  toggleWrap: Rf,
  undoInputRule: Bf,
  unsetAllMarks: If,
  unsetMark: Pf,
  updateAttributes: Lf,
  wrapIn: _f,
  wrapInList: zf
});
const $f = Le.create({
  name: "commands",
  addCommands() {
    return {
      ...Hf
    };
  }
}), jf = Le.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new ye({
        key: new Oe("editable"),
        props: {
          editable: () => this.editor.options.editable
        }
      })
    ];
  }
}), Vf = Le.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: n } = this;
    return [
      new ye({
        key: new Oe("focusEvents"),
        props: {
          handleDOMEvents: {
            focus: (e, t) => {
              n.isFocused = !0;
              const r = n.state.tr.setMeta("focus", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(r), !1;
            },
            blur: (e, t) => {
              n.isFocused = !1;
              const r = n.state.tr.setMeta("blur", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(r), !1;
            }
          }
        }
      })
    ];
  }
}), Uf = Le.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const n = () => this.editor.commands.first(({ commands: o }) => [
      () => o.undoInputRule(),
      () => o.command(({ tr: l }) => {
        const { selection: a, doc: c } = l, { empty: u, $anchor: d } = a, { pos: h, parent: f } = d, p = V.atStart(c).from === h;
        return !u || !p || !f.type.isTextblock || f.textContent.length ? !1 : o.clearNodes();
      }),
      () => o.deleteSelection(),
      () => o.joinBackward(),
      () => o.selectNodeBackward()
    ]), e = () => this.editor.commands.first(({ commands: o }) => [
      () => o.deleteSelection(),
      () => o.joinForward(),
      () => o.selectNodeForward()
    ]), r = {
      Enter: () => this.editor.commands.first(({ commands: o }) => [
        () => o.newlineInCode(),
        () => o.createParagraphNear(),
        () => o.liftEmptyBlock(),
        () => o.splitBlock()
      ]),
      "Mod-Enter": () => this.editor.commands.exitCode(),
      Backspace: n,
      "Mod-Backspace": n,
      "Shift-Backspace": n,
      Delete: e,
      "Mod-Delete": e,
      "Mod-a": () => this.editor.commands.selectAll()
    }, i = {
      ...r
    }, s = {
      ...r,
      "Ctrl-h": n,
      "Alt-Backspace": n,
      "Ctrl-d": e,
      "Ctrl-Alt-Backspace": e,
      "Alt-Delete": e,
      "Alt-d": e,
      "Ctrl-a": () => this.editor.commands.selectTextblockStart(),
      "Ctrl-e": () => this.editor.commands.selectTextblockEnd()
    };
    return Ts() || Ha() ? s : i;
  },
  addProseMirrorPlugins() {
    return [
      new ye({
        key: new Oe("clearDocument"),
        appendTransaction: (n, e, t) => {
          if (!(n.some((p) => p.docChanged) && !e.doc.eq(t.doc)))
            return;
          const { empty: i, from: s, to: o } = e.selection, l = V.atStart(e.doc).from, a = V.atEnd(e.doc).to, c = s === l && o === a, u = t.doc.textBetween(0, t.doc.content.size, " ", " ").length === 0;
          if (i || !c || !u)
            return;
          const d = t.tr, h = ei({
            state: t,
            transaction: d
          }), { commands: f } = new ti({
            editor: this.editor,
            state: h
          });
          if (f.clearNodes(), !!d.steps.length)
            return d;
        }
      })
    ];
  }
}), Kf = Le.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new ye({
        key: new Oe("tabindex"),
        props: {
          attributes: this.editor.isEditable ? { tabindex: "0" } : {}
        }
      })
    ];
  }
});
var Wf = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ClipboardTextSerializer: Ih,
  Commands: $f,
  Editable: jf,
  FocusEvents: Vf,
  Keymap: Uf,
  Tabindex: Kf
});
function qf(n, e) {
  const t = ae(e, n.schema), { from: r, to: i } = n.selection, s = [];
  n.doc.nodesBetween(r, i, (l) => {
    s.push(l);
  });
  const o = s.reverse().find((l) => l.type.name === t.name);
  return o ? { ...o.attrs } : {};
}
function Va(n, e) {
  const t = si(typeof e == "string" ? e : e.name, n.schema);
  return t === "node" ? qf(n, e) : t === "mark" ? ja(n, e) : {};
}
function Jf(n, e) {
  const t = Ge.fromSchema(e).serializeFragment(n), i = document.implementation.createHTMLDocument().createElement("div");
  return i.appendChild(t), i.innerHTML;
}
function Gf(n, e) {
  const t = {
    from: 0,
    to: n.content.size
  };
  return La(n, t, e);
}
function Yf(n, e, t = {}) {
  if (!e)
    return Un(n, null, t) || ls(n, null, t);
  const r = si(e, n.schema);
  return r === "node" ? Un(n, e, t) : r === "mark" ? ls(n, e, t) : !1;
}
function Xf(n) {
  var e;
  const t = (e = n.type.createAndFill()) === null || e === void 0 ? void 0 : e.toJSON(), r = n.toJSON();
  return JSON.stringify(t) === JSON.stringify(r);
}
const Qf = `.ProseMirror {
  position: relative;
}

.ProseMirror {
  word-wrap: break-word;
  white-space: pre-wrap;
  white-space: break-spaces;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0; /* the above doesn't seem to work in Edge */
}

.ProseMirror [contenteditable="false"] {
  white-space: normal;
}

.ProseMirror [contenteditable="false"] [contenteditable="true"] {
  white-space: pre-wrap;
}

.ProseMirror pre {
  white-space: pre-wrap;
}

img.ProseMirror-separator {
  display: inline !important;
  border: none !important;
  margin: 0 !important;
  width: 1px !important;
  height: 1px !important;
}

.ProseMirror-gapcursor {
  display: none;
  pointer-events: none;
  position: absolute;
  margin: 0;
}

.ProseMirror-gapcursor:after {
  content: "";
  display: block;
  position: absolute;
  top: -2px;
  width: 20px;
  border-top: 1px solid black;
  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
}

@keyframes ProseMirror-cursor-blink {
  to {
    visibility: hidden;
  }
}

.ProseMirror-hideselection *::selection {
  background: transparent;
}

.ProseMirror-hideselection *::-moz-selection {
  background: transparent;
}

.ProseMirror-hideselection * {
  caret-color: transparent;
}

.ProseMirror-focused .ProseMirror-gapcursor {
  display: block;
}

.tippy-box[data-animation=fade][data-state=hidden] {
  opacity: 0
}`;
function Zf(n, e) {
  const t = document.querySelector("style[data-tiptap-style]");
  if (t !== null)
    return t;
  const r = document.createElement("style");
  return e && r.setAttribute("nonce", e), r.setAttribute("data-tiptap-style", ""), r.innerHTML = n, document.getElementsByTagName("head")[0].appendChild(r), r;
}
class ep extends kh {
  constructor(e = {}) {
    super(), this.isFocused = !1, this.extensionStorage = {}, this.options = {
      element: document.createElement("div"),
      content: "",
      injectCSS: !0,
      injectNonce: void 0,
      extensions: [],
      autofocus: !1,
      editable: !0,
      editorProps: {},
      parseOptions: {},
      enableInputRules: !0,
      enablePasteRules: !0,
      enableCoreExtensions: !0,
      onBeforeCreate: () => null,
      onCreate: () => null,
      onUpdate: () => null,
      onSelectionUpdate: () => null,
      onTransaction: () => null,
      onFocus: () => null,
      onBlur: () => null,
      onDestroy: () => null
    }, this.isCapturingTransaction = !1, this.capturedTransaction = null, this.setOptions(e), this.createExtensionManager(), this.createCommandManager(), this.createSchema(), this.on("beforeCreate", this.options.onBeforeCreate), this.emit("beforeCreate", { editor: this }), this.createView(), this.injectCSS(), this.on("create", this.options.onCreate), this.on("update", this.options.onUpdate), this.on("selectionUpdate", this.options.onSelectionUpdate), this.on("transaction", this.options.onTransaction), this.on("focus", this.options.onFocus), this.on("blur", this.options.onBlur), this.on("destroy", this.options.onDestroy), window.setTimeout(() => {
      this.isDestroyed || (this.commands.focus(this.options.autofocus), this.emit("create", { editor: this }));
    }, 0);
  }
  get storage() {
    return this.extensionStorage;
  }
  get commands() {
    return this.commandManager.commands;
  }
  chain() {
    return this.commandManager.chain();
  }
  can() {
    return this.commandManager.can();
  }
  injectCSS() {
    this.options.injectCSS && document && (this.css = Zf(Qf, this.options.injectNonce));
  }
  setOptions(e = {}) {
    this.options = {
      ...this.options,
      ...e
    }, !(!this.view || !this.state || this.isDestroyed) && (this.options.editorProps && this.view.setProps(this.options.editorProps), this.view.updateState(this.state));
  }
  setEditable(e) {
    this.setOptions({ editable: e }), this.emit("update", { editor: this, transaction: this.state.tr });
  }
  get isEditable() {
    return this.options.editable && this.view && this.view.editable;
  }
  get state() {
    return this.view.state;
  }
  registerPlugin(e, t) {
    const r = Ia(t) ? t(e, [...this.state.plugins]) : [...this.state.plugins, e], i = this.state.reconfigure({ plugins: r });
    this.view.updateState(i);
  }
  unregisterPlugin(e) {
    if (this.isDestroyed)
      return;
    const t = typeof e == "string" ? `${e}$` : e.key, r = this.state.reconfigure({
      plugins: this.state.plugins.filter((i) => !i.key.startsWith(t))
    });
    this.view.updateState(r);
  }
  createExtensionManager() {
    const t = [...this.options.enableCoreExtensions ? Object.values(Wf) : [], ...this.options.extensions].filter((r) => ["extension", "node", "mark"].includes(r == null ? void 0 : r.type));
    this.extensionManager = new rn(t, this);
  }
  createCommandManager() {
    this.commandManager = new ti({
      editor: this
    });
  }
  createSchema() {
    this.schema = this.extensionManager.schema;
  }
  createView() {
    const e = $a(this.options.content, this.schema, this.options.parseOptions), t = za(e, this.options.autofocus);
    this.view = new Ud(this.options.element, {
      ...this.options.editorProps,
      dispatchTransaction: this.dispatchTransaction.bind(this),
      state: en.create({
        doc: e,
        selection: t || void 0
      })
    });
    const r = this.state.reconfigure({
      plugins: this.extensionManager.plugins
    });
    this.view.updateState(r), this.createNodeViews();
    const i = this.view.dom;
    i.editor = this;
  }
  createNodeViews() {
    this.view.setProps({
      nodeViews: this.extensionManager.nodeViews
    });
  }
  captureTransaction(e) {
    this.isCapturingTransaction = !0, e(), this.isCapturingTransaction = !1;
    const t = this.capturedTransaction;
    return this.capturedTransaction = null, t;
  }
  dispatchTransaction(e) {
    if (this.isCapturingTransaction) {
      if (!this.capturedTransaction) {
        this.capturedTransaction = e;
        return;
      }
      e.steps.forEach((o) => {
        var l;
        return (l = this.capturedTransaction) === null || l === void 0 ? void 0 : l.step(o);
      });
      return;
    }
    const t = this.state.apply(e), r = !this.state.selection.eq(t.selection);
    this.view.updateState(t), this.emit("transaction", {
      editor: this,
      transaction: e
    }), r && this.emit("selectionUpdate", {
      editor: this,
      transaction: e
    });
    const i = e.getMeta("focus"), s = e.getMeta("blur");
    i && this.emit("focus", {
      editor: this,
      event: i.event,
      transaction: e
    }), s && this.emit("blur", {
      editor: this,
      event: s.event,
      transaction: e
    }), !(!e.docChanged || e.getMeta("preventUpdate")) && this.emit("update", {
      editor: this,
      transaction: e
    });
  }
  getAttributes(e) {
    return Va(this.state, e);
  }
  isActive(e, t) {
    const r = typeof e == "string" ? e : null, i = typeof e == "string" ? t : e;
    return Yf(this.state, r, i);
  }
  getJSON() {
    return this.state.doc.toJSON();
  }
  getHTML() {
    return Jf(this.state.doc.content, this.schema);
  }
  getText(e) {
    const { blockSeparator: t = `

`, textSerializers: r = {} } = e || {};
    return Gf(this.state.doc, {
      blockSeparator: t,
      textSerializers: {
        ...r,
        ..._a(this.schema)
      }
    });
  }
  get isEmpty() {
    return Xf(this.state.doc);
  }
  getCharacterCount() {
    return console.warn('[tiptap warn]: "editor.getCharacterCount()" is deprecated. Please use "editor.storage.characterCount.characters()" instead.'), this.state.doc.content.size - 2;
  }
  destroy() {
    this.emit("destroy"), this.view && this.view.destroy(), this.removeAllListeners();
  }
  get isDestroyed() {
    var e;
    return !(!((e = this.view) === null || e === void 0) && e.docView);
  }
}
function tp(n, e) {
  const t = new ql(n);
  return e.forEach((r) => {
    r.steps.forEach((i) => {
      t.step(i);
    });
  }), t;
}
function as(n, e) {
  const t = [];
  return n.descendants((r, i) => {
    e(r) && t.push({
      node: r,
      pos: i
    });
  }), t;
}
function np(n, e, t) {
  const r = [];
  return n.nodesBetween(e.from, e.to, (i, s) => {
    t(i) && r.push({
      node: i,
      pos: s
    });
  }), r;
}
function rp(n, e = JSON.stringify) {
  const t = {};
  return n.filter((r) => {
    const i = e(r);
    return Object.prototype.hasOwnProperty.call(t, i) ? !1 : t[i] = !0;
  });
}
function ip(n) {
  const e = rp(n);
  return e.length === 1 ? e : e.filter((t, r) => !e.filter((s, o) => o !== r).some((s) => t.oldRange.from >= s.oldRange.from && t.oldRange.to <= s.oldRange.to && t.newRange.from >= s.newRange.from && t.newRange.to <= s.newRange.to));
}
function sp(n) {
  const { mapping: e, steps: t } = n, r = [];
  return e.maps.forEach((i, s) => {
    const o = [];
    if (i.ranges.length)
      i.forEach((l, a) => {
        o.push({ from: l, to: a });
      });
    else {
      const { from: l, to: a } = t[s];
      if (l === void 0 || a === void 0)
        return;
      o.push({ from: l, to: a });
    }
    o.forEach(({ from: l, to: a }) => {
      const c = e.slice(s).map(l, -1), u = e.slice(s).map(a), d = e.invert().map(c, -1), h = e.invert().map(u);
      r.push({
        oldRange: {
          from: d,
          to: h
        },
        newRange: {
          from: c,
          to: u
        }
      });
    });
  }), ip(r);
}
function wr(n, e, t) {
  const r = [];
  return n === e ? t.resolve(n).marks().forEach((i) => {
    const s = t.resolve(n - 1), o = Ms(s, i.type);
    !o || r.push({
      mark: i,
      ...o
    });
  }) : t.nodesBetween(n, e, (i, s) => {
    r.push(...i.marks.map((o) => ({
      from: s,
      to: s + i.nodeSize,
      mark: o
    })));
  }), r;
}
function Kt(n) {
  return new ri({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const i = H(n.getAttributes, void 0, r);
      if (i === !1 || i === null)
        return null;
      const { tr: s } = e, o = r[r.length - 1], l = r[0];
      let a = t.to;
      if (o) {
        const c = l.search(/\S/), u = t.from + l.indexOf(o), d = u + o.length;
        if (wr(t.from, t.to, e.doc).filter((f) => f.mark.type.excluded.find((g) => g === n.type && g !== f.mark.type)).filter((f) => f.to > u).length)
          return null;
        d < t.to && s.delete(d, t.to), u > t.from && s.delete(t.from + c, u), a = t.from + c + o.length, s.addMark(t.from + c, a, n.type.create(i || {})), s.removeStoredMark(n.type);
      }
    }
  });
}
function Ua(n) {
  return new ri({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const i = H(n.getAttributes, void 0, r) || {}, { tr: s } = e, o = t.from;
      let l = t.to;
      if (r[1]) {
        const a = r[0].lastIndexOf(r[1]);
        let c = o + a;
        c > l ? c = l : l = c + r[1].length;
        const u = r[0][r[0].length - 1];
        s.insertText(u, o + r[0].length - 1), s.replaceWith(c, l, n.type.create(i));
      } else
        r[0] && s.replaceWith(o, l, n.type.create(i));
    }
  });
}
function us(n) {
  return new ri({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const i = e.doc.resolve(t.from), s = H(n.getAttributes, void 0, r) || {};
      if (!i.node(-1).canReplaceWith(i.index(-1), i.indexAfter(-1), n.type))
        return null;
      e.tr.delete(t.from, t.to).setBlockType(t.from, t.from, n.type, s);
    }
  });
}
function Ka(n) {
  return new ri({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const i = H(n.getAttributes, void 0, r) || {}, s = e.tr.delete(t.from, t.to), l = s.doc.resolve(t.from).blockRange(), a = l && fs(l, n.type, i);
      if (!a)
        return null;
      s.wrap(l, a);
      const c = s.doc.resolve(t.from - 1).nodeBefore;
      c && c.type === n.type && Xn(s.doc, t.from - 1) && (!n.joinPredicate || n.joinPredicate(r, c)) && s.join(t.from - 1);
    }
  });
}
class Be {
  constructor(e = {}) {
    this.type = "mark", this.name = "mark", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = H(v(this, "addOptions", {
      name: this.name
    }))), this.storage = H(v(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new Be(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return t.options = ii(this.options, e), t.storage = H(v(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  extend(e = {}) {
    const t = new Be(e);
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = H(v(t, "addOptions", {
      name: t.name
    })), t.storage = H(v(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  static handleExit({ editor: e, mark: t }) {
    const { tr: r } = e.state, i = e.state.selection.$from;
    if (i.pos === i.end()) {
      const o = i.marks();
      if (!!!o.find((c) => (c == null ? void 0 : c.type.name) === t.name))
        return !1;
      const a = o.find((c) => (c == null ? void 0 : c.type.name) === t.name);
      return a && r.removeStoredMark(a), r.insertText(" ", i.pos), e.view.dispatch(r), !0;
    }
    return !1;
  }
}
class xe {
  constructor(e = {}) {
    this.type = "node", this.name = "node", this.parent = null, this.child = null, this.config = {
      name: this.name,
      defaultOptions: {}
    }, this.config = {
      ...this.config,
      ...e
    }, this.name = this.config.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`), this.options = this.config.defaultOptions, this.config.addOptions && (this.options = H(v(this, "addOptions", {
      name: this.name
    }))), this.storage = H(v(this, "addStorage", {
      name: this.name,
      options: this.options
    })) || {};
  }
  static create(e = {}) {
    return new xe(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return t.options = ii(this.options, e), t.storage = H(v(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
  extend(e = {}) {
    const t = new xe(e);
    return t.parent = this, this.child = t, t.name = e.name ? e.name : t.parent.name, e.defaultOptions && console.warn(`[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`), t.options = H(v(t, "addOptions", {
      name: t.name
    })), t.storage = H(v(t, "addStorage", {
      name: t.name,
      options: t.options
    })), t;
  }
}
function kt(n) {
  return new Pa({
    find: n.find,
    handler: ({ state: e, range: t, match: r }) => {
      const i = H(n.getAttributes, void 0, r);
      if (i === !1 || i === null)
        return null;
      const { tr: s } = e, o = r[r.length - 1], l = r[0];
      let a = t.to;
      if (o) {
        const c = l.search(/\S/), u = t.from + l.indexOf(o), d = u + o.length;
        if (wr(t.from, t.to, e.doc).filter((f) => f.mark.type.excluded.find((g) => g === n.type && g !== f.mark.type)).filter((f) => f.to > u).length)
          return null;
        d < t.to && s.delete(d, t.to), u > t.from && s.delete(t.from + c, u), a = t.from + c + o.length, s.addMark(t.from + c, a, n.type.create(i || {})), s.removeStoredMark(n.type);
      }
    }
  });
}
function op(n) {
  return n.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
}
function lp(n) {
  return new Pa({
    find: n.find,
    handler({ match: e, chain: t, range: r }) {
      const i = H(n.getAttributes, void 0, e);
      if (i === !1 || i === null)
        return null;
      e.input && t().deleteRange(r).insertContentAt(r.from, {
        type: n.type.name,
        attrs: i
      });
    }
  });
}
const ap = xe.create({
  name: "doc",
  topNode: !0,
  content: "block+"
}), up = xe.create({
  name: "text",
  group: "inline"
});
class Z extends V {
  constructor(e) {
    super(e, e);
  }
  map(e, t) {
    let r = e.resolve(t.map(this.head));
    return Z.valid(r) ? new Z(r) : V.near(r);
  }
  content() {
    return O.empty;
  }
  eq(e) {
    return e instanceof Z && e.head == this.head;
  }
  toJSON() {
    return { type: "gapcursor", pos: this.head };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for GapCursor.fromJSON");
    return new Z(e.resolve(t.pos));
  }
  getBookmark() {
    return new vs(this.anchor);
  }
  static valid(e) {
    let t = e.parent;
    if (t.isTextblock || !cp(e) || !dp(e))
      return !1;
    let r = t.type.spec.allowGapCursor;
    if (r != null)
      return r;
    let i = t.contentMatchAt(e.index()).defaultType;
    return i && i.isTextblock;
  }
  static findGapCursorFrom(e, t, r = !1) {
    e:
      for (; ; ) {
        if (!r && Z.valid(e))
          return e;
        let i = e.pos, s = null;
        for (let o = e.depth; ; o--) {
          let l = e.node(o);
          if (t > 0 ? e.indexAfter(o) < l.childCount : e.index(o) > 0) {
            s = l.child(t > 0 ? e.indexAfter(o) : e.index(o) - 1);
            break;
          } else if (o == 0)
            return null;
          i += t;
          let a = e.doc.resolve(i);
          if (Z.valid(a))
            return a;
        }
        for (; ; ) {
          let o = t > 0 ? s.firstChild : s.lastChild;
          if (!o) {
            if (s.isAtom && !s.isText && !_.isSelectable(s)) {
              e = e.doc.resolve(i + s.nodeSize * t), r = !1;
              continue e;
            }
            break;
          }
          s = o, i += t;
          let l = e.doc.resolve(i);
          if (Z.valid(l))
            return l;
        }
        return null;
      }
  }
}
Z.prototype.visible = !1;
Z.findFrom = Z.findGapCursorFrom;
V.jsonID("gapcursor", Z);
class vs {
  constructor(e) {
    this.pos = e;
  }
  map(e) {
    return new vs(e.map(this.pos));
  }
  resolve(e) {
    let t = e.resolve(this.pos);
    return Z.valid(t) ? new Z(t) : V.near(t);
  }
}
function cp(n) {
  for (let e = n.depth; e >= 0; e--) {
    let t = n.index(e), r = n.node(e);
    if (t == 0) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let i = r.child(t - 1); ; i = i.lastChild) {
      if (i.childCount == 0 && !i.inlineContent || i.isAtom || i.type.spec.isolating)
        return !0;
      if (i.inlineContent)
        return !1;
    }
  }
  return !0;
}
function dp(n) {
  for (let e = n.depth; e >= 0; e--) {
    let t = n.indexAfter(e), r = n.node(e);
    if (t == r.childCount) {
      if (r.type.spec.isolating)
        return !0;
      continue;
    }
    for (let i = r.child(t); ; i = i.firstChild) {
      if (i.childCount == 0 && !i.inlineContent || i.isAtom || i.type.spec.isolating)
        return !0;
      if (i.inlineContent)
        return !1;
    }
  }
  return !0;
}
function hp() {
  return new ye({
    props: {
      decorations: mp,
      createSelectionBetween(n, e, t) {
        return e.pos == t.pos && Z.valid(t) ? new Z(t) : null;
      },
      handleClick: pp,
      handleKeyDown: fp,
      handleDOMEvents: { beforeinput: gp }
    }
  });
}
const fp = Ta({
  ArrowLeft: sr("horiz", -1),
  ArrowRight: sr("horiz", 1),
  ArrowUp: sr("vert", -1),
  ArrowDown: sr("vert", 1)
});
function sr(n, e) {
  const t = n == "vert" ? e > 0 ? "down" : "up" : e > 0 ? "right" : "left";
  return function(r, i, s) {
    let o = r.selection, l = e > 0 ? o.$to : o.$from, a = o.empty;
    if (o instanceof $) {
      if (!s.endOfTextblock(t) || l.depth == 0)
        return !1;
      a = !1, l = r.doc.resolve(e > 0 ? l.after() : l.before());
    }
    let c = Z.findGapCursorFrom(l, e, a);
    return c ? (i && i(r.tr.setSelection(new Z(c))), !0) : !1;
  };
}
function pp(n, e, t) {
  if (!n || !n.editable)
    return !1;
  let r = n.state.doc.resolve(e);
  if (!Z.valid(r))
    return !1;
  let i = n.posAtCoords({ left: t.clientX, top: t.clientY });
  return i && i.inside > -1 && _.isSelectable(n.state.doc.nodeAt(i.inside)) ? !1 : (n.dispatch(n.state.tr.setSelection(new Z(r))), !0);
}
function gp(n, e) {
  if (e.inputType != "insertCompositionText" || !(n.state.selection instanceof Z))
    return !1;
  let { $from: t } = n.state.selection, r = t.parent.contentMatchAt(t.index()).findWrapping(n.state.schema.nodes.text);
  if (!r)
    return !1;
  let i = k.empty;
  for (let o = r.length - 1; o >= 0; o--)
    i = k.from(r[o].createAndFill(null, i));
  let s = n.state.tr.replace(t.pos, t.pos, new O(i, 0, 0));
  return s.setSelection($.near(s.doc.resolve(t.pos + 1))), n.dispatch(s), !1;
}
function mp(n) {
  if (!(n.selection instanceof Z))
    return null;
  let e = document.createElement("div");
  return e.className = "ProseMirror-gapcursor", se.create(n.doc, [we.widget(n.selection.head, e, { key: "gapcursor" })]);
}
const yp = Le.create({
  name: "gapCursor",
  addProseMirrorPlugins() {
    return [
      hp()
    ];
  },
  extendNodeSchema(n) {
    var e;
    const t = {
      name: n.name,
      options: n.options,
      storage: n.storage
    };
    return {
      allowGapCursor: (e = H(v(n, "allowGapCursor", t))) !== null && e !== void 0 ? e : null
    };
  }
});
class Wa extends HTMLElement {
  constructor() {
    super(), this.extensions = [ap, up, yp], this.attachShadow({ mode: "open" }), this.attachInternals(), this.shadowRoot.appendChild(document.createElement("slot"));
  }
  get content() {
    return this.querySelector("rich-text-content");
  }
  get html() {
    return this.editor.getHTML();
  }
  get text() {
    return this.editor.getText();
  }
  get json() {
    return this.editor.getJSON();
  }
  get value() {
    return JSON.stringify(this.json);
  }
  connectedCallback() {
    window.setTimeout(() => {
      this.initEditor();
    }, 0);
  }
  registerPlugin(e) {
    this.extensions.includes(e) || this.extensions.push(e);
  }
  initEditor() {
    const e = this.content.innerHTML.length > 1 ? this.content.innerHTML : JSON.parse(this.getAttribute("value"));
    this.content.innerHTML = "", this.editor = new ep({
      element: this.content,
      extensions: this.extensions,
      autofocus: !0,
      content: e
    }), this.removeAttribute("value"), this.querySelectorAll("a").forEach((t) => {
      t.addEventListener("click", (r) => {
        r.preventDefault();
      });
    });
  }
}
Wa.observedAttributes = ["value"];
window.customElements.define("rich-text", Wa);
class bp extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" }), this.shadowRoot.appendChild(document.createElement("slot"));
  }
}
window.customElements.define("rich-text-toolbar", bp);
class Dp extends HTMLElement {
  constructor() {
    super();
  }
  get richText() {
    return this.closest("rich-text");
  }
}
window.customElements.define("rich-text-content", Dp);
var Mr = 200, me = function() {
};
me.prototype.append = function(e) {
  return e.length ? (e = me.from(e), !this.length && e || e.length < Mr && this.leafAppend(e) || this.length < Mr && e.leafPrepend(this) || this.appendInner(e)) : this;
};
me.prototype.prepend = function(e) {
  return e.length ? me.from(e).append(this) : this;
};
me.prototype.appendInner = function(e) {
  return new Ep(this, e);
};
me.prototype.slice = function(e, t) {
  return e === void 0 && (e = 0), t === void 0 && (t = this.length), e >= t ? me.empty : this.sliceInner(Math.max(0, e), Math.min(this.length, t));
};
me.prototype.get = function(e) {
  if (!(e < 0 || e >= this.length))
    return this.getInner(e);
};
me.prototype.forEach = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length), t <= r ? this.forEachInner(e, t, r, 0) : this.forEachInvertedInner(e, t, r, 0);
};
me.prototype.map = function(e, t, r) {
  t === void 0 && (t = 0), r === void 0 && (r = this.length);
  var i = [];
  return this.forEach(function(s, o) {
    return i.push(e(s, o));
  }, t, r), i;
};
me.from = function(e) {
  return e instanceof me ? e : e && e.length ? new qa(e) : me.empty;
};
var qa = /* @__PURE__ */ function(n) {
  function e(r) {
    n.call(this), this.values = r;
  }
  n && (e.__proto__ = n), e.prototype = Object.create(n && n.prototype), e.prototype.constructor = e;
  var t = { length: { configurable: !0 }, depth: { configurable: !0 } };
  return e.prototype.flatten = function() {
    return this.values;
  }, e.prototype.sliceInner = function(i, s) {
    return i == 0 && s == this.length ? this : new e(this.values.slice(i, s));
  }, e.prototype.getInner = function(i) {
    return this.values[i];
  }, e.prototype.forEachInner = function(i, s, o, l) {
    for (var a = s; a < o; a++)
      if (i(this.values[a], l + a) === !1)
        return !1;
  }, e.prototype.forEachInvertedInner = function(i, s, o, l) {
    for (var a = s - 1; a >= o; a--)
      if (i(this.values[a], l + a) === !1)
        return !1;
  }, e.prototype.leafAppend = function(i) {
    if (this.length + i.length <= Mr)
      return new e(this.values.concat(i.flatten()));
  }, e.prototype.leafPrepend = function(i) {
    if (this.length + i.length <= Mr)
      return new e(i.flatten().concat(this.values));
  }, t.length.get = function() {
    return this.values.length;
  }, t.depth.get = function() {
    return 0;
  }, Object.defineProperties(e.prototype, t), e;
}(me);
me.empty = new qa([]);
var Ep = /* @__PURE__ */ function(n) {
  function e(t, r) {
    n.call(this), this.left = t, this.right = r, this.length = t.length + r.length, this.depth = Math.max(t.depth, r.depth) + 1;
  }
  return n && (e.__proto__ = n), e.prototype = Object.create(n && n.prototype), e.prototype.constructor = e, e.prototype.flatten = function() {
    return this.left.flatten().concat(this.right.flatten());
  }, e.prototype.getInner = function(r) {
    return r < this.left.length ? this.left.get(r) : this.right.get(r - this.left.length);
  }, e.prototype.forEachInner = function(r, i, s, o) {
    var l = this.left.length;
    if (i < l && this.left.forEachInner(r, i, Math.min(s, l), o) === !1 || s > l && this.right.forEachInner(r, Math.max(i - l, 0), Math.min(this.length, s) - l, o + l) === !1)
      return !1;
  }, e.prototype.forEachInvertedInner = function(r, i, s, o) {
    var l = this.left.length;
    if (i > l && this.right.forEachInvertedInner(r, i - l, Math.max(s, l) - l, o + l) === !1 || s < l && this.left.forEachInvertedInner(r, Math.min(i, l), s, o) === !1)
      return !1;
  }, e.prototype.sliceInner = function(r, i) {
    if (r == 0 && i == this.length)
      return this;
    var s = this.left.length;
    return i <= s ? this.left.slice(r, i) : r >= s ? this.right.slice(r - s, i - s) : this.left.slice(r, s).append(this.right.slice(0, i - s));
  }, e.prototype.leafAppend = function(r) {
    var i = this.right.leafAppend(r);
    if (i)
      return new e(this.left, i);
  }, e.prototype.leafPrepend = function(r) {
    var i = this.left.leafPrepend(r);
    if (i)
      return new e(i, this.right);
  }, e.prototype.appendInner = function(r) {
    return this.left.depth >= Math.max(this.right.depth, r.depth) + 1 ? new e(this.left, new e(this.right, r)) : new e(this, r);
  }, e;
}(me), Ja = me;
const xp = 500;
class $e {
  constructor(e, t) {
    this.items = e, this.eventCount = t;
  }
  popEvent(e, t) {
    if (this.eventCount == 0)
      return null;
    let r = this.items.length;
    for (; ; r--)
      if (this.items.get(r - 1).selection) {
        --r;
        break;
      }
    let i, s;
    t && (i = this.remapping(r, this.items.length), s = i.maps.length);
    let o = e.tr, l, a, c = [], u = [];
    return this.items.forEach((d, h) => {
      if (!d.step) {
        i || (i = this.remapping(r, h + 1), s = i.maps.length), s--, u.push(d);
        return;
      }
      if (i) {
        u.push(new Ke(d.map));
        let f = d.step.map(i.slice(s)), p;
        f && o.maybeStep(f).doc && (p = o.mapping.maps[o.mapping.maps.length - 1], c.push(new Ke(p, void 0, void 0, c.length + u.length))), s--, p && i.appendMap(p, s);
      } else
        o.maybeStep(d.step);
      if (d.selection)
        return l = i ? d.selection.map(i.slice(s)) : d.selection, a = new $e(this.items.slice(0, r).append(u.reverse().concat(c)), this.eventCount - 1), !1;
    }, this.items.length, 0), { remaining: a, transform: o, selection: l };
  }
  addTransform(e, t, r, i) {
    let s = [], o = this.eventCount, l = this.items, a = !i && l.length ? l.get(l.length - 1) : null;
    for (let u = 0; u < e.steps.length; u++) {
      let d = e.steps[u].invert(e.docs[u]), h = new Ke(e.mapping.maps[u], d, t), f;
      (f = a && a.merge(h)) && (h = f, u ? s.pop() : l = l.slice(0, l.length - 1)), s.push(h), t && (o++, t = void 0), i || (a = h);
    }
    let c = o - r.depth;
    return c > Cp && (l = kp(l, c), o -= c), new $e(l.append(s), o);
  }
  remapping(e, t) {
    let r = new cn();
    return this.items.forEach((i, s) => {
      let o = i.mirrorOffset != null && s - i.mirrorOffset >= e ? r.maps.length - i.mirrorOffset : void 0;
      r.appendMap(i.map, o);
    }, e, t), r;
  }
  addMaps(e) {
    return this.eventCount == 0 ? this : new $e(this.items.append(e.map((t) => new Ke(t))), this.eventCount);
  }
  rebased(e, t) {
    if (!this.eventCount)
      return this;
    let r = [], i = Math.max(0, this.items.length - t), s = e.mapping, o = e.steps.length, l = this.eventCount;
    this.items.forEach((h) => {
      h.selection && l--;
    }, i);
    let a = t;
    this.items.forEach((h) => {
      let f = s.getMirror(--a);
      if (f == null)
        return;
      o = Math.min(o, f);
      let p = s.maps[f];
      if (h.step) {
        let g = e.steps[f].invert(e.docs[f]), y = h.selection && h.selection.map(s.slice(a + 1, f));
        y && l++, r.push(new Ke(p, g, y));
      } else
        r.push(new Ke(p));
    }, i);
    let c = [];
    for (let h = t; h < o; h++)
      c.push(new Ke(s.maps[h]));
    let u = this.items.slice(0, i).append(c).append(r), d = new $e(u, l);
    return d.emptyItemCount() > xp && (d = d.compress(this.items.length - r.length)), d;
  }
  emptyItemCount() {
    let e = 0;
    return this.items.forEach((t) => {
      t.step || e++;
    }), e;
  }
  compress(e = this.items.length) {
    let t = this.remapping(0, e), r = t.maps.length, i = [], s = 0;
    return this.items.forEach((o, l) => {
      if (l >= e)
        i.push(o), o.selection && s++;
      else if (o.step) {
        let a = o.step.map(t.slice(r)), c = a && a.getMap();
        if (r--, c && t.appendMap(c, r), a) {
          let u = o.selection && o.selection.map(t.slice(r));
          u && s++;
          let d = new Ke(c.invert(), a, u), h, f = i.length - 1;
          (h = i.length && i[f].merge(d)) ? i[f] = h : i.push(d);
        }
      } else
        o.map && r--;
    }, this.items.length, 0), new $e(Ja.from(i.reverse()), s);
  }
}
$e.empty = new $e(Ja.empty, 0);
function kp(n, e) {
  let t;
  return n.forEach((r, i) => {
    if (r.selection && e-- == 0)
      return t = i, !1;
  }), n.slice(t);
}
class Ke {
  constructor(e, t, r, i) {
    this.map = e, this.step = t, this.selection = r, this.mirrorOffset = i;
  }
  merge(e) {
    if (this.step && e.step && !e.selection) {
      let t = e.step.merge(this.step);
      if (t)
        return new Ke(t.getMap().invert(), t, this.selection);
    }
  }
}
class ct {
  constructor(e, t, r, i) {
    this.done = e, this.undone = t, this.prevRanges = r, this.prevTime = i;
  }
}
const Cp = 20;
function Sp(n, e, t, r) {
  let i = t.getMeta(bt), s;
  if (i)
    return i.historyState;
  t.getMeta(wp) && (n = new ct(n.done, n.undone, null, 0));
  let o = t.getMeta("appendedTransaction");
  if (t.steps.length == 0)
    return n;
  if (o && o.getMeta(bt))
    return o.getMeta(bt).redo ? new ct(n.done.addTransform(t, void 0, r, cr(e)), n.undone, Zo(t.mapping.maps[t.steps.length - 1]), n.prevTime) : new ct(n.done, n.undone.addTransform(t, void 0, r, cr(e)), null, n.prevTime);
  if (t.getMeta("addToHistory") !== !1 && !(o && o.getMeta("addToHistory") === !1)) {
    let l = n.prevTime == 0 || !o && (n.prevTime < (t.time || 0) - r.newGroupDelay || !Ap(t, n.prevRanges)), a = o ? zi(n.prevRanges, t.mapping) : Zo(t.mapping.maps[t.steps.length - 1]);
    return new ct(n.done.addTransform(t, l ? e.selection.getBookmark() : void 0, r, cr(e)), $e.empty, a, t.time);
  } else
    return (s = t.getMeta("rebased")) ? new ct(n.done.rebased(t, s), n.undone.rebased(t, s), zi(n.prevRanges, t.mapping), n.prevTime) : new ct(n.done.addMaps(t.mapping.maps), n.undone.addMaps(t.mapping.maps), zi(n.prevRanges, t.mapping), n.prevTime);
}
function Ap(n, e) {
  if (!e)
    return !1;
  if (!n.docChanged)
    return !0;
  let t = !1;
  return n.mapping.maps[0].forEach((r, i) => {
    for (let s = 0; s < e.length; s += 2)
      r <= e[s + 1] && i >= e[s] && (t = !0);
  }), t;
}
function Zo(n) {
  let e = [];
  return n.forEach((t, r, i, s) => e.push(i, s)), e;
}
function zi(n, e) {
  if (!n)
    return null;
  let t = [];
  for (let r = 0; r < n.length; r += 2) {
    let i = e.map(n[r], 1), s = e.map(n[r + 1], -1);
    i <= s && t.push(i, s);
  }
  return t;
}
function Ga(n, e, t, r) {
  let i = cr(e), s = bt.get(e).spec.config, o = (r ? n.undone : n.done).popEvent(e, i);
  if (!o)
    return;
  let l = o.selection.resolve(o.transform.doc), a = (r ? n.done : n.undone).addTransform(o.transform, e.selection.getBookmark(), s, i), c = new ct(r ? a : o.remaining, r ? o.remaining : a, null, 0);
  t(o.transform.setSelection(l).setMeta(bt, { redo: r, historyState: c }).scrollIntoView());
}
let Hi = !1, el = null;
function cr(n) {
  let e = n.plugins;
  if (el != e) {
    Hi = !1, el = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].spec.historyPreserveItems) {
        Hi = !0;
        break;
      }
  }
  return Hi;
}
const bt = new Oe("history"), wp = new Oe("closeHistory");
function Mp(n = {}) {
  return n = {
    depth: n.depth || 100,
    newGroupDelay: n.newGroupDelay || 500
  }, new ye({
    key: bt,
    state: {
      init() {
        return new ct($e.empty, $e.empty, null, 0);
      },
      apply(e, t, r) {
        return Sp(t, r, e, n);
      }
    },
    config: n,
    props: {
      handleDOMEvents: {
        beforeinput(e, t) {
          let r = t.inputType, i = r == "historyUndo" ? Ya : r == "historyRedo" ? Xa : null;
          return i ? (t.preventDefault(), i(e.state, e.dispatch)) : !1;
        }
      }
    }
  });
}
const Ya = (n, e) => {
  let t = bt.getState(n);
  return !t || t.done.eventCount == 0 ? !1 : (e && Ga(t, n, e, !1), !0);
}, Xa = (n, e) => {
  let t = bt.getState(n);
  return !t || t.undone.eventCount == 0 ? !1 : (e && Ga(t, n, e, !0), !0);
}, Tp = Le.create({
  name: "history",
  addOptions() {
    return {
      depth: 100,
      newGroupDelay: 500
    };
  },
  addCommands() {
    return {
      undo: () => ({ state: n, dispatch: e }) => Ya(n, e),
      redo: () => ({ state: n, dispatch: e }) => Xa(n, e)
    };
  },
  addProseMirrorPlugins() {
    return [
      Mp(this.options)
    ];
  },
  addKeyboardShortcuts() {
    return {
      "Mod-z": () => this.editor.commands.undo(),
      "Mod-y": () => this.editor.commands.redo(),
      "Shift-Mod-z": () => this.editor.commands.redo(),
      "Mod-\u044F": () => this.editor.commands.undo(),
      "Shift-Mod-\u044F": () => this.editor.commands.redo()
    };
  }
});
class oi extends HTMLElement {
  get richText() {
    return this.closest("rich-text");
  }
  connectedCallback() {
    this.richText.registerPlugin(this.plugin);
  }
  open() {
    const e = this.richText.querySelector(`#${this.dialogTemplateId}`);
    this.dialog = document.createElement("dialog", {
      is: this.dialogTemplateId
    }), this.dialog.open = !0, this.dialog.setAttribute("is", this.dialogTemplateId), this.dialog.appendChild(e.content.cloneNode(!0)), this.richText.appendChild(this.dialog);
  }
  close() {
    this.dialog.close(), this.dialog.remove();
  }
}
function Zn(n, e) {
  window.customElements.get(n) || window.customElements.define(n, e);
}
function Qa(n) {
  for (var e = arguments.length, t = new Array(e > 1 ? e - 1 : 0), r = 1; r < e; r++)
    t[r - 1] = arguments[r];
  return t.reduce(function(i, s) {
    return s(i);
  }, n);
}
function Za(n) {
  return class extends n {
    get richText() {
      return this.closest("rich-text");
    }
    connectedCallback() {
      this.plugin && this.richText.registerPlugin(this.plugin);
    }
    open(...t) {
      const r = this.richText.querySelector(`#${this.dialogTemplateId}`);
      this.dialog = document.createElement("dialog", {
        is: this.dialogTemplateId
      }), this.dialog.open = !0, this.dialog.setAttribute("is", this.dialogTemplateId), this.dialog.appendChild(r.content.cloneNode(!0)), this.richText.appendChild(this.dialog), this.dialog.setDialogStyles();
    }
    handle(...t) {
    }
  };
}
class ue extends Qa(HTMLButtonElement, Za) {
  constructor() {
    super(...arguments), this.onclick = () => {
      this.handle();
    };
  }
}
function re(n, e) {
  window.customElements.get(n) || window.customElements.define(n, e, { extends: "button" });
}
class Op extends oi {
  constructor() {
    super(...arguments), this.plugin = Tp;
  }
}
Zn("rich-text-plugin-history", Op);
class vp extends ue {
  handle() {
    this.richText.editor.chain().focus().undo().run();
  }
}
re("rich-text-plugin-handler-history-undo", vp);
class Np extends ue {
  handle() {
    this.richText.editor.chain().focus().redo().run();
  }
}
re("rich-text-plugin-handler-history-redo", Np);
const eu = xe.create({
  name: "heading",
  addOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: {}
    };
  },
  content: "inline*",
  group: "block",
  defining: !0,
  addAttributes() {
    return {
      level: {
        default: 1,
        rendered: !1
      }
    };
  },
  parseHTML() {
    return this.options.levels.map((n) => ({
      tag: `h${n}`,
      attrs: { level: n }
    }));
  },
  renderHTML({ node: n, HTMLAttributes: e }) {
    return [`h${this.options.levels.includes(n.attrs.level) ? n.attrs.level : this.options.levels[0]}`, ee(this.options.HTMLAttributes, e), 0];
  },
  addCommands() {
    return {
      setHeading: (n) => ({ commands: e }) => this.options.levels.includes(n.level) ? e.setNode(this.name, n) : !1,
      toggleHeading: (n) => ({ commands: e }) => this.options.levels.includes(n.level) ? e.toggleNode(this.name, "paragraph", n) : !1
    };
  },
  addKeyboardShortcuts() {
    return this.options.levels.reduce((n, e) => ({
      ...n,
      [`Mod-Alt-${e}`]: () => this.editor.commands.toggleHeading({ level: e })
    }), {});
  },
  addInputRules() {
    return this.options.levels.map((n) => us({
      find: new RegExp(`^(#{1,${n}})\\s$`),
      type: this.type,
      getAttributes: {
        level: n
      }
    }));
  }
});
class Fp extends Qa(HTMLSelectElement, Za) {
  constructor() {
    super(...arguments), this.onchange = (e) => {
      this.handle(e.target.value);
    };
  }
}
function Rp(n, e) {
  window.customElements.get(n) || window.customElements.define(n, e, { extends: "select" });
}
eu.config.addInputRules = () => [];
class Bp extends Fp {
  constructor() {
    super(...arguments), this.plugin = eu;
  }
  handle(e) {
    this.richText.editor.chain().focus().toggleHeading({ level: parseInt(e) }).run();
  }
}
Rp("rich-text-plugin-handler-heading", Bp);
const Ip = xe.create({
  name: "paragraph",
  priority: 1e3,
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  group: "block",
  content: "inline*",
  parseHTML() {
    return [
      { tag: "p" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["p", ee(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setParagraph: () => ({ commands: n }) => n.setNode(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Alt-0": () => this.editor.commands.setParagraph()
    };
  }
});
class Pp extends ue {
  constructor() {
    super(...arguments), this.plugin = Ip;
  }
  handle() {
    this.richText.editor.chain().focus().setParagraph().run();
  }
}
re("rich-text-plugin-handler-paragraph", Pp);
const Lp = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))$/, _p = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/g, zp = /(?:^|\s)((?:__)((?:[^__]+))(?:__))$/, Hp = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/g, $p = Be.create({
  name: "bold",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "strong"
      },
      {
        tag: "b",
        getAttrs: (n) => n.style.fontWeight !== "normal" && null
      },
      {
        style: "font-weight",
        getAttrs: (n) => /^(bold(er)?|[5-9]\d{2,})$/.test(n) && null
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["strong", ee(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setBold: () => ({ commands: n }) => n.setMark(this.name),
      toggleBold: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetBold: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-b": () => this.editor.commands.toggleBold(),
      "Mod-B": () => this.editor.commands.toggleBold()
    };
  },
  addInputRules() {
    return [
      Kt({
        find: Lp,
        type: this.type
      }),
      Kt({
        find: zp,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      kt({
        find: _p,
        type: this.type
      }),
      kt({
        find: Hp,
        type: this.type
      })
    ];
  }
});
class jp extends ue {
  constructor() {
    super(...arguments), this.plugin = $p;
  }
  handle() {
    this.richText.editor.chain().focus().toggleBold().run();
  }
}
re("rich-text-plugin-handler-bold", jp);
const Vp = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))$/, Up = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))/g, Kp = /(?:^|\s)((?:_)((?:[^_]+))(?:_))$/, Wp = /(?:^|\s)((?:_)((?:[^_]+))(?:_))/g, qp = Be.create({
  name: "italic",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "em"
      },
      {
        tag: "i",
        getAttrs: (n) => n.style.fontStyle !== "normal" && null
      },
      {
        style: "font-style=italic"
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["em", ee(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setItalic: () => ({ commands: n }) => n.setMark(this.name),
      toggleItalic: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetItalic: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-i": () => this.editor.commands.toggleItalic(),
      "Mod-I": () => this.editor.commands.toggleItalic()
    };
  },
  addInputRules() {
    return [
      Kt({
        find: Vp,
        type: this.type
      }),
      Kt({
        find: Kp,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      kt({
        find: Up,
        type: this.type
      }),
      kt({
        find: Wp,
        type: this.type
      })
    ];
  }
});
class Jp extends ue {
  constructor() {
    super(...arguments), this.plugin = qp;
  }
  handle() {
    this.richText.editor.chain().focus().toggleItalic().run();
  }
}
re("rich-text-plugin-handler-italic", Jp);
const Gp = Be.create({
  name: "underline",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "u"
      },
      {
        style: "text-decoration",
        consuming: !1,
        getAttrs: (n) => n.includes("underline") ? {} : !1
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["u", ee(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setUnderline: () => ({ commands: n }) => n.setMark(this.name),
      toggleUnderline: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetUnderline: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-u": () => this.editor.commands.toggleUnderline(),
      "Mod-U": () => this.editor.commands.toggleUnderline()
    };
  }
});
class Yp extends ue {
  constructor() {
    super(...arguments), this.plugin = Gp;
  }
  handle() {
    this.richText.editor.chain().focus().toggleUnderline().run();
  }
}
re("rich-text-plugin-handler-underline", Yp);
const Xp = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))$/, Qp = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))/g, Zp = Be.create({
  name: "strike",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "s"
      },
      {
        tag: "del"
      },
      {
        tag: "strike"
      },
      {
        style: "text-decoration",
        consuming: !1,
        getAttrs: (n) => n.includes("line-through") ? {} : !1
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["s", ee(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setStrike: () => ({ commands: n }) => n.setMark(this.name),
      toggleStrike: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetStrike: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-x": () => this.editor.commands.toggleStrike()
    };
  },
  addInputRules() {
    return [
      Kt({
        find: Xp,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      kt({
        find: Qp,
        type: this.type
      })
    ];
  }
});
class eg extends ue {
  constructor() {
    super(...arguments), this.plugin = Zp;
  }
  handle() {
    this.richText.editor.chain().focus().toggleStrike().run();
  }
}
re("rich-text-plugin-handler-strike", eg);
const tg = /(?:^|\s)((?:`)((?:[^`]+))(?:`))$/, ng = /(?:^|\s)((?:`)((?:[^`]+))(?:`))/g, rg = Be.create({
  name: "code",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  excludes: "_",
  code: !0,
  exitable: !0,
  parseHTML() {
    return [
      { tag: "code" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["code", ee(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setCode: () => ({ commands: n }) => n.setMark(this.name),
      toggleCode: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetCode: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-e": () => this.editor.commands.toggleCode()
    };
  },
  addInputRules() {
    return [
      Kt({
        find: tg,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      kt({
        find: ng,
        type: this.type
      })
    ];
  }
});
class ig extends ue {
  constructor() {
    super(...arguments), this.plugin = rg;
  }
  handle() {
    this.richText.editor.chain().focus().toggleCode().run();
  }
}
re("rich-text-plugin-handler-code", ig);
const sg = Be.create({
  name: "superscript",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "sup"
      },
      {
        style: "vertical-align",
        getAttrs(n) {
          return n !== "super" ? !1 : null;
        }
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["sup", ee(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setSuperscript: () => ({ commands: n }) => n.setMark(this.name),
      toggleSuperscript: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetSuperscript: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-.": () => this.editor.commands.toggleSuperscript()
    };
  }
});
class og extends ue {
  constructor() {
    super(...arguments), this.plugin = sg;
  }
  handle() {
    this.richText.editor.chain().focus().toggleSuperscript().run();
  }
}
re("rich-text-plugin-handler-superscript", og);
const lg = Be.create({
  name: "subscript",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "sub"
      },
      {
        style: "vertical-align",
        getAttrs(n) {
          return n !== "sub" ? !1 : null;
        }
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["sub", ee(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setSubscript: () => ({ commands: n }) => n.setMark(this.name),
      toggleSubscript: () => ({ commands: n }) => n.toggleMark(this.name),
      unsetSubscript: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-,": () => this.editor.commands.toggleSubscript()
    };
  }
});
class ag extends ue {
  constructor() {
    super(...arguments), this.plugin = lg;
  }
  handle() {
    this.richText.editor.chain().focus().toggleSubscript().run();
  }
}
re("rich-text-plugin-handler-subscript", ag);
const ug = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))$/, cg = /(?:^|\s)((?:==)((?:[^~=]+))(?:==))/g, dg = Be.create({
  name: "highlight",
  addOptions() {
    return {
      multicolor: !1,
      HTMLAttributes: {}
    };
  },
  addAttributes() {
    return this.options.multicolor ? {
      color: {
        default: null,
        parseHTML: (n) => n.getAttribute("data-color") || n.style.backgroundColor,
        renderHTML: (n) => n.color ? {
          "data-color": n.color,
          style: `background-color: ${n.color}`
        } : {}
      }
    } : {};
  },
  parseHTML() {
    return [
      {
        tag: "mark"
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["mark", ee(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      setHighlight: (n) => ({ commands: e }) => e.setMark(this.name, n),
      toggleHighlight: (n) => ({ commands: e }) => e.toggleMark(this.name, n),
      unsetHighlight: () => ({ commands: n }) => n.unsetMark(this.name)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-h": () => this.editor.commands.toggleHighlight()
    };
  },
  addInputRules() {
    return [
      Kt({
        find: ug,
        type: this.type
      })
    ];
  },
  addPasteRules() {
    return [
      kt({
        find: cg,
        type: this.type
      })
    ];
  }
});
class hg extends ue {
  constructor() {
    super(...arguments), this.plugin = dg;
  }
  handle() {
    this.richText.editor.chain().focus().toggleHighlight().run();
  }
}
re("rich-text-plugin-handler-highlight", hg);
const fg = /^\s*([-+*])\s$/, pg = xe.create({
  name: "bulletList",
  addOptions() {
    return {
      itemTypeName: "listItem",
      HTMLAttributes: {}
    };
  },
  group: "block list",
  content() {
    return `${this.options.itemTypeName}+`;
  },
  parseHTML() {
    return [
      { tag: "ul" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["ul", ee(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      toggleBulletList: () => ({ commands: n }) => n.toggleList(this.name, this.options.itemTypeName)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-8": () => this.editor.commands.toggleBulletList()
    };
  },
  addInputRules() {
    return [
      Ka({
        find: fg,
        type: this.type
      })
    ];
  }
}), tu = xe.create({
  name: "listItem",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "paragraph block*",
  defining: !0,
  parseHTML() {
    return [
      {
        tag: "li"
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["li", ee(this.options.HTMLAttributes, n), 0];
  },
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.splitListItem(this.name),
      Tab: () => this.editor.commands.sinkListItem(this.name),
      "Shift-Tab": () => this.editor.commands.liftListItem(this.name)
    };
  }
});
class gg extends ue {
  constructor() {
    super(...arguments), this.plugin = pg;
  }
  connectedCallback() {
    super.connectedCallback(), this.richText.registerPlugin(tu);
  }
  handle() {
    this.richText.editor.chain().focus().toggleBulletList().run();
  }
}
re("rich-text-plugin-handler-unordered-list", gg);
const mg = /^(\d+)\.\s$/, yg = xe.create({
  name: "orderedList",
  addOptions() {
    return {
      itemTypeName: "listItem",
      HTMLAttributes: {}
    };
  },
  group: "block list",
  content() {
    return `${this.options.itemTypeName}+`;
  },
  addAttributes() {
    return {
      start: {
        default: 1,
        parseHTML: (n) => n.hasAttribute("start") ? parseInt(n.getAttribute("start") || "", 10) : 1
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "ol"
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    const { start: e, ...t } = n;
    return e === 1 ? ["ol", ee(this.options.HTMLAttributes, t), 0] : ["ol", ee(this.options.HTMLAttributes, n), 0];
  },
  addCommands() {
    return {
      toggleOrderedList: () => ({ commands: n }) => n.toggleList(this.name, this.options.itemTypeName)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Shift-7": () => this.editor.commands.toggleOrderedList()
    };
  },
  addInputRules() {
    return [
      Ka({
        find: mg,
        type: this.type,
        getAttributes: (n) => ({ start: +n[1] }),
        joinPredicate: (n, e) => e.childCount + e.attrs.start === +n[1]
      })
    ];
  }
});
class bg extends ue {
  constructor() {
    super(...arguments), this.plugin = yg;
  }
  connectedCallback() {
    super.connectedCallback(), this.richText.registerPlugin(tu);
  }
  handle() {
    this.richText.editor.chain().focus().toggleOrderedList().run();
  }
}
re("rich-text-plugin-handler-ordered-list", bg);
const Dg = /^```([a-z]+)?[\s\n]$/, Eg = /^~~~([a-z]+)?[\s\n]$/, xg = xe.create({
  name: "codeBlock",
  addOptions() {
    return {
      languageClassPrefix: "language-",
      exitOnTripleEnter: !0,
      exitOnArrowDown: !0,
      HTMLAttributes: {}
    };
  },
  content: "text*",
  marks: "",
  group: "block",
  code: !0,
  defining: !0,
  addAttributes() {
    return {
      language: {
        default: null,
        parseHTML: (n) => {
          var e;
          const { languageClassPrefix: t } = this.options, s = [...((e = n.firstElementChild) === null || e === void 0 ? void 0 : e.classList) || []].filter((o) => o.startsWith(t)).map((o) => o.replace(t, ""))[0];
          return s || null;
        },
        rendered: !1
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "pre",
        preserveWhitespace: "full"
      }
    ];
  },
  renderHTML({ node: n, HTMLAttributes: e }) {
    return [
      "pre",
      ee(this.options.HTMLAttributes, e),
      [
        "code",
        {
          class: n.attrs.language ? this.options.languageClassPrefix + n.attrs.language : null
        },
        0
      ]
    ];
  },
  addCommands() {
    return {
      setCodeBlock: (n) => ({ commands: e }) => e.setNode(this.name, n),
      toggleCodeBlock: (n) => ({ commands: e }) => e.toggleNode(this.name, "paragraph", n)
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Alt-c": () => this.editor.commands.toggleCodeBlock(),
      Backspace: () => {
        const { empty: n, $anchor: e } = this.editor.state.selection, t = e.pos === 1;
        return !n || e.parent.type.name !== this.name ? !1 : t || !e.parent.textContent.length ? this.editor.commands.clearNodes() : !1;
      },
      Enter: ({ editor: n }) => {
        if (!this.options.exitOnTripleEnter)
          return !1;
        const { state: e } = n, { selection: t } = e, { $from: r, empty: i } = t;
        if (!i || r.parent.type !== this.type)
          return !1;
        const s = r.parentOffset === r.parent.nodeSize - 2, o = r.parent.textContent.endsWith(`

`);
        return !s || !o ? !1 : n.chain().command(({ tr: l }) => (l.delete(r.pos - 2, r.pos), !0)).exitCode().run();
      },
      ArrowDown: ({ editor: n }) => {
        if (!this.options.exitOnArrowDown)
          return !1;
        const { state: e } = n, { selection: t, doc: r } = e, { $from: i, empty: s } = t;
        if (!s || i.parent.type !== this.type || !(i.parentOffset === i.parent.nodeSize - 2))
          return !1;
        const l = i.after();
        return l === void 0 || r.nodeAt(l) ? !1 : n.commands.exitCode();
      }
    };
  },
  addInputRules() {
    return [
      us({
        find: Dg,
        type: this.type,
        getAttributes: (n) => ({
          language: n[1]
        })
      }),
      us({
        find: Eg,
        type: this.type,
        getAttributes: (n) => ({
          language: n[1]
        })
      })
    ];
  },
  addProseMirrorPlugins() {
    return [
      new ye({
        key: new Oe("codeBlockVSCodeHandler"),
        props: {
          handlePaste: (n, e) => {
            if (!e.clipboardData || this.editor.isActive(this.type.name))
              return !1;
            const t = e.clipboardData.getData("text/plain"), r = e.clipboardData.getData("vscode-editor-data"), i = r ? JSON.parse(r) : void 0, s = i == null ? void 0 : i.mode;
            if (!t || !s)
              return !1;
            const { tr: o } = n.state;
            return o.replaceSelectionWith(this.type.create({ language: s })), o.setSelection($.near(o.doc.resolve(Math.max(0, o.selection.from - 2)))), o.insertText(t.replace(/\r\n?/g, `
`)), o.setMeta("paste", !0), n.dispatch(o), !0;
          }
        }
      })
    ];
  }
});
var Ns = { exports: {} };
function Fs(n) {
  return n instanceof Map ? n.clear = n.delete = n.set = function() {
    throw new Error("map is read-only");
  } : n instanceof Set && (n.add = n.clear = n.delete = function() {
    throw new Error("set is read-only");
  }), Object.freeze(n), Object.getOwnPropertyNames(n).forEach(function(e) {
    var t = n[e];
    typeof t == "object" && !Object.isFrozen(t) && Fs(t);
  }), n;
}
Ns.exports = Fs;
Ns.exports.default = Fs;
class tl {
  constructor(e) {
    e.data === void 0 && (e.data = {}), this.data = e.data, this.isMatchIgnored = !1;
  }
  ignoreMatch() {
    this.isMatchIgnored = !0;
  }
}
function nu(n) {
  return n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}
function pt(n, ...e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const r in n)
    t[r] = n[r];
  return e.forEach(function(r) {
    for (const i in r)
      t[i] = r[i];
  }), t;
}
const kg = "</span>", nl = (n) => !!n.scope || n.sublanguage && n.language, Cg = (n, { prefix: e }) => {
  if (n.includes(".")) {
    const t = n.split(".");
    return [
      `${e}${t.shift()}`,
      ...t.map((r, i) => `${r}${"_".repeat(i + 1)}`)
    ].join(" ");
  }
  return `${e}${n}`;
};
class Sg {
  constructor(e, t) {
    this.buffer = "", this.classPrefix = t.classPrefix, e.walk(this);
  }
  addText(e) {
    this.buffer += nu(e);
  }
  openNode(e) {
    if (!nl(e))
      return;
    let t = "";
    e.sublanguage ? t = `language-${e.language}` : t = Cg(e.scope, { prefix: this.classPrefix }), this.span(t);
  }
  closeNode(e) {
    !nl(e) || (this.buffer += kg);
  }
  value() {
    return this.buffer;
  }
  span(e) {
    this.buffer += `<span class="${e}">`;
  }
}
const rl = (n = {}) => {
  const e = { children: [] };
  return Object.assign(e, n), e;
};
class Rs {
  constructor() {
    this.rootNode = rl(), this.stack = [this.rootNode];
  }
  get top() {
    return this.stack[this.stack.length - 1];
  }
  get root() {
    return this.rootNode;
  }
  add(e) {
    this.top.children.push(e);
  }
  openNode(e) {
    const t = rl({ scope: e });
    this.add(t), this.stack.push(t);
  }
  closeNode() {
    if (this.stack.length > 1)
      return this.stack.pop();
  }
  closeAllNodes() {
    for (; this.closeNode(); )
      ;
  }
  toJSON() {
    return JSON.stringify(this.rootNode, null, 4);
  }
  walk(e) {
    return this.constructor._walk(e, this.rootNode);
  }
  static _walk(e, t) {
    return typeof t == "string" ? e.addText(t) : t.children && (e.openNode(t), t.children.forEach((r) => this._walk(e, r)), e.closeNode(t)), e;
  }
  static _collapse(e) {
    typeof e != "string" && (!e.children || (e.children.every((t) => typeof t == "string") ? e.children = [e.children.join("")] : e.children.forEach((t) => {
      Rs._collapse(t);
    })));
  }
}
class Ag extends Rs {
  constructor(e) {
    super(), this.options = e;
  }
  addKeyword(e, t) {
    e !== "" && (this.openNode(t), this.addText(e), this.closeNode());
  }
  addText(e) {
    e !== "" && this.add(e);
  }
  addSublanguage(e, t) {
    const r = e.root;
    r.sublanguage = !0, r.language = t, this.add(r);
  }
  toHTML() {
    return new Sg(this, this.options).value();
  }
  finalize() {
    return !0;
  }
}
function Kn(n) {
  return n ? typeof n == "string" ? n : n.source : null;
}
function ru(n) {
  return Wt("(?=", n, ")");
}
function wg(n) {
  return Wt("(?:", n, ")*");
}
function Mg(n) {
  return Wt("(?:", n, ")?");
}
function Wt(...n) {
  return n.map((t) => Kn(t)).join("");
}
function Tg(n) {
  const e = n[n.length - 1];
  return typeof e == "object" && e.constructor === Object ? (n.splice(n.length - 1, 1), e) : {};
}
function Bs(...n) {
  const e = Tg(n);
  return "(" + (e.capture ? "" : "?:") + n.map((r) => Kn(r)).join("|") + ")";
}
function iu(n) {
  return new RegExp(n.toString() + "|").exec("").length - 1;
}
function Og(n, e) {
  const t = n && n.exec(e);
  return t && t.index === 0;
}
const vg = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
function Is(n, { joinWith: e }) {
  let t = 0;
  return n.map((r) => {
    t += 1;
    const i = t;
    let s = Kn(r), o = "";
    for (; s.length > 0; ) {
      const l = vg.exec(s);
      if (!l) {
        o += s;
        break;
      }
      o += s.substring(0, l.index), s = s.substring(l.index + l[0].length), l[0][0] === "\\" && l[1] ? o += "\\" + String(Number(l[1]) + i) : (o += l[0], l[0] === "(" && t++);
    }
    return o;
  }).map((r) => `(${r})`).join(e);
}
const Ng = /\b\B/, su = "[a-zA-Z]\\w*", Ps = "[a-zA-Z_]\\w*", ou = "\\b\\d+(\\.\\d+)?", lu = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", au = "\\b(0b[01]+)", Fg = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", Rg = (n = {}) => {
  const e = /^#![ ]*\//;
  return n.binary && (n.begin = Wt(
    e,
    /.*\b/,
    n.binary,
    /\b.*/
  )), pt({
    scope: "meta",
    begin: e,
    end: /$/,
    relevance: 0,
    "on:begin": (t, r) => {
      t.index !== 0 && r.ignoreMatch();
    }
  }, n);
}, Wn = {
  begin: "\\\\[\\s\\S]",
  relevance: 0
}, Bg = {
  scope: "string",
  begin: "'",
  end: "'",
  illegal: "\\n",
  contains: [Wn]
}, Ig = {
  scope: "string",
  begin: '"',
  end: '"',
  illegal: "\\n",
  contains: [Wn]
}, Pg = {
  begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
}, li = function(n, e, t = {}) {
  const r = pt(
    {
      scope: "comment",
      begin: n,
      end: e,
      contains: []
    },
    t
  );
  r.contains.push({
    scope: "doctag",
    begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
    end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
    excludeBegin: !0,
    relevance: 0
  });
  const i = Bs(
    "I",
    "a",
    "is",
    "so",
    "us",
    "to",
    "at",
    "if",
    "in",
    "it",
    "on",
    /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
    /[A-Za-z]+[-][a-z]+/,
    /[A-Za-z][a-z]{2,}/
  );
  return r.contains.push(
    {
      begin: Wt(
        /[ ]+/,
        "(",
        i,
        /[.]?[:]?([.][ ]|[ ])/,
        "){3}"
      )
    }
  ), r;
}, Lg = li("//", "$"), _g = li("/\\*", "\\*/"), zg = li("#", "$"), Hg = {
  scope: "number",
  begin: ou,
  relevance: 0
}, $g = {
  scope: "number",
  begin: lu,
  relevance: 0
}, jg = {
  scope: "number",
  begin: au,
  relevance: 0
}, Vg = {
  begin: /(?=\/[^/\n]*\/)/,
  contains: [{
    scope: "regexp",
    begin: /\//,
    end: /\/[gimuy]*/,
    illegal: /\n/,
    contains: [
      Wn,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [Wn]
      }
    ]
  }]
}, Ug = {
  scope: "title",
  begin: su,
  relevance: 0
}, Kg = {
  scope: "title",
  begin: Ps,
  relevance: 0
}, Wg = {
  begin: "\\.\\s*" + Ps,
  relevance: 0
}, qg = function(n) {
  return Object.assign(
    n,
    {
      "on:begin": (e, t) => {
        t.data._beginMatch = e[1];
      },
      "on:end": (e, t) => {
        t.data._beginMatch !== e[1] && t.ignoreMatch();
      }
    }
  );
};
var or = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  MATCH_NOTHING_RE: Ng,
  IDENT_RE: su,
  UNDERSCORE_IDENT_RE: Ps,
  NUMBER_RE: ou,
  C_NUMBER_RE: lu,
  BINARY_NUMBER_RE: au,
  RE_STARTERS_RE: Fg,
  SHEBANG: Rg,
  BACKSLASH_ESCAPE: Wn,
  APOS_STRING_MODE: Bg,
  QUOTE_STRING_MODE: Ig,
  PHRASAL_WORDS_MODE: Pg,
  COMMENT: li,
  C_LINE_COMMENT_MODE: Lg,
  C_BLOCK_COMMENT_MODE: _g,
  HASH_COMMENT_MODE: zg,
  NUMBER_MODE: Hg,
  C_NUMBER_MODE: $g,
  BINARY_NUMBER_MODE: jg,
  REGEXP_MODE: Vg,
  TITLE_MODE: Ug,
  UNDERSCORE_TITLE_MODE: Kg,
  METHOD_GUARD: Wg,
  END_SAME_AS_BEGIN: qg
});
function Jg(n, e) {
  n.input[n.index - 1] === "." && e.ignoreMatch();
}
function Gg(n, e) {
  n.className !== void 0 && (n.scope = n.className, delete n.className);
}
function Yg(n, e) {
  !e || !n.beginKeywords || (n.begin = "\\b(" + n.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", n.__beforeBegin = Jg, n.keywords = n.keywords || n.beginKeywords, delete n.beginKeywords, n.relevance === void 0 && (n.relevance = 0));
}
function Xg(n, e) {
  !Array.isArray(n.illegal) || (n.illegal = Bs(...n.illegal));
}
function Qg(n, e) {
  if (!!n.match) {
    if (n.begin || n.end)
      throw new Error("begin & end are not supported with match");
    n.begin = n.match, delete n.match;
  }
}
function Zg(n, e) {
  n.relevance === void 0 && (n.relevance = 1);
}
const em = (n, e) => {
  if (!n.beforeMatch)
    return;
  if (n.starts)
    throw new Error("beforeMatch cannot be used with starts");
  const t = Object.assign({}, n);
  Object.keys(n).forEach((r) => {
    delete n[r];
  }), n.keywords = t.keywords, n.begin = Wt(t.beforeMatch, ru(t.begin)), n.starts = {
    relevance: 0,
    contains: [
      Object.assign(t, { endsParent: !0 })
    ]
  }, n.relevance = 0, delete t.beforeMatch;
}, tm = [
  "of",
  "and",
  "for",
  "in",
  "not",
  "or",
  "if",
  "then",
  "parent",
  "list",
  "value"
], nm = "keyword";
function uu(n, e, t = nm) {
  const r = /* @__PURE__ */ Object.create(null);
  return typeof n == "string" ? i(t, n.split(" ")) : Array.isArray(n) ? i(t, n) : Object.keys(n).forEach(function(s) {
    Object.assign(
      r,
      uu(n[s], e, s)
    );
  }), r;
  function i(s, o) {
    e && (o = o.map((l) => l.toLowerCase())), o.forEach(function(l) {
      const a = l.split("|");
      r[a[0]] = [s, rm(a[0], a[1])];
    });
  }
}
function rm(n, e) {
  return e ? Number(e) : im(n) ? 0 : 1;
}
function im(n) {
  return tm.includes(n.toLowerCase());
}
const il = {}, Ht = (n) => {
  console.error(n);
}, sl = (n, ...e) => {
  console.log(`WARN: ${n}`, ...e);
}, Yt = (n, e) => {
  il[`${n}/${e}`] || (console.log(`Deprecated as of ${n}. ${e}`), il[`${n}/${e}`] = !0);
}, Tr = new Error();
function cu(n, e, { key: t }) {
  let r = 0;
  const i = n[t], s = {}, o = {};
  for (let l = 1; l <= e.length; l++)
    o[l + r] = i[l], s[l + r] = !0, r += iu(e[l - 1]);
  n[t] = o, n[t]._emit = s, n[t]._multi = !0;
}
function sm(n) {
  if (!!Array.isArray(n.begin)) {
    if (n.skip || n.excludeBegin || n.returnBegin)
      throw Ht("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Tr;
    if (typeof n.beginScope != "object" || n.beginScope === null)
      throw Ht("beginScope must be object"), Tr;
    cu(n, n.begin, { key: "beginScope" }), n.begin = Is(n.begin, { joinWith: "" });
  }
}
function om(n) {
  if (!!Array.isArray(n.end)) {
    if (n.skip || n.excludeEnd || n.returnEnd)
      throw Ht("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Tr;
    if (typeof n.endScope != "object" || n.endScope === null)
      throw Ht("endScope must be object"), Tr;
    cu(n, n.end, { key: "endScope" }), n.end = Is(n.end, { joinWith: "" });
  }
}
function lm(n) {
  n.scope && typeof n.scope == "object" && n.scope !== null && (n.beginScope = n.scope, delete n.scope);
}
function am(n) {
  lm(n), typeof n.beginScope == "string" && (n.beginScope = { _wrap: n.beginScope }), typeof n.endScope == "string" && (n.endScope = { _wrap: n.endScope }), sm(n), om(n);
}
function um(n) {
  function e(o, l) {
    return new RegExp(
      Kn(o),
      "m" + (n.case_insensitive ? "i" : "") + (n.unicodeRegex ? "u" : "") + (l ? "g" : "")
    );
  }
  class t {
    constructor() {
      this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
    }
    addRule(l, a) {
      a.position = this.position++, this.matchIndexes[this.matchAt] = a, this.regexes.push([a, l]), this.matchAt += iu(l) + 1;
    }
    compile() {
      this.regexes.length === 0 && (this.exec = () => null);
      const l = this.regexes.map((a) => a[1]);
      this.matcherRe = e(Is(l, { joinWith: "|" }), !0), this.lastIndex = 0;
    }
    exec(l) {
      this.matcherRe.lastIndex = this.lastIndex;
      const a = this.matcherRe.exec(l);
      if (!a)
        return null;
      const c = a.findIndex((d, h) => h > 0 && d !== void 0), u = this.matchIndexes[c];
      return a.splice(0, c), Object.assign(a, u);
    }
  }
  class r {
    constructor() {
      this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
    }
    getMatcher(l) {
      if (this.multiRegexes[l])
        return this.multiRegexes[l];
      const a = new t();
      return this.rules.slice(l).forEach(([c, u]) => a.addRule(c, u)), a.compile(), this.multiRegexes[l] = a, a;
    }
    resumingScanAtSamePosition() {
      return this.regexIndex !== 0;
    }
    considerAll() {
      this.regexIndex = 0;
    }
    addRule(l, a) {
      this.rules.push([l, a]), a.type === "begin" && this.count++;
    }
    exec(l) {
      const a = this.getMatcher(this.regexIndex);
      a.lastIndex = this.lastIndex;
      let c = a.exec(l);
      if (this.resumingScanAtSamePosition() && !(c && c.index === this.lastIndex)) {
        const u = this.getMatcher(0);
        u.lastIndex = this.lastIndex + 1, c = u.exec(l);
      }
      return c && (this.regexIndex += c.position + 1, this.regexIndex === this.count && this.considerAll()), c;
    }
  }
  function i(o) {
    const l = new r();
    return o.contains.forEach((a) => l.addRule(a.begin, { rule: a, type: "begin" })), o.terminatorEnd && l.addRule(o.terminatorEnd, { type: "end" }), o.illegal && l.addRule(o.illegal, { type: "illegal" }), l;
  }
  function s(o, l) {
    const a = o;
    if (o.isCompiled)
      return a;
    [
      Gg,
      Qg,
      am,
      em
    ].forEach((u) => u(o, l)), n.compilerExtensions.forEach((u) => u(o, l)), o.__beforeBegin = null, [
      Yg,
      Xg,
      Zg
    ].forEach((u) => u(o, l)), o.isCompiled = !0;
    let c = null;
    return typeof o.keywords == "object" && o.keywords.$pattern && (o.keywords = Object.assign({}, o.keywords), c = o.keywords.$pattern, delete o.keywords.$pattern), c = c || /\w+/, o.keywords && (o.keywords = uu(o.keywords, n.case_insensitive)), a.keywordPatternRe = e(c, !0), l && (o.begin || (o.begin = /\B|\b/), a.beginRe = e(a.begin), !o.end && !o.endsWithParent && (o.end = /\B|\b/), o.end && (a.endRe = e(a.end)), a.terminatorEnd = Kn(a.end) || "", o.endsWithParent && l.terminatorEnd && (a.terminatorEnd += (o.end ? "|" : "") + l.terminatorEnd)), o.illegal && (a.illegalRe = e(o.illegal)), o.contains || (o.contains = []), o.contains = [].concat(...o.contains.map(function(u) {
      return cm(u === "self" ? o : u);
    })), o.contains.forEach(function(u) {
      s(u, a);
    }), o.starts && s(o.starts, l), a.matcher = i(a), a;
  }
  if (n.compilerExtensions || (n.compilerExtensions = []), n.contains && n.contains.includes("self"))
    throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
  return n.classNameAliases = pt(n.classNameAliases || {}), s(n);
}
function du(n) {
  return n ? n.endsWithParent || du(n.starts) : !1;
}
function cm(n) {
  return n.variants && !n.cachedVariants && (n.cachedVariants = n.variants.map(function(e) {
    return pt(n, { variants: null }, e);
  })), n.cachedVariants ? n.cachedVariants : du(n) ? pt(n, { starts: n.starts ? pt(n.starts) : null }) : Object.isFrozen(n) ? pt(n) : n;
}
var dm = "11.6.0";
class hm extends Error {
  constructor(e, t) {
    super(e), this.name = "HTMLInjectionError", this.html = t;
  }
}
const $i = nu, ol = pt, ll = Symbol("nomatch"), fm = 7, pm = function(n) {
  const e = /* @__PURE__ */ Object.create(null), t = /* @__PURE__ */ Object.create(null), r = [];
  let i = !0;
  const s = "Could not find the language '{}', did you forget to load/include a language module?", o = { disableAutodetect: !0, name: "Plain text", contains: [] };
  let l = {
    ignoreUnescapedHTML: !1,
    throwUnescapedHTML: !1,
    noHighlightRe: /^(no-?highlight)$/i,
    languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
    classPrefix: "hljs-",
    cssSelector: "pre code",
    languages: null,
    __emitter: Ag
  };
  function a(m) {
    return l.noHighlightRe.test(m);
  }
  function c(m) {
    let x = m.className + " ";
    x += m.parentNode ? m.parentNode.className : "";
    const w = l.languageDetectRe.exec(x);
    if (w) {
      const M = L(w[1]);
      return M || (sl(s.replace("{}", w[1])), sl("Falling back to no-highlight mode for this block.", m)), M ? w[1] : "no-highlight";
    }
    return x.split(/\s+/).find((M) => a(M) || L(M));
  }
  function u(m, x, w) {
    let M = "", F = "";
    typeof x == "object" ? (M = m, w = x.ignoreIllegals, F = x.language) : (Yt("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Yt("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), F = m, M = x), w === void 0 && (w = !0);
    const W = {
      code: M,
      language: F
    };
    ne("before:highlight", W);
    const de = W.result ? W.result : d(W.language, W.code, w);
    return de.code = W.code, ne("after:highlight", de), de;
  }
  function d(m, x, w, M) {
    const F = /* @__PURE__ */ Object.create(null);
    function W(b, E) {
      return b.keywords[E];
    }
    function de() {
      if (!C.keywords) {
        U.addText(B);
        return;
      }
      let b = 0;
      C.keywordPatternRe.lastIndex = 0;
      let E = C.keywordPatternRe.exec(B), A = "";
      for (; E; ) {
        A += B.substring(b, E.index);
        const N = fe.case_insensitive ? E[0].toLowerCase() : E[0], q = W(C, N);
        if (q) {
          const [ie, mi] = q;
          if (U.addText(A), A = "", F[N] = (F[N] || 0) + 1, F[N] <= fm && (nt += mi), ie.startsWith("_"))
            A += E[0];
          else {
            const yi = fe.classNameAliases[ie] || ie;
            U.addKeyword(E[0], yi);
          }
        } else
          A += E[0];
        b = C.keywordPatternRe.lastIndex, E = C.keywordPatternRe.exec(B);
      }
      A += B.substring(b), U.addText(A);
    }
    function et() {
      if (B === "")
        return;
      let b = null;
      if (typeof C.subLanguage == "string") {
        if (!e[C.subLanguage]) {
          U.addText(B);
          return;
        }
        b = d(C.subLanguage, B, !0, Cn[C.subLanguage]), Cn[C.subLanguage] = b._top;
      } else
        b = f(B, C.subLanguage.length ? C.subLanguage : null);
      C.relevance > 0 && (nt += b.relevance), U.addSublanguage(b._emitter, b.language);
    }
    function X() {
      C.subLanguage != null ? et() : de(), B = "";
    }
    function he(b, E) {
      let A = 1;
      const N = E.length - 1;
      for (; A <= N; ) {
        if (!b._emit[A]) {
          A++;
          continue;
        }
        const q = fe.classNameAliases[b[A]] || b[A], ie = E[A];
        q ? U.addKeyword(ie, q) : (B = ie, de(), B = ""), A++;
      }
    }
    function En(b, E) {
      return b.scope && typeof b.scope == "string" && U.openNode(fe.classNameAliases[b.scope] || b.scope), b.beginScope && (b.beginScope._wrap ? (U.addKeyword(B, fe.classNameAliases[b.beginScope._wrap] || b.beginScope._wrap), B = "") : b.beginScope._multi && (he(b.beginScope, E), B = "")), C = Object.create(b, { parent: { value: C } }), C;
    }
    function xn(b, E, A) {
      let N = Og(b.endRe, A);
      if (N) {
        if (b["on:end"]) {
          const q = new tl(b);
          b["on:end"](E, q), q.isMatchIgnored && (N = !1);
        }
        if (N) {
          for (; b.endsParent && b.parent; )
            b = b.parent;
          return b;
        }
      }
      if (b.endsWithParent)
        return xn(b.parent, E, A);
    }
    function di(b) {
      return C.matcher.regexIndex === 0 ? (B += b[0], 1) : (Tt = !0, 0);
    }
    function hi(b) {
      const E = b[0], A = b.rule, N = new tl(A), q = [A.__beforeBegin, A["on:begin"]];
      for (const ie of q)
        if (!!ie && (ie(b, N), N.isMatchIgnored))
          return di(E);
      return A.skip ? B += E : (A.excludeBegin && (B += E), X(), !A.returnBegin && !A.excludeBegin && (B = E)), En(A, b), A.returnBegin ? 0 : E.length;
    }
    function fi(b) {
      const E = b[0], A = x.substring(b.index), N = xn(C, b, A);
      if (!N)
        return ll;
      const q = C;
      C.endScope && C.endScope._wrap ? (X(), U.addKeyword(E, C.endScope._wrap)) : C.endScope && C.endScope._multi ? (X(), he(C.endScope, b)) : q.skip ? B += E : (q.returnEnd || q.excludeEnd || (B += E), X(), q.excludeEnd && (B = E));
      do
        C.scope && U.closeNode(), !C.skip && !C.subLanguage && (nt += C.relevance), C = C.parent;
      while (C !== N.parent);
      return N.starts && En(N.starts, b), q.returnEnd ? 0 : E.length;
    }
    function pi() {
      const b = [];
      for (let E = C; E !== fe; E = E.parent)
        E.scope && b.unshift(E.scope);
      b.forEach((E) => U.openNode(E));
    }
    let tt = {};
    function kn(b, E) {
      const A = E && E[0];
      if (B += b, A == null)
        return X(), 0;
      if (tt.type === "begin" && E.type === "end" && tt.index === E.index && A === "") {
        if (B += x.slice(E.index, E.index + 1), !i) {
          const N = new Error(`0 width match regex (${m})`);
          throw N.languageName = m, N.badRule = tt.rule, N;
        }
        return 1;
      }
      if (tt = E, E.type === "begin")
        return hi(E);
      if (E.type === "illegal" && !w) {
        const N = new Error('Illegal lexeme "' + A + '" for mode "' + (C.scope || "<unnamed>") + '"');
        throw N.mode = C, N;
      } else if (E.type === "end") {
        const N = fi(E);
        if (N !== ll)
          return N;
      }
      if (E.type === "illegal" && A === "")
        return 1;
      if (Mt > 1e5 && Mt > E.index * 3)
        throw new Error("potential infinite loop, way more iterations than matches");
      return B += A, A.length;
    }
    const fe = L(m);
    if (!fe)
      throw Ht(s.replace("{}", m)), new Error('Unknown language: "' + m + '"');
    const gi = um(fe);
    let wt = "", C = M || gi;
    const Cn = {}, U = new l.__emitter(l);
    pi();
    let B = "", nt = 0, ke = 0, Mt = 0, Tt = !1;
    try {
      for (C.matcher.considerAll(); ; ) {
        Mt++, Tt ? Tt = !1 : C.matcher.considerAll(), C.matcher.lastIndex = ke;
        const b = C.matcher.exec(x);
        if (!b)
          break;
        const E = x.substring(ke, b.index), A = kn(E, b);
        ke = b.index + A;
      }
      return kn(x.substring(ke)), U.closeAllNodes(), U.finalize(), wt = U.toHTML(), {
        language: m,
        value: wt,
        relevance: nt,
        illegal: !1,
        _emitter: U,
        _top: C
      };
    } catch (b) {
      if (b.message && b.message.includes("Illegal"))
        return {
          language: m,
          value: $i(x),
          illegal: !0,
          relevance: 0,
          _illegalBy: {
            message: b.message,
            index: ke,
            context: x.slice(ke - 100, ke + 100),
            mode: b.mode,
            resultSoFar: wt
          },
          _emitter: U
        };
      if (i)
        return {
          language: m,
          value: $i(x),
          illegal: !1,
          relevance: 0,
          errorRaised: b,
          _emitter: U,
          _top: C
        };
      throw b;
    }
  }
  function h(m) {
    const x = {
      value: $i(m),
      illegal: !1,
      relevance: 0,
      _top: o,
      _emitter: new l.__emitter(l)
    };
    return x._emitter.addText(m), x;
  }
  function f(m, x) {
    x = x || l.languages || Object.keys(e);
    const w = h(m), M = x.filter(L).filter(_e).map(
      (X) => d(X, m, !1)
    );
    M.unshift(w);
    const F = M.sort((X, he) => {
      if (X.relevance !== he.relevance)
        return he.relevance - X.relevance;
      if (X.language && he.language) {
        if (L(X.language).supersetOf === he.language)
          return 1;
        if (L(he.language).supersetOf === X.language)
          return -1;
      }
      return 0;
    }), [W, de] = F, et = W;
    return et.secondBest = de, et;
  }
  function p(m, x, w) {
    const M = x && t[x] || w;
    m.classList.add("hljs"), m.classList.add(`language-${M}`);
  }
  function g(m) {
    let x = null;
    const w = c(m);
    if (a(w))
      return;
    if (ne(
      "before:highlightElement",
      { el: m, language: w }
    ), m.children.length > 0 && (l.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(m)), l.throwUnescapedHTML))
      throw new hm(
        "One of your code blocks includes unescaped HTML.",
        m.innerHTML
      );
    x = m;
    const M = x.textContent, F = w ? u(M, { language: w, ignoreIllegals: !0 }) : f(M);
    m.innerHTML = F.value, p(m, w, F.language), m.result = {
      language: F.language,
      re: F.relevance,
      relevance: F.relevance
    }, F.secondBest && (m.secondBest = {
      language: F.secondBest.language,
      relevance: F.secondBest.relevance
    }), ne("after:highlightElement", { el: m, result: F, text: M });
  }
  function y(m) {
    l = ol(l, m);
  }
  const D = () => {
    z(), Yt("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
  };
  function R() {
    z(), Yt("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
  }
  let P = !1;
  function z() {
    if (document.readyState === "loading") {
      P = !0;
      return;
    }
    document.querySelectorAll(l.cssSelector).forEach(g);
  }
  function j() {
    P && z();
  }
  typeof window < "u" && window.addEventListener && window.addEventListener("DOMContentLoaded", j, !1);
  function Q(m, x) {
    let w = null;
    try {
      w = x(n);
    } catch (M) {
      if (Ht("Language definition for '{}' could not be registered.".replace("{}", m)), i)
        Ht(M);
      else
        throw M;
      w = o;
    }
    w.name || (w.name = m), e[m] = w, w.rawDefinition = x.bind(null, n), w.aliases && te(w.aliases, { languageName: m });
  }
  function G(m) {
    delete e[m];
    for (const x of Object.keys(t))
      t[x] === m && delete t[x];
  }
  function T() {
    return Object.keys(e);
  }
  function L(m) {
    return m = (m || "").toLowerCase(), e[m] || e[t[m]];
  }
  function te(m, { languageName: x }) {
    typeof m == "string" && (m = [m]), m.forEach((w) => {
      t[w.toLowerCase()] = x;
    });
  }
  function _e(m) {
    const x = L(m);
    return x && !x.disableAutodetect;
  }
  function ot(m) {
    m["before:highlightBlock"] && !m["before:highlightElement"] && (m["before:highlightElement"] = (x) => {
      m["before:highlightBlock"](
        Object.assign({ block: x.el }, x)
      );
    }), m["after:highlightBlock"] && !m["after:highlightElement"] && (m["after:highlightElement"] = (x) => {
      m["after:highlightBlock"](
        Object.assign({ block: x.el }, x)
      );
    });
  }
  function Ae(m) {
    ot(m), r.push(m);
  }
  function ne(m, x) {
    const w = m;
    r.forEach(function(M) {
      M[w] && M[w](x);
    });
  }
  function ce(m) {
    return Yt("10.7.0", "highlightBlock will be removed entirely in v12.0"), Yt("10.7.0", "Please use highlightElement now."), g(m);
  }
  Object.assign(n, {
    highlight: u,
    highlightAuto: f,
    highlightAll: z,
    highlightElement: g,
    highlightBlock: ce,
    configure: y,
    initHighlighting: D,
    initHighlightingOnLoad: R,
    registerLanguage: Q,
    unregisterLanguage: G,
    listLanguages: T,
    getLanguage: L,
    registerAliases: te,
    autoDetection: _e,
    inherit: ol,
    addPlugin: Ae
  }), n.debugMode = function() {
    i = !1;
  }, n.safeMode = function() {
    i = !0;
  }, n.versionString = dm, n.regex = {
    concat: Wt,
    lookahead: ru,
    either: Bs,
    optional: Mg,
    anyNumberOfTimes: wg
  };
  for (const m in or)
    typeof or[m] == "object" && Ns.exports(or[m]);
  return Object.assign(n, or), n;
};
var qn = pm({}), gm = qn;
qn.HighlightJS = qn;
qn.default = qn;
var mm = gm;
function hu(n, e = []) {
  return n.map((t) => {
    const r = [
      ...e,
      ...t.properties ? t.properties.className : []
    ];
    return t.children ? hu(t.children, r) : {
      text: t.value,
      classes: r
    };
  }).flat();
}
function al(n) {
  return n.value || n.children || [];
}
function ym(n) {
  return Boolean(mm.getLanguage(n));
}
function ul({ doc: n, name: e, lowlight: t, defaultLanguage: r }) {
  const i = [];
  return as(n, (s) => s.type.name === e).forEach((s) => {
    let o = s.pos + 1;
    const l = s.node.attrs.language || r, a = t.listLanguages(), c = l && (a.includes(l) || ym(l)) ? al(t.highlight(l, s.node.textContent)) : al(t.highlightAuto(s.node.textContent));
    hu(c).forEach((u) => {
      const d = o + u.text.length;
      if (u.classes.length) {
        const h = we.inline(o, d, {
          class: u.classes.join(" ")
        });
        i.push(h);
      }
      o = d;
    });
  }), se.create(n, i);
}
function bm(n) {
  return typeof n == "function";
}
function Dm({ name: n, lowlight: e, defaultLanguage: t }) {
  if (!["highlight", "highlightAuto", "listLanguages"].every((i) => bm(e[i])))
    throw Error("You should provide an instance of lowlight to use the code-block-lowlight extension");
  const r = new ye({
    key: new Oe("lowlight"),
    state: {
      init: (i, { doc: s }) => ul({
        doc: s,
        name: n,
        lowlight: e,
        defaultLanguage: t
      }),
      apply: (i, s, o, l) => {
        const a = o.selection.$head.parent.type.name, c = l.selection.$head.parent.type.name, u = as(o.doc, (h) => h.type.name === n), d = as(l.doc, (h) => h.type.name === n);
        return i.docChanged && ([a, c].includes(n) || d.length !== u.length || i.steps.some((h) => h.from !== void 0 && h.to !== void 0 && u.some((f) => f.pos >= h.from && f.pos + f.node.nodeSize <= h.to))) ? ul({
          doc: i.doc,
          name: n,
          lowlight: e,
          defaultLanguage: t
        }) : s.map(i.mapping, i.doc);
      }
    },
    props: {
      decorations(i) {
        return r.getState(i);
      }
    }
  });
  return r;
}
const Em = xg.extend({
  addOptions() {
    var n;
    return {
      ...(n = this.parent) === null || n === void 0 ? void 0 : n.call(this),
      lowlight: {},
      defaultLanguage: null
    };
  },
  addProseMirrorPlugins() {
    var n;
    return [
      ...((n = this.parent) === null || n === void 0 ? void 0 : n.call(this)) || [],
      Dm({
        name: this.name,
        lowlight: this.options.lowlight,
        defaultLanguage: this.options.defaultLanguage
      })
    ];
  }
});
var Ls = { exports: {} };
function _s(n) {
  return n instanceof Map ? n.clear = n.delete = n.set = function() {
    throw new Error("map is read-only");
  } : n instanceof Set && (n.add = n.clear = n.delete = function() {
    throw new Error("set is read-only");
  }), Object.freeze(n), Object.getOwnPropertyNames(n).forEach(function(e) {
    var t = n[e];
    typeof t == "object" && !Object.isFrozen(t) && _s(t);
  }), n;
}
Ls.exports = _s;
Ls.exports.default = _s;
class cl {
  constructor(e) {
    e.data === void 0 && (e.data = {}), this.data = e.data, this.isMatchIgnored = !1;
  }
  ignoreMatch() {
    this.isMatchIgnored = !0;
  }
}
function fu(n) {
  return n.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}
function gt(n, ...e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const r in n)
    t[r] = n[r];
  return e.forEach(function(r) {
    for (const i in r)
      t[i] = r[i];
  }), t;
}
const xm = "</span>", dl = (n) => !!n.scope || n.sublanguage && n.language, km = (n, { prefix: e }) => {
  if (n.includes(".")) {
    const t = n.split(".");
    return [
      `${e}${t.shift()}`,
      ...t.map((r, i) => `${r}${"_".repeat(i + 1)}`)
    ].join(" ");
  }
  return `${e}${n}`;
};
class Cm {
  constructor(e, t) {
    this.buffer = "", this.classPrefix = t.classPrefix, e.walk(this);
  }
  addText(e) {
    this.buffer += fu(e);
  }
  openNode(e) {
    if (!dl(e))
      return;
    let t = "";
    e.sublanguage ? t = `language-${e.language}` : t = km(e.scope, { prefix: this.classPrefix }), this.span(t);
  }
  closeNode(e) {
    !dl(e) || (this.buffer += xm);
  }
  value() {
    return this.buffer;
  }
  span(e) {
    this.buffer += `<span class="${e}">`;
  }
}
const hl = (n = {}) => {
  const e = { children: [] };
  return Object.assign(e, n), e;
};
class zs {
  constructor() {
    this.rootNode = hl(), this.stack = [this.rootNode];
  }
  get top() {
    return this.stack[this.stack.length - 1];
  }
  get root() {
    return this.rootNode;
  }
  add(e) {
    this.top.children.push(e);
  }
  openNode(e) {
    const t = hl({ scope: e });
    this.add(t), this.stack.push(t);
  }
  closeNode() {
    if (this.stack.length > 1)
      return this.stack.pop();
  }
  closeAllNodes() {
    for (; this.closeNode(); )
      ;
  }
  toJSON() {
    return JSON.stringify(this.rootNode, null, 4);
  }
  walk(e) {
    return this.constructor._walk(e, this.rootNode);
  }
  static _walk(e, t) {
    return typeof t == "string" ? e.addText(t) : t.children && (e.openNode(t), t.children.forEach((r) => this._walk(e, r)), e.closeNode(t)), e;
  }
  static _collapse(e) {
    typeof e != "string" && (!e.children || (e.children.every((t) => typeof t == "string") ? e.children = [e.children.join("")] : e.children.forEach((t) => {
      zs._collapse(t);
    })));
  }
}
class Sm extends zs {
  constructor(e) {
    super(), this.options = e;
  }
  addKeyword(e, t) {
    e !== "" && (this.openNode(t), this.addText(e), this.closeNode());
  }
  addText(e) {
    e !== "" && this.add(e);
  }
  addSublanguage(e, t) {
    const r = e.root;
    r.sublanguage = !0, r.language = t, this.add(r);
  }
  toHTML() {
    return new Cm(this, this.options).value();
  }
  finalize() {
    return !0;
  }
}
function Jn(n) {
  return n ? typeof n == "string" ? n : n.source : null;
}
function pu(n) {
  return qt("(?=", n, ")");
}
function Am(n) {
  return qt("(?:", n, ")*");
}
function wm(n) {
  return qt("(?:", n, ")?");
}
function qt(...n) {
  return n.map((t) => Jn(t)).join("");
}
function Mm(n) {
  const e = n[n.length - 1];
  return typeof e == "object" && e.constructor === Object ? (n.splice(n.length - 1, 1), e) : {};
}
function Hs(...n) {
  const e = Mm(n);
  return "(" + (e.capture ? "" : "?:") + n.map((r) => Jn(r)).join("|") + ")";
}
function gu(n) {
  return new RegExp(n.toString() + "|").exec("").length - 1;
}
function Tm(n, e) {
  const t = n && n.exec(e);
  return t && t.index === 0;
}
const Om = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
function $s(n, { joinWith: e }) {
  let t = 0;
  return n.map((r) => {
    t += 1;
    const i = t;
    let s = Jn(r), o = "";
    for (; s.length > 0; ) {
      const l = Om.exec(s);
      if (!l) {
        o += s;
        break;
      }
      o += s.substring(0, l.index), s = s.substring(l.index + l[0].length), l[0][0] === "\\" && l[1] ? o += "\\" + String(Number(l[1]) + i) : (o += l[0], l[0] === "(" && t++);
    }
    return o;
  }).map((r) => `(${r})`).join(e);
}
const vm = /\b\B/, mu = "[a-zA-Z]\\w*", js = "[a-zA-Z_]\\w*", yu = "\\b\\d+(\\.\\d+)?", bu = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", Du = "\\b(0b[01]+)", Nm = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", Fm = (n = {}) => {
  const e = /^#![ ]*\//;
  return n.binary && (n.begin = qt(
    e,
    /.*\b/,
    n.binary,
    /\b.*/
  )), gt({
    scope: "meta",
    begin: e,
    end: /$/,
    relevance: 0,
    "on:begin": (t, r) => {
      t.index !== 0 && r.ignoreMatch();
    }
  }, n);
}, Gn = {
  begin: "\\\\[\\s\\S]",
  relevance: 0
}, Rm = {
  scope: "string",
  begin: "'",
  end: "'",
  illegal: "\\n",
  contains: [Gn]
}, Bm = {
  scope: "string",
  begin: '"',
  end: '"',
  illegal: "\\n",
  contains: [Gn]
}, Im = {
  begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
}, ai = function(n, e, t = {}) {
  const r = gt(
    {
      scope: "comment",
      begin: n,
      end: e,
      contains: []
    },
    t
  );
  r.contains.push({
    scope: "doctag",
    begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
    end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
    excludeBegin: !0,
    relevance: 0
  });
  const i = Hs(
    "I",
    "a",
    "is",
    "so",
    "us",
    "to",
    "at",
    "if",
    "in",
    "it",
    "on",
    /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
    /[A-Za-z]+[-][a-z]+/,
    /[A-Za-z][a-z]{2,}/
  );
  return r.contains.push(
    {
      begin: qt(
        /[ ]+/,
        "(",
        i,
        /[.]?[:]?([.][ ]|[ ])/,
        "){3}"
      )
    }
  ), r;
}, Pm = ai("//", "$"), Lm = ai("/\\*", "\\*/"), _m = ai("#", "$"), zm = {
  scope: "number",
  begin: yu,
  relevance: 0
}, Hm = {
  scope: "number",
  begin: bu,
  relevance: 0
}, $m = {
  scope: "number",
  begin: Du,
  relevance: 0
}, jm = {
  begin: /(?=\/[^/\n]*\/)/,
  contains: [{
    scope: "regexp",
    begin: /\//,
    end: /\/[gimuy]*/,
    illegal: /\n/,
    contains: [
      Gn,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [Gn]
      }
    ]
  }]
}, Vm = {
  scope: "title",
  begin: mu,
  relevance: 0
}, Um = {
  scope: "title",
  begin: js,
  relevance: 0
}, Km = {
  begin: "\\.\\s*" + js,
  relevance: 0
}, Wm = function(n) {
  return Object.assign(
    n,
    {
      "on:begin": (e, t) => {
        t.data._beginMatch = e[1];
      },
      "on:end": (e, t) => {
        t.data._beginMatch !== e[1] && t.ignoreMatch();
      }
    }
  );
};
var lr = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  MATCH_NOTHING_RE: vm,
  IDENT_RE: mu,
  UNDERSCORE_IDENT_RE: js,
  NUMBER_RE: yu,
  C_NUMBER_RE: bu,
  BINARY_NUMBER_RE: Du,
  RE_STARTERS_RE: Nm,
  SHEBANG: Fm,
  BACKSLASH_ESCAPE: Gn,
  APOS_STRING_MODE: Rm,
  QUOTE_STRING_MODE: Bm,
  PHRASAL_WORDS_MODE: Im,
  COMMENT: ai,
  C_LINE_COMMENT_MODE: Pm,
  C_BLOCK_COMMENT_MODE: Lm,
  HASH_COMMENT_MODE: _m,
  NUMBER_MODE: zm,
  C_NUMBER_MODE: Hm,
  BINARY_NUMBER_MODE: $m,
  REGEXP_MODE: jm,
  TITLE_MODE: Vm,
  UNDERSCORE_TITLE_MODE: Um,
  METHOD_GUARD: Km,
  END_SAME_AS_BEGIN: Wm
});
function qm(n, e) {
  n.input[n.index - 1] === "." && e.ignoreMatch();
}
function Jm(n, e) {
  n.className !== void 0 && (n.scope = n.className, delete n.className);
}
function Gm(n, e) {
  !e || !n.beginKeywords || (n.begin = "\\b(" + n.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", n.__beforeBegin = qm, n.keywords = n.keywords || n.beginKeywords, delete n.beginKeywords, n.relevance === void 0 && (n.relevance = 0));
}
function Ym(n, e) {
  !Array.isArray(n.illegal) || (n.illegal = Hs(...n.illegal));
}
function Xm(n, e) {
  if (!!n.match) {
    if (n.begin || n.end)
      throw new Error("begin & end are not supported with match");
    n.begin = n.match, delete n.match;
  }
}
function Qm(n, e) {
  n.relevance === void 0 && (n.relevance = 1);
}
const Zm = (n, e) => {
  if (!n.beforeMatch)
    return;
  if (n.starts)
    throw new Error("beforeMatch cannot be used with starts");
  const t = Object.assign({}, n);
  Object.keys(n).forEach((r) => {
    delete n[r];
  }), n.keywords = t.keywords, n.begin = qt(t.beforeMatch, pu(t.begin)), n.starts = {
    relevance: 0,
    contains: [
      Object.assign(t, { endsParent: !0 })
    ]
  }, n.relevance = 0, delete t.beforeMatch;
}, e0 = [
  "of",
  "and",
  "for",
  "in",
  "not",
  "or",
  "if",
  "then",
  "parent",
  "list",
  "value"
], t0 = "keyword";
function Eu(n, e, t = t0) {
  const r = /* @__PURE__ */ Object.create(null);
  return typeof n == "string" ? i(t, n.split(" ")) : Array.isArray(n) ? i(t, n) : Object.keys(n).forEach(function(s) {
    Object.assign(
      r,
      Eu(n[s], e, s)
    );
  }), r;
  function i(s, o) {
    e && (o = o.map((l) => l.toLowerCase())), o.forEach(function(l) {
      const a = l.split("|");
      r[a[0]] = [s, n0(a[0], a[1])];
    });
  }
}
function n0(n, e) {
  return e ? Number(e) : r0(n) ? 0 : 1;
}
function r0(n) {
  return e0.includes(n.toLowerCase());
}
const fl = {}, $t = (n) => {
  console.error(n);
}, pl = (n, ...e) => {
  console.log(`WARN: ${n}`, ...e);
}, Xt = (n, e) => {
  fl[`${n}/${e}`] || (console.log(`Deprecated as of ${n}. ${e}`), fl[`${n}/${e}`] = !0);
}, Or = new Error();
function xu(n, e, { key: t }) {
  let r = 0;
  const i = n[t], s = {}, o = {};
  for (let l = 1; l <= e.length; l++)
    o[l + r] = i[l], s[l + r] = !0, r += gu(e[l - 1]);
  n[t] = o, n[t]._emit = s, n[t]._multi = !0;
}
function i0(n) {
  if (!!Array.isArray(n.begin)) {
    if (n.skip || n.excludeBegin || n.returnBegin)
      throw $t("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Or;
    if (typeof n.beginScope != "object" || n.beginScope === null)
      throw $t("beginScope must be object"), Or;
    xu(n, n.begin, { key: "beginScope" }), n.begin = $s(n.begin, { joinWith: "" });
  }
}
function s0(n) {
  if (!!Array.isArray(n.end)) {
    if (n.skip || n.excludeEnd || n.returnEnd)
      throw $t("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Or;
    if (typeof n.endScope != "object" || n.endScope === null)
      throw $t("endScope must be object"), Or;
    xu(n, n.end, { key: "endScope" }), n.end = $s(n.end, { joinWith: "" });
  }
}
function o0(n) {
  n.scope && typeof n.scope == "object" && n.scope !== null && (n.beginScope = n.scope, delete n.scope);
}
function l0(n) {
  o0(n), typeof n.beginScope == "string" && (n.beginScope = { _wrap: n.beginScope }), typeof n.endScope == "string" && (n.endScope = { _wrap: n.endScope }), i0(n), s0(n);
}
function a0(n) {
  function e(o, l) {
    return new RegExp(
      Jn(o),
      "m" + (n.case_insensitive ? "i" : "") + (n.unicodeRegex ? "u" : "") + (l ? "g" : "")
    );
  }
  class t {
    constructor() {
      this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
    }
    addRule(l, a) {
      a.position = this.position++, this.matchIndexes[this.matchAt] = a, this.regexes.push([a, l]), this.matchAt += gu(l) + 1;
    }
    compile() {
      this.regexes.length === 0 && (this.exec = () => null);
      const l = this.regexes.map((a) => a[1]);
      this.matcherRe = e($s(l, { joinWith: "|" }), !0), this.lastIndex = 0;
    }
    exec(l) {
      this.matcherRe.lastIndex = this.lastIndex;
      const a = this.matcherRe.exec(l);
      if (!a)
        return null;
      const c = a.findIndex((d, h) => h > 0 && d !== void 0), u = this.matchIndexes[c];
      return a.splice(0, c), Object.assign(a, u);
    }
  }
  class r {
    constructor() {
      this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
    }
    getMatcher(l) {
      if (this.multiRegexes[l])
        return this.multiRegexes[l];
      const a = new t();
      return this.rules.slice(l).forEach(([c, u]) => a.addRule(c, u)), a.compile(), this.multiRegexes[l] = a, a;
    }
    resumingScanAtSamePosition() {
      return this.regexIndex !== 0;
    }
    considerAll() {
      this.regexIndex = 0;
    }
    addRule(l, a) {
      this.rules.push([l, a]), a.type === "begin" && this.count++;
    }
    exec(l) {
      const a = this.getMatcher(this.regexIndex);
      a.lastIndex = this.lastIndex;
      let c = a.exec(l);
      if (this.resumingScanAtSamePosition() && !(c && c.index === this.lastIndex)) {
        const u = this.getMatcher(0);
        u.lastIndex = this.lastIndex + 1, c = u.exec(l);
      }
      return c && (this.regexIndex += c.position + 1, this.regexIndex === this.count && this.considerAll()), c;
    }
  }
  function i(o) {
    const l = new r();
    return o.contains.forEach((a) => l.addRule(a.begin, { rule: a, type: "begin" })), o.terminatorEnd && l.addRule(o.terminatorEnd, { type: "end" }), o.illegal && l.addRule(o.illegal, { type: "illegal" }), l;
  }
  function s(o, l) {
    const a = o;
    if (o.isCompiled)
      return a;
    [
      Jm,
      Xm,
      l0,
      Zm
    ].forEach((u) => u(o, l)), n.compilerExtensions.forEach((u) => u(o, l)), o.__beforeBegin = null, [
      Gm,
      Ym,
      Qm
    ].forEach((u) => u(o, l)), o.isCompiled = !0;
    let c = null;
    return typeof o.keywords == "object" && o.keywords.$pattern && (o.keywords = Object.assign({}, o.keywords), c = o.keywords.$pattern, delete o.keywords.$pattern), c = c || /\w+/, o.keywords && (o.keywords = Eu(o.keywords, n.case_insensitive)), a.keywordPatternRe = e(c, !0), l && (o.begin || (o.begin = /\B|\b/), a.beginRe = e(a.begin), !o.end && !o.endsWithParent && (o.end = /\B|\b/), o.end && (a.endRe = e(a.end)), a.terminatorEnd = Jn(a.end) || "", o.endsWithParent && l.terminatorEnd && (a.terminatorEnd += (o.end ? "|" : "") + l.terminatorEnd)), o.illegal && (a.illegalRe = e(o.illegal)), o.contains || (o.contains = []), o.contains = [].concat(...o.contains.map(function(u) {
      return u0(u === "self" ? o : u);
    })), o.contains.forEach(function(u) {
      s(u, a);
    }), o.starts && s(o.starts, l), a.matcher = i(a), a;
  }
  if (n.compilerExtensions || (n.compilerExtensions = []), n.contains && n.contains.includes("self"))
    throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
  return n.classNameAliases = gt(n.classNameAliases || {}), s(n);
}
function ku(n) {
  return n ? n.endsWithParent || ku(n.starts) : !1;
}
function u0(n) {
  return n.variants && !n.cachedVariants && (n.cachedVariants = n.variants.map(function(e) {
    return gt(n, { variants: null }, e);
  })), n.cachedVariants ? n.cachedVariants : ku(n) ? gt(n, { starts: n.starts ? gt(n.starts) : null }) : Object.isFrozen(n) ? gt(n) : n;
}
var c0 = "11.6.0";
class d0 extends Error {
  constructor(e, t) {
    super(e), this.name = "HTMLInjectionError", this.html = t;
  }
}
const ji = fu, gl = gt, ml = Symbol("nomatch"), h0 = 7, f0 = function(n) {
  const e = /* @__PURE__ */ Object.create(null), t = /* @__PURE__ */ Object.create(null), r = [];
  let i = !0;
  const s = "Could not find the language '{}', did you forget to load/include a language module?", o = { disableAutodetect: !0, name: "Plain text", contains: [] };
  let l = {
    ignoreUnescapedHTML: !1,
    throwUnescapedHTML: !1,
    noHighlightRe: /^(no-?highlight)$/i,
    languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
    classPrefix: "hljs-",
    cssSelector: "pre code",
    languages: null,
    __emitter: Sm
  };
  function a(m) {
    return l.noHighlightRe.test(m);
  }
  function c(m) {
    let x = m.className + " ";
    x += m.parentNode ? m.parentNode.className : "";
    const w = l.languageDetectRe.exec(x);
    if (w) {
      const M = L(w[1]);
      return M || (pl(s.replace("{}", w[1])), pl("Falling back to no-highlight mode for this block.", m)), M ? w[1] : "no-highlight";
    }
    return x.split(/\s+/).find((M) => a(M) || L(M));
  }
  function u(m, x, w) {
    let M = "", F = "";
    typeof x == "object" ? (M = m, w = x.ignoreIllegals, F = x.language) : (Xt("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Xt("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), F = m, M = x), w === void 0 && (w = !0);
    const W = {
      code: M,
      language: F
    };
    ne("before:highlight", W);
    const de = W.result ? W.result : d(W.language, W.code, w);
    return de.code = W.code, ne("after:highlight", de), de;
  }
  function d(m, x, w, M) {
    const F = /* @__PURE__ */ Object.create(null);
    function W(b, E) {
      return b.keywords[E];
    }
    function de() {
      if (!C.keywords) {
        U.addText(B);
        return;
      }
      let b = 0;
      C.keywordPatternRe.lastIndex = 0;
      let E = C.keywordPatternRe.exec(B), A = "";
      for (; E; ) {
        A += B.substring(b, E.index);
        const N = fe.case_insensitive ? E[0].toLowerCase() : E[0], q = W(C, N);
        if (q) {
          const [ie, mi] = q;
          if (U.addText(A), A = "", F[N] = (F[N] || 0) + 1, F[N] <= h0 && (nt += mi), ie.startsWith("_"))
            A += E[0];
          else {
            const yi = fe.classNameAliases[ie] || ie;
            U.addKeyword(E[0], yi);
          }
        } else
          A += E[0];
        b = C.keywordPatternRe.lastIndex, E = C.keywordPatternRe.exec(B);
      }
      A += B.substring(b), U.addText(A);
    }
    function et() {
      if (B === "")
        return;
      let b = null;
      if (typeof C.subLanguage == "string") {
        if (!e[C.subLanguage]) {
          U.addText(B);
          return;
        }
        b = d(C.subLanguage, B, !0, Cn[C.subLanguage]), Cn[C.subLanguage] = b._top;
      } else
        b = f(B, C.subLanguage.length ? C.subLanguage : null);
      C.relevance > 0 && (nt += b.relevance), U.addSublanguage(b._emitter, b.language);
    }
    function X() {
      C.subLanguage != null ? et() : de(), B = "";
    }
    function he(b, E) {
      let A = 1;
      const N = E.length - 1;
      for (; A <= N; ) {
        if (!b._emit[A]) {
          A++;
          continue;
        }
        const q = fe.classNameAliases[b[A]] || b[A], ie = E[A];
        q ? U.addKeyword(ie, q) : (B = ie, de(), B = ""), A++;
      }
    }
    function En(b, E) {
      return b.scope && typeof b.scope == "string" && U.openNode(fe.classNameAliases[b.scope] || b.scope), b.beginScope && (b.beginScope._wrap ? (U.addKeyword(B, fe.classNameAliases[b.beginScope._wrap] || b.beginScope._wrap), B = "") : b.beginScope._multi && (he(b.beginScope, E), B = "")), C = Object.create(b, { parent: { value: C } }), C;
    }
    function xn(b, E, A) {
      let N = Tm(b.endRe, A);
      if (N) {
        if (b["on:end"]) {
          const q = new cl(b);
          b["on:end"](E, q), q.isMatchIgnored && (N = !1);
        }
        if (N) {
          for (; b.endsParent && b.parent; )
            b = b.parent;
          return b;
        }
      }
      if (b.endsWithParent)
        return xn(b.parent, E, A);
    }
    function di(b) {
      return C.matcher.regexIndex === 0 ? (B += b[0], 1) : (Tt = !0, 0);
    }
    function hi(b) {
      const E = b[0], A = b.rule, N = new cl(A), q = [A.__beforeBegin, A["on:begin"]];
      for (const ie of q)
        if (!!ie && (ie(b, N), N.isMatchIgnored))
          return di(E);
      return A.skip ? B += E : (A.excludeBegin && (B += E), X(), !A.returnBegin && !A.excludeBegin && (B = E)), En(A, b), A.returnBegin ? 0 : E.length;
    }
    function fi(b) {
      const E = b[0], A = x.substring(b.index), N = xn(C, b, A);
      if (!N)
        return ml;
      const q = C;
      C.endScope && C.endScope._wrap ? (X(), U.addKeyword(E, C.endScope._wrap)) : C.endScope && C.endScope._multi ? (X(), he(C.endScope, b)) : q.skip ? B += E : (q.returnEnd || q.excludeEnd || (B += E), X(), q.excludeEnd && (B = E));
      do
        C.scope && U.closeNode(), !C.skip && !C.subLanguage && (nt += C.relevance), C = C.parent;
      while (C !== N.parent);
      return N.starts && En(N.starts, b), q.returnEnd ? 0 : E.length;
    }
    function pi() {
      const b = [];
      for (let E = C; E !== fe; E = E.parent)
        E.scope && b.unshift(E.scope);
      b.forEach((E) => U.openNode(E));
    }
    let tt = {};
    function kn(b, E) {
      const A = E && E[0];
      if (B += b, A == null)
        return X(), 0;
      if (tt.type === "begin" && E.type === "end" && tt.index === E.index && A === "") {
        if (B += x.slice(E.index, E.index + 1), !i) {
          const N = new Error(`0 width match regex (${m})`);
          throw N.languageName = m, N.badRule = tt.rule, N;
        }
        return 1;
      }
      if (tt = E, E.type === "begin")
        return hi(E);
      if (E.type === "illegal" && !w) {
        const N = new Error('Illegal lexeme "' + A + '" for mode "' + (C.scope || "<unnamed>") + '"');
        throw N.mode = C, N;
      } else if (E.type === "end") {
        const N = fi(E);
        if (N !== ml)
          return N;
      }
      if (E.type === "illegal" && A === "")
        return 1;
      if (Mt > 1e5 && Mt > E.index * 3)
        throw new Error("potential infinite loop, way more iterations than matches");
      return B += A, A.length;
    }
    const fe = L(m);
    if (!fe)
      throw $t(s.replace("{}", m)), new Error('Unknown language: "' + m + '"');
    const gi = a0(fe);
    let wt = "", C = M || gi;
    const Cn = {}, U = new l.__emitter(l);
    pi();
    let B = "", nt = 0, ke = 0, Mt = 0, Tt = !1;
    try {
      for (C.matcher.considerAll(); ; ) {
        Mt++, Tt ? Tt = !1 : C.matcher.considerAll(), C.matcher.lastIndex = ke;
        const b = C.matcher.exec(x);
        if (!b)
          break;
        const E = x.substring(ke, b.index), A = kn(E, b);
        ke = b.index + A;
      }
      return kn(x.substring(ke)), U.closeAllNodes(), U.finalize(), wt = U.toHTML(), {
        language: m,
        value: wt,
        relevance: nt,
        illegal: !1,
        _emitter: U,
        _top: C
      };
    } catch (b) {
      if (b.message && b.message.includes("Illegal"))
        return {
          language: m,
          value: ji(x),
          illegal: !0,
          relevance: 0,
          _illegalBy: {
            message: b.message,
            index: ke,
            context: x.slice(ke - 100, ke + 100),
            mode: b.mode,
            resultSoFar: wt
          },
          _emitter: U
        };
      if (i)
        return {
          language: m,
          value: ji(x),
          illegal: !1,
          relevance: 0,
          errorRaised: b,
          _emitter: U,
          _top: C
        };
      throw b;
    }
  }
  function h(m) {
    const x = {
      value: ji(m),
      illegal: !1,
      relevance: 0,
      _top: o,
      _emitter: new l.__emitter(l)
    };
    return x._emitter.addText(m), x;
  }
  function f(m, x) {
    x = x || l.languages || Object.keys(e);
    const w = h(m), M = x.filter(L).filter(_e).map(
      (X) => d(X, m, !1)
    );
    M.unshift(w);
    const F = M.sort((X, he) => {
      if (X.relevance !== he.relevance)
        return he.relevance - X.relevance;
      if (X.language && he.language) {
        if (L(X.language).supersetOf === he.language)
          return 1;
        if (L(he.language).supersetOf === X.language)
          return -1;
      }
      return 0;
    }), [W, de] = F, et = W;
    return et.secondBest = de, et;
  }
  function p(m, x, w) {
    const M = x && t[x] || w;
    m.classList.add("hljs"), m.classList.add(`language-${M}`);
  }
  function g(m) {
    let x = null;
    const w = c(m);
    if (a(w))
      return;
    if (ne(
      "before:highlightElement",
      { el: m, language: w }
    ), m.children.length > 0 && (l.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(m)), l.throwUnescapedHTML))
      throw new d0(
        "One of your code blocks includes unescaped HTML.",
        m.innerHTML
      );
    x = m;
    const M = x.textContent, F = w ? u(M, { language: w, ignoreIllegals: !0 }) : f(M);
    m.innerHTML = F.value, p(m, w, F.language), m.result = {
      language: F.language,
      re: F.relevance,
      relevance: F.relevance
    }, F.secondBest && (m.secondBest = {
      language: F.secondBest.language,
      relevance: F.secondBest.relevance
    }), ne("after:highlightElement", { el: m, result: F, text: M });
  }
  function y(m) {
    l = gl(l, m);
  }
  const D = () => {
    z(), Xt("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
  };
  function R() {
    z(), Xt("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
  }
  let P = !1;
  function z() {
    if (document.readyState === "loading") {
      P = !0;
      return;
    }
    document.querySelectorAll(l.cssSelector).forEach(g);
  }
  function j() {
    P && z();
  }
  typeof window < "u" && window.addEventListener && window.addEventListener("DOMContentLoaded", j, !1);
  function Q(m, x) {
    let w = null;
    try {
      w = x(n);
    } catch (M) {
      if ($t("Language definition for '{}' could not be registered.".replace("{}", m)), i)
        $t(M);
      else
        throw M;
      w = o;
    }
    w.name || (w.name = m), e[m] = w, w.rawDefinition = x.bind(null, n), w.aliases && te(w.aliases, { languageName: m });
  }
  function G(m) {
    delete e[m];
    for (const x of Object.keys(t))
      t[x] === m && delete t[x];
  }
  function T() {
    return Object.keys(e);
  }
  function L(m) {
    return m = (m || "").toLowerCase(), e[m] || e[t[m]];
  }
  function te(m, { languageName: x }) {
    typeof m == "string" && (m = [m]), m.forEach((w) => {
      t[w.toLowerCase()] = x;
    });
  }
  function _e(m) {
    const x = L(m);
    return x && !x.disableAutodetect;
  }
  function ot(m) {
    m["before:highlightBlock"] && !m["before:highlightElement"] && (m["before:highlightElement"] = (x) => {
      m["before:highlightBlock"](
        Object.assign({ block: x.el }, x)
      );
    }), m["after:highlightBlock"] && !m["after:highlightElement"] && (m["after:highlightElement"] = (x) => {
      m["after:highlightBlock"](
        Object.assign({ block: x.el }, x)
      );
    });
  }
  function Ae(m) {
    ot(m), r.push(m);
  }
  function ne(m, x) {
    const w = m;
    r.forEach(function(M) {
      M[w] && M[w](x);
    });
  }
  function ce(m) {
    return Xt("10.7.0", "highlightBlock will be removed entirely in v12.0"), Xt("10.7.0", "Please use highlightElement now."), g(m);
  }
  Object.assign(n, {
    highlight: u,
    highlightAuto: f,
    highlightAll: z,
    highlightElement: g,
    highlightBlock: ce,
    configure: y,
    initHighlighting: D,
    initHighlightingOnLoad: R,
    registerLanguage: Q,
    unregisterLanguage: G,
    listLanguages: T,
    getLanguage: L,
    registerAliases: te,
    autoDetection: _e,
    inherit: gl,
    addPlugin: Ae
  }), n.debugMode = function() {
    i = !1;
  }, n.safeMode = function() {
    i = !0;
  }, n.versionString = c0, n.regex = {
    concat: qt,
    lookahead: pu,
    either: Hs,
    optional: wm,
    anyNumberOfTimes: Am
  };
  for (const m in lr)
    typeof lr[m] == "object" && Ls.exports(lr[m]);
  return Object.assign(n, lr), n;
};
var Yn = f0({}), p0 = Yn;
Yn.HighlightJS = Yn;
Yn.default = Yn;
const je = p0;
var Cu = { exports: {} };
(function(n) {
  (function() {
    var e;
    e = n.exports = i, e.format = i, e.vsprintf = r, typeof console < "u" && typeof console.log == "function" && (e.printf = t);
    function t() {
      console.log(i.apply(null, arguments));
    }
    function r(s, o) {
      return i.apply(null, [s].concat(o));
    }
    function i(s) {
      for (var o = 1, l = [].slice.call(arguments), a = 0, c = s.length, u = "", d, h = !1, f, p, g = !1, y, D = function() {
        return l[o++];
      }, R = function() {
        for (var P = ""; /\d/.test(s[a]); )
          P += s[a++], d = s[a];
        return P.length > 0 ? parseInt(P) : null;
      }; a < c; ++a)
        if (d = s[a], h)
          switch (h = !1, d == "." ? (g = !1, d = s[++a]) : d == "0" && s[a + 1] == "." ? (g = !0, a += 2, d = s[a]) : g = !0, y = R(), d) {
            case "b":
              u += parseInt(D(), 10).toString(2);
              break;
            case "c":
              f = D(), typeof f == "string" || f instanceof String ? u += f : u += String.fromCharCode(parseInt(f, 10));
              break;
            case "d":
              u += parseInt(D(), 10);
              break;
            case "f":
              p = String(parseFloat(D()).toFixed(y || 6)), u += g ? p : p.replace(/^0/, "");
              break;
            case "j":
              u += JSON.stringify(D());
              break;
            case "o":
              u += "0" + parseInt(D(), 10).toString(8);
              break;
            case "s":
              u += D();
              break;
            case "x":
              u += "0x" + parseInt(D(), 10).toString(16);
              break;
            case "X":
              u += "0x" + parseInt(D(), 10).toString(16).toUpperCase();
              break;
            default:
              u += d;
              break;
          }
        else
          d === "%" ? h = !0 : u += d;
      return u;
    }
  })();
})(Cu);
const g0 = Cu.exports, dr = Object.assign(Ot(Error), {
  eval: Ot(EvalError),
  range: Ot(RangeError),
  reference: Ot(ReferenceError),
  syntax: Ot(SyntaxError),
  type: Ot(TypeError),
  uri: Ot(URIError)
});
function Ot(n) {
  return e.displayName = n.displayName || n.name, e;
  function e(t, ...r) {
    const i = t && g0(t, ...r);
    return new n(i);
  }
}
const m0 = {}.hasOwnProperty, y0 = "hljs-";
function Su(n, e, t = {}) {
  let r = t.prefix;
  if (typeof n != "string")
    throw dr("Expected `string` for name, got `%s`", n);
  if (!je.getLanguage(n))
    throw dr("Unknown language: `%s` is not registered", n);
  if (typeof e != "string")
    throw dr("Expected `string` for value, got `%s`", e);
  r == null && (r = y0), je.configure({ __emitter: C0, classPrefix: r });
  const i = je.highlight(e, { language: n, ignoreIllegals: !0 });
  if (je.configure({}), i.errorRaised)
    throw i.errorRaised;
  return i._emitter.root.data.language = i.language, i._emitter.root.data.relevance = i.relevance, i._emitter.root;
}
function b0(n, e = {}) {
  const t = e.subset || je.listLanguages();
  e.prefix;
  let r = -1, i = {
    type: "root",
    data: { language: null, relevance: 0 },
    children: []
  };
  if (typeof n != "string")
    throw dr("Expected `string` for value, got `%s`", n);
  for (; ++r < t.length; ) {
    const s = t[r];
    if (!je.getLanguage(s))
      continue;
    const o = Su(s, n, e);
    o.data.relevance > i.data.relevance && (i = o);
  }
  return i;
}
function D0(n, e) {
  je.registerLanguage(n, e);
}
const E0 = function(n, e) {
  if (typeof n == "string")
    je.registerAliases(e, { languageName: n });
  else {
    let t;
    for (t in n)
      m0.call(n, t) && je.registerAliases(n[t], { languageName: t });
  }
};
function x0(n) {
  return Boolean(je.getLanguage(n));
}
function k0() {
  return je.listLanguages();
}
class C0 {
  constructor(e) {
    this.options = e, this.root = {
      type: "root",
      data: { language: null, relevance: 0 },
      children: []
    }, this.stack = [this.root];
  }
  addText(e) {
    if (e === "")
      return;
    const t = this.stack[this.stack.length - 1], r = t.children[t.children.length - 1];
    r && r.type === "text" ? r.value += e : t.children.push({ type: "text", value: e });
  }
  addKeyword(e, t) {
    this.openNode(t), this.addText(e), this.closeNode();
  }
  addSublanguage(e, t) {
    const r = this.stack[this.stack.length - 1], i = e.root.children;
    t ? r.children.push({
      type: "element",
      tagName: "span",
      properties: { className: [t] },
      children: i
    }) : r.children.push(...i);
  }
  openNode(e) {
    const t = e.split(".").map((s, o) => o ? s + "_".repeat(o) : this.options.classPrefix + s), r = this.stack[this.stack.length - 1], i = {
      type: "element",
      tagName: "span",
      properties: { className: t },
      children: []
    };
    r.children.push(i), this.stack.push(i);
  }
  closeNode() {
    this.stack.pop();
  }
  closeAllNodes() {
  }
  finalize() {
  }
  toHTML() {
    return "";
  }
}
const S0 = {
  highlight: Su,
  highlightAuto: b0,
  registerLanguage: D0,
  registered: x0,
  listLanguages: k0,
  registerAlias: E0
};
class A0 extends ue {
  constructor() {
    super(...arguments), this.plugin = Em.configure({ lowlight: S0 });
  }
  handle() {
    this.richText.editor.chain().focus().toggleCodeBlock().run();
  }
}
re("rich-text-plugin-handler-codeblock", A0);
const w0 = xe.create({
  name: "horizontalRule",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  group: "block",
  parseHTML() {
    return [
      { tag: "hr" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["hr", ee(this.options.HTMLAttributes, n)];
  },
  addCommands() {
    return {
      setHorizontalRule: () => ({ chain: n }) => n().insertContent({ type: this.name }).command(({ tr: e, dispatch: t }) => {
        var r;
        if (t) {
          const { $to: i } = e.selection, s = i.end();
          if (i.nodeAfter)
            e.setSelection($.create(e.doc, i.pos));
          else {
            const o = (r = i.parent.type.contentMatch.defaultType) === null || r === void 0 ? void 0 : r.create();
            o && (e.insert(s, o), e.setSelection($.create(e.doc, s)));
          }
          e.scrollIntoView();
        }
        return !0;
      }).run()
    };
  },
  addInputRules() {
    return [
      Ua({
        find: /^(?:---|—-|___\s|\*\*\*\s)$/,
        type: this.type
      })
    ];
  }
});
class M0 extends ue {
  constructor() {
    super(...arguments), this.plugin = w0;
  }
  handle() {
    this.richText.editor.chain().focus().setHorizontalRule().run();
  }
}
re("rich-text-plugin-handler-horizontal-rule", M0);
const T0 = xe.create({
  name: "hardBreak",
  addOptions() {
    return {
      keepMarks: !0,
      HTMLAttributes: {}
    };
  },
  inline: !0,
  group: "inline",
  selectable: !1,
  parseHTML() {
    return [
      { tag: "br" }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["br", ee(this.options.HTMLAttributes, n)];
  },
  renderText() {
    return `
`;
  },
  addCommands() {
    return {
      setHardBreak: () => ({ commands: n, chain: e, state: t, editor: r }) => n.first([
        () => n.exitCode(),
        () => n.command(() => {
          const { selection: i, storedMarks: s } = t;
          if (i.$from.parent.type.spec.isolating)
            return !1;
          const { keepMarks: o } = this.options, { splittableMarks: l } = r.extensionManager, a = s || i.$to.parentOffset && i.$from.marks();
          return e().insertContent({ type: this.name }).command(({ tr: c, dispatch: u }) => {
            if (u && a && o) {
              const d = a.filter((h) => l.includes(h.type.name));
              c.ensureMarks(d);
            }
            return !0;
          }).run();
        })
      ])
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-Enter": () => this.editor.commands.setHardBreak(),
      "Shift-Enter": () => this.editor.commands.setHardBreak()
    };
  }
});
class O0 extends oi {
  constructor() {
    super(...arguments), this.plugin = T0;
  }
}
Zn("rich-text-plugin-hard-break", O0);
function v0(n = {}) {
  return new ye({
    view(e) {
      return new N0(e, n);
    }
  });
}
class N0 {
  constructor(e, t) {
    this.editorView = e, this.cursorPos = null, this.element = null, this.timeout = -1, this.width = t.width || 1, this.color = t.color || "black", this.class = t.class, this.handlers = ["dragover", "dragend", "drop", "dragleave"].map((r) => {
      let i = (s) => {
        this[r](s);
      };
      return e.dom.addEventListener(r, i), { name: r, handler: i };
    });
  }
  destroy() {
    this.handlers.forEach(({ name: e, handler: t }) => this.editorView.dom.removeEventListener(e, t));
  }
  update(e, t) {
    this.cursorPos != null && t.doc != e.state.doc && (this.cursorPos > e.state.doc.content.size ? this.setCursor(null) : this.updateOverlay());
  }
  setCursor(e) {
    e != this.cursorPos && (this.cursorPos = e, e == null ? (this.element.parentNode.removeChild(this.element), this.element = null) : this.updateOverlay());
  }
  updateOverlay() {
    let e = this.editorView.state.doc.resolve(this.cursorPos), t;
    if (!e.parent.inlineContent) {
      let o = e.nodeBefore, l = e.nodeAfter;
      if (o || l) {
        let a = this.editorView.nodeDOM(this.cursorPos - (o ? o.nodeSize : 0)).getBoundingClientRect(), c = o ? a.bottom : a.top;
        o && l && (c = (c + this.editorView.nodeDOM(this.cursorPos).getBoundingClientRect().top) / 2), t = { left: a.left, right: a.right, top: c - this.width / 2, bottom: c + this.width / 2 };
      }
    }
    if (!t) {
      let o = this.editorView.coordsAtPos(this.cursorPos);
      t = { left: o.left - this.width / 2, right: o.left + this.width / 2, top: o.top, bottom: o.bottom };
    }
    let r = this.editorView.dom.offsetParent;
    this.element || (this.element = r.appendChild(document.createElement("div")), this.class && (this.element.className = this.class), this.element.style.cssText = "position: absolute; z-index: 50; pointer-events: none; background-color: " + this.color);
    let i, s;
    if (!r || r == document.body && getComputedStyle(r).position == "static")
      i = -pageXOffset, s = -pageYOffset;
    else {
      let o = r.getBoundingClientRect();
      i = o.left - r.scrollLeft, s = o.top - r.scrollTop;
    }
    this.element.style.left = t.left - i + "px", this.element.style.top = t.top - s + "px", this.element.style.width = t.right - t.left + "px", this.element.style.height = t.bottom - t.top + "px";
  }
  scheduleRemoval(e) {
    clearTimeout(this.timeout), this.timeout = setTimeout(() => this.setCursor(null), e);
  }
  dragover(e) {
    if (!this.editorView.editable)
      return;
    let t = this.editorView.posAtCoords({ left: e.clientX, top: e.clientY }), r = t && t.inside >= 0 && this.editorView.state.doc.nodeAt(t.inside), i = r && r.type.spec.disableDropCursor, s = typeof i == "function" ? i(this.editorView, t) : i;
    if (t && !s) {
      let o = t.pos;
      if (this.editorView.dragging && this.editorView.dragging.slice && (o = jl(this.editorView.state.doc, o, this.editorView.dragging.slice), o == null))
        return this.setCursor(null);
      this.setCursor(o), this.scheduleRemoval(5e3);
    }
  }
  dragend() {
    this.scheduleRemoval(20);
  }
  drop() {
    this.scheduleRemoval(20);
  }
  dragleave(e) {
    (e.target == this.editorView.dom || !this.editorView.dom.contains(e.relatedTarget)) && this.setCursor(null);
  }
}
const F0 = Le.create({
  name: "dropCursor",
  addOptions() {
    return {
      color: "currentColor",
      width: 1,
      class: void 0
    };
  },
  addProseMirrorPlugins() {
    return [
      v0(this.options)
    ];
  }
});
class R0 extends oi {
  constructor() {
    super(...arguments), this.plugin = F0;
  }
}
Zn("rich-text-plugin-dropcursor", R0);
function Vs(n) {
  this.j = {}, this.jr = [], this.jd = null, this.t = n;
}
Vs.prototype = {
  accepts: function() {
    return !!this.t;
  },
  tt: function(e, t) {
    if (t && t.j)
      return this.j[e] = t, t;
    var r = t, i = this.j[e];
    if (i)
      return r && (i.t = r), i;
    i = Y();
    var s = vr(this, e);
    return s ? (Object.assign(i.j, s.j), i.jr.append(s.jr), i.jr = s.jd, i.t = r || s.t) : i.t = r, this.j[e] = i, i;
  }
};
var Y = function() {
  return new Vs();
}, I = function(e) {
  return new Vs(e);
}, S = function(e, t, r) {
  e.j[t] || (e.j[t] = r);
}, oe = function(e, t, r) {
  e.jr.push([t, r]);
}, vr = function(e, t) {
  var r = e.j[t];
  if (r)
    return r;
  for (var i = 0; i < e.jr.length; i++) {
    var s = e.jr[i][0], o = e.jr[i][1];
    if (s.test(t))
      return o;
  }
  return e.jd;
}, K = function(e, t, r) {
  for (var i = 0; i < t.length; i++)
    S(e, t[i], r);
}, B0 = function(e, t) {
  for (var r = 0; r < t.length; r++) {
    var i = t[r][0], s = t[r][1];
    S(e, i, s);
  }
}, vt = function(e, t, r, i) {
  for (var s = 0, o = t.length, l; s < o && (l = e.j[t[s]]); )
    e = l, s++;
  if (s >= o)
    return [];
  for (; s < o - 1; )
    l = i(), S(e, t[s], l), e = l, s++;
  S(e, t[o - 1], r);
}, ze = "DOMAIN", it = "LOCALHOST", We = "TLD", Ie = "NUM", bn = "PROTOCOL", Us = "MAILTO", Au = "WS", Ks = "NL", sn = "OPENBRACE", Pn = "OPENBRACKET", Ln = "OPENANGLEBRACKET", _n = "OPENPAREN", Ft = "CLOSEBRACE", on = "CLOSEBRACKET", ln = "CLOSEANGLEBRACKET", an = "CLOSEPAREN", Nr = "AMPERSAND", Fr = "APOSTROPHE", Rr = "ASTERISK", un = "AT", Br = "BACKSLASH", Ir = "BACKTICK", Pr = "CARET", zn = "COLON", Ws = "COMMA", Lr = "DOLLAR", dt = "DOT", _r = "EQUALS", qs = "EXCLAMATION", zr = "HYPHEN", Hr = "PERCENT", $r = "PIPE", jr = "PLUS", Vr = "POUND", Ur = "QUERY", Js = "QUOTE", Gs = "SEMI", st = "SLASH", Kr = "TILDE", Wr = "UNDERSCORE", qr = "SYM", I0 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  DOMAIN: ze,
  LOCALHOST: it,
  TLD: We,
  NUM: Ie,
  PROTOCOL: bn,
  MAILTO: Us,
  WS: Au,
  NL: Ks,
  OPENBRACE: sn,
  OPENBRACKET: Pn,
  OPENANGLEBRACKET: Ln,
  OPENPAREN: _n,
  CLOSEBRACE: Ft,
  CLOSEBRACKET: on,
  CLOSEANGLEBRACKET: ln,
  CLOSEPAREN: an,
  AMPERSAND: Nr,
  APOSTROPHE: Fr,
  ASTERISK: Rr,
  AT: un,
  BACKSLASH: Br,
  BACKTICK: Ir,
  CARET: Pr,
  COLON: zn,
  COMMA: Ws,
  DOLLAR: Lr,
  DOT: dt,
  EQUALS: _r,
  EXCLAMATION: qs,
  HYPHEN: zr,
  PERCENT: Hr,
  PIPE: $r,
  PLUS: jr,
  POUND: Vr,
  QUERY: Ur,
  QUOTE: Js,
  SEMI: Gs,
  SLASH: st,
  TILDE: Kr,
  UNDERSCORE: Wr,
  SYM: qr
}), yl = "aaa aarp abarth abb abbott abbvie abc able abogado abudhabi ac academy accenture accountant accountants aco actor ad adac ads adult ae aeg aero aetna af afamilycompany afl africa ag agakhan agency ai aig airbus airforce airtel akdn al alfaromeo alibaba alipay allfinanz allstate ally alsace alstom am amazon americanexpress americanfamily amex amfam amica amsterdam analytics android anquan anz ao aol apartments app apple aq aquarelle ar arab aramco archi army arpa art arte as asda asia associates at athleta attorney au auction audi audible audio auspost author auto autos avianca aw aws ax axa az azure ba baby baidu banamex bananarepublic band bank bar barcelona barclaycard barclays barefoot bargains baseball basketball bauhaus bayern bb bbc bbt bbva bcg bcn bd be beats beauty beer bentley berlin best bestbuy bet bf bg bh bharti bi bible bid bike bing bingo bio biz bj black blackfriday blockbuster blog bloomberg blue bm bms bmw bn bnpparibas bo boats boehringer bofa bom bond boo book booking bosch bostik boston bot boutique box br bradesco bridgestone broadway broker brother brussels bs bt budapest bugatti build builders business buy buzz bv bw by bz bzh ca cab cafe cal call calvinklein cam camera camp cancerresearch canon capetown capital capitalone car caravan cards care career careers cars casa case cash casino cat catering catholic cba cbn cbre cbs cc cd center ceo cern cf cfa cfd cg ch chanel channel charity chase chat cheap chintai christmas chrome church ci cipriani circle cisco citadel citi citic city cityeats ck cl claims cleaning click clinic clinique clothing cloud club clubmed cm cn co coach codes coffee college cologne com comcast commbank community company compare computer comsec condos construction consulting contact contractors cooking cookingchannel cool coop corsica country coupon coupons courses cpa cr credit creditcard creditunion cricket crown crs cruise cruises csc cu cuisinella cv cw cx cy cymru cyou cz dabur dad dance data date dating datsun day dclk dds de deal dealer deals degree delivery dell deloitte delta democrat dental dentist desi design dev dhl diamonds diet digital direct directory discount discover dish diy dj dk dm dnp do docs doctor dog domains dot download drive dtv dubai duck dunlop dupont durban dvag dvr dz earth eat ec eco edeka edu education ee eg email emerck energy engineer engineering enterprises epson equipment er ericsson erni es esq estate et etisalat eu eurovision eus events exchange expert exposed express extraspace fage fail fairwinds faith family fan fans farm farmers fashion fast fedex feedback ferrari ferrero fi fiat fidelity fido film final finance financial fire firestone firmdale fish fishing fit fitness fj fk flickr flights flir florist flowers fly fm fo foo food foodnetwork football ford forex forsale forum foundation fox fr free fresenius frl frogans frontdoor frontier ftr fujitsu fujixerox fun fund furniture futbol fyi ga gal gallery gallo gallup game games gap garden gay gb gbiz gd gdn ge gea gent genting george gf gg ggee gh gi gift gifts gives giving gl glade glass gle global globo gm gmail gmbh gmo gmx gn godaddy gold goldpoint golf goo goodyear goog google gop got gov gp gq gr grainger graphics gratis green gripe grocery group gs gt gu guardian gucci guge guide guitars guru gw gy hair hamburg hangout haus hbo hdfc hdfcbank health healthcare help helsinki here hermes hgtv hiphop hisamitsu hitachi hiv hk hkt hm hn hockey holdings holiday homedepot homegoods homes homesense honda horse hospital host hosting hot hoteles hotels hotmail house how hr hsbc ht hu hughes hyatt hyundai ibm icbc ice icu id ie ieee ifm ikano il im imamat imdb immo immobilien in inc industries infiniti info ing ink institute insurance insure int international intuit investments io ipiranga iq ir irish is ismaili ist istanbul it itau itv iveco jaguar java jcb je jeep jetzt jewelry jio jll jm jmp jnj jo jobs joburg jot joy jp jpmorgan jprs juegos juniper kaufen kddi ke kerryhotels kerrylogistics kerryproperties kfh kg kh ki kia kim kinder kindle kitchen kiwi km kn koeln komatsu kosher kp kpmg kpn kr krd kred kuokgroup kw ky kyoto kz la lacaixa lamborghini lamer lancaster lancia land landrover lanxess lasalle lat latino latrobe law lawyer lb lc lds lease leclerc lefrak legal lego lexus lgbt li lidl life lifeinsurance lifestyle lighting like lilly limited limo lincoln linde link lipsy live living lixil lk llc llp loan loans locker locus loft lol london lotte lotto love lpl lplfinancial lr ls lt ltd ltda lu lundbeck luxe luxury lv ly ma macys madrid maif maison makeup man management mango map market marketing markets marriott marshalls maserati mattel mba mc mckinsey md me med media meet melbourne meme memorial men menu merckmsd mg mh miami microsoft mil mini mint mit mitsubishi mk ml mlb mls mm mma mn mo mobi mobile moda moe moi mom monash money monster mormon mortgage moscow moto motorcycles mov movie mp mq mr ms msd mt mtn mtr mu museum mutual mv mw mx my mz na nab nagoya name nationwide natura navy nba nc ne nec net netbank netflix network neustar new news next nextdirect nexus nf nfl ng ngo nhk ni nico nike nikon ninja nissan nissay nl no nokia northwesternmutual norton now nowruz nowtv np nr nra nrw ntt nu nyc nz obi observer off office okinawa olayan olayangroup oldnavy ollo om omega one ong onl online onyourside ooo open oracle orange org organic origins osaka otsuka ott ovh pa page panasonic paris pars partners parts party passagens pay pccw pe pet pf pfizer pg ph pharmacy phd philips phone photo photography photos physio pics pictet pictures pid pin ping pink pioneer pizza pk pl place play playstation plumbing plus pm pn pnc pohl poker politie porn post pr pramerica praxi press prime pro prod productions prof progressive promo properties property protection pru prudential ps pt pub pw pwc py qa qpon quebec quest qvc racing radio raid re read realestate realtor realty recipes red redstone redumbrella rehab reise reisen reit reliance ren rent rentals repair report republican rest restaurant review reviews rexroth rich richardli ricoh ril rio rip rmit ro rocher rocks rodeo rogers room rs rsvp ru rugby ruhr run rw rwe ryukyu sa saarland safe safety sakura sale salon samsclub samsung sandvik sandvikcoromant sanofi sap sarl sas save saxo sb sbi sbs sc sca scb schaeffler schmidt scholarships school schule schwarz science scjohnson scot sd se search seat secure security seek select sener services ses seven sew sex sexy sfr sg sh shangrila sharp shaw shell shia shiksha shoes shop shopping shouji show showtime si silk sina singles site sj sk ski skin sky skype sl sling sm smart smile sn sncf so soccer social softbank software sohu solar solutions song sony soy spa space sport spot spreadbetting sr srl ss st stada staples star statebank statefarm stc stcgroup stockholm storage store stream studio study style su sucks supplies supply support surf surgery suzuki sv swatch swiftcover swiss sx sy sydney systems sz tab taipei talk taobao target tatamotors tatar tattoo tax taxi tc tci td tdk team tech technology tel temasek tennis teva tf tg th thd theater theatre tiaa tickets tienda tiffany tips tires tirol tj tjmaxx tjx tk tkmaxx tl tm tmall tn to today tokyo tools top toray toshiba total tours town toyota toys tr trade trading training travel travelchannel travelers travelersinsurance trust trv tt tube tui tunes tushu tv tvs tw tz ua ubank ubs ug uk unicom university uno uol ups us uy uz va vacations vana vanguard vc ve vegas ventures verisign versicherung vet vg vi viajes video vig viking villas vin vip virgin visa vision viva vivo vlaanderen vn vodka volkswagen volvo vote voting voto voyage vu vuelos wales walmart walter wang wanggou watch watches weather weatherchannel webcam weber website wed wedding weibo weir wf whoswho wien wiki williamhill win windows wine winners wme wolterskluwer woodside work works world wow ws wtc wtf xbox xerox xfinity xihuan xin xxx xyz yachts yahoo yamaxun yandex ye yodobashi yoga yokohama you youtube yt yun za zappos zara zero zip zm zone zuerich zw verm\xF6gensberater-ctb verm\xF6gensberatung-pwb \u03B5\u03BB \u03B5\u03C5 \u0431\u0433 \u0431\u0435\u043B \u0434\u0435\u0442\u0438 \u0435\u044E \u043A\u0430\u0442\u043E\u043B\u0438\u043A \u043A\u043E\u043C \u049B\u0430\u0437 \u043C\u043A\u0434 \u043C\u043E\u043D \u043C\u043E\u0441\u043A\u0432\u0430 \u043E\u043D\u043B\u0430\u0439\u043D \u043E\u0440\u0433 \u0440\u0443\u0441 \u0440\u0444 \u0441\u0430\u0439\u0442 \u0441\u0440\u0431 \u0443\u043A\u0440 \u10D2\u10D4 \u0570\u0561\u0575 \u05D9\u05E9\u05E8\u05D0\u05DC \u05E7\u05D5\u05DD \u0627\u0628\u0648\u0638\u0628\u064A \u0627\u062A\u0635\u0627\u0644\u0627\u062A \u0627\u0631\u0627\u0645\u0643\u0648 \u0627\u0644\u0627\u0631\u062F\u0646 \u0627\u0644\u0628\u062D\u0631\u064A\u0646 \u0627\u0644\u062C\u0632\u0627\u0626\u0631 \u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629 \u0627\u0644\u0639\u0644\u064A\u0627\u0646 \u0627\u0644\u0645\u063A\u0631\u0628 \u0627\u0645\u0627\u0631\u0627\u062A \u0627\u06CC\u0631\u0627\u0646 \u0628\u0627\u0631\u062A \u0628\u0627\u0632\u0627\u0631 \u0628\u06BE\u0627\u0631\u062A \u0628\u064A\u062A\u0643 \u067E\u0627\u06A9\u0633\u062A\u0627\u0646 \u0680\u0627\u0631\u062A \u062A\u0648\u0646\u0633 \u0633\u0648\u062F\u0627\u0646 \u0633\u0648\u0631\u064A\u0629 \u0634\u0628\u0643\u0629 \u0639\u0631\u0627\u0642 \u0639\u0631\u0628 \u0639\u0645\u0627\u0646 \u0641\u0644\u0633\u0637\u064A\u0646 \u0642\u0637\u0631 \u0643\u0627\u062B\u0648\u0644\u064A\u0643 \u0643\u0648\u0645 \u0645\u0635\u0631 \u0645\u0644\u064A\u0633\u064A\u0627 \u0645\u0648\u0631\u064A\u062A\u0627\u0646\u064A\u0627 \u0645\u0648\u0642\u0639 \u0647\u0645\u0631\u0627\u0647 \u0915\u0949\u092E \u0928\u0947\u091F \u092D\u093E\u0930\u0924 \u092D\u093E\u0930\u0924\u092E\u094D \u092D\u093E\u0930\u094B\u0924 \u0938\u0902\u0917\u0920\u0928 \u09AC\u09BE\u0982\u09B2\u09BE \u09AD\u09BE\u09B0\u09A4 \u09AD\u09BE\u09F0\u09A4 \u0A2D\u0A3E\u0A30\u0A24 \u0AAD\u0ABE\u0AB0\u0AA4 \u0B2D\u0B3E\u0B30\u0B24 \u0B87\u0BA8\u0BCD\u0BA4\u0BBF\u0BAF\u0BBE \u0B87\u0BB2\u0B99\u0BCD\u0B95\u0BC8 \u0B9A\u0BBF\u0B99\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0BC2\u0BB0\u0BCD \u0C2D\u0C3E\u0C30\u0C24\u0C4D \u0CAD\u0CBE\u0CB0\u0CA4 \u0D2D\u0D3E\u0D30\u0D24\u0D02 \u0DBD\u0D82\u0D9A\u0DCF \u0E04\u0E2D\u0E21 \u0E44\u0E17\u0E22 \u0EA5\u0EB2\u0EA7 \uB2F7\uB137 \uB2F7\uCEF4 \uC0BC\uC131 \uD55C\uAD6D \u30A2\u30DE\u30BE\u30F3 \u30B0\u30FC\u30B0\u30EB \u30AF\u30E9\u30A6\u30C9 \u30B3\u30E0 \u30B9\u30C8\u30A2 \u30BB\u30FC\u30EB \u30D5\u30A1\u30C3\u30B7\u30E7\u30F3 \u30DD\u30A4\u30F3\u30C8 \u307F\u3093\u306A \u4E16\u754C \u4E2D\u4FE1 \u4E2D\u56FD \u4E2D\u570B \u4E2D\u6587\u7F51 \u4E9A\u9A6C\u900A \u4F01\u4E1A \u4F5B\u5C71 \u4FE1\u606F \u5065\u5EB7 \u516B\u5366 \u516C\u53F8 \u516C\u76CA \u53F0\u6E7E \u53F0\u7063 \u5546\u57CE \u5546\u5E97 \u5546\u6807 \u5609\u91CC \u5609\u91CC\u5927\u9152\u5E97 \u5728\u7EBF \u5927\u4F17\u6C7D\u8F66 \u5927\u62FF \u5929\u4E3B\u6559 \u5A31\u4E50 \u5BB6\u96FB \u5E7F\u4E1C \u5FAE\u535A \u6148\u5584 \u6211\u7231\u4F60 \u624B\u673A \u62DB\u8058 \u653F\u52A1 \u653F\u5E9C \u65B0\u52A0\u5761 \u65B0\u95FB \u65F6\u5C1A \u66F8\u7C4D \u673A\u6784 \u6DE1\u9A6C\u9521 \u6E38\u620F \u6FB3\u9580 \u70B9\u770B \u79FB\u52A8 \u7EC4\u7EC7\u673A\u6784 \u7F51\u5740 \u7F51\u5E97 \u7F51\u7AD9 \u7F51\u7EDC \u8054\u901A \u8BFA\u57FA\u4E9A \u8C37\u6B4C \u8D2D\u7269 \u901A\u8CA9 \u96C6\u56E2 \u96FB\u8A0A\u76C8\u79D1 \u98DE\u5229\u6D66 \u98DF\u54C1 \u9910\u5385 \u9999\u683C\u91CC\u62C9 \u9999\u6E2F".split(" "), An = /(?:[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF38\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/, wn = /(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26A7\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5-\uDED7\uDEDD-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFC\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDD0C-\uDD3A\uDD3C-\uDD45\uDD47-\uDDFF\uDE70-\uDE74\uDE78-\uDE7C\uDE80-\uDE86\uDE90-\uDEAC\uDEB0-\uDEBA\uDEC0-\uDEC5\uDED0-\uDED9\uDEE0-\uDEE7\uDEF0-\uDEF6])/, Mn = /\uFE0F/, Tn = /\d/, bl = /\s/;
function P0() {
  var n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], e = Y(), t = I(Ie), r = I(ze), i = Y(), s = I(Au), o = [[Tn, r], [An, r], [wn, r], [Mn, r]], l = function() {
    var z = I(ze);
    return z.j = {
      "-": i
    }, z.jr = [].concat(o), z;
  }, a = function(z) {
    var j = l();
    return j.t = z, j;
  };
  B0(e, [["'", I(Fr)], ["{", I(sn)], ["[", I(Pn)], ["<", I(Ln)], ["(", I(_n)], ["}", I(Ft)], ["]", I(on)], [">", I(ln)], [")", I(an)], ["&", I(Nr)], ["*", I(Rr)], ["@", I(un)], ["`", I(Ir)], ["^", I(Pr)], [":", I(zn)], [",", I(Ws)], ["$", I(Lr)], [".", I(dt)], ["=", I(_r)], ["!", I(qs)], ["-", I(zr)], ["%", I(Hr)], ["|", I($r)], ["+", I(jr)], ["#", I(Vr)], ["?", I(Ur)], ['"', I(Js)], ["/", I(st)], [";", I(Gs)], ["~", I(Kr)], ["_", I(Wr)], ["\\", I(Br)]]), S(e, `
`, I(Ks)), oe(e, bl, s), S(s, `
`, Y()), oe(s, bl, s);
  for (var c = 0; c < yl.length; c++)
    vt(e, yl[c], a(We), l);
  var u = l(), d = l(), h = l(), f = l();
  vt(e, "file", u, l), vt(e, "ftp", d, l), vt(e, "http", h, l), vt(e, "mailto", f, l);
  var p = l(), g = I(bn), y = I(Us);
  S(d, "s", p), S(d, ":", g), S(h, "s", p), S(h, ":", g), S(u, ":", g), S(p, ":", g), S(f, ":", y);
  for (var D = l(), R = 0; R < n.length; R++)
    vt(e, n[R], D, l);
  return S(D, ":", g), vt(e, "localhost", a(it), l), oe(e, Tn, t), oe(e, An, r), oe(e, wn, r), oe(e, Mn, r), oe(t, Tn, t), oe(t, An, r), oe(t, wn, r), oe(t, Mn, r), S(t, "-", i), S(r, "-", i), S(i, "-", i), oe(r, Tn, r), oe(r, An, r), oe(r, wn, r), oe(r, Mn, r), oe(i, Tn, r), oe(i, An, r), oe(i, wn, r), oe(i, Mn, r), e.jd = I(qr), e;
}
function L0(n, e) {
  for (var t = _0(e.replace(/[A-Z]/g, function(f) {
    return f.toLowerCase();
  })), r = t.length, i = [], s = 0, o = 0; o < r; ) {
    for (var l = n, a = null, c = 0, u = null, d = -1, h = -1; o < r && (a = vr(l, t[o])); )
      l = a, l.accepts() ? (d = 0, h = 0, u = l) : d >= 0 && (d += t[o].length, h++), c += t[o].length, s += t[o].length, o++;
    s -= d, o -= h, c -= d, i.push({
      t: u.t,
      v: e.substr(s - c, c),
      s: s - c,
      e: s
    });
  }
  return i;
}
function _0(n) {
  for (var e = [], t = n.length, r = 0; r < t; ) {
    var i = n.charCodeAt(r), s = void 0, o = i < 55296 || i > 56319 || r + 1 === t || (s = n.charCodeAt(r + 1)) < 56320 || s > 57343 ? n[r] : n.slice(r, r + 2);
    e.push(o), r += o.length;
  }
  return e;
}
function hr(n) {
  return typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? hr = function(e) {
    return typeof e;
  } : hr = function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, hr(n);
}
var be = {
  defaultProtocol: "http",
  events: null,
  format: Dl,
  formatHref: Dl,
  nl2br: !1,
  tagName: "a",
  target: null,
  rel: null,
  validate: !0,
  truncate: 0,
  className: null,
  attributes: null,
  ignoreTags: []
};
function z0(n) {
  n = n || {}, this.defaultProtocol = "defaultProtocol" in n ? n.defaultProtocol : be.defaultProtocol, this.events = "events" in n ? n.events : be.events, this.format = "format" in n ? n.format : be.format, this.formatHref = "formatHref" in n ? n.formatHref : be.formatHref, this.nl2br = "nl2br" in n ? n.nl2br : be.nl2br, this.tagName = "tagName" in n ? n.tagName : be.tagName, this.target = "target" in n ? n.target : be.target, this.rel = "rel" in n ? n.rel : be.rel, this.validate = "validate" in n ? n.validate : be.validate, this.truncate = "truncate" in n ? n.truncate : be.truncate, this.className = "className" in n ? n.className : be.className, this.attributes = n.attributes || be.attributes, this.ignoreTags = [];
  for (var e = ("ignoreTags" in n) ? n.ignoreTags : be.ignoreTags, t = 0; t < e.length; t++)
    this.ignoreTags.push(e[t].toUpperCase());
}
z0.prototype = {
  resolve: function(e) {
    var t = e.toHref(this.defaultProtocol);
    return {
      formatted: this.get("format", e.toString(), e),
      formattedHref: this.get("formatHref", t, e),
      tagName: this.get("tagName", t, e),
      className: this.get("className", t, e),
      target: this.get("target", t, e),
      rel: this.get("rel", t, e),
      events: this.getObject("events", t, e),
      attributes: this.getObject("attributes", t, e),
      truncate: this.get("truncate", t, e)
    };
  },
  check: function(e) {
    return this.get("validate", e.toString(), e);
  },
  get: function(e, t, r) {
    var i = this[e];
    if (!i)
      return i;
    var s;
    switch (hr(i)) {
      case "function":
        return i(t, r.t);
      case "object":
        return s = r.t in i ? i[r.t] : be[e], typeof s == "function" ? s(t, r.t) : s;
    }
    return i;
  },
  getObject: function(e, t, r) {
    var i = this[e];
    return typeof i == "function" ? i(t, r.t) : i;
  }
};
function Dl(n) {
  return n;
}
function H0(n, e) {
  var t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, r = Object.create(n.prototype);
  for (var i in t)
    r[i] = t[i];
  return r.constructor = e, e.prototype = r, e;
}
function Jr() {
}
Jr.prototype = {
  t: "token",
  isLink: !1,
  toString: function() {
    return this.v;
  },
  toHref: function() {
    return this.toString();
  },
  startIndex: function() {
    return this.tk[0].s;
  },
  endIndex: function() {
    return this.tk[this.tk.length - 1].e;
  },
  toObject: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : be.defaultProtocol;
    return {
      type: this.t,
      value: this.v,
      isLink: this.isLink,
      href: this.toHref(e),
      start: this.startIndex(),
      end: this.endIndex()
    };
  }
};
function Jt(n, e) {
  function t(r, i) {
    this.t = n, this.v = r, this.tk = i;
  }
  return H0(Jr, t, e), t;
}
var wu = Jt("email", {
  isLink: !0
}), cs = Jt("email", {
  isLink: !0,
  toHref: function() {
    return "mailto:" + this.toString();
  }
}), ds = Jt("text"), Mu = Jt("nl"), ut = Jt("url", {
  isLink: !0,
  toHref: function() {
    for (var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : be.defaultProtocol, t = this.tk, r = !1, i = !1, s = [], o = 0; t[o].t === bn; )
      r = !0, s.push(t[o].v), o++;
    for (; t[o].t === st; )
      i = !0, s.push(t[o].v), o++;
    for (; o < t.length; o++)
      s.push(t[o].v);
    return s = s.join(""), r || i || (s = "".concat(e, "://").concat(s)), s;
  },
  hasProtocol: function() {
    return this.tk[0].t === bn;
  }
}), $0 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  MultiToken: Jr,
  Base: Jr,
  createTokenClass: Jt,
  MailtoEmail: wu,
  Email: cs,
  Text: ds,
  Nl: Mu,
  Url: ut
});
function j0() {
  var n = Y(), e = Y(), t = Y(), r = Y(), i = Y(), s = Y(), o = Y(), l = I(ut), a = Y(), c = I(ut), u = I(ut), d = Y(), h = Y(), f = Y(), p = Y(), g = Y(), y = I(ut), D = I(ut), R = I(ut), P = I(ut), z = Y(), j = Y(), Q = Y(), G = Y(), T = Y(), L = Y(), te = I(cs), _e = Y(), ot = I(cs), Ae = I(wu), ne = Y(), ce = Y(), m = Y(), x = Y(), w = I(Mu);
  S(n, Ks, w), S(n, bn, e), S(n, Us, t), S(e, st, r), S(r, st, i), S(n, We, s), S(n, ze, s), S(n, it, l), S(n, Ie, s), S(i, We, u), S(i, ze, u), S(i, Ie, u), S(i, it, u), S(s, dt, o), S(T, dt, L), S(o, We, l), S(o, ze, s), S(o, Ie, s), S(o, it, s), S(L, We, te), S(L, ze, T), S(L, Ie, T), S(L, it, T), S(l, dt, o), S(te, dt, L), S(l, zn, a), S(l, st, u), S(a, Ie, c), S(c, st, u), S(te, zn, _e), S(_e, Ie, ot);
  var M = [Nr, Rr, un, Br, Ir, Pr, Lr, ze, _r, zr, it, Ie, Hr, $r, jr, Vr, bn, st, qr, Kr, We, Wr], F = [Fr, ln, Ft, on, an, zn, Ws, dt, qs, Ln, sn, Pn, _n, Ur, Js, Gs];
  S(u, sn, h), S(u, Pn, f), S(u, Ln, p), S(u, _n, g), S(d, sn, h), S(d, Pn, f), S(d, Ln, p), S(d, _n, g), S(h, Ft, u), S(f, on, u), S(p, ln, u), S(g, an, u), S(y, Ft, u), S(D, on, u), S(R, ln, u), S(P, an, u), S(z, Ft, u), S(j, on, u), S(Q, ln, u), S(G, an, u), K(h, M, y), K(f, M, D), K(p, M, R), K(g, M, P), K(h, F, z), K(f, F, j), K(p, F, Q), K(g, F, G), K(y, M, y), K(D, M, D), K(R, M, R), K(P, M, P), K(y, F, y), K(D, F, D), K(R, F, R), K(P, F, P), K(z, M, y), K(j, M, D), K(Q, M, R), K(G, M, P), K(z, F, z), K(j, F, j), K(Q, F, Q), K(G, F, G), K(u, M, u), K(d, M, u), K(u, F, d), K(d, F, d), S(t, We, Ae), S(t, ze, Ae), S(t, Ie, Ae), S(t, it, Ae), K(Ae, M, Ae), K(Ae, F, ne), K(ne, M, Ae), K(ne, F, ne);
  var W = [Nr, Fr, Rr, Br, Ir, Pr, Ft, Lr, ze, _r, zr, Ie, sn, Hr, $r, jr, Vr, Ur, st, qr, Kr, We, Wr];
  return K(s, W, ce), S(s, un, m), K(l, W, ce), S(l, un, m), K(o, W, ce), K(ce, W, ce), S(ce, un, m), S(ce, dt, x), K(x, W, ce), S(m, We, T), S(m, ze, T), S(m, Ie, T), S(m, it, te), n;
}
function V0(n, e, t) {
  for (var r = t.length, i = 0, s = [], o = []; i < r; ) {
    for (var l = n, a = null, c = null, u = 0, d = null, h = -1; i < r && !(a = vr(l, t[i].t)); )
      o.push(t[i++]);
    for (; i < r && (c = a || vr(l, t[i].t)); )
      a = null, l = c, l.accepts() ? (h = 0, d = l) : h >= 0 && h++, i++, u++;
    if (h < 0)
      for (var f = i - u; f < i; f++)
        o.push(t[f]);
    else {
      o.length > 0 && (s.push(Vi(ds, e, o)), o = []), i -= h, u -= h;
      var p = d.t, g = t.slice(i - u, i);
      s.push(Vi(p, e, g));
    }
  }
  return o.length > 0 && s.push(Vi(ds, e, o)), s;
}
function Vi(n, e, t) {
  var r = t[0].s, i = t[t.length - 1].e, s = e.substr(r, i - r);
  return new n(s, t);
}
var U0 = typeof console < "u" && console && console.warn || function() {
}, ve = {
  scanner: null,
  parser: null,
  pluginQueue: [],
  customProtocols: [],
  initialized: !1
};
function K0(n) {
  if (ve.initialized && U0('linkifyjs: already initialized - will not register custom protocol "'.concat(n, '" until you manually call linkify.init(). To avoid this warning, please register all custom protocols before invoking linkify the first time.')), !/^[a-z-]+$/.test(n))
    throw Error("linkifyjs: protocols containing characters other than a-z or - (hyphen) are not supported");
  ve.customProtocols.push(n);
}
function W0() {
  ve.scanner = {
    start: P0(ve.customProtocols),
    tokens: I0
  }, ve.parser = {
    start: j0(),
    tokens: $0
  };
  for (var n = {
    createTokenClass: Jt
  }, e = 0; e < ve.pluginQueue.length; e++)
    ve.pluginQueue[e][1]({
      scanner: ve.scanner,
      parser: ve.parser,
      utils: n
    });
  ve.initialized = !0;
}
function Tu(n) {
  return ve.initialized || W0(), V0(ve.parser.start, n, L0(ve.scanner.start, n));
}
function Ys(n) {
  for (var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null, t = Tu(n), r = [], i = 0; i < t.length; i++) {
    var s = t[i];
    s.isLink && (!e || s.t === e) && r.push(s.toObject());
  }
  return r;
}
function El(n) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null, t = Tu(n);
  return t.length === 1 && t[0].isLink && (!e || t[0].t === e);
}
function q0(n) {
  return new ye({
    key: new Oe("autolink"),
    appendTransaction: (e, t, r) => {
      const i = e.some((u) => u.docChanged) && !t.doc.eq(r.doc), s = e.some((u) => u.getMeta("preventAutolink"));
      if (!i || s)
        return;
      const { tr: o } = r, l = tp(t.doc, [...e]), { mapping: a } = l;
      if (sp(l).forEach(({ oldRange: u, newRange: d }) => {
        wr(u.from, u.to, t.doc).filter((h) => h.mark.type === n.type).forEach((h) => {
          const f = a.map(h.from), p = a.map(h.to), g = wr(f, p, r.doc).filter((j) => j.mark.type === n.type);
          if (!g.length)
            return;
          const y = g[0], D = t.doc.textBetween(h.from, h.to, void 0, " "), R = r.doc.textBetween(y.from, y.to, void 0, " "), P = El(D), z = El(R);
          P && !z && o.removeMark(y.from, y.to, n.type);
        }), np(r.doc, d, (h) => h.isTextblock).forEach((h) => {
          const f = r.doc.textBetween(h.pos, h.pos + h.node.nodeSize, void 0, " ");
          Ys(f).filter((p) => p.isLink).filter((p) => n.validate ? n.validate(p.value) : !0).map((p) => ({
            ...p,
            from: h.pos + p.start + 1,
            to: h.pos + p.end + 1
          })).filter((p) => {
            const g = d.from >= p.from && d.from <= p.to, y = d.to >= p.from && d.to <= p.to;
            return g || y;
          }).forEach((p) => {
            o.addMark(p.from, p.to, n.type.create({
              href: p.href
            }));
          });
        });
      }), !!o.steps.length)
        return o;
    }
  });
}
function J0(n) {
  return new ye({
    key: new Oe("handleClickLink"),
    props: {
      handleClick: (e, t, r) => {
        var i;
        const s = Va(e.state, n.type.name);
        return ((i = r.target) === null || i === void 0 ? void 0 : i.closest("a")) && s.href ? (window.open(s.href, s.target), !0) : !1;
      }
    }
  });
}
function G0(n) {
  return new ye({
    key: new Oe("handlePasteLink"),
    props: {
      handlePaste: (e, t, r) => {
        const { state: i } = e, { selection: s } = i, { empty: o } = s;
        if (o)
          return !1;
        let l = "";
        r.content.forEach((c) => {
          l += c.textContent;
        });
        const a = Ys(l).find((c) => c.isLink && c.value === l);
        return !l || !a ? !1 : (n.editor.commands.setMark(n.type, {
          href: a.href
        }), !0);
      }
    }
  });
}
const Y0 = Be.create({
  name: "link",
  priority: 1e3,
  keepOnSplit: !1,
  onCreate() {
    this.options.protocols.forEach(K0);
  },
  inclusive() {
    return this.options.autolink;
  },
  addOptions() {
    return {
      openOnClick: !0,
      linkOnPaste: !0,
      autolink: !0,
      protocols: [],
      HTMLAttributes: {
        target: "_blank",
        rel: "noopener noreferrer nofollow",
        class: null
      },
      validate: void 0
    };
  },
  addAttributes() {
    return {
      href: {
        default: null
      },
      target: {
        default: this.options.HTMLAttributes.target
      },
      class: {
        default: this.options.HTMLAttributes.class
      }
    };
  },
  parseHTML() {
    return [
      { tag: 'a[href]:not([href *= "javascript:" i])' }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return [
      "a",
      ee(this.options.HTMLAttributes, n),
      0
    ];
  },
  addCommands() {
    return {
      setLink: (n) => ({ chain: e }) => e().setMark(this.name, n).setMeta("preventAutolink", !0).run(),
      toggleLink: (n) => ({ chain: e }) => e().toggleMark(this.name, n, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run(),
      unsetLink: () => ({ chain: n }) => n().unsetMark(this.name, { extendEmptyMarkRange: !0 }).setMeta("preventAutolink", !0).run()
    };
  },
  addPasteRules() {
    return [
      kt({
        find: (n) => Ys(n).filter((e) => this.options.validate ? this.options.validate(e.value) : !0).filter((e) => e.isLink).map((e) => ({
          text: e.value,
          index: e.start,
          data: e
        })),
        type: this.type,
        getAttributes: (n) => {
          var e;
          return {
            href: (e = n.data) === null || e === void 0 ? void 0 : e.href
          };
        }
      })
    ];
  },
  addProseMirrorPlugins() {
    const n = [];
    return this.options.autolink && n.push(q0({
      type: this.type,
      validate: this.options.validate
    })), this.options.openOnClick && n.push(J0({
      type: this.type
    })), this.options.linkOnPaste && n.push(G0({
      editor: this.editor,
      type: this.type
    })), n;
  }
});
class X0 extends ue {
  constructor() {
    super(...arguments), this.plugin = Y0.configure({
      openOnClick: !1
    }), this.onHandle = "open", this.dialogTemplateId = "rich-text-plugin-dialog-link";
  }
  handle() {
    this.richText.editor.view.state.selection.empty ? this.richText.editor.chain().focus().unsetLink() : this.open();
  }
}
re("rich-text-plugin-handler-link", X0);
class er extends HTMLDialogElement {
  constructor() {
    super(...arguments), this.defaultMode = "editor", this.namedFields = {};
  }
  get richText() {
    return this.closest("rich-text");
  }
  connectedCallback() {
    Array.from(this.querySelectorAll("[name]")).forEach((e) => {
      this.namedFields[e.getAttribute("name")] = e;
    }), this.setDialogStyles();
  }
  attributeChangedCallback(e) {
    this.setDialogStyles();
  }
  setDialogStyles() {
    const e = this.mode || this.defaultMode;
    switch (this.richText.editor.commands.focus(), e) {
      case "fullscreen": {
        this.style.position = "fixed";
        break;
      }
      case "editor": {
        this.style.position = "absolute";
        break;
      }
      case "inline": {
        const i = document.getSelection().anchorNode.parentElement.getBoundingClientRect();
        i ? (this.style.position = "absolute", this.style.right = "unset", this.style.left = `${i.x}px`, this.style.top = `${i.y + i.height}px`) : this.close();
        break;
      }
    }
  }
  setValues() {
  }
  handle(...e) {
  }
}
er.observedAttributes = ["mode"];
class Q0 extends HTMLButtonElement {
  constructor() {
    super(...arguments), this.onclick = () => {
      this.dialog.close(), this.dialog.remove();
    };
  }
  get dialog() {
    return this.closest("dialog");
  }
}
re("rich-text-plugin-dialog-cancel", Q0);
class Z0 extends HTMLButtonElement {
  constructor() {
    super(...arguments), this.onclick = () => {
      this.dialog.close(), this.dialog.setValues(), this.dialog.handle(), this.richText.editor.commands.focus(), this.dialog.remove();
    };
  }
  get dialog() {
    return this.closest("dialog");
  }
  get richText() {
    return this.closest("rich-text");
  }
}
re("rich-text-plugin-dialog-submit", Z0);
function tr(n, e) {
  window.customElements.get(n) || window.customElements.define(n, e, { extends: "dialog" });
}
class ey extends er {
  constructor() {
    super(...arguments), this.mode = "editor";
  }
  setValues() {
    this.href = this.namedFields.href.value;
  }
  handle() {
    this.richText.editor.chain().focus().setLink({ href: this.href, target: "_blank" }).run(), this.richText.editor.chain().selectParentNode().insertContent(" ");
  }
}
tr("rich-text-plugin-dialog-link", ey);
const ty = /(?:^|\s)(!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\))$/, ny = xe.create({
  name: "image",
  addOptions() {
    return {
      inline: !1,
      allowBase64: !1,
      HTMLAttributes: {}
    };
  },
  inline() {
    return this.options.inline;
  },
  group() {
    return this.options.inline ? "inline" : "block";
  },
  draggable: !0,
  addAttributes() {
    return {
      src: {
        default: null
      },
      alt: {
        default: null
      },
      title: {
        default: null
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: this.options.allowBase64 ? "img[src]" : 'img[src]:not([src^="data:"])'
      }
    ];
  },
  renderHTML({ HTMLAttributes: n }) {
    return ["img", ee(this.options.HTMLAttributes, n)];
  },
  addCommands() {
    return {
      setImage: (n) => ({ commands: e }) => e.insertContent({
        type: this.name,
        attrs: n
      })
    };
  },
  addInputRules() {
    return [
      Ua({
        find: ty,
        type: this.type,
        getAttributes: (n) => {
          const [, , e, t, r] = n;
          return { src: t, alt: e, title: r };
        }
      })
    ];
  }
});
class ry extends ue {
  constructor() {
    super(...arguments), this.plugin = ny, this.onHandle = "open", this.dialogTemplateId = "rich-text-plugin-dialog-image";
  }
  handle() {
    this.open();
  }
}
re("rich-text-plugin-handler-image", ry);
class iy extends er {
  constructor() {
    super(...arguments), this.mode = "editor";
  }
  setValues() {
    this.src = this.namedFields.src.value, this.alt = this.namedFields.alt.value;
  }
  upload() {
    const e = this.namedFields.src.files[0];
    this.previewUrl = window.URL.createObjectURL(e);
  }
  handle() {
    this.upload(), this.richText.editor.chain().focus().setImage({ src: this.previewUrl, alt: this.alt }).run();
  }
}
tr("rich-text-plugin-dialog-image", iy);
const sy = /^(https?:\/\/)?(www\.|music\.)?(youtube\.com|youtu\.be)(.+)?$/, oy = /^(https?:\/\/)?(www\.|music\.)?(youtube\.com|youtu\.be)(.+)?$/g, ly = (n) => n.match(sy), xl = (n) => n ? "https://www.youtube-nocookie.com/embed/" : "https://www.youtube.com/embed/", ay = (n) => {
  const { url: e, controls: t, nocookie: r, startAt: i } = n;
  if (e.includes("/embed/"))
    return e;
  if (e.includes("youtu.be")) {
    const c = e.split("/").pop();
    return c ? `${xl(r)}${c}` : null;
  }
  const o = /v=([-\w]+)/gm.exec(e);
  if (!o || !o[1])
    return null;
  let l = `${xl(r)}${o[1]}`;
  const a = [];
  return t || a.push("controls=0"), i && a.push(`start=${i}`), a.length && (l += `?${a.join("&")}`), l;
}, uy = xe.create({
  name: "youtube",
  addOptions() {
    return {
      addPasteHandler: !0,
      allowFullscreen: !1,
      controls: !0,
      height: 480,
      HTMLAttributes: {},
      inline: !1,
      nocookie: !1,
      width: 640
    };
  },
  inline() {
    return this.options.inline;
  },
  group() {
    return this.options.inline ? "inline" : "block";
  },
  draggable: !0,
  addAttributes() {
    return {
      src: {
        default: null
      },
      start: {
        default: 0
      },
      width: {
        default: this.options.width
      },
      height: {
        default: this.options.height
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: "div[data-youtube-video] iframe"
      }
    ];
  },
  addCommands() {
    return {
      setYoutubeVideo: (n) => ({ commands: e }) => ly(n.src) ? e.insertContent({
        type: this.name,
        attrs: n
      }) : !1
    };
  },
  addPasteRules() {
    return this.options.addPasteHandler ? [
      lp({
        find: oy,
        type: this.type,
        getAttributes: (n) => ({ src: n.input })
      })
    ] : [];
  },
  renderHTML({ HTMLAttributes: n }) {
    const e = ay({
      url: n.src,
      controls: this.options.controls,
      nocookie: this.options.nocookie,
      startAt: n.start || 0
    });
    return n.src = e, [
      "div",
      { "data-youtube-video": "" },
      [
        "iframe",
        ee(this.options.HTMLAttributes, {
          width: this.options.width,
          height: this.options.height,
          allowfullscreen: this.options.allowFullscreen
        }, n)
      ]
    ];
  }
});
class cy extends ue {
  constructor() {
    super(...arguments), this.plugin = uy, this.onHandle = "open", this.dialogTemplateId = "rich-text-plugin-dialog-youtube";
  }
  handle() {
    this.open();
  }
}
re("rich-text-plugin-handler-youtube", cy);
class dy extends er {
  constructor() {
    super(...arguments), this.mode = "editor";
  }
  setValues() {
    this.src = this.namedFields.src.value;
  }
  handle() {
    this.richText.editor.chain().focus().setYoutubeVideo({ src: this.src }).run();
  }
}
tr("rich-text-plugin-dialog-youtube", dy);
function hy(n) {
  var e;
  const { char: t, allowSpaces: r, allowedPrefixes: i, startOfLine: s, $position: o } = n, l = op(t), a = new RegExp(`\\s${l}$`), c = s ? "^" : "", u = r ? new RegExp(`${c}${l}.*?(?=\\s${l}|$)`, "gm") : new RegExp(`${c}(?:^)?${l}[^\\s${l}]*`, "gm"), d = ((e = o.nodeBefore) === null || e === void 0 ? void 0 : e.isText) && o.nodeBefore.text;
  if (!d)
    return null;
  const h = o.pos - d.length, f = Array.from(d.matchAll(u)).pop();
  if (!f || f.input === void 0 || f.index === void 0)
    return null;
  const p = f.input.slice(Math.max(0, f.index - 1), f.index), g = new RegExp(`^[${i == null ? void 0 : i.join("")}\0]?$`).test(p);
  if (i !== null && !g)
    return null;
  const y = h + f.index;
  let D = y + f[0].length;
  return r && a.test(d.slice(D - 1, D + 1)) && (f[0] += " ", D += 1), y < o.pos && D >= o.pos ? {
    range: {
      from: y,
      to: D
    },
    query: f[0].slice(t.length),
    text: f[0]
  } : null;
}
const fy = new Oe("suggestion");
function py({ pluginKey: n = fy, editor: e, char: t = "@", allowSpaces: r = !1, allowedPrefixes: i = [" "], startOfLine: s = !1, decorationTag: o = "span", decorationClass: l = "suggestion", command: a = () => null, items: c = () => [], render: u = () => ({}), allow: d = () => !0 }) {
  let h;
  const f = u == null ? void 0 : u(), p = new ye({
    key: n,
    view() {
      return {
        update: async (g, y) => {
          var D, R, P, z, j, Q, G;
          const T = (D = this.key) === null || D === void 0 ? void 0 : D.getState(y), L = (R = this.key) === null || R === void 0 ? void 0 : R.getState(g.state), te = T.active && L.active && T.range.from !== L.range.from, _e = !T.active && L.active, ot = T.active && !L.active, Ae = !_e && !ot && T.query !== L.query, ne = _e || te, ce = Ae && !te, m = ot || te;
          if (!ne && !ce && !m)
            return;
          const x = m && !ne ? T : L, w = g.dom.querySelector(`[data-decoration-id="${x.decorationId}"]`);
          h = {
            editor: e,
            range: x.range,
            query: x.query,
            text: x.text,
            items: [],
            command: (M) => {
              a({
                editor: e,
                range: x.range,
                props: M
              });
            },
            decorationNode: w,
            clientRect: w ? () => {
              var M;
              const { decorationId: F } = (M = this.key) === null || M === void 0 ? void 0 : M.getState(e.state), W = g.dom.querySelector(`[data-decoration-id="${F}"]`);
              return (W == null ? void 0 : W.getBoundingClientRect()) || null;
            } : null
          }, ne && ((P = f == null ? void 0 : f.onBeforeStart) === null || P === void 0 || P.call(f, h)), ce && ((z = f == null ? void 0 : f.onBeforeUpdate) === null || z === void 0 || z.call(f, h)), (ce || ne) && (h.items = await c({
            editor: e,
            query: x.query
          })), m && ((j = f == null ? void 0 : f.onExit) === null || j === void 0 || j.call(f, h)), ce && ((Q = f == null ? void 0 : f.onUpdate) === null || Q === void 0 || Q.call(f, h)), ne && ((G = f == null ? void 0 : f.onStart) === null || G === void 0 || G.call(f, h));
        },
        destroy: () => {
          var g;
          !h || (g = f == null ? void 0 : f.onExit) === null || g === void 0 || g.call(f, h);
        }
      };
    },
    state: {
      init() {
        return {
          active: !1,
          range: {
            from: 0,
            to: 0
          },
          query: null,
          text: null,
          composing: !1
        };
      },
      apply(g, y, D, R) {
        const { isEditable: P } = e, { composing: z } = e.view, { selection: j } = g, { empty: Q, from: G } = j, T = { ...y };
        if (T.composing = z, P && (Q || e.view.composing)) {
          (G < y.range.from || G > y.range.to) && !z && !y.composing && (T.active = !1);
          const L = hy({
            char: t,
            allowSpaces: r,
            allowedPrefixes: i,
            startOfLine: s,
            $position: j.$from
          }), te = `id_${Math.floor(Math.random() * 4294967295)}`;
          L && d({ editor: e, state: R, range: L.range }) ? (T.active = !0, T.decorationId = y.decorationId ? y.decorationId : te, T.range = L.range, T.query = L.query, T.text = L.text) : T.active = !1;
        } else
          T.active = !1;
        return T.active || (T.decorationId = null, T.range = { from: 0, to: 0 }, T.query = null, T.text = null), T;
      }
    },
    props: {
      handleKeyDown(g, y) {
        var D;
        const { active: R, range: P } = p.getState(g.state);
        return R && ((D = f == null ? void 0 : f.onKeyDown) === null || D === void 0 ? void 0 : D.call(f, { view: g, event: y, range: P })) || !1;
      },
      decorations(g) {
        const { active: y, range: D, decorationId: R } = p.getState(g);
        return y ? se.create(g.doc, [
          we.inline(D.from, D.to, {
            nodeName: o,
            class: l,
            "data-decoration-id": R
          })
        ]) : null;
      }
    }
  });
  return p;
}
const gy = (n) => xe.create({
  name: n,
  addOptions() {
    return {
      HTMLAttributes: {},
      renderLabel({ options: e, node: t }) {
        var r;
        return `${e.suggestion.char}${(r = t.attrs.label) != null ? r : t.attrs.id}`;
      },
      suggestion: {
        char: "@",
        command: ({ editor: e, range: t, props: r }) => {
          var o, l;
          const i = e.view.state.selection.$to.nodeAfter;
          ((o = i == null ? void 0 : i.text) == null ? void 0 : o.startsWith(" ")) && (t.to += 1), e.chain().focus().insertContentAt(t, [
            {
              type: this.name,
              attrs: r
            },
            {
              type: "text",
              text: " "
            }
          ]).run(), (l = window.getSelection()) == null || l.collapseToEnd();
        },
        allow: ({ state: e, range: t }) => {
          const r = e.doc.resolve(t.from), i = e.schema.nodes[this.name];
          return !!r.parent.type.contentMatch.matchType(i);
        }
      }
    };
  },
  group: "inline",
  inline: !0,
  selectable: !1,
  atom: !0,
  addAttributes() {
    return {
      rel: {
        default: null,
        parseHTML: (e) => e.getAttribute("rel"),
        renderHTML: (e) => e.rel ? {
          rel: e.rel
        } : {
          rel: "noopener noreferrer nofollow"
        }
      },
      href: {
        default: null,
        parseHTML: (e) => e.getAttribute("href"),
        renderHTML: (e) => e.href ? {
          href: e.href
        } : {}
      }
    };
  },
  parseHTML() {
    return [
      {
        tag: `a[data-type="${this.name}"]`
      }
    ];
  },
  renderHTML({ node: e, HTMLAttributes: t }) {
    return [
      "a",
      ee(this.options.HTMLAttributes, t),
      this.options.renderLabel({
        options: this.options,
        node: e
      })
    ];
  },
  renderText({ node: e }) {
    return this.options.renderLabel({
      options: this.options,
      node: e
    });
  },
  addKeyboardShortcuts() {
    return {
      Backspace: () => this.editor.commands.command(({ tr: e, state: t }) => {
        let r = !1;
        const { selection: i } = t, { empty: s, anchor: o } = i;
        return s ? (t.doc.nodesBetween(o - 1, o, (l, a) => {
          if (l.type.name === this.name)
            return r = !0, e.insertText(this.options.suggestion.char || "", a, a + l.nodeSize), !1;
        }), r) : !1;
      })
    };
  },
  addProseMirrorPlugins() {
    return [
      py({
        editor: this.editor,
        ...this.options.suggestion
      })
    ];
  }
});
function Ou(n) {
  const e = gy(n.name);
  return class extends oi {
    constructor() {
      super(...arguments), this.plugin = e.configure({
        HTMLAttributes: {
          class: n.class
        },
        suggestion: {
          char: n.char,
          pluginKey: new Oe(n.key),
          items: async (r) => await this.getItems(r.query.toLowerCase()),
          render: () => ({
            onStart: (r) => {
              this.handle(r);
            },
            onExit: () => {
              this.dialog.close();
            },
            onUpdate: async (r) => {
              this.dialog.renderSelectMenuOptions(r.items);
            },
            onKeyDown: (r) => {
              var o;
              const i = this.dialog.getSelectedItemIndex(), s = this.dialog.listContainer.childElementCount;
              switch (r.event.key) {
                case "ArrowDown":
                  return r.event.preventDefault(), i === s - 1 ? this.dialog.setSelectedItem(0) : this.dialog.setSelectedItem(i + 1), !0;
                case "ArrowUp":
                  return r.event.preventDefault(), i === 0 ? this.dialog.setSelectedItem(s - 1) : this.dialog.setSelectedItem(i - 1), !0;
                case "Enter": {
                  const l = this.richText.editor.view.state.selection.$to.nodeAfter, a = (o = l == null ? void 0 : l.text) == null ? void 0 : o.startsWith(" "), { url: c, label: u } = this.dialog.getSelectedItem().dataset, d = {
                    url: c,
                    label: u
                  };
                  return a && (r.range.to += 1), this.insert(r.range, d), !0;
                }
                case "Escape":
                  return this.close(), !1;
              }
              return !1;
            }
          })
        }
      });
    }
    async getItems(r) {
      return [{}];
    }
    handle(r) {
      this.open(), this.dialog.renderSelectMenuOptions(r.items);
    }
    insert(r, i) {
      var o;
      const s = () => [
        {
          type: n.name,
          attrs: {
            href: i.url,
            label: i.label
          }
        },
        {
          type: "text",
          text: " "
        }
      ];
      this.richText.editor.chain().focus().insertContentAt(r, s()).run(), this.close(), (o = window.getSelection()) == null || o.collapseToEnd();
    }
  };
}
class ui extends Ou({
  key: "mention",
  name: "mention",
  char: "@",
  class: "mention"
}) {
  constructor() {
    super(...arguments), this.dialogTemplateId = "rich-text-plugin-dialog-mention";
  }
  static async getItems(e) {
    return [{}];
  }
  async getItems(e) {
    return ui.getItems(e);
  }
}
Zn("rich-text-plugin-mention", ui);
function vu() {
  return class extends er {
    constructor() {
      super(...arguments), this.mode = "inline";
    }
    get listContainer() {
      return this.namedFields.options;
    }
    renderSelectMenuOptions(e) {
      this.listContainer.innerHTML = "", e.forEach((t, r) => {
        const i = document.createElement("button");
        i.innerText = t.label, i.tabIndex = -1, i.addEventListener("click", () => {
          this.richText.editor.commands.enter();
        });
        const s = document.createElement("li");
        s.dataset.url = t.url, s.dataset.label = t.label, s.appendChild(i), r === 0 && this.setSelectedItem(s), this.listContainer.appendChild(s);
      });
    }
    getSelectedItem() {
      return Array.from(this.listContainer.children).find((t) => t.hasAttribute("data-selected"));
    }
    getSelectedItemIndex() {
      return Array.from(this.listContainer.children).findIndex((t) => t.hasAttribute("data-selected"));
    }
    setSelectedItem(e) {
      let t;
      typeof e == "number" ? t = this.namedFields.options.children.item(e) : t = e, this.listContainer.querySelectorAll("li").forEach((r) => {
        r !== e && r.removeAttribute("data-selected");
      }), t.setAttribute("data-selected", "");
    }
  };
}
class my extends vu() {
  constructor() {
    super(...arguments), this.mode = "inline";
  }
}
tr("rich-text-plugin-dialog-mention", my);
class ci extends Ou({
  key: "hashtag",
  name: "hashtag",
  char: "#",
  class: "hashtag"
}) {
  constructor() {
    super(...arguments), this.dialogTemplateId = "rich-text-plugin-dialog-hashtag";
  }
  static async getItems(e) {
    return [{}];
  }
  async getItems(e) {
    return ci.getItems(e);
  }
}
Zn("rich-text-plugin-hashtag", ci);
class yy extends vu() {
  constructor() {
    super(...arguments), this.mode = "inline";
  }
}
tr("rich-text-plugin-dialog-hashtag", yy);
ui.getItems = async (n) => [
  {
    name: "johnDoe",
    label: "John Doe",
    url: "@johnDoe"
  },
  {
    name: "markwallace",
    label: "Mark Wallace",
    url: "@markwallace"
  },
  {
    name: "annapurna",
    label: "Anna Purna",
    url: "@annapurna"
  }
].filter((t) => t.name.startsWith(n));
ci.getItems = async (n) => [
  {
    label: "johnDoe",
    url: "#johnDoe"
  },
  {
    label: "markwallace",
    url: "#markwallace"
  },
  {
    label: "annapurna",
    url: "#annapurna"
  }
].filter((t) => t.label.startsWith(n));
export {
  jp as BoldPlugin,
  A0 as CodeBlockPlugin,
  ig as CodePlugin,
  R0 as DropCursorPlugin,
  O0 as HardBreakPlugin,
  ci as HashtagPlugin,
  yy as HashtagPluginDialog,
  Bp as HeadingPlugin,
  hg as HighlightPlugin,
  Op as HistoryPlugin,
  Np as HistoryPluginRedo,
  vp as HistoryPluginUndo,
  M0 as HorizontalRulePlugin,
  ry as ImagePlugin,
  iy as ImagePluginDialog,
  Jp as ItalicPlugin,
  X0 as LinkPlugin,
  ey as LinkPluginDialog,
  ui as MentionPlugin,
  my as MentionPluginDialog,
  bg as OrderedListPlugin,
  Pp as ParagraphPlugin,
  Wa as RichText,
  Dp as RichTextContent,
  bp as RichTextToolbar,
  eg as StrikePlugin,
  ag as SubscriptPlugin,
  og as SuperscriptPlugin,
  Yp as UnderlinePlugin,
  gg as UnorderedListPlugin,
  cy as YouTubePlugin,
  dy as YouTubePluginDialog
};
