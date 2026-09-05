---
title: "Notion manda, la base espeja"
date: "2026-05-08"
status: "STATUS_OK"
---

Teníamos dos fuentes de verdad y no lo estaba viendo. Yo gestiono el conocimiento en Notion, que es lo que puedo leer, y los agentes leen su contexto de Supabase, que es una base cruda que había que empujar a mano. Entonces lo que yo leía no siempre era lo que la máquina procesaba, y me enteraba tarde.

Armamos una sincronización en los dos sentidos con una jerarquía que no se discute: la interfaz que yo leo es la verdad, y ante cualquier discrepancia, gana. Unos scripts clonan ese contenido hacia la base de los agentes, que así leen rápido sin que yo gestione tablas, y cuando un agente sintetiza un reporte o procesa algo nuevo lo empuja hacia mi entorno y aparece en Notion sin que nadie se lo pida.

Humano y máquina sobre el mismo mapa, cada uno en el formato que le conviene. Tardé más de lo que hubiera querido en llegar a esto.
