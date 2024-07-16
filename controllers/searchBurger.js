const {Burgers} = require('../models/index');


const searchBurger=async(id)=>{
    try {
        const burgerId = parseInt(id);
        const burger = await Burgers.findByPk(burgerId);

        if (burger) {
            return burger;
        }else{
            return 'No se encontró una burger con ese id';
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {searchBurger};