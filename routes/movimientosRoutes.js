import express from 'express';

import { validFilter, validNwMovimiento } from '../validators/movimientoValidator.js';
import { validPagination } from '../validators/gnrlValidator.js';

import { manejarErrores } from '../middleware/manejadorErrores.js';
import { filtrarMovimientos, listAllMovs, registrarMovimiento } from '../controllers/movimientosController.js';
import checkAuth from '../middleware/chekAuth.js';


const router = express.Router();

router.use(checkAuth)
router.post('/', validNwMovimiento, manejarErrores, registrarMovimiento);
router.get('/', validPagination, manejarErrores, listAllMovs);
router.post('/filter', validPagination, validFilter ,manejarErrores, filtrarMovimientos);


export default router;