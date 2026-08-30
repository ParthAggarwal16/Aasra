/**
 * ================================================================================
 * File: src/screens/SuccessScreen.tsx
 * Description: Submission Confirmation & Encouragement Screen.
 * Displays celebration animations (confetti), audio confirmation, and home navigation.
 * ================================================================================
 */

import React, { useEffect } from 'react';
import { Check, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakText } from '../utils/speech';

interface SuccessScreenProps {
  onGoHome: () => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ onGoHome }) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#006b58', '#9e3d00', '#8bf2d6', '#ffddb9'],
      });
    } catch (e) {}

    speakText('Dhanyawad! Humne aapki baat sun li.');
  }, []);

  return (
    <div
      id="screen-success"
      className="min-h-full flex flex-col justify-between items-center px-6 py-12 max-w-md mx-auto text-center"
    >
      <div className="flex-1 flex flex-col items-center justify-center my-auto">
        {/* Large Mint Circle with Checkmark matching Image 14 */}
        <div className="w-32 h-32 rounded-full bg-[#8bf2d6] flex items-center justify-center text-[#006b58] shadow-md mb-8 animate-in zoom-in-75 duration-300">
          <div className="w-20 h-20 rounded-full bg-[#006b58] flex items-center justify-center text-white shadow-inner">
            <Check size={44} className="stroke-[3]" />
          </div>
        </div>

        <h1
          id="success-title"
          className="font-serif text-3xl sm:text-4xl font-bold text-[#1d1b19] tracking-tight leading-snug mb-3"
        >
          Dhanyawad!
        </h1>

        <p
          id="success-subtitle"
          className="text-xl sm:text-2xl text-[#594238] font-normal leading-relaxed max-w-xs"
        >
          Humne aapki baat sun li.
        </p>
      </div>

      {/* Primary Home Action Button matching Image 14 */}
      <div className="w-full pt-4">
        <button
          id="btn-back-to-home"
          type="button"
          onClick={onGoHome}
          className="w-full min-h-[58px] rounded-2xl bg-[#9e3d00] hover:bg-[#7c2e00] active:scale-[0.98] text-white font-serif text-lg sm:text-xl font-bold flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer uppercase tracking-wider"
        >
          <Home size={22} className="stroke-[2.5]" />
          <span>HOME PAR WAPAS JAYEIN</span>
        </button>
      </div>
    </div>
  );
};
