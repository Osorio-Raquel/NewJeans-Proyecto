import db from '../db.js';
import bcrypt from 'bcrypt'; // Para el hashing de contraseñas

// Función para buscar usuario por correo
export async function buscarPorCorreo(correo) {
  // Validar el correo
  if (!correo || !/\S+@\S+\.\S+/.test(correo)) {
    throw new Error('Correo no válido');
  }

  try {
    const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return rows[0]; // Si existe el usuario, devuelve el primer registro
  } catch (error) {
    throw new Error('Error al buscar el correo: ' + error.message);
  }
}

// Función para crear un nuevo usuario
export async function crearUsuario(data) {
  const { nombres, apellidop, apellidom, correo, contraseña } = data;

  // Validar los datos de entrada
  if (!nombres || !apellidop || !apellidom || !correo || !contraseña) {
    throw new Error('Todos los campos son requeridos.');
  }

  // Validar formato del correo
  if (!/\S+@\S+\.\S+/.test(correo)) {
    throw new Error('Correo no válido');
  }

  // Hash de la contraseña antes de guardarla
  const hashedPassword = await bcrypt.hash(contraseña, 10); // 10 es el "salt rounds"

  const sql = `
    INSERT INTO usuarios (nombres, apellidop, apellidom, correo, contraseña)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    await db.query(sql, [nombres, apellidop, apellidom, correo, hashedPassword]);
  } catch (error) {
    throw new Error('Error al crear el usuario: ' + error.message);
  }
}
