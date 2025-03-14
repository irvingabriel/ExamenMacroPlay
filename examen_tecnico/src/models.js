// src/models.js

const { Sequelize, DataTypes } = require('sequelize');

// Configuración de la conexión a la base de datos
const sequelize = new Sequelize({
  dialect: 'mssql',  // Usamos 'mssql' para SQL Server
  host: 'localhost',  // Dirección del servidor
  user: 'Gabriel',      // Usuario de la base de datos
  password: 'root',  // Contraseña
  database: 'Examen',   // Nombre de la base de datos
  options: {
    encrypt: true,  // Para conexiones seguras (si es necesario)
    trustServerCertificate: true,  // Si usas un certificado no confiable
  }
});

// Definir el modelo de Usuario
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // El email debe ser único
    validate: {
      isEmail: true,  // Validación de formato de correo
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastPasswordChanged: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  // Opciones adicionales para el modelo
  timestamps: false,  // No se crean los campos `createdAt` y `updatedAt`
  tableName: 'Users', // Nombre de la tabla en la base de datos
});

// Exportar la conexión y el modelo
module.exports = {
  sequelize,
  User,
};
