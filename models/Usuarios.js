const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Usuarios = sequelize.define('Usuarios', {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    user: { type: DataTypes.STRING, allowNull: false },
    contraseña: { type: DataTypes.STRING, allowNull: false }
  });
  return Usuarios;
};