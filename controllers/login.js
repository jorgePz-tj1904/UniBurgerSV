const { Usuarios } = require('../models/index');

const login=async(usuario, contraseña)=>{
    if (contraseña === "") {
        try {
            const existingUser = await Usuarios.findOne({
                where: {
                    user: usuario,
                }
            });
            return existingUser
        } catch (error) {
            console.log(error);
        }
    }
    
    try { 
        const existingUser = await Usuarios.findOne({
            where: {
                user: usuario,
                contraseña: contraseña
            }
        });

        return existingUser;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {login};