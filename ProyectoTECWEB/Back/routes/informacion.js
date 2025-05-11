import express from 'express';
import {
  crearInformacionController,
  listarInformacionPublica,
  editarInformacionController
} from '../controllers/informacionController.js';

import { verificarToken } from '../middleware/auth.js';
import { soloMIGA } from '../middleware/validarRol.js';
import { param, body } from 'express-validator';

const router = express.Router();

// Pública
router.get('/', listarInformacionPublica);

// Crear info (solo MIGA)
router.post(
  '/',
  verificarToken,
  soloMIGA,
  body('titulo').notEmpty(),
  body('contenido').notEmpty(),
  crearInformacionController
);

// Editar info (solo MIGA)
router.put(
  '/:id',
  verificarToken,
  soloMIGA,
  param('id').isInt(),
  body('titulo').notEmpty(),
  body('contenido').notEmpty(),
  editarInformacionController
);

export default router;
