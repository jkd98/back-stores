import express from 'express';

import {
    registrarProducto

} from '../controllers/productoController.js';
import { validNwProduct } from '../validators/productoValidator.js';
import { manejarErrores } from '../middleware/manejadorErrores.js';

const router = express.Router();

router.post('/', validNwProduct, manejarErrores ,registrarProducto);



export default router