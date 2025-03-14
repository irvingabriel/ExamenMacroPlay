const express = require('express');
const { validateUser, handleValidationErrors } = require('../middleware/validateUser');
const userHandler = require('../controllers/userController'); // Cambiado a un nombre más genérico
const { param, body } = require('express-validator');
const apiRouter = express.Router(); // Cambié el nombre del enrutador

// Ruta para registrar un nuevo usuario
apiRouter.post(
  '/register',
  [
    body('email')
      .isEmail()
      .withMessage('Introduce un correo electrónico válido.'),
    body('email').custom(async (email) => {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('El correo ya existe en el sistema.');
      }
      return true;
    }),
    body('password')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage(
        'La contraseña debe contener al menos 8 caracteres, incluyendo una mayúscula, una minúscula, un número y un carácter especial.'
      ),
  ],
  handleValidationErrors, // Valida los datos primero
  userHandler.registerUser // El controlador procesa el registro
);

// Ruta para modificar los datos de un usuario
apiRouter.put(
  '/update',
  [
    body('userId')
      .isInt()
      .withMessage('El identificador de usuario debe ser un número entero.'),
    body('firstName')
      .optional()
      .isLength({ min: 1 })
      .withMessage('El nombre no debe estar vacío.'),
    body('lastName')
      .optional()
      .isLength({ min: 1 })
      .withMessage('El apellido no debe estar vacío.'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Introduce un correo válido si proporcionas uno nuevo.'),
    body('password')
      .optional()
      .isLength({ min: 8 })
      .withMessage('La nueva contraseña debe tener al menos 8 caracteres.'),
  ],
  handleValidationErrors, // Validaciones previas
  userHandler.updateUser // Controlador para actualizar datos
);

// Ruta para eliminar un usuario por su identificador
apiRouter.delete(
  '/delete/:userId',
  [
    param('userId')
      .isInt()
      .withMessage('El ID debe ser un número entero válido.')
  ],
  handleValidationErrors, // Validación del ID
  userHandler.deleteUser // Procesa la eliminación
);

// Ruta para obtener los detalles de un usuario específico
apiRouter.get(
  '/:userId',
  [
    param('userId')
      .isInt()
      .withMessage('El identificador debe ser un número entero válido.')
  ],
  handleValidationErrors, // Verifica el parámetro ID
  userHandler.getUserById // Obtiene la información del usuario
);

module.exports = apiRouter; // Exporta el enrutador
