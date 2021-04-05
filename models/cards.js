'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  cards.init({
    name: DataTypes.STRING,
    serial_number: DataTypes.INTEGER,
    total_supply: DataTypes.INTEGER,
    type: DataTypes.STRING,
    current_supply: DataTypes.INTEGER,
    chance: DataTypes.FLOAT,
    released: {
      type: DataTypes.BOOLEAN
    },
  }, {
    sequelize,
    modelName: 'cards',
  });
  return cards;
};