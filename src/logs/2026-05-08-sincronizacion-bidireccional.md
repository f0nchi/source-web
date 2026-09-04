---
title: "Notion manda, la base espeja"
date: "2026-05-08"
status: "STATUS_OK"
---

El ecosistema venía sufriendo una desincronización de fondo: yo gestiono el conocimiento en bases legibles (Notion), y los agentes leen su contexto de bases crudas (Supabase) que había que empujar a mano. Dos fuentes de verdad, y lo que yo leía no siempre era lo que la máquina procesaba.

Armé una sincronización bidireccional con una jerarquía inamovible: la interfaz que yo leo es la verdad, y ante cualquier discrepancia, gana. Scripts de sincronización clonan ese contenido hacia la base de los agentes, que así mantienen una lectura cruda y veloz sin que yo tenga que gestionar tablas. Y el flujo vuelve: cuando un agente sintetiza un reporte o procesa información nueva, la empuja hacia mi entorno y aparece en la interfaz legible sin que nadie se lo pida.

Humano y máquina operan ahora sobre el mismo mapa de la realidad, cada uno leyéndolo en el formato que le conviene.
