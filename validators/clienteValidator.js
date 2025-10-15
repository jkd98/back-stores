import { body, query } from "express-validator";

export const validNwCliente = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/).withMessage('El nombre solo puede contener letras y espacios')
        .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres')
        .escape(),
    body('telf')
        .trim()
        .notEmpty().withMessage('El número de teléfono es obligatorio')
        .isNumeric().withMessage('Solo se admiten números')
        .isLength({ min: 10 }).withMessage('El teléfono debe de tener 10 digitos')
        .escape(),
    body('contacto')
        .trim()
        .notEmpty().withMessage('El contacto no debe ir vacío')
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail() // Convierte a minúsculas y limpia formato
        .escape()
]

export const validEditClient = [
    body('id_cliente')
        .toInt()
        .isInt({ min: 1 }).withMessage('Solo se aceptan numeros mayores o igual a 1'),
    body('nombre')
        .optional()
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/).withMessage('El nombre solo puede contener letras y espacios')
        .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres')
        .escape(),
    body('telf')
        .optional()
        .trim()
        .notEmpty().withMessage('El número de teléfono es obligatorio')
        .isNumeric().withMessage('Solo se admiten números')
        .isLength({ min: 10 }).withMessage('El teléfono debe de tener 10 digitos')
        .escape(),
    body('contacto')
        .optional()
        .trim()
        .notEmpty().withMessage('El contacto no debe ir vacío')
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail() // Convierte a minúsculas y limpia formato
        .escape()
]

export const validEliminarCliente = [
    body('contacto')
        .trim()
        .notEmpty().withMessage('El contacto no debe ir vacío')
        .isEmail().withMessage('Debe ser un email válido')
        .normalizeEmail() // Convierte a minúsculas y limpia formato
        .escape()
]