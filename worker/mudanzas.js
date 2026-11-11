// Entradas y ensayos que cambiaron de fecha: la dirección anterior lleva a la vigente.
// Las claves y los destinos van sin la barra final.
export const MUDANZAS = {
    '/ensayos/2026-11-10-mi-trabajo-ahora-es-dirigir': '/ensayos/2026-10-23-mi-trabajo-ahora-es-dirigir',
    '/ensayos/2026-11-10-de-lo-que-soy-a-lo-que-hago': '/ensayos/2026-10-29-de-lo-que-soy-a-lo-que-hago',
    '/log/2026-10-30-elegi-con-que-ia-escribir-sin-saber-cual-era-cual': '/log/2026-11-03-elegi-con-que-ia-escribir-sin-saber-cual-era-cual',
    '/log/2026-10-27-corrijo-una-sola-vez': '/log/2026-10-22-junte-de-donde-saco-imagenes-y-videos',
};

export function mudanza(pathname) {
    const destino = MUDANZAS[pathname.replace(/\/$/, '')];
    return destino ? `${destino}/` : null;
}
