const errorHandler = (err, req, res, next) => {
  console.error(err)

  if (err.name === 'SequelizeValidationError') {
    const errorMessages = err.errors.map((error) => error.message)
    return res.status(400).json({ error: errorMessages })
  }

  res.status(500).json({ error: 'Internal server error' })
}

module.exports = errorHandler
