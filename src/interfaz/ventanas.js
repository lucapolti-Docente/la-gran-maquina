/* Menú hamburguesa, configuración y "Ver dibujo". */
import * as Dibujo from '../dibujo/index.js';
import { PERSONAJES } from '../datos/personajes/index.js';
import { VELOCIDADES } from '../config.js';
import { mostrarInicio } from './inicio.js';
import { $ } from './dom.js';
import { E, guardar, niveles, P, personaje } from './estado.js';
import { mostrarFinal } from './final.js';
import { cargarNivel } from './niveles.js';
import { dibujarMaquina } from './tablero.js';

/* ----- menú y ventanas ----- */
export function abrirMenu(){ $('menu').classList.add('abierto'); $('velo').classList.add('abierto'); $('btnMenu').setAttribute('aria-expanded','true'); $('menu').querySelector('button').focus(); }

export function cerrarTodo(){
  $('menu').classList.remove('abierto'); $('velo').classList.remove('abierto'); $('btnMenu').setAttribute('aria-expanded','false');
  document.querySelectorAll('.ventana').forEach(v => v.classList.remove('abierta'));
}

export function abrirVentana(id){ cerrarTodo(); $(id).classList.add('abierta'); $('velo').classList.add('abierto'); $(id).querySelector('button').focus(); }

export function hayVentana(){ return !!document.querySelector('.ventana.abierta, .menu.abierto, .final.abierta'); }

export function dibujarConfig(){
  $('listaPersonajes').innerHTML = PERSONAJES.map(p =>
    '<button class="pj-op" data-pj="'+p.id+'" aria-pressed="'+(p.id === E.personaje)+'">'+Dibujo.personajeSuelto(p)+
    '<span>'+p.nombre+'</span>'+(p.autor ? '<span class="autor">Dibujo de '+p.autor+'</span>' : '')+'</button>').join('');
  $('opMinus').setAttribute('aria-pressed', String(!E.mayus));
  $('opMayus').setAttribute('aria-pressed', String(E.mayus));
  $('opVelocidad').innerHTML = VELOCIDADES.map(v => '<button class="opcion" data-vel="'+v.id+'" aria-pressed="'+(v.id === E.velocidad)+'">'+v.nombre+'</button>').join('');
}

export function enemigosDelNivel(){
  const m = E.mapa, lista = [];
  if (m.enemigo) lista.push('Chatarrín');
  if (m.guardias.length) lista.push('Bulón');
  if (m.chisperos.length) lista.push('Chispero');
  return lista;
}

export function dibujarVerDibujo(){
  const p = personaje();
  let h = Dibujo.personajeSuelto(p)+'<div class="nombre">'+p.nombre+'</div>'+
    (p.autor ? '<div class="autor">Dibujo de '+p.autor+'</div>' : '<div class="autor">Mirá el dibujo y copialo en tu hoja.</div>');
  const enemigos = enemigosDelNivel();
  if (enemigos.length) h += '<div class="opciones">'+enemigos.map(n => '<button class="opcion" data-ver="'+n+'">Ver a '+n+'</button>').join('')+'</div>';
  $('dibujoGrande').innerHTML = h;
}

export function aplicarMayus(){ document.body.classList.toggle('mayus', E.mayus); }

export const ACCIONES_MENU = {
  inicio: () => mostrarInicio(),
  comoJugar: () => abrirVentana('vComoJugar'),
  verDibujo: () => { dibujarVerDibujo(); abrirVentana('vDibujo'); },
  config: () => { dibujarConfig(); abrirVentana('vConfig'); },
  reiniciar: () => { cerrarTodo(); cargarNivel(P().nivel, P().hecho); },
  anterior: () => { cerrarTodo(); if (P().nivel > 0) cargarNivel(P().nivel - 1, true); },
  saltar: () => { cerrarTodo(); if (P().nivel < niveles().length - 1) cargarNivel(P().nivel + 1, false); else { P().hecho = true; guardar(); dibujarMaquina(); mostrarFinal(); } },
  cerrarMenu: cerrarTodo
};
