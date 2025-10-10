import express from 'express';
import { validNwProveedor } from '../validators/proveedorValidator.js';
import { manejarErrores } from '../middleware/manejadorErrores.js';
import {
    listAllProviders,
    registrarProveedor
} from '../controllers/proveedorController.js';


const router = express.Router();

router.get('/', listAllProviders);
router.post('/', validNwProveedor, manejarErrores, registrarProveedor);


export default router;