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

/*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Registro de usuario'
    #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        nombre: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', format: 'password' }
                    },
                    required: ['nombre','email','password']
                }
            }
        }
    }
*/
router.post('/registro', validarRegistro, manejarErrores, registrarUsuario);
/* #swagger.responses[201] = { description: 'Usuario registrado, pendiente confirmación' } */

/*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Confirmar cuenta'
    #swagger.parameters['token'] = { in: 'path', required: true, type: 'string' }
*/
router.get('/confirmar-cuenta/:token', confirmarCuenta);

/*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Iniciar sesión'
    #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', format: 'email' },
                        password: { type: 'string', format: 'password' }
                    },
                    required: ['email','password']
                }
            }
        }
    }
*/
router.post('/login', validarLogin, manejarErrores ,login);

/*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Verificar código 2FA'
    #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', format: 'email' },
                        code: { type: 'string' }
                    },
                    required: ['email','code']
                }
            }
        }
    }
*/
router.post('/verify-2fa',verify2FA);

/*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Solicitar token de reseteo de contraseña'
    #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: { email: { type: 'string', format: 'email' } },
                    required: ['email']
                }
            }
        }
    }
*/
router.post('/tkn-reset',tokenResetPassword);

/*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Confirmar token de reseteo'
    #swagger.parameters['token'] = { in: 'path', required: true, type: 'string' }
*/
router.get('/new-pass/:token',confirmarTokenReset);

/*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Actualizar contraseña con token válido'
    #swagger.parameters['token'] = { in: 'path', required: true, type: 'string' }
    #swagger.requestBody = {
        required: true,
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: { password: { type: 'string', format: 'password' } },
                    required: ['password']
                }
            }
        }
    }
*/
router.post('/new-pass/:token', validarNwPass, manejarErrores, resetPassword);

export default router;