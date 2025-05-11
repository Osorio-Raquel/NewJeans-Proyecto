import db from '../db.js';

export async function buscarDocumentosDB(filtros) {
  const { nombre, tipo, anio, fuente, palabra } = filtros;
  let sql = `SELECT * FROM documentos WHERE vigente = TRUE`;
  const valores = [];

  // Lista de tipos válidos según tu ENUM en la base de datos
  const tiposValidos = ['ley', 'decreto', 'resolucion', 'circular', 'reglamento', 'otro', 'norma', 'programa', 'resolucion_municipal'];

  // Filtro por nombre
  if (nombre && typeof nombre === 'string') {
    sql += ` AND LOWER(descripcion) COLLATE utf8mb4_general_ci LIKE ?`;
    valores.push(`%${nombre.toLowerCase()}%`);
  }

  // Filtro por tipo (validado)
  if (tipo && tiposValidos.includes(tipo)) {
    sql += ` AND tipo = ?`;
    valores.push(tipo);
  }

  // Filtro por año (convertido a número seguro)
  const anioNum = parseInt(anio);
  if (!isNaN(anioNum)) {
    sql += ` AND anio = ?`;
    valores.push(anioNum);
  }

  // Filtro por fuente
  if (fuente && typeof fuente === 'string') {
    sql += ` AND LOWER(fuente) COLLATE utf8mb4_general_ci LIKE ?`;
    valores.push(`%${fuente.toLowerCase()}%`);
  }

  // Filtro por palabra clave (en descripción o relevancia)
  if (palabra && typeof palabra === 'string') {
    const palabraLower = `%${palabra.toLowerCase()}%`;
    sql += ` AND (
      LOWER(descripcion) COLLATE utf8mb4_general_ci LIKE ? OR
      LOWER(relevancia) COLLATE utf8mb4_general_ci LIKE ?
    )`;
    valores.push(palabraLower, palabraLower);
  }

  try {
    const [rows] = await db.query(sql, valores);
    return rows;
  } catch (error) {
    console.error('Error al buscar documentos:', error);
    throw new Error('Error en la consulta a la base de datos');
  }
}
