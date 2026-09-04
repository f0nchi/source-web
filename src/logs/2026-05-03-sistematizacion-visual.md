---
title: "La identidad visual como código"
date: "2026-05-03"
status: "STATUS_OK"
---

La generación de piezas visuales arrastraba una dependencia de herramientas de diseño que metía error inevitable: textos sobreimpresos, titulares fuera de registro, composiciones que variaban según la alucinación del modelo o la mano de turno. Quiero que la identidad visual se opere como se opera el código, con el mismo determinismo.

Desarmé el pipeline anterior y lo reconstruí como un esquema geométrico. La composición ahora ocurre por scripts de Python (con Pillow), trabajando con coordenadas y valores hexadecimales; el trabajo se reparte entre dos agentes, uno para la dirección de arte estructural y otro para el texto editorial, así ninguno se confunde intentando las dos cosas a la vez; y la matriz tiene anclajes fijos que reservan áreas intocables, por ejemplo los 200 píxeles inferiores donde vive el titular, para que la ilustración jamás lo pise.

[La consistencia visual](https://www.ideasaumentadas.com.ar/conceptos/consistencia-operativa) dejó de ser una aspiración: quedó escrita en fórmulas, y las fórmulas no tienen días malos.
