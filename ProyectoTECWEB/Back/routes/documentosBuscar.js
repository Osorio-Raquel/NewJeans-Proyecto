import express from 'express';
import { buscarDocumentos } from '../controllers/documentosBuscarController.js';
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Documentos Buscar
 *   description: Operaciones relacionadas con búsquedas filtradas por tipo, año, fuente, etc.
 * 
 * /api/buscar:
 *   get:
 *     summary: Buscar documentos con múltiples filtros
 *     description: |
 *       Permite buscar documentos usando diversos criterios como código, tipo, fuente y año.
 *       Todos los parámetros son combinables.
 *     tags: [Documentos Buscar]
 *     parameters:
 *       - in: query
 *         name: codigo
 *         schema:
 *           type: string
 *         description: Código exacto del documento
 * 
 *       - in: query
 *         name: tipo
 *         schema:
 *           type: string
 *           enum: [ley, decreto, resolucion, circular, reglamento, otro]
 *         description: Tipo de documento (valores predefinidos)
 * 
 *       - in: query
 *         name: fuente
 *         schema:
 *           type: string
 *         description: Búsqueda parcial en el nombre de la fuente
 * 
 *       - in: query
 *         name: anio
 *         schema:
 *           type: integer
 *           format: int32
 *           minimum: 1900
 *           maximum: 2100
 *         description: Año de publicación del documento
 * 
 *     responses:
 *       200:
 *         description: Resultados de la búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 datos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Documento'
 *                 meta:
 *                   $ref: '#/components/schemas/Paginacion'
 *       400:
 *         description: Error en los parámetros de búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * 
 * components:
 *   schemas:
 *     Documento:
 *       type: object
 *       properties:
 *         codigo:
 *           type: string
 *           example: "DOC006"
 *         tipo:
 *           type: string
 *           example: "ley"
 *         fuente:
 *           type: string
 *           example: "Ministerio de Educación"
 *         anio:
 *           type: integer
 *           example: 2024
 *         enlace:
 *           type: string
 *           format: uri
 *           example: "https://drive.google.com/doc006"
 *         aplicacion_id:
 *           type: integer
 *           example: 3
 *         conceptos_cpe:
 *           type: string
 *           example: "Derecho a la salud y a la alimentación"
 *         jerarquia:
 *           type: string
 *           example: "Alta"
 *         vigente:
 *           type: boolean
 *           example: true
 *         aplicacion:
 *           type: string
 *           example: "Nacional"
 *         creado_por_nombre:
 *           type: string
 *           example: "Administrador"
 * 
 *     Paginacion:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           example: 1
 *         pagina:
 *           type: integer
 *           example: 1
 *         totalPaginas:
 *           type: integer
 *           example: 1
 *         limite:
 *           type: integer
 *           example: 10
 * 
 *     Error:
 *       type: object
 *       properties:
 *         codigo:
 *           type: string
 *           example: "ERR_VALIDACION"
 *         mensaje:
 *           type: string
 *           example: "Error de validación en los parámetros"
 *         detalles:
 *           type: array
 *           items:
 *             type: string
 *           example: ["El parámetro 'anio' debe estar entre 2000 y 2024"]
 */

router.get('/', buscarDocumentos);
export default router;
