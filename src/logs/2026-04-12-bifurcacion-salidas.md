---
title: "Una fuente, dos salidas"
date: "2026-04-12"
status: "STATUS_OK"
---

Hasta ahora el sistema de publicación producía un solo formato, y eso obligaba a un compromiso incómodo: o diluía la profundidad técnica para que el texto funcione en redes, o resignaba alcance para mantener el registro crudo.

Bifurqué la arquitectura para dejar de elegir. El contenido nace de una sola matriz y un enrutador produce dos traducciones en paralelo: una pensada para el posicionamiento en LinkedIn y otra para el reporte técnico de este sitio. La publicación fluye por webhooks hacia cada rama, así que el copiado y pegado multiplataforma desapareció del circuito, y la capa visual de cada canal también se resuelve por separado: acá texto plano, allá su pieza gráfica.

Lo que gano es pensar el problema de fondo una sola vez, y que cada público reciba la capa exacta que necesita.
