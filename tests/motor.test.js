/* Pruebas puntuales del motor: errores con número de instrucción, enemigos y preguntas. */
import { describe, it, expect } from 'vitest';
import * as Motor from '../src/motor/index.js';

const correr = (mapa, texto, extra) => Motor.simular(Motor.leerPrograma(texto), Motor.leerMapa(mapa, extra));

describe('Motor', () => {
  it('dice en qué instrucción se chocó una roca', () => {
    const r = correr(['S.#.M'], 'r r r r');
    expect(r.falla.tipo).toBe('roca');
    expect(r.paso.num).toBe(2);
  });

  it('cuenta la vuelta del Repetir en la que falla', () => {
    const r = correr(['S..#M'], 'x4(r)');
    expect(r.falla.tipo).toBe('roca');
    expect(r.paso.vuelta).toBe(3);
  });

  it('la compuerta se abre solo después de apretar el botón', () => {
    expect(correr(['.B.', 'SPM'], 'r r').falla.tipo).toBe('compuerta');
    expect(correr(['.B..', 'S.PM'], 'r u p d r r').resultado.gano).toBe(true);
  });

  it('Chatarrín atrapa a quien se cruza en su camino', () => {
    const r = correr(['...', 'S.M', '...'], 'r r', { enemigo:{ desde:[1,0], hasta:[1,2] } });
    expect(r.falla.tipo).toBe('enemigo');
  });

  it('el garrote apaga a Bulón y sin enemigo enfrente es un error', () => {
    expect(correr(['SEM'], 'g r r').resultado.gano).toBe(true);
    expect(correr(['S.M'], 'g').falla.tipo).toBe('garroteVacio');
  });

  it('Si pregunta recién cuando le toca', () => {
    const mapa = Motor.leerMapa(['SeM'], {});
    for (const v of Motor.variantes(mapa)) {
      expect(Motor.simular(Motor.leerPrograma('?e(g) r r'), mapa, v).resultado.gano).toBe(true);
    }
  });

  it('numera las instrucciones de adentro de Repetir y Si', () => {
    const prog = Motor.leerPrograma('r x3(?e(g) r) d');
    const nums = Motor.numerar(prog);
    expect(Object.values(nums)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(Motor.contarBloques(prog)).toBe(6);
  });
});
