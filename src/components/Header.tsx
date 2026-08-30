/**
 * ================================================================================
 * File: src/components/Header.tsx
 * Description: Global Header Component with responsive branding, desktop navigation
 * links, back button controls, offline simulator toggle, screen audio narration,
 * and user profile access. Updated to modern clean white & teal theme.
 * ================================================================================
 */

import React from 'react';
import { User, Home, HelpCircle, Calendar, Users, Phone, ArrowLeft } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { BrandName, TabType } from '../types';

interface HeaderProps {
  brandName: BrandName;
  screenTitleText?: string;
  subtitle?: string;
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
  onProfileClick: () => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  brandName,
  screenTitleText = 'AASRA support application',
  subtitle = 'AI-Assisted Support & Risk Assessment',
  activeTab,
  onTabChange,
  onProfileClick,
  isOffline,
  onToggleOffline,
  showBack = false,
  onBack,
}) => {
  const navItems = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'help' as TabType, label: 'Madad/Help', icon: HelpCircle },
    { id: 'activity' as TabType, label: 'Activity', icon: Calendar },
    { id: 'community' as TabType, label: 'Community', icon: Users },
    { id: 'call' as TabType, label: 'Emergency', icon: Phone },
  ];

  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200"
    >
      <div className="flex items-center gap-3">
        {showBack && onBack ? (
          <button
            id="btn-header-back"
            onClick={onBack}
            className="flex items-center gap-1.5 text-teal-700 font-semibold text-base sm:text-lg hover:underline pr-2 cursor-pointer"
          >
            <ArrowLeft size={19} className="stroke-[2.5]" />
            <span>Peeche / Back</span>
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            {/* Vibe-Matching Compassionate Logo Badge */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-teal-700/20 border border-teal-200/50 shrink-0">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c-4.5 4-7 8-7 12a7 7 0 0 0 14 0c0-4-2.5-8-7-12Z" fill="rgba(255,255,255,0.25)"/>
                <path d="M12 8v9"/>
                <path d="M9 14.5c1.8 1.2 4.2 1.2 6 0"/>
              </svg>
            </div>
            <div>
              <h1
                id="brand-header-title"
                className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-none"
              >
                {brandName}
              </h1>
              {brandName === 'AASRA' && (
                <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5 hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Navigation Bar (hidden on mobile, visible on md+) */}
      {onTabChange && (
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Speaker button */}
        <SpeakerButton
          id="header-speaker-btn"
          textToSpeak={screenTitleText}
          size="md"
        />

        {/* Profile / Settings button */}
        <button
          id="btn-header-profile"
          onClick={onProfileClick}
          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center border border-slate-200 shadow-2xs active:scale-95 transition-all cursor-pointer"
          aria-label="Profile and Settings"
          title="Profile & Privacy Settings"
        >
          <User size={19} className="text-slate-700" />
        </button>
      </div>
    </header>
  );
};
