// Modelo físico del banco DBD.
// Del informe: Ecuaciones 1, 2 y 4, E = P·t, intervalos de 1 a 10 eV y de 30 a 60 °C.
// Supuestos de ingeniería (marcados en la ficha): ruptura del gas, ecuación de Manley, modelos térmicos y de ozono.
import { BANCO } from '../data/banco.js';

export const KB_EV = 8.617333e-5; // eV/K (Ecuación 4)
export const EPS0 = 8.854e-12; // F/m
export const T_AMB = 25; // °C, la misma referencia de 298,15 K del informe

export const GASES_BASE = ['N2', 'O2', 'CO2', 'Ar', 'He'];

// Rigidez dieléctrica relativa aproximada (N₂ = 1). Supuesto de ingeniería.
const RIGIDEZ = { N2: 1.0, O2: 0.9, CO2: 0.9, Ar: 0.2, He: 0.12 };
const R_AIRE = 0.78 * RIGIDEZ.N2 + 0.21 * RIGIDEZ.O2 + 0.01 * RIGIDEZ.Ar;

export function normalizar(comp) {
  const x = {};
  let s = 0;
  for (const g of GASES_BASE) s += comp[g] || 0;
  for (const g of GASES_BASE) x[g] = s > 0 ? (comp[g] || 0) / s : 0;
  return x;
}

export function rigidezRelativa(comp) {
  const x = normalizar(comp);
  let r = 0;
  for (const g of GASES_BASE) r += x[g] * RIGIDEZ[g];
  return r / R_AIRE;
}

// Tensión de ruptura del aire en campo uniforme a 1 atm (kV), d en mm.
export function rupturaAire(dmm) {
  const d = dmm / 10;
  return 24.4 * d + 6.53 * Math.sqrt(d);
}

// Capacidades equivalentes: dieléctrico (dos barreras en serie, más la película del envase) y gas.
export function capacidades(dmm, modo = 'abierto') {
  const A = Math.PI * (BANCO.electrodoDiam / 2) ** 2;
  let espEq = (2 * BANCO.barreraEsp) / BANCO.barreraEr;
  if (modo === 'envase') espEq += (2 * 0.0001) / 3.2; // dos películas de PET de 0,1 mm
  const Cd = (EPS0 * A) / espEq;
  const Cg = (EPS0 * A) / (dmm / 1000);
  return { A, Cd, Cg, Ccel: (Cd * Cg) / (Cd + Cg) };
}

// Estado eléctrico estacionario de la descarga para una tensión pico V (kV) y frecuencia f (kHz).
export function descarga({ V, f, d, comp, modo }) {
  const { Cd, Cg, Ccel } = capacidades(d, modo);
  const Vb = rupturaAire(d) * rigidezRelativa(comp); // kV en el gas
  const Vign = Vb * (1 + Cg / Cd); // kV aplicados
  const fHz = f * 1000;
  const k = 4 * fHz * Cd * Vb * 1000; // W por voltio sobre el encendido
  let Vef = V;
  let P = V > Vign ? k * (V - Vign) * 1000 : 0;
  let limitada = false;
  if (P > BANCO.pMax) {
    limitada = true;
    P = BANCO.pMax;
    Vef = Vign + BANCO.pMax / k / 1000;
  }
  return { Vb, Vign, enciende: V > Vign, P, Vef, limitada, Cd, Cg, Ccel, f };
}

// Tensión pico necesaria para una potencia objetivo (kV).
export function tensionParaPotencia(P, { f, d, comp, modo }) {
  const { Cd } = capacidades(d, modo);
  const Vb = rupturaAire(d) * rigidezRelativa(comp);
  const { Cg } = capacidades(d, modo);
  const Vign = Vb * (1 + Cg / Cd);
  const k = 4 * f * 1000 * Cd * Vb * 1000;
  return Vign + P / k / 1000;
}

// Formas de onda de dos períodos (modelo de carga con recorte de la tensión del gas).
// Devuelve t (µs), V (kV), I (mA), Q (nC).
export function formaDeOnda(des, Vpico, n = 360, conPulsos = true) {
  const f = des.f * 1000;
  const T = 1 / f;
  const w = 2 * Math.PI * f;
  const { Cd, Ccel } = des;
  const Vb = des.Vb * 1000;
  const V0 = Vpico * 1000;
  const activo = des.enciende && Vpico > 0;
  const pasos = n * 2;
  const dt = (2 * T) / pasos;
  let Q = 0;
  let Vprev = 0;
  const out = { t: [], V: [], I: [], Q: [], descarga: [] };
  // un período previo para llegar al régimen
  for (let i = -pasos; i < pasos; i++) {
    const t = (i + pasos) * dt;
    const Vn = V0 * Math.sin(w * t);
    const dV = Vn - Vprev;
    let Qn = Q + Ccel * dV;
    let enDescarga = false;
    if (activo) {
      const Vg = Vn - Qn / Cd;
      if (Vg > Vb) {
        Qn = Cd * (Vn - Vb);
        enDescarga = true;
      } else if (Vg < -Vb) {
        Qn = Cd * (Vn + Vb);
        enDescarga = true;
      }
    }
    const I = (Qn - Q) / dt;
    Q = Qn;
    Vprev = Vn;
    if (i >= 0) {
      out.t.push((i * dt) * 1e6);
      out.V.push(Vn / 1000);
      out.I.push(I * 1000);
      out.Q.push(Q * 1e9);
      out.descarga.push(enDescarga);
    }
  }
  if (conPulsos && activo) {
    // Pulsos de microdescarga superpuestos (representación visual).
    let Imax = 0;
    for (const v of out.I) Imax = Math.max(Imax, Math.abs(v));
    for (let i = 0; i < out.I.length; i++) {
      if (out.descarga[i] && Math.random() < 0.18) {
        out.I[i] += Math.sign(out.I[i] || 1) * Imax * (1.5 + 4 * Math.random());
      }
    }
  }
  return out;
}

// Ecuación 4: temperatura equivalente de los electrones.
export function tempElectrones(eV) {
  return eV / KB_EV;
}

// Ecuaciones 1 y 2.
export function inactivacionPct(R) {
  return (1 - Math.pow(10, -R)) * 100;
}

// Indicadores cualitativos de especies (0–1) según el gas, la humedad y la potencia relativa.
export function especies(comp, HR, Pn) {
  const x = normalizar(comp);
  const h = HR / 100;
  const oxi = Math.min(1, x.O2 + 0.3 * x.CO2);
  const noble = x.Ar + x.He;
  const s = {
    O: Math.sqrt(oxi),
    O3: Math.sqrt(oxi) * (1 - 0.4 * h),
    OH: h * (0.55 + 0.45 * (1 - noble)),
    H2O2: 0.7 * h,
    NOx: Math.min(1, 4 * x.N2 * x.O2),
    N2: x.N2,
    UV: Math.min(1, 0.7 * x.N2 + 0.5 * noble + 0.2 * x.CO2),
  };
  for (const k in s) s[k] = Math.max(0, Math.min(1, s[k])) * Pn;
  return s;
}

export const ESPECIES_INFO = [
  { clave: 'O', nombre: 'O', desc: 'Oxígeno atómico' },
  { clave: 'O3', nombre: 'O₃', desc: 'Ozono' },
  { clave: 'OH', nombre: 'OH•', desc: 'Radical hidroxilo' },
  { clave: 'H2O2', nombre: 'H₂O₂', desc: 'Peróxido de hidrógeno' },
  { clave: 'NOx', nombre: 'NOₓ', desc: 'Óxidos de nitrógeno' },
  { clave: 'N2', nombre: 'N₂*/N₂⁺', desc: 'Nitrógeno excitado e ionizado' },
  { clave: 'UV', nombre: 'UV', desc: 'Radiación ultravioleta' },
];

// Bandas de emisión (nm). Posiciones de tablas espectroscópicas generales.
const BANDAS = [
  { nm: 236.3, esp: 'NO', w: 0.5, mol: true },
  { nm: 247.1, esp: 'NO', w: 0.6, mol: true },
  { nm: 258.8, esp: 'NO', w: 0.4, mol: true },
  { nm: 309.0, esp: 'OH', w: 1.0, mol: true },
  { nm: 315.9, esp: 'N2', w: 0.55, mol: true },
  { nm: 337.1, esp: 'N2', w: 1.0, mol: true },
  { nm: 357.7, esp: 'N2', w: 0.7, mol: true },
  { nm: 380.5, esp: 'N2', w: 0.35, mol: true },
  { nm: 405.9, esp: 'N2', w: 0.15, mol: true },
  { nm: 391.4, esp: 'N2+', w: 1.0, mol: true },
  { nm: 427.8, esp: 'N2+', w: 0.45, mol: true },
  { nm: 451.1, esp: 'CO', w: 0.5, mol: true },
  { nm: 483.5, esp: 'CO', w: 0.6, mol: true },
  { nm: 519.8, esp: 'CO', w: 0.4, mol: true },
  { nm: 501.6, esp: 'He', w: 0.3 },
  { nm: 587.6, esp: 'He', w: 0.8 },
  { nm: 656.3, esp: 'H', w: 0.5 },
  { nm: 667.8, esp: 'He', w: 0.35 },
  { nm: 696.5, esp: 'Ar', w: 0.5 },
  { nm: 706.5, esp: 'He', w: 1.0 },
  { nm: 750.4, esp: 'Ar', w: 0.8 },
  { nm: 763.5, esp: 'Ar', w: 1.0 },
  { nm: 777.4, esp: 'O', w: 1.0 },
  { nm: 811.5, esp: 'Ar', w: 0.9 },
  { nm: 844.6, esp: 'O', w: 0.5 },
];

export const ETIQUETAS_OES = {
  NO: 'NO γ',
  OH: 'OH',
  N2: 'N₂',
  'N2+': 'N₂⁺',
  CO: 'CO',
  He: 'He',
  H: 'Hα',
  Ar: 'Ar',
  O: 'O',
};

export function pesosEmision(comp, HR, Pn) {
  const x = normalizar(comp);
  const h = HR / 100;
  const sp = especies(comp, HR, 1);
  return {
    NO: sp.NOx * Pn,
    OH: sp.OH * Pn,
    N2: x.N2 * (1 - 0.5 * x.O2) * Pn,
    'N2+': (0.35 * x.N2 + (x.He > 0.5 ? 0.3 : 0)) * Pn,
    CO: x.CO2 * Pn,
    He: x.He * Pn,
    H: 0.5 * h * Pn,
    Ar: x.Ar * Pn,
    O: sp.O * 0.8 * Pn,
  };
}

export function espectro(pesos, nmMin = 200, nmMax = 900, paso = 0.75) {
  const nm = [];
  const I = [];
  for (let l = nmMin; l <= nmMax; l += paso) {
    let s = 0;
    for (const b of BANDAS) {
      const a = (pesos[b.esp] || 0) * b.w;
      if (a <= 0) continue;
      const dl = l - b.nm;
      if (b.mol) {
        // banda molecular degradada hacia el violeta
        if (dl >= 0) s += a * Math.exp(-(dl * dl) / (2 * 0.9 * 0.9));
        else s += a * (0.75 * Math.exp(dl / 3.2) + 0.25 * Math.exp(-(dl * dl) / (2 * 0.9 * 0.9)));
      } else {
        s += a * Math.exp(-(dl * dl) / (2 * 0.6 * 0.6));
      }
    }
    nm.push(l);
    I.push(s);
  }
  return { nm, I, bandas: BANDAS };
}

// Color visual de la descarga según el gas (para la escena).
const COLOR_GAS = { N2: [0.48, 0.42, 1.0], O2: [0.75, 0.8, 1.0], CO2: [0.62, 0.72, 1.0], Ar: [0.78, 0.55, 1.0], He: [1.0, 0.6, 0.72] };
export function colorPlasma(comp) {
  const x = normalizar(comp);
  const c = [0, 0, 0];
  for (const g of GASES_BASE) for (let i = 0; i < 3; i++) c[i] += x[g] * COLOR_GAS[g][i];
  return c;
}

export function esDifusa(comp) {
  const x = normalizar(comp);
  return x.He + x.Ar > 0.9;
}

// Ozono a la salida (ppm). Orden de magnitud ilustrativo.
export function ozonoSaturacion(comp, HR) {
  const x = normalizar(comp);
  const oxi = Math.min(1, x.O2 + 0.3 * x.CO2);
  return 4000 * Math.pow(oxi, 0.6) * (1 - 0.4 * (HR / 100));
}
export const SIE0 = 2000; // J/L
