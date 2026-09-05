---
title: "Una fuente, dos salidas"
date: "2026-04-12"
status: "STATUS_OK"
---

Hasta ahora el sistema de publicación producía un solo formato y me obligaba a un compromiso incómodo: o diluía la profundidad técnica para que el texto funcione en redes, o resignaba alcance para mantener el registro crudo de acá.

Bifurqué la arquitectura para dejar de elegir. El contenido nace de una sola matriz y un enrutador produce dos traducciones en paralelo, una para LinkedIn y otra para este sitio, y la publicación fluye por webhooks hacia cada rama. El copiado y pegado entre plataformas desapareció del circuito, y la capa visual de cada canal se resuelve por su lado: acá texto plano, allá su pieza gráfica.

Lo que gano es pensar el problema de fondo una sola vez. Después cada público recibe la capa que le sirve.
