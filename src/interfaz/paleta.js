/* La paleta: los bloques que se pueden agregar en cada nivel. */
import { $, ico } from './dom.js';
import { nivelActual } from './estado.js';

/* ----- paleta ----- */
export const BOTONES_PALETA = [
  { tipo:'mov', d:'u', txt:'Arriba', clase:'c-mov' }, { tipo:'mov', d:'d', txt:'Abajo', clase:'c-mov' },
  { tipo:'mov', d:'l', txt:'Izquierda', clase:'c-mov' }, { tipo:'mov', d:'r', txt:'Derecha', clase:'c-mov' },
  { tipo:'act', txt:'Encender', clase:'c-act' }, { tipo:'btn', txt:'Apretar', clase:'c-btn' },
  { tipo:'esperar', txt:'Esperar', clase:'c-esp' }, { tipo:'garrote', txt:'Garrote', clase:'c-gar' },
  { tipo:'loop', txt:'Repetir', clase:'c-loop' }, { tipo:'si', txt:'Si', clase:'c-si' }
];

export function permitido(tipo, d){ const b = nivelActual().bloques; return b.includes(tipo) || (tipo === 'mov' && b.includes(d)); }

export function dibujarPaleta(){
  $('paleta').innerHTML = BOTONES_PALETA.filter(b => permitido(b.tipo, b.d)).map(b =>
    '<button class="bloque-btn '+b.clase+'" aria-label="'+b.txt+'" data-tipo="'+b.tipo+'" data-d="'+(b.d||'')+'">'+ico(b.d||b.tipo)+
    '<span'+(b.d ? ' class="nom-flecha"' : '')+'>'+b.txt+'</span></button>').join('');
}
