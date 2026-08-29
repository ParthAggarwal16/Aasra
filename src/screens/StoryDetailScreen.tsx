import React, { useState } from 'react';
import { ArrowLeft, Heart, BookOpen } from 'lucide-react';
import { SpeakerButton } from '../components/SpeakerButton';
import confetti from 'canvas-confetti';

interface StoryDetailScreenProps {
  onBack: () => void;
}

export const StoryDetailScreen: React.FC<StoryDetailScreenProps> = ({
  onBack,
}) => {
  const [supported, setSupported] = useState(false);
  const [supportCount, setSupportCount] = useState(48);

  const storyText = `Jab maine pehli baar is seva ka upyog kiya, mujhe bahut ghabrahat thi. Main akeli thi aur mujhe samajh nahi aa raha tha ki kahan se shuru karun. Par yahan par logon ne meri baat suni aur mujhe sahi rasta dikhaya. Aaj main aatma-nirbhar hoon aur apni choti si dukan chala rahi hoon. Mujhe ab lagta hai ki main akeli nahi hoon. Agar aap bhi pareshan hain, toh himmat mat hariye. Koi na koi madad zaroor milti hai.`;

  const handleSupport = () => {
    if (!supported) {
      setSupported(true);
      setSupportCount((prev) => prev + 1);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      } catch (e) {}
    } else {
      setSupported(false);
      setSupportCount((prev) => prev - 1);
    }
  };

  return (
    <div
      id="screen-story-detail"
      className="flex flex-col px-5 py-4 max-w-md mx-auto min-h-full space-y-4"
    >
      {/* Back Button matching Image 9 */}
      <div className="flex items-center justify-between">
        <button
          id="btn-story-back"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[#9e3d00] hover:text-[#7c2e00] font-serif font-bold text-lg cursor-pointer"
        >
          <ArrowLeft size={20} className="stroke-[2.5]" />
          <span>Peeche jayein (Back)</span>
        </button>
      </div>

      {/* Story Title */}
      <div className="text-center">
        <h1
          id="story-title"
          className="font-serif text-2xl sm:text-3xl font-bold text-[#1d1b19] tracking-tight leading-snug mb-1"
        >
          Ek Saathi ki kahani
        </h1>
        <p className="text-base sm:text-lg text-[#594238] font-normal">
          (A companion's story)
        </p>
      </div>

      {/* Story Content Box matching Image 9 */}
      <div className="w-full rounded-3xl bg-[#f8f3ee] border border-[#ded9d4] p-6 shadow-xs relative space-y-5">
        {/* Subtle background icon */}
        <div className="absolute top-4 right-4 text-[#ded9d4]/60 pointer-events-none">
          <BookOpen size={48} />
        </div>

        <p className="text-lg text-[#1d1b19] leading-relaxed font-sans font-normal">
          Jab maine pehli baar is seva ka upyog kiya, mujhe bahut ghabrahat thi. Main akeli thi aur mujhe samajh nahi aa raha tha ki kahan se shuru karun. Par yahan par logon ne meri baat suni aur mujhe sahi rasta dikhaya.
        </p>

        <p className="text-lg text-[#1d1b19] leading-relaxed font-sans font-normal">
          Aaj main aatma-nirbhar hoon aur apni choti si dukan chala rahi hoon. Mujhe ab lagta hai ki main akeli nahi hoon. Agar aap bhi pareshan hain, toh himmat mat hariye. Koi na koi madad zaroor milti hai.
        </p>

        {/* Bottom Actions: Support Heart & Speaker Audio matching Image 9 */}
        <div className="pt-6 flex items-center justify-between border-t border-[#ded9d4]/80">
          <div className="flex flex-col items-center gap-1">
            <button
              id="btn-support-story"
              type="button"
              onClick={handleSupport}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-sm transition-all active:scale-95 cursor-pointer ${
                supported
                  ? 'bg-[#8bf2d6] text-[#006b58] ring-4 ring-[#8bf2d6]/50'
                  : 'bg-[#8bf2d6] text-[#006b58] hover:bg-[#71d9bd]'
              }`}
            >
              <Heart size={26} className={supported ? 'fill-[#006b58]' : ''} />
            </button>
            <span className="text-xs font-serif font-semibold text-[#594238]">
              {supported ? 'Supported' : 'Support'} ({supportCount})
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <SpeakerButton
              id="story-speaker-btn"
              textToSpeak={storyText}
              size="lg"
              className="!bg-[#835100] !text-white hover:!bg-[#6c4200]"
            />
            <span className="text-xs font-serif font-semibold text-[#594238]">
              Sunein
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
