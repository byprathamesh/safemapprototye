
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import '@/types/speech';

interface VoiceActivationProps {
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
  language: string;
  onEmergencyTrigger: () => void;
}

const VoiceActivation = ({ isListening, setIsListening, language, onEmergencyTrigger }: VoiceActivationProps) => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  const translations = {
    en: {
      title: "Voice Emergency Activation",
      startListening: "Start Voice Detection",
      stopListening: "Stop Voice Detection", 
      listening: "Listening for emergency phrases...",
      phrases: "Say: 'Help me', 'Emergency', 'I need help'",
      notSupported: "Voice recognition not supported",
      activated: "Emergency activated by voice command!"
    },
    hi: {
      title: "आवाज़ आपातकाल सक्रियता",
      startListening: "आवाज़ पहचान शुरू करें",
      stopListening: "आवाज़ पहचान बंद करें",
      listening: "आपातकालीन वाक्यों को सुन रहा है...",
      phrases: "कहें: 'मुझे मदद चाहिए', 'आपातकाल', 'सहायता'",
      notSupported: "आवाज़ पहचान समर्थित नहीं है",
      activated: "आवाज़ कमांड द्वारा आपातकाल सक्रिय!"
    }
  };

  const t = translations[language as keyof typeof translations];

  const emergencyPhrases = {
    en: ['help me', 'emergency', 'i need help', 'call police', 'danger', 'unsafe'],
    hi: ['मुझे मदद चाहिए', 'आपातकाल', 'सहायता', 'पुलिस बुलाओ', 'खतरा', 'असुरक्षित']
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log('Voice input:', transcript);

        const phrases = emergencyPhrases[language as keyof typeof emergencyPhrases];
        const isEmergencyPhrase = phrases.some(phrase => transcript.includes(phrase));

        if (isEmergencyPhrase) {
          toast({
            title: t.activated,
            description: `Detected: "${transcript}"`,
            variant: "destructive"
          });
          onEmergencyTrigger();
          setIsListening(false);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      setIsSupported(false);
    }
  }, [language, onEmergencyTrigger, t.activated, toast]);

  useEffect(() => {
    if (recognition) {
      if (isListening) {
        recognition.start();
      } else {
        recognition.stop();
      }
    }
  }, [isListening, recognition]);

  const toggleListening = () => {
    if (!isSupported) {
      toast({
        title: t.notSupported,
        description: "Please use Chrome or Safari for voice features",
        variant: "destructive"
      });
      return;
    }
    setIsListening(!isListening);
  };

  return (
    <Card className={`transition-all duration-500 border-2 ${
      isListening 
        ? 'border-red-500 bg-red-50 shadow-xl animate-pulse' 
        : 'border-gray-300 bg-white hover:border-gray-400'
    }`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Volume2 className="h-5 w-5 text-gray-700" />
            <span className="text-gray-900">{t.title}</span>
          </div>
          {isListening && (
            <div className="flex items-center space-x-2 animate-bounce">
              <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-red-600 font-bold">ACTIVE</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={toggleListening}
            className={`w-full transition-all duration-300 transform hover:scale-105 ${
              isListening 
                ? 'bg-red-600 hover:bg-red-700 text-white border-red-700 animate-pulse' 
                : 'bg-black hover:bg-gray-800 text-white border-black'
            }`}
            size="lg"
          >
            {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
            {isListening ? t.stopListening : t.startListening}
          </Button>

          {isListening && (
            <div className="bg-red-100 border-2 border-red-300 p-4 rounded-lg animate-fade-in">
              <p className="text-sm font-bold text-red-800 mb-3">{t.listening}</p>
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1">
                  <div className="h-3 w-3 bg-red-500 rounded-full animate-bounce"></div>
                  <div className="h-3 w-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="h-3 w-3 bg-red-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-sm text-red-700 font-medium">Listening...</span>
              </div>
            </div>
          )}

          <div className="bg-gray-100 p-4 rounded-lg border">
            <h4 className="text-sm font-bold text-gray-900 mb-2">Emergency Phrases:</h4>
            <p className="text-xs text-gray-700">{t.phrases}</p>
            {!isSupported && (
              <p className="text-xs text-red-600 mt-2 font-medium">{t.notSupported}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceActivation;
