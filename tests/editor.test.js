/* El editor genera niveles con el formato de siempre: el motor los lee igual que a los niveles del juego. */
import { describe, it, expect } from 'vitest';
import { NIVELES } from '../src/datos/niveles/index.js';
import * as Motor from '../src/motor/index.js';

const pintarVarios = (nv, lista) => lista.reduce((n, [x, y, l]) => Motor.pintar(n, x, y, l), nv);

describe('Editor de niveles', () => {
  it('un nivel nuevo ya tiene salida y bandera y pasa la validación', () => {
    const nv = Motor.nivelNuevo(7, 5);
    expect(nv.mapa).toEqual(['.......', '.......', 'S.....M', '.......', '.......']);
    expect(Motor.validarNivel(Motor.aNivelDeJuego(nv))).toEqual([]);
  });

  it('respeta los límites de tamaño', () => {
    expect(Motor.nivelNuevo(50, 50).mapa.length).toBe(Motor.LIMITES.alto.max);
    expect(Motor.nivelNuevo(50, 50).mapa[0].length).toBe(Motor.LIMITES.ancho.max);
    const chico = Motor.cambiarTamano(Motor.nivelNuevo(), 1, 1);
    expect([chico.mapa[0].length, chico.mapa.length]).toEqual([Motor.LIMITES.ancho.min, Motor.LIMITES.alto.min]);
  });

  it('la salida y la bandera se mudan en vez de repetirse', () => {
    const nv = Motor.pintar(Motor.nivelNuevo(4, 2), 3, 1, 'S');
    expect(nv.mapa.join('').match(/S/g)).toHaveLength(1);
    expect(nv.mapa[1][3]).toBe('S');
  });

  it('lo que genera lo lee el motor y se puede ganar', () => {
    let nv = pintarVarios(Motor.nivelNuevo(5, 3), [[2,1,'#'], [1,0,'L'], [3,2,'B'], [4,0,'P'], [4,1,'.'], [4,0,'M']]);
    nv = Motor.pintar(nv, 4, 1, 'P');
    nv = Motor.cambiarBloques(Motor.cambiarBloques(nv, 'act', true), 'btn', true);
    nv = Motor.ponerChatarrin(nv, [3,0], [3,1]);
    const n = Motor.aNivelDeJuego(nv, { titulo:'Mi nivel' });
    expect(n.mapa).toEqual(['.L..M', 'S.#.P', '...B.']);
    expect(n.enemigo).toEqual({ desde:[3,0], hasta:[3,1] });
    expect(Motor.validarNivel(n)).toEqual([]);
    const m = Motor.leerMapa(n.mapa, n);
    expect(m.inicio).toEqual({ x:0, y:1 });
    expect(m.enemigo.camino).toEqual([{ x:3, y:0 }, { x:3, y:1 }]);
    expect(m.compuertas).toEqual([{ x:4, y:1 }]);
    // Desde la salida: subir, encender la lámpara, bajar rodeando la roca y apretar el botón, sin cruzarse con Chatarrín.
    const r = Motor.simular(Motor.leerPrograma('u r a d d r r p'), m, Motor.variantes(m)[0]);
    expect(r.falla).toBeUndefined();
  });

  it('cada nivel del juego se puede abrir en el editor y volver igual', () => {
    for (const lista of Object.values(NIVELES)) {
      for (const n of lista) {
        const vuelta = Motor.aNivelDeJuego(Motor.desdeNivelDeJuego(n));
        expect(vuelta.mapa).toEqual(n.mapa);
        expect(vuelta.enemigo).toEqual(n.enemigo);
        expect(vuelta.max).toEqual(n.max);
        expect(Motor.leerMapa(vuelta.mapa, vuelta)).toEqual(Motor.leerMapa(n.mapa, n));
      }
    }
  });

  it('achicar el tablero saca a Chatarrín si queda afuera', () => {
    const nv = Motor.ponerChatarrin(Motor.nivelNuevo(7, 5), [6,0], [6,4]);
    expect(Motor.cambiarTamano(nv, 5, 5).enemigo).toBeNull();
    expect(Motor.cambiarTamano(nv, 7, 6).enemigo).toEqual(nv.enemigo);
  });

  it('el Si trae las preguntas que tienen sentido en el mapa', () => {
    let nv = Motor.cambiarBloques(pintarVarios(Motor.nivelNuevo(5, 3), [[2,1,'T'], [3,1,'E']]), 'si', true);
    expect(Motor.aNivelDeJuego(nv).preguntas).toEqual(['enemigo', 'roja']);
    nv = Motor.cambiarBloques(Motor.nivelNuevo(5, 3), 'si', true);
    expect(Motor.aNivelDeJuego(nv).preguntas).toEqual(['roca']);
  });

  it('cambiar algo saca la marca de probado', () => {
    const nv = { ...Motor.nivelNuevo(), probado:true };
    expect(Motor.pintar(nv, 1, 1, '#').probado).toBe(false);
    expect(Motor.cambiarMax(nv, 5)).toMatchObject({ max:5, probado:false });
    expect(Motor.cambiarMax(nv, 0).max).toBeNull();
  });

  it('la validación explica lo que está mal en un nivel inventado', () => {
    const cod = nv => Motor.validarNivel(Motor.aNivelDeJuego(nv)).map(p => p.codigo);
    expect(cod(Motor.pintar(Motor.nivelNuevo(5, 3), 4, 1, '.'))).toContain('faltaBandera');
    expect(cod(Motor.pintar(Motor.nivelNuevo(5, 3), 2, 1, 'P'))).toEqual(expect.arrayContaining(['compuertaSinBoton', 'compuertaSinApretar']));
    expect(cod(Motor.ponerChatarrin(Motor.pintar(Motor.nivelNuevo(5, 3), 2, 0, '#'), [2,0], [2,2]))).toContain('chatarrinPisa');
    expect(cod(Motor.cambiarBloques(Motor.nivelNuevo(5, 3), 'mov', false))).toContain('sinFlechas');
    expect(cod(pintarVarios(Motor.nivelNuevo(5, 3), [[2,0,'#'], [2,1,'#'], [2,2,'#']]))).toContain('banderaInalcanzable');
  });
});
