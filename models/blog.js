const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');
const User = require('./user');

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Title cannot be empty'
      },
      len: {
        args: [5, 255],
        msg: 'Title should be between 5 and 255 characters'
      }
    }
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Author cannot be empty'
      }
    }
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: {
        msg: 'Must be a valid URL'
      }
    }
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'Likes must be an integer'
      },
      min: {
        args: [0],
        msg: 'Likes cannot be less than 0'
      }
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
  modelName: 'blog',
  underscored: true,
  timestamps: true,
  tableName: 'blogs',
});

Blog.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

module.exports = Blog;
