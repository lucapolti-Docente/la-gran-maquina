/* Ejecuta el programa (todo seguido o de a un paso), resalta cada instrucción y explica qué pasó.
   Ejecutar y Paso usan la misma corrida del motor: se puede pasar de uno al otro y el resultado es el mismo. */
import * as Motor from '../motor/index.js';
import { VELOCIDADES, DIFICULTADES } from '../config.js';
import { nombreBloque, PREGUNTAS, FALLAS, LOGROS, PASO } from '../datos/textos.js';
import { $, ico, mensaje } from './dom.js';
import { E, guardar, nivelActual, niveles, P } from './estado.js';
import { mostrarFinal } from './final.js';
import { siguienteNivel } from './niveles.js';
import { SONIDO_DE } from '../datos/sonidos.js';
import { sonar } from './sonido.js';
import { animarPersonaje, dibujarMaquina, dibujarVivo, reiniciarPersonaje } from './tablero.js';

/* Lo que pasa al ganar o perder fuera de los niveles de siempre (por ejemplo, un nivel inventado). */
export const AL_TERMINAR = { ganar:null };

/* ----- ejecución ----- */
export function corriendo(){ return !!(E.corrida && E.corrida.auto && !E.corrida.terminada); }

export function pararCorrida(){ if (E.corrida && E.corrida.timer) clearTimeout(E.corrida.timer); E.corrida = null; }

export function cancelarCorrida(){ if (E.corrida) { pararCorrida(); reiniciarPersonaje(); quitarResaltado(); actualizarBotones(); } }

export function quitarResaltado(){
  document.querySelectorAll('.ahora,.falla,.si-no,.proximo').forEach(el => el.classList.remove('ahora','falla','si-no','proximo'));
  document.querySelectorAll('.vuelta').forEach(el => el.remove());
}

export function elegirTablero(){
  if (E.tableroPedido) { const t = E.tableroPedido; E.tableroPedido = null; return t; }
  if (!Motor.hayAzar(E.mapa)) return Motor.varianteAlAzar(E.mapa);
  if (nivelActual().depurar && E.intentos === 0) { const f = Motor.probarTodas(E.prog, E.mapa); if (f) return f.variante; }
  return Motor.varianteAlAzar(E.mapa);
}

export function prepararCorrida(auto){
  pararCorrida(); quitarResaltado();
  const c = Motor.crearCorrida(E.prog, E.mapa, elegirTablero());
  E.intentos++;
  E.corrida = { c, est:c.est, auto, timer:null, terminada:false };
  dibujarVivo(c.est, null, true);
}

const programaVacio = () => { if (Motor.contarBloques(E.prog)) return false; sonar('aviso'); mensaje('error', PASO.vacio.titulo, PASO.vacio.texto); return true; };

/* Una animación chiquita del personaje para que se note qué hizo (sin moverse de lugar). */
const ANIMACION_DE = { engranaje:'pulso', encendida:'pulso', apretado:'pulso', escudo:'pulso', apagado:'pulso', espera:'espera' };

export function ejecutar(){
  if (corriendo()) { pausar(); return; }
  if (programaVacio()) return;
  if (P().hecho && E.corrida && E.corrida.terminada && E.corrida.gano && !AL_TERMINAR.ganar) { siguienteNivel(); return; }
  const sigue = E.corrida && !E.corrida.terminada; // venía con Paso: sigue desde donde quedó
  if (!sigue) prepararCorrida(true);
  E.corrida.auto = true;
  actualizarBotones();
  if (sigue) mensaje('', PASO.ejecutando, PASO.sigue);
  else mensaje('', PASO.ejecutando, Motor.hayAzar(E.mapa) ? PASO.azar : PASO.mira);
  E.corrida.timer = setTimeout(avanzar, sigue ? 150 : 350);
}

export function pasoAPaso(){
  if (corriendo()) return;
  if (programaVacio()) return;
  if (!E.corrida || E.corrida.terminada) prepararCorrida(false);
  avanzar();
}

/* Pausa: deja todo donde está. Se sigue con Paso o con Ejecutar, o se vuelve al principio con Reiniciar. */
export function pausar(){
  const c = E.corrida; if (!c) return;
  if (c.timer) clearTimeout(c.timer);
  c.timer = null; c.auto = false;
  mensaje('', PASO.pausa.titulo, PASO.pausa.texto);
  resaltarProximo();
  actualizarBotones();
}

/* Reiniciar: el tablero vuelve al principio y el programa queda como está. */
export function reiniciar(){
  if (!E.corrida) return;
  pararCorrida(); quitarResaltado(); reiniciarPersonaje();
  mensaje('', PASO.reinicio.titulo, PASO.reinicio.texto);
  actualizarBotones();
}

/* Se mantiene el nombre de antes: Escape y "Detener" frenan el programa. */
export const detener = pausar;

export function textoPaso(p){ return 'Instrucción '+p.num + (p.rep ? ' (vuelta '+p.vuelta+' de '+p.rep.n+')' : ''); }

const chipDe = b => document.querySelector('.chip[data-id="'+b.id+'"]');
const cajaDe = id => document.querySelector('.repetir[data-rep="'+id+'"]');

/* Muestra en cada Repetir en qué vuelta va. */
function marcarVueltas(p){
  document.querySelectorAll('.vuelta').forEach(el => el.remove());
  (p.reps || []).forEach(r => {
    const caja = cajaDe(r.id); if (!caja) return;
    const cab = caja.querySelector('.rep-cab');
    const v = document.createElement('span');
    v.className = 'vuelta'; v.textContent = PASO.vuelta(r.vuelta, r.n);
    cab.appendChild(v);
  });
}

export function resaltar(p){
  quitarResaltado();
  const el = chipDe(p.bloque);
  if (el) { el.classList.add('ahora'); el.scrollIntoView({ block:'nearest', inline:'nearest' }); }
  [p.rep, p.si].forEach(c => { if (c) { const r = cajaDe(c.id); if (r) r.classList.add('ahora'); } });
  if (p.pregunta && !p.resultado) { const r = cajaDe(p.bloque.id); if (r) r.classList.add('si-no'); }
  marcarVueltas(p);
}

/* En Paso: el bloque que se va a cumplir con el próximo toque queda marcado. */
export function resaltarProximo(){
  const c = E.corrida; if (!c || c.terminada) return;
  const p = c.c.proximo(); if (!p) return;
  document.querySelectorAll('.proximo').forEach(el => el.classList.remove('proximo'));
  const el = chipDe(p.bloque);
  if (el) { el.classList.add('proximo'); el.scrollIntoView({ block:'nearest', inline:'nearest' }); }
  marcarVueltas(p);
}

export function siguientePaso(c, ms){
  if (c.auto) c.timer = setTimeout(avanzar, ms);
  else if (!c.c.proximo()) terminar(); // con Paso, al cumplir el último bloque se ve enseguida si ganó
  else { resaltarProximo(); $('mensaje').insertAdjacentHTML('beforeend', '<p class="sigue">'+PASO.sigueAhora(textoPaso(c.c.proximo()))+'</p>'); }
  actualizarBotones();
}

export function avanzar(){
  const c = E.corrida; if (!c) return;
  const s = c.c.paso();
  if (s.terminada) { terminar(); return; }
  const p = s.p, titulo = c.auto ? PASO.ejecutando : PASO.titulo;
  resaltar(p);
  if (s.pregunta) {
    sonar('pregunta');
    mensaje('', titulo, textoPaso(p)+': '+PREGUNTAS[p.bloque.cond].largo+' '+(p.resultado ? PASO.si : PASO.no));
    siguientePaso(c, Math.max(450, msVelocidad()));
    return;
  }
  const r = s.r, quien = textoPaso(p);
  if (s.falla) {
    dibujarVivo(c.est, r);
    animarPersonaje('choca');
    sonar(SONIDO_DE[r.tipo] || 'choque');
    const el = chipDe(p.bloque); if (el) el.classList.add('falla');
    const { que, ayuda } = FALLAS[r.tipo];
    mensaje('error', quien+': '+que, ayuda + (Motor.hayAzar(E.mapa) ? ' Ojo: el tablero cambia en cada intento.' : ''));
    c.terminada = true; c.auto = false;
    actualizarBotones();
    return;
  }
  dibujarVivo(c.est, null);
  sonar(SONIDO_DE[r.tipo] || 'mover');
  if (ANIMACION_DE[r.tipo]) animarPersonaje(ANIMACION_DE[r.tipo]);
  let txt = quien+': '+nombreBloque(p.bloque)+'.';
  const extra = LOGROS[r.tipo];
  if (extra) txt += extra;
  if (r.tipo === 'apagado') txt += ' ¡Apagaste a '+r.quien+'!';
  mensaje('', titulo, txt);
  siguientePaso(c, msVelocidad());
}

export function msVelocidad(){ return (VELOCIDADES.find(v => v.id === E.velocidad) || VELOCIDADES[1]).ms; }

export function terminar(){
  const c = E.corrida; c.terminada = true; c.auto = false; if (c.timer) clearTimeout(c.timer); quitarResaltado();
  const ev = Motor.evaluar(c.est, E.mapa);
  if (ev.gano && Motor.hayAzar(E.mapa)) {
    const falla = Motor.probarTodas(E.prog, E.mapa);
    if (falla) {
      sonar('falta');
      mensaje('error', '¡Esta vez llegaste! Pero no alcanza.', 'El tablero cambia en cada intento, y con otro tablero tu programa falla. Usá Si para preguntar antes de actuar.',
        '<button class="btn-siguiente" id="btnProbarFalla">Probar con el tablero donde falla</button>');
      $('btnProbarFalla').addEventListener('click', () => { E.tableroPedido = falla.variante; pararCorrida(); ejecutar(); });
      actualizarBotones();
      return;
    }
  }
  if (ev.gano) sonar('ganar'); else sonar('falta');
  if (ev.gano && AL_TERMINAR.ganar) {
    c.gano = true;
    animarPersonaje('salta');
    AL_TERMINAR.ganar();
  } else if (ev.gano) {
    c.gano = true;
    const yaEstaba = P().hecho;
    P().hecho = true; P().ganados.add(P().nivel); guardar();
    animarPersonaje('salta');
    dibujarMaquina(yaEstaba ? undefined : P().nivel);
    const ultimo = P().nivel === niveles().length - 1;
    const siempre = Motor.hayAzar(E.mapa) ? ' Tu programa funciona con todos los tableros posibles.' : '';
    mensaje('ok', '¡Lo lograste!', (ultimo ? 'Terminaste la última pieza de '+DIFICULTADES[E.dif].avance+'.' : 'Ganaste una pieza nueva para '+DIFICULTADES[E.dif].avance+'.')+siempre,
      '<p class="dato">'+nivelActual().dato+'</p><button class="btn-siguiente" id="btnSiguiente">'+(ultimo ? 'Ver el final' : 'Siguiente nivel')+'</button>');
    $('btnSiguiente').addEventListener('click', siguienteNivel);
    if (ultimo) setTimeout(mostrarFinal, 1400);
  } else {
    const faltas = [];
    if (ev.faltanEngranajes) faltas.push('juntar '+ev.faltanEngranajes+(ev.faltanEngranajes === 1 ? ' engranaje' : ' engranajes'));
    if (ev.faltanLamparas) faltas.push('encender '+ev.faltanLamparas+(ev.faltanLamparas === 1 ? ' lámpara' : ' lámparas'));
    if (!ev.enMeta) faltas.push('llegar a la bandera');
    mensaje('error', 'El programa terminó, pero falta '+faltas.join(' y ')+'.', 'Agregá instrucciones o cambiá alguna y probá de nuevo.');
  }
  actualizarBotones();
}

export function actualizarBotones(){
  const corre = corriendo();
  const b = $('btnEjecutar');
  b.classList.toggle('parar', corre);
  b.innerHTML = corre ? ico('pausa')+'<span>Pausa</span>' : ico('play')+'<span>Ejecutar</span>';
  b.setAttribute('aria-label', corre ? 'Pausa' : 'Ejecutar');
  ['btnPaso','btnBorrar','btnLimpiar'].forEach(id => $(id).disabled = corre);
  $('btnReiniciar').disabled = !E.corrida;
  document.querySelectorAll('.bloque-btn').forEach(x => x.disabled = corre);
}
