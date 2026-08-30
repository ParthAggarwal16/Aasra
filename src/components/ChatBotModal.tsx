/**
 * ================================================================================
 * File: src/components/ChatBotModal.tsx
 * Description: Interactive AI Support Chatbot Modal Component.
 * Implements the patient-portal chat design with clean white styling, avatar
 * introduction, Quick Suggestions, Support Escalation cards, Typing Indicator,
 * and token-by-token streaming from /api/chat-stream. (Microphone button removed).
 * ================================================================================
 */

import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, PhoneCall, Volume2 } from 'lucide-react';
import { ChatMessage, ChatMessageType } from './chatbot/ChatMessage';
import { QuickSuggestions } from './chatbot/QuickSuggestions';
import { SupportEscalationCard } from './chatbot/SupportEscalationCard';
import { TypingIndicator } from './chatbot/TypingIndicator';
import { ChatInputArea } from './chatbot/ChatInputArea';

interface ChatBotModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName?: string;
  onOpenVoice?: () => void;
}

export const ChatBotModal: React.FC<ChatBotModalProps> = ({
  isOpen,
  onClose,
  brandName = 'AASRA',
  onOpenVoice,
}) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'welcome',
      sender: 'aasra',
      text: 'Namaste! Main AASRA AI Saathi hoon. Main aapki baat sunne aur kanooni ya mansik sahayata dene ke liye yahan hoon. Aap kaisa mehsoos kar rahe hain?',
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsgId = 'user-' + Date.now();
    const botMsgId = 'bot-' + Date.now();

    const userMessage: ChatMessageType = {
      id: userMsgId,
      sender: 'user',
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const chatHistory = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        }));

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
        throw new Error('Network response not ok');
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
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            { id: botMsgId, sender: 'aasra', text: accumulated },
          ]);
          isFirstChunk = false;
        } else {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMsgId ? { ...msg, text: accumulated } : msg
            )
          );
        }
      }
    } catch (err) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: 'aasra',
          text:
            'Main samajh sakti hoon. Hum hamesha aapke saath hain. Kisi bhi aapatkalin sthiti mein kripya 112 par call karein ya Tele-MANAS (14416) par baat karein.',
        },
      ]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg h-[90vh] sm:h-[680px] bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="flex justify-between items-center w-full px-5 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-700 to-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles size={20} className="text-emerald-100" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-slate-900 leading-tight">
                {brandName} Saathi
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Trauma-Informed & Legal Support AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenVoice && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVoice();
                }}
                className="h-8 px-3 bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 rounded-full flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer"
                title="Voice Call"
              >
                <Volume2 size={14} />
                <span>Suniye</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition cursor-pointer"
              title="Close"
            >
              <X size={17} />
            </button>
          </div>
        </header>

        {/* Chat Canvas (Scrollable) */}
        <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50/50 scroll-smooth">
          {/* AASRA Avatar Card */}
          <div className="flex flex-col items-center justify-center my-2 text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-teal-600 shadow-md bg-teal-50 flex items-center justify-center mb-2">
              <img
                className="object-cover w-full h-full"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0Lms7vC5-s47S40McU_AQ9QTP6BC5tbvxXshex66kXxe15ccYsi9a3ljsJCEYMRiQpG0KveVU6-Dq_oBV0TWvITZqNGy4RirSv2U6rM3ee7hH8vwL3KLZ5PXEx-6T3zdY0xVZuDsfpJiaGZ0Nkob6S4qgQrOhC_yrjwGwbSuyyewfXgZvoU92NEhYL-k_svdpw6NGN6tjs1GJO5eQLY134n0JeVXXOf-sFuccjQQrKPnb36RMtLKgIQ"
                alt="AASRA Avatar"
              />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Surakshit aur niji baat-cheet (100% Private & Confidential)
            </p>
          </div>

          {/* Render Messages */}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {/* Quick Suggestions */}
          <QuickSuggestions
            onSelectSuggestion={handleSendMessage}
            disabled={isTyping}
          />

          {/* Escalation / Support Card */}
          <SupportEscalationCard />

          {/* Typing Indicator */}
          {isTyping && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </main>

        {/* Fixed Bottom Input Area (NO MIC) */}
        <ChatInputArea
          onSendMessage={handleSendMessage}
          disabled={isTyping}
        />
      </div>
    </div>
  );
};
