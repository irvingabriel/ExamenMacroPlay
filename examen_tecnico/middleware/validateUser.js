const { body, validationResult } = require('express-validator');

// Middleware para la validación de datos
const userValidationRules = [
  body('email')
    .isEmail()
    .withMessage('Proporciona un correo electrónico válido.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe contener al menos 8 caracteres.'),
  // Se pueden añadir más reglas según sea necesario
];

// Middleware para gestionar los errores de validación
const processValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(422).json({ errors: validationErrors.array() }); // Usar código de estado 422
  }
  next();
};

module.exports = {
  userValidationRules,
  processValidationErrors,
};
