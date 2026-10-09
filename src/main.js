// Punto de entrada: escena 3D, simulación del proceso e interfaz.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { crearMateriales } from './escena/materiales.js';
import { crearEntorno, crearLuces } from './escena/entorno.js';
import { crearReactor } from './escena/reactor.js';
import { crearGases } from './escena/gases.js';
import { crearInstrumentos } from './escena/instrumentos.js';
import { crearLupa } from './escena/lupa.js';
import { Proceso, consignasMFC, FASES } from './sim/proceso.js';
import * as F from './sim/fisica.js';
import { crearHUD } from './ui/hud.js';
import { crearPresentacion } from './ui/presentacion.js';
import { EXPERIMENTO, PASOS } from './data/recorrido.js';
import { PARTES } from './data/banco.js';
import { fmt } from './ui/formato.js';

const $ = (s) => document.querySelector(s);
const canvas = $('#visor');

// ---------------- Renderizador y escena ----------------
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.localClippingEnabled = true;

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

crearMateriales();
crearEntorno(scene);
crearLuces(scene);
const reactor = crearReactor(scene);
const gases = crearGases(scene, reactor.anclas);
const inst = crearInstrumentos(scene, reactor.anclas);
const lupa = crearLupa();

const camara = new THREE.PerspectiveCamera(40, 1, 0.01, 30);
const controles = new OrbitControls(camara, canvas);
controles.enableDamping = true;
controles.dampingFactor = 0.08;
controles.maxPolarAngle = Math.PI * 0.495;
controles.minDistance = 0.06;
controles.maxDistance = 6;

function colorFondo() {
  const c = getComputedStyle(document.documentElement).getPropertyValue('--scene-bg').trim() || '#dce2e7';
  scene.background = new THREE.Color(c);
}
colorFondo();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', colorFondo);
new MutationObserver(colorFondo).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

// ---------------- Vistas de cámara ----------------
const VISTAS = {
  general: { pos: [1.7, 2.0, 2.45], obj: [-0.32, 0.98, -0.08] },
  gases: { pos: [-0.5, 1.55, 1.25], obj: [-1.05, 1.08, -0.35] },
  reactor: { pos: [0.52, 1.38, 0.82], obj: [0, 1.1, 0] },
  descarga: { pos: [0.15, 1.08, 0.27], obj: [0, 1.035, 0], corte: true },
  instrumentos: { pos: [1.0, 1.42, 1.05], obj: [0.42, 1.0, -0.1] },
  despiece: { pos: [0.98, 1.74, 1.3], obj: [-0.02, 1.36, 0] },
};
let viaje = null;
let vistaActual = 'general';
function irA(nombre, inmediato = false) {
  const v = VISTAS[nombre];
  if (!v) return;
  vistaActual = nombre;
  document.querySelectorAll('[data-vista]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.vista === nombre)));
  if (v.corte) fijarCorte(true);
  const destinoPos = new THREE.Vector3(...v.pos);
  const destinoObj = new THREE.Vector3(...v.obj);
  if (inmediato) {
    camara.position.copy(destinoPos);
    controles.target.copy(destinoObj);
    controles.update();
    return;
  }
  viaje = { t: 0, p0: camara.position.clone(), o0: controles.target.clone(), p1: destinoPos, o1: destinoObj };
}
document.querySelectorAll('[data-vista]').forEach((b) => b.addEventListener('click', () => irA(b.dataset.vista)));
controles.addEventListener('start', () => {
  viaje = null;
});

// ---------------- Capas: corte, etiquetas, lupa, despiece ----------------
let corte = false;
function fijarCorte(v) {
  corte = v;
  reactor.setCorte(v);
  $('#tg-corte').setAttribute('aria-pressed', String(v));
}
$('#tg-corte').addEventListener('click', () => fijarCorte(!corte));
// En pantallas angostas las etiquetas parten apagadas para no tapar la escena.
let verEtiquetas = window.innerWidth > 860;
$('#tg-etiquetas').setAttribute('aria-pressed', String(verEtiquetas));
$('#tg-etiquetas').addEventListener('click', (e) => {
  verEtiquetas = !verEtiquetas;
  e.currentTarget.setAttribute('aria-pressed', String(verEtiquetas));
});
let verLupa = true;
function fijarLupa(v) {
  verLupa = v;
  $('#tg-lupa').setAttribute('aria-pressed', String(v));
  $('#lupa').hidden = !verLupa || despiece > 0.02;
}
$('#tg-lupa').addEventListener('click', () => fijarLupa(!verLupa));
let despiece = 0;
function fijarDespiece(v) {
  despiece = v;
  $('#rng-despiece').value = Math.round(v * 100);
  $('#out-despiece').textContent = `${Math.round(v * 100)} %`;
  reactor.setDespiece(v);
  const oculto = v > 0.02;
  gases.conexiones.visible = !oculto;
  inst.conexiones.visible = !oculto;
  $('#lupa').hidden = !verLupa || oculto;
  $('#lista-despiece').hidden = v < 0.3;
}
$('#rng-despiece').addEventListener('input', (e) => {
  const v = Number(e.target.value) / 100;
  if (despiece === 0 && v > 0 && vistaActual !== 'despiece') irA('despiece');
  fijarDespiece(v);
});

// ---------------- Proceso e interfaz ----------------
const proceso = new Proceso();
let seleccion = null;
const hud = crearHUD(proceso, { alSeleccionarParte: seleccionar });

function aplicarGeometria() {
  const c = proceso.caso;
  reactor.setSeparacion(proceso.p.d, proceso.p.modo, c.muestra);
  lupa.configurar(c);
}
proceso.on((tipo) => {
  if (tipo === 'parametros') aplicarGeometria();
});
aplicarGeometria();

// ---------------- Selección de piezas ----------------
function mallasDe(id) {
  const lista = [];
  scene.traverse((o) => {
    if (o.isMesh && o.userData.partId === id && o.visible) lista.push(o);
  });
  return lista;
}
// Resaltado: una copia translúcida de cada malla de la pieza, visible a través de las demás.
const matResalte = new THREE.MeshBasicMaterial({ color: 0x8f7bff, transparent: true, opacity: 0.45, depthTest: false, depthWrite: false });
let resaltes = [];
// Las piezas pequeñas (sonda, condensador de medida…) llevan además una caja que las ubica a distancia.
const cajaResalte = new THREE.Box3Helper(new THREE.Box3(), 0x8f7bff);
cajaResalte.material.depthTest = false;
cajaResalte.material.transparent = true;
cajaResalte.renderOrder = 9;
cajaResalte.visible = false;
scene.add(cajaResalte);
const esCableado = (o) => o.parent === gases.conexiones || o.parent === inst.conexiones;
function seleccionar(id) {
  seleccion = id && PARTES[id] ? id : null;
  hud.mostrarParte(seleccion);
  document.querySelectorAll('#lista-piezas [data-parte]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.parte === seleccion)));
  for (const r of resaltes) r.parent?.remove(r);
  resaltes = [];
  cajaResalte.visible = false;
  if (!seleccion) return;
  const caja = cajaResalte.box.makeEmpty();
  for (const m of mallasDe(seleccion)) {
    if (m.isInstancedMesh) continue;
    if (!esCableado(m)) caja.expandByObject(m);
    const r = new THREE.Mesh(m.geometry, matResalte);
    r.renderOrder = 8;
    r.raycast = () => {};
    m.add(r);
    resaltes.push(r);
  }
  const tam = caja.getSize(new THREE.Vector3());
  if (!caja.isEmpty() && Math.max(tam.x, tam.y, tam.z) < 0.09) {
    caja.expandByScalar(0.012);
    cajaResalte.visible = true;
  }
}
function actualizarCaja() {
  matResalte.opacity = 0.3 + 0.2 * Math.sin(performance.now() / 260);
  cajaResalte.material.opacity = 0.65 + 0.35 * Math.sin(performance.now() / 260);
}

const raycaster = new THREE.Raycaster();
const puntero = new THREE.Vector2();
let abajo = null;
function parteBajo(e) {
  const r = canvas.getBoundingClientRect();
  puntero.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(puntero, camara);
  const hits = raycaster.intersectObjects(scene.children, true);
  for (const h of hits) {
    let o = h.object;
    if (!o.visible || !o.isMesh) continue;
    let oculto = false;
    for (let p = o; p; p = p.parent) if (!p.visible) oculto = true;
    if (oculto) continue;
    if (o.userData.partId) return o.userData.partId;
  }
  return null;
}
canvas.addEventListener('pointerdown', (e) => {
  abajo = { x: e.clientX, y: e.clientY };
});
canvas.addEventListener('pointerup', (e) => {
  if (!abajo || Math.hypot(e.clientX - abajo.x, e.clientY - abajo.y) > 5) return;
  const id = parteBajo(e);
  seleccionar(id === seleccion ? null : id);
});
let ultimoHover = 0;
canvas.addEventListener('pointermove', (e) => {
  const ahora = performance.now();
  if (e.buttons || ahora - ultimoHover < 80) return;
  ultimoHover = ahora;
  canvas.style.cursor = parteBajo(e) ? 'pointer' : 'grab';
});

// ---------------- Etiquetas 3D ----------------
const capa = $('#etiquetas');
const lupaEl = $('#lupa');
const ETQ = [
  { id: 'cilAux', texto: 'Suministro de gases', pos: [-1.47, 1.32, -0.42] },
  { id: 'panelMFC', texto: 'Controladores de caudal', tag: 'FIC-101 a 103', pos: [-0.6, 1.47, -0.33] },
  { id: 'humidificador', texto: 'Humidificador', pos: [-0.43, 1.13, -0.2] },
  { id: 'sensorHR', texto: 'Humedad', tag: 'MT-201', pos: [-0.3, 0.985, -0.13], nivel: 2 },
  { id: 'jaula', texto: 'Reactor DBD', tag: 'jaula de Faraday', pos: [-0.1, 1.42, 0.21] },
  { id: 'fuente', texto: 'Fuente de alta tensión', pos: [0.45, 1.09, 0.11] },
  { id: 'sondaAT', texto: 'Sonda de alta tensión', tag: 'EI-401', pos: [0.4, 1.13, -0.13], nivel: 2 },
  { id: 'rogowski', texto: 'Bobina de Rogowski', tag: 'II-402', pos: [0.255, 0.975, 0.066], nivel: 2 },
  { id: 'capMedida', texto: 'Condensador de medida', tag: 'JI-403', pos: [0.31, 0.955, 0.105], nivel: 2 },
  { id: 'osciloscopio', texto: 'Osciloscopio', pos: [0.74, 1.08, -0.17], nivel: 2 },
  { id: 'espectrometro', texto: 'Espectrómetro', tag: 'AI-501', pos: [0.1, 0.965, -0.29], nivel: 2 },
  { id: 'camaraIR', texto: 'Cámara IR', tag: 'TI-302', pos: [-0.37, 1.085, -0.05], nivel: 2 },
  { id: 'monitorO3', texto: 'Monitor de O₃', tag: 'AI-502', pos: [0.3, 1.04, -0.27] },
  { id: 'destructor', texto: 'Destructor de O₃', pos: [0.5, 1.12, -0.29], nivel: 2 },
  { id: 'extraccion', texto: 'Extracción', pos: [0.5, 1.62, -0.36], nivel: 2 },
  { id: 'balanza', texto: 'Balanza', tag: 'WI-601', pos: [-0.45, 0.99, 0.2] },
  { id: 'pc', texto: 'Registro del lote', pos: [0.56, 1.13, 0.2], nivel: 2 },
  { id: 'paro', texto: 'Paro de emergencia', tag: 'HS-802', pos: [0.26, 0.99, 0.3], nivel: 2 },
  { id: 'sensorO3amb', texto: 'O₃ ambiental', tag: 'AI-503', pos: [-0.12, 1.51, -0.33], nivel: 2 },
].map((e) => {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'etq';
  // Guion no separable en los tags (FIC‑101): el código no se corta entre líneas
  el.innerHTML = `${e.tag ? `<b>${e.tag.replace(/-/g, '\u2011')}</b>` : ''}${e.texto}`;
  el.addEventListener('click', () => seleccionar(e.id));
  capa.appendChild(el);
  return { ...e, el, v: new THREE.Vector3(...e.pos), ancho: 22 + 6.6 * (e.texto.length + (e.tag ? e.tag.length + 1 : 0)) };
});
// Un paso del recorrido puede declarar qué etiquetas mostrar (sin filtro de distancia); null = automático.
let etiquetasPaso = null;
function fijarEtiquetas(lista) {
  etiquetasPaso = Array.isArray(lista) ? new Set(lista) : null;
}
// Globos numerados del despiece con líneas guía y lista de piezas
const globos = reactor.piezasDespiece.map(() => {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = 'etq num';
  capa.appendChild(el);
  return el;
});
$('#lista-piezas').innerHTML = Object.entries(PARTES)
  .filter(([, p]) => p.n)
  .sort((a, b) => a[1].n - b[1].n)
  .map(([id, p]) => `<li><button type="button" data-parte="${id}" aria-pressed="false" title="${p.nombre}"><b>${p.n}</b>${p.corto}</button></li>`)
  .join('');
$('#lista-piezas').addEventListener('click', (e) => {
  const b = e.target.closest('[data-parte]');
  if (b) seleccionar(b.dataset.parte === seleccion ? null : b.dataset.parte);
});
const guiaPos = new Float32Array(reactor.piezasDespiece.length * 6 + 6);
const guiaGeo = new THREE.BufferGeometry();
guiaGeo.setAttribute('position', new THREE.BufferAttribute(guiaPos, 3));
const guias = new THREE.LineSegments(guiaGeo, new THREE.LineBasicMaterial({ color: 0x8f7bff, depthTest: false, transparent: true, opacity: 0.85 }));
guias.renderOrder = 9;
guias.frustumCulled = false;
scene.add(guias);

const tmpV = new THREE.Vector3();
// Rectángulos ya ocupados en pantalla (paneles, tarjetas, lupa y etiquetas puestas en este cuadro).
// Una etiqueta que choca con uno de ellos no se dibuja; las de mayor prioridad se colocan primero.
let ocupados = [];
const OVERLAYS = ['header.barra', '#consola', '#instrumentos', '.vistas', '#lupa', '#pieza', '#alarmas', '#tarjeta-paso', '#barra-pres', '#notas-orador', '#lista-despiece'];
function medirOverlays() {
  const rc = canvas.getBoundingClientRect();
  ocupados = [];
  for (const sel of OVERLAYS) {
    const el = document.querySelector(sel);
    if (!el || el.hidden || el.offsetParent === null) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    ocupados.push({ x0: r.left - rc.left, y0: r.top - rc.top, x1: r.right - rc.left, y1: r.bottom - rc.top });
  }
}
const choca = (r) => ocupados.some((o) => r.x0 < o.x1 && r.x1 > o.x0 && r.y0 < o.y1 && r.y1 > o.y0);
function proyectar(v, el, w, h, alinear = 'translate(-50%, -100%)', ancho = 0, alto = 0) {
  tmpV.copy(v).project(camara);
  const x = ((tmpV.x + 1) / 2) * w;
  const y = ((1 - tmpV.y) / 2) * h;
  let visible = tmpV.z < 1 && tmpV.x > -1.1 && tmpV.x < 1.1 && tmpV.y > -1.1 && tmpV.y < 1.1;
  if (visible && ancho) {
    const centrada = alinear.includes('-50%, -50%');
    const r = centrada
      ? { x0: x - ancho / 2, y0: y - alto / 2, x1: x + ancho / 2, y1: y + alto / 2 }
      : { x0: x - ancho / 2, y0: y - alto - 2, x1: x + ancho / 2, y1: y };
    // Una etiqueta cortada por el borde del lienzo no se dibuja
    if (r.x0 < 4 || r.x1 > w - 4 || r.y0 < 4 || r.y1 > h - 4 || choca(r)) visible = false;
    else ocupados.push(r);
  }
  el.style.display = visible ? '' : 'none';
  if (visible) el.style.transform = `translate(${x}px, ${y}px) ${alinear}`;
}
const cajaTmp = new THREE.Box3();
function actualizarEtiquetas() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  medirOverlays();
  const enDespiece = despiece > 0.3;
  const enRecorrido = presentacion.activo;
  const ver = verEtiquetas || enRecorrido;
  for (const e of ETQ) {
    let mostrar;
    if (enRecorrido && etiquetasPaso) mostrar = etiquetasPaso.has(e.id);
    else mostrar = vistaActual === 'general' ? e.nivel !== 2 : camara.position.distanceTo(e.v) < 1.25;
    if (!ver || enDespiece || !mostrar || vistaActual === 'descarga') e.el.style.display = 'none';
    else proyectar(e.v, e.el, w, h, undefined, e.ancho, 24);
  }
  const numeros = enDespiece && ver;
  guias.visible = numeros;
  reactor.piezasDespiece.forEach((pz, i) => {
    const el = globos[i];
    if (!numeros) {
      el.style.display = 'none';
      return;
    }
    const info = PARTES[pz.partId];
    const a = cajaTmp.setFromObject(pz.obj).getCenter(new THREE.Vector3());
    const b = a.clone().add(new THREE.Vector3(...pz.etq));
    guiaPos.set([a.x, a.y, a.z, b.x, b.y, b.z], i * 6);
    if (el.dataset.id !== pz.partId) {
      el.dataset.id = pz.partId;
      el.textContent = info.n;
      el.title = info.nombre;
      el.setAttribute('aria-label', `${info.n}. ${info.nombre}`);
      el.onclick = () => seleccionar(pz.partId);
    }
    proyectar(b, el, w, h, 'translate(-50%, -50%)', 24, 24);
  });
  guiaGeo.attributes.position.needsUpdate = true;
}

// ---------------- Estado para la escena ----------------
let onda = F.formaDeOnda(proceso.des, 0, 300, false);
let tOnda = 0;
let espectroCache = { clave: '', datos: null };
function estado(dt) {
  const p = proceso.p;
  const caso = proceso.caso;
  const comp = proceso.comp;
  const P = proceso.P;
  const plasma = proceso.plasma;
  const Pn = plasma ? Math.min(1, 0.2 + P / 300) : 0;
  const especies = F.especies(comp, p.HR, Pn);
  tOnda += dt;
  if (tOnda > 0.15) {
    tOnda = 0;
    const V = proceso.altaTension ? (proceso.des.limitada ? proceso.des.Vef : proceso.Vact) : 0;
    onda = F.formaDeOnda(proceso.des, V, 300, true);
  }
  const clave = `${p.gas}|${p.HR}|${Math.round(Pn * 20)}`;
  if (clave !== espectroCache.clave) {
    espectroCache = { clave, datos: F.espectro(F.pesosEmision(comp, p.HR, Pn)) };
  }
  const flujo = proceso.flujo && (p.modo === 'abierto' || proceso.fase === 'purga');
  const neb = new THREE.Color(0x5fd3e6).lerp(new THREE.Color(0xe08a4a), Math.min(1, especies.NOx / Math.max(0.01, especies.O3 + especies.NOx)));
  return {
    fase: proceso.fase,
    faseNombre: FASES.find((f) => f.id === proceso.fase)?.nombre || '',
    altaTension: proceso.altaTension,
    plasma,
    P,
    Vact: proceso.Vact,
    f: p.f,
    E: proceso.E,
    Tgas: proceso.Tgas,
    Tsus: proceso.Tsus,
    O3: proceso.O3,
    O3amb: proceso.O3amb,
    flujo,
    HR: p.HR,
    Q: p.Q,
    modo: p.modo,
    masa: p.masa,
    tSim: proceso.tSim,
    tTrat: proceso.tTrat,
    velocidad: proceso.velocidadFase(),
    color: F.colorPlasma(comp),
    distCamara: camara.position.distanceTo(reactor.anclas.centroDescarga),
    difusa: F.esDifusa(comp),
    colorNeblina: [neb.r, neb.g, neb.b],
    especies,
    espectro: espectroCache.datos,
    tipoCaso: caso.tipo,
    progreso: proceso.progreso,
    valorRef: caso.resultado?.valor ?? 0,
    fraccionCaso: proceso.fraccionCaso,
    mfc: consignasMFC(p.gas, p.Q),
    Qtotal: p.Q,
    Qsalida: p.modo === 'abierto' ? p.Q : proceso.fase === 'purga' ? p.Q : 0,
    paro: proceso.paro,
    puertaAbierta: proceso.puertaAbierta,
    alarmas: proceso.alarmas,
    historial: proceso.historial,
    onda,
  };
}

// Pantallas pequeñas del panel de gases y del sensor de humedad
function dibujarPantallasGas(est) {
  const vals = [est.mfc.m1.q, est.mfc.m2, est.mfc.m3.q];
  const nombres = [est.mfc.m1.fuente === 'aire' ? 'AIRE' : 'N₂', 'O₂', est.mfc.m3.gas ? { CO2: 'CO₂', Ar: 'Ar', He: 'He' }[est.mfc.m3.gas] : '—'];
  gases.pantallasMFC.forEach((pt, i) => {
    const { ctx, canvas: c, tex } = pt;
    ctx.fillStyle = '#0f1a14';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.font = '600 34px "IBM Plex Mono", monospace';
    ctx.fillStyle = '#c8ffd8';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(fmt(est.flujo ? vals[i] : 0, 2), c.width - 8, 30);
    ctx.font = '500 20px "IBM Plex Mono", monospace';
    ctx.fillStyle = '#9fd8b4';
    ctx.fillText('L/min', c.width - 8, 62);
    ctx.textAlign = 'left';
    ctx.fillText(nombres[i], 8, 62);
    tex.needsUpdate = true;
  });
  const { ctx, canvas: c, tex } = gases.pantallaHR;
  ctx.fillStyle = '#0f1a14';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.font = '600 34px "IBM Plex Mono", monospace';
  ctx.fillStyle = '#c8ffd8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${fmt(est.flujo ? est.HR : 0, 0)} %HR`, c.width / 2, c.height / 2);
  tex.needsUpdate = true;
}

// ---------------- Tamaño y bucle ----------------
// Centra la imagen en el área que dejan libre los paneles laterales (escritorio).
function redimensionar() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camara.aspect = w / h;
  let desplazamiento = 0;
  if (window.innerWidth > 860) {
    const pi = $('#consola');
    const pd = $('#instrumentos');
    const pl = $('#lupa');
    let izq = pi.offsetParent ? pi.getBoundingClientRect().right : 0;
    if (pl.offsetParent && !pl.hidden && pl.getBoundingClientRect().left < w * 0.1) izq = Math.max(izq, pl.getBoundingClientRect().right);
    const der = pd.offsetParent ? pd.getBoundingClientRect().left : w;
    desplazamiento = (izq + der) / 2 - w / 2;
  }
  camara.setViewOffset(w, h, -desplazamiento, 0, w, h);
  camara.updateProjectionMatrix();
}
window.addEventListener('resize', redimensionar);
new ResizeObserver(redimensionar).observe(canvas);
redimensionar();
irA('general', true);

const reloj = new THREE.Clock();
let tPantallas = 0;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function cuadro() {
  requestAnimationFrame(cuadro);
  const dtReal = reloj.getDelta();
  const dt = Math.min(0.1, dtReal);
  proceso.paso(dt);
  const est = estado(dt);

  if (viaje) {
    // Tiempo real: el viaje dura ≈ 1,1 s aunque el equipo dibuje pocos cuadros por segundo
    viaje.t = Math.min(1, viaje.t + Math.min(dtReal, 0.25) / 1.1);
    const k = easeInOut(viaje.t);
    camara.position.lerpVectors(viaje.p0, viaje.p1, k);
    controles.target.lerpVectors(viaje.o0, viaje.o1, k);
    if (viaje.t >= 1) viaje = null;
  }
  controles.update();

  reactor.update(dt, est);
  gases.update(dt, est);
  inst.update(dt, est);
  tPantallas += dt;
  if (tPantallas > 0.1) {
    tPantallas = 0;
    inst.dibujar(est);
    dibujarPantallasGas(est);
  }
  presentacion.actualizar(dtReal);
  actualizarCaja();
  actualizarEtiquetas();
  hud.actualizar(est, dt);

  renderer.setScissorTest(false);
  renderer.setViewport(0, 0, canvas.clientWidth, canvas.clientHeight);
  renderer.render(scene, camara);

  // Lupa en su recuadro
  if (verLupa && lupaEl.offsetParent !== null && despiece < 0.02) {
    lupa.update(dt, est);
    const rc = canvas.getBoundingClientRect();
    const rl = lupaEl.getBoundingClientRect();
    const x = rl.left - rc.left;
    const y = rc.bottom - rl.bottom;
    if (rl.width > 0 && rl.bottom <= rc.bottom + 1 && rl.top >= rc.top - 1) {
      renderer.setScissorTest(true);
      renderer.setViewport(x, y, rl.width, rl.height);
      renderer.setScissor(x, y, rl.width, rl.height);
      lupa.camara.aspect = rl.width / rl.height;
      lupa.camara.updateProjectionMatrix();
      renderer.render(lupa.scene, lupa.camara);
      renderer.setScissorTest(false);
    }
    $('#lupa-info').textContent = `${est.plasma ? (est.difusa ? 'descarga difusa · ' : 'microdescargas · ') : ''}esquemático, sin escala`;
  }
}

// ---------------- Modo Presentar ----------------
function mostrarPanel(tab, ancla) {
  $('#app').dataset.panelPres = tab ? '1' : '0';
  if (tab) hud.elegirTab(tab, ancla);
  window.dispatchEvent(new Event('resize'));
}
const presentacion = crearPresentacion({
  experimento: EXPERIMENTO,
  pasos: PASOS,
  ctx: { proceso, irA, fijarCorte, fijarDespiece, fijarLupa, fijarEtiquetas, seleccionar, mostrarPanel },
});

// Acceso desde la consola del navegador (depuración y demostraciones).
window.bancoDBD = { proceso, irA, seleccionar, presentacion };

cuadro();
