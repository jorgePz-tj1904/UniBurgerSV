const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  if (!process.env[config.use_env_variable]) {
    throw new Error(`La variable de entorno ${config.use_env_variable} no está definida.`);
  }
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    dialect: config.dialect,
    protocol: config.dialect,
    logging: config.logging,
    dialectOptions: {
      ssl: true
    }
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Carga de modelos manualmente
const BurgerModel = require('./Burgers')(sequelize, Sequelize.DataTypes);
const UsuarioModel = require('./Usuarios')(sequelize, Sequelize.DataTypes);

// Agrega los modelos al objeto db
db[BurgerModel.name] = BurgerModel;
db[UsuarioModel.name] = UsuarioModel;

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
