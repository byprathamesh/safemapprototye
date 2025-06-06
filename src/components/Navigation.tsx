
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Settings, Users, HelpCircle } from 'lucide-react';

interface NavigationProps {
  language: string;
  setLanguage: (lang: string) => void;
  isEmergencyMode: boolean;
}

const Navigation = ({ language, setLanguage, isEmergencyMode }: NavigationProps) => {
  const translations = {
    en: {
      dashboard: "Dashboard",
      contacts: "Contacts", 
      help: "Help",
      settings: "Settings"
    },
    hi: {
      dashboard: "डैशबोर्ड",
      contacts: "संपर्क",
      help: "सहायता", 
      settings: "सेटिंग्स"
    }
  };

  const t = translations[language as keyof typeof translations];

  if (isEmergencyMode) {
    return (
      <nav className="bg-red-800 border-b border-red-700 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-white" />
            <span className="text-white font-semibold text-lg">EMERGENCY MODE</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-red-100 text-sm">ACTIVE</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-800">Safe Map</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{t.contacts}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <HelpCircle className="h-4 w-4" />
            <span>{t.help}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>{t.settings}</span>
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          {/* Language Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                language === 'en' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                language === 'hi' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              हिं
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
