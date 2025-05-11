import db from '../db.js';

// Definir valores esperados para 'buscado_donde' y 'palabra'
const camposPermitidos = ['descripcion', 'relevancia'];

export async function guardarBusqueda(palabra, buscado_donde) {
  // Validar 'palabra' (mínimo 3 caracteres) y 'buscado_donde' (debe estar en los campos permitidos)
  if (!palabra || palabra.length < 3) {
    throw new Error('La palabra de búsqueda debe tener al menos 3 caracteres.');
  }

  if (!camposPermitidos.includes(buscado_donde)) {
    throw new Error(`El campo '${buscado_donde}' no es válido. Valores permitidos: ${camposPermitidos.join(', ')}`);
  }

  try {
    await db.query(
      'INSERT INTO historial_busquedas (palabra, buscado_donde) VALUES (?, ?)',
      [palabra.toLowerCase(), buscado_donde]
    );
  } catch (error) {
    throw new Error('Error al guardar la búsqueda: ' + error.message);
  }
}

export async function obtenerPalabrasMasBuscadas() {
  try {
    const [rows] = await db.query(`
      SELECT palabra, COUNT(*) as cantidad
      FROM historial_busquedas
      GROUP BY palabra
      ORDER BY cantidad DESC
      LIMIT 20
    `);
    return rows;
  } catch (error) {
    throw new Error('Error al obtener las palabras más buscadas: ' + error.message);
  }
}

export async function buscarPorPalabrasIndividuales(frase) {
  // Validar que la frase no sea vacía y sea razonable (máximo 10 palabras)
  if (!frase || frase.trim().length === 0) {
    throw new Error('La frase de búsqueda no puede estar vacía.');
  }

  const palabras = frase
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quitar tildes
    .split(/\s+/)
    .filter(p => p.length > 2); // evitar preposiciones muy cortas

  // Limitar el número de palabras para evitar consultas muy grandes
  if (palabras.length > 10) {
    throw new Error('Demasiadas palabras en la búsqueda. Limita a 10 palabras.');
  }

  if (palabras.length === 0) return [];

  let sql = `SELECT * FROM documentos WHERE vigente = TRUE`;
  const valores = [];

  palabras.forEach(p => {
    sql += ` AND (LOWER(descripcion) COLLATE utf8mb4_general_ci LIKE ? OR LOWER(relevancia) COLLATE utf8mb4_general_ci LIKE ?)`;
    const likeTerm = `%${p}%`;
    valores.push(likeTerm, likeTerm);
  });

  try {
    const [rows] = await db.query(sql, valores);
    return rows;
  } catch (error) {
    throw new Error('Error al realizar la búsqueda: ' + error.message);
  }
}
