/* Revisa que un nivel tenga sentido antes de jugarlo: lo usan los tests de los niveles y el editor.
   Devuelve una lista de problemas { codigo, celdas } sin textos (los textos están en datos/textos.js). */
import { k, leerMapa } from './mapa.js';
import { DIRS } from './reglas.js';

export const BLOQUES_VALIDOS = ['mov','u','d','l','r','act','btn','esperar','garrote','loop','si'];
const LETRAS = '.#SMGLlBPEeoTH<>^v';

/* Lo que no puede pisar Chatarrín en su recorrido. */
const NO_PISA = { '#':'roca', 'o':'roca', 'P':'compuerta', '<':'chispero', '>':'chispero', '^':'chispero', 'v':'chispero',
                  'E':'bulon', 'e':'bulon', 'T':'semaforo', 'S':'salida', 'M':'bandera' };

const flechas = b => b.includes('mov') || ['u','d','l','r'].some(d => b.includes(d));
const dirsDadas = b => b.includes('mov') ? ['u','d','l','r'] : ['u','d','l','r'].filter(d => b.includes(d));

export function validarNivel(nivel){
  const p = [], add = (codigo, celdas, extra) => p.push({ codigo, celdas:celdas || [], ...extra });
  const filas = nivel && nivel.mapa;
  if (!Array.isArray(filas) || !filas.length || !filas[0].length) { add('mapaVacio'); return p; }
  if (new Set(filas.map(f => f.length)).size > 1) { add('noRectangular'); return p; }
  const ancho = filas[0].length, alto = filas.length;
  const cel = (x,y) => (x >= 0 && y >= 0 && x < ancho && y < alto) ? filas[y][x] : null;
  const donde = c => { const l = []; filas.forEach((f,y) => [...f].forEach((ch,x) => { if (ch === c) l.push({x,y}); })); return l; };

  const raras = []; filas.forEach((f,y) => [...f].forEach((ch,x) => { if (!LETRAS.includes(ch)) raras.push({x,y}); }));
  if (raras.length) add('letraDesconocida', raras);

  const S = donde('S'), M = donde('M');
  if (!S.length) add('faltaSalida'); else if (S.length > 1) add('variasSalidas', S);
  if (!M.length) add('faltaBandera'); else if (M.length > 1) add('variasBanderas', M);
  const P = donde('P'), B = donde('B');
  if (P.length && !B.length) add('compuertaSinBoton', P);
  if (B.length && !P.length) add('botonSinCompuerta', B);

  // Bloques
  const bl = nivel.bloques || [];
  const malos = bl.filter(b => !BLOQUES_VALIDOS.includes(b));
  if (malos.length) add('bloqueDesconocido', [], { bloques:malos });
  if (!flechas(bl)) add('sinFlechas');
  if (nivel.max !== undefined && nivel.max !== null && !(Number.isInteger(nivel.max) && nivel.max >= 1)) add('maxInvalido');
  if ((donde('L').length || donde('l').length) && !bl.includes('act')) add('lamparaSinEncender', [...donde('L'), ...donde('l')]);
  if (P.length && !bl.includes('btn')) add('compuertaSinApretar', P);

  // Chatarrín
  if (nivel.enemigo) {
    const { desde, hasta } = nivel.enemigo;
    const ok = c => Array.isArray(c) && c.length === 2 && c.every(Number.isInteger);
    if (!ok(desde) || !ok(hasta)) add('chatarrinSinRecorrido');
    else if (desde[0] !== hasta[0] && desde[1] !== hasta[1]) add('chatarrinNoRecto', [{x:desde[0],y:desde[1]},{x:hasta[0],y:hasta[1]}]);
    else {
      const m = leerMapa(filas, nivel), fuera = [], pisa = {};
      m.enemigo.camino.forEach(c => {
        const ch = cel(c.x, c.y);
        if (ch === null) fuera.push(c);
        else if (NO_PISA[ch]) (pisa[NO_PISA[ch]] = pisa[NO_PISA[ch]] || []).push(c);
      });
      if (fuera.length) add('chatarrinAfuera', fuera);
      Object.keys(pisa).forEach(que => add('chatarrinPisa', pisa[que], { que }));
    }
  }

  // ¿Se llega a todo? (sin contar enemigos que se mueven ni chispas: eso lo resuelve quien juega)
  if (S.length === 1 && M.length === 1 && flechas(bl)) {
    const dirs = dirsDadas(bl);
    const puedeAbrir = bl.includes('btn') && B.length > 0;
    const bloquea = c => c === null || '#<>^v'.includes(c) || (c === 'E' && !bl.includes('garrote')) || (c === 'P' && !puedeAbrir);
    // 'o' es una roca al azar: puede no estar, así que solo bloquea si es la única marcada.
    const rocasAzar = donde('o').length;
    const visto = new Set([k(S[0].x, S[0].y)]), cola = [S[0]];
    while (cola.length) {
      const a = cola.shift();
      dirs.forEach(d => {
        const [dx,dy] = DIRS[d], x = a.x + dx, y = a.y + dy, c = cel(x,y);
        if (bloquea(c) || (c === 'o' && rocasAzar === 1) || visto.has(k(x,y))) return;
        visto.add(k(x,y)); cola.push({x,y});
      });
    }
    const llega = c => visto.has(k(c.x, c.y));
    if (!llega(M[0])) add('banderaInalcanzable', M);
    const lejos = [...donde('G'), ...donde('L'), ...donde('l'), ...(P.length ? B : [])].filter(c => !llega(c));
    if (lejos.length) add('cosasInalcanzables', lejos);
  }
  return p;
}
