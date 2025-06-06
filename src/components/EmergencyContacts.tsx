
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Plus, Edit, Trash2, Heart, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmergencyContactsProps {
  isEmergencyMode: boolean;
  language: string;
}

const EmergencyContacts = ({ isEmergencyMode, language }: EmergencyContactsProps) => {
  const [contacts, setContacts] = useState([
    { id: 1, name: "Mom", phone: "+91-98765-43210", relationship: "Mother", status: "verified" },
    { id: 2, name: "Sister", phone: "+91-87654-32109", relationship: "Sister", status: "verified" },
    { id: 3, name: "Best Friend", phone: "+91-76543-21098", relationship: "Friend", status: "pending" },
    { id: 4, name: "Local Police", phone: "100", relationship: "Authority", status: "verified" },
    { id: 5, name: "Women Helpline", phone: "1091", relationship: "Helpline", status: "verified" }
  ]);
  
  const { toast } = useToast();

  const translations = {
    en: {
      title: "Emergency Contacts",
      addContact: "Add Contact",
      callAll: "Call All Contacts",
      sendAlert: "Send Alert to All",
      verified: "Verified",
      pending: "Pending",
      calling: "Calling emergency contacts...",
      alertSent: "Emergency alert sent to all contacts"
    },
    hi: {
      title: "आपातकालीन संपर्क",
      addContact: "संपर्क जोड़ें",
      callAll: "सभी को कॉल करें",
      sendAlert: "सभी को अलर्ट भेजें",
      verified: "सत्यापित",
      pending: "लंबित",
      calling: "आपातकालीन संपर्कों को कॉल कर रहे हैं...",
      alertSent: "सभी संपर्कों को आपातकालीन अलर्ट भेजा गया"
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleEmergencyCall = (contactId: number) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      toast({
        title: "Calling Emergency Contact",
        description: `Calling ${contact.name} at ${contact.phone}`,
        variant: "destructive"
      });
      // In production: window.location.href = `tel:${contact.phone}`;
    }
  };

  const handleCallAll = () => {
    toast({
      title: t.calling,
      description: "Initiating calls to all emergency contacts",
      variant: "destructive"
    });
    // In production: Call all contacts sequentially
  };

  const handleSendAlert = () => {
    toast({
      title: t.alertSent,
      description: "SMS and app notifications sent",
      variant: "default"
    });
  };

  const getContactIcon = (relationship: string) => {
    switch (relationship.toLowerCase()) {
      case 'mother':
      case 'father':
      case 'family':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'authority':
      case 'police':
        return <Phone className="h-4 w-4 text-blue-500" />;
      default:
        return <Users className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Card className={`${isEmergencyMode ? 'border-red-500 bg-red-50' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>{t.title}</span>
          </div>
          {!isEmergencyMode && (
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              {t.addContact}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Emergency Action Buttons */}
        {isEmergencyMode && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Button onClick={handleCallAll} variant="destructive" size="sm">
              <Phone className="h-4 w-4 mr-1" />
              {t.callAll}
            </Button>
            <Button onClick={handleSendAlert} variant="outline" size="sm">
              {t.sendAlert}
            </Button>
          </div>
        )}

        {/* Contacts List */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                isEmergencyMode 
                  ? 'bg-red-100 border-red-200 hover:bg-red-200' 
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                    contact.relationship === 'Authority' ? 'bg-blue-500' :
                    contact.relationship === 'Mother' ? 'bg-pink-500' :
                    contact.relationship === 'Friend' ? 'bg-green-500' : 'bg-purple-500'
                  }`}>
                    {contact.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1">
                    {getContactIcon(contact.relationship)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">{contact.name}</p>
                  <p className="text-xs text-gray-500">{contact.phone}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-400">{contact.relationship}</span>
                    <div className={`h-2 w-2 rounded-full ${
                      contact.status === 'verified' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}></div>
                    <span className={`text-xs ${
                      contact.status === 'verified' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {contact.status === 'verified' ? t.verified : t.pending}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {isEmergencyMode ? (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleEmergencyCall(contact.id)}
                  >
                    <Phone className="h-3 w-3" />
                  </Button>
                ) : (
                  <>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Add Government Numbers */}
        {!isEmergencyMode && (
          <div className="border-t pt-4">
            <h4 className="text-xs font-medium text-gray-500 mb-2">Quick Add India Emergency Numbers</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                + Police (100)
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                + Women (1091)
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyContacts;
