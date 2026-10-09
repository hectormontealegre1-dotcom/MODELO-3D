// Interfaz: consola de proceso, instrumentación, ficha técnica, tarjeta de pieza y alarmas.
import { CASOS, CASO_LIBRE, GASES } from '../data/casos.js';
import { BANCO, PARTES, INSTRUMENTOS, ESPECIFICACIONES, SUPUESTOS, SEGURIDAD, ANALISIS_FUERA_DE_LINEA } from '../data/banco.js';
import { REFS, cita } from '../data/referencias.js';
import { FASES, VELOCIDADES } from '../sim/proceso.js';
import * as F from '../sim/fisica.js';
import { fmt, fmtTiempo, fmtDuracion } from './formato.js';
import * as G from './graficos.js';
import { COLOR_ESPECIE } from '../escena/lupa.js';
import { EXPERIMENTO, PASOS } from '../data/recorrido.js';

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const NOMBRE_GAS = { N2: 'N₂', O2: 'O₂', CO2: 'CO₂', Ar: 'Ar', He: 'He' };
const ESTADO_COB = { dentro: 'Dentro del alcance', parcial: 'Parcial', fuera: 'Fuera del alcance' };
const COLOR_BAL = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)'];

// Tiempo en escala logarítmica para el deslizador (5 s a 60 min).
const T_MIN = 5;
const T_MAX = 3600;
const tDesdeRango = (v) => {
  const t = T_MIN * Math.pow(T_MAX / T_MIN, v / 1000);
  return t < 60 ? Math.round(t) : t < 600 ? Math.round(t / 5) * 5 : Math.round(t / 30) * 30;
};
const rangoDesdeT = (t) => Math.round((1000 * Math.log(t / T_MIN)) / Math.log(T_MAX / T_MIN));

export function crearHUD(proceso, { alSeleccionarParte }) {
  // ---------------- Consola de proceso ----------------
  const grupos = {};
  for (const c of CASOS) (grupos[c.grupo] ||= []).push(c);
  const opcionesCaso =
    `<option value="libre">${esc(CASO_LIBRE.nombre)}</option>` +
    Object.entries(grupos)
      .map(([g, cs]) => `<optgroup label="${esc(g)}">${cs.map((c) => `<option value="${c.id}">${esc(c.nombre)}</option>`).join('')}</optgroup>`)
      .join('');
  const opcionesGas = Object.entries(GASES)
    .map(([id, g]) => `<option value="${id}">${esc(g.nombre)}</option>`)
    .join('');

  $('#consola').innerHTML = `
    <header><h2>Consola de proceso</h2><p>Configure el lote y ejecute la secuencia.</p></header>
    <div class="desliza">
      <section class="seccion">
        <h3>Caso de la literatura <span id="caso-grupo"></span></h3>
        <select id="sel-caso" class="campo" aria-label="Caso de la literatura">${opcionesCaso}</select>
        <div class="tarjeta-caso" id="tarjeta-caso"></div>
        <ul class="ajustes" id="ajustes-caso"></ul>
      </section>
      <section class="seccion">
        <h3>Atmósfera <span>FIC-101 a 103 · MT-201</span></h3>
        <select id="sel-gas" class="campo" aria-label="Gas de trabajo">${opcionesGas}</select>
        <div class="composicion" id="composicion"></div>
        <div class="fila-rango"><label for="rng-q">Caudal total</label><output id="out-q" for="rng-q"></output>
          <input type="range" id="rng-q" min="${BANCO.qMin}" max="${BANCO.qMax}" step="0.1"></div>
        <div class="fila-rango"><label for="rng-hr">Humedad relativa del gas</label><output id="out-hr" for="rng-hr"></output>
          <input type="range" id="rng-hr" min="0" max="90" step="5"></div>
        <p class="ayuda" id="ayuda-gas"></p>
      </section>
      <section class="seccion">
        <h3>Descarga <span>EI-401 · ZI-701</span></h3>
        <div class="segmentado" role="group" aria-label="Modo de tratamiento">
          <button type="button" id="modo-abierto">Abierto con flujo</button>
          <button type="button" id="modo-envase">Dentro del envase</button>
        </div>
        <div class="fila-rango"><label for="rng-d">Separación barrera–muestra, d</label><output id="out-d" for="rng-d"></output>
          <input type="range" id="rng-d" min="${BANCO.dMin}" max="${BANCO.dMax}" step="0.5"></div>
        <div class="fila-rango"><label for="rng-v">Tensión pico</label><output id="out-v" for="rng-v"></output>
          <input type="range" id="rng-v" min="0" max="${BANCO.vMax}" step="0.5"></div>
        <div class="fila-rango"><label for="rng-f">Frecuencia</label><output id="out-f" for="rng-f"></output>
          <input type="range" id="rng-f" min="${BANCO.fMin}" max="${BANCO.fMax}" step="1"></div>
        <div class="encendido" id="encendido" data-ok="0"><span class="marca-estado"></span><div id="encendido-txt"></div></div>
      </section>
      <section class="seccion">
        <h3>Muestra y tiempo <span>WI-601 · KI-702</span></h3>
        <div class="fila-rango"><label for="rng-m">Masa de la muestra</label><output id="out-m" for="rng-m"></output>
          <input type="range" id="rng-m" min="1" max="100" step="1"></div>
        <div class="fila-rango"><label for="rng-t">Tiempo de exposición</label><output id="out-t" for="rng-t"></output>
          <input type="range" id="rng-t" min="0" max="1000" step="1"></div>
        <div class="fila-rango"><label for="sel-vel">Velocidad de la simulación</label>
          <select id="sel-vel" class="campo" style="width:auto;height:28px">${VELOCIDADES.map((v) => `<option value="${v}">×${v}</option>`).join('')}</select></div>
      </section>
      <section class="seccion">
        <h3>Operación</h3>
        <div class="botonera">
          <button type="button" class="boton primario" id="btn-iniciar">Iniciar ciclo</button>
          <button type="button" class="boton" id="btn-pausa">Pausar</button>
          <button type="button" class="boton" id="btn-detener">Detener</button>
        </div>
        <div class="botonera dos">
          <button type="button" class="boton" id="btn-puerta">Abrir puerta</button>
          <button type="button" class="boton peligro" id="btn-paro">Paro de emergencia</button>
        </div>
        <ol class="secuencia" id="secuencia">${FASES.map((f) => `<li data-fase="${f.id}"><span>${esc(f.nombre)}</span><small></small></li>`).join('')}</ol>
      </section>
      <section class="seccion">
        <h3>Bitácora</h3>
        <ul class="bitacora" id="bitacora"></ul>
      </section>
    </div>`;

  // ---------------- Instrumentación ----------------
  $('#instrumentos').innerHTML = `
    <header><h2>Instrumentación</h2><p>Lecturas simuladas del banco durante el lote</p></header>
    <div class="lecturas">
      <div class="lectura"><small title="JI-403">Potencia</small><b id="k-p">0<span>W</span></b></div>
      <div class="lectura"><small title="E = P·t">Energía</small><b id="k-e">0<span>kJ</span></b></div>
      <div class="lectura"><small title="TT-301">T gas</small><b id="k-t">25<span>°C</span></b></div>
      <div class="lectura"><small title="AI-502">O₃ salida</small><b id="k-o3">0<span>ppm</span></b></div>
    </div>
    <div class="pestanas" role="tablist" aria-label="Grupos de instrumentos">
      <button type="button" role="tab" data-tab="electrico" aria-selected="true">Eléctrico</button>
      <button type="button" role="tab" data-tab="plasma" aria-selected="false">Plasma</button>
      <button type="button" role="tab" data-tab="gas" aria-selected="false">Gas y temperatura</button>
      <button type="button" role="tab" data-tab="resultado" aria-selected="false">Resultado</button>
    </div>
    <div class="desliza">
      <div data-panel="electrico">
        <section class="seccion">
          <h3>Osciloscopio <span>EI-401 · II-402</span></h3>
          <canvas class="grafico alto" id="c-osc"></canvas>
          <p class="ayuda">Corriente de desplazamiento con los pulsos de microdescarga superpuestos (representación). Con la tensión bajo el encendido solo circula corriente capacitiva.</p>
        </section>
        <section class="seccion">
          <h3>Figura de Lissajous Q–V <span>JI-403 · Cm = 100 nF</span></h3>
          <canvas class="grafico medio" id="c-liss"></canvas>
        </section>
        <section class="seccion">
          <h3>Energía del lote <span>discusión del informe</span></h3>
          <table class="tabla-datos"><tbody>
            <tr><th>Tensión aplicada</th><td id="e-v">—</td></tr>
            <tr><th>Tensión de encendido</th><td id="e-vi">—</td></tr>
            <tr><th>Potencia en la descarga</th><td id="e-p">—</td></tr>
            <tr><th>Energía, E = P·t</th><td id="e-e">—</td></tr>
            <tr><th>Energía específica</th><td id="e-em">—</td></tr>
            <tr><th>Por ciclo logarítmico</th><td id="e-elog">—</td></tr>
          </tbody></table>
          <p class="ayuda">El informe propone normalizar la energía por la masa tratada (kJ/kg) y por la reducción obtenida (kJ/kg por ciclo logarítmico) para comparar procesos.</p>
        </section>
      </div>
      <div data-panel="plasma" hidden>
        <section class="seccion">
          <h3>Espectro de emisión <span>AI-501</span></h3>
          <canvas class="grafico alto" id="c-oes"></canvas>
          <p class="ayuda">Burducea et al. (2023) identificaron NO, OH, N₂, N₂⁺ y O. Las posiciones de banda provienen de tablas espectroscópicas generales; las intensidades son cualitativas.</p>
        </section>
        <section class="seccion">
          <h3>Especies reactivas <span>indicador cualitativo, 0 a 1</span></h3>
          <div class="barras" id="barras-esp"></div>
          <p class="ayuda" id="nota-esp"></p>
        </section>
        <section class="seccion">
          <h3>No equilibrio térmico <span>Ecuación 4</span></h3>
          <div class="te-card">
            <div><small>Tₑ con 1 eV</small><b>${fmt(F.tempElectrones(1), 0)} K</b></div>
            <div><small>Tₑ con 10 eV</small><b>${fmt(F.tempElectrones(10), 0)} K</b></div>
            <div><small>T del gas</small><b id="te-tg">298 K</b></div>
            <div><small>Razón Tₑ/T<sub>g</sub></small><b id="te-razon">—</b></div>
          </div>
          <div class="ecuacion">Tₑ = E / k<sub>B</sub> · k<sub>B</sub> = 8,617 333 × 10⁻⁵ eV/K · 1 eV = 11 604,5 K</div>
          <p class="ayuda">Los electrones alcanzan 1 a 10 eV mientras el gas permanece cerca de la temperatura ambiente (Okyere et al., 2022).</p>
        </section>
      </div>
      <div data-panel="gas" hidden>
        <section class="seccion">
          <h3>Temperaturas <span>TT-301 · TI-302</span></h3>
          <div class="leyenda"><span style="--c:var(--s1)"><i></i>Gas a la salida</span><span style="--c:var(--s2)"><i></i>Superficie de la muestra</span></div>
          <canvas class="grafico medio" id="c-temp"></canvas>
          <p class="ayuda">Modelo ilustrativo anclado a 30 a 60 °C en equipos para alimentos (Jiang et al., 2022) y a +28,9 °C con 1 000 W durante 12 min (Siciliano et al., 2016).</p>
        </section>
        <section class="seccion">
          <h3>Ozono a la salida <span>AI-502</span></h3>
          <canvas class="grafico medio" id="c-o3"></canvas>
          <p class="ayuda">Orden de magnitud ilustrativo: la revisión no informa concentraciones de ozono.</p>
        </section>
        <section class="seccion">
          <h3>Caudales y humedad</h3>
          <table class="tabla-datos"><tbody>
            <tr><th id="g-m1n">FIC-101</th><td id="g-m1">—</td></tr>
            <tr><th>FIC-102 · O₂</th><td id="g-m2">—</td></tr>
            <tr><th id="g-m3n">FIC-103</th><td id="g-m3">—</td></tr>
            <tr><th>MT-201 · humedad relativa</th><td id="g-hr">—</td></tr>
            <tr><th>AI-503 · O₃ ambiental</th><td id="g-amb">—</td></tr>
            <tr><th>TI-302 · superficie de la muestra</th><td id="g-ts">—</td></tr>
          </tbody></table>
        </section>
      </div>
      <div data-panel="resultado" hidden>
        <section class="seccion">
          <h3>Curva de referencia <span id="res-cinetica"></span></h3>
          <p class="ayuda" id="res-titulo"></p>
          <canvas class="grafico alto" id="c-res"></canvas>
          <div class="aviso-ref" id="aviso-ref"></div>
        </section>
        <section class="seccion">
          <h3>Lectura al tiempo de exposición</h3>
          <table class="tabla-datos"><tbody id="res-tabla"></tbody></table>
          <div class="ecuacion" id="res-ec"></div>
        </section>
        <section class="seccion" id="sec-balance" hidden>
          <h3 id="bal-titulo">Balance</h3>
          <div class="balance" id="bal-barra"></div>
          <div class="leyenda" id="bal-leyenda"></div>
          <p class="ayuda">Ecuación 5: n₀ = n<sub>remanente</sub> + n<sub>productos</sub> + n<sub>conjugados</sub>. Degradar no equivale a detoxificar.</p>
        </section>
        <section class="seccion">
          <h3>Notas del estudio</h3>
          <ul class="notas" id="notas-caso"></ul>
        </section>
      </div>
    </div>`;

  // Leyenda de la lupa
  $('#leyenda-lupa').innerHTML =
    `<span style="--c:#ffffff"><i></i>e⁻</span>` +
    F.ESPECIES_INFO.map((e) => `<span style="--c:${COLOR_ESPECIE[e.clave]}"><i></i>${e.nombre}</span>`).join('');

  // ---------------- Enlaces de controles ----------------
  const p = proceso.p;
  const rng = (id, clave, conv = Number) => {
    const el = $(id);
    el.addEventListener('input', () => proceso.set(clave, conv(el.value)));
  };
  $('#sel-caso').addEventListener('change', (e) => proceso.set('caso', e.target.value));
  $('#sel-gas').addEventListener('change', (e) => proceso.set('gas', e.target.value));
  rng('#rng-q', 'Q');
  rng('#rng-hr', 'HR');
  rng('#rng-d', 'd');
  rng('#rng-v', 'V');
  rng('#rng-f', 'f');
  rng('#rng-m', 'masa');
  rng('#rng-t', 't', (v) => tDesdeRango(Number(v)));
  $('#sel-vel').addEventListener('change', (e) => proceso.set('velocidad', Number(e.target.value)));
  $('#modo-abierto').addEventListener('click', () => proceso.set('modo', 'abierto'));
  $('#modo-envase').addEventListener('click', () => proceso.set('modo', 'envase'));
  $('#btn-iniciar').addEventListener('click', () => proceso.iniciar());
  $('#btn-pausa').addEventListener('click', () => proceso.pausar());
  $('#btn-detener').addEventListener('click', () => proceso.detener());
  $('#btn-puerta').addEventListener('click', () => proceso.alternarPuerta());
  $('#btn-paro').addEventListener('click', () => proceso.pararEmergencia());

  // Pestañas de instrumentación
  const tabs = [...document.querySelectorAll('#instrumentos [role="tab"]')];
  let tabActiva = 'electrico';
  const elegirTab = (id) => {
    tabActiva = id;
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.tab === id)));
    document.querySelectorAll('#instrumentos [data-panel]').forEach((pn) => (pn.hidden = pn.dataset.panel !== id));
    try {
      localStorage.setItem('pf-tab', id);
    } catch (e) {
      /* almacenamiento no disponible */
    }
  };
  tabs.forEach((t) => t.addEventListener('click', () => elegirTab(t.dataset.tab)));
  try {
    const guardada = localStorage.getItem('pf-tab');
    if (guardada) elegirTab(guardada);
  } catch (e) {
    /* almacenamiento no disponible */
  }

  for (const id of ['c-osc', 'c-liss', 'c-oes', 'c-temp', 'c-o3', 'c-res']) G.activarHover($('#' + id));

  // Navegación móvil
  document.querySelectorAll('.nav-movil button').forEach((b) =>
    b.addEventListener('click', () => {
      document.querySelectorAll('.nav-movil button').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
      const objetivo = b.dataset.panel;
      $('#consola').dataset.oculto = objetivo === 'consola' ? '0' : '1';
      $('#instrumentos').dataset.oculto = objetivo === 'instrumentos' ? '0' : '1';
      $('#app').dataset.escena = objetivo === 'ninguno' ? '1' : '0';
      window.dispatchEvent(new Event('resize'));
    }),
  );
  $('#instrumentos').dataset.oculto = '1';
  $('#consola').dataset.oculto = '0';

  // ---------------- Sincronización de controles con los parámetros ----------------
  function sincronizarControles() {
    const c = proceso.caso;
    $('#sel-caso').value = c.id;
    $('#sel-gas').value = p.gas;
    $('#rng-q').value = p.Q;
    $('#out-q').textContent = `${fmt(p.Q, 1)} L/min`;
    $('#rng-hr').value = p.HR;
    $('#out-hr').textContent = `${fmt(p.HR, 0)} %`;
    $('#rng-d').value = p.d;
    $('#out-d').textContent = `${fmt(p.d, 1)} mm`;
    $('#rng-v').value = p.V;
    $('#out-v').textContent = `${fmt(p.V, 1)} kV`;
    $('#rng-f').value = p.f;
    $('#out-f').textContent = `${fmt(p.f, 0)} kHz`;
    $('#rng-m').value = p.masa;
    $('#out-m').textContent = `${fmt(p.masa, 0)} g`;
    $('#rng-t').value = rangoDesdeT(p.t);
    $('#out-t').textContent = fmtDuracion(p.t);
    $('#sel-vel').value = p.velocidad;
    $('#modo-abierto').setAttribute('aria-pressed', String(p.modo === 'abierto'));
    $('#modo-envase').setAttribute('aria-pressed', String(p.modo === 'envase'));

    // Composición y notas del gas
    const gas = GASES[p.gas];
    const x = F.normalizar(gas.comp);
    $('#composicion').innerHTML = Object.entries(x)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => `<span>${NOMBRE_GAS[k]} ${fmt(v * 100, v < 0.01 ? 2 : v < 0.1 ? 1 : 0)} %</span>`)
      .join('');
    const notas = [`<b>Fuente:</b> ${esc(cita(gas.ref))}.`];
    if (gas.supuesto) notas.push(esc(gas.supuesto));
    if (x.O2 > 0 && x.O2 < 0.02) notas.push('Trazas de O₂: requieren un controlador de bajo rango o un cilindro premezclado.');
    $('#ayuda-gas').innerHTML = notas.join(' ');

    // Tarjeta del caso
    const r = c.resultado;
    const cob = c.cobertura;
    $('#caso-grupo').textContent = c.grupo === 'Modo libre' ? '' : c.grupo.split(' · ')[0];
    $('#tarjeta-caso').innerHTML =
      c.id === 'libre'
        ? `<p class="ayuda">${esc(c.notas[0])}</p>`
        : `<dl>
            <dt>Objetivo</dt><dd>${esc(c.objetivo)}</dd>
            <dt>Matriz</dt><dd>${esc(c.matriz)}</dd>
            <dt>Equipo</dt><dd>${esc(c.config)}</dd>
            <dt>Condiciones</dt><dd>${esc(c.condiciones)}</dd>
          </dl>
          <div class="resultado-ref">${esc(r.texto)}</div>
          <div><span class="chip" data-estado="${cob.estado}"><i></i>${ESTADO_COB[cob.estado]}</span></div>
          <ul class="lista-motivos">${cob.motivos.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>
          <div class="cita">${esc(cita(c.ref))}</div>`;
    $('#ajustes-caso').innerHTML = proceso.ajustesCaso.map((a) => `<li>${esc(a)}</li>`).join('');

    // Resultado: textos fijos del caso
    $('#res-titulo').textContent = c.id === 'libre' ? 'Elija un caso para ver un resultado informado.' : `${c.objetivo} · ${c.matriz}`;
    $('#res-cinetica').textContent = c.cinetica === 'informada' ? 'cinética informada' : c.cinetica === 'supuesta' ? 'trayectoria supuesta' : '';
    $('#notas-caso').innerHTML = (c.notas || []).map((n) => `<li>${esc(n)}</li>`).join('');
    const bal = c.balance;
    $('#sec-balance').hidden = !bal;
    if (bal) {
      $('#bal-titulo').textContent = bal.titulo;
      const total = bal.partes.reduce((a, b) => a + b.valor, 0);
      $('#bal-barra').innerHTML = bal.partes
        .map((pt, i) => `<i class="${pt.desconocido ? 'desconocido' : ''}" style="width:${(pt.valor / total) * 100}%;${pt.desconocido ? '' : `background:${COLOR_BAL[i]}`}" title="${esc(pt.etiqueta)}: ${fmt(pt.valor, 2)} %"></i>`)
        .join('');
      $('#bal-leyenda').innerHTML = bal.partes
        .map((pt, i) => `<span style="--c:${pt.desconocido ? 'var(--muted)' : COLOR_BAL[i]}"><i style="height:8px;width:8px"></i>${esc(pt.etiqueta)} · ${fmt(pt.valor, 2)} %</span>`)
        .join('');
    }
    ultimo.especiesClave = null;
  }

  proceso.on((tipo) => {
    if (tipo === 'parametros') sincronizarControles();
    if (tipo === 'fase') actualizarBotones();
  });

  function actualizarBotones() {
    const f = proceso.fase;
    $('#btn-iniciar').disabled = !(f === 'reposo' || f === 'listo' || proceso.pausado);
    $('#btn-iniciar').textContent = proceso.pausado ? 'Reanudar' : f === 'listo' ? 'Nuevo ciclo' : 'Iniciar ciclo';
    $('#btn-pausa').disabled = f === 'reposo' || f === 'listo';
    $('#btn-pausa').textContent = proceso.pausado ? 'En pausa' : 'Pausar';
    $('#btn-pausa').setAttribute('aria-pressed', String(proceso.pausado));
    $('#btn-detener').disabled = f === 'reposo' || f === 'listo';
    $('#btn-puerta').textContent = proceso.puertaAbierta ? 'Cerrar puerta' : 'Abrir puerta';
    $('#btn-paro').textContent = proceso.paro ? 'Rearmar paro' : 'Paro de emergencia';
    const bloquear = f === 'rampa' || f === 'tratamiento';
    for (const id of ['#sel-caso', '#sel-gas', '#modo-abierto', '#modo-envase', '#rng-d', '#rng-m']) $(id).disabled = bloquear;
  }

  // ---------------- Actualización periódica ----------------
  const ultimo = { bit: '', alarmas: '', especiesClave: null };
  let tGraf = 0;

  function actualizar(est, dt) {
    const fNombre = FASES.find((f) => f.id === est.fase)?.nombre || est.fase;
    const pastilla = $('#pastilla');
    pastilla.dataset.fase = est.fase;
    pastilla.dataset.at = est.altaTension ? '1' : '0';
    const presentando = $('#app').dataset.presentando === '1';
    $('#pastilla-txt').textContent = est.paro ? 'Paro' : proceso.pausado && !presentando ? 'En pausa' : est.altaTension && !est.plasma ? 'AT sin descarga' : fNombre;
    $('#reloj').textContent = `t = ${fmtTiempo(est.tSim)} · ×${fmt(est.velocidad, 0)}`;

    // Lecturas
    $('#k-p').innerHTML = `${fmt(est.P, 0)}<span>W</span>`;
    $('#k-e').innerHTML = `${fmt(est.E / 1000, est.E < 10000 ? 2 : 1)}<span>kJ</span>`;
    $('#k-t').innerHTML = `${fmt(est.Tgas, 1)}<span>°C</span>`;
    $('#k-o3').innerHTML = `${fmt(est.O3, 0)}<span>ppm</span>`;

    // Encendido
    const dO = proceso.desObjetivo;
    const enc = $('#encendido');
    enc.dataset.ok = dO.enciende ? '1' : '0';
    $('#encendido-txt').innerHTML = dO.enciende
      ? `Enciende sobre <b>${fmt(dO.Vign, 1)} kV</b> · P ≈ <b>${fmt(dO.P, 0)} W</b>${dO.limitada ? ' (límite de la fuente)' : ''}`
      : `No enciende: se requieren <b>${fmt(dO.Vign, 1)} kV</b>${dO.Vign > BANCO.vMax ? ', sobre el máximo de 30 kV' : ''}. Reduzca d o use Ar o He.`;

    // Secuencia
    const idx = FASES.findIndex((f) => f.id === est.fase);
    document.querySelectorAll('#secuencia li').forEach((li, i) => {
      li.dataset.estado = i < idx ? 'hecho' : i === idx ? 'activo' : 'pendiente';
      const small = li.querySelector('small');
      if (li.dataset.fase === 'tratamiento') small.textContent = `${fmtTiempo(est.tTrat)} / ${fmtTiempo(proceso.p.t)}`;
      else if (li.dataset.fase === 'purga') small.textContent = fmtDuracion(proceso.duracionPurga());
      else small.textContent = '';
    });

    const bit = proceso.bitacora.map((b) => `<li><time>${fmtTiempo(b.t)}</time><span>${esc(b.msg)}</span></li>`).join('');
    if (bit !== ultimo.bit) {
      $('#bitacora').innerHTML = bit || '<li><time>—</time><span>Sin eventos. Pulse «Iniciar ciclo».</span></li>';
      ultimo.bit = bit;
    }
    const al = est.alarmas.map((a) => `<div class="alarma" data-nivel="${a.nivel}"><b>${a.nivel === 'critica' ? 'Alarma' : a.nivel === 'aviso' ? 'Aviso' : 'Info'}</b><span>${esc(a.texto)}</span></div>`).join('');
    if (al !== ultimo.alarmas) {
      $('#alarmas').innerHTML = al;
      ultimo.alarmas = al;
    }
    actualizarBotones();

    // Gráficos y tablas (≈ 8 por segundo)
    tGraf += dt;
    if (tGraf < 0.12) return;
    tGraf = 0;
    G.leerTokens();
    if (tabActiva === 'electrico') {
      G.osciloscopio($('#c-osc'), est.onda);
      G.lissajous($('#c-liss'), est.onda, est.P, est.f);
      $('#e-v').textContent = `${fmt(est.Vact, 1)} kV pico`;
      $('#e-vi').textContent = `${fmt(proceso.des.Vign, 1)} kV`;
      $('#e-p').textContent = `${fmt(est.P, 0)} W`;
      $('#e-e').textContent = `${fmt(est.E / 1000, 2)} kJ · ${fmt(est.E / 3.6e6, 4)} kWh`;
      const em = est.E / 1000 / (proceso.p.masa / 1000);
      $('#e-em').textContent = `${fmt(em, 0)} kJ/kg`;
      const R = proceso.caso.resultado?.tipo === 'log' ? proceso.progreso : 0;
      $('#e-elog').textContent = R > 0.01 ? `${fmt(em / R, 0)} kJ/kg por log` : '—';
    } else if (tabActiva === 'plasma') {
      G.espectroOES($('#c-oes'), est.espectro);
      const clave = F.ESPECIES_INFO.map((e) => (est.especies[e.clave] || 0).toFixed(2)).join();
      if (clave !== ultimo.especiesClave) {
        ultimo.especiesClave = clave;
        $('#barras-esp').innerHTML = F.ESPECIES_INFO.map((e) => {
          const v = est.especies[e.clave] || 0;
          return `<div class="barra-esp" title="${esc(e.desc)}"><span style="--c:var(--sp-${e.clave})">${e.nombre}</span><div class="pista"><i style="width:${v * 100}%;background:var(--sp-${e.clave})"></i></div><output>${fmt(v, 2)}</output></div>`;
        }).join('');
        const x = F.normalizar(proceso.comp);
        $('#nota-esp').textContent =
          x.He + x.Ar > 0.98
            ? 'Gas noble: se ioniza con menor aporte de energía, pero casi no genera especies reactivas de oxígeno y nitrógeno (Okyere et al., 2022).'
            : 'El gas de alimentación, la humedad y la distancia definen la mezcla de especies (Dharini et al., 2023; Puente-Díaz, 2024).';
      }
      const Tg = est.Tgas + 273.15;
      $('#te-tg').textContent = `${fmt(Tg, 1)} K`;
      $('#te-razon').textContent = `${fmt(F.tempElectrones(1) / Tg, 1)} a ${fmt(F.tempElectrones(10) / Tg, 1)}`;
    } else if (tabActiva === 'gas') {
      const h = est.historial;
      const xs = h.map((x) => x.t);
      G.tendencia($('#c-temp'), xs, [
        { nombre: 'T gas', ys: h.map((x) => x.Tgas), color: getComputedStyle(document.documentElement).getPropertyValue('--s1').trim() },
        { nombre: 'T muestra', ys: h.map((x) => x.Tsus), color: getComputedStyle(document.documentElement).getPropertyValue('--s2').trim() },
      ], { unidad: '°C', yMin: 20, yMax: 40, dec: 0 });
      G.tendencia($('#c-o3'), xs, [{ nombre: 'O₃', ys: h.map((x) => x.O3), color: getComputedStyle(document.documentElement).getPropertyValue('--s3').trim() }], { unidad: 'ppm', yMin: 0, dec: 0 });
      const m = est.mfc;
      $('#g-m1n').textContent = `FIC-101 · ${m.m1.fuente === 'aire' ? 'aire' : 'N₂'}`;
      $('#g-m1').textContent = `${fmt(est.flujo ? m.m1.q : 0, 2)} L/min`;
      $('#g-m2').textContent = `${fmt(est.flujo ? m.m2 : 0, 3)} L/min`;
      $('#g-m3n').textContent = `FIC-103 · ${m.m3.gas ? NOMBRE_GAS[m.m3.gas] : 'sin uso'}`;
      $('#g-m3').textContent = `${fmt(est.flujo ? m.m3.q : 0, 2)} L/min`;
      $('#g-hr').textContent = `${fmt(proceso.p.HR, 0)} %`;
      $('#g-amb').textContent = `${fmt(est.O3amb, 3)} ppm`;
      $('#g-ts').textContent = `${fmt(est.Tsus, 1)} °C`;
    } else if (tabActiva === 'resultado') {
      G.curvaCaso($('#c-res'), proceso);
      const c = proceso.caso;
      const r = c.resultado;
      const aviso = $('#aviso-ref');
      if (c.id === 'libre') {
        aviso.dataset.tipo = 'no';
        aviso.textContent = 'Modo libre: el simulador no predice la inactivación sin un resultado informado.';
      } else if (!proceso.referenciaAplicable) {
        aviso.dataset.tipo = 'no';
        aviso.textContent = 'Cambió el gas o el modo respecto del caso: la curva queda como referencia y no describe estas condiciones.';
      } else if (est.fase === 'tratamiento' && !est.plasma) {
        aviso.dataset.tipo = 'no';
        aviso.textContent = 'Sin descarga: el tiempo de exposición no avanza.';
      } else {
        aviso.dataset.tipo = 'si';
        aviso.textContent =
          c.cinetica === 'informada'
            ? 'Curva con la cinética de primer orden informada por los autores; el punto marca el valor informado.'
            : 'Solo el punto final es un dato del estudio; la trayectoria es de primer orden (supuesto).';
      }
      const filas = [`<tr><th>Exposición con descarga</th><td>${fmtDuracion(proceso.tTrat)}</td></tr>`];
      const v = proceso.progreso;
      if (r.tipo === 'log') {
        filas.push(`<tr><th>Reducción, R</th><td>${fmt(v, 2)} log</td></tr>`);
        filas.push(`<tr><th>Inactivación (Ecuación 2)</th><td>${fmt(F.inactivacionPct(v), v > 4 ? 4 : 2)} %</td></tr>`);
        filas.push(`<tr><th>Fracción sobreviviente, N/N₀</th><td>${v > 0 ? `10<sup>−${fmt(v, 2)}</sup>` : '1'}</td></tr>`);
        $('#res-ec').innerHTML = 'R = log₁₀(N₀/N) · I = (1 − 10<sup>−R</sup>) × 100';
      } else if (r.tipo === 'pct') {
        if (r.valor < 0) {
          filas.push(`<tr><th>Variación de la toxina (Ecuación 3)</th><td>+${fmt(-v, 1)} %</td></tr>`);
        } else {
          filas.push(`<tr><th>Degradación</th><td>${fmt(v, 1)} %</td></tr>`);
          filas.push(`<tr><th>Fracción remanente</th><td>${fmt(100 - v, 1)} %</td></tr>`);
        }
        $('#res-ec').innerHTML = 'ΔC = (C<sub>f</sub> − C₀)/C₀ × 100';
      } else {
        filas.push(`<tr><th>Resultado informado</th><td style="white-space:normal;text-align:right">${esc(r.texto)}</td></tr>`);
        $('#res-ec').innerHTML = 'Sin valor numérico en la revisión.';
      }
      filas.push(`<tr><th>Valor informado</th><td style="white-space:normal;text-align:right">${esc(r.texto)}</td></tr>`);
      $('#res-tabla').innerHTML = filas.join('');
    }
  }

  // ---------------- Tarjeta de pieza ----------------
  function mostrarParte(id) {
    const pz = PARTES[id];
    const el = $('#pieza');
    if (!pz) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    const resp =
      pz.respaldo === 'revision'
        ? `<b>Respaldo bibliográfico:</b> ${esc(cita(pz.ref))}.`
        : '<b>Decisión de ingeniería:</b> la revisión no especifica este componente.';
    el.innerHTML = `
      <header>
        <span class="num">${pz.n ?? ''}</span>
        <div><div class="grupo">${esc(pz.grupo)}${pz.tag ? ' · ' + esc(pz.tag) : ''}</div><h4>${esc(pz.nombre)}</h4></div>
        <button type="button" class="cerrar" aria-label="Cerrar">✕</button>
      </header>
      <dl><dt>Material</dt><dd>${esc(pz.material)}</dd><dt>Función</dt><dd>${esc(pz.funcion)}</dd></dl>
      <div class="respaldo">${resp}</div>`;
    el.querySelector('.cerrar').addEventListener('click', () => alSeleccionarParte(null));
  }

  // ---------------- Ficha técnica ----------------
  const ficha = $('#ficha');
  const marcaResp = (r) => `<span class="marca-resp" data-r="${r}">${r === 'revision' ? 'Revisión' : 'Ingeniería'}</span>`;
  const secciones = {
    experimento: () => {
      const E = EXPERIMENTO;
      const total = PASOS.reduce((a, x) => a + x.duracionSeg, 0);
      return `
      <p><b>${esc(E.titulo)}.</b> ${esc(E.pregunta)}</p>
      <div class="tabla-ficha-wrap"><table class="tabla-ficha">
        <tbody>
          <tr><th>Hipótesis</th><td>${esc(E.hipotesis)}</td></tr>
          <tr><th>Caso de referencia</th><td>${esc(E.casoReferencia || '')}</td></tr>
          <tr><th>Variable independiente</th><td>${esc(E.variableIndependiente)}</td></tr>
          <tr><th>Variables dependientes</th><td>${E.variablesDependientes.map(esc).join('<br>')}</td></tr>
          <tr><th>Variables controladas</th><td>${E.variablesControladas.map(esc).join('<br>')}</td></tr>
          <tr><th>Control</th><td>${esc(E.control || '')}</td></tr>
          <tr><th>Réplicas</th><td>${esc(E.replicas || '')}</td></tr>
        </tbody>
      </table></div>
      <h3>Recorrido de la presentación (${fmtDuracion(total)})</h3>
      <div class="tabla-ficha-wrap"><table class="tabla-ficha">
        <thead><tr><th>N.º</th><th>Etapa</th><th>Paso</th><th>Tiempo</th><th>En pantalla</th></tr></thead>
        <tbody>${PASOS.map((x, i) => `<tr><td class="mono">${i + 1}</td><td>${esc(x.fase)}</td><td>${esc(x.titulo)}</td><td class="mono">${fmt(x.duracionSeg, 0)} s</td><td>${esc(x.textoPantalla)}</td></tr>`).join('')}</tbody>
      </table></div>
      ${E.respaldo?.length ? `<h3>Respaldo</h3><ul class="lista-simple">${E.respaldo.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}`;
    },
    diseno: () => `
      <p>Banco de descarga de barrera dieléctrica (DBD) a presión atmosférica, de escala de laboratorio, para tratar lotes de alimentos o residuos con plasma frío. Se eligió la DBD porque es la configuración con más evidencia en la revisión, enciende con una tensión del orden de 10 kV, opera con aire, N₂, Ar o He y admite el tratamiento dentro del envase. A presión atmosférica se prescinde del equipo de vacío, y sin magnetrón se evita la alta inversión de las descargas de microondas (Okyere et al., 2022; Keramat y Golmakani, 2025).</p>
      <p>Cada instrumento responde a una variable que la revisión identifica como determinante: el gas, la humedad, la distancia, el tiempo, la masa, la temperatura del sustrato y la energía entregada.</p>
      <div class="tabla-ficha-wrap"><table class="tabla-ficha">
        <thead><tr><th>Parámetro</th><th>Valor de diseño</th><th>Respaldo</th><th>Nota</th></tr></thead>
        <tbody>${ESPECIFICACIONES.map((e) => `<tr><td>${esc(e.parametro)}</td><td>${esc(e.valor)}</td><td>${marcaResp(e.respaldo)}<br><span class="cita">${esc(cita(e.ref))}</span></td><td>${esc(e.nota)}</td></tr>`).join('')}</tbody>
      </table></div>
      <h3>Secuencia de operación</h3>
      <ol class="lista-simple">
        <li><b>Purga:</b> tres volúmenes de cámara con el gas de trabajo (≈ ${fmt((3 * BANCO.volCamara) / 2, 1)} min a 2 L/min); en modo envase, barrido y sellado.</li>
        <li><b>Rampa de tensión</b> hasta el valor fijado; la descarga enciende cuando la tensión del gas supera la de ruptura.</li>
        <li><b>Tratamiento</b> durante el tiempo de exposición, con registro de V, I, Q–V, espectro, temperaturas y ozono.</li>
        <li><b>Post-purga</b> hasta evacuar el ozono por el destructor catalítico; en modo envase, el envase queda sellado con las especies.</li>
        <li><b>Análisis:</b> recuento en placa, pH, actividad de agua, color, cromatografía y toxicidad, según el caso.</li>
      </ol>`,
    partes: () => `
      <p>Las piezas numeradas corresponden al despiece de la celda del reactor (use el control «Despiece» de la escena).</p>
      <div class="tabla-ficha-wrap"><table class="tabla-ficha">
        <thead><tr><th>N.º</th><th>Pieza</th><th>Material</th><th>Función</th><th>Respaldo</th></tr></thead>
        <tbody>${Object.values(PARTES)
          .filter((x) => x.grupo !== 'Entorno')
          .sort((a, b) => (a.n ?? 99) - (b.n ?? 99))
          .map((x) => `<tr><td class="mono">${x.n ?? '—'}</td><td>${esc(x.nombre)}</td><td>${esc(x.material)}</td><td>${esc(x.funcion)}</td><td>${marcaResp(x.respaldo)}${x.ref.length ? `<br><span class="cita">${esc(cita(x.ref))}</span>` : ''}</td></tr>`)
          .join('')}</tbody>
      </table></div>`,
    instrumentos: () => `
      <div class="tabla-ficha-wrap"><table class="tabla-ficha">
        <thead><tr><th>Etiqueta</th><th>Variable</th><th>Principio</th><th>Rango</th><th>Ubicación</th><th>Por qué se mide</th></tr></thead>
        <tbody>${INSTRUMENTOS.map((i) => `<tr><td class="mono">${esc(i.tag)}</td><td>${esc(i.variable)}</td><td>${esc(i.principio)}</td><td>${esc(i.rango)}</td><td>${esc(i.ubicacion)}</td><td>${esc(i.porque)}${i.ref.length ? `<br><span class="cita">${esc(cita(i.ref))}</span>` : ''}</td></tr>`).join('')}</tbody>
      </table></div>
      <h3>Análisis fuera de línea</h3>
      <div class="tabla-ficha-wrap"><table class="tabla-ficha">
        <thead><tr><th>Análisis</th><th>Para qué</th><th>Fuente</th></tr></thead>
        <tbody>${ANALISIS_FUERA_DE_LINEA.map((a) => `<tr><td>${esc(a.analisis)}</td><td>${esc(a.para)}</td><td class="cita">${esc(cita(a.ref))}</td></tr>`).join('')}</tbody>
      </table></div>`,
    cobertura: () => {
      const cuenta = { dentro: 0, parcial: 0, fuera: 0 };
      CASOS.forEach((c) => cuenta[c.cobertura.estado]++);
      return `
      <p>Clasificación de cada caso de las Tablas 3 y 4 del informe (más la decloración de PVC) frente a los límites del banco: DBD plano-paralela, 0 a 30 kV, hasta 500 W, separación de 1 a 20 mm y gases Aire, N₂, O₂, CO₂, Ar y He. Resultado: ${cuenta.dentro} dentro del alcance, ${cuenta.parcial} parciales y ${cuenta.fuera} fuera del alcance. La mayoría queda en «parcial» porque la revisión no informa todas las condiciones de operación, lo que coincide con la heterogeneidad señalada en el informe.</p>
      <div class="tabla-ficha-wrap"><table class="tabla-ficha">
        <thead><tr><th>Caso</th><th>Equipo del estudio</th><th>Resultado informado</th><th>Cobertura</th><th>Motivos</th></tr></thead>
        <tbody>${CASOS.map((c) => `<tr><td>${esc(c.nombre)}<br><span class="cita">${esc(cita(c.ref))}</span></td><td>${esc(c.config)}</td><td>${esc(c.resultado.texto)}</td><td><span class="chip" data-estado="${c.cobertura.estado}"><i></i>${ESTADO_COB[c.cobertura.estado]}</span></td><td>${c.cobertura.motivos.map(esc).join('<br>')}</td></tr>`).join('')}</tbody>
      </table></div>`;
    },
    supuestos: () => `
      <h3>Supuestos de ingeniería</h3>
      <p>Lo que no proviene de la revisión bibliográfica se declara aquí. Las lecturas del simulador son didácticas: muestran tendencias y órdenes de magnitud, no predicciones.</p>
      <ul class="lista-simple">${SUPUESTOS.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <h3>Seguridad</h3>
      <div class="tabla-ficha-wrap"><table class="tabla-ficha">
        <thead><tr><th>Riesgo</th><th>Medida en el banco</th><th>Fuente</th></tr></thead>
        <tbody>${SEGURIDAD.map((s) => `<tr><td>${esc(s.riesgo)}</td><td>${esc(s.medida)}</td><td class="cita">${esc(cita(s.ref))}</td></tr>`).join('')}</tbody>
      </table></div>`,
    referencias: () => `
      <ol class="refs">${Object.values(REFS)
        .sort((a, b) => a.apa.localeCompare(b.apa, 'es'))
        .map((r) => `<li>${esc(r.apa)} <a href="${r.doi}" target="_blank" rel="noopener">${esc(r.doi)}</a></li>`)
        .join('')}</ol>`,
  };
  ficha.innerHTML = `
    <div class="ficha-cab"><h2 id="ficha-titulo">Ficha técnica del banco</h2><button type="button" class="cerrar" aria-label="Cerrar ficha">✕</button></div>
    <div class="pestanas" role="tablist">
      <button type="button" role="tab" data-f="experimento" aria-selected="true">Experimento</button>
      <button type="button" role="tab" data-f="diseno" aria-selected="false">Diseño</button>
      <button type="button" role="tab" data-f="partes" aria-selected="false">Lista de partes</button>
      <button type="button" role="tab" data-f="instrumentos" aria-selected="false">Instrumentos</button>
      <button type="button" role="tab" data-f="cobertura" aria-selected="false">Cobertura de la literatura</button>
      <button type="button" role="tab" data-f="supuestos" aria-selected="false">Supuestos y seguridad</button>
      <button type="button" role="tab" data-f="referencias" aria-selected="false">Referencias</button>
    </div>
    <div class="ficha-cuerpo" id="ficha-cuerpo"></div>`;
  const mostrarFicha = (id) => {
    ficha.querySelectorAll('[data-f]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.f === id)));
    $('#ficha-cuerpo').innerHTML = secciones[id]();
  };
  ficha.querySelectorAll('[data-f]').forEach((b) => b.addEventListener('click', () => mostrarFicha(b.dataset.f)));
  ficha.querySelector('.cerrar').addEventListener('click', () => ficha.close());
  $('#btn-ficha').addEventListener('click', () => {
    mostrarFicha('experimento');
    ficha.showModal();
  });

  sincronizarControles();
  actualizarBotones();
  return { actualizar, mostrarParte, sincronizarControles, elegirTab };
}
