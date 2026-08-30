/**
 * ================================================================================
 * File: src/components/Header.tsx
 * Description: Global Header Component with responsive branding, desktop navigation
 * links, back button controls, offline simulator toggle, screen audio narration,
 * and user profile access.
 * ================================================================================
 */

import React from 'react';
import { User, Wifi, WifiOff, Home, HelpCircle, Calendar, Users, Phone } from 'lucide-react';
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
      className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-[#fef8f3]/95 backdrop-blur-md border-b border-[#ded9d4]/60"
    >
      <div className="flex items-center gap-3">
        {showBack && onBack ? (
          <button
            id="btn-header-back"
            onClick={onBack}
            className="flex items-center gap-1.5 text-[#9e3d00] font-semibold text-base sm:text-lg hover:underline pr-2 cursor-pointer"
          >
            <span className="text-xl">←</span>
            <span>Peeche / Back</span>
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            {/* Vibe-Matching Compassionate Logo Badge */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9e3d00] via-[#c2410c] to-[#ea580c] flex items-center justify-center text-white shadow-md shadow-[#9e3d00]/20 border border-white/30 shrink-0">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c-4.5 4-7 8-7 12a7 7 0 0 0 14 0c0-4-2.5-8-7-12Z" fill="rgba(255,255,255,0.25)"/>
                <path d="M12 8v9"/>
                <path d="M9 14.5c1.8 1.2 4.2 1.2 6 0"/>
              </svg>
            </div>
            <div>
              <h1
                id="brand-header-title"
                className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#9e3d00] leading-none"
              >
                {brandName}
              </h1>
              {brandName === 'AASRA' && (
                <p className="text-[11px] text-[#594238] font-medium leading-tight mt-0.5 hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Navigation Bar (hidden on mobile, visible on md+) */}
      {onTabChange && (
        <nav className="hidden md:flex items-center gap-1 bg-[#ede7e2]/60 p-1 rounded-2xl border border-[#ded9d4]/60">
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
                    ? 'bg-[#9e3d00] text-white shadow-sm'
                    : 'text-[#594238] hover:text-[#1d1b19] hover:bg-[#ded9d4]/40'
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
        {/* Offline simulator toggle */}
        <button
          id="btn-network-toggle"
          onClick={onToggleOffline}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
            isOffline
              ? 'bg-[#ba1a1a]/10 border-[#ba1a1a]/30 text-[#ba1a1a]'
              : 'bg-[#006b58]/10 border-[#006b58]/30 text-[#006b58]'
          }`}
          title={isOffline ? 'Offline mode active' : 'Online mode active'}
        >
          {isOffline ? <WifiOff size={14} /> : <Wifi size={14} />}
          <span className="hidden sm:inline">{isOffline ? 'Offline' : 'Online'}</span>
        </button>

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
          className="w-10 h-10 rounded-xl bg-[#9e3d00] text-white flex items-center justify-center shadow-sm hover:bg-[#7c2e00] active:scale-95 transition-all cursor-pointer"
          aria-label="Profile and Settings"
          title="Profile & Privacy Settings"
        >
          <User size={19} className="text-white" />
        </button>
      </div>
    </header>
  );
};
