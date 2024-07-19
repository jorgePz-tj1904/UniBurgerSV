const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payments = sequelize.define('Pagos', {
    id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    paymentDate: { type: DataTypes.DATE, allowNull: false },
    paymentStatus: { type: DataTypes.STRING, allowNull: false },
    paymentStatusDetail: { type: DataTypes.STRING, allowNull: false },
    payerEmail: { type: DataTypes.STRING, allowNull: false },
    payerFirstName: { type: DataTypes.STRING, allowNull: false },
    payerLastName: { type: DataTypes.STRING, allowNull: false },
    payerId: { type: DataTypes.STRING, allowNull: false },
    payerIdentification: { type: DataTypes.JSON, allowNull: false },
    payerPhone: { type: DataTypes.JSON, allowNull: true },
    paymentMethodId: { type: DataTypes.STRING, allowNull: false },
    paymentTypeId: { type: DataTypes.STRING, allowNull: false },
    issuerId: { type: DataTypes.STRING, allowNull: true },
    transactionAmount: { type: DataTypes.FLOAT, allowNull: false },
    currency: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING, allowNull: true },
    additionalInfo: { type: DataTypes.JSON, allowNull: true }
  });
  return Payments;
};