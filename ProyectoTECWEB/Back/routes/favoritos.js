import express from 'express';
import {
  agregarFavoritoController,
  eliminarFavoritoController,
  listarFavoritosController
} from '../controllers/favoritosController.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Favoritos
 *     description: Endpoints para gestión de documentos favoritos
 */

/**
 * @swagger
 * /api/favoritos:
 *   get:
 *     summary: Listar todos los documentos favoritos del usuario
 *     tags: [Favoritos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de documentos favoritos obtenida correctamente
 *       401:
 *         description: No autorizado
 */
router.get('/', verificarToken, listarFavoritosController);

/**
 * @swagger
 * /api/favoritos:
 *   post:
 *     summary: Agregar un documento a favoritos
 *     tags: [Favoritos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del documento a agregar
 *     responses:
 *       200:
 *         description: Documento agregado exitosamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 */
router.post('/:codigo', verificarToken, agregarFavoritoController);

/**
 * @swagger
 * /api/favoritos:
 *   delete:
 *     summary: Eliminar un documento de favoritos
 *     tags: [Favoritos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del documento a eliminar
 *     responses:
 *       200:
 *         description: Documento eliminado exitosamente
 *       400:
 *         description: Solicitud incorrecta
 *       401:
 *         description: No autorizado
 */
router.delete('/:codigo', verificarToken, eliminarFavoritoController);

export default router;

