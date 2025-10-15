import {query} from 'express-validator';

export const validPagination = [
    query('page')
        .optional()
        .toInt()
        .isInt({ min: 1 }).withMessage('Solo se aceptan numeros mayores o igual a 1'),
    query('limit')
        .optional()
        .toInt()
        .isInt({ min: 1 }).withMessage('Solo se aceptan numeros mayores o igual a 1'),
]