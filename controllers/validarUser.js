const { Usuarios } = require('../models/index');
const { Op } = require('sequelize');

const ValidarUsuario = async (validar) => {
    try {
        // Intentar convertir 'validar' a un número
        const validarNumero = parseInt(validar, 10);

        if (!isNaN(validarNumero)) {
            const existingCell = await Usuarios.findOne({
                where: {
                    numeroCell: validarNumero
                }
            });
            if (existingCell) {
                console.log("El numero ya esta siendo usado.");
                return { created: false, message: "El numero ya esta siendo usado." };
            }
        }

        const existingUser = await Usuarios.findOne({
            where: {
                user: validar
            }
        });

        if (existingUser) {
            console.log('El usuario ya existe');
            return { created: false, message: 'El usuario ya existe' };
        }
        return { created: true, message: 'Se registró correctamente' };
    } catch (error) {
        console.log(error);
    }
};

module.exports = { ValidarUsuario };