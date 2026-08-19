import React, { useState, useEffect, useRef } from "react";
import { chatbotAPI } from "../../services/chatbotAPI";
import { Bot, Send, User as UserIcon, X, Loader2 } from "lucide-react";
import "./ChatbotPanel.css";

function ChatbotPanel({ contractId, isOpen, onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initial greeting when opened for a new contract or global
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            if (contractId) {
                setMessages([
                    { sender: "bot", text: "Hello! I'm your ContractIQ AI assistant. You can ask me questions about this contract like its status, expiry date, or obligations." }
                ]);
            } else {
                setMessages([
                    { sender: "bot", text: "Hello! I'm your global ContractIQ AI assistant. You can ask me general questions about your workspace and contracts." }
                ]);
            }
        }
    }, [isOpen, contractId]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
        setIsLoading(true);

        try {
            const response = await chatbotAPI.chat(contractId, userMessage);
            setMessages(prev => [...prev, { sender: "bot", text: response.response }]);
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => [...prev, { sender: "bot", text: "Sorry, I encountered an error while processing your request. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chatbot-panel-overlay">
            {/* Header */}
            <div className="chatbot-header">
                <div className="chatbot-header-left">
                    <div className="chatbot-bot-icon-container">
                        <Bot size={20} color="white" />
                    </div>
                    <div>
                        <h2 className="chatbot-title">ContractIQ AI</h2>
                        <p className="chatbot-subtitle">{contractId ? "Ask about this contract" : "Global Workspace Assistant"}</p>
                    </div>
                </div>
                <button onClick={onClose} className="chatbot-close-btn" title="Close AI Assistant">
                    <X size={20} />
                </button>
            </div>

            {/* Messages Area */}
            <div className="chatbot-messages-area">
                {messages.map((msg, index) => (
                    <div key={index} className={`chatbot-message-row ${msg.sender}`}>
                        <div className={`chatbot-avatar ${msg.sender}`}>
                            {msg.sender === "user" ? <UserIcon size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`chatbot-bubble ${msg.sender}`}>
                            {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="chatbot-message-row bot">
                        <div className="chatbot-avatar bot">
                            <Bot size={16} />
                        </div>
                        <div className="chatbot-thinking">
                            <Loader2 size={16} className="chatbot-spinner" />
                            <span>Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="chatbot-input-area">
                <form onSubmit={handleSend} className="chatbot-form">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        className="chatbot-input"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || isLoading}
                        className="chatbot-send-btn"
                        title="Send Message"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatbotPanel;
