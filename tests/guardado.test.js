/* El progreso guardado de los chicos no se pierde: lo viejo se pasa al formato nuevo al abrir el juego. */
import { describe, it, expect } from 'vitest';
import { crearGuardado, CLAVE, CLAVE_V2, CLAVE_V3 } from '../src/guardado.js';

function storageDePrueba(inicial){
  const datos = { ...inicial };
  return { datos, getItem:k => (k in datos ? datos[k] : null), setItem:(k, v) => { datos[k] = String(v); } };
}

const v3 = { dif:'dificil', personaje:'mango', mayus:true, velocidad:'lenta',
             progreso:{ facil:{ nivel:14, hecho:true, ganados:[0,1,2,3] }, dificil:{ nivel:2, hecho:false, ganados:[0,1] } } };

describe('Guardado', () => {
  it('pasa lo guardado en v3 a v4 sin perder nada y no borra la clave vieja', () => {
    const s = storageDePrueba({ [CLAVE_V3]:JSON.stringify(v3) });
    const g = crearGuardado(() => s).leer();
    expect(g).toEqual({ version:4, modo:'dificil', personaje:'mango', mayus:true, velocidad:'lenta', sonido:true, progreso:v3.progreso });
    expect(JSON.parse(s.datos[CLAVE])).toEqual(g);
    expect(s.datos[CLAVE_V3]).toBe(JSON.stringify(v3));
  });

  it('pasa lo guardado en v2 a Fácil', () => {
    const s = storageDePrueba({ [CLAVE_V2]:JSON.stringify({ personaje:'pila', mayus:false, velocidad:'rapida', nivel:5, hecho:false, ganados:[0,1,2,3,4] }) });
    const g = crearGuardado(() => s).leer();
    expect(g.modo).toBe('facil');
    expect(g.personaje).toBe('pila');
    expect(g.progreso.facil).toEqual({ nivel:5, hecho:false, ganados:[0,1,2,3,4] });
  });

  it('si ya hay v4, usa ese y no mira lo viejo', () => {
    const v4 = { version:4, modo:'facil', personaje:'coco', sonido:false, progreso:{} };
    const s = storageDePrueba({ [CLAVE]:JSON.stringify(v4), [CLAVE_V3]:JSON.stringify(v3) });
    expect(crearGuardado(() => s).leer()).toEqual(v4);
  });

  it('escribe y vuelve a leer lo mismo', () => {
    const s = storageDePrueba({});
    const G = crearGuardado(() => s);
    G.escribir({ modo:'dificil', personaje:'tuerca', progreso:{ facil:{ nivel:1, hecho:false, ganados:[0] } } });
    expect(G.leer()).toEqual({ version:4, modo:'dificil', personaje:'tuerca', progreso:{ facil:{ nivel:1, hecho:false, ganados:[0] } } });
  });

  it('con datos rotos o sin nada guardado arranca de cero', () => {
    expect(crearGuardado(() => storageDePrueba({ [CLAVE]:'{roto', [CLAVE_V3]:'null' })).leer()).toEqual({});
    expect(crearGuardado(() => storageDePrueba({})).leer()).toEqual({});
  });

  it('sin localStorage (modo privado o bloqueado) no se rompe', () => {
    const G = crearGuardado(() => { throw new Error('bloqueado'); });
    expect(G.leer()).toEqual({});
    expect(() => G.escribir({ modo:'facil' })).not.toThrow();
    const lleno = crearGuardado(() => ({ getItem:() => null, setItem:() => { throw new Error('lleno'); } }));
    expect(() => lleno.escribir({ modo:'facil' })).not.toThrow();
    expect(lleno.escribirClave('x', [])).toBe(false);
  });
});
