const { Session } = require('../models');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../util/config');

async function sessionValidator(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    const session = await Session.findOne({
      where: {
        userId: decoded.id,
        sessionToken: token,
      },
    });

    if (!session || new Date() > new Date(session.expiresAt)) {
      return res.status(401).json({ error: 'Session invalid or expired' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { sessionValidator };
