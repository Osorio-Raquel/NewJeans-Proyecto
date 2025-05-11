import { obtenerPropuestasPublicasGenerales } from '../models/propuestaModel.js';

export async function listarPropuestasPublicas(req, res) {
  try {
    const propuestas = await obtenerPropuestasPublicasGenerales();
    res.status(200).json(propuestas);
  } catch (error) {
    console.error('Error al listar propuestas públicas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
