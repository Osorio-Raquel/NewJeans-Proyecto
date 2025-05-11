import express from 'express';
import {
  crearPropuestaController,
  obtenerMisPropuestas,
  obtenerTodasLasPropuestas,
  cambiarEstadoPropuesta
} from '../controllers/propuestasController.js';

import { verificarToken } from '../middleware/auth.js';
import { soloMIGA, soloComunidad } from '../middleware/validarRol.js';
import { body, param } from 'express-validator';

const router = express.Router();

// Comunidad: enviar nueva propuesta
/**
 * @swagger
 * tags:
 *   - name: Propuestas
 *     description: Gestión de propuestas entre comunidad y MIGA
 */

/**
 * @swagger
 * /propuestas:
 *   post:
 *     summary: Crear una nueva propuesta (solo COMUNIDAD)
 *     tags: [Propuestas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descripcion
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Propuesta creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo usuarios con rol COMUNIDAD pueden crear propuestas
 */
router.post(
  '/',
  verificarToken,
  soloComunidad,
  body('titulo').notEmpty().withMessage('El título es obligatorio'),
  body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
  crearPropuestaController
);

// Comunidad: ver sus propuestas
/**
 * @swagger
 * /propuestas/mis:
 *   get:
 *     summary: Obtener mis propuestas (solo COMUNIDAD)
 *     tags: [Propuestas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de propuestas del usuario autenticado
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo usuarios COMUNIDAD pueden ver sus propuestas
 */
router.get('/mis', verificarToken, soloComunidad, obtenerMisPropuestas);

// MIGA: ver todas las propuestas
/**
 * @swagger
 * /propuestas:
 *   get:
 *     summary: Obtener todas las propuestas (solo MIGA)
 *     tags: [Propuestas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las propuestas
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo usuarios MIGA pueden ver todas las propuestas
 */
router.get('/', verificarToken, soloMIGA, obtenerTodasLasPropuestas);

// MIGA: actualizar estado de una propuesta
/**
 * @swagger
 * /propuestas/{id}/estado:
 *   patch:
 *     summary: Cambiar el estado de una propuesta (solo MIGA)
 *     tags: [Propuestas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la propuesta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - estado
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, aceptada, rechazada]
 *                 description: Estado a actualizar
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       400:
 *         description: ID o estado inválido
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo usuarios MIGA pueden cambiar estado
 */
router.patch(
  '/:id/estado',
  verificarToken,
  soloMIGA,
  param('id').isInt().withMessage('ID inválido'),
  body('estado').isIn(['pendiente', 'aceptada', 'rechazada']).withMessage('Estado no válido'),
  cambiarEstadoPropuesta
);

export default router;
