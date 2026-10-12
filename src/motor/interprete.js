/* Recorre el programa paso a paso, lo evalúa y lo prueba en todos los tableros posibles. */
import { varianteAlAzar, variantes } from './mapa.js';
import { numerar } from './programa.js';
import { crearEstado, ejecutarPaso, en, ERRORES, lamparaPresente, preguntar } from './reglas.js';

/* Recorre el programa. Es perezoso: cada Si pregunta recién cuando le toca,
   con el tablero como quedó después de las instrucciones anteriores. */
export function* recorrer(lista, est, m, nums, ctx){
  for (const b of lista) {
    if (b.t === 'loop') {
      for (let v = 1; v <= b.n; v++) yield* recorrer(b.cuerpo, est, m, nums, { ...ctx, rep:b, vuelta:v });
    } else if (b.t === 'si') {
      const resultado = preguntar(est, m, b.cond);
      yield { bloque:b, num:nums[b.id], ...ctx, pregunta:true, resultado };
      if (resultado) yield* recorrer(b.cuerpo, est, m, nums, { ...ctx, si:b });
    } else yield { bloque:b, num:nums[b.id], ...ctx };
  }
}

export function pasos(prog, est, m){ return recorrer(prog, est, m, numerar(prog), {}); }

export function evaluar(est, m){
  const enMeta = est.x === m.meta.x && est.y === m.meta.y;
  const faltanEngranajes = m.engranajes.length - est.juntados.size;
  const faltanLamparas = m.lamparas.filter((l,i) => lamparaPresente(est, m, i) && !est.encendidas.has(i)).length;
  return { gano: enMeta && !faltanEngranajes && !faltanLamparas, enMeta, faltanEngranajes, faltanLamparas };
}

/* Corre un programa entero de una (para comprobar todos los tableros y para pruebas). */
export function simular(prog, m, variante){
  const est = crearEstado(m, variante || varianteAlAzar(m));
  for (const p of pasos(prog, est, m)) {
    if (p.pregunta) continue;
    const r = ejecutarPaso(est, m, p.bloque);
    if (ERRORES.includes(r.tipo)) return { falla:r, paso:p, est };
  }
  return { resultado:evaluar(est, m), est };
}

/* Prueba el programa en todos los tableros posibles. Devuelve el primero donde no gana, o null. */
export function probarTodas(prog, m){
  for (const v of variantes(m)) {
    const s = simular(prog, m, v);
    if (s.falla || !s.resultado.gano) return { variante:v, s };
  }
  return null;
}
