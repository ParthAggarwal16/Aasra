/**
 * Speech synthesis helper for AASRA / Saathi accessibility audio narration.
 */

let currentUtterance: SpeechSynthesisUtterance | null = null;
let speechListeners: Set<(isSpeaking: boolean) => void> = new Set();

export function subscribeSpeechState(listener: (isSpeaking: boolean) => void) {
  speechListeners.add(listener);
  return () => {
    speechListeners.delete(listener);
  };
}

function notifyState(isSpeaking: boolean) {
  speechListeners.forEach((listener) => listener(isSpeaking));
}

export function speakText(text: string, lang = 'hi-IN') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser.');
    return;
  }

  // Stop previous speech
  window.speechSynthesis.cancel();
  notifyState(false);

  if (!text || text.trim() === '') return;

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.92; // Slightly slower for clarity
    utterance.pitch = 1.0;

    // Pick best matching voice if available
    const voices = window.speechSynthesis.getVoices();
    const hiVoice = voices.find((v) => v.lang.includes('hi') || v.name.includes('Hindi') || v.name.includes('India'));
    if (hiVoice) {
      utterance.voice = hiVoice;
    }

    utterance.onstart = () => {
      notifyState(true);
    };

    utterance.onend = () => {
      notifyState(false);
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      notifyState(false);
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Failed to speak text:', err);
    notifyState(false);
  }
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    notifyState(false);
  }
}

export function isSpeechSpeaking(): boolean {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
}
