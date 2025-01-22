const express = require('express');
const { connectToDatabase } = require('./util/db');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const authorsRouter = require('./controllers/authors');
const app = express();
const config = require('./util/config');
const errorHandler = require('./middleware/errorHandler');
const { tokenExtractor } = require('./middleware/auth');

app.use(tokenExtractor);

app.use(express.json());

connectToDatabase();

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/authors', authorsRouter);

app.use(errorHandler);

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
