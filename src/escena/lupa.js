// Vista ampliada (esquemática, sin escala) de la zona de descarga.
import * as THREE from 'three';
import { texturaPunto } from './materiales.js';
import { MUESTRAS } from '../data/casos.js';

// Colores de especies: orden categórico fijo (paleta validada, pasos para fondo oscuro).
export const COLOR_ESPECIE = {
  O: '#3987e5',
  O3: '#199e70',
  OH: '#d55181',
  H2O2: '#c98500',
  NOx: '#d95926',
  N2: '#9085e9',
  UV: '#e66767',
};
const CLAVES = Object.keys(COLOR_ESPECIE);

export function crearLupa() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0f16);
  const camara = new THREE.PerspectiveCamera(34, 1.4, 0.1, 50);
  const H = 1.25;
  camara.position.set(0.35, H * 0.55, 4.0);
  camara.lookAt(0, H * 0.45, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dl = new THREE.DirectionalLight(0xffffff, 1.4);
  dl.position.set(1, 3, 2);
  scene.add(dl);
  const luz = new THREE.PointLight(0x9a86ff, 0, 6, 1.5);
  luz.position.set(0, H / 2, 0.5);
  scene.add(luz);

  // Electrodo, barrera y superficie de la muestra
  const electrodo = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.22, 1), new THREE.MeshStandardMaterial({ color: 0xbfc6cd, metalness: 0.9, roughness: 0.3 }));
  electrodo.position.y = H + 0.12 + 0.11;
  const barrera = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.12, 1),
    new THREE.MeshPhysicalMaterial({ color: 0xbfe6f5, transparent: true, opacity: 0.45, roughness: 0.05 }),
  );
  barrera.position.y = H + 0.06;
  const matSup = new THREE.MeshStandardMaterial({ color: 0xe9d37c, roughness: 0.8 });
  const superficie = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.25, 1), matSup);
  superficie.position.y = -0.125;
  scene.add(electrodo, barrera, superficie);

  // Células (bacterias, esporas o micelio) sobre la superficie
  const celulas = [];
  const geoCel = new THREE.CapsuleGeometry(0.045, 0.12, 4, 10);
  for (let i = 0; i < 14; i++) {
    const m = new THREE.Mesh(geoCel, new THREE.MeshStandardMaterial({ color: 0x7ccf6a, roughness: 0.5, transparent: true }));
    m.rotation.z = Math.PI / 2;
    m.rotation.y = Math.random() * Math.PI;
    m.position.set(-0.95 + (i % 7) * 0.31 + (Math.random() - 0.5) * 0.08, 0.05, i < 7 ? -0.15 : 0.18);
    m.userData.umbral = Math.random() * 0.95;
    celulas.push(m);
    scene.add(m);
  }
  // Moléculas de toxina (anillos hexagonales) o cadenas de PVC
  const moleculas = [];
  const geoMol = new THREE.TorusGeometry(0.05, 0.016, 6, 6);
  for (let i = 0; i < 18; i++) {
    const m = new THREE.Mesh(geoMol, new THREE.MeshStandardMaterial({ color: 0x9cf03c, emissive: 0x2a4d10, roughness: 0.4, transparent: true }));
    m.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.6;
    m.position.set(-1.0 + (i % 9) * 0.25 + (Math.random() - 0.5) * 0.06, 0.035, i < 9 ? -0.18 : 0.2);
    m.userData.umbral = Math.random() * 0.95;
    m.userData.base = m.position.clone();
    m.userData.extra = i >= 12; // aparecen si la síntesis aumenta (CO₂, Durek et al., 2018)
    moleculas.push(m);
    scene.add(m);
  }

  // Microdescargas (filamentos)
  const NF = 9;
  const filamentos = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(1, 1, 1, 8, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xb9adff, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false }),
    NF,
  );
  const vidaF = new Float32Array(NF);
  const posF = Array.from({ length: NF }, () => new THREE.Vector3());
  scene.add(filamentos);
  const halo = new THREE.Mesh(
    new THREE.BoxGeometry(2.3, H, 0.9),
    new THREE.MeshBasicMaterial({ color: 0xffa0c0, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  halo.position.y = H / 2;
  scene.add(halo);

  const tex = texturaPunto();
  const nube = (n, tam, color) => {
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: tam, map: tex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    scene.add(pts);
    const c = new THREE.Color(color);
    for (let i = 0; i < n; i++) col.set([c.r, c.g, c.b], i * 3);
    return { pos, col, geo, n };
  };

  // Moléculas neutras del gas
  const neutras = nube(200, 0.05, '#5d6773');
  for (let i = 0; i < neutras.n; i++) neutras.pos.set([(Math.random() - 0.5) * 2.2, Math.random() * H, (Math.random() - 0.5) * 0.8], i * 3);
  // Electrones
  const elec = nube(70, 0.045, '#ffffff');
  const vElec = new Float32Array(70 * 3);
  for (let i = 0; i < elec.n; i++) elec.pos.set([(Math.random() - 0.5) * 2.2, Math.random() * H, (Math.random() - 0.5) * 0.8], i * 3);
  // Especies reactivas
  const NS = 260;
  const esp = nube(NS, 0.085, '#ffffff');
  const tipoS = new Int8Array(NS).fill(-1);
  const vidaS = new Float32Array(NS);
  // Fotones UV (trazos)
  const NU = 24;
  const uvPos = new Float32Array(NU * 6);
  const uvGeo = new THREE.BufferGeometry();
  uvGeo.setAttribute('position', new THREE.BufferAttribute(uvPos, 3));
  const uv = new THREE.LineSegments(uvGeo, new THREE.LineBasicMaterial({ color: COLOR_ESPECIE.UV, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending }));
  uv.frustumCulled = false;
  scene.add(uv);
  const uvVida = new Float32Array(NU);
  // HCl que se desprende del PVC
  const hcl = nube(40, 0.07, '#48d18a');
  for (let i = 0; i < hcl.n; i++) hcl.pos.set([0, -10, 0], i * 3);

  const tmp = new THREE.Color();
  let tiempo = 0;
  let acumulado = 0;

  function configurar(caso) {
    const def = MUESTRAS[caso.muestra] || MUESTRAS.placa_agar;
    matSup.color.set(def.color);
    const tipo = caso.tipo;
    celulas.forEach((c) => (c.visible = tipo === 'micro' || tipo === 'libre'));
    moleculas.forEach((m) => {
      m.visible = tipo === 'toxina' || tipo === 'residuo';
      m.material.color.set(tipo === 'residuo' ? 0xd8dde1 : 0x9cf03c);
      m.material.emissive.set(tipo === 'residuo' ? 0x0c3a22 : 0x2a4d10);
    });
    // esporas: cápsulas más cortas y oscuras; hongos: verde oliva
    const esporas = /esporas|B\. cereus/i.test(caso.objetivo || '');
    const hongos = /moho|hongo|niger|micobiota/i.test(caso.objetivo || '');
    celulas.forEach((c) => {
      c.scale.set(esporas ? 0.8 : 1, esporas ? 0.6 : hongos ? 1.6 : 1, 1);
      c.userData.colorSano = esporas ? 0xc9b46a : hongos ? 0x6f8f3a : 0x7ccf6a;
    });
  }

  function update(dt, est) {
    tiempo += dt;
    camara.position.x = 0.35 + Math.sin(tiempo * 0.25) * 0.15;
    camara.lookAt(0, H * 0.45, 0);
    const on = est.plasma;
    const P = est.P;
    const intens = on ? Math.min(1, 0.3 + P / 350) : 0;
    const col = new THREE.Color().setRGB(...est.color);

    // Filamentos (modo filamentario) o halo difuso (He/Ar)
    const m4 = new THREE.Matrix4();
    let nf = 0;
    for (let i = 0; i < NF; i++) {
      vidaF[i] -= dt;
      if (on && !est.difusa && vidaF[i] <= 0 && Math.random() < 0.25 + intens * 0.5) {
        vidaF[i] = 0.05 + Math.random() * 0.09;
        posF[i].set((Math.random() - 0.5) * 2.0, H / 2, (Math.random() - 0.5) * 0.6);
      }
      if (vidaF[i] > 0) {
        const r = 0.012 + Math.random() * 0.02;
        m4.makeScale(r, H, r);
        m4.setPosition(posF[i]);
        filamentos.setMatrixAt(nf++, m4);
      }
    }
    filamentos.count = nf;
    filamentos.instanceMatrix.needsUpdate = true;
    filamentos.material.color.copy(col).offsetHSL(0, 0, 0.15);
    halo.material.opacity = on && est.difusa ? 0.1 + 0.08 * Math.sin(tiempo * 30) : 0;
    halo.material.color.copy(col);
    luz.intensity = on ? 2 + intens * 4 : 0;
    luz.color.copy(col);

    // Neutras: agitación térmica lenta (el gas permanece cerca de la temperatura ambiente)
    for (let i = 0; i < neutras.n; i++) {
      const j = i * 3;
      neutras.pos[j] += (Math.random() - 0.5) * 0.01;
      neutras.pos[j + 1] += (Math.random() - 0.5) * 0.01;
      if (neutras.pos[j + 1] < 0.03 || neutras.pos[j + 1] > H - 0.03) neutras.pos[j + 1] = 0.05 + Math.random() * (H - 0.1);
      if (Math.abs(neutras.pos[j]) > 1.15) neutras.pos[j] *= -0.98;
    }
    neutras.geo.attributes.position.needsUpdate = true;

    // Electrones: acelerados por el campo alterno, con dispersión (1 a 10 eV)
    const campo = Math.sin(tiempo * 9);
    for (let i = 0; i < elec.n; i++) {
      const j = i * 3;
      if (!on) {
        elec.col[j] = elec.col[j + 1] = elec.col[j + 2] = 0;
        continue;
      }
      elec.col[j] = elec.col[j + 1] = elec.col[j + 2] = 1;
      vElec[j] += (Math.random() - 0.5) * 0.8;
      vElec[j + 1] += campo * 0.9 + (Math.random() - 0.5) * 0.8;
      vElec[j + 2] += (Math.random() - 0.5) * 0.4;
      for (let k = 0; k < 3; k++) vElec[j + k] *= 0.9;
      elec.pos[j] += vElec[j] * dt * 3;
      elec.pos[j + 1] += vElec[j + 1] * dt * 3;
      elec.pos[j + 2] += vElec[j + 2] * dt * 3;
      if (elec.pos[j + 1] < 0.02 || elec.pos[j + 1] > H - 0.02 || Math.abs(elec.pos[j]) > 1.15 || Math.abs(elec.pos[j + 2]) > 0.45) {
        elec.pos.set([(Math.random() - 0.5) * 2.0, 0.1 + Math.random() * (H - 0.2), (Math.random() - 0.5) * 0.7], j);
        vElec[j] = vElec[j + 1] = vElec[j + 2] = 0;
      }
    }
    elec.geo.attributes.position.needsUpdate = true;
    elec.geo.attributes.color.needsUpdate = true;

    // Especies reactivas: nacen en la descarga y difunden hacia la superficie
    const pesos = CLAVES.filter((k) => k !== 'UV').map((k) => [k, est.especies[k] || 0]);
    const totalP = pesos.reduce((a, [, w]) => a + w, 0);
    acumulado += on ? dt * (40 + 160 * intens) * Math.min(1, totalP) : 0;
    while (acumulado >= 1) {
      acumulado -= 1;
      const libre = tipoS.indexOf(-1);
      if (libre < 0) break;
      let r = Math.random() * totalP;
      let k = pesos[0][0];
      for (const [kk, w] of pesos) {
        if ((r -= w) <= 0) {
          k = kk;
          break;
        }
      }
      tipoS[libre] = CLAVES.indexOf(k);
      vidaS[libre] = 0;
      const f = nf > 0 ? posF[Math.floor(Math.random() * NF)] : null;
      esp.pos.set([f && !est.difusa ? f.x + (Math.random() - 0.5) * 0.12 : (Math.random() - 0.5) * 2.0, 0.2 + Math.random() * (H - 0.3), (Math.random() - 0.5) * 0.7], libre * 3);
      tmp.set(COLOR_ESPECIE[k]);
      esp.col.set([tmp.r, tmp.g, tmp.b], libre * 3);
    }
    for (let i = 0; i < NS; i++) {
      if (tipoS[i] < 0) continue;
      const j = i * 3;
      vidaS[i] += dt;
      const lenta = CLAVES[tipoS[i]] === 'O3' || CLAVES[tipoS[i]] === 'H2O2';
      esp.pos[j] += (Math.random() - 0.5) * 0.04;
      esp.pos[j + 1] += (Math.random() - 0.5) * 0.04 - dt * (lenta ? 0.15 : 0.35);
      esp.pos[j + 2] += (Math.random() - 0.5) * 0.02;
      const corta = CLAVES[tipoS[i]] === 'O' || CLAVES[tipoS[i]] === 'OH';
      if (esp.pos[j + 1] < 0.04 || (corta && vidaS[i] > 2.2) || vidaS[i] > 6) {
        tipoS[i] = -1;
        esp.pos.set([0, -10, 0], j);
      }
    }
    esp.geo.attributes.position.needsUpdate = true;
    esp.geo.attributes.color.needsUpdate = true;

    // Fotones UV
    for (let i = 0; i < NU; i++) {
      uvVida[i] -= dt;
      const j = i * 6;
      if (uvVida[i] <= 0) {
        if (on && Math.random() < (est.especies.UV || 0) * 0.5) {
          uvVida[i] = 0.35;
          const x = (Math.random() - 0.5) * 2;
          const z = (Math.random() - 0.5) * 0.6;
          uvPos.set([x, H - 0.05, z, x, H - 0.18, z], j);
        } else {
          uvPos.set([0, -10, 0, 0, -10, 0], j);
          continue;
        }
      }
      for (const o of [1, 4]) uvPos[j + o] -= dt * 4;
      if (uvPos[j + 4] < 0) uvPos.set([0, -10, 0, 0, -10, 0], j);
    }
    uvGeo.attributes.position.needsUpdate = true;

    // Daño en la superficie según el avance del caso
    const fr = est.fraccionCaso;
    celulas.forEach((c) => {
      if (!c.visible) return;
      const d = Math.max(0, Math.min(1, (fr - c.userData.umbral) / 0.15));
      tmp.setHex(c.userData.colorSano || 0x7ccf6a).lerp(new THREE.Color(0x5a5f66), d);
      c.material.color.copy(tmp);
      c.material.opacity = 1 - 0.65 * d;
    });
    const aumento = est.valorRef < 0;
    moleculas.forEach((m) => {
      if (!(est.tipoCaso === 'toxina' || est.tipoCaso === 'residuo')) return;
      if (aumento) {
        const aparece = !m.userData.extra || fr > m.userData.umbral;
        m.visible = aparece;
        m.material.opacity = 1;
        m.position.copy(m.userData.base);
        return;
      }
      m.visible = true;
      const d = Math.max(0, Math.min(1, (fr - m.userData.umbral) / 0.12));
      m.material.opacity = 1 - d;
      m.position.y = m.userData.base.y + d * 0.25;
      m.scale.setScalar(1 - 0.5 * d);
    });

    // HCl (solo para el PVC)
    for (let i = 0; i < hcl.n; i++) {
      const j = i * 3;
      if (est.tipoCaso === 'residuo' && on && hcl.pos[j + 1] < -5 && Math.random() < 0.05) hcl.pos.set([(Math.random() - 0.5) * 2, 0.05, (Math.random() - 0.5) * 0.6], j);
      if (hcl.pos[j + 1] > -5) {
        hcl.pos[j + 1] += dt * 0.4;
        hcl.pos[j] += (Math.random() - 0.5) * 0.02;
        if (hcl.pos[j + 1] > H) hcl.pos[j + 1] = -10;
      }
    }
    hcl.geo.attributes.position.needsUpdate = true;
  }

  return { scene, camara, update, configurar };
}
