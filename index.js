const express = require('express')
const { connectToDatabase } = require('./util/db')
const blogsRouter = require('./controllers/blogs')
const app = express()

const config = require('./util/config')

app.use(express.json())
const errorHandler = require('./middleware/errorHandler')

connectToDatabase()

app.use('/api/blogs', blogsRouter)

app.use(errorHandler)

const PORT = config.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
