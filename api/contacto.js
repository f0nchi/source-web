// Endpoint de contacto compartido por el Worker de Cloudflare.
// RESEND_API_KEY vive como secret de runtime del Worker. Si falta, esta ruta
// responde 503 y el formulario conserva el contacto directo por mail.

const MAIL_DESTINO = 'fonchi@gmail.com';
const MAIL_ORIGEN = 'Fonchi <hola@fonchi.com.ar>';
const LARGO_MAXIMO = { nombre: 200, mail: 200, mensaje: 5000 };

function esMailValido(mail) {
    return typeof mail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
}

function escapeHtml(texto) {
    return String(texto)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function json(body, status = 200, headers = {}) {
    return Response.json(body, {
        status,
        headers: {
            'Cache-Control': 'no-store',
            ...headers,
        },
    });
}

export async function handleContacto(request, env = {}, fetchImpl = fetch) {
    if (request.method !== 'POST') {
        return json(
            { error: 'Método no permitido.' },
            405,
            { Allow: 'POST' },
        );
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return json({ error: 'El cuerpo de la petición no es JSON válido.' }, 400);
    }
    body = body && typeof body === 'object' ? body : {};

    // Honeypot: un campo que ningún humano completa. Si vino lleno, cortamos
    // en silencio y respondemos como si hubiera salido todo bien.
    if (typeof body.empresa === 'string' && body.empresa.trim() !== '') {
        return json({ ok: true });
    }

    const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
    const mail = typeof body.mail === 'string' ? body.mail.trim() : '';
    const mensaje = typeof body.mensaje === 'string' ? body.mensaje.trim() : '';

    if (!nombre || !mail || !mensaje) {
        return json({ error: 'Faltan campos: nombre, mail y mensaje son obligatorios.' }, 400);
    }
    if (!esMailValido(mail)) {
        return json({ error: 'El mail no es válido.' }, 400);
    }
    if (nombre.length > LARGO_MAXIMO.nombre || mail.length > LARGO_MAXIMO.mail || mensaje.length > LARGO_MAXIMO.mensaje) {
        return json({ error: 'Alguno de los campos es demasiado largo.' }, 400);
    }

    const apiKey = env.RESEND_API_KEY;
    if (!apiKey) {
        return json({ error: 'RESEND_API_KEY no está configurada.' }, 503);
    }

    try {
        const respuesta = await fetchImpl('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: MAIL_ORIGEN,
                to: [MAIL_DESTINO],
                reply_to: mail,
                subject: `[fonchi.com.ar] Mensaje de ${nombre}`,
                text: `${mensaje}\n\n—\n${nombre} <${mail}>`,
                html: `<p>${escapeHtml(mensaje).replaceAll('\n', '<br>')}</p><p>—<br>${escapeHtml(nombre)} &lt;${escapeHtml(mail)}&gt;</p>`,
            }),
        });

        if (!respuesta.ok) {
            const detalle = await respuesta.text().catch(() => '');
            console.error('Resend respondió con error:', respuesta.status, detalle);
            return json({ error: 'No se pudo enviar el mail.' }, 502);
        }

        return json({ ok: true });
    } catch (error) {
        console.error('Error llamando a Resend:', error);
        return json({ error: 'No se pudo enviar el mail.' }, 502);
    }
}

// Compatibilidad durante el corte: un push a main todavía puede disparar un
// deploy de Vercel antes de que Cloudflare reciba el tráfico. Este adaptador
// conserva el contrato req/res sin duplicar la lógica del endpoint.
export default async function vercelHandler(req, res) {
    const headers = new Headers();
    if (req.headers?.['content-type']) {
        headers.set('Content-Type', req.headers['content-type']);
    }

    let body;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
    }

    const response = await handleContacto(
        new Request('https://www.fonchi.com.ar/api/contacto', {
            method: req.method,
            headers,
            body,
        }),
        { RESEND_API_KEY: globalThis.process?.env?.RESEND_API_KEY },
    );

    for (const [name, value] of response.headers) {
        res.setHeader(name, value);
    }
    return res.status(response.status).json(await response.json());
}
