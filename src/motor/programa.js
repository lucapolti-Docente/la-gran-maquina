/* Los bloques del programa: crearlos, numerarlos y leer programas escritos como texto ("r r x3(d)"). */

let contador = 0;

export const nuevoId = () => 'b' + (++contador);

/* ----- bloques y programas ----- */
export function nuevoBloque(tipo, extra){
  if (tipo === 'loop') return { id:nuevoId(), t:'loop', n:(extra||3), cuerpo:[] };
  if (tipo === 'si') return { id:nuevoId(), t:'si', cond:(extra||'enemigo'), cuerpo:[] };
  if (tipo === 'mov') return { id:nuevoId(), t:'mov', d:extra };
  return { id:nuevoId(), t:tipo };
}

export function leerPrograma(texto){
  const raiz = [], pila = [raiz];
  const cond = { e:'enemigo', o:'roca', l:'roja', b:'lampara' };
  const simple = { a:'act', p:'btn', w:'esperar', g:'garrote' };
  (texto.match(/x\d\(|\?[eolb]\(|\)|[udlrapwg]/g) || []).forEach(t => {
    const actual = pila[pila.length-1];
    if (t[0] === 'x') { const b = nuevoBloque('loop', parseInt(t.slice(1),10)); actual.push(b); pila.push(b.cuerpo); }
    else if (t[0] === '?') { const b = nuevoBloque('si', cond[t[1]]); actual.push(b); pila.push(b.cuerpo); }
    else if (t === ')') pila.pop();
    else if (simple[t]) actual.push(nuevoBloque(simple[t]));
    else actual.push(nuevoBloque('mov', t));
  });
  return raiz;
}

export function numerar(prog){
  const nums = {}; let n = 0;
  const rec = lista => lista.forEach(b => { nums[b.id] = ++n; if (b.cuerpo) rec(b.cuerpo); });
  rec(prog);
  return nums;
}

export function contarBloques(prog){ return prog.reduce((s,b) => s + 1 + (b.cuerpo ? contarBloques(b.cuerpo) : 0), 0); }
