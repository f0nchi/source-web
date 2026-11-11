import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';

import worker from '../worker/index.js';
import { MUDANZAS } from '../worker/mudanzas.js';

const sinAssets = { ASSETS: { fetch: () => assert.fail('no debe pedir el asset antes de redirigir') } };

test('una dirección anterior lleva a la vigente, con y sin barra final', async () => {
    for (const [vieja, vigente] of Object.entries(MUDANZAS)) {
        for (const ruta of [vieja, `${vieja}/`]) {
            const response = await worker.fetch(new Request(`https://www.fonchi.com.ar${ruta}`), sinAssets);
            assert.equal(response.status, 301);
            assert.equal(response.headers.get('location'), `https://www.fonchi.com.ar${vigente}/`);
        }
    }
});

test('cada mudanza apunta a un archivo que existe y deja libre la dirección anterior', () => {
    const archivo = (ruta) => `src/${ruta.replace('/log/', 'logs/').replace('/ensayos/', 'ensayos/')}.md`;
    for (const [vieja, vigente] of Object.entries(MUDANZAS)) {
        assert.ok(existsSync(archivo(vigente)), `${vigente} no tiene archivo`);
        assert.ok(!existsSync(archivo(vieja)), `${vieja} todavía tiene archivo`);
    }
});
