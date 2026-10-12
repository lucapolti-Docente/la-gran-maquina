/* Los personajes tienen id único, nombre y un dibujo (SVG propio o imagen). */
import { it, expect } from 'vitest';
import { PERSONAJES } from '../src/datos/personajes/index.js';

it('cada personaje tiene id único, nombre y dibujo', () => {
  const ids = PERSONAJES.map(p => p.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const p of PERSONAJES) {
    expect(p.nombre).toBeTruthy();
    expect(Boolean(p.svg) || Boolean(p.imagen), p.id + ' no tiene dibujo').toBe(true);
    if (p.svg) expect((p.svg.match(/<g/g) || []).length).toBe((p.svg.match(/<\/g>/g) || []).length);
  }
});
