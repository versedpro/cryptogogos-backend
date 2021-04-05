'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  transactions.init({
    eth_address: DataTypes.STRING,
    tokenId: DataTypes.INTEGER,
    txHash: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transactions',
  });
  return transactions;
};