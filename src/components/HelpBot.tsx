'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

export default function HelpBot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, status, error, clearError } = useChat();
  const isLoading = status === 'submitted' || status === 'streaming';
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [realErrorMessage, setRealErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      // Fetch latest logs from the server to see if a matching crash happened recently
      fetch('/api/log-error')
        .then((res) => res.json())
        .then((logs: any[]) => {
          if (logs && logs.length > 0) {
            const latest = logs[0];
            const errorTime = new Date(latest.timestamp).getTime();
            const now = Date.now();
            // If the error was logged in the last 15 seconds
            if (now - errorTime < 15000) {
              setRealErrorMessage(latest.message);
              return;
            }
          }
          setRealErrorMessage(error.message);
        })
        .catch(() => {
          setRealErrorMessage(error.message);
        });
    } else {
      setRealErrorMessage(null);
    }
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white shadow-[0_0_20px_rgba(219,39,119,0.4)] hover:shadow-[0_0_30px_rgba(219,39,119,0.6)] hover:scale-110 transition-all duration-300 z-50 flex items-center justify-center group"
      >
        <MessageCircle size={28} className="group-hover:animate-pulse" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-purple-900/40 to-pink-900/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Meowflix Assistant</h3>
                  <p className="text-xs text-purple-300 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Online & Monitoring Systems
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                  <Bot size={48} className="text-purple-400 mb-2" />
                  <p className="text-gray-300">Hi there! I'm your AI assistant.</p>
                  <p className="text-xs text-gray-400 max-w-[250px]">
                    I can help you navigate the site and I monitor system health. If you hit an error, just ask!
                  </p>
                </div>
              )}
              {messages.map((m: any) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={m.id} 
                  className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 mt-1">
                      <Bot size={16} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl p-3 text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-sm' 
                      : 'bg-zinc-800 text-gray-200 border border-white/5 rounded-tl-sm'
                  }`}>
                    {m.content || m.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || ''}
                  </div>
                  {m.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0 border border-white/10 mt-1">
                      <User size={16} className="text-gray-300" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {error && (
                <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-xl text-red-200 text-xs flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-red-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                      Connection Error
                    </span>
                    <button 
                      type="button" 
                      onClick={() => {
                        clearError();
                        setRealErrorMessage(null);
                      }}
                      className="text-red-400 hover:text-red-200 underline font-semibold text-[10px] uppercase tracking-wider transition-colors"
                    > 
                      Dismiss
                    </button>
                  </div>
                  <p className="font-medium text-gray-300">
                    {realErrorMessage ? (
                      realErrorMessage.toLowerCase().includes('quota') || realErrorMessage.includes('429') || realErrorMessage.toLowerCase().includes('rate limit')
                        ? "Meowflix Assistant has exceeded its free Gemini API quota (limit 20 requests/day). Please wait or try again later."
                        : "API Error: " + realErrorMessage
                    ) : (
                      "Checking status..."
                    )}
                  </p>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-zinc-900 border-t border-white/10">
              <form onSubmit={onSubmit} className="relative flex items-center">
                <input
                  value={input || ''}
                  onChange={handleInputChange}
                  placeholder="Ask me anything..."
                  className="w-full bg-zinc-800 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-500"
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !(input || '').trim()} 
                  className="absolute right-2 p-2 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-700 disabled:text-gray-500 text-white rounded-full transition-colors"
                >
                  <Send size={16} className={isLoading ? "animate-pulse" : ""} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
