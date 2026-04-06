import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import DynamicChart from './DynamicChart';

const ChatBox = ({ csvData }) => {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hello! I am your AI Data Analyst. What would you like to know about your data? I can even generate charts for you!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add user message to history
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Send the query string AND the csvData to our API
      const response = await axios.post('http://localhost:5000/api/query', {
        query: userMessage.text,
        data: csvData ? csvData.data : null
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });

      // API message replaces string with structured JSON object
      const aiPayload = response.data.message; // This is now an Object!

      const botMessage = {
        role: 'bot',
        text: aiPayload.insight, // Render the thought text
        hasChart: aiPayload.needsChart, // Boolean flag
        chartConfig: aiPayload.chartConfig, // Graph configuration
        timestamp: new Date(response.data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        role: 'bot',
        text: "Sorry, I had trouble connecting to the server.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center space-x-3">
        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-800">AI Analyst</h3>
          <p className="text-xs text-green-600 font-medium">Online</p>
        </div>
      </div>

      {/* Message History Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              
              {/* Avatar */}
              <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${msg.role === 'user' ? 'bg-blue-600 text-white ml-3' : 'bg-gray-200 text-gray-700 mr-3'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              {/* Message Bubble & Chart */}
              <div className="flex flex-col w-full">
                <div className={`px-4 py-3 rounded-2xl w-full ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'}`}>
                  <p className="text-sm">{msg.text}</p>
                  
                  {/* Safely inject Dynamic Visualization if AI generated one */}
                  {msg.role === 'bot' && msg.hasChart && msg.chartConfig && (
                    <DynamicChart config={msg.chartConfig} />
                  )}
                </div>
                <span className={`text-[10px] text-gray-400 mt-1 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </span>
              </div>

            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] flex-row">
              <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 mr-3">
                <Bot size={16} />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center">
                <Loader2 className="animate-spin text-blue-500" size={16} />
                <span className="ml-2 text-sm text-gray-500">Typing...</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Invisible anchor securely placed at bottom for scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-sm transition-all"
            placeholder="Ask a question about your data..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

    </div>
  );
};

export default ChatBox;
