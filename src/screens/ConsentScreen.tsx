/**
 * ================================================================================
 * File: src/screens/ConsentScreen.tsx
 * Description: Step 2 Informed Consent & Privacy Safeguards Screen.
 * Clearly explains data privacy principles, voluntary participation, and rights
 * before onboarding users into the AASRA platform.
 * ================================================================================
 */

import React from 'react';
import { Heart, Hand, Shield, HandMetal, ArrowRight } from 'lucide-react';
import { SpeakerButton } from '../components/SpeakerButton';

interface ConsentScreenProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const ConsentScreen: React.FC<ConsentScreenProps> = ({
  onAccept,
  onDecline,
}) => {
  const speechText =
    'Hum aapki madad karna chahte hain. Hum aapka haal-chaal puchenge, aapki baatein safe rahengi, aur aap kabhi bhi mana kar sakte hain.';

  return (
    <div
      id="screen-consent"
      className="min-h-full flex flex-col justify-between px-5 py-6 max-w-md mx-auto"
    >
      <div className="flex flex-col items-center text-center">
        {/* Top Heart Badge with pulse aura */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-[#8bf2d6]/40 flex items-center justify-center animate-pulse-gentle">
            <div className="w-16 h-16 rounded-full bg-[#8bf2d6] flex items-center justify-center text-[#006b58] shadow-sm">
              <Heart size={32} className="fill-[#006b58] text-[#006b58]" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1
          id="consent-title"
          className="font-serif text-2xl sm:text-3xl font-bold text-[#1d1b19] tracking-tight leading-snug mb-1"
        >
          Hum aapki madad karna chahte hain
        </h1>

        <p
          id="consent-subtitle"
          className="text-lg text-[#594238] font-normal mb-6"
        >
          (We want to help you)
        </p>

        {/* Features / Safeguards Card */}
        <div className="w-full bg-[#f8f3ee] rounded-3xl p-5 border border-[#ded9d4]/80 shadow-xs text-left relative space-y-6">
          {/* Item 1 */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#fed7aa] flex-shrink-0 flex items-center justify-center text-[#9e3d00] mt-0.5">
              <Hand size={24} className="stroke-[2.2]" />
            </div>
            <div className="flex-1 pr-2">
              <h3 className="font-serif text-lg font-bold text-[#1d1b19] leading-snug">
                Hum aapka haal-chaal puchenge
              </h3>
              <p className="text-sm text-[#594238]">
                (We will check on you)
              </p>
            </div>
            {/* Inline Speaker button matching design */}
            <div className="flex-shrink-0">
              <SpeakerButton
                textToSpeak="Hum aapka haal-chaal puchenge. We will check on you."
                size="md"
              />
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#8bf2d6] flex-shrink-0 flex items-center justify-center text-[#006b58] mt-0.5">
              <Shield size={24} className="fill-[#006b58] text-[#006b58]" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-bold text-[#1d1b19] leading-snug">
                Aapki baatein safe rahengi
              </h3>
              <p className="text-sm text-[#594238]">
                (Your words are safe)
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#fed7aa] flex-shrink-0 flex items-center justify-center text-[#9e3d00] mt-0.5">
              <HandMetal size={24} className="stroke-[2.2]" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-bold text-[#1d1b19] leading-snug">
                Aap kabhi bhi mana kar sakte hain
              </h3>
              <p className="text-sm text-[#594238]">
                (You can say no anytime)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full pt-8 pb-4 flex flex-col items-center gap-3">
        <button
          id="btn-consent-accept"
          type="button"
          onClick={onAccept}
          className="w-full min-h-[58px] rounded-2xl bg-[#9e3d00] hover:bg-[#7c2e00] active:scale-[0.98] text-white font-serif text-xl font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <span>Haan, mujhe manzoor hai</span>
          <ArrowRight size={22} className="stroke-[2.5]" />
        </button>

        <button
          id="btn-consent-decline"
          type="button"
          onClick={onDecline}
          className="text-[#594238] font-serif text-lg font-medium hover:text-[#1d1b19] py-2 cursor-pointer transition-colors"
        >
          Abhi nahi
        </button>
      </div>
    </div>
  );
};
