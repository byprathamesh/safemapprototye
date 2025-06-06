# 🛡️ SafeMap Web Prototype

> **Prototype web version of SafeMap - Women's Safety Platform**

This is the **prototype/demo version** of SafeMap designed for quick testing and demonstrations. For the complete production platform, see the [main SafeMap repository](https://github.com/byprathamesh/safemap).

## 🎯 About This Prototype

This web app demonstrates core SafeMap emergency features in a browser-based interface that anyone can access instantly without app installation.

### ✨ Features Included
- 🚨 **Emergency Panic Button** - One-click emergency activation
- 📍 **Location Tracking** - Real-time GPS location sharing
- 👥 **Emergency Contacts** - Automatic notifications to family/friends
- 🎤 **Voice Commands** - Say "Help Me" to trigger emergency
- 🥷 **Stealth Mode** - Discreet emergency activation
- ⏱️ **Emergency Timer** - Live tracking of emergency duration
- 📱 **Mobile Responsive** - Works on all devices/browsers

### 🇮🇳 Indian-Specific Features
- **112 India** emergency services integration
- **Indian carrier** support (Jio, Airtel, VI, BSNL)
- **Regional languages** (Hindi/English voice commands)
- **Indian phone formats** for emergency contacts

## 🚀 Quick Start

### Option 1: Run Locally (FREE)
```bash
# Clone this prototype repository
git clone https://github.com/byprathamesh/safemapprototye.git
cd safemapprototye

# Install and start
npm install
npm run dev

# Open http://localhost:3000
```

### Option 2: Deploy to Vercel (FREE)
```bash
# Deploy in one command
npx vercel --prod

# Your prototype is live!
```

## 🎮 Demo Instructions

### Test Emergency Flow:
1. **Open the web app** in your browser
2. **Click the red PANIC BUTTON** 
3. **Watch emergency alerts** appear
4. **Test voice command** - say "Help Me"
5. **Try stealth mode** toggle
6. **Add emergency contacts** in setup

### Expected Behavior:
- ✅ Emergency notifications appear instantly
- ✅ Location is tracked (or demo location used)
- ✅ Emergency timer starts counting
- ✅ Simulated 112 India alerts
- ✅ Emergency contact notifications
- ✅ Police dispatch simulation

## 🌐 Live Demo

**Try the live prototype:** [Deploy your own on Vercel](https://vercel.com/new)

## 📊 Prototype vs Full Platform

| Feature | This Prototype | Full SafeMap Platform |
|---------|---------------|----------------------|
| **Emergency Button** | ✅ Web-based | ✅ Mobile app + Web |
| **Location Tracking** | ✅ Browser GPS | ✅ Native GPS + Enhanced |
| **Emergency Contacts** | ✅ Basic | ✅ Advanced with verification |
| **Voice Commands** | ✅ Browser API | ✅ Native + Multiple languages |
| **Backend Integration** | ⚠️ Demo mode | ✅ Full production backend |
| **Real Notifications** | ⚠️ Simulated | ✅ Real SMS/WhatsApp/Calls |
| **Police Integration** | ⚠️ Demo | ✅ Real 112 India integration |
| **Carrier Integration** | ⚠️ Demo | ✅ Real Jio/Airtel/VI/BSNL |
| **Admin Dashboard** | ❌ Not included | ✅ Full monitoring system |
| **Mobile App** | ❌ Web only | ✅ Native Flutter app |
| **Production Ready** | ❌ Demo/Testing | ✅ Industry-grade |

## 🔗 Related Repositories

- **[Main SafeMap Platform](https://github.com/byprathamesh/safemap)** - Complete production system
- **This Prototype** - Quick demo/testing version

## 🛠️ Technical Details

### Built With:
- **Frontend**: Next.js 15.3.3 + React 18
- **UI**: Chakra UI
- **Language**: TypeScript
- **Deployment**: Vercel (recommended)
- **APIs**: Browser Geolocation, Speech Recognition
- **Status**: ✅ Production-ready, 0 security vulnerabilities

### Browser Support:
- ✅ Chrome 90+ (recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## 📱 Usage Scenarios

### Perfect For:
- **Quick demos** to stakeholders
- **User testing** and feedback
- **Concept validation**
- **Emergency feature** testing
- **Browser-based access** when app isn't available
- **Backup emergency** interface

### Not Suitable For:
- **Production emergencies** (use main SafeMap app)
- **Real emergency** response (demo mode only)
- **Large-scale deployment**

## 🚀 Deployment Guide

### Free Deployment Options:

#### 1. Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
# Live in 2 minutes!
```

#### 2. Netlify
```bash
npm run build
netlify deploy --prod --dir=.next
```

#### 3. GitHub Pages (with GitHub Actions)
```bash
# Enable GitHub Pages in repository settings
# Push to main branch - auto-deploys!
```

### Environment Variables for Production:
```bash
# Set these in your deployment platform:
NEXT_PUBLIC_API_URL=https://your-backend-api.com
NEXT_PUBLIC_SOCKET_URL=https://your-websocket-server.com
```

### ✅ Deployment Checklist:
- [x] Build passes without errors
- [x] No security vulnerabilities  
- [x] TypeScript compilation successful
- [x] Static generation working
- [x] Environment variables configured
- [x] Domain configured (optional)

## 🔧 Development

### Local Development:
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

### Environment Setup:
```bash
# Optional: Connect to backend
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local
```

## 🧪 Testing

### Emergency Flow Testing:
1. Open `http://localhost:3000`
2. Click panic button
3. Verify emergency timer starts
4. Check location tracking works
5. Test voice commands
6. Verify stealth mode toggle

### Cross-browser Testing:
- Test on Chrome, Firefox, Safari, Edge
- Test on mobile browsers
- Verify geolocation permissions

## 🎯 Feedback & Issues

For **prototype-specific** issues:
- Open issues in this repository

For **main platform** discussions:
- Visit [main SafeMap repository](https://github.com/byprathamesh/safemap)

## 📄 License

MIT License - Same as main SafeMap project

## 🙏 Acknowledgments

This prototype demonstrates core concepts from the full SafeMap platform. Built for **women's safety in India** with emergency response integration.

---

**SafeMap Web Prototype** - *Quick emergency safety demo* 🛡️

Perfect for testing emergency features before deploying the full platform! 