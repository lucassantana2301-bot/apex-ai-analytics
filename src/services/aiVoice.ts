// Web Speech API Voice Narration Service

export function speakExecutiveSummary(text: string, onEnd?: () => void): SpeechSynthesisUtterance | null {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-speech is not supported in this browser.');
    return null;
  }

  // Cancel any active speech
  window.speechSynthesis.cancel();

  const cleanText = text.replace(/[*#_`]/g, '');
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.lang = 'en-US';

  // Try to find a high quality natural voice if available
  const voices = window.speechSynthesis.getVoices();
  const selectedVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Premium'))) || voices[0];
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopExecutiveSummary(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
