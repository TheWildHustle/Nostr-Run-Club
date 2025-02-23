import { BrowserRouter as Router } from 'react-router-dom';
import { NostrProvider } from './contexts/NostrProvider';
import { AchievementProvider } from './contexts/AchievementContext.jsx';
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
            <div className="app">
              <MenuBar />
              <AppRoutes />
            </div>
          </AchievementProvider>
        </NostrProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
