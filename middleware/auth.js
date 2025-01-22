const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('Authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'Token missing or invalid' })
  }
  
  try {
    const decodedToken = jwt.verify(req.token, SECRET)
    req.user = decodedToken
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid or expired' })
  }
}

module.exports = {
  tokenExtractor,
  userExtractor,
}
