/**
 * @swagger
 * /documentos-filtrado:
 *   get:
 *     summary: Obtener palabras frecuentes en documentos
 *     description: Retorna las palabras más frecuentes encontradas en los documentos de la base de datos.
 *     tags:
 *       - Documentos
 *     responses:
 *       200:
 *         description: Lista de palabras frecuentes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /documentos-filtrado/populares:
 *   get:
 *     summary: Obtener palabras más buscadas
 *     description: Retorna las palabras más populares que los usuarios han buscado.
 *     tags:
 *       - Documentos
 *     responses:
 *       200:
 *         description: Lista de palabras más buscadas por usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Error del servidor
 */

import express from 'express';
import { filtrarPalabras, obtenerPalabrasPopulares } from '../controllers/documentosFiltradoController.js';

const router = express.Router();

// Swagger docs arriba ⬆️
router.get('/', filtrarPalabras); // Palabras frecuentes en la BD
router.get('/populares', obtenerPalabrasPopulares); // Palabras más buscadas por usuarios

export default router;
