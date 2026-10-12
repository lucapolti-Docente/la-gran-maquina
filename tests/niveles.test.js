/* Comprueba que todos los niveles se pueden ganar y que los niveles de depurar empiezan con un error de verdad. */
import { describe, it, expect } from 'vitest';
import { NIVELES } from '../src/datos/niveles/index.js';
import * as Motor from '../src/motor/index.js';

const quitarSi = texto => texto.replace(/\?[eolb]\(([^()]*)\)/g, '$1');

for (const [dificultad, lista] of Object.entries(NIVELES)) {
  describe('Nivel ' + dificultad, () => {
    lista.forEach((n, i) => {
      const nombre = (i + 1) + '. ' + n.titulo;
      const mapa = Motor.leerMapa(n.mapa, n);

      it(nombre + ': el mapa es rectangular y tiene salida y meta', () => {
        expect(new Set(n.mapa.map(f => f.length)).size).toBe(1);
        expect(mapa.inicio).not.toBeNull();
        expect(mapa.meta).not.toBeNull();
      });

      it(nombre + ': la solución gana en todos los tableros posibles', () => {
        const falla = Motor.probarTodas(Motor.leerPrograma(n.solucion), mapa);
        expect(falla, falla && JSON.stringify(falla.s.falla || falla.s.resultado)).toBeNull();
      });

      it(nombre + ': la solución respeta el límite de bloques y usa solo los bloques del nivel', () => {
        const prog = Motor.leerPrograma(n.solucion);
        if (n.max) expect(Motor.contarBloques(prog)).toBeLessThanOrEqual(n.max);
        const tipos = new Set();
        const recorrer = l => l.forEach(b => { tipos.add(b.t === 'mov' ? b.d : b.t); if (b.cuerpo) recorrer(b.cuerpo); });
        recorrer(prog);
        for (const t of tipos) {
          const dado = n.bloques.includes(t) || (['u','d','l','r'].includes(t) && n.bloques.includes('mov'));
          expect(dado, 'el bloque ' + t + ' no está en la paleta').toBe(true);
        }
      });

      if (n.depurar) {
        it(nombre + ': el programa con error falla', () => {
          expect(Motor.probarTodas(Motor.leerPrograma(n.programa), mapa)).not.toBeNull();
        });
      }

      if (n.solucion.includes('?')) {
        it(nombre + ': sin el Si, la solución no alcanza', () => {
          expect(Motor.probarTodas(Motor.leerPrograma(quitarSi(n.solucion)), mapa)).not.toBeNull();
        });
      }
    });
  });
}
