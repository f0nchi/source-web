// Vercel Serverless Function (runtime Node.js) que recibe el formulario de
// contacto del sitio y lo manda por mail con Resend.
//
// Variable de entorno que hay que cargar en Vercel (Project Settings →
// Environment Variables, en Production y Preview):
//
//   RESEND_API_KEY   API key de Resend (https://resend.com). El dominio
//                    fonchi.com.ar tiene que estar verificado ahí para poder
//                    mandar mails desde hola@fonchi.com.ar.
//
// Sin esa variable, esta función responde 503 y el formulario del sitio cae
// al mensaje de contacto directo (hola@fonchi.com.ar).

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

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Método no permitido.' });
    }

    let body = req.body;
    if (typeof body === 'string') {
        try {
            body = JSON.parse(body);
        } catch {
            return res.status(400).json({ error: 'El cuerpo de la petición no es JSON válido.' });
        }
    }
    body = body && typeof body === 'object' ? body : {};

    // Honeypot: un campo que ningún humano completa. Si vino lleno, cortamos
    // en silencio y respondemos como si hubiera salido todo bien.
    if (typeof body.empresa === 'string' && body.empresa.trim() !== '') {
        return res.status(200).json({ ok: true });
    }

    const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
    const mail = typeof body.mail === 'string' ? body.mail.trim() : '';
    const mensaje = typeof body.mensaje === 'string' ? body.mensaje.trim() : '';

    if (!nombre || !mail || !mensaje) {
        return res.status(400).json({ error: 'Faltan campos: nombre, mail y mensaje son obligatorios.' });
    }
    if (!esMailValido(mail)) {
        return res.status(400).json({ error: 'El mail no es válido.' });
    }
    if (nombre.length > LARGO_MAXIMO.nombre || mail.length > LARGO_MAXIMO.mail || mensaje.length > LARGO_MAXIMO.mensaje) {
        return res.status(400).json({ error: 'Alguno de los campos es demasiado largo.' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        return res.status(503).json({ error: 'RESEND_API_KEY no está configurada en Vercel.' });
    }

    try {
        const respuesta = await fetch('https://api.resend.com/emails', {
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
            return res.status(502).json({ error: 'No se pudo enviar el mail.' });
        }

        return res.status(200).json({ ok: true });
    } catch (error) {
        console.error('Error llamando a Resend:', error);
        return res.status(502).json({ error: 'No se pudo enviar el mail.' });
    }
}
