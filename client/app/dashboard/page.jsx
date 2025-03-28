'use client';
import React, { useState, useEffect } from 'react';
import { FiDroplet, FiSun, FiWind, FiBarChart2 } from 'react-icons/fi';
import { 
  FaTemperatureHigh, FaLeaf, FaSeedling, FaTractor 
} from 'react-icons/fa';

export default function Dashboard() {
  const [mobileView, setMobileView] = useState(false);
  
  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
    };
    
    // Run once on mount
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="w-full">
          {/* Page header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>
          
          {/* Weather card */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-md p-4 mb-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold mb-1">Weather Today</h2>
                <p className="text-green-100">Dharwad, Karnataka</p>
                <div className="mt-3 text-3xl font-bold">32°C</div>
                <p className="text-green-100">Partly Cloudy</p>
              </div>
              <div className="text-7xl">⛅</div>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-green-500">
              <div className="text-center">
                <FiDroplet className="mx-auto mb-1" />
                <div className="text-sm">62%</div>
                <div className="text-xs text-green-200">Humidity</div>
              </div>
              <div className="text-center">
                <FiWind className="mx-auto mb-1" />
                <div className="text-sm">12 km/h</div>
                <div className="text-xs text-green-200">Wind</div>
              </div>
              <div className="text-center">
                <FaTemperatureHigh className="mx-auto mb-1" />
                <div className="text-sm">34°/29°</div>
                <div className="text-xs text-green-200">High/Low</div>
              </div>
              <div className="text-center">
                <FiSun className="mx-auto mb-1" />
                <div className="text-sm">6:12</div>
                <div className="text-xs text-green-200">UV Index</div>
              </div>
            </div>
          </div>
          
          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { name: 'Active Crops', value: '5', icon: <FaSeedling size={20} />, color: 'bg-green-100 text-green-600' },
              { name: 'Harvest Ready', value: '2', icon: <FaTractor size={20} />, color: 'bg-amber-100 text-amber-600' },
              { name: 'Disease Alerts', value: '1', icon: <FaLeaf size={20} />, color: 'bg-red-100 text-red-600' },
              { name: 'Growth Rate', value: '+12%', icon: <FiBarChart2 size={20} />, color: 'bg-blue-100 text-blue-600' },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Active crops */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Active Crops</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {[
                  { name: 'Rice', variety: 'Basmati', status: 'Growing', progress: 65, daysLeft: 35 },
                  { name: 'Wheat', variety: 'Common', status: 'Growing', progress: 40, daysLeft: 60 },
                  { name: 'Tomatoes', variety: 'Cherry', status: 'Harvesting', progress: 92, daysLeft: 7 },
                ].map((crop, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{crop.name}</h3>
                        <p className="text-sm text-gray-500">{crop.variety}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        crop.status === 'Harvesting' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {crop.status}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${crop.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{crop.daysLeft} days left</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Recent activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {[
                  { action: 'Fertilizer Applied', crop: 'Rice', timestamp: '2 hours ago', icon: '💧' },
                  { action: 'New Disease Alert', crop: 'Tomatoes', timestamp: '1 day ago', icon: '⚠️' },
                  { action: 'Harvested', crop: 'Potatoes', timestamp: '3 days ago', icon: '🧺' },
                  { action: 'Water Schedule Updated', crop: 'All Crops', timestamp: '1 week ago', icon: '🗓️' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="text-xl">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-500">{activity.crop}</p>
                    </div>
                    <div className="text-xs text-gray-500">{activity.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
