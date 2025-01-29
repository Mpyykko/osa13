const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:mysecretpassword@localhost:5432/postgres');
const queryInterface = sequelize.getQueryInterface();

module.exports = {
  up: async () => {
    await queryInterface.addColumn('users', 'is_disabled', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });

    await queryInterface.createTable('sessions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  },

  down: async () => {
    await queryInterface.dropTable('sessions');
    await queryInterface.removeColumn('users', 'is_disabled');
  },
};
