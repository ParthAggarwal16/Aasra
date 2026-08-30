import React from 'react';

interface QuickSuggestionsProps {
  onSelectSuggestion: (text: string) => void;
}

export const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({
  onSelectSuggestion,
}) => {
  const suggestions = [
    'Main pareshaan hoon',
    'Mujhe kisi se baat karni hai',
    'Mujhe help chahiye',
    'Bas baat karni hai',
  ];

  return (
    <div className="flex overflow-x-auto gap-3 py-2 -mx-gutter px-gutter no-scrollbar w-[calc(100%+32px)]">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onSelectSuggestion(suggestion)}
          className="flex-shrink-0 bg-surface-container text-on-surface-variant border border-outline-variant px-5 py-3 rounded-full font-body-md text-body-md hover:bg-surface-container-high transition-colors shadow-sm whitespace-nowrap active:scale-95 cursor-pointer"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};
