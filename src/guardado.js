/* Guarda progreso y preferencias en el navegador. Si no se puede (modo privado, bloqueado), el juego sigue igual. */
export const Guardado = {
  clave:'gran-maquina-v3', // v3: dos dificultades
  leer(){
    try {
      const v3 = JSON.parse(localStorage.getItem(this.clave));
      if (v3) return v3;
      const v2 = JSON.parse(localStorage.getItem('gran-maquina-v2')); // progreso anterior: pasa a Fácil
      if (v2) return { personaje:v2.personaje, mayus:v2.mayus, velocidad:v2.velocidad, dif:'facil',
                       progreso:{ facil:{ nivel:v2.nivel, hecho:v2.hecho, ganados:v2.ganados } } };
    } catch (e) { /* sin guardado */ }
    return {};
  },
  escribir(datos){ try { localStorage.setItem(this.clave, JSON.stringify(datos)); } catch (e) { /* sin guardado: se sigue jugando igual */ } }
};
