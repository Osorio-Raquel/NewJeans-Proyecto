import express from 'express';
import { buscarDocumentos } from '../controllers/documentosBuscarController.js';
const router = express.Router();

router.get('/', buscarDocumentos);

export default router;
