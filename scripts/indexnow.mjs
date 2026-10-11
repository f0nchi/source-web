import { pathToFileURL } from 'node:url';

const HOST = 'www.fonchi.com.ar';
const KEY = '335b4273c0e815f4beff4c043796687e';

export function extraerUrls(sitemap) {
    return [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
        .map((match) => match[1].trim())
        .filter(Boolean);
}

export function crearPayload(urls) {
    return {
        host: HOST,
        key: KEY,
        keyLocation: `https://${HOST}/${KEY}.txt`,
        urlList: urls,
    };
}

export async function avisarIndexNow(fetchImpl = fetch) {
    const sitemapResponse = await fetchImpl(`https://${HOST}/sitemap.xml`);
    if (!sitemapResponse.ok) {
        throw new Error(`No se pudo leer el sitemap: HTTP ${sitemapResponse.status}`);
    }

    const urls = extraerUrls(await sitemapResponse.text());
    if (urls.length === 0) {
        throw new Error('El sitemap no contiene URLs para avisar.');
    }

    const response = await fetchImpl('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(crearPayload(urls)),
    });

    console.log(`IndexNow: ${urls.length} URLs, HTTP ${response.status}`);
    if (response.status !== 200 && response.status !== 202) {
        const detalle = await response.text().catch(() => '');
        throw new Error(`IndexNow rechazó el aviso: HTTP ${response.status} ${detalle}`.trim());
    }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    await avisarIndexNow();
}
