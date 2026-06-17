const express = require('express');
const cors = require('cors');
require('dotenv').config();

const booksRouter = require('./routes/books');
const membersRouter = require('./routes/members');
const borrowRouter = require('./routes/borrow');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Library Management System API is running' });
});

app.use('/api/books', booksRouter);
app.use('/api/members', membersRouter);
app.use('/api/borrow', borrowRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});