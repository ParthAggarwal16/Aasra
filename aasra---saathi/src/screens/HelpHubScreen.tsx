import React from 'react';
import { UserCheck, Palette, Users, PhoneCall, ArrowRight } from 'lucide-react';

interface HelpHubScreenProps {
  onTalkToSomeone: () => void;
  onTryActivity: () => void;
  onCommunitySupport: () => void;
  onEmergencyHelp: () => void;
}

export const HelpHubScreen: React.FC<HelpHubScreenProps> = ({
  onTalkToSomeone,
  onTryActivity,
  onCommunitySupport,
  onEmergencyHelp,
}) => {
  return (
    <div
      id="screen-help-hub"
      className="flex flex-col px-5 py-6 max-w-md mx-auto space-y-5"
    >
      {/* Heading */}
      <div className="text-left mb-2">
        <h1
          id="help-hub-heading"
          className="font-serif text-2xl sm:text-3xl font-bold text-[#1d1b19] tracking-tight leading-snug mb-1"
        >
          Hum aapki kya madad kar sakte hain?
        </h1>
        <p className="text-lg text-[#594238] font-normal">
          How can we help you today?
        </p>
      </div>

      {/* Option 1: Talk to someone */}
      <button
        id="btn-help-talk"
        type="button"
        onClick={onTalkToSomeone}
        className="w-full text-left p-5 rounded-3xl bg-[#ede7e2] hover:bg-[#e7e1dd] border border-[#ded9d4] shadow-xs active:scale-[0.99] transition-all flex items-center gap-4 cursor-pointer group"
      >
        <div className="w-16 h-16 rounded-full bg-[#fed7aa] flex-shrink-0 flex items-center justify-center text-[#9e3d00] group-hover:scale-105 transition-transform">
          <UserCheck size={30} className="stroke-[2.2]" />
        </div>
        <div className="flex-1">
          <h2 className="font-serif text-xl font-bold text-[#1d1b19] leading-snug">
            Kisi se baat karni hai
          </h2>
          <p className="text-base text-[#594238] mt-0.5">
            Talk to someone
          </p>
        </div>
      </button>

      {/* Option 2: Try an activity */}
      <button
        id="btn-help-activity"
        type="button"
        onClick={onTryActivity}
        className="w-full text-left p-5 rounded-3xl bg-[#ede7e2] hover:bg-[#e7e1dd] border border-[#ded9d4] shadow-xs active:scale-[0.99] transition-all flex items-center gap-4 cursor-pointer group"
      >
        <div className="w-16 h-16 rounded-full bg-[#8bf2d6] flex-shrink-0 flex items-center justify-center text-[#006b58] group-hover:scale-105 transition-transform">
          <Palette size={30} className="stroke-[2.2]" />
        </div>
        <div className="flex-1">
          <h2 className="font-serif text-xl font-bold text-[#1d1b19] leading-snug">
            Koshish karein
          </h2>
          <p className="text-base text-[#594238] mt-0.5">
            Try an activity
          </p>
        </div>
      </button>

      {/* Option 3: Community support */}
      <button
        id="btn-help-community"
        type="button"
        onClick={onCommunitySupport}
        className="w-full text-left p-5 rounded-3xl bg-[#ede7e2] hover:bg-[#e7e1dd] border border-[#ded9d4] shadow-xs active:scale-[0.99] transition-all flex items-center gap-4 cursor-pointer group"
      >
        <div className="w-16 h-16 rounded-full bg-[#fed7aa] flex-shrink-0 flex items-center justify-center text-[#9e3d00] group-hover:scale-105 transition-transform">
          <Users size={30} className="stroke-[2.2]" />
        </div>
        <div className="flex-1">
          <h2 className="font-serif text-xl font-bold text-[#1d1b19] leading-snug">
            Aap akele nahi hain
          </h2>
          <p className="text-base text-[#594238] mt-0.5">
            Community support
          </p>
        </div>
      </button>

      {/* Option 4: Emergency help (Highlighted Pink/Red) */}
      <button
        id="btn-help-emergency"
        type="button"
        onClick={onEmergencyHelp}
        className="w-full text-left p-5 rounded-3xl bg-[#fed7d7]/60 hover:bg-[#fed7d7]/90 border border-[#ba1a1a]/30 shadow-xs active:scale-[0.99] transition-all flex items-center justify-between gap-4 cursor-pointer mt-4 group"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#ba1a1a]/20 flex-shrink-0 flex items-center justify-center text-[#ba1a1a]">
            <PhoneCall size={26} className="text-[#ba1a1a]" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-[#7c2e00] leading-snug">
              Emergency help
            </h2>
            <p className="text-base text-[#7c2e00]/90 mt-0.5">
              Immediate support
            </p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#ba1a1a]/10 flex items-center justify-center text-[#ba1a1a]">
          <PhoneCall size={20} />
        </div>
      </button>
    </div>
  );
};
