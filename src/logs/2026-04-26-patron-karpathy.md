---
title: "El registro obligatorio de cambios"
date: "2026-04-26"
status: "STATUS_OK"
---

El sistema documental venía sobreescribiendo: cada actualización de una instrucción hacía desaparecer la versión anterior. La base quedaba limpia, y al leer una regla vigente era imposible saber por qué había cambiado ni qué problema se estaba resolviendo cuando se escribió. Le faltaba arqueología a las decisiones.

Armé un patrón de registro continuo, tomado de cómo se documenta el código en los proyectos serios de IA. Toda modificación estructural del canon ahora exige su entrada de registro, en changelogs independientes por frente que funcionan como libro contable: lo nuevo se apila arriba y el historial queda. Cada entrada declara la fecha, el módulo afectado, qué cambió, el razonamiento detrás, y quién validó el pase.

Con esto, si el comportamiento de un agente se desvía, puedo auditar [la arqueología del sistema](https://www.ideasaumentadas.com.ar/conceptos/jurisprudencia-de-marca), encontrar el punto exacto donde entró el error, y revertirlo.
