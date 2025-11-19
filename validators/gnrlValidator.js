import {query} from 'express-validator';

export const validPagination = [
    query('page')
        .optional({ checkFalsy: true })
        .toInt()
        .isInt({ min: 1 }).withMessage('Solo se aceptan numeros mayores o igual a 1'),
    query('limit')
        .optional({ checkFalsy: true })
        .toInt()
        .isInt({ min: 1 }).withMessage('Solo se aceptan numeros mayores o igual a 1'),
]