
const express = require('express');
const app = express();
const port = 3000;

//  para manejar errores
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send({ message: 'Hola desde el servidor Node.js!' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
