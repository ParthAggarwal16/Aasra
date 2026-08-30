import React, { useState } from 'react';

interface ChatInputAreaProps {
  onSendMessage: (text: string) => void;
  onVoiceClick?: () => void;
}

export const ChatInputArea: React.FC<ChatInputAreaProps> = ({
  onSendMessage,
  onVoiceClick,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
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
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-surface/95 glass-panel border-t border-outline-variant/30 z-30 pb-safe">
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-surface-container-lowest rounded-full p-2 border border-outline-variant shadow-sm focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all"
      >
        <button
          type="button"
          onClick={onVoiceClick}
          aria-label="Use microphone"
          className="w-12 h-12 rounded-full flex items-center justify-center text-secondary hover:bg-secondary-container/50 transition-colors flex-shrink-0"
        >
          <span className="material-symbols-outlined text-[24px]" data-icon="mic">
            mic
          </span>
        </button>
        <input
          className="flex-1 bg-transparent border-none focus:ring-0 font-hindi-body text-[18px] text-on-surface placeholder:text-on-surface-variant/60 px-2 h-12 outline-none"
          placeholder="Apni baat likhein..."
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          aria-label="Send message"
          className="w-12 h-12 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-colors shadow-sm flex-shrink-0 active:scale-95 cursor-pointer"
        >
          <span
            className="material-symbols-outlined text-[20px]"
            data-icon="send"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            send
          </span>
        </button>
      </form>
    </div>
  );
};
