
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import HomePage from './pages/HomePage';
import SellTicketsPage from './pages/SellTicketsPage';
import BrowseTicketsPage from './pages/BrowseTicketsPage';
import MyTicketsPage from './pages/MyTicketsPage';
import ProfilePage from './pages/ProfilePage';
import Navigation from './components/Navigation';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <main className="pb-20">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sell" element={<SellTicketsPage />} />
                <Route path="/browse" element={<BrowseTicketsPage />} />
                <Route path="/my-tickets" element={<MyTicketsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </main>
            <Navigation />
            <Toaster />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;