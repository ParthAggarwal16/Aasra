/**
 * ================================================================================
 * File: src/screens/ActivityScreen.tsx
 * Description: Grounding & Guided Breathing Activity Screen.
 * Provides interactive 2-minute paced breathing exercises (Inhale, Hold, Exhale)
 * with animated visual cues, speech guidance, and completion celebrations.
 * ================================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle, Sparkles, Heart } from 'lucide-react';
import { SpeakerButton } from '../components/SpeakerButton';
import { speakText } from '../utils/speech';
import confetti from 'canvas-confetti';

interface ActivityScreenProps {
  onBack: () => void;
}

export const ActivityScreen: React.FC<ActivityScreenProps> = ({ onBack }) => {
  const [isActive, setIsActive] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(120); // 2 minutes
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef<number | null>(null);

  const speechText =
    'Aaj ki choti koshish. 2 minute shaanti se baithein. Isse mann ko shanti milti hai.';

  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            try {
              confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
            } catch (e) {}
            speakText('Bahut badhiya! Aapka 2 minute ka dhyan poora hua.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, secondsLeft]);

  // Breathing cycle update
  useEffect(() => {
    if (!isActive) return;
    const cycleTime = (120 - secondsLeft) % 12;
    if (cycleTime < 4) {
      setBreathPhase('inhale');
    } else if (cycleTime < 8) {
      setBreathPhase('hold');
    } else {
      setBreathPhase('exhale');
    }
  }, [secondsLeft, isActive]);

  const handleStart = () => {
    setIsActive(true);
    setIsCompleted(false);
    speakText('Apni aankhein dheere se band karein aur lambi gehri saans lein.');
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(120);
    setIsCompleted(false);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const breathInstructions = {
    inhale: { text: 'Gehri saans andar lein (Inhale...)', scale: 'scale-125' },
    hold: { text: 'Saans rokein (Hold...)', scale: 'scale-125' },
    exhale: { text: 'Dheere se saans chhodein (Exhale...)', scale: 'scale-90' },
  };

  return (
    <div
      id="screen-activity-meditation"
      className="flex flex-col px-5 py-4 max-w-md mx-auto min-h-full justify-between"
    >
      <div>
        {/* Back Navigation Bar matching Image 8 */}
        <div className="flex items-center justify-between mb-4">
          <button
            id="btn-activity-back"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[#9e3d00] hover:text-[#7c2e00] font-serif font-bold text-lg cursor-pointer"
          >
            <ArrowLeft size={20} className="stroke-[2.5]" />
            <span>Peeche / Back</span>
          </button>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1
            id="activity-title"
            className="font-serif text-2xl sm:text-3xl font-bold text-[#1d1b19] tracking-tight leading-snug mb-1"
          >
            Aaj ki Choti Koshish
          </h1>
          <p className="text-lg text-[#594238] font-normal">
            Today's Small Effort
          </p>
        </div>

        {/* Meditation Main Card matching Image 8 */}
        <div className="relative w-full rounded-3xl bg-[#f8f3ee] border border-[#ded9d4] p-6 shadow-sm flex flex-col items-center text-center overflow-hidden">
          {/* Subtle dotted background grid pattern */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#8c7166 1.5px, transparent 1.5px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Floating speaker audio button in top-right */}
          <div className="absolute top-4 right-4 z-10">
            <SpeakerButton textToSpeak={speechText} size="md" />
          </div>

          {/* Meditation Circle Graphic / Interactive Breathing Sphere */}
          <div className="relative my-4 flex items-center justify-center">
            <div
              className={`w-44 h-44 rounded-full bg-[#8bf2d6] flex flex-col items-center justify-center relative shadow-inner transition-transform duration-1000 ease-in-out ${
                isActive ? breathInstructions[breathPhase].scale : ''
              }`}
            >
              {/* Concentric peaceful rings */}
              <div className="absolute inset-2 rounded-full border-2 border-white/60 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-[#006b58]/10 flex flex-col items-center justify-center p-3 text-center">
                  <span className="text-xs font-semibold text-[#006b58] uppercase tracking-wider mb-0.5">
                    Activity
                  </span>
                  <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center text-[#006b58] shadow-xs mb-1">
                    🧘
                  </div>
                  <span className="text-[11px] font-bold text-[#006b58] leading-tight">
                    Mindful Meditation
                  </span>
                  <span className="text-[10px] text-[#006b58]/80">
                    2 min • Shanti
                  </span>
                </div>
              </div>
            </div>

            {/* Ripple when active */}
            {isActive && (
              <div className="absolute inset-0 rounded-full bg-[#8bf2d6]/30 animate-ripple pointer-events-none" />
            )}
          </div>

          {/* Activity Subtitle */}
          <h2 className="font-serif text-2xl font-bold text-[#1d1b19] tracking-tight leading-snug mt-2 mb-1">
            2 minute shaanti se baithein
          </h2>
          <p className="text-base text-[#594238] font-normal mb-6">
            Sit quietly for 2 minutes
          </p>

          {/* Live Timer or Breath Guidance */}
          {isActive ? (
            <div className="w-full bg-[#fffaf5] p-4 rounded-2xl border border-[#ffddb9] mb-4 animate-in fade-in">
              <div className="text-3xl font-mono font-bold text-[#9e3d00] mb-1">
                {formatTime(secondsLeft)}
              </div>
              <p className="text-base font-semibold text-[#006b58] font-serif">
                {breathInstructions[breathPhase].text}
              </p>
            </div>
          ) : isCompleted ? (
            <div className="w-full bg-[#8bf2d6]/30 p-4 rounded-2xl border border-[#006b58]/30 mb-4 flex items-center justify-center gap-2 text-[#006b58] font-serif font-bold text-lg">
              <CheckCircle size={24} />
              <span>Shaandar! 2 minute poore hue.</span>
            </div>
          ) : (
            /* Benefit Info Box matching Image 8 */
            <div className="w-full bg-[#fffaf5] p-4 rounded-2xl border border-[#ded9d4] flex items-start gap-3.5 text-left mb-4">
              <div className="w-10 h-10 rounded-full bg-[#9e3d00] flex-shrink-0 flex items-center justify-center text-white mt-0.5">
                🧘
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1d1b19] leading-snug">
                  Isse mann ko shanti milti hai.
                </h3>
                <p className="text-sm text-[#594238] mt-0.5">
                  This brings peace to the mind.
                </p>
              </div>
            </div>
          )}

          {/* Action Control Button matching Image 8 */}
          {!isActive ? (
            <button
              id="btn-start-meditation"
              type="button"
              onClick={handleStart}
              className="w-full min-h-[56px] rounded-2xl bg-[#9e3d00] hover:bg-[#7c2e00] active:scale-[0.98] text-white font-serif text-xl font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Play size={20} className="fill-white" />
              <span>{isCompleted ? 'Dobara Shuru karein' : 'Shuru karein / Start'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 w-full">
              <button
                id="btn-pause-meditation"
                type="button"
                onClick={handlePause}
                className="flex-1 min-h-[56px] rounded-2xl bg-[#fed7aa] hover:bg-[#ffedd5] text-[#835100] font-serif text-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Pause size={20} />
                <span>Rokein (Pause)</span>
              </button>

              <button
                id="btn-reset-meditation"
                type="button"
                onClick={handleReset}
                className="w-14 h-14 rounded-2xl bg-[#ede7e2] hover:bg-[#ded9d4] text-[#594238] flex items-center justify-center shadow-sm"
                title="Reset timer"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
