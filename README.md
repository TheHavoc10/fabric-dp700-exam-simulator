# Simulador de certificación Microsoft Fabric DP-700

Aplicación web de estudio en español para la certificación **Microsoft Fabric Data Engineer Associate (DP-700)**, independiente del [simulador Databricks](https://github.com/TheHavoc10/databricks-data-engineer-associate-simulator).

## Acceso

Una vez habilitado GitHub Pages, la URL de la aplicación será:

**https://thehavoc10.github.io/fabric-dp700-exam-simulator/**

Si GitHub Pages aún no está activo, en **Settings → Pages → Build and deployment** selecciona **GitHub Actions** y ejecuta de nuevo la acción `Publicar simulador DP-700`.

## Contenido

- **139 preguntas numeradas** extraídas del DOCX aportado por el usuario, con sus explicaciones originales.
- 88 con opción única, 8 de selección múltiple y 43 ejercicios de revisión manual (hotspot, tablas, opciones incompletas u otros formatos no evaluables automáticamente).
- Casos prácticos con contexto consultable, agrupados por escenario sin repartir preguntas de un mismo caso entre otras preguntas. Contoso y Litware contienen 10 y 9 preguntas respectivamente.
- 130 imágenes originales optimizadas y embebidas en JavaScript para reducir dependencias externas, conservando su visualización ampliada.
- Modo práctica, modo examen con temporizador, favoritos, búsqueda, revisión de errores y análisis por temática.
- Progreso local en `localStorage`; exportación e importación a JSON. No se comparte progreso con el simulador Databricks.
- Se puede utilizar desde móvil u ordenador, sin necesidad de servidor.

## Estructura

`index.html`, `style.css` y `app.js` forman la aplicación. La carpeta `site-chunks/` contiene los archivos JS del banco de preguntas y los recursos visuales. El documento de origen **no se almacena en este repositorio**. Los archivos `questions.json`, `build_bank.py` y `audit.json` se utilizan en el proceso local de extracción y revisión, y no son necesarios para desplegar el sitio.

Para ejecutar localmente la versión publicada:

```bash
python -m http.server 8000
```

Abre `http://localhost:8000/`.

## Consideraciones sobre respuestas

La información y las respuestas proceden **exclusivamente del documento aportado** y no se han verificado individualmente contra la documentación vigente de Microsoft. Las preguntas gráficas o las que no permiten una interpretación fiable del formato de respuesta **se muestran para revisión manual**, sin inventar respuestas automáticas.

Este simulador **no es un producto ni examen oficial de Microsoft**.