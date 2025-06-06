
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
import { AlertTriangle, Shield, MapPin, Zap } from 'lucide-react';

const Index = () => {
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [language, setLanguage] = useState('en');
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  useEffect(() => {
    // Get user's current location with high accuracy
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

    // Enhanced emergency triggers with animations
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        setIsEmergencyMode(true);
      }
      if (event.ctrlKey && event.key === 'v') {
        setIsVoiceListening(!isVoiceListening);
      }
    };

    // Enhanced shake detection
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
      emergencyActive: "🚨 EMERGENCY MODE ACTIVE",
      safetyFirst: "Your Safety is Our Priority",
      features: "Emergency Features",
      protection: "24/7 Emergency Ready"
    },
    hi: {
      title: "सेफ मैप",
      subtitle: "आपातकालीन सुरक्षा प्रणाली",
      emergencyActive: "🚨 आपातकाल मोड सक्रिय",
      safetyFirst: "आपकी सुरक्षा हमारी प्राथमिकता",
      features: "आपातकालीन सुविधाएं",
      protection: "24/7 आपातकाल तैयार"
    }
  };

  const t = translations[language as keyof typeof translations];

  if (isEmergencyMode) {
    return (
      <div className="min-h-screen bg-red-900 text-white relative overflow-hidden">
        {/* Emergency background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-900"></div>
        <div className="absolute inset-0 bg-red-600 opacity-30 animate-pulse"></div>
        
        {/* Emergency pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 grid-rows-12 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border border-red-400 animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
            ))}
          </div>
        </div>

        <Navigation 
          language={language} 
          setLanguage={setLanguage}
          isEmergencyMode={isEmergencyMode}
        />
        
        <div className="relative z-10 container mx-auto px-4 py-6">
          {/* Emergency Header with enhanced animations */}
          <div className="text-center mb-8 animate-slide-up">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <AlertTriangle className="h-16 w-16 text-red-300 animate-bounce" />
              <div>
                <h1 className="text-5xl font-black tracking-wider animate-emergency-pulse">{t.emergencyActive}</h1>
                <div className="text-xl text-red-200 font-bold mt-2">AUTHORITIES CONTACTED</div>
              </div>
              <AlertTriangle className="h-16 w-16 text-red-300 animate-bounce" />
            </div>
            
            <div className="bg-black border-4 border-red-400 rounded-xl p-6 mb-8 animate-emergency-glow">
              <p className="text-2xl font-bold mb-2">🚨 EMERGENCY SERVICES ACTIVATED</p>
              <p className="text-red-200 text-lg">Your location is being shared • Recording in progress • Help is on the way</p>
              <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                <div className="flex items-center justify-center space-x-1">
                  <Zap className="h-4 w-4" />
                  <span>LIVE TRACKING</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>CONTACTS ALERTED</span>
                </div>
                <div className="flex items-center justify-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>EVIDENCE RECORDING</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Grid with staggered animations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
              <EmergencyButton 
                isEmergencyMode={isEmergencyMode}
                setIsEmergencyMode={setIsEmergencyMode}
                userLocation={userLocation}
                language={language}
              />
            </div>
            
            <div className="space-y-6 animate-fade-in" style={{animationDelay: '0.4s'}}>
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

          {/* Live Safety Map with enhanced emergency styling */}
          <div className="mt-8 animate-slide-up" style={{animationDelay: '0.6s'}}>
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
      {/* Enhanced floating safety indicators */}
      <div className="fixed top-20 right-4 z-50 space-y-3">
        <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg animate-pulse">
          <div className="h-3 w-3 bg-white rounded-full animate-pulse"></div>
          <span>SAFE ZONE</span>
        </div>
        <div className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg">
          <MapPin className="h-4 w-4" />
          <span>GPS ACTIVE</span>
        </div>
        <div className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 shadow-lg">
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
        {/* Hero Section with dramatic emergency styling */}
        <div className="text-center space-y-8 animate-fade-in">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="relative">
              <Shield className="h-20 w-20 text-black" />
              <div className="absolute -top-2 -right-2 h-8 w-8 bg-green-600 rounded-full flex items-center justify-center animate-pulse">
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
          <p className="text-lg text-gray-600 bg-gray-100 px-6 py-3 rounded-full inline-block font-medium border-2 border-gray-300">
            {t.protection}
          </p>
        </div>

        {/* Emergency Button - Dramatic central focus */}
        <div className="flex justify-center py-12 animate-slide-up">
          <div className="relative">
            <div className="absolute -inset-8 bg-red-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="absolute -inset-4 bg-red-500 rounded-full blur-xl opacity-20 animate-ping"></div>
            <EmergencyButton 
              isEmergencyMode={isEmergencyMode}
              setIsEmergencyMode={setIsEmergencyMode}
              userLocation={userLocation}
              language={language}
            />
          </div>
        </div>

        {/* Voice Activation with enhanced styling */}
        <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
          <VoiceActivation 
            isListening={isVoiceListening}
            setIsListening={setIsVoiceListening}
            language={language}
            onEmergencyTrigger={() => setIsEmergencyMode(true)}
          />
        </div>

        {/* Features Grid with staggered animations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-8 animate-slide-up" style={{animationDelay: '0.3s'}}>
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

          {/* Center Column - Map */}
          <div className="lg:col-span-1 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <SafetyMap 
              userLocation={userLocation}
              isEmergencyMode={isEmergencyMode}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-8 animate-slide-up" style={{animationDelay: '0.5s'}}>
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

        {/* Additional Features Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in" style={{animationDelay: '0.6s'}}>
          <IncidentReporting 
            language={language}
            userLocation={userLocation}
          />
          <SafetyTips language={language} />
        </div>

        {/* Enhanced Feature Highlights with dramatic styling */}
        <div className="bg-black text-white rounded-2xl p-12 shadow-2xl animate-slide-up" style={{animationDelay: '0.7s'}}>
          <h2 className="text-4xl font-black mb-10 text-center tracking-wider">{t.features}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-red-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-red-700 transition-colors">
                <AlertTriangle className="h-10 w-10" />
              </div>
              <h3 className="font-bold text-xl mb-3">INSTANT EMERGENCY</h3>
              <p className="text-gray-300 leading-relaxed">One-tap emergency activation with voice, shake, and keyboard triggers</p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-gray-700 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-600 transition-colors">
                <MapPin className="h-10 w-10" />
              </div>
              <h3 className="font-bold text-xl mb-3">LIVE TRACKING</h3>
              <p className="text-gray-300 leading-relaxed">Real-time location sharing with automatic evidence recording</p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="bg-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-green-700 transition-colors">
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
