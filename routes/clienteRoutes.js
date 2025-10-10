import express from 'express'
import { validNwCliente } from '../validators/clienteValidator.js';
import { manejarErrores } from '../middleware/manejadorErrores.js';
import { listAllClientes, registrarCliente } from '../controllers/clienteController.js';


const router = express.Router();

router.get('/', listAllClientes);
router.post('/', validNwCliente, manejarErrores, registrarCliente);

export default router