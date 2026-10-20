# Simulador Microsoft Fabric DP-700

Simulador web en español de preparación para **Microsoft Certified: Fabric Data Engineer Associate (DP-700)**, inspirado en la experiencia del [simulador de Databricks](https://github.com/TheHavoc10/databricks-data-engineer-associate-simulator) y desarrollado como proyecto independiente.

## Acceso

- **Web:** https://thehavoc10.github.io/fabric-dp700-exam-simulator/
- Para publicar o comprobar el despliegue: [GitHub Actions](https://github.com/TheHavoc10/fabric-dp700-exam-simulator/actions). GitHub Pages debe estar configurado para usar **GitHub Actions**.

## Funcionalidades

- 139 preguntas del documento facilitado: 88 de opción única, 8 multirrespuesta y 43 originalmente visuales.
- **Explicaciones bajo demanda y separadas**: «¿Por qué es correcta?» y «¿Por qué son incorrectas las demás?». Inicialmente no se muestra ninguna de ellas. No se repiten los rótulos vacíos «Documentación oficial» del documento.
- **Los 43 ejercicios visuales ahora tienen controles de respuesta**: casillas de texto o selector Sí/No según el formato. 7 ejercicios formados por Sí/No pueden puntuarse automáticamente; 36 ejercicios con campos de texto se comparan con la solución y permiten autoevaluación para no penalizar respuestas equivalentes. Si una tabla, esquema o fragmento de código era necesario, se conserva su captura **en un panel desplegable opcional**.
- Modo práctica y modo simulacro cronometrado. Casos prácticos agrupados sin romper su contexto compartido (Contoso y Litware).
- **Guía DP-700 de 6 bloques**, con los temas del documento, decisiones típicas y puntos de atención.
- **38 términos de repaso**, con búsqueda, filtros temáticos y fichas de definición ocultas hasta pulsar.
- Seguimiento de aciertos, errores, favoritos, historial y rendimiento por temática; exportación e importación JSON.
- Compatible con móvil y escritorio. El progreso permanece en el almacenamiento local del navegador con una clave independiente de Databricks.

## Ficheros principales

- `index.html`: estructura y menús.
- `app.js`: aplicación interactiva y corrección.
- `style.css`: estilos adaptables.
- `study-data.js`: guía y glosario de conceptos.
- `special-answers.js`: descripciones y claves de respuesta para ejercicios visuales, extraídas de la solución del Word.
- `site-chunks/`: banco de preguntas y recursos gráficos optimizados.

Se puede ejecutar localmente con un servidor estático (`python -m http.server 8000`).

## Origen de las soluciones y límites

Las preguntas, sus respuestas y las justificaciones proceden **del documento aportado**. Esta versión **no ha contrastado una por una las claves con la documentación vigente de Microsoft Learn** y no inventa fuentes ni distractores. Si el texto original no desglosa por qué son incorrectas las alternativas, así se indica. Los campos escritos de ejercicios especiales requieren autoevaluación orientativa y sus soluciones se muestran después de responder.

Este producto **no es un examen oficial de Microsoft**.

## Versión 2: experiencia de estudio

- Las explicaciones aparecen **cerradas al principio** y se dividen en dos controles: «¿Por qué es correcta?» y «¿Por qué son incorrectas las demás?». Se omiten los repetitivos rótulos de documentación sin URL presentes en el documento de origen.
- Los **43 ejercicios originalmente gráficos** cuentan con campos de respuesta que permiten interactuar desde el navegador. Las preguntas de Sí/No y los ejercicios con alternativas transcritas del documento se corrigen automáticamente. Las preguntas de entrada libre requieren **evaluación guiada** para no penalizar sinónimos ni formulaciones correctas diferentes.
- Las ilustraciones originales permanecen disponibles como referencia opcional, con las capturas del área de respuesta ocultas de entrada.
- Nuevas secciones **Guía DP-700** y **Términos de repaso**, con búsqueda y tarjetas de conceptos. La guía es orientativa; consulta la [guía oficial de aptitudes del DP-700](https://learn.microsoft.com/es-es/credentials/certifications/resources/study-guides/dp-700) para los objetivos vigentes.

En las preguntas convertidas de capturas a campos de respuesta se ha procurado mantener el contenido y las claves del Word. Las preguntas que dependen de gráficos para conocer los datos siguen teniendo las imágenes disponibles como apoyo, y no se han inventado distractores para los campos abiertos.

## Versión 3: navegación y tiempos

- **Comprobar con dos pulsaciones** sobre la misma respuesta en modo práctica, igual que en Databricks. En preguntas multirrespuesta, esto solo ocurre tras seleccionar el número necesario de alternativas. El botón «Comprobar respuesta» sigue disponible.
- **Distractores más legibles**: el desplegable de opciones incorrectas muestra una ✕ roja junto a cada alternativa y elimina el rótulo repetido «Por qué es incorrecta:», conservando el argumento técnico del documento.
- **Sin límite de tiempo por defecto**: el campo de minutos queda vacío y el simulacro no caduca; se puede introducir una duración entre 10 y 240 minutos para activar el cronómetro. Las preferencias antiguas que conservaban el valor predeterminado de 90 minutos se migran a «Sin límite de tiempo» sin alterar sesiones anteriores.
- **Casos de estudio con pestañas**: Resumen, Entorno existente, Problemas, Requisitos, Instrucciones y Todo el caso (cuando existen esos apartados en el texto original). La selección de pestaña se conserva al pasar entre preguntas del mismo caso, sin perder respuestas.