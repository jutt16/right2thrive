// components/FloatingChatWrapper.tsx - FIXED
"use client";

import FloatingChatButton from "./floating-chat-button";
import FloatingVoiceCallButton from "./FloatingVoiceCallButton";

export default function FloatingChatWrapper() {
  return (
    <>
      <FloatingVoiceCallButton />
      <FloatingChatButton />
    </>
  );
}