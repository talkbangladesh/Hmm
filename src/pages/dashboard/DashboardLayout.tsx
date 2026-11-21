import React from 'react';
import { Link, NavLink, Navigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  BookOpen,
  BarChart3,
  Calendar,
  ClipboardCheck,
  Award,
  FolderLock,
  GraduationCap,
  CreditCard,
  Bell,
  Settings,
  LifeBuoy,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DashboardProvider, useDashboard } from './DashboardContext';

const SIDEBAR_LINKS = [
  { label: 'Overview', to: '/dashboard', Icon: LayoutDashboard, end: true },
  { label: 'My Profile', to: '/dashboard/profile', Icon: User },
  { label: 'My Courses', to: '/dashboard/courses', Icon: BookOpen },
  { label: 'Learning Progress', to: '/dashboard/progress', Icon: BarChart3 },
  { label: 'Class Schedule', to: '/dashboard/schedule', Icon: Calendar },
  { label: 'Assignments', to: '/dashboard/assignments', Icon: ClipboardCheck },
  { label: 'My Certificates', to: '/dashboard/certificates', Icon: Award },
  { label: 'My Resources', to: '/dashboard/resources', Icon: FolderLock },
  { label: 'Scholarships', to: '/dashboard/scholarships', Icon: GraduationCap },
  { label: 'Payments & Enrolments', to: '/dashboard/payments', Icon: CreditCard },
  { label: 'Notifications', to: '/dashboard/notifications', Icon: Bell },
  { label: 'Account Settings', to: '/dashboard/settings', Icon: Settings },
  { label: 'Help & Support', to: '/dashboard/support', Icon: LifeBuoy },
];

function DashboardShellInner() {
  const { data, loading, error } = useDashboard();
  const unreadCount = (data?.notifications || []).filter((n) => !n.is_read).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-3 lg:sticky lg:top-6">
          <p className="px-3 py-2 text-xs font-mono-tabular uppercase tracking-wider text-slate-400 font-semibold">
            Student Workspace
          </p>
          <nav aria-label="Dashboard Navigation" className="flex lg:flex-col gap-1 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
            {SIDEBAR_LINKS.map(({ label, to, Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center justify-between gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-800 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{label}</span>
                </span>
                {to === '/dashboard/notifications' && unreadCount > 0 && (
                  <span className="font-mono-tabular text-[11px] font-bold text-blue-700">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="lg:col-span-9 min-w-0 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
              {error}
            </div>
          )}
          {loading && !data ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-sm text-slate-500">
              Loading your dashboard...
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout() {
  const { user, loading, supabaseConfigured } = useAuth();

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center text-sm text-slate-500">
        Checking account session...
      </div>
    );
  }

  if (!supabaseConfigured) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-14">
        <div className="bg-white border border-amber-200 rounded-2xl p-6 space-y-3 text-sm">
          <h1 className="font-display text-xl font-bold text-slate-900">
            Student Dashboard Requires Supabase Configuration
          </h1>
          <p className="text-slate-600">
            Configure <code className="font-mono-tabular">VITE_SUPABASE_URL</code> and{' '}
            <code className="font-mono-tabular">VITE_SUPABASE_ANON_KEY</code> in your environment to enable sign-in and student records.
          </p>
          <Link to="/" className="inline-block text-blue-700 font-semibold underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} replace />;
  }

  return (
    <DashboardProvider>
      <DashboardShellInner />
    </DashboardProvider>
  );
}
