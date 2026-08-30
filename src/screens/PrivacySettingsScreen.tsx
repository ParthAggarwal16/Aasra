/**
 * ================================================================================
 * File: src/screens/PrivacySettingsScreen.tsx
 * Description: User Privacy, Confidentiality & App Customization Screen.
 * Configures check-in call preferences, community post pseudonymity, and brand masking.
 * ================================================================================
 */

import React, { useState } from 'react';
import { Lock, Phone, Users, Check, ArrowRight, Shield, Globe, Tag } from 'lucide-react';
import { UserSettings } from '../types';
import { speakText } from '../utils/speech';

interface PrivacySettingsScreenProps {
  settings: UserSettings;
  onSaveSettings: (updated: Partial<UserSettings>) => void;
  onBack: () => void;
}

export const PrivacySettingsScreen: React.FC<PrivacySettingsScreenProps> = ({
  settings,
  onSaveSettings,
  onBack,
}) => {
  const [checkinCalls, setCheckinCalls] = useState(settings.checkinCallsEnabled);
  const [communityShare, setCommunityShare] = useState(settings.communityShareEnabled);
  const [brand, setBrand] = useState(settings.brandName);
  const [language, setLanguage] = useState(settings.language);

  const speechText =
    'Aapki privacy hamare liye zaroori hai. Aap kya share karna chahte hain, ye aap par nirbhar karta hai.';

  const handleSave = () => {
    onSaveSettings({
      checkinCallsEnabled: checkinCalls,
      communityShareEnabled: communityShare,
      brandName: brand,
      language: language,
    });
    speakText('Aapki privacy settings save ho gayi hain.');
    onBack();
  };

  return (
    <div
      id="screen-privacy-settings"
      className="flex flex-col px-5 py-4 max-w-md mx-auto min-h-full space-y-4"
    >
      {/* Top Header Card matching Image 12 */}
      <div className="w-full rounded-3xl bg-[#f8f3ee] border border-[#ded9d4] p-6 flex flex-col items-center text-center shadow-xs">
        <div className="w-18 h-18 rounded-full bg-[#fed7aa] flex items-center justify-center text-[#9e3d00] mb-3">
          <Lock size={32} className="stroke-[2.2]" />
        </div>

        <h1
          id="privacy-title"
          className="font-serif text-2xl sm:text-3xl font-bold text-[#1d1b19] tracking-tight leading-snug mb-1"
        >
          Aapki Privacy hamare liye zaroori hai
        </h1>

        <p className="text-sm text-[#594238] font-medium mb-2">
          Your privacy is important to us.
        </p>

        <p className="text-base text-[#594238] font-normal leading-relaxed">
          Aap kya share karna chahte hain, ye aap par nirbhar karta hai.
        </p>
      </div>

      {/* Setting 1: Haal-chaal ke calls matching Image 12 */}
      <div className="w-full rounded-3xl bg-[#f8f3ee] border border-[#ded9d4] p-5 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-start gap-3.5 flex-1 pr-2">
          <div className="w-10 h-10 rounded-full bg-[#fed7aa]/50 flex-shrink-0 flex items-center justify-center text-[#9e3d00] mt-0.5">
            <Phone size={20} />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1d1b19] leading-tight mb-1">
              Haal-chaal ke calls
            </h2>
            <p className="text-sm sm:text-base text-[#594238] leading-snug">
              Kya aap chahte hain ki hum aapko haal-chaal poochne ke liye call karein?
            </p>
          </div>
        </div>

        {/* Custom Pill Toggle Switch matching Image 12 */}
        <button
          id="toggle-checkin-calls"
          type="button"
          role="switch"
          aria-checked={checkinCalls}
          onClick={() => setCheckinCalls(!checkinCalls)}
          className={`w-14 h-8 rounded-full p-1 transition-colors flex items-center shadow-inner ${
            checkinCalls ? 'bg-[#9e3d00] justify-end' : 'bg-[#ded9d4] justify-start'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-[#9e3d00]">
            {checkinCalls ? <Check size={14} className="stroke-[3]" /> : <span className="text-xs text-[#8c7166]">✕</span>}
          </div>
        </button>
      </div>

      {/* Setting 2: Community mein share karna matching Image 12 */}
      <div className="w-full rounded-3xl bg-[#f8f3ee] border border-[#ded9d4] p-5 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-start gap-3.5 flex-1 pr-2">
          <div className="w-10 h-10 rounded-full bg-[#fed7aa]/50 flex-shrink-0 flex items-center justify-center text-[#9e3d00] mt-0.5">
            <Users size={20} />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#1d1b19] leading-tight mb-1">
              Community mein share karna
            </h2>
            <p className="text-sm sm:text-base text-[#594238] leading-snug">
              Khaas jankari sirf aapke doston ko dikhegi.
            </p>
          </div>
        </div>

        {/* Custom Pill Toggle Switch matching Image 12 */}
        <button
          id="toggle-community-share"
          type="button"
          role="switch"
          aria-checked={communityShare}
          onClick={() => setCommunityShare(!communityShare)}
          className={`w-14 h-8 rounded-full p-1 transition-colors flex items-center shadow-inner ${
            communityShare ? 'bg-[#9e3d00] justify-end' : 'bg-[#ded9d4] justify-start'
          }`}
        >
          <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-[#9e3d00]">
            {communityShare ? <Check size={14} className="stroke-[3]" /> : <span className="text-xs text-[#8c7166]">✕</span>}
          </div>
        </button>
      </div>

      {/* Brand Identity Customization */}
      <div className="w-full rounded-3xl bg-[#f8f3ee] border border-[#ded9d4] p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Tag size={18} className="text-[#9e3d00]" />
          <h3 className="font-serif font-bold text-base text-[#1d1b19]">
            Brand Naam (Display Name)
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            id="btn-brand-aasra"
            type="button"
            onClick={() => setBrand('AASRA')}
            className={`py-2.5 px-3 rounded-2xl font-serif font-bold text-base border transition-all ${
              brand === 'AASRA'
                ? 'bg-[#9e3d00] text-white border-[#9e3d00] shadow-2xs'
                : 'bg-white text-[#594238] border-[#ded9d4]'
            }`}
          >
            AASRA
          </button>
          <button
            id="btn-brand-saathi"
            type="button"
            onClick={() => setBrand('Saathi')}
            className={`py-2.5 px-3 rounded-2xl font-serif font-bold text-base border transition-all ${
              brand === 'Saathi'
                ? 'bg-[#9e3d00] text-white border-[#9e3d00] shadow-2xs'
                : 'bg-white text-[#594238] border-[#ded9d4]'
            }`}
          >
            Saathi
          </button>
        </div>
      </div>

      {/* Primary Save Button matching Image 12 */}
      <div className="pt-3 pb-2">
        <button
          id="btn-save-privacy"
          type="button"
          onClick={handleSave}
          className="w-full min-h-[58px] rounded-2xl bg-[#9e3d00] hover:bg-[#7c2e00] active:scale-[0.98] text-white font-serif text-xl font-semibold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <span>Save karein</span>
          <ArrowRight size={22} className="stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
