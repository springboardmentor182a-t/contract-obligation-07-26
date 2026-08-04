import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (overrideText = null) => {
    const textToSend = typeof overrideText === 'string' ? overrideText : inputValue;
    if (!textToSend.trim()) return;

    // Add user message
    const newUserMsg = {
      id: Date.now(),
      text: textToSend,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/chatbot/chat/?question=${encodeURIComponent(newUserMsg.text)}`);
      const data = await response.json();

      const botResponse = {
        id: Date.now() + 1,
        text: data.answer || "Sorry, I couldn't understand that.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error("Error communicating with chatbot API:", error);
      const errorResponse = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleSuggestionClick = (text) => {
    setInputValue(text);
    // Auto-send
    handleSend(text);
  };

  const getBotResponse = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes("contract") || lowerText.includes("agreement")) {
      return "You can view and manage all your contracts in the Contract Repository section from the sidebar.";
    }
    if (lowerText.includes("renewal")) {
      return "To check upcoming renewals, please navigate to the Renewal Dashboard.";
    }
    if (lowerText.includes("help") || lowerText.includes("support")) {
      return "I can help you navigate the system, find contracts, or check your obligations. What do you need assistance with?";
    }
    return "I'm still learning about that. Is there anything else I can help you with regarding contract management?";
  };

  return (
    <div className="chatbot-container">
      {/* Floating Toggle Button */}
      <button
        className={`chatbot-toggle-btn ${isOpen ? 'active' : ''}`}
        onClick={toggleChat}
        aria-label="Toggle Chat"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar-container">
                <div className="chatbot-avatar">
                  <Bot size={24} color="white" />
                </div>
                <div className="chatbot-online-indicator"></div>
              </div>
              <div>
                <h3 className="chatbot-title">AI Assistant</h3>
                <p className="chatbot-subtitle">Always here to help</p>
              </div>
            </div>
            <button className="chatbot-close-btn" onClick={toggleChat}>
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="chatbot-messages-container">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message-wrapper ${msg.sender}`}>
                <div className="chat-message-bubble">
                  {msg.text}
                </div>
                <div className="chat-message-time">
                  {msg.timestamp}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message-wrapper bot">
                <div className="chat-message-bubble chatbot-typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}

            {messages.length === 1 && !isTyping && (
              <div className="chatbot-suggestions">
                <button className="chatbot-suggestion-btn" onClick={() => handleSuggestionClick("Where are my contracts?")}>
                  <Sparkles size={12} className="inline mr-1" /> Find Contracts
                </button>
                <button className="chatbot-suggestion-btn" onClick={() => handleSuggestionClick("Show upcoming renewals")}>
                  <Sparkles size={12} className="inline mr-1" /> Upcoming Renewals
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chatbot-input-area">
            <div className="chatbot-input-wrapper">
              <input
                type="text"
                className="chatbot-input"
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="chatbot-send-btn"
                onClick={handleSend}
                disabled={!inputValue.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
