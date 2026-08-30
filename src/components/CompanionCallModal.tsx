import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Sparkles, UserCheck, ShieldAlert, Heart } from 'lucide-react';
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
  const [agentStatusText, setAgentStatusText] = useState<string>('Connecting...');
  
  // Real-time conversation dialogue state
  const [currentCompanionText, setCurrentCompanionText] = useState<string>(
    'Namaste! Main AASRA se aapka saathi hoon. Main aapki baat sunne ke liye yahan hoon. Aap kaisa mehsoos kar rahe hain?'
  );
  const [userTranscript, setUserTranscript] = useState<string>('');
  const [distressScore, setDistressScore] = useState<number | null>(null);
  const [riskTier, setRiskTier] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const conversationHistoryRef = useRef<Array<{ role: string; content: string }>>([]);

  // Ringing on incoming
  useEffect(() => {
    if (!isOpen) {
      cleanupCall();
      setCallState('incoming');
      setCallDuration(0);
      setUserTranscript('');
      setDistressScore(null);
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
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
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
          canvasCtx.fillStyle = '#8bf2d6';
          canvasCtx.fillRect(x, (canvas.height - barHeight) / 2, barWidth - 2, barHeight + 2);
          x += barWidth;
        }
      };

      draw();
    } catch (e) {
      console.warn('Audio visualization not supported:', e);
    }
  };

  // Start Speech Recognition loop
  const startSpeechRecognition = () => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setAgentStatusText('Aasra is speaking...');
      return;
    }

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'hi-IN'; // Supports Hindi / Hinglish and English mixed

    recognition.onresult = async (event: any) => {
      const lastIndex = event.results.length - 1;
      const spokenText = event.results[lastIndex][0].transcript.trim();

      if (spokenText) {
        setUserTranscript(spokenText);
        await processUserVoiceTurn(spokenText);
      }
    };

    recognition.onerror = (err: any) => {
      console.warn('Speech recognition error:', err);
    };

    recognition.onend = () => {
      // Auto restart if call is still active
      if (callState === 'connected' && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {}
      }
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {}
  };

  // Process user speech via Groq AI backend (/api/voice-turn)
  const processUserVoiceTurn = async (text: string) => {
    setIsProcessing(true);
    setAgentStatusText('Aasra is thinking...');
    
    // Append to memory
    conversationHistoryRef.current.push({ role: 'user', content: text });

    try {
      const response = await fetch('/api/voice-turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: text,
          dialogue_history: conversationHistoryRef.current,
          case_context: 'Victim Support Ongoing Voice Checkin',
          reported_threat:
            text.toLowerCase().includes('threat') ||
            text.toLowerCase().includes('dhamki') ||
            text.toLowerCase().includes('darr') ||
            text.toLowerCase().includes('help'),
          language: 'hi',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const companionReply = data.spoken_response || data.response_text;
        
        setCurrentCompanionText(companionReply);
        conversationHistoryRef.current.push({ role: 'assistant', content: companionReply });

        if (typeof data.distress_score === 'number') {
          setDistressScore(Math.round(data.distress_score));
          setRiskTier(data.risk_tier || 'Low Risk');
        }

        // Speak reply if speaker is enabled
        if (isSpeakerOn) {
          setAgentStatusText('Aasra is speaking...');
          speakText(companionReply);
        } else {
          setAgentStatusText('Listening to your voice...');
        }
      } else {
        fallbackReply(text);
      }
    } catch (err) {
      fallbackReply(text);
    } finally {
      setIsProcessing(false);
    }
  };

  const fallbackReply = (text: string) => {
    const defaultReply = 'Main samajh raha hoon. Hum aapke saath hain, bilkul nishchint rahiye.';
    setCurrentCompanionText(defaultReply);
    if (isSpeakerOn) {
      speakText(defaultReply);
    }
    setAgentStatusText('Listening to your voice...');
  };

  // Handle Accept Call
  const handleAcceptCall = async () => {
    stopSpeaking();
    setCallState('connected');
    setAgentStatusText('Connecting audio...');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      startAudioVisualizer(stream);
      startSpeechRecognition();
    } catch (err) {
      console.warn('Microphone permission denied or not available:', err);
    }

    // Initial greeting
    const welcomeSpeech =
      'Namaste! Main AASRA se aapka saathi hoon. Main aapki baat sunne ke liye yahan hoon. Aap kaisa mehsoos kar rahe hain?';
    setCurrentCompanionText(welcomeSpeech);
    if (isSpeakerOn) {
      speakText(welcomeSpeech);
    }
    setAgentStatusText('Listening to your voice...');
  };

  // Handle End Call
  const handleEndCall = () => {
    setCallState('ended');
    cleanupCall();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl bg-[#1d1b19] text-white p-6 flex flex-col items-center justify-between min-h-[540px] shadow-2xl border border-white/10 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute -top-24 -left-24 w-60 h-60 bg-[#9e3d00]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-[#006b58]/30 rounded-full blur-3xl pointer-events-none" />

        {/* Top Companion Details */}
        <div className="flex flex-col items-center text-center mt-2 w-full">
          <div className="w-20 h-20 rounded-full bg-[#32302d] border-2 border-white/20 flex items-center justify-center text-[#ffddb9] mb-3 shadow-inner relative">
            <UserCheck size={38} className="stroke-[2]" />
            {callState === 'incoming' && (
              <span className="absolute inset-0 rounded-full border-2 border-[#8bf2d6] animate-ping" />
            )}
            {callState === 'connected' && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#1d1b19] flex items-center justify-center">
                <Heart size={12} className="text-white fill-white" />
              </div>
            )}
          </div>

          <h2 className="font-serif text-xl font-bold tracking-tight mb-0.5">
            {serviceName}
          </h2>

          <p className="text-xs font-mono text-[#ded9d4]/80 mb-1">
            {phoneNumber}
          </p>

          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                callState === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8bf2d6]">
              {callState === 'incoming'
                ? 'Incoming Call...'
                : callState === 'connected'
                ? `Active Call • ${formatDuration(callDuration)}`
                : 'Call Ended'}
            </p>
          </div>

          {/* Distress Badge if available */}
          {distressScore !== null && (
            <div className="mt-2 px-3 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-[11px] text-indigo-200 flex items-center gap-1.5">
              <ShieldAlert size={12} className="text-indigo-400" />
              <span>Distress Index: <strong>{distressScore}/100</strong> ({riskTier})</span>
            </div>
          )}
        </div>

        {/* Live Audio Waveform Canvas */}
        {callState === 'connected' && (
          <div className="w-full h-12 my-2 bg-black/40 rounded-xl flex items-center justify-center overflow-hidden border border-white/10 px-2">
            <canvas ref={canvasRef} width={280} height={40} className="w-full h-full" />
          </div>
        )}

        {/* Live Spoken Dialogue Box */}
        {callState === 'connected' && (
          <div className="w-full space-y-2.5 my-2 animate-in fade-in">
            {/* User Speech Bubble */}
            {userTranscript && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 text-left">
                <span className="text-[10px] font-bold text-[#8bf2d6] uppercase tracking-wider block mb-0.5">
                  👤 You Spoke:
                </span>
                <p className="text-xs text-white/90 italic leading-relaxed">
                  "{userTranscript}"
                </p>
              </div>
            )}

            {/* Companion AI Speech Box */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3.5 border border-white/15 text-left">
              <div className="flex items-center justify-between text-xs text-[#ffddb9] font-medium mb-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={14} />
                  <span>Aasra Companion</span>
                </div>
                {isProcessing && (
                  <span className="text-[10px] text-[#8bf2d6] animate-pulse">Groq AI analyzing...</span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-sans font-medium text-white leading-relaxed">
                "{currentCompanionText}"
              </p>
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="w-full pt-3">
          {callState === 'incoming' ? (
            <div className="flex items-center justify-around w-full">
              {/* Decline */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  id="btn-call-decline"
                  type="button"
                  onClick={handleEndCall}
                  className="w-14 h-14 rounded-full bg-[#ba1a1a] hover:bg-[#9a1515] flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  <PhoneOff size={24} />
                </button>
                <span className="text-xs font-medium text-[#ded9d4]">Reject</span>
              </div>

              {/* Accept */}
              <div className="flex flex-col items-center gap-1.5">
                <button
                  id="btn-call-accept"
                  type="button"
                  onClick={handleAcceptCall}
                  className="w-14 h-14 rounded-full bg-[#006b58] hover:bg-[#005142] flex items-center justify-center shadow-lg active:scale-95 transition-all animate-bounce cursor-pointer"
                >
                  <Phone size={24} />
                </button>
                <span className="text-xs font-medium text-[#8bf2d6]">Accept</span>
              </div>
            </div>
          ) : callState === 'connected' ? (
            <div className="space-y-4 w-full">
              <div className="flex items-center justify-around w-full">
                {/* Mute */}
                <button
                  type="button"
                  onClick={() => {
                    const next = !isMuted;
                    setIsMuted(next);
                    if (mediaStreamRef.current) {
                      mediaStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = !next));
                    }
                  }}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isMuted ? 'bg-white text-black' : 'bg-white/20 text-white'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                {/* Speaker */}
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeakerOn) stopSpeaking();
                    setIsSpeakerOn(!isSpeakerOn);
                  }}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isSpeakerOn ? 'bg-[#ffddb9] text-[#9e3d00]' : 'bg-white/20 text-white'
                  }`}
                  title={isSpeakerOn ? 'Speaker Mute' : 'Speaker On'}
                >
                  {isSpeakerOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>

                {/* Hang Up */}
                <button
                  id="btn-call-hangup"
                  type="button"
                  onClick={handleEndCall}
                  className="w-12 h-12 rounded-full bg-[#ba1a1a] hover:bg-[#9a1515] flex items-center justify-center shadow-lg active:scale-95 transition-all cursor-pointer"
                  title="End Call"
                >
                  <PhoneOff size={22} />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-[#ded9d4] py-2">
              Call Samapt (Call Ended)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
