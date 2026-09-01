"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, X, Send, Bot, User, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  suggestedActions?: { label: string; url: string }[];
  timestamp: string;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! I am the **BSTE Islamabad AI Assistant**. How can I help you today with result verification, technical programs, or examination rules?",
      suggestedActions: [
        { label: "Check Result Process", url: "/verify" },
        { label: "Technical Programs", url: "/programs" },
        { label: "Grading Criteria", url: "/about" },
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToSend.trim() }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: json.data.answer,
          suggestedActions: json.data.suggestedActions,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(json.error || "Failed to process question.");
      }
    } catch (err: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "I apologize, but I encountered a temporary connection issue. Please verify your internet or try asking again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3.5 bg-gradient-to-r from-bste-900 to-bste-800 text-white rounded-full shadow-2xl hover:shadow-bste-900/30 hover:scale-105 transition-all border border-bste-gold/40 group"
          aria-label="Open BSTE AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-bste-gold" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-bste-900 animate-pulse" />
          </div>
          <span className="font-bold text-sm tracking-wide text-slate-100">BSTE AI Assistant</span>
        </button>
      )}

      {/* Expandable Chat Drawer */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[580px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-bste-950 via-bste-900 to-bste-800 px-5 py-4 flex items-center justify-between border-b-2 border-bste-gold">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-bste-950 border border-bste-gold flex items-center justify-center shadow-inner">
                <Bot className="w-5 h-5 text-bste-gold" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-white font-bold text-sm">BSTE AI Assistant</h3>
                  <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded">
                    RAG v2.0
                  </span>
                </div>
                <p className="text-slate-300 text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-bste-gold" /> Official Board Intelligence
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="w-7 h-7 rounded-full bg-bste-900 flex-shrink-0 flex items-center justify-center text-bste-gold text-xs font-bold mt-1">
                    AI
                  </div>
                )}
                <div className={`max-w-[82%] ${m.sender === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.sender === "user"
                        ? "bg-bste-900 text-white rounded-tr-none font-medium"
                        : "bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {/* Action Pills */}
                    {m.suggestedActions && m.suggestedActions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5">
                        {m.suggestedActions.map((act, i) => (
                          <Link
                            key={i}
                            href={act.url}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-bste-50 hover:bg-bste-100 text-bste-900 text-[11px] font-bold rounded-lg border border-bste-200 transition"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-3 h-3 text-bste-gold" />
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1 block">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 w-fit">
                <Sparkles className="w-4 h-4 text-bste-gold animate-spin" />
                <span className="text-xs text-slate-600 font-medium">Synthesizing verified board knowledge...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleSend("How to verify certificate QR?")}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-full transition"
            >
              📷 QR Verification
            </button>
            <button
              onClick={() => handleSend("What are the passing marks rules?")}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-full transition"
            >
              📋 Passing Rules
            </button>
            <button
              onClick={() => handleSend("Tell me about DAE Computer Information Technology")}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-full transition"
            >
              🎓 DAE CIT
            </button>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about BSTE..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-bste-900 focus:bg-white"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2.5 bg-bste-900 hover:bg-bste-800 disabled:opacity-50 text-bste-gold rounded-xl transition shadow-md"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
