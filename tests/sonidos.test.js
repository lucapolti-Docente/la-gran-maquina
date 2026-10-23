/* Cada cosa que puede pasar en el tablero tiene su sonido, y los sonidos son cortos y suaves. */
import { it, expect } from 'vitest';
import { SONIDOS, SONIDO_DE } from '../src/datos/sonidos.js';
import { ERRORES } from '../src/motor/index.js';

const RESULTADOS_BIEN = ['mov','engranaje','encendida','yaEncendida','apretado','yaApretado','espera','escudo','apagado'];

it('cada resultado del motor tiene un sonido que existe', () => {
  for (const t of [...ERRORES, ...RESULTADOS_BIEN]) {
    expect(SONIDO_DE[t], t).toBeTruthy();
    expect(SONIDOS[SONIDO_DE[t]], SONIDO_DE[t]).toBeTruthy();
  }
});

it('los sonidos son cortos y no suenan fuerte', () => {
  for (const [nombre, notas] of Object.entries(SONIDOS)) {
    expect(notas.length, nombre).toBeGreaterThan(0);
    const fin = Math.max(...notas.map(n => (n.t || 0) + n.d));
    expect(fin, nombre + ' dura demasiado').toBeLessThanOrEqual(1);
    for (const n of notas) {
      expect(n.f).toBeGreaterThan(50);
      expect(n.vol || 0.06, nombre).toBeLessThanOrEqual(0.15);
      expect(['sine','triangle','square', undefined]).toContain(n.onda);
    }
  }
});
