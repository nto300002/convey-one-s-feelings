'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

type SpeechRecognition = any;
type SpeechRecognitionEvent = {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
};

interface VoiceInputProps {
  onResult: (text: string) => void;
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
}

export function VoiceInput({
  onResult,
  isListening,
  setIsListening,
}: VoiceInputProps) {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'ja-JP';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const result = event.results[0][0].transcript;
        onResult(result);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, [onResult, setIsListening]);

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  if (!recognition) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-500">
          お使いのブラウザは音声入力に対応していません
        </label>
        <Button variant="outline" disabled className="w-full">
          <MicOff className="h-4 w-4 mr-2" />
          音声入力
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {isListening ? '音声を認識中...' : '音声で入力'}
      </label>
      <Button
        variant={isListening ? 'default' : 'outline'}
        onClick={toggleListening}
        className="w-full"
      >
        {isListening ? (
          <>
            <Mic className="h-4 w-4 mr-2 animate-pulse" />
            停止
          </>
        ) : (
          <>
            <Mic className="h-4 w-4 mr-2" />
            開始
          </>
        )}
      </Button>
    </div>
  );
}
