import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sun, Moon, Bell, Menu, X, ChevronDown, LogOut, User, LayoutDashboard, Settings } from 'lucide-react';
import { useAuthStore, useThemeStore } from '../../context/store';
import { Avatar } from '../common';
import { cn, formatRelativeTime } from '../../utils/helpers';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Portfolio', to: '/portfolio' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Templates', to: '/templates' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
      scrolled
        ? 'bg-[var(--bg)]/90 backdrop-blur-xl border-b border-[var(--border)] shadow-sm'
        : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:shadow-brand-500/50 transition-shadow">
              <span className="text-white font-display font-bold text-lg">V</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Voro<span className="gradient-text">Web</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === link.to
                    ? 'text-brand-500 bg-brand-500/10'
                    : 'text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)]'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)] transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard/notifications" className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)] transition-all">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </Link>

                <div ref={dropRef} className="relative">
                  <button
                    onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-[var(--surface)] transition-all"
                  >
                    <Avatar name={user?.name} src={user?.avatarUrl} size="sm" />
                    <span className="hidden sm:block text-sm font-medium truncate max-w-[120px]">{user?.name}</span>
                    <ChevronDown className={cn('w-3.5 h-3.5 text-[var(--muted)] transition-transform', dropOpen && 'rotate-180')} />
                  </button>

                  {dropOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 card shadow-xl border border-[var(--border)] py-1 animate-slide-up">
                      <div className="px-4 py-2 border-b border-[var(--border)] mb-1">
                        <p className="text-sm font-medium truncate">{user?.name}</p>
                        <p className="text-xs text-[var(--muted)] truncate">{user?.email}</p>
                      </div>
                      <DropItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setDropOpen(false)} />
                      <DropItem to="/dashboard/profile" icon={User} label="Profile" onClick={() => setDropOpen(false)} />
                      {user?.role === 'ADMIN' && (
                        <DropItem to="/admin" icon={Settings} label="Admin Panel" onClick={() => setDropOpen(false)} />
                      )}
                      <div className="border-t border-[var(--border)] mt-1 pt-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-[var(--surface)]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--bg)] border-t border-[var(--border)] px-4 py-4 space-y-1 animate-slide-up">
          {NAV_LINKS.map(link => (
            <Link key={link.to} to={link.to} className="block px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--surface)]" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
              <Link to="/login" className="flex-1 btn btn-secondary btn-sm" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/signup" className="flex-1 btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function DropItem({ to, icon: Icon, label, onClick }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--fg)] hover:bg-[var(--surface)] rounded-lg transition-colors">
      <Icon className="w-4 h-4 text-[var(--muted)]" /> {label}
    </Link>
  );
}
