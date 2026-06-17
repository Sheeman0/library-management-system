import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', code: '01' },
  { to: '/books', label: 'Books', code: '02' },
  { to: '/members', label: 'Members', code: '03' },
  { to: '/borrow', label: 'Borrow / Return', code: '04' },
  { to: '/overdue', label: 'Overdue', code: '05' },
  { to: '/history', label: 'Member History', code: '06' },
];

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-ink text-paper flex flex-col border-r border-brass/30">
      <div className="px-6 py-8 border-b border-brass/30">
        <p className="font-mono text-xs text-brass tracking-widest mb-1">EST. 2026</p>
        <h1 className="font-serif text-2xl leading-tight">The Reading Room</h1>
        <p className="text-xs text-paper/50 mt-1">Library Management System</p>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3 font-sans text-sm transition-colors ${
                isActive
                  ? 'bg-stamp/20 text-paper border-l-2 border-stamp'
                  : 'text-paper/60 hover:text-paper hover:bg-white/5 border-l-2 border-transparent'
              }`
            }
          >
            <span className="font-mono text-xs text-brass">{item.code}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-brass/30">
        <p className="text-xs text-paper/40 font-mono">CATALOG SYSTEM v1.0</p>
      </div>
    </aside>
  );
}

export default Sidebar;