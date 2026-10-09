// Secuencia de operación del banco, enclavamientos y estado de los instrumentos.
import { BANCO } from '../data/banco.js';
import { GASES, CASOS, CASO_LIBRE } from '../data/casos.js';
import * as F from './fisica.js';

export const FASES = [
  { id: 'reposo', nombre: 'Reposo' },
  { id: 'purga', nombre: 'Purga con gas' },
  { id: 'rampa', nombre: 'Rampa de tensión' },
  { id: 'tratamiento', nombre: 'Tratamiento' },
  { id: 'postpurga', nombre: 'Post-purga' },
  { id: 'listo', nombre: 'Listo para análisis' },
];

const VELOCIDADES = [1, 2, 5, 10, 20, 30, 60, 120];

export function velocidadSugerida(t) {
  const objetivo = t / 25;
  let v = VELOCIDADES[0];
  for (const c of VELOCIDADES) if (c <= Math.max(1, objetivo)) v = c;
  return v;
}

export { VELOCIDADES };

export class Proceso {
  constructor() {
    this.oyentes = new Set();
    this.p = {
      caso: 'kilonzo_ecoli',
      gas: 'aire',
      Q: 2,
      HR: 40,
      modo: 'abierto',
      d: 3,
      V: 22,
      f: 10,
      t: 240,
      masa: 15,
      velocidad: 10,
    };
    this.ajustesCaso = [];
    this.reiniciar();
    this.aplicarCaso('kilonzo_ecoli');
  }

  on(fn) {
    this.oyentes.add(fn);
    return () => this.oyentes.delete(fn);
  }
  emitir(tipo) {
    for (const fn of this.oyentes) fn(tipo, this);
  }

  get caso() {
    return CASOS.find((c) => c.id === this.p.caso) || CASO_LIBRE;
  }
  get comp() {
    return GASES[this.p.gas].comp;
  }

  reiniciar() {
    this.fase = 'reposo';
    this.tFase = 0;
    this.tSim = 0;
    this.tTrat = 0;
    this.Vact = 0;
    this.E = 0;
    this.Tgas = F.T_AMB;
    this.Tsus = F.T_AMB;
    this.O3 = 0;
    this.O3amb = 0;
    this.flujo = false;
    this.paro = false;
    this.puertaAbierta = false;
    this.alarmas = [];
    this.historial = [];
    this.bitacora = [];
    this.pausado = false;
    this.listoParaAnalisis = false;
    this._muestreo = 0;
    this.actualizarDescarga();
  }

  registrar(msg) {
    this.bitacora.unshift({ t: this.tSim, msg });
    if (this.bitacora.length > 8) this.bitacora.pop();
  }

  set(clave, valor) {
    this.p[clave] = valor;
    if (clave === 'caso') this.aplicarCaso(valor);
    this.actualizarDescarga();
    this.emitir('parametros');
  }

  aplicarCaso(id) {
    const c = CASOS.find((x) => x.id === id) || CASO_LIBRE;
    this.p.caso = c.id;
    this.ajustesCaso = [];
    const a = c.ajuste;
    if (a) {
      this.p.gas = a.gas;
      this.p.modo = a.modo;
      this.p.d = a.d;
      this.p.t = a.t;
      this.p.masa = a.masa;
      this.p.f = 10;
      if (a.P != null) {
        const V = F.tensionParaPotencia(a.P, { f: this.p.f, d: a.d, comp: GASES[a.gas].comp, modo: a.modo });
        this.p.V = Math.min(BANCO.vMax, Math.round(V * 10) / 10);
      } else {
        this.p.V = a.V;
      }
      if (/35 mm/.test(c.condiciones)) this.ajustesCaso.push('Separación reducida de 35 mm a 3 mm: con 30 kV el aire no enciende sobre 8 mm.');
      if (a.P != null && /1 000 W|800 W/.test(c.condiciones)) this.ajustesCaso.push('Potencia limitada a 500 W, el máximo de la fuente del banco.');
      if (/50 kV/.test(c.condiciones)) this.ajustesCaso.push('Tensión limitada a 30 kV, el máximo de la fuente del banco.');
      if (/90 kV/.test(c.condiciones)) this.ajustesCaso.push('Tensión limitada a 30 kV; el estudio usó 90 kV.');
      if (!c.condiciones.match(/aire|N₂|O₂|CO₂|He|Ar/i)) this.ajustesCaso.push('Gas de trabajo no informado en la revisión: se usa aire.');
      if (a.P != null) this.ajustesCaso.push(`Tensión fijada en ${String(this.p.V).replace('.', ',')} kV para entregar ≈ ${a.P > BANCO.pMax ? BANCO.pMax : a.P} W con d = ${a.d} mm.`);
      this.p.velocidad = velocidadSugerida(a.t);
      this.casoAjuste = { gas: a.gas, modo: a.modo };
    } else {
      this.casoAjuste = null;
    }
    if (this.fase !== 'reposo') this.detener();
    this.reiniciar();
  }

  // ¿Las condiciones actuales siguen siendo las que se aplicaron desde el caso?
  get referenciaAplicable() {
    if (!this.casoAjuste) return false;
    return this.p.gas === this.casoAjuste.gas && this.p.modo === this.casoAjuste.modo;
  }

  actualizarDescarga() {
    const V = this.Vact;
    this.des = F.descarga({ V, f: this.p.f, d: this.p.d, comp: this.comp, modo: this.p.modo });
    this.desObjetivo = F.descarga({ V: this.p.V, f: this.p.f, d: this.p.d, comp: this.comp, modo: this.p.modo });
  }

  get P() {
    return this.altaTension ? this.des.P : 0;
  }
  get altaTension() {
    return (this.fase === 'rampa' || this.fase === 'tratamiento') && this.Vact > 0.05;
  }
  get plasma() {
    return this.altaTension && this.des.enciende;
  }

  duracionPurga() {
    if (this.p.modo === 'envase') return 30;
    return (3 * BANCO.volCamara) / this.p.Q * 60;
  }

  iniciar() {
    if (this.paro) return this.registrar('Rearme el paro de emergencia antes de iniciar.');
    if (this.puertaAbierta) return this.registrar('Cierre la puerta de la jaula (XS-801) antes de iniciar.');
    if (this.fase === 'listo' || this.fase === 'reposo') {
      this.reiniciar();
      this.fase = 'purga';
      this.flujo = true;
      this.registrar(this.p.modo === 'envase' ? 'Barrido del envase con el gas de trabajo y sellado.' : 'Purga: 3 volúmenes de cámara con el gas de trabajo.');
      this.emitir('fase');
    } else if (this.pausado) {
      this.pausado = false;
      this.emitir('fase');
    }
  }

  pausar() {
    this.pausado = !this.pausado;
    this.emitir('fase');
  }

  // Salto directo a un estado de la secuencia (modo Presentar). Cada paso del recorrido parte de cero,
  // así avanzar o retroceder deja el banco en un estado coherente.
  // fase: 'reposo' | 'purga' | 'tratamiento' (con avance 0–1 del tiempo de exposición) | 'postpurga' | 'final'
  irAFase(fase, avance = 0) {
    this.reiniciar();
    if (fase === 'reposo' || !fase) {
      this.emitir('fase');
      return;
    }
    this.flujo = true;
    if (fase === 'purga') {
      this.fase = 'purga';
      this.registrar('Purga: 3 volúmenes de cámara con el gas de trabajo.');
      this.emitir('fase');
      return;
    }
    this.fase = 'tratamiento';
    this.Vact = this.p.V;
    this.actualizarDescarga();
    this.registrar('Inicio del tiempo de exposición.');
    const objetivo = Math.max(0, Math.min(1, avance)) * this.p.t;
    for (let i = 0; i < 40000; i++) {
      if (fase === 'tratamiento' && (this.fase !== 'tratamiento' || this.tFase >= objetivo)) break;
      if (fase === 'postpurga' && this.fase === 'postpurga') break;
      if (fase === 'final' && this.fase === 'listo') break;
      this._paso(0.5);
    }
    this.emitir('fase');
  }

  detener() {
    if (this.fase === 'reposo') return;
    this.Vact = 0;
    if (this.fase === 'rampa' || this.fase === 'tratamiento') {
      this.fase = 'postpurga';
      this.tFase = 0;
      this.registrar('Tratamiento detenido por el operador; alta tensión desconectada.');
    } else {
      this.fase = 'reposo';
      this.flujo = false;
    }
    this.actualizarDescarga();
    this.emitir('fase');
  }

  pararEmergencia() {
    this.paro = !this.paro;
    if (this.paro) {
      this.Vact = 0;
      if (this.fase !== 'reposo' && this.fase !== 'listo') {
        this.fase = 'postpurga';
        this.tFase = 0;
      }
      this.registrar('Paro de emergencia (HS-802): alta tensión cortada.');
    } else {
      this.registrar('Paro de emergencia rearmado.');
    }
    this.actualizarDescarga();
    this.emitir('fase');
  }

  alternarPuerta() {
    this.puertaAbierta = !this.puertaAbierta;
    if (this.puertaAbierta) {
      if (this.altaTension) {
        this.Vact = 0;
        this.fase = 'postpurga';
        this.tFase = 0;
        this.registrar('Puerta abierta durante el tratamiento: el enclavamiento XS-801 cortó la alta tensión.');
      } else {
        this.registrar('Puerta de la jaula abierta.');
      }
    } else {
      this.registrar('Puerta de la jaula cerrada.');
    }
    this.actualizarDescarga();
    this.emitir('fase');
  }

  velocidadFase() {
    if (this.fase === 'purga' || this.fase === 'postpurga') return Math.max(this.p.velocidad, this.duracionPurga() / 6);
    if (this.fase === 'rampa') return 1;
    return this.p.velocidad;
  }

  paso(dtReal) {
    if (this.pausado) return;
    const dt = Math.min(dtReal, 0.1) * this.velocidadFase();
    const sub = Math.max(1, Math.ceil(dt / 0.5));
    for (let i = 0; i < sub; i++) this._paso(dt / sub);
  }

  _paso(dt) {
    this.tSim += dt;
    this.tFase += dt;
    const p = this.p;
    const cambioFase = (nueva, msg) => {
      this.fase = nueva;
      this.tFase = 0;
      if (msg) this.registrar(msg);
      this.emitir('fase');
    };

    switch (this.fase) {
      case 'purga':
        if (this.tFase >= this.duracionPurga()) cambioFase('rampa', `Rampa de tensión hasta ${fmt1(p.V)} kV.`);
        break;
      case 'rampa': {
        const Vrampa = Math.min(p.V, (this.tFase / 3) * p.V);
        const antes = this.des.enciende;
        this.Vact = Vrampa;
        this.actualizarDescarga();
        if (!antes && this.des.enciende) this.registrar(`Encendido de la descarga a ${fmt1(this.des.Vign)} kV.`);
        if (this.tFase >= 3) {
          if (!this.des.enciende) this.registrar(`Sin descarga: ${fmt1(p.V)} kV no alcanza el encendido (${fmt1(this.desObjetivo.Vign)} kV). Reduzca d o cambie el gas.`);
          cambioFase('tratamiento', 'Inicio del tiempo de exposición.');
        }
        break;
      }
      case 'tratamiento':
        this.Vact = p.V;
        this.actualizarDescarga();
        if (this.plasma) this.tTrat += dt;
        if (this.tFase >= p.t) {
          this.Vact = 0;
          this.actualizarDescarga();
          cambioFase('postpurga', p.modo === 'envase' ? 'Fin del tratamiento. El envase permanece sellado con las especies generadas.' : 'Fin del tratamiento; purga para evacuar el ozono.');
        }
        break;
      case 'postpurga':
        this.Vact = 0;
        if (this.tFase >= (p.modo === 'envase' ? 10 : this.duracionPurga())) {
          this.flujo = false;
          this.listoParaAnalisis = true;
          cambioFase('listo', 'Ciclo terminado: muestra lista para el recuento o el análisis químico.');
        }
        break;
      default:
        break;
    }

    // Energía (E = P·t)
    const P = this.P;
    this.E += P * dt;

    // Temperatura del gas: primer orden, ilustrativo (30 a 60 °C esperados).
    const Qef = this.flujo && p.modo === 'abierto' ? p.Q : 0;
    const G = 10 + 2.5 * Qef;
    const TgSS = F.T_AMB + P / G;
    this.Tgas += ((TgSS - this.Tgas) * dt) / (900 / G);
    // Temperatura del sustrato: anclada a +28,9 °C con 1 000 W y 720 s.
    const TsSS = F.T_AMB + 0.0304 * P;
    this.Tsus += ((TsSS - this.Tsus) * dt) / 240;

    // Ozono a la salida o en el envase (ppm, ilustrativo).
    const Csat = F.ozonoSaturacion(this.comp, p.HR);
    if (p.modo === 'abierto') {
      const SIE = this.flujo && p.Q > 0 ? P / (p.Q / 60) : 0;
      const Cobj = Csat * (1 - Math.exp(-SIE / F.SIE0));
      const tau = (BANCO.volCamara / Math.max(p.Q, 0.01)) * 60 * (this.flujo ? 1 : 8);
      this.O3 += ((Cobj - this.O3) * dt) / tau;
    } else {
      const dC = (P * dt) / BANCO.volEnvase / F.SIE0;
      this.O3 += (Csat - this.O3) * (1 - Math.exp(-dC));
      this.O3 -= this.O3 * (dt / 3600);
    }
    // Ozono ambiental: fuga si la puerta se abre con ozono en la cámara.
    const fuga = this.puertaAbierta && p.modo === 'abierto' ? this.O3 * 0.0006 : 0;
    this.O3amb += ((fuga + this.O3 * 0.00002 - this.O3amb) * dt) / 20;
    if (this.puertaAbierta && p.modo === 'abierto' && this.O3 > 5 && this.fase !== 'reposo') this.O3 -= this.O3 * (dt / 30);

    // Alarmas
    const al = [];
    if (this.O3amb > 0.1) al.push({ nivel: 'critica', texto: `Ozono ambiental ${fmt2(this.O3amb)} ppm (AI-503): cierre la puerta y espere la post-purga.` });
    if (this.Tgas > 60) al.push({ nivel: 'aviso', texto: 'Temperatura del gas sobre 60 °C: fuera del intervalo informado para alimentos.' });
    if (this.plasma && this.des.limitada) al.push({ nivel: 'aviso', texto: 'La fuente opera en su límite de 500 W.' });
    if (this.fase === 'tratamiento' && !this.des.enciende) al.push({ nivel: 'aviso', texto: 'Sin descarga: la tensión no alcanza el encendido.' });
    if (this.paro) al.push({ nivel: 'critica', texto: 'Paro de emergencia activado.' });
    if (this.puertaAbierta) al.push({ nivel: 'info', texto: 'Puerta abierta: alta tensión bloqueada.' });
    this.alarmas = al;
    if (this.O3amb > 0.1 && this.altaTension) {
      this.Vact = 0;
      this.fase = 'postpurga';
      this.tFase = 0;
      this.registrar('Ozono ambiental sobre 0,1 ppm: corte automático de la alta tensión.');
    }

    // Historial para las tendencias
    this._muestreo += dt;
    if (this._muestreo >= Math.max(0.5, this.velocidadFase() * 0.1)) {
      this._muestreo = 0;
      this.historial.push({ t: this.tSim, Tgas: this.Tgas, Tsus: this.Tsus, O3: this.O3, P });
      if (this.historial.length > 900) this.historial.splice(0, this.historial.length - 900);
    }
  }

  // Resultado de referencia en función del tiempo de exposición.
  curvaReferencia(t) {
    const c = this.caso;
    const r = c.resultado;
    if (!r || (r.tipo !== 'log' && r.tipo !== 'pct')) return null;
    const tRef = r.tDato || c.tMax;
    const tt = Math.min(t, tRef);
    if (r.tipo === 'log') return (r.valor * tt) / tRef;
    if (r.valor < 0) return (r.valor * tt) / tRef; // aumento de la toxina (Durek et al., 2018)
    const k = c.k || Math.log(1 / (1 - r.valor / 100)) / tRef;
    return (1 - Math.exp(-k * tt)) * 100;
  }

  get progreso() {
    return this.curvaReferencia(this.tTrat) ?? 0;
  }

  get fraccionCaso() {
    const c = this.caso;
    const r = c.resultado;
    if (!r || r.tipo === 'cualitativo' || r.tipo === 'ninguno') return Math.min(1, this.tTrat / (c.tMax || 1));
    const v = this.progreso;
    return Math.min(1, Math.abs(v) / Math.abs(r.valor));
  }
}

// Consignas de los controladores de caudal según la mezcla elegida.
export function consignasMFC(gasId, Q) {
  if (gasId === 'aire') return { m1: { fuente: 'aire', q: Q }, m2: 0, m3: { gas: null, q: 0 } };
  const x = F.normalizar(GASES[gasId].comp);
  const aux = x.CO2 > 0 ? 'CO2' : x.Ar > 0 ? 'Ar' : x.He > 0 ? 'He' : null;
  return { m1: { fuente: 'n2', q: Q * x.N2 }, m2: Q * x.O2, m3: { gas: aux, q: Q * (x.CO2 + x.Ar + x.He) } };
}

export function fmt1(x) {
  return (Math.round(x * 10) / 10).toFixed(1).replace('.', ',');
}
function fmt2(x) {
  return x.toFixed(2).replace('.', ',');
}
