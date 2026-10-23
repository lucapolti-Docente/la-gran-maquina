/* Botones, teclado y deslizar el dedo sobre el tablero. */
import * as Dibujo from '../dibujo/index.js';
import { DIFICULTADES } from '../config.js';
import { $ } from './dom.js';
import { agregar, borrar, buscar, cambiarPregunta, cambiarVeces, dibujarPrograma, limpiar } from './editor.js';
import { cancelarCorrida, corriendo, detener, ejecutar, pasoAPaso } from './ejecucion.js';
import { E, guardar, P } from './estado.js';
import { cargarNivel } from './niveles.js';
import { dibujarTableroFijo, reiniciarPersonaje } from './tablero.js';
import { abrirMenu, ACCIONES_MENU, aplicarMayus, cerrarTodo, dibujarConfig, hayVentana } from './ventanas.js';

/* ----- eventos ----- */
export function conectar(){
  $('btnMenu').addEventListener('click', abrirMenu);
  $('velo').addEventListener('click', cerrarTodo);
  $('menu').addEventListener('click', e => { const b = e.target.closest('button[data-accion]'); if (b) ACCIONES_MENU[b.dataset.accion](); });
  document.querySelectorAll('[data-cerrar]').forEach(b => b.addEventListener('click', cerrarTodo));

  $('paleta').addEventListener('click', e => { const b = e.target.closest('.bloque-btn'); if (b) agregar(b.dataset.tipo, b.dataset.d || undefined); });
  $('programa').addEventListener('click', e => {
    if (corriendo()) return;
    const veces = e.target.closest('[data-veces]'); if (veces) { cambiarVeces(veces.dataset.veces); return; }
    const cond = e.target.closest('[data-cond]'); if (cond) { cambiarPregunta(cond.dataset.cond); return; }
    cancelarCorrida();
    const entrar = e.target.closest('[data-entrar]');
    if (entrar) { const b = buscar(entrar.dataset.entrar); E.cursor = { ruta:[...b.ruta, b.bloque.id], i:0 }; dibujarPrograma(); return; }
    const salir = e.target.closest('[data-salir]');
    if (salir) { const b = buscar(salir.dataset.salir); E.cursor = { ruta:b.ruta, i:b.indice + 1 }; dibujarPrograma(); return; }
    const chip = e.target.closest('.chip[data-id]');
    if (chip) { const b = buscar(chip.dataset.id); E.cursor = { ruta:b.ruta, i:b.indice + 1 }; dibujarPrograma(); return; }
    E.cursor = { ruta:[], i:E.prog.length }; dibujarPrograma();
  });
  $('btnEjecutar').addEventListener('click', ejecutar);
  $('btnPaso').addEventListener('click', pasoAPaso);
  $('btnBorrar').addEventListener('click', borrar);
  $('btnLimpiar').addEventListener('click', limpiar);

  $('listaPersonajes').addEventListener('click', e => {
    const b = e.target.closest('[data-pj]'); if (!b) return;
    E.personaje = b.dataset.pj; guardar(); dibujarConfig(); cancelarCorrida(); dibujarTableroFijo(); reiniciarPersonaje();
  });
  $('opMinus').addEventListener('click', () => { E.mayus = false; aplicarMayus(); guardar(); dibujarConfig(); });
  $('opMayus').addEventListener('click', () => { E.mayus = true; aplicarMayus(); guardar(); dibujarConfig(); });
  $('opVelocidad').addEventListener('click', e => { const b = e.target.closest('[data-vel]'); if (b) { E.velocidad = b.dataset.vel; guardar(); dibujarConfig(); } });
  $('dibujoGrande').addEventListener('click', e => {
    const b = e.target.closest('[data-ver]'); if (!b) return;
    const en = Dibujo.ENEMIGOS[b.dataset.ver];
    $('dibujoGrande').innerHTML = Dibujo.suelto(en.svg)+'<div class="nombre">'+b.dataset.ver+'</div><div class="autor">'+en.texto+' Copialo en tu hoja.</div>';
  });
  $('btnBorrarProgreso').addEventListener('click', () => {
    if (confirm('¿Empezar el nivel '+DIFICULTADES[E.dif].nombre+' de cero? Se pierde el avance de '+DIFICULTADES[E.dif].avance+'.')) { cerrarTodo(); P().ganados.clear(); cargarNivel(0, false); }
  });
  $('btnOtraVez').addEventListener('click', () => { $('final').classList.remove('abierta'); P().ganados.clear(); cargarNivel(0, false); });
  $('btnCerrarFinal').addEventListener('click', () => { $('final').classList.remove('abierta'); });
  $('btnInicioFinal').addEventListener('click', () => { $('final').classList.remove('abierta'); ACCIONES_MENU.inicio(); });

  // Deslizar sobre el tablero (celular)
  let ini = null;
  const tab = $('tablero');
  tab.addEventListener('pointerdown', e => { ini = { x:e.clientX, y:e.clientY }; });
  tab.addEventListener('pointerup', e => {
    if (!ini) return;
    const dx = e.clientX - ini.x, dy = e.clientY - ini.y; ini = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) return;
    agregar('mov', Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'r' : 'l') : (dy > 0 ? 'd' : 'u'));
  });
  tab.addEventListener('pointercancel', () => { ini = null; });

  // Teclado
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (hayVentana()) { cerrarTodo(); $('final').classList.remove('abierta'); } else if (corriendo()) detener(); return; }
    if (hayVentana() || document.body.classList.contains('en-inicio') || e.ctrlKey || e.metaKey || e.altKey) return;
    const flechas = { ArrowUp:'u', ArrowDown:'d', ArrowLeft:'l', ArrowRight:'r' };
    const k = e.key.toLowerCase();
    const letras = { e:'act', a:'btn', r:'loop', s:'si', w:'esperar', g:'garrote' };
    if (flechas[e.key]) { e.preventDefault(); agregar('mov', flechas[e.key]); }
    else if (e.key === ' ') { e.preventDefault(); agregar('act'); }
    else if (letras[k]) agregar(letras[k]);
    else if (k === 'p') pasoAPaso();
    else if (e.key === 'Backspace' || e.key === 'Delete') { e.preventDefault(); borrar(); }
    else if (e.key === 'Enter') { if (document.activeElement && document.activeElement.tagName === 'BUTTON' && document.activeElement.id !== 'btnEjecutar') return; e.preventDefault(); ejecutar(); }
    else if (/^[2-9]$/.test(e.key)) {
      const enRuta = E.cursor.ruta.find(id => buscar(id).bloque.t === 'loop');
      const rep = enRuta || [...E.prog].reverse().find(b => b.t === 'loop')?.id;
      if (rep) cambiarVeces(rep, parseInt(e.key, 10));
    }
  });
}
