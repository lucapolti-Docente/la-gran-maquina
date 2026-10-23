/* Inventá tu nivel: pintar el tablero tocando o arrastrando, elegir bloques, probarlo y volver a editarlo.
   La lógica (pintar, tamaño, pasar al formato del juego) está en motor/editor.js; acá solo está la pantalla. */
import * as Motor from '../motor/index.js';
import * as Dibujo from '../dibujo/index.js';
import { EDITOR, VALIDACION } from '../datos/textos.js';
import { $, ico, mensaje } from './dom.js';
import { AL_TERMINAR, cancelarCorrida } from './ejecucion.js';
import { E, guardar, personaje } from './estado.js';
import { APP } from './inicio.js';
import { borrarNivel, dibujarMisNiveles, guardarNivel, leerMisNiveles, nombreDe, nuevoId } from './mis-niveles.js';
import { mostrarNivel } from './niveles.js';
import { mostrarPantalla } from './pantallas.js';
import { ACCIONES_MENU, cerrarTodo } from './ventanas.js';

const T = Dibujo.T, MARGEN = 6;
const HERRAMIENTAS_PALETA = ['.','#','S','M','G','L','B','P','T','H','E','chispero','chatarrin'];
const CLASE_BLOQUE = { mov:'c-mov', act:'c-act', btn:'c-btn', esperar:'c-esp', garrote:'c-gar', loop:'c-loop', si:'c-si' };
const ICONO_BLOQUE = { mov:'r', act:'act', btn:'btn', esperar:'esperar', garrote:'garrote', loop:'loop', si:'si' };
const FLECHA_DIR = { '<':'l', '>':'r', '^':'u', 'v':'d' };

const escapar = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);
const ed = () => E.edicion;
const problemas = nv => Motor.validarNivel(Motor.aNivelDeJuego(nv));

/* ----- pantallas ----- */
export function abrirMisNiveles(){
  cancelarCorrida(); cerrarTodo();
  E.prueba = null; AL_TERMINAR.ganar = null;
  E.modo = 'inventar'; guardar();
  leerMisNiveles();
  if (!E.misNiveles.length) { nuevoNivel(); return; } // la primera vez se va directo a inventar
  mostrarPantalla('en-mis-niveles');
  document.body.classList.remove('dificil');
  $('tituloNivel').innerHTML = '<b>'+EDITOR.titulo+'</b>';
  dibujarMisNiveles();
}

export function nuevoNivel(){
  const nv = { ...Motor.nivelNuevo(), id:nuevoId() };
  guardarNivel(nv);
  abrirEditor(nv);
}

export function abrirEditor(nv){
  cancelarCorrida(); cerrarTodo();
  E.prueba = null; AL_TERMINAR.ganar = null;
  E.edicion = { nv:{ ...nv }, herramienta:'#', dir:'>', chatarrinDesde:null, pestana:(ed() && ed().pestana) || 'pintar', aviso:null };
  mostrarPantalla('en-editor');
  document.body.classList.remove('dificil');
  $('tituloNivel').innerHTML = '<b>'+EDITOR.titulo+'</b>'+escapar(nombreDe(nv));
  $('inNombre').value = nv.nombre || '';
  $('inAutor').value = nv.autor || '';
  dibujarEditor();
}

/* ----- dibujo del editor ----- */
export function dibujarEditor(){
  dibujarHerramientas(); dibujarBloques(); dibujarTamano(); elegirPestana(ed().pestana); dibujarTableroEditor(); dibujarAvisos();
}

function dibujarTableroEditor(){
  const nv = ed().nv, m = Motor.leerMapa(nv.mapa, nv), w = m.ancho*T, h = m.alto*T;
  const svg = $('tableroEditor');
  svg.setAttribute('viewBox', (-MARGEN)+' '+(-MARGEN)+' '+(w+2*MARGEN)+' '+(h+2*MARGEN));
  let s = Dibujo.tableroEditor(m, personaje());
  problemas(nv).forEach(p => p.celdas.forEach(c => {
    if (c.x < 0 || c.y < 0 || c.x >= m.ancho || c.y >= m.alto) return;
    s += '<rect class="celda-problema" x="'+(c.x*T+5)+'" y="'+(c.y*T+5)+'" width="90" height="90" rx="10"/>';
  }));
  const d = ed().chatarrinDesde;
  if (d) s += '<circle class="marca-chatarrin" cx="'+(d[0]*T+50)+'" cy="'+(d[1]*T+50)+'" r="40"/>';
  svg.innerHTML = s;
}

function dibujarHerramientas(){
  const e = ed();
  $('herramientas').innerHTML = HERRAMIENTAS_PALETA.map(hh => {
    const letra = hh === 'chispero' ? e.dir : hh, nombre = EDITOR.herramientas[hh];
    return '<button class="herramienta" data-herr="'+hh+'" aria-pressed="'+(e.herramienta === hh)+'" aria-label="'+nombre+'">'+
      '<svg viewBox="0 0 100 100" aria-hidden="true">'+Dibujo.muestra(letra)+'</svg><span>'+nombre+'</span></button>';
  }).join('');
  const conDir = e.herramienta === 'chispero';
  $('direcciones').hidden = !conDir;
  $('direcciones').innerHTML = conDir ? Object.keys(FLECHA_DIR).map(d =>
    '<button class="opcion dir-btn" data-dir="'+d+'" aria-pressed="'+(e.dir === d)+'" aria-label="'+EDITOR.direcciones[d]+'">'+ico(FLECHA_DIR[d])+'</button>').join('') : '';
}

function dibujarBloques(){
  const nv = ed().nv;
  $('interruptores').innerHTML = Motor.BLOQUES_EDITOR.map(b =>
    '<button class="interruptor '+CLASE_BLOQUE[b]+'" data-bloque="'+b+'" aria-pressed="'+nv.bloques.includes(b)+'">'+ico(ICONO_BLOQUE[b])+
    '<span>'+EDITOR.bloques[b]+'</span><span class="tilde" aria-hidden="true">'+(nv.bloques.includes(b) ? '✔' : '')+'</span></button>').join('');
  $('valMax').textContent = nv.max ? EDITOR.limite(nv.max) : EDITOR.sinLimite;
}

function dibujarTamano(){
  const nv = ed().nv;
  $('valAncho').textContent = nv.mapa[0].length;
  $('valAlto').textContent = nv.mapa.length;
  document.querySelectorAll('[data-tam]').forEach(b => {
    const l = Motor.LIMITES[b.dataset.tam], actual = b.dataset.tam === 'ancho' ? nv.mapa[0].length : nv.mapa.length;
    b.disabled = b.dataset.paso === '1' ? actual >= l.max : actual <= l.min;
  });
}

function dibujarAvisos(){
  const e = ed(), lista = problemas(e.nv), box = $('edMensajes');
  let h = '';
  if (e.aviso) h += '<p class="aviso-ed">'+e.aviso+'</p>';
  if (lista.length) {
    h += '<p class="titulo">'+EDITOR.antes+'</p><ul class="problemas">'+
      lista.slice(0, 3).map(p => '<li>'+VALIDACION[p.codigo](p)+'</li>').join('')+'</ul>';
  } else h += '<p class="titulo ok">'+EDITOR.listo+'</p>';
  box.innerHTML = h;
  box.classList.toggle('con-problemas', lista.length > 0);
}

function elegirPestana(p){
  ed().pestana = p;
  document.querySelectorAll('.pestana-btn').forEach(b => b.setAttribute('aria-selected', String(b.dataset.pestana === p)));
  $('pestanaPintar').hidden = p !== 'pintar';
  $('pestanaBloques').hidden = p !== 'bloques';
  $('pestanaNombre').hidden = p !== 'nombre';
}

/* Cada cambio se guarda enseguida: no hay que acordarse de guardar. */
function cambiar(nv, sinRedibujar){
  ed().nv = nv;
  guardarNivel(nv);
  if (!sinRedibujar) { dibujarTableroEditor(); dibujarAvisos(); }
}

/* ----- pintar ----- */
function celdaDe(ev){
  const svg = $('tableroEditor'), pt = svg.createSVGPoint();
  pt.x = ev.clientX; pt.y = ev.clientY;
  const p = pt.matrixTransform(svg.getScreenCTM().inverse());
  const x = Math.floor(p.x / T), y = Math.floor(p.y / T), nv = ed().nv;
  return (x >= 0 && y >= 0 && x < nv.mapa[0].length && y < nv.mapa.length) ? [x, y] : null;
}

function pintarEn(c){
  const e = ed(), [x, y] = c;
  e.aviso = null;
  if (e.herramienta === 'chatarrin') {
    if (!e.chatarrinDesde) { e.chatarrinDesde = c; e.aviso = EDITOR.chatarrinHasta; dibujarTableroEditor(); dibujarAvisos(); return; }
    const d = e.chatarrinDesde;
    if (d[0] !== x && d[1] !== y) { e.aviso = VALIDACION.chatarrinNoRecto(); dibujarAvisos(); return; }
    e.chatarrinDesde = null; e.aviso = EDITOR.chatarrinListo;
    cambiar(Motor.ponerChatarrin(e.nv, d, c));
    return;
  }
  if (e.herramienta === '.' && Motor.esPuntaDeChatarrin(e.nv, x, y)) { cambiar(Motor.sacarChatarrin(e.nv)); return; }
  const letra = e.herramienta === 'chispero' ? e.dir : e.herramienta;
  const nuevo = Motor.pintar(e.nv, x, y, letra);
  if (nuevo !== e.nv) cambiar(nuevo); else dibujarAvisos();
}

/* ----- probar ----- */
export function probar(nv){
  if (problemas(nv).length) { abrirEditor(nv); sacudir($('edMensajes')); return; }
  cancelarCorrida(); cerrarTodo();
  const nombre = nombreDe(nv);
  E.edicion = { ...(ed() || {}), nv };
  E.prueba = { id:nv.id, nivel:Motor.aNivelDeJuego(nv, { titulo:nombre, intro:EDITOR.introPrueba(escapar(nombre), escapar(nv.autor || '')), dato:EDITOR.datoPrueba }) };
  AL_TERMINAR.ganar = ganoPrueba;
  E.modo = 'inventar'; guardar();
  mostrarPantalla('en-prueba');
  document.body.classList.remove('dificil');
  mostrarNivel(E.prueba.nivel, '<b>'+EDITOR.probando+'</b>'+escapar(nombre), escapar(nombre));
  dibujarInfoPrueba(nv);
}

function dibujarInfoPrueba(nv){
  $('infoPrueba').innerHTML = '<b>'+escapar(nombreDe(nv))+'</b>'+(nv.autor ? '<span>'+escapar(EDITOR.de(nv.autor))+'</span>' : '')+
    '<span class="estado-nivel'+(nv.probado ? ' probado' : '')+'">'+(nv.probado ? '✔ '+EDITOR.probado : EDITOR.sinProbar)+'</span>';
}

function ganoPrueba(){
  const nv = E.misNiveles.find(n => n.id === E.prueba.id);
  if (nv) { nv.probado = true; guardarNivel(nv); dibujarInfoPrueba(nv); }
  mensaje('ok', EDITOR.ganado.titulo, EDITOR.ganado.texto,
    '<p class="dato">'+E.prueba.nivel.dato+'</p><div class="fila-botones"><button class="btn-siguiente" id="btnEditarGanado">'+EDITOR.volverEditar+'</button>'+
    '<button class="btn-siguiente secundario" id="btnListaGanado">'+EDITOR.misNiveles+'</button></div>');
  $('btnEditarGanado').addEventListener('click', volverAEditar);
  $('btnListaGanado').addEventListener('click', abrirMisNiveles);
}

export function volverAEditar(){
  if (!E.prueba) return;
  const nv = E.misNiveles.find(n => n.id === E.prueba.id) || ed().nv;
  abrirEditor(nv);
}

function sacudir(el){ el.classList.remove('sacude'); el.getBoundingClientRect(); el.classList.add('sacude'); }

/* ----- eventos ----- */
export function conectarEditor(){
  APP.abrirEditor = abrirMisNiveles;
  ACCIONES_MENU.editar = () => { cerrarTodo(); volverAEditar(); };
  const reiniciarNivel = ACCIONES_MENU.reiniciar;
  ACCIONES_MENU.reiniciar = () => { if (E.prueba) { const nv = E.misNiveles.find(n => n.id === E.prueba.id); if (nv) { probar(nv); return; } } reiniciarNivel(); };

  $('btnEditar').addEventListener('click', volverAEditar);
  $('btnNuevoNivel').addEventListener('click', nuevoNivel);
  $('btnVolverLista').addEventListener('click', abrirMisNiveles);
  $('btnProbar').addEventListener('click', () => probar(ed().nv));

  $('listaMisNiveles').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const id = b.dataset.jugar || b.dataset.editar || b.dataset.borrar, nv = E.misNiveles.find(n => n.id === id); if (!nv) return;
    if (b.dataset.jugar) probar(nv);
    else if (b.dataset.editar) abrirEditor(nv);
    else if (confirm(EDITOR.borrar(nombreDe(nv)))) { borrarNivel(id); if (E.misNiveles.length) dibujarMisNiveles(); else abrirMisNiveles(); }
  });

  document.querySelector('.pestanas').addEventListener('click', e => { const b = e.target.closest('[data-pestana]'); if (b) elegirPestana(b.dataset.pestana); });
  $('herramientas').addEventListener('click', e => {
    const b = e.target.closest('[data-herr]'); if (!b) return;
    ed().herramienta = b.dataset.herr; ed().chatarrinDesde = null;
    ed().aviso = b.dataset.herr === 'chatarrin' ? EDITOR.chatarrinDesde : null;
    dibujarHerramientas(); dibujarTableroEditor(); dibujarAvisos();
  });
  $('direcciones').addEventListener('click', e => { const b = e.target.closest('[data-dir]'); if (b) { ed().dir = b.dataset.dir; dibujarHerramientas(); } });
  document.querySelector('.tamanos').addEventListener('click', e => {
    const b = e.target.closest('[data-tam]'); if (!b) return;
    const nv = ed().nv, paso = Number(b.dataset.paso);
    const ancho = nv.mapa[0].length + (b.dataset.tam === 'ancho' ? paso : 0), alto = nv.mapa.length + (b.dataset.tam === 'alto' ? paso : 0);
    cambiar(Motor.cambiarTamano(nv, ancho, alto)); dibujarTamano();
  });
  $('interruptores').addEventListener('click', e => {
    const b = e.target.closest('[data-bloque]'); if (!b) return;
    cambiar(Motor.cambiarBloques(ed().nv, b.dataset.bloque, !ed().nv.bloques.includes(b.dataset.bloque))); dibujarBloques();
  });
  $('maxMenos').addEventListener('click', () => { const m = ed().nv.max; cambiar(Motor.cambiarMax(ed().nv, m && m > 1 ? m - 1 : 0)); dibujarBloques(); });
  $('maxMas').addEventListener('click', () => { cambiar(Motor.cambiarMax(ed().nv, (ed().nv.max || 0) + 1)); dibujarBloques(); });
  $('inNombre').addEventListener('input', e => {
    cambiar({ ...ed().nv, nombre:e.target.value.trim() ? e.target.value : '' }, true);
    $('tituloNivel').innerHTML = '<b>'+EDITOR.titulo+'</b>'+escapar(nombreDe(ed().nv));
  });
  $('inAutor').addEventListener('input', e => { cambiar({ ...ed().nv, autor:e.target.value.trim() ? e.target.value : '' }, true); });

  // Pintar tocando o arrastrando (mouse, dedo o lápiz).
  const svg = $('tableroEditor');
  let pintando = false, ultima = null;
  svg.addEventListener('pointerdown', ev => {
    const c = celdaDe(ev); if (!c) return;
    ev.preventDefault();
    pintando = ed().herramienta !== 'chatarrin'; ultima = c.join(',');
    if (pintando) svg.setPointerCapture(ev.pointerId);
    pintarEn(c);
  });
  svg.addEventListener('pointermove', ev => {
    if (!pintando) return;
    const c = celdaDe(ev); if (!c || c.join(',') === ultima) return;
    ultima = c.join(','); pintarEn(c);
  });
  const soltar = () => { pintando = false; ultima = null; };
  svg.addEventListener('pointerup', soltar);
  svg.addEventListener('pointercancel', soltar);
}
