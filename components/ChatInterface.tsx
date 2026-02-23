"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Send, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const ChatInterface = ({ file }: { file: any }) => {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      setIsLoading(true);
      await sendMessage({ text: input }, { body: { fileId: file.id } });
      setInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 flex flex-col">
      <div className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link
          href="/drive"
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="p-2 bg-indigo-500/10 rounded-lg">
          <FileText className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{file.name}</p>
          <p className="text-slate-500 text-xs">AI Document Chat</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 max-w-3xl mx-auto w-full">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="p-4 bg-indigo-500/10 rounded-full inline-block mb-4">
              <FileText className="w-8 h-8 text-indigo-400" />
            </div>
            <p className="text-white font-semibold mb-2">
              Ask anything about this document
            </p>
            <p className="text-slate-500 text-sm">
              Summarize it, extract key points, or ask specific questions.
            </p>
          </motion.div>
        )}

        {messages.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-br-sm"
                  : "bg-white/5 border border-white/10 text-slate-200 rounded-bl-sm"
              }`}
            >
              {m.parts.map((part, i) => {
                switch (part.type) {
                  case "text":
                    return <span key={i}>{part.text}</span>;
                }
              })}
            </div>
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question about this document..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
