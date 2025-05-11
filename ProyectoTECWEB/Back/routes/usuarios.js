/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de autenticación de usuarios
 */

import express from 'express';
import { login, register, perfil } from '../controllers/usuariosController.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/usuarios/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Crea una nueva cuenta de usuario.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombres
 *               - apellidop
 *               - apellidom  
 *               - correo
 *               - contraseña
 *               - rol
 *             properties:
 *               nombres:
 *                 type: string
 *               apellidop:
 *                 type: string
 *               apellidom:
 *                 type: string
 *               correo:
 *                 type: string
 *               contraseña:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum:
 *                   - MIGA
 *                   - COMUNIDAD
 *                 description: "El rol del usuario, puede ser 'MIGA' o 'COMUNIDAD'."
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente.
 *       400:
 *         description: Datos de entrada inválidos o usuario ya existe.
 *       500:
 *         description: Error en el servidor.
 */
router.post('/register', register);


/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Inicia sesión con las credenciales del usuario.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - contraseña
 *             properties:
 *               correo:
 *                 type: string
 *               contraseña:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, devuelve un token de acceso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas o usuario no encontrado.
 *       500:
 *         description: Error en el servidor.
 */
router.post('/login', login);

/**
 * @swagger
 * /api/usuarios/perfil:
 *   get:
 *     summary: Obtener perfil del usuario
 *     description: Obtiene la información del perfil del usuario autenticado.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 correo:
 *                   type: string
 *       401:
 *         description: No autorizado, token inválido o no proporcionado.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error en el servidor.
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get('/perfil', verificarToken, perfil);

export default router;