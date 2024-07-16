const { Usuarios } = require('../models/index');

const postUsuario = async (usuario, nombre, numeroCell, contraseña) => {
    try {
        const newUser = await Usuarios.create({
            user: usuario,
            nombre: nombre,
            numeroCell: numeroCell,
            contraseña: contraseña
        });

        console.log('Usuario creado exitosamente');
        return { created: true, user: newUser };
    } catch (error) {
        console.log(error);
        return { created: false, error: error.message };
    }
}

module.exports = { postUsuario };