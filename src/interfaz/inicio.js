/* Pantalla de inicio: una tarjeta por cada modo de src/modos/. No conoce ningún modo en particular. */
import { MODOS } from '../modos/index.js';
import { $ } from './dom.js';
import { AL_TERMINAR, cancelarCorrida } from './ejecucion.js';
import { E, guardar, P } from './estado.js';
import { cargarNivel } from './niveles.js';
import { mostrarPantalla } from './pantallas.js';
import { cerrarTodo } from './ventanas.js';

/* Lo que un modo puede pedir al arrancar. Otros módulos de la interfaz suman cosas acá (por ejemplo, el editor). */
export const APP = {
  jugarNiveles(id){ salirDelInicio(id); E.dif = id; cargarNivel(P().nivel, P().hecho); }
};

export function textoAvance(a){
  if (!a) return '';
  if (a.texto) return a.texto;
  return a.hechos + ' de ' + a.total;
}

export function dibujarInicio(){
  $('tarjetasModos').innerHTML = MODOS.map(m => {
    const a = m.avance(E);
    const barra = a && a.total ? '<span class="barra-avance" aria-hidden="true"><span style="width:'+Math.round(100*a.hechos/a.total)+'%"></span></span>' : '';
    return '<button class="tarjeta-modo modo-'+m.id+'" data-modo="'+m.id+'">'+
      '<svg class="icono-modo" viewBox="0 0 380 240" aria-hidden="true">'+m.icono(E)+'</svg>'+
      '<span class="texto-modo"><span class="nombre-modo">'+m.nombre+'</span>'+
      '<span class="avance-modo">'+textoAvance(a)+'</span>'+barra+
      '<span class="desc-modo">'+m.descripcion+'</span></span></button>';
  }).join('');
}

export function mostrarInicio(){
  cancelarCorrida(); cerrarTodo();
  E.prueba = null; AL_TERMINAR.ganar = null;
  mostrarPantalla('en-inicio');
  document.body.classList.remove('dificil');
  $('tituloNivel').innerHTML = '';
  dibujarInicio();
  const primera = $('tarjetasModos').querySelector('button'); if (primera) primera.focus();
}

export function salirDelInicio(modo){
  mostrarPantalla(null);
  E.modo = modo; guardar();
}

export function conectarInicio(){
  $('tarjetasModos').addEventListener('click', e => {
    const b = e.target.closest('[data-modo]'); if (!b) return;
    const m = MODOS.find(x => x.id === b.dataset.modo);
    if (m) m.arrancar(APP);
  });
}
