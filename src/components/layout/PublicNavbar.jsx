import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Layers, ArrowRight, Menu, X, Shield, Activity, GitMerge, Cpu, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/Button';
import { getRoleRedirect } from '../../config/roles';
import { useTheme } from '../../context/ThemeContext';

export const PublicNavbar = () => {
  const { user, role } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleDashboardClick = () => {
    if (user && role) {
      navigate(getRoleRedirect(role), { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  const navLinks = [
    { label: 'Architecture', path: '/architecture', icon: Cpu },
    { label: 'Drift Engine', path: '/drift-engine', icon: Activity },
    { label: 'Feedback Loop', path: '/feedback-loop', icon: GitMerge },
    { label: 'Governance & RLS', path: '/governance', icon: Shield },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">AdaptFlow</span>
            <span className="ml-2 rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-mono text-blue-400 font-bold border border-blue-500/30">
              ENTERPRISE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right CTA + Theme Toggle */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>

          {user ? (
            <Button onClick={handleDashboardClick} variant="primary" size="md" className="shadow-lg shadow-blue-600/25">
              <span>Go to Dashboard</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          ) : (
            <>
              <Button onClick={() => navigate('/login')} variant="ghost" size="md" className="text-slate-300 hover:text-white">
                Sign In
              </Button>
              <Button onClick={() => navigate('/register')} variant="primary" size="md" className="shadow-lg shadow-blue-600/25">
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-6 py-4 space-y-3">
          <div className="space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive(item.path) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {user ? (
              <Button onClick={handleDashboardClick} variant="primary" size="md" className="w-full">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate('/login')} variant="ghost" size="md" className="w-full">
                  Sign In
                </Button>
                <Button onClick={() => navigate('/register')} variant="primary" size="md" className="w-full">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
