import express from 'express';
import {
  crearInformacionController,
  listarInformacionPublica,
  editarInformacionController
} from '../controllers/informacionController.js';

import { verificarToken } from '../middleware/auth.js';
import { soloMIGA } from '../middleware/validarRol.js';
import { param, body } from 'express-validator';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Información Pública
 *     description: Gestión de información visible para los usuarios
 */

/**
 * @swagger
 * /informacion:
 *   get:
 *     summary: Listar información pública
 *     tags: [Información Pública]
 *     responses:
 *       200:
 *         description: Lista de información pública
 */
router.get('/', listarInformacionPublica);

/**
 * @swagger
 * /informacion:
 *   post:
 *     summary: Crear nueva información (solo MIGA)
 *     tags: [Información Pública]
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
 *               - contenido
 *             properties:
 *               titulo:
 *                 type: string
 *               contenido:
 *                 type: string
 *     responses:
 *       201:
 *         description: Información creada exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo usuarios MIGA pueden crear información
 */
router.post(
  '/',
  verificarToken,
  soloMIGA,
  body('titulo').notEmpty(),
  body('contenido').notEmpty(),
  crearInformacionController
);

/**
 * @swagger
 * /informacion/{id}:
 *   put:
 *     summary: Editar información existente (solo MIGA)
 *     tags: [Información Pública]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la información a editar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - contenido
 *             properties:
 *               titulo:
 *                 type: string
 *               contenido:
 *                 type: string
 *     responses:
 *       200:
 *         description: Información actualizada exitosamente
 *       400:
 *         description: Datos inválidos o ID incorrecto
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Solo usuarios MIGA pueden editar información
 */
router.put(
  '/:id',
  verificarToken,
  soloMIGA,
  param('id').isInt(),
  body('titulo').notEmpty(),
  body('contenido').notEmpty(),
  editarInformacionController
);

export default router;
