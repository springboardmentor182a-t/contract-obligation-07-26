import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import ChatbotPanel from "./ChatbotPanel";

function FloatingChatWidget() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundColor: '#7c3aed',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 9999,
                        transition: 'transform 0.2s, background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.backgroundColor = '#6d28d9';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.backgroundColor = '#7c3aed';
                    }}
                    title="Ask AI Assistant"
                >
                    <MessageSquare size={28} />
                </button>
            )}

            <ChatbotPanel 
                isOpen={isOpen} 
                onClose={() => setIsOpen(false)} 
            />
        </>
    );
}

export default FloatingChatWidget;
