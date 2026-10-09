// Suministro de gases (cilindros, controladores de caudal, humidificador) y línea de escape,
// con partículas que recorren las tuberías según el caudal.
import * as THREE from 'three';
import { M, caja, cilindro, esfera, en, registrar, tubo, pantalla, texturaPunto, rotulo } from './materiales.js';
import { L } from './layout.js';

// Color de hombro de los cilindros (ISO 32) y color de las partículas de cada gas.
const HOMBRO = { aire: 0xffffff, N2: 0x1b1b1b, O2: 0xffffff, CO2: 0x8c8f92, Ar: 0x1f5a3a, He: 0x7a4b2a };
export const COLOR_FLUJO = { aire: 0xdfe6ee, N2: 0x8f86ff, O2: 0x7cc4ff, CO2: 0xb7bdc4, Ar: 0x5fd18b, He: 0xffa3c2, mezcla: 0xe8ecf6, O3: 0x5fe1d4, escape: 0xffffff };

function crearCilindro(x, z, clave, texto) {
  const g = new THREE.Group();
  const cuerpo = new THREE.MeshStandardMaterial({ color: 0x5f6b75, metalness: 0.5, roughness: 0.45 });
  g.add(en(cilindro(0.09, 0.93, cuerpo, 32), 0, 0.485, 0));
  g.add(en(cilindro(0.092, 0.02, M.caucho, 32), 0, 0.01, 0));
  const hombroMat = new THREE.MeshStandardMaterial({ color: HOMBRO[clave], metalness: 0.3, roughness: 0.5 });
  const hombro = new THREE.Mesh(new THREE.SphereGeometry(0.09, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), hombroMat);
  hombro.scale.y = 0.65;
  hombro.position.y = 0.95;
  hombro.castShadow = true;
  g.add(hombro);
  if (clave === 'aire') {
    const banda = new THREE.Mesh(new THREE.SphereGeometry(0.0905, 32, 6, 0, Math.PI * 2, Math.PI * 0.25, Math.PI * 0.12), new THREE.MeshStandardMaterial({ color: 0x1b1b1b }));
    banda.scale.y = 0.65;
    banda.position.y = 0.95;
    g.add(banda);
  }
  g.add(en(cilindro(0.028, 0.06, M.acero, 16), 0, 1.04, 0));
  g.add(en(caja(0.04, 0.05, 0.04, M.laton), 0, 1.09, 0));
  g.add(en(cilindro(0.02, 0.012, M.negro, 16), 0, 1.122, 0));
  // regulador con dos manómetros
  const reg = new THREE.Group();
  reg.add(en(esfera(0.026, M.laton), 0, 0, 0));
  for (const s of [-1, 1]) {
    const man = cilindro(0.022, 0.012, M.inox, 24);
    man.rotation.x = Math.PI / 2;
    man.position.set(s * 0.035, 0.022, 0.008);
    const cara = new THREE.Mesh(new THREE.CircleGeometry(0.019, 24), new THREE.MeshBasicMaterial({ color: 0xf4f4f0 }));
    cara.position.set(s * 0.035, 0.022, 0.015);
    reg.add(man, cara);
  }
  reg.position.set(0, 1.15, 0.025);
  g.add(reg);
  const r = rotulo(texto, { w: 0.11, h: 0.05, fondo: '#f4f2ea', tinta: '#151515' });
  r.position.set(0, 0.62, 0.0905);
  g.add(r);
  g.position.set(x, 0, z);
  g.userData.hombro = hombroMat;
  g.userData.rotulo = r;
  return g;
}

export function crearGases(scene, anclas) {
  const g = new THREE.Group();
  g.name = 'gases';
  scene.add(g);
  const conexiones = new THREE.Group(); // tuberías que llegan al reactor (se ocultan en el despiece)
  scene.add(conexiones);

  const [xA, xN, xO, xX] = L.cil.xs;
  const cilAire = registrar(crearCilindro(xA, L.cil.z, 'aire', 'AIRE'), 'cilAire');
  const cilN2 = registrar(crearCilindro(xN, L.cil.z, 'N2', 'N₂'), 'cilN2');
  const cilO2 = registrar(crearCilindro(xO, L.cil.z, 'O2', 'O₂'), 'cilO2');
  const cilAux = registrar(crearCilindro(xX, L.cil.z, 'CO2', 'CO₂ · Ar · He'), 'cilAux');
  g.add(cilAire, cilN2, cilO2, cilAux);
  // soporte mural con cadenas
  g.add(en(caja(1.05, 0.04, 0.03, M.acero), -1.48, 0.95, -0.585));
  for (const x of L.cil.xs) {
    const cad = new THREE.Mesh(new THREE.TorusGeometry(0.093, 0.005, 6, 32), M.acero);
    cad.rotation.x = Math.PI / 2;
    cad.position.set(x, 0.95, L.cil.z);
    g.add(cad);
  }

  // Panel de controladores de caudal
  const panel = new THREE.Group();
  panel.add(en(caja(0.44, 0.34, 0.01, M.aluminio), L.panel.x, L.panel.y, L.panel.z));
  const pantallasMFC = [];
  L.mfc.xs.forEach((x, i) => {
    panel.add(en(caja(0.055, 0.12, 0.05, M.azulMFC), x, L.mfc.y, L.mfc.z));
    const p = pantalla(0.042, 0.02, 168, 80);
    p.mesh.position.set(x, L.mfc.y + 0.032, L.mfc.z + 0.0255);
    panel.add(p.mesh);
    pantallasMFC.push(p);
    const r = rotulo(`FIC-10${i + 1}`, { w: 0.045, h: 0.012, fondo: '#2f5d8a', tinta: '#ffffff', fuente: 'bold 56px "IBM Plex Mono", monospace' });
    r.position.set(x, L.mfc.y - 0.02, L.mfc.z + 0.0256);
    panel.add(r);
    // válvula de aguja
    const v = cilindro(0.008, 0.02, M.negro, 12);
    v.rotation.x = Math.PI / 2;
    v.position.set(x, L.mfc.y - 0.085, L.mfc.z + 0.015);
    panel.add(v);
  });
  // válvula de tres vías V-1 (aire o N₂)
  const v1 = cilindro(0.012, 0.024, M.laton, 16);
  v1.rotation.x = Math.PI / 2;
  v1.position.set(-0.8, 1.17, L.mfc.z);
  panel.add(v1);
  const v1man = en(caja(0.03, 0.006, 0.006, M.rojo), -0.8, 1.17, L.mfc.z + 0.015);
  panel.add(v1man);
  // colector de mezcla
  const colector = cilindro(0.006, 0.32, M.inox, 12);
  colector.rotation.z = Math.PI / 2;
  colector.position.set(-0.6, 1.405, L.mfc.z);
  panel.add(colector);
  g.add(registrar(panel, 'panelMFC'));

  // Humidificador de burbujeo con derivación
  const hum = new THREE.Group();
  const hx = L.humid.x;
  const hz = L.humid.z;
  const y0 = L.y;
  hum.add(en(cilindro(0.042, 0.15, M.vidrio, 32), hx, y0 + 0.075, hz));
  hum.add(en(cilindro(0.039, 0.075, M.agua, 32), hx, y0 + 0.04, hz));
  hum.add(en(cilindro(0.026, 0.025, M.negro, 24), hx, y0 + 0.162, hz));
  hum.add(en(cilindro(0.003, 0.14, M.vidrio, 8), hx - 0.01, y0 + 0.1, hz));
  const burbujas = new THREE.Group();
  for (let i = 0; i < 10; i++) {
    const b = esfera(0.0035, new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.6, roughness: 0 }), 8);
    b.userData.fase = Math.random();
    burbujas.add(b);
  }
  hum.add(burbujas);
  const v2 = cilindro(0.01, 0.022, M.negro, 12);
  v2.rotation.x = Math.PI / 2;
  v2.position.set(hx + 0.07, y0 + 0.2, hz + 0.01);
  hum.add(v2);
  g.add(registrar(hum, 'humidificador'));

  // Sensor de humedad MT-201
  const hr = new THREE.Group();
  hr.add(en(caja(0.07, 0.035, 0.045, M.blanco), L.hr.x, y0 + 0.0175, L.hr.z));
  const pHR = pantalla(0.05, 0.022, 200, 88);
  pHR.mesh.position.set(L.hr.x, y0 + 0.022, L.hr.z + 0.0228);
  hr.add(pHR.mesh);
  hr.add(en(cilindro(0.006, 0.05, M.inox, 12), L.hr.x, y0 + 0.06, L.hr.z));
  g.add(registrar(hr, 'sensorHR'));

  // ---------------- Tuberías ----------------
  const yR = 1.15;
  const lineas = {};
  const agregar = (id, puntos, r = 0.0035, destino = g) => {
    const t = tubo(puntos, r, M.pfa, 96);
    registrar(t, 'tuberia');
    destino.add(t);
    lineas[id] = { curva: t.userData.curva, malla: t };
    return t;
  };
  const xp = L.panel.x - 0.2;
  agregar('aire', [[xA, yR, L.cil.z + 0.03], [xA, 1.3, -0.4], [-1.2, 1.32, -0.37], [xp + 0.05, 1.2, -0.33], [-0.8, 1.17, L.mfc.z - 0.01]]);
  agregar('n2', [[xN, yR, L.cil.z + 0.03], [xN, 1.27, -0.4], [-1.1, 1.24, -0.36], [xp + 0.02, 1.16, -0.33], [-0.8, 1.17, L.mfc.z - 0.01]]);
  agregar('v1', [[-0.8, 1.17, L.mfc.z], [-0.76, 1.2, L.mfc.z], [L.mfc.xs[0], 1.23, L.mfc.z], [L.mfc.xs[0], L.mfc.y - 0.06, L.mfc.z]]);
  agregar('o2', [[xO, yR, L.cil.z + 0.03], [xO, 1.22, -0.4], [-1.0, 1.15, -0.36], [-0.75, 1.13, -0.33], [L.mfc.xs[1], 1.16, L.mfc.z], [L.mfc.xs[1], L.mfc.y - 0.06, L.mfc.z]]);
  agregar('aux', [[xX, yR, L.cil.z + 0.03], [xX, 1.18, -0.42], [-0.9, 1.11, -0.36], [-0.6, 1.1, -0.33], [L.mfc.xs[2], 1.13, L.mfc.z], [L.mfc.xs[2], L.mfc.y - 0.06, L.mfc.z]]);
  agregar('mezcla', [
    [-0.44, 1.405, L.mfc.z], [-0.4, 1.4, L.mfc.z], [-0.39, 1.25, -0.32], [-0.39, 1.0, -0.29], [hx - 0.04, y0 + 0.22, hz], [hx - 0.01, y0 + 0.175, hz],
  ]);
  agregar('humSalida', [
    [hx + 0.012, y0 + 0.175, hz], [hx + 0.05, y0 + 0.22, hz + 0.02], [L.hr.x - 0.04, y0 + 0.08, L.hr.z], [L.hr.x - 0.035, y0 + 0.02, L.hr.z],
  ]);
  agregar('entrada', [
    [L.hr.x + 0.035, y0 + 0.02, L.hr.z], [-0.24, y0 + 0.02, -0.06], [-0.2, y0 + 0.0185, -0.01], [anclas.entradaGas.x, anclas.entradaGas.y, anclas.entradaGas.z],
  ], 0.0035, conexiones);
  // Escape: tapa → monitor de O₃ → destructor → extracción
  const s0 = anclas.salidaGas;
  agregar('escape1', [
    [s0.x, s0.y - 0.02, s0.z], [s0.x, s0.y + 0.05, s0.z - 0.02], [0.18, 1.44, -0.2], [L.o3.x - 0.05, 1.2, L.o3.z], [L.o3.x - 0.07, L.y + 0.09, L.o3.z],
  ], 0.0035, conexiones);
  agregar('escape2', [
    [L.o3.x + 0.08, L.y + 0.07, L.o3.z], [L.destructor.x - 0.06, L.y + 0.06, L.destructor.z], [L.destructor.x - 0.035, L.y + 0.03, L.destructor.z],
  ]);

  // ---------------- Partículas de flujo ----------------
  const defs = [
    { id: 'aire', n: 18 }, { id: 'n2', n: 18 }, { id: 'v1', n: 8 }, { id: 'o2', n: 20 }, { id: 'aux', n: 20 },
    { id: 'mezcla', n: 26 }, { id: 'humSalida', n: 12 }, { id: 'entrada', n: 14 }, { id: 'escape1', n: 30 }, { id: 'escape2', n: 10 },
  ];
  const total = defs.reduce((a, b) => a + b.n, 0);
  const pos = new Float32Array(total * 3);
  const col = new Float32Array(total * 3);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const puntos = new THREE.Points(
    geo,
    new THREE.PointsMaterial({ size: 0.012, map: texturaPunto(), vertexColors: true, transparent: true, depthWrite: false, opacity: 0.95 }),
  );
  puntos.frustumCulled = false;
  scene.add(puntos);
  const particulas = [];
  defs.forEach((d) => {
    const muestras = lineas[d.id].curva.getSpacedPoints(160);
    for (let i = 0; i < d.n; i++) particulas.push({ linea: d.id, u: i / d.n, muestras });
  });

  const tmpC = new THREE.Color();
  function update(dt, est) {
    // Cilindro auxiliar: color de hombro y rótulo del gas activo
    const aux = est.mfc.m3.gas;
    if (aux && cilAux.userData.auxGas !== aux) {
      cilAux.userData.auxGas = aux;
      cilAux.userData.hombro.color.setHex(HOMBRO[aux]);
    }
    v1man.rotation.y = est.mfc.m1.fuente === 'aire' ? 0.6 : -0.6;

    const vel = {
      aire: est.mfc.m1.fuente === 'aire' ? est.mfc.m1.q : 0,
      n2: est.mfc.m1.fuente === 'n2' ? est.mfc.m1.q : 0,
      v1: est.mfc.m1.q,
      o2: est.mfc.m2,
      aux: est.mfc.m3.q,
      mezcla: est.Qtotal,
      humSalida: est.Qtotal,
      entrada: est.Qtotal,
      escape1: est.Qsalida,
      escape2: est.Qsalida,
    };
    const colorLinea = {
      aire: COLOR_FLUJO.aire, n2: COLOR_FLUJO.N2, v1: est.mfc.m1.fuente === 'aire' ? COLOR_FLUJO.aire : COLOR_FLUJO.N2,
      o2: COLOR_FLUJO.O2, aux: COLOR_FLUJO[aux] || COLOR_FLUJO.CO2, mezcla: COLOR_FLUJO.mezcla, humSalida: COLOR_FLUJO.mezcla,
      entrada: COLOR_FLUJO.mezcla, escape1: est.O3 > 20 ? COLOR_FLUJO.O3 : COLOR_FLUJO.escape, escape2: COLOR_FLUJO.escape,
    };
    particulas.forEach((p, i) => {
      const q = est.flujo ? vel[p.linea] : 0;
      if (q > 0.001) p.u = (p.u + dt * (0.04 + 0.05 * q)) % 1;
      const m = p.muestras[Math.floor(p.u * (p.muestras.length - 1))];
      const conectada = p.linea === 'entrada' || p.linea === 'escape1';
      const vis = q > 0.001 && (conexiones.visible || !conectada);
      pos[i * 3] = m.x;
      pos[i * 3 + 1] = vis ? m.y : -100;
      pos[i * 3 + 2] = m.z;
      tmpC.setHex(colorLinea[p.linea]);
      col[i * 3] = tmpC.r;
      col[i * 3 + 1] = tmpC.g;
      col[i * 3 + 2] = tmpC.b;
    });
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;

    // Burbujas en el humidificador (caudal por el burbujeador)
    const qb = est.flujo ? est.Qtotal * (est.HR / 90) : 0;
    burbujas.children.forEach((b) => {
      b.visible = qb > 0.02;
      b.userData.fase = (b.userData.fase + dt * (0.6 + qb)) % 1;
      const f = b.userData.fase;
      b.position.set(hx - 0.01 + Math.sin(f * 20 + b.id) * 0.008, y0 + 0.01 + f * 0.07, hz + Math.cos(f * 17 + b.id) * 0.008);
    });
    v2.rotation.z = (est.HR / 90) * Math.PI;
  }

  return { grupo: g, conexiones, update, pantallasMFC, pantallaHR: pHR };
}
