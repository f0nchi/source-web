import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

if (process.env.WORKERS_CI !== '1') {
    throw new Error('deploy:builds sólo puede ejecutarse dentro de Cloudflare Workers Builds. Para una operación local usá npm run deploy, que obliga al perfil fonchi-pilot.');
}

const wrangler = fileURLToPath(new URL('../node_modules/.bin/wrangler', import.meta.url));
const indexNow = fileURLToPath(new URL('./indexnow.mjs', import.meta.url));

execFileSync(wrangler, ['deploy'], { stdio: 'inherit' });
execFileSync(process.execPath, [indexNow], { stdio: 'inherit' });
