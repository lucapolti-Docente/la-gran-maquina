/* Los enemigos: Chatarrín, Bulón y Chispero. Dibujos originales. */
import { tinta } from './util.js';

/* ----- enemigos (dibujos originales) ----- */
export const CHATARRIN =
  '<g '+tinta+'>'+
  '<path d="M50 20 q-6 -5 0 -9 q6 -4 0 -9" fill="none"/>'+
  '<rect x="20" y="22" width="60" height="54" rx="8" fill="#C0602F"/>'+
  '<circle cx="28" cy="69" r="3" fill="#16163A" stroke="none"/><circle cx="72" cy="69" r="3" fill="#16163A" stroke="none"/>'+
  '<circle cx="38" cy="44" r="8" fill="#FFFFFF"/><circle cx="62" cy="44" r="8" fill="#FFFFFF"/>'+
  '<circle cx="40" cy="45" r="3.5" fill="#16163A" stroke="none"/><circle cx="60" cy="45" r="3.5" fill="#16163A" stroke="none"/>'+
  '<path d="M28 33 l16 6 M72 33 l-16 6"/>'+
  '<path d="M32 64 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5" fill="none"/>'+
  '<rect x="28" y="76" width="12" height="12" rx="3" fill="#6B7184"/><rect x="60" y="76" width="12" height="12" rx="3" fill="#6B7184"/>'+
  '</g>';

export const BULON =
  '<g '+tinta+'>'+
  '<rect x="14" y="42" width="12" height="28" rx="5" fill="#9AA3B5"/><rect x="74" y="42" width="12" height="28" rx="5" fill="#9AA3B5"/>'+
  '<rect x="32" y="80" width="12" height="12" rx="3" fill="#16163A"/><rect x="56" y="80" width="12" height="12" rx="3" fill="#16163A"/>'+
  '<rect x="25" y="34" width="50" height="48" rx="8" fill="#4E5D80"/>'+
  '<path d="M37 8 h26 l9 13 l-9 13 h-26 l-9 -13 Z" fill="#9AA3B5"/>'+
  '<rect x="33" y="44" width="34" height="13" rx="5" fill="#16163A"/>'+
  '<rect x="41" y="47" width="18" height="7" rx="3" fill="#FF3B3B" stroke="none"/>'+
  '<path d="M38 70 h24"/>'+
  '</g>';

export function chispero(dir, apagado){
  const tobera = { r:'<rect x="70" y="40" width="26" height="14" rx="3"/>', l:'<rect x="4" y="40" width="26" height="14" rx="3"/>',
                   u:'<rect x="43" y="4" width="14" height="30" rx="3"/>', d:'<rect x="43" y="80" width="14" height="18" rx="3"/>' }[dir];
  return '<g '+tinta+'>'+
    '<g fill="'+(apagado ? '#8A8F9C' : '#FFC400')+'">'+tobera+'</g>'+
    '<rect x="20" y="58" width="60" height="30" rx="6" fill="#5A5F73"/>'+
    '<path d="M26 58 a24 24 0 0 1 48 0 Z" fill="'+(apagado ? '#A3A7B3' : '#7A3FC7')+'"/>'+
    '<circle cx="40" cy="47" r="6" fill="#FFFFFF"/><circle cx="60" cy="47" r="6" fill="#FFFFFF"/>'+
    (apagado ? '<path d="M36 43 l8 8 M44 43 l-8 8 M56 43 l8 8 M64 43 l-8 8" stroke-width="3"/>'
             : '<circle cx="41" cy="48" r="2.5" fill="#16163A" stroke="none"/><circle cx="61" cy="48" r="2.5" fill="#16163A" stroke="none"/>')+
    '<path d="M32 74 h36" stroke="#FFC400"/></g>';
}

export const ENEMIGOS = {
  'Chatarrín':{ svg:CHATARRIN, texto:'Va y viene por su camino de puntos.' },
  'Bulón':{ svg:BULON, texto:'Se queda quieto cuidando el camino.' },
  'Chispero':{ svg:chispero('r', false), texto:'Tira chispas en línea recta, un turno sí y uno no.' }
};
