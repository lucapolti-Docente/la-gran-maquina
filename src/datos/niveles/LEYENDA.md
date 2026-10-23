# Cómo se escribe un nivel

```
Mapas: . piso   # roca   S salida   M meta (bandera)
G engranaje para juntar   L lámpara para encender
B botón   P compuerta (se abre al apretar el botón)
E Bulón (enemigo quieto)   e Bulón que aparece al azar
o roca al azar (en cada intento aparece una sola de las marcadas)
l lámpara al azar (en cada intento puede estar o no)
T semáforo (empieza rojo o verde al azar y cambia en cada turno)
H escudo (protege de las chispas)
< > ^ v Chispero (tira chispas hacia ese lado, un turno sí y uno no; las frenan las rocas,
        las compuertas cerradas, otro Chispero, Bulón encendido y el semáforo)
enemigo: { desde:[x,y], hasta:[x,y] } es Chatarrín: va y viene en línea recta
bloques: 'mov' da las cuatro flechas; también se puede dar solo 'u','d','l','r'
Programas de ejemplo: u d l r = flechas, a = encender, p = apretar,
w = esperar, g = garrote, x3( ... ) = repetir 3 veces,
?e( ... ) = si hay enemigo enfrente, ?o( ... ) = si hay roca enfrente,
?l( ... ) = si la luz de enfrente está roja, ?b( ... ) = si hay una lámpara acá
```

En el editor (Inventá tu nivel) se pueden pintar Bulón, roca y lámpara "a veces" (`e`, `o`, `l`): se ven con un "?" en la esquina.
Si un nivel tiene alguna, pide el bloque Si, porque sin preguntar no se sabe qué salió.

## Qué revisa `npm test` en cada nivel
- La `solucion` gana en todos los tableros posibles, con los bloques del nivel y dentro del límite (`max`).
- El mapa tiene sentido (`src/motor/validar.js`, la misma revisión que usa el editor): una sola salida y una sola bandera,
  compuerta con botón, Chatarrín en línea recta sin pasar por rocas, compuertas, Chispero, Bulón, semáforo, salida ni bandera,
  y camino posible hasta la bandera y hasta cada engranaje, lámpara y botón.
- Cada nivel suma a lo sumo una cosa nueva respecto de los anteriores.
