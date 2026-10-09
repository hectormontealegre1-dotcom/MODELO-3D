// Especificación del banco DBD, lista de partes, instrumentos y supuestos.
// `respaldo: 'revision'` = dato o requisito tomado del informe; `'ingenieria'` = decisión de diseño propia.

export const BANCO = {
  electrodoDiam: 0.1, // m
  barreraDiam: 0.13, // m
  barreraEsp: 0.002, // m, cada barrera
  barreraEr: 3.8, // sílice fundida
  dMin: 1, // mm
  dMax: 20, // mm
  vMax: 30, // kV pico
  pMax: 500, // W
  fMin: 5, // kHz
  fMax: 20, // kHz
  qMin: 0.5, // L/min
  qMax: 5, // L/min
  volCamara: 3.6, // L útiles
  volEnvase: 0.15, // L
};

export const ESPECIFICACIONES = [
  {
    parametro: 'Configuración',
    valor: 'Descarga de barrera dieléctrica (DBD) plano-paralela, a presión atmosférica, por lotes; tratamiento abierto o dentro del envase',
    respaldo: 'revision',
    ref: ['okyere2022', 'feizollahi2021', 'guo2015', 'puente2024'],
    nota: 'Sin equipo de vacío ni magnetrón: las dos partidas de mayor costo que la revisión asocia a los sistemas a baja presión y de microondas.',
  },
  {
    parametro: 'Tensión de la fuente',
    valor: '0 a 30 kV pico, corriente alterna',
    respaldo: 'revision',
    ref: ['okyere2022', 'yadav2020', 'zheng2022'],
    nota: 'Cubre el encendido de la DBD (del orden de 10 kV), el tratamiento en envase hasta 30 kV y el límite inferior de 30 kV del estudio de zearalenona.',
  },
  {
    parametro: 'Potencia de la fuente',
    valor: 'Hasta 500 W',
    respaldo: 'revision',
    ref: ['kilonzo2018', 'casas2019', 'song2023'],
    nota: 'Incluye 30 W (café), 180 W (PVC) y 200 W (manzanas). Excluye 800 a 1 150 W (chorro de esporas y avellanas).',
  },
  {
    parametro: 'Frecuencia',
    valor: '5 a 20 kHz',
    respaldo: 'ingenieria',
    ref: [],
    nota: 'La revisión no informa la frecuencia de las DBD; el chorro de Niemira et al. (2018) operó entre 23 y 48 kHz.',
  },
  {
    parametro: 'Electrodos',
    valor: 'Aluminio, Ø 100 mm × 10 mm (área 78,5 cm²)',
    respaldo: 'ingenieria',
    ref: [],
    nota: 'Área pequeña para mantener la potencia dentro de 500 W; admite una placa Petri de 90 mm.',
  },
  {
    parametro: 'Barreras dieléctricas',
    valor: 'Vidrio de sílice, Ø 130 mm × 2 mm, una sobre cada electrodo (εr ≈ 3,8)',
    respaldo: 'revision',
    ref: ['okyere2022', 'feizollahi2021'],
    nota: 'Material de la lista de la revisión (sílice, cerámica, mica, esmalte o polímero). El borde sobresale 15 mm para evitar arcos por la orilla.',
  },
  {
    parametro: 'Separación barrera–muestra (d)',
    valor: '1 a 20 mm, con plataforma micrométrica',
    respaldo: 'revision',
    ref: ['niemira2018', 'puente2024'],
    nota: 'La distancia al electrodo modifica la mezcla de especies y la eficacia; por eso se mide y se fija.',
  },
  {
    parametro: 'Gases de trabajo',
    valor: 'Aire, N₂, O₂, CO₂, Ar, He y sus mezclas (3 controladores de caudal másico)',
    respaldo: 'revision',
    ref: ['okyere2022', 'dharini2023'],
    nota: 'El gas determina las especies reactivas. Las mezclas con 0,1 a 1 % de O₂ requieren un controlador de bajo rango o un cilindro premezclado.',
  },
  {
    parametro: 'Humedad del gas',
    valor: '0 a 90 % HR, con burbujeador y derivación',
    respaldo: 'revision',
    ref: ['puente2024'],
    nota: 'La humedad modifica la mezcla de especies; el radical OH• proviene de la disociación del agua.',
  },
  {
    parametro: 'Cámara',
    valor: 'Policarbonato, Ø 180 mm interior × 170 mm (≈ 3,6 L útiles); tapa y base de PTFE',
    respaldo: 'ingenieria',
    ref: [],
    nota: 'El policarbonato permite observar la descarga y bloquea la mayor parte de la radiación UV; el PTFE resiste el ozono.',
  },
  {
    parametro: 'Temperatura del gas esperada',
    valor: '30 a 60 °C',
    respaldo: 'revision',
    ref: ['jiang2022'],
    nota: 'Intervalo informado para equipos de plasma frío aplicados a alimentos.',
  },
  {
    parametro: 'Huella',
    valor: 'Mesón de 1,8 × 0,75 m; celda de 0,42 × 0,42 × 0,46 m',
    respaldo: 'ingenieria',
    ref: [],
    nota: 'Escala de banco: una sola persona lo opera en un laboratorio docente.',
  },
];

// Partes del reactor (numeradas para el despiece) y del resto de la planta.
export const PARTES = {
  // --- Celda del reactor ---
  bushing: {
    corto: 'Pasamuros AT',
    n: 1, grupo: 'Reactor', nombre: 'Pasamuros de alta tensión',
    material: 'PTFE con varilla de latón', funcion: 'Lleva la alta tensión a través de la tapa sin descargas a tierra.',
    respaldo: 'ingenieria', ref: [],
  },
  tapa: {
    corto: 'Tapa',
    n: 2, grupo: 'Reactor', nombre: 'Tapa superior con puerto de salida',
    material: 'PTFE, junta tórica de FKM', funcion: 'Cierra la cámara y aloja la salida de gas hacia el monitor de ozono.',
    respaldo: 'ingenieria', ref: [],
  },
  electrodoAT: {
    corto: 'Electrodo AT',
    n: 3, grupo: 'Reactor', nombre: 'Electrodo de alta tensión',
    material: 'Aluminio, Ø 100 × 10 mm', funcion: 'Electrodo conectado a la fuente de corriente alterna.',
    respaldo: 'revision', ref: ['puente2024'],
  },
  barreraSup: {
    corto: 'Barrera superior',
    n: 4, grupo: 'Reactor', nombre: 'Barrera dieléctrica superior',
    material: 'Vidrio de sílice, Ø 130 × 2 mm', funcion: 'Limita la corriente y evita la formación de arcos.',
    respaldo: 'revision', ref: ['okyere2022', 'feizollahi2021'],
  },
  difusor: {
    corto: 'Difusor de gas',
    n: 5, grupo: 'Reactor', nombre: 'Difusor anular de gas',
    material: 'Tubo de PFA perforado', funcion: 'Reparte el gas de trabajo alrededor de la zona de descarga.',
    respaldo: 'ingenieria', ref: [],
  },
  muestra: {
    corto: 'Muestra',
    n: 6, grupo: 'Reactor', nombre: 'Muestra en placa de vidrio o en envase',
    material: 'Placa Petri de 90 mm o envase polimérico sellado', funcion: 'Sustrato tratado; en modo envase, el envase actúa como barrera adicional.',
    respaldo: 'revision', ref: ['yadav2020', 'okyere2022'],
  },
  barreraInf: {
    corto: 'Barrera inferior',
    n: 7, grupo: 'Reactor', nombre: 'Barrera dieléctrica inferior',
    material: 'Vidrio de sílice, Ø 130 × 2 mm', funcion: 'Segunda barrera; aísla la muestra del electrodo de tierra.',
    respaldo: 'revision', ref: ['okyere2022'],
  },
  electrodoTierra: {
    corto: 'Electrodo de tierra',
    n: 8, grupo: 'Reactor', nombre: 'Electrodo de tierra',
    material: 'Aluminio, Ø 100 × 10 mm', funcion: 'Electrodo conectado a tierra a través de la bobina de Rogowski y el condensador de medida.',
    respaldo: 'revision', ref: ['puente2024'],
  },
  elevador: {
    corto: 'Elevador micrométrico',
    n: 9, grupo: 'Reactor', nombre: 'Plataforma elevadora micrométrica',
    material: 'PTFE y husillo de nailon, cabezal de 0,01 mm', funcion: 'Fija la separación d entre la barrera y la muestra, de 1 a 20 mm (ZI-701).',
    respaldo: 'revision', ref: ['niemira2018'],
  },
  base: {
    corto: 'Base con puertos',
    n: 10, grupo: 'Reactor', nombre: 'Base con puertos',
    material: 'PTFE', funcion: 'Soporta la pila de electrodos; aloja la entrada de gas, el termopar y la conexión de tierra.',
    respaldo: 'ingenieria', ref: [],
  },
  camara: {
    corto: 'Cuerpo de la cámara',
    n: 11, grupo: 'Reactor', nombre: 'Cuerpo de la cámara',
    material: 'Policarbonato, Ø 180 × 170 mm', funcion: 'Contiene la atmósfera de trabajo y permite observar la descarga.',
    respaldo: 'revision', ref: ['puente2024'],
  },
  ventanaOES: {
    corto: 'Ventana OES',
    n: 12, grupo: 'Reactor', nombre: 'Ventana de cuarzo para OES',
    material: 'Cuarzo, Ø 25 mm', funcion: 'Deja pasar la emisión UV y visible hacia la fibra del espectrómetro.',
    respaldo: 'revision', ref: ['burducea2023', 'hueso2009'],
  },
  ventanaIR: {
    corto: 'Ventana IR',
    n: 13, grupo: 'Reactor', nombre: 'Ventana infrarroja',
    material: 'Seleniuro de cinc, Ø 25 mm', funcion: 'Permite la termografía de la superficie de la muestra durante el tratamiento.',
    respaldo: 'revision', ref: ['lacombe2017', 'niemira2018'],
  },
  jaula: {
    corto: 'Jaula de Faraday',
    n: 14, grupo: 'Reactor', nombre: 'Jaula de Faraday',
    material: 'Malla de aluminio sobre perfiles, conectada a tierra', funcion: 'Contiene el campo electromagnético y separa al operador de la alta tensión.',
    respaldo: 'revision', ref: ['yepez2022'],
  },
  puerta: {
    corto: 'Puerta (XS-801)',
    n: 15, grupo: 'Reactor', nombre: 'Puerta con enclavamiento (XS-801)',
    material: 'Malla de aluminio; interruptor de seguridad', funcion: 'Al abrirse corta la alta tensión.',
    respaldo: 'revision', ref: ['yepez2022'],
  },

  // --- Suministro de gas ---
  cilAire: { grupo: 'Gases', nombre: 'Cilindro de aire sintético', material: 'Acero, 10 L', funcion: 'Gas de trabajo más usado en los estudios revisados.', respaldo: 'revision', ref: ['durek2018', 'liu2023'] },
  cilN2: { grupo: 'Gases', nombre: 'Cilindro de N₂', material: 'Acero, 10 L', funcion: 'Base de las mezclas N₂/O₂.', respaldo: 'revision', ref: ['ozen2022', 'siciliano2016'] },
  cilO2: { grupo: 'Gases', nombre: 'Cilindro de O₂', material: 'Acero, 10 L', funcion: 'Fuente de especies reactivas de oxígeno.', respaldo: 'revision', ref: ['gok2019', 'nikmaram2023'] },
  cilAux: { grupo: 'Gases', nombre: 'Cilindro auxiliar (CO₂, Ar o He)', material: 'Acero, 10 L', funcion: 'Gas intercambiable para CO₂ o gases nobles.', respaldo: 'revision', ref: ['durek2018', 'hajhoseini2020', 'casas2019'] },
  panelMFC: {
    grupo: 'Gases', nombre: 'Panel de controladores de caudal (FIC-101 a 103)', tag: 'FIC-101/102/103',
    material: '3 controladores de caudal másico de 0 a 5 L/min', funcion: 'Dosifican cada gas para fijar la composición de la mezcla.',
    respaldo: 'revision', ref: ['dharini2023', 'puente2024'],
  },
  humidificador: {
    grupo: 'Gases', nombre: 'Humidificador de burbujeo con derivación',
    material: 'Frasco lavador de vidrio, 500 mL; válvula de aguja', funcion: 'Ajusta la humedad del gas de entrada.',
    respaldo: 'revision', ref: ['puente2024'],
  },
  sensorHR: {
    grupo: 'Gases', nombre: 'Sensor de humedad y temperatura (MT-201)', tag: 'MT-201',
    material: 'Sonda capacitiva', funcion: 'Mide la humedad relativa del gas que entra a la cámara.',
    respaldo: 'revision', ref: ['puente2024'],
  },
  tuberia: { grupo: 'Gases', nombre: 'Tubería de PFA de 6 mm', material: 'PFA translúcido', funcion: 'Conduce los gases; resiste el ozono.', respaldo: 'ingenieria', ref: [] },

  // --- Eléctrico ---
  fuente: {
    grupo: 'Eléctrico', nombre: 'Fuente de alta tensión', tag: 'EI-401 / JI-403',
    material: '0 a 30 kV pico, 5 a 20 kHz, 500 W, límite de corriente', funcion: 'Alimenta el electrodo de alta tensión.',
    respaldo: 'revision', ref: ['okyere2022', 'yadav2020'],
  },
  cableAT: { grupo: 'Eléctrico', nombre: 'Cable de alta tensión', material: 'Silicona, 40 kV CC', funcion: 'Une la fuente con el pasamuros.', respaldo: 'ingenieria', ref: [] },
  sondaAT: {
    grupo: 'Eléctrico', nombre: 'Sonda de alta tensión 1000:1 (EI-401)', tag: 'EI-401',
    material: 'Divisor resistivo-capacitivo, 40 kV', funcion: 'Mide la tensión aplicada.',
    respaldo: 'revision', ref: ['okyere2022'],
  },
  rogowski: {
    grupo: 'Eléctrico', nombre: 'Bobina de Rogowski (II-402)', tag: 'II-402',
    material: 'Bobina sin núcleo sobre el cable de tierra', funcion: 'Mide la corriente, incluidos los pulsos de microdescarga.',
    respaldo: 'ingenieria', ref: [],
  },
  capMedida: {
    grupo: 'Eléctrico', nombre: 'Condensador de medida Cm (JI-403)', tag: 'JI-403',
    material: '100 nF en serie con el electrodo de tierra', funcion: 'Mide la carga transferida; la figura de Lissajous Q–V da la energía por ciclo y la potencia.',
    respaldo: 'ingenieria', ref: [],
  },
  osciloscopio: {
    grupo: 'Eléctrico', nombre: 'Osciloscopio de 4 canales', material: '100 MHz', funcion: 'Registra tensión, corriente y carga.',
    respaldo: 'ingenieria', ref: [],
  },

  // --- Instrumentación de proceso ---
  espectrometro: {
    grupo: 'Instrumentos', nombre: 'Espectrómetro de emisión óptica (AI-501)', tag: 'AI-501',
    material: 'Espectrómetro compacto de 200 a 900 nm con fibra óptica', funcion: 'Identifica especies excitadas (NO, OH, N₂, N₂⁺, O).',
    respaldo: 'revision', ref: ['burducea2023', 'hueso2009'],
  },
  camaraIR: {
    grupo: 'Instrumentos', nombre: 'Cámara termográfica (TI-302)', tag: 'TI-302',
    material: 'Microbolómetro, 8 a 14 µm', funcion: 'Verifica la condición no térmica en la superficie de la muestra.',
    respaldo: 'revision', ref: ['lacombe2017', 'niemira2018', 'siciliano2016'],
  },
  termopar: {
    grupo: 'Instrumentos', nombre: 'Termopar tipo K a la salida (TT-301)', tag: 'TT-301',
    material: 'Vaina de acero inoxidable, fuera de la zona de descarga', funcion: 'Mide la temperatura del gas (30 a 60 °C esperados).',
    respaldo: 'revision', ref: ['jiang2022'],
  },
  fibraT: {
    grupo: 'Instrumentos', nombre: 'Sensor de temperatura de fibra óptica (TT-303)', tag: 'TT-303',
    material: 'Sonda de fibra con punta de GaAs', funcion: 'Mide la temperatura en contacto con la muestra sin perturbar el campo eléctrico.',
    respaldo: 'ingenieria', ref: [],
  },
  monitorO3: {
    grupo: 'Instrumentos', nombre: 'Monitor de ozono por absorción UV (AI-502)', tag: 'AI-502',
    material: 'Celda de absorción a 254 nm', funcion: 'Mide el ozono a la salida de la cámara.',
    respaldo: 'revision', ref: ['ott2022'],
  },
  destructor: {
    grupo: 'Instrumentos', nombre: 'Destructor catalítico de ozono',
    material: 'Cartucho de dióxido de manganeso', funcion: 'Convierte el ozono residual en O₂ antes de la extracción.',
    respaldo: 'revision', ref: ['yepez2022'],
  },
  extraccion: {
    grupo: 'Instrumentos', nombre: 'Brazo de extracción localizada', material: 'Ducto articulado de 75 mm', funcion: 'Retira los gases de salida del área de trabajo.',
    respaldo: 'revision', ref: ['yepez2022'],
  },
  sensorO3amb: {
    grupo: 'Instrumentos', nombre: 'Sensor de ozono ambiental (AI-503)', tag: 'AI-503',
    material: 'Sensor electroquímico', funcion: 'Alarma y corte de alta tensión ante fugas en el puesto del operador.',
    respaldo: 'revision', ref: ['yepez2022'],
  },
  balanza: {
    grupo: 'Instrumentos', nombre: 'Balanza de 0,01 g (WI-601)', tag: 'WI-601',
    material: 'Celda de carga', funcion: 'Pesa la muestra para calcular la energía específica (kJ/kg).',
    respaldo: 'revision', ref: ['ott2022'],
  },
  pc: {
    grupo: 'Instrumentos', nombre: 'Computador de adquisición', material: 'Registro de todas las señales', funcion: 'Calcula E = P·t, la energía específica y registra el lote.',
    respaldo: 'revision', ref: ['yepez2022'],
  },

  // --- Seguridad ---
  paro: { grupo: 'Seguridad', nombre: 'Paro de emergencia (HS-802)', tag: 'HS-802', material: 'Pulsador de seta', funcion: 'Corta la alta tensión de inmediato.', respaldo: 'revision', ref: ['yepez2022'] },
  baliza: { grupo: 'Seguridad', nombre: 'Baliza de alta tensión', material: 'Luz ámbar', funcion: 'Indica que la alta tensión está activa.', respaldo: 'ingenieria', ref: [] },
  mesa: { grupo: 'Entorno', nombre: 'Mesón de laboratorio', material: 'Cubierta de resina epóxica, 1,8 × 0,75 m', funcion: 'Soporta el banco completo.', respaldo: 'ingenieria', ref: [] },
};

export const INSTRUMENTOS = [
  { tag: 'FIC-101 a 103', variable: 'Caudal de cada gas', principio: 'Controlador de caudal másico térmico', rango: '0 a 5 L/min', ubicacion: 'Panel de gases', porque: 'La composición del gas define las especies reactivas.', ref: ['dharini2023', 'puente2024'] },
  { tag: 'MT-201', variable: 'Humedad relativa y temperatura del gas de entrada', principio: 'Sonda capacitiva', rango: '0 a 100 % HR', ubicacion: 'Entrada de la cámara', porque: 'La humedad modifica la mezcla de especies; el OH• proviene del agua.', ref: ['puente2024'] },
  { tag: 'EI-401', variable: 'Tensión aplicada', principio: 'Sonda de alta tensión 1000:1', rango: '0 a 40 kV', ubicacion: 'Salida de la fuente', porque: 'El encendido de la DBD es del orden de 10 kV.', ref: ['okyere2022'] },
  { tag: 'II-402', variable: 'Corriente de descarga', principio: 'Bobina de Rogowski', rango: 'Pulsos de ns a A', ubicacion: 'Cable de tierra', porque: 'Registra las microdescargas y la corriente de desplazamiento.', ref: [] },
  { tag: 'JI-403', variable: 'Potencia y energía por lote', principio: 'Figura de Lissajous Q–V con condensador de medida', rango: '0 a 500 W', ubicacion: 'Rama de tierra', porque: 'Permite informar E = P·t, kJ/kg y kJ/kg por ciclo logarítmico, como pide la discusión del informe.', ref: ['puente2024'] },
  { tag: 'TT-301', variable: 'Temperatura del gas', principio: 'Termopar tipo K', rango: '0 a 200 °C', ubicacion: 'Salida de la cámara', porque: 'Los equipos para alimentos operan con el gas entre 30 y 60 °C.', ref: ['jiang2022'] },
  { tag: 'TI-302', variable: 'Temperatura superficial de la muestra', principio: 'Termografía infrarroja', rango: '−20 a 150 °C', ubicacion: 'Ventana de ZnSe', porque: 'La condición no térmica debe verificarse en cada proceso.', ref: ['lacombe2017', 'niemira2018', 'siciliano2016'] },
  { tag: 'TT-303', variable: 'Temperatura en contacto con la muestra', principio: 'Fibra óptica (GaAs)', rango: '−40 a 250 °C', ubicacion: 'Bajo la muestra', porque: 'Medición de contacto inmune al campo eléctrico.', ref: [] },
  { tag: 'AI-501', variable: 'Espectro de emisión (especies excitadas)', principio: 'Espectroscopía de emisión óptica', rango: '200 a 900 nm', ubicacion: 'Ventana de cuarzo', porque: 'Identifica NO, OH, N₂, N₂⁺ y O, como en los estudios revisados.', ref: ['burducea2023', 'hueso2009'] },
  { tag: 'AI-502', variable: 'Ozono a la salida', principio: 'Absorción UV a 254 nm', rango: '0 a 5 000 ppm', ubicacion: 'Línea de escape', porque: 'Cuantifica una especie reactiva de larga vida, como la espectroscopía de absorción de Ott et al. (2022).', ref: ['ott2022'] },
  { tag: 'AI-503', variable: 'Ozono ambiental', principio: 'Sensor electroquímico', rango: '0 a 1 ppm', ubicacion: 'Puesto del operador', porque: 'Protección de los trabajadores.', ref: ['yepez2022'] },
  { tag: 'WI-601', variable: 'Masa de la muestra', principio: 'Celda de carga', rango: '0 a 600 g, 0,01 g', ubicacion: 'Mesón', porque: 'La masa cambia la eficacia y es la base de la energía específica.', ref: ['ott2022'] },
  { tag: 'ZI-701', variable: 'Separación barrera–muestra', principio: 'Cabezal micrométrico', rango: '1 a 20 mm, 0,01 mm', ubicacion: 'Plataforma elevadora', porque: 'La distancia al emisor modifica la eficacia.', ref: ['niemira2018'] },
  { tag: 'KI-702', variable: 'Tiempo de exposición', principio: 'Temporizador de la secuencia', rango: '1 s a 60 min', ubicacion: 'Computador', porque: 'La distancia y el tiempo interactúan.', ref: ['niemira2018'] },
  { tag: 'XS-801 / HS-802', variable: 'Puerta y paro de emergencia', principio: 'Enclavamiento y pulsador de seta', rango: '—', ubicacion: 'Jaula y mesón', porque: 'La regulación exige sistemas confiables y protección de los trabajadores.', ref: ['yepez2022'] },
];

export const ANALISIS_FUERA_DE_LINEA = [
  { analisis: 'Recuento en placa (UFC, UFP)', para: 'Reducción logarítmica (Ecuaciones 1 y 2)', ref: ['puente2024'] },
  { analisis: 'pH y acidez titulable', para: 'Cambios en jugos, sidra y almidón', ref: ['ozen2022', 'dasan2018'] },
  { analisis: 'Actividad de agua', para: 'Alimentos secos y harinas', ref: ['yadav2020'] },
  { analisis: 'Color y fenoles totales', para: 'Calidad del alimento tratado', ref: ['dasan2018', 'liu2023'] },
  { analisis: 'Cromatografía de micotoxinas, conjugados y productos', para: 'Balance de masa de la toxina (Ecuación 5)', ref: ['chiappim2023', 'nikmaram2023', 'wielogorska2019'] },
  { analisis: 'Ensayo de toxicidad (Artemia, células HepG2)', para: 'Distinguir degradación de detoxificación', ref: ['casas2019', 'wielogorska2019'] },
];

export const SUPUESTOS = [
  'Frecuencia de la fuente fija en 10 kHz al aplicar un caso (la fuente admite de 5 a 20 kHz): la revisión no la informa para las DBD.',
  'Tensión de ruptura del aire con la correlación empírica V = 24,4·d + 6,53·√d (kV, d en cm) y una rigidez dieléctrica relativa aproximada para N₂, O₂, CO₂, Ar y He.',
  'Potencia calculada con el modelo de capacitancias equivalentes de la DBD (ecuación de Manley).',
  'Temperaturas del gas y del sustrato con modelos de primer orden ilustrativos, anclados al intervalo de 30 a 60 °C (Jiang et al., 2022) y al aumento de 28,9 °C a 1 000 W y 12 min (Siciliano et al., 2016).',
  'Ozono: orden de magnitud ilustrativo; la revisión no informa concentraciones.',
  'Especies reactivas y espectro de emisión: indicadores cualitativos. Las posiciones de las bandas provienen de tablas espectroscópicas generales, no de la revisión.',
  'Trayectorias de inactivación y degradación de primer orden que pasan por el valor informado; solo Zheng et al. (2022) informan la cinética.',
  'Dimensiones, materiales no mencionados en la revisión (PTFE, policarbonato, aluminio, ZnSe), rangos de los controladores, destructor de MnO₂, bobina de Rogowski y condensador de medida.',
];

export const SEGURIDAD = [
  { riesgo: 'Alta tensión (hasta 30 kV)', medida: 'Jaula de Faraday a tierra, enclavamiento de puerta, paro de emergencia, baliza y pértiga de descarga.', ref: ['yepez2022'] },
  { riesgo: 'Ozono y NOₓ', medida: 'Destructor catalítico, extracción localizada y sensor ambiental con corte de alta tensión.', ref: ['yepez2022'] },
  { riesgo: 'Radiación UV', medida: 'Cámara de policarbonato; la ventana de cuarzo queda cubierta por la fibra del espectrómetro.', ref: ['puente2024'] },
  { riesgo: 'HCl al tratar PVC', medida: 'Lavador alcalino adicional en el escape (96,44 % del cloro sale como HCl).', ref: ['song2023'] },
  { riesgo: 'Calentamiento del sustrato', medida: 'Termografía y fibra óptica; alarma si el gas supera 60 °C.', ref: ['siciliano2016', 'jiang2022'] },
];
