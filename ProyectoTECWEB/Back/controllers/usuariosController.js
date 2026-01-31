import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import db from '../db.js';
import { generarUsuarioDefecto } from '../utils/usuario_defecto.js';
import { crearUsuario, buscarPorCorreo, editarUsuario } from '../models/usuariosModel.js';

export async function register(req, res) {
  try {
    const { nombres, apellidop, apellidom, correo, contraseña, rol } = req.body;

    if (!nombres || !correo || !contraseña) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    const usuarioExistente = await buscarPorCorreo(correo);
    if (usuarioExistente) return res.status(400).json({ mensaje: 'Correo ya registrado' });

    const hash = await bcrypt.hash(contraseña, 10);

    const rolAsignado = rol || 'COMUNIDAD';
    await crearUsuario({ nombres, apellidop, apellidom, correo, contraseña: hash, rol: rolAsignado });

    res.status(201).json({ mensaje: `Usuario ${rol} creado correctamente` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
}

export async function login(req, res) {
  try {
    const loginInput = req.body.login || req.body.correo || req.body.usuario_defecto;
    const contraseña = req.body.contraseña;

    if (!loginInput || !contraseña) {
      return res.status(400).json({ mensaje: 'Debe ingresar correo o usuario, y la contraseña' });
    }

    const [rows] = await db.query(`
      SELECT * FROM usuarios
      WHERE eliminado = FALSE AND (correo = ? OR Usuario_defecto = ?)
      LIMIT 1
    `, [loginInput, loginInput]);

    const usuario = rows[0];

    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado o fue eliminado' });

    const match = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!match) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, {
      expiresIn: '4h'
    });

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidop: usuario.apellidop,
        apellidom: usuario.apellidom,
        rol: usuario.rol,
        usuario_defecto: usuario.Usuario_defecto
      }
    });

  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
}

export function perfil(req, res) {
  res.json({
    mensaje: 'Token válido',
    usuario: req.usuario
  });
}

const client = new OAuth2Client("TU_CLIENT_ID_GOOGLE");

export async function registroGoogle(req, res) {
  try {
    const { tokenId } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: "TU_CLIENT_ID_GOOGLE",
    });

    const payload = ticket.getPayload();
    const correo = payload.email;
    const nombres = payload.given_name;
    const apellidop = payload.family_name || '';

    // Verifica si ya existe
    const [result] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

    if (result.length === 0) {
      // No existe → lo crea como COMUNIDAD
      await db.query(`
        INSERT INTO usuarios (nombres, apellidop, correo, rol)
        VALUES (?, ?, ?, 'COMUNIDAD')
      `, [nombres, apellidop, correo]);
    }

    // Obtener el usuario actualizado
    const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    const usuario = rows[0];

    // Generar token
    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ mensaje: 'Usuario autenticado con Google', token });
  } catch (error) {
    console.error("Error en registroGoogle:", error);
    res.status(500).json({ mensaje: 'Error al registrar con Google', error: error.message });
  }
}

export async function actualizarUsuarioGeneral(req, res) {
  try {
    const { id } = req.params;
    const datos = req.body;

    // No permitir cambios en campos sensibles como el rol o el estado eliminado
    if ('rol' in datos || 'eliminado' in datos) {
      return res.status(403).json({ mensaje: 'No se permite modificar el rol ni el estado eliminado' });
    }

    await editarUsuario(id, datos);
    res.json({ mensaje: 'Usuario actualizado correctamente' });

  } catch (error) {
    console.error('Error al actualizar usuario:', error.message);
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }
}

export async function registroComunidad(req, res) {
  try {
    const { nombres, apellidop, apellidom, carnet_ci, correo = null, macrodistrito_id, ambitoactividad_id, zona_id } = req.body;

    if (!nombres || !apellidop || !carnet_ci) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios: nombres, apellidop, carnet_ci' });
    }

    if (correo) {
      const existe = await buscarPorCorreo(correo);
      if (existe) return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    const Usuario_defecto = await generarUsuarioDefecto(nombres, apellidop, apellidom);

    const hash = await bcrypt.hash(carnet_ci, 10);

    await crearUsuario({
      nombres,
      apellidop,
      apellidom,
      carnet_ci,
      correo,
      contraseña: hash,
      rol: 'COMUNIDAD',
      Usuario_defecto,
      macrodistrito_id,
      ambitoactividad_id,
      zona_id
    });

    res.status(201).json({
      mensaje: 'Usuario COMUNIDAD creado correctamente',
      Usuario_defecto,
      observacion: 'La contraseña por defecto es el número de carnet de identidad (CI)'
    });

  } catch (error) {
    console.error("Error en registerComunidad:", error.message);
    res.status(500).json({ mensaje: 'Error al registrar usuario COMUNIDAD', error: error.message });
  }
}

export async function cambiarContrasenia(req, res) {
  try {
    const { actual, nueva } = req.body;
    const userId = req.usuario.id;

    console.log('--- CAMBIO CONTRASEÑA ---');
    console.log('User ID desde token:', userId);
    console.log('Contraseña actual recibida:', actual);
    console.log('Contraseña nueva recibida:', nueva);

    if (!actual || !nueva) {
      return res.status(400).json({ mensaje: 'Debe proporcionar la contraseña actual y la nueva' });
    }

    const [rows] = await db.query(
      'SELECT id, contraseña FROM usuarios WHERE id = ? AND eliminado = FALSE',
      [userId]
    );

    const usuario = rows[0];

    if (!usuario) {
      console.log('Usuario NO encontrado en BD');
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    console.log('Hash ACTUAL en BD:', usuario.contraseña);

    const match = await bcrypt.compare(actual, usuario.contraseña);
    console.log('¿Contraseña actual coincide?:', match);

    if (!match) {
      return res.status(401).json({ mensaje: 'La contraseña actual es incorrecta' });
    }

    const mismaContrasenia = await bcrypt.compare(nueva, usuario.contraseña);
    console.log('¿Nueva contraseña = antigua?:', mismaContrasenia);

    if (mismaContrasenia) {
      return res.status(400).json({ mensaje: 'La nueva contraseña no puede ser igual a la actual' });
    }

    console.log('➡️ Enviando nueva contraseña a editarUsuario()');

    await editarUsuario(userId, { contraseña: nueva });

    console.log('✅ editarUsuario ejecutado');

    res.json({ mensaje: 'Contraseña actualizada correctamente' });

  } catch (error) {
    console.error('🔥 Error al cambiar contraseña:', error.message);
    res.status(500).json({ mensaje: 'Error al cambiar contraseña', error: error.message });
  }
}
