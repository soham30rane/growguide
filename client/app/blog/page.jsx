"use client"
import React, { useState } from 'react';
// import ReactMarkDow
import ReactMarkdown from 'react-markdown';

const modules = [
  {
    id: 1,
    title: "Crop Rotation Fundamentals",
    description: "Learn the basics of crop rotation and how it can improve your soil health and crop yields.",
    duration: "45 minutes",
    tags: ["Agriculture", "Soil Health", "Sustainability"],
    thumbnail: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    id: 2,
    title: "Water Management in Dry Seasons",
    description: "Master techniques for water conservation and irrigation during droughts and dry seasons.",
    duration: "60 minutes",
    tags: ["Water Management", "Irrigation", "Environment"],
    thumbnail: "https://cdn.wikifarmer.com/images/detailed/2024/06/Untitled-design-24.jpg",
  },
  {
    id: 3,
    title: "Organic Pest Control Methods",
    description: "Discover eco-friendly approaches to manage pests without synthetic chemicals.",
    duration: "50 minutes",
    tags: ["Pest Control", "Organic Farming", "Eco-Friendly"],
    thumbnail: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    title: "Soil Health Assessment",
    description: "Learn how to test and evaluate your soil's health and nutrient content using simple methods.",
    duration: "35 minutes",
    tags: ["Pest Control", "Organic Farming", "Eco-Friendly"],
    thumbnail: "https://images.unsplash.com/photo-1618681317438-a8dd7da06cd4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
  },
];

const placeholderImage = "https://via.placeholder.com/400";

const blogs = [
  {
    uid: "1",
    blogTitle: "Understanding Crop Rotation",
    blogContent: `# Understanding Crop Rotation: A Key to Sustainable Farming

Crop rotation is a time-tested agricultural practice where different crops are grown sequentially on the same land. This method enhances soil health, reduces pest infestations, and improves overall crop yield. Whether you're a seasoned farmer or just starting in agriculture, understanding crop rotation is essential for sustainable farming.

## What is Crop Rotation?

Crop rotation involves changing the type of crops grown in a particular field each season or year. Instead of planting the same crop repeatedly (monoculture), farmers switch between different crop families to maintain soil fertility and minimize pest and disease cycles.

### Example Crop Rotation Cycle:
1. **Legumes (e.g., beans, peas)**: Fix nitrogen in the soil, enriching it.
2. **Leafy Crops (e.g., lettuce, spinach)**: Utilize the nitrogen left by legumes.
3. **Root Crops (e.g., carrots, potatoes)**: Break up compacted soil and reduce weed growth.
4. **Grains (e.g., wheat, corn)**: Help maintain soil structure and reduce erosion.

## Benefits of Crop Rotation

### 1. Improved Soil Fertility
Certain crops, such as legumes, can naturally fix nitrogen from the air into the soil. By rotating crops, you replenish essential nutrients and reduce the need for chemical fertilizers.

### 2. Pest and Disease Control
Pests and pathogens often target specific plant species. Rotating crops disrupts their life cycles, reducing their population and minimizing crop damage without heavy pesticide use.

### 3. Weed Management
Different crops have varying growth habits that suppress weed growth. For instance, dense cover crops like clover outcompete weeds, making the field easier to manage.

### 4. Enhanced Soil Structure
Root systems vary in depth and density. Deep-rooted crops like alfalfa break up compacted soil layers, improving aeration and water retention.

### 5. Increased Yield and Profitability
Healthier soil and reduced pest pressure lead to better crop yields and lower input costs, improving a farm's economic sustainability.

## How to Implement Crop Rotation

1. **Plan Your Crop Sequence**: Divide crops into categories (e.g., legumes, roots, leafy greens, cereals) and create a rotational plan.

2. **Understand Your Soil Needs**: Conduct soil tests to identify nutrient levels and deficiencies, adjusting your rotation to address them.

3. **Monitor and Adapt**: Keep detailed records of what you plant and observe changes in soil health and pest activity to refine your rotation plan over time.

4. **Incorporate Cover Crops**: Use cover crops like clover or rye during fallow periods to maintain soil cover and enrich organic matter.

## Conclusion

Crop rotation is a cornerstone of sustainable agriculture, offering environmental, economic, and agronomic benefits. By understanding and implementing this practice, farmers can protect their land, reduce input costs, and achieve long-term productivity. Whether you're managing a small garden or a large-scale farm, crop rotation is a powerful tool for cultivating a healthier agricultural system.`,
    tags: ["Agriculture", "Soil Health", "Sustainability"],
    thumbnail: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
  },
  {
    uid: "2",
    blogTitle: "Water Conservation Techniques",
    blogContent: `**Water Conservation Techniques: A Guide to Sustainable Living**

Water is one of the most precious natural resources, yet it is often wasted in everyday activities. With increasing water scarcity around the world, adopting water conservation techniques is crucial to ensuring a sustainable future. Here are some practical and effective ways to conserve water at home, in agriculture, and in industries.

### **1. Water Conservation at Home**

#### **a. Fix Leaks**
Even small leaks can waste gallons of water daily. Regularly inspect your plumbing, faucets, and toilets for leaks and fix them promptly.

#### **b. Use Water-Efficient Appliances**
Switch to water-saving appliances such as low-flow showerheads, dual-flush toilets, and energy-efficient washing machines.

#### **c. Turn Off Taps When Not in Use**
Simple habits like turning off the tap while brushing your teeth or washing dishes can save significant amounts of water.

#### **d. Collect and Reuse Water**
Use rainwater harvesting systems to collect rainwater for gardening and cleaning purposes. Additionally, reusing greywater (from sinks and showers) can help reduce overall water consumption.

### **2. Water Conservation in Agriculture**

#### **a. Drip Irrigation**
This method delivers water directly to the roots of plants, minimizing evaporation and reducing water wastage.

#### **b. Mulching**
Applying mulch around plants helps retain soil moisture, reducing the need for frequent watering.

#### **c. Opt for Drought-Resistant Crops**
Growing crops that require less water can significantly cut down water usage in farming.

#### **d. Scheduled Irrigation**
Watering plants during cooler times of the day (early morning or late evening) prevents excessive evaporation.

### **3. Water Conservation in Industries**

#### **a. Water Recycling Systems**
Industries can implement water recycling techniques to treat and reuse wastewater for various processes.

#### **b. Efficient Cooling Systems**
Using closed-loop cooling systems reduces the amount of water required for industrial operations.

#### **c. Employee Awareness Programs**
Educating employees about water conservation practices can lead to more mindful usage in workplaces.

### **Conclusion**

Water conservation is a shared responsibility that requires collective efforts from individuals, farmers, and industries. By adopting these simple yet effective water-saving techniques, we can contribute to a sustainable and water-secure future. Every drop saved today ensures water availability for generations to come. Start conserving water today and make a difference!

`,
    tags: ["Water Management", "Irrigation", "Environment"],
    thumbnail: "https://cdn.wikifarmer.com/images/detailed/2024/06/Untitled-design-24.jpg",
  },
  {
    uid: "3",
    blogTitle: "Organic Pest Control",
    blogContent: "Organic pest control methods are eco-friendly and help maintain biodiversity...",
    tags: ["Pest Control", "Organic Farming", "Eco-Friendly"],
    thumbnail: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
  },
];

const LearningModulesPage = () => {
  const [activeModule, setActiveModule] = useState(null);
  const [activeTab, setActiveTab] = useState('content');

  const handleModuleSelect = (module) => {
    setActiveModule(module);
    setActiveTab('content');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-emerald-100 p-6 dark:from-[#1e3b2f] dark:via-[#1e3b2f] dark:to-[#1e3b2f]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300">
          Interactive Learning Modules
        </h1>
        
        {!activeModule ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div 
                key={module.id} 
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={module.thumbnail} 
                    alt={module.title} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                      {module.level}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {module.duration}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{module.title}</h3>
                  
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => setActiveModule(null)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  <i className="fas fa-arrow-left mr-2"></i> Back to Modules
                </button>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Module {activeModule.id} of {modules.length}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mt-3">{activeModule.title}</h2>
              <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="mr-4">
                  <i className="fas fa-clock mr-1"></i> {activeModule.duration}
                </span>
                    {activeModule.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
              </div>
            </div>
            
            <div className="p-6">
              {activeTab === 'content' && (
                <div>
                  <div className="prose max-w-none dark:prose-invert prose-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{activeModule.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const BlogPage = () => {
  const [activeBlog, setActiveBlog] = useState(null);

  const handleBlogSelect = (blog) => {
    setActiveBlog(blog);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-lime-50 to-emerald-100 p-6 dark:from-[#1e3b2f] dark:via-[#1e3b2f] dark:to-[#1e3b2f]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent dark:from-green-400 dark:to-emerald-300">
          Blog Posts
        </h1>
        {!activeBlog ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div 
                key={blog.uid} 
                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={blog.thumbnail} // Changed from placeholderImage to blog.thumbnail
                    alt={blog.blogTitle} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{blog.blogTitle}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {blog.blogContent.length > 100 ? `${blog.blogContent.slice(0, 100)}...` : blog.blogContent}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleBlogSelect(blog)}
                    className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-300"
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <button 
                onClick={() => setActiveBlog(null)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-4"
              >
                <i className="fas fa-arrow-left mr-2"></i> Back to Blogs
              </button>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{activeBlog.blogTitle}</h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {activeBlog.tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {/* {activeBlog.blogContent} */}
                <ReactMarkdown>{activeBlog.blogContent}</ReactMarkdown>
                </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
