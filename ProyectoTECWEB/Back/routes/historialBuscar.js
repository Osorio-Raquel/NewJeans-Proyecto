/**
 * @swagger
 * /historial-busqueda:
 *   get:
 *     summary: Buscar palabras clave en el historial
 *     description: Retorna entradas del historial de búsqueda que contienen la palabra clave especificada.
 *     tags:
 *       - Historial
 *     parameters:
 *       - in: query
 *         name: palabra
 *         schema:
 *           type: string
 *         required: true
 *         description: Palabra clave a buscar en el historial
 *     responses:
 *       200:
 *         description: Lista de coincidencias encontradas en el historial
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: Parámetro de búsqueda faltante o inválido
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /historial-busqueda/google-like:
 *   get:
 *     summary: Buscar tipo Google en el historial
 *     description: Realiza una búsqueda avanzada en el historial imitando la lógica de búsqueda de Google.
 *     tags:
 *       - Historial
 *     parameters:
 *       - in: query
 *         name: consulta
 *         schema:
 *           type: string
 *         required: true
 *         description: Término o frase para realizar una búsqueda tipo Google
 *     responses:
 *       200:
 *         description: Resultados de la búsqueda avanzada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: Consulta inválida o faltante
 *       500:
 *         description: Error del servidor
 */

import express from 'express';
import { buscarPalabrasClave, busquedaGoogleLike } from '../controllers/historialBuscarController.js';

const router = express.Router();

router.get('/google-like', busquedaGoogleLike);
router.get('/', buscarPalabrasClave);

export default router;
