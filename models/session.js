module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define('Session', {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        allowNull: false,
      },
      sessionToken: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }, {
      timestamps: true,
    });
  
    return Session;
  };
  