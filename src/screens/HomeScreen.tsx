/**
 * ================================================================================
 * File: src/screens/HomeScreen.tsx
 * Description: Primary Daily Mood Check-In and Support Recommendation Screen.
 * Presents 4-quadrant mood check-in buttons with audio feedback, empathetic response
 * cards, and quick navigation shortcuts to Companion Calls, Activity, and Community.
 * Clean white / slate theme.
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
      color: 'from-emerald-50 to-white',
      ringColor: 'border-emerald-600',
    },
    {
      id: 'good' as MoodType,
      emoji: '😊',
      hindi: 'Theek',
      english: 'Good',
      speech: 'Theek! Achhi baat hai, hum aapke saath hain.',
      message: 'Achha laga sunkar! Apne din ki shuruat shanti se karein.',
      color: 'from-teal-50 to-white',
      ringColor: 'border-teal-600',
    },
    {
      id: 'okay' as MoodType,
      emoji: '😐',
      hindi: 'Theek-thaak',
      english: 'Okay',
      speech: 'Theek-thaak. Koi baat nahi, thoda samay apne liye nikalein.',
      message: 'Kabhi kabhi thakan mehsoos hona aam baat hai. 2 minute shanti se baithein.',
      color: 'from-amber-50 to-white',
      ringColor: 'border-amber-600',
    },
    {
      id: 'not_good' as MoodType,
      emoji: '😔',
      hindi: 'Accha Nahi Lag Raha',
      english: 'Not So Good',
      speech: 'Accha nahi lag raha? Chinta mat kijiye, hum hamesha aapke saath hain. Kisi se baat karein.',
      message: 'Chinta mat kijiye, aap akele nahi hain. Kya aap kisi se baat karna chahte hain?',
      color: 'from-rose-50 to-white',
      ringColor: 'border-rose-600',
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
          className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-snug mb-2"
        >
          Aaj aap kaisa mehsoos kar rahe hain?
        </h1>
        <p className="text-base sm:text-xl text-slate-600 font-normal">
          How are you feeling today?
        </p>
      </div>

      {/* Mood Buttons Grid (Responsive: 2 cols on mobile, 4 cols on tablet/desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {moods.map((m) => {
          const isSelected = selected === m.id;
          return (
            <button
              key={m.id}
              id={`mood-btn-${m.id}`}
              type="button"
              onClick={() => handleMoodClick(m)}
              className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-3xl border-2 transition-all cursor-pointer bg-gradient-to-b ${m.color} ${
                isSelected
                  ? `${m.ringColor} shadow-md scale-[1.02] ring-2 ring-teal-600/30`
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <span className="text-4xl sm:text-5xl mb-3 filter drop-shadow-xs">{m.emoji}</span>
              <span className="font-serif text-base sm:text-lg font-bold text-slate-900 text-center leading-tight">
                {m.hindi}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 text-center mt-0.5">
                {m.english}
              </span>
            </button>
          );
        })}
      </div>

      {/* Feedback Card */}
      {showFeedback && selected && (
        <div
          id="home-mood-feedback-card"
          className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm mb-6 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 shrink-0 mt-0.5">
              <Sparkles size={22} />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-bold text-slate-900 mb-1">
                AASRA Saathi Sandesh
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {moods.find((m) => m.id === selected)?.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Recommendation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Card 1: Companion Talk */}
        <button
          type="button"
          onClick={onNavigateToHelp}
          className="text-left p-4 sm:p-5 rounded-3xl bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 group-hover:scale-105 transition-transform">
              <PhoneCall size={22} />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-slate-900">
                Saathi se baat karein
              </h4>
              <p className="text-xs sm:text-sm text-slate-500">
                Talk to our voice companion
              </p>
            </div>
          </div>
          <ArrowRight size={18} className="text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-all" />
        </button>

        {/* Card 2: Community Support */}
        <button
          type="button"
          onClick={onNavigateToCommunity}
          className="text-left p-4 sm:p-5 rounded-3xl bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700 group-hover:scale-105 transition-transform">
              <HeartHandshake size={22} />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-slate-900">
                Community se judein
              </h4>
              <p className="text-xs sm:text-sm text-slate-500">
                Read inspiring peer stories
              </p>
            </div>
          </div>
          <ArrowRight size={18} className="text-slate-400 group-hover:text-indigo-700 group-hover:translate-x-1 transition-all" />
        </button>
      </div>
    </div>
  );
};
