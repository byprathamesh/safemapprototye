
# Safe Map - Women's Safety App

Safe Map is an industry-grade, India-focused women's safety mobile application with comprehensive emergency features, live location sharing, and safety heatmaps.

## 🚨 Core Features

### Emergency Activation (Multi-Modal)
- **Emergency Dial Trigger**: Dial *555# or 112 to trigger emergency mode
- **Voice Command**: Detects "I need help" or "मुझे मदद चाहिए" 
- **Panic Button**: Prominent in-app button with haptic feedback
- **Secret Gesture**: Triple-press power button or rapid shake activation
- **Hotkey Support**: Ctrl+Shift+E for desktop emergency activation

### Live Location & Evidence Streaming
- Auto-share live location with trusted contacts
- Continuous audio/video recording with timestamp and GPS
- Multi-channel alerts: SMS, WhatsApp, push notifications
- Blockchain-based evidence storage (planned)
- Stealth mode with disguised UI during emergencies

### Dynamic Safety Heatmaps
- Visual risk zones based on lighting and crowd density
- Route safety scoring with safest path suggestions
- Geofencing with auto-alerts for danger zones
- Real-time safety data integration

### Privacy & Security
- End-to-end encryption for sensitive data
- GDPR and Indian IT Act compliance
- User consent management
- Data minimization principles

### Multilingual Support
- Hindi and English (with more Indian languages planned)
- Voice prompts and commands in supported languages
- Accessible design with large buttons and voice feedback

## 🛠️ Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **State Management**: React hooks and context
- **Routing**: React Router
- **Notifications**: React Hot Toast
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd safe-map
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## 📱 Usage

### Emergency Activation
- **Panic Button**: Click and hold the large red emergency button
- **Keyboard Shortcut**: Press Ctrl+Shift+E for instant activation
- **Voice Command**: Say "I need help" (feature planned)

### Location Sharing
- Enable location sharing to send your coordinates to trusted contacts
- View live location status and sharing controls
- Manage trusted contacts list

### Safety Map
- View color-coded safety zones around your location
- Green: Safe zones (police stations, hospitals)
- Yellow: Moderate risk areas
- Red: High risk areas to avoid

### Quick Actions
- Call 112 emergency services
- Record video evidence
- Find nearby safe places
- Alert trusted contacts
- Activate fake call feature
- Report incidents

### Admin Dashboard
- Access at `/admin` route
- Monitor active incidents in real-time
- View incident statistics and response times
- Manage emergency responses

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_MAPS_API_KEY=your_maps_api_key
VITE_SMS_API_KEY=your_sms_api_key
VITE_EMERGENCY_NUMBER=112
```

### Indian Carrier Integration (Planned)
- Jio, Airtel, VI, BSNL API integration
- USSD and SMS fallback for low connectivity
- Feature phone support

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── EmergencyButton.tsx
│   ├── SafetyMap.tsx
│   ├── LocationSharing.tsx
│   ├── QuickActions.tsx
│   ├── SafetyTips.tsx
│   ├── Navigation.tsx
│   └── AdminDashboard.tsx
├── pages/              # Page components
│   ├── Index.tsx
│   └── NotFound.tsx
├── hooks/              # Custom React hooks
├── lib/               # Utility functions
└── App.tsx           # Main application component
```

## 🔒 Security Features

- **Privacy-First Design**: Minimal data collection
- **Secure Storage**: Encrypted local storage for sensitive data
- **Consent Management**: Clear opt-in for all data sharing
- **Emergency Mode**: Stealth UI and hidden functionality

## 🌐 Localization

Currently supported languages:
- English (en)
- Hindi (hi)

Additional Indian languages planned:
- Marathi, Tamil, Telugu, Bengali, Kannada, Malayalam, Punjabi, Gujarati

## 📊 Analytics & Monitoring

- Real-time incident tracking
- Response time monitoring  
- Safety heatmap analytics
- User engagement metrics

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
```bash
# Build and deploy
npm run build
# Follow platform-specific deployment instructions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Emergency Contacts

- **India Emergency Services**: 112
- **Women's Helpline**: 1091
- **National Commission for Women**: 011-26942369

## 📞 Support

For technical support or feature requests, please contact:
- Email: support@safemap.in
- Phone: +91-11-2694-2369

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Basic emergency features
- ✅ Location sharing
- ✅ Safety map visualization
- ✅ Admin dashboard

### Phase 2 (Planned)
- 🔄 Voice command integration
- 🔄 Real carrier API integration
- 🔄 Advanced AI features
- 🔄 Wearable device support

### Phase 3 (Future)
- 📋 Blockchain evidence storage
- 📋 ML-based threat detection
- 📋 Community reporting features
- 📋 Government API integration

---

**Safe Map - Your Safety, Our Priority** 🛡️
```
