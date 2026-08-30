/**
 * ================================================================================
 * File: src/components/chatbot/ChatMessage.tsx
 * Description: Chat Message Bubble Component for User and Assistant turns.
 * Features clean formatted markdown rendering for lists, headers, bold text,
 * without displaying raw asterisk markdown artifacts.
 * ================================================================================
 */

import React from 'react';
import { Bot, User, Sparkles, Heart } from 'lucide-react';

export interface ChatMessageType {
  id: string;
  sender: 'user' | 'aasra' | 'assistant';
  text: string;
}

interface ChatMessageProps {
  message: ChatMessageType;
}

// Clean markdown parser that eliminates raw ** and formats bold, headers, and lists
export function renderFormattedMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  const parseInline = (str: string): React.ReactNode => {
    // Bold: **text**
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-slate-900 text-[13px] sm:text-sm">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) {
        elements.push(
          <ul key={`ul-${idx}`} className="list-disc pl-4 space-y-1 my-1.5 text-xs sm:text-sm text-slate-700">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
      return;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h3 key={idx} className="font-serif font-bold text-sm sm:text-base text-teal-800 mt-2.5 mb-1">
          {parseInline(trimmed.slice(4))}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={idx} className="font-serif font-bold text-base sm:text-lg text-teal-900 mt-3 mb-1">
          {parseInline(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={idx} className="font-serif font-bold text-lg sm:text-xl text-teal-950 mt-3.5 mb-1.5">
          {parseInline(trimmed.slice(2))}
        </h1>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ') || trimmed.startsWith('- ☐')) {
      inList = true;
      const content = trimmed.replace(/^[-*•]\s*(☐\s*)?/, '');
      listItems.push(
        <li key={`li-${idx}`} className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {parseInline(content)}
        </li>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^\d+\.\s/);
      const prefix = match ? match[0] : '';
      elements.push(
        <div key={idx} className="flex items-start gap-1.5 my-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <span className="font-bold text-teal-700 shrink-0">{prefix}</span>
          <div className="flex-1">{parseInline(trimmed.slice(prefix.length))}</div>
        </div>
      );
    } else if (trimmed === '---') {
      elements.push(<hr key={idx} className="border-slate-200 my-2.5" />);
    } else {
      if (inList) {
        elements.push(
          <ul key={`ul-${idx}`} className="list-disc pl-4 space-y-1 my-1.5 text-xs sm:text-sm text-slate-700">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
      elements.push(
        <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed my-1">
          {parseInline(trimmed)}
        </p>
      );
    }
  });

  if (inList && listItems.length > 0) {
    elements.push(
      <ul key="ul-end" className="list-disc pl-4 space-y-1 my-1.5 text-xs sm:text-sm text-slate-700">
        {listItems}
      </ul>
    );
  }

  return elements;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-2 w-full">
        <div className="bg-teal-700 text-white p-3.5 sm:p-4 rounded-2xl rounded-tr-xs shadow-sm max-w-[85%] sm:max-w-[80%]">
          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
            {message.text}
          </p>
        </div>
        <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 shrink-0 mb-1">
          <User size={15} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 w-full">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-600 flex-shrink-0 flex items-center justify-center text-white shadow-xs mt-1">
        <Heart size={16} className="fill-white/80" />
      </div>
      <div className="bg-white text-slate-800 p-3.5 sm:p-4 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200/80 max-w-[85%] sm:max-w-[80%]">
        {renderFormattedMarkdown(message.text)}
      </div>
    </div>
  );
};
