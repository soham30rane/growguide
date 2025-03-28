'use client';
import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiUser } from 'react-icons/fi';
import { RiPlantFill } from 'react-icons/ri';
import { generateChatResponse } from '@/lib/groq-service';

export default function FarmingChatbot() {
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your farming assistant. How can I help you today? You can ask me about crops, farming techniques, or government schemes for farmers.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Fallback responses in case API fails
    const fallbackResponses = {
        crops: "For crop advice, consider your local climate, soil type, and water availability. Popular crops this season include wheat, rice, maize, and pulses. Would you like specific information about any particular crop?",
        fertilizers: "For organic farming, consider compost, vermicompost, and green manures. For conventional farming, NPK fertilizers are commonly used. Always test your soil before applying fertilizers.",
        schemes: "Current government schemes include PM-KISAN, Soil Health Card Scheme, Pradhan Mantri Fasal Bima Yojana (crop insurance), and Kisan Credit Card. Would you like more details about any specific scheme?",
        water: "Efficient water management techniques include drip irrigation, sprinkler systems, and rainwater harvesting. These can reduce water usage by up to 60% compared to traditional flood irrigation.",
        pests: "Integrated Pest Management (IPM) combines biological controls, crop rotation, and resistant crop varieties to minimize pesticide use. For organic solutions, consider neem oil and beneficial insects.",
        default: "I'm not sure about that. Could you ask about crops, fertilizers, government schemes, water management, or pest control?"
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const updatedMessages = [...messages, { text: input, sender: 'user' }];
        setMessages(updatedMessages);
        setIsLoading(true);

        try {
            // Get AI response from Groq
            const response = await generateChatResponse(input);
            
            // Add bot response
            setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
        } catch (error) {
            console.error("Chat error:", error);
            
            // Fallback to simple keyword matching if API fails
            let fallbackResponse = fallbackResponses.default;
            const lowercaseInput = input.toLowerCase();
            
            if (lowercaseInput.includes('crop') || lowercaseInput.includes('plant') || lowercaseInput.includes('grow')) {
                fallbackResponse = fallbackResponses.crops;
            } else if (lowercaseInput.includes('fertilizer') || lowercaseInput.includes('nutrient') || lowercaseInput.includes('soil')) {
                fallbackResponse = fallbackResponses.fertilizers;
            } else if (lowercaseInput.includes('scheme') || lowercaseInput.includes('government') || lowercaseInput.includes('subsidy') || lowercaseInput.includes('loan')) {
                fallbackResponse = fallbackResponses.schemes;
            } else if (lowercaseInput.includes('water') || lowercaseInput.includes('irrigation') || lowercaseInput.includes('rain')) {
                fallbackResponse = fallbackResponses.water;
            } else if (lowercaseInput.includes('pest') || lowercaseInput.includes('insect') || lowercaseInput.includes('disease')) {
                fallbackResponse = fallbackResponses.pests;
            }
            
            setMessages(prev => [...prev, { 
                text: fallbackResponse + " (I'm currently using fallback responses due to connectivity issues.)", 
                sender: 'bot' 
            }]);
        } finally {
            setIsLoading(false);
            setInput('');
        }
    };

    return (
        <div className="mx-auto bg-gray-50 min-h-screen flex flex-col relative">
            {/* Header */}
            {/* Updated header with forced white text */}
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
            
            {/* Chat area */}
            <div className="flex-1 overflow-y-auto p-4 pb-28">
                <div className="max-w-4xl mx-auto">
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
                    <div ref={messagesEndRef} />
                </div>
            </div>
            
            {/* Input area */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
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
        </div>
    );
}