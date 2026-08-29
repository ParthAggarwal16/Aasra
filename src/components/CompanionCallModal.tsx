import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Sparkles, UserCheck } from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';

interface CompanionCallModalProps {
  isOpen: boolean;
  brandName: string;
  onClose: () => void;
  serviceName?: string;
  phoneNumber?: string;
}

export const CompanionCallModal: React.FC<CompanionCallModalProps> = ({
  isOpen,
  brandName,
  onClose,
  serviceName = 'AASRA Saathi Companion',
  phoneNumber = '1800-123-456',
}) => {
  const [callState, setCallState] = useState<'incoming' | 'connected' | 'ended'>('incoming');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const companionDialogues = [
    {
      speaker: 'Saathi',
      text: 'Namaste! Main AASRA se aapka saathi bol raha hoon. Aap kaisa mehsoos kar rahe hain?',
      english: 'Hello! I am your AASRA companion speaking. How are you feeling?',
    },
    {
      speaker: 'Saathi',
      text: 'Chinta mat kijiye, main yahan aapki har baat sunne ke liye hoon. Jo bhi dil mein ho, aap khul kar keh sakte hain.',
      english: 'Do not worry, I am here to listen to everything. Whatever is in your heart, feel free to share.',
    },
    {
      speaker: 'Saathi',
      text: 'Aapne bilkul sahi kadam uthaya humse judkar. Hum hamesha aapke saath hain.',
      english: 'You took the right step connecting with us. We are always with you.',
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCallState('incoming');
      setCallDuration(0);
      setDialogueIndex(0);
      stopSpeaking();
      return;
    }

    // Play ringing voice or speech
    speakText(`Incoming call from ${serviceName}`);
  }, [isOpen, serviceName]);

  // Call timer
  useEffect(() => {
    let interval: number;
    if (callState === 'connected') {
      interval = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  // Speak dialogue on connect
  useEffect(() => {
    if (callState === 'connected' && isSpeakerOn) {
      const dialogue = companionDialogues[dialogueIndex];
      if (dialogue) {
        speakText(dialogue.text);
      }
    }
  }, [callState, dialogueIndex, isSpeakerOn]);

  if (!isOpen) return null;

  const handleAcceptCall = () => {
    setCallState('connected');
    setDialogueIndex(0);
  };

  const handleEndCall = () => {
    setCallState('ended');
    stopSpeaking();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-[#1d1b19] text-white p-7 flex flex-col items-center justify-between min-h-[500px] shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#9e3d00]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-[#006b58]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Top Service Details */}
        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-24 h-24 rounded-full bg-[#32302d] border-2 border-white/20 flex items-center justify-center text-[#ffddb9] mb-4 shadow-inner relative">
            <UserCheck size={44} className="stroke-[2]" />
            {callState === 'incoming' && (
              <span className="absolute inset-0 rounded-full border-2 border-[#8bf2d6] animate-ping" />
            )}
          </div>

          <h2 className="font-serif text-2xl font-bold tracking-tight mb-1">
            {serviceName}
          </h2>

          <p className="text-sm font-mono text-[#ded9d4]/80">
            {phoneNumber}
          </p>

          <p className="text-xs font-semibold uppercase tracking-wider text-[#8bf2d6] mt-2">
            {callState === 'incoming'
              ? 'Incoming Call...'
              : callState === 'connected'
              ? `Connected • ${formatDuration(callDuration)}`
              : 'Call Ended'}
          </p>
        </div>

        {/* Live Audio Dialogue / Subtitles during connected call */}
        {callState === 'connected' && (
          <div className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-4 my-4 border border-white/10 text-center animate-in fade-in">
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#ffddb9] font-medium mb-1.5">
              <Sparkles size={14} />
              <span>Companion Voice</span>
            </div>
            <p className="text-sm font-sans font-medium text-white leading-relaxed">
              "{companionDialogues[dialogueIndex]?.text}"
            </p>
            <p className="text-xs text-[#ded9d4]/70 mt-1">
              ({companionDialogues[dialogueIndex]?.english})
            </p>

            {dialogueIndex < companionDialogues.length - 1 && (
              <button
                type="button"
                onClick={() => setDialogueIndex((prev) => prev + 1)}
                className="mt-3 text-xs font-serif font-bold text-[#ffddb9] hover:underline"
              >
                Agli baat sunein (Next) →
              </button>
            )}
          </div>
        )}

        {/* Call Controls */}
        <div className="w-full pt-4">
          {callState === 'incoming' ? (
            <div className="flex items-center justify-around w-full">
              {/* Decline */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  id="btn-call-decline"
                  type="button"
                  onClick={handleEndCall}
                  className="w-16 h-16 rounded-full bg-[#ba1a1a] hover:bg-[#9a1515] flex items-center justify-center shadow-lg active:scale-95 transition-all"
                >
                  <PhoneOff size={28} />
                </button>
                <span className="text-xs font-medium text-[#ded9d4]">Reject</span>
              </div>

              {/* Accept */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  id="btn-call-accept"
                  type="button"
                  onClick={handleAcceptCall}
                  className="w-16 h-16 rounded-full bg-[#006b58] hover:bg-[#005142] flex items-center justify-center shadow-lg active:scale-95 transition-all animate-bounce"
                >
                  <Phone size={28} />
                </button>
                <span className="text-xs font-medium text-[#8bf2d6]">Accept</span>
              </div>
            </div>
          ) : callState === 'connected' ? (
            <div className="space-y-6 w-full">
              <div className="flex items-center justify-around w-full">
                {/* Mute */}
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isMuted ? 'bg-white text-black' : 'bg-white/20 text-white'
                  }`}
                >
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                {/* Speaker */}
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeakerOn) stopSpeaking();
                    setIsSpeakerOn(!isSpeakerOn);
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isSpeakerOn ? 'bg-[#ffddb9] text-[#9e3d00]' : 'bg-white/20 text-white'
                  }`}
                >
                  {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
              </div>

              {/* End Call */}
              <div className="flex justify-center">
                <button
                  id="btn-call-hangup"
                  type="button"
                  onClick={handleEndCall}
                  className="w-16 h-16 rounded-full bg-[#ba1a1a] hover:bg-[#9a1515] flex items-center justify-center shadow-lg active:scale-95 transition-all"
                >
                  <PhoneOff size={28} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-[#ded9d4] py-4">
              Call Samapt (Ended)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
