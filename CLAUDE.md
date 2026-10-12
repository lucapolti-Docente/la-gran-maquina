# La Gran Máquina: guía para trabajar en el proyecto

Juego educativo de programación para 4.º grado (9 y 10 años) de una escuela primaria de Buenos Aires. Lo usa el docente en clase.

## Contexto de uso
- Se juega en netbooks viejas (1366×768, colores lavados) y en celulares. Todo entra en una pantalla, sin scroll.
- Se publica en GitHub Pages y también se usa sin internet desde un pendrive con `npm run build:pendrive`. Nada puede depender de cargar archivos de internet.
- Sin cuentas ni login. Lo guardado va en localStorage, siempre con try/catch (ver `src/guardado.js`).

## Textos
- Español rioplatense con voseo ("agarrá", "probá", "elegí"). Frases cortas y concretas.
- Cuando algo falla, el mensaje dice en qué instrucción fue y da una ayuda breve, sin retar.
- Tiene que seguir funcionando el modo TODO EN MAYÚSCULAS (CSS `text-transform`).

## Diseño
- Colores con mucho contraste y elementos grandes. Los colores de la interfaz están en `src/estilos/colores.css`.
- Personajes y enemigos: SVG originales y simples, de 100×100. Nada con derechos de autor ni personas reales.
- Los dibujos de los chicos se respetan tal cual y llevan crédito: solo nombre de pila y grado.
- Al girar, el personaje se espeja de costado; nunca queda cabeza abajo. Las imágenes de dibujos no se espejan.

## Arquitectura
- `src/motor/` es lógica pura: no toca el DOM ni dibuja. Todo lo que cambia reglas se prueba en `tests/`.
- `src/dibujo/` genera SVG a partir del estado del motor y no guarda estado.
- `src/interfaz/` es lo único que toca la pantalla.
- Datos editables en `src/datos/` (niveles, personajes, textos).

## Antes de dar algo por terminado
- `npm test`: todos los niveles tienen que poder ganarse en todos los tableros posibles.
- Revisar en 1366×768 y en tamaño celular (360×620): sin scroll y sin errores en la consola.
- Mirar los dibujos en grande ("Ver dibujo"): que no asomen partes ni queden cosas al revés.
- Si cambia algo del armado, probar también `npm run build:pendrive` abriendo el archivo con doble clic.
