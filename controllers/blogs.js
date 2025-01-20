const router = require('express').Router()
const { Blog } = require('../models')

////////////////////////
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll()
    res.json(blogs)
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch blogs' })
  }
})

////////////////////////
router.post('/', async (req, res) => {
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

////////////////////////
router.get('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    res.json(blog)
  } else {
    res.status(404).end()
  }
})

////////////////////////
router.delete('/:id', async (req, res) => {
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

////////////////////////
router.put('/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      await blog.update(req.body)
      await blog.save()
      res.json(blog)
    } else {
      res.status(404).end()
    }
  })

////////////////////////
router.put('/:id/like', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)
  if (blog) {
    const { likes } = req.body
    if (typeof likes !== 'number') {
      return res.status(400).json({ error: 'Likes should be a number' })
    }
    blog.likes = likes
    await blog.save()
    res.json(blog)
  } else {
    res.status(404).json({ error: 'Blog not found' })
  }
})



module.exports = router
