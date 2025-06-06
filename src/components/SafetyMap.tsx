
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SafetyMapProps {
  userLocation: {lat: number, lng: number} | null;
  isEmergencyMode: boolean;
}

const SafetyMap = ({ userLocation, isEmergencyMode }: SafetyMapProps) => {
  const [safeZones, setSafeZones] = useState([
    { id: 1, name: "Central Police Station", lat: 28.6139, lng: 77.2090, type: "police", risk: "safe" },
    { id: 2, name: "District Hospital", lat: 28.6129, lng: 77.2295, type: "hospital", risk: "safe" },
    { id: 3, name: "Women's Helpline Center", lat: 28.6169, lng: 77.2025, type: "support", risk: "safe" },
    { id: 4, name: "Shopping Complex", lat: 28.6189, lng: 77.2156, type: "public", risk: "moderate" },
    { id: 5, name: "Isolated Park Area", lat: 28.6099, lng: 77.2356, type: "caution", risk: "high" }
  ]);

  const [selectedZone, setSelectedZone] = useState<number | null>(null);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'safe': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getZoneIcon = (type: string) => {
    switch (type) {
      case 'police':
      case 'hospital':
      case 'support':
        return <Shield className="h-4 w-4" />;
      case 'caution':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`${isEmergencyMode ? 'border-red-500 bg-red-50' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>Safety Map</span>
          {isEmergencyMode && (
            <span className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded-full">
              EMERGENCY
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Map Placeholder - In production, integrate with Google Maps/MapmyIndia */}
        <div className="relative bg-gray-100 rounded-lg h-64 mb-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
            {/* Simulated map with safety zones */}
            <div className="absolute inset-4 space-y-2">
              {userLocation && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="h-4 w-4 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                    <div className="absolute -top-1 -left-1 h-6 w-6 bg-blue-400 rounded-full animate-ping opacity-75"></div>
                    <span className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-white px-2 py-1 rounded shadow">
                      You
                    </span>
                  </div>
                </div>
              )}
              
              {/* Safety zones indicators */}
              {safeZones.map((zone, index) => (
                <div
                  key={zone.id}
                  className={`absolute cursor-pointer transform transition-transform hover:scale-110`}
                  style={{
                    top: `${20 + (index * 15)}%`,
                    left: `${25 + (index * 12)}%`
                  }}
                  onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
                >
                  <div className={`h-3 w-3 rounded-full border-2 border-white shadow-lg ${
                    zone.risk === 'safe' ? 'bg-green-500' :
                    zone.risk === 'moderate' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
          
          {isEmergencyMode && (
            <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
              Live Tracking Active
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span>Safe Zone</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
            <span>Moderate Risk</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 bg-red-500 rounded-full"></div>
            <span>High Risk</span>
          </div>
        </div>

        {/* Safety Zones List */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Nearby Safety Points</h4>
          {safeZones.slice(0, 3).map((zone) => (
            <div
              key={zone.id}
              className={`flex items-center justify-between p-2 rounded-lg border transition-colors cursor-pointer ${
                selectedZone === zone.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
            >
              <div className="flex items-center space-x-2">
                <div className={`p-1 rounded ${getRiskColor(zone.risk)}`}>
                  {getZoneIcon(zone.type)}
                </div>
                <div>
                  <p className="text-sm font-medium">{zone.name}</p>
                  <p className="text-xs text-gray-500">0.5 km away</p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                Navigate
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyMap;
