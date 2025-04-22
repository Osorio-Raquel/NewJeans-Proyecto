import { obtenerPalabrasFrecuentes } from '../utils/analisisTexto.js';
import { obtenerPalabrasMasBuscadas } from '../models/historialBuscarModel.js';
import db from '../db.js';

export async function filtrarPalabras(req, res) {
  try {
    const top_palabras = await obtenerPalabrasFrecuentes(db);
    res.json({ top_palabras });
  } catch (error) {
    console.error('Error en filtrado:', error);
    res.status(500).json({ mensaje: 'Error en el filtrado inteligente' });
  }
}

export async function obtenerPalabrasPopulares(req, res) {
  try {
    const populares = await obtenerPalabrasMasBuscadas();
    res.json({ populares });
  } catch (error) {
    console.error('Error al obtener palabras populares:', error);
    res.status(500).json({ mensaje: 'Error al recuperar palabras buscadas por usuarios' });
  }
}
