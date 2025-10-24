import { body } from 'express-validator';

export const validarRegistro = [
  // Sanitiza y valida 'name' (elimina espacios, verifica que no esté vacío)
  body('name')
    .trim() // Elimina espacios al inicio/final
    .escape()
    .notEmpty().withMessage('El nombre es obligatorio')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/).withMessage('El nombre solo puede contener letras y espacios')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  // Valida 'lastN' (apellido)
  body('lastN')
    .trim()
    .escape()
    .notEmpty().withMessage('El apellido es obligatorio')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/).withMessage('El nombre solo puede contener letras y espacios')
    .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres'),
  // Valida 'email'
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(), // Convierte a minúsculas y limpia formato
  body('telf')
    .trim()
    .escape()
    .notEmpty().withMessage('El número de celular es obligatorio'),
  // Valida 'pass' (contraseña)
  body('pass')
    .trim()
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/).withMessage('Debe contener al menos una mayúscula')
    .matches(/[0-9]/).withMessage('Debe contener al menos un número')
    .matches(/[-_!@#$%^&*()+={};:,.<>?~]/).withMessage('Debe contener un carácter especial').custom((value) => {
      if (value.includes("'")) {
        throw new Error('La contraseña no puede contener comillas simples');
      }
      return true;
    })
];

export const validConfirmAccount = [
  // Valida 'email'
  body('token')
    .trim()
    .escape()
    .notEmpty().withMessage('El token es obligatorio')
];

export const validarNuevoTknConfirm = [
  // Valida 'email'
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(), // Convierte a minúsculas y limpia formato

];

export const validarLogin = [
  // Valida 'email'
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(), // Convierte a minúsculas y limpia formato

  // Valida 'pass' (contraseña)
  body('pass')
    .trim()
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
];

export const validar2FAData = [
  body('userId')
    .toInt()
    .isInt({ min: 1 }).withMessage('Solo se aceptan numeros mayores o igual a 1'),
  body('code')
    .trim()
    .escape()
    .notEmpty().withMessage('El código no es válido')
    .isNumeric().withMessage('Solo se admiten números')
]

export const validarLogOut = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .normalizeEmail(), // Convierte a minúsculas y limpia formato

]

export const validarTknResetPassEmail = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('Debe ser un email válido')
    .normalizeEmail(), // Convierte a minúsculas y limpia formato
]

export const validarNwPass = [
  body('pass')
    .trim()
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/[A-Z]/).withMessage('Debe contener al menos una mayúscula')
    .matches(/[0-9]/).withMessage('Debe contener al menos un número')
    .matches(/[-_!@#$%^&*()+={};:,.<>?~]/).withMessage('Debe contener un carácter especial'),
];

