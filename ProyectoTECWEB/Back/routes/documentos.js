import express from 'express';
import {
  registrarDocumento,
  obtenerDocumentos,
  obtenerDocumentoPorCodigo,
  actualizarDocumento,
  eliminarDoc,
  restaurarDoc
} from '../controllers/documentosController.js';

import { verificarToken } from '../middleware/auth.js';
import { soloMIGA } from '../middleware/validarRol.js';

const router = express.Router();
/**
 * @swagger
 * /api/documentos:
 *   post:
 *     summary: Registrar un nuevo documento
 *     tags: [Documentos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigo:
 *                 type: string
 *               tipo:
 *                 type: string
 *               fuente:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               relevancia:
 *                 type: string
 *               anio:
 *                 type: string
 *               enlace:
 *                 type: string
 *               aplicacion_id:
 *                 type: integer
 *               conceptos_cpe:
 *                 type: string
 *               creado_por:
 *                 type: integer
 *               jerarquia:
 *                 type: integer
 *               vigente:
 *                 type: boolean
 *               aplicacion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Documento registrado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error en el servidor
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido
 */
// Registrar nuevo documento (POST)
router.post('/', verificarToken, soloMIGA, registrarDocumento);

/**
 * @swagger
 * /api/documentos:
 *   get:
 *     summary: Obtener todos los documentos
 *     tags: [Documentos]
 *     responses:
 *       200:
 *         description: Lista de documentos
 */
//Listar todos (disponible para todos por ahora)
router.get('/', obtenerDocumentos);
/**
 * @swagger
 * /api/documentos/{codigo}:
 *   get:
 *     summary: Obtener documento por código
 *     tags: [Documentos]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del documento
 *     responses:
 *       200:
 *         description: Documento encontrado
 *       404:
 *         description: Documento no encontrado
 */
// Ver uno por código
router.get('/:codigo', obtenerDocumentoPorCodigo);
/**
 * @swagger
 * /api/documentos/{codigo}:
 *   put:
 *     summary: Actualizar un documento (excepto código y fuente)
 *     tags: [Documentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Datos actualizables del documento
 *     responses:
 *       200:
 *         description: Documento actualizado
 *       404:
 *         description: Documento no encontrado
 */
//Actualizar (excepto código y fuente)
router.put('/:codigo', verificarToken, soloMIGA, actualizarDocumento);
/**
 * @swagger
 * /api/documentos/{codigo}:
 *   delete:
 *     summary: Eliminación lógica de un documento
 *     tags: [Documentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Documento eliminado
 *       404:
 *         description: Documento no encontrado
 */
//Eliminar lógico
router.delete('/:codigo', verificarToken, soloMIGA, eliminarDoc);
/**
 * @swagger
 * /api/documentos/{codigo}/restaurar:
 *   patch:
 *     summary: Restaurar un documento eliminado lógicamente
 *     tags: [Documentos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Documento restaurado
 *       404:
 *         description: Documento no encontrado
 */
// Restaurar
router.patch('/:codigo/restaurar', verificarToken, soloMIGA, restaurarDoc);

export default router;