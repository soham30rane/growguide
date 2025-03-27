"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import ChatSidebar from './components/ChatSidebar'
import ChatArea from './components/ChatArea'
import { users, chats } from './data/dummyData'
import Chats from './components/Chats'

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(0)
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  // Set sidebar closed by default on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }
    
    // Run once on mount
    handleResize()
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Find current chat data and active user
  const currentChat = chats.find(chat => chat.userId === activeChat);
  const activeUser = users.find(user => user.id === activeChat);

  // Handle sending a new message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // In a real app, you would send this to a backend
    // For now, we'll just log it and clear the input
    console.log('Message sent:', message);
    setMessage('');
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-br from-green-50 via-lime-50 to-emerald-100 dark:from-[#1e3b2f] dark:via-[#1e3b2f] dark:to-[#1e3b2f] flex flex-col">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20 dark:opacity-10">
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-green-300 dark:bg-green-800 blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 w-64 h-64 rounded-full bg-lime-300 dark:bg-lime-800 blur-3xl"></div>
        <div className="absolute -bottom-32 left-1/4 w-72 h-72 rounded-full bg-emerald-300 dark:bg-emerald-800 blur-3xl"></div>
        
        {/* Agricultural pattern overlay */}
        <div className="absolute inset-0 bg-repeat opacity-5" 
             style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23087f5b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        ></div>
      </div>

      {/* Main chat container - takes full viewport */}
      <div className="relative z-10 flex h-full w-full overflow-hidden bg-white/90 dark:bg-gray-800/90 shadow-2xl backdrop-blur-sm border border-green-100 dark:border-green-900 rounded-lg md:m-4">
        {/* Sidebar toggle button - visible on all screens */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute px-2 top-8 left-2 z-50 bg-green-500 hover:bg-green-600 text-white text-3xl rounded-md shadow-md transition-all"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
        
        {/* Sidebar backdrop overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-30"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        
        {/* Sidebar with user list - overlay style */}
        <div 
          className={`fixed top-0 bottom-0 left-0 z-40 w-[280px] h-full overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-r border-green-100 dark:border-green-900/50 shadow-xl transition-all duration-300 ease-in-out 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="pt-16 h-full overflow-y-auto">
            <ChatSidebar 
              users={users}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filter={filter}
              setFilter={setFilter}
              activeChat={activeChat}
              setActiveChat={(id) => {
                setActiveChat(id);
                // Close sidebar automatically on mobile after selection
                if (window.innerWidth < 768) {
                  setSidebarOpen(false);
                }
              }}
            />
          </div>
        </div>
        
        {/* Chat content area - no margin change */}
        <div className="flex flex-col w-full ">
<div className='z-10 '>
          <ChatArea 
            currentChat={currentChat}
            activeUser={activeUser}
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            sidebarOpen={sidebarOpen}
          />
          </div>
          <div className="overflow-scroll mt-8">
        <Chats/>
        </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
