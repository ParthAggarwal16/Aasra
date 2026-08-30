/**
 * ================================================================================
 * File: src/screens/EmergencyCallScreen.tsx
 * Description: Emergency Helpline & Crisis Response Screen.
 * Provides immediate one-touch dialing for Police (100 / 112), Women Helpline (1091),
 * Ambulance (102), and Tele-MANAS (14416) with simulated in-app call routing.
 * ================================================================================
 */

import React, { useState } from 'react';
import { Phone, AlertCircle, PhoneCall, Check } from 'lucide-react';
import { SpeakerButton } from '../components/SpeakerButton';
import { BrandName } from '../types';

interface EmergencyCallScreenProps {
  brandName: BrandName;
  onDirectCall: (number: string, serviceName: string) => void;
}

export const EmergencyCallScreen: React.FC<EmergencyCallScreenProps> = ({
  brandName,
  onDirectCall,
}) => {
  const [callingService, setCallingService] = useState<string | null>(null);

  const heroSpeech =
    'Turant madad chahiye? Hum hamesha aapke saath hain. Police ke liye 100, Mahila helpline ke liye 1091, aur Ambulance ke liye 102 par call karein.';

  const emergencyContacts = [
    {
      id: 'police',
      name: 'Police',
      number: '100',
      bgColor: 'bg-[#ba1a1a] hover:bg-[#9a1515]',
      circleColor: 'bg-[#d32f2f]/60',
      speech: 'Calling Police emergency helpline 100',
    },
    {
      id: 'womens_helpline',
      name: "Women's Helpline",
      number: '1091',
      bgColor: 'bg-[#833800] hover:bg-[#6c2e00]',
      circleColor: 'bg-[#a44c00]/60',
      speech: "Calling Women's Helpline 1091",
    },
    {
      id: 'ambulance',
      name: 'Ambulance',
      number: '102',
      bgColor: 'bg-[#c64f00] hover:bg-[#a84300]',
      circleColor: 'bg-[#e06616]/60',
      speech: 'Calling Ambulance emergency service 102',
    },
  ];

  const handleCall = (contact: (typeof emergencyContacts)[0]) => {
    setCallingService(contact.name);
    onDirectCall(contact.number, contact.name);
    setTimeout(() => setCallingService(null), 3000);
  };

  return (
    <div
      id="screen-emergency-call"
      className="flex flex-col px-5 py-4 max-w-md mx-auto min-h-full space-y-4"
    >
      {/* Hero Card matching Screen 1 & 16 */}
      <div className="w-full rounded-3xl bg-[#fed7d7]/50 border border-[#ba1a1a]/20 p-6 flex flex-col items-center text-center relative overflow-hidden shadow-xs">
        {/* Soft background aura and red circle */}
        <div className="w-24 h-24 rounded-full bg-[#fed7d7] flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[#ba1a1a] shadow-sm flex items-center justify-center text-white">
            <AlertCircle size={32} className="stroke-[2.5]" />
          </div>
        </div>

        <h1
          id="emergency-hero-title"
          className="font-serif text-2xl sm:text-3xl font-bold text-[#ba1a1a] tracking-tight leading-snug mb-2"
        >
          Turant Madad chahiye?
        </h1>

        <p
          id="emergency-hero-subtitle"
          className="text-lg text-[#7c2e00] font-normal leading-relaxed mb-5"
        >
          Hum hamesha aapke saath hain.
        </p>

        {/* Hero Audio Button "Sunein (Listen)" matching Image 1 */}
        <SpeakerButton
          textToSpeak={heroSpeech}
          size="md"
          label="Sunein (Listen)"
          className="!bg-[#835100] !text-white text-base py-2.5 px-6 shadow-md"
        />
      </div>

      {/* Emergency Call Buttons matching Screen 1 & 16 */}
      <div className="space-y-3.5 pt-2">
        {emergencyContacts.map((contact) => (
          <button
            key={contact.id}
            id={`btn-call-${contact.id}`}
            type="button"
            onClick={() => handleCall(contact)}
            className={`w-full p-4 rounded-3xl text-white shadow-md flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer ${contact.bgColor}`}
          >
            <div className="flex items-center gap-4 text-left">
              {/* Left soft circle */}
              <div
                className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center ${contact.circleColor}`}
              >
                <PhoneCall size={24} className="text-white opacity-90" />
              </div>

              <div>
                <h2 className="font-serif text-2xl font-bold tracking-tight leading-tight">
                  {contact.name}
                </h2>
                <p className="text-2xl font-mono font-bold tracking-wider opacity-95">
                  {contact.number}
                </p>
              </div>
            </div>

            {/* Right Call Action Icon */}
            <div className="w-13 h-13 rounded-full bg-white text-[#9e3d00] flex items-center justify-center shadow-md flex-shrink-0">
              <Phone size={24} className="fill-[#9e3d00] stroke-[2]" />
            </div>
          </button>
        ))}
      </div>

      {/* Toll Free Helpline for AASRA */}
      <div className="pt-3">
        <button
          id="btn-call-aasra-helpline"
          onClick={() => onDirectCall('1800-123-456', `${brandName} Helpline`)}
          className="w-full p-3.5 rounded-2xl bg-[#ede7e2] hover:bg-[#ded9d4] border border-[#ded9d4] text-[#594238] flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8bf2d6] flex items-center justify-center text-[#006b58]">
              <Phone size={18} />
            </div>
            <div>
              <p className="font-serif font-bold text-base text-[#1d1b19]">
                {brandName} Toll-Free Support
              </p>
              <p className="text-xs text-[#594238]">1800-123-456 (24x7 Free)</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#006b58] bg-white px-2.5 py-1 rounded-full border border-[#8bf2d6]">
            Free
          </span>
        </button>
      </div>
    </div>
  );
};
