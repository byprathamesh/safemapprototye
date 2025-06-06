
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, MapPin, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SafetyCheckinProps {
  language: string;
  userLocation: {lat: number, lng: number} | null;
}

const SafetyCheckin = ({ language, userLocation }: SafetyCheckinProps) => {
  const [lastCheckin, setLastCheckin] = useState<Date | null>(null);
  const [autoCheckinEnabled, setAutoCheckinEnabled] = useState(true);
  const [checkinInterval, setCheckinInterval] = useState(30); // minutes
  const { toast } = useToast();

  const translations = {
    en: {
      title: "Safety Check-in",
      checkinNow: "I'm Safe",
      autoCheckin: "Auto Check-in",
      lastCheckin: "Last check-in",
      nextCheckin: "Next auto check-in in",
      locationShared: "Location shared with contacts",
      safetyConfirmed: "Safety status confirmed"
    },
    hi: {
      title: "सुरक्षा चेक-इन",
      checkinNow: "मैं सुरक्षित हूं",
      autoCheckin: "ऑटो चेक-इन",
      lastCheckin: "अंतिम चेक-इन",
      nextCheckin: "अगला ऑटो चेक-इन",
      locationShared: "संपर्कों के साथ स्थान साझा किया गया",
      safetyConfirmed: "सुरक्षा स्थिति की पुष्टि"
    }
  };

  const t = translations[language as keyof typeof translations];

  const [timeUntilNext, setTimeUntilNext] = useState(checkinInterval * 60);

  useEffect(() => {
    if (autoCheckinEnabled && lastCheckin) {
      const interval = setInterval(() => {
        const now = new Date();
        const nextCheckinTime = new Date(lastCheckin.getTime() + checkinInterval * 60 * 1000);
        const timeDiff = Math.max(0, Math.floor((nextCheckinTime.getTime() - now.getTime()) / 1000));
        
        setTimeUntilNext(timeDiff);
        
        if (timeDiff === 0) {
          handleAutoCheckin();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lastCheckin, autoCheckinEnabled, checkinInterval]);

  const handleManualCheckin = () => {
    const now = new Date();
    setLastCheckin(now);
    setTimeUntilNext(checkinInterval * 60);
    
    toast({
      title: t.safetyConfirmed,
      description: t.locationShared,
      variant: "default"
    });
  };

  const handleAutoCheckin = () => {
    const now = new Date();
    setLastCheckin(now);
    setTimeUntilNext(checkinInterval * 60);
    
    toast({
      title: "Auto Check-in Completed",
      description: "Your safety status has been automatically updated",
      variant: "default"
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span>{t.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Manual Check-in Button */}
        <Button
          onClick={handleManualCheckin}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {t.checkinNow}
        </Button>

        {/* Auto Check-in Settings */}
        <div className="bg-white rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium">{t.autoCheckin}</label>
            <button
              onClick={() => setAutoCheckinEnabled(!autoCheckinEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoCheckinEnabled ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoCheckinEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {autoCheckinEnabled && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600">Check-in interval (minutes)</label>
                <select
                  value={checkinInterval}
                  onChange={(e) => setCheckinInterval(Number(e.target.value))}
                  className="mt-1 block w-full text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Status Display */}
        <div className="space-y-3">
          {lastCheckin && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t.lastCheckin}:</span>
              <span className="font-medium">
                {lastCheckin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}
          
          {autoCheckinEnabled && timeUntilNext > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t.nextCheckin}:</span>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3 text-blue-500" />
                <span className="font-medium text-blue-600">{formatTime(timeUntilNext)}</span>
              </div>
            </div>
          )}
          
          {userLocation && (
            <div className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 p-2 rounded">
              <MapPin className="h-3 w-3" />
              <span>
                Location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="border-t pt-3">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              <Send className="h-3 w-3 mr-1" />
              Share Status
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              History
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyCheckin;
