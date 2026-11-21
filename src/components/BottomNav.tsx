import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, FolderLock, Menu } from 'lucide-react';

const ITEMS = [
  { label: 'Home', to: '/', Icon: Home, end: true },
  { label: 'Programmes', to: '/programmes', Icon: BookOpen, end: false },
  { label: 'Resources', to: '/resources', Icon: FolderLock, end: false },
  { label: 'Menu', to: '/menu', Icon: Menu, end: false },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm border-t border-slate-200 pb-[env(safe-area-inset-bottom)] no-print"
    >
      <div className="grid grid-cols-4 h-15">
        {ITEMS.map(({ label, to, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
                isActive ? 'text-blue-700' : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.25]' : 'stroke-[1.75]'}`} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
