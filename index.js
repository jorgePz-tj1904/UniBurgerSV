const express = require('express');
const { sequelize, Burgers, Usuarios } = require('./models');
const cors = require('cors');
const morgan = require('morgan');
const {postBurger} = require('./controllers/postBurger');
const {deleteBurger} = require('./controllers/deleteBurger');
const {postUsuario} = require('./controllers/postUsuario');
const {deleteUsuario} = require('./controllers/deleteUser');
const {searchBurger} = require('./controllers/searchBurger');
const {ValidarUsuario}=require('./controllers/validarUser');
const { login } = require('./controllers/login');
const { editUsuario } = require('./controllers/editUsuario');

const { MercadoPagoConfig, Preference } = require('mercadopago');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

const client = new MercadoPagoConfig({ accessToken: 'APP_USR-3061065036601802-071517-0191331bb80a7fe5c612ed01c33c96a3-1901237197' });



app.get('/', async (req, res) => {
  res.send('¡Bienvenido a la hamburguesería!');
});

app.post('/create_preference', async(req,res)=>{
  const arrayProductos = req.body;

  const newArray=arrayProductos.map(e=>{
    return {
        title:e.nombre,
        quantity: 1,
        unit_price:e.precio,
        currency_id: 'ARS'
    }
  });

  try {
    const body ={
      items:newArray,
      back_urls:{
        success:"https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/integrate-checkout-pro/web#editor_6",
        failure:"https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/integrate-checkout-pro/web#editor_6",
        pending:"https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/integrate-checkout-pro/web#editor_6"
      },
      auto_return: "approved",
      notification_url: "https://uniburgersv.onrender.com/success"
    };
    console.log(body);
    const preference = new Preference(client);
    const result = await preference.create({body});
    res.status(200).json({
      id: result.id
    });
  } catch (error) {
    res.status(500).send("errror al crear la preferencia", error);
  }
});

app.post('/success',async(req, res)=>{
  try {
    const id = await req.query.id;
    console.log(id);
    res.status(200).send("se realizo una compra")
  } catch (error) {
    
  }
})

app.get('/hamburguesas', async (req, res) => {
  try {
    const burgers = await Burgers.findAll();
    res.status(200).send(burgers);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las hamburguesas" });
  }
});

app.post('/postBurger', async(req, res)=>{
  try {
    const { nombre, precio, detalles, imagenURL} = req.body;
    const result = await postBurger(nombre, precio, detalles, imagenURL);
    res.status(200).send('todo ok '+ result);
  } catch (error) {
    res.status(500).send('error');
    console.log(error);
  }
})

app.get('/getBurger/:id', async(req, res)=>{
  try {
    const id = req.params.id;
    const result = await searchBurger(id);

    res.status(200).send(result);

  } catch (error) {
    res.status(500).send(error);
  }
})

app.delete('/deleteBurger/:id', async(req, res)=>{
  try {
    const id = req.params.id;
    const result = await deleteBurger(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send('error al eliminar');
  }
})


app.post('/login', async (req, res) => {
  const { usuario, contraseña } = req.body;

  try {
    const existingUser = await login(usuario, contraseña);

    if (existingUser) {
  
      res.status(200).send('Inicio de sesión exitoso');
    } else {
      res.status(401).send('Credenciales inválidas');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

app.get('/getUsuario', async (req, res) => {
  const { usuario } = req.query;
  try {
    const user = await Usuarios.findOne({ where: { user: usuario } });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
});

app.post('/editUsuario', async (req, res)=>{
  const {id, user, nombre, contraseña, numeroCell}= req.body;
  try {
    const usuarioMod = await editUsuario(id, user, nombre, contraseña, numeroCell);
    res.status(200).send(usuarioMod);
  } catch (error) {
    res.status(500).send(error);
  }
})

app.post('/validarUser', async(req, res)=>{
  try {
    const {validar}= req.body;
    const validate = await ValidarUsuario(validar);
    console.log(validate);
    if (!validate.created) {
      return res.status(400).send(validate);
    }
    res.status(200).send(validate);
  } catch (error) {
    res.status(500).send(error);
  }
})


app.post('/postUsuario', async (req, res) => {
  try {
    const { user, nombre, numeroCell, contraseña } = req.body;

    const validate = await ValidarUsuario(user, numeroCell);
    if (validate.exists) {
      return res.status(400).send(validate.message);
    }

    const result = await postUsuario(user, nombre, numeroCell, contraseña);
    if (result.created) {
      return res.status(201).send('El usuario se creó correctamente');
    } else {
      return res.status(500).send('Error al crear el usuario: ' + result.error);
    }
  } catch (error) {
    res.status(500).send('Error interno del servidor: ' + error.message);
  }
});

app.delete('/deleteUsuario/:id', async(req,res)=>{
  try {
    const id = req.params.id;
    const result = deleteUsuario(id);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
})



app.listen(PORT, async () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida con éxito.');
    await sequelize.sync({ force: false }); // Sincronizar las tablas
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
});
