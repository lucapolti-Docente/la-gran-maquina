/* Exportar e importar niveles inventados en un archivo de texto. */
import { describe, it, expect } from 'vitest';
import { NIVELES } from '../src/datos/niveles/index.js';
import * as Motor from '../src/motor/index.js';

const nivel = (extra) => ({ ...Motor.nivelNuevo(5, 3), nombre:'El pasillo', autor:'Sofi', ...extra });

describe('Archivo de niveles', () => {
  it('lo que se exporta se vuelve a importar igual (sin "probado")', () => {
    const lista = [
      nivel({ probado:true }),
      nivel({ nombre:'', autor:'', mapa:['S.e.M', '..o..', 'l.o..'], bloques:['mov','act','si'], max:9, enemigo:{ desde:[1,0], hasta:[1,2] } })
    ];
    const { niveles, malos } = Motor.textoANiveles(Motor.nivelesATexto(lista));
    expect(malos).toBe(0);
    expect(niveles).toEqual(lista.map(n => ({ ...n, probado:false })));
  });

  it('cada nivel del juego, pasado al editor, viaja bien por el archivo', () => {
    const lista = Object.values(NIVELES).flat().map(Motor.desdeNivelDeJuego);
    expect(Motor.textoANiveles(Motor.nivelesATexto(lista)).niveles).toEqual(lista);
  });

  it('se banca el archivo tocado con el Bloc de notas: BOM, mayúsculas, tildes, u d l r', () => {
    const texto = '﻿LA GRAN MÁQUINA · NIVELES\n=== NIVEL ===\nNombre:  Uno: el primero \nLímite: 4\nbloques: r, d\n mapa:\n S.M \n...\n';
    const { niveles } = Motor.textoANiveles(texto);
    expect(niveles).toEqual([{ nombre:'Uno: el primero', autor:'', mapa:['S.M', '...'], enemigo:null, bloques:['mov'], max:4, probado:false }]);
  });

  it('descarta lo que no tiene forma de nivel y cuenta cuántos', () => {
    const texto = ['=== NIVEL ===', 'mapa:', 'S..M', 'S.M',                  // filas de distinto largo
                   '=== NIVEL ===', 'mapa:', 'S.Z.M',                        // letra rara
                   '=== NIVEL ===', 'mapa:', 'S.'+'.'.repeat(20)+'M',        // muy grande
                   '=== NIVEL ===', 'nombre: sin mapa',
                   '=== NIVEL ===', 'mapa:', 'S...M', '.....', 'chatarrin: 9,9 hasta 9,0'].join('\n');
    const { niveles, malos } = Motor.textoANiveles(texto);
    expect(malos).toBe(4);
    expect(niveles).toHaveLength(1);
    expect(niveles[0].enemigo).toBeNull();
  });

  it('un texto cualquiera no tiene niveles', () => {
    expect(Motor.textoANiveles('hola')).toEqual({ niveles:[], malos:0 });
    expect(Motor.textoANiveles('')).toEqual({ niveles:[], malos:0 });
  });

  it('reconoce el mismo nivel aunque cambie "probado"', () => {
    expect(Motor.mismoNivel(nivel(), nivel({ probado:true }))).toBe(true);
    expect(Motor.mismoNivel(nivel(), nivel({ nombre:'Otro' }))).toBe(false);
  });
});

describe('Cosas que aparecen a veces en el editor', () => {
  it('se pueden pintar Bulón, roca y lámpara a veces', () => {
    let nv = Motor.nivelNuevo(5, 3);
    nv = Motor.pintar(Motor.pintar(Motor.pintar(nv, 1, 0, 'e'), 2, 0, 'o'), 3, 0, 'l');
    expect(nv.mapa[0]).toBe('.eol.');
  });

  it('piden el bloque Si para poder preguntar', () => {
    const codigos = n => Motor.validarNivel(n).map(p => p.codigo);
    expect(codigos({ mapa:['SeM'], bloques:['mov','garrote'] })).toContain('azarSinSi');
    expect(codigos({ mapa:['SeM'], bloques:['mov','garrote','si'] })).not.toContain('azarSinSi');
    expect(Motor.preguntasDelMapa(['SeolM'], null)).toEqual(['enemigo','roca','lampara']);
  });
});
