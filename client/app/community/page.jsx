"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import ChatSidebar from './components/ChatSidebar'
import ChatArea from './components/ChatArea'
import { chats } from './data/dummyData'
import Chats from './components/Chats'
import Cookies from "js-cookie";

import getGroup from '@/actions/group'
import createGroup from '@/actions/create-group';
import oneToOneChatAction from '@/actions/oneToOneChat';
import Modal from '@/components/Modal';
import ReactTagInput from "@pathofdev/react-tag-input"; // Install this library for tag input
import "@pathofdev/react-tag-input/build/index.css"; // Import styles for the tag input

const ChatPage = () => {
  const [activeChat, setActiveChat] = useState(0)
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [users, setUsers] = useState([])

  const [roomId, setRoomId] = useState('testinging')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [phoneTags, setPhoneTags] = useState([]);

  useEffect(() => {}, [roomId])

  const testinf = async () => {
    const res = await getGroup(Cookies.get("token"))
    console.log("get Group",res)

    const data = [
      // {
      //   id: "0000",
      //   name: 'John Harvest',
      //   role: 'John Harvest',
      //   avatar: '👨‍🌾',
      //   category: 'expert',
      //   badge: 'expert',
      // },
      // {
      //   id: "11111",
      //   name: 'Sarah Fields',
      //   role: 'Sarah Fields',
      //   avatar: '👩‍🌾',
      //   category: 'farmer',
      //   badge: 'farmer',
      // },
      // {
      //   id: "222222",
      //   name: 'GrowWise Support',
      //   role: 'GrowWise Support',
      //   avatar: '🌱',
      //   category: 'support',
      //   badge: 'support',
      // },
    ]

    res.groups.map((group) => {
      data.push({
        id: group.roomid,
        name: group.groupname,
        role: group.groupname,
        avatar: "👥",
        category: 'group',
        badge: 'group',
      })
    })

    const oneToOneChat = await oneToOneChatAction(Cookies.get("token"))
    console.log("oneToOneChat",oneToOneChat)

    const current_user_id = Cookies.get("token")

    oneToOneChat.chats.map((chat) => {
      const newData = {
        // id: sort 2 id and append,
        id : (current_user_id > chat.uid, chat.uid + current_user_id) ? chat.uid + current_user_id : current_user_id + chat.uid,
        name: chat.username,
        role: chat.username,
        avatar: (chat.role === "Farmer") ? "🧑‍🌾" : ((chat.role === "Expert/Consultant") 
        ? "👨‍🌾" : ((chat.role === "Support") ? "🌱" : "👩‍🔬")),
        category: chat.roles,
        badge: chat.roles,
      }
      data.push(newData)
    })


    console.log("data",data)

    setUsers(data)
  }

  // Set sidebar closed by default on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    testinf()
    
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

  const handleCreateGroup = async () => {
    const result = await createGroup(groupName, phoneTags);
    if (result.success) {
      alert(result.message);
      setIsModalOpen(false);
      setGroupName('');
      setPhoneTags([]);
    } else {
      alert(result.message);
    }
  };

  const handleOpenModal = async () => {
    const currentUserResponse = await fetch(`http://localhost:8000/auth/get-phone`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([Cookies.get("token")]), // Fetch the phone number of the current user
    });
    const currentUserData = await currentUserResponse.json();
    if (currentUserData && currentUserData.length > 0) {
      setPhoneTags([currentUserData[0].phone]); // Add the current user's phone number to the tags
    }
    setIsModalOpen(true);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-green-50 via-lime-50 to-emerald-100 dark:from-[#1e3b2f] dark:via-[#1e3b2f] dark:to-[#1e3b2f] flex flex-col">
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

      {/* Main chat container - changed to h-screen from h-full */}
      <div className="relative z-10 flex h-screen w-full overflow-hidden bg-white/90 dark:bg-gray-800/90 shadow-2xl backdrop-blur-sm border border-green-100 dark:border-green-900 rounded-lg">
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
          <div className="pt-16 h-full overflow-y-auto flex flex-col">
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
              setRoomId={setRoomId}
            />
            <button
              onClick={handleOpenModal}
              className="mt-4 mx-4 bg-green-500 text-white px-4 py-2 rounded shadow"
            >
              Create Group
            </button>
          </div>
        </div>
        
        {/* Chat content area - ensure full height with h-screen */}
        <div className="flex flex-col w-full h-screen overflow-hidden">
          {/* Chat header - fixed at top */}
          <ChatArea 
            currentChat={currentChat}
            activeUser={activeUser}
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            sidebarOpen={sidebarOpen}
          />
          
          {/* Scrollable chat content - adjusted padding to work with fixed composer */}
          <div className="flex-1 overflow-y-auto pt-4 flex flex-col">
            {/* Empty state when no chats are available */}
            {!currentChat?.messages?.length && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500 dark:text-gray-400">
                <div className="text-5xl mb-4">💬</div>
                <h3 className="text-xl font-medium mb-2">No messages yet</h3>
                <p className="max-w-md">
                  Start a conversation with {activeUser?.name || "this contact"} by sending a message or posting in the community forums below.
                </p>
              </div>
            )}
            
            <div className="flex-1">
              <Chats
          roomId={roomId}
        />
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Group"
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <ReactTagInput
            tags={phoneTags}
            onChange={(newTags) => setPhoneTags(newTags)}
            placeholder="Enter phone numbers and press Enter"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleCreateGroup}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default ChatPage
