# Simulador Microsoft Fabric DP-700

Simulador web en español de preparación para **Microsoft Certified: Fabric Data Engineer Associate (DP-700)**, inspirado en la experiencia del [simulador de Databricks](https://github.com/TheHavoc10/databricks-data-engineer-associate-simulator) y desarrollado como proyecto independiente.

## Acceso

- **Web:** https://thehavoc10.github.io/fabric-dp700-exam-simulator/
- Para publicar o comprobar el despliegue: [GitHub Actions](https://github.com/TheHavoc10/fabric-dp700-exam-simulator/actions). GitHub Pages debe estar configurado para usar **GitHub Actions**.

## Funcionalidades

- 139 preguntas del documento facilitado: 88 de opción única, 8 multirrespuesta y 43 originalmente visuales.
- **Explicaciones bajo demanda y separadas**: «¿Por qué es correcta?» y «¿Por qué son incorrectas las demás?». Inicialmente no se muestra ninguna de ellas. No se repiten los rótulos vacíos «Documentación oficial» del documento.
- **43 ejercicios visuales reconstruidos** a partir del Word: desplegables dentro de código SQL/PySpark/KQL, matrices Sí/No, tarjetas para asignar respuestas, secuencias ordenables y registros seleccionables. Se conservan imágenes de tablas y escenarios cuando forman parte del enunciado; las alternativas provienen de las capturas originales.
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

Las preguntas, las respuestas y las justificaciones proceden **del documento aportado**. Se han transcrito las alternativas visibles de las 43 preguntas originalmente gráficas y sus claves se contrastan automáticamente con el propio banco de respuestas. **No se han verificado individualmente contra la documentación vigente de Microsoft Learn.**

Este producto **no es un examen oficial de Microsoft**.

## Versión 2: experiencia de estudio

- Las explicaciones aparecen **cerradas al principio** y se dividen en dos controles: «¿Por qué es correcta?» y «¿Por qué son incorrectas las demás?». Se omiten los repetitivos rótulos de documentación sin URL presentes en el documento de origen.
- Los **43 ejercicios originalmente gráficos** incluyen controles adaptados al formato del examen, con corrección automática: Sí/No, desplegables, arrastrar/colocar, ordenar pasos y selección de registros.
- Las ilustraciones originales permanecen disponibles como referencia opcional, con las capturas del área de respuesta ocultas de entrada.
- Nuevas secciones **Guía DP-700** y **Términos de repaso**, con búsqueda y tarjetas de conceptos. La guía es orientativa; consulta la [guía oficial de aptitudes del DP-700](https://learn.microsoft.com/es-es/credentials/certifications/resources/study-guides/dp-700) para los objetivos vigentes.

Las imágenes de referencia continúan disponibles cuando aportan datos necesarios. No se añaden distractores inventados.

## Versión 3: navegación y tiempos

- **Comprobar con dos pulsaciones** sobre la misma respuesta en modo práctica, igual que en Databricks. En preguntas multirrespuesta, esto solo ocurre tras seleccionar el número necesario de alternativas. El botón «Comprobar respuesta» sigue disponible.
- **Distractores más legibles**: el desplegable de opciones incorrectas muestra una ✕ roja junto a cada alternativa y elimina el rótulo repetido «Por qué es incorrecta:», conservando el argumento técnico del documento.
- **Sin límite de tiempo por defecto**: el campo de minutos queda vacío y el simulacro no caduca; se puede introducir una duración entre 10 y 240 minutos para activar el cronómetro. Las preferencias antiguas que conservaban el valor predeterminado de 90 minutos se migran a «Sin límite de tiempo» sin alterar sesiones anteriores.
- **Casos de estudio con pestañas**: Resumen, Entorno existente, Problemas, Requisitos, Instrucciones y Todo el caso (cuando existen esos apartados en el texto original). La selección de pestaña se conserva al pasar entre preguntas del mismo caso, sin perder respuestas.


## Mejoras de paridad con el simulador Databricks (octubre de 2026)

- **Mosaico de estado real**: verde al acertar, rojo al fallar, azul al seleccionar sin corregir; ámbar para revisión guiada. La pregunta actual tiene un borde destacado.
- **Interfaz móvil remodelada**: encabezado compacto con menú desplegable, tema claro/oscuro/automático y controles fijos inferiores para navegar y comprobar respuestas. Compatible con zonas seguras del teléfono.
- **Mismo gesto de corrección**: pulsar de nuevo la opción seleccionada equivale a «Comprobar» en práctica, igual que en Databricks.
- **Estudio adaptativo**: práctica inteligente por temática y resultados, repetición espaciada y tres niveles de confianza «Lo sabía / Por descarte / No lo sabía».
- **Resumen al finalizar** y pantalla separada para revisar las preguntas, con mosaico y estadísticas; evolución histórica de sesiones y diagnóstico por temas.
- **Compartir progreso mediante enlace** (optativo) más exportación/importación JSON; ninguna información se almacena en un servidor de la aplicación.
- **Se mantiene la numeración y las claves originales**. La pregunta 54 se ha convertido en una selección real de dos de cuatro registros (A y D), preservando sus capturas.

La base del simulador DP-700 contiene modalidades gráficas y casos de estudio que no existen en el banco Databricks: no se trasplantan las funciones específicas de un examen distinto (por ejemplo, su sección de preguntas Databricks descatalogadas).

## Reconstrucción de interacciones visuales · Octubre 2026

- **Banco completo:** 139 preguntas; las 43 originalmente gráficas disponen de interacción (no solo de campos de texto).
- **Modalidades:** selectores contextualizados en SQL/KQL/PySpark, tablas Sí/No, asignación y ordenación mediante arrastrar o tocar, y selección de registros con imágenes originales.
- **Accesibilidad:** las tarjetas se asignan tanto arrastrando con ratón como tocando origen y destino; las secuencias también cuentan con botones para subir/bajar.
- **Trazabilidad:** `replicas.js` documenta las opciones recuperadas de las capturas; `replica-ui.js` presenta los controles; `tests/check-replicas.cjs` valida que todas las claves existan entre las alternativas y que los huecos de código estén completos.
- **Compatibilidad:** las estadísticas, el repaso y la corrección inmediata siguen usando los mismos identificadores y la misma clave de `localStorage`; no se reinicia el progreso.
