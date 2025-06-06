
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Shield, AlertTriangle, Navigation, Zap, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SafetyMapProps {
  userLocation: {lat: number, lng: number} | null;
  isEmergencyMode: boolean;
}

const SafetyMap = ({ userLocation, isEmergencyMode }: SafetyMapProps) => {
  const [safeZones, setSafeZones] = useState([
    { 
      id: 1, 
      name: "Central Police Station", 
      lat: 28.6139, 
      lng: 77.2090, 
      type: "police", 
      risk: "safe",
      distance: "0.2 km",
      response_time: "2 min",
      available_24_7: true
    },
    { 
      id: 2, 
      name: "District Hospital", 
      lat: 28.6129, 
      lng: 77.2295, 
      type: "hospital", 
      risk: "safe",
      distance: "0.4 km",
      response_time: "3 min",
      available_24_7: true
    },
    { 
      id: 3, 
      name: "Women's Helpline Center", 
      lat: 28.6169, 
      lng: 77.2025, 
      type: "support", 
      risk: "safe",
      distance: "0.3 km",
      response_time: "5 min",
      available_24_7: true
    },
    { 
      id: 4, 
      name: "Shopping Complex", 
      lat: 28.6189, 
      lng: 77.2156, 
      type: "public", 
      risk: "moderate",
      distance: "0.6 km",
      response_time: "N/A",
      available_24_7: false
    },
    { 
      id: 5, 
      name: "Isolated Park Area", 
      lat: 28.6099, 
      lng: 77.2356, 
      type: "caution", 
      risk: "high",
      distance: "0.8 km",
      response_time: "N/A",
      available_24_7: false
    }
  ]);

  const [selectedZone, setSelectedZone] = useState<number | null>(null);
  const [liveTracking, setLiveTracking] = useState(false);

  useEffect(() => {
    if (isEmergencyMode) {
      setLiveTracking(true);
    }
  }, [isEmergencyMode]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'safe': return 'text-green-600 bg-green-100 border-green-300';
      case 'moderate': return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'high': return 'text-red-600 bg-red-100 border-red-300';
      default: return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getZoneIcon = (type: string) => {
    switch (type) {
      case 'police':
        return <Shield className="h-4 w-4 text-blue-600" />;
      case 'hospital':
        return <Phone className="h-4 w-4 text-red-600" />;
      case 'support':
        return <Shield className="h-4 w-4 text-purple-600" />;
      case 'caution':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <MapPin className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleNavigate = (zone: typeof safeZones[0]) => {
    // In production: Integrate with Google Maps/Apple Maps
    const url = `https://www.google.com/maps/dir/?api=1&destination=${zone.lat},${zone.lng}`;
    window.open(url, '_blank');
  };

  return (
    <Card className={`${isEmergencyMode ? 'border-red-500 bg-red-50' : 'border-blue-200 bg-blue-50'} transition-all duration-300`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Live Safety Map</span>
          </div>
          <div className="flex items-center space-x-2">
            {liveTracking && (
              <div className="flex items-center space-x-1">
                <Zap className="h-4 w-4 text-blue-500 animate-pulse" />
                <span className="text-xs text-blue-600 font-medium">Live</span>
              </div>
            )}
            {isEmergencyMode && (
              <span className="ml-2 px-3 py-1 bg-red-600 text-white text-xs rounded-full font-bold animate-pulse">
                EMERGENCY TRACKING
              </span>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Enhanced Map Display */}
        <div className="relative bg-gradient-to-br from-blue-100 via-white to-green-100 rounded-xl h-80 mb-6 overflow-hidden border-2 border-gray-200">
          {/* Map Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 grid-rows-8 h-full">
              {Array.from({ length: 64 }).map((_, i) => (
                <div key={i} className="border border-gray-400"></div>
              ))}
            </div>
          </div>

          {/* User Location */}
          {userLocation && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className={`h-6 w-6 ${isEmergencyMode ? 'bg-red-600' : 'bg-blue-600'} rounded-full border-4 border-white shadow-lg z-10 relative`}>
                  <div className="absolute inset-1 bg-white rounded-full"></div>
                </div>
                <div className={`absolute -top-2 -left-2 h-10 w-10 ${isEmergencyMode ? 'bg-red-400' : 'bg-blue-400'} rounded-full animate-ping opacity-75`}></div>
                <div className={`absolute -top-4 -left-4 h-14 w-14 ${isEmergencyMode ? 'bg-red-300' : 'bg-blue-300'} rounded-full animate-pulse opacity-50`}></div>
                <span className="absolute top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold bg-white px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  {isEmergencyMode ? '🚨 YOU (EMERGENCY)' : '📍 You'}
                </span>
              </div>
            </div>
          )}
          
          {/* Safety Zones */}
          {safeZones.map((zone, index) => (
            <div
              key={zone.id}
              className={`absolute cursor-pointer transform transition-all hover:scale-110 z-20`}
              style={{
                top: `${15 + (index * 12)}%`,
                left: `${20 + (index * 15)}%`
              }}
              onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
            >
              <div className={`relative h-5 w-5 rounded-full border-3 border-white shadow-lg ${
                zone.risk === 'safe' ? 'bg-green-500' :
                zone.risk === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {zone.available_24_7 && (
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-500 rounded-full border border-white">
                    <div className="h-full w-full bg-white rounded-full animate-pulse opacity-80"></div>
                  </div>
                )}
              </div>
              
              {selectedZone === zone.id && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded-lg shadow-lg border z-30 min-w-32">
                  <div className="text-xs font-medium">{zone.name}</div>
                  <div className="text-xs text-gray-500">{zone.distance} • {zone.response_time}</div>
                </div>
              )}
            </div>
          ))}
          
          {/* Emergency Mode Overlay */}
          {isEmergencyMode && (
            <div className="absolute inset-0 bg-red-600 bg-opacity-10 flex items-center justify-center">
              <div className="bg-red-600 text-white px-6 py-3 rounded-full font-bold text-lg animate-pulse shadow-2xl">
                🚨 LIVE EMERGENCY TRACKING ACTIVE 🚨
              </div>
            </div>
          )}

          {/* Route Suggestion Line (if emergency) */}
          {isEmergencyMode && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.8"/>
                </linearGradient>
              </defs>
              <path 
                d="M 50% 50% Q 30% 30% 20% 15%" 
                stroke="url(#routeGradient)" 
                strokeWidth="4" 
                fill="none" 
                strokeDasharray="10,5"
                className="animate-pulse"
              />
            </svg>
          )}
        </div>

        {/* Enhanced Legend */}
        <div className="grid grid-cols-4 gap-3 mb-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 bg-green-500 rounded-full border border-white"></div>
            <span>Safe Zone</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 bg-yellow-500 rounded-full border border-white"></div>
            <span>Moderate</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 bg-red-500 rounded-full border border-white"></div>
            <span>High Risk</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
            <span>24/7</span>
          </div>
        </div>

        {/* Nearest Safe Places */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Nearest Safe Places</h4>
            {isEmergencyMode && (
              <Button size="sm" variant="destructive" className="text-xs">
                <Navigation className="h-3 w-3 mr-1" />
                Auto-Navigate to Nearest
              </Button>
            )}
          </div>
          
          {safeZones.filter(zone => zone.risk === 'safe').slice(0, isEmergencyMode ? 5 : 3).map((zone) => (
            <div
              key={zone.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                selectedZone === zone.id 
                  ? 'bg-blue-50 border-blue-200 shadow-md' 
                  : 'hover:bg-gray-50 border-gray-200'
              } ${isEmergencyMode ? 'border-red-200 bg-red-50' : ''}`}
              onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${getRiskColor(zone.risk)}`}>
                  {getZoneIcon(zone.type)}
                </div>
                <div>
                  <p className="text-sm font-medium">{zone.name}</p>
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span>📍 {zone.distance}</span>
                    <span>⏱️ {zone.response_time}</span>
                    {zone.available_24_7 && <span className="text-blue-600">🕒 24/7</span>}
                  </div>
                </div>
              </div>
              
              <Button 
                size="sm" 
                variant={isEmergencyMode ? "destructive" : "outline"} 
                className="text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate(zone);
                }}
              >
                <Navigation className="h-3 w-3 mr-1" />
                {isEmergencyMode ? 'GO NOW' : 'Navigate'}
              </Button>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              Share Location
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Report Unsafe Area
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyMap;
