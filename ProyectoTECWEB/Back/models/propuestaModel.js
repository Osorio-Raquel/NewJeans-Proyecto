import db from '../db.js';

// Crear propuesta (solo usuarios COMUNIDAD)
export async function crearPropuesta({ titulo, descripcion, usuario_id }) {
  const sql = `
    INSERT INTO propuestas (titulo, descripcion, usuario_id)
    VALUES (?, ?, ?)
  `;
  await db.query(sql, [titulo, descripcion, usuario_id]);
}

// Obtener propuestas del usuario COMUNIDAD
export async function obtenerPropuestasPorUsuario(usuario_id) {
  const [rows] = await db.query(`
    SELECT id, titulo, descripcion, estado, observacion_miga, enviada_en
    FROM propuestas
    WHERE usuario_id = ?
    ORDER BY enviada_en DESC
  `, [usuario_id]);
  return rows;
}

// Obtener TODAS las propuestas (solo MIGA)
export async function obtenerTodasPropuestas() {
  const [rows] = await db.query(`
    SELECT p.id, p.titulo, p.descripcion, p.estado, p.enviada_en,
           u.nombres, u.apellidop, u.apellidom, p.observacion_miga
    FROM propuestas p
    JOIN usuarios u ON p.usuario_id = u.id
    ORDER BY p.enviada_en DESC
  `);
  return rows;
}

// Cambiar estado de propuesta (MIGA)
export async function actualizarEstadoPropuesta(id, nuevoEstado, observacion) {
  const sql = `
    UPDATE propuestas
    SET estado = ?, observacion_miga = ?
    WHERE id = ?
  `;
  await db.query(sql, [nuevoEstado, observacion, id]);
}

export async function obtenerPropuestasPublicasGenerales() {
    const [rows] = await db.query(`
      SELECT p.id, p.titulo, p.descripcion, p.estado, p.enviada_en,
             CONCAT(u.nombres, ' ', u.apellidop) AS autor
      FROM propuestas p
      JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.estado IN ('pendiente', 'aceptada')
      ORDER BY p.enviada_en DESC
    `);
    return rows;
  }