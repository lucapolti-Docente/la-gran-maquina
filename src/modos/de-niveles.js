/* Arma un modo a partir de una lista de niveles de src/datos/niveles/ (Fácil, Difícil y los que se sumen). */
import * as Dibujo from '../dibujo/index.js';
import { NIVELES } from '../datos/niveles/index.js';

export function modoDeNiveles({ id, nombre, descripcion }){
  const total = () => NIVELES[id].length;
  const prog = E => E.progreso[id] || { nivel:0, hecho:false, ganados:new Set() };
  return {
    id, nombre, descripcion,
    /* El dibujo de la tarjeta es el avance real: la máquina o el robot con las piezas ganadas. */
    icono:E => Dibujo.maquina(id, Math.min(Dibujo.total, prog(E).nivel + (prog(E).hecho ? 1 : 0)), { fondo:'transparent' }),
    avance:E => ({ hechos:prog(E).ganados.size, total:total() }),
    arrancar:app => app.jugarNiveles(id)
  };
}
