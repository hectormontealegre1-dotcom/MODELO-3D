// Recorrido guiado de 10 pasos (≈ 10 min) que presenta el modelo como un experimento de banco.
// Diseñado con tres borradores independientes, un juez y una verificación de cada cifra contra el informe.
// Caso de referencia: Kilonzo-Nthenge et al. (2018), Tabla 3 del informe.

export const EXPERIMENTO = {
  tituloCorto: 'Plasma frío sobre una manzana',
  titulo: 'Efecto del tiempo de exposición a un plasma frío DBD de 200 W sobre la inactivación de E. coli en la superficie de manzana',
  pregunta:
    '¿Cuánto aumenta la reducción logarítmica de E. coli sobre la superficie de manzana al alargar la exposición a un plasma DBD de 200 W entre 30 y 240 s? ¿Se mantiene la muestra en condición no térmica?',
  hipotesis:
    'Como la energía llega a los electrones (1 a 10 eV) y no al material en su conjunto, alargar la exposición aumentará la reducción de E. coli hasta el orden de 5,5 log UFC/cm² informado por Kilonzo-Nthenge et al. (2018), y el gas no superará los 60 °C informados para equipos de alimentos (Jiang et al., 2022). La temperatura de la superficie se mide, porque la revisión no la informa para la manzana.',
  casoReferencia:
    'Kilonzo-Nthenge et al. (2018): la única DBD de la Tabla 3 que informa potencia (200 W) y una reducción cuantitativa (5,5 log UFC/cm² en E. coli, con 30 a 240 s). La revisión base clasificó el equipo como corona; la fuente primaria lo describe como DBD (Tabla 5). Cobertura del banco parcial: el estudio informa 35 mm, que se interpreta como distancia de tratamiento, y el banco llega a 20 mm; el gas no se informa.',
  // Versión breve para la portada
  resumen: {
    independiente: ['Tiempo de exposición al plasma, de 30 a 240 s'],
    dependientes: ['Reducción R = log₁₀(N₀/N)', 'Temperatura de la muestra y del gas', 'Energía específica (kJ/kg)'],
    controladas: ['Potencia 200 W, gas y humedad', 'Separación d, masa e inóculo', 'Configuración DBD a presión atmosférica'],
  },
  variableIndependiente: 'Tiempo de exposición al plasma, entre 30 y 240 s (intervalo de Kilonzo-Nthenge et al., 2018), fijado con el temporizador del PC de registro. Los tiempos intermedios son propuesta de diseño.',
  variablesDependientes: [
    'Reducción logarítmica R = log₁₀(N₀/N) en log UFC/cm² (Ecuación 1), por recuento en placa, e inactivación I = (1 − 10^(−R)) × 100 (Ecuación 2).',
    'Temperatura superficial de la muestra (termografía TI-302) y de contacto bajo la muestra (fibra óptica TT-303), para verificar la condición no térmica (Lacombe et al., 2017; Niemira et al., 2018).',
    'Temperatura del gas a la salida (TT-301), frente al máximo de 60 °C de los equipos para alimentos (Jiang et al., 2022).',
    'Energía por lote E = P·t (sonda EI-401, bobina II-402 y condensador JI-403, figura de Lissajous), normalizada en kJ/kg y kJ/kg por ciclo logarítmico, como pide la Discusión del informe.',
    'Variables explicativas: especies excitadas por espectroscopía de emisión (AI-501, cualitativa) y ozono a la salida (AI-502, valor ilustrativo: la revisión no informa concentraciones).',
  ],
  variablesControladas: [
    'Potencia: 200 W informados por Kilonzo-Nthenge et al. (2018), asumidos como potencia de descarga; en el banco, ≈ 21,7 kV a 10 kHz (supuesto de ingeniería).',
    'Frecuencia de la fuente, fija entre 5 y 20 kHz (supuesto: la revisión no la informa para las DBD).',
    'Gas de trabajo: aire sintético, con caudal fijado en FIC-101 a 103 (supuesto: la revisión no informa el gas del estudio).',
    'Humedad del gas de entrada (MT-201), porque el OH• proviene de la disociación del agua (Puente-Díaz, 2024).',
    'Separación barrera–muestra d con el elevador ZI-701 (3 mm en el modelo, supuesto), porque la distancia modifica la eficacia (Niemira et al., 2018; Puente-Díaz, 2024).',
    'Matriz y masa: superficie de manzana Golden Delicious, con masa registrada en la balanza WI-601 (Ott et al., 2022).',
    'Microorganismo e inóculo: E. coli, con población inicial N₀ registrada en cada serie.',
    'Configuración: DBD plano-paralela con barreras de vidrio de sílice, a presión atmosférica, por lotes y con tratamiento abierto.',
  ],
  control:
    'Propuesta de diseño; el informe no describe controles. (1) Control negativo: manzanas inoculadas en la cámara el mismo tiempo, con el mismo gas, caudal y humedad, pero sin alta tensión, para separar el efecto del plasma del efecto del gas y la manipulación. (2) Referencia N₀: manzanas inoculadas que no entran a la cámara y se recuentan al inicio de cada serie.',
  replicas:
    'Propuesta de diseño: al menos 3 réplicas independientes por tiempo de exposición, cada una con manzana e inoculación propias, en orden aleatorizado, informando media y dispersión de R. El informe no indica cuántas réplicas usó el estudio de referencia.',
  respaldo: [
    'Kilonzo-Nthenge et al. (2018), Tabla 3: DBD, 200 W, 35 mm, 30 a 240 s; 5,5 log UFC/cm² en E. coli y 5,3 en Salmonella (≥ 99,9995 %); datos modelados con una distribución de Weibull.',
    'Tabla 5 del informe: la revisión base clasificó el equipo como corona; la fuente primaria lo describe como DBD.',
    'Okyere et al. (2022) y Ecuación 4: electrones de 1 a 10 eV, ≈ 11 605 a 116 045 K; con el gas a 298,15 K, Te/Tg de 38,9 a 389,2.',
    'Jiang et al. (2022): equipos de plasma frío para alimentos con el gas entre 30 y 60 °C.',
    'Tabla 1 (Feizollahi et al., 2021; Guo et al., 2015; Okyere et al., 2022): la barrera dieléctrica limita la corriente y evita arcos; encendido del orden de 10 kV.',
    'Song et al. (2023): decloración de PVC con energía de activación aparente de 23,62 kJ/mol con plasma frente a 137,09 kJ/mol con pirólisis (5,8 veces menor).',
    'Siciliano et al. (2016): en avellanas, la temperatura se incrementó en hasta 28,9 °C con 1 000 W y 12 min. Lacombe et al. (2017) y Niemira et al. (2018) verificaron la condición no térmica con termografía infrarroja.',
    'Puente-Díaz (2024): especies reactivas O, O₃, OH•, H₂O₂ y NOₓ, más UV; en Gram negativas predominarían la fuga de contenido celular y el daño del ADN. Burducea et al. (2023): en un chorro de helio se identificaron NO, OH, N₂, N₂⁺ y O.',
    'Dasan y Boyaci (2018): 4,02 log en jugo de manzana frente a 1,43 log en jugo de tomate. Ott et al. (2022): menor eficacia a mayor masa. Niemira et al. (2018): alejar de 5 a 7,5 cm restó 0,45 y 0,44 ciclos con 5 y 10 s; sin diferencia a los 15 s.',
    'Discusión del informe: E = P·t debe normalizarse en kJ/kg y kJ/kg por ciclo logarítmico. Yepez et al. (2022): la regulación exige monitoreo, control del proceso y protección de los trabajadores.',
  ],
};

const CASO = 'kilonzo_ecoli';

export const PASOS = [
  {
    id: 'pregunta',
    titulo: 'La pregunta del experimento',
    fase: 'Pregunta',
    duracionSeg: 60,
    acciones: {
      vista: 'general', caso: CASO, proceso: 'reposo',
      tarjeta: {
        titulo: 'Pregunta del experimento',
        lineas: [
          'Pregunta: ¿cuánto aumenta la reducción de E. coli sobre manzana al alargar la exposición a una DBD de 200 W, de 30 a 240 s?',
          'Condición: ¿la muestra se mantiene sin calentarse?',
          'Referencia: Kilonzo-Nthenge et al. (2018), Tabla 3',
          'Escala: banco DBD de laboratorio, presión atmosférica, por lotes',
        ],
      },
    },
    textoPantalla:
      'Los datos vienen solo de la revisión; equipos y dimensiones son supuestos de ingeniería. «Pirólisis en frío» es un término de trabajo: el plasma rompe enlaces sin calentar el material. PVC: energía de activación de 23,62 kJ/mol con plasma frente a 137,09 con pirólisis.',
    guionOral:
      'Les presento un banco de plasma frío. Sus datos vienen solo de nuestra revisión bibliográfica; los equipos y sus dimensiones son supuestos de ingeniería. Lo recorreremos como un experimento de laboratorio. Primero, una precisión. La pirólisis es descomposición térmica en ausencia de oxígeno. El plasma frío no calienta el material en su conjunto: rompe enlaces con electrones energéticos, especies reactivas y radiación UV, y en la mayoría de los estudios hay oxígeno. Por eso «pirólisis en frío» es un término de trabajo. La analogía tiene respaldo: al declorar PVC, la energía de activación aparente fue 5,8 veces menor con plasma que con pirólisis. Nuestra pregunta está en la tarjeta: ¿cuánto aumenta la reducción de E. coli sobre una manzana si alargamos la exposición a una DBD de 200 vatios, de 30 a 240 segundos? ¿Y la muestra sigue fría?',
    mensajeClave: 'Todo el recorrido responde una sola pregunta medible; «pirólisis en frío» es un término de trabajo con respaldo en la decloración de PVC.',
    queMirar: 'Con un gesto amplio, el banco completo (gases, celda en la jaula e instrumentos); después, la tarjeta con la pregunta y la comparación del PVC en la barra inferior.',
  },
  {
    id: 'hipotesis',
    titulo: 'Hipótesis: electrones calientes, gas frío',
    fase: 'Hipótesis',
    duracionSeg: 65,
    acciones: {
      vista: 'reactor', corte: true, caso: CASO, proceso: 'reposo',
      tarjeta: {
        titulo: 'Fundamento de la hipótesis · Ecuación 4',
        lineas: [
          'Tₑ = E/k_B: 1 eV ≈ 11 605 K; 10 eV ≈ 116 045 K',
          'Gas a 298 K: Tₑ/T_g entre 39 y 389',
          'Equipos para alimentos: gas entre 30 y 60 °C',
          'Hipótesis: más tiempo → mayor reducción, hasta ≈ 5,5 log',
          'Cinética: Weibull en el estudio; no se supone una recta',
        ],
      },
    },
    textoPantalla:
      'Hipótesis: si la energía va a los electrones y no al alimento, más tiempo de exposición dará mayor reducción de E. coli, hasta el orden de 5,5 log, sin que el gas supere 60 °C. La temperatura de la manzana se medirá.',
    guionOral:
      'La hipótesis nace del fundamento físico. En un plasma frío, los electrones alcanzan entre 1 y 10 electronvoltios, mientras las partículas pesadas siguen cerca de la temperatura ambiente. Con la Ecuación 4, temperatura igual a energía sobre la constante de Boltzmann, 1 electronvoltio equivale a unos 11 605 kelvin y 10 electronvoltios a 116 045. Con el gas a 298 kelvin, los electrones están entre 39 y 389 veces más calientes. Nuestra hipótesis: si la energía llega a los electrones y no al alimento, alargar la exposición aumentará la reducción de E. coli hasta el orden de 5,5 ciclos logarítmicos, el valor de Kilonzo-Nthenge. El gas no debería superar los 60 grados de los equipos para alimentos, y la temperatura de la manzana la mediremos, porque la revisión no la informa. No suponemos una recta: los autores ajustaron una distribución de Weibull.',
    mensajeClave: 'La hipótesis se deduce del no equilibrio térmico: la energía llega a los electrones, no al alimento.',
    queMirar: 'La tarjeta de arriba abajo; luego, en el corte de la celda, el espacio entre las barreras donde se formará el plasma.',
  },
  {
    id: 'diseno',
    titulo: 'Qué cambiamos, qué medimos, qué fijamos',
    fase: 'Diseño experimental',
    duracionSeg: 60,
    acciones: {
      vista: 'general', caso: CASO, proceso: 'reposo',
      tarjeta: {
        titulo: 'Diseño experimental',
        lineas: [
          'Independiente: tiempo de exposición, 30 a 240 s',
          'Dependientes: R = log₁₀(N₀/N), temperatura de la muestra y del gas, E = P·t',
          'Controladas: 200 W, gas, humedad, distancia d, masa e inóculo',
          'Control: cámara con gas y sin alta tensión (propuesta de diseño)',
          'Réplicas: al menos 3 por tiempo, en orden aleatorio (propuesta de diseño)',
        ],
      },
    },
    textoPantalla:
      'Se manipula una sola variable: el tiempo. Se miden la reducción logarítmica, la temperatura y la energía; lo demás queda fijo. Control sin descarga y al menos tres réplicas: propuesta de diseño, no dato del informe.',
    guionOral:
      'En este experimento cambiamos una sola cosa: el tiempo de exposición, entre 30 y 240 segundos. Medimos tres respuestas. Primero, la reducción logarítmica, la Ecuación 1: el logaritmo de la población inicial sobre la final, obtenido por recuento en placa. Segundo, la temperatura de la muestra y del gas, para comprobar que el proceso es no térmico. Tercero, la energía por lote. Todo lo demás queda fijo: 200 vatios, gas, humedad, distancia, masa e inóculo, porque la eficacia depende de variables de proceso, de producto y microbiológicas. Dos elementos son propuesta nuestra, no datos del informe. Un control: manzanas inoculadas en la cámara, con el mismo gas y tiempo, pero sin alta tensión; así separamos el efecto del plasma del efecto del gas y la manipulación. Y al menos tres réplicas por tiempo, en orden aleatorio.',
    mensajeClave: 'Se cambia una sola variable y se fija el resto; el control sin descarga y las réplicas son propuesta de diseño.',
    queMirar: 'La tarjeta línea por línea, marcando con la mano «propuesta de diseño».',
  },
  {
    id: 'montaje',
    titulo: 'Montaje: la celda DBD por dentro',
    fase: 'Montaje',
    duracionSeg: 55,
    acciones: { vista: 'despiece', despiece: 0.8, caso: CASO, proceso: 'reposo', resaltar: 'barreraSup' },
    textoPantalla:
      'Celda DBD plano-paralela: electrodos de Ø 100 mm y barreras de vidrio de sílice que limitan la corriente y evitan arcos. El elevador micrométrico fija la separación d entre 1 y 20 mm. Materiales, salvo la sílice, y dimensiones: supuestos de ingeniería.',
    guionOral:
      'Ahora el montaje. Separamos la celda en sus quince piezas numeradas. Arriba están el pasamuros y el electrodo de alta tensión; abajo, el electrodo de tierra, ambos de aluminio, un supuesto del banco. Entre ellos está lo que define a una DBD: la barrera dieléctrica, aquí de vidrio de sílice, uno de los materiales que lista la revisión. La barrera limita la corriente y evita los arcos; el modelo lo representa con filamentos breves, en forma esquemática. La muestra, pieza seis, descansa sobre un elevador micrométrico que fija la separación entre 1 y 20 milímetros. Esa distancia es una variable controlada, porque cambia las especies que llegan al alimento. Las ventanas de cuarzo e infrarroja existen para medir sin abrir la cámara.',
    mensajeClave: 'La barrera dieléctrica define la DBD, y cada ventana de la cámara existe para un instrumento.',
    queMirar: 'La barrera superior resaltada (pieza 4) y su ficha; los electrodos (3 y 8), la muestra (6), el elevador (9) y las ventanas (12 y 13).',
  },
  {
    id: 'procedimiento',
    titulo: 'Procedimiento: masa, gas, purga y puerta',
    fase: 'Procedimiento',
    duracionSeg: 55,
    acciones: { vista: 'gases', caso: CASO, proceso: 'purga', resaltar: 'panelMFC' },
    textoPantalla:
      'Secuencia: pesar e inocular → fijar d → cerrar la puerta con enclavamiento → purgar midiendo caudal y humedad → alta tensión el tiempo asignado → post-purga → recuento en placa. Gas: aire, supuesto (la revisión no lo informa).',
    guionOral:
      'El procedimiento sigue un orden fijo, que ven abajo en pantalla. Primero pesamos la muestra en una balanza de 0,01 gramos: la masa cambia la eficacia y sirve para calcular la energía específica. Luego fijamos la distancia y cerramos la puerta de la jaula, que tiene enclavamiento. Después purgamos la cámara. Los tres controladores de caudal arman la mezcla y el sensor MT-201 registra la humedad. ¿Por qué medirla? Porque el radical hidroxilo nace de la disociación del agua, y el gas, la humedad y la distancia definen la mezcla de especies reactivas. Usamos aire sintético, pero es un supuesto: la revisión no informa el gas de este estudio. Al final vendrán la post-purga, que retira el ozono, y el recuento en placa.',
    mensajeClave: 'Un orden fijo hace comparables los lotes; el gas y la humedad se miden porque determinan las especies reactivas.',
    queMirar: 'Los cilindros, el panel FIC-101 a 103 resaltado, el humidificador y el sensor MT-201; seguir la purga por la tubería hasta la celda.',
  },
  {
    id: 'medicion-electrica',
    titulo: 'Medición I: tensión, corriente y energía',
    fase: 'Medición',
    duracionSeg: 60,
    acciones: { vista: 'instrumentos', caso: CASO, proceso: 'tratamiento', avance: 0.15, panel: 'instrumentos', tab: 'electrico', resaltar: 'capMedida' },
    textoPantalla:
      'Alta tensión encendida. Sonda AT: tensión. Bobina de Rogowski: corriente. Condensador Cm: carga. La figura de Lissajous da la potencia; con E = P·t y la masa se informan kJ/kg y kJ/kg por ciclo log. Valores del banco: supuestos.',
    guionOral:
      'Encendemos la alta tensión. En el modelo, con aire y 3 milímetros de separación, el encendido ocurre cerca de 14,7 kilovoltios, y con 21,7 kilovoltios a 10 kilohercios la descarga entrega unos 200 vatios, igualados a los 200 que informa el estudio. La revisión no precisa si es potencia de entrada o de descarga, así que es un supuesto, coherente con el encendido del orden de 10 kilovoltios que la revisión informa para la DBD. ¿Para qué tres instrumentos eléctricos? La sonda mide la tensión; la bobina de Rogowski, la corriente; y el condensador de medida, la carga. Tensión contra carga dibuja la figura de Lissajous, que entrega la potencia real. Con energía igual a potencia por tiempo, dividida por la masa y por los ciclos logrados, cumplimos lo que pide el informe: reportar la energía específica.',
    mensajeClave: 'Medir tensión, corriente y carga permite informar la energía específica que el informe pide para comparar procesos.',
    queMirar: 'La sonda, la bobina y el condensador resaltado; en la pestaña Eléctrico, la figura de Lissajous, la potencia y la energía del lote. La baliza encendida.',
  },
  {
    id: 'medicion-plasma',
    titulo: 'Medición II: especies reactivas y temperatura',
    fase: 'Medición',
    duracionSeg: 65,
    acciones: { vista: 'descarga', corte: true, lupa: true, caso: CASO, proceso: 'tratamiento', avance: 0.5, panel: 'instrumentos', tab: 'gas' },
    textoPantalla:
      'Lupa esquemática, sin escala. Electrones → O, O₃, OH•, H₂O₂, NOₓ y UV sobre la superficie. Espectrómetro: especies (cualitativo); monitor UV: ozono. Ozono y temperaturas del panel: valores ilustrativos del modelo.',
    guionOral:
      'Acerquémonos a la descarga. La lupa es esquemática, sin escala. Los choques de los electrones con el gas y el agua inician una cadena que forma oxígeno atómico, ozono, radical hidroxilo, peróxido de hidrógeno y óxidos de nitrógeno, además de radiación UV. Esa mezcla llega a la superficie. Según la revisión base, en las bacterias Gram negativas, grupo al que pertenece E. coli, predominarían la fuga de contenido celular y el daño del ADN. El espectrómetro buscaría especies como NO, OH, N2, N2 más y O, identificadas en un chorro de helio; en aire, la mezcla puede ser otra. El monitor UV mide el ozono. La temperatura se mide en tres puntos: gas, superficie y contacto; las curvas del panel son ilustrativas. El sustrato sí puede calentarse: en avellanas, con 1 000 vatios por 12 minutos, la temperatura se incrementó en hasta 28,9 grados.',
    mensajeClave: 'Las especies reactivas son el mecanismo de daño, no el calor; aun así, la temperatura se mide en tres puntos.',
    queMirar: 'En la lupa: electrones blancos, filamentos, especies de colores y células que se dañan. Luego la pestaña Gas y temperatura, marcando que sus valores son ilustrativos.',
  },
  {
    id: 'resultado',
    titulo: 'Resultado de referencia: hasta 5,5 ciclos logarítmicos',
    fase: 'Resultado',
    duracionSeg: 65,
    acciones: { vista: 'reactor', corte: true, caso: CASO, proceso: 'final', panel: 'instrumentos', tab: 'resultado' },
    textoPantalla:
      'Valor de referencia, no medición propia: 5,5 log UFC/cm² en E. coli como máximo entre 30 y 240 s (99,9997 %), con DBD de 200 W. Su ubicación a los 240 s y la recta de primer orden son supuestos del modelo.',
    guionOral:
      'Al completar el tiempo, el panel muestra el resultado. Atención: no lo medimos nosotros. Es el valor que informaron Kilonzo-Nthenge y colaboradores con una DBD de 200 vatios: hasta 5,5 ciclos logarítmicos en E. coli y 5,3 en Salmonella. Con la Ecuación 2, 5,5 ciclos equivalen a inactivar el 99,9997 % de la población. La literatura respalda esa magnitud dentro de 30 a 240 segundos, pero la revisión no informa cómo cambia la reducción con el tiempo, ni en qué momento se alcanzó el máximo. Esa relación es justamente lo que mediría el experimento, restando el control sin descarga. Ahora, la lectura crítica: el punto se ubica a los 240 segundos y la recta del panel es de primer orden; ambos son supuestos del modelo, porque los autores usaron Weibull. La temperatura de la manzana tampoco está informada: queda por medir.',
    mensajeClave: 'El valor viene de la literatura: respalda la magnitud alcanzable, no la relación con el tiempo, que es lo que mediría el experimento.',
    queMirar: 'En la pestaña Resultado, el punto en 5,5 log y el aviso que separa el dato informado de la trayectoria supuesta.',
  },
  {
    id: 'analisis',
    titulo: 'Análisis: límites de la comparación',
    fase: 'Análisis',
    duracionSeg: 65,
    acciones: {
      vista: 'reactor', corte: true, caso: CASO, proceso: 'final', resaltar: 'elevador',
      tarjeta: {
        titulo: 'Limitaciones y validez',
        lineas: [
          'Distancia: el estudio informa 35 mm (se interpreta como distancia); el banco llega a 20 mm',
          'Gas: no informado; el banco usa aire (supuesto)',
          'Clasificación: corona en la revisión base; DBD en la fuente primaria',
          'Matriz: 4,02 log en jugo de manzana frente a 1,43 log en jugo de tomate',
          'Masa y distancia: también cambian la eficacia',
        ],
      },
    },
    textoPantalla:
      'Cobertura parcial: el estudio informa 35 mm y el banco llega a 20 mm; el gas no se informa. La eficacia es del sistema plasma–matriz–microorganismo: un resultado sobre manzana no se extrapola a otra matriz.',
    guionOral:
      'El análisis empieza por las limitaciones. Primera: el estudio informa 35 milímetros, que interpretamos como la distancia de tratamiento, y nuestro elevador llega a 20; no reproducimos exactamente esa condición. Segunda: la revisión no informa el gas; usar aire es un supuesto. Tercera: la revisión base clasificó este equipo como corona, y la fuente primaria lo describe como DBD. La lección general: la eficacia no es una propiedad del equipo, sino del sistema plasma, matriz y microorganismo. Con el mismo chorro de plasma, E. coli bajó 4,02 ciclos en jugo de manzana y solo 1,43 en jugo de tomate: unas 389 veces más sobrevivientes. En queso, más masa significó menos eficacia. En biopelículas, alejar la muestra de 5 a 7,5 centímetros restó 0,45 ciclos con 5 segundos; a los 15 segundos, la diferencia desapareció. Por eso fijamos y medimos cada variable.',
    mensajeClave: 'La eficacia pertenece al sistema plasma–matriz–microorganismo, y el banco cubre el caso de referencia solo en forma parcial.',
    queMirar: 'El elevador resaltado (límite de 20 mm) y su ficha; después, la tarjeta de limitaciones línea por línea.',
  },
  {
    id: 'conclusion',
    titulo: 'Conclusión del experimento',
    fase: 'Conclusión',
    duracionSeg: 60,
    acciones: {
      vista: 'general', caso: CASO, proceso: 'final', puerta: 'abrir',
      tarjeta: {
        titulo: 'Conclusión',
        lineas: [
          'Factibilidad: la pregunta es medible en un banco DBD de laboratorio',
          'Referencia: hasta 5,5 log sobre manzana; no extrapolable',
          'Validez: control sin descarga y réplicas (propuesta), verificación térmica y energía específica',
          'Energía: informar kJ/kg y kJ/kg por ciclo logarítmico',
          '«Pirólisis en frío»: romper enlaces con electrones, no con calor',
        ],
      },
    },
    textoPantalla:
      'Cámara purgada y puerta abierta: el enclavamiento mantiene la fuente sin tensión y la muestra va al recuento en placa. La referencia anticipa hasta 5,5 log, válido solo para esa matriz, ese equipo y esa distancia.',
    guionOral:
      'Con la cámara ya purgada, abrimos la puerta. El enclavamiento, un supuesto de diseño del banco, mantiene la fuente sin tensión; responde a la protección de los trabajadores que exige la regulación. La manzana sale al recuento en placa, donde se obtiene la reducción. ¿Qué concluimos? Primero, la pregunta es medible: el banco permite variar solo el tiempo y medir reducción, temperatura y energía. Segundo, la literatura anticipa hasta 5,5 ciclos sobre manzana, pero ese valor no se extrapola a otra matriz, otro gas u otra distancia. Tercero, la validez exige control sin descarga y réplicas, nuestra propuesta de diseño, además de verificación térmica y energía específica, que el informe pide para comparar procesos y escalar. Para la ingeniería ambiental, podría sustituir sanitizantes químicos. Y «pirólisis en frío» resume la idea: romper enlaces con electrones, no con calor. Muchas gracias.',
    mensajeClave: 'El experimento es factible, pero su resultado vale solo para sus condiciones; la validez depende del control, las réplicas, la verificación térmica y la energía específica.',
    queMirar: 'La puerta abierta de la jaula (sin baliza ni descarga) y la tarjeta de conclusión; cerrar con un gesto hacia el banco completo.',
  },
];
