
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

interface SafetyTipsProps {
  language: string;
}

const SafetyTips = ({ language }: SafetyTipsProps) => {
  const [currentTip, setCurrentTip] = useState(0);

  const safetyTips = {
    en: [
      {
        title: "Trust Your Instincts",
        content: "If something feels wrong, it probably is. Don't ignore your gut feelings about people or situations."
      },
      {
        title: "Stay Connected",
        content: "Keep your phone charged and share your location with trusted contacts when going out."
      },
      {
        title: "Know Your Surroundings", 
        content: "Be aware of exits, safe places, and people around you. Avoid isolated areas, especially at night."
      },
      {
        title: "Emergency Contacts",
        content: "Keep emergency numbers easily accessible. Know local police stations and hospitals near you."
      },
      {
        title: "Travel Smart",
        content: "Use well-lit, busy routes. Avoid shortcuts through empty areas. Travel with others when possible."
      }
    ],
    hi: [
      {
        title: "अपनी सहज प्रवृत्ति पर भरोसा करें",
        content: "यदि कुछ गलत लगता है, तो शायद वो गलत ही है। लोगों या स्थितियों के बारे में अपनी भावनाओं को नजरअंदाज न करें।"
      },
      {
        title: "जुड़े रहें",
        content: "अपना फोन चार्ज रखें और बाहर जाते समय विश्वसनीय संपर्कों के साथ अपना स्थान साझा करें।"
      },
      {
        title: "अपने आसपास को जानें",
        content: "निकास, सुरक्षित स्थानों और अपने आसपास के लोगों के बारे में जागरूक रहें। विशेष रूप से रात में अकेले क्षेत्रों से बचें।"
      },
      {
        title: "आपातकालीन संपर्क",
        content: "आपातकालीन नंबर आसानी से उपलब्ध रखें। अपने पास के स्थानीय पुलिस स्टेशन और अस्पताल जानें।"
      },
      {
        title: "स्मार्ट यात्रा करें",
        content: "अच्छी रोशनी वाले, व्यस्त रास्तों का उपयोग करें। खाली क्षेत्रों से होकर शॉर्टकट से बचें। जब संभव हो तो दूसरों के साथ यात्रा करें।"
      }
    ]
  };

  const tips = safetyTips[language as keyof typeof safetyTips];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [tips.length]);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const translations = {
    en: { title: "Safety Tips" },
    hi: { title: "सुरक्षा सुझाव" }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <span>{t.title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <div className="text-center space-y-3">
            <h4 className="font-semibold text-lg text-gray-800">
              {tips[currentTip].title}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {tips[currentTip].content}
            </p>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevTip}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex space-x-1">
              {tips.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentTip ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={nextTip}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SafetyTips;
