'use client';
import React, { useState, useEffect } from 'react';
import { FiDroplet, FiSun, FiWind, FiBarChart2 } from 'react-icons/fi';
import { 
  FaTemperatureHigh, FaLeaf, FaSeedling, FaTractor 
} from 'react-icons/fa';

export default function Dashboard() {
  const [mobileView, setMobileView] = useState(false);
  const [detectedLocation, setDetectedLocation] = useState(null); // new state for location
  const [weather, setWeather] = useState(null); // new state for weather data
  
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '6842b47bf3d4489ca93121346252903';

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

  // Request location permission and detect city/state via reverse geocoding
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            console.log("Reverse geocode response:", data);
            const city = data.address.city || data.address.town || data.address.village || "Unknown City";
            const state = data.address.state || "Unknown State";
            const locationDetails = { latitude, longitude, city, state };
            setDetectedLocation(locationDetails);
            // Store both the parsed location details and the entire response for later use (e.g., weather integration)
            localStorage.setItem('detectedLocation', JSON.stringify({
              ...locationDetails,
              fullResponse: data
            }));
            console.log("Location details stored in localStorage:", { ...locationDetails, fullResponse: data });
          } catch (err) {
            console.error("Failed to reverse geocode:", err);
          }
        },
        (error) => {
          console.error("Location permission denied or error occurred:", error);
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  }, []);

  // Fetch weather when location is detected using WeatherAPI.com
  useEffect(() => {
    if (detectedLocation) {
      const { latitude, longitude } = detectedLocation;
      const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=6842b47bf3d4489ca93121346252903&q=${latitude},${longitude}&aqi=no`;
      fetch(weatherUrl)
        .then(res => res.json())
        .then(data => {
          console.log("Weather API response:", data);
          setWeather({
            temp: data.current.temp_c,
            description: data.current.condition.text,
            icon: data.current.condition.icon,
            city: data.location.name,
            state: data.location.region,
            humidity: data.current.humidity,
            wind: data.current.wind_kph,
            feelsLike: data.current.feelslike_c, // using feels like value instead of high/low
            uv: data.current.uv
          });
        })
        .catch(err => console.error("Failed to fetch weather:", err));
    }
  }, [detectedLocation]);

  // Log detectedLocation whenever it changes
  useEffect(() => {
    if (detectedLocation) {
      console.log("Updated detectedLocation state:", detectedLocation);
    }
  }, [detectedLocation]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main content */}
      <main className="flex-1 p-4 md:p-6">
        <div className="w-full">
          {/* Page header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            {detectedLocation && (
              <div className="text-sm text-gray-600">
                {detectedLocation.city}, {detectedLocation.state}
              </div>
            )}
          </div>
          
          {/* Weather card */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-md p-4 mb-6 text-white">
            {weather ? (
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Weather Today</h2>
                  <p className="text-green-100">{weather.city}, {weather.state}</p>
                  <div className="mt-3 text-3xl font-bold">
                    {Math.round(weather.temp)}°C
                  </div>
                  <p className="text-green-100 capitalize">{weather.description}</p>
                </div>
                <div className="text-7xl">
                  <img 
                    src={weather.icon}
                    alt="weather icon"
                    className="w-16 h-16"
                  />
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Weather Today</h2>
                  <p className="text-green-100">Loading...</p>
                </div>
              </div>
            )}

            {/* Stats grid with dynamic weather data */}
            <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-green-500">
              <div className="text-center">
                <FiDroplet className="mx-auto mb-1" />
                <div className="text-sm">
                  {weather ? `${weather.humidity}%` : '...'}
                </div>
                <div className="text-xs text-green-200">Humidity</div>  
              </div>
              <div className="text-center">
                <FiWind className="mx-auto mb-1" />
                <div className="text-sm">
                  {weather ? `${weather.wind} km/h` : '...'}
                </div>
                <div className="text-xs text-green-200">Wind</div>
              </div>
              <div className="text-center">
                <FaTemperatureHigh className="mx-auto mb-1" />
                <div className="text-sm">
                  {weather ? `${weather.feelsLike}°C` : '...'}
                </div>
                <div className="text-xs text-green-200">Feels Like</div>
              </div>
              <div className="text-center">
                <FiSun className="mx-auto mb-1" />
                <div className="text-sm">
                  {weather ? weather.uv : '...'}
                </div>
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
