import React, { useState } from 'react';
import { VoiceStateType } from '../../types';

interface VoiceCompanionScreenProps {
  onBack?: () => void;
  onNavigateToChat?: () => void;
}

export const VoiceCompanionScreen: React.FC<VoiceCompanionScreenProps> = ({
  onBack,
  onNavigateToChat,
}) => {
  const [currentState, setCurrentState] = useState<VoiceStateType>('ready');

  const statesOrder: VoiceStateType[] = [
    'ready',
    'listening',
    'processing',
    'speaking',
    'error',
  ];

  const cycleStates = () => {
    const currentIndex = statesOrder.indexOf(currentState);
    const nextIndex = (currentIndex + 1) % statesOrder.length;
    setCurrentState(statesOrder[nextIndex]);
  };

  const getMicButtonConfig = () => {
    switch (currentState) {
      case 'ready':
        return {
          btnClass:
            'relative z-10 w-20 h-20 bg-secondary text-on-secondary rounded-full flex items-center justify-center mic-active-shadow hover:bg-on-secondary-fixed-variant transition-all duration-300 active:scale-95 group cursor-pointer',
          icon: 'mic',
          iconClass: 'material-symbols-outlined text-4xl group-hover:scale-110 transition-transform duration-300',
          showRings: true,
          ringClass: 'bg-secondary/20',
          ring2Class: 'bg-secondary/10',
          statusText: 'Aasra is here to listen.',
        };
      case 'listening':
        return {
          btnClass:
            'relative z-10 w-20 h-20 bg-error-container text-on-error-container rounded-full flex items-center justify-center shadow-md transition-all duration-300 active:scale-95 group cursor-pointer',
          icon: 'mic',
          iconClass: 'material-symbols-outlined text-4xl group-hover:scale-110 transition-transform duration-300',
          showRings: true,
          ringClass: 'bg-error/20',
          ring2Class: 'bg-error/10',
          statusText: 'Tap to finish speaking',
        };
      case 'processing':
        return {
          btnClass:
            'relative z-10 w-20 h-20 bg-surface-variant text-on-surface-variant rounded-full flex items-center justify-center shadow-sm transition-all duration-300 cursor-wait',
          icon: 'hourglass_empty',
          iconClass: 'material-symbols-outlined text-4xl animate-spin',
          showRings: false,
          ringClass: '',
          ring2Class: '',
          statusText: 'Please wait...',
        };
      case 'speaking':
        return {
          btnClass:
            'relative z-10 w-20 h-20 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center shadow-md hover:bg-secondary-fixed-dim transition-all duration-300 active:scale-95 group cursor-pointer',
          icon: 'pause',
          iconClass: 'material-symbols-outlined text-4xl group-hover:scale-110 transition-transform duration-300',
          showRings: false,
          ringClass: '',
          ring2Class: '',
          statusText: 'Tap to interrupt',
        };
      case 'error':
        return {
          btnClass:
            'relative z-10 w-20 h-20 bg-surface-container-high text-on-surface-variant rounded-full flex items-center justify-center transition-all duration-300 opacity-50 cursor-pointer',
          icon: 'mic_off',
          iconClass: 'material-symbols-outlined text-4xl',
          showRings: false,
          ringClass: '',
          ring2Class: '',
          statusText: 'Connection issue.',
        };
    }
  };

  const config = getMicButtonConfig();

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md antialiased md:items-center md:justify-center md:bg-surface-variant">
      {/* Main Container (Fixed max-width for consistent mobile feel on desktop) */}
      <main className="w-full h-screen max-w-[440px] mx-auto bg-surface relative flex flex-col overflow-hidden md:h-[850px] md:rounded-[32px] md:shadow-2xl md:border md:border-outline-variant/30">
        {/* TopAppBar */}
        <header className="flex justify-between items-center w-full px-container-padding h-touch-target-min bg-surface/80 dark:bg-surface-dim/80 backdrop-blur-xl fixed top-0 md:absolute z-50 shadow-sm transition-all duration-200">
          <button
            type="button"
            onClick={onBack || onNavigateToChat}
            aria-label="Go back"
            className="w-12 h-12 flex items-center justify-start text-primary dark:text-primary-fixed-dim hover:bg-surface-container-high/50 dark:hover:bg-inverse-surface/50 rounded-full transition-colors active:scale-95 cursor-pointer"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              arrow_back
            </span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">
            Voice Companion
          </h1>
          <div className="w-12 h-12" /> {/* Spacer for centering */}
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col items-center justify-between pt-24 pb-safe px-container-padding z-10 relative overflow-y-auto">
          {/* Top Section: Avatar */}
          <div className="w-full flex flex-col items-center mt-8">
            <div className="relative w-48 h-48 md:w-56 md:h-56 mb-6">
              {/* Subtle background glow */}
              <div className="absolute inset-0 rounded-full bg-secondary-fixed/20 avatar-glow blur-xl" />
              {/* Avatar Image */}
              <img
                alt="Aasra Avatar"
                className="w-full h-full object-cover rounded-full relative z-10 border-4 border-surface shadow-md"
                data-alt="A warm, compassionate portrait illustration of a reassuring female Indian healthcare companion (Aasra). She has a soft, empathetic smile and calming presence. The illustration style is flat vector modernism with earthy tones, soft lighting, and smooth curves, set against a clean off-white background."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDpm0GTrh51qA0FeoJ-xwTjx4q8VodjavZliTnyzA71A_qR1QvvjvhbCC18R8L9SdF3xxyblDf_SQHRz0M1irmHp8f6jL6IZNI-aozLhX5eYM71S3yQDxYxefVsHbD44iqGysgxH0uRJHRqgt5GTkel929tJY5_fLEoGlLg6kdDtiH0z0nQgq1kGBwAwGKtWhy6o_1qvjEewOa8ylkGQC8qOqyMsgMRVDXUXlBUf-D7-3kEoBD7utGZg"
              />
            </div>
          </div>

          {/* Middle Section: Dynamic Status Text */}
          <div className="w-full text-center px-4 mb-8 min-h-[80px] flex items-center justify-center">
            {/* State 1: Ready */}
            {currentState === 'ready' && (
              <div className="text-center">
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  Whenever you're ready.
                </p>
              </div>
            )}

            {/* State 2: Listening */}
            {currentState === 'listening' && (
              <div className="text-center w-full">
                <p className="font-hindi-body text-hindi-body text-on-surface mb-2">
                  "I'm listening..."
                </p>
                <p className="font-hindi-body text-hindi-body text-on-surface-variant opacity-80">
                  Bol sakte hain, main sun rahi hoon.
                </p>
              </div>
            )}

            {/* State 3: Processing */}
            {currentState === 'processing' && (
              <div className="text-center">
                <p className="font-hindi-body text-hindi-body text-on-surface mb-2">
                  "Ek pal..."
                </p>
                <p className="font-hindi-body text-hindi-body text-on-surface-variant opacity-80">
                  Main aapki baat samajhne ki koshish kar rahi hoon.
                </p>
              </div>
            )}

            {/* State 4: Speaking */}
            {currentState === 'speaking' && (
              <div className="text-center">
                <div className="flex items-center gap-2 mb-2 text-secondary justify-center">
                  <span className="material-symbols-outlined animate-pulse">
                    volume_up
                  </span>
                  <p className="font-body-lg text-body-lg font-medium">
                    Aasra is speaking...
                  </p>
                </div>
              </div>
            )}

            {/* State 5: Error */}
            {currentState === 'error' && (
              <div className="text-center w-full">
                <p className="font-hindi-body text-hindi-body text-error mb-4">
                  Sorry, main aapki baat sun nahi paayi. Ek baar phir try karein.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    type="button"
                    onClick={() => setCurrentState('listening')}
                    className="px-6 py-3 rounded-full bg-surface-container-high text-on-surface font-label-caps text-label-caps hover:bg-surface-variant transition-colors shadow-sm border border-outline-variant/50 cursor-pointer"
                  >
                    Try Again
                  </button>
                  <button
                    type="button"
                    onClick={onNavigateToChat}
                    className="px-6 py-3 rounded-full bg-secondary text-on-secondary font-label-caps text-label-caps hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
                  >
                    Use Chat
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Section: Controls */}
          <div className="w-full flex flex-col items-center pb-8">
            {/* Status text above mic */}
            <p
              className="font-body-md text-body-md text-on-surface-variant mb-6 text-center"
              id="mic-status"
            >
              {config.statusText}
            </p>

            {/* Primary Mic Button */}
            <div className="relative w-24 h-24 flex items-center justify-center mb-8">
              {/* Pulse rings (visible in ready/listening states) */}
              {config.showRings && (
                <>
                  <div
                    className={`absolute inset-0 rounded-full ${config.ringClass} mic-pulse-ring`}
                    id="mic-ring-1"
                  />
                  <div
                    className={`absolute inset-0 rounded-full ${config.ring2Class} mic-pulse-ring`}
                    id="mic-ring-2"
                    style={{ animationDelay: '1s' }}
                  />
                </>
              )}

              {/* Main Button */}
              <button
                type="button"
                className={config.btnClass}
                id="main-mic-btn"
                onClick={cycleStates}
              >
                <span
                  className={config.iconClass}
                  id="mic-icon"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {config.icon}
                </span>
              </button>
            </div>

            {/* Privacy & Secondary Actions */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-1.5 text-on-surface-variant opacity-75">
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  lock
                </span>
                <span className="font-nav-label text-nav-label">
                  Your conversation is private.
                </span>
              </div>
              <button
                type="button"
                onClick={onNavigateToChat || onBack}
                className="font-label-caps text-label-caps text-primary hover:text-primary-container transition-colors py-2 px-4 rounded-full hover:bg-surface-container-lowest cursor-pointer"
              >
                End Conversation
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
