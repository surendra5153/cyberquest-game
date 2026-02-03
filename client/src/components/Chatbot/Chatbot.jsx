import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your Cyber Assistant. Ask me anything about staying safe online!", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAvailable, setIsAvailable] = useState(true);
    const messagesEndRef = useRef(null);

    const suggestedQuestions = [
        "What is Phishing?",
        "How to handle a Cyberbully?",
        "What is Ransomware?",
        "Tips for Public Wi-Fi?",
        "Strong Password tips?",
        "What is 2FA?",
        "About Social Engineering?"
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Check if chatbot service is online
    useEffect(() => {
        const checkHealth = async () => {
            try {
                await axios.get('http://localhost:5001/api/health');
                setIsAvailable(true);
            } catch (err) {
                setIsAvailable(false);
            }
        };
        checkHealth();
    }, [isOpen]);

    const handleSend = async (e, customMsg = null) => {
        if (e) e.preventDefault();
        const messageText = customMsg || input;
        if (!messageText.trim() || isLoading) return;

        const userMsg = { text: messageText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:5001/api/chat', { message: messageText });
            setMessages(prev => [...prev, { text: response.data.response, sender: 'bot' }]);
        } catch (error) {
            const errorMsg = error.response ? "I'm having trouble thinking right now. Please try again!" : "Cyber Assistant is currently unavailable";
            setMessages(prev => [...prev, { text: errorMsg, sender: 'bot', isError: true }]);
            if (!error.response) setIsAvailable(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            {/* Chat Trigger Button */}
            <motion.button
                className={`chatbot-trigger ${!isAvailable ? 'unavailable' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {isOpen ? '✕' : '🤖'}
                {!isOpen && isAvailable && <span className="notification-dot" />}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chatbot-window"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    >
                        <div className="chatbot-header">
                            <h3>Cyber Assistant</h3>
                            <div className={`status-indicator ${isAvailable ? 'online' : 'offline'}`}>
                                {isAvailable ? 'Online' : 'Offline'}
                            </div>
                        </div>

                        <div className="chatbot-messages">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`message ${msg.sender} ${msg.isError ? 'error' : ''}`}>
                                    <div className="message-content">{msg.text}</div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="message bot loading">
                                    <span className="dot" />
                                    <span className="dot" />
                                    <span className="dot" />
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggested Questions */}
                        {isAvailable && messages.length < 5 && (
                            <div className="suggested-questions">
                                {suggestedQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        className="suggestion-btn"
                                        onClick={() => handleSend(null, q)}
                                        disabled={isLoading}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        <form className="chatbot-input" onSubmit={handleSend}>
                            <input
                                type="text"
                                placeholder={isAvailable ? "Type your question..." : "Service unavailable"}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={!isAvailable || isLoading}
                            />
                            <button type="submit" disabled={!isAvailable || isLoading || !input.trim()}>
                                ➔
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chatbot;
