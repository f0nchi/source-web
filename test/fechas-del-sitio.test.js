import test from 'node:test';
import assert from 'node:assert/strict';

import { calcularFechas, diaDelCommit } from '../scripts/fechas-del-sitio.mjs';

test('el día del commit se toma en la zona de quien lo hizo', () => {
    assert.equal(diaDelCommit('2026-10-12T22:40:22-03:00'), '2026-10-12');
    assert.equal(diaDelCommit(''), null);
});

test('cada entrada del registro y cada ensayo reciben la fecha de su último commit', () => {
    const fechas = calcularFechas({ completar: false }); // los tests no salen a la red
    if (!fechas.completa) return;
    const entradas = Object.keys(fechas.archivos).filter((r) => r.startsWith('src/logs/'));
    assert.ok(entradas.length > 0);
    assert.ok(Object.keys(fechas.archivos).some((r) => r.startsWith('src/ensayos/')));
    assert.match(fechas.archivos['src/pages/index.astro'], /^\d{4}-\d{2}-\d{2}$/);
});
