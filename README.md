# Simulador Microsoft Fabric DP-700

Simulador web en español de preparación para **Microsoft Certified: Fabric Data Engineer Associate (DP-700)**. Inspirado en el flujo de uso del [simulador Databricks Data Engineer Associate](https://github.com/TheHavoc10/databricks-data-engineer-associate-simulator) del mismo usuario, en un proyecto independiente.

## Qué contiene

- **139 preguntas numeradas**, extraídas del documento Word facilitado.
- 88 preguntas de selección única, 8 de selección múltiple y 43 ejercicios de formato especial con revisión manual.
- 130 archivos de imagen únicos del documento original, incluidos esquemas, tablas, capturas y preguntas hotspot.
- Modo práctica con solución comentada y modo simulacro con cronómetro.
- Casos de estudio agrupados en bloques consecutivos (sin mezclarlos con preguntas sueltas), contexto desplegable, navegación libre por preguntas y favoritos.
- Revisión de errores, estadísticas globales y por temática, importación y exportación de progreso.
- Datos guardados solo en `localStorage` del navegador, independientes del simulador Databricks.
- Sin servidores, framework ni servicios externos; apto para GitHub Pages.

## Uso

Abre `index.html` en el navegador o sirve la carpeta por HTTP:

```bash
python -m http.server 8000
```

También se genera un archivo HTML **autocontenido** para abrir con doble clic o publicar como único `index.html` en GitHub Pages.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo llamado `fabric-dp700-exam-simulator` en tu cuenta GitHub.
2. Sube los archivos del proyecto, incluyendo la carpeta `assets/` (o sube el HTML autocontenido, renombrado a `index.html`).
3. En **Settings > Pages > Build and deployment**, selecciona **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
4. Visita `https://<TU_USUARIO>.github.io/fabric-dp700-exam-simulator/` una vez se publique.

## Sobre la corrección y las preguntas

Las respuestas y explicaciones se **conservan del documento recibido**. No se ha comprobado su exactitud técnica contra la documentación de Microsoft en esta versión. Las preguntas de formato especial (p. ej. hotspot y desplegables) se presentan con sus imágenes y explicaciones, pero **no se inventan opciones equivalentes**: se corrigen manualmente. Se cuenta un acierto o fallo en estadísticas únicamente cuando el usuario responde y la respuesta puede corregirse, o se autocorrige de forma voluntaria.

Las categorías de estadísticas están asignadas mediante heurísticas; no equivalen a una validación oficial de la distribución del examen.

El archivo `audit.json` permite identificar el tipo de cada pregunta y cuáles requieren revisión. Si se dispone del documento Word original, `build_bank.py` regenera `questions.js`, `questions.json` y las imágenes, corrigiendo temporalmente un enlace interno incorrecto del DOCX sin modificar su contenido original.

**No es material oficial de Microsoft ni garantiza la fidelidad o actualidad de las respuestas.**