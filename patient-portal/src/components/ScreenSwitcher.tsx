import React, { useState } from 'react';
import { ScreenType } from '../types';

interface ScreenSwitcherProps {
  currentScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
}

export const ScreenSwitcher: React.FC<ScreenSwitcherProps> = ({
  currentScreen,
  onSelectScreen,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const screens: { id: ScreenType; label: string; icon: string }[] = [
    { id: 'phone-login', label: '1. Phone Login', icon: 'smartphone' },
    { id: 'otp', label: '2. OTP Verify', icon: 'pin' },
    { id: 'auth-success', label: '3. Auth Success', icon: 'check_circle' },
    { id: 'chatbot', label: '4. AI Chatbot', icon: 'chat' },
    { id: 'voice-companion', label: '5. Voice Companion', icon: 'mic' },
  ];

  return (
    <div className="fixed bottom-3 right-3 z-50 font-body-md select-none print:hidden">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-primary text-on-primary px-3 py-2 rounded-full shadow-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-primary-container transition-all active:scale-95 border border-outline-variant/40 cursor-pointer"
          title="Switch between extracted Stitch screens"
        >
          <span className="material-symbols-outlined text-sm">dashboard</span>
          <span>Screens ({screens.findIndex((s) => s.id === currentScreen) + 1}/5)</span>
        </button>
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl shadow-2xl p-3 w-64 text-on-surface backdrop-blur-lg bg-opacity-95 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline-variant/30">
            <span className="text-xs font-bold text-primary tracking-wider uppercase">
              AASRA Screens
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {screens.map((screen) => {
              const isActive = currentScreen === screen.id;
              return (
                <button
                  key={screen.id}
                  type="button"
                  onClick={() => {
                    onSelectScreen(screen.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-secondary text-on-secondary shadow-sm font-semibold'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {screen.icon}
                  </span>
                  <span>{screen.label}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-2.5 pt-2 border-t border-outline-variant/20 text-[10px] text-on-surface-variant text-center opacity-70">
            Natural flow also works via screen buttons
          </div>
        </div>
      )}
    </div>
  );
};
