/**
 * ================================================================================
 * File: src/screens/CompanionConnectScreen.tsx
 * Description: Step 3 Companion Connect Call Invitation Screen.
 * Invites the user to connect with an empathetic AI Saathi companion via voice call,
 * with privacy assurance and audio narration.
 * ================================================================================
 */

import React from 'react';
import { Phone, Shield, UserCheck, Heart } from 'lucide-react';
import { SpeakerButton } from '../components/SpeakerButton';
import { BrandName } from '../types';

interface CompanionConnectScreenProps {
  brandName: BrandName;
  onCallMeNow: () => void;
  onLater: () => void;
}

export const CompanionConnectScreen: React.FC<CompanionConnectScreenProps> = ({
  brandName,
  onCallMeNow,
  onLater,
}) => {
  const speechText = `Kya aap kisi se baat karna chahte hain? Hamara ek ${brandName} saathi aapko call karega. Aapki baat cheet bilkul private rahegi.`;

  return (
    <div
      id="screen-companion-connect"
      className="flex flex-col px-5 py-4 max-w-md mx-auto min-h-full justify-between"
    >
      <div>
        {/* Step Progress Bar matching Image 10 */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-base font-serif font-semibold text-[#594238] mb-2">
            <span>Step 3 of 3: Connect</span>
          </div>
          <div className="grid grid-cols-3 gap-2 w-full">
            <div className="h-2 rounded-full bg-[#006b58]" />
            <div className="h-2 rounded-full bg-[#006b58]" />
            <div className="h-2 rounded-full bg-[#006b58]" />
          </div>
        </div>

        {/* Companion Avatar Circle with floating audio button */}
        <div className="flex flex-col items-center text-center my-6 relative">
          <div className="relative">
            <div className="w-36 h-36 rounded-full bg-[#ded9d4]/80 border-4 border-white flex flex-col items-center justify-center shadow-md">
              <div className="w-20 h-20 rounded-full bg-[#ffddb9] flex items-center justify-center text-[#9e3d00] shadow-sm relative">
                <UserCheck size={40} className="stroke-[2.2]" />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#8bf2d6] flex items-center justify-center text-[#006b58] shadow-2xs">
                  <Heart size={14} className="fill-[#006b58]" />
                </div>
              </div>
            </div>

            {/* Floating Speaker button overlapping circle matching Image 10 */}
            <div className="absolute -bottom-1 -right-1">
              <SpeakerButton textToSpeak={speechText} size="md" />
            </div>
          </div>

          {/* Heading */}
          <h1
            id="connect-title"
            className="font-serif text-2xl sm:text-3xl font-bold text-[#1d1b19] tracking-tight leading-snug mt-6 mb-2"
          >
            Kya aap kisi se baat karna chahte hain?
          </h1>

          <p
            id="connect-subtitle"
            className="text-lg sm:text-xl text-[#594238] font-normal leading-relaxed mb-1"
          >
            Hamara ek {brandName} aapko call karega.
          </p>
          <p className="text-sm text-[#594238]/80 font-normal">
            (Do you want to talk to someone? One of our companions will call you.)
          </p>
        </div>
      </div>

      {/* Action Buttons & Privacy Badge matching Image 10 */}
      <div className="space-y-4 pt-4 pb-4">
        {/* Primary CTA */}
        <button
          id="btn-call-me-now"
          type="button"
          onClick={onCallMeNow}
          className="w-full min-h-[58px] rounded-2xl bg-[#9e3d00] hover:bg-[#7c2e00] active:scale-[0.98] text-white font-serif text-xl font-semibold flex items-center justify-center gap-3 shadow-md transition-all cursor-pointer"
        >
          <Phone size={22} className="stroke-[2.5]" />
          <span>Mujhe call karein</span>
        </button>

        {/* Secondary CTA */}
        <button
          id="btn-call-later"
          type="button"
          onClick={onLater}
          className="w-full min-h-[56px] rounded-2xl bg-[#ded9d4]/60 hover:bg-[#ded9d4] text-[#1d1b19] font-serif text-lg font-semibold flex items-center justify-center transition-all cursor-pointer"
        >
          <span>Baad mein (Later)</span>
        </button>

        {/* Privacy Assurance Box matching Image 10 */}
        <div className="w-full bg-[#8bf2d6]/30 rounded-2xl p-4 border border-[#8bf2d6] flex items-start gap-3 text-left">
          <Shield size={22} className="text-[#006b58] flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-[#006b58] font-medium leading-relaxed">
            Aapki baat-cheet bilkul private rahegi. Ham aapki jankari kisi ke sath share nahi karte.
          </p>
        </div>
      </div>
    </div>
  );
};
