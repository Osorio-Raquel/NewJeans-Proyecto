import express from 'express';
import reportesController from '../controllers/reportesController.js';
import { verificarToken } from '../middleware/auth.js'; // seguimos usando export default
import validarRol from '../middleware/validarRol.js';
import { param } from 'express-validator';

// 💡 le cambiamos el nombre aquí

const router = express.Router();

const tiposValidos = [
  'ley',
  'decreto',
  'resolucion',
  'plan',
  'norma',
  'resolucion_municipal',
  'programa',
  'otro'
];


/**
 * @swagger
 * /reportes/consultas:
 *   get:
 *     summary: Obtener estadísticas de consultas
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de consultas obtenida con éxito
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/consultas', verificarToken, validarRol('MIGA'), reportesController.getConsultas);

/**
 * @swagger
 * /reportes/documentos:
 *   get:
 *     summary: Obtener estadísticas de documentos
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de documentos obtenida con éxito
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/documentos', verificarToken, validarRol('MIGA'), reportesController.getDocumentos);

/**
 * @swagger
 * /reportes/documentos/tipo/{tipo}:
 *   get:
 *     summary: Obtener documentos por tipo
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ley, decreto, resolucion, plan, norma, resolucion_municipal, programa, otro]
 *         description: Tipo de documento
 *     responses:
 *       200:
 *         description: Documentos filtrados por tipo
 *       400:
 *         description: Tipo no válido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get(
  '/documentos/tipo/:tipo',
  verificarToken,
  validarRol('MIGA'),
  param('tipo').isIn(tiposValidos).withMessage('Tipo de documento no válido'),
  reportesController.getDocumentosPorTipo
);

/**
 * @swagger
 * /reportes/documentos/anio/{anio}:
 *   get:
 *     summary: Obtener documentos por año
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: anio
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1900
 *           maximum: 2100
 *         description: Año de publicación del documento
 *     responses:
 *       200:
 *         description: Documentos filtrados por año
 *       400:
 *         description: Año no válido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get(
  '/documentos/anio/:anio',
  verificarToken,
  validarRol('MIGA'),
  param('anio').isInt({ min: 1900, max: 2100 }).withMessage('Año no válido'),
  reportesController.getDocumentosPorAnio
);

export default router;
