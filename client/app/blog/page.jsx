"use client"
import React, { useState } from 'react';

const modules = [
  {
    id: 1,
    title: "Crop Rotation Fundamentals",
    description: "Learn the basics of crop rotation and how it can improve your soil health and crop yields.",
    duration: "45 minutes",
    tags: ["Agriculture", "Soil Health", "Sustainability"],
    thumbnail: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "Water Management in Dry Seasons",
    description: "Master techniques for water conservation and irrigation during droughts and dry seasons.",
    duration: "60 minutes",
    tags: ["Water Management", "Irrigation", "Environment"],
    thumbnail: "httbps://images.unsplash.com/photo-1559905493-5c95ba47e3c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
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
    blogContent: "Crop rotation is a systematic approach to deciding which crop to plant where and when...",
    tags: ["Agriculture", "Soil Health", "Sustainability"],
  },
  {
    uid: "2",
    blogTitle: "Water Conservation Techniques",
    blogContent: "Water conservation is critical in agriculture, especially in arid regions...",
    tags: ["Water Management", "Irrigation", "Environment"],
  },
  {
    uid: "3",
    blogTitle: "Organic Pest Control",
    blogContent: "Organic pest control methods are eco-friendly and help maintain biodiversity...",
    tags: ["Pest Control", "Organic Farming", "Eco-Friendly"],
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
                    src={placeholderImage} 
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
              <p className="text-gray-600 dark:text-gray-400 text-sm">{activeBlog.blogContent}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
