const {Burgers} = require('../models/index');

const deleteBurger = async (id)=>{
    try {
        const burgerId = parseInt(id);
        const burgerToDelete = await Burgers.findByPk(burgerId);
        
        
        if(burgerToDelete){
            await burgerToDelete.destroy();
            return 'Eliminada exitosamente';
        }else{
            console.log('no se elimió correctamente');
            throw new Error('No se encontró la burger');
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {deleteBurger};