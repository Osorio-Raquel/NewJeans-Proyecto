import snowball from 'snowball-stemmers';

const stopwords = [
  'para', 'con', 'esta', 'este', 'desde', 'donde', 'sobre', 'entre',
  'como', 'pero', 'ademas', 'tambien', 'todos', 'todas', 'segun', 'cada',
  'puede', 'debe', 'haber', 'aqui', 'alli', 'porque', 'cuando', 'ellos',
  'ellas', 'los', 'las', 'por', 'del', 'que', 'una', 'unos', 'unas',
  'el', 'la', 'y', 'de', 'en', 'al', 'es', 'son', 'se', 'lo', 'su', 'sus'
];

function quitarTildes(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export async function obtenerPalabrasFrecuentes(db) {
  const [rows] = await db.query(
    `SELECT descripcion, relevancia FROM documentos WHERE vigente = TRUE`
  );

  const stemmer = snowball.newStemmer('spanish'); // 💥 esta es la clave
  const conteo = {};

  rows.forEach(row => {
    const texto = `${row.descripcion || ''} ${row.relevancia || ''}`;
    const limpio = quitarTildes(texto);
    const palabras = limpio.split(/\W+/);

    palabras.forEach(p => {
      if (p.length > 3 && !stopwords.includes(p)) {
        const raiz = stemmer.stem(p);
        conteo[raiz] = (conteo[raiz] || 0) + 1;
      }
    });
  });

  const resultado = Object.entries(conteo)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([palabra, cantidad]) => ({ palabra, cantidad }));

  return resultado;
}
