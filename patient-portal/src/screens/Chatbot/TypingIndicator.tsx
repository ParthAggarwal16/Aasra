import React from 'react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 w-full mt-2">
      <div className="w-8 h-8 rounded-full overflow-hidden bg-secondary-container flex-shrink-0 flex items-center justify-center mt-1 opacity-50">
        <span
          className="material-symbols-outlined text-on-secondary-container text-[18px]"
          data-icon="favorite"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          favorite
        </span>
      </div>
      <div className="bg-surface-container-lowest p-3 rounded-2xl rounded-tl-sm shadow-sm border border-outline-variant/30 flex items-center gap-1 min-w-[60px] h-[48px]">
        <div className="w-2 h-2 bg-secondary rounded-full typing-dot" />
        <div className="w-2 h-2 bg-secondary rounded-full typing-dot" />
        <div className="w-2 h-2 bg-secondary rounded-full typing-dot" />
      </div>
      <span className="text-[12px] text-on-surface-variant self-center ml-2 italic">
        Aasra is typing...
      </span>
    </div>
  );
};
