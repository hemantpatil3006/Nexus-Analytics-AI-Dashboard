import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DynamicChart from './DynamicChart';

const ChatBox = ({ csvData }) => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hello! I am Nexus, your AI Data Analyst. What would you like to know about your data? I can generate insights and visually rich charts for you.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      id: 'initial'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  // Auto-scroll to the bottom whenever messages change
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessageId = Date.now().toString();
    const userMessage = {
      id: userMessageId,
      role: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiBase}/api/query`, {
        query: userMessage.text,
        data: csvData ? csvData.data : null
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });

      const aiPayload = response.data.message;

      const botMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: aiPayload.insight,
        hasChart: aiPayload.needsChart,
        chartConfig: aiPayload.chartConfig,
        timestamp: new Date(response.data.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      
      const serverErrorMessage = error.response?.data?.error || "System Error";
      const serverDetails = error.response?.data?.details || "Unable to query Nexus core. Please check your connection or datasets.";

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        isError: true,
        text: `${serverErrorMessage}: ${serverDetails}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl sm:rounded-2xl bg-slate-900/40 border border-slate-700/50 shadow-inner overflow-hidden relative">
      
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-md border-b border-white/5 px-4 sm:px-6 py-3 sm:py-4 flex items-center space-x-2.5 sm:space-x-3 z-10">
        <div className="bg-emerald-500/20 p-2 sm:p-2.5 rounded-lg sm:rounded-xl text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <Bot size={18} className="sm:w-5 sm:h-5" />
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-white tracking-wide">Nexus AI</h3>
          <div className="flex items-center mt-0.5 sm:mt-1">
             <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500"></span>
              </span>
            <p className="text-[9px] sm:text-[10px] text-emerald-400/80 font-medium tracking-widest uppercase">Online · Ready</p>
          </div>
        </div>
      </div>

      {/* Message History Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 relative z-0 custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex w-full max-w-[90%] sm:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`flex-shrink-0 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full shadow-lg ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white ml-2 sm:ml-3 shadow-emerald-500/30' 
                    : msg.isError 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30 mr-2 sm:mr-3'
                      : 'bg-slate-800 border border-slate-700 text-emerald-400 mr-2 sm:mr-3'
                }`}>
                  {msg.role === 'user' ? <User size={12} className="sm:w-4 sm:h-4" /> : msg.isError ? <AlertCircle size={12} className="sm:w-4 sm:h-4" /> : <Sparkles size={10} className="sm:w-3.5 sm:h-3.5" />}
                </div>
                
                {/* Message Bubble & Chart */}
                <div className="flex flex-col flex-1 max-w-[calc(100%-2rem)] sm:max-w-[calc(100%-3rem)]">
                  <div className={`px-4 sm:px-5 py-3 sm:py-4 rounded-2xl sm:rounded-3xl backdrop-blur-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-tr-sm shadow-[0_4px_15px_rgba(5,150,105,0.2)]' 
                      : msg.isError
                        ? 'bg-red-500/10 border border-red-500/20 text-red-200 rounded-tl-sm'
                        : 'bg-slate-800/80 border border-slate-700 shadow-lg text-slate-200 rounded-tl-sm'
                  }`}>
                    <p className="text-[12px] sm:text-[14px] leading-relaxed font-light break-words">{msg.text}</p>
                    
                    {/* Safely inject Dynamic Visualization if AI generated one */}
                    {msg.role === 'bot' && msg.hasChart && msg.chartConfig && (
                      <div className="mt-4 sm:mt-6 border-t border-slate-700 pt-4 sm:pt-6 overflow-x-auto custom-scrollbar">
                        <DynamicChart config={msg.chartConfig} />
                      </div>
                    )}
                  </div>
                  <span className={`text-[9px] sm:text-[10px] text-slate-500 mt-1.5 sm:mt-2 font-mono ${msg.role === 'user' ? 'text-right mr-1' : 'text-left ml-1'}`}>
                    {msg.timestamp}
                  </span>
                </div>

              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading Indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex justify-start"
            >
              <div className="flex max-w-[90%] sm:max-w-[80%] flex-row">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 mr-2 sm:mr-3 shadow-lg">
                  <Sparkles size={10} className="sm:w-3.5 sm:h-3.5 animate-pulse" />
                </div>
                <div className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl rounded-tl-sm bg-slate-800/80 border border-slate-700 shadow-lg flex items-center space-x-2 sm:space-x-3 backdrop-blur-sm">
                  <Loader2 className="animate-spin text-emerald-500 sm:w-4 sm:h-4" size={14} />
                  <span className="text-[11px] sm:text-[13px] text-slate-400 font-light tracking-wide">Nexus is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Spacer at bottom for padding */}
        <div className="h-2 sm:h-4" />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 bg-slate-900/90 backdrop-blur-md border-t border-white/5 z-10 w-full">
        <form onSubmit={handleSendMessage} className="relative flex items-center w-full">
          <input
            type="text"
            className="w-full pl-4 sm:pl-5 pr-12 sm:pr-14 py-3 sm:py-3.5 bg-slate-800/50 border border-slate-700 focus:border-emerald-500 focus:bg-slate-800/80 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition-all shadow-inner"
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 sm:right-2 p-2 sm:p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg sm:rounded-xl flex items-center justify-center transition-colors disabled:opacity-30 disabled:hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
          >
            <Send size={14} className="sm:w-4 sm:h-4" />
          </motion.button>
        </form>
      </div>

    </div>
  );
};

export default ChatBox;
