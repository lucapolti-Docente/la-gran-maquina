import tuerca from './tuerca.js';
import pila from './pila.js';
import coco from './coco.js';
import mango from './mango.js';
import cerdo from './cerdo.js';
import calabacin from './calabacin.js';
import suricato from './suricato.js';

/* Orden en que aparecen en Configuración. El primero es el que se usa si no hay nada guardado.

   Para sumar un personaje: copiá uno de estos archivos, cambiale id y nombre, dibujalo
   (SVG de 100×100) y agregalo a esta lista.

   Para un dibujo de un chico o una chica: guardá la foto del dibujo en datos/personajes/imagenes/
   y, en lugar de svg, usá imagen:
     import foto from './imagenes/juana.png';
     export default { id:'juana', nombre:'Robotina', autor:'Juana, 4.° B', imagen:foto };
   Vite mete la imagen adentro del HTML de la versión pendrive, así que funciona sin internet.
   El dibujo se muestra tal cual, sin recortar ni deformar, y no se espeja al girar. */
export const PERSONAJES = [ tuerca, pila, coco, mango, cerdo, calabacin, suricato ];
