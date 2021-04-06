"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     *
     */
    queryInterface.addColumn(
      "transactions", // table name
      "value", // new field name
      {
        type: Sequelize.STRING,
      }
    )
    
    queryInterface.addColumn(
      "transactions", // table name
      "status", // new field name
      {
        type: Sequelize.STRING,
      }
    )


    queryInterface.addColumn(
      "transactions", // table name
      "tokenIds", // new field name
      {
        type: Sequelize.ARRAY(Sequelize.STRING)
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    //  queryInterface.removeColumn(
    //   "transactions", // table name
    //   "tokenId", // new field name
    //   {
    //     type: Sequelize.INTEGER,
    //   }
    // )
  },
};
