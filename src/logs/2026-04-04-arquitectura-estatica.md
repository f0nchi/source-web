---
title: "La migración a la capa estática"
date: "2026-04-04"
status: "STATUS_OK"
---

Terminé la mudanza de infraestructura. El esquema anterior dependía de un servidor tradicional con PHP y MySQL, una maquinaria pesada para un sitio cuyo trabajo es mostrar texto.

El contenido de la marca ahora vive en Notion, el sitio se genera estático con Astro, y Vercel mira el repositorio: cada cambio que empujo se ensambla en HTML puro y se despliega globalmente en segundos.

Publicar quedó reducido a su mínima expresión: escribo, empujo, y está en el aire. Esa falta de fricción es el punto: cuando publicar cuesta cero, se publica lo que se piensa, con la frecuencia con la que se piensa.
