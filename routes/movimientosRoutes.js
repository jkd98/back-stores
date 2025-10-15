import express from 'express';

import { validNwMovimiento } from '../validators/movimientoValidator.js';
import { validPagination } from '../validators/gnrlValidator.js';

import { manejarErrores } from '../middleware/manejadorErrores.js';
import { filtrarMovimientos, listAllMovs, registrarMovimiento } from '../controllers/movimientosController.js';


const router = express.Router();

router.post('/', validNwMovimiento, manejarErrores, registrarMovimiento);
router.get('/', validPagination, manejarErrores, listAllMovs);
router.post('/filter', validPagination, manejarErrores, filtrarMovimientos);


export default router;