/**
 * ================================================================================
 * File: src/screens/WelcomeScreen.tsx
 * Description: First-Time User Onboarding & Warm Welcome Screen.
 * Introduces AASRA Saathi with accessibility speech greeting and initial start button.
 * ================================================================================
 */

import React from 'react';
import { ArrowRight, HeartHandshake } from 'lucide-react';
import { SpeakerButton } from '../components/SpeakerButton';

interface WelcomeScreenProps {
  onContinue: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  const speechText = 'Namaste, hum aapke saath hain. Hello, we are with you.';

  return (
    <div
      id="screen-welcome"
      className="min-h-full flex flex-col justify-between items-center px-6 py-10 max-w-md mx-auto"
    >
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full my-auto">
        {/* Decorative Compassionate Illustration */}
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-[#f3ede8] border-2 border-[#ded9d4] flex flex-col items-center justify-center shadow-inner mb-10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#8bf2d6]/20 via-[#ffddb9]/30 to-transparent pointer-events-none" />
          <div className="w-24 h-24 rounded-full bg-[#ffddb9] flex items-center justify-center text-[#9e3d00] shadow-sm mb-2">
            <HeartHandshake size={48} className="text-[#9e3d00]" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#594238]/60 mt-1">
            AASRA • SAATHI
          </span>
        </div>

        {/* Welcoming Heading */}
        <h1
          id="welcome-title"
          className="font-serif text-3xl sm:text-4xl font-bold text-[#1d1b19] tracking-tight leading-snug mb-3"
        >
          Namaste, hum aapke saath hain.
        </h1>

        <p
          id="welcome-subtitle"
          className="text-xl sm:text-2xl text-[#594238] font-normal leading-relaxed mb-8"
        >
          Hello, we are with you.
        </p>

        {/* Speaker audio button */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <SpeakerButton
            id="welcome-speaker-btn"
            textToSpeak={speechText}
            size="lg"
          />
          <span className="text-sm font-medium text-[#594238]">
            Sunne ke liye dabayein
          </span>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="w-full pt-4">
        <button
          id="btn-welcome-next"
          type="button"
          onClick={onContinue}
          className="w-full min-h-[58px] rounded-2xl bg-[#9e3d00] hover:bg-[#7c2e00] active:scale-[0.98] text-white font-serif text-xl font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <span>Aage Badhein</span>
          <ArrowRight size={22} className="stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
