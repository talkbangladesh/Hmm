import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MenuItem {
  label: string;
  to: string;
  authOnly?: boolean;
  guestOnly?: boolean;
  adminOnly?: boolean;
}

interface MenuGroup {
  heading: string;
  items: MenuItem[];
}

const GROUPS: MenuGroup[] = [
  {
    heading: 'Account',
    items: [
      { label: 'Login', to: '/login', guestOnly: true },
      { label: 'Sign Up', to: '/signup', guestOnly: true },
      { label: 'My Dashboard', to: '/dashboard', authOnly: true },
      { label: 'My Profile', to: '/dashboard/profile', authOnly: true },
      { label: 'Admin Panel', to: '/admin', adminOnly: true },
    ],
  },
  {
    heading: 'Explore',
    items: [
      { label: 'About', to: '/about' },
      { label: 'Resources', to: '/resources' },
      { label: 'eBooks', to: '/resources?category=ebooks' },
      { label: 'Prompt Library', to: '/resources?category=prompt-library' },
      { label: 'Scholarships', to: '/scholarships' },
      { label: 'Free Session', to: '/free-session' },
      { label: 'Verify Certificate', to: '/verify-certificate' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Categories',
    items: [
      { label: 'AI Literacy & Foundation', to: '/programmes/foundation' },
      { label: 'Applied AI', to: '/programmes/applied-ai' },
      { label: 'Professional Development', to: '/programmes/professional-development' },
      { label: 'Specialized Programmes', to: '/programmes/specialized' },
      { label: 'Institutional & Corporate Training', to: '/institutional-training' },
    ],
  },
  {
    heading: 'Learning & Support',
    items: [
      { label: 'My Courses', to: '/dashboard/courses', authOnly: true },
      { label: 'My Certificates', to: '/dashboard/certificates', authOnly: true },
      { label: 'Learning Progress', to: '/dashboard/progress', authOnly: true },
      { label: 'My Resources', to: '/dashboard/resources', authOnly: true },
      { label: 'Account Settings', to: '/dashboard/settings', authOnly: true },
      { label: 'Help & Support', to: '/dashboard/support' },
    ],
  },
  {
    heading: 'Policies',
    items: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms & Conditions', to: '/terms-and-conditions' },
      { label: 'Certificate Policy', to: '/certificate-policy' },
      { label: 'Accessibility Statement', to: '/accessibility-statement' },
    ],
  },
];

export function MenuPage() {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="bg-white text-[#0F172A]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="space-y-2 border-b border-[#E3E8EF] pb-6">
          <nav aria-label="Breadcrumb" className="text-xs text-[#64748B] flex items-center gap-2">
            <Link to="/" className="hover:text-[#0F172A]">Home</Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#0F172A] font-medium">Menu</span>
          </nav>
          <h1 className="text-3xl font-bold text-[#0F172A]">Menu</h1>
          <p className="bangla-text text-sm text-[#334155]">
            Atlas AI Education-এর সকল পেজ, বিভাগ ও অ্যাকাউন্টের তালিকা।
          </p>
        </div>

        <div className="space-y-8">
          {GROUPS.map((group) => {
            const visibleItems = group.items.filter((item) => {
              if (item.adminOnly) return isAdmin;
              if (item.authOnly) return Boolean(user);
              if (item.guestOnly) return !user;
              return true;
            });
            if (visibleItems.length === 0) return null;

            return (
              <section key={group.heading} className="space-y-2.5">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-[#1D4ED8]">
                  {group.heading}
                </h2>
                <div className="divide-y divide-[#E3E8EF] border-y border-[#E3E8EF]">
                  {visibleItems.map((item) => (
                    <Link
                      key={item.to + item.label}
                      to={item.to}
                      className="flex items-center justify-between py-3.5 min-h-[44px] text-sm font-medium text-[#0F172A] hover:text-[#1D4ED8] transition-colors"
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-[#64748B]" strokeWidth={1.5} />
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
