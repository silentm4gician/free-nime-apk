export function extractUrlId(url) {
  // Verificar que la URL sea una cadena de texto
  if (typeof url !== 'string') {
    return '';
  }

  // Eliminar barras al final si existen
  const cleanUrl = url.replace(/\/+$/, '');

  // Dividir la URL por '/' y obtener el último segmento
  const segments = cleanUrl.split('/');
  const lastSegment = segments[segments.length - 1];

  return lastSegment;
}

export function extractContentName(url) {
  // Usar una expresión regular para encontrar el texto que viene después de "/ver/"
  const match = url.match(/\/ver\/([^"]+)/);

  // Devolver solo el grupo capturado (lo que viene después de "/ver/") si se encontró un match
  return match ? match[1] : '';
}
