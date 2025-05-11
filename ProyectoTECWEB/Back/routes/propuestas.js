import express from 'express';
import {
  crearPropuestaController,
  obtenerMisPropuestas,
  obtenerTodasLasPropuestas,
  cambiarEstadoPropuesta
} from '../controllers/propuestasController.js';

import { verificarToken } from '../middleware/auth.js';
import { soloMIGA, soloComunidad } from '../middleware/validarRol.js';
import { body, param } from 'express-validator';

const router = express.Router();

// Comunidad: enviar nueva propuesta
router.post(
  '/',
  verificarToken,
  soloComunidad,
  body('titulo').notEmpty().withMessage('El título es obligatorio'),
  body('descripcion').notEmpty().withMessage('La descripción es obligatoria'),
  crearPropuestaController
);

// Comunidad: ver sus propuestas
router.get('/mis', verificarToken, soloComunidad, obtenerMisPropuestas);

// MIGA: ver todas las propuestas
router.get('/', verificarToken, soloMIGA, obtenerTodasLasPropuestas);

// MIGA: actualizar estado de una propuesta
router.patch(
  '/:id/estado',
  verificarToken,
  soloMIGA,
  param('id').isInt().withMessage('ID inválido'),
  body('estado').isIn(['pendiente', 'aceptada', 'rechazada']).withMessage('Estado no válido'),
  cambiarEstadoPropuesta
);

export default router;
