const { sql } = require('../src/db'); // Ruta a la base de datos
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET; // Variable de entorno para la clave

// Función para agregar un nuevo usuario al sistema
const createUser = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!(email && password && firstName && lastName)) {
    return res.status(400).json({ message: 'Completa todos los campos requeridos.' });
  }

  try {
    // Verificar si el usuario ya existe
    const userExists = await sql.query`SELECT * FROM Users WHERE email = @UserEmail`;
    if (userExists.recordset.length > 0) {
      return res.status(409).json({ message: 'El correo ya está registrado.' });
    }

    // Verificar requisitos de contraseña
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordPattern.test(password)) {
      return res.status(400).json({ message: 'La contraseña no cumple con los requisitos mínimos.' });
    }

    // Hashear la contraseña
    const encryptedPassword = await bcrypt.hash(password, 12);

    // Agregar nuevo usuario en la base de datos
    const query = `INSERT INTO Users (email, password, first_name, last_name) 
                   VALUES (@UserEmail, @UserPassword, @FirstName, @LastName)`;

    await sql.query({
      query: query,
      params: {
        UserEmail: email,
        UserPassword: encryptedPassword,
        FirstName: firstName,
        LastName: lastName,
      },
    });

    res.status(201).json({
      message: 'Usuario creado correctamente.',
      user: { email },
    });
  } catch (error) {
    console.error('Error al crear usuario:', error.message);
    res.status(500).json({ message: 'Error en el servidor.', error: error.message });
  } finally {
    sql.close();
  }
};

// Función para autenticar usuario
const authenticateUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await sql.query`SELECT * FROM Users WHERE email = @UserEmail`;
    if (userResult.recordset.length === 0) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    }

    const user = userResult.recordset[0];
    const passwordValid = bcrypt.compareSync(password, user.password);

    if (!passwordValid) {
      return res.status(401).json({ message: 'Usuario o contraseña incorrectos.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '2h' });

    res.status(200).json({ message: 'Acceso concedido', token });
  } catch (error) {
    console.error('Error en autenticación:', error.message);
    res.status(500).json({ message: 'Ocurrió un error.', error: error.message });
  } finally {
    sql.close();
  }
};

// Exportar las funciones
module.exports = {
  createUser,
  authenticateUser,
};
