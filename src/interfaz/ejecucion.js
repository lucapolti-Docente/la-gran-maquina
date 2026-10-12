/* Ejecuta el programa paso a paso, resalta cada instrucción y explica qué pasó. */
import * as Motor from '../motor/index.js';
import { VELOCIDADES, DIFICULTADES } from '../config.js';
import { nombreBloque, PREGUNTAS, FALLAS, LOGROS } from '../datos/textos.js';
import { $, ico, mensaje } from './dom.js';
import { E, guardar, nivelActual, niveles, P } from './estado.js';
import { mostrarFinal } from './final.js';
import { siguienteNivel } from './niveles.js';
import { animarPersonaje, dibujarMaquina, dibujarVivo, reiniciarPersonaje } from './tablero.js';

/* ----- ejecución ----- */
export function corriendo(){ return !!(E.corrida && E.corrida.auto && !E.corrida.terminada); }

export function pararCorrida(){ if (E.corrida && E.corrida.timer) clearTimeout(E.corrida.timer); E.corrida = null; }

export function cancelarCorrida(){ if (E.corrida) { pararCorrida(); reiniciarPersonaje(); quitarResaltado(); } }

export function quitarResaltado(){ document.querySelectorAll('.ahora,.falla,.si-no').forEach(el => el.classList.remove('ahora','falla','si-no')); }

export function elegirTablero(){
  if (E.tableroPedido) { const t = E.tableroPedido; E.tableroPedido = null; return t; }
  if (!Motor.hayAzar(E.mapa)) return Motor.varianteAlAzar(E.mapa);
  if (nivelActual().depurar && E.intentos === 0) { const f = Motor.probarTodas(E.prog, E.mapa); if (f) return f.variante; }
  return Motor.varianteAlAzar(E.mapa);
}

export function prepararCorrida(auto){
  pararCorrida(); quitarResaltado();
  const est = Motor.crearEstado(E.mapa, elegirTablero());
  E.intentos++;
  E.corrida = { est, gen:Motor.pasos(E.prog, est, E.mapa), auto, timer:null, terminada:false };
  dibujarVivo(est, null, true);
}

export function ejecutar(){
  if (corriendo()) { detener(); return; }
  if (!Motor.contarBloques(E.prog)) { mensaje('error', 'El programa está vacío', 'Agregá bloques antes de ejecutar.'); return; }
  if (P().hecho && E.corrida && E.corrida.terminada && E.corrida.gano) { siguienteNivel(); return; }
  prepararCorrida(true);
  actualizarBotones();
  mensaje('', 'Ejecutando…', Motor.hayAzar(E.mapa) ? 'El tablero cambió: mirá qué salió en cada signo de pregunta.' : 'Mirá qué instrucción se cumple en cada momento.');
  E.corrida.timer = setTimeout(avanzar, 350);
}

export function pasoAPaso(){
  if (corriendo()) return;
  if (!Motor.contarBloques(E.prog)) { mensaje('error', 'El programa está vacío', 'Agregá bloques antes de probar.'); return; }
  if (!E.corrida || E.corrida.terminada) prepararCorrida(false);
  avanzar();
}

export function detener(){
  if (!E.corrida) return;
  pararCorrida(); quitarResaltado(); reiniciarPersonaje();
  mensaje('', 'Programa detenido', 'Podés cambiar bloques y volver a ejecutar.');
  actualizarBotones();
}

export function textoPaso(p){ return 'Instrucción '+p.num + (p.rep ? ' (vuelta '+p.vuelta+' de '+p.rep.n+')' : ''); }

export function resaltar(p){
  quitarResaltado();
  const el = document.querySelector('.chip[data-id="'+p.bloque.id+'"]');
  if (el) { el.classList.add('ahora'); el.scrollIntoView({ block:'nearest', inline:'nearest' }); }
  [p.rep, p.si].forEach(c => { if (c) { const r = document.querySelector('.repetir[data-rep="'+c.id+'"]'); if (r) r.classList.add('ahora'); } });
  if (p.pregunta && !p.resultado) { const r = document.querySelector('.repetir[data-rep="'+p.bloque.id+'"]'); if (r) r.classList.add('si-no'); }
}

export function siguientePaso(c, ms){ if (c.auto) c.timer = setTimeout(avanzar, ms); actualizarBotones(); }

export function avanzar(){
  const c = E.corrida; if (!c) return;
  const sig = c.gen.next();
  if (sig.done) { terminar(); return; }
  const p = sig.value;
  resaltar(p);
  if (p.pregunta) {
    mensaje('', c.auto ? 'Ejecutando…' : 'Paso a paso', textoPaso(p)+': '+PREGUNTAS[p.bloque.cond].largo+' '+
      (p.resultado ? '<b>Sí</b>: se hace lo que está adentro.' : '<b>No</b>: se saltea lo que está adentro.'));
    siguientePaso(c, Math.max(450, msVelocidad()));
    return;
  }
  const r = Motor.ejecutarPaso(c.est, E.mapa, p.bloque);
  const quien = textoPaso(p);
  if (Motor.ERRORES.includes(r.tipo)) {
    dibujarVivo(c.est, r);
    animarPersonaje('choca');
    const el = document.querySelector('.chip[data-id="'+p.bloque.id+'"]'); if (el) el.classList.add('falla');
    const { que, ayuda } = FALLAS[r.tipo];
    mensaje('error', quien+': '+que, ayuda + (Motor.hayAzar(E.mapa) ? ' Ojo: el tablero cambia en cada intento.' : ''));
    c.terminada = true; c.auto = false;
    actualizarBotones();
    return;
  }
  dibujarVivo(c.est, null);
  let txt = quien+': '+nombreBloque(p.bloque)+'.';
  const extra = LOGROS[r.tipo];
  if (extra) txt += extra;
  if (r.tipo === 'apagado') txt += ' ¡Apagaste a '+r.quien+'!';
  mensaje('', c.auto ? 'Ejecutando…' : 'Paso a paso', txt);
  siguientePaso(c, msVelocidad());
}

export function msVelocidad(){ return (VELOCIDADES.find(v => v.id === E.velocidad) || VELOCIDADES[1]).ms; }

export function terminar(){
  const c = E.corrida; c.terminada = true; c.auto = false; quitarResaltado();
  const ev = Motor.evaluar(c.est, E.mapa);
  if (ev.gano && Motor.hayAzar(E.mapa)) {
    const falla = Motor.probarTodas(E.prog, E.mapa);
    if (falla) {
      mensaje('error', '¡Esta vez llegaste! Pero no alcanza.', 'El tablero cambia en cada intento, y con otro tablero tu programa falla. Usá Si para preguntar antes de actuar.',
        '<button class="btn-siguiente" id="btnProbarFalla">Probar con el tablero donde falla</button>');
      $('btnProbarFalla').addEventListener('click', () => { E.tableroPedido = falla.variante; ejecutar(); });
      actualizarBotones();
      return;
    }
  }
  if (ev.gano) {
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
  b.innerHTML = corre ? ico('stop')+'<span>Detener</span>' : ico('play')+'<span>Ejecutar</span>';
  b.setAttribute('aria-label', corre ? 'Detener' : 'Ejecutar');
  ['btnPaso','btnBorrar','btnLimpiar'].forEach(id => $(id).disabled = corre);
  document.querySelectorAll('.bloque-btn').forEach(x => x.disabled = corre);
}
