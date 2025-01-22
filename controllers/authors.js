const express = require('express');
const router = express.Router();
const { Blog } = require('../models');
const { sequelize } = require('../util/db');

router.get('/', async (req, res) => {
  try {
    const authorsData = await Blog.findAll({
      attributes: [
        'author',
        [sequelize.fn('COUNT', sequelize.col('id')), 'blogs'],
        [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
      ],
      group: ['author'],
      order: [[sequelize.fn('SUM', sequelize.col('likes')), 'DESC']],
    });

    if (authorsData.length === 0) {
      return res.status(404).json({ error: 'No authors found' });
    }

    const response = authorsData.map((author) => ({
      author: author.author,
      blogs: author.dataValues.blogs,
      likes: author.dataValues.likes,
    }));

    res.json(response);
  } catch (error) {
    console.error('Error fetching authors data:', error);
    res.status(500).json({ error: 'Unable to fetch authors data' });
  }
});

module.exports = router;
