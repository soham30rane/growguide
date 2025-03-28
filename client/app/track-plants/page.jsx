'use client';
import React, { useState, useEffect } from 'react';
import { FiPlus, FiCalendar, FiDroplet, FiSun, FiInfo, FiRefreshCw } from 'react-icons/fi';
import { FaSeedling, FaLeaf, FaAppleAlt } from 'react-icons/fa';
import { generate_output } from '../../lib/groq-service';
import marked from './marked';

// Dummy data for plant growth plans
const plantGrowthPlans = [
  {
    id: 1,
    name: 'Tomato',
    variety: 'Roma',
    image: '🍅',
    difficulty: 'Medium',
    harvestTime: '80-90 days',
    stages: [
      { name: 'Seed', duration: '7-14 days', care: 'Keep soil moist, 70-80°F' },
      { name: 'Seedling', duration: '15-30 days', care: 'Provide 6-8 hours of light' },
      { name: 'Vegetative', duration: '30-50 days', care: 'Regular watering, support stems' },
      { name: 'Flowering', duration: '50-70 days', care: 'Reduce nitrogen, increase potassium' },
      { name: 'Fruiting', duration: '70-90 days', care: 'Consistent water, watch for pests' },
    ]
  },
  {
    id: 2,
    name: 'Basil',
    variety: 'Sweet Basil',
    image: '🌿',
    difficulty: 'Easy',
    harvestTime: '50-60 days',
    stages: [
      { name: 'Seed', duration: '5-10 days', care: 'Warm soil, light covering' },
      { name: 'Seedling', duration: '10-20 days', care: 'Bright indirect light' },
      { name: 'Vegetative', duration: '20-40 days', care: 'Regular pruning, moderate water' },
      { name: 'Mature', duration: '40-60 days', care: 'Harvest outer leaves regularly' },
    ]
  },
  {
    id: 3,
    name: 'Pepper',
    variety: 'Bell Pepper',
    image: '🫑',
    difficulty: 'Medium',
    harvestTime: '90-100 days',
    stages: [
      { name: 'Seed', duration: '7-14 days', care: 'Warm soil (80-90°F)' },
      { name: 'Seedling', duration: '14-35 days', care: 'Bright light, avoid overwatering' },
      { name: 'Vegetative', duration: '35-60 days', care: 'Support stems, consistent watering' },
      { name: 'Flowering', duration: '60-80 days', care: 'Avoid high nitrogen fertilizers' },
      { name: 'Fruiting', duration: '80-100 days', care: 'Consistent moisture, calcium supplement' },
    ]
  },
  {
    id: 4,
    name: 'Lettuce',
    variety: 'Butterhead',
    image: '🥬',
    difficulty: 'Easy',
    harvestTime: '45-55 days',
    stages: [
      { name: 'Seed', duration: '2-8 days', care: 'Shallow planting, light soil' },
      { name: 'Seedling', duration: '8-20 days', care: 'Keep soil moist, moderate light' },
      { name: 'Leaf development', duration: '20-40 days', care: 'Regular light watering' },
      { name: 'Head formation', duration: '40-55 days', care: 'Protect from heat, harvest before bolting' },
    ]
  },
  {
    id: 5,
    name: 'Cucumber',
    variety: 'English',
    image: '🥒',
    difficulty: 'Medium',
    harvestTime: '55-65 days',
    stages: [
      { name: 'Seed', duration: '3-10 days', care: 'Warm soil, adequate moisture' },
      { name: 'Seedling', duration: '10-20 days', care: 'Full sun, regular watering' },
      { name: 'Vegetative', duration: '20-35 days', care: 'Trellising, consistent water' },
      { name: 'Flowering', duration: '35-45 days', care: 'Avoid wetting foliage, bee friendly' },
      { name: 'Fruiting', duration: '45-65 days', care: 'Even moisture, harvest frequently' },
    ]
  }
];

// Dummy data for user's tracked plants
const initialTrackedPlants = [
  {
    id: 101,
    plantId: 1,
    name: 'Tomato',
    variety: 'Roma',
    image: '🍅',
    startDate: '2024-06-10',
    currentStage: 3,
    progress: 65,
    notes: 'Growing well, some yellow leaves on bottom',
    tasks: [
      { id: 1, name: 'Water deeply', frequency: 'Every 2 days', lastDone: '2024-08-05' },
      { id: 2, name: 'Apply fertilizer', frequency: 'Every 2 weeks', lastDone: '2024-07-28' },
    ]
  },
  {
    id: 102,
    plantId: 2,
    name: 'Basil',
    variety: 'Sweet Basil',
    image: '🌿',
    startDate: '2024-07-05',
    currentStage: 2,
    progress: 80,
    notes: 'Growing fast, harvested twice already',
    tasks: [
      { id: 1, name: 'Water lightly', frequency: 'Every 2 days', lastDone: '2024-08-04' },
      { id: 2, name: 'Pinch top leaves', frequency: 'Weekly', lastDone: '2024-08-01' },
    ]
  }
];

export default function TrackPlants() {
  const [trackedPlants, setTrackedPlants] = useState(initialTrackedPlants);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [growthTips, setGrowthTips] = useState({});
  const [loadingTips, setLoadingTips] = useState(false);
  
  // Function to add a new plant to tracking
  const addPlantToTracking = (plantPlan) => {
    const newPlant = {
      id: Date.now(),
      plantId: plantPlan.id,
      name: plantPlan.name,
      variety: plantPlan.variety,
      image: plantPlan.image,
      startDate: new Date().toISOString().split('T')[0],
      currentStage: 0,
      progress: 0,
      notes: '',
      tasks: [
        { id: 1, name: 'Water regularly', frequency: 'As needed', lastDone: new Date().toISOString().split('T')[0] },
      ]
    };
    
    const updatedPlants = [...trackedPlants, newPlant];
    setTrackedPlants(updatedPlants);
    
    // Calculate initial progress
    calculateProgressForAllPlants(updatedPlants);
    
    setShowAddModal(false);
  };
  
  // Automatically calculate progress based on start date
  useEffect(() => {
    calculateProgressForAllPlants(trackedPlants);
    
    // Set up a daily progress update (every 24 hours)
    const intervalId = setInterval(() => {
      calculateProgressForAllPlants(trackedPlants);
    }, 86400000); // 24 hours
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Calculate progress for all plants
  const calculateProgressForAllPlants = (plants) => {
    const updatedPlants = plants.map(plant => {
      const { progress, stage } = calculatePlantProgress(plant);
      return {
        ...plant,
        progress,
        currentStage: stage
      };
    });
    
    setTrackedPlants(updatedPlants);
  };
  
  // Calculate plant progress based on start date and expected duration
  const calculatePlantProgress = (plant) => {
    const growthPlan = plantGrowthPlans.find(p => p.id === plant.plantId);
    const startDate = new Date(plant.startDate);
    const today = new Date();
    
    // Calculate total days for full growth cycle
    let totalDaysToGrow = 0;
    
    // Extract the maximum days from the harvest time range (e.g., "80-90 days" -> 90)
    const harvestTimeMatch = growthPlan.harvestTime.match(/(\d+)-(\d+)/);
    if (harvestTimeMatch && harvestTimeMatch[2]) {
      totalDaysToGrow = parseInt(harvestTimeMatch[2]);
    } else {
      // Fallback: sum up the maximum days from each stage's duration
      growthPlan.stages.forEach(stage => {
        const durationMatch = stage.duration.match(/(\d+)-(\d+)/);
        if (durationMatch && durationMatch[2]) {
          totalDaysToGrow += parseInt(durationMatch[2]);
        } else {
          // If no range, try to extract a single number
          const singleNumber = stage.duration.match(/(\d+)/);
          if (singleNumber && singleNumber[1]) {
            totalDaysToGrow += parseInt(singleNumber[1]);
          }
        }
      });
    }
    
    // Calculate days elapsed
    const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    // Calculate progress percentage
    let progress = Math.min(Math.round((daysElapsed / totalDaysToGrow) * 100), 100);
    
    // Determine current stage based on progress
    const stageCount = growthPlan.stages.length;
    const stage = Math.min(Math.floor((progress / 100) * stageCount), stageCount - 1);
    
    return { progress, stage };
  };
  
  // Generate tips using LLM for current growth stage
  const generateTipsForStage = async (plant) => {
    if (!plant) return;
    
    const plantId = plant.id;
    const growthPlan = plantGrowthPlans.find(p => p.id === plant.plantId);
    const currentStageName = growthPlan.stages[plant.currentStage].name;
    
    setLoadingTips(true);
    
    try {
      const prompt = `You are an expert gardener. Generate specific care tips for ${plant.name} (${plant.variety}) 
        that is currently in the ${currentStageName} stage of growth.
        
        Focus on:
        1. Watering needs at this specific growth stage
        2. Light requirements
        3. Nutrient/fertilization recommendations
        4. Common issues to watch for at this stage and how to prevent them
        5. Any special care techniques appropriate for this stage
        
        Format your response in markdown with clear headings and bullet points.
        Be specific to this plant variety and growth stage. Keep your response concise but comprehensive.`;
        
      const tips = await generate_output(prompt);
      
      setGrowthTips(prevTips => ({
        ...prevTips,
        [plantId]: tips
      }));
    } catch (error) {
      console.error("Error generating tips:", error);
    } finally {
      setLoadingTips(false);
    }
  };
  
  // When a plant is selected, generate tips if they don't exist yet
  useEffect(() => {
    if (selectedPlant && !growthTips[selectedPlant.id]) {
      generateTipsForStage(selectedPlant);
    }
  }, [selectedPlant]);
  
  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate days remaining until harvest
  const calculateDaysRemaining = (plant) => {
    const growthPlan = plantGrowthPlans.find(p => p.id === plant.plantId);
    
    // Extract the maximum days from the harvest time range
    const harvestTimeMatch = growthPlan.harvestTime.match(/(\d+)-(\d+)/);
    if (!harvestTimeMatch) return "Unknown";
    
    const totalDaysToGrow = parseInt(harvestTimeMatch[2]);
    const startDate = new Date(plant.startDate);
    const today = new Date();
    const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    const daysRemaining = Math.max(0, totalDaysToGrow - daysElapsed);
    return daysRemaining;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <main className="flex-1 p-4 md:p-6">
        <div className="w-full">
          {/* Page header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Plant Tracker</h1>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <FiPlus className="mr-2" /> Add Plant
            </button>
          </div>
          
          {/* Your tracked plants */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Your Plants</h2>
              <p className="text-sm text-gray-500">Track the growth and care of your plants</p>
            </div>
            
            {trackedPlants.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-3">🌱</div>
                <h3 className="text-lg font-medium text-gray-800 mb-1">No plants yet</h3>
                <p className="text-gray-500 mb-4">Start tracking your plants by adding one to your garden.</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-flex items-center"
                >
                  <FiPlus className="mr-2" /> Add Your First Plant
                </button>
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trackedPlants.map((plant) => {
                  const growthPlan = plantGrowthPlans.find(p => p.id === plant.plantId);
                  const currentStageInfo = growthPlan.stages[plant.currentStage];
                  const daysRemaining = calculateDaysRemaining(plant);
                  
                  return (
                    <div key={plant.id} 
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedPlant(plant)}
                    >
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center">
                          <div className="text-3xl mr-3">{plant.image}</div>
                          <div>
                            <h3 className="font-medium text-gray-900">{plant.name}</h3>
                            <p className="text-sm text-gray-500">{plant.variety}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Growth Progress</span>
                          <span>{plant.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${plant.progress}%` }}
                          ></div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <FaSeedling className="text-green-600 mr-2" />
                            <span className="text-gray-700">Stage: {currentStageInfo.name}</span>
                          </div>
                          <div className="flex items-center">
                            <FiCalendar className="text-green-600 mr-2" />
                            <span className="text-gray-700">Started: {formatDate(plant.startDate)}</span>
                          </div>
                          {daysRemaining > 0 && (
                            <div className="flex items-center">
                              <FaAppleAlt className="text-green-600 mr-2" />
                              <span className="text-gray-700">Days to harvest: ~{daysRemaining}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Plant details modal */}
          {selectedPlant && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="text-4xl mr-3">{selectedPlant.image}</div>
                    <div>
                      <h2 className="text-xl font-semibold">{selectedPlant.name}</h2>
                      <p className="text-gray-500">{selectedPlant.variety}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedPlant(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="p-4">
                  {/* Growth stages visualization */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Growth Journey</h3>
                    
                    <div className="relative mb-6">
                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${selectedPlant.progress}%` }}
                        ></div>
                      </div>
                      
                      {/* Stage markers */}
                      <div className="flex justify-between">
                        {plantGrowthPlans.find(p => p.id === selectedPlant.plantId).stages.map((stage, index) => {
                          const isCurrentOrPast = index <= selectedPlant.currentStage;
                          return (
                            <div key={index} className="text-center flex-1">
                              <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${
                                isCurrentOrPast ? 'bg-green-600' : 'bg-gray-300'
                              }`}></div>
                              <div className={`text-xs font-medium ${
                                isCurrentOrPast ? 'text-green-600' : 'text-gray-500'
                              }`}>{stage.name}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Current stage details */}
                    <div className="bg-green-50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-green-800 mb-2">Current Stage: {
                          plantGrowthPlans.find(p => p.id === selectedPlant.plantId).stages[selectedPlant.currentStage].name
                        }</h4>
                        <div className="text-right text-sm text-green-700">
                          {selectedPlant.progress}% Complete
                        </div>
                      </div>
                      <p className="text-green-700 text-sm">{
                        plantGrowthPlans.find(p => p.id === selectedPlant.plantId).stages[selectedPlant.currentStage].care
                      }</p>
                    </div>
                    
                    {/* AI-Generated Care Tips */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-900">AI-Generated Care Tips</h3>
                        <button 
                          onClick={() => generateTipsForStage(selectedPlant)}
                          className="text-green-600 hover:text-green-700 flex items-center text-sm"
                          disabled={loadingTips}
                        >
                          <FiRefreshCw className={`mr-1 ${loadingTips ? 'animate-spin' : ''}`} /> 
                          Refresh Tips
                        </button>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 prose prose-sm max-w-none">
                        {loadingTips && selectedPlant && !growthTips[selectedPlant.id] ? (
                          <div className="flex justify-center items-center py-8">
                            <div className="animate-pulse flex flex-col items-center">
                              <div className="h-8 w-8 mb-4">
                                <FiRefreshCw className="animate-spin text-green-600 h-8 w-8" />
                              </div>
                              <p className="text-gray-500">Generating expert care tips...</p>
                            </div>
                          </div>
                        ) : selectedPlant && growthTips[selectedPlant.id] ? (
                          <div dangerouslySetInnerHTML={{ 
                            __html: marked && typeof marked.parse === 'function' 
                              ? marked.parse(growthTips[selectedPlant.id] || '') 
                              : growthTips[selectedPlant.id] || ''
                          }} />
                        ) : (
                          <p className="text-gray-500">No care tips available. Click "Refresh Tips" to generate recommendations.</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Notes section */}
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-900 mb-2">Notes</h3>
                      <textarea 
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                        rows="3"
                        placeholder="Add notes about your plant..."
                        value={selectedPlant.notes}
                        onChange={(e) => {
                          const updatedPlants = trackedPlants.map(plant => 
                            plant.id === selectedPlant.id 
                              ? { ...plant, notes: e.target.value } 
                              : plant
                          );
                          setTrackedPlants(updatedPlants);
                          setSelectedPlant({...selectedPlant, notes: e.target.value});
                        }}
                      ></textarea>
                    </div>
                    
                    {/* Care tasks */}
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Care Tasks</h3>
                      <div className="space-y-2">
                        {selectedPlant.tasks.map(task => (
                          <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">{task.name}</p>
                              <p className="text-xs text-gray-500">{task.frequency}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                              Last done: {formatDate(task.lastDone)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Add plant modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Add a Plant to Track</h2>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plantGrowthPlans.map(plant => (
                      <div 
                        key={plant.id} 
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => addPlantToTracking(plant)}
                      >
                        <div className="p-4 flex items-center">
                          <div className="text-4xl mr-3">{plant.image}</div>
                          <div>
                            <h3 className="font-medium text-gray-900">{plant.name}</h3>
                            <p className="text-sm text-gray-500">{plant.variety}</p>
                          </div>
                        </div>
                        
                        <div className="px-4 pb-4">
                          <div className="flex items-center mb-2">
                            <div className={`px-2 py-1 rounded-full text-xs ${
                              plant.difficulty === 'Easy' 
                                ? 'bg-green-100 text-green-800' 
                                : plant.difficulty === 'Medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {plant.difficulty}
                            </div>
                            <div className="text-gray-500 text-xs ml-2">
                              Harvest: {plant.harvestTime}
                            </div>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            {plant.stages.length} growth stages
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}