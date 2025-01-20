require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL);

class Blog extends Sequelize.Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: 'Blog',
    timestamps: false,
    underscored: true
  }
);

const main = async () => {
  try {
    const blogs = await Blog.findAll();

    if (blogs.length === 0) {
      console.log('No blogs found in the database.');
      return;
    }

    blogs.forEach(blog => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
  } finally {
    sequelize.close();
  }
};

main();
