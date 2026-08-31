/**
 * ================================================================================
 * File: src/components/chatbot/ChatMessage.tsx
 * Description: Chat Message Bubble Component for User and Assistant turns.
 * Features clean formatted markdown rendering for lists, headers, bold text,
 * and responsive tables with horizontal scrolling / card view.
 * Safe against null / undefined / empty text inputs.
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

export function renderFormattedMarkdown(text: string = '') {
  const safeText = typeof text === 'string' ? text : String(text || '');
  if (!safeText.trim()) return null;

  const lines = safeText.split('\n');
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];

  const parseInline = (str: string): React.ReactNode => {
    if (!str) return '';
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

  const flushList = (key: string) => {
    if (inList && listItems.length > 0) {
      elements.push(
        <ul key={key} className="list-disc pl-4 space-y-1.5 my-2 text-xs sm:text-sm text-slate-700">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushTable = (key: string) => {
    if (inTable && tableRows.length > 0) {
      const headerRow = tableRows[0];
      const bodyRows = tableRows.slice(1);

      elements.push(
        <div key={key} className="my-2.5 w-full overflow-x-auto rounded-xl border border-slate-200 bg-slate-50/50 shadow-2xs">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
            <thead className="bg-slate-100/80">
              <tr>
                {headerRow.map((cell, cIdx) => (
                  <th key={cIdx} className="px-3 py-2 font-bold text-slate-800">
                    {parseInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {bodyRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-50/50">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 text-slate-700 leading-relaxed">
                      {parseInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = (line || '').trim();
    if (!trimmed) {
      flushList(`ul-blank-${idx}`);
      flushTable(`table-blank-${idx}`);
      return;
    }

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList(`ul-before-tbl-${idx}`);
      const rawCells = trimmed.slice(1, -1).split('|').map((c) => c.trim());
      const isDivider = rawCells.every((c) => /^:?-+:?$/.test(c));
      if (!isDivider) {
        inTable = true;
        tableRows.push(rawCells);
      }
      return;
    } else {
      flushTable(`table-end-${idx}`);
    }

    if (trimmed.startsWith('### ')) {
      flushList(`ul-h3-${idx}`);
      elements.push(
        <h3 key={idx} className="font-serif font-bold text-sm sm:text-base text-emerald-800 mt-3 mb-1">
          {parseInline(trimmed.slice(4))}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      flushList(`ul-h2-${idx}`);
      elements.push(
        <h2 key={idx} className="font-serif font-bold text-base sm:text-lg text-emerald-900 mt-3.5 mb-1.5">
          {parseInline(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith('# ')) {
      flushList(`ul-h1-${idx}`);
      elements.push(
        <h1 key={idx} className="font-serif font-bold text-lg sm:text-xl text-emerald-950 mt-4 mb-2">
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
      flushList(`ul-num-${idx}`);
      const match = trimmed.match(/^\d+\.\s/);
      const prefix = match ? match[0] : '';
      elements.push(
        <div key={idx} className="flex items-start gap-2 my-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <span className="font-bold text-emerald-700 shrink-0">{prefix}</span>
          <div className="flex-1">{parseInline(trimmed.slice(prefix.length))}</div>
        </div>
      );
    } else if (trimmed === '---') {
      flushList(`ul-hr-${idx}`);
      elements.push(<hr key={idx} className="border-slate-200 my-3" />);
    } else {
      flushList(`ul-p-${idx}`);
      elements.push(
        <p key={idx} className="text-xs sm:text-sm text-slate-700 leading-relaxed my-1.5">
          {parseInline(trimmed)}
        </p>
      );
    }
  });

  flushList('ul-final');
  flushTable('table-final');

  return elements;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  if (!message) return null;

  const isUser = message.sender === 'user';
  const textContent = message.text || '';

  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-2 w-full">
        <div className="bg-emerald-700 text-white p-3.5 sm:p-4 rounded-2xl rounded-tr-xs shadow-sm max-w-[85%] sm:max-w-[80%]">
          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
            {textContent}
          </p>
        </div>
        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0 mb-1">
          <User size={15} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5 w-full">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-green-500 flex-shrink-0 flex items-center justify-center text-white shadow-xs mt-1">
        <Bot size={16} className="text-white" />
      </div>
      <div className="bg-white text-slate-800 p-3.5 sm:p-4 rounded-2xl rounded-tl-xs shadow-xs border border-slate-200/80 max-w-[90%] sm:max-w-[85%] overflow-hidden">
        {renderFormattedMarkdown(textContent)}
      </div>
    </div>
  );
};
