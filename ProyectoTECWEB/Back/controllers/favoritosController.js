import {
    agregarFavorito,
    eliminarFavorito,
    listarFavoritosPorUsuario
  } from '../models/favoritosModel.js';
  
  export async function agregarFavoritoController(req, res) {
    const usuarioId = req.usuario.id;
    const { codigo } = req.params;
  
    try {
      await agregarFavorito(usuarioId, codigo);
      res.status(201).json({ mensaje: 'Documento agregado a favoritos' });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'El documento ya está en favoritos' });
      }
      console.error('Error al agregar favorito:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  
  export async function eliminarFavoritoController(req, res) {
    const usuarioId = req.usuario.id;
    const { codigo } = req.params;
  
    try {
      await eliminarFavorito(usuarioId, codigo);
      res.status(200).json({ mensaje: 'Documento eliminado de favoritos' });
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  
  export async function listarFavoritosController(req, res) {
    const usuarioId = req.usuario.id;
  
    try {
      const favoritos = await listarFavoritosPorUsuario(usuarioId);
      res.status(200).json(favoritos);
    } catch (error) {
      console.error('Error al listar favoritos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
  