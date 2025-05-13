import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { crearUsuario, buscarPorCorreo } from '../models/usuariosModel.js';

export async function register(req, res) {
  try {
    const { nombres, apellidop, apellidom, correo, contraseña, rol } = req.body;

    if (!nombres || !correo || !contraseña) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    const usuarioExistente = await  crearUsuario(data);
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
    const { correo, contraseña } = req.body;
    const usuario = await buscarPorCorreo(correo);

    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

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
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
}

export function perfil(req, res) {
  res.json({
    mensaje: 'Token válido',
    usuario: req.usuario
  });
}
