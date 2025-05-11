import db from '../db.js';

// Crear bloque de información
export async function crearInformacion({ titulo, contenido, creado_por }) {
  const sql = `
    INSERT INTO informacion_complementaria (titulo, contenido, creado_por)
    VALUES (?, ?, ?)
  `;
  await db.query(sql, [titulo, contenido, creado_por]);
}

// Obtener toda la información (público)
export async function obtenerInformacionPublica() {
  const [rows] = await db.query(`
    SELECT i.id, i.titulo, i.contenido, i.creado_en, u.nombres
    FROM informacion_complementaria i
    JOIN usuarios u ON i.creado_por = u.id
    ORDER BY i.creado_en DESC
  `);
  return rows;
}

// Editar bloque informativo (MIGA)
export async function actualizarInformacion(id, titulo, contenido) {
  const sql = `
    UPDATE informacion_complementaria
    SET titulo = ?, contenido = ?
    WHERE id = ?
  `;
  await db.query(sql, [titulo, contenido, id]);
}
