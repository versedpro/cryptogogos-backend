'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tokens.init({
    token_id: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    supply_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    serial_number: DataTypes.INTEGER,
    tribe: DataTypes.STRING,
    total_supply: DataTypes.INTEGER,
    current_supply: DataTypes.INTEGER,
    minted: {
      type: DataTypes.BOOLEAN
    },
    owner_address: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'tokens',
  });
  return tokens;
};