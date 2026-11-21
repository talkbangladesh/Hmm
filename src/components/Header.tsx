import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  LogOut,
  ShieldCheck,
  User,
  LayoutDashboard,
  LogIn,
  UserPlus,
  Menu,
  X,
} from 'lucide-react';
import { AtlasLogo } from './BrandMark';
import { useAuth } from '../context/AuthContext';

const DESKTOP_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Programmes', to: '/programmes' },
  { label: 'Resources', to: '/resources' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const MOBILE_DRAWER_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'All Programmes', to: '/programmes' },
  { label: 'Specialized Programmes (Free)', to: '/programmes/specialized' },
  { label: 'Resources', to: '/resources' },
  { label: 'Institutional & Corporate Training', to: '/institutional-training' },
  { label: 'Scholarships', to: '/scholarships' },
  { label: 'Verify Certificate', to: '/verify-certificate' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export function Header() {
  const { user, profile, signOut, loading } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() || '';

  return (
    <header className="relative z-40 w-full bg-white border-b border-[#E3E8EF]">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link
          to="/"
          className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded-md"
        >
          <AtlasLogo />
        </Link>

        <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7">
          {DESKTOP_LINKS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `text-sm font-medium whitespace-nowrap transition-colors duration-150 py-1 border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] rounded-sm ${
                  isActive
                    ? 'text-[#1D4ED8] border-[#1D4ED8]'
                    : 'text-[#334155] border-transparent hover:text-[#0F172A]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <div className="relative flex items-center gap-2" ref={dropdownRef}>
            {!loading && !user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center min-h-[40px] px-4 py-2 text-sm font-medium text-[#334155] hover:text-[#0F172A] rounded-[8px] border border-[#E3E8EF] hover:border-[#CBD5E1] whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center min-h-[40px] px-4 py-2 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px] whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1D4ED8]"
                >
                  Sign Up
                </Link>
              </div>
            ) : user ? (
              <button
                type="button"
                onClick={() => setAccountOpen((prev) => !prev)}
                aria-expanded={accountOpen}
                aria-label="Account Menu"
                className="inline-flex items-center gap-2 pl-1.5 pr-2.5 py-1 min-h-[40px] rounded-full border border-[#E3E8EF] bg-white hover:bg-[#F7F9FC] text-[#0F172A] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
              >
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'Learner'}
                    className="w-7 h-7 rounded-full object-cover border border-[#E3E8EF]"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-[#1D4ED8] text-white text-xs font-semibold flex items-center justify-center">
                    {initials || <User className="w-3.5 h-3.5" strokeWidth={1.5} />}
                  </span>
                )}
                <span className="hidden sm:inline text-sm font-medium max-w-[130px] truncate">
                  {profile?.full_name || user?.email || 'Account'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" strokeWidth={1.5} />
              </button>
            ) : null}

            {accountOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-[#E3E8EF] rounded-[12px] shadow-lg py-2 z-50">
                {!user ? (
                  <div className="px-2 space-y-1">
                    <p className="px-2.5 py-1.5 text-xs font-medium text-[#64748B]">Account Access</p>
                    <Link
                      to="/login"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 text-sm font-medium text-[#334155] hover:bg-[#F7F9FC] rounded-[8px]"
                    >
                      <LogIn className="w-4 h-4 text-[#1D4ED8]" strokeWidth={1.5} />
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 text-sm font-semibold text-[#1D4ED8] hover:bg-[#EFF6FF] rounded-[8px]"
                    >
                      <UserPlus className="w-4 h-4" strokeWidth={1.5} />
                      Create Account
                    </Link>
                  </div>
                ) : (
                  <div className="px-2 space-y-1">
                    <div className="px-2.5 py-2 border-b border-[#E3E8EF] mb-1">
                      <p className="text-xs font-semibold text-[#0F172A] truncate">
                        {profile?.full_name || 'Atlas Learner'}
                      </p>
                      <p className="text-xs text-[#64748B] truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-[#334155] hover:bg-[#F7F9FC] rounded-[8px]"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#1D4ED8]" strokeWidth={1.5} />
                      My Dashboard
                    </Link>
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 text-sm text-[#334155] hover:bg-[#F7F9FC] rounded-[8px]"
                    >
                      <User className="w-4 h-4 text-[#64748B]" strokeWidth={1.5} />
                      My Profile
                    </Link>
                    {profile?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 text-sm font-medium text-[#1D4ED8] hover:bg-[#EFF6FF] rounded-[8px]"
                      >
                        <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={async () => {
                        setAccountOpen(false);
                        await signOut();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 text-sm text-red-700 hover:bg-red-50 rounded-[8px] text-left"
                    >
                      <LogOut className="w-4 h-4" strokeWidth={1.5} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-header-nav"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-[8px] border border-[#E3E8EF] bg-white text-[#0F172A] hover:bg-[#F7F9FC] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8]"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-header-nav"
          className="md:hidden border-t border-[#E3E8EF] bg-white max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <nav aria-label="Mobile Navigation" className="px-4 py-3 divide-y divide-[#E3E8EF]">
            <div className="pb-3 space-y-0.5">
              {MOBILE_DRAWER_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center min-h-[44px] px-2 rounded-[8px] text-sm font-medium transition-colors duration-150 ${
                      isActive
                        ? 'text-[#1D4ED8] bg-[#EFF6FF] font-semibold'
                        : 'text-[#334155] hover:text-[#0F172A] hover:bg-[#F7F9FC]'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="pt-3 pb-2">
              {!user ? (
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm font-semibold text-[#1D4ED8] border border-[#1D4ED8] bg-white hover:bg-[#EFF6FF] rounded-[8px]"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm font-semibold text-white bg-[#1D4ED8] hover:bg-[#1E40AF] rounded-[8px]"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 min-h-[44px] px-2 text-sm font-semibold text-[#1D4ED8] rounded-[8px] hover:bg-[#EFF6FF]"
                  >
                    <LayoutDashboard className="w-4 h-4" strokeWidth={1.5} />
                    My Dashboard
                  </Link>
                  {profile?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 min-h-[44px] px-2 text-sm font-medium text-[#334155] rounded-[8px] hover:bg-[#F7F9FC]"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#1D4ED8]" strokeWidth={1.5} />
                      Admin Panel
                    </Link>
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
