import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
              <MessageSquare className="h-6 w-6 text-primary" />
              <span>WhatsApp Messenger</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Send Message
              </Link>
              <Link
                to="/webhook-tester"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/webhook-tester') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Webhook Tester
              </Link>
              <Link
                to="/status"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/status') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Status
              </Link>
            </nav>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile navigation */}
          <nav className="flex md:hidden items-center gap-4 pb-4 overflow-x-auto">
            <Link
              to="/"
              className={`text-sm font-medium whitespace-nowrap transition-colors hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Send Message
            </Link>
            <Link
              to="/webhook-tester"
              className={`text-sm font-medium whitespace-nowrap transition-colors hover:text-primary ${
                isActive('/webhook-tester') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Webhook Tester
            </Link>
            <Link
              to="/status"
              className={`text-sm font-medium whitespace-nowrap transition-colors hover:text-primary ${
                isActive('/status') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Status
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">{children}</main>

      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          WhatsApp Messenger Demo • Powered by Twilio
        </div>
      </footer>
    </div>
  );
}
