/* Los modos que aparecen en la pantalla de inicio, en este orden.
   Cada modo es un archivo con: id, nombre, descripcion, icono(E) → SVG, avance(E) → { hechos, total } o null,
   y arrancar(app), que recibe lo que la interfaz sabe hacer (jugarNiveles, abrirEditor).
   Para sumar un modo: creá su archivo en esta carpeta y agregalo a la lista. */
import facil from './facil.js';
import dificil from './dificil.js';

export const MODOS = [facil, dificil];
