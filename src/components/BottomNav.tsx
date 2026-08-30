/**
 * ================================================================================
 * File: src/components/BottomNav.tsx
 * Description: Mobile Bottom Navigation Bar for AASRA. Provides touch-friendly
 * switching between Home, Help, Activity, Community, and Emergency call screens.
 * Clean white theme with teal active states.
 * ================================================================================
 */

import React from 'react';
import { Home, HelpCircle, Calendar, Users, Phone } from 'lucide-react';
import { BrandName, TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  brandName: BrandName;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  brandName,
  onTabChange,
}) => {
  const tabs = [
    {
      id: 'home' as TabType,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'help' as TabType,
      label: 'Madad/Help',
      icon: HelpCircle,
    },
    {
      id: 'activity' as TabType,
      label: 'Activity',
      icon: Calendar,
    },
    {
      id: 'community' as TabType,
      label: brandName,
      icon: Users,
    },
    {
      id: 'call' as TabType,
      label: 'Call',
      icon: Phone,
    },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="md:hidden sticky bottom-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around shadow-lg"
      role="navigation"
      aria-label="Main Navigation"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center min-w-[60px] py-1 px-1.5 rounded-xl transition-all ${
              isActive
                ? 'text-teal-700 font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <div
              className={`p-1.5 rounded-xl transition-all ${
                isActive ? 'bg-teal-50 text-teal-700' : ''
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} />
            </div>
            <span
              className={`text-[12px] mt-0.5 tracking-tight whitespace-nowrap ${
                isActive ? 'font-bold text-teal-700' : 'text-slate-500'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
