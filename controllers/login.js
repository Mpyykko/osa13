const jwt = require('jsonwebtoken');
const router = require('express').Router();
const { SECRET } = require('../util/config');
const { User, Session } = require('../models');

///////////////////////////
router.post('/', async (request, response) => {
  const { username, password } = request.body;

  try {
    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return response.status(401).json({
        error: 'invalid username or password',
      });
    }

    if (user.is_disabled) {
      return response.status(403).json({
        error: 'User is disabled',
      });
    }

    const passwordCorrect = password === user.password;
    if (!passwordCorrect) {
      return response.status(401).json({
        error: 'invalid username or password',
      });
    }

    const userForToken = {
      username: user.username,
      id: user.id,
    };

    const token = jwt.sign(userForToken, SECRET, { expiresIn: '1h' });


    await Session.create({
      userId: user.id,
      sessionToken: token,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    response.status(200).send({
      token,
      username: user.username,
      name: user.name,
    });
  } catch (error) {
    console.error('Error during login:', error);
    response.status(500).json({ error: 'Internal server error' });
  }
});

///////////////////////////
router.delete('/logout', async (req, res) => {
  const { token } = req.body;

  try {
    await Session.destroy({
      where: { sessionToken: token },
    });

    res.status(204).end();
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: 'Something went wrong during logout' });
  }
});

module.exports = router;
