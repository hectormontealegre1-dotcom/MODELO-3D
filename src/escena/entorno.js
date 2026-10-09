// Sala de laboratorio, mesón y luces.
import * as THREE from 'three';
import { M, caja, cilindro, en, registrar } from './materiales.js';

export const MESA_Y = 0.9;

export function crearEntorno(scene) {
  const g = new THREE.Group();
  g.name = 'entorno';

  // Piso y muros
  const piso = new THREE.Mesh(new THREE.PlaneGeometry(9, 7), M.piso);
  piso.material.map.repeat.set(6, 5);
  piso.rotation.x = -Math.PI / 2;
  piso.position.set(-0.3, 0, 0.8);
  piso.receiveShadow = true;
  g.add(piso);

  const muroFondo = new THREE.Mesh(new THREE.PlaneGeometry(9, 3.2), M.muro);
  muroFondo.position.set(-0.3, 1.6, -0.62);
  muroFondo.receiveShadow = true;
  g.add(muroFondo);
  const muroIzq = new THREE.Mesh(new THREE.PlaneGeometry(7, 3.2), M.muro);
  muroIzq.rotation.y = Math.PI / 2;
  muroIzq.position.set(-2.4, 1.6, 2.8);
  muroIzq.receiveShadow = true;
  g.add(muroIzq);
  g.add(en(caja(9, 0.1, 0.02, M.zocalo), -0.3, 0.05, -0.61));

  // Mesón: cubierta de resina epóxica, estructura metálica y repisa posterior
  const mesa = new THREE.Group();
  mesa.add(en(caja(1.8, 0.03, 0.75, M.epoxica), 0, MESA_Y - 0.015, 0));
  for (const x of [-0.86, 0.86]) for (const z of [-0.33, 0.33]) mesa.add(en(caja(0.04, MESA_Y - 0.03, 0.04, M.grisClaro), x, (MESA_Y - 0.03) / 2, z));
  mesa.add(en(caja(1.72, 0.04, 0.04, M.grisClaro), 0, 0.14, -0.33));
  mesa.add(en(caja(1.72, 0.04, 0.04, M.grisClaro), 0, 0.14, 0.33));
  // gabinetes bajo la mesa
  const gab = en(caja(0.55, 0.62, 0.62, M.melamina), -0.55, 0.36, -0.02);
  mesa.add(gab);
  mesa.add(en(caja(0.004, 0.5, 0.004, M.acero), -0.55, 0.38, 0.295));
  // panel vertical posterior y repisa
  mesa.add(en(caja(1.8, 0.8, 0.02, M.melamina), 0, MESA_Y + 0.4, -0.36));
  mesa.add(en(caja(1.8, 0.02, 0.22, M.melamina), 0, MESA_Y + 0.66, -0.26));
  // frascos y cuaderno sobre la repisa (contexto)
  const colores = [0x8fb8c9, 0xd9d2b8, 0x9fb59a, 0xc9a28f];
  for (let i = 0; i < 6; i++) {
    const fr = cilindro(0.028, 0.11, M.vidrio, 16);
    fr.position.set(0.25 + i * 0.075, MESA_Y + 0.725, -0.27);
    mesa.add(fr);
    const tapa = cilindro(0.029, 0.02, new THREE.MeshStandardMaterial({ color: colores[i % 4], roughness: 0.6 }), 16);
    tapa.position.set(0.25 + i * 0.075, MESA_Y + 0.79, -0.27);
    mesa.add(tapa);
  }
  // tomacorrientes
  for (const x of [-0.2, 0.62]) mesa.add(en(caja(0.08, 0.05, 0.012, M.blanco), x, MESA_Y + 0.1, -0.345));
  registrar(mesa, 'mesa');
  g.add(mesa);

  // Taburete
  const tab = new THREE.Group();
  tab.add(en(cilindro(0.17, 0.05, M.negro, 24), 0, 0.62, 0));
  tab.add(en(cilindro(0.025, 0.55, M.acero, 12), 0, 0.33, 0));
  tab.add(en(cilindro(0.22, 0.03, M.acero, 5), 0, 0.03, 0));
  tab.position.set(0.15, 0, 0.9);
  g.add(tab);

  // Lámparas de techo (paneles)
  for (const x of [-1.2, 0.6]) {
    const l = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 0.3), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    l.position.set(x, 3.1, 0.4);
    g.add(l);
  }
  scene.add(g);
  return g;
}

export function crearLuces(scene) {
  const hemi = new THREE.HemisphereLight(0xeef3ff, 0x5b5f66, 0.55);
  scene.add(hemi);
  const sol = new THREE.DirectionalLight(0xffffff, 1.6);
  sol.position.set(1.8, 3.6, 2.4);
  sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048);
  sol.shadow.camera.left = -2.4;
  sol.shadow.camera.right = 1.6;
  sol.shadow.camera.top = 2;
  sol.shadow.camera.bottom = -1.2;
  sol.shadow.camera.near = 0.5;
  sol.shadow.camera.far = 9;
  sol.shadow.bias = -0.0004;
  sol.shadow.normalBias = 0.02;
  sol.target.position.set(-0.3, 0.9, 0);
  scene.add(sol);
  scene.add(sol.target);
  const relleno = new THREE.DirectionalLight(0xdfe8ff, 0.45);
  relleno.position.set(-2, 2.2, 1.5);
  scene.add(relleno);
  return { hemi, sol, relleno };
}
