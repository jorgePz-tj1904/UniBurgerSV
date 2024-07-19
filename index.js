const express = require('express');
const { sequelize, Burgers, Usuarios } = require('./models');
const cors = require('cors');
const morgan = require('morgan');
const { postBurger } = require('./controllers/postBurger');
const { deleteBurger } = require('./controllers/deleteBurger');
const { postUsuario } = require('./controllers/postUsuario');
const { deleteUsuario } = require('./controllers/deleteUser');
const { searchBurger } = require('./controllers/searchBurger');
const { ValidarUsuario } = require('./controllers/validarUser');
const { login } = require('./controllers/login');
const { editUsuario } = require('./controllers/editUsuario');
const http = require('http');
const { Server } = require('socket.io');

const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const { default: axios } = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Crea el servidor HTTP
const server = http.createServer(app);

// Inicializa Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

const client = new MercadoPagoConfig({ accessToken: 'APP_USR-3061065036601802-071517-0191331bb80a7fe5c612ed01c33c96a3-1901237197' });
const payment = new Payment(client);

const Payments = require('./models/Pagos')(sequelize);

app.get('/', async (req, res) => {
  res.send('¡Bienvenido a la hamburguesería!');
});

app.post('/create_preference', async (req, res) => {
  const arrayProductos = req.body;

  const newArray = arrayProductos.map(e => {
    return {
      title: e.nombre,
      quantity: 1,
      unit_price: e.precio,
      currency_id: 'ARS'
    }
  });

  try {
    const body = {
      items: newArray,
      back_urls: {
        success: "https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/integrate-checkout-pro/web#editor_6",
        failure: "https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/integrate-checkout-pro/web#editor_6",
        pending: "https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/integrate-checkout-pro/web#editor_6"
      },
      auto_return: "approved",
      notification_url: "https://uniburgersv.onrender.com/success"
    };
    console.log(body);
    const preference = new Preference(client);
    const result = await preference.create({ body });
    res.status(200).json({
      id: result.id
    });
  } catch (error) {
    res.status(500).send("errror al crear la preferencia", error);
  }
});

app.post('/success', async (req, res) => {
  const id = req.query.id;

  if (!id) {
    return res.status(400).send("ID de pago no proporcionado.");
  }

  try {
    const response = await payment.get({ id: id });
    const paymentData = response; // Puedes ajustar esto según cómo obtienes la respuesta real de payment.get

    const paymentDetails = {
      paymentDate: paymentData.date_approved,
      paymentStatus: paymentData.status,
      paymentStatusDetail: paymentData.status_detail,
      payer: {
        email: paymentData.payer.email,
        firstName: paymentData.payer.first_name,
        lastName: paymentData.payer.last_name,
        id: paymentData.payer.id,
        identification: paymentData.payer.identification,
        phone: paymentData.payer.phone
      },
      paymentMethod: {
        id: paymentData.payment_method.id,
        type: paymentData.payment_type_id,
        issuerId: paymentData.payment_method.issuer_id
      },
      transactionAmount: paymentData.transaction_amount,
      currency: paymentData.currency_id,
      description: paymentData.description,
      additionalInfo: paymentData.additional_info
    };

    await Payments.create(paymentDetails);

    console.log(paymentDetails);
    io.emit('paymentDetails', paymentDetails);

    res.status(200).send(paymentDetails);

  } catch (error) {
    console.error('Error al obtener el pago:', error);
    res.status(500).send({
      message: 'Error al obtener el pago',
      error: error.message
    });
  }
});


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


server.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida con éxito.');
    await sequelize.sync({ force: false }); // Sincronizar las tablas
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
});
