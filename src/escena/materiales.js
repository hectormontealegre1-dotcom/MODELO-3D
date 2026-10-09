// Materiales compartidos y utilidades de geometría.
import * as THREE from 'three';

export const M = {};

// Plano de corte compartido por las piezas del reactor (vista en corte).
export const planoCorte = new THREE.Plane(new THREE.Vector3(0, 0, -1), 1000);

function texturaMalla() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.clearRect(0, 0, 128, 128);
  g.strokeStyle = '#ffffff';
  g.lineWidth = 3;
  for (let i = 0; i <= 128; i += 16) {
    g.beginPath();
    g.moveTo(i, 0);
    g.lineTo(i, 128);
    g.stroke();
    g.beginPath();
    g.moveTo(0, i);
    g.lineTo(128, i);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(5, 5);
  return t;
}

function texturaRuido(base, var_, escala = 256) {
  const c = document.createElement('canvas');
  c.width = c.height = escala;
  const g = c.getContext('2d');
  g.fillStyle = base;
  g.fillRect(0, 0, escala, escala);
  const img = g.getImageData(0, 0, escala, escala);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * var_;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function crearMateriales() {
  const std = (o) => new THREE.MeshStandardMaterial(o);
  Object.assign(M, {
    aluminio: std({ color: 0xc8ced5, metalness: 0.9, roughness: 0.3 }),
    perfil: std({ color: 0xaab3bc, metalness: 0.85, roughness: 0.4 }),
    acero: std({ color: 0x8f989f, metalness: 0.85, roughness: 0.38 }),
    inox: std({ color: 0xb9c0c6, metalness: 0.95, roughness: 0.22 }),
    laton: std({ color: 0xc9a24b, metalness: 0.9, roughness: 0.3 }),
    ptfe: std({ color: 0xf1f0eb, metalness: 0, roughness: 0.55 }),
    nylon: std({ color: 0xe6e1d3, metalness: 0, roughness: 0.6 }),
    caucho: std({ color: 0x1c1e21, metalness: 0, roughness: 0.9 }),
    negro: std({ color: 0x23272c, metalness: 0.2, roughness: 0.55 }),
    grisOscuro: std({ color: 0x3a4148, metalness: 0.3, roughness: 0.5 }),
    gris: std({ color: 0x6d7680, metalness: 0.3, roughness: 0.5 }),
    grisClaro: std({ color: 0xc6ccd2, metalness: 0.1, roughness: 0.6 }),
    blanco: std({ color: 0xeef0f2, metalness: 0.05, roughness: 0.5 }),
    azulMFC: std({ color: 0x2f5d8a, metalness: 0.3, roughness: 0.45 }),
    amarilloSeg: std({ color: 0xf2b705, metalness: 0.1, roughness: 0.5 }),
    rojo: std({ color: 0xc8232c, metalness: 0.1, roughness: 0.4 }),
    verdeTierra: std({ color: 0x3c9a3a, metalness: 0.1, roughness: 0.6 }),
    cableAT: std({ color: 0xd65a1f, metalness: 0.05, roughness: 0.6 }),
    cableBNC: std({ color: 0x15171a, metalness: 0.1, roughness: 0.7 }),
    fibra: std({ color: 0xf2c230, metalness: 0.1, roughness: 0.5 }),
    epoxica: std({ color: 0x2b3036, metalness: 0.05, roughness: 0.7 }),
    melamina: std({ color: 0xdfe3e6, metalness: 0, roughness: 0.75 }),
    piso: std({ map: texturaRuido('#9aa2a8', 18), roughness: 0.9, metalness: 0 }),
    muro: std({ color: 0xd9dee2, roughness: 0.95, metalness: 0 }),
    zocalo: std({ color: 0x8e979e, roughness: 0.8 }),
    agua: new THREE.MeshPhysicalMaterial({ color: 0x9fd0e6, transparent: true, opacity: 0.55, roughness: 0.05, metalness: 0 }),
    vidrio: new THREE.MeshPhysicalMaterial({
      color: 0xe6f2f6, transparent: true, opacity: 0.28, roughness: 0.04, metalness: 0, side: THREE.DoubleSide, depthWrite: false,
    }),
    cuarzo: new THREE.MeshPhysicalMaterial({
      color: 0xe2f1f7, transparent: true, opacity: 0.45, roughness: 0.03, metalness: 0, clearcoat: 1,
    }),
    policarbonato: new THREE.MeshPhysicalMaterial({
      color: 0xd8e6ee, transparent: true, opacity: 0.2, roughness: 0.05, metalness: 0, side: THREE.DoubleSide, depthWrite: false,
    }),
    znse: std({ color: 0xd4a017, metalness: 0.2, roughness: 0.2, transparent: true, opacity: 0.85 }),
    pfa: new THREE.MeshPhysicalMaterial({ color: 0xf6f7f7, transparent: true, opacity: 0.5, roughness: 0.3, metalness: 0, depthWrite: false }),
    malla: new THREE.MeshStandardMaterial({
      color: 0xb7c0c8, metalness: 0.8, roughness: 0.4, alphaMap: texturaMalla(), transparent: true, side: THREE.DoubleSide, depthWrite: false,
    }),
    pet: new THREE.MeshPhysicalMaterial({ color: 0xcfe4f2, transparent: true, opacity: 0.38, roughness: 0.1, side: THREE.DoubleSide, depthWrite: false }),
  });
  return M;
}

// Activa el corte en un material (se clona para no afectar al resto de la escena).
export function conCorte(mat) {
  const m = mat.clone();
  m.clippingPlanes = [planoCorte];
  m.clipShadows = true;
  if (!m.transparent) m.side = THREE.DoubleSide;
  return m;
}

export function caja(w, h, d, mat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export function cilindro(r, h, mat, seg = 32, rb = null, abierto = false) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, rb ?? r, h, seg, 1, abierto), mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export function esfera(r, mat, seg = 24) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(8, seg / 2)), mat);
  m.castShadow = true;
  return m;
}

export function tubo(puntos, r, mat, seg = 64, tension = 0.5) {
  const curva = new THREE.CatmullRomCurve3(puntos.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', tension);
  const m = new THREE.Mesh(new THREE.TubeGeometry(curva, seg, r, 8, false), mat);
  m.castShadow = true;
  m.userData.curva = curva;
  return m;
}

export function en(obj, x, y, z) {
  obj.position.set(x, y, z);
  return obj;
}

// Marca todas las mallas de un objeto con el identificador de la pieza (para seleccionar).
export function registrar(obj, partId) {
  obj.userData.partId = partId;
  obj.traverse((o) => {
    if (o.isMesh) o.userData.partId = partId;
  });
  return obj;
}

// Pantalla con textura de canvas.
export function pantalla(w, h, pxW, pxH) {
  const canvas = document.createElement('canvas');
  canvas.width = pxW;
  canvas.height = pxH;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  return { mesh, canvas, ctx: canvas.getContext('2d'), tex };
}

// Etiqueta impresa (rótulos de cilindros, señal de alta tensión).
export function rotulo(texto, { w = 0.08, h = 0.03, fondo = '#ffffff', tinta = '#111111', borde = null, fuente = 'bold 64px "Barlow Condensed", "Arial Narrow", sans-serif' } = {}) {
  // Resolución proporcional al tamaño físico; el texto se ajusta al alto y al ancho disponibles.
  const c = document.createElement('canvas');
  c.width = Math.max(128, Math.round(w * 4000));
  c.height = Math.max(24, Math.round(h * 4000));
  const g = c.getContext('2d');
  g.fillStyle = fondo;
  g.fillRect(0, 0, c.width, c.height);
  if (borde) {
    g.strokeStyle = borde;
    g.lineWidth = c.height * 0.08;
    g.strokeRect(0, 0, c.width, c.height);
  }
  g.fillStyle = tinta;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const lineas = String(texto).split('\n');
  const lh = c.height / lineas.length;
  let tam = lh * 0.68;
  const familia = fuente.replace(/^.*?\d+px\s*/, '');
  const peso = /bold|600|700/.test(fuente) ? '600' : '400';
  g.font = `${peso} ${tam}px ${familia}`;
  const ancho = Math.max(...lineas.map((l) => g.measureText(l).width));
  if (ancho > c.width * 0.92) tam *= (c.width * 0.92) / ancho;
  g.font = `${peso} ${tam}px ${familia}`;
  lineas.forEach((l, i) => g.fillText(l, c.width / 2, lh * (i + 0.5)));
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.7 }));
  return m;
}

export function senalAT(lado = 0.07) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  g.clearRect(0, 0, 256, 256);
  g.beginPath();
  g.moveTo(128, 18);
  g.lineTo(240, 222);
  g.lineTo(16, 222);
  g.closePath();
  g.fillStyle = '#f2b705';
  g.fill();
  g.lineWidth = 14;
  g.strokeStyle = '#111';
  g.stroke();
  g.fillStyle = '#111';
  g.beginPath();
  g.moveTo(140, 70);
  g.lineTo(100, 150);
  g.lineTo(130, 150);
  g.lineTo(112, 205);
  g.lineTo(160, 125);
  g.lineTo(130, 125);
  g.lineTo(150, 70);
  g.closePath();
  g.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(new THREE.PlaneGeometry(lado, lado), new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.6 }));
}

// Textura radial para partículas.
export function texturaPunto() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.35, 'rgba(255,255,255,0.85)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  return t;
}
