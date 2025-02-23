import { BrowserRouter as Router } from 'react-router-dom';
import { NostrProvider } from './contexts/NostrProvider';
import { AchievementProvider } from './contexts/achievementContext.jsx';
import { AudioProvider } from './contexts/audioContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRoutes } from './AppRoutes';
import { MenuBar } from './components/MenuBar';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <NostrProvider>
          <AchievementProvider>
            <AudioProvider>
              <div className="app">
                <MenuBar />
                <AppRoutes />
              </div>
            </AudioProvider>
          </AchievementProvider>
        </NostrProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
