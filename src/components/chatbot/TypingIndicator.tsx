/**
 * ================================================================================
 * File: src/components/chatbot/TypingIndicator.tsx
 * Description: Animated 3-dot typing loader component with companion avatar.
 * ================================================================================
 */

import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-2.5 w-full mt-2">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-green-500 flex-shrink-0 flex items-center justify-center text-white shadow-xs mt-1">
        <Bot size={16} className="text-white" />
      </div>
      <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200/80 flex items-center gap-1 min-w-[56px] h-[40px]">
        <div className="w-2 h-2 bg-emerald-600 rounded-full typing-dot" />
        <div className="w-2 h-2 bg-emerald-600 rounded-full typing-dot" />
        <div className="w-2 h-2 bg-emerald-600 rounded-full typing-dot" />
      </div>
      <span className="text-[12px] text-slate-500 self-center ml-1 italic font-medium">
        AI Saathi is thinking...
      </span>
    </div>
  );
};
