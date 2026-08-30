/**
 * ================================================================================
 * File: src/components/chatbot/QuickSuggestions.tsx
 * Description: Quick Suggestion Prompt Chips for Instant Chat Assistance.
 * ================================================================================
 */

import React from 'react';
import { Sparkles } from 'lucide-react';

interface QuickSuggestionsProps {
  onSelectSuggestion: (text: string) => void;
  disabled?: boolean;
}

export const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({
  onSelectSuggestion,
  disabled = false,
}) => {
  const suggestions = [
    'FIR kaise darj karwayein?',
    'Tele-MANAS se helpline connect karein',
    'Section 15A Witness Protection kya hai?',
    'Free Legal Aid advocate kaise milega?',
    'Mujhe thoda ghabrahat mehsoos ho rahi hai',
  ];

  return (
    <div className="flex overflow-x-auto gap-2 py-2 px-1 no-scrollbar w-full">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          type="button"
          disabled={disabled}
          onClick={() => onSelectSuggestion(suggestion)}
          className="flex-shrink-0 bg-white text-slate-700 border border-slate-200/90 px-3.5 py-1.5 rounded-full text-xs font-medium hover:bg-teal-50 hover:border-teal-300 hover:text-teal-800 transition-all shadow-2xs whitespace-nowrap active:scale-95 cursor-pointer flex items-center gap-1.5"
        >
          <Sparkles size={12} className="text-teal-600" />
          <span>{suggestion}</span>
        </button>
      ))}
    </div>
  );
};
