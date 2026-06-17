import { useEffect, useState } from 'react';
import { getBooks } from '../api/books';
import { getMembers } from '../api/members';
import { getBorrowRecords, borrowBook, returnBook } from '../api/borrow';

function BorrowReturn() {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ book_id: '', member_id: '', due_date: '' });

  async function loadData() {
    try {
      const [booksData, membersData, borrowsData] = await Promise.all([
        getBooks(),
        getMembers(),
        getBorrowRecords(),
      ]);
      setBooks(booksData);
      setMembers(membersData);
      setActiveBorrows(borrowsData.filter((b) => b.status === 'borrowed'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleBorrow(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await borrowBook(formData);
      setFormData({ book_id: '', member_id: '', due_date: '' });
      loadData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to process borrow.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReturn(id) {
    try {
      await returnBook(id);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to process return.');
    }
  }

  return (
    <div>
      <div className="border-b-2 border-ink pb-3 mb-8">
        <h1 className="font-serif text-3xl text-ink">Borrow / Return</h1>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Borrow form */}
        <div className="bg-white border border-brass/40 rounded-lg p-6">
          <p className="font-mono text-xs text-ink/50 tracking-widest mb-4">ISSUE A BOOK</p>
          <form onSubmit={handleBorrow} className="space-y-4">
            <label className="block">
              <span className="font-mono text-xs text-ink/60 tracking-widest block mb-1">BOOK</span>
              <select
                name="book_id"
                value={formData.book_id}
                onChange={handleChange}
                required
                className="w-full border border-brass/40 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-stamp"
              >
                <option value="">Select a book...</option>
                {books
                  .filter((b) => b.available_copies > 0)
                  .map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.available_copies} available)
                    </option>
                  ))}
              </select>
            </label>

            <label className="block">
              <span className="font-mono text-xs text-ink/60 tracking-widest block mb-1">MEMBER</span>
              <select
                name="member_id"
                value={formData.member_id}
                onChange={handleChange}
                required
                className="w-full border border-brass/40 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-stamp"
              >
                <option value="">Select a member...</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="font-mono text-xs text-ink/60 tracking-widest block mb-1">DUE DATE</span>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                required
                className="w-full border border-brass/40 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-stamp"
              />
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="font-mono text-xs tracking-widest bg-ledger text-paper px-5 py-2 rounded hover:bg-ledger/80 transition-colors disabled:opacity-50"
            >
              {submitting ? 'PROCESSING...' : 'ISSUE BOOK'}
            </button>
          </form>
        </div>

        {/* Active borrows / return panel */}
        <div className="bg-white border border-brass/40 rounded-lg p-6">
          <p className="font-mono text-xs text-ink/50 tracking-widest mb-4">CURRENTLY BORROWED</p>
          {loading ? (
            <p className="font-mono text-sm text-ink/60">Loading...</p>
          ) : activeBorrows.length === 0 ? (
            <p className="font-sans text-sm text-ink/50">No active borrows.</p>
          ) : (
            <div className="divide-y divide-paper">
              {activeBorrows.map((record) => (
                <div key={record.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-serif text-base text-ink">{record.book_title}</p>
                    <p className="text-xs text-ink/50">
                      {record.member_name} · due {new Date(record.due_date).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleReturn(record.id)}
                    className="font-mono text-xs tracking-widest bg-stamp/10 text-stamp px-3 py-1.5 rounded hover:bg-stamp hover:text-paper transition-colors"
                  >
                    RETURN
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BorrowReturn;