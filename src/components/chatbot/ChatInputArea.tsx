/**
 * ================================================================================
 * File: src/components/chatbot/ChatInputArea.tsx
 * Description: Chat Input Area Component without microphone button.
 * Provides accessible text input field and touch-friendly send action button.
 * ================================================================================
 */

import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputAreaProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  onSendMessage,
  disabled = false,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !disabled) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30">
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-slate-50 rounded-full pl-4 pr-1.5 py-1.5 border border-slate-200 shadow-xs focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/20 transition-all"
      >
        <input
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 h-10 outline-none"
          placeholder="Apni baat ya sawaal likhein..."
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || disabled}
          aria-label="Send message"
          className="w-10 h-10 rounded-full bg-teal-700 hover:bg-teal-800 disabled:opacity-40 disabled:hover:bg-teal-700 text-white flex items-center justify-center transition-all shadow-sm flex-shrink-0 active:scale-95 cursor-pointer"
        >
          <Send size={17} className="stroke-[2.2] ml-0.5" />
        </button>
      </form>
    </div>
  );
};
