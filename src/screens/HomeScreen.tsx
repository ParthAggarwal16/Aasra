/**
 * ================================================================================
 * File: src/screens/HomeScreen.tsx
 * Description: Primary Daily Mood Check-In and Support Recommendation Screen.
 * Presents 4-quadrant mood check-in buttons with audio feedback, empathetic response
 * cards, and quick navigation shortcuts to Companion Calls, Activity, and Community.
 * ================================================================================
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight, PhoneCall, HeartHandshake, Smile } from 'lucide-react';
import { MoodType } from '../types';
import { speakText } from '../utils/speech';

interface HomeScreenProps {
  currentMood?: MoodType;
  onSelectMood: (mood: MoodType) => void;
  onNavigateToHelp: () => void;
  onNavigateToActivity: () => void;
  onNavigateToCommunity: () => void;
  onNavigateToCall: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentMood,
  onSelectMood,
  onNavigateToHelp,
  onNavigateToActivity,
  onNavigateToCommunity,
  onNavigateToCall,
}) => {
  const [selected, setSelected] = useState<MoodType | undefined>(currentMood);
  const [showFeedback, setShowFeedback] = useState(false);

  const moods = [
    {
      id: 'very_good' as MoodType,
      emoji: '🥰',
      hindi: 'Bohot Accha',
      english: 'Very Good',
      speech: 'Bohot Accha! Yeh jaan kar bohot khushi hui ki aap khush hain.',
      message: 'Yeh sunkar humein bohot khushi hui! Aaj ka din khushnuma rahe.',
      color: 'from-[#ffedd5] to-[#fef8f3]',
      ringColor: 'border-[#9e3d00]',
    },
    {
      id: 'good' as MoodType,
      emoji: '😊',
      hindi: 'Theek',
      english: 'Good',
      speech: 'Theek! Achhi baat hai, hum aapke saath hain.',
      message: 'Achha laga sunkar! Apne din ki shuruat shanti se karein.',
      color: 'from-[#ffedd5] to-[#fef8f3]',
      ringColor: 'border-[#9e3d00]',
    },
    {
      id: 'okay' as MoodType,
      emoji: '😐',
      hindi: 'Theek-thaak',
      english: 'Okay',
      speech: 'Theek-thaak. Koi baat nahi, thoda samay apne liye nikalein.',
      message: 'Kabhi kabhi thakan mehsoos hona aam baat hai. 2 minute shanti se baithein.',
      color: 'from-[#ffedd5] to-[#fef8f3]',
      ringColor: 'border-[#9e3d00]',
    },
    {
      id: 'not_good' as MoodType,
      emoji: '😔',
      hindi: 'Accha Nahi Lag Raha',
      english: 'Not So Good',
      speech: 'Accha nahi lag raha? Chinta mat kijiye, hum hamesha aapke saath hain. Kisi se baat karein.',
      message: 'Chinta mat kijiye, aap akele nahi hain. Kya aap kisi se baat karna chahte hain?',
      color: 'from-[#fed7aa]/30 to-[#fef8f3]',
      ringColor: 'border-[#9e3d00]',
    },
  ];

  const handleMoodClick = (moodItem: (typeof moods)[0]) => {
    setSelected(moodItem.id);
    onSelectMood(moodItem.id);
    speakText(moodItem.speech);
    setShowFeedback(true);
  };

  return (
    <div
      id="screen-home-mood"
      className="flex flex-col px-4 sm:px-8 py-6 max-w-4xl mx-auto w-full"
    >
      {/* Title */}
      <div className="text-center mb-7">
        <h1
          id="home-mood-heading"
          className="font-serif text-2xl sm:text-4xl font-bold text-[#1d1b19] tracking-tight leading-snug mb-2"
        >
          Aaj aap kaisa mehsoos kar rahe hain?
        </h1>
        <p className="text-base sm:text-xl text-[#594238] font-normal">
          How are you feeling today?
        </p>
      </div>

      {/* Grid of Moods (2 cols on mobile, 4 cols on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
        {moods.map((m) => {
          const isSelected = selected === m.id;
          return (
            <button
              key={m.id}
              id={`btn-mood-${m.id}`}
              type="button"
              onClick={() => handleMoodClick(m)}
              className={`flex flex-col items-center justify-center p-5 rounded-3xl bg-[#f8f3ee] border transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
                isSelected
                  ? 'border-[#9e3d00] ring-3 ring-[#ffddb9] bg-[#fffaf5]'
                  : 'border-[#ded9d4]/90 hover:border-[#8c7166]'
              }`}
            >
              {/* Emoji Display with soft lighting */}
              <div className="text-6xl sm:text-7xl mb-3 transform transition-transform group-hover:scale-110 select-none">
                {m.emoji}
              </div>

              <h2 className="font-serif text-xl font-bold text-[#1d1b19] text-center leading-tight mb-1">
                {m.hindi}
              </h2>

              <p className="text-sm text-[#594238] text-center">
                {m.english}
              </p>
            </button>
          );
        })}
      </div>

      {/* Empathetic Responsive Box */}
      {selected && (
        <div className="mt-7 p-5 rounded-3xl bg-[#f8f3ee] border border-[#ded9d4] shadow-xs text-left animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-[#9e3d00] font-serif font-bold text-lg mb-2">
            <Sparkles size={20} className="text-[#9e3d00]" />
            <span>AASRA Saathi</span>
          </div>

          <p className="text-base text-[#1d1b19] leading-relaxed mb-4">
            {moods.find((m) => m.id === selected)?.message}
          </p>

          {selected === 'not_good' || selected === 'okay' ? (
            <div className="flex flex-col gap-2.5">
              <button
                id="btn-quick-companion"
                onClick={onNavigateToHelp}
                className="w-full py-3 px-4 rounded-xl bg-[#9e3d00] text-white font-serif font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#7c2e00] transition-colors"
              >
                <PhoneCall size={18} />
                <span>Kisi se baat karein (Connect)</span>
              </button>

              <button
                id="btn-quick-meditation"
                onClick={onNavigateToActivity}
                className="w-full py-3 px-4 rounded-xl bg-[#ffddb9] text-[#835100] font-serif font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#fed7aa] transition-colors"
              >
                <span>2-Minute Shanti Activity</span>
                <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <button
              id="btn-quick-community"
              onClick={onNavigateToCommunity}
              className="w-full py-3 px-4 rounded-xl bg-[#006b58] text-white font-serif font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#005142] transition-colors"
            >
              <HeartHandshake size={18} />
              <span>Community Stories Padhein</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
