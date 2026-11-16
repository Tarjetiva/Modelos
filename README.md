# Tarjetiva · Colección de tarjetas digitales

Demostraciones interactivas publicadas por Tarjetiva. Las tarjetas son perfiles digitales compactos, **no páginas web comerciales largas**.

- Catálogo: https://tarjetiva.github.io/Modelos/
- Modelo 01 (ATELIER): https://tarjetiva.github.io/Modelos/modelos/atelier-01/

## ATELIER 01

Tarjeta móvil premium para una profesional ficticia, con portada, retrato, identidad y botones rápidos, guardar contacto de prueba (.vcf), compartir mediante Web Share API/copia de enlace, código QR, pestañas de perfil/servicios/galería y galería deslizable.

Las imágenes se obtienen de Unsplash y el QR se carga mediante api.qrserver.com. Requieren conexión. La información de Valeria Soto y sus proyectos es **ficticia**; por eso los accesos de WhatsApp, llamadas, correo y ubicación muestran una explicación de la función, sin contactar a personas reales. En producción, esos accesos se sustituyen por enlaces de contacto reales autorizados.

## Despliegue

GitHub Pages: rama `main`, carpeta `/(root)`. El sitio funciona como HTML/CSS/JavaScript estático, sin backend. La ruta del modelo se conserva para no romper los enlaces previamente compartidos.

© Tarjetiva.

## Modelo 02 — ÓRBITA

Demostración holográfica y responsive de una tarjeta de presentación digital ficticia.

- Enlace: https://tarjetiva.github.io/Modelos/modelos/orbita-02/
- Archivos: `modelos/orbita-02/index.html`, `assets/orbita.css`, `assets/orbita.js`
- Interacciones: alternar paleta, pestañas accesibles, proyectos, QR, compartir, vCard demostrativa y botones informativos para canales que no tienen datos reales.
- Diseño: composición horizontal en escritorio y tableta, vertical en móvil. Respetar preferencias de movimiento reducido.
- El QR usa api.qrserver.com; la fotografía ilustrativa se carga de Unsplash y dispone de alternativa visual local si falla.
- No se utilizan teléfonos reales ni se almacenan datos.
