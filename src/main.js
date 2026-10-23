/* Punto de entrada: carga los estilos, lee lo guardado y arranca el juego. */
import './estilos/index.css';
import { NIVELES } from './datos/niveles/index.js';
import { PERSONAJES } from './datos/personajes/index.js';
import { VELOCIDADES } from './config.js';
import { Guardado } from './guardado.js';
import * as Motor from './motor/index.js';
import * as Dibujo from './dibujo/index.js';
import { E } from './interfaz/estado.js';
import { aplicarMayus } from './interfaz/ventanas.js';
import { conectar } from './interfaz/controles.js';
import { conectarInicio, mostrarInicio } from './interfaz/inicio.js';

function iniciar(){
  const g = Guardado.leer();
  if (g.personaje && PERSONAJES.some(p => p.id === g.personaje)) E.personaje = g.personaje;
  E.mayus = !!g.mayus;
  if (VELOCIDADES.some(v => v.id === g.velocidad)) E.velocidad = g.velocidad;
  if (typeof g.modo === 'string') E.modo = g.modo;
  if (NIVELES[E.modo]) E.dif = E.modo;
  E.sonido = g.sonido !== false;
  Object.keys(E.progreso).forEach(d => {
    const p = g.progreso && g.progreso[d]; if (!p) return;
    const q = E.progreso[d];
    if (Number.isInteger(p.nivel)) q.nivel = Math.max(0, Math.min(NIVELES[d].length-1, p.nivel));
    q.hecho = !!p.hecho;
    if (Array.isArray(p.ganados)) p.ganados.forEach(i => { if (Number.isInteger(i) && i >= 0 && i < NIVELES[d].length) q.ganados.add(i); });
  });
  aplicarMayus();
  conectar();
  conectarInicio();
  mostrarInicio();
}

iniciar();

/* Para probar desde la consola del navegador y para los tests de punta a punta. */
window.GranMaquina = { NIVELES, PERSONAJES, Motor, Dibujo, E };
