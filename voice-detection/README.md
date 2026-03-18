# Voice Detection React Component

A React component that calls the [Voice Detection API](https://gopalgoyal12-voice-detection-api.hf.space/) to determine whether an audio clip is **AI-generated** and identify its **language**.

## Features

- 🔑 Secure API key input
- 🎵 Audio file upload (auto-detects format from file extension)
- 🌐 Language selection: Hindi, Tamil, Telugu, English, Malayalam
- 🎛️ Audio format selection: WAV, MP3, OGG, FLAC, M4A, WebM
- 📊 Displays AI-generated status and detected language with confidence score

## Usage

### 1. Drop `VoiceDetection.jsx` into your React project

```jsx
import VoiceDetection from "./VoiceDetection";

function App() {
  return <VoiceDetection />;
}
```

### 2. Install dependencies (none beyond React itself)

The component uses only React built-ins (`useState`, `useRef`) and the browser's native `FileReader` and `fetch` APIs — no extra packages required.

## API Contract

**Endpoint:** `POST https://gopalgoyal12-voice-detection-api.hf.space/detect`

**Request headers:**
```
Content-Type: application/json
X-API-Key: <your-api-key>
```

**Request body:**
```json
{
  "language": "hindi",
  "audioFormat": "wav",
  "audioBase64": "<base64-encoded-audio>"
}
```

**Response:**
```json
{
  "isAiGenerated": true,
  "detectedLanguage": "hindi",
  "confidence": 0.97
}
```

## Screenshot

> Run a React app that renders `<VoiceDetection />` to see the UI.
