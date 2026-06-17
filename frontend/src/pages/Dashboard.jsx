import { useEffect, useState } from 'react';
import { getBooks } from '../api/books';
import { getMembers } from '../api/members';
import { getBorrowRecords, getOverdueRecords } from '../api/borrow';

function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    activeBorrows: 0,
    overdueCount: 0,
  });
  const [recentBorrows, setRecentBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [books, members, borrows, overdue] = await Promise.all([
          getBooks(),
          getMembers(),
          getBorrowRecords(),
          getOverdueRecords(),
        ]);

        setStats({
          totalBooks: books.length,
          totalMembers: members.length,
          activeBorrows: borrows.filter((b) => b.status === 'borrowed').length,
          overdueCount: overdue.length,
        });
        setRecentBorrows(borrows.slice(0, 5));
      } catch (err) {
        console.error(err);
        setError('Could not load dashboard data. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <p className="font-mono text-sm text-ink/60">Loading catalog records...</p>;
  }

  if (error) {
    return <p className="font-mono text-sm text-stamp">{error}</p>;
  }

  return (
    <div>
      <div className="flex items-baseline justify-between border-b-2 border-ink pb-3 mb-8">
        <h1 className="font-serif text-3xl text-ink">Dashboard</h1>
        <span className="font-mono text-xs text-stamp tracking-widest">CATALOG OVERVIEW</span>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Volumes" value={stats.totalBooks} color="text-ink" />
        <StatCard label="Members" value={stats.totalMembers} color="text-ledger" />
        <StatCard label="Active Borrows" value={stats.activeBorrows} color="text-ink" />
        <StatCard label="Overdue" value={stats.overdueCount} color="text-stamp" />
      </div>

      <div className="bg-white border border-brass/40 rounded-lg p-5">
        <p className="font-mono text-xs text-ink/50 tracking-widest mb-4">RECENT ACTIVITY</p>
        {recentBorrows.length === 0 ? (
          <p className="font-sans text-sm text-ink/50">No borrow records yet.</p>
        ) : (
          <div className="divide-y divide-paper">
            {recentBorrows.map((record) => (
              <div key={record.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-serif text-base text-ink">{record.book_title}</p>
                  <p className="text-xs text-ink/50">{record.member_name}</p>
                </div>
                <span
                  className={`font-mono text-xs px-2 py-1 rounded ${
                    record.status === 'returned'
                      ? 'bg-ledger/10 text-ledger'
                      : 'bg-stamp/10 text-stamp'
                  }`}
                >
                  {record.status === 'returned' ? 'returned' : 'borrowed'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white border border-brass/40 rounded-lg p-4">
      <p className="font-mono text-xs text-ink/50 tracking-widest mb-1">{label.toUpperCase()}</p>
      <p className={`font-serif text-3xl ${color}`}>{value}</p>
    </div>
  );
}

export default Dashboard;