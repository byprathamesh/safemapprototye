
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Share, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LocationSharingProps {
  userLocation: {lat: number, lng: number} | null;
  isEmergencyMode: boolean;
  language: string;
}

const LocationSharing = ({ userLocation, isEmergencyMode, language }: LocationSharingProps) => {
  const [isSharing, setIsSharing] = useState(false);
  const [trustedContacts] = useState([
    { id: 1, name: "Mom", phone: "+91-98765-43210", status: "online" },
    { id: 2, name: "Sister", phone: "+91-87654-32109", status: "online" },
    { id: 3, name: "Best Friend", phone: "+91-76543-21098", status: "offline" }
  ]);
  
  const { toast } = useToast();

  const translations = {
    en: {
      title: "Location Sharing",
      shareLocation: "Share Location",
      stopSharing: "Stop Sharing", 
      trustedContacts: "Trusted Contacts",
      emergency: "Emergency Contacts",
      locationShared: "Location shared successfully",
      emergencyAlert: "Emergency alert sent to all contacts"
    },
    hi: {
      title: "स्थान साझाकरण",
      shareLocation: "स्थान साझा करें",
      stopSharing: "साझाकरण बंद करें",
      trustedContacts: "विश्वसनीय संपर्क",
      emergency: "आपातकालीन संपर्क", 
      locationShared: "स्थान सफलतापूर्वक साझा किया गया",
      emergencyAlert: "सभी संपर्कों को आपातकालीन अलर्ट भेजा गया"
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleLocationShare = () => {
    if (isSharing) {
      setIsSharing(false);
      toast({
        title: "Sharing Stopped",
        description: "Location sharing has been turned off.",
      });
    } else {
      setIsSharing(true);
      toast({
        title: t.locationShared,
        description: "Your trusted contacts can now see your location.",
      });
    }
  };

  const handleEmergencyCall = (contactId: number) => {
    const contact = trustedContacts.find(c => c.id === contactId);
    if (contact) {
      toast({
        title: "Calling Emergency Contact",
        description: `Calling ${contact.name} at ${contact.phone}`,
        variant: "destructive"
      });
      // In production: window.location.href = `tel:${contact.phone}`;
    }
  };

  return (
    <Card className={`${isEmergencyMode ? 'border-red-500 bg-red-50' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>{isEmergencyMode ? t.emergency : t.title}</span>
          </div>
          {isSharing && (
            <div className="flex items-center space-x-1">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600">Live</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Location Status */}
        {userLocation && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium">Current Location</span>
            </div>
            <p className="text-xs text-gray-600">
              Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        )}

        {/* Share Button */}
        <Button
          onClick={handleLocationShare}
          className={`w-full ${isSharing ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
          size="lg"
        >
          <Share className="h-4 w-4 mr-2" />
          {isSharing ? t.stopSharing : t.shareLocation}
        </Button>

        {/* Trusted Contacts */}
        <div>
          <h4 className="font-medium text-sm mb-3 flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{t.trustedContacts}</span>
          </h4>
          <div className="space-y-2">
            {trustedContacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  isEmergencyMode ? 'bg-red-100 border-red-200' : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {contact.name.charAt(0)}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${
                      contact.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.phone}</p>
                  </div>
                </div>
                
                {isEmergencyMode && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleEmergencyCall(contact.id)}
                    className="text-xs"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Actions */}
        {isEmergencyMode && (
          <div className="bg-red-100 border border-red-200 p-3 rounded-lg">
            <h4 className="font-medium text-sm text-red-800 mb-2">Emergency Actions Active</h4>
            <ul className="text-xs text-red-700 space-y-1">
              <li>• Live location shared with all contacts</li>
              <li>• Emergency SMS sent automatically</li>
              <li>• Audio recording started</li>
              <li>• Authorities notified</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationSharing;
