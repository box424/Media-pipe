# 📊 Media Pipe Emotion Recognition Application

A pure frontend web application for real-time facial emotion recognition using face-api.js with voice feedback support.

## 🎯 Features

- ✅ **Real-time Emotion Recognition** - AI-powered detection of 7 basic emotions
  - 😊 Happy
  - 😢 Sad
  - 😠 Angry
  - 😲 Surprised
  - 😨 Fearful
  - 🤮 Disgusted
  - 😐 Neutral

- 🎤 **Voice Feedback** - Contextual voice responses based on detected emotions (Traditional Chinese)

- 📹 **Camera Integration** - Direct browser camera access for real-time processing

- 🎨 **Real-time Visualization** - Live display of facial detection and landmarks

- 📊 **Emotion History** - Track recently detected emotions

- ⚙️ **Flexible Settings** - Adjustable confidence threshold, voice toggle, detection visualization

## 🚀 Quick Start

### Method 1: Python HTTP Server
```bash
cd /workspaces/Media-pipe
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Method 2: Using Node.js
```bash
npm install -g http-server
http-server -p 8000
```

### Method 3: Using VS Code Live Server
1. Install [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click on `index.html` → "Open with Live Server"


## 📋 System Requirements

- Modern browser with WebRTC support
  - Chrome/Edge 60+
  - Firefox 60+
  - Safari 11+
  
- Camera and microphone hardware
- HTTPS connection (or localhost exemption)

## 🎮 Usage Guide


1. **Start Application** - Click "開啟相機" (Open Camera) button
2. **Grant Permissions** - Allow browser to access camera/microphone
3. **Face the Camera** - Express natural emotions toward the camera
4. **Real-time Feedback**:
   - Displays recognized emotion and confidence score
   - Plays corresponding voice response
   - Records emotion to history

## ⚙️ Settings

| Option | Description |
|--------|-------------|
| Enable Voice Feedback | Toggle voice response feature |
| Show Detection Box | Toggle facial detection visualization |
| Confidence Threshold | Adjust emotion recognition accuracy (0.3-0.9) |

## 🔧 Technical Stack

- **Frontend** - HTML5 + CSS3 + JavaScript ES6
- **Emotion Recognition** - [face-api.js](https://github.com/vladmandic/face-api)
  - TinyFaceDetector (fast face detection)
  - FaceLandmark68Net (keypoint detection)
  - FaceExpressionNet (emotion classification)
- **Voice Synthesis** - Web Speech API
- **Video Processing** - WebRTC MediaStream

## 🐛 Troubleshooting

### Camera not accessible?
- Check browser camera permissions
- Ensure HTTPS (or localhost)
- Verify firewall settings

### Inaccurate emotion detection?
- Ensure sufficient lighting
- Adjust confidence threshold
- Maintain stable head position
- Ensure full face visibility

### No voice feedback?
- Check browser volume settings
- Verify "Enable Voice Feedback" is checked
- Check system volume
- Some browser/language combinations may have limitations

## 📂 Project Structure

```
Media-pipe/
├── index.html          # Main HTML page
├── styles.css          # Stylesheet
├── app.js              # Application logic
├── run.sh              # Linux/Mac launcher
├── run.bat             # Windows launcher
├── README.md           # English documentation
└── README_CN.md        # Chinese documentation
```

## 🔐 Privacy

- Complete client-side processing
- No data uploaded to servers
- Camera stream used only locally

## 📄 License

Open source - free to use and modify

## 🙏 Credits

- [face-api.js](https://github.com/vladmandic/face-api) - Face detection and emotion recognition
- [TensorFlow.js](https://www.tensorflow.org/js) - Machine learning framework

---

**Tip:** For best results, use in well-lit environments with good camera quality.
