import { buscarDocumentosDB } from '../models/documentosBuscarModel.js';

export async function buscarDocumentos(req, res) {
  try {
    const resultados = await buscarDocumentosDB(req.query);
    res.json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al buscar documentos' });
  }
}
