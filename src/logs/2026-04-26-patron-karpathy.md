---
title: "El registro obligatorio de cambios"
date: "2026-04-26"
status: "STATUS_OK"
---

El sistema documental venía sobreescribiendo: cada actualización de una instrucción hacía desaparecer la versión anterior. La base quedaba limpia, y al leer una regla vigente era imposible saber por qué había cambiado ni qué problema se estaba resolviendo cuando se escribió, o sea que a las decisiones les faltaba arqueología.

Lo que adopté lo trajo el radar en su primera corrida, de cómo documenta Karpathy sus proyectos: toda modificación estructural del canon exige su entrada de registro, en changelogs independientes por frente que funcionan como un libro contable. Lo nuevo se apila arriba y el historial queda. Cada entrada dice la fecha, qué cambió, por qué, y quién validó el pase.

Si el comportamiento de un agente se desvía, ahora puedo ir a [la arqueología](https://www.ideasaumentadas.com.ar/conceptos/jurisprudencia-de-marca), encontrar el punto exacto donde entró el error y volver atrás. Todavía falta la otra mitad del modelo, una pasada periódica que busque contradicciones y páginas viejas. Eso queda para otra sesión.
