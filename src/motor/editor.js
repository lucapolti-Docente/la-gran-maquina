/* El editor de niveles, sin pantalla: arma y cambia un nivel inventado.
   Un nivel inventado usa el mismo formato que los niveles del juego (ver datos/niveles/LEYENDA.md):
   filas de texto en `mapa`, `enemigo:{ desde, hasta }` para Chatarrín, `bloques` y `max`. Así el motor no cambia. */

/* Tamaño de la cuadrícula: entra sin scroll en 1366×768 y en 360×620. */
export const LIMITES = { ancho:{ min:3, max:10 }, alto:{ min:2, max:6 } };
export const LIMITE_BLOQUES = 30;

/* Lo que se puede pintar en un casillero (una letra del mapa). Chatarrín va aparte, porque no es una letra. */
export const HERRAMIENTAS = ['.','#','S','M','G','L','B','P','T','H','E','<','>','^','v'];
export const BLOQUES_EDITOR = ['mov','act','btn','esperar','garrote','loop','si'];
const UNICAS = ['S','M'];

const limitar = (n, l) => Math.max(l.min, Math.min(l.max, n));

export function nivelNuevo(ancho, alto){
  ancho = limitar(ancho || 7, LIMITES.ancho); alto = limitar(alto || 5, LIMITES.alto);
  const y = Math.floor((alto - 1) / 2);
  const mapa = Array.from({ length:alto }, (_, j) => j === y ? 'S' + '.'.repeat(ancho - 2) + 'M' : '.'.repeat(ancho));
  return { nombre:'', autor:'', mapa, enemigo:null, bloques:['mov'], max:null, probado:false };
}

const dentro = (nv, x, y) => y >= 0 && y < nv.mapa.length && x >= 0 && x < nv.mapa[0].length;

/* Pinta un casillero. La salida y la bandera son una sola: si se pintan en otro lado, se mudan. */
export function pintar(nv, x, y, letra){
  if (!dentro(nv, x, y) || !HERRAMIENTAS.includes(letra)) return nv;
  if (nv.mapa[y][x] === letra) return nv;
  let filas = nv.mapa.map(f => [...f]);
  if (UNICAS.includes(letra)) filas = filas.map(f => f.map(c => c === letra ? '.' : c));
  filas[y][x] = letra;
  return { ...nv, mapa:filas.map(f => f.join('')), probado:false };
}

/* Chatarrín: de dónde sale y hasta dónde llega. Sin `hasta` se queda quieto en `desde`. */
export function ponerChatarrin(nv, desde, hasta){
  if (!dentro(nv, desde[0], desde[1])) return nv;
  const h = hasta && dentro(nv, hasta[0], hasta[1]) ? hasta : desde;
  return { ...nv, enemigo:{ desde:[desde[0], desde[1]], hasta:[h[0], h[1]] }, probado:false };
}

export function sacarChatarrin(nv){ return nv.enemigo ? { ...nv, enemigo:null, probado:false } : nv; }

/* ¿Este casillero es una punta del camino de Chatarrín? */
export function esPuntaDeChatarrin(nv, x, y){
  const e = nv.enemigo; if (!e) return false;
  return (e.desde[0] === x && e.desde[1] === y) || (e.hasta[0] === x && e.hasta[1] === y);
}

/* Cambia el tamaño: lo que queda afuera se pierde; lo nuevo es piso. */
export function cambiarTamano(nv, ancho, alto){
  ancho = limitar(ancho, LIMITES.ancho); alto = limitar(alto, LIMITES.alto);
  const mapa = Array.from({ length:alto }, (_, y) => Array.from({ length:ancho }, (_, x) => (nv.mapa[y] && nv.mapa[y][x]) || '.').join(''));
  let enemigo = nv.enemigo;
  if (enemigo && ![enemigo.desde, enemigo.hasta].every(([x,y]) => x < ancho && y < alto)) enemigo = null;
  return { ...nv, mapa, enemigo, probado:false };
}

export function cambiarBloques(nv, bloque, activo){
  if (!BLOQUES_EDITOR.includes(bloque)) return nv;
  const bloques = BLOQUES_EDITOR.filter(b => b === bloque ? activo : nv.bloques.includes(b));
  return { ...nv, bloques, probado:false };
}

export function cambiarMax(nv, max){
  const m = max ? Math.max(1, Math.min(LIMITE_BLOQUES, max)) : null;
  return { ...nv, max:m, probado:false };
}

/* Las preguntas del Si que tienen sentido en este mapa (siempre hay al menos una). */
export function preguntasDelMapa(mapa, enemigo){
  const t = mapa.join(''), p = [];
  if (enemigo || /[Ee<>^v]/.test(t)) p.push('enemigo');
  if (/[#o]/.test(t)) p.push('roca');
  if (/T/.test(t)) p.push('roja');
  if (/[Ll]/.test(t)) p.push('lampara');
  return p.length ? p : ['roca'];
}

/* Pasa un nivel inventado al formato de los niveles del juego. Los textos los pone la interfaz. */
export function aNivelDeJuego(nv, textos){
  textos = textos || {};
  const n = { titulo:nv.nombre || textos.titulo || '', bloques:[...nv.bloques], mapa:[...nv.mapa], intro:textos.intro || '', dato:textos.dato || '' };
  if (nv.bloques.includes('si')) n.preguntas = preguntasDelMapa(nv.mapa, nv.enemigo);
  if (nv.max) n.max = nv.max;
  if (nv.enemigo) n.enemigo = { desde:[...nv.enemigo.desde], hasta:[...nv.enemigo.hasta] };
  return n;
}

/* Y al revés: abre un nivel del juego en el editor (sirve para copiar un nivel y cambiarlo). */
export function desdeNivelDeJuego(n){
  const bloques = BLOQUES_EDITOR.filter(b => n.bloques.includes(b) || (b === 'mov' && n.bloques.some(d => ['u','d','l','r'].includes(d))));
  return { nombre:n.titulo || '', autor:'', mapa:[...n.mapa], enemigo:n.enemigo ? { desde:[...n.enemigo.desde], hasta:[...n.enemigo.hasta] } : null,
           bloques, max:n.max || null, probado:false };
}
