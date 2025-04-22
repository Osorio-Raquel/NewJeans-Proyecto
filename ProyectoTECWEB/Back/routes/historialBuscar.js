import express from 'express';
import { buscarPalabrasClave,busquedaGoogleLike, } from '../controllers/historialBuscarController.js';

const router = express.Router();
router.get('/google-like', busquedaGoogleLike);
router.get('/', buscarPalabrasClave); // GET /api/historial-busqueda?palabra=alimentacion

export default router;
