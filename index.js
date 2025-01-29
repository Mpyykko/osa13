const express = require('express');
const { connectToDatabase } = require('./util/db');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const authorsRouter = require('./controllers/authors');
const readingListRouter = require('./controllers/readinglists')
const app = express();
const errorHandler = require('./middleware/errorHandler');
const { tokenExtractor } = require('./middleware/auth');



app.use(express.json());

connectToDatabase();

app.use('/api/blogs', blogsRouter);
app.use(tokenExtractor);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/readinglists', readingListRouter)

app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
