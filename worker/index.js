import { handleContacto } from '../api/contacto.js';

const HOST_CANONICO = 'www.fonchi.com.ar';
const HOST_APEX = 'fonchi.com.ar';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (url.hostname === HOST_APEX) {
            url.hostname = HOST_CANONICO;
            return Response.redirect(url.toString(), 308);
        }

        if (url.pathname === '/api/contacto') {
            return handleContacto(request, env);
        }

        if (url.pathname.startsWith('/api/')) {
            return Response.json(
                { error: 'Ruta no encontrada.' },
                { status: 404, headers: { 'Cache-Control': 'no-store' } },
            );
        }

        return env.ASSETS.fetch(request);
    },
};
