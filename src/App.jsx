import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RunTracker } from './components/RunTracker';
import { MenuBar } from './components/MenuBar';
import { Login } from './pages/Login';
import { RunHistory } from './pages/RunHistory';
import { Achievements } from './pages/Achievements';
import { RunClub } from './pages/RunClub';
import { Wallet } from './pages/Wallet';
import { Music } from './pages/Music';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <MenuBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/history" element={<RunHistory />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/club" element={<RunClub />} />
        <Route path="/club/join/:teamId" element={<RunClub />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/music" element={<Music />} />
        <Route path="/" element={<RunTracker />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;