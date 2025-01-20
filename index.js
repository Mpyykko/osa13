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

Blog.sync()

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

app.get('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        console.log(blog.toJSON())
        res.json(blog)
    } else {
        res.status(404).end()
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

app.put('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      blog.important = req.body.important
      await blog.save()
      res.json(blog)
    } else {
      res.status(404).end()
    }
  })

  
app.delete('/api/blogs/:id', async (req, res) => {
    try {
      const blog = await Blog.findByPk(req.params.id)
      
      if (blog) {
        await blog.destroy()
        res.status(204).end()
      } else {
        res.status(404).json({ error: 'Blog not found' })
      }
    } catch (error) {
      res.status(500).json({ error: 'Unable to delete blog' })
    }
})
  


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
