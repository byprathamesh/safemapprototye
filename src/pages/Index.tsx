
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
import { AlertTriangle, Shield, MapPin } from 'lucide-react';

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

    // Enhanced emergency triggers
    const handleKeyPress = (event: KeyboardEvent) => {
      // Emergency hotkeys
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        setIsEmergencyMode(true);
      }
      // Quick voice activation
      if (event.ctrlKey && event.key === 'v') {
        setIsVoiceListening(!isVoiceListening);
      }
    };

    // Shake detection for mobile devices
    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (acceleration) {
        const totalAcceleration = Math.sqrt(
          Math.pow(acceleration.x || 0, 2) +
          Math.pow(acceleration.y || 0, 2) +
          Math.pow(acceleration.z || 0, 2)
        );
        
        if (totalAcceleration > 25) { // Shake threshold
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
      title: "Safe Map",
      subtitle: "Your Safety, Our Priority",
      emergencyActive: "EMERGENCY MODE ACTIVE",
      safetyFirst: "Stay Safe, Stay Connected",
      features: "Safety Features",
      protection: "24/7 Protection Available"
    },
    hi: {
      title: "सेफ मैप",
      subtitle: "आपकी सुरक्षा, हमारी प्राथमिकता",
      emergencyActive: "आपातकाल मोड सक्रिय",
      safetyFirst: "सुरक्षित रहें, जुड़े रहें",
      features: "सुरक्षा सुविधाएं",
      protection: "24/7 सुरक्षा उपलब्ध"
    }
  };

  const t = translations[language as keyof typeof translations];

  if (isEmergencyMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white">
        <div className="absolute inset-0 bg-red-600 opacity-20 animate-pulse"></div>
        <Navigation 
          language={language} 
          setLanguage={setLanguage}
          isEmergencyMode={isEmergencyMode}
        />
        
        <div className="relative z-10 container mx-auto px-4 py-6">
          {/* Emergency Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <AlertTriangle className="h-12 w-12 text-red-300 animate-bounce" />
              <h1 className="text-4xl font-bold">{t.emergencyActive}</h1>
              <AlertTriangle className="h-12 w-12 text-red-300 animate-bounce" />
            </div>
            <div className="bg-red-800 border-2 border-red-400 rounded-lg p-4 mb-6">
              <p className="text-xl font-semibold">Emergency services have been contacted</p>
              <p className="text-red-200">Your location is being shared with trusted contacts</p>
            </div>
          </div>

          {/* Emergency Actions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EmergencyButton 
              isEmergencyMode={isEmergencyMode}
              setIsEmergencyMode={setIsEmergencyMode}
              userLocation={userLocation}
              language={language}
            />
            
            <div className="space-y-4">
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

          {/* Live Safety Map */}
          <div className="mt-6">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Floating Safety Indicators */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
          <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
          <span>Safe Zone</span>
        </div>
        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
          <MapPin className="h-3 w-3" />
          <span>GPS Active</span>
        </div>
      </div>

      <Navigation 
        language={language} 
        setLanguage={setLanguage}
        isEmergencyMode={isEmergencyMode}
      />
      
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="relative">
              <Shield className="h-16 w-16 text-blue-600" />
              <div className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
                <div className="h-3 w-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
          <p className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full inline-block">
            {t.protection}
          </p>
        </div>

        {/* Emergency Button - Central Focus */}
        <div className="flex justify-center py-8">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full blur opacity-30 animate-pulse"></div>
            <EmergencyButton 
              isEmergencyMode={isEmergencyMode}
              setIsEmergencyMode={setIsEmergencyMode}
              userLocation={userLocation}
              language={language}
            />
          </div>
        </div>

        {/* Voice Activation */}
        <VoiceActivation 
          isListening={isVoiceListening}
          setIsListening={setIsVoiceListening}
          language={language}
          onEmergencyTrigger={() => setIsEmergencyMode(true)}
        />

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
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
          <div className="lg:col-span-1">
            <SafetyMap 
              userLocation={userLocation}
              isEmergencyMode={isEmergencyMode}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IncidentReporting 
            language={language}
            userLocation={userLocation}
          />
          <SafetyTips language={language} />
        </div>

        {/* Feature Highlights */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">{t.features}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Instant Emergency</h3>
              <p className="text-sm opacity-90">One-tap emergency activation with multiple trigger methods</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Live Tracking</h3>
              <p className="text-sm opacity-90">Real-time location sharing with trusted contacts</p>
            </div>
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-semibold mb-2">Smart Safety</h3>
              <p className="text-sm opacity-90">AI-powered safety recommendations and alerts</p>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Index;
