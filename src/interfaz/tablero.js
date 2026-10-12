/* Muestra el tablero y mueve al personaje y a los enemigos. */
import * as Motor from '../motor/index.js';
import * as Dibujo from '../dibujo/index.js';
import { $ } from './dom.js';
import { E, personaje, piezasHechas, usaFrente } from './estado.js';

export function dibujarTableroFijo(){
  const t = $('tablero'), m = E.mapa, T = Dibujo.T;
  t.setAttribute('viewBox', '-18 -18 '+(m.ancho*T+36)+' '+(m.alto*T+36));
  t.innerHTML = '<g id="capaFija">'+Dibujo.tableroFijo(m)+'</g><g id="capaViva"></g>'+(m.enemigo ? Dibujo.enemigoEnTablero() : '')+Dibujo.personajeEnTablero(personaje());
}

export function reiniciarPersonaje(){ dibujarVivo(Motor.crearEstado(E.mapa, null), null, true); }

export function moverGrupo(el, x, y, sinAnimar){
  if (sinAnimar) el.style.transition = 'none';
  el.style.transform = 'translate('+x*Dibujo.T+'px,'+y*Dibujo.T+'px)';
  if (sinAnimar) { el.getBoundingClientRect(); el.style.transition = ''; }
}

export function dibujarVivo(est, falla, sinAnimar){
  $('capaViva').innerHTML = Dibujo.tableroVivo(E.mapa, est, falla);
  moverGrupo($('pj'), est.x, est.y, sinAnimar);
  if (est.enemigo) {
    moverGrupo($('enemigo'), est.enemigo.x, est.enemigo.y, sinAnimar);
    $('enemigo').setAttribute('display', est.apagados.has('c') ? 'none' : 'inline');
  }
  $('pjEspejo').setAttribute('transform', est.mira === 'l' && !personaje().imagen ? 'translate(100 0) scale(-1 1)' : '');
  $('pjEscudo').setAttribute('display', est.escudo ? 'inline' : 'none');
  const f = $('pjFrente');
  if (usaFrente()) { f.setAttribute('points', Dibujo.FRENTE[est.dir]); f.setAttribute('display', 'inline'); }
  else f.setAttribute('display', 'none');
}

export function animarPersonaje(clase){
  const g = $('pjMueve');
  g.classList.remove('choca','salta'); g.getBoundingClientRect(); g.classList.add(clase);
}

export function dibujarMaquina(nueva){
  const n = piezasHechas();
  $('maquinaChica').innerHTML = Dibujo.maquina(E.dif, n, { nueva });
  $('maquinaChica').setAttribute('aria-label', 'Avance: '+n+' de '+Dibujo.total+' piezas');
  $('cuentaPiezas').textContent = 'Piezas: '+n+' de '+Dibujo.total;
}
