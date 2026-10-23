# La Gran Máquina

Juego para aprender a programar en 4.º grado. Los chicos arman una secuencia de bloques y el personaje la cumple paso a paso: secuencias, repeticiones (Repetir) y condicionales (Si). Al abrirlo se elige el modo: **Fácil** y **Difícil** (15 niveles cada uno) o **Inventá tu nivel**, un editor para crear tableros propios y probarlos.

Con **Paso** el programa avanza de a un bloque: queda marcado el que sigue y la vuelta del Repetir. Desde ahí se puede seguir con **Ejecutar** o volver al principio con **Reiniciar**.

- Funciona en las netbooks de la escuela (1366×768) y en celulares, sin scroll.
- No pide cuentas: el progreso queda guardado en el navegador.
- Se puede usar sin internet desde un pendrive (ver más abajo).

## Comandos

Necesitás [Node.js](https://nodejs.org) 20 o más nuevo.

```bash
npm install              # la primera vez
npm run dev              # abre el juego en el navegador y se actualiza al guardar
npm test                 # comprueba que todos los niveles se puedan ganar
npm run build            # arma la versión web en dist/
npm run build:pendrive   # arma un solo archivo: dist-pendrive/la-gran-maquina.html
```

## Cómo está organizado

```
index.html                  la pantalla (estructura fija y textos de "Cómo jugar")
src/
  main.js                   arranca el juego
  config.js                 velocidades y dificultades
  guardado.js               progreso en el navegador (formato v4; migra v3 y v2 al abrir)
  modos/                    un archivo por modo de la pantalla de inicio + index.js con la lista
  datos/                    ← lo que más se cambia
    niveles/                facil.js, dificil.js y LEYENDA.md (cómo se escribe un mapa)
    personajes/             un archivo por personaje + index.js con el orden
    textos.js               mensajes de error, ayudas, preguntas del Si, Paso, editor, pantalla final
    sonidos.js              los sonidos (sin archivos) y cuál suena en cada momento
  motor/                    la lógica pura: no dibuja ni toca la pantalla
    mapa.js                 lee los mapas y arma los tableros al azar
    programa.js             bloques y programas
    reglas.js               qué pasa con cada instrucción, enemigos, preguntas
    interprete.js           ejecuta (crearCorrida: de a un bloque, igual para Ejecutar y Paso), evalúa y prueba
    validar.js              revisa que un nivel tenga sentido (lo usan los tests y el editor)
    editor.js               arma niveles inventados con el mismo formato de LEYENDA.md
  dibujo/                   genera SVG a partir del estado del motor
    tablero.js, enemigos.js, personajes.js, avance.js (máquina y robot), util.js
  interfaz/                 todo lo que toca la pantalla
    estado.js, niveles.js, paleta.js, editor.js (bloques del programa), ejecucion.js,
    tablero.js, ventanas.js, final.js, controles.js, dom.js,
    inicio.js (pantalla de inicio), pantallas.js, sonido.js,
    editor-nivel.js y mis-niveles.js (Inventá tu nivel)
  estilos/
    colores.css             todos los colores (variables)
    base.css, layout.css, componentes.css, tablero.css, ventanas.css,
    inicio.css, editor.css  pantalla de inicio e Inventá tu nivel
    responsive.css          celular
    animaciones.css         todas las animaciones
tests/                      pruebas con Vitest
```

La regla principal: **el motor no sabe nada de la pantalla**. Por eso se puede probar con tests y cambiar el dibujo sin romper las reglas.

## Tareas comunes

**Sumar un personaje.** Copiá un archivo de `src/datos/personajes/`, cambiale `id`, `nombre` y el dibujo, y agregalo a `src/datos/personajes/index.js`. Para un dibujo de un chico o una chica, guardá la foto en `src/datos/personajes/imagenes/` y seguí el ejemplo que está en `index.js`. Para el crédito usá solo nombre de pila y grado.

**Sumar o cambiar un nivel.** Editá `src/datos/niveles/facil.js` o `dificil.js`. La leyenda de los mapas está en `LEYENDA.md`. Cada nivel lleva una `solucion`: `npm test` comprueba que gane en todos los tableros posibles.

**Sumar un modo a la pantalla de inicio.** Creá un archivo en `src/modos/` (copiá `facil.js` o `inventar.js`) con `id`, `nombre`, `descripcion`, `icono`, `avance` y `arrancar`, y agregalo a la lista de `src/modos/index.js`. La pantalla de inicio no se toca. Para una lista de niveles nueva, usá `modoDeNiveles` y sumá la lista en `src/datos/niveles/index.js` y en `config.js`.

**Cambiar un sonido.** Están en `src/datos/sonidos.js`: cada nota tiene frecuencia, duración y volumen. Se apagan desde el menú (Sonido: sí / no).

**Cambiar un texto.** Los mensajes están en `src/datos/textos.js`. Los textos de cada nivel, en el archivo del nivel.

**Cambiar colores.** `src/estilos/colores.css`. Pensalos para pantallas desteñidas: mucho contraste.

## Publicar en GitHub Pages

1. Poné el archivo que publica el juego en su lugar. En PowerShell, desde la carpeta del proyecto:
   ```powershell
   New-Item -ItemType Directory -Force .github/workflows
   Move-Item extras/deploy.yml .github/workflows/deploy.yml
   ```
   Después borrá la carpeta `extras`, que queda vacía.
2. Creá un repositorio vacío en GitHub (por ejemplo `la-gran-maquina`) y subí el proyecto:
   ```bash
   git init
   git add .
   git commit -m "La Gran Máquina"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/la-gran-maquina.git
   git push -u origin main
   ```
3. En el repo de GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Si el primer intento de publicar falló porque Pages todavía no estaba activado, entrá a **Actions**, elegí "Publicar en GitHub Pages" y tocá **Run workflow**.
4. Desde ahí, cada `git push` a `main` corre los tests y publica el juego en `https://TU-USUARIO.github.io/la-gran-maquina/`. El avance se ve en la pestaña **Actions**.

## Versión para pendrive

`npm run build:pendrive` genera `dist-pendrive/la-gran-maquina.html`: un solo archivo con todo adentro. Se copia al pendrive y se abre con doble clic, sin internet.

Lo que se guarda en el navegador: `gran-maquina-v4` (modo, personaje, letra, velocidad, sonido y avance de cada modo) y `gran-maquina-mis-niveles` (los niveles inventados). Las claves viejas `gran-maquina-v3` y `-v2` se leen una vez, se pasan a v4 y no se borran.

El progreso queda guardado en cada navegador y en cada sitio por separado: lo que se avanzó en GitHub Pages no aparece en el archivo del pendrive, y al revés. Para ubicar a un chico en su nivel, usá **Saltar nivel** en el menú.
