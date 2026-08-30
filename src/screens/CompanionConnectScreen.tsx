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
        {/* Step Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-600 mb-2">
            <span>Step 3 of 3: Connect</span>
          </div>
          <div className="grid grid-cols-3 gap-2 w-full">
            <div className="h-2 rounded-full bg-teal-600" />
            <div className="h-2 rounded-full bg-teal-600" />
            <div className="h-2 rounded-full bg-teal-600" />
          </div>
        </div>

        {/* Companion Avatar Circle with warm portrait */}
        <div className="flex flex-col items-center text-center my-6 relative">
          <div className="relative">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg bg-teal-50 flex items-center justify-center">
              <img
                alt="AASRA Avatar"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDpm0GTrh51qA0FeoJ-xwTjx4q8VodjavZliTnyzA71A_qR1QvvjvhbCC18R8L9SdF3xxyblDf_SQHRz0M1irmHp8f6jL6IZNI-aozLhX5eYM71S3yQDxYxefVsHbD44iqGysgxH0uRJHRqgt5GTkel929tJY5_fLEoGlLg6kdDtiH0z0nQgq1kGBwAwGKtWhy6o_1qvjEewOa8ylkGQC8qOqyMsgMRVDXUXlBUf-D7-3kEoBD7utGZg"
              />
            </div>

            {/* Floating Speaker button */}
            <div className="absolute -bottom-1 -right-1">
              <SpeakerButton textToSpeak={speechText} size="md" />
            </div>
          </div>

          {/* Heading */}
          <h1
            id="connect-title"
            className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug mt-6 mb-2"
          >
            Kya aap kisi se baat karna chahte hain?
          </h1>

          <p
            id="connect-subtitle"
            className="text-lg sm:text-xl text-slate-700 font-normal leading-relaxed mb-1"
          >
            Hamara ek {brandName} Saathi aapko call karega.
          </p>
          <p className="text-xs text-slate-500 font-normal">
            (Do you want to talk to someone? One of our companions will call you.)
          </p>
        </div>
      </div>

      {/* Action Buttons & Privacy Badge */}
      <div className="space-y-3.5 pt-4 pb-4">
        {/* Primary CTA */}
        <button
          id="btn-call-me-now"
          type="button"
          onClick={onCallMeNow}
          className="w-full min-h-[56px] rounded-2xl bg-teal-700 hover:bg-teal-800 active:scale-[0.98] text-white font-serif text-lg font-semibold flex items-center justify-center gap-3 shadow-md transition-all cursor-pointer"
        >
          <Phone size={22} className="stroke-[2.5]" />
          <span>Mujhe call karein</span>
        </button>

        {/* Secondary CTA */}
        <button
          id="btn-call-later"
          type="button"
          onClick={onLater}
          className="w-full min-h-[52px] rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-serif text-base font-semibold flex items-center justify-center transition-all cursor-pointer"
        >
          <span>Baad mein (Later)</span>
        </button>

        {/* Privacy Assurance Box */}
        <div className="w-full bg-teal-50/80 rounded-2xl p-4 border border-teal-200 flex items-start gap-3 text-left">
          <Shield size={22} className="text-teal-700 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-teal-800 font-medium leading-relaxed">
            Aapki baat-cheet bilkul private rahegi. Ham aapki jankari kisi ke sath share nahi karte.
          </p>
        </div>
      </div>
    </div>
  );
};
