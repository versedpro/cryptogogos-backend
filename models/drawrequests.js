'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class drawrequests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  drawrequests.init({
    user_address: DataTypes.STRING,
    signature: DataTypes.STRING,
    token_id: DataTypes.NUMBER
  }, {
    sequelize,
    modelName: 'drawrequests',
  });
  return drawrequests;
};