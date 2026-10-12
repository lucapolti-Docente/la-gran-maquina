/* Cómo se dibuja un personaje (con SVG propio o con la imagen de un dibujo). */
import { suelto } from './util.js';

export function contenidoPersonaje(pj){
  if (pj.imagen) return '<image href="'+pj.imagen+'" x="4" y="4" width="92" height="92" preserveAspectRatio="xMidYMid meet"/>';
  return pj.svg;
}

/* El personaje solo, en un SVG cuadrado (para Configuración y "Ver dibujo"). */
export const personajeSuelto = pj => suelto(contenidoPersonaje(pj));
