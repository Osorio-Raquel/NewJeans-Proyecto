import express from 'express';
import {
  agregarFavoritoController,
  eliminarFavoritoController,
  listarFavoritosController
} from '../controllers/favoritosController.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/:codigo', verificarToken, agregarFavoritoController);
router.delete('/:codigo', verificarToken, eliminarFavoritoController);
router.get('/', verificarToken, listarFavoritosController);

export default router;
