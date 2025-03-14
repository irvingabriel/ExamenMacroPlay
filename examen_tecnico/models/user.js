const request = require('supertest');
const app = require('../src/app');  // Suponiendo que tu servidor esté en `src/app.js`

// Simulando un "modelo" de usuarios en memoria (no real)
const users = [
  { 
    id: 1, 
    email: 'usuario@ejemplo.com', 
    password: '$2a$10$5hyXByL3qYEkNhR7bHAlS.wYbR9FHi3b5OG6qXUSJ2j6Yv77zoUxi', // Contraseña encriptada: 'Password123!'
    firstName: 'Juan',
    lastName: 'Pérez'
  }
];

// Simulando una función de registro de usuario (esto es solo para pruebas)
const createUser = async (email, password, firstName, lastName) => {
  // Simulamos la creación del usuario sin interactuar con la base de datos
  const hashedPassword = password;  // Aquí podrías encriptar la contraseña si es necesario
  const newUser = { id: users.length + 1, email, password: hashedPassword, firstName, lastName };
  users.push(newUser);
  return newUser;
};

describe('POST /users/register', () => {
  it('debería registrar un nuevo usuario', async () => {
    const response = await request(app)
      .post('/users/register')
      .send({
        email: 'test@dominio.com',
        password: '123456qwe@',
        firstName: 'Ricardo',
        lastName: 'Juarez',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Usuario registrado exitosamente');
    expect(response.body.user.email).toBe('test@dominio.com');
  });
});

describe('POST /users/login', () => {
  it('debería iniciar sesión con credenciales correctas', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({
        email: 'test@dominio.com',
        password: 'Password123!',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Inicio de sesión exitoso');
    expect(response.body.token).toBeDefined();
  });
});
