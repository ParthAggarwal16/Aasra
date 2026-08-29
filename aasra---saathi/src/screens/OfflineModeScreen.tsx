import React from 'react';
import { CloudOff, Phone, Contact2, Plus, ShieldAlert } from 'lucide-react';
import { BrandName } from '../types';

interface OfflineModeScreenProps {
  brandName: BrandName;
  onDirectCall: (number: string, name: string) => void;
}

export const OfflineModeScreen: React.FC<OfflineModeScreenProps> = ({
  brandName,
  onDirectCall,
}) => {
  return (
    <div
      id="screen-offline-mode"
      className="flex flex-col px-5 py-4 max-w-md mx-auto min-h-full space-y-5"
    >
      {/* Offline Alert Hero Card matching Image 3 & 15 */}
      <div className="w-full rounded-3xl bg-[#ede7e2] border border-[#ded9d4] p-6 flex flex-col items-center text-center shadow-xs">
        {/* Cloud Off Icon in Soft Circle */}
        <div className="w-20 h-20 rounded-full bg-[#f8f3ee] flex items-center justify-center text-[#594238] mb-4 shadow-2xs">
          <CloudOff size={36} className="stroke-[1.8]" />
        </div>

        <h1
          id="offline-hero-title"
          className="font-serif text-2xl sm:text-3xl font-bold text-[#1d1b19] tracking-tight leading-snug mb-2"
        >
          Internet ki dikkat hai
        </h1>

        <p
          id="offline-hero-subtitle"
          className="text-lg text-[#594238] font-normal leading-relaxed mb-6"
        >
          Lekin chinta mat kariye, aap humein seedha call kar sakte hain.
        </p>

        {/* Direct Call Button matching design */}
        <button
          id="btn-offline-direct-call"
          type="button"
          onClick={() => onDirectCall('1800-123-456', `${brandName} Direct Helpline`)}
          className="w-full min-h-[56px] rounded-2xl bg-[#9e3d00] hover:bg-[#7c2e00] active:scale-[0.98] text-white font-serif text-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer uppercase tracking-wider"
        >
          <Phone size={20} className="fill-white" />
          <span>DIRECT CALL</span>
        </button>
      </div>

      {/* Zaroori Number Section */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-1">
          <Contact2 size={22} className="text-[#9e3d00]" />
          <h2 className="font-serif text-2xl font-bold text-[#1d1b19] tracking-tight">
            Zaroori Number
          </h2>
        </div>

        <p className="text-base text-[#594238] font-normal mb-4">
          Yeh number bina internet ke bhi kaam karenge.
        </p>

        {/* 3 Contact Cards matching Image 3 & 15 */}
        <div className="space-y-3">
          {/* AASRA / Saathi Help */}
          <div className="w-full bg-white p-4 rounded-3xl border border-[#ded9d4] shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#8bf2d6] flex-shrink-0 flex items-center justify-center text-[#006b58] font-serif font-bold text-lg">
                आ
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1d1b19] leading-tight">
                  {brandName} Help
                </h3>
                <p className="text-lg text-[#594238] font-mono font-medium">
                  1800-123-456
                </p>
              </div>
            </div>
            <button
              id="btn-call-offline-help"
              onClick={() => onDirectCall('1800-123-456', `${brandName} Help`)}
              className="w-12 h-12 rounded-full bg-[#ffddb9]/70 hover:bg-[#fed7aa] flex items-center justify-center text-[#9e3d00] transition-colors"
              aria-label={`Call ${brandName} Help`}
            >
              <Phone size={20} className="fill-[#9e3d00]" />
            </button>
          </div>

          {/* Ambulance */}
          <div className="w-full bg-white p-4 rounded-3xl border border-[#ded9d4] shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#fed7d7] flex-shrink-0 flex items-center justify-center text-[#ba1a1a]">
                <Plus size={28} className="stroke-[3]" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1d1b19] leading-tight">
                  Ambulance
                </h3>
                <p className="text-xl text-[#594238] font-mono font-bold">
                  108
                </p>
              </div>
            </div>
            <button
              id="btn-call-offline-ambulance"
              onClick={() => onDirectCall('108', 'Ambulance')}
              className="w-12 h-12 rounded-full bg-[#ffddb9]/70 hover:bg-[#fed7aa] flex items-center justify-center text-[#9e3d00] transition-colors"
              aria-label="Call Ambulance"
            >
              <Phone size={20} className="fill-[#9e3d00]" />
            </button>
          </div>

          {/* Police */}
          <div className="w-full bg-white p-4 rounded-3xl border border-[#ded9d4] shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#a46700]/30 flex-shrink-0 flex items-center justify-center text-[#835100]">
                <ShieldAlert size={26} className="stroke-[2.2]" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1d1b19] leading-tight">
                  Police
                </h3>
                <p className="text-xl text-[#594238] font-mono font-bold">
                  100
                </p>
              </div>
            </div>
            <button
              id="btn-call-offline-police"
              onClick={() => onDirectCall('100', 'Police')}
              className="w-12 h-12 rounded-full bg-[#ffddb9]/70 hover:bg-[#fed7aa] flex items-center justify-center text-[#9e3d00] transition-colors"
              aria-label="Call Police"
            >
              <Phone size={20} className="fill-[#9e3d00]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
