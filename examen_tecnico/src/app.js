const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const helmet = require('helmet'); // Para mejorar la seguridad HTTP
const xss = require('xss-clean'); // Protección contra ataques de tipo XSS
const app = express();

// Aplicación de middlewares
app.use(helmet()); // Activar protección con Helmet
app.use(xss()); // Sanitización de entradas contra XSS
app.use(express.json()); // Lectura de JSON en las solicitudes

// Modelo ficticio para representar a los usuarios
const { User } = require('./models'); // Asumimos un modelo básico

// Configuración de Swagger para documentación
const swaggerConfig = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API para Gestión de Usuarios',
      version: '1.0.0',
      description: 'API diseñada para gestionar usuarios y autenticar su acceso.',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Dirección del servidor
      },
    ],
  },
  apis: ['./src/app.js'], // Archivo actual para documentar los endpoints
};

// Inicialización de Swagger
const swaggerDocs = swaggerJSDoc(swaggerConfig);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Endpoint: Registro de un nuevo usuario
app.post('/users/register', async (req, res) => {
  const { email, password, name, surname } = req.body;

  // Validación básica del correo electrónico
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ error: 'Por favor, proporciona un correo válido.' });
  }

  // Verificar longitud de la contraseña
  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
  }

  // Comprobar si el usuario ya existe
  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    return res.status(409).json({ error: 'El correo ya está registrado en el sistema.' });
  }

  // Crear y guardar al nuevo usuario
  const createdUser = await User.create({
    email,
    password,
    name,
    surname,
  });

  res.status(201).json({
    message: 'Registro exitoso del usuario.',
    user: { id: createdUser.id, email, name, surname },
  });
});

// Endpoint: Actualización de un usuario existente
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { email, name, surname } = req.body;

  // Buscar el usuario por su ID
  const existingUser = await User.findOne({ where: { id } });

  if (!existingUser) {
    return res.status(404).json({ error: 'Usuario no encontrado en el sistema.' });
  }

  // Actualizar campos disponibles
  existingUser.email = email || existingUser.email;
  existingUser.name = name || existingUser.name;
  existingUser.surname = surname || existingUser.surname;

  await existingUser.save();

  res.status(200).json({
    message: 'Datos del usuario actualizados exitosamente.',
    user: { id: existingUser.id, email: existingUser.email, name: existingUser.name, surname: existingUser.surname },
  });
});

// Endpoint: Consultar información de un usuario por ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  // Buscar el usuario
  const userData = await User.findOne({ where: { id } });

  if (!userData) {
    return res.status(404).json({ error: 'No se encontró ningún usuario con el ID proporcionado.' });
  }

  res.status(200).json({
    id: userData.id,
    email: userData.email,
    name: userData.name,
    surname: userData.surname,
  });
});

// Exportar la aplicación
module.exports = app;

// Iniciar servidor solo cuando no estamos corriendo pruebas
if (require.main === module) {
  app.listen(3000, () => {
    console.log('Aplicación escuchando en el puerto 3000.');
  });
}
