/* Herramientas comunes para dibujar en SVG. */

export const T = 100; // tamaño de casillero

export const tinta = 'stroke="#16163A" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"';

export function engranajePath(cx, cy, r, dientes){
  const pts = [], rIn = r * 0.78, paso = Math.PI * 2 / dientes;
  for (let i = 0; i < dientes; i++) {
    const a = i * paso;
    [[rIn,a],[r,a+paso*0.15],[r,a+paso*0.45],[rIn,a+paso*0.6]].forEach(([rr,aa]) =>
      pts.push((cx + rr*Math.cos(aa)).toFixed(1) + ' ' + (cy + rr*Math.sin(aa)).toFixed(1)));
  }
  return 'M' + pts.join(' L') + ' Z';
}

export const suelto = contenido => '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+contenido+'</svg>';

export const enCelda = (x, y, contenido, clase) => '<svg x="'+x*T+'" y="'+y*T+'" width="100" height="100" viewBox="0 0 100 100"'+(clase ? ' class="'+clase+'"' : '')+'>'+contenido+'</svg>';
