'use strict'
const {
    Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class TokenHolder extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate (models) {
            // define association here
        }
    }

    TokenHolder.init({
        owner_address: {
            type: DataTypes.STRING,
            unique: true
        },
        balance: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'TokenHolder'
    })
    return TokenHolder
}
