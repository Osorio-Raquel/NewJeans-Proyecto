import db from '../db.js';

export async function buscarPorCorreo(correo) {
  const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
  return rows[0];
}

export async function crearUsuario(data) {
  const { nombres, apellidop, apellidom, correo, contraseña } = data;
  const sql = `
    INSERT INTO usuarios (nombres, apellidop, apellidom, correo, contraseña)
    VALUES (?, ?, ?, ?, ?)
  `;
  await db.query(sql, [nombres, apellidop, apellidom, correo, contraseña]);
}
