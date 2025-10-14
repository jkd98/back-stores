import express from 'express';

import {
    editarProducto,
    eliminarProductos,
    filtrarProductos,
    listAllProducts,
    registrarProducto

} from '../controllers/productoController.js';
import { validDeleteProduct, validEditProduct, validFilterProducts, validlistAllProduct, validNwProduct } from '../validators/productoValidator.js';
import { manejarErrores } from '../middleware/manejadorErrores.js';

const router = express.Router();

router.post('/', validNwProduct, manejarErrores, registrarProducto);
router.get('/list', validlistAllProduct, manejarErrores, listAllProducts);
router.post('/edit', validEditProduct, manejarErrores, editarProducto);
router.post('/filter', validFilterProducts, manejarErrores, filtrarProductos);
router.post('/delete', validDeleteProduct, manejarErrores, eliminarProductos);

export default router