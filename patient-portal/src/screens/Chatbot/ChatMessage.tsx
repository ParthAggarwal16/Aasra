import React from 'react';
import { ChatMessageType } from '../../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  if (message.sender === 'user') {
    return (
      <div className="flex items-end justify-end w-full">
        <div className="bg-primary text-on-primary p-4 rounded-2xl rounded-tr-sm shadow-sm max-w-[85%]">
          <p className="font-hindi-body text-hindi-body leading-relaxed">
            {message.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 w-full">
      <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary-container flex-shrink-0 flex items-center justify-center mt-1">
        <span
          className="material-symbols-outlined text-on-secondary-container text-[18px]"
          data-icon="favorite"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          favorite
        </span>
      </div>
      <div className="bg-surface-container-lowest text-on-surface p-4 rounded-2xl rounded-tl-sm shadow-sm border border-outline-variant/30 max-w-[85%]">
        <p className="font-hindi-body text-hindi-body leading-relaxed">
          {message.text}
        </p>
      </div>
    </div>
  );
};
