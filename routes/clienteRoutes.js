import express from 'express'
import { validEditClient, validEliminarCliente, validNwCliente } from '../validators/clienteValidator.js';
import { validPagination } from '../validators/gnrlValidator.js';
import { manejarErrores } from '../middleware/manejadorErrores.js';

import { editarCliente, eliminarCliente, listAllClientes, registrarCliente } from '../controllers/clienteController.js';


const router = express.Router();

router.get('/', validPagination, manejarErrores, listAllClientes);
router.post('/', validNwCliente, manejarErrores, registrarCliente);
router.post('/edit', validEditClient, manejarErrores, editarCliente);
router.post('/delete', validEliminarCliente, manejarErrores, eliminarCliente);

export default router