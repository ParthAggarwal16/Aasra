/**
 * ================================================================================
 * File: src/components/SpeakerButton.tsx
 * Description: Accessibility Audio Read-Aloud Button Component. Triggers speech
 * synthesis for headings, cards, and instructions across the AASRA UI.
 * ================================================================================
 */

import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakText, stopSpeaking, subscribeSpeechState } from '../utils/speech';

interface SpeakerButtonProps {
  textToSpeak: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  id?: string;
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({
  textToSpeak,
  className = '',
  size = 'md',
  label,
  id,
}) => {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeSpeechState((isSpk) => {
      setSpeaking(isSpk);
    });
    return unsubscribe;
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (speaking) {
      stopSpeaking();
    } else {
      speakText(textToSpeak);
    }
  };

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 26,
  };

  if (label) {
    return (
      <button
        id={id || 'speaker-button-labeled'}
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#835100] text-white hover:bg-[#6c4200] active:scale-95 transition-all shadow-sm font-medium ${
          speaking ? 'ring-4 ring-[#ffddb9] animate-pulse' : ''
        } ${className}`}
        aria-label="Text to speech audio"
      >
        {speaking ? <VolumeX size={iconSizes[size]} /> : <Volume2 size={iconSizes[size]} />}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      id={id || 'speaker-button-icon'}
      type="button"
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center rounded-full bg-[#fed7aa] text-[#594238] hover:bg-[#ffedd5] active:scale-95 transition-all shadow-sm border border-[#e0c0b2]/40 ${sizeClasses[size]} ${
        speaking ? 'ring-4 ring-[#9e3d00]/30 animate-pulse' : ''
      } ${className}`}
      aria-label="Listen to text"
      title="Sunne ke liye dabayein (Click to listen)"
    >
      {speaking && (
        <span className="absolute inset-0 rounded-full bg-[#9e3d00]/20 animate-ping" />
      )}
      {speaking ? (
        <VolumeX size={iconSizes[size]} className="text-[#9e3d00]" />
      ) : (
        <Volume2 size={iconSizes[size]} className="text-[#594238]" />
      )}
    </button>
  );
};
