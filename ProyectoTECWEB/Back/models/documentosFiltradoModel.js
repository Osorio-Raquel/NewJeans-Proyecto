import db from '../db.js';

export async function obtenerPalabrasFrecuentes() {
  const [rows] = await db.query(
    `SELECT descripcion, relevancia FROM documentos WHERE vigente = TRUE`
  );

  const textoTotal = rows.map(row => `${row.descripcion} ${row.relevancia}`).join(' ').toLowerCase();

  const sinTildes = textoTotal.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const palabras = sinTildes.split(/\W+/).filter(p => p.length > 3 && !stopwords.includes(p));

  const conteo = {};

  palabras.forEach(p => {
    conteo[p] = (conteo[p] || 0) + 1;
  });

  const resultado = Object.entries(conteo)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20) // top 20 palabras
    .map(([palabra, cantidad]) => ({ palabra, cantidad }));

  return resultado;
}

const stopwords = [
  'para', 'con', 'esta', 'este', 'desde', 'donde', 'sobre', 'entre',
  'como', 'pero', 'ademas', 'tambien', 'todos', 'todas', 'segun', 'cada',
  'puede', 'debe', 'haber', 'aqui', 'alli', 'porque', 'cuando', 'ellos',
  'ellas', 'los', 'las', 'por', 'del', 'que', 'una', 'unos', 'unas'
];
