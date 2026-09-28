"use client";

import React, { useState, useRef, useEffect } from "react";
import { useResumeStore } from "@/lib/store/useResumeStore";
import { Sparkles, X, Send, Bot, User, Check } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
  suggestedAction?: {
    type: string;
    payload?: unknown;
  };
}

export const AICopilotWidget: React.FC = () => {
  const { content, updatePersonalInfo, targetRole } = useResumeStore();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your ResumeForge Copilot. I have live context on your resume. How can I help optimize your bullets, summary, or ATS score today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat-copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          resumeContent: content,
          conversationHistory: messages.slice(-4),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to reach AI Copilot");
      }

      const botMessage: Message = {
        role: "assistant",
        content: data.reply,
        suggestedAction: data.suggestedAction,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMsg = error instanceof Error ? error.message : "Error contacting AI";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ ${errorMsg}. Make sure ANTHROPIC_API_KEY or OPENAI_API_KEY is configured in your .env file.`,
        },
      ]);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyAction = (action: { type: string; payload?: unknown }) => {
    if (action.type === "UPDATE_SUMMARY" && typeof action.payload === "string") {
      updatePersonalInfo({ summary: action.payload });
      toast.success("Updated summary in resume!");
    } else {
      toast.info(`Action ${action.type} applied!`);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-2xl shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
        title="Open AI Copilot"
      >
        <Sparkles className="w-5 h-5 animate-pulse" />
        <span className="text-xs font-bold tracking-tight pr-1 hidden sm:inline">AI Copilot</span>
      </button>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 w-96 h-[520px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200 animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  ResumeForge Copilot
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </h4>
                <p className="text-[10px] text-slate-400">Real-time resume context active</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Chips */}
          <div className="p-2 border-b border-slate-800 bg-slate-900/50 flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() =>
                handleSendMessage("Make my professional summary more executive and metric-oriented.")
              }
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 whitespace-nowrap"
            >
              Rewrite Summary
            </button>
            <button
              onClick={() =>
                handleSendMessage("What are the top 3 weak spots on my resume for a " + targetRole + " role?")
              }
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 whitespace-nowrap"
            >
              Find Weak Spots
            </button>
            <button
              onClick={() =>
                handleSendMessage("Suggest 5 modern technical skills to add for " + targetRole)
              }
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 whitespace-nowrap"
            >
              Suggest Skills
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-md bg-indigo-600/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl p-2.5 leading-relaxed ${
                    m.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800/80 border border-slate-700/60 text-slate-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {/* Optional Direct Action Button */}
                  {m.suggestedAction && m.suggestedAction.type !== "NO_ACTION" && (
                    <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                      <span className="text-[10px] text-indigo-300 font-semibold">
                        Ready to apply change?
                      </span>
                      <button
                        onClick={() => handleApplyAction(m.suggestedAction!)}
                        className="px-2 py-1 bg-indigo-500 hover:bg-indigo-400 text-white rounded text-[10px] font-semibold flex items-center gap-1 shadow"
                      >
                        <Check className="w-3 h-3" /> Apply to Resume
                      </button>
                    </div>
                  )}
                </div>
                {m.role === "user" && (
                  <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 items-center text-slate-400 text-xs italic">
                <Bot className="w-4 h-4 text-indigo-400 animate-spin" />
                <span>Thinking & analyzing resume...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask Copilot to rewrite, review, or edit..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-xl transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
