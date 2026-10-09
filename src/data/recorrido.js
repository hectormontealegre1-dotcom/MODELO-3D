// Recorrido guiado de 10 pasos (provisional; el texto definitivo se integra tras el diseño).
export const EXPERIMENTO = {
  titulo: 'Plasma frío sobre una manzana',
  pregunta: '¿Puede una descarga de barrera dieléctrica a presión atmosférica inactivar E. coli sobre manzana sin calentar la muestra?',
  hipotesis: 'Con la DBD en aire, la población de E. coli disminuye con el tiempo de exposición hasta el orden de 5 ciclos logarítmicos informado por Kilonzo-Nthenge et al. (2018), mientras el gas permanece entre 30 y 60 °C.',
  variableIndependiente: 'Tiempo de exposición al plasma (0 a 240 s)',
  variablesDependientes: ['Reducción logarítmica R = log₁₀(N₀/N)', 'Temperatura de la superficie (TI-302)', 'Energía específica (kJ/kg)'],
  variablesControladas: ['Gas de trabajo y humedad', 'Separación d, tensión y frecuencia', 'Masa de la muestra'],
};

export const PASOS = [
  { id: 'pregunta', titulo: 'La pregunta', fase: 'Pregunta', duracionSeg: 50, acciones: { vista: 'general', caso: 'kilonzo_ecoli', proceso: 'reposo', tarjeta: { titulo: 'Pregunta experimental', lineas: ['Pregunta: ' + 'placeholder'] } }, textoPantalla: 'Texto provisional.' },
  { id: 'fundamento', titulo: 'Fundamento', fase: 'Hipótesis', duracionSeg: 60, acciones: { vista: 'descarga', caso: 'kilonzo_ecoli', proceso: 'tratamiento', avance: 0.1, lupa: true }, textoPantalla: 'Texto provisional.' },
  { id: 'montaje', titulo: 'Montaje', fase: 'Montaje', duracionSeg: 60, acciones: { vista: 'general', caso: 'kilonzo_ecoli', proceso: 'reposo' }, textoPantalla: 'Texto provisional.' },
  { id: 'celda', titulo: 'Celda', fase: 'Montaje', duracionSeg: 60, acciones: { vista: 'despiece', despiece: 1, caso: 'kilonzo_ecoli', resaltar: 'barreraSup' }, textoPantalla: 'Texto provisional.' },
  { id: 'gases', titulo: 'Gases', fase: 'Procedimiento', duracionSeg: 50, acciones: { vista: 'gases', caso: 'kilonzo_ecoli', proceso: 'purga' }, textoPantalla: 'Texto provisional.' },
  { id: 'descarga', titulo: 'Descarga', fase: 'Procedimiento', duracionSeg: 60, acciones: { vista: 'reactor', caso: 'kilonzo_ecoli', proceso: 'tratamiento', avance: 0.2, panel: 'instrumentos', tab: 'electrico' }, textoPantalla: 'Texto provisional.' },
  { id: 'medicion', titulo: 'Medición', fase: 'Medición', duracionSeg: 60, acciones: { vista: 'instrumentos', caso: 'kilonzo_ecoli', proceso: 'tratamiento', avance: 0.4, panel: 'instrumentos', tab: 'plasma' }, textoPantalla: 'Texto provisional.' },
  { id: 'resultado', titulo: 'Resultado', fase: 'Resultado', duracionSeg: 60, acciones: { vista: 'descarga', caso: 'kilonzo_ecoli', proceso: 'final', panel: 'instrumentos', tab: 'resultado', lupa: true }, textoPantalla: 'Texto provisional.' },
  { id: 'seguridad', titulo: 'Seguridad', fase: 'Análisis', duracionSeg: 50, acciones: { vista: 'reactor', caso: 'kilonzo_ecoli', proceso: 'tratamiento', avance: 0.5, puerta: 'abrir' }, textoPantalla: 'Texto provisional.' },
  { id: 'cierre', titulo: 'Conclusión', fase: 'Conclusión', duracionSeg: 50, acciones: { vista: 'general', caso: 'durek_ota_co2', proceso: 'final', panel: 'instrumentos', tab: 'resultado' }, textoPantalla: 'Texto provisional.' },
];
