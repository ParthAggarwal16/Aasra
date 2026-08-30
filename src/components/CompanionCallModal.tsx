/**
 * ================================================================================
 * File: src/components/CompanionCallModal.tsx
 * Description: Real-time Conversational Voice Companion Call Modal Component.
 * Integrates Bolna AI WebRTC voice agent for live voice conversations with the
 * patient-portal Voice Companion UI (avatar portrait, animated pulse rings,
 * live audio waveform visualizer, and clean white/glass styling).
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
  const [bolnaError, setBolnaError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const bolnaCallRef = useRef<BolnaWebCall | null>(null);

  // Ringing on incoming
  useEffect(() => {
    if (!isOpen) {
      cleanupCall();
      setCallState('incoming');
      setCallDuration(0);
      setBolnaError(null);
      return;
    }

    if (callState === 'incoming') {
      speakText(`Incoming call from ${serviceName}. Tap accept to connect.`);
    }
  }, [isOpen]);

  // Call duration timer
  useEffect(() => {
    let interval: number;
    if (callState === 'connected') {
      interval = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  // Cleanup on unmount or end
  const cleanupCall = () => {
    stopSpeaking();

    // End Bolna WebRTC call
    if (bolnaCallRef.current) {
      try {
        bolnaCallRef.current.stop();
      } catch (e) {
        console.warn('Bolna call stop error:', e);
      }
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

  // Start live audio visualizer
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
        const barWidth = (canvas.width / bufferLength) * 2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * (canvas.height * 0.85);
          canvasCtx.fillStyle = '#0d9488';
          canvasCtx.fillRect(x, (canvas.height - barHeight) / 2, barWidth - 2, barHeight + 2);
          x += barWidth;
        }
      };

      draw();
    } catch (e) {
      console.warn('Audio visualization not supported:', e);
    }
  };

  // Handle Accept Call — Start Bolna AI WebRTC voice call
  const handleAcceptCall = async () => {
    stopSpeaking();
    setCallState('connected');
    setAgentStatusText('Connecting to AASRA Saathi AI...');
    setBolnaError(null);

    // Start microphone for visualizer
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      startAudioVisualizer(stream);
    } catch (err) {
      console.warn('Microphone permission denied or not available:', err);
    }

    // Initialize Bolna WebRTC call
    try {
      const bolnaCall = new BolnaWebCall({
        sessionUrl: buildApiUrl('/api/bolna-session'),
      });

      // Event: Call started (agent connected)
      bolnaCall.on('call-start', () => {
        console.log('[Bolna] Agent connected — live voice call active');
        setAgentStatusText('Aasra is listening...');
      });

      // Event: Call ended
      bolnaCall.on('call-end', ({ reason }: { reason: string }) => {
        console.log('[Bolna] Call ended:', reason);
        setAgentStatusText('Call ended');
        setCallState('ended');
        cleanupCall();
        setTimeout(() => {
          onClose();
        }, 1500);
      });

      // Start the WebRTC call
      await bolnaCall.start();
      bolnaCallRef.current = bolnaCall;

      setAgentStatusText('Aasra is listening...');
    } catch (err: any) {
      console.error('[Bolna] Failed to start voice call:', err);
      setBolnaError('Voice connection failed. Please try again.');
      setAgentStatusText('Connection failed');
    }
  };

  // Handle End Call
  const handleEndCall = () => {
    setCallState('ended');
    cleanupCall();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Handle Mute toggle
  const handleMuteToggle = () => {
    const next = !isMuted;
    setIsMuted(next);

    // Mute local microphone stream
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
        {/* Ambient subtle glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-teal-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* Top Companion Details with Warm Portrait Avatar */}
        <div className="flex flex-col items-center text-center mt-2 w-full z-10">
          <div className="relative w-28 h-28 mb-3">
            {/* Pulse rings in incoming or active state */}
            {callState === 'incoming' && (
              <>
                <div className="absolute inset-0 rounded-full bg-teal-400/30 mic-pulse-ring" />
                <div
                  className="absolute inset-0 rounded-full bg-teal-400/15 mic-pulse-ring"
                  style={{ animationDelay: '1s' }}
                />
              </>
            )}
            {/* Avatar image */}
            <img
              alt="AASRA Avatar"
              className="w-full h-full object-cover rounded-full relative z-10 border-4 border-white shadow-md"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDpm0GTrh51qA0FeoJ-xwTjx4q8VodjavZliTnyzA71A_qR1QvvjvhbCC18R8L9SdF3xxyblDf_SQHRz0M1irmHp8f6jL6IZNI-aozLhX5eYM71S3yQDxYxefVsHbD44iqGysgxH0uRJHRqgt5GTkel929tJY5_fLEoGlLg6kdDtiH0z0nQgq1kGBwAwGKtWhy6o_1qvjEewOa8ylkGQC8qOqyMsgMRVDXUXlBUf-D7-3kEoBD7utGZg"
            />
            {callState === 'connected' && (
              <div className="absolute -bottom-1 -right-1 z-20 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs">
                <Heart size={14} className="text-white fill-white" />
              </div>
            )}
          </div>

          <h2 className="font-serif text-xl font-bold tracking-tight text-slate-900 mb-0.5">
            {serviceName}
          </h2>

          <p className="text-xs font-mono text-slate-500 mb-1">
            {phoneNumber}
          </p>

          <div className="flex items-center gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">
              {callState === 'incoming'
                ? 'Incoming Call...'
                : callState === 'connected'
                ? `Active Call • ${formatDuration(callDuration)}`
                : 'Call Ended'}
            </p>
          </div>

          {/* Connection status badge */}
          {callState === 'connected' && (
            <div className="mt-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-xs text-teal-800 flex items-center gap-1.5 font-medium shadow-2xs">
              <Sparkles size={13} className="text-teal-600" />
              <span>{agentStatusText}</span>
            </div>
          )}

          {/* Error display */}
          {bolnaError && (
            <div className="mt-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-1.5">
              <ShieldAlert size={13} className="text-red-500" />
              <span>{bolnaError}</span>
            </div>
          )}
        </div>

        {/* Live Audio Waveform Canvas */}
        {callState === 'connected' && (
          <div className="w-full h-12 my-2 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200/80 px-2 z-10">
            <canvas ref={canvasRef} width={280} height={40} className="w-full h-full" />
          </div>
        )}

        {/* Live AI Voice Conversation Panel */}
        {callState === 'connected' && (
          <div className="w-full space-y-2 my-2 z-10">
            <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200 text-left">
              <div className="flex items-center justify-between text-xs text-teal-800 font-semibold mb-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-teal-600" />
                  <span>Bolna AI Voice Agent</span>
                </div>
                <span className="text-[11px] text-emerald-600 font-bold animate-pulse">● Live</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Bol sakte hain, main sun rahi hoon. Speak naturally — your companion understands Hindi, Hinglish, and English.
              </p>
            </div>
          </div>
        )}

        {/* Privacy Note */}
        <div className="flex items-center gap-1.5 text-slate-500 text-[11px] z-10">
          <Lock size={12} className="text-slate-400" />
          <span>100% Private & Confidential Voice Session</span>
        </div>

        {/* Call Controls */}
        <div className="w-full pt-3 z-10">
          {callState === 'incoming' ? (
            <div className="flex items-center justify-around w-full">
              {/* Decline */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  id="btn-call-decline"
                  type="button"
                  onClick={handleEndCall}
                  className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  <PhoneOff size={24} />
                </button>
                <span className="text-xs font-semibold text-slate-600">Reject</span>
              </div>

              {/* Accept */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  id="btn-call-accept"
                  type="button"
                  onClick={handleAcceptCall}
                  className="w-14 h-14 rounded-full bg-teal-700 hover:bg-teal-800 text-white flex items-center justify-center shadow-lg shadow-teal-700/30 active:scale-95 transition-all animate-bounce cursor-pointer"
                >
                  <Phone size={24} />
                </button>
                <span className="text-xs font-bold text-teal-700">Accept</span>
              </div>
            </div>
          ) : callState === 'connected' ? (
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-around w-full">
                {/* Mute */}
                <button
                  type="button"
                  onClick={handleMuteToggle}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                    isMuted ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
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
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                    isSpeakerOn ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-slate-100 text-slate-400'
                  }`}
                  title={isSpeakerOn ? 'Speaker Mute' : 'Speaker On'}
                >
                  {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>

                {/* Hang Up */}
                <button
                  id="btn-call-hangup"
                  type="button"
                  onClick={handleEndCall}
                  className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md active:scale-95 transition-all cursor-pointer"
                  title="End Call"
                >
                  <PhoneOff size={22} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-slate-500 py-2 font-medium">
              Call Samapt (Call Ended)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
