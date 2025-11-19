import express from 'express';
import { validEditProveedor, validEliminarProveedor, validNwProveedor } from '../validators/proveedorValidator.js';
import { validPagination } from '../validators/gnrlValidator.js';
import { manejarErrores } from '../middleware/manejadorErrores.js';
import {
    editarProveedor,
    eliminarProveedor,
    listAllProviders,
    obtenerProveedorPorId,
    registrarProveedor
} from '../controllers/proveedorController.js';
import checkAuth from '../middleware/chekAuth.js';


const router = express.Router();

app.use(checkAuth)
router.get('/', validPagination, manejarErrores, listAllProviders);
router.post('/', validNwProveedor, manejarErrores, registrarProveedor);
router.post('/one', obtenerProveedorPorId)
router.post('/edit', validEditProveedor, manejarErrores, editarProveedor);
router.post('/delete', validEliminarProveedor, manejarErrores, eliminarProveedor);


export default router;