const { Usuarios } = require('../models/index');

const editUsuario = async (id, usuario, nombre, contraseña, numeroCell) => {
    try {
      const updatedUser = await Usuarios.update(
        {
          user: usuario,
          nombre: nombre,
          contraseña: contraseña,
          numeroCell: numeroCell
        },
        {
          where: {
            id: id
          }
        }
      );
  
      if (updatedUser[0] === 0) {
        return { success: false, message: 'Usuario no encontrado o no actualizado' };
      }
      return { success: true, message: 'Usuario actualizado correctamente' };
    } catch (error) {
      console.log(error);
      return { success: false, message: 'Error actualizando el usuario' };
    }
  }
  
module.exports= {editUsuario};