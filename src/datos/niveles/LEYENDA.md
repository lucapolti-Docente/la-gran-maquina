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
< > ^ v Chispero (tira chispas hacia ese lado, un turno sí y uno no)
enemigo: { desde:[x,y], hasta:[x,y] } es Chatarrín: va y viene en línea recta
bloques: 'mov' da las cuatro flechas; también se puede dar solo 'u','d','l','r'
Programas de ejemplo: u d l r = flechas, a = encender, p = apretar,
w = esperar, g = garrote, x3( ... ) = repetir 3 veces,
?e( ... ) = si hay enemigo enfrente, ?o( ... ) = si hay roca enfrente,
?l( ... ) = si la luz de enfrente está roja, ?b( ... ) = si hay una lámpara acá
```
