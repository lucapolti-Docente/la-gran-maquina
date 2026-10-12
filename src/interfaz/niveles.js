/* Cargar un nivel y pasar al siguiente. */
import * as Motor from '../motor/index.js';
import { DIFICULTADES } from '../config.js';
import { $, mensaje } from './dom.js';
import { dibujarPrograma } from './editor.js';
import { pararCorrida } from './ejecucion.js';
import { E, guardar, nivelActual, niveles, P } from './estado.js';
import { mostrarFinal } from './final.js';
import { dibujarPaleta } from './paleta.js';
import { dibujarMaquina, dibujarTableroFijo, reiniciarPersonaje } from './tablero.js';

/* ----- nivel ----- */
export function cargarNivel(i, hecho){
  pararCorrida();
  P().nivel = Math.max(0, Math.min(niveles().length-1, i));
  P().hecho = !!hecho;
  const n = nivelActual();
  E.mapa = Motor.leerMapa(n.mapa, n);
  E.prog = n.programa ? Motor.leerPrograma(n.programa) : [];
  E.cursor = { ruta:[], i:E.prog.length };
  E.intentos = 0; E.tableroPedido = null;
  document.body.classList.toggle('dificil', E.dif === 'dificil');
  $('tituloNivel').innerHTML = '<b>'+DIFICULTADES[E.dif].nombre+' '+(P().nivel+1)+' de '+niveles().length+'</b>'+n.titulo;
  dibujarTableroFijo();
  reiniciarPersonaje();
  dibujarPaleta();
  dibujarPrograma();
  dibujarMaquina();
  mensaje('', 'Nivel '+(P().nivel+1)+': '+n.titulo, n.intro);
  guardar();
}

/* ----- avance entre niveles ----- */
export function siguienteNivel(){
  if (P().nivel >= niveles().length - 1) { P().hecho = true; guardar(); dibujarMaquina(); mostrarFinal(); return; }
  cargarNivel(P().nivel + 1, false);
}
