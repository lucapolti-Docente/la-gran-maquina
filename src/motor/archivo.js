/* Guardar niveles inventados en un archivo de texto y volver a abrirlos (para pasarlos por pendrive o mail).
   El archivo se puede leer y hasta corregir con el Bloc de notas:

     LA GRAN MÁQUINA · NIVELES
     === NIVEL ===
     nombre: El laberinto
     autor: Sofi
     bloques: mov act loop
     limite: 12                  ← o "sin límite"
     chatarrin: 1,0 hasta 1,2    ← solo si hay Chatarrín
     mapa:
     S..#M
     .....

   El mapa usa las mismas letras que los niveles del juego (ver datos/niveles/LEYENDA.md). */
import { LIMITES, LIMITE_BLOQUES, desdeNivelDeJuego } from './editor.js';
import { LETRAS } from './validar.js';

export const ENCABEZADO = 'LA GRAN MÁQUINA · NIVELES';
const SEPARADOR = '=== NIVEL ===';
const SIN_LIMITE = 'sin límite';
const CLAVES = { nombre:'nombre', autor:'autor', bloques:'bloques', limite:'limite', 'límite':'limite', chatarrin:'chatarrin', 'chatarrín':'chatarrin' };

const unaLinea = s => String(s || '').replace(/[\r\n]+/g, ' ').trim();

export function nivelesATexto(lista){
  const partes = [ENCABEZADO, 'Para abrirlo: Inventá tu nivel → Mis niveles → Abrir archivo.', ''];
  lista.forEach(nv => {
    partes.push(SEPARADOR, 'nombre: '+unaLinea(nv.nombre), 'autor: '+unaLinea(nv.autor), 'bloques: '+nv.bloques.join(' '),
                'limite: '+(nv.max || SIN_LIMITE));
    if (nv.enemigo) partes.push('chatarrin: '+nv.enemigo.desde.join(',')+' hasta '+nv.enemigo.hasta.join(','));
    partes.push('mapa:', ...nv.mapa, '');
  });
  return partes.join('\r\n');
}

const punto = s => { const m = /^\s*(\d+)\s*,\s*(\d+)\s*$/.exec(s || ''); return m ? [Number(m[1]), Number(m[2])] : null; };
const entre = (n, l) => n >= l.min && n <= l.max;

/* Arma un nivel del editor con lo leído; si algo no tiene arreglo, devuelve null. */
function armar(d){
  const mapa = d.mapa;
  if (!mapa.length || new Set(mapa.map(f => f.length)).size > 1) return null;
  if (!entre(mapa[0].length, LIMITES.ancho) || !entre(mapa.length, LIMITES.alto)) return null;
  if (mapa.some(f => [...f].some(c => !LETRAS.includes(c)))) return null;
  // Los bloques se leen como en los niveles del juego: u d l r cuentan como flechas.
  const bloques = desdeNivelDeJuego({ mapa, bloques:(d.bloques || '').split(/[\s,]+/).filter(Boolean) }).bloques;
  if (!bloques.length) bloques.push('mov');
  const n = parseInt(d.limite, 10);
  const max = Number.isInteger(n) && n >= 1 ? Math.min(n, LIMITE_BLOQUES) : null;
  let enemigo = null;
  if (d.chatarrin) {
    const [a, b] = d.chatarrin.split(/hasta/i), desde = punto(a), hasta = punto(b);
    const adentro = p => p && p[0] < mapa[0].length && p[1] < mapa.length;
    if (adentro(desde) && adentro(hasta)) enemigo = { desde, hasta };
  }
  return { nombre:unaLinea(d.nombre), autor:unaLinea(d.autor), mapa, enemigo, bloques, max, probado:false };
}

/* Lee un archivo: devuelve los niveles que se pudieron leer y cuántos no. "Probado" no viaja: se gana en cada compu.
   trim() también saca la marca invisible (BOM) que a veces agrega el Bloc de notas. */
export function textoANiveles(texto){
  const datos = [];
  let actual = null, enMapa = false;
  String(texto || '').split('\n').forEach(l => {
    const t = l.trim();
    if (t === SEPARADOR) { actual = { mapa:[] }; datos.push(actual); enMapa = false; return; }
    if (!actual) return;
    const i = t.indexOf(':');
    if (enMapa && i < 0) { if (t) actual.mapa.push(t); else enMapa = false; return; }
    enMapa = false; // una línea con ":" (por ejemplo "chatarrin: …") corta el mapa
    if (i < 0) return;
    const nombre = t.slice(0, i).trim().toLowerCase(), valor = t.slice(i + 1).trim();
    if (nombre === 'mapa') enMapa = true;
    else if (CLAVES[nombre]) actual[CLAVES[nombre]] = valor;
  });
  const niveles = datos.map(armar).filter(Boolean);
  return { niveles, malos:datos.length - niveles.length };
}

/* ¿Es el mismo nivel? (para no repetir uno al abrir dos veces el mismo archivo) */
export function mismoNivel(a, b){
  const clave = n => JSON.stringify([n.nombre || '', n.autor || '', n.mapa, n.bloques, n.max || null, n.enemigo || null]);
  return clave(a) === clave(b);
}
