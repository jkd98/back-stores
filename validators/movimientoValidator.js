import { body } from "express-validator";

export const validNwMovimiento = [
    body('tipo')
        .trim()
        .notEmpty().withMessage('El tipo de movimiento es obligatorio')
        .escape(),
    body('codigo')
        .trim()
        .escape()
        .notEmpty().withMessage('El código no es válido')
        .isNumeric().withMessage('Solo se admiten números')
        .isLength({ min: 10 }).withMessage('El código debe de tener 10 digitos'),
    body('cantidad')
        .toInt()
        .isInt({ min: 1 }).withMessage('La cantidad debe ser mayor que 0'),
    body('responsable')
        .optional()
        .toInt()
        .isInt({ min: 1 }).withMessage('El id debe ser válido'),
]


export const validFilter = [
    // SANITIZACIÓN
    body('fecha')
        .optional()
        .trim() // Elimina espacios en blanco
        .escape() // Convierte caracteres HTML peligrosos
        .isDate({
            format: 'YYYY-MM-DD',
            delimiters: ['-'],
            strictMode: true
        })
        .withMessage('Formato de fecha inválido. Use YYYY-MM-DD'),

    body('tipo')
        .optional()
        .trim()
        .escape()
        .isIn(['Entrada', 'Salida'])
        .withMessage('El tipo debe ser Entrada o Salida'),

    body('id_producto')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de producto inválido')
        .toInt(), // Convierte a número entero

    body('cantidad')
        .optional()
        .isInt({ min: 1 })
        .withMessage('La cantidad debe ser un número entero mayor a 0')
        .toInt(),

    body('id_proveedor')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de proveedor inválido')
        .toInt(),

    body('id_cliente')
        .optional()
        .isInt({ min: 1 })
        .withMessage('ID de cliente inválido')
        .toInt(),

    body('referencia')
        .optional()
        .trim()
        .escape()
        .isLength({ max: 50 })
        .withMessage('La referencia no puede exceder 50 caracteres')
];