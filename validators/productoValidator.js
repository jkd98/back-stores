import { body } from "express-validator";

export const validNwProduct = [
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
        .isInt({ min: 10, max: 1000 }).withMessage('Solo se aceptan números mayores a 10 y menore o igual a 1000'),
    body('id_proveedor')
        .toInt()
        .isInt({ min: 1 }).withMessage('Solo se aceptan números positivos'),
]

export const validEditProduct = [
    body('codigo')
        .trim()
        .escape()
        .notEmpty().withMessage('El código no es válido')
        .isNumeric().withMessage('Solo se admiten números')
        .isLength({ min: 10 }).withMessage('El código debe de tener 10 digitos'),
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
        .toInt()
        .isInt({ min: 10, max: 1000 }).withMessage('Solo se aceptan números mayores a 10 y menore o igual a 1000'),
]

export const validFilterProducts = [
    body('nombre')
        .optional()
        .trim()
        .notEmpty().withMessage('El nombre no puede ir vacío')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres')
        .escape(),
    body('categoria')
        .optional()
        .trim()
        .notEmpty().withMessage('La categoría no puede ir vacía')
        .isLength({ min: 2 }).withMessage('La categoría debe tener al menos 2 caracteres')
        .escape(),
    body('proveedor')
        .optional()
        .toInt()
        .isInt({ min: 1 }).withMessage('Solo se aceptan números positivos'),
]

export const validDeleteProduct = [
    body('codigo')
        .trim()
        .escape()
        .notEmpty().withMessage('El código no es válido')
        .isNumeric().withMessage('Solo se admiten números')
        .isLength({ min: 10 }).withMessage('El código debe de tener 10 digitos'),
]
