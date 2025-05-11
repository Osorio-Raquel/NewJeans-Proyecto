import {
    crearPropuesta,
    obtenerPropuestasPorUsuario,
    obtenerTodasPropuestas,
    actualizarEstadoPropuesta
  } from '../models/propuestaModel.js';
  
  // POST /api/propuestas
  export async function crearPropuestaController(req, res) {
    const { titulo, descripcion } = req.body;
    const usuario_id = req.usuario.id;
  
    if (!titulo || !descripcion) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
  
    try {
      await crearPropuesta({ titulo, descripcion, usuario_id });
      res.status(201).json({ mensaje: 'Propuesta enviada correctamente' });
    } catch (error) {
      console.error('Error al crear propuesta:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  
  // GET /api/propuestas/mis
  export async function obtenerMisPropuestas(req, res) {
    const usuario_id = req.usuario.id;
    try {
      const propuestas = await obtenerPropuestasPorUsuario(usuario_id);
      res.status(200).json(propuestas);
    } catch (error) {
      console.error('Error al obtener propuestas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  
  // GET /api/propuestas (solo MIGA)
  export async function obtenerTodasLasPropuestas(req, res) {
    try {
      const propuestas = await obtenerTodasPropuestas();
      res.status(200).json(propuestas);
    } catch (error) {
      console.error('Error al listar propuestas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  
  // PATCH /api/propuestas/:id/estado
  export async function cambiarEstadoPropuesta(req, res) {
    const { id } = req.params;
    const { estado, observacion } = req.body;
  
    const estadosValidos = ['pendiente', 'aceptada', 'rechazada'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }
  
    try {
      await actualizarEstadoPropuesta(id, estado, observacion || null);
      res.status(200).json({ mensaje: 'Estado actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  