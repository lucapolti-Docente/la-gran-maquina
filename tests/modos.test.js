/* El registro de modos: cada modo trae lo que la pantalla de inicio necesita. */
import { describe, it, expect } from 'vitest';
import { MODOS } from '../src/modos/index.js';
import { NIVELES } from '../src/datos/niveles/index.js';

const E = { progreso:{ facil:{ nivel:7, hecho:false, ganados:new Set([0,1,2,3,4,5,6]) }, dificil:{ nivel:0, hecho:false, ganados:new Set() } } };

describe('Modos', () => {
  it('tienen id único y todos los campos', () => {
    const ids = MODOS.map(m => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const m of MODOS) {
      expect(m.id).toMatch(/^[a-z-]+$/);
      expect(m.nombre).toBeTruthy();
      expect(m.descripcion).toBeTruthy();
      ['icono','avance','arrancar'].forEach(f => expect(typeof m[f], m.id + '.' + f).toBe('function'));
      expect(m.icono(E)).toMatch(/</);
    }
  });

  it('Fácil y Difícil están y en ese orden', () => {
    expect(MODOS.map(m => m.id).slice(0, 2)).toEqual(['facil', 'dificil']);
  });

  it('el avance cuenta los niveles ganados', () => {
    expect(MODOS[0].avance(E)).toEqual({ hechos:7, total:NIVELES.facil.length });
    expect(MODOS[1].avance(E)).toEqual({ hechos:0, total:NIVELES.dificil.length });
  });

  it('arrancar le pide a la interfaz lo que necesita', () => {
    const pedidos = [];
    const app = { jugarNiveles:id => pedidos.push(['niveles', id]), abrirEditor:() => pedidos.push(['editor']) };
    MODOS.forEach(m => m.arrancar(app));
    expect(pedidos.slice(0, 2)).toEqual([['niveles','facil'], ['niveles','dificil']]);
  });
});
