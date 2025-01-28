const router = require('express').Router();
const { User, Blog, Team, ReadingList } = require('../models');

////////////////////////////////////////
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Blog,
          attributes: ['title', 'author', 'url', 'likes'],
        },
        {
          model: Team,
          attributes: ['name', 'id'],
          through: {
            attributes: []
          }
        },
      ],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'No users' });
  }
});

////////////////////////////////////////
router.post('/', async (req, res, next) => {
  try {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
      return res
        .status(400)
        .json({ error: 'Name, username, and password are required!' });
    }

    const user = await User.create({ name, username, password });
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});


////////////////////////////////////////
router.get('/:id', async (req, res) => {
  try {
    const readParam = req.query.read;
    const where = {};
    
    if (readParam === 'true' || readParam === 'false') {
      where.read = readParam === 'true';
    }

    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Blog,
          as: 'reading_list',
          through: {
            model: ReadingList,
            as: 'reading_list_data',
            where: where,
            attributes: ['id', 'read']
          },
          attributes: ['id', 'title', 'url', 'author', 'likes']
        }
      ]
    });

    if (!user) {
      return res.status(404).end();
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

////////////////////////////////////////
router.put('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name;
    await user.save();

    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;