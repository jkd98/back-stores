import express from 'express';

import {
    editarProducto,
    eliminarProductos,
    filtrarProductos,
    listAllProducts,
    registrarProducto

} from '../controllers/productoController.js';
import { validEditProduct, validNwProduct } from '../validators/productoValidator.js';
import { manejarErrores } from '../middleware/manejadorErrores.js';

const router = express.Router();

router.post('/', validNwProduct, manejarErrores, registrarProducto);
router.post('/list', listAllProducts);
router.post('/edit', validEditProduct, manejarErrores, editarProducto);
router.post('/filter', filtrarProductos);
router.post('/delete', eliminarProductos);

export default router