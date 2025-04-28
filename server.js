const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { authRouter } = require('./routes/auth');
const { itemsRouter } = require('./routes/items');
const { reviewsRouter } = require('./routes/reviews');
const { commentsRouter } = require('./routes/comments');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// API routes
app.use('/api/auth', authRouter);
app.use('/api/items', itemsRouter);
app.use('/api', reviewsRouter);
app.use('/api', commentsRouter);

app.get('/', (req, res) => {
  res.send('Review API is up!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

