// Celda del reactor DBD: jaula de Faraday, cámara, pila electrodo–barrera–muestra–barrera–electrodo,
// plasma animado, despiece y corte.
import * as THREE from 'three';
import { M, conCorte, caja, cilindro, esfera, en, registrar, senalAT, planoCorte, texturaPunto, rotulo } from './materiales.js';
import { MESA_Y } from './entorno.js';
import { crearMuestra } from './muestras.js';

export const JAULA = { w: 0.42, h: 0.46, d: 0.42 };
const Y_CAM = 0.006; // la cámara se apoya sobre el piso de la jaula
const Y_TB = 0.135; // cara inferior de la barrera superior (coordenadas de la cámara)
const R_CAM = 0.095;
const H_CAM = 0.17;

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function crearReactor(scene) {
  const raiz = new THREE.Group();
  raiz.name = 'reactor';
  raiz.position.set(0, MESA_Y, 0);
  scene.add(raiz);

  const mc = {
    ptfe: conCorte(M.ptfe),
    alu: conCorte(M.aluminio),
    cuarzo: conCorte(M.cuarzo),
    pc: conCorte(M.policarbonato),
    laton: conCorte(M.laton),
    malla: conCorte(M.malla),
    perfil: conCorte(M.perfil),
    pfa: conCorte(M.pfa),
    nylon: conCorte(M.nylon),
    znse: conCorte(M.znse),
    inox: conCorte(M.inox),
    negro: conCorte(M.negro),
    fibra: conCorte(M.fibra),
  };

  const moviles = []; // { obj, home: Vector3, off: Vector3 }
  const mover = (obj, off) => {
    moviles.push({ obj, home: obj.position.clone(), off: new THREE.Vector3(...off) });
    return obj;
  };
  const piezasDespiece = []; // { partId, obj, lado }

  // ---------------- Jaula de Faraday ----------------
  const { w, h, d } = JAULA;
  const jaula = new THREE.Group();
  raiz.add(jaula);
  const piso = en(caja(w, 0.006, d, mc.perfil), 0, 0.003, 0);
  jaula.add(registrar(piso, 'jaula'));
  const marco = new THREE.Group();
  const s = 0.015;
  for (const x of [-1, 1]) for (const z of [-1, 1]) marco.add(en(caja(s, h, s, mc.perfil), x * (w / 2 - s / 2), h / 2, z * (d / 2 - s / 2)));
  for (const y of [s / 2, h - s / 2]) {
    for (const z of [-1, 1]) marco.add(en(caja(w, s, s, mc.perfil), 0, y, z * (d / 2 - s / 2)));
    for (const x of [-1, 1]) marco.add(en(caja(s, s, d, mc.perfil), x * (w / 2 - s / 2), y, 0));
  }
  jaula.add(registrar(marco, 'jaula'));

  const panel = (ancho, alto) => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(ancho, alto), mc.malla);
    p.material.alphaMap.repeat.set(ancho * 14, alto * 14);
    return p;
  };
  const pAtras = en(panel(w - s, h - s), 0, h / 2, -d / 2 + 0.002);
  const pIzq = en(panel(d - s, h - s), -w / 2 + 0.002, h / 2, 0);
  pIzq.rotation.y = Math.PI / 2;
  const pDer = en(panel(d - s, h - s), w / 2 - 0.002, h / 2, 0);
  pDer.rotation.y = -Math.PI / 2;
  const techo = new THREE.Group();
  techo.position.set(0, h, 0);
  const pTecho = panel(w - s, d - s);
  pTecho.rotation.x = -Math.PI / 2;
  techo.add(pTecho);
  // pasamuros de alta tensión en el techo y salida de gas
  techo.add(en(cilindro(0.022, 0.03, mc.ptfe, 24), 0, 0.006, 0));
  techo.add(en(cilindro(0.006, 0.03, mc.inox, 12), 0.06, 0.006, -0.06));
  for (const p of [pAtras, pIzq, pDer]) jaula.add(registrar(p, 'jaula'));
  jaula.add(registrar(techo, 'jaula'));
  // guía de onda para la cámara IR y pasamuros de la fibra OES
  const guiaIR = cilindro(0.013, 0.04, mc.perfil, 20);
  guiaIR.rotation.z = Math.PI / 2;
  guiaIR.position.set(-w / 2, Y_CAM + 0.131, -0.0475);
  jaula.add(registrar(guiaIR, 'jaula'));
  const pasaFibra = cilindro(0.008, 0.03, mc.perfil, 16);
  pasaFibra.rotation.x = Math.PI / 2;
  pasaFibra.position.set(0, Y_CAM + 0.131, -d / 2);
  jaula.add(registrar(pasaFibra, 'jaula'));
  mover(pAtras, [0, 0, -0.36]);
  mover(pasaFibra, [0, 0, -0.36]);
  mover(pIzq, [-0.42, 0, 0]);
  mover(guiaIR, [-0.42, 0, 0]);
  mover(pDer, [0.34, 0, 0]);
  mover(techo, [0, 0.62, 0]);

  // Puerta con bisagra a la izquierda
  const puerta = new THREE.Group();
  puerta.position.set(-w / 2 + s / 2, 0, d / 2);
  const pPuerta = en(panel(w - s * 2, h - s), w / 2 - s / 2, h / 2, 0.001);
  puerta.add(pPuerta);
  const manija = en(caja(0.012, 0.08, 0.018, M.negro), w - s * 2, h / 2, 0.012);
  puerta.add(manija);
  const senal = senalAT(0.06);
  senal.position.set(w / 2 - s / 2, h * 0.78, 0.004);
  puerta.add(senal);
  const actuador = en(caja(0.012, 0.02, 0.01, M.amarilloSeg), w - s * 1.6, h * 0.62, 0.006);
  puerta.add(actuador);
  raiz.add(registrar(puerta, 'puerta'));
  mover(puerta, [0, 0, 0.4]);
  // interruptor de enclavamiento fijo en el marco
  const interruptor = en(caja(0.02, 0.035, 0.018, M.amarilloSeg), w / 2 - 0.004, h * 0.62, d / 2 - 0.015);
  jaula.add(registrar(interruptor, 'puerta'));

  // Baliza y paro sobre el techo de la jaula
  const baliza = new THREE.Group();
  baliza.add(en(cilindro(0.016, 0.012, M.negro, 16), 0, 0.006, 0));
  const lente = new THREE.Mesh(
    new THREE.CylinderGeometry(0.014, 0.014, 0.04, 16),
    new THREE.MeshStandardMaterial({ color: 0xffb21a, emissive: 0x000000, transparent: true, opacity: 0.85, roughness: 0.3 }),
  );
  lente.position.y = 0.032;
  baliza.add(lente);
  baliza.position.set(w / 2 - 0.03, 0, d / 2 - 0.03);
  techo.add(registrar(baliza, 'baliza'));
  const luzBaliza = new THREE.PointLight(0xffa100, 0, 1.2, 2);
  luzBaliza.position.set(0, 0.04, 0);
  baliza.add(luzBaliza);

  // ---------------- Cámara ----------------
  const cam = new THREE.Group();
  cam.position.y = Y_CAM;
  raiz.add(cam);

  // Base con puertos
  const base = new THREE.Group();
  base.add(en(cilindro(0.12, 0.025, mc.ptfe, 48), 0, 0.0125, 0));
  const entrada = cilindro(0.005, 0.03, mc.inox, 12);
  entrada.rotation.z = Math.PI / 2;
  entrada.position.set(-0.125, 0.0125, 0);
  const tierra = cilindro(0.006, 0.026, mc.laton, 12);
  tierra.rotation.z = Math.PI / 2;
  tierra.position.set(0.123, 0.0125, 0);
  base.add(entrada, tierra);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.2;
    base.add(en(cilindro(0.004, 0.006, mc.inox, 8), Math.cos(a) * 0.108, 0.027, Math.sin(a) * 0.108));
  }
  cam.add(registrar(base, 'base'));
  piezasDespiece.push({ partId: 'base', obj: base, etq: [-0.085, 0, 0] });

  // Elevador micrométrico (cuerpo fijo + pistón + plataforma)
  const elevador = new THREE.Group();
  const cuerpo = en(cilindro(0.05, 0.03, mc.nylon, 36), 0, 0.04, 0);
  const perilla = cilindro(0.011, 0.024, mc.inox, 24);
  perilla.rotation.x = Math.PI / 2;
  perilla.position.set(0, 0.04, 0.062);
  const escala = cilindro(0.0125, 0.006, mc.negro, 24);
  escala.rotation.x = Math.PI / 2;
  escala.position.set(0, 0.04, 0.051);
  const piston = cilindro(0.04, 1, mc.nylon, 32);
  const plataforma = cilindro(0.06, 0.008, mc.ptfe, 40);
  elevador.add(cuerpo, perilla, escala, piston, plataforma);
  cam.add(registrar(elevador, 'elevador'));
  piezasDespiece.push({ partId: 'elevador', obj: elevador, etq: [-0.085, 0, 0] });

  const eTierra = cilindro(0.05, 0.01, mc.alu, 48);
  cam.add(registrar(eTierra, 'electrodoTierra'));
  piezasDespiece.push({ partId: 'electrodoTierra', obj: eTierra, etq: [-0.085, 0, 0] });

  const bInf = cilindro(0.065, 0.002, mc.cuarzo, 48);
  cam.add(registrar(bInf, 'barreraInf'));
  piezasDespiece.push({ partId: 'barreraInf', obj: bInf, etq: [-0.085, 0, 0] });

  // Sensor de temperatura de fibra óptica (TT-303) que sube por la base hasta la placa
  const fibraT = cilindro(0.0012, 1, mc.fibra, 6);
  cam.add(registrar(fibraT, 'fibraT'));

  // Barrera y electrodo superiores (fijos)
  const bSup = en(cilindro(0.065, 0.002, mc.cuarzo, 48), 0, Y_TB + 0.001, 0);
  cam.add(registrar(bSup, 'barreraSup'));
  piezasDespiece.push({ partId: 'barreraSup', obj: bSup, etq: [-0.085, 0, 0] });
  const eAT = new THREE.Group();
  eAT.add(en(cilindro(0.05, 0.01, mc.alu, 48), 0, 0, 0));
  eAT.add(en(cilindro(0.006, 0.05, mc.laton, 16), 0, 0.03, 0));
  eAT.position.y = Y_TB + 0.007;
  cam.add(registrar(eAT, 'electrodoAT'));
  piezasDespiece.push({ partId: 'electrodoAT', obj: eAT, etq: [-0.085, 0, 0] });

  // Difusor anular de gas
  const difusor = new THREE.Group();
  const anillo = new THREE.Mesh(new THREE.TorusGeometry(0.078, 0.0028, 8, 64), mc.pfa);
  anillo.rotation.x = Math.PI / 2;
  difusor.add(anillo);
  const alimentacion = en(cilindro(0.0028, Y_TB - 0.006 - 0.025, mc.pfa, 8), -0.078, -(Y_TB - 0.006 - 0.025) / 2, 0);
  difusor.add(alimentacion);
  difusor.position.y = Y_TB - 0.006;
  cam.add(registrar(difusor, 'difusor'));
  piezasDespiece.push({ partId: 'difusor', obj: anillo, etq: [-0.085, 0, 0] });

  // Tapa y pasamuros
  const tapa = new THREE.Group();
  tapa.add(en(cilindro(0.12, 0.025, mc.ptfe, 48), 0, 0, 0));
  tapa.add(en(cilindro(0.005, 0.02, mc.inox, 12), 0.06, 0.022, -0.06));
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.2;
    tapa.add(en(cilindro(0.004, 0.006, mc.inox, 8), Math.cos(a) * 0.108, 0.015, Math.sin(a) * 0.108));
  }
  tapa.position.y = Y_CAM + H_CAM + 0.025 + 0.0125 - Y_CAM;
  cam.add(registrar(tapa, 'tapa'));
  piezasDespiece.push({ partId: 'tapa', obj: tapa, etq: [-0.085, 0, 0] });
  const termopar = new THREE.Group();
  termopar.add(en(cilindro(0.0016, 0.05, mc.inox, 8), 0, 0.02, 0));
  termopar.add(en(caja(0.012, 0.01, 0.008, M.amarilloSeg), 0, 0.048, 0));
  termopar.position.set(0.035, tapa.position.y, -0.08);
  cam.add(registrar(termopar, 'termopar'));

  const bushing = new THREE.Group();
  bushing.add(en(cilindro(0.02, 0.08, mc.ptfe, 24), 0, 0.04, 0));
  for (let i = 0; i < 4; i++) bushing.add(en(cilindro(0.03, 0.005, mc.ptfe, 24), 0, 0.016 + i * 0.017, 0));
  bushing.add(en(cilindro(0.01, 0.02, mc.laton, 16), 0, 0.09, 0));
  bushing.add(en(esfera(0.014, mc.laton), 0, 0.105, 0));
  bushing.position.y = tapa.position.y + 0.0125;
  cam.add(registrar(bushing, 'bushing'));
  piezasDespiece.push({ partId: 'bushing', obj: bushing, etq: [-0.085, 0, 0] });

  // Cuerpo de policarbonato en dos mitades (frontal z>0 y posterior z<0)
  const yCuerpo = 0.025 + H_CAM / 2;
  const mitad = (inicio, nombre) => {
    const grp = new THREE.Group();
    grp.name = nombre;
    const casco = new THREE.Mesh(new THREE.CylinderGeometry(R_CAM, R_CAM, H_CAM, 56, 1, true, inicio, Math.PI), mc.pc);
    grp.add(casco);
    for (const y of [-H_CAM / 2 + 0.004, H_CAM / 2 - 0.004]) {
      const aro = new THREE.Mesh(new THREE.TorusGeometry(R_CAM, 0.003, 6, 40, Math.PI), mc.pc);
      aro.rotation.x = nombre === 'frontal' ? Math.PI / 2 : -Math.PI / 2;
      aro.position.y = y;
      grp.add(aro);
    }
    // aristas para que el cuerpo transparente se lea
    const bordes = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.CylinderGeometry(R_CAM, R_CAM, H_CAM, 14, 1, true, inicio, Math.PI), 30),
      new THREE.LineBasicMaterial({ color: 0x9fb6c6, transparent: true, opacity: 0.5, clippingPlanes: [planoCorte] }),
    );
    grp.add(bordes);
    grp.position.y = yCuerpo;
    return grp;
  };
  const frontal = mitad(-Math.PI / 2, 'frontal');
  const posterior = mitad(Math.PI / 2, 'posterior');
  cam.add(registrar(frontal, 'camara'), registrar(posterior, 'camara'));
  piezasDespiece.push({ partId: 'camara', obj: posterior, etq: [-0.12, 0.1, 0] });

  const puerto = (theta, partId, matVentana) => {
    const grp = new THREE.Group();
    const dir = new THREE.Vector3(Math.sin(theta), 0, Math.cos(theta));
    const brida = cilindro(0.016, 0.016, mc.inox, 24, null, false);
    const ventana = cilindro(0.0125, 0.003, matVentana, 24);
    ventana.position.y = 0.009;
    grp.add(brida, ventana);
    grp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    grp.position.copy(dir.clone().multiplyScalar(R_CAM + 0.004));
    grp.position.y = Y_TB - 0.004 - yCuerpo;
    registrar(grp, partId);
    return grp;
  };
  const vOES = puerto(Math.PI, 'ventanaOES', mc.cuarzo);
  const vIR = puerto((-2 * Math.PI) / 3, 'ventanaIR', mc.znse);
  posterior.add(vOES, vIR);
  piezasDespiece.push({ partId: 'ventanaOES', obj: vOES, etq: [-0.12, 0.02, 0] });
  piezasDespiece.push({ partId: 'ventanaIR', obj: vIR, etq: [-0.08, -0.08, 0] });

  // ---------------- Plasma ----------------
  const plasma = new THREE.Group();
  cam.add(plasma);
  const uniforms = { uTime: { value: 0 }, uI: { value: 0 }, uColor: { value: new THREE.Color(0.5, 0.42, 1) }, uDifusa: { value: 0 } };
  const glowMat = new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      varying vec3 vP; uniform float uTime; uniform float uI; uniform vec3 uColor; uniform float uDifusa;
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
      float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
      void main(){
        float r = length(vP.xz)/0.05;
        float borde = smoothstep(1.02, 0.75, r);
        float ruido = n(vP.xz*160.0 + vec2(uTime*7.0, -uTime*5.0));
        float a = uI * borde * mix(0.25 + 0.75*ruido*ruido, 0.75 + 0.25*ruido, uDifusa);
        gl_FragColor = vec4(uColor * a, a);
      }`,
  });
  const glow = new THREE.Mesh(new THREE.CylinderGeometry(0.0495, 0.0495, 1, 48, 1, false), glowMat);
  plasma.add(glow);
  const NF = 160;
  const filamentos = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(1, 1, 1, 5, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xa99bff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false }),
    NF,
  );
  filamentos.frustumCulled = false;
  plasma.add(filamentos);
  const luzPlasma = new THREE.PointLight(0x8f7bff, 0, 1.2, 2);
  plasma.add(luzPlasma);
  // Halo visible desde las vistas generales
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: texturaPunto(), color: 0x8f7bff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }));
  halo.scale.set(0.26, 0.09, 1);
  plasma.add(halo);

  // Nube de especies de vida larga (O₃, NOₓ) que sale hacia la tapa
  const NH = 260;
  const hPos = new Float32Array(NH * 3);
  const hVel = new Float32Array(NH * 3);
  const resetH = (i) => {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 0.06;
    hPos[i * 3] = Math.cos(a) * r;
    hPos[i * 3 + 1] = Y_TB - 0.004 + Math.random() * 0.004;
    hPos[i * 3 + 2] = Math.sin(a) * r;
  };
  for (let i = 0; i < NH; i++) {
    resetH(i);
    hPos[i * 3 + 1] = 0.03 + Math.random() * 0.16;
  }
  const geoH = new THREE.BufferGeometry();
  geoH.setAttribute('position', new THREE.BufferAttribute(hPos, 3));
  const neblina = new THREE.Points(
    geoH,
    new THREE.PointsMaterial({ color: 0x7fd3ff, size: 0.006, map: texturaPunto(), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  cam.add(neblina);

  // ---------------- Muestra ----------------
  let muestra = null;
  const estadoPila = { d: 3, modo: 'abierto', clave: null };

  function colocarPila() {
    const { d: dmm, modo } = estadoPila;
    const dd = dmm / 1000;
    const hSop = muestra.alturaSoporte;
    const ySup = Y_TB - dd; // superficie de la muestra
    const yBbt = ySup - hSop; // cara superior de la barrera inferior
    bInf.position.set(0, yBbt - 0.001, 0);
    eTierra.position.set(0, yBbt - 0.002 - 0.005, 0);
    const yPlat = yBbt - 0.002 - 0.01 - 0.004;
    plataforma.position.set(0, yPlat, 0);
    const largo = yPlat - 0.004 - 0.055;
    piston.scale.y = Math.max(0.002, largo);
    piston.position.y = 0.055 + largo / 2;
    muestra.grupo.position.set(0, yBbt, 0);
    if (modo === 'envase') muestra.setAltura(Y_TB - yBbt - 0.0003);
    fibraT.scale.y = yBbt - 0.025;
    fibraT.position.set(0.068, 0.025 + (yBbt - 0.025) / 2, 0.02);
    // plasma entre la superficie de la muestra y la barrera superior
    glow.scale.y = dd;
    glow.position.y = ySup + dd / 2;
    plasma.userData.y0 = ySup;
    plasma.userData.gap = dd;
    luzPlasma.position.y = ySup + dd / 2;
    halo.position.y = ySup + dd / 2;
    for (const m of moviles) {
      if (m.obj === bInf || m.obj === eTierra || m.obj === elevador || m.obj === muestra.grupo || m.obj === fibraT) m.home.copy(m.obj.position);
    }
    aplicarDespiece(estadoDespiece);
  }

  function setMuestra(clave, modo) {
    if (muestra) {
      cam.remove(muestra.grupo);
      const i = moviles.findIndex((m) => m.obj === muestra.grupo);
      if (i >= 0) moviles.splice(i, 1);
      const j = piezasDespiece.findIndex((p) => p.partId === 'muestra');
      if (j >= 0) piezasDespiece.splice(j, 1);
    }
    muestra = crearMuestra(clave, modo);
    cam.add(registrar(muestra.grupo, 'muestra'));
    mover(muestra.grupo, [0, 0.2, 0]);
    piezasDespiece.push({ partId: 'muestra', obj: muestra.grupo, etq: [-0.085, 0, 0] });
    estadoPila.clave = clave;
    estadoPila.modo = modo;
    colocarPila();
  }

  function setSeparacion(dmm, modo, clave) {
    const cambiaMuestra = clave !== estadoPila.clave || modo !== estadoPila.modo;
    estadoPila.d = dmm;
    estadoPila.modo = modo;
    if (cambiaMuestra || !muestra) setMuestra(clave, modo);
    else colocarPila();
  }

  // Desplazamientos del despiece (por niveles, de abajo hacia arriba)
  // La pila sube en columna (niveles de 5 cm); el cuerpo de la cámara se aparta hacia la izquierda.
  mover(elevador, [0, 0.05, 0]);
  mover(fibraT, [0, 0.05, 0]);
  mover(eTierra, [0, 0.1, 0]);
  mover(bInf, [0, 0.15, 0]);
  mover(difusor, [0, 0.25, 0]);
  mover(bSup, [0, 0.3, 0]);
  mover(eAT, [0, 0.36, 0]);
  mover(tapa, [0, 0.44, 0]);
  mover(termopar, [0, 0.44, 0]);
  mover(bushing, [0, 0.52, 0]);
  mover(frontal, [-0.36, 0.35, 0.05]);
  mover(posterior, [-0.36, 0.35, -0.05]);
  piezasDespiece.push({ partId: 'jaula', obj: pIzq, etq: [0, 0.18, 0.12] });
  piezasDespiece.push({ partId: 'puerta', obj: pPuerta, etq: [0.12, 0.22, 0] });

  let estadoDespiece = 0;
  function aplicarDespiece(e) {
    estadoDespiece = e;
    const k = ease(Math.max(0, Math.min(1, e)));
    for (const m of moviles) m.obj.position.copy(m.home).addScaledVector(m.off, k);
    plasma.visible = e < 0.02;
    neblina.visible = e < 0.02;
  }

  let anguloPuerta = 0;
  function update(dt, est) {
    // Puerta (animada)
    const objetivo = est.puertaAbierta ? -1.75 : 0;
    anguloPuerta += (objetivo - anguloPuerta) * Math.min(1, dt * 5);
    puerta.rotation.y = anguloPuerta;

    // Baliza
    const at = est.altaTension;
    const parp = at ? 0.5 + 0.5 * Math.sin(performance.now() / 120) : 0;
    lente.material.emissive.setRGB(parp, parp * 0.6, 0);
    luzBaliza.intensity = parp * 0.6;

    // Plasma
    const P = est.P;
    const on = est.plasma && estadoDespiece < 0.02;
    const In = on ? Math.min(1, 0.25 + P / 350) : 0;
    uniforms.uTime.value += dt;
    uniforms.uI.value = In * (est.difusa ? 0.55 : 0.32);
    uniforms.uColor.value.setRGB(...est.color);
    uniforms.uDifusa.value = est.difusa ? 1 : 0;
    glow.visible = on;
    luzPlasma.intensity = on ? 1.5 + In * 4 : 0;
    luzPlasma.color.setRGB(...est.color);
    halo.material.opacity = on ? (0.35 + 0.4 * In) * (0.85 + 0.15 * Math.random()) : 0;
    halo.material.color.setRGB(...est.color);
    filamentos.material.color.setRGB(...est.color.map((c) => Math.min(1, c * 1.15 + 0.15)));
    const nVis = on ? Math.round(NF * (est.difusa ? 0.12 : Math.min(1, 0.2 + P / 400))) : 0;
    filamentos.count = nVis;
    if (nVis > 0) {
      const m4 = new THREE.Matrix4();
      const y0 = plasma.userData.y0;
      const gap = plasma.userData.gap;
      for (let i = 0; i < nVis; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.sqrt(Math.random()) * 0.046;
        const rr = 0.00025 + Math.random() * 0.0005;
        m4.makeScale(rr, gap, rr);
        m4.setPosition(Math.cos(a) * r, y0 + gap / 2, Math.sin(a) * r);
        filamentos.setMatrixAt(i, m4);
      }
      filamentos.instanceMatrix.needsUpdate = true;
    }

    // Neblina de especies de vida larga
    const op = Math.min(0.75, est.O3 / 1500) * (est.modo === 'abierto' ? 1 : 0.4);
    neblina.material.opacity = op;
    neblina.material.color.setRGB(...est.colorNeblina);
    if (op > 0.01) {
      const v = est.flujo ? 0.012 : 0.003;
      for (let i = 0; i < NH; i++) {
        hPos[i * 3] += (Math.random() - 0.5) * 0.002 + (0.06 - hPos[i * 3]) * 0.02 * dt * (est.flujo ? 1 : 0);
        hPos[i * 3 + 1] += v * dt * (0.5 + Math.random());
        hPos[i * 3 + 2] += (Math.random() - 0.5) * 0.002 + (-0.06 - hPos[i * 3 + 2]) * 0.02 * dt * (est.flujo ? 1 : 0);
        const rx = hPos[i * 3];
        const rz = hPos[i * 3 + 2];
        if (hPos[i * 3 + 1] > 0.19 || rx * rx + rz * rz > 0.085 * 0.085) {
          if (on) resetH(i);
          else {
            hPos[i * 3 + 1] = 0.03 + Math.random() * 0.16;
          }
        }
      }
      geoH.attributes.position.needsUpdate = true;
    }

    // Muestra
    muestra.setEstado(est.tipoCaso, est.progreso, est.valorRef);
  }

  function setCorte(activo) {
    planoCorte.constant = activo ? 0.0 : 1000;
  }

  // Puntos de conexión en coordenadas del mundo
  const mundo = (obj, x, y, z) => {
    raiz.updateMatrixWorld(true);
    return obj.localToWorld(new THREE.Vector3(x, y, z));
  };
  const anclas = {
    entradaGas: mundo(base, -0.14, 0.0125, 0),
    salidaGas: mundo(techo, 0.06, 0.02, -0.06),
    terminalAT: mundo(techo, 0, 0.02, 0),
    terminalTierra: mundo(base, 0.136, 0.0125, 0),
    ventanaOES: mundo(cam, 0, Y_TB - 0.004, -JAULA.d / 2 - 0.012),
    guiaIR: mundo(cam, -JAULA.w / 2 - 0.02, Y_TB - 0.004, -0.0475),
    ventanaIRmundo: mundo(cam, -0.0823, Y_TB - 0.004, -0.0475),
    centroDescarga: mundo(cam, 0, Y_TB - 0.003, 0),
    centro: new THREE.Vector3(0, MESA_Y + 0.23, 0),
  };

  return {
    raiz,
    piezasDespiece,
    setSeparacion,
    setDespiece: aplicarDespiece,
    setCorte,
    update,
    anclas,
    get muestra() {
      return muestra;
    },
  };
}
