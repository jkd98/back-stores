import { body } from "express-validator";

export const validNwProveedor = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
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