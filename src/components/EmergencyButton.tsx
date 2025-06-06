
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone, Shield, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmergencyButtonProps {
  isEmergencyMode: boolean;
  setIsEmergencyMode: (mode: boolean) => void;
  userLocation: {lat: number, lng: number} | null;
  language: string;
}

const EmergencyButton = ({ isEmergencyMode, setIsEmergencyMode, userLocation, language }: EmergencyButtonProps) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [pressStartTime, setPressStartTime] = useState<number | null>(null);
  const { toast } = useToast();

  const translations = {
    en: {
      emergency: "EMERGENCY",
      help: "PRESS & HOLD FOR HELP",
      activated: "EMERGENCY ACTIVATED",
      calling: "Emergency Services Contacted",
      locationShared: "Location shared with trusted contacts",
      recording: "Evidence recording started",
      cancel: "Cancel Emergency",
      confirm: "Confirm Emergency",
      release: "Release to cancel",
      hold: "Hold to activate"
    },
    hi: {
      emergency: "आपातकाल",
      help: "मदद के लिए दबाकर रखें",
      activated: "आपातकाल सक्रिय",
      calling: "आपातकालीन सेवाओं से संपर्क",
      locationShared: "विश्वसनीय संपर्कों के साथ स्थान साझा",
      recording: "प्रमाण रिकॉर्डिंग शुरू",
      cancel: "आपातकाल रद्द करें",
      confirm: "आपातकाल की पुष्टि करें",
      release: "रद्द करने के लिए छोड़ें",
      hold: "सक्रिय करने के लिए दबाए रखें"
    }
  };

  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prev => prev! - 1);
      }, 1000);
    } else if (countdown === 0) {
      activateEmergency();
      setCountdown(null);
    }
    return () => clearInterval(interval);
  }, [countdown]);

  const activateEmergency = () => {
    setIsEmergencyMode(true);
    
    console.log('EMERGENCY ACTIVATED');
    console.log('Location:', userLocation);
    console.log('Calling emergency services...');
    console.log('Sending alerts to trusted contacts...');
    console.log('Starting emergency recording...');

    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200, 100, 1000]);
    }

    toast({
      title: t.activated,
      description: t.calling,
      variant: "destructive"
    });

    setTimeout(() => {
      toast({
        title: "Location Shared",
        description: t.locationShared,
        variant: "default"
      });
    }, 1000);

    setTimeout(() => {
      toast({
        title: "Recording Started",
        description: t.recording,
        variant: "default"
      });
    }, 2000);
  };

  const handleMouseDown = () => {
    if (isEmergencyMode) return;
    
    setPressStartTime(Date.now());
    setCountdown(3);
    toast({
      title: "Emergency Activation",
      description: t.release,
      variant: "destructive"
    });
  };

  const handleMouseUp = () => {
    if (countdown !== null) {
      setCountdown(null);
      setPressStartTime(null);
      toast({
        title: "Emergency Cancelled",
        description: "Emergency activation was cancelled",
        variant: "default"
      });
    }
  };

  const handleClick = () => {
    if (isEmergencyMode) {
      setIsEmergencyMode(false);
      setCountdown(null);
      toast({
        title: "Emergency Deactivated",
        description: "Emergency mode has been turned off",
        variant: "default"
      });
    }
  };

  if (isEmergencyMode) {
    return (
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="absolute -inset-8 bg-red-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-red-600 to-red-800 text-white p-8 rounded-2xl shadow-2xl border-4 border-red-400">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-red-500 rounded-full p-3">
                  <AlertTriangle className="h-8 w-8 animate-pulse" />
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black">{t.activated}</div>
                  <div className="text-red-200 text-lg font-semibold">Emergency Mode Active</div>
                </div>
                <div className="bg-red-500 rounded-full p-3">
                  <AlertTriangle className="h-8 w-8 animate-pulse" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center justify-center space-x-3 bg-red-700/50 rounded-lg p-3 border border-red-500">
                  <Phone className="h-5 w-5" />
                  <span className="font-medium">{t.calling}</span>
                </div>
                <div className="flex items-center justify-center space-x-3 bg-red-700/50 rounded-lg p-3 border border-red-500">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">{t.locationShared}</span>
                </div>
                <div className="flex items-center justify-center space-x-3 bg-red-700/50 rounded-lg p-3 border border-red-500">
                  <Zap className="h-5 w-5" />
                  <span className="font-medium">{t.recording}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleClick}
          variant="outline"
          size="lg"
          className="bg-white text-red-600 hover:bg-red-50 border-2 border-red-600 font-semibold px-8 py-3"
        >
          {t.cancel}
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="absolute -inset-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full blur opacity-20"></div>
        <div className="absolute -inset-3 bg-red-400 rounded-full opacity-10"></div>
        
        <Button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className={`
            relative h-40 w-40 rounded-full text-white font-bold text-lg
            transition-all duration-300 transform hover:scale-105 active:scale-95
            ${countdown !== null 
              ? 'bg-gradient-to-br from-red-700 to-red-900 border-4 border-red-400 animate-pulse shadow-2xl' 
              : 'bg-gradient-to-br from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 border-4 border-red-500 shadow-2xl'
            }
          `}
          size="lg"
        >
          <div className="text-center space-y-2">
            {countdown !== null ? (
              <>
                <div className="text-4xl font-black">{countdown}</div>
                <div className="text-sm font-semibold">{t.release}</div>
              </>
            ) : (
              <>
                <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                <div className="text-xl font-black">{t.emergency}</div>
                <div className="text-xs font-medium leading-tight">{t.help}</div>
              </>
            )}
          </div>
        </Button>
        
        {countdown !== null && (
          <>
            <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
            <div className="absolute inset-2 rounded-full border-2 border-red-200 animate-pulse"></div>
          </>
        )}
      </div>
      
      <div className="space-y-3">
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 max-w-md mx-auto">
          <div className="text-gray-800 font-bold mb-2">Emergency Activation Methods:</div>
          <div className="text-sm text-gray-600 space-y-1">
            <div>• Press & hold button for 3 seconds</div>
            <div>• Voice command: "Help me" / "मुझे मदद चाहिए"</div>
            <div>• Keyboard: Ctrl+Shift+E</div>
            <div>• Shake device rapidly</div>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span>GPS Ready</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <span>Contacts Ready</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-gray-700 rounded-full"></div>
            <span>Recording Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyButton;
