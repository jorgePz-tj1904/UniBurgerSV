const express = require('express');
const { sequelize, Burgers, Usuarios } = require('./models');
const { json } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la hamburguesería!');
});

app.get('/hamburguesas', async(req, res)=>{
    try {
        // const burgers = Burgers.findALL();
        const burgers= [{ nombre: "hamburguesa completa", precio: "2200", id:1 }, { nombre: "hamburguesa doble", precio: "3200", id:2 }, {nombre: "chesseBurger", precio: "2500", id:3}];

        res.json(burgers);
    } catch (error) {
        res.status(500).json({error:"Error al obtener las hamburguesas"})
    }
}) 
app.get('/usuarios', async(req, res)=>{
    try {
        const usuarios = Usuarios.findAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({error:"Error al obtener usuarios"});
    }
})


app.listen(PORT, async () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  await sequelize.authenticate();
  console.log('Conexión a la base de datos establecida con éxito.');
});

