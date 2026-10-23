/* Atajos para la pantalla: buscar elementos, íconos y el cuadro de mensajes. */

export const $ = id => document.getElementById(id);

export const ICONOS = {
  u:'<path d="M12 20V5M5 12l7-7 7 7"/>', d:'<path d="M12 4v15M5 12l7 7 7-7"/>',
  l:'<path d="M20 12H5M12 5l-7 7 7 7"/>', r:'<path d="M4 12h15M12 5l7 7-7 7"/>',
  act:'<path class="lleno" d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  btn:'<path d="M3 20h18M5 20v-4h14v4"/><path class="lleno" d="M7 16a5 5 0 0 1 10 0z"/><path d="M12 3v5M9 6l3 3 3-3"/>',
  loop:'<path d="M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4"/>',
  si:'<path d="M8 8a4 4 0 1 1 6 3.5c-1.2.7-2 1.5-2 3V16"/><circle class="lleno" cx="12" cy="20.5" r="1.6"/>',
  esperar:'<path d="M6 2h12M6 22h12M7 2c0 6 10 6 10 10S7 16 7 22M17 2c0 6-10 6-10 10s10 4 10 10"/>',
  garrote:'<path d="M5 19L15 9"/><rect x="13" y="3" width="8" height="8" rx="2" transform="rotate(45 17 7)"/><path class="lleno" d="M8 2l-3 5h3l-2 4 5-6H8z"/>',
  enemigo:'<rect x="5" y="7" width="14" height="12" rx="2"/><path d="M12 7V3M9 11v1M15 11v1M9 15h6"/>',
  roca:'<path d="M3 19l3-9 6-5 6 3 3 11z"/>',
  lampara:'<circle cx="12" cy="9" r="6"/><path d="M9 18h6M10 22h4M12 15v3"/>',
  roja:'<rect x="8" y="2" width="8" height="20" rx="3"/><circle cx="12" cy="7.5" r="2.6" fill="#FF3B3B" stroke="none"/><circle cx="12" cy="16.5" r="2.6"/>',
  play:'<path class="lleno" d="M6 4l14 8-14 8z"/>', pausa:'<rect class="lleno" x="5" y="4" width="5" height="16" rx="1"/><rect class="lleno" x="14" y="4" width="5" height="16" rx="1"/>', stop:'<rect class="lleno" x="5" y="5" width="14" height="14" rx="2"/>'
};

export const ico = k => '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">'+ICONOS[k]+'</svg>';

/* ----- mensajes ----- */
export function mensaje(tipo, titulo, texto, extra){
  const m = $('mensaje');
  m.className = tipo || '';
  m.innerHTML = (titulo ? '<p class="titulo">'+titulo+'</p>' : '') + (texto ? '<p>'+texto+'</p>' : '') + (extra || '');
}
