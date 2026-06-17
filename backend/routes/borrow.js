const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all borrow records (with book + member info attached)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT br.*, b.title AS book_title, m.name AS member_name
      FROM borrow_records br
      JOIN books b ON br.book_id = b.id
      JOIN members m ON br.member_id = m.id
      ORDER BY br.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch borrow records' });
  }
});

// GET overdue books (due date passed, not returned yet)
router.get('/overdue', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT br.*, b.title AS book_title, m.name AS member_name, m.email
      FROM borrow_records br
      JOIN books b ON br.book_id = b.id
      JOIN members m ON br.member_id = m.id
      WHERE br.status = 'borrowed' AND br.due_date < NOW()
      ORDER BY br.due_date ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch overdue records' });
  }
});

// GET a specific member's borrow history
router.get('/member/:memberId', async (req, res) => {
  try {
    const { memberId } = req.params;
    const result = await pool.query(`
      SELECT br.*, b.title AS book_title, b.author
      FROM borrow_records br
      JOIN books b ON br.book_id = b.id
      WHERE br.member_id = $1
      ORDER BY br.borrow_date DESC
    `, [memberId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch member history' });
  }
});

// POST borrow a book
router.post('/', async (req, res) => {
  const { book_id, member_id, due_date } = req.body;
  try {
    // Check if book has available copies
    const bookCheck = await pool.query('SELECT available_copies FROM books WHERE id = $1', [book_id]);
    if (bookCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    if (bookCheck.rows[0].available_copies <= 0) {
      return res.status(400).json({ error: 'No copies available for this book' });
    }

    // Create borrow record
    const borrowResult = await pool.query(
      `INSERT INTO borrow_records (book_id, member_id, due_date, status)
       VALUES ($1, $2, $3, 'borrowed') RETURNING *`,
      [book_id, member_id, due_date]
    );

    // Decrease available copies by 1
    await pool.query(
      'UPDATE books SET available_copies = available_copies - 1 WHERE id = $1',
      [book_id]
    );

    res.status(201).json(borrowResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process borrow request' });
  }
});

// PUT return a book
router.put('/:id/return', async (req, res) => {
  try {
    const { id } = req.params;

    // Mark borrow record as returned
    const returnResult = await pool.query(
      `UPDATE borrow_records SET return_date = NOW(), status = 'returned'
       WHERE id = $1 RETURNING *`,
      [id]
    );

    if (returnResult.rows.length === 0) {
      return res.status(404).json({ error: 'Borrow record not found' });
    }

    // Increase available copies by 1
    await pool.query(
      'UPDATE books SET available_copies = available_copies + 1 WHERE id = $1',
      [returnResult.rows[0].book_id]
    );

    res.json(returnResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process return' });
  }
});

module.exports = router;