import FECHAS from '../generated/fechas-del-sitio.json';

const SITE = 'https://www.fonchi.com.ar';

// Último commit de cada archivo (scripts/fechas-del-sitio.mjs, antes del build).
const COMMITS: Record<string, string> = FECHAS.archivos;

// La más reciente entre la fecha de publicación y las de los commits.
function masReciente(...fechas: (string | undefined)[]) {
  return fechas.filter((f): f is string => Boolean(f)).sort().pop() || '';
}

const logs = Object.entries(import.meta.glob('../logs/*.md', { eager: true }))
  .map(([path, log]: [string, any]) => ({
    slug: path.split('/').pop()?.replace(/\.md$/, '') || '',
    date: String(log.frontmatter?.date || ''),
    archivo: `src/logs/${path.split('/').pop()}`,
  }))
  .filter((log) => log.slug && /^\d{4}-\d{2}-\d{2}$/.test(log.date))
  .sort((a, b) => b.date.localeCompare(a.date));

const ensayos = Object.entries(import.meta.glob('../ensayos/*.md', { eager: true }))
  .map(([path, e]: [string, any]) => ({
    slug: path.split('/').pop()?.replace(/\.md$/, '') || '',
    date: String(e.frontmatter?.date || ''),
    archivo: `src/ensayos/${path.split('/').pop()}`,
  }))
  .filter((e) => e.slug && /^\d{4}-\d{2}-\d{2}$/.test(e.date))
  .sort((a, b) => b.date.localeCompare(a.date));

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function urlEntry(path: string, lastmod: string) {
  return [
    '  <url>',
    `    <loc>${escapeXml(new URL(path, SITE).toString())}</loc>`,
    `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
    '  </url>',
  ].join('\n');
}

const TAMANO_PAGINA = 10;

function paginasDeRegistro(): string[] {
  const lastPage = Math.max(1, Math.ceil(logs.length / TAMANO_PAGINA));
  const entries: string[] = [];
  for (let p = 2; p <= lastPage; p++) {
    const primeraEntradaDeLaPagina = logs[(p - 1) * TAMANO_PAGINA];
    entries.push(urlEntry(`/log/pagina/${p}/`, primeraEntradaDeLaPagina?.date || logs[0]?.date || ''));
  }
  return entries;
}

export function GET() {
  const latestDate = logs[0]?.date || new Date().toISOString().slice(0, 10);
  const entries = [
    urlEntry('/', masReciente(latestDate, COMMITS['src/pages/index.astro'])),
    ...logs.map((log) => urlEntry(`/log/${log.slug}/`, masReciente(log.date, COMMITS[log.archivo]))),
    ...paginasDeRegistro(),
    urlEntry('/ensayos/', masReciente(ensayos[0]?.date || latestDate, COMMITS['src/pages/ensayos/index.astro'])),
    ...ensayos.map((e) => urlEntry(`/ensayos/${e.slug}/`, masReciente(e.date, COMMITS[e.archivo]))),
  ];
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
