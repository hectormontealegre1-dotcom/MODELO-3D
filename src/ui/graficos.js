// Gráficos en canvas: osciloscopio, Lissajous Q–V, espectro de emisión, tendencias y curva de referencia.
// Reglas: un solo eje y por gráfico, líneas de 2 px, cuadrícula tenue, texto con tokens de tinta.
import { fmt } from './formato.js';
import { ETIQUETAS_OES } from '../sim/fisica.js';

let tokens = null;
export function leerTokens() {
  const cs = getComputedStyle(document.documentElement);
  const v = (n) => cs.getPropertyValue(n).trim();
  tokens = {
    ink: v('--ink'),
    ink2: v('--ink-2'),
    muted: v('--muted'),
    grid: v('--chart-grid'),
    axis: v('--chart-axis'),
    surface: v('--surface-solid'),
    accent: v('--accent'),
    s1: v('--s1'),
    s2: v('--s2'),
    s3: v('--s3'),
    s4: v('--s4'),
    crit: v('--crit'),
    mono: '"IBM Plex Mono", ui-monospace, monospace',
    sans: '"IBM Plex Sans", system-ui, sans-serif',
  };
  return tokens;
}

function preparar(canvas) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (!w || !h) return null;
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  return { ctx, w, h };
}

function txt(ctx, s, x, y, { color = tokens.muted, tam = 11, alinear = 'left', base = 'middle', fuente = tokens.mono, peso = 400 } = {}) {
  ctx.font = `${peso} ${tam}px ${fuente}`;
  ctx.fillStyle = color;
  ctx.textAlign = alinear;
  ctx.textBaseline = base;
  ctx.fillText(s, x, y);
}

function linea(ctx, xs, ys, sx, sy, color, ancho = 2) {
  ctx.strokeStyle = color;
  ctx.lineWidth = ancho;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  for (let i = 0; i < xs.length; i++) {
    const x = sx(xs[i]);
    const y = sy(ys[i]);
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke();
}

function ejes(ctx, area, { xTicks, yTicks, sx, sy, xFmt, yFmt, xTitulo, yTitulo }) {
  ctx.strokeStyle = tokens.grid;
  ctx.lineWidth = 1;
  for (const t of yTicks) {
    const y = Math.round(sy(t)) + 0.5;
    ctx.beginPath();
    ctx.moveTo(area.x0, y);
    ctx.lineTo(area.x1, y);
    ctx.stroke();
    txt(ctx, yFmt(t), area.x0 - 6, y, { alinear: 'right' });
  }
  ctx.strokeStyle = tokens.axis;
  ctx.beginPath();
  ctx.moveTo(area.x0, area.y1 + 0.5);
  ctx.lineTo(area.x1, area.y1 + 0.5);
  ctx.stroke();
  for (const t of xTicks) txt(ctx, xFmt(t), sx(t), area.y1 + 12, { alinear: 'center' });
  if (xTitulo) txt(ctx, xTitulo, area.x1, area.y1 + 26, { alinear: 'right', color: tokens.ink2 });
  if (yTitulo) txt(ctx, yTitulo, area.x0 - 6, area.y0 - 12, { alinear: 'left', color: tokens.ink2 });
}

function ticksLindos(min, max, n = 4) {
  const rango = max - min || 1;
  const paso0 = rango / n;
  const mag = Math.pow(10, Math.floor(Math.log10(paso0)));
  const paso = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((p) => p >= paso0) || mag * 10;
  const t = [];
  for (let v = Math.ceil(min / paso) * paso; v <= max + paso * 1e-6; v += paso) t.push(Math.round(v / paso) * paso);
  return t;
}

// Menor valor «redondo» (1, 2, 2,5, 5 × 10ⁿ) mayor o igual que m.
function techo(m) {
  const mag = Math.pow(10, Math.floor(Math.log10(Math.max(m, 1e-9))));
  return [1, 2, 2.5, 5, 10].map((k) => k * mag).find((v) => v >= m - 1e-9);
}

// Cruz de lectura y tooltip compartidos por los gráficos con eje x continuo.
function hover(ctx, canvas, area, sx, xs, series, xFmt) {
  const mx = canvas._mx;
  if (mx == null || mx < area.x0 || mx > area.x1 || !xs.length) return;
  let iMin = 0;
  let dMin = Infinity;
  for (let i = 0; i < xs.length; i++) {
    const d = Math.abs(sx(xs[i]) - mx);
    if (d < dMin) {
      dMin = d;
      iMin = i;
    }
  }
  const x = sx(xs[iMin]);
  ctx.strokeStyle = tokens.axis;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 0.5, area.y0);
  ctx.lineTo(x + 0.5, area.y1);
  ctx.stroke();
  const filas = [xFmt(xs[iMin]), ...series.map((s) => `${s.nombre}: ${s.fmt(s.ys[iMin])}`)];
  ctx.font = `400 11px ${tokens.mono}`;
  const ancho = Math.max(...filas.map((f) => ctx.measureText(f).width)) + 16;
  const alto = filas.length * 15 + 8;
  let bx = x + 8;
  if (bx + ancho > area.x1) bx = x - 8 - ancho;
  const by = area.y0 + 4;
  ctx.fillStyle = tokens.surface;
  ctx.strokeStyle = tokens.axis;
  ctx.beginPath();
  ctx.roundRect(bx, by, ancho, alto, 4);
  ctx.fill();
  ctx.stroke();
  filas.forEach((f, i) => {
    if (i > 0 && series[i - 1].color) {
      ctx.fillStyle = series[i - 1].color;
      ctx.fillRect(bx + 6, by + 8 + i * 15 - 3, 6, 6);
    }
    txt(ctx, f, bx + (i > 0 && series[i - 1].color ? 16 : 8), by + 10 + i * 15, { color: i ? tokens.ink : tokens.ink2 });
  });
  series.forEach((s) => {
    if (!s.sy || !s.color) return;
    const y = s.sy(s.ys[iMin]);
    ctx.fillStyle = s.color;
    ctx.strokeStyle = tokens.surface;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
}

export function activarHover(canvas) {
  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    canvas._mx = e.clientX - r.left;
  });
  canvas.addEventListener('pointerleave', () => {
    canvas._mx = null;
  });
}

// Osciloscopio: dos franjas con eje de tiempo común (CH1 tensión, CH2 corriente).
export function osciloscopio(canvas, onda) {
  const c = preparar(canvas);
  if (!c) return;
  const { ctx, w, h } = c;
  const x0 = 46;
  const x1 = w - 10;
  const franja = (h - 34) / 2;
  const tMax = onda.t[onda.t.length - 1] || 1;
  const sx = (t) => x0 + (t / tMax) * (x1 - x0);
  const dibujarFranja = (ys, y0, color, titulo, minimo, dec) => {
    const top = techo(Math.max(minimo, ...ys.map(Math.abs)));
    const sy = (v) => y0 + franja / 2 - (v / top) * (franja / 2 - 4);
    ctx.strokeStyle = tokens.grid;
    ctx.lineWidth = 1;
    for (const v of [-top, 0, top]) {
      const y = Math.round(sy(v)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.stroke();
      txt(ctx, fmt(v, dec), x0 - 6, y, { alinear: 'right' });
    }
    linea(ctx, onda.t, ys, sx, sy, color, 1.6);
    txt(ctx, titulo, x0 + 6, y0 + 8, { color: tokens.ink2 });
    return sy;
  };
  const syV = dibujarFranja(onda.V, 4, tokens.s1, 'CH1 · tensión, kV (EI-401)', 10, 0);
  const syI = dibujarFranja(onda.I, 8 + franja, tokens.s2, 'CH2 · corriente, mA (II-402)', 50, 0);
  const ticks = ticksLindos(0, tMax, 4);
  for (const t of ticks) txt(ctx, fmt(t, 0), sx(t), h - 18, { alinear: 'center' });
  txt(ctx, 'µs', x1, h - 6, { alinear: 'right', color: tokens.ink2 });
  hover(ctx, canvas, { x0, x1, y0: 4, y1: h - 26 }, sx, onda.t, [
    { nombre: 'V', ys: onda.V, fmt: (v) => `${fmt(v, 1)} kV`, color: tokens.s1, sy: syV },
    { nombre: 'I', ys: onda.I, fmt: (v) => `${fmt(v, 0)} mA`, color: tokens.s2, sy: syI },
  ], (t) => `${fmt(t, 1)} µs`);
}

// Figura de Lissajous Q–V: su área es la energía por ciclo (E = f⁻¹·P).
export function lissajous(canvas, onda, P, f) {
  const c = preparar(canvas);
  if (!c) return;
  const { ctx, w, h } = c;
  const area = { x0: 50, x1: w - 12, y0: 22, y1: h - 30 };
  const vM = Math.max(10, ...onda.V.map(Math.abs));
  const qM = Math.max(200, ...onda.Q.map(Math.abs));
  const vLim = techo(vM);
  const qLim = techo(qM);
  const tv = [-vLim, -vLim / 2, 0, vLim / 2, vLim];
  const tq = [-qLim, 0, qLim];
  const sx = (v) => area.x0 + ((v + vLim) / (2 * vLim)) * (area.x1 - area.x0);
  const sy = (q) => area.y1 - ((q + qLim) / (2 * qLim)) * (area.y1 - area.y0);
  ejes(ctx, area, { xTicks: tv, yTicks: tq, sx, sy, xFmt: (v) => fmt(v, 0), yFmt: (v) => fmt(v, 0), xTitulo: 'V (kV)', yTitulo: 'Q (nC)' });
  const n = onda.V.length;
  const mitad = Math.floor(n / 2);
  ctx.fillStyle = tokens.accent;
  ctx.globalAlpha = 0.1;
  ctx.beginPath();
  for (let i = mitad; i < n; i++) (i === mitad ? ctx.moveTo : ctx.lineTo).call(ctx, sx(onda.V[i]), sy(onda.Q[i]));
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
  linea(ctx, onda.V.slice(mitad), onda.Q.slice(mitad), sx, sy, tokens.accent, 2);
  const Ec = P > 0 ? (P / (f * 1000)) * 1000 : 0;
  txt(ctx, `Área = ${fmt(Ec, 1)} mJ/ciclo → P = ${fmt(P, 0)} W`, area.x1, area.y0 - 10, { alinear: 'right', color: tokens.ink });
}

// Espectro de emisión con etiquetas en los máximos de cada especie.
export function espectroOES(canvas, esp) {
  const c = preparar(canvas);
  if (!c) return;
  const { ctx, w, h } = c;
  const area = { x0: 34, x1: w - 10, y0: 26, y1: h - 30 };
  const Imax = Math.max(0.05, ...esp.I);
  const sx = (l) => area.x0 + ((l - 200) / 700) * (area.x1 - area.x0);
  const sy = (i) => area.y1 - (i / (Imax * 1.12)) * (area.y1 - area.y0);
  ejes(ctx, area, {
    xTicks: [200, 300, 400, 500, 600, 700, 800, 900], yTicks: [], sx, sy, xFmt: (v) => fmt(v, 0), yFmt: () => '', xTitulo: 'λ (nm)', yTitulo: 'Intensidad relativa (u. a.)',
  });
  ctx.fillStyle = tokens.accent;
  ctx.globalAlpha = 0.1;
  ctx.beginPath();
  ctx.moveTo(sx(esp.nm[0]), sy(0));
  esp.nm.forEach((l, i) => ctx.lineTo(sx(l), sy(esp.I[i])));
  ctx.lineTo(sx(esp.nm[esp.nm.length - 1]), sy(0));
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
  linea(ctx, esp.nm, esp.I, sx, sy, tokens.accent, 1.5);
  // etiqueta solo el máximo de cada especie visible
  const mejores = {};
  for (const b of esp.bandas) {
    const i = Math.round((b.nm - 200) / 0.75);
    const v = esp.I[i] || 0;
    if (v > Imax * 0.12 && (!mejores[b.esp] || v > mejores[b.esp].v)) mejores[b.esp] = { v, nm: b.nm };
  }
  const usados = [];
  Object.entries(mejores)
    .sort((a, b) => b[1].v - a[1].v)
    .forEach(([k, { v, nm }]) => {
      const x = sx(nm);
      if (usados.some((u) => Math.abs(u - x) < 34)) return;
      usados.push(x);
      txt(ctx, ETIQUETAS_OES[k] || k, x, Math.max(area.y0 - 8, sy(v) - 9), { alinear: 'center', color: tokens.ink, tam: 10 });
    });
  if (Imax <= 0.05) txt(ctx, 'Sin emisión: la descarga está apagada', (area.x0 + area.x1) / 2, (area.y0 + area.y1) / 2, { alinear: 'center', color: tokens.muted, fuente: tokens.sans, tam: 12 });
  hover(ctx, canvas, area, sx, esp.nm, [{ nombre: 'I', ys: esp.I, fmt: (v) => fmt(v / Imax, 2), color: null }], (l) => `${fmt(l, 1)} nm`);
}

// Tendencia temporal: varias series con la misma unidad.
export function tendencia(canvas, xs, series, { unidad, yMin = null, yMax = null, dec = 0 }) {
  const c = preparar(canvas);
  if (!c) return;
  const { ctx, w, h } = c;
  const area = { x0: 40, x1: w - 12, y0: 22, y1: h - 28 };
  if (xs.length < 2) {
    txt(ctx, 'Inicie un ciclo para registrar la tendencia', w / 2, h / 2, { alinear: 'center', fuente: tokens.sans, tam: 12 });
    return;
  }
  let lo = Infinity;
  let hi = -Infinity;
  for (const s of series) for (const v of s.ys) {
    lo = Math.min(lo, v);
    hi = Math.max(hi, v);
  }
  if (yMin != null) lo = Math.min(lo, yMin);
  if (yMax != null) hi = Math.max(hi, yMax);
  const ty = ticksLindos(lo, hi + (hi - lo) * 0.05 + 1e-6, 4);
  const yLo = Math.min(lo, ty[0]);
  const yHi = Math.max(hi, ty[ty.length - 1]);
  const t0 = xs[0];
  const t1 = xs[xs.length - 1];
  const sx = (t) => area.x0 + ((t - t0) / Math.max(1e-6, t1 - t0)) * (area.x1 - area.x0);
  const sy = (v) => area.y1 - ((v - yLo) / Math.max(1e-6, yHi - yLo)) * (area.y1 - area.y0);
  const tx = ticksLindos(t0, t1, 4).filter((t) => t >= t0 && t <= t1);
  ejes(ctx, area, { xTicks: tx, yTicks: ty, sx, sy, xFmt: (t) => fmt(t, 0), yFmt: (v) => fmt(v, dec), xTitulo: 't (s)', yTitulo: unidad });
  for (const s of series) {
    linea(ctx, xs, s.ys, sx, sy, s.color, 2);
    const yl = sy(s.ys[s.ys.length - 1]);
    ctx.fillStyle = s.color;
    ctx.strokeStyle = tokens.surface;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(area.x1, yl, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  hover(ctx, canvas, area, sx, xs, series.map((s) => ({ ...s, sy, fmt: (v) => `${fmt(v, dec + 1)} ${unidad}` })), (t) => `t = ${fmt(t, 0)} s`);
}

// Curva de referencia del caso con el avance actual.
export function curvaCaso(canvas, proceso) {
  const c = preparar(canvas);
  if (!c) return;
  const { ctx, w, h } = c;
  const caso = proceso.caso;
  const r = caso.resultado;
  const area = { x0: 44, x1: w - 14, y0: 26, y1: h - 30 };
  if (!r || (r.tipo !== 'log' && r.tipo !== 'pct')) {
    txt(ctx, r && r.tipo === 'cualitativo' ? 'Resultado cualitativo: sin curva numérica' : 'Sin caso de referencia', w / 2, h / 2, { alinear: 'center', fuente: tokens.sans, tam: 12 });
    return;
  }
  const tRef = r.tDato || caso.tMax;
  const tFin = Math.max(tRef, proceso.p.t) * 1.05;
  const esLog = r.tipo === 'log';
  const vRef = r.valor;
  const aumento = vRef < 0; // la toxina aumenta: se grafica ΔC (Ecuación 3) positivo
  const yMax = esLog ? Math.ceil(Math.max(vRef, 1) + 0.5) : aumento ? Math.ceil(-vRef / 10) * 10 + 10 : 100;
  const yMin = 0;
  const sx = (t) => area.x0 + (t / tFin) * (area.x1 - area.x0);
  const sy = (v) => area.y1 - ((v - yMin) / (yMax - yMin)) * (area.y1 - area.y0);
  const yT = esLog || aumento ? ticksLindos(0, yMax, 4) : [0, 25, 50, 75, 100];
  ejes(ctx, area, {
    xTicks: ticksLindos(0, tFin, 4).filter((t) => t <= tFin), yTicks: yT, sx, sy, xFmt: (t) => fmt(t, 0), yFmt: (v) => fmt(v, esLog && yMax < 3 ? 1 : 0),
    xTitulo: 't de exposición (s)', yTitulo: esLog ? 'Reducción R = log₁₀(N₀/N)' : aumento ? 'Aumento de la toxina ΔC (%)' : 'Degradación (%)',
  });
  const n = 80;
  const xs = [];
  const ys = [];
  for (let i = 0; i <= n; i++) {
    const t = (tRef * i) / n;
    xs.push(t);
    const v = proceso.curvaReferencia(t);
    ys.push(aumento ? -v : v);
  }
  const yPlot = (v) => (aumento ? -v : v);
  const aplica = proceso.referenciaAplicable;
  ctx.globalAlpha = aplica ? 1 : 0.35;
  ctx.fillStyle = tokens.accent;
  ctx.globalAlpha *= 0.1;
  ctx.beginPath();
  ctx.moveTo(sx(0), sy(0));
  xs.forEach((t, i) => ctx.lineTo(sx(t), sy(ys[i])));
  ctx.lineTo(sx(tRef), sy(0));
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = aplica ? 1 : 0.35;
  if (caso.cinetica !== 'informada') ctx.setLineDash([5, 4]);
  linea(ctx, xs, ys, sx, sy, tokens.accent, 2);
  ctx.setLineDash([]);
  // valor informado
  const xr = sx(tRef);
  const yr = sy(yPlot(vRef));
  ctx.fillStyle = tokens.accent;
  ctx.strokeStyle = tokens.surface;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(xr, yr, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.globalAlpha = 1;
  const etiqueta = `${r.cota !== '=' ? r.cota + ' ' : ''}${aumento ? '+' : ''}${fmt(esLog ? vRef : Math.abs(vRef), 2)}${esLog ? ' log' : ' %'} informado`;
  txt(ctx, etiqueta, Math.min(xr, area.x1 - 4), Math.max(area.y0 + 4, yr - 12), { alinear: 'right', color: tokens.ink, peso: 500 });
  // avance actual
  const tA = Math.min(proceso.tTrat, tFin);
  if (tA > 0) {
    const vA = yPlot(proceso.progreso);
    ctx.strokeStyle = tokens.ink2;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(sx(tA) + 0.5, area.y0);
    ctx.lineTo(sx(tA) + 0.5, area.y1);
    ctx.stroke();
    ctx.fillStyle = tokens.ink;
    ctx.strokeStyle = tokens.surface;
    ctx.beginPath();
    ctx.arc(sx(tA), sy(vA), 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  hover(ctx, canvas, area, sx, xs, [{ nombre: esLog ? 'R' : 'D', ys, fmt: (v) => (esLog ? `${fmt(v, 2)} log` : `${aumento ? '+' : ''}${fmt(v, 1)} %`), color: tokens.accent, sy }], (t) => `t = ${fmt(t, 0)} s`);
}
