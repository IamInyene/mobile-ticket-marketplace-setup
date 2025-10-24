import { Home, Plus, Search, Ticket, User, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const { user } = useAuth();

  const authNavItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/browse', icon: Search, label: 'Browse' },
    { path: '/sell', icon: Plus, label: 'Sell' },
    { path: '/my-tickets', icon: Ticket, label: 'My Tickets' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const guestNavItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/browse', icon: Search, label: 'Browse' },
    { path: '/auth/login', icon: LogIn, label: 'Sign In' },
  ];

  const navItems = user ? authNavItems : guestNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;