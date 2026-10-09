# Guion de presentación · Banco DBD de pirólisis en frío

Documento generado por `build.mjs` a partir de `src/data/recorrido.js`: es el mismo texto de las notas del orador (tecla N) del modo «Presentar».

**Pregunta.** ¿Cuánto aumenta la reducción logarítmica de *E. coli* sobre la superficie de manzana cuando la exposición a un plasma DBD de 200 W pasa de 30 a 240 s? ¿Se mantiene la muestra en condición no térmica?

**Hipótesis.** Como la eficacia depende del tiempo de exposición, entre otras variables de proceso (Feizollahi et al., 2021; Niemira et al., 2018), alargar la exposición aumentará la reducción de *E. coli* hasta el orden de 5,5 log UFC/cm², valor informado por Kilonzo-Nthenge et al. (2018). Como la energía llega a los electrones (1 a 10 eV) y no al material en su conjunto (Okyere et al., 2022), el gas no superará los 60 °C informados para equipos de alimentos (Jiang et al., 2022). La temperatura de la manzana se medirá, porque la revisión no la informa.

## Cómo usar el HTML

1. Abre `dist/pirolisis-en-frio-3d.html` con Chrome o Edge (no necesita internet), pantalla completa con F11 y zoom al 100 %.
2. En la portada pulsa «Presentar» (o Enter). Cada paso arma su propia escena: cámara, capas, plasma y paneles.
3. Avanza con →, Espacio o AvPág; retrocede con ← o RePág; N muestra u oculta las notas del orador; Inicio vuelve al paso 1; Esc sale a explorar. Un control remoto de diapositivas sirve, porque envía AvPág y RePág.
4. La barra de cada paso se llena en su tiempo sugerido y se pone amarilla si te pasas en más de un 20 %. Puedes saltar a cualquier paso con un clic en su segmento.
5. Si el HTML falla, usa las capturas de `docs/capturas-plan-b/` (portada y pasos 1 a 10, 1920 × 1080) con este mismo guion.

## Tiempos (10 min 10 s, unas 141 palabras por minuto)

| Paso | Minuto | Etapa | Mensaje clave |
|---|---|---|---|
| 1. La pregunta del experimento | 0:00–1:05 | Pregunta | Todo el recorrido responde una sola pregunta medible; «pirólisis en frío» es un término de trabajo con respaldo en la decloración de PVC. |
| 2. Hipótesis: más exposición, más reducción, sin calentar | 1:05–2:10 | Hipótesis | La parte térmica de la hipótesis se deduce del no equilibrio; la parte temporal, de la literatura y del caso de referencia. |
| 3. Diseño: qué cambiamos, qué medimos y qué fijamos | 2:10–3:10 | Diseño experimental | Se cambia una sola variable y se fija el resto; el control sin descarga y las réplicas son propuestas de diseño. |
| 4. Montaje: la celda DBD por dentro | 3:10–4:10 | Montaje | La barrera dieléctrica define la DBD, y cada ventana de la cámara existe para un instrumento. |
| 5. Procedimiento: masa, puerta y purga | 4:10–5:05 | Procedimiento | Un orden fijo hace comparables los lotes; el gas y la humedad se miden porque determinan las especies reactivas. |
| 6. Medición I: tensión, corriente y energía | 5:05–6:05 | Medición | Medir tensión, corriente y carga permite informar la energía específica que el informe pide para comparar procesos. |
| 7. Medición II: especies reactivas y temperatura | 6:05–7:05 | Medición | Las especies reactivas son el mecanismo de daño, no el calor; aun así, la temperatura se mide en tres puntos. |
| 8. Resultado de referencia: hasta 5,5 ciclos logarítmicos | 7:05–8:05 | Resultado | El valor viene de la literatura: respalda la magnitud alcanzable, no la relación con el tiempo, que es lo que mediría el experimento. |
| 9. Análisis: límites de la comparación | 8:05–9:10 | Análisis | La eficacia pertenece al sistema plasma–matriz–microorganismo, y el banco cubre el caso de referencia solo en forma parcial. |
| 10. Conclusión del experimento | 9:10–10:10 | Conclusión | El experimento es factible, pero su resultado vale solo para sus condiciones; la validez depende del control, las réplicas, la verificación térmica y la energía específica. |

## Guion paso a paso

### 1. La pregunta del experimento · 0:00–1:05

**En pantalla:** Datos: solo de la revisión; equipos y dimensiones: supuestos de ingeniería. «Pirólisis en frío» es un término de trabajo: el plasma rompe enlaces sin calentar el material en su conjunto. PVC: energía de activación aparente de 23,62 kJ/mol con plasma y 137,09 kJ/mol con pirólisis.

> Les presento un banco de plasma frío de descarga de barrera dieléctrica, o DBD. Sus datos provienen solo de nuestra revisión bibliográfica; los equipos y sus dimensiones son supuestos de ingeniería. Lo recorreremos como un experimento de laboratorio. Una precisión: la pirólisis es la descomposición térmica de un material en ausencia de oxígeno. El plasma frío, en cambio, no calienta el material en su conjunto: rompe enlaces con electrones energéticos, especies reactivas y radiación UV, y en la mayoría de los estudios opera con oxígeno. Por eso, «pirólisis en frío» es un término de trabajo. La analogía tiene respaldo: al declorar PVC, la energía de activación aparente fue 5,8 veces menor con plasma que con pirólisis. La pregunta, en la tarjeta: ¿cuánto aumenta la reducción de *E. coli* sobre una manzana si la exposición pasa de 30 a 240 segundos? ¿Y se mantiene la muestra en condición no térmica?

**Señala:** Con un gesto amplio, el banco completo (gases, celda en la jaula e instrumentos); después, la tarjeta con la pregunta y la comparación del PVC en la barra inferior.

**Mensaje clave:** Todo el recorrido responde una sola pregunta medible; «pirólisis en frío» es un término de trabajo con respaldo en la decloración de PVC.

### 2. Hipótesis: más exposición, más reducción, sin calentar · 1:05–2:10

**En pantalla:** Como la energía va a los electrones, el gas no superará 60 °C; la temperatura de la manzana se medirá. Como la eficacia depende del tiempo, más exposición dará más reducción de *E. coli*, hasta el orden de 5,5 log.

> La hipótesis tiene dos partes. La primera es física: en un plasma frío, los electrones alcanzan energías de entre 1 y 10 electronvoltios, mientras las partículas pesadas siguen cerca de la temperatura ambiente. Con la Ecuación 4, 1 electronvoltio equivale a unos 11 600 kelvin, y 10 electronvoltios, a unos 116 000. Con el gas a 298 kelvin, los electrones están entre 39 y 389 veces más calientes que el gas. Por eso predecimos que el gas no superará los 60 grados de los equipos para alimentos; la temperatura de la manzana la mediremos, porque la revisión no la informa. La segunda parte viene de la literatura: la eficacia depende del tiempo de exposición, entre otras variables. Predecimos más reducción con más tiempo, hasta el orden de 5,5 ciclos logarítmicos, el valor de Kilonzo-Nthenge y colaboradores. No suponemos una recta: los autores usaron una distribución de Weibull.

**Señala:** La tarjeta de arriba abajo; luego, en el corte de la celda, la barrera superior resaltada y el espacio bajo ella, donde se formará el plasma.

**Mensaje clave:** La parte térmica de la hipótesis se deduce del no equilibrio; la parte temporal, de la literatura y del caso de referencia.

### 3. Diseño: qué cambiamos, qué medimos y qué fijamos · 2:10–3:10

**En pantalla:** Se manipula una sola variable: el tiempo. Se miden la reducción logarítmica, la temperatura y la energía; lo demás queda fijo. El control sin descarga y las réplicas son propuestas de diseño, no datos del informe.

> En este experimento cambiamos una sola cosa: el tiempo de exposición, de 30 a 240 segundos. Medimos tres respuestas. Primero, la reducción logarítmica de la Ecuación 1: el logaritmo del cociente entre la población inicial y la final, contadas en placa. Segundo, la temperatura de la muestra y del gas, para comprobar que el proceso es no térmico. Tercero, la energía por lote. Lo demás queda fijo: potencia, gas, humedad, separación, masa e inóculo, porque la eficacia depende de variables de proceso, de producto y microbiológicas. Dos elementos son propuestas nuestras, no datos del informe. El primero es un control: manzanas inoculadas que pasan el mismo tiempo en la cámara, con el mismo gas, pero sin alta tensión. Así separamos el efecto del plasma del efecto del gas y de la manipulación. El segundo: al menos tres réplicas por tiempo, en orden aleatorio.

**Señala:** La tarjeta línea por línea, marcando con la mano «propuesta de diseño».

**Mensaje clave:** Se cambia una sola variable y se fija el resto; el control sin descarga y las réplicas son propuestas de diseño.

### 4. Montaje: la celda DBD por dentro · 3:10–4:10

**En pantalla:** Celda DBD plano-paralela: electrodos de Ø 100 mm y barreras de vidrio de sílice, que limitan la corriente y evitan arcos. Una plataforma elevadora micrométrica ajusta la separación d entre 1 y 20 mm. Los materiales (salvo la sílice) y las dimensiones son supuestos.

> Ahora, el montaje. Separamos la celda en sus quince piezas numeradas; la lista está a la izquierda. Arriba están el pasamuros y el electrodo de alta tensión; abajo, el electrodo de tierra. Los dos electrodos son de aluminio, un supuesto del banco. Entre ellos está lo que define a una DBD: la barrera dieléctrica, aquí de vidrio de sílice, uno de los materiales que menciona la revisión. La barrera limita la corriente y evita los arcos; el modelo muestra las microdescargas como filamentos breves, en forma esquemática. La muestra, pieza seis, descansa sobre una plataforma elevadora micrométrica, que ajusta la separación entre 1 y 20 milímetros. Esa separación es una variable controlada, porque cambia las especies que llegan al alimento. La ventana de cuarzo deja pasar la luz hacia el espectrómetro, y la infrarroja, hacia la cámara termográfica.

**Señala:** La barrera superior resaltada (pieza 4) y su ficha; en la lista, los electrodos (3 y 8), la muestra (6), la plataforma elevadora (9) y las ventanas (12 y 13).

**Mensaje clave:** La barrera dieléctrica define la DBD, y cada ventana de la cámara existe para un instrumento.

### 5. Procedimiento: masa, puerta y purga · 4:10–5:05

**En pantalla:** Secuencia: pesaje e inoculación → ajuste de la separación d → cierre de la puerta → purga (caudal y humedad) → alta tensión → postpurga → recuento en placa. Gas: aire sintético (supuesto; la revisión no lo informa).

> El procedimiento sigue un orden fijo, que ven abajo en la pantalla. Primero pesamos la muestra en una balanza con resolución de 0,01 gramos: la masa cambia la eficacia y sirve para calcular la energía específica. Luego ajustamos la separación y cerramos la puerta de la jaula, que tiene enclavamiento. Después purgamos la cámara. Con aire sintético, solo el primer controlador de caudal trabaja; los otros dos quedan para preparar mezclas. Un sensor registra la humedad. ¿Por qué medirla? Porque el radical hidroxilo se forma por disociación del agua, y el gas, la humedad y la distancia definen la mezcla de especies reactivas. Usamos aire sintético, pero es un supuesto: la revisión no informa el gas de este estudio. Al final vendrán la postpurga, que retira el ozono, y el recuento en placa.

**Señala:** Los cilindros, el panel de controladores (FIC-101 a 103; solo el primero con caudal), el humidificador y el sensor MT-201; seguir la purga por la tubería hasta la celda.

**Mensaje clave:** Un orden fijo hace comparables los lotes; el gas y la humedad se miden porque determinan las especies reactivas.

### 6. Medición I: tensión, corriente y energía · 5:05–6:05

**En pantalla:** Alta tensión encendida. Sonda de alta tensión: tensión; bobina de Rogowski: corriente; condensador de medida: carga. La figura de Lissajous da la potencia; con E = P·t y la masa se informan kJ/kg y kJ/kg por ciclo logarítmico. Tensión y potencia del banco: supuestos.

> Encendemos la alta tensión. En el modelo, con aire y 3 milímetros de separación, la descarga se enciende cerca de 14,7 kilovoltios. Con 21,7 kilovoltios a 10 kilohercios entrega unos 200 vatios, ajustados para igualar los 200 que informa el estudio. Tratar esa cifra como potencia de descarga es un supuesto nuestro: la revisión no lo precisa. Ese encendido sale de una correlación empírica, otro supuesto, y es del mismo orden que los 10 kilovoltios que la revisión informa para la DBD. ¿Para qué tres instrumentos eléctricos? La sonda mide la tensión; la bobina de Rogowski, la corriente; y el condensador de medida, la carga. Al graficar la carga contra la tensión se obtiene la figura de Lissajous, y de ella, la potencia. Dividiendo la energía por la masa y por los ciclos logrados, obtenemos la energía específica que pide el informe.

**Señala:** La sonda, la bobina y el condensador resaltado, con sus etiquetas; en la pestaña Eléctrico, la figura de Lissajous y la energía del lote. La baliza encendida sobre la jaula.

**Mensaje clave:** Medir tensión, corriente y carga permite informar la energía específica que el informe pide para comparar procesos.

### 7. Medición II: especies reactivas y temperatura · 6:05–7:05

**En pantalla:** Lupa esquemática, sin escala. Electrones → O, O₃, OH•, H₂O₂, NOₓ y radiación UV sobre la superficie. Espectrómetro: identifica especies, sin cuantificarlas; monitor de ozono (absorción UV): O₃ a la salida. Ozono y temperaturas del panel: valores ilustrativos.

> Acerquémonos a la descarga. La lupa es esquemática y sin escala. Los choques de los electrones con el gas y el vapor de agua inician una cadena que forma oxígeno atómico, ozono, radical hidroxilo, peróxido de hidrógeno y óxidos de nitrógeno, además de radiación UV. Según la revisión base, en las bacterias Gram negativas predominarían la fuga de contenido celular y el daño del ADN. El espectrómetro buscaría especies como óxido nítrico, hidroxilo, nitrógeno y oxígeno atómico, identificadas en un chorro de helio; en aire, la mezcla puede ser distinta. El monitor mide el ozono a la salida. La temperatura se mide en el gas, en la superficie y en contacto bajo la muestra; el panel grafica las dos primeras. El sustrato sí puede calentarse: en avellanas, con 1 000 vatios durante 12 minutos, la temperatura aumentó hasta en 28,9 grados Celsius.

**Señala:** En la lupa ampliada: electrones blancos, filamentos, especies de colores y células que se dañan. Luego, la pestaña Gas y temperatura, marcando que sus valores son ilustrativos.

**Mensaje clave:** Las especies reactivas son el mecanismo de daño, no el calor; aun así, la temperatura se mide en tres puntos.

### 8. Resultado de referencia: hasta 5,5 ciclos logarítmicos · 7:05–8:05

**En pantalla:** Dato de la literatura, no medición propia: hasta 5,5 log UFC/cm² (99,9997 %) en *E. coli*, con DBD de 200 W y exposiciones de 30 a 240 s. La ubicación del punto a los 240 s y la trayectoria de primer orden son supuestos del modelo.

> Atención: este resultado no lo medimos nosotros. Es el valor que informaron Kilonzo-Nthenge y colaboradores con una DBD de 200 vatios: hasta 5,5 ciclos logarítmicos en *E. coli* y 5,3 en *Salmonella*. Según la Ecuación 2, una reducción de 5,5 ciclos equivale a inactivar el 99,9997 % de la población: sobreviven unas 3 bacterias de cada millón. La literatura respalda esa magnitud en exposiciones de 30 a 240 segundos, pero la revisión no informa cómo cambia la reducción con el tiempo ni en qué momento se alcanzó el máximo. Esa relación es justamente lo que mediría el experimento, descontando el resultado del control sin descarga. La lectura crítica: ubicar el punto a los 240 segundos y unirlo con una recta de primer orden son supuestos del modelo, porque los autores usaron Weibull. La temperatura de la manzana tampoco está informada: queda por medir.

**Señala:** En la pestaña Resultado, el punto en 5,5 log y el aviso que separa el dato informado de la trayectoria supuesta.

**Mensaje clave:** El valor viene de la literatura: respalda la magnitud alcanzable, no la relación con el tiempo, que es lo que mediría el experimento.

### 9. Análisis: límites de la comparación · 8:05–9:10

**En pantalla:** Cobertura parcial: el estudio informa 35 mm y el banco trata a 3 mm; la revisión no informa el gas. La eficacia es propiedad del sistema plasma–matriz–microorganismo: un resultado sobre manzana no se extrapola a otra matriz.

> Primero, las limitaciones. Una: el estudio informa 35 milímetros, que interpretamos como la distancia de tratamiento. Nuestro elevador llega a 20, pero el banco trata a 3: con 30 kilovoltios, el aire del modelo no enciende sobre unos 8 milímetros. Dos: la revisión no informa el gas; usar aire es un supuesto. Tres: la revisión base clasificó este equipo como descarga corona, y la fuente primaria lo describe como DBD. La eficacia no es una propiedad del equipo, sino del sistema formado por el plasma, la matriz y el microorganismo. Con el mismo chorro de plasma, la población de *E. coli* bajó 4,02 ciclos en jugo de manzana y solo 1,43 en jugo de tomate: 389 veces más sobrevivientes en el tomate. En queso fresco, más masa significó menos eficacia. Y en biopelículas, alejar la muestra de 5 a 7,5 centímetros restó 0,45 ciclos con 5 segundos de exposición, pero no a los 15.

**Señala:** La plataforma elevadora resaltada y su ficha (alcance de 20 mm; el banco trata a 3 mm); después, la tarjeta de limitaciones línea por línea.

**Mensaje clave:** La eficacia pertenece al sistema plasma–matriz–microorganismo, y el banco cubre el caso de referencia solo en forma parcial.

### 10. Conclusión del experimento · 9:10–10:10

**En pantalla:** Cámara purgada y puerta abierta: el enclavamiento mantiene la fuente sin tensión y la muestra va al recuento en placa. La referencia anticipa hasta 5,5 log, un valor válido solo para esa matriz, ese equipo y esa distancia.

> Con la cámara ya purgada, abrimos la puerta. El enclavamiento, un supuesto de diseño del banco, mantiene la fuente sin tensión y responde a la protección de los trabajadores que exige la regulación. La manzana sale al recuento en placa. ¿Qué concluimos? Primero, la pregunta es medible: el banco varía solo el tiempo y mide la reducción, la temperatura y la energía. Segundo, la literatura anticipa hasta 5,5 ciclos sobre manzana, pero ese valor no se extrapola a otra matriz, otro equipo, otro gas u otra distancia. Tercero, la validez exige un control sin descarga y réplicas, nuestra propuesta de diseño, además de verificar la temperatura e informar la energía específica, como pide el informe. Para la ingeniería ambiental, el plasma frío interesa porque podría sustituir sanitizantes químicos. Y «pirólisis en frío» resume la idea: romper enlaces con electrones, no con calor. Muchas gracias.

**Señala:** La puerta abierta de la jaula, resaltada (sin baliza ni descarga), y la tarjeta de conclusión; cerrar con un gesto hacia el banco completo.

**Mensaje clave:** El experimento es factible, pero su resultado vale solo para sus condiciones; la validez depende del control, las réplicas, la verificación térmica y la energía específica.
