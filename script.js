(() => {
'use strict';
const doc = document, root = doc.documentElement;
root.classList.add('js');
const $ = (s, r = doc) => r.querySelector(s);
const $$ = (s, r = doc) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t * t * (3 - 2 * t);

function mulberry(a) {
  return () => {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const hex = c => { const n = parseInt(c.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const mix = (a, b, t) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(',')})`; };
const C = n => getComputedStyle(root).getPropertyValue('--sc-' + n).trim();
const rgba = (c, a) => { const [r, g, b] = hex(c); return `rgba(${r},${g},${b},${a})`; };

/* ---------- موارد مشتركة: حبيبة وتوهج ---------- */
const noise = (() => {
  const c = doc.createElement('canvas'); c.width = c.height = 192;
  const x = c.getContext('2d'), d = x.createImageData(192, 192), r = mulberry(99);
  for (let i = 0; i < d.data.length; i += 4) { const v = 90 + r() * 120 | 0; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  x.putImageData(d, 0, 0); return c;
})();
const glow = (() => {
  const c = doc.createElement('canvas'); c.width = c.height = 96;
  const x = c.getContext('2d'), g = x.createRadialGradient(48, 48, 0, 48, 48, 48);
  g.addColorStop(0, 'rgba(255,214,150,.85)'); g.addColorStop(.35, 'rgba(255,196,120,.28)'); g.addColorStop(1, 'rgba(255,190,110,0)');
  x.fillStyle = g; x.fillRect(0, 0, 96, 96); return c;
})();

/* ---------- ألوان المشاهد ---------- */
const PAL = Object.fromEntries(['dusk', 'morning', 'night', 'dawn'].map(n => [n, {
  sky: [C(`pal-${n}-sky0`), C(`pal-${n}-sky1`), C(`pal-${n}-sky2`)],
  far: C(`pal-${n}-far`), b1: C(`pal-${n}-b1`), b2: C(`pal-${n}-b2`), unlit: C(`pal-${n}-unlit`), lit: C(`pal-${n}-lit`),
  haze: C(`pal-${n}-haze`), glow: +C(`pal-${n}-glow`), hazeA: +C(`pal-${n}-hazea`), stars: +C(`pal-${n}-stars`)
}]));

/* ---------- مشهد الواجهة السكنية ---------- */
function buildFacade(w, h, seed) {
  const r = mulberry(seed), s = h / 520, far = [], near = [];
  let x = -20 * s;
  while (x < w) { const bw = (60 + r() * 110) * s; far.push({ x, w: bw, h: h * (.34 + r() * .36) }); x += bw + r() * 10 * s; }
  x = -30 * s;
  let keepBest = null;
  while (x < w + 30) {
    const bw = (120 + r() * 110) * s, bh = h * (.5 + r() * .4);
    const b = { x, w: bw, h: bh, tone: r(), wins: [] };
    const ww = 15 * s, wh = 22 * s, gx = 13 * s, gy = 17 * s, mx = 14 * s, my = 26 * s;
    const cols = Math.max(1, Math.floor((bw - 2 * mx + gx) / (ww + gx)));
    const rows = Math.max(1, Math.floor((bh - my - 20 * s + gy) / (wh + gy)));
    const ox = (bw - (cols * (ww + gx) - gx)) / 2;
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
      const win = { x: ox + j * (ww + gx), y: my + i * (wh + gy), w: ww, h: wh, r: r(), k: r(), ph: r() * 6.28, curt: r() < .3 };
      b.wins.push(win);
      const cx = x + win.x, cy = h - bh + win.y;
      const score = Math.abs(cx - w * .62) + Math.abs(cy - h * .5) * .8;
      if (!keepBest || score < keepBest.score) keepBest = { win, score };
    }
    near.push(b); x += bw + r() * 8 * s;
  }
  if (keepBest) keepBest.win.keep = true;
  const stars = Array.from({ length: 70 }, () => ({ x: r() * w, y: r() * h * .55, a: .25 + r() * .6, k: r() * 6 }));
  return { far, near, stars, s };
}

function drawFacade(ctx, w, h, t, st, L) {
  const P = PAL[st.pal];
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, P.sky[0]); g.addColorStop(.55, P.sky[1]); g.addColorStop(1, P.sky[2]);
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  if (P.stars) for (const s of L.stars) { ctx.globalAlpha = s.a * (.7 + .3 * Math.sin(t * .001 + s.k)); ctx.fillStyle = C('facade-01'); ctx.fillRect(s.x, s.y, 1.2, 1.2); }
  ctx.globalAlpha = 1;
  const px = st.px * 14 * L.s;
  ctx.save(); ctx.translate(px * .45, 0);
  ctx.fillStyle = P.far; for (const b of L.far) ctx.fillRect(b.x, h - b.h, b.w, b.h);
  ctx.restore();
  ctx.save(); ctx.translate(px, 0);
  const level = st.level;
  for (const b of L.near) {
    ctx.fillStyle = mix(P.b1, P.b2, b.tone); ctx.fillRect(b.x, h - b.h, b.w, b.h);
    ctx.fillStyle = rgba(C('facade-02'), .18); ctx.fillRect(b.x + b.w - 3 * L.s, h - b.h, 3 * L.s, b.h);
  }
  for (const b of L.near) {
    for (const w_ of b.wins) {
      const wx = b.x + w_.x, wy = h - b.h + w_.y;
      let on = clamp((level - w_.r) * 7);
      if (st.keep && w_.keep) on = 1;
      const fl = reduce ? 1 : .9 + .1 * Math.sin(t * .0015 * (1 + w_.k) + w_.ph);
      on *= fl;
      ctx.globalAlpha = 1; ctx.fillStyle = P.unlit; ctx.fillRect(wx, wy, w_.w, w_.h);
      if (on > .02) {
        ctx.globalAlpha = on; ctx.fillStyle = P.lit; ctx.fillRect(wx, wy, w_.w, w_.h);
        if (w_.curt) { ctx.globalAlpha = on * .32; ctx.fillStyle = C('facade-03'); ctx.fillRect(wx, wy, w_.w, w_.h * .46); }
      }
    }
  }
  ctx.globalCompositeOperation = 'lighter';
  for (const b of L.near) for (const w_ of b.wins) {
    let on = clamp((level - w_.r) * 7);
    if (st.keep && w_.keep) on = 1;
    if (on < .05) continue;
    const fl = reduce ? 1 : .9 + .1 * Math.sin(t * .0015 * (1 + w_.k) + w_.ph);
    const gs = w_.w * (w_.keep && st.keep ? 9 : 5.2);
    ctx.globalAlpha = on * fl * P.glow * (w_.keep && st.keep ? 1.2 : .7);
    ctx.drawImage(glow, b.x + w_.x + w_.w / 2 - gs / 2, h - b.h + w_.y + w_.h / 2 - gs / 2, gs, gs);
  }
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  ctx.restore();
  const hz = ctx.createLinearGradient(0, h * .3, 0, h);
  hz.addColorStop(0, rgba(P.haze, 0)); hz.addColorStop(1, rgba(P.haze, P.hazeA + st.haze * .3));
  ctx.fillStyle = hz; ctx.fillRect(0, 0, w, h);
}

/* ---------- مشهد الطريق ---------- */
function drawRoad(ctx, w, h, t, st) {
  const hz = h * .5, vx = w * .58, hz_ = st.haze;
  const sk = ctx.createLinearGradient(0, 0, 0, hz);
  sk.addColorStop(0, mix(C('road-01'), C('road-02'), hz_)); sk.addColorStop(1, mix(C('road-03'), C('road-04'), hz_));
  ctx.fillStyle = sk; ctx.fillRect(0, 0, w, hz);
  const gd = ctx.createLinearGradient(0, hz, 0, h);
  gd.addColorStop(0, mix(C('road-05'), C('road-04'), hz_)); gd.addColorStop(.18, mix(C('road-06'), C('road-07'), hz_)); gd.addColorStop(1, C('road-08'));
  ctx.fillStyle = gd; ctx.fillRect(0, hz, w, h - hz);
  ctx.fillStyle = mix(C('road-09'), C('road-10'), hz_);
  ctx.beginPath(); ctx.moveTo(vx - 5, hz); ctx.lineTo(vx + 5, hz); ctx.lineTo(w * 1.02, h); ctx.lineTo(-w * .02, h); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(214,206,184,.32)'; ctx.lineWidth = 2;
  const ph = reduce ? 0 : (t * .00005) % 1, N = 12, sides = [];
  for (const side of [-1, 1]) {
    const pts = [];
    for (let i = N; i >= 0; i--) {
      const d = ((i + ph) / (N + 1)); if (d <= 0.015 || d >= 1) continue;
      const sc = Math.pow(d, 1.7);
      pts.push({ x: lerp(vx, side < 0 ? w * .02 : w * .98, sc * 1.08 + .0), gy: lerp(hz, h * 1.06, sc), ht: sc * h * .62, wd: 1.4 + sc * 7, d });
    }
    sides.push(pts);
  }
  for (const pts of sides) {
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], a = Math.min(1, p.d * 2.4) * (1 - hz_ * .55);
      ctx.fillStyle = `rgba(30,28,25,${a})`; ctx.fillRect(p.x - p.wd / 2, p.gy - p.ht, p.wd, p.ht);
      ctx.fillRect(p.x - p.wd * 3, p.gy - p.ht, p.wd * 6, Math.max(1, p.wd * .6));
      if (i + 1 < pts.length) {
        const q = pts[i + 1];
        ctx.strokeStyle = `rgba(30,28,25,${a * .85})`; ctx.lineWidth = Math.max(.6, p.wd * .22);
        ctx.beginPath(); ctx.moveTo(p.x, p.gy - p.ht + 2); ctx.quadraticCurveTo((p.x + q.x) / 2, Math.max(p.gy - p.ht, q.gy - q.ht) + 10 + p.ht * .06, q.x, q.gy - q.ht + 2); ctx.stroke();
      }
    }
  }
  for (let k = 0; k < 3; k++) {
    const y = hz - h * .02 + k * h * .045, off = reduce ? 0 : Math.sin(t * .0002 + k * 2) * w * .04;
    const f = ctx.createLinearGradient(0, y - h * .1, 0, y + h * .1);
    const c = C('road-11'), a = (.16 + .5 * hz_) * (1 - k * .22);
    f.addColorStop(0, rgba(c, 0)); f.addColorStop(.5, rgba(c, a)); f.addColorStop(1, rgba(c, 0));
    ctx.fillStyle = f; ctx.fillRect(off - w * .1, y - h * .1, w * 1.2, h * .2);
  }
  const top = ctx.createLinearGradient(0, hz - h * .25, 0, hz + h * .12);
  top.addColorStop(0, rgba(C('road-12'), 0)); top.addColorStop(.6, rgba(C('road-12'), .25 + .55 * hz_)); top.addColorStop(1, rgba(C('road-12'), 0));
  ctx.fillStyle = top; ctx.fillRect(0, hz - h * .25, w, h * .37);
}

/* ---------- مشهد المصباح ---------- */
function drawLamp(ctx, w, h, t, st, L) {
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, C('lamp-01')); bg.addColorStop(.6, C('lamp-02')); bg.addColorStop(1, C('lamp-03'));
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  const dy = h * .66, lx = w * .4, s = h / 520, fl = reduce ? 1 : .96 + .04 * Math.sin(t * .003) * Math.sin(t * .0007);
  const k = (.75 + st.level * .25) * fl;
  const desk = ctx.createLinearGradient(0, dy, 0, h);
  desk.addColorStop(0, C('lamp-04')); desk.addColorStop(1, C('lamp-05'));
  ctx.fillStyle = desk; ctx.fillRect(0, dy, w, h - dy);
  const sx = lx + 34 * s, sy = dy - 150 * s;
  ctx.globalCompositeOperation = 'lighter';
  const cone = ctx.createLinearGradient(0, sy, 0, dy + 20 * s);
  cone.addColorStop(0, `rgba(240,196,128,${.42 * k})`); cone.addColorStop(1, `rgba(240,196,128,${.05 * k})`);
  ctx.fillStyle = cone; ctx.beginPath(); ctx.moveTo(sx - 26 * s, sy); ctx.lineTo(sx + 26 * s, sy); ctx.lineTo(sx + 250 * s, dy + 24 * s); ctx.lineTo(sx - 150 * s, dy + 24 * s); ctx.closePath(); ctx.fill();
  const pool = ctx.createRadialGradient(sx + 60 * s, dy + 10 * s, 0, sx + 60 * s, dy + 10 * s, 260 * s);
  pool.addColorStop(0, `rgba(240,196,128,${.38 * k})`); pool.addColorStop(1, 'rgba(240,196,128,0)');
  ctx.fillStyle = pool; ctx.fillRect(0, dy - 120 * s, w, 220 * s);
  ctx.globalCompositeOperation = 'source-over';
  const papers = [[sx + 20 * s, dy + 6 * s, -.05, 150 * s, 100 * s, C('lamp-06')], [sx + 70 * s, dy + 12 * s, .04, 150 * s, 100 * s, C('lamp-07')], [sx + 112 * s, dy + 4 * s, -.02, 140 * s, 96 * s, C('lamp-08')]];
  for (const [x, y, rot, pw, ph, col] of papers) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.transform(1, 0, -.6, .26, 0, 0);
    ctx.fillStyle = col; ctx.globalAlpha = .55 + .4 * k; ctx.fillRect(0, -ph, pw, ph);
    ctx.globalAlpha = .28; ctx.fillStyle = C('lamp-09');
    for (let i = 0; i < 9; i++) ctx.fillRect(pw * .1, -ph + ph * .1 + i * ph * .095, pw * (.45 + ((i * 37) % 40) / 100), 2.2);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = C('lamp-10'); ctx.lineWidth = 5 * s; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(lx, dy); ctx.lineTo(lx, dy - 70 * s); ctx.lineTo(lx + 28 * s, dy - 128 * s); ctx.stroke();
  ctx.fillStyle = C('lamp-10'); ctx.beginPath(); ctx.ellipse(lx, dy + 2 * s, 34 * s, 8 * s, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(sx - 32 * s, sy + 16 * s); ctx.lineTo(sx + 36 * s, sy + 16 * s); ctx.lineTo(sx + 22 * s, sy - 12 * s); ctx.lineTo(sx - 18 * s, sy - 12 * s); ctx.closePath(); ctx.fill();
  ctx.globalCompositeOperation = 'lighter';
  const bulb = ctx.createRadialGradient(sx + 2 * s, sy + 18 * s, 0, sx + 2 * s, sy + 18 * s, 46 * s);
  bulb.addColorStop(0, `rgba(255,224,170,${.8 * k})`); bulb.addColorStop(1, 'rgba(255,200,130,0)');
  ctx.fillStyle = bulb; ctx.fillRect(sx - 60 * s, sy - 30 * s, 130 * s, 130 * s);
  for (const m of L.motes) {
    const yy = (m.y + (reduce ? 0 : t * m.v * .00002)) % 1, xx = m.x + (reduce ? 0 : Math.sin(t * .0004 + m.k) * .012);
    const px = lerp(sx - 20 * s, sx + 230 * s, xx) * 1 + (yy * 60 * s) * xx, py = lerp(sy, dy + 10 * s, yy);
    ctx.globalAlpha = .5 * m.a * k * (1 - yy * .4); ctx.fillStyle = C('lamp-11'); ctx.fillRect(px, py, 1.6, 1.6);
  }
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
}

/* ---------- مشهد الشرفات: صباح البيوت (الفصل الأول) ---------- */
function buildBalc(w, h, seed) {
  const r = mulberry(seed), s = h / 520;
  const cols = Math.max(3, Math.round(w / (150 * s))), rows = 4;
  const cw = w / cols, rh = h / (rows + .35), units = [];
  for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
    units.push({ x: j * cw, y: h * .06 + i * rh, w: cw, h: rh, on: r(), laundry: r() < .5, cloth: [r(), r(), r(), r()], plant: r() < .55, ph: r() * 6.28, sway: .6 + r() });
  }
  return { units, cw, rh, s };
}

function drawBalc(ctx, w, h, t, st, L) {
  const s = L.s, level = st.level;
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, C('balc-sky0')); sky.addColorStop(1, C('balc-sky1'));
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
  const wall = ctx.createLinearGradient(0, 0, 0, h);
  wall.addColorStop(0, C('balc-wall0')); wall.addColorStop(1, C('balc-wall1'));
  ctx.fillStyle = wall; ctx.fillRect(0, h * .04, w, h);
  const cloths = [C('balc-cloth0'), C('balc-cloth1'), C('balc-cloth2'), C('balc-cloth3')];
  for (const u of L.units) {
    const ww = u.w * .34, wh = u.h * .5, wx = u.x + u.w * .12, wy = u.y + u.h * .1;
    const on = clamp((level - u.on) * 6);
    ctx.fillStyle = C('balc-glass'); ctx.fillRect(wx, wy, ww, wh);
    if (on > .02) {
      const g = ctx.createLinearGradient(0, wy, 0, wy + wh);
      g.addColorStop(0, C('balc-lit')); g.addColorStop(1, C('balc-lit-low'));
      ctx.globalAlpha = on * (reduce ? 1 : .94 + .06 * Math.sin(t * .0013 + u.ph)); ctx.fillStyle = g; ctx.fillRect(wx, wy, ww, wh);
      ctx.globalAlpha = on * .55; ctx.fillStyle = C('balc-curtain'); ctx.fillRect(wx, wy, ww * .3, wh);
      ctx.globalAlpha = 1;
    }
    ctx.fillStyle = C('balc-frame'); ctx.fillRect(wx - 2 * s, wy - 3 * s, ww + 4 * s, 3 * s); ctx.fillRect(wx + ww / 2 - s, wy, 2 * s, wh);
    const sx = u.x + u.w * .02, sw = u.w * .96, sy = u.y + u.h * .68;
    ctx.fillStyle = C('balc-slab'); ctx.fillRect(sx, sy, sw, 7 * s);
    ctx.fillStyle = C('balc-shade'); ctx.globalAlpha = .28; ctx.fillRect(sx, sy + 7 * s, sw, 9 * s); ctx.globalAlpha = 1;
    ctx.strokeStyle = C('balc-rail'); ctx.lineWidth = 1.6 * s;
    ctx.beginPath(); ctx.moveTo(sx, sy - 26 * s); ctx.lineTo(sx + sw, sy - 26 * s);
    for (let k = 0; k <= 9; k++) { const bx = sx + sw * k / 9; ctx.moveTo(bx, sy - 26 * s); ctx.lineTo(bx, sy); }
    ctx.stroke();
    if (u.plant) {
      ctx.fillStyle = C('balc-plant'); ctx.globalAlpha = .55 + .4 * on;
      ctx.beginPath(); ctx.ellipse(sx + sw * .86, sy - 9 * s, 12 * s, 9 * s, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    }
    if (u.laundry && on > .15) {
      const ly = wy + 2 * s, x0 = sx + sw * .06, x1 = sx + sw * .74;
      ctx.strokeStyle = C('balc-rail'); ctx.lineWidth = s; ctx.beginPath(); ctx.moveTo(x0, ly); ctx.lineTo(x1, ly + 3 * s); ctx.stroke();
      for (let k = 0; k < 4; k++) {
        const px = lerp(x0, x1, (k + .5) / 4), sw_ = reduce ? 0 : Math.sin(t * .0011 * u.sway + u.ph + k) * 2.4 * s;
        ctx.fillStyle = cloths[(u.cloth[k] * 4) | 0]; ctx.globalAlpha = on;
        ctx.beginPath(); ctx.moveTo(px - 7 * s, ly); ctx.lineTo(px + 7 * s, ly); ctx.lineTo(px + 6 * s + sw_, ly + 22 * s); ctx.lineTo(px - 6 * s + sw_, ly + 22 * s); ctx.closePath(); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  }
  ctx.globalCompositeOperation = 'lighter';
  const sun = ctx.createLinearGradient(w * .1 + st.px * 20, 0, w * .75, h);
  sun.addColorStop(0, rgba(C('balc-sun'), .2 * (.4 + level * .6))); sun.addColorStop(.5, rgba(C('balc-sun'), .05)); sun.addColorStop(1, rgba(C('balc-sun'), 0));
  ctx.fillStyle = sun; ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'source-over';
}

/* ---------- مشهد الجدار: الصوت يُطلى فوقه (الفصل الثاني) ---------- */
function buildWall(w, h, seed) {
  const r = mulberry(seed), s = h / 520;
  const strokes = [], rowsN = 3, perRow = 7;
  for (let i = 0; i < rowsN; i++) for (let j = 0; j < perRow; j++) {
    const cx = w * (.12 + .76 * (j + r() * .6) / perRow), cy = h * (.2 + .2 * i + r() * .05), pts = [];
    const n = 5 + (r() * 4 | 0);
    for (let k = 0; k < n; k++) pts.push([cx + k * 7 * s - n * 3.5 * s, cy + Math.sin(k * 1.7 + r() * 2) * 7 * s * (.4 + r())]);
    strokes.push({ pts, order: r() });
  }
  const patches = Array.from({ length: 10 }, (_, i) => ({
    x: w * (.02 + .1 * i) + (r() - .5) * 20 * s, y: h * (.12 + r() * .1), w: w * (.16 + r() * .08), h: h * (.5 + r() * .25), thr: i / 10, rot: (r() - .5) * .05
  }));
  const specks = Array.from({ length: 220 }, () => ({ x: r() * w, y: r() * h, a: .05 + r() * .12, z: (.6 + r() * 1.6) * s }));
  const cracks = Array.from({ length: 9 }, () => {
    let x = r() * w, y = r() * h * .3; const p = [[x, y]];
    for (let k = 0; k < 7; k++) { x += (r() - .5) * 40 * s; y += (10 + r() * 30) * s; p.push([x, y]); }
    return p;
  });
  return { strokes, patches, cracks, specks, s };
}

function drawWall(ctx, w, h, t, st, L) {
  const s = L.s, level = st.level;
  const f = clamp(1 - (level - .34) / .38);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, C('wall-base0')); g.addColorStop(1, C('wall-base1'));
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = C('wall-crack');
  for (const q of L.specks) { ctx.globalAlpha = q.a; ctx.fillRect(q.x, q.y, q.z, q.z); }
  ctx.strokeStyle = C('wall-crack'); ctx.globalAlpha = .45; ctx.lineWidth = 1.1 * s;
  for (const p of L.cracks) { ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]); for (const q of p) ctx.lineTo(q[0], q[1]); ctx.stroke(); }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = C('wall-ink'); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 3.8 * s;
  for (const k of L.strokes) {
    ctx.globalAlpha = .82; ctx.beginPath(); ctx.moveTo(k.pts[0][0], k.pts[0][1]);
    for (let i = 1; i < k.pts.length - 1; i++) { const m = [(k.pts[i][0] + k.pts[i + 1][0]) / 2, (k.pts[i][1] + k.pts[i + 1][1]) / 2]; ctx.quadraticCurveTo(k.pts[i][0], k.pts[i][1], m[0], m[1]); }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  for (const p of L.patches) {
    const a = clamp((f - p.thr) * 8); if (a <= 0) continue;
    ctx.save(); ctx.translate(p.x + p.w / 2, p.y + p.h / 2); ctx.rotate(p.rot);
    const hw = p.w / 2, hh = p.h / 2, j = 7 * s;
    ctx.globalAlpha = a * .95; ctx.fillStyle = C('wall-wash');
    ctx.beginPath(); ctx.moveTo(-hw, -hh + j);
    ctx.quadraticCurveTo(-hw + j, -hh - j, 0, -hh + j * .3); ctx.quadraticCurveTo(hw - j, -hh - j * .6, hw, -hh + j);
    ctx.quadraticCurveTo(hw + j, 0, hw - j * .4, hh); ctx.quadraticCurveTo(0, hh + j, -hw + j, hh - j * .3); ctx.quadraticCurveTo(-hw - j * .5, 0, -hw, -hh + j);
    ctx.fill();
    ctx.globalAlpha = a * .16; ctx.strokeStyle = C('wall-base0'); ctx.lineWidth = 1.2 * s;
    for (let y = -hh + 9 * s; y < hh; y += 11 * s) { ctx.beginPath(); ctx.moveTo(-hw + j, y); ctx.lineTo(hw - j, y + 2 * s); ctx.stroke(); }
    ctx.globalAlpha = a * .2; ctx.fillStyle = C('wall-crack'); ctx.fillRect(-hw + j, hh - 3 * s, p.w - 2 * j, 3 * s);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = 2 * s;
  const ox = w * .16, oy = h * .86, ph = reduce ? 0 : (t * .00022) % 1;
  for (let i = 0; i < 6; i++) {
    const d = (i + ph) / 6, rr = d * h * 1.15;
    ctx.globalAlpha = (1 - d) * .55 * level; ctx.strokeStyle = C('wall-ripple');
    ctx.beginPath(); ctx.arc(ox, oy, rr, -1.2, .2); ctx.stroke();
  }
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
}

/* ---------- مشهد النافذة: الغرفة تنطفئ ويبقى مصباح (الفصل الثالث) ---------- */
function buildWindow(w, h, seed) {
  const r = mulberry(seed), s = h / 520, stones = [];
  const bh = 34 * s;
  for (let y = 0; y < h; y += bh) { let x = -(r() * 60 * s); while (x < w) { const bw = (60 + r() * 70) * s; stones.push({ x, y, w: bw - 2 * s, h: bh - 2 * s, tone: r() }); x += bw; } }
  const motes = Array.from({ length: 28 }, () => ({ x: r(), y: r(), v: 2 + r() * 5, a: .3 + r() * .7, k: r() * 6 }));
  return { stones, motes, s };
}

function drawWindow(ctx, w, h, t, st, L) {
  const s = L.s, level = st.level;
  const k = Math.max(level, st.keep ? .16 : 0) * (reduce ? 1 : .97 + .03 * Math.sin(t * .0021));
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, C('win-night0')); bg.addColorStop(1, C('win-night1'));
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  for (const q of L.stones) { ctx.globalAlpha = .55; ctx.fillStyle = mix(C('win-stone0'), C('win-stone1'), q.tone); ctx.fillRect(q.x, q.y, q.w, q.h); }
  ctx.globalAlpha = 1;
  const fw = Math.min(w * .5, 300 * s), fh = h * .74, fx = w * .5 - fw / 2 + st.px * 6, fy = h * .12;
  for (const dx of [-fw * 1.25, fw * 1.25]) { ctx.fillStyle = C('win-glass-dark'); ctx.fillRect(fx + dx, fy + fh * .12, fw * .6, fh * .62); ctx.strokeStyle = C('win-frame'); ctx.globalAlpha = .4; ctx.lineWidth = 3 * s; ctx.strokeRect(fx + dx, fy + fh * .12, fw * .6, fh * .62); ctx.globalAlpha = 1; }
  ctx.fillStyle = C('win-glass-dark'); ctx.fillRect(fx, fy, fw, fh);
  const room = ctx.createLinearGradient(0, fy, 0, fy + fh);
  room.addColorStop(0, C('win-room1')); room.addColorStop(1, C('win-room0'));
  ctx.globalAlpha = clamp(k * 1.1); ctx.fillStyle = room; ctx.fillRect(fx, fy, fw, fh); ctx.globalAlpha = 1;
  ctx.fillStyle = C('win-furn'); ctx.globalAlpha = clamp(.55 + k * .45);
  const ty = fy + fh * .64;
  ctx.fillRect(fx + fw * .1, ty, fw * .8, 8 * s);
  ctx.fillRect(fx + fw * .15, ty, 6 * s, fh * .36); ctx.fillRect(fx + fw * .8, ty, 6 * s, fh * .36);
  ctx.fillRect(fx + fw * .12, ty + 18 * s, fw * .76, 4 * s);
  const cx0 = fx + fw * .24, cy0 = fy + fh * .76;
  ctx.fillRect(cx0, cy0, fw * .17, 7 * s); ctx.fillRect(cx0, cy0, 6 * s, fh * .24); ctx.fillRect(cx0 + fw * .17 - 6 * s, cy0, 6 * s, fh * .24);
  ctx.fillRect(cx0, cy0 - fh * .2, 6 * s, fh * .2); ctx.fillRect(cx0, cy0 - fh * .2, fw * .03, 6 * s);
  ctx.fillRect(cx0 + fw * .015, cy0 - fh * .15, 4 * s, fh * .15);
  ctx.beginPath(); ctx.moveTo(fx + fw * .44, ty); ctx.lineTo(fx + fw * .44, ty - 16 * s); ctx.lineTo(fx + fw * .5, ty - 16 * s); ctx.lineTo(fx + fw * .5, ty); ctx.fill();
  ctx.beginPath(); ctx.ellipse(fx + fw * .47, ty - 20 * s, 7 * s, 3 * s, 0, 0, 7); ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillStyle = C('win-curtain'); ctx.fillRect(fx, fy, fw * .17, fh); ctx.fillRect(fx + fw * .85, fy, fw * .15, fh);
  ctx.strokeStyle = C('win-frame'); ctx.lineWidth = 6 * s; ctx.strokeRect(fx, fy, fw, fh);
  ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(fx + fw / 2, fy); ctx.lineTo(fx + fw / 2, fy + fh); ctx.moveTo(fx, fy + fh * .34); ctx.lineTo(fx + fw, fy + fh * .34); ctx.stroke();
  ctx.globalCompositeOperation = 'lighter';
  const spill = ctx.createRadialGradient(fx + fw / 2, fy + fh * .55, 0, fx + fw / 2, fy + fh * .55, fw * 1.6);
  spill.addColorStop(0, rgba(C('win-lamp'), .34 * k)); spill.addColorStop(1, rgba(C('win-lamp'), 0));
  ctx.fillStyle = spill; ctx.fillRect(0, 0, w, h);
  const lx = fx + fw * .66, ly = fy + fh * .6, lg = ctx.createRadialGradient(lx, ly, 0, lx, ly, 70 * s);
  lg.addColorStop(0, rgba(C('win-lamp'), .9 * (st.keep ? Math.max(k, .5) : k))); lg.addColorStop(1, rgba(C('win-lamp'), 0));
  ctx.fillStyle = lg; ctx.fillRect(lx - 70 * s, ly - 70 * s, 140 * s, 140 * s);
  for (const m of L.motes) {
    const yy = (m.y + (reduce ? 0 : t * m.v * .00002)) % 1;
    ctx.globalAlpha = .45 * m.a * k * (1 - yy * .5); ctx.fillStyle = C('win-lamp');
    ctx.fillRect(fx - fw * .3 + m.x * fw * 1.6, fy + fh * .1 + yy * fh * .9, 1.6, 1.6);
  }
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
}

/* ---------- مشهد الشارع المبتلّ: فجر تُضاء فيه النوافذ (الفصل السادس) ---------- */
function buildWet(w, h, seed) {
  const r = mulberry(seed), s = h / 520, blds = [];
  let x = -20 * s;
  while (x < w + 20) {
    const bw = (70 + r() * 120) * s, bh = h * (.22 + r() * .26), b = { x, w: bw, h: bh, tone: r(), wins: [] };
    const ww = 11 * s, wh = 16 * s, gx = 10 * s, gy = 12 * s, cols = Math.max(1, Math.floor((bw - 12 * s) / (ww + gx))), rows = Math.max(1, Math.floor((bh - 14 * s) / (wh + gy)));
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) b.wins.push({ x: 8 * s + j * (ww + gx), y: 10 * s + i * (wh + gy), w: ww, h: wh, r: r(), ph: r() * 6.28 });
    blds.push(b); x += bw + r() * 8 * s;
  }
  return { blds, s, hz: h * .58 };
}

function drawWet(ctx, w, h, t, st, L) {
  const s = L.s, level = st.level, hz = L.hz;
  const sky = ctx.createLinearGradient(0, 0, 0, hz);
  sky.addColorStop(0, C('wet-sky0')); sky.addColorStop(.6, C('wet-sky1')); sky.addColorStop(1, C('wet-sky2'));
  ctx.fillStyle = sky; ctx.fillRect(0, 0, w, hz);
  for (const b of L.blds) {
    ctx.fillStyle = mix(C('wet-bld0'), C('wet-bld1'), b.tone); ctx.fillRect(b.x, hz - b.h, b.w, b.h);
    for (const q of b.wins) {
      const on = clamp((level - q.r) * 6) * (reduce ? 1 : .92 + .08 * Math.sin(t * .0014 + q.ph));
      ctx.fillStyle = C('wet-unlit'); ctx.globalAlpha = 1; ctx.fillRect(b.x + q.x, hz - b.h + q.y, q.w, q.h);
      if (on > .02) { ctx.globalAlpha = on; ctx.fillStyle = C('wet-lit'); ctx.fillRect(b.x + q.x, hz - b.h + q.y, q.w, q.h); }
    }
  }
  ctx.globalAlpha = 1;
  const road = ctx.createLinearGradient(0, hz, 0, h);
  road.addColorStop(0, C('wet-road0')); road.addColorStop(1, C('wet-road1'));
  ctx.fillStyle = road; ctx.fillRect(0, hz, w, h - hz);
  const dpr = ctx.canvas.width / w, rippleT = reduce ? 0 : t * .0012;
  for (let y = hz; y < h; y += 2) {
    const d = y - hz, sy = hz - d * .9 - 2; if (sy < 0) break;
    const off = Math.sin(d * .09 + rippleT) * (1 + d * .02) * s;
    ctx.globalAlpha = Math.max(.12, .58 - d / (h - hz) * .4);
    ctx.drawImage(ctx.canvas, 0, sy * dpr, ctx.canvas.width, 2 * dpr, off, y, w, 2);
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'lighter';
  const sh = ctx.createLinearGradient(0, hz, 0, hz + (h - hz) * .5);
  sh.addColorStop(0, rgba(C('wet-sheen'), .16 + .2 * level)); sh.addColorStop(1, rgba(C('wet-sheen'), 0));
  ctx.fillStyle = sh; ctx.fillRect(0, hz, w, h - hz);
  const lamps = [.2, .55, .86];
  for (const lx of lamps) {
    const x = w * lx, g = ctx.createRadialGradient(x, hz - 40 * s, 0, x, hz - 40 * s, 90 * s);
    g.addColorStop(0, rgba(C('wet-lamp'), .5 * (.3 + level * .7))); g.addColorStop(1, rgba(C('wet-lamp'), 0));
    ctx.fillStyle = g; ctx.fillRect(x - 90 * s, hz - 130 * s, 180 * s, 180 * s);
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = C('wet-bld0');
  for (const lx of lamps) { const x = w * lx; ctx.fillRect(x - 1.5 * s, hz - 52 * s, 3 * s, 52 * s); ctx.fillRect(x - 9 * s, hz - 54 * s, 18 * s, 3 * s); }
}

/* ---------- اللوحة ---------- */
const SCENES = {
  facade: { build: (w, h, seed) => buildFacade(w, h, seed), draw: drawFacade },
  road:   { build: () => ({}), draw: drawRoad },
  balc:   { build: buildBalc, draw: drawBalc },
  wall:   { build: buildWall, draw: drawWall },
  window: { build: buildWindow, draw: drawWindow },
  wet:    { build: buildWet, draw: drawWet },
  lamp:   { build: (w, h, seed) => { const r = mulberry(seed); return { motes: Array.from({ length: 46 }, () => ({ x: r(), y: r(), v: 3 + r() * 6, a: .3 + r() * .7, k: r() * 6 })) }; }, draw: drawLamp }
};
const plates = [];

class Plate {
  constructor(el) {
    this.el = el; this.cv = $('canvas', el); this.ctx = this.cv.getContext('2d');
    this.scene = SCENES[el.dataset.scene]; this.seed = +el.dataset.seed || 1; this.vis = false; this.dirty = true; this.last = 0;
    this.st = { level: +el.dataset.level || .6, pal: el.dataset.pal || 'dusk', haze: +el.dataset.haze || 0, px: 0, keep: !!el.dataset.keep };
    this.drive = el.dataset.drive || ''; this.from = +el.dataset.from; this.to = +el.dataset.to; this.p = .5;
    this.resize();
    new ResizeObserver(() => this.resize()).observe(el);
    new IntersectionObserver(([e]) => { this.vis = e.isIntersecting; if (this.vis) { this.dirty = true; this.progress(); } }, { rootMargin: '120px' }).observe(el);
    this.addIdu();
  }
  addIdu() {
    const m = { hero: ['left', .277], c1: ['right', .33], c2: ['right', .309], c3: ['left', .286], c4: ['right', .284], c5: ['right', .246], c6: ['right', .311] }[this.el.dataset.key];
    if (!m) return;
    const u = doc.createElement('span'); u.className = 'idu ' + m[0]; u.style.setProperty('--a', m[1]);
    const a = new Image(); a.src = 'images/avatar.png'; a.alt = '';
    const sg = doc.createElement('span'); sg.className = 'sig'; sg.dir = 'ltr'; sg.textContent = '𝓚𝓱𝓪𝓵𝓭𝓸𝓾𝓷𝓐𝓴𝓻𝓪𝓶𝓪𝓱';
    u.append(a, sg); this.el.append(u);
  }
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const w = Math.max(1, this.cv.offsetWidth), h = Math.max(1, this.cv.offsetHeight);
    if (w === this.w && h === this.h) return;
    this.w = w; this.h = h; this.cv.width = Math.round(w * dpr); this.cv.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.L = this.scene.build(w, h, this.seed); this.dirty = true;
  }
  set(k, v) { if (this.st[k] !== v) { this.st[k] = v; this.dirty = true; } }
  progress() {
    const r = this.el.getBoundingClientRect(), vh = innerHeight;
    this.p = clamp((vh - r.top) / (vh + r.height));
    const shift = (this.p - .5) * -56, tr = reduce ? '' : `translate3d(0,${shift.toFixed(1)}px,0)`; this.cv.style.transform = tr;
    if (this.drive === 'up') this.set('level', lerp(this.from, this.to, ease(clamp((this.p - .2) / .5))));
    if (this.drive === 'down') this.set('level', lerp(this.from, this.to, ease(clamp((this.p - .12) / .4))));
    if (this.drive === 'rights') this.set('level', clamp(.12 + this.rights * .22));
  }
  frame(now) {
    if (!this.vis) return;
    const live = !reduce && (now - this.last > 50);
    if (!this.dirty && !live) return;
    this.last = now; this.dirty = false;
    this.scene.draw(this.ctx, this.w, this.h, now, this.st, this.L);
    const ctx = this.ctx;
    ctx.save(); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .13;
    ctx.translate(reduce ? 0 : (Math.random() * 192) | 0, reduce ? 0 : (Math.random() * 192) | 0);
    ctx.fillStyle = ctx.createPattern(noise, 'repeat'); ctx.fillRect(-192, -192, this.w + 384, this.h + 384); ctx.restore();
    const v = ctx.createRadialGradient(this.w / 2, this.h / 2, this.h * .35, this.w / 2, this.h / 2, Math.max(this.w, this.h) * .75);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.34)'); ctx.fillStyle = v; ctx.fillRect(0, 0, this.w, this.h);
  }
}
Object.defineProperty(Plate.prototype, 'rights', { get() { return this._rights || 0; }, set(v) { this._rights = v; this.dirty = true; this.progress(); } });

function loop(now) { for (const p of plates) p.frame(now); requestAnimationFrame(loop); }

/* ---------- التبويبات: تبديل لوحة واحدة ظاهرة ---------- */
function tabs(box, onChange) {
  const btns = $$('[role=tab]', box), items = $$('[data-i]', box).filter(e => e.tagName === 'P');
  const show = i => {
    btns.forEach(b => b.setAttribute('aria-selected', String(+b.dataset.i === i)));
    items.forEach(p => { p.hidden = +p.dataset.i !== i; });
    onChange && onChange(i);
  };
  btns.forEach(b => b.addEventListener('click', () => show(+b.dataset.i)));
  btns.forEach(b => b.addEventListener('keydown', e => {
    const i = +b.dataset.i, d = e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowRight' ? -1 : 0;
    if (!d) return; const n = (i + d + btns.length) % btns.length; btns[n].focus(); show(n); e.preventDefault();
  }));
  return show;
}

function init() {
  $$('.plate').forEach(el => plates.push(new Plate(el)));
  const byKey = k => plates.find(p => p.el.dataset.key === k);

  /* مقدمة الشاشة الأولى: تُضاء النوافذ واحدة بعد أخرى */
  const hero = byKey('hero');
  if (!reduce) { hero.set('level', 0); const t0 = performance.now(); const tick = n => { const k = clamp((n - t0 - 400) / 4200); hero.set('level', .74 * ease(k)); if (k < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }
  addEventListener('pointermove', e => { if (!reduce) hero.set('px', (e.clientX / innerWidth - .5) * 2); }, { passive: true });

  /* الفصل الرابع: محطات الحصار تثقل الضباب على الطريق */
  const road = byKey('c4'), haze = [.08, .32, .58, .88];
  const fogLv = [.05, .3, .55, .85];
  tabs($('[data-scrub]'), i => { road.set('haze', haze[i]); road.el.style.setProperty('--fog', fogLv[i]); });

  /* الفصل الخامس: سلسلة الدليل تُرسم خطها */
  const chainEl = $('[data-chain]');
  tabs(chainEl, i => chainEl.style.setProperty('--off', String(1 - (i + 1) / 4)));
  chainEl.style.setProperty('--off', '.75');

  /* الفصل السادس: كل حق يُفتح يُضيء نوافذ أكثر */
  const rightsEl = $('[data-rights]'), opened = new Set(), c6 = byKey('c6');
  tabs(rightsEl, i => { opened.add(i); c6.rights = opened.size; $('[data-hint]', rightsEl).hidden = true; });

  /* خط الزمن */
  const tl = $('[data-tl]'), tli = $$('li', tl);
  const tlUpdate = () => {
    const r = tl.getBoundingClientRect(), p = clamp((innerHeight * .72 - r.top) / r.height);
    tl.style.setProperty('--p', p.toFixed(3));
    tli.forEach((li, i) => li.classList.toggle('on', p >= (i + .3) / tli.length - .02));
  };

  /* الظهور التدريجي للنص */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.prose p, .chap-head').forEach(el => io.observe(el));

  /* لون الصفحة يتبع الفصل */
  const themeIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) doc.body.dataset.theme = e.target.dataset.theme; }), { rootMargin: '-48% 0px -48% 0px' });
  $$('.chap').forEach(c => themeIO.observe(c));
  new IntersectionObserver(([e]) => { if (e.isIntersecting) doc.body.dataset.theme = 'hero'; }, { rootMargin: '-40% 0px -40% 0px' }).observe($('.hero'));

  /* التمرير */
  const bar = $('.progress i');
  let tick = false;
  const onScroll = () => {
    if (tick) return; tick = true;
    requestAnimationFrame(() => {
      tick = false;
      const max = doc.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max) : 0})`;
      plates.forEach(p => p.vis && p.progress()); tlUpdate();
    });
  };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll);
  onScroll(); plates.forEach(p => p.progress());

  /* القائمة */
  const menu = $('#menu'), mb = $('.bar-menu');
  const setMenu = o => { menu.hidden = !o; mb.setAttribute('aria-expanded', String(o)); mb.textContent = o ? 'إغلاق' : 'الفصول'; doc.body.style.overflow = o ? 'hidden' : ''; };
  mb.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); mb.focus(); } });

  /* المشاركة */
  const sb = $('[data-share]'), msg = $('.share-msg');
  sb.addEventListener('click', async () => {
    const data = { title: doc.title, text: 'للضحية اسم، وللجريمة فاعل، وللبيت أصحابه.', url: location.href.split('#')[0] };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(data.url); msg.textContent = 'نُسخ الرابط.';
    } catch (_) { msg.textContent = 'تعذّر النسخ. انسخ الرابط من شريط العنوان.'; }
    setTimeout(() => { msg.textContent = ''; }, 3500);
  });

  requestAnimationFrame(loop);
}

/* عارض الصور: عنوان ووصف، وتنقّل بالأسهم بين صور السرد */
(() => {
  const figs = $$('.figw .fig'); if (!figs.length) return;
  const dlg = doc.createElement('dialog'); dlg.className = 'lb'; dlg.setAttribute('aria-labelledby', 'lb-title');
  dlg.innerHTML = '<button class="lb-x" type="button">إغلاق</button><div class="lb-in"><img alt=""><h2 id="lb-title"></h2><p></p><div class="lb-nav"><button type="button" data-d="1">السابقة</button><span></span><button type="button" data-d="-1">التالية</button></div></div>';
  doc.body.append(dlg);
  const im = $('img', dlg), ttl = $('h2', dlg), cap = $('p', dlg), pos = $('.lb-nav span', dlg);
  let cur = 0, from = null;
  const show = i => {
    cur = (i + figs.length) % figs.length; const f = figs[cur], img = $('img', f);
    im.src = img.currentSrc || img.src; im.alt = img.alt; ttl.textContent = f.dataset.title || ''; cap.textContent = f.dataset.desc || '';
    pos.textContent = (cur + 1) + ' / ' + figs.length;
  };
  const open = i => { from = doc.activeElement; show(i); if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); $('.lb-x', dlg).focus(); };
  $('.lb-x', dlg).addEventListener('click', () => dlg.close());
  dlg.addEventListener('close', () => { if (from) from.focus(); });
  dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('.lb-in') === e.target) dlg.close(); });
  $$('.lb-nav button', dlg).forEach(b => b.addEventListener('click', () => show(cur - +b.dataset.d)));
  dlg.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { show(cur - 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { show(cur + 1); e.preventDefault(); }
  });
  figs.forEach((f, i) => {
    f.setAttribute('tabindex', '0'); f.setAttribute('role', 'button'); f.setAttribute('aria-label', 'تكبير الصورة: ' + (f.dataset.title || ''));
    f.addEventListener('click', () => open(i));
    f.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
  });
})();

/* صور الفصول: حركة خفيفة مع القراءة */
const figEls = $$('[data-par-fig] .fig > img');
if (!reduce && figEls.length) {
  let ft = false;
  const fpar = () => { ft = false; for (const im of figEls) { const r = im.parentElement.getBoundingClientRect(); if (r.bottom < -60 || r.top > innerHeight + 60) continue; const t = clamp((innerHeight - r.top) / (innerHeight + r.height)); im.style.transform = `translate3d(0,${((t - .5) * -24).toFixed(1)}px,0) scale(1.06)`; } };
  addEventListener('scroll', () => { if (!ft) { ft = true; requestAnimationFrame(fpar); } }, { passive: true }); fpar();
}

init();
})();
