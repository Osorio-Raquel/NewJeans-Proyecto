import db from '../db.js';

const tiposPermitidos = ['ley', 'decreto', 'resolucion', 'circular', 'reglamento', 'otro'];

// Crear un documento nuevo
export async function crearDocumento(data) {
  const {
    codigo,
    tipo,
    fuente,
    descripcion,
    relevancia,
    anio,
    enlace,
    aplicacion_id,
    conceptos_cpe,
    jerarquia,
    creado_por
  } = data;

  if (!codigo || !tipo || !anio || !creado_por) {
    throw new Error('Faltan campos obligatorios');
  }

  if (!tiposPermitidos.includes(tipo)) {
    throw new Error('Tipo de documento no válido');
  }

  if (isNaN(parseInt(anio))) {
    throw new Error('Año inválido');
  }

  const sql = `
    INSERT INTO documentos (
      codigo, tipo, fuente, descripcion, relevancia,
      anio, enlace, aplicacion_id, conceptos_cpe,
      jerarquia, vigente, creado_por
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?)
  `;

  await db.query(sql, [
    codigo, tipo, fuente, descripcion, relevancia,
    parseInt(anio), enlace, aplicacion_id, conceptos_cpe,
    jerarquia, creado_por
  ]);
}

// Listar todos los documentos vigentes
export async function listarDocumentos() {
  const [rows] = await db.query(`
    SELECT d.*, a.tipo AS aplicacion, u.nombres AS creado_por_nombre
    FROM documentos d
    JOIN aplicacion a ON d.aplicacion_id = a.id
    JOIN usuarios u ON d.creado_por = u.id
    WHERE d.vigente = TRUE
    ORDER BY d.anio DESC
  `);
  return rows;
}

// Buscar por código
export async function buscarDocumentoPorCodigo(codigo) {
  if (!codigo) throw new Error('Código requerido');
  const [rows] = await db.query('SELECT * FROM documentos WHERE codigo = ?', [codigo]);
  return rows[0];
}

// Editar documento
export async function editarDocumento(codigo, data) {
  if (!codigo) throw new Error('Código requerido');

  const {
    descripcion,
    relevancia,
    anio,
    enlace,
    aplicacion_id,
    conceptos_cpe,
    jerarquia
  } = data;

  if (anio && isNaN(parseInt(anio))) {
    throw new Error('Año inválido');
  }

  const sql = `
    UPDATE documentos
    SET descripcion = ?, relevancia = ?, anio = ?, enlace = ?,
        aplicacion_id = ?, conceptos_cpe = ?, jerarquia = ?
    WHERE codigo = ?
  `;

  await db.query(sql, [
    descripcion, relevancia, parseInt(anio), enlace,
    aplicacion_id, conceptos_cpe, jerarquia, codigo
  ]);
}

// Marcar como no vigente
export async function marcarNoVigente(codigo) {
  if (!codigo) throw new Error('Código requerido');
  await db.query('UPDATE documentos SET vigente = FALSE WHERE codigo = ?', [codigo]);
}

// Restaurar documento
export async function restaurarDocumento(codigo) {
  if (!codigo) throw new Error('Código requerido');
  await db.query('UPDATE documentos SET vigente = TRUE WHERE codigo = ?', [codigo]);
}
