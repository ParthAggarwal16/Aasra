export type ScreenType =
  | 'phone-login'
  | 'otp'
  | 'auth-success'
  | 'chatbot'
  | 'voice-companion';

export interface ChatMessageType {
  id: string;
  sender: 'aasra' | 'user';
  text: string;
  timestamp?: string;
}

export type VoiceStateType = 'ready' | 'listening' | 'processing' | 'speaking' | 'error';
