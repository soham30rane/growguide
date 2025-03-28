import React, { useRef, useEffect } from 'react';

const ChatArea = ({ 
  currentChat, 
  activeUser, 
  message, 
  setMessage, 
  handleSendMessage 
}) => {
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat]);

  // Format date for the header
  const getLastActiveDate = () => {
    if (!currentChat?.messages?.length) return '';
    const lastMessage = currentChat.messages[currentChat.messages.length - 1];
    return lastMessage.date;
  };

  return (
    <div className="sticky top-0 z-20 w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
      {/* Chat header */}
      <div className="p-4 border-b border-green-100 dark:border-green-800/50 flex items-center">
        <div className="relative ml-8">
          <div className="text-3xl bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
            {activeUser?.avatar}
          </div>
          {activeUser?.online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></span>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
                {activeUser?.name}
                {activeUser?.category === 'expert' && (
                  <span className="ml-2 px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">Verified</span>
                )}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                <span className="mr-1">{
                  activeUser?.category === 'expert' ? '👩‍🔬' : 
                  activeUser?.category === 'farmer' ? '🧑‍🌾' : 
                  activeUser?.category === 'support' ? '🛟' : 
                  activeUser?.category === 'service' ? '🤖' : '👥'
                }</span>
                {activeUser?.role} • {activeUser?.online ? (
                  <span className="flex items-center text-green-600 dark:text-green-400">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    Online
                  </span>
                ) : (
                  <span>{activeUser?.lastSeen}</span>
                )}
              </p>
            </div>
            <div className="flex space-x-1">
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span role="img" aria-label="call" className="text-gray-600 dark:text-gray-400">📞</span>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span role="img" aria-label="video" className="text-gray-600 dark:text-gray-400">📹</span>
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span role="img" aria-label="info" className="text-gray-600 dark:text-gray-400">ℹ️</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
