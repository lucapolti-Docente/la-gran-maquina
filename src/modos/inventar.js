/* Inventá tu nivel: el editor de niveles. */
import * as Motor from '../motor/index.js';
import * as Dibujo from '../dibujo/index.js';
import { EDITOR } from '../datos/textos.js';

/* El dibujo de la tarjeta: un tablero de ejemplo y un lápiz. */
const EJEMPLO = Motor.leerMapa(['S.#.M', '.G.L.', '..E..'], {});
const LAPIZ = '<g transform="translate(140 62) scale(.66)" stroke="#16163A" stroke-width="7" stroke-linejoin="round">'+
  '<path d="M300 40 L345 85 L210 220 L160 232 L172 182 Z" fill="#FFC400"/><path d="M172 182 L210 220" fill="none"/>'+
  '<path d="M300 40 L345 85 L330 100 L285 55 Z" fill="#FF5A1F"/><path d="M160 232 L166 206 L186 226 Z" fill="#16163A"/></g>';

export default {
  id:'inventar',
  nombre:EDITOR.titulo,
  descripcion:'Armá tu propio tablero, elegí los bloques y probalo.',
  icono:() => '<svg x="14" y="24" width="300" height="180" viewBox="0 0 500 300">'+Dibujo.tableroEditor(EJEMPLO, null)+'</svg>'+LAPIZ,
  avance:E => ({ texto:EDITOR.cantidad((E.misNiveles || []).length) }),
  arrancar:app => app.abrirEditor()
};
