# Ficha técnica · Banco DBD de pirólisis en frío

Documento generado por `build.mjs` a partir de `src/data/`. Respaldo «Revisión» = dato o requisito tomado del informe del seminario; «Ingeniería» = decisión de diseño propia, declarada como supuesto.

## Especificaciones

| Parámetro | Valor de diseño | Respaldo | Nota |
|---|---|---|---|
| Configuración | Descarga de barrera dieléctrica (DBD) plano-paralela, a presión atmosférica, por lotes; tratamiento abierto o dentro del envase | Revisión: Okyere et al. (2022); Feizollahi et al. (2021); Guo et al. (2015); Puente-Díaz (2024) | Sin equipo de vacío ni magnetrón: las dos partidas de mayor costo que la revisión asocia a los sistemas a baja presión y de microondas. |
| Tensión de la fuente | 0 a 30 kV pico, corriente alterna | Revisión: Okyere et al. (2022); Yadav y Roopesh (2020); Zheng et al. (2022) | Cubre el encendido de la DBD (del orden de 10 kV), el tratamiento en envase hasta 30 kV y el límite inferior de 30 kV del estudio de zearalenona. |
| Potencia de la fuente | Hasta 500 W | Revisión: Kilonzo-Nthenge et al. (2018); Casas-Junco et al. (2019); Song et al. (2023) | Incluye 30 W (café), 180 W (PVC) y 200 W (manzanas). Excluye 800 a 1 150 W (chorro de esporas y avellanas). |
| Frecuencia | 5 a 20 kHz | Ingeniería | La revisión no informa la frecuencia de las DBD; el chorro de Niemira et al. (2018) operó entre 23 y 48 kHz. |
| Electrodos | Aluminio, Ø 100 mm × 10 mm (área 78,5 cm²) | Ingeniería | Área pequeña para mantener la potencia dentro de 500 W; admite una placa Petri de 90 mm. |
| Barreras dieléctricas | Vidrio de sílice, Ø 130 mm × 2 mm, una sobre cada electrodo (εr ≈ 3,8) | Revisión: Okyere et al. (2022); Feizollahi et al. (2021) | Material de la lista de la revisión (sílice, cerámica, mica, esmalte o polímero). El borde sobresale 15 mm para evitar arcos por la orilla. |
| Separación barrera–muestra (d) | 1 a 20 mm, con plataforma micrométrica | Revisión: Niemira et al. (2018); Puente-Díaz (2024) | La distancia al electrodo modifica la mezcla de especies y la eficacia; por eso se mide y se fija. |
| Gases de trabajo | Aire, N₂, O₂, CO₂, Ar, He y sus mezclas (3 controladores de caudal másico) | Revisión: Okyere et al. (2022); Dharini et al. (2023) | El gas determina las especies reactivas. Las mezclas con 0,1 a 1 % de O₂ requieren un controlador de bajo rango o un cilindro premezclado. |
| Humedad del gas | 0 a 90 % HR, con burbujeador y derivación | Revisión: Puente-Díaz (2024) | La humedad modifica la mezcla de especies; el radical OH• proviene de la disociación del agua. |
| Cámara | Policarbonato, Ø 180 mm interior × 170 mm (≈ 3,6 L útiles); tapa y base de PTFE | Ingeniería | El policarbonato permite observar la descarga y bloquea la mayor parte de la radiación UV; el PTFE resiste el ozono. |
| Temperatura del gas esperada | 30 a 60 °C | Revisión: Jiang et al. (2022) | Intervalo informado para equipos de plasma frío aplicados a alimentos. |
| Huella | Mesón de 1,8 × 0,75 m; celda de 0,42 × 0,42 × 0,46 m | Ingeniería | Escala de banco: una sola persona lo opera en un laboratorio docente. |

## Lista de partes

| N.º | Pieza | Grupo | Material | Función | Respaldo |
|---|---|---|---|---|---|
| 1 | Pasamuros de alta tensión | Reactor | PTFE con varilla de latón | Lleva la alta tensión a través de la tapa sin descargas a tierra. | Ingeniería |
| 2 | Tapa superior con puerto de salida | Reactor | PTFE, junta tórica de FKM | Cierra la cámara y aloja la salida de gas hacia el monitor de ozono. | Ingeniería |
| 3 | Electrodo de alta tensión | Reactor | Aluminio, Ø 100 × 10 mm | Electrodo conectado a la fuente de corriente alterna. | Revisión: Puente-Díaz (2024) |
| 4 | Barrera dieléctrica superior | Reactor | Vidrio de sílice, Ø 130 × 2 mm | Limita la corriente y evita la formación de arcos. | Revisión: Okyere et al. (2022); Feizollahi et al. (2021) |
| 5 | Difusor anular de gas | Reactor | Tubo de PFA perforado | Reparte el gas de trabajo alrededor de la zona de descarga. | Ingeniería |
| 6 | Muestra en placa de vidrio o en envase | Reactor | Placa Petri de 90 mm o envase polimérico sellado | Sustrato tratado; en modo envase, el envase actúa como barrera adicional. | Revisión: Yadav y Roopesh (2020); Okyere et al. (2022) |
| 7 | Barrera dieléctrica inferior | Reactor | Vidrio de sílice, Ø 130 × 2 mm | Segunda barrera; aísla la muestra del electrodo de tierra. | Revisión: Okyere et al. (2022) |
| 8 | Electrodo de tierra | Reactor | Aluminio, Ø 100 × 10 mm | Electrodo conectado a tierra a través de la bobina de Rogowski y el condensador de medida. | Revisión: Puente-Díaz (2024) |
| 9 | Plataforma elevadora micrométrica | Reactor | PTFE y husillo de nailon, cabezal de 0,01 mm | Fija la separación d entre la barrera y la muestra (ZI-701). | Revisión: Niemira et al. (2018) |
| 10 | Base con puertos | Reactor | PTFE | Soporta la pila de electrodos; aloja la entrada de gas, el termopar y la conexión de tierra. | Ingeniería |
| 11 | Cuerpo de la cámara | Reactor | Policarbonato, Ø 180 × 170 mm | Contiene la atmósfera de trabajo y permite observar la descarga. | Revisión: Puente-Díaz (2024) |
| 12 | Ventana de cuarzo para OES | Reactor | Cuarzo, Ø 25 mm | Deja pasar la emisión UV y visible hacia la fibra del espectrómetro. | Revisión: Burducea et al. (2023); Hueso et al. (2009) |
| 13 | Ventana infrarroja | Reactor | Seleniuro de cinc, Ø 25 mm | Permite la termografía de la superficie de la muestra durante el tratamiento. | Revisión: Lacombe et al. (2017); Niemira et al. (2018) |
| 14 | Jaula de Faraday | Reactor | Malla de aluminio sobre perfiles, conectada a tierra | Contiene el campo electromagnético y separa al operador de la alta tensión. | Revisión: Yepez et al. (2022) |
| 15 | Puerta con enclavamiento (XS-801) | Reactor | Malla de aluminio; interruptor de seguridad | Al abrirse corta la alta tensión. | Revisión: Yepez et al. (2022) |
| — | Cilindro de aire sintético | Gases | Acero, 10 L | Gas de trabajo más usado en los estudios revisados. | Revisión: Durek et al. (2018); Liu et al. (2023) |
| — | Cilindro de N₂ | Gases | Acero, 10 L | Base de las mezclas N₂/O₂. | Revisión: Ozen et al. (2022); Siciliano et al. (2016) |
| — | Cilindro de O₂ | Gases | Acero, 10 L | Fuente de especies reactivas de oxígeno. | Revisión: Gök et al. (2019); Nikmaram et al. (2023) |
| — | Cilindro auxiliar (CO₂, Ar o He) | Gases | Acero, 10 L | Gas intercambiable para CO₂ o gases nobles. | Revisión: Durek et al. (2018); Hajhoseini et al. (2020); Casas-Junco et al. (2019) |
| — | Panel de controladores de caudal (FIC-101 a 103) | Gases | 3 controladores de caudal másico de 0 a 5 L/min | Dosifican cada gas para fijar la composición de la mezcla. | Revisión: Dharini et al. (2023); Puente-Díaz (2024) |
| — | Humidificador de burbujeo con derivación | Gases | Frasco lavador de vidrio, 500 mL; válvula de aguja | Ajusta la humedad del gas de entrada. | Revisión: Puente-Díaz (2024) |
| — | Sensor de humedad y temperatura (MT-201) | Gases | Sonda capacitiva | Mide la humedad relativa del gas que entra a la cámara. | Revisión: Puente-Díaz (2024) |
| — | Tubería de PFA de 6 mm | Gases | PFA translúcido | Conduce los gases; resiste el ozono. | Ingeniería |
| — | Fuente de alta tensión | Eléctrico | 0 a 30 kV pico, 5 a 20 kHz, 500 W, límite de corriente | Alimenta el electrodo de alta tensión. | Revisión: Okyere et al. (2022); Yadav y Roopesh (2020) |
| — | Cable de alta tensión | Eléctrico | Silicona, 40 kV CC | Une la fuente con el pasamuros. | Ingeniería |
| — | Sonda de alta tensión 1000:1 (EI-401) | Eléctrico | Divisor resistivo-capacitivo, 40 kV | Mide la tensión aplicada. | Revisión: Okyere et al. (2022) |
| — | Bobina de Rogowski (II-402) | Eléctrico | Bobina sin núcleo sobre el cable de tierra | Mide la corriente, incluidos los pulsos de microdescarga. | Ingeniería |
| — | Condensador de medida Cm (JI-403) | Eléctrico | 100 nF en serie con el electrodo de tierra | Mide la carga transferida; la figura de Lissajous Q–V da la energía por ciclo y la potencia. | Ingeniería |
| — | Osciloscopio de 4 canales | Eléctrico | 100 MHz | Registra tensión, corriente y carga. | Ingeniería |
| — | Espectrómetro de emisión óptica (AI-501) | Instrumentos | Espectrómetro compacto de 200 a 900 nm con fibra óptica | Identifica especies excitadas (NO, OH, N₂, N₂⁺, O). | Revisión: Burducea et al. (2023); Hueso et al. (2009) |
| — | Cámara termográfica (TI-302) | Instrumentos | Microbolómetro, 8 a 14 µm | Verifica la condición no térmica en la superficie de la muestra. | Revisión: Lacombe et al. (2017); Niemira et al. (2018); Siciliano et al. (2016) |
| — | Termopar tipo K a la salida (TT-301) | Instrumentos | Vaina de acero inoxidable, fuera de la zona de descarga | Mide la temperatura del gas (30 a 60 °C esperados). | Revisión: Jiang et al. (2022) |
| — | Sensor de temperatura de fibra óptica (TT-303) | Instrumentos | Sonda de fibra con punta de GaAs | Mide la temperatura en contacto con la muestra sin perturbar el campo eléctrico. | Ingeniería |
| — | Monitor de ozono por absorción UV (AI-502) | Instrumentos | Celda de absorción a 254 nm | Mide el ozono a la salida de la cámara. | Revisión: Ott et al. (2022) |
| — | Destructor catalítico de ozono | Instrumentos | Cartucho de dióxido de manganeso | Convierte el ozono residual en O₂ antes de la extracción. | Revisión: Yepez et al. (2022) |
| — | Brazo de extracción localizada | Instrumentos | Ducto articulado de 75 mm | Retira los gases de salida del área de trabajo. | Revisión: Yepez et al. (2022) |
| — | Sensor de ozono ambiental (AI-503) | Instrumentos | Sensor electroquímico | Alarma y corte de alta tensión ante fugas en el puesto del operador. | Revisión: Yepez et al. (2022) |
| — | Balanza de 0,01 g (WI-601) | Instrumentos | Celda de carga | Pesa la muestra para calcular la energía específica (kJ/kg). | Revisión: Ott et al. (2022) |
| — | Computador de adquisición | Instrumentos | Registro de todas las señales | Calcula E = P·t, la energía específica y registra el lote. | Revisión: Yepez et al. (2022) |
| — | Paro de emergencia (HS-802) | Seguridad | Pulsador de seta | Corta la alta tensión de inmediato. | Revisión: Yepez et al. (2022) |
| — | Baliza de alta tensión | Seguridad | Luz ámbar | Indica que la alta tensión está activa. | Ingeniería |

## Instrumentación

| Etiqueta | Variable | Principio | Rango | Ubicación | Por qué se mide |
|---|---|---|---|---|---|
| FIC-101 a 103 | Caudal de cada gas | Controlador de caudal másico térmico | 0 a 5 L/min | Panel de gases | La composición del gas define las especies reactivas. Fuente: Dharini et al. (2023); Puente-Díaz (2024). |
| MT-201 | Humedad relativa y temperatura del gas de entrada | Sonda capacitiva | 0 a 100 % HR | Entrada de la cámara | La humedad modifica la mezcla de especies; el OH• proviene del agua. Fuente: Puente-Díaz (2024). |
| EI-401 | Tensión aplicada | Sonda de alta tensión 1000:1 | 0 a 40 kV | Salida de la fuente | El encendido de la DBD es del orden de 10 kV. Fuente: Okyere et al. (2022). |
| II-402 | Corriente de descarga | Bobina de Rogowski | Pulsos de ns a A | Cable de tierra | Registra las microdescargas y la corriente de desplazamiento. |
| JI-403 | Potencia y energía por lote | Figura de Lissajous Q–V con condensador de medida | 0 a 500 W | Rama de tierra | Permite informar E = P·t, kJ/kg y kJ/kg por ciclo logarítmico, como pide la discusión del informe. Fuente: Puente-Díaz (2024). |
| TT-301 | Temperatura del gas | Termopar tipo K | 0 a 200 °C | Salida de la cámara | Los equipos para alimentos operan con el gas entre 30 y 60 °C. Fuente: Jiang et al. (2022). |
| TI-302 | Temperatura superficial de la muestra | Termografía infrarroja | −20 a 150 °C | Ventana de ZnSe | La condición no térmica debe verificarse en cada proceso. Fuente: Lacombe et al. (2017); Niemira et al. (2018); Siciliano et al. (2016). |
| TT-303 | Temperatura en contacto con la muestra | Fibra óptica (GaAs) | −40 a 250 °C | Bajo la muestra | Medición de contacto inmune al campo eléctrico. |
| AI-501 | Espectro de emisión (especies excitadas) | Espectroscopía de emisión óptica | 200 a 900 nm | Ventana de cuarzo | Identifica NO, OH, N₂, N₂⁺ y O, como en los estudios revisados. Fuente: Burducea et al. (2023); Hueso et al. (2009). |
| AI-502 | Ozono a la salida | Absorción UV a 254 nm | 0 a 5 000 ppm | Línea de escape | Cuantifica una especie reactiva de larga vida, como la espectroscopía de absorción de Ott et al. (2022). Fuente: Ott et al. (2022). |
| AI-503 | Ozono ambiental | Sensor electroquímico | 0 a 1 ppm | Puesto del operador | Protección de los trabajadores. Fuente: Yepez et al. (2022). |
| WI-601 | Masa de la muestra | Celda de carga | 0 a 600 g, 0,01 g | Mesón | La masa cambia la eficacia y es la base de la energía específica. Fuente: Ott et al. (2022). |
| ZI-701 | Separación barrera–muestra | Cabezal micrométrico | 1 a 20 mm, 0,01 mm | Plataforma elevadora | La distancia al emisor modifica la eficacia. Fuente: Niemira et al. (2018). |
| KI-702 | Tiempo de exposición | Temporizador de la secuencia | 1 s a 60 min | Computador | La distancia y el tiempo interactúan. Fuente: Niemira et al. (2018). |
| XS-801 / HS-802 | Puerta y paro de emergencia | Enclavamiento y pulsador de seta | — | Jaula y mesón | La regulación exige sistemas confiables y protección de los trabajadores. Fuente: Yepez et al. (2022). |

### Análisis fuera de línea

| Análisis | Para qué | Fuente |
|---|---|---|
| Recuento en placa (UFC, UFP) | Reducción logarítmica (Ecuaciones 1 y 2) | Puente-Díaz (2024) |
| pH y acidez titulable | Cambios en jugos, sidra y almidón | Ozen et al. (2022); Dasan y Boyaci (2018) |
| Actividad de agua | Alimentos secos y harinas | Yadav y Roopesh (2020) |
| Color y fenoles totales | Calidad del alimento tratado | Dasan y Boyaci (2018); Liu et al. (2023) |
| Cromatografía de micotoxinas, conjugados y productos | Balance de masa de la toxina (Ecuación 5) | Chiappim et al. (2023); Nikmaram et al. (2023); Wielogorska et al. (2019) |
| Ensayo de toxicidad (Artemia, células HepG2) | Distinguir degradación de detoxificación | Casas-Junco et al. (2019); Wielogorska et al. (2019) |

## Cobertura de los casos de la literatura

| Caso | Equipo del estudio | Resultado informado | Cobertura | Motivos |
|---|---|---|---|---|
| E. coli · superficie de manzana (DBD). Kilonzo-Nthenge et al. (2018) | DBD | 5,5 log UFC/cm² (≥ 99,9995 %) | Parcial | Configuración DBD y 200 W dentro del alcance del banco. La distancia de 35 mm excede la separación máxima del banco (20 mm). Gas de trabajo no informado en la revisión. |
| Salmonella · superficie de manzana (DBD). Kilonzo-Nthenge et al. (2018) | DBD | 5,3 log UFC/cm² (≥ 99,9995 %) | Parcial | Configuración DBD y 200 W dentro del alcance del banco. La distancia de 35 mm excede la separación máxima del banco (20 mm). Gas de trabajo no informado en la revisión. |
| Salmonella · alimento liofilizado en envase. Yadav y Roopesh (2020); Puente-Díaz (2024) | Tratamiento dentro del envase | 3,03 log UFC/cm² (99,91 %)ᵃ | Dentro del alcance | Tratamiento dentro del envase y 30 kV dentro del alcance del banco. Gas de trabajo no informado en la revisión: el banco usa aire. |
| L. monocytogenes · queso fresco (efecto de la masa). Ott et al. (2022) | DBD de alto voltaje (HVACP) | Reducción significativa desde 1 min; menor eficacia a mayor masa | Parcial | Configuración DBD compatible con el banco. Tensión no informada en la revisión (equipo de alto voltaje). La revisión no informa una reducción numérica. |
| E. coli · sidra de manzana (90 % N₂ + 10 % O₂). Ozen et al. (2022) | Plasma atmosférico (configuración no informada en la revisión) | 5 log UFC/mL en 120 s o menos (99,999 %) | Parcial | Gas y tiempo dentro del alcance del banco. Configuración y tensión no informadas en la revisión. |
| S. aureus · pastırma (O₂). Gök et al. (2019) | No informada en la revisión | Hasta 0,85 log UFC/cm² (85,9 %)ᵇ | Parcial | Gases y tiempos dentro del alcance del banco. Configuración y tensión no informadas en la revisión. |
| S. aureus · pescado (Ar). Hajhoseini et al. (2020) | No informada en la revisión | 1,04 log con Ar (90,9 %) | Parcial | Gas y tiempo dentro del alcance del banco. Configuración y tensión no informadas en la revisión. |
| S. aureus · pescado (He). Hajhoseini et al. (2020) | No informada en la revisión | 0,55 log con He (71,8 %) | Parcial | Gas y tiempo dentro del alcance del banco. Configuración y tensión no informadas en la revisión. |
| A. niger y P. verrucosum · cebada (aire). Durek et al. (2018) | DCSBD (barrera superficial coplanar difusa) | 2,5 a 3 log (99,7 a 99,9 %) | Parcial | Gas (aire) y tiempo dentro del alcance del banco. Geometría de electrodos distinta (barrera superficial). |
| Hongos micotoxigénicos · café tostado (He). Casas-Junco et al. (2019) | No informada en la revisión | 4 log, inhibición completa (99,99 %) | Parcial | He y 30 W dentro del alcance del banco. Configuración no informada en la revisión. |
| E. coli · jugo de manzana (chorro). Dasan y Boyaci (2018) | Chorro de plasma (APPJ) | 4,02 log UFC/mL (99,99 %) | Fuera del alcance | Chorro de plasma: configuración distinta de la DBD del banco. |
| E. coli · jugo de tomate (chorro). Dasan y Boyaci (2018) | Chorro de plasma (APPJ) | 1,43 log UFC/mL (96,28 %) | Fuera del alcance | Chorro de plasma: configuración distinta de la DBD del banco. |
| E. coli O157:H7 · biopelícula en vidrio (chorro). Niemira et al. (2018) | Chorro de plasma (APPJ) | 3,29 log UFC/mL (99,95 %) | Fuera del alcance | Chorro de plasma: configuración distinta de la DBD del banco. Distancias de 5 y 7,5 cm fuera del intervalo de 1 a 20 mm. |
| Norovirus murino · arándanos (chorro). Lacombe et al. (2017) | Chorro de plasma (APPJ) | Más de 5 log UFP/g a 90 s (> 99,999 %) | Fuera del alcance | Chorro de plasma: configuración distinta de la DBD del banco. |
| Virus Tulane · arándanos (chorro). Lacombe et al. (2017) | Chorro de plasma (APPJ) | 3,5 log UFP/g a 120 s (99,97 %) | Fuera del alcance | Chorro de plasma: configuración distinta de la DBD del banco. |
| Esporas de B. cereus · esporas secas (chorro). Liu et al. (2023) | Chorro de plasma (APPJ) | Más de 2 log UFC/g (> 99 %) | Fuera del alcance | Chorro de plasma: configuración distinta. 800 W supera el límite de 500 W de la fuente del banco. 50 L/min supera la capacidad de los controladores de caudal. |
| Esporas de B. cereus · pimienta negra (chorro). Liu et al. (2023) | Chorro de plasma (APPJ) | Más de 1 log UFC/g (> 90 %) | Fuera del alcance | Chorro de plasma: configuración distinta. 800 W supera el límite de 500 W de la fuente del banco. |
| Micobiota natural · cebada (arco deslizante). Chiappim et al. (2023) | Chorro de arco deslizante | Cerca de 2 log UFC/g (≈ 99 %) | Fuera del alcance | Arco deslizante: configuración distinta de la DBD del banco. |
| Zearalenona · solución (DBD, cinética de primer orden). Zheng et al. (2022); Puente-Díaz (2024) | DBD | 98,28 % de degradación a 50 kV y 120 s | Parcial | Configuración DBD compatible. La fuente del banco llega a 30 kV, el límite inferior del estudio; el resultado informado corresponde a 50 kV. |
| Deoxinivalenol · cebada (arco deslizante). Chiappim et al. (2023) | Chorro de arco deslizante | Hasta 89 % a 20 min; aumento simultáneo del deoxinivalenol-3-glucósido | Fuera del alcance | Arco deslizante: configuración distinta de la DBD del banco. |
| Aflatoxinas · avellanas (N₂ + O₂). Siciliano et al. (2016) | Plasma atmosférico (configuración no informada en la revisión) | Más de 70 % a 1 000 W y 12 min | Parcial | Gases y tiempo dentro del alcance del banco. El resultado informado requiere 1 000 W; la fuente del banco entrega hasta 500 W. |
| AFB₁ y fumonisina B₁ · maíz (He + O₂, 6 kV). Wielogorska et al. (2019) | Plasma atmosférico (configuración no informada en la revisión) | Hasta 66 % | Parcial | Gas y 6 kV dentro del alcance del banco. Configuración no informada en la revisión. |
| Ocratoxina A · café tostado (He). Casas-Junco et al. (2019) | No informada en la revisión | 50 % a 30 min | Parcial | He y 30 W dentro del alcance del banco. Configuración no informada en la revisión. |
| Ocratoxina A · cebada (aire). Durek et al. (2018) | DCSBD (barrera superficial coplanar difusa) | −64,5 % a 3 min (56,9 a 20,2 ng/g)ᵇ | Parcial | Gas y tiempo dentro del alcance. Geometría de electrodos distinta (barrera superficial). |
| Ocratoxina A · cebada (CO₂ + O₂). Durek et al. (2018) | DCSBD (barrera superficial coplanar difusa) | −51,4 % a 3 min (49,0 a 23,8 ng/g)ᵇ | Parcial | Gases y tiempo dentro del alcance. Geometría de electrodos distinta y proporción de gases no informada. |
| Ocratoxina A · cebada (CO₂): la toxina aumenta. Durek et al. (2018) | DCSBD (barrera superficial coplanar difusa) | +48,8 % a 3 min (49,0 a 72,9 ng/g)ᵇ | Parcial | Gas y tiempo dentro del alcance. Geometría de electrodos distinta (barrera superficial). |
| Aflatoxina M₁ · agua (HVACP, 90 kV). Nikmaram et al. (2023) | Plasma atmosférico de alto voltaje (HVACP) | Tres productos principales de degradación, sin el doble enlace C8–C9 del anillo furofurano asociado a la bioactividad | Fuera del alcance | 90 kV triplica la tensión máxima del banco (30 kV). La mezcla de gases sí está disponible. |
| Decloración de PVC de desecho. Song et al. (2023) | Plasma no térmico (configuración no informada en la revisión) | 98,25 % de decloración a 180 W y 40 min | Parcial | 180 W dentro del alcance del banco. Configuración y gas no informados en la revisión. Requiere lavador de HCl en el escape. |

## Supuestos de ingeniería

- Frecuencia de 5 a 20 kHz: la revisión no la informa para las DBD.
- Tensión de ruptura del aire con la correlación empírica V = 24,4·d + 6,53·√d (kV, d en cm) y una rigidez dieléctrica relativa aproximada para N₂, O₂, CO₂, Ar y He.
- Potencia calculada con el modelo de capacitancias equivalentes de la DBD (ecuación de Manley).
- Temperaturas del gas y del sustrato con modelos de primer orden ilustrativos, anclados al intervalo de 30 a 60 °C (Jiang et al., 2022) y al aumento de 28,9 °C a 1 000 W y 12 min (Siciliano et al., 2016).
- Ozono: orden de magnitud ilustrativo; la revisión no informa concentraciones.
- Especies reactivas y espectro de emisión: indicadores cualitativos. Las posiciones de las bandas provienen de tablas espectroscópicas generales, no de la revisión.
- Trayectorias de inactivación y degradación de primer orden que pasan por el valor informado; solo Zheng et al. (2022) informan la cinética.
- Dimensiones, materiales no mencionados en la revisión (PTFE, policarbonato, aluminio, ZnSe), rangos de los controladores, destructor de MnO₂, bobina de Rogowski y condensador de medida.

## Seguridad

| Riesgo | Medida | Fuente |
|---|---|---|
| Alta tensión (hasta 30 kV) | Jaula de Faraday a tierra, enclavamiento de puerta, paro de emergencia, baliza y pértiga de descarga. | Yepez et al. (2022) |
| Ozono y NOₓ | Destructor catalítico, extracción localizada y sensor ambiental con corte de alta tensión. | Yepez et al. (2022) |
| Radiación UV | Cámara de policarbonato; la ventana de cuarzo queda cubierta por la fibra del espectrómetro. | Puente-Díaz (2024) |
| HCl al tratar PVC | Lavador alcalino adicional en el escape (96,44 % del cloro sale como HCl). | Song et al. (2023) |
| Calentamiento del sustrato | Termografía y fibra óptica; alarma si el gas supera 60 °C. | Siciliano et al. (2016); Jiang et al. (2022) |

## Referencias

- An, Q., Chen, D., Chen, H., Yue, X. y Wang, L. (2022). Modification of hydro-chars by non-thermal plasma to enhance co-anaerobic digestion and degradation of sewage sludge pyrolysis oil. Journal of Environmental Management, 307, Artículo 114531. https://doi.org/10.1016/j.jenvman.2022.114531
- Bezerra, J. de A., Lamarão, C. V., Sanches, E. A., Rodrigues, S., Fernandes, F. A. N., Ramos, G. L. P. A., Esmerino, E. A., Cruz, A. G. y Campelo, P. H. (2023). Cold plasma as a pre-treatment for processing improvement in food: A review. Food Research International, 167, Artículo 112663. https://doi.org/10.1016/j.foodres.2023.112663
- Burducea, I., Burducea, C., Mereuta, P.-E., Sirbu, S.-R., Iancu, D.-A., Istrati, M.-B., Straticiuc, M., Lungoci, C., Stoleru, V., Teliban, G.-C., Robu, T., Burducea, M. y Nastuta, A. V. (2023). Helium atmospheric pressure plasma jet effects on two cultivars of Triticum aestivum L. Foods, 12(1), Artículo 208. https://doi.org/10.3390/foods12010208
- Casas-Junco, P. P., Solís-Pacheco, J. R., Ragazzo-Sánchez, J. A., Aguilar-Uscanga, B. R., Bautista-Rosales, P. U. y Calderón-Santoyo, M. (2019). Cold plasma treatment as an alternative for ochratoxin A detoxification and inhibition of mycotoxigenic fungi in roasted coffee. Toxins, 11(6), Artículo 337. https://doi.org/10.3390/toxins11060337
- Chiappim, W., de Paula Bernardes, V., Almeida, N. A., Pereira, V. L., Bragotto, A. P. A., Cerqueira, M. B. R., Furlong, E. B., Pessoa, R. y Rocha, L. O. (2023). Effect of gliding arc plasma jet on the mycobiota and deoxynivalenol levels in naturally contaminated barley grains. International Journal of Environmental Research and Public Health, 20(6), Artículo 5072. https://doi.org/10.3390/ijerph20065072
- Dasan, B. G. y Boyaci, I. H. (2018). Effect of cold atmospheric plasma on inactivation of Escherichia coli and physicochemical properties of apple, orange, tomato juices, and sour cherry nectar. Food and Bioprocess Technology, 11(2), 334–343. https://doi.org/10.1007/s11947-017-2014-0
- Dharini, M., Jaspin, S. y Mahendran, R. (2023). Cold plasma reactive species: Generation, properties, and interaction with food biomolecules. Food Chemistry, 405, Artículo 134746. https://doi.org/10.1016/j.foodchem.2022.134746
- Durek, J., Schlüter, O., Roscher, A., Durek, P. y Fröhling, A. (2018). Inhibition or stimulation of ochratoxin A synthesis on inoculated barley triggered by diffuse coplanar surface barrier discharge plasma. Frontiers in Microbiology, 9, Artículo 2782. https://doi.org/10.3389/fmicb.2018.02782
- Dwivedi, P., Mishra, P. K., Mondal, M. K. y Srivastava, N. (2019). Non-biodegradable polymeric waste pyrolysis for energy recovery. Heliyon, 5(8), Artículo e02198. https://doi.org/10.1016/j.heliyon.2019.e02198
- Feizollahi, E., Misra, N. N. y Roopesh, M. S. (2021). Factors influencing the antimicrobial efficacy of dielectric barrier discharge (DBD) atmospheric cold plasma (ACP) in food processing applications. Critical Reviews in Food Science and Nutrition, 61(4), 666–689. https://doi.org/10.1080/10408398.2020.1743967
- Gök, V., Aktop, S., Özkan, M. y Tomar, O. (2019). The effects of atmospheric cold plasma on inactivation of Listeria monocytogenes and Staphylococcus aureus and some quality characteristics of pastırma—A dry-cured beef product. Innovative Food Science & Emerging Technologies, 56, Artículo 102188. https://doi.org/10.1016/j.ifset.2019.102188
- Guo, C., Tang, F., Chen, J., Wang, X., Zhang, S. y Zhang, X. (2015). Development of dielectric-barrier-discharge ionization. Analytical and Bioanalytical Chemistry, 407(9), 2345–2364. https://doi.org/10.1007/s00216-014-8281-y
- Hajhoseini, A., Sharifan, A. y Yousefi, H. R. (2020). Effects of atmospheric cold plasma on microbial growth of Listeria innocua and Staphylococcus aureus in ready-to-eat fish products. Iranian Journal of Fisheries Sciences, 19(1), 262–271. https://doi.org/10.22092/ijfs.2019.119545
- Hueso, J. L., Rico, V. J., Cotrino, J., Jiménez-Mateos, J. M. y González-Elipe, A. R. (2009). Water plasmas for the revalorisation of heavy oils and cokes from petroleum refining. Environmental Science & Technology, 43(7), 2557–2562. https://doi.org/10.1021/es900236b
- Jiang, H., Lin, Q., Shi, W., Yu, X. y Wang, S. (2022). Food preservation by cold plasma from dielectric barrier discharges in agri-food industries. Frontiers in Nutrition, 9, Artículo 1015980. https://doi.org/10.3389/fnut.2022.1015980
- Kaushik, N., Mitra, S., Baek, E. J., Nguyen, L. N., Bhartiya, P., Kim, J. H., Choi, E. H. y Kaushik, N. K. (2023). The inactivation and destruction of viruses by reactive oxygen species generated through physical and cold atmospheric plasma techniques: Current status and perspectives. Journal of Advanced Research, 43, 59–71. https://doi.org/10.1016/j.jare.2022.03.002
- Keramat, M. y Golmakani, M.-T. (2025). Cold plasma as an emerging catalytic route for oil modification. Food Chemistry: X, 27, Artículo 102493. https://doi.org/10.1016/j.fochx.2025.102493
- Khatibi, M., Nahil, M. A. y Williams, P. T. (2025). Pyrolysis/non-thermal plasma/catalysis processing of refuse-derived fuel for upgraded oil and gas production. Waste and Biomass Valorization, 16(6), 3267–3294. https://doi.org/10.1007/s12649-024-02866-w
- Kilonzo-Nthenge, A., Liu, S., Yannam, S. y Patras, A. (2018). Atmospheric cold plasma inactivation of Salmonella and Escherichia coli on the surface of Golden Delicious apples. Frontiers in Nutrition, 5, Artículo 120. https://doi.org/10.3389/fnut.2018.00120
- Lacombe, A., Niemira, B. A., Gurtler, J. B., Sites, J., Boyd, G., Kingsley, D. H., Li, X. y Chen, H. (2017). Nonthermal inactivation of norovirus surrogates on blueberries using atmospheric cold plasma. Food Microbiology, 63, 1–5. https://doi.org/10.1016/j.fm.2016.10.030
- Liu, Y., Sun, Y., Wang, Y., Zhao, Y., Duan, M., Wang, H., Dai, R., Liu, Y., Li, X. y Jia, F. (2023). Inactivation mechanisms of atmospheric pressure plasma jet on Bacillus cereus spores and its application on low-water activity foods. Food Research International, 169, Artículo 112867. https://doi.org/10.1016/j.foodres.2023.112867
- Misra, N. N., Yadav, B., Roopesh, M. S. y Jo, C. (2019). Cold plasma for effective fungal and mycotoxin control in foods: Mechanisms, inactivation effects, and applications. Comprehensive Reviews in Food Science and Food Safety, 18(1), 106–120. https://doi.org/10.1111/1541-4337.12398
- Niemira, B. A., Boyd, G. y Sites, J. (2018). Cold plasma inactivation of Escherichia coli O157:H7 biofilms. Frontiers in Sustainable Food Systems, 2, Artículo 47. https://doi.org/10.3389/fsufs.2018.00047
- Nikmaram, N., Brückner, L., Cramer, B., Humpf, H.-U. y Keener, K. (2023). Degradation products of aflatoxin M₁ (AFM₁) formed by high voltage atmospheric cold plasma (HVACP) treatment. Toxicon, 230, Artículo 107160. https://doi.org/10.1016/j.toxicon.2023.107160
- Okyere, A. Y., Rajendran, S. y Annor, G. A. (2022). Cold plasma technologies: Their effect on starch properties and industrial scale-up for starch modification. Current Research in Food Science, 5, 451–463. https://doi.org/10.1016/j.crfs.2022.02.007
- Ott, L. C., Jochum, J., Burrough, L., Clark, S., Keener, K. y Mellata, M. (2022). High voltage atmospheric cold plasma inactivation of Listeria monocytogenes in fresh Queso Fresco cheese. Food Microbiology, 105, Artículo 104007. https://doi.org/10.1016/j.fm.2022.104007
- Ozen, E., Kumar, G. D., Mishra, A. y Singh, R. K. (2022). Inactivation of Escherichia coli in apple cider using atmospheric cold plasma. International Journal of Food Microbiology, 382, Artículo 109913. https://doi.org/10.1016/j.ijfoodmicro.2022.109913
- Puente-Díaz, L. (2024). Principios, aplicaciones y efectos de la aplicación de plasma frío en alimentos: una revisión actualizada. Revista Chilena de Nutrición, 51(2), 155–164. https://doi.org/10.4067/s0717-75182024000200155
- Siciliano, I., Spadaro, D., Prelle, A., Vallauri, D., Cavallero, M. C., Garibaldi, A. y Gullino, M. L. (2016). Use of cold atmospheric plasma to detoxify hazelnuts from aflatoxins. Toxins, 8(5), Artículo 125. https://doi.org/10.3390/toxins8050125
- Song, J., Wang, J., Sima, J., Zhu, Y., Du, X., Williams, P. T. y Huang, Q. (2023). Dechlorination of waste polyvinyl chloride (PVC) through non-thermal plasma. Chemosphere, 338, Artículo 139535. https://doi.org/10.1016/j.chemosphere.2023.139535
- Wielogorska, E., Ahmed, Y., Meneely, J., Graham, W. G., Elliott, C. T. y Gilmore, B. F. (2019). A holistic study to understand the detoxification of mycotoxins in maize and impact on its molecular integrity using cold atmospheric plasma treatment. Food Chemistry, 301, Artículo 125281. https://doi.org/10.1016/j.foodchem.2019.125281
- Yadav, B. y Roopesh, M. S. (2020). In-package atmospheric cold plasma inactivation of Salmonella in freeze-dried pet foods: Effect of inoculum population, water activity, and storage. Innovative Food Science & Emerging Technologies, 66, Artículo 102543. https://doi.org/10.1016/j.ifset.2020.102543
- Yepez, X., Illera, A. E., Baykara, H. y Keener, K. (2022). Recent advances and potential applications of atmospheric pressure cold plasma technology for sustainable food processing. Foods, 11(13), Artículo 1833. https://doi.org/10.3390/foods11131833
- Zheng, Z., Huang, Y., Liu, L., Chen, Y., Wang, Y. y Li, C. (2022). Zearalenone degradation by dielectric barrier discharge cold plasma: The kinetics and mechanism. Foods, 11(10), Artículo 1494. https://doi.org/10.3390/foods11101494
