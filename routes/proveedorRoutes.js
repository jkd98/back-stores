import express from 'express';
import { validNwProveedor } from '../validators/proveedorValidator.js';
import { manejarErrores } from '../middleware/manejadorErrores.js';
import {
    registrarProveedor
} from '../controllers/proveedorController.js';


const router = express.Router();

router.post('/', validNwProveedor, manejarErrores, registrarProveedor)


export default router;