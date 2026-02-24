# ElevenLabs Setup Guide

This guide walks you through setting up ElevenLabs for:

1. **Text-to-Speech (TTS)** – Read assessment questions and chat messages aloud
2. **Voice Agent Call Support** – Optional voice call with an AI agent for support

---

## Prerequisites

- An [ElevenLabs](https://elevenlabs.io) account (free tier available)
- Node.js project (Next.js) – already configured in this codebase

---

## Step 1: Create an ElevenLabs Account

1. Go to [elevenlabs.io](https://elevenlabs.io)
2. Sign up (free tier: 10,000 credits/month, ~10–20 min audio)
3. Verify your email if required

---

## Step 2: Get Your API Key

1. Log in to [ElevenLabs](https://elevenlabs.io)
2. Go to **Profile** → **API Keys** (or [elevenlabs.io/app/settings/api-keys](https://elevenlabs.io/app/settings/api-keys))
3. Click **Create API Key**
4. Name it (e.g. `Right2Thrive TTS`)
5. Copy the key – you won’t see it again

---

## Step 3: Add API Key to Your Project

Add the key to your `.env` file (create it if needed):

```env
# ElevenLabs Text-to-Speech (required for Listen buttons)
ELEVENLABS_API_KEY=your_api_key_here
```

**Important:** Never commit `.env` or expose the API key in client-side code. The TTS API route runs on the server and keeps the key secure.

---

## Step 4: Restart Your Dev Server

```bash
npm run dev
```

The Listen buttons on assessments and chat messages will now use ElevenLabs TTS.

---

## What’s Included

| Feature | Location | Env Variable |
|---------|----------|--------------|
| **TTS for assessments** | GAD-7, PHQ-9, PCL-5, SDQ, Risk Assessment | `ELEVENLABS_API_KEY` |
| **TTS for chat messages** | Chat page – coach messages | `ELEVENLABS_API_KEY` |
| **Voice call agent** | Floating widget (optional) | `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` |

---

## Optional: Voice Call Agent (ElevenAgents)

ElevenAgents lets users have a voice conversation with an AI support agent instead of typing.

### 4.1 Create an Agent

1. Go to [ElevenLabs Agents](https://elevenlabs.io/agents) or [app.elevenlabs.io](https://app.elevenlabs.io)
2. Click **Create Agent**
3. Configure:
   - **Name:** e.g. “Right2Thrive Support”
   - **System prompt:** Describe the agent’s role (e.g. wellbeing support, FAQs)
   - **Voice:** Choose a voice
   - **Language:** English (UK)
4. Save and copy the **Agent ID**

### 4.2 Add Agent ID to Environment

```env
# Optional: Voice call support widget
NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id_here
```

`NEXT_PUBLIC_` is required because the widget runs in the browser.

### 4.3 Configure Agent Security

1. In the agent settings, set **Authentication** to **Disabled** (for public widget)
2. Add your domain(s) to **Allowed domains** (e.g. `right2thriveuk.com`, `localhost:3000`)

### 4.4 Restart and Test

After restarting, the voice call widget appears when `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` is set. Users can start a voice call from the widget.

---

## API Reference

### TTS Endpoint (Internal)

`POST /api/tts`

**Request body:**
```json
{
  "text": "Text to speak",
  "voice_id": "21m00Tcm4TlvDq8ikWAM"
}
```

**Response:** `audio/mpeg` (MP3)

**Default voice:** Rachel (`21m00Tcm4TlvDq8ikWAM`) – calm, professional

### Changing the Voice

1. Go to [Default Voices](https://elevenlabs.io/app/default-voices)
2. Click the three dots on a voice → **Copy voice ID**
3. Pass it in the request: `{ "text": "...", "voice_id": "your_voice_id" }`

---

## Pricing (as of 2025)

| Plan | Credits/Month | Approx. Audio |
|------|---------------|---------------|
| **Free** | 10,000 | ~10–20 min |
| **Starter** ($5/mo) | 30,000 | ~30–60 min |
| **Creator** ($22/mo) | 100,000 | ~100–200 min |

- Free tier: non-commercial use with attribution
- Commercial use needs a paid plan

---

## Troubleshooting

### "Text-to-speech is not configured"
- Add `ELEVENLABS_API_KEY` to `.env`
- Restart the dev server

### "Quota exceeded" or 429
- You’ve used your monthly credits
- Upgrade or wait for the next billing cycle

### Voice call widget not showing
- Set `NEXT_PUBLIC_ELEVENLABS_AGENT_ID` in `.env`
- Ensure the agent is public and your domain is allowed
- Restart the dev server

### Listen button does nothing
- Check the browser console for errors
- Confirm the API key is valid at [elevenlabs.io/app/settings/api-keys](https://elevenlabs.io/app/settings/api-keys)

---

## Documentation Links

| Resource | URL |
|----------|-----|
| **TTS API** | https://elevenlabs.io/docs/api-reference/text-to-speech/convert |
| **Voice Library** | https://elevenlabs.io/app/default-voices |
| **ElevenAgents Overview** | https://elevenlabs.io/docs/eleven-agents/overview |
| **Widget Embed** | https://elevenlabs.io/docs/agents-platform/customization/widget |
| **React SDK** | https://elevenlabs.io/docs/agents-platform/libraries/react |
| **Pricing** | https://elevenlabs.io/pricing |
