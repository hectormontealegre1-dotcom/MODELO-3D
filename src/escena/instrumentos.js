// Equipos eléctricos, instrumentos de proceso, seguridad y sus pantallas.
import * as THREE from 'three';
import { M, caja, cilindro, esfera, en, registrar, tubo, pantalla, rotulo } from './materiales.js';
import { L } from './layout.js';

const MONO = '"IBM Plex Mono", ui-monospace, monospace';
const num = (x, d = 1) => {
  const s = Math.abs(x).toFixed(d).split('.');
  s[0] = s[0].length > 3 ? s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : s[0];
  return (x < 0 ? '−' : '') + s.join(',');
};

export function crearInstrumentos(scene, anclas) {
  const g = new THREE.Group();
  g.name = 'instrumentos';
  scene.add(g);
  const conexiones = new THREE.Group();
  scene.add(conexiones);
  const y0 = L.y;
  const P = {}; // pantallas

  // ---------------- Fuente de alta tensión ----------------
  const F = L.fuente;
  const fuente = new THREE.Group();
  fuente.add(en(caja(F.w, F.h, F.d, M.grisOscuro), F.x, y0 + F.h / 2, F.z));
  fuente.add(en(caja(F.w + 0.004, 0.012, F.d + 0.004, M.negro), F.x, y0 + 0.006, F.z));
  const frente = F.z + F.d / 2 + 0.001;
  P.fuente = pantalla(0.11, 0.05, 352, 160);
  P.fuente.mesh.position.set(F.x - 0.04, y0 + 0.105, frente);
  fuente.add(P.fuente.mesh);
  for (let i = 0; i < 2; i++) {
    const p = cilindro(0.013, 0.014, M.negro, 24);
    p.rotation.x = Math.PI / 2;
    p.position.set(F.x + 0.045 + i * 0.045, y0 + 0.105, frente + 0.007);
    fuente.add(p);
  }
  const lampara = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.006, 16), new THREE.MeshStandardMaterial({ color: 0x5a0d0d, emissive: 0x000000 }));
  lampara.rotation.x = Math.PI / 2;
  lampara.position.set(F.x + 0.045, y0 + 0.045, frente + 0.003);
  const llave = en(caja(0.016, 0.022, 0.01, M.inox), F.x + 0.09, y0 + 0.045, frente + 0.005);
  fuente.add(lampara, llave);
  const etiquetaF = rotulo('ALTA TENSIÓN 0–30 kV · 5–20 kHz · 500 W', { w: 0.2, h: 0.018, fondo: '#2b3036', tinta: '#f2b705', fuente: 'bold 44px "Barlow Condensed", sans-serif' });
  etiquetaF.position.set(F.x, y0 + 0.145, frente);
  fuente.add(etiquetaF);
  // conector de salida AT en la cara izquierda
  const salidaAT = cilindro(0.016, 0.03, M.ptfe, 20);
  salidaAT.rotation.z = Math.PI / 2;
  salidaAT.position.set(F.x - F.w / 2 - 0.015, y0 + 0.12, F.z - 0.08);
  fuente.add(salidaAT);
  g.add(registrar(fuente, 'fuente'));

  // Cable de alta tensión hasta el pasamuros del techo de la jaula y conductor interior
  const tAT = anclas.terminalAT;
  const cableAT = tubo([
    [F.x - F.w / 2 - 0.03, y0 + 0.12, F.z - 0.08], [0.26, y0 + 0.2, -0.13], [0.24, 1.55, -0.08], [0.06, 1.52, 0], [tAT.x, tAT.y + 0.04, tAT.z], [tAT.x, tAT.y, tAT.z],
  ], 0.0055, M.cableAT, 80);
  conexiones.add(registrar(cableAT, 'cableAT'));
  const interior = cilindro(0.004, tAT.y - 0.02 - (y0 + 0.006 + 0.33), M.cableAT, 10);
  interior.position.set(0, (tAT.y - 0.02 + y0 + 0.006 + 0.33) / 2, 0);
  conexiones.add(registrar(interior, 'cableAT'));

  // Sonda AT 1000:1 apoyada sobre la fuente
  const sonda = new THREE.Group();
  const cuerpoS = cilindro(0.017, 0.24, M.gris, 24);
  cuerpoS.rotation.z = Math.PI / 2;
  sonda.add(cuerpoS);
  const puntaS = cilindro(0.006, 0.03, M.rojo, 12);
  puntaS.rotation.z = Math.PI / 2;
  puntaS.position.x = -0.135;
  sonda.add(puntaS);
  for (let i = 0; i < 5; i++) {
    const anillo = cilindro(0.021, 0.006, M.gris, 24);
    anillo.rotation.z = Math.PI / 2;
    anillo.position.x = -0.09 + i * 0.022;
    sonda.add(anillo);
  }
  sonda.position.set(F.x + 0.005, y0 + F.h + 0.021, F.z - 0.09);
  g.add(registrar(sonda, 'sondaAT'));
  conexiones.add(registrar(tubo([[F.x - 0.145, y0 + F.h + 0.021, F.z - 0.09], [F.x - F.w / 2 - 0.02, y0 + 0.15, F.z - 0.085], [F.x - F.w / 2 - 0.03, y0 + 0.125, F.z - 0.08]], 0.002, M.cableAT, 20), 'sondaAT'));

  // Rama de tierra: base → Rogowski → condensador de medida → fuente
  const tT = anclas.terminalTierra;
  const cableT = tubo([[tT.x, tT.y, tT.z], [0.2, y0 + 0.02, 0.03], [0.26, y0 + 0.024, 0.07], [0.31, y0 + 0.022, 0.1], [F.x - F.w / 2 + 0.02, y0 + 0.03, F.z + F.d / 2 + 0.01]], 0.0035, M.verdeTierra, 40);
  conexiones.add(registrar(cableT, 'electrodoTierra'));
  const rog = new THREE.Mesh(new THREE.TorusGeometry(0.016, 0.005, 10, 28), M.negro);
  rog.position.set(0.255, y0 + 0.024, 0.066);
  rog.rotation.y = Math.PI / 3;
  g.add(registrar(rog, 'rogowski'));
  const cm = en(caja(0.04, 0.025, 0.03, M.azulMFC), 0.31, y0 + 0.0125, 0.105);
  g.add(registrar(cm, 'capMedida'));

  // ---------------- Osciloscopio ----------------
  const O = L.osc;
  const osc = new THREE.Group();
  osc.add(en(caja(0.3, 0.16, 0.13, M.grisClaro), O.x, y0 + 0.08, O.z));
  P.osc = pantalla(0.15, 0.1, 480, 320);
  P.osc.mesh.position.set(O.x - 0.055, y0 + 0.085, O.z + 0.0655);
  osc.add(P.osc.mesh);
  for (let i = 0; i < 4; i++) {
    const bnc = cilindro(0.005, 0.01, M.inox, 12);
    bnc.rotation.x = Math.PI / 2;
    bnc.position.set(O.x + 0.04 + i * 0.022, y0 + 0.025, O.z + 0.068);
    osc.add(bnc);
    const pk = cilindro(0.006, 0.006, M.negro, 12);
    pk.rotation.x = Math.PI / 2;
    pk.position.set(O.x + 0.04 + (i % 2) * 0.04, y0 + 0.07 + Math.floor(i / 2) * 0.035, O.z + 0.068);
    osc.add(pk);
  }
  g.add(registrar(osc, 'osciloscopio'));
  const entradaOsc = (i) => [O.x + 0.04 + i * 0.022, y0 + 0.025, O.z + 0.075];
  conexiones.add(registrar(tubo([[F.x + 0.125, y0 + F.h + 0.021, F.z - 0.09], [F.x + 0.17, y0 + 0.17, F.z - 0.09], [O.x + 0.04, y0 + 0.05, O.z + 0.1], entradaOsc(0)], 0.0022, M.cableBNC, 30), 'sondaAT'));
  conexiones.add(registrar(tubo([[0.255, y0 + 0.03, 0.066], [0.34, y0 + 0.012, 0.15], [O.x, y0 + 0.012, 0.03], entradaOsc(1)], 0.0022, M.cableBNC, 30), 'rogowski'));
  conexiones.add(registrar(tubo([[0.33, y0 + 0.02, 0.105], [0.42, y0 + 0.01, 0.13], [O.x + 0.05, y0 + 0.01, 0.02], entradaOsc(2)], 0.0022, M.cableBNC, 30), 'capMedida'));

  // ---------------- Espectrómetro OES ----------------
  const E = L.espectro;
  const esp = new THREE.Group();
  esp.add(en(caja(0.1, 0.045, 0.07, M.negro), E.x, y0 + 0.0225, E.z));
  const rotE = rotulo('AI-501 · OES 200–900 nm', { w: 0.08, h: 0.012, fondo: '#23272c', tinta: '#e8ecf0', fuente: 'bold 40px "IBM Plex Mono", monospace' });
  rotE.position.set(E.x, y0 + 0.03, E.z + 0.0355);
  esp.add(rotE);
  g.add(registrar(esp, 'espectrometro'));
  const vO = anclas.ventanaOES;
  conexiones.add(registrar(tubo([[vO.x, vO.y, vO.z], [vO.x + 0.01, vO.y - 0.02, vO.z - 0.03], [E.x - 0.08, y0 + 0.04, E.z], [E.x - 0.05, y0 + 0.0225, E.z]], 0.0022, M.fibra, 30), 'espectrometro'));

  // ---------------- Cámara termográfica ----------------
  const C = L.camIR;
  const camIR = new THREE.Group();
  const yCam = anclas.guiaIR.y;
  camIR.add(en(caja(0.07, 0.05, 0.05, M.grisOscuro), C.x, yCam, C.z));
  const lenteIR = cilindro(0.018, 0.03, M.negro, 20);
  lenteIR.rotation.z = Math.PI / 2;
  lenteIR.position.set(C.x + 0.05, yCam, C.z);
  camIR.add(lenteIR);
  P.ir = pantalla(0.045, 0.034, 160, 120);
  P.ir.mesh.position.set(C.x - 0.0355, yCam, C.z);
  P.ir.mesh.rotation.y = -Math.PI / 2;
  camIR.add(P.ir.mesh);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2;
    const pata = cilindro(0.003, yCam - y0 - 0.02, M.negro, 6);
    pata.position.set(C.x + Math.cos(a) * 0.03, (yCam + y0) / 2 - 0.01, C.z + Math.sin(a) * 0.03);
    pata.rotation.z = Math.cos(a) * 0.25;
    pata.rotation.x = -Math.sin(a) * 0.25;
    camIR.add(pata);
  }
  g.add(registrar(camIR, 'camaraIR'));

  // ---------------- Monitor de O₃ y destructor ----------------
  const O3 = L.o3;
  const mon = new THREE.Group();
  mon.add(en(caja(0.16, 0.12, 0.12, M.blanco), O3.x, y0 + 0.06, O3.z));
  P.o3 = pantalla(0.08, 0.035, 256, 112);
  P.o3.mesh.position.set(O3.x, y0 + 0.08, O3.z + 0.0605);
  mon.add(P.o3.mesh);
  const rotO3 = rotulo('AI-502 · O₃ (UV 254 nm)', { w: 0.1, h: 0.014, fondo: '#eef0f2', tinta: '#2b3036', fuente: 'bold 44px "IBM Plex Mono", monospace' });
  rotO3.position.set(O3.x, y0 + 0.035, O3.z + 0.0605);
  mon.add(rotO3);
  g.add(registrar(mon, 'monitorO3'));

  const D = L.destructor;
  const des = new THREE.Group();
  des.add(en(cilindro(0.035, 0.2, M.negro, 24), D.x, y0 + 0.1, D.z));
  des.add(en(cilindro(0.037, 0.02, M.inox, 24), D.x, y0 + 0.01, D.z));
  des.add(en(cilindro(0.037, 0.02, M.inox, 24), D.x, y0 + 0.19, D.z));
  const rotD = rotulo('MnO₂', { w: 0.05, h: 0.02, fondo: '#1c1e21', tinta: '#e8ecf0' });
  rotD.position.set(D.x, y0 + 0.1, D.z + 0.0355);
  des.add(rotD);
  g.add(registrar(des, 'destructor'));

  // Brazo de extracción localizada
  const ext = new THREE.Group();
  const duct = (a, b, r) => {
    const va = new THREE.Vector3(...a);
    const vb = new THREE.Vector3(...b);
    const largo = va.distanceTo(vb);
    const c = cilindro(r, largo, M.grisClaro, 20);
    c.position.copy(va).add(vb).multiplyScalar(0.5);
    c.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vb.clone().sub(va).normalize());
    return c;
  };
  ext.add(en(caja(0.12, 0.12, 0.04, M.grisClaro), D.x, 2.05, -0.6));
  ext.add(duct([D.x, 2.05, -0.58], [D.x, 1.78, -0.36], 0.036));
  ext.add(en(esfera(0.045, M.gris), D.x, 1.78, -0.36));
  ext.add(duct([D.x, 1.78, -0.36], [D.x, 1.42, -0.3], 0.036));
  ext.add(en(esfera(0.045, M.gris), D.x, 1.42, -0.3));
  const campana = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.085, 0.09, 24, 1, true), new THREE.MeshStandardMaterial({ color: 0xc6ccd2, side: THREE.DoubleSide, roughness: 0.5 }));
  campana.position.set(D.x, 1.355, D.z);
  ext.add(campana);
  g.add(registrar(ext, 'extraccion'));

  // Sensor de O₃ ambiental en el puesto del operador
  const amb = new THREE.Group();
  amb.add(en(caja(0.07, 0.09, 0.03, M.blanco), L.o3amb.x, L.o3amb.y, L.o3amb.z + 0.015));
  P.o3amb = pantalla(0.05, 0.025, 200, 100);
  P.o3amb.mesh.position.set(L.o3amb.x, L.o3amb.y + 0.012, L.o3amb.z + 0.031);
  amb.add(P.o3amb.mesh);
  const ledAmb = new THREE.Mesh(new THREE.CircleGeometry(0.005, 16), new THREE.MeshStandardMaterial({ color: 0x2a2a2a, emissive: 0x000000 }));
  ledAmb.position.set(L.o3amb.x, L.o3amb.y - 0.025, L.o3amb.z + 0.031);
  amb.add(ledAmb);
  g.add(registrar(amb, 'sensorO3amb'));

  // ---------------- Balanza ----------------
  const B = L.balanza;
  const bal = new THREE.Group();
  bal.add(en(caja(0.2, 0.06, 0.26, M.blanco), B.x, y0 + 0.03, B.z));
  bal.add(en(cilindro(0.07, 0.006, M.inox, 32), B.x, y0 + 0.065, B.z - 0.03));
  P.balanza = pantalla(0.07, 0.025, 224, 80);
  P.balanza.mesh.position.set(B.x, y0 + 0.035, B.z + 0.1305);
  bal.add(P.balanza.mesh);
  const placaBal = cilindro(0.045, 0.012, M.vidrio, 32);
  placaBal.position.set(B.x, y0 + 0.074, B.z - 0.03);
  bal.add(placaBal);
  g.add(registrar(bal, 'balanza'));

  // ---------------- Computador de adquisición ----------------
  const C2 = L.pc;
  const pc = new THREE.Group();
  const base = en(caja(0.32, 0.015, 0.22, M.grisOscuro), 0, 0.0075, 0);
  const tapa = new THREE.Group();
  tapa.add(en(caja(0.32, 0.2, 0.008, M.grisOscuro), 0, 0.1, 0));
  P.pc = pantalla(0.3, 0.185, 640, 395);
  P.pc.mesh.position.set(0, 0.1, 0.0045);
  tapa.add(P.pc.mesh);
  tapa.position.set(0, 0.015, -0.105);
  tapa.rotation.x = -0.28;
  pc.add(base, tapa);
  pc.position.set(C2.x, y0, C2.z);
  pc.rotation.y = -0.35;
  g.add(registrar(pc, 'pc'));

  // ---------------- Paro de emergencia ----------------
  const S = L.paro;
  const paro = new THREE.Group();
  paro.add(en(caja(0.08, 0.06, 0.08, M.amarilloSeg), S.x, y0 + 0.03, S.z));
  const seta = en(cilindro(0.026, 0.018, M.rojo, 24), S.x, y0 + 0.07, S.z);
  paro.add(seta);
  paro.add(en(cilindro(0.012, 0.012, M.rojo, 16), S.x, y0 + 0.062, S.z));
  g.add(registrar(paro, 'paro'));

  // ---------------- Dibujo de pantallas ----------------
  const fondoLCD = '#0f1a14';
  function texto(ctx, t, x, y, tam, color = '#c8ffd8', alinear = 'left', peso = '500') {
    ctx.font = `${peso} ${tam}px ${MONO}`;
    ctx.fillStyle = color;
    ctx.textAlign = alinear;
    ctx.textBaseline = 'middle';
    ctx.fillText(t, x, y);
  }

  function dibujar(est) {
    // Fuente
    {
      const { ctx, canvas, tex } = P.fuente;
      ctx.fillStyle = '#0c1210';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      texto(ctx, `${num(est.Vact, 1)} kV`, 16, 44, 52, est.altaTension ? '#ffd166' : '#6f7b74', 'left', '600');
      texto(ctx, `${num(est.f, 0)} kHz`, 16, 112, 30, '#9fd8b4');
      texto(ctx, `${num(est.P, 0)} W`, 336, 112, 30, '#9fd8b4', 'right');
      texto(ctx, est.altaTension ? 'AT' : '—', 336, 44, 30, est.altaTension ? '#ff5d6c' : '#6f7b74', 'right', '600');
      tex.needsUpdate = true;
      lampara.material.emissive.setHex(est.altaTension ? 0xff2222 : 0x000000);
    }
    // Osciloscopio
    {
      const { ctx, canvas, tex } = P.osc;
      const W = canvas.width;
      const H = canvas.height;
      ctx.fillStyle = '#061016';
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(120,160,170,0.25)';
      ctx.lineWidth = 1;
      for (let i = 1; i < 10; i++) {
        ctx.beginPath();
        ctx.moveTo((W * i) / 10, 0);
        ctx.lineTo((W * i) / 10, H);
        ctx.stroke();
      }
      for (let i = 1; i < 8; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (H * i) / 8);
        ctx.lineTo(W, (H * i) / 8);
        ctx.stroke();
      }
      const wf = est.onda;
      if (wf && wf.V.length) {
        const traza = (arr, escala, y0c, color) => {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          arr.forEach((v, i) => {
            const x = (i / (arr.length - 1)) * W;
            const y = y0c - v * escala;
            i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
          });
          ctx.stroke();
        };
        traza(wf.V, (H * 0.18) / 30, H * 0.3, '#f5d547');
        const Imax = Math.max(50, ...wf.I.map(Math.abs));
        traza(wf.I, (H * 0.2) / Imax, H * 0.72, '#4fd6f0');
      }
      texto(ctx, 'CH1 V', 8, 16, 16, '#f5d547');
      texto(ctx, 'CH2 I', 8, H * 0.5 + 10, 16, '#4fd6f0');
      texto(ctx, `${num(est.f, 0)} kHz`, W - 8, 16, 16, '#9fb7c0', 'right');
      tex.needsUpdate = true;
    }
    // Cámara IR (falso color de la superficie de la muestra)
    {
      const { ctx, canvas, tex } = P.ir;
      const W = canvas.width;
      const H = canvas.height;
      const t = Math.max(0, Math.min(1, (est.Tsus - 20) / 40));
      const fondo = ctx.createLinearGradient(0, 0, W, 0);
      fondo.addColorStop(0, '#1b1446');
      fondo.addColorStop(1, '#2a1a5e');
      ctx.fillStyle = fondo;
      ctx.fillRect(0, 0, W, H);
      const gr = ctx.createRadialGradient(W / 2, H / 2, 4, W / 2, H / 2, 46);
      const c1 = `hsl(${240 - 200 * t}, 90%, ${45 + 15 * t}%)`;
      gr.addColorStop(0, c1);
      gr.addColorStop(1, `hsl(${250 - 120 * t}, 80%, 30%)`);
      ctx.fillStyle = gr;
      ctx.beginPath();
      ctx.ellipse(W / 2, H / 2, 54, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      texto(ctx, `${num(est.Tsus, 1)} °C`, W - 6, 14, 15, '#ffffff', 'right', '600');
      tex.needsUpdate = true;
    }
    // Monitor de O₃
    {
      const { ctx, canvas, tex } = P.o3;
      ctx.fillStyle = fondoLCD;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      texto(ctx, 'O₃', 12, 30, 22, '#9fd8b4');
      texto(ctx, `${num(est.O3, 0)}`, 200, 62, 44, '#c8ffd8', 'right', '600');
      texto(ctx, 'ppm', 246, 70, 20, '#9fd8b4', 'right');
      tex.needsUpdate = true;
    }
    // O₃ ambiental
    {
      const { ctx, canvas, tex } = P.o3amb;
      const alarma = est.O3amb > 0.1;
      ctx.fillStyle = alarma ? '#3a0b10' : fondoLCD;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      texto(ctx, `${num(est.O3amb, 2)} ppm`, 100, 50, 30, alarma ? '#ff8a94' : '#c8ffd8', 'center', '600');
      tex.needsUpdate = true;
      ledAmb.material.emissive.setHex(alarma ? (Math.sin(performance.now() / 150) > 0 ? 0xff2020 : 0x300000) : 0x00c853);
    }
    // Balanza
    {
      const { ctx, canvas, tex } = P.balanza;
      ctx.fillStyle = fondoLCD;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      texto(ctx, `${num(est.masa, 2)} g`, 212, 42, 40, '#c8ffd8', 'right', '600');
      tex.needsUpdate = true;
    }
    // Computador: resumen del lote
    {
      const { ctx, canvas, tex } = P.pc;
      const W = canvas.width;
      const H = canvas.height;
      ctx.fillStyle = '#10161d';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#1a232d';
      ctx.fillRect(0, 0, W, 44);
      texto(ctx, 'Banco DBD · registro del lote', 16, 22, 20, '#e8edf3', 'left', '600');
      texto(ctx, est.faseNombre.toUpperCase(), W - 16, 22, 18, est.altaTension ? '#ffc23d' : '#9a86ff', 'right', '600');
      const filas = [
        ['Tensión', `${num(est.Vact, 1)} kV`],
        ['Potencia', `${num(est.P, 0)} W`],
        ['Energía', `${num(est.E / 1000, 2)} kJ`],
        ['E/m', `${num(est.E / 1000 / (est.masa / 1000), 0)} kJ/kg`],
        ['T gas', `${num(est.Tgas, 1)} °C`],
        ['O₃', `${num(est.O3, 0)} ppm`],
        ['Exposición', `${num(est.tTrat, 0)} s`],
      ];
      filas.forEach(([a, b], i) => {
        texto(ctx, a, 20, 72 + i * 40, 20, '#8e9aab');
        texto(ctx, b, 300, 72 + i * 40, 22, '#e8edf3', 'right', '600');
      });
      // mini tendencia de potencia
      const hist = est.historial;
      ctx.strokeStyle = '#2a3441';
      ctx.strokeRect(330, 60, 290, 300);
      if (hist.length > 1) {
        const t0 = hist[0].t;
        const t1 = hist[hist.length - 1].t || 1;
        ctx.strokeStyle = '#9a86ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        hist.forEach((h, i) => {
          const x = 330 + ((h.t - t0) / Math.max(1, t1 - t0)) * 290;
          const y = 360 - (h.Tgas - 20) * 6;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        });
        ctx.stroke();
      }
      texto(ctx, 'T gas', 340, 76, 16, '#8e9aab');
      tex.needsUpdate = true;
    }
  }

  function update(dt, est) {
    seta.position.y = y0 + (est.paro ? 0.064 : 0.07);
  }

  return { grupo: g, conexiones, dibujar, update };
}
