
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import Navigation from '@/components/Navigation';
import EmergencyButton from '@/components/EmergencyButton';
import SafetyMap from '@/components/SafetyMap';
import LocationSharing from '@/components/LocationSharing';
import QuickActions from '@/components/QuickActions';
import SafetyTips from '@/components/SafetyTips';
import IncidentReporting from '@/components/IncidentReporting';
import SafetyCheckin from '@/components/SafetyCheckin';
import EmergencyContacts from '@/components/EmergencyContacts';
import VoiceActivation from '@/components/VoiceActivation';
import { AlertTriangle, Shield, MapPin, Zap, Phone, Eye } from 'lucide-react';

const Index = () => {
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [language, setLanguage] = useState('en');
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        setIsEmergencyMode(true);
      }
      if (event.ctrlKey && event.key === 'v') {
        setIsVoiceListening(!isVoiceListening);
      }
    };

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (acceleration) {
        const totalAcceleration = Math.sqrt(
          Math.pow(acceleration.x || 0, 2) +
          Math.pow(acceleration.y || 0, 2) +
          Math.pow(acceleration.z || 0, 2)
        );
        
        if (totalAcceleration > 25) {
          setIsEmergencyMode(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('devicemotion', handleDeviceMotion);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [isVoiceListening]);

  const translations = {
    en: {
      title: "SAFE MAP",
      subtitle: "Emergency Safety System",
      emergencyActive: "EMERGENCY MODE ACTIVE",
      safetyFirst: "Your Safety is Our Priority",
      features: "Emergency Features",
      protection: "24/7 Emergency Ready",
      authoritiesContacted: "AUTHORITIES CONTACTED",
      servicesActivated: "EMERGENCY SERVICES ACTIVATED",
      locationShared: "Your location is being shared",
      recordingProgress: "Recording in progress", 
      helpOnWay: "Help is on the way"
    },
    hi: {
      title: "सेफ मैप",
      subtitle: "आपातकालीन सुरक्षा प्रणाली",
      emergencyActive: "आपातकाल मोड सक्रिय",
      safetyFirst: "आपकी सुरक्षा हमारी प्राथमिकता",
      features: "आपातकालीन सुविधाएं",
      protection: "24/7 आपातकाल तैयार",
      authoritiesContacted: "अधिकारियों से संपर्क",
      servicesActivated: "आपातकालीन सेवाएं सक्रिय",
      locationShared: "आपका स्थान साझा किया जा रहा है",
      recordingProgress: "रिकॉर्डिंग प्रगति में",
      helpOnWay: "मदद आ रही है"
    }
  };

  const t = translations[language as keyof typeof translations];

  if (isEmergencyMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        
        <Navigation 
          language={language} 
          setLanguage={setLanguage}
          isEmergencyMode={isEmergencyMode}
        />
        
        <div className="relative z-10 container mx-auto px-4 py-6">
          <div className="text-center mb-8">
            <div className="bg-red-500 border-l-8 border-white rounded-r-lg p-6 mb-6 shadow-2xl">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <AlertTriangle className="h-12 w-12 text-white animate-pulse" />
                <div>
                  <h1 className="text-4xl font-black tracking-wider">{t.emergencyActive}</h1>
                  <div className="text-xl font-bold mt-1">{t.authoritiesContacted}</div>
                </div>
                <AlertTriangle className="h-12 w-12 text-white animate-pulse" />
              </div>
            </div>
            
            <div className="bg-black border border-red-400 rounded-lg p-6 mb-8 shadow-2xl">
              <div className="border-b border-red-400 pb-4 mb-4">
                <h2 className="text-2xl font-bold text-red-400">{t.servicesActivated}</h2>
                <p className="text-gray-300 mt-2">
                  {t.locationShared} • {t.recordingProgress} • {t.helpOnWay}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col items-center space-y-2 p-3 bg-red-900/50 rounded-lg border border-red-700">
                  <Zap className="h-6 w-6 text-red-400" />
                  <span className="font-semibold">LIVE TRACKING</span>
                </div>
                <div className="flex flex-col items-center space-y-2 p-3 bg-red-900/50 rounded-lg border border-red-700">
                  <Shield className="h-6 w-6 text-red-400" />
                  <span className="font-semibold">CONTACTS ALERTED</span>
                </div>
                <div className="flex flex-col items-center space-y-2 p-3 bg-red-900/50 rounded-lg border border-red-700">
                  <Eye className="h-6 w-6 text-red-400" />
                  <span className="font-semibold">EVIDENCE RECORDING</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <EmergencyButton 
                isEmergencyMode={isEmergencyMode}
                setIsEmergencyMode={setIsEmergencyMode}
                userLocation={userLocation}
                language={language}
              />
            </div>
            
            <div className="space-y-6">
              <LocationSharing 
                userLocation={userLocation}
                isEmergencyMode={isEmergencyMode}
                language={language}
              />
              <EmergencyContacts 
                isEmergencyMode={isEmergencyMode}
                language={language}
              />
            </div>
          </div>

          <div className="mt-8">
            <SafetyMap 
              userLocation={userLocation}
              isEmergencyMode={isEmergencyMode}
            />
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-20 right-4 z-50 space-y-3">
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 shadow-lg">
          <div className="h-3 w-3 bg-white rounded-full animate-pulse"></div>
          <span>SAFE ZONE</span>
        </div>
        <div className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 shadow-lg">
          <MapPin className="h-4 w-4" />
          <span>GPS ACTIVE</span>
        </div>
        <div className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 shadow-lg">
          <Shield className="h-4 w-4" />
          <span>PROTECTED</span>
        </div>
      </div>

      <Navigation 
        language={language} 
        setLanguage={setLanguage}
        isEmergencyMode={isEmergencyMode}
      />
      
      <div className="container mx-auto px-4 py-8 space-y-12">
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="relative">
              <div className="h-20 w-20 bg-black rounded-full flex items-center justify-center">
                <Shield className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          
          <h1 className="text-7xl font-black text-black tracking-wider">
            {t.title}
          </h1>
          <p className="text-2xl text-gray-800 font-bold max-w-3xl mx-auto">
            {t.subtitle}
          </p>
          <div className="bg-gray-100 border-2 border-gray-300 px-8 py-4 rounded-lg inline-block">
            <p className="text-lg text-gray-700 font-medium">{t.protection}</p>
          </div>
        </div>

        <div className="flex justify-center py-12">
          <div className="relative">
            <div className="absolute -inset-8 bg-red-600 rounded-full blur-2xl opacity-20"></div>
            <div className="absolute -inset-4 bg-red-500 rounded-full blur-xl opacity-10"></div>
            <EmergencyButton 
              isEmergencyMode={isEmergencyMode}
              setIsEmergencyMode={setIsEmergencyMode}
              userLocation={userLocation}
              language={language}
            />
          </div>
        </div>

        <VoiceActivation 
          isListening={isVoiceListening}
          setIsListening={setIsVoiceListening}
          language={language}
          onEmergencyTrigger={() => setIsEmergencyMode(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-8">
            <LocationSharing 
              userLocation={userLocation}
              isEmergencyMode={isEmergencyMode}
              language={language}
            />
            <SafetyCheckin 
              language={language}
              userLocation={userLocation}
            />
          </div>

          <div className="lg:col-span-1">
            <SafetyMap 
              userLocation={userLocation}
              isEmergencyMode={isEmergencyMode}
            />
          </div>

          <div className="space-y-8">
            <QuickActions 
              isEmergencyMode={isEmergencyMode}
              language={language}
            />
            <EmergencyContacts 
              isEmergencyMode={isEmergencyMode}
              language={language}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <IncidentReporting 
            language={language}
            userLocation={userLocation}
          />
          <SafetyTips language={language} />
        </div>

        <div className="bg-black text-white rounded-2xl p-12 shadow-2xl">
          <h2 className="text-4xl font-black mb-10 text-center tracking-wider">{t.features}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-red-600 rounded-lg w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-red-500 transition-colors">
                <AlertTriangle className="h-10 w-10" />
              </div>
              <h3 className="font-bold text-xl mb-3">INSTANT EMERGENCY</h3>
              <p className="text-gray-300 leading-relaxed">One-tap emergency activation with voice, shake, and keyboard triggers</p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gray-700 rounded-lg w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-600 transition-colors">
                <MapPin className="h-10 w-10" />
              </div>
              <h3 className="font-bold text-xl mb-3">LIVE TRACKING</h3>
              <p className="text-gray-300 leading-relaxed">Real-time location sharing with automatic evidence recording</p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-green-600 rounded-lg w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-green-500 transition-colors">
                <Shield className="h-10 w-10" />
              </div>
              <h3 className="font-bold text-xl mb-3">SMART PROTECTION</h3>
              <p className="text-gray-300 leading-relaxed">AI-powered safety recommendations and community alerts</p>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Index;
