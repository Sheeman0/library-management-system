import { useEffect, useState } from 'react';
import { getBooks, createBook, deleteBook } from '../api/books';

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    total_copies: 1,
  });

  async function loadBooks() {
    try {
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      console.error(err);
      setError('Could not load books.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createBook({
        ...formData,
        total_copies: parseInt(formData.total_copies, 10),
      });
      setFormData({ title: '', author: '', isbn: '', category: '', total_copies: 1 });
      setShowForm(false);
      loadBooks();
    } catch (err) {
      console.error(err);
      alert('Failed to add book.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remove this book from the catalog?')) return;
    try {
      await deleteBook(id);
      loadBooks();
    } catch (err) {
      console.error(err);
      alert('Failed to delete book.');
    }
  }

  return (
    <div>
      <div className="flex items-baseline justify-between border-b-2 border-ink pb-3 mb-8">
        <h1 className="font-serif text-3xl text-ink">Books</h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="font-mono text-xs tracking-widest bg-ink text-paper px-4 py-2 rounded hover:bg-stamp transition-colors"
        >
          {showForm ? 'CANCEL' : '+ ADD BOOK'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-brass/40 rounded-lg p-6 mb-8 grid grid-cols-2 gap-4"
        >
          <Field label="Title" name="title" value={formData.title} onChange={handleChange} required />
          <Field label="Author" name="author" value={formData.author} onChange={handleChange} required />
          <Field label="ISBN" name="isbn" value={formData.isbn} onChange={handleChange} />
          <Field label="Category" name="category" value={formData.category} onChange={handleChange} />
          <Field
            label="Total Copies"
            name="total_copies"
            type="number"
            value={formData.total_copies}
            onChange={handleChange}
            required
          />
          <div className="col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="font-mono text-xs tracking-widest bg-ledger text-paper px-5 py-2 rounded hover:bg-ledger/80 transition-colors disabled:opacity-50"
            >
              {submitting ? 'SAVING...' : 'SAVE TO CATALOG'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-brass/40 rounded-lg overflow-hidden">
        {loading ? (
          <p className="font-mono text-sm text-ink/60 p-6">Loading catalog...</p>
        ) : error ? (
          <p className="font-mono text-sm text-stamp p-6">{error}</p>
        ) : books.length === 0 ? (
          <p className="font-sans text-sm text-ink/50 p-6">No books in the catalog yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brass/30">
                <Th>Title</Th>
                <Th>Author</Th>
                <Th>Category</Th>
                <Th>Available</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b border-paper hover:bg-paper/50">
                  <td className="px-5 py-3 font-serif text-ink">{book.title}</td>
                  <td className="px-5 py-3 font-sans text-sm text-ink/70">{book.author}</td>
                  <td className="px-5 py-3 font-sans text-sm text-ink/70">{book.category || '—'}</td>
                  <td className="px-5 py-3 font-mono text-sm">
                    <span
                      className={
                        book.available_copies > 0 ? 'text-ledger' : 'text-stamp'
                      }
                    >
                      {book.available_copies} / {book.total_copies}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="font-mono text-xs text-stamp/70 hover:text-stamp"
                    >
                      remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-5 py-3 font-mono text-xs text-ink/50 tracking-widest">{children}</th>
  );
}

function Field({ label, name, value, onChange, type = 'text', required }) {
  return (
    <label className="block">
      <span className="font-mono text-xs text-ink/60 tracking-widest block mb-1">
        {label.toUpperCase()}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full border border-brass/40 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-stamp"
      />
    </label>
  );
}

export default Books;