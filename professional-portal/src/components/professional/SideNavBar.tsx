import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const SideNavBar: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Overview', icon: 'dashboard' },
    { path: '/cases', label: 'Cases', icon: 'folder_shared' },
    { path: '/alerts', label: 'Alerts', icon: 'notifications' },
    { path: '/follow-ups', label: 'Follow-ups', icon: 'event_repeat' },
  ];

  return (
    <nav className="hidden md:flex h-screen w-64 fixed left-0 top-0 border-r border-outline-variant bg-surface-container shadow-sm flex-col py-6 overflow-y-auto z-50">
      <div className="px-6 mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-secondary tracking-tight">AASRA</h1>
        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Support Portal</p>
      </div>

      <ul className="flex flex-col gap-1 w-full flex-1">
        {navItems.map(item => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ease-in-out text-sm font-semibold ${
                isActive(item.path)
                  ? 'text-secondary border-r-4 border-secondary bg-secondary-container/20'
                  : 'text-on-surface-variant hover:text-secondary hover:bg-surface-container-highest'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive(item.path) ? 'fill-icon' : ''}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto px-2">
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl ${
            isActive('/settings')
              ? 'bg-secondary-container text-on-secondary-container'
              : 'text-on-surface-variant hover:bg-surface-container-highest'
          }`}
        >
          <span className="material-symbols-outlined">settings</span>
          Settings
        </Link>
        <Link
          to="/help"
          className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl ${
            isActive('/help')
              ? 'bg-secondary-container text-on-secondary-container'
              : 'text-on-surface-variant hover:bg-surface-container-highest'
          }`}
        >
          <span className="material-symbols-outlined">help</span>
          Help
        </Link>
      </div>
    </nav>
  );
};
