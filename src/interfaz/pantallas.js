/* Qué pantalla se ve: inicio, mis niveles, editor o el juego (con o sin un nivel inventado en prueba). */
const PANTALLAS = ['en-inicio', 'en-mis-niveles', 'en-editor', 'en-prueba'];

/* clase: una de PANTALLAS, o null para el juego de siempre. */
export function mostrarPantalla(clase){
  PANTALLAS.forEach(c => document.body.classList.toggle(c, c === clase));
}

/* En estas pantallas no hay programa: el teclado no agrega bloques. */
export const sinPrograma = () => document.body.matches('.en-inicio, .en-mis-niveles, .en-editor');
