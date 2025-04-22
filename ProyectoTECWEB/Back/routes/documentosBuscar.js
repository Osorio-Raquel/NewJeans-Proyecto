/**
 * @swagger
 * /documentos-buscar:
 *   get:
 *     summary: Buscar documentos
 *     description: Retorna una lista de documentos que coinciden con los criterios de búsqueda.
 *     tags:
 *       - Documentos
 *     parameters:
 *       - in: query
 *         name: titulo
 *         schema:
 *           type: string
 *         description: Título del documento (opcional)
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *         description: Categoría del documento (opcional)
 *     responses:
 *       200:
 *         description: Lista de documentos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Documento'
 *       500:
 *         description: Error del servidor
 */

import express from 'express';
import { buscarDocumentos } from '../controllers/documentosBuscarController.js';

const router = express.Router();

router.get('/', buscarDocumentos);

export default router;

