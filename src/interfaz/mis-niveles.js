/* "Mis niveles": los niveles inventados, guardados en el navegador de esta compu.
   Formato en localStorage (gran-maquina-mis-niveles): { version:1, niveles:[ { id, nombre, autor, mapa, enemigo, bloques, max, probado } ] } */
import * as Motor from '../motor/index.js';
import * as Dibujo from '../dibujo/index.js';
import { EDITOR } from '../datos/textos.js';
import { Guardado } from '../guardado.js';
import { $ } from './dom.js';
import { E } from './estado.js';

export const CLAVE_MIS_NIVELES = 'gran-maquina-mis-niveles';

/* Se queda solo con lo que tiene forma de nivel: si algo se rompió, se descarta y el resto sigue. */
export function leerMisNiveles(){
  const g = Guardado.leerClave(CLAVE_MIS_NIVELES);
  const lista = g && Array.isArray(g.niveles) ? g.niveles : [];
  E.misNiveles = lista.filter(n => n && typeof n.id === 'string' && Array.isArray(n.mapa) && n.mapa.length && Array.isArray(n.bloques));
  return E.misNiveles;
}

export function guardarMisNiveles(){ Guardado.escribirClave(CLAVE_MIS_NIVELES, { version:1, niveles:E.misNiveles }); }

export const nombreDe = n => n.nombre || EDITOR.sinNombre;

export function guardarNivel(nv){
  const i = E.misNiveles.findIndex(n => n.id === nv.id);
  if (i >= 0) E.misNiveles[i] = nv; else E.misNiveles.unshift(nv);
  guardarMisNiveles();
}

export function borrarNivel(id){ E.misNiveles = E.misNiveles.filter(n => n.id !== id); guardarMisNiveles(); }

export const nuevoId = () => 'n' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);

const escapar = s => String(s).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[c]);

export function dibujarMisNiveles(){
  const lista = E.misNiveles;
  if (!lista.length) { $('listaMisNiveles').innerHTML = '<p class="vacio-lista">'+EDITOR.sinNiveles+'</p>'; return; }
  $('listaMisNiveles').innerHTML = lista.map(n => {
    const m = Motor.leerMapa(n.mapa, n), T = Dibujo.T;
    return '<article class="tarjeta-nivel" data-id="'+n.id+'">'+
      '<svg class="mini-tablero" viewBox="0 0 '+(m.ancho*T)+' '+(m.alto*T)+'" aria-hidden="true">'+Dibujo.tableroEditor(m, null)+'</svg>'+
      '<div class="datos-nivel"><b>'+escapar(nombreDe(n))+'</b>'+(n.autor ? '<span>'+escapar(EDITOR.de(n.autor))+'</span>' : '')+
      '<span class="estado-nivel'+(n.probado ? ' probado' : '')+'">'+(n.probado ? '✔ '+EDITOR.probado : EDITOR.sinProbar)+'</span></div>'+
      '<div class="botones-nivel">'+
        '<button class="accion principal" data-jugar="'+n.id+'">'+EDITOR.jugar+'</button>'+
        '<button class="accion" data-editar="'+n.id+'">'+EDITOR.editar+'</button>'+
        '<button class="accion peligro-chico" data-borrar="'+n.id+'" aria-label="'+EDITOR.borrarBtn+' '+escapar(nombreDe(n))+'">'+
          '<svg class="ico" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg></button>'+
      '</div></article>';
  }).join('');
}
