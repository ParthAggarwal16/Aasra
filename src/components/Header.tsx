import React from 'react';
import { User, Wifi, WifiOff } from 'lucide-react';
import { SpeakerButton } from './SpeakerButton';
import { BrandName } from '../types';

interface HeaderProps {
  brandName: BrandName;
  screenTitleText?: string;
  subtitle?: string;
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
  onProfileClick,
  isOffline,
  onToggleOffline,
  showBack = false,
  onBack,
}) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 flex items-center justify-between px-5 py-3 bg-[#fef8f3]/95 backdrop-blur-sm border-b border-[#ded9d4]/60"
    >
      <div className="flex items-center gap-2.5">
        {showBack && onBack ? (
          <button
            id="btn-header-back"
            onClick={onBack}
            className="flex items-center gap-1.5 text-[#9e3d00] font-semibold text-lg hover:underline pr-2"
          >
            <span className="text-xl">←</span>
            <span>Peeche / Back</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {/* Logo Badge */}
            <div className="w-8 h-8 rounded-lg bg-[#9e3d00]/10 border border-[#9e3d00]/20 flex items-center justify-center text-[#9e3d00] font-serif font-bold text-sm shadow-2xs">
              {brandName === 'AASRA' ? 'आ' : 'स'}
            </div>
            <div>
              <h1
                id="brand-header-title"
                className="font-serif text-2xl font-bold tracking-tight text-[#9e3d00] leading-none cursor-pointer"
                onClick={() => {}}
              >
                {brandName}
              </h1>
              {brandName === 'AASRA' && (
                <p className="text-[11px] text-[#594238] font-medium leading-tight mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        {/* Offline simulator toggle */}
        <button
          id="btn-network-toggle"
          onClick={onToggleOffline}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition-colors ${
            isOffline
              ? 'bg-[#ba1a1a]/10 border-[#ba1a1a]/30 text-[#ba1a1a]'
              : 'bg-[#006b58]/10 border-[#006b58]/30 text-[#006b58]'
          }`}
          title={isOffline ? 'Offline mode active (Click to switch to Online)' : 'Online mode active (Click to test Offline mode)'}
        >
          {isOffline ? <WifiOff size={13} /> : <Wifi size={13} />}
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
          className="w-11 h-11 rounded-full bg-[#9e3d00] text-white flex items-center justify-center shadow-sm hover:bg-[#7c2e00] active:scale-95 transition-all"
          aria-label="Profile and Settings"
          title="Profile & Privacy Settings"
        >
          <User size={20} className="text-white" />
        </button>
      </div>
    </header>
  );
};
