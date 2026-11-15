# Tarjetiva · Modelos

Catálogo oficial de demostraciones interactivas de tarjetas digitales premium.

## Direcciones una vez publicado en GitHub Pages

- Catálogo: https://tarjetiva.github.io/Modelos/
- Modelo 01 — ATELIER: https://tarjetiva.github.io/Modelos/modelos/atelier-01/

## Estructura

- `index.html`: portada del catálogo.
- `modelos/atelier-01/index.html`: demostración de la tarjeta premium.
- `assets/css/atelier.css`: identidad visual y diseño responsive.
- `assets/js/atelier.js`: modales, filtros, compartir, descarga de contacto, QR y animaciones.
- `.nojekyll`: sirve los archivos estáticos sin procesamiento de Jekyll.

## Publicación

Subir **todos** los archivos a la rama `main` de `Tarjetiva/Modelos` respetando la estructura de carpetas. En el repositorio, ir a **Settings → Pages → Build and deployment → Deploy from a branch**, elegir `main` y `/(root)` y guardar.

GitHub Pages es estático: no hace falta servidor ni base de datos. La demostración incluye datos y proyectos ficticios. Las fotografías provienen de Unsplash y el servicio QR de `api.qrserver.com`, por lo que se requiere acceso a Internet para esos recursos. El contacto descargable utiliza `demo@example.com` y no representa a una persona real.

© Tarjetiva.