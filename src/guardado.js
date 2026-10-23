/* Guarda progreso y preferencias en el navegador. Si no se puede (modo privado, bloqueado), el juego sigue igual.
   Formato v4: { version:4, modo, personaje, mayus, velocidad, sonido, progreso:{ facil:{nivel,hecho,ganados}, dificil:{…} } }.
   Al abrir, lo guardado con un formato viejo (v3, v2) se pasa a v4. Las claves viejas no se borran: así se puede volver atrás. */
export const CLAVE = 'gran-maquina-v4';
export const CLAVE_V3 = 'gran-maquina-v3';
export const CLAVE_V2 = 'gran-maquina-v2';

/* v3: dos dificultades; la que estaba elegida pasa a ser el modo. */
export function desdeV3(v3){
  return { version:4, modo:v3.dif || 'facil', personaje:v3.personaje, mayus:v3.mayus, velocidad:v3.velocidad, sonido:true, progreso:v3.progreso || {} };
}

/* v2: una sola lista de niveles, que pasa a Fácil. */
export function desdeV2(v2){
  return desdeV3({ personaje:v2.personaje, mayus:v2.mayus, velocidad:v2.velocidad, dif:'facil',
                   progreso:{ facil:{ nivel:v2.nivel, hecho:v2.hecho, ganados:v2.ganados } } });
}

const leerJSON = (storage, clave) => { try { const v = JSON.parse(storage.getItem(clave)); return v && typeof v === 'object' ? v : null; } catch (e) { return null; } };

/* storage: localStorage o algo que se comporte igual (los tests usan uno de mentira). */
export function crearGuardado(dameStorage){
  const storage = () => { try { return dameStorage(); } catch (e) { return null; } };
  return {
    clave:CLAVE,
    leer(){
      const s = storage(); if (!s) return {};
      const v4 = leerJSON(s, CLAVE); if (v4) return v4;
      const v3 = leerJSON(s, CLAVE_V3);
      const migrado = v3 ? desdeV3(v3) : (leerJSON(s, CLAVE_V2) ? desdeV2(leerJSON(s, CLAVE_V2)) : null);
      if (migrado) { this.escribir(migrado); return migrado; }
      return {};
    },
    escribir(datos){ try { storage().setItem(CLAVE, JSON.stringify({ ...datos, version:4 })); } catch (e) { /* sin guardado: se sigue jugando igual */ } },
    /* Para guardar otras cosas (por ejemplo, los niveles inventados) con el mismo cuidado. */
    leerClave(clave){ const s = storage(); return s ? leerJSON(s, clave) : null; },
    escribirClave(clave, datos){ try { storage().setItem(clave, JSON.stringify(datos)); return true; } catch (e) { return false; } }
  };
}

export const Guardado = crearGuardado(() => window.localStorage);
