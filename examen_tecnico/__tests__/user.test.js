

const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/models', () => ({
  User: {
    create: jest.fn().mockResolvedValue({
      id: 1,
      email: 'new@correo.com',
      name: 'Pedro',
      surname: 'Mendez',
    }),
    destroy: jest.fn(),
    findOne: jest.fn().mockResolvedValue(null), 
  },
}));

describe('POST /users/register', () => {
  beforeEach(async () => {
    await require('../src/models').User.destroy({ where: {} });
  });

  test('registra correctamente', async () => {
    const newUser = {
      email: 'new@correo.com',
      password: '123qwe@',
      name: 'pedro',
      surname: 'Mendez',
    };

    const response = await request(app)
      .post('/users/register')
      .send(newUser)
      .expect(201);

    expect(response.body.message).toBe('Usuario registrado');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.email).toBe(newUser.email);
  });

  test('devuelve un error si el correo ya está registrado', async () => {
    const existingUser = {
      email: 'existente@correo.com',
      password: '123qwe@',
      name: 'Gabriel',
      surname: 'Juarez',
    };

  
    require('../src/models').User.findOne.mockResolvedValue(existingUser);

    const newUser = {
      email: 'existe@correo.com',
      password: '123qwe@',
      name: 'Gabriel',
      surname: 'Juarez',
    };

    const response = await request(app)
      .post('/users/register')
      .send(newUser)
      .expect(400);

    expect(response.body.error).toBe('El correo ya está registrado');
  });

  test('devuelve un error si la contraseña no cumple con los requisitos', async () => {
    const invalidUser = {
      email: '@correo.com',
      password: '12345', 
      name: 'pedro',
      surname: 'mendez',
    };

    const response = await request(app)
      .post('/users/register')
      .send(invalidUser)
      .expect(400);

    expect(response.body.error).toBe('La contraseña no es segura');
  });

  test('devuelve un error cuando el correo no tiene formato válido', async () => {
    const invalidEmailUser = {
      email: 'invalid-email',
      password: '123qwe@',
      name: 'pedro',
      surname: 'mendez',
    };

    const response = await request(app)
      .post('/users/register')
      .send(invalidEmailUser)
      .expect(400);

    expect(response.body.error).toBe('El correo electrónico no es válido');
  });
});
