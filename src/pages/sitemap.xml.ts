const SITE = 'https://www.fonchi.com.ar';

const logs = Object.entries(import.meta.glob('../logs/*.md', { eager: true }))
  .map(([path, log]: [string, any]) => ({
    slug: path.split('/').pop()?.replace(/\.md$/, '') || '',
    date: String(log.frontmatter?.date || ''),
  }))
  .filter((log) => log.slug && /^\d{4}-\d{2}-\d{2}$/.test(log.date))
  .sort((a, b) => b.date.localeCompare(a.date));

const ensayos = Object.entries(import.meta.glob('../ensayos/*.md', { eager: true }))
  .map(([path, e]: [string, any]) => ({
    slug: path.split('/').pop()?.replace(/\.md$/, '') || '',
    date: String(e.frontmatter?.date || ''),
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

export function GET() {
  const latestDate = logs[0]?.date || new Date().toISOString().slice(0, 10);
  const entries = [
    urlEntry('/', latestDate),
    ...logs.map((log) => urlEntry(`/log/${log.slug}/`, log.date)),
    urlEntry('/ensayos/', ensayos[0]?.date || latestDate),
    ...ensayos.map((e) => urlEntry(`/ensayos/${e.slug}/`, e.date)),
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
