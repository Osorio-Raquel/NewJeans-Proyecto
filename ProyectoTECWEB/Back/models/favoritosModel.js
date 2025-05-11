import db from '../db.js';

export async function agregarFavorito(usuarioId, codigoDocumento) {
  const [result] = await db.query(`
    INSERT INTO favoritos (usuario_id, documento_codigo)
    VALUES (?, ?)
  `, [usuarioId, codigoDocumento]);
  return result;
}

export async function eliminarFavorito(usuarioId, codigoDocumento) {
  const [result] = await db.query(`
    DELETE FROM favoritos
    WHERE usuario_id = ? AND documento_codigo = ?
  `, [usuarioId, codigoDocumento]);
  return result;
}

export async function listarFavoritosPorUsuario(usuarioId) {
  const [rows] = await db.query(`
    SELECT d.codigo, d.tipo, d.fuente, d.descripcion, d.relevancia, d.anio,
           d.enlace, a.tipo AS aplicacion, d.conceptos_cpe, d.creado_por,
           d.jerarquia, d.vigente
    FROM favoritos f
    JOIN documentos d ON f.documento_codigo = d.codigo
    JOIN aplicacion a ON d.aplicacion_id = a.id
    WHERE f.usuario_id = ? AND d.vigente = TRUE
    ORDER BY d.anio DESC, d.codigo ASC
  `, [usuarioId]);
  return rows;
}
