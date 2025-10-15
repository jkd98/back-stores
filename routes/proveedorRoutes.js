import express from 'express';
import { validEditProveedor, validEliminarProveedor, validlistAllProvider, validNwProveedor } from '../validators/proveedorValidator.js';
import { manejarErrores } from '../middleware/manejadorErrores.js';
import {
    editarProveedor,
    eliminarProveedor,
    listAllProviders,
    registrarProveedor
} from '../controllers/proveedorController.js';


const router = express.Router();

router.get('/', validlistAllProvider, manejarErrores, listAllProviders);
router.post('/', validNwProveedor, manejarErrores, registrarProveedor);
router.post('/edit', validEditProveedor, manejarErrores, editarProveedor);
router.post('/delete', validEliminarProveedor, manejarErrores, eliminarProveedor);


export default router;