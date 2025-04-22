import express from 'express';
import { filtrarPalabras, obtenerPalabrasPopulares } from '../controllers/documentosFiltradoController.js';

const router = express.Router();

router.get('/', filtrarPalabras); // Palabras frecuentes en la BD
router.get('/populares', obtenerPalabrasPopulares); // Palabras más buscadas por usuarios

export default router;