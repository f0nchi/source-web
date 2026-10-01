---
title: "Preparé el sitio para que también lo lean las IA"
date: "2026-04-05"
status: "STATUS_OK"
id: "SRC-0003"
---

Hoy un sitio también lo leen [los agentes](https://www.ideasaumentadas.com.ar/conceptos/capa-agentica) y los modelos que lo recorren para contestarle a alguien, y cada vez más. Entonces lo preparé para que les hable bien a los dos públicos, a la gente y a las máquinas.

Sumé un `llms.txt` en la raíz, que es una especie de carta de presentación para que un agente entienda de entrada qué es esto y cómo está ordenado, marqué la autoría y la estructura con JSON-LD, y dejé el contenido en jerarquías de texto plano que un crawler procesa sin esfuerzo.

La idea de fondo es simple: si mañana alguien le pregunta por mí a una IA y la IA viene a leer esto, prefiero que lea exactamente quién soy, con el menor procesamiento en el medio.
