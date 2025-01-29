const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');

const userExtractor = (req, res, next) => {
  const authorization = req.get('Authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7);
    jwt.verify(token, SECRET, (error, decodedToken) => {
      if (error) {
        return res.status(401).json({ error: 'Token invalid' });
      }
      req.user = decodedToken;
      next();
    });
  } else {
    return res.status(401).json({ error: 'Token missing' });
  }
};

module.exports = { userExtractor };
