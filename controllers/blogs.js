const router = require('express').Router()
const { Blog, User } = require('../models')

const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { userExtractor } = require('../middleware/auth')


const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error) {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}


////////////////////////
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      }
    })
    res.json(blogs)
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch blogs' })
  }
})

////////////////////////
router.post('/', userExtractor, async (req, res) => {
  try {
    const user = req.user
    const { title, author, url } = req.body
    const newBlog = await Blog.create({
      title,
      author,
      url,
      userId: user.id,
    })

    res.status(201).json(newBlog)
  } catch (error) {
    res.status(400).json({ error: 'Unable to add blog' })
  }
})



////////////////////////
router.delete('/:id', userExtractor, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id)

    if (blog.userId !== req.user.id) {
      return res.status(403).json({ error: 'No can do' })
    }

    await blog.destroy()
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: 'Try again later' })
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
