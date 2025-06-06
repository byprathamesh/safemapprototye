
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmergencyButtonProps {
  isEmergencyMode: boolean;
  setIsEmergencyMode: (mode: boolean) => void;
  userLocation: {lat: number, lng: number} | null;
  language: string;
}

const EmergencyButton = ({ isEmergencyMode, setIsEmergencyMode, userLocation, language }: EmergencyButtonProps) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const { toast } = useToast();

  const translations = {
    en: {
      emergency: "EMERGENCY",
      help: "GET HELP NOW",
      activated: "EMERGENCY ACTIVATED",
      calling: "Calling Emergency Services...",
      locationShared: "Location shared with trusted contacts",
      cancel: "Cancel Emergency",
      confirm: "Confirm Emergency"
    },
    hi: {
      emergency: "आपातकाल",
      help: "अभी मदद लें",
      activated: "आपातकाल सक्रिय",
      calling: "आपातकालीन सेवाओं को कॉल कर रहे हैं...",
      locationShared: "विश्वसनीय संपर्कों के साथ स्थान साझा किया गया",
      cancel: "आपातकाल रद्द करें",
      confirm: "आपातकाल की पुष्टि करें"
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

  const handleEmergencyPress = () => {
    if (isEmergencyMode) {
      // Deactivate emergency mode
      setIsEmergencyMode(false);
      setCountdown(null);
      toast({
        title: "Emergency Deactivated",
        description: "Emergency mode has been turned off.",
        variant: "default"
      });
    } else {
      // Start countdown for emergency activation
      setCountdown(3);
      toast({
        title: "Emergency Activation",
        description: "Release to cancel, hold to confirm emergency",
        variant: "destructive"
      });
    }
  };

  const activateEmergency = () => {
    setIsEmergencyMode(true);
    
    // Simulate emergency actions
    console.log('🚨 EMERGENCY ACTIVATED');
    console.log('📍 Location:', userLocation);
    console.log('📞 Calling emergency services...');
    console.log('📲 Sending alerts to trusted contacts...');
    console.log('🎥 Starting emergency recording...');

    // Haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    toast({
      title: t.activated,
      description: t.locationShared,
      variant: "destructive"
    });
  };

  const cancelCountdown = () => {
    setCountdown(null);
    toast({
      title: "Emergency Cancelled",
      description: "Emergency activation was cancelled.",
      variant: "default"
    });
  };

  if (isEmergencyMode) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-red-600 text-white p-6 rounded-2xl shadow-2xl border-4 border-red-400 animate-pulse">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <AlertTriangle className="h-8 w-8" />
            <span className="text-2xl font-bold">{t.activated}</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-red-100">
            <Phone className="h-5 w-5" />
            <span className="text-lg">{t.calling}</span>
          </div>
        </div>
        <Button 
          onClick={handleEmergencyPress}
          variant="outline"
          size="lg"
          className="bg-white text-red-600 hover:bg-red-50 border-2 border-red-600"
        >
          {t.cancel}
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <div className="relative">
        <Button
          onMouseDown={handleEmergencyPress}
          onMouseUp={cancelCountdown}
          onTouchStart={handleEmergencyPress}
          onTouchEnd={cancelCountdown}
          className={`
            relative h-32 w-32 rounded-full text-white font-bold text-lg
            transition-all duration-200 transform hover:scale-105 active:scale-95
            ${countdown !== null 
              ? 'bg-red-700 border-4 border-red-400 animate-pulse' 
              : 'bg-red-600 hover:bg-red-700 border-4 border-red-500'
            }
            shadow-2xl hover:shadow-red-500/50
          `}
          size="lg"
        >
          <div className="text-center">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <div className="text-sm leading-tight">
              {countdown !== null ? countdown : t.emergency}
            </div>
          </div>
        </Button>
        
        {countdown !== null && (
          <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
        )}
      </div>
      
      <div className="text-gray-600 max-w-xs mx-auto">
        <p className="text-sm">{t.help}</p>
        <p className="text-xs mt-1">Hold button for 3 seconds or use hotkey: Ctrl+Shift+E</p>
      </div>
    </div>
  );
};

export default EmergencyButton;
