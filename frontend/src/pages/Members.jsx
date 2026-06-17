import { useEffect, useState } from 'react';
import { getMembers, createMember, deleteMember } from '../api/members';

function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  async function loadMembers() {
    try {
      const data = await getMembers();
      setMembers(data);
    } catch (err) {
      console.error(err);
      setError('Could not load members.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMembers();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createMember(formData);
      setFormData({ name: '', email: '', phone: '' });
      setShowForm(false);
      loadMembers();
    } catch (err) {
      console.error(err);
      alert('Failed to register member. The email may already be in use.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Remove this member from the registry?')) return;
    try {
      await deleteMember(id);
      loadMembers();
    } catch (err) {
      console.error(err);
      alert('Failed to delete member.');
    }
  }

  return (
    <div>
      <div className="flex items-baseline justify-between border-b-2 border-ink pb-3 mb-8">
        <h1 className="font-serif text-3xl text-ink">Members</h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="font-mono text-xs tracking-widest bg-ink text-paper px-4 py-2 rounded hover:bg-stamp transition-colors"
        >
          {showForm ? 'CANCEL' : '+ REGISTER MEMBER'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-brass/40 rounded-lg p-6 mb-8 grid grid-cols-2 gap-4"
        >
          <Field label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
          <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <Field label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          <div className="col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="font-mono text-xs tracking-widest bg-ledger text-paper px-5 py-2 rounded hover:bg-ledger/80 transition-colors disabled:opacity-50"
            >
              {submitting ? 'SAVING...' : 'REGISTER MEMBER'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-brass/40 rounded-lg overflow-hidden">
        {loading ? (
          <p className="font-mono text-sm text-ink/60 p-6">Loading registry...</p>
        ) : error ? (
          <p className="font-mono text-sm text-stamp p-6">{error}</p>
        ) : members.length === 0 ? (
          <p className="font-sans text-sm text-ink/50 p-6">No members registered yet.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brass/30">
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Joined</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-paper hover:bg-paper/50">
                  <td className="px-5 py-3 font-serif text-ink">{member.name}</td>
                  <td className="px-5 py-3 font-sans text-sm text-ink/70">{member.email}</td>
                  <td className="px-5 py-3 font-sans text-sm text-ink/70">{member.phone || '—'}</td>
                  <td className="px-5 py-3 font-mono text-xs text-ink/50">
                    {new Date(member.membership_date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleDelete(member.id)}
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

export default Members;