'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiUser, FiPlus, FiMessageCircle, FiMenu, FiX, FiTrash } from 'react-icons/fi';
import { RiPlantFill } from 'react-icons/ri';
import { generateChatResponse } from '@/lib/groq-service';

export default function FarmingChatbot() {
    // State for chat functionality
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mobileView, setMobileView] = useState(false);
    const messagesEndRef = useRef(null);
    
    // State for sidebar and conversation management
    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    // Fallback responses in case API fails
    const fallbackResponses = {
        crops: "For crop advice, consider your local climate, soil type, and water availability. Popular crops this season include wheat, rice, maize, and pulses. Would you like specific information about any particular crop?",
        fertilizers: "For organic farming, consider compost, vermicompost, and green manures. For conventional farming, NPK fertilizers are commonly used. Always test your soil before applying fertilizers.",
        schemes: "Current government schemes include PM-KISAN, Soil Health Card Scheme, Pradhan Mantri Fasal Bima Yojana (crop insurance), and Kisan Credit Card. Would you like more details about any specific scheme?",
        water: "Efficient water management techniques include drip irrigation, sprinkler systems, and rainwater harvesting. These can reduce water usage by up to 60% compared to traditional flood irrigation.",
        pests: "Integrated Pest Management (IPM) combines biological controls, crop rotation, and resistant crop varieties to minimize pesticide use. For organic solutions, consider neem oil and beneficial insects.",
        default: "I'm not sure about that. Could you ask about crops, fertilizers, government schemes, water management, or pest control?"
    };

    // Function to create a new conversation
    const createNewConversation = () => {
        const newConversation = {
            id: Date.now().toString(),
            title: `Conversation ${conversations.length + 1}`,
            createdAt: new Date().toISOString(),
            messages: [
                { text: "Hello! I'm your farming assistant. How can I help you today? You can ask me about crops, farming techniques, or government schemes for farmers.", sender: 'bot' }
            ]
        };
        
        const updatedConversations = [...conversations, newConversation];
        setConversations(updatedConversations);
        setActiveConversationId(newConversation.id);
        setMessages(newConversation.messages);
        
        // Save to localStorage
        localStorage.setItem('chatConversations', JSON.stringify(updatedConversations));
    };
    
    // Function to load a conversation
    const loadConversation = (conversationId) => {
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
            setActiveConversationId(conversationId);
            setMessages(conversation.messages);
            
            // On smaller screens, close sidebar after selection
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            }
        }
    };
    
    // Function to delete a conversation
    const deleteConversation = (e, conversationId) => {
        e.stopPropagation(); // Prevent triggering the loadConversation
        
        const updatedConversations = conversations.filter(c => c.id !== conversationId);
        setConversations(updatedConversations);
        
        // If the active conversation is deleted, set the most recent one as active
        if (activeConversationId === conversationId) {
            const mostRecent = updatedConversations[updatedConversations.length - 1];
            if (mostRecent) {
                setActiveConversationId(mostRecent.id);
                setMessages(mostRecent.messages);
            } else {
                // If no conversations left, create a new one
                createNewConversation();
                return;
            }
        }
        
        // Save to localStorage
        localStorage.setItem('chatConversations', JSON.stringify(updatedConversations));
    };
    
    // Function to update conversation title based on first message
    const updateConversationTitle = (conversationId, userMessage) => {
        const updatedConversations = conversations.map(conv => {
            if (conv.id === conversationId) {
                // Create a title from the first few words of the user's message
                let title = userMessage.slice(0, 20);
                if (userMessage.length > 20) title += '...';
                
                return { ...conv, title };
            }
            return conv;
        });
        
        setConversations(updatedConversations);
        localStorage.setItem('chatConversations', JSON.stringify(updatedConversations));
    };
    
    // Load conversations from localStorage on initial render
    useEffect(() => {
        const savedConversations = localStorage.getItem('chatConversations');
        if (savedConversations) {
            const parsedConversations = JSON.parse(savedConversations);
            setConversations(parsedConversations);
            
            // Set the most recent conversation as active
            if (parsedConversations.length > 0) {
                const mostRecent = parsedConversations[parsedConversations.length - 1];
                setActiveConversationId(mostRecent.id);
                setMessages(mostRecent.messages);
            }
        } else {
            // If no saved conversations, create a new one
            createNewConversation();
        }
        
        // Handle responsive sidebar behavior
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            }
        };
        
        // Set initial sidebar state
        handleResize();
        
        // Add event listener
        window.addEventListener('resize', handleResize);
        
        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Handle form submission
const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // If no active conversation, create one
    if (!activeConversationId) {
        createNewConversation();
        return;
    }

    // Update the first user message as the conversation title
    const isFirstUserMessage = !messages.some(msg => msg.sender === 'user');
    if (isFirstUserMessage) {
        updateConversationTitle(activeConversationId, input);
    }

    // Add user message to current conversation
    const userMessage = { text: input, sender: 'user' };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
        // Get AI response from Groq WITH conversation history
        const response = await generateChatResponse(input, updatedMessages);
        
        // Add bot response
        const botMessage = { text: response, sender: 'bot' };
        const messagesWithResponse = [...updatedMessages, botMessage];
        setMessages(messagesWithResponse);
        
        // Update the conversation in the list
        const updatedConversations = conversations.map(conv => {
            if (conv.id === activeConversationId) {
                return { ...conv, messages: messagesWithResponse };
            }
            return conv;
        });
        
        setConversations(updatedConversations);
        localStorage.setItem('chatConversations', JSON.stringify(updatedConversations));
    } catch (error) {
        console.error("Chat error:", error);
        
        // Fallback to simple keyword matching if API fails
        let fallbackResponse = fallbackResponses.default;
        const lowercaseInput = input.toLowerCase();
        
        // Your existing fallback logic...
        // ...
        
    } finally {
        setIsLoading(false);
        setInput('');
    }
};
    
    // Format date for conversation list
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric'
        });
    };

    return (
        <div className="mx-auto bg-gray-50 min-h-screen flex flex-col md:flex-row relative">
            {/* Mobile menu toggle */}
            <button 
                className="md:hidden fixed top-4 left-4 z-30 bg-green-700 text-white p-2 rounded-full shadow-lg"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
            
            {/* Sidebar */}
            <div className={`
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                transition-transform duration-300 ease-in-out
                bg-white w-64 md:w-80 border-r border-gray-200 shadow-md fixed inset-y-0 left-0 z-20
                flex flex-col h-screen
            `}>
                {/* Sidebar header */}
                {/* Sidebar header */}
            <div className="bg-green-700 p-4 shadow-sm flex justify-between items-center">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <RiPlantFill /> 
                    <span>GrowGuide Chats</span>
                </h2>
                {/* Desktop close button */}
                <button 
                    className="hidden md:block text-white hover:text-gray-200"
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <FiX size={20} />
                </button>
            </div>
                
                {/* New chat button */}
                <div className="p-3">
                    <button 
                        className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors shadow-sm"
                        onClick={createNewConversation}
                    >
                        <FiPlus />
                        <span>New Conversation</span>
                    </button>
                </div>
                
                {/* Conversations list */}
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <div className="text-gray-500 text-center p-6">
                            No conversations yet
                        </div>
                    ) : (
                        <div className="space-y-1 p-2">
                            {conversations.map(conversation => (
                                <div 
                                    key={conversation.id}
                                    onClick={() => loadConversation(conversation.id)}
                                    className={`
                                        p-3 rounded-lg cursor-pointer transition-colors flex items-start justify-between group
                                        ${activeConversationId === conversation.id ? 
                                            'bg-green-100 hover:bg-green-200' : 
                                            'hover:bg-gray-100'
                                        }
                                    `}
                                >
                                    <div className="flex items-start space-x-3 overflow-hidden">
                                        <div className="flex-shrink-0 mt-1">
                                            <FiMessageCircle className={`${activeConversationId === conversation.id ? 'text-green-600' : 'text-gray-500'}`} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <h3 className="font-medium text-sm truncate">
                                                {conversation.title}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(conversation.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => deleteConversation(e, conversation.id)}
                                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                                    >
                                        <FiTrash size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            
            
            {/* Main chat area */}
            <div className={`flex-1 flex flex-col relative ${isSidebarOpen ? 'md:ml-0' : ''}`}>
                {/* Chat header */}
                <div className="bg-green-700 p-4 shadow-md">
                    <div className="flex items-center justify-center gap-2 max-w-4xl mx-auto">
                        <span className="text-white" style={{ color: 'white' }}>
                            <RiPlantFill className="!text-white text-2xl" style={{ color: 'white' }} />
                        </span>
                        <h1 className="text-xl font-bold !text-white" style={{ color: 'white' }}>
                            GrowGuide Assistant
                        </h1>
                    </div>
                </div>
                
                {/* Chat messages */}
                <div className="flex-1 overflow-y-auto p-4 pb-28">
                    <div className="max-w-4xl mx-auto">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                <RiPlantFill className="text-green-200 text-6xl mb-4" />
                                <h3 className="text-xl font-medium text-gray-700 mb-2">Welcome to GrowGuide Assistant</h3>
                                <p className="text-gray-500 max-w-md">
                                    Ask me anything about farming, crops, agricultural techniques, or government schemes for farmers.
                                </p>
                            </div>
                        ) : (
                            <>
                                {messages.map((message, index) => (
                                    <div 
                                        key={index} 
                                        className={`flex items-start mb-4 ${
                                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        {message.sender === 'bot' && (
                                            <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center mr-2 flex-shrink-0 shadow-sm">
                                                <RiPlantFill className="text-white text-sm" />
                                            </div>
                                        )}
                                        
                                        <div 
                                            className={`p-3 rounded-2xl max-w-[80%] shadow-sm ${
                                                message.sender === 'user' 
                                                    ? 'bg-green-600 text-white rounded-tr-none' 
                                                    : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                                            }`}
                                        >
                                            {message.text}
                                        </div>
                                        
                                        {message.sender === 'user' && (
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center ml-2 flex-shrink-0 shadow-sm">
                                                <FiUser className="text-green-800 text-sm" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                
                                {isLoading && (
                                    <div className="flex items-start mb-4">
                                        <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center mr-2 flex-shrink-0 shadow-sm">
                                            <RiPlantFill className="text-white text-sm" />
                                        </div>
                                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm">
                                            <div className="flex space-x-2">
                                                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                
                {/* Input area */}
                <div className={`fixed bottom-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg transition-all duration-300 ${isSidebarOpen ? 'md:left-80' : 'left-0'}`}>
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleSubmit} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about crops, schemes, or farming advice..."
                                className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                            />
                            <button 
                                type="submit" 
                                className="bg-green-700 hover:bg-green-800 text-white p-3 rounded-full transition-colors flex items-center justify-center shadow-sm disabled:opacity-70"
                                disabled={isLoading}
                            >
                                <FiSend className="text-lg" />
                            </button>
                        </form>
                    </div>
                </div>
                
                {/* Mobile overlay when sidebar is open */}
                {/* Desktop toggle button for collapsed sidebar */}
                <button 
                    className="hidden md:block fixed top-4 left-4 z-30 bg-green-700 text-white p-2 rounded-full shadow-lg"
                    onClick={() => setIsSidebarOpen(true)}
                    style={{ display: isSidebarOpen ? 'none' : 'block' }}
                >
                    <FiMenu size={20} />
                </button>
                {isSidebarOpen && (
                    <div 
                        className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </div>
        </div>
    );
}