// Compila el modelo en un único HTML autocontenido (dist/) y genera la ficha técnica en Markdown (docs/).
// Uso: node build.mjs [--watch] [--artifact <ruta.html>]
import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { watch } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const iArt = args.indexOf('--artifact');
const rutaArtifact = iArt >= 0 ? path.resolve(args[iArt + 1]) : null;
const THREE_VERSION = '0.170.0';

const seguro = (js) => js.replace(/<\/script/gi, '<\\/script');

async function empaquetar({ externo }) {
  const r = await build({
    entryPoints: [path.join(raiz, 'src/main.js')],
    bundle: true,
    write: false,
    minify: true,
    format: externo ? 'esm' : 'iife',
    target: ['es2020'],
    external: externo ? ['three', 'three/addons/*'] : [],
    legalComments: externo ? 'none' : 'eof', // conserva la licencia MIT de Three.js en el HTML autocontenido
    logLevel: 'warning',
  });
  return r.outputFiles[0].text;
}

async function compilar() {
  const plantilla = await readFile(path.join(raiz, 'src/index.html'), 'utf8');
  const corte = plantilla.indexOf('<div id="app">');
  const cabeza = plantilla.slice(0, corte);
  const cuerpo = plantilla.slice(corte);

  // 1) HTML autocontenido: funciona sin conexión y con doble clic (file://).
  const js = await empaquetar({ externo: false });
  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Banco de plasma frío DBD en 3D: entorno, despiece, instrumentación y simulación didáctica basada en la revisión bibliográfica del seminario «Pirólisis en frío».">
${cabeza}</head>
<body>
${cuerpo.replace('<!--APP-->', () => `<script>${seguro(js)}</script>`)}
</body>
</html>
`;
  await mkdir(path.join(raiz, 'dist'), { recursive: true });
  await writeFile(path.join(raiz, 'dist/pirolisis-en-frio-3d.html'), html);
  console.log(`dist/pirolisis-en-frio-3d.html · ${(html.length / 1024).toFixed(0)} KB`);

  // 2) Versión para publicar como artifact: Three.js desde jsDelivr con versión fija.
  if (rutaArtifact) {
    const jsExt = await empaquetar({ externo: true });
    const mapa = {
      imports: {
        three: `https://cdn.jsdelivr.net/npm/three@${THREE_VERSION}/build/three.module.js`,
        'three/addons/': `https://cdn.jsdelivr.net/npm/three@${THREE_VERSION}/examples/jsm/`,
      },
    };
    const frag = plantilla.replace(
      '<!--APP-->',
      () => `<script type="importmap">${JSON.stringify(mapa)}</script>\n<script type="module">${seguro(jsExt)}</script>`,
    );
    await mkdir(path.dirname(rutaArtifact), { recursive: true });
    await writeFile(rutaArtifact, frag);
    console.log(`${path.relative(raiz, rutaArtifact)} · ${(frag.length / 1024).toFixed(0)} KB`);
  }

  await fichaMarkdown();
}

// Ficha técnica en Markdown a partir de los mismos datos del modelo.
async function fichaMarkdown() {
  const v = `?v=${Date.now()}`;
  const { ESPECIFICACIONES, PARTES, INSTRUMENTOS, ANALISIS_FUERA_DE_LINEA, SUPUESTOS, SEGURIDAD } = await import(`./src/data/banco.js${v}`);
  const { CASOS } = await import(`./src/data/casos.js${v}`);
  const { REFS, cita } = await import(`./src/data/referencias.js${v}`);
  const celda = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
  const resp = (r) => (r === 'revision' ? 'Revisión' : 'Ingeniería');
  const est = { dentro: 'Dentro del alcance', parcial: 'Parcial', fuera: 'Fuera del alcance' };
  const md = [];
  md.push('# Ficha técnica · Banco DBD de pirólisis en frío', '');
  md.push('Documento generado por `build.mjs` a partir de `src/data/`. Respaldo «Revisión» = dato o requisito tomado del informe del seminario; «Ingeniería» = decisión de diseño propia, declarada como supuesto.', '');
  md.push('## Especificaciones', '', '| Parámetro | Valor de diseño | Respaldo | Nota |', '|---|---|---|---|');
  for (const e of ESPECIFICACIONES) md.push(`| ${celda(e.parametro)} | ${celda(e.valor)} | ${resp(e.respaldo)}${e.ref.length ? `: ${celda(cita(e.ref))}` : ''} | ${celda(e.nota)} |`);
  md.push('', '## Lista de partes', '', '| N.º | Pieza | Grupo | Material | Función | Respaldo |', '|---|---|---|---|---|---|');
  for (const p of Object.values(PARTES).filter((x) => x.grupo !== 'Entorno').sort((a, b) => (a.n ?? 99) - (b.n ?? 99)))
    md.push(`| ${p.n ?? '—'} | ${celda(p.nombre)} | ${celda(p.grupo)} | ${celda(p.material)} | ${celda(p.funcion)} | ${resp(p.respaldo)}${p.ref.length ? `: ${celda(cita(p.ref))}` : ''} |`);
  md.push('', '## Instrumentación', '', '| Etiqueta | Variable | Principio | Rango | Ubicación | Por qué se mide |', '|---|---|---|---|---|---|');
  for (const i of INSTRUMENTOS) md.push(`| ${celda(i.tag)} | ${celda(i.variable)} | ${celda(i.principio)} | ${celda(i.rango)} | ${celda(i.ubicacion)} | ${celda(i.porque)}${i.ref.length ? ` Fuente: ${celda(cita(i.ref))}.` : ''} |`);
  md.push('', '### Análisis fuera de línea', '', '| Análisis | Para qué | Fuente |', '|---|---|---|');
  for (const a of ANALISIS_FUERA_DE_LINEA) md.push(`| ${celda(a.analisis)} | ${celda(a.para)} | ${celda(cita(a.ref))} |`);
  md.push('', '## Cobertura de los casos de la literatura', '', '| Caso | Equipo del estudio | Resultado informado | Cobertura | Motivos |', '|---|---|---|---|---|');
  for (const c of CASOS) md.push(`| ${celda(c.nombre)}. ${celda(cita(c.ref))} | ${celda(c.config)} | ${celda(c.resultado.texto)} | ${est[c.cobertura.estado]} | ${celda(c.cobertura.motivos.join(' '))} |`);
  md.push('', '## Supuestos de ingeniería', '');
  for (const s of SUPUESTOS) md.push(`- ${s}`);
  md.push('', '## Seguridad', '', '| Riesgo | Medida | Fuente |', '|---|---|---|');
  for (const s of SEGURIDAD) md.push(`| ${celda(s.riesgo)} | ${celda(s.medida)} | ${celda(cita(s.ref))} |`);
  md.push('', '## Referencias', '');
  for (const r of Object.values(REFS).sort((a, b) => a.apa.localeCompare(b.apa, 'es'))) md.push(`- ${r.apa} ${r.doi}`);
  md.push('');
  await mkdir(path.join(raiz, 'docs'), { recursive: true });
  await writeFile(path.join(raiz, 'docs/ficha-tecnica.md'), md.join('\n'));
  console.log('docs/ficha-tecnica.md');
}

await compilar();

if (args.includes('--watch')) {
  let espera = null;
  watch(path.join(raiz, 'src'), { recursive: true }, () => {
    clearTimeout(espera);
    espera = setTimeout(() => compilar().catch((e) => console.error(e.message)), 150);
  });
  console.log('Observando src/ …');
}
