# Pirólisis en frío · Banco DBD en 3D

Modelo 3D interactivo de un banco de plasma frío de escala de laboratorio, construido a partir de la revisión bibliográfica del seminario *«Pirólisis en frío: principios, aplicaciones y efectos del plasma frío en el procesamiento de alimentos»* (Ingeniería Ambiental, Universidad Austral de Chile, Sede Puerto Montt). El documento base es Puente-Díaz (2024), contrastado con sus fuentes primarias.

Incluye el entorno completo del laboratorio, el despiece de la celda del reactor, la instrumentación y una simulación didáctica del ciclo de tratamiento.

## Abrir el modelo

Abra `dist/pirolisis-en-frio-3d.html` con doble clic en Chrome, Edge o Firefox. Es un único archivo autocontenido que funciona sin conexión a internet, útil para exponerlo en la sala. Con conexión, además carga las tipografías.

## Qué muestra

| Elemento | Contenido |
|---|---|
| Entorno | Mesón de laboratorio con suministro de gases (aire, N₂, O₂ y un cilindro auxiliar de CO₂, Ar o He), panel de controladores de caudal, humidificador, celda DBD en jaula de Faraday, fuente de alta tensión, osciloscopio, espectrómetro, cámara termográfica, monitor y destructor de ozono, extracción, balanza, computador y paro de emergencia. |
| Despiece | 15 piezas numeradas de la celda: pasamuros, tapa, electrodos, barreras de sílice, difusor, muestra, elevador micrométrico, base, cuerpo de policarbonato, ventanas de cuarzo y ZnSe, jaula y puerta con enclavamiento. Cada pieza indica su material, su función y si su respaldo es la revisión o una decisión de ingeniería. |
| Corte | Sección de la cámara para ver la descarga entre las barreras y la muestra. |
| Lupa | Vista ampliada y esquemática de la zona de descarga: electrones, microdescargas, especies reactivas (O, O₃, OH•, H₂O₂, NOₓ, N₂*, UV) y su llegada a células o moléculas de toxina. |
| Proceso | Secuencia purga → rampa de tensión → tratamiento → post-purga → análisis, con enclavamiento de puerta, paro de emergencia y corte por ozono ambiental. |
| Instrumentos | Osciloscopio (V e I), figura de Lissajous Q–V, energía del lote (E = P·t, kJ/kg y kJ/kg por ciclo logarítmico), espectro de emisión, especies, no equilibrio térmico (Ecuación 4), temperaturas, ozono, caudales y humedad. |
| Casos | 28 casos de las Tablas 3 y 4 del informe, más la decloración de PVC. Cada uno trae su resultado informado y una clasificación de cobertura frente al banco: dentro del alcance, parcial o fuera del alcance. |
| Ficha técnica | Especificaciones, lista de partes, instrumentos, cobertura de la literatura, supuestos, seguridad y referencias. También se genera en `docs/ficha-tecnica.md`. |

## Base de diseño

- **Configuración:** descarga de barrera dieléctrica (DBD) plano-paralela a presión atmosférica. Es la configuración con más evidencia en la revisión, enciende con una tensión del orden de 10 kV, opera con aire, N₂, Ar o He y admite el tratamiento dentro del envase. Al trabajar a presión atmosférica no requiere equipo de vacío, y al no usar magnetrón evita la alta inversión de las descargas de microondas (Okyere et al., 2022; Keramat y Golmakani, 2025).
- **Tamaño «barato»:** electrodos de Ø 100 mm, barreras de sílice de Ø 130 × 2 mm, cámara de ≈ 3,6 L y separación de 1 a 20 mm. La fuente es de 0 a 30 kV pico, 5 a 20 kHz y 500 W, y todo cabe en un mesón de 1,8 × 0,75 m.
- **Instrumentación:** cada instrumento mide una variable que la revisión identifica como determinante, es decir, el gas, la humedad, la distancia, el tiempo, la masa, la temperatura del sustrato, la energía entregada y las especies reactivas.

## Qué es dato y qué es supuesto

- **Datos de la revisión:** los resultados de cada caso, las condiciones de los estudios, las ecuaciones 1 a 5 del informe, el intervalo de 1 a 10 eV, el gas a 30–60 °C y la lista de gases, materiales dieléctricos y configuraciones.
- **Supuestos de ingeniería:** la frecuencia, las dimensiones, los materiales no mencionados, la tensión de ruptura (correlación empírica para aire), la potencia (ecuación de Manley), los modelos térmicos y de ozono, las intensidades de especies y del espectro, y la forma de las curvas entre el origen y el valor informado (primer orden). La única excepción es la zearalenona, cuya cinética informan Zheng et al. (2022).
- **Alcance de la simulación:** las lecturas son didácticas. Muestran tendencias y órdenes de magnitud, no predicciones. El simulador no inventa resultados de inactivación: solo reproduce el punto final informado por cada estudio y avisa cuando las condiciones elegidas se apartan de las del caso.

## Uso rápido

1. Elija un caso de la literatura en la consola de la izquierda. El banco aplica las condiciones del estudio que caben en sus límites e indica los ajustes que hizo.
2. Pulse **Iniciar ciclo** y siga la secuencia. Con la vista **Descarga** y la **Lupa** se observa la zona de plasma.
3. Revise las pestañas de **Instrumentación** y la curva de **Resultado**.
4. Mueva el control **Despiece** y haga clic en las piezas o en la lista para ver su ficha.
5. Pruebe los enclavamientos: abra la puerta durante el tratamiento o use el paro de emergencia.

## Compilar desde las fuentes

```bash
npm install
npm run build        # genera dist/pirolisis-en-frio-3d.html y docs/ficha-tecnica.md
npm run watch        # recompila al guardar cambios en src/
```

| Ruta | Contenido |
|---|---|
| `src/data/` | Referencias, casos de la literatura, especificaciones, partes e instrumentos (fuente única de los datos). |
| `src/sim/` | Física de la descarga y máquina de estados del proceso. |
| `src/escena/` | Geometría 3D (Three.js): entorno, reactor, gases, instrumentos, muestras y lupa. |
| `src/ui/` | Interfaz, gráficos y formato numérico en español. |
| `build.mjs` | Empaqueta todo con esbuild en un solo HTML y genera la ficha en Markdown. |

Desde la consola del navegador, `window.bancoDBD` da acceso al proceso para demostraciones (por ejemplo, `bancoDBD.proceso.set('caso', 'zheng')`).
