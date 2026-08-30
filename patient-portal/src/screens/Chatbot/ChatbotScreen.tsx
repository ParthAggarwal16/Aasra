import React, { useState, useRef, useEffect } from 'react';
import { ChatMessageType } from '../../types';
import { ChatMessage } from './ChatMessage';
import { QuickSuggestions } from './QuickSuggestions';
import { SupportEscalationCard } from './SupportEscalationCard';
import { TypingIndicator } from './TypingIndicator';
import { ChatInputArea } from './ChatInputArea';

interface ChatbotScreenProps {
  onBack?: () => void;
  onNavigateToVoice?: () => void;
}

export const ChatbotScreen: React.FC<ChatbotScreenProps> = ({
  onBack,
  onNavigateToVoice,
}) => {
  // Initial messages matching Stitch HTML design exactly
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      sender: 'aasra',
      text: 'Namaste. Main yahin hoon aapki baat sunne ke liye. Aaj aap kaisa mehsoos kar rahe hain?',
    },
    {
      id: '2',
      sender: 'user',
      text: 'Thoda pareshaan hoon.',
    },
    {
      id: '3',
      sender: 'aasra',
      text: 'Samajh sakti hoon. Agar aap chahein, aap mujhe bata sakte hain ki kya pareshaan kar raha hai.',
    },
  ]);

  const [isTyping, setIsTyping] = useState<boolean>(true); // Preserved from Stitch design
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    const userMsg: ChatMessageType = {
      id: Date.now().toString(),
      sender: 'user',
      text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Provide simulated empathetic reply
    setTimeout(() => {
      setIsTyping(false);
      let replyText = 'Main samajh rahi hoon. Aap akele nahi hain, main aapke saath hoon.';
      if (text.includes('pareshaan')) {
        replyText = 'Aapki pareshani ko main samajhti hoon. Chhoti-chhoti baaton se shuru karein, sab theek hoga.';
      } else if (text.includes('baat')) {
        replyText = 'Haan zaroor, aap mujhse khul kar baat kar sakte hain. Main sun rahi hoon.';
      } else if (text.includes('help')) {
        replyText = 'Hum aapki poori madad karenge. Agar zaroorat ho toh aap humari support team se call bhi request kar sakte hain.';
      }
      
      const botMsg: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        sender: 'aasra',
        text: replyText,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col items-center justify-center selection:bg-primary-container selection:text-on-primary-container">
      {/* Mobile Container */}
      <div className="w-full max-w-[440px] bg-background h-screen flex flex-col relative overflow-hidden shadow-2xl md:rounded-[40px] md:h-[795px] md:border-[8px] md:border-surface-container-highest">
        {/* Background Pattern / Aesthetic */}
        <div
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at top right, rgba(139, 242, 214, 0.15), transparent 40%), radial-gradient(circle at bottom left, rgba(255, 219, 205, 0.15), transparent 40%)',
          }}
        />

        {/* TopAppBar (Shared Component styling applied) */}
        <header className="flex justify-between items-center w-full px-container-padding h-touch-target-min z-20 bg-surface/90 backdrop-blur-md sticky top-0">
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="h-touch-target-min w-[48px] flex items-center justify-start text-on-surface-variant hover:bg-surface-container-low transition-colors duration-200 active:scale-95 rounded-full"
          >
            <span className="material-symbols-outlined" data-icon="arrow_back">
              arrow_back
            </span>
          </button>
          <div className="flex flex-col items-center flex-1">
            <h1 className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">
              AASRA
            </h1>
            <span className="text-[12px] font-semibold text-secondary uppercase tracking-wider opacity-80">
              Your Companion
            </span>
          </div>
          <button
            type="button"
            onClick={onNavigateToVoice}
            className="h-[40px] px-4 bg-surface-container-lowest border border-outline-variant rounded-full flex items-center gap-2 neomorphic-button text-primary hover:text-primary-fixed-variant transition-colors active:scale-95 z-10"
          >
            <span
              className="material-symbols-outlined text-[18px]"
              data-icon="volume_up"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              volume_up
            </span>
            <span className="font-nav-label text-nav-label uppercase tracking-widest">
              Suniye
            </span>
          </button>
        </header>

        {/* Chat Canvas (Scrollable) */}
        <main className="flex-1 overflow-y-auto px-gutter pb-[100px] pt-4 z-10 flex flex-col gap-6 scroll-smooth">
          {/* AASRA Avatar Intro */}
          <div className="flex justify-center mb-2 mt-4">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-sm neomorphic-button bg-secondary-container flex items-center justify-center">
              <img
                className="object-cover w-full h-full"
                data-alt="A warm, compassionate, softly illustrated cartoon style avatar of a young Indian woman representing a helpful AI companion. She has a gentle smile, wearing a subtle earthy tone outfit against a calming sage green background. The style is modern, approachable, and comforting, using a vector art aesthetic with soft shading and no harsh lines."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0Lms7vC5-s47S40McU_AQ9QTP6BC5tbvxXshex66kXxe15ccYsi9a3ljsJCEYMRiQpG0KveVU6-Dq_oBV0TWvITZqNGy4RirSv2U6rM3ee7hH8vwL3KLZ5PXEx-6T3zdY0xVZuDsfpJiaGZ0Nkob6S4qgQrOhC_yrjwGwbSuyyewfXgZvoU92NEhYL-k_svdpw6NGN6tjs1GJO5eQLY134n0JeVXXOf-sFuccjQQrKPnb36RMtLKgIQ"
                alt="AASRA Avatar"
              />
            </div>
          </div>

          {/* Render Initial Message 1 */}
          {messages.length > 0 && <ChatMessage message={messages[0]} />}

          {/* Quick Suggestions (Horizontal Scroll) */}
          <QuickSuggestions onSelectSuggestion={handleSendMessage} />

          {/* Render Remaining Messages */}
          {messages.slice(1).map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {/* Escalation / Support Card */}
          <SupportEscalationCard />

          {/* Typing Indicator */}
          {isTyping && <TypingIndicator />}

          <div ref={messagesEndRef} />

          {/* Spacer to ensure scroll above fixed input */}
          <div className="h-8 w-full flex-shrink-0" />
        </main>

        {/* Fixed Bottom Input Area */}
        <ChatInputArea
          onSendMessage={handleSendMessage}
          onVoiceClick={onNavigateToVoice}
        />
      </div>
    </div>
  );
};
