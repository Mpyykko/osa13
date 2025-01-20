require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express')
const app = express()

app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL)

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
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

const syncDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connection established successfully.')
    
    await sequelize.sync()
    console.log('Database synchronized successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

syncDatabase()

app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    res.json(blogs)
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch blogs' })
  }
})


app.post('/api/blogs', async (req, res) => {
  const { title, author, url } = req.body

  try {
    const newBlog = await Blog.create({
      title,
      author,
      url
    })
    res.status(201).json(newBlog)
  } catch (error) {
    res.status(500).json({ error: 'Unable to add blog' })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
