import express from 'express';

import {
    editarProducto,
    eliminarProductos,
    filtrarProductos,
    listAllProducts,
    registrarProducto

} from '../controllers/productoController.js';
import { validDeleteProduct, validEditProduct, validFilterProducts, validNwProduct } from '../validators/productoValidator.js';
import { validPagination } from '../validators/gnrlValidator.js';
import { manejarErrores } from '../middleware/manejadorErrores.js';
import checkAuth from '../middleware/chekAuth.js';

const router = express.Router();

router.post('/', validNwProduct, manejarErrores, checkAuth,registrarProducto);
router.get('/list', validPagination , manejarErrores, checkAuth, listAllProducts);
router.post('/edit', validEditProduct, manejarErrores, checkAuth ,editarProducto);
router.post('/filter', validPagination, validFilterProducts, manejarErrores, checkAuth, filtrarProductos);
router.post('/delete', validDeleteProduct, manejarErrores, checkAuth, eliminarProductos);

export default router