/* El estado de la partida: dificultad, nivel, programa armado, preferencias. */
import * as Dibujo from '../dibujo/index.js';
import { NIVELES } from '../datos/niveles/index.js';
import { PERSONAJES } from '../datos/personajes/index.js';
import { Guardado } from '../guardado.js';

export const E = {
  dif:'facil', personaje:'tuerca', mayus:false, velocidad:'normal',
  progreso:{ facil:{ nivel:0, hecho:false, ganados:new Set() }, dificil:{ nivel:0, hecho:false, ganados:new Set() } },
  mapa:null, prog:[], cursor:{ ruta:[], i:0 },
  corrida:null,          // { est, gen, auto, timer, terminada }
  intentos:0,            // corridas en este nivel (el primer intento de un nivel de depurar usa un tablero donde falla)
  tableroPedido:null     // tablero elegido con "Probar con el tablero donde falla"
};

export const P = () => E.progreso[E.dif];

export const niveles = () => NIVELES[E.dif];

export const nivelActual = () => niveles()[P().nivel];

export function guardar(){
  const prog = {};
  Object.keys(E.progreso).forEach(d => { const p = E.progreso[d]; prog[d] = { nivel:p.nivel, hecho:p.hecho, ganados:[...p.ganados] }; });
  Guardado.escribir({ dif:E.dif, personaje:E.personaje, mayus:E.mayus, velocidad:E.velocidad, progreso:prog });
}

export function personaje(){ return PERSONAJES.find(p => p.id === E.personaje) || PERSONAJES[0]; }

export function piezasHechas(){ return Math.min(Dibujo.total, P().nivel + (P().hecho ? 1 : 0)); }

export function usaFrente(){ const b = nivelActual().bloques; return b.includes('si') || b.includes('garrote'); }
