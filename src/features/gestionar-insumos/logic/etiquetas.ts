export const normalizar = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

/** Distancia de Levenshtein (cuántas ediciones separan dos textos). */
function distancia(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      const costo = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + costo);
    }
    prev = curr;
  }
  return prev[b.length];
}

/** Puntaje de cercanía entre lo escrito y una etiqueta (0 = no se parecen). */
function puntaje(consulta: string, etiqueta: string): number {
  const tag = normalizar(etiqueta);
  if (tag === consulta) return 100;
  if (tag.startsWith(consulta)) return 90;
  const palabras = tag.split(' ');
  if (palabras.some((p) => p.startsWith(consulta))) return 80;
  if (tag.includes(consulta)) return 70;

  // Tolerancia a errores de tipeo ("marizcos" → "Mariscos")
  if (consulta.length >= 3) {
    const tolerancia = Math.max(1, Math.floor(consulta.length / 4));
    const mejor = Math.min(
      distancia(consulta, tag),
      distancia(consulta, tag.slice(0, consulta.length)),
      ...palabras.map((p) => distancia(consulta, p)),
    );
    if (mejor <= tolerancia) return 50 - mejor;
  }
  return 0;
}

/**
 * Devuelve las etiquetas del catálogo más cercanas a lo escrito
 * (excluye las ya elegidas). Con texto vacío devuelve el catálogo en orden alfabético.
 */
export function sugerirEtiquetas(
  texto: string,
  catalogo: string[],
  seleccionadas: string[] = [],
  limite = 6,
): string[] {
  const consulta = normalizar(texto);
  const elegidas = new Set(seleccionadas.map(normalizar));
  const disponibles = catalogo.filter((t) => !elegidas.has(normalizar(t)));

  if (!consulta) {
    return [...disponibles].sort((a, b) => a.localeCompare(b, 'es')).slice(0, limite);
  }

  return disponibles
    .map((tag) => ({ tag, score: puntaje(consulta, tag) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.tag.localeCompare(b.tag, 'es'))
    .slice(0, limite)
    .map((x) => x.tag);
}

/** Devuelve la etiqueta del catálogo idéntica a `texto` (ignorando tildes/mayúsculas). */
export const buscarExacta = (texto: string, catalogo: string[]) => {
  const consulta = normalizar(texto);
  return catalogo.find((t) => normalizar(t) === consulta);
};