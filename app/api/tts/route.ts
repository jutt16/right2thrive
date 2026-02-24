import { NextRequest, NextResponse } from "next/server";

/**
 * ElevenLabs Text-to-Speech API route.
 * Requires ELEVENLABS_API_KEY in environment variables.
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Text-to-speech is not configured. Add ELEVENLABS_API_KEY to .env" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const text = typeof body?.text === "string" ? body.text.trim() : null;
    const voiceId = typeof body?.voice_id === "string" ? body.voice_id : "21m00Tcm4TlvDq8ikWAM"; // Rachel - calm, professional

    if (!text || text.length === 0) {
      return NextResponse.json(
        { error: "Missing or empty 'text' in request body." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: text.slice(0, 5000),
          model_id: "eleven_multilingual_v2",
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      let errMsg = "Text-to-speech failed";
      try {
        const errJson = JSON.parse(errText);
        errMsg = errJson.detail?.message || errJson.message || errText || errMsg;
      } catch {
        errMsg = errText || errMsg;
      }
      return NextResponse.json({ error: errMsg }, { status: response.status });
    }

    const buffer = await response.arrayBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err: unknown) {
    console.error("TTS API error:", err);
    const msg = err instanceof Error ? err.message : "Text-to-speech failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
