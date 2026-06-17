import { useEffect, useState } from 'react';
import { getOverdueRecords } from '../api/borrow';

function Overdue() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getOverdueRecords();
        setRecords(data);
      } catch (err) {
        console.error(err);
        setError('Could not load overdue records.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function daysLate(dueDate) {
    const diff = Date.now() - new Date(dueDate).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  return (
    <div>
      <div className="flex items-baseline justify-between border-b-2 border-ink pb-3 mb-8">
        <h1 className="font-serif text-3xl text-ink">Overdue</h1>
        <span className="font-mono text-xs text-stamp tracking-widest">
          {records.length} {records.length === 1 ? 'RECORD' : 'RECORDS'} FLAGGED
        </span>
      </div>

      <div className="bg-white border border-brass/40 rounded-lg overflow-hidden">
        {loading ? (
          <p className="font-mono text-sm text-ink/60 p-6">Checking due dates...</p>
        ) : error ? (
          <p className="font-mono text-sm text-stamp p-6">{error}</p>
        ) : records.length === 0 ? (
          <p className="font-sans text-sm text-ledger p-6">
            Nothing overdue. The shelves are in good order.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brass/30">
                <Th>Book</Th>
                <Th>Member</Th>
                <Th>Email</Th>
                <Th>Due Date</Th>
                <Th>Days Late</Th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-paper hover:bg-stamp/5">
                  <td className="px-5 py-3 font-serif text-ink">{record.book_title}</td>
                  <td className="px-5 py-3 font-sans text-sm text-ink/70">{record.member_name}</td>
                  <td className="px-5 py-3 font-sans text-sm text-ink/50">{record.email}</td>
                  <td className="px-5 py-3 font-mono text-xs text-ink/60">
                    {new Date(record.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs bg-stamp/10 text-stamp px-2 py-1 rounded">
                      {daysLate(record.due_date)} days
                    </span>
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

export default Overdue;