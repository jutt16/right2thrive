# Text-to-Speech (TTS) Solutions Guide

Documentation and resources for the best text-to-speech options for web apps.

> **This project uses ElevenLabs.** See **[ELEVENLABS_SETUP_GUIDE.md](./ELEVENLABS_SETUP_GUIDE.md)** for setup instructions.

---

## Comparison at a Glance

| Solution | Cost | API Key | Quality | Offline | Best For |
|----------|------|---------|---------|---------|----------|
| **Web Speech API** | Free | No | Medium (OS-dependent) | Yes | Quick, zero-setup |
| **ElevenLabs** | Free tier + paid | Yes | Very High | No | Premium quality |
| **OpenAI TTS** | Paid | Yes | Very High | No | Realtime, instructions |
| **Kokoro-js** | Free | No | High | Yes (after model load) | Client-side, no server |
| **Puter.js** | Free | No | High | No | No-backend fallback |

---

## 1. Web Speech API (Browser Built-in)

**Best for:** Zero setup, offline, privacy, instant start.

### Documentation
- **MDN – SpeechSynthesis:** https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
- **MDN – Using the Web Speech API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
- **Can I Use:** https://caniuse.com/?search=SpeechSynthesis (~94% support)

### Quick Start
```javascript
const utterance = new SpeechSynthesisUtterance("Hello, world!");
utterance.rate = 1;   // Speed: 0.1–10
utterance.pitch = 1;  // Pitch: 0–2
utterance.volume = 1; // Volume: 0–1
utterance.lang = "en-GB";
speechSynthesis.speak(utterance);
```

### Notes
- Chrome loads voices lazily: use `voiceschanged` before speaking.
- Quality depends on OS and installed voices.
- No API key, fully local.

---

## 2. ElevenLabs

**Best for:** Highest-quality voices, emotional range, many languages.

### Documentation
- **Text to Speech:** https://elevenlabs.io/docs/capabilities/text-to-speech
- **Create Speech API:** https://elevenlabs.io/docs/api-reference/text-to-speech/convert
- **Streaming:** https://elevenlabs.io/docs/cookbooks/text-to-speech/streaming
- **Pricing:** https://elevenlabs.io/pricing

### Free Tier
- 10,000 credits/month
- ~10–20 minutes of audio
- 128 kbps on free plan
- Non-commercial only with attribution

### API Example
```javascript
// Requires server-side (API key must stay secret)
const response = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
  {
    method: "POST",
    headers: {
      "Accept": "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({ text: "Your text here" }),
  }
);
const audioBuffer = await response.arrayBuffer();
```

---

## 3. OpenAI TTS

**Best for:** Realtime streaming, tone/instruction control, low latency.

### Documentation
- **Text to Speech Guide:** https://developers.openai.com/api/docs/guides/text-to-speech
- **API Reference:** https://platform.openai.com/docs/api-reference/audio/createSpeech
- **Pricing:** https://openai.com/pricing

### Models
- `gpt-4o-mini-tts` – recommended for realtime
- `tts-1` – lower latency
- `tts-1-hd` – higher quality

### Quick Start (Node.js)
```javascript
import OpenAI from "openai";
const openai = new OpenAI();
const mp3 = await openai.audio.speech.create({
  model: "gpt-4o-mini-tts",
  voice: "coral",
  input: "Your text here",
  instructions: "Speak clearly and calmly.",
});
// Stream or return buffer
```

---

## 4. Kokoro-js (Client-side Neural TTS)

**Best for:** High-quality, fully client-side, no API keys or backend.

### Documentation
- **NPM:** https://www.npmjs.com/package/kokoro-js
- **GitHub:** https://github.com/hexgrad/kokoro
- **Hugging Face Demo:** https://huggingface.co/spaces/webml-community/kokoro-webgpu

### Installation
```bash
npm i kokoro-js
```

### Usage
```javascript
import { KokoroTTS } from "kokoro-js";

const tts = await KokoroTTS.from_pretrained(
  "onnx-community/Kokoro-82M-v1.0-ONNX",
  { dtype: "q8", device: "wasm" }  // or "webgpu"
);
const audio = await tts.generate("Your text here", { voice: "af_heart" });
audio.save("audio.wav");
```

### Notes
- ~82MB model download on first use
- WebGPU or WASM (Chrome 120+ recommended)
- 100+ voices (US/UK English, etc.)

---

## 5. Puter.js (Free API, No Key)

**Best for:** Fallback when Web Speech fails, no backend, no sign-up.

### Documentation
- **TTS API:** https://developer.puter.com/text-to-speech/
- **Tutorial:** https://developer.puter.com/tutorials/free-unlimited-text-to-speech-api/
- **API Reference:** https://docs.puter.com/AI/txt2speech/

### Usage
```html
<script src="https://js.puter.com/v2/"></script>
<script>
  puter.ai.txt2speech("Hello, world!", { language: "en-GB" })
    .then(audio => audio.play());
</script>
```

### Options
- `language`: "en-GB", "en-US", "fr-FR", etc.
- `voice`: "Joanna", etc.
- `engine`: "standard", "neural", "generative"

---

## Recommended Approaches

### Option A: Web Speech API only
- No setup, works offline
- Quality varies by device

### Option B: Hybrid (Web Speech → Puter fallback)
- Try Web Speech first
- Fall back to Puter when voices or playback fail
- No API keys

### Option C: ElevenLabs or OpenAI (server-side)
- Use an API route with your key
- Best quality and control
- Paid (ElevenLabs has a free tier)

### Option D: Kokoro-js
- All in the browser
- Good quality, no backend
- Requires initial model download

---

## Quick Links Summary

| Solution      | Main Docs |
|---------------|-----------|
| Web Speech API| https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis |
| ElevenLabs    | https://elevenlabs.io/docs/capabilities/text-to-speech |
| OpenAI TTS    | https://developers.openai.com/api/docs/guides/text-to-speech |
| Kokoro-js     | https://www.npmjs.com/package/kokoro-js |
| Puter.js      | https://developer.puter.com/text-to-speech/ |
