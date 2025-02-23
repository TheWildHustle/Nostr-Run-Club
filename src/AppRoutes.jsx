import { Routes, Route } from 'react-router-dom';
import { RunTracker } from './components/RunTracker';
import { RunHistory } from './pages/RunHistory';
import { Achievements } from './pages/Achievements';
import { RunClub } from './pages/RunClub';
import { Wallet } from './pages/Wallet';
import { Music } from './pages/Music';
import { Playlist } from './pages/Playlist';
import { NWC } from './pages/NWC';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/history" element={<RunHistory />} />
      <Route path="/achievements" element={<Achievements />} />
      <Route path="/club" element={<RunClub />} />
      <Route path="/club/join/:teamId" element={<RunClub />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/music" element={<Music />} />
      <Route path="/music/playlist/:id" element={<Playlist />} />
      <Route path="/nwc" element={<NWC />} />
      <Route path="/" element={<RunTracker />} />
    </Routes>
  );
};
