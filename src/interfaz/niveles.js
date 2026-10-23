/* Cargar un nivel y pasar al siguiente. */
import * as Motor from '../motor/index.js';
import { DIFICULTADES } from '../config.js';
import { $, mensaje } from './dom.js';
import { dibujarPrograma } from './editor.js';
import { AL_TERMINAR, pararCorrida } from './ejecucion.js';
import { E, guardar, nivelActual, niveles, P } from './estado.js';
import { mostrarFinal } from './final.js';
import { dibujarPaleta } from './paleta.js';
import { dibujarMaquina, dibujarTableroFijo, reiniciarPersonaje } from './tablero.js';

/* ----- nivel ----- */
export function cargarNivel(i, hecho){
  pararCorrida();
  E.prueba = null; AL_TERMINAR.ganar = null;
  document.body.classList.remove('en-prueba');
  P().nivel = Math.max(0, Math.min(niveles().length-1, i));
  P().hecho = !!hecho;
  const n = nivelActual();
  document.body.classList.toggle('dificil', E.dif === 'dificil');
  mostrarNivel(n, '<b>'+DIFICULTADES[E.dif].nombre+' '+(P().nivel+1)+' de '+niveles().length+'</b>'+n.titulo, 'Nivel '+(P().nivel+1)+': '+n.titulo);
  dibujarMaquina();
  guardar();
}

/* Muestra un nivel listo para jugar (de una lista o inventado). */
export function mostrarNivel(n, titulo, saludo){
  pararCorrida();
  E.mapa = Motor.leerMapa(n.mapa, n);
  E.prog = n.programa ? Motor.leerPrograma(n.programa) : [];
  E.cursor = { ruta:[], i:E.prog.length };
  E.intentos = 0; E.tableroPedido = null;
  $('tituloNivel').innerHTML = titulo;
  dibujarTableroFijo();
  reiniciarPersonaje();
  dibujarPaleta();
  dibujarPrograma();
  mensaje('', saludo, n.intro);
}

/* ----- avance entre niveles ----- */
export function siguienteNivel(){
  if (P().nivel >= niveles().length - 1) { P().hecho = true; guardar(); dibujarMaquina(); mostrarFinal(); return; }
  cargarNivel(P().nivel + 1, false);
}
