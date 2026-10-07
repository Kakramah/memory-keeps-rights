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
const PAL = {
  dusk:    { sky: ['#1b272b', '#47544f', '#a58b69'], far: '#2a2a29', b1: '#151211', b2: '#1d1917', unlit: '#242020', lit: '#e8c283', glow: .9, haze: '#a58b69', hazeA: .34, stars: 0 },
  morning: { sky: ['#8999a0', '#c3bfae', '#e8dcc0'], far: '#9a9a90', b1: '#46403a', b2: '#574f47', unlit: '#3b352f', lit: '#f0dcab', glow: .38, haze: '#e1d6bb', hazeA: .5, stars: 0 },
  night:   { sky: ['#060c0d', '#0e1a1b', '#1b2927'], far: '#101817', b1: '#080a0a', b2: '#0d1010', unlit: '#101414', lit: '#e0b676', glow: 1, haze: '#1b2927', hazeA: .35, stars: 1 },
  dawn:    { sky: ['#4f6e69', '#9fb6ab', '#e6e1cb'], far: '#6c8279', b1: '#27312e', b2: '#313c38', unlit: '#37433f', lit: '#f3e0ae', glow: .55, haze: '#dcd9c3', hazeA: .45, stars: 0 }
};

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
  if (P.stars) for (const s of L.stars) { ctx.globalAlpha = s.a * (.7 + .3 * Math.sin(t * .001 + s.k)); ctx.fillStyle = '#d9d3c0'; ctx.fillRect(s.x, s.y, 1.2, 1.2); }
  ctx.globalAlpha = 1;
  const px = st.px * 14 * L.s;
  ctx.save(); ctx.translate(px * .45, 0);
  ctx.fillStyle = P.far; for (const b of L.far) ctx.fillRect(b.x, h - b.h, b.w, b.h);
  ctx.restore();
  ctx.save(); ctx.translate(px, 0);
  const level = st.level;
  for (const b of L.near) {
    ctx.fillStyle = mix(P.b1, P.b2, b.tone); ctx.fillRect(b.x, h - b.h, b.w, b.h);
    ctx.fillStyle = rgba('#000000', .18); ctx.fillRect(b.x + b.w - 3 * L.s, h - b.h, 3 * L.s, b.h);
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
        if (w_.curt) { ctx.globalAlpha = on * .32; ctx.fillStyle = '#000'; ctx.fillRect(wx, wy, w_.w, w_.h * .46); }
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
  sk.addColorStop(0, mix('#8a999a', '#b3b0a5', hz_)); sk.addColorStop(1, mix('#dad4c1', '#c7c3b6', hz_));
  ctx.fillStyle = sk; ctx.fillRect(0, 0, w, hz);
  const gd = ctx.createLinearGradient(0, hz, 0, h);
  gd.addColorStop(0, mix('#c9c4b3', '#c7c3b6', hz_)); gd.addColorStop(.18, mix('#7c796d', '#8f8d82', hz_)); gd.addColorStop(1, '#1f1f1c');
  ctx.fillStyle = gd; ctx.fillRect(0, hz, w, h - hz);
  ctx.fillStyle = mix('#30302d', '#4a4944', hz_);
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
    const c = '#d6d1c1', a = (.16 + .5 * hz_) * (1 - k * .22);
    f.addColorStop(0, rgba(c, 0)); f.addColorStop(.5, rgba(c, a)); f.addColorStop(1, rgba(c, 0));
    ctx.fillStyle = f; ctx.fillRect(off - w * .1, y - h * .1, w * 1.2, h * .2);
  }
  const top = ctx.createLinearGradient(0, hz - h * .25, 0, hz + h * .12);
  top.addColorStop(0, rgba('#cfcabb', 0)); top.addColorStop(.6, rgba('#cfcabb', .25 + .55 * hz_)); top.addColorStop(1, rgba('#cfcabb', 0));
  ctx.fillStyle = top; ctx.fillRect(0, hz - h * .25, w, h * .37);
}

/* ---------- مشهد المصباح ---------- */
function drawLamp(ctx, w, h, t, st, L) {
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#0e0b08'); bg.addColorStop(.6, '#17110c'); bg.addColorStop(1, '#241a12');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  const dy = h * .66, lx = w * .4, s = h / 520, fl = reduce ? 1 : .96 + .04 * Math.sin(t * .003) * Math.sin(t * .0007);
  const k = (.75 + st.level * .25) * fl;
  const desk = ctx.createLinearGradient(0, dy, 0, h);
  desk.addColorStop(0, '#2b1f15'); desk.addColorStop(1, '#120d09');
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
  const papers = [[sx + 20 * s, dy + 6 * s, -.05, 150 * s, 100 * s, '#cfc4ad'], [sx + 70 * s, dy + 12 * s, .04, 150 * s, 100 * s, '#d8cdb6'], [sx + 112 * s, dy + 4 * s, -.02, 140 * s, 96 * s, '#c9bda5']];
  for (const [x, y, rot, pw, ph, col] of papers) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.transform(1, 0, -.6, .26, 0, 0);
    ctx.fillStyle = col; ctx.globalAlpha = .55 + .4 * k; ctx.fillRect(0, -ph, pw, ph);
    ctx.globalAlpha = .28; ctx.fillStyle = '#4a4034';
    for (let i = 0; i < 9; i++) ctx.fillRect(pw * .1, -ph + ph * .1 + i * ph * .095, pw * (.45 + ((i * 37) % 40) / 100), 2.2);
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  ctx.strokeStyle = '#0a0806'; ctx.lineWidth = 5 * s; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(lx, dy); ctx.lineTo(lx, dy - 70 * s); ctx.lineTo(lx + 28 * s, dy - 128 * s); ctx.stroke();
  ctx.fillStyle = '#0a0806'; ctx.beginPath(); ctx.ellipse(lx, dy + 2 * s, 34 * s, 8 * s, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(sx - 32 * s, sy + 16 * s); ctx.lineTo(sx + 36 * s, sy + 16 * s); ctx.lineTo(sx + 22 * s, sy - 12 * s); ctx.lineTo(sx - 18 * s, sy - 12 * s); ctx.closePath(); ctx.fill();
  ctx.globalCompositeOperation = 'lighter';
  const bulb = ctx.createRadialGradient(sx + 2 * s, sy + 18 * s, 0, sx + 2 * s, sy + 18 * s, 46 * s);
  bulb.addColorStop(0, `rgba(255,224,170,${.8 * k})`); bulb.addColorStop(1, 'rgba(255,200,130,0)');
  ctx.fillStyle = bulb; ctx.fillRect(sx - 60 * s, sy - 30 * s, 130 * s, 130 * s);
  for (const m of L.motes) {
    const yy = (m.y + (reduce ? 0 : t * m.v * .00002)) % 1, xx = m.x + (reduce ? 0 : Math.sin(t * .0004 + m.k) * .012);
    const px = lerp(sx - 20 * s, sx + 230 * s, xx) * 1 + (yy * 60 * s) * xx, py = lerp(sy, dy + 10 * s, yy);
    ctx.globalAlpha = .5 * m.a * k * (1 - yy * .4); ctx.fillStyle = '#ffdca0'; ctx.fillRect(px, py, 1.6, 1.6);
  }
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
}

/* ---------- اللوحة ---------- */
const SCENES = {
  facade: { build: (w, h, seed) => buildFacade(w, h, seed), draw: drawFacade },
  road:   { build: () => ({}), draw: drawRoad },
  lamp:   { build: (w, h, seed) => { const r = mulberry(seed); return { motes: Array.from({ length: 46 }, () => ({ x: r(), y: r(), v: 3 + r() * 6, a: .3 + r() * .7, k: r() * 6 })) }; }, draw: drawLamp }
};
let manifest = {};
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
    const src = manifest[el.dataset.key], srcB = manifest[el.dataset.key + 'b'];
    if (src) {
      const im = new Image(); im.alt = el.dataset.alt || ''; im.className = 'plate-img';
      im.onload = () => { this.cv.hidden = true; el.prepend(im); this.img = im; this.progress(); };
      im.src = 'img/' + src;
      if (srcB) {
        const ib = new Image(); ib.alt = ''; ib.className = 'plate-img plate-img-b'; ib.style.opacity = '0';
        ib.onload = () => { const wait = () => (this.img ? this.img.after(ib) : setTimeout(wait, 60)); wait(); this.imgB = ib; this.progress(); };
        ib.src = 'img/' + srcB;
      }
    }
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
    const shift = (this.p - .5) * -56, tr = reduce ? '' : `translate3d(0,${shift.toFixed(1)}px,0)`; (this.img || this.cv).style.transform = tr; if (this.imgB) this.imgB.style.transform = tr;
    if (this.drive === 'up') this.set('level', lerp(this.from, this.to, ease(clamp((this.p - .2) / .5))));
    if (this.drive === 'down') this.set('level', lerp(this.from, this.to, ease(clamp((this.p - .3) / .5))));
    if (this.drive === 'rights') this.set('level', clamp(.12 + this.rights * .22));
    this.blend();
  }
  /* صورتان للوحة: الثانية تمتزج فوق الأولى مع القراءة أو مع فتح الحقوق */
  blend() {
    if (!this.imgB) return;
    const t = this.drive === 'down' ? 1 - clamp(this.st.level / (this.from || 1)) : this.drive === 'rights' ? this.rights / 4 : 0;
    this.imgB.style.opacity = t.toFixed(3);
  }
  frame(now) {
    if (!this.vis || this.img) return;
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
Object.defineProperty(Plate.prototype, 'rights', { get() { return this._rights || 0; }, set(v) { this._rights = v; this.dirty = true; this.blend(); } });

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
  tabs($('[data-scrub]'), i => road.set('haze', haze[i]));

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

fetch('img/manifest.json').then(r => r.ok ? r.json() : {}).catch(() => ({})).then(m => { manifest = m || {}; init(); });
})();
