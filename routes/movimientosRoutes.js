import express from 'express';
import { validNwMovimiento } from '../validators/movimientoValidator.js';
import { manejarErrores } from '../middleware/manejadorErrores.js';
import { registrarMovimiento } from '../controllers/movimientosController.js';


const router = express.Router();

router.post('/', validNwMovimiento, manejarErrores, registrarMovimiento);


export default router;