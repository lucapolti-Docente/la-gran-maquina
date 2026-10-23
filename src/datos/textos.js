/* Textos del juego: en español rioplatense, con voseo, frases cortas y sin retar.
   Los textos de cada nivel (título, intro y dato) están en datos/niveles/.
   Los de "Cómo jugar" y los botones fijos están en index.html. */

/* ----- nombres de los bloques ----- */
export const NOMBRE_DIR = { u:'arriba', d:'abajo', l:'izquierda', r:'derecha' };
export const NOMBRE_BLOQUE = { act:'encender', btn:'apretar', esperar:'esperar', garrote:'garrote' };
export const nombreBloque = b => b.t === 'mov' ? NOMBRE_DIR[b.d] : NOMBRE_BLOQUE[b.t];

/* ----- preguntas del bloque Si ----- */
export const PREGUNTAS = {
  enemigo:{ corto:'enemigo', largo:'¿Hay un enemigo enfrente?' },
  roja:{ corto:'luz roja', largo:'¿La luz de enfrente está roja?' },
  lampara:{ corto:'lámpara', largo:'¿Hay una lámpara acá?' },
  roca:{ corto:'roca', largo:'¿Hay una roca enfrente?' }
};

/* ----- cuando algo falla: qué pasó y una ayuda corta para arreglarlo ----- */
export const FALLAS = {
  roca:{
    que:'chocaste con una roca.',
    ayuda:'Fijate qué flecha tenía que ir en ese lugar.' },
  afuera:{
    que:'te saliste del tablero.',
    ayuda:'Contá los casilleros y revisá esa flecha.' },
  nadaQueEncender:{
    que:'acá no hay ninguna lámpara para encender.',
    ayuda:'Encender funciona solo parado sobre una lámpara.' },
  compuerta:{
    que:'la compuerta está cerrada.',
    ayuda:'Primero parate sobre el botón y apretalo.' },
  nadaQueApretar:{
    que:'acá no hay ningún botón para apretar.',
    ayuda:'Apretar funciona solo parado sobre el botón.' },
  enemigo:{
    que:'¡te atrapó Chatarrín!',
    ayuda:'Chatarrín avanza un casillero con cada instrucción. Mirá dónde va a estar y buscá otro camino o esperá.' },
  guardia:{
    que:'chocaste con Bulón.',
    ayuda:'Si hay un enemigo enfrente, usá el garrote antes de avanzar.' },
  chispa:{
    que:'¡te alcanzó una chispa de Chispero!',
    ayuda:'Agarrá el escudo o apagá a Chispero con el garrote.' },
  chispero:{
    que:'chocaste con Chispero.',
    ayuda:'Chispero no se puede atravesar. Rodealo.' },
  luzRoja:{
    que:'pasaste con la luz roja.',
    ayuda:'Si la luz está roja, esperá un turno: el semáforo cambia en cada turno.' },
  garroteVacio:{
    que:'no había ningún enemigo enfrente para el garrote.',
    ayuda:'Usá Si para preguntar antes de usar el garrote.' }
};

/* ----- lo que se agrega al mensaje cuando una instrucción sale bien ----- */
export const LOGROS = {
  engranaje:' ¡Juntaste un engranaje!',
  encendida:' ¡Lámpara encendida!',
  yaEncendida:' Esa lámpara ya estaba encendida.',
  apretado:' ¡Se abrió la compuerta!',
  yaApretado:' La compuerta ya estaba abierta.',
  escudo:' ¡Agarraste el escudo!',
  espera:' Te quedaste quieto un turno.'
};

/* ----- pantalla final ----- */
export const FINAL = {
  saltado:{
    titulo:'¡Genial, llegaste al final!',
    texto:avance => 'Saltaste algunos niveles, así que '+avance+'. Podés volver a intentarlo sin saltar niveles.',
    avance:{ facil:'la máquina todavía no funciona', dificil:'el robot todavía no se mueve' }
  },
  ganado:{
    titulo:{ facil:'¡La Gran Máquina funciona!', dificil:'¡El Gran Robot cobró vida!' },
    texto:{
      facil:n => 'Programaste los '+n+' niveles. ¡Sos una gran programadora o un gran programador!',
      dificil:n => 'Ganaste los '+n+' niveles difíciles: secuencias, repeticiones y preguntas con Si. ¡Programás como una persona experta!'
    }
  },
  faltan:nums => (nums.length === 1 ? 'Te falta el nivel '+nums[0] : 'Te faltan los niveles '+nums.slice(0,-1).join(', ')+' y '+nums[nums.length-1]) + '.'
};

/* ----- revisar un nivel (editor y tests): qué falta, corto y sin retar ----- */
const QUE = { roca:'una roca', compuerta:'una compuerta', chispero:'Chispero', bulon:'Bulón', semaforo:'un semáforo', salida:'la salida', bandera:'la bandera' };
export const VALIDACION = {
  mapaVacio:() => 'El tablero está vacío.',
  noRectangular:() => 'Todas las filas tienen que tener el mismo largo.',
  letraDesconocida:() => 'Hay un casillero con una letra que el juego no conoce.',
  faltaSalida:() => 'Falta la salida: poné una.',
  variasSalidas:() => 'Hay más de una salida: dejá una sola.',
  faltaBandera:() => 'Falta la bandera: poné una.',
  variasBanderas:() => 'Hay más de una bandera: dejá una sola.',
  compuertaSinBoton:() => 'Hay una compuerta: poné un botón para abrirla.',
  botonSinCompuerta:() => 'Hay un botón: poné una compuerta para que abra.',
  bloqueDesconocido:p => 'Hay un bloque que el juego no conoce: '+p.bloques.join(', ')+'.',
  sinFlechas:() => 'Elegí al menos una flecha para poder moverse.',
  maxInvalido:() => 'El límite de bloques tiene que ser 1 o más.',
  lamparaSinEncender:() => 'Hay lámparas: sumá el bloque Encender.',
  compuertaSinApretar:() => 'Hay una compuerta: sumá el bloque Apretar.',
  chatarrinSinRecorrido:() => 'Marcá dónde empieza y dónde termina Chatarrín.',
  chatarrinNoRecto:() => 'Chatarrín va en línea recta: marcá el final en la misma fila o columna.',
  chatarrinAfuera:() => 'El camino de Chatarrín se sale del tablero.',
  chatarrinPisa:p => 'Chatarrín no puede pasar por '+QUE[p.que]+'.',
  chispaAtraviesa:p => 'Las chispas de Chispero no pueden atravesar a '+QUE[p.que]+'.',
  banderaInalcanzable:() => 'No hay camino hasta la bandera.',
  cosasInalcanzables:() => 'Hay cosas a las que no se puede llegar.'
};
