
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language === 'hi' ? 'hi-IN' : 'en-US';

      recognitionInstance.onresult = (event) => {
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

      recognitionInstance.onerror = (event) => {
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
    <Card className={`transition-all duration-300 ${isListening ? 'border-blue-500 bg-blue-50 shadow-lg' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Volume2 className="h-5 w-5" />
          <span>{t.title}</span>
          {isListening && (
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-600">Active</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            onClick={toggleListening}
            className={`w-full ${isListening 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            size="lg"
          >
            {isListening ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
            {isListening ? t.stopListening : t.startListening}
          </Button>

          {isListening && (
            <div className="bg-blue-100 border border-blue-200 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">{t.listening}</p>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-xs text-blue-600">Listening...</span>
              </div>
            </div>
          )}

          <div className="bg-gray-100 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-800 mb-2">Emergency Phrases:</h4>
            <p className="text-xs text-gray-600">{t.phrases}</p>
            {!isSupported && (
              <p className="text-xs text-red-600 mt-2">{t.notSupported}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceActivation;
