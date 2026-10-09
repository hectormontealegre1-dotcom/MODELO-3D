// Muestras tratadas: placa de vidrio o envase, con el alimento o residuo dentro.
// Las colonias (o moléculas de toxina) visibles cambian con el avance de la curva de referencia.
import * as THREE from 'three';
import { M, conCorte } from './materiales.js';
import { MUESTRAS } from '../data/casos.js';

export const H_PLACA = 0.0135; // altura del borde de la placa Petri
export const H_ALIMENTO_ENVASE = 0.009;

function aleatorioEnDisco(r) {
  const a = Math.random() * Math.PI * 2;
  const rr = r * Math.sqrt(Math.random());
  return [Math.cos(a) * rr, Math.sin(a) * rr];
}

export function crearMuestra(clave, modo) {
  const def = MUESTRAS[clave] || MUESTRAS.placa_agar;
  const g = new THREE.Group();
  g.name = 'muestra';
  const enEnvase = modo === 'envase';
  const radio = enEnvase ? 0.045 : 0.04;
  let base = 0;
  let envase = null;

  if (!enEnvase) {
    const fondo = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.0015, 40), conCorte(M.vidrio));
    fondo.position.y = 0.00075;
    const borde = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, H_PLACA, 40, 1, true), conCorte(M.vidrio));
    borde.position.y = H_PLACA / 2;
    g.add(fondo, borde);
    base = 0.0015;
  } else {
    // Bandeja de PET con película superior; la altura se ajusta con setAltura().
    const matPet = conCorte(M.pet);
    envase = new THREE.Mesh(new THREE.BoxGeometry(0.11, 1, 0.11), matPet);
    envase.position.y = 0.5;
    const bordes = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(0.11, 1, 0.11)),
      new THREE.LineBasicMaterial({ color: 0x5f86a3, transparent: true, opacity: 0.95, clippingPlanes: matPet.clippingPlanes }),
    );
    envase.add(bordes);
    g.add(envase);
    base = 0.0005;
  }

  const mat = new THREE.MeshStandardMaterial({ color: def.color, roughness: 0.6, metalness: 0 });
  let alturaContenido = 0.008;
  const alturaMax = enEnvase ? H_ALIMENTO_ENVASE - 0.001 : H_PLACA - 0.002;

  if (def.tipo === 'rodaja') {
    const h = Math.min(0.008, alturaMax);
    const r = new THREE.Mesh(new THREE.CylinderGeometry(radio * 0.85, radio * 0.85, h, 40), mat);
    r.position.y = base + h / 2;
    const piel = new THREE.Mesh(
      new THREE.TorusGeometry(radio * 0.85, 0.0018, 8, 48),
      new THREE.MeshStandardMaterial({ color: def.piel || def.color, roughness: 0.5 }),
    );
    piel.rotation.x = Math.PI / 2;
    piel.position.y = base + h / 2;
    g.add(r, piel);
    alturaContenido = h;
  } else if (def.tipo === 'liquido') {
    const h = Math.min(0.007, alturaMax);
    const lm = new THREE.MeshPhysicalMaterial({ color: def.color, transparent: true, opacity: def.opacidad ?? 0.6, roughness: 0.05 });
    const l = new THREE.Mesh(new THREE.CylinderGeometry(radio * 1.08, radio * 1.08, h, 40), lm);
    l.position.y = base + h / 2;
    g.add(l);
    alturaContenido = h;
  } else if (def.tipo === 'bloque') {
    const h = Math.min(0.011, alturaMax);
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.05, h, 0.04), mat);
    b.position.y = base + h / 2;
    g.add(b);
    alturaContenido = h;
  } else if (def.tipo === 'placa') {
    const v = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.002, 0.04), M.vidrio);
    v.position.y = base + 0.001;
    const bio = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.0006, 0.03),
      new THREE.MeshStandardMaterial({ color: 0xd9c98f, transparent: true, opacity: 0.75, roughness: 0.8 }),
    );
    bio.position.y = base + 0.0023;
    g.add(v, bio);
    alturaContenido = 0.0026;
  } else if (def.tipo === 'granos') {
    const t = def.tam;
    let geo;
    if (def.forma === 'esfera') geo = new THREE.SphereGeometry(t / 2, 14, 10);
    else if (def.forma === 'cubo') geo = new THREE.BoxGeometry(t, t * 0.8, t);
    else if (def.forma === 'chip') geo = new THREE.BoxGeometry(t, t * 0.18, t * 0.7);
    else geo = new THREE.SphereGeometry(t / 2, 12, 8).scale(1.6, 0.7, 0.85);
    const n = def.n;
    const inst = new THREE.InstancedMesh(geo, mat, n);
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const hy = def.forma === 'chip' ? t * 0.18 : def.forma === 'grano' ? t * 0.7 : def.forma === 'cubo' ? t * 0.8 : t;
    const escala = Math.min(1, alturaMax / hy);
    for (let i = 0; i < n; i++) {
      const [x, z] = aleatorioEnDisco(radio - t * 0.6);
      e.set(def.forma === 'chip' ? (Math.random() - 0.5) * 0.4 : 0, Math.random() * Math.PI * 2, def.forma === 'chip' ? (Math.random() - 0.5) * 0.4 : 0);
      q.setFromEuler(e);
      const s = (0.8 + Math.random() * 0.35) * escala;
      m4.compose(new THREE.Vector3(x, base + (hy * s) / 2, z), q, new THREE.Vector3(s, s, s));
      inst.setMatrixAt(i, m4);
    }
    inst.castShadow = true;
    g.add(inst);
    alturaContenido = Math.min(alturaMax, hy * escala);
  }

  // Colonias o moléculas sobre la superficie
  const N = 170;
  const geoCol = new THREE.SphereGeometry(1, 8, 6);
  const matCol = new THREE.MeshStandardMaterial({ color: 0xf6efd2, roughness: 0.7, emissive: 0x2a2410 });
  const colonias = new THREE.InstancedMesh(geoCol, matCol, N);
  const m4 = new THREE.Matrix4();
  const ySup = base + alturaContenido;
  for (let i = 0; i < N; i++) {
    const [x, z] = aleatorioEnDisco(radio * 0.82);
    const r = 0.0007 + Math.random() * 0.0011;
    m4.compose(new THREE.Vector3(x, ySup + r * 0.35, z), new THREE.Quaternion(), new THREE.Vector3(r, r * 0.55, r));
    colonias.setMatrixAt(i, m4);
  }
  g.add(colonias);

  // Toxinas: puntos fluorescentes (las aflatoxinas fluorescen bajo UV)
  const NT = 260;
  const pos = new Float32Array(NT * 3);
  for (let i = 0; i < NT; i++) {
    const [x, z] = aleatorioEnDisco(radio * 0.85);
    pos[i * 3] = x;
    pos[i * 3 + 1] = ySup + 0.0008;
    pos[i * 3 + 2] = z;
  }
  const geoTox = new THREE.BufferGeometry();
  geoTox.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const toxinas = new THREE.Points(
    geoTox,
    new THREE.PointsMaterial({ color: 0x9cf03c, size: 0.0026, sizeAttenuation: true, transparent: true, opacity: 0.95, depthWrite: false }),
  );
  g.add(toxinas);

  const api = {
    grupo: g,
    enEnvase,
    alturaSoporte: enEnvase ? H_ALIMENTO_ENVASE : H_PLACA,
    setAltura(hTotal) {
      if (envase) {
        envase.scale.y = hTotal;
        envase.position.y = hTotal / 2;
      }
    },
    // tipo: 'micro' | 'toxina' | 'residuo' | 'libre'; valor: R (log) o porcentaje
    setEstado(tipo, valor, ref) {
      colonias.visible = tipo === 'micro' || tipo === 'libre';
      toxinas.visible = tipo === 'toxina' || tipo === 'residuo';
      if (colonias.visible) {
        const R = tipo === 'libre' ? 0 : Math.max(0, valor);
        colonias.count = Math.round(N * Math.max(0, 1 - R / 6));
      }
      if (toxinas.visible) {
        // valor en %: positivo = degradación; negativo = aumento
        const rem = 1 - valor / 100;
        const frac = Math.max(0, Math.min(1, rem / (ref && ref < 0 ? 1 - ref / 100 : 1)));
        geoTox.setDrawRange(0, Math.round(NT * frac));
        toxinas.material.color.set(tipo === 'residuo' ? 0x48d18a : 0x9cf03c);
      }
    },
  };
  return api;
}
