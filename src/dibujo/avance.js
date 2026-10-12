/* El avance: La Gran Máquina (Fácil) y El Gran Robot (Difícil). Una pieza por nivel. */
import { engranajePath, tinta } from './util.js';

/* ----- avance: La Gran Máquina (fácil) y El Gran Robot (difícil), 15 piezas cada uno ----- */
export const MAQUINA = [
  '<g '+tinta+'><rect x="16" y="196" width="348" height="14" rx="4" fill="#C98B4E"/><rect x="34" y="210" width="14" height="24" fill="#A86B3C"/><rect x="332" y="210" width="14" height="24" fill="#A86B3C"/></g>',
  '<g '+tinta+'><rect x="105" y="150" width="10" height="46" fill="#6B7184"/><g class="gira"><path d="'+engranajePath(110,140,38,10)+'" fill="#FFC400"/><circle cx="110" cy="140" r="9" fill="#FFFFFF"/></g></g>',
  '<g '+tinta+'><g class="gira-inv"><path d="'+engranajePath(170,118,24,8)+'" fill="#2E6FE0"/><circle cx="170" cy="118" r="6" fill="#FFFFFF"/></g></g>',
  '<g '+tinta+'><g class="gira-eje"><line x1="110" y1="140" x2="84" y2="114" stroke-width="7"/><circle cx="84" cy="114" r="7" fill="#FF5A1F"/></g><circle cx="110" cy="140" r="6" fill="#16163A"/></g>',
  '<g '+tinta+'><g class="sube"><line x1="182" y1="112" x2="246" y2="152"/><rect x="232" y="150" width="30" height="20" rx="3" fill="#E04848"/></g><rect x="228" y="168" width="38" height="28" rx="3" fill="#B8BCCB"/></g>',
  '<g '+tinta+'><rect x="20" y="148" width="48" height="48" rx="6" fill="#22B573"/><line x1="68" y1="160" x2="104" y2="140"/><path d="M33 186 v-24 l11 14 l11 -14 v24" fill="none" stroke="#FFFFFF"/></g>',
  '<g '+tinta+'><line x1="44" y1="148" x2="44" y2="128"/><rect x="37" y="116" width="14" height="12" rx="2" fill="#6B7184"/><circle class="brilla" cx="44" cy="102" r="15" fill="#FFE14D"/></g>',
  '<g '+tinta+'><rect x="136" y="182" width="36" height="14" rx="3" fill="#B8BCCB"/><path d="M143 182 v-5 a11 9 0 0 1 22 0 v5 Z" fill="#E53935"/></g>',
  '<g '+tinta+' fill="none"><path d="M318 196 L340 64 L362 196"/><path d="M324 160 H356 M329 128 H351 M334 96 H346 M324 160 L351 128 L334 96"/></g>',
  '<g fill="none" stroke-linecap="round"><path d="M282 160 C 280 62, 60 54, 56 148" stroke="#16163A" stroke-width="9"/><path d="M282 160 C 280 62, 60 54, 56 148" stroke="#FF5A1F" stroke-width="4"/></g>',
  '<g '+tinta+'><rect x="276" y="152" width="12" height="8" fill="#B8BCCB"/><rect x="268" y="158" width="28" height="38" rx="4" fill="#16163A"/><path d="M276 172 h12 M282 166 v12" stroke="#FFC400"/></g>',
  '<g '+tinta+'><line x1="290" y1="158" x2="290" y2="54"/><path d="M236 22 L306 16 L310 46 L240 54 Z" fill="#1747A6"/><path d="M259 20 L263 52 M283 18 L287 49 M238 38 L308 31" stroke="#8FD0FF" stroke-width="2"/></g>',
  '<g '+tinta+'><rect x="188" y="180" width="28" height="16" rx="3" fill="#6B7184"/><path d="M192 180 a10 10 0 0 1 20 0 Z" fill="#8FD0FF"/><circle class="brilla" cx="202" cy="176" r="3" fill="#FF3B3B" stroke="none"/></g>',
  '<g '+tinta+'><line x1="340" y1="64" x2="340" y2="48"/><circle class="brilla" cx="340" cy="44" r="6" fill="#E53935"/><path d="M326 36 a18 18 0 0 0 0 16 M354 36 a18 18 0 0 1 0 16" fill="none" stroke-width="3"/></g>',
  '<g '+tinta+'><line x1="170" y1="83" x2="170" y2="40"/><path d="M170 42 H204 L196 54 L204 66 H170 Z" fill="#FF5A1F"/><path d="M182 50 l3 6 l6 1 l-5 4 l2 6 l-6 -3 l-6 3 l2 -6 l-5 -4 l6 -1 Z" fill="#FFC400" stroke-width="2"/></g>'
];

export const ORDEN_MAQUINA = [9, 11, 0, 8, 14, 1, 2, 3, 4, 5, 6, 7, 13, 10, 12];

export const ROBOT = [
  '<g '+tinta+'><rect x="96" y="212" width="188" height="16" rx="6" fill="#6B7184"/></g>',
  '<g '+tinta+'><rect x="154" y="158" width="24" height="42" rx="6" fill="#8FD0FF"/><rect x="202" y="158" width="24" height="42" rx="6" fill="#8FD0FF"/></g>',
  '<g '+tinta+'><rect x="140" y="194" width="46" height="18" rx="8" fill="#16163A"/><rect x="194" y="194" width="46" height="18" rx="8" fill="#16163A"/></g>',
  '<g '+tinta+'><rect x="132" y="88" width="116" height="78" rx="16" fill="#2E6FE0"/></g>',
  '<g '+tinta+'><rect x="160" y="102" width="60" height="36" rx="6" fill="#FFFFFF"/><circle cx="176" cy="120" r="5" fill="#22B573"/><circle cx="190" cy="120" r="5" fill="#FFC400"/><circle cx="204" cy="120" r="5" fill="#E53935"/></g>',
  '<g '+tinta+'><rect x="100" y="96" width="28" height="62" rx="12" fill="#8FD0FF"/></g>',
  '<g '+tinta+'><rect x="252" y="96" width="28" height="62" rx="12" fill="#8FD0FF"/></g>',
  '<g '+tinta+'><path d="M68 104 h48 v28 c0 18 -14 28 -24 32 c-10 -4 -24 -14 -24 -32 Z" fill="#CFD8DC"/><path d="M92 114 l6 12 l13 2 l-10 9 l3 13 l-12 -6 l-12 6 l3 -13 l-10 -9 l13 -2 Z" fill="#FFC400" stroke-width="3"/></g>',
  '<g '+tinta+'><rect x="284" y="62" width="14" height="96" rx="6" fill="#5C6B8A"/><path class="brilla" d="M296 30 l-10 14 h12 l-10 14" fill="none" stroke="#FFC400" stroke-width="5"/></g>',
  '<g '+tinta+'><rect x="176" y="74" width="28" height="16" fill="#8FD0FF"/><rect x="140" y="18" width="100" height="58" rx="16" fill="#2E6FE0"/></g>',
  '<g '+tinta+'><circle cx="170" cy="44" r="11" fill="#FFFFFF"/><circle cx="210" cy="44" r="11" fill="#FFFFFF"/><circle class="brilla" cx="170" cy="44" r="5" fill="#16163A" stroke="none"/><circle class="brilla" cx="210" cy="44" r="5" fill="#16163A" stroke="none"/></g>',
  '<g '+tinta+'><rect x="168" y="60" width="44" height="10" rx="3" fill="#FFFFFF"/><path d="M179 60 v10 M190 60 v10 M201 60 v10" stroke-width="3"/></g>',
  '<g '+tinta+'><rect x="128" y="34" width="12" height="26" rx="4" fill="#FFC400"/><rect x="240" y="34" width="12" height="26" rx="4" fill="#FFC400"/></g>',
  '<g '+tinta+'><line x1="190" y1="18" x2="190" y2="9"/><circle class="brilla" cx="190" cy="7" r="5" fill="#E53935"/></g>',
  '<g '+tinta+'><path class="brilla" d="M190 144 l4 8 l9 1 l-7 6 l2 9 l-8 -5 l-8 5 l2 -9 l-7 -6 l9 -1 Z" fill="#FFC400" stroke-width="2"/></g>'
];

export const ORDEN_ROBOT = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];

export function maquina(tipo, cantidad, opciones){
  opciones = opciones || {};
  const piezas = tipo === 'dificil' ? ROBOT : MAQUINA, orden = tipo === 'dificil' ? ORDEN_ROBOT : ORDEN_MAQUINA;
  let s = '<rect x="0" y="0" width="380" height="240" fill="'+(opciones.fondo || 'none')+'"/>';
  orden.forEach(i => {
    if (i < cantidad) s += '<g class="'+(i === opciones.nueva ? 'pieza-nueva' : '')+'">'+piezas[i]+'</g>';
    else if (i === cantidad && !opciones.sinFantasma) s += '<g class="fantasma">'+piezas[i]+'</g>';
  });
  return s;
}

/* Cantidad de piezas del avance: una por nivel. */
export const total = MAQUINA.length;
