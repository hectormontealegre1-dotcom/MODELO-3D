// Recorrido guiado de 10 pasos (≈ 10 min) que presenta el modelo como un experimento de banco.
// Diseñado con tres borradores independientes, un juez y una verificación de cada cifra contra el informe;
// luego revisado por cuatro revisores (código, fidelidad, ensayo visual y redacción) con verificación adversarial.
// Caso de referencia: Kilonzo-Nthenge et al. (2018), Tabla 3 del informe.

export const EXPERIMENTO = {
  tituloCorto: 'Plasma frío sobre una manzana',
  titulo:
    'Efecto del tiempo de exposición a un plasma frío de descarga de barrera dieléctrica (DBD) de 200 W sobre la inactivación de E. coli en la superficie de manzana',
  pregunta:
    '¿Cuánto aumenta la reducción logarítmica de E. coli sobre la superficie de manzana cuando la exposición a un plasma DBD de 200 W pasa de 30 a 240 s? ¿Se mantiene la muestra en condición no térmica?',
  hipotesis:
    'Como la eficacia depende del tiempo de exposición, entre otras variables de proceso (Feizollahi et al., 2021; Niemira et al., 2018), alargar la exposición aumentará la reducción de E. coli hasta el orden de 5,5 log UFC/cm², valor informado por Kilonzo-Nthenge et al. (2018). Como la energía llega a los electrones (1 a 10 eV) y no al material en su conjunto (Okyere et al., 2022), el gas no superará los 60 °C informados para equipos de alimentos (Jiang et al., 2022). La temperatura de la manzana se medirá, porque la revisión no la informa.',
  casoReferencia:
    'Kilonzo-Nthenge et al. (2018): la única DBD de la Tabla 3 que informa potencia (200 W) y una reducción cuantitativa (5,5 log UFC/cm² en E. coli, con exposiciones de 30 a 240 s). La revisión base clasificó el equipo como descarga corona; la fuente primaria lo describe como DBD (Tabla 5). Cobertura del banco: parcial. El estudio informa 35 mm, que se interpreta como distancia de tratamiento; el banco trata a 3 mm, porque en el modelo el aire no enciende sobre unos 8 mm con 30 kV (el elevador llega a 20 mm). Además, la revisión no informa el gas.',
  // Versión breve para la portada
  resumen: {
    independiente: ['Tiempo de exposición al plasma, de 30 a 240 s'],
    dependientes: ['Reducción R = log₁₀(N₀/N)', 'Temperatura de la muestra y del gas', 'Energía específica (kJ/kg)'],
    controladas: ['Potencia de 200 W, gas y humedad', 'Separación d, masa e inóculo', 'Configuración DBD a presión atmosférica'],
  },
  variableIndependiente:
    'Tiempo de exposición al plasma, de 30 a 240 s (intervalo de Kilonzo-Nthenge et al., 2018), fijado con el temporizador de la secuencia (KI-702) del computador de adquisición. Los tiempos intermedios son una propuesta de diseño.',
  variablesDependientes: [
    'Reducción logarítmica, R = log₁₀(N₀/N), en log UFC/cm² (Ecuación 1), por recuento en placa, e inactivación, I = (1 − 10⁻ᴿ) × 100, en % (Ecuación 2).',
    'Temperatura superficial de la muestra (termografía TI-302) y de contacto bajo la muestra (fibra óptica TT-303), para verificar la condición no térmica (Lacombe et al., 2017; Niemira et al., 2018).',
    'Temperatura del gas a la salida (TT-301), frente a los 60 °C informados para equipos de alimentos (Jiang et al., 2022).',
    'Energía por lote, E = P·t (sonda EI-401, bobina II-402 y condensador JI-403, figura de Lissajous), normalizada por la masa (kJ/kg) y por la reducción (kJ/kg por ciclo logarítmico), como pide la discusión del informe.',
    'Mediciones complementarias: especies excitadas, identificadas por espectroscopía de emisión óptica (AI-501, cualitativa), y ozono a la salida (AI-502, valor ilustrativo: la revisión no informa concentraciones).',
  ],
  variablesControladas: [
    'Potencia: 200 W informados por Kilonzo-Nthenge et al. (2018), asumidos como potencia de descarga; en el banco, ≈ 21,7 kV a 10 kHz (supuesto de ingeniería).',
    'Frecuencia de la fuente: fija en 10 kHz, dentro del intervalo de 5 a 20 kHz del banco (supuesto: la revisión no la informa para las DBD).',
    'Gas de trabajo: aire sintético, con el caudal fijado en FIC-101 (supuesto: la revisión no informa el gas del estudio).',
    'Humedad del gas de entrada: medida con MT-201, porque el radical OH• proviene de la disociación del agua (Puente-Díaz, 2024).',
    'Separación barrera–muestra, d: 3 mm en el modelo (supuesto), fijada con el elevador ZI-701, porque la distancia modifica la eficacia (Niemira et al., 2018; Puente-Díaz, 2024).',
    'Matriz y masa: superficie de manzana Golden Delicious, con la masa registrada en la balanza WI-601 (Ott et al., 2022).',
    'Microorganismo e inóculo: E. coli, con la población inicial N₀ registrada en cada serie.',
    'Configuración: DBD plano-paralela con barreras de vidrio de sílice, a presión atmosférica, por lotes y con tratamiento abierto.',
  ],
  control:
    'Propuesta de diseño; el informe no describe controles. (1) Control negativo: manzanas inoculadas que pasan el mismo tiempo en la cámara, con el mismo gas, caudal y humedad, pero sin alta tensión, para separar el efecto del plasma del efecto del gas y de la manipulación. (2) Referencia N₀: manzanas inoculadas que no entran a la cámara y se recuentan al inicio de cada serie.',
  replicas:
    'Propuesta de diseño: al menos tres réplicas independientes por tiempo de exposición, cada una con su propia manzana e inoculación, en orden aleatorio; se informan la media y la dispersión de R. El informe no indica cuántas réplicas usó el estudio de referencia.',
  respaldo: [
    'Kilonzo-Nthenge et al. (2018), Tabla 3: DBD, 200 W, 35 mm, 30 a 240 s; 5,5 log UFC/cm² en E. coli y 5,3 en Salmonella (≥ 99,9995 %); datos modelados con una distribución de Weibull.',
    'Tabla 5 del informe: la revisión base clasificó el equipo como descarga corona; la fuente primaria lo describe como DBD.',
    'Feizollahi et al. (2021): la eficacia depende de variables de proceso, de producto y microbiológicas. Niemira et al. (2018): la distancia y el tiempo de exposición interactúan.',
    'Okyere et al. (2022) y Ecuación 4: electrones de 1 a 10 eV, ≈ 11 605 a 116 045 K; con el gas a 298,15 K, los electrones resultan de 38,9 a 389,2 veces más calientes que el gas.',
    'Jiang et al. (2022): equipos de plasma frío para alimentos con el gas entre 30 y 60 °C.',
    'Tabla 1 (Feizollahi et al., 2021; Guo et al., 2015; Okyere et al., 2022): la barrera dieléctrica limita la corriente y evita arcos; encendido del orden de 10 kV.',
    'Song et al. (2023): en la decloración de PVC, energía de activación aparente de 23,62 kJ/mol con plasma frente a 137,09 kJ/mol con pirólisis (5,8 veces menor).',
    'Siciliano et al. (2016): en avellanas, la temperatura aumentó hasta en 28,9 °C con 1 000 W durante 12 min. Lacombe et al. (2017) y Niemira et al. (2018) verificaron la condición no térmica con termografía infrarroja.',
    'Puente-Díaz (2024): especies reactivas O, O₃, OH•, H₂O₂ y NOₓ, además de radiación UV; en las bacterias Gram negativas predominarían la fuga de contenido celular y el daño del ADN. Burducea et al. (2023): en un chorro de helio se identificaron NO, OH, N₂, N₂⁺ y O.',
    'Dasan y Boyaci (2018): con chorro de plasma, 4,02 log en jugo de manzana frente a 1,43 log en jugo de tomate. Ott et al. (2022): en queso fresco, menor eficacia a mayor masa. Niemira et al. (2018): alejar la muestra de 5 a 7,5 cm redujo la inactivación en 0,45 y 0,44 ciclos con 5 y 10 s, respectivamente; sin diferencia a los 15 s.',
    'Discusión del informe: E = P·t debe normalizarse en kJ/kg y kJ/kg por ciclo logarítmico. Yepez et al. (2022): la regulación exige monitoreo, control del proceso y protección de los trabajadores.',
  ],
};

const CASO = 'kilonzo_ecoli';

// acciones.etiquetas: lista de etiquetas 3D que el paso muestra (sin filtro de distancia); [] = ninguna.
export const PASOS = [
  {
    id: 'pregunta',
    titulo: 'La pregunta del experimento',
    fase: 'Pregunta',
    duracionSeg: 65,
    acciones: {
      vista: 'general', caso: CASO, proceso: 'reposo',
      tarjeta: {
        titulo: 'Pregunta del experimento',
        lineas: [
          'Pregunta: ¿cuánto aumenta la reducción de E. coli sobre manzana si la exposición pasa de 30 a 240 s?',
          'Temperatura: ¿se mantiene la muestra en condición no térmica?',
          'Referencia: Kilonzo-Nthenge et al. (2018), Tabla 3',
          'Escala: banco DBD de 200 W, de laboratorio, a presión atmosférica y por lotes',
        ],
      },
    },
    textoPantalla:
      'Datos: solo de la revisión; equipos y dimensiones: supuestos de ingeniería. «Pirólisis en frío» es un término de trabajo: el plasma rompe enlaces sin calentar el material en su conjunto. PVC: energía de activación aparente de 23,62 kJ/mol con plasma y 137,09 kJ/mol con pirólisis.',
    guionOral:
      'Les presento un banco de plasma frío de descarga de barrera dieléctrica, o DBD. Sus datos provienen solo de nuestra revisión bibliográfica; los equipos y sus dimensiones son supuestos de ingeniería. Lo recorreremos como un experimento de laboratorio. Una precisión: la pirólisis es la descomposición térmica de un material en ausencia de oxígeno. El plasma frío, en cambio, no calienta el material en su conjunto: rompe enlaces con electrones energéticos, especies reactivas y radiación UV, y en la mayoría de los estudios opera con oxígeno. Por eso, «pirólisis en frío» es un término de trabajo. La analogía tiene respaldo: al declorar PVC, la energía de activación aparente fue 5,8 veces menor con plasma que con pirólisis. La pregunta, en la tarjeta: ¿cuánto aumenta la reducción de E. coli sobre una manzana si la exposición pasa de 30 a 240 segundos? ¿Y se mantiene la muestra en condición no térmica?',
    mensajeClave: 'Todo el recorrido responde una sola pregunta medible; «pirólisis en frío» es un término de trabajo con respaldo en la decloración de PVC.',
    queMirar: 'Con un gesto amplio, el banco completo (gases, celda en la jaula e instrumentos); después, la tarjeta con la pregunta y la comparación del PVC en la barra inferior.',
  },
  {
    id: 'hipotesis',
    titulo: 'Hipótesis: más exposición, más reducción, sin calentar',
    fase: 'Hipótesis',
    duracionSeg: 65,
    acciones: {
      vista: 'reactor', corte: true, caso: CASO, proceso: 'reposo', resaltar: 'barreraSup', etiquetas: [],
      tarjeta: {
        titulo: 'Las dos partes de la hipótesis',
        lineas: [
          'Ecuación 4: Tₑ = E / k, con k la constante de Boltzmann',
          'Electrones (1 a 10 eV): Tₑ ≈ 11 605 a 116 045 K',
          'Gas a 298 K: electrones 39 a 389 veces más calientes',
          'Predicción térmica: el gas no supera los 60 °C de los equipos para alimentos',
          'Predicción temporal: más tiempo, más reducción, hasta el orden de 5,5 log',
          'Cinética: el estudio usó Weibull; la recta del panel es solo un supuesto',
        ],
      },
    },
    textoPantalla:
      'Como la energía va a los electrones, el gas no superará 60 °C; la temperatura de la manzana se medirá. Como la eficacia depende del tiempo, más exposición dará más reducción de E. coli, hasta el orden de 5,5 log.',
    guionOral:
      'La hipótesis tiene dos partes. La primera es física: en un plasma frío, los electrones alcanzan energías de entre 1 y 10 electronvoltios, mientras las partículas pesadas siguen cerca de la temperatura ambiente. Con la Ecuación 4, 1 electronvoltio equivale a unos 11 600 kelvin, y 10 electronvoltios, a unos 116 000. Con el gas a 298 kelvin, los electrones están entre 39 y 389 veces más calientes que el gas. Por eso predecimos que el gas no superará los 60 grados de los equipos para alimentos; la temperatura de la manzana la mediremos, porque la revisión no la informa. La segunda parte viene de la literatura: la eficacia depende del tiempo de exposición, entre otras variables. Predecimos más reducción con más tiempo, hasta el orden de 5,5 ciclos logarítmicos, el valor de Kilonzo-Nthenge y colaboradores. No suponemos una recta: los autores usaron una distribución de Weibull.',
    mensajeClave: 'La parte térmica de la hipótesis se deduce del no equilibrio; la parte temporal, de la literatura y del caso de referencia.',
    queMirar: 'La tarjeta de arriba abajo; luego, en el corte de la celda, la barrera superior resaltada y el espacio bajo ella, donde se formará el plasma.',
  },
  {
    id: 'diseno',
    titulo: 'Diseño: qué cambiamos, qué medimos y qué fijamos',
    fase: 'Diseño experimental',
    duracionSeg: 60,
    acciones: {
      vista: 'general', caso: CASO, proceso: 'reposo',
      tarjeta: {
        titulo: 'Diseño experimental',
        lineas: [
          'Independiente: tiempo de exposición, de 30 a 240 s',
          'Dependientes: R = log₁₀(N₀/N), temperatura de la muestra y del gas, energía específica',
          'Controladas: 200 W, gas, humedad, separación d, masa e inóculo',
          'Control: cámara con gas y sin alta tensión (propuesta de diseño)',
          'Réplicas: al menos tres por tiempo, en orden aleatorio (propuesta de diseño)',
        ],
      },
    },
    textoPantalla:
      'Se manipula una sola variable: el tiempo. Se miden la reducción logarítmica, la temperatura y la energía; lo demás queda fijo. El control sin descarga y las réplicas son propuestas de diseño, no datos del informe.',
    guionOral:
      'En este experimento cambiamos una sola cosa: el tiempo de exposición, de 30 a 240 segundos. Medimos tres respuestas. Primero, la reducción logarítmica de la Ecuación 1: el logaritmo del cociente entre la población inicial y la final, contadas en placa. Segundo, la temperatura de la muestra y del gas, para comprobar que el proceso es no térmico. Tercero, la energía por lote. Lo demás queda fijo: potencia, gas, humedad, separación, masa e inóculo, porque la eficacia depende de variables de proceso, de producto y microbiológicas. Dos elementos son propuestas nuestras, no datos del informe. El primero es un control: manzanas inoculadas que pasan el mismo tiempo en la cámara, con el mismo gas, pero sin alta tensión. Así separamos el efecto del plasma del efecto del gas y de la manipulación. El segundo: al menos tres réplicas por tiempo, en orden aleatorio.',
    mensajeClave: 'Se cambia una sola variable y se fija el resto; el control sin descarga y las réplicas son propuestas de diseño.',
    queMirar: 'La tarjeta línea por línea, marcando con la mano «propuesta de diseño».',
  },
  {
    id: 'montaje',
    titulo: 'Montaje: la celda DBD por dentro',
    fase: 'Montaje',
    duracionSeg: 60,
    acciones: { vista: 'despiece', despiece: 0.8, caso: CASO, proceso: 'reposo', resaltar: 'barreraSup' },
    textoPantalla:
      'Celda DBD plano-paralela: electrodos de Ø 100 mm y barreras de vidrio de sílice, que limitan la corriente y evitan arcos. Una plataforma elevadora micrométrica ajusta la separación d entre 1 y 20 mm. Los materiales (salvo la sílice) y las dimensiones son supuestos.',
    guionOral:
      'Ahora, el montaje. Separamos la celda en sus quince piezas numeradas; la lista está a la izquierda. Arriba están el pasamuros y el electrodo de alta tensión; abajo, el electrodo de tierra. Los dos electrodos son de aluminio, un supuesto del banco. Entre ellos está lo que define a una DBD: la barrera dieléctrica, aquí de vidrio de sílice, uno de los materiales que menciona la revisión. La barrera limita la corriente y evita los arcos; el modelo muestra las microdescargas como filamentos breves, en forma esquemática. La muestra, pieza seis, descansa sobre una plataforma elevadora micrométrica, que ajusta la separación entre 1 y 20 milímetros. Esa separación es una variable controlada, porque cambia las especies que llegan al alimento. La ventana de cuarzo deja pasar la luz hacia el espectrómetro, y la infrarroja, hacia la cámara termográfica.',
    mensajeClave: 'La barrera dieléctrica define la DBD, y cada ventana de la cámara existe para un instrumento.',
    queMirar: 'La barrera superior resaltada (pieza 4) y su ficha; en la lista, los electrodos (3 y 8), la muestra (6), la plataforma elevadora (9) y las ventanas (12 y 13).',
  },
  {
    id: 'procedimiento',
    titulo: 'Procedimiento: masa, puerta y purga',
    fase: 'Procedimiento',
    duracionSeg: 55,
    acciones: { vista: 'gases', caso: CASO, proceso: 'purga', etiquetas: ['cilAux', 'panelMFC', 'humidificador', 'sensorHR', 'balanza'] },
    textoPantalla:
      'Secuencia: pesaje e inoculación → ajuste de la separación d → cierre de la puerta → purga (caudal y humedad) → alta tensión → postpurga → recuento en placa. Gas: aire sintético (supuesto; la revisión no lo informa).',
    guionOral:
      'El procedimiento sigue un orden fijo, que ven abajo en la pantalla. Primero pesamos la muestra en una balanza con resolución de 0,01 gramos: la masa cambia la eficacia y sirve para calcular la energía específica. Luego ajustamos la separación y cerramos la puerta de la jaula, que tiene enclavamiento. Después purgamos la cámara. Con aire sintético, solo el primer controlador de caudal trabaja; los otros dos quedan para preparar mezclas. Un sensor registra la humedad. ¿Por qué medirla? Porque el radical hidroxilo se forma por disociación del agua, y el gas, la humedad y la distancia definen la mezcla de especies reactivas. Usamos aire sintético, pero es un supuesto: la revisión no informa el gas de este estudio. Al final vendrán la postpurga, que retira el ozono, y el recuento en placa.',
    mensajeClave: 'Un orden fijo hace comparables los lotes; el gas y la humedad se miden porque determinan las especies reactivas.',
    queMirar: 'Los cilindros, el panel de controladores (FIC-101 a 103; solo el primero con caudal), el humidificador y el sensor MT-201; seguir la purga por la tubería hasta la celda.',
  },
  {
    id: 'medicion-electrica',
    titulo: 'Medición I: tensión, corriente y energía',
    fase: 'Medición',
    duracionSeg: 60,
    acciones: {
      vista: 'instrumentos', caso: CASO, proceso: 'tratamiento', avance: 0.15, panel: 'instrumentos', tab: 'electrico', ancla: 'energia',
      resaltar: 'capMedida', etiquetas: ['sondaAT', 'rogowski', 'capMedida', 'osciloscopio', 'fuente'],
    },
    textoPantalla:
      'Alta tensión encendida. Sonda de alta tensión: tensión; bobina de Rogowski: corriente; condensador de medida: carga. La figura de Lissajous da la potencia; con E = P·t y la masa se informan kJ/kg y kJ/kg por ciclo logarítmico. Tensión y potencia del banco: supuestos.',
    guionOral:
      'Encendemos la alta tensión. En el modelo, con aire y 3 milímetros de separación, la descarga se enciende cerca de 14,7 kilovoltios. Con 21,7 kilovoltios a 10 kilohercios entrega unos 200 vatios, ajustados para igualar los 200 que informa el estudio. Tratar esa cifra como potencia de descarga es un supuesto nuestro: la revisión no lo precisa. Ese encendido sale de una correlación empírica, otro supuesto, y es del mismo orden que los 10 kilovoltios que la revisión informa para la DBD. ¿Para qué tres instrumentos eléctricos? La sonda mide la tensión; la bobina de Rogowski, la corriente; y el condensador de medida, la carga. Al graficar la carga contra la tensión se obtiene la figura de Lissajous, y de ella, la potencia. Dividiendo la energía por la masa y por los ciclos logrados, obtenemos la energía específica que pide el informe.',
    mensajeClave: 'Medir tensión, corriente y carga permite informar la energía específica que el informe pide para comparar procesos.',
    queMirar: 'La sonda, la bobina y el condensador resaltado, con sus etiquetas; en la pestaña Eléctrico, la figura de Lissajous y la energía del lote. La baliza encendida sobre la jaula.',
  },
  {
    id: 'medicion-plasma',
    titulo: 'Medición II: especies reactivas y temperatura',
    fase: 'Medición',
    duracionSeg: 60,
    acciones: { vista: 'descarga', corte: true, lupa: true, caso: CASO, proceso: 'tratamiento', avance: 0.5, panel: 'instrumentos', tab: 'gas', ancla: 'ozono', etiquetas: [] },
    textoPantalla:
      'Lupa esquemática, sin escala. Electrones → O, O₃, OH•, H₂O₂, NOₓ y radiación UV sobre la superficie. Espectrómetro: identifica especies, sin cuantificarlas; monitor de ozono (absorción UV): O₃ a la salida. Ozono y temperaturas del panel: valores ilustrativos.',
    guionOral:
      'Acerquémonos a la descarga. La lupa es esquemática y sin escala. Los choques de los electrones con el gas y el vapor de agua inician una cadena que forma oxígeno atómico, ozono, radical hidroxilo, peróxido de hidrógeno y óxidos de nitrógeno, además de radiación UV. Según la revisión base, en las bacterias Gram negativas predominarían la fuga de contenido celular y el daño del ADN. El espectrómetro buscaría especies como óxido nítrico, hidroxilo, nitrógeno y oxígeno atómico, identificadas en un chorro de helio; en aire, la mezcla puede ser distinta. El monitor mide el ozono a la salida. La temperatura se mide en el gas, en la superficie y en contacto bajo la muestra; el panel grafica las dos primeras. El sustrato sí puede calentarse: en avellanas, con 1 000 vatios durante 12 minutos, la temperatura aumentó hasta en 28,9 grados Celsius.',
    mensajeClave: 'Las especies reactivas son el mecanismo de daño, no el calor; aun así, la temperatura se mide en tres puntos.',
    queMirar: 'En la lupa ampliada: electrones blancos, filamentos, especies de colores y células que se dañan. Luego, la pestaña Gas y temperatura, marcando que sus valores son ilustrativos.',
  },
  {
    id: 'resultado',
    titulo: 'Resultado de referencia: hasta 5,5 ciclos logarítmicos',
    fase: 'Resultado',
    duracionSeg: 60,
    acciones: { vista: 'reactor', corte: true, caso: CASO, proceso: 'final', panel: 'instrumentos', tab: 'resultado', etiquetas: [] },
    textoPantalla:
      'Dato de la literatura, no medición propia: hasta 5,5 log UFC/cm² (99,9997 %) en E. coli, con DBD de 200 W y exposiciones de 30 a 240 s. La ubicación del punto a los 240 s y la trayectoria de primer orden son supuestos del modelo.',
    guionOral:
      'Atención: este resultado no lo medimos nosotros. Es el valor que informaron Kilonzo-Nthenge y colaboradores con una DBD de 200 vatios: hasta 5,5 ciclos logarítmicos en E. coli y 5,3 en Salmonella. Según la Ecuación 2, una reducción de 5,5 ciclos equivale a inactivar el 99,9997 % de la población: sobreviven unas 3 bacterias de cada millón. La literatura respalda esa magnitud en exposiciones de 30 a 240 segundos, pero la revisión no informa cómo cambia la reducción con el tiempo ni en qué momento se alcanzó el máximo. Esa relación es justamente lo que mediría el experimento, descontando el resultado del control sin descarga. La lectura crítica: ubicar el punto a los 240 segundos y unirlo con una recta de primer orden son supuestos del modelo, porque los autores usaron Weibull. La temperatura de la manzana tampoco está informada: queda por medir.',
    mensajeClave: 'El valor viene de la literatura: respalda la magnitud alcanzable, no la relación con el tiempo, que es lo que mediría el experimento.',
    queMirar: 'En la pestaña Resultado, el punto en 5,5 log y el aviso que separa el dato informado de la trayectoria supuesta.',
  },
  {
    id: 'analisis',
    titulo: 'Análisis: límites de la comparación',
    fase: 'Análisis',
    duracionSeg: 65,
    acciones: {
      vista: 'reactor', corte: true, caso: CASO, proceso: 'final', resaltar: 'elevador', etiquetas: [],
      tarjeta: {
        titulo: 'Limitaciones y validez',
        lineas: [
          'Separación: el estudio informa 35 mm (distancia de tratamiento); el banco trata a 3 mm',
          'Encendido: en el modelo, el aire no enciende sobre ≈ 8 mm con 30 kV',
          'Gas: no informado; el banco usa aire (supuesto)',
          'Clasificación: descarga corona en la revisión base; DBD en la fuente primaria',
          'Matriz: con chorro de plasma (Dasan y Boyaci, 2018), E. coli bajó 4,02 log en jugo de manzana y 1,43 en jugo de tomate',
        ],
      },
    },
    textoPantalla:
      'Cobertura parcial: el estudio informa 35 mm y el banco trata a 3 mm; la revisión no informa el gas. La eficacia es propiedad del sistema plasma–matriz–microorganismo: un resultado sobre manzana no se extrapola a otra matriz.',
    guionOral:
      'Primero, las limitaciones. Una: el estudio informa 35 milímetros, que interpretamos como la distancia de tratamiento. Nuestro elevador llega a 20, pero el banco trata a 3: con 30 kilovoltios, el aire del modelo no enciende sobre unos 8 milímetros. Dos: la revisión no informa el gas; usar aire es un supuesto. Tres: la revisión base clasificó este equipo como descarga corona, y la fuente primaria lo describe como DBD. La eficacia no es una propiedad del equipo, sino del sistema formado por el plasma, la matriz y el microorganismo. Con el mismo chorro de plasma, la población de E. coli bajó 4,02 ciclos en jugo de manzana y solo 1,43 en jugo de tomate: 389 veces más sobrevivientes en el tomate. En queso fresco, más masa significó menos eficacia. Y en biopelículas, alejar la muestra de 5 a 7,5 centímetros restó 0,45 ciclos con 5 segundos de exposición, pero no a los 15.',
    mensajeClave: 'La eficacia pertenece al sistema plasma–matriz–microorganismo, y el banco cubre el caso de referencia solo en forma parcial.',
    queMirar: 'La plataforma elevadora resaltada y su ficha (alcance de 20 mm; el banco trata a 3 mm); después, la tarjeta de limitaciones línea por línea.',
  },
  {
    id: 'conclusion',
    titulo: 'Conclusión del experimento',
    fase: 'Conclusión',
    duracionSeg: 60,
    acciones: {
      vista: 'general', caso: CASO, proceso: 'final', puerta: 'abrir', resaltar: 'puerta',
      tarjeta: {
        titulo: 'Conclusión',
        lineas: [
          'Factibilidad: la pregunta es medible en un banco DBD de laboratorio',
          'Referencia: hasta 5,5 log sobre manzana; no extrapolable',
          'Validez: control sin descarga y réplicas (propuestas de diseño), más verificación térmica',
          'Energía: informar kJ/kg y kJ/kg por ciclo logarítmico',
          '«Pirólisis en frío»: romper enlaces con electrones, no con calor',
        ],
      },
    },
    textoPantalla:
      'Cámara purgada y puerta abierta: el enclavamiento mantiene la fuente sin tensión y la muestra va al recuento en placa. La referencia anticipa hasta 5,5 log, un valor válido solo para esa matriz, ese equipo y esa distancia.',
    guionOral:
      'Con la cámara ya purgada, abrimos la puerta. El enclavamiento, un supuesto de diseño del banco, mantiene la fuente sin tensión y responde a la protección de los trabajadores que exige la regulación. La manzana sale al recuento en placa. ¿Qué concluimos? Primero, la pregunta es medible: el banco varía solo el tiempo y mide la reducción, la temperatura y la energía. Segundo, la literatura anticipa hasta 5,5 ciclos sobre manzana, pero ese valor no se extrapola a otra matriz, otro equipo, otro gas u otra distancia. Tercero, la validez exige un control sin descarga y réplicas, nuestra propuesta de diseño, además de verificar la temperatura e informar la energía específica, como pide el informe. Para la ingeniería ambiental, el plasma frío interesa porque podría sustituir sanitizantes químicos. Y «pirólisis en frío» resume la idea: romper enlaces con electrones, no con calor. Muchas gracias.',
    mensajeClave: 'El experimento es factible, pero su resultado vale solo para sus condiciones; la validez depende del control, las réplicas, la verificación térmica y la energía específica.',
    queMirar: 'La puerta abierta de la jaula, resaltada (sin baliza ni descarga), y la tarjeta de conclusión; cerrar con un gesto hacia el banco completo.',
  },
];
