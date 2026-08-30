import React from 'react';

interface TopNavBarProps {
  title?: string;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({ title = "AASRA Support Portal" }) => {
  return (
    <header className="bg-surface-bright border-b border-outline-variant shadow-sm h-20 shrink-0 flex justify-between items-center px-6 z-40 relative">
      <div className="flex items-center md:hidden gap-4">
        <button className="text-on-surface-variant">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <span className="text-xl font-bold text-primary">AASRA Portal</span>
      </div>
      <div className="hidden md:block">
        <h2 className="text-xl font-bold text-on-surface">{title}</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
            search
          </span>
          <input
            className="pl-10 pr-4 py-2 bg-surface-container rounded-full border-none focus:ring-2 focus:ring-secondary text-sm w-64 text-on-surface placeholder:text-on-surface-variant/70 outline-none"
            placeholder="Search anonymous case ID"
            type="text"
          />
        </div>
        <div className="flex items-center gap-3 border-l border-outline-variant pl-4">
          <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined">account_circle</span>
            <span className="text-xs font-semibold hidden lg:block">Support Staff</span>
          </button>
        </div>
      </div>
    </header>
  );
};
