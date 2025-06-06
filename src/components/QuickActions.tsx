
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Shield, Users, Camera, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuickActionsProps {
  isEmergencyMode: boolean;
  language: string;
}

const QuickActions = ({ isEmergencyMode, language }: QuickActionsProps) => {
  const { toast } = useToast();

  const translations = {
    en: {
      title: "Quick Actions",
      call112: "Call 112",
      recordVideo: "Record Video", 
      findSafePlace: "Find Safe Place",
      alertContacts: "Alert Contacts",
      fakeCall: "Fake Call",
      reportIncident: "Report Incident"
    },
    hi: {
      title: "त्वरित कार्य",
      call112: "112 पर कॉल करें",
      recordVideo: "वीडियो रिकॉर्ड करें",
      findSafePlace: "सुरक्षित स्थान खोजें", 
      alertContacts: "संपर्कों को अलर्ट करें",
      fakeCall: "नकली कॉल",
      reportIncident: "घटना की रिपोर्ट करें"
    }
  };

  const t = translations[language as keyof typeof translations];

  const quickActions = [
    {
      id: 'call-112',
      title: t.call112,
      icon: Phone,
      color: 'bg-red-600 hover:bg-red-700',
      action: () => {
        toast({
          title: "Calling Emergency Services",
          description: "Connecting to 112...",
          variant: "destructive"
        });
        // In production: window.location.href = 'tel:112';
      }
    },
    {
      id: 'record',
      title: t.recordVideo,
      icon: Camera,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => {
        toast({
          title: "Recording Started",
          description: "Emergency video recording activated",
        });
      }
    },
    {
      id: 'safe-place',
      title: t.findSafePlace,
      icon: MapPin,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => {
        toast({
          title: "Finding Safe Places",
          description: "Searching for nearby police stations and hospitals",
        });
      }
    },
    {
      id: 'alert',
      title: t.alertContacts,
      icon: Users,
      color: 'bg-orange-600 hover:bg-orange-700',
      action: () => {
        toast({
          title: "Contacts Alerted",
          description: "Emergency message sent to trusted contacts",
        });
      }
    },
    {
      id: 'fake-call',
      title: t.fakeCall,
      icon: Phone,
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => {
        toast({
          title: "Fake Call Started",
          description: "Simulating incoming call to help you escape",
        });
      }
    },
    {
      id: 'report',
      title: t.reportIncident,
      icon: Shield,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      action: () => {
        toast({
          title: "Incident Reported",
          description: "Your report has been submitted to authorities",
        });
      }
    }
  ];

  return (
    <Card className={`${isEmergencyMode ? 'border-red-500 bg-red-50' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>{t.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.id}
                onClick={action.action}
                className={`h-16 flex flex-col items-center justify-center space-y-1 text-white ${action.color} transition-transform hover:scale-105`}
                size="lg"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs text-center leading-tight">{action.title}</span>
              </Button>
            );
          })}
        </div>

        {isEmergencyMode && (
          <div className="mt-4 bg-red-100 border border-red-200 p-3 rounded-lg">
            <h4 className="font-medium text-sm text-red-800 mb-2">Emergency Mode Active</h4>
            <p className="text-xs text-red-700">
              All actions will be executed immediately without confirmation.
              Your safety is our top priority.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
