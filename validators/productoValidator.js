import { body } from "express-validator";

export const validNwProduct = [
    body('codigo')
        .toInt()
        .isInt({ min: 0 }).withMessage('Solo se aceptan números mayores o igual a 0'),
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres')
        .escape(),
    body('descip')
        .trim()
        .notEmpty().withMessage('La descripción es obligatoria')
        .isLength({ min: 5 }).withMessage('La descripción debe tener al menos 5 caracteres')
        .escape(),
    body('categoria')
        .trim()
        .notEmpty().withMessage('La categoría es obligatoria')
        .isLength({ min: 2 }).withMessage('La categoría debe tener al menos 2 caracteres')
        .escape(),
    body('unidad')
        .trim()
        .notEmpty().withMessage('La unidad de medida es obligatoria')
        .escape(),
    body('stock_minimo')
        .toInt()
        .isInt({ min: 0 }).withMessage('Solo se aceptan números mayores o igual a 0'),
    body('stock_actual')
        .toInt()
        .isInt({ min: 0 }).withMessage('Solo se aceptan números mayores o igual a 0'),
    body('id_proveedor')
        .toInt()
        .isInt({ min: 1 }).withMessage('Solo se aceptan números positivos'),
]

export const validEditProduct = [
    body('codigo')
        .toInt()
        .isInt({ min: 0 }).withMessage('Solo se aceptan números mayores o igual a 0'),
    body('nombre')
        .optional()
        .trim()
        .notEmpty().withMessage('El nombre no puede ir vacío')
        .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres')
        .escape(),
    body('descip')
        .optional()
        .trim()
        .notEmpty().withMessage('La descripción no puede ir vacía')
        .isLength({ min: 5 }).withMessage('La descripción debe tener al menos 5 caracteres')
        .escape(),
    body('categoria')
        .optional()
        .trim()
        .notEmpty().withMessage('La categoría no puede ir vacía')
        .isLength({ min: 2 }).withMessage('La categoría debe tener al menos 2 caracteres')
        .escape(),
    body('unidad')
        .optional()
        .trim()
        .notEmpty().withMessage('La unidad de medida no puede ir vacía')
        .escape(),
    body('stock_minimo')
        .optional()
        .toInt()
        .isInt({ min: 0 }).withMessage('Solo se aceptan números mayores o igual a 0'),

]

