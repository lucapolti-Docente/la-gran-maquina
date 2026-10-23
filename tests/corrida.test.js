/* Paso igual a Ejecutar: correr un programa entero y correrlo paso a paso (mirando el próximo bloque
   entre paso y paso, como hace la pantalla) tienen que terminar exactamente igual. */
import { describe, it, expect } from 'vitest';
import { NIVELES } from '../src/datos/niveles/index.js';
import * as Motor from '../src/motor/index.js';

/* Ejecutar como era antes de que existiera la corrida: el generador de pasos de una. */
function correrTodo(prog, m, v){
  const est = Motor.crearEstado(m, v);
  for (const p of Motor.pasos(prog, est, m)) {
    if (p.pregunta) continue;
    const r = Motor.ejecutarPaso(est, m, p.bloque);
    if (Motor.ERRORES.includes(r.tipo)) return { falla:r.tipo, num:p.num, vuelta:p.vuelta, est:foto(est) };
  }
  return { gano:Motor.evaluar(est, m).gano, est:foto(est) };
}

function correrPasoAPaso(prog, m, v){
  const c = Motor.crearCorrida(prog, m, v);
  for (let i = 0; ; i++) {
    for (let j = 0; j < i % 3; j++) c.proximo(); // mirar el próximo no cambia nada
    const s = c.paso();
    if (s.falla) return { falla:s.r.tipo, num:s.p.num, vuelta:s.p.vuelta, est:foto(c.est) };
    if (s.terminada) return { gano:s.resultado.gano, est:foto(c.est) };
  }
}

const foto = est => JSON.stringify({ x:est.x, y:est.y, dir:est.dir, mira:est.mira, t:est.t, juntados:[...est.juntados], encendidas:[...est.encendidas],
  abiertas:est.abiertas, escudo:est.escudo, apagados:[...est.apagados], enemigo:est.enemigo, rastro:est.rastro });

/* Programas para probar: la solución, el de depurar, la solución cortada y la solución sin el último bloque de cada Repetir. */
function programas(n){
  const lista = [n.solucion];
  if (n.programa) lista.push(n.programa);
  const fichas = n.solucion.match(/x\d\(|\?[eolb]\(|\)|[udlrapwg]/g);
  for (let corte = 1; corte < fichas.length; corte += 2) {
    let abiertos = 0; const parte = fichas.slice(0, corte);
    parte.forEach(f => { if (f.endsWith('(')) abiertos++; else if (f === ')') abiertos--; });
    lista.push(parte.join(' ') + ')'.repeat(Math.max(0, abiertos)));
  }
  lista.push(n.solucion.replace(/ r\)/g, ')'));
  return lista;
}

for (const [dif, niveles] of Object.entries(NIVELES)) {
  describe('Paso igual a Ejecutar en ' + dif, () => {
    niveles.forEach((n, i) => {
      it((i + 1) + '. ' + n.titulo, () => {
        const m = Motor.leerMapa(n.mapa, n);
        for (const texto of programas(n)) {
          for (const v of Motor.variantes(m)) {
            const prog = Motor.leerPrograma(texto);
            expect(correrPasoAPaso(prog, m, v), texto).toEqual(correrTodo(prog, m, v));
          }
        }
      });
    });
  });
}

describe('Corrida', () => {
  it('proximo() muestra el bloque que viene, con la vuelta del Repetir', () => {
    const m = Motor.leerMapa(['S...M'], {});
    const c = Motor.crearCorrida(Motor.leerPrograma('x2(r r)'), m);
    expect(c.proximo().vuelta).toBe(1);
    c.paso(); c.paso();
    expect(c.proximo()).toMatchObject({ num:2, vuelta:2 });
    expect(c.proximo().reps).toEqual([{ id:c.proximo().rep.id, vuelta:2, n:2 }]);
    c.paso(); c.paso();
    expect(c.proximo()).toBeNull();
    expect(c.paso()).toMatchObject({ terminada:true, resultado:{ gano:true } });
    expect(c.terminada).toBe(true);
  });

  it('después de un error ya no avanza', () => {
    const c = Motor.crearCorrida(Motor.leerPrograma('r r'), Motor.leerMapa(['S#M'], {}));
    expect(c.paso()).toMatchObject({ falla:true, r:{ tipo:'roca' } });
    expect(c.proximo()).toBeNull();
  });

  it('el Si es un paso propio, con su respuesta', () => {
    const m = Motor.leerMapa(['SEM'], {});
    const c = Motor.crearCorrida(Motor.leerPrograma('?e(g) r r'), m);
    expect(c.paso()).toMatchObject({ pregunta:true, p:{ resultado:true } });
    expect(c.paso().r.tipo).toBe('apagado');
  });
});
