import { body } from "express-validator";

export const validNwMovimiento = [
    body('tipo')
        .trim()
        .notEmpty().withMessage('El tipo de movimiento es obligatorio')
        .escape(),
    body('codigo')
        .toInt()
        .isInt({ min: 1 }).withMessage('El id debe ser válido'),
    body('cantidad')
        .toInt()
        .isInt({ min: 1 }).withMessage('La cantidad debe ser mayor que 0'),
    body('id_proveedor')
        .optional()
        .toInt()
        .isInt({ min: 1 }).withMessage('El id debe ser válido'),
    body('id_cliente')
        .optional()
        .toInt()
        .isInt({ min: 1 }).withMessage('El id debe ser válido')
]