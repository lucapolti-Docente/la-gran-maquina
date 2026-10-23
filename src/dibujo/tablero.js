/* Todo lo que se ve en el tablero: piso, rocas, objetos, enemigos y personaje. */
import * as Motor from '../motor/index.js';
import { BULON, CHATARRIN, chispero } from './enemigos.js';
import { contenidoPersonaje } from './personajes.js';
import { enCelda, engranajePath, T, tinta } from './util.js';

/* ----- cosas del tablero ----- */
export function roca(x, y){
  const X = x*T, Y = y*T;
  return '<g '+tinta+'>'+
    '<path d="M'+(X+14)+' '+(Y+80)+' L'+(X+22)+' '+(Y+40)+' L'+(X+44)+' '+(Y+20)+' L'+(X+72)+' '+(Y+28)+' L'+(X+88)+' '+(Y+58)+' L'+(X+84)+' '+(Y+82)+' Z" fill="#9C8A78"/>'+
    '<path d="M'+(X+34)+' '+(Y+44)+' L'+(X+48)+' '+(Y+36)+'" fill="none" stroke="#E8DCCD"/></g>';
}

export function meta(x, y, ocupada){
  const X = x*T, Y = y*T;
  if (ocupada) return '<g stroke="#16163A" stroke-width="3" stroke-linejoin="round">'+
    '<rect x="'+(X+14)+'" y="'+(Y+88)+'" width="72" height="8" rx="3" fill="#FFFFFF"/>'+
    '<path d="M'+(X+70)+' '+(Y+8)+' H'+(X+88)+' L'+(X+83)+' '+(Y+15)+' L'+(X+88)+' '+(Y+22)+' H'+(X+70)+' Z" fill="#FF5A1F"/></g>';
  return '<g '+tinta+'>'+
    '<rect x="'+(X+14)+'" y="'+(Y+78)+'" width="72" height="12" rx="4" fill="#FFFFFF"/>'+
    '<line x1="'+(X+30)+'" y1="'+(Y+80)+'" x2="'+(X+30)+'" y2="'+(Y+14)+'"/>'+
    '<path d="M'+(X+30)+' '+(Y+16)+' H'+(X+78)+' L'+(X+68)+' '+(Y+31)+' L'+(X+78)+' '+(Y+46)+' H'+(X+30)+' Z" fill="#FF5A1F"/></g>';
}

export function engranaje(x, y){
  const cx = x*T + 50, cy = y*T + 50;
  return '<g '+tinta+'><path d="'+engranajePath(cx,cy,32,8)+'" fill="#FFC400"/><circle cx="'+cx+'" cy="'+cy+'" r="10" fill="#FFFFFF"/></g>';
}

export function lampara(x, y, prendida){
  const cx = x*T + 50, Y = y*T;
  let s = '';
  if (prendida) {
    s += '<circle cx="'+cx+'" cy="'+(Y+42)+'" r="40" fill="#FFE680" opacity=".55"/>';
    [[-34,-20],[34,-20],[0,-38],[-38,10],[38,10]].forEach(([dx,dy]) => {
      s += '<line x1="'+(cx+dx*0.75)+'" y1="'+(Y+42+dy*0.75)+'" x2="'+(cx+dx)+'" y2="'+(Y+42+dy)+'" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round"/>';
    });
  }
  s += '<g '+tinta+'><circle cx="'+cx+'" cy="'+(Y+42)+'" r="20" fill="'+(prendida ? '#FFE14D' : '#C9CDD8')+'"/>'+
    '<rect x="'+(cx-11)+'" y="'+(Y+60)+'" width="22" height="18" rx="3" fill="#6B7184"/>'+
    '<path d="M'+(cx-7)+' '+(Y+44)+' l4 6 l3 -6 l3 6 l4 -6" fill="none" stroke-width="3"/></g>';
  return s;
}

export function boton(x, y, apretado){
  const cx = x*T + 50, Y = y*T;
  return '<g '+tinta+'><rect x="'+(cx-30)+'" y="'+(Y+58)+'" width="60" height="24" rx="6" fill="#B8BCCB"/>'+
    (apretado ? '<path d="M'+(cx-20)+' '+(Y+58)+' a20 7 0 0 1 40 0 Z" fill="#22B573"/>'
              : '<path d="M'+(cx-20)+' '+(Y+58)+' v-10 a20 14 0 0 1 40 0 v10 Z" fill="#E53935"/>')+'</g>';
}

export function compuerta(x, y, abierta){
  const X = x*T, Y = y*T;
  if (abierta) return '<g stroke="#16163A" stroke-width="4"><rect x="'+(X+6)+'" y="'+(Y+6)+'" width="12" height="88" fill="#6B7184"/><rect x="'+(X+82)+'" y="'+(Y+6)+'" width="12" height="88" fill="#6B7184"/></g>';
  let s = '<g '+tinta+'><rect x="'+(X+6)+'" y="'+(Y+6)+'" width="88" height="88" rx="4" fill="#8A93A8"/>';
  for (let i = 0; i < 3; i++) s += '<line x1="'+(X+28+i*22)+'" y1="'+(Y+26)+'" x2="'+(X+28+i*22)+'" y2="'+(Y+90)+'"/>';
  s += '<rect x="'+(X+6)+'" y="'+(Y+6)+'" width="88" height="18" fill="#FFC400"/>';
  for (let i = 0; i < 4; i++) s += '<path d="M'+(X+10+i*22)+' '+(Y+22)+' l12 -14 h8 l-12 14 Z" fill="#16163A" stroke="none"/>';
  return s + '</g>';
}

/* estado: 'rojo', 'verde' o '?' (todavía no se sabe) */
export function semaforo(x, y, estado){
  const X = x*T, Y = y*T;
  return '<g '+tinta+'><rect x="'+(X+44)+'" y="'+(Y+72)+'" width="12" height="22" fill="#5A5F73"/>'+
    '<rect x="'+(X+28)+'" y="'+(Y+6)+'" width="44" height="68" rx="9" fill="#16163A"/>'+
    '<circle cx="'+(X+50)+'" cy="'+(Y+24)+'" r="12" fill="'+(estado === 'rojo' ? '#FF3B3B' : '#5A2A2A')+'"/>'+
    '<circle cx="'+(X+50)+'" cy="'+(Y+56)+'" r="12" fill="'+(estado === 'verde' ? '#2EE07A' : '#1F4A32')+'"/></g>'+
    (estado === '?' ? '<text x="'+(X+50)+'" y="'+(Y+52)+'" text-anchor="middle" font-size="40" font-weight="bold" fill="#FFFFFF" font-family="Verdana, sans-serif">?</text>' : '');
}

export function escudoItem(x, y){
  const X = x*T, Y = y*T;
  return '<g '+tinta+'><path d="M'+(X+28)+' '+(Y+20)+' h44 v26 c0 18 -14 28 -22 32 c-8 -4 -22 -14 -22 -32 Z" fill="#CFD8DC"/>'+
    '<path d="M'+(X+50)+' '+(Y+30)+' l5 10 l11 2 l-8 8 l2 11 l-10 -5 l-10 5 l2 -11 l-8 -8 l11 -2 Z" fill="#FFC400" stroke-width="3"/></g>';
}

export function signoAzar(x, y){
  const X = x*T, Y = y*T;
  return '<circle cx="'+(X+50)+'" cy="'+(Y+50)+'" r="32" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="8 7"/>'+
    '<text x="'+(X+50)+'" y="'+(Y+65)+'" text-anchor="middle" font-size="42" font-weight="bold" fill="#FFFFFF" font-family="Verdana, sans-serif">?</text>';
}

/* Marca del editor para lo que aparece a veces: un "?" chiquito en la esquina del casillero. */
function marcaAVeces(x, y){
  const X = x*T, Y = y*T;
  return '<circle cx="'+(X+78)+'" cy="'+(Y+22)+'" r="18" fill="#FFFFFF" stroke="#16163A" stroke-width="4"/>'+
    '<text x="'+(X+78)+'" y="'+(Y+31)+'" text-anchor="middle" font-size="26" font-weight="bold" fill="#16163A" font-family="Verdana, sans-serif">?</text>';
}

export function chispas(celdas, dir, activo){
  if (!celdas.length) return '';
  const horiz = dir === 'l' || dir === 'r';
  let d = '';
  celdas.forEach(c => {
    const X = c.x*T, Y = c.y*T;
    d += horiz ? 'M'+X+' '+(Y+50)+' l25 -10 l25 20 l25 -20 l25 10 '
               : 'M'+(X+50)+' '+Y+' l-10 25 l20 25 l-20 25 l10 25 ';
  });
  if (!activo) return '<path d="'+d+'" fill="none" stroke="#FFE14D" stroke-width="3" stroke-dasharray="4 10" opacity=".8"/>';
  return '<path d="'+d+'" fill="none" stroke="#16163A" stroke-width="11" stroke-linejoin="round"/><path d="'+d+'" fill="none" stroke="#FFE14D" stroke-width="5" stroke-linejoin="round"/>';
}

/* Capa fija del tablero (piso, rocas, camino de Chatarrín). */
export function tableroFijo(m){
  const w = m.ancho*T, h = m.alto*T;
  let s = '<rect x="0" y="0" width="'+w+'" height="'+h+'" fill="#1747A6"/>';
  for (let i = 1; i < m.ancho; i++) s += '<line class="celda-linea" x1="'+i*T+'" y1="0" x2="'+i*T+'" y2="'+h+'"/>';
  for (let j = 1; j < m.alto; j++) s += '<line class="celda-linea" x1="0" y1="'+j*T+'" x2="'+w+'" y2="'+j*T+'"/>';
  if (m.inicio) s += '<rect x="'+(m.inicio.x*T+8)+'" y="'+(m.inicio.y*T+8)+'" width="84" height="84" rx="14" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="10 8"/>';
  m.rocas.forEach(c => { const [x,y] = c.split(',').map(Number); s += roca(x,y); });
  if (m.enemigo) {
    const c = m.enemigo.camino, a = c[0], b = c[c.length-1];
    s += '<line x1="'+(a.x*T+50)+'" y1="'+(a.y*T+50)+'" x2="'+(b.x*T+50)+'" y2="'+(b.y*T+50)+'" stroke="#FF8A65" stroke-width="8" stroke-linecap="round" stroke-dasharray="2 18"/>';
  }
  s += '<rect x="2" y="2" width="'+(w-4)+'" height="'+(h-4)+'" fill="none" stroke="#16163A" stroke-width="6" rx="6"/>';
  return s;
}

/* Capa que cambia mientras se juega. Si el tablero todavía no se sorteó, muestra signos de pregunta. */
export function tableroVivo(m, est, falla){
  const v = est.variante;
  let s = m.meta ? meta(m.meta.x, m.meta.y, est.x === m.meta.x && est.y === m.meta.y) : '';
  m.chisperos.forEach((c,i) => { s += chispas(Motor.celdasDeChispas(est, m, i), c.dir, !!v && Motor.chisperoActivo(est, i)); });
  est.rastro.forEach(c => { if (c === est.x+','+est.y) return; const [x,y] = c.split(',').map(Number); s += '<circle cx="'+(x*T+50)+'" cy="'+(y*T+88)+'" r="6" fill="#FFFFFF" opacity=".85"/>'; });
  m.engranajes.forEach((p,i) => { if (!est.juntados.has(i)) s += engranaje(p.x,p.y); });
  m.lamparas.forEach((p,i) => {
    if (p.azar && !v) s += signoAzar(p.x,p.y);
    else if (Motor.lamparaPresente(est, m, i)) s += lampara(p.x,p.y,est.encendidas.has(i));
  });
  m.botones.forEach(p => { s += boton(p.x,p.y,est.abiertas); });
  m.compuertas.forEach(p => { s += compuerta(p.x,p.y,est.abiertas); });
  if (!est.escudo) m.escudos.forEach(p => { s += escudoItem(p.x,p.y); });
  m.rocasAzar.forEach((p,i) => { s += v ? (v.roca === i ? roca(p.x,p.y) : '') : signoAzar(p.x,p.y); });
  m.semaforos.forEach((p,i) => { s += semaforo(p.x, p.y, v ? (Motor.semaforoRojo(est, i) ? 'rojo' : 'verde') : '?'); });
  m.guardias.forEach((g,i) => {
    if (est.apagados.has('g'+i)) return;
    if (g.azar && !v) { s += signoAzar(g.x,g.y); return; }
    if (!g.azar || v.guardias.has(i)) s += enCelda(g.x, g.y, BULON);
  });
  m.chisperos.forEach((c,i) => { s += enCelda(c.x, c.y, chispero(c.dir, est.apagados.has('k'+i))); });
  if (falla && falla.x !== undefined && !['enemigo','guardia','chispa','chispero'].includes(falla.tipo)) {
    const X = falla.x*T, Y = falla.y*T;
    s += '<g stroke="#FF3B3B" stroke-width="10" stroke-linecap="round"><line x1="'+(X+25)+'" y1="'+(Y+25)+'" x2="'+(X+75)+'" y2="'+(Y+75)+'"/><line x1="'+(X+75)+'" y1="'+(Y+25)+'" x2="'+(X+25)+'" y2="'+(Y+75)+'"/></g>';
  }
  return s;
}

/* El tablero del editor: todo a la vista, aunque todavía falte la salida o la bandera. */
export function tableroEditor(m, pj){
  // Lo que aparece a veces se ve siempre, con una marca de pregunta en la esquina.
  const v = { ...Motor.variantes(m)[0], guardias:new Set(m.guardias.map((_, i) => i)), lamparas:new Set(m.lamparas.map((_, i) => i)), roca:-1 };
  const est = Motor.crearEstado({ ...m, inicio:m.inicio || { x:-9, y:-9 } }, v);
  est.rastro = [];
  let s = tableroFijo(m) + tableroVivo(m, est, null);
  m.rocasAzar.forEach(p => { s += roca(p.x, p.y); });
  [...m.guardias, ...m.lamparas].filter(p => p.azar).concat(m.rocasAzar).forEach(p => { s += marcaAVeces(p.x, p.y); });
  if (m.enemigo) s += enCelda(m.enemigo.camino[0].x, m.enemigo.camino[0].y, CHATARRIN);
  if (m.inicio && pj) s += enCelda(m.inicio.x, m.inicio.y, contenidoPersonaje(pj));
  return s;
}

/* Un casillero suelto, para los botones de la paleta del editor. */
export function muestra(letra){
  if (letra === 'chatarrin') return '<rect width="100" height="100" fill="#1747A6"/>' + enCelda(0, 0, CHATARRIN);
  if (letra === '.') return '<rect width="100" height="100" fill="#1747A6"/><g stroke="#16163A" stroke-width="5" stroke-linejoin="round">'+
    '<path d="M22 62 L56 28 L82 54 L58 78 L38 78 Z" fill="#F48FB1"/><path d="M22 62 L38 78 L58 78 L44 48 Z" fill="#FFFFFF"/></g>';
  const m = Motor.leerMapa([letra], {});
  return tableroEditor(m, null).replace(/<rect x="2" y="2"[^>]*\/>/, '');
}

export function enemigoEnTablero(){
  return '<g id="enemigo"><g id="enemigoMueve"><svg x="0" y="0" width="100" height="100" viewBox="0 0 100 100">'+CHATARRIN+'</svg></g></g>';
}

export function personajeEnTablero(pj){
  return '<g id="pj"><circle id="pjEscudo" cx="50" cy="50" r="47" fill="#90CAF9" fill-opacity=".3" stroke="#BBDEFB" stroke-width="5" display="none"/>'+
    '<polygon id="pjFrente" points="" fill="#FFFFFF" stroke="#16163A" stroke-width="3" stroke-linejoin="round" display="none"/>'+
    '<g id="pjMueve"><g id="pjEspejo"><svg x="0" y="0" width="100" height="100" viewBox="0 0 100 100">'+contenidoPersonaje(pj)+'</svg></g></g></g>';
}

export const FRENTE = { r:'101,40 115,50 101,60', l:'-1,40 -15,50 -1,60', u:'40,-1 50,-15 60,-1', d:'40,101 50,115 60,101' };
