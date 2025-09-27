const textToSpeech = (title: string, delayMs: number): void => {
  setTimeout(() => {
    const msg = new SpeechSynthesisUtterance();
    msg.rate = 1.1;
    msg.pitch = 1.5;
    msg.text = title;
    msg.lang = 'es';

    const synth = window.speechSynthesis;
    const voices = synth.getVoices().filter((voice) => voice.lang.includes('es'));
    const voiceIndex = voices.findIndex((voice) => voice.name === 'Paulina');

    if (voiceIndex > -1) {
      msg.voice = voices[voiceIndex];
    }

    speechSynthesis.speak(msg);
  }, delayMs);
};

export { textToSpeech as default };
