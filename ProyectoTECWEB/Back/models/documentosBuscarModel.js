import db from '../db.js';

export async function buscarDocumentosDB(filtros) {
  const { nombre, tipo, anio, fuente, palabra } = filtros;
  let sql = `SELECT * FROM documentos WHERE vigente = TRUE`;
  const valores = [];

  if (nombre) {
    sql += ` AND LOWER(descripcion) COLLATE utf8mb4_general_ci LIKE ?`;
    valores.push(`%${nombre.toLowerCase()}%`);
  }

  if (tipo) {
    sql += ` AND tipo = ?`; // tipo es ENUM, así que match exacto
    valores.push(tipo);
  }

  if (anio) {
    sql += ` AND anio = ?`;
    valores.push(anio);
  }

  if (fuente) {
    sql += ` AND LOWER(fuente) COLLATE utf8mb4_general_ci LIKE ?`;
    valores.push(`%${fuente.toLowerCase()}%`);
  }

  if (palabra) {
    sql += ` AND (
      LOWER(descripcion) COLLATE utf8mb4_general_ci LIKE ? OR
      LOWER(relevancia) COLLATE utf8mb4_general_ci LIKE ?
    )`;
    const palabraLower = `%${palabra.toLowerCase()}%`;
    valores.push(palabraLower, palabraLower);
  }

  const [rows] = await db.query(sql, valores);
  return rows; // ¡devuelve los textos tal como están escritos con sus tildes!
}

