/**
 * ================================================================================
 * File: src/screens/HelpHubScreen.tsx
 * Description: Central Support & Assistance Hub Screen.
 * Provides quick-action navigation for Voice Companion Calls, Streaming AI Chatbot,
 * Grounding activities, Peer community stories, and Emergency helpline dispatch.
 * Clean white background styling.
 * ================================================================================
 */

import React from 'react';
import { UserCheck, Palette, Users, PhoneCall, Bot, ArrowRight, Sparkles } from 'lucide-react';

interface HelpHubScreenProps {
  onTalkToSomeone: () => void;
  onOpenChat?: () => void;
  onTryActivity: () => void;
  onCommunitySupport: () => void;
  onEmergencyHelp: () => void;
}

export const HelpHubScreen: React.FC<HelpHubScreenProps> = ({
  onTalkToSomeone,
  onOpenChat,
  onTryActivity,
  onCommunitySupport,
  onEmergencyHelp,
}) => {
  return (
    <div
      id="screen-help-hub"
      className="flex flex-col px-5 py-6 max-w-md mx-auto space-y-4"
    >
      {/* Heading */}
      <div className="text-left mb-1">
        <h1
          id="help-hub-heading"
          className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug mb-1"
        >
          Hum aapki kya madad kar sakte hain?
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-normal">
          How can we help you today?
        </p>
      </div>

      {/* Option 1: AI Voice Companion Call */}
      <button
        id="btn-help-talk"
        type="button"
        onClick={onTalkToSomeone}
        className="w-full text-left p-4 sm:p-5 rounded-3xl bg-white hover:bg-slate-50 border border-slate-200 shadow-xs active:scale-[0.99] transition-all flex items-center gap-4 cursor-pointer group"
      >
        <div className="w-14 h-14 rounded-full bg-teal-50 flex-shrink-0 flex items-center justify-center text-teal-700 group-hover:scale-105 transition-transform">
          <UserCheck size={28} className="stroke-[2.2]" />
        </div>
        <div className="flex-1">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            Saathi se baat karein (Voice Call)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time AI Voice Companion
          </p>
        </div>
      </button>

      {/* Option 2: AI Chat Support */}
      {onOpenChat && (
        <button
          id="btn-help-chat"
          type="button"
          onClick={onOpenChat}
          className="w-full text-left p-4 sm:p-5 rounded-3xl bg-white hover:bg-slate-50 border border-slate-200 shadow-xs active:scale-[0.99] transition-all flex items-center gap-4 cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-600 flex-shrink-0 flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-xs">
            <Bot size={28} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                AI Saathi se Chat karein
              </h2>
              <Sparkles size={16} className="text-teal-600" />
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Instant Legal & Trauma-Informed AI Guidance
            </p>
          </div>
        </button>
      )}

      {/* Option 3: Try an activity */}
      <button
        id="btn-help-activity"
        type="button"
        onClick={onTryActivity}
        className="w-full text-left p-4 sm:p-5 rounded-3xl bg-white hover:bg-slate-50 border border-slate-200 shadow-xs active:scale-[0.99] transition-all flex items-center gap-4 cursor-pointer group"
      >
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex-shrink-0 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
          <Palette size={28} className="stroke-[2.2]" />
        </div>
        <div className="flex-1">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            Koshish karein (Activity)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Relaxation & grounding exercises
          </p>
        </div>
      </button>

      {/* Option 4: Community support */}
      <button
        id="btn-help-community"
        type="button"
        onClick={onCommunitySupport}
        className="w-full text-left p-4 sm:p-5 rounded-3xl bg-white hover:bg-slate-50 border border-slate-200 shadow-xs active:scale-[0.99] transition-all flex items-center gap-4 cursor-pointer group"
      >
        <div className="w-14 h-14 rounded-full bg-indigo-50 flex-shrink-0 flex items-center justify-center text-indigo-700 group-hover:scale-105 transition-transform">
          <Users size={28} className="stroke-[2.2]" />
        </div>
        <div className="flex-1">
          <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-900 leading-snug">
            Aap akele nahi hain (Community)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Read stories of courage and recovery
          </p>
        </div>
      </button>

      {/* Option 5: Emergency help (Highlighted Red) */}
      <button
        id="btn-help-emergency"
        type="button"
        onClick={onEmergencyHelp}
        className="w-full text-left p-4 sm:p-5 rounded-3xl bg-rose-50/70 hover:bg-rose-50 border border-rose-200 shadow-xs active:scale-[0.99] transition-all flex items-center justify-between gap-4 cursor-pointer mt-2 group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 flex-shrink-0 flex items-center justify-center text-rose-700">
            <PhoneCall size={24} className="text-rose-700" />
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-rose-900 leading-snug">
              Emergency help (112 / 14416)
            </h2>
            <p className="text-xs sm:text-sm text-rose-700/90 mt-0.5">
              Immediate police & mental health helpline
            </p>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
          <PhoneCall size={18} />
        </div>
      </button>
    </div>
  );
};
