import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import HomePage from './pages/HomePage';
import SellTicketsPage from './pages/SellTicketsPage';
import BrowseTicketsPage from './pages/BrowseTicketsPage';
import MyTicketsPage from './pages/MyTicketsPage';
import ProfilePage from './pages/ProfilePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage';
import Navigation from './components/Navigation';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground">
              <main className="pb-20">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/browse" element={<BrowseTicketsPage />} />
                  <Route 
                    path="/sell" 
                    element={
                      <ProtectedRoute>
                        <SellTicketsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/my-tickets" 
                    element={
                      <ProtectedRoute>
                        <MyTicketsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/auth/login" 
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <LoginPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/auth/register" 
                    element={
                      <ProtectedRoute requireAuth={false}>
                        <RegisterPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/auth/callback" element={<AuthCallbackPage />} />
                </Routes>
              </main>
              <Navigation />
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;