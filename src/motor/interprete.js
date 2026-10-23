/* Recorre el programa paso a paso, lo evalúa y lo prueba en todos los tableros posibles. */
import { varianteAlAzar, variantes } from './mapa.js';
import { numerar } from './programa.js';
import { crearEstado, ejecutarPaso, en, ERRORES, lamparaPresente, preguntar } from './reglas.js';

/* Recorre el programa. Es perezoso: cada Si pregunta recién cuando le toca,
   con el tablero como quedó después de las instrucciones anteriores. */
export function* recorrer(lista, est, m, nums, ctx){
  for (const b of lista) {
    if (b.t === 'loop') {
      // reps: todas las repeticiones en las que está metido el bloque, de afuera hacia adentro, con su vuelta.
      for (let v = 1; v <= b.n; v++) yield* recorrer(b.cuerpo, est, m, nums, { ...ctx, rep:b, vuelta:v, reps:[...(ctx.reps || []), { id:b.id, vuelta:v, n:b.n }] });
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

/* Una corrida avanza de a un bloque. La usan Ejecutar (todo seguido), Paso (de a uno) y simular():
   así correr todo y correr paso a paso dan siempre lo mismo.
   proximo() mira qué bloque viene sin cumplirlo; paso() lo cumple y devuelve qué pasó:
   { p, pregunta:true }  un Si que hizo su pregunta (p.resultado dice sí o no)
   { p, r }              una instrucción que salió bien
   { p, r, falla:true }  una instrucción con error: la corrida termina
   { terminada:true, resultado }  no quedan bloques: resultado dice si ganó */
export function crearCorrida(prog, m, variante){
  const est = crearEstado(m, variante || varianteAlAzar(m));
  const gen = pasos(prog, est, m);
  let visto = null, terminada = false;
  return {
    est,
    get terminada(){ return terminada; },
    proximo(){
      if (terminada) return null;
      if (!visto) { const s = gen.next(); visto = s.done ? { fin:true } : { p:s.value }; }
      return visto.fin ? null : visto.p;
    },
    paso(){
      const p = this.proximo();
      if (!p) { terminada = true; return { terminada:true, resultado:evaluar(est, m) }; }
      visto = null;
      if (p.pregunta) return { p, pregunta:true };
      const r = ejecutarPaso(est, m, p.bloque);
      if (ERRORES.includes(r.tipo)) { terminada = true; return { p, r, falla:true }; }
      return { p, r };
    }
  };
}

/* Corre un programa entero de una (para comprobar todos los tableros y para pruebas). */
export function simular(prog, m, variante){
  const c = crearCorrida(prog, m, variante);
  for (;;) {
    const s = c.paso();
    if (s.falla) return { falla:s.r, paso:s.p, est:c.est };
    if (s.terminada) return { resultado:s.resultado, est:c.est };
  }
}

/* Prueba el programa en todos los tableros posibles. Devuelve el primero donde no gana, o null. */
export function probarTodas(prog, m){
  for (const v of variantes(m)) {
    const s = simular(prog, m, v);
    if (s.falla || !s.resultado.gano) return { variante:v, s };
  }
  return null;
}
