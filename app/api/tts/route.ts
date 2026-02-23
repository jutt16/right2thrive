import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * Text-to-Speech API route using OpenAI gpt-4o-mini-tts.
 * Requires OPENAI_API_KEY in environment variables.
 * Per OpenAI usage policies: disclose to users that the voice is AI-generated.
 */
export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Text-to-speech is not configured. Please add OPENAI_API_KEY." },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const text = typeof body?.text === "string" ? body.text.trim() : null;
    const instructions =
      typeof body?.instructions === "string" ? body.instructions : undefined;

    if (!text || text.length === 0) {
      return NextResponse.json(
        { error: "Missing or empty 'text' in request body." },
        { status: 400 }
      );
    }

    // OpenAI recommends max 4,096 characters per request (~5 min audio)
    const sanitizedText = text.slice(0, 4096);

    const openai = new OpenAI({ apiKey });
    const audio = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: "coral",
      input: sanitizedText,
      instructions: instructions ?? "Speak clearly and calmly. This is for a wellbeing assessment.",
      response_format: "mp3",
    });

    const buffer = Buffer.from(await audio.arrayBuffer());
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400", // Cache 24h for repeat plays
      },
    });
  } catch (err: unknown) {
    console.error("TTS API error:", err);
    const msg = err instanceof Error ? err.message : "Text-to-speech failed.";
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
