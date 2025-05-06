import express from 'express';
import reportesPDFController from '../controllers/reportesPDFController.js';
import { verificarToken } from '../middleware/auth.js';
import validarRol from '../middleware/validarRol.js';
import { param } from 'express-validator';

const router = express.Router();

const tiposValidos = [
  'ley', 'decreto', 'resolucion', 'plan', 'norma',
  'resolucion_municipal', 'programa', 'otro'
];

/**
 * @swagger
 * /api/reportes/pdf/documentos:
 *   get:
 *     summary: Generar PDF con resumen de documentos
 *     tags: [Reportes PDF]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF generado con éxito
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *             description: Nombre del archivo sugerido para descarga
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/documentos', verificarToken, validarRol('MIGA'), reportesPDFController.getPDFDocumentos);

/**
 * @swagger
 * /api/reportes/pdf/documentos/tipo/{tipo}:
 *   get:
 *     summary: Generar PDF de documentos filtrados por tipo
 *     tags: [Reportes PDF]
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
 *         description: PDF generado correctamente
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *             description: Nombre del archivo sugerido para descarga
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Tipo no válido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/documentos/tipo/:tipo',
  verificarToken,
  validarRol('MIGA'),
  param('tipo').isIn(tiposValidos),
  reportesPDFController.getPDFDocumentosPorTipo
);

/**
 * @swagger
 * /api/reportes/pdf/documentos/anio/{anio}:
 *   get:
 *     summary: Generar PDF de documentos filtrados por año
 *     tags: [Reportes PDF]
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
 *         description: Año del documento
 *     responses:
 *       200:
 *         description: PDF generado correctamente
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *             description: Nombre del archivo sugerido para descarga
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Año no válido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/documentos/anio/:anio',
  verificarToken,
  validarRol('MIGA'),
  param('anio').isInt({ min: 1900, max: 2100 }),
  reportesPDFController.getPDFDocumentosPorAnio
);

/**
 * @swagger
 * /api/reportes/pdf/consultas:
 *   get:
 *     summary: Generar PDF con resumen de consultas realizadas
 *     tags: [Reportes PDF]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF generado correctamente
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *             description: Nombre del archivo sugerido para descarga
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado
 */
router.get('/consultas', verificarToken, validarRol('MIGA'), reportesPDFController.getPDFConsultas);
export default router;