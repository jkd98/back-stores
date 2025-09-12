import express from "express";

import {
    registrarUsuario,
    confirmarCuenta,
    login,
    verify2FA,
    tokenResetPassword,
    confirmarTokenReset,
    resetPassword
} from "../controllers/usuarioController.js";

import {
    validarRegistro,
    validarLogin,
    validarNwPass
} from "../validators/usuarioValidator.js";

import { manejarErrores } from "../middleware/manejadorErrores.js";

// con esto puedo usar los metodos http
const router = express.Router();

router.post('/registro', validarRegistro, manejarErrores, registrarUsuario);
router.get('/confirmar-cuenta/:token', confirmarCuenta);
router.post('/login', validarLogin, manejarErrores ,login);
router.post('/verify-2fa',verify2FA);
router.post('/tkn-reset',tokenResetPassword);
router.get('/new-pass/:token',confirmarTokenReset);
router.post('/new-pass/:token', validarNwPass, manejarErrores, resetPassword);



export default router;