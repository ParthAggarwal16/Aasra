/**
 * ================================================================================
 * File: src/components/ChatBotModal.tsx
 * Description: Interactive Streaming AI Support Chatbot Modal Component.
 * Features Server-Sent Events token-by-token streaming from /api/chat-stream,
 * custom markdown rendering (headers, bold, bullet points without raw asterisks),
 * animated 3-dot typing indicator (• • •), quick suggestion prompts, and smooth scrolling.
 * ================================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, Heart, Shield } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName?: string;
}

// Clean markdown parser that eliminates raw ** and formats bold, headers, and lists
function renderFormattedMarkdown(text: string) {
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
          <strong key={i} className="font-bold text-white text-[13px] sm:text-sm">
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
          <ul key={`ul-${idx}`} className="list-disc pl-4 space-y-1 my-1.5 text-xs sm:text-sm text-slate-100">
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
        <h3 key={idx} className="font-serif font-bold text-sm sm:text-base text-[#ffddb9] mt-2.5 mb-1">
          {parseInline(trimmed.slice(4))}
        </h3>
      );
    } else if (trimmed.startsWith('## ')) {
      elements.push(
        <h2 key={idx} className="font-serif font-bold text-base sm:text-lg text-[#ffddb9] mt-3 mb-1">
          {parseInline(trimmed.slice(3))}
        </h2>
      );
    } else if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={idx} className="font-serif font-bold text-lg sm:text-xl text-[#ffddb9] mt-3.5 mb-1.5">
          {parseInline(trimmed.slice(2))}
        </h1>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ') || trimmed.startsWith('- ☐')) {
      inList = true;
      const content = trimmed.replace(/^[-*•]\s*(☐\s*)?/, '');
      listItems.push(
        <li key={`li-${idx}`} className="text-xs sm:text-sm text-slate-100 leading-relaxed">
          {parseInline(content)}
        </li>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      const match = trimmed.match(/^\d+\.\s/);
      const prefix = match ? match[0] : '';
      elements.push(
        <div key={idx} className="flex items-start gap-1.5 my-1 text-xs sm:text-sm text-slate-100 leading-relaxed">
          <span className="font-bold text-[#ffddb9] shrink-0">{prefix}</span>
          <div className="flex-1">{parseInline(trimmed.slice(prefix.length))}</div>
        </div>
      );
    } else if (trimmed === '---') {
      elements.push(<hr key={idx} className="border-white/10 my-2.5" />);
    } else {
      if (inList) {
        elements.push(
          <ul key={`ul-${idx}`} className="list-disc pl-4 space-y-1 my-1.5 text-xs sm:text-sm text-slate-100">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
      elements.push(
        <p key={idx} className="text-xs sm:text-sm text-slate-100 leading-relaxed my-1">
          {parseInline(trimmed)}
        </p>
      );
    }
  });

  if (inList && listItems.length > 0) {
    elements.push(
      <ul key="ul-end" className="list-disc pl-4 space-y-1 my-1.5 text-xs sm:text-sm text-slate-100">
        {listItems}
      </ul>
    );
  }

  return elements;
}

export const ChatBotModal: React.FC<ChatBotModalProps> = ({
  isOpen,
  onClose,
  brandName = 'AASRA',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Namaste! Main AASRA Support Assistant hoon. Aap kanooni sahayata, police shikayat, ya counseling ke bare mein kuch bhi pooch sakte hain. Main aapki kaise madad kar sakta hoon?',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto scroll smoothly to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, messages, isLoading]);

  const quickPrompts = [
    'FIR kaise darj karwayein?',
    'Tele-MANAS se kaise judein?',
    'Gawah suraksha (Witness Protection) kya hai?',
    'Mujhe ghabrahat ho rahi hai.',
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text || isLoading) return;

    setInputQuery('');
    const userMsgId = 'user-' + Date.now();
    const botMsgId = 'bot-' + Date.now();

    const userMessage: ChatMessage = { id: userMsgId, role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const chatHistory = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          chat_history: chatHistory,
          language: 'hi',
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Network error');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulated = '';
      let isFirstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;

        if (isFirstChunk) {
          setIsLoading(false);
          setMessages((prev) => [
            ...prev,
            { id: botMsgId, role: 'assistant', content: accumulated },
          ]);
          isFirstChunk = false;
        } else {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId ? { ...msg, content: accumulated } : msg
            )
          );
        }
      }
    } catch (err) {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: 'assistant',
          content:
            'Hum aapke saath hain. Kripya turant Tele-MANAS (14416) ya Emergency Helpline (112) par sampark karein.',
        },
      ]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg h-[88vh] sm:h-[660px] bg-[#1a1816] text-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-white/10 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <div className="bg-[#24211e] px-4 sm:px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Vibe-Matching Glowing Lotus & Shield Emblem */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9e3d00] via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-[#9e3d00]/30 border border-white/20">
              <Sparkles size={20} className="text-amber-200" />
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-white tracking-tight">{brandName} AI Saathi</h3>
              <p className="text-[11px] text-[#ded9d4]/80">Trauma-Informed & Legal Support Assistant</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition cursor-pointer"
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Message Stream Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-600 via-rose-600 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                  <Bot size={14} />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-2xl p-3.5 ${
                  m.role === 'user'
                    ? 'bg-[#9e3d00] text-white rounded-br-none shadow-md font-medium text-xs sm:text-sm'
                    : 'bg-[#2a2724] border border-white/10 rounded-tl-none shadow-sm'
                }`}
              >
                {m.role === 'assistant' ? (
                  renderFormattedMarkdown(m.content)
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <User size={14} />
                </div>
              )}
            </div>
          ))}

          {/* Animated 3-dot Typing Indicator */}
          {isLoading && (
            <div className="flex items-start gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-600 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                <Bot size={14} />
              </div>
              <div className="bg-[#2a2724] border border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center space-x-2">
                <span className="text-xs text-[#ded9d4]/70 font-medium">{brandName} is typing</span>
                <div className="flex items-center space-x-1 ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar bg-[#201d1a] border-t border-white/5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(p)}
              className="text-[11px] whitespace-nowrap bg-white/10 hover:bg-white/20 text-[#ffddb9] px-3 py-1.5 rounded-full border border-white/10 transition shrink-0 cursor-pointer font-medium"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-[#24211e] border-t border-white/10 flex items-center gap-2.5">
          <input
            ref={inputRef}
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Apna sawal yahan likhein (Ask anything)..."
            className="flex-1 bg-black/40 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#8bf2d6]"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isLoading}
            className="w-10 h-10 rounded-xl bg-[#9e3d00] hover:bg-[#7c2e00] disabled:opacity-40 flex items-center justify-center text-white transition shrink-0 shadow-md cursor-pointer"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
