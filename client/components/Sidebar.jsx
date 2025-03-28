'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { 
  RiPlantFill, RiDashboardLine, RiChat3Line, 
  RiBook2Line, RiSettings4Line
} from 'react-icons/ri';
import { FiBarChart2 } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';

export default function Sidebar({ 
  activePage = 'dashboard',
  userInitials = 'U',
}) {
  const [hoveredItem, setHoveredItem] = useState(null);

  // Navigation items with their routes and icons
  const navItems = [
    { name: 'Dashboard', icon: <RiDashboardLine size={24} />, href: '/dashboard', id: 'dashboard' },
    { name: 'Scan', icon: <FaLeaf size={24} />, href: '/plant-detector', id: 'crops' },
    { name: 'Resources', icon: <RiBook2Line size={24} />, href: '/blog', id: 'blog' },
    { name: 'Chatbot', icon: <RiChat3Line size={24} />, href: '/chatbot', id: 'chatbot' },
    { name: 'Community', icon: <FiBarChart2 size={24} />, href: '/community', id: 'community' },
    { name: 'Settings', icon: <RiSettings4Line size={24} />, href: '/settings', id: 'settings' },
  ];
  
  return (
    <>
      {/* Desktop sidebar - icon only version */}
      <aside className="hidden md:flex flex-col items-center w-16 bg-white border-r border-gray-200 py-4">
        {/* Logo */}
        <div className="mb-8">
            <Link href='/'>
          <div className="flex items-center justify-center w-10 h-10 bg-green-600 rounded-full">
            <RiPlantFill className="text-white text-xl" />
          </div>
          </Link>
        </div>
        
        {/* User avatar */}
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-8">
          <span className="text-green-800 text-sm font-semibold">{userInitials}</span>
        </div>
        
        {/* Navigation - icons only */}
        <nav className="flex flex-col items-center space-y-6 flex-1">
          {navItems.map((item) => (
            <div 
              key={item.id}
              className="relative"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                href={item.href}
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  activePage === item.id
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                } transition-colors duration-150`}
                aria-label={item.name}
              >
                {item.icon}
              </Link>
              
              {/* Tooltip */}
              {hoveredItem === item.id && (
                <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg whitespace-nowrap z-10">
                  {item.name}
                  {/* Tooltip arrow */}
                  <div className="absolute -left-1 top-1/2 -mt-1 border-t-transparent border-b-transparent border-r-gray-800 border-l-transparent border-solid border-r-[6px] border-t-[6px] border-b-[6px]"></div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-30">
        <div className="grid grid-cols-5 h-16">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex flex-col items-center justify-center"
            >
              <span className={`${activePage === item.id ? 'text-green-600' : 'text-gray-500'} mb-1`}>
                {item.icon}
              </span>
              <span className={`text-xs ${activePage === item.id ? 'text-green-600' : 'text-gray-500'}`}>
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
