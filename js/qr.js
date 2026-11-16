/* Minimal QR Code encoder (byte mode, versions 1–40, ECC L/M/Q/H).
   Algorithm follows ISO/IEC 18004. Exposes window.QR.encode(text, ecl) → { size, get(x,y) } */
(function (root) {
  'use strict';
  var ECC_PER_BLOCK = {
    L: [-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    M: [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
    Q: [-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
    H: [-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
  };
  var NUM_BLOCKS = {
    L: [-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
    M: [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
    Q: [-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
    H: [-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
  };
  var FORMAT_BITS = { L: 1, M: 0, Q: 3, H: 2 };

  function rawModules(ver) {
    var r = (16 * ver + 128) * ver + 64;
    if (ver >= 2) {
      var n = Math.floor(ver / 7) + 2;
      r -= (25 * n - 10) * n - 55;
      if (ver >= 7) r -= 36;
    }
    return r;
  }
  function dataCodewords(ver, ecl) {
    return Math.floor(rawModules(ver) / 8) - ECC_PER_BLOCK[ecl][ver] * NUM_BLOCKS[ecl][ver];
  }
  function getBit(x, i) { return ((x >>> i) & 1) !== 0; }

  // GF(256) Reed–Solomon
  function rsMul(x, y) {
    var z = 0;
    for (var i = 7; i >= 0; i--) {
      z = (z << 1) ^ ((z >>> 7) * 0x11D);
      z ^= ((y >>> i) & 1) * x;
    }
    return z & 0xFF;
  }
  function rsDivisor(degree) {
    var result = [];
    for (var i = 0; i < degree - 1; i++) result.push(0);
    result.push(1);
    var root = 1;
    for (var i2 = 0; i2 < degree; i2++) {
      for (var j = 0; j < result.length; j++) {
        result[j] = rsMul(result[j], root);
        if (j + 1 < result.length) result[j] ^= result[j + 1];
      }
      root = rsMul(root, 0x02);
    }
    return result;
  }
  function rsRemainder(data, divisor) {
    var result = divisor.map(function () { return 0; });
    data.forEach(function (b) {
      var factor = b ^ result.shift();
      result.push(0);
      divisor.forEach(function (coef, i) { result[i] ^= rsMul(coef, factor); });
    });
    return result;
  }

  function utf8Bytes(str) {
    if (typeof TextEncoder !== 'undefined') return Array.from(new TextEncoder().encode(str));
    var s = unescape(encodeURIComponent(str)), out = [];
    for (var i = 0; i < s.length; i++) out.push(s.charCodeAt(i));
    return out;
  }

  function encode(text, ecl) {
    ecl = ecl || 'M';
    var bytes = utf8Bytes(text);
    var ver, cap;
    for (ver = 1; ver <= 40; ver++) {
      cap = dataCodewords(ver, ecl) * 8;
      var ccBits = ver < 10 ? 8 : 16;
      if (4 + ccBits + bytes.length * 8 <= cap) break;
    }
    if (ver > 40) throw new Error('Data too long for a QR code');

    // Build bit stream
    var bb = [];
    function append(val, len) { for (var i = len - 1; i >= 0; i--) bb.push((val >>> i) & 1); }
    append(4, 4);
    append(bytes.length, ver < 10 ? 8 : 16);
    bytes.forEach(function (b) { append(b, 8); });
    append(0, Math.min(4, cap - bb.length));
    append(0, (8 - bb.length % 8) % 8);
    for (var pad = 0xEC; bb.length < cap; pad ^= 0xEC ^ 0x11) append(pad, 8);
    var data = [];
    for (var k = 0; k < bb.length; k += 8) {
      var v = 0;
      for (var t = 0; t < 8; t++) v = (v << 1) | bb[k + t];
      data.push(v);
    }

    // ECC + interleave
    var numBlocks = NUM_BLOCKS[ecl][ver], blockEcc = ECC_PER_BLOCK[ecl][ver];
    var rawCw = Math.floor(rawModules(ver) / 8);
    var numShort = numBlocks - rawCw % numBlocks;
    var shortLen = Math.floor(rawCw / numBlocks);
    var blocks = [], div = rsDivisor(blockEcc);
    for (var i = 0, p = 0; i < numBlocks; i++) {
      var dat = data.slice(p, p + shortLen - blockEcc + (i < numShort ? 0 : 1));
      p += dat.length;
      var ecc = rsRemainder(dat, div);
      if (i < numShort) dat.push(0);
      blocks.push(dat.concat(ecc));
    }
    var all = [];
    for (var c = 0; c < blocks[0].length; c++) {
      blocks.forEach(function (blk, j) {
        if (c !== shortLen - blockEcc || j >= numShort) all.push(blk[c]);
      });
    }

    var size = ver * 4 + 17;
    var mods = [], fn = [];
    for (var y = 0; y < size; y++) { mods.push(new Array(size).fill(false)); fn.push(new Array(size).fill(false)); }
    function setF(x, y, d) { mods[y][x] = d; fn[y][x] = true; }

    // Function patterns
    for (var q = 0; q < size; q++) { setF(6, q, q % 2 === 0); setF(q, 6, q % 2 === 0); }
    function finder(x, y) {
      for (var dy = -4; dy <= 4; dy++) for (var dx = -4; dx <= 4; dx++) {
        var dist = Math.max(Math.abs(dx), Math.abs(dy)), xx = x + dx, yy = y + dy;
        if (xx >= 0 && xx < size && yy >= 0 && yy < size) setF(xx, yy, dist !== 2 && dist !== 4);
      }
    }
    finder(3, 3); finder(size - 4, 3); finder(3, size - 4);
    var align = [];
    if (ver > 1) {
      var na = Math.floor(ver / 7) + 2;
      var step = Math.floor((ver * 8 + na * 3 + 5) / (na * 4 - 4)) * 2;
      align = [6];
      for (var pos = size - 7; align.length < na; pos -= step) align.splice(1, 0, pos);
    }
    var nA = align.length;
    for (var a = 0; a < nA; a++) for (var b2 = 0; b2 < nA; b2++) {
      if ((a === 0 && b2 === 0) || (a === 0 && b2 === nA - 1) || (a === nA - 1 && b2 === 0)) continue;
      for (var dy2 = -2; dy2 <= 2; dy2++) for (var dx2 = -2; dx2 <= 2; dx2++)
        setF(align[a] + dx2, align[b2] + dy2, Math.max(Math.abs(dx2), Math.abs(dy2)) !== 1);
    }
    function drawFormat(mask) {
      var d = FORMAT_BITS[ecl] << 3 | mask, rem = d;
      for (var i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
      var bits = (d << 10 | rem) ^ 0x5412;
      for (var i1 = 0; i1 <= 5; i1++) setF(8, i1, getBit(bits, i1));
      setF(8, 7, getBit(bits, 6)); setF(8, 8, getBit(bits, 7)); setF(7, 8, getBit(bits, 8));
      for (var i2 = 9; i2 < 15; i2++) setF(14 - i2, 8, getBit(bits, i2));
      for (var i3 = 0; i3 < 8; i3++) setF(size - 1 - i3, 8, getBit(bits, i3));
      for (var i4 = 8; i4 < 15; i4++) setF(8, size - 15 + i4, getBit(bits, i4));
      setF(8, size - 8, true);
    }
    drawFormat(0);
    if (ver >= 7) {
      var rem = ver;
      for (var r = 0; r < 12; r++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
      var vbits = ver << 12 | rem;
      for (var vi = 0; vi < 18; vi++) {
        var bit = getBit(vbits, vi), aa = size - 11 + vi % 3, bb2 = Math.floor(vi / 3);
        setF(aa, bb2, bit); setF(bb2, aa, bit);
      }
    }

    // Codewords (zig-zag)
    var bi = 0;
    for (var right = size - 1; right >= 1; right -= 2) {
      if (right === 6) right = 5;
      for (var vert = 0; vert < size; vert++) for (var j2 = 0; j2 < 2; j2++) {
        var x = right - j2, upward = ((right + 1) & 2) === 0, yy2 = upward ? size - 1 - vert : vert;
        if (!fn[yy2][x] && bi < all.length * 8) {
          mods[yy2][x] = getBit(all[bi >>> 3], 7 - (bi & 7));
          bi++;
        }
      }
    }

    function maskFn(m, x, y) {
      switch (m) {
        case 0: return (x + y) % 2 === 0;
        case 1: return y % 2 === 0;
        case 2: return x % 3 === 0;
        case 3: return (x + y) % 3 === 0;
        case 4: return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
        case 5: return x * y % 2 + x * y % 3 === 0;
        case 6: return (x * y % 2 + x * y % 3) % 2 === 0;
        default: return ((x + y) % 2 + x * y % 3) % 2 === 0;
      }
    }
    function applyMask(m) {
      for (var y = 0; y < size; y++) for (var x = 0; x < size; x++)
        if (!fn[y][x] && maskFn(m, x, y)) mods[y][x] = !mods[y][x];
    }
    function penalty() {
      var res = 0, x, y, run, dark = 0;
      for (y = 0; y < size; y++) {
        run = 1;
        for (x = 1; x < size; x++) {
          if (mods[y][x] === mods[y][x - 1]) { run++; if (run === 5) res += 3; else if (run > 5) res++; }
          else run = 1;
        }
      }
      for (x = 0; x < size; x++) {
        run = 1;
        for (y = 1; y < size; y++) {
          if (mods[y][x] === mods[y - 1][x]) { run++; if (run === 5) res += 3; else if (run > 5) res++; }
          else run = 1;
        }
      }
      for (y = 0; y < size - 1; y++) for (x = 0; x < size - 1; x++) {
        var c = mods[y][x];
        if (c === mods[y][x + 1] && c === mods[y + 1][x] && c === mods[y + 1][x + 1]) res += 3;
      }
      var pat1 = [true, false, true, true, true, false, true, false, false, false, false];
      var pat2 = pat1.slice().reverse();
      function matchAt(get) {
        var m1 = true, m2 = true;
        for (var k = 0; k < 11; k++) { var v = get(k); if (v !== pat1[k]) m1 = false; if (v !== pat2[k]) m2 = false; }
        return (m1 ? 1 : 0) + (m2 ? 1 : 0);
      }
      for (y = 0; y < size; y++) for (x = 0; x <= size - 11; x++)
        res += 40 * matchAt(function (k) { return mods[y][x + k]; });
      for (x = 0; x < size; x++) for (y = 0; y <= size - 11; y++)
        res += 40 * matchAt(function (k) { return mods[y + k][x]; });
      for (y = 0; y < size; y++) for (x = 0; x < size; x++) if (mods[y][x]) dark++;
      var total = size * size;
      var kk = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
      res += Math.max(0, kk) * 10;
      return res;
    }

    var best = 0, minP = Infinity;
    for (var m = 0; m < 8; m++) {
      applyMask(m); drawFormat(m);
      var pen = penalty();
      if (pen < minP) { minP = pen; best = m; }
      applyMask(m);
    }
    applyMask(best); drawFormat(best);

    return {
      size: size, version: ver,
      get: function (x, y) { return x >= 0 && x < size && y >= 0 && y < size && mods[y][x]; }
    };
  }

  root.QR = { encode: encode };
  if (typeof module !== 'undefined') module.exports = root.QR;
})(typeof window !== 'undefined' ? window : globalThis);
