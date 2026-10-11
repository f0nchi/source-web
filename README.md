# fonchi.com.ar

Sitio estático de Fonchi en Astro, servido por Cloudflare Workers Static Assets. El Worker agrega dos comportamientos sin cambiar las URLs públicas: redirige `fonchi.com.ar` a `www.fonchi.com.ar` y atiende `POST /api/contacto` con Resend. El resto pasa al binding `ASSETS`, con trailing slashes automáticos y el `404.html` generado por Astro.

## Desarrollo y verificación

Requiere Node.js 24 (mínimo declarado: 22.12).

```sh
npm ci
npm test
npm run build
npm run cf:dry-run
```

`npm run preview` levanta el Worker y los assets localmente. Todo comando local de Wrangler que pueda usar una cuenta nombra explícitamente `--profile fonchi-pilot`; no se usa el perfil global.

## Cloudflare Workers Builds

La identidad del Worker es `fonchi-source`. La conexión productiva conserva el repositorio `f0nchi/source-web` y la rama `main`, por lo que el circuito Notion → Make → GitHub sigue escribiendo en el mismo destino.

Configurar Workers Builds así:

- Production branch: `main`
- Build command: `npm test && npm run build`
- Deploy command: `npm run deploy:builds`
- Root directory: `/`
- Runtime secret: `RESEND_API_KEY`

`deploy:builds` tiene un guard que exige `WORKERS_CI=1`. Primero espera que `wrangler deploy` termine correctamente y recién entonces envía a IndexNow todas las URLs del sitemap. Esto reemplaza el workflow que dependía del `deployment_status` de Vercel y evita avisar antes de un deploy real.

El workflow de GitHub sólo ejecuta tests, build y el dry run de Wrangler; no guarda credenciales ni despliega. Cloudflare Workers Builds administra su token dentro de la cuenta conectada.

## Puesta en producción

La configuración no declara rutas ni dominios para que el alta y el corte de DNS sigan siendo una operación explícita. Antes del cambio de tráfico hay que:

1. crear o conectar `fonchi-source` a `f0nchi/source-web` en la cuenta personal;
2. cargar `RESEND_API_KEY` como secret de runtime;
3. asociar `www.fonchi.com.ar` y `fonchi.com.ar` al Worker, o mantener un redirect equivalente del apex a `www`;
4. comprobar home, sitemap, 404, redirección y el fallback del formulario antes de probar un envío real.

Una operación local excepcional usa `npm run deploy`, que compila, despliega con el perfil obligatorio `fonchi-pilot` y avisa a IndexNow sólo después de que Wrangler confirma el deploy.
