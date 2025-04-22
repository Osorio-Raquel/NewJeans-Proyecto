import { buscarDocumentosDB } from '../models/documentosBuscarModel.js';
import {
  guardarBusqueda,
  buscarPorPalabrasIndividuales
} from '../models/historialBuscarModel.js';

// Búsqueda básica por palabra clave
export async function buscarPalabrasClave(req, res) {
  try {
    const { palabra } = req.query;

    if (!palabra) {
      return res.status(400).json({ mensaje: 'Debe proporcionar una palabra clave' });
    }

    const resultados = await buscarDocumentosDB({ palabra });

    // Determinar si la palabra fue buscada en descripción, relevancia o ambos
    const buscado_donde = 'ambos'; // ya que siempre se busca en ambas en este caso

    await guardarBusqueda(palabra, buscado_donde);

    res.json(resultados);
  } catch (error) {
    console.error('Error en búsqueda avanzada:', error);
    res.status(500).json({ mensaje: 'Error al buscar documentos por palabra clave' });
  }
}

// Búsqueda tipo Google: por frase dividida en palabras individuales
export async function busquedaGoogleLike(req, res) {
  try {
    const { frase } = req.query;
    if (!frase) {
      return res.status(400).json({ mensaje: 'Debe proporcionar una frase para buscar' });
    }

    const resultados = await buscarPorPalabrasIndividuales(frase);

    // Guardamos cada palabra de la frase por separado
    const palabras = frase
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, '')
      .split(/\s+/)
      .filter(p => p.length > 2);

    for (const palabra of palabras) {
      await guardarBusqueda(palabra, 'ambos');
    }

    res.json(resultados);
  } catch (error) {
    console.error('Error en búsqueda tipo Google:', error);
    res.status(500).json({ mensaje: 'Error al buscar por frase' });
  }
}
