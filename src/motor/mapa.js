/* Lee el mapa de un nivel y arma los tableros posibles cuando hay cosas al azar. */

export const k = (x,y) => x+','+y;

export function leerMapa(filas, nivel){
  const m = { ancho:filas[0].length, alto:filas.length, rocas:new Set(), engranajes:[], lamparas:[], botones:[], compuertas:[],
              guardias:[], rocasAzar:[], semaforos:[], escudos:[], chisperos:[], inicio:null, meta:null, enemigo:null };
  filas.forEach((fila,y) => [...fila].forEach((c,x) => {
    if (c === '#') m.rocas.add(k(x,y));
    else if (c === 'S') m.inicio = {x,y};
    else if (c === 'M') m.meta = {x,y};
    else if (c === 'G') m.engranajes.push({x,y});
    else if (c === 'L') m.lamparas.push({x,y,azar:false});
    else if (c === 'l') m.lamparas.push({x,y,azar:true});
    else if (c === 'B') m.botones.push({x,y});
    else if (c === 'P') m.compuertas.push({x,y});
    else if (c === 'E') m.guardias.push({x,y,azar:false});
    else if (c === 'e') m.guardias.push({x,y,azar:true});
    else if (c === 'o') m.rocasAzar.push({x,y});
    else if (c === 'T') m.semaforos.push({x,y});
    else if (c === 'H') m.escudos.push({x,y});
    else if ('<>^v'.includes(c)) m.chisperos.push({ x, y, dir:{'<':'l','>':'r','^':'u','v':'d'}[c] });
  }));
  if (nivel && nivel.enemigo) {
    const [x0,y0] = nivel.enemigo.desde, [x1,y1] = nivel.enemigo.hasta, camino = [];
    const n = Math.max(Math.abs(x1-x0), Math.abs(y1-y0));
    for (let i = 0; i <= n; i++) camino.push({ x:x0 + Math.sign(x1-x0)*i, y:y0 + Math.sign(y1-y0)*i });
    m.enemigo = { camino };
  }
  return m;
}

/* ----- tableros posibles (azar) ----- */
export function hayAzar(m){ return m.guardias.some(g => g.azar) || m.lamparas.some(l => l.azar) || m.rocasAzar.length > 0 || m.semaforos.length > 0; }

export function variantes(m){
  const azar = m.guardias.map((g,i) => g.azar ? i : -1).filter(i => i >= 0);
  let lista = [{ guardias:new Set(), lamparas:new Set(), roca:m.rocasAzar.length ? 0 : -1, semaforos:[] }];
  azar.forEach(i => { lista = lista.flatMap(v => [v, { ...v, guardias:new Set([...v.guardias, i]) }]); });
  m.lamparas.forEach((l,i) => { if (l.azar) lista = lista.flatMap(v => [v, { ...v, lamparas:new Set([...v.lamparas, i]) }]); });
  if (m.rocasAzar.length) lista = lista.flatMap(v => m.rocasAzar.map((_,r) => ({ ...v, roca:r })));
  m.semaforos.forEach(() => { lista = lista.flatMap(v => [ { ...v, semaforos:[...v.semaforos, true] }, { ...v, semaforos:[...v.semaforos, false] } ]); });
  return lista;
}

export function varianteAlAzar(m){
  const guardias = new Set();
  m.guardias.forEach((g,i) => { if (g.azar && Math.random() < 0.5) guardias.add(i); });
  const lamparas = new Set();
  m.lamparas.forEach((l,i) => { if (l.azar && Math.random() < 0.5) lamparas.add(i); });
  return { guardias, lamparas, roca:m.rocasAzar.length ? Math.floor(Math.random()*m.rocasAzar.length) : -1, semaforos:m.semaforos.map(() => Math.random() < 0.5) };
}

export function posEnemigo(m, t){
  const c = m.enemigo.camino, n = c.length;
  if (n === 1) return c[0];
  const r = t % (2*(n-1));
  return c[r < n ? r : 2*(n-1) - r];
}
