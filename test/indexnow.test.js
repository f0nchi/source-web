import assert from 'node:assert/strict';
import test from 'node:test';

import { avisarIndexNow, crearPayload, extraerUrls } from '../scripts/indexnow.mjs';

test('IndexNow conserva las URLs del sitemap y la clave pública existente', () => {
    const urls = extraerUrls(`<?xml version="1.0"?>
        <urlset>
          <url><loc>https://www.fonchi.com.ar/</loc></url>
          <url><loc>https://www.fonchi.com.ar/ensayos/</loc></url>
        </urlset>`);
    const payload = crearPayload(urls);

    assert.deepEqual(urls, [
        'https://www.fonchi.com.ar/',
        'https://www.fonchi.com.ar/ensayos/',
    ]);
    assert.equal(payload.host, 'www.fonchi.com.ar');
    assert.equal(payload.key, '335b4273c0e815f4beff4c043796687e');
    assert.equal(payload.keyLocation, 'https://www.fonchi.com.ar/335b4273c0e815f4beff4c043796687e.txt');
});

test('IndexNow lee el sitemap antes de enviar el aviso', async () => {
    const llamadas = [];
    await avisarIndexNow(async (url, init) => {
        llamadas.push({ url, init });
        if (!init) {
            return new Response('<urlset><url><loc>https://www.fonchi.com.ar/</loc></url></urlset>');
        }
        return new Response('', { status: 202 });
    });

    assert.equal(llamadas[0].url, 'https://www.fonchi.com.ar/sitemap.xml');
    assert.equal(llamadas[1].url, 'https://api.indexnow.org/indexnow');
    assert.deepEqual(JSON.parse(llamadas[1].init.body).urlList, ['https://www.fonchi.com.ar/']);
});
