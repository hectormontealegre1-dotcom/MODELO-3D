// Modo «Presentar»: portada del experimento y recorrido guiado de 10 pasos con cronómetro.
// Cada paso parte de un estado definido (vista, caso, fase del proceso, capas), así que
// avanzar, retroceder o saltar a un paso deja el modelo siempre coherente.
import { fmtTiempo } from './formato.js';
import { VELOCIDADES } from '../sim/proceso.js';

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// «Etiqueta: texto» se muestra con la etiqueta destacada.
const linea = (l) => {
  const i = l.indexOf(': ');
  return i > 0 && i < 40 ? `<b>${esc(l.slice(0, i))}</b> ${esc(l.slice(i + 2))}` : esc(l);
};

export function crearPresentacion({ experimento, pasos, ctx }) {
  const app = $('#app');
  const total = pasos.reduce((a, p) => a + p.duracionSeg, 0);
  let activo = false;
  let idx = 0;
  let tPaso = 0;
  let tTotal = 0;

  // ---------------- Portada ----------------
  const portada = document.createElement('section');
  portada.className = 'portada';
  portada.id = 'portada';
  portada.setAttribute('aria-labelledby', 'portada-titulo');
  portada.innerHTML = `
    <div class="portada-tarjeta">
      <p class="eyebrow">Seminario «Pirólisis en frío» · Experimento de banco</p>
      <h1 id="portada-titulo">${esc(experimento.tituloCorto)}</h1>
      <p class="subtitulo">${esc(experimento.titulo)}</p>
      <p class="pregunta">${esc(experimento.pregunta)}</p>
      <div class="hipotesis"><b>Hipótesis</b><span>${esc(experimento.hipotesis)}</span></div>
      <dl class="variables">
        <div><dt>Variable independiente</dt><dd>${experimento.resumen.independiente.map(esc).join('<br>')}</dd></div>
        <div><dt>Variables dependientes</dt><dd>${experimento.resumen.dependientes.map(esc).join('<br>')}</dd></div>
        <div><dt>Variables controladas</dt><dd>${experimento.resumen.controladas.map(esc).join('<br>')}</dd></div>
      </dl>
      <div class="portada-acciones">
        <button type="button" class="boton primario grande" id="btn-portada-presentar">Presentar · ${Math.round(total / 60)} min</button>
        <button type="button" class="boton grande" id="btn-portada-explorar">Explorar el modelo</button>
      </div>
      <p class="nota">Modelo explicativo construido solo con la revisión bibliográfica del seminario. Lo que no proviene de ella se declara como supuesto de ingeniería en la «Ficha técnica». Durante el recorrido: → o Espacio avanza, ← retrocede, N muestra las notas del orador y Esc sale.</p>
    </div>`;
  app.appendChild(portada);

  // ---------------- Barra del recorrido ----------------
  const barra = document.createElement('section');
  barra.className = 'barra-pres';
  barra.id = 'barra-pres';
  barra.hidden = true;
  barra.setAttribute('aria-label', 'Recorrido del experimento');
  barra.style.setProperty('--n', pasos.length);
  barra.innerHTML = `
    <div class="bp-segmentos" role="tablist" aria-label="Pasos">
      ${pasos.map((p, i) => `<button type="button" class="bp-seg" role="tab" data-i="${i}" title="${i + 1}. ${esc(p.titulo)}" aria-label="Paso ${i + 1}: ${esc(p.titulo)}"><i></i></button>`).join('')}
    </div>
    <div class="bp-cuerpo">
      <div class="bp-meta"><span class="bp-num" id="bp-num">1</span><span class="bp-de">de ${pasos.length}</span><span class="bp-fase" id="bp-fase"></span></div>
      <div class="bp-texto" aria-live="polite"><h2 id="bp-titulo"></h2><p id="bp-desc"></p></div>
      <div class="bp-ctrl">
        <div class="bp-reloj"><time id="bp-reloj">00:00</time><small>de ${fmtTiempo(total)}</small></div>
        <button type="button" class="boton" id="bp-notas" aria-pressed="false" title="Notas del orador (N)">Notas</button>
        <button type="button" class="boton" id="bp-ant" aria-label="Paso anterior">←</button>
        <button type="button" class="boton primario" id="bp-sig">Siguiente →</button>
        <button type="button" class="boton" id="bp-salir">Salir</button>
      </div>
    </div>`;
  app.appendChild(barra);

  const tarjeta = document.createElement('section');
  tarjeta.className = 'tarjeta-paso';
  tarjeta.id = 'tarjeta-paso';
  tarjeta.hidden = true;
  app.appendChild(tarjeta);

  const notas = document.createElement('section');
  notas.className = 'notas-orador';
  notas.id = 'notas-orador';
  notas.hidden = true;
  notas.setAttribute('aria-label', 'Notas del orador');
  app.appendChild(notas);
  let verNotas = false;
  function pintarNotas() {
    const paso = pasos[idx];
    notas.hidden = !(activo && verNotas);
    $('#bp-notas').setAttribute('aria-pressed', String(verNotas));
    notas.innerHTML = `<header><b>Notas del orador · paso ${idx + 1}</b><small>${paso.duracionSeg} s sugeridos</small></header>
      <p>${esc(paso.guionOral)}</p>
      <dl><dt>Qué mostrar</dt><dd>${esc(paso.queMirar || '')}</dd><dt>Mensaje clave</dt><dd>${esc(paso.mensajeClave || '')}</dd></dl>`;
  }
  const alternarNotas = () => {
    verNotas = !verNotas;
    pintarNotas();
  };

  const segs = [...barra.querySelectorAll('.bp-seg')];

  // ---------------- Pasos ----------------
  function velocidadPara(segundosSim, segundosReales) {
    const v = segundosSim / Math.max(1, segundosReales);
    let elegida = VELOCIDADES[0];
    for (const c of VELOCIDADES) if (c <= v) elegida = c;
    return Math.max(1, elegida);
  }

  function aplicar(i) {
    idx = Math.max(0, Math.min(pasos.length - 1, i));
    tPaso = 0;
    const paso = pasos[idx];
    const a = paso.acciones || {};
    const p = ctx.proceso;

    // Estado de partida limpio
    if (p.paro) p.pararEmergencia();
    if (p.puertaAbierta) p.alternarPuerta();
    if (a.caso) p.set('caso', a.caso);
    if (a.gas && p.p.gas !== a.gas) p.set('gas', a.gas);
    ctx.fijarDespiece(a.despiece ?? 0);
    ctx.fijarCorte(a.corte ?? false);
    ctx.fijarLupa(a.lupa ?? false);
    if (a.vista) ctx.irA(a.vista);

    // Proceso: los estados con descarga corren en vivo; los demás quedan fijos
    const fase = a.proceso || 'reposo';
    p.irAFase(fase, a.avance ?? 0);
    if (fase === 'tratamiento') {
      const restante = Math.max(0, 0.95 - (a.avance ?? 0)) * p.p.t;
      p.p.velocidad = velocidadPara(restante, paso.duracionSeg * 0.7);
    }
    p.pausado = !(fase === 'tratamiento' || fase === 'purga');
    if (a.puerta === 'abrir') p.alternarPuerta();
    p.emitir('fase');

    ctx.seleccionar(a.resaltar || null);
    ctx.mostrarPanel(a.panel === 'instrumentos' ? a.tab || 'electrico' : null);

    if (a.tarjeta) {
      tarjeta.hidden = false;
      tarjeta.innerHTML = `<h3>${esc(a.tarjeta.titulo)}</h3><ul>${a.tarjeta.lineas.map((l) => `<li>${linea(l)}</li>`).join('')}</ul>`;
    } else {
      tarjeta.hidden = true;
    }

    $('#bp-num').textContent = String(idx + 1);
    $('#bp-fase').textContent = paso.fase;
    $('#bp-titulo').textContent = paso.titulo;
    $('#bp-desc').textContent = paso.textoPantalla;
    $('#bp-ant').disabled = idx === 0;
    $('#bp-sig').textContent = idx === pasos.length - 1 ? 'Terminar' : 'Siguiente →';
    pintarNotas();
    segs.forEach((s, j) => {
      s.dataset.estado = j < idx ? 'hecho' : j === idx ? 'activo' : 'pendiente';
      s.setAttribute('aria-selected', String(j === idx));
      s.dataset.excedido = '0';
      s.querySelector('i').style.width = j < idx ? '100%' : '0%';
    });
  }

  // reanudar = volver al paso en que se salió, conservando el cronómetro total
  function iniciar(desde = 0, reanudar = false) {
    activo = true;
    if (!reanudar) tTotal = 0;
    portada.hidden = true;
    barra.hidden = false;
    app.dataset.presentando = '1';
    $('#btn-presentar').textContent = 'Salir del recorrido';
    window.dispatchEvent(new Event('resize'));
    aplicar(desde);
    $('#bp-sig').focus();
  }

  function salir() {
    activo = false;
    barra.hidden = true;
    tarjeta.hidden = true;
    notas.hidden = true;
    app.dataset.presentando = '0';
    ctx.mostrarPanel(null);
    ctx.fijarLupa(true);
    ctx.proceso.pausado = false;
    ctx.proceso.emitir('fase');
    $('#btn-presentar').textContent = 'Presentar';
    window.dispatchEvent(new Event('resize'));
  }

  let terminado = false;
  const siguiente = () => {
    if (idx === pasos.length - 1) {
      terminado = true;
      salir();
    } else aplicar(idx + 1);
  };
  const anterior = () => aplicar(idx - 1);

  // ---------------- Eventos ----------------
  $('#btn-portada-presentar').addEventListener('click', () => {
    terminado = false;
    iniciar(0);
  });
  $('#btn-portada-explorar').addEventListener('click', () => {
    portada.hidden = true;
  });
  $('#bp-sig').addEventListener('click', siguiente);
  $('#bp-ant').addEventListener('click', anterior);
  $('#bp-salir').addEventListener('click', salir);
  $('#bp-notas').addEventListener('click', alternarNotas);
  segs.forEach((s) => s.addEventListener('click', () => aplicar(Number(s.dataset.i))));
  $('#btn-presentar').addEventListener('click', () => {
    if (activo) return salir();
    const reanudar = !terminado && (idx > 0 || tTotal > 0);
    terminado = false;
    iniciar(reanudar ? idx : 0, reanudar);
  });

  window.addEventListener('keydown', (e) => {
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA')) return;
    if ($('#ficha')?.open) return;
    if (!activo) {
      if (!portada.hidden && (e.key === 'Enter' || e.key === ' ') && t === document.body) {
        e.preventDefault();
        iniciar(0);
      }
      return;
    }
    if (['ArrowRight', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault();
      siguiente();
    } else if (['ArrowLeft', 'PageUp'].includes(e.key)) {
      e.preventDefault();
      anterior();
    } else if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      alternarNotas();
    } else if (e.key === 'Home') {
      e.preventDefault();
      aplicar(0);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      salir();
    }
  });

  // ---------------- Cada cuadro ----------------
  function actualizar(dt) {
    if (!activo) return;
    tPaso += dt;
    tTotal += dt;
    $('#bp-reloj').textContent = fmtTiempo(tTotal);
    const paso = pasos[idx];
    const seg = segs.at(idx);
    seg.querySelector('i').style.width = `${Math.min(100, (tPaso / paso.duracionSeg) * 100)}%`;
    seg.dataset.excedido = tPaso > paso.duracionSeg * 1.2 ? '1' : '0';
    // La descarga se mantiene encendida mientras se explica: el lote se detiene al 95 % del tiempo
    const p = ctx.proceso;
    if (p.fase === 'tratamiento' && !p.pausado && p.tFase >= 0.95 * p.p.t && (paso.acciones?.proceso === 'tratamiento')) {
      p.pausado = true;
      p.emitir('fase');
    }
  }

  return {
    iniciar,
    salir,
    actualizar,
    get activo() {
      return activo;
    },
  };
}
