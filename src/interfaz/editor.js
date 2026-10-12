/* El editor del programa: agregar, borrar y mover la raya naranja. */
import * as Motor from '../motor/index.js';
import { nombreBloque, PREGUNTAS } from '../datos/textos.js';
import { $, ico, mensaje } from './dom.js';
import { actualizarBotones, cancelarCorrida, corriendo } from './ejecucion.js';
import { E, nivelActual } from './estado.js';
import { permitido } from './paleta.js';

/* ----- programa ----- */
export function buscar(id, lista, ruta){
  lista = lista || E.prog; ruta = ruta || [];
  for (let i = 0; i < lista.length; i++) {
    const b = lista[i];
    if (b.id === id) return { bloque:b, lista, indice:i, ruta };
    if (b.cuerpo) { const r = buscar(id, b.cuerpo, [...ruta, b.id]); if (r) return r; }
  }
  return null;
}

export function listaDelCursor(){ return E.cursor.ruta.length ? buscar(E.cursor.ruta[E.cursor.ruta.length-1]).bloque.cuerpo : E.prog; }

export function dibujarPrograma(){
  const nums = Motor.numerar(E.prog), c = E.cursor, rutaCursor = c.ruta.join('/');
  const cursor = '<span class="cursor" aria-label="Acá se agrega el próximo bloque"></span>';
  const html = (lista, ruta) => {
    const aca = ruta.join('/') === rutaCursor;
    let h = '';
    lista.forEach((b, i) => {
      if (aca && c.i === i) h += cursor;
      if (b.t === 'loop' || b.t === 'si') {
        const esSi = b.t === 'si';
        h += '<span class="repetir'+(esSi ? ' caja-si' : '')+'" data-rep="'+b.id+'"><span class="rep-cab">'+
          '<button class="chip '+(esSi ? 'c-si' : 'c-loop')+'" data-entrar="'+b.id+'" data-id="'+b.id+'" aria-label="Instrucción '+nums[b.id]+': '+(esSi ? 'si' : 'repetir')+'. Tocá para agregar adentro">'+
          '<span class="num">'+nums[b.id]+'</span>'+(esSi ? '<span class="txt-si">Si</span>' : ico(b.t))+'</button>'+
          (esSi ? '<button class="rep-n cond" data-cond="'+b.id+'" aria-label="'+PREGUNTAS[b.cond].largo+' Tocá para cambiar la pregunta">'+ico(b.cond)+'<span>'+PREGUNTAS[b.cond].corto+'</span></button>'
                : '<button class="rep-n" data-veces="'+b.id+'" aria-label="Cambiar cuántas veces">×'+b.n+'</button>')+'</span>'+
          html(b.cuerpo, [...ruta, b.id])+
          '<button class="rep-fin" data-salir="'+b.id+'" aria-label="Fin: tocá para seguir afuera">fin</button></span>';
      } else {
        const cls = { act:'c-act', btn:'c-btn', esperar:'c-esp', garrote:'c-gar' }[b.t] || 'c-mov';
        h += '<button class="chip '+cls+'" data-id="'+b.id+'" aria-label="Instrucción '+nums[b.id]+': '+nombreBloque(b)+'"><span class="num">'+nums[b.id]+'</span>'+ico(b.t === 'mov' ? b.d : b.t)+'</button>';
      }
    });
    if (aca && c.i === lista.length) h += cursor;
    return h;
  };
  let h = html(E.prog, []);
  if (!E.prog.length) h += '<span class="vacio">Tocá los bloques de arriba para armar tu programa.</span>';
  const cont = $('programa');
  cont.innerHTML = h;
  const max = nivelActual().max, usados = Motor.contarBloques(E.prog);
  $('limite').textContent = max ? 'Bloques usados: '+usados+' de '+max : 'Bloques usados: '+usados;
  $('limite').classList.toggle('lleno', !!max && usados >= max);
  actualizarBotones();
  const cur = cont.querySelector('.cursor');
  if (cur) cur.scrollIntoView({ block:'nearest', inline:'nearest' });
}

export function editar(){ if (corriendo()) return false; cancelarCorrida(); return true; }

export function agregar(tipo, d){
  if (corriendo() || !permitido(tipo, d)) return;
  cancelarCorrida();
  const n = nivelActual(), max = n.max;
  if (max && Motor.contarBloques(E.prog) >= max) {
    mensaje('error', 'Ya usaste los '+max+' bloques', n.bloques.includes('loop') ? 'Probá con Repetir: un Repetir con bloques adentro hace muchos pasos.' : 'Borrá alguno para agregar otro.');
    return;
  }
  const ruta = E.cursor.ruta, tipos = ruta.map(id => buscar(id).bloque.t);
  if (tipo === 'loop' && ruta.length) { mensaje('error', 'Repetir va afuera', 'Tocá "fin" para salir del bloque en el que estás y agregá Repetir afuera.'); return; }
  if (tipo === 'si' && tipos.includes('si')) { mensaje('error', 'Un Si no va adentro de otro Si', 'Tocá "fin" para salir del Si y agregalo afuera.'); return; }
  const b = Motor.nuevoBloque(tipo, tipo === 'si' ? (n.preguntas || ['enemigo'])[0] : d);
  listaDelCursor().splice(E.cursor.i, 0, b);
  if (b.cuerpo) E.cursor = { ruta:[...ruta, b.id], i:0 };
  else E.cursor.i++;
  dibujarPrograma();
}

export function borrar(){
  if (!editar()) return;
  const c = E.cursor, lista = listaDelCursor();
  if (c.i > 0) {
    const ant = lista[c.i-1];
    if (ant.cuerpo && ant.cuerpo.length) E.cursor = { ruta:[...c.ruta, ant.id], i:ant.cuerpo.length }; // entra al bloque y borra de a uno
    else { lista.splice(c.i-1, 1); c.i--; }
  } else if (c.ruta.length) {
    const cont = buscar(c.ruta[c.ruta.length-1]);
    if (!cont.bloque.cuerpo.length) { cont.lista.splice(cont.indice, 1); E.cursor = { ruta:cont.ruta, i:cont.indice }; }
    else { mensaje('', '', 'Para borrar algo, tocá el bloque que está justo antes. La raya naranja va a quedar después de él.'); return; }
  }
  dibujarPrograma();
}

export function limpiar(){ if (!editar()) return; E.prog = []; E.cursor = { ruta:[], i:0 }; dibujarPrograma(); }

export function cambiarVeces(id, n){
  if (!editar()) return;
  const b = buscar(id); if (!b || b.bloque.t !== 'loop') return;
  b.bloque.n = n || (b.bloque.n >= 9 ? 2 : b.bloque.n + 1);
  dibujarPrograma();
}

export function cambiarPregunta(id){
  if (!editar()) return;
  const b = buscar(id).bloque, opciones = nivelActual().preguntas || ['enemigo'];
  b.cond = opciones[(opciones.indexOf(b.cond) + 1) % opciones.length];
  dibujarPrograma();
}
