import {
  crearDocumento,
  listarDocumentos,
  buscarDocumentoPorCodigo,
  editarDocumento,
  marcarNoVigente,
  restaurarDocumento,
  generarCodigoPorTipo,
  listarDocumentosEliminados
} from '../models/documentoModel.js';

export async function registrarDocumento(req, res) {
  try {
    const data = req.body;
    data.creado_por = req.usuario.id;

    const camposObligatorios = [
      'codigo', 'tipo', 'fuente', 'descripcion', 'relevancia',
      'anio', 'enlace', 'aplicacion_id', 'conceptos_cpe', 'jerarquia'
    ];

    for (const campo of camposObligatorios) {
      if (!data[campo]) {
        return res.status(400).json({ mensaje: `Falta el campo: ${campo}` });
      }
    }

    await crearDocumento(data);
    res.status(201).json({ mensaje: 'Documento registrado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar documento' });
  }
}

export async function obtenerDocumentos(req, res) {
  try {
    const documentos = await listarDocumentos();
    res.json(documentos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener documentos' });
  }
}

export async function obtenerDocumentoPorCodigo(req, res) {
  try {
    const { codigo } = req.params;
    const doc = await buscarDocumentoPorCodigo(codigo);
    if (!doc) return res.status(404).json({ mensaje: 'Documento no encontrado' });
    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener documento' });
  }
}

export async function actualizarDocumento(req, res) {
  try {
    const { codigo } = req.params;
    const data = req.body;

    await editarDocumento(codigo, data);
    res.json({ mensaje: 'Documento actualizado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar documento' });
  }
}

export async function eliminarDoc(req, res) {
  try {
    const { codigo } = req.params;
    await marcarNoVigente(codigo);
    res.json({ mensaje: 'Documento marcado como NO vigente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al marcar como no vigente' });
  }
}

export async function restaurarDoc(req, res) {
  try {
    const { codigo } = req.params;
    await restaurarDocumento(codigo);
    res.json({ mensaje: 'Documento restaurado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al restaurar documento' });
  }
}
export async function generarCodigo(req, res) {
  try {
    const { tipo } = req.query;
    if (!tipo) return res.status(400).json({ mensaje: "Falta el tipo de documento" });

    const codigo = await generarCodigoPorTipo(tipo);
    res.json({ codigo });
  } catch (error) {
    console.error("Error al generar código:", error.message);
    res.status(500).json({ mensaje: "Error al generar código", error: error.message });
  }
}

import { tipoEnumMap } from "../utils/tipoEnumMap.js"; // si lo guardás como módulo externo

export async function registrarDocumentoAuto(req, res) {
  try {
    console.log("📥 [AUTO] Body recibido:", req.body);

    const data = req.body;
    data.creado_por = req.usuario.id;

    if (!data.tipo) {
      console.warn("⚠️ Falta el tipo para generar el código");
      return res.status(400).json({ mensaje: "Falta el tipo para generar el código" });
    }

    const tipoNormalizado = tipoEnumMap[data.tipo?.toLowerCase()];
    if (!tipoNormalizado) {
      return res.status(400).json({ mensaje: `Tipo inválido: ${data.tipo}` });
    }

    data.tipo = tipoNormalizado;

    console.log("📨 [AUTO] Tipo normalizado para código:", data.tipo);

    data.codigo = await generarCodigoPorTipo(data.tipo);

    console.log("✅ [AUTO] Código generado:", data.codigo);

    const camposObligatorios = [
      'tipo', 'fuente', 'descripcion', 'relevancia',
      'anio', 'enlace', 'aplicacion_id', 'conceptos_cpe', 'jerarquia'
    ];

    for (const campo of camposObligatorios) {
      if (!data[campo]) {
        console.warn(`⚠️ Falta el campo obligatorio: ${campo}`);
        return res.status(400).json({ mensaje: `Falta el campo: ${campo}` });
      }
    }

    await crearDocumento(data);
    console.log("✅ [AUTO] Documento insertado correctamente en la base de datos");

    res.status(201).json({
      mensaje: 'Documento registrado automáticamente',
      codigo: data.codigo
    });

  } catch (error) {
    console.error("❌ Error en registrarDocumentoAuto:", error.message);
    res.status(500).json({
      mensaje: 'Error al registrar documento automáticamente',
      error: error.message
    });
  }
}


export async function obtenerDocumentosEliminados(req, res) {
  try {
    const eliminados = await listarDocumentosEliminados();
    res.json(eliminados);
  } catch (error) {
    console.error("Error al obtener documentos eliminados:", error.message);
    res.status(500).json({ mensaje: 'Error al obtener documentos eliminados' });
  }
}
