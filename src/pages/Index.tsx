
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import Navigation from '@/components/Navigation';
import EmergencyButton from '@/components/EmergencyButton';
import SafetyMap from '@/components/SafetyMap';
import LocationSharing from '@/components/LocationSharing';
import QuickActions from '@/components/QuickActions';
import SafetyTips from '@/components/SafetyTips';

const Index = () => {
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Get user's current location
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
        }
      );
    }

    // Listen for emergency triggers (shake, key press, etc.)
    const handleKeyPress = (event: KeyboardEvent) => {
      // Emergency hotkey: Ctrl + Shift + E
      if (event.ctrlKey && event.shiftKey && event.key === 'E') {
        setIsEmergencyMode(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const translations = {
    en: {
      title: "Safe Map",
      subtitle: "Your Safety, Our Priority",
      emergency: "Emergency",
      safetyMap: "Safety Map",
      quickActions: "Quick Actions"
    },
    hi: {
      title: "सेफ मैप",
      subtitle: "आपकी सुरक्षा, हमारी प्राथमिकता",
      emergency: "आपातकाल",
      safetyMap: "सुरक्षा मानचित्र",
      quickActions: "त्वरित कार्य"
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isEmergencyMode ? 'bg-red-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <Navigation 
        language={language} 
        setLanguage={setLanguage}
        isEmergencyMode={isEmergencyMode}
      />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className={`text-4xl font-bold transition-colors ${
            isEmergencyMode ? 'text-white' : 'text-gray-800'
          }`}>
            {t.title}
          </h1>
          <p className={`text-lg transition-colors ${
            isEmergencyMode ? 'text-red-100' : 'text-gray-600'
          }`}>
            {t.subtitle}
          </p>
        </div>

        {/* Emergency Button - Always Prominent */}
        <div className="flex justify-center">
          <EmergencyButton 
            isEmergencyMode={isEmergencyMode}
            setIsEmergencyMode={setIsEmergencyMode}
            userLocation={userLocation}
            language={language}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Safety Map */}
          <div className="space-y-4">
            <h2 className={`text-2xl font-semibold transition-colors ${
              isEmergencyMode ? 'text-white' : 'text-gray-800'
            }`}>
              {t.safetyMap}
            </h2>
            <SafetyMap 
              userLocation={userLocation}
              isEmergencyMode={isEmergencyMode}
            />
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Location Sharing */}
            <LocationSharing 
              userLocation={userLocation}
              isEmergencyMode={isEmergencyMode}
              language={language}
            />

            {/* Quick Actions */}
            <QuickActions 
              isEmergencyMode={isEmergencyMode}
              language={language}
            />

            {/* Safety Tips */}
            {!isEmergencyMode && (
              <SafetyTips language={language} />
            )}
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default Index;
