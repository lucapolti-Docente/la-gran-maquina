/* La pantalla final, con festejo. */
import * as Dibujo from '../dibujo/index.js';
import { FINAL } from '../datos/textos.js';
import { $ } from './dom.js';
import { E, niveles, P } from './estado.js';
import { sonar } from './sonido.js';
import { cerrarTodo } from './ventanas.js';

export function mostrarFinal(){
  cerrarTodo();
  const faltan = niveles().map((n,i) => i).filter(i => !P().ganados.has(i));
  if (faltan.length) {
    // Llegó al final saltando niveles: festejo, pero sin el avance completo.
    $('tFinal').textContent = FINAL.saltado.titulo;
    $('textoFinal').textContent = FINAL.saltado.texto(FINAL.saltado.avance[E.dif]);
    $('faltanFinal').textContent = FINAL.faltan(faltan.map(i => i+1));
    $('maquinaFinal').style.display = 'none';
  } else {
    $('tFinal').textContent = FINAL.ganado.titulo[E.dif];
    $('textoFinal').textContent = FINAL.ganado.texto[E.dif](niveles().length);
    $('faltanFinal').textContent = '';
    $('maquinaFinal').style.display = '';
    $('maquinaFinal').innerHTML = Dibujo.maquina(E.dif, Dibujo.total, { fondo:'#FFFFFF', sinFantasma:true });
  }
  const f = $('final');
  f.querySelectorAll('.papelito').forEach(p => p.remove());
  const colores = ['#FFC400','#FF5A1F','#22B573','#8FD0FF','#FFFFFF','#E04848'];
  for (let i = 0; i < 46; i++) {
    const p = document.createElement('span');
    p.className = 'papelito';
    p.style.left = (Math.random()*100)+'%';
    p.style.background = colores[i % colores.length];
    p.style.animationDuration = (3 + Math.random()*4)+'s';
    p.style.animationDelay = (-Math.random()*6)+'s';
    f.appendChild(p);
  }
  f.classList.add('abierta');
  sonar('final');
  $('btnOtraVez').focus();
}
