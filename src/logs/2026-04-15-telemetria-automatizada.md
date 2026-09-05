---
title: "El sistema vuelve a leer sus propios resultados"
date: "2026-04-15"
status: "STATUS_OK"
---

Hasta hoy, una vez que el contenido salía, su rendimiento quedaba desconectado del núcleo: para saber cómo le fue a una publicación tenía que entrar a cada plataforma a mirar, y la verdad es que no entraba.

Empecé a cerrar ese loop. Migré la orquestación a un circuito serverless que, después de publicar, va a buscar los datos de alcance e interacción y los escribe de vuelta en la misma base donde nació el contenido. Con Instagram ya funciona; LinkedIn todavía me obliga a hacer una parte a mano, y no lo escondo porque es el estado real.

Lo que quiero es que la base documental guarde cómo le fue a cada decisión, para que eso alimente lo que viene sin que yo tenga que auditarlo: publicar, medir y aprender en el mismo movimiento.

Hoy está a medio camino.
