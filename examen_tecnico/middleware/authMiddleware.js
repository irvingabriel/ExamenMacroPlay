const jwt = require('jsonwebtoken');
const userList = require('../models/user'); // Archivo donde están los usuarios

// Llave utilizada para validar el JWT
const SECRET_TOKEN = 'clave_segura'; // Cambiado el nombre para diferenciar

// Middleware para autenticar el token de autorización
const authenticateToken = (req, res, next) => {
  const bearerToken = req.header('Authorization')?.replace('Bearer ', ''); // Obtener el token

  if (!bearerToken) {
    return res.status(403).json({ message: 'No se encontró el token, acceso denegado.' });
  }

  try {
    // Validar y decodificar el token JWT
    const payload = jwt.verify(bearerToken, SECRET_TOKEN);
    req.currentUser = payload; // Almacenar el usuario en el objeto request

    // Validar la existencia del usuario en la lista
    const foundUser = userList.find(user => user.id === req.currentUser.id);

    if (!foundUser) {
      return res.status(404).json({ message: 'El usuario asociado no fue encontrado.' });
    }

    // Validar la fecha del último cambio de contraseña
    if (foundUser.lastPasswordUpdate && payload.iat < foundUser.lastPasswordUpdate) {
      return res.status(401).json({
        message: 'El token no es válido debido a un cambio reciente de contraseña. Por favor, inicia sesión nuevamente.',
      });
    }

    next(); // Continuar al siguiente middleware o controlador
  } catch (err) {
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

module.exports = authenticateToken;
