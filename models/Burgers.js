const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Burgers = sequelize.define('Burgers', {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    precio: { type: DataTypes.FLOAT, allowNull: false }, 
    detalles: { type: DataTypes.STRING, allowNull: false },
    imagenURL: { type: DataTypes.STRING, allowNull: true }
  });
  return Burgers;
};
