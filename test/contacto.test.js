import assert from 'node:assert/strict';
import test from 'node:test';

import { handleContacto } from '../worker/contacto.js';
import worker from '../worker/index.js';

function request(body, method = 'POST', url = 'https://www.fonchi.com.ar/api/contacto') {
    return new Request(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? body : undefined,
    });
}

test('el Worker redirige el dominio apex y preserva ruta y query', async () => {
    const response = await worker.fetch(
        new Request('https://fonchi.com.ar/ensayos/?origen=test'),
        { ASSETS: { fetch: () => assert.fail('no debe pedir el asset antes de redirigir') } },
    );

    assert.equal(response.status, 308);
    assert.equal(response.headers.get('location'), 'https://www.fonchi.com.ar/ensayos/?origen=test');
});

test('el Worker entrega las rutas estáticas al binding de Assets', async () => {
    let recibida;
    const response = await worker.fetch(
        new Request('https://www.fonchi.com.ar/ensayos/'),
        {
            ASSETS: {
                fetch(req) {
                    recibida = req.url;
                    return new Response('asset');
                },
            },
        },
    );

    assert.equal(recibida, 'https://www.fonchi.com.ar/ensayos/');
    assert.equal(await response.text(), 'asset');
});

test('el Worker no entrega rutas API desconocidas como assets', async () => {
    const response = await worker.fetch(
        new Request('https://www.fonchi.com.ar/api/desconocida'),
        { ASSETS: { fetch: () => assert.fail('no debe pedir un asset para una ruta API') } },
    );

    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: 'Ruta no encontrada.' });
});

test('rechaza métodos distintos de POST con Allow', async () => {
    const response = await handleContacto(request(undefined, 'GET'));
    assert.equal(response.status, 405);
    assert.equal(response.headers.get('allow'), 'POST');
});

test('rechaza JSON inválido y campos inválidos', async () => {
    const invalido = await handleContacto(request('{'));
    assert.equal(invalido.status, 400);

    const mailInvalido = await handleContacto(request(JSON.stringify({
        nombre: 'Ada',
        mail: 'sin-arroba',
        mensaje: 'Hola',
    })));
    assert.equal(mailInvalido.status, 400);

    const demasiadoLargo = await handleContacto(request(JSON.stringify({
        nombre: 'Ada',
        mail: 'ada@example.com',
        mensaje: 'x'.repeat(5001),
    })));
    assert.equal(demasiadoLargo.status, 400);
});

test('el honeypot responde ok sin llamar a Resend', async () => {
    const response = await handleContacto(
        request(JSON.stringify({ empresa: 'robot' })),
        {},
        () => assert.fail('no debe llamar a Resend'),
    );

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true });
});

test('sin el secret conserva el fallback mediante 503', async () => {
    const response = await handleContacto(request(JSON.stringify({
        nombre: 'Ada',
        mail: 'ada@example.com',
        mensaje: 'Hola',
    })));

    assert.equal(response.status, 503);
    assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('envía a Resend con reply-to y HTML escapado', async () => {
    let llamada;
    const response = await handleContacto(
        request(JSON.stringify({
            nombre: 'Ada <script>',
            mail: 'ada@example.com',
            mensaje: 'Hola & gracias',
        })),
        { RESEND_API_KEY: 'test-key' },
        async (url, init) => {
            llamada = { url, init };
            return new Response('', { status: 200 });
        },
    );

    assert.equal(response.status, 200);
    assert.equal(llamada.url, 'https://api.resend.com/emails');
    assert.equal(llamada.init.headers.Authorization, 'Bearer test-key');
    const payload = JSON.parse(llamada.init.body);
    assert.equal(payload.reply_to, 'ada@example.com');
    assert.match(payload.html, /Ada &lt;script&gt;/);
    assert.match(payload.html, /Hola &amp; gracias/);
});

test('convierte un error de Resend en 502', async () => {
    const originalError = console.error;
    console.error = () => {};
    try {
        const response = await handleContacto(
            request(JSON.stringify({
                nombre: 'Ada',
                mail: 'ada@example.com',
                mensaje: 'Hola',
            })),
            { RESEND_API_KEY: 'test-key' },
            async () => new Response('falló', { status: 500 }),
        );
        assert.equal(response.status, 502);
    } finally {
        console.error = originalError;
    }
});
