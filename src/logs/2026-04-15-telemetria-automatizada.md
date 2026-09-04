---
title: "El sistema vuelve a leer sus propios resultados"
date: "2026-04-15"
status: "STATUS_OK"
---

Hasta hoy, una vez que el contenido salía de la base de operaciones, su rendimiento quedaba desconectado del núcleo: para saber cómo le fue a una publicación, tenía que ir a mirar las plataformas a mano.

Cerré ese loop. Migré la orquestación a un circuito serverless que, después de publicar, se comunica con las interfaces de Instagram y LinkedIn, extrae los datos de alcance e interacción, y los escribe de vuelta en la misma base de datos donde nació el contenido.

La base documental ahora mantiene un historial vivo de cómo le fue a cada decisión, y ese historial alimenta la inteligencia general de la marca sin que yo tenga que auditar nada a mano. El sistema publica, mide y aprende, todo en el mismo movimiento.
