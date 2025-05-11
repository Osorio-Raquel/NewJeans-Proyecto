import db from '../db.js';

// Lista ampliada y normalizada de stopwords comunes en español
const stopwords = new Set([
  'para', 'con', 'esta', 'este', 'desde', 'donde', 'sobre', 'entre',
  'como', 'pero', 'ademas', 'tambien', 'todos', 'todas', 'segun', 'cada',
  'puede', 'debe', 'haber', 'aqui', 'alli', 'porque', 'cuando', 'ellos',
  'ellas', 'los', 'las', 'por', 'del', 'que', 'una', 'unos', 'unas',
  'ante', 'bajo', 'cabe', 'contra', 'durante', 'mediante', 'tras', 'hacia',
  'hasta', 'aunque', 'mientras', 'siendo', 'fueron', 'fue', 'son', 'ser', 'nosotros'
]);

export async function obtenerPalabrasFrecuentes() {
  const [rows] = await db.query(
    `SELECT descripcion, relevancia FROM documentos WHERE vigente = TRUE`
  );

  if (!rows || rows.length === 0) return [];

  // Unir textos y pasarlos a minúsculas
  const textoTotal = rows.map(row => `${row.descripcion || ''} ${row.relevancia || ''}`).join(' ').toLowerCase();

  // Eliminar tildes y caracteres diacríticos
  const sinTildes = textoTotal.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Dividir el texto en palabras, filtrando vacíos, cortas y stopwords
  const palabras = sinTildes.split(/\W+/).filter(p => p.length > 3 && !stopwords.has(p));

  const conteo = {};
  for (const p of palabras) {
    conteo[p] = (conteo[p] || 0) + 1;
  }

  // Ordenar por frecuencia y devolver las 20 más comunes
  return Object.entries(conteo)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([palabra, cantidad]) => ({ palabra, cantidad }));
}
