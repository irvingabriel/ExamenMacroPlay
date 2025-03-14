const express = require('express');
const mssql = require('mssql');
const routes = require('../routes/userRoutes'); // Archivo de rutas de usuario

const server = express();

// Configuración para la conexión con la base de datos
const databaseConfig = {
  user: 'Gabriel', // Usuario de conexión
  password: 'root', // Contraseña del usuario
  server: 'root', // Dirección del servidor o nombre del host
  database: 'Examen', // Nombre de la base de datos
  options: {
    encrypt: true, // Habilitar cifrado (si se requiere)
    trustServerCertificate: true, // Confianza en certificado de servidor///
    enableArithAbort: true, // Abortar consultas con errores aritméticos
  },
};

// Establecer la conexión con la base de datos
mssql
  .connect(databaseConfig)
  .then(() => console.log('Base de datos conectada correctamente.'))
  .catch((error) => console.error('Error al conectar la base de datos:', error));

server.use(express.json());

// Configuración de rutas
server.use('/api/users', routes);

// Configuración del puerto
const APP_PORT = process.env.PORT || 5000;
server.listen(APP_PORT, () => {
  console.log(`Servidor iniciado en el puerto ${APP_PORT}`);
});
