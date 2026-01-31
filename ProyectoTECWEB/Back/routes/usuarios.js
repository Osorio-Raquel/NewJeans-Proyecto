import express from 'express';
import { login, 
    register, 
    perfil,
    registroGoogle,
    actualizarUsuarioGeneral,
    registroComunidad,
    cambiarContrasenia} from '../controllers/usuariosController.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de autenticación de usuarios
 */
/**
 * @swagger
 * /api/usuarios/register:
 *   post:
 *     summary: Registrar usuario (rol COMUNIDAD o especificado)
 *     description: Registra un nuevo usuario. Si no se especifica el rol, por defecto será "COMUNIDAD".
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombres, correo, contraseña]
 *             properties:
 *               nombres:
 *                 type: string
 *                 example: Juan
 *               apellidop:
 *                 type: string
 *                 example: Pérez
 *               apellidom:
 *                 type: string
 *                 example: López
 *               correo:
 *                 type: string
 *                 example: juanperez@example.com
 *               contraseña:
 *                 type: string
 *                 example: Secreto123
 *               rol:
 *                 type: string
 *                 enum: [MIGA, COMUNIDAD]
 *                 example: COMUNIDAD
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Campos obligatorios faltantes o correo duplicado
 *       500:
 *         description: Error al registrar usuario
 */
router.post('/register', register);
/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Login de usuario
 *     description: Permite iniciar sesión usando correo o usuario_defecto con la contraseña. Retorna un token JWT.
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [login, contraseña]
 *             properties:
 *               login:
 *                 type: string
 *                 description: Puede ser correo o Usuario_defecto
 *                 example: juanperez@example.com
 *               contraseña:
 *                 type: string
 *                 example: Secreto123
 *     responses:
 *       200:
 *         description: Login exitoso con token
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: Contraseña incorrecta
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al iniciar sesión
 */
router.post('/login', login);
/**
 * @swagger
 * /api/usuarios/perfil:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     description: Devuelve los datos del usuario según el token proporcionado.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido, retorna datos del usuario
 *       401:
 *         description: Token inválido o ausente
 */
router.get('/perfil', verificarToken, perfil);
/**
 * @swagger
 * tags:
 *   name: Usuarios Actualización
 *   description: Gestión de autenticación de usuarios en lo ultimo
 */
/**
 * @swagger
 * /api/usuarios/cambiar-contrasenia:
 *   patch:
 *     summary: Cambiar contraseña del usuario autenticado
 *     description: Cambia la contraseña del usuario verificando la contraseña actual.
 *     tags: [Usuarios Actualización]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [actual, nueva]
 *             properties:
 *               actual:
 *                 type: string
 *                 example: ContraseñaActual123
 *               nueva:
 *                 type: string
 *                 example: NuevaContraseña456
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: Datos faltantes o nueva contraseña igual a la actual
 *       401:
 *         description: Contraseña actual incorrecta
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al cambiar contraseña
 */
router.patch('/cambiar-contrasenia', verificarToken, cambiarContrasenia);
/**
 * @swagger
 * /api/usuarios/{id}:
 *   patch:
 *     summary: Editar datos generales del usuario
 *     description: Permite actualizar datos básicos del usuario. No se permite cambiar rol ni eliminado.
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               nombres: Juan actualizado
 *               apellidop: Pérez
 *               correo: nuevo@mail.com
 *               macrodistrito_id: 1
 *               ambitoactividad_id: 2
 *               zona_id: 3
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       403:
 *         description: Intento de modificar campos no permitidos
 *       500:
 *         description: Error al actualizar usuario
 */
router.patch('/:id', verificarToken, actualizarUsuarioGeneral);

/**
 * @swagger
 * /api/usuarios/registro-comunidad:
 *   post:
 *     summary: Registro rápido de usuario COMUNIDAD
 *     description: Registra un usuario del tipo COMUNIDAD generando un Usuario_defecto automáticamente. La contraseña inicial es el carnet_ci.
 *     tags: [Usuarios Actualización]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombres, apellidop, carnet_ci]
 *             properties:
 *               nombres:
 *                 type: string
 *                 example: Carlos
 *               apellidop:
 *                 type: string
 *                 example: Quiroga
 *               apellidom:
 *                 type: string
 *                 example: Reyes
 *               carnet_ci:
 *                 type: string
 *                 example: 98456123
 *               correo:
 *                 type: string
 *                 example: carlos@mail.com
 *               macrodistrito_id:
 *                 type: integer
 *                 example: 2
 *               ambitoactividad_id:
 *                 type: integer
 *                 example: 4
 *               zona_id:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Usuario COMUNIDAD creado correctamente con Usuario_defecto
 *       400:
 *         description: Faltan campos o correo duplicado
 *       500:
 *         description: Error al registrar usuario COMUNIDAD
 */
router.post('/registro-comunidad', registroComunidad);

router.post('/registro-google', registroGoogle);
export default router;