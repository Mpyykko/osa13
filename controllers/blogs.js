const router = require('express').Router();
const { Blog, User } = require('../models');

const { userExtractor } = require('../middleware/auth');
const { Op } = require('sequelize');

////////////////////////
router.get('/', async (req, res) => {
  try {
    const where = {};

    if (req.query.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { author: { [Op.iLike]: `%${req.query.search}%` } },
      ];
    }

    const blogs = await Blog.findAll({
      where,
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name'],
      },
      order: [['likes', 'DESC']],
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch blogs' });
  }
});

////////////////////////
router.post('/', userExtractor, async (req, res) => {
  try {
    const user = req.user;
    const { title, author, url, likes } = req.body;
    const newBlog = await Blog.create({
      title,
      author,
      url,
      userId: user.id,
      likes: likes || 0,
    });

    res.status(201).json(newBlog);
  } catch (error) {
    res.status(400).json({ error: 'Unable to add blog' });
  }
});

////////////////////////
router.delete('/:id', userExtractor, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (blog.userId !== req.user.id) {
      return res.status(403).json({ error: 'No can do' });
    }

    await blog.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Try again later' });
  }
});

////////////////////////
router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    const { title, author, url } = req.body;
    await blog.update({
      title,
      author,
      url,
    });
    await blog.save();
    res.json(blog);
  } else {
    res.status(404).end();
  }
});

////////////////////////
router.put('/:id/like', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    const { likes } = req.body;
    if (typeof likes !== 'number') {
      return res.status(400).json({ error: 'Likes should be a number' });
    }
    blog.likes = likes;
    await blog.save();
    res.json(blog);
  } else {
    res.status(404).json({ error: 'Blog not found' });
  }
});

////////////////////////
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id, {
      include: {
        model: User,
        attributes: ['name'],
      },
    });
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch blog' });
  }
});

module.exports = router;
