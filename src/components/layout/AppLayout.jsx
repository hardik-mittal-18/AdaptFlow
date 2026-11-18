import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLES, ROLE_CONFIG, getRoleRedirect } from '../../config/roles';
import {
  Layers,
  LayoutDashboard,
  Users,
  Box,
  ShoppingBag,
  BarChart3,
  GitBranch,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Zap,
  Activity,
  User as UserIcon,
  Store,
  Wrench,
  ShieldCheck,
  Database,
  Sun,
  Moon
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const AppLayout = ({ children }) => {
  const { user, profile, role, isAdmin, isVendor, isStaff, isConsumer, signOut } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Strict Navigation per Role - Absolutely no cross-role links!
  const adminNav = [
    { label: 'Command Center', path: '/admin', icon: LayoutDashboard },
    { label: 'User RBAC', path: '/admin/users', icon: Users },
    { label: 'Models & Products', path: '/admin/products', icon: Box },
    { label: 'Inferences & Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Evidently Drift', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Blue-Green Deploy', path: '/admin/deployments', icon: GitBranch },
    { label: 'Audit & Telemetry', path: '/admin/logs', icon: Activity },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const vendorNav = [
    { label: 'Vendor Hub', path: '/vendor', icon: Store },
    { label: 'Profile & API Key', path: '/profile', icon: UserIcon },
  ];

  const staffNav = [
    { label: 'Engineering Station', path: '/staff', icon: Wrench },
    { label: 'Profile & API Key', path: '/profile', icon: UserIcon },
  ];

  const consumerNav = [
    { label: 'My Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Predict Churn', path: '/predictions', icon: Zap },
    { label: 'Inference History', path: '/activity', icon: ShoppingBag },
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Profile & API Key', path: '/profile', icon: UserIcon },
  ];

  const currentNav = isAdmin
    ? adminNav
    : isVendor
    ? vendorNav
    : isStaff
    ? staffNav
    : consumerNav;

  const currentBreadcrumb = currentNav.find((item) => item.path === location.pathname)?.label || 'Console';
  const roleMeta = ROLE_CONFIG[role] || ROLE_CONFIG[ROLES.CONSUMER];

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    await signOut();
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-800/80 bg-slate-900/90 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">AdaptFlow</span>
              <span className="text-[10px] font-mono rounded bg-blue-500/20 px-1 py-0.2 text-blue-400 font-semibold">AI</span>
            </div>
            <p className="text-[11px] text-slate-400">Self-Adaptive Platform</p>
          </div>
        </div>

        {/* Active Role Pill Indicator */}
        <div className="px-4 py-3">
          <div className="rounded-xl bg-slate-950/70 p-2.5 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-300 capitalize">{roleMeta.label} Portal</span>
            </div>
            <Badge variant={roleMeta.badgeColor} size="sm">
              {role?.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            {roleMeta.label} Navigation
          </div>
          {currentNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Current User Session Footer */}
        <div className="p-4 border-t border-slate-800/80 text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500">Session Status</span>
            <span className="text-emerald-400 font-medium">Secured by RLS</span>
          </div>
          <div className="truncate text-[11px] font-mono text-slate-300">
            {profile?.email || user?.email}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <nav className="flex items-center gap-2 text-xs">
              <Link to={getRoleRedirect(role)} className="text-slate-400 hover:text-white transition-colors capitalize">
                {roleMeta.label}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
              <span className="font-semibold text-slate-200">{currentBreadcrumb}</span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle (Dark / Light) */}
            <button
              onClick={toggleTheme}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              {isDark ? (
                <>
                  <Sun className="h-4 w-4 text-amber-400" />
                  <span className="hidden md:inline font-mono text-[11px] font-semibold text-slate-300">Light</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-indigo-400" />
                  <span className="hidden md:inline font-mono text-[11px] font-semibold text-slate-300">Dark</span>
                </>
              )}
            </button>

            <Link
              to="/notifications"
              className="relative rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Bell className="h-4 w-4" />
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-900/80 p-1.5 pr-3 hover:bg-slate-800 transition-colors"
              >
                <img
                  src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt="Avatar"
                  className="h-7 w-7 rounded-lg object-cover ring-1 ring-slate-700"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-white leading-tight">{profile?.full_name || 'User'}</div>
                  <div className="text-[10px] text-slate-400 capitalize">{roleMeta.label}</div>
                </div>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-slate-800 text-xs">
                    <p className="font-semibold text-white">{profile?.full_name}</p>
                    <p className="text-slate-400 text-[11px] truncate">{profile?.email || user?.email}</p>
                    {profile?.business_name && (
                      <p className="text-amber-400 text-[10px] mt-0.5 font-medium">{profile.business_name}</p>
                    )}
                    {profile?.department && (
                      <p className="text-emerald-400 text-[10px] mt-0.5 font-medium">{profile.department}</p>
                    )}
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    <UserIcon className="h-3.5 w-3.5" />
                    <span>Profile & API Keys</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-800 bg-slate-900 p-4 space-y-2">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium ${
                    isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}

        {/* Main Body */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-950">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
