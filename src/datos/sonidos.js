/* Sonidos del juego: cortos, suaves y sin archivos (se arman con el navegador, así funcionan sin internet).
   Cada sonido es una lista de notas: f = frecuencia (Hz), hasta = frecuencia final (para que suba o baje),
   t = cuándo empieza (segundos), d = cuánto dura, onda = sine | triangle | square, vol = volumen (0 a 1). */
export const SONIDOS = {
  tecla:     [{ f:660, d:.03, onda:'sine', vol:.05 }],                                   // tocar un bloque o pintar
  mover:     [{ f:420, hasta:470, d:.05, onda:'triangle', vol:.07 }],                    // un paso
  pregunta:  [{ f:600, d:.05, onda:'sine', vol:.06 }, { f:760, t:.06, d:.06, onda:'sine', vol:.06 }],
  esperar:   [{ f:520, d:.04, onda:'sine', vol:.05 }, { f:390, t:.12, d:.04, onda:'sine', vol:.05 }], // tic… tac
  engranaje: [{ f:880, d:.06, onda:'triangle', vol:.08 }, { f:1320, t:.05, d:.08, onda:'triangle', vol:.06 }],
  encender:  [{ f:520, hasta:1040, d:.18, onda:'sine', vol:.09 }],                       // se prende: sube
  apretar:   [{ f:300, d:.04, onda:'square', vol:.04 }, { f:440, hasta:660, t:.06, d:.16, onda:'triangle', vol:.07 }], // clic y se abre
  escudo:    [{ f:700, hasta:1100, d:.22, onda:'sine', vol:.07 }],
  garrote:   [{ f:900, hasta:220, d:.18, onda:'square', vol:.04 }],                      // zap: el enemigo se apaga
  choque:    [{ f:180, hasta:120, d:.16, onda:'triangle', vol:.12 }],                    // roca, borde, compuerta: un "bonk" suave
  golpe:     [{ f:240, hasta:150, d:.12, onda:'square', vol:.05 }, { f:160, t:.1, d:.14, onda:'triangle', vol:.1 }],
  falta:     [{ f:520, d:.12, onda:'sine', vol:.07 }, { f:440, t:.14, d:.18, onda:'sine', vol:.07 }], // terminó sin ganar
  aviso:     [{ f:330, d:.1, onda:'sine', vol:.07 }],                                    // programa vacío, límite, nivel con problemas
  ganar:     [{ f:523, d:.1, onda:'triangle', vol:.08 }, { f:659, t:.1, d:.1, onda:'triangle', vol:.08 },
              { f:784, t:.2, d:.22, onda:'triangle', vol:.09 }],
  final:     [{ f:523, d:.12, onda:'triangle', vol:.08 }, { f:659, t:.12, d:.12, onda:'triangle', vol:.08 },
              { f:784, t:.24, d:.12, onda:'triangle', vol:.08 }, { f:1047, t:.36, d:.4, onda:'triangle', vol:.09 }]
};

/* Qué sonido va con cada cosa que devuelve el motor al cumplir una instrucción. */
export const SONIDO_DE = {
  mov:'mover', engranaje:'engranaje', encendida:'encender', yaEncendida:'mover', apretado:'apretar', yaApretado:'mover',
  espera:'esperar', escudo:'escudo', apagado:'garrote',
  roca:'choque', afuera:'choque', compuerta:'choque', chispero:'choque', luzRoja:'choque', garroteVacio:'choque',
  nadaQueEncender:'choque', nadaQueApretar:'choque', enemigo:'golpe', guardia:'golpe', chispa:'golpe'
};
