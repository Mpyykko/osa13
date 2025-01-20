const errorHandler = (error, req, res, next) => {
    console.error('Error:', error.message)
  
    if (error.name === 'TypeError') {
      return res.status(400).json({ error: 'Invalid data type' })
    }
  
    next(error)
  }
  
  module.exports = errorHandler