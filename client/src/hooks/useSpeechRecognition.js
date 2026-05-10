// client/src/hooks/useSpeechRecognition.js
import { useState, useEffect } from 'react';

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      setTranscript(event.results[0][0].transcript);
      setListening(false);
    };
    recognition.start();
    setListening(true);
  };

  return { transcript, listening, startListening };
};