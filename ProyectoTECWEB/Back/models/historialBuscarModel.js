import db from '../db.js';

export async function guardarBusqueda(palabra, buscado_donde) {
  await db.query(
    'INSERT INTO historial_busquedas (palabra, buscado_donde) VALUES (?, ?)',
    [palabra.toLowerCase(), buscado_donde]
  );
}
export async function obtenerPalabrasMasBuscadas() {
  const [rows] = await db.query(`
    SELECT palabra, COUNT(*) as cantidad
    FROM historial_busquedas
    GROUP BY palabra
    ORDER BY cantidad DESC
    LIMIT 20
  `);
  return rows;
}
export async function buscarPorPalabrasIndividuales(frase) {
  const palabras = frase
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar tildes
    .split(/\s+/)
    .filter(p => p.length > 2); // evitar preposiciones muy cortas

  if (palabras.length === 0) return [];

  let sql = `SELECT * FROM documentos WHERE vigente = TRUE`;
  const valores = [];

  palabras.forEach(p => {
    sql += ` AND (LOWER(descripcion) COLLATE utf8mb4_general_ci LIKE ? OR LOWER(relevancia) COLLATE utf8mb4_general_ci LIKE ?)`;
    const likeTerm = `%${p}%`;
    valores.push(likeTerm, likeTerm);
  });

  const [rows] = await db.query(sql, valores);
  return rows;
}