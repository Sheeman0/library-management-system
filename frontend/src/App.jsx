import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import BorrowReturn from './pages/BorrowReturn';
import Overdue from './pages/Overdue';
import History from './pages/History';

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-paper">
        <Sidebar />
        <main className="flex-1 p-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/members" element={<Members />} />
            <Route path="/borrow" element={<BorrowReturn />} />
            <Route path="/overdue" element={<Overdue />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;