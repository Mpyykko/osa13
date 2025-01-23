const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isValidYear(value) {
        const currentYear = new Date().getFullYear();
        if (value < 1991 || value > currentYear) {
          throw new Error('Year must be between 1991 and current year');
        }
      }
    }
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'blog'
});

module.exports = Blog;