import {
    crearInformacion,
    obtenerInformacionPublica,
    actualizarInformacion
  } from '../models/informacionModel.js';
  
  // POST /api/informacion
  export async function crearInformacionController(req, res) {
    const { titulo, contenido } = req.body;
    const creado_por = req.usuario.id;
  
    if (!titulo || !contenido) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
  
    try {
      await crearInformacion({ titulo, contenido, creado_por });
      res.status(201).json({ mensaje: 'Información registrada correctamente' });
    } catch (error) {
      console.error('Error al crear información:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  
  // GET /api/informacion
  export async function listarInformacionPublica(req, res) {
    try {
      const data = await obtenerInformacionPublica();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error al listar info:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  
  // PUT /api/informacion/:id
  export async function editarInformacionController(req, res) {
    const { id } = req.params;
    const { titulo, contenido } = req.body;
  
    try {
      await actualizarInformacion(id, titulo, contenido);
      res.status(200).json({ mensaje: 'Información actualizada' });
    } catch (error) {
      console.error('Error al actualizar información:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  