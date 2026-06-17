import { useEffect, useState } from 'react';
import { getMembers } from '../api/members';
import { getMemberHistory } from '../api/borrow';

function History() {
  const [members, setMembers] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getMembers().then(setMembers).catch(console.error);
  }, []);

  async function handleSelect(e) {
    const id = e.target.value;
    setSelectedId(id);
    if (!id) {
      setRecords([]);
      return;
    }
    setLoading(true);
    try {
      const data = await getMemberHistory(id);
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const selectedMember = members.find((m) => String(m.id) === String(selectedId));

  return (
    <div>
      <div className="border-b-2 border-ink pb-3 mb-8">
        <h1 className="font-serif text-3xl text-ink">Member History</h1>
      </div>

      <div className="bg-white border border-brass/40 rounded-lg p-6 mb-8">
        <label className="block max-w-md">
          <span className="font-mono text-xs text-ink/60 tracking-widest block mb-1">
            SEARCH MEMBER
          </span>
          <select
            value={selectedId}
            onChange={handleSelect}
            className="w-full border border-brass/40 rounded px-3 py-2 font-sans text-sm focus:outline-none focus:border-stamp"
          >
            <option value="">Select a member...</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
        </label>
      </div>

      {selectedMember && (
        <div className="bg-white border border-brass/40 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-brass/30">
            <p className="font-serif text-lg text-ink">{selectedMember.name}</p>
            <p className="font-mono text-xs text-ink/50">{selectedMember.email}</p>
          </div>

          {loading ? (
            <p className="font-mono text-sm text-ink/60 p-6">Pulling records...</p>
          ) : records.length === 0 ? (
            <p className="font-sans text-sm text-ink/50 p-6">No borrow history for this member.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-brass/30">
                  <Th>Book</Th>
                  <Th>Author</Th>
                  <Th>Borrowed</Th>
                  <Th>Due</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-paper hover:bg-paper/50">
                    <td className="px-5 py-3 font-serif text-ink">{record.book_title}</td>
                    <td className="px-5 py-3 font-sans text-sm text-ink/70">{record.author}</td>
                    <td className="px-5 py-3 font-mono text-xs text-ink/60">
                      {new Date(record.borrow_date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-ink/60">
                      {new Date(record.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`font-mono text-xs px-2 py-1 rounded ${
                          record.status === 'returned'
                            ? 'bg-ledger/10 text-ledger'
                            : 'bg-stamp/10 text-stamp'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function Th({ children }) {
  return (
    <th className="px-5 py-3 font-mono text-xs text-ink/50 tracking-widest">{children}</th>
  );
}

export default History;