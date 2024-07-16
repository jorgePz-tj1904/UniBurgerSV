const {Burgers} = require('../models/index');

const postBurger= async(nombre, precio, detalles, img)=>{
    try {
        const [burger, created] = await Burgers.findOrCreate({
            where:{
                nombre:nombre,
                precio: precio,
                detalles: detalles,
                imagenURL:img
            },
            defaults:{
                nombre:nombre,
                precio: precio,
                detalles: detalles,
                imagenURL:img
            }
        });
        
        if (!created) {
            return burger;
        }else{
            console.log('la Hamburguesa ya existe');
            return created;
        }
        
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports={postBurger};
