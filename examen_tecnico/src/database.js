const { Sequelize } = require('sequelize');

// Configuración de la conexión con SQL Server usando autenticación de Windows
const sequelize = new Sequelize('Examen', 'Gabriel', '', {  
  host: 'GABRIEL',  
  dialect: 'mssql', 
  dialectOptions: {
    trustedConnection: true,  
  },
  logging: false,  
});

module.exports = sequelize;
