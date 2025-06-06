
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

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const VoiceActivation = ({ isListening, setIsListening, language, onEmergencyTrigger }: VoiceActivationProps) => {
  const [recognition, setRecognition] = useState<any>(null);
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
    <Card className={`group transition-all duration-300 ${
      isListening 
        ? 'border-destructive bg-destructive/5 shadow-lg ring-2 ring-destructive/20' 
        : 'border-border bg-card hover:shadow-md'
    }`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg font-semibold">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg transition-colors ${
              isListening ? 'bg-destructive/10' : 'bg-muted'
            }`}>
              <Volume2 className={`h-5 w-5 ${
                isListening ? 'text-destructive' : 'text-muted-foreground'
              }`} />
            </div>
            <span className="text-foreground">{t.title}</span>
          </div>
          {isListening && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-destructive rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-destructive uppercase tracking-wider">
                ACTIVE
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={toggleListening}
          className={`w-full h-12 font-medium transition-all duration-200 ${
            isListening 
              ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground' 
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
          size="lg"
        >
          <div className="flex items-center gap-2">
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
            {isListening ? t.stopListening : t.startListening}
          </div>
        </Button>

        {isListening && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div 
                    key={i}
                    className="h-2 w-2 bg-destructive rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-destructive">
                {t.listening}
              </span>
            </div>
          </div>
        )}

        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <h4 className="text-sm font-semibold text-foreground mb-2">
            Emergency Phrases:
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {t.phrases}
          </p>
          {!isSupported && (
            <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive">
              {t.notSupported}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className={`h-1.5 w-1.5 rounded-full ${
              isSupported ? 'bg-green-500' : 'bg-destructive'
            }`} />
            <span>{isSupported ? 'Ready' : 'Unsupported'}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className={`h-1.5 w-1.5 rounded-full ${
              isListening ? 'bg-destructive animate-pulse' : 'bg-muted-foreground'
            }`} />
            <span>{isListening ? 'Listening' : 'Idle'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceActivation;
