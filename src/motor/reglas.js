/* Las reglas del tablero: qué pasa con cada instrucción, cómo se mueven los enemigos y qué responde cada pregunta del Si. */
import { k, posEnemigo } from './mapa.js';

export const DIRS = { u:[0,-1], d:[0,1], l:[-1,0], r:[1,0] };

export const ERRORES = ['roca','afuera','compuerta','enemigo','guardia','chispa','chispero','luzRoja','garroteVacio','nadaQueEncender','nadaQueApretar'];

export const ACCIONES = ['mov','act','btn','esperar','garrote'];

/* ----- estado del tablero ----- */
export function crearEstado(m, variante){
  return { x:m.inicio.x, y:m.inicio.y, mira:'r', dir:'r', t:0, variante:variante || null,
           juntados:new Set(), encendidas:new Set(), abiertas:false, escudo:false, apagados:new Set(),
           enemigo:m.enemigo ? posEnemigo(m, 0) : null, rastro:[k(m.inicio.x, m.inicio.y)] };
}

export const en = (lista, x, y) => lista.findIndex(p => p.x === x && p.y === y);

export function rocaEn(est, m, x, y){
  if (m.rocas.has(k(x,y))) return true;
  const v = est.variante;
  return !!(v && v.roca >= 0 && m.rocasAzar[v.roca].x === x && m.rocasAzar[v.roca].y === y);
}

export function guardiaEn(est, m, x, y){
  return m.guardias.findIndex((g,i) => g.x === x && g.y === y && !est.apagados.has('g'+i) && (!g.azar || (est.variante && est.variante.guardias.has(i))));
}

export function chisperoEn(m, x, y){ return en(m.chisperos, x, y); }

export const lamparaPresente = (est, m, i) => !m.lamparas[i].azar || !!(est.variante && est.variante.lamparas.has(i));

export function lamparaEn(est, m, x, y){ return m.lamparas.findIndex((l,i) => l.x === x && l.y === y && lamparaPresente(est, m, i)); }

export function chatarrinActivo(est, m){ return !!m.enemigo && !est.apagados.has('c'); }

/* El semáforo empieza rojo o verde (según el tablero) y cambia en cada turno. */
export function semaforoRojo(est, i){ return !!est.variante && (est.variante.semaforos[i] !== (est.t % 2 === 1)); }

export function chisperoActivo(est, i){ return !est.apagados.has('k'+i) && est.t % 2 === 0; }

export function celdasDeChispas(est, m, i){
  const c = m.chisperos[i], [dx,dy] = DIRS[c.dir], celdas = [];
  let x = c.x + dx, y = c.y + dy;
  while (x >= 0 && y >= 0 && x < m.ancho && y < m.alto && !rocaEn(est, m, x, y) && chisperoEn(m, x, y) < 0 && guardiaEn(est, m, x, y) < 0 && en(m.semaforos, x, y) < 0 && !(!est.abiertas && en(m.compuertas, x, y) >= 0)) {
    celdas.push({x,y}); x += dx; y += dy;
  }
  return celdas;
}

export function enChispas(est, m){
  return m.chisperos.some((c,i) => chisperoActivo(est, i) && celdasDeChispas(est, m, i).some(p => p.x === est.x && p.y === est.y));
}

export function frente(est){ const [dx,dy] = DIRS[est.dir]; return { x:est.x + dx, y:est.y + dy }; }

export function preguntar(est, m, cond){
  const f = frente(est);
  if (cond === 'enemigo') {
    if (guardiaEn(est, m, f.x, f.y) >= 0) return true;
    if (chatarrinActivo(est, m) && est.enemigo.x === f.x && est.enemigo.y === f.y) return true;
    const c = chisperoEn(m, f.x, f.y);
    return c >= 0 && !est.apagados.has('k'+c);
  }
  if (cond === 'roca') return rocaEn(est, m, f.x, f.y);
  if (cond === 'roja') { const s = en(m.semaforos, f.x, f.y); return s >= 0 && semaforoRojo(est, s); }
  if (cond === 'lampara') return lamparaEn(est, m, est.x, est.y) >= 0;
  return false;
}

/* La instrucción en sí, sin contar a los enemigos que se mueven. */
export function cumplir(est, m, b){
  if (b.t === 'mov') {
    const [dx,dy] = DIRS[b.d];
    const nx = est.x + dx, ny = est.y + dy;
    est.dir = b.d;
    if (b.d === 'l' || b.d === 'r') est.mira = b.d;
    if (nx < 0 || ny < 0 || nx >= m.ancho || ny >= m.alto) return { tipo:'afuera', x:nx, y:ny };
    if (rocaEn(est, m, nx, ny)) return { tipo:'roca', x:nx, y:ny };
    if (chisperoEn(m, nx, ny) >= 0) return { tipo:'chispero', x:nx, y:ny };
    if (!est.abiertas && en(m.compuertas, nx, ny) >= 0) return { tipo:'compuerta', x:nx, y:ny };
    if (guardiaEn(est, m, nx, ny) >= 0) return { tipo:'guardia', x:nx, y:ny };
    const s = en(m.semaforos, nx, ny);
    if (s >= 0 && semaforoRojo(est, s)) return { tipo:'luzRoja', x:nx, y:ny };
    est.x = nx; est.y = ny; est.rastro.push(k(nx,ny));
    if (!est.escudo && en(m.escudos, nx, ny) >= 0) { est.escudo = true; return { tipo:'escudo' }; }
    const g = en(m.engranajes, nx, ny);
    if (g >= 0 && !est.juntados.has(g)) { est.juntados.add(g); return { tipo:'engranaje' }; }
    return { tipo:'mov' };
  }
  if (b.t === 'act') {
    const l = lamparaEn(est, m, est.x, est.y);
    if (l < 0) return { tipo:'nadaQueEncender' };
    if (est.encendidas.has(l)) return { tipo:'yaEncendida' };
    est.encendidas.add(l); return { tipo:'encendida' };
  }
  if (b.t === 'btn') {
    if (en(m.botones, est.x, est.y) < 0) return { tipo:'nadaQueApretar' };
    if (est.abiertas) return { tipo:'yaApretado' };
    est.abiertas = true; return { tipo:'apretado' };
  }
  if (b.t === 'esperar') return { tipo:'espera' };
  if (b.t === 'garrote') {
    const f = frente(est);
    const g = guardiaEn(est, m, f.x, f.y);
    if (g >= 0) { est.apagados.add('g'+g); return { tipo:'apagado', quien:'Bulón' }; }
    if (chatarrinActivo(est, m) && est.enemigo.x === f.x && est.enemigo.y === f.y) { est.apagados.add('c'); return { tipo:'apagado', quien:'Chatarrín' }; }
    const c = chisperoEn(m, f.x, f.y);
    if (c >= 0 && !est.apagados.has('k'+c)) { est.apagados.add('k'+c); return { tipo:'apagado', quien:'Chispero' }; }
    return { tipo:'garroteVacio', x:f.x, y:f.y };
  }
  return { tipo:'mov' };
}

/* Cumple una acción, pasa un turno y mueve a los enemigos. Devuelve qué pasó; no escribe textos. */
export function ejecutarPaso(est, m, b){
  const antes = { x:est.x, y:est.y };
  const r = cumplir(est, m, b);
  if (ERRORES.includes(r.tipo)) return r;
  est.t++;
  if (chatarrinActivo(est, m)) {
    const eAntes = est.enemigo;
    est.enemigo = posEnemigo(m, est.t);
    const entraDondeEstaba = eAntes.x === est.x && eAntes.y === est.y && (antes.x !== est.x || antes.y !== est.y);
    if (entraDondeEstaba) {
      // Quiso entrar al casillero de Chatarrín: no entra y Chatarrín se queda ahí, para que se vean los dos.
      est.x = antes.x; est.y = antes.y; est.rastro.pop(); est.enemigo = eAntes;
      return { tipo:'enemigo', x:eAntes.x, y:eAntes.y };
    }
    if (est.enemigo.x === est.x && est.enemigo.y === est.y) { est.enemigo = eAntes; return { tipo:'enemigo', x:est.x, y:est.y }; }
  }
  if (!est.escudo && enChispas(est, m)) return { tipo:'chispa', x:est.x, y:est.y };
  return r;
}
