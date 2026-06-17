const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all books
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// GET single book
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// POST add new book
router.post('/', async (req, res) => {
  try {
    const { title, author, isbn, category, total_copies } = req.body;
    const result = await pool.query(
      `INSERT INTO books (title, author, isbn, category, total_copies, available_copies)
       VALUES ($1, $2, $3, $4, $5, $5) RETURNING *`,
      [title, author, isbn, category, total_copies]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add book' });
  }
});

// PUT update book
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, category, total_copies, available_copies } = req.body;
    const result = await pool.query(
      `UPDATE books SET title=$1, author=$2, isbn=$3, category=$4, total_copies=$5, available_copies=$6
       WHERE id=$7 RETURNING *`,
      [title, author, isbn, category, total_copies, available_copies, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// DELETE book
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM books WHERE id=$1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

module.exports = router;