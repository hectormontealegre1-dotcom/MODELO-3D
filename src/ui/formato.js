// Formato numérico en español: coma decimal y espacio fino como separador de miles (1 000).
export function fmt(x, dec = 1) {
  if (x == null || !Number.isFinite(x)) return '—';
  const neg = x < 0;
  const [ent, frac] = Math.abs(x).toFixed(dec).split('.');
  const entero = ent.length > 3 ? ent.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : ent;
  const s = frac ? `${entero},${frac}` : entero;
  return neg && Number(s.replace(',', '.').replace(/ /g, '')) !== 0 ? `−${s}` : s;
}

export function fmtTiempo(seg) {
  const s = Math.max(0, Math.round(seg));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const dos = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${dos(m)}:${dos(ss)}` : `${dos(m)}:${dos(ss)}`;
}

export function fmtDuracion(seg) {
  if (seg < 120) return `${fmt(seg, 0)} s`;
  if (seg < 7200) return `${fmt(seg / 60, seg % 60 ? 1 : 0)} min`;
  return `${fmt(seg / 3600, 1)} h`;
}
