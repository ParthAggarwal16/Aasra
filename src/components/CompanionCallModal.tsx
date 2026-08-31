/**
 * ================================================================================
 * File: src/components/CompanionCallModal.tsx
 * Description: Real-time Conversational Voice Companion Call Modal Component.
 * Supports Bolna AI WebRTC voice calling with seamless live fallback to AASRA
 * Speech-to-Speech Voice Engine (browser STT + FastAPI /api/voice-turn + TTS).
 * ================================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Sparkles, UserCheck, ShieldAlert, Heart, Lock } from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';
import { BolnaWebCall } from '@bolna/web-call';
import { buildApiUrl } from '../utils/api';

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
  const [agentStatusText, setAgentStatusText] = useState<string>('Connecting...');
  const [liveUserSubtitle, setLiveUserSubtitle] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const bolnaCallRef = useRef<BolnaWebCall | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      cleanupCall();
      setCallState('incoming');
      setCallDuration(0);
      setLiveUserSubtitle('');
      return;
    }

    if (callState === 'incoming') {
      speakText(`Incoming call from ${serviceName}. Tap accept to connect.`);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: number;
    if (callState === 'connected') {
      interval = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  const cleanupCall = () => {
    stopSpeaking();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
      recognitionRef.current = null;
    }

    if (bolnaCallRef.current) {
      try {
        bolnaCallRef.current.stop();
      } catch (e) {}
      bolnaCallRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch (e) {}
      audioContextRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const startAudioVisualizer = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!canvasRef.current || !analyserRef.current) return;
        animationFrameRef.current = requestAnimationFrame(draw);
        analyserRef.current.getByteFrequencyData(dataArray);

        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) return;

        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 2.2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * (canvas.height * 0.85);
          canvasCtx.fillStyle = '#0d9488';
          canvasCtx.fillRect(x, (canvas.height - barHeight) / 2, barWidth - 2, barHeight + 2);
          x += barWidth;
        }
      };

      draw();
    } catch (e) {}
  };

  const startNativeVoiceCompanionLoop = () => {
    setAgentStatusText('Aasra is listening...');
    const greeting = 'Namaste, main AASRA Saathi hoon. Aap kaisa mehsoos kar rahe hain? Hum hamesha aapke saath hain.';
    speakText(greeting);

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setAgentStatusText('Connected (Audio mode active)');
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'hi-IN';

      recognition.onresult = async (event: any) => {
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript.trim();

        if (transcript.length > 1) {
          setLiveUserSubtitle(`"${transcript}"`);
          setAgentStatusText('Aasra is thinking...');
          stopSpeaking();

          try {
            const res = await fetch('/api/voice-turn', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                transcript,
                case_id: '1042',
                language: 'hi',
              }),
            });

            if (res.ok) {
              const data = await res.json();
              if (data.tts_text) {
                setAgentStatusText('Aasra is speaking...');
                speakText(data.tts_text);
                setTimeout(() => {
                  setAgentStatusText('Aasra is listening...');
                }, 4000);
              }
            }
          } catch (e) {
            setAgentStatusText('Aasra is listening...');
          }
        }
      };

      recognition.onerror = () => {
        setAgentStatusText('Aasra is listening...');
      };

      recognition.onend = () => {
        if (callState === 'connected' && recognitionRef.current) {
          try {
            recognition.start();
          } catch (e) {}
        }
      };

      setTimeout(() => {
        try {
          recognition.start();
          recognitionRef.current = recognition;
        } catch (e) {}
      }, 3500);
    } catch (e) {
      setAgentStatusText('Aasra is listening...');
    }
  };

  const handleAcceptCall = async () => {
    stopSpeaking();
    setCallState('connected');
    setAgentStatusText('Connecting to AASRA Saathi AI...');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      startAudioVisualizer(stream);
    } catch (err) {}

    try {
      const bolnaCall = new BolnaWebCall({
        sessionUrl: buildApiUrl('/api/bolna-session'),
      });

      bolnaCall.on('call-start', () => {
        setAgentStatusText('Aasra is listening...');
      });

      bolnaCall.on('call-end', () => {
        setAgentStatusText('Call ended');
        setCallState('ended');
        cleanupCall();
        setTimeout(() => onClose(), 1500);
      });

      await bolnaCall.start();
      bolnaCallRef.current = bolnaCall;
      setAgentStatusText('Aasra is listening...');
    } catch (err: any) {
      startNativeVoiceCompanionLoop();
    }
  };

  const handleEndCall = () => {
    setCallState('ended');
    cleanupCall();
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleMuteToggle = () => {
    const next = !isMuted;
    setIsMuted(next);

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = !next));
    }

    setAgentStatusText(next ? 'Microphone muted' : 'Aasra is listening...');
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white text-slate-900 p-6 flex flex-col items-center justify-between min-h-[560px] shadow-2xl border border-slate-200 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-teal-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center mt-2 w-full z-10">
          <div className="relative w-28 h-28 mb-3">
            {callState === 'incoming' && (
              <>
                <div className="absolute inset-0 rounded-full bg-teal-400/30 mic-pulse-ring" />
                <div
                  className="absolute inset-0 rounded-full bg-teal-400/15 mic-pulse-ring"
                  style={{ animationDelay: '0.6s' }}
                />
              </>
            )}

            {callState === 'connected' && (
              <div
                className={`absolute inset-0 rounded-full ${
                  isMuted ? 'bg-slate-300' : 'bg-teal-400/30'
                } mic-pulse-ring`}
              />
            )}

            <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-600 p-1 shadow-lg shadow-teal-900/20">
              <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center overflow-hidden border-2 border-white">
                <div className="w-full h-full bg-gradient-to-br from-teal-100 to-emerald-200 flex flex-col items-center justify-center text-teal-800">
                  <Heart size={38} className="text-teal-700 fill-teal-600/30 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          <h2 className="font-serif text-2xl font-bold text-slate-900 tracking-tight">
            {serviceName}
          </h2>
          <p className="text-xs text-slate-600 font-sans mt-0.5">{phoneNumber}</p>

          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80">
            <span
              className={`w-2 h-2 rounded-full ${
                callState === 'connected'
                  ? isMuted
                    ? 'bg-amber-500'
                    : 'bg-emerald-700 animate-pulse'
                  : 'bg-teal-700 animate-ping'
              }`}
            />
            <span className="text-xs font-semibold text-slate-700">
              {callState === 'incoming' && 'Incoming Call...'}
              {callState === 'connected' && formatDuration(callDuration)}
              {callState === 'ended' && 'Call Ended'}
            </span>
          </div>

          <p className="text-xs text-teal-800 font-medium mt-2 transition-all">
            {agentStatusText}
          </p>

          {liveUserSubtitle && callState === 'connected' && (
            <p className="text-xs text-slate-600 italic mt-1 px-4 max-w-[280px] line-clamp-2">
              {liveUserSubtitle}
            </p>
          )}
        </div>

        <div className="w-full flex flex-col items-center justify-center my-4 z-10">
          {callState === 'connected' ? (
            <div className="w-full bg-slate-50/80 rounded-2xl p-3 border border-slate-200/80 flex flex-col items-center">
              <canvas ref={canvasRef} width={240} height={36} className="w-full h-9 rounded-lg" />
              <div className="w-full flex items-center justify-between text-[11px] text-slate-600 mt-1.5 px-1">
                <span className="flex items-center gap-1">
                  <Sparkles size={11} className="text-teal-700" />
                  AI Voice Active
                </span>
                <span className="text-[10px] text-slate-600">24/7 Support</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-3 rounded-2xl bg-teal-50/60 border border-teal-100 max-w-[260px]">
              <Lock size={15} className="text-teal-800 mb-1" />
              <p className="text-xs text-slate-800 font-medium leading-relaxed">
                Safe, confidential & non-judgmental support.
              </p>
            </div>
          )}
        </div>

        <div className="w-full flex flex-col items-center gap-4 mb-2 z-10">
          {callState === 'incoming' && (
            <div className="w-full flex items-center justify-around gap-4 px-4">
              <button
                type="button"
                onClick={onClose}
                className="w-16 h-16 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
                title="Decline Call"
              >
                <PhoneOff size={24} />
              </button>

              <button
                type="button"
                onClick={handleAcceptCall}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white flex flex-col items-center justify-center shadow-xl shadow-teal-900/30 active:scale-95 transition-all cursor-pointer animate-bounce"
                title="Accept Call"
              >
                <Phone size={26} />
              </button>
            </div>
          )}

          {callState === 'connected' && (
            <div className="w-full flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={handleMuteToggle}
                className={`w-13 h-13 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                  isMuted
                    ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button
                type="button"
                onClick={handleEndCall}
                className="w-15 h-15 rounded-full bg-rose-700 hover:bg-rose-800 text-white flex items-center justify-center shadow-xl shadow-rose-900/30 active:scale-95 transition-all cursor-pointer"
                title="End Call"
              >
                <PhoneOff size={24} />
              </button>
            </div>
          )}

          {callState === 'ended' && (
            <p className="text-xs text-slate-600 font-medium">Closing call session...</p>
          )}
        </div>
      </div>
    </div>
  );
};
