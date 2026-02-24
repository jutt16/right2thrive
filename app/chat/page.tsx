"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Send, ArrowLeft } from "lucide-react";
import { TextToSpeechButton } from "@/components/text-to-speech/TextToSpeechButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global {
  interface Window {
    Pusher: any;
    Echo: any;
  }
}

interface Therapist {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  profile_image?: string;
  specialization?: string;
}

interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  message: string;
  sender: "patient" | "therapist";
  created_at?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}


export default function ChatPage() {
  const router = useRouter();
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const echoRef = useRef<any>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize auth data from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const storedUser = localStorage.getItem("user");
    const storedTherapist = localStorage.getItem("therapist");

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Check if email is verified
      if (!userData.is_email_verified) {
        localStorage.setItem("pendingVerificationEmail", userData.email);
        router.push(`/auth/verify-email?email=${encodeURIComponent(userData.email)}`);
        return;
      }
    }

    if (storedTherapist) {
      setTherapist(JSON.parse(storedTherapist));
    } else {
      setError("No therapist assigned. Please contact support.");
      setIsLoading(false);
    }
  }, [router]);

  // Get or create chat and fetch messages - runs once when therapist is set
  const chatInitializedRef = useRef(false);
  
  useEffect(() => {
    if (!therapist || chatInitializedRef.current) return;
    
    const token = localStorage.getItem("token");
    if (!token) return;

    chatInitializedRef.current = true;

    const initializeChat = async () => {
      try {
        // Get or create chat
        const chatResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/get-or-create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ therapist_id: therapist.id }),
        });

        const chatData = await chatResponse.json();
        if (chatData.status === "success" && chatData.chat) {
          setChatId(chatData.chat.id);

          // Fetch messages
          const messagesResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/chat/${chatData.chat.id}/messages`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const messagesData = await messagesResponse.json();
          if (messagesData.status === "success") {
            setMessages(messagesData.messages.data || []);
          }
        }
      } catch (err) {
        console.error("Error initializing chat:", err);
        setError("Failed to load chat. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [therapist]);

  // Setup Laravel Reverb real-time connection
  useEffect(() => {
    console.log("Echo setup effect - chatId:", chatId);
    if (!chatId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token for Echo");
      return;
    }

    console.log("Token for Echo auth:", token?.substring(0, 20) + "...");
    console.log("Initializing Echo with:", {
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
      host: process.env.NEXT_PUBLIC_REVERB_HOST,
      port: process.env.NEXT_PUBLIC_REVERB_PORT,
    });

    // Initialize Pusher for Laravel Reverb
    window.Pusher = Pusher;

    const echo = new Echo({
      broadcaster: "reverb",
      key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
      wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 443,
      wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 443,
      forceTLS: process.env.NEXT_PUBLIC_REVERB_SCHEME === "https",
      enabledTransports: ["ws", "wss"],
      authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/api/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    });

    echoRef.current = echo;

    // Listen for new messages on the private chat channel
    console.log("Subscribing to channel:", `chat.${chatId}`);
    
    echo
      .private(`chat.${chatId}`)
      .listen(".message.sent", (event: Message) => {
        console.log("New message received:", event);
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.find((m) => m.id === event.id)) {
            return prev;
          }
          return [...prev, event];
        });
      })
      .error((error: unknown) => {
        console.error("Channel subscription error:", error);
      });

    return () => {
      echo.leave(`chat.${chatId}`);
      echo.disconnect();
    };
  }, [chatId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = newMessage.trim();
    if (!messageText || !chatId || isSending) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No auth token");
      return;
    }

    setIsSending(true);
    setNewMessage(""); // Clear immediately for better UX

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          chat_id: chatId,
          message: messageText,
        }),
      });

      const data = await response.json();
      if (data.status === "success" && data.message) {
        // Add message locally (Reverb will also broadcast it)
        setMessages((prev) => {
          if (prev.find((m) => m.id === data.message.id)) {
            return prev;
          }
          return [...prev, data.message];
        });
      } else {
        // Restore message if failed
        setNewMessage(messageText);
        console.error("Send failed:", data);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setNewMessage(messageText); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !therapist) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => router.push("/my-wellbeing")}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="md:hidden"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={therapist?.profile_image || "/placeholder-user.jpg"}
              alt={therapist?.first_name && therapist?.last_name 
                ? `${therapist.first_name} ${therapist.last_name}` 
                : "Therapist"}
            />
            <AvatarFallback>
              {therapist?.first_name && therapist?.last_name
                ? `${therapist.first_name[0]}${therapist.last_name[0]}`.toUpperCase()
                : "T"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-gray-900">
              Your wellbeing coach
            </h2>
            <p className="text-xs text-gray-500">
              {therapist?.first_name && therapist?.last_name
                ? `${therapist.first_name} ${therapist.last_name}`
                : "Therapist"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Send className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Start a conversation
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Send a message to begin chatting with your wellbeing coach
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwnMessage = msg.sender_id === user?.id;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      isOwnMessage
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-white text-gray-900 shadow-sm rounded-bl-md"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm whitespace-pre-wrap flex-1">{msg.message}</p>
                      {!isOwnMessage && (
                        <TextToSpeechButton
                          text={msg.message}
                          label="Listen to message"
                          size="icon"
                          variant="ghost"
                          className="shrink-0 -mr-1 -mt-1"
                        />
                      )}
                    </div>
                    <p
                      className={`mt-1 text-xs ${
                        isOwnMessage ? "text-white/70" : "text-gray-400"
                      }`}
                    >
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t bg-white p-4">
        <form
          onSubmit={sendMessage}
          className="mx-auto flex max-w-3xl items-center gap-2"
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full border-gray-200 bg-gray-50 px-4 py-2 focus:bg-white"
            disabled={isSending}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full bg-primary hover:bg-primary/90"
            disabled={!newMessage.trim() || isSending || !chatId}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}

