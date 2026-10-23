/* La validación de niveles: los niveles del juego la pasan, cada regla detecta lo que tiene que detectar
   y la dificultad sube de a una cosa nueva por nivel. */
import { describe, it, expect } from 'vitest';
import { NIVELES } from '../src/datos/niveles/index.js';
import { VALIDACION } from '../src/datos/textos.js';
import { validarNivel } from '../src/motor/index.js';

const codigos = nivel => validarNivel(nivel).map(p => p.codigo);
const base = { bloques:['mov','act','btn','garrote'] };

describe('Validación de los niveles del juego', () => {
  for (const [dif, lista] of Object.entries(NIVELES)) {
    lista.forEach((n, i) => {
      it(dif + ' ' + (i + 1) + '. ' + n.titulo + ': no tiene problemas', () => {
        expect(validarNivel(n)).toEqual([]);
      });
    });
  }
});

describe('Reglas de la validación', () => {
  const casos = [
    ['faltaSalida', { mapa:['...M'] }],
    ['variasSalidas', { mapa:['S.SM'] }],
    ['faltaBandera', { mapa:['S...'] }],
    ['variasBanderas', { mapa:['SM.M'] }],
    ['noRectangular', { mapa:['S..M', '..'] }],
    ['letraDesconocida', { mapa:['S.XM'] }],
    ['compuertaSinBoton', { mapa:['S.PM'] }],
    ['botonSinCompuerta', { mapa:['SB.M'] }],
    ['sinFlechas', { mapa:['S..M'], bloques:['act'] }],
    ['bloqueDesconocido', { mapa:['S..M'], bloques:['mov','volar'] }],
    ['maxInvalido', { mapa:['S..M'], max:0 }],
    ['lamparaSinEncender', { mapa:['SL.M'], bloques:['mov'] }],
    ['compuertaSinApretar', { mapa:['SBPM'], bloques:['mov'] }],
    ['chatarrinNoRecto', { mapa:['S...', '...M'], enemigo:{ desde:[1,0], hasta:[2,1] } }],
    ['chatarrinAfuera', { mapa:['S..M', '....'], enemigo:{ desde:[1,0], hasta:[1,3] } }],
    ['chatarrinPisa', { mapa:['S.#M', '....'], enemigo:{ desde:[2,0], hasta:[2,1] } }],
    ['chatarrinPisa', { mapa:['SBP.M', '.....'], enemigo:{ desde:[2,0], hasta:[2,1] } }],
    ['chatarrinPisa', { mapa:['S..M', '....'], enemigo:{ desde:[0,0], hasta:[0,1] } }],
    ['banderaInalcanzable', { mapa:['S#M'] }],
    ['banderaInalcanzable', { mapa:['SEM'], bloques:['mov'] }],
    ['cosasInalcanzables', { mapa:['S.M#G'] }]
  ];
  casos.forEach(([codigo, nivel]) => {
    it('detecta ' + codigo + ' en ' + JSON.stringify(nivel.mapa), () => {
      expect(codigos({ ...base, ...nivel })).toContain(codigo);
    });
  });

  it('un nivel simple y bien armado no tiene problemas', () => {
    expect(codigos({ mapa:['S.L.', 'B.PM'], bloques:['mov','act','btn'], enemigo:{ desde:[1,0], hasta:[1,1] } })).toEqual([]);
  });

  it('marca el casillero del problema', () => {
    const [p] = validarNivel({ ...base, mapa:['S.SM'] });
    expect(p.celdas).toEqual([{ x:0, y:0 }, { x:2, y:0 }]);
  });

  it('cada problema tiene su texto', () => {
    const todos = new Set(casos.map(c => c[0]).concat(['mapaVacio','chatarrinSinRecorrido']));
    for (const c of todos) expect(typeof VALIDACION[c], c).toBe('function');
  });
});

/* Cada nivel suma a lo sumo una cosa nueva. Un bloque y el elemento del mapa que lo necesita cuentan juntos
   (Encender con la lámpara, Apretar con el botón y la compuerta, el escudo con Chispero).
   Difícil se juega después de Fácil: lo que ya se vio en Fácil no es nuevo. */
const IDEAS = {
  flechas:n => n.bloques.some(b => ['mov','u','d','l','r'].includes(b)),
  rocas:n => /[#o]/.test(n.mapa.join('')),
  engranajes:n => /G/.test(n.mapa.join('')),
  depurar:n => !!n.depurar,
  lamparas:n => /[Ll]/.test(n.mapa.join('')) || n.bloques.includes('act'),
  compuerta:n => /[BP]/.test(n.mapa.join('')),
  repetir:n => n.bloques.includes('loop'),
  chatarrin:n => !!n.enemigo,
  esperar:n => n.bloques.includes('esperar'),
  bulon:n => /[Ee]/.test(n.mapa.join('')) || n.bloques.includes('garrote'),
  chispero:n => /[<>^vH]/.test(n.mapa.join('')),
  semaforo:n => /T/.test(n.mapa.join('')),
  si:n => n.bloques.includes('si')
};

describe('La dificultad sube de a poco', () => {
  const vistas = new Set();
  for (const [dif, lista] of Object.entries(NIVELES)) {
    lista.forEach((n, i) => {
      const nuevas = Object.keys(IDEAS).filter(id => IDEAS[id](n) && !vistas.has(id));
      nuevas.forEach(id => vistas.add(id));
      it(dif + ' ' + (i + 1) + '. ' + n.titulo + ': suma a lo sumo una cosa nueva', () => {
        expect(nuevas.length, 'nuevas: ' + nuevas.join(', ')).toBeLessThanOrEqual(1);
      });
    });
  }
});
