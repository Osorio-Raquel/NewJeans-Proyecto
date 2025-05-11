import express from 'express';
import { listarPropuestasPublicas } from '../controllers/propuestasPublicasController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Propuestas Públicas
 *     description: Consulta pública de propuestas sin necesidad de autenticación
 */

/**
 * @swagger
 * /propuestas/publicas:
 *   get:
 *     summary: Listar propuestas públicas
 *     tags: [Propuestas Públicas]
 *     description: Obtiene una lista de propuestas disponibles para cualquier usuario sin autenticación.
 *     responses:
 *       200:
 *         description: Lista de propuestas públicas obtenida exitosamente
 *       500:
 *         description: Error en el servidor
 */
router.get('/', listarPropuestasPublicas);

export default router;
