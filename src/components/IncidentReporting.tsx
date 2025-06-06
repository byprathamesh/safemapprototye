
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Camera, FileText, Send, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IncidentReportingProps {
  language: string;
  userLocation: {lat: number, lng: number} | null;
}

const IncidentReporting = ({ language, userLocation }: IncidentReportingProps) => {
  const [selectedIncidentType, setSelectedIncidentType] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const { toast } = useToast();

  const translations = {
    en: {
      title: "Report Incident",
      selectType: "Select incident type",
      description: "Description (optional)",
      anonymous: "Report anonymously",
      submit: "Submit Report",
      addPhoto: "Add Photo",
      location: "Include location",
      reportSubmitted: "Incident reported successfully",
      thankYou: "Thank you for helping make our community safer"
    },
    hi: {
      title: "घटना की रिपोर्ट करें",
      selectType: "घटना का प्रकार चुनें",
      description: "विवरण (वैकल्पिक)",
      anonymous: "गुमनाम रूप से रिपोर्ट करें",
      submit: "रिपोर्ट सबमिट करें",
      addPhoto: "फोटो जोड़ें",
      location: "स्थान शामिल करें",
      reportSubmitted: "घटना की रिपोर्ट सफलतापूर्वक दर्ज",
      thankYou: "हमारे समुदाय को सुरक्षित बनाने में मदद के लिए धन्यवाद"
    }
  };

  const t = translations[language as keyof typeof translations];

  const incidentTypes = [
    { id: 'harassment', label: 'Harassment / उत्पीड़न', icon: '⚠️', severity: 'high' },
    { id: 'stalking', label: 'Stalking / पीछा करना', icon: '👁️', severity: 'high' },
    { id: 'unsafe_area', label: 'Unsafe Area / असुरक्षित क्षेत्र', icon: '🚨', severity: 'medium' },
    { id: 'poor_lighting', label: 'Poor Lighting / खराब रोशनी', icon: '💡', severity: 'low' },
    { id: 'suspicious_activity', label: 'Suspicious Activity / संदिग्ध गतिविधि', icon: '🔍', severity: 'medium' },
    { id: 'other', label: 'Other / अन्य', icon: '📝', severity: 'medium' }
  ];

  const handleSubmit = () => {
    if (!selectedIncidentType) {
      toast({
        title: "Please select incident type",
        description: "Select the type of incident you want to report",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: t.reportSubmitted,
      description: t.thankYou,
      variant: "default"
    });

    // Reset form
    setSelectedIncidentType(null);
    setDescription('');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <span>{t.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Incident Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">{t.selectType}</label>
          <div className="grid grid-cols-2 gap-2">
            {incidentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedIncidentType(type.id)}
                className={`p-3 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                  selectedIncidentType === type.id 
                    ? getSeverityColor(type.severity) + ' border-opacity-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{type.icon}</span>
                  <span className="text-xs font-medium">{type.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">{t.description}</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide details about the incident..."
            className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
        </div>

        {/* Options */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">{t.anonymous}</label>
            <button
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnonymous ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnonymous ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {userLocation && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>{t.location}</span>
              </div>
              <span className="text-green-600">✓ Included</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm">
            <Camera className="h-4 w-4 mr-2" />
            {t.addPhoto}
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-orange-600 hover:bg-orange-700 text-white"
            size="sm"
          >
            <Send className="h-4 w-4 mr-2" />
            {t.submit}
          </Button>
        </div>

        {/* Quick Report Buttons */}
        <div className="border-t pt-4">
          <h4 className="text-xs font-medium text-gray-500 mb-2">Quick Reports</h4>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => {
                setSelectedIncidentType('poor_lighting');
                handleSubmit();
              }}
            >
              💡 Poor Lighting
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs"
              onClick={() => {
                setSelectedIncidentType('unsafe_area');
                handleSubmit();
              }}
            >
              🚨 Unsafe Area
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentReporting;
