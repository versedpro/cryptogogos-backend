'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user.init({
    eth_address: DataTypes.STRING,
    total_purcahses: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};