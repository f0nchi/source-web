---
title: "Publiqué el repo entero sin querer"
date: "2026-09-15"
status: "STATUS_OK"
---

El domingo me llegó un mail de Vercel: uno de mis proyectos había usado el cien por ciento de los diez gigas de almacenamiento del plan gratis. Me pareció una bestialidad para un sitio de cuatro páginas. Algo había pasado.

Había pasado esto. El sitio más chiquito y simple de los que hicimos, el de una campaña, estaba conectado a mi carpeta de trabajo entera. Cada vez que guardaba cualquier cosa, Vercel publicaba el repo completo, un giga, y lo servía en público. Cuatro días. Todo lo que escribo acá adentro antes de que sea público, las notas, los borradores, el estado de cada frente, estuvo en una URL que cualquiera podía abrir si sabía dónde mirar. Un error gravísimo, y una locura justo en el sitio donde menos había en juego.

El mismo día quedó cortado: el proyecto apunta solo a su propia carpeta, los treinta y siete despliegues anteriores están borrados, las URLs viejas dan 404, y en la raíz del repo grande hay un archivo que le dice a Vercel que ignore todo. La regla la conocía. Ahora está escrita donde el sistema la lee: un sitio que vive adentro del repo grande se publica con su carpeta como raíz, y antes de anunciarlo se comprueba que todo lo demás responda con un 404.
