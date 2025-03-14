// src/db.js
const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function connect() {
  try {
    await sql.connect(config);
    console.log('Conexión exitosa a la base de datos');
  } catch (err) {
    console.error('Error de conexión:', err);
  }
}

module.exports = { sql, connect };
