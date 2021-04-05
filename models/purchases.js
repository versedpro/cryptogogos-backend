'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class purchases extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  purchases.init({
    eth_address: DataTypes.STRING,
    quantity: DataTypes.NUMBER,
    value: {
      type:DataTypes.STRING
    },
    status: {
      type:DataTypes.STRING
    },
    txHash: {
      type:DataTypes.STRING
    }      

  }, {
    sequelize,
    modelName: 'purchases',
  });
  return purchases;
};