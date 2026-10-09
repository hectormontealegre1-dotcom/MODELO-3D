// Posiciones de los equipos sobre el mesón (m). El reactor está en el origen (x = 0, z = 0).
import { MESA_Y } from './entorno.js';

export const L = {
  y: MESA_Y,
  cil: { z: -0.47, xs: [-1.85, -1.6, -1.35, -1.1] },
  panel: { x: -0.6, y: 1.27, z: -0.345 },
  mfc: { xs: [-0.73, -0.6, -0.47], y: 1.31, z: -0.312 },
  humid: { x: -0.43, z: -0.2 },
  hr: { x: -0.3, z: -0.13 },
  fuente: { x: 0.45, z: -0.04, w: 0.26, h: 0.16, d: 0.3 },
  osc: { x: 0.74, z: -0.17 },
  espectro: { x: 0.1, z: -0.29 },
  camIR: { x: -0.37, z: -0.0475 },
  o3: { x: 0.3, z: -0.275 },
  destructor: { x: 0.5, z: -0.29 },
  balanza: { x: -0.45, z: 0.2 },
  pc: { x: 0.56, z: 0.24 },
  paro: { x: 0.26, z: 0.3 },
  o3amb: { x: -0.12, y: 1.45, z: -0.345 },
};
