const { Usuarios } = require('../models/index');

const deleteUsuario= async(id)=>{
    try {
        const userId = parseInt(id);
        const usuarioToDelete = await Usuarios.findByPk(userId);

        if(usuarioToDelete){
            const result = await usuarioToDelete.destroy();
            return result;
        }else{
            console.log('no se elimió correctamente');
            throw new Error('No se eliminó correctamente');
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {deleteUsuario};