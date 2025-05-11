import express from 'express';
import { listarPropuestasPublicas } from '../controllers/propuestasPublicasController.js';

const router = express.Router();

// Público: sin token
router.get('/', listarPropuestasPublicas);

export default router;
