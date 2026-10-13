// Calcula la fecha del último commit de cada archivo que es contenido del
// sitio (entradas del registro, ensayos y las páginas de portada) y la deja en
// src/generated/fechas-del-sitio.json. El sitemap la usa para que <lastmod>
// diga cuándo cambió cada página de verdad, también cuando se corrige una
// entrada ya publicada.
//
// Corre antes del build. Si el historial de git no está completo y no se puede
// completar, escribe el archivo vacío y el sitemap usa solo la fecha de
// publicación de cada entrada.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = join(RAIZ, 'src/generated/fechas-del-sitio.json');
const CARPETAS = ['src/logs', 'src/ensayos'];
const PAGINAS = ['src/pages/index.astro', 'src/pages/ensayos/index.astro'];

function git(args) {
    return execFileSync('git', args, { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

export function historiaCompleta() {
    try {
        if (git(['rev-parse', '--is-shallow-repository']) === 'true') {
            console.log('fechas del sitio: el clon viene recortado, se completa el historial.');
            git(['fetch', '--unshallow', '--quiet']);
        }
        return git(['rev-parse', '--is-shallow-repository']) === 'false';
    } catch (error) {
        console.warn(`fechas del sitio: no se pudo leer el historial completo (${error.message.split('\n')[0]}).`);
        return false;
    }
}

// La fecha del commit en la zona de quien lo hizo: "2026-10-12T22:40:22-03:00" → "2026-10-12".
export function diaDelCommit(iso) {
    return /^\d{4}-\d{2}-\d{2}/.test(iso) ? iso.slice(0, 10) : null;
}

export function calcularFechas() {
    if (!historiaCompleta()) return { completa: false, archivos: {} };
    const archivos = {};
    const rutas = [
        ...CARPETAS.flatMap((carpeta) =>
            readdirSync(join(RAIZ, carpeta))
                .filter((nombre) => nombre.endsWith('.md'))
                .map((nombre) => `${carpeta}/${nombre}`)
        ),
        ...PAGINAS,
    ];
    for (const ruta of rutas) {
        const dia = diaDelCommit(git(['log', '-1', '--format=%cI', '--', ruta]));
        if (dia) archivos[ruta] = dia;
    }
    return { completa: true, archivos };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const fechas = calcularFechas();
    mkdirSync(dirname(SALIDA), { recursive: true });
    writeFileSync(SALIDA, `${JSON.stringify(fechas, null, 2)}\n`);
    console.log(
        fechas.completa
            ? `fechas del sitio: ${Object.keys(fechas.archivos).length} archivos con su fecha real.`
            : 'fechas del sitio: sin historial completo, el sitemap usa las fechas de publicación.'
    );
}
